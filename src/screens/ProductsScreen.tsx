import { HeroActionBanner, HeroStatsCard } from '@/components/HeroStatsCard';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailsDrawer } from '@/components/ProductDetailsDrawer';
import { ProductImage } from '@/components/ProductImage';
import { ShopStoreLoader } from '@/components/ShopStoreLoader';
import { SubScreenHeader } from '@/components/SubScreenHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { SearchBar } from '@/components/ui/SearchBar';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';
import { Product, ProductCategory } from '@/types';
import { formatCompactPrice } from '@/utils/formatters';
import { productIconFor } from '@/utils/productIcon';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
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
  const isDark = settings.darkMode;
  const softBorder = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(148,163,184,0.28)';
  const cardBg = isDark ? theme.card : '#FFFFFF';
  const accentBlue = isDark ? '#38BDF8' : '#0284C7';
  const softBlueBg = isDark ? 'rgba(56,189,248,0.16)' : '#EFF6FF';
  const isUrdu = language === 'ur';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<ProductCategory | 'LowStock' | 'OutOfStock'>('All');
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isFilterMenuMounted, setIsFilterMenuMounted] = useState(false);
  const filterMenuAnim = useRef(new Animated.Value(0)).current;

  const openFilterMenu = () => {
    setIsFilterMenuMounted(true);
    setIsFilterMenuOpen(true);
    Animated.spring(filterMenuAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 65,
    }).start();
  };

  const closeFilterMenu = () => {
    setIsFilterMenuOpen(false);
    Animated.timing(filterMenuAnim, {
      toValue: 0,
      duration: 140,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setIsFilterMenuMounted(false);
    });
  };

  const toggleFilterMenu = () => {
    if (isFilterMenuOpen) closeFilterMenu();
    else openFilterMenu();
  };

  const handleSelectStockFilter = (key: 'All' | 'LowStock' | 'OutOfStock') => {
    setSelectedFilter(key);
    closeFilterMenu();
  };

  const chevronRotate = filterMenuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const menuScale = filterMenuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1],
  });
  const menuTranslateY = filterMenuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-8, 0],
  });

  const viewMode = productsViewMode;

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

  const activeProduct = useMemo(() => {
    if (!selectedProductDetails) return null;
    return products.find((p) => p.id === selectedProductDetails.id) || selectedProductDetails;
  }, [products, selectedProductDetails]);

  const { stockRetailValue, inStockCount } = useMemo(() => {
    let retail = 0;
    let inStock = 0;
    products.forEach((p) => {
      if (p.stock > 0) {
        retail += (p.sellingPrice || 0) * p.stock;
        inStock += 1;
      }
    });
    return { stockRetailValue: retail, inStockCount: inStock };
  }, [products]);

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

  const filterOptions: {
    key: 'All' | 'LowStock' | 'OutOfStock';
    label: string;
    menuLabel: string;
    count: number;
    dotColor: string;
    pillBg: string;
    pillBorder: string;
    textColor: string;
  }[] = [
    {
      key: 'All',
      label: isUrdu ? 'سب' : 'All',
      menuLabel: isUrdu ? 'تمام اشیاء' : 'All Items',
      count: products.length,
      dotColor: accentBlue,
      pillBg: isDark ? 'rgba(56,189,248,0.16)' : '#EFF6FF',
      pillBorder: isDark ? 'rgba(56,189,248,0.34)' : 'rgba(2,132,199,0.26)',
      textColor: isDark ? '#7DD3FC' : '#0369A1',
    },
    {
      key: 'LowStock',
      label: isUrdu ? 'کم' : 'Low',
      menuLabel: isUrdu ? 'کم اسٹاک' : 'Low Stock',
      count: lowStockProducts.length,
      dotColor: '#F59E0B',
      pillBg: isDark ? 'rgba(245,158,11,0.18)' : '#FEF3C7',
      pillBorder: isDark ? 'rgba(245,158,11,0.38)' : 'rgba(217,119,6,0.3)',
      textColor: isDark ? '#FCD34D' : '#B45309',
    },
    {
      key: 'OutOfStock',
      label: isUrdu ? 'ختم' : 'Out',
      menuLabel: isUrdu ? 'ختم اسٹاک' : 'Out of Stock',
      count: outOfStockProducts.length,
      dotColor: '#EF4444',
      pillBg: isDark ? 'rgba(239,68,68,0.18)' : '#FEE2E2',
      pillBorder: isDark ? 'rgba(239,68,68,0.38)' : 'rgba(220,38,38,0.3)',
      textColor: isDark ? '#FCA5A5' : '#DC2626',
    },
  ];

  const activeFilterMeta =
    filterOptions.find((f) => f.key === selectedFilter) || filterOptions[0];

  const itemsBgImage = isDark
    ? require('../../assets/images/tile-items-dark.jpg')
    : require('../../assets/images/tile-items-light.jpg');
  const addItemBannerBg = require('../../assets/images/tile-items-dark.jpg');

  const headerFilterDropdown = (
    <View style={styles.filterAnchor}>
      <Pressable
        onPress={toggleFilterMenu}
        accessibilityRole="button"
        accessibilityLabel={isUrdu ? 'اسٹاک فلٹر' : 'Filter items by stock'}
        style={({ pressed }) => [
          styles.filterPill,
          {
            backgroundColor: activeFilterMeta.pillBg,
            borderColor: activeFilterMeta.pillBorder,
          },
          pressed && { opacity: 0.82 },
        ]}>
        <View style={[styles.chipDot, { backgroundColor: activeFilterMeta.dotColor }]} />
        <Text style={[styles.filterPillText, { color: activeFilterMeta.textColor }]}>
          {activeFilterMeta.label} ({activeFilterMeta.count})
        </Text>
        <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
          <Ionicons
            name="chevron-down"
            size={12}
            color={activeFilterMeta.textColor}
          />
        </Animated.View>
      </Pressable>

      {isFilterMenuMounted && (
        <Animated.View
          style={[
            styles.animatedFilterMenu,
            {
              backgroundColor: cardBg,
              borderColor: softBorder,
              opacity: filterMenuAnim,
              transform: [
                { translateY: menuTranslateY },
                { scale: menuScale },
              ],
              right: isUrdu ? undefined : 0,
              left: isUrdu ? 0 : undefined,
            },
          ]}>
          {filterOptions.map((opt, idx) => {
            const active = selectedFilter === opt.key;
            return (
              <React.Fragment key={opt.key}>
                {idx > 0 && <View style={[styles.menuDivider, { backgroundColor: softBorder }]} />}
                <Pressable
                  onPress={() => handleSelectStockFilter(opt.key)}
                  style={({ pressed }) => [
                    styles.menuItem,
                    active && {
                      backgroundColor: isDark
                        ? 'rgba(255, 255, 255, 0.06)'
                        : '#F1F5F9',
                    },
                    pressed && { opacity: 0.8 },
                  ]}>
                  <View style={[styles.chipDot, { backgroundColor: opt.dotColor }]} />
                  <View style={styles.menuItemTextWrap}>
                    <Text style={[styles.menuItemTitle, { color: theme.text }]}>
                      {opt.menuLabel}
                    </Text>
                    <Text style={[styles.menuItemSub, { color: theme.textMuted }]}>
                      {opt.count} {isUrdu ? 'آئٹمز' : opt.count === 1 ? 'item' : 'items'}
                    </Text>
                  </View>
                  {active && <Ionicons name="checkmark" size={15} color={accentBlue} />}
                </Pressable>
              </React.Fragment>
            );
          })}
        </Animated.View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SubScreenHeader
        title={isUrdu ? 'سامان و اسٹاک' : 'Items'}
        subtitle={`${products.length} ${isUrdu ? 'اشیاء' : products.length === 1 ? 'item' : 'items'}`}
        onBack={() => setActiveTab('dashboard')}
        rightElement={headerFilterDropdown}
      />

      {isFilterMenuOpen && (
        <Pressable style={styles.menuBackdrop} onPress={closeFilterMenu} />
      )}

      <ScrollView
        style={styles.productsMainScroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
        contentContainerStyle={styles.productsScrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[accentBlue]}
            tintColor={accentBlue}
          />
        }>
        {/* Index 0: Stylish Hero Stock Card + Big Add New Item Card */}
        <View style={styles.heroHeaderWrap}>
          <View style={styles.heroHeaderInner}>
            <HeroStatsCard
              bgImage={itemsBgImage}
              isDark={isDark}
              fallbackBg={isDark ? '#0B233D' : '#EFF6FF'}
              borderColor={isDark ? 'rgba(56,189,248,0.28)' : 'rgba(2,132,199,0.2)'}
              dotColor={isDark ? '#38BDF8' : '#0284C7'}
              eyebrow={isUrdu ? 'کل اسٹاک مالیت' : 'STOCK VALUE'}
              eyebrowColor={isDark ? '#7DD3FC' : '#0369A1'}
              pillText={`${products.length} ${isUrdu ? 'آئٹمز' : products.length === 1 ? 'item' : 'items'}`}
              currencySymbol={settings.currencySymbol}
              currencyColor={isDark ? '#38BDF8' : '#0284C7'}
              heroValue={stockRetailValue.toLocaleString()}
              metrics={[
                {
                  label: isUrdu ? 'موجود' : 'In Stock',
                  value: String(inStockCount),
                  valueColor: isDark ? '#34D399' : '#047857',
                },
                {
                  label: isUrdu ? 'کم اسٹاک' : 'Low Stock',
                  value: String(lowStockProducts.length),
                  valueColor:
                    lowStockProducts.length > 0
                      ? isDark
                        ? '#FBBF24'
                        : '#B45309'
                      : undefined,
                },
                {
                  label: isUrdu ? 'ختم' : 'Out',
                  value: String(outOfStockProducts.length),
                  valueColor:
                    outOfStockProducts.length > 0
                      ? isDark
                        ? '#F87171'
                        : '#DC2626'
                      : undefined,
                },
              ]}
            />

            <HeroActionBanner
              bgImage={addItemBannerBg}
              fallbackBg="#0369A1"
              borderColor="rgba(56,189,248,0.38)"
              scrimColor="rgba(3, 37, 76, 0.3)"
              icon="add-circle"
              title={isUrdu ? 'نیا آئٹم شامل کریں' : 'Add New Item'}
              subtitle={
                isUrdu
                  ? 'نام، قیمت اور اسٹاک فوری درج کریں'
                  : 'Tap to add product, price & stock'
              }
              arrowBg="rgba(255,255,255,0.95)"
              arrowColor="#0284C7"
              onPress={() => {
                setEditingProduct(null);
                setIsAddProductOpen(true);
              }}
              accessibilityLabel={isUrdu ? 'نیا آئٹم شامل کریں' : 'Add New Item'}
            />
          </View>
        </View>

        {/* Index 1: Sticky Search + View Toggle */}
        <View style={[styles.topActionBar, { backgroundColor: theme.background }]}>
          <View style={styles.topActionInner}>
            <View style={{ flex: 1 }}>
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={
                  isUrdu
                    ? 'نام یا بارکوڈ تلاش کریں...'
                    : 'Search item name or barcode...'
                }
                height={44}
              />
            </View>

            <View
              style={[
                styles.viewToggle,
                { backgroundColor: cardBg, borderColor: softBorder },
              ]}>
              <Pressable
                onPress={() => setProductsViewMode('grid')}
                style={[
                  styles.viewToggleBtn,
                  viewMode === 'grid' && { backgroundColor: softBlueBg },
                ]}
                accessibilityLabel="Grid view">
                <Ionicons
                  name="grid-outline"
                  size={16}
                  color={viewMode === 'grid' ? accentBlue : theme.textMuted}
                />
              </Pressable>
              <Pressable
                onPress={() => setProductsViewMode('list')}
                style={[
                  styles.viewToggleBtn,
                  viewMode === 'list' && { backgroundColor: softBlueBg },
                ]}
                accessibilityLabel="List view">
                <Ionicons
                  name="list-outline"
                  size={16}
                  color={viewMode === 'list' ? accentBlue : theme.textMuted}
                />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Index 2: Products Grid/List */}
        <View style={styles.contentWrap}>
          {isProductsLoading || isRefreshing || (!isLoaded && products.length === 0) ? (
            <ShopStoreLoader viewMode={viewMode} />
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              icon="cube-outline"
              title={isUrdu ? 'کوئی آئٹم نہیں ملا' : 'No items found'}
              subtitle={
                searchQuery
                  ? isUrdu
                    ? 'مختلف نام سے تلاش کریں۔'
                    : 'Try a different search term.'
                  : isUrdu
                    ? 'نیا آئٹم شامل کریں یا فلٹر تبدیل کریں۔'
                    : 'Add a new item or change the stock filter.'
              }
              actionLabel={isUrdu ? 'نیا آئٹم شامل کریں' : t('addProductBtn')}
              onAction={() => {
                setEditingProduct(null);
                setIsAddProductOpen(true);
              }}
            />
          ) : viewMode === 'list' ? (
            <View style={styles.productsList}>
              {filteredProducts.map((product) => {
                const threshold = product.lowStockThreshold ?? settings.lowStockThreshold ?? 5;
                const isOut = product.stock <= 0;
                const isLow = !isOut && product.stock <= threshold;

                const stockPill = isOut
                  ? {
                      bg: isDark ? 'rgba(239,68,68,0.18)' : '#FEE2E2',
                      text: isDark ? '#F87171' : '#DC2626',
                      label: isUrdu ? 'ختم' : t('soldOut'),
                    }
                  : isLow
                    ? {
                        bg: isDark ? 'rgba(245,158,11,0.18)' : '#FEF3C7',
                        text: isDark ? '#FBBF24' : '#D97706',
                        label: `${product.stock} ${product.unit}`,
                      }
                    : {
                        bg: isDark ? 'rgba(16,185,129,0.16)' : '#ECFDF5',
                        text: isDark ? '#34D399' : '#059669',
                        label: `${product.stock} ${product.unit}`,
                      };

                return (
                  <Pressable
                    key={product.id}
                    onPress={() => setSelectedProductDetails(product)}
                    style={({ pressed }) => [
                      styles.listRowCard,
                      {
                        backgroundColor: cardBg,
                        borderColor: isOut
                          ? isDark
                            ? 'rgba(239,68,68,0.45)'
                            : '#FCA5A5'
                          : isLow
                            ? isDark
                              ? 'rgba(245,158,11,0.45)'
                              : '#FCD34D'
                            : softBorder,
                      },
                      pressed && { opacity: 0.9, transform: [{ scale: 0.992 }] },
                    ]}>
                    <View
                      style={[
                        styles.listThumbWrap,
                        { backgroundColor: isDark ? '#1E293B' : '#F8FAFC' },
                      ]}>
                      <ProductImage
                        uri={product.image || product.imageUri}
                        style={styles.listThumb}
                        resizeMode="cover"
                        fallbackColor={accentBlue}
                        fallbackSize={22}
                        iconName={productIconFor(product.name, product.category)}
                      />
                    </View>

                    <View style={styles.listRowContent}>
                      <Text style={[styles.listRowName, { color: theme.text }]} numberOfLines={1}>
                        {isUrdu && product.nameUrdu ? product.nameUrdu : product.name}
                      </Text>
                      <View style={styles.listSubRow}>
                        <View style={[styles.listStockBadge, { backgroundColor: stockPill.bg }]}>
                          <Text style={[styles.listStockText, { color: stockPill.text }]}>
                            {stockPill.label}
                          </Text>
                        </View>
                        {product.barcode ? (
                          <Text
                            style={[styles.listBarcodeText, { color: theme.textMuted }]}
                            numberOfLines={1}>
                            #{product.barcode}
                          </Text>
                        ) : null}
                      </View>
                    </View>

                    <Text
                      style={[styles.listRowPrice, { color: accentBlue }]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.75}>
                      {settings.currencySymbol}
                      {formatCompactPrice(product.price)}
                    </Text>

                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation?.();
                        setEditingProduct(product);
                        setIsAddProductOpen(true);
                      }}
                      style={({ pressed }) => [
                        styles.smallActionBtn,
                        { backgroundColor: softBlueBg },
                        pressed && { opacity: 0.72, transform: [{ scale: 0.94 }] },
                      ]}
                      accessibilityLabel="Edit product">
                      <Ionicons name="create-outline" size={16} color={accentBlue} />
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
  heroHeaderWrap: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 10,
    paddingBottom: 6,
  },
  heroHeaderInner: {
    width: '100%',
    maxWidth: 720,
    marginHorizontal: 'auto',
    gap: 10,
  },
  topActionBar: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 10,
    paddingBottom: 12,
  },
  topActionInner: {
    width: '100%',
    maxWidth: 720,
    marginHorizontal: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  filterAnchor: {
    position: 'relative',
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 11,
    height: 36,
    borderRadius: 12,
    borderCurve: 'continuous',
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  chipDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 30,
  },
  animatedFilterMenu: {
    position: 'absolute',
    top: 42,
    minWidth: 185,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    padding: 6,
    gap: 2,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderCurve: 'continuous',
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
  viewToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 12,
    borderCurve: 'continuous',
    borderWidth: 1,
    padding: 4,
    gap: 2,
  },
  viewToggleBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productsMainScroll: {
    flex: 1,
  },
  productsScrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.xl,
  },
  contentWrap: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: 4,
    maxWidth: 720,
    marginHorizontal: 'auto',
    width: '100%',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingBottom: 100,
  },
  cardContainer: {
    width: Platform.select({ web: 'calc(50% - 5px)' as any, default: '48.5%' }),
  },
  productsList: {
    gap: 8,
    paddingBottom: 100,
  },
  listRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 12,
    minHeight: 68,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    gap: 11,
  },
  listThumbWrap: {
    width: 46,
    height: 46,
    borderRadius: 13,
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
    gap: 4,
    justifyContent: 'center',
    minWidth: 0,
  },
  listRowName: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  listSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  listBarcodeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  listStockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  listStockText: {
    fontSize: 11,
    fontWeight: '700',
  },
  listRowPrice: {
    fontSize: 15.5,
    fontWeight: '800',
    letterSpacing: -0.3,
    fontVariant: ['tabular-nums'],
  },
  smallActionBtn: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
