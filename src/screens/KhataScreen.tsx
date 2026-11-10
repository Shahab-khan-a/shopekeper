import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Easing,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomerKhata } from '@/types';
import { useShop } from '@/context/ShopContext';
import { KhataModal } from '@/components/KhataModal';
import { CustomerKhataCard } from '@/components/CustomerKhataCard';
import { CustomerModal, CustomerModalMode } from '@/components/CustomerModal';
import { Colors, Spacing } from '@/constants/theme';
import { SearchBar } from '@/components/ui/SearchBar';
import { EmptyState } from '@/components/ui/EmptyState';

type KhataFilter = 'all' | 'pending' | 'overdue' | 'settled';

const OVERDUE_DAYS = 7;

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
    showAlert,
    addCustomer,
    addCustomerCredit,
  } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const softBorder = settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(148,163,184,0.18)';
  const isUrdu = language === 'ur';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<KhataFilter>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerKhata | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerModalMode, setCustomerModalMode] = useState<CustomerModalMode>('add_customer');
  const [expandedCustId, setExpandedCustId] = useState<string | null>(null);



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
        title: isUrdu ? 'گاہک محفوظ ہو گیا' : 'Customer Saved',
        message: isUrdu
          ? `${data.nameUrdu || data.name} کو کھاتے میں کامیابی سے شامل کر دیا گیا۔`
          : `${data.name} has been added to customer ledger.`,
      });
    } catch (err) {
      console.error('[KhataScreen] Error saving customer:', err);
      showAlert({
        type: 'warning',
        title: isUrdu ? 'محفوظ نہیں ہو سکا' : 'Could Not Save Customer',
        message: isUrdu ? 'گاہک محفوظ کرنے میں خرابی پیش آگئی۔ دوبارہ کوشش کریں۔' : 'Failed to save customer. Please try again.',
      });
    }
  };

  const handleSaveCredit = async (customerId: string, amount: number, note?: string) => {
    try {
      await addCustomerCredit(customerId, amount, note);
      showAlert({
        type: 'success',
        title: isUrdu ? 'ادھار درج ہو گیا' : 'Credit Recorded',
        message: isUrdu
          ? `${settings.currencySymbol}${amount.toLocaleString()} کا نیا ادھار درج کر دیا گیا۔`
          : `Added ${settings.currencySymbol}${amount.toLocaleString()} credit entry.`,
      });
    } catch (err) {
      console.error('[KhataScreen] Error recording credit:', err);
      showAlert({
        type: 'warning',
        title: isUrdu ? 'ادھار درج نہیں ہو سکا' : 'Could Not Record Credit',
        message: isUrdu ? 'ادھار کی انٹری محفوظ کرنے میں خرابی پیش آگئی۔ دوبارہ کوشش کریں۔' : 'Failed to record credit entry. Please try again.',
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.khataMainScroll}
        stickyHeaderIndices={[1]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.khataScrollContent}>
        {/* Index 0: Top Cards (Khata Title & Hero "To collect" / Add customer cards) */}
        <View style={styles.topSection}>
          <View style={styles.topCardsWrap}>
            <View style={styles.titleRow}>
              <Text style={[styles.screenTitleText, { color: theme.text }]}>
                {isUrdu ? 'کھاتہ' : 'Khata'}
              </Text>
              <Text style={[styles.countText, { color: theme.textMuted }]}>
                {khata.length}{' '}
                {isUrdu ? 'گاہک' : khata.length === 1 ? 'customer' : 'customers'}
              </Text>
            </View>

            <View style={styles.heroRow}>
              <View style={[styles.heroCard, { backgroundColor: theme.heroFill }]}>
                <Text style={styles.heroLabel} numberOfLines={1}>
                  {isUrdu ? 'کل وصول طلب ادھار' : 'To collect'}
                </Text>
                <Text
                  style={styles.heroAmount}
                  numberOfLines={1}
                  adjustsFontSizeToFit>
                  {settings.currencySymbol}
                  {totalUdhaarReceivable.toLocaleString()}
                </Text>
                {recoveredThisMonth > 0 ? (
                  <Text style={styles.heroSub} numberOfLines={1}>
                    +{settings.currencySymbol}
                    {recoveredThisMonth.toLocaleString()}{' '}
                    {isUrdu ? 'اس مہینے وصول' : 'recovered'}
                  </Text>
                ) : (
                  <Text style={styles.heroSub} numberOfLines={1}>
                    {pendingCount}{' '}
                    {isUrdu ? 'گاہکوں کا ادھار' : 'with balance'}
                  </Text>
                )}
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={isUrdu ? 'نیا گاہک شامل کریں' : 'Add customer'}
                onPress={handleOpenAddCustomer}
                style={({ pressed }) => [
                  styles.addCustomerCard,
                  { backgroundColor: theme.secondary },
                  pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
                ]}>
                <View style={styles.addCustomerIconWrap}>
                  <Ionicons name="person-add" size={18} color="#FFFFFF" />
                </View>
                <View style={styles.addCustomerTextWrap}>
                  <Text style={styles.addCustomerTitle} numberOfLines={1}>
                    {isUrdu ? 'نیا گاہک' : 'Add Customer'}
                  </Text>
                  <Text style={styles.addCustomerSub} numberOfLines={1}>
                    {isUrdu ? '+ نیا کھاتہ' : '+ New ledger'}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Index 1: Sticky Search Bar (Pins firmly to the top on scroll) */}
        <View
          style={[
            styles.stickySearchWrap,
            { backgroundColor: theme.background },
          ]}>
          <View style={styles.stickySearchInner}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={
                isUrdu
                  ? 'گاہک کا نام یا نمبر تلاش کریں...'
                  : 'Search by name or phone...'
              }
              height={42}
            />
          </View>
        </View>

        {/* Index 2: Metric Filter Row & Customers List */}
        <View style={styles.contentWrap}>
          <View style={styles.metricRow}>
            <Pressable
              onPress={() => setSelectedFilter('all')}
              style={({ pressed }) => [
                styles.metricCard,
                {
                  backgroundColor: theme.card,
                  borderColor: selectedFilter === 'all' ? theme.primary : softBorder,
                },
                pressed && { opacity: 0.88 },
              ]}>
              <Text style={[styles.metricLabel, { color: theme.textMuted }]}>
                {isUrdu ? 'تمام' : 'All'}
              </Text>
              <Text style={[styles.metricValue, { color: theme.text }]}>{khata.length}</Text>
            </Pressable>

            <Pressable
              onPress={() => setSelectedFilter('pending')}
              style={({ pressed }) => [
                styles.metricCard,
                {
                  backgroundColor: theme.card,
                  borderColor: selectedFilter === 'pending' ? theme.primary : softBorder,
                },
                pressed && { opacity: 0.88 },
              ]}>
              <Text style={[styles.metricLabel, { color: theme.textMuted }]}>
                {isUrdu ? 'ادھار' : 'Due'}
              </Text>
              <Text style={[styles.metricValue, { color: theme.text }]}>{pendingCount}</Text>
            </Pressable>

            <Pressable
              onPress={() => setSelectedFilter('overdue')}
              style={({ pressed }) => [
                styles.metricCard,
                {
                  backgroundColor: theme.card,
                  borderColor: selectedFilter === 'overdue' ? theme.danger : softBorder,
                },
                pressed && { opacity: 0.88 },
              ]}>
              <Text style={[styles.metricLabel, { color: theme.danger }]}>
                {isUrdu ? 'تاخیر' : 'Late'}
              </Text>
              <Text style={[styles.metricValue, { color: theme.danger }]}>
                {overdueCustomers.length}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setSelectedFilter('settled')}
              style={({ pressed }) => [
                styles.metricCard,
                {
                  backgroundColor: theme.card,
                  borderColor: selectedFilter === 'settled' ? theme.success : softBorder,
                },
                pressed && { opacity: 0.88 },
              ]}>
              <Text style={[styles.metricLabel, { color: theme.success }]}>
                {isUrdu ? 'صاف' : 'Clear'}
              </Text>
              <Text style={[styles.metricValue, { color: theme.success }]}>{settledCount}</Text>
            </Pressable>
          </View>

          {filteredCustomers.length === 0 ? (
            <EmptyState
              icon="people-outline"
              title={t('noKhataFound')}
              subtitle={
                searchQuery
                  ? isUrdu
                    ? 'مختلف نام یا فون نمبر سے تلاش کریں'
                    : 'Try a different name or phone number.'
                  : isUrdu
                    ? 'ابھی کوئی اُدھار کھاتہ نہیں ہے'
                    : 'No customers match the current filter.'
              }
              actionLabel={
                !searchQuery && selectedFilter === 'all'
                  ? isUrdu
                    ? '+ نیا گاہک درج کریں'
                    : '+ Add customer'
                  : undefined
              }
              onAction={
                !searchQuery && selectedFilter === 'all' ? handleOpenAddCustomer : undefined
              }
            />
          ) : (
            <View style={styles.customersList}>
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
            </View>
          )}
        </View>
      </ScrollView>

      <KhataModal
        customer={selectedCustomer}
        visible={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedCustomer(null);
        }}
      />

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  khataMainScroll: {
    flex: 1,
  },
  khataScrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.xl,
  },
  topSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 8,
    paddingBottom: 4,
    maxWidth: 720,
    marginHorizontal: 'auto',
    width: '100%',
    gap: 10,
  },
  topCardsWrap: {
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
    alignItems: 'baseline',
    gap: 8,
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
  heroRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 10,
  },
  heroCard: {
    flex: 1.6,
    borderRadius: 18,
    borderCurve: 'continuous',
    paddingHorizontal: 14,
    paddingVertical: 14,
    justifyContent: 'space-between',
    minHeight: 108,
    gap: 4,
  },
  heroLabel: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    fontWeight: '600',
  },
  heroAmount: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
  },
  heroSub: {
    color: 'rgba(255, 255, 255, 0.78)',
    fontSize: 11,
    fontWeight: '500',
  },
  addCustomerCard: {
    flex: 1,
    borderRadius: 18,
    borderCurve: 'continuous',
    padding: 12,
    justifyContent: 'space-between',
    minHeight: 108,
    gap: 8,
  },
  addCustomerIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCustomerTextWrap: {
    gap: 2,
  },
  addCustomerTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  addCustomerSub: {
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: 11,
    fontWeight: '500',
  },
  metricRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    gap: 1,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
    fontVariant: ['tabular-nums'],
  },
  contentWrap: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: 8,
    maxWidth: 720,
    marginHorizontal: 'auto',
    width: '100%',
  },
  customersScroll: {
    flex: 1,
  },
  customersList: {
    gap: 10,
    paddingBottom: 100,
  },
});
