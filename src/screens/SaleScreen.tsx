import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  Platform,
  Image,
  KeyboardAvoidingView,
  useWindowDimensions,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product, CartItem, PaymentMethod, ProductCategory, CustomerKhata } from '@/types';
import { useShop } from '@/context/ShopContext';
import { BarcodeModal } from '@/components/BarcodeModal';
import { QuickItemModal } from '@/components/QuickItemModal';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterChip } from '@/components/ui/FilterChip';
import { EmptyState } from '@/components/ui/EmptyState';

const CATEGORIES: ProductCategory[] = [
  'All',
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

const CASH_DENOMINATIONS = [100, 500, 1000, 5000];
const DISCOUNT_SHORTCUTS = [10, 20, 50, 100];

export const SaleScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const isWideScreen = width >= 860;

  const { products, khata, createSale, setActiveReceipt, settings, t, language } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<string>('');
  const [discountType, setDiscountType] = useState<'fixed' | 'percent'>('fixed');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [tenderedCash, setTenderedCash] = useState<string>('');
  const [selectedKhataCustomer, setSelectedKhataCustomer] = useState<CustomerKhata | null>(null);

  // Search, Filters & View Mode
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modals & Drawers
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  const [isQuickItemOpen, setIsQuickItemOpen] = useState(false);
  const [isCheckoutDrawerOpen, setIsCheckoutDrawerOpen] = useState(false);
  const [showOptionalDetails, setShowOptionalDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.nameUrdu && p.nameUrdu.includes(searchQuery)) ||
        (p.barcode && p.barcode.includes(searchQuery));
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [products, searchQuery, selectedCategory]);

  // Cart totals
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.total, 0), [cart]);
  const totalItemsCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const parsedDiscount = parseFloat(discount) || 0;
  const discountAmount =
    discountType === 'percent'
      ? Math.round((subtotal * parsedDiscount) / 100)
      : parsedDiscount;
  const grandTotal = Math.max(0, subtotal - discountAmount);

  // Cash change calculation
  const parsedTendered = parseFloat(tenderedCash) || 0;
  const changeToReturn = parsedTendered > grandTotal ? parsedTendered - grandTotal : 0;

  // Cart actions
  const addToCart = (product: Product, delta: number = 1) => {
    if (product.stock <= 0) {
      if (Platform.OS === 'web') {
        window.alert(t('outOfStockWarn'));
      } else {
        Alert.alert(t('warningAlert'), t('outOfStockWarn'));
      }
      return;
    }

    const existingIndex = cart.findIndex((item) => item.product.id === product.id);

    if (existingIndex >= 0) {
      const existingItem = cart[existingIndex];
      const newQty = existingItem.quantity + delta;

      if (newQty > product.stock) {
        const warnMsg = `${t('stockExceededWarn')} (Available: ${product.stock} ${product.unit})`;
        if (Platform.OS === 'web') {
          window.alert(warnMsg);
        } else {
          Alert.alert(t('warningAlert'), warnMsg);
        }
        return;
      }

      if (newQty <= 0) {
        removeFromCart(product.id);
        return;
      }

      const updated = [...cart];
      updated[existingIndex] = {
        ...existingItem,
        quantity: newQty,
        total: newQty * existingItem.unitPrice,
      };
      setCart(updated);
    } else {
      setCart([
        ...cart,
        {
          product,
          quantity: 1,
          unitPrice: product.price,
          total: product.price,
        },
      ]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    const updated = cart
      .map((item) => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;

          if (delta > 0 && newQty > item.product.stock) {
            const warnMsg = `${t('stockExceededWarn')} (Stock: ${item.product.stock})`;
            if (Platform.OS === 'web') {
              window.alert(warnMsg);
            } else {
              Alert.alert(t('warningAlert'), warnMsg);
            }
            return item;
          }

          if (newQty <= 0) return null;

          return {
            ...item,
            quantity: newQty,
            total: newQty * item.unitPrice,
          };
        }
        return item;
      })
      .filter(Boolean) as CartItem[];

    setCart(updated);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setDiscount('');
    setCustomerName('');
    setCustomerPhone('');
    setTenderedCash('');
    setSelectedKhataCustomer(null);
    setIsCheckoutDrawerOpen(false);
  };

  // Add loose or custom uncataloged item
  const handleAddQuickItem = ({
    name,
    nameUrdu,
    price,
    quantity,
  }: {
    name: string;
    nameUrdu?: string;
    price: number;
    quantity: number;
  }) => {
    const customProduct: Product = {
      id: 'custom-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      name,
      nameUrdu,
      price,
      costPrice: Math.round(price * 0.8),
      stock: 9999,
      category: 'Others',
      unit: 'piece',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setCart([
      ...cart,
      {
        product: customProduct,
        quantity,
        unitPrice: price,
        total: price * quantity,
      },
    ]);
  };

  // 1-Tap Khata customer selection
  const handleSelectKhataCustomer = (customer: CustomerKhata) => {
    setSelectedKhataCustomer(customer);
    setCustomerName(customer.name);
    setCustomerPhone(customer.phone);
  };

  // Complete Sale and Generate Bill
  const handleGenerateBill = async () => {
    if (cart.length === 0) {
      if (Platform.OS === 'web') {
        window.alert(t('cartEmpty'));
      } else {
        Alert.alert(t('warningAlert'), t('cartEmpty'));
      }
      return;
    }

    if (paymentMethod === 'udhaar' && !customerName.trim() && !customerPhone.trim()) {
      const errMsg =
        language === 'ur'
          ? 'ادھار سیل کے لیے گاہک کا نام یا فون درج کرنا لازمی ہے۔'
          : 'Please provide Customer Name or Phone Number for Udhaar (Credit) sales.';
      if (Platform.OS === 'web') {
        window.alert(errMsg);
      } else {
        Alert.alert(t('warningAlert'), errMsg);
      }
      return;
    }

    setIsProcessing(true);
    try {
      const newSale = await createSale({
        customerName: customerName.trim() || undefined,
        customerPhone: customerPhone.trim() || undefined,
        items: cart,
        discount: parsedDiscount,
        discountType,
        paymentMethod,
      });

      // Clear cart and close drawer
      clearCart();

      // Show thermal receipt modal
      setActiveReceipt(newSale);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  // ---------------- Render Checkout Content ----------------
  const renderCheckoutContent = () => (
    <View style={styles.checkoutInner}>
      {/* Header */}
      <View style={[styles.drawerHeader, { borderBottomColor: theme.border }]}>
        <View style={styles.drawerHeaderTitle}>
          <Ionicons name="receipt-outline" size={22} color={theme.primary} />
          <Text style={[styles.drawerTitle, { color: theme.text }]}>
            {t('cart')} ({totalItemsCount})
          </Text>
        </View>

        <View style={styles.drawerHeaderActions}>
          {cart.length > 0 ? (
            <Pressable onPress={clearCart} style={styles.clearBtn}>
              <Text style={[styles.clearBtnText, { color: theme.danger }]}>
                {t('clearAll')}
              </Text>
            </Pressable>
          ) : null}

          {!isWideScreen && (
            <Pressable
              onPress={() => setIsCheckoutDrawerOpen(false)}
              style={[styles.closeDrawerBtn, { backgroundColor: theme.surfaceSubtle }]}>
              <Ionicons name="close" size={20} color={theme.text} />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.drawerScroll}
        contentContainerStyle={styles.drawerScrollContent}
        keyboardShouldPersistTaps="handled">
        {/* Cart Items List */}
        {cart.length === 0 ? (
          <EmptyState
            icon="bag-outline"
            title={t('cartEmpty')}
            subtitle={language === 'ur' ? 'مصنوعات پر ٹیپ کریں' : 'Tap products on the left to add them.'}
            compact
          />
        ) : (
          <View style={[styles.itemsCard, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
            {cart.map((item, index) => (
              <View
                key={item.product.id}
                style={[
                  styles.cartItemRow,
                  index < cart.length - 1 && { borderBottomColor: theme.border, borderBottomWidth: 1 },
                ]}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={[styles.cartItemName, { color: theme.text }]} numberOfLines={1}>
                    {language === 'ur' && item.product.nameUrdu
                      ? item.product.nameUrdu
                      : item.product.name}
                  </Text>
                  <Text style={[styles.cartItemPriceInfo, { color: theme.textSecondary }]}>
                    {settings.currencySymbol}{item.unitPrice} × {item.quantity} ={' '}
                    <Text style={{ fontWeight: '700', color: theme.text }}>
                      {settings.currencySymbol}{item.total}
                    </Text>
                  </Text>
                </View>

                {/* Stepper */}
                <View style={styles.itemStepperWrap}>
                  <Pressable
                    onPress={() => updateQuantity(item.product.id, -1)}
                    style={[styles.smallStepBtn, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Ionicons name="remove" size={16} color={theme.text} />
                  </Pressable>
                  <Text style={[styles.smallStepQty, { color: theme.text }]}>
                    {item.quantity}
                  </Text>
                  <Pressable
                    onPress={() => updateQuantity(item.product.id, 1)}
                    style={[styles.smallStepBtn, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Ionicons name="add" size={16} color={theme.text} />
                  </Pressable>
                  <Pressable
                    onPress={() => removeFromCart(item.product.id)}
                    style={styles.trashBtn}>
                    <Ionicons name="trash-outline" size={16} color={theme.danger} />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Payment Method Selector */}
        <View style={styles.sectionBlock}>
          <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>
            {t('paymentMethod')}
          </Text>
          <View style={styles.payMethodsGrid}>
            {(
              [
                { key: 'cash', label: t('cash'), icon: 'cash-outline', emoji: '💵' },
                { key: 'online', label: 'Online / EasyPaisa', icon: 'phone-portrait-outline', emoji: '📱' },
                { key: 'udhaar', label: t('udhaar'), icon: 'book-outline', emoji: '📒' },
              ] as const
            ).map((m) => {
              const isSelected = paymentMethod === m.key;
              return (
                <Pressable
                  key={m.key}
                  onPress={() => setPaymentMethod(m.key)}
                  style={[
                    styles.payCard,
                    {
                      backgroundColor: isSelected ? theme.primaryLight : theme.surfaceSubtle,
                      borderColor: isSelected ? theme.primary : theme.border,
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}>
                  <Text style={styles.payCardEmoji}>{m.emoji}</Text>
                  <Text
                    style={[
                      styles.payCardLabel,
                      {
                        color: isSelected ? theme.primaryDark : theme.text,
                        fontWeight: isSelected ? '800' : '600',
                      },
                    ]}>
                    {m.label}
                  </Text>
                  {isSelected && (
                    <View style={[styles.selectedCheckBadge, { backgroundColor: theme.primary }]}>
                      <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Contextual: Cash Calculator */}
        {paymentMethod === 'cash' && cart.length > 0 && (
          <View style={[styles.contextPanel, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
            <View style={styles.cashHeaderRow}>
              <Text style={[styles.contextLabel, { color: theme.textSecondary }]}>
                {t('tenderedAmount')} ({settings.currencySymbol})
              </Text>
              {parsedTendered > 0 && (
                <Pressable onPress={() => setTenderedCash('')}>
                  <Text style={{ fontSize: 11, color: theme.textMuted }}>{t('clearAll')}</Text>
                </Pressable>
              )}
            </View>

            {/* Quick Denominations */}
            <View style={styles.denomRow}>
              <Pressable
                onPress={() => setTenderedCash(grandTotal.toString())}
                style={[
                  styles.denomBtn,
                  {
                    backgroundColor:
                      tenderedCash === grandTotal.toString() ? theme.primary : theme.card,
                    borderColor:
                      tenderedCash === grandTotal.toString() ? theme.primary : theme.border,
                  },
                ]}>
                <Text
                  style={[
                    styles.denomText,
                    { color: tenderedCash === grandTotal.toString() ? '#FFFFFF' : theme.text },
                  ]}>
                  {t('exactAmount')} ({settings.currencySymbol}{grandTotal})
                </Text>
              </Pressable>

              {CASH_DENOMINATIONS.map((amt) => (
                <Pressable
                  key={amt}
                  onPress={() => setTenderedCash(amt.toString())}
                  style={[
                    styles.denomBtn,
                    {
                      backgroundColor:
                        tenderedCash === amt.toString() ? theme.primary : theme.card,
                      borderColor:
                        tenderedCash === amt.toString() ? theme.primary : theme.border,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.denomText,
                      { color: tenderedCash === amt.toString() ? '#FFFFFF' : theme.text },
                    ]}>
                    {settings.currencySymbol}{amt}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Tendered Input */}
            <TextInput
              style={[
                styles.cashInput,
                { backgroundColor: theme.card, color: theme.text, borderColor: theme.border },
              ]}
              placeholder={t('enterCustomAmount')}
              placeholderTextColor={theme.textMuted}
              keyboardType="numeric"
              value={tenderedCash}
              onChangeText={setTenderedCash}
            />

            {/* Change banner */}
            {parsedTendered > 0 && (
              <View
                style={[
                  styles.changeBanner,
                  {
                    backgroundColor:
                      changeToReturn >= 0 ? theme.successLight : theme.dangerLight,
                    borderColor:
                      changeToReturn >= 0 ? theme.success : theme.danger,
                  },
                ]}>
                <View>
                  <Text
                    style={[
                      styles.changeBannerLabel,
                      { color: changeToReturn >= 0 ? theme.success : theme.danger },
                    ]}>
                    {t('changeReturn')}
                  </Text>
                  <Text
                    style={[
                      styles.changeBannerAmount,
                      { color: changeToReturn >= 0 ? theme.success : theme.danger },
                    ]}>
                    {settings.currencySymbol} {changeToReturn}
                  </Text>
                </View>
                <Ionicons
                  name={changeToReturn >= 0 ? 'checkmark-circle' : 'alert-circle'}
                  size={28}
                  color={changeToReturn >= 0 ? theme.success : theme.danger}
                />
              </View>
            )}
          </View>
        )}

        {/* Contextual: Udhaar Khata Customer Picker */}
        {paymentMethod === 'udhaar' && (
          <View style={[styles.contextPanel, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
            <Text style={[styles.contextLabel, { color: theme.textSecondary }]}>
              {t('selectCustomer')} *
            </Text>

            {/* Existing Khata Customers Horizontal Chips */}
            {khata.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.khataChipsScroll}
                contentContainerStyle={styles.khataChipsContent}>
                {khata.map((cust) => {
                  const isCustSelected = selectedKhataCustomer?.id === cust.id;
                  return (
                    <Pressable
                      key={cust.id}
                      onPress={() => handleSelectKhataCustomer(cust)}
                      style={[
                        styles.khataChip,
                        {
                          backgroundColor: isCustSelected ? theme.primary : theme.card,
                          borderColor: isCustSelected ? theme.primary : theme.border,
                        },
                      ]}>
                      <Ionicons
                        name="person"
                        size={12}
                        color={isCustSelected ? '#FFFFFF' : theme.primary}
                      />
                      <Text
                        style={[
                          styles.khataChipName,
                          { color: isCustSelected ? '#FFFFFF' : theme.text },
                        ]}>
                        {cust.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}

            {/* Customer Name & Phone Input */}
            <View style={{ gap: 8, marginTop: 4 }}>
              <TextInput
                style={[
                  styles.formInput,
                  { backgroundColor: theme.card, color: theme.text, borderColor: theme.border },
                ]}
                placeholder={t('customerName')}
                placeholderTextColor={theme.textMuted}
                value={customerName}
                onChangeText={(val) => {
                  setCustomerName(val);
                  setSelectedKhataCustomer(null);
                }}
              />
              <TextInput
                style={[
                  styles.formInput,
                  { backgroundColor: theme.card, color: theme.text, borderColor: theme.border },
                ]}
                placeholder={t('customerPhone')}
                placeholderTextColor={theme.textMuted}
                keyboardType="phone-pad"
                value={customerPhone}
                onChangeText={setCustomerPhone}
              />
            </View>
          </View>
        )}

        {/* Optional Collapsible: Customer WhatsApp & Discount (for Cash/Online) */}
        {paymentMethod !== 'udhaar' && (
          <View style={styles.collapsibleWrap}>
            <Pressable
              onPress={() => setShowOptionalDetails(!showOptionalDetails)}
              style={styles.collapsibleHeader}>
              <View style={styles.collapsibleTitleRow}>
                <Ionicons
                  name={showOptionalDetails ? 'chevron-down' : 'chevron-forward'}
                  size={18}
                  color={theme.textSecondary}
                />
                <Text style={[styles.collapsibleTitle, { color: theme.textSecondary }]}>
                  {t('optionalDetails')}
                </Text>
              </View>
              {(customerPhone || discountAmount > 0) && (
                <View style={[styles.activeDot, { backgroundColor: theme.primary }]} />
              )}
            </Pressable>

            {showOptionalDetails && (
              <View style={[styles.optionalContent, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
                {/* Customer Phone for WhatsApp Receipt */}
                <View style={styles.inputSubgroup}>
                  <Text style={[styles.inputSubLabel, { color: theme.textSecondary }]}>
                    {t('customerPhone')}
                  </Text>
                  <TextInput
                    style={[
                      styles.formInput,
                      { backgroundColor: theme.card, color: theme.text, borderColor: theme.border },
                    ]}
                    placeholder="WhatsApp (0300...)"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="phone-pad"
                    value={customerPhone}
                    onChangeText={setCustomerPhone}
                  />
                </View>

                {/* Discount */}
                <View style={styles.inputSubgroup}>
                  <Text style={[styles.inputSubLabel, { color: theme.textSecondary }]}>
                    {t('discount')} ({settings.currencySymbol})
                  </Text>
                  <View style={styles.discountInputRow}>
                    <TextInput
                      style={[
                        styles.formInput,
                        { flex: 1, backgroundColor: theme.card, color: theme.text, borderColor: theme.border },
                      ]}
                      placeholder="0"
                      placeholderTextColor={theme.textMuted}
                      keyboardType="numeric"
                      value={discount}
                      onChangeText={setDiscount}
                    />
                    <View style={styles.discShortcuts}>
                      {DISCOUNT_SHORTCUTS.map((amt) => (
                        <Pressable
                          key={amt}
                          onPress={() => setDiscount(amt.toString())}
                          style={[
                            styles.discShortcutBtn,
                            {
                              backgroundColor:
                                discount === amt.toString() ? theme.primaryLight : theme.card,
                              borderColor:
                                discount === amt.toString() ? theme.primary : theme.border,
                            },
                          ]}>
                          <Text
                            style={[
                              styles.discShortcutText,
                              {
                                color:
                                  discount === amt.toString() ? theme.primary : theme.textSecondary,
                              },
                            ]}>
                            -{amt}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bill Total & Primary Action Button */}
      <View style={[styles.checkoutFooter, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <View style={styles.totalBar}>
          <View>
            <Text style={[styles.subtotalLine, { color: theme.textSecondary }]}>
              {t('subtotal')}: {settings.currencySymbol}{subtotal}
              {discountAmount > 0 && ` | -${settings.currencySymbol}${discountAmount}`}
            </Text>
            <Text style={[styles.grandTotalLine, { color: theme.primary }]}>
              {settings.currencySymbol}{grandTotal}
            </Text>
          </View>

          <Pressable
            disabled={cart.length === 0 || isProcessing}
            onPress={handleGenerateBill}
            style={({ pressed }) => [
              styles.completeSaleBtn,
              {
                backgroundColor: cart.length === 0 ? theme.border : theme.primary,
              },
              pressed && cart.length > 0 && { transform: [{ scale: 0.97 }] },
            ]}>
            <Ionicons
              name="checkmark-circle"
              size={22}
              color={cart.length === 0 ? theme.textMuted : '#FFFFFF'}
            />
            <Text
              style={[
                styles.completeSaleBtnText,
                cart.length === 0 && { color: theme.textMuted },
              ]}>
              {isProcessing ? t('saved') : t('generateBill')}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.mainLayout}>
        {/* ================= Catalog Section (Full Screen on Mobile) ================= */}
        <View style={styles.catalogSection}>
          {/* Top Control Bar: Search + Barcode + Quick Item + View Toggle */}
          <View style={styles.topControlBar}>
            {/* Search Box */}
            <View style={styles.searchFlex}>
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={t('searchAndAdd')}
                height={46}
              />
            </View>

            {/* Action Buttons Row */}
            <View style={styles.topBarActions}>
              {/* ⚡ Quick Item Button */}
              <Pressable
                onPress={() => setIsQuickItemOpen(true)}
                style={({ pressed }) => [
                  styles.quickItemBtn,
                  { backgroundColor: theme.accent, borderColor: theme.accent },
                  pressed && { opacity: 0.85 },
                ]}>
                <Ionicons name="flash" size={16} color="#FFFFFF" />
                <Text style={styles.quickItemBtnText}>{t('quickItem')}</Text>
              </Pressable>

              {/* Barcode Scanner */}
              <Pressable
                onPress={() => setIsBarcodeOpen(true)}
                style={({ pressed }) => [
                  styles.iconSquareBtn,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                  pressed && { opacity: 0.8 },
                ]}>
                <Ionicons name="barcode-outline" size={22} color={theme.primary} />
              </Pressable>

              {/* View Mode Toggle (Grid vs List) */}
              <Pressable
                onPress={() => setViewMode((m) => (m === 'grid' ? 'list' : 'grid'))}
                style={({ pressed }) => [
                  styles.iconSquareBtn,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                  pressed && { opacity: 0.8 },
                ]}>
                <Ionicons
                  name={viewMode === 'grid' ? 'list-outline' : 'grid-outline'}
                  size={20}
                  color={theme.textSecondary}
                />
              </Pressable>
            </View>
          </View>

          {/* Category Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryScrollContent}>
            {CATEGORIES.map((cat) => (
              <FilterChip
                key={cat}
                label={cat === 'All' ? t('allCategories') : cat}
                isActive={selectedCategory === cat}
                onPress={() => setSelectedCategory(cat)}
              />
            ))}
          </ScrollView>

          {/* Products List / Grid */}
          <ScrollView
            style={styles.catalogScroll}
            contentContainerStyle={[
              viewMode === 'grid' ? styles.catalogGrid : styles.catalogList,
              // Leave space at bottom for floating cart bar on mobile
              !isWideScreen && cart.length > 0 && { paddingBottom: 85 },
            ]}
            keyboardShouldPersistTaps="handled">
            {filteredProducts.map((product) => {
              const isOut = product.stock <= 0;
              const isLow = !isOut && product.stock <= (settings.lowStockThreshold || 5);
              const inCartItem = cart.find((it) => it.product.id === product.id);

              if (viewMode === 'list') {
                // ================= Fast Compact List Row =================
                return (
                  <View
                    key={product.id}
                    style={[
                      styles.listRow,
                      {
                        backgroundColor: theme.card,
                        borderColor: inCartItem ? theme.primary : theme.border,
                        borderWidth: inCartItem ? 1.5 : 1,
                        opacity: isOut ? 0.6 : 1,
                      },
                    ]}>
                    <View style={styles.listRowLeft}>
                      {product.image ? (
                        <Image source={{ uri: product.image }} style={styles.listThumb} />
                      ) : (
                        <View style={[styles.listThumbFallback, { backgroundColor: theme.surfaceSubtle }]}>
                          <Ionicons name="cube-outline" size={18} color={theme.textMuted} />
                        </View>
                      )}
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.listRowName, { color: theme.text }]} numberOfLines={1}>
                          {language === 'ur' && product.nameUrdu ? product.nameUrdu : product.name}
                        </Text>
                        <Text style={[styles.listRowMeta, { color: theme.textMuted }]}>
                          {product.category} • {isOut ? t('soldOut') : `${product.stock} ${product.unit}`}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.listRowRight}>
                      <Text style={[styles.listRowPrice, { color: theme.primary }]}>
                        {settings.currencySymbol}{product.price}
                      </Text>

                      {inCartItem ? (
                        <View style={[styles.inlineStepper, { backgroundColor: theme.surfaceSubtle }]}>
                          <Pressable
                            onPress={() => updateQuantity(product.id, -1)}
                            style={styles.inlineStepBtn}>
                            <Ionicons name="remove" size={16} color={theme.text} />
                          </Pressable>
                          <Text style={[styles.inlineStepQty, { color: theme.text }]}>
                            {inCartItem.quantity}
                          </Text>
                          <Pressable
                            onPress={() => addToCart(product, 1)}
                            style={styles.inlineStepBtn}>
                            <Ionicons name="add" size={16} color={theme.text} />
                          </Pressable>
                        </View>
                      ) : (
                        <Pressable
                          disabled={isOut}
                          onPress={() => addToCart(product)}
                          style={[
                            styles.listAddBtn,
                            {
                              backgroundColor: isOut ? theme.surfaceSubtle : theme.primaryLight,
                              borderColor: isOut ? theme.border : theme.primary,
                            },
                          ]}>
                          <Ionicons
                            name="add"
                            size={16}
                            color={isOut ? theme.textMuted : theme.primary}
                          />
                          <Text
                            style={[
                              styles.listAddBtnText,
                              { color: isOut ? theme.textMuted : theme.primaryDark },
                            ]}>
                            {t('addItemToBill')}
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  </View>
                );
              }

              // ================= Clean Card Grid =================
              return (
                <Pressable
                  key={product.id}
                  disabled={isOut}
                  onPress={() => !inCartItem && addToCart(product)}
                  style={({ pressed }) => [
                    styles.gridCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: inCartItem ? theme.primary : theme.border,
                      borderWidth: inCartItem ? 2 : 1,
                      opacity: isOut ? 0.6 : 1,
                    },
                    pressed && !isOut && !inCartItem && { transform: [{ scale: 0.98 }] },
                  ]}>
                  {/* Stock pill */}
                  <View
                    style={[
                      styles.stockTag,
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
                        styles.stockTagText,
                        {
                          color: isOut
                            ? theme.danger
                            : isLow
                            ? theme.warning
                            : theme.success,
                        },
                      ]}>
                      {isOut ? t('soldOut') : `${product.stock} ${product.unit}`}
                    </Text>
                  </View>

                  <View style={styles.gridCardTop}>
                    {product.image ? (
                      <Image source={{ uri: product.image }} style={styles.gridThumb} />
                    ) : (
                      <View style={[styles.gridThumbFallback, { backgroundColor: theme.surfaceSubtle }]}>
                        <Ionicons name="cube-outline" size={24} color={theme.textMuted} />
                      </View>
                    )}
                    <View style={styles.gridTextContainer}>
                      <Text style={[styles.gridName, { color: theme.text }]} numberOfLines={2}>
                        {language === 'ur' && product.nameUrdu ? product.nameUrdu : product.name}
                      </Text>
                      <Text style={[styles.gridCategory, { color: theme.textMuted }]} numberOfLines={1}>
                        {product.category}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.gridCardBottom}>
                    <Text style={[styles.gridPrice, { color: theme.primary }]}>
                      {settings.currencySymbol}{product.price}
                    </Text>

                    {/* Stepper on card if in cart, otherwise + Add button */}
                    {inCartItem ? (
                      <View style={[styles.cardStepper, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
                        <Pressable
                          onPress={() => updateQuantity(product.id, -1)}
                          style={styles.cardStepBtn}>
                          <Ionicons name="remove" size={14} color={theme.text} />
                        </Pressable>
                        <Text style={[styles.cardStepQty, { color: theme.text }]}>
                          {inCartItem.quantity}
                        </Text>
                        <Pressable
                          onPress={() => addToCart(product, 1)}
                          style={styles.cardStepBtn}>
                          <Ionicons name="add" size={14} color={theme.text} />
                        </Pressable>
                      </View>
                    ) : (
                      <Pressable
                        disabled={isOut}
                        onPress={() => addToCart(product)}
                        style={[
                          styles.cardAddBtn,
                          {
                            backgroundColor: isOut ? theme.surfaceSubtle : theme.primaryLight,
                            borderColor: isOut ? theme.border : theme.primary,
                          },
                        ]}>
                        <Ionicons
                          name="add"
                          size={16}
                          color={isOut ? theme.textMuted : theme.primary}
                        />
                        <Text
                          style={[
                            styles.cardAddBtnText,
                            { color: isOut ? theme.textMuted : theme.primaryDark },
                          ]}>
                          {t('addItemToBill')}
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* ================= Mobile Sticky Floating Cart Bar ================= */}
          {!isWideScreen && cart.length > 0 && (
            <View style={styles.floatingBarContainer}>
              <Pressable
                onPress={() => setIsCheckoutDrawerOpen(true)}
                style={({ pressed }) => [
                  styles.floatingBar,
                  { backgroundColor: theme.primary },
                  pressed && { opacity: 0.92, transform: [{ scale: 0.98 }] },
                ]}>
                <View style={styles.floatingBarLeft}>
                  <View style={styles.floatingBadge}>
                    <Ionicons name="cart" size={18} color={theme.primary} />
                    <Text style={styles.floatingBadgeText}>{totalItemsCount}</Text>
                  </View>
                  <View>
                    <Text style={styles.floatingItemsCount}>
                      {totalItemsCount} {t('itemsInCart')}
                    </Text>
                    <Text style={styles.floatingTotal}>
                      {settings.currencySymbol}{grandTotal}
                    </Text>
                  </View>
                </View>

                <View style={styles.floatingBarRight}>
                  <Text style={styles.floatingBarActionText}>{t('viewBill')}</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </View>
              </Pressable>
            </View>
          )}
        </View>

        {/* ================= Wide Screen Dedicated Checkout Panel ================= */}
        {isWideScreen && (
          <View style={[styles.sideCheckoutPanel, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            {renderCheckoutContent()}
          </View>
        )}
      </View>

      {/* ================= Mobile Checkout Bottom Sheet Modal ================= */}
      {!isWideScreen && (
        <Modal
          visible={isCheckoutDrawerOpen}
          animationType="slide"
          onRequestClose={() => setIsCheckoutDrawerOpen(false)}>
          <View style={[styles.mobileModalContainer, { backgroundColor: theme.surface }]}>
            {renderCheckoutContent()}
          </View>
        </Modal>
      )}

      {/* Barcode Scanner Modal */}
      <BarcodeModal
        visible={isBarcodeOpen}
        onClose={() => setIsBarcodeOpen(false)}
        onSelectProduct={(p) => {
          addToCart(p);
        }}
      />

      {/* ⚡ Quick Item Modal */}
      <QuickItemModal
        visible={isQuickItemOpen}
        onClose={() => setIsQuickItemOpen(false)}
        onAddItem={handleAddQuickItem}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  catalogSection: {
    flex: 1,
    padding: Spacing.md,
    position: 'relative',
  },
  topControlBar: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  // Updated: search now uses SearchBar component (no inline styles needed)
  searchFlex: {
    flex: 1,
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quickItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 46,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    ...Shadows.sm,
  },
  quickItemBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  iconSquareBtn: {
    width: 46,
    height: 46,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  categoryScroll: {
    maxHeight: 40,
    marginBottom: Spacing.sm,
  },
  categoryScrollContent: {
    gap: 6,
    alignItems: 'center',
  },
  categoryPill: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
  },
  categoryPillText: {
    fontSize: 12,
  },
  catalogScroll: {
    flex: 1,
  },
  catalogGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  gridCard: {
    width: Platform.OS === 'web' ? ('calc(50% - 6px)' as any) : '48%',
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    justifyContent: 'space-between',
    minHeight: 125,
    position: 'relative',
    ...Shadows.md,
  },
  stockTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    zIndex: 1,
  },
  stockTagText: {
    fontSize: 9,
    fontWeight: '700',
  },
  gridCardTop: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  gridThumb: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.md,
  },
  gridThumbFallback: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridTextContainer: {
    flex: 1,
    paddingRight: 40,
  },
  gridName: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 17,
  },
  gridCategory: {
    fontSize: 11,
    marginTop: 2,
  },
  gridCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  gridPrice: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  cardAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  cardAddBtnText: {
    fontSize: 11,
    fontWeight: '800',
  },
  cardStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    paddingHorizontal: 4,
    paddingVertical: 2,
    gap: 6,
  },
  cardStepBtn: {
    padding: 3,
  },
  cardStepQty: {
    fontSize: 13,
    fontWeight: '800',
    minWidth: 16,
    textAlign: 'center',
  },

  // List View Styles
  catalogList: {
    gap: 6,
    paddingBottom: Spacing.xl,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  listRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  listThumb: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
  },
  listThumbFallback: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listRowName: {
    fontSize: 13,
    fontWeight: '700',
  },
  listRowMeta: {
    fontSize: 11,
    marginTop: 1,
  },
  listRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  listRowPrice: {
    fontSize: 14,
    fontWeight: '800',
  },
  inlineStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
    paddingHorizontal: 4,
    paddingVertical: 2,
    gap: 6,
  },
  inlineStepBtn: {
    padding: 4,
  },
  inlineStepQty: {
    fontSize: 13,
    fontWeight: '800',
    minWidth: 16,
    textAlign: 'center',
  },
  listAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  listAddBtnText: {
    fontSize: 11,
    fontWeight: '800',
  },

  // Floating Cart Bar (Mobile)
  floatingBarContainer: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 10,
  },
  floatingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    borderRadius: BorderRadius.xxl,
    ...Shadows.xl,
  },
  floatingBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  floatingBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.full,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  floatingBadgeText: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#DC2626',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  floatingItemsCount: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontWeight: '600',
  },
  floatingTotal: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  floatingBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  floatingBarActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  // Side Panel / Modal Drawer Shared
  sideCheckoutPanel: {
    width: 420,
    borderLeftWidth: 1,
    height: '100%',
    ...Shadows.lg,
  },
  mobileModalContainer: {
    flex: 1,
  },
  checkoutInner: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  drawerHeaderTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  drawerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  drawerHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  clearBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  closeDrawerBtn: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerScroll: {
    flex: 1,
  },
  drawerScrollContent: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  emptyDrawerBox: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyDrawerText: {
    fontSize: 12,
    textAlign: 'center',
  },
  itemsCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
  },
  cartItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  cartItemName: {
    fontSize: 13,
    fontWeight: '700',
  },
  cartItemPriceInfo: {
    fontSize: 11,
    marginTop: 2,
  },
  itemStepperWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  smallStepBtn: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallStepQty: {
    fontSize: 13,
    fontWeight: '800',
    minWidth: 18,
    textAlign: 'center',
  },
  trashBtn: {
    padding: 4,
    marginLeft: 4,
  },

  // Payment Selection
  sectionBlock: {
    gap: 6,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  payMethodsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  payCard: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    position: 'relative',
  },
  payCardEmoji: {
    fontSize: 20,
  },
  payCardLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
  selectedCheckBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Context Panels
  contextPanel: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    gap: 8,
  },
  contextLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  cashHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  denomRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  denomBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  denomText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cashInput: {
    height: 42,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    fontSize: 15,
    fontWeight: '700',
  },
  changeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
  },
  changeBannerLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  changeBannerAmount: {
    fontSize: 20,
    fontWeight: '900',
    marginTop: 2,
  },

  // Khata chips
  khataChipsScroll: {
    maxHeight: 38,
  },
  khataChipsContent: {
    gap: 6,
  },
  khataChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  khataChipName: {
    fontSize: 12,
    fontWeight: '600',
  },
  formInput: {
    height: 40,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    fontSize: 13,
  },

  // Collapsible
  collapsibleWrap: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  collapsibleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  collapsibleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  collapsibleTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  optionalContent: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: 10,
  },
  inputSubgroup: {
    gap: 4,
  },
  inputSubLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  discountInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  discShortcuts: {
    flexDirection: 'row',
    gap: 4,
  },
  discShortcutBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  discShortcutText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Checkout Footer
  checkoutFooter: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    ...Shadows.md,
  },
  totalBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  subtotalLine: {
    fontSize: 11,
    fontWeight: '500',
  },
  grandTotalLine: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  completeSaleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },
  completeSaleBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.2,
  },
});
