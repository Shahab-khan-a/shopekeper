import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  count?: number;
  activeColor?: string;
  activeBg?: string;
  inactiveBg?: string;
  inactiveColor?: string;
  inactiveBorder?: string;
  variant?: 'default' | 'alert';
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  isActive,
  onPress,
  icon,
  count,
  activeColor,
  activeBg,
  inactiveBg,
  inactiveColor,
  inactiveBorder,
  variant = 'default',
}) => {
  const { settings } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const isAlertChip = variant === 'alert' || icon === 'warning' || icon === 'alert-circle';

  const bg = isActive
    ? activeBg || theme.primary
    : isAlertChip
      ? settings.darkMode
        ? 'rgba(239, 68, 68, 0.14)'
        : '#FEE2E2'
      : inactiveBg || (settings.darkMode ? theme.surfaceSubtle : '#FFFFFF');

  const border = isActive
    ? activeBg || theme.primary
    : isAlertChip
      ? settings.darkMode
        ? 'rgba(239, 68, 68, 0.3)'
        : '#FECACA'
      : inactiveBorder || (settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(148,163,184,0.45)');

  const textColor = isActive
    ? activeColor || '#FFFFFF'
    : isAlertChip
      ? theme.danger
      : inactiveColor || theme.textSecondary;

  const iconColor = isActive
    ? activeColor || '#FFFFFF'
    : isAlertChip
      ? theme.danger
      : theme.textMuted;

  const countBg = isActive
    ? 'rgba(255,255,255,0.22)'
    : settings.darkMode
      ? 'rgba(255,255,255,0.1)'
      : 'rgba(15,23,42,0.06)';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: bg, borderColor: border },
        pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
      ]}>
      {icon ? <Ionicons name={icon} size={12} color={iconColor} /> : null}
      <Text style={[styles.label, { color: textColor, fontWeight: isActive ? '700' : '600' }]}>
        {label}
      </Text>
      {typeof count === 'number' ? (
        <View style={[styles.countBadge, { backgroundColor: countBg }]}>
          <Text style={[styles.countText, { color: textColor }]}>{count}</Text>
        </View>
      ) : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  label: {
    fontSize: 11.5,
    letterSpacing: 0.2,
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BorderRadius.full,
    minWidth: 20,
    alignItems: 'center',
  },
  countText: {
    fontSize: 10,
    fontWeight: '800',
  },
});
