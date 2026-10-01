import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Sale } from '@/types';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';
import { formatCompactPrice } from '@/utils/formatters';
import {
  computeSalesAnalytics,
  ChartTimeframe,
  ChartBarItem,
} from '@/utils/analytics';

interface SalesChartProps {
  sales: Sale[];
}

export const SalesChart: React.FC<SalesChartProps> = ({ sales }) => {
  const { settings, language, t } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const [timeframe, setTimeframe] = useState<ChartTimeframe>('week');
  const [selectedBar, setSelectedBar] = useState<ChartBarItem | null>(null);

  const analytics = useMemo(() => {
    return computeSalesAnalytics(sales, timeframe, language);
  }, [sales, timeframe, language]);

  // Max value for bar scaling (at least 1 to avoid / 0)
  const maxRevenue = useMemo(() => {
    const max = Math.max(...analytics.bars.map((b) => b.revenue), 1);
    return max;
  }, [analytics.bars]);

  // Set default selected bar to peak or current
  React.useEffect(() => {
    const peak = analytics.bars.find((b) => b.isPeak);
    const current = analytics.bars.find((b) => b.isCurrent);
    setSelectedBar(peak || current || analytics.bars[analytics.bars.length - 1] || null);
  }, [timeframe, analytics]);

  const timeframeTabs: { key: ChartTimeframe; labelEn: string; labelUr: string; icon: string }[] = [
    { key: 'day', labelEn: 'Today', labelUr: 'آج', icon: 'time-outline' },
    { key: 'week', labelEn: 'Week', labelUr: 'ہفتہ', icon: 'calendar-outline' },
    { key: 'month', labelEn: 'Month', labelUr: 'مہینہ', icon: 'stats-chart-outline' },
  ];

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      {/* ── Header: Title + Filter Pills ── */}
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <View style={[styles.headerIconWrap, { backgroundColor: theme.primaryLight }]}>
            <Ionicons name="bar-chart" size={18} color={theme.primary} />
          </View>
          <View>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              {language === 'ur' ? 'سیلز گراف اور اینالیٹکس' : 'Sales Trends & Chart'}
            </Text>
            <Text style={[styles.cardSubtitle, { color: theme.textMuted }]}>
              {timeframe === 'day'
                ? (language === 'ur' ? 'آج کے اوقات کی سیلز' : "Today's hourly sales")
                : timeframe === 'week'
                ? (language === 'ur' ? 'گزشتہ 7 دنوں کی کارکردگی' : 'Last 7 days performance')
                : (language === 'ur' ? 'گزشتہ 4 ہفتوں کی سیلز' : 'Last 4 weeks breakdown')}
            </Text>
          </View>
        </View>

        {/* Filter Switcher */}
        <View style={[styles.filterGroup, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
          {timeframeTabs.map((tab) => {
            const isActive = timeframe === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => setTimeframe(tab.key)}
                style={[
                  styles.filterBtn,
                  isActive && [styles.filterBtnActive, { backgroundColor: theme.card }],
                ]}>
                <Text
                  style={[
                    styles.filterBtnText,
                    { color: isActive ? theme.primary : theme.textSecondary },
                    isActive && { fontWeight: '800' },
                  ]}>
                  {language === 'ur' ? tab.labelUr : tab.labelEn}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* ── Metric Snapshot Strip ── */}
      <View style={styles.snapshotRow}>
        <View>
          <Text style={[styles.snapshotLabel, { color: theme.textMuted }]}>
            {timeframe === 'day'
              ? (language === 'ur' ? 'آج کی کل سیلز' : "Today's Total Sales")
              : timeframe === 'week'
              ? (language === 'ur' ? 'اس ہفتے کی کل سیلز' : 'This Week Total')
              : (language === 'ur' ? 'اس ماہ کی کل سیلز' : 'This Month Total')}
          </Text>
          <View style={styles.amountWithTrend}>
            <Text style={[styles.snapshotAmount, { color: theme.text }]}>
              {settings.currencySymbol} {analytics.totalRevenue.toLocaleString()}
            </Text>
            {analytics.growthPercentage !== 0 && (
              <View
                style={[
                  styles.trendBadge,
                  {
                    backgroundColor:
                      analytics.growthPercentage > 0 ? theme.successLight : theme.dangerLight,
                  },
                ]}>
                <Ionicons
                  name={analytics.growthPercentage > 0 ? 'arrow-up' : 'arrow-down'}
                  size={12}
                  color={analytics.growthPercentage > 0 ? theme.success : theme.danger}
                />
                <Text
                  style={[
                    styles.trendText,
                    {
                      color:
                        analytics.growthPercentage > 0 ? theme.success : theme.danger,
                    },
                  ]}>
                  {Math.abs(analytics.growthPercentage)}%
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.snapshotRight}>
          <View style={[styles.metaChip, { backgroundColor: theme.surfaceSubtle }]}>
            <Ionicons name="receipt-outline" size={13} color={theme.textSecondary} />
            <Text style={[styles.metaChipText, { color: theme.textSecondary }]}>
              {analytics.totalOrders} {language === 'ur' ? 'بلز' : 'bills'}
            </Text>
          </View>
          {analytics.averageRevenue > 0 && (
            <View style={[styles.metaChip, { backgroundColor: theme.surfaceSubtle }]}>
              <Ionicons name="calculator-outline" size={13} color={theme.textSecondary} />
              <Text style={[styles.metaChipText, { color: theme.textSecondary }]}>
                {settings.currencySymbol} {formatCompactPrice(analytics.averageRevenue)}/
                {timeframe === 'day' ? (language === 'ur' ? 'وقت' : 'slot') : (language === 'ur' ? 'دن' : 'day')}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* ── Active Inspector Tooltip Callout ── */}
      {selectedBar && (
        <View
          style={[
            styles.tooltipBox,
            {
              backgroundColor: theme.surfaceSubtle,
              borderColor: selectedBar.isPeak ? theme.primary : theme.border,
            },
          ]}>
          <View style={styles.tooltipLeft}>
            <View
              style={[
                styles.tooltipDot,
                { backgroundColor: selectedBar.isPeak ? theme.primary : theme.textSecondary },
              ]}
            />
            <Text style={[styles.tooltipTitle, { color: theme.text }]}>
              {selectedBar.label} {selectedBar.subLabel && `(${selectedBar.subLabel})`}
              {selectedBar.isPeak && (
                <Text style={{ color: theme.primary, fontWeight: '800' }}>
                  {' '}★ {language === 'ur' ? 'بہترین' : 'Peak'}
                </Text>
              )}
            </Text>
          </View>

          <View style={styles.tooltipRight}>
            <Text style={[styles.tooltipRevenue, { color: theme.primary }]}>
              {settings.currencySymbol} {selectedBar.revenue.toLocaleString()}
            </Text>
            <Text style={[styles.tooltipOrders, { color: theme.textMuted }]}>
              {selectedBar.orderCount} {language === 'ur' ? 'بلز' : 'orders'}
            </Text>
          </View>
        </View>
      )}

      {/* ── The Visual Bars Chart Area ── */}
      <View style={styles.chartArea}>
        {/* Background Reference Lines */}
        <View style={styles.gridLinesContainer}>
          <View style={[styles.gridLine, { borderColor: theme.border }]} />
          <View style={[styles.gridLine, { borderColor: theme.border }]} />
          <View style={[styles.gridLine, { borderColor: theme.border }]} />
        </View>

        {/* Dynamic Interactive Columns */}
        <View style={styles.barsRow}>
          {analytics.bars.map((bar) => {
            const isSelected = selectedBar?.id === bar.id;
            const heightPercent = maxRevenue > 0 ? (bar.revenue / maxRevenue) * 100 : 0;
            const barHeight = Math.max(8, (heightPercent / 100) * 120);

            // Styling colors
            const barColor = isSelected
              ? theme.primary
              : bar.isPeak
              ? theme.primaryDark
              : bar.revenue > 0
              ? settings.darkMode
                ? 'rgba(99, 102, 241, 0.45)'
                : '#A5B4FC'
              : theme.border;

            return (
              <Pressable
                key={bar.id}
                onPress={() => setSelectedBar(bar)}
                style={styles.columnWrap}>
                {/* Value Label above Bar if selected or peak */}
                <View style={styles.barTopLabelWrap}>
                  {(isSelected || bar.isPeak) && bar.revenue > 0 ? (
                    <Text
                      style={[
                        styles.barTopText,
                        { color: isSelected ? theme.primary : theme.textSecondary },
                      ]}>
                      {formatCompactPrice(bar.revenue)}
                    </Text>
                  ) : null}
                </View>

                {/* The Bar Track + Fill Capsule */}
                <View style={styles.trackContainer}>
                  <View
                    style={[
                      styles.barFillCapsule,
                      {
                        height: barHeight,
                        backgroundColor: barColor,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        borderBottomLeftRadius: 4,
                        borderBottomRightRadius: 4,
                      },
                      isSelected && styles.barSelectedGlow,
                    ]}
                  />
                </View>

                {/* Bottom X-Axis Label */}
                <Text
                  style={[
                    styles.xAxisLabel,
                    {
                      color: isSelected
                        ? theme.primary
                        : bar.isCurrent
                        ? theme.text
                        : theme.textMuted,
                      fontWeight: isSelected || bar.isCurrent ? '800' : '500',
                    },
                  ]}
                  numberOfLines={1}>
                  {bar.label}
                </Text>

                {/* Today/Current dot indicator */}
                {bar.isCurrent && (
                  <View style={[styles.currentDot, { backgroundColor: theme.primary }]} />
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  cardSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  filterGroup: {
    flexDirection: 'row',
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    padding: 3,
    gap: 2,
  },
  filterBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  filterBtnActive: {
    ...Shadows.sm,
  },
  filterBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
  snapshotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  snapshotLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  amountWithTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  snapshotAmount: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '800',
  },
  snapshotRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  metaChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  tooltipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    marginBottom: Spacing.sm,
  },
  tooltipLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tooltipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  tooltipTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  tooltipRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tooltipRevenue: {
    fontSize: 13,
    fontWeight: '800',
  },
  tooltipOrders: {
    fontSize: 11,
  },
  chartArea: {
    height: 185,
    position: 'relative',
    justifyContent: 'flex-end',
    paddingTop: 16,
    paddingBottom: 8,
  },
  gridLinesContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingTop: 24,
    paddingBottom: 28,
  },
  gridLine: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderStyle: 'dashed',
    width: '100%',
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    zIndex: 2,
  },
  columnWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  barTopLabelWrap: {
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  barTopText: {
    fontSize: 10,
    fontWeight: '800',
  },
  trackContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 120,
  },
  barFillCapsule: {
    width: '58%',
    maxWidth: 24,
    minWidth: 14,
  },
  barSelectedGlow: {
    ...Platform.select({
      web: {
        boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)',
      },
      default: {
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 4,
      },
    }),
  },
  xAxisLabel: {
    fontSize: 10,
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  currentDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
});
