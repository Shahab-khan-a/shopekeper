import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  Pressable,
  Image,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Product, ProductCategory, ProductUnit } from '@/types';
import { useShop } from '@/context/ShopContext';
import { CameraModal } from '@/components/CameraModal';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { googleDriveService } from '@/services/googleDriveService';
import { ProductImage } from '@/components/ProductImage';

interface ProductModalProps {
  visible: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

const CATEGORIES: ProductCategory[] = [
  'Kiryana',
  'Grocery',
  'Beverages',
  'Dairy',
  'Snacks',
  'Spices',
  'Personal Care',
  'Bakery',
  'Others',
];

const UNITS: ProductUnit[] = ['piece', 'kg', 'packet', 'litre', 'dozen', 'box', 'gram'];

const PRESET_IMAGES = [
  { label: 'Oil / گھی', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80' },
  { label: 'Rice / چاول', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80' },
  { label: 'Tea / چائے', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=80' },
  { label: 'Milk / دودھ', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80' },
  { label: 'Spices / مصالحہ', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80' },
  { label: 'Biscuits / بسکٹ', url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format&fit=crop&q=80' },
  { label: 'Soap / صابن', url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&auto=format&fit=crop&q=80' },
  { label: 'Sugar / چینی', url: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=400&auto=format&fit=crop&q=80' },
];

const STOCK_SHORTCUTS = [10, 25, 50, 100];

export const ProductModal: React.FC<ProductModalProps> = ({
  visible,
  onClose,
  productToEdit,
}) => {
  const { addProduct, updateProduct, settings, t, language } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const [name, setName] = useState('');
  const [nameUrdu, setNameUrdu] = useState('');
  const [price, setPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Kiryana');
  const [unit, setUnit] = useState<ProductUnit>('piece');
  const [barcode, setBarcode] = useState('');
  const [image, setImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isUploadingToDrive, setIsUploadingToDrive] = useState(false);
  const [isDriveConnected, setIsDriveConnected] = useState(false);

  useEffect(() => {
    googleDriveService.getSavedAuth().then((auth) => {
      setIsDriveConnected(!!auth);
    });
  }, [visible]);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setNameUrdu(productToEdit.nameUrdu || '');
      setPrice(productToEdit.price.toString());
      setCostPrice(productToEdit.costPrice ? productToEdit.costPrice.toString() : '');
      setStock(productToEdit.stock.toString());
      setCategory(productToEdit.category);
      setUnit(productToEdit.unit);
      setBarcode(productToEdit.barcode || '');
      setImage(productToEdit.image || '');
    } else {
      resetForm();
    }
  }, [productToEdit, visible]);

  const resetForm = () => {
    setName('');
    setNameUrdu('');
    setPrice('');
    setCostPrice('');
    setStock('');
    setCategory('Kiryana');
    setUnit('piece');
    setBarcode('');
    setImage('');
    setIsSubmitting(false);
    setIsCameraOpen(false);
    setIsUploadingToDrive(false);
  };

  // Live profit calculation
  const parsedPrice = parseFloat(price) || 0;
  const parsedCost = parseFloat(costPrice) || (parsedPrice > 0 ? Math.round(parsedPrice * 0.8) : 0);
  const unitProfit = Math.max(0, parsedPrice - parsedCost);
  const profitMarginPercent = parsedPrice > 0 ? Math.round((unitProfit / parsedPrice) * 100) : 0;

  const handleConnectDriveFromModal = async () => {
    try {
      const res = await googleDriveService.connect();
      if (res.success && res.user) {
        setIsDriveConnected(true);
        if (image && !image.includes('googleusercontent.com') && !image.includes('drive.google.com')) {
          await handleImageSelected(image);
        }
      }
    } catch (e: any) {
      console.warn('[ProductModal] Connect Drive error:', e);
    }
  };

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

    // If Google Drive is connected, upload directly to 5 TB storage
    const driveAuth = await googleDriveService.getSavedAuth();
    if (driveAuth) {
      setIsUploadingToDrive(true);
      try {
        const driveUrl = await googleDriveService.uploadProductImage(
          persistentUri,
          `product_${Date.now()}.jpg`
        );
        setImage(driveUrl);
      } catch (err: any) {
        console.error('[ProductModal] 5 TB Google Drive upload error:', err);
        const errMsg = err?.message || 'Upload to Google Drive failed.';
        if (errMsg.includes('Google Drive API has not been used') || errMsg.includes('disabled')) {
          if (Platform.OS === 'web') {
            window.open(
              'https://console.developers.google.com/apis/api/drive.googleapis.com/overview?project=65013515513',
              '_blank'
            );
            window.alert(
              'We opened the Google Cloud Console in a new tab for you!\n\n' +
              '1. Click the blue "ENABLE" button on that page.\n' +
              '2. Wait 1 minute.\n' +
              '3. Come back and retry uploading your photo.'
            );
          } else {
            Alert.alert(
              'Google Drive Setup Required',
              'Please visit:\nhttps://console.developers.google.com/apis/api/drive.googleapis.com/overview?project=65013515513\n\nand click "ENABLE".'
            );
          }
        } else {
          if (Platform.OS === 'web') {
            window.alert(`Google Drive Upload Error: ${errMsg}`);
          } else {
            Alert.alert('Google Drive Error', errMsg);
          }
        }
      } finally {
        setIsUploadingToDrive(false);
      }
    } else {
      setIsDriveConnected(false);
    }
  };

  const takePhoto = () => {
    setIsCameraOpen(true);
  };

  const pickImage = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(t('warningAlert'), 'Gallery permission is required to choose photos.');
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        await handleImageSelected(result.assets[0].uri);
      }
    } catch (e) {
      console.warn('Image picker error:', e);
    }
  };

  const generateRandomSku = () => {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    setBarcode(`8964${randomDigits}`);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      const msg = language === 'ur' ? 'براہ کرم پروڈکٹ کا نام درج کریں' : 'Please enter product name.';
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert(t('warningAlert'), msg);
      }
      return;
    }

    if (isNaN(parsedPrice) || parsedPrice < 0) {
      const msg = language === 'ur' ? 'براہ کرم درست فروخت قیمت درج کریں' : 'Please enter a valid price.';
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert(t('warningAlert'), msg);
      }
      return;
    }

    const parsedStock = parseInt(stock, 10);
    if (isNaN(parsedStock) || parsedStock < 0) {
      const msg = language === 'ur' ? 'براہ کرم درست اسٹاک تعداد درج کریں' : 'Please enter a valid stock quantity.';
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert(t('warningAlert'), msg);
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const finalCost = costPrice ? parseFloat(costPrice) : Math.round(parsedPrice * 0.85);

      if (productToEdit) {
        await updateProduct(productToEdit.id, {
          name: name.trim(),
          nameUrdu: nameUrdu.trim() || undefined,
          price: parsedPrice,
          costPrice: finalCost,
          stock: parsedStock,
          category,
          unit,
          barcode: barcode.trim() || undefined,
          image: image.trim() || undefined,
        });
      } else {
        await addProduct({
          name: name.trim(),
          nameUrdu: nameUrdu.trim() || undefined,
          price: parsedPrice,
          costPrice: finalCost,
          stock: parsedStock,
          category,
          unit,
          barcode: barcode.trim() || undefined,
          image: image.trim() || undefined,
        });
      }

      onClose();
      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.kavContainer}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              {/* Header */}
              <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
                <View style={styles.modalHeaderLeft}>
                  <View style={[styles.headerIconWrap, { backgroundColor: theme.primaryLight }]}>
                    <Ionicons name="cube" size={20} color={theme.primary} />
                  </View>
                  <View>
                    <Text style={[styles.modalTitle, { color: theme.text }]}>
                      {productToEdit ? t('editProduct') : t('addNewProduct')}
                    </Text>
                    <Text style={[styles.modalSubtitle, { color: theme.textMuted }]}>
                      {productToEdit ? 'Update product details & inventory' : 'Add item to store catalog'}
                    </Text>
                  </View>
                </View>

                <View style={styles.modalHeaderRight}>
                  <Pressable
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                    style={({ pressed }) => [
                      styles.headerSaveBtn,
                      { backgroundColor: theme.primary },
                      pressed && { opacity: 0.85 },
                    ]}>
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    <Text style={styles.headerSaveText}>
                      {isSubmitting ? '...' : t('saveProduct')}
                    </Text>
                  </Pressable>

                  <Pressable onPress={onClose} style={[styles.closeBtn, { backgroundColor: theme.surfaceSubtle }]}>
                    <Ionicons name="close" size={20} color={theme.textSecondary} />
                  </Pressable>
                </View>
              </View>

              <ScrollView
                style={styles.scrollArea}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
                {/* ── Photo Section ── */}
                <View style={[styles.formSectionCard, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                      {language === 'ur' ? 'پروڈکٹ کی تصویر' : 'Product Photo'}
                    </Text>
                    {isDriveConnected ? (
                      <View style={styles.driveStatusPill}>
                        <Ionicons name="cloud-done" size={12} color="#10B981" />
                        <Text style={styles.driveStatusPillText}>Drive Active</Text>
                      </View>
                    ) : (
                      <Pressable
                        onPress={handleConnectDriveFromModal}
                        style={({ pressed }) => [
                          styles.driveConnectWarningBtn,
                          pressed && { opacity: 0.8 },
                        ]}>
                        <Ionicons name="cloud-offline-outline" size={12} color="#B45309" />
                        <Text style={styles.driveConnectWarningText}>
                          {language === 'ur' ? 'ڈرائیو منسلک کریں ↗' : 'Connect Drive ↗'}
                        </Text>
                      </Pressable>
                    )}
                  </View>

                  {image ? (
                    <View style={styles.imagePreviewWrap}>
                      <ProductImage uri={image} style={styles.previewImage} resizeMode="cover" />

                      {/* Loading overlay during Google Drive upload */}
                      {isUploadingToDrive && (
                        <View style={styles.driveUploadingOverlay}>
                          <ActivityIndicator size="small" color="#FFFFFF" />
                          <Text style={styles.driveUploadingText}>
                            {t('uploadingImageToDrive')}
                          </Text>
                        </View>
                      )}

                      {/* Drive Cloud badge if saved in Google Drive */}
                      {(image.includes('googleusercontent.com') || image.includes('drive.google.com')) && !isUploadingToDrive && (
                        <View style={styles.driveSavedBadge}>
                          <Ionicons name="cloud-done" size={12} color="#FFFFFF" />
                          <Text style={styles.driveSavedBadgeText}>Google Drive</Text>
                        </View>
                      )}

                      <View style={styles.imageOverlayRow}>
                        <Pressable
                          onPress={takePhoto}
                          disabled={isUploadingToDrive}
                          style={[styles.overlayActionBtn, { backgroundColor: theme.primary }]}>
                          <Ionicons name="camera" size={14} color="#FFFFFF" />
                          <Text style={styles.overlayActionText}>{t('takePhoto')}</Text>
                        </Pressable>
                        <Pressable
                          onPress={pickImage}
                          disabled={isUploadingToDrive}
                          style={[styles.overlayActionBtn, { backgroundColor: theme.surface }]}>
                          <Ionicons name="images-outline" size={14} color={theme.text} />
                          <Text style={[styles.overlayActionText, { color: theme.text }]}>{t('chooseGallery')}</Text>
                        </Pressable>
                        <Pressable
                          onPress={() => setImage('')}
                          disabled={isUploadingToDrive}
                          style={[styles.overlayActionBtn, { backgroundColor: theme.danger }]}>
                          <Ionicons name="trash-outline" size={14} color="#FFFFFF" />
                        </Pressable>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.photoChoiceGrid}>
                      <Pressable
                        onPress={takePhoto}
                        style={({ pressed }) => [
                          styles.photoPickCard,
                          { backgroundColor: theme.primaryLight, borderColor: theme.primary },
                          pressed && { opacity: 0.8 },
                        ]}>
                        <Ionicons name="camera" size={24} color={theme.primary} />
                        <Text style={[styles.photoPickTitle, { color: theme.primaryDark }]}>
                          {t('takePhoto')}
                        </Text>
                        <Text style={[styles.photoPickSub, { color: theme.primary }]}>
                          Live camera snap
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={pickImage}
                        style={({ pressed }) => [
                          styles.photoPickCard,
                          { backgroundColor: theme.card, borderColor: theme.border },
                          pressed && { opacity: 0.8 },
                        ]}>
                        <Ionicons name="images-outline" size={24} color={theme.textSecondary} />
                        <Text style={[styles.photoPickTitle, { color: theme.text }]}>
                          {t('chooseGallery')}
                        </Text>
                        <Text style={[styles.photoPickSub, { color: theme.textMuted }]}>
                          Select from phone
                        </Text>
                      </Pressable>
                    </View>
                  )}

                  {/* Quick Preset Photos */}
                  <View style={{ marginTop: 8 }}>
                    <Text style={[styles.presetHeader, { color: theme.textMuted }]}>
                      {language === 'ur' ? 'یا فوری سیمپل تصویر منتخب کریں:' : 'Or tap a preset image:'}
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
                      {PRESET_IMAGES.map((preset, idx) => (
                        <Pressable
                          key={idx}
                          onPress={() => setImage(preset.url)}
                          style={[
                            styles.presetChip,
                            {
                              backgroundColor: image === preset.url ? theme.primaryLight : theme.card,
                              borderColor: image === preset.url ? theme.primary : theme.border,
                            },
                          ]}>
                          <Image source={{ uri: preset.url }} style={styles.presetThumbImg} />
                          <Text
                            style={[
                              styles.presetChipText,
                              { color: image === preset.url ? theme.primaryDark : theme.textSecondary },
                            ]}>
                            {preset.label}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                </View>

                {/* ── Section 1: Basic Info ── */}
                <View style={[styles.formSectionCard, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
                  <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                    {language === 'ur' ? 'بنیادی تفصیلات' : '1. Basic Information'}
                  </Text>

                  {/* Name (English) */}
                  <View style={styles.inputWrap}>
                    <Text style={[styles.inputLabel, { color: theme.text }]}>{t('productName')} *</Text>
                    <TextInput
                      style={[styles.inputBox, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
                      placeholder="e.g. Super Basmati Rice 1kg"
                      placeholderTextColor={theme.textMuted}
                      value={name}
                      onChangeText={setName}
                    />
                  </View>

                  {/* Name (Urdu) */}
                  <View style={styles.inputWrap}>
                    <Text style={[styles.inputLabel, { color: theme.text }]}>{t('productNameUrdu')}</Text>
                    <TextInput
                      style={[styles.inputBox, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
                      placeholder="مثلاً: باسمتی چاول 1 کلو"
                      placeholderTextColor={theme.textMuted}
                      value={nameUrdu}
                      onChangeText={setNameUrdu}
                    />
                  </View>

                  {/* Category Pills */}
                  <View style={styles.inputWrap}>
                    <Text style={[styles.inputLabel, { color: theme.text }]}>{t('category')}</Text>
                    <View style={styles.chipsWrap}>
                      {CATEGORIES.map((cat) => (
                        <Pressable
                          key={cat}
                          onPress={() => setCategory(cat)}
                          style={[
                            styles.chipBtn,
                            {
                              backgroundColor: category === cat ? theme.primary : theme.card,
                              borderColor: category === cat ? theme.primary : theme.border,
                            },
                          ]}>
                          <Text
                            style={[
                              styles.chipBtnText,
                              { color: category === cat ? '#FFFFFF' : theme.textSecondary },
                            ]}>
                            {cat}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  {/* Unit Selector */}
                  <View style={styles.inputWrap}>
                    <Text style={[styles.inputLabel, { color: theme.text }]}>{t('unit')}</Text>
                    <View style={styles.chipsWrap}>
                      {UNITS.map((u) => (
                        <Pressable
                          key={u}
                          onPress={() => setUnit(u)}
                          style={[
                            styles.chipBtn,
                            {
                              backgroundColor: unit === u ? theme.primary : theme.card,
                              borderColor: unit === u ? theme.primary : theme.border,
                            },
                          ]}>
                          <Text
                            style={[
                              styles.chipBtnText,
                              { color: unit === u ? '#FFFFFF' : theme.textSecondary },
                            ]}>
                            {u}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                </View>

                {/* ── Section 2: Pricing & Profit Calculator ── */}
                <View style={[styles.formSectionCard, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
                  <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                    {language === 'ur' ? 'قیمت اور منافع' : '2. Pricing & Profit Margin'}
                  </Text>

                  <View style={styles.rowInputs}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.inputLabel, { color: theme.text }]}>
                        {t('price')} ({settings.currencySymbol}) *
                      </Text>
                      <TextInput
                        style={[
                          styles.inputBox,
                          styles.priceInputBold,
                          { backgroundColor: theme.card, color: theme.primary, borderColor: theme.border },
                        ]}
                        placeholder="350"
                        placeholderTextColor={theme.textMuted}
                        keyboardType="numeric"
                        value={price}
                        onChangeText={setPrice}
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={[styles.inputLabel, { color: theme.text }]}>
                        {t('cost')} ({settings.currencySymbol})
                      </Text>
                      <TextInput
                        style={[styles.inputBox, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
                        placeholder="280"
                        placeholderTextColor={theme.textMuted}
                        keyboardType="numeric"
                        value={costPrice}
                        onChangeText={setCostPrice}
                      />
                    </View>
                  </View>

                  {/* Live Profit Banner */}
                  {parsedPrice > 0 ? (
                    <View style={[styles.profitBanner, { backgroundColor: theme.successLight, borderColor: theme.success }]}>
                      <Ionicons name="trending-up" size={20} color={theme.success} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.profitBannerTitle, { color: theme.success }]}>
                          Estimated Profit: {settings.currencySymbol}{unitProfit} / {unit} ({profitMarginPercent}% Margin)
                        </Text>
                        <Text style={[styles.profitBannerSub, { color: theme.textSecondary }]}>
                          Based on selling for {settings.currencySymbol}{parsedPrice} and cost of {settings.currencySymbol}{parsedCost}
                        </Text>
                      </View>
                    </View>
                  ) : null}
                </View>

                {/* ── Section 3: Stock & Barcode ── */}
                <View style={[styles.formSectionCard, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
                  <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                    {language === 'ur' ? 'اسٹاک اور بارکوڈ' : '3. Inventory & Barcode'}
                  </Text>

                  {/* Stock Input & Shortcuts */}
                  <View style={styles.inputWrap}>
                    <Text style={[styles.inputLabel, { color: theme.text }]}>{t('stock')} *</Text>
                    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                      <TextInput
                        style={[
                          styles.inputBox,
                          { flex: 1, backgroundColor: theme.card, color: theme.text, borderColor: theme.border },
                        ]}
                        placeholder="25"
                        placeholderTextColor={theme.textMuted}
                        keyboardType="numeric"
                        value={stock}
                        onChangeText={setStock}
                      />
                      {/* Stock shortcuts */}
                      <View style={{ flexDirection: 'row', gap: 4 }}>
                        {STOCK_SHORTCUTS.map((amt) => (
                          <Pressable
                            key={amt}
                            onPress={() => setStock(amt.toString())}
                            style={[
                              styles.shortcutPill,
                              { backgroundColor: theme.card, borderColor: theme.border },
                            ]}>
                            <Text style={[styles.shortcutPillText, { color: theme.textSecondary }]}>
                              {amt}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    </View>
                  </View>

                  {/* Barcode & Auto SKU */}
                  <View style={styles.inputWrap}>
                    <Text style={[styles.inputLabel, { color: theme.text }]}>{t('barcodeOrSku')}</Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <TextInput
                        style={[
                          styles.inputBox,
                          { flex: 1, backgroundColor: theme.card, color: theme.text, borderColor: theme.border },
                        ]}
                        placeholder="8964000..."
                        placeholderTextColor={theme.textMuted}
                        value={barcode}
                        onChangeText={setBarcode}
                      />
                      <Pressable
                        onPress={generateRandomSku}
                        style={({ pressed }) => [
                          styles.autoSkuBtn,
                          { backgroundColor: theme.primaryLight, borderColor: theme.primary },
                          pressed && { opacity: 0.8 },
                        ]}>
                        <Ionicons name="sparkles" size={14} color={theme.primary} />
                        <Text style={[styles.autoSkuText, { color: theme.primaryDark }]}>Auto SKU</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </ScrollView>

              {/* Action Footer */}
              <View style={[styles.modalFooter, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
                <Pressable
                  onPress={onClose}
                  style={[styles.footerCancelBtn, { borderColor: theme.border }]}>
                  <Text style={[styles.footerCancelText, { color: theme.textSecondary }]}>
                    {t('cancel')}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleSubmit}
                  disabled={isSubmitting || isUploadingToDrive}
                  style={({ pressed }) => [
                    styles.footerSaveBtn,
                    { backgroundColor: (isSubmitting || isUploadingToDrive) ? theme.border : theme.primary },
                    pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
                  ]}>
                  {isUploadingToDrive ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                  )}
                  <Text style={styles.footerSaveText}>
                    {isUploadingToDrive
                      ? (language === 'ur' ? 'ڈرائیو پر اپلوڈ ہو رہا ہے...' : 'Uploading Image...')
                      : isSubmitting
                      ? (language === 'ur' ? 'محفوظ ہو رہا ہے...' : 'Saving...')
                      : t('saveProduct')}
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
    </>
  );
};

const styles = StyleSheet.create({
  kavContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.sm,
  },
  modalCard: {
    width: '100%',
    maxWidth: 580,
    height: '92%',
    maxHeight: 780,
    borderRadius: BorderRadius.xxl,
    overflow: 'hidden',
    borderWidth: 1,
    ...Shadows.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  headerIconWrap: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  modalSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  modalHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerSaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
  },
  headerSaveText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    gap: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  formSectionCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  photoChoiceGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  photoPickCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  photoPickTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  photoPickSub: {
    fontSize: 10,
  },
  imagePreviewWrap: {
    height: 170,
    width: '100%',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlayRow: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    gap: 6,
  },
  overlayActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  overlayActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  presetHeader: {
    fontSize: 11,
    marginBottom: 4,
  },
  presetScroll: {
    maxHeight: 38,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    marginRight: 6,
  },
  presetThumbImg: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  presetChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  inputWrap: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  inputBox: {
    height: 44,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.md,
    fontSize: 14,
    fontWeight: '500',
  },
  priceInputBold: {
    fontSize: 17,
    fontWeight: '800',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  chipBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  profitBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  profitBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  profitBannerSub: {
    fontSize: 11,
    marginTop: 1,
  },
  shortcutPill: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  shortcutPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  autoSkuBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    justifyContent: 'center',
  },
  autoSkuText: {
    fontSize: 12,
    fontWeight: '700',
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    gap: Spacing.md,
  },
  footerCancelBtn: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
  },
  footerCancelText: {
    fontSize: 14,
    fontWeight: '700',
  },
  footerSaveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },
  footerSaveText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  driveStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  driveStatusPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803D',
  },
  driveConnectWarningBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  driveConnectWarningText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  driveUploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    zIndex: 10,
  },
  driveUploadingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  driveSavedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    zIndex: 5,
  },
  driveSavedBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
