import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '@/types';
import { useShop } from '@/context/ShopContext';
import { Colors, BorderRadius } from '@/constants/theme';
import { ProductImage } from '@/components/ProductImage';
import { productIconFor } from '@/utils/productIcon';
import { formatCompactPrice } from '@/utils/formatters';

interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onEdit,
}) => {
  const { settings, language } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const isUr = language === 'ur';

  const isOutOfStock = product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock <= (settings.lowStockThreshold || 5);

  const handleCardPress = () => {
    if (onPress) {
      onPress(product);
    } else if (onEdit) {
      onEdit(product);
    }
  };

  const displayName = isUr && product.nameUrdu
    ? product.nameUrdu
    : product.name.replace(/\s*\([\u0600-\u06FF\s/]+\)$/, '').trim();

  const stockLabel = isOutOfStock
    ? isUr
      ? 'اسٹاک ختم'
      : 'Out of stock'
    : isLowStock
      ? isUr
        ? `${product.stock} باقی`
        : `${product.stock} left`
      : `${product.stock} ${product.unit}`;

  const softBorder = settings.darkMode ? 'rgba(255,255,255,0.09)' : 'rgba(148,163,184,0.28)';
  const accentBlue = settings.darkMode ? '#38BDF8' : '#0284C7';

  const stockBadgeColors = isOutOfStock
    ? {
        bg: settings.darkMode ? 'rgba(239,68,68,0.18)' : '#FEE2E2',
        text: settings.darkMode ? '#F87171' : '#DC2626',
      }
    : isLowStock
      ? {
          bg: settings.darkMode ? 'rgba(245,158,11,0.18)' : '#FEF3C7',
          text: settings.darkMode ? '#FBBF24' : '#D97706',
        }
      : {
          bg: settings.darkMode ? 'rgba(16,185,129,0.15)' : '#ECFDF5',
          text: settings.darkMode ? '#34D399' : '#059669',
        };

  return (
    <Pressable
      onPress={handleCardPress}
      android_ripple={{
        color: settings.darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(2, 132, 199, 0.1)',
        borderless: false,
      }}
      accessibilityRole="button"
      accessibilityLabel={`${displayName}, ${settings.currencySymbol}${product.price}, ${product.stock} ${product.unit}. Tap for details.`}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: isOutOfStock
            ? settings.darkMode
              ? 'rgba(239,68,68,0.45)'
              : '#FCA5A5'
            : isLowStock
              ? settings.darkMode
                ? 'rgba(245,158,11,0.45)'
                : '#FCD34D'
              : softBorder,
        },
        pressed && { opacity: 0.9, transform: [{ scale: 0.985 }] },
      ]}>
      <View
        style={[
          styles.imageContainer,
          { backgroundColor: settings.darkMode ? '#1E293B' : '#F8FAFC' },
        ]}>
        <ProductImage
          uri={product.image || product.imageUri}
          style={styles.image}
          resizeMode="cover"
          fallbackColor={accentBlue}
          fallbackSize={24}
          iconName={productIconFor(product.name, product.category)}
        />
      </View>

      <View style={styles.contentWrap}>
        <Text style={[styles.productName, { color: theme.text }]} numberOfLines={1}>
          {displayName}
        </Text>
        <View style={styles.priceRow}>
          <Text
            style={[styles.priceValue, { color: accentBlue }]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.75}>
            {settings.currencySymbol}
            {formatCompactPrice(product.price)}
          </Text>
          <View style={[styles.stockPill, { backgroundColor: stockBadgeColors.bg }]}>
            <Text style={[styles.stockPillText, { color: stockBadgeColors.text }]} numberOfLines={1}>
              {stockLabel}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderCurve: 'continuous',
    borderWidth: 1,
    overflow: 'hidden',
    width: '100%',
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 74,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentWrap: {
    paddingHorizontal: 11,
    paddingTop: 9,
    paddingBottom: 10,
    gap: 5,
  },
  productName: {
    fontSize: 13.5,
    fontWeight: '700',
    lineHeight: 17,
    letterSpacing: -0.2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  priceValue: {
    fontSize: 14.5,
    fontWeight: '800',
    letterSpacing: -0.3,
    fontVariant: ['tabular-nums'],
  },
  stockPill: {
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 999,
    flexShrink: 1,
  },
  stockPillText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
});
