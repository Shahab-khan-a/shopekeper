import { BarcodeModal } from '@/components/BarcodeModal';
import { ProductImage } from '@/components/ProductImage';
import { EmptyState } from '@/components/ui/EmptyState';
import { FilterChip } from '@/components/ui/FilterChip';
import { SearchBar } from '@/components/ui/SearchBar';
import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';
import { CartItem, CustomerKhata, PaymentMethod, Product, ProductCategory } from '@/types';
import { formatCompactPrice } from '@/utils/formatters';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SALE_CATEGORIES } from '@/constants/categories';

const CATEGORIES: ProductCategory[] = SALE_CATEGORIES;

const CASH_DENOMINATIONS = [100, 500, 1000, 5000];
const DISCOUNT_SHORTCUTS = [10, 20, 50, 100];

export interface SaleScreenProps {
  isModal?: boolean;
  onClose?: () => void;
}

export const SaleScreen: React.FC<SaleScreenProps> = ({ isModal, onClose }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWideScreen = width >= 860;

  // W3-3: Responsive grid — 2 col narrow, 3 col medium, 4 col wide
  const catalogWidth = isWideScreen ? width * 0.55 : width;
  const gridCols = catalogWidth >= 700 ? 4 : catalogWidth >= 480 ? 3 : 2;
  const gridGap = 6;
  const gridColWidth = (catalogWidth - Spacing.md * 2 - gridGap * (gridCols - 1)) / gridCols;

  const { products, khata, sales, completeSale, settings, t, language, setActiveReceipt, setIsAddProductOpen, showAlert } = useShop();
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
  const SALE_VIEW_MODE_KEY = '@shopkeeper_sale_view_mode';
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    AsyncStorage.getItem(SALE_VIEW_MODE_KEY)
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
      AsyncStorage.setItem(SALE_VIEW_MODE_KEY, next).catch(() => {});
      return next;
    });
  };

  // Modals & Drawers
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  const [isCheckoutDrawerOpen, setIsCheckoutDrawerOpen] = useState(false);
  const [showOptionalDetails, setShowOptionalDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const checkoutScrollRef = useRef<ScrollView>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardHeight(0)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // W1-3: Success toast — stores last completed sale for explicit receipt view
  const [lastCompletedSale, setLastCompletedSale] = useState<any>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Top frequent products for Quick Add — keep lean (6 max)
  const topProducts = useMemo(() => {
    const freq: Record<string, number> = {};
    sales.forEach((sale) => {
      sale.items?.forEach((item: any) => {
        const id = item.product?.id || item.productId;
        if (id) freq[id] = (freq[id] || 0) + item.quantity;
      });
    });
    const inStock = products.filter((p) => p.stock > 0);
    if (Object.keys(freq).length === 0) {
      return inStock.slice(0, 6);
    }
    return [...inStock]
      .sort((a, b) => (freq[b.id] || 0) - (freq[a.id] || 0))
      .slice(0, 6);
  }, [products, sales]);
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const matchSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        (p.nameUrdu && p.nameUrdu.toLowerCase().includes(query)) ||
        (p.barcode && p.barcode.toLowerCase().includes(query));
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
      showAlert({
        type: 'warning',
        title: t('warningAlert'),
        message: t('outOfStockWarn'),
      });
      return;
    }

    const existingIndex = cart.findIndex((item) => item.product.id === product.id);

    if (existingIndex >= 0) {
      const existingItem = cart[existingIndex];
      const newQty = existingItem.quantity + delta;

      if (newQty > product.stock) {
        showAlert({
          type: 'warning',
          title: t('warningAlert'),
          message: `${t('stockExceededWarn')} (Available: ${product.stock} ${product.unit})`,
        });
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
            showAlert({
              type: 'warning',
              title: t('warningAlert'),
              message: `${t('stockExceededWarn')} (Stock: ${item.product.stock})`,
            });
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
    productId,
  }: {
    name: string;
    nameUrdu?: string;
    price: number;
    quantity: number;
    productId?: string;
  }) => {
    if (productId) {
      const existingProduct = products.find((p) => p.id === productId);
      if (existingProduct) {
        const inCart = cart.find((item) => item.product.id === productId);
        if (inCart) {
          const newQty = inCart.quantity + quantity;
          setCart(
            cart.map((item) =>
              item.product.id === productId
                ? { ...item, quantity: newQty, unitPrice: price, total: newQty * price }
                : item
            )
          );
        } else {
          setCart([
            ...cart,
            {
              product: existingProduct,
              quantity,
              unitPrice: price,
              total: price * quantity,
            },
          ]);
        }
        return;
      }
    }

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
      showAlert({
        type: 'warning',
        title: t('warningAlert'),
        message: t('cartEmpty'),
      });
      return;
    }

    if (paymentMethod === 'udhaar' && !customerName.trim() && !customerPhone.trim()) {
      const errMsg =
        language === 'ur'
          ? 'ادھار سیل کے لیے گاہک کا نام یا فون درج کرنا لازمی ہے۔'
          : 'Please provide Customer Name or Phone Number for Udhaar (Credit) sales.';
      showAlert({
        type: 'warning',
        title: t('warningAlert'),
        message: errMsg,
      });
      return;
    }

    if (paymentMethod === 'cash' && parsedTendered > 0 && parsedTendered < grandTotal) {
      showAlert({
        type: 'warning',
        title: language === 'ur' ? 'رقم کم ہے' : 'Insufficient Cash Received',
        message:
          language === 'ur'
            ? `کل بل ${settings.currencySymbol}${grandTotal} ہے جبکہ وصول شدہ رقم ${settings.currencySymbol}${parsedTendered} ہے۔ مزید ${settings.currencySymbol}${grandTotal - parsedTendered} درکار ہے۔`
            : `Bill total is ${settings.currencySymbol}${grandTotal}, but cash received is ${settings.currencySymbol}${parsedTendered}. Customer still owes ${settings.currencySymbol}${grandTotal - parsedTendered}.`,
      });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await completeSale({
        customerName: customerName.trim() || undefined,
        customerPhone: customerPhone.trim() || undefined,
        customerId: selectedKhataCustomer?.id,
        items: cart,
        discount: parsedDiscount,
        discountType,
        paymentMethod,
        tenderedCash: parsedTendered > 0 ? parsedTendered : undefined,
      });

      if (!result.success) {
        showAlert({
          type: 'error',
          title: t('warningAlert'),
          message: result.error || 'Failed to complete sale',
        });
        return;
      }

      // W1-3: Store the completed sale for manual receipt viewing
      setLastCompletedSale(result.sale);
      setShowSuccessToast(true);

      // Auto-dismiss toast after 8 seconds
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => {
        setShowSuccessToast(false);
      }, 8000);

      // Clear cart and close drawer
      clearCart();
    } catch (e: any) {
      console.error(e);
      showAlert({
        type: 'error',
        title: t('warningAlert'),
        message: e.message || 'Failed to complete sale',
      });
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
          <View style={[styles.drawerIconWrap, { backgroundColor: theme.primaryLight }]}>
            <Ionicons name="receipt" size={17} color={theme.primary} />
          </View>
          <Text style={[styles.drawerTitle, { color: theme.text }]}>
            {t('cart')} ({totalItemsCount})
          </Text>
        </View>

        <View style={styles.drawerHeaderActions}>
          {cart.length > 0 ? (
            <Pressable
              onPress={() => {
                showAlert({
                  type: 'warning',
                  title: t('clearCart'),
                  message: t('clearCartConfirm'),
                  buttons: [
                    {
                      text: t('clearAll'),
                      style: 'destructive',
                      icon: 'trash-outline',
                      onPress: clearCart,
                    },
                    { text: t('cancel'), style: 'cancel' },
                  ],
                });
              }}
              accessibilityLabel={t('clearCart')}
              accessibilityRole="button"
              accessibilityHint="Removes all items from the current bill"
              style={styles.clearBtn}>
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
        ref={checkoutScrollRef}
        style={styles.drawerScroll}
        contentContainerStyle={[
          styles.drawerScrollContent,
          { paddingBottom: keyboardHeight > 0 ? 80 : 20 },
        ]}
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
            <ScrollView
              style={[styles.cartItemsScroll, { maxHeight: isWideScreen ? 340 : 210 }]}
              contentContainerStyle={styles.cartItemsScrollContent}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled">
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
                      accessibilityLabel={`Decrease quantity of ${item.product.name}`}
                      accessibilityRole="button"
                      style={[styles.smallStepBtn, { backgroundColor: theme.card, borderColor: theme.border }]}>
                      <Ionicons name="remove" size={16} color={theme.text} />
                    </Pressable>
                    <Text style={[styles.smallStepQty, { color: theme.text }]}>
                      {item.quantity}
                    </Text>
                    <Pressable
                      onPress={() => updateQuantity(item.product.id, 1)}
                      accessibilityLabel={`Increase quantity of ${item.product.name}`}
                      accessibilityRole="button"
                      style={[styles.smallStepBtn, { backgroundColor: theme.card, borderColor: theme.border }]}>
                      <Ionicons name="add" size={16} color={theme.text} />
                    </Pressable>
                    <Pressable
                      onPress={() => removeFromCart(item.product.id)}
                      accessibilityLabel={`Remove ${item.product.name} from bill`}
                      accessibilityRole="button"
                      style={styles.trashBtn}>
                      <Ionicons name="trash-outline" size={16} color={theme.danger} />
                    </Pressable>
                  </View>
                </View>
              ))}
            </ScrollView>
            {cart.length > 3 && (
              <View style={[styles.scrollIndicatorRow, { borderTopColor: theme.border, backgroundColor: theme.card }]}>
                <Ionicons name="swap-vertical" size={12} color={theme.textMuted} />
                <Text style={[styles.scrollIndicatorText, { color: theme.textMuted }]}>
                  {language === 'ur'
                    ? `تمام ${cart.length} اشیاء دیکھنے کے لیے سکرول کریں`
                    : `Scroll to view all ${cart.length} items`}
                </Text>
              </View>
            )}
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

            {/* Quick Denominations (Horizontal Scroll) */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled={true}
              style={styles.denomScroll}
              contentContainerStyle={styles.denomScrollContent}>
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
            </ScrollView>

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
                      parsedTendered >= grandTotal ? theme.successLight : theme.dangerLight,
                    borderColor:
                      parsedTendered >= grandTotal ? theme.success : theme.danger,
                  },
                ]}>
                <View>
                  <Text
                    style={[
                      styles.changeBannerLabel,
                      { color: parsedTendered >= grandTotal ? theme.success : theme.danger },
                    ]}>
                    {parsedTendered >= grandTotal
                      ? t('changeReturn')
                      : language === 'ur'
                      ? 'کم رقم (بقایا مطلوب)'
                      : 'Short Amount (Insufficient)'}
                  </Text>
                  <Text
                    style={[
                      styles.changeBannerAmount,
                      { color: parsedTendered >= grandTotal ? theme.success : theme.danger },
                    ]}>
                    {settings.currencySymbol}{' '}
                    {parsedTendered >= grandTotal
                      ? changeToReturn
                      : grandTotal - parsedTendered}
                  </Text>
                </View>
                <Ionicons
                  name={parsedTendered >= grandTotal ? 'checkmark-circle' : 'alert-circle'}
                  size={28}
                  color={parsedTendered >= grandTotal ? theme.success : theme.danger}
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

            {/* Horizontal Chips: New Customer + Existing Khata Customers */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled={true}
              style={styles.khataChipsScroll}
              contentContainerStyle={styles.khataChipsContent}>
              <Pressable
                onPress={() => {
                  setSelectedKhataCustomer(null);
                  setCustomerName('');
                  setCustomerPhone('');
                }}
                style={[
                  styles.khataChip,
                  {
                    backgroundColor: !selectedKhataCustomer ? theme.primary : theme.card,
                    borderColor: !selectedKhataCustomer ? theme.primary : theme.border,
                  },
                ]}>
                <Ionicons
                  name="person-add"
                  size={13}
                  color={!selectedKhataCustomer ? '#FFFFFF' : theme.primary}
                />
                <Text
                  style={[
                    styles.khataChipName,
                    {
                      color: !selectedKhataCustomer ? '#FFFFFF' : theme.text,
                      fontWeight: '700',
                    },
                  ]}>
                  {language === 'ur' ? '+ نیا گاہک' : '+ New Customer'}
                </Text>
              </Pressable>

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

            {/* Customer Name & Phone Input */}
            <View style={{ gap: 8, marginTop: 4 }}>
              <TextInput
                style={[
                  styles.formInput,
                  { backgroundColor: theme.card, color: theme.text, borderColor: theme.border },
                ]}
                placeholder={language === 'ur' ? 'گاہک کا نام درج کریں *' : 'Enter Customer Name *'}
                placeholderTextColor={theme.textMuted}
                value={customerName}
                onChangeText={(val) => {
                  setCustomerName(val);
                  setSelectedKhataCustomer(null);
                }}
                onFocus={() => {
                  setTimeout(() => {
                    checkoutScrollRef.current?.scrollToEnd({ animated: true });
                  }, 150);
                }}
              />
              <TextInput
                style={[
                  styles.formInput,
                  { backgroundColor: theme.card, color: theme.text, borderColor: theme.border },
                ]}
                placeholder={language === 'ur' ? 'گاہک کا واٹس ایپ / فون نمبر *' : 'Customer WhatsApp / Phone *'}
                placeholderTextColor={theme.textMuted}
                keyboardType="phone-pad"
                value={customerPhone}
                onChangeText={setCustomerPhone}
                onFocus={() => {
                  setTimeout(() => {
                    checkoutScrollRef.current?.scrollToEnd({ animated: true });
                  }, 150);
                }}
              />
              <Text style={{ fontSize: 11, color: theme.textMuted, marginTop: 1 }}>
                {selectedKhataCustomer
                  ? language === 'ur'
                    ? `موجودہ کھاتہ بیلنس: ${settings.currencySymbol}${selectedKhataCustomer.totalDebt || 0}`
                    : `Existing Khata Balance: ${settings.currencySymbol}${selectedKhataCustomer.totalDebt || 0}`
                  : language === 'ur'
                  ? 'نیا گاہک خودکار طور پر کھاتہ رجسٹر میں شامل ہو جائے گا۔'
                  : 'New customer will be automatically created in Khata on checkout.'}
              </Text>
            </View>
          </View>
        )}

        {/* ── Always-Visible Discount Row ── */}
        {cart.length > 0 && (
          <View style={[styles.discountRow, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
            <View style={styles.discountRowHeader}>
              <Ionicons name="pricetag-outline" size={14} color={theme.textSecondary} />
              <Text style={[styles.discountRowLabel, { color: theme.textSecondary }]}>
                {t('discount')}
              </Text>
              {discountAmount > 0 && (
                <Text style={[styles.discountSavedBadge, { color: theme.success, backgroundColor: theme.successLight }]}>
                  -{settings.currencySymbol}{discountAmount}
                </Text>
              )}
            </View>
            <View style={styles.discountInputRow}>
              {/* Fixed / % toggle */}
              <Pressable
                onPress={() => {
                  setDiscountType(prev => prev === 'fixed' ? 'percent' : 'fixed');
                  setDiscount('');
                }}
                accessibilityLabel={discountType === 'fixed' ? 'Switch to percent discount' : 'Switch to fixed discount'}
                accessibilityRole="button"
                style={[styles.discTypeToggle, { backgroundColor: theme.primary }]}>
                <Text style={styles.discTypeToggleText}>
                  {discountType === 'fixed' ? settings.currencySymbol : '%'}
                </Text>
              </Pressable>
              <TextInput
                style={[
                  styles.formInput,
                  styles.discountInput,
                  { backgroundColor: theme.card, color: theme.text, borderColor: theme.border },
                ]}
                placeholder={discountType === 'fixed' ? '0' : '0%'}
                placeholderTextColor={theme.textMuted}
                keyboardType="numeric"
                value={discount}
                onChangeText={setDiscount}
                onFocus={() => {
                  setTimeout(() => {
                    checkoutScrollRef.current?.scrollToEnd({ animated: true });
                  }, 150);
                }}
              />
              <View style={styles.discShortcuts}>
                {DISCOUNT_SHORTCUTS.map((amt) => {
                  const isSelected = discount === amt.toString();
                  return (
                    <Pressable
                      key={amt}
                      onPress={() => setDiscount(amt.toString())}
                      style={({ pressed }) => [
                        styles.discShortcutBtn,
                        {
                          backgroundColor: isSelected ? theme.primary : theme.card,
                          borderColor: isSelected ? theme.primary : 'transparent',
                        },
                        pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
                      ]}>
                      <Text
                        style={[
                          styles.discShortcutText,
                          {
                            color: isSelected ? '#FFFFFF' : theme.textSecondary,
                            fontWeight: isSelected ? '800' : '600',
                          },
                        ]}>
                        {discountType === 'fixed' ? `-${amt}` : `${amt}%`}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {/* Optional Collapsible: Customer WhatsApp for receipt (Cash/Online only) */}
        {paymentMethod !== 'udhaar' && (
          <View style={styles.collapsibleWrap}>
            <Pressable
              onPress={() => {
                const next = !showOptionalDetails;
                setShowOptionalDetails(next);
                if (next) {
                  setTimeout(() => {
                    checkoutScrollRef.current?.scrollToEnd({ animated: true });
                  }, 150);
                }
              }}
              style={styles.collapsibleHeader}>
              <View style={styles.collapsibleTitleRow}>
                <Ionicons
                  name={showOptionalDetails ? 'chevron-down' : 'chevron-forward'}
                  size={18}
                  color={theme.textSecondary}
                />
                <Text style={[styles.collapsibleTitle, { color: theme.textSecondary }]}>
                  {language === 'ur' ? 'گاہک کا نمبر (اختیاری)' : 'Customer Phone for Receipt (Optional)'}
                </Text>
              </View>
              {customerPhone ? (
                <View style={[styles.activeDot, { backgroundColor: theme.primary }]} />
              ) : null}
            </Pressable>

            {showOptionalDetails && (
              <View style={[styles.optionalContent, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
                <TextInput
                  style={[
                    styles.formInput,
                    { backgroundColor: theme.card, color: theme.text, borderColor: theme.border },
                  ]}
                  placeholder={language === 'ur' ? 'واٹس ایپ نمبر (0300...)' : 'WhatsApp (0300...)'}
                  placeholderTextColor={theme.textMuted}
                  keyboardType="phone-pad"
                  value={customerPhone}
                  onChangeText={setCustomerPhone}
                  onFocus={() => {
                    setTimeout(() => {
                      checkoutScrollRef.current?.scrollToEnd({ animated: true });
                    }, 150);
                  }}
                />
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bill Total & Primary Action Button */}
      <View
        style={[
          styles.checkoutFooter,
          {
            backgroundColor: theme.surface,
            borderTopColor: theme.border,
            paddingBottom: Math.max(insets.bottom, 16) + 12,
          },
        ]}>

        {/* W1-3: Sale Success Toast Banner */}
        {showSuccessToast && lastCompletedSale && (
          <View style={[styles.successToast, { backgroundColor: theme.successLight, borderColor: theme.success }]}>
            <View style={styles.successToastLeft}>
              <Ionicons name="checkmark-circle" size={20} color={theme.success} />
              <Text style={[styles.successToastText, { color: theme.success }]}>
                {t('saleSavedToast')}
              </Text>
            </View>
            <Pressable
              onPress={() => {
                setActiveReceipt(lastCompletedSale);
                setShowSuccessToast(false);
              }}
              accessibilityLabel={t('saleViewReceiptBtn')}
              accessibilityRole="button"
              style={[styles.successToastBtn, { backgroundColor: theme.success }]}>
              <Ionicons name="receipt-outline" size={14} color="#FFFFFF" />
              <Text style={styles.successToastBtnText}>{t('saleViewReceiptBtn')}</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.totalBar}>
          <View style={{ flexShrink: 1, paddingRight: 8 }}>
            <Text style={[styles.subtotalLine, { color: theme.textSecondary }]} numberOfLines={1}>
              {t('subtotal')}: {settings.currencySymbol} {formatCompactPrice(subtotal)}
              {discountAmount > 0 && ` | -${settings.currencySymbol} ${formatCompactPrice(discountAmount)}`}
            </Text>
            <Text
              style={[styles.grandTotalLine, { color: theme.primary }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}>
              {settings.currencySymbol} {formatCompactPrice(grandTotal)}
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
            {isProcessing ? (
              <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 6 }} />
            ) : (
              <Ionicons
                name="checkmark-circle"
                size={22}
                color={cart.length === 0 ? theme.textMuted : '#FFFFFF'}
              />
            )}
            <Text
              style={[
                styles.completeSaleBtnText,
                cart.length === 0 && { color: theme.textMuted },
              ]}
              numberOfLines={1}>
              {isProcessing
                ? language === 'ur'
                  ? 'پروسیس ہو رہا ہے...'
                  : 'Processing...'
                : t('generateBill')}
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
      {isModal && (
        <View style={[styles.modalTopHeader, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
          <Pressable
            onPress={onClose}
            accessibilityLabel={t('cancel')}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.modalCloseBtn,
              pressed && { opacity: 0.7 },
            ]}>
            <Ionicons name="close" size={24} color={theme.text} />
          </Pressable>
          <View style={styles.modalHeaderTitleWrap}>
            <Ionicons name="cart" size={20} color={theme.primary} />
            <Text style={[styles.modalHeaderTitle, { color: theme.text }]}>
              {t('sale')}
            </Text>
          </View>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.modalDoneBtn,
              { backgroundColor: theme.primaryLight },
              pressed && { opacity: 0.7 },
            ]}>
            <Text style={[styles.modalDoneBtnText, { color: theme.primary }]}>
              {language === 'ur' ? 'مکمل' : 'Done'}
            </Text>
          </Pressable>
        </View>
      )}
      <View style={styles.mainLayout}>
        {/* ================= Catalog Section (Full Screen on Mobile) ================= */}
        <View style={styles.catalogSection}>
          {/* Top Control Bar: Search + Barcode + View Toggle */}
          <View style={styles.topControlBar}>
            <View style={styles.searchFlex}>
              <View style={styles.searchInlineRow}>
                <View style={{ flex: 1 }}>
                  <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder={language === 'ur' ? 'نام یا بارکوڈ...' : 'Search name or barcode...'}
                    height={40}
                  />
                </View>

                <Pressable
                  onPress={() => setIsBarcodeOpen(true)}
                  style={({ pressed }) => [
                    styles.searchBarcodeBtn,
                    {
                      backgroundColor: settings.darkMode ? 'rgba(16,185,129,0.16)' : '#ECFDF5',
                      borderColor: settings.darkMode ? 'rgba(16,185,129,0.35)' : '#A7F3D0',
                    },
                    pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
                  ]}>
                  <Ionicons name="barcode-outline" size={20} color={theme.primary} />
                </Pressable>
              </View>
            </View>

            <View style={styles.topBarActions}>
              <Pressable
                onPress={toggleViewMode}
                style={({ pressed }) => [
                  styles.iconSquareBtn,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                  pressed && { opacity: 0.8 },
                ]}>
                <Ionicons
                  name={viewMode === 'grid' ? 'list-outline' : 'grid-outline'}
                  size={18}
                  color={theme.textSecondary}
                />
              </Pressable>
            </View>
          </View>

          {/* Compact Quick Add — frequent items only (hidden while searching) */}
          {topProducts.length > 0 && !searchQuery ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.favRowScroll}
              contentContainerStyle={styles.favRowContent}>
              <View style={styles.favLead}>
                <Ionicons name="flash" size={11} color={theme.accent} />
              </View>
              {topProducts.map((product) => {
                const isOut = product.stock <= 0;
                const inCart = cart.find((it) => it.product.id === product.id);

                return (
                  <Pressable
                    key={product.id}
                    disabled={isOut}
                    onPress={() => addToCart(product)}
                    accessibilityLabel={`Quick add ${product.name}`}
                    accessibilityRole="button"
                    style={({ pressed }) => [
                      styles.favChip,
                      {
                        backgroundColor: inCart
                          ? theme.primaryLight
                          : settings.darkMode
                            ? theme.surfaceSubtle
                            : '#FFFFFF',
                        borderColor: inCart
                          ? theme.primary
                          : settings.darkMode
                            ? 'rgba(255,255,255,0.1)'
                            : 'rgba(148,163,184,0.45)',
                        opacity: isOut ? 0.4 : 1,
                      },
                      pressed && !isOut && { transform: [{ scale: 0.96 }] },
                    ]}>
                    <Text
                      style={[
                        styles.favChipName,
                        { color: inCart ? theme.primary : theme.text },
                      ]}
                      numberOfLines={1}>
                      {language === 'ur' && product.nameUrdu ? product.nameUrdu : product.name}
                    </Text>
                    {inCart ? (
                      <View style={[styles.favChipBadge, { backgroundColor: theme.primary }]}>
                        <Text style={styles.favChipBadgeText}>{inCart.quantity}</Text>
                      </View>
                    ) : (
                      <Text style={[styles.favChipPrice, { color: theme.textMuted }]}>
                        {settings.currencySymbol}
                        {formatCompactPrice(product.price)}
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : null}

          {/* Category Filter Pills — quiet, compact */}
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

          {/* Products List / Grid or Empty State */}
          {products.length === 0 ? (
            <View style={styles.catalogEmptyContainer}>
              <View style={[styles.catalogEmptyIconBox, { backgroundColor: theme.primaryLight }]}>
                <Ionicons name="cube-outline" size={50} color={theme.primary} />
              </View>
              <Text style={[styles.catalogEmptyTitle, { color: theme.text }]}>
                {language === 'ur' ? 'انوینٹری میں کوئی پروڈکٹ نہیں ہے' : 'No Products in Inventory'}
              </Text>
              <Text style={[styles.catalogEmptySub, { color: theme.textSecondary }]}>
                {language === 'ur'
                  ? 'سیل کرنے کے لیے پہلے پروڈکٹ شامل کریں۔'
                  : 'Add products to your catalog to start creating sales.'}
              </Text>

              <View style={styles.catalogEmptyBtnRow}>
                <Pressable
                  onPress={() => setIsAddProductOpen(true)}
                  style={({ pressed }) => [
                    styles.catalogEmptyPrimaryBtn,
                    { backgroundColor: theme.primary },
                    pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] },
                  ]}>
                  <Ionicons name="add-circle" size={18} color="#FFFFFF" />
                  <Text style={styles.catalogEmptyPrimaryBtnText}>
                    {t('addProductBtn')}
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : filteredProducts.length === 0 ? (
            <View style={styles.catalogEmptyContainer}>
              <View style={[styles.catalogEmptyIconBox, { backgroundColor: theme.surfaceSubtle }]}>
                <Ionicons name="search-outline" size={42} color={theme.textMuted} />
              </View>
              <Text style={[styles.catalogEmptyTitle, { color: theme.text }]}>
                {language === 'ur' ? 'کوئی پروڈکٹ نہیں ملا' : 'No Matching Products'}
              </Text>
              <Text style={[styles.catalogEmptySub, { color: theme.textSecondary }]}>
                {language === 'ur'
                  ? 'آپ کی تلاش یا کیٹیگری کے مطابق کوئی چیز نہیں ملی۔'
                  : 'No items match your search or category filter.'}
              </Text>
              <Pressable
                onPress={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                style={({ pressed }) => [
                  styles.catalogEmptySecondaryBtn,
                  { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
                  pressed && { opacity: 0.8 },
                ]}>
                <Ionicons name="refresh-outline" size={16} color={theme.text} />
                <Text style={[styles.catalogEmptySecondaryBtnText, { color: theme.text }]}>
                  {language === 'ur' ? 'تمام مصنوعات دکھائیں' : 'Clear Search & Show All'}
                </Text>
              </Pressable>
            </View>
          ) : (
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
                  // ================= Enhanced Modern List Row =================
                  return (
                    <Pressable
                      key={product.id}
                      disabled={isOut}
                      onPress={() => !inCartItem && addToCart(product)}
                      style={({ pressed }) => [
                        styles.listRow,
                        {
                          backgroundColor: theme.card,
                          borderColor: inCartItem ? theme.primary : theme.border,
                          borderWidth: inCartItem ? 1.5 : 1,
                          opacity: isOut ? 0.6 : 1,
                        },
                        pressed && !isOut && !inCartItem && { opacity: 0.9, transform: [{ scale: 0.99 }] },
                      ]}>
                      {/* Left: Thumbnail Image */}
                      <View style={[styles.listThumbWrap, { backgroundColor: theme.surfaceSubtle }]}>
                        <ProductImage
                          uri={product.image || product.imageUri}
                          style={styles.listThumb}
                          resizeMode="cover"
                          fallbackColor={theme.textMuted}
                          fallbackSize={24}
                        />
                      </View>

                      {/* Middle: Name, Category badge & Stock Pill */}
                      <View style={styles.listRowContent}>
                        <Text style={[styles.listRowName, { color: theme.text }]} numberOfLines={1}>
                          {language === 'ur' && product.nameUrdu ? product.nameUrdu : product.name}
                        </Text>
                        <View style={styles.listRowBadgeRow}>
                          <View style={[styles.listCategoryBadge, { backgroundColor: settings.darkMode ? 'rgba(255,255,255,0.08)' : '#F1F5F9' }]}>
                            <Text style={[styles.listCategoryText, { color: theme.textSecondary }]}>
                              {product.category}
                            </Text>
                          </View>
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
                              size={11}
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
                        </View>
                      </View>

                      {/* Right: Price & Stepper / Add button */}
                      <View style={styles.listRowRight}>
                        <Text
                          style={[styles.listRowPrice, { color: theme.primary }]}
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          minimumFontScale={0.75}>
                          {settings.currencySymbol}{formatCompactPrice(product.price)}
                        </Text>

                        {inCartItem ? (
                          <View
                            style={[
                              styles.listStepperContainer,
                              {
                                borderColor: settings.darkMode ? 'rgba(255,255,255,0.18)' : '#CBD5E1',
                              },
                            ]}>
                            <Pressable
                              onPress={() => updateQuantity(product.id, -1)}
                              style={({ pressed }) => [
                                styles.listStepBtnMinus,
                                {
                                  backgroundColor: settings.darkMode
                                    ? 'rgba(255,255,255,0.08)'
                                    : '#F1F5F9',
                                },
                                pressed && { opacity: 0.6 },
                              ]}
                              hitSlop={{ top: 6, bottom: 6, left: 6, right: 2 }}>
                              <Ionicons name="remove" size={16} color={theme.text} />
                            </Pressable>
                            <View
                              style={[
                                styles.listStepQtyBox,
                                {
                                  backgroundColor: settings.darkMode ? theme.card : '#FFFFFF',
                                  borderColor: settings.darkMode ? 'rgba(255,255,255,0.18)' : '#CBD5E1',
                                },
                              ]}>
                              <Text style={[styles.listStepQtyText, { color: theme.text }]}>
                                {inCartItem.quantity}
                              </Text>
                            </View>
                            <Pressable
                              onPress={() => addToCart(product, 1)}
                              style={({ pressed }) => [
                                styles.listStepBtnPlus,
                                {
                                  backgroundColor: settings.darkMode
                                    ? 'rgba(255,255,255,0.08)'
                                    : '#F1F5F9',
                                },
                                pressed && { opacity: 0.6 },
                              ]}
                              hitSlop={{ top: 6, bottom: 6, left: 2, right: 6 }}>
                              <Ionicons name="add" size={16} color={theme.text} />
                            </Pressable>
                          </View>
                        ) : (
                          <Pressable
                            disabled={isOut}
                            onPress={() => addToCart(product)}
                            style={({ pressed }) => [
                              styles.listAddBtn,
                              {
                                backgroundColor: isOut ? theme.surfaceSubtle : theme.primaryLight,
                                borderColor: isOut ? theme.border : theme.primary,
                              },
                              pressed && !isOut && { opacity: 0.8 },
                            ]}>
                            <Ionicons
                              name="add-circle"
                              size={16}
                              color={isOut ? theme.textMuted : theme.primary}
                            />
                            <Text
                              style={[
                                styles.listAddBtnText,
                                { color: isOut ? theme.textMuted : theme.primaryDark },
                              ]}
                              numberOfLines={1}>
                              {t('addToBillShort')}
                            </Text>
                          </Pressable>
                        )}
                      </View>
                    </Pressable>
                  );
                }

                // ================= Compact Card Grid =================
                return (
                  <Pressable
                    key={product.id}
                    disabled={isOut}
                    onPress={() => !inCartItem && addToCart(product)}
                    style={({ pressed }) => [
                      styles.gridCard,
                      {
                        width: gridColWidth,
                        backgroundColor: theme.card,
                        borderColor: inCartItem ? theme.primary : theme.border,
                        borderWidth: inCartItem ? 1.5 : 1,
                        opacity: isOut ? 0.6 : 1,
                      },
                      pressed && !isOut && !inCartItem && { transform: [{ scale: 0.98 }] },
                    ]}>
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
                        {isOut ? t('soldOut') : `${product.stock}`}
                      </Text>
                    </View>

                    <View style={styles.gridCardTop}>
                      <View style={[styles.gridThumbFallback, { backgroundColor: theme.surfaceSubtle }]}>
                        <ProductImage
                          uri={product.image || product.imageUri}
                          style={styles.gridThumb}
                          resizeMode="cover"
                          fallbackColor={theme.textMuted}
                          fallbackSize={20}
                        />
                      </View>
                      <Text style={[styles.gridName, { color: theme.text }]} numberOfLines={2}>
                        {language === 'ur' && product.nameUrdu ? product.nameUrdu : product.name}
                      </Text>
                    </View>

                    <View style={styles.gridCardBottom}>
                      <Text
                        style={[styles.gridPrice, { color: theme.primary }]}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={0.75}>
                        {settings.currencySymbol}
                        {formatCompactPrice(product.price)}
                      </Text>

                      {inCartItem ? (
                        <View
                          style={[
                            styles.cardStepperContainer,
                            {
                              borderColor: settings.darkMode ? 'rgba(255,255,255,0.18)' : '#CBD5E1',
                            },
                          ]}>
                          <Pressable
                            onPress={() => updateQuantity(product.id, -1)}
                            style={({ pressed }) => [
                              styles.cardStepBtnMinus,
                              {
                                backgroundColor: settings.darkMode
                                  ? 'rgba(255,255,255,0.08)'
                                  : '#F1F5F9',
                              },
                              pressed && { opacity: 0.6 },
                            ]}
                            hitSlop={{ top: 6, bottom: 6, left: 6, right: 2 }}>
                            <Ionicons name="remove" size={16} color={theme.text} />
                          </Pressable>
                          <View
                            style={[
                              styles.cardStepQtyBox,
                              {
                                backgroundColor: settings.darkMode ? theme.card : '#FFFFFF',
                                borderColor: settings.darkMode ? 'rgba(255,255,255,0.18)' : '#CBD5E1',
                              },
                            ]}>
                            <Text style={[styles.cardStepQtyText, { color: theme.text }]}>
                              {inCartItem.quantity}
                            </Text>
                          </View>
                          <Pressable
                            onPress={() => addToCart(product, 1)}
                            style={({ pressed }) => [
                              styles.cardStepBtnPlus,
                              {
                                backgroundColor: settings.darkMode
                                  ? 'rgba(255,255,255,0.08)'
                                  : '#F1F5F9',
                              },
                              pressed && { opacity: 0.6 },
                            ]}
                            hitSlop={{ top: 6, bottom: 6, left: 2, right: 6 }}>
                            <Ionicons name="add" size={16} color={theme.text} />
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
                            size={14}
                            color={isOut ? theme.textMuted : theme.primary}
                          />
                        </Pressable>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

          {/* ================= Mobile Sticky Floating Cart Bar ================= */}
          {!isWideScreen && cart.length > 0 && (
            <View style={styles.floatingBarContainer}>
              {/* Quick Discard — tap to clear cart without opening drawer */}
              <Pressable
                onPress={() => {
                  showAlert({
                    type: 'warning',
                    title: language === 'ur' ? 'بل خارج کریں' : 'Discard Cart',
                    message: language === 'ur'
                      ? `${totalItemsCount} آئٹم ہیں، کیا آپ بل خارج کرنا چاہتے ہیں؟`
                      : `Discard ${totalItemsCount} item${totalItemsCount !== 1 ? 's' : ''} from the current bill?`,
                    buttons: [
                      {
                        text: language === 'ur' ? 'خارج کریں' : 'Discard',
                        style: 'destructive',
                        icon: 'trash-outline',
                        onPress: clearCart,
                      },
                      { text: language === 'ur' ? 'منسوخ' : 'Cancel', style: 'cancel' },
                    ],
                  });
                }}
                style={({ pressed }) => [
                  styles.floatingDiscardBtn,
                  pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
                ]}>
                <Ionicons name="close" size={22} color={theme.danger} />
              </Pressable>

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
                    <Text style={styles.floatingTotal} numberOfLines={1}>
                      {settings.currencySymbol} {formatCompactPrice(grandTotal)}
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
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View
              style={[
                styles.mobileModalContainer,
                {
                  backgroundColor: theme.surface,
                  paddingTop: insets.top > 0 ? insets.top : Platform.OS === 'ios' ? 16 : 8,
                },
                Platform.OS === 'android' && keyboardHeight > 0 && {
                  paddingBottom: keyboardHeight,
                },
              ]}>
              {renderCheckoutContent()}
            </View>
          </KeyboardAvoidingView>
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
    marginBottom: 8,
    alignItems: 'center',
  },
  searchFlex: {
    flex: 1,
  },
  searchInlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  searchBarcodeBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    ...Shadows.sm,
  },
  quickItemBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  iconSquareBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryScroll: {
    maxHeight: 36,
    marginBottom: 8,
  },
  categoryScrollContent: {
    gap: 6,
    alignItems: 'center',
  },

  favRowScroll: {
    maxHeight: 34,
    marginBottom: 8,
  },
  favRowContent: {
    gap: 6,
    alignItems: 'center',
    paddingRight: 4,
  },
  favLead: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    position: 'relative',
  },
  favChipName: {
    fontSize: 11.5,
    fontWeight: '700',
    maxWidth: 78,
  },
  favChipPrice: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  favChipBadge: {
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  favChipBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
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
    gap: 6,
    paddingBottom: Spacing.xl,
  },
  gridCard: {
    borderRadius: 12,
    padding: 10,
    justifyContent: 'space-between',
    minHeight: 98,
    position: 'relative',
    overflow: 'hidden',
    ...Shadows.sm,
  },
  stockTag: {
    position: 'absolute',
    top: 6,
    right: 6,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: BorderRadius.full,
    zIndex: 1,
  },
  stockTagText: {
    fontSize: 9,
    fontWeight: '700',
  },
  gridCardTop: {
    flexDirection: 'row',
    gap: 7,
    alignItems: 'center',
    paddingRight: 28,
  },
  gridThumb: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  gridThumbFallback: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gridTextContainer: {
    flex: 1,
  },
  gridName: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '700',
    lineHeight: 16,
  },
  gridCategory: {
    fontSize: 10,
    marginTop: 1,
  },
  gridCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  gridPrice: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  cardAddBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  cardAddBtnText: {
    fontSize: 10,
    fontWeight: '700',
  },
  cardStepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
    height: 32,
    marginRight: -10,
    marginBottom: -10,
  },
  cardStepBtnMinus: {
    width: 28,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardStepQtyBox: {
    width: 28,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  cardStepQtyText: {
    fontSize: 13,
    fontWeight: '800',
  },
  cardStepBtnPlus: {
    width: 28,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    minHeight: 64,
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  listThumbWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listThumb: {
    width: '100%',
    height: '100%',
  },
  listThumbFallback: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listRowContent: {
    flex: 1,
    gap: 4,
    justifyContent: 'center',
  },
  listRowName: {
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  listRowBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexWrap: 'wrap',
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
  listStockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  listStockText: {
    fontSize: 10,
    fontWeight: '700',
  },
  listRowMeta: {
    fontSize: 11,
    marginTop: 1,
  },
  listRowRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  listRowPrice: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  listStepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
    height: 32,
    marginRight: -10,
    marginBottom: -10,
  },
  listStepBtnMinus: {
    width: 28,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listStepQtyBox: {
    width: 34,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  listStepQtyText: {
    fontSize: 14,
    fontWeight: '800',
  },
  listStepBtnPlus: {
    width: 32,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  floatingDiscardBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FECACA',
    ...Shadows.md,
  },
  floatingBar: {
    flex: 1,
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
  drawerHandle: {
    width: 38,
    height: 4.5,
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
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
    gap: 10,
  },
  drawerIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerTitle: {
    fontSize: 17,
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
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cartItemsScroll: {
    width: '100%',
  },
  cartItemsScrollContent: {
    flexGrow: 0,
  },
  cartItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
  },
  scrollIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    borderTopWidth: 1,
  },
  scrollIndicatorText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cartItemName: {
    fontSize: 14,
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
    width: 32,
    height: 32,
    minWidth: 32,
    minHeight: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallStepQty: {
    fontSize: 13,
    fontWeight: '800',
    minWidth: 22,
    textAlign: 'center',
  },
  trashBtn: {
    padding: 8,
    marginLeft: 2,
    minWidth: 32,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    position: 'relative',
  },
  payCardEmoji: {
    fontSize: 22,
    marginBottom: 2,
  },
  payCardLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  selectedCheckBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Context Panels
  contextPanel: {
    borderRadius: 14,
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
  denomScroll: {
    marginHorizontal: -Spacing.md,
  },
  denomScrollContent: {
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  denomBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    flexShrink: 0,
  },
  denomText: {
    fontSize: 12,
    fontWeight: '700',
  },
  cashInput: {
    height: 44,
    borderRadius: 12,
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
    borderRadius: 14,
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
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  discShortcutText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Always-visible discount row (W2-1 / W2-4)
  discountRow: {
    padding: Spacing.md,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  discountRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  discountRowLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    flex: 1,
  },
  discountSavedBadge: {
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  discTypeToggle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discTypeToggleText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  discountInput: {
    flex: 1,
    height: 36,
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
    paddingVertical: 15,
    borderRadius: 16,
    ...Shadows.md,
  },
  completeSaleBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.3,
  },

  // W1-3: Sale success toast
  successToast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  successToastLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  successToastText: {
    fontSize: 13,
    fontWeight: '700',
  },
  successToastBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    minHeight: 32,
  },
  successToastBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // Modal header for in-home sale window
  modalTopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
    zIndex: 15,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeaderTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalHeaderTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  modalDoneBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
  },
  modalDoneBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  catalogEmptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl * 1.5,
    minHeight: 380,
  },
  catalogEmptyIconBox: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  catalogEmptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  catalogEmptySub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 340,
    marginBottom: Spacing.xl,
  },
  catalogEmptyBtnRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catalogEmptyPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },
  catalogEmptyPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  catalogEmptySecondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
  },
  catalogEmptySecondaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
