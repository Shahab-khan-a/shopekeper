import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Platform,
  Dimensions,
  LayoutChangeEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShop } from '@/context/ShopContext';
import { ActiveTab } from '@/types';
import { Colors } from '@/constants/theme';

interface TabConfig {
  key: ActiveTab;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
}

// Symmetrical, wide mathematical S-curve wave dimensions
const WAVE_WIDTH = 140; // Wide sweeping span matching user's drawing
const CIRCLE_SIZE = 50;
const HUMP_RISE = 22; // Wave peak crest height above the bar top line
const BAR_HEIGHT = 64;
const STEP = 0.5; // High-density 0.5px vertical slices (280 blocks) so steps/pixels are virtually invisible
const COLUMN_COUNT = Math.floor(WAVE_WIDTH / STEP);

// Pre-computed mathematical bell-curve / Witch of Agnesi profile: y(x) = H / (1 + (x/a)^4)
// Perfectly symmetrical (y(-x) = y(x)), smooth horizontal crest at center, smooth horizontal tails at ends
const WAVE_SLICES = Array.from({ length: COLUMN_COUNT }, (_, i) => {
  const x = i * STEP + STEP / 2 - WAVE_WIDTH / 2;
  const h = HUMP_RISE / (1 + Math.pow(x / 25, 4));
  return {
    left: i * STEP,
    height: Math.round((h + 12) * 100) / 100, // 12px overlap down into the main bar
  };
});

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, t, settings, lowStockProducts } = useShop();

  if (activeTab === 'settings') {
    return null;
  }

  const insets = useSafeAreaInsets();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  // Clean white bar in light mode, dark surface in dark mode
  const barBgColor = settings.darkMode ? '#1E293B' : '#FFFFFF';
  const inactiveTextColor = settings.darkMode ? '#94A3B8' : '#64748B';
  const activeTextColor = theme.primary;

  const tabs: TabConfig[] = useMemo(
    () => [
      { key: 'dashboard', label: t('home'), icon: 'grid-outline', activeIcon: 'grid' },
      { key: 'products', label: t('products'), icon: 'layers-outline', activeIcon: 'layers' },
      { key: 'sale', label: t('sale'), icon: 'cart-outline', activeIcon: 'cart' },
      { key: 'history', label: t('history'), icon: 'receipt-outline', activeIcon: 'receipt' },
      { key: 'khata', label: t('khata'), icon: 'book-outline', activeIcon: 'book' },
    ],
    [t]
  );

  const initialIndex = tabs.findIndex((tab) => tab.key === activeTab);
  const [containerWidth, setContainerWidth] = useState(() => {
    const screenWidth = Dimensions.get('window').width;
    return Math.min(screenWidth, 680);
  });

  const tabWidth = containerWidth > 0 ? containerWidth / tabs.length : 70;

  // Animation values
  const animatedIndex = useRef(new Animated.Value(initialIndex >= 0 ? initialIndex : 0)).current;
  const circleScale = useRef(new Animated.Value(1)).current;
  const indicatorOpacity = useRef(new Animated.Value(initialIndex >= 0 ? 1 : 0)).current;

  // Smooth sliding animation when active tab changes
  useEffect(() => {
    const targetIndex = tabs.findIndex((t) => t.key === activeTab);
    if (targetIndex >= 0) {
      Animated.parallel([
        Animated.spring(animatedIndex, {
          toValue: targetIndex,
          damping: 18,
          stiffness: 160,
          mass: 0.85,
          overshootClamping: false,
          restDisplacementThreshold: 0.005,
          restSpeedThreshold: 0.005,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(indicatorOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.sequence([
          Animated.timing(circleScale, {
            toValue: 0.88,
            duration: 80,
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.spring(circleScale, {
            toValue: 1,
            friction: 4,
            tension: 70,
            useNativeDriver: Platform.OS !== 'web',
          }),
        ]),
      ]).start();
    } else {
      Animated.timing(indicatorOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    }
  }, [activeTab, tabs, animatedIndex, circleScale, indicatorOpacity]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && Math.abs(w - containerWidth) > 1) {
      setContainerWidth(w);
    }
  };

  // Interpolate horizontal position for the sliding wave + circle indicator
  const translateX = animatedIndex.interpolate({
    inputRange: tabs.map((_, i) => i),
    outputRange: tabs.map((_, i) => i * tabWidth + tabWidth / 2 - WAVE_WIDTH / 2),
  });

  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'ios' ? 8 : 4);

  return (
    <View style={[styles.wrapper, { backgroundColor: barBgColor }]}>
      <View style={[styles.container, { paddingBottom: bottomPadding }]} onLayout={handleLayout}>
        {/* Sliding Indicator (Smooth Wide Symmetrical S-Curve Wave + Elevated Active Circle) */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.indicatorWrap,
            {
              opacity: indicatorOpacity,
              transform: [{ translateX }],
            },
          ]}>
          {/* Symmetrical High-Density Mathematical Wave Mound */}
          <View style={styles.waveMound}>
            {WAVE_SLICES.map((slice, idx) => (
              <View
                key={idx}
                style={[
                  styles.waveSlice,
                  {
                    left: slice.left,
                    height: slice.height,
                    backgroundColor: barBgColor,
                  },
                ]}
              />
            ))}
          </View>

          {/* Elevated Active Circle Button */}
          <Animated.View
            style={[
              styles.activeCircle,
              {
                backgroundColor: theme.primary,
                transform: [{ scale: circleScale }],
              },
            ]}>
            {tabs.map((tab, idx) => {
              const iconOpacity = animatedIndex.interpolate({
                inputRange: [idx - 0.5, idx, idx + 0.5],
                outputRange: [0, 1, 0],
                extrapolate: 'clamp',
              });
              const iconScale = animatedIndex.interpolate({
                inputRange: [idx - 0.5, idx, idx + 0.5],
                outputRange: [0.7, 1, 0.7],
                extrapolate: 'clamp',
              });

              return (
                <Animated.View
                  key={tab.key}
                  pointerEvents="none"
                  style={[
                    StyleSheet.absoluteFillObject,
                    styles.circleIconCenter,
                    {
                      opacity: iconOpacity,
                      transform: [{ scale: iconScale }],
                    },
                  ]}>
                  <Ionicons name={tab.activeIcon} size={24} color="#FFFFFF" />
                  {tab.key === 'products' && lowStockProducts.length > 0 && (
                    <View style={[styles.activeMiniBadge, { backgroundColor: theme.danger }]} />
                  )}
                </Animated.View>
              );
            })}
          </Animated.View>
        </Animated.View>

        {/* Tab Touch Target Row with Icons and Labels */}
        <View style={styles.tabsRow}>
          {tabs.map((tab, idx) => {
            const isTabActive = activeTab === tab.key;

            // Inactive icon scales down and fades out under the sliding active circle
            const inactiveIconOpacity = animatedIndex.interpolate({
              inputRange: [idx - 0.5, idx, idx + 0.5],
              outputRange: [1, 0, 1],
              extrapolate: 'clamp',
            });
            const inactiveIconScale = animatedIndex.interpolate({
              inputRange: [idx - 0.5, idx, idx + 0.5],
              outputRange: [1, 0.6, 1],
              extrapolate: 'clamp',
            });

            return (
              <Pressable
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                accessibilityLabel={tab.label}
                accessibilityRole="tab"
                accessibilityState={{ selected: isTabActive }}
                style={({ pressed }) => [
                  styles.tabItem,
                  pressed && { opacity: 0.7 },
                ]}>
                {/* Icon Container */}
                <View style={styles.iconContainer}>
                  <Animated.View
                    style={[
                      styles.iconWrapper,
                      {
                        opacity: inactiveIconOpacity,
                        transform: [{ scale: inactiveIconScale }],
                      },
                    ]}>
                    <Ionicons name={tab.icon} size={20} color={inactiveTextColor} />
                    {tab.key === 'products' && lowStockProducts.length > 0 && (
                      <View style={[styles.inactiveMiniBadge, { backgroundColor: theme.danger }]} />
                    )}
                  </Animated.View>
                </View>

                {/* Tab Name Label */}
                <Text
                  numberOfLines={1}
                  style={[
                    styles.tabLabel,
                    {
                      color: isTabActive ? activeTextColor : inactiveTextColor,
                      fontWeight: isTabActive ? '800' : '600',
                    },
                  ]}>
                  {tab.label}
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
  wrapper: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
    zIndex: 30,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, 0.06)',
    marginBottom: 16,
  },
  container: {
    width: '100%',
    maxWidth: 680,
    position: 'relative',
    height: BAR_HEIGHT,
  },
  indicatorWrap: {
    position: 'absolute',
    top: -HUMP_RISE,
    left: 0,
    width: WAVE_WIDTH,
    height: HUMP_RISE + BAR_HEIGHT,
    alignItems: 'center',
    zIndex: 10,
  },
  waveMound: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: WAVE_WIDTH,
    height: HUMP_RISE + 12,
  },
  waveSlice: {
    position: 'absolute',
    bottom: 0,
    width: STEP + 0.3, // sub-pixel overlap guarantees seamless solid fill
  },
  activeCircle: {
    position: 'absolute',
    top: 3,
    left: (WAVE_WIDTH - CIRCLE_SIZE) / 2,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 5px 14px rgba(5, 150, 105, 0.35)',
      },
      default: {
        shadowColor: '#059669',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 8,
      },
    }),
  },
  circleIconCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: BAR_HEIGHT,
    width: '100%',
    zIndex: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: BAR_HEIGHT,
    paddingVertical: 4,
  },
  iconContainer: {
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },
  tabLabel: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
    letterSpacing: 0.1,
  },
  inactiveMiniBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  activeMiniBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});
