import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '@/types';
import { useShop } from '@/context/ShopContext';
import { Colors, BorderRadius, Shadows } from '@/constants/theme';
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
  const { settings, language, t } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const isUr = language === 'ur';

  const isOutOfStock = product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock <= (settings.lowStockThreshold || 5);

  const cost = product.costPrice || Math.round(product.price * 0.8);
  const unitProfit = Math.max(0, product.price - cost);
  const profitMarginPercent =
    product.price > 0 ? Math.round((unitProfit / product.price) * 100) : 0;

  const softBorder = settings.darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(148, 163, 184, 0.35)';

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

  return (
    <Pressable
      onPress={handleCardPress}
      accessibilityRole="button"
      accessibilityLabel={`${displayName}, ${settings.currencySymbol}${product.price}, ${product.stock} ${product.unit}`}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: isOutOfStock ? theme.danger : isLowStock ? theme.warning : softBorder,
          borderWidth: isOutOfStock || isLowStock ? 1.5 : 1,
        },
        pressed && { opacity: 0.92, transform: [{ scale: 0.985 }] },
      ]}>
      {/* Compact Thumbnail Container */}
      <View style={[styles.imageContainer, { backgroundColor: theme.surfaceSubtle }]}>
        <ProductImage
          uri={product.image || product.imageUri}
          style={styles.image}
          resizeMode="cover"
          fallbackColor={theme.textMuted}
          fallbackSize={26}
          iconName={productIconFor(product.name, product.category)}
        />

        {/* Warning Badge only when stock is critical (no redundant normal stock badges over image) */}
        {isOutOfStock ? (
          <View style={[styles.criticalStockBadge, { backgroundColor: theme.dangerLight }]}>
            <Ionicons name="close-circle" size={10} color={theme.danger} />
            <Text style={[styles.criticalStockText, { color: theme.danger }]}>
              {isUr ? 'ختم' : t('soldOut')}
            </Text>
          </View>
        ) : isLowStock ? (
          <View style={[styles.criticalStockBadge, { backgroundColor: theme.warningLight }]}>
            <Ionicons name="alert-circle" size={10} color={theme.warning} />
            <Text style={[styles.criticalStockText, { color: theme.warning }]}>
              {isUr ? `${product.stock} باقی` : `${product.stock} left`}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Body: High Scannability, Zero Redundancy */}
      <View style={styles.contentWrap}>
        {/* Category micro-tag */}
        <Text style={[styles.categoryText, { color: theme.textMuted }]} numberOfLines={1}>
          {product.category}
        </Text>

        {/* Product Title */}
        <Text style={[styles.productName, { color: theme.text }]} numberOfLines={2}>
          {displayName}
        </Text>

        {/* Price & Margin Row */}
        <View style={styles.priceRow}>
          <View style={styles.priceGroup}>
            <Text
              style={[styles.priceValue, { color: theme.primary }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}>
              {settings.currencySymbol}
              {formatCompactPrice(product.price)}
            </Text>
            <Text style={[styles.unitLabel, { color: theme.textMuted }]}>
              /{product.unit}
            </Text>
          </View>

          {unitProfit > 0 && profitMarginPercent > 0 ? (
            <View
              style={[
                styles.profitChip,
                {
                  backgroundColor: settings.darkMode
                    ? 'rgba(16, 185, 129, 0.16)'
                    : 'rgba(167, 243, 208, 0.45)',
                },
              ]}>
              <Text style={[styles.profitChipText, { color: theme.primary }]}>
                +{profitMarginPercent}%
              </Text>
            </View>
          ) : null}
        </View>

        {/* Stock Status Row: Displayed exactly ONCE, clean & informative */}
        <View style={styles.stockRow}>
          <View
            style={[
              styles.stockPill,
              {
                backgroundColor: isOutOfStock
                  ? theme.dangerLight
                  : isLowStock
                    ? theme.warningLight
                    : settings.darkMode
                      ? 'rgba(16, 185, 129, 0.18)'
                      : '#D1FAE5',
              },
            ]}>
            <Ionicons
              name={isOutOfStock ? 'close-circle' : isLowStock ? 'warning' : 'cube-outline'}
              size={11}
              color={
                isOutOfStock
                  ? theme.danger
                  : isLowStock
                    ? theme.warning
                    : settings.darkMode
                      ? theme.success
                      : '#047857'
              }
            />
            <Text
              style={[
                styles.stockPillText,
                {
                  color: isOutOfStock
                    ? theme.danger
                    : isLowStock
                      ? theme.warning
                      : settings.darkMode
                        ? theme.success
                        : '#047857',
                },
              ]}
              numberOfLines={1}>
              {isOutOfStock
                ? isUr ? 'اسٹاک ختم' : 'Out of stock'
                : isLowStock
                  ? isUr ? `${product.stock} باقی` : `${product.stock} left`
                  : `${product.stock} ${product.unit}`}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    ...Shadows.sm,
    width: '100%',
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 84,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  criticalStockBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    zIndex: 2,
  },
  criticalStockText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  contentWrap: {
    paddingHorizontal: 9,
    paddingTop: 7,
    paddingBottom: 9,
    gap: 3,
    flex: 1,
    justifyContent: 'space-between',
  },
  categoryText: {
    fontSize: 9.5,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  productName: {
    fontSize: 13.5,
    fontWeight: '800',
    lineHeight: 17,
    letterSpacing: -0.2,
    minHeight: 34,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 3,
    marginTop: 2,
  },
  priceGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
    flexShrink: 1,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  unitLabel: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  profitChip: {
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    borderRadius: 3.5,
  },
  profitChipText: {
    fontSize: 9,
    fontWeight: '800',
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  stockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3.5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  stockPillText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
});
