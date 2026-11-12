import AsyncStorage from '@react-native-async-storage/async-storage';

const DATAMUSE_SUG_ENDPOINT = 'https://api.datamuse.com/sug';
const WORD_CACHE_STORAGE_KEY = '@shopkeeper_item_word_cache_v1';
const MAX_PERSISTED_WORDS = 600;
const MAX_QUERY_CACHE_ENTRIES = 80;
const REQUEST_TIMEOUT_MS = 2500;

interface DatamuseWordItem {
  word?: string;
  score?: number;
}

const SEED_COMMON_WORDS: string[] = [
  'Sugar',
  'Milk',
  'Bread',
  'Eggs',
  'Tea',
  'Cooking Oil',
  'Basmati Rice',
  'Wheat Flour',
  'Biscuit',
  'Cold Drink',
  'Mineral Water',
  'Soap',
  'Shampoo',
  'Salt',
  'Spices',
  'Ghee',
  'Butter',
  'Yogurt',
  'Chips',
  'Chocolate',
  'Candy',
  'Coffee',
  'Juice',
  'Cake',
  'Detergent',
  'Toothpaste',
  'Tissue',
  'Matchbox',
  'Noodles',
  'Samosa',
  'Chai',
  'Roti',
  'Daal',
  'Atta',
  'Shopping Bag',
];

let persistedWords: string[] = [...SEED_COMMON_WORDS];
let hydrationPromise: Promise<void> | null = null;
let persistTimer: ReturnType<typeof setTimeout> | null = null;
const apiQueryCache = new Map<string, string[]>();

export function toTitleCase(phrase: string): string {
  return phrase
    .trim()
    .split(/\s+/)
    .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : ''))
    .join(' ');
}

function schedulePersistWords(): void {
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    persistTimer = null;
    AsyncStorage.setItem(
      WORD_CACHE_STORAGE_KEY,
      JSON.stringify(persistedWords)
    ).catch(() => {});
  }, 300);
}

/**
 * Loads cached words from AsyncStorage into memory once on app load so local lookup is 0ms.
 */
export function hydrateWordCache(): Promise<void> {
  if (hydrationPromise) return hydrationPromise;
  hydrationPromise = (async () => {
    try {
      const raw = await AsyncStorage.getItem(WORD_CACHE_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;

      const seen = new Set<string>();
      const merged: string[] = [];

      for (const item of [...parsed, ...SEED_COMMON_WORDS]) {
        if (typeof item !== 'string') continue;
        const formatted = toTitleCase(item);
        const key = formatted.toLowerCase();
        if (!formatted || seen.has(key)) continue;
        seen.add(key);
        merged.push(formatted);
        if (merged.length >= MAX_PERSISTED_WORDS) break;
      }

      if (merged.length > 0) {
        persistedWords = merged;
      }
    } catch {
      // Fall back safely to seed words in memory
    }
  })();
  return hydrationPromise;
}

/**
 * Merges newly used custom item names or Datamuse results into the persistent local cache.
 */
export function rememberWords(words: string[]): void {
  if (!Array.isArray(words) || words.length === 0) return;

  const incoming: string[] = [];
  const incomingKeys = new Set<string>();

  for (const w of words) {
    if (typeof w !== 'string') continue;
    const formatted = toTitleCase(w);
    const key = formatted.toLowerCase();
    if (formatted.length < 2 || incomingKeys.has(key)) continue;
    incomingKeys.add(key);
    incoming.push(formatted);
  }

  if (incoming.length === 0) return;

  const next = [
    ...incoming,
    ...persistedWords.filter((existing) => !incomingKeys.has(existing.toLowerCase())),
  ].slice(0, MAX_PERSISTED_WORDS);

  persistedWords = next;
  schedulePersistWords();
}

/**
 * Returns top cached / recently used item words when the search box is still empty.
 */
export function getRecentCachedWords(limit = 7): string[] {
  return persistedWords.slice(0, limit);
}

/**
 * Synchronous local-first search against cached Datamuse results, saved custom names, and seeds.
 */
export function searchLocalWords(query: string, limit = 6): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const prefixMatches: string[] = [];
  const containsMatches: string[] = [];

  for (const word of persistedWords) {
    const lower = word.toLowerCase();
    if (lower === q) continue;
    if (lower.startsWith(q)) {
      prefixMatches.push(word);
    } else if (lower.includes(q)) {
      containsMatches.push(word);
    }
  }

  return [...prefixMatches, ...containsMatches].slice(0, limit);
}

/**
 * Queries Datamuse autocomplete (/sug) for item name suggestions and caches results locally.
 * Fails silently offline or on timeout and returns an empty list so billing never blocks.
 */
export async function fetchDatamuseSuggestions(
  query: string,
  externalSignal?: AbortSignal,
  limit = 6
): Promise<string[]> {
  const normalized = query.trim().toLowerCase();
  if (normalized.length < 2) return [];

  const cached = apiQueryCache.get(normalized);
  if (cached) return cached;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  const onExternalAbort = () => controller.abort();
  if (externalSignal) {
    if (externalSignal.aborted) {
      clearTimeout(timeoutId);
      return [];
    }
    externalSignal.addEventListener('abort', onExternalAbort, { once: true });
  }

  try {
    const url = `${DATAMUSE_SUG_ENDPOINT}?s=${encodeURIComponent(normalized)}&max=${limit}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    if (!res.ok) return [];

    const data = (await res.json()) as DatamuseWordItem[];
    if (!Array.isArray(data)) return [];

    const seen = new Set<string>();
    const results: string[] = [];

    for (const entry of data) {
      const raw = typeof entry?.word === 'string' ? entry.word.trim() : '';
      if (!raw) continue;
      const formatted = toTitleCase(raw);
      const dedupeKey = formatted.toLowerCase();
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
      results.push(formatted);
      if (results.length >= limit) break;
    }

    if (apiQueryCache.size >= MAX_QUERY_CACHE_ENTRIES) {
      const oldestKey = apiQueryCache.keys().next().value;
      if (oldestKey !== undefined) {
        apiQueryCache.delete(oldestKey);
      }
    }
    apiQueryCache.set(normalized, results);

    if (results.length > 0) {
      rememberWords(results);
    }

    return results;
  } catch {
    // Offline, network error, or aborted request: silently keep local results
    return [];
  } finally {
    clearTimeout(timeoutId);
    externalSignal?.removeEventListener('abort', onExternalAbort);
  }
}
