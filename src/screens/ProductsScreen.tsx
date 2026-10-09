import { ProductCard } from '@/components/ProductCard';
import { ProductDetailsDrawer } from '@/components/ProductDetailsDrawer';
import { ProductImage } from '@/components/ProductImage';
import { EmptyState } from '@/components/ui/EmptyState';
import { FilterChip } from '@/components/ui/FilterChip';
import { SearchBar } from '@/components/ui/SearchBar';
import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';
import { Product, ProductCategory } from '@/types';
import { formatCompactPrice } from '@/utils/formatters';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { PRODUCTS_FILTER_CATEGORIES } from '@/constants/categories';

const CATEGORIES: (ProductCategory | 'LowStock')[] = PRODUCTS_FILTER_CATEGORIES;

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
    t,
    language,
    lowStockProducts,
    outOfStockProducts,
    showAlert,
  } = useShop();

  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<ProductCategory | 'LowStock'>('All');
  const PRODUCTS_VIEW_MODE_KEY = '@shopkeeper_products_view_mode';
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(PRODUCTS_VIEW_MODE_KEY)
      .then((saved) => {
        if (saved === 'grid' || saved === 'list') {
          setViewMode(saved);
        }
      })
      .catch(() => {});
  }, []);

  const setViewModePersist = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    AsyncStorage.setItem(PRODUCTS_VIEW_MODE_KEY, mode).catch(() => {});
  };

  const activeProduct = useMemo(() => {
    if (!selectedProductDetails) return null;
    return products.find((p) => p.id === selectedProductDetails.id) || selectedProductDetails;
  }, [products, selectedProductDetails]);

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

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: products.length };
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const profitPct =
    totalInventoryInvestment > 0
      ? ((totalExpectedStockProfit / totalInventoryInvestment) * 100).toFixed(1)
      : '0.0';

  const softBorder = settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(148,163,184,0.4)';
  const cardBg = settings.darkMode ? theme.card : '#FFFFFF';

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.contentWrap}>
        {/* Search + Add Product */}
        <View style={styles.topHeader}>
          <View style={styles.searchFlex}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={t('searchProductPlaceholder')}
              height={40}
            />
          </View>

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
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.addProdText}>{t('addProductBtn')}</Text>
          </Pressable>
        </View>

        {/* Segmented Metric Overview Card */}
        <View
          style={[
            styles.financeSummaryBar,
            {
              backgroundColor: cardBg,
              borderColor: softBorder,
            },
          ]}>
          <View style={styles.financeSummaryItem}>
            <Text style={[styles.financeSummaryLabel, { color: theme.textMuted }]} numberOfLines={1}>
              {t('metricInvestment')}
            </Text>
            <Text
              style={[styles.financeSummaryVal, { color: theme.text }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}>
              {settings.currencySymbol}
              {formatCompactPrice(totalInventoryInvestment)}
            </Text>
            <Text style={[styles.financeSubLabel, { color: theme.textMuted }]}>
              {t('metricCostValue')}
            </Text>
          </View>

          <View style={[styles.financeSummaryDivider, { backgroundColor: softBorder }]} />

          <View style={styles.financeSummaryItem}>
            <Text style={[styles.financeSummaryLabel, { color: theme.textMuted }]} numberOfLines={1}>
              {t('metricRetailValue')}
            </Text>
            <Text
              style={[styles.financeSummaryVal, { color: theme.text }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}>
              {settings.currencySymbol}
              {formatCompactPrice(totalInventoryRetailValue)}
            </Text>
            <Text style={[styles.financeSubLabel, { color: theme.textMuted }]}>
              {t('metricSellingEst')}
            </Text>
          </View>

          <View style={[styles.financeSummaryDivider, { backgroundColor: softBorder }]} />

          <View style={styles.financeSummaryItem}>
            <Text style={[styles.financeSummaryLabel, { color: theme.primary }]} numberOfLines={1}>
              {t('metricEstProfit')}
            </Text>
            <Text
              style={[styles.financeSummaryVal, { color: theme.primary }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}>
              +{settings.currencySymbol}
              {formatCompactPrice(totalExpectedStockProfit)}
            </Text>
            <View
              style={[
                styles.profitPctPill,
                {
                  backgroundColor: settings.darkMode
                    ? 'rgba(16,185,129,0.2)'
                    : 'rgba(167,243,208,0.5)',
                },
              ]}>
              <Text style={[styles.profitPctText, { color: theme.primary }]}>+{profitPct}%</Text>
            </View>
          </View>
        </View>

        {/* Category Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterScrollContent}>
          {CATEGORIES.map((cat) => {
            const isLowStockTab = cat === 'LowStock';
            const isAll = cat === 'All';
            return (
              <FilterChip
                key={cat}
                label={
                  isAll
                    ? t('allCategories')
                    : isLowStockTab
                      ? `${t('lowStockAlert')} (${alertCount})`
                      : cat
                }
                isActive={selectedFilter === cat}
                onPress={() => setSelectedFilter(cat)}
                icon={isLowStockTab ? 'warning' : undefined}
                variant={isLowStockTab ? 'alert' : 'default'}
                count={isAll ? categoryCounts.All : undefined}
                activeBg={isLowStockTab ? theme.danger : undefined}
              />
            );
          })}
        </ScrollView>

        {/* Showing count + view switcher */}
        <View style={styles.gridHeader}>
          <Text style={[styles.showingText, { color: theme.textMuted }]}>
            {t('showingItems')}{' '}
            <Text style={{ color: theme.text, fontWeight: '700' }}>
              {filteredProducts.length} {t('itemsLabel')}
            </Text>
          </Text>

          <View
            style={[
              styles.viewToggle,
              {
                backgroundColor: cardBg,
                borderColor: softBorder,
              },
            ]}>
            <Pressable
              onPress={() => setViewModePersist('grid')}
              style={[
                styles.viewToggleBtn,
                viewMode === 'grid' && {
                  backgroundColor: settings.darkMode
                    ? 'rgba(16,185,129,0.22)'
                    : 'rgba(167,243,208,0.55)',
                },
              ]}
              accessibilityLabel="Grid view">
              <Ionicons
                name="grid-outline"
                size={14}
                color={viewMode === 'grid' ? theme.primary : theme.textMuted}
              />
            </Pressable>
            <Pressable
              onPress={() => setViewModePersist('list')}
              style={[
                styles.viewToggleBtn,
                viewMode === 'list' && {
                  backgroundColor: settings.darkMode
                    ? 'rgba(16,185,129,0.22)'
                    : 'rgba(167,243,208,0.55)',
                },
              ]}
              accessibilityLabel="List view">
              <Ionicons
                name="list-outline"
                size={14}
                color={viewMode === 'list' ? theme.primary : theme.textMuted}
              />
            </Pressable>
          </View>
        </View>

        {/* Products Display */}
        {filteredProducts.length === 0 ? (
          <EmptyState
            icon="search-outline"
            title={language === 'ur' ? 'کوئی پروڈکٹ نہیں ملا' : 'No products found'}
            subtitle={
              searchQuery
                ? language === 'ur'
                  ? 'مختلف نام سے تلاش کریں۔'
                  : 'Try a different search term.'
                : language === 'ur'
                  ? 'کیٹیگری فلٹر تبدیل کریں یا نیا پروڈکٹ شامل کریں۔'
                  : 'Adjust the category filter or add a new product.'
            }
            actionLabel={t('addProductBtn')}
            onAction={() => {
              setEditingProduct(null);
              setIsAddProductOpen(true);
            }}
          />
        ) : viewMode === 'list' ? (
          <ScrollView
            style={styles.productsScroll}
            contentContainerStyle={styles.productsList}
            showsVerticalScrollIndicator={false}>
            {filteredProducts.map((product) => {
              const isOut = product.stock <= 0;
              const isLow = !isOut && product.stock <= (settings.lowStockThreshold || 5);
              const cost = product.costPrice || Math.round(product.price * 0.8);
              const margin =
                product.price > 0
                  ? Math.round(((product.price - cost) / product.price) * 100)
                  : 0;

              return (
                <Pressable
                  key={product.id}
                  onPress={() => setSelectedProductDetails(product)}
                  style={({ pressed }) => [
                    styles.listRowCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: isLow
                        ? theme.warning
                        : isOut
                          ? theme.danger
                          : softBorder,
                      borderWidth: isLow || isOut ? 1.5 : 1,
                    },
                    pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
                  ]}>
                  <View style={[styles.listThumbWrap, { backgroundColor: theme.surfaceSubtle }]}>
                    <ProductImage
                      uri={product.image || product.imageUri}
                      style={styles.listThumb}
                      resizeMode="cover"
                      fallbackColor={theme.textMuted}
                      fallbackSize={24}
                    />
                  </View>

                  <View style={styles.listRowContent}>
                    <Text style={[styles.listRowName, { color: theme.text }]} numberOfLines={1}>
                      {language === 'ur' && product.nameUrdu ? product.nameUrdu : product.name}
                    </Text>
                    <View style={styles.listRowBadgeRow}>
                      <View
                        style={[
                          styles.listCategoryBadge,
                          {
                            backgroundColor: settings.darkMode
                              ? 'rgba(255,255,255,0.08)'
                              : '#F1F5F9',
                          },
                        ]}>
                        <Text style={[styles.listCategoryText, { color: theme.textSecondary }]}>
                          {product.category}
                        </Text>
                      </View>
                    </View>
                    {product.barcode ? (
                      <Text
                        style={[styles.listBarcodeText, { color: theme.textMuted }]}
                        numberOfLines={1}>
                        # {product.barcode}
                      </Text>
                    ) : null}
                  </View>

                  <View
                    style={[
                      styles.listStockBadge,
                      {
                        backgroundColor: isOut
                          ? theme.dangerLight
                          : isLow
                            ? theme.warningLight
                            : settings.darkMode
                              ? 'rgba(16,185,129,0.22)'
                              : '#A7F3D0',
                      },
                    ]}>
                    <Ionicons
                      name={isOut ? 'alert-circle' : isLow ? 'warning' : 'cube-outline'}
                      size={12}
                      color={
                        isOut
                          ? theme.danger
                          : isLow
                            ? theme.warning
                            : settings.darkMode
                              ? theme.success
                              : '#047857'
                      }
                    />
                    <Text
                      style={[
                        styles.listStockText,
                        {
                          color: isOut
                            ? theme.danger
                            : isLow
                              ? theme.warning
                              : settings.darkMode
                                ? theme.success
                                : '#047857',
                        },
                      ]}>
                      {isOut ? t('soldOut') : `${product.stock} ${product.unit}`}
                    </Text>
                  </View>

                  <View style={styles.listRowRight}>
                    <Text
                      style={[styles.listRowPrice, { color: theme.primary }]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.75}>
                      {settings.currencySymbol}
                      {formatCompactPrice(product.price)}
                    </Text>
                    {margin > 0 ? (
                      <View
                        style={[
                          styles.listMarginChip,
                          {
                            backgroundColor: settings.darkMode
                              ? 'rgba(16,185,129,0.15)'
                              : 'rgba(167,243,208,0.45)',
                          },
                        ]}>
                        <Text style={[styles.listMarginText, { color: theme.primary }]}>
                          +{margin}%
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation?.();
                      const productName =
                        language === 'ur' && product.nameUrdu ? product.nameUrdu : product.name;
                      showAlert({
                        type: 'danger',
                        title: language === 'ur' ? 'پروڈکٹ حذف کریں' : 'Delete Product',
                        message:
                          language === 'ur'
                            ? `کیا آپ "${productName}" کو حذف کرنا چاہتے ہیں؟ یہ عمل واپس نہیں ہو سکتا۔`
                            : `Delete "${productName}"? This cannot be undone.`,
                        buttons: [
                          {
                            text: language === 'ur' ? 'حذف کریں' : 'Delete',
                            style: 'destructive',
                            icon: 'trash-outline',
                            onPress: () => deleteProduct(product.id),
                          },
                          { text: language === 'ur' ? 'منسوخ' : 'Cancel', style: 'cancel' },
                        ],
                      });
                    }}
                    style={({ pressed }) => [
                      styles.smallActionBtn,
                      { backgroundColor: theme.dangerLight },
                      pressed && { opacity: 0.7 },
                    ]}>
                    <Ionicons name="trash-outline" size={14} color={theme.danger} />
                  </Pressable>
                </Pressable>
              );
            })}
          </ScrollView>
        ) : (
          <ScrollView
            style={styles.productsScroll}
            contentContainerStyle={styles.productsGrid}
            showsVerticalScrollIndicator={false}>
            {filteredProducts.map((product) => (
              <View key={product.id} style={styles.cardContainer}>
                <ProductCard
                  product={product}
                  onPress={(p) => setSelectedProductDetails(p)}
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

      <ProductDetailsDrawer
        visible={!!selectedProductDetails}
        product={activeProduct}
        onClose={() => setSelectedProductDetails(null)}
        onEdit={(p) => {
          setSelectedProductDetails(null);
          setEditingProduct(p);
          setIsAddProductOpen(true);
        }}
        onDelete={(p) => {
          setSelectedProductDetails(null);
          deleteProduct(p.id);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentWrap: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    maxWidth: 820,
    marginHorizontal: 'auto',
    width: '100%',
  },

  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  searchFlex: { flex: 1 },
  addProdBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 12,
    ...Shadows.sm,
  },
  addProdText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12.5 },

  financeSummaryBar: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  financeSummaryItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    gap: 2,
  },
  financeSummaryLabel: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  financeSummaryVal: {
    fontSize: 14.5,
    fontWeight: '800',
    textAlign: 'center',
    alignSelf: 'stretch',
    letterSpacing: -0.2,
    marginTop: 2,
  },
  financeSubLabel: {
    fontSize: 9,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 1,
  },
  financeSummaryDivider: {
    width: 1,
    marginVertical: 4,
  },
  profitPctPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BorderRadius.full,
    marginTop: 2,
  },
  profitPctText: {
    fontSize: 9,
    fontWeight: '800',
  },

  filterScroll: { maxHeight: 40, marginBottom: Spacing.sm },
  filterScrollContent: { gap: 8, alignItems: 'center', paddingRight: 4 },

  gridHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    paddingTop: 2,
  },
  showingText: {
    fontSize: 12.5,
    fontWeight: '500',
  },
  viewToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    padding: 2,
    gap: 2,
  },
  viewToggleBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  productsScroll: { flex: 1 },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    paddingBottom: 100,
  },
  cardContainer: {
    width: Platform.select({ web: 'calc(50% - 6px)' as any, default: '48%' }),
  },

  productsList: { gap: 8, paddingBottom: 100 },
  listRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    minHeight: 72,
    borderRadius: 12,
    gap: 10,
  },
  listThumbWrap: {
    width: 48,
    height: 48,
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listThumb: {
    width: '100%',
    height: '100%',
  },
  listRowContent: {
    flex: 1,
    gap: 3,
    justifyContent: 'center',
  },
  listRowName: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  listRowBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  listCategoryBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  listCategoryText: {
    fontSize: 10,
    fontWeight: '600',
  },
  listBarcodeText: {
    fontSize: 10,
    fontWeight: '500',
  },
  listStockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  listStockText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  listRowRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 2,
  },
  listRowPrice: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  listMarginChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  listMarginText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  smallActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
