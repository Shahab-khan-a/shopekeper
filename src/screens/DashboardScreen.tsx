import { CASH_OUT_STORAGE_KEY, CashOutEntry, CashOutModal } from '@/components/CashOutModal';
import { DayEndClosingModal } from '@/components/DayEndClosingModal';
import { RainbowQuickActionFab } from '@/components/RainbowQuickActionFab';
import { SalesChart } from '@/components/SalesChart';
import { EmptyState } from '@/components/ui/EmptyState';
import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
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
    lowStockProducts,
    outOfStockProducts,
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
    setIsAddProductOpen,
    t,
    language,
    showAlert,
    loadStapleProducts,
  } = useShop();

  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const isUrdu = language === 'ur';

  // Day-0 Kiryana Setup State
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

  // Top 4 most recent sales on home
  const MAX_HOME_RECENT_SALES = 4;
  const recentSales = useMemo(() => {
    return [...sales]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, MAX_HOME_RECENT_SALES);
  }, [sales]);

  // Modals & Triggers
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

  // Vasooli collected today from customers
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

  // Net Cash in Drawer = Cash Sales + Khata Vasooli - Cash Out
  const todayNetCashInDrawer = Math.max(0, todayCash + todayVasooli - todayCashOutTotal);

  const todayGrossProfit = todaySales.reduce((a, s) => {
    const cost = s.items.reduce((c: number, it: any) => c + ((it.costPrice || 0) * it.quantity), 0);
    return a + (s.grandTotal - cost);
  }, 0);

  const softBorder = settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(148, 163, 184, 0.18)';

  return (
    <View style={[styles.rootContainer, { backgroundColor: theme.background }]}>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* ── SadaPay Signature 2-Column Hero Section ── */}
        <View style={styles.heroGrid}>
          {/* Left Column: Big Mint/Teal Balance Card */}
          <Pressable
            onPress={() => setShowDayEnd(true)}
            style={({ pressed }) => [
              styles.balanceCard,
              {
                backgroundColor: settings.darkMode ? '#064E3B' : '#00C9A7',
              },
              pressed && { opacity: 0.96, transform: [{ scale: 0.99 }] },
            ]}>
            <View style={styles.balanceTopRow}>
              <Text style={styles.balanceLabel}>
                {isUrdu ? 'گلہ کا نقد کیش' : 'Current balance'}
              </Text>

              {/* Expense Shortcut Pill */}
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  setIsCashOutModalOpen(true);
                }}
                hitSlop={6}
                style={({ pressed }) => [
                  styles.miniExpenseBtn,
                  pressed && { opacity: 0.8 },
                ]}>
                <Ionicons name="arrow-up" size={10} color="#FFFFFF" />
                <Text style={styles.miniExpenseText}>
                  {isUrdu ? 'خرچہ' : 'Exp'}
                </Text>
              </Pressable>
            </View>

            {/* Giant Clean Amount */}
            <View style={styles.balanceAmountWrap}>
              <Text style={styles.currencySymbolText}>
                {settings.currencySymbol}
              </Text>
              <Text style={styles.balanceAmountText} numberOfLines={1} adjustsFontSizeToFit>
                {todayNetCashInDrawer.toLocaleString()}
              </Text>
            </View>

            {/* Bottom Row: Chic Mastercard Duo-Circles + Arrow */}
            <View style={styles.balanceFooterRow}>
              <View style={styles.duoCirclesGraphic}>
                <View style={[styles.duoCircle, { backgroundColor: '#EB001B' }]} />
                <View style={[styles.duoCircle, { backgroundColor: '#F79E1B', marginLeft: -9, opacity: 0.9 }]} />
              </View>

              <View style={styles.balanceArrowBtn}>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </View>
            </View>
          </Pressable>

          {/* Right Column: 2 Stacked Squircle Action Cards (Blue + Coral) */}
          <View style={styles.actionColumn}>
            {/* Top Tile: Electric Blue -> + New Bill */}
            <Pressable
              onPress={() => setIsSaleModalOpen(true)}
              style={({ pressed }) => [
                styles.actionTile,
                { backgroundColor: settings.darkMode ? '#0284C7' : '#2F9FF8' },
                pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
              ]}>
              <View style={styles.actionTileIconCircle}>
                <Ionicons name="arrow-down" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.actionTileText}>
                {isUrdu ? 'نیا بل بنائیں' : 'New Bill'}
              </Text>
            </Pressable>

            {/* Bottom Tile: Warm Coral/Salmon -> Day-End Tally */}
            <Pressable
              onPress={() => setShowDayEnd(true)}
              style={({ pressed }) => [
                styles.actionTile,
                { backgroundColor: settings.darkMode ? '#EA580C' : '#F3705A' },
                pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
              ]}>
              <View style={styles.actionTileIconCircle}>
                <Ionicons name="arrow-redo" size={15} color="#FFFFFF" />
              </View>
              <Text style={styles.actionTileText}>
                {isUrdu ? 'شام کا حساب' : 'Day Tally'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* ── Soft Micro-Stats Capsule Bar ── */}
        <View style={styles.microStatsRow}>
          {/* Stat 1: Customer Credit (Khata) */}
          <Pressable
            onPress={() => setActiveTab('khata')}
            style={({ pressed }) => [
              styles.microStatCard,
              {
                backgroundColor: theme.card,
                borderColor: softBorder,
              },
              pressed && { opacity: 0.85 },
            ]}>
            <View style={[styles.microStatIconPod, { backgroundColor: settings.darkMode ? 'rgba(239,68,68,0.16)' : '#FEE2E2' }]}>
              <Ionicons name="book" size={13} color="#DC2626" />
            </View>
            <View style={styles.microStatTextWrap}>
              <Text style={[styles.microStatLabel, { color: theme.textMuted }]}>
                {isUrdu ? 'ادھار' : 'Khata'}
              </Text>
              <Text style={[styles.microStatValue, { color: theme.danger }]}>
                {settings.currencySymbol}{totalUdhaarReceivable.toLocaleString()}
              </Text>
            </View>
          </Pressable>

          {/* Stat 2: Low Stock Warning */}
          <Pressable
            onPress={() => setActiveTab('products')}
            style={({ pressed }) => [
              styles.microStatCard,
              {
                backgroundColor: theme.card,
                borderColor: softBorder,
              },
              pressed && { opacity: 0.85 },
            ]}>
            <View
              style={[
                styles.microStatIconPod,
                {
                  backgroundColor:
                    lowStockProducts.length + outOfStockProducts.length > 0
                      ? settings.darkMode ? 'rgba(245,158,11,0.16)' : '#FEF3C7'
                      : settings.darkMode ? 'rgba(16,185,129,0.14)' : '#ECFDF5',
                },
              ]}>
              <Ionicons
                name="warning"
                size={13}
                color={lowStockProducts.length + outOfStockProducts.length > 0 ? '#D97706' : '#059669'}
              />
            </View>
            <View style={styles.microStatTextWrap}>
              <Text style={[styles.microStatLabel, { color: theme.textMuted }]}>
                {isUrdu ? 'اسٹاک' : 'Stock'}
              </Text>
              <Text
                style={[
                  styles.microStatValue,
                  {
                    color:
                      lowStockProducts.length + outOfStockProducts.length > 0
                        ? theme.warning
                        : theme.success,
                  },
                ]}>
                {lowStockProducts.length + outOfStockProducts.length > 0
                  ? `${lowStockProducts.length + outOfStockProducts.length} ${isUrdu ? 'کم' : 'low'}`
                  : (isUrdu ? 'مکمل ✓' : 'Good ✓')}
              </Text>
            </View>
          </Pressable>

          {/* Stat 3: Today Gross Profit */}
          <Pressable
            onPress={() => setShowDayEnd(true)}
            style={({ pressed }) => [
              styles.microStatCard,
              {
                backgroundColor: theme.card,
                borderColor: softBorder,
              },
              pressed && { opacity: 0.85 },
            ]}>
            <View style={[styles.microStatIconPod, { backgroundColor: settings.darkMode ? 'rgba(16,185,129,0.14)' : '#ECFDF5' }]}>
              <Ionicons name="trending-up" size={13} color="#059669" />
            </View>
            <View style={styles.microStatTextWrap}>
              <Text style={[styles.microStatLabel, { color: theme.textMuted }]}>
                {isUrdu ? 'منافع' : 'Profit'}
              </Text>
              <Text style={[styles.microStatValue, { color: '#059669' }]}>
                +{settings.currencySymbol}{todayGrossProfit.toLocaleString()}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* ── Day-0 Rapid Store Setup Card (If not finished) ── */}
        {showSetupCard && (
          <View style={[styles.setupCard, { backgroundColor: theme.card, borderColor: softBorder }]}>
            <View style={styles.setupCardHeader}>
              <View style={[styles.setupIconWrap, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="sparkles" size={17} color="#059669" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.setupTitle, { color: theme.text }]}>
                  {isUrdu ? 'دکان شروع کرنے کے آسان مراحل' : 'Quick Store Setup'}
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

            {/* Progress track */}
            <View style={[styles.progressBarTrack, { backgroundColor: settings.darkMode ? 'rgba(255,255,255,0.08)' : '#E2E8F0' }]}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    backgroundColor: '#00C9A7',
                    width: `${Math.max(12, Math.round((completedStepsCount / 3) * 100))}%`,
                  },
                ]}
              />
            </View>

            {/* Step 1: Add Staples */}
            {!hasProducts && (
              <View style={styles.setupActionRow}>
                <Pressable
                  onPress={handleLoadStaples}
                  disabled={isLoadingStaples}
                  style={({ pressed }) => [
                    styles.setupPrimaryBtn,
                    { backgroundColor: '#00C9A7' },
                    pressed && { opacity: 0.9 },
                  ]}>
                  <Ionicons name="flash" size={14} color="#FFFFFF" />
                  <Text style={styles.setupPrimaryBtnText}>
                    {isLoadingStaples
                      ? (isUrdu ? 'لوڈ ہو رہا ہے...' : 'Loading...')
                      : (isUrdu ? '⚡ 20 بنیادی اشیاء شامل کریں' : '⚡ Load Top 20 Staples')}
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        )}

        {/* ── Today's Activity Feed (SadaPay Inspo: Netflix / KFC Floating Cards) ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {isUrdu ? 'آج کی فروخت' : 'Today'}
          </Text>
          <Text style={[styles.sectionCountText, { color: theme.textMuted }]}>
            {todaySales.length > 0
              ? `${todaySales.length} ${isUrdu ? 'بلز' : 'bills'} · ${settings.currencySymbol}${todaySalesTotal.toLocaleString()}`
              : (isUrdu ? 'کوئی بل نہیں' : 'No bills yet')}
          </Text>
        </View>

        {recentSales.length === 0 ? (
          <EmptyState
            icon="receipt-outline"
            title={t('noRecentSales')}
            subtitle={isUrdu ? 'پہلا بل بنانے کے لیے اوپر "+ نیا بل" دبائیں' : 'Tap "+ New Bill" above to create your first sale.'}
            actionLabel={isUrdu ? 'نیا بل بنائیں' : '+ New Bill'}
            onAction={() => setIsSaleModalOpen(true)}
            compact
          />
        ) : (
          <View style={styles.salesListContainer}>
            {recentSales.map((s) => {
              const isCash = s.paymentMethod === 'cash';
              const isOnline = s.paymentMethod === 'online';

              // Soft pastel badge backgrounds matching SadaPay
              const badgeBg = isCash
                ? (settings.darkMode ? 'rgba(0, 201, 167, 0.16)' : '#D5F0F7')
                : isOnline
                  ? (settings.darkMode ? 'rgba(47, 159, 248, 0.16)' : '#E0F2FE')
                  : (settings.darkMode ? 'rgba(243, 112, 90, 0.16)' : '#FEE2E2');

              const badgeColor = isCash ? '#00A389' : isOnline ? '#0284C7' : '#DC2626';

              return (
                <Pressable
                  key={s.id}
                  onPress={() => setActiveReceipt(s)}
                  style={({ pressed }) => [
                    styles.floatingSaleCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: softBorder,
                    },
                    pressed && { opacity: 0.88, transform: [{ scale: 0.99 }] },
                  ]}>
                  {/* Left Squircle Icon Badge */}
                  <View style={[styles.saleSquircleBadge, { backgroundColor: badgeBg }]}>
                    <Ionicons
                      name={isCash ? 'card-outline' : isOnline ? 'phone-portrait-outline' : 'book-outline'}
                      size={20}
                      color={badgeColor}
                    />
                  </View>

                  {/* Middle Customer & Timestamp */}
                  <View style={styles.saleInfoBlock}>
                    <Text style={[styles.saleCustomerTitle, { color: theme.text }]} numberOfLines={1}>
                      {s.customerName || (isUrdu ? 'نقد کاؤنٹر سیل' : 'Walk-in Cash')}
                    </Text>
                    <Text style={[styles.saleTimeSubtitle, { color: theme.textMuted }]} numberOfLines={1}>
                      {new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • #{s.billNumber}
                    </Text>
                  </View>

                  {/* Right Amount & Subtitle */}
                  <View style={styles.saleAmountBlock}>
                    <Text style={[styles.saleAmountNumber, { color: theme.text }]}>
                      {settings.currencySymbol}{s.grandTotal.toLocaleString()}
                    </Text>
                    <Text style={[styles.saleItemsSubtitle, { color: theme.textMuted }]}>
                      {s.items.length} {t('itemsCount')} · {s.paymentMethod.toUpperCase()}
                    </Text>
                  </View>
                </Pressable>
              );
            })}

            {/* View All Sales Link */}
            {sales.length > MAX_HOME_RECENT_SALES && (
              <Pressable
                onPress={() => setActiveTab('history')}
                style={({ pressed }) => [
                  styles.viewAllHistoryBtn,
                  { backgroundColor: theme.card, borderColor: softBorder },
                  pressed && { opacity: 0.8 },
                ]}>
                <Text style={[styles.viewAllHistoryText, { color: theme.textSecondary }]}>
                  {isUrdu ? `تمام ${sales.length} بلز دیکھیں →` : `View All ${sales.length} Transactions →`}
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {/* ── Collapsible Analytics & Reports Drawer ── */}
        <Pressable
          onPress={() => setShowReports((v) => !v)}
          style={({ pressed }) => [
            styles.reportsPillBtn,
            { backgroundColor: theme.card, borderColor: softBorder },
            pressed && { opacity: 0.85 },
          ]}>
          <View style={styles.reportsPillLeft}>
            <Ionicons name="bar-chart-outline" size={17} color="#00C9A7" />
            <Text style={[styles.reportsPillTitle, { color: theme.text }]}>
              {isUrdu ? 'دکان کی رپورٹس اور منافع کا گراف' : 'Analytics & Profit Reports'}
            </Text>
          </View>
          <Ionicons name={showReports ? 'chevron-up' : 'chevron-down'} size={16} color={theme.textMuted} />
        </Pressable>

        {showReports && (
          <View style={styles.reportsDrawerArea}>
            <SalesChart sales={sales} />

            <View style={styles.financeGrid}>
              {/* Card 1: Inventory Value */}
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
                  <Text style={[styles.financeBadgeText, { color: '#00C9A7' }]}>
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
                    <Text style={[styles.financeSubStatValue, { color: '#00C9A7', fontWeight: '800' }]}>
                      +{settings.currencySymbol} {totalExpectedStockProfit.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </Pressable>

              {/* Card 2: Total Store Lifetime Earnings */}
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
                  <Text style={[styles.financeBadgeText, { color: '#7C3AED' }]}>
                    {sales.filter(s => s.status !== 'refunded' && s.status !== 'cancelled').length} {isUrdu ? 'بلز' : 'sales'}
                  </Text>
                </View>

                <Text style={[styles.financeMainAmount, { color: '#7C3AED' }]}>
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

        {/* Day-End Cash Tally & Closing Modal */}
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

        {/* Cash Out (Expense) Modal */}
        <CashOutModal
          visible={isCashOutModalOpen}
          onClose={() => setIsCashOutModalOpen(false)}
          onCashOutSaved={refreshCashOut}
        />

      </ScrollView>

      {/* Floating Action Button */}
      <RainbowQuickActionFab
        onNewSale={() => setIsSaleModalOpen(true)}
        onAddProduct={() => setIsAddProductOpen(true)}
        onDayEnd={() => setShowDayEnd(true)}
        onSettings={() => setActiveTab('settings')}
        primaryColor="#00C9A7"
        isDark={!!settings.darkMode}
        language={language}
      />

      {/* Direct New Sale Modal on Home */}
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
    position: 'relative',
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: 110,
    maxWidth: 720,
    marginHorizontal: 'auto',
    width: '100%',
    gap: 14,
  },
  saleModalContainer: {
    flex: 1,
  },

  // ── SadaPay Signature 2-Column Hero ──
  heroGrid: {
    flexDirection: 'row',
    height: 195,
    gap: 12,
  },
  balanceCard: {
    flex: 1.32,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    justifyContent: 'space-between',
    ...Shadows.md,
  },
  balanceTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.92)',
    fontSize: 12.5,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  miniExpenseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  miniExpenseText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  balanceAmountWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginVertical: 4,
  },
  currencySymbolText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    fontWeight: '700',
  },
  balanceAmountText: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  balanceFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  duoCirclesGraphic: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duoCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  balanceArrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Right Action Column (Blue + Coral)
  actionColumn: {
    flex: 1,
    gap: 10,
  },
  actionTile: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'space-between',
    ...Shadows.sm,
  },
  actionTileIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTileText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
    letterSpacing: -0.2,
  },

  // ── Soft Micro-Stats Row ──
  microStatsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  microStatCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    ...Shadows.sm,
  },
  microStatIconPod: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  microStatTextWrap: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  microStatLabel: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  microStatValue: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: -0.3,
  },

  // ── Setup Card ──
  setupCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: Spacing.md,
    gap: 10,
    ...Shadows.sm,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  setupTitle: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  setupSubtitle: {
    fontSize: 11,
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
    paddingVertical: 8,
    borderRadius: 12,
  },
  setupPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  // ── Today Section Header ──
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  sectionCountText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // ── Floating Sale Cards (SadaPay Inspo: Netflix / KFC style) ──
  salesListContainer: {
    gap: 10,
  },
  floatingSaleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1,
    ...Shadows.sm,
  },
  saleSquircleBadge: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saleInfoBlock: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  saleCustomerTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  saleTimeSubtitle: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  saleAmountBlock: {
    alignItems: 'flex-end',
    gap: 2,
  },
  saleAmountNumber: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  saleItemsSubtitle: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  viewAllHistoryBtn: {
    paddingVertical: 11,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  viewAllHistoryText: {
    fontSize: 12.5,
    fontWeight: '700',
  },

  // ── Reports Pill & Drawer ──
  reportsPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginTop: 4,
    ...Shadows.sm,
  },
  reportsPillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  reportsPillTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  reportsDrawerArea: {
    gap: 12,
    paddingTop: 4,
  },
  financeGrid: {
    gap: 10,
  },
  financeCard: {
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    ...Shadows.sm,
  },
  financeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  financeBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  financeCardTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  financeMainAmount: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginTop: 4,
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
    fontSize: 10.5,
    fontWeight: '500',
  },
  financeSubStatValue: {
    fontSize: 12.5,
    fontWeight: '700',
  },
});
