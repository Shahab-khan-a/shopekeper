import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Catalog/product icon tile: a Material Community Icons glyph on a soft
 * tinted tile. The tint pair is derived from the glyph name, so the same
 * item always gets the same colors everywhere in the app. Palette is muted
 * and professional — no neon, no gradients.
 */
const PALETTES: { bg: string; fg: string }[] = [
  { bg: '#E7F4EC', fg: '#1E7A46' },
  { bg: '#FBF0DC', fg: '#9A6A12' },
  { bg: '#E8F0FA', fg: '#2B5EA7' },
  { bg: '#FBEAEA', fg: '#B03A48' },
  { bg: '#E6F4F3', fg: '#177E70' },
  { bg: '#F0EAF8', fg: '#6B4FA1' },
  { bg: '#ECEFF3', fg: '#54677E' },
  { bg: '#F3ECE4', fg: '#8A6844' },
];

export function catalogPalette(iconName: string): { bg: string; fg: string } {
  let h = 0;
  for (let i = 0; i < iconName.length; i++) h = (h * 31 + iconName.charCodeAt(i)) >>> 0;
  return PALETTES[h % PALETTES.length];
}

type GlyphName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface CatalogIconProps {
  name: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const CatalogIcon: React.FC<CatalogIconProps> = ({ name, size = 48, style }) => {
  const p = catalogPalette(name || 'shopping');
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: Math.max(8, Math.round(size * 0.25)),
          backgroundColor: p.bg,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}>
      <MaterialCommunityIcons name={(name || 'shopping') as GlyphName} size={Math.round(size * 0.56)} color={p.fg} />
    </View>
  );
};
