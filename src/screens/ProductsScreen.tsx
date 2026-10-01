import { ProductCard } from '@/components/ProductCard';
import { ProductDetailsDrawer } from '@/components/ProductDetailsDrawer';
import { ProductImage } from '@/components/ProductImage';
import { EmptyState } from '@/components/ui/EmptyState';
import { FilterChip } from '@/components/ui/FilterChip';
import { IconButton } from '@/components/ui/IconButton';
import { SearchBar } from '@/components/ui/SearchBar';
import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';
import { Product, ProductCategory } from '@/types';
import { formatCompactPrice } from '@/utils/formatters';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

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

  const toggleViewMode = () => {
    setViewMode((prev) => {
      const next = prev === 'grid' ? 'list' : 'grid';
      AsyncStorage.setItem(PRODUCTS_VIEW_MODE_KEY, next).catch(() => {});
      return next;
    });
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
            onPress={toggleViewMode}
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
        <View
          style={[
            styles.financeSummaryBar,
            {
              backgroundColor: settings.darkMode ? '#161F30' : '#FFFFFF',
              borderColor: settings.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
            },
          ]}>
          {/* Stat 1: Total Investment */}
          <View style={styles.financeSummaryItem}>
            <View style={styles.statLabelRow}>
              <Text style={[styles.financeSummaryLabel, { color: theme.textSecondary }]} numberOfLines={2}>
                {t('totalInvestment')}
              </Text>
            </View>
            <Text
              style={[styles.financeSummaryVal, { color: theme.text }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}>
              {settings.currencySymbol}{totalInventoryInvestment.toLocaleString()}
            </Text>
          </View>

          <View style={[styles.financeSummaryDivider, { backgroundColor: settings.darkMode ? 'rgba(255,255,255,0.08)' : '#F1F5F9' }]} />

          {/* Stat 2: Retail Value */}
          <View style={styles.financeSummaryItem}>
            <View style={styles.statLabelRow}>
              <Text style={[styles.financeSummaryLabel, { color: theme.textSecondary }]} numberOfLines={2}>
                {t('stockRetailValue')}
              </Text>
            </View>
            <Text
              style={[styles.financeSummaryVal, { color: theme.text }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}>
              {settings.currencySymbol}{totalInventoryRetailValue.toLocaleString()}
            </Text>
          </View>

          <View style={[styles.financeSummaryDivider, { backgroundColor: settings.darkMode ? 'rgba(255,255,255,0.08)' : '#F1F5F9' }]} />

          {/* Stat 3: Expected Profit */}
          <View style={styles.financeSummaryItem}>
            <View style={styles.statLabelRow}>
              <Text style={[styles.financeSummaryLabel, { color: '#059669' }]} numberOfLines={2}>
                {t('expectedStockProfit')}
              </Text>
            </View>
            <Text
              style={[styles.financeSummaryVal, { color: '#059669' }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}>
              +{settings.currencySymbol}{totalExpectedStockProfit.toLocaleString()}
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
                  onPress={() => setSelectedProductDetails(product)}
                  style={({ pressed }) => [
                    styles.listRowCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: isLow ? theme.warning : isOut ? theme.danger : theme.border,
                      borderWidth: isLow || isOut ? 1.5 : 1,
                    },
                    pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
                  ]}>
                  {/* Thumbnail Image */}
                  <View style={[styles.listThumbWrap, { backgroundColor: theme.surfaceSubtle }]}>
                    <ProductImage
                      uri={product.image || product.imageUri}
                      style={styles.listThumb}
                      resizeMode="cover"
                      fallbackColor={theme.textMuted}
                      fallbackSize={24}
                    />
                  </View>

                  {/* Middle: Name + meta row */}
                  <View style={styles.listRowContent}>
                    <Text style={[styles.listRowName, { color: theme.text }]} numberOfLines={1}>
                      {language === 'ur' && product.nameUrdu ? product.nameUrdu : product.name}
                    </Text>
                    {/* Row 1: category + stock */}
                    <View style={styles.listRowBadgeRow}>
                      <View style={[styles.listCategoryBadge, { backgroundColor: settings.darkMode ? 'rgba(255,255,255,0.08)' : '#F1F5F9' }]}>
                        <Text style={[styles.listCategoryText, { color: theme.textSecondary }]}>
                          {product.category}
                        </Text>
                      </View>
                    </View>
                    {/* Row 2: barcode on its own line */}
                    {product.barcode ? (
                      <Text style={[styles.listBarcodeText, { color: theme.textMuted }]} numberOfLines={1}>
                        # {product.barcode}
                      </Text>
                    ) : null}
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
                    <Ionicons
                      name={isOut ? 'alert-circle' : isLow ? 'warning' : 'cube-outline'}
                      size={12}
                      color={isOut ? theme.danger : isLow ? theme.warning : theme.success}
                    />
                    <Text
                      style={[
                        styles.listStockText,
                        { color: isOut ? theme.danger : isLow ? theme.warning : theme.success },
                      ]}>
                      {isOut ? t('soldOut') : `${product.stock} ${product.unit}`}
                    </Text>
                  </View>

                  {/* Pricing & Profit */}
                  <View style={styles.listRowRight}>
                    <Text
                      style={[styles.listRowPrice, { color: theme.primary }]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.75}>
                      {settings.currencySymbol}{formatCompactPrice(product.price)}
                    </Text>
                    {margin > 0 ? (
                      <View style={[styles.listMarginChip, { backgroundColor: settings.darkMode ? 'rgba(16,185,129,0.15)' : '#ECFDF5' }]}>
                        <Text style={[styles.listMarginText, { color: '#059669' }]}>+{margin}%</Text>
                      </View>
                    ) : null}
                  </View>

                  {/* Delete Action */}
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation?.();
                      const productName = language === 'ur' && product.nameUrdu ? product.nameUrdu : product.name;
                      showAlert({
                        type: 'danger',
                        title: language === 'ur' ? 'پروڈکٹ حذف کریں' : 'Delete Product',
                        message: language === 'ur'
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
          /* ── Grid View ── */
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

      {/* ── Animated Product Details Sidebar ── */}
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
    height: 46,
    paddingHorizontal: 15,
    borderRadius: 14,
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
    paddingVertical: 12,
    paddingHorizontal: 14,
    minHeight: 74,
    borderRadius: 18,
    gap: 12,
  },
  listThumbWrap: {
    width: 50,
    height: 50,
    borderRadius: 14,
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
  },
  listRowName: {
    fontSize: 14.5,
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
    paddingHorizontal: 9,
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
    fontSize: 15.5,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  listMarginChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  listMarginText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  smallActionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Finance Summary Bar
  financeSummaryBar: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  financeSummaryItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    gap: 4,
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  financeSummaryLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    flexShrink: 1,
  },
  financeSummaryVal: {
    fontSize: 14.5,
    fontWeight: '800',
    textAlign: 'center',
    alignSelf: 'stretch',
  },
  financeSummaryDivider: {
    width: 1,
    marginVertical: 4,
  },
});
