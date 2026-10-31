import { CASH_OUT_STORAGE_KEY, CashOutEntry, CashOutModal } from '@/components/CashOutModal';
import { DayEndClosingModal } from '@/components/DayEndClosingModal';
import { SalesChart } from '@/components/SalesChart';
import { EmptyState } from '@/components/ui/EmptyState';
import { Colors, Spacing } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';
import { SaleScreen } from '@/screens/SaleScreen';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
    loadStapleProducts,
  } = useShop();

  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const isUrdu = language === 'ur';

  const [isLoadingStaples, setIsLoadingStaples] = useState(false);
  const [isSetupCardDismissed, setIsSetupCardDismissed] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('@shopkeeper_setup_card_dismissed')
      .then((val) => {
        if (val === 'true') {
          setIsSetupCardDismissed(true);
        }
      })
      .catch(() => { });
  }, []);

  const handleDismissSetupCard = async () => {
    setIsSetupCardDismissed(true);
    await AsyncStorage.setItem('@shopkeeper_setup_card_dismissed', 'true').catch(() => { });
  };

  const hasProducts = products.length > 0;
  const hasCustomers = khata.length > 0;
  const hasSales = sales.length > 0;
  const isStoreSetupComplete = hasProducts && hasCustomers && hasSales;
  const completedStepsCount = (hasProducts ? 1 : 0) + (hasCustomers ? 1 : 0) + (hasSales ? 1 : 0);
  const showSetupCard = !isSetupCardDismissed && !isStoreSetupComplete;

  const handleLoadStaples = async () => {
    setIsLoadingStaples(true);
    try {
      await loadStapleProducts(20);
      showAlert({
        type: 'success',
        title: isUrdu ? '20 اشیاء لوڈ ہو گئیں!' : 'Top 20 Staples Loaded!',
        message: isUrdu
          ? 'چینی، آٹا، گھی، دالیں شامل ہو گئیں۔ اب گاہک کھاتہ درج کریں یا پہلی سیل بنائیں۔'
          : '20 essential staples added. Proceed to Customer Ledger or First Sale.',
      });
    } catch (e: any) {
      console.error('[Dashboard] Error loading staples:', e);
    } finally {
      setIsLoadingStaples(false);
    }
  };

  const MAX_HOME_RECENT_SALES = 4;
  const recentSales = useMemo(() => {
    return [...sales]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, MAX_HOME_RECENT_SALES);
  }, [sales]);

  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [showDayEnd, setShowDayEnd] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [isCashOutModalOpen, setIsCashOutModalOpen] = useState(false);
  const [todayCashOutTotal, setTodayCashOutTotal] = useState(0);

  const todayStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const refreshCashOut = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem(CASH_OUT_STORAGE_KEY);
      if (data) {
        const parsed: CashOutEntry[] = JSON.parse(data);
        const startMs = todayStart.getTime();
        const total = parsed
          .filter((e) => e.createdAt >= startMs)
          .reduce((sum, e) => sum + e.amount, 0);
        setTodayCashOutTotal(total);
      } else {
        setTodayCashOutTotal(0);
      }
    } catch {
      setTodayCashOutTotal(0);
    }
  }, [todayStart]);

  useEffect(() => {
    refreshCashOut();
  }, [refreshCashOut]);

  const todaySales = sales.filter((s) => new Date(s.date) >= todayStart && !s.refundedAt);
  const todayCash = todaySales.filter((s) => s.paymentMethod === 'cash').reduce((a, b) => a + b.grandTotal, 0);
  const todayOnline = todaySales.filter((s) => s.paymentMethod === 'online').reduce((a, b) => a + b.grandTotal, 0);
  const todayUdhaar = todaySales.filter((s) => s.paymentMethod === 'udhaar').reduce((a, b) => a + b.grandTotal, 0);

  const todayVasooli = useMemo(() => {
    let sum = 0;
    const startMs = todayStart.getTime();
    (khata || []).forEach((c: any) => {
      c.transactions?.forEach((tx: any) => {
        if (tx.type === 'payment' || tx.type === 'payment_received') {
          const txTime = typeof tx.createdAt === 'number' ? tx.createdAt : new Date(tx.date || 0).getTime();
          if (txTime >= startMs) {
            sum += tx.amount || 0;
          }
        }
      });
    });
    return sum;
  }, [khata, todayStart]);

  const todayNetCashInDrawer = Math.max(0, todayCash + todayVasooli - todayCashOutTotal);

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

        <View style={styles.feedHeaderRow}>
          <View style={styles.feedTitleBlock}>
            <Text style={[styles.feedTitle, { color: theme.text }]}>
              {isUrdu ? 'آج کے بلز' : 'Today'}
            </Text>
            <Pressable
              onPress={() => setShowDayEnd(true)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={isUrdu ? 'گلہ کا حساب' : 'Tally cash drawer'}
              style={({ pressed }) => [pressed && { opacity: 0.7 }]}>
              <Text style={[styles.tallyLink, { color: theme.textMuted }]}>
                {isUrdu ? 'گلہ کا حساب' : 'Tally drawer'}
              </Text>
            </Pressable>
          </View>

          {sales.length > 0 && (
            <Pressable
              onPress={() => setActiveTab('history')}
              hitSlop={8}
              style={({ pressed }) => [pressed && { opacity: 0.7 }]}>
              <Text style={[styles.seeAllLink, { color: theme.primary }]}>
                {isUrdu ? 'سب دیکھیں' : 'See all'}
              </Text>
            </Pressable>
          )}
        </View>

        <View style={styles.salesFeedList}>
          {recentSales.length > 0 ? (
            <>
              {recentSales.map((s) => {
                const isCash = s.paymentMethod === 'cash';
                const isOnline = s.paymentMethod === 'online';

                const badgeBg = isCash
                  ? (settings.darkMode ? 'rgba(0, 201, 167, 0.16)' : '#D1FAE5')
                  : isOnline
                    ? (settings.darkMode ? 'rgba(47, 159, 248, 0.16)' : '#DBEAFE')
                    : (settings.darkMode ? 'rgba(243, 112, 90, 0.16)' : '#FEE2E2');

                const badgeColor = isCash ? '#059669' : isOnline ? '#0284C7' : '#DC2626';

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
                        name={isCash ? 'cash-outline' : isOnline ? 'phone-portrait-outline' : 'book-outline'}
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
                        {s.paymentMethod}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}

              {sales.length > MAX_HOME_RECENT_SALES && (
                <Pressable
                  onPress={() => setActiveTab('history')}
                  style={({ pressed }) => [
                    styles.viewMoreSalesBtn,
                    { backgroundColor: settings.darkMode ? 'rgba(255,255,255,0.04)' : '#F1F5F9', borderColor: softBorder },
                    pressed && { opacity: 0.8 },
                  ]}>
                  <Text style={[styles.viewMoreSalesText, { color: theme.primary }]}>
                    {isUrdu
                      ? `تمام ${sales.length} بلز دیکھیں`
                      : `View all ${sales.length} bills`}
                  </Text>
                </Pressable>
              )}
            </>
          ) : (
            <EmptyState
              icon="receipt-outline"
              title={t('noRecentSales')}
              subtitle={isUrdu ? 'پہلی سیل کے لیے "نیا بل" دبائیں' : 'Tap New Bill to record today\'s first sale.'}
              actionLabel={isUrdu ? 'نیا بل' : 'New Bill'}
              onAction={() => setIsSaleModalOpen(true)}
              compact
            />
          )}
        </View>

        {showSetupCard && (
          <View style={[styles.setupCard, { backgroundColor: theme.card, borderColor: softBorder }]}>
            <View style={styles.setupCardHeader}>
              <View style={[styles.setupIconWrap, { backgroundColor: theme.successLight }]}>
                <Ionicons name="storefront-outline" size={17} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.setupTitle, { color: theme.text }]}>
                  {isUrdu ? 'دکان شروع کرنے کے آسان مراحل' : 'Quick store setup'}
                </Text>
                <Text style={[styles.setupSubtitle, { color: theme.textSecondary }]}>
                  {completedStepsCount}/3 {isUrdu ? 'مراحل مکمل' : 'completed'}
                </Text>
              </View>

              <Pressable
                onPress={handleDismissSetupCard}
                hitSlop={8}
                style={({ pressed }) => [styles.dismissBtn, pressed && { opacity: 0.6 }]}>
                <Ionicons name="close" size={18} color={theme.textMuted} />
              </Pressable>
            </View>

            <View style={[styles.progressBarTrack, { backgroundColor: settings.darkMode ? 'rgba(255,255,255,0.08)' : '#E2E8F0' }]}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    backgroundColor: theme.primary,
                    width: `${Math.max(12, Math.round((completedStepsCount / 3) * 100))}%`,
                  },
                ]}
              />
            </View>

            {!hasProducts && (
              <View style={styles.setupActionRow}>
                <Pressable
                  onPress={handleLoadStaples}
                  disabled={isLoadingStaples}
                  style={({ pressed }) => [
                    styles.setupPrimaryBtn,
                    { backgroundColor: theme.primary },
                    pressed && { opacity: 0.9 },
                  ]}>
                  <Ionicons name="flash-outline" size={14} color="#FFFFFF" />
                  <Text style={styles.setupPrimaryBtnText}>
                    {isLoadingStaples
                      ? (isUrdu ? 'لوڈ ہو رہا ہے...' : 'Loading...')
                      : (isUrdu ? '20 بنیادی اشیاء شامل کریں' : 'Load top 20 staples')}
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        )}

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
              {isUrdu ? 'رپورٹس اور منافع' : 'Reports'}
            </Text>
          </View>
          <Ionicons name={showReports ? 'chevron-up' : 'chevron-down'} size={16} color={theme.textMuted} />
        </Pressable>

        {showReports && (
          <View style={styles.reportsDrawerArea}>
            <SalesChart sales={sales} />

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

        <DayEndClosingModal
          visible={showDayEnd}
          onClose={() => setShowDayEnd(false)}
          todaySales={todaySales}
          todaySalesTotal={todaySalesTotal}
          todayCash={todayCash}
          todayOnline={todayOnline}
          todayUdhaar={todayUdhaar}
          todayVasooli={todayVasooli}
          todayCashOutTotal={todayCashOutTotal}
          todayNetCashInDrawer={todayNetCashInDrawer}
          todayGrossProfit={todayGrossProfit}
        />

        <CashOutModal
          visible={isCashOutModalOpen}
          onClose={() => setIsCashOutModalOpen(false)}
          onCashOutSaved={refreshCashOut}
        />

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
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  feedTitleBlock: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  feedTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  tallyLink: {
    fontSize: 13,
    fontWeight: '600',
  },
  seeAllLink: {
    fontSize: 14,
    fontWeight: '700',
  },
  salesFeedList: {
    gap: 10,
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
    paddingVertical: 12,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
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

  setupCard: {
    borderRadius: 22,
    borderCurve: 'continuous',
    borderWidth: 1,
    padding: Spacing.md,
    gap: 10,
  },
  setupCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  setupIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  setupTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  setupSubtitle: {
    fontSize: 12,
    marginTop: 1,
  },
  dismissBtn: {
    padding: 4,
  },
  progressBarTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  setupActionRow: {
    paddingTop: 4,
  },
  setupPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    minHeight: 44,
    borderRadius: 12,
    borderCurve: 'continuous',
  },
  setupPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
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
