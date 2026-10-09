import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

interface ProductBarcodeModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyBarcode: (code: string) => void;
  currentBarcode?: string;
  productIdToExclude?: string;
}

export const ProductBarcodeModal: React.FC<ProductBarcodeModalProps> = ({
  visible,
  onClose,
  onApplyBarcode,
  currentBarcode = '',
  productIdToExclude,
}) => {
  const { products, settings, language, t } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const isUrdu = language === 'ur';

  const [inputCode, setInputCode] = useState(currentBarcode);
  const inputRef = useRef<TextInput>(null);

  // Animated Laser Scanner Line
  const laserAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setInputCode(currentBarcode || '');
      // Start looping laser animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(laserAnim, {
            toValue: 1,
            duration: 1800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(laserAnim, {
            toValue: 0,
            duration: 1800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Auto-focus input after modal renders
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    } else {
      laserAnim.stopAnimation();
    }
  }, [visible, currentBarcode, laserAnim]);

  // Check for duplicate barcode in other products
  const trimmed = inputCode.trim();
  const duplicateProduct = trimmed
    ? products.find(
      (p) =>
        p.barcode?.toLowerCase() === trimmed.toLowerCase() &&
        p.id !== productIdToExclude
    )
    : null;

  const handleApply = () => {
    if (!trimmed) return;
    onApplyBarcode(trimmed);
    onClose();
  };

  const handleGenerateSku = () => {
    const randomDigits = Math.floor(10000000 + Math.random() * 90000000).toString();
    const generated = `8964${randomDigits}`;
    setInputCode(generated);
  };

  const laserTranslateY = laserAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 96],
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <Pressable style={styles.backdropPress} onPress={onClose} />
        <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {/* Header */}
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <View style={styles.headerTitleWrap}>
              <View style={[styles.headerIconWrap, { backgroundColor: theme.primaryLight }]}>
                <Ionicons name="barcode-outline" size={20} color={theme.primary} />
              </View>
              <View>
                <Text style={[styles.modalTitle, { color: theme.text }]}>
                  {isUrdu ? 'بارکوڈ سکین یا درج کریں' : 'Scan or Enter Barcode'}
                </Text>
                <Text style={[styles.modalSub, { color: theme.textMuted }]}>
                  {isUrdu ? 'اسکینر گن سے پڑھیں یا مینوئل لکھیں' : 'Compatible with Bluetooth / USB scanners'}
                </Text>
              </View>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
              <Ionicons name="close" size={22} color={theme.textMuted} />
            </Pressable>
          </View>

          {/* Body */}
          <View style={styles.body}>
            {/* Visual Viewfinder Frame */}
            <View
              style={[
                styles.scannerBox,
                {
                  backgroundColor: settings.darkMode ? '#0B1120' : '#F1F5F9',
                  borderColor: duplicateProduct ? '#FCA5A5' : theme.border,
                },
              ]}
            >
              {/* Corner guide markers */}
              <View style={[styles.corner, styles.cornerTL, { borderColor: theme.primary }]} />
              <View style={[styles.corner, styles.cornerTR, { borderColor: theme.primary }]} />
              <View style={[styles.corner, styles.cornerBL, { borderColor: theme.primary }]} />
              <View style={[styles.corner, styles.cornerBR, { borderColor: theme.primary }]} />

              {/* Animated Laser Beam */}
              <Animated.View
                style={[
                  styles.laserLine,
                  {
                    transform: [{ translateY: laserTranslateY }],
                  },
                ]}
              />

              <Ionicons
                name="barcode-outline"
                size={48}
                color={settings.darkMode ? '#334155' : '#CBD5E1'}
              />
              <Text style={[styles.scannerPrompt, { color: theme.textMuted }]}>
                {isUrdu
                  ? 'بارکوڈ گن سے اسکین کریں — کوڈ خودکار درج ہو جائے گا'
                  : 'Point hardware scanner gun or type barcode below'}
              </Text>
            </View>

            {/* Input Row */}
            <View style={styles.inputWrap}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>
                {isUrdu ? 'بارکوڈ / SKU نمبر' : 'Barcode / SKU Number'}
              </Text>
              <View
                style={[
                  styles.inputRow,
                  {
                    backgroundColor: theme.surfaceSubtle,
                    borderColor: duplicateProduct ? theme.danger : theme.border,
                  },
                ]}
              >
                <Ionicons name="barcode" size={20} color={theme.primary} style={{ marginLeft: 12 }} />
                <TextInput
                  ref={inputRef}
                  style={[styles.barcodeInput, { color: theme.text }]}
                  placeholder={isUrdu ? '89640001234...' : 'Type or scan barcode...'}
                  placeholderTextColor={theme.textMuted}
                  value={inputCode}
                  onChangeText={setInputCode}
                  onSubmitEditing={handleApply}
                  keyboardType="numeric"
                  returnKeyType="done"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {!!inputCode && (
                  <Pressable onPress={() => setInputCode('')} style={styles.clearBtn} hitSlop={8}>
                    <Ionicons name="close-circle" size={18} color={theme.textMuted} />
                  </Pressable>
                )}
              </View>
            </View>

            {/* Duplicate Warning */}
            {duplicateProduct && (
              <View style={[styles.warningBox, { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' }]}>
                <Ionicons name="alert-circle" size={18} color="#DC2626" />
                <Text style={styles.warningText}>
                  {isUrdu
                    ? `⚠️ یہ بارکوڈ پہلے سے "${duplicateProduct.name}" کے لیے استعمال ہو رہا ہے!`
                    : `⚠️ Already used by: "${duplicateProduct.name}" (${settings.currencySymbol}${duplicateProduct.price})`}
                </Text>
              </View>
            )}

            {/* Helper Actions: Auto SKU */}
            <View style={styles.quickActionsRow}>
              <Pressable
                onPress={handleGenerateSku}
                style={({ pressed }) => [
                  styles.quickSkuBtn,
                  { backgroundColor: theme.primaryLight },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Ionicons name="sparkles" size={15} color={theme.primary} />
                <Text style={[styles.quickSkuText, { color: theme.primaryDark }]}>
                  {isUrdu ? 'خودکار اندرونی SKU جنریٹ کریں' : 'Generate Internal SKU (8964...)'}
                </Text>
              </Pressable>
            </View>

            {/* Modal Actions */}
            <View style={styles.actionButtonsRow}>
              <Pressable
                onPress={onClose}
                style={({ pressed }) => [
                  styles.cancelBtn,
                  { borderColor: theme.border, backgroundColor: theme.surfaceSubtle },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={[styles.cancelBtnText, { color: theme.text }]}>
                  {t('cancel')}
                </Text>
              </Pressable>

              <Pressable
                onPress={handleApply}
                disabled={!trimmed}
                style={({ pressed }) => [
                  styles.applyBtn,
                  { backgroundColor: trimmed ? theme.primary : theme.border },
                  pressed && trimmed && { opacity: 0.85 },
                ]}
              >
                <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
                <Text style={styles.applyBtnText}>
                  {isUrdu ? 'بارکوڈ محفوظ کریں' : 'Apply Barcode'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  backdropPress: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    width: '100%',
    maxWidth: 440,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  headerIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  modalSub: {
    fontSize: 11,
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
    borderRadius: BorderRadius.full,
  },
  body: {
    padding: Spacing.lg,
    gap: 14,
  },
  scannerBox: {
    height: 120,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderWidth: 3,
  },
  cornerTL: {
    top: 10,
    left: 10,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 10,
    right: 10,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 10,
    left: 10,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 10,
    right: 10,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 4,
  },
  laserLine: {
    position: 'absolute',
    left: '12%',
    right: '12%',
    top: 12,
    height: 2.5,
    backgroundColor: '#10B981',
    borderRadius: 2,
    shadowColor: '#10B981',
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  scannerPrompt: {
    fontSize: 11.5,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  inputWrap: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  barcodeInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  clearBtn: {
    paddingHorizontal: 12,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  warningText: {
    color: '#991B1B',
    fontSize: 11.5,
    fontWeight: '700',
    flex: 1,
  },
  quickActionsRow: {
    flexDirection: 'row',
  },
  quickSkuBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
  },
  quickSkuText: {
    fontSize: 12,
    fontWeight: '700',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  cancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  applyBtn: {
    flex: 2,
    height: 46,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
});
