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

  // Show only a few (top 3) most recent sales on home to prevent crowding busy shops
  const MAX_HOME_RECENT_SALES = 3;
  const recentSales = useMemo(() => {
    return [...sales]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, MAX_HOME_RECENT_SALES);
  }, [sales]);

  // In-home Sale Modal
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);

  // Day-end summary modal & Cash Drawer Tally
  const [showDayEnd, setShowDayEnd] = useState(false);
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

  // Vasooli / Debt Recovery collected today from customers
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

  const getPayColor = (method: string) => {
    if (method === 'cash') return theme.success;
    if (method === 'online') return theme.secondary;
    return theme.danger;
  };

  return (
    <View style={[styles.rootContainer, { backgroundColor: theme.background }]}>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* ── Hero + floating metrics (clean home header) ── */}
        <View style={[styles.heroSection, { backgroundColor: theme.heroBg }]}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroLeft}>
              <Text style={styles.heroGreet}>
                {language === 'ur' ? 'خوش آمدید،' : 'Welcome back,'}
              </Text>
              <Text style={styles.heroOwner} numberOfLines={1}>
                {settings.ownerName || user?.displayName || (language === 'ur' ? 'معزز دکاندار' : 'Valued Shopkeeper')}
              </Text>
            </View>

            <Pressable
              onPress={() => setActiveTab('settings')}
              style={({ pressed }) => [
                styles.heroAvatarBtn,
                pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
              ]}>
              <View style={styles.heroIconCircle}>
                {settings.profileImage && !settings.profileImage.includes('googleusercontent.com/a/') ? (
                  <ProductImage
                    uri={settings.profileImage}
                    style={styles.heroAvatarImg}
                    fallbackIcon={
                      <Image
                        source={require('@/../assets/images/mainLogoImage.png')}
                        style={styles.heroAvatarImg}
                        resizeMode="contain"
                      />
                    }
                  />
                ) : (
                  <Image
                    source={require('@/../assets/images/mainLogoImage.png')}
                    style={styles.heroAvatarImg}
                    resizeMode="contain"
                  />
                )}
              </View>
            </Pressable>
          </View>

          <View style={styles.overviewRow}>
            <Text style={styles.overviewTitle}>{t('todayOverview')}</Text>
            <Pressable
              onPress={() => setShowDayEnd(true)}
              hitSlop={8}
              style={({ pressed }) => [pressed && { opacity: 0.7 }]}>
              <Text style={styles.overviewAction}>{t('showToday')}</Text>
            </Pressable>
          </View>
        </View>

        {/* ── Today's Metrics (overlap green header) ── */}
        <View style={styles.metricsGrid}>
          {/* 1. Today's Total Sales */}
          <Pressable
            onPress={() => setShowDayEnd(true)}
            style={({ pressed }) => [
              styles.metricCard,
              { backgroundColor: theme.card },
              pressed && { opacity: 0.88 },
            ]}>
            <View style={styles.metricHeaderRow}>
              <Text style={[styles.metricLabel, { color: theme.textSecondary }]} numberOfLines={1}>
                {t('todaySales')}
              </Text>
              <Ionicons name="receipt-outline" size={15} color={theme.textMuted} />
            </View>
            <Text style={[styles.metricValue, { color: theme.text }]} numberOfLines={1}>
              {settings.currencySymbol} {todaySalesTotal.toLocaleString()}
            </Text>
            <Text style={[styles.metricSubHint, { color: theme.textMuted }]} numberOfLines={1}>
              {todaySales.length > 0
                ? `${todaySales.length} ${language === 'ur' ? 'بلز آج' : 'bills today'}`
                : language === 'ur' ? 'آج کوئی بل نہیں' : 'No bills yet'}
            </Text>
          </Pressable>

          {/* 2. Today's Profit */}
          <Pressable
            onPress={() => setShowDayEnd(true)}
            style={({ pressed }) => [
              styles.metricCard,
              { backgroundColor: theme.card },
              pressed && { opacity: 0.88 },
            ]}>
            <View style={styles.metricHeaderRow}>
              <Text style={[styles.metricLabel, { color: theme.textSecondary }]} numberOfLines={1}>
                {language === 'ur' ? 'آج کا منافع' : "Today's Profit"}
              </Text>
              <Ionicons name="trending-up-outline" size={15} color="#059669" />
            </View>
            <Text style={[styles.metricValue, { color: '#059669' }]} numberOfLines={1}>
              +{settings.currencySymbol} {Math.max(0, todayGrossProfit).toLocaleString()}
            </Text>
            <Text style={[styles.metricSubHint, { color: '#059669' }]} numberOfLines={1}>
              {todaySalesTotal > 0
                ? `${Math.round((todayGrossProfit / todaySalesTotal) * 100)}% ${language === 'ur' ? 'منافع مارجن' : 'margin'}`
                : language === 'ur' ? 'سیل کا منافع' : 'Net profit'}
            </Text>
          </Pressable>

          {/* 3. Customer Credit */}
          <Pressable
            onPress={() => setActiveTab('khata')}
            style={({ pressed }) => [
              styles.metricCard,
              { backgroundColor: theme.card },
              pressed && { opacity: 0.88 },
            ]}>
            <View style={styles.metricHeaderRow}>
              <Text style={[styles.metricLabel, { color: theme.textSecondary }]} numberOfLines={1}>
                {language === 'ur' ? 'گاہکوں کا ادھار' : 'Customer Credit'}
              </Text>
              <Ionicons name="book-outline" size={15} color={theme.danger} />
            </View>
            <Text style={[styles.metricValue, { color: theme.danger }]} numberOfLines={1}>
              {settings.currencySymbol} {totalUdhaarReceivable.toLocaleString()}
            </Text>
            <Text style={[styles.metricSubHint, { color: theme.textMuted }]} numberOfLines={1}>
              {khata.filter((c: any) => (c.currentBalance || c.balance || 0) > 0).length > 0
                ? `${khata.filter((c: any) => (c.currentBalance || c.balance || 0) > 0).length} ${language === 'ur' ? 'کھاتے بقایا' : 'pending accounts'}`
                : language === 'ur' ? 'کوئی ادھار نہیں' : 'All cleared'}
            </Text>
          </Pressable>

          {/* 4. Debt Recovered */}
          <Pressable
            onPress={() => setActiveTab('khata')}
            style={({ pressed }) => [
              styles.metricCard,
              { backgroundColor: theme.card },
              pressed && { opacity: 0.88 },
            ]}>
            <View style={styles.metricHeaderRow}>
              <Text style={[styles.metricLabel, { color: theme.textSecondary }]} numberOfLines={1}>
                {language === 'ur' ? 'ادھار وصولی' : 'Debt Recovered'}
              </Text>
              <Ionicons name="arrow-down-circle-outline" size={15} color="#059669" />
            </View>
            <Text style={[styles.metricValue, { color: '#059669' }]} numberOfLines={1}>
              +{settings.currencySymbol} {todayVasooli.toLocaleString()}
            </Text>
            <Text style={[styles.metricSubHint, { color: theme.textMuted }]} numberOfLines={1}>
              {language === 'ur' ? 'آج کی جمع شدہ رقم' : "Today's collections"}
            </Text>
          </Pressable>
        </View>

        {/* ── Cash Register / Cash-in-Drawer Hero Card ── */}
        <View style={[styles.drawerActionStrip, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {/* Header Row: Title + Info on left, Record Expense Button on right */}
          <View style={styles.drawerTopRow}>
            <Pressable
              onPress={() => setShowDayEnd(true)}
              style={styles.drawerTitleWrap}>
              <View style={[styles.drawerSmallIcon, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="wallet" size={17} color="#059669" />
              </View>
              <Text style={[styles.drawerStripLabel, { color: theme.text }]} numberOfLines={1}>
                {language === 'ur' ? 'گلہ کا نقد کیش' : 'Cash in Register'}
              </Text>
              <Ionicons name="information-circle-outline" size={14} color={theme.textMuted} />
            </Pressable>

            <Pressable
              onPress={() => setIsCashOutModalOpen(true)}
              hitSlop={8}
              style={({ pressed }) => [
                styles.drawerStripCashOutBtn,
                { backgroundColor: theme.dangerLight, borderColor: theme.danger },
                pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
              ]}>
              <Ionicons name="arrow-up-circle-outline" size={14} color={theme.danger} />
              <Text style={[styles.drawerStripCashOutText, { color: theme.danger }]}>
                {language === 'ur' ? 'خرچہ لکھیں' : 'Record Expense'}
              </Text>
            </Pressable>
          </View>

          {/* Hero Body: Bold Amount + Deducted Pill + Live Formula */}
          <Pressable
            onPress={() => setShowDayEnd(true)}
            style={styles.drawerBottomArea}>
            <View style={styles.drawerAmountRow}>
              <Text style={[styles.drawerStripAmount, { color: '#059669' }]}>
                {settings.currencySymbol} {todayNetCashInDrawer.toLocaleString()}
              </Text>
              {todayCashOutTotal > 0 && (
                <View style={[styles.expDeductedPill, { backgroundColor: theme.dangerLight }]}>
                  <Text style={[styles.expDeductedText, { color: theme.danger }]}>
                    -{settings.currencySymbol}{todayCashOutTotal.toLocaleString()} {language === 'ur' ? 'خرچہ' : 'exp'}
                  </Text>
                </View>
              )}
            </View>

            <Text style={[styles.drawerFormulaSub, { color: theme.textMuted }]} numberOfLines={1}>
              {todaySales.length === 0 && todayVasooli === 0 && todayCashOutTotal === 0
                ? (language === 'ur' ? 'نقد سیل یا خرچہ پر گلہ خودکار اپڈیٹ ہوگا' : 'Live balance = Cash Sales + Recovered - Expenses')
                : (language === 'ur' ? 'نقد سیل + وصولی - خرچہ' : 'Cash Sales + Recoveries - Expenses')}
            </Text>
          </Pressable>
        </View>

        {/* ── Evening Closing Prompt Banner (Auto-triggers after 5 PM or when sales exist) ── */}
        {(new Date().getHours() >= 17 || todaySales.length > 0) && (
          <Pressable
            onPress={() => setShowDayEnd(true)}
            style={({ pressed }) => [
              styles.eveningClosingPromptCard,
              pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
            ]}>
            <View style={styles.eveningPromptLeft}>
              <View style={styles.eveningPromptMoon}>
                <Ionicons name="moon" size={20} color="#FBBF24" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.eveningPromptTitle}>
                  {language === 'ur'
                    ? 'دکان بند کرنے کا وقت؟ شام کا حساب کریں'
                    : "Ready to close shop? Tally cash drawer"}
                </Text>
                <Text style={styles.eveningPromptSubtitle} numberOfLines={1}>
                  {language === 'ur'
                    ? `گلہ میں متوقع: ${settings.currencySymbol}${todayNetCashInDrawer.toLocaleString()} • نقد نوٹ گنیں`
                    : `Expected: ${settings.currencySymbol}${todayNetCashInDrawer.toLocaleString()} • Count notes & get report`}
                </Text>
              </View>
            </View>
            <View style={styles.eveningPromptCta}>
              <Text style={styles.eveningPromptCtaText}>
                {language === 'ur' ? 'حساب کریں ↵' : 'Tally →'}
              </Text>
            </View>
          </Pressable>
        )}

        
        {/* ── Day-0 Rapid Store Setup Card (Checklist stays visible until all milestones completed or dismissed) ── */}
        {showSetupCard && (
          <View style={[styles.setupCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.setupCardHeader}>
              <View style={[styles.setupIconWrap, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="sparkles" size={20} color="#059669" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.setupTitle, { color: theme.text }]}>
                  {language === 'ur' ? 'دکان شروع کرنے کے آسان 3 مراحل' : 'Quick 3-Step Store Setup'}
                </Text>
                <Text style={[styles.setupSubtitle, { color: theme.textSecondary }]}>
                  {language === 'ur'
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
                  borderColor: hasProducts ? theme.success : theme.border,
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
                      ? (language === 'ur' ? 'اشیاء شامل ہیں' : 'Inventory Ready')
                      : (language === 'ur' ? 'دکان میں اشیاء شامل کریں' : 'Add Inventory Products')}
                  </Text>
                  <Text style={[styles.stepDesc, { color: theme.textMuted }]}>
                    {hasProducts
                      ? (language === 'ur' ? `دکان میں ${products.length} اشیاء محفوظ ہیں` : `${products.length} products ready in catalog`)
                      : (language === 'ur'
                        ? 'چینی، آٹا، گھی، دالیں اور چائے کی پتی 1 کلک میں لوڈ کریں'
                        : 'Load top 20 Pakistani staples with verified prices or add custom item')}
                  </Text>
                </View>
                {hasProducts ? (
                  <View style={[styles.stepDoneBadge, { backgroundColor: '#D1FAE5' }]}>
                    <Text style={[styles.stepDoneText, { color: '#059669' }]}>
                      {language === 'ur' ? '✓ مکمل' : '✓ Done'}
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
                        {language === 'ur' ? 'لوڈ ہو رہا ہے...' : 'Loading...'}
                      </Text>
                    ) : (
                      <>
                        <Ionicons name="flash" size={15} color="#FFFFFF" />
                        <Text style={styles.loadStaplesText}>
                          {language === 'ur' ? '⚡ 20 اہم اشیاء لوڈ کریں' : '⚡ Load Top 20 Staples'}
                        </Text>
                      </>
                    )}
                  </Pressable>

                  <Pressable
                    onPress={() => setIsAddProductOpen(true)}
                    style={({ pressed }) => [
                      styles.customProductBtn,
                      { borderColor: theme.border, backgroundColor: theme.card },
                      pressed && { opacity: 0.8 },
                    ]}>
                    <Ionicons name="add" size={15} color={theme.text} />
                    <Text style={[styles.customProductText, { color: theme.text }]}>
                      {language === 'ur' ? '+ نیا آئٹم' : '+ Custom Item'}
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>

            {/* Step 2: Add Customer Udhaar */}
            <View
              style={[
                styles.setupStepBox,
                {
                  backgroundColor: hasCustomers
                    ? (settings.darkMode ? 'rgba(16, 185, 129, 0.08)' : '#F0FDF4')
                    : theme.surfaceSubtle,
                  borderColor: hasCustomers
                    ? theme.success
                    : (!hasCustomers && hasProducts ? theme.primary : theme.border),
                  borderWidth: !hasCustomers && hasProducts ? 1.5 : 1,
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
                      ? (language === 'ur' ? 'گاہک کھاتہ فعال ہے' : 'Customer Ledger Active')
                      : (language === 'ur' ? 'پرانا ادھار کھاتہ درج کریں' : 'Register Customer Ledger')}
                  </Text>
                  <Text style={[styles.stepDesc, { color: theme.textMuted }]}>
                    {hasCustomers
                      ? (language === 'ur' ? `کھاتے میں ${khata.length} گاہک محفوظ ہیں` : `${khata.length} customers in ledger`)
                      : (language === 'ur'
                        ? 'بہی کھاتہ سے اپنے پرانے ادھار گاہک اور سابقہ بقایا لکھیں'
                        : 'Transfer customer names and opening debt balances from your notebook')}
                  </Text>
                </View>
                {hasCustomers ? (
                  <View style={[styles.stepDoneBadge, { backgroundColor: '#D1FAE5' }]}>
                    <Text style={[styles.stepDoneText, { color: '#059669' }]}>
                      {language === 'ur' ? '✓ مکمل' : '✓ Done'}
                    </Text>
                  </View>
                ) : (
                  <Pressable
                    onPress={() => setActiveTab('khata')}
                    style={({ pressed }) => [
                      styles.stepActionBtn,
                      { backgroundColor: theme.primary, borderColor: theme.primary },
                      pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
                    ]}>
                    <Ionicons name="person-add" size={14} color="#FFFFFF" />
                    <Text style={[styles.stepActionText, { color: '#FFFFFF' }]}>
                      {language === 'ur' ? 'نیا گاہک' : 'Add Customer'}
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
                  borderColor: hasSales
                    ? theme.success
                    : (!hasSales && hasProducts ? '#7C3AED' : theme.border),
                  borderWidth: !hasSales && hasProducts ? 1.5 : 1,
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
                      ? (language === 'ur' ? 'سیل کا ریکارڈ موجود ہے' : 'First Sale Completed')
                      : (language === 'ur' ? 'پہلی سیل اور بل بنائیں' : 'Create First Sale Bill')}
                  </Text>
                  <Text style={[styles.stepDesc, { color: theme.textMuted }]}>
                    {hasSales
                      ? (language === 'ur' ? `${sales.length} بل بنائے جا چکے ہیں` : `${sales.length} sales recorded`)
                      : (language === 'ur'
                        ? 'نقد فروخت یا ادھار بل کا پرنٹ و واٹس ایپ رسید'
                        : 'Fast counter billing with instant WhatsApp receipt sharing')}
                  </Text>
                </View>
                {hasSales ? (
                  <View style={[styles.stepDoneBadge, { backgroundColor: '#D1FAE5' }]}>
                    <Text style={[styles.stepDoneText, { color: '#059669' }]}>
                      {language === 'ur' ? '✓ مکمل' : '✓ Done'}
                    </Text>
                  </View>
                ) : (
                  <Pressable
                    onPress={() => setActiveTab('sale')}
                    style={({ pressed }) => [
                      styles.stepActionBtn,
                      { backgroundColor: '#7C3AED', borderColor: '#7C3AED' },
                      pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
                    ]}>
                    <Ionicons name="receipt-outline" size={14} color="#FFFFFF" />
                    <Text style={[styles.stepActionText, { color: '#FFFFFF' }]}>
                      {language === 'ur' ? 'سیل بنائیں' : 'Start Sale'}
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        )}

        {/* ── Sales Analytics & Trends Chart ── */}
        <SalesChart sales={sales} />

        {/* ── Store Investment & Lifetime Earnings Section ── */}
        <View style={{ marginTop: Spacing.md, marginBottom: Spacing.xs }}>
          <SectionHeader title={t('investmentSection')} />
        </View>

        <View style={styles.financeGrid}>
          {/* Card 1: Stock Investment & Value */}
          <Pressable
            onPress={() => setActiveTab('products')}
            style={({ pressed }) => [
              styles.financeCard,
              { backgroundColor: theme.card, borderColor: theme.border },
              pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
            ]}>
            <View style={styles.financeCardHeader}>
              <View style={[styles.financeIconWrap, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="wallet-outline" size={20} color="#059669" />
              </View>
              <View style={[styles.financeHeaderBadge, { backgroundColor: '#D1FAE5' }]}>
                <Ionicons name="cube-outline" size={11} color="#059669" />
                <Text style={[styles.financeHeaderBadgeText, { color: '#059669' }]}>
                  {totalInventoryUnits} {language === 'ur' ? 'اشیاء' : 'units'}
                </Text>
              </View>
            </View>

            <Text style={[styles.financeCardTitle, { color: theme.textSecondary }]}>
              {t('totalInvestment')}
            </Text>
            <Text style={[styles.financeMainAmount, { color: theme.text }]}>
              {settings.currencySymbol} {totalInventoryInvestment.toLocaleString()}
            </Text>

            <View style={[styles.financeDivider, { backgroundColor: theme.border }]} />

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

          {/* Card 2: Total Store Earnings & Realized Profit */}
          <Pressable
            onPress={() => setActiveTab('history')}
            style={({ pressed }) => [
              styles.financeCard,
              { backgroundColor: theme.card, borderColor: theme.border },
              pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
            ]}>
            <View style={styles.financeCardHeader}>
              <View style={[styles.financeIconWrap, { backgroundColor: '#F5F3FF' }]}>
                <Ionicons name="trending-up-outline" size={20} color="#7C3AED" />
              </View>
              <View style={[styles.financeHeaderBadge, { backgroundColor: '#EDE9FE' }]}>
                <Ionicons name="checkmark-done" size={11} color="#7C3AED" />
                <Text style={[styles.financeHeaderBadgeText, { color: '#7C3AED' }]}>
                  {sales.filter(s => s.status !== 'refunded' && s.status !== 'cancelled').length} {language === 'ur' ? 'بلز' : 'sales'}
                </Text>
              </View>
            </View>

            <Text style={[styles.financeCardTitle, { color: theme.textSecondary }]}>
              {t('totalStoreEarnings')}
            </Text>
            <Text style={[styles.financeMainAmount, { color: '#7C3AED' }]}>
              {settings.currencySymbol} {totalLifetimeEarnings.toLocaleString()}
            </Text>

            <View style={[styles.financeDivider, { backgroundColor: theme.border }]} />

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

        {/* ── Stock Alerts ── */}
        {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
          <View style={[styles.alertSection, { backgroundColor: theme.warningLight, borderColor: theme.warning }]}>
            <View style={styles.alertHeader}>
              <Ionicons name="warning" size={18} color={theme.warning} />
              <Text style={[styles.alertTitle, { color: theme.accent }]}>
                {t('lowStockAlert')} ({lowStockProducts.length + outOfStockProducts.length})
              </Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.alertItemsScroll}>
              {outOfStockProducts.map((p) => (
                <Pressable
                  key={p.id}
                  onPress={() => setActiveTab('products')}
                  style={({ pressed }) => [pressed && { opacity: 0.8 }]}>
                  <StatusBadge
                    label={`${p.name}: ${t('outOfStock')}`}
                    bg={theme.dangerLight}
                    color={theme.danger}
                    icon="close-circle"
                  />
                </Pressable>
              ))}
              {lowStockProducts.map((p) => (
                <Pressable
                  key={p.id}
                  onPress={() => setActiveTab('products')}
                  style={({ pressed }) => [{ marginLeft: 6 }, pressed && { opacity: 0.8 }]}>
                  <StatusBadge
                    label={`${p.name}: ${p.stock} ${p.unit}`}
                    bg={theme.warningLight}
                    color={theme.accent}
                    icon="alert-circle"
                  />
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}


        {/* ── Recent Sales ── */}
        <SectionHeader
          title={t('recentSales')}
          actionLabel={sales.length > 0 ? (sales.length > MAX_HOME_RECENT_SALES ? `${t('viewAll')} (${sales.length})` : t('viewAll')) : undefined}
          onAction={() => setActiveTab('history')}
        />

        {recentSales.length === 0 ? (
          <EmptyState
            icon="receipt-outline"
            title={t('noRecentSales')}
            subtitle={language === 'ur' ? 'پہلا بل بنانے کے لیے نیچے بٹن دبائیں' : 'Create your first bill to get started.'}
            actionLabel={language === 'ur' ? 'نیا بل بنائیں' : 'Create First Bill'}
            onAction={() => setIsSaleModalOpen(true)}
            compact
          />
        ) : (
          <View style={styles.recentSalesList}>
            {recentSales.map((s) => {
              const payColor = getPayColor(s.paymentMethod);
              return (
                <Pressable
                  key={s.id}
                  onPress={() => setActiveReceipt(s)}
                  style={({ pressed }) => [
                    styles.recentSaleItem,
                    { backgroundColor: theme.card, borderColor: theme.border, borderLeftColor: payColor },
                    pressed && { opacity: 0.82 },
                  ]}>
                  <View style={[styles.saleAvatar, { backgroundColor: theme.surfaceSubtle }]}>
                    <Ionicons
                      name={s.paymentMethod === 'cash' ? 'cash' : s.paymentMethod === 'online' ? 'phone-portrait' : 'book'}
                      size={18}
                      color={payColor}
                    />
                  </View>

                  <View style={styles.saleMiddle}>
                    <Text style={[styles.saleCustomer, { color: theme.text }]} numberOfLines={1}>
                      {s.customerName || (language === 'ur' ? 'نقد سیل' : 'Cash Sale')}
                    </Text>
                    <Text style={[styles.saleTime, { color: theme.textMuted }]}>
                      {new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {s.billNumber} • {s.items.length} {t('itemsCount')}
                    </Text>
                  </View>

                  <View style={styles.saleRight}>
                    <Text style={[styles.saleAmount, { color: theme.text }]}>
                      {settings.currencySymbol} {s.grandTotal}
                    </Text>
                    <StatusBadge
                      label={s.paymentMethod.toUpperCase()}
                      bg={payColor + '22'}
                      color={payColor}
                      size="sm"
                    />
                  </View>
                </Pressable>
              );
            })}

            {sales.length > MAX_HOME_RECENT_SALES && (
              <Pressable
                onPress={() => setActiveTab('history')}
                style={({ pressed }) => [
                  styles.viewMoreSalesBtn,
                  { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
                  pressed && { opacity: 0.75 },
                ]}>
                <Text style={[styles.viewMoreSalesText, { color: theme.primary }]}>
                  {language === 'ur'
                    ? `تمام ${sales.length} بلز دیکھیں →`
                    : `View All ${sales.length} Sales →`}
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {/* ── W2-5: Day-End Summary Card ── */}
        <Pressable
          onPress={() => setShowDayEnd(true)}
          style={({ pressed }) => [
            styles.dayEndCard,
            { backgroundColor: theme.primary, borderColor: theme.primaryDark },
            pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
          ]}>
          <View style={styles.dayEndLeft}>
            <Ionicons name="moon-outline" size={20} color="rgba(255,255,255,0.9)" />
            <View>
              <Text style={styles.dayEndTitle}>
                {language === 'ur' ? 'دن کا خلاصہ دیکھیں' : 'Day-End Summary'}
              </Text>
              <Text style={styles.dayEndSub}>
                {todaySales.length} {language === 'ur' ? 'بل آج' : 'bills today'} · {settings.currencySymbol}{todaySalesTotal.toLocaleString()}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.8)" />
        </Pressable>

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

        {/* ── Cash Out (Expense) Modal ── */}
        <CashOutModal
          visible={isCashOutModalOpen}
          onClose={() => setIsCashOutModalOpen(false)}
          onCashOutSaved={refreshCashOut}
        />

      </ScrollView>

      {/* ── Floating Action Button: Rainbow Quick Action Arc ── */}
      <RainbowQuickActionFab
        onNewSale={() => setIsSaleModalOpen(true)}
        onAddProduct={() => setIsAddProductOpen(true)}
        onDayEnd={() => setShowDayEnd(true)}
        onSettings={() => setActiveTab('settings')}
        primaryColor={theme.primary}
        isDark={!!settings.darkMode}
        language={language}
      />

      {/* ── Direct New Sale Window on Home ── */}
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
  container: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.md,
    paddingTop: 0,
    paddingBottom: 110,
    maxWidth: 720,
    marginHorizontal: 'auto',
    width: '100%',
  },
  floatingFabWrapper: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  saleModalContainer: {
    flex: 1,
  },

  // Hero — full-bleed green band
  heroSection: {
    marginHorizontal: -Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: 70,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroLeft: { flex: 1, paddingRight: Spacing.sm },
  heroGreet: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  heroOwner: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  heroAvatarBtn: { marginTop: 2 },
  heroIconCircle: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  heroAvatarImg: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.full,
  },
  overviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
  },
  overviewTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  overviewAction: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    fontWeight: '600',
  },

  // Metrics — float over green edge
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    columnGap: 12,
    marginTop: -42,
    marginBottom: Spacing.md,
  },
  metricCard: {
    width: '48%',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 4,
    ...Shadows.md,
  },
  metricHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  metricSubHint: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },

  // Alert Section
  alertSection: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  alertHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.sm },
  alertTitle: { fontSize: 13, fontWeight: '700' },
  alertItemsScroll: { flexDirection: 'row' },

  // Quick Actions
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: Spacing.md,
    columnGap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  quickTile: {
    width: '48%',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    overflow: 'hidden',
    ...Shadows.md,
  },
  quickTileShine: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  quickTileIconWrap: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickTileText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13, textAlign: 'center' },

  // Recent Sales
  recentSalesList: { gap: Spacing.sm },
  recentSaleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderLeftWidth: 4,
    ...Shadows.sm,
  },
  saleAvatar: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saleMiddle: { flex: 1, gap: 2 },
  saleCustomer: { fontSize: 14, fontWeight: '700' },
  saleTime: { fontSize: 11, fontWeight: '500' },
  saleRight: { alignItems: 'flex-end', gap: 4 },
  saleAmount: { fontSize: 15, fontWeight: '800', letterSpacing: -0.3 },
  viewMoreSalesBtn: {
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xs,
  },
  viewMoreSalesText: {
    fontSize: 13,
    fontWeight: '700',
  },
  // Finance & Investment Grid
  financeGrid: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  financeCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    ...Shadows.sm,
  },
  financeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  financeIconWrap: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  financeHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  financeHeaderBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  financeCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  financeMainAmount: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginTop: 2,
    marginBottom: Spacing.xs,
  },
  financeDivider: {
    height: 1,
    width: '100%',
    marginVertical: Spacing.xs,
  },
  financeSubStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  financeSubStat: {
    flex: 1,
    gap: 2,
  },
  financeSubStatLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  financeSubStatValue: {
    fontSize: 13,
    fontWeight: '700',
  },

  // Evening Closing Prompt Card
  eveningClosingPromptCard: {
    backgroundColor: '#064E3B',
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginTop: 8,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderWidth: 1,
    borderColor: '#047857',
    ...Shadows.md,
  },
  eveningPromptLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  eveningPromptMoon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eveningPromptTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  eveningPromptSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11.5,
    marginTop: 2,
    lineHeight: 16,
  },
  eveningPromptCta: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
  },
  eveningPromptCtaText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  // W2-5: Day-End Summary card + modal
  dayEndCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    ...Shadows.md,
  },
  dayEndLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  dayEndTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  dayEndSub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    marginTop: 2,
  },
  dayEndOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  dayEndModal: {
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    overflow: 'hidden',
    ...Shadows.xl,
  },
  dayEndModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  dayEndModalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dayEndModalTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  dayEndClose: {
    padding: 4,
  },
  dayEndBody: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: 0,
  },
  dayEndRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: Spacing.md,
    borderBottomWidth: 1,
  },
  dayEndRowIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',

  },
  dayEndRowLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',

  },
  dayEndRowValue: {
    fontSize: 15,
    fontWeight: '800',

  },
  drawerActionStrip: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    marginTop: 6,
    marginBottom: 6,
    minHeight: 105,
    justifyContent: 'space-between',
    ...Shadows.sm,
  },
  drawerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drawerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    flex: 1,
    minWidth: 0,
  },
  drawerSmallIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerStripLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  drawerStripCashOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  drawerStripCashOutText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  drawerBottomArea: {
    marginTop: 10,
    gap: 4,
  },
  drawerAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  drawerStripAmount: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  expDeductedPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  expDeductedText: {
    fontSize: 11,
    fontWeight: '700',
  },
  drawerFormulaSub: {
    fontSize: 11.5,
    fontWeight: '500',
  },

  // Day-0 Setup Card
  setupCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginTop: 6,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
    ...Shadows.sm,
  },
  setupCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  setupIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setupTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  setupSubtitle: {
    fontSize: 11.5,
    marginTop: 2,
  },
  setupBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  setupBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#059669',
  },
  setupStepBox: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  setupStepTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepNumBubble: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  stepTitle: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  stepDesc: {
    fontSize: 11,
    marginTop: 1,
    lineHeight: 15,
  },
  stepButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  loadStaplesBtn: {
    flex: 1.6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.md,
  },
  loadStaplesText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  customProductBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  customProductText: {
    fontSize: 12,
    fontWeight: '700',
  },
  stepActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  stepActionText: {
    fontSize: 12,
    fontWeight: '700',
  },
  dismissBtn: {
    padding: 4,
    marginLeft: Spacing.xs,
  },
  progressBarTrack: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  stepDoneBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  stepDoneText: {
    fontSize: 11,
    fontWeight: '800',
  },
});
