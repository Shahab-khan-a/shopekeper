import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  height?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  height = 46,
}) => {
  const { settings } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        {
          height,
          backgroundColor: theme.surface,
          borderColor: focused ? theme.borderFocus : theme.border,
          borderWidth: focused ? 1.5 : 1,
        },
      ]}>
      <Ionicons
        name="search"
        size={18}
        color={focused ? theme.primary : theme.textMuted}
      />
      <TextInput
        style={[styles.input, { color: theme.text }]}
        placeholder={placeholder}
        placeholderTextColor={theme.textMuted}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText('')}
          style={({ pressed }) => [pressed && { opacity: 0.7 }]}
          hitSlop={8}>
          <Ionicons name="close-circle" size={18} color={theme.textMuted} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.xl,
    gap: 8,
    ...Shadows.sm,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
});
