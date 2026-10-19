import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Shadows } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';

interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: number;
  color?: string;
  bg?: string;
  borderColor?: string;
  shadow?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 18,
  color,
  bg,
  borderColor,
  shadow = false,
}) => {
  const { settings } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const softBg = settings.darkMode ? '#1E293B' : '#F1F5F9';
  const softBorder = settings.darkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: bg ?? softBg,
          borderColor: borderColor ?? softBorder,
        },
        shadow && Shadows.sm,
        pressed && { opacity: 0.75, transform: [{ scale: 0.94 }] },
      ]}>
      <Ionicons
        name={icon}
        size={size}
        color={color ?? theme.textSecondary}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
