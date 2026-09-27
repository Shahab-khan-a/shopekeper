import { Platform } from 'react-native';

export const Colors = {
  light: {
    primary: '#059669', // Emerald 600
    primaryHover: '#047857',
    primaryLight: '#D1FAE5', // Emerald 100
    primaryDark: '#064E3B',
    primaryGradientStart: '#059669',
    primaryGradientEnd: '#047857',
    secondary: '#0284C7', // Sky Blue
    accent: '#D97706', // Amber Gold
    accentLight: '#FEF3C7',
    danger: '#DC2626', // Red
    dangerLight: '#FEE2E2',
    warning: '#D97706', // Amber
    warningLight: '#FEF3C7',
    success: '#059669', // Green
    successLight: '#D1FAE5',
    text: '#0F172A', // Slate 900
    textSecondary: '#334155', // Slate 700 - high contrast
    textMuted: '#64748B', // Slate 500 - crisp, meets WCAG AA on light backgrounds
    background: '#F1F5F9', // Slate 100 — slightly deeper for contrast
    surface: '#FFFFFF',
    surfaceSubtle: '#F8FAFC',
    surfaceElevated: '#FFFFFF',
    border: '#CBD5E1', // Slate 300
    borderFocus: '#10B981',
    card: '#FFFFFF',
    cardElevated: '#FFFFFF',
    cardHover: '#F8FAFC',
    tabBarBackground: '#FFFFFF',
    tabBarBorder: '#E2E8F0',
    tabBarActive: '#059669',
    tabBarInactive: '#64748B',
    // Hero banner layer colors
    heroBg: '#064E3B',
    heroLayer: '#059669',
  },
  dark: {
    primary: '#10B981',
    primaryHover: '#059669',
    primaryLight: '#064E3B',
    primaryDark: '#A7F3D0', // High-contrast mint emerald text on dark & primaryLight
    primaryGradientStart: '#10B981',
    primaryGradientEnd: '#059669',
    secondary: '#38BDF8',
    accent: '#FBBF24',
    accentLight: '#78350F',
    danger: '#F87171', // Bright readable red on dark
    dangerLight: '#450A0A',
    warning: '#FBBF24', // Bright readable amber on dark
    warningLight: '#78350F',
    success: '#34D399', // Bright readable emerald on dark
    successLight: '#064E3B',
    text: '#F8FAFC', // Slate 50 (clean bright white text)
    textSecondary: '#CBD5E1', // Slate 300 - clear, easy to read in dark mode
    textMuted: '#94A3B8', // Slate 400 - distinct and readable
    background: '#0A0F1E', // Deeper dark background
    surface: '#111827',
    surfaceSubtle: '#1E293B',
    surfaceElevated: '#1E293B',
    border: '#334155', // Slate 700
    borderFocus: '#10B981',
    card: '#111827',
    cardElevated: '#1A2435',
    cardHover: '#243248',
    tabBarBackground: '#0A0F1E',
    tabBarBorder: '#1E293B',
    tabBarActive: '#34D399',
    tabBarInactive: '#94A3B8',
    // Hero banner layer colors
    heroBg: '#022C22',
    heroLayer: '#064E3B',
  },
} as const;

export type ThemeColors = typeof Colors.light | typeof Colors.dark;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  xxl: 24,
  full: 9999,
};

export const Typography = {
  fontFamily: Platform.select({
    ios: 'System',
    android: 'Roboto',
    web: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  }),
  urduFontFamily: Platform.select({
    ios: 'Noto Nastaliq Urdu',
    android: 'Noto Nastaliq Urdu',
    web: '"Noto Nastaliq Urdu", "Jameel Noori Nastaleeq", "Urdu Typesetting", Tahoma, sans-serif',
  }),
};

export const Shadows = {
  sm: Platform.select({
    web: { boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.06)' },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
      elevation: 2,
    },
  }) as any,
  md: Platform.select({
    web: { boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.10)' },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.10,
      shadowRadius: 6,
      elevation: 4,
    },
  }) as any,
  lg: Platform.select({
    web: { boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)' },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
  }) as any,
  xl: Platform.select({
    web: { boxShadow: '0px 8px 16px rgba(5, 150, 105, 0.25)' },
    default: {
      shadowColor: '#059669',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 12,
    },
  }) as any,
};

