import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PaymentMethod, Sale } from '@/types';
import { useShop } from '@/context/ShopContext';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
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

  const { filterRevenue, filterProfit, completedCount, totalInFilter, marginPct } = useMemo(() => {
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
      totalInFilter: filteredSales.length,
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

  const handleCallCustomer = (phone?: string) => {
    if (!phone) return;
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    const url = `tel:${cleanPhone}`;
    Linking.openURL(url).catch(() => {
      if (Platform.OS === 'web') window.open(url);
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

  const showMoreActions = (sale: Sale) => {
    const isRefunded = sale.status === 'refunded';
    const buttons: {
      text: string;
      style?: 'destructive' | 'cancel' | 'default';
      icon?: any;
      onPress?: () => void;
    }[] = [];

    buttons.push({
      text: t('viewReceipt'),
      icon: 'receipt-outline',
      onPress: () => setActiveReceipt(sale),
    });
    if (!isRefunded) {
      buttons.push({
        text: t('refundAction'),
        style: 'destructive',
        icon: 'arrow-undo-outline',
        onPress: () => handleRefundSale(sale),
      });
    }
    if (sale.customerPhone?.trim()) {
      buttons.push({
        text: t('callCustomer'),
        icon: 'call-outline',
        onPress: () => handleCallCustomer(sale.customerPhone),
      });
      buttons.push({
        text: t('shareWhatsApp'),
        icon: 'logo-whatsapp',
        onPress: () => shareWhatsApp(sale),
      });
    }
    buttons.push({ text: t('cancel'), style: 'cancel' });

    showAlert({
      type: 'info',
      title: `#${sale.billNumber}`,
      message: language === 'ur' ? 'عمل منتخب کریں' : 'Choose an action',
      buttons,
    });
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
      {/* ── Top Emerald Canopy (Seamless continuation from ShopHeader) ── */}
      <View style={[styles.heroCanopy, { backgroundColor: theme.heroBg }]}>
        <View style={styles.heroInner}>
          {/* Top Title & Margin Pill */}
          <View style={styles.heroTitleRow}>
            <View style={styles.titleBlock}>
              <Text style={styles.screenTitle}>{t('salesReceiptsTitle')}</Text>
              <Text style={styles.screenSubtitle}>{performanceLabel}</Text>
            </View>

            <View style={styles.canopyMarginPill}>
              <Ionicons name="trending-up" size={12} color="#A7F3D0" />
              <Text style={styles.canopyMarginText}>
                +{marginPct}% {t('marginLabel')}
              </Text>
            </View>
          </View>

          {/* ── Period Selector Filter Chips (Frosted Glass) ── */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.canopyFilterScrollContent}
            style={styles.canopyFilterScroll}>
            {dateFilterOptions.map((item) => (
              <FilterChip
                key={item.key}
                label={item.label}
                isActive={filter === item.key}
                onPress={() => setFilter(item.key)}
                icon={item.icon}
                activeBg="#FFFFFF"
                activeColor="#064E3B"
                inactiveBg="rgba(255, 255, 255, 0.16)"
                inactiveColor="#FFFFFF"
                inactiveBorder="rgba(255, 255, 255, 0.22)"
              />
            ))}
          </ScrollView>

          {/* ── 3-Pillar Executive Metric Strip (Frosted Glass) ── */}
          <View style={styles.canopyMetricBar}>
            {/* Pillar 1: Total Bills */}
            <View style={styles.canopyMetricItem}>
              <Text style={styles.canopyMetricTitle}>{t('totalBillsLabel')}</Text>
              <View style={styles.metricValRow}>
                <Text style={styles.canopyMetricBold} numberOfLines={1}>
                  🧾 {completedCount}
                </Text>
              </View>
              <Text style={styles.canopyMetricSub}>
                {totalInFilter > 0
                  ? `${Math.round((completedCount / totalInFilter) * 100)}% ${t('completedPct')}`
                  : `0% ${t('completedPct')}`}
              </Text>
            </View>

            <View style={styles.canopyMetricDivider} />

            {/* Pillar 2: Gross Sales */}
            <View style={styles.canopyMetricItem}>
              <Text style={styles.canopyMetricTitle}>{t('grossSales')}</Text>
              <View style={styles.metricValRow}>
                <Text style={styles.canopyMetricBold} numberOfLines={1}>
                  💰 {settings.currencySymbol}
                  {formatCompactPrice(filterRevenue)}
                </Text>
              </View>
              <Text style={styles.canopyMetricSub}>{t('cashPlusDigital')}</Text>
            </View>

            <View style={styles.canopyMetricDivider} />

            {/* Pillar 3: Net Profit */}
            <View style={styles.canopyMetricItem}>
              <Text style={styles.canopyMetricTitle}>{t('netProfitLabel')}</Text>
              <View style={styles.metricValRow}>
                <Text style={[styles.canopyMetricBold, { color: '#6EE7B7' }]} numberOfLines={1}>
                  📈 +{settings.currencySymbol}
                  {formatCompactPrice(filterProfit)}
                </Text>
              </View>
              <Text style={[styles.canopyMetricSub, { color: 'rgba(167, 243, 208, 0.85)' }]}>
                {t('estEarnings')}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.contentWrap}
        showsVerticalScrollIndicator={false}>
        {/* Custom day picker */}
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

        {/* Search */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('searchHistoryPlaceholder')}
          height={42}
        />

        {/* Custom day picker */}
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

              return (
                <View
                  key={sale.id}
                  style={[
                    styles.billCard,
                    {
                      backgroundColor: cardBg,
                      borderColor: isUdhaar && !isRefunded ? pay.border : softBorder,
                      opacity: isRefunded ? 0.78 : 1,
                    },
                  ]}>
                  {/* Header */}
                  <View style={styles.billHeader}>
                    <View style={styles.billHeaderLeft}>
                      <View
                        style={[
                          styles.payIconWrap,
                          { backgroundColor: pay.iconBg, borderColor: pay.border },
                        ]}>
                        <Ionicons name={pay.icon} size={18} color={pay.iconColor} />
                      </View>
                      <View style={styles.billHeaderMeta}>
                        <View style={styles.billBadgeRow}>
                          <Text
                            style={[
                              styles.billNo,
                              { color: isRefunded ? theme.textMuted : theme.text },
                            ]}>
                            #{sale.billNumber.startsWith('INV') ? sale.billNumber : `INV-${sale.billNumber}`}
                          </Text>
                          <View style={[styles.payBadge, { backgroundColor: pay.badgeBg }]}>
                            {isUdhaar ? (
                              <View
                                style={[styles.udhaarDot, { backgroundColor: theme.danger }]}
                              />
                            ) : null}
                            <Text style={[styles.payBadgeText, { color: pay.badgeColor }]}>
                              {isRefunded
                                ? language === 'ur'
                                  ? 'واپس شدہ'
                                  : 'REFUNDED'
                                : pay.label}
                            </Text>
                          </View>
                        </View>
                        <Text style={[styles.customerLine, { color: theme.textMuted }]} numberOfLines={1}>
                          {sale.customerName || t('walkInCustomer')}
                          {sale.customerPhone ? (
                            <Text style={{ color: theme.textMuted }}>
                              {' '}
                              • {sale.customerPhone}
                            </Text>
                          ) : null}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.billTime, { color: theme.textMuted }]}>
                      {formatSaleTime(sale.date)}
                    </Text>
                  </View>

                  {/* Items snapshot */}
                  <View
                    style={[
                      styles.itemsBox,
                      {
                        backgroundColor: settings.darkMode ? theme.surfaceSubtle : '#F8F9FF',
                        borderColor: softBorder,
                      },
                    ]}>
                    {visibleItems.map((it, idx) => (
                      <View key={`${sale.id}-${idx}`} style={styles.itemRow}>
                        <View style={styles.itemLeft}>
                          <View
                            style={[
                              styles.itemDot,
                              { backgroundColor: settings.darkMode ? '#64748B' : '#CBD5E1' },
                            ]}
                          />
                          <Text
                            style={[styles.itemName, { color: theme.text }]}
                            numberOfLines={1}>
                            {it.product.name}
                          </Text>
                          <Text style={[styles.itemQty, { color: theme.textMuted }]}>
                            × {it.quantity} {it.product.unit || 'pc'}
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.itemTotal,
                            { color: isUdhaar && !isRefunded ? theme.danger : theme.text },
                          ]}>
                          {settings.currencySymbol}
                          {it.total.toLocaleString()}
                        </Text>
                      </View>
                    ))}
                    {hasMore ? (
                      <Pressable onPress={() => toggleExpand(sale.id)} hitSlop={6}>
                        <Text style={[styles.moreItems, { color: theme.primary }]}>
                          {isExpanded
                            ? language === 'ur'
                              ? 'کم دکھائیں'
                              : 'Show less'
                            : `+${sale.items.length - 3} ${t('itemsCount')}`}
                        </Text>
                      </Pressable>
                    ) : null}
                  </View>

                  {/* Udhaar debt note */}
                  {isUdhaar && !isRefunded ? (
                    <View
                      style={[
                        styles.debtNote,
                        {
                          backgroundColor: settings.darkMode
                            ? 'rgba(248,113,113,0.12)'
                            : '#FEE2E2',
                          borderColor: settings.darkMode
                            ? 'rgba(248,113,113,0.25)'
                            : 'rgba(220,38,38,0.2)',
                        },
                      ]}>
                      <Ionicons name="alert-circle" size={14} color={theme.danger} />
                      <Text style={[styles.debtNoteText, { color: theme.danger }]}>
                        {t('addedToKhata')}{' '}
                        <Text style={{ fontWeight: '800' }}>
                          {settings.currencySymbol}
                          {(debtTotal ?? sale.grandTotal).toLocaleString()}
                        </Text>
                      </Text>
                    </View>
                  ) : null}

                  {/* Footer */}
                  <View style={[styles.billFooter, { borderTopColor: softBorder }]}>
                    <View>
                      <Text style={[styles.totalLabel, { color: theme.textMuted }]}>
                        {isUdhaar && !isRefunded ? t('pendingDebtLabel') : t('grandTotal')}
                      </Text>
                      <Text
                        style={[
                          styles.totalAmount,
                          {
                            color: isRefunded
                              ? theme.textMuted
                              : isUdhaar
                                ? theme.danger
                                : theme.primary,
                          },
                          isRefunded && { textDecorationLine: 'line-through' },
                        ]}>
                        {settings.currencySymbol}
                        {sale.grandTotal.toLocaleString()}
                      </Text>
                    </View>

                    <View style={styles.billActions}>
                      {isUdhaar && !isRefunded ? (
                        <>
                          <Pressable
                            onPress={() => setActiveReceipt(sale)}
                            accessibilityRole="button"
                            accessibilityLabel={`${t('viewShort')} #${sale.billNumber}`}
                            style={({ pressed }) => [
                              styles.viewBtn,
                              {
                                borderColor: settings.darkMode
                                  ? 'rgba(16,185,129,0.35)'
                                  : 'rgba(5,150,105,0.25)',
                                backgroundColor: settings.darkMode
                                  ? 'rgba(16,185,129,0.12)'
                                  : '#ECFDF5',
                              },
                              pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
                            ]}>
                            <Ionicons name="receipt-outline" size={14} color={theme.primary} />
                            <Text style={[styles.viewBtnText, { color: theme.primary }]}>
                              {t('viewShort')}
                            </Text>
                          </Pressable>
                          <Pressable
                            onPress={() => sendUdhaarReminder(sale)}
                            style={({ pressed }) => [
                              styles.reminderBtn,
                              {
                                borderColor: settings.darkMode
                                  ? 'rgba(248,113,113,0.35)'
                                  : 'rgba(220,38,38,0.3)',
                              },
                              pressed && { opacity: 0.85 },
                            ]}>
                            <Ionicons name="notifications-outline" size={14} color={theme.danger} />
                            <Text style={[styles.reminderBtnText, { color: theme.danger }]} numberOfLines={1}>
                              {language === 'ur' ? 'یاد دہانی' : 'Remind'}
                            </Text>
                          </Pressable>
                          <Pressable
                            onPress={() => showMoreActions(sale)}
                            style={({ pressed }) => [
                              styles.iconActionBtn,
                              { borderColor: softBorder, backgroundColor: cardBg },
                              pressed && { opacity: 0.8 },
                            ]}>
                            <Ionicons name="ellipsis-vertical" size={16} color={theme.textMuted} />
                          </Pressable>
                        </>
                      ) : (
                        <>
                          <Pressable
                            onPress={() => setActiveReceipt(sale)}
                            accessibilityRole="button"
                            accessibilityLabel={`${t('viewShort')} #${sale.billNumber}`}
                            style={({ pressed }) => [
                              styles.viewBtn,
                              {
                                borderColor: settings.darkMode
                                  ? 'rgba(16,185,129,0.35)'
                                  : 'rgba(5,150,105,0.25)',
                                backgroundColor: settings.darkMode
                                  ? 'rgba(16,185,129,0.12)'
                                  : '#ECFDF5',
                              },
                              pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
                            ]}>
                            <Ionicons name="receipt-outline" size={14} color={theme.primary} />
                            <Text style={[styles.viewBtnText, { color: theme.primary }]}>
                              {t('viewShort')}
                            </Text>
                          </Pressable>

                          {!isRefunded && Boolean(sale.customerPhone?.trim()) && (
                            <Pressable
                              onPress={() => shareWhatsApp(sale)}
                              style={({ pressed }) => [
                                styles.whatsappBtn,
                                { backgroundColor: theme.primary },
                                pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
                              ]}>
                              <Ionicons name="logo-whatsapp" size={15} color="#FFFFFF" />
                              <Text style={styles.whatsappBtnText}>{t('whatsapp')}</Text>
                            </Pressable>
                          )}

                          {!isRefunded ? (
                            <Pressable
                              onPress={() => handleRefundSale(sale)}
                              style={({ pressed }) => [
                                styles.iconActionBtn,
                                {
                                  borderColor: softBorder,
                                  backgroundColor: theme.dangerLight,
                                },
                                pressed && { opacity: 0.8 },
                              ]}>
                              <Ionicons name="return-down-back" size={15} color={theme.danger} />
                            </Pressable>
                          ) : null}
                        </>
                      )}
                    </View>
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
  heroCanopy: {
    width: '100%',
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderWidth: 0,
    borderTopWidth: 0,
    elevation: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
  },
  heroInner: {
    maxWidth: 720,
    marginHorizontal: 'auto',
    width: '100%',
    paddingHorizontal: Spacing.lg,
    gap: 8,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  titleBlock: { flex: 1, gap: 1 },
  screenTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  screenSubtitle: {
    color: 'rgba(255, 255, 255, 0.78)',
    fontSize: 11.5,
    fontWeight: '500',
  },
  canopyMarginPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  canopyMarginText: {
    color: '#A7F3D0',
    fontSize: 11,
    fontWeight: '700',
  },
  canopyFilterScroll: { maxHeight: 34 },
  canopyFilterScrollContent: { gap: 6, alignItems: 'center' },

  canopyMetricBar: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 4,
  },
  canopyMetricItem: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 1,
    gap: 1,
  },
  canopyMetricTitle: {
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  metricValRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2.5,
    marginTop: 1,
    maxWidth: '100%',
    flexShrink: 1,
  },
  canopyMetricBold: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  canopyMetricSub: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 9,
    fontWeight: '500',
    textAlign: 'center',
  },
  canopyMetricDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    marginVertical: 2,
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

  billsList: { gap: Spacing.md },
  billCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: Spacing.md,
    gap: 12,
    ...Shadows.sm,
  },
  billHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  billHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    flex: 1,
  },
  payIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  billHeaderMeta: { flex: 1, gap: 2 },
  billBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  billNo: {
    fontSize: 15,
    fontWeight: '700',
  },
  payBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  payBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  customerLine: {
    fontSize: 12.5,
    fontWeight: '500',
  },
  billTime: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },

  itemsBox: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    minWidth: 0,
  },
  itemDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '500',
    flexShrink: 1,
  },
  itemQty: {
    fontSize: 11,
    fontWeight: '600',
  },
  itemTotal: {
    fontSize: 13,
    fontWeight: '700',
  },
  moreItems: {
    fontSize: 11.5,
    fontWeight: '700',
    marginTop: 2,
  },

  debtNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  debtNoteText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 15,
  },

  billFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    gap: 8,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  billActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
  },
  viewBtnText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  whatsappBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
  },
  whatsappBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  reminderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    maxWidth: 180,
  },
  reminderBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  iconActionBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

});
