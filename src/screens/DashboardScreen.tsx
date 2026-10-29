import { CASH_OUT_STORAGE_KEY, CashOutEntry, CashOutModal } from '@/components/CashOutModal';
import { DayEndClosingModal } from '@/components/DayEndClosingModal';
import { RainbowQuickActionFab } from '@/components/RainbowQuickActionFab';
import { ProductImage } from '@/components/ProductImage';
import { SalesChart } from '@/components/SalesChart';
import { EmptyState } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';
import { SaleScreen } from '@/screens/SaleScreen';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image,
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
    todayOrdersCount,
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
    user,
    t,
    language,
    showAlert,
    loadStapleProducts,
  } = useShop();

  const theme = settings.darkMode ? Colors.dark : Colors.light;

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
        title: language === 'ur' ? '20 اشیاء لوڈ ہو گئیں!' : 'Top 20 Staples Loaded!',
        message:
          language === 'ur'
            ? 'مرحلہ 1 مکمل! چینی، آٹا، گھی، دالیں وغیرہ شامل ہو گئیں۔ اب مرحلہ 2 میں گاہک کھاتہ درج کریں یا مرحلہ 3 میں پہلی سیل بنائیں۔'
            : 'Step 1 complete! 20 essential staples added. Proceed to Step 2 (Customer Ledger) or Step 3 (First Sale).',
      });
    } catch (e: any) {
      console.error('[Dashboard] Error loading staples:', e);
    } finally {
      setIsLoadingStaples(false);
    }
  };

  // Top 3 most recent sales on home
  const MAX_HOME_RECENT_SALES = 3;
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

  const isUrdu = language === 'ur';
  const softBorder = settings.darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(148, 163, 184, 0.22)';

  return (
    <View style={[styles.rootContainer, { backgroundColor: theme.background }]}>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* ── Greeting Bar ── */}
        <View style={styles.topGreetingRow}>
          <View style={styles.greetingLeft}>
            <Text style={[styles.greetingSub, { color: theme.textMuted }]}>
              {isUrdu ? 'خوش آمدید،' : 'Welcome back,'}
            </Text>
            <Text style={[styles.greetingName, { color: theme.text }]} numberOfLines={1}>
              {settings.ownerName || user?.displayName || (isUrdu ? 'معزز دکاندار' : 'Valued Shopkeeper')}
            </Text>
          </View>

          <Pressable
            onPress={() => setActiveTab('settings')}
            style={({ pressed }) => [
              styles.avatarPressable,
              pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
            ]}>
            <View style={[styles.avatarCircle, { backgroundColor: theme.card, borderColor: softBorder }]}>
              {settings.profileImage && !settings.profileImage.includes('googleusercontent.com/a/') ? (
                <ProductImage
                  uri={settings.profileImage}
                  style={styles.avatarImg}
                  fallbackIcon={
                    <Image
                      source={require('@/../assets/images/mainLogoImage.png')}
                      style={styles.avatarImg}
                      resizeMode="contain"
                    />
                  }
                />
              ) : (
                <Image
                  source={require('@/../assets/images/mainLogoImage.png')}
                  style={styles.avatarImg}
                  resizeMode="contain"
                />
              )}
            </View>
          </Pressable>
        </View>

        {/* ── SadaPay-inspired Floating Hero Balance Card (Cash Register) ── */}
        <Pressable
          onPress={() => setShowDayEnd(true)}
          style={({ pressed }) => [
            styles.heroCard,
            { backgroundColor: settings.darkMode ? '#064E3B' : '#059669' },
            pressed && { opacity: 0.95, transform: [{ scale: 0.99 }] },
          ]}>
          {/* Top Line: Label & Record Expense White Pill */}
          <View style={styles.heroTopRow}>
            <View style={styles.heroTitleWrap}>
              <View style={styles.heroIconBadge}>
                <Ionicons name="wallet" size={14} color="#FFFFFF" />
              </View>
              <Text style={styles.heroLabel}>
                {isUrdu ? 'گلہ کا نقد کیش' : "TODAY'S CASH IN REGISTER"}
              </Text>
            </View>

            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                setIsCashOutModalOpen(true);
              }}
              hitSlop={6}
              style={({ pressed }) => [
                styles.heroExpenseBtn,
                pressed && { opacity: 0.9, transform: [{ scale: 0.96 }] },
              ]}>
              <Ionicons name="arrow-up-circle" size={13} color="#DC2626" />
              <Text style={styles.heroExpenseBtnText}>
                {isUrdu ? 'خرچہ لکھیں' : '+ Expense'}
              </Text>
            </Pressable>
          </View>

          {/* Giant Clean Amount */}
          <View style={styles.heroAmountWrap}>
            <Text style={styles.heroAmount}>
              {settings.currencySymbol}
              {todayNetCashInDrawer.toLocaleString()}
            </Text>
            {todayCashOutTotal > 0 && (
              <View style={styles.heroDeductedBadge}>
                <Text style={styles.heroDeductedText}>
                  -{settings.currencySymbol}{todayCashOutTotal.toLocaleString()} {isUrdu ? 'خرچہ' : 'exp'}
                </Text>
              </View>
            )}
          </View>

          {/* Translucent Soft Summary Capsules */}
          <View style={styles.heroCapsulesRow}>
            <View style={styles.heroCapsule}>
              <Text style={styles.heroCapsuleText}>
                {todaySales.length} {isUrdu ? 'بلز آج' : 'bills today'} ({settings.currencySymbol}{todaySalesTotal.toLocaleString()})
              </Text>
            </View>

            {todayVasooli > 0 && (
              <View style={styles.heroCapsule}>
                <Ionicons name="arrow-down" size={11} color="#FFFFFF" />
                <Text style={styles.heroCapsuleText}>
                  +{settings.currencySymbol}{todayVasooli.toLocaleString()} {isUrdu ? 'ادھار وصولی' : 'recovered'}
                </Text>
              </View>
            )}

            <View style={[styles.heroCapsule, { backgroundColor: 'rgba(255, 255, 255, 0.28)' }]}>
              <Text style={[styles.heroCapsuleText, { fontWeight: '800' }]}>
                {isUrdu ? 'شام کا حساب ➔' : 'Day-End Tally ➔'}
              </Text>
            </View>
          </View>
        </Pressable>

        {/* ── Action Quick Pods (SadaPay Inspo: 2 Vibrant Soft Cards) ── */}
        <View style={styles.actionPodsRow}>
          {/* 1. New Sale (Primary Blue / Emerald Card) */}
          <Pressable
            onPress={() => setIsSaleModalOpen(true)}
            style={({ pressed }) => [
              styles.actionPod,
              { backgroundColor: settings.darkMode ? '#1E293B' : '#0284C7' },
              pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
            ]}>
            <View style={styles.actionPodHeader}>
              <View style={[styles.actionPodIconCircle, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                <Ionicons name="cart" size={18} color="#FFFFFF" />
              </View>
              <Ionicons name="arrow-forward" size={16} color="rgba(255, 255, 255, 0.75)" />
            </View>
            <View>
              <Text style={styles.actionPodTitle}>
                {isUrdu ? '+ نیا بل بنائیں' : '+ New Bill'}
              </Text>
              <Text style={styles.actionPodSub}>
                {isUrdu ? 'تیز کاؤنٹر سیلنگ' : 'Fast counter sale'}
              </Text>
            </View>
          </Pressable>

          {/* 2. Evening Closing Tally (Warm Amber / Rose Card) */}
          <Pressable
            onPress={() => setShowDayEnd(true)}
            style={({ pressed }) => [
              styles.actionPod,
              { backgroundColor: settings.darkMode ? '#78350F' : '#F97316' },
              pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
            ]}>
            <View style={styles.actionPodHeader}>
              <View style={[styles.actionPodIconCircle, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                <Ionicons name="moon" size={18} color="#FFFFFF" />
              </View>
              <Ionicons name="arrow-forward" size={16} color="rgba(255, 255, 255, 0.75)" />
            </View>
            <View>
              <Text style={styles.actionPodTitle}>
                {isUrdu ? 'شام کا حساب' : 'Day-End Tally'}
              </Text>
              <Text style={styles.actionPodSub}>
                {isUrdu ? 'گلہ کے نوٹ گنیں' : 'Count drawer cash'}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* ── 3 Key Metrics Pods (Soft squircle cards) ── */}
        <View style={styles.metricsRow}>
          {/* Metric 1: Today's Total Billed */}
          <Pressable
            onPress={() => setShowDayEnd(true)}
            style={({ pressed }) => [
              styles.metricCard,
              { backgroundColor: theme.card, borderColor: softBorder },
              pressed && { opacity: 0.88 },
            ]}>
            <View style={[styles.metricAvatar, { backgroundColor: settings.darkMode ? 'rgba(16, 185, 129, 0.14)' : '#ECFDF5' }]}>
              <Ionicons name="receipt" size={16} color="#059669" />
            </View>
            <Text style={[styles.metricLabel, { color: theme.textMuted }]}>
              {t('todaySales')}
            </Text>
            <Text style={[styles.metricValue, { color: theme.text }]}>
              {settings.currencySymbol}{todaySalesTotal.toLocaleString()}
            </Text>
            <Text style={[styles.metricSub, { color: theme.textMuted }]}>
              {todaySales.length} {isUrdu ? 'بل' : 'bills'}
            </Text>
          </Pressable>

          {/* Metric 2: Customer Credit (Khata) */}
          <Pressable
            onPress={() => setActiveTab('khata')}
            style={({ pressed }) => [
              styles.metricCard,
              { backgroundColor: theme.card, borderColor: softBorder },
              pressed && { opacity: 0.88 },
            ]}>
            <View style={[styles.metricAvatar, { backgroundColor: settings.darkMode ? 'rgba(239, 68, 68, 0.14)' : '#FEE2E2' }]}>
              <Ionicons name="book" size={16} color="#DC2626" />
            </View>
            <Text style={[styles.metricLabel, { color: theme.textMuted }]}>
              {isUrdu ? 'گاہکوں کا ادھار' : 'Pending Debt'}
            </Text>
            <Text style={[styles.metricValue, { color: theme.danger }]}>
              {settings.currencySymbol}{totalUdhaarReceivable.toLocaleString()}
            </Text>
            <Text style={[styles.metricSub, { color: theme.textMuted }]}>
              {khata.filter((c: any) => (c.currentBalance || c.balance || 0) > 0).length} {isUrdu ? 'کھاتے' : 'accounts'}
            </Text>
          </Pressable>

          {/* Metric 3: Low Stock Alerts */}
          <Pressable
            onPress={() => setActiveTab('products')}
            style={({ pressed }) => [
              styles.metricCard,
              { backgroundColor: theme.card, borderColor: softBorder },
              pressed && { opacity: 0.88 },
            ]}>
            <View
              style={[
                styles.metricAvatar,
                {
                  backgroundColor:
                    lowStockProducts.length + outOfStockProducts.length > 0
                      ? settings.darkMode ? 'rgba(245, 158, 11, 0.16)' : '#FEF3C7'
                      : settings.darkMode ? 'rgba(16, 185, 129, 0.14)' : '#ECFDF5',
                },
              ]}>
              <Ionicons
                name="warning"
                size={16}
                color={lowStockProducts.length + outOfStockProducts.length > 0 ? '#D97706' : '#059669'}
              />
            </View>
            <Text style={[styles.metricLabel, { color: theme.textMuted }]}>
              {isUrdu ? 'کم اسٹاک' : 'Low Stock'}
            </Text>
            <Text
              style={[
                styles.metricValue,
                {
                  color:
                    lowStockProducts.length + outOfStockProducts.length > 0
                      ? theme.warning
                      : theme.text,
                },
              ]}>
              {lowStockProducts.length + outOfStockProducts.length}
            </Text>
            <Text style={[styles.metricSub, { color: theme.textMuted }]}>
              {lowStockProducts.length + outOfStockProducts.length > 0
                ? (isUrdu ? 'آرڈر کریں' : 'to reorder')
                : (isUrdu ? 'اسٹاک موجود' : 'all stocked')}
            </Text>
          </Pressable>
        </View>

        {/* ── Day-0 Rapid Store Setup Card (If not finished) ── */}
        {showSetupCard && (
          <View style={[styles.setupCard, { backgroundColor: theme.card, borderColor: softBorder }]}>
            <View style={styles.setupCardHeader}>
              <View style={[styles.setupIconWrap, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="sparkles" size={18} color="#059669" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.setupTitle, { color: theme.text }]}>
                  {isUrdu ? 'دکان شروع کرنے کے آسان 3 مراحل' : 'Quick 3-Step Store Setup'}
                </Text>
                <Text style={[styles.setupSubtitle, { color: theme.textSecondary }]}>
                  {isUrdu
                    ? `${completedStepsCount} از 3 مرحلے مکمل`
                    : `${completedStepsCount} of 3 steps completed`}
                </Text>
              </View>

              <View style={[styles.setupBadge, { backgroundColor: completedStepsCount > 0 ? '#D1FAE5' : theme.surfaceSubtle }]}>
                <Text style={[styles.setupBadgeText, { color: completedStepsCount > 0 ? '#059669' : theme.textSecondary }]}>
                  {completedStepsCount}/3
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
                    backgroundColor: '#059669',
                    width: `${Math.max(8, Math.round((completedStepsCount / 3) * 100))}%`,
                  },
                ]}
              />
            </View>

            {/* Step 1: Add Staples or Custom Product */}
            <View
              style={[
                styles.setupStepBox,
                {
                  backgroundColor: hasProducts
                    ? (settings.darkMode ? 'rgba(16, 185, 129, 0.08)' : '#F0FDF4')
                    : theme.surfaceSubtle,
                  borderColor: hasProducts ? theme.success : softBorder,
                },
              ]}>
              <View style={styles.setupStepTop}>
                <View
                  style={[
                    styles.stepNumBubble,
                    { backgroundColor: hasProducts ? theme.success : theme.primary },
                  ]}>
                  {hasProducts ? (
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  ) : (
                    <Text style={styles.stepNumText}>1</Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.stepTitle, { color: theme.text }]}>
                    {hasProducts
                      ? (isUrdu ? 'اشیاء شامل ہیں' : 'Inventory Ready')
                      : (isUrdu ? 'دکان میں اشیاء شامل کریں' : 'Add Inventory Products')}
                  </Text>
                  <Text style={[styles.stepDesc, { color: theme.textMuted }]}>
                    {hasProducts
                      ? (isUrdu ? `دکان میں ${products.length} اشیاء محفوظ ہیں` : `${products.length} products ready in catalog`)
                      : (isUrdu
                        ? 'چینی، آٹا، گھی، دالیں اور چائے 1 کلک میں لوڈ کریں'
                        : 'Load top 20 Pakistani staples with verified prices')}
                  </Text>
                </View>
                {hasProducts ? (
                  <View style={[styles.stepDoneBadge, { backgroundColor: '#D1FAE5' }]}>
                    <Text style={[styles.stepDoneText, { color: '#059669' }]}>
                      {isUrdu ? '✓ مکمل' : '✓ Done'}
                    </Text>
                  </View>
                ) : null}
              </View>

              {!hasProducts && (
                <View style={styles.stepButtonsRow}>
                  <Pressable
                    onPress={handleLoadStaples}
                    disabled={isLoadingStaples}
                    style={({ pressed }) => [
                      styles.loadStaplesBtn,
                      { backgroundColor: '#059669' },
                      pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
                    ]}>
                    {isLoadingStaples ? (
                      <Text style={styles.loadStaplesText}>
                        {isUrdu ? 'لوڈ ہو رہا ہے...' : 'Loading...'}
                      </Text>
                    ) : (
                      <>
                        <Ionicons name="flash" size={15} color="#FFFFFF" />
                        <Text style={styles.loadStaplesText}>
                          {isUrdu ? '⚡ 20 اہم اشیاء لوڈ کریں' : '⚡ Load Top 20 Staples'}
                        </Text>
                      </>
                    )}
                  </Pressable>

                  <Pressable
                    onPress={() => setIsAddProductOpen(true)}
                    style={({ pressed }) => [
                      styles.customProductBtn,
                      { borderColor: softBorder, backgroundColor: theme.card },
                      pressed && { opacity: 0.8 },
                    ]}>
                    <Ionicons name="add" size={15} color={theme.text} />
                    <Text style={[styles.customProductText, { color: theme.text }]}>
                      {isUrdu ? '+ نیا آئٹم' : '+ Custom Item'}
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>

            {/* Step 2: Customer Ledger */}
            <View
              style={[
                styles.setupStepBox,
                {
                  backgroundColor: hasCustomers
                    ? (settings.darkMode ? 'rgba(16, 185, 129, 0.08)' : '#F0FDF4')
                    : theme.surfaceSubtle,
                  borderColor: hasCustomers ? theme.success : softBorder,
                },
              ]}>
              <View style={styles.setupStepTop}>
                <View
                  style={[
                    styles.stepNumBubble,
                    { backgroundColor: hasCustomers ? theme.success : theme.secondary },
                  ]}>
                  {hasCustomers ? (
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  ) : (
                    <Text style={styles.stepNumText}>2</Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.stepTitle, { color: theme.text }]}>
                    {hasCustomers
                      ? (isUrdu ? 'گاہک کھاتہ فعال ہے' : 'Customer Ledger Active')
                      : (isUrdu ? 'پرانا ادھار کھاتہ درج کریں' : 'Register Customer Ledger')}
                  </Text>
                  <Text style={[styles.stepDesc, { color: theme.textMuted }]}>
                    {hasCustomers
                      ? (isUrdu ? `کھاتے میں ${khata.length} گاہک محفوظ ہیں` : `${khata.length} customers in ledger`)
                      : (isUrdu
                        ? 'بہی کھاتہ سے اپنے پرانے ادھار گاہک اور رقم لکھیں'
                        : 'Transfer customer names and debt balances')}
                  </Text>
                </View>
                {hasCustomers ? (
                  <View style={[styles.stepDoneBadge, { backgroundColor: '#D1FAE5' }]}>
                    <Text style={[styles.stepDoneText, { color: '#059669' }]}>
                      {isUrdu ? '✓ مکمل' : '✓ Done'}
                    </Text>
                  </View>
                ) : (
                  <Pressable
                    onPress={() => setActiveTab('khata')}
                    style={({ pressed }) => [
                      styles.stepActionBtn,
                      { backgroundColor: theme.primary },
                      pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
                    ]}>
                    <Ionicons name="person-add" size={13} color="#FFFFFF" />
                    <Text style={styles.stepActionText}>
                      {isUrdu ? 'نیا گاہک' : 'Add'}
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>

            {/* Step 3: First Sale */}
            <View
              style={[
                styles.setupStepBox,
                {
                  backgroundColor: hasSales
                    ? (settings.darkMode ? 'rgba(16, 185, 129, 0.08)' : '#F0FDF4')
                    : theme.surfaceSubtle,
                  borderColor: hasSales ? theme.success : softBorder,
                },
              ]}>
              <View style={styles.setupStepTop}>
                <View
                  style={[
                    styles.stepNumBubble,
                    { backgroundColor: hasSales ? theme.success : '#7C3AED' },
                  ]}>
                  {hasSales ? (
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  ) : (
                    <Text style={styles.stepNumText}>3</Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.stepTitle, { color: theme.text }]}>
                    {hasSales
                      ? (isUrdu ? 'سیل کا ریکارڈ موجود ہے' : 'First Sale Completed')
                      : (isUrdu ? 'پہلی سیل اور بل بنائیں' : 'Create First Sale Bill')}
                  </Text>
                  <Text style={[styles.stepDesc, { color: theme.textMuted }]}>
                    {hasSales
                      ? (isUrdu ? `${sales.length} بل بنائے جا چکے ہیں` : `${sales.length} sales recorded`)
                      : (isUrdu
                        ? 'نقد فروخت یا ادھار بل کا پرنٹ و واٹس ایپ رسید'
                        : 'Fast counter billing with WhatsApp receipts')}
                  </Text>
                </View>
                {hasSales ? (
                  <View style={[styles.stepDoneBadge, { backgroundColor: '#D1FAE5' }]}>
                    <Text style={[styles.stepDoneText, { color: '#059669' }]}>
                      {isUrdu ? '✓ مکمل' : '✓ Done'}
                    </Text>
                  </View>
                ) : (
                  <Pressable
                    onPress={() => setActiveTab('sale')}
                    style={({ pressed }) => [
                      styles.stepActionBtn,
                      { backgroundColor: '#7C3AED' },
                      pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
                    ]}>
                    <Ionicons name="receipt" size={13} color="#FFFFFF" />
                    <Text style={styles.stepActionText}>
                      {isUrdu ? 'سیل بنائیں' : 'Start'}
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        )}

        {/* ── Recent Sales (SadaPay-style Floating Soft Cards) ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {isUrdu ? 'حالیہ بلز' : 'Recent Sales'}
          </Text>
          {sales.length > 0 && (
            <Pressable
              onPress={() => setActiveTab('history')}
              hitSlop={8}
              style={({ pressed }) => [pressed && { opacity: 0.7 }]}>
              <Text style={[styles.sectionLink, { color: theme.primary }]}>
                {isUrdu ? `سب دیکھیں (${sales.length}) →` : `View All (${sales.length}) →`}
              </Text>
            </Pressable>
          )}
        </View>

        {recentSales.length === 0 ? (
          <EmptyState
            icon="receipt-outline"
            title={t('noRecentSales')}
            subtitle={isUrdu ? 'پہلا بل بنانے کے لیے اوپر بٹن دبائیں' : 'Create your first bill to get started.'}
            actionLabel={isUrdu ? 'نیا بل بنائیں' : 'Create First Bill'}
            onAction={() => setIsSaleModalOpen(true)}
            compact
          />
        ) : (
          <View style={styles.recentSalesList}>
            {recentSales.map((s) => {
              const isCash = s.paymentMethod === 'cash';
              const isOnline = s.paymentMethod === 'online';

              const iconBg = isCash
                ? (settings.darkMode ? 'rgba(16, 185, 129, 0.14)' : '#ECFDF5')
                : isOnline
                  ? (settings.darkMode ? 'rgba(56, 189, 248, 0.14)' : '#E0F2FE')
                  : (settings.darkMode ? 'rgba(239, 68, 68, 0.14)' : '#FEE2E2');

              const iconColor = isCash ? '#059669' : isOnline ? '#0284C7' : '#DC2626';

              return (
                <Pressable
                  key={s.id}
                  onPress={() => setActiveReceipt(s)}
                  style={({ pressed }) => [
                    styles.recentSaleCard,
                    { backgroundColor: theme.card, borderColor: softBorder },
                    pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] },
                  ]}>
                  {/* Left Squircle Badge */}
                  <View style={[styles.saleAvatarBadge, { backgroundColor: iconBg }]}>
                    <Ionicons
                      name={isCash ? 'cash' : isOnline ? 'phone-portrait' : 'book'}
                      size={18}
                      color={iconColor}
                    />
                  </View>

                  {/* Middle Customer & Meta */}
                  <View style={styles.saleMiddleBlock}>
                    <Text style={[styles.saleCustomerName, { color: theme.text }]} numberOfLines={1}>
                      {s.customerName || (isUrdu ? 'نقد گاہک (کاؤنٹر سیل)' : 'Walk-in Cash Customer')}
                    </Text>
                    <Text style={[styles.saleTimeMeta, { color: theme.textMuted }]} numberOfLines={1}>
                      {new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • #{s.billNumber} • {s.items.length} {t('itemsCount')}
                    </Text>
                  </View>

                  {/* Right Amount & Capsule */}
                  <View style={styles.saleRightBlock}>
                    <Text style={[styles.saleAmountText, { color: theme.text }]}>
                      {settings.currencySymbol}{s.grandTotal.toLocaleString()}
                    </Text>
                    <View style={[styles.paymentMethodCapsule, { backgroundColor: iconBg }]}>
                      <Text style={[styles.paymentMethodText, { color: iconColor }]}>
                        {s.paymentMethod.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* ── Collapsible Reports & Analytics Section ── */}
        <Pressable
          onPress={() => setShowReports((v) => !v)}
          style={({ pressed }) => [
            styles.reportsToggleBtn,
            { backgroundColor: theme.card, borderColor: softBorder },
            pressed && { opacity: 0.85 },
          ]}>
          <View style={styles.reportsToggleLeft}>
            <Ionicons name="bar-chart" size={17} color={theme.primary} />
            <Text style={[styles.reportsToggleTitle, { color: theme.text }]}>
              {isUrdu ? 'دکان کی رپورٹس اور منافع کا گراف' : 'Store Analytics & Profit Reports'}
            </Text>
          </View>
          <Ionicons name={showReports ? 'chevron-up' : 'chevron-down'} size={16} color={theme.textMuted} />
        </Pressable>

        {showReports && (
          <View style={styles.reportsExpandedArea}>
            {/* Sales Chart */}
            <SalesChart sales={sales} />

            {/* Financial Investment Breakdown */}
            <View style={styles.financeGrid}>
              {/* Card 1: Total Inventory Value */}
              <Pressable
                onPress={() => setActiveTab('products')}
                style={({ pressed }) => [
                  styles.financeCard,
                  { backgroundColor: theme.card, borderColor: softBorder },
                  pressed && { opacity: 0.9 },
                ]}>
                <View style={styles.financeCardHeader}>
                  <View style={[styles.financeIconWrap, { backgroundColor: '#ECFDF5' }]}>
                    <Ionicons name="wallet-outline" size={18} color="#059669" />
                  </View>
                  <View style={[styles.financeBadge, { backgroundColor: '#D1FAE5' }]}>
                    <Text style={[styles.financeBadgeText, { color: '#059669' }]}>
                      {totalInventoryUnits} {isUrdu ? 'اشیاء' : 'units'}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.financeCardTitle, { color: theme.textSecondary }]}>
                  {t('totalInvestment')}
                </Text>
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
                    <Text style={[styles.financeSubStatValue, { color: '#059669', fontWeight: '800' }]}>
                      +{settings.currencySymbol} {totalExpectedStockProfit.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </Pressable>

              {/* Card 2: Total Store Earnings */}
              <Pressable
                onPress={() => setActiveTab('history')}
                style={({ pressed }) => [
                  styles.financeCard,
                  { backgroundColor: theme.card, borderColor: softBorder },
                  pressed && { opacity: 0.9 },
                ]}>
                <View style={styles.financeCardHeader}>
                  <View style={[styles.financeIconWrap, { backgroundColor: '#F5F3FF' }]}>
                    <Ionicons name="trending-up-outline" size={18} color="#7C3AED" />
                  </View>
                  <View style={[styles.financeBadge, { backgroundColor: '#EDE9FE' }]}>
                    <Text style={[styles.financeBadgeText, { color: '#7C3AED' }]}>
                      {sales.filter(s => s.status !== 'refunded' && s.status !== 'cancelled').length} {isUrdu ? 'بلز' : 'sales'}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.financeCardTitle, { color: theme.textSecondary }]}>
                  {t('totalStoreEarnings')}
                </Text>
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
        primaryColor={theme.primary}
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
    paddingTop: 12,
    paddingBottom: 110,
    maxWidth: 720,
    marginHorizontal: 'auto',
    width: '100%',
    gap: 12,
  },
  saleModalContainer: {
    flex: 1,
  },

  // Greeting Bar
  topGreetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  greetingLeft: {
    flex: 1,
    gap: 1,
  },
  greetingSub: {
    fontSize: 12,
    fontWeight: '500',
  },
  greetingName: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  avatarPressable: {
    padding: 2,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  avatarImg: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },

  // SadaPay Hero Balance Card
  heroCard: {
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
    gap: 10,
    ...Shadows.md,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  heroIconBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroLabel: {
    color: 'rgba(255, 255, 255, 0.88)',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  heroExpenseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 12,
    ...Shadows.sm,
  },
  heroExpenseBtnText: {
    color: '#DC2626',
    fontSize: 11.5,
    fontWeight: '800',
  },
  heroAmountWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  heroAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  heroDeductedBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.35)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  heroDeductedText: {
    color: '#FEE2E2',
    fontSize: 11,
    fontWeight: '800',
  },
  heroCapsulesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    paddingTop: 2,
  },
  heroCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
  },
  heroCapsuleText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  // Action Pods (SadaPay Style)
  actionPodsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionPod: {
    flex: 1,
    borderRadius: 20,
    padding: 14,
    gap: 14,
    ...Shadows.sm,
  },
  actionPodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionPodIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionPodTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  actionPodSub: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },

  // 3 Key Metrics Row
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    padding: 12,
    gap: 3,
    ...Shadows.sm,
  },
  metricAvatar: {
    width: 32,
    height: 32,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  metricSub: {
    fontSize: 10,
    fontWeight: '500',
  },

  // Setup Card
  setupCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: Spacing.md,
    gap: 12,
    ...Shadows.sm,
  },
  setupCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  setupIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setupTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  setupSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  setupBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  setupBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
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
  setupStepBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  setupStepTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepNumBubble: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  stepDesc: {
    fontSize: 10.5,
    marginTop: 1,
    lineHeight: 14,
  },
  stepButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  loadStaplesBtn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  loadStaplesText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  customProductBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  customProductText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  stepActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  stepActionText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  stepDoneBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  stepDoneText: {
    fontSize: 10.5,
    fontWeight: '800',
  },

  // Section Header
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  sectionLink: {
    fontSize: 12.5,
    fontWeight: '700',
  },

  // Recent Sales (SadaPay Inspo: Netflix / KFC style)
  recentSalesList: {
    gap: 8,
  },
  recentSaleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    ...Shadows.sm,
  },
  saleAvatarBadge: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saleMiddleBlock: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  saleCustomerName: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  saleTimeMeta: {
    fontSize: 11,
    fontWeight: '500',
  },
  saleRightBlock: {
    alignItems: 'flex-end',
    gap: 3,
  },
  saleAmountText: {
    fontSize: 15.5,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  paymentMethodCapsule: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
  },
  paymentMethodText: {
    fontSize: 9.5,
    fontWeight: '800',
  },

  // Reports
  reportsToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 4,
    ...Shadows.sm,
  },
  reportsToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reportsToggleTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  reportsExpandedArea: {
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
  financeIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  financeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  financeBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  financeCardTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginTop: 6,
  },
  financeMainAmount: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginTop: 2,
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
