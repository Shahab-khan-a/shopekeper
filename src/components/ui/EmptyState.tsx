import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
  compact = false,
}) => {
  const { settings } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  return (
    <View
      style={[
        styles.container,
        compact && styles.compact,
        { backgroundColor: theme.surface, borderColor: theme.border },
      ]}>
      <View style={[styles.iconWrap, { backgroundColor: theme.surfaceSubtle }]}>
        <Ionicons name={icon} size={compact ? 28 : 38} color={theme.textMuted} />
      </View>

      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>

      {subtitle ? (
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {subtitle}
        </Text>
      ) : null}

      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          style={({ pressed }) => [
            styles.actionBtn,
            { backgroundColor: theme.primary },
            pressed && { opacity: 0.88 },
          ]}>
          <Ionicons name="add" size={16} color="#FFFFFF" />
          <Text style={styles.actionBtnText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.xxxl,
    marginTop: Spacing.lg,
    gap: 10,
    ...Shadows.sm,
  },
  compact: {
    padding: Spacing.xl,
    marginTop: Spacing.md,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: BorderRadius.full,
    marginTop: 4,
    ...Shadows.sm,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
