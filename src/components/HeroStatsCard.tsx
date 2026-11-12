import { Ionicons } from '@expo/vector-icons';
import { Image, ImageSource } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export interface HeroStatMetric {
  label: string;
  value: string;
  valueColor?: string;
}

interface HeroStatsCardProps {
  bgImage: ImageSource;
  isDark: boolean;
  /** 'rich' for deep saturated artwork (white text always); 'adaptive' for light/dark themed tile art */
  tone?: 'adaptive' | 'rich';
  fallbackBg: string;
  borderColor: string;
  dotColor: string;
  eyebrow: string;
  eyebrowColor: string;
  pillText: string;
  pillBg?: string;
  pillBorder?: string;
  pillTextColor?: string;
  currencySymbol?: string;
  currencyColor?: string;
  heroValue: string;
  heroValueColor?: string;
  dividerColor?: string;
  scrimColor?: string;
  metrics: HeroStatMetric[];
}

/**
 * Stylish hero statistics card matching the Home Today's Sales card,
 * parameterized with custom background artwork, theme colors, and 3-column metrics.
 */
export const HeroStatsCard: React.FC<HeroStatsCardProps> = ({
  bgImage,
  isDark,
  tone = 'adaptive',
  fallbackBg,
  borderColor,
  dotColor,
  eyebrow,
  eyebrowColor,
  pillText,
  pillBg,
  pillBorder,
  pillTextColor,
  currencySymbol,
  currencyColor,
  heroValue,
  heroValueColor,
  dividerColor,
  scrimColor,
  metrics,
}) => {
  const useLightText = tone === 'rich' || isDark;

  const resolvedHeroColor = heroValueColor || (useLightText ? '#FFFFFF' : '#0F172A');
  const resolvedLabelColor = useLightText ? 'rgba(255,255,255,0.78)' : '#475569';
  const resolvedValueColor = useLightText ? '#FFFFFF' : '#0F172A';
  const resolvedDivider =
    dividerColor ||
    (useLightText ? 'rgba(255,255,255,0.18)' : 'rgba(15,23,42,0.1)');
  const resolvedPillBg =
    pillBg ||
    (useLightText ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.86)');
  const resolvedPillBorder =
    pillBorder ||
    (useLightText ? 'rgba(255,255,255,0.28)' : 'rgba(15,23,42,0.1)');
  const resolvedPillText = pillTextColor || (useLightText ? '#FFFFFF' : '#0F172A');
  const defaultScrim =
    tone === 'rich'
      ? 'rgba(15, 23, 42, 0.24)'
      : isDark
        ? 'rgba(8, 15, 28, 0.42)'
        : 'rgba(255, 255, 255, 0.22)';

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: fallbackBg, borderColor },
      ]}>
      <Image
        source={bgImage}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={180}
      />
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: scrimColor ?? defaultScrim },
        ]}
      />

      <View style={styles.topRow}>
        <View style={styles.labelGroup}>
          <View style={[styles.liveDot, { backgroundColor: dotColor }]} />
          <Text style={[styles.eyebrow, { color: eyebrowColor }]}>{eyebrow}</Text>
        </View>

        <View
          style={[
            styles.pillBadge,
            { backgroundColor: resolvedPillBg, borderColor: resolvedPillBorder },
          ]}>
          <Text style={[styles.pillText, { color: resolvedPillText }]}>{pillText}</Text>
        </View>
      </View>

      <View style={styles.amountRow}>
        {currencySymbol ? (
          <Text style={[styles.currencyText, { color: currencyColor || eyebrowColor }]}>
            {currencySymbol}
          </Text>
        ) : null}
        <Text
          style={[styles.heroAmount, { color: resolvedHeroColor }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.68}>
          {heroValue}
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: resolvedDivider }]} />

      <View style={styles.metricsRow}>
        {metrics.map((metric, idx) => (
          <React.Fragment key={metric.label}>
            {idx > 0 && (
              <View style={[styles.metricSep, { backgroundColor: resolvedDivider }]} />
            )}
            <View style={styles.metricCol}>
              <Text style={[styles.metricLabel, { color: resolvedLabelColor }]} numberOfLines={1}>
                {metric.label}
              </Text>
              <Text
                style={[styles.metricValue, { color: metric.valueColor || resolvedValueColor }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.78}>
                {metric.value}
              </Text>
            </View>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

interface HeroActionBannerProps {
  bgImage: ImageSource;
  fallbackBg: string;
  borderColor: string;
  scrimColor?: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  arrowIcon?: keyof typeof Ionicons.glyphMap;
  arrowBg?: string;
  arrowColor?: string;
  onPress: () => void;
  accessibilityLabel?: string;
}

/**
 * Large stylish primary action card with background artwork, matching Home's New Bill / Khata cards.
 */
export const HeroActionBanner: React.FC<HeroActionBannerProps> = ({
  bgImage,
  fallbackBg,
  borderColor,
  scrimColor = 'rgba(15, 23, 42, 0.22)',
  icon,
  title,
  subtitle,
  arrowIcon = 'arrow-forward',
  arrowBg = 'rgba(255,255,255,0.92)',
  arrowColor = '#0F172A',
  onPress,
  accessibilityLabel,
}) => {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      style={({ pressed }) => [
        styles.actionBanner,
        { backgroundColor: fallbackBg, borderColor },
        pressed && { opacity: 0.9, transform: [{ scale: 0.985 }] },
      ]}>
      <Image
        source={bgImage}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={180}
      />
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { backgroundColor: scrimColor }]}
      />

      <View style={styles.actionLeft}>
        <View style={styles.actionIconBox}>
          <Ionicons name={icon} size={23} color="#FFFFFF" />
        </View>
        <View style={styles.actionTextCol}>
          <Text style={styles.actionTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.actionSub} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
      </View>

      <View style={[styles.actionArrowCircle, { backgroundColor: arrowBg }]}>
        <Ionicons name={arrowIcon} size={17} color={arrowColor} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderCurve: 'continuous',
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 15,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 138,
    justifyContent: 'space-between',
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  eyebrow: {
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  pillBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  currencyText: {
    fontSize: 19,
    fontWeight: '800',
  },
  heroAmount: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.9,
    fontVariant: ['tabular-nums'],
    flexShrink: 1,
  },
  divider: {
    height: 1,
    marginVertical: 1,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricCol: {
    flex: 1,
    gap: 2,
    paddingHorizontal: 4,
  },
  metricSep: {
    width: 1,
    height: 24,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 13.5,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  actionBanner: {
    borderRadius: 20,
    borderCurve: 'continuous',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 15,
    minHeight: 74,
    overflow: 'hidden',
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 0,
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTextCol: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  actionTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  actionSub: {
    color: 'rgba(255,255,255,0.86)',
    fontSize: 12.5,
    fontWeight: '600',
  },
  actionArrowCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

