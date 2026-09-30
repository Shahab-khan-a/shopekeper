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
import React, { useMemo, useRef, useState } from 'react';
import {
  Alert,
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

const QUICK_ADD_COLORS = [
  { bgLight: '#EEF2FF', borderLight: '#C7D2FE', textLight: '#4F46E5', bgDark: 'rgba(99, 102, 241, 0.18)', borderDark: 'rgba(99, 102, 241, 0.35)', textDark: '#818CF8' },
  { bgLight: '#ECFDF5', borderLight: '#A7F3D0', textLight: '#059669', bgDark: 'rgba(16, 185, 129, 0.18)', borderDark: 'rgba(16, 185, 129, 0.35)', textDark: '#34D399' },
  { bgLight: '#FFFBEB', borderLight: '#FDE68A', textLight: '#D97706', bgDark: 'rgba(245, 158, 11, 0.18)', borderDark: 'rgba(245, 158, 11, 0.35)', textDark: '#FBBF24' },
  { bgLight: '#FFF1F2', borderLight: '#FECDD3', textLight: '#E11D48', bgDark: 'rgba(244, 63, 94, 0.18)', borderDark: 'rgba(244, 63, 94, 0.35)', textDark: '#FB7185' },
  { bgLight: '#F3E8FF', borderLight: '#E9D5FF', textLight: '#9333EA', bgDark: 'rgba(168, 85, 247, 0.18)', borderDark: 'rgba(168, 85, 247, 0.35)', textDark: '#C084FC' },
  { bgLight: '#F0FDFA', borderLight: '#99F6E4', textLight: '#0D9488', bgDark: 'rgba(20, 184, 166, 0.18)', borderDark: 'rgba(20, 184, 166, 0.35)', textDark: '#2DD4BF' },
  { bgLight: '#FFF7ED', borderLight: '#FED7AA', textLight: '#EA580C', bgDark: 'rgba(249, 115, 22, 0.18)', borderDark: 'rgba(249, 115, 22, 0.35)', textDark: '#FB923C' },
  { bgLight: '#ECFEFF', borderLight: '#A5F3FC', textLight: '#0891B2', bgDark: 'rgba(6, 182, 212, 0.18)', borderDark: 'rgba(6, 182, 212, 0.35)', textDark: '#22D3EE' },
];

const CATEGORY_TAG_COLORS: Record<string, { bgLight: string; borderLight: string; textLight: string; bgDark: string; borderDark: string; textDark: string }> = {
  All: { bgLight: '#EEF2FF', borderLight: '#C7D2FE', textLight: '#4F46E5', bgDark: 'rgba(99, 102, 241, 0.16)', borderDark: 'rgba(99, 102, 241, 0.3)', textDark: '#A5B4FC' },
  Kiryana: { bgLight: '#FEF3C7', borderLight: '#FDE68A', textLight: '#B45309', bgDark: 'rgba(245, 158, 11, 0.16)', borderDark: 'rgba(245, 158, 11, 0.3)', textDark: '#FCD34D' },
  Grocery: { bgLight: '#D1FAE5', borderLight: '#A7F3D0', textLight: '#047857', bgDark: 'rgba(16, 185, 129, 0.16)', borderDark: 'rgba(16, 185, 129, 0.3)', textDark: '#6EE7B7' },
  Beverages: { bgLight: '#CFFAFE', borderLight: '#A5F3FC', textLight: '#0E7490', bgDark: 'rgba(6, 182, 212, 0.16)', borderDark: 'rgba(6, 182, 212, 0.3)', textDark: '#67E8F9' },
  Dairy: { bgLight: '#DBEAFE', borderLight: '#BFDBFE', textLight: '#1D4ED8', bgDark: 'rgba(59, 130, 246, 0.16)', borderDark: 'rgba(59, 130, 246, 0.3)', textDark: '#93C5FD' },
  Snacks: { bgLight: '#FFEDD5', borderLight: '#FED7AA', textLight: '#C2410C', bgDark: 'rgba(249, 115, 22, 0.16)', borderDark: 'rgba(249, 115, 22, 0.3)', textDark: '#FDBA74' },
  Spices: { bgLight: '#FFE4E6', borderLight: '#FECDD3', textLight: '#BE123C', bgDark: 'rgba(244, 63, 94, 0.16)', borderDark: 'rgba(244, 63, 94, 0.3)', textDark: '#FDA4AF' },
  'Personal Care': { bgLight: '#F3E8FF', borderLight: '#E9D5FF', textLight: '#6D28D9', bgDark: 'rgba(168, 85, 247, 0.16)', borderDark: 'rgba(168, 85, 247, 0.3)', textDark: '#D8B4FE' },
  Bakery: { bgLight: '#FEF9C3', borderLight: '#FEF08A', textLight: '#A16207', bgDark: 'rgba(234, 179, 8, 0.16)', borderDark: 'rgba(234, 179, 8, 0.3)', textDark: '#FDE047' },
  Others: { bgLight: '#F3F4F6', borderLight: '#E5E7EB', textLight: '#4B5563', bgDark: 'rgba(107, 114, 128, 0.16)', borderDark: 'rgba(107, 114, 128, 0.3)', textDark: '#D1D5DB' },
};

const CASH_DENOMINATIONS = [100, 500, 1000, 5000];
const DISCOUNT_SHORTCUTS = [10, 20, 50, 100];

export interface SaleScreenProps {
  isModal?: boolean;
  onClose?: () => void;
}

export const SaleScreen: React.FC<SaleScreenProps> = ({ isModal, onClose }) => {
  const { width } = useWindowDimensions();
  const isWideScreen = width >= 860;

  // W3-3: Responsive grid — 2 col narrow, 3 col medium, 4 col wide
  const catalogWidth = isWideScreen ? width * 0.55 : width;
  const gridCols = catalogWidth >= 700 ? 4 : catalogWidth >= 480 ? 3 : 2;
  const gridGap = 8;
  const gridColWidth = (catalogWidth - Spacing.lg * 2 - gridGap * (gridCols - 1)) / gridCols;

  const { products, khata, sales, completeSale, settings, t, language, setActiveReceipt, setIsAddProductOpen } = useShop();
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

  // W2-2: Hold/Park cart state
  const [heldCarts, setHeldCarts] = useState<{ id: string; ts: number; items: CartItem[]; total: number }[]>([]);

  // Load held carts from storage on mount
  React.useEffect(() => {
    AsyncStorage.getItem('@sk_held_carts').then((raw) => {
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        const now = Date.now();
        const valid = parsed.filter((h: any) => now - h.ts < 4 * 60 * 60 * 1000); // 4hr expiry
        setHeldCarts(valid);
        if (valid.length !== parsed.length) {
          AsyncStorage.setItem('@sk_held_carts', JSON.stringify(valid)).catch(() => { });
        }
      } catch { }
    }).catch(() => { });
  }, []);

  const holdCart = async () => {
    if (cart.length === 0) return;
    const newHold = { id: Date.now().toString(), ts: Date.now(), items: cart, total: grandTotal };
    const updated = [...heldCarts, newHold].slice(-3); // max 3 holds
    setHeldCarts(updated);
    await AsyncStorage.setItem('@sk_held_carts', JSON.stringify(updated)).catch(() => { });
    clearCart();
  };

  const restoreHold = async (holdId: string) => {
    const hold = heldCarts.find((h) => h.id === holdId);
    if (!hold) return;
    if (cart.length > 0) {
      const msg = language === 'ur' ? 'موجودہ بل ہٹ جائے گا۔ جاری رکھیں؟' : 'Current bill will be replaced. Proceed?';
      const confirmed = Platform.OS === 'web'
        ? window.confirm(msg)
        : await new Promise<boolean>((resolve) => {
          Alert.alert(language === 'ur' ? 'بل بحال کریں' : 'Restore Held Order', msg, [
            { text: t('cancel'), onPress: () => resolve(false), style: 'cancel' },
            { text: language === 'ur' ? 'جاری رکھیں' : 'Proceed', onPress: () => resolve(true) },
          ]);
        });
      if (!confirmed) return;
    }
    setCart(hold.items);
    const remaining = heldCarts.filter((h) => h.id !== holdId);
    setHeldCarts(remaining);
    await AsyncStorage.setItem('@sk_held_carts', JSON.stringify(remaining)).catch(() => { });
  };

  // W1-3: Success toast — stores last completed sale for explicit receipt view
  const [lastCompletedSale, setLastCompletedSale] = useState<any>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // W2-3: Top 8 products by sales frequency for the Favorites row
  const topProducts = useMemo(() => {
    const freq: Record<string, number> = {};
    sales.forEach((sale) => {
      sale.items?.forEach((item: any) => {
        const id = item.product?.id || item.productId;
        if (id) freq[id] = (freq[id] || 0) + item.quantity;
      });
    });
    const sorted = [...products]
      .filter((p) => p.stock > 0)
      .sort((a, b) => (freq[b.id] || 0) - (freq[a.id] || 0));
    // If no sales history yet, show top-stocked items
    if (Object.keys(freq).length === 0) {
      return [...products].filter((p) => p.stock > 0).slice(0, 8);
    }
    return sorted.slice(0, 8);
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
        if (Platform.OS === 'web') {
          window.alert(result.error || 'Failed to complete sale');
        } else {
          Alert.alert(t('warningAlert'), result.error || 'Failed to complete sale');
        }
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
      if (Platform.OS === 'web') {
        window.alert(e.message || 'Failed to complete sale');
      } else {
        Alert.alert(t('warningAlert'), e.message || 'Failed to complete sale');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // ---------------- Render Checkout Content ----------------
  const renderCheckoutContent = () => (
    <View style={styles.checkoutInner}>
      {/* Mobile Drawer Handle */}
      {!isWideScreen && (
        <View style={[styles.drawerHandle, { backgroundColor: theme.border }]} />
      )}

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
                if (Platform.OS === 'web') {
                  if (window.confirm(t('clearCartConfirm'))) clearCart();
                } else {
                  Alert.alert(
                    t('clearCart'),
                    t('clearCartConfirm'),
                    [
                      { text: t('cancel'), style: 'cancel' },
                      { text: t('clearAll'), style: 'destructive', onPress: clearCart },
                    ]
                  );
                }
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

          {/* Hold / Park current cart */}
          {cart.length > 0 && heldCarts.length < 3 && (
            <Pressable
              onPress={holdCart}
              accessibilityLabel="Hold cart for later"
              accessibilityRole="button"
              style={[styles.holdBtn, { backgroundColor: theme.warningLight, borderColor: theme.warning }]}>
              <Ionicons name="pause-circle-outline" size={14} color={theme.warning} />
              <Text style={[styles.holdBtnText, { color: theme.warning }]}>
                {language === 'ur' ? 'روکیں' : 'Hold'}
              </Text>
            </Pressable>
          )}

          {!isWideScreen && (
            <Pressable
              onPress={() => setIsCheckoutDrawerOpen(false)}
              style={[styles.closeDrawerBtn, { backgroundColor: theme.surfaceSubtle }]}>
              <Ionicons name="close" size={20} color={theme.text} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Held Orders Restore Strip */}
      {heldCarts.length > 0 && (
        <View style={[styles.heldOrdersBar, { backgroundColor: theme.warningLight, borderBottomColor: theme.warning }]}>
          <Ionicons name="pause-circle" size={14} color={theme.warning} />
          <Text style={[styles.heldOrdersLabel, { color: theme.warning }]}>
            {language === 'ur' ? 'رکے ہوئے آرڈر:' : 'Held:'} {heldCarts.length}
          </Text>
          {heldCarts.map((hold) => (
            <Pressable
              key={hold.id}
              onPress={() => restoreHold(hold.id)}
              style={[styles.heldOrderChip, { backgroundColor: theme.warning }]}>
              <Text style={styles.heldOrderChipText}>
                {settings.currencySymbol}{hold.total} ({hold.items.length})
              </Text>
            </Pressable>
          ))}
        </View>
      )}

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
              onPress={() => setShowOptionalDetails(!showOptionalDetails)}
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
                  placeholder="WhatsApp (0300...)"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="phone-pad"
                  value={customerPhone}
                  onChangeText={setCustomerPhone}
                />
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bill Total & Primary Action Button */}
      <View style={[styles.checkoutFooter, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>

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
          {/* Top Control Bar: Search + Barcode + Quick Item + View Toggle */}
          <View style={styles.topControlBar}>
            {/* Search Box & Inline Barcode Scanner */}
            <View style={styles.searchFlex}>
              <View style={styles.searchInlineRow}>
                <View style={{ flex: 1 }}>
                  <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder={language === 'ur' ? 'نام یا بارکوڈ سے تلاش کریں...' : 'Search name or barcode...'}
                    height={46}
                  />
                </View>

                {/* Inline Barcode Scanner Button */}
                <Pressable
                  onPress={() => setIsBarcodeOpen(true)}
                  style={({ pressed }) => [
                    styles.searchBarcodeBtn,
                    {
                      backgroundColor: settings.darkMode ? 'rgba(99, 102, 241, 0.16)' : '#EEF2FF',
                      borderColor: settings.darkMode ? 'rgba(99, 102, 241, 0.35)' : '#C7D2FE',
                    },
                    pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
                  ]}>
                  <Ionicons name="barcode-outline" size={22} color={theme.primary} />
                </Pressable>
              </View>
            </View>

            {/* Action Buttons Row */}
            <View style={styles.topBarActions}>
              {/* Discard cart — visible when cart has items */}
              {cart.length > 0 && (
                <Pressable
                  onPress={() => {
                    if (Platform.OS === 'web') {
                      if (window.confirm(t('clearCartConfirm'))) clearCart();
                    } else {
                      Alert.alert(
                        language === 'ur' ? 'بل خارج کریں' : 'Discard Cart',
                        language === 'ur'
                          ? `${totalItemsCount} آئٹم ہیں، کیا آپ بل خارج کرنا چاہتے ہیں؟`
                          : `Discard ${totalItemsCount} item${totalItemsCount !== 1 ? 's' : ''} from the current bill?`,
                        [
                          { text: language === 'ur' ? 'منسوخ' : 'Cancel', style: 'cancel' },
                          {
                            text: language === 'ur' ? 'خارج کریں' : 'Discard',
                            style: 'destructive',
                            onPress: clearCart,
                          },
                        ]
                      );
                    }
                  }}
                  style={({ pressed }) => [
                    styles.discardCartBtn,
                    {
                      backgroundColor: settings.darkMode ? 'rgba(239,68,68,0.15)' : '#FEF2F2',
                      borderColor: settings.darkMode ? 'rgba(239,68,68,0.4)' : '#FECACA',
                    },
                    pressed && { opacity: 0.75, transform: [{ scale: 0.96 }] },
                  ]}>
                  <Ionicons name="trash-outline" size={17} color={theme.danger} />
                  <Text style={[styles.discardCartBtnText, { color: theme.danger }]}>
                    {totalItemsCount}
                  </Text>
                </Pressable>
              )}

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

          {/* ⚡ Favorites / Quick-Add Row — Top 8 Most-Sold Products */}
          {topProducts.length > 0 && !searchQuery && (
            <View style={styles.favRowWrap}>
              <View style={styles.favRowHeader}>
                <Ionicons name="flash" size={12} color={theme.accent} />
                <Text style={[styles.favRowTitle, { color: theme.textSecondary }]}>
                  {language === 'ur' ? 'اکثر بکنے والے' : 'Quick Add'}
                </Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.favRowContent}>
                {topProducts.map((product, idx) => {
                  const isOut = product.stock <= 0;
                  const inCart = cart.find((it) => it.product.id === product.id);
                  const colorScheme = QUICK_ADD_COLORS[idx % QUICK_ADD_COLORS.length];
                  const chipBg = inCart
                    ? theme.primaryLight
                    : settings.darkMode
                      ? colorScheme.bgDark
                      : colorScheme.bgLight;
                  const chipBorder = inCart
                    ? theme.primary
                    : settings.darkMode
                      ? colorScheme.borderDark
                      : colorScheme.borderLight;
                  const chipText = inCart
                    ? theme.primary
                    : settings.darkMode
                      ? colorScheme.textDark
                      : colorScheme.textLight;

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
                          backgroundColor: chipBg,
                          borderColor: chipBorder,
                          opacity: isOut ? 0.4 : 1,
                        },
                        pressed && !isOut && { transform: [{ scale: 0.95 }] },
                      ]}>
                      <Text style={[styles.favChipName, { color: chipText }]} numberOfLines={1}>
                        {language === 'ur' && product.nameUrdu ? product.nameUrdu : product.name}
                      </Text>
                      <Text style={[styles.favChipPrice, { color: chipText, opacity: inCart ? 1 : 0.8 }]}>
                        {settings.currencySymbol}{formatCompactPrice(product.price)}
                      </Text>
                      {inCart && (
                        <View style={[styles.favChipBadge, { backgroundColor: theme.primary }]}>
                          <Text style={styles.favChipBadgeText}>{inCart.quantity}</Text>
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Category Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryScrollContent}>
            {CATEGORIES.map((cat) => {
              const colorInfo = CATEGORY_TAG_COLORS[cat] || CATEGORY_TAG_COLORS.Others;
              const inactiveBg = settings.darkMode ? colorInfo.bgDark : colorInfo.bgLight;
              const inactiveBorder = settings.darkMode ? colorInfo.borderDark : colorInfo.borderLight;
              const inactiveColor = settings.darkMode ? colorInfo.textDark : colorInfo.textLight;

              return (
                <FilterChip
                  key={cat}
                  label={cat === 'All' ? t('allCategories') : cat}
                  isActive={selectedCategory === cat}
                  onPress={() => setSelectedCategory(cat)}
                  activeBg={theme.primary}
                  inactiveBg={inactiveBg}
                  inactiveBorder={inactiveBorder}
                  inactiveColor={inactiveColor}
                />
              );
            })}
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
                  ? 'سیل کرنے کے لیے پہلے پروڈکٹ شامل کریں، یا فوری آئٹم (Quick Item) سے بغیر کیٹلاگ کے بل بنائیں۔'
                  : 'Add products to build your catalog, or tap Quick Item to sell unlisted loose items immediately.'}
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

                <Pressable
                  onPress={() => setIsQuickItemOpen(true)}
                  style={({ pressed }) => [
                    styles.catalogEmptySecondaryBtn,
                    { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
                    pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
                  ]}>
                  <Ionicons name="flash" size={16} color={theme.accent} />
                  <Text style={[styles.catalogEmptySecondaryBtnText, { color: theme.text }]}>
                    {t('quickItem')}
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
                          <View style={[styles.inlineStepper, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
                            <Pressable
                              onPress={() => updateQuantity(product.id, -1)}
                              style={({ pressed }) => [styles.inlineStepBtn, pressed && { opacity: 0.7 }]}
                              hitSlop={{ top: 8, bottom: 8, left: 8, right: 4 }}>
                              <Ionicons name="remove" size={17} color={theme.primaryDark} />
                            </Pressable>
                            <Text style={[styles.inlineStepQty, { color: theme.primaryDark, fontWeight: '800' }]}>
                              {inCartItem.quantity}
                            </Text>
                            <Pressable
                              onPress={() => addToCart(product, 1)}
                              style={({ pressed }) => [styles.inlineStepBtn, pressed && { opacity: 0.7 }]}
                              hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}>
                              <Ionicons name="add" size={17} color={theme.primaryDark} />
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
                              ]}>
                              {t('addItemToBill')}
                            </Text>
                          </Pressable>
                        )}
                      </View>
                    </Pressable>
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
                        width: gridColWidth,
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
                      <View style={[styles.gridThumbFallback, { backgroundColor: theme.surfaceSubtle }]}>
                        <ProductImage
                          uri={product.image || product.imageUri}
                          style={styles.gridThumb}
                          resizeMode="cover"
                          fallbackColor={theme.textMuted}
                          fallbackSize={24}
                        />
                      </View>
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
                      <Text
                        style={[styles.gridPrice, { color: theme.primary }]}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={0.75}>
                        {settings.currencySymbol}{formatCompactPrice(product.price)}
                      </Text>

                      {/* Stepper on card if in cart (attached flush at bottom right corner like design spec) */}
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
                            <Ionicons name="remove" size={18} color={theme.text} />
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
                            <Ionicons name="add" size={18} color={theme.text} />
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
                            size={13}
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
          )}

          {/* ================= Mobile Sticky Floating Cart Bar ================= */}
          {!isWideScreen && cart.length > 0 && (
            <View style={styles.floatingBarContainer}>
              {/* Quick Discard — tap to clear cart without opening drawer */}
              <Pressable
                onPress={() => {
                  if (Platform.OS === 'web') {
                    if (window.confirm(t('clearCartConfirm'))) clearCart();
                  } else {
                    Alert.alert(
                      language === 'ur' ? 'بل خارج کریں' : 'Discard Cart',
                      language === 'ur'
                        ? `${totalItemsCount} آئٹم ہیں، کیا آپ بل خارج کرنا چاہتے ہیں؟`
                        : `Discard ${totalItemsCount} item${totalItemsCount !== 1 ? 's' : ''} from the current bill?`,
                      [
                        { text: language === 'ur' ? 'منسوخ' : 'Cancel', style: 'cancel' },
                        {
                          text: language === 'ur' ? 'خارج کریں' : 'Discard',
                          style: 'destructive',
                          onPress: clearCart,
                        },
                      ]
                    );
                  }
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
  searchInlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchBarcodeBtn: {
    width: 46,
    height: 46,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
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

  // W2-3: Favorites / Quick-Add row
  favRowWrap: {
    marginBottom: 6,
  },
  favRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  favRowTitle: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  favRowContent: {
    gap: 6,
    paddingRight: 4,
  },
  favChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    position: 'relative',
  },
  favChipName: {
    fontSize: 12,
    fontWeight: '700',
    maxWidth: 90,
  },
  favChipPrice: {
    fontSize: 11,
    fontWeight: '600',
  },
  favChipBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
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
    gap: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  gridCard: {
    // width is set dynamically inline (W3-3 responsive grid)
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    justifyContent: 'space-between',
    minHeight: 125,
    position: 'relative',
    overflow: 'hidden',
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
    paddingHorizontal: 8,
    paddingVertical: 3.5,
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
    borderTopLeftRadius: 14,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: BorderRadius.lg,
    overflow: 'hidden',
    height: 38,
    marginRight: -Spacing.md,
    marginBottom: -Spacing.md,
  },
  cardStepBtnMinus: {
    width: 34,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardStepQtyBox: {
    width: 36,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  cardStepQtyText: {
    fontSize: 15,
    fontWeight: '800',
  },
  cardStepBtnPlus: {
    width: 34,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // List View Styles
  catalogList: {
    gap: 8,
    paddingBottom: Spacing.xl,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    minHeight: 72,
    gap: 10,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
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
  listThumbFallback: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listRowContent: {
    flex: 1,
    gap: 5,
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
    gap: 5,
    flexWrap: 'wrap',
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
  listStockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
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
    gap: 6,
  },
  listRowPrice: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  inlineStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minHeight: 34,
    gap: 6,
  },
  inlineStepBtn: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineStepQty: {
    fontSize: 14,
    fontWeight: '800',
    minWidth: 22,
    textAlign: 'center',
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

  // Discard cart button (top bar, desktop)
  discardCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 46,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
  },
  discardCartBtnText: {
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
  // W2-2: Hold cart styles
  holdBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  holdBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  heldOrdersBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderBottomWidth: 1,
    flexWrap: 'wrap',
  },
  heldOrdersLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  heldOrderChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  heldOrderChipText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
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
    paddingHorizontal: Spacing.md,
    overflow: 'hidden',
  },
  cartItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
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
  denomRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  denomBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
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
