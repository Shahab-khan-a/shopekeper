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
  const [focused, setFocused] = useState(false);
  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const softBg = settings.darkMode ? '#1E293B' : '#F1F5F9';
  const focusedBg = settings.darkMode ? '#0F172A' : '#FFFFFF';
  const softBorder = settings.darkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)';

  return (
    <View
      style={[
        styles.container,
        {
          height,
          backgroundColor: focused ? focusedBg : softBg,
          borderColor: focused ? theme.primary : softBorder,
          borderWidth: 1.5,
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
    paddingHorizontal: 14,
    borderRadius: 14,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '600',
  },
});
