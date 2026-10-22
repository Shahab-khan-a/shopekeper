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
    totalInventoryInvestment,
    totalInventoryRetailValue,
    totalExpectedStockProfit,
    t,
    language,
    lowStockProducts,
    outOfStockProducts,
    showAlert,
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

  const alertCount = lowStockProducts.length + outOfStockProducts.length;

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

  const profitPct =
    totalInventoryInvestment > 0
      ? ((totalExpectedStockProfit / totalInventoryInvestment) * 100).toFixed(1)
      : '0.0';

  const softBorder = settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(148,163,184,0.4)';
  const cardBg = settings.darkMode ? theme.card : '#FFFFFF';

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* ── Emerald Hero Canopy Header ── */}
      <View style={[styles.heroCanopy, { backgroundColor: theme.heroBg }]}>
        <View style={styles.heroInner}>
          {/* Row 1: Screen Header (Title + Quick Action Buttons) */}
          <View style={styles.navHeaderRow}>
            <View style={styles.titleWrap}>
              <Text style={styles.screenTitleText}>
                {language === 'ur' ? 'اسٹاک و سامان' : 'Products'}
              </Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>
                  {products.length}
                </Text>
              </View>
            </View>

            <View style={styles.actionBtnRow}>
              {/* Catalog Import Button */}
              <Pressable
                onPress={() => setIsCatalogOpen(true)}
                accessibilityRole="button"
                accessibilityLabel="Open Master Catalog"
                style={({ pressed }) => [
                  styles.catalogHeaderBtn,
                  pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] },
                ]}>
                <Ionicons name="library-outline" size={15} color="#FFFFFF" />
                <Text style={styles.catalogHeaderBtnText}>
                  {language === 'ur' ? 'کیٹلاگ' : 'Catalog'}
                </Text>
              </Pressable>

              {/* Add Product Primary Button */}
              <Pressable
                onPress={() => {
                  setEditingProduct(null);
                  setIsAddProductOpen(true);
                }}
                accessibilityRole="button"
                accessibilityLabel="Add New Product"
                style={({ pressed }) => [
                  styles.addProdHeaderBtn,
                  { backgroundColor: settings.darkMode ? theme.primary : '#FFFFFF' },
                  pressed && { opacity: 0.9, transform: [{ scale: 0.96 }] },
                ]}>
                <Ionicons
                  name="add-circle"
                  size={16}
                  color={settings.darkMode ? '#FFFFFF' : '#064E3B'}
                />
                <Text
                  style={[
                    styles.addProdHeaderText,
                    { color: settings.darkMode ? '#FFFFFF' : '#064E3B' },
                  ]}>
                  {language === 'ur' ? 'نیا آئٹم' : t('addProductBtn')}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Row 2: Dedicated Full-Width Search Bar */}
          <View style={styles.fullSearchBarWrap}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={
                language === 'ur'
                  ? 'اشیاء کا نام یا بارکوڈ تلاش کریں...'
                  : 'Search by item name or barcode...'
              }
              height={42}
            />
          </View>

          {/* ── 3 Visual Inventory Action Pillars (All Items, Low Stock, Out of Stock) ── */}
          <View style={styles.compactMetricBar}>
            {/* 1. Total Catalog Items */}
            <Pressable
              onPress={() => setSelectedFilter('All')}
              style={({ pressed }) => [
                styles.compactMetricItem,
                selectedFilter === 'All' && styles.compactMetricItemActive,
                pressed && { opacity: 0.8 },
              ]}>
              <Text style={styles.compactMetricTitle} numberOfLines={1}>
                {language === 'ur' ? 'تمام سامان' : 'All Items'}
              </Text>
              <View style={styles.metricValRow}>
                <Ionicons name="cube" size={12} color="#A7F3D0" />
                <Text
                  style={styles.compactMetricBold}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.7}>
                  {products.length}
                </Text>
              </View>
              <Text style={styles.compactMetricSub} numberOfLines={1}>
                {language === 'ur' ? 'کل اشیاء' : 'in store'}
              </Text>
            </Pressable>

            <View style={styles.compactMetricDivider} />

            {/* 2. Low Stock (Reorder Alert) */}
            <Pressable
              onPress={() => setSelectedFilter('LowStock')}
              style={({ pressed }) => [
                styles.compactMetricItem,
                selectedFilter === 'LowStock' && styles.compactMetricItemActive,
                pressed && { opacity: 0.8 },
              ]}>
              <Text style={[styles.compactMetricTitle, { color: '#FDE68A' }]} numberOfLines={1}>
                {language === 'ur' ? 'کم اسٹاک' : 'Low Stock'}
              </Text>
              <View style={styles.metricValRow}>
                <Ionicons name="alert-circle" size={12} color="#FDE68A" />
                <Text
                  style={[styles.compactMetricBold, { color: '#FDE68A' }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.7}>
                  {lowStockProducts.length}
                </Text>
              </View>
              <Text style={[styles.compactMetricSub, { color: '#FDE68A' }]} numberOfLines={1}>
                {language === 'ur' ? 'آرڈر کریں' : 'reorder'}
              </Text>
            </Pressable>

            <View style={styles.compactMetricDivider} />

            {/* 3. Out of Stock (Urgent Sold Out) */}
            <Pressable
              onPress={() => setSelectedFilter('OutOfStock')}
              style={({ pressed }) => [
                styles.compactMetricItem,
                selectedFilter === 'OutOfStock' && styles.compactMetricItemActive,
                pressed && { opacity: 0.8 },
              ]}>
              <Text style={[styles.compactMetricTitle, { color: '#FCA5A5' }]} numberOfLines={1}>
                {language === 'ur' ? 'ختم شدہ' : 'Out of Stock'}
              </Text>
              <View style={styles.metricValRow}>
                <Ionicons name="close-circle" size={12} color="#FCA5A5" />
                <Text
                  style={[styles.compactMetricBold, { color: '#FCA5A5' }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.7}>
                  {outOfStockProducts.length}
                </Text>
              </View>
              <Text style={[styles.compactMetricSub, { color: '#FCA5A5' }]} numberOfLines={1}>
                {language === 'ur' ? 'دستیاب نہیں' : 'sold out'}
              </Text>
            </Pressable>
          </View>

          {/* Dynamic Category Filters: Only shown when store has 2 or more distinct categories */}
          {dynamicCategories.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScroll}
              contentContainerStyle={styles.filterScrollContent}>
              {/* All Departments Chip */}
              <FilterChip
                key="All"
                label={language === 'ur' ? `تمام شعبہ جات (${products.length})` : `All (${products.length})`}
                isActive={selectedFilter === 'All'}
                onPress={() => setSelectedFilter('All')}
                activeBg="#FFFFFF"
                activeColor="#064E3B"
                inactiveBg="rgba(255, 255, 255, 0.16)"
                inactiveBorder="rgba(255, 255, 255, 0.25)"
                inactiveColor="#FFFFFF"
              />

              {/* Dynamic store category chips */}
              {dynamicCategories.map((cat) => {
                const count = categoryCounts[cat] || 0;
                const isSelected = selectedFilter === cat;

                return (
                  <FilterChip
                    key={cat}
                    label={`${cat} (${count})`}
                    isActive={isSelected}
                    onPress={() => setSelectedFilter(cat as ProductCategory)}
                    activeBg="#FFFFFF"
                    activeColor="#064E3B"
                    inactiveBg="rgba(255, 255, 255, 0.16)"
                    inactiveBorder="rgba(255, 255, 255, 0.25)"
                    inactiveColor="#FFFFFF"
                  />
                );
              })}
            </ScrollView>
          )}
        </View>
      </View>

      {/* ── Main Content Area ── */}
      <View style={styles.contentWrap}>
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
                    pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
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
  contentWrap: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
    maxWidth: 820,
    marginHorizontal: 'auto',
    width: '100%',
  },

  heroCanopy: {
    width: '100%',
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderWidth: 0,
    borderTopWidth: 0,
    elevation: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
  },
  heroInner: {
    maxWidth: 820,
    marginHorizontal: 'auto',
    width: '100%',
    paddingHorizontal: Spacing.md,
    gap: 8,
  },
  navHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  screenTitleText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  countBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  actionBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  catalogHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 34,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  catalogHeaderBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addProdHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 34,
    paddingHorizontal: 11,
    borderRadius: 10,
    ...Shadows.sm,
  },
  addProdHeaderText: {
    fontSize: 12,
    fontWeight: '800',
  },
  fullSearchBarWrap: {
    width: '100%',
    marginTop: 1,
    marginBottom: 2,
  },

  compactMetricBar: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 4,
  },
  compactMetricItem: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 1,
    gap: 1,
    borderRadius: 8,
  },
  compactMetricItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  compactMetricTitle: {
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  metricValRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2.5,
    marginTop: 1,
    maxWidth: '100%',
    flexShrink: 1,
  },
  compactMetricBold: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  compactMetricSub: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 9,
    fontWeight: '500',
    textAlign: 'center',
  },
  compactMetricDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    marginVertical: 2,
  },

  filterScroll: { maxHeight: 38 },
  filterScrollContent: { gap: 8, alignItems: 'center', paddingRight: 4 },

  gridHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    paddingTop: 4,
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
    gap: 12,
    paddingBottom: 100,
  },
  cardContainer: {
    width: Platform.select({ web: 'calc(50% - 6px)' as any, default: '48.2%' }),
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
