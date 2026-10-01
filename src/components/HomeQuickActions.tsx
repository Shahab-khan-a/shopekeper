import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';

interface HomeQuickActionsProps {
  onNewSale: () => void;
  onDayEnd: () => void;
}

export const HomeQuickActions: React.FC<HomeQuickActionsProps> = ({
  onNewSale,
  onDayEnd,
}) => {
  const { settings, setActiveTab, setIsAddProductOpen, language } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const actions = [
    {
      id: 'new_sale',
      labelEn: 'New Sale',
      labelUr: 'نئی سیل',
      icon: 'flash',
      color: '#059669',
      bgColor: '#ECFDF5',
      darkBg: 'rgba(16, 185, 129, 0.18)',
      onPress: onNewSale,
    },
    {
      id: 'add_product',
      labelEn: 'Add Stock',
      labelUr: 'اسٹاک شامل',
      icon: 'add-circle-outline',
      color: '#4F46E5',
      bgColor: '#EEF2FF',
      darkBg: 'rgba(99, 102, 241, 0.18)',
      onPress: () => setIsAddProductOpen(true),
    },
    {
      id: 'khata_wasooli',
      labelEn: 'Khata Wasooli',
      labelUr: 'وصولی کھاتہ',
      icon: 'book-outline',
      color: '#D97706',
      bgColor: '#FFFBEB',
      darkBg: 'rgba(245, 158, 11, 0.18)',
      onPress: () => setActiveTab('khata'),
    },
    {
      id: 'day_end',
      labelEn: 'Day-End Close',
      labelUr: 'حساب بند',
      icon: 'moon-outline',
      color: '#7C3AED',
      bgColor: '#F5F3FF',
      darkBg: 'rgba(124, 58, 237, 0.18)',
      onPress: onDayEnd,
    },
  ];

  return (
    <View style={styles.container}>
      {actions.map((act) => {
        const bg = settings.darkMode ? act.darkBg : act.bgColor;
        return (
          <Pressable
            key={act.id}
            onPress={act.onPress}
            style={({ pressed }) => [
              styles.actionBtn,
              { backgroundColor: theme.card, borderColor: theme.border },
              pressed && { transform: [{ scale: 0.96 }], opacity: 0.9 },
            ]}>
            <View style={[styles.iconCircle, { backgroundColor: bg }]}>
              <Ionicons name={act.icon as any} size={20} color={act.color} />
            </View>
            <Text style={[styles.actionLabel, { color: theme.text }]} numberOfLines={1}>
              {language === 'ur' ? act.labelUr : act.labelEn}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    ...Shadows.sm,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
});
