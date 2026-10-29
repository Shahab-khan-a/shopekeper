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
            1. THE 2-COLUMN ASYMMETRIC HERO: CASH DRAWER & QUICK SALES
            ══════════════════════════════════════════════════════════ */}
        <View style={styles.heroGrid}>
          {/* ── Left Column: Mint/Teal Cash Drawer Hero Card (~58% width) ── */}
          <Pressable
            onPress={() => setShowDayEnd(true)}
            style={({ pressed }) => [
              styles.balanceCard,
              {
                backgroundColor: settings.darkMode ? '#064E3B' : '#00C9A7',
              },
              pressed && { opacity: 0.96, transform: [{ scale: 0.99 }] },
            ]}>
            {/* Top row: CASH IN REGISTER + Live Drawer status */}
            <View style={styles.balanceTopRow}>
              <View style={styles.balanceLabelWrap}>
                <Ionicons name="wallet" size={13} color="rgba(255, 255, 255, 0.9)" />
                <Text style={styles.balanceLabel}>
                  {isUrdu ? 'گلہ کا نقد کیش' : 'CASH IN REGISTER'}
                </Text>
              </View>
              <View style={styles.activePill}>
                <Text style={styles.activePillText}>
                  {isUrdu ? 'لائیو گلہ' : 'Live Drawer'}
                </Text>
              </View>
            </View>

            {/* Giant Live Currency & Amount */}
            <View style={styles.balanceAmountBlock}>
              <Text style={styles.balanceRsLabel}>{settings.currencySymbol}</Text>
              <Text style={styles.balanceNumberText} numberOfLines={1} adjustsFontSizeToFit>
                {todayNetCashInDrawer.toLocaleString()}
              </Text>
              <Text style={styles.balanceFormulaSubtitle} numberOfLines={1}>
                {isUrdu
                  ? `${todaySales.length} بلز • نقد و وصولی منفی خرچہ`
                  : `Cash Sales + Vasooli − Expenses`}
              </Text>
            </View>

            {/* Subtle Divider */}
            <View style={styles.balanceCardDivider} />

            {/* Bottom Row: Direct Expense CTA + Tally Arrow */}
            <View style={styles.balanceFooterRow}>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  setIsCashOutModalOpen(true);
                }}
                hitSlop={8}
                style={({ pressed }) => [
                  styles.drawerExpenseBtn,
                  pressed && { opacity: 0.82, transform: [{ scale: 0.97 }] },
                ]}>
                <Ionicons name="arrow-up-circle-outline" size={13} color="#FFFFFF" />
                <Text style={styles.drawerExpenseBtnText}>
                  {todayCashOutTotal > 0
                    ? `-${settings.currencySymbol}${todayCashOutTotal.toLocaleString()} ${isUrdu ? 'خرچہ' : 'exp'}`
                    : (isUrdu ? '+ خرچہ لکھیں' : '+ Add Expense')}
                </Text>
              </Pressable>

              <View style={styles.balanceArrowCircle}>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </View>
            </View>
          </Pressable>

          {/* ── Right Column: 2 Stacked Action Tiles (~40% width) ── */}
          <View style={styles.actionColumn}>
            {/* Top Tile: Electric Blue -> + New Bill */}
            <Pressable
              onPress={() => setIsSaleModalOpen(true)}
              style={({ pressed }) => [
                styles.actionTile,
                { backgroundColor: settings.darkMode ? '#0284C7' : '#2F9FF8' },
                pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
              ]}>
              <View style={styles.actionTileTopRow}>
                <View style={styles.actionTileIconCircle}>
                  <Ionicons name="cart" size={15} color="#FFFFFF" />
                </View>
                <View style={styles.tileBadgePill}>
                  <Text style={styles.tileBadgeText}>
                    {isUrdu ? 'فوری' : 'FAST POS'}
                  </Text>
                </View>
              </View>
              <Text style={styles.actionTileText}>
                {isUrdu ? 'نیا بل بنائیں' : 'New Bill\n(+ Sale)'}
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
              <View style={styles.actionTileTopRow}>
                <View style={styles.actionTileIconCircle}>
                  <Ionicons name="moon" size={14} color="#FFFFFF" />
                </View>
                <View style={styles.tileBadgePill}>
                  <Text style={styles.tileBadgeText}>
                    {isUrdu ? 'حساب' : 'CLOSING'}
                  </Text>
                </View>
              </View>
              <Text style={styles.actionTileText}>
                {isUrdu ? 'شام کا حساب' : 'Day-End\nTally'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* ══════════════════════════════════════════════════════════
            2. HORIZONTAL SHOP ACTION PILLS (Scan, Khata, Expense, Alerts)
            ══════════════════════════════════════════════════════════ */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.actionPillsScroll}>
          {/* Pill 1: Scan & Sale */}
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
              {isUrdu ? 'بارکوڈ سیل' : 'Scan & Bill'}
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
              {isUrdu ? 'گاہک کھاتہ' : 'Khata Ledger'}
            </Text>
          </Pressable>

          {/* Pill 3: Expense Record (Cash Out) */}
          <Pressable
            onPress={() => setIsCashOutModalOpen(true)}
            style={({ pressed }) => [
              styles.actionPillBtn,
              { backgroundColor: theme.card, borderColor: softBorder },
              pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            ]}>
            <View style={[styles.pillIconPod, { backgroundColor: '#FCE7F3' }]}>
              <Ionicons name="arrow-up-circle-outline" size={16} color="#DB2777" />
            </View>
            <Text style={[styles.pillText, { color: theme.text }]}>
              {isUrdu ? 'خرچہ لکھیں' : 'Add Expense'}
            </Text>
          </Pressable>

          {/* Pill 4: Stock Warning (if low items exist) */}
          {totalStockAlerts > 0 && (
            <Pressable
              onPress={() => setActiveTab('products')}
              style={({ pressed }) => [
                styles.actionPillBtn,
                { backgroundColor: theme.card, borderColor: softBorder },
                pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
              ]}>
              <View style={[styles.pillIconPod, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="warning-outline" size={16} color="#D97706" />
              </View>
              <Text style={[styles.pillText, { color: theme.text }]}>
                {totalStockAlerts} {isUrdu ? 'کم اسٹاک' : 'Low Stock'}
              </Text>
            </Pressable>
          )}
        </ScrollView>

        {/* ══════════════════════════════════════════════════════════
            3. TODAY'S STORE OVERVIEW (The 4 Core Shopkeeper Pillars)
            ══════════════════════════════════════════════════════════ */}
        <View
          style={[
            styles.summarySectionCard,
            { backgroundColor: theme.card, borderColor: softBorder },
          ]}>
          {/* Header Row: Green Dot + Title + Tally Link */}
          <View style={styles.summaryHeaderRow}>
            <View style={styles.summaryTitleWrap}>
              <View style={styles.greenLiveDot} />
              <Text style={[styles.summaryCardTitle, { color: theme.text }]}>
                {isUrdu ? 'دکان کا آج کا جائزہ' : "Today's Store Overview"}
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
              <Text style={[styles.livePosText, { color: theme.primary }]}>
                {isUrdu ? 'مکمل تفصیل →' : 'Full Tally →'}
              </Text>
            </Pressable>
          </View>

          {/* 4 Core Metric Pods (2x2 Grid) */}
          <View style={styles.metricsGrid2x2}>
            {/* 1. Today's Total Sales */}
            <Pressable
              onPress={() => setShowDayEnd(true)}
              style={({ pressed }) => [
                styles.summaryPod2x2,
                { backgroundColor: settings.darkMode ? 'rgba(255,255,255,0.04)' : '#F8FAFC' },
                pressed && { opacity: 0.85 },
              ]}>
              <View style={styles.podTopRow}>
                <Text style={[styles.podLabel, { color: theme.textMuted }]}>
                  {isUrdu ? 'آج کی سیل' : 'SALES TODAY'}
                </Text>
                <Ionicons name="receipt-outline" size={14} color="#00C9A7" />
              </View>
              <Text style={[styles.podValue, { color: '#00C9A7' }]}>
                +{settings.currencySymbol}{todaySalesTotal.toLocaleString()}
              </Text>
              <Text style={[styles.podSub, { color: theme.textMuted }]}>
                {todaySales.length > 0
                  ? `${todaySales.length} ${isUrdu ? 'بلز آج' : 'bills today'}`
                  : (isUrdu ? 'آج کوئی بل نہیں' : 'No bills yet')}
              </Text>
            </Pressable>

            {/* 2. Customer Credit (Udhaar) */}
            <Pressable
              onPress={() => setActiveTab('khata')}
              style={({ pressed }) => [
                styles.summaryPod2x2,
                { backgroundColor: settings.darkMode ? 'rgba(255,255,255,0.04)' : '#F8FAFC' },
                pressed && { opacity: 0.85 },
              ]}>
              <View style={styles.podTopRow}>
                <Text style={[styles.podLabel, { color: theme.textMuted }]}>
                  {isUrdu ? 'گاہکوں کا ادھار' : 'CUSTOMER CREDIT'}
                </Text>
                <Ionicons name="book-outline" size={14} color="#DC2626" />
              </View>
              <Text style={[styles.podValue, { color: '#DC2626' }]}>
                {settings.currencySymbol}{totalUdhaarReceivable.toLocaleString()}
              </Text>
              <Text style={[styles.podSub, { color: theme.textMuted }]}>
                {pendingKhataCount > 0
                  ? `${pendingKhataCount} ${isUrdu ? 'کھاتے بقایا' : 'pending accounts'}`
                  : (isUrdu ? 'کوئی ادھار نہیں' : 'All cleared')}
              </Text>
            </Pressable>

            {/* 3. Debt Recovered (Vasooli) */}
            <Pressable
              onPress={() => setActiveTab('khata')}
              style={({ pressed }) => [
                styles.summaryPod2x2,
                { backgroundColor: settings.darkMode ? 'rgba(255,255,255,0.04)' : '#F8FAFC' },
                pressed && { opacity: 0.85 },
              ]}>
              <View style={styles.podTopRow}>
                <Text style={[styles.podLabel, { color: theme.textMuted }]}>
                  {isUrdu ? 'ادھار وصولی' : 'DEBT RECOVERED'}
                </Text>
                <Ionicons name="arrow-down-circle-outline" size={14} color="#059669" />
              </View>
              <Text style={[styles.podValue, { color: '#059669' }]}>
                +{settings.currencySymbol}{todayVasooli.toLocaleString()}
              </Text>
              <Text style={[styles.podSub, { color: theme.textMuted }]}>
                {isUrdu ? 'آج کی وصول شدہ رقم' : "Today's collections"}
              </Text>
            </Pressable>

            {/* 4. Stock Alerts (Low Stock) */}
            <Pressable
              onPress={() => setActiveTab('products')}
              style={({ pressed }) => [
                styles.summaryPod2x2,
                { backgroundColor: settings.darkMode ? 'rgba(255,255,255,0.04)' : '#F8FAFC' },
                pressed && { opacity: 0.85 },
              ]}>
              <View style={styles.podTopRow}>
                <Text style={[styles.podLabel, { color: theme.textMuted }]}>
                  {isUrdu ? 'کم اسٹاک' : 'STOCK ALERTS'}
                </Text>
                <Ionicons name="warning-outline" size={14} color={totalStockAlerts > 0 ? '#D97706' : theme.textMuted} />
              </View>
              <Text
                style={[
                  styles.podValue,
                  { color: totalStockAlerts > 0 ? '#D97706' : theme.text },
                ]}>
                {totalStockAlerts}
              </Text>
              <Text style={[styles.podSub, { color: theme.textMuted }]}>
                {totalStockAlerts > 0
                  ? (isUrdu ? 'آئٹمز ختم ہونے والے ہیں' : 'items to reorder')
                  : (isUrdu ? 'تمام اسٹاک موجود ہے' : 'All stocked up')}
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
  balanceFormulaSubtitle: {
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
  balanceLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  drawerExpenseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  drawerExpenseBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  balanceArrowCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
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
    fontSize: 14.5,
    fontWeight: '800',
    lineHeight: 18,
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

  // ── 3. Store Overview (The 4 Core Pillars) ──
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  livePosText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  metricsGrid2x2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  summaryPod2x2: {
    width: '48.3%',
    borderRadius: 18,
    padding: 12,
    gap: 4,
  },
  podTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  podLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  podValue: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.4,
    marginTop: 2,
  },
  podSub: {
    fontSize: 11,
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
    ...Shadows.sm,
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
    ...Shadows.sm,
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
