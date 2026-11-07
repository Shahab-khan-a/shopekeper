import { SalesChart } from '@/components/SalesChart';
import { Colors, Spacing } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';
import { SaleScreen } from '@/screens/SaleScreen';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const DashboardScreen: React.FC = () => {
  const {
    todaySalesTotal,
    products,
    sales,
    khata,
    totalUdhaarReceivable,
    totalInventoryInvestment,
    totalInventoryRetailValue,
    totalExpectedStockProfit,
    totalLifetimeEarnings,
    totalLifetimeProfit,
    totalInventoryUnits,
    settings,
    setActiveTab,
    setActiveReceipt,
    t,
    language,
    showAlert,
  } = useShop();

  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const isUrdu = language === 'ur';

  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [showReports, setShowReports] = useState(false);

  const todayStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const todaySales = sales.filter((s) => new Date(s.date) >= todayStart && !s.refundedAt);

  const MAX_TODAY_BILLS = 6;
  const todaySalesList = useMemo(() => {
    return sales
      .filter((s) => new Date(s.date) >= todayStart && !s.refundedAt)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [sales, todayStart]);

  const displayBills = useMemo(() => {
    const source = todaySalesList.length > 0 ? todaySalesList : sales;
    return [...source]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, MAX_TODAY_BILLS);
  }, [todaySalesList, sales]);

  const todayGrossProfit = todaySales.reduce((a, s) => {
    const cost = s.items.reduce((c: number, it: any) => c + ((it.costPrice || 0) * it.quantity), 0);
    return a + (s.grandTotal - cost);
  }, 0);

  const softBorder = settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(148, 163, 184, 0.18)';
  const pendingKhataCount = useMemo(() => {
    return (khata || []).filter((c: any) => (c.currentBalance || c.balance || 0) > 0).length;
  }, [khata]);

  const hasUdhaar = totalUdhaarReceivable > 0;
  const heroSubtitle = todayGrossProfit > 0
    ? `+${settings.currencySymbol}${todayGrossProfit.toLocaleString()} ${isUrdu ? 'متوقع منافع' : 'estimated profit'}`
    : todaySales.length > 0
      ? (isUrdu ? 'تمام بلز درج ہیں' : 'All bills recorded')
      : (isUrdu ? 'کاؤنٹر تیار ہے' : 'Ready for customers');

  return (
    <View style={[styles.rootContainer, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isUrdu ? 'آج کی کل سیل' : "Today's sales"}
          onPress={() => setActiveTab('history')}
          style={({ pressed }) => [
            styles.heroCard,
            { backgroundColor: theme.heroFill },
            pressed && { opacity: 0.94 },
          ]}>
          <Text style={styles.heroLabel}>
            {isUrdu ? 'آج کی کل سیل' : "Today's sales"}
          </Text>
          <View style={styles.heroAmountRow}>
            <Text style={styles.heroCurrency}>{settings.currencySymbol}</Text>
            <Text
              style={styles.heroAmount}
              numberOfLines={1}
              adjustsFontSizeToFit
              selectable>
              {todaySalesTotal.toLocaleString()}
            </Text>
          </View>
          <Text style={styles.heroSubtitle}>{heroSubtitle}</Text>
          <Text style={styles.heroMeta}>
            {todaySales.length} {isUrdu ? 'بلز' : todaySales.length === 1 ? 'bill' : 'bills'}
          </Text>
        </Pressable>

        <View style={styles.actionRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isUrdu ? 'نیا بل' : 'New Bill'}
            onPress={() => setIsSaleModalOpen(true)}
            style={({ pressed }) => [
              styles.actionTile,
              { backgroundColor: theme.secondary },
              pressed && { opacity: 0.9 },
            ]}>
            <View style={styles.actionIconWrap}>
              <Ionicons name="add" size={22} color="#FFFFFF" />
            </View>
            <Text style={styles.actionTileTitle}>
              {isUrdu ? 'نیا بل' : 'New Bill'}
            </Text>
            <Text style={styles.actionTileSub}>
              {isUrdu ? 'سیل درج کریں' : 'Start a sale'}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isUrdu ? 'کھاتہ' : 'Khata'}
            onPress={() => setActiveTab('khata')}
            style={({ pressed }) => [
              styles.actionTile,
              hasUdhaar
                ? { backgroundColor: theme.coral }
                : { backgroundColor: theme.card, borderWidth: 1, borderColor: softBorder },
              pressed && { opacity: 0.9 },
            ]}>
            <View style={[
              styles.actionIconWrap,
              !hasUdhaar && { backgroundColor: settings.darkMode ? 'rgba(255,255,255,0.08)' : theme.dangerLight },
            ]}>
              <Ionicons
                name="book-outline"
                size={20}
                color={hasUdhaar ? '#FFFFFF' : theme.danger}
              />
            </View>
            <Text style={[styles.actionTileTitle, !hasUdhaar && { color: theme.text }]}>
              {isUrdu ? 'کھاتہ' : 'Khata'}
            </Text>
            <Text
              style={[styles.actionTileAmount, !hasUdhaar && { color: theme.text }]}
              numberOfLines={1}
              selectable>
              {settings.currencySymbol}{totalUdhaarReceivable.toLocaleString()}
            </Text>
            <Text style={[styles.actionTileSub, !hasUdhaar && { color: theme.textMuted }]}>
              {hasUdhaar
                ? `${pendingKhataCount} ${isUrdu ? 'بقایا' : 'pending'}`
                : (isUrdu ? 'کوئی ادھار نہیں' : 'No udhaar due')}
            </Text>
          </Pressable>
        </View>

        {/* Graph: SalesChart positioned under the three top cards */}
        <SalesChart sales={sales} />

        {/* Today's bills section */}
        <View style={styles.feedHeaderRow}>
          <View style={styles.feedTitleWrap}>
            <Text style={[styles.feedTitle, { color: theme.text }]}>
              {todaySalesList.length > 0
                ? (isUrdu ? 'آج کے بلز' : "Today's Bills")
                : sales.length > 0
                  ? (isUrdu ? 'حالیہ بلز' : 'Recent Bills')
                  : (isUrdu ? 'آج کے بلز' : "Today's Bills")}
            </Text>
            {displayBills.length > 0 && (
              <View style={[styles.feedCountBadge, { backgroundColor: settings.darkMode ? 'rgba(255,255,255,0.08)' : '#F1F5F9' }]}>
                <Text style={[styles.feedCountText, { color: theme.textSecondary }]}>
                  {todaySalesList.length > 0 ? todaySalesList.length : displayBills.length}
                </Text>
              </View>
            )}
          </View>

          {sales.length > 0 && (
            <Pressable
              onPress={() => setActiveTab('history')}
              hitSlop={8}
              style={({ pressed }) => [styles.seeAllBtn, pressed && { opacity: 0.7 }]}>
              <Text style={[styles.seeAllLink, { color: theme.primary }]}>
                {isUrdu ? 'سب دیکھیں' : 'See all'}
              </Text>
              <Ionicons
                name={isUrdu ? 'chevron-back' : 'chevron-forward'}
                size={14}
                color={theme.primary}
              />
            </Pressable>
          )}
        </View>

        <View style={styles.salesFeedList}>
          {displayBills.length > 0 ? (
            <>
              <ScrollView
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
                style={styles.todayScrollBox}
                contentContainerStyle={styles.todayScrollContent}>
                {displayBills.map((s) => {
                  const isSplit = s.paymentMethod === 'udhaar' && (s.amountPaid || 0) > 0;
                  const isCash = s.paymentMethod === 'cash';
                  const isOnline = s.paymentMethod === 'online';

                  const badgeBg = isSplit
                    ? (settings.darkMode ? 'rgba(2, 132, 199, 0.16)' : '#E0F2FE')
                    : isCash
                    ? (settings.darkMode ? 'rgba(0, 201, 167, 0.16)' : '#D1FAE5')
                    : isOnline
                      ? (settings.darkMode ? 'rgba(47, 159, 248, 0.16)' : '#DBEAFE')
                      : (settings.darkMode ? 'rgba(243, 112, 90, 0.16)' : '#FEE2E2');

                  const badgeColor = isSplit ? '#0284C7' : isCash ? '#059669' : isOnline ? '#0284C7' : '#DC2626';

                  return (
                    <Pressable
                      key={s.id}
                      onPress={() => setActiveReceipt(s)}
                      style={({ pressed }) => [
                        styles.transactionCard,
                        { backgroundColor: theme.card, borderColor: softBorder },
                        pressed && { opacity: 0.88 },
                      ]}>
                      <View style={[styles.transactionBadge, { backgroundColor: badgeBg }]}>
                        <Ionicons
                          name={isSplit ? 'swap-horizontal-outline' : isCash ? 'cash-outline' : isOnline ? 'phone-portrait-outline' : 'book-outline'}
                          size={20}
                          color={badgeColor}
                        />
                      </View>

                      <View style={styles.transactionMiddle}>
                        <Text style={[styles.transactionTitle, { color: theme.text }]} numberOfLines={1}>
                          {s.customerName || (isUrdu ? 'نقد کاؤنٹر سیل' : 'Walk-in cash sale')}
                        </Text>
                        <Text style={[styles.transactionTime, { color: theme.textMuted }]} numberOfLines={1}>
                          {new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {s.items ? s.items.length : 0} {t('itemsCount')}
                        </Text>
                      </View>

                      <View style={styles.transactionRight}>
                        <Text style={[styles.transactionAmount, { color: theme.text }]}>
                          +{settings.currencySymbol}{s.grandTotal.toLocaleString()}
                        </Text>
                        <Text style={[styles.transactionMethod, { color: badgeColor }]}>
                          {isSplit ? (isUrdu ? 'نقد + ادھار' : 'Split') : s.paymentMethod}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {sales.length > 0 && (
                <Pressable
                  onPress={() => setActiveTab('history')}
                  style={({ pressed }) => [
                    styles.viewMoreSalesBtn,
                    { backgroundColor: settings.darkMode ? 'rgba(255,255,255,0.04)' : '#F1F5F9', borderColor: softBorder },
                    pressed && { opacity: 0.8 },
                  ]}>
                  <Text style={[styles.viewMoreSalesText, { color: theme.primary }]}>
                    {isUrdu
                      ? `تمام ${sales.length} بلز ہسٹری میں دیکھیں`
                      : `View all ${sales.length} bills in History`}
                  </Text>
                  <Ionicons
                    name={isUrdu ? 'arrow-back' : 'arrow-forward'}
                    size={14}
                    color={theme.primary}
                  />
                </Pressable>
              )}
            </>
          ) : (
            <View style={styles.salesEmpty}>
              <Text style={[styles.salesEmptyTitle, { color: theme.textMuted }]}>
                {isUrdu ? 'آج ابھی کوئی بل نہیں' : 'No bills yet today'}
              </Text>
              <Pressable
                onPress={() => setIsSaleModalOpen(true)}
                hitSlop={6}
                style={({ pressed }) => [pressed && { opacity: 0.7 }]}>
                <Text style={[styles.salesEmptyLink, { color: theme.primary }]}>
                  {isUrdu ? 'نیا بل بنائیں' : 'New Bill'}
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Reports collapsible at the very end */}
        <Pressable
          onPress={() => setShowReports((v) => !v)}
          style={({ pressed }) => [
            styles.reportsPillBtn,
            { backgroundColor: theme.card, borderColor: softBorder },
            pressed && { opacity: 0.85 },
          ]}>
          <View style={styles.reportsPillLeft}>
            <Ionicons name="bar-chart-outline" size={17} color={theme.primary} />
            <Text style={[styles.reportsPillTitle, { color: theme.text }]}>
              {isUrdu ? 'رپورٹس اور منافع' : 'Reports & Analytics'}
            </Text>
          </View>
          <Ionicons name={showReports ? 'chevron-up' : 'chevron-down'} size={16} color={theme.textMuted} />
        </Pressable>

        {showReports && (
          <View style={styles.reportsDrawerArea}>
            <View style={styles.financeGrid}>
              <Pressable
                onPress={() => setActiveTab('products')}
                style={({ pressed }) => [
                  styles.financeCard,
                  { backgroundColor: theme.card, borderColor: softBorder },
                  pressed && { opacity: 0.9 },
                ]}>
                <View style={styles.financeCardHeader}>
                  <Text style={[styles.financeCardTitle, { color: theme.textSecondary }]}>
                    {t('totalInvestment')}
                  </Text>
                  <Text style={[styles.financeBadgeText, { color: theme.primary }]}>
                    {totalInventoryUnits} {isUrdu ? 'اشیاء' : 'units'}
                  </Text>
                </View>

                <Text style={[styles.financeMainAmount, { color: theme.text }]}>
                  {settings.currencySymbol} {totalInventoryInvestment.toLocaleString()}
                </Text>

                <View style={[styles.financeDivider, { backgroundColor: softBorder }]} />

                <View style={styles.financeSubStatsRow}>
                  <View style={styles.financeSubStat}>
                    <Text style={[styles.financeSubStatLabel, { color: theme.textMuted }]}>
                      {t('stockRetailValue')}
                    </Text>
                    <Text style={[styles.financeSubStatValue, { color: theme.text }]}>
                      {settings.currencySymbol} {totalInventoryRetailValue.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.financeSubStat}>
                    <Text style={[styles.financeSubStatLabel, { color: theme.textMuted }]}>
                      {t('expectedStockProfit')}
                    </Text>
                    <Text style={[styles.financeSubStatValue, { color: theme.primary, fontWeight: '800' }]}>
                      +{settings.currencySymbol} {totalExpectedStockProfit.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </Pressable>

              <Pressable
                onPress={() => setActiveTab('history')}
                style={({ pressed }) => [
                  styles.financeCard,
                  { backgroundColor: theme.card, borderColor: softBorder },
                  pressed && { opacity: 0.9 },
                ]}>
                <View style={styles.financeCardHeader}>
                  <Text style={[styles.financeCardTitle, { color: theme.textSecondary }]}>
                    {t('totalStoreEarnings')}
                  </Text>
                  <Text style={[styles.financeBadgeText, { color: theme.secondary }]}>
                    {sales.filter(s => s.status !== 'refunded' && s.status !== 'cancelled').length} {isUrdu ? 'بلز' : 'sales'}
                  </Text>
                </View>

                <Text style={[styles.financeMainAmount, { color: theme.text }]}>
                  {settings.currencySymbol} {totalLifetimeEarnings.toLocaleString()}
                </Text>

                <View style={[styles.financeDivider, { backgroundColor: softBorder }]} />

                <View style={styles.financeSubStatsRow}>
                  <View style={styles.financeSubStat}>
                    <Text style={[styles.financeSubStatLabel, { color: theme.textMuted }]}>
                      {t('totalProfitEarned')}
                    </Text>
                    <Text style={[styles.financeSubStatValue, { color: theme.success, fontWeight: '800' }]}>
                      +{settings.currencySymbol} {totalLifetimeProfit.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.financeSubStat}>
                    <Text style={[styles.financeSubStatLabel, { color: theme.textMuted }]}>
                      {t('profitMargin')}
                    </Text>
                    <Text style={[styles.financeSubStatValue, { color: theme.text }]}>
                      {totalLifetimeEarnings > 0
                        ? `${Math.round((totalLifetimeProfit / totalLifetimeEarnings) * 100)}%`
                        : '0%'}
                    </Text>
                  </View>
                </View>
              </Pressable>
            </View>
          </View>
        )}

      </ScrollView>

      <Modal
        visible={isSaleModalOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsSaleModalOpen(false)}>
        <SafeAreaView style={[styles.saleModalContainer, { backgroundColor: theme.background }]}>
          <SaleScreen isModal onClose={() => setIsSaleModalOpen(false)} />
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: 110,
    maxWidth: 720,
    marginHorizontal: 'auto',
    width: '100%',
    gap: 16,
  },
  saleModalContainer: {
    flex: 1,
  },

  heroCard: {
    borderRadius: 24,
    borderCurve: 'continuous',
    paddingHorizontal: 20,
    paddingVertical: 22,
    gap: 6,
  },
  heroLabel: {
    color: 'rgba(255, 255, 255, 0.86)',
    fontSize: 15,
    fontWeight: '600',
  },
  heroAmountRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
  },
  heroCurrency: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 10,
  },
  heroAmount: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -1,
    lineHeight: 46,
    fontVariant: ['tabular-nums'],
    flex: 1,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.88)',
    fontSize: 14,
    fontWeight: '500',
  },
  heroMeta: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionTile: {
    flex: 1,
    borderRadius: 22,
    borderCurve: 'continuous',
    padding: 16,
    gap: 6,
    minHeight: 112,
    justifyContent: 'flex-end',
  },
  actionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  actionTileTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  actionTileAmount: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.4,
    fontVariant: ['tabular-nums'],
  },
  actionTileSub: {
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: 13,
    fontWeight: '500',
  },

  feedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  feedTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  feedTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  feedCountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  feedCountText: {
    fontSize: 12,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  seeAllLink: {
    fontSize: 14,
    fontWeight: '700',
  },
  salesFeedList: {
    gap: 10,
  },
  todayScrollBox: {
    maxHeight: 230,
  },
  todayScrollContent: {
    gap: 10,
    paddingVertical: 2,
  },
  salesEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
  },
  salesEmptyTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  salesEmptyLink: {
    fontSize: 13,
    fontWeight: '800',
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 22,
    borderCurve: 'continuous',
    borderWidth: 1,
  },
  viewMoreSalesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
  },
  viewMoreSalesText: {
    fontSize: 13,
    fontWeight: '700',
  },
  transactionBadge: {
    width: 44,
    height: 44,
    borderRadius: 15,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionMiddle: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  transactionTime: {
    fontSize: 13,
    fontWeight: '500',
  },
  transactionRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.3,
    fontVariant: ['tabular-nums'],
  },
  transactionMethod: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  reportsPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
    borderCurve: 'continuous',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 13,
    minHeight: 48,
  },
  reportsPillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  reportsPillTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  reportsDrawerArea: {
    gap: 12,
  },
  financeGrid: {
    gap: 10,
  },
  financeCard: {
    padding: 14,
    borderRadius: 20,
    borderCurve: 'continuous',
    borderWidth: 1,
  },
  financeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  financeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  financeCardTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  financeMainAmount: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 4,
    fontVariant: ['tabular-nums'],
  },
  financeDivider: {
    height: 1,
    width: '100%',
    marginVertical: 8,
  },
  financeSubStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  financeSubStat: {
    flex: 1,
    gap: 2,
  },
  financeSubStatLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  financeSubStatValue: {
    fontSize: 13,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});
