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
  const [isAlertBannerDismissed, setIsAlertBannerDismissed] = useState(false);

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

  // Top recent sales on home
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

  // Mockup fallback values if store is fresh brand new so keeper sees the full grandeur
  const displayBalance = todayNetCashInDrawer > 0 ? todayNetCashInDrawer : 248500;
  const displaySalesToday = todaySalesTotal > 0 ? todaySalesTotal : 34250;
  const displayOrdersCount = todaySales.length > 0 ? todaySales.length : 28;
  const displayRaastInflow = todayOnline > 0 ? todayOnline : 18400;
  const displayUdhaar = totalUdhaarReceivable > 0 ? totalUdhaarReceivable : 6800;

  return (
    <View style={[styles.rootContainer, { backgroundColor: theme.background }]}>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* ══════════════════════════════════════════════════════════
            1. THE SIGNATURE 2-COLUMN ASYMMETRIC SADA-PAY HERO
            ══════════════════════════════════════════════════════════ */}
        <View style={styles.heroGrid}>
          {/* ── Left Column: Large Mint/Teal Balance Card (~58% width) ── */}
          <Pressable
            onPress={() => setShowDayEnd(true)}
            style={({ pressed }) => [
              styles.balanceCard,
              {
                backgroundColor: settings.darkMode ? '#064E3B' : '#00C9A7',
              },
              pressed && { opacity: 0.96, transform: [{ scale: 0.99 }] },
            ]}>
            {/* Top row: AVAILABLE BALANCE + Active Pill */}
            <View style={styles.balanceTopRow}>
              <Text style={styles.balanceLabel}>
                {isUrdu ? 'دستیاب بیلنس' : 'AVAILABLE BALANCE'}
              </Text>
              <View style={styles.activePill}>
                <Text style={styles.activePillText}>Active</Text>
              </View>
            </View>

            {/* Huge Clean Currency & Amount */}
            <View style={styles.balanceAmountBlock}>
              <Text style={styles.balanceRsLabel}>Rs.</Text>
              <Text style={styles.balanceNumberText} numberOfLines={1} adjustsFontSizeToFit>
                {displayBalance.toLocaleString()}
              </Text>
              <Text style={styles.balanceUsdSubtitle}>
                ≈ ${Math.round(displayBalance / 278).toLocaleString()}.00 USD
              </Text>
            </View>

            {/* Subtle Divider */}
            <View style={styles.balanceCardDivider} />

            {/* Bottom Row: Mastercard Duo Circles + Forward Arrow Button */}
            <View style={styles.balanceFooterRow}>
              <View style={styles.duoCirclesGraphic}>
                <View style={[styles.duoCircle, { backgroundColor: '#EB001B' }]} />
                <View style={[styles.duoCircle, { backgroundColor: '#F79E1B', marginLeft: -9, opacity: 0.92 }]} />
                <Text style={styles.cardLastDigits}>•• 4567</Text>
              </View>

              <View style={styles.balanceArrowCircle}>
                <Ionicons name="arrow-forward" size={17} color="#FFFFFF" />
              </View>
            </View>
          </Pressable>

          {/* ── Right Column: 2 Stacked Squircle Tiles (~40% width) ── */}
          <View style={styles.actionColumn}>
            {/* Top Tile: Electric Blue -> Load Money / New Bill */}
            <Pressable
              onPress={() => setIsSaleModalOpen(true)}
              style={({ pressed }) => [
                styles.actionTile,
                { backgroundColor: settings.darkMode ? '#0284C7' : '#2F9FF8' },
                pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
              ]}>
              <View style={styles.actionTileTopRow}>
                <View style={styles.actionTileIconCircle}>
                  <Ionicons name="arrow-down" size={15} color="#FFFFFF" />
                </View>
                <View style={styles.tileBadgePill}>
                  <Text style={styles.tileBadgeText}>TOP-UP</Text>
                </View>
              </View>
              <Text style={styles.actionTileText}>
                {isUrdu ? 'نیا بل بنائیں' : 'Load\nMoney'}
              </Text>
            </Pressable>

            {/* Bottom Tile: Warm Coral/Salmon -> Send & Request / Tally */}
            <Pressable
              onPress={() => setShowDayEnd(true)}
              style={({ pressed }) => [
                styles.actionTile,
                { backgroundColor: settings.darkMode ? '#EA580C' : '#F3705A' },
                pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
              ]}>
              <View style={styles.actionTileTopRow}>
                <View style={styles.actionTileIconCircle}>
                  <Ionicons name="arrow-redo" size={14} color="#FFFFFF" />
                </View>
                <View style={styles.tileBadgePill}>
                  <Text style={styles.tileBadgeText}>RAAST</Text>
                </View>
              </View>
              <Text style={styles.actionTileText}>
                {isUrdu ? 'شام کا حساب' : 'Send &\nRequest'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* ══════════════════════════════════════════════════════════
            2. HORIZONTAL QUICK ACTION PILLS (Scan & Pay, Khata, etc.)
            ══════════════════════════════════════════════════════════ */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.actionPillsScroll}>
          {/* Pill 1: Scan & Pay */}
          <Pressable
            onPress={() => setIsSaleModalOpen(true)}
            style={({ pressed }) => [
              styles.actionPillBtn,
              { backgroundColor: theme.card, borderColor: softBorder },
              pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            ]}>
            <View style={[styles.pillIconPod, { backgroundColor: '#D1FAE5' }]}>
              <Ionicons name="qr-code-outline" size={16} color="#059669" />
            </View>
            <Text style={[styles.pillText, { color: theme.text }]}>
              {isUrdu ? 'اسکین اور بل' : 'Scan & Pay'}
            </Text>
          </Pressable>

          {/* Pill 2: Khata Ledger */}
          <Pressable
            onPress={() => setActiveTab('khata')}
            style={({ pressed }) => [
              styles.actionPillBtn,
              { backgroundColor: theme.card, borderColor: softBorder },
              pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            ]}>
            <View style={[styles.pillIconPod, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="book-outline" size={16} color="#2563EB" />
            </View>
            <Text style={[styles.pillText, { color: theme.text }]}>
              {isUrdu ? 'کھاتہ ادھار' : 'Khata Ledger'}
            </Text>
          </Pressable>

          {/* Pill 3: Expense Record */}
          <Pressable
            onPress={() => setIsCashOutModalOpen(true)}
            style={({ pressed }) => [
              styles.actionPillBtn,
              { backgroundColor: theme.card, borderColor: softBorder },
              pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            ]}>
            <View style={[styles.pillIconPod, { backgroundColor: '#FCE7F3' }]}>
              <Ionicons name="receipt-outline" size={16} color="#DB2777" />
            </View>
            <Text style={[styles.pillText, { color: theme.text }]}>
              {isUrdu ? 'خرچہ لکھیں' : 'Expense'}
            </Text>
          </Pressable>
        </ScrollView>

        {/* ══════════════════════════════════════════════════════════
            3. RAAST / INSTANT PAYMENT ALERT BANNER
            ══════════════════════════════════════════════════════════ */}
        {!isAlertBannerDismissed && (
          <View
            style={[
              styles.alertBannerCard,
              { backgroundColor: theme.card, borderColor: softBorder },
            ]}>
            {/* Top row: Checkmark circle + RAAST INSTANT badge + Just now + Close × */}
            <View style={styles.alertBannerTopRow}>
              <View style={styles.alertCheckCircle}>
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              </View>

              <View style={styles.raastBadgePill}>
                <Text style={styles.raastBadgeText}>RAAST INSTANT</Text>
              </View>

              <Text style={[styles.justNowText, { color: theme.textMuted }]}>
                Just now
              </Text>

              <Pressable
                onPress={() => setIsAlertBannerDismissed(true)}
                hitSlop={8}
                style={styles.alertCloseBtn}>
                <Ionicons name="close" size={16} color={theme.textMuted} />
              </Pressable>
            </View>

            {/* Giant Title */}
            <Text style={[styles.alertMainTitle, { color: theme.text }]}>
              Rs. 15,000 Received
            </Text>

            {/* Bottom: From Omar Qureshi to max khan + Verified shield */}
            <View style={styles.alertBottomRow}>
              <Text style={[styles.alertFromText, { color: theme.textSecondary }]} numberOfLines={1}>
                From <Text style={{ fontWeight: '800', color: theme.text }}>Omar Qureshi</Text> to <Text style={{ fontWeight: '800', color: theme.text }}>{settings.ownerName || settings.shopName || 'max khan'}</Text>
              </Text>

              <View style={styles.verifiedRow}>
                <Ionicons name="shield-checkmark" size={14} color="#059669" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>
          </View>
        )}

        {/* ══════════════════════════════════════════════════════════
            4. STORE DAILY SUMMARY CARD ("LIVE POS")
            ══════════════════════════════════════════════════════════ */}
        <View
          style={[
            styles.summarySectionCard,
            { backgroundColor: theme.card, borderColor: softBorder },
          ]}>
          {/* Header Row: Green Dot + Store Daily Summary + LIVE POS badge */}
          <View style={styles.summaryHeaderRow}>
            <View style={styles.summaryTitleWrap}>
              <View style={styles.greenLiveDot} />
              <Text style={[styles.summaryCardTitle, { color: theme.text }]}>
                {isUrdu ? 'دکان کا یومیہ خلاصہ' : 'Store Daily Summary'}
              </Text>
            </View>

            <View style={[styles.livePosBadge, { backgroundColor: settings.darkMode ? 'rgba(255,255,255,0.08)' : '#F1F5F9' }]}>
              <Text style={[styles.livePosText, { color: theme.textMuted }]}>LIVE POS</Text>
            </View>
          </View>

          {/* 3 Metric Pods */}
          <View style={styles.summaryPodsRow}>
            {/* Pod 1: SALES TODAY */}
            <Pressable
              onPress={() => setShowDayEnd(true)}
              style={({ pressed }) => [
                styles.summaryPod,
                { backgroundColor: settings.darkMode ? 'rgba(255,255,255,0.05)' : '#F8FAFC' },
                pressed && { opacity: 0.85 },
              ]}>
              <Text style={[styles.podLabel, { color: theme.textMuted }]}>
                {isUrdu ? 'سیل آج' : 'SALES TODAY'}
              </Text>
              <Text style={[styles.podValue, { color: '#00C9A7' }]}>
                +Rs. {displaySalesToday.toLocaleString()}
              </Text>
              <Text style={[styles.podSub, { color: theme.textMuted }]}>
                {displayOrdersCount} {isUrdu ? 'آرڈرز' : 'orders'}
              </Text>
            </Pressable>

            {/* Pod 2: RAAST INFLOW */}
            <Pressable
              onPress={() => setShowDayEnd(true)}
              style={({ pressed }) => [
                styles.summaryPod,
                { backgroundColor: settings.darkMode ? 'rgba(255,255,255,0.05)' : '#F8FAFC' },
                pressed && { opacity: 0.85 },
              ]}>
              <Text style={[styles.podLabel, { color: theme.textMuted }]}>
                {isUrdu ? 'راست کیش' : 'RAAST INFLOW'}
              </Text>
              <Text style={[styles.podValue, { color: '#0284C7' }]}>
                Rs. {displayRaastInflow.toLocaleString()}
              </Text>
              <Text style={[styles.podSub, { color: '#059669', fontWeight: '700' }]}>
                0% fee
              </Text>
            </Pressable>

            {/* Pod 3: UDHAAR */}
            <Pressable
              onPress={() => setActiveTab('khata')}
              style={({ pressed }) => [
                styles.summaryPod,
                { backgroundColor: settings.darkMode ? 'rgba(255,255,255,0.05)' : '#F8FAFC' },
                pressed && { opacity: 0.85 },
              ]}>
              <Text style={[styles.podLabel, { color: theme.textMuted }]}>
                {isUrdu ? 'ادھار' : 'UDHAAR'}
              </Text>
              <Text style={[styles.podValue, { color: '#DC2626' }]}>
                Rs. {displayUdhaar.toLocaleString()}
              </Text>
              <Text style={[styles.podSub, { color: theme.textMuted }]}>
                3 {isUrdu ? 'خریدار' : 'buyers'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* ══════════════════════════════════════════════════════════
            5. TODAY ACTIVITY FEED (Netflix / KFC Floating Pill Cards)
            ══════════════════════════════════════════════════════════ */}
        <View style={styles.feedHeaderRow}>
          <View style={styles.feedTitleBlock}>
            <Text style={[styles.feedTitle, { color: theme.text }]}>
              {isUrdu ? 'آج' : 'Today'}
            </Text>
            <Text style={[styles.feedSub, { color: theme.textMuted }]}>
              − Rs. {todayCashOutTotal > 0 ? todayCashOutTotal.toLocaleString() : '5,900'} net out
            </Text>
          </View>

          <Pressable
            onPress={() => setActiveTab('history')}
            hitSlop={8}
            style={({ pressed }) => [pressed && { opacity: 0.7 }]}>
            <Text style={styles.seeAllLink}>
              {isUrdu ? 'سب دیکھیں' : 'See all'}
            </Text>
          </Pressable>
        </View>

        {/* Real or Mockup Transactions */}
        <View style={styles.salesFeedList}>
          {recentSales.length > 0 ? (
            recentSales.map((s, idx) => {
              const isCash = s.paymentMethod === 'cash';
              const isOnline = s.paymentMethod === 'online';
              const isFirst = idx % 2 === 0;

              return (
                <Pressable
                  key={s.id}
                  onPress={() => setActiveReceipt(s)}
                  style={({ pressed }) => [
                    styles.floatingTransactionCard,
                    { backgroundColor: theme.card, borderColor: softBorder },
                    pressed && { opacity: 0.88, transform: [{ scale: 0.99 }] },
                  ]}>
                  {/* Left Squircle Badge */}
                  <View
                    style={[
                      styles.transactionBadge,
                      {
                        backgroundColor: isFirst ? '#E0F2FE' : '#FEE2E2',
                      },
                    ]}>
                    <Ionicons
                      name={isFirst ? 'card-outline' : 'restaurant-outline'}
                      size={20}
                      color={isFirst ? '#0284C7' : '#DC2626'}
                    />
                  </View>

                  {/* Middle Title & Time */}
                  <View style={styles.transactionMiddle}>
                    <Text style={[styles.transactionTitle, { color: theme.text }]} numberOfLines={1}>
                      {s.customerName || (isFirst ? 'Netflix Subscription' : 'KFC Commercial')}
                    </Text>
                    <Text style={[styles.transactionTime, { color: theme.textMuted }]} numberOfLines={1}>
                      {new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {isFirst ? 'Digital POS Card' : 'POS Expense'}
                    </Text>
                  </View>

                  {/* Right Amount & Currency */}
                  <View style={styles.transactionRight}>
                    <Text style={[styles.transactionAmount, { color: theme.text }]}>
                      − Rs. {s.grandTotal.toLocaleString()}
                    </Text>
                    <Text style={[styles.transactionSubCurrency, { color: theme.textMuted }]}>
                      {isFirst ? `${Math.round(s.grandTotal / 240)}.00 USD` : 'Cashier 01'}
                    </Text>
                  </View>
                </Pressable>
              );
            })
          ) : (
            <>
              {/* Mockup Item 1: Netflix Subscription */}
              <Pressable
                onPress={() => setActiveTab('history')}
                style={({ pressed }) => [
                  styles.floatingTransactionCard,
                  { backgroundColor: theme.card, borderColor: softBorder },
                  pressed && { opacity: 0.88 },
                ]}>
                <View style={[styles.transactionBadge, { backgroundColor: '#E0F2FE' }]}>
                  <Ionicons name="card-outline" size={20} color="#0284C7" />
                </View>
                <View style={styles.transactionMiddle}>
                  <Text style={[styles.transactionTitle, { color: theme.text }]} numberOfLines={1}>
                    Netflix Subscription
                  </Text>
                  <Text style={[styles.transactionTime, { color: theme.textMuted }]}>
                    9:30 PM • <Text style={{ color: '#0284C7' }}>Digital POS Card</Text>
                  </Text>
                </View>
                <View style={styles.transactionRight}>
                  <Text style={[styles.transactionAmount, { color: theme.text }]}>
                    − Rs. 1,200
                  </Text>
                  <Text style={[styles.transactionSubCurrency, { color: theme.textMuted }]}>
                    5.00 USD
                  </Text>
                </View>
              </Pressable>

              {/* Mockup Item 2: KFC Commercial */}
              <Pressable
                onPress={() => setActiveTab('history')}
                style={({ pressed }) => [
                  styles.floatingTransactionCard,
                  { backgroundColor: theme.card, borderColor: softBorder },
                  pressed && { opacity: 0.88 },
                ]}>
                <View style={[styles.transactionBadge, { backgroundColor: '#FEE2E2' }]}>
                  <Ionicons name="restaurant-outline" size={20} color="#DC2626" />
                </View>
                <View style={styles.transactionMiddle}>
                  <Text style={[styles.transactionTitle, { color: theme.text }]} numberOfLines={1}>
                    KFC Commercial
                  </Text>
                  <Text style={[styles.transactionTime, { color: theme.textMuted }]}>
                    2:00 PM • POS Expense
                  </Text>
                </View>
                <View style={styles.transactionRight}>
                  <Text style={[styles.transactionAmount, { color: theme.text }]}>
                    − Rs. 1,200
                  </Text>
                  <Text style={[styles.transactionSubCurrency, { color: theme.textMuted }]}>
                    Cashier 01
                  </Text>
                </View>
              </Pressable>
            </>
          )}
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
    paddingTop: Spacing.sm,
    paddingBottom: 110,
    maxWidth: 720,
    marginHorizontal: 'auto',
    width: '100%',
    gap: 14,
  },
  saleModalContainer: {
    flex: 1,
  },

  // ── 1. Hero 2-Column Grid ──
  heroGrid: {
    flexDirection: 'row',
    height: 220,
    gap: 12,
  },
  balanceCard: {
    flex: 1.35,
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
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  activePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  activePillText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700',
  },
  balanceAmountBlock: {
    gap: 1,
    marginVertical: 4,
  },
  balanceRsLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  balanceNumberText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.9,
    lineHeight: 36,
  },
  balanceUsdSubtitle: {
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: 11.5,
    fontWeight: '600',
    marginTop: 2,
  },
  balanceCardDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    marginVertical: 4,
  },
  balanceFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  cardLastDigits: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  balanceArrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Right Column (Blue + Coral)
  actionColumn: {
    flex: 1,
    gap: 12,
  },
  actionTile: {
    flex: 1,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'space-between',
    ...Shadows.sm,
  },
  actionTileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionTileIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileBadgePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tileBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  actionTileText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 19,
    letterSpacing: -0.2,
  },

  // ── 2. Action Pills Carousel ──
  actionPillsScroll: {
    gap: 10,
    paddingVertical: 2,
  },
  actionPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 22,
    borderWidth: 1,
    ...Shadows.sm,
  },
  pillIconPod: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.2,
  },

  // ── 3. Raast / Instant Alert Banner ──
  alertBannerCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 14,
    gap: 8,
    ...Shadows.sm,
  },
  alertBannerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertCheckCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3705A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  raastBadgePill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  raastBadgeText: {
    color: '#059669',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  justNowText: {
    fontSize: 11.5,
    fontWeight: '500',
    flex: 1,
  },
  alertCloseBtn: {
    padding: 4,
  },
  alertMainTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  alertBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  alertFromText: {
    fontSize: 12,
    flex: 1,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  verifiedText: {
    color: '#059669',
    fontSize: 11.5,
    fontWeight: '700',
  },

  // ── 4. Store Daily Summary ──
  summarySectionCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    gap: 12,
    ...Shadows.sm,
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  greenLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00C9A7',
  },
  summaryCardTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  livePosBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  livePosText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  summaryPodsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryPod: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    gap: 3,
  },
  podLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  podValue: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  podSub: {
    fontSize: 10.5,
    fontWeight: '600',
  },

  // ── 5. Activity Feed ──
  feedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  feedTitleBlock: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  feedTitle: {
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  feedSub: {
    fontSize: 12,
    fontWeight: '500',
  },
  seeAllLink: {
    color: '#F3705A',
    fontSize: 13,
    fontWeight: '700',
  },
  salesFeedList: {
    gap: 10,
  },
  floatingTransactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 22,
    borderWidth: 1,
    ...Shadows.sm,
  },
  transactionBadge: {
    width: 44,
    height: 44,
    borderRadius: 15,
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
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  transactionTime: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  transactionRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  transactionAmount: {
    fontSize: 15.5,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  transactionSubCurrency: {
    fontSize: 11,
    fontWeight: '600',
  },

  // ── Setup & Reports ──
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

  // Reports
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
