import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Platform,
  Vibration,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  CameraView,
  useCameraPermissions,
  type BarcodeScanningResult,
  type BarcodeType,
} from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShop } from '@/context/ShopContext';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { CartItem, Product } from '@/types';
import { ProductImage } from '@/components/ProductImage';
import { productIconFor } from '@/utils/productIcon';
import { playCashRegisterChime } from '@/utils/soundbox';

interface SaleBarcodeScannerSectionProps {
  onClose: () => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveFromCart: (productId: string) => void;
  cart: CartItem[];
  grandTotal: number;
  totalItemsCount: number;
  onOpenCurrentBill: () => void;
  onHoldCart: () => void;
  onClearCart: () => void;
  onAddNewProductWithBarcode?: (barcode: string) => void;
}

const RETAIL_BARCODE_TYPES: BarcodeType[] = [
  'ean13',
  'ean8',
  'upc_a',
  'upc_e',
  'code128',
  'code39',
  'code93',
  'itf14',
  'codabar',
  'qr',
];

interface ScanFeedback {
  type: 'success' | 'not_found';
  productName?: string;
  productPrice?: number;
  code: string;
  cartQty?: number;
}

export const SaleBarcodeScannerSection: React.FC<SaleBarcodeScannerSectionProps> = ({
  onClose,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  cart,
  grandTotal,
  totalItemsCount,
  onOpenCurrentBill,
  onHoldCart,
  onClearCart,
  onAddNewProductWithBarcode,
}) => {
  const { settings, language, t, products, showAlert } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const isUrdu = language === 'ur';
  const insets = useSafeAreaInsets();

  const [permission, requestPermission] = useCameraPermissions();
  const [torchOn, setTorchOn] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [lastFeedback, setLastFeedback] = useState<ScanFeedback | null>(null);

  // Debouncing locks to avoid spamming the same barcode within 1.5s
  const scannedLockRef = useRef(false);
  const lastScannedCodeRef = useRef<string | null>(null);
  const lastScannedTimeRef = useRef<number>(0);
  const feedbackTimeoutRef = useRef<any>(null);

  const processBarcode = useCallback(
    (rawCode: string) => {
      const code = rawCode.trim();
      if (!code) return;

      const found = products.find(
        (p) => p.barcode && p.barcode.trim().toLowerCase() === code.toLowerCase()
      );

      if (found) {
        // Haptic feedback & cash chime
        try {
          Vibration.vibrate(55);
        } catch {}
        playCashRegisterChime();

        onAddToCart(found, 1);

        const existingCartItem = cart.find((it) => it.product.id === found.id);
        const newQty = (existingCartItem ? existingCartItem.quantity : 0) + 1;

        if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
        setLastFeedback({
          type: 'success',
          productName: isUrdu && found.nameUrdu ? found.nameUrdu : found.name,
          productPrice: found.price,
          code,
          cartQty: newQty,
        });

        feedbackTimeoutRef.current = setTimeout(() => {
          setLastFeedback(null);
        }, 3200);
      } else {
        // Warning vibration
        try {
          Vibration.vibrate([0, 70, 70, 70]);
        } catch {}

        if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
        setLastFeedback({
          type: 'not_found',
          code,
        });

        feedbackTimeoutRef.current = setTimeout(() => {
          setLastFeedback(null);
        }, 4500);
      }
    },
    [products, onAddToCart, cart, isUrdu]
  );

  const handleBarcodeScanned = useCallback(
    (result: BarcodeScanningResult) => {
      const data = (result?.data || '').trim();
      if (!data) return;

      const now = Date.now();
      // If scanning the same barcode within 1.5s, debounce
      if (data === lastScannedCodeRef.current && now - lastScannedTimeRef.current < 1500) {
        return;
      }
      if (scannedLockRef.current) return;

      scannedLockRef.current = true;
      lastScannedCodeRef.current = data;
      lastScannedTimeRef.current = now;

      processBarcode(data);

      setTimeout(() => {
        scannedLockRef.current = false;
      }, 450);
    },
    [processBarcode]
  );

  const handleManualSubmit = () => {
    if (!manualCode.trim()) return;
    processBarcode(manualCode.trim());
    setManualCode('');
  };

  const cameraReady = Platform.OS !== 'web' && permission?.granted === true;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* ── Header Bar ── */}
      <View
        style={[
          styles.headerBar,
          {
            backgroundColor: theme.surface,
            borderBottomColor: theme.border,
          },
        ]}>
        {/* Back to Catalog */}
        <Pressable
          onPress={onClose}
          hitSlop={8}
          style={({ pressed }) => [
            styles.backBtn,
            { backgroundColor: theme.surfaceSubtle },
            pressed && { opacity: 0.8 },
          ]}
          accessibilityLabel="Back to catalog"
          accessibilityRole="button">
          <Ionicons
            name={isUrdu ? 'arrow-forward' : 'arrow-back'}
            size={18}
            color={theme.text}
          />
          <Text style={[styles.backBtnText, { color: theme.text }]}>
            {isUrdu ? 'اشیاء' : 'Catalog'}
          </Text>
        </Pressable>

        {/* Title */}
        <View style={styles.titleWrap}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {isUrdu ? 'بارکوڈ اسکینر' : 'Barcode Scanner'}
          </Text>
          <View style={styles.liveIndicatorRow}>
            <View style={[styles.liveDot, { backgroundColor: theme.primary }]} />
            <Text style={[styles.liveText, { color: theme.primary }]}>
              {isUrdu ? 'مستقل اسکین چالو ہے' : 'Continuous Scan Active'}
            </Text>
          </View>
        </View>

        {/* Right Tools: Torch & Manual */}
        <View style={styles.headerTools}>
          {cameraReady && (
            <Pressable
              onPress={() => setTorchOn(!torchOn)}
              hitSlop={8}
              style={[
                styles.toolIconBtn,
                {
                  backgroundColor: torchOn
                    ? (settings.darkMode ? 'rgba(245, 158, 11, 0.25)' : '#FEF3C7')
                    : theme.surfaceSubtle,
                  borderColor: torchOn ? '#F59E0B' : theme.border,
                },
              ]}>
              <Ionicons
                name={torchOn ? 'flash' : 'flash-outline'}
                size={18}
                color={torchOn ? '#D97706' : theme.textSecondary}
              />
            </Pressable>
          )}

          <Pressable
            onPress={() => setShowManualInput(!showManualInput)}
            hitSlop={8}
            style={[
              styles.toolIconBtn,
              {
                backgroundColor: showManualInput
                  ? (settings.darkMode ? 'rgba(99, 102, 241, 0.25)' : '#EEF2FF')
                  : theme.surfaceSubtle,
                borderColor: showManualInput ? '#6366F1' : theme.border,
              },
            ]}>
            <Ionicons
              name={showManualInput ? 'keypad' : 'keypad-outline'}
              size={18}
              color={showManualInput ? '#6366F1' : theme.textSecondary}
            />
          </Pressable>
        </View>
      </View>

      {/* ── Optional Manual Code / Barcode Gun Input ── */}
      {showManualInput && (
        <View
          style={[
            styles.manualInputWrap,
            { backgroundColor: theme.surface, borderBottomColor: theme.border },
          ]}>
          <View
            style={[
              styles.manualInputInner,
              { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
            ]}>
            <Ionicons name="barcode-outline" size={18} color={theme.textMuted} />
            <TextInput
              value={manualCode}
              onChangeText={setManualCode}
              placeholder={isUrdu ? 'بارکوڈ درج کریں یا گن اسکین...' : 'Type barcode or use scanner gun...'}
              placeholderTextColor={theme.textMuted}
              style={[styles.manualTextInput, { color: theme.text }]}
              autoFocus={true}
              keyboardType="default"
              returnKeyType="done"
              onSubmitEditing={handleManualSubmit}
            />
            {manualCode.trim().length > 0 && (
              <Pressable
                onPress={handleManualSubmit}
                style={[styles.manualSubmitBtn, { backgroundColor: theme.primary }]}>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </Pressable>
            )}
          </View>
        </View>
      )}

      {/* ── Camera Viewfinder Container ── */}
      <View
        style={[
          styles.viewfinderContainer,
          {
            backgroundColor: permission?.granted ? '#000000' : theme.surfaceSubtle,
            borderColor: theme.border,
          },
        ]}>
        {!permission ? (
          <ActivityIndicator color={theme.primary} size="large" />
        ) : !permission.granted ? (
          <View style={styles.permissionWrap}>
            <View style={[styles.permissionIconCircle, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name="camera-outline" size={28} color={theme.primary} />
            </View>
            <Text style={[styles.permissionTitle, { color: theme.text }]}>
              {isUrdu ? 'کیمرہ کی اجازت درکار ہے' : 'Camera permission needed'}
            </Text>
            <Text style={[styles.permissionSub, { color: theme.textSecondary }]}>
              {isUrdu
                ? 'پروڈکٹس اسکین کرنے کے لیے کیمرہ کو اجازت دیں'
                : 'Allow camera access to scan barcodes continuously'}
            </Text>
            <Pressable
              onPress={requestPermission}
              style={({ pressed }) => [
                styles.permissionBtn,
                { backgroundColor: theme.primary },
                pressed && { opacity: 0.88 },
              ]}>
              <Ionicons name="shield-checkmark-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.permissionBtnText}>
                {isUrdu ? 'اجازت دیں' : 'Allow camera'}
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            <CameraView
              style={StyleSheet.absoluteFillObject}
              facing="back"
              enableTorch={torchOn}
              barcodeScannerSettings={{ barcodeTypes: RETAIL_BARCODE_TYPES }}
              onBarcodeScanned={cameraReady ? handleBarcodeScanned : undefined}
            />

            {/* Targeting Frame with Green Corners */}
            <View style={styles.viewfinderFrame} pointerEvents="none">
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />

              <View style={styles.scanLaserLine} />

              <View style={styles.helperOverlayBadge}>
                <Text style={styles.helperOverlayText}>
                  {isUrdu ? 'بارکوڈ فریم کے اندر لائیں' : 'Align barcode within frame'}
                </Text>
              </View>
            </View>
          </>
        )}
      </View>

      {/* ── Live Scan Feedback Toast (Real-time Confirmation) ── */}
      {lastFeedback && (
        <View style={styles.feedbackBannerContainer}>
          {lastFeedback.type === 'success' ? (
            <View
              style={[
                styles.feedbackToast,
                {
                  backgroundColor: settings.darkMode ? '#064E3B' : '#DCFCE7',
                  borderColor: settings.darkMode ? '#059669' : '#86EFAC',
                },
              ]}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <View style={{ flex: 1 }}>
                <Text style={[styles.feedbackTitle, { color: settings.darkMode ? '#E6FFFA' : '#065F46' }]} numberOfLines={1}>
                  {lastFeedback.productName}
                </Text>
                <Text style={[styles.feedbackSub, { color: settings.darkMode ? '#A7F3D0' : '#047857' }]}>
                  {settings.currencySymbol}{lastFeedback.productPrice} · {isUrdu ? `بل میں کل: ${lastFeedback.cartQty}` : `Qty in bill: ${lastFeedback.cartQty}`}
                </Text>
              </View>
            </View>
          ) : (
            <View
              style={[
                styles.feedbackToast,
                {
                  backgroundColor: settings.darkMode ? '#7F1D1D' : '#FEE2E2',
                  borderColor: settings.darkMode ? '#DC2626' : '#FCA5A5',
                },
              ]}>
              <Ionicons name="alert-circle" size={20} color="#EF4444" />
              <View style={{ flex: 1 }}>
                <Text style={[styles.feedbackTitle, { color: settings.darkMode ? '#FEE2E2' : '#991B1B' }]}>
                  {isUrdu ? 'غیر درج شدہ بارکوڈ' : 'Unregistered Barcode'}
                </Text>
                <Text style={[styles.feedbackSub, { color: settings.darkMode ? '#FECDD3' : '#B91C1C' }]} numberOfLines={1}>
                  {lastFeedback.code}
                </Text>
              </View>
              {onAddNewProductWithBarcode && (
                <Pressable
                  onPress={() => onAddNewProductWithBarcode(lastFeedback.code)}
                  style={[styles.addUnregisteredBtn, { backgroundColor: '#DC2626' }]}>
                  <Text style={styles.addUnregisteredBtnText}>
                    {isUrdu ? '+ بنائیں' : '+ Create'}
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      )}

      {/* ── Scanned Items in Active Bill (Live Scrolled Feed) ── */}
      <View style={styles.billItemsSection}>
        <View style={styles.billItemsHeader}>
          <Text style={[styles.billItemsTitle, { color: theme.text }]}>
            {isUrdu ? 'بل میں شامل اشیاء' : 'Items in Current Bill'} ({totalItemsCount})
          </Text>
          {cart.length > 0 && (
            <Pressable
              onPress={() => {
                showAlert({
                  type: 'warning',
                  title: isUrdu ? 'بل خالی کریں؟' : 'Clear Current Bill?',
                  message: isUrdu
                    ? 'کیا آپ تمام اشیاء کو بل سے نکالنا چاہتے ہیں؟'
                    : 'Remove all scanned items from the bill?',
                  buttons: [
                    {
                      text: isUrdu ? 'ہاں، خالی کریں' : 'Clear',
                      style: 'destructive',
                      onPress: onClearCart,
                    },
                    { text: isUrdu ? 'منسوخ' : 'Cancel', style: 'cancel' },
                  ],
                });
              }}
              hitSlop={6}>
              <Text style={[styles.clearLinkText, { color: theme.danger }]}>
                {isUrdu ? 'خالی کریں' : 'Clear all'}
              </Text>
            </Pressable>
          )}
        </View>

        {cart.length === 0 ? (
          <View style={styles.emptyScannedBox}>
            <View style={[styles.emptyIconCircle, { backgroundColor: theme.surfaceSubtle }]}>
              <Ionicons name="barcode-outline" size={32} color={theme.textMuted} />
            </View>
            <Text style={[styles.emptyPromptTitle, { color: theme.text }]}>
              {isUrdu ? 'کیمرہ کے سامنے بارکوڈ لائیں' : 'Scan items one by one'}
            </Text>
            <Text style={[styles.emptyPromptSub, { color: theme.textMuted }]}>
              {isUrdu
                ? 'ہر اسکین شدہ چیز خود بخود بل میں شامل ہوتی جائے گی'
                : 'Scanned products are added to the active bill continuously'}
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scannedScroll}
            contentContainerStyle={styles.scannedScrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            {cart.map((item) => {
              const displayName = isUrdu && item.product.nameUrdu ? item.product.nameUrdu : item.product.name;
              return (
                <View
                  key={item.product.id}
                  style={[
                    styles.scannedItemRow,
                    {
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                    },
                  ]}>
                  <View style={styles.scannedItemLeft}>
                    <View style={[styles.scannedItemThumb, { backgroundColor: theme.surfaceSubtle }]}>
                      {item.product.image ? (
                        <ProductImage uri={item.product.image} style={StyleSheet.absoluteFillObject} />
                      ) : (
                        <Ionicons name={productIconFor(item.product.name) as any} size={18} color={theme.primary} />
                      )}
                    </View>
                    <View style={styles.scannedItemInfo}>
                      <Text style={[styles.scannedItemName, { color: theme.text }]} numberOfLines={1}>
                        {displayName}
                      </Text>
                      <Text style={[styles.scannedItemPrice, { color: theme.textMuted }]}>
                        {settings.currencySymbol}{item.unitPrice} × {item.quantity} ={' '}
                        <Text style={{ color: theme.primary, fontWeight: '800' }}>
                          {settings.currencySymbol}{item.total}
                        </Text>
                      </Text>
                    </View>
                  </View>

                  {/* Quantity Stepper */}
                  <View style={styles.stepperWrap}>
                    <Pressable
                      onPress={() => onUpdateQuantity(item.product.id, -1)}
                      style={[styles.stepperBtn, { backgroundColor: theme.surfaceSubtle }]}>
                      <Ionicons
                        name={item.quantity === 1 ? 'trash-outline' : 'remove'}
                        size={14}
                        color={item.quantity === 1 ? theme.danger : theme.text}
                      />
                    </Pressable>
                    <Text style={[styles.stepperQtyText, { color: theme.text }]}>
                      {item.quantity}
                    </Text>
                    <Pressable
                      onPress={() => onAddToCart(item.product, 1)}
                      style={[styles.stepperBtn, { backgroundColor: theme.primaryLight }]}>
                      <Ionicons name="add" size={14} color={theme.primary} />
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* ── Persistent Bottom Bill & Pay Dock (Open Current Bill) ── */}
      <View
        style={[
          styles.bottomDock,
          {
            backgroundColor: theme.surface,
            borderTopColor: theme.border,
            paddingBottom: 12,
          },
        ]}>
        {/* Bill Total & Item Summary */}
        <View style={styles.dockSummaryRow}>
          <View>
            <Text style={[styles.dockTotalLabel, { color: theme.textMuted }]}>
              {isUrdu ? 'موجودہ بل کا ٹوٹل' : 'Current Bill Total'}
            </Text>
            <Text style={[styles.dockGrandTotal, { color: theme.text }]} numberOfLines={1}>
              <Text style={{ color: theme.primary }}>{settings.currencySymbol} </Text>
              {grandTotal.toLocaleString()}
            </Text>
          </View>

          {cart.length > 0 && (
            <Pressable
              onPress={onHoldCart}
              style={[
                styles.holdBillBtn,
                {
                  backgroundColor: settings.darkMode ? 'rgba(245, 158, 11, 0.16)' : '#FEF3C7',
                  borderColor: settings.darkMode ? 'rgba(245, 158, 11, 0.45)' : '#FDE68A',
                },
              ]}>
              <Ionicons name="pause-circle" size={15} color="#D97706" />
              <Text style={styles.holdBillBtnText}>{isUrdu ? 'ہولڈ' : 'Hold'}</Text>
            </Pressable>
          )}
        </View>

        {/* Primary CTA: Open Current Bill / Checkout Drawer */}
        <Pressable
          onPress={onOpenCurrentBill}
          disabled={cart.length === 0}
          style={({ pressed }) => [
            styles.openBillCtaBtn,
            {
              backgroundColor: cart.length > 0 ? theme.primary : (settings.darkMode ? '#334155' : '#CBD5E1'),
              opacity: cart.length === 0 ? 0.7 : pressed ? 0.92 : 1,
            },
          ]}
          accessibilityLabel="Open current bill for payment"
          accessibilityRole="button">
          <Ionicons name="receipt-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.openBillCtaText}>
            {isUrdu
              ? `بل کھولیں اور وصولی کریں (${totalItemsCount} اشیاء)`
              : `Open Current Bill & Pay (${totalItemsCount} items)`}
          </Text>
          <Ionicons
            name={isUrdu ? 'arrow-back' : 'arrow-forward'}
            size={18}
            color="#FFFFFF"
            style={{ marginLeft: 8 }}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  backBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  titleWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  liveIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  liveText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  headerTools: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toolIconBtn: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  manualInputWrap: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  manualInputInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  manualTextInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
  },
  manualSubmitBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewfinderContainer: {
    height: 220,
    borderBottomWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  permissionWrap: {
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 8,
  },
  permissionIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionTitle: {
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  permissionSub: {
    fontSize: 11.5,
    textAlign: 'center',
    lineHeight: 16,
    maxWidth: 240,
  },
  permissionBtn: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  permissionBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  viewfinderFrame: {
    ...StyleSheet.absoluteFillObject,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderColor: '#34D399',
    borderWidth: 3.5,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 6,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 6,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 6,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 6,
  },
  scanLaserLine: {
    width: '90%',
    height: 1.5,
    backgroundColor: '#34D399',
    opacity: 0.85,
    ...Shadows.sm,
  },
  helperOverlayBadge: {
    position: 'absolute',
    bottom: 4,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  helperOverlayText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700',
  },
  feedbackBannerContainer: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  feedbackToast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    ...Shadows.sm,
  },
  feedbackTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  feedbackSub: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  addUnregisteredBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  addUnregisteredBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  billItemsSection: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  billItemsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  billItemsTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  clearLinkText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  emptyScannedBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 6,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyPromptTitle: {
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyPromptSub: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17,
  },
  scannedScroll: {
    flex: 1,
  },
  scannedScrollContent: {
    gap: 6,
    paddingBottom: 12,
  },
  scannedItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  scannedItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    paddingRight: 8,
  },
  scannedItemThumb: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  scannedItemInfo: {
    flex: 1,
  },
  scannedItemName: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  scannedItemPrice: {
    fontSize: 11,
    marginTop: 1,
  },
  stepperWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepperBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperQtyText: {
    fontSize: 12.5,
    fontWeight: '800',
    minWidth: 16,
    textAlign: 'center',
  },
  bottomDock: {
    borderTopWidth: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
    gap: 8,
    ...Shadows.md,
  },
  dockSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dockTotalLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  dockGrandTotal: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  holdBillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  holdBillBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#B45309',
  },
  openBillCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: BorderRadius.full,
    ...Shadows.sm,
  },
  openBillCtaText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
