import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  Pressable,
  ScrollView,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Product } from '@/types';
import { useShop } from '@/context/ShopContext';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { ProductImage } from '@/components/ProductImage';
import { CameraModal } from '@/components/CameraModal';
import { googleDriveService } from '@/services/googleDriveService';

interface ProductDetailsDrawerProps {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(420, SCREEN_WIDTH * 0.92);

export const ProductDetailsDrawer: React.FC<ProductDetailsDrawerProps> = ({
  visible,
  product,
  onClose,
  onEdit,
  onDelete,
  onAddToCart,
}) => {
  const { settings, language, t, updateProduct } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: DRAWER_WIDTH,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  if (!product) return null;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock <= (settings.lowStockThreshold || 5);

  const cost = product.costPrice || Math.round(product.price * 0.8);
  const unitProfit = Math.max(0, product.price - cost);
  const profitMarginPercent = product.price > 0 ? Math.round((unitProfit / product.price) * 100) : 0;
  const totalStockInvestment = cost * product.stock;
  const totalExpectedProfit = unitProfit * product.stock;

  const handleQuickAddStock = (amt: number) => {
    updateProduct(product.id, {
      stock: Math.max(0, product.stock + amt),
    });
  };

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      if (window.confirm(t('deleteProductConfirm'))) {
        onClose();
        onDelete(product);
      }
    } else {
      Alert.alert(t('deleteProduct'), t('deleteProductConfirm'), [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: () => {
            onClose();
            onDelete(product);
          },
        },
      ]);
    }
  };

  const getStockStatus = () => {
    if (isOutOfStock) {
      return {
        bg: theme.dangerLight,
        color: theme.danger,
        label: t('soldOut'),
        icon: 'alert-circle' as const,
      };
    }
    if (isLowStock) {
      return {
        bg: theme.warningLight,
        color: theme.warning,
        label: language === 'ur' ? 'کم اسٹاک الرٹ' : 'Low Stock Alert',
        icon: 'warning' as const,
      };
    }
    return {
      bg: theme.successLight,
      color: theme.success,
      label: language === 'ur' ? 'اسٹاک دستیاب ہے' : 'In Stock',
      icon: 'checkmark-circle' as const,
    };
  };

  const status = getStockStatus();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        {/* Backdrop */}
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: fadeAnim,
            },
          ]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        {/* Sliding Sidebar Drawer */}
        <Animated.View
          style={[
            styles.drawerContainer,
            {
              width: DRAWER_WIDTH,
              backgroundColor: theme.surface,
              borderColor: theme.border,
              paddingTop: Math.max(insets.top, 16),
              paddingBottom: Math.max(insets.bottom, 16),
              transform: [{ translateX: slideAnim }],
            },
          ]}>
          {/* Top Bar / Header */}
          <View style={[styles.drawerHeader, { borderBottomColor: theme.border }]}>
            <Pressable
              onPress={onClose}
              style={[styles.closeIconBtn, { backgroundColor: theme.surfaceSubtle }]}
              hitSlop={8}>
              <Ionicons name="close" size={20} color={theme.text} />
            </Pressable>

            <View style={styles.headerRightActions}>
              <Pressable
                onPress={handleDelete}
                style={[styles.headerActionBtn, { backgroundColor: theme.dangerLight }]}
                hitSlop={8}>
                <Ionicons name="trash-outline" size={17} color={theme.danger} />
              </Pressable>
            </View>
          </View>

          <ScrollView
            style={styles.drawerScroll}
            contentContainerStyle={styles.drawerScrollContent}
            showsVerticalScrollIndicator={false}>
            {/* Hero Media Banner */}
            <View style={[styles.heroImageWrap, { backgroundColor: theme.surfaceSubtle }]}>
              <ProductImage
                uri={product.image || product.imageUri}
                style={styles.heroImage}
                resizeMode="cover"
                fallbackColor={theme.textMuted}
                fallbackSize={48}
              />

              {/* Camera Update Button */}
              <Pressable
                onPress={() => setIsCameraOpen(true)}
                style={({ pressed }) => [
                  styles.heroCameraBtn,
                  {
                    backgroundColor: settings.darkMode
                      ? 'rgba(0,0,0,0.65)'
                      : 'rgba(255,255,255,0.92)',
                  },
                  pressed && { opacity: 0.8 },
                ]}>
                <Ionicons
                  name="camera"
                  size={15}
                  color={settings.darkMode ? '#FFFFFF' : '#1E293B'}
                />
                <Text
                  style={[
                    styles.heroCameraText,
                    { color: settings.darkMode ? '#FFFFFF' : '#1E293B' },
                  ]}>
                  {language === 'ur' ? 'تصویر' : 'Photo'}
                </Text>
              </Pressable>

              {/* Category Tag overlay */}
              <View
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor: settings.darkMode
                      ? 'rgba(0,0,0,0.65)'
                      : 'rgba(255,255,255,0.92)',
                  },
                ]}>
                <Text
                  style={[
                    styles.categoryPillText,
                    { color: settings.darkMode ? '#FFFFFF' : '#1E293B' },
                  ]}>
                  {product.category}
                </Text>
              </View>
            </View>

            {/* Product Identity */}
            <View style={styles.identitySection}>
              <View style={styles.nameRow}>
                <Text style={[styles.primaryName, { color: theme.text }]}>
                  {language === 'ur' && product.nameUrdu ? product.nameUrdu : product.name}
                </Text>
              </View>
              {language === 'ur' && product.nameUrdu && product.name ? (
                <Text style={[styles.secondaryName, { color: theme.textSecondary }]}>
                  {product.name}
                </Text>
              ) : null}

              {/* Stock Status Badge */}
              <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                <Ionicons name={status.icon} size={14} color={status.color} />
                <Text style={[styles.statusBadgeText, { color: status.color }]}>
                  {status.label} • {product.stock} {product.unit}
                </Text>
              </View>
            </View>

            {/* Financial Intelligence KPI Card */}
            <View
              style={[
                styles.kpiCard,
                {
                  backgroundColor: theme.surfaceSubtle,
                  borderColor: theme.border,
                },
              ]}>
              <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                {language === 'ur' ? 'مالیاتی خلاصہ' : 'Financial Breakdown'}
              </Text>

              {/* Row 1: Retail Price & Cost */}
              <View style={styles.kpiGrid}>
                <View style={styles.kpiCol}>
                  <Text style={[styles.kpiLabel, { color: theme.textMuted }]}>
                    {language === 'ur' ? 'فروخت قیمت' : 'Retail Price'}
                  </Text>
                  <Text style={[styles.kpiMainVal, { color: theme.primary }]}>
                    {settings.currencySymbol}
                    {product.price}
                    <Text style={styles.kpiUnit}> / {product.unit}</Text>
                  </Text>
                </View>

                <View style={styles.kpiCol}>
                  <Text style={[styles.kpiLabel, { color: theme.textMuted }]}>
                    {language === 'ur' ? 'خرید قیمت' : 'Cost Price'}
                  </Text>
                  <Text style={[styles.kpiSecondaryVal, { color: theme.text }]}>
                    {settings.currencySymbol}
                    {cost}
                  </Text>
                </View>
              </View>

              <View style={[styles.kpiDivider, { backgroundColor: theme.border }]} />

              {/* Row 2: Unit Profit & Margin */}
              <View style={styles.kpiGrid}>
                <View style={styles.kpiCol}>
                  <Text style={[styles.kpiLabel, { color: theme.textMuted }]}>
                    {language === 'ur' ? 'فی یونٹ منافع' : 'Profit / Unit'}
                  </Text>
                  <Text style={[styles.kpiProfitVal, { color: '#059669' }]}>
                    +{settings.currencySymbol}
                    {unitProfit}
                  </Text>
                </View>

                <View style={styles.kpiCol}>
                  <Text style={[styles.kpiLabel, { color: theme.textMuted }]}>
                    {language === 'ur' ? 'منافع مارجن' : 'Profit Margin'}
                  </Text>
                  <View style={styles.marginPill}>
                    <Text style={styles.marginPillText}>+{profitMarginPercent}%</Text>
                  </View>
                </View>
              </View>

              <View style={[styles.kpiDivider, { backgroundColor: theme.border }]} />

              {/* Row 3: Total Stock Value & Expected Total Profit */}
              <View style={styles.kpiGrid}>
                <View style={styles.kpiCol}>
                  <Text style={[styles.kpiLabel, { color: theme.textMuted }]}>
                    {t('totalInvestment')}
                  </Text>
                  <Text style={[styles.kpiSecondaryVal, { color: theme.text }]}>
                    {settings.currencySymbol}
                    {totalStockInvestment.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.kpiCol}>
                  <Text style={[styles.kpiLabel, { color: theme.textMuted }]}>
                    {language === 'ur' ? 'متوقع کل منافع' : 'Expected Profit'}
                  </Text>
                  <Text style={[styles.kpiProfitVal, { color: '#059669' }]}>
                    +{settings.currencySymbol}
                    {totalExpectedProfit.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>

            {/* Quick Stock Restock Section */}
            <View
              style={[
                styles.stockControlCard,
                {
                  backgroundColor: theme.surfaceSubtle,
                  borderColor: theme.border,
                },
              ]}>
              <View style={styles.stockControlHeader}>
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                  {language === 'ur' ? 'اسٹاک میں فوری اضافہ' : 'Quick Restock Stock'}
                </Text>
                <Text style={[styles.stockCurrentText, { color: theme.text }]}>
                  {product.stock} {product.unit}
                </Text>
              </View>

              {/* Restock Pills */}
              <View style={styles.restockBtnRow}>
                {[5, 10, 25, 50].map((amt) => (
                  <Pressable
                    key={amt}
                    onPress={() => handleQuickAddStock(amt)}
                    style={({ pressed }) => [
                      styles.restockPill,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                      },
                      pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
                    ]}>
                    <Text style={[styles.restockPillText, { color: theme.primary }]}>
                      +{amt}
                    </Text>
                  </Pressable>
                ))}

                {/* Decrement stock by 1 */}
                <Pressable
                  onPress={() => handleQuickAddStock(-1)}
                  disabled={product.stock <= 0}
                  style={({ pressed }) => [
                    styles.restockPill,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                    },
                    product.stock <= 0 && { opacity: 0.4 },
                    pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
                  ]}>
                  <Ionicons name="remove" size={16} color={theme.textSecondary} />
                </Pressable>
              </View>
            </View>

            {/* Barcode Section (if available) */}
            {product.barcode ? (
              <View
                style={[
                  styles.barcodeCard,
                  {
                    backgroundColor: theme.surfaceSubtle,
                    borderColor: theme.border,
                  },
                ]}>
                <View style={styles.barcodeLeft}>
                  <Ionicons name="barcode-outline" size={24} color={theme.primary} />
                  <View>
                    <Text style={[styles.barcodeLabel, { color: theme.textMuted }]}>
                      {language === 'ur' ? 'بارکوڈ' : 'Barcode'}
                    </Text>
                    <Text style={[styles.barcodeValue, { color: theme.text }]}>
                      {product.barcode}
                    </Text>
                  </View>
                </View>
              </View>
            ) : null}
          </ScrollView>

          {/* Sticky Bottom Actions */}
          <View style={[styles.drawerFooter, { borderTopColor: theme.border }]}>
            {onAddToCart && (
              <Pressable
                disabled={isOutOfStock}
                onPress={() => {
                  onAddToCart(product);
                  onClose();
                }}
                style={({ pressed }) => [
                  styles.addToBillBtn,
                  {
                    backgroundColor: isOutOfStock ? theme.surfaceSubtle : theme.primaryLight,
                    borderColor: isOutOfStock ? theme.border : theme.primary,
                  },
                  pressed && !isOutOfStock && { opacity: 0.85 },
                ]}>
                <Ionicons
                  name="cart"
                  size={18}
                  color={isOutOfStock ? theme.textMuted : theme.primary}
                />
                <Text
                  style={[
                    styles.addToBillText,
                    { color: isOutOfStock ? theme.textMuted : theme.primaryDark },
                  ]}>
                  {t('addItemToBill')}
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={() => {
                onClose();
                onEdit(product);
              }}
              style={({ pressed }) => [
                styles.editFullBtn,
                { backgroundColor: theme.primary },
                pressed && { opacity: 0.92, transform: [{ scale: 0.98 }] },
              ]}>
              <Ionicons name="create-outline" size={18} color="#FFFFFF" />
              <Text style={styles.editFullBtnText}>
                {language === 'ur' ? 'تفصیلات تبدیل کریں' : 'Edit Product'}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>

      {/* Camera Modal */}
      <CameraModal
        visible={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(uri) => {
          updateProduct(product.id, { image: uri, imageUri: uri });
          googleDriveService
            .getSavedAuth()
            .then((auth) => {
              if (auth) {
                googleDriveService
                  .uploadProductImage(uri, `product_${product.id}_${Date.now()}.jpg`)
                  .then((driveUrl) => {
                    if (driveUrl) {
                      updateProduct(product.id, { imageUri: driveUrl });
                    }
                  })
                  .catch((err) => console.log('Drive sync error:', err));
              }
            })
            .catch(() => {});
        }}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.48)',
  },
  drawerContainer: {
    height: '100%',
    borderLeftWidth: 1,
    ...Shadows.xl,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  closeIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerScroll: {
    flex: 1,
  },
  drawerScrollContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  heroImageWrap: {
    width: '100%',
    height: 200,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroCameraBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    ...Shadows.sm,
  },
  heroCameraText: {
    fontSize: 11,
    fontWeight: '700',
  },
  categoryPill: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  identitySection: {
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryName: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
  },
  secondaryName: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    marginTop: 6,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  kpiCard: {
    padding: Spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  kpiGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kpiCol: {
    flex: 1,
    gap: 2,
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  kpiMainVal: {
    fontSize: 18,
    fontWeight: '900',
  },
  kpiUnit: {
    fontSize: 13,
    fontWeight: '600',
  },
  kpiSecondaryVal: {
    fontSize: 16,
    fontWeight: '800',
  },
  kpiProfitVal: {
    fontSize: 16,
    fontWeight: '900',
  },
  marginPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    marginTop: 2,
  },
  marginPillText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '800',
  },
  kpiDivider: {
    height: 1,
    width: '100%',
  },
  stockControlCard: {
    padding: Spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  stockControlHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockCurrentText: {
    fontSize: 14,
    fontWeight: '800',
  },
  restockBtnRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  restockPill: {
    flex: 1,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restockPillText: {
    fontSize: 13,
    fontWeight: '800',
  },
  barcodeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: 14,
    borderWidth: 1,
  },
  barcodeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  barcodeLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  barcodeValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  drawerFooter: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    gap: 10,
  },
  addToBillBtn: {
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addToBillText: {
    fontSize: 14,
    fontWeight: '700',
  },
  editFullBtn: {
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Shadows.md,
  },
  editFullBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
