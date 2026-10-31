import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PaymentMethod, Sale } from '@/types';
import { useShop } from '@/context/ShopContext';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterChip } from '@/components/ui/FilterChip';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCompactPrice } from '@/utils/formatters';
import { openWhatsAppReceipt, openWhatsAppWithMessage } from '@/utils/whatsapp';

type HistoryFilter = 'all' | 'today' | 'week' | 'month' | 'custom';
type PaymentFilter = 'all' | PaymentMethod;

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const formatDayChip = (d: Date) =>
  d.toLocaleDateString([], { month: 'short', day: 'numeric' });

export const HistoryScreen: React.FC = () => {
  const {
    sales,
    khata,
    refundSale,
    setActiveReceipt,
    setActiveTab,
    settings,
    t,
    language,
    showAlert,
  } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<HistoryFilter>('all');
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>('all');
  const [customDate, setCustomDate] = useState<Date>(new Date());
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const softBorder = settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(148,163,184,0.4)';
  const cardBg = settings.darkMode ? theme.card : '#FFFFFF';

  const recentDays = useMemo(() => {
    const days: Date[] = [];
    const now = new Date();
    for (let i = 0; i < 21; i++) {
      const d = new Date(now);
      d.setHours(12, 0, 0, 0);
      d.setDate(now.getDate() - i);
      days.push(d);
    }
    return days;
  }, []);

  const dateFilteredSales = useMemo(() => {
    const now = new Date();
    const todayYear = now.getFullYear();
    const todayMonth = now.getMonth();
    const todayDate = now.getDate();

    return sales.filter((sale) => {
      const matchSearch =
        sale.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sale.customerName &&
          sale.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (sale.customerPhone && sale.customerPhone.includes(searchQuery));

      if (!matchSearch) return false;

      const saleDate = new Date(sale.date);

      if (filter === 'today') {
        return (
          saleDate.getFullYear() === todayYear &&
          saleDate.getMonth() === todayMonth &&
          saleDate.getDate() === todayDate
        );
      }
      if (filter === 'week') {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return saleDate >= oneWeekAgo;
      }
      if (filter === 'month') {
        return saleDate.getFullYear() === todayYear && saleDate.getMonth() === todayMonth;
      }
      if (filter === 'custom') {
        return isSameDay(saleDate, customDate);
      }
      return true;
    });
  }, [sales, searchQuery, filter, customDate]);

  const paymentCounts = useMemo(() => {
    const counts = { all: dateFilteredSales.length, cash: 0, online: 0, udhaar: 0 };
    dateFilteredSales.forEach((s) => {
      if (s.paymentMethod === 'cash') counts.cash += 1;
      else if (s.paymentMethod === 'online') counts.online += 1;
      else if (s.paymentMethod === 'udhaar') counts.udhaar += 1;
    });
    return counts;
  }, [dateFilteredSales]);

  const filteredSales = useMemo(() => {
    if (paymentFilter === 'all') return dateFilteredSales;
    return dateFilteredSales.filter((s) => s.paymentMethod === paymentFilter);
  }, [dateFilteredSales, paymentFilter]);

  const { filterRevenue, filterProfit, completedCount, marginPct } = useMemo(() => {
    const activeSales = filteredSales.filter(
      (s) => s.status !== 'refunded' && s.status !== 'cancelled'
    );
    const rev = activeSales.reduce((sum, s) => sum + s.grandTotal, 0);
    const prof = activeSales.reduce((sum, s) => sum + (s.totalProfit || 0), 0);
    const margin = rev > 0 ? ((prof / rev) * 100).toFixed(1) : '0.0';
    return {
      filterRevenue: rev,
      filterProfit: prof,
      completedCount: activeSales.length,
      marginPct: margin,
    };
  }, [filteredSales]);

  const findCustomerDebt = (sale: Sale) => {
    if (sale.customerId) {
      const byId = khata.find((c) => c.id === sale.customerId);
      if (byId) return byId;
    }
    if (sale.customerPhone) {
      const phone = sale.customerPhone.replace(/[^0-9]/g, '');
      return khata.find((c) => c.phone?.replace(/[^0-9]/g, '') === phone);
    }
    if (sale.customerName) {
      return khata.find(
        (c) => c.name.toLowerCase() === sale.customerName!.toLowerCase()
      );
    }
    return undefined;
  };

  const handleRefundSale = (sale: Sale) => {
    const isUrdu = language === 'ur';
    showAlert({
      type: 'danger',
      title: isUrdu ? 'بل واپس / منسوخ کریں؟' : 'Refund / Void Bill?',
      message: isUrdu
        ? `کیا آپ واقعی بل #${sale.billNumber} واپس کرنا چاہتے ہیں؟ اس سے اشیاء واپس اسٹاک میں شامل ہو جائیں گی اور ادھار بھی ختم ہو جائے گا۔`
        : `Are you sure you want to refund Bill #${sale.billNumber}? Sold items will be restored to inventory and customer debt will be reversed.`,
      buttons: [
        {
          text: isUrdu ? 'واپس کریں (Refund)' : 'Refund & Restore',
          style: 'destructive',
          icon: 'arrow-undo-outline',
          onPress: async () => {
            await refundSale(sale.id, 'Voided from History');
          },
        },
        { text: t('cancel'), style: 'cancel' },
      ],
    });
  };

  const shareWhatsApp = (sale: Sale) => {
    openWhatsAppReceipt(sale, settings, language);
  };

  const sendUdhaarReminder = (sale: Sale) => {
    const customer = findCustomerDebt(sale);
    const debt = customer?.totalDebt ?? sale.grandTotal;
    const name = sale.customerName || customer?.name || t('walkInCustomer');
    const msgLang = settings.whatsappReminderLanguage || language;
    const shopHeader =
      msgLang === 'ur' && settings.shopNameUrdu ? settings.shopNameUrdu : settings.shopName;
    const amount = `${settings.currencySymbol} ${Math.max(0, debt).toLocaleString()}`;

    const message =
      msgLang === 'ur'
        ? `السلام علیکم ${name} صاحب!\n\nیہ ایک شائستہ یاد دہانی ہے کہ *${shopHeader}* پر آپ کا کل واجب الادا بقایا ادھار:\n👉 *${amount}* ہے۔\n\nبل #${sale.billNumber}\n\nشکریہ!\n*${settings.shopName}*`
        : `Dear ${name},\n\nGentle reminder from *${shopHeader}* regarding your pending balance:\n👉 *${amount}*\n\nBill #${sale.billNumber}\n\nThank you!\n*${settings.shopName}*`;

    openWhatsAppWithMessage(sale.customerPhone || customer?.phone, message);
  };

  const getPayMeta = (method: PaymentMethod) => {
    if (method === 'cash') {
      return {
        icon: 'cash-outline' as const,
        iconBg: settings.darkMode ? 'rgba(16,185,129,0.18)' : '#ECFDF5',
        iconColor: theme.primary,
        badgeBg: settings.darkMode ? 'rgba(16,185,129,0.18)' : '#D1FAE5',
        badgeColor: theme.primary,
        label: t('cashPaid'),
        border: softBorder,
      };
    }
    if (method === 'online') {
      return {
        icon: 'qr-code-outline' as const,
        iconBg: settings.darkMode ? 'rgba(56,189,248,0.18)' : '#E0F2FE',
        iconColor: '#0284C7',
        badgeBg: settings.darkMode ? 'rgba(56,189,248,0.18)' : '#E0F2FE',
        badgeColor: settings.darkMode ? '#7DD3FC' : '#075985',
        label: t('onlinePaid'),
        border: softBorder,
      };
    }
    return {
      icon: 'wallet-outline' as const,
      iconBg: theme.dangerLight,
      iconColor: theme.danger,
      badgeBg: theme.dangerLight,
      badgeColor: theme.danger,
      label: t('udhaarUnpaid'),
      border: settings.darkMode ? 'rgba(248,113,113,0.35)' : 'rgba(220,38,38,0.3)',
    };
  };

  const formatSaleTime = (dateStr: string) => {
    const saleDate = new Date(dateStr);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    if (isSameDay(saleDate, now)) {
      return saleDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (isSameDay(saleDate, yesterday)) {
      return language === 'ur' ? 'کل' : 'Yesterday';
    }
    return saleDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const performanceLabel =
    filter === 'today' || (filter === 'custom' && isSameDay(customDate, new Date()))
      ? t('todaysPerformance')
      : t('filterPerformance');

  const dateFilterOptions: { key: HistoryFilter; label: string; icon?: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'today', label: t('filterToday') },
    { key: 'week', label: t('filterWeek') },
    { key: 'month', label: t('filterMonth') },
    { key: 'all', label: t('filterAll') },
    { key: 'custom', label: t('filterCustom'), icon: 'options-outline' },
  ];

  const paymentOptions: { key: PaymentFilter; label: string; count: number }[] = [
    { key: 'all', label: t('modeAll'), count: paymentCounts.all },
    { key: 'cash', label: t('modeCash'), count: paymentCounts.cash },
    { key: 'online', label: t('modeOnline'), count: paymentCounts.online },
    { key: 'udhaar', label: t('modeUdhaar'), count: paymentCounts.udhaar },
  ];

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.topSection}>
        <View style={styles.titleRow}>
          <Text style={[styles.screenTitleText, { color: theme.text }]}>
            {t('history')}
          </Text>
          <Text style={[styles.countText, { color: theme.textMuted }]}>
            {filteredSales.length} {language === 'ur' ? 'بل' : filteredSales.length === 1 ? 'bill' : 'bills'}
          </Text>
        </View>
        <Text style={[styles.screenSubtitle, { color: theme.textMuted }]}>
          {performanceLabel}
          {'  ·  '}
          +{marginPct}% {t('marginLabel')}
        </Text>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('searchHistoryPlaceholder')}
          height={42}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
          style={styles.filterScroll}>
          {dateFilterOptions.map((item) => (
            <FilterChip
              key={item.key}
              label={item.label}
              isActive={filter === item.key}
              onPress={() => setFilter(item.key)}
              icon={item.icon}
            />
          ))}
        </ScrollView>

        <View style={styles.metricRow}>
          <View
            style={[
              styles.metricCard,
              { backgroundColor: theme.card, borderColor: softBorder },
            ]}>
            <Text style={[styles.metricLabel, { color: theme.textMuted }]}>
              {t('totalBillsLabel')}
            </Text>
            <Text style={[styles.metricValue, { color: theme.text }]}>{completedCount}</Text>
          </View>
          <View
            style={[
              styles.metricCard,
              { backgroundColor: theme.card, borderColor: softBorder },
            ]}>
            <Text style={[styles.metricLabel, { color: theme.textMuted }]}>
              {t('grossSales')}
            </Text>
            <Text style={[styles.metricValue, { color: theme.text }]} numberOfLines={1}>
              {settings.currencySymbol}
              {formatCompactPrice(filterRevenue)}
            </Text>
          </View>
          <View
            style={[
              styles.metricCard,
              { backgroundColor: theme.card, borderColor: softBorder },
            ]}>
            <Text style={[styles.metricLabel, { color: theme.primary }]}>
              {t('netProfitLabel')}
            </Text>
            <Text style={[styles.metricValue, { color: theme.primary }]} numberOfLines={1}>
              {settings.currencySymbol}
              {formatCompactPrice(filterProfit)}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.contentWrap}
        showsVerticalScrollIndicator={false}>
        {filter === 'custom' ? (
          <View style={styles.customDateBlock}>
            <Text style={[styles.customDateHint, { color: theme.textMuted }]}>
              {t('pickCustomDate')}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.customDaysRow}>
              {recentDays.map((day) => {
                const active = isSameDay(day, customDate);
                return (
                  <Pressable
                    key={day.toISOString()}
                    onPress={() => setCustomDate(day)}
                    style={[
                      styles.dayChip,
                      {
                        backgroundColor: active ? theme.primary : cardBg,
                        borderColor: active ? theme.primary : softBorder,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.dayChipText,
                        { color: active ? '#FFFFFF' : theme.textSecondary },
                      ]}>
                      {formatDayChip(day)}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        ) : null}

        {/* Payment mode filters */}
        <View style={styles.modeRow}>
          <Text style={[styles.modeLabel, { color: theme.textMuted }]}>
            {t('paymentMode')}:
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.modeScrollContent}>
            {paymentOptions.map((opt) => {
              const active = paymentFilter === opt.key;
              const isUdhaar = opt.key === 'udhaar';
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => setPaymentFilter(opt.key)}
                  style={[
                    styles.modeChip,
                    {
                      backgroundColor: active
                        ? settings.darkMode
                          ? 'rgba(16,185,129,0.18)'
                          : '#E5EEFF'
                        : cardBg,
                      borderColor: active
                        ? theme.primary
                        : softBorder,
                    },
                  ]}>
                  {isUdhaar ? (
                    <View style={[styles.udhaarDot, { backgroundColor: theme.danger }]} />
                  ) : null}
                  <Text
                    style={[
                      styles.modeChipText,
                      { color: active ? theme.primary : theme.textMuted },
                    ]}>
                    {opt.label} ({opt.count})
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* List header */}
        <View style={styles.listHeader}>
          <Text style={[styles.listTitle, { color: theme.text }]}>{t('recentReceipts')}</Text>
          <Text style={[styles.listCount, { color: theme.textMuted }]}>
            {t('showingOf')} {filteredSales.length} {t('ofLabel')} {dateFilteredSales.length}
          </Text>
        </View>

        {/* Bills */}
        {filteredSales.length === 0 ? (
          <EmptyState
            icon="receipt-outline"
            title={t('noSalesFound')}
            subtitle={
              searchQuery
                ? language === 'ur'
                  ? 'مختلف نام یا بل نمبر تلاش کریں'
                  : 'Try a different search term.'
                : language === 'ur'
                  ? 'ابھی تک کوئی بل نہیں بنایا'
                  : 'No bills found for the selected period.'
            }
            actionLabel={!searchQuery ? t('newBillBtn') : undefined}
            onAction={!searchQuery ? () => setActiveTab('sale') : undefined}
          />
        ) : (
          <View style={styles.billsList}>
            {filteredSales.map((sale) => {
              const pay = getPayMeta(sale.paymentMethod);
              const isRefunded = sale.status === 'refunded';
              const isUdhaar = sale.paymentMethod === 'udhaar';
              const isExpanded = !!expandedCards[sale.id];
              const visibleItems = isExpanded ? sale.items : sale.items.slice(0, 3);
              const hasMore = sale.items.length > 3;
              const customer = isUdhaar ? findCustomerDebt(sale) : undefined;
              const debtTotal = customer?.totalDebt;

              const amountColor = isRefunded
                ? theme.textMuted
                : isUdhaar
                  ? theme.danger
                  : theme.text;

              return (
                <View
                  key={sale.id}
                  style={[
                    styles.billCard,
                    {
                      backgroundColor: cardBg,
                      borderColor: softBorder,
                      opacity: isRefunded ? 0.72 : 1,
                    },
                  ]}>
                  <View style={styles.billHeader}>
                    <View style={[styles.payIconWrap, { backgroundColor: pay.iconBg }]}>
                      <Ionicons name={pay.icon} size={18} color={pay.iconColor} />
                    </View>
                    <View style={styles.billHeaderMeta}>
                      <Text
                        style={[styles.billNo, { color: isRefunded ? theme.textMuted : theme.text }]}
                        numberOfLines={1}>
                        {sale.customerName || t('walkInCustomer')}
                      </Text>
                      <Text style={[styles.billMeta, { color: theme.textMuted }]} numberOfLines={1}>
                        #{sale.billNumber.startsWith('INV') ? sale.billNumber : `INV-${sale.billNumber}`}
                        {'  ·  '}
                        {isRefunded
                          ? language === 'ur'
                            ? 'واپس شدہ'
                            : 'Refunded'
                          : pay.label}
                        {'  ·  '}
                        {formatSaleTime(sale.date)}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.totalAmount,
                        { color: amountColor },
                        isRefunded && { textDecorationLine: 'line-through' },
                      ]}
                      numberOfLines={1}>
                      {settings.currencySymbol}
                      {sale.grandTotal.toLocaleString()}
                    </Text>
                  </View>

                  <View style={styles.itemsList}>
                    {visibleItems.map((it, idx) => (
                      <View key={`${sale.id}-${idx}`} style={styles.itemRow}>
                        <Text style={[styles.itemName, { color: theme.text }]} numberOfLines={1}>
                          {it.product.name}
                        </Text>
                        <Text style={[styles.itemQty, { color: theme.textMuted }]}>
                          ×{it.quantity}
                        </Text>
                        <Text style={[styles.itemTotal, { color: theme.textMuted }]}>
                          {settings.currencySymbol}
                          {it.total.toLocaleString()}
                        </Text>
                      </View>
                    ))}
                    {hasMore ? (
                      <Pressable
                        onPress={() => toggleExpand(sale.id)}
                        hitSlop={8}
                        style={({ pressed }) => [pressed && { opacity: 0.7 }]}>
                        <Text style={[styles.moreItems, { color: theme.primary }]}>
                          {isExpanded
                            ? language === 'ur'
                              ? 'کم دکھائیں'
                              : 'Show less'
                            : `+${sale.items.length - 3} ${t('itemsCount')}`}
                        </Text>
                      </Pressable>
                    ) : null}
                    {isUdhaar && !isRefunded ? (
                      <Text style={[styles.debtNoteText, { color: theme.danger }]}>
                        {t('addedToKhata')} {settings.currencySymbol}
                        {(debtTotal ?? sale.grandTotal).toLocaleString()}
                      </Text>
                    ) : null}
                  </View>

                  <View style={styles.billActions}>
                    <Pressable
                      onPress={() => setActiveReceipt(sale)}
                      style={({ pressed }) => [
                        styles.softActionBtn,
                        { backgroundColor: theme.primaryLight, flex: 1 },
                        pressed && { opacity: 0.85 },
                      ]}>
                      <Ionicons name="receipt-outline" size={15} color={theme.primary} />
                      <Text style={[styles.softActionText, { color: theme.primary }]}>
                        {t('viewShort')}
                      </Text>
                    </Pressable>

                    {isUdhaar && !isRefunded ? (
                      <Pressable
                        onPress={() => sendUdhaarReminder(sale)}
                        style={({ pressed }) => [
                          styles.softActionBtn,
                          { backgroundColor: theme.dangerLight, flex: 1 },
                          pressed && { opacity: 0.85 },
                        ]}>
                        <Ionicons name="notifications-outline" size={15} color={theme.danger} />
                        <Text style={[styles.softActionText, { color: theme.danger }]}>
                          {language === 'ur' ? 'یاد دہانی' : 'Remind'}
                        </Text>
                      </Pressable>
                    ) : null}

                    {!isUdhaar && !isRefunded && Boolean(sale.customerPhone?.trim()) ? (
                      <Pressable
                        onPress={() => shareWhatsApp(sale)}
                        style={({ pressed }) => [
                          styles.softActionBtn,
                          { backgroundColor: theme.heroFill, flex: 1 },
                          pressed && { opacity: 0.88 },
                        ]}>
                        <Ionicons name="logo-whatsapp" size={15} color="#FFFFFF" />
                        <Text style={[styles.softActionText, { color: '#FFFFFF' }]}>
                          {t('whatsapp')}
                        </Text>
                      </Pressable>
                    ) : null}

                    {!isRefunded ? (
                      <Pressable
                        onPress={() => handleRefundSale(sale)}
                        style={({ pressed }) => [
                          styles.softActionBtn,
                          { backgroundColor: theme.dangerLight, flex: 1 },
                          pressed && { opacity: 0.85 },
                        ]}>
                        <Ionicons name="return-down-back" size={15} color={theme.danger} />
                        <Text style={[styles.softActionText, { color: theme.danger }]}>
                          {language === 'ur' ? 'واپس' : 'Refund'}
                        </Text>
                      </Pressable>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>
        )}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentScroll: { flex: 1 },
  topSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 8,
    paddingBottom: 4,
    maxWidth: 720,
    marginHorizontal: 'auto',
    width: '100%',
    gap: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  screenTitleText: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
  },
  screenSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: -4,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metricCard: {
    flex: 1,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 1,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.4,
    fontVariant: ['tabular-nums'],
  },
  contentWrap: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 10,
    paddingBottom: 120,
    maxWidth: 720,
    marginHorizontal: 'auto',
    width: '100%',
    gap: Spacing.md,
  },

  filterScroll: { maxHeight: 40 },
  filterScrollContent: { gap: 8, alignItems: 'center' },

  customDateBlock: { gap: 6 },
  customDateHint: { fontSize: 11, fontWeight: '600' },
  customDaysRow: { gap: 6 },
  dayChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  dayChipText: { fontSize: 12, fontWeight: '600' },

  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modeLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  modeScrollContent: { gap: 6, alignItems: 'center' },
  modeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  modeChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  udhaarDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  listCount: {
    fontSize: 12.5,
    fontWeight: '500',
  },

  billsList: { gap: 10 },
  billCard: {
    borderRadius: 20,
    borderCurve: 'continuous',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  billHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  payIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 15,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  billHeaderMeta: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  billNo: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  billMeta: {
    fontSize: 12,
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
    fontVariant: ['tabular-nums'],
  },
  itemsList: {
    gap: 6,
    paddingLeft: 56,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    minWidth: 0,
  },
  itemQty: {
    fontSize: 12,
    fontWeight: '500',
  },
  itemTotal: {
    fontSize: 13,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  moreItems: {
    fontSize: 13,
    fontWeight: '600',
  },
  debtNoteText: {
    fontSize: 12,
    fontWeight: '600',
  },
  billActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  softActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    minHeight: 40,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    borderCurve: 'continuous',
  },
  softActionText: {
    fontSize: 13,
    fontWeight: '700',
  },

});
