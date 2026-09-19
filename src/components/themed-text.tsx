import React from 'react';
import { View, Text, Platform, StyleSheet, type TextProps } from 'react-native';
import { Colors } from '@/constants/theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: keyof typeof Colors.light;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = Colors.light; // fallback — this component isn't used in the main app flow

  return (
    <Text
      style={[
        { color: themeColor ? (theme[themeColor] as string) : theme.text },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'linkPrimary' && styles.linkPrimary,
        type === 'code' && styles.code,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  small: { fontSize: 14, lineHeight: 20 },
  smallBold: { fontSize: 14, lineHeight: 20, fontWeight: '700' },
  default: { fontSize: 16, lineHeight: 24 },
  title: { fontSize: 48, fontWeight: '600', lineHeight: 52 },
  subtitle: { fontSize: 32, lineHeight: 44, fontWeight: '600' },
  link: { lineHeight: 30, fontSize: 14 },
  linkPrimary: { lineHeight: 30, fontSize: 14, color: '#3c87f7' },
  code: {
    fontFamily: Platform.select({ web: 'monospace', default: 'monospace' }),
    fontSize: 12,
  },
});
