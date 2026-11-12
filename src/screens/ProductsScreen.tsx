import { ProductCard } from '@/components/ProductCard';
import { ProductDetailsDrawer } from '@/components/ProductDetailsDrawer';
import { ProductImage } from '@/components/ProductImage';
import { SubScreenHeader } from '@/components/SubScreenHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { SearchBar } from '@/components/ui/SearchBar';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';
import { Product, ProductCategory } from '@/types';
import { formatCompactPrice } from '@/utils/formatters';
import { productIconFor } from '@/utils/productIcon';
import { ShopStoreLoader } from '@/components/ShopStoreLoader';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

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
    setActiveTab,
  } = useShop();

  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const softBorder = settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(148,163,184,0.18)';
  const cardBg = settings.darkMode ? theme.card : '#FFFFFF';
  const isUrdu = language === 'ur';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<ProductCategory | 'LowStock' | 'OutOfStock'>('All');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const menuAnim = useRef(new Animated.Value(0)).current;



  const openFilterMenu = () => {
    setIsMenuMounted(true);
    setIsFilterMenuOpen(true);
    Animated.spring(menuAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 65,
    }).start();
  };

  const closeFilterMenu = () => {
    setIsFilterMenuOpen(false);
    Animated.timing(menuAnim, {
      toValue: 0,
      duration: 140,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setIsMenuMounted(false);
      }
    });
  };

  const toggleFilterMenu = () => {
    if (isFilterMenuOpen) {
      closeFilterMenu();
    } else {
      openFilterMenu();
    }
  };



  const handleSelectFilter = (filter: ProductCategory | 'LowStock' | 'OutOfStock') => {
    setSelectedFilter(filter);
    closeFilterMenu();
  };

  const chevronRotate = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const menuScale = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1],
  });

  const menuTranslateY = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-6, 0],
  });

  const activeFilterMeta = useMemo(() => {
    if (selectedFilter === 'LowStock') {
      return {
        label: isUrdu ? `کم (${lowStockProducts.length})` : `Low (${lowStockProducts.length})`,
        dotColor: '#F59E0B',
        pillBg: settings.darkMode ? 'rgba(245, 158, 11, 0.16)' : '#FEF3C7',
        pillBorder: settings.darkMode ? 'rgba(245, 158, 11, 0.35)' : '#FDE68A',
        textColor: settings.darkMode ? '#FBBF24' : '#B45309',
      };
    }
    if (selectedFilter === 'OutOfStock') {
      return {
        label: isUrdu ? `ختم (${outOfStockProducts.length})` : `Out (${outOfStockProducts.length})`,
        dotColor: '#EF4444',
        pillBg: settings.darkMode ? 'rgba(239, 68, 68, 0.16)' : '#FEE2E2',
        pillBorder: settings.darkMode ? 'rgba(239, 68, 68, 0.35)' : '#FECACA',
        textColor: settings.darkMode ? '#F87171' : '#B91C1C',
      };
    }
    const hasAlerts = outOfStockProducts.length > 0 || lowStockProducts.length > 0;
    const alertDotColor = outOfStockProducts.length > 0 ? '#EF4444' : '#F59E0B';
    return {
      label: isUrdu ? 'تمام اسٹاک' : 'All stock',
      dotColor: hasAlerts ? alertDotColor : theme.primary,
      pillBg: cardBg,
      pillBorder: softBorder,
      textColor: theme.text,
    };
  }, [
    selectedFilter,
    isUrdu,
    lowStockProducts.length,
    outOfStockProducts.length,
    settings.darkMode,
    theme.primary,
    theme.text,
    cardBg,
    softBorder,
  ]);
  const viewMode = productsViewMode;
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

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



  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SubScreenHeader
        title={isUrdu ? 'سامان و اسٹاک' : 'Items'}
        subtitle={`${products.length} ${isUrdu ? 'اشیاء' : products.length === 1 ? 'item' : 'items'}`}
        onBack={() => setActiveTab('dashboard')}
      />
      {isMenuMounted && (
        <Pressable
          style={styles.menuBackdrop}
          onPress={closeFilterMenu}
          accessibilityLabel="Close filter menu"
        />
      )}

      <ScrollView
        style={styles.productsMainScroll}
        stickyHeaderIndices={[1]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productsScrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }>
        {/* Index 0: Top Cards (Title row with filter pill + Action tiles: Add Product & Catalog) */}
        <View style={styles.topSection}>
          <View style={styles.topCardsWrap}>
          <View style={styles.titleRow}>
            <View style={styles.titleSpacer} />

            <Pressable
              onPress={toggleFilterMenu}
              accessibilityRole="button"
              accessibilityLabel={isUrdu ? 'اسٹاک فلٹر مینو' : 'Stock filter menu'}
              style={({ pressed }) => [
                styles.stockFilterPill,
                {
                  backgroundColor: activeFilterMeta.pillBg,
                  borderColor: activeFilterMeta.pillBorder,
                },
                pressed && { opacity: 0.8 },
              ]}>
              <View
                style={[
                  styles.stockFilterDot,
                  { backgroundColor: activeFilterMeta.dotColor },
                ]}
              />
              <Text
                style={[
                  styles.stockFilterPillText,
                  { color: activeFilterMeta.textColor },
                ]}>
                {activeFilterMeta.label}
              </Text>
              <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
                <Ionicons
                  name="chevron-down"
                  size={13}
                  color={activeFilterMeta.textColor}
                />
              </Animated.View>
            </Pressable>

            {isMenuMounted && (
              <Animated.View
                style={[
                  styles.animatedFilterMenu,
                  {
                    backgroundColor: cardBg,
                    borderColor: softBorder,
                    opacity: menuAnim,
                    transform: [
                      { translateY: menuTranslateY },
                      { scale: menuScale },
                    ],
                    right: isUrdu ? undefined : 0,
                    left: isUrdu ? 0 : undefined,
                  },
                ]}>
                <Pressable
                  onPress={() => handleSelectFilter('All')}
                  style={({ pressed }) => [
                    styles.menuItem,
                    selectedFilter === 'All' && {
                      backgroundColor: settings.darkMode
                        ? 'rgba(255, 255, 255, 0.06)'
                        : '#F1F5F9',
                    },
                    pressed && { opacity: 0.8 },
                  ]}>
                  <View style={[styles.menuItemDot, { backgroundColor: theme.primary }]} />
                  <View style={styles.menuItemTextWrap}>
                    <Text style={[styles.menuItemTitle, { color: theme.text }]}>
                      {isUrdu ? 'تمام اشیاء' : 'All products'}
                    </Text>
                    <Text style={[styles.menuItemSub, { color: theme.textMuted }]}>
                      {products.length} {isUrdu ? 'کل اشیاء' : products.length === 1 ? 'item' : 'items'}
                    </Text>
                  </View>
                  {selectedFilter === 'All' && (
                    <Ionicons name="checkmark" size={16} color={theme.primary} />
                  )}
                </Pressable>

                <View style={[styles.menuDivider, { backgroundColor: softBorder }]} />

                <Pressable
                  onPress={() => handleSelectFilter('LowStock')}
                  style={({ pressed }) => [
                    styles.menuItem,
                    selectedFilter === 'LowStock' && {
                      backgroundColor: settings.darkMode
                        ? 'rgba(245, 158, 11, 0.12)'
                        : '#FEF3C7',
                    },
                    pressed && { opacity: 0.8 },
                  ]}>
                  <View style={[styles.menuItemDot, { backgroundColor: '#F59E0B' }]} />
                  <View style={styles.menuItemTextWrap}>
                    <Text style={[styles.menuItemTitle, { color: theme.text }]}>
                      {isUrdu ? 'کم اسٹاک' : 'Low stock'}
                    </Text>
                    <Text style={[styles.menuItemSub, { color: theme.warning }]}>
                      {lowStockProducts.length} {isUrdu ? 'اشیاء کم ہیں' : 'items low'}
                    </Text>
                  </View>
                  {selectedFilter === 'LowStock' && (
                    <Ionicons name="checkmark" size={16} color="#D97706" />
                  )}
                </Pressable>

                <View style={[styles.menuDivider, { backgroundColor: softBorder }]} />

                <Pressable
                  onPress={() => handleSelectFilter('OutOfStock')}
                  style={({ pressed }) => [
                    styles.menuItem,
                    selectedFilter === 'OutOfStock' && {
                      backgroundColor: settings.darkMode
                        ? 'rgba(239, 68, 68, 0.12)'
                        : '#FEE2E2',
                    },
                    pressed && { opacity: 0.8 },
                  ]}>
                  <View style={[styles.menuItemDot, { backgroundColor: '#EF4444' }]} />
                  <View style={styles.menuItemTextWrap}>
                    <Text style={[styles.menuItemTitle, { color: theme.text }]}>
                      {isUrdu ? 'ختم شدہ اسٹاک' : 'Out of stock'}
                    </Text>
                    <Text style={[styles.menuItemSub, { color: theme.danger }]}>
                      {outOfStockProducts.length} {isUrdu ? 'اشیاء ختم ہیں' : 'items empty'}
                    </Text>
                  </View>
                  {selectedFilter === 'OutOfStock' && (
                    <Ionicons name="checkmark" size={16} color="#DC2626" />
                  )}
                </Pressable>
              </Animated.View>
            )}
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
          </View>
        </View>
      </View>

      {/* Index 1: Sticky Search Bar (Always remains pinned at the top on scroll) */}
      <View
        style={[
          styles.stickySearchWrap,
          { backgroundColor: theme.background },
        ]}>
        <View style={styles.stickySearchInner}>
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
        </View>
      </View>

      {/* Index 2: Products List / Grid or Empty State */}
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
          <View style={styles.productsList}>
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
                    {product.barcode ? (
                      <Text
                        style={[styles.listBarcodeText, { color: theme.textMuted }]}
                        numberOfLines={1}>
                        # {product.barcode}
                      </Text>
                    ) : (
                      <Text style={[styles.listBarcodeText, { color: theme.textMuted }]} numberOfLines={1}>
                        {product.unit}
                      </Text>
                    )}
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
          </View>
        ) : (
          <View style={styles.productsGrid}>
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
          </View>
        )}
      </View>
    </ScrollView>

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
  productsMainScroll: {
    flex: 1,
  },
  productsScrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.xl,
  },
  topSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 8,
    paddingBottom: 4,
    maxWidth: 720,
    marginHorizontal: 'auto',
    width: '100%',
    gap: 10,
    zIndex: 30,
  },
  topCardsWrap: {
    gap: 10,
  },
  stickySearchWrap: {
    width: '100%',
    zIndex: 10,
    paddingHorizontal: Spacing.lg,
    paddingTop: 4,
    paddingBottom: 8,
  },
  stickySearchInner: {
    width: '100%',
    maxWidth: 720,
    marginHorizontal: 'auto',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    position: 'relative',
    zIndex: 40,
  },
  titleLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  titleSpacer: {
    flex: 1,
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
  stockFilterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderCurve: 'continuous',
    borderWidth: 1,
  },
  stockFilterDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  stockFilterPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 25,
  },
  animatedFilterMenu: {
    position: 'absolute',
    top: 36,
    minWidth: 200,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    padding: 6,
    gap: 2,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderCurve: 'continuous',
  },
  menuItemDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  menuItemTextWrap: {
    flex: 1,
    gap: 1,
  },
  menuItemTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  menuItemSub: {
    fontSize: 11,
    fontWeight: '500',
  },
  menuDivider: {
    height: 1,
    marginHorizontal: 6,
    marginVertical: 2,
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
