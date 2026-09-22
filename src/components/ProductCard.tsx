import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '@/types';
import { useShop } from '@/context/ShopContext';
import { CameraModal } from '@/components/CameraModal';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { googleDriveService } from '@/services/googleDriveService';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onEdit,
  onDelete,
}) => {
  const { settings, language, t, updateProduct } = useShop();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock <= (settings.lowStockThreshold || 5);

  // Profit calculation
  const cost = product.costPrice || Math.round(product.price * 0.8);
  const unitProfit = Math.max(0, product.price - cost);
  const profitMarginPercent = product.price > 0 ? Math.round((unitProfit / product.price) * 100) : 0;

  // Quick stock addition
  const handleQuickAddStock = (amt: number) => {
    updateProduct(product.id, {
      stock: product.stock + amt,
    });
  };

  const getStockBadge = () => {
    if (isOutOfStock) return { bg: theme.dangerLight, text: theme.danger, label: t('soldOut'), icon: 'alert-circle' as const };
    if (isLowStock) return { bg: theme.warningLight, text: theme.warning, label: `${product.stock} ${product.unit}`, icon: 'warning' as const };
    return { bg: theme.successLight, text: theme.success, label: `${product.stock} ${product.unit}`, icon: 'checkmark-circle' as const };
  };

  const badge = getStockBadge();

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      if (window.confirm(t('deleteProductConfirm'))) {
        onDelete?.(product);
      }
    } else {
      Alert.alert(t('deleteProduct'), t('deleteProductConfirm'), [
        { text: t('cancel'), style: 'cancel' },
        { text: t('delete'), style: 'destructive', onPress: () => onDelete?.(product) },
      ]);
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: isLowStock ? theme.warning : isOutOfStock ? theme.danger : theme.border,
          borderWidth: isLowStock || isOutOfStock ? 1.5 : 1,
        },
      ]}>
      {/* Top Image Area */}
      <View style={[styles.imageContainer, { backgroundColor: theme.surfaceSubtle }]}>
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.fallbackWrap}>
            <Ionicons name="cube-outline" size={32} color={theme.textMuted} />
          </View>
        )}

        {/* Category badge top-left */}
        <View style={[styles.categoryBadge, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
          <Text style={styles.categoryBadgeText}>{product.category}</Text>
        </View>

        {/* Stock status badge top-right */}
        <View style={[styles.stockBadge, { backgroundColor: badge.bg }]}>
          <Ionicons name={badge.icon} size={10} color={badge.text} />
          <Text style={[styles.stockBadgeText, { color: badge.text }]}>{badge.label}</Text>
        </View>

        {/* Camera button bottom-right */}
        <Pressable
          onPress={() => setIsCameraOpen(true)}
          style={({ pressed }) => [
            styles.cameraSnapBtn,
            { backgroundColor: 'rgba(0,0,0,0.6)' },
            pressed && { opacity: 0.8 },
          ]}>
          <Ionicons name="camera" size={12} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* Content */}
      <View style={styles.contentWrap}>
        {/* Product name */}
        <Text style={[styles.productName, { color: theme.text }]} numberOfLines={2}>
          {language === 'ur' && product.nameUrdu ? product.nameUrdu : product.name}
        </Text>
        {language === 'ur' && product.nameUrdu && product.name ? (
          <Text style={[styles.subName, { color: theme.textSecondary }]} numberOfLines={1}>
            {product.name}
          </Text>
        ) : null}

        {/* Price row */}
        <View style={styles.priceRow}>
          <Text style={[styles.priceValue, { color: theme.primary }]}>
            {settings.currencySymbol}{product.price}
          </Text>
          <Text style={[styles.unitLabel, { color: theme.textMuted }]}>/{product.unit}</Text>
          {unitProfit > 0 && (
            <View style={[styles.profitChip, { backgroundColor: theme.successLight }]}>
              <Text style={[styles.profitChipText, { color: theme.success }]}>
                +{profitMarginPercent}%
              </Text>
            </View>
          )}
        </View>

        {/* Cost price */}
        {product.costPrice ? (
          <Text style={[styles.costValue, { color: theme.textMuted }]}>
            {t('cost')}: {settings.currencySymbol}{product.costPrice}
          </Text>
        ) : null}

        {/* Stock bar */}
        <View style={styles.stockSection}>
          <Text style={[styles.stockLevelLabel, { color: theme.textMuted }]}>
            {t('stock')}: {product.stock} {product.unit}
          </Text>
          <View style={[styles.stockBarTrack, { backgroundColor: theme.border }]}>
            <View
              style={[
                styles.stockBarFill,
                {
                  width: `${Math.min(100, Math.max(8, (product.stock / 50) * 100))}%`,
                  backgroundColor: isOutOfStock
                    ? theme.danger
                    : isLowStock
                    ? theme.warning
                    : theme.primary,
                },
              ]}
            />
          </View>
          {/* Quick add stock */}
          <View style={styles.quickStockRow}>
            {[5, 10, 25].map((amt) => (
              <Pressable
                key={amt}
                onPress={() => handleQuickAddStock(amt)}
                style={({ pressed }) => [
                  styles.quickStockBtn,
                  { backgroundColor: theme.primaryLight, borderColor: theme.primary },
                  pressed && { opacity: 0.75 },
                ]}>
                <Text style={[styles.quickStockBtnText, { color: theme.primaryDark }]}>+{amt}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Barcode */}
        {product.barcode ? (
          <View style={[styles.barcodePill, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
            <Ionicons name="barcode-outline" size={11} color={theme.textMuted} />
            <Text style={[styles.barcodeText, { color: theme.textSecondary }]} numberOfLines={1}>
              {product.barcode}
            </Text>
          </View>
        ) : null}

        {/* Action buttons */}
        <View style={[styles.actionRow, { borderTopColor: theme.border }]}>
          {onEdit && (
            <Pressable
              onPress={() => onEdit(product)}
              style={({ pressed }) => [
                styles.actionBtn,
                { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
                pressed && { opacity: 0.75 },
              ]}>
              <Ionicons name="pencil" size={13} color={theme.text} />
              <Text style={[styles.actionBtnText, { color: theme.text }]}>{t('edit')}</Text>
            </Pressable>
          )}

          {onDelete && (
            <Pressable
              onPress={handleDelete}
              style={({ pressed }) => [
                styles.actionBtn,
                { backgroundColor: theme.dangerLight, borderColor: theme.danger },
                pressed && { opacity: 0.75 },
              ]}>
              <Ionicons name="trash-outline" size={13} color={theme.danger} />
              <Text style={[styles.actionBtnText, { color: theme.danger }]}>{t('delete')}</Text>
            </Pressable>
          )}

          {onAddToCart && (
            <Pressable
              disabled={isOutOfStock}
              onPress={() => onAddToCart(product)}
              style={({ pressed }) => [
                styles.actionBtnPrimary,
                { backgroundColor: isOutOfStock ? theme.border : theme.primary },
                pressed && !isOutOfStock && { opacity: 0.85 },
              ]}>
              <Ionicons
                name="cart-outline"
                size={14}
                color={isOutOfStock ? theme.textMuted : '#FFFFFF'}
              />
              <Text
                style={[
                  styles.actionBtnPrimaryText,
                  isOutOfStock && { color: theme.textMuted },
                ]}>
                Add
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      <CameraModal
        visible={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(uri) => {
          updateProduct(product.id, { image: uri });
          // Upload directly to 5 TB Google Drive if connected
          googleDriveService
            .getSavedAuth()
            .then((auth) => {
              if (auth) {
                googleDriveService
                  .uploadProductImage(uri, `product_${product.id}_${Date.now()}.jpg`)
                  .then((driveUrl) => {
                    updateProduct(product.id, { image: driveUrl });
                  })
                  .catch((err) => console.warn('[ProductCard] Drive image upload error:', err));
              }
            })
            .catch(() => {});
        }}
        title={`${product.image ? 'Change' : 'Snap'} Photo: ${product.name}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.md,
    marginBottom: Spacing.md,
  },
  imageContainer: {
    height: 100,
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallbackWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    top: 7,
    left: 7,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    zIndex: 2,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  stockBadge: {
    position: 'absolute',
    top: 7,
    right: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    zIndex: 2,
  },
  stockBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  cameraSnapBtn: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    padding: 5,
    borderRadius: BorderRadius.full,
    zIndex: 2,
  },
  contentWrap: {
    padding: Spacing.sm,
    gap: 6,
  },
  productName: {
    fontSize: 14,
    fontWeight: '800',
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
    gap: 4,
    flexWrap: 'wrap',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  unitLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  costValue: {
    fontSize: 10,
    fontWeight: '600',
  },
  profitChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  profitChipText: {
    fontSize: 10,
    fontWeight: '800',
  },
  stockSection: {
    gap: 4,
  },
  stockLevelLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  stockBarTrack: {
    height: 4,
    borderRadius: 2,
    width: '100%',
    overflow: 'hidden',
  },
  stockBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  quickStockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  quickStockBtn: {
    flex: 1,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    alignItems: 'center',
  },
  quickStockBtnText: {
    fontSize: 9,
    fontWeight: '800',
  },
  barcodePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  barcodeText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 5,
    paddingTop: 6,
    borderTopWidth: 1,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  actionBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    ...Shadows.sm,
  },
  actionBtnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
});
