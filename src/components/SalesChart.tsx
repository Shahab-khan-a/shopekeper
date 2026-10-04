import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Sale } from '@/types';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';
import {
  computeSalesAnalytics,
  ChartTimeframe,
  ChartBarItem,
} from '@/utils/analytics';

interface SalesChartProps {
  sales: Sale[];
}

export const SalesChart: React.FC<SalesChartProps> = ({ sales }) => {
  const { settings, language } = useShop();
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

  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      {/* ── Header: Title + Action pill ── */}
      <View style={styles.headerRow}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          {language === 'ur' ? 'سیلز گراف اور اینالیٹکس' : 'Sales Trends & Chart'}
        </Text>

        <Pressable
          onPress={() => {
            const order: ChartTimeframe[] = ['day', 'week', 'month'];
            const next = order[(order.indexOf(timeframe) + 1) % order.length];
            setTimeframe(next);
          }}
          style={({ pressed }) => [
            styles.actionPill,
            { backgroundColor: theme.primaryLight },
            pressed && { opacity: 0.8 },
          ]}>
          <Text style={[styles.actionPillText, { color: theme.primary }]}>
            {timeframe === 'day'
              ? (language === 'ur' ? 'آج' : 'Today')
              : timeframe === 'week'
              ? (language === 'ur' ? 'ہفتہ' : 'Week')
              : (language === 'ur' ? 'مہینہ' : 'Month')}
          </Text>
          <Ionicons name="chevron-down" size={14} color={theme.primary} />
        </Pressable>
      </View>

      {/* ── The Visual Bars Chart Area ── */}
      <View style={styles.chartArea}>
        {/* Background Reference Lines */}
        <View style={styles.gridLinesContainer}>
          <View style={[styles.gridLine, { borderColor: theme.border }]} />
          <View style={[styles.gridLine, { borderColor: theme.border }]} />
          <View style={[styles.gridLine, { borderColor: theme.border }]} />
          <View style={[styles.gridLine, { borderColor: theme.border }]} />
        </View>

        {/* Dynamic Interactive Columns */}
        <View style={styles.barsRow}>
          {analytics.bars.map((bar) => {
            const isSelected = selectedBar?.id === bar.id;
            const heightPercent = maxRevenue > 0 ? (bar.revenue / maxRevenue) * 100 : 0;
            const barHeight = Math.max(4, (heightPercent / 100) * 110);

            const barColor = bar.revenue > 0
              ? (isSelected || bar.isPeak ? theme.primary : theme.primaryHover)
              : 'transparent';

            return (
              <Pressable
                key={bar.id}
                onPress={() => setSelectedBar(bar)}
                style={styles.columnWrap}>
                <View style={styles.trackContainer}>
                  {bar.revenue > 0 ? (
                    <View
                      style={[
                        styles.barFillCapsule,
                        {
                          height: barHeight,
                          backgroundColor: barColor,
                        },
                      ]}
                    />
                  ) : (
                    <View style={{ height: 4 }} />
                  )}
                </View>

                <Text
                  style={[
                    styles.xAxisLabel,
                    {
                      color: isSelected || bar.isCurrent ? theme.text : theme.textMuted,
                      fontWeight: isSelected || bar.isCurrent ? '700' : '500',
                    },
                  ]}
                  numberOfLines={1}>
                  {bar.label}
                </Text>
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
    borderRadius: 16,
    padding: 16,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    paddingRight: 8,
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  actionPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  chartArea: {
    height: 160,
    position: 'relative',
    justifyContent: 'flex-end',
    paddingTop: 8,
    paddingBottom: 4,
  },
  gridLinesContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 24,
  },
  gridLine: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: '100%',
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 130,
    zIndex: 2,
  },
  columnWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  trackContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 110,
  },
  barFillCapsule: {
    width: '52%',
    maxWidth: 28,
    minWidth: 14,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  xAxisLabel: {
    fontSize: 10,
    marginTop: 6,
    textAlign: 'center',
  },
});
