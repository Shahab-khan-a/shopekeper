import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  Easing,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Shadows } from '@/constants/theme';

interface RainbowQuickActionFabProps {
  onNewSale: () => void;
  onAddProduct: () => void;
  onDayEnd: () => void;
  onSettings: () => void;
  primaryColor: string;
  isDark: boolean;
  language?: string;
}

interface VerticalActionConfig {
  id: string;
  labelEn: string;
  labelUr: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
  targetY: number;
  onPress: () => void;
}

// 7-segment multi-color radial comet beam
const BeamSegment: React.FC<{
  angle: number;
  width: number;
  height?: number;
  color: string;
  opacity?: number;
}> = ({ angle, width, height = 118, color, opacity = 1 }) => (
  <View
    pointerEvents="none"
    style={{
      position: 'absolute',
      width,
      height: 240,
      left: 130 - width / 2,
      top: 10,
      transform: [{ rotate: `${angle}deg` }],
      opacity,
    }}>
    <View
      style={{
        width,
        height,
        borderRadius: width / 2,
        backgroundColor: color,
      }}
    />
  </View>
);

export const RainbowQuickActionFab: React.FC<RainbowQuickActionFabProps> = ({
  onNewSale,
  onAddProduct,
  onDayEnd,
  onSettings,
  primaryColor,
  isDark,
  language = 'en',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const toggleAnim = useRef(new Animated.Value(0)).current;

  // Staggered vertical animation values (4 items stacked on top)
  const itemAnims = useRef(
    Array.from({ length: 4 }, () => new Animated.Value(0))
  ).current;

  // Continuous background rotating comet beam
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2600,
        easing: Easing.linear,
        useNativeDriver: Platform.OS !== 'web',
      })
    );
    loop.start();
    return () => loop.stop();
  }, [rotateAnim]);

  // Handle open / close transitions with spring cascade
  useEffect(() => {
    if (isOpen) {
      // Toggle rotation & backdrop
      Animated.spring(toggleAnim, {
        toValue: 1,
        damping: 14,
        stiffness: 260,
        useNativeDriver: Platform.OS !== 'web',
      }).start();

      // Cascade items upward (bottom to top, 35ms stagger)
      const animations = itemAnims.map((anim, index) =>
        Animated.sequence([
          Animated.delay(index * 35),
          Animated.spring(anim, {
            toValue: 1,
            damping: 13,
            stiffness: 260,
            mass: 0.8,
            useNativeDriver: Platform.OS !== 'web',
          }),
        ])
      );
      Animated.parallel(animations).start();
    } else {
      Animated.spring(toggleAnim, {
        toValue: 0,
        damping: 16,
        stiffness: 280,
        useNativeDriver: Platform.OS !== 'web',
      }).start();

      // Reverse cascade downward
      const animations = itemAnims
        .slice()
        .reverse()
        .map((anim, index) =>
          Animated.sequence([
            Animated.delay(index * 25),
            Animated.timing(anim, {
              toValue: 0,
              duration: 150,
              easing: Easing.in(Easing.cubic),
              useNativeDriver: Platform.OS !== 'web',
            }),
          ])
        );
      Animated.parallel(animations).start();
    }
  }, [isOpen, toggleAnim, itemAnims]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const fabRotation = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '135deg'],
  });

  // Vertical line layout: 4 quick action buttons stacked on top of each other
  const actions: VerticalActionConfig[] = [
    {
      id: 'new_sale',
      labelEn: 'New Sale',
      labelUr: '\u0646\u0626\u06CC \u0633\u06CC\u0644',
      icon: 'cart',
      color: '#10B981',
      bgColor: '#ECFDF5',
      targetY: -92,
      onPress: () => {
        setIsOpen(false);
        onNewSale();
      },
    },
    {
      id: 'add_product',
      labelEn: 'Add Item',
      labelUr: '\u0646\u06CC\u0627 \u0622\u0626\u0679\u0645',
      icon: 'add-circle',
      color: '#6366F1',
      bgColor: '#EEF2FF',
      targetY: -184,
      onPress: () => {
        setIsOpen(false);
        onAddProduct();
      },
    },
    {
      id: 'day_end',
      labelEn: 'Day End',
      labelUr: '\u062f\u0646 \u06a9\u0627 \u0627\u062E\u062a\u062a\u0627\u0645',
      icon: 'moon',
      color: '#8B5CF6',
      bgColor: '#F5F3FF',
      targetY: -276,
      onPress: () => {
        setIsOpen(false);
        onDayEnd();
      },
    },
    {
      id: 'settings',
      labelEn: 'Settings',
      labelUr: '\u0633\u06CC\u0679\u0646\u06af\u0632',
      icon: 'settings',
      color: '#0284C7',
      bgColor: '#E0F2FE',
      targetY: -368,
      onPress: () => {
        setIsOpen(false);
        onSettings();
      },
    },
  ];

  return (
    <>
      {/* Dimmed backdrop when menu is open */}
      {isOpen && (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setIsOpen(false)}>
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: 'rgba(0, 0, 0, 0.42)',
                opacity: toggleAnim,
              },
            ]}
          />
        </Pressable>
      )}

      {/* Floating Rainbow Action Container (Bottom-Right Anchor) */}
      <View style={styles.anchorWrapper} pointerEvents="box-none">
        {/* Vertical Stack: Quick action buttons stacked in one vertical line on top */}
        {actions.map((act, index) => {
          const anim = itemAnims[index];

          const translateY = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, act.targetY],
          });

          const scale = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.2, 1],
          });

          const label = language === 'ur' ? act.labelUr : act.labelEn;

          return (
            <Animated.View
              key={act.id}
              pointerEvents={isOpen ? 'auto' : 'none'}
              style={[
                styles.verticalItemContainer,
                {
                  opacity: anim,
                  transform: [{ translateY }, { scale }],
                },
              ]}>
              {/* Bigger action button */}
              <Pressable
                onPress={act.onPress}
                accessibilityRole="button"
                accessibilityLabel={label}
                style={({ pressed }) => [
                  styles.verticalItemButton,
                  {
                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.08)',
                  },
                  pressed && { transform: [{ scale: 0.92 }] },
                ]}>
                <View style={[styles.itemIconWrap, { backgroundColor: act.bgColor }]}>
                  <Ionicons name={act.icon} size={22} color={act.color} />
                </View>
              </Pressable>

              {/* Action text under button with natural wrap */}
              <View
                style={[
                  styles.actionTextWrap,
                  {
                    backgroundColor: isDark ? 'rgba(15, 23, 42, 0.94)' : 'rgba(255, 255, 255, 0.96)',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
                  },
                ]}>
                <Text
                  style={[
                    styles.actionLabelText,
                    { color: isDark ? '#F8FAFC' : '#1E293B' },
                  ]}>
                  {label}
                </Text>
              </View>
            </Animated.View>
          );
        })}

        {/* Main Floating Trigger Button with Rainbow Comet Beam */}
        <View style={styles.outerShadowWrapper} pointerEvents="box-none">
          <View
            style={[
              styles.pillMask,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.16)'
                  : 'rgba(16, 185, 129, 0.28)',
              },
            ]}>
            {/* Rotating Rainbow Comet Beam Hub */}
            <View style={styles.beamCenterContainer} pointerEvents="none">
              <Animated.View
                style={[
                  styles.rotatorHub,
                  {
                    transform: [{ rotate: spin }],
                  },
                ]}>
                <BeamSegment angle={24} width={14} height={112} color="#FFFFFF" />
                <BeamSegment angle={18} width={22} height={116} color="#38BDF8" />
                <BeamSegment angle={6} width={28} height={118} color="#34D399" />
                <BeamSegment angle={-8} width={32} height={118} color="#10B981" />
                <BeamSegment angle={-22} width={26} height={114} color="#FBBF24" />
                <BeamSegment angle={-36} width={20} height={106} color="#F59E0B" />
                <BeamSegment angle={-50} width={16} height={96} color="#818CF8" opacity={0.7} />
              </Animated.View>
            </View>

            {/* Inner Pressable Trigger */}
            <Pressable
              onPress={() => setIsOpen((prev) => !prev)}
              accessibilityRole="button"
              accessibilityLabel={isOpen ? 'Close quick actions' : 'Open quick actions'}
              style={({ pressed }) => [
                styles.innerButton,
                { backgroundColor: isOpen ? '#1F2937' : primaryColor },
                pressed && styles.innerButtonPressed,
              ]}>
              <Animated.View style={{ transform: [{ rotate: fabRotation }] }}>
                <Ionicons
                  name={isOpen ? 'close' : 'flash'}
                  size={24}
                  color="#FFFFFF"
                />
              </Animated.View>
            </Pressable>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  anchorWrapper: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 60,
  },
  outerShadowWrapper: {
    ...Platform.select({
      web: {
        boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
      },
      default: {
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.38,
        shadowRadius: 10,
        elevation: 10,
      },
    }),
  },
  pillMask: {
    width: 62,
    height: 62,
    borderRadius: 31,
    padding: 2.4,
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  beamCenterContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rotatorHub: {
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerButton: {
    width: 57,
    height: 57,
    borderRadius: 28.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.94 }],
  },
  verticalItemContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
  },
  verticalItemButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.18)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.24,
        shadowRadius: 6,
        elevation: 6,
      },
    }),
  },
  itemIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTextWrap: {
    marginTop: 4,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 7,
    borderWidth: 0.5,
    maxWidth: 96,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  actionLabelText: {
    fontSize: 10.5,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.1,
    lineHeight: 13,
  },
});
