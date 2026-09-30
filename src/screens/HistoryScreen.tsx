import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Platform,
  Linking,
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
  
  // Track expanded item tables (default all collapsed or expanded, using card ID)
  const [collapsedCards, setCollapsedCards] = useState<Record<string, boolean>>({});

  const toggleCardCollapse = (saleId: string) => {
    setCollapsedCards((prev) => ({
      ...prev,
      [saleId]: !prev[saleId],
    }));
  };

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

  const handleCallCustomer = (phone?: string) => {
    if (!phone) return;
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    const url = `tel:${cleanPhone}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else if (Platform.OS === 'web') {
          window.open(url);
        }
      })
      .catch(() => {});
  };

  const getPayColor = (method: string) => {
    if (method === 'cash') return theme.primary;
    if (method === 'online') return '#0284C7'; // Sky Blue
    return '#D97706'; // Amber / Udhaar
  };

  const getPayBg = (method: string) => {
    if (method === 'cash') return settings.darkMode ? 'rgba(5, 150, 105, 0.18)' : '#DCFCE7';
    if (method === 'online') return settings.darkMode ? 'rgba(2, 132, 199, 0.18)' : '#E0F2FE';
    return settings.darkMode ? 'rgba(217, 119, 6, 0.18)' : '#FEF3C7';
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
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              {language === 'ur' ? 'کل بلز' : 'Total Bills'}
            </Text>
            <Text style={[styles.statValue, { color: theme.text }]}>{completedCount}</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statCol}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              {language === 'ur' ? 'کل آمدنی' : 'Revenue'}
            </Text>
            <Text style={[styles.statValue, { color: theme.primary }]}>
              {settings.currencySymbol} {filterRevenue.toLocaleString()}
            </Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statCol}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              {language === 'ur' ? 'خالص منافع' : 'Net Profit'}
            </Text>
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
              const isCollapsed = collapsedCards[sale.id];

              const saleDate = new Date(sale.date);
              const formattedDate = saleDate.toLocaleDateString([], {
                month: 'numeric',
                day: 'numeric',
                year: '2-digit',
              });
              const formattedTime = saleDate.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <View
                  key={sale.id}
                  style={[
                    styles.billCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                      borderLeftColor: isRefunded ? theme.textMuted : payColor,
                      opacity: isRefunded ? 0.78 : 1,
                    },
                  ]}>
                  {/* Top Header Row */}
                  <View style={styles.billCardTop}>
                    <View style={styles.billBadgeWrap}>
                      <Text style={[styles.billNoText, { color: isRefunded ? theme.textMuted : theme.primary }]}>
                        #INV-{sale.billNumber}
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
                    <Text style={[styles.billDateText, { color: theme.textMuted }]}>
                      {formattedDate}, {formattedTime}
                    </Text>
                  </View>

                  {/* Customer Row */}
                  {sale.customerName ? (
                    <View style={styles.custRow}>
                      <Ionicons name="person-outline" size={14} color={theme.textSecondary} />
                      <Text style={[styles.custName, { color: theme.text }]}>
                        {sale.customerName} {sale.customerPhone ? `(${sale.customerPhone})` : ''}
                      </Text>
                    </View>
                  ) : null}

                  {/* Accordion Toggle Pill */}
                  <Pressable
                    onPress={() => toggleCardCollapse(sale.id)}
                    style={({ pressed }) => [
                      styles.accordionHeader,
                      { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
                      pressed && { opacity: 0.8 },
                    ]}>
                    <View style={styles.accordionHeaderLeft}>
                      <Ionicons
                        name={isCollapsed ? 'chevron-down' : 'chevron-up'}
                        size={15}
                        color={theme.textSecondary}
                      />
                      <Text style={[styles.accordionHeaderText, { color: theme.textSecondary }]}>
                        {language === 'ur' ? 'اشیاء تفصیلات' : 'Item details'} ({sale.items?.length || 0})
                      </Text>
                    </View>
                  </Pressable>

                  {/* Clean Items Table */}
                  {!isCollapsed && (
                    <View style={styles.tableContainer}>
                      {/* Table Column Headers */}
                      <View style={[styles.tableHeaderRow, { borderBottomColor: theme.border }]}>
                        <Text style={[styles.thColName, { color: theme.textSecondary }]}>
                          {language === 'ur' ? 'نام' : 'Item Name'}
                        </Text>
                        <Text style={[styles.thColQtyPrice, { color: theme.textSecondary }]}>
                          {language === 'ur' ? 'مقدار × قیمت' : 'Qty × Price'}
                        </Text>
                        <Text style={[styles.thColTotal, { color: theme.textSecondary }]}>
                          {language === 'ur' ? 'کل' : 'Item Total'}
                        </Text>
                      </View>

                      {/* Table Item Rows */}
                      {sale.items.map((it, idx) => (
                        <View key={idx} style={styles.tableBodyRow}>
                          <Text style={[styles.tdColName, { color: theme.text }]} numberOfLines={1}>
                            {idx + 1}. {it.product.name}
                          </Text>
                          <Text style={[styles.tdColQtyPrice, { color: theme.textSecondary }]} numberOfLines={1}>
                            | {it.quantity} {it.product.unit || 'pc'} | {settings.currencySymbol} {it.unitPrice}
                          </Text>
                          <Text style={[styles.tdColTotal, { color: theme.text }]}>
                            {settings.currencySymbol} {it.total}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Footer Row */}
                  <View style={[styles.billCardBottom, { borderTopColor: theme.border }]}>
                    <View>
                      <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>{t('grandTotal')}</Text>
                      <Text
                        style={[
                          styles.totalAmount,
                          { color: isRefunded ? theme.textMuted : theme.text },
                          isRefunded && { textDecorationLine: 'line-through' },
                        ]}>
                        {settings.currencySymbol} {sale.grandTotal.toLocaleString()}
                      </Text>
                    </View>

                    {/* Action Buttons Row */}
                    <View style={styles.billActions}>
                      {/* Main View Receipt Button */}
                      <Pressable
                        onPress={() => setActiveReceipt(sale)}
                        style={({ pressed }) => [
                          styles.viewReceiptBtn,
                          { backgroundColor: theme.primary },
                          pressed && { opacity: 0.88, transform: [{ scale: 0.97 }] },
                        ]}>
                        <Ionicons name="eye-outline" size={16} color="#FFFFFF" />
                        <Text style={styles.viewReceiptBtnText}>{t('viewReceipt')}</Text>
                      </Pressable>

                      {/* Quick Refund / Void Button */}
                      {isRefunded ? (
                        <View style={[styles.refundedTag, { backgroundColor: theme.surfaceSubtle }]}>
                          <Ionicons name="refresh-circle" size={16} color={theme.danger} />
                        </View>
                      ) : (
                        <Pressable
                          onPress={() => handleRefundSale(sale)}
                          accessibilityLabel="Refund bill"
                          style={({ pressed }) => [
                            styles.actionIconBtn,
                            { backgroundColor: theme.dangerLight },
                            pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
                          ]}>
                          <Ionicons name="return-down-back" size={16} color={theme.danger} />
                        </Pressable>
                      )}

                      {/* Direct Phone Call Button */}
                      {sale.customerPhone ? (
                        <Pressable
                          onPress={() => handleCallCustomer(sale.customerPhone)}
                          accessibilityLabel={`Call ${sale.customerName || 'Customer'}`}
                          style={({ pressed }) => [
                            styles.actionIconBtn,
                            { backgroundColor: settings.darkMode ? 'rgba(2, 132, 199, 0.2)' : '#E0F2FE' },
                            pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
                          ]}>
                          <Ionicons name="call" size={15} color="#0284C7" />
                        </Pressable>
                      ) : null}
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

  // Card Structure
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
    marginBottom: 8,
  },
  billBadgeWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  billNoText: { fontSize: 15, fontWeight: '800' },
  billDateText: { fontSize: 11, fontWeight: '500' },
  custRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  custName: { fontSize: 13, fontWeight: '600' },

  // Accordion Pill Header
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: 8,
  },
  accordionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  accordionHeaderText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Structured Items Table
  tableContainer: {
    marginBottom: 8,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
  },
  thColName: {
    flex: 2,
    fontSize: 11,
    fontWeight: '700',
  },
  thColQtyPrice: {
    flex: 2.2,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  thColTotal: {
    flex: 1.2,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'right',
  },

  tableBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  tdColName: {
    flex: 2,
    fontSize: 12,
    fontWeight: '600',
  },
  tdColQtyPrice: {
    flex: 2.2,
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  tdColTotal: {
    flex: 1.2,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'right',
  },

  // Footer Row
  billCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    marginTop: 4,
    borderTopWidth: 1,
  },
  totalLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4 },
  totalAmount: { fontSize: 22, fontWeight: '900', letterSpacing: -0.4 },
  billActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  
  // Action Buttons
  viewReceiptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    ...Shadows.sm,
  },
  viewReceiptBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  actionIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refundedTag: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
