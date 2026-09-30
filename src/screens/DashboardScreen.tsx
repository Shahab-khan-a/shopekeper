import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Modal,
  Animated,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SaleScreen } from '@/screens/SaleScreen';
import { useShop } from '@/context/ShopContext';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProductImage } from '@/components/ProductImage';

export const DashboardScreen: React.FC = () => {
  const {
    todaySalesTotal,
    todayOrdersCount,
    lowStockProducts,
    outOfStockProducts,
    products,
    sales,
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
    loadDemoData,
  } = useShop();

  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const recentSales = sales.slice(0, 5);

  // In-home Sale Modal
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);

  const handleLoadDemo = async () => {
    const msg = language === 'ur'
      ? 'کیا آپ فائر بیس فائر اسٹور (Firebase Firestore) پر سیمپل ٹیسٹ ڈیٹا (پروڈکٹس، سیلز ہسٹری، کھاتہ کسٹمرز) اپ لوڈ کرنا چاہتے ہیں؟'
      : 'Push sample test data (products, sales history, and Khata customers) directly to Firebase Firestore?';
    
    const confirm = Platform.OS === 'web'
      ? window.confirm(msg)
      : await new Promise<boolean>((resolve) => {
          Alert.alert(
            language === 'ur' ? 'فائر بیس ڈیٹا اپ لوڈ کریں' : 'Push Firebase Test Data',
            msg,
            [
              { text: t('cancel'), onPress: () => resolve(false), style: 'cancel' },
              { text: language === 'ur' ? 'ہاں، اپ لوڈ کریں' : 'Yes, Push to Firebase', onPress: () => resolve(true) },
            ]
          );
        });

    if (!confirm) return;

    setIsLoadingDemo(true);
    try {
      await loadDemoData();
      const successMsg = language === 'ur'
        ? 'سیمپل ٹیسٹ ڈیٹا کامیابی سے فائر بیس پر اپ لوڈ ہو گیا ہے!'
        : 'Demo test data pushed to Firebase Firestore & synced successfully!';
      if (Platform.OS === 'web') window.alert(successMsg);
      else Alert.alert('Success', successMsg);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsLoadingDemo(false);
    }
  };

  // Pulse animation for floating New Sale button
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.35],
  });

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 0.45, 1],
    outputRange: [0.5, 0.2, 0],
  });

  // W2-5: Day-end summary modal
  const [showDayEnd, setShowDayEnd] = useState(false);
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const todaySales = sales.filter((s) => new Date(s.date) >= todayStart && !s.refundedAt);
  const todayCash = todaySales.filter((s) => s.paymentMethod === 'cash').reduce((a, b) => a + b.grandTotal, 0);
  const todayOnline = todaySales.filter((s) => s.paymentMethod === 'online').reduce((a, b) => a + b.grandTotal, 0);
  const todayUdhaar = todaySales.filter((s) => s.paymentMethod === 'udhaar').reduce((a, b) => a + b.grandTotal, 0);
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

      {/* ── Hero Welcome Banner ── */}
      <View style={[styles.heroBanner, { backgroundColor: theme.heroBg }]}>
        <View style={[styles.heroGlowLayer, { backgroundColor: theme.heroLayer }]} />

        <View style={styles.heroContent}>
          <View style={styles.heroLeft}>
            <Text style={styles.heroGreet}>
              {language === 'ur' ? '👋 خوش آمدید' : '👋 Welcome back,'}
            </Text>
            <Text style={styles.heroOwner} numberOfLines={1}>
              {settings.ownerName || user?.displayName || (language === 'ur' ? 'معزز دکاندار' : 'Valued Shopkeeper')}
            </Text>
            <Text style={styles.heroShop} numberOfLines={1}>
              {language === 'ur' && settings.shopNameUrdu
                ? settings.shopNameUrdu
                : (settings.shopName || (user?.displayName ? `${user.displayName}'s Store` : (language === 'ur' ? 'میری دکان' : 'My Store')))}
            </Text>

          </View>

          <Pressable
            onPress={() => setActiveTab('settings')}
            style={({ pressed }) => [
              styles.heroRight,
              pressed && { opacity: 0.85, transform: [{ scale: 0.95 }] },
            ]}>
            <View style={[styles.heroIconCircle, { backgroundColor: 'rgba(255,255,255,0.12)' }]}>
              {settings.profileImage && !settings.profileImage.includes('googleusercontent.com/a/') ? (
                <ProductImage
                  uri={settings.profileImage}
                  style={styles.heroAvatarImg}
                  fallbackIcon={<Ionicons name="storefront" size={30} color="rgba(255,255,255,0.9)" />}
                />
              ) : (
                <Ionicons name="storefront" size={30} color="rgba(255,255,255,0.9)" />
              )}
            </View>
          </Pressable>
        </View>

        {/* 🧪 Demo Test Data Trigger Banner Button */}
        <Pressable
          onPress={handleLoadDemo}
          disabled={isLoadingDemo}
          style={({ pressed }) => [
            styles.demoDataBannerBtn,
            pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
          ]}>
          <Ionicons name="flask" size={14} color="#FFFFFF" />
          <Text style={styles.demoDataBannerBtnText}>
            {isLoadingDemo
              ? (language === 'ur' ? 'فائر بیس پر اپ لوڈ ہو رہا ہے...' : 'Pushing to Firebase...')
              : (language === 'ur' ? '⚡ فائر بیس سیمپل ڈیٹا اپ لوڈ کریں' : '⚡ Push Sample Data to Firebase')}
          </Text>
        </Pressable>
      </View>





      {/* ── Today's Metrics ── */}
      <View style={styles.metricsGrid}>
        {/* Today's Sales */}
        <View style={[styles.metricCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={[styles.metricAccentBar, { backgroundColor: theme.primary }]} />
          <View style={styles.metricBody}>
            <View style={[styles.metricIconWrap, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name="cash-outline" size={20} color={theme.primary} />
            </View>
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>{t('todaySales')}</Text>
            <Text style={[styles.metricValue, { color: theme.text }]}>
              {settings.currencySymbol} {todaySalesTotal.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Today's Orders */}
        <View style={[styles.metricCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={[styles.metricAccentBar, { backgroundColor: theme.secondary }]} />
          <View style={styles.metricBody}>
            <View style={[styles.metricIconWrap, { backgroundColor: theme.surfaceSubtle }]}>
              <Ionicons name="receipt-outline" size={20} color={theme.secondary} />
            </View>
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>{t('todayOrders')}</Text>
            <Text style={[styles.metricValue, { color: theme.text }]}>{todayOrdersCount}</Text>
          </View>
        </View>

        {/* Total Udhaar */}
        <Pressable
          onPress={() => setActiveTab('khata')}
          style={({ pressed }) => [
            styles.metricCard,
            { backgroundColor: theme.card, borderColor: theme.border },
            pressed && { opacity: 0.85 },
          ]}>
          <View style={[styles.metricAccentBar, { backgroundColor: theme.danger }]} />
          <View style={styles.metricBody}>
            <View style={[styles.metricIconWrap, { backgroundColor: theme.dangerLight }]}>
              <Ionicons name="book-outline" size={20} color={theme.danger} />
            </View>
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>{t('totalReceivable')}</Text>
            <Text style={[styles.metricValue, { color: theme.danger }]}>
              {settings.currencySymbol} {totalUdhaarReceivable.toLocaleString()}
            </Text>
          </View>
        </Pressable>

        {/* Total Inventory */}
        <Pressable
          onPress={() => setActiveTab('products')}
          style={({ pressed }) => [
            styles.metricCard,
            { backgroundColor: theme.card, borderColor: theme.border },
            pressed && { opacity: 0.85 },
          ]}>
          <View style={[styles.metricAccentBar, { backgroundColor: theme.warning }]} />
          <View style={styles.metricBody}>
            <View style={[styles.metricIconWrap, { backgroundColor: theme.warningLight }]}>
              <Ionicons name="cube-outline" size={20} color={theme.warning} />
            </View>
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>{t('totalInventory')}</Text>
            <Text style={[styles.metricValue, { color: theme.text }]}>{products.length}</Text>
          </View>
        </Pressable>
      </View>

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
        actionLabel={sales.length > 0 ? t('viewAll') : undefined}
        onAction={() => setActiveTab('history')}
      />

      {recentSales.length === 0 ? (
        <EmptyState
          icon="receipt-outline"
          title={t('noRecentSales')}
          subtitle={language === 'ur' ? 'پہلا بل بنانے کے لیے نیچے بٹن دبائیں' : 'Create your first bill to get started.'}
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

      {/* Day-End Modal */}
      <Modal visible={showDayEnd} transparent animationType="slide" onRequestClose={() => setShowDayEnd(false)}>
        <Pressable style={styles.dayEndOverlay} onPress={() => setShowDayEnd(false)}>
          <Pressable style={[styles.dayEndModal, { backgroundColor: theme.surface }]} onPress={(e) => e.stopPropagation()}>
            <View style={[styles.dayEndModalHeader, { borderBottomColor: theme.border }]}>
              <View style={styles.dayEndModalTitleRow}>
                <Ionicons name="moon" size={20} color={theme.primary} />
                <Text style={[styles.dayEndModalTitle, { color: theme.text }]}>
                  {language === 'ur' ? 'آج کا خلاصہ' : "Today's Summary"}
                </Text>
              </View>
              <Pressable onPress={() => setShowDayEnd(false)} style={styles.dayEndClose}>
                <Ionicons name="close" size={22} color={theme.textSecondary} />
              </Pressable>
            </View>
            <View style={styles.dayEndBody}>
              {[
                { label: language === 'ur' ? 'کل بل' : 'Total Bills', value: `${todaySales.length}`, icon: 'receipt-outline', color: theme.primary },
                { label: language === 'ur' ? 'نقد وصول' : 'Cash Collected', value: `${settings.currencySymbol}${todayCash.toLocaleString()}`, icon: 'cash-outline', color: theme.success },
                { label: language === 'ur' ? 'آن لائن' : 'Online', value: `${settings.currencySymbol}${todayOnline.toLocaleString()}`, icon: 'phone-portrait-outline', color: theme.secondary },
                { label: language === 'ur' ? 'ادھار دیا' : 'Udhaar Given', value: `${settings.currencySymbol}${todayUdhaar.toLocaleString()}`, icon: 'book-outline', color: theme.danger },
                { label: language === 'ur' ? 'تخمینی منافع' : 'Est. Profit', value: `${settings.currencySymbol}${Math.max(0, todayGrossProfit).toLocaleString()}`, icon: 'trending-up-outline', color: theme.success },
              ].map((row) => (
                <View key={row.label} style={[styles.dayEndRow, { borderBottomColor: theme.border }]}>
                  <View style={[styles.dayEndRowIcon, { backgroundColor: row.color + '20' }]}>
                    <Ionicons name={row.icon as any} size={16} color={row.color} />
                  </View>
                  <Text style={[styles.dayEndRowLabel, { color: theme.textSecondary }]}>{row.label}</Text>
                  <Text style={[styles.dayEndRowValue, { color: theme.text }]}>{row.value}</Text>
                </View>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>

    </ScrollView>

      {/* ── Floating Action Button (New Sale) with Pulse Effect ── */}
      <View style={styles.floatingFabWrapper} pointerEvents="box-none">
        <Animated.View
          pointerEvents="none"
          style={[
            styles.floatingSalePulse,
            {
              backgroundColor: settings.darkMode ? 'rgba(52, 211, 153, 0.28)' : '#A7F3D0',
              transform: [{ scale: pulseScale }],
              opacity: pulseOpacity,
            },
          ]}
        />
        <Pressable
          onPress={() => setIsSaleModalOpen(true)}
          accessibilityLabel={t('sale')}
          accessibilityRole="button"
          accessibilityHint="Open new sale window directly on home"
          style={({ pressed }) => [
            styles.floatingSaleFab,
            { backgroundColor: theme.primary },
            Shadows.xl,
            pressed && { transform: [{ scale: 0.94 }], opacity: 0.92 },
          ]}>
          <Ionicons name="cart" size={22} color="#FFFFFF" />
          <Text style={styles.floatingSaleFabText}>{t('sale')}</Text>
        </Pressable>
      </View>

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
    padding: Spacing.lg,
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
  floatingSalePulse: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: BorderRadius.full,
  },
  floatingSaleFab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.full,
    elevation: 8,
  },
  floatingSaleFabText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  saleModalContainer: {
    flex: 1,
  },

  // Hero Banner
  heroBanner: {
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  heroGlowLayer: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 160,
    height: 160,
    borderRadius: BorderRadius.full,
    opacity: 0.3,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 0,
  },
  heroLeft: { flex: 1, gap: 3 },
  heroGreet: { color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: '500' },
  heroOwner: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  heroShop: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' },
  heroBusinessType: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '500', marginTop: 2 },
  heroRight: { marginLeft: Spacing.md },
  heroIconCircle: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  heroAvatarImg: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
  },
  heroCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    ...Shadows.sm,
  },
  heroCTAText: { fontWeight: '800', fontSize: 13, letterSpacing: 0.2 },
  demoDataBannerBtn: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignSelf: 'flex-start',
  },
  demoDataBannerBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // Metrics Grid
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: Spacing.md,
    columnGap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  metricCard: {
    width: '48%',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  metricAccentBar: { height: 4, width: '100%' },
  metricBody: { padding: Spacing.md, gap: 4 },
  metricIconWrap: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  metricLabel: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  metricValue: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },

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
});
