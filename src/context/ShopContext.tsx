import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Product,
  Sale,
  CartItem,
  CustomerKhata,
  ShopSettings,
  ActiveTab,
  PaymentMethod,
} from '@/types';
import { StorageAdapter } from '@/storage/storageAdapter';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_KHATA } from '@/constants/sampleData';
import { Translations, Language, TranslationKey } from '@/constants/translations';

interface ShopContextType {
  // Navigation
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;

  // Sales & Billing
  sales: Sale[];
  createSale: (params: {
    customerName?: string;
    customerPhone?: string;
    items: CartItem[];
    discount: number;
    discountType: 'fixed' | 'percent';
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => Promise<Sale>;
  deleteSale: (saleId: string) => Promise<void>;
  getSaleById: (id: string) => Sale | undefined;

  // Udhaar Khata
  khata: CustomerKhata[];
  addCustomerPayment: (customerId: string, amount: number, note?: string) => Promise<void>;
  totalUdhaarReceivable: number;

  // Settings
  settings: ShopSettings;
  updateSettings: (newSettings: Partial<ShopSettings>) => Promise<void>;
  resetToSampleData: () => Promise<void>;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => Promise<boolean>;

  // Localization
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;

  // Computed Metrics
  todaySalesTotal: number;
  todayOrdersCount: number;
  lowStockProducts: Product[];
  outOfStockProducts: Product[];

  // Modal Controls
  activeReceipt: Sale | null;
  setActiveReceipt: (sale: Sale | null) => void;
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  isAddProductOpen: boolean;
  setIsAddProductOpen: (open: boolean) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: '@shop_products_v1',
  SALES: '@shop_sales_v1',
  KHATA: '@shop_khata_v1',
  SETTINGS: '@shop_settings_v1',
  BILL_COUNTER: '@shop_bill_counter_v1',
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [khata, setKhata] = useState<CustomerKhata[]>([]);
  const [settings, setSettings] = useState<ShopSettings>(INITIAL_SETTINGS);
  const [billCounter, setBillCounter] = useState<number>(1001);
  const [isLoaded, setIsLoaded] = useState(false);

  // Modals state
  const [activeReceipt, setActiveReceipt] = useState<Sale | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // Load persistent state on boot
  useEffect(() => {
    async function loadData() {
      try {
        const [savedProds, savedSales, savedKhata, savedSettings, savedCounter] = await Promise.all([
          StorageAdapter.getItem(STORAGE_KEYS.PRODUCTS),
          StorageAdapter.getItem(STORAGE_KEYS.SALES),
          StorageAdapter.getItem(STORAGE_KEYS.KHATA),
          StorageAdapter.getItem(STORAGE_KEYS.SETTINGS),
          StorageAdapter.getItem(STORAGE_KEYS.BILL_COUNTER),
        ]);

        if (savedProds) {
          setProducts(JSON.parse(savedProds));
        } else {
          setProducts(INITIAL_PRODUCTS);
          await StorageAdapter.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
        }

        if (savedSales) {
          setSales(JSON.parse(savedSales));
        } else {
          setSales([]);
        }

        if (savedKhata) {
          setKhata(JSON.parse(savedKhata));
        } else {
          setKhata(INITIAL_KHATA);
          await StorageAdapter.setItem(STORAGE_KEYS.KHATA, JSON.stringify(INITIAL_KHATA));
        }

        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        } else {
          setSettings(INITIAL_SETTINGS);
          await StorageAdapter.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
        }

        if (savedCounter) {
          setBillCounter(parseInt(savedCounter, 10) || 1001);
        }
      } catch (e) {
        console.error('Error loading shop data from storage:', e);
        setProducts(INITIAL_PRODUCTS);
        setSettings(INITIAL_SETTINGS);
        setKhata(INITIAL_KHATA);
      } finally {
        setIsLoaded(true);
      }
    }

    loadData();
  }, []);

  // Save products whenever updated
  const saveProducts = useCallback(async (newProducts: Product[]) => {
    setProducts(newProducts);
    await StorageAdapter.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(newProducts));
  }, []);

  // Save sales whenever updated
  const saveSales = useCallback(async (newSales: Sale[]) => {
    setSales(newSales);
    await StorageAdapter.setItem(STORAGE_KEYS.SALES, JSON.stringify(newSales));
  }, []);

  // Save khata whenever updated
  const saveKhata = useCallback(async (newKhata: CustomerKhata[]) => {
    setKhata(newKhata);
    await StorageAdapter.setItem(STORAGE_KEYS.KHATA, JSON.stringify(newKhata));
  }, []);

  // Product CRUD
  const addProduct = useCallback(
    async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
      const newProduct: Product = {
        ...productData,
        id: 'prod-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const updated = [newProduct, ...products];
      await saveProducts(updated);
      return newProduct;
    },
    [products, saveProducts]
  );

  const updateProduct = useCallback(
    async (id: string, updates: Partial<Product>) => {
      const updated = products.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p
      );
      await saveProducts(updated);
    },
    [products, saveProducts]
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      const updated = products.filter((p) => p.id !== id);
      await saveProducts(updated);
    },
    [products, saveProducts]
  );

  const getProductById = useCallback(
    (id: string) => {
      return products.find((p) => p.id === id);
    },
    [products]
  );

  // Sales & Billing with automatic stock cut and Udhaar recording
  const createSale = useCallback(
    async ({
      customerName,
      customerPhone,
      items,
      discount,
      discountType,
      paymentMethod,
      notes,
    }: {
      customerName?: string;
      customerPhone?: string;
      items: CartItem[];
      discount: number;
      discountType: 'fixed' | 'percent';
      paymentMethod: PaymentMethod;
      notes?: string;
    }): Promise<Sale> => {
      // 1. Calculate totals
      const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      const discountAmount =
        discountType === 'percent' ? Math.round((subtotal * discount) / 100) : discount;
      const grandTotal = Math.max(0, subtotal - discountAmount);

      // Profit calculation
      const totalProfit = items.reduce((sum, item) => {
        const cost = item.product.costPrice || item.unitPrice * 0.8;
        return sum + (item.unitPrice - cost) * item.quantity;
      }, 0) - discountAmount;

      const currentCounter = billCounter;
      const nextCounter = currentCounter + 1;
      const billNumber = `INV-${currentCounter}`;

      const newSale: Sale = {
        id: 'sale-' + Date.now(),
        billNumber,
        date: new Date().toISOString(),
        customerName: customerName?.trim() || undefined,
        customerPhone: customerPhone?.trim() || undefined,
        items,
        subtotal,
        discount: discountAmount,
        discountType,
        grandTotal,
        totalProfit: Math.round(totalProfit),
        paymentMethod,
        notes,
        createdAt: Date.now(),
      };

      // 2. AUTOMATIC STOCK CUT: Deduct sold quantities from inventory
      const updatedProducts = products.map((prod) => {
        const soldItem = items.find((it) => it.product.id === prod.id);
        if (soldItem) {
          const newStock = Math.max(0, prod.stock - soldItem.quantity);
          return { ...prod, stock: newStock, updatedAt: Date.now() };
        }
        return prod;
      });

      // 3. IF PAYMENT IS UDHAAR: Automatically record in Udhaar Khata ledger
      let updatedKhata = [...khata];
      if (paymentMethod === 'udhaar' && (customerName || customerPhone)) {
        const custName = customerName?.trim() || 'Walk-in Customer';
        const custPhone = customerPhone?.trim() || '';

        // Find customer by phone or name
        const existingIndex = updatedKhata.findIndex(
          (k) => (custPhone && k.phone === custPhone) || k.name.toLowerCase() === custName.toLowerCase()
        );

        const newTx = {
          id: 'tx-' + Date.now(),
          date: new Date().toISOString(),
          type: 'credit_sale' as const,
          amount: grandTotal,
          billId: newSale.id,
          billNumber: newSale.billNumber,
          note: `Credit sale - Bill #${billNumber}`,
        };

        if (existingIndex >= 0) {
          const customer = updatedKhata[existingIndex];
          updatedKhata[existingIndex] = {
            ...customer,
            phone: custPhone || customer.phone,
            totalDebt: customer.totalDebt + grandTotal,
            transactions: [newTx, ...customer.transactions],
            lastUpdated: Date.now(),
          };
        } else {
          updatedKhata = [
            {
              id: 'cust-' + Date.now(),
              name: custName,
              phone: custPhone,
              totalDebt: grandTotal,
              transactions: [newTx],
              lastUpdated: Date.now(),
            },
            ...updatedKhata,
          ];
        }
      }

      // Save everything asynchronously
      setBillCounter(nextCounter);
      await Promise.all([
        saveProducts(updatedProducts),
        saveSales([newSale, ...sales]),
        saveKhata(updatedKhata),
        StorageAdapter.setItem(STORAGE_KEYS.BILL_COUNTER, nextCounter.toString()),
      ]);

      return newSale;
    },
    [billCounter, products, sales, khata, saveProducts, saveSales, saveKhata]
  );

  // Delete bill and AUTOMATICALLY RESTORE STOCK!
  const deleteSale = useCallback(
    async (saleId: string) => {
      const saleToDelete = sales.find((s) => s.id === saleId);
      if (!saleToDelete) return;

      // 1. RESTORE STOCK: Add back item quantities
      const updatedProducts = products.map((prod) => {
        const itemSold = saleToDelete.items.find((it) => it.product.id === prod.id);
        if (itemSold) {
          return { ...prod, stock: prod.stock + itemSold.quantity, updatedAt: Date.now() };
        }
        return prod;
      });

      // 2. If it was an Udhaar bill, remove or adjust the customer's khata debit
      let updatedKhata = khata;
      if (saleToDelete.paymentMethod === 'udhaar') {
        updatedKhata = khata
          .map((cust) => {
            const hasTx = cust.transactions.some((tx) => tx.billId === saleId);
            if (hasTx) {
              const remainingTx = cust.transactions.filter((tx) => tx.billId !== saleId);
              const newDebt = Math.max(0, cust.totalDebt - saleToDelete.grandTotal);
              return {
                ...cust,
                totalDebt: newDebt,
                transactions: remainingTx,
                lastUpdated: Date.now(),
              };
            }
            return cust;
          })
          .filter((cust) => cust.totalDebt > 0 || cust.transactions.length > 0);
      }

      // 3. Remove sale from sales list
      const updatedSales = sales.filter((s) => s.id !== saleId);

      await Promise.all([
        saveProducts(updatedProducts),
        saveSales(updatedSales),
        saveKhata(updatedKhata),
      ]);
    },
    [sales, products, khata, saveProducts, saveSales, saveKhata]
  );

  const getSaleById = useCallback(
    (id: string) => {
      return sales.find((s) => s.id === id);
    },
    [sales]
  );

  // Khata Payment (Vasooli)
  const addCustomerPayment = useCallback(
    async (customerId: string, amount: number, note?: string) => {
      if (amount <= 0) return;

      const updatedKhata = khata.map((cust) => {
        if (cust.id === customerId) {
          const newDebt = Math.max(0, cust.totalDebt - amount);
          const newTx = {
            id: 'tx-' + Date.now(),
            date: new Date().toISOString(),
            type: 'payment_received' as const,
            amount,
            note: note?.trim() || 'Cash payment received (vasooli)',
          };
          return {
            ...cust,
            totalDebt: newDebt,
            transactions: [newTx, ...cust.transactions],
            lastUpdated: Date.now(),
          };
        }
        return cust;
      });

      await saveKhata(updatedKhata);
    },
    [khata, saveKhata]
  );

  const totalUdhaarReceivable = useMemo(() => {
    return khata.reduce((sum, c) => sum + (c.totalDebt || 0), 0);
  }, [khata]);

  // Settings
  const updateSettings = useCallback(
    async (newSettings: Partial<ShopSettings>) => {
      const merged = { ...settings, ...newSettings };
      setSettings(merged);
      await StorageAdapter.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
    },
    [settings]
  );

  const resetToSampleData = useCallback(async () => {
    setProducts(INITIAL_PRODUCTS);
    setSales([]);
    setKhata(INITIAL_KHATA);
    setSettings(INITIAL_SETTINGS);
    setBillCounter(1001);

    await Promise.all([
      StorageAdapter.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS)),
      StorageAdapter.setItem(STORAGE_KEYS.SALES, JSON.stringify([])),
      StorageAdapter.setItem(STORAGE_KEYS.KHATA, JSON.stringify(INITIAL_KHATA)),
      StorageAdapter.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS)),
      StorageAdapter.setItem(STORAGE_KEYS.BILL_COUNTER, '1001'),
    ]);
  }, []);

  const exportDataJSON = useCallback(() => {
    return JSON.stringify(
      {
        products,
        sales,
        khata,
        settings,
        billCounter,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  }, [products, sales, khata, settings, billCounter]);

  const importDataJSON = useCallback(
    async (jsonString: string): Promise<boolean> => {
      try {
        const parsed = JSON.parse(jsonString);
        if (parsed.products && Array.isArray(parsed.products)) {
          await saveProducts(parsed.products);
        }
        if (parsed.sales && Array.isArray(parsed.sales)) {
          await saveSales(parsed.sales);
        }
        if (parsed.khata && Array.isArray(parsed.khata)) {
          await saveKhata(parsed.khata);
        }
        if (parsed.settings) {
          setSettings(parsed.settings);
          await StorageAdapter.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed.settings));
        }
        if (parsed.billCounter) {
          setBillCounter(parsed.billCounter);
          await StorageAdapter.setItem(STORAGE_KEYS.BILL_COUNTER, parsed.billCounter.toString());
        }
        return true;
      } catch (e) {
        console.error('Failed to parse import JSON:', e);
        return false;
      }
    },
    [saveProducts, saveSales, saveKhata]
  );

  // Localization
  const language = settings.language;
  const setLanguage = useCallback(
    (lang: Language) => {
      updateSettings({ language: lang });
    },
    [updateSettings]
  );

  const t = useCallback(
    (key: TranslationKey): string => {
      const dict = Translations[language] || Translations.en;
      return dict[key] || Translations.en[key] || key;
    },
    [language]
  );

  // Computed metrics for Dashboard
  const { todaySalesTotal, todayOrdersCount } = useMemo(() => {
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDate = today.getDate();

    const todaySales = sales.filter((s) => {
      const saleDate = new Date(s.date);
      return (
        saleDate.getFullYear() === todayYear &&
        saleDate.getMonth() === todayMonth &&
        saleDate.getDate() === todayDate
      );
    });

    const total = todaySales.reduce((sum, s) => sum + s.grandTotal, 0);
    return {
      todaySalesTotal: total,
      todayOrdersCount: todaySales.length,
    };
  }, [sales]);

  const lowStockProducts = useMemo(() => {
    const threshold = settings.lowStockThreshold || 5;
    return products.filter((p) => p.stock > 0 && p.stock <= threshold);
  }, [products, settings.lowStockThreshold]);

  const outOfStockProducts = useMemo(() => {
    return products.filter((p) => p.stock <= 0);
  }, [products]);

  const value = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductById,
      sales,
      createSale,
      deleteSale,
      getSaleById,
      khata,
      addCustomerPayment,
      totalUdhaarReceivable,
      settings,
      updateSettings,
      resetToSampleData,
      exportDataJSON,
      importDataJSON,
      language,
      setLanguage,
      t,
      todaySalesTotal,
      todayOrdersCount,
      lowStockProducts,
      outOfStockProducts,
      activeReceipt,
      setActiveReceipt,
      editingProduct,
      setEditingProduct,
      isAddProductOpen,
      setIsAddProductOpen,
    }),
    [
      activeTab,
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductById,
      sales,
      createSale,
      deleteSale,
      getSaleById,
      khata,
      addCustomerPayment,
      totalUdhaarReceivable,
      settings,
      updateSettings,
      resetToSampleData,
      exportDataJSON,
      importDataJSON,
      language,
      setLanguage,
      t,
      todaySalesTotal,
      todayOrdersCount,
      lowStockProducts,
      outOfStockProducts,
      activeReceipt,
      editingProduct,
      isAddProductOpen,
    ]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
