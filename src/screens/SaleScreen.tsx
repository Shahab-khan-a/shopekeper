import { SaleBarcodeScannerSection } from '@/components/SaleBarcodeScannerSection';
import { HeldCart, HeldCartsModal } from '@/components/HeldCartsModal';
import { LooseWeightModal } from '@/components/LooseWeightModal';
import { QuickItemModal } from '@/components/QuickItemModal';
import { ProductImage } from '@/components/ProductImage';
import { QuickBillPad } from '@/components/QuickBillPad';
import { UdhaarConfirmPayload, UdhaarQuickSheet } from '@/components/UdhaarQuickSheet';
import { ItemsSidebarDrawer } from '@/components/ItemsSidebarDrawer';
import { FloatingItemsBump } from '@/components/FloatingItemsBump';
import { SubScreenHeader } from '@/components/SubScreenHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { SearchBar } from '@/components/ui/SearchBar';
import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';
import { CartItem, CustomerKhata, PaymentMethod, Product, ProductCategory } from '@/types';
import { formatCompactPrice } from '@/utils/formatters';
import { productIconFor } from '@/utils/productIcon';
import { openWhatsAppReceipt, openWhatsAppWithMessage, buildBohaniShareText } from '@/utils/whatsapp';
import { announceBoltaGalla } from '@/utils/soundbox';
import { ShopStoreLoader } from '@/components/ShopStoreLoader';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
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
  const gridGap = 8;
  const gridColWidth = Math.floor(
    (catalogWidth - Spacing.md * 2 - gridGap * (gridCols - 1) - 2) / gridCols
  );

  const {
    products,
    isProductsLoading,
    khata,
    sales,
    completeSale,
    settings,
    t,
    language,
    setActiveReceipt,
    setIsAddProductOpen,
    setEditingProduct,
    showAlert,
    hideAlert,
    saleViewMode,
    setSaleViewMode,
    setActiveTab,
    user,
  } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const softBorder = settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(148,163,184,0.35)';
  const cardBg = settings.darkMode ? theme.card : '#FFFFFF';

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<string>('');
  const [discountType, setDiscountType] = useState<'fixed' | 'percent'>('fixed');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [tenderedCash, setTenderedCash] = useState<string>('');
  const [selectedKhataCustomer, setSelectedKhataCustomer] = useState<CustomerKhata | null>(null);
  const [customerSearchQuery, setCustomerSearchQuery] = useState<string>('');
  const [isAddingNewCustomer, setIsAddingNewCustomer] = useState<boolean>(false);

  // Counter amount entry & right-edge Items sidebar state
  const [calcEntry, setCalcEntry] = useState<string>('');
  const [isItemsSidebarOpen, setIsItemsSidebarOpen] = useState<boolean>(false);
  const [counterAreaHeight, setCounterAreaHeight] = useState<number>(0);

  // Search, Filters & View Mode
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const viewMode = saleViewMode;

  const toggleViewMode = () => {
    setSaleViewMode(saleViewMode === 'grid' ? 'list' : 'grid');
  };

  // Modals & Drawers
  const [isBarcodeScannerActive, setIsBarcodeScannerActive] = useState(false);
  const [isQuickItemOpen, setIsQuickItemOpen] = useState(false);
  const [isCheckoutDrawerOpen, setIsCheckoutDrawerOpen] = useState(false);
  const [isUdhaarSheetOpen, setIsUdhaarSheetOpen] = useState(false);
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

  // Frictionless POS Parked Cart Toast with Instant Undo
  const [heldCartToast, setHeldCartToast] = useState<{
    visible: boolean;
    itemsCount: number;
    heldCart: HeldCart;
  } | null>(null);
  const heldToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // VU-01: Detect if first sale of today (Pehli Bohani)
  const isFirstSaleOfDay = useMemo(() => {
    const today = new Date().toDateString();
    return sales.filter((s) => new Date(s.date).toDateString() === today && !s.refundedAt).length === 0;
  }, [sales]);


  // Filter products by search query and category
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

  // AI-02: Associative Basket Companion Intelligence ("Bhai ke sath aur kya?")
  const COMPANION_RULES = useMemo(() => [
    {
      triggers: ['bread', 'ڈبل روٹی', 'روٹی', 'bun', 'بَن', 'rusk', 'رسک'],
      companionKeywords: ['egg', 'انڈے', 'milk', 'دودھ', 'butter', 'مکھن', 'jam', 'جام'],
    },
    {
      triggers: ['tea', 'chai', 'چائے', 'tapal', 'lipton', 'vital', 'tarang'],
      companionKeywords: ['milk', 'دودھ', 'sugar', 'چینی', 'cheeni', 'rusk', 'رسک', 'biscuit', 'بسکٹ'],
    },
    {
      triggers: ['atta', 'آٹا', 'rice', 'چاول', 'chawal', 'flour'],
      companionKeywords: ['oil', 'تیل', 'ghee', 'گھی', 'dalda', 'sufi', 'daal', 'دال', 'dal', 'salt', 'نمک'],
    },
    {
      triggers: ['chips', 'چپس', 'lays', 'kurkure', 'nimko', 'نمکو', 'biscuit', 'بسکٹ'],
      companionKeywords: ['coke', 'pepsi', 'drink', 'مشروب', 'juice', 'جوس', 'dew', '7up', 'sting'],
    },
    {
      triggers: ['soap', 'صابن', 'surf', 'detergent', 'سرف', 'ariel', 'bonus'],
      companionKeywords: ['bleach', 'بلیچ', 'harpic', 'ہارپک', 'dishwash', 'برتن'],
    },
  ], []);

  const companionSuggestions = useMemo(() => {
    if (cart.length === 0) return [];
    const cartProductNames = cart.map((c) => `${c.product.name} ${c.product.nameUrdu || ''}`.toLowerCase());

    const neededKeywords = new Set<string>();
    COMPANION_RULES.forEach((rule) => {
      const hasTrigger = rule.triggers.some((tr) => cartProductNames.some((cName) => cName.includes(tr)));
      if (hasTrigger) {
        rule.companionKeywords.forEach((kw) => neededKeywords.add(kw));
      }
    });

    if (neededKeywords.size === 0) return [];

    const cartIds = new Set(cart.map((c) => c.product.id));
    const suggestions: Product[] = [];

    for (const p of products) {
      if (cartIds.has(p.id) || p.stock === 0) continue;
      const pText = `${p.name} ${p.nameUrdu || ''}`.toLowerCase();
      const matches = Array.from(neededKeywords).some((kw) => pText.includes(kw));
      if (matches) {
        suggestions.push(p);
        if (suggestions.length >= 4) break;
      }
    }

    return suggestions;
  }, [cart, products, COMPANION_RULES]);

  // AI-03: Khata Customer Routine Basket Memory ("Chacha Ji ka Maamool")
  const customerUsualBasket = useMemo(() => {
    if (!selectedKhataCustomer) return null;
    const cSales = sales.filter(
      (s) =>
        (s.customerId && s.customerId === selectedKhataCustomer.id) ||
        (selectedKhataCustomer.phone && s.customerPhone === selectedKhataCustomer.phone) ||
        (s.customerName && s.customerName.toLowerCase() === selectedKhataCustomer.name.toLowerCase())
    );
    if (cSales.length === 0) return null;

    const itemMap = new Map<string, { product: Product; count: number; avgQty: number }>();
    cSales.forEach((s) => {
      s.items.forEach((it) => {
        const currentProd = products.find((p) => p.id === it.product.id) || it.product;
        const existing = itemMap.get(it.product.id);
        if (existing) {
          existing.count += 1;
          existing.avgQty = Math.max(1, Math.round((existing.avgQty + it.quantity) / 2));
        } else {
          itemMap.set(it.product.id, { product: currentProd, count: 1, avgQty: it.quantity });
        }
      });
    });

    const sorted = Array.from(itemMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    return sorted.length > 0 ? sorted : null;
  }, [selectedKhataCustomer, sales, products]);

  const handleAddUsualBasket = () => {
    if (!customerUsualBasket || customerUsualBasket.length === 0) return;
    const newCart = [...cart];
    customerUsualBasket.forEach((entry) => {
      const idx = newCart.findIndex((c) => c.product.id === entry.product.id);
      if (idx >= 0) {
        newCart[idx] = {
          ...newCart[idx],
          quantity: newCart[idx].quantity + entry.avgQty,
          total: (newCart[idx].quantity + entry.avgQty) * newCart[idx].unitPrice,
        };
      } else {
        newCart.push({
          product: entry.product,
          quantity: entry.avgQty,
          unitPrice: entry.product.price,
          total: entry.product.price * entry.avgQty,
        });
      }
    });
    setCart(newCart);
  };

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

  // Paid sales record exact bill amount (change is handled at the counter, not in-app)
  const parsedTendered = parseFloat(tenderedCash) || 0;

  // Cart actions
  const addToCart = (product: Product, delta: number = 1) => {
    const doAdd = () => {
      const existingIndex = cart.findIndex((item) => item.product.id === product.id);

      if (existingIndex >= 0) {
        const existingItem = cart[existingIndex];
        const newQty = existingItem.quantity + delta;

        if (product.stock > 0 && newQty > product.stock) {
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

      // Micro-Friction Eraser (MF-01): Clear search query so counter person is immediately ready for next item
      if (searchQuery.trim().length > 0) {
        setSearchQuery('');
      }
    };

    if (product.stock <= 0) {
      showAlert({
        type: 'warning',
        title: t('warningAlert'),
        message:
          language === 'ur'
            ? 'اس آئٹم کا اسٹاک 0 ہے۔ کیا آپ اسے بل میں شامل کرنا چاہتے ہیں؟'
            : 'This item shows 0 in stock. Add it to the bill anyway?',
        buttons: [
          { text: language === 'ur' ? 'منسوخ' : 'Cancel', style: 'cancel' },
          {
            text: language === 'ur' ? 'شامل کریں' : 'Add Anyway',
            style: 'default',
            onPress: () => {
              hideAlert();
              doAdd();
            },
          },
        ],
      });
      return;
    }

    doAdd();
  };

  // Micro-Friction Eraser (MF-02): Instant Barcode Scanner & Enter Key Auto-Add
  const handleSearchSubmit = () => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    // 1. Check exact barcode match first
    const exactBarcodeMatch = products.find(
      (p) => p.barcode && p.barcode.toLowerCase() === q
    );
    if (exactBarcodeMatch) {
      addToCart(exactBarcodeMatch);
      setSearchQuery('');
      return;
    }

    // 2. Check exact name match
    const exactNameMatch = products.find(
      (p) => p.name.toLowerCase() === q || (p.nameUrdu && p.nameUrdu.toLowerCase() === q)
    );
    if (exactNameMatch) {
      addToCart(exactNameMatch);
      setSearchQuery('');
      return;
    }

    // 3. If filtered list has exactly 1 item, auto-add it!
    if (filteredProducts.length === 1) {
      addToCart(filteredProducts[0]);
      setSearchQuery('');
      return;
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
    setCalcEntry('');
    setDiscount('');
    setCustomerName('');
    setCustomerPhone('');
    setTenderedCash('');
    setPaymentMethod('cash');
    setSelectedKhataCustomer(null);
    setCustomerSearchQuery('');
    setIsAddingNewCustomer(false);
    setIsCheckoutDrawerOpen(false);
    setIsUdhaarSheetOpen(false);
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

  // Rush-Hour Counter: Frictionless 1-Tap Hold & Resume Cart
  const handleHoldCart = () => {
    if (cart.length === 0) {
      showAlert({
        type: 'info',
        title: language === 'ur' ? 'کارٹ خالی ہے' : 'Cart is Empty',
        message: language === 'ur' ? 'ہولڈ کرنے کے لیے پہلے اشیاء شامل کریں۔' : 'Add items to the cart before holding.',
      });
      return;
    }

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

    // Show Non-Blocking Floating Toast with instant Undo (Zero blocking modal friction)
    if (heldToastTimer.current) clearTimeout(heldToastTimer.current);
    setHeldCartToast({
      visible: true,
      itemsCount: newHeldCart.totalItemsCount,
      heldCart: newHeldCart,
    });

    heldToastTimer.current = setTimeout(() => {
      setHeldCartToast(null);
    }, 3800);
  };

  const handleUndoHoldCart = (heldCart: HeldCart) => {
    if (heldToastTimer.current) clearTimeout(heldToastTimer.current);
    setHeldCartToast(null);

    // Remove from held carts
    const updatedHeld = heldCarts.filter((c) => c.id !== heldCart.id);
    setHeldCarts(updatedHeld);
    AsyncStorage.setItem(HELD_CARTS_STORAGE_KEY, JSON.stringify(updatedHeld)).catch(console.error);

    // Restore to active cart
    setCart(heldCart.items);
    setCustomerName(heldCart.customerName || '');
    setCustomerPhone(heldCart.customerPhone || '');
    setDiscount(heldCart.discount || '');
    setDiscountType(heldCart.discountType || 'fixed');
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

  /** Paid (cash) is the default counter path; Udhaar only when credit is needed. */
  const setSaleAsPaid = () => {
    setPaymentMethod('cash');
    setTenderedCash(grandTotal > 0 ? grandTotal.toString() : '');
    setSelectedKhataCustomer(null);
    setIsAddingNewCustomer(false);
    setCustomerSearchQuery('');
  };

  const setSaleAsUdhaar = () => {
    setPaymentMethod('udhaar');
    setTenderedCash('0');
  };

  const openCheckoutDrawer = () => {
    if (!tenderedCash || tenderedCash === '0') {
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

  // Dynamic Validation State for Checkout CTA
  const getCheckoutValidationState = () => {
    if (cart.length === 0) {
      return {
        isValid: false,
        reason: 'empty_cart',
        btnLabel: language === 'ur' ? 'بل خالی ہے' : 'Bill is empty',
        btnColor: theme.border,
        textColor: theme.textMuted,
        icon: 'receipt-outline',
      };
    }

    const tenderNum =
      tenderedCash !== '' && !isNaN(Number(tenderedCash))
        ? Math.max(0, parseFloat(tenderedCash))
        : paymentMethod === 'cash'
        ? grandTotal
        : 0;

    const baki = Math.max(0, grandTotal - tenderNum);
    const hasCustomer =
      !!selectedKhataCustomer ||
      customerName.trim().length > 0 ||
      customerPhone.trim().length > 0;

    if (baki > 0) {
      if (!hasCustomer) {
        return {
          isValid: false,
          reason: 'udhaar_missing_customer',
          btnLabel:
            language === 'ur'
              ? `گاہک منتخب کریں · باقی ${settings.currencySymbol}${baki.toLocaleString()}`
              : `Select Customer · Baki ${settings.currencySymbol}${baki.toLocaleString()}`,
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
        reason: 'split_ready',
        btnLabel:
          tenderNum > 0
            ? language === 'ur'
              ? `بل مکمل کریں · وصول ${settings.currencySymbol}${tenderNum.toLocaleString()} (باقی ${settings.currencySymbol}${baki.toLocaleString()})`
              : `Bill Mukammal Karein · Paid ${settings.currencySymbol}${tenderNum.toLocaleString()} (Baki ${settings.currencySymbol}${baki.toLocaleString()})`
            : language === 'ur'
              ? `ادھار بل مکمل کریں · ${cName}`
              : `Bill Mukammal Karein · Udhaar (${cName})`,
        btnColor: theme.primary,
        textColor: '#FFFFFF',
        icon: 'checkmark-circle',
      };
    }

    // Fully paid cash sale (baki === 0)
    return {
      isValid: true,
      reason: 'cash_exact',
      btnLabel:
        language === 'ur'
          ? `بل مکمل کریں · نقد ${settings.currencySymbol}${grandTotal.toLocaleString()}`
          : `Bill Mukammal Karein · ${settings.currencySymbol}${grandTotal.toLocaleString()}`,
      btnColor: theme.primary,
      textColor: '#FFFFFF',
      icon: 'checkmark-circle',
    };
  };

  const finalizeSuccessFeedback = (
    sale: any,
    finalAmount: number,
    method: 'cash' | 'udhaar',
    cName?: string
  ) => {
    const wasBohani = isFirstSaleOfDay;
    const completedSaleObj = sale ? { ...sale, isBohani: wasBohani } : null;

    setLastCompletedSale(completedSaleObj);
    setShowSuccessToast(true);

    if (settings.enableSound !== false) {
      announceBoltaGalla({
        amount: finalAmount,
        method,
        customerName: cName,
        language: language === 'ur' ? 'ur' : 'en',
      });
    }

    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setShowSuccessToast(false);
    }, wasBohani ? 14000 : 8000);
  };

  const buildCounterCartItem = (
    amount: number,
    label?: { en: string; ur: string }
  ): CartItem => {
    const itemId = 'custom-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
    return {
      product: {
        id: itemId,
        name: label?.en || 'Counter Item',
        nameUrdu: label?.ur || 'کاؤنٹر آئٹم',
        price: amount,
        costPrice: undefined,
        stock: 9999,
        category: 'Others',
        unit: 'piece',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      quantity: 1,
      unitPrice: amount,
      total: amount,
    };
  };

  const handleAddQuickAmount = (
    amount: number,
    label?: { en: string; ur: string }
  ) => {
    if (amount <= 0) return;
    setCart((prev) => [...prev, buildCounterCartItem(amount, label)]);
  };

  const commitPendingEntryToCart = (
    pendingAmount: number,
    label?: { en: string; ur: string }
  ): CartItem[] => {
    if (pendingAmount <= 0) return cart;
    const nextItem = buildCounterCartItem(pendingAmount, label);
    const nextCart = [...cart, nextItem];
    setCart(nextCart);
    setCalcEntry('');
    return nextCart;
  };

  const handleInstantCashFromPad = async (
    pendingAmount: number,
    label?: { en: string; ur: string }
  ) => {
    if (isProcessing) return;
    const finalItems =
      pendingAmount > 0
        ? [...cart, buildCounterCartItem(pendingAmount, label)]
        : [...cart];
    if (finalItems.length === 0) return;

    const finalSubtotal = finalItems.reduce((sum, it) => sum + it.total, 0);
    const rawDisc = parseFloat(discount) || 0;
    const finalDisc =
      discountType === 'percent'
        ? Math.round((finalSubtotal * rawDisc) / 100)
        : rawDisc;
    const finalGrandTotal = Math.max(0, finalSubtotal - finalDisc);

    setIsProcessing(true);
    try {
      const result = await completeSale({
        items: finalItems,
        discount: rawDisc,
        discountType,
        paymentMethod: 'cash',
        tenderedCash: finalGrandTotal,
      });
      if (!result.success) {
        showAlert({
          type: 'error',
          title: t('warningAlert'),
          message: result.error || 'Failed to complete sale',
        });
        return;
      }
      finalizeSuccessFeedback(result.sale, finalGrandTotal, 'cash');
      clearCart();
    } catch (e: any) {
      console.error(e);
      showAlert({
        type: 'error',
        title: t('warningAlert'),
        message: e?.message || 'Failed to complete sale',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartUdhaarFromPad = (
    pendingAmount: number,
    label?: { en: string; ur: string }
  ) => {
    const nextCart = commitPendingEntryToCart(pendingAmount, label);
    if (nextCart.length === 0) return;
    setIsUdhaarSheetOpen(true);
  };

  const handleConfirmUdhaarSheet = async (payload: UdhaarConfirmPayload) => {
    if (isProcessing || cart.length === 0) return;
    const cashPaid = Math.max(0, Math.min(grandTotal, payload.cashPaid));
    const baki = Math.max(0, grandTotal - cashPaid);
    const resolvedMethod: PaymentMethod = baki > 0 ? 'udhaar' : 'cash';

    setIsProcessing(true);
    try {
      const result = await completeSale({
        customerId: payload.selectedCustomer?.id,
        customerName: payload.customerName || undefined,
        customerPhone: payload.customerPhone || undefined,
        items: cart,
        discount: parsedDiscount,
        discountType,
        paymentMethod: resolvedMethod,
        tenderedCash: cashPaid,
      });

      if (!result.success) {
        showAlert({
          type: 'error',
          title: t('warningAlert'),
          message: result.error || 'Failed to save Udhaar bill',
        });
        return;
      }

      setIsUdhaarSheetOpen(false);
      finalizeSuccessFeedback(
        result.sale,
        grandTotal,
        resolvedMethod,
        payload.customerName || undefined
      );
      clearCart();
    } catch (e: any) {
      console.error(e);
      showAlert({
        type: 'error',
        title: t('warningAlert'),
        message: e?.message || 'Failed to save Udhaar bill',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenOptionsFromPad = (
    pendingAmount: number,
    label?: { en: string; ur: string }
  ) => {
    const nextCart = commitPendingEntryToCart(pendingAmount, label);
    const nextSub = nextCart.reduce((sum, it) => sum + it.total, 0);
    if (!tenderedCash || tenderedCash === '0') {
      setTenderedCash(nextSub.toString());
    }
    if (!isWideScreen) {
      setIsCheckoutDrawerOpen(true);
    }
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

    const tenderNum =
      tenderedCash !== '' && !isNaN(Number(tenderedCash))
        ? Math.max(0, parseFloat(tenderedCash))
        : paymentMethod === 'cash'
        ? grandTotal
        : 0;

    const baki = Math.max(0, grandTotal - tenderNum);
    const hasCustomer =
      !!selectedKhataCustomer ||
      customerName.trim().length > 0 ||
      customerPhone.trim().length > 0;

    if (baki > 0 && !hasCustomer) {
      setPaymentMethod('udhaar');
      setIsAddingNewCustomer(false);
      showAlert({
        type: 'warning',
        title: language === 'ur' ? 'گاہک کا انتخاب ضروری ہے' : 'Customer Required',
        message:
          language === 'ur'
            ? `باقی رقم ${settings.currencySymbol}${baki.toLocaleString()} ادھار کھاتہ میں ڈالنے کے لیے براہ کرم گاہک منتخب کریں۔`
            : `Please select or add a customer to put the remaining ${settings.currencySymbol}${baki.toLocaleString()} on credit / Khata.`,
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
        paymentMethod: baki > 0 ? 'udhaar' : 'cash',
        tenderedCash: tenderNum,
      });

      if (!result.success) {
        showAlert({
          type: 'error',
          title: t('warningAlert'),
          message: result.error || 'Failed to complete sale',
        });
        return;
      }

      finalizeSuccessFeedback(
        result.sale,
        grandTotal,
        paymentMethod === 'udhaar' ? 'udhaar' : 'cash',
        selectedKhataCustomer?.name || customerName.trim()
      );

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
            {language === 'ur' ? 'موجودہ بل' : 'Current bill'}
            {totalItemsCount > 0 ? ` · ${totalItemsCount}` : ''}
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

                  <View style={styles.itemStepperWrap}>
                    <Pressable
                      onPress={() => updateQuantity(item.product.id, -1)}
                      accessibilityLabel={item.quantity === 1 ? `Remove ${item.product.name} from bill` : `Decrease quantity of ${item.product.name}`}
                      accessibilityRole="button"
                      style={[styles.smallStepBtn, { backgroundColor: theme.card, borderColor: theme.border }]}>
                      <Ionicons
                        name={item.quantity === 1 ? 'trash-outline' : 'remove'}
                        size={item.quantity === 1 ? 14 : 16}
                        color={item.quantity === 1 ? theme.danger : theme.text}
                      />
                    </Pressable>
                    <Pressable
                      onPress={() => openLooseWeightModal(item.product, item.quantity)}
                      accessibilityLabel={`Change quantity for ${item.product.name}`}
                      accessibilityRole="button"
                      style={({ pressed }) => [
                        styles.smallStepQtyBox,
                        {
                          backgroundColor: settings.darkMode ? theme.card : '#FFFFFF',
                          borderColor: settings.darkMode ? 'rgba(255,255,255,0.18)' : '#CBD5E1',
                        },
                        pressed && { opacity: 0.7 },
                      ]}>
                      <Text style={[styles.smallStepQty, { color: theme.text }]}>
                        {item.quantity}
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => updateQuantity(item.product.id, 1)}
                      accessibilityLabel={`Increase quantity of ${item.product.name}`}
                      accessibilityRole="button"
                      style={[styles.smallStepBtn, { backgroundColor: theme.card, borderColor: theme.border }]}>
                      <Ionicons name="add" size={16} color={theme.text} />
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

        {/* AI-02: Associative Basket Companion Intelligence ("Bhai ke sath aur kya?") */}
        {cart.length > 0 && companionSuggestions.length > 0 && (
          <View
            style={[
              styles.companionPanel,
              {
                backgroundColor: settings.darkMode ? 'rgba(99, 102, 241, 0.12)' : '#EEF2FF',
                borderColor: settings.darkMode ? 'rgba(99, 102, 241, 0.4)' : '#C7D2FE',
              },
            ]}>
            <View style={styles.companionHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Ionicons name="sparkles" size={14} color="#6366F1" />
                <Text style={[styles.companionTitle, { color: settings.darkMode ? '#A5B4FC' : '#3730A3' }]}>
                  {language === 'ur' ? 'ساتھ اکثر خریدا جاتا ہے' : 'Often bought together'}
                </Text>
              </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.companionChipsRow}>
              {companionSuggestions.map((prod) => (
                <Pressable
                  key={prod.id}
                  onPress={() => addToCart(prod, 1)}
                  style={({ pressed }) => [
                    styles.companionChip,
                    {
                      backgroundColor: settings.darkMode ? '#1E293B' : '#FFFFFF',
                      borderColor: settings.darkMode ? 'rgba(255, 255, 255, 0.12)' : '#E2E8F0',
                    },
                    pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] },
                  ]}>
                  <Ionicons name="add-circle" size={14} color="#6366F1" />
                  <Text style={[styles.companionChipText, { color: theme.text }]}>
                    {getProductName(prod)}
                  </Text>
                  <Text style={[styles.companionChipPrice, { color: '#6366F1' }]}>
                    {settings.currencySymbol}{prod.price}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* 1) Split / Cash / Udhaar Payment Section */}
        {cart.length > 0 && (() => {
          const tenderVal =
            tenderedCash !== '' && !isNaN(Number(tenderedCash))
              ? Math.max(0, parseFloat(tenderedCash))
              : paymentMethod === 'cash'
              ? grandTotal
              : 0;
          const bakiAmount = Math.max(0, grandTotal - tenderVal);
          const changeAmount = Math.max(0, tenderVal - grandTotal);
          const isFullCash = bakiAmount === 0 && tenderVal >= grandTotal;
          const isFullUdhaar = tenderVal === 0;
          const isSplit = tenderVal > 0 && bakiAmount > 0;

          return (
            <View style={styles.saleTypeBlock}>
              <Text style={[styles.sheetSectionLabel, { color: theme.textMuted }]}>
                {language === 'ur' ? '1 · ادائیگی (نقد / ادھار)' : '1 · Payment (Cash / Split / Udhaar)'}
              </Text>

              {/* Quick Split Buttons */}
              <View style={styles.quickSplitRow}>
                <Pressable
                  onPress={() => {
                    setTenderedCash(grandTotal.toString());
                    setPaymentMethod('cash');
                  }}
                  style={({ pressed }) => [
                    styles.quickSplitBtn,
                    isFullCash
                      ? { backgroundColor: '#059669', borderColor: '#059669' }
                      : { backgroundColor: settings.darkMode ? theme.card : '#FFFFFF', borderColor: settings.darkMode ? 'rgba(255,255,255,0.15)' : '#CBD5E1' },
                    pressed && { opacity: 0.85 },
                  ]}>
                  <Ionicons
                    name="cash"
                    size={17}
                    color={isFullCash ? '#FFFFFF' : '#059669'}
                  />
                  <Text
                    style={[
                      styles.quickSplitBtnText,
                      { color: isFullCash ? '#FFFFFF' : theme.text },
                    ]}>
                    {language === 'ur' ? 'پورا نقد' : 'Pura Naqad'}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    const half = Math.round(grandTotal / 2);
                    setTenderedCash(half.toString());
                    setPaymentMethod('udhaar');
                  }}
                  style={({ pressed }) => [
                    styles.quickSplitBtn,
                    isSplit
                      ? { backgroundColor: '#0284C7', borderColor: '#0284C7' }
                      : { backgroundColor: settings.darkMode ? theme.card : '#FFFFFF', borderColor: settings.darkMode ? 'rgba(255,255,255,0.15)' : '#CBD5E1' },
                    pressed && { opacity: 0.85 },
                  ]}>
                  <Ionicons
                    name="pie-chart-outline"
                    size={17}
                    color={isSplit ? '#FFFFFF' : '#0284C7'}
                  />
                  <Text
                    style={[
                      styles.quickSplitBtnText,
                      { color: isSplit ? '#FFFFFF' : theme.text },
                    ]}>
                    {language === 'ur' ? 'آدھا (50%)' : 'Aadha'}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setTenderedCash('0');
                    setPaymentMethod('udhaar');
                  }}
                  style={({ pressed }) => [
                    styles.quickSplitBtn,
                    isFullUdhaar
                      ? { backgroundColor: '#DC2626', borderColor: '#DC2626' }
                      : { backgroundColor: settings.darkMode ? theme.card : '#FFFFFF', borderColor: settings.darkMode ? 'rgba(255,255,255,0.15)' : '#CBD5E1' },
                    pressed && { opacity: 0.85 },
                  ]}>
                  <Ionicons
                    name="book"
                    size={17}
                    color={isFullUdhaar ? '#FFFFFF' : '#DC2626'}
                  />
                  <Text
                    style={[
                      styles.quickSplitBtnText,
                      { color: isFullUdhaar ? '#FFFFFF' : theme.text },
                    ]}>
                    {language === 'ur' ? 'پورا ادھار' : 'Pura Udhaar'}
                  </Text>
                </Pressable>
              </View>

              {/* Amount Received (Naqad) Field */}
              <View
                style={[
                  styles.amountReceivedCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: bakiAmount > 0 ? '#FCA5A5' : '#10B981',
                  },
                ]}>
                <Text style={[styles.amountReceivedLabel, { color: theme.textMuted }]}>
                  {language === 'ur' ? 'وصول رقم (نقد / Amount Received)' : 'Amount Received (Naqad)'}
                </Text>
                <View style={styles.amountReceivedInputRow}>
                  <Text style={[styles.currencyPrefix, { color: '#059669' }]}>
                    {settings.currencySymbol}
                  </Text>
                  <TextInput
                    style={[styles.amountReceivedInput, { color: theme.text }]}
                    placeholder={grandTotal.toString()}
                    placeholderTextColor={theme.textMuted}
                    keyboardType="numeric"
                    value={tenderedCash}
                    onChangeText={(val) => {
                      setTenderedCash(val);
                      const n = parseFloat(val) || 0;
                      if (n < grandTotal) {
                        setPaymentMethod('udhaar');
                      } else if (n >= grandTotal && paymentMethod === 'udhaar' && !selectedKhataCustomer) {
                        setPaymentMethod('cash');
                      }
                    }}
                    selectTextOnFocus
                  />
                </View>

                {/* Live Baki / Change Pill */}
                {bakiAmount > 0 ? (
                  <View style={[styles.splitIndicatorPill, { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' }]}>
                    <Ionicons name="alert-circle" size={17} color="#DC2626" />
                    <Text style={[styles.splitIndicatorText, { color: '#DC2626' }]}>
                      {language === 'ur' ? 'باقی ادھار کھاتہ:' : 'Baki / Udhaar:'}{' '}
                      <Text style={{ fontWeight: '800' }}>
                        {settings.currencySymbol}{bakiAmount.toLocaleString()}
                      </Text>
                    </Text>
                  </View>
                ) : changeAmount > 0 ? (
                  <View style={[styles.splitIndicatorPill, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
                    <Ionicons name="arrow-undo-circle" size={17} color="#2563EB" />
                    <Text style={[styles.splitIndicatorText, { color: '#2563EB' }]}>
                      {language === 'ur' ? 'بقایا واپس (Change):' : 'Change Return:'}{' '}
                      <Text style={{ fontWeight: '800' }}>
                        {settings.currencySymbol}{changeAmount.toLocaleString()}
                      </Text>
                    </Text>
                  </View>
                ) : (
                  <View style={[styles.splitIndicatorPill, { backgroundColor: '#D1FAE5', borderColor: '#6EE7B7' }]}>
                    <Ionicons name="checkmark-circle" size={17} color="#059669" />
                    <Text style={[styles.splitIndicatorText, { color: '#059669' }]}>
                      {language === 'ur' ? 'پورا نقد ادا شدہ' : 'Fully Paid in Cash'}
                    </Text>
                  </View>
                )}
              </View>

              {/* 2) Customer Picker — automatically visible whenever baki > 0 or paymentMethod === 'udhaar' */}
              {(bakiAmount > 0 || paymentMethod === 'udhaar') && (
                <View style={[styles.contextPanel, { backgroundColor: theme.surfaceSubtle, borderColor: bakiAmount > 0 && !selectedKhataCustomer ? '#DC2626' : theme.border, marginTop: 10 }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={[styles.sheetSectionLabel, { color: bakiAmount > 0 ? '#DC2626' : theme.textMuted, marginBottom: 0 }]}>
                      {language === 'ur' ? '2 · گاہک کا کھاتہ *' : '2 · Customer Khata *'}
                    </Text>
                    {bakiAmount > 0 && (
                      <Text style={{ fontSize: 11, fontWeight: '700', color: '#DC2626' }}>
                        {language === 'ur' ? `(باقی Rs. ${bakiAmount.toLocaleString()} کے لیے لازمی)` : `(Required for Rs. ${bakiAmount.toLocaleString()} Udhaar)`}
                      </Text>
                    )}
                  </View>

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
                          <Text style={[styles.selectedCustomerName, { color: theme.text }]} numberOfLines={1}>
                            {selectedKhataCustomer.name}
                          </Text>
                          <Text style={[styles.selectedCustomerPhone, { color: theme.textMuted }]}>
                            {selectedKhataCustomer.phone || (language === 'ur' ? 'فون نہیں' : 'No phone')}
                          </Text>
                        </View>
                        <Pressable
                          onPress={handleClearSelectedCustomer}
                          style={[
                            styles.customerChangeBtn,
                            { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
                          ]}>
                          <Text style={[styles.customerChangeText, { color: theme.primary }]}>
                            {language === 'ur' ? 'تبدیل' : 'Change'}
                          </Text>
                        </Pressable>
                      </View>

                      <View style={[styles.balancePreviewRow, { borderTopColor: theme.border }]}>
                        <View style={styles.balancePreviewCol}>
                          <Text style={[styles.balancePreviewLabel, { color: theme.textMuted }]}>
                            {language === 'ur' ? 'موجودہ ادھار' : 'Current due'}
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
                              ? `${settings.currencySymbol} ${Math.abs(selectedKhataCustomer.totalDebt).toLocaleString()} (Adv)`
                              : (language === 'ur' ? 'صاف' : 'Settled')}
                          </Text>
                        </View>
                        <Ionicons name="arrow-forward" size={14} color={theme.textMuted} />
                        <View style={styles.balancePreviewCol}>
                          <Text style={[styles.balancePreviewLabel, { color: theme.textMuted }]}>
                            {language === 'ur' ? 'نیا بقایا' : 'New due'}
                          </Text>
                          <Text style={[styles.balancePreviewVal, { color: theme.danger, fontWeight: '800' }]}>
                            {settings.currencySymbol} {((selectedKhataCustomer.totalDebt || 0) + (bakiAmount > 0 ? bakiAmount : grandTotal)).toLocaleString()}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ) : isAddingNewCustomer ? (
                    <View style={{ gap: 8, marginTop: 2 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: theme.primary }}>
                          {language === 'ur' ? 'نیا گاہک' : 'New customer'}
                        </Text>
                        <Pressable onPress={() => setIsAddingNewCustomer(false)} hitSlop={8}>
                          <Text style={{ fontSize: 11, color: theme.textMuted }}>
                            {language === 'ur' ? 'تلاش' : 'Search'}
                          </Text>
                        </Pressable>
                      </View>
                      <TextInput
                        style={[styles.formInput, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
                        placeholder={language === 'ur' ? 'نام *' : 'Name *'}
                        placeholderTextColor={theme.textMuted}
                        value={customerName}
                        onChangeText={setCustomerName}
                        autoFocus
                      />
                      <TextInput
                        style={[styles.formInput, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
                        placeholder={language === 'ur' ? 'فون / واٹس ایپ *' : 'Phone / WhatsApp *'}
                        placeholderTextColor={theme.textMuted}
                        keyboardType="phone-pad"
                        value={customerPhone}
                        onChangeText={setCustomerPhone}
                      />
                    </View>
                  ) : (
                    <View style={{ gap: 8 }}>
                      <View
                        style={[
                          styles.customerSearchWrap,
                          { backgroundColor: theme.card, borderColor: theme.border },
                        ]}>
                        <Ionicons name="search-outline" size={16} color={theme.textMuted} />
                        <TextInput
                          style={[styles.customerSearchInput, { color: theme.text }]}
                          placeholder={language === 'ur' ? 'نام یا فون تلاش کریں...' : 'Search name or phone...'}
                          placeholderTextColor={theme.textMuted}
                          value={customerSearchQuery}
                          onChangeText={setCustomerSearchQuery}
                        />
                        {customerSearchQuery.length > 0 && (
                          <Pressable onPress={() => setCustomerSearchQuery('')} style={{ padding: 4 }}>
                            <Ionicons name="close-circle" size={16} color={theme.textMuted} />
                          </Pressable>
                        )}
                      </View>

                      {customerSearchQuery.trim().length > 0 ? (
                        <View style={[styles.suggestionsList, { backgroundColor: theme.card, borderColor: theme.border }]}>
                          {matchingKhataCustomers.map((cust) => (
                            <Pressable
                              key={cust.id}
                              onPress={() => handleSelectKhataCustomer(cust)}
                              style={[styles.suggestionRow, { borderBottomColor: theme.border }]}>
                              <View style={{ flex: 1 }}>
                                <Text style={[styles.suggestionName, { color: theme.text }]}>{cust.name}</Text>
                                <Text style={[styles.suggestionPhone, { color: theme.textMuted }]}>
                                  {cust.phone || (language === 'ur' ? 'فون نہیں' : 'No phone')}
                                </Text>
                              </View>
                              {cust.totalDebt > 0 && (
                                <Text style={{ fontSize: 11, fontWeight: '700', color: theme.danger }}>
                                  {settings.currencySymbol}{cust.totalDebt}
                                </Text>
                              )}
                            </Pressable>
                          ))}
                          <Pressable
                            onPress={() => handleStartNewCustomer(customerSearchQuery.trim())}
                            style={[styles.createCustomerRow, { backgroundColor: theme.primaryLight }]}>
                            <Ionicons name="person-add" size={15} color={theme.primary} />
                            <Text style={[styles.createCustomerRowText, { color: theme.primary }]}>
                              {language === 'ur'
                                ? `نیا گاہک: "${customerSearchQuery.trim()}"`
                                : `Add "${customerSearchQuery.trim()}"`}
                            </Text>
                          </Pressable>
                        </View>
                      ) : (
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          nestedScrollEnabled
                          contentContainerStyle={styles.khataChipsContent}>
                          <Pressable
                            onPress={() => handleStartNewCustomer('')}
                            style={[styles.khataChip, { backgroundColor: theme.primary, borderColor: theme.primary }]}>
                            <Ionicons name="person-add" size={13} color="#FFFFFF" />
                            <Text style={[styles.khataChipName, { color: '#FFFFFF', fontWeight: '700' }]}>
                              {language === 'ur' ? '+ نیا' : '+ New'}
                            </Text>
                          </Pressable>
                          {recentKhataCustomers.map((cust) => (
                            <Pressable
                              key={cust.id}
                              onPress={() => handleSelectKhataCustomer(cust)}
                              style={[styles.khataChip, { backgroundColor: theme.card, borderColor: theme.border }]}>
                              <Text style={[styles.khataChipName, { color: theme.text }]}>{cust.name}</Text>
                              {cust.totalDebt > 0 && (
                                <Text style={{ fontSize: 10, color: theme.danger, fontWeight: '700' }}>
                                  {settings.currencySymbol}{cust.totalDebt}
                                </Text>
                              )}
                            </Pressable>
                          ))}
                        </ScrollView>
                      )}
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })()}

        {/* 2/3) Discount — optional */}
        {cart.length > 0 && (
          <View style={[styles.discountRow, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
            <View style={styles.discountRowHeader}>
              <Ionicons name="pricetag-outline" size={14} color={theme.textMuted} />
              <Text style={[styles.discountRowLabel, { color: theme.textMuted }]}>
                {language === 'ur'
                  ? `${paymentMethod === 'udhaar' ? '3' : '2'} · رعایت (اختیاری)`
                  : `${paymentMethod === 'udhaar' ? '3' : '2'} · Discount (optional)`}
              </Text>
              {discountAmount > 0 && (
                <Text style={[styles.discountSavedBadge, { color: theme.success, backgroundColor: theme.successLight }]}>
                  -{settings.currencySymbol}{discountAmount}
                </Text>
              )}
            </View>
            <View style={styles.discountInputRow}>
              <Pressable
                onPress={() => {
                  setDiscountType((prev) => (prev === 'fixed' ? 'percent' : 'fixed'));
                  setDiscount('');
                }}
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
                placeholder="0"
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
                      style={[
                        styles.discShortcutBtn,
                        {
                          backgroundColor: isSelected ? theme.primary : theme.card,
                          borderColor: isSelected ? theme.primary : 'transparent',
                        },
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

        {/* 3) Receipt phone — optional (paid only) */}
        {cart.length > 0 && paymentMethod !== 'udhaar' && (
          <View style={styles.optionalPhoneBlock}>
            <Text style={[styles.sheetSectionLabel, { color: theme.textMuted }]}>
              {language === 'ur' ? '3 · رسید (اختیاری)' : '3 · Receipt (optional)'}
            </Text>
            <View style={[styles.optionalPhoneRow, { borderColor: theme.border, backgroundColor: theme.surfaceSubtle }]}>
              <Ionicons name="logo-whatsapp" size={16} color={theme.textMuted} />
              <TextInput
                style={[styles.optionalPhoneInput, { color: theme.text }]}
                placeholder={language === 'ur' ? 'واٹس ایپ نمبر' : 'WhatsApp number'}
                placeholderTextColor={theme.textMuted}
                keyboardType="phone-pad"
                value={customerPhone}
                onChangeText={setCustomerPhone}
              />
            </View>
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
            paddingBottom: Math.max(insets.bottom, Platform.OS === 'android' ? 32 : 16) + 12,
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
              {language === 'ur' ? 'کل' : 'Total'}
              {totalItemsCount > 0
                ? ` · ${totalItemsCount} ${language === 'ur' ? 'اشیاء' : totalItemsCount === 1 ? 'item' : 'items'}`
                : ''}
            </Text>
            {discountAmount > 0 ? (
              <Text style={[styles.subtotalLine, { color: theme.textMuted }]} numberOfLines={1}>
                {settings.currencySymbol}{formatCompactPrice(subtotal)} − {settings.currencySymbol}{formatCompactPrice(discountAmount)}
              </Text>
            ) : null}
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
            <View style={{ position: 'relative' }}>
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
            </View>
          );
        })()}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {!isModal && !isBarcodeScannerActive && (
        <SubScreenHeader
          title={language === 'ur' ? 'نیا بل' : 'New Bill'}
          subtitle={`${products.length} ${language === 'ur' ? 'اشیاء' : products.length === 1 ? 'item' : 'items'}`}
          onBack={() => setActiveTab('dashboard')}
        />
      )}
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
        {/* ================= Counter Section ================= */}
        <View
          style={styles.catalogSection}
          onLayout={(e) => setCounterAreaHeight(e.nativeEvent.layout.height)}>
          {isBarcodeScannerActive ? (
            <SaleBarcodeScannerSection
              onClose={() => setIsBarcodeScannerActive(false)}
              onAddToCart={(p, q) => addToCart(p, q || 1)}
              onUpdateQuantity={updateQuantity}
              onRemoveFromCart={removeFromCart}
              cart={cart}
              grandTotal={grandTotal}
              totalItemsCount={totalItemsCount}
              onOpenCurrentBill={openCheckoutDrawer}
              onHoldCart={handleHoldCart}
              onClearCart={clearCart}
              onAddNewProductWithBarcode={(barcode) => {
                setEditingProduct({
                  id: 'prod-' + Date.now(),
                  name: '',
                  price: 0,
                  stock: 0,
                  category: 'Others',
                  unit: 'piece',
                  barcode,
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
                });
                setIsAddProductOpen(true);
              }}
            />
          ) : (
            <>
              <QuickBillPad
                cart={cart}
                cartTotal={subtotal}
                entry={calcEntry}
                onChangeEntry={setCalcEntry}
                onAddAmount={handleAddQuickAmount}
                onRemoveCartItem={removeFromCart}
                onInstantCash={handleInstantCashFromPad}
                onStartUdhaar={handleStartUdhaarFromPad}
                onOpenScanner={() => setIsBarcodeScannerActive(true)}
                onClearAll={clearCart}
                isProcessing={isProcessing}
              />

              <FloatingItemsBump
                containerHeight={counterAreaHeight}
                onPressOpen={() => setIsItemsSidebarOpen(true)}
              />
            </>
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


      {/* Right Slide-Over Items Sidebar */}
      <ItemsSidebarDrawer
        visible={isItemsSidebarOpen}
        products={products}
        cart={cart}
        billTotal={grandTotal}
        onAddProduct={(prod) => addToCart(prod, 1)}
        onUpdateQuantity={updateQuantity}
        onOpenScanner={() => setIsBarcodeScannerActive(true)}
        onClose={() => setIsItemsSidebarOpen(false)}
      />

      {/* Focused, Ultra-Simple Udhaar Bottom Sheet */}
      <UdhaarQuickSheet
        visible={isUdhaarSheetOpen}
        billTotal={grandTotal}
        customers={khata}
        isProcessing={isProcessing}
        onClose={() => setIsUdhaarSheetOpen(false)}
        onConfirm={handleConfirmUdhaarSheet}
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

      {/* ── Frictionless POS Held Cart Floating Toast with Instant Undo ── */}
      {heldCartToast && heldCartToast.visible && (
        <View
          style={[
            styles.heldToast,
            !isWideScreen && { top: 112, bottom: undefined },
            {
              backgroundColor: settings.darkMode ? '#78350F' : '#FEF3C7',
              borderColor: settings.darkMode ? '#F59E0B' : '#F59E0B',
            },
          ]}>
          <View style={styles.heldToastLeft}>
            <View style={[styles.heldToastIconBox, { backgroundColor: '#F59E0B' }]}>
              <Ionicons name="pause-circle" size={17} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text
                style={[
                  styles.heldToastTitle,
                  { color: settings.darkMode ? '#FDE68A' : '#92400E' },
                ]}
                numberOfLines={1}>
                {language === 'ur'
                  ? `بل عارضی محفوظ ہو گیا (${heldCartToast.itemsCount} اشیاء)`
                  : `Bill Parked (${heldCartToast.itemsCount} item${heldCartToast.itemsCount > 1 ? 's' : ''})`}
              </Text>
              <Text
                style={[
                  styles.heldToastSub,
                  { color: settings.darkMode ? '#FCD34D' : '#B45309' },
                ]}
                numberOfLines={1}>
                {language === 'ur'
                  ? 'اب اگلے گاہک کو سروس دیں۔'
                  : 'Ready for next customer.'}
              </Text>
            </View>
          </View>

          <View style={styles.heldToastActions}>
            <Pressable
              onPress={() => handleUndoHoldCart(heldCartToast.heldCart)}
              style={({ pressed }) => [
                styles.heldToastUndoBtn,
                { backgroundColor: '#F59E0B' },
                pressed && { opacity: 0.8 },
              ]}>
              <Ionicons name="arrow-undo" size={13} color="#FFFFFF" />
              <Text style={styles.heldToastUndoBtnText}>
                {language === 'ur' ? 'واپس' : 'Undo'}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setHeldCartToast(null)}
              hitSlop={8}
              style={{ padding: 4 }}>
              <Ionicons
                name="close"
                size={18}
                color={settings.darkMode ? '#FDE68A' : '#92400E'}
              />
            </Pressable>
          </View>
        </View>
      )}

      {/* ── Micro-Friction Eraser (MF-04): Post-Sale Success & Instant WhatsApp Banner ── */}
      {showSuccessToast && lastCompletedSale && (
        <View
          style={[
            styles.postSaleToast,
            !isWideScreen && { top: 112, bottom: undefined },
            lastCompletedSale.isBohani
              ? {
                  backgroundColor: '#064E3B',
                  borderColor: '#F59E0B',
                  borderWidth: 2,
                  paddingVertical: 12,
                }
              : { backgroundColor: '#064E3B', borderColor: '#10B981' },
          ]}>
          <View style={styles.postSaleToastLeft}>
            <View
              style={[
                styles.postSaleCheckCircle,
                lastCompletedSale.isBohani && { backgroundColor: '#F59E0B' },
              ]}>
              <Ionicons
                name={lastCompletedSale.isBohani ? 'sparkles' : 'checkmark'}
                size={16}
                color={lastCompletedSale.isBohani ? '#064E3B' : '#FFFFFF'}
              />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text
                style={[
                  styles.postSaleToastTitle,
                  lastCompletedSale.isBohani && { color: '#FDE68A', fontWeight: '800' },
                ]}
                numberOfLines={1}>
                {lastCompletedSale.isBohani
                  ? (language === 'ur' ? '🎉 مبارک ہو! پہلی بوہنی مکمل ہوئی' : '🎉 Pehli Bohani Mubarak!')
                  : (language === 'ur' ? 'بل مکمل ہو گیا!' : 'Sale Completed!')}
              </Text>
              <Text style={styles.postSaleToastSub} numberOfLines={1}>
                {lastCompletedSale.isBohani
                  ? (language === 'ur' ? 'یا اللہ رزق میں برکت و وسعت عطا فرما (آمین)' : 'May Allah bless your trade with abundance & barakah')
                  : `${lastCompletedSale.billNumber ? `#${lastCompletedSale.billNumber} • ` : ''}${settings.currencySymbol}${lastCompletedSale.grandTotal.toLocaleString()}${lastCompletedSale.customerName ? ` • ${lastCompletedSale.customerName}` : ''}`}
              </Text>
            </View>
          </View>

          <View style={styles.postSaleToastActions}>
            {/* VU-01: WhatsApp Status Share Button for Pehli Bohani */}
            {lastCompletedSale.isBohani && (
              <Pressable
                onPress={() => {
                  const bohaniText = buildBohaniShareText({
                    shopName: settings.shopName || (user?.displayName ? `${user.displayName}'s Store` : 'My Store'),
                    shopNameUrdu: settings.shopNameUrdu,
                    amount: lastCompletedSale.grandTotal,
                    currencySymbol: settings.currencySymbol,
                    isUrdu: language === 'ur',
                  });
                  openWhatsAppWithMessage(undefined, bohaniText);
                }}
                style={({ pressed }) => [
                  styles.toastActionBtn,
                  { backgroundColor: '#F59E0B' },
                  pressed && { opacity: 0.8 },
                ]}>
                <Ionicons name="sparkles" size={13} color="#064E3B" />
                <Text style={[styles.toastActionBtnText, { color: '#064E3B', fontWeight: '800' }]}>
                  {language === 'ur' ? 'بوہنی اسٹیٹس' : 'Status'}
                </Text>
              </Pressable>
            )}

            {/* View Receipt Button */}
            <Pressable
              onPress={() => {
                setActiveReceipt(lastCompletedSale);
                setShowSuccessToast(false);
              }}
              style={({ pressed }) => [
                styles.toastActionBtn,
                { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                pressed && { opacity: 0.8 },
              ]}>
              <Ionicons name="receipt-outline" size={13} color="#FFFFFF" />
              <Text style={styles.toastActionBtnText}>
                {language === 'ur' ? 'رسید' : 'Receipt'}
              </Text>
            </Pressable>

            {/* Direct WhatsApp Share Button */}
            <Pressable
              onPress={() => {
                openWhatsAppReceipt(lastCompletedSale, settings, language);
              }}
              style={({ pressed }) => [
                styles.toastActionBtn,
                { backgroundColor: '#25D366' },
                pressed && { opacity: 0.8 },
              ]}>
              <Ionicons name="logo-whatsapp" size={13} color="#FFFFFF" />
              <Text style={[styles.toastActionBtnText, { color: '#FFFFFF' }]}>
                {language === 'ur' ? 'واٹس ایپ' : 'WhatsApp'}
              </Text>
            </Pressable>

            {/* Dismiss Button */}
            <Pressable
              onPress={() => setShowSuccessToast(false)}
              hitSlop={8}
              style={{ padding: 4 }}>
              <Ionicons name="close" size={18} color="rgba(255, 255, 255, 0.7)" />
            </Pressable>
          </View>
        </View>
      )}
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
  topSection: {
    width: '100%',
    maxWidth: 720,
    marginHorizontal: 'auto',
    paddingHorizontal: Spacing.lg,
    paddingTop: 8,
    paddingBottom: 4,
    gap: 10,
  },
  collapsibleTopCards: {
    width: '100%',
    overflow: 'hidden',
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
  catalogItemsWrap: {
    flex: 1,
    width: '100%',
    maxWidth: 720,
    marginHorizontal: 'auto',
    paddingHorizontal: Spacing.md,
    paddingTop: 4,
  },
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
  catalogScrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.xl,
  },
  catalogGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingBottom: Spacing.xl,
  },
  gridCard: {
    borderRadius: 14,
    borderCurve: 'continuous',
    padding: 10,
    justifyContent: 'space-between',
    minHeight: 98,
    position: 'relative',
    overflow: 'hidden',
  },
  listRowOnBill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1.5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    gap: 10,
    minHeight: 64,
  },
  listOnBillInfo: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  listOnBillMeta: {
    fontSize: 12,
    fontWeight: '600',
  },
  gridCardOnBill: {
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1.5,
    padding: 10,
    gap: 8,
    minHeight: 98,
    justifyContent: 'space-between',
  },
  gridOnBillTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gridOnBillPrice: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
  },
  gridOnBillActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  gridOnBillLine: {
    fontSize: 12,
    fontWeight: '700',
    flexShrink: 1,
  },
  qtyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.full,
    padding: 3,
    gap: 2,
    flexShrink: 0,
  },
  qtyPillBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyPillBtnPlus: {},
  qtyPillCount: {
    minWidth: 28,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyPillCountText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
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
  },
  cardAddBtnText: {
    fontSize: 10,
    fontWeight: '700',
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    minHeight: 64,
    gap: 8,
    borderRadius: 14,
    borderCurve: 'continuous',
    overflow: 'hidden',
    position: 'relative',
  },
  listThumbOuter: {
    width: 42,
    height: 42,
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
  listRowNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  listAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  listAddBtnText: {
    fontSize: 11,
    fontWeight: '800',
  },

  // Bottom Thumb-Zone Active POS Bill Bar
  topActiveBillCard: {
    marginHorizontal: Spacing.md,
    marginTop: 4,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderCurve: 'continuous',
    borderWidth: 1,
  },
  topBillMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  topBillBadgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  topBillLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  topBillBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.1,
  },
  topBillCountText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  topBillControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  topBillHoldBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  topBillHoldText: {
    fontSize: 11,
    fontWeight: '700',
  },
  topBillCancelBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  topBillActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  topBillAmountPressable: {
    flex: 1,
    justifyContent: 'center',
  },
  topBillTotalLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  topBillTotalValue: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  topBillCurrency: {
    fontSize: 13,
    fontWeight: '800',
  },
  topBillPayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
  },
  topBillPayBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },

  // Top Parked / Held Carts Banner
  topHeldBanner: {
    marginHorizontal: Spacing.md,
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topHeldBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  topHeldBadge: {
    backgroundColor: '#F59E0B',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  topHeldBadgeCount: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  topHeldBannerText: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  topHeldResumePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  topHeldResumeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706',
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
  smallStepQtyBox: {
    minWidth: 36,
    height: 32,
    paddingHorizontal: 6,
    borderRadius: 8,
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

  sheetSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  saleTypeBlock: {
    gap: 8,
  },
  saleTypeSeg: {
    flexDirection: 'row',
    gap: 10,
  },
  saleTypeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    minHeight: 64,
  },
  saleTypeIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saleTypeTextCol: {
    flex: 1,
    gap: 1,
  },
  saleTypeBtnText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  saleTypeBtnSub: {
    fontSize: 11,
    fontWeight: '600',
  },
  optionalPhoneBlock: {
    gap: 8,
  },
  optionalPhoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 44,
  },
  optionalPhoneInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 10,
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
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    ...Shadows.md,
  },
  quickSplitRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    marginBottom: 4,
  },
  quickSplitBtn: {
    flex: 1,
    minHeight: 54,
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 6,
    paddingVertical: 10,
  },
  quickSplitBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
  amountReceivedCard: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 12,
    marginTop: 8,
  },
  amountReceivedLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  amountReceivedInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  currencyPrefix: {
    fontSize: 22,
    fontWeight: '900',
  },
  amountReceivedInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '900',
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  splitIndicatorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  splitIndicatorText: {
    fontSize: 13,
    fontWeight: '600',
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
    justifyContent: 'space-between',
    rowGap: 8,
    width: '100%',
    marginVertical: 4,
  },
  smartTenderCol: {
    width: '48.5%',
    position: 'relative',
  },
  smartTenderCard: {
    width: '100%',
    minHeight: 54,
    paddingVertical: 10,
    paddingHorizontal: 8,
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
    textAlign: 'center',
  },
  smartTenderSub: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
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
  postSaleToast: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    zIndex: 9999,
    ...Shadows.lg,
  },
  postSaleToastLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  postSaleCheckCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postSaleToastTitle: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  postSaleToastSub: {
    color: '#D1FAE5',
    fontSize: 11.5,
    fontWeight: '600',
    marginTop: 1,
  },
  postSaleToastActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toastActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
  },
  toastActionBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
  },

  // Frictionless POS Parked Cart Toast
  heldToast: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    zIndex: 9999,
    ...Shadows.lg,
  },
  heldToastLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  heldToastIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heldToastTitle: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  heldToastSub: {
    fontSize: 11.5,
    fontWeight: '600',
    marginTop: 1,
  },
  heldToastActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heldToastUndoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  heldToastUndoBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },


  // AI-02: Associative Basket Companion Intelligence
  companionPanel: {
    marginHorizontal: Spacing.md,
    marginTop: 6,
    marginBottom: 8,
    padding: 10,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  companionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  companionTitle: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  companionChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 2,
  },
  companionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  companionChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  companionChipPrice: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  dockCompanionWrap: {
    borderBottomWidth: 1,
    paddingBottom: 2,
  },
  dockCompanionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  dockCompanionText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // AI-03: Khata Customer Routine Basket
  usualBasketBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  usualBasketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  usualBasketTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  addUsualBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#059669',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  addUsualBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  usualItemsChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  usualItemChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  modeSwitchWrap: {
    width: '100%',
    maxWidth: 640,
    marginHorizontal: 'auto',
    paddingHorizontal: Spacing.lg,
    paddingTop: 8,
    paddingBottom: 4,
  },
  modeSwitchTrack: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    padding: 4,
    gap: 4,
  },
  modeSwitchBtn: {
    flex: 1,
    height: 38,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  modeSwitchText: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  usualItemChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
