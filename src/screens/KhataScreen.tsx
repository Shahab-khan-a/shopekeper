import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomerKhata, SupplierKhata, SupplierTransaction } from '@/types';
import { useShop } from '@/context/ShopContext';
import { KhataModal } from '@/components/KhataModal';
import { CustomerKhataCard } from '@/components/CustomerKhataCard';
import { CustomerModal, CustomerModalMode } from '@/components/CustomerModal';
import { SupplierCard } from '@/components/SupplierCard';
import { SupplierModal, SupplierModalMode } from '@/components/SupplierModal';
import { Colors, Spacing, Shadows } from '@/constants/theme';
import { TourBeacon } from '@/components/TourBeacon';
import { FloatingTourPrompt } from '@/components/FloatingTourPrompt';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterChip } from '@/components/ui/FilterChip';
import { EmptyState } from '@/components/ui/EmptyState';

type KhataFilter = 'all' | 'pending' | 'overdue' | 'settled';

const OVERDUE_DAYS = 7;
const SUPPLIERS_STORAGE_KEY = '@shopkeeper_suppliers_ledger';
const CASH_OUT_STORAGE_KEY = '@shopkeeper_cash_out_entries';

const daysSince = (isoOrMs?: string | number) => {
  if (!isoOrMs) return 0;
  const d = typeof isoOrMs === 'number' ? new Date(isoOrMs) : new Date(isoOrMs);
  if (Number.isNaN(d.getTime())) return 0;
  return Math.max(0, Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24)));
};

const getLastActivityDate = (c: CustomerKhata) => {
  if (c.transactions?.length) {
    const sorted = [...c.transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return sorted[0]?.date;
  }
  return c.lastUpdated || c.updatedAt;
};

const isOverdueCustomer = (c: CustomerKhata) => {
  if (c.totalDebt <= 0) return false;
  return daysSince(getLastActivityDate(c)) >= OVERDUE_DAYS;
};

export const KhataScreen: React.FC = () => {
  const {
    khata,
    totalUdhaarReceivable,
    settings,
    t,
    language,
    setActiveTab,
    showAlert,
    addCustomer,
    addCustomerCredit,
    tourStep,
    setTourStep,
    endHandsOnTour,
  } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  // Hands-On Tour Step 6: Auto-seed Aslam Bhai if Khata is empty
  useEffect(() => {
    if (tourStep === 6 && khata.length === 0) {
      addCustomer({
        name: 'Aslam Bhai',
        nameUrdu: 'اسلم بھائی',
        phone: '03001234567',
        totalDebt: 450,
      }).catch(console.error);
    }
  }, [tourStep, khata.length, addCustomer]);

  // Segment Tab: Customers vs Suppliers
  const [activeLedgerTab, setActiveLedgerTab] = useState<'customers' | 'suppliers'>('customers');

  // Customer Ledger States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<KhataFilter>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerKhata | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerModalMode, setCustomerModalMode] = useState<CustomerModalMode>('add_customer');
  const [expandedCustId, setExpandedCustId] = useState<string | null>(null);

  // Supplier Ledger States
  const [suppliers, setSuppliers] = useState<SupplierKhata[]>([]);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [supplierModalMode, setSupplierModalMode] = useState<SupplierModalMode>('add_supplier');
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierKhata | null>(null);
  const [expandedSupplierId, setExpandedSupplierId] = useState<string | null>(null);

  // Load suppliers on mount
  useEffect(() => {
    AsyncStorage.getItem(SUPPLIERS_STORAGE_KEY)
      .then((saved) => {
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setSuppliers(parsed);
          }
        }
      })
      .catch(console.error);
  }, []);

  const saveSuppliers = (updated: SupplierKhata[]) => {
    setSuppliers(updated);
    AsyncStorage.setItem(SUPPLIERS_STORAGE_KEY, JSON.stringify(updated)).catch(console.error);
  };

  // ---------------- Customer Ledger Memos ----------------
  const pendingCount = useMemo(() => khata.filter((c) => c.totalDebt > 0).length, [khata]);
  const settledCount = useMemo(() => khata.filter((c) => c.totalDebt <= 0).length, [khata]);
  const overdueCustomers = useMemo(() => khata.filter(isOverdueCustomer), [khata]);

  const recoveredThisMonth = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    let sum = 0;
    khata.forEach((c) => {
      c.transactions?.forEach((tx) => {
        if (tx.type !== 'payment_received' && tx.type !== 'payment') return;
        const d = new Date(tx.date);
        if (d.getFullYear() === y && d.getMonth() === m) sum += tx.amount;
      });
    });
    return sum;
  }, [khata]);

  const filteredCustomers = useMemo(() => {
    const list = khata.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        (c.nameUrdu && c.nameUrdu.includes(q)) ||
        c.phone.includes(q) ||
        (c.address && c.address.toLowerCase().includes(q));

      if (!matchSearch) return false;
      if (selectedFilter === 'pending') return c.totalDebt > 0;
      if (selectedFilter === 'settled') return c.totalDebt <= 0;
      if (selectedFilter === 'overdue') return isOverdueCustomer(c);
      return true;
    });

    return [...list].sort((a, b) => {
      if (selectedFilter === 'settled') return a.name.localeCompare(b.name);
      return (b.totalDebt || 0) - (a.totalDebt || 0);
    });
  }, [khata, searchQuery, selectedFilter]);

  // ---------------- Supplier Ledger Memos ----------------
  const totalSupplierPayable = useMemo(() => {
    return suppliers.reduce((sum, s) => sum + Math.max(0, s.totalPayable), 0);
  }, [suppliers]);

  const supplierPaymentsThisMonth = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    let sum = 0;
    suppliers.forEach((s) => {
      s.transactions?.forEach((tx) => {
        if (tx.type !== 'payment_made') return;
        const d = new Date(tx.date);
        if (d.getFullYear() === y && d.getMonth() === m) sum += tx.amount;
      });
    });
    return sum;
  }, [suppliers]);

  const filteredSuppliers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return suppliers;
    return suppliers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.companyName && s.companyName.toLowerCase().includes(q)) ||
        (s.phone && s.phone.includes(q))
    );
  }, [suppliers, searchQuery]);

  // ---------------- Customer Handlers ----------------
  const handleRecordPayment = (customer: CustomerKhata) => {
    setSelectedCustomer(customer);
    setIsPaymentModalOpen(true);
  };

  const handleOpenAddCustomer = () => {
    setSelectedCustomer(null);
    setCustomerModalMode('add_customer');
    setIsCustomerModalOpen(true);
  };

  const handleOpenAddCredit = (customer: CustomerKhata) => {
    setSelectedCustomer(customer);
    setCustomerModalMode('add_credit');
    setIsCustomerModalOpen(true);
  };

  const handleSaveCustomer = async (data: {
    name: string;
    nameUrdu?: string;
    phone?: string;
    address?: string;
    initialBalance: number;
  }) => {
    try {
      await addCustomer({
        name: data.name,
        nameUrdu: data.nameUrdu,
        phone: data.phone || '',
        address: data.address,
        totalDebt: data.initialBalance,
        balance: data.initialBalance,
      });
      showAlert({
        type: 'success',
        title: language === 'ur' ? 'گاہک محفوظ ہو گیا' : 'Customer Saved',
        message:
          language === 'ur'
            ? `${data.nameUrdu || data.name} کو کھاتے میں کامیابی سے شامل کر دیا گیا۔`
            : `${data.name} has been added to customer ledger.`,
      });
    } catch (err: any) {
      console.error('[KhataScreen] Error saving customer:', err);
    }
  };

  const handleSaveCredit = async (customerId: string, amount: number, note?: string) => {
    try {
      await addCustomerCredit(customerId, amount, note);
      showAlert({
        type: 'success',
        title: language === 'ur' ? 'ادھار درج ہو گیا' : 'Credit Recorded',
        message:
          language === 'ur'
            ? `${settings.currencySymbol}${amount.toLocaleString()} کا نیا ادھار درج کر دیا گیا۔`
            : `Added ${settings.currencySymbol}${amount.toLocaleString()} credit entry.`,
      });
    } catch (err: any) {
      console.error('[KhataScreen] Error recording credit:', err);
    }
  };

  // ---------------- Supplier Handlers ----------------
  const handleOpenAddSupplier = () => {
    setSelectedSupplier(null);
    setSupplierModalMode('add_supplier');
    setIsSupplierModalOpen(true);
  };

  const handleOpenAddPurchase = (supplier: SupplierKhata) => {
    setSelectedSupplier(supplier);
    setSupplierModalMode('add_purchase');
    setIsSupplierModalOpen(true);
  };

  const handleOpenMakePayment = (supplier: SupplierKhata) => {
    setSelectedSupplier(supplier);
    setSupplierModalMode('make_payment');
    setIsSupplierModalOpen(true);
  };

  const handleSaveSupplier = (data: {
    name: string;
    companyName?: string;
    phone?: string;
    initialBalance: number;
  }) => {
    const newSupplierId = 'sup_' + Date.now();
    const newSupplier: SupplierKhata = {
      id: newSupplierId,
      name: data.name,
      companyName: data.companyName,
      phone: data.phone,
      totalPayable: data.initialBalance,
      transactions:
        data.initialBalance > 0
          ? [
              {
                id: 'suptx_' + Date.now(),
                supplierId: newSupplierId,
                date: new Date().toISOString(),
                type: 'purchase_credit',
                amount: data.initialBalance,
                note: language === 'ur' ? 'ابتدائی سابقہ بقایا' : 'Opening balance',
                createdAt: Date.now(),
              },
            ]
          : [],
      createdAt: Date.now(),
      lastUpdated: Date.now(),
    };
    saveSuppliers([newSupplier, ...suppliers]);
  };

  const handleSavePurchase = (
    supplierId: string,
    amount: number,
    billNumber?: string,
    note?: string
  ) => {
    const updated = suppliers.map((s) => {
      if (s.id !== supplierId) return s;
      const newTx: SupplierTransaction = {
        id: 'suptx_' + Date.now(),
        supplierId,
        date: new Date().toISOString(),
        type: 'purchase_credit',
        amount,
        billNumber,
        note,
        createdAt: Date.now(),
      };
      return {
        ...s,
        totalPayable: s.totalPayable + amount,
        transactions: [newTx, ...(s.transactions || [])],
        lastUpdated: Date.now(),
      };
    });
    saveSuppliers(updated);
    showAlert({
      type: 'success',
      title: language === 'ur' ? 'مال کی خریداری درج ہو گئی' : 'Purchase Recorded',
      message: `${settings.currencySymbol}${amount.toLocaleString()} ${
        language === 'ur' ? 'سپلائر کے کھاتے میں شامل کر دیے گئے۔' : 'added to supplier ledger.'
      }`,
    });
  };

  const handleSavePayment = async (
    supplierId: string,
    amount: number,
    note?: string,
    alsoLogDrawerExpense: boolean = true
  ) => {
    const targetSup = suppliers.find((s) => s.id === supplierId);
    const updated = suppliers.map((s) => {
      if (s.id !== supplierId) return s;
      const newTx: SupplierTransaction = {
        id: 'suptx_' + Date.now(),
        supplierId,
        date: new Date().toISOString(),
        type: 'payment_made',
        amount,
        note,
        createdAt: Date.now(),
      };
      return {
        ...s,
        totalPayable: s.totalPayable - amount,
        transactions: [newTx, ...(s.transactions || [])],
        lastUpdated: Date.now(),
      };
    });
    saveSuppliers(updated);

    if (alsoLogDrawerExpense) {
      try {
        const existingRaw = await AsyncStorage.getItem(CASH_OUT_STORAGE_KEY);
        const existingList = existingRaw ? JSON.parse(existingRaw) : [];
        const newExpense = {
          id: 'cashout_' + Date.now(),
          amount,
          category: 'supplier',
          note: note
            ? `${targetSup?.name || 'Supplier'}: ${note}`
            : `Payment to ${targetSup?.name || 'Supplier'}`,
          timestamp: Date.now(),
        };
        const nextList = [newExpense, ...existingList];
        await AsyncStorage.setItem(CASH_OUT_STORAGE_KEY, JSON.stringify(nextList));
      } catch (err) {
        console.error('Failed to log drawer expense for supplier payment:', err);
      }
    }

    showAlert({
      type: 'success',
      title: language === 'ur' ? 'ادائیگی ریکارڈ ہو گئی' : 'Payment Recorded',
      message: `${settings.currencySymbol}${amount.toLocaleString()} ${
        language === 'ur'
          ? 'سپلائر کو ادا کر دیے گئے'
          : 'paid to supplier'
      }${
        alsoLogDrawerExpense
          ? language === 'ur'
            ? ' اور گلہ سے کیش آؤٹ میں شامل کر لیے گئے۔'
            : ' and logged in drawer cash-out.'
          : '.'
      }`,
    });
  };

  const handleDeleteSupplier = (supplier: SupplierKhata) => {
    showAlert({
      type: 'confirm',
      title: language === 'ur' ? 'سپلائر حذف کریں؟' : 'Delete Supplier?',
      message:
        language === 'ur'
          ? `کیا آپ واقعی "${supplier.name}" کا کھاتہ حذف کرنا چاہتے ہیں؟`
          : `Are you sure you want to delete "${supplier.name}"?`,
      buttons: [
        {
          text: language === 'ur' ? 'حذف کریں' : 'Delete',
          style: 'destructive',
          onPress: () => {
            saveSuppliers(suppliers.filter((s) => s.id !== supplier.id));
          },
        },
        { text: t('cancel'), style: 'cancel' },
      ],
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* ── Top Section: Segment Switcher + SadaPay-inspired Hero Card ── */}
      <View style={styles.topSection}>
        {/* Soft Pill Segment Switcher */}
        <View
          style={[
            styles.segmentContainer,
            {
              backgroundColor: settings.darkMode ? '#1E293B' : '#E2E8F0',
            },
          ]}>
          <Pressable
            onPress={() => {
              setActiveLedgerTab('customers');
              setSearchQuery('');
            }}
            style={[
              styles.segmentBtn,
              activeLedgerTab === 'customers' && [
                styles.segmentBtnActive,
                { backgroundColor: theme.card },
              ],
            ]}>
            <Ionicons
              name="people"
              size={15}
              color={activeLedgerTab === 'customers' ? '#059669' : theme.textMuted}
            />
            <Text
              style={[
                styles.segmentBtnText,
                activeLedgerTab === 'customers'
                  ? [styles.segmentBtnTextActive, { color: settings.darkMode ? '#34D399' : '#065F46' }]
                  : [styles.segmentBtnTextInactive, { color: theme.textMuted }],
              ]}>
              {language === 'ur' ? 'گاہک کھاتہ' : 'Customers'} ({khata.length})
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setActiveLedgerTab('suppliers');
              setSearchQuery('');
            }}
            style={[
              styles.segmentBtn,
              activeLedgerTab === 'suppliers' && [
                styles.segmentBtnActive,
                { backgroundColor: theme.card },
              ],
            ]}>
            <Ionicons
              name="bus"
              size={15}
              color={activeLedgerTab === 'suppliers' ? '#D97706' : theme.textMuted}
            />
            <Text
              style={[
                styles.segmentBtnText,
                activeLedgerTab === 'suppliers'
                  ? [styles.segmentBtnTextActive, { color: settings.darkMode ? '#FBBF24' : '#B45309' }]
                  : [styles.segmentBtnTextInactive, { color: theme.textMuted }],
              ]}>
              {language === 'ur' ? 'سپلائر کھاتہ' : 'Suppliers'} ({suppliers.length})
            </Text>
          </Pressable>
        </View>

        {/* ── SadaPay-style Floating Hero Balance Card ── */}
        {activeLedgerTab === 'customers' ? (
          <View
            style={[
              styles.heroCard,
              {
                backgroundColor: settings.darkMode ? '#064E3B' : '#059669',
              },
            ]}>
            {/* Top row: Label + White Pill Add Button */}
            <View style={styles.heroTopRow}>
              <View style={styles.heroLabelWrap}>
                <Text style={styles.heroLabel}>
                  {language === 'ur' ? 'کل وصول طلب ادھار' : 'TOTAL UDHAAR TO COLLECT'}
                </Text>
              </View>

              <Pressable
                onPress={handleOpenAddCustomer}
                style={({ pressed }) => [
                  styles.heroAddBtn,
                  pressed && { opacity: 0.9, transform: [{ scale: 0.96 }] },
                ]}>
                <Ionicons name="person-add" size={13} color="#064E3B" />
                <Text style={styles.heroAddBtnText}>
                  {language === 'ur' ? '+ نیا گاہک' : '+ Customer'}
                </Text>
              </Pressable>
            </View>

            {/* Giant Clean Amount */}
            <Text style={styles.heroAmount}>
              {settings.currencySymbol}
              {totalUdhaarReceivable.toLocaleString()}
            </Text>

            {/* Translucent Soft Status Pills inside Hero Card */}
            <View style={styles.heroCapsulesRow}>
              <View style={styles.heroCapsule}>
                <Text style={styles.heroCapsuleText}>
                  {pendingCount} {language === 'ur' ? 'گاہکوں کا ادھار' : 'pending accounts'}
                </Text>
              </View>

              {overdueCustomers.length > 0 ? (
                <View style={[styles.heroCapsule, styles.heroCapsuleOverdue]}>
                  <Ionicons name="alert-circle" size={12} color="#FEE2E2" />
                  <Text style={styles.heroCapsuleOverdueText}>
                    {overdueCustomers.length} {language === 'ur' ? 'تاخیر' : 'overdue'}
                  </Text>
                </View>
              ) : null}

              {recoveredThisMonth > 0 ? (
                <View style={styles.heroCapsule}>
                  <Text style={styles.heroCapsuleText}>
                    +{settings.currencySymbol}{recoveredThisMonth.toLocaleString()} {language === 'ur' ? 'وصول' : 'recovered'}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        ) : (
          /* Supplier Hero Card (Warm Amber Tone) */
          <View
            style={[
              styles.heroCard,
              {
                backgroundColor: settings.darkMode ? '#78350F' : '#D97706',
              },
            ]}>
            <View style={styles.heroTopRow}>
              <View style={styles.heroLabelWrap}>
                <Text style={styles.heroLabel}>
                  {language === 'ur' ? 'کل سپلائر واجبات (دینے ہیں)' : 'TOTAL PAYABLE TO SUPPLIERS'}
                </Text>
              </View>

              <Pressable
                onPress={handleOpenAddSupplier}
                style={({ pressed }) => [
                  styles.heroAddBtn,
                  pressed && { opacity: 0.9, transform: [{ scale: 0.96 }] },
                ]}>
                <Ionicons name="bus" size={13} color="#78350F" />
                <Text style={[styles.heroAddBtnText, { color: '#78350F' }]}>
                  {language === 'ur' ? '+ نیا سپلائر' : '+ Supplier'}
                </Text>
              </Pressable>
            </View>

            <Text style={styles.heroAmount}>
              {settings.currencySymbol}
              {totalSupplierPayable.toLocaleString()}
            </Text>

            <View style={styles.heroCapsulesRow}>
              <View style={styles.heroCapsule}>
                <Text style={styles.heroCapsuleText}>
                  {suppliers.length} {language === 'ur' ? 'فعال سپلائرز' : 'active suppliers'}
                </Text>
              </View>

              {supplierPaymentsThisMonth > 0 ? (
                <View style={styles.heroCapsule}>
                  <Text style={styles.heroCapsuleText}>
                    {settings.currencySymbol}{supplierPaymentsThisMonth.toLocaleString()} {language === 'ur' ? 'ادا شدہ' : 'paid this month'}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        )}
      </View>

      {/* ── Content Body: Search, Filters, List ── */}
      <View style={styles.contentWrap}>
        {activeLedgerTab === 'customers' ? (
          <>
            {/* Search Bar */}
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={language === 'ur' ? 'گاہک کا نام، نمبر یا پتہ تلاش کریں...' : 'Search customer by name or phone...'}
              height={42}
            />

            {/* Filter Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScroll}
              contentContainerStyle={styles.filterScrollContent}>
              <FilterChip
                label={t('filterKhataAll')}
                isActive={selectedFilter === 'all'}
                onPress={() => setSelectedFilter('all')}
                count={khata.length}
              />
              <FilterChip
                label={t('filterPending')}
                isActive={selectedFilter === 'pending'}
                onPress={() => setSelectedFilter('pending')}
                count={pendingCount}
              />
              <FilterChip
                label={t('filterOverdue')}
                isActive={selectedFilter === 'overdue'}
                onPress={() => setSelectedFilter('overdue')}
                variant="alert"
                icon="warning"
                count={overdueCustomers.length}
                activeBg={theme.danger}
              />
              <FilterChip
                label={t('filterSettled')}
                isActive={selectedFilter === 'settled'}
                onPress={() => setSelectedFilter('settled')}
                count={settledCount}
                activeBg={theme.success}
              />
            </ScrollView>

            {/* Customers List */}
            {filteredCustomers.length === 0 ? (
              <EmptyState
                icon="people-outline"
                title={t('noKhataFound')}
                subtitle={
                  searchQuery
                    ? language === 'ur'
                      ? 'مختلف نام یا فون نمبر سے تلاش کریں'
                      : 'Try a different name or phone number.'
                    : language === 'ur'
                    ? 'ابھی کوئی اُدھار کھاتہ نہیں ہے'
                    : 'No customers match the current filter.'
                }
                actionLabel={
                  !searchQuery && selectedFilter === 'all'
                    ? (language === 'ur' ? '+ نیا گاہک درج کریں' : '+ Add New Customer')
                    : undefined
                }
                onAction={
                  !searchQuery && selectedFilter === 'all'
                    ? handleOpenAddCustomer
                    : undefined
                }
              />
            ) : (
              <ScrollView
                style={styles.customersScroll}
                contentContainerStyle={[
                  styles.customersList,
                  tourStep === 6 && { paddingBottom: 220 },
                ]}
                showsVerticalScrollIndicator={false}>
                {filteredCustomers.map((customer, idx) => (
                  <View key={customer.id} style={{ position: 'relative' }}>
                    {tourStep === 6 && idx === 0 && (
                      <TourBeacon
                        textUrdu="1-ٹیپ واٹس ایپ بل کا بٹن دیکھیں"
                        textEn="1-Tap WhatsApp Bill Reminder"
                        position="top"
                        onSkip={endHandsOnTour}
                      />
                    )}
                    <CustomerKhataCard
                      customer={customer}
                      isExpanded={expandedCustId === customer.id}
                      onToggleExpand={() =>
                        setExpandedCustId((prev) =>
                          prev === customer.id ? null : customer.id
                        )
                      }
                      onRecordPayment={handleRecordPayment}
                      onAddCredit={handleOpenAddCredit}
                      overdueDays={
                        isOverdueCustomer(customer)
                          ? daysSince(getLastActivityDate(customer))
                          : 0
                      }
                    />
                  </View>
                ))}
              </ScrollView>
            )}
          </>
        ) : (
          /* ==================== TAB 2: SUPPLIERS ==================== */
          <>
            {/* Supplier Search */}
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={language === 'ur' ? 'سپلائر یا کمپنی تلاش کریں...' : 'Search supplier or company...'}
              height={42}
            />

            {/* Suppliers List */}
            {filteredSuppliers.length === 0 ? (
              <EmptyState
                icon="bus-outline"
                title={language === 'ur' ? 'کوئی سپلائر نہیں ملا' : 'No Suppliers Found'}
                subtitle={
                  searchQuery
                    ? language === 'ur'
                      ? 'مختلف نام یا کمپنی سے تلاش کریں'
                      : 'Try a different supplier name or company.'
                    : language === 'ur'
                    ? 'ڈسٹری بیوٹرز (یونی لیور، شان، بیکری) کا ادھار کھاتہ رکھنے کے لیے نیا سپلائر شامل کریں۔'
                    : 'Track deliveries, wholesale credit, and payments by adding your first supplier.'
                }
                actionLabel={language === 'ur' ? '+ نیا سپلائر شامل کریں' : '+ Add New Supplier'}
                onAction={handleOpenAddSupplier}
              />
            ) : (
              <ScrollView
                style={styles.customersScroll}
                contentContainerStyle={styles.customersList}
                showsVerticalScrollIndicator={false}>
                {filteredSuppliers.map((sup) => (
                  <SupplierCard
                    key={sup.id}
                    supplier={sup}
                    currencySymbol={settings.currencySymbol}
                    language={language}
                    isDarkMode={settings.darkMode}
                    isExpanded={expandedSupplierId === sup.id}
                    onToggleExpand={() =>
                      setExpandedSupplierId((prev) => (prev === sup.id ? null : sup.id))
                    }
                    onAddPurchase={handleOpenAddPurchase}
                    onMakePayment={handleOpenMakePayment}
                    onDelete={handleDeleteSupplier}
                  />
                ))}
              </ScrollView>
            )}
          </>
        )}
      </View>

      {/* Customer Payment Modal */}
      <KhataModal
        customer={selectedCustomer}
        visible={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedCustomer(null);
        }}
      />

      {/* Customer Modal: Add Customer with Opening Debt & Direct Credit */}
      <CustomerModal
        visible={isCustomerModalOpen}
        mode={customerModalMode}
        customer={selectedCustomer}
        currencySymbol={settings.currencySymbol}
        language={language}
        isDarkMode={settings.darkMode}
        onClose={() => {
          setIsCustomerModalOpen(false);
          setSelectedCustomer(null);
        }}
        onSaveCustomer={handleSaveCustomer}
        onSaveCredit={handleSaveCredit}
      />

      {/* Supplier Modal */}
      <SupplierModal
        visible={isSupplierModalOpen}
        mode={supplierModalMode}
        supplier={selectedSupplier}
        currencySymbol={settings.currencySymbol}
        language={language}
        isDarkMode={settings.darkMode}
        onClose={() => {
          setIsSupplierModalOpen(false);
          setSelectedSupplier(null);
        }}
        onSaveSupplier={handleSaveSupplier}
        onSavePurchase={handleSavePurchase}
        onSavePayment={handleSavePayment}
      />

      {/* Hands-On Tour Step 6: Advance to Cash Drawer & Profit */}
      {tourStep === 6 && (
        <FloatingTourPrompt
          bottom={10}
          badgeUrdu="مرحلہ 2 مکمل ✓"
          badgeEn="Step 2 Complete ✓"
          messageUrdu="گاہکوں کا ادھار اور 1-کلک واٹس ایپ یاددہانی۔ اب گلہ اور منافع دیکھیں۔"
          messageEn="Customer ledger with 1-click WhatsApp bills. Next, see cash in drawer."
          buttonUrdu="گلہ اور منافع دیکھیں ➔"
          buttonEn="Next: See Cash in Drawer ➔"
          onPressButton={() => {
            setActiveTab('dashboard');
            setTourStep(7);
          }}
          onSkip={endHandsOnTour}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 10,
    paddingBottom: 4,
    maxWidth: 720,
    marginHorizontal: 'auto',
    width: '100%',
    gap: 10,
  },

  // Soft Pill Segment Switcher
  segmentContainer: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 3,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 12,
  },
  segmentBtnActive: {
    ...Shadows.sm,
  },
  segmentBtnText: {
    fontSize: 12.5,
  },
  segmentBtnTextActive: {
    fontWeight: '800',
  },
  segmentBtnTextInactive: {
    fontWeight: '600',
  },

  // SadaPay-inspired Hero Card
  heroCard: {
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 8,
    ...Shadows.md,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  heroLabelWrap: {
    flex: 1,
  },
  heroLabel: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  heroAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    ...Shadows.sm,
  },
  heroAddBtnText: {
    color: '#064E3B',
    fontSize: 12,
    fontWeight: '800',
  },
  heroAmount: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  heroCapsulesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    paddingTop: 2,
  },
  heroCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 999,
  },
  heroCapsuleText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  heroCapsuleOverdue: {
    backgroundColor: 'rgba(239, 68, 68, 0.35)',
  },
  heroCapsuleOverdueText: {
    color: '#FEE2E2',
    fontSize: 11,
    fontWeight: '800',
  },

  // Content Area
  contentWrap: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: 8,
    maxWidth: 720,
    marginHorizontal: 'auto',
    width: '100%',
    gap: Spacing.sm,
  },

  filterScroll: {
    maxHeight: 38,
  },
  filterScrollContent: {
    gap: 6,
    alignItems: 'center',
  },

  customersScroll: {
    flex: 1,
  },
  customersList: {
    gap: 10,
    paddingBottom: 100,
  },
});
