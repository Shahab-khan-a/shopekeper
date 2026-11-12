import { ProductImage } from '@/components/ProductImage';
import { SearchBar } from '@/components/ui/SearchBar';
import { Colors, Spacing } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';
import { CartItem, Product, ProductCategory } from '@/types';
import { formatCompactPrice } from '@/utils/formatters';
import { productIconFor } from '@/utils/productIcon';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const SIDEBAR_STARTER_SEEDED_KEY = '@shopkeeper_sidebar_starter_seeded_v1';

interface ItemsSidebarDrawerProps {
  visible: boolean;
  products: Product[];
  cart: CartItem[];
  billTotal: number;
  onAddProduct: (product: Product) => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onOpenScanner: () => void;
  onClose: () => void;
}

export const ItemsSidebarDrawer: React.FC<ItemsSidebarDrawerProps> = ({
  visible,
  products,
  cart,
  billTotal,
  onAddProduct,
  onUpdateQuantity,
  onOpenScanner,
  onClose,
}) => {
  const {
    settings,
    language,
    setIsAddProductOpen,
    isLoaded,
    isProductsLoading,
    loadStapleProducts,
  } = useShop();
  const isUrdu = language === 'ur';
  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const softBorder = settings.darkMode
    ? 'rgba(255,255,255,0.1)'
    : 'rgba(148, 163, 184, 0.25)';

  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const drawerWidth = Math.min(Math.round(width * 0.88), 420);

  const [isMounted, setIsMounted] = useState(visible);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [isSeedingStarter, setIsSeedingStarter] = useState(false);

  const starterSeedAttemptedRef = useRef(false);
  const slideX = useRef(new Animated.Value(drawerWidth)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Auto-populate everyday starter items the very first time user opens an empty sidebar
  useEffect(() => {
    if (!visible || !isLoaded || isProductsLoading || products.length > 0) return;
    if (starterSeedAttemptedRef.current) return;

    let cancelled = false;
    (async () => {
      try {
        const alreadySeeded = await AsyncStorage.getItem(SIDEBAR_STARTER_SEEDED_KEY);
        if (alreadySeeded === '1' || cancelled) return;
        starterSeedAttemptedRef.current = true;
        await AsyncStorage.setItem(SIDEBAR_STARTER_SEEDED_KEY, '1');
        setIsSeedingStarter(true);
        await loadStapleProducts(18);
      } catch {
        // Non-fatal fallback to empty state
      } finally {
        if (!cancelled) setIsSeedingStarter(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [visible, isLoaded, isProductsLoading, products.length, loadStapleProducts]);

  const handleLoadSampleItems = async () => {
    if (isSeedingStarter) return;
    setIsSeedingStarter(true);
    try {
      await AsyncStorage.setItem(SIDEBAR_STARTER_SEEDED_KEY, '1');
      await loadStapleProducts(18);
    } finally {
      setIsSeedingStarter(false);
    }
  };

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      slideX.setValue(drawerWidth);
      backdropOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 210,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(slideX, {
          toValue: 0,
          duration: 250,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else if (isMounted) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 180,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(slideX, {
          toValue: drawerWidth,
          duration: 210,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setIsMounted(false);
        }
      });
    }
  }, [visible, drawerWidth, slideX, backdropOpacity, isMounted]);

  const availableCategories = useMemo<ProductCategory[]>(() => {
    const cats = new Set<ProductCategory>();
    for (const p of products) {
      if (p.category && p.category !== 'All') {
        cats.add(p.category);
      }
    }
    return ['All', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.nameUrdu && p.nameUrdu.toLowerCase().includes(q)) ||
        (p.barcode && p.barcode.toLowerCase().includes(q));
      const matchCat =
        selectedCategory === 'All' || p.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [products, searchQuery, selectedCategory]);

  const getProductName = (prod: Product) => {
    if (isUrdu && prod.nameUrdu) return prod.nameUrdu;
    return prod.name.replace(/\s*\([\u0600-\u06FF\s/]+\)$/, '').trim();
  };

  const totalUnitsInBill = cart.reduce(
    (sum, item) => sum + (Number.isInteger(item.quantity) ? item.quantity : 1),
    0
  );

  if (!isMounted) return null;

  return (
    <Modal
      visible={isMounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.backdrop,
            { opacity: backdropOpacity },
          ]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={onClose}
            accessibilityLabel={isUrdu ? 'بند کریں' : 'Close items sidebar'}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.drawerPanel,
            {
              width: drawerWidth,
              backgroundColor: theme.background,
              borderLeftColor: softBorder,
              paddingTop:
                insets.top > 0
                  ? insets.top + 6
                  : Platform.OS === 'ios'
                    ? 20
                    : 14,
              paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
              transform: [{ translateX: slideX }],
            },
          ]}>
          {/* 1. Drawer Header */}
          <View style={[styles.headerRow, { borderBottomColor: softBorder }]}>
            <View style={styles.headerTitleCol}>
              <Text style={[styles.headerTitle, { color: theme.text }]}>
                {isUrdu ? 'تمام اشیاء' : 'Items'}
              </Text>
              <Text style={[styles.headerSub, { color: theme.textMuted }]}>
                {products.length}{' '}
                {isUrdu
                  ? 'اشیاء دستیاب'
                  : products.length === 1
                    ? 'item available'
                    : 'items available'}
                {totalUnitsInBill > 0
                  ? ` · ${totalUnitsInBill} ${isUrdu ? 'بل میں' : 'in bill'}`
                  : ''}
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={isUrdu ? 'بند کریں' : 'Close'}
              style={({ pressed }) => [
                styles.closeBtn,
                {
                  backgroundColor: settings.darkMode ? '#1E293B' : '#E2E8F0',
                },
                pressed && { opacity: 0.78, transform: [{ scale: 0.96 }] },
              ]}>
              <Ionicons name="close" size={18} color={theme.text} />
              <Text style={[styles.closeBtnText, { color: theme.text }]}>
                {isUrdu ? 'بند' : 'Close'}
              </Text>
            </Pressable>
          </View>

          {/* 2. Search + Quick Scan Bar + Prominent Add New Item CTA */}
          <View style={styles.searchSection}>
            <View style={styles.searchRow}>
              <View style={styles.searchBarWrap}>
                <SearchBar
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder={
                    isUrdu ? 'نام یا بارکوڈ تلاش کریں...' : 'Search item or barcode...'
                  }
                  height={42}
                />
              </View>
              <Pressable
                onPress={() => {
                  onClose();
                  onOpenScanner();
                }}
                accessibilityRole="button"
                accessibilityLabel={isUrdu ? 'بارکوڈ اسکین' : 'Scan barcode'}
                style={({ pressed }) => [
                  styles.scanBtn,
                  {
                    backgroundColor: settings.darkMode
                      ? 'rgba(56, 189, 248, 0.16)'
                      : '#EFF6FF',
                    borderColor: settings.darkMode
                      ? 'rgba(56, 189, 248, 0.35)'
                      : 'rgba(2, 132, 199, 0.25)',
                  },
                  pressed && { opacity: 0.8 },
                ]}>
                <Ionicons
                  name="barcode-outline"
                  size={20}
                  color={settings.darkMode ? '#38BDF8' : '#0284C7'}
                />
              </Pressable>
            </View>

            <Pressable
              onPress={() => {
                onClose();
                setIsAddProductOpen(true);
              }}
              accessibilityRole="button"
              accessibilityLabel={isUrdu ? 'نیا آئٹم شامل کریں' : 'Add New Item'}
              style={({ pressed }) => [
                styles.addNewBannerBtn,
                {
                  backgroundColor: settings.darkMode ? '#0369A1' : '#0284C7',
                  borderColor: settings.darkMode
                    ? 'rgba(56, 189, 248, 0.45)'
                    : 'rgba(2, 132, 199, 0.9)',
                },
                pressed && { opacity: 0.9, transform: [{ scale: 0.985 }] },
              ]}>
              <View style={styles.addNewBannerIconBox}>
                <Ionicons name="add-circle" size={21} color="#FFFFFF" />
              </View>
              <View style={styles.addNewBannerTextCol}>
                <Text style={styles.addNewBannerTitle} numberOfLines={1}>
                  {isUrdu ? 'نیا آئٹم شامل کریں' : 'Add New Item'}
                </Text>
                <Text style={styles.addNewBannerSub} numberOfLines={1}>
                  {isUrdu
                    ? 'نام، قیمت اور تصویر فوری درج کریں'
                    : 'Create product with name, price & photo'}
                </Text>
              </View>
              <View style={styles.addNewBannerArrow}>
                <Ionicons name="arrow-forward" size={14} color="#0284C7" />
              </View>
            </Pressable>

            {availableCategories.length > 2 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.catRow}>
                {availableCategories.map((cat) => {
                  const active = selectedCategory === cat;
                  return (
                    <Pressable
                      key={cat}
                      onPress={() => setSelectedCategory(cat)}
                      style={({ pressed }) => [
                        styles.catPill,
                        {
                          backgroundColor: active
                            ? theme.primary
                            : settings.darkMode
                              ? '#162235'
                              : '#FFFFFF',
                          borderColor: active ? theme.primary : softBorder,
                        },
                        pressed && { opacity: 0.82 },
                      ]}>
                      <Text
                        style={[
                          styles.catPillText,
                          {
                            color: active ? '#FFFFFF' : theme.textSecondary,
                          },
                        ]}>
                        {cat === 'All' && isUrdu ? 'سب' : cat}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}
          </View>

          {/* 3. Scrollable Product Cards */}
          {isSeedingStarter || (isProductsLoading && products.length === 0) ? (
            <View style={styles.emptyBox}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                {isUrdu ? 'اشیاء تیار ہو رہی ہیں...' : 'Loading Starter Items...'}
              </Text>
            </View>
          ) : products.length === 0 ? (
            <View style={styles.emptyBox}>
              <View
                style={[
                  styles.emptyIconCircle,
                  {
                    backgroundColor: settings.darkMode
                      ? 'rgba(16, 185, 129, 0.14)'
                      : '#ECFDF5',
                  },
                ]}>
                <Ionicons name="cube-outline" size={34} color={theme.primary} />
              </View>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                {isUrdu ? 'کوئی آئٹم شامل نہیں' : 'No Items Added Yet'}
              </Text>
              <Text style={[styles.emptySub, { color: theme.textMuted }]}>
                {isUrdu
                  ? 'اپنی اشیاء شامل کریں یا نمونہ اشیاء لوڈ کریں۔'
                  : 'Add your own shop products or load sample items to get started.'}
              </Text>
              <Pressable
                onPress={() => {
                  onClose();
                  setIsAddProductOpen(true);
                }}
                style={({ pressed }) => [
                  styles.addFirstBtn,
                  { backgroundColor: theme.primary },
                  pressed && { opacity: 0.88 },
                ]}>
                <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
                <Text style={styles.addFirstBtnText}>
                  {isUrdu ? 'نیا آئٹم شامل کریں' : 'Add Product'}
                </Text>
              </Pressable>
              <Pressable
                onPress={handleLoadSampleItems}
                style={({ pressed }) => [
                  styles.resetBtn,
                  { borderColor: softBorder, backgroundColor: theme.card },
                  pressed && { opacity: 0.8 },
                ]}>
                <Text style={[styles.resetBtnText, { color: theme.text }]}>
                  {isUrdu ? 'نمونہ اشیاء لوڈ کریں' : 'Load Sample Items'}
                </Text>
              </Pressable>
            </View>
          ) : (
            <FlatList
              data={filteredProducts}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <View style={styles.emptyBox}>
                  <Ionicons name="search-outline" size={32} color={theme.textMuted} />
                  <Text style={[styles.emptyTitle, { color: theme.text }]}>
                    {isUrdu ? 'کوئی آئٹم نہیں ملا' : 'No Matching Items'}
                  </Text>
                  <Pressable
                    onPress={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    style={[
                      styles.resetBtn,
                      { borderColor: softBorder, backgroundColor: theme.card },
                    ]}>
                    <Text style={[styles.resetBtnText, { color: theme.text }]}>
                      {isUrdu ? 'سب دکھائیں' : 'Show All Items'}
                    </Text>
                  </Pressable>
                </View>
              }
              renderItem={({ item: prod }) => {
                const inCart = cart.find((c) => c.product.id === prod.id);
                const qty = inCart ? inCart.quantity : 0;
                const lineTotal = inCart ? inCart.total : 0;
                const isOut = prod.stock <= 0;
                return (
                  <View
                    style={[
                      styles.itemCard,
                      {
                        backgroundColor:
                          qty > 0
                            ? settings.darkMode
                              ? '#0D2620'
                              : '#F0FDF4'
                            : theme.card,
                        borderColor:
                          qty > 0
                            ? settings.darkMode
                              ? 'rgba(52, 211, 153, 0.45)'
                              : 'rgba(5, 150, 105, 0.45)'
                            : softBorder,
                      },
                    ]}>
                    {/* Top Row: Tapping adds 1 quickly */}
                    <Pressable
                      onPress={() => onAddProduct(prod)}
                      style={({ pressed }) => [
                        styles.itemTopRow,
                        pressed && { opacity: 0.78 },
                      ]}>
                      <View
                        style={[
                          styles.thumbWrap,
                          {
                            backgroundColor: settings.darkMode
                              ? 'rgba(255,255,255,0.06)'
                              : '#F8FAFC',
                          },
                        ]}>
                        <ProductImage
                          uri={prod.image || prod.imageUri}
                          style={styles.thumbImg}
                          resizeMode="cover"
                          fallbackColor={theme.textMuted}
                          fallbackSize={15}
                          iconName={productIconFor(prod.name, prod.category)}
                        />
                      </View>

                      <View style={styles.itemInfoCol}>
                        <Text
                          style={[styles.itemName, { color: theme.text }]}
                          numberOfLines={2}>
                          {getProductName(prod)}
                        </Text>
                        <View style={styles.itemMetaRow}>
                          <Text style={[styles.itemPrice, { color: theme.primary }]}>
                            {settings.currencySymbol} {formatCompactPrice(prod.price)}
                          </Text>
                          <Text
                            style={[
                              styles.itemStock,
                              { color: isOut ? theme.danger : theme.textMuted },
                            ]}>
                            · {isOut ? (isUrdu ? 'ختم' : '0 left') : `${prod.stock} ${prod.unit}`}
                          </Text>
                        </View>
                      </View>
                    </Pressable>

                    {/* Dedicated Spacious Bottom Thumb Action Row */}
                    <View
                      style={[
                        styles.itemActionRow,
                        {
                          borderTopColor:
                            qty > 0
                              ? settings.darkMode
                                ? 'rgba(52, 211, 153, 0.16)'
                                : 'rgba(5, 150, 105, 0.14)'
                              : settings.darkMode
                                ? 'rgba(255,255,255,0.06)'
                                : 'rgba(148, 163, 184, 0.14)',
                        },
                      ]}>
                      {qty > 0 ? (
                        <>
                          <Text
                            style={[
                              styles.inBillLineTotal,
                              { color: settings.darkMode ? '#6EE7B7' : '#047857' },
                            ]}>
                            {isUrdu
                              ? `بل: ${settings.currencySymbol}${formatCompactPrice(lineTotal)}`
                              : `In bill: ${settings.currencySymbol}${formatCompactPrice(lineTotal)}`}
                          </Text>

                          <View style={styles.qtyStepper}>
                            <Pressable
                              onPress={() => onUpdateQuantity(prod.id, -1)}
                              accessibilityRole="button"
                              accessibilityLabel={`Decrease ${prod.name}`}
                              style={({ pressed }) => [
                                styles.stepperMinusBtn,
                                {
                                  backgroundColor:
                                    qty <= 1
                                      ? settings.darkMode
                                        ? 'rgba(239, 68, 68, 0.2)'
                                        : '#FEE2E2'
                                      : settings.darkMode
                                        ? '#1E293B'
                                        : '#E2E8F0',
                                },
                                pressed && { opacity: 0.78, transform: [{ scale: 0.94 }] },
                              ]}>
                              <Ionicons
                                name={qty <= 1 ? 'trash-outline' : 'remove'}
                                size={20}
                                color={qty <= 1 ? theme.danger : theme.text}
                              />
                            </Pressable>

                            <Text style={[styles.stepperQtyText, { color: theme.text }]}>
                              {qty}
                            </Text>

                            <Pressable
                              onPress={() => onAddProduct(prod)}
                              accessibilityRole="button"
                              accessibilityLabel={`Increase ${prod.name}`}
                              style={({ pressed }) => [
                                styles.stepperPlusBtn,
                                { backgroundColor: theme.primary },
                                pressed && { opacity: 0.85, transform: [{ scale: 0.94 }] },
                              ]}>
                              <Ionicons name="add" size={22} color="#FFFFFF" />
                            </Pressable>
                          </View>
                        </>
                      ) : (
                        <>
                          <Text style={[styles.unitHintText, { color: theme.textMuted }]}>
                            {prod.unit || 'piece'}
                          </Text>

                          <Pressable
                            onPress={() => onAddProduct(prod)}
                            accessibilityRole="button"
                            accessibilityLabel={`Add ${prod.name}`}
                            style={({ pressed }) => [
                              styles.addPillBtn,
                              {
                                backgroundColor: settings.darkMode
                                  ? 'rgba(16, 185, 129, 0.2)'
                                  : '#ECFDF5',
                                borderColor: settings.darkMode
                                  ? 'rgba(52, 211, 153, 0.4)'
                                  : 'rgba(5, 150, 105, 0.3)',
                              },
                              pressed && { opacity: 0.82, transform: [{ scale: 0.97 }] },
                            ]}>
                            <Ionicons name="add" size={19} color={theme.primary} />
                            <Text style={[styles.addPillText, { color: theme.primary }]}>
                              {isUrdu ? 'شامل کریں' : 'Add to Bill'}
                            </Text>
                          </Pressable>
                        </>
                      )}
                    </View>
                  </View>
                );
              }}
            />
          )}

          {/* 4. Sticky Footer Summary & Done */}
          <View
            style={[
              styles.footerBar,
              { backgroundColor: theme.card, borderTopColor: softBorder },
            ]}>
            <View style={styles.footerSummary}>
              <Text style={[styles.footerLabel, { color: theme.textMuted }]}>
                {totalUnitsInBill > 0
                  ? `${totalUnitsInBill} ${isUrdu ? 'اشیاء بل میں' : totalUnitsInBill === 1 ? 'item in bill' : 'items in bill'}`
                  : isUrdu
                    ? 'کوئی آئٹم منتخب نہیں'
                    : 'Tap items to add'}
              </Text>
              <Text style={[styles.footerTotal, { color: theme.text }]}>
                {settings.currencySymbol} {billTotal.toLocaleString()}
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={isUrdu ? 'مکمل اور بند کریں' : 'Done and close'}
              style={({ pressed }) => [
                styles.doneBtn,
                { backgroundColor: theme.primary },
                pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] },
              ]}>
              <Ionicons name="checkmark" size={18} color="#FFFFFF" />
              <Text style={styles.doneBtnText}>
                {isUrdu ? 'بند کریں' : 'Done'}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 6, 23, 0.48)',
  },
  drawerPanel: {
    height: '100%',
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    borderLeftWidth: 1,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  headerTitleCol: {
    flex: 1,
    gap: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 12,
    fontWeight: '600',
  },
  addNewBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 15,
    borderCurve: 'continuous',
    borderWidth: 1,
    minHeight: 54,
  },
  addNewBannerIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addNewBannerTextCol: {
    flex: 1,
    gap: 1,
  },
  addNewBannerTitle: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  addNewBannerSub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11.5,
    fontWeight: '600',
  },
  addNewBannerArrow: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
  },
  closeBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
  searchSection: {
    paddingHorizontal: Spacing.md,
    paddingTop: 10,
    paddingBottom: 6,
    gap: 8,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchBarWrap: {
    flex: 1,
  },
  scanBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catRow: {
    gap: 6,
    paddingVertical: 2,
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  catPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: 6,
    paddingBottom: 16,
    gap: 10,
  },
  itemCard: {
    borderRadius: 18,
    borderCurve: 'continuous',
    borderWidth: 1.2,
    overflow: 'hidden',
  },
  itemTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  thumbWrap: {
    width: 46,
    height: 46,
    borderRadius: 13,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbImg: {
    width: 46,
    height: 46,
  },
  itemInfoCol: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  itemName: {
    fontSize: 14.5,
    fontWeight: '800',
    lineHeight: 19,
  },
  itemMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  itemPrice: {
    fontSize: 13.5,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  itemStock: {
    fontSize: 12,
    fontWeight: '600',
  },
  itemActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    gap: 10,
  },
  unitHintText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  inBillLineTotal: {
    fontSize: 13,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  addPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    minWidth: 124,
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  addPillText: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  qtyStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepperMinusBtn: {
    width: 48,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperPlusBtn: {
    width: 48,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperQtyText: {
    minWidth: 38,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 40,
    gap: 10,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },
  addFirstBtn: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  addFirstBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  resetBtn: {
    marginTop: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  footerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: 10,
    paddingBottom: 8,
    borderTopWidth: 1,
    gap: 12,
  },
  footerSummary: {
    flex: 1,
    gap: 1,
  },
  footerLabel: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  footerTotal: {
    fontSize: 18,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  doneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 14,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});

