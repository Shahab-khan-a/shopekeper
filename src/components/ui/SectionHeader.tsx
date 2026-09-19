import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  actionLabel,
  onAction,
}) => {
  const { settings } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  return (
    <View style={styles.row}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          style={({ pressed }) => [pressed && { opacity: 0.7 }]}>
          <Text style={[styles.action, { color: theme.primary }]}>
            {actionLabel} →
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  action: {
    fontSize: 13,
    fontWeight: '700',
  },
});
