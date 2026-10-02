import React, { useMemo, useState } from 'react';
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
import { CustomerKhata } from '@/types';
import { useShop } from '@/context/ShopContext';
import { KhataModal } from '@/components/KhataModal';
import { CustomerKhataCard } from '@/components/CustomerKhataCard';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterChip } from '@/components/ui/FilterChip';
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
  } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<KhataFilter>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerKhata | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [expandedCustId, setExpandedCustId] = useState<string | null>(null);

  const softBorder = settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(148,163,184,0.4)';
  const cardBg = settings.darkMode ? theme.card : '#FFFFFF';

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

    // Highest debt first for pending/overdue; settled last by name
    return [...list].sort((a, b) => {
      if (selectedFilter === 'settled') return a.name.localeCompare(b.name);
      return (b.totalDebt || 0) - (a.totalDebt || 0);
    });
  }, [khata, searchQuery, selectedFilter]);

  const handleRecordPayment = (customer: CustomerKhata) => {
    if (customer.totalDebt <= 0) return;
    setSelectedCustomer(customer);
    setIsPaymentModalOpen(true);
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

    // Open first reminder; shopkeeper can send one-by-one (bulk WA API needs paid tools)
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

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.contentWrap}>
        {/* Title + New Sale */}
        <View style={styles.titleRow}>
          <View style={styles.titleBlock}>
            <Text style={[styles.screenTitle, { color: theme.text }]}>
              {t('khataTitleSimple')}
            </Text>
            <Text style={[styles.screenSubtitle, { color: theme.textMuted }]}>
              {t('khataSubtitleSimple')}
            </Text>
          </View>
          <Pressable
            onPress={() => setActiveTab('sale')}
            style={({ pressed }) => [
              styles.addBtn,
              { backgroundColor: theme.primary },
              pressed && { opacity: 0.9, transform: [{ scale: 0.96 }] },
            ]}>
            <Ionicons name="add" size={16} color="#FFFFFF" />
            <Text style={styles.addBtnText}>{t('newUdhaarSale')}</Text>
          </Pressable>
        </View>

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

        {/* Overdue follow-up — only when useful */}
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

        {/* List */}
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
              !searchQuery && selectedFilter === 'all' ? t('newBillBtn') : undefined
            }
            onAction={
              !searchQuery && selectedFilter === 'all'
                ? () => setActiveTab('sale')
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
                overdueDays={
                  isOverdueCustomer(customer)
                    ? daysSince(getLastActivityDate(customer))
                    : 0
                }
              />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentWrap: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
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
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  screenSubtitle: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    ...Shadows.sm,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
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
