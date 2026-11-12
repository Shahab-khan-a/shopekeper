import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
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
import { EmptyState } from '@/components/ui/EmptyState';
import { SubScreenHeader } from '@/components/SubScreenHeader';
import { HeroStatsCard } from '@/components/HeroStatsCard';
import { formatCompactPrice } from '@/utils/formatters';
import { openWhatsAppWithMessage } from '@/utils/whatsapp';
import { getPaymentBreakdown } from '@/utils/payment';

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
    setActiveReceipt,
    setActiveTab,
    settings,
    t,
    language,
  } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const isDark = settings.darkMode;
  const accentBlue = isDark ? '#38BDF8' : '#0284C7';
  const softBlueBg = isDark ? 'rgba(56,189,248,0.16)' : '#EFF6FF';

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<HistoryFilter>('all');
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>('all');
  const [customDate, setCustomDate] = useState<Date>(new Date());

  const softBorder = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(148,163,184,0.28)';
  const cardBg = isDark ? theme.card : '#FFFFFF';
  const isUrdu = language === 'ur';

  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [isDateMenuMounted, setIsDateMenuMounted] = useState(false);
  const dateMenuAnim = useRef(new Animated.Value(0)).current;

  const [isModeMenuOpen, setIsModeMenuOpen] = useState(false);
  const [isModeMenuMounted, setIsModeMenuMounted] = useState(false);
  const modeMenuAnim = useRef(new Animated.Value(0)).current;

  const openDateMenu = () => {
    closeModeMenu();
    setIsDateMenuMounted(true);
    setIsDateMenuOpen(true);
    Animated.spring(dateMenuAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 65,
    }).start();
  };

  const closeDateMenu = () => {
    setIsDateMenuOpen(false);
    Animated.timing(dateMenuAnim, {
      toValue: 0,
      duration: 140,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setIsDateMenuMounted(false);
    });
  };

  const toggleDateMenu = () => {
    if (isDateMenuOpen) closeDateMenu();
    else openDateMenu();
  };

  const openModeMenu = () => {
    closeDateMenu();
    setIsModeMenuMounted(true);
    setIsModeMenuOpen(true);
    Animated.spring(modeMenuAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 65,
    }).start();
  };

  const closeModeMenu = () => {
    setIsModeMenuOpen(false);
    Animated.timing(modeMenuAnim, {
      toValue: 0,
      duration: 140,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setIsModeMenuMounted(false);
    });
  };

  const toggleModeMenu = () => {
    if (isModeMenuOpen) closeModeMenu();
    else openModeMenu();
  };

  const closeAllMenus = () => {
    if (isDateMenuOpen) closeDateMenu();
    if (isModeMenuOpen) closeModeMenu();
  };

  const handleSelectDateFilter = (newFilter: HistoryFilter) => {
    setFilter(newFilter);
    closeDateMenu();
  };

  const handleSelectPaymentFilter = (newMode: PaymentFilter) => {
    setPaymentFilter(newMode);
    closeModeMenu();
  };

  const dateChevronRotate = dateMenuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const dateMenuScale = dateMenuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1],
  });
  const dateMenuTranslateY = dateMenuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-6, 0],
  });

  const modeChevronRotate = modeMenuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const modeMenuScale = modeMenuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1],
  });
  const modeMenuTranslateY = modeMenuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-6, 0],
  });

  const activeDateMeta = useMemo(() => {
    switch (filter) {
      case 'today':
        return {
          label: t('filterToday'),
          pillBg: cardBg,
          pillBorder: softBorder,
          textColor: theme.text,
        };
      case 'week':
        return {
          label: t('filterWeek'),
          pillBg: softBlueBg,
          pillBorder: isDark ? 'rgba(56, 189, 248, 0.35)' : '#BAE6FD',
          textColor: accentBlue,
        };
      case 'month':
        return {
          label: t('filterMonth'),
          pillBg: softBlueBg,
          pillBorder: isDark ? 'rgba(56, 189, 248, 0.35)' : '#BAE6FD',
          textColor: accentBlue,
        };
      case 'custom':
        return {
          label: isUrdu ? 'کسٹم' : 'Custom',
          pillBg: settings.darkMode ? 'rgba(245, 158, 11, 0.16)' : '#FEF3C7',
          pillBorder: settings.darkMode ? 'rgba(245, 158, 11, 0.35)' : '#FDE68A',
          textColor: settings.darkMode ? '#FBBF24' : '#B45309',
        };
      case 'all':
      default:
        return {
          label: t('filterAll'),
          pillBg: cardBg,
          pillBorder: softBorder,
          textColor: theme.text,
        };
    }
  }, [filter, t, cardBg, softBorder, theme.text, theme.primary, settings.darkMode, isUrdu]);

  const activeModeMeta = useMemo(() => {
    switch (paymentFilter) {
      case 'cash':
        return {
          label: t('modeCash'),
          dotColor: '#059669',
          pillBg: settings.darkMode ? 'rgba(16, 185, 129, 0.16)' : '#ECFDF5',
          pillBorder: settings.darkMode ? 'rgba(16, 185, 129, 0.35)' : '#A7F3D0',
          textColor: settings.darkMode ? '#34D399' : '#059669',
        };
      case 'online':
        return {
          label: t('modeOnline'),
          dotColor: '#0284C7',
          pillBg: settings.darkMode ? 'rgba(56, 189, 248, 0.16)' : '#E0F2FE',
          pillBorder: settings.darkMode ? 'rgba(56, 189, 248, 0.35)' : '#BAE6FD',
          textColor: settings.darkMode ? '#38BDF8' : '#0284C7',
        };
      case 'udhaar':
        return {
          label: t('modeUdhaar'),
          dotColor: '#DC2626',
          pillBg: settings.darkMode ? 'rgba(239, 68, 68, 0.16)' : '#FEE2E2',
          pillBorder: settings.darkMode ? 'rgba(239, 68, 68, 0.35)' : '#FECACA',
          textColor: settings.darkMode ? '#F87171' : '#DC2626',
        };
      case 'all':
      default:
        return {
          label: isUrdu ? 'تمام' : 'All',
          dotColor: theme.primary,
          pillBg: cardBg,
          pillBorder: softBorder,
          textColor: theme.text,
        };
    }
  }, [paymentFilter, t, cardBg, softBorder, theme.text, theme.primary, settings.darkMode, isUrdu]);

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

  const {
    filterRevenue,
    filterProfit,
    completedCount,
    marginPct,
    filterCashTotal,
    filterUdhaarTotal,
  } = useMemo(() => {
    const activeSales = filteredSales.filter(
      (s) => s.status !== 'refunded' && s.status !== 'cancelled'
    );
    const rev = activeSales.reduce((sum, s) => sum + s.grandTotal, 0);
    const prof = activeSales.reduce((sum, s) => sum + (s.totalProfit || 0), 0);
    let cashTotal = 0;
    let udhaarTotal = 0;
    activeSales.forEach((s) => {
      const breakdown = getPaymentBreakdown(s);
      cashTotal += breakdown.cleanPaid;
      udhaarTotal += breakdown.baki;
    });
    const margin = rev > 0 ? ((prof / rev) * 100).toFixed(1) : '0.0';
    return {
      filterRevenue: rev,
      filterProfit: prof,
      completedCount: activeSales.length,
      marginPct: margin,
      filterCashTotal: cashTotal,
      filterUdhaarTotal: udhaarTotal,
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

  const sendUdhaarReminder = (sale: Sale) => {
    const customer = findCustomerDebt(sale);
    const debt = customer?.totalDebt ?? sale.grandTotal;
    const name = sale.customerName || customer?.name || t('walkInCustomer');
    const msgLang = settings.whatsappReminderLanguage || language;
    const shopHeader =
      msgLang === 'ur' && settings.shopNameUrdu ? settings.shopNameUrdu : settings.shopName;
    const amount = `${settings.currencySymbol} ${Math.max(0, debt).toLocaleString()}`;

    const customTemplate = msgLang === 'ur'
      ? settings.whatsappReminderCustomUr
      : settings.whatsappReminderCustomEn;

    let message = '';
    if (customTemplate && customTemplate.trim()) {
      message = customTemplate
        .replace(/\{name\}/gi, name)
        .replace(/احمد/g, name)
        .replace(/Ahmed/gi, name)
        .replace(/\{amount\}/gi, amount)
        .replace(/2,500/g, amount)
        .replace(/2500/g, amount)
        .replace(/\{shop\}/gi, shopHeader)
        .replace(/\{phone\}/gi, settings.phone || '');
    } else {
      message =
        msgLang === 'ur'
          ? `السلام علیکم ${name} صاحب!\n\nیہ ایک شائستہ یاد دہانی ہے کہ *${shopHeader}* پر آپ کا کل واجب الادا بقایا ادھار:\n👉 *${amount}* ہے۔\n\nبل #${sale.billNumber}\n\nشکریہ!\n*${settings.shopName}*`
          : `Dear ${name},\n\nGentle reminder from *${shopHeader}* regarding your pending balance:\n👉 *${amount}*\n\nBill #${sale.billNumber}\n\nThank you!\n*${settings.shopName}*`;
    }

    openWhatsAppWithMessage(sale.customerPhone || customer?.phone, message);
  };

  const getPayMeta = (method: PaymentMethod, sale?: Sale) => {
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
    // Udhaar or Split
    const { cleanPaid, baki, isSplit } = getPaymentBreakdown(sale || { grandTotal: 0, amountPaid: 0, paymentMethod: method });
    if (isSplit) {
      return {
        icon: 'pie-chart-outline' as const,
        iconBg: settings.darkMode ? 'rgba(2, 132, 199, 0.18)' : '#E0F2FE',
        iconColor: '#0284C7',
        badgeBg: settings.darkMode ? 'rgba(2, 132, 199, 0.18)' : '#E0F2FE',
        badgeColor: '#0284C7',
        label: isUrdu ? `جزوی نقد + ادھار (${settings.currencySymbol}${cleanPaid})` : `Split (Paid ${settings.currencySymbol}${cleanPaid})`,
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

  const isAnyMenuMounted = isDateMenuMounted || isModeMenuMounted;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SubScreenHeader
        title={isUrdu ? 'آج کا حساب و بلز' : 'Hisaab & Bills'}
        subtitle={`${filteredSales.length} ${isUrdu ? 'بل' : filteredSales.length === 1 ? 'bill' : 'bills'}`}
        onBack={() => setActiveTab('dashboard')}
      />
      {isAnyMenuMounted && (
        <Pressable
          style={styles.menuBackdrop}
          onPress={closeAllMenus}
          accessibilityLabel="Close filter menus"
        />
      )}
      <View style={styles.topSection}>
        <View style={styles.titleRow}>
          <View style={styles.titleSpacer} />

          <View style={styles.headerFiltersRow}>
            {/* 1. Date Filter Pill & Menu */}
            <View style={[styles.pillAnchor, { zIndex: isDateMenuMounted ? 60 : 40 }]}>
              <Pressable
                onPress={toggleDateMenu}
                accessibilityRole="button"
                accessibilityLabel={language === 'ur' ? 'تاریخ فلٹر' : 'Date filter'}
                style={({ pressed }) => [
                  styles.filterPill,
                  {
                    backgroundColor: activeDateMeta.pillBg,
                    borderColor: activeDateMeta.pillBorder,
                  },
                  pressed && { opacity: 0.8 },
                ]}>
                <Ionicons
                  name="calendar-outline"
                  size={12}
                  color={activeDateMeta.textColor}
                />
                <Text style={[styles.filterPillText, { color: activeDateMeta.textColor }]}>
                  {activeDateMeta.label}
                </Text>
                <Animated.View style={{ transform: [{ rotate: dateChevronRotate }] }}>
                  <Ionicons
                    name="chevron-down"
                    size={11}
                    color={activeDateMeta.textColor}
                  />
                </Animated.View>
              </Pressable>

              {isDateMenuMounted && (
                <Animated.View
                  style={[
                    styles.animatedFilterMenu,
                    {
                      backgroundColor: cardBg,
                      borderColor: softBorder,
                      opacity: dateMenuAnim,
                      transform: [
                        { translateY: dateMenuTranslateY },
                        { scale: dateMenuScale },
                      ],
                      right: isUrdu ? undefined : 0,
                      left: isUrdu ? 0 : undefined,
                    },
                  ]}>
                  {dateFilterOptions.map((opt, idx) => {
                    const active = filter === opt.key;
                    return (
                      <React.Fragment key={opt.key}>
                        {idx > 0 && <View style={[styles.menuDivider, { backgroundColor: softBorder }]} />}
                        <Pressable
                          onPress={() => handleSelectDateFilter(opt.key)}
                          style={({ pressed }) => [
                            styles.menuItem,
                            active && {
                              backgroundColor: settings.darkMode
                                ? 'rgba(255, 255, 255, 0.06)'
                                : '#F1F5F9',
                            },
                            pressed && { opacity: 0.8 },
                          ]}>
                          <Ionicons
                            name={opt.icon || 'calendar-outline'}
                            size={14}
                            color={active ? theme.primary : theme.textMuted}
                          />
                          <View style={styles.menuItemTextWrap}>
                            <Text style={[styles.menuItemTitle, { color: theme.text }]}>
                              {opt.label}
                            </Text>
                          </View>
                          {active && <Ionicons name="checkmark" size={15} color={theme.primary} />}
                        </Pressable>
                      </React.Fragment>
                    );
                  })}
                </Animated.View>
              )}
            </View>

            {/* 2. Mode Filter Pill & Menu */}
            <View style={[styles.pillAnchor, { zIndex: isModeMenuMounted ? 60 : 40 }]}>
              <Pressable
                onPress={toggleModeMenu}
                accessibilityRole="button"
                accessibilityLabel={language === 'ur' ? 'ادائیگی موڈ فلٹر' : 'Payment mode filter'}
                style={({ pressed }) => [
                  styles.filterPill,
                  {
                    backgroundColor: activeModeMeta.pillBg,
                    borderColor: activeModeMeta.pillBorder,
                  },
                  pressed && { opacity: 0.8 },
                ]}>
                <View
                  style={[
                    styles.filterPillDot,
                    { backgroundColor: activeModeMeta.dotColor },
                  ]}
                />
                <Text style={[styles.filterPillText, { color: activeModeMeta.textColor }]}>
                  {activeModeMeta.label}
                </Text>
                <Animated.View style={{ transform: [{ rotate: modeChevronRotate }] }}>
                  <Ionicons
                    name="chevron-down"
                    size={11}
                    color={activeModeMeta.textColor}
                  />
                </Animated.View>
              </Pressable>

              {isModeMenuMounted && (
                <Animated.View
                  style={[
                    styles.animatedFilterMenu,
                    {
                      backgroundColor: cardBg,
                      borderColor: softBorder,
                      opacity: modeMenuAnim,
                      transform: [
                        { translateY: modeMenuTranslateY },
                        { scale: modeMenuScale },
                      ],
                      right: isUrdu ? undefined : 0,
                      left: isUrdu ? 0 : undefined,
                    },
                  ]}>
                  {paymentOptions.map((opt, idx) => {
                    const active = paymentFilter === opt.key;
                    const dotColor =
                      opt.key === 'cash'
                        ? '#059669'
                        : opt.key === 'online'
                          ? '#0284C7'
                          : opt.key === 'udhaar'
                            ? '#DC2626'
                            : theme.primary;
                    return (
                      <React.Fragment key={opt.key}>
                        {idx > 0 && <View style={[styles.menuDivider, { backgroundColor: softBorder }]} />}
                        <Pressable
                          onPress={() => handleSelectPaymentFilter(opt.key)}
                          style={({ pressed }) => [
                            styles.menuItem,
                            active && {
                              backgroundColor: settings.darkMode
                                ? 'rgba(255, 255, 255, 0.06)'
                                : '#F1F5F9',
                            },
                            pressed && { opacity: 0.8 },
                          ]}>
                          <View style={[styles.filterPillDot, { backgroundColor: dotColor }]} />
                          <View style={styles.menuItemTextWrap}>
                            <Text style={[styles.menuItemTitle, { color: theme.text }]}>
                              {opt.label}
                            </Text>
                            <Text style={[styles.menuItemSub, { color: theme.textMuted }]}>
                              {opt.count} {language === 'ur' ? 'بل' : opt.count === 1 ? 'bill' : 'bills'}
                            </Text>
                          </View>
                          {active && <Ionicons name="checkmark" size={15} color={theme.primary} />}
                        </Pressable>
                      </React.Fragment>
                    );
                  })}
                </Animated.View>
              )}
            </View>
          </View>
        </View>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('searchHistoryPlaceholder')}
          height={42}
        />
      </View>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.contentWrap}
        showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: 12 }}>
          <HeroStatsCard
            bgImage={
              isDark
                ? require('../../assets/images/tile-bills-dark.jpg')
                : require('../../assets/images/tile-bills-light.jpg')
            }
            isDark={isDark}
            fallbackBg={isDark ? '#1A1C46' : '#EEF2FF'}
            borderColor={isDark ? 'rgba(129,140,248,0.3)' : 'rgba(79,70,229,0.2)'}
            dotColor={isDark ? '#818CF8' : '#4F46E5'}
            eyebrow={
              filter === 'today'
                ? language === 'ur'
                  ? 'آج کی فروخت'
                  : "TODAY'S BILLS"
                : filter === 'week'
                  ? language === 'ur'
                    ? 'اس ہفتے کی فروخت'
                    : 'THIS WEEK BILLS'
                  : filter === 'month'
                    ? language === 'ur'
                      ? 'اس مہینے کی فروخت'
                      : 'THIS MONTH BILLS'
                    : filter === 'custom'
                      ? formatDayChip(customDate).toUpperCase()
                      : language === 'ur'
                        ? 'کل بلز خلاصہ'
                        : 'ALL BILLS SUMMARY'
            }
            eyebrowColor={isDark ? '#A5B4FC' : '#4338CA'}
            pillText={`${completedCount} ${language === 'ur' ? 'بل' : completedCount === 1 ? 'bill' : 'bills'}`}
            currencySymbol={settings.currencySymbol}
            currencyColor={isDark ? '#818CF8' : '#4F46E5'}
            heroValue={filterRevenue.toLocaleString()}
            metrics={[
              {
                label: language === 'ur' ? 'نقد وصول' : 'Received',
                value: `${settings.currencySymbol}${formatCompactPrice(filterCashTotal)}`,
              },
              {
                label: language === 'ur' ? 'ادھار' : 'On Udhaar',
                value: `${settings.currencySymbol}${formatCompactPrice(filterUdhaarTotal)}`,
                valueColor:
                  filterUdhaarTotal > 0
                    ? isDark
                      ? '#FCA5A5'
                      : '#DC2626'
                    : undefined,
              },
              {
                label: language === 'ur' ? 'خالص منافع' : 'Profit',
                value: `${settings.currencySymbol}${formatCompactPrice(filterProfit)}`,
                valueColor: isDark ? '#34D399' : '#047857',
              },
            ]}
          />
        </View>
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
                        backgroundColor: active ? '#0284C7' : cardBg,
                        borderColor: active ? '#0284C7' : softBorder,
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
              const pay = getPayMeta(sale.paymentMethod, sale);
              const isRefunded = sale.status === 'refunded';
              const isUdhaar = sale.paymentMethod === 'udhaar';
              const { cleanPaid, baki } = getPaymentBreakdown(sale);

              const itemSummaryText = sale.items
                .slice(0, 2)
                .map((it) => `${it.product.name} ×${it.quantity}`)
                .join(', ') +
                (sale.items.length > 2 ? ` +${sale.items.length - 2}` : '');

              const itemCount = sale.items.reduce((sum, it) => sum + (it.quantity || 1), 0);

              const amountColor = isRefunded
                ? theme.textMuted
                : isUdhaar && baki > 0
                  ? theme.danger
                  : theme.text;

              const statusBadge = isRefunded
                ? {
                    bg: isDark ? 'rgba(148,163,184,0.16)' : '#F1F5F9',
                    text: theme.textMuted,
                    label: isUrdu ? 'واپس' : 'Refunded',
                  }
                : isUdhaar && baki > 0
                  ? {
                      bg: isDark ? 'rgba(239,68,68,0.18)' : '#FEE2E2',
                      text: theme.danger,
                      label:
                        cleanPaid > 0
                          ? isUrdu
                            ? `باقی ${settings.currencySymbol}${formatCompactPrice(baki)}`
                            : `Due ${settings.currencySymbol}${formatCompactPrice(baki)}`
                          : isUrdu
                            ? 'ادھار'
                            : 'Udhaar',
                    }
                  : sale.paymentMethod === 'online'
                    ? {
                        bg: softBlueBg,
                        text: accentBlue,
                        label: isUrdu ? 'آن لائن' : 'Online',
                      }
                    : {
                        bg: isDark ? 'rgba(16,185,129,0.16)' : '#ECFDF5',
                        text: isDark ? '#34D399' : '#059669',
                        label: isUrdu ? 'نقد' : 'Paid',
                      };

              return (
                <Pressable
                  key={sale.id}
                  onPress={() => setActiveReceipt(sale)}
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.billCard,
                    {
                      backgroundColor: cardBg,
                      borderColor:
                        isUdhaar && !isRefunded && baki > 0
                          ? isDark
                            ? 'rgba(239,68,68,0.32)'
                            : '#FECACA'
                          : softBorder,
                      opacity: isRefunded ? 0.68 : 1,
                    },
                    pressed && { opacity: 0.88, transform: [{ scale: 0.992 }] },
                  ]}>
                  <View style={styles.billHeader}>
                    <View
                      style={[
                        styles.payIconWrap,
                        {
                          backgroundColor: isRefunded
                            ? isDark
                              ? 'rgba(148,163,184,0.16)'
                              : '#F1F5F9'
                            : pay.iconBg,
                        },
                      ]}>
                      <Ionicons
                        name={isRefunded ? 'return-down-back' : pay.icon}
                        size={18}
                        color={isRefunded ? theme.textMuted : pay.iconColor}
                      />
                    </View>

                    <View style={styles.billHeaderMeta}>
                      <Text
                        style={[styles.billNo, { color: isRefunded ? theme.textMuted : theme.text }]}
                        numberOfLines={1}>
                        {sale.customerName || (isUrdu ? 'کاؤنٹر بل' : 'Counter Sale')}
                      </Text>
                      <Text style={[styles.billMeta, { color: theme.textMuted }]} numberOfLines={1}>
                        {formatSaleTime(sale.date)}
                        {'  ·  '}
                        {itemCount} {isUrdu ? 'اشیاء' : itemCount === 1 ? 'item' : 'items'}
                        {'  ·  '}#
                        {sale.billNumber.startsWith('INV') ? sale.billNumber : `INV-${sale.billNumber}`}
                      </Text>
                    </View>

                    <View style={styles.billRightCol}>
                      <Text
                        style={[
                          styles.totalAmount,
                          { color: amountColor },
                          isRefunded && { textDecorationLine: 'line-through' },
                        ]}
                        numberOfLines={1}>
                        {settings.currencySymbol}
                        {formatCompactPrice(sale.grandTotal)}
                      </Text>
                      <View style={[styles.statusPill, { backgroundColor: statusBadge.bg }]}>
                        <Text style={[styles.statusPillText, { color: statusBadge.text }]}>
                          {statusBadge.label}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {(itemSummaryText || (isUdhaar && !isRefunded && baki > 0)) ? (
                    <View style={[styles.billFooterLine, { borderTopColor: softBorder }]}>
                      <Text
                        style={[styles.itemsPreviewText, { color: theme.textMuted }]}
                        numberOfLines={1}>
                        {itemSummaryText}
                      </Text>

                      {isUdhaar && !isRefunded && baki > 0 ? (
                        <Pressable
                          onPress={(e) => {
                            e.stopPropagation?.();
                            sendUdhaarReminder(sale);
                          }}
                          hitSlop={6}
                          style={({ pressed }) => [
                            styles.remindInlineBtn,
                            {
                              backgroundColor: isDark
                                ? 'rgba(239,68,68,0.18)'
                                : '#FEE2E2',
                              borderColor: isDark
                                ? 'rgba(239,68,68,0.4)'
                                : '#FCA5A5',
                            },
                            pressed && { opacity: 0.78, transform: [{ scale: 0.97 }] },
                          ]}>
                          <Ionicons name="logo-whatsapp" size={15} color={theme.danger} />
                          <Text style={[styles.remindInlineText, { color: theme.danger }]}>
                            {isUrdu ? 'یاد دہانی بھیجیں' : 'Remind'}
                          </Text>
                        </Pressable>
                      ) : (
                        <Ionicons name="chevron-forward" size={14} color={theme.textMuted} />
                      )}
                    </View>
                  ) : null}
                </Pressable>
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
    zIndex: 30,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    position: 'relative',
    zIndex: 40,
  },
  titleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleTextWrap: {
    gap: 1,
  },
  titleSpacer: {
    flex: 1,
  },
  headerFiltersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pillAnchor: {
    position: 'relative',
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
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
    borderCurve: 'continuous',
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  filterPillDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 25,
  },
  animatedFilterMenu: {
    position: 'absolute',
    top: 34,
    minWidth: 175,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    padding: 6,
    gap: 2,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 7,
    paddingHorizontal: 9,
    borderRadius: 10,
    borderCurve: 'continuous',
  },
  menuItemTextWrap: {
    flex: 1,
    gap: 1,
  },
  menuItemTitle: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  menuItemSub: {
    fontSize: 11,
    fontWeight: '500',
  },
  menuDivider: {
    height: 1,
    marginHorizontal: 6,
    marginVertical: 2,
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

  billsList: { gap: 9 },
  billCard: {
    borderRadius: 18,
    borderCurve: 'continuous',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 9,
  },
  billHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  payIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
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
    letterSpacing: -0.2,
  },
  billMeta: {
    fontSize: 12,
    fontWeight: '500',
  },
  billRightCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
    fontVariant: ['tabular-nums'],
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  statusPillText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  billFooterLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    borderTopWidth: 1,
    paddingTop: 8,
  },
  itemsPreviewText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '500',
    minWidth: 0,
  },
  remindInlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 38,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  remindInlineText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
