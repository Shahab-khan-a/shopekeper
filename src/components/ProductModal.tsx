import { CameraModal } from '@/components/CameraModal';
import { ProductBarcodeModal } from '@/components/ProductBarcodeModal';
import { ProductImage } from '@/components/ProductImage';
import { UNIT_OPTIONS } from '@/constants/categories';
import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';
import { googleDriveService } from '@/services/googleDriveService';
import { Product, ProductCategory, ProductUnit } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Keyboard,
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

interface ProductModalProps {
  visible: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

/**
 * Simplified add/edit product sheet.
 * Shopkeeper essentials: photo, name, price, stock, unit, cost price (optional), barcode (optional).
 * Category is set silently for data compatibility — no picker UI.
 */
export const ProductModal: React.FC<ProductModalProps> = ({
  visible,
  onClose,
  productToEdit,
}) => {
  const { addProduct, updateProduct, settings, t, language, showAlert } = useShop();
  const insets = useSafeAreaInsets();
  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const isUrdu = language === 'ur';

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [unit, setUnit] = useState<ProductUnit>('piece');
  const [barcode, setBarcode] = useState('');
  const [image, setImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState(false);
  const [isUploadingToDrive, setIsUploadingToDrive] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // On devices with hardware/software 3-button navigation (Back, Home, Recent Apps),
  // insets.bottom is typically 48dp. If insets.bottom is 0 on older Android ROMs
  // with translucent modal, enforce a minimum safe padding (at least 32dp on Android)
  // so Save and Cancel buttons never hide behind the system navigation bar.
  const safeBottomPadding =
    keyboardHeight > 0
      ? 12
      : Math.max(insets.bottom, Platform.OS === 'android' ? 32 : 16) + 12;

  const priceInputRef = useRef<TextInput>(null);
  const stockInputRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);

  const softBorder = settings.darkMode ? 'rgba(255,255,255,0.1)' : '#E2E8F0';
  const inputBg = settings.darkMode ? '#1E293B' : '#FFFFFF';

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardHeight(0)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const resetForm = () => {
    setName('');
    setPrice('');
    setCostPrice('');
    setStock('10');
    setUnit('piece');
    setBarcode('');
    setImage('');
    setIsSubmitting(false);
    setIsCameraOpen(false);
    setIsUploadingToDrive(false);
  };

  useEffect(() => {
    if (!visible) return;
    if (productToEdit) {
      setName(productToEdit.name);
      setPrice(productToEdit.price.toString());
      setCostPrice(productToEdit.costPrice ? productToEdit.costPrice.toString() : '');
      setStock(productToEdit.stock.toString());
      setUnit(productToEdit.unit);
      setBarcode(productToEdit.barcode || '');
      setImage(productToEdit.image || productToEdit.imageUri || '');
    } else {
      resetForm();
    }
  }, [productToEdit, visible]);

  const parsedPrice = parseFloat(price);
  const hasValidCost =
    Boolean(costPrice) && !isNaN(parseFloat(costPrice)) && parseFloat(costPrice) > 0;
  const parsedCost = hasValidCost ? parseFloat(costPrice) : 0;
  const unitProfit = hasValidCost ? Math.max(0, (parsedPrice || 0) - parsedCost) : 0;
  const activeUnit = UNIT_OPTIONS.find((u) => u.key === unit) || UNIT_OPTIONS[0];

  const toPersistentDataUrl = async (uri: string): Promise<string> => {
    if (!uri || uri.startsWith('data:')) return uri;
    try {
      const res = await fetch(uri);
      const blob = await res.blob();
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string) || uri);
        reader.onerror = () => resolve(uri);
        reader.readAsDataURL(blob);
      });
    } catch {
      return uri;
    }
  };

  const handleImageSelected = async (rawUri: string) => {
    const persistentUri = await toPersistentDataUrl(rawUri);
    setImage(persistentUri);

    const driveAuth = await googleDriveService.getSavedAuth();
    if (!driveAuth) return;

    setIsUploadingToDrive(true);
    try {
      const driveUrl = await googleDriveService.uploadProductImage(
        rawUri || persistentUri,
        `product_${Date.now()}.jpg`
      );
      setImage(driveUrl);
    } catch (err) {
      console.error('[ProductModal] Drive upload error:', err);
    } finally {
      setIsUploadingToDrive(false);
    }
  };

  const takePhoto = () => setIsCameraOpen(true);

  const pickImage = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          showAlert({
            type: 'warning',
            title: t('warningAlert'),
            message: 'Gallery permission is required to choose photos.',
          });
          return;
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.[0]) {
        await handleImageSelected(result.assets[0].uri);
      }
    } catch (e) {
      console.warn('Image picker error:', e);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      showAlert({
        type: 'warning',
        title: t('warningAlert'),
        message: isUrdu ? 'براہ کرم پروڈکٹ کا نام درج کریں' : 'Please enter product name.',
      });
      return;
    }
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      showAlert({
        type: 'warning',
        title: t('warningAlert'),
        message: isUrdu ? 'براہ کرم درست قیمت درج کریں' : 'Please enter a valid price.',
      });
      return;
    }
    const parsedStock = parseInt(stock, 10);
    if (isNaN(parsedStock) || parsedStock < 0) {
      showAlert({
        type: 'warning',
        title: t('warningAlert'),
        message: isUrdu ? 'براہ کرم درست اسٹاک درج کریں' : 'Please enter a valid stock quantity.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const finalCost =
        costPrice && !isNaN(parseFloat(costPrice)) && parseFloat(costPrice) > 0
          ? parseFloat(costPrice)
          : undefined;

      const payload = {
        name: name.trim(),
        nameUrdu: productToEdit?.nameUrdu,
        price: parsedPrice,
        costPrice: finalCost,
        stock: parsedStock,
        category: productToEdit?.category || 'Others',
        unit,
        barcode: barcode.trim() || undefined,
        image: image.trim() || undefined,
      };

      if (productToEdit) {
        await updateProduct(productToEdit.id, payload);
      } else {
        await addProduct(payload);
      }
      onClose();
      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestClose = () => {
    if (isBarcodeScannerOpen) {
      setIsBarcodeScannerOpen(false);
      return;
    }
    if (isCameraOpen) {
      setIsCameraOpen(false);
      return;
    }
    onClose();
  };

  const scrollFieldIntoView = () => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 80);
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        transparent
        statusBarTranslucent
        onRequestClose={handleRequestClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.kav}
          keyboardVerticalOffset={0}>
          <View
            style={[
              styles.sheetWrap,
              {
                // Android: KAV doesn't shift bottom sheets — pad by keyboard height.
                // iOS: KeyboardAvoidingView handles lift; avoid double offset.
                paddingBottom:
                  Platform.OS === 'android' && keyboardHeight > 0 ? keyboardHeight : 0,
              },
            ]}>
            <Pressable style={styles.backdrop} onPress={handleRequestClose} />
            <View
              style={[
                styles.sheet,
                {
                  backgroundColor: theme.surface,
                  borderColor: softBorder,
                  maxHeight: keyboardHeight > 0 ? '100%' : '88%',
                },
              ]}>
            <View style={styles.handleWrap}>
              <View style={[styles.handle, { backgroundColor: softBorder }]} />
            </View>

            <View style={[styles.header, { borderBottomColor: softBorder }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, { color: theme.text }]}>
                  {productToEdit
                    ? isUrdu
                      ? 'پروڈکٹ ترمیم'
                      : 'Edit product'
                    : isUrdu
                      ? 'نیا پروڈکٹ'
                      : 'New product'}
                </Text>
                <Text style={[styles.subtitle, { color: theme.textMuted }]}>
                  {isUrdu ? 'نام، قیمت اور اسٹاک' : 'Name, price, and stock'}
                </Text>
              </View>
              <Pressable
                onPress={onClose}
                style={[styles.closeBtn, { backgroundColor: theme.surfaceSubtle }]}
                hitSlop={8}>
                <Ionicons name="close" size={18} color={theme.textMuted} />
              </Pressable>
            </View>

            <ScrollView
              ref={scrollRef}
              style={styles.scroll}
              contentContainerStyle={[
                styles.content,
                { paddingBottom: 16 },
              ]}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
              showsVerticalScrollIndicator={false}>
              {/* Photo */}
              <View style={styles.photoRow}>
                <View style={[styles.photoThumb, { backgroundColor: theme.surfaceSubtle, borderColor: softBorder }]}>
                  {image ? (
                    <ProductImage uri={image} style={styles.photoImg} resizeMode="cover" />
                  ) : (
                    <Ionicons name="image-outline" size={22} color={theme.textMuted} />
                  )}
                  {isUploadingToDrive ? (
                    <View style={styles.photoUploading}>
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    </View>
                  ) : null}
                </View>
                <View style={styles.photoActions}>
                  <Pressable
                    onPress={takePhoto}
                    style={({ pressed }) => [
                      styles.photoBtn,
                      { backgroundColor: theme.primaryLight },
                      pressed && { opacity: 0.85 },
                    ]}>
                    <Ionicons name="camera" size={15} color={theme.primary} />
                    <Text style={[styles.photoBtnText, { color: theme.primaryDark }]}>
                      {isUrdu ? 'کیمرہ' : 'Camera'}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={pickImage}
                    style={({ pressed }) => [
                      styles.photoBtn,
                      { backgroundColor: theme.surfaceSubtle, borderColor: softBorder, borderWidth: 1 },
                      pressed && { opacity: 0.85 },
                    ]}>
                    <Ionicons name="images-outline" size={15} color={theme.textSecondary} />
                    <Text style={[styles.photoBtnText, { color: theme.text }]}>
                      {isUrdu ? 'گیلری' : 'Gallery'}
                    </Text>
                  </Pressable>
                  {image ? (
                    <Pressable onPress={() => setImage('')} hitSlop={8}>
                      <Text style={{ color: theme.danger, fontSize: 12, fontWeight: '700' }}>
                        {isUrdu ? 'ہٹائیں' : 'Remove'}
                      </Text>
                    </Pressable>
                  ) : null}
                </View>
              </View>

              {/* Name */}
              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.text }]}>
                  {isUrdu ? 'نام *' : 'Name *'}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: inputBg,
                      color: theme.text,
                      borderColor: focusedField === 'name' ? theme.primary : softBorder,
                    },
                  ]}
                  placeholder={isUrdu ? 'مثلاً چینی، گھی، چاول' : 'e.g. Sugar, Oil, Rice'}
                  placeholderTextColor={theme.textMuted}
                  value={name}
                  onChangeText={setName}
                  onFocus={() => {
                    setFocusedField('name');
                    scrollFieldIntoView();
                  }}
                  onBlur={() => setFocusedField(null)}
                  returnKeyType="next"
                  onSubmitEditing={() => priceInputRef.current?.focus()}
                />
              </View>

              {/* Price + Stock */}
              <View style={styles.twoCol}>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={[styles.label, { color: theme.text }]}>
                    {isUrdu ? 'قیمت *' : 'Price *'}
                  </Text>
                  <View
                    style={[
                      styles.prefixInput,
                      {
                        backgroundColor: inputBg,
                        borderColor: focusedField === 'price' ? theme.primary : softBorder,
                      },
                    ]}>
                    <Text style={[styles.prefix, { color: theme.primaryDark }]}>
                      {settings.currencySymbol}
                    </Text>
                    <TextInput
                      ref={priceInputRef}
                      style={[styles.prefixField, { color: theme.text }]}
                      placeholder="0"
                      placeholderTextColor={theme.textMuted}
                      keyboardType="numeric"
                      value={price}
                      onChangeText={setPrice}
                      onFocus={() => {
                        setFocusedField('price');
                        scrollFieldIntoView();
                      }}
                      onBlur={() => setFocusedField(null)}
                      returnKeyType="next"
                      onSubmitEditing={() => stockInputRef.current?.focus()}
                    />
                  </View>
                </View>

                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={[styles.label, { color: theme.text }]}>
                    {isUrdu ? 'اسٹاک *' : 'Stock *'}
                  </Text>
                  <TextInput
                    ref={stockInputRef}
                    style={[
                      styles.input,
                      {
                        backgroundColor: inputBg,
                        color: theme.text,
                        borderColor: focusedField === 'stock' ? theme.primary : softBorder,
                      },
                    ]}
                    placeholder="10"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="numeric"
                    value={stock}
                    onChangeText={setStock}
                    onFocus={() => {
                      setFocusedField('stock');
                      scrollFieldIntoView();
                    }}
                    onBlur={() => setFocusedField(null)}
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                  />
                </View>
              </View>

              {/* Unit pills */}
              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.text }]}>
                  {isUrdu ? 'اکائی' : 'Unit'}
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.unitRow}>
                  {UNIT_OPTIONS.map((opt) => {
                    const active = unit === opt.key;
                    return (
                      <Pressable
                        key={opt.key}
                        onPress={() => setUnit(opt.key)}
                        style={[
                          styles.unitPill,
                          {
                            backgroundColor: active ? theme.primaryLight : theme.surfaceSubtle,
                            borderColor: active ? theme.primary : softBorder,
                          },
                        ]}>
                        <Text
                          style={{
                            color: active ? theme.primaryDark : theme.textSecondary,
                            fontSize: 12,
                            fontWeight: '700',
                          }}>
                          {isUrdu ? opt.labelUrdu : opt.shortCode}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Cost price (Optional) */}
              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.text }]}>
                  {isUrdu ? 'خرید قیمت (اختیاری)' : 'Cost price (Optional)'}
                </Text>
                <View
                  style={[
                    styles.prefixInput,
                    {
                      backgroundColor: inputBg,
                      borderColor: focusedField === 'cost' ? theme.primary : softBorder,
                    },
                  ]}>
                  <Text style={[styles.prefix, { color: theme.textMuted }]}>
                    {settings.currencySymbol}
                  </Text>
                  <TextInput
                    style={[styles.prefixField, { color: theme.text }]}
                    placeholder="0"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="numeric"
                    value={costPrice}
                    onChangeText={setCostPrice}
                    onFocus={() => {
                      setFocusedField('cost');
                      scrollFieldIntoView();
                    }}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
                {hasValidCost && parsedPrice > 0 ? (
                  <Text style={[styles.profitHint, { color: theme.success }]}>
                    {isUrdu
                      ? `منافع ${settings.currencySymbol}${unitProfit} / ${activeUnit.shortCode}`
                      : `Profit ${settings.currencySymbol}${unitProfit} / ${activeUnit.shortCode}`}
                  </Text>
                ) : null}
              </View>

              {/* Barcode (Optional) */}
              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.text }]}>
                  {isUrdu ? 'بارکوڈ (اختیاری)' : 'Barcode (Optional)'}
                </Text>
                <View style={styles.barcodeRow}>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        flex: 1,
                        backgroundColor: inputBg,
                        color: theme.text,
                        borderColor: focusedField === 'barcode' ? theme.primary : softBorder,
                      },
                    ]}
                    placeholder={isUrdu ? '8964… یا بارکوڈ سکین کریں' : '8964… or scan barcode'}
                    placeholderTextColor={theme.textMuted}
                    value={barcode}
                    onChangeText={setBarcode}
                    onFocus={() => {
                      setFocusedField('barcode');
                      scrollFieldIntoView();
                    }}
                    onBlur={() => setFocusedField(null)}
                  />
                  <Pressable
                    onPress={() => setIsBarcodeScannerOpen(true)}
                    style={[
                      styles.scanBtn,
                      { backgroundColor: theme.primaryLight },
                    ]}>
                    <Ionicons name="barcode-outline" size={18} color={theme.primary} />
                  </Pressable>
                </View>
              </View>
            </ScrollView>

            <View
              style={[
                styles.footer,
                {
                  borderTopColor: softBorder,
                  paddingBottom: safeBottomPadding,
                },
              ]}>
              <Pressable
                onPress={onClose}
                style={[styles.cancelBtn, { borderColor: softBorder }]}>
                <Text style={[styles.cancelText, { color: theme.textSecondary }]}>
                  {t('cancel')}
                </Text>
              </Pressable>
              <Pressable
                onPress={handleSubmit}
                disabled={isSubmitting || isUploadingToDrive}
                style={({ pressed }) => [
                  styles.saveBtn,
                  {
                    backgroundColor:
                      isSubmitting || isUploadingToDrive ? theme.border : theme.primary,
                  },
                  pressed && { opacity: 0.92 },
                ]}>
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                )}
                <Text style={styles.saveText}>
                  {isSubmitting
                    ? isUrdu
                      ? 'محفوظ…'
                      : 'Saving…'
                    : isUrdu
                      ? 'محفوظ کریں'
                      : 'Save'}
                </Text>
              </Pressable>
            </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <CameraModal
        visible={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(uri) => handleImageSelected(uri)}
        title={name.trim() ? `Photo: ${name.trim()}` : t('takePhoto')}
      />

      <ProductBarcodeModal
        visible={isBarcodeScannerOpen}
        onClose={() => setIsBarcodeScannerOpen(false)}
        onApplyBarcode={(code) => setBarcode(code)}
        currentBarcode={barcode}
        productIdToExclude={productToEdit?.id}
      />
    </>
  );
};

const styles = StyleSheet.create({
  kav: {
    flex: 1,
  },
  sheetWrap: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  sheet: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderCurve: 'continuous',
    borderWidth: Platform.OS === 'web' ? 1 : 0,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  scroll: {
    flexGrow: 0,
    flexShrink: 1,
  },
  handleWrap: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 2,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 14,
    gap: 12,
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  photoThumb: {
    width: 64,
    height: 64,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoImg: {
    width: '100%',
    height: '100%',
  },
  photoUploading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoActions: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  photoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  photoBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  input: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 15,
    fontWeight: '600',
  },
  twoCol: {
    flexDirection: 'row',
    gap: 10,
  },
  prefixInput: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  prefix: {
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: '800',
  },
  prefixField: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    fontWeight: '700',
    paddingRight: 10,
  },
  unitRow: {
    gap: 6,
    paddingVertical: 2,
  },
  unitPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  profitHint: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  barcodeRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  scanBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: Spacing.lg,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '700',
  },
  saveBtn: {
    flex: 1.4,
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
