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
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  isActive,
  onPress,
  icon,
  activeColor,
  activeBg,
}) => {
  const { settings } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const bg = isActive ? (activeBg || theme.primary) : theme.surface;
  const border = isActive ? (activeBg || theme.primary) : theme.border;
  const textColor = isActive ? (activeColor || '#FFFFFF') : theme.textSecondary;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: bg, borderColor: border },
        pressed && { opacity: 0.8 },
      ]}>
      {icon && (
        <Ionicons
          name={icon}
          size={12}
          color={isActive ? (activeColor || '#FFFFFF') : (activeBg || theme.textMuted)}
        />
      )}
      <Text
        style={[
          styles.label,
          { color: textColor, fontWeight: isActive ? '700' : '500' },
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
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
  },
  label: {
    fontSize: 12,
  },
});
