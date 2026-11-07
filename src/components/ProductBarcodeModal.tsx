import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';
import { Ionicons } from '@expo/vector-icons';
import {
  CameraView,
  useCameraPermissions,
  type BarcodeScanningResult,
  type BarcodeType,
} from 'expo-camera';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
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

  const [permission, requestPermission] = useCameraPermissions();
  const [inputCode, setInputCode] = useState(currentBarcode);
  const [useCamera, setUseCamera] = useState(Platform.OS !== 'web');
  const [torchOn, setTorchOn] = useState(false);
  const scannedLock = useRef(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!visible) {
      scannedLock.current = false;
      setTorchOn(false);
      return;
    }
    setInputCode(currentBarcode || '');
    scannedLock.current = false;
    setUseCamera(Platform.OS !== 'web');
  }, [visible, currentBarcode]);

  const trimmed = inputCode.trim();
  const duplicateProduct = trimmed
    ? products.find(
        (p) =>
          p.barcode?.toLowerCase() === trimmed.toLowerCase() &&
          p.id !== productIdToExclude
      )
    : null;

  const handleApply = useCallback(
    (code?: string) => {
      const value = (code ?? inputCode).trim();
      if (!value) return;
      onApplyBarcode(value);
      onClose();
    },
    [inputCode, onApplyBarcode, onClose]
  );

  const handleBarcodeScanned = useCallback(
    (result: BarcodeScanningResult) => {
      if (scannedLock.current) return;
      const data = (result?.data || '').trim();
      if (!data) return;
      scannedLock.current = true;
      setInputCode(data);
      // Auto-apply when not a duplicate of another product
      const dup = products.find(
        (p) =>
          p.barcode?.toLowerCase() === data.toLowerCase() &&
          p.id !== productIdToExclude
      );
      if (!dup) {
        onApplyBarcode(data);
        onClose();
      } else {
        scannedLock.current = false;
      }
    },
    [products, productIdToExclude, onApplyBarcode, onClose]
  );

  const handleGenerateSku = () => {
    const randomDigits = Math.floor(10000000 + Math.random() * 90000000).toString();
    setInputCode(`8964${randomDigits}`);
  };

  const cameraReady =
    Platform.OS !== 'web' && useCamera && permission?.granted === true;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}>
        <Pressable style={styles.backdropPress} onPress={onClose} />
        <View
          style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <View style={styles.headerTitleWrap}>
              <View style={[styles.headerIconWrap, { backgroundColor: theme.primaryLight }]}>
                <Ionicons name="barcode-outline" size={20} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalTitle, { color: theme.text }]}>
                  {isUrdu ? 'بارکوڈ سکین یا درج کریں' : 'Scan or enter barcode'}
                </Text>
                <Text style={[styles.modalSub, { color: theme.textMuted }]}>
                  {isUrdu ? 'کیمرہ، گن، یا دستی' : 'Camera, gun, or type'}
                </Text>
              </View>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
              <Ionicons name="close" size={22} color={theme.textMuted} />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.body}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {Platform.OS !== 'web' ? (
              <View
                style={[
                  styles.modeSeg,
                  { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
                ]}>
                <Pressable
                  onPress={() => setUseCamera(true)}
                  style={[styles.modeBtn, useCamera && { backgroundColor: theme.primary }]}>
                  <Ionicons
                    name="camera-outline"
                    size={15}
                    color={useCamera ? '#FFFFFF' : theme.textSecondary}
                  />
                  <Text
                    style={[styles.modeBtnText, { color: useCamera ? '#FFFFFF' : theme.text }]}>
                    {isUrdu ? 'کیمرہ' : 'Camera'}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setUseCamera(false);
                    setTorchOn(false);
                    setTimeout(() => inputRef.current?.focus(), 120);
                  }}
                  style={[styles.modeBtn, !useCamera && { backgroundColor: theme.primary }]}>
                  <Ionicons
                    name="keypad-outline"
                    size={15}
                    color={!useCamera ? '#FFFFFF' : theme.textSecondary}
                  />
                  <Text
                    style={[styles.modeBtnText, { color: !useCamera ? '#FFFFFF' : theme.text }]}>
                    {isUrdu ? 'دستی / گن' : 'Manual / Gun'}
                  </Text>
                </Pressable>
              </View>
            ) : null}

            {useCamera && Platform.OS !== 'web' ? (
              <View
                style={[
                  styles.cameraBox,
                  {
                    borderColor: duplicateProduct ? '#FCA5A5' : theme.border,
                    backgroundColor: permission?.granted ? '#000000' : theme.surfaceSubtle,
                  },
                ]}>
                {!permission ? (
                  <ActivityIndicator color={theme.primary} />
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
                        ? 'پروڈکٹ بارکوڈ اسکین کرنے کے لیے کیمرہ آن کریں'
                        : 'Allow camera access to scan product barcodes'}
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
                    <View style={styles.viewfinderFrame} pointerEvents="none">
                      <View style={[styles.corner, styles.cornerTL]} />
                      <View style={[styles.corner, styles.cornerTR]} />
                      <View style={[styles.corner, styles.cornerBL]} />
                      <View style={[styles.corner, styles.cornerBR]} />
                    </View>
                    <Text style={styles.cameraHint}>
                      {isUrdu ? 'بارکوڈ فریم میں رکھیں' : 'Align barcode in the frame'}
                    </Text>
                    <Pressable
                      onPress={() => setTorchOn((v) => !v)}
                      style={[
                        styles.torchBtn,
                        { backgroundColor: torchOn ? theme.primary : 'rgba(15,23,42,0.7)' },
                      ]}>
                      <Ionicons
                        name={torchOn ? 'flash' : 'flash-outline'}
                        size={18}
                        color="#FFFFFF"
                      />
                    </Pressable>
                  </>
                )}
              </View>
            ) : null}

            <View style={styles.inputWrap}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>
                {isUrdu ? 'بارکوڈ / SKU نمبر' : 'Barcode / SKU'}
              </Text>
              <View
                style={[
                  styles.inputRow,
                  {
                    backgroundColor: theme.surfaceSubtle,
                    borderColor: duplicateProduct ? theme.danger : theme.border,
                  },
                ]}>
                <Ionicons name="barcode" size={20} color={theme.primary} style={{ marginLeft: 12 }} />
                <TextInput
                  ref={inputRef}
                  style={[styles.barcodeInput, { color: theme.text }]}
                  placeholder={isUrdu ? '89640001234...' : 'Type or scan barcode...'}
                  placeholderTextColor={theme.textMuted}
                  value={inputCode}
                  onChangeText={setInputCode}
                  onSubmitEditing={() => handleApply()}
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

            {duplicateProduct ? (
              <View style={[styles.warningBox, { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' }]}>
                <Ionicons name="alert-circle" size={18} color="#DC2626" />
                <Text style={styles.warningText}>
                  {isUrdu
                    ? `یہ بارکوڈ پہلے سے "${duplicateProduct.name}" پر ہے`
                    : `Already used by "${duplicateProduct.name}"`}
                </Text>
              </View>
            ) : null}

            <Pressable
              onPress={handleGenerateSku}
              style={({ pressed }) => [
                styles.quickSkuBtn,
                { backgroundColor: theme.primaryLight },
                pressed && { opacity: 0.8 },
              ]}>
              <Ionicons name="sparkles" size={15} color={theme.primary} />
              <Text style={[styles.quickSkuText, { color: theme.primaryDark }]}>
                {isUrdu ? 'خودکار SKU بنائیں' : 'Generate internal SKU'}
              </Text>
            </Pressable>

            <View style={styles.actionButtonsRow}>
              <Pressable
                onPress={onClose}
                style={({ pressed }) => [
                  styles.cancelBtn,
                  { borderColor: theme.border, backgroundColor: theme.surfaceSubtle },
                  pressed && { opacity: 0.7 },
                ]}>
                <Text style={[styles.cancelBtnText, { color: theme.text }]}>{t('cancel')}</Text>
              </Pressable>

              <Pressable
                onPress={() => handleApply()}
                disabled={!trimmed || !!duplicateProduct}
                style={({ pressed }) => [
                  styles.applyBtn,
                  {
                    backgroundColor:
                      trimmed && !duplicateProduct ? theme.primary : theme.border,
                  },
                  pressed && trimmed && !duplicateProduct && { opacity: 0.85 },
                ]}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
                <Text style={styles.applyBtnText}>
                  {isUrdu ? 'بارکوڈ محفوظ کریں' : 'Apply barcode'}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
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
    maxHeight: '92%',
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
    gap: 12,
  },
  modeSeg: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    gap: 4,
  },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modeBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  cameraBox: {
    height: 220,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  permissionIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  permissionWrap: {
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 8,
  },
  permissionTitle: {
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },
  permissionSub: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 260,
  },
  permissionBtn: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
  },
  permissionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  viewfinderFrame: {
    ...StyleSheet.absoluteFillObject,
    margin: 28,
  },
  corner: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderColor: '#34D399',
    borderWidth: 3,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 4,
  },
  cameraHint: {
    position: 'absolute',
    bottom: 12,
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '700',
    backgroundColor: 'rgba(15,23,42,0.65)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  torchBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
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
  quickSkuBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
  },
  quickSkuText: {
    fontSize: 12,
    fontWeight: '700',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
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
