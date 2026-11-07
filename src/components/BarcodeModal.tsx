import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  CameraView,
  useCameraPermissions,
  type BarcodeScanningResult,
  type BarcodeType,
} from 'expo-camera';
import { Product } from '@/types';
import { useShop } from '@/context/ShopContext';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

interface BarcodeModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
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

/**
 * Sale barcode scanner — camera scan + manual / gun entry.
 * Requires a native build that includes expo-camera (plugin already in app.json).
 */
export const BarcodeModal: React.FC<BarcodeModalProps> = ({
  visible,
  onClose,
  onSelectProduct,
}) => {
  const { products, settings, language, setIsAddProductOpen } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const isUrdu = language === 'ur';

  const [permission, requestPermission] = useCameraPermissions();
  const [inputCode, setInputCode] = useState('');
  const [notFoundCode, setNotFoundCode] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [useCamera, setUseCamera] = useState(Platform.OS !== 'web');
  const scannedLock = useRef(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!visible) {
      scannedLock.current = false;
      setTorchOn(false);
      return;
    }
    setInputCode('');
    setNotFoundCode(null);
    scannedLock.current = false;
    setUseCamera(Platform.OS !== 'web');
  }, [visible]);

  const productsWithBarcode = products.filter((p) => p.barcode);

  const performLookup = useCallback(
    (codeToSearch: string) => {
      const trimmed = codeToSearch.trim();
      if (!trimmed) return;

      const found = products.find(
        (p) => p.barcode?.toLowerCase() === trimmed.toLowerCase()
      );

      if (found) {
        setNotFoundCode(null);
        onSelectProduct(found);
        onClose();
        setInputCode('');
      } else {
        setNotFoundCode(trimmed);
        setInputCode(trimmed);
        scannedLock.current = false;
      }
    },
    [products, onSelectProduct, onClose]
  );

  const handleBarcodeScanned = useCallback(
    (result: BarcodeScanningResult) => {
      if (scannedLock.current) return;
      const data = (result?.data || '').trim();
      if (!data) return;
      scannedLock.current = true;
      performLookup(data);
    },
    [performLookup]
  );

  const handleInputChange = (text: string) => {
    setInputCode(text);
    if (notFoundCode) setNotFoundCode(null);

    const trimmed = text.trim();
    if (trimmed.length >= 3) {
      const match = products.find(
        (p) => p.barcode?.toLowerCase() === trimmed.toLowerCase()
      );
      if (match) {
        onSelectProduct(match);
        onClose();
        setInputCode('');
      }
    }
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
          style={[
            styles.modalCard,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <View style={styles.headerTitleWrap}>
              <View style={[styles.headerIconWrap, { backgroundColor: theme.primaryLight }]}>
                <Ionicons name="barcode-outline" size={20} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalTitle, { color: theme.text }]}>
                  {isUrdu ? 'بارکوڈ اسکین' : 'Scan barcode'}
                </Text>
                <Text style={[styles.modalSub, { color: theme.textMuted }]}>
                  {isUrdu ? 'کیمرہ، گن، یا دستی کوڈ' : 'Camera, gun, or type code'}
                </Text>
              </View>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
              <Ionicons name="close" size={22} color={theme.textMuted} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.bodyScroll}
            contentContainerStyle={styles.body}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {/* Mode toggle */}
            {Platform.OS !== 'web' ? (
              <View
                style={[
                  styles.modeSeg,
                  { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
                ]}>
                <Pressable
                  onPress={() => setUseCamera(true)}
                  style={[
                    styles.modeBtn,
                    useCamera && { backgroundColor: theme.primary },
                  ]}>
                  <Ionicons
                    name="camera-outline"
                    size={15}
                    color={useCamera ? '#FFFFFF' : theme.textSecondary}
                  />
                  <Text
                    style={[
                      styles.modeBtnText,
                      { color: useCamera ? '#FFFFFF' : theme.text },
                    ]}>
                    {isUrdu ? 'کیمرہ' : 'Camera'}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setUseCamera(false);
                    setTorchOn(false);
                    setTimeout(() => inputRef.current?.focus(), 120);
                  }}
                  style={[
                    styles.modeBtn,
                    !useCamera && { backgroundColor: theme.primary },
                  ]}>
                  <Ionicons
                    name="keypad-outline"
                    size={15}
                    color={!useCamera ? '#FFFFFF' : theme.textSecondary}
                  />
                  <Text
                    style={[
                      styles.modeBtnText,
                      { color: !useCamera ? '#FFFFFF' : theme.text },
                    ]}>
                    {isUrdu ? 'دستی / گن' : 'Manual / Gun'}
                  </Text>
                </Pressable>
              </View>
            ) : null}

            {/* Camera preview */}
            {useCamera && Platform.OS !== 'web' ? (
              <View
                style={[
                  styles.cameraBox,
                  {
                    borderColor: notFoundCode ? '#FCA5A5' : theme.border,
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
                      ]}
                      hitSlop={8}>
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

            {/* Manual / gun input */}
            <View style={styles.inputWrap}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>
                {isUrdu ? 'بارکوڈ نمبر' : 'Barcode / SKU'}
              </Text>
              <View
                style={[
                  styles.inputRow,
                  {
                    backgroundColor: theme.surfaceSubtle,
                    borderColor: notFoundCode ? theme.danger : theme.border,
                  },
                ]}>
                <Ionicons
                  name="barcode"
                  size={20}
                  color={theme.primary}
                  style={{ marginLeft: 12 }}
                />
                <TextInput
                  ref={inputRef}
                  style={[styles.barcodeInput, { color: theme.text }]}
                  placeholder={isUrdu ? 'کوڈ اسکین یا درج کریں...' : 'Scan or enter code...'}
                  placeholderTextColor={theme.textMuted}
                  value={inputCode}
                  onChangeText={handleInputChange}
                  onSubmitEditing={() => performLookup(inputCode)}
                  keyboardType="numeric"
                  returnKeyType="search"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {!!inputCode && (
                  <Pressable onPress={() => setInputCode('')} style={styles.clearBtn} hitSlop={8}>
                    <Ionicons name="close-circle" size={18} color={theme.textMuted} />
                  </Pressable>
                )}
                <Pressable
                  onPress={() => performLookup(inputCode)}
                  style={[styles.lookupBtn, { backgroundColor: theme.primary }]}>
                  <Ionicons name="search" size={18} color="#FFFFFF" />
                </Pressable>
              </View>
            </View>

            {notFoundCode ? (
              <View
                style={[
                  styles.notFoundCard,
                  { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' },
                ]}>
                <Ionicons name="alert-circle" size={20} color="#DC2626" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.notFoundTitle}>
                    {isUrdu
                      ? `کوڈ "${notFoundCode}" نہیں ملا`
                      : `No product for "${notFoundCode}"`}
                  </Text>
                  <Text style={styles.notFoundSub}>
                    {isUrdu
                      ? 'نیا پروڈکٹ شامل کریں؟'
                      : 'Add it as a new product?'}
                  </Text>
                </View>
                <Pressable
                  onPress={() => {
                    onClose();
                    setIsAddProductOpen(true);
                  }}
                  style={styles.addNewItemBtn}>
                  <Text style={styles.addNewItemText}>
                    {isUrdu ? '+ شامل کریں' : '+ Add'}
                  </Text>
                </Pressable>
              </View>
            ) : null}

            {productsWithBarcode.length > 0 ? (
              <View style={styles.quickListSection}>
                <Text style={[styles.quickListTitle, { color: theme.textSecondary }]}>
                  {isUrdu ? 'بارکوڈ والی اشیاء:' : 'Items with barcode:'}
                </Text>
                {productsWithBarcode.slice(0, 8).map((p) => (
                  <Pressable
                    key={p.id}
                    onPress={() => {
                      onSelectProduct(p);
                      onClose();
                    }}
                    style={({ pressed }) => [
                      styles.barcodeItem,
                      {
                        backgroundColor: theme.surfaceSubtle,
                        borderColor: theme.border,
                      },
                      pressed && { opacity: 0.75, backgroundColor: theme.primaryLight },
                    ]}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.itemTitle, { color: theme.text }]}>{p.name}</Text>
                      <Text style={[styles.itemCode, { color: theme.primary }]}>
                        {p.barcode}
                      </Text>
                    </View>
                    <Text style={[styles.itemPrice, { color: theme.text }]}>
                      {settings.currencySymbol} {p.price}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
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
  bodyScroll: {
    flexGrow: 0,
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
    height: 240,
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
    paddingHorizontal: 8,
  },
  lookupBtn: {
    width: 44,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  notFoundTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#991B1B',
  },
  notFoundSub: {
    fontSize: 11,
    color: '#7F1D1D',
    marginTop: 1,
  },
  addNewItemBtn: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
  },
  addNewItemText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
  },
  quickListSection: {
    marginTop: 4,
    gap: 6,
  },
  quickListTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  barcodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  itemCode: {
    fontSize: 11.5,
    marginTop: 1,
    fontWeight: '600',
  },
  itemPrice: {
    fontSize: 13.5,
    fontWeight: '800',
  },
});
