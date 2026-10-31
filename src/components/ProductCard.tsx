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

  const stockColor = isOutOfStock
    ? theme.danger
    : isLowStock
      ? theme.warning
      : theme.textMuted;

  return (
    <Pressable
      onPress={handleCardPress}
      android_ripple={{
        color: settings.darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(16, 185, 129, 0.12)',
        borderless: false,
      }}
      accessibilityRole="button"
      accessibilityLabel={`${displayName}, ${settings.currencySymbol}${product.price}, ${product.stock} ${product.unit}. Tap for details.`}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
        pressed && { opacity: 0.92 },
      ]}>
      <View style={[styles.imageContainer, { backgroundColor: theme.surfaceSubtle }]}>
        <ProductImage
          uri={product.image || product.imageUri}
          style={styles.image}
          resizeMode="cover"
          fallbackColor={theme.textMuted}
          fallbackSize={22}
          iconName={productIconFor(product.name, product.category)}
        />
      </View>

      <View style={styles.contentWrap}>
        <Text style={[styles.productName, { color: theme.text }]} numberOfLines={1}>
          {displayName}
        </Text>
        <View style={styles.priceRow}>
          <Text
            style={[styles.priceValue, { color: theme.text }]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.75}>
            {settings.currencySymbol}
            {formatCompactPrice(product.price)}
          </Text>
          <Ionicons name="chevron-forward" size={12} color={theme.textMuted} />
        </View>
        <Text style={[styles.stockLabel, { color: stockColor }]} numberOfLines={1}>
          {stockLabel}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    borderCurve: 'continuous',
    borderWidth: 1,
    overflow: 'hidden',
    width: '100%',
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentWrap: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 9,
    gap: 2,
  },
  productName: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 16,
    letterSpacing: -0.2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
    marginTop: 1,
  },
  priceValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.3,
    fontVariant: ['tabular-nums'],
  },
  stockLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
});
