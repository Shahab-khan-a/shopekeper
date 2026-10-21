import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';

interface ShopStoreLoaderProps {
  messageUrdu?: string;
  messageEn?: string;
  viewMode?: 'grid' | 'list';
}

export const ShopStoreLoader: React.FC<ShopStoreLoaderProps> = ({
  messageUrdu = 'دکان کی اشیاء لوڈ ہو رہی ہیں...',
  messageEn = 'Loading store products...',
  viewMode = 'grid',
}) => {
  const { settings, language } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const isUrdu = language === 'ur';

  // Shimmer & Pulse Animations
  const pulseAnim = useRef(new Animated.Value(0.4)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );

    const scaleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    pulseLoop.start();
    scaleLoop.start();

    return () => {
      pulseLoop.stop();
      scaleLoop.stop();
    };
  }, [pulseAnim, scaleAnim]);

  const skeletonBg = settings.darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(16, 185, 129, 0.09)';
  const skeletonCardBg = settings.darkMode ? theme.card : '#FFFFFF';
  const skeletonBorder = settings.darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(148, 163, 184, 0.3)';

  return (
    <View style={styles.container}>
      {/* ── Top Shopkeeper Pulse Banner ── */}
      <View style={[styles.topBanner, { backgroundColor: settings.darkMode ? '#064E3B' : '#ECFDF5', borderColor: '#34D399' }]}>
        <Animated.View style={[styles.iconWrap, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.iconCircle}>
            <Ionicons name="storefront" size={20} color="#059669" />
          </View>
        </Animated.View>

        <View style={styles.textColumn}>
          <Text style={[styles.titleText, { color: settings.darkMode ? '#FFFFFF' : '#064E3B' }]}>
            {isUrdu ? messageUrdu : messageEn}
          </Text>
          <Text style={[styles.subText, { color: settings.darkMode ? '#A7F3D0' : '#047857' }]}>
            {isUrdu ? 'قیمتیں اور اسٹاک تیار کیا جا رہا ہے...' : 'Preparing prices & inventory stock...'}
          </Text>
        </View>

        <Animated.View style={{ opacity: pulseAnim }}>
          <View style={styles.liveDot} />
        </Animated.View>
      </View>

      {/* ── Realistic Shelf Skeleton Placeholders (Guaranteed 2-column Side-by-Side Grid) ── */}
      <View style={styles.skeletonGrid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.skeletonGridCard,
              {
                backgroundColor: skeletonCardBg,
                borderColor: skeletonBorder,
                opacity: pulseAnim,
              },
            ]}
          >
            <View style={styles.cardHeaderSkeleton}>
              <View style={[styles.thumbSkeleton, { backgroundColor: skeletonBg }]} />
              <View style={{ flex: 1, gap: 5 }}>
                <View style={[styles.lineSkeleton, { width: '88%', height: 11, backgroundColor: skeletonBg }]} />
                <View style={[styles.lineSkeleton, { width: '55%', height: 9, backgroundColor: skeletonBg }]} />
              </View>
            </View>

            <View style={styles.cardBottomSkeleton}>
              <View style={[styles.lineSkeleton, { width: '48%', height: 14, backgroundColor: skeletonBg }]} />
              <View style={[styles.btnSkeleton, { backgroundColor: skeletonBg }]} />
            </View>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 8,
    paddingBottom: 40,
    gap: 12,
  },
  topBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    ...Shadows.sm,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  iconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flex: 1,
    gap: 2,
  },
  titleText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    width: '100%',
  },
  skeletonGridCard: {
    width: '48.5%',
    borderRadius: 14,
    borderWidth: 1.2,
    padding: 11,
    minHeight: 104,
    justifyContent: 'space-between',
    ...Shadows.sm,
  },
  cardHeaderSkeleton: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  thumbSkeleton: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  cardBottomSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  lineSkeleton: {
    borderRadius: 4,
  },
  btnSkeleton: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  skeletonList: {
    gap: 6,
    width: '100%',
  },
  skeletonListRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 62,
    ...Shadows.sm,
  },
  listThumbSkeleton: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
});
