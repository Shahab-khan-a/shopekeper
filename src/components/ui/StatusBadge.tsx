import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius } from '@/constants/theme';

interface StatusBadgeProps {
  label: string;
  bg: string;
  color: string;
  icon?: keyof typeof Ionicons.glyphMap;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  bg,
  color,
  icon,
  size = 'md',
}) => {
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: bg },
        isSmall && styles.badgeSm,
      ]}>
      {icon && (
        <Ionicons
          name={icon}
          size={isSmall ? 10 : 12}
          color={color}
        />
      )}
      <Text
        style={[
          styles.label,
          { color },
          isSmall && styles.labelSm,
        ]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  badgeSm: {
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  labelSm: {
    fontSize: 9,
  },
});
