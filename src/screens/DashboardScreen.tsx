import React, { useCallback, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image, ImageSource } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';
import { triggerCloudBackupFlow } from '@/utils/backupAction';
import { formatCompactPrice } from '@/utils/formatters';
import { getPaymentBreakdown } from '@/utils/payment';
import {
  FeatureCarousel,
  FeatureSlideAction,
} from '@/components/FeatureCarousel';
import { HeroStatsCard } from '@/components/HeroStatsCard';
import { SalesChart } from '@/components/SalesChart';

interface QuickTileConfig {
  id: string;
  title: string;
  subtitle: string;
  subtitleColor: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  cardBg: string;
  cardBorder: string;
  bgImage: ImageSource;
  accentBarColor: string;
  alertBadge?: string;
  accessibilityLabel: string;
  onPress: () => void;
}

/**
 * Clean Home Hub tailored for small shopkeepers:
 * 1. Read-Only Emerald Summary Info Card (Today's Sales + Bill count)
 * 2. Hero Action Duo Row (Big New Bill + Khata)
 * 3. Symmetric 3-Card Quick Action Row (Items, All Bills, Reports)
 * 4. Animated 4-slide Feature Highlights Carousel
 */
export const DashboardScreen: React.FC = () => {
  const {
    todaySalesTotal,
    todayProfit,
    products,
    sales,
    khata,
    totalUdhaarReceivable,
    lowStockProducts,
    outOfStockProducts,
    totalInventoryInvestment,
    totalInventoryRetailValue,
    totalExpectedStockProfit,
    totalLifetimeEarnings,
    totalLifetimeProfit,
    totalInventoryUnits,
    settings,
    setActiveTab,
    setIsAuthModalOpen,
    user,
    isOnline,
    pendingSyncCount,
    syncNow,
    t,
    language,
    showAlert,
  } = useShop();

  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const isUrdu = language === 'ur';
  const softBorder = settings.darkMode
    ? 'rgba(255,255,255,0.09)'
    : 'rgba(148, 163, 184, 0.22)';

  const [isReportsOpen, setIsReportsOpen] = useState(false);

  const { todaySalesCount, todayCashTotal, todayUdhaarTotal } = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    let count = 0;
    let cashSum = 0;
    let udhaarSum = 0;

    for (const s of sales) {
      if (s.status === 'refunded' || s.status === 'cancelled') continue;
      if (new Date(s.date) < start) continue;
      count += 1;
      const { cleanPaid, baki } = getPaymentBreakdown(s);
      cashSum += cleanPaid;
      udhaarSum += baki;
    }

    return {
      todaySalesCount: count,
      todayCashTotal: cashSum,
      todayUdhaarTotal: udhaarSum,
    };
  }, [sales]);

  const todayDateLabel = useMemo(() => {
    return new Date().toLocaleDateString(isUrdu ? 'ur-PK' : 'en-US', {
      day: 'numeric',
      month: 'short',
    });
  }, [isUrdu]);

  const pendingKhataCount = useMemo(() => {
    return (khata || []).filter((c) => (c.totalDebt ?? c.balance ?? 0) > 0).length;
  }, [khata]);

  const stockAlertsCount = lowStockProducts.length + outOfStockProducts.length;

  const handleBackupPress = useCallback(() => {
    void triggerCloudBackupFlow({
      user,
      isOnline,
      pendingSyncCount,
      isUrdu,
      setIsAuthModalOpen,
      syncNow,
      showAlert,
    });
  }, [user, isOnline, isUrdu, pendingSyncCount, syncNow, showAlert, setIsAuthModalOpen]);

  const infoCardBg = settings.darkMode ? '#082925' : '#C9F3E1';
  const infoCardBorder = settings.darkMode
    ? 'rgba(52, 211, 153, 0.32)'
    : 'rgba(5, 150, 105, 0.34)';
  const primarySaleBg = settings.darkMode ? '#046C4E' : '#045E44';
  const khataHeroBg = settings.darkMode ? '#9F1239' : '#BE123C';
  const khataHeroBorder = settings.darkMode
    ? 'rgba(251, 113, 133, 0.36)'
    : 'rgba(253, 164, 175, 0.48)';

  const quickTiles: QuickTileConfig[] = useMemo(
    () => [
      {
        id: 'items',
        title: isUrdu ? 'سامان' : 'Items',
        subtitle:
          stockAlertsCount > 0
            ? isUrdu
              ? `${stockAlertsCount} کم اسٹاک`
              : `${stockAlertsCount} low`
            : `${products.length} ${isUrdu ? 'اسٹاک' : 'items'}`,
        subtitleColor: stockAlertsCount > 0
          ? settings.darkMode ? '#FBBF24' : '#B45309'
          : theme.textMuted,
        icon: 'cube-outline',
        iconColor: settings.darkMode ? '#38BDF8' : '#0284C7',
        iconBg: settings.darkMode ? 'rgba(56, 189, 248, 0.18)' : '#E0F2FE',
        cardBg: settings.darkMode ? '#0F1C2E' : '#F3F9FF',
        cardBorder: settings.darkMode
          ? 'rgba(56, 189, 248, 0.28)'
          : 'rgba(2, 132, 199, 0.24)',
        bgImage: settings.darkMode
          ? require('../../assets/images/tile-items-dark.jpg')
          : require('../../assets/images/tile-items-light.jpg'),
        accentBarColor: settings.darkMode ? '#38BDF8' : '#0284C7',
        alertBadge: stockAlertsCount > 0 ? `${stockAlertsCount}!` : undefined,
        accessibilityLabel: isUrdu ? 'سامان و اسٹاک' : 'Items and stock',
        onPress: () => setActiveTab('products'),
      },
      {
        id: 'bills',
        title: isUrdu ? 'تمام بلز' : 'All Bills',
        subtitle: `${sales.length} ${isUrdu ? 'محفوظ' : 'saved'}`,
        subtitleColor: theme.textMuted,
        icon: 'receipt-outline',
        iconColor: settings.darkMode ? '#A5B4FC' : '#4F46E5',
        iconBg: settings.darkMode ? 'rgba(129, 140, 248, 0.16)' : '#EEF2FF',
        cardBg: settings.darkMode ? '#13192B' : '#F8F9FF',
        cardBorder: settings.darkMode
          ? 'rgba(129, 140, 248, 0.18)'
          : 'rgba(79, 70, 229, 0.15)',
        bgImage: settings.darkMode
          ? require('../../assets/images/tile-bills-dark.jpg')
          : require('../../assets/images/tile-bills-light.jpg'),
        accentBarColor: settings.darkMode ? '#818CF8' : '#6366F1',
        accessibilityLabel: isUrdu ? 'تمام بلز' : 'All bills',
        onPress: () => setActiveTab('history'),
      },
      {
        id: 'reports',
        title: isUrdu ? 'رپورٹس' : 'Reports',
        subtitle:
          totalLifetimeEarnings > 0
            ? `+${Math.round((totalLifetimeProfit / totalLifetimeEarnings) * 100)}% ${isUrdu ? 'منافع' : 'net'}`
            : isUrdu
              ? 'منافع و گراف'
              : 'Profit',
        subtitleColor: totalLifetimeEarnings > 0 ? theme.success : theme.textMuted,
        icon: 'bar-chart-outline',
        iconColor: settings.darkMode ? '#2DD4BF' : '#0F766E',
        iconBg: settings.darkMode ? 'rgba(13, 148, 136, 0.18)' : '#CCFBF1',
        cardBg: settings.darkMode ? '#0F1E22' : '#F4FBF9',
        cardBorder: settings.darkMode
          ? 'rgba(45, 212, 191, 0.18)'
          : 'rgba(15, 118, 110, 0.14)',
        bgImage: settings.darkMode
          ? require('../../assets/images/tile-reports-dark.jpg')
          : require('../../assets/images/tile-reports-light.jpg'),
        accentBarColor: settings.darkMode ? '#2DD4BF' : '#0F766E',
        accessibilityLabel: isUrdu ? 'رپورٹس اور منافع' : 'Profit and reports',
        onPress: () => setIsReportsOpen(true),
      },
    ],
    [
      isUrdu,
      stockAlertsCount,
      products.length,
      sales.length,
      totalLifetimeEarnings,
      totalLifetimeProfit,
      settings.darkMode,
      theme.textMuted,
      theme.success,
      setActiveTab,
    ]
  );

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* 1. Read-Only Today's Sales KPI Info Banner (~140px balanced height with clean light/dark bg art) */}
        <View
          style={[
            styles.salesInfoCard,
            { backgroundColor: infoCardBg, borderColor: infoCardBorder },
          ]}>
          <Image
            source={
              settings.darkMode
                ? require('../../assets/images/hero-billing-bg.jpg')
                : require('../../assets/images/top-sales-info-light.jpg')
            }
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
          {settings.darkMode ? (
            <View pointerEvents="none" style={styles.infoDarkScrim} />
          ) : null}

          <View style={styles.heroTopRow}>
            <View style={styles.heroLabelGroup}>
              <View style={styles.heroLiveDot} />
              <Text
                style={[
                  styles.heroEyebrow,
                  { color: settings.darkMode ? '#6EE7B7' : '#047857' },
                ]}>
                {isUrdu ? 'آج کی سیل' : "TODAY'S SALES"}
              </Text>
            </View>

            <View
              style={[
                styles.heroBillsPill,
                {
                  backgroundColor: settings.darkMode
                    ? 'rgba(16, 185, 129, 0.16)'
                    : 'rgba(255, 255, 255, 0.86)',
                  borderColor: settings.darkMode
                    ? 'rgba(52, 211, 153, 0.28)'
                    : 'rgba(5, 150, 105, 0.24)',
                },
              ]}>
              <Text
                style={[
                  styles.heroBillsText,
                  { color: settings.darkMode ? '#A7F3D0' : '#065F46' },
                ]}>
                {todayDateLabel} · {todaySalesCount}{' '}
                {isUrdu
                  ? 'بلز'
                  : todaySalesCount === 1
                    ? 'bill'
                    : 'bills'}
              </Text>
            </View>
          </View>

          <View style={styles.heroAmountRow}>
            <Text
              style={[
                styles.heroCurrency,
                { color: settings.darkMode ? '#34D399' : '#059669' },
              ]}>
              {settings.currencySymbol}
            </Text>
            <Text
              style={[
                styles.heroAmount,
                { color: settings.darkMode ? '#F8FAFC' : '#064E3B' },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.65}>
              {todaySalesTotal.toLocaleString()}
            </Text>
          </View>

          <View
            style={[
              styles.infoDivider,
              {
                backgroundColor: settings.darkMode
                  ? 'rgba(52, 211, 153, 0.16)'
                  : 'rgba(6, 78, 59, 0.14)',
              },
            ]}
          />

          {/* Compact Cash / Udhaar / Profit summary strip to preserve balanced height */}
          <View style={styles.infoMetricsRow}>
            <View style={styles.infoMetricItem}>
              <Text
                style={[
                  styles.infoMetricLabel,
                  { color: settings.darkMode ? theme.textMuted : '#1E4638' },
                ]}>
                {isUrdu ? 'نقد وصول' : 'Cash'}
              </Text>
              <Text style={[styles.infoMetricValue, { color: theme.text }]} numberOfLines={1}>
                {settings.currencySymbol} {todayCashTotal.toLocaleString()}
              </Text>
            </View>

            <View
              style={[
                styles.infoMetricSep,
                {
                  backgroundColor: settings.darkMode
                    ? softBorder
                    : 'rgba(6, 78, 59, 0.14)',
                },
              ]}
            />

            <View style={styles.infoMetricItem}>
              <Text
                style={[
                  styles.infoMetricLabel,
                  { color: settings.darkMode ? theme.textMuted : '#1E4638' },
                ]}>
                {isUrdu ? 'ادھار' : 'On Udhaar'}
              </Text>
              <Text
                style={[
                  styles.infoMetricValue,
                  { color: todayUdhaarTotal > 0 ? theme.danger : theme.text },
                ]}
                numberOfLines={1}>
                {settings.currencySymbol} {todayUdhaarTotal.toLocaleString()}
              </Text>
            </View>

            <View
              style={[
                styles.infoMetricSep,
                {
                  backgroundColor: settings.darkMode
                    ? softBorder
                    : 'rgba(6, 78, 59, 0.14)',
                },
              ]}
            />

            <View style={styles.infoMetricItem}>
              <Text
                style={[
                  styles.infoMetricLabel,
                  { color: settings.darkMode ? theme.textMuted : '#1E4638' },
                ]}>
                {isUrdu ? 'منافع' : 'Profit'}
              </Text>
              <Text
                style={[
                  styles.infoMetricValue,
                  { color: todayProfit > 0 ? theme.success : theme.text },
                ]}
                numberOfLines={1}>
                {settings.currencySymbol} {todayProfit.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* 2. Dominant Hero Action Duo: #1 New Bill (larger emerald artwork) | #2 Khata (rich coral artwork) */}
        <View style={styles.heroDuoRow}>
          <Pressable
            onPress={() => setActiveTab('sale')}
            accessibilityRole="button"
            accessibilityLabel={isUrdu ? 'نیا بل بنائیں' : 'Start a new bill'}
            style={({ pressed }) => [
              styles.duoCard,
              styles.newBillDuoCard,
              { backgroundColor: primarySaleBg },
              pressed && styles.cardPressed,
            ]}>
            <Image
              source={require('../../assets/images/new-bill-card-bg.jpg')}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
            />
            {settings.darkMode ? (
              <View pointerEvents="none" style={styles.heroCardDarkGlaze} />
            ) : null}

            <View style={styles.duoTopRow}>
              <View style={styles.newBillIconBox}>
                <Ionicons name="calculator" size={22} color="#FFFFFF" />
              </View>
              <View style={styles.newBillArrowCircle}>
                <Ionicons
                  name={isUrdu ? 'arrow-back' : 'arrow-forward'}
                  size={16}
                  color="#064E3B"
                />
              </View>
            </View>
            <View style={styles.duoTextCol}>
              <Text style={styles.newBillTitle} numberOfLines={1}>
                {isUrdu ? 'نیا بل' : 'New Bill'}
              </Text>
              <Text style={styles.newBillSub} numberOfLines={1}>
                {isUrdu ? 'تیز نقد یا ادھار' : 'Fast cash & udhaar'}
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('khata')}
            accessibilityRole="button"
            accessibilityLabel={isUrdu ? 'ادھار کھاتہ' : 'Open Khata'}
            style={({ pressed }) => [
              styles.duoCard,
              styles.khataDuoCard,
              {
                backgroundColor: khataHeroBg,
                borderColor: khataHeroBorder,
              },
              pressed && styles.cardPressed,
            ]}>
            <Image
              source={require('../../assets/images/khata-card-bg.jpg')}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
            />
            {settings.darkMode ? (
              <View pointerEvents="none" style={styles.heroCardDarkGlaze} />
            ) : null}

            <View style={styles.duoTopRow}>
              <View style={styles.khataDuoIconBox}>
                <Ionicons name="book" size={21} color="#FFFFFF" />
              </View>
              {pendingKhataCount > 0 ? (
                <View style={styles.khataDueBadge}>
                  <Text style={styles.khataDueText}>
                    {pendingKhataCount} {isUrdu ? 'باقی' : 'due'}
                  </Text>
                </View>
              ) : (
                <View style={styles.khataArrowCircle}>
                  <Ionicons
                    name={isUrdu ? 'chevron-back' : 'chevron-forward'}
                    size={15}
                    color="#FFFFFF"
                  />
                </View>
              )}
            </View>
            <View style={styles.duoTextCol}>
              <Text style={styles.khataDuoTitle} numberOfLines={1}>
                {isUrdu ? 'ادھار کھاتہ' : 'Khata'}
              </Text>
              <Text style={styles.khataDuoSub} numberOfLines={1}>
                {totalUdhaarReceivable > 0
                  ? `${settings.currencySymbol} ${totalUdhaarReceivable.toLocaleString()}`
                  : isUrdu
                    ? 'سب حساب صاف'
                    : 'All settled'}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* 3. Architectural 3-Card Secondary Row (#3 Items -> #4 All Bills -> #5 Reports) */}
        <View style={styles.quickRow3}>
          {quickTiles.map((tile) => (
            <Pressable
              key={tile.id}
              onPress={tile.onPress}
              accessibilityRole="button"
              accessibilityLabel={tile.accessibilityLabel}
              style={({ pressed }) => [
                styles.quickRow3Card,
                { backgroundColor: tile.cardBg, borderColor: tile.cardBorder },
                pressed && styles.cardPressed,
              ]}>
              <Image
                source={tile.bgImage}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
                transition={180}
              />

              <View style={styles.quickRow3Top}>
                <View style={[styles.quickRow3IconBox, { backgroundColor: tile.iconBg }]}>
                  <Ionicons name={tile.icon} size={15} color={tile.iconColor} />
                </View>

                {tile.alertBadge ? (
                  <View
                    style={[
                      styles.quickRow3AlertPill,
                      {
                        backgroundColor: settings.darkMode
                          ? 'rgba(251, 191, 36, 0.22)'
                          : '#FEF3C7',
                      },
                    ]}>
                    <Text
                      style={[
                        styles.quickRow3AlertText,
                        { color: settings.darkMode ? '#FBBF24' : '#B45309' },
                      ]}>
                      {tile.alertBadge}
                    </Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.quickRow3Copy}>
                <Text style={[styles.quickRow3Title, { color: theme.text }]} numberOfLines={1}>
                  {tile.title}
                </Text>
                <Text
                  style={[styles.quickRow3Sub, { color: tile.subtitleColor }]}
                  numberOfLines={1}>
                  {tile.subtitle}
                </Text>
              </View>

              <View
                pointerEvents="none"
                style={[styles.quickRow3AccentBar, { backgroundColor: tile.accentBarColor }]}
              />
            </Pressable>
          ))}
        </View>

        {/* 5. Animated App Feature Highlights Carousel */}
        <FeatureCarousel
          isDark={settings.darkMode}
          isUrdu={isUrdu}
          onSelectAction={(action: FeatureSlideAction) => {
            if (action.type === 'backup') {
              handleBackupPress();
            } else {
              setActiveTab(action.tab);
            }
          }}
        />
      </ScrollView>

      {/* Profit & Stock Reports Modal */}
      <Modal
        visible={isReportsOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsReportsOpen(false)}>
        <SafeAreaView style={[styles.modalRoot, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: softBorder, backgroundColor: theme.card }]}>
            <Pressable
              onPress={() => setIsReportsOpen(false)}
              hitSlop={8}
              style={[styles.modalBackBtn, { backgroundColor: theme.surfaceSubtle, borderColor: softBorder }]}>
              <Ionicons name={isUrdu ? 'arrow-forward' : 'arrow-back'} size={18} color={theme.text} />
              <Text style={[styles.modalBackText, { color: theme.text }]}>
                {isUrdu ? 'بند کریں' : 'Close'}
              </Text>
            </Pressable>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {isUrdu ? 'رپورٹس اور منافع' : 'Profit & Stock Report'}
            </Text>
            <View style={{ width: 72 }} />
          </View>

          <ScrollView contentContainerStyle={styles.reportsModalContent}>
            <HeroStatsCard
              bgImage={
                settings.darkMode
                  ? require('../../assets/images/tile-reports-dark.jpg')
                  : require('../../assets/images/tile-reports-light.jpg')
              }
              isDark={settings.darkMode}
              fallbackBg={settings.darkMode ? '#0A2E2A' : '#F0FDFA'}
              borderColor={
                settings.darkMode
                  ? 'rgba(45,212,191,0.3)'
                  : 'rgba(13,148,136,0.22)'
              }
              dotColor={settings.darkMode ? '#2DD4BF' : '#0F766E'}
              eyebrow={isUrdu ? 'کاروباری خلاصہ' : 'BUSINESS REPORT'}
              eyebrowColor={settings.darkMode ? '#5EEAD4' : '#0F766E'}
              pillText={`${sales.filter((s) => s.status !== 'refunded' && s.status !== 'cancelled').length} ${isUrdu ? 'بلز' : 'bills'}`}
              currencySymbol={settings.currencySymbol}
              currencyColor={settings.darkMode ? '#2DD4BF' : '#0F766E'}
              heroValue={totalLifetimeEarnings.toLocaleString()}
              metrics={[
                {
                  label: isUrdu ? 'کل منافع' : 'Profit',
                  value: `${settings.currencySymbol}${formatCompactPrice(totalLifetimeProfit)}`,
                  valueColor: settings.darkMode ? '#34D399' : '#047857',
                },
                {
                  label: isUrdu ? 'مارجن' : 'Margin',
                  value: `${
                    totalLifetimeEarnings > 0
                      ? ((totalLifetimeProfit / totalLifetimeEarnings) * 100).toFixed(1)
                      : '0.0'
                  }%`,
                },
                {
                  label: isUrdu ? 'اسٹاک مالیت' : 'Stock Val',
                  value: `${settings.currencySymbol}${formatCompactPrice(totalInventoryRetailValue)}`,
                },
              ]}
            />

            <SalesChart sales={sales} />

            <View style={[styles.financeCard, { backgroundColor: theme.card, borderColor: softBorder }]}>
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
            </View>

            <View style={[styles.financeCard, { backgroundColor: theme.card, borderColor: softBorder }]}>
              <View style={styles.financeCardHeader}>
                <Text style={[styles.financeCardTitle, { color: theme.textSecondary }]}>
                  {t('totalStoreEarnings')}
                </Text>
                <Text style={[styles.financeBadgeText, { color: '#0284C7' }]}>
                  {sales.filter((s) => s.status !== 'refunded' && s.status !== 'cancelled').length}{' '}
                  {isUrdu ? 'بلز' : 'sales'}
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
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 4,
    paddingBottom: Spacing.lg,
    maxWidth: 720,
    width: '100%',
    marginHorizontal: 'auto',
    gap: 12,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.975 }],
  },

  // 1. Read-Only Today's Sales KPI Info Banner (~140px balanced height)
  salesInfoCard: {
    borderRadius: 22,
    borderCurve: 'continuous',
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 14,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 138,
    justifyContent: 'space-between',
    gap: 8,
  },
  infoDarkScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(6, 44, 38, 0.38)',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  heroLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  heroEyebrow: {
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  heroCurrency: {
    fontSize: 20,
    fontWeight: '800',
  },
  heroAmount: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
    flexShrink: 1,
  },
  heroBillsPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  heroBillsText: {
    fontSize: 11.5,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  infoDivider: {
    height: 1,
    width: '100%',
  },
  infoMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoMetricItem: {
    flex: 1,
    gap: 2,
  },
  infoMetricLabel: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  infoMetricValue: {
    fontSize: 13,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  infoMetricSep: {
    width: 1,
    height: 24,
    marginHorizontal: 10,
  },

  // 2. Hero Duo Row: #1 Dominant New Bill (emerald artwork) + #2 Khata (coral artwork)
  heroDuoRow: {
    flexDirection: 'row',
    gap: 10,
  },
  duoCard: {
    minHeight: 136,
    borderRadius: 22,
    borderCurve: 'continuous',
    borderWidth: 1,
    padding: 15,
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
  },
  newBillDuoCard: {
    flex: 1.18,
    borderColor: 'rgba(52, 211, 153, 0.45)',
  },
  khataDuoCard: {
    flex: 0.96,
  },
  heroCardDarkGlaze: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 16, 12, 0.22)',
  },
  duoTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  newBillIconBox: {
    width: 42,
    height: 42,
    borderRadius: 13,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newBillArrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  duoTextCol: {
    gap: 2,
  },
  newBillTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  newBillSub: {
    color: '#D1FAE5',
    fontSize: 12,
    fontWeight: '600',
  },
  khataDuoIconBox: {
    width: 42,
    height: 42,
    borderRadius: 13,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  khataDueBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
  },
  khataDueText: {
    color: '#BE123C',
    fontSize: 11,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  khataArrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  khataDuoTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  khataDuoSub: {
    color: '#FFE4E6',
    fontSize: 12.5,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },

  // 3. Architectural 3-Card Secondary Row (#3 Items -> #4 All Bills -> #5 Reports)
  quickRow3: {
    flexDirection: 'row',
    gap: 10,
  },
  quickRow3Card: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 10,
    borderRadius: 19,
    borderCurve: 'continuous',
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingTop: 11,
    paddingBottom: 11,
    minHeight: 112,
    overflow: 'hidden',
    position: 'relative',
  },
  quickRow3Top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 5,
  },
  quickRow3IconBox: {
    width: 28,
    height: 28,
    borderRadius: 9,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickRow3AlertPill: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 7,
  },
  quickRow3AlertText: {
    fontSize: 10,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  quickRow3Copy: {
    gap: 1.5,
  },
  quickRow3Title: {
    fontSize: 13.5,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  quickRow3Sub: {
    fontSize: 11.5,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  quickRow3AccentBar: {
    width: 22,
    height: 2.5,
    borderRadius: 2,
    opacity: 0.75,
  },

  modalRoot: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  modalBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
  },
  modalBackText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  modalTitle: {
    fontSize: 16.5,
    fontWeight: '800',
  },
  reportsModalContent: {
    padding: Spacing.lg,
    gap: 14,
    maxWidth: 720,
    width: '100%',
    marginHorizontal: 'auto',
  },
  financeCard: {
    padding: 16,
    borderRadius: 20,
    borderCurve: 'continuous',
    borderWidth: 1,
  },
  financeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  financeCardTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  financeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  financeMainAmount: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 6,
    fontVariant: ['tabular-nums'],
  },
  financeDivider: {
    height: 1,
    width: '100%',
    marginVertical: 10,
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
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});
