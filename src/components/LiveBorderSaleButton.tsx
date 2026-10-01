import React, { useEffect, useRef } from 'react';
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
import { BorderRadius } from '@/constants/theme';

interface LiveBorderSaleButtonProps {
  onPress: () => void;
  label: string;
  primaryColor: string;
  isDark: boolean;
}

/**
 * A radial beam segment extending from the center of the 260x260 rotator.
 * Rotating around its geometric center (130, 130) allows each segment
 * to accurately sweep across any point on the outer pill perimeter.
 */
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

export const LiveBorderSaleButton: React.FC<LiveBorderSaleButtonProps> = ({
  onPress,
  label,
  primaryColor,
  isDark,
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

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

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.outerShadowWrapper} pointerEvents="box-none">
      {/* Outer Pill Container (Clipped Border Mask) */}
      <View
        style={[
          styles.pillMask,
          {
            backgroundColor: isDark
              ? 'rgba(255, 255, 255, 0.16)'
              : 'rgba(16, 185, 129, 0.28)',
          },
        ]}>
        {/* Rotating Multi-Color Standout Beam Hub */}
        <View style={styles.beamCenterContainer} pointerEvents="none">
          <Animated.View
            style={[
              styles.rotatorHub,
              {
                transform: [{ rotate: spin }],
              },
            ]}>
            {/* Multi-color Standout Comet Beam */}
            {/* 1. Leading brilliant white core tip */}
            <BeamSegment angle={24} width={14} height={112} color="#FFFFFF" />
            {/* 2. Electric Cyan glow */}
            <BeamSegment angle={18} width={22} height={116} color="#38BDF8" />
            {/* 3. Vivid Neon Mint highlight */}
            <BeamSegment angle={6} width={28} height={118} color="#34D399" />
            {/* 4. Rich Bright Emerald body */}
            <BeamSegment angle={-8} width={32} height={118} color="#10B981" />
            {/* 5. Electric Gold accent */}
            <BeamSegment angle={-22} width={26} height={114} color="#FBBF24" />
            {/* 6. Warm Amber transition */}
            <BeamSegment angle={-36} width={20} height={106} color="#F59E0B" />
            {/* 7. Soft Electric Violet trailing tail */}
            <BeamSegment angle={-50} width={16} height={96} color="#818CF8" opacity={0.7} />
          </Animated.View>
        </View>

        {/* Inner Pressable Button (Sits snugly inside with 2.2px border clearance) */}
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityHint="Open new sale window directly on home"
          style={({ pressed }) => [
            styles.innerButton,
            { backgroundColor: primaryColor },
            pressed && styles.innerButtonPressed,
          ]}>
          <Ionicons name="cart" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>{label}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerShadowWrapper: {
    ...Platform.select({
      web: {
        boxShadow: '0 8px 22px rgba(16, 185, 129, 0.35)',
      },
      default: {
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 8,
      },
    }),
  },
  pillMask: {
    borderRadius: BorderRadius.full,
    padding: 2.2, // 2.2px precision border width
    position: 'relative',
    overflow: 'hidden',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.full,
  },
  innerButtonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.96 }],
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
