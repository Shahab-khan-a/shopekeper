import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius, Shadows } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';

interface TourBeaconProps {
  textUrdu: string;
  textEn: string;
  position?: 'top' | 'bottom' | 'header' | 'center';
  onSkip?: () => void;
}

export const TourBeacon: React.FC<TourBeaconProps> = ({
  textUrdu,
  textEn,
  position = 'top',
  onSkip,
}) => {
  const { language } = useShop();
  const isUrdu = language === 'ur';

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse glow animation
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );

    // Bouncing hand animation
    const bounceLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 4,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );

    pulseLoop.start();
    bounceLoop.start();

    return () => {
      pulseLoop.stop();
      bounceLoop.stop();
    };
  }, [pulseAnim, bounceAnim]);

  const activeText = isUrdu ? textUrdu : textEn;
  const isHeader = position === 'header';

  return (
    <View
      pointerEvents="box-none"
      style={[
        isHeader ? styles.containerHeader : styles.containerFloating,
        position === 'bottom' && styles.posBottom,
        position === 'top' && styles.posTop,
      ]}
    >
      <Animated.View
        style={[
          isHeader ? styles.beaconBanner : styles.beaconBubble,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <Animated.View style={{ transform: [{ translateY: bounceAnim }] }}>
          <Text style={styles.pointingIcon}>{position === 'bottom' ? '👆' : '👇'}</Text>
        </Animated.View>

        <View style={styles.textWrap}>
          <Text style={styles.beaconText} numberOfLines={2}>
            {activeText}
          </Text>
        </View>

        {onSkip && (
          <Pressable onPress={onSkip} hitSlop={10} style={styles.skipBtn}>
            <Ionicons name="close" size={15} color="#D1FAE5" />
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerFloating: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 99999,
  },
  containerHeader: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 4,
    zIndex: 9999,
  },
  posTop: {
    top: -50,
  },
  posBottom: {
    bottom: -50,
  },
  beaconBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#064E3B',
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: '#34D399',
    maxWidth: '92%',
    ...Shadows.lg,
  },
  beaconBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#064E3B',
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#34D399',
    width: '98%',
    maxWidth: 580,
    alignSelf: 'center',
    ...Shadows.lg,
  },
  pointingIcon: {
    fontSize: 18,
  },
  textWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  beaconText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  skipBtn: {
    marginLeft: 6,
    padding: 3,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
});
