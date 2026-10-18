import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShop } from '@/context/ShopContext';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { MASTER_CATALOG, CatalogShopType, CatalogItem } from '@/data/masterCatalog';
import { ProductImage } from '@/components/ProductImage';
import { mapCatalogCategory, resolveCatalogImageUri } from '@/components/CatalogImportModal';

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
 * main app). Step 1: the keeper picks his shop type. Step 2: he ticks the
 * ready-made items he stocks and presses Load — they are added to his
 * products with photos and typical prices, so the shop starts full instead
 * of empty. Skippable at every step.
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

  const allNames = useMemo(
    () => (chosen ? chosen.categories.flatMap((c) => c.items.map((i) => i.name)) : []),
    [chosen]
  );

  const rows = useMemo<Row[]>(() => {
    if (!chosen) return [];
    const out: Row[] = [];
    for (const cat of chosen.categories) {
      out.push({
        kind: 'header',
        key: `h:${cat.name}`,
        title: cat.name,
        count: cat.items.length,
        selectedCount: cat.items.filter((i) => selected.has(i.name)).length,
        itemNames: cat.items.map((i) => i.name),
      });
      for (const item of cat.items) {
        out.push({ kind: 'item', key: `i:${cat.name}:${item.name}`, name: item.name, categoryName: cat.name });
      }
    }
    return out;
  }, [chosen, selected]);

  const itemByName = useMemo(() => {
    const m = new Map<string, { price: number; unit: string; nameUrdu?: string; categoryName: string; raw: CatalogItem }>();
    if (chosen) {
      for (const cat of chosen.categories) {
        for (const item of cat.items) {
          m.set(item.name, { price: item.price, unit: item.unit, nameUrdu: item.nameUrdu, categoryName: cat.name, raw: item });
        }
      }
    }
    return m;
  }, [chosen]);

  const goToItems = () => {
    if (!chosen) return;
    setSelected(new Set(allNames));
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
            stock: 0,
            category: mapCatalogCategory(cat.name, chosen.shopType),
            unit: item.unit,
            image: resolveCatalogImageUri(item),
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

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <View style={styles.hero}>
        <View style={[styles.heroIcon, { backgroundColor: theme.primary }]}>
          <Ionicons name="storefront" size={30} color="#FFFFFF" />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>
          {step === 'type'
            ? ur
              ? 'اپنی دکان تیار کریں'
              : 'Set Up Your Shop'
            : ur
              ? 'اشیاء منتخب کریں'
              : 'Select Your Items'}
        </Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          {step === 'type'
            ? ur
              ? 'آپ کی دکان کس قسم کی ہے؟ قسم منتخب کریں، ہم آپ کی دکان تیار اشیاء، تصاویر اور قیمتوں کے ساتھ بھر دیں گے — ہر چیز خود لکھنے کی ضرورت نہیں۔'
              : 'What type of shop do you run? Pick your type and we will fill your shop with ready-made items, photos and prices — no typing everything yourself.'
            : ur
              ? 'جو اشیاء آپ بیچتے ہیں وہ منتخب رہنے دیں، باقی ہٹا دیں۔ پھر لوڈ دبائیں — یہ اشیاء آپ کی دکان میں شامل ہو جائیں گی۔'
              : 'Keep the items you sell ticked, untick the rest, then press Load — the ticked items will be added to your shop.'}
        </Text>
        <Text style={[styles.stepLabel, { color: theme.textMuted }]}>
          {ur ? (step === 'type' ? 'مرحلہ 1 از 2' : 'مرحلہ 2 از 2') : step === 'type' ? 'Step 1 of 2' : 'Step 2 of 2'}
        </Text>
      </View>

      {step === 'type' ? (
        <>
          <FlatList
            data={MASTER_CATALOG}
            keyExtractor={(t) => t.shopType}
            contentContainerStyle={{ paddingBottom: 16 }}
            renderItem={({ item }) => {
              const isSel = chosen?.shopType === item.shopType;
              return (
                <Pressable
                  onPress={() => setChosen(item)}
                  style={[
                    styles.typeRow,
                    { backgroundColor: theme.surface, borderColor: isSel ? theme.primary : theme.border },
                    isSel && { borderWidth: 2 },
                  ]}>
                  <Text style={styles.typeIcon}>{item.icon}</Text>
                  <View style={styles.typeText}>
                    <Text style={[styles.typeName, { color: theme.text }]}>{item.shopType}</Text>
                    <Text style={[styles.typeSub, { color: theme.textMuted }]}>
                      {typeItemCount(item)} {ur ? 'اشیاء' : 'ready-made items'}
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
          />
          <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
            <Pressable
              onPress={goToItems}
              disabled={!chosen}
              style={[styles.primaryBtn, { backgroundColor: theme.primary, opacity: chosen ? 1 : 0.5 }]}>
              <Text style={styles.primaryBtnText}>{ur ? 'آگے بڑھیں' : 'Continue'}</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </Pressable>
            <Pressable onPress={() => onDone(0)} style={styles.skipBtn}>
              <Text style={[styles.skipText, { color: theme.textMuted }]}>
                {ur ? 'ابھی چھوڑیں — بعد میں خود اشیاء شامل کروں گا' : 'Skip for now — I will add items myself'}
              </Text>
            </Pressable>
          </View>
        </>
      ) : (
        <>
          <View style={styles.selBar}>
            <Text style={[styles.selText, { color: theme.text }]}>
              {chosen?.icon} {chosen?.shopType}
            </Text>
            <Text style={[styles.selCount, { color: theme.textMuted }]}>
              {selected.size} / {allNames.length} {ur ? 'منتخب' : 'selected'}
            </Text>
          </View>
          <FlatList
            data={rows}
            keyExtractor={(r) => r.key}
            contentContainerStyle={{ paddingBottom: 16 }}
            renderItem={({ item: row }) => {
              if (row.kind === 'header') {
                const allSel = row.selectedCount === row.count;
                return (
                  <View style={[styles.catHeader, { backgroundColor: theme.background }]}>
                    <Text style={[styles.catHeaderText, { color: theme.text }]}>{row.title}</Text>
                    <Text style={[styles.catCount, { color: theme.textMuted }]}>
                      {row.selectedCount}/{row.count}
                    </Text>
                    <Pressable onPress={() => toggleCategory(row.itemNames, !allSel)} hitSlop={6}>
                      <Text style={[styles.catToggle, { color: theme.primary }]}>
                        {allSel ? (ur ? 'کوئی نہیں' : 'None') : ur ? 'سب' : 'All'}
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
                  style={[styles.itemRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <View
                    style={[
                      styles.checkbox,
                      { borderColor: isSel ? theme.primary : theme.border, backgroundColor: isSel ? theme.primary : 'transparent' },
                    ]}>
                    {isSel ? <Ionicons name="checkmark" size={15} color="#FFFFFF" /> : null}
                  </View>
                  <ProductImage
                    uri={meta ? resolveCatalogImageUri(meta.raw) : undefined}
                    style={styles.thumb}
                    containerStyle={styles.thumb}
                  />
                  <View style={styles.itemText}>
                    <Text style={[styles.itemName, { color: theme.text }]} numberOfLines={1}>
                      {row.name}
                    </Text>
                    <Text style={[styles.itemSub, { color: theme.textMuted }]} numberOfLines={1}>
                      {meta?.nameUrdu ? `${meta.nameUrdu} · ` : ''}Rs {meta?.price} / {meta?.unit}
                    </Text>
                  </View>
                </Pressable>
              );
            }}
          />
          <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
            <Pressable
              onPress={loadItems}
              disabled={loading || selected.size === 0}
              style={[styles.primaryBtn, { backgroundColor: theme.primary, opacity: loading || selected.size === 0 ? 0.55 : 1 }]}>
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
              <Pressable onPress={() => setStep('type')} disabled={loading} style={styles.skipBtn}>
                <Text style={[styles.skipText, { color: theme.textMuted }]}>
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
  hero: { alignItems: 'center', paddingTop: Spacing.lg, paddingBottom: Spacing.md, gap: 8 },
  heroIcon: {
    width: 64, height: 64, borderRadius: 32,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 22, fontWeight: '800', textAlign: 'center' },
  subtitle: { fontSize: 13, textAlign: 'center', lineHeight: 19, paddingHorizontal: 8 },
  stepLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase' },
  typeRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1, borderRadius: BorderRadius.md, padding: 14, marginBottom: 10,
  },
  typeIcon: { fontSize: 26 },
  typeText: { flex: 1 },
  typeName: { fontSize: 15, fontWeight: '700' },
  typeSub: { fontSize: 12, marginTop: 2 },
  selBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 8,
  },
  selText: { fontSize: 15, fontWeight: '800' },
  selCount: { fontSize: 12, fontWeight: '600' },
  catHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 14, paddingBottom: 6 },
  catHeaderText: { fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.4 },
  catCount: { fontSize: 12, fontWeight: '600' },
  catToggle: { fontSize: 12, fontWeight: '700', marginLeft: 'auto' },
  itemRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderRadius: BorderRadius.md, padding: 8, marginBottom: 8,
  },
  checkbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  thumb: { width: 48, height: 48, borderRadius: 8 },
  itemText: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '600' },
  itemSub: { fontSize: 12, marginTop: 2 },
  footer: { paddingTop: 10, gap: 4 },
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderRadius: BorderRadius.md, paddingVertical: 14,
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  skipBtn: { alignItems: 'center', paddingVertical: 10 },
  skipText: { fontSize: 13, fontWeight: '600' },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between' },
});
