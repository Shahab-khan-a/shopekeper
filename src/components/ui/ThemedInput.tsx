import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';

interface ThemedInputProps extends TextInputProps {
  label: string;
  required?: boolean;
}

export const ThemedInput: React.FC<ThemedInputProps> = ({
  label,
  required = false,
  style,
  ...rest
}) => {
  const { settings } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.group}>
      <Text style={[styles.label, { color: theme.text }]}>
        {label}
        {required && <Text style={{ color: theme.danger }}> *</Text>}
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.surfaceSubtle,
            color: theme.text,
            borderColor: focused ? theme.borderFocus : theme.border,
            borderWidth: focused ? 1.5 : 1,
          },
          style,
        ]}
        placeholderTextColor={theme.textMuted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  group: {
    gap: 5,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    height: 46,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    fontSize: 14,
    fontWeight: '500',
  },
});
