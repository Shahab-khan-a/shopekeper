import { Sale } from '@/types';

export type ChartTimeframe = 'day' | 'week' | 'month';

export interface ChartBarItem {
  id: string;
  label: string;
  labelUrdu?: string;
  subLabel?: string;
  revenue: number;
  profit: number;
  orderCount: number;
  isPeak?: boolean;
  isCurrent?: boolean;
}

export interface AnalyticsSummary {
  timeframe: ChartTimeframe;
  totalRevenue: number;
  totalProfit: number;
  totalOrders: number;
  averageRevenue: number;
  growthPercentage: number; // e.g. +14 or -5
  peakLabel: string;
  peakRevenue: number;
  bars: ChartBarItem[];
}

export interface PaymentMixSummary {
  cash: number;
  online: number;
  udhaar: number;
  total: number;
  cashPercent: number;
  onlinePercent: number;
  udhaarPercent: number;
}

/**
 * Filter out refunded and cancelled sales for financial analytics.
 */
function getValidSales(sales: Sale[]): Sale[] {
  return sales.filter((s) => s.status !== 'refunded' && s.status !== 'cancelled' && !s.refundedAt);
}

/**
 * Computes sales analytics for Day (hourly), Week (last 7 days), and Month (last 30 days / 4 weeks).
 */
export function computeSalesAnalytics(
  sales: Sale[],
  timeframe: ChartTimeframe,
  language: 'en' | 'ur' = 'en'
): AnalyticsSummary {
  const validSales = getValidSales(sales);
  const now = new Date();

  if (timeframe === 'day') {
    return computeDayAnalytics(validSales, now, language);
  } else if (timeframe === 'week') {
    return computeWeekAnalytics(validSales, now, language);
  } else {
    return computeMonthAnalytics(validSales, now, language);
  }
}

/**
 * Day Analytics: Group today's sales into key time slots:
 * Morning (8 AM - 12 PM), Noon (12 PM - 3 PM), Afternoon (3 PM - 6 PM), Evening (6 PM - 9 PM), Night (9 PM - 12 AM)
 */
function computeDayAnalytics(sales: Sale[], now: Date, language: 'en' | 'ur'): AnalyticsSummary {
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
  const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);

  const todaySales = sales.filter((s) => {
    const d = new Date(s.date);
    return d >= todayStart && d < todayEnd;
  });

  const yesterdaySales = sales.filter((s) => {
    const d = new Date(s.date);
    return d >= yesterdayStart && d < todayStart;
  });

  const slots = [
    { id: 'morning', label: '8-11 AM', labelUrdu: 'صبح', minH: 8, maxH: 11 },
    { id: 'noon', label: '11-2 PM', labelUrdu: 'دوپہر', minH: 11, maxH: 14 },
    { id: 'afternoon', label: '2-5 PM', labelUrdu: 'سہ پہر', minH: 14, maxH: 17 },
    { id: 'evening', label: '5-8 PM', labelUrdu: 'شام', minH: 17, maxH: 20 },
    { id: 'night', label: '8-11 PM', labelUrdu: 'رات', minH: 20, maxH: 24 },
  ];

  const currentHour = now.getHours();

  const bars: ChartBarItem[] = slots.map((slot) => {
    const slotSales = todaySales.filter((s) => {
      const h = new Date(s.date).getHours();
      return h >= slot.minH && h < slot.maxH;
    });

    const revenue = slotSales.reduce((sum, s) => sum + s.grandTotal, 0);
    const profit = slotSales.reduce((sum, s) => sum + (s.totalProfit || 0), 0);

    return {
      id: slot.id,
      label: language === 'ur' ? slot.labelUrdu : slot.label,
      subLabel: `${slot.minH}:00`,
      revenue,
      profit,
      orderCount: slotSales.length,
      isCurrent: currentHour >= slot.minH && currentHour < slot.maxH,
    };
  });

  // Calculate peak
  let peak = bars[0];
  bars.forEach((b) => {
    if (b.revenue > peak.revenue) peak = b;
  });
  if (peak.revenue > 0) peak.isPeak = true;

  const totalRevenue = todaySales.reduce((a, b) => a + b.grandTotal, 0);
  const totalProfit = todaySales.reduce((a, b) => a + (b.totalProfit || 0), 0);
  const yesterdayRevenue = yesterdaySales.reduce((a, b) => a + b.grandTotal, 0);

  const growthPercentage = yesterdayRevenue > 0
    ? Math.round(((totalRevenue - yesterdayRevenue) / yesterdayRevenue) * 100)
    : totalRevenue > 0 ? 100 : 0;

  return {
    timeframe: 'day',
    totalRevenue,
    totalProfit,
    totalOrders: todaySales.length,
    averageRevenue: bars.length > 0 ? Math.round(totalRevenue / bars.length) : 0,
    growthPercentage,
    peakLabel: peak.revenue > 0 ? peak.label : '-',
    peakRevenue: peak.revenue,
    bars,
  };
}

/**
 * Week Analytics: Last 7 Days (e.g. Mon, Tue, Wed, Thu, Fri, Sat, Sun)
 */
function computeWeekAnalytics(sales: Sale[], now: Date, language: 'en' | 'ur'): AnalyticsSummary {
  const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayNamesUr = ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];

  const bars: ChartBarItem[] = [];
  const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
  const fourteenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 13);

  for (let i = 6; i >= 0; i--) {
    const dayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const dayStart = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate());
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

    const daySales = sales.filter((s) => {
      const d = new Date(s.date);
      return d >= dayStart && d < dayEnd;
    });

    const revenue = daySales.reduce((sum, s) => sum + s.grandTotal, 0);
    const profit = daySales.reduce((sum, s) => sum + (s.totalProfit || 0), 0);
    const dayIdx = dayDate.getDay();

    bars.push({
      id: `day-${i}`,
      label: language === 'ur' ? dayNamesUr[dayIdx] : dayNamesEn[dayIdx],
      subLabel: `${dayDate.getDate()}/${dayDate.getMonth() + 1}`,
      revenue,
      profit,
      orderCount: daySales.length,
      isCurrent: i === 0,
    });
  }

  // Find peak day
  let peak = bars[0];
  bars.forEach((b) => {
    if (b.revenue > peak.revenue) peak = b;
  });
  if (peak.revenue > 0) peak.isPeak = true;

  // Previous week comparison
  const thisWeekSales = sales.filter((s) => {
    const d = new Date(s.date);
    return d >= sevenDaysAgo && d <= now;
  });
  const prevWeekSales = sales.filter((s) => {
    const d = new Date(s.date);
    return d >= fourteenDaysAgo && d < sevenDaysAgo;
  });

  const totalRevenue = thisWeekSales.reduce((a, b) => a + b.grandTotal, 0);
  const totalProfit = thisWeekSales.reduce((a, b) => a + (b.totalProfit || 0), 0);
  const prevRevenue = prevWeekSales.reduce((a, b) => a + b.grandTotal, 0);

  const growthPercentage = prevRevenue > 0
    ? Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100)
    : totalRevenue > 0 ? 100 : 0;

  return {
    timeframe: 'week',
    totalRevenue,
    totalProfit,
    totalOrders: thisWeekSales.length,
    averageRevenue: Math.round(totalRevenue / 7),
    growthPercentage,
    peakLabel: peak.revenue > 0 ? peak.label : '-',
    peakRevenue: peak.revenue,
    bars,
  };
}

/**
 * Month Analytics: 4 weekly blocks of the last 28 days
 */
function computeMonthAnalytics(sales: Sale[], now: Date, language: 'en' | 'ur'): AnalyticsSummary {
  const bars: ChartBarItem[] = [];
  const twentyEightDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 27);
  const fiftySixDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 55);

  const weekLabelsEn = ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'];
  const weekLabelsUr = ['ہفتہ 1', 'ہفتہ 2', 'ہفتہ 3', 'ہفتہ 4'];

  for (let w = 3; w >= 0; w--) {
    const blockStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (w * 7 + 6));
    const blockEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (w * 7) + 1);

    const blockSales = sales.filter((s) => {
      const d = new Date(s.date);
      return d >= blockStart && d < blockEnd;
    });

    const revenue = blockSales.reduce((sum, s) => sum + s.grandTotal, 0);
    const profit = blockSales.reduce((sum, s) => sum + (s.totalProfit || 0), 0);
    const labelIdx = 3 - w;

    bars.push({
      id: `week-${w}`,
      label: language === 'ur' ? weekLabelsUr[labelIdx] : weekLabelsEn[labelIdx],
      subLabel: `${blockStart.getDate()}-${blockEnd.getDate()}`,
      revenue,
      profit,
      orderCount: blockSales.length,
      isCurrent: w === 0,
    });
  }

  let peak = bars[0];
  bars.forEach((b) => {
    if (b.revenue > peak.revenue) peak = b;
  });
  if (peak.revenue > 0) peak.isPeak = true;

  const thisMonthSales = sales.filter((s) => {
    const d = new Date(s.date);
    return d >= twentyEightDaysAgo && d <= now;
  });
  const prevMonthSales = sales.filter((s) => {
    const d = new Date(s.date);
    return d >= fiftySixDaysAgo && d < twentyEightDaysAgo;
  });

  const totalRevenue = thisMonthSales.reduce((a, b) => a + b.grandTotal, 0);
  const totalProfit = thisMonthSales.reduce((a, b) => a + (b.totalProfit || 0), 0);
  const prevRevenue = prevMonthSales.reduce((a, b) => a + b.grandTotal, 0);

  const growthPercentage = prevRevenue > 0
    ? Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100)
    : totalRevenue > 0 ? 100 : 0;

  return {
    timeframe: 'month',
    totalRevenue,
    totalProfit,
    totalOrders: thisMonthSales.length,
    averageRevenue: Math.round(totalRevenue / 4),
    growthPercentage,
    peakLabel: peak.revenue > 0 ? peak.label : '-',
    peakRevenue: peak.revenue,
    bars,
  };
}

/**
 * Calculates payment mix distribution (Cash vs Online vs Udhaar) for today's sales.
 */
export function computeTodayPaymentMix(sales: Sale[]): PaymentMixSummary {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todaySales = getValidSales(sales).filter((s) => new Date(s.date) >= todayStart);

  let cash = 0;
  let online = 0;
  let udhaar = 0;

  todaySales.forEach((s) => {
    if (s.paymentMethod === 'cash') cash += s.grandTotal;
    else if (s.paymentMethod === 'online') online += s.grandTotal;
    else if (s.paymentMethod === 'udhaar') udhaar += s.grandTotal;
  });

  const total = cash + online + udhaar;

  return {
    cash,
    online,
    udhaar,
    total,
    cashPercent: total > 0 ? Math.round((cash / total) * 100) : 0,
    onlinePercent: total > 0 ? Math.round((online / total) * 100) : 0,
    udhaarPercent: total > 0 ? Math.round((udhaar / total) * 100) : 0,
  };
}
