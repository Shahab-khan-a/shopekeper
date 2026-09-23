import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DB_NAME = 'ShopkeeperImageCache_v1';
const STORE_NAME = 'cached_images';

let idbPromise: Promise<IDBDatabase | null> | null = null;
const memoryCache = new Map<string, string>();

function openImageDb(): Promise<IDBDatabase | null> {
  if (Platform.OS !== 'web' || typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }

  if (!idbPromise) {
    idbPromise = new Promise((resolve) => {
      try {
        const req = window.indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = (e: any) => {
          const db = e.target.result as IDBDatabase;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        };
        req.onsuccess = (e: any) => {
          resolve(e.target.result as IDBDatabase);
        };
        req.onerror = () => {
          resolve(null);
        };
      } catch {
        resolve(null);
      }
    });
  }

  return idbPromise;
}

export const ImageCacheService = {
  /**
   * Get cached image URI (blob URL or data URI) by key / fileId
   */
  async get(key: string): Promise<string | null> {
    if (!key) return null;

    // Check memory cache first
    if (memoryCache.has(key)) {
      return memoryCache.get(key)!;
    }

    // Check IndexedDB on Web
    if (Platform.OS === 'web') {
      try {
        const db = await openImageDb();
        if (db) {
          const val = await new Promise<string | null>((resolve) => {
            try {
              const tx = db.transaction(STORE_NAME, 'readonly');
              const store = tx.objectStore(STORE_NAME);
              const req = store.get(key);
              req.onsuccess = () => {
                resolve(req.result || null);
              };
              req.onerror = () => resolve(null);
            } catch {
              resolve(null);
            }
          });

          if (val) {
            memoryCache.set(key, val);
            return val;
          }
        }
      } catch {}
    }

    // Check AsyncStorage fallback
    try {
      const stored = await AsyncStorage.getItem(`@img_${key}`);
      if (stored) {
        memoryCache.set(key, stored);
        return stored;
      }
    } catch {}

    return null;
  },

  /**
   * Save image data URI or blob URL to cache
   */
  async set(key: string, uri: string): Promise<void> {
    if (!key || !uri) return;

    memoryCache.set(key, uri);

    if (Platform.OS === 'web') {
      try {
        const db = await openImageDb();
        if (db) {
          await new Promise<void>((resolve) => {
            try {
              const tx = db.transaction(STORE_NAME, 'readwrite');
              const store = tx.objectStore(STORE_NAME);
              store.put(uri, key);
              tx.oncomplete = () => resolve();
              tx.onerror = () => resolve();
            } catch {
              resolve();
            }
          });
          return;
        }
      } catch {}
    }

    // Fallback: save to AsyncStorage if small enough
    if (uri.length < 300000) {
      try {
        await AsyncStorage.setItem(`@img_${key}`, uri);
      } catch {}
    }
  },

  /**
   * Remove cached image
   */
  async delete(key: string): Promise<void> {
    memoryCache.delete(key);
    if (Platform.OS === 'web') {
      try {
        const db = await openImageDb();
        if (db) {
          const tx = db.transaction(STORE_NAME, 'readwrite');
          tx.objectStore(STORE_NAME).delete(key);
        }
      } catch {}
    }
    try {
      await AsyncStorage.removeItem(`@img_${key}`);
    } catch {}
  },
};
