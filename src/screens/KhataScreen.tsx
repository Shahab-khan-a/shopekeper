import React, { useState, useMemo } from 'react';
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
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterChip } from '@/components/ui/FilterChip';
import { EmptyState } from '@/components/ui/EmptyState';

type KhataFilter = 'all' | 'pending' | 'settled';

export const KhataScreen: React.FC = () => {
  const { khata, totalUdhaarReceivable, settings, t, language, setActiveTab } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<KhataFilter>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerKhata | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [expandedCustId, setExpandedCustId] = useState<string | null>(null);

  const pendingCount = useMemo(() => khata.filter((c) => c.totalDebt > 0).length, [khata]);
  const settledCount = useMemo(() => khata.filter((c) => c.totalDebt <= 0).length, [khata]);

  const filteredCustomers = useMemo(() => {
    return khata.filter((c) => {
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
      return true;
    });
  }, [khata, searchQuery, selectedFilter]);

  const handleRecordPayment = (customer: CustomerKhata) => {
    setSelectedCustomer(customer);
    setIsPaymentModalOpen(true);
  };

  const handleToggleExpand = (id: string) => {
    setExpandedCustId((prev) => (prev === id ? null : id));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.contentWrap}>
        {/* ── Total Udhaar Summary Banner ── */}
        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              borderLeftColor: totalUdhaarReceivable > 0 ? theme.danger : theme.success,
            },
          ]}>
          <View style={styles.summaryLeft}>
            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
              {t('totalReceivable')}
            </Text>
            <Text
              style={[
                styles.summaryValue,
                { color: totalUdhaarReceivable > 0 ? theme.danger : theme.success },
              ]}>
              {settings.currencySymbol} {totalUdhaarReceivable.toLocaleString()}
            </Text>

            <View style={styles.summaryBadgesRow}>
              <View style={[styles.summaryBadge, { backgroundColor: theme.dangerLight }]}>
                <Ionicons name="alert-circle" size={11} color={theme.danger} />
                <Text style={[styles.summaryBadgeText, { color: theme.danger }]}>
                  {pendingCount} {t('pendingDebt')}
                </Text>
              </View>
              <View style={[styles.summaryBadge, { backgroundColor: theme.successLight }]}>
                <Ionicons name="checkmark-circle" size={11} color={theme.success} />
                <Text style={[styles.summaryBadgeText, { color: theme.success }]}>
                  {settledCount} {t('settled')}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.summaryIconWrap,
              { backgroundColor: totalUdhaarReceivable > 0 ? theme.dangerLight : theme.successLight },
            ]}>
            <Ionicons
              name="book"
              size={30}
              color={totalUdhaarReceivable > 0 ? theme.danger : theme.success}
            />
          </View>
        </View>

        {/* ── Search Bar ── */}
        <View style={styles.searchWrap}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('searchCustomer')}
          />
        </View>

        {/* ── Filter Chips ── */}
        <View style={styles.filterRow}>
          <FilterChip
            label={`${t('filterKhataAll')} (${khata.length})`}
            isActive={selectedFilter === 'all'}
            onPress={() => setSelectedFilter('all')}
          />
          <FilterChip
            label={`${t('filterPending')} (${pendingCount})`}
            isActive={selectedFilter === 'pending'}
            onPress={() => setSelectedFilter('pending')}
            icon="time-outline"
            activeBg={theme.danger}
          />
          <FilterChip
            label={`${t('filterSettled')} (${settledCount})`}
            isActive={selectedFilter === 'settled'}
            onPress={() => setSelectedFilter('settled')}
            icon="checkmark-circle-outline"
            activeBg={theme.success}
          />
        </View>

        {/* ── Customers List ── */}
        {filteredCustomers.length === 0 ? (
          <EmptyState
            icon="people-outline"
            title={t('noKhataFound')}
            subtitle={
              searchQuery
                ? (language === 'ur' ? 'مختلف نام یا فون نمبر سے تلاش کریں' : 'Try a different name or phone number.')
                : (language === 'ur' ? 'ابھی کوئی اُدھار کھاتہ نہیں ہے' : 'No customers match the current filter.')
            }
            actionLabel={!searchQuery && selectedFilter === 'all' ? t('newBillBtn') : undefined}
            onAction={!searchQuery && selectedFilter === 'all' ? () => setActiveTab('sale') : undefined}
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
                onToggleExpand={() => handleToggleExpand(customer.id)}
                onRecordPayment={handleRecordPayment}
              />
            ))}
          </ScrollView>
        )}
      </View>

      {/* Payment Received Modal */}
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
    padding: Spacing.md,
    maxWidth: 720,
    marginHorizontal: 'auto',
    width: '100%',
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderLeftWidth: 4,
    marginBottom: Spacing.sm,
    ...Shadows.md,
  },
  summaryLeft: { flex: 1 },
  summaryLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  summaryValue: { fontSize: 26, fontWeight: '900', marginTop: 2, letterSpacing: -0.5 },
  summaryBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  summaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  summaryBadgeText: { fontSize: 11, fontWeight: '700' },
  summaryIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.md,
  },
  searchWrap: { marginBottom: Spacing.sm },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.md,
    flexWrap: 'wrap',
  },
  customersScroll: { flex: 1 },
  customersList: { gap: Spacing.md, paddingBottom: 100 },
});
