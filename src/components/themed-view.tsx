import { View, type ViewProps } from 'react-native';
import { Colors } from '@/constants/theme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: keyof typeof Colors.light;
};

export function ThemedView({ style, lightColor, darkColor, type, ...otherProps }: ThemedViewProps) {
  const theme = Colors.light; // fallback — not used in main app flow
  const bg = type ? (theme[type] as string) : theme.background;

  return <View style={[{ backgroundColor: bg }, style]} {...otherProps} />;
}
