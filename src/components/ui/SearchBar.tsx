import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '@/constants/theme';
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
  const softBg = settings.darkMode ? '#1E293B' : '#FFFFFF';
  const focusedBg = settings.darkMode ? '#0F172A' : '#FFFFFF';
  const softBorder = settings.darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(148, 163, 184, 0.45)';

  return (
    <View
      style={[
        styles.container,
        {
          height,
          backgroundColor: focused ? focusedBg : softBg,
          borderColor: focused ? theme.primary : softBorder,
          borderWidth: 1,
        },
      ]}>
      <Ionicons
        name="search"
        size={17}
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
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 8,
    ...Shadows.sm,
  },
  input: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
});
