import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '@/types';
import { useShop } from '@/context/ShopContext';
import { Colors, BorderRadius, Shadows } from '@/constants/theme';
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

  const cost = product.costPrice || Math.round(product.price * 0.8);
  const unitProfit = Math.max(0, product.price - cost);
  const profitMarginPercent =
    product.price > 0 ? Math.round((unitProfit / product.price) * 100) : 0;

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
      bg: settings.darkMode ? 'rgba(16,185,129,0.22)' : '#A7F3D0',
      text: settings.darkMode ? theme.success : '#047857',
      label: `${product.stock} ${product.unit}`,
      icon: 'checkmark-circle' as const,
    };
  };

  const badge = getStockBadge();
  const softBorder = settings.darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(148, 163, 184, 0.4)';
  const footerBg = settings.darkMode ? theme.surfaceSubtle : '#F8F9FF';

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
        pressed && { opacity: 0.94, transform: [{ scale: 0.985 }] },
      ]}>
      {/* Thumbnail with badges */}
      <View style={[styles.imageContainer, { backgroundColor: theme.surfaceSubtle }]}>
        <ProductImage
          uri={product.image || product.imageUri}
          style={styles.image}
          resizeMode="cover"
          fallbackColor={theme.textMuted}
          fallbackSize={32}
        />

        <View
          style={[
            styles.categoryBadge,
            {
              backgroundColor: settings.darkMode
                ? 'rgba(15,23,42,0.72)'
                : 'rgba(255,255,255,0.88)',
            },
          ]}>
          <Text
            style={[
              styles.categoryBadgeText,
              { color: settings.darkMode ? '#FFFFFF' : theme.text },
            ]}
            numberOfLines={1}>
            {product.category}
          </Text>
        </View>

        <View style={[styles.stockBadge, { backgroundColor: badge.bg }]}>
          <Ionicons name={badge.icon} size={10} color={badge.text} />
          <Text style={[styles.stockBadgeText, { color: badge.text }]} numberOfLines={1}>
            {badge.label}
          </Text>
        </View>
      </View>

      {/* Body */}
      <View style={styles.contentWrap}>
        <View style={styles.nameContainer}>
          <Text style={[styles.productName, { color: theme.text }]} numberOfLines={2}>
            {language === 'ur' && product.nameUrdu ? product.nameUrdu : product.name}
          </Text>
        </View>

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
            <Text style={[styles.unitLabel, { color: theme.textMuted }]}>/{product.unit}</Text>
          </View>
          {unitProfit > 0 ? (
            <View
              style={[
                styles.profitChip,
                {
                  backgroundColor: settings.darkMode
                    ? 'rgba(16, 185, 129, 0.18)'
                    : 'rgba(167, 243, 208, 0.45)',
                },
              ]}>
              <Text style={[styles.profitChipText, { color: theme.primary }]}>
                +{profitMarginPercent}%
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Footer */}
      <View
        style={[
          styles.cardFooter,
          {
            backgroundColor: footerBg,
            borderTopColor: settings.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(148,163,184,0.25)',
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
          <Text style={[styles.detailsText, { color: theme.primary }]}>{t('detailsLink')}</Text>
          <Ionicons name="chevron-forward" size={13} color={theme.primary} />
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
    aspectRatio: 4 / 3,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
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
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    zIndex: 2,
    maxWidth: '55%',
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  stockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    zIndex: 2,
    maxWidth: '48%',
  },
  stockBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  contentWrap: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 8,
    gap: 6,
    flex: 1,
  },
  nameContainer: {
    minHeight: 36,
    justifyContent: 'flex-start',
  },
  productName: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 4,
  },
  priceGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
    flexShrink: 1,
  },
  priceValue: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  unitLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  profitChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  profitChipText: {
    fontSize: 10,
    fontWeight: '800',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
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
    gap: 1,
  },
  detailsText: {
    fontSize: 11,
    fontWeight: '800',
  },
});
