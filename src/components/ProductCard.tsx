import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '@/types';
import { useShop } from '@/context/ShopContext';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { ProductImage } from '@/components/ProductImage';
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
  onAddToCart,
  onEdit,
  onDelete,
}) => {
  const { settings, language, t } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock <= (settings.lowStockThreshold || 5);

  // Profit calculation
  const cost = product.costPrice || Math.round(product.price * 0.8);
  const unitProfit = Math.max(0, product.price - cost);
  const profitMarginPercent = product.price > 0 ? Math.round((unitProfit / product.price) * 100) : 0;

  const getStockBadge = () => {
    if (isOutOfStock) {
      return {
        bg: theme.dangerLight,
        text: theme.danger,
        label: t('soldOut'),
        icon: 'alert-circle' as const,
      };
    }
    if (isLowStock) {
      return {
        bg: theme.warningLight,
        text: theme.warning,
        label: `${product.stock} ${product.unit}`,
        icon: 'warning' as const,
      };
    }
    return {
      bg: theme.successLight,
      text: theme.success,
      label: `${product.stock} ${product.unit}`,
      icon: 'checkmark-circle' as const,
    };
  };

  const badge = getStockBadge();
  const softBorder = settings.darkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)';

  const handleCardPress = () => {
    if (onPress) {
      onPress(product);
    } else if (onEdit) {
      onEdit(product);
    }
  };

  return (
    <Pressable
      onPress={handleCardPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: isLowStock ? theme.warning : isOutOfStock ? theme.danger : softBorder,
          borderWidth: isLowStock || isOutOfStock ? 1.5 : 1,
        },
        pressed && { opacity: 0.92, transform: [{ scale: 0.98 }] },
      ]}>
      {/* Top Image Area */}
      <View style={[styles.imageContainer, { backgroundColor: theme.surfaceSubtle }]}>
        <ProductImage
          uri={product.image || product.imageUri}
          style={styles.image}
          resizeMode="cover"
          fallbackColor={theme.textMuted}
          fallbackSize={32}
        />

        {/* Category frosted badge top-left */}
        <View
          style={[
            styles.categoryBadge,
            {
              backgroundColor: settings.darkMode
                ? 'rgba(0,0,0,0.55)'
                : 'rgba(255,255,255,0.88)',
            },
          ]}>
          <Text
            style={[
              styles.categoryBadgeText,
              { color: settings.darkMode ? '#FFFFFF' : '#1E293B' },
            ]}>
            {product.category}
          </Text>
        </View>

        {/* Stock status badge top-right */}
        <View style={[styles.stockBadge, { backgroundColor: badge.bg }]}>
          <Ionicons name={badge.icon} size={10} color={badge.text} />
          <Text style={[styles.stockBadgeText, { color: badge.text }]}>{badge.label}</Text>
        </View>
      </View>

      {/* Content Area */}
      <View style={styles.contentWrap}>
        {/* Product Name (Container fixed for 2 lines so card height remains uniform) */}
        <View style={styles.nameContainer}>
          <Text style={[styles.productName, { color: theme.text }]} numberOfLines={2}>
            {language === 'ur' && product.nameUrdu ? product.nameUrdu : product.name}
          </Text>
          {language === 'ur' && product.nameUrdu && product.name ? (
            <Text style={[styles.subName, { color: theme.textSecondary }]} numberOfLines={1}>
              {product.name}
            </Text>
          ) : null}
        </View>

        {/* Price & Profit Row */}
        <View style={styles.priceRow}>
          <Text
            style={[styles.priceValue, { color: theme.primary }]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.75}>
            {settings.currencySymbol}
            {formatCompactPrice(product.price)}
          </Text>
          <Text style={[styles.unitLabel, { color: theme.textMuted }]}>/{product.unit}</Text>
          {unitProfit > 0 && (
            <View
              style={[
                styles.profitChip,
                {
                  backgroundColor: settings.darkMode
                    ? 'rgba(16, 185, 129, 0.15)'
                    : '#ECFDF5',
                },
              ]}>
              <Text style={[styles.profitChipText, { color: '#059669' }]}>
                +{profitMarginPercent}%
              </Text>
            </View>
          )}
        </View>

        {/* Clean Footer: Stock count & tap indicator */}
        <View
          style={[
            styles.cardFooter,
            {
              borderTopColor: settings.darkMode
                ? 'rgba(255, 255, 255, 0.05)'
                : '#F1F5F9',
            },
          ]}>
          <View style={styles.stockInfoPill}>
            <Ionicons
              name="cube-outline"
              size={12}
              color={isOutOfStock ? theme.danger : theme.textMuted}
            />
            <Text
              style={[
                styles.stockInfoText,
                { color: isOutOfStock ? theme.danger : theme.textMuted },
              ]}>
              {product.stock} {product.unit}
            </Text>
          </View>

          <View style={styles.detailsChevron}>
            <Text style={[styles.detailsText, { color: theme.textMuted }]}>
              {language === 'ur' ? 'تفصیل' : 'Details'}
            </Text>
            <Ionicons name="chevron-forward" size={13} color={theme.textMuted} />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    ...Shadows.sm,
    width: '100%',
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 114,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: BorderRadius.full,
    zIndex: 2,
  },
  categoryBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  stockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3.5,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: BorderRadius.full,
    zIndex: 2,
  },
  stockBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  contentWrap: {
    padding: 12,
    gap: 6,
    flex: 1,
    justifyContent: 'space-between',
  },
  nameContainer: {
    minHeight: 38,
    justifyContent: 'flex-start',
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 19,
    letterSpacing: -0.2,
  },
  subName: {
    fontSize: 11,
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  priceValue: {
    fontSize: 16.5,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  unitLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  profitChip: {
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: BorderRadius.full,
  },
  profitChipText: {
    fontSize: 10,
    fontWeight: '800',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    marginTop: 3,
    borderTopWidth: 1,
  },
  stockInfoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stockInfoText: {
    fontSize: 11,
    fontWeight: '600',
  },
  detailsChevron: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  detailsText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
