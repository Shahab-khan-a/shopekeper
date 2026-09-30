import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  activeColor?: string;
  activeBg?: string;
  inactiveBg?: string;
  inactiveColor?: string;
  inactiveBorder?: string;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  isActive,
  onPress,
  icon,
  activeColor,
  activeBg,
  inactiveBg,
  inactiveColor,
  inactiveBorder,
}) => {
  const { settings } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const isAlertChip = !!icon && (icon === 'warning' || icon === 'alert-circle');

  const bg = isActive
    ? (activeBg || theme.primary)
    : isAlertChip
    ? (settings.darkMode ? 'rgba(239, 68, 68, 0.14)' : '#FEE2E2')
    : (inactiveBg || (settings.darkMode ? '#1E293B' : '#F1F5F9'));

  const border = isActive
    ? (activeBg || theme.primary)
    : isAlertChip
    ? (settings.darkMode ? 'rgba(239, 68, 68, 0.3)' : '#FECACA')
    : (inactiveBorder || (settings.darkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)'));

  const textColor = isActive
    ? (activeColor || '#FFFFFF')
    : isAlertChip
    ? theme.danger
    : (inactiveColor || theme.textSecondary);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: bg, borderColor: border },
        pressed && { opacity: 0.82, transform: [{ scale: 0.97 }] },
      ]}>
      {icon && (
        <Ionicons
          name={icon}
          size={13}
          color={isActive ? (activeColor || '#FFFFFF') : (isAlertChip ? theme.danger : (activeBg || theme.textMuted))}
        />
      )}
      <Text
        style={[
          styles.label,
          { color: textColor, fontWeight: isActive ? '700' : '600' },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 13,
    paddingVertical: 7.5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  label: {
    fontSize: 12.5,
    letterSpacing: 0.1,
  },
});
