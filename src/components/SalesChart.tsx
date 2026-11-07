import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
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
  const isUrdu = language === 'ur';
  const softBorder = settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(148, 163, 184, 0.2)';

  const [timeframe, setTimeframe] = useState<ChartTimeframe>('week');
  const [selectedBar, setSelectedBar] = useState<ChartBarItem | null>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const menuAnim = useRef(new Animated.Value(0)).current;

  const openMenu = () => {
    setIsMenuMounted(true);
    setIsMenuOpen(true);
    Animated.spring(menuAnim, {
      toValue: 1,
      damping: 20,
      stiffness: 240,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    Animated.timing(menuAnim, {
      toValue: 0,
      duration: 140,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setIsMenuMounted(false);
    });
  };

  const toggleMenu = () => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const handleSelectTimeframe = (selected: ChartTimeframe) => {
    setTimeframe(selected);
    closeMenu();
  };

  const chevronRotate = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const menuScale = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1],
  });

  const menuTranslateY = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-6, 0],
  });

  const timeframeOptions: {
    key: ChartTimeframe;
    label: string;
  }[] = [
    { key: 'day', label: isUrdu ? 'آج' : 'Today' },
    { key: 'week', label: isUrdu ? 'ہفتہ' : 'Week' },
    { key: 'month', label: isUrdu ? 'مہینہ' : 'Month' },
  ];

  const analytics = useMemo(() => {
    return computeSalesAnalytics(sales, timeframe, language);
  }, [sales, timeframe, language]);

  // Max value for bar scaling (at least 1 to avoid / 0)
  const maxRevenue = useMemo(() => {
    const max = Math.max(...analytics.bars.map((b) => b.revenue), 1);
    return max;
  }, [analytics.bars]);

  // Set default selected bar to peak or current
  useEffect(() => {
    const peak = analytics.bars.find((b) => b.isPeak);
    const current = analytics.bars.find((b) => b.isCurrent);
    setSelectedBar(peak || current || analytics.bars[analytics.bars.length - 1] || null);
  }, [timeframe, analytics]);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: softBorder,
          borderWidth: 1,
          zIndex: isMenuMounted ? 100 : 1,
        },
      ]}>
      {isMenuMounted && (
        <Pressable
          style={styles.menuBackdrop}
          onPress={closeMenu}
          accessibilityLabel="Close timeframe menu"
        />
      )}

      {/* ── Header: Title + Action pill with dropdown ── */}
      <View style={styles.headerRow}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          {isUrdu ? 'سیلز گراف اور اینالیٹکس' : 'Sales Trends & Chart'}
        </Text>

        <View style={[styles.pillAnchor, { zIndex: isMenuMounted ? 60 : 40 }]}>
          <Pressable
            onPress={toggleMenu}
            accessibilityRole="button"
            accessibilityLabel={isUrdu ? 'ٹائم فریم فلٹر مینو' : 'Timeframe filter menu'}
            style={({ pressed }) => [
              styles.actionPill,
              { backgroundColor: theme.primaryLight },
              pressed && { opacity: 0.8 },
            ]}>
            <Text style={[styles.actionPillText, { color: theme.primary }]}>
              {timeframe === 'day'
                ? (isUrdu ? 'آج' : 'Today')
                : timeframe === 'week'
                ? (isUrdu ? 'ہفتہ' : 'Week')
                : (isUrdu ? 'مہینہ' : 'Month')}
            </Text>
            <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
              <Ionicons name="chevron-down" size={13} color={theme.primary} />
            </Animated.View>
          </Pressable>

          {isMenuMounted && (
            <Animated.View
              style={[
                styles.animatedDropdownMenu,
                {
                  backgroundColor: theme.card,
                  borderColor: softBorder,
                  opacity: menuAnim,
                  transform: [
                    { translateY: menuTranslateY },
                    { scale: menuScale },
                  ],
                  right: isUrdu ? undefined : 0,
                  left: isUrdu ? 0 : undefined,
                },
              ]}>
              {timeframeOptions.map((opt) => {
                const isSelected = timeframe === opt.key;
                return (
                  <Pressable
                    key={opt.key}
                    onPress={() => handleSelectTimeframe(opt.key)}
                    style={({ pressed }) => [
                      styles.menuItem,
                      isSelected && {
                        backgroundColor: settings.darkMode
                          ? 'rgba(255, 255, 255, 0.08)'
                          : theme.primaryLight,
                      },
                      pressed && { opacity: 0.7 },
                    ]}>
                    <Text
                      style={[
                        styles.menuItemTitle,
                        {
                          color: isSelected ? theme.primary : theme.text,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}>
                      {opt.label}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={13} color={theme.primary} />
                    )}
                  </Pressable>
                );
              })}
            </Animated.View>
          )}
        </View>
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
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  actionPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  pillAnchor: {
    position: 'relative',
    zIndex: 50,
  },
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 45,
    borderRadius: 16,
  },
  animatedDropdownMenu: {
    position: 'absolute',
    top: '100%',
    marginTop: 4,
    minWidth: 104,
    borderRadius: 12,
    borderCurve: 'continuous',
    borderWidth: 1,
    padding: 3,
    gap: 1,
    zIndex: 60,
    ...Shadows.sm,
    elevation: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 9,
    borderRadius: 8,
    gap: 6,
  },
  menuItemTitle: {
    fontSize: 12,
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
