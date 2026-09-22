import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Sale } from '@/types';
import { useShop } from '@/context/ShopContext';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterChip } from '@/components/ui/FilterChip';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusBadge } from '@/components/ui/StatusBadge';

type HistoryFilter = 'all' | 'today' | 'week' | 'month';

export const HistoryScreen: React.FC = () => {
  const { sales, refundSale, setActiveReceipt, setActiveTab, settings, t, language } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<HistoryFilter>('all');

  const filteredSales = useMemo(() => {
    const now = new Date();
    const todayYear = now.getFullYear();
    const todayMonth = now.getMonth();
    const todayDate = now.getDate();

    return sales.filter((sale) => {
      const matchSearch =
        sale.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sale.customerName && sale.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (sale.customerPhone && sale.customerPhone.includes(searchQuery));

      if (!matchSearch) return false;

      const saleDate = new Date(sale.date);

      if (filter === 'today') {
        return (
          saleDate.getFullYear() === todayYear &&
          saleDate.getMonth() === todayMonth &&
          saleDate.getDate() === todayDate
        );
      }
      if (filter === 'week') {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return saleDate >= oneWeekAgo;
      }
      if (filter === 'month') {
        return saleDate.getFullYear() === todayYear && saleDate.getMonth() === todayMonth;
      }
      return true;
    });
  }, [sales, searchQuery, filter]);

  const { filterRevenue, filterProfit, completedCount } = useMemo(() => {
    const activeSales = filteredSales.filter(s => s.status !== 'refunded' && s.status !== 'cancelled');
    const rev = activeSales.reduce((sum, s) => sum + s.grandTotal, 0);
    const prof = activeSales.reduce((sum, s) => sum + (s.totalProfit || 0), 0);
    return { filterRevenue: rev, filterProfit: prof, completedCount: activeSales.length };
  }, [filteredSales]);

  const handleRefundSale = (sale: Sale) => {
    const isUrdu = language === 'ur';
    const confirmTitle = isUrdu ? 'بل واپس / منسوخ کریں؟' : 'Refund / Void Bill?';
    const confirmMessage = isUrdu
      ? `کیا آپ واقعی بل #${sale.billNumber} واپس کرنا چاہتے ہیں؟ اس سے اشیاء واپس اسٹاک میں شامل ہو جائیں گی اور ادھار بھی ختم ہو جائے گا۔`
      : `Are you sure you want to refund Bill #${sale.billNumber}? Sold items will be restored to inventory and customer debt will be reversed.`;

    if (Platform.OS === 'web') {
      if (window.confirm(confirmMessage)) {
        refundSale(sale.id, 'Voided from History');
      }
    } else {
      Alert.alert(confirmTitle, confirmMessage, [
        { text: t('cancel'), style: 'cancel' },
        {
          text: isUrdu ? 'واپس کریں (Refund)' : 'Refund & Restore',
          style: 'destructive',
          onPress: () => refundSale(sale.id, 'Voided from History'),
        },
      ]);
    }
  };

  const getPayColor = (method: string) => {
    if (method === 'cash') return theme.success;
    if (method === 'online') return theme.secondary;
    return theme.danger;
  };

  const getPayBg = (method: string) => {
    if (method === 'cash') return theme.successLight;
    if (method === 'online') return theme.surfaceSubtle;
    return theme.dangerLight;
  };

  const filterOptions: { key: HistoryFilter; label: string }[] = [
    { key: 'all', label: t('filterAll') },
    { key: 'today', label: t('filterToday') },
    { key: 'week', label: t('filterWeek') },
    { key: 'month', label: t('filterMonth') },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.contentWrap}>
        {/* Stats Card */}
        <View style={[styles.statsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.statCol}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Bills</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>{completedCount}</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statCol}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Revenue</Text>
            <Text style={[styles.statValue, { color: theme.primary }]}>
              {settings.currencySymbol} {filterRevenue.toLocaleString()}
            </Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statCol}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Est. Profit</Text>
            <Text style={[styles.statValue, { color: theme.secondary }]}>
              {settings.currencySymbol} {filterProfit.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('searchHistoryPlaceholder')}
          />
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterRow}>
          {filterOptions.map((item) => (
            <FilterChip
              key={item.key}
              label={item.label}
              isActive={filter === item.key}
              onPress={() => setFilter(item.key)}
            />
          ))}
        </View>

        {/* Bills List */}
        {filteredSales.length === 0 ? (
          <EmptyState
            icon="receipt-outline"
            title={t('noSalesFound')}
            subtitle={
              searchQuery
                ? (language === 'ur' ? 'مختلف نام یا بل نمبر تلاش کریں' : 'Try a different search term.')
                : (language === 'ur' ? 'ابھی تک کوئی بل نہیں بنایا' : 'No bills found for the selected period.')
            }
            actionLabel={!searchQuery ? t('newBillBtn') : undefined}
            onAction={!searchQuery ? () => setActiveTab('sale') : undefined}
          />
        ) : (
          <ScrollView
            style={styles.billsScroll}
            contentContainerStyle={styles.billsList}
            showsVerticalScrollIndicator={false}>
            {filteredSales.map((sale) => {
              const payColor = getPayColor(sale.paymentMethod);
              const payBg = getPayBg(sale.paymentMethod);

              const isRefunded = sale.status === 'refunded';

              return (
                <View
                  key={sale.id}
                  style={[
                    styles.billCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: isRefunded ? theme.border : theme.border,
                      borderLeftColor: isRefunded ? theme.textMuted : payColor,
                      opacity: isRefunded ? 0.75 : 1,
                    },
                  ]}>
                  {/* Header */}
                  <View style={styles.billCardTop}>
                    <View style={styles.billBadgeWrap}>
                      <Text style={[styles.billNoText, { color: isRefunded ? theme.textMuted : theme.primary }]}>
                        #{sale.billNumber}
                      </Text>
                      <StatusBadge
                        label={sale.paymentMethod.toUpperCase()}
                        bg={payBg}
                        color={payColor}
                      />
                      {isRefunded && (
                        <StatusBadge
                          label={language === 'ur' ? 'واپس شدہ' : 'REFUNDED'}
                          bg={theme.dangerLight}
                          color={theme.danger}
                          icon="refresh-outline"
                        />
                      )}
                    </View>
                    <Text style={[styles.billDateText, { color: theme.textSecondary }]}>
                      {new Date(sale.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </Text>
                  </View>

                  {/* Customer */}
                  {sale.customerName ? (
                    <View style={styles.custRow}>
                      <Ionicons name="person-outline" size={14} color={theme.textSecondary} />
                      <Text style={[styles.custName, { color: theme.text }]}>
                        {sale.customerName} {sale.customerPhone ? `(${sale.customerPhone})` : ''}
                      </Text>
                    </View>
                  ) : null}

                  {/* Items */}
                  <View style={[styles.itemsSummaryBox, { backgroundColor: theme.surfaceSubtle }]}>
                    {sale.items.map((it, idx) => (
                      <Text key={idx} style={[styles.itemSummaryLine, { color: theme.textSecondary }]}>
                        • {it.product.name} ({it.quantity} {it.product.unit} × {settings.currencySymbol}{it.unitPrice})
                      </Text>
                    ))}
                  </View>

                  {/* Footer */}
                  <View style={[styles.billCardBottom, { borderTopColor: theme.border }]}>
                    <View>
                      <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>{t('grandTotal')}</Text>
                      <Text style={[
                        styles.totalAmount, 
                        { color: isRefunded ? theme.textMuted : theme.text },
                        isRefunded && { textDecorationLine: 'line-through' }
                      ]}>
                        {settings.currencySymbol} {sale.grandTotal}
                      </Text>
                    </View>

                    <View style={styles.billActions}>
                      <Pressable
                        onPress={() => setActiveReceipt(sale)}
                        style={({ pressed }) => [
                          styles.viewBtn,
                          { backgroundColor: theme.primaryLight },
                          pressed && { opacity: 0.8 },
                        ]}>
                        <Ionicons name="eye-outline" size={16} color={theme.primary} />
                        <Text style={[styles.viewBtnText, { color: theme.primary }]}>
                          {t('viewReceipt')}
                        </Text>
                      </Pressable>

                      {isRefunded ? (
                        <View style={[styles.refundedTag, { backgroundColor: theme.surfaceSubtle }]}>
                          <Ionicons name="refresh-circle" size={16} color={theme.danger} />
                          <Text style={[styles.refundedTagText, { color: theme.danger }]}>
                            {language === 'ur' ? 'واپس شدہ' : 'Refunded'}
                          </Text>
                        </View>
                      ) : (
                        <Pressable
                          onPress={() => handleRefundSale(sale)}
                          style={({ pressed }) => [
                            styles.deleteBtn,
                            { backgroundColor: theme.dangerLight },
                            pressed && { opacity: 0.8 },
                          ]}>
                          <Ionicons name="return-down-back-outline" size={16} color={theme.danger} />
                        </Pressable>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
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
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  statCol: { alignItems: 'center', gap: 3 },
  statLabel: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  statValue: { fontSize: 18, fontWeight: '900', letterSpacing: -0.3 },
  statDivider: { width: 1, height: 32 },
  searchWrap: { marginBottom: Spacing.sm },
  filterRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: Spacing.md,
    flexWrap: 'wrap',
  },
  billsScroll: { flex: 1 },
  billsList: { gap: Spacing.md, paddingBottom: 100 },
  billCard: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: Spacing.md,
    ...Shadows.md,
  },
  billCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  billBadgeWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  billNoText: { fontSize: 15, fontWeight: '800' },
  billDateText: { fontSize: 11, fontWeight: '500' },
  custRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  custName: { fontSize: 13, fontWeight: '600' },
  itemsSummaryBox: { padding: Spacing.sm, borderRadius: BorderRadius.md, marginVertical: 6 },
  itemSummaryLine: { fontSize: 11, lineHeight: 17 },
  billCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    marginTop: 4,
    borderTopWidth: 1,
  },
  totalLabel: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  totalAmount: { fontSize: 20, fontWeight: '900', letterSpacing: -0.3 },
  billActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  viewBtnText: { fontSize: 12, fontWeight: '700' },
  deleteBtn: { padding: 8, borderRadius: BorderRadius.full, alignItems: 'center', justifyContent: 'center' },
  refundedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  refundedTagText: { fontSize: 11, fontWeight: '700' },
});
