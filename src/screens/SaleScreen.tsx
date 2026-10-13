import { BarcodeModal } from '@/components/BarcodeModal';
import { HeldCart, HeldCartsModal } from '@/components/HeldCartsModal';
import { LooseWeightModal } from '@/components/LooseWeightModal';
import { QuickItemModal } from '@/components/QuickItemModal';
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

  const {
    products,
    khata,
    sales,
    completeSale,
    settings,
    t,
    language,
    setActiveReceipt,
    setIsAddProductOpen,
    showAlert,
    saleViewMode,
    setSaleViewMode,
  } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<string>('');
  const [discountType, setDiscountType] = useState<'fixed' | 'percent'>('fixed');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [tenderedCash, setTenderedCash] = useState<string>('');
  const [onlineProvider, setOnlineProvider] = useState<'easypaisa' | 'jazzcash' | 'raast' | 'bank' | 'other'>('easypaisa');
  const [onlineAccount, setOnlineAccount] = useState<string>('');
  const [onlineTxRef, setOnlineTxRef] = useState<string>('');
  const [selectedKhataCustomer, setSelectedKhataCustomer] = useState<CustomerKhata | null>(null);
  const [customerSearchQuery, setCustomerSearchQuery] = useState<string>('');
  const [isAddingNewCustomer, setIsAddingNewCustomer] = useState<boolean>(false);

  // Search, Filters & View Mode
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const viewMode = saleViewMode;

  const toggleViewMode = () => {
    setSaleViewMode(saleViewMode === 'grid' ? 'list' : 'grid');
  };

  // Modals & Drawers
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  const [isQuickItemOpen, setIsQuickItemOpen] = useState(false);
  const [isCheckoutDrawerOpen, setIsCheckoutDrawerOpen] = useState(false);
  const [showOptionalDetails, setShowOptionalDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const checkoutScrollRef = useRef<ScrollView>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Rush-Hour Counter: Held / Parked Carts
  const HELD_CARTS_STORAGE_KEY = '@shopkeeper_held_carts';
  const [heldCarts, setHeldCarts] = useState<HeldCart[]>([]);
  const [isHeldCartsModalOpen, setIsHeldCartsModalOpen] = useState(false);

  // Rush-Hour Counter: Loose Goods Weight Modal
  const [looseModalProduct, setLooseModalProduct] = useState<Product | null>(null);
  const [looseModalInitialQty, setLooseModalInitialQty] = useState<number>(1);
  const [isLooseModalOpen, setIsLooseModalOpen] = useState(false);

  // Pure localized product name helper (strips Urdu parentheticals in English mode)
  const getProductName = (prod: { name: string; nameUrdu?: string }) => {
    if (language === 'ur' && prod.nameUrdu) return prod.nameUrdu;
    return prod.name.replace(/\s*\([\u0600-\u06FF\s/]+\)$/, '').trim();
  };

  useEffect(() => {
    AsyncStorage.getItem(HELD_CARTS_STORAGE_KEY)
      .then((saved) => {
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setHeldCarts(parsed);
          }
        }
      })
      .catch(console.error);
  }, []);

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
  const totalItemsCount = useMemo(
    () => cart.reduce((sum, item) => sum + (Number.isInteger(item.quantity) ? item.quantity : 1), 0),
    [cart]
  );
  const parsedDiscount = parseFloat(discount) || 0;
  const discountAmount =
    discountType === 'percent'
      ? Math.round((subtotal * parsedDiscount) / 100)
      : parsedDiscount;
  const grandTotal = Math.max(0, subtotal - discountAmount);

  // Cash change calculation
  const parsedTendered = parseFloat(tenderedCash) || 0;
  const changeToReturn = parsedTendered > grandTotal ? parsedTendered - grandTotal : 0;

  // Smart 1-Tap Cash Denominations and Exact Tender Options
  const smartTenderOptions = useMemo(() => {
    if (grandTotal <= 0) return [];
    const opts: { label: string; subLabel?: string; amount: number; isExact?: boolean }[] = [
      {
        label: language === 'ur' ? 'پوری رقم' : 'Exact Bill',
        subLabel: `${settings.currencySymbol} ${grandTotal.toLocaleString()}`,
        amount: grandTotal,
        isExact: true,
      },
    ];

    const standardNotes = [500, 1000, 5000];
    standardNotes.forEach((note) => {
      if (note > grandTotal) {
        opts.push({
          label: language === 'ur' ? `${settings.currencySymbol}${note.toLocaleString()} نوٹ` : `${settings.currencySymbol}${note.toLocaleString()} Note`,
          subLabel:
            language === 'ur'
              ? `باقی: ${settings.currencySymbol}${(note - grandTotal).toLocaleString()}`
              : `Change: ${settings.currencySymbol}${(note - grandTotal).toLocaleString()}`,
          amount: note,
        });
      }
    });

    if (grandTotal > 500 && grandTotal < 1000) {
      const nextRound = Math.ceil(grandTotal / 100) * 100;
      if (nextRound > grandTotal && !opts.some((o) => o.amount === nextRound)) {
        opts.push({
          label: `${settings.currencySymbol}${nextRound.toLocaleString()}`,
          subLabel:
            language === 'ur'
              ? `باقی: ${settings.currencySymbol}${(nextRound - grandTotal).toLocaleString()}`
              : `Change: ${settings.currencySymbol}${(nextRound - grandTotal).toLocaleString()}`,
          amount: nextRound,
        });
      }
    }

    if (grandTotal > 1000 && grandTotal < 5000) {
      const nextRound = Math.ceil(grandTotal / 500) * 500;
      if (nextRound > grandTotal && !opts.some((o) => o.amount === nextRound)) {
        opts.push({
          label: `${settings.currencySymbol}${nextRound.toLocaleString()}`,
          subLabel:
            language === 'ur'
              ? `باقی: ${settings.currencySymbol}${(nextRound - grandTotal).toLocaleString()}`
              : `Change: ${settings.currencySymbol}${(nextRound - grandTotal).toLocaleString()}`,
          amount: nextRound,
        });
      }
    }

    const fallbackNotes = [100, 500, 1000, 5000];
    for (const fb of fallbackNotes) {
      if (opts.length >= 4) break;
      if (!opts.some((o) => o.amount === fb)) {
        opts.push({
          label: `${settings.currencySymbol}${fb.toLocaleString()}`,
          subLabel:
            fb > grandTotal
              ? language === 'ur'
                ? `باقی: ${settings.currencySymbol}${(fb - grandTotal).toLocaleString()}`
                : `Change: ${settings.currencySymbol}${(fb - grandTotal).toLocaleString()}`
              : undefined,
          amount: fb,
        });
      }
    }

    return opts.slice(0, 4);
  }, [grandTotal, settings.currencySymbol, language]);

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
    setOnlineAccount('');
    setOnlineTxRef('');
    setOnlineProvider('easypaisa');
    setSelectedKhataCustomer(null);
    setCustomerSearchQuery('');
    setIsAddingNewCustomer(false);
    setIsCheckoutDrawerOpen(false);
  };

  // Rush-Hour Counter: Loose Goods Weight Converter
  const openLooseWeightModal = (product: Product, currentQty: number = 1) => {
    setLooseModalProduct(product);
    setLooseModalInitialQty(currentQty);
    setIsLooseModalOpen(true);
  };

  const handleApplyLooseWeight = (quantity: number, customTotal?: number) => {
    if (!looseModalProduct) return;
    const p = looseModalProduct;
    const existingIndex = cart.findIndex((item) => item.product.id === p.id);
    const computedTotal = customTotal ?? Math.round(quantity * p.price);

    if (existingIndex >= 0) {
      const updated = [...cart];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity,
        total: computedTotal,
      };
      setCart(updated);
    } else {
      setCart([
        ...cart,
        {
          product: p,
          quantity,
          unitPrice: p.price,
          total: computedTotal,
        },
      ]);
    }
  };

  // Rush-Hour Counter: Hold & Resume Cart Handlers
  const handleHoldCart = () => {
    if (cart.length === 0) return;

    showAlert({
      type: 'confirm',
      title: language === 'ur' ? 'بل ہولڈ کریں؟' : 'Hold Current Bill?',
      message: language === 'ur'
        ? `یہ بل عارضی محفوظ ہو جائے گا تاکہ آپ اگلے گاہک کو سروس دے سکیں۔ بعد میں آپ نیچے امبر بینر سے جب چاہیں واپس لا سکتے ہیں۔`
        : `Park this bill so you can attend to the next customer. You can restore it anytime from the amber banner at the bottom.`,
      buttons: [
        {
          text: language === 'ur' ? 'ہاں، ہولڈ کریں' : 'Hold Bill',
          onPress: () => {
            const newHeldCart: HeldCart = {
              id: 'held_' + Date.now(),
              heldAt: Date.now(),
              items: [...cart],
              customerName: customerName.trim() || undefined,
              customerPhone: customerPhone.trim() || undefined,
              discount,
              discountType,
              total: grandTotal,
              totalItemsCount,
            };

            const nextHeld = [newHeldCart, ...heldCarts];
            setHeldCarts(nextHeld);
            AsyncStorage.setItem(HELD_CARTS_STORAGE_KEY, JSON.stringify(nextHeld)).catch(console.error);

            clearCart();
            setIsCheckoutDrawerOpen(false);

            showAlert({
              type: 'success',
              title: language === 'ur' ? 'بل محفوظ کر دیا گیا' : 'Bill Held',
              message: language === 'ur'
                ? `${newHeldCart.totalItemsCount} اشیاء عارضی محفوظ ہو گئیں۔ اب اگلے گاہک کی سیل بنائیں۔`
                : `Bill with ${newHeldCart.totalItemsCount} item(s) held. Tap the waiting banner below to resume anytime.`,
            });
          },
        },
        { text: t('cancel'), style: 'cancel' },
      ],
    });
  };

  const handleResumeCart = (heldCart: HeldCart) => {
    if (cart.length > 0) {
      showAlert({
        type: 'warning',
        title: language === 'ur' ? 'موجودہ بل تبدیل کریں؟' : 'Active Cart Not Empty',
        message: language === 'ur'
          ? 'کیا آپ موجودہ بل کو پارک کر کے یہ بل بحال کرنا چاہتے ہیں؟'
          : 'Do you want to hold the current bill and resume this one?',
        buttons: [
          {
            text: language === 'ur' ? 'موجودہ پارک کریں اور بحال کریں' : 'Hold Current & Resume',
            style: 'default',
            onPress: () => {
              const currentHeld: HeldCart = {
                id: 'held_' + Date.now(),
                heldAt: Date.now(),
                items: [...cart],
                customerName: customerName.trim() || undefined,
                customerPhone: customerPhone.trim() || undefined,
                discount,
                discountType,
                total: grandTotal,
                totalItemsCount,
              };
              const updatedHeld = [currentHeld, ...heldCarts.filter((c) => c.id !== heldCart.id)];
              setHeldCarts(updatedHeld);
              AsyncStorage.setItem(HELD_CARTS_STORAGE_KEY, JSON.stringify(updatedHeld)).catch(console.error);

              setCart(heldCart.items);
              setCustomerName(heldCart.customerName || '');
              setCustomerPhone(heldCart.customerPhone || '');
              setDiscount(heldCart.discount || '');
              setDiscountType(heldCart.discountType || 'fixed');
              setIsHeldCartsModalOpen(false);
              if (!isWideScreen) setIsCheckoutDrawerOpen(true);
            },
          },
          {
            text: language === 'ur' ? 'موجودہ ختم کریں اور بحال کریں' : 'Replace Current',
            style: 'destructive',
            onPress: () => {
              const updatedHeld = heldCarts.filter((c) => c.id !== heldCart.id);
              setHeldCarts(updatedHeld);
              AsyncStorage.setItem(HELD_CARTS_STORAGE_KEY, JSON.stringify(updatedHeld)).catch(console.error);

              setCart(heldCart.items);
              setCustomerName(heldCart.customerName || '');
              setCustomerPhone(heldCart.customerPhone || '');
              setDiscount(heldCart.discount || '');
              setDiscountType(heldCart.discountType || 'fixed');
              setIsHeldCartsModalOpen(false);
              if (!isWideScreen) setIsCheckoutDrawerOpen(true);
            },
          },
          { text: t('cancel'), style: 'cancel' },
        ],
      });
      return;
    }

    const updatedHeld = heldCarts.filter((c) => c.id !== heldCart.id);
    setHeldCarts(updatedHeld);
    AsyncStorage.setItem(HELD_CARTS_STORAGE_KEY, JSON.stringify(updatedHeld)).catch(console.error);

    setCart(heldCart.items);
    setCustomerName(heldCart.customerName || '');
    setCustomerPhone(heldCart.customerPhone || '');
    setDiscount(heldCart.discount || '');
    setDiscountType(heldCart.discountType || 'fixed');
    setIsHeldCartsModalOpen(false);
    if (!isWideScreen) setIsCheckoutDrawerOpen(true);
  };

  const handleDeleteHeldCart = (cartId: string) => {
    const updated = heldCarts.filter((c) => c.id !== cartId);
    setHeldCarts(updated);
    AsyncStorage.setItem(HELD_CARTS_STORAGE_KEY, JSON.stringify(updated)).catch(console.error);
  };

  const handleClearAllHeldCarts = () => {
    setHeldCarts([]);
    AsyncStorage.removeItem(HELD_CARTS_STORAGE_KEY).catch(console.error);
    setIsHeldCartsModalOpen(false);
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
      costPrice: undefined,
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

  // 1-Tap Khata customer selection & helpers
  const handleSelectKhataCustomer = (customer: CustomerKhata) => {
    setSelectedKhataCustomer(customer);
    setCustomerName(customer.name);
    setCustomerPhone(customer.phone);
    setCustomerSearchQuery('');
    setIsAddingNewCustomer(false);
  };

  const handleStartNewCustomer = (initialName: string = '') => {
    setSelectedKhataCustomer(null);
    setCustomerName(initialName);
    setCustomerPhone('');
    setCustomerSearchQuery('');
    setIsAddingNewCustomer(true);
  };

  const handleClearSelectedCustomer = () => {
    setSelectedKhataCustomer(null);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerSearchQuery('');
    setIsAddingNewCustomer(false);
  };

  const matchingKhataCustomers = useMemo(() => {
    const q = customerSearchQuery.trim().toLowerCase();
    if (!q) return [];
    return khata
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.nameUrdu && c.nameUrdu.toLowerCase().includes(q)) ||
          (c.phone && c.phone.includes(q))
      )
      .slice(0, 5);
  }, [khata, customerSearchQuery]);

  const recentKhataCustomers = useMemo(() => {
    return khata.slice(0, 4);
  }, [khata]);

  // Payment method selection & exact cash auto-initialization
  const handleSelectPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
    if (method === 'cash' && (!tenderedCash || tenderedCash === '0')) {
      setTenderedCash(grandTotal.toString());
    }
  };

  const openCheckoutDrawer = () => {
    if (paymentMethod === 'cash' && (!tenderedCash || tenderedCash === '0')) {
      setTenderedCash(grandTotal.toString());
    }
    setIsCheckoutDrawerOpen(true);
  };

  // Keep exact cash in sync if grandTotal changes and user hasn't manually customized amount
  const prevGrandTotalRef = useRef(grandTotal);
  useEffect(() => {
    if (paymentMethod === 'cash' && grandTotal > 0) {
      if (tenderedCash === prevGrandTotalRef.current.toString()) {
        setTenderedCash(grandTotal.toString());
      }
    }
    prevGrandTotalRef.current = grandTotal;
  }, [grandTotal, paymentMethod, tenderedCash]);

  // Auto-initialize cash on first item added to empty cart
  const prevCartLenRef = useRef(cart.length);
  useEffect(() => {
    if (cart.length > 0 && prevCartLenRef.current === 0 && paymentMethod === 'cash') {
      if (!tenderedCash || tenderedCash === '0') {
        setTenderedCash(grandTotal.toString());
      }
    }
    prevCartLenRef.current = cart.length;
  }, [cart.length, paymentMethod, grandTotal]);

  // Dynamic Validation State for Checkout Modal CTA Button
  const getCheckoutValidationState = () => {
    if (cart.length === 0) {
      return {
        isValid: false,
        reason: 'empty_cart',
        btnLabel: language === 'ur' ? 'بل خالی ہے' : 'Cart is Empty',
        btnColor: theme.border,
        textColor: theme.textMuted,
        icon: 'cart-outline',
      };
    }

    if (paymentMethod === 'cash') {
      if (!tenderedCash.trim() || parsedTendered <= 0) {
        return {
          isValid: false,
          reason: 'cash_empty',
          btnLabel: language === 'ur' ? 'وصول شدہ رقم درج کریں' : 'Enter Cash Received',
          btnColor: settings.darkMode ? 'rgba(239, 68, 68, 0.25)' : '#FEE2E2',
          textColor: settings.darkMode ? '#FCA5A5' : '#DC2626',
          icon: 'cash-outline',
        };
      }
      if (parsedTendered < grandTotal) {
        const shortfall = grandTotal - parsedTendered;
        return {
          isValid: false,
          reason: 'cash_short',
          btnLabel:
            language === 'ur'
              ? `رقم کم ہے: ${settings.currencySymbol}${shortfall} باقی`
              : `Short by ${settings.currencySymbol}${shortfall}`,
          btnColor: settings.darkMode ? 'rgba(239, 68, 68, 0.28)' : '#FEE2E2',
          textColor: settings.darkMode ? '#F87171' : '#B91C1C',
          icon: 'alert-circle',
        };
      }
      if (parsedTendered > grandTotal) {
        return {
          isValid: true,
          reason: 'cash_change',
          btnLabel:
            language === 'ur'
              ? `بل مکمل کریں (بقایا: ${settings.currencySymbol}${changeToReturn})`
              : `Complete Sale • Change: ${settings.currencySymbol}${changeToReturn}`,
          btnColor: theme.primary,
          textColor: '#FFFFFF',
          icon: 'checkmark-circle',
        };
      }
      return {
        isValid: true,
        reason: 'cash_exact',
        btnLabel:
          language === 'ur'
            ? `بل مکمل کریں (${settings.currencySymbol}${grandTotal})`
            : `Complete Sale • ${settings.currencySymbol}${grandTotal}`,
        btnColor: theme.primary,
        textColor: '#FFFFFF',
        icon: 'checkmark-circle',
      };
    }

    if (paymentMethod === 'online') {
      const hasOnlineRef = onlineAccount.trim().length > 0 || onlineTxRef.trim().length > 0;
      if (!hasOnlineRef) {
        return {
          isValid: false,
          reason: 'online_missing_account',
          btnLabel:
            language === 'ur'
              ? 'اکاؤنٹ یا موبائل نمبر درج کریں'
              : 'Enter Sender Account / Mobile',
          btnColor: settings.darkMode ? 'rgba(245, 158, 11, 0.25)' : '#FEF3C7',
          textColor: settings.darkMode ? '#FDE68A' : '#B45309',
          icon: 'phone-portrait-outline',
        };
      }
      const providerLabels: Record<string, string> = {
        easypaisa: 'EasyPaisa',
        jazzcash: 'JazzCash',
        raast: 'Raast',
        bank: 'Bank Transfer',
        other: 'Online',
      };
      const pName = providerLabels[onlineProvider] || 'Online';
      return {
        isValid: true,
        reason: 'online_ready',
        btnLabel:
          language === 'ur'
            ? `${pName} مکمل کریں (${settings.currencySymbol}${grandTotal})`
            : `Complete ${pName} • ${settings.currencySymbol}${grandTotal}`,
        btnColor: theme.primary,
        textColor: '#FFFFFF',
        icon: 'checkmark-circle',
      };
    }

    if (paymentMethod === 'udhaar') {
      const hasCustomer =
        !!selectedKhataCustomer ||
        customerName.trim().length > 0 ||
        customerPhone.trim().length > 0;
      if (!hasCustomer) {
        return {
          isValid: false,
          reason: 'udhaar_missing_customer',
          btnLabel:
            language === 'ur'
              ? 'ادھار کے لیے گاہک منتخب کریں'
              : 'Select Customer for Credit',
          btnColor: settings.darkMode ? 'rgba(239, 68, 68, 0.25)' : '#FEE2E2',
          textColor: settings.darkMode ? '#FCA5A5' : '#DC2626',
          icon: 'person-outline',
        };
      }
      const cName = selectedKhataCustomer
        ? selectedKhataCustomer.name
        : customerName.trim() || 'Customer';
      return {
        isValid: true,
        reason: 'udhaar_ready',
        btnLabel:
          language === 'ur'
            ? `ادھار درج کریں (${cName})`
            : `Record Credit • ${cName}`,
        btnColor: theme.primary,
        textColor: '#FFFFFF',
        icon: 'book-outline',
      };
    }

    return {
      isValid: true,
      reason: 'default',
      btnLabel: t('generateBill'),
      btnColor: theme.primary,
      textColor: '#FFFFFF',
      icon: 'checkmark-circle',
    };
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

    if (paymentMethod === 'udhaar' && !selectedKhataCustomer && !customerName.trim() && !customerPhone.trim()) {
      const errMsg =
        language === 'ur'
          ? 'ادھار سیل کے لیے گاہک کا انتخاب کریں یا نام و فون درج کریں۔'
          : 'Please select an existing customer or provide name/phone for Credit sales.';
      showAlert({
        type: 'warning',
        title: t('warningAlert'),
        message: errMsg,
      });
      return;
    }

    if (paymentMethod === 'cash') {
      if (!tenderedCash.trim() || parsedTendered <= 0) {
        showAlert({
          type: 'warning',
          title: language === 'ur' ? 'رقم درج کریں' : 'Cash Amount Required',
          message:
            language === 'ur'
              ? 'براہ کرم گاہک سے وصول شدہ نقد رقم درج کریں یا پوری رقم کا انتخاب کریں۔'
              : 'Please enter the cash amount received from the customer, or tap Exact Amount.',
        });
        return;
      }

      if (parsedTendered < grandTotal) {
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
    }

    if (paymentMethod === 'online') {
      if (!onlineAccount.trim() && !onlineTxRef.trim()) {
        showAlert({
          type: 'warning',
          title: language === 'ur' ? 'اکاؤنٹ نمبر مطلوب ہے' : 'Account Details Required',
          message:
            language === 'ur'
              ? 'آن لائن ادائیگی کی تصدیق کے لیے گاہک کا موبائل / اکاؤنٹ نمبر یا ٹرانزیکشن آئی ڈی (TID) درج کرنا لازمی ہے۔'
              : 'Please enter the sender\'s account/mobile number or Transaction ID (TID) to confirm online payment.',
        });
        return;
      }
    }

    setIsProcessing(true);
    try {
      let onlineNotes = '';
      if (paymentMethod === 'online') {
        const providerLabels: Record<string, string> = {
          easypaisa: 'EasyPaisa',
          jazzcash: 'JazzCash',
          raast: 'Raast',
          bank: 'Bank Transfer',
          other: 'Online',
        };
        const pLabel = providerLabels[onlineProvider] || 'Online';
        const parts: string[] = [`Method: ${pLabel}`];
        if (onlineAccount.trim()) parts.push(`Account/Sender: ${onlineAccount.trim()}`);
        if (onlineTxRef.trim()) parts.push(`TID: ${onlineTxRef.trim()}`);
        onlineNotes = parts.join(' | ');
      }

      const result = await completeSale({
        customerName: customerName.trim() || undefined,
        customerPhone: customerPhone.trim() || undefined,
        customerId: selectedKhataCustomer?.id,
        items: cart,
        discount: parsedDiscount,
        discountType,
        paymentMethod,
        tenderedCash: paymentMethod === 'cash' ? parsedTendered : undefined,
        notes: onlineNotes || undefined,
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
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Pressable
                onPress={handleHoldCart}
                accessibilityLabel="Hold Cart"
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.holdCartHeaderBtn,
                  { backgroundColor: theme.primaryLight },
                  pressed && { opacity: 0.8 },
                ]}>
                <Ionicons name="pause-circle-outline" size={15} color={theme.primary} />
                <Text style={[styles.holdCartHeaderBtnText, { color: theme.primaryDark }]}>
                  {language === 'ur' ? 'پارک کریں' : 'Hold'}
                </Text>
              </Pressable>

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
            </View>
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
                      {getProductName(item.product)}
                    </Text>
                    <Text style={[styles.cartItemPriceInfo, { color: theme.textSecondary }]}>
                      {settings.currencySymbol}{item.unitPrice} × {item.quantity} {item.product.unit || ''} ={' '}
                      <Text style={{ fontWeight: '700', color: theme.text }}>
                        {settings.currencySymbol}{item.total}
                      </Text>
                    </Text>
                  </View>

                  {/* Stepper & Loose Weight Scale Button */}
                  <View style={styles.itemStepperWrap}>
                    <Pressable
                      onPress={() => openLooseWeightModal(item.product, item.quantity)}
                      accessibilityLabel={`Adjust weight or cash for ${item.product.name}`}
                      accessibilityRole="button"
                      style={[styles.smallScaleBtn, { backgroundColor: theme.primaryLight }]}>
                      <Ionicons name="scale-outline" size={15} color={theme.primary} />
                    </Pressable>

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
                  onPress={() => handleSelectPaymentMethod(m.key)}
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
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="cash-outline" size={17} color={theme.primary} />
                <Text style={[styles.contextLabel, { color: theme.textSecondary, marginBottom: 0 }]}>
                  {language === 'ur' ? 'وصول شدہ نقد رقم (Cash Received) *' : 'Cash Received *'}
                </Text>
              </View>
              {parsedTendered > 0 && (
                <Pressable
                  onPress={() => setTenderedCash('')}
                  style={[styles.clearTenderBtn, { backgroundColor: theme.card }]}>
                  <Ionicons name="refresh-outline" size={12} color={theme.textMuted} />
                  <Text style={{ fontSize: 11, color: theme.textMuted, fontWeight: '700' }}>
                    {language === 'ur' ? 'دوبارہ لکھیں' : 'Reset'}
                  </Text>
                </Pressable>
              )}
            </View>

            {/* Smart 1-Tap Cash Tender Buttons (Tactile Grid) */}
            <View style={styles.smartTenderGrid}>
              {smartTenderOptions.map((opt) => {
                const isSelected = tenderedCash === opt.amount.toString();
                return (
                  <Pressable
                    key={opt.amount}
                    onPress={() => setTenderedCash(opt.amount.toString())}
                    style={({ pressed }) => [
                      styles.smartTenderCard,
                      {
                        backgroundColor: isSelected ? theme.primary : theme.card,
                        borderColor: isSelected ? theme.primary : theme.border,
                      },
                      pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
                    ]}>
                    <Text
                      style={[
                        styles.smartTenderLabel,
                        { color: isSelected ? '#FFFFFF' : theme.text },
                      ]}>
                      {opt.label}
                    </Text>
                    {opt.subLabel ? (
                      <Text
                        style={[
                          styles.smartTenderSub,
                          { color: isSelected ? '#E0E7FF' : (opt.isExact ? theme.primary : theme.textMuted) },
                        ]}>
                        {opt.subLabel}
                      </Text>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>

            {/* Custom Cash Input Box with Prefix */}
            <View
              style={[
                styles.cashInputWrap,
                {
                  backgroundColor: theme.card,
                  borderColor:
                    !tenderedCash.trim() || parsedTendered === 0
                      ? (settings.darkMode ? '#F59E0B' : '#D97706')
                      : parsedTendered < grandTotal
                      ? theme.danger
                      : theme.success,
                },
              ]}>
              <View style={[styles.cashPrefixBox, { backgroundColor: theme.surfaceSubtle }]}>
                <Text style={[styles.cashPrefixText, { color: theme.textSecondary }]}>
                  {settings.currencySymbol}
                </Text>
              </View>
              <TextInput
                style={[styles.cashInputText, { color: theme.text }]}
                placeholder={language === 'ur' ? 'یا مختلف رقم لکھیں...' : 'Or enter custom amount...'}
                placeholderTextColor={theme.textMuted}
                keyboardType="numeric"
                value={tenderedCash}
                onChangeText={setTenderedCash}
              />
              {tenderedCash.trim() ? (
                <Pressable onPress={() => setTenderedCash('')} hitSlop={8} style={{ paddingRight: 12 }}>
                  <Ionicons name="close-circle" size={18} color={theme.textMuted} />
                </Pressable>
              ) : null}
            </View>

            {/* Scenario A: Change Return to Customer (Luminous Prominent Pill) */}
            {parsedTendered > grandTotal && (
              <View style={styles.changeReturnHeroCard}>
                <View style={styles.changeReturnHeroIcon}>
                  <Ionicons name="arrow-undo" size={22} color="#047857" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.changeReturnHeroLabel}>
                    {language === 'ur' ? 'گاہک کو باقی واپس کریں' : 'GIVE BACK CHANGE'}
                  </Text>
                  <Text style={styles.changeReturnHeroAmount}>
                    {settings.currencySymbol} {changeToReturn.toLocaleString()}
                  </Text>
                </View>
                <Ionicons name="checkmark-circle" size={26} color="#10B981" />
              </View>
            )}

            {/* Scenario B: Exact Payment Received (No change needed) */}
            {parsedTendered === grandTotal && parsedTendered > 0 && (
              <View style={styles.exactPaymentHeroCard}>
                <Ionicons name="checkmark-done-circle" size={22} color="#15803D" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.exactPaymentHeroTitle}>
                    {language === 'ur' ? 'پوری رقم وصول ہو گئی (باقی صفر)' : 'Exact Payment Received'}
                  </Text>
                  <Text style={styles.exactPaymentHeroSub}>
                    {language === 'ur' ? 'کوئی بقایا واپس نہیں کرنا ہے' : 'Zero change return needed'}
                  </Text>
                </View>
              </View>
            )}

            {/* Scenario C: Insufficient Cash (Still due) */}
            {parsedTendered > 0 && parsedTendered < grandTotal && (
              <View style={styles.shortCashHeroCard}>
                <Ionicons name="alert-circle" size={22} color="#DC2626" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.shortCashHeroLabel}>
                    {language === 'ur' ? 'رقم کم ہے (بقایا مطلوب)' : 'INSUFFICIENT TENDER'}
                  </Text>
                  <Text style={styles.shortCashHeroAmount}>
                    {settings.currencySymbol} {(grandTotal - parsedTendered).toLocaleString()} {language === 'ur' ? 'مزید درکار ہیں' : 'Still Due'}
                  </Text>
                </View>
              </View>
            )}

            {/* Scenario D: Empty Cash Validation Prompt */}
            {(!tenderedCash.trim() || parsedTendered === 0) && (
              <View
                style={[
                  styles.validationHintRow,
                  {
                    backgroundColor: settings.darkMode ? 'rgba(245, 158, 11, 0.12)' : '#FEF3C7',
                    marginTop: 2,
                  },
                ]}>
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color={settings.darkMode ? '#FBBF24' : '#D97706'}
                />
                <Text
                  style={[
                    styles.validationHintText,
                    { color: settings.darkMode ? '#FDE68A' : '#92400E' },
                  ]}>
                  {language === 'ur'
                    ? `اوپر دیے گئے 1-ٹیپ بٹن سے نوٹ منتخب کریں یا رقم درج کریں۔`
                    : `Tap a 1-tap note button above or enter amount received.`}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Contextual: Online Payment Details (EasyPaisa / JazzCash / Raast / Bank) */}
        {paymentMethod === 'online' && cart.length > 0 && (
          <View style={[styles.contextPanel, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
            <View style={styles.cashHeaderRow}>
              <Text style={[styles.contextLabel, { color: theme.textSecondary }]}>
                {language === 'ur' ? 'آن لائن ادائیگی سروس' : 'Online Payment Service'}
              </Text>
              <View style={[styles.exactBadge, { backgroundColor: theme.primaryLight }]}>
                <Text style={[styles.exactBadgeText, { color: theme.primaryDark }]}>
                  {settings.currencySymbol}{grandTotal}
                </Text>
              </View>
            </View>

            {/* Online Providers Chips */}
            <View style={styles.onlineProvidersRow}>
              {[
                { key: 'easypaisa', label: 'EasyPaisa', icon: 'wallet-outline', color: '#10B981', bg: 'rgba(16, 185, 129, 0.14)' },
                { key: 'jazzcash', label: 'JazzCash', icon: 'phone-portrait-outline', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.14)' },
                { key: 'raast', label: 'Raast', icon: 'flash-outline', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.14)' },
                { key: 'bank', label: 'Bank / Other', icon: 'card-outline', color: '#6366F1', bg: 'rgba(99, 102, 241, 0.14)' },
              ].map((p) => {
                const isSelected = onlineProvider === p.key;
                return (
                  <Pressable
                    key={p.key}
                    onPress={() => setOnlineProvider(p.key as any)}
                    style={[
                      styles.onlineProviderChip,
                      {
                        backgroundColor: isSelected ? p.bg : theme.card,
                        borderColor: isSelected ? p.color : theme.border,
                        borderWidth: isSelected ? 2 : 1,
                      },
                    ]}>
                    <Ionicons name={p.icon as any} size={15} color={isSelected ? p.color : theme.textSecondary} />
                    <Text
                      style={[
                        styles.onlineProviderText,
                        {
                          color: isSelected ? p.color : theme.text,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}>
                      {p.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Inputs: Customer Mobile / Account & TID */}
            <View style={{ gap: 8, marginTop: 10 }}>
              <View>
                <Text style={[styles.inputFieldLabel, { color: theme.textSecondary }]}>
                  {language === 'ur' ? 'گاہک کا اکاؤنٹ / موبائل نمبر *' : 'Sender Mobile / Account Number *'}
                </Text>
                <TextInput
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: theme.card,
                      color: theme.text,
                      borderColor:
                        !onlineAccount.trim() && !onlineTxRef.trim()
                          ? (settings.darkMode ? '#F59E0B' : '#D97706')
                          : theme.primary,
                      borderWidth: 1.5,
                    },
                  ]}
                  placeholder={language === 'ur' ? 'مثلاً 03001234567 یا اکاؤنٹ ٹائٹل' : 'e.g. 03001234567 or Sender Title'}
                  placeholderTextColor={theme.textMuted}
                  keyboardType="default"
                  value={onlineAccount}
                  onChangeText={setOnlineAccount}
                />
              </View>

              <View>
                <Text style={[styles.inputFieldLabel, { color: theme.textSecondary }]}>
                  {language === 'ur' ? 'ٹرانزیکشن آئی ڈی / TID (اختیاری)' : 'Transaction ID / TID (Optional)'}
                </Text>
                <TextInput
                  style={[
                    styles.formInput,
                    { backgroundColor: theme.card, color: theme.text, borderColor: theme.border },
                  ]}
                  placeholder={language === 'ur' ? 'مثلاً TID: 82948274' : 'e.g. TID: 82948274'}
                  placeholderTextColor={theme.textMuted}
                  value={onlineTxRef}
                  onChangeText={setOnlineTxRef}
                />
              </View>

              {/* Dynamic Verification Hint */}
              {!onlineAccount.trim() && !onlineTxRef.trim() ? (
                <View
                  style={[
                    styles.validationHintRow,
                    {
                      backgroundColor: settings.darkMode ? 'rgba(245, 158, 11, 0.12)' : '#FEF3C7',
                      marginTop: 2,
                    },
                  ]}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={16}
                    color={settings.darkMode ? '#FBBF24' : '#D97706'}
                  />
                  <Text
                    style={[
                      styles.validationHintText,
                      { color: settings.darkMode ? '#FDE68A' : '#92400E' },
                    ]}>
                    {language === 'ur'
                      ? 'ادائیگی کی تصدیق کے لیے بھیجنے والے کا اکاؤنٹ یا موبائل نمبر درج کریں۔'
                      : 'Enter sender mobile/account or TID to verify payment.'}
                  </Text>
                </View>
              ) : (
                <View
                  style={[
                    styles.validationHintRow,
                    {
                      backgroundColor: settings.darkMode ? 'rgba(16, 185, 129, 0.12)' : '#DCFCE7',
                      marginTop: 2,
                    },
                  ]}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={16}
                    color={settings.darkMode ? '#34D399' : '#15803D'}
                  />
                  <Text
                    style={[
                      styles.validationHintText,
                      { color: settings.darkMode ? '#A7F3D0' : '#166534' },
                    ]}>
                    {language === 'ur'
                      ? `${settings.currencySymbol}${grandTotal} موصولی کی تصدیق تیار ہے`
                      : `Ready to verify ${settings.currencySymbol}${grandTotal} received via ${
                          onlineProvider === 'easypaisa'
                            ? 'EasyPaisa'
                            : onlineProvider === 'jazzcash'
                            ? 'JazzCash'
                            : onlineProvider === 'raast'
                            ? 'Raast'
                            : 'Bank/Online'
                        }`}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Contextual: Udhaar Khata Customer Picker (Searchable & 1-Tap) */}
        {paymentMethod === 'udhaar' && (
          <View style={[styles.contextPanel, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
            <Text style={[styles.contextLabel, { color: theme.textSecondary }]}>
              {t('selectCustomer')} *
            </Text>

            {/* CASE 1: Customer is ALREADY Selected */}
            {selectedKhataCustomer ? (
              <View
                style={[
                  styles.selectedCustomerCard,
                  { backgroundColor: theme.card, borderColor: theme.primary },
                ]}>
                <View style={styles.selectedCustomerHeader}>
                  <View style={[styles.customerAvatar, { backgroundColor: theme.primaryLight }]}>
                    <Text style={[styles.customerAvatarText, { color: theme.primary }]}>
                      {selectedKhataCustomer.name.slice(0, 1).toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={[styles.selectedCustomerName, { color: theme.text }]} numberOfLines={1}>
                        {selectedKhataCustomer.name}
                      </Text>
                      {language === 'ur' && selectedKhataCustomer.nameUrdu ? (
                        <Text style={{ fontSize: 11, color: theme.textMuted }}>
                          ({selectedKhataCustomer.nameUrdu})
                        </Text>
                      ) : null}
                    </View>
                    <Text style={[styles.selectedCustomerPhone, { color: theme.textMuted }]}>
                      📞 {selectedKhataCustomer.phone || (language === 'ur' ? 'فون نمبر نہیں' : 'No phone')}
                    </Text>
                  </View>
                  <Pressable
                    onPress={handleClearSelectedCustomer}
                    style={[
                      styles.customerChangeBtn,
                      { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
                    ]}>
                    <Ionicons name="swap-horizontal" size={13} color={theme.primary} />
                    <Text style={[styles.customerChangeText, { color: theme.primary }]}>
                      {language === 'ur' ? 'تبدیل کریں' : 'Change'}
                    </Text>
                  </Pressable>
                </View>

                {/* Ledger Impact Preview */}
                <View style={[styles.balancePreviewRow, { borderTopColor: theme.border }]}>
                  <View style={styles.balancePreviewCol}>
                    <Text style={[styles.balancePreviewLabel, { color: theme.textMuted }]}>
                      {language === 'ur' ? 'موجودہ ادھار' : 'Current Due'}
                    </Text>
                    <Text
                      style={[
                        styles.balancePreviewVal,
                        {
                          color:
                            selectedKhataCustomer.totalDebt > 0
                              ? theme.danger
                              : selectedKhataCustomer.totalDebt < 0
                              ? theme.success
                              : theme.textSecondary,
                        },
                      ]}>
                      {selectedKhataCustomer.totalDebt > 0
                        ? `${settings.currencySymbol} ${selectedKhataCustomer.totalDebt.toLocaleString()}`
                        : selectedKhataCustomer.totalDebt < 0
                        ? `${settings.currencySymbol} ${Math.abs(selectedKhataCustomer.totalDebt).toLocaleString()} (Advance)`
                        : (language === 'ur' ? 'صاف کھاتہ' : 'Settled')}
                    </Text>
                  </View>
                  <Ionicons name="arrow-forward" size={14} color={theme.textMuted} />
                  <View style={styles.balancePreviewCol}>
                    <Text style={[styles.balancePreviewLabel, { color: theme.textMuted }]}>
                      {language === 'ur' ? 'نیا کل بقایا' : 'New Total Due'}
                    </Text>
                    <Text style={[styles.balancePreviewVal, { color: theme.danger, fontWeight: '800' }]}>
                      {settings.currencySymbol} {((selectedKhataCustomer.totalDebt || 0) + grandTotal).toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
            ) : isAddingNewCustomer ? (
              /* CASE 2: Adding a NEW customer */
              <View style={{ gap: 8, marginTop: 2 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: theme.primary }}>
                    👤 {language === 'ur' ? 'نیا گاہک درج کریں' : 'Enter New Customer Details'}
                  </Text>
                  <Pressable
                    onPress={() => setIsAddingNewCustomer(false)}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 4, padding: 4 }}>
                    <Ionicons name="search" size={12} color={theme.textMuted} />
                    <Text style={{ fontSize: 11, color: theme.textMuted }}>
                      {language === 'ur' ? 'تلاش پر واپس' : 'Back to Search'}
                    </Text>
                  </Pressable>
                </View>

                <TextInput
                  style={[
                    styles.formInput,
                    { backgroundColor: theme.card, color: theme.text, borderColor: theme.border },
                  ]}
                  placeholder={language === 'ur' ? 'گاہک کا نام درج کریں *' : 'Enter Customer Name *'}
                  placeholderTextColor={theme.textMuted}
                  value={customerName}
                  onChangeText={setCustomerName}
                  autoFocus={true}
                />
                <TextInput
                  style={[
                    styles.formInput,
                    { backgroundColor: theme.card, color: theme.text, borderColor: theme.border },
                  ]}
                  placeholder={language === 'ur' ? 'گاہک کا فون / واٹس ایپ نمبر *' : 'Customer Phone / WhatsApp *'}
                  placeholderTextColor={theme.textMuted}
                  keyboardType="phone-pad"
                  value={customerPhone}
                  onChangeText={setCustomerPhone}
                />
                <Text style={{ fontSize: 11, color: theme.textMuted }}>
                  {language === 'ur'
                    ? 'نیا گاہک بل بنتے ہی خودکار طور پر کھاتہ میں رجسٹر ہو جائے گا۔'
                    : 'New customer will be automatically registered in Customer Ledger upon sale.'}
                </Text>
              </View>
            ) : (
              /* CASE 3: Fast Search & 1-Tap Recent Selector */
              <View style={{ gap: 8 }}>
                {/* Search Bar */}
                <View
                  style={[
                    styles.customerSearchWrap,
                    { backgroundColor: theme.card, borderColor: theme.border },
                  ]}>
                  <Ionicons name="search-outline" size={16} color={theme.textMuted} />
                  <TextInput
                    style={[styles.customerSearchInput, { color: theme.text }]}
                    placeholder={
                      language === 'ur'
                        ? 'گاہک تلاش کریں (نام یا فون)...'
                        : 'Search Customer (Name or Phone)...'
                    }
                    placeholderTextColor={theme.textMuted}
                    value={customerSearchQuery}
                    onChangeText={setCustomerSearchQuery}
                  />
                  {customerSearchQuery.length > 0 && (
                    <Pressable
                      onPress={() => setCustomerSearchQuery('')}
                      style={{ padding: 4 }}>
                      <Ionicons name="close-circle" size={16} color={theme.textMuted} />
                    </Pressable>
                  )}
                </View>

                {/* Dropdown Suggestions (When typing) */}
                {customerSearchQuery.trim().length > 0 ? (
                  <View
                    style={[
                      styles.suggestionsList,
                      { backgroundColor: theme.card, borderColor: theme.border },
                    ]}>
                    {matchingKhataCustomers.length > 0 ? (
                      matchingKhataCustomers.map((cust) => (
                        <Pressable
                          key={cust.id}
                          onPress={() => handleSelectKhataCustomer(cust)}
                          style={[
                            styles.suggestionRow,
                            { borderBottomColor: theme.border },
                          ]}>
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.suggestionName, { color: theme.text }]}>
                              {cust.name} {language === 'ur' && cust.nameUrdu ? `(${cust.nameUrdu})` : ''}
                            </Text>
                            <Text style={[styles.suggestionPhone, { color: theme.textMuted }]}>
                              📞 {cust.phone || (language === 'ur' ? 'فون نہیں' : 'No phone')}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.suggestionBadge,
                              {
                                backgroundColor:
                                  cust.totalDebt > 0
                                    ? theme.dangerLight
                                    : cust.totalDebt < 0
                                    ? theme.successLight
                                    : theme.surfaceSubtle,
                              },
                            ]}>
                            <Text
                              style={[
                                styles.suggestionBadgeText,
                                {
                                  color:
                                    cust.totalDebt > 0
                                    ? theme.danger
                                    : cust.totalDebt < 0
                                    ? theme.success
                                    : theme.textMuted,
                                },
                              ]}>
                              {cust.totalDebt > 0
                                ? `${settings.currencySymbol}${cust.totalDebt}`
                                : cust.totalDebt < 0
                                ? `${settings.currencySymbol}${Math.abs(cust.totalDebt)} (Adv)`
                                : '0'}
                            </Text>
                          </View>
                        </Pressable>
                      ))
                    ) : null}

                    {/* Option to create new customer with query */}
                    <Pressable
                      onPress={() => handleStartNewCustomer(customerSearchQuery.trim())}
                      style={[
                        styles.createCustomerRow,
                        { backgroundColor: theme.primaryLight },
                      ]}>
                      <Ionicons name="person-add" size={15} color={theme.primary} />
                      <Text style={[styles.createCustomerRowText, { color: theme.primary }]}>
                        {language === 'ur'
                          ? `➕ نیا گاہک بنائیں: "${customerSearchQuery.trim()}"`
                          : `➕ Add New Customer: "${customerSearchQuery.trim()}"`}
                      </Text>
                    </Pressable>
                  </View>
                ) : (
                  /* 1-Tap Chips when search is empty */
                  <View style={{ gap: 6 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 11, fontWeight: '600', color: theme.textMuted }}>
                        {language === 'ur' ? 'حالیہ گاہک یا نیا بنائیں:' : 'Recent Customers or New:'}
                      </Text>
                    </View>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      nestedScrollEnabled={true}
                      style={styles.khataChipsScroll}
                      contentContainerStyle={styles.khataChipsContent}>
                      <Pressable
                        onPress={() => handleStartNewCustomer('')}
                        style={[
                          styles.khataChip,
                          {
                            backgroundColor: theme.primary,
                            borderColor: theme.primary,
                          },
                        ]}>
                        <Ionicons name="person-add" size={13} color="#FFFFFF" />
                        <Text style={[styles.khataChipName, { color: '#FFFFFF', fontWeight: '700' }]}>
                          {language === 'ur' ? '+ نیا گاہک' : '+ New Customer'}
                        </Text>
                      </Pressable>

                      {recentKhataCustomers.map((cust) => (
                        <Pressable
                          key={cust.id}
                          onPress={() => handleSelectKhataCustomer(cust)}
                          style={[
                            styles.khataChip,
                            {
                              backgroundColor: theme.card,
                              borderColor: theme.border,
                            },
                          ]}>
                          <Ionicons name="person" size={12} color={theme.primary} />
                          <Text style={[styles.khataChipName, { color: theme.text }]}>
                            {cust.name}
                          </Text>
                          {cust.totalDebt > 0 && (
                            <Text style={{ fontSize: 10, color: theme.danger, fontWeight: '700' }}>
                              ({settings.currencySymbol}{cust.totalDebt})
                            </Text>
                          )}
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            )}
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

        {/* Tier 1: Bill Summary Row */}
        <View style={[styles.footerSummaryRow, { borderBottomColor: theme.border }]}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={[styles.footerSummaryTitle, { color: theme.textSecondary }]}>
              {language === 'ur' ? 'کل بل کی رقم' : 'Total Payable'}
            </Text>
            <Text style={[styles.subtotalLine, { color: theme.textMuted }]} numberOfLines={1}>
              {t('subtotal')}: {settings.currencySymbol} {formatCompactPrice(subtotal)}
              {discountAmount > 0 && ` | -${settings.currencySymbol} ${formatCompactPrice(discountAmount)}`}
            </Text>
          </View>
          <Text
            style={[styles.grandTotalLine, { color: theme.primary }]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.75}>
            {settings.currencySymbol} {formatCompactPrice(grandTotal)}
          </Text>
        </View>

        {/* Tier 2: Full-Width Hero Complete Sale Button */}
        {(() => {
          const valState = getCheckoutValidationState();
          const isDisabled = !valState.isValid || isProcessing;
          return (
            <Pressable
              disabled={isDisabled}
              onPress={handleGenerateBill}
              accessibilityLabel={valState.btnLabel}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.completeSaleBtn,
                {
                  backgroundColor: valState.btnColor,
                  opacity: isDisabled && !isProcessing ? 0.75 : 1,
                },
                pressed && !isDisabled && { transform: [{ scale: 0.985 }] },
              ]}>
              {isProcessing ? (
                <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 6 }} />
              ) : (
                <Ionicons
                  name={valState.icon as any}
                  size={20}
                  color={valState.textColor}
                />
              )}
              <Text
                style={[
                  styles.completeSaleBtnText,
                  { color: valState.textColor },
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                minimumFontScale={0.82}
                ellipsizeMode="tail">
                {isProcessing
                  ? language === 'ur'
                    ? 'پروسیس ہو رہا ہے...'
                    : 'Processing...'
                  : valState.btnLabel}
              </Text>
            </Pressable>
          );
        })()}
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
          {/* Top Emerald Canopy (Seamless continuation from ShopHeader) */}
          <View style={[styles.heroCanopy, { backgroundColor: theme.heroBg }]}>
            <View style={styles.heroInner}>
              {/* Top Control Bar: Search + Barcode + Flash + Parked + View Toggle */}
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
                          backgroundColor: 'rgba(255, 255, 255, 0.16)',
                          borderColor: 'rgba(255, 255, 255, 0.28)',
                        },
                        pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
                      ]}>
                      <Ionicons name="barcode-outline" size={20} color="#FFFFFF" />
                    </Pressable>

                    <Pressable
                      onPress={() => setIsQuickItemOpen(true)}
                      accessibilityLabel="Add custom or loose item"
                      accessibilityRole="button"
                      style={({ pressed }) => [
                        styles.searchBarcodeBtn,
                        {
                          backgroundColor: 'rgba(245, 158, 11, 0.22)',
                          borderColor: 'rgba(245, 158, 11, 0.45)',
                        },
                        pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
                      ]}>
                      <Ionicons name="flash" size={19} color="#FDE68A" />
                    </Pressable>
                  </View>
                </View>

                <View style={styles.topBarActions}>
                  {/* Parked Carts Button */}
                  {heldCarts.length > 0 && (
                    <Pressable
                      onPress={() => setIsHeldCartsModalOpen(true)}
                      style={({ pressed }) => [
                        styles.heldPillBtn,
                        {
                          backgroundColor: '#FEF3C7',
                          borderColor: '#FDE68A',
                        },
                        pressed && { opacity: 0.8 },
                      ]}>
                      <Ionicons name="pause-circle" size={15} color="#D97706" />
                      <Text style={[styles.heldPillText, { color: '#B45309' }]}>
                        {heldCarts.length}
                      </Text>
                    </Pressable>
                  )}

                  <Pressable
                    onPress={toggleViewMode}
                    style={({ pressed }) => [
                      styles.iconSquareBtn,
                      {
                        backgroundColor: 'rgba(255, 255, 255, 0.16)',
                        borderColor: 'rgba(255, 255, 255, 0.28)',
                      },
                      pressed && { opacity: 0.8 },
                    ]}>
                    <Ionicons
                      name={viewMode === 'grid' ? 'list-outline' : 'grid-outline'}
                      size={18}
                      color="#FFFFFF"
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
                  <View style={[styles.favLead, { backgroundColor: 'rgba(255, 255, 255, 0.18)' }]}>
                    <Ionicons name="flash" size={11} color="#FDE68A" />
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
                              ? '#FFFFFF'
                              : 'rgba(255, 255, 255, 0.16)',
                            borderColor: inCart
                              ? '#FFFFFF'
                              : 'rgba(255, 255, 255, 0.26)',
                            opacity: isOut ? 0.4 : 1,
                          },
                          pressed && !isOut && { transform: [{ scale: 0.96 }] },
                        ]}>
                        <Text
                          style={[
                            styles.favChipName,
                            { color: inCart ? '#064E3B' : '#FFFFFF' },
                          ]}
                          numberOfLines={1}>
                          {getProductName(product)}
                        </Text>
                        {inCart ? (
                          <View style={[styles.favChipBadge, { backgroundColor: '#064E3B' }]}>
                            <Text style={[styles.favChipBadgeText, { color: '#FFFFFF' }]}>{inCart.quantity}</Text>
                          </View>
                        ) : (
                          <Text style={[styles.favChipPrice, { color: '#A7F3D0' }]}>
                            {settings.currencySymbol}
                            {formatCompactPrice(product.price)}
                          </Text>
                        )}
                      </Pressable>
                    );
                  })}
                </ScrollView>
              ) : null}

              {/* Category Filter Pills — frosted glass */}
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
                    activeBg="#FFFFFF"
                    activeColor="#064E3B"
                    inactiveBg="rgba(255, 255, 255, 0.16)"
                    inactiveColor="#FFFFFF"
                    inactiveBorder="rgba(255, 255, 255, 0.22)"
                  />
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Products List / Grid or Empty State */}
          <View style={styles.catalogItemsWrap}>
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
                // Generous bottom padding so catalog products scroll completely clear of the unified POS dock
                !isWideScreen && cart.length > 0 && { paddingBottom: 150 },
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
                          {getProductName(product)}
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
                        {getProductName(product)}
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
                          <Pressable
                            onPress={() => openLooseWeightModal(product, inCartItem.quantity)}
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
                          </Pressable>
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
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          {(product.unit === 'kg' || product.unit === 'gram' || product.unit === 'litre') && (
                            <Pressable
                              disabled={isOut}
                              onPress={() => openLooseWeightModal(product, 1)}
                              style={[
                                styles.cardScaleQuickBtn,
                                {
                                  backgroundColor: theme.surfaceSubtle,
                                  borderColor: theme.border,
                                },
                              ]}>
                              <Ionicons
                                name="scale-outline"
                                size={14}
                                color={isOut ? theme.textMuted : theme.primary}
                              />
                            </Pressable>
                          )}
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
                        </View>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
          </View>

          {/* ================= Mobile Sticky Unified POS Cart Dock ================= */}
          {!isWideScreen && cart.length > 0 && (
            <View
              style={[
                styles.unifiedCartDock,
                {
                  backgroundColor: settings.darkMode ? '#1E293B' : '#FFFFFF',
                  borderColor: settings.darkMode ? 'rgba(255, 255, 255, 0.14)' : '#E2E8F0',
                },
              ]}>
              {/* Row 1: High-Contrast, Prominent POS Order Action Buttons */}
              <View style={styles.dockActionsRow}>
                {/* Hold Order Button (Distinct Warm Amber) */}
                <Pressable
                  onPress={handleHoldCart}
                  style={({ pressed }) => [
                    styles.dockActionBtn,
                    {
                      backgroundColor: settings.darkMode
                        ? 'rgba(245, 158, 11, 0.16)'
                        : '#FEF3C7',
                      borderColor: settings.darkMode
                        ? 'rgba(245, 158, 11, 0.5)'
                        : '#F59E0B',
                    },
                    pressed && { opacity: 0.82, transform: [{ scale: 0.98 }] },
                  ]}
                  accessibilityLabel="Hold current order to serve next customer"
                  accessibilityRole="button">
                  <Ionicons
                    name="pause-circle"
                    size={17}
                    color={settings.darkMode ? '#FBBF24' : '#D97706'}
                  />
                  <Text
                    style={[
                      styles.dockActionText,
                      { color: settings.darkMode ? '#FDE68A' : '#92400E' },
                    ]}>
                    {language === 'ur' ? 'بل ہولڈ کریں' : 'Hold Order'}
                  </Text>
                </Pressable>

                {/* Cancel Order Button (Distinct Clean Rose / Red) */}
                <Pressable
                  onPress={() => {
                    showAlert({
                      type: 'warning',
                      title: language === 'ur' ? 'بل منسوخ کریں؟' : 'Cancel Current Order?',
                      message: language === 'ur'
                        ? `بل میں ${totalItemsCount} اشیاء شامل ہیں، کیا آپ پورا بل منسوخ اور خالی کرنا چاہتے ہیں؟`
                        : `Discard all ${totalItemsCount} item${totalItemsCount !== 1 ? 's' : ''} and clear the active bill?`,
                      buttons: [
                        {
                          text: language === 'ur' ? 'ہاں، منسوخ کریں' : 'Cancel Order',
                          style: 'destructive',
                          icon: 'trash-outline',
                          onPress: clearCart,
                        },
                        { text: language === 'ur' ? 'واپس' : 'Keep Order', style: 'cancel' },
                      ],
                    });
                  }}
                  style={({ pressed }) => [
                    styles.dockActionBtn,
                    {
                      backgroundColor: settings.darkMode
                        ? 'rgba(239, 68, 68, 0.16)'
                        : '#FEE2E2',
                      borderColor: settings.darkMode
                        ? 'rgba(239, 68, 68, 0.5)'
                        : '#FCA5A5',
                    },
                    pressed && { opacity: 0.82, transform: [{ scale: 0.98 }] },
                  ]}
                  accessibilityLabel="Cancel order and clear cart"
                  accessibilityRole="button">
                  <Ionicons
                    name="trash-outline"
                    size={16}
                    color={settings.darkMode ? '#F87171' : '#DC2626'}
                  />
                  <Text
                    style={[
                      styles.dockActionText,
                      { color: settings.darkMode ? '#FECDD3' : '#B91C1C' },
                    ]}>
                    {language === 'ur' ? 'منسوخ کریں' : 'Cancel Order'}
                  </Text>
                </Pressable>
              </View>

              {/* Row 2: Full-Width Primary Checkout Hero Button */}
              <Pressable
                onPress={openCheckoutDrawer}
                style={({ pressed }) => [
                  styles.dockHeroCheckoutBtn,
                  { backgroundColor: theme.primary },
                  pressed && { opacity: 0.94, transform: [{ scale: 0.985 }] },
                ]}
                accessibilityLabel="View bill and proceed to payment"
                accessibilityRole="button">
                <View style={styles.dockHeroLeft}>
                  <View style={styles.dockBadge}>
                    <Ionicons name="cart" size={18} color={theme.primary} />
                    <Text style={styles.dockBadgeCount}>{totalItemsCount}</Text>
                  </View>
                  <View style={styles.dockPriceCol}>
                    <Text style={styles.dockItemsLabel}>
                      {totalItemsCount} {t('itemsInCart')}
                    </Text>
                    <Text style={styles.dockGrandTotal} numberOfLines={1}>
                      {settings.currencySymbol} {formatCompactPrice(grandTotal)}
                    </Text>
                  </View>
                </View>

                <View style={styles.dockHeroRightPill}>
                  <Text style={styles.dockHeroActionText}>{t('viewBill')}</Text>
                  <Ionicons name="arrow-forward" size={17} color="#FFFFFF" />
                </View>
              </Pressable>
            </View>
          )}

          {/* ================= Mobile Sticky Resume Parked Carts Banner ================= */}
          {!isWideScreen && cart.length === 0 && heldCarts.length > 0 && (
            <View style={styles.floatingHeldBarContainer}>
              <Pressable
                onPress={() => setIsHeldCartsModalOpen(true)}
                style={({ pressed }) => [
                  styles.floatingHeldBar,
                  {
                    backgroundColor: settings.darkMode ? 'rgba(245, 158, 11, 0.22)' : '#FEF3C7',
                    borderColor: settings.darkMode ? 'rgba(245, 158, 11, 0.5)' : '#F59E0B',
                  },
                  pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
                ]}>
                <View style={styles.dockHeroLeft}>
                  <View style={[styles.dockBadge, { backgroundColor: '#F59E0B' }]}>
                    <Ionicons name="pause-circle" size={18} color="#FFFFFF" />
                    <Text style={[styles.dockBadgeCount, { color: '#FFFFFF' }]}>{heldCarts.length}</Text>
                  </View>
                  <View>
                    <Text style={[styles.floatingHeldTitle, { color: settings.darkMode ? '#FDE68A' : '#92400E' }]}>
                      {language === 'ur' ? 'پارک شدہ بلز محفوظ ہیں' : 'Parked Bills Waiting'}
                    </Text>
                    <Text style={[styles.floatingHeldSub, { color: settings.darkMode ? '#FCD34D' : '#B45309' }]}>
                      {language === 'ur' ? 'بحال کرنے کے لیے ٹیپ کریں' : 'Tap to review & resume'}
                    </Text>
                  </View>
                </View>

                <View style={styles.dockHeroRightPill}>
                  <Text style={[styles.floatingHeldActionText, { color: settings.darkMode ? '#FDE68A' : '#92400E' }]}>
                    {language === 'ur' ? 'دیکھیں' : 'Resume'}
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color={settings.darkMode ? '#FDE68A' : '#92400E'} />
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

      {/* Rush-Hour Counter: Held Carts Modal */}
      <HeldCartsModal
        visible={isHeldCartsModalOpen}
        onClose={() => setIsHeldCartsModalOpen(false)}
        heldCarts={heldCarts}
        onResumeCart={handleResumeCart}
        onDeleteHeldCart={handleDeleteHeldCart}
        onClearAllHeldCarts={handleClearAllHeldCarts}
      />

      {/* Rush-Hour Counter: Loose Goods Weight Modal */}
      <LooseWeightModal
        visible={isLooseModalOpen}
        onClose={() => {
          setIsLooseModalOpen(false);
          setLooseModalProduct(null);
        }}
        product={looseModalProduct}
        initialQuantity={looseModalInitialQty}
        onApply={handleApplyLooseWeight}
      />

      {/* 1-Tap Quick Custom Item Modal */}
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
    position: 'relative',
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
    gap: 7,
  },
  catalogItemsWrap: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: 8,
  },
  topControlBar: {
    flexDirection: 'row',
    gap: Spacing.sm,
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
  },
  categoryScrollContent: {
    gap: 6,
    alignItems: 'center',
  },

  favRowScroll: {
    maxHeight: 34,
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

  // Unified Mobile POS Dock
  unifiedCartDock: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 10,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1.5,
    padding: 10,
    gap: 8,
    ...Shadows.xl,
  },
  floatingHeldBarContainer: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 10,
  },
  dockActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dockActionBtn: {
    flex: 1,
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.2,
  },
  dockActionText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.1,
  },
  dockHeroCheckoutBtn: {
    width: '100%',
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },
  dockHeroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    paddingRight: 6,
  },
  dockBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.full,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dockBadgeCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#DC2626',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    overflow: 'hidden',
  },
  dockPriceCol: {
    justifyContent: 'center',
  },
  dockItemsLabel: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 11,
    fontWeight: '600',
  },
  dockGrandTotal: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  dockHeroRightPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    flexShrink: 0,
  },
  dockHeroActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
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
  onlineProvidersRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 6,
  },
  onlineProviderChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    flex: 1,
    minWidth: '45%',
    justifyContent: 'center',
  },
  onlineProviderText: {
    fontSize: 12,
  },
  inputFieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  validationHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  validationHintText: {
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  exactBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  exactBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },

  // Khata chips & Customer Selector
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
  selectedCustomerCard: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 12,
    gap: 10,
  },
  selectedCustomerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  customerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerAvatarText: {
    fontSize: 16,
    fontWeight: '800',
  },
  selectedCustomerName: {
    fontSize: 14,
    fontWeight: '800',
  },
  selectedCustomerPhone: {
    fontSize: 11,
    marginTop: 2,
  },
  customerChangeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  customerChangeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  balancePreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 8,
  },
  balancePreviewCol: {
    gap: 2,
  },
  balancePreviewLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  balancePreviewVal: {
    fontSize: 12,
    fontWeight: '700',
  },
  customerSearchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    gap: 8,
  },
  customerSearchInput: {
    flex: 1,
    fontSize: 13,
    height: '100%',
  },
  suggestionsList: {
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  suggestionName: {
    fontSize: 13,
    fontWeight: '700',
  },
  suggestionPhone: {
    fontSize: 11,
    marginTop: 2,
  },
  suggestionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  suggestionBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  createCustomerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  createCustomerRowText: {
    fontSize: 12,
    fontWeight: '700',
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
  footerSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  footerSummaryTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  subtotalLine: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  grandTotalLine: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  completeSaleBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    ...Shadows.md,
  },
  completeSaleBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.2,
    flexShrink: 1,
    textAlign: 'center',
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
  holdCartHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  holdCartHeaderBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  smallScaleBtn: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 2,
  },
  heldPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  heldPillText: {
    fontSize: 12,
    fontWeight: '800',
  },
  floatingHoldBtn: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    ...Shadows.md,
  },
  floatingHeldBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    ...Shadows.md,
  },
  floatingHeldTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  floatingHeldSub: {
    fontSize: 11,
    fontWeight: '600',
  },
  floatingHeldActionText: {
    fontSize: 13,
    fontWeight: '800',
  },
  cardScaleQuickBtn: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearTenderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  smartTenderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 4,
  },
  smartTenderCard: {
    width: '48.5%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    ...Shadows.sm,
  },
  smartTenderLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
  smartTenderSub: {
    fontSize: 11,
    fontWeight: '600',
  },
  cashInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    overflow: 'hidden',
    marginTop: 4,
  },
  cashPrefixBox: {
    height: '100%',
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cashPrefixText: {
    fontSize: 14,
    fontWeight: '800',
  },
  cashInputText: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    fontSize: 17,
    fontWeight: '800',
  },
  changeReturnHeroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 2,
    borderRadius: 16,
    padding: 14,
    marginTop: 6,
    ...Shadows.sm,
  },
  changeReturnHeroIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeReturnHeroLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  changeReturnHeroAmount: {
    fontSize: 24,
    fontWeight: '900',
    color: '#047857',
    marginTop: 1,
  },
  exactPaymentHeroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 12,
    marginTop: 6,
  },
  exactPaymentHeroTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#15803D',
  },
  exactPaymentHeroSub: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#166534',
    marginTop: 1,
  },
  shortCashHeroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 12,
    marginTop: 6,
  },
  shortCashHeroLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#991B1B',
    textTransform: 'uppercase',
  },
  shortCashHeroAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: '#DC2626',
    marginTop: 1,
  },
});
