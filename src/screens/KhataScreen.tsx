import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomerKhata } from '@/types';
import { useShop } from '@/context/ShopContext';
import { KhataModal } from '@/components/KhataModal';
import { CustomerKhataCard } from '@/components/CustomerKhataCard';
import { CustomerModal, CustomerModalMode } from '@/components/CustomerModal';
import { Colors, Spacing } from '@/constants/theme';
import { TourBeacon } from '@/components/TourBeacon';
import { FloatingTourPrompt } from '@/components/FloatingTourPrompt';
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
    setActiveTab,
    showAlert,
    addCustomer,
    addCustomerCredit,
    tourStep,
    setTourStep,
    endHandsOnTour,
  } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const softBorder = settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(148,163,184,0.18)';
  const isUrdu = language === 'ur';

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
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.topSection}>
        <View style={styles.titleRow}>
          <Text style={[styles.screenTitleText, { color: theme.text }]}>
            {isUrdu ? 'کھاتہ' : 'Khata'}
          </Text>
          <Text style={[styles.countText, { color: theme.textMuted }]}>
            {khata.length}{' '}
            {isUrdu ? 'گاہک' : khata.length === 1 ? 'customer' : 'customers'}
          </Text>
        </View>

        <View style={[styles.heroCard, { backgroundColor: theme.heroFill }]}>
          <Text style={styles.heroLabel}>
            {isUrdu ? 'کل وصول طلب ادھار' : 'To collect'}
          </Text>
          <Text style={styles.heroAmount}>
            {settings.currencySymbol}
            {totalUdhaarReceivable.toLocaleString()}
          </Text>
          {recoveredThisMonth > 0 ? (
            <Text style={styles.heroSub}>
              +{settings.currencySymbol}
              {recoveredThisMonth.toLocaleString()}{' '}
              {isUrdu ? 'اس مہینے وصول' : 'recovered this month'}
            </Text>
          ) : (
            <Text style={styles.heroSub}>
              {pendingCount}{' '}
              {isUrdu ? 'گاہکوں کا ادھار باقی' : 'accounts with balance'}
            </Text>
          )}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isUrdu ? 'نیا گاہک' : 'Add customer'}
          onPress={handleOpenAddCustomer}
          style={({ pressed }) => [
            styles.actionTile,
            { backgroundColor: theme.secondary },
            pressed && { opacity: 0.9 },
          ]}>
          <View style={styles.actionIconWrap}>
            <Ionicons name="person-add" size={16} color="#FFFFFF" />
          </View>
          <View style={styles.actionTileCopy}>
            <Text style={styles.actionTileTitle}>
              {isUrdu ? 'نیا گاہک' : 'Add customer'}
            </Text>
            <Text style={styles.actionTileSub}>
              {isUrdu ? 'کھاتہ کھولیں' : 'Open a new ledger'}
            </Text>
          </View>
        </Pressable>

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
      </View>

      <View style={styles.contentWrap}>
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
      </View>

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
    paddingTop: 8,
    paddingBottom: 4,
    maxWidth: 720,
    marginHorizontal: 'auto',
    width: '100%',
    gap: 10,
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
  heroCard: {
    borderRadius: 18,
    borderCurve: 'continuous',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 4,
  },
  heroLabel: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    fontWeight: '600',
  },
  heroAmount: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.6,
    fontVariant: ['tabular-nums'],
  },
  heroSub: {
    color: 'rgba(255, 255, 255, 0.78)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  actionTile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 18,
    borderCurve: 'continuous',
    padding: 12,
    minHeight: 64,
  },
  actionIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTileCopy: {
    flex: 1,
    gap: 1,
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
  metricRow: {
    flexDirection: 'row',
    gap: 8,
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
