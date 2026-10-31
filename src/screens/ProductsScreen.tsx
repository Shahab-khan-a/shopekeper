import { ProductCard } from '@/components/ProductCard';
import { ProductDetailsDrawer } from '@/components/ProductDetailsDrawer';
import { ProductImage } from '@/components/ProductImage';
import { EmptyState } from '@/components/ui/EmptyState';
import { FilterChip } from '@/components/ui/FilterChip';
import { SearchBar } from '@/components/ui/SearchBar';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';
import { Product, ProductCategory } from '@/types';
import { formatCompactPrice } from '@/utils/formatters';
import { productIconFor } from '@/utils/productIcon';
import { ShopStoreLoader } from '@/components/ShopStoreLoader';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { CatalogImportModal } from '@/components/CatalogImportModal';
import { ShopTypePickerModal } from '@/components/ShopTypePickerModal';

export const ProductsScreen: React.FC = () => {
  const {
    products,
    isProductsLoading,
    isLoaded,
    refreshProducts,
    deleteProduct,
    setEditingProduct,
    setIsAddProductOpen,
    settings,
    t,
    language,
    lowStockProducts,
    outOfStockProducts,
    productsViewMode,
    setProductsViewMode,
  } = useShop();

  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<ProductCategory | 'LowStock' | 'OutOfStock'>('All');
  const viewMode = productsViewMode;
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isTypePickerOpen, setIsTypePickerOpen] = useState(false);

  // If products are not loaded or empty on mount, trigger fresh fetch
  useEffect(() => {
    if (products.length === 0 && !isProductsLoading && isLoaded) {
      refreshProducts();
    }
  }, [products.length, isProductsLoading, isLoaded, refreshProducts]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshProducts();
    } finally {
      setIsRefreshing(false);
    }
  };

  const setViewModePersist = (mode: 'grid' | 'list') => {
    setProductsViewMode(mode);
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
        const threshold = p.lowStockThreshold ?? settings.lowStockThreshold ?? 5;
        return p.stock > 0 && p.stock <= threshold;
      }
      if (selectedFilter === 'OutOfStock') {
        return p.stock <= 0;
      }
      return p.category === selectedFilter;
    });
  }, [products, searchQuery, selectedFilter, settings.lowStockThreshold]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: products.length };
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Dynamic store departments/categories derived purely from products in stock
  const dynamicCategories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      const cat = p.category?.trim();
      if (cat) set.add(cat);
    });
    return Array.from(set).sort();
  }, [products]);

  const softBorder = settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(148,163,184,0.18)';
  const cardBg = settings.darkMode ? theme.card : '#FFFFFF';
  const isUrdu = language === 'ur';

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.topSection}>
        <View style={styles.titleRow}>
          <Text style={[styles.screenTitleText, { color: theme.text }]}>
            {isUrdu ? 'اسٹاک و سامان' : 'Products'}
          </Text>
          <Text style={[styles.countText, { color: theme.textMuted }]}>
            {products.length} {isUrdu ? 'اشیاء' : products.length === 1 ? 'item' : 'items'}
          </Text>
        </View>

        <View style={styles.actionRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isUrdu ? 'نیا آئٹم' : t('addProductBtn')}
            onPress={() => {
              setEditingProduct(null);
              setIsAddProductOpen(true);
            }}
            style={({ pressed }) => [
              styles.actionTile,
              { backgroundColor: theme.heroFill },
              pressed && { opacity: 0.9 },
            ]}>
            <View style={styles.actionIconWrap}>
              <Ionicons name="add" size={18} color="#FFFFFF" />
            </View>
            <Text style={styles.actionTileTitle}>
              {isUrdu ? 'نیا آئٹم' : t('addProductBtn')}
            </Text>
            <Text style={styles.actionTileSub}>
              {isUrdu ? 'اسٹاک میں شامل کریں' : 'Add to stock'}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isUrdu ? 'کیٹلاگ' : 'Catalog'}
            onPress={() => setIsCatalogOpen(true)}
            style={({ pressed }) => [
              styles.actionTile,
              { backgroundColor: theme.secondary },
              pressed && { opacity: 0.9 },
            ]}>
            <View style={styles.actionIconWrap}>
              <Ionicons name="library-outline" size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.actionTileTitle}>
              {isUrdu ? 'کیٹلاگ' : 'Catalog'}
            </Text>
            <Text style={styles.actionTileSub}>
              {isUrdu ? 'تیار فہرست' : 'Ready-made list'}
            </Text>
          </Pressable>
        </View>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={
            isUrdu
              ? 'اشیاء کا نام یا بارکوڈ تلاش کریں...'
              : 'Search by item name or barcode...'
          }
          height={42}
        />

        <View style={styles.metricRow}>
          <Pressable
            onPress={() => setSelectedFilter('All')}
            style={({ pressed }) => [
              styles.metricCard,
              {
                backgroundColor: theme.card,
                borderColor: selectedFilter === 'All' ? theme.primary : softBorder,
              },
              pressed && { opacity: 0.88 },
            ]}>
            <Text style={[styles.metricLabel, { color: theme.textMuted }]}>
              {isUrdu ? 'تمام' : 'All'}
            </Text>
            <Text style={[styles.metricValue, { color: theme.text }]}>{products.length}</Text>
          </Pressable>

          <Pressable
            onPress={() => setSelectedFilter('LowStock')}
            style={({ pressed }) => [
              styles.metricCard,
              {
                backgroundColor: theme.card,
                borderColor: selectedFilter === 'LowStock' ? theme.warning : softBorder,
              },
              pressed && { opacity: 0.88 },
            ]}>
            <Text style={[styles.metricLabel, { color: theme.warning }]}>
              {isUrdu ? 'کم اسٹاک' : 'Low'}
            </Text>
            <Text style={[styles.metricValue, { color: theme.warning }]}>
              {lowStockProducts.length}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setSelectedFilter('OutOfStock')}
            style={({ pressed }) => [
              styles.metricCard,
              {
                backgroundColor: theme.card,
                borderColor: selectedFilter === 'OutOfStock' ? theme.danger : softBorder,
              },
              pressed && { opacity: 0.88 },
            ]}>
            <Text style={[styles.metricLabel, { color: theme.danger }]}>
              {isUrdu ? 'ختم' : 'Out'}
            </Text>
            <Text style={[styles.metricValue, { color: theme.danger }]}>
              {outOfStockProducts.length}
            </Text>
          </Pressable>
        </View>

        {dynamicCategories.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
            contentContainerStyle={styles.filterScrollContent}>
            <FilterChip
              key="All"
              label={isUrdu ? `تمام (${products.length})` : `All (${products.length})`}
              isActive={selectedFilter === 'All'}
              onPress={() => setSelectedFilter('All')}
            />
            {dynamicCategories.map((cat) => {
              const count = categoryCounts[cat] || 0;
              return (
                <FilterChip
                  key={cat}
                  label={`${cat} (${count})`}
                  isActive={selectedFilter === cat}
                  onPress={() => setSelectedFilter(cat as ProductCategory)}
                />
              );
            })}
          </ScrollView>
        )}
      </View>

      <View style={styles.contentWrap}>
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

        {isProductsLoading || isRefreshing || (!isLoaded && products.length === 0) ? (
          <ShopStoreLoader viewMode={viewMode} />
        ) : filteredProducts.length === 0 ? (
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
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={[theme.primary]}
                tintColor={theme.primary}
              />
            }>
            {filteredProducts.map((product) => {
              const isOut = product.stock <= 0;
              const isLow = !isOut && product.stock <= (settings.lowStockThreshold || 5);
              const hasCost = product.costPrice !== undefined && product.costPrice !== null && product.costPrice > 0;
              const margin =
                hasCost && product.price > 0
                  ? Math.round(((product.price - (product.costPrice as number)) / product.price) * 100)
                  : null;

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
                    pressed && { opacity: 0.9 },
                  ]}>
                  <View style={[styles.listThumbWrap, { backgroundColor: theme.surfaceSubtle }]}>
                    <ProductImage
                      uri={product.image || product.imageUri}
                      style={styles.listThumb}
                      resizeMode="cover"
                      fallbackColor={theme.textMuted}
                      fallbackSize={24}
                      iconName={productIconFor(product.name, product.category)}
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
                      {isOut
                        ? (language === 'ur' ? 'ختم' : t('soldOut'))
                        : `${product.stock} ${product.unit}`}
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
                    {margin !== null && margin > 0 ? (
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
                      setEditingProduct(product);
                      setIsAddProductOpen(true);
                    }}
                    style={({ pressed }) => [
                      styles.smallActionBtn,
                      {
                        backgroundColor: settings.darkMode
                          ? 'rgba(16,185,129,0.14)'
                          : 'rgba(167,243,208,0.45)',
                      },
                      pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] },
                    ]}
                    accessibilityLabel="Edit product">
                    <Ionicons name="create-outline" size={15} color={theme.primary} />
                  </Pressable>
                </Pressable>
              );
            })}
          </ScrollView>
        ) : (
          <ScrollView
            style={styles.productsScroll}
            contentContainerStyle={styles.productsGrid}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={[theme.primary]}
                tintColor={theme.primary}
              />
            }>
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

      {/* Ready-made catalog import (loaded shop type) + shop-type picker */}
      <CatalogImportModal
        visible={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        onChooseType={() => {
          setIsCatalogOpen(false);
          setIsTypePickerOpen(true);
        }}
      />
      <ShopTypePickerModal visible={isTypePickerOpen} onClose={() => setIsTypePickerOpen(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  topSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 8,
    paddingBottom: 4,
    maxWidth: 720,
    marginHorizontal: 'auto',
    width: '100%',
    gap: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  screenTitleText: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionTile: {
    flex: 1,
    borderRadius: 18,
    borderCurve: 'continuous',
    padding: 12,
    gap: 2,
    minHeight: 86,
    justifyContent: 'flex-end',
  },
  actionIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  actionTileTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  actionTileSub: {
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: 12,
    fontWeight: '500',
  },
  metricRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metricCard: {
    flex: 1,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 1,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.4,
    fontVariant: ['tabular-nums'],
  },

  filterScroll: { maxHeight: 38 },
  filterScrollContent: { gap: 8, alignItems: 'center', paddingRight: 4 },

  contentWrap: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    maxWidth: 720,
    marginHorizontal: 'auto',
    width: '100%',
  },
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
    gap: 8,
    paddingBottom: 100,
  },
  cardContainer: {
    width: Platform.select({ web: 'calc(50% - 4px)' as any, default: '48.6%' }),
  },

  productsList: { gap: 8, paddingBottom: 100 },
  listRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    minHeight: 68,
    borderRadius: 12,
    gap: 10,
  },
  listThumbWrap: {
    width: 44,
    height: 44,
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
    gap: 2,
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
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 5,
  },
  listCategoryText: {
    fontSize: 10,
    fontWeight: '600',
  },
  listBarcodeText: {
    fontSize: 9.5,
    fontWeight: '500',
  },
  listStockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  listStockText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  listRowRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 1,
  },
  listRowPrice: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  listMarginChip: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
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
