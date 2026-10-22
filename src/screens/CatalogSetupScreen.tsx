import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  BackHandler,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShop } from '@/context/ShopContext';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { MASTER_CATALOG, CatalogShopType, CatalogItem } from '@/data/masterCatalog';
import { CatalogIcon } from '@/components/CatalogIcon';
import { mapCatalogCategory } from '@/components/CatalogImportModal';

interface CatalogSetupScreenProps {
  /**
   * Called when the keeper finishes or skips the setup. Receives how many
   * items were loaded (0 when skipped) so the app can land him on the
   * New Sale tab for his first bill.
   */
  onDone: (loadedCount: number) => void;
}

type Row =
  | { kind: 'header'; key: string; title: string; count: number; selectedCount: number; itemNames: string[] }
  | { kind: 'item'; key: string; name: string; categoryName: string };

const typeItemCount = (t: CatalogShopType) =>
  t.categories.reduce((n, c) => n + c.items.length, 0);

/**
 * First-run shop setup, shown right after sign-in / guest entry (before the
 * main app).
 * Step 1: the keeper picks his shop type (searchable, 26 curated retail types).
 * Step 2: he sees ready-made items with icons & prices. He can "Load All" or
 * tap "Deselect All" to "Select Few".
 * Everything is fully skippable and handles Android back navigation seamlessly.
 */
export const CatalogSetupScreen: React.FC<CatalogSetupScreenProps> = ({ onDone }) => {
  const { settings, updateSettings, products, addProduct, language } = useShop();
  const insets = useSafeAreaInsets();
  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const ur = language === 'ur';

  const [step, setStep] = useState<'type' | 'items'>('type');
  const [chosen, setChosen] = useState<CatalogShopType | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Search queries for both steps
  const [typeSearch, setTypeSearch] = useState('');
  const [itemSearch, setItemSearch] = useState('');

  // Handle hardware back press on Android
  useEffect(() => {
    const onBackPress = () => {
      if (step === 'items') {
        setStep('type');
        setItemSearch('');
        return true;
      }
      return false;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [step]);

  // Filtered shop types for Step 1
  const filteredShopTypes = useMemo(() => {
    const q = typeSearch.trim().toLowerCase();
    if (!q) return MASTER_CATALOG;
    return MASTER_CATALOG.filter(
      (t) =>
        t.shopType.toLowerCase().includes(q) ||
        t.categories.some((c) => c.name.toLowerCase().includes(q))
    );
  }, [typeSearch]);

  const allNames = useMemo(
    () => (chosen ? chosen.categories.flatMap((c) => c.items.map((i) => i.name)) : []),
    [chosen]
  );

  const rows = useMemo<Row[]>(() => {
    if (!chosen) return [];
    const q = itemSearch.trim().toLowerCase();
    const out: Row[] = [];

    for (const cat of chosen.categories) {
      const matchingItems = q
        ? cat.items.filter(
            (i) =>
              i.name.toLowerCase().includes(q) ||
              (i.nameUrdu && i.nameUrdu.includes(q)) ||
              cat.name.toLowerCase().includes(q)
          )
        : cat.items;

      if (matchingItems.length === 0) continue;

      out.push({
        kind: 'header',
        key: `h:${cat.name}`,
        title: cat.name,
        count: matchingItems.length,
        selectedCount: matchingItems.filter((i) => selected.has(i.name)).length,
        itemNames: matchingItems.map((i) => i.name),
      });

      for (const item of matchingItems) {
        out.push({
          kind: 'item',
          key: `i:${cat.name}:${item.name}`,
          name: item.name,
          categoryName: cat.name,
        });
      }
    }
    return out;
  }, [chosen, selected, itemSearch]);

  const itemByName = useMemo(() => {
    const m = new Map<
      string,
      { price: number; unit: string; nameUrdu?: string; categoryName: string; raw: CatalogItem }
    >();
    if (chosen) {
      for (const cat of chosen.categories) {
        for (const item of cat.items) {
          m.set(item.name, {
            price: item.price,
            unit: item.unit,
            nameUrdu: item.nameUrdu,
            categoryName: cat.name,
            raw: item,
          });
        }
      }
    }
    return m;
  }, [chosen]);

  const goToItems = (typeToUse?: CatalogShopType) => {
    const target = typeToUse || chosen;
    if (!target) return;
    setChosen(target);
    const names = target.categories.flatMap((c) => c.items.map((i) => i.name));
    setSelected(new Set(names));
    setItemSearch('');
    Keyboard.dismiss();
    setStep('items');
  };

  const toggleItem = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const toggleCategory = (names: string[], selectAll: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const n of names) {
        if (selectAll) next.add(n);
        else next.delete(n);
      }
      return next;
    });
  };

  const toggleMasterAll = () => {
    if (selected.size === allNames.length) {
      // User tapped Deselect All -> clear selection so they can "select few"
      setSelected(new Set());
    } else {
      // User tapped Select All -> "load all"
      setSelected(new Set(allNames));
    }
  };

  const loadItems = async () => {
    if (!chosen || loading) return;
    setLoading(true);
    let added = 0;
    try {
      const existing = new Set(products.map((p) => p.name.trim().toLowerCase()));
      for (const cat of chosen.categories) {
        for (const item of cat.items) {
          if (!selected.has(item.name)) continue;
          if (existing.has(item.name.trim().toLowerCase())) continue;
          added++;
          await addProduct({
            name: item.name,
            nameUrdu: item.nameUrdu,
            price: item.price,
            stock: 20, // Starter shelf stock so items can immediately be sold on day 1
            category: mapCatalogCategory(cat.name, chosen.shopType),
            unit: item.unit,
            lowStockThreshold: settings.lowStockThreshold || 5,
          });
        }
      }
      await updateSettings({ catalogShopType: chosen.shopType });
    } finally {
      setLoading(false);
    }
    onDone(added);
  };

  const isAllSelected = allNames.length > 0 && selected.size === allNames.length;

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      {/* Top Hero Canopy */}
      <View style={styles.hero}>
        <View style={[styles.heroIcon, { backgroundColor: theme.primary }]}>
          <Ionicons name={step === 'type' ? 'storefront' : 'cube'} size={28} color="#FFFFFF" />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>
          {step === 'type'
            ? ur
              ? 'اپنی دکان کی قسم منتخب کریں'
              : 'Set Up Your Shop'
            : ur
              ? 'اشیاء منتخب کریں'
              : 'Select Your Items'}
        </Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          {step === 'type'
            ? ur
              ? 'آپ کی دکان کس چیز کی ہے؟ قسم منتخب کریں تاکہ تمام اشیاء قیمتوں اور آئیکن کے ساتھ فوری لوڈ ہو جائیں۔'
              : 'What type of shop do you run? Pick your type to automatically load ready-made items, icons, and prices.'
            : ur
              ? 'سب اشیاء لوڈ کریں یا صرف وہ منتخب کریں جو آپ بیچتے ہیں۔ بعد میں بھی تبدیل کر سکتے ہیں۔'
              : 'Load all items or pick just a few that you sell. You can customize them anytime later.'}
        </Text>
        <Text style={[styles.stepLabel, { color: theme.textMuted }]}>
          {ur ? (step === 'type' ? 'مرحلہ 1 از 2' : 'مرحلہ 2 از 2') : step === 'type' ? 'Step 1 of 2' : 'Step 2 of 2'}
        </Text>
      </View>

      {step === 'type' ? (
        <>
          {/* Step 1 Search Bar */}
          <View style={[styles.searchWrap, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Ionicons name="search" size={18} color={theme.textMuted} />
            <TextInput
              value={typeSearch}
              onChangeText={setTypeSearch}
              placeholder={ur ? 'دکان کی قسم تلاش کریں (مثلاً کریانہ، بیکری)...' : 'Search shop type (e.g. Kiryana, Bakery)...'}
              placeholderTextColor={theme.textMuted}
              style={[styles.searchInput, { color: theme.text }]}
              clearButtonMode="while-editing"
            />
            {typeSearch.length > 0 && (
              <Pressable onPress={() => setTypeSearch('')} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color={theme.textMuted} />
              </Pressable>
            )}
          </View>

          <FlatList
            data={filteredShopTypes}
            keyExtractor={(t) => t.shopType}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 16 }}
            renderItem={({ item }) => {
              const isSel = chosen?.shopType === item.shopType;
              return (
                <Pressable
                  onPress={() => setChosen(item)}
                  style={[
                    styles.typeRow,
                    {
                      backgroundColor: isSel
                        ? settings.darkMode
                          ? 'rgba(16,185,129,0.15)'
                          : '#ECFDF5'
                        : theme.surface,
                      borderColor: isSel ? theme.primary : theme.border,
                    },
                    isSel && { borderWidth: 2 },
                  ]}>
                  <CatalogIcon name={item.icon} size={46} />
                  <View style={styles.typeText}>
                    <Text style={[styles.typeName, { color: theme.text }]}>{item.shopType}</Text>
                    <Text style={[styles.typeSub, { color: theme.textMuted }]}>
                      {typeItemCount(item)} {ur ? 'تیار اشیاء آئیکن کے ساتھ' : 'ready-made items with icons'}
                    </Text>
                  </View>
                  {isSel ? (
                    <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
                  ) : (
                    <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
                  )}
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={36} color={theme.textMuted} />
                <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                  {ur ? 'کوئی دکان کی قسم نہیں ملی' : 'No shop types found'}
                </Text>
              </View>
            }
          />

          {/* Step 1 Footer */}
          <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
            <Pressable
              onPress={() => goToItems()}
              disabled={!chosen}
              style={[styles.primaryBtn, { backgroundColor: theme.primary, opacity: chosen ? 1 : 0.5 }]}>
              <Text style={styles.primaryBtnText}>{ur ? 'آگے بڑھیں اور اشیاء دیکھیں' : 'Continue to Items'}</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </Pressable>
            <Pressable onPress={() => onDone(0)} style={styles.skipBtn}>
              <Text style={[styles.skipText, { color: theme.textMuted }]}>
                {ur ? 'ابھی چھوڑیں — بعد میں اشیاء شامل کروں گا' : 'Skip for now — I will add items later'}
              </Text>
            </Pressable>
          </View>
        </>
      ) : (
        <>
          {/* Step 2 Controls & Counter */}
          <View style={[styles.selBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.selLeft}>
              {chosen ? <CatalogIcon name={chosen.icon} size={34} /> : null}
              <View>
                <Text style={[styles.selText, { color: theme.text }]} numberOfLines={1}>
                  {chosen?.shopType}
                </Text>
                <Text style={[styles.selCount, { color: theme.primary }]}>
                  {selected.size} / {allNames.length} {ur ? 'منتخب' : 'selected'}
                </Text>
              </View>
            </View>

            {/* Master Select All / Deselect All Toggle Button */}
            <Pressable
              onPress={toggleMasterAll}
              style={[
                styles.masterToggleBtn,
                {
                  backgroundColor: isAllSelected
                    ? settings.darkMode
                      ? 'rgba(239,68,68,0.15)'
                      : '#FEF2F2'
                    : settings.darkMode
                      ? 'rgba(16,185,129,0.15)'
                      : '#ECFDF5',
                  borderColor: isAllSelected ? '#EF4444' : theme.primary,
                },
              ]}>
              <Ionicons
                name={isAllSelected ? 'close-circle-outline' : 'checkmark-done-outline'}
                size={16}
                color={isAllSelected ? '#EF4444' : theme.primary}
              />
              <Text
                style={[
                  styles.masterToggleText,
                  { color: isAllSelected ? '#EF4444' : theme.primary },
                ]}>
                {isAllSelected
                  ? ur
                    ? 'سب ہٹائیں'
                    : 'Deselect All'
                  : ur
                    ? 'سب منتخب کریں'
                    : 'Select All'}
              </Text>
            </Pressable>
          </View>

          {/* Step 2 Item Search Bar */}
          <View style={[styles.searchWrap, { backgroundColor: theme.surface, borderColor: theme.border, marginBottom: 8 }]}>
            <Ionicons name="search" size={17} color={theme.textMuted} />
            <TextInput
              value={itemSearch}
              onChangeText={setItemSearch}
              placeholder={ur ? 'اشیاء تلاش کریں...' : 'Search items by name or category...'}
              placeholderTextColor={theme.textMuted}
              style={[styles.searchInput, { color: theme.text }]}
              clearButtonMode="while-editing"
            />
            {itemSearch.length > 0 && (
              <Pressable onPress={() => setItemSearch('')} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color={theme.textMuted} />
              </Pressable>
            )}
          </View>

          {/* Step 2 Grouped Items List */}
          <FlatList
            data={rows}
            keyExtractor={(r) => r.key}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 16 }}
            initialNumToRender={20}
            maxToRenderPerBatch={25}
            windowSize={7}
            removeClippedSubviews={true}
            renderItem={({ item: row }) => {
              if (row.kind === 'header') {
                const allSel = row.selectedCount === row.count;
                return (
                  <View style={[styles.catHeader, { backgroundColor: theme.background }]}>
                    <Text style={[styles.catHeaderText, { color: theme.text }]}>{row.title}</Text>
                    <Text style={[styles.catCount, { color: theme.textMuted }]}>
                      {row.selectedCount}/{row.count}
                    </Text>
                    <Pressable
                      onPress={() => toggleCategory(row.itemNames, !allSel)}
                      hitSlop={8}
                      style={[
                        styles.catTogglePill,
                        {
                          backgroundColor: allSel
                            ? settings.darkMode
                              ? 'rgba(255,255,255,0.08)'
                              : '#F1F5F9'
                            : settings.darkMode
                              ? 'rgba(16,185,129,0.15)'
                              : '#ECFDF5',
                        },
                      ]}>
                      <Text style={[styles.catToggle, { color: allSel ? theme.textMuted : theme.primary }]}>
                        {allSel ? (ur ? 'ہٹائیں' : 'None') : ur ? 'سب' : 'All'}
                      </Text>
                    </Pressable>
                  </View>
                );
              }

              const meta = itemByName.get(row.name);
              const isSel = selected.has(row.name);

              return (
                <Pressable
                  onPress={() => toggleItem(row.name)}
                  style={[
                    styles.itemRow,
                    {
                      backgroundColor: isSel
                        ? settings.darkMode
                          ? 'rgba(16,185,129,0.12)'
                          : '#F0FDF4'
                        : theme.surface,
                      borderColor: isSel ? theme.primary : theme.border,
                    },
                  ]}>
                  <View
                    style={[
                      styles.checkbox,
                      {
                        borderColor: isSel ? theme.primary : theme.border,
                        backgroundColor: isSel ? theme.primary : 'transparent',
                      },
                    ]}>
                    {isSel && <Ionicons name="checkmark" size={15} color="#FFFFFF" />}
                  </View>

                  <CatalogIcon name={meta?.raw.icon ?? 'shopping'} size={44} />

                  <View style={styles.itemText}>
                    <Text style={[styles.itemName, { color: theme.text }]} numberOfLines={1}>
                      {row.name}
                    </Text>
                    <Text style={[styles.itemSub, { color: theme.textMuted }]} numberOfLines={1}>
                      {meta?.nameUrdu ? `${meta.nameUrdu} • ` : ''}
                      Rs {meta?.price} / {meta?.unit}
                    </Text>
                  </View>
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={36} color={theme.textMuted} />
                <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                  {ur ? 'کوئی آئٹم نہیں ملا' : 'No items match your search'}
                </Text>
              </View>
            }
          />

          {/* Step 2 Footer */}
          <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
            <Pressable
              onPress={loadItems}
              disabled={loading || selected.size === 0}
              style={[
                styles.primaryBtn,
                {
                  backgroundColor: theme.primary,
                  opacity: loading || selected.size === 0 ? 0.55 : 1,
                },
              ]}>
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="cloud-download-outline" size={19} color="#FFFFFF" />
              )}
              <Text style={styles.primaryBtnText}>
                {loading
                  ? ur
                    ? 'اشیاء شامل ہو رہی ہیں…'
                    : 'Adding items…'
                  : ur
                    ? `میری دکان میں ${selected.size} اشیاء لوڈ کریں`
                    : `Load ${selected.size} items into my shop`}
              </Text>
            </Pressable>

            <View style={styles.footerRow}>
              <Pressable
                onPress={() => {
                  setStep('type');
                  setItemSearch('');
                }}
                disabled={loading}
                style={styles.skipBtn}>
                <Text style={[styles.skipText, { color: theme.primary }]}>
                  {ur ? '← دکان کی قسم بدلیں' : '← Change shop type'}
                </Text>
              </Pressable>

              <Pressable onPress={() => onDone(0)} disabled={loading} style={styles.skipBtn}>
                <Text style={[styles.skipText, { color: theme.textMuted }]}>
                  {ur ? 'ابھی چھوڑیں' : 'Skip for now'}
                </Text>
              </Pressable>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing.md },
  hero: { alignItems: 'center', paddingTop: Spacing.md, paddingBottom: Spacing.sm, gap: 6 },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 21, fontWeight: '800', textAlign: 'center' },
  subtitle: { fontSize: 13, textAlign: 'center', lineHeight: 18, paddingHorizontal: 10 },
  stepLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase' },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 10,
  },
  searchInput: { flex: 1, fontSize: 14, padding: 0 },

  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: 13,
    marginBottom: 9,
  },
  typeIcon: { fontSize: 26 },
  typeText: { flex: 1 },
  typeName: { fontSize: 15, fontWeight: '700' },
  typeSub: { fontSize: 12, marginTop: 2 },

  selBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    marginBottom: 8,
  },
  selLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  selIcon: { fontSize: 22 },
  selText: { fontSize: 15, fontWeight: '800' },
  selCount: { fontSize: 12, fontWeight: '700', marginTop: 1 },

  masterToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  masterToggleText: { fontSize: 12, fontWeight: '700' },

  catHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    paddingBottom: 6,
  },
  catHeaderText: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.4 },
  catCount: { fontSize: 11, fontWeight: '600' },
  catTogglePill: {
    marginLeft: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  catToggle: { fontSize: 11, fontWeight: '700' },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: 8,
    marginBottom: 7,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumb: { width: 44, height: 44, borderRadius: 8 },
  itemText: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '600' },
  itemSub: { fontSize: 12, marginTop: 2 },

  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 36, gap: 8 },
  emptyText: { fontSize: 14, fontWeight: '600' },

  footer: { paddingTop: 8, gap: 4 },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: BorderRadius.md,
    paddingVertical: 13,
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  skipBtn: { alignItems: 'center', paddingVertical: 8, paddingHorizontal: 6 },
  skipText: { fontSize: 13, fontWeight: '600' },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
