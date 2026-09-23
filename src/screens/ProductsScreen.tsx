import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProductCategory } from '@/types';
import { useShop } from '@/context/ShopContext';
import { ProductCard } from '@/components/ProductCard';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterChip } from '@/components/ui/FilterChip';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import { ProductImage } from '@/components/ProductImage';

const CATEGORIES: (ProductCategory | 'LowStock')[] = [
  'All',
  'LowStock',
  'Kiryana',
  'Grocery',
  'Beverages',
  'Dairy',
  'Snacks',
  'Spices',
  'Personal Care',
  'Bakery',
  'Others',
];

export const ProductsScreen: React.FC = () => {
  const {
    products,
    deleteProduct,
    setEditingProduct,
    setIsAddProductOpen,
    settings,
    totalInventoryInvestment,
    totalInventoryRetailValue,
    totalExpectedStockProfit,
    totalInventoryUnits,
    t,
    language,
    lowStockProducts,
    outOfStockProducts,
  } = useShop();

  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<ProductCategory | 'LowStock'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.nameUrdu && p.nameUrdu.includes(searchQuery)) ||
        (p.barcode && p.barcode.includes(searchQuery));

      if (!matchSearch) return false;
      if (selectedFilter === 'All') return true;
      if (selectedFilter === 'LowStock') {
        return p.stock <= (settings.lowStockThreshold || 5);
      }
      return p.category === selectedFilter;
    });
  }, [products, searchQuery, selectedFilter, settings.lowStockThreshold]);

  const alertCount = lowStockProducts.length + outOfStockProducts.length;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.contentWrap}>
        {/* ── Search & Actions Header Row ── */}
        <View style={styles.topHeader}>
          <View style={styles.searchFlex}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={t('searchProductPlaceholder')}
            />
          </View>

          <IconButton
            icon={viewMode === 'grid' ? 'list-outline' : 'grid-outline'}
            onPress={() => setViewMode((m) => (m === 'grid' ? 'list' : 'grid'))}
          />

          <Pressable
            onPress={() => {
              setEditingProduct(null);
              setIsAddProductOpen(true);
            }}
            style={({ pressed }) => [
              styles.addProdBtn,
              { backgroundColor: theme.primary },
              pressed && { opacity: 0.9, transform: [{ scale: 0.96 }] },
            ]}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.addProdText}>{t('addProductBtn')}</Text>
          </Pressable>
        </View>

        {/* ── Category Filter Pills ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterScrollContent}>
          {CATEGORIES.map((cat) => {
            const isLowStockTab = cat === 'LowStock';
            return (
              <FilterChip
                key={cat}
                label={
                  cat === 'All'
                    ? t('allCategories')
                    : cat === 'LowStock'
                    ? `${t('lowStockAlert')} (${alertCount})`
                    : cat
                }
                isActive={selectedFilter === cat}
                onPress={() => setSelectedFilter(cat)}
                icon={isLowStockTab ? 'warning' : undefined}
                activeBg={isLowStockTab ? theme.danger : undefined}
              />
            );
          })}
        </ScrollView>

        {/* ── Financial Investment Summary Bar ── */}
        <View style={[styles.financeSummaryBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.financeSummaryItem}>
            <Text style={[styles.financeSummaryLabel, { color: theme.textMuted }]}>
              {t('totalInvestment')}
            </Text>
            <Text style={[styles.financeSummaryVal, { color: theme.text }]}>
              {settings.currencySymbol} {totalInventoryInvestment.toLocaleString()}
            </Text>
          </View>

          <View style={[styles.financeSummaryDivider, { backgroundColor: theme.border }]} />

          <View style={styles.financeSummaryItem}>
            <Text style={[styles.financeSummaryLabel, { color: theme.textMuted }]}>
              {t('stockRetailValue')}
            </Text>
            <Text style={[styles.financeSummaryVal, { color: theme.text }]}>
              {settings.currencySymbol} {totalInventoryRetailValue.toLocaleString()}
            </Text>
          </View>

          <View style={[styles.financeSummaryDivider, { backgroundColor: theme.border }]} />

          <View style={styles.financeSummaryItem}>
            <Text style={[styles.financeSummaryLabel, { color: theme.textMuted }]}>
              {t('expectedStockProfit')}
            </Text>
            <Text style={[styles.financeSummaryVal, { color: '#059669' }]}>
              +{settings.currencySymbol} {totalExpectedStockProfit.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* ── Products Display ── */}
        {filteredProducts.length === 0 ? (
          <EmptyState
            icon="search-outline"
            title={language === 'ur' ? 'کوئی پروڈکٹ نہیں ملا' : 'No products found'}
            subtitle={
              searchQuery
                ? (language === 'ur' ? 'مختلف نام سے تلاش کریں۔' : 'Try a different search term.')
                : (language === 'ur' ? 'کیٹیگری فلٹر تبدیل کریں یا نیا پروڈکٹ شامل کریں۔' : 'Adjust the category filter or add a new product.')
            }
            actionLabel={t('addProductBtn')}
            onAction={() => {
              setEditingProduct(null);
              setIsAddProductOpen(true);
            }}
          />
        ) : viewMode === 'list' ? (
          /* ── List View ── */
          <ScrollView
            style={styles.productsScroll}
            contentContainerStyle={styles.productsList}
            showsVerticalScrollIndicator={false}>
            {filteredProducts.map((product) => {
              const isOut = product.stock <= 0;
              const isLow = !isOut && product.stock <= (settings.lowStockThreshold || 5);
              const cost = product.costPrice || Math.round(product.price * 0.8);
              const margin = product.price > 0 ? Math.round(((product.price - cost) / product.price) * 100) : 0;

              return (
                <Pressable
                  key={product.id}
                  onPress={() => {
                    setEditingProduct(product);
                    setIsAddProductOpen(true);
                  }}
                  style={({ pressed }) => [
                    styles.listRowCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: isLow ? theme.warning : isOut ? theme.danger : theme.border,
                      borderWidth: isLow || isOut ? 1.5 : 1,
                    },
                    pressed && { opacity: 0.85 },
                  ]}>
                  {/* Left: Thumbnail + Name */}
                  <View style={styles.listRowLeft}>
                    <View style={[styles.listThumbFallback, { backgroundColor: theme.surfaceSubtle }]}>
                      <ProductImage
                        uri={product.image || product.imageUri}
                        style={styles.listThumb}
                        resizeMode="cover"
                        fallbackColor={theme.textMuted}
                        fallbackSize={20}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.listRowName, { color: theme.text }]} numberOfLines={1}>
                        {language === 'ur' && product.nameUrdu ? product.nameUrdu : product.name}
                      </Text>
                      <Text style={[styles.listRowCat, { color: theme.textMuted }]}>
                        {product.category}
                      </Text>
                    </View>
                  </View>

                  {/* Stock Badge */}
                  <View
                    style={[
                      styles.listStockBadge,
                      {
                        backgroundColor: isOut
                          ? theme.dangerLight
                          : isLow
                          ? theme.warningLight
                          : theme.successLight,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.listStockText,
                        { color: isOut ? theme.danger : isLow ? theme.warning : theme.success },
                      ]}>
                      {isOut ? t('soldOut') : `${product.stock} ${product.unit}`}
                    </Text>
                  </View>

                  {/* Pricing & Actions */}
                  <View style={styles.listRowRight}>
                    <Text style={[styles.listRowPrice, { color: theme.primary }]}>
                      {settings.currencySymbol}{product.price}
                    </Text>
                    <Text style={[styles.listRowMargin, { color: theme.textMuted }]}>
                      {margin}% {language === 'ur' ? 'منافع' : 'margin'}
                    </Text>
                  </View>

                  <View style={styles.listRowActions}>
                    <Pressable
                      onPress={() => deleteProduct(product.id)}
                      style={[styles.smallActionBtn, { backgroundColor: theme.dangerLight }]}>
                      <Ionicons name="trash-outline" size={13} color={theme.danger} />
                    </Pressable>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        ) : (
          /* ── Grid View ── */
          <ScrollView
            style={styles.productsScroll}
            contentContainerStyle={styles.productsGrid}
            showsVerticalScrollIndicator={false}>
            {filteredProducts.map((product) => (
              <View key={product.id} style={styles.cardContainer}>
                <ProductCard
                  product={product}
                  onEdit={(p) => {
                    setEditingProduct(p);
                    setIsAddProductOpen(true);
                  }}
                  onDelete={(p) => deleteProduct(p.id)}
                />
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentWrap: {
    flex: 1,
    padding: Spacing.md,
    maxWidth: 820,
    marginHorizontal: 'auto',
    width: '100%',
  },


  // Header
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  searchFlex: { flex: 1 },
  addProdBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },
  addProdText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },

  // Filters
  filterScroll: { maxHeight: 44, marginBottom: Spacing.sm },
  filterScrollContent: { gap: 6, alignItems: 'center' },

  // Products Grid
  productsScroll: { flex: 1 },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingBottom: 100,
  },
  cardContainer: {
    width: Platform.select({ web: 'calc(50% - 6px)' as any, default: '48%' }),
  },

  // List View
  productsList: { gap: 8, paddingBottom: 100 },
  listRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  listRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 2 },
  listThumb: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
  },
  listThumbFallback: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listRowName: { fontSize: 13, fontWeight: '800' },
  listRowCat: { fontSize: 11, marginTop: 2 },
  listStockBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.full },
  listStockText: { fontSize: 10, fontWeight: '700' },
  listRowRight: { alignItems: 'flex-end' },
  listRowPrice: { fontSize: 14, fontWeight: '800' },
  listRowMargin: { fontSize: 10, marginTop: 1 },
  listRowActions: { flexDirection: 'row', gap: 4 },
  smallActionBtn: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Finance Summary Bar
  financeSummaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  financeSummaryItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  financeSummaryLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  financeSummaryVal: {
    fontSize: 13,
    fontWeight: '800',
  },
  financeSummaryDivider: {
    width: 1,
    height: 24,
  },
});
