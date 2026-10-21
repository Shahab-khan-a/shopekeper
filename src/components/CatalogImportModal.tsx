import React, { useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  Image as RNImage,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShop } from '@/context/ShopContext';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { ProductCategory } from '@/types';
import { MASTER_CATALOG, CatalogItem } from '@/data/masterCatalog';
import { CATALOG_IMAGE_MAP } from '@/data/catalogImageMap';
import { ProductImage } from '@/components/ProductImage';

interface CatalogImportModalProps {
  visible: boolean;
  onClose: () => void;
  /** Opens the shop-type picker (used when no type has been chosen yet). */
  onChooseType?: () => void;
}

type Row =
  | { kind: 'header'; key: string; title: string; count: number }
  | { kind: 'item'; key: string; item: CatalogItem; categoryName: string };

/** Map a catalog category onto the app's fixed product-category enum. */
export function mapCatalogCategory(categoryName: string, shopType: string): ProductCategory {
  const c = categoryName.toLowerCase();
  if (c.includes('dairy') || c.includes('milk')) return 'Dairy';
  if (c.includes('beverage') || c.includes('drink') || c.includes('tea') || c.includes('coffee')) return 'Beverages';
  if (c.includes('snack') || c.includes('nimco') || c.includes('biscuit')) return 'Snacks';
  if (c.includes('spice') || c.includes('masala')) return 'Spices';
  if (c.includes('personal care') || c.includes('beauty') || c.includes('cosmetic') || c.includes('hair') || c.includes('skin')) return 'Personal Care';
  if (c.includes('bakery') || c.includes('bread') || c.includes('cake') || c.includes('sweet') || c.includes('mithai') || c.includes('rusk')) return 'Bakery';
  if (shopType.toLowerCase().includes('kiryana')) return 'Kiryana';
  if (shopType.toLowerCase().includes('supermarket') || shopType.toLowerCase().includes('grocery')) return 'Grocery';
  return 'Others';
}

/** Best displayable URI for a catalog item: hotlinked photo first, bundled photo second. */
export function resolveCatalogImageUri(item: CatalogItem): string | undefined {
  // Bundled photo first: the app is offline-first, so the on-device image
  // always shows — the hotlinked URL is only a fallback for items that
  // have no bundled photo of their own.
  if (item.image && CATALOG_IMAGE_MAP[item.image]) {
    try {
      const asset: unknown = CATALOG_IMAGE_MAP[item.image];
      // Web bundles hand back an asset object that already carries a uri
      // (and react-native-web has no Image.resolveAssetSource); native
      // bundles hand back a registry number that needs resolving.
      if (typeof asset === 'string') return asset;
      if (asset && typeof asset === 'object' && 'uri' in asset) {
        const uri = (asset as { uri?: unknown }).uri;
        if (typeof uri === 'string' && uri) return uri;
      }
      if (typeof asset === 'number') {
        const src = RNImage.resolveAssetSource(asset) as
          | { uri?: string }
          | string
          | null;
        const uri = typeof src === 'string' ? src : src?.uri;
        if (uri) return uri;
      }
    } catch {
      // fall through to the hotlink
    }
  }
  if (item.imageUrl) return item.imageUrl;
  return undefined;
}

/**
 * Products-tab catalog import. Loads ONLY the shop type the keeper chose
 * during first-run setup (or later via the picker on this screen), so he
 * can top up his shop by tapping items instead of typing them.
 */
export const CatalogImportModal: React.FC<CatalogImportModalProps> = ({ visible, onClose, onChooseType }) => {
  const { settings, products, addProduct, language } = useShop();
  const insets = useSafeAreaInsets();
  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const ur = language === 'ur';
  const [query, setQuery] = useState('');
  const [addedNow, setAddedNow] = useState<Set<string>>(new Set());
  const [importingAll, setImportingAll] = useState(false);

  const shopType = useMemo(
    () => MASTER_CATALOG.find((s) => s.shopType === settings.catalogShopType),
    [settings.catalogShopType]
  );

  const existingNames = useMemo(
    () => new Set(products.map((p) => p.name.trim().toLowerCase())),
    [products]
  );

  const rows = useMemo<Row[]>(() => {
    if (!shopType) return [];
    const q = query.trim().toLowerCase();
    const out: Row[] = [];
    for (const cat of shopType.categories) {
      const items = q
        ? cat.items.filter(
            (i) => i.name.toLowerCase().includes(q) || (i.nameUrdu ?? '').includes(query.trim())
          )
        : cat.items;
      if (!items.length) continue;
      out.push({ kind: 'header', key: `h:${cat.name}`, title: cat.name, count: items.length });
      for (const item of items) {
        out.push({ kind: 'item', key: `i:${cat.name}:${item.name}`, item, categoryName: cat.name });
      }
    }
    return out;
  }, [shopType, query]);

  const missingCount = useMemo(() => {
    if (!shopType) return 0;
    let n = 0;
    for (const cat of shopType.categories) {
      for (const item of cat.items) {
        if (!existingNames.has(item.name.trim().toLowerCase()) && !addedNow.has(item.name)) n++;
      }
    }
    return n;
  }, [shopType, existingNames, addedNow]);

  const addOne = async (item: CatalogItem, categoryName: string) => {
    if (!shopType) return;
    await addProduct({
      name: item.name,
      nameUrdu: item.nameUrdu,
      price: item.price,
      stock: 20, // Starter shelf stock so imported items can be sold immediately
      category: mapCatalogCategory(categoryName, shopType.shopType),
      unit: item.unit,
      image: resolveCatalogImageUri(item),
      lowStockThreshold: settings.lowStockThreshold || 5,
    });
    setAddedNow((prev) => new Set(prev).add(item.name));
  };

  const importAll = async () => {
    if (!shopType || importingAll) return;
    setImportingAll(true);
    try {
      for (const cat of shopType.categories) {
        for (const item of cat.items) {
          if (existingNames.has(item.name.trim().toLowerCase()) || addedNow.has(item.name)) continue;
          await addOne(item, cat.name);
        }
      }
    } finally {
      setImportingAll(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: theme.text }]}>
              {ur ? 'کیٹلاگ سے شامل کریں' : 'Add from Catalog'}
            </Text>
            <Text style={[styles.subtitle, { color: theme.textMuted }]}>
              {shopType
                ? `${shopType.icon} ${shopType.shopType}`
                : ur
                  ? 'ابھی کوئی دکان کی قسم منتخب نہیں'
                  : 'No shop type selected yet'}
            </Text>
          </View>
          <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
            <Ionicons name="close" size={24} color={theme.text} />
          </Pressable>
        </View>

        {!shopType ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>🏪</Text>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              {ur ? 'پہلے دکان کی قسم منتخب کریں' : 'Choose your shop type first'}
            </Text>
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>
              {ur
                ? 'اپنی دکان کی قسم منتخب کریں — پھر یہاں صرف اسی قسم کی تیار اشیاء، تصاویر اور قیمتوں کے ساتھ لوڈ ہوں گی۔'
                : 'Pick your shop type — then only that type’s ready-made items will load here, with photos and prices.'}
            </Text>
            {onChooseType ? (
              <Pressable
                onPress={onChooseType}
                style={[styles.primaryBtn, { backgroundColor: theme.primary }]}>
                <Text style={styles.primaryBtnText}>
                  {ur ? 'دکان کی قسم منتخب کریں' : 'Choose Shop Type'}
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={onClose}
                style={[styles.primaryBtn, { backgroundColor: theme.primary }]}>
                <Text style={styles.primaryBtnText}>{ur ? 'ٹھیک ہے' : 'OK'}</Text>
              </Pressable>
            )}
          </View>
        ) : (
          <>
            <View style={[styles.searchWrap, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Ionicons name="search" size={18} color={theme.textMuted} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={ur ? 'اشیاء تلاش کریں…' : 'Search items…'}
                placeholderTextColor={theme.textMuted}
                style={[styles.searchInput, { color: theme.text }]}
              />
            </View>

            <Pressable
              onPress={importAll}
              disabled={importingAll || missingCount === 0}
              style={[
                styles.importAllBtn,
                { backgroundColor: theme.primary, opacity: importingAll || missingCount === 0 ? 0.55 : 1 },
              ]}>
              {importingAll ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="cloud-download-outline" size={18} color="#FFFFFF" />
              )}
              <Text style={styles.importAllText}>
                {missingCount === 0
                  ? ur
                    ? 'تمام اشیاء شامل ہیں ✓'
                    : 'All items already added ✓'
                  : ur
                    ? `تمام ${missingCount} اشیاء شامل کریں`
                    : `Import all ${missingCount} items`}
              </Text>
            </Pressable>

            <FlatList
              data={rows}
              keyExtractor={(r) => r.key}
              contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
              renderItem={({ item: row }) => {
                if (row.kind === 'header') {
                  return (
                    <View style={[styles.catHeader, { backgroundColor: theme.background }]}>
                      <Text style={[styles.catHeaderText, { color: theme.text }]}>{row.title}</Text>
                      <Text style={[styles.catCount, { color: theme.textMuted }]}>{row.count}</Text>
                    </View>
                  );
                }
                const { item, categoryName } = row;
                const already =
                  existingNames.has(item.name.trim().toLowerCase()) || addedNow.has(item.name);
                return (
                  <View style={[styles.itemRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <ProductImage uri={resolveCatalogImageUri(item)} style={styles.thumb} containerStyle={styles.thumb} />
                    <View style={styles.itemText}>
                      <Text style={[styles.itemName, { color: theme.text }]} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={[styles.itemSub, { color: theme.textMuted }]} numberOfLines={1}>
                        {item.nameUrdu ? `${item.nameUrdu} · ` : ''}Rs {item.price} / {item.unit}
                      </Text>
                    </View>
                    <Pressable
                      disabled={already}
                      onPress={() => addOne(item, categoryName)}
                      style={[
                        styles.addBtn,
                        { backgroundColor: already ? theme.border : theme.primary },
                      ]}>
                      <Text style={[styles.addBtnText, { color: already ? theme.textMuted : '#FFFFFF' }]}>
                        {already ? '✓' : ur ? 'شامل' : 'Add'}
                      </Text>
                    </Pressable>
                  </View>
                );
              }}
            />
            <Text style={[styles.footer, { color: theme.textMuted }]}>
              {ur
                ? 'تصاویر: Unsplash اور Wikimedia Commons (لائسنس یافتہ)'
                : 'Photos: Unsplash & Wikimedia Commons (licensed) — tap any product later to replace with your own photo.'}
            </Text>
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing.md },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingVertical: Spacing.md },
  title: { fontSize: 20, fontWeight: '800' },
  subtitle: { fontSize: 13, marginTop: 3 },
  closeBtn: { padding: 4 },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1, borderRadius: BorderRadius.md, paddingHorizontal: 12, paddingVertical: 10,
    marginBottom: Spacing.sm,
  },
  searchInput: { flex: 1, fontSize: 15, padding: 0 },
  importAllBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderRadius: BorderRadius.md, paddingVertical: 12, marginBottom: Spacing.md,
  },
  importAllText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  catHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 14, paddingBottom: 6 },
  catHeaderText: { fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.4 },
  catCount: { fontSize: 12, fontWeight: '600' },
  itemRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderRadius: BorderRadius.md, padding: 8, marginBottom: 8,
  },
  thumb: { width: 48, height: 48, borderRadius: 8 },
  itemText: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '600' },
  itemSub: { fontSize: 12, marginTop: 2 },
  addBtn: { borderRadius: BorderRadius.sm, paddingHorizontal: 14, paddingVertical: 8 },
  addBtnText: { fontSize: 13, fontWeight: '700' },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, gap: 10 },
  emptyIcon: { fontSize: 52 },
  emptyTitle: { fontSize: 17, fontWeight: '800', textAlign: 'center' },
  emptyText: { fontSize: 13, textAlign: 'center', lineHeight: 19 },
  primaryBtn: { borderRadius: BorderRadius.md, paddingHorizontal: 26, paddingVertical: 12, marginTop: 8 },
  primaryBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  footer: { fontSize: 11, textAlign: 'center', paddingVertical: 8, lineHeight: 15 },
});
