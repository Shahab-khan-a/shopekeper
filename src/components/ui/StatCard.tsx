import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: string | number;
  label: string;
  iconBg: string;
  iconColor: string;
  valueColor?: string;
  borderColor?: string;
  onPress?: () => void;
  variant?: 'chip' | 'card';
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  iconBg,
  iconColor,
  valueColor,
  borderColor,
  onPress,
  variant = 'card',
}) => {
  const { settings } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const isChip = variant === 'chip';
  const Container = onPress ? Pressable : View;
  const containerProps = onPress
    ? {
        onPress,
        style: ({ pressed }: { pressed: boolean }) => [
          isChip ? styles.chip : styles.card,
          {
            backgroundColor: theme.surface,
            borderColor: borderColor ?? theme.border,
          },
          pressed && { opacity: 0.85 },
        ],
      }
    : {
        style: [
          isChip ? styles.chip : styles.card,
          {
            backgroundColor: theme.surface,
            borderColor: borderColor ?? theme.border,
          },
        ],
      };

  return (
    // @ts-ignore — Pressable/View dynamic style union
    <Container {...containerProps}>
      <View style={[styles.iconBadge, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={isChip ? 13 : 20} color={iconColor} />
      </View>
      {isChip ? (
        <View>
          <Text style={[styles.chipValue, { color: valueColor ?? theme.text }]}>
            {value}
          </Text>
          <Text style={[styles.chipLabel, { color: theme.textMuted }]}>{label}</Text>
        </View>
      ) : (
        <View style={styles.cardBody}>
          <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>
            {label}
          </Text>
          <Text style={[styles.cardValue, { color: valueColor ?? theme.text }]}>
            {value}
          </Text>
        </View>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  // Chip variant (horizontal row, used in horizontal scroll bars)
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    ...Shadows.sm,
  },
  // Card variant (vertical, used in metrics grids)
  card: {
    flex: 1,
    minWidth: '45%',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Chip text
  chipValue: {
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 16,
  },
  chipLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  // Card text
  cardBody: {
    padding: Spacing.md,
    gap: 4,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
});
