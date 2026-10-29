import { CASH_OUT_STORAGE_KEY, CashOutEntry, CashOutModal } from '@/components/CashOutModal';
import { DayEndClosingModal } from '@/components/DayEndClosingModal';
import { RainbowQuickActionFab } from '@/components/RainbowQuickActionFab';
import { SalesChart } from '@/components/SalesChart';
import { EmptyState } from '@/components/ui/EmptyState';
import { Colors, Shadows, Spacing } from '@/constants/theme';
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

  // Top recent sales for activity feed
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
  const totalStockAlerts = lowStockProducts.length + outOfStockProducts.length;
  const pendingKhataCount = useMemo(() => {
    return (khata || []).filter((c: any) => (c.currentBalance || c.balance || 0) > 0).length;
  }, [khata]);

  return (
    <View style={[styles.rootContainer, { backgroundColor: theme.background }]}>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* ══════════════════════════════════════════════════════════
            0. AMBIENT TOP GLOW (Fintech Backdrop Aura)
            ══════════════════════════════════════════════════════════ */}
        <View style={styles.ambientTopGlow} pointerEvents="none" />

        {/* ══════════════════════════════════════════════════════════
            1. THE 3-CARD HERO DECK (Mint Balance + 2 Stacked Tiles)
            ══════════════════════════════════════════════════════════ */}
        <View style={styles.heroDeckRow}>
          {/* ── Left Card (~58% width): Mint Cash Drawer Card ── */}
          <Pressable
            onPress={() => setShowDayEnd(true)}
            style={({ pressed }) => [
              styles.mintBalanceCard,
              { backgroundColor: settings.darkMode ? '#064E3B' : '#00C9A7' },
              pressed && { opacity: 0.95, transform: [{ scale: 0.99 }] },
            ]}>
            {/* Top Row: Stacked Label on left, Active Pill on right */}
            <View style={styles.mintTopRow}>
              <View style={styles.mintLabelStack}>
                <Text style={styles.mintMiniLabel}>{isUrdu ? 'گلہ کا' : 'AVAILABLE'}</Text>
                <Text style={styles.mintMiniLabel}>{isUrdu ? 'نقد کیش' : 'BALANCE'}</Text>
              </View>
              <View style={styles.mintActivePill}>
                <Text style={styles.mintActivePillText}>{isUrdu ? 'فعال' : 'Active'}</Text>
              </View>
            </View>

            {/* Big Amount */}
            <View style={styles.mintAmountBlock}>
              <Text style={styles.mintCurrencySymbol}>{settings.currencySymbol}</Text>
              <Text style={styles.mintAmountNumber} numberOfLines={1} adjustsFontSizeToFit>
                {todayNetCashInDrawer.toLocaleString()}
              </Text>
              <Text style={styles.mintSubHint} numberOfLines={1}>
                {todaySales.length > 0 ? `${todaySales.length} ${isUrdu ? 'بلز آج' : 'bills today'}` : (isUrdu ? 'گلہ متوازن ہے' : 'In register')}
              </Text>
            </View>

            {/* Bottom Row: Duo Circles + Arrow Button */}
            <View style={styles.mintBottomRow}>
              <View style={styles.mintDuoDotsWrap}>
                <View style={[styles.mintDuoDot, { backgroundColor: '#EF4444' }]} />
                <View style={[styles.mintDuoDot, { backgroundColor: '#F59E0B', marginLeft: -6 }]} />
                <Text style={styles.mintCardDigitsText}>
                  {todayCashOutTotal > 0 ? `-${settings.currencySymbol}${todayCashOutTotal}` : '•• 4567'}
                </Text>
              </View>

              <View style={styles.mintArrowBtn}>
                <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
              </View>
            </View>
          </Pressable>

          {/* ── Right Column (~40% width): Electric Blue & Coral Tiles ── */}
          <View style={styles.heroRightCol}>
            {/* Top Tile: Electric Blue -> New Sale */}
            <Pressable
              onPress={() => setIsSaleModalOpen(true)}
              style={({ pressed }) => [
                styles.rightActionCard,
                { backgroundColor: settings.darkMode ? '#0284C7' : '#2F9FF8' },
                pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
              ]}>
              <View style={styles.rightCardTopRow}>
                <View style={styles.rightCardIconCircle}>
                  <Ionicons name="cart" size={13} color="#FFFFFF" />
                </View>
                <View style={styles.rightCardBadgePill}>
                  <Text style={styles.rightCardBadgeText}>{isUrdu ? 'فوری' : 'TOP-UP'}</Text>
                </View>
              </View>
              <View style={styles.rightCardTextWrap}>
                <Text style={styles.rightCardTitleWord}>{isUrdu ? 'نیا' : 'New'}</Text>
                <Text style={styles.rightCardTitleWord}>{isUrdu ? 'بل' : 'Bill'}</Text>
              </View>
            </Pressable>

            {/* Bottom Tile: Coral / Salmon -> Day-End Tally */}
            <Pressable
              onPress={() => setShowDayEnd(true)}
              style={({ pressed }) => [
                styles.rightActionCard,
                { backgroundColor: settings.darkMode ? '#EA580C' : '#F3705A' },
                pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
              ]}>
              <View style={styles.rightCardTopRow}>
                <View style={styles.rightCardIconCircle}>
                  <Ionicons name="moon" size={13} color="#FFFFFF" />
                </View>
                <View style={styles.rightCardBadgePill}>
                  <Text style={styles.rightCardBadgeText}>{isUrdu ? 'حساب' : 'CLOSING'}</Text>
                </View>
              </View>
              <View style={styles.rightCardTextWrap}>
                <Text style={styles.rightCardTitleWord}>{isUrdu ? 'شام کا' : 'Day-End'}</Text>
                <Text style={styles.rightCardTitleWord}>{isUrdu ? 'حساب' : 'Tally'}</Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* ══════════════════════════════════════════════════════════
            2. HORIZONTAL ACTION PILLS (Soft, Flat, Zero Shadow)
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
            <View style={[styles.pillIconSquircle, { backgroundColor: '#D5F0F7' }]}>
              <Ionicons name="qr-code-outline" size={17} color="#00A389" />
            </View>
            <Text style={[styles.pillText, { color: theme.text }]}>
              {isUrdu ? 'بارکوڈ سیل' : 'Scan & Pay'}
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
            <View style={[styles.pillIconSquircle, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="book-outline" size={17} color="#2563EB" />
            </View>
            <Text style={[styles.pillText, { color: theme.text }]}>
              {isUrdu ? 'گاہک کھاتہ' : 'Khata Ledger'}
            </Text>
          </Pressable>

          {/* Pill 3: Add Expense */}
          <Pressable
            onPress={() => setIsCashOutModalOpen(true)}
            style={({ pressed }) => [
              styles.actionPillBtn,
              { backgroundColor: theme.card, borderColor: softBorder },
              pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            ]}>
            <View style={[styles.pillIconSquircle, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="receipt-outline" size={17} color="#DC2626" />
            </View>
            <Text style={[styles.pillText, { color: theme.text }]}>
              {isUrdu ? 'خرچہ درج کریں' : 'Add Expense'}
            </Text>
          </Pressable>

          {/* Pill 4: Stock Alerts (if low stock exists) */}
          {totalStockAlerts > 0 && (
            <Pressable
              onPress={() => setActiveTab('products')}
              style={({ pressed }) => [
                styles.actionPillBtn,
                { backgroundColor: theme.card, borderColor: softBorder },
                pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
              ]}>
              <View style={[styles.pillIconSquircle, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="warning-outline" size={17} color="#D97706" />
              </View>
              <Text style={[styles.pillText, { color: theme.text }]}>
                {totalStockAlerts} {isUrdu ? 'کم اسٹاک' : 'Low Stock'}
              </Text>
            </Pressable>
          )}
        </ScrollView>

        {/* ══════════════════════════════════════════════════════════
            3. STORE DAILY SUMMARY ("LIVE POS" - 3 Pods)
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

            <Pressable
              onPress={() => setShowDayEnd(true)}
              hitSlop={8}
              style={({ pressed }) => [
                styles.livePosBadge,
                { backgroundColor: settings.darkMode ? 'rgba(255,255,255,0.08)' : '#F1F5F9' },
                pressed && { opacity: 0.75 },
              ]}>
              <Text style={[styles.livePosText, { color: theme.textMuted }]}>
                LIVE POS
              </Text>
            </Pressable>
          </View>

          {/* 3 Metric Pods */}
          <View style={styles.summaryPodsRow}>
            {/* Pod 1: SALES TODAY */}
            <Pressable
              onPress={() => setShowDayEnd(true)}
              style={({ pressed }) => [
                styles.summaryPod,
                { backgroundColor: settings.darkMode ? 'rgba(255,255,255,0.04)' : '#F8FAFC' },
                pressed && { opacity: 0.85 },
              ]}>
              <Text style={[styles.podLabel, { color: theme.textMuted }]}>
                {isUrdu ? 'سیل آج' : 'SALES TODAY'}
              </Text>
              <Text style={[styles.podValue, { color: '#00C9A7' }]}>
                +{settings.currencySymbol}{todaySalesTotal.toLocaleString()}
              </Text>
              <Text style={[styles.podSub, { color: theme.textMuted }]}>
                {todaySales.length} {isUrdu ? 'آرڈرز' : 'orders'}
              </Text>
            </Pressable>

            {/* Pod 2: COLLECTED (VASOOLI) */}
            <Pressable
              onPress={() => setActiveTab('khata')}
              style={({ pressed }) => [
                styles.summaryPod,
                { backgroundColor: settings.darkMode ? 'rgba(255,255,255,0.04)' : '#F8FAFC' },
                pressed && { opacity: 0.85 },
              ]}>
              <Text style={[styles.podLabel, { color: theme.textMuted }]}>
                {isUrdu ? 'ادھار وصولی' : 'COLLECTED'}
              </Text>
              <Text style={[styles.podValue, { color: '#0284C7' }]}>
                +{settings.currencySymbol}{todayVasooli.toLocaleString()}
              </Text>
              <Text style={[styles.podSub, { color: '#059669', fontWeight: '700' }]}>
                {todayVasooli > 0 ? (isUrdu ? 'وصولی' : 'vasooli') : (isUrdu ? 'آمدن' : 'inflow')}
              </Text>
            </Pressable>

            {/* Pod 3: UDHAAR (KHATA) */}
            <Pressable
              onPress={() => setActiveTab('khata')}
              style={({ pressed }) => [
                styles.summaryPod,
                { backgroundColor: settings.darkMode ? 'rgba(255,255,255,0.04)' : '#F8FAFC' },
                pressed && { opacity: 0.85 },
              ]}>
              <Text style={[styles.podLabel, { color: theme.textMuted }]}>
                {isUrdu ? 'کل ادھار' : 'UDHAAR'}
              </Text>
              <Text style={[styles.podValue, { color: '#DC2626' }]}>
                {settings.currencySymbol}{totalUdhaarReceivable.toLocaleString()}
              </Text>
              <Text style={[styles.podSub, { color: theme.textMuted }]}>
                {pendingKhataCount} {isUrdu ? 'کھاتے' : 'buyers'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* ══════════════════════════════════════════════════════════
            4. EVENING CLOSING PROMPT BANNER (Smart Day-End Closing)
            ══════════════════════════════════════════════════════════ */}
        {(new Date().getHours() >= 17 || todaySales.length > 0) && (
          <Pressable
            onPress={() => setShowDayEnd(true)}
            style={({ pressed }) => [
              styles.eveningClosingPromptCard,
              pressed && { opacity: 0.92, transform: [{ scale: 0.99 }] },
            ]}>
            <View style={styles.eveningPromptLeft}>
              <View style={styles.eveningPromptMoon}>
                <Ionicons name="moon" size={18} color="#FBBF24" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.eveningPromptTitle}>
                  {isUrdu
                    ? 'دکان بند کرنے کا وقت؟ شام کا حساب کریں'
                    : 'Ready to close shop? Tally cash drawer'}
                </Text>
                <Text style={styles.eveningPromptSubtitle} numberOfLines={1}>
                  {isUrdu
                    ? `گلہ میں متوقع: ${settings.currencySymbol}${todayNetCashInDrawer.toLocaleString()} • نقد نوٹ گنیں`
                    : `Expected: ${settings.currencySymbol}${todayNetCashInDrawer.toLocaleString()} • Count notes & get report`}
                </Text>
              </View>
            </View>
            <View style={styles.eveningPromptCta}>
              <Text style={styles.eveningPromptCtaText}>
                {isUrdu ? 'حساب کریں ↵' : 'Tally →'}
              </Text>
            </View>
          </Pressable>
        )}

        {/* ══════════════════════════════════════════════════════════
            5. TODAY ACTIVITY FEED (Real Recent Sales)
            ══════════════════════════════════════════════════════════ */}
        <View style={styles.feedHeaderRow}>
          <View style={styles.feedTitleBlock}>
            <Text style={[styles.feedTitle, { color: theme.text }]}>
              {isUrdu ? 'آج کے بلز' : "Today's Sales"}
            </Text>
            <Text style={[styles.feedSub, { color: theme.textMuted }]}>
              {todaySales.length} {isUrdu ? 'بلز' : 'bills'} · {todayCashOutTotal > 0 ? `− ${settings.currencySymbol}${todayCashOutTotal.toLocaleString()} exp` : `${settings.currencySymbol}${todaySalesTotal.toLocaleString()}`}
            </Text>
          </View>

          {sales.length > 0 && (
            <Pressable
              onPress={() => setActiveTab('history')}
              hitSlop={8}
              style={({ pressed }) => [pressed && { opacity: 0.7 }]}>
              <Text style={styles.seeAllLink}>
                {isUrdu ? 'سب دیکھیں →' : 'See all →'}
              </Text>
            </Pressable>
          )}
        </View>

        {/* Real Transactions Feed */}
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
                      styles.floatingTransactionCard,
                      { backgroundColor: theme.card, borderColor: softBorder },
                      pressed && { opacity: 0.88, transform: [{ scale: 0.99 }] },
                    ]}>
                    {/* Left Squircle Badge with payment glyph */}
                    <View style={[styles.transactionBadge, { backgroundColor: badgeBg }]}>
                      <Ionicons
                        name={isCash ? 'cash-outline' : isOnline ? 'phone-portrait-outline' : 'book-outline'}
                        size={20}
                        color={badgeColor}
                      />
                    </View>

                    {/* Middle Customer Title & Time */}
                    <View style={styles.transactionMiddle}>
                      <Text style={[styles.transactionTitle, { color: theme.text }]} numberOfLines={1}>
                        {s.customerName || (isUrdu ? 'نقد کاؤنٹر سیل' : 'Walk-in Cash Sale')}
                      </Text>
                      <Text style={[styles.transactionTime, { color: theme.textMuted }]} numberOfLines={1}>
                        {new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Bill #{s.billNumber} • {s.items ? s.items.length : 0} {t('itemsCount')}
                      </Text>
                    </View>

                    {/* Right Amount & Payment Method */}
                    <View style={styles.transactionRight}>
                      <Text style={[styles.transactionAmount, { color: theme.text }]}>
                        +{settings.currencySymbol}{s.grandTotal.toLocaleString()}
                      </Text>
                      <View style={[styles.miniMethodBadge, { backgroundColor: badgeBg }]}>
                        <Text style={[styles.miniMethodText, { color: badgeColor }]}>
                          {s.paymentMethod.toUpperCase()}
                        </Text>
                      </View>
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
                      ? `تمام ${sales.length} بلز دیکھیں →`
                      : `View All ${sales.length} Bills →`}
                  </Text>
                </Pressable>
              )}
            </>
          ) : (
            <EmptyState
              icon="receipt-outline"
              title={t('noRecentSales')}
              subtitle={isUrdu ? 'آج کی پہلی سیل درج کرنے کے لیے اوپر "New Bill" بٹن دبائیں' : 'No sales recorded yet today. Tap "+ New Bill" above.'}
              actionLabel={isUrdu ? 'نیا بل بنائیں' : '+ New Bill'}
              onAction={() => setIsSaleModalOpen(true)}
              compact
            />
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

  // ── 0. Ambient Top Glow (Memorable Fintech Backdrop) ──
  ambientTopGlow: {
    position: 'absolute',
    top: -50,
    left: -20,
    right: -20,
    height: 240,
    backgroundColor: '#00C9A7',
    opacity: 0.12,
    borderBottomLeftRadius: 180,
    borderBottomRightRadius: 180,
  },

  // ── 1. The 3-Card Hero Deck (Mint Balance + 2 Right Tiles) ──
  heroDeckRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
    minHeight: 218,
    marginTop: 2,
  },

  // Left Card (~58% width): Mint Cash Drawer Card
  mintBalanceCard: {
    flex: 1.45,
    borderRadius: 24,
    padding: 16,
    justifyContent: 'space-between',
    elevation: 0,
    overflow: 'hidden',
  },
  mintTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  mintLabelStack: {
    gap: 1,
  },
  mintMiniLabel: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    opacity: 0.95,
  },
  mintActivePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 999,
  },
  mintActivePillText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  mintAmountBlock: {
    marginTop: 6,
    marginBottom: 6,
  },
  mintCurrencySymbol: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    opacity: 0.95,
  },
  mintAmountNumber: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: -0.6,
    lineHeight: 33,
  },
  mintSubHint: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 3,
  },
  mintBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  mintDuoDotsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mintDuoDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    opacity: 0.92,
  },
  mintCardDigitsText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  mintArrowBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Right Column (~40% width): Electric Blue & Coral Tiles
  heroRightCol: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 10,
  },
  rightActionCard: {
    flex: 1,
    borderRadius: 22,
    paddingHorizontal: 13,
    paddingVertical: 12,
    justifyContent: 'space-between',
    elevation: 0,
    minHeight: 100,
  },
  rightCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightCardIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.24)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightCardBadgePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.24)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 999,
  },
  rightCardBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  rightCardTextWrap: {
    marginTop: 6,
  },
  rightCardTitleWord: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
    lineHeight: 18,
    letterSpacing: -0.2,
  },

  // ── 2. Horizontal Action Pills (Zero Muddy Shadow, Soft Border) ──
  actionPillsScroll: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 2,
  },
  actionPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    elevation: 0,
  },
  pillIconSquircle: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },

  // ── 3. Store Daily Summary ("LIVE POS" - Zero Shadow) ──
  summarySectionCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    gap: 12,
    elevation: 0,
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greenLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00C9A7',
  },
  summaryCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  livePosBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 999,
  },
  livePosText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  summaryPodsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  summaryPod: {
    flex: 1,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 11,
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
    marginTop: 2,
  },
  podSub: {
    fontSize: 10.5,
    fontWeight: '600',
  },

  // ── 4. Evening Closing Prompt Card ──
  eveningClosingPromptCard: {
    backgroundColor: '#064E3B',
    borderRadius: 22,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderWidth: 1,
    borderColor: '#047857',
    elevation: 0,
  },
  eveningPromptLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  eveningPromptMoon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eveningPromptTitle: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  eveningPromptSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    marginTop: 1,
    lineHeight: 15,
  },
  eveningPromptCta: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  eveningPromptCtaText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
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
    elevation: 0,
  },
  miniMethodBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  miniMethodText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  viewMoreSalesBtn: {
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  viewMoreSalesText: {
    fontSize: 12.5,
    fontWeight: '800',
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
    fontWeight: '700',
  },

  // ── Setup & Reports ──
  setupCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: Spacing.md,
    gap: 10,
    elevation: 0,
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
    elevation: 0,
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
    elevation: 0,
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
