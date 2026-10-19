import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Platform,
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
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
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
  } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

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

  const softBorder = settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(148,163,184,0.4)';
  const cardBg = settings.darkMode ? theme.card : '#FFFFFF';

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

  const buildReminderMessage = (customer: CustomerKhata) => {
    const msgLang = settings.whatsappReminderLanguage || language;
    const shopHeader =
      msgLang === 'ur' && settings.shopNameUrdu ? settings.shopNameUrdu : settings.shopName;
    const name =
      msgLang === 'ur' && customer.nameUrdu ? customer.nameUrdu : customer.name;
    const amount = `${settings.currencySymbol} ${Math.max(0, customer.totalDebt).toLocaleString()}`;

    if (msgLang === 'ur') {
      return `السلام علیکم ${name} صاحب!\n\nیہ ایک شائستہ یاد دہانی ہے کہ *${shopHeader}* پر آپ کا کل واجب الادا بقایا ادھار:\n👉 *${amount}* ہے۔\n\nشکریہ!\n*${settings.shopName}*`;
    }
    return `Dear ${name},\n\nGentle reminder from *${shopHeader}* regarding your pending balance:\n👉 *${amount}*\n\nThank you!\n*${settings.shopName}*`;
  };

  const openWhatsApp = (phone: string, message: string) => {
    const encoded = encodeURIComponent(message);
    const clean = phone.replace(/[^0-9]/g, '');
    const url = clean
      ? `https://wa.me/${clean.startsWith('92') ? clean : '92' + clean.replace(/^0/, '')}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;
    Linking.openURL(url).catch(() => {
      if (Platform.OS === 'web') window.open(url, '_blank');
    });
  };

  const handleNotifyAllOverdue = () => {
    const withPhone = overdueCustomers.filter((c) => c.phone);
    if (withPhone.length === 0) {
      showAlert({
        type: 'info',
        title: t('overdueFollowUp'),
        message:
          language === 'ur'
            ? 'واجب الادا گاہکوں کے فون نمبر موجود نہیں۔'
            : 'No overdue customers with phone numbers.',
        buttons: [{ text: t('close'), style: 'cancel' }],
      });
      return;
    }

    const first = withPhone[0];
    showAlert({
      type: 'confirm',
      title: t('notifyAll'),
      message:
        language === 'ur'
          ? `${withPhone.length} گاہکوں کو یاد دہانی بھیجنی ہے؟ پہلا واٹس ایپ کھلے گا۔`
          : `Send reminders to ${withPhone.length} overdue customers? WhatsApp will open for the first one.`,
      buttons: [
        {
          text: t('notifyAll'),
          onPress: () => openWhatsApp(first.phone, buildReminderMessage(first)),
        },
        { text: t('cancel'), style: 'cancel' },
      ],
    });
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
      {/* ── Top Emerald Canopy (Seamless continuation from ShopHeader) ── */}
      <View style={[styles.heroCanopy, { backgroundColor: theme.heroBg }]}>
        <View style={styles.heroInner}>
          {/* Title + Action Button */}
          <View style={styles.titleRow}>
            <View style={styles.titleBlock}>
              <Text style={styles.screenTitle}>
                {activeLedgerTab === 'customers' ? t('khataTitleSimple') : (language === 'ur' ? 'سپلائر کھاتہ' : 'Supplier Ledger')}
              </Text>
              <Text style={styles.screenSubtitle}>
                {activeLedgerTab === 'customers'
                  ? t('khataSubtitleSimple')
                  : (language === 'ur'
                    ? 'ڈسٹری بیوٹرز اور ہول سیلرز کے واجبات اور ادائیگیاں'
                    : 'Distributor deliveries, payables, and payments')}
              </Text>
            </View>

            {activeLedgerTab === 'customers' ? (
              <Pressable
                onPress={handleOpenAddCustomer}
                style={({ pressed }) => [
                  styles.addBtn,
                  pressed && { opacity: 0.9, transform: [{ scale: 0.96 }] },
                ]}>
                <Ionicons name="person-add" size={15} color="#064E3B" />
                <Text style={styles.addBtnText}>
                  {language === 'ur' ? '+ نیا گاہک' : '+ Add Customer'}
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={handleOpenAddSupplier}
                style={({ pressed }) => [
                  styles.addBtn,
                  pressed && { opacity: 0.9, transform: [{ scale: 0.96 }] },
                ]}>
                <Ionicons name="person-add" size={15} color="#064E3B" />
                <Text style={styles.addBtnText}>
                  {language === 'ur' ? '+ نیا سپلائر' : '+ Add Supplier'}
                </Text>
              </Pressable>
            )}
          </View>

          {/* ── Segment Switcher: Customers vs Suppliers (Frosted glass container) ── */}
          <View style={styles.segmentContainer}>
            <Pressable
              onPress={() => {
                setActiveLedgerTab('customers');
                setSearchQuery('');
              }}
              style={[
                styles.segmentBtn,
                activeLedgerTab === 'customers' && styles.segmentBtnActive,
              ]}>
              <Ionicons
                name="people"
                size={14}
                color={activeLedgerTab === 'customers' ? '#064E3B' : 'rgba(255, 255, 255, 0.75)'}
              />
              <Text
                style={[
                  styles.segmentBtnText,
                  activeLedgerTab === 'customers' ? styles.segmentBtnTextActive : styles.segmentBtnTextInactive,
                ]}>
                {language === 'ur' ? 'گاہک کھاتہ (لینے ہیں)' : 'Customers (Receivable)'} ({khata.length})
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setActiveLedgerTab('suppliers');
                setSearchQuery('');
              }}
              style={[
                styles.segmentBtn,
                activeLedgerTab === 'suppliers' && styles.segmentBtnActive,
              ]}>
              <Ionicons
                name="bus"
                size={14}
                color={activeLedgerTab === 'suppliers' ? '#064E3B' : 'rgba(255, 255, 255, 0.75)'}
              />
              <Text
                style={[
                  styles.segmentBtnText,
                  activeLedgerTab === 'suppliers' ? styles.segmentBtnTextActive : styles.segmentBtnTextInactive,
                ]}>
                {language === 'ur' ? 'سپلائر کھاتہ (دینے ہیں)' : 'Suppliers (Payable)'} ({suppliers.length})
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.contentWrap}>

        {/* ==================== TAB 1: CUSTOMERS ==================== */}
        {activeLedgerTab === 'customers' ? (
          <>
            {/* Total receivable card */}
            <View
              style={[
                styles.summaryCard,
                { backgroundColor: cardBg, borderColor: softBorder },
              ]}>
              <View style={styles.summaryTop}>
                <View style={styles.summaryTopLeft}>
                  <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>
                    {t('totalReceivable')}
                  </Text>
                  <Text
                    style={[
                      styles.summaryValue,
                      {
                        color:
                          totalUdhaarReceivable > 0 ? theme.danger : theme.success,
                      },
                    ]}>
                    {settings.currencySymbol}
                    {totalUdhaarReceivable.toLocaleString()}
                  </Text>
                </View>
                {overdueCustomers.length > 0 ? (
                  <View
                    style={[
                      styles.urgentPill,
                      { backgroundColor: theme.dangerLight },
                    ]}>
                    <Ionicons name="alert" size={11} color={theme.danger} />
                    <Text style={[styles.urgentPillText, { color: theme.danger }]}>
                      {overdueCustomers.length} {t('filterOverdue')}
                    </Text>
                  </View>
                ) : null}
              </View>

              <View style={[styles.summaryGrid, { borderTopColor: softBorder }]}>
                <View style={styles.statCol}>
                  <Text style={[styles.statLabel, { color: theme.textMuted }]}>
                    {t('pendingDebtors')}
                  </Text>
                  <Text style={[styles.statValue, { color: theme.text }]}>
                    {pendingCount} {t('accountsLabel')}
                  </Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: softBorder }]} />
                <View style={styles.statCol}>
                  <Text style={[styles.statLabel, { color: theme.textMuted }]}>
                    {t('recoveredThisMonth')}
                  </Text>
                  <Text style={[styles.statValue, { color: theme.primary }]}>
                    {settings.currencySymbol}
                    {recoveredThisMonth.toLocaleString()}
                  </Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: softBorder }]} />
                <View style={styles.statCol}>
                  <Text style={[styles.statLabel, { color: theme.textMuted }]}>
                    {t('filterSettled')}
                  </Text>
                  <Text style={[styles.statValue, { color: theme.textSecondary }]}>
                    {settledCount}
                  </Text>
                </View>
              </View>
            </View>

            {/* Overdue follow-up */}
            {overdueCustomers.length > 0 ? (
              <View
                style={[
                  styles.followUpBanner,
                  {
                    backgroundColor: settings.darkMode
                      ? 'rgba(16,185,129,0.12)'
                      : 'rgba(167,243,208,0.35)',
                    borderColor: settings.darkMode
                      ? 'rgba(16,185,129,0.3)'
                      : 'rgba(5,150,105,0.25)',
                  },
                ]}>
                <View style={styles.followUpLeft}>
                  <View
                    style={[
                      styles.followUpIcon,
                      { backgroundColor: theme.primary },
                    ]}>
                    <Ionicons name="flash" size={14} color="#FFFFFF" />
                  </View>
                  <View style={styles.followUpText}>
                    <Text style={[styles.followUpTitle, { color: theme.text }]}>
                      {t('overdueFollowUp')}
                    </Text>
                    <Text style={[styles.followUpSub, { color: theme.textMuted }]}>
                      {overdueCustomers.length} {t('overdueFollowUpSub')}
                    </Text>
                  </View>
                </View>
                <Pressable
                  onPress={handleNotifyAllOverdue}
                  style={({ pressed }) => [
                    styles.notifyBtn,
                    { backgroundColor: theme.primary },
                    pressed && { opacity: 0.9 },
                  ]}>
                  <Text style={styles.notifyBtnText}>{t('notifyAll')}</Text>
                </Pressable>
              </View>
            ) : null}

            {/* Search */}
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={t('searchCustomer')}
              height={40}
            />

            {/* Filters */}
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
                contentContainerStyle={styles.customersList}
                showsVerticalScrollIndicator={false}>
                {filteredCustomers.map((customer) => (
                  <CustomerKhataCard
                    key={customer.id}
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
                ))}
              </ScrollView>
            )}
          </>
        ) : (
          /* ==================== TAB 2: SUPPLIERS ==================== */
          <>
            {/* Total Payable Summary Card */}
            <View
              style={[
                styles.summaryCard,
                { backgroundColor: cardBg, borderColor: softBorder },
              ]}>
              <View style={styles.summaryTop}>
                <View style={styles.summaryTopLeft}>
                  <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>
                    {language === 'ur' ? 'کل واجب الادا رقم (دینے ہیں)' : 'Total Payable to Suppliers'}
                  </Text>
                  <Text
                    style={[
                      styles.summaryValue,
                      {
                        color: totalSupplierPayable > 0 ? '#D97706' : theme.success,
                      },
                    ]}>
                    {settings.currencySymbol}
                    {totalSupplierPayable.toLocaleString()}
                  </Text>
                </View>
                <View
                  style={[
                    styles.urgentPill,
                    { backgroundColor: theme.surfaceSubtle },
                  ]}>
                  <Ionicons name="bus" size={12} color={theme.primary} />
                  <Text style={[styles.urgentPillText, { color: theme.textSecondary }]}>
                    {suppliers.length} {language === 'ur' ? 'سپلائرز' : 'Suppliers'}
                  </Text>
                </View>
              </View>

              <View style={[styles.summaryGrid, { borderTopColor: softBorder }]}>
                <View style={styles.statCol}>
                  <Text style={[styles.statLabel, { color: theme.textMuted }]}>
                    {language === 'ur' ? 'کل سپلائرز' : 'Active Suppliers'}
                  </Text>
                  <Text style={[styles.statValue, { color: theme.text }]}>
                    {suppliers.length}
                  </Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: softBorder }]} />
                <View style={styles.statCol}>
                  <Text style={[styles.statLabel, { color: theme.textMuted }]}>
                    {language === 'ur' ? 'اس ماہ ادائیگیاں' : 'Paid This Month'}
                  </Text>
                  <Text style={[styles.statValue, { color: theme.primary }]}>
                    {settings.currencySymbol}
                    {supplierPaymentsThisMonth.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>

            {/* Supplier Search */}
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={language === 'ur' ? 'سپلائر یا کمپنی تلاش کریں...' : 'Search supplier or company...'}
              height={40}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroCanopy: {
    width: '100%',
    paddingTop: 8,
    paddingBottom: 12,
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
    maxWidth: 720,
    marginHorizontal: 'auto',
    width: '100%',
    paddingHorizontal: Spacing.lg,
    gap: 10,
  },
  contentWrap: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: 10,
    maxWidth: 720,
    marginHorizontal: 'auto',
    width: '100%',
    gap: Spacing.sm,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  titleBlock: { flex: 1, gap: 1 },
  screenTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  screenSubtitle: {
    color: 'rgba(255, 255, 255, 0.78)',
    fontSize: 11.5,
    fontWeight: '500',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    ...Shadows.sm,
  },
  addBtnText: {
    color: '#064E3B',
    fontSize: 12,
    fontWeight: '800',
  },

  // Segment Tab
  segmentContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    borderColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    ...Shadows.sm,
  },
  segmentBtnText: {
    fontSize: 12,
  },
  segmentBtnTextActive: {
    color: '#064E3B',
    fontWeight: '800',
  },
  segmentBtnTextInactive: {
    color: 'rgba(255, 255, 255, 0.78)',
    fontWeight: '600',
  },

  summaryCard: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    ...Shadows.sm,
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  summaryTopLeft: { flex: 1, gap: 1 },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  urgentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  urgentPillText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  summaryGrid: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 8,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
    gap: 1,
    paddingHorizontal: 2,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    marginVertical: 1,
  },

  followUpBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  followUpLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    flex: 1,
  },
  followUpIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followUpText: { flex: 1, gap: 0 },
  followUpTitle: { fontSize: 12, fontWeight: '700' },
  followUpSub: { fontSize: 10.5, fontWeight: '500' },
  notifyBtn: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
  },
  notifyBtnText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
  },

  filterScroll: { maxHeight: 38 },
  filterScrollContent: { gap: 6, alignItems: 'center' },

  customersScroll: { flex: 1 },
  customersList: { gap: Spacing.md, paddingBottom: 100 },
});
