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
  const { settings, language } = useShop();
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
          borderColor: isOutOfStock ? theme.danger : isLowStock ? theme.warning : softBorder,
          borderWidth: isOutOfStock || isLowStock ? 1.5 : 1,
        },
        pressed && { opacity: 0.92, transform: [{ scale: 0.98 }] },
      ]}>
      {/* Decorated Thumbnail Canopy */}
      <View style={[styles.imageContainer, { backgroundColor: theme.surfaceSubtle }]}>
        <ProductImage
          uri={product.image || product.imageUri}
          style={styles.image}
          resizeMode="cover"
          fallbackColor={theme.textMuted}
          fallbackSize={32}
          iconName={productIconFor(product.name, product.category)}
        />

        {/* Top-Left: Category Tag or Stock Alert Pill */}
        <View
          style={[
            styles.topBadgePill,
            {
              backgroundColor: isOutOfStock
                ? theme.dangerLight
                : isLowStock
                  ? theme.warningLight
                  : settings.darkMode
                    ? 'rgba(15, 23, 42, 0.85)'
                    : 'rgba(255, 255, 255, 0.94)',
              borderColor: isOutOfStock
                ? theme.danger
                : isLowStock
                  ? theme.warning
                  : settings.darkMode
                    ? 'rgba(255,255,255,0.12)'
                    : 'rgba(0,0,0,0.08)',
            },
          ]}>
          {isOutOfStock ? (
            <Ionicons name="alert-circle" size={10} color={theme.danger} />
          ) : isLowStock ? (
            <Ionicons name="warning" size={10} color={theme.warning} />
          ) : null}
          <Text
            style={[
              styles.topBadgeText,
              {
                color: isOutOfStock
                  ? theme.danger
                  : isLowStock
                    ? theme.warning
                    : settings.darkMode
                      ? '#E2E8F0'
                      : theme.text,
              },
            ]}
            numberOfLines={1}>
            {isOutOfStock
              ? isUr ? 'اسٹاک ختم' : 'Out'
              : isLowStock
                ? isUr ? 'کم اسٹاک' : 'Low'
                : product.category}
          </Text>
        </View>

        {/* Top-Right: Pressable "Details ↗" Affordance Indicator */}
        <View
          style={[
            styles.pressIndicatorPill,
            {
              backgroundColor: settings.darkMode
                ? 'rgba(15, 23, 42, 0.88)'
                : 'rgba(255, 255, 255, 0.94)',
              borderColor: settings.darkMode
                ? 'rgba(16, 185, 129, 0.4)'
                : 'rgba(16, 185, 129, 0.3)',
            },
          ]}>
          <Ionicons name="information-circle" size={11} color={theme.primary} />
          <Text style={[styles.pressIndicatorText, { color: theme.primary }]}>
            {isUr ? 'تفصیل' : 'Details'}
          </Text>
          <Ionicons name="chevron-forward" size={10} color={theme.primary} />
        </View>

        {/* Bottom of Image: Unified Decorated Frosted Ribbon */}
        <View style={styles.imageBottomRibbon}>
          {/* Stock Status with glowing dot */}
          <View style={styles.stockRibbonItem}>
            <View
              style={[
                styles.stockDot,
                {
                  backgroundColor: isOutOfStock
                    ? '#EF4444'
                    : isLowStock
                      ? '#F59E0B'
                      : '#10B981',
                },
              ]}
            />
            <Text style={styles.stockRibbonText} numberOfLines={1}>
              {isOutOfStock
                ? isUr ? 'اسٹاک ختم' : 'Out of stock'
                : isLowStock
                  ? isUr ? `${product.stock} باقی` : `${product.stock} left`
                  : `${product.stock} ${product.unit}`}
            </Text>
          </View>

          {/* Profit Margin Tag (when profitable) */}
          {unitProfit > 0 && profitMarginPercent > 0 ? (
            <View style={styles.profitRibbonItem}>
              <Text style={styles.profitRibbonText}>
                +{profitMarginPercent}%
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Clean, Breathable Card Body */}
      <View style={styles.contentWrap}>
        {/* Product Title */}
        <Text style={[styles.productName, { color: theme.text }]} numberOfLines={2}>
          {displayName}
        </Text>

        {/* Price & Touch Affordance Row */}
        <View style={styles.priceRow}>
          <View style={styles.priceWithUnit}>
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

          {/* Interactive touch cue */}
          <View
            style={[
              styles.touchCueWrap,
              {
                backgroundColor: settings.darkMode
                  ? 'rgba(255, 255, 255, 0.06)'
                  : 'rgba(148, 163, 184, 0.15)',
              },
            ]}>
            <Ionicons name="chevron-forward" size={13} color={theme.textMuted} />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    ...Shadows.sm,
    width: '100%',
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 110,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topBadgePill: {
    position: 'absolute',
    top: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    zIndex: 2,
    maxWidth: '50%',
    ...Shadows.sm,
  },
  topBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  pressIndicatorPill: {
    position: 'absolute',
    top: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2.5,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    zIndex: 2,
    ...Shadows.sm,
  },
  pressIndicatorText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.1,
  },
  imageBottomRibbon: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(15, 23, 42, 0.74)',
    paddingHorizontal: 8,
    paddingVertical: 4.5,
    zIndex: 2,
  },
  stockRibbonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    minWidth: 0,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  stockRibbonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  profitRibbonItem: {
    backgroundColor: 'rgba(16, 185, 129, 0.28)',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
    marginLeft: 4,
  },
  profitRibbonText: {
    color: '#34D399',
    fontSize: 9.5,
    fontWeight: '800',
  },
  contentWrap: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 8,
    gap: 4,
    flex: 1,
  },
  productName: {
    fontSize: 13.5,
    fontWeight: '800',
    lineHeight: 18,
    letterSpacing: -0.2,
    minHeight: 36,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  priceWithUnit: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
    flex: 1,
    minWidth: 0,
  },
  priceValue: {
    fontSize: 16.5,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  unitLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  touchCueWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
