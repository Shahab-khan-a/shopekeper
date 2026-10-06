import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Product,
  Sale,
  CartItem,
  CustomerKhata,
  ShopSettings,
  ActiveTab,
  PaymentMethod,
  CompleteSaleInput,
  SaleResult,
  RefundResult,
  KhataTransaction,
} from '@/types';
import {
  ProductRepository,
  SaleRepository,
  CustomerRepository,
  SettingsRepository,
  SyncQueueRepository,
} from '@/storage/repositories';
import { getDatabase } from '@/storage/db';
import { MigrationService } from '@/storage/migration/migrationService';
import { NetworkService } from '@/services/networkService';
import { SyncQueueService } from '@/services/syncQueueService';
import { AlertModalButton, AlertModalType } from '@/components/ui/AlertModal';

export interface AlertConfig {
  type?: AlertModalType;
  title: string;
  message?: string;
  buttons?: AlertModalButton[];
}
import { MergeService } from '@/services/mergeService';
import { googleDriveService } from '@/services/googleDriveService';
import { saveProductToCloud, saveSaleToCloud, saveCustomerToCloud } from '@/services/firestoreService';
import { INITIAL_SETTINGS } from '@/constants/sampleData';
import { SAMPLE_PRODUCTS, SAMPLE_KHATA, generateDemoSales } from '@/services/demoDataService';
import { Translations, Language, TranslationKey } from '@/constants/translations';
import { User } from 'firebase/auth';
import { 
  signInWithGoogle as authSignInWithGoogle, 
  signOutUser, 
  subscribeToAuth, 
  checkRedirectAuth, 
  deleteCurrentUserAccount,
  AuthResult 
} from '@/services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DashboardStats {
  todaySalesTotal: number;
  todayOrdersCount: number;
  todayProfit: number;
  outstandingUdhaar: number;
  totalInventoryCount: number;
  lowStockCount: number;
  recentSales: Sale[];
}

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
  getProducts: () => Product[];

  // Transaction Engine (Local ACID Transactions)
  completeSale: (input: CompleteSaleInput) => Promise<SaleResult>;
  refundSale: (saleId: string, reason?: string) => Promise<RefundResult>;
  recordCustomerPayment: (customerId: string, amount: number, note?: string) => Promise<void>;
  receiveKhataPayment: (customerId: string, amount: number, note?: string) => Promise<void>;

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
  getSales: () => Sale[];

  // Udhaar Khata
  khata: CustomerKhata[];
  addCustomer: (customer: Omit<CustomerKhata, 'id' | 'createdAt' | 'lastUpdated' | 'transactions'>) => Promise<CustomerKhata>;
  addCustomerPayment: (customerId: string, amount: number, note?: string) => Promise<void>;
  totalUdhaarReceivable: number;
  getCustomers: () => CustomerKhata[];

  // Dashboard Stats
  getDashboardStats: () => DashboardStats;

  // Settings
  settings: ShopSettings;
  updateSettings: (newSettings: Partial<ShopSettings>) => Promise<void>;
  resetToSampleData: () => Promise<void>;
  loadDemoData: () => Promise<void>;
  clearStoreData: () => Promise<void>;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => Promise<boolean>;

  // Network & Sync State
  user: User | null;
  authLoading: boolean;
  isOnline: boolean;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error' | 'offline';
  pendingSyncCount: number;
  signInWithGoogle: () => Promise<AuthResult>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
  syncNow: () => Promise<{ success: boolean; error?: string }>;
  isGuestMode: boolean;
  setIsGuestMode: (val: boolean) => void;
  continueAsGuest: () => void;

  // Localization
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;

  // Computed Metrics
  todaySalesTotal: number;
  todayOrdersCount: number;
  todayProfit: number;
  lowStockProducts: Product[];
  outOfStockProducts: Product[];

  // Investment & Earnings
  totalInventoryInvestment: number;
  totalInventoryRetailValue: number;
  totalExpectedStockProfit: number;
  totalLifetimeEarnings: number;
  totalLifetimeProfit: number;
  totalInventoryUnits: number;

  // Modal Controls
  activeReceipt: Sale | null;
  setActiveReceipt: (sale: Sale | null) => void;
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  isAddProductOpen: boolean;
  setIsAddProductOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isEditShopOpen: boolean;
  setIsEditShopOpen: (open: boolean) => void;
  isLoaded: boolean;
  alertConfig: AlertConfig | null;
  showAlert: (config: AlertConfig) => void;
  hideAlert: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [khata, setKhata] = useState<CustomerKhata[]>([]);
  const [settings, setSettings] = useState<ShopSettings>(INITIAL_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Network & Cloud Sync State
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error' | 'offline'>('idle');
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [isGuestMode, setIsGuestMode] = useState(false);

  // Modals state
  const [activeReceipt, setActiveReceipt] = useState<Sale | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEditShopOpen, setIsEditShopOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);

  const showAlert = useCallback((config: AlertConfig) => {
    setAlertConfig(config);
  }, []);

  const hideAlert = useCallback(() => {
    setAlertConfig(null);
  }, []);

  const continueAsGuest = useCallback(async () => {
    setActiveTab('dashboard');
    setIsGuestMode(true);
    await SettingsRepository.setGuestMode(true).catch(() => {});
  }, []);

  // Helpers to refresh state from SQLite/IndexedDB
  const refreshProducts = useCallback(async () => {
    try {
      const prods = await ProductRepository.getAll();
      setProducts(prods);
      return prods;
    } catch (e) {
      console.warn('[ShopContext] refreshProducts error:', e);
      return [];
    }
  }, []);

  const refreshSales = useCallback(async () => {
    try {
      const s = await SaleRepository.getAll();
      setSales(s);
      return s;
    } catch (e) {
      console.warn('[ShopContext] refreshSales error:', e);
      return [];
    }
  }, []);

  const refreshKhata = useCallback(async () => {
    try {
      const k = await CustomerRepository.getAll();
      setKhata(k);
      return k;
    } catch (e) {
      console.warn('[ShopContext] refreshKhata error:', e);
      return [];
    }
  }, []);

  const refreshSettings = useCallback(async () => {
    try {
      const s = await SettingsRepository.getSettings();
      setSettings(s);
      return s;
    } catch (e) {
      console.warn('[ShopContext] refreshSettings error:', e);
      return INITIAL_SETTINGS;
    }
  }, []);

  const refreshPendingCount = useCallback(async () => {
    try {
      const count = await SyncQueueRepository.getPendingCount();
      setPendingSyncCount(count);
      return count;
    } catch {
      return 0;
    }
  }, []);

  // 1. Initial boot: Network init -> Migration -> Load from local SQLite/IndexedDB
  useEffect(() => {
    async function bootApp() {
      try {
        // Initialize network listener
        await NetworkService.init();
        const initialOnline = await NetworkService.isOnline();
        setIsOnline(initialOnline);

        // Run local DB migration from legacy AsyncStorage if needed
        await MigrationService.runMigrationIfNeeded();
        await MigrationService.purgeDummyDataIfNeeded();

        // Load all entities from primary SQLite database
        const [prods, sList, kList, setts, pCount, savedGuest] = await Promise.all([
          ProductRepository.getAll(),
          SaleRepository.getAll(),
          CustomerRepository.getAll(),
          SettingsRepository.getSettings(),
          SyncQueueRepository.getPendingCount(),
          SettingsRepository.getGuestMode(),
        ]);

        // If user hasn't explicitly set a language yet, ensure default is 'en'
        const explicitLang = await AsyncStorage.getItem('@shopkeeper_user_explicit_language');
        let finalSettings = setts;
        if (!explicitLang && setts.language !== 'en') {
          finalSettings = { ...setts, language: 'en' };
          await SettingsRepository.saveSettings(finalSettings).catch(() => {});
        }

        setProducts(prods);
        setSales(sList);
        setKhata(kList);
        setSettings(finalSettings);
        setPendingSyncCount(pCount);
        // Restore guest mode if user previously chose to continue as guest
        setIsGuestMode(savedGuest);

        if (!initialOnline) {
          setSyncStatus('offline');
        } else if (pCount > 0) {
          setSyncStatus('idle');
        }
      } catch (err) {
        console.error('[ShopContext] Error during local boot:', err);
      } finally {
        setIsLoaded(true);
      }
    }

    bootApp();
  }, []);

  // 2. Network connectivity subscriber: Triggers background sync on OFFLINE -> ONLINE
  useEffect(() => {
    const unsubscribe = NetworkService.subscribeToNetworkChanges(async (online) => {
      setIsOnline(online);
      if (!online) {
        setSyncStatus('offline');
      } else {
        console.log('[ShopContext] Network restored to ONLINE. Draining offline sync queue...');
        const count = await refreshPendingCount();
        if (count > 0 && user) {
          setSyncStatus('syncing');
          const res = await SyncQueueService.processQueue(user.uid);
          await refreshPendingCount();
          setSyncStatus(res.errors > 0 ? 'error' : 'synced');
        } else {
          setSyncStatus('synced');
        }
      }
    });

    return () => unsubscribe();
  }, [user, refreshPendingCount]);

  // 3. Firebase Auth listener: Non-blocking background sync & merge
  useEffect(() => {
    if (!isLoaded) return;

    checkRedirectAuth().catch((err) => console.warn('[ShopContext] checkRedirectAuth error:', err));

    const unsubscribe = subscribeToAuth(async (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);

      if (currentUser) {
        setActiveTab('dashboard');
        if (!NetworkService.isCurrentlyOnline()) {
          setSyncStatus('offline');
          return;
        }

        setSyncStatus('syncing');
        try {
          // Perform safe bidirectional merge without destroying local sales
          await MergeService.mergeGuestDataWithAccount(currentUser.uid);

          // Refresh state from updated local database
          await Promise.all([
            refreshProducts(),
            refreshSales(),
            refreshKhata(),
            refreshSettings(),
            refreshPendingCount(),
          ]);

          setSyncStatus('synced');
        } catch (err) {
          console.warn('[ShopContext] Merge/sync error on auth:', err);
          setSyncStatus('error');
        }
      } else {
        setSyncStatus('idle');
      }
    });

    return () => unsubscribe();
  }, [isLoaded, refreshProducts, refreshSales, refreshKhata, refreshSettings, refreshPendingCount]);

  // ==================== PRODUCT CRUD ====================

  const addProduct = useCallback(
    async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
      const now = Date.now();
      const newProduct: Product = {
        ...productData,
        id: 'prod-' + now + '-' + Math.floor(Math.random() * 1000),
        sellingPrice: productData.sellingPrice ?? productData.price,
        image: productData.image ?? productData.imageUri,
        imageUri: productData.imageUri ?? productData.image,
        createdAt: now,
        updatedAt: now,
        syncStatus: 'pending',
      };

      await ProductRepository.insert(newProduct, 'pending');
      await SyncQueueRepository.enqueue('product', newProduct.id, 'create', newProduct);

      await refreshProducts();
      await refreshPendingCount();

      if (user && isOnline) {
        SyncQueueService.processQueue(user.uid).then(refreshPendingCount).catch(console.warn);
      }

      return newProduct;
    },
    [user, isOnline, refreshProducts, refreshPendingCount]
  );

  const updateProduct = useCallback(
    async (id: string, updates: Partial<Product>) => {
      await ProductRepository.update(id, updates, 'pending');
      const updated = await ProductRepository.getById(id);
      if (updated) {
        await SyncQueueRepository.enqueue('product', id, 'update', updated);
      }

      await refreshProducts();
      await refreshPendingCount();

      if (user && isOnline) {
        SyncQueueService.processQueue(user.uid).then(refreshPendingCount).catch(console.warn);
      }
    },
    [user, isOnline, refreshProducts, refreshPendingCount]
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      await ProductRepository.softDelete(id, 'pending');
      await SyncQueueRepository.enqueue('product', id, 'delete', { id });

      await refreshProducts();
      await refreshPendingCount();

      if (user && isOnline) {
        SyncQueueService.processQueue(user.uid).then(refreshPendingCount).catch(console.warn);
      }
    },
    [user, isOnline, refreshProducts, refreshPendingCount]
  );

  const getProductById = useCallback(
    (id: string) => {
      return products.find((p) => p.id === id);
    },
    [products]
  );

  const getProducts = useCallback(() => products, [products]);

  // ==================== TRANSACTION ENGINE ====================

  /**
   * Complete Sale: Atomic Local Transaction
   * Operates completely offline without waiting for Firebase.
   */
  const completeSale = useCallback(
    async (input: CompleteSaleInput): Promise<SaleResult> => {
      const result = await SaleRepository.completeSaleTransaction(input);

      if (result.success && result.sale) {
        // Immediate local state update from transactional database
        await Promise.all([
          refreshProducts(),
          refreshSales(),
          refreshKhata(),
          refreshPendingCount(),
        ]);

        setActiveReceipt(null); // W1-3: Do NOT auto-show receipt; let SaleScreen success toast handle it on explicit user tap

        // Upload individual bill receipt to Google Drive in background (silent & non-blocking)
        googleDriveService
          .uploadBillToDrive(result.sale, settings)
          .catch(() => {});

        // Background cloud sync if online (never blocks UI or receipt)
        if (user && isOnline) {
          SyncQueueService.processQueue(user.uid)
            .then(refreshPendingCount)
            .catch((e) => console.warn('[ShopContext] Background sync warning:', e));
        }
      }

      return result;
    },
    [user, isOnline, settings, refreshProducts, refreshSales, refreshKhata, refreshPendingCount]
  );

  /**
   * Refund Sale: Safe Audit Trail Reversal
   * Restores stock, marks sale as refunded, reverses Khata balance.
   */
  const refundSale = useCallback(
    async (saleId: string, reason?: string): Promise<RefundResult> => {
      const result = await SaleRepository.refundSaleTransaction(saleId, reason || 'Customer Return');

      if (result.success && result.refundedSale) {
        await Promise.all([
          refreshProducts(),
          refreshSales(),
          refreshKhata(),
          refreshPendingCount(),
        ]);

        if (user && isOnline) {
          SyncQueueService.processQueue(user.uid)
            .then(refreshPendingCount)
            .catch((e) => console.warn('[ShopContext] Background sync warning:', e));
        }
      }

      return result;
    },
    [user, isOnline, refreshProducts, refreshSales, refreshKhata, refreshPendingCount]
  );

  /**
   * Customer Vasooli Payment
   */
  const recordCustomerPayment = useCallback(
    async (customerId: string, amount: number, note?: string) => {
      if (amount <= 0) return;
      const now = Date.now();
      const txId = `ktx-${now}`;
      const pmtId = `pmt-${now}`;

      await CustomerRepository.updateBalance(customerId, -amount);

      const newTx: KhataTransaction = {
        id: txId,
        customerId,
        type: 'payment',
        amount,
        note: note?.trim() || 'Payment received (vasooli)',
        createdAt: now,
        date: new Date(now).toISOString(),
        syncStatus: 'pending',
      };
      await CustomerRepository.addTransaction(newTx, 'pending');

      await CustomerRepository.recordPayment({
        id: pmtId,
        customerId,
        amount,
        paymentMethod: 'cash',
        createdAt: now,
        syncStatus: 'pending',
      });

      const updatedCust = await CustomerRepository.getById(customerId);
      if (updatedCust) {
        await SyncQueueRepository.enqueueBatch([
          { entityType: 'customer', entityId: customerId, operation: 'update', payload: updatedCust },
          { entityType: 'khata_transaction', entityId: txId, operation: 'create', payload: newTx },
          { entityType: 'payment', entityId: pmtId, operation: 'create', payload: { id: pmtId, customerId, amount, paymentMethod: 'cash', createdAt: now } },
        ]);
      }

      await refreshKhata();
      await refreshPendingCount();

      if (user && isOnline) {
        SyncQueueService.processQueue(user.uid).then(refreshPendingCount).catch(console.warn);
      }
    },
    [user, isOnline, refreshKhata, refreshPendingCount]
  );

  const receiveKhataPayment = recordCustomerPayment;
  const addCustomerPayment = recordCustomerPayment;

  // Add Customer directly
  const addCustomer = useCallback(
    async (custData: Omit<CustomerKhata, 'id' | 'createdAt' | 'lastUpdated' | 'transactions'>): Promise<CustomerKhata> => {
      const now = Date.now();
      const newCust: CustomerKhata = {
        ...custData,
        id: 'cust-' + now + '-' + Math.floor(Math.random() * 1000),
        totalDebt: custData.balance || custData.totalDebt || 0,
        balance: custData.balance || custData.totalDebt || 0,
        transactions: [],
        createdAt: now,
        lastUpdated: now,
        updatedAt: now,
        syncStatus: 'pending',
      };

      await CustomerRepository.insert(newCust, 'pending');
      await SyncQueueRepository.enqueue('customer', newCust.id, 'create', newCust);

      await refreshKhata();
      await refreshPendingCount();

      if (user && isOnline) {
        SyncQueueService.processQueue(user.uid).then(refreshPendingCount).catch(console.warn);
      }

      return newCust;
    },
    [user, isOnline, refreshKhata, refreshPendingCount]
  );

  // Backward compatibility wrappers
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
      const res = await completeSale({
        items,
        discount,
        discountType,
        paymentMethod,
        customerName,
        customerPhone,
        notes,
      });
      if (!res.success || !res.sale) {
        throw new Error(res.error || 'Failed to complete sale');
      }
      return res.sale;
    },
    [completeSale]
  );

  const deleteSale = useCallback(
    async (saleId: string) => {
      await refundSale(saleId, 'Removed via Bill History');
    },
    [refundSale]
  );

  const getSaleById = useCallback(
    (id: string) => {
      return sales.find((s) => s.id === id);
    },
    [sales]
  );

  const getSales = useCallback(() => sales, [sales]);
  const getCustomers = useCallback(() => khata, [khata]);

  const totalUdhaarReceivable = useMemo(() => {
    return khata.reduce((sum, c) => sum + (c.totalDebt || c.balance || 0), 0);
  }, [khata]);

  // ==================== SETTINGS ====================

  const updateSettings = useCallback(
    async (newSettings: Partial<ShopSettings>) => {
      const merged = { ...settings, ...newSettings };
      setSettings(merged);
      await SettingsRepository.saveSettings(merged);
      await SyncQueueRepository.enqueue('settings', 'profile', 'update', merged);
      await refreshPendingCount();

      if (user && isOnline) {
        SyncQueueService.processQueue(user.uid).then(refreshPendingCount).catch(console.warn);
      }
    },
    [settings, user, isOnline, refreshPendingCount]
  );

  // ==================== AUTH & SYNC ACTIONS ====================

  const signInWithGoogle = useCallback(async () => {
    setAuthLoading(true);
    const result = await authSignInWithGoogle();
    setAuthLoading(false);
    if (result.success && result.user) {
      setActiveTab('dashboard');
      const gUser = result.user;
      setUser(gUser);
      setIsGuestMode(false);
      setSyncStatus('syncing');

      await MergeService.mergeGuestDataWithAccount(gUser.uid);
      await Promise.all([refreshProducts(), refreshSales(), refreshKhata(), refreshSettings(), refreshPendingCount()]);
      setSyncStatus('synced');
    }
    return result;
  }, [refreshProducts, refreshSales, refreshKhata, refreshSettings, refreshPendingCount]);

  const logout = useCallback(async () => {
    if (user?.uid) {
      try {
        await AsyncStorage.removeItem(`@shopkeeper_drive_onboarded_${user.uid}`);
      } catch (e) {
        console.warn('[ShopContext] Error clearing drive onboarding flag:', e);
      }
    }
    await SettingsRepository.setGuestMode(false).catch(() => {});
    await signOutUser();
    await googleDriveService.disconnect();
    setUser(null);
    setIsGuestMode(false);
    setActiveTab('dashboard');
    setSyncStatus('idle');
  }, [user?.uid]);

  const syncNow = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'User is not logged in' };
    const online = await NetworkService.isOnline();
    if (!online) {
      setSyncStatus('offline');
      return { success: false, error: 'Cannot sync while offline. Your changes are safe locally.' };
    }

    setSyncStatus('syncing');
    const result = await SyncQueueService.processQueue(user.uid);
    await refreshPendingCount();
    setSyncStatus(result.errors > 0 ? 'error' : 'synced');

    return {
      success: result.errors === 0,
      error: result.errors > 0 ? `${result.errors} operations failed to upload.` : undefined,
    };
  }, [user, refreshPendingCount]);

  const clearStoreData = useCallback(async () => {
    const db = getDatabase();
    await db.run('DELETE FROM sale_items');
    await db.run('DELETE FROM sales');
    await db.run('DELETE FROM khata_transactions');
    await db.run('DELETE FROM payments');
    await db.run('DELETE FROM customers');
    await db.run('DELETE FROM products');
    await db.run('DELETE FROM sync_queue');
    await db.run("DELETE FROM settings WHERE key = 'shop_profile_settings'");
    const resetSettings = { ...INITIAL_SETTINGS, language: settings.language, darkMode: settings.darkMode };
    await SettingsRepository.saveSettings(resetSettings);
    setSettings(resetSettings);
    await SettingsRepository.setInvoiceCounter(1001);
    await Promise.all([
      refreshProducts(),
      refreshSales(),
      refreshKhata(),
      refreshPendingCount(),
    ]);
  }, [refreshProducts, refreshSales, refreshKhata, refreshPendingCount]);

  const deleteAccount = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    const currentUid = user?.uid;
    const res = await deleteCurrentUserAccount();
    if (!res.success) {
      return res;
    }
    if (currentUid) {
      try {
        await AsyncStorage.removeItem(`@shopkeeper_drive_onboarded_${currentUid}`);
      } catch (e) {
        console.warn('[ShopContext] Error clearing drive onboarding flag:', e);
      }
    }
    await AsyncStorage.removeItem('@sk_held_carts').catch(() => {});
    await clearStoreData();
    await SettingsRepository.saveSettings(INITIAL_SETTINGS);
    setSettings(INITIAL_SETTINGS);
    await SettingsRepository.setGuestMode(false).catch(() => {});
    setUser(null);
    setIsGuestMode(false);
    setActiveTab('dashboard');
    setSyncStatus('idle');
    return { success: true };
  }, [user?.uid, clearStoreData]);

  const loadDemoData = useCallback(async () => {
    try {
      for (const p of SAMPLE_PRODUCTS) {
        await ProductRepository.insert(p, 'synced');
      }
      for (const c of SAMPLE_KHATA) {
        await CustomerRepository.insert(c, 'synced');
        if (c.transactions && c.transactions.length > 0) {
          for (const tx of c.transactions) {
            await CustomerRepository.addTransaction(tx, 'synced');
          }
        }
      }
      const demoSales = generateDemoSales(SAMPLE_PRODUCTS);
      for (const s of demoSales) {
        // SaleRepository has no bare insert — use completeSaleTransaction per sale
        await SaleRepository.completeSaleTransaction({
          items: s.items,
          paymentMethod: s.paymentMethod ?? 'cash',
          discount: s.discount ?? 0,
          discountType: s.discountType ?? 'fixed',
          customerName: s.customerName,
          customerPhone: s.customerPhone,
        });
      }

      // If user is logged in, push directly to Firebase Firestore cloud tenant
      if (user?.uid) {
        for (const p of SAMPLE_PRODUCTS) {
          await saveProductToCloud(user.uid, p).catch(() => {});
        }
        for (const c of SAMPLE_KHATA) {
          await saveCustomerToCloud(user.uid, c).catch(() => {});
        }
        for (const s of demoSales) {
          await saveSaleToCloud(user.uid, s).catch(() => {});
        }
      }

      await Promise.all([
        refreshProducts(),
        refreshSales(),
        refreshKhata(),
        refreshPendingCount(),
      ]);
    } catch (err) {
      console.error('[ShopContext] Error loading demo data:', err);
    }
  }, [user?.uid, refreshProducts, refreshSales, refreshKhata, refreshPendingCount]);

  const exportDataJSON = useCallback(() => {
    return JSON.stringify(
      {
        products,
        sales,
        khata,
        settings,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  }, [products, sales, khata, settings]);

  const importDataJSON = useCallback(
    async (jsonString: string): Promise<boolean> => {
      try {
        const parsed = JSON.parse(jsonString);
        if (parsed.products && Array.isArray(parsed.products)) {
          for (const p of parsed.products) {
            await ProductRepository.insert(p, 'pending');
          }
        }
        if (parsed.khata && Array.isArray(parsed.khata)) {
          for (const c of parsed.khata) {
            await CustomerRepository.insert(c, 'pending');
          }
        }
        if (parsed.settings) {
          await SettingsRepository.saveSettings(parsed.settings);
        }
        await Promise.all([refreshProducts(), refreshSales(), refreshKhata(), refreshSettings()]);
        return true;
      } catch (e) {
        console.error('Failed to parse import JSON:', e);
        return false;
      }
    },
    [refreshProducts, refreshSales, refreshKhata, refreshSettings]
  );

  // Silent automatic store backup to Google Drive whenever catalog, sales, or khata change
  const driveAutoSyncTimer = useRef<any>(null);
  useEffect(() => {
    if (!isLoaded) return;
    if (driveAutoSyncTimer.current) {
      clearTimeout(driveAutoSyncTimer.current);
    }
    driveAutoSyncTimer.current = setTimeout(() => {
      googleDriveService
        .isConnected()
        .then((connected) => {
          if (connected) {
            googleDriveService.autoSyncBackupToDrive(exportDataJSON()).catch(() => {});
          }
        })
        .catch(() => {});
    }, 5000);

    return () => {
      if (driveAutoSyncTimer.current) {
        clearTimeout(driveAutoSyncTimer.current);
      }
    };
  }, [products, sales, khata, settings, isLoaded, exportDataJSON]);

  // Localization
  const language = settings.language;
  const setLanguage = useCallback(
    (lang: Language) => {
      AsyncStorage.setItem('@shopkeeper_user_explicit_language', lang).catch(() => {});
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

  // Computed Metrics
  const { todaySalesTotal, todayOrdersCount, todayProfit } = useMemo(() => {
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDate = today.getDate();

    const activeSales = sales.filter((s) => s.status !== 'refunded' && s.status !== 'cancelled');

    const todaySales = activeSales.filter((s) => {
      const saleDate = new Date(s.date);
      return (
        saleDate.getFullYear() === todayYear &&
        saleDate.getMonth() === todayMonth &&
        saleDate.getDate() === todayDate
      );
    });

    const total = todaySales.reduce((sum, s) => sum + (s.total ?? s.grandTotal), 0);
    const profit = todaySales.reduce((sum, s) => sum + (s.totalProfit || 0), 0);

    return {
      todaySalesTotal: total,
      todayOrdersCount: todaySales.length,
      todayProfit: profit,
    };
  }, [sales]);

  const lowStockProducts = useMemo(() => {
    const threshold = settings.lowStockThreshold || 5;
    return products.filter((p) => p.stock > 0 && p.stock <= threshold);
  }, [products, settings.lowStockThreshold]);

  const outOfStockProducts = useMemo(() => {
    return products.filter((p) => p.stock <= 0);
  }, [products]);

  // Investment & Financial Stock Metrics
  const {
    totalInventoryInvestment,
    totalInventoryRetailValue,
    totalExpectedStockProfit,
    totalInventoryUnits,
  } = useMemo(() => {
    let investment = 0;
    let retail = 0;
    let units = 0;

    for (const p of products) {
      const stock = Math.max(0, p.stock || 0);
      const cost = p.costPrice != null ? p.costPrice : Math.round((p.sellingPrice ?? p.price ?? 0) * 0.8);
      const price = p.sellingPrice ?? p.price ?? 0;

      investment += cost * stock;
      retail += price * stock;
      units += stock;
    }

    return {
      totalInventoryInvestment: Math.round(investment),
      totalInventoryRetailValue: Math.round(retail),
      totalExpectedStockProfit: Math.max(0, Math.round(retail - investment)),
      totalInventoryUnits: units,
    };
  }, [products]);

  // All-time Store Earnings & Net Realized Profit
  const { totalLifetimeEarnings, totalLifetimeProfit } = useMemo(() => {
    const activeSales = sales.filter((s) => s.status !== 'refunded' && s.status !== 'cancelled');
    const earnings = activeSales.reduce((sum, s) => sum + (s.grandTotal ?? s.total ?? 0), 0);
    const profit = activeSales.reduce((sum, s) => sum + (s.totalProfit || 0), 0);

    return {
      totalLifetimeEarnings: Math.round(earnings),
      totalLifetimeProfit: Math.round(profit),
    };
  }, [sales]);

  const getDashboardStats = useCallback((): DashboardStats => {
    return {
      todaySalesTotal,
      todayOrdersCount,
      todayProfit,
      outstandingUdhaar: totalUdhaarReceivable,
      totalInventoryCount: products.reduce((s, p) => s + p.stock, 0),
      lowStockCount: lowStockProducts.length,
      recentSales: sales.slice(0, 10),
    };
  }, [todaySalesTotal, todayOrdersCount, todayProfit, totalUdhaarReceivable, products, lowStockProducts, sales]);

  const value = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductById,
      getProducts,
      completeSale,
      refundSale,
      recordCustomerPayment,
      receiveKhataPayment,
      sales,
      createSale,
      deleteSale,
      getSaleById,
      getSales,
      khata,
      addCustomer,
      addCustomerPayment,
      totalUdhaarReceivable,
      getCustomers,
      getDashboardStats,
      settings,
      updateSettings,
      resetToSampleData: loadDemoData,
      loadDemoData,
      clearStoreData,
      exportDataJSON,
      importDataJSON,
      language,
      setLanguage,
      t,
      todaySalesTotal,
      todayOrdersCount,
      todayProfit,
      lowStockProducts,
      outOfStockProducts,
      totalInventoryInvestment,
      totalInventoryRetailValue,
      totalExpectedStockProfit,
      totalLifetimeEarnings,
      totalLifetimeProfit,
      totalInventoryUnits,
      activeReceipt,
      setActiveReceipt,
      editingProduct,
      setEditingProduct,
      isAddProductOpen,
      setIsAddProductOpen,
      isAuthModalOpen,
      setIsAuthModalOpen,
      isEditShopOpen,
      setIsEditShopOpen,
      user,
      authLoading,
      isOnline,
      syncStatus,
      pendingSyncCount,
      signInWithGoogle,
      logout,
      deleteAccount,
      syncNow,
      isGuestMode,
      setIsGuestMode,
      continueAsGuest,
      isLoaded,
      alertConfig,
      showAlert,
      hideAlert,
    }),
    [
      activeTab,
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductById,
      getProducts,
      completeSale,
      refundSale,
      recordCustomerPayment,
      receiveKhataPayment,
      sales,
      createSale,
      deleteSale,
      getSaleById,
      getSales,
      khata,
      addCustomer,
      addCustomerPayment,
      totalUdhaarReceivable,
      getCustomers,
      getDashboardStats,
      settings,
      updateSettings,
      loadDemoData,
      clearStoreData,
      exportDataJSON,
      importDataJSON,
      language,
      setLanguage,
      t,
      todaySalesTotal,
      todayOrdersCount,
      todayProfit,
      lowStockProducts,
      outOfStockProducts,
      totalInventoryInvestment,
      totalInventoryRetailValue,
      totalExpectedStockProfit,
      totalLifetimeEarnings,
      totalLifetimeProfit,
      totalInventoryUnits,
      activeReceipt,
      editingProduct,
      isAddProductOpen,
      isAuthModalOpen,
      isEditShopOpen,
      user,
      authLoading,
      isOnline,
      syncStatus,
      pendingSyncCount,
      signInWithGoogle,
      logout,
      deleteAccount,
      syncNow,
      isGuestMode,
      continueAsGuest,
      isLoaded,
      alertConfig,
      showAlert,
      hideAlert,
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
