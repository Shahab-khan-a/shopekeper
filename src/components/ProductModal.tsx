import React, { useState, useEffect, useMemo } from 'react';
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

export interface CategoryOption {
  key: ProductCategory;
  labelEn: string;
  labelUrdu: string;
  icon: keyof typeof Ionicons.glyphMap;
  subtitle: string;
}

export const CATEGORY_OPTIONS: CategoryOption[] = [
  { key: 'Kiryana', labelEn: 'Kiryana', labelUrdu: 'کریانہ', icon: 'storefront-outline', subtitle: 'General Store' },
  { key: 'Grocery', labelEn: 'Grocery', labelUrdu: 'گروسری', icon: 'cart-outline', subtitle: 'Pulses, Flour, Oil' },
  { key: 'Beverages', labelEn: 'Beverages', labelUrdu: 'مشروبات', icon: 'wine-outline', subtitle: 'Cold Drinks, Juices, Tea' },
  { key: 'Dairy', labelEn: 'Dairy', labelUrdu: 'دودھ و دہی', icon: 'nutrition-outline', subtitle: 'Milk, Yogurt, Butter, Eggs' },
  { key: 'Snacks', labelEn: 'Snacks', labelUrdu: 'اسنیکس و بسکٹ', icon: 'pizza-outline', subtitle: 'Chips, Biscuits, Nimko' },
  { key: 'Spices', labelEn: 'Spices', labelUrdu: 'مصالحہ جات', icon: 'flame-outline', subtitle: 'Spices, Salt, Masalas' },
  { key: 'Personal Care', labelEn: 'Personal Care', labelUrdu: 'صابن و سرف', icon: 'sparkles-outline', subtitle: 'Soaps, Shampoos, Detergent' },
  { key: 'Bakery', labelEn: 'Bakery', labelUrdu: 'بیکری', icon: 'cafe-outline', subtitle: 'Bread, Rusk, Cakes' },
  { key: 'Others', labelEn: 'Others', labelUrdu: 'دیگر', icon: 'grid-outline', subtitle: 'General & Miscellaneous' },
];

export interface UnitOption {
  key: ProductUnit;
  labelEn: string;
  labelUrdu: string;
  icon: keyof typeof Ionicons.glyphMap;
  shortCode: string;
}

export const UNIT_OPTIONS: UnitOption[] = [
  { key: 'piece', labelEn: 'Piece', labelUrdu: 'پیس / عدد', icon: 'cube-outline', shortCode: 'pc' },
  { key: 'kg', labelEn: 'Kilogram', labelUrdu: 'کلوگرام', icon: 'scale-outline', shortCode: 'kg' },
  { key: 'packet', labelEn: 'Packet', labelUrdu: 'پیکٹ', icon: 'bag-handle-outline', shortCode: 'pkt' },
  { key: 'litre', labelEn: 'Litre', labelUrdu: 'لیٹر', icon: 'water-outline', shortCode: 'L' },
  { key: 'dozen', labelEn: 'Dozen', labelUrdu: 'درجن (12)', icon: 'apps-outline', shortCode: 'dz' },
  { key: 'box', labelEn: 'Box / Carton', labelUrdu: 'ڈبہ / کاٹن', icon: 'archive-outline', shortCode: 'box' },
  { key: 'gram', labelEn: 'Gram', labelUrdu: 'گرام', icon: 'speedometer-outline', shortCode: 'g' },
];

const CATEGORIES: ProductCategory[] = CATEGORY_OPTIONS.map((c) => c.key);
const UNITS: ProductUnit[] = UNIT_OPTIONS.map((u) => u.key);

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
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isUnitOpen, setIsUnitOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [unitSearch, setUnitSearch] = useState('');
  const [barcode, setBarcode] = useState('');
  const [image, setImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isUploadingToDrive, setIsUploadingToDrive] = useState(false);
  const [isDriveConnected, setIsDriveConnected] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const softBorder = settings.darkMode ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0';
  const sectionBg = settings.darkMode ? '#161F30' : '#F8FAFC';
  const sectionBorder = settings.darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)';
  const inputBg = settings.darkMode ? '#1E293B' : '#FFFFFF';

  useEffect(() => {
    googleDriveService.getSavedAuth().then((auth) => {
      setIsDriveConnected(!!auth);
    });
  }, [visible]);

  useEffect(() => {
    setIsCategoryOpen(false);
    setIsUnitOpen(false);
    setCategorySearch('');
    setUnitSearch('');
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
    setIsCategoryOpen(false);
    setIsUnitOpen(false);
    setCategorySearch('');
    setUnitSearch('');
    setBarcode('');
    setImage('');
    setIsSubmitting(false);
    setIsCameraOpen(false);
    setIsUploadingToDrive(false);
  };

  const activeCategoryMeta =
    CATEGORY_OPTIONS.find((c) => c.key === category) || CATEGORY_OPTIONS[0];
  const activeUnitMeta =
    UNIT_OPTIONS.find((u) => u.key === unit) || UNIT_OPTIONS[0];

  const filteredCategoryOptions = useMemo(() => {
    const q = categorySearch.trim().toLowerCase();
    if (!q) return CATEGORY_OPTIONS;
    return CATEGORY_OPTIONS.filter((c) => {
      const matchEn = c.labelEn.toLowerCase().includes(q);
      const matchUr = (c.labelUrdu || '').toLowerCase().includes(q);
      const matchSub = (c.subtitle || '').toLowerCase().includes(q);
      return matchEn || matchUr || matchSub;
    });
  }, [categorySearch]);

  const filteredUnitOptions = useMemo(() => {
    const q = unitSearch.trim().toLowerCase();
    if (!q) return UNIT_OPTIONS;
    return UNIT_OPTIONS.filter((u) => {
      const matchEn = u.labelEn.toLowerCase().includes(q);
      const matchUr = (u.labelUrdu || '').toLowerCase().includes(q);
      const matchCode = (u.shortCode || '').toLowerCase().includes(q);
      return matchEn || matchUr || matchCode;
    });
  }, [unitSearch]);

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

    // If Google Drive is connected, upload directly to Drive storage
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
        console.error('[ProductModal] Google Drive upload error:', err);
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
            <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: sectionBorder }]}>
              {/* Sheet Drag Handle for Mobile */}
              {Platform.OS !== 'web' && (
                <View style={styles.sheetHandleWrap}>
                  <View style={[styles.sheetHandle, { backgroundColor: settings.darkMode ? '#334155' : '#CBD5E1' }]} />
                </View>
              )}

              {/* Header */}
              <View style={[styles.modalHeader, { borderBottomColor: softBorder }]}>
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
                <View style={[styles.formSectionCard, { backgroundColor: sectionBg, borderColor: sectionBorder }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={styles.sectionTitleRow}>
                      <View style={[styles.sectionTitleIndicator, { backgroundColor: theme.primary }]} />
                      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                        {language === 'ur' ? 'پروڈکٹ کی تصویر' : 'Product Photo'}
                      </Text>
                    </View>
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
                          <Text style={styles.overlayActionText} numberOfLines={1}>{t('takePhoto')}</Text>
                        </Pressable>
                        <Pressable
                          onPress={pickImage}
                          disabled={isUploadingToDrive}
                          style={[styles.overlayActionBtn, { backgroundColor: theme.surface }]}>
                          <Ionicons name="images-outline" size={14} color={theme.text} />
                          <Text style={[styles.overlayActionText, { color: theme.text }]} numberOfLines={1}>{t('chooseGallery')}</Text>
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
                          {
                            backgroundColor: settings.darkMode ? 'rgba(99, 102, 241, 0.12)' : '#EEF2FF',
                            borderColor: settings.darkMode ? 'rgba(99, 102, 241, 0.3)' : '#C7D2FE',
                          },
                          pressed && { opacity: 0.8 },
                        ]}>
                        <Ionicons name="camera" size={24} color={theme.primary} />
                        <Text style={[styles.photoPickTitle, { color: theme.primary }]}>
                          {t('takePhoto')}
                        </Text>
                        <Text style={[styles.photoPickSub, { color: theme.primary + 'B0' }]}>
                          Live camera snap
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={pickImage}
                        style={({ pressed }) => [
                          styles.photoPickCard,
                          {
                            backgroundColor: inputBg,
                            borderColor: softBorder,
                          },
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
                              backgroundColor: image === preset.url ? theme.primaryLight : inputBg,
                              borderColor: image === preset.url ? theme.primary : softBorder,
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
                <View style={[styles.formSectionCard, { backgroundColor: sectionBg, borderColor: sectionBorder }]}>
                  <View style={styles.sectionTitleRow}>
                    <View style={[styles.sectionTitleIndicator, { backgroundColor: theme.primary }]} />
                    <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                      {language === 'ur' ? 'بنیادی تفصیلات' : '1. Basic Information'}
                    </Text>
                  </View>

                  {/* Name (English) */}
                  <View style={styles.inputWrap}>
                    <Text style={[styles.inputLabel, { color: theme.text }]}>{t('productName')} *</Text>
                    <TextInput
                      style={[
                        styles.inputBox,
                        {
                          backgroundColor: inputBg,
                          color: theme.text,
                          borderColor: focusedField === 'name' ? theme.primary : softBorder,
                        },
                      ]}
                      placeholder="e.g. Super Basmati Rice 1kg"
                      placeholderTextColor={theme.textMuted}
                      value={name}
                      onChangeText={setName}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </View>

                  {/* Name (Urdu) */}
                  <View style={styles.inputWrap}>
                    <Text style={[styles.inputLabel, { color: theme.text }]}>{t('productNameUrdu')}</Text>
                    <TextInput
                      style={[
                        styles.inputBox,
                        {
                          backgroundColor: inputBg,
                          color: theme.text,
                          borderColor: focusedField === 'nameUrdu' ? theme.primary : softBorder,
                        },
                      ]}
                      placeholder="مثلاً: باسمتی چاول 1 کلو"
                      placeholderTextColor={theme.textMuted}
                      value={nameUrdu}
                      onChangeText={setNameUrdu}
                      onFocus={() => setFocusedField('nameUrdu')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </View>

                  {/* Category Dropdown */}
                  <View style={styles.inputWrap}>
                    <View style={styles.fieldLabelRow}>
                      <Text style={[styles.inputLabel, { color: theme.text }]}>
                        {t('category')} *
                      </Text>
                      <Text style={[styles.fieldHintUrdu, { color: theme.textMuted }]}>
                        {language === 'ur' ? 'کیٹیگری منتخب کریں' : activeCategoryMeta.labelUrdu}
                      </Text>
                    </View>

                    <Pressable
                      onPress={() => {
                        setIsCategoryOpen((prev) => !prev);
                        setIsUnitOpen(false);
                      }}
                      style={({ pressed }) => [
                        styles.dropdownTrigger,
                        {
                          backgroundColor: inputBg,
                          borderColor: isCategoryOpen ? theme.primary : softBorder,
                        },
                        pressed && { opacity: 0.85 },
                      ]}>
                      <View style={styles.dropdownTriggerLeft}>
                        <View style={[styles.dropdownIconWrap, { backgroundColor: theme.primaryLight }]}>
                          <Ionicons name={activeCategoryMeta.icon} size={18} color={theme.primary} />
                        </View>
                        <View style={styles.dropdownValueCol}>
                          <Text style={[styles.dropdownValuePrimary, { color: theme.text }]}>
                            {language === 'ur' ? activeCategoryMeta.labelUrdu : activeCategoryMeta.labelEn}
                          </Text>
                          <Text style={[styles.dropdownValueSecondary, { color: theme.textMuted }]}>
                            {language === 'ur'
                              ? `${activeCategoryMeta.labelEn} • ${activeCategoryMeta.subtitle}`
                              : `${activeCategoryMeta.labelUrdu} • ${activeCategoryMeta.subtitle}`}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.dropdownTriggerRight}>
                        <View style={[styles.dropdownBadge, { backgroundColor: theme.primaryLight }]}>
                          <Text style={[styles.dropdownBadgeText, { color: theme.primary }]}>
                            {activeCategoryMeta.labelEn}
                          </Text>
                        </View>
                        <Ionicons
                          name={isCategoryOpen ? 'chevron-up' : 'chevron-down'}
                          size={18}
                          color={isCategoryOpen ? theme.primary : theme.textSecondary}
                        />
                      </View>
                    </Pressable>

                    {isCategoryOpen && (
                      <View style={[styles.dropdownMenu, { backgroundColor: inputBg, borderColor: softBorder }]}>
                        <View style={[styles.dropdownMenuHeader, { borderBottomColor: softBorder }]}>
                          <Text style={[styles.dropdownMenuHeaderTitle, { color: theme.textSecondary }]}>
                            {language === 'ur' ? 'کیٹیگری منتخب کریں' : 'SELECT CATEGORY'}
                          </Text>
                          {categorySearch.length > 0 && (
                            <Text style={{ fontSize: 10, color: theme.primary, fontWeight: '700' }}>
                              {filteredCategoryOptions.length} {language === 'ur' ? 'نتائج' : 'found'}
                            </Text>
                          )}
                        </View>

                        {/* Search Input for Category */}
                        <View style={[styles.dropdownSearchWrap, { backgroundColor: sectionBg, borderColor: softBorder }]}>
                          <Ionicons name="search" size={17} color={theme.textMuted} />
                          <TextInput
                            style={[styles.dropdownSearchInput, { color: theme.text }]}
                            placeholder={language === 'ur' ? 'کیٹیگری تلاش کریں...' : 'Search category...'}
                            placeholderTextColor={theme.textMuted}
                            value={categorySearch}
                            onChangeText={setCategorySearch}
                          />
                          {categorySearch.length > 0 && (
                            <Pressable onPress={() => setCategorySearch('')} hitSlop={10}>
                              <Ionicons name="close-circle" size={18} color={theme.textMuted} />
                            </Pressable>
                          )}
                        </View>

                        <ScrollView
                          style={styles.dropdownList}
                          contentContainerStyle={styles.dropdownListContent}
                          nestedScrollEnabled
                          keyboardShouldPersistTaps="handled"
                          showsVerticalScrollIndicator>
                          {filteredCategoryOptions.length > 0 ? (
                            filteredCategoryOptions.map((opt) => {
                              const isSelected = category === opt.key;
                              return (
                                <Pressable
                                  key={opt.key}
                                  onPress={() => {
                                    setCategory(opt.key);
                                    setIsCategoryOpen(false);
                                    setCategorySearch('');
                                  }}
                                  style={({ pressed }) => [
                                    styles.dropdownItem,
                                    isSelected && { backgroundColor: theme.primaryLight },
                                    pressed && { opacity: 0.75 },
                                  ]}>
                                  <View
                                    style={[
                                      styles.dropdownItemIconWrap,
                                      { backgroundColor: isSelected ? theme.primary : theme.surfaceSubtle },
                                    ]}>
                                    <Ionicons
                                      name={opt.icon}
                                      size={16}
                                      color={isSelected ? '#FFFFFF' : theme.textSecondary}
                                    />
                                  </View>

                                  <View style={styles.dropdownItemTextCol}>
                                    <Text
                                      style={[
                                        styles.dropdownItemTitle,
                                        {
                                          color: isSelected ? theme.primary : theme.text,
                                          fontWeight: isSelected ? '700' : '600',
                                        },
                                      ]}>
                                      {opt.labelEn}
                                    </Text>
                                    <Text style={[styles.dropdownItemSub, { color: theme.textMuted }]}>
                                      {opt.subtitle}
                                    </Text>
                                  </View>

                                  <Text
                                    style={[
                                      styles.dropdownItemUrdu,
                                      { color: isSelected ? theme.primary : theme.textMuted },
                                    ]}>
                                    {opt.labelUrdu}
                                  </Text>

                                  {isSelected && (
                                    <Ionicons
                                      name="checkmark-circle"
                                      size={17}
                                      color={theme.primary}
                                      style={{ marginLeft: 4 }}
                                    />
                                  )}
                                </Pressable>
                              );
                            })
                          ) : (
                            <View style={styles.dropdownEmptyState}>
                              <Ionicons name="search-outline" size={18} color={theme.textMuted} />
                              <Text style={[styles.dropdownEmptyText, { color: theme.textMuted }]}>
                                {language === 'ur' ? 'کوئی کیٹیگری نہیں ملی' : 'No matching category found'}
                              </Text>
                            </View>
                          )}
                        </ScrollView>
                      </View>
                    )}
                  </View>

                  {/* Unit Dropdown */}
                  <View style={styles.inputWrap}>
                    <View style={styles.fieldLabelRow}>
                      <Text style={[styles.inputLabel, { color: theme.text }]}>
                        {t('unit')} *
                      </Text>
                      <Text style={[styles.fieldHintUrdu, { color: theme.textMuted }]}>
                        {language === 'ur' ? 'اکائی / پیمائش' : activeUnitMeta.labelUrdu}
                      </Text>
                    </View>

                    <Pressable
                      onPress={() => {
                        setIsUnitOpen((prev) => !prev);
                        setIsCategoryOpen(false);
                      }}
                      style={({ pressed }) => [
                        styles.dropdownTrigger,
                        {
                          backgroundColor: inputBg,
                          borderColor: isUnitOpen ? theme.primary : softBorder,
                        },
                        pressed && { opacity: 0.85 },
                      ]}>
                      <View style={styles.dropdownTriggerLeft}>
                        <View style={[styles.dropdownIconWrap, { backgroundColor: theme.primaryLight }]}>
                          <Ionicons name={activeUnitMeta.icon} size={18} color={theme.primary} />
                        </View>
                        <View style={styles.dropdownValueCol}>
                          <Text style={[styles.dropdownValuePrimary, { color: theme.text }]}>
                            {activeUnitMeta.labelEn} ({activeUnitMeta.shortCode})
                          </Text>
                          <Text style={[styles.dropdownValueSecondary, { color: theme.textMuted }]}>
                            {activeUnitMeta.labelUrdu}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.dropdownTriggerRight}>
                        <View style={[styles.dropdownBadge, { backgroundColor: theme.primaryLight }]}>
                          <Text style={[styles.dropdownBadgeText, { color: theme.primary }]}>
                            {activeUnitMeta.shortCode}
                          </Text>
                        </View>
                        <Ionicons
                          name={isUnitOpen ? 'chevron-up' : 'chevron-down'}
                          size={18}
                          color={isUnitOpen ? theme.primary : theme.textSecondary}
                        />
                      </View>
                    </Pressable>

                    {isUnitOpen && (
                      <View style={[styles.dropdownMenu, { backgroundColor: inputBg, borderColor: softBorder }]}>
                        <View style={[styles.dropdownMenuHeader, { borderBottomColor: softBorder }]}>
                          <Text style={[styles.dropdownMenuHeaderTitle, { color: theme.textSecondary }]}>
                            {language === 'ur' ? 'اکائی منتخب کریں' : 'SELECT MEASUREMENT UNIT'}
                          </Text>
                          {unitSearch.length > 0 && (
                            <Text style={{ fontSize: 10, color: theme.primary, fontWeight: '700' }}>
                              {filteredUnitOptions.length} {language === 'ur' ? 'نتائج' : 'found'}
                            </Text>
                          )}
                        </View>

                        {/* Search Input for Unit */}
                        <View style={[styles.dropdownSearchWrap, { backgroundColor: sectionBg, borderColor: softBorder }]}>
                          <Ionicons name="search" size={17} color={theme.textMuted} />
                          <TextInput
                            style={[styles.dropdownSearchInput, { color: theme.text }]}
                            placeholder={language === 'ur' ? 'اکائی تلاش کریں (kg, piece, L وغیرہ)...' : 'Search unit (kg, piece, L, etc.)...'}
                            placeholderTextColor={theme.textMuted}
                            value={unitSearch}
                            onChangeText={setUnitSearch}
                          />
                          {unitSearch.length > 0 && (
                            <Pressable onPress={() => setUnitSearch('')} hitSlop={10}>
                              <Ionicons name="close-circle" size={18} color={theme.textMuted} />
                            </Pressable>
                          )}
                        </View>

                        <ScrollView
                          style={styles.dropdownList}
                          contentContainerStyle={styles.dropdownListContent}
                          nestedScrollEnabled
                          keyboardShouldPersistTaps="handled"
                          showsVerticalScrollIndicator>
                          {filteredUnitOptions.length > 0 ? (
                            filteredUnitOptions.map((opt) => {
                              const isSelected = unit === opt.key;
                              return (
                                <Pressable
                                  key={opt.key}
                                  onPress={() => {
                                    setUnit(opt.key);
                                    setIsUnitOpen(false);
                                    setUnitSearch('');
                                  }}
                                  style={({ pressed }) => [
                                    styles.dropdownItem,
                                    isSelected && { backgroundColor: theme.primaryLight },
                                    pressed && { opacity: 0.75 },
                                  ]}>
                                  <View
                                    style={[
                                      styles.dropdownItemIconWrap,
                                      { backgroundColor: isSelected ? theme.primary : theme.surfaceSubtle },
                                    ]}>
                                    <Ionicons
                                      name={opt.icon}
                                      size={16}
                                      color={isSelected ? '#FFFFFF' : theme.textSecondary}
                                    />
                                  </View>

                                  <View style={styles.dropdownItemTextCol}>
                                    <Text
                                      style={[
                                        styles.dropdownItemTitle,
                                        {
                                          color: isSelected ? theme.primary : theme.text,
                                          fontWeight: isSelected ? '700' : '600',
                                        },
                                      ]}>
                                      {opt.labelEn}
                                    </Text>
                                    <Text style={[styles.dropdownItemSub, { color: theme.textMuted }]}>
                                      Short: {opt.shortCode}
                                    </Text>
                                  </View>

                                  <Text
                                    style={[
                                      styles.dropdownItemUrdu,
                                      { color: isSelected ? theme.primary : theme.textMuted },
                                    ]}>
                                    {opt.labelUrdu}
                                  </Text>

                                  {isSelected && (
                                    <Ionicons
                                      name="checkmark-circle"
                                      size={17}
                                      color={theme.primary}
                                      style={{ marginLeft: 4 }}
                                    />
                                  )}
                                </Pressable>
                              );
                            })
                          ) : (
                            <View style={styles.dropdownEmptyState}>
                              <Ionicons name="search-outline" size={18} color={theme.textMuted} />
                              <Text style={[styles.dropdownEmptyText, { color: theme.textMuted }]}>
                                {language === 'ur' ? 'کوئی اکائی نہیں ملی' : 'No matching unit found'}
                              </Text>
                            </View>
                          )}
                        </ScrollView>
                      </View>
                    )}
                  </View>
                </View>

                {/* ── Section 2: Pricing & Profit Calculator ── */}
                <View style={[styles.formSectionCard, { backgroundColor: sectionBg, borderColor: sectionBorder }]}>
                  <View style={styles.sectionTitleRow}>
                    <View style={[styles.sectionTitleIndicator, { backgroundColor: theme.primary }]} />
                    <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                      {language === 'ur' ? 'قیمت اور منافع' : '2. Pricing & Profit Margin'}
                    </Text>
                  </View>

                  <View style={styles.rowInputs}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.inputLabel, { color: theme.text }]}>
                        {t('price')} ({settings.currencySymbol}) *
                      </Text>
                      <TextInput
                        style={[
                          styles.inputBox,
                          styles.priceInputBold,
                          {
                            backgroundColor: inputBg,
                            color: theme.primary,
                            borderColor: focusedField === 'price' ? theme.primary : softBorder,
                          },
                        ]}
                        placeholder="350"
                        placeholderTextColor={theme.textMuted}
                        keyboardType="numeric"
                        value={price}
                        onChangeText={setPrice}
                        onFocus={() => setFocusedField('price')}
                        onBlur={() => setFocusedField(null)}
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={[styles.inputLabel, { color: theme.text }]}>
                        {t('cost')} ({settings.currencySymbol})
                      </Text>
                      <TextInput
                        style={[
                          styles.inputBox,
                          {
                            backgroundColor: inputBg,
                            color: theme.text,
                            borderColor: focusedField === 'costPrice' ? theme.primary : softBorder,
                          },
                        ]}
                        placeholder="280"
                        placeholderTextColor={theme.textMuted}
                        keyboardType="numeric"
                        value={costPrice}
                        onChangeText={setCostPrice}
                        onFocus={() => setFocusedField('costPrice')}
                        onBlur={() => setFocusedField(null)}
                      />
                    </View>
                  </View>

                  {/* Live Profit Banner */}
                  {parsedPrice > 0 ? (
                    <View
                      style={[
                        styles.profitBanner,
                        {
                          backgroundColor: settings.darkMode ? 'rgba(16, 185, 129, 0.12)' : '#ECFDF5',
                          borderColor: settings.darkMode ? 'rgba(16, 185, 129, 0.25)' : '#A7F3D0',
                        },
                      ]}>
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
                <View style={[styles.formSectionCard, { backgroundColor: sectionBg, borderColor: sectionBorder }]}>
                  <View style={styles.sectionTitleRow}>
                    <View style={[styles.sectionTitleIndicator, { backgroundColor: theme.primary }]} />
                    <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                      {language === 'ur' ? 'اسٹاک اور بارکوڈ' : '3. Inventory & Barcode'}
                    </Text>
                  </View>

                  {/* Stock Input & Shortcuts */}
                  <View style={styles.inputWrap}>
                    <Text style={[styles.inputLabel, { color: theme.text }]}>{t('stock')} *</Text>
                    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                      <TextInput
                        style={[
                          styles.inputBox,
                          {
                            flex: 1,
                            backgroundColor: inputBg,
                            color: theme.text,
                            borderColor: focusedField === 'stock' ? theme.primary : softBorder,
                          },
                        ]}
                        placeholder="25"
                        placeholderTextColor={theme.textMuted}
                        keyboardType="numeric"
                        value={stock}
                        onChangeText={setStock}
                        onFocus={() => setFocusedField('stock')}
                        onBlur={() => setFocusedField(null)}
                      />
                      {/* Stock shortcuts */}
                      <View style={{ flexDirection: 'row', gap: 6 }}>
                        {STOCK_SHORTCUTS.map((amt) => (
                          <Pressable
                            key={amt}
                            onPress={() => setStock(amt.toString())}
                            style={({ pressed }) => [
                              styles.shortcutPill,
                              {
                                backgroundColor: stock === amt.toString() ? theme.primaryLight : (settings.darkMode ? '#1E293B' : '#EDF2F7'),
                              },
                              pressed && { opacity: 0.8 },
                            ]}>
                            <Text
                              style={[
                                styles.shortcutPillText,
                                {
                                  color: stock === amt.toString() ? theme.primary : theme.textSecondary,
                                },
                              ]}>
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
                          {
                            flex: 1,
                            backgroundColor: inputBg,
                            color: theme.text,
                            borderColor: focusedField === 'barcode' ? theme.primary : softBorder,
                          },
                        ]}
                        placeholder="8964000..."
                        placeholderTextColor={theme.textMuted}
                        value={barcode}
                        onChangeText={setBarcode}
                        onFocus={() => setFocusedField('barcode')}
                        onBlur={() => setFocusedField(null)}
                      />
                      <Pressable
                        onPress={generateRandomSku}
                        style={({ pressed }) => [
                          styles.autoSkuBtn,
                          { backgroundColor: theme.primaryLight },
                          pressed && { opacity: 0.8 },
                        ]}>
                        <Ionicons name="sparkles" size={15} color={theme.primary} />
                        <Text style={[styles.autoSkuText, { color: theme.primaryDark }]}>Auto SKU</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </ScrollView>

              {/* Action Footer */}
              <View style={[styles.modalFooter, { backgroundColor: theme.surface, borderTopColor: softBorder }]}>
                <Pressable
                  onPress={onClose}
                  style={({ pressed }) => [
                    styles.footerCancelBtn,
                    {
                      borderColor: softBorder,
                      backgroundColor: settings.darkMode ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC',
                    },
                    pressed && { opacity: 0.8 },
                  ]}>
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
    justifyContent: Platform.OS === 'web' ? 'center' : 'flex-end',
    alignItems: 'center',
    padding: Platform.OS === 'web' ? Spacing.sm : 0,
  },
  modalCard: {
    width: '100%',
    maxWidth: 580,
    height: Platform.OS === 'web' ? '92%' : '94%',
    maxHeight: 840,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: Platform.OS === 'web' ? BorderRadius.xxl : 0,
    borderBottomRightRadius: Platform.OS === 'web' ? BorderRadius.xxl : 0,
    overflow: 'hidden',
    borderWidth: Platform.OS === 'web' ? 1 : 0,
    ...Shadows.xl,
  },
  sheetHandleWrap: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 4,
  },
  sheetHandle: {
    width: 38,
    height: 4.5,
    borderRadius: 3,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  headerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  modalSubtitle: {
    fontSize: 11.5,
    marginTop: 1,
  },
  modalHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  sectionTitleIndicator: {
    width: 3.5,
    height: 12,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  photoChoiceGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  photoPickCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
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
    flexShrink: 1,
  },
  overlayActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    flexShrink: 1,
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
    marginRight: 8,
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
    gap: 6,
  },
  inputLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  inputBox: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.md,
    fontSize: 14.5,
    fontWeight: '600',
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
  fieldLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldHintUrdu: {
    fontSize: 11,
    fontWeight: '500',
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  dropdownTriggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  dropdownIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownValueCol: {
    flex: 1,
  },
  dropdownValuePrimary: {
    fontSize: 14,
    fontWeight: '700',
  },
  dropdownValueSecondary: {
    fontSize: 11,
    marginTop: 1,
  },
  dropdownTriggerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dropdownBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  dropdownBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  dropdownMenu: {
    marginTop: 8,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    ...Shadows.md,
  },
  dropdownMenuHeader: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownMenuHeaderTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  dropdownList: {
    maxHeight: 260,
  },
  dropdownListContent: {
    paddingVertical: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 12,
  },
  dropdownItemIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownItemTextCol: {
    flex: 1,
  },
  dropdownItemTitle: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  dropdownItemSub: {
    fontSize: 11,
    marginTop: 1,
  },
  dropdownItemUrdu: {
    fontSize: 13,
    fontWeight: '600',
  },
  dropdownSearchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 42,
    marginHorizontal: 10,
    marginVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  dropdownSearchInput: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '600',
    padding: 0,
  },
  dropdownEmptyState: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  dropdownEmptyText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  profitBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  profitBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  profitBannerSub: {
    fontSize: 11.5,
    marginTop: 2,
  },
  shortcutPill: {
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 0,
  },
  shortcutPillText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  autoSkuBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 14,
    borderWidth: 0,
    justifyContent: 'center',
  },
  autoSkuText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    borderTopWidth: 1,
    gap: Spacing.md,
  },
  footerCancelBtn: {
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 14,
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
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
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
