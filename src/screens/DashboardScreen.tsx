import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useShop } from '@/context/ShopContext';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusBadge } from '@/components/ui/StatusBadge';

export const DashboardScreen: React.FC = () => {
  const {
    todaySalesTotal,
    todayOrdersCount,
    lowStockProducts,
    outOfStockProducts,
    products,
    sales,
    totalUdhaarReceivable,
    settings,
    setActiveTab,
    setActiveReceipt,
    setIsAddProductOpen,
    t,
    language,
  } = useShop();

  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const recentSales = sales.slice(0, 5);

  const getPayColor = (method: string) => {
    if (method === 'cash') return theme.success;
    if (method === 'online') return theme.secondary;
    return theme.danger;
  };

  return (
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
              {settings.ownerName}
            </Text>
            <Text style={styles.heroShop} numberOfLines={1}>
              {language === 'ur' && settings.shopNameUrdu ? settings.shopNameUrdu : settings.shopName}
            </Text>
            {settings.businessType ? (
              <Text style={styles.heroBusinessType} numberOfLines={1}>
                🏷️ {settings.businessType} {settings.city ? `• 📍 ${settings.city}` : ''}
              </Text>
            ) : null}
          </View>

          <Pressable
            onPress={() => setActiveTab('settings')}
            style={({ pressed }) => [
              styles.heroRight,
              pressed && { opacity: 0.85, transform: [{ scale: 0.95 }] },
            ]}>
            <View style={[styles.heroIconCircle, { backgroundColor: 'rgba(255,255,255,0.12)' }]}>
              {settings.profileImage ? (
                <Image source={{ uri: settings.profileImage }} style={styles.heroAvatarImg} />
              ) : (
                <Ionicons name="storefront" size={30} color="rgba(255,255,255,0.9)" />
              )}
            </View>
          </Pressable>
        </View>

        <Pressable
          onPress={() => setActiveTab('sale')}
          style={({ pressed }) => [
            styles.heroCTA,
            pressed && { opacity: 0.88, transform: [{ scale: 0.97 }] },
          ]}>
          <Ionicons name="cart" size={16} color={theme.heroBg} />
          <Text style={[styles.heroCTAText, { color: theme.heroBg }]}>{t('newBillBtn')}</Text>
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

      {/* ── Quick Actions ── */}
      <SectionHeader title={t('quickActions')} />

      <View style={styles.quickGrid}>
        {[
          { label: t('newBillBtn'), icon: 'cart' as const, color: theme.primary, onPress: () => setActiveTab('sale') },
          { label: t('addProductBtn'), icon: 'add-circle' as const, color: theme.secondary, onPress: () => setIsAddProductOpen(true) },
          { label: t('khataBtn'), icon: 'book' as const, color: theme.accent, onPress: () => setActiveTab('khata') },
          { label: t('history'), icon: 'time' as const, color: '#7C3AED', onPress: () => setActiveTab('history') },
        ].map((tile) => (
          <Pressable
            key={tile.label}
            onPress={tile.onPress}
            style={({ pressed }) => [
              styles.quickTile,
              { backgroundColor: tile.color },
              pressed && { transform: [{ scale: 0.96 }], opacity: 0.92 },
            ]}>
            <View style={styles.quickTileShine} />
            <View style={[styles.quickTileIconWrap, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
              <Ionicons name={tile.icon} size={26} color="#FFFFFF" />
            </View>
            <Text style={styles.quickTileText}>{tile.label}</Text>
          </Pressable>
        ))}
      </View>

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
          actionLabel={t('newBillBtn')}
          onAction={() => setActiveTab('sale')}
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
                    {s.customerName || 'Cash Sale'}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: Spacing.lg,
    paddingBottom: 110,
    maxWidth: 720,
    marginHorizontal: 'auto',
    width: '100%',
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
    marginBottom: Spacing.xl,
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

  // Metrics Grid
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
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
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  quickTile: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: Spacing.xl,
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
});
