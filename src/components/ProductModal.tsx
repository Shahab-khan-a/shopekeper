import { CameraModal } from '@/components/CameraModal';
import { ProductBarcodeModal } from '@/components/ProductBarcodeModal';
import { ProductImage } from '@/components/ProductImage';
import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';
import { googleDriveService } from '@/services/googleDriveService';
import { Product, ProductCategory, ProductUnit } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image as ExpoImage } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

interface ProductModalProps {
  visible: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

import {
  CATEGORY_OPTIONS,
  CategoryOption,
  PRODUCT_CATEGORIES,
  PRODUCT_UNITS,
  UNIT_OPTIONS,
  UnitOption,
} from '@/constants/categories';
import { STAPLE_ITEMS, StapleItem } from '@/constants/staples';
export { CATEGORY_OPTIONS, CategoryOption, UNIT_OPTIONS, UnitOption };

const CATEGORIES: ProductCategory[] = PRODUCT_CATEGORIES;
const UNITS: ProductUnit[] = PRODUCT_UNITS;

const PRESET_IMAGES = [
  { label: 'Oil', labelUrdu: 'گھی', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80' },
  { label: 'Rice', labelUrdu: 'چاول', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80' },
  { label: 'Tea', labelUrdu: 'چائے', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=80' },
  { label: 'Milk', labelUrdu: 'دودھ', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80' },
  { label: 'Spices', labelUrdu: 'مصالحہ', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80' },
  { label: 'Biscuits', labelUrdu: 'بسکٹ', url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format&fit=crop&q=80' },
  { label: 'Soap', labelUrdu: 'صابن', url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&auto=format&fit=crop&q=80' },
  { label: 'Sugar', labelUrdu: 'چینی', url: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=400&auto=format&fit=crop&q=80' },
];

const STOCK_SHORTCUTS = [10, 25, 50, 100];

const getDefaultCategoryForShopType = (shopType?: string): ProductCategory => {
  if (!shopType) return 'Kiryana';
  const lower = shopType.toLowerCase();
  if (lower.includes('dairy') || lower.includes('milk')) return 'Dairy';
  if (lower.includes('bakery') || lower.includes('sweet')) return 'Bakery';
  if (lower.includes('tea') || lower.includes('beverage') || lower.includes('drink') || lower.includes('dhaba')) return 'Beverages';
  if (lower.includes('snack') || lower.includes('cafe') || lower.includes('fast food') || lower.includes('tobacco') || lower.includes('paan')) return 'Snacks';
  if (lower.includes('cosmetic') || lower.includes('beauty') || lower.includes('pharmacy')) return 'Personal Care';
  if (lower.includes('spice') || lower.includes('masala')) return 'Spices';
  if (lower.includes('supermarket') || lower.includes('grocery') || lower.includes('fruit') || lower.includes('vegetable') || lower.includes('grain')) return 'Grocery';
  if (lower.includes('general') || lower.includes('kiryana') || lower.includes('store')) return 'Kiryana';
  return 'Others';
};

export const ProductModal: React.FC<ProductModalProps> = ({
  visible,
  onClose,
  productToEdit,
}) => {
  const { addProduct, updateProduct, settings, t, language, showAlert, isOnline } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const [name, setName] = useState('');
  const [nameUrdu, setNameUrdu] = useState('');
  const [price, setPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [category, setCategory] = useState<ProductCategory>(() =>
    getDefaultCategoryForShopType(settings.catalogShopType)
  );
  const [unit, setUnit] = useState<ProductUnit>('piece');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isUnitOpen, setIsUnitOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [unitSearch, setUnitSearch] = useState('');
  const [barcode, setBarcode] = useState('');
  const [image, setImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState(false);
  const [isUploadingToDrive, setIsUploadingToDrive] = useState(false);
  const [isDriveConnected, setIsDriveConnected] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [selectedStapleId, setSelectedStapleId] = useState<string | null>(null);
  const [stapleCategoryFilter, setStapleCategoryFilter] = useState<string>('All');
  const scrollViewRef = useRef<ScrollView>(null);
  const priceInputRef = useRef<TextInput>(null);
  const stockInputRef = useRef<TextInput>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Intelligent preset photo caching:
  // If first opened without internet, hide presets so no broken/blank images appear.
  // When online, prefetch & cache them to disk so they remain usable even offline later.
  const [arePresetsCached, setArePresetsCached] = useState<boolean>(false);

  useEffect(() => {
    AsyncStorage.getItem('@shopkeeper_presets_cached')
      .then((val) => {
        if (val === 'true') {
          setArePresetsCached(true);
        }
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    if (isOnline) {
      setArePresetsCached(true);
      AsyncStorage.setItem('@shopkeeper_presets_cached', 'true').catch(() => { });
      PRESET_IMAGES.forEach((preset) => {
        ExpoImage.prefetch(preset.url).catch(() => { });
      });
    }
  }, [isOnline]);

  const shouldShowPresets = isOnline || arePresetsCached;

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
      setShowAdvanced(Boolean(productToEdit.costPrice || productToEdit.barcode));
    } else {
      resetForm();
    }
  }, [productToEdit, visible]);

  const resetForm = () => {
    setName('');
    setNameUrdu('');
    setPrice('');
    setCostPrice('');
    setStock('10');
    setCategory(getDefaultCategoryForShopType(settings.catalogShopType));
    setUnit('piece');
    setIsCategoryOpen(false);
    setIsUnitOpen(false);
    setCategorySearch('');
    setUnitSearch('');
    setBarcode('');
    setImage('');
    setSelectedStapleId(null);
    setStapleCategoryFilter('All');
    setIsSubmitting(false);
    setIsCameraOpen(false);
    setIsUploadingToDrive(false);
    setShowAdvanced(false);
  };

  const handleSelectStaple = (staple: StapleItem) => {
    setSelectedStapleId(staple.id);
    setName(staple.name);
    setNameUrdu(staple.nameUrdu);
    setCategory(staple.category);
    setUnit(staple.unit);
    if (staple.image) {
      setImage(staple.image);
    }
    // Leave barcode empty so user can scan real GS1 barcode or leave blank
    // Auto-focus price input and scroll to pricing section
    setTimeout(() => {
      priceInputRef.current?.focus();
      setFocusedField('price');
    }, 120);
  };

  const stapleCategories = useMemo(() => {
    const cats = ['All', ...Array.from(new Set(STAPLE_ITEMS.map((s) => s.category)))];
    return cats;
  }, []);

  const filteredStaples = useMemo(() => {
    if (stapleCategoryFilter === 'All') return STAPLE_ITEMS;
    return STAPLE_ITEMS.filter((s) => s.category === stapleCategoryFilter);
  }, [stapleCategoryFilter]);

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

  // Live profit calculation (strictly authentic, zero fabricated margins)
  const parsedPrice = parseFloat(price) || 0;
  const hasValidCost = Boolean(costPrice && !isNaN(parseFloat(costPrice)) && parseFloat(costPrice) > 0);
  const parsedCost = hasValidCost ? parseFloat(costPrice) : 0;
  const unitProfit = hasValidCost ? Math.max(0, parsedPrice - parsedCost) : 0;
  const profitMarginPercent = hasValidCost && parsedPrice > 0 ? Math.round((unitProfit / parsedPrice) * 100) : 0;

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
          rawUri || persistentUri,
          `product_${Date.now()}.jpg`
        );
        setImage(driveUrl);
      } catch (err: any) {
        console.error('[ProductModal] Google Drive upload error:', err);
        const errMsg = err?.message || 'Upload to Google Drive failed.';
        if (errMsg.includes('Google Drive API has not been used') || errMsg.includes('disabled')) {
          showAlert({
            type: 'info',
            title: language === 'ur' ? 'گوگل ڈرائیو بیک اپ' : 'Google Drive Backup',
            message:
              language === 'ur'
                ? 'گوگل ڈرائیو فوٹو بیک اپ فی الحال دستیاب نہیں ہے۔ تصویر آپ کے موبائل میں محفوظ ہے۔'
                : 'Google Drive photo backup is currently unavailable. Photos are safely saved locally on this device.',
            buttons: [{ text: t('close') || 'OK', style: 'cancel' }],
          });
        } else {
          showAlert({
            type: 'error',
            title: 'Google Drive Error',
            message: errMsg,
          });
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
      showAlert({
        type: 'warning',
        title: t('warningAlert'),
        message: language === 'ur' ? 'براہ کرم پروڈکٹ کا نام درج کریں' : 'Please enter product name.',
      });
      return;
    }

    if (isNaN(parsedPrice) || parsedPrice < 0) {
      showAlert({
        type: 'warning',
        title: t('warningAlert'),
        message: language === 'ur' ? 'براہ کرم درست فروخت قیمت درج کریں' : 'Please enter a valid price.',
      });
      return;
    }

    const parsedStock = parseInt(stock, 10);
    if (isNaN(parsedStock) || parsedStock < 0) {
      showAlert({
        type: 'warning',
        title: t('warningAlert'),
        message: language === 'ur' ? 'براہ کرم درست اسٹاک تعداد درج کریں' : 'Please enter a valid stock quantity.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const finalCost =
        costPrice && !isNaN(parseFloat(costPrice)) && parseFloat(costPrice) > 0
          ? parseFloat(costPrice)
          : undefined;

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

  const handleRequestClose = () => {
    if (isBarcodeScannerOpen) {
      setIsBarcodeScannerOpen(false);
      return;
    }
    if (isCameraOpen) {
      setIsCameraOpen(false);
      return;
    }
    if (isCategoryOpen) {
      setIsCategoryOpen(false);
      return;
    }
    if (isUnitOpen) {
      setIsUnitOpen(false);
      return;
    }
    onClose();
  };

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent onRequestClose={handleRequestClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.kavContainer}>
          <View
            style={[
              styles.modalOverlay,
              Platform.OS === 'android' && keyboardHeight > 0 && {
                paddingBottom: keyboardHeight,
                paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 8 : 28,
              },
            ]}>
            <View
              style={[
                styles.modalCard,
                { backgroundColor: theme.surface, borderColor: sectionBorder },
                Platform.OS === 'android' && keyboardHeight > 0 && {
                  height: '100%',
                },
              ]}>
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
                ref={scrollViewRef}
                style={styles.scrollArea}
                contentContainerStyle={[
                  styles.scrollContent,
                  { paddingBottom: keyboardHeight > 0 ? 80 : 120 },
                ]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
                {/* ── Quick Staple Templates Carousel (Only shown when adding a new product) ── */}
                {!productToEdit && (
                  <View style={[styles.formSectionCard, { backgroundColor: sectionBg, borderColor: sectionBorder }]}>
                    <View style={styles.sectionTitleRow}>
                      <View style={[styles.sectionTitleIndicator, { backgroundColor: theme.accent }]} />
                      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                          {language === 'ur' ? '⚡ فوری بنیادی کریانہ اشیاء' : '⚡ 1-Tap Staple Templates'}
                        </Text>
                        <View style={[styles.stapleCountBadge, { backgroundColor: theme.primaryLight }]}>
                          <Text style={[styles.stapleCountBadgeText, { color: theme.primaryDark }]}>
                            {STAPLE_ITEMS.length} {language === 'ur' ? 'اشیاء' : 'staples'}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <Text style={[styles.presetHeader, { color: theme.textMuted, marginTop: -4, marginBottom: 8 }]}>
                      {language === 'ur'
                        ? '1-ٹیپ میں نام، کیٹیگری اور اکائی خودکار درج کریں، پھر صرف قیمت لکھیں:'
                        : '1-Tap to prefill name, category & unit. Then simply enter price:'}
                    </Text>

                    {/* Staple Category Filter Pills */}
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={styles.stapleFilterScroll}
                      contentContainerStyle={styles.stapleFilterContent}>
                      {stapleCategories.map((catKey) => {
                        const isActive = stapleCategoryFilter === catKey;
                        return (
                          <Pressable
                            key={catKey}
                            onPress={() => setStapleCategoryFilter(catKey)}
                            style={[
                              styles.stapleFilterPill,
                              {
                                backgroundColor: isActive ? theme.primary : inputBg,
                                borderColor: isActive ? theme.primary : softBorder,
                              },
                            ]}>
                            <Text
                              style={[
                                styles.stapleFilterPillText,
                                {
                                  color: isActive ? '#FFFFFF' : theme.textSecondary,
                                  fontWeight: isActive ? '700' : '500',
                                },
                              ]}>
                              {catKey === 'All' ? (language === 'ur' ? 'تمام' : 'All') : catKey}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </ScrollView>

                    {/* Horizontal List of Staples */}
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={styles.staplesScroll}
                      contentContainerStyle={styles.staplesScrollContent}>
                      {filteredStaples.map((staple) => {
                        const isSelected = selectedStapleId === staple.id;
                        return (
                          <Pressable
                            key={staple.id}
                            onPress={() => handleSelectStaple(staple)}
                            style={({ pressed }) => [
                              styles.stapleCard,
                              {
                                backgroundColor: isSelected ? theme.primaryLight : inputBg,
                                borderColor: isSelected ? theme.primary : softBorder,
                                borderWidth: isSelected ? 1.8 : 1,
                              },
                              pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
                            ]}>
                            {staple.image ? (
                              <ExpoImage
                                source={{ uri: staple.image }}
                                style={styles.stapleCardImg}
                                contentFit="cover"
                                cachePolicy="memory-disk"
                                transition={150}
                              />
                            ) : (
                              <View style={[styles.stapleIconWrap, { backgroundColor: theme.surfaceSubtle }]}>
                                <Ionicons name={staple.icon} size={22} color={theme.primary} />
                              </View>
                            )}

                            <View style={styles.stapleCardBody}>
                              <Text
                                style={[
                                  styles.stapleCardTitle,
                                  { color: isSelected ? theme.primaryDark : theme.text },
                                ]}
                                numberOfLines={1}>
                                {language === 'ur' ? staple.nameUrdu : staple.name}
                              </Text>

                              <View style={styles.stapleUnitPillRow}>
                                <View style={[styles.stapleUnitPill, { backgroundColor: theme.surfaceSubtle }]}>
                                  <Text style={[styles.stapleUnitPillText, { color: theme.textSecondary }]}>
                                    {staple.unit}
                                  </Text>
                                </View>
                                {isSelected && (
                                  <Ionicons name="checkmark-circle" size={14} color={theme.primary} />
                                )}
                              </View>
                            </View>
                          </Pressable>
                        );
                      })}
                    </ScrollView>
                  </View>
                )}

                {/* ── CARD 1: 3-Field Fast Creation Rule ── */}
                <View style={[styles.formSectionCard, { backgroundColor: sectionBg, borderColor: sectionBorder }]}>
                  <View style={styles.sectionTitleRow}>
                    <View style={[styles.sectionTitleIndicator, { backgroundColor: theme.primary }]} />
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                        {language === 'ur' ? '⚡ 3 ضروری اندراجات' : '⚡ 3 Essential Fields'}
                      </Text>
                      <View style={[styles.fastPillBadge, { backgroundColor: '#DCFCE7' }]}>
                        <Ionicons name="flash" size={11} color="#15803D" />
                        <Text style={styles.fastPillBadgeText}>
                          {language === 'ur' ? 'فوری کاؤنٹر اندراج' : 'Fast Counter Entry'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* 1. Product Name with Inline Camera / Photo Thumbnail */}
                  <View style={styles.inputWrap}>
                    <View style={styles.nameHeaderRow}>
                      <Text style={[styles.inputLabel, { color: theme.text, marginBottom: 0 }]}>
                        {t('productName')} *
                      </Text>
                      {image ? (
                        <View style={styles.inlinePhotoWrap}>
                          <Pressable
                            onPress={takePhoto}
                            style={styles.inlinePhotoThumbContainer}>
                            <ProductImage uri={image} style={styles.inlinePhotoThumb} resizeMode="cover" />
                            <View style={styles.inlinePhotoEditBadge}>
                              <Ionicons name="camera" size={10} color="#FFFFFF" />
                            </View>
                          </Pressable>
                          <Pressable
                            onPress={() => setImage('')}
                            style={styles.inlinePhotoRemoveBtn}
                            hitSlop={6}>
                            <Ionicons name="close-circle" size={16} color={theme.textMuted} />
                          </Pressable>
                        </View>
                      ) : (
                        <Pressable
                          onPress={takePhoto}
                          style={({ pressed }) => [
                            styles.inlineCameraBtn,
                            { backgroundColor: theme.primaryLight },
                            pressed && { opacity: 0.8 },
                          ]}>
                          <Ionicons name="camera" size={14} color={theme.primary} />
                          <Text style={[styles.inlineCameraBtnText, { color: theme.primaryDark }]}>
                            {language === 'ur' ? 'تصویر لیں' : 'Snap Photo'}
                          </Text>
                        </Pressable>
                      )}
                    </View>
                    <TextInput
                      style={[
                        styles.inputBox,
                        {
                          backgroundColor: inputBg,
                          color: theme.text,
                          borderColor: focusedField === 'name' ? theme.primary : softBorder,
                        },
                      ]}
                      placeholder={language === 'ur' ? 'مثلاً: باسمتی چاول یا ڈالڈا گھی' : 'e.g. Basmati Rice 1kg or Cooking Oil'}
                      placeholderTextColor={theme.textMuted}
                      value={name}
                      onChangeText={setName}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        priceInputRef.current?.focus();
                        setFocusedField('price');
                      }}
                    />
                  </View>

                  {/* 2. Selling Price (Big, Bold, Auto-Focused with Currency Prefix) */}
                  <View style={styles.inputWrap}>
                    <View style={styles.fieldLabelRow}>
                      <Text style={[styles.inputLabel, { color: theme.text, marginBottom: 0 }]}>
                        {language === 'ur' ? 'قیمت فروخت (Selling Price) *' : 'Selling Price *'}
                      </Text>
                      <Text style={{ fontSize: 11, color: theme.textMuted, fontWeight: '600' }}>
                        {language === 'ur' ? `فی ${activeUnitMeta.labelUrdu}` : `Per ${activeUnitMeta.shortCode}`}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.priceInputBoxWrap,
                        {
                          backgroundColor: inputBg,
                          borderColor: focusedField === 'price' ? theme.primary : softBorder,
                        },
                      ]}>
                      <View style={[styles.currencyPrefixBadge, { backgroundColor: theme.primaryLight }]}>
                        <Text style={[styles.currencyPrefixText, { color: theme.primaryDark }]}>
                          {settings.currencySymbol}
                        </Text>
                      </View>
                      <TextInput
                        ref={priceInputRef}
                        style={[styles.priceInputBold, { color: theme.text }]}
                        placeholder="0"
                        placeholderTextColor={theme.textMuted}
                        keyboardType="numeric"
                        value={price}
                        onChangeText={setPrice}
                        onFocus={() => setFocusedField('price')}
                        onBlur={() => setFocusedField(null)}
                        returnKeyType="next"
                        onSubmitEditing={() => {
                          stockInputRef.current?.focus();
                          setFocusedField('stock');
                        }}
                      />
                    </View>
                  </View>

                  {/* 3. Initial Stock Quantity with 1-Tap Shortcut Pills */}
                  <View style={styles.inputWrap}>
                    <View style={styles.fieldLabelRow}>
                      <Text style={[styles.inputLabel, { color: theme.text, marginBottom: 0 }]}>
                        {language === 'ur' ? 'موجودہ اسٹاک (Initial Stock) *' : 'Stock Quantity *'}
                      </Text>
                      <Text style={{ fontSize: 11, color: theme.textMuted, fontWeight: '600' }}>
                        {activeUnitMeta.shortCode} ({language === 'ur' ? activeUnitMeta.labelUrdu : activeUnitMeta.labelEn})
                      </Text>
                    </View>
                    <View style={styles.stockInputRow}>
                      <TextInput
                        ref={stockInputRef}
                        style={[
                          styles.inputBox,
                          styles.stockInputBox,
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
                        onFocus={() => setFocusedField('stock')}
                        onBlur={() => setFocusedField(null)}
                        returnKeyType="done"
                        onSubmitEditing={handleSubmit}
                      />
                      <View style={styles.stockPresetsWrap}>
                        {STOCK_SHORTCUTS.map((amt) => {
                          const isCurrent = stock === amt.toString();
                          return (
                            <Pressable
                              key={amt}
                              onPress={() => setStock(amt.toString())}
                              style={({ pressed }) => [
                                styles.stockPresetPill,
                                {
                                  backgroundColor: isCurrent ? theme.primary : (settings.darkMode ? '#1E293B' : '#EDF2F7'),
                                  borderColor: isCurrent ? theme.primary : softBorder,
                                },
                                pressed && { opacity: 0.8 },
                              ]}>
                              <Text
                                style={[
                                  styles.stockPresetPillText,
                                  { color: isCurrent ? '#FFFFFF' : theme.textSecondary },
                                ]}>
                                {amt}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>
                  </View>
                </View>

                {/* ── CARD 2: Live Product Counter Display Preview ── */}
                <View
                  style={[
                    styles.livePreviewCard,
                    {
                      backgroundColor: settings.darkMode ? '#131D2D' : '#F0FDF4',
                      borderColor: settings.darkMode ? 'rgba(16, 185, 129, 0.25)' : '#BBF7D0',
                    },
                  ]}>
                  <View style={styles.livePreviewHeaderRow}>
                    <View style={styles.livePreviewBadge}>
                      <Ionicons name="eye-outline" size={13} color="#059669" />
                      <Text style={styles.livePreviewBadgeText}>
                        {language === 'ur' ? 'دکان کے کاؤنٹر پر یوں نظر آئے گا' : 'Counter Display Preview'}
                      </Text>
                    </View>
                    <View style={[styles.previewCategoryPill, { backgroundColor: theme.primaryLight }]}>
                      <Ionicons name={activeCategoryMeta.icon} size={11} color={theme.primary} />
                      <Text style={[styles.previewCategoryPillText, { color: theme.primaryDark }]}>
                        {language === 'ur' ? activeCategoryMeta.labelUrdu : activeCategoryMeta.labelEn}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.livePreviewBody}>
                    <View style={styles.livePreviewThumbWrap}>
                      {image ? (
                        <ProductImage uri={image} style={styles.livePreviewThumb} resizeMode="cover" />
                      ) : (
                        <View style={[styles.livePreviewThumbPlaceholder, { backgroundColor: theme.primaryLight }]}>
                          <Ionicons name={activeCategoryMeta.icon} size={22} color={theme.primary} />
                        </View>
                      )}
                    </View>

                    <View style={styles.livePreviewInfoCol}>
                      <Text
                        style={[styles.livePreviewName, { color: theme.text }]}
                        numberOfLines={1}>
                        {name.trim() || (language === 'ur' ? 'پروڈکٹ کا نام' : 'Product Name')}
                      </Text>
                      {nameUrdu.trim() ? (
                        <Text style={[styles.livePreviewUrduName, { color: theme.textMuted }]} numberOfLines={1}>
                          {nameUrdu.trim()}
                        </Text>
                      ) : null}
                      <View style={styles.livePreviewMetaRow}>
                        <View
                          style={[
                            styles.livePreviewStockBadge,
                            {
                              backgroundColor: parseInt(stock, 10) > 0 ? '#DCFCE7' : '#FEE2E2',
                            },
                          ]}>
                          <Text
                            style={[
                              styles.livePreviewStockText,
                              {
                                color: parseInt(stock, 10) > 0 ? '#15803D' : '#B91C1C',
                              },
                            ]}>
                            {stock ? `${stock} ${activeUnitMeta.shortCode}` : `0 ${activeUnitMeta.shortCode}`}
                          </Text>
                        </View>
                        {barcode.trim() ? (
                          <View style={[styles.livePreviewSkuBadge, { backgroundColor: theme.surfaceSubtle }]}>
                            <Ionicons name="barcode-outline" size={11} color={theme.textMuted} />
                            <Text style={[styles.livePreviewSkuText, { color: theme.textMuted }]} numberOfLines={1}>
                              {barcode.trim()}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    </View>

                    <View style={styles.livePreviewPriceCol}>
                      <Text style={styles.livePreviewPriceLabel}>
                        {language === 'ur' ? 'قیمت' : 'Price'}
                      </Text>
                      <Text style={[styles.livePreviewPriceVal, { color: '#059669' }]}>
                        {settings.currencySymbol}{parsedPrice > 0 ? parsedPrice.toLocaleString() : '0'}
                      </Text>
                      <Text style={[styles.livePreviewPerUnit, { color: theme.textMuted }]}>
                        /{activeUnitMeta.shortCode}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* ── CARD 3: Collapsible "More Details (Optional)" Accordion ── */}
                <Pressable
                  onPress={() => setShowAdvanced((prev) => !prev)}
                  style={({ pressed }) => [
                    styles.accordionToggleBtn,
                    {
                      backgroundColor: showAdvanced ? (settings.darkMode ? '#1E293B' : '#E2E8F0') : sectionBg,
                      borderColor: sectionBorder,
                    },
                    pressed && { opacity: 0.8 },
                  ]}>
                  <View style={styles.accordionToggleLeft}>
                    <View style={[styles.accordionIconCircle, { backgroundColor: theme.primaryLight }]}>
                      <Ionicons
                        name={showAdvanced ? 'options' : 'options-outline'}
                        size={18}
                        color={theme.primary}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.accordionToggleTitle, { color: theme.text }]}>
                        {language === 'ur' ? 'مزید اختیاری تفصیلات' : 'More Details (Optional)'}
                      </Text>
                      <Text style={[styles.accordionToggleSub, { color: theme.textMuted }]} numberOfLines={1}>
                        {showAdvanced
                          ? (language === 'ur' ? 'خرید قیمت، بارکوڈ، کیٹیگری، یونٹ، تصاویر' : 'Cost, Barcode, Category, Unit, Photos')
                          : (language === 'ur' ? 'خرید قیمت، بارکوڈ، یا کیٹیگری درج کرنے کے لیے کھولیں ▾' : 'Tap to add Cost, Barcode, Unit, or Photos ▾')}
                      </Text>
                    </View>
                  </View>
                  <Ionicons
                    name={showAdvanced ? 'chevron-up-circle' : 'chevron-down-circle-outline'}
                    size={22}
                    color={showAdvanced ? theme.primary : theme.textSecondary}
                  />
                </Pressable>

                {/* Expanded Advanced Section */}
                {showAdvanced && (
                  <View style={[styles.formSectionCard, { backgroundColor: sectionBg, borderColor: sectionBorder }]}>
                    {/* A. Cost Price & Margin Calculator */}
                    <View style={styles.sectionTitleRow}>
                      <View style={[styles.sectionTitleIndicator, { backgroundColor: theme.accent }]} />
                      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                        {language === 'ur' ? 'خرید قیمت اور منافع' : 'Cost Price & Profit Margin'}
                      </Text>
                    </View>

                    <View style={styles.inputWrap}>
                      <Text style={[styles.inputLabel, { color: theme.text }]}>
                        {t('cost')} ({settings.currencySymbol})
                      </Text>
                      <View
                        style={[
                          styles.priceInputBoxWrap,
                          {
                            backgroundColor: inputBg,
                            borderColor: focusedField === 'costPrice' ? theme.primary : softBorder,
                          },
                        ]}>
                        <View style={[styles.currencyPrefixBadge, { backgroundColor: theme.surfaceSubtle }]}>
                          <Text style={[styles.currencyPrefixText, { color: theme.textSecondary }]}>
                            {settings.currencySymbol}
                          </Text>
                        </View>
                        <TextInput
                          style={[styles.inputBox, { flex: 1, borderWidth: 0, height: 46, color: theme.text }]}
                          placeholder="0"
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
                    {parsedPrice > 0 && hasValidCost ? (
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
                            {language === 'ur'
                              ? `متوقع منافع: ${settings.currencySymbol}${unitProfit} فی ${activeUnitMeta.shortCode} (${profitMarginPercent}% مارجن)`
                              : `Estimated Profit: ${settings.currencySymbol}${unitProfit} / ${activeUnitMeta.shortCode} (${profitMarginPercent}% Margin)`}
                          </Text>
                          <Text style={[styles.profitBannerSub, { color: theme.textSecondary }]}>
                            {language === 'ur'
                              ? `فروخت قیمت ${settings.currencySymbol}${parsedPrice} اور خرید قیمت ${settings.currencySymbol}${parsedCost}`
                              : `Selling for ${settings.currencySymbol}${parsedPrice} vs cost ${settings.currencySymbol}${parsedCost}`}
                          </Text>
                        </View>
                      </View>
                    ) : null}

                    {/* B. Barcode & SKU */}
                    <View style={styles.inputWrap}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <Text style={[styles.inputLabel, { color: theme.text, marginBottom: 0 }]}>{t('barcodeOrSku')}</Text>
                        <Text style={{ fontSize: 11, color: theme.textMuted, fontWeight: '600' }}>
                          {language === 'ur' ? 'اندرونی کوڈ' : 'Internal SKU'}
                        </Text>
                      </View>
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
                          placeholder={language === 'ur' ? '8964...' : '8964...'}
                          placeholderTextColor={theme.textMuted}
                          value={barcode}
                          onChangeText={setBarcode}
                          onFocus={() => {
                            setFocusedField('barcode');
                            setTimeout(() => {
                              scrollViewRef.current?.scrollToEnd({ animated: true });
                            }, 150);
                          }}
                          onBlur={() => setFocusedField(null)}
                        />
                        <Pressable
                          onPress={() => setIsBarcodeScannerOpen(true)}
                          style={({ pressed }) => [
                            styles.scanBarcodeActionBtn,
                            { backgroundColor: theme.surfaceSubtle, borderColor: theme.border, borderWidth: 1 },
                            pressed && { opacity: 0.8 },
                          ]}>
                          <Ionicons name="barcode-outline" size={17} color={theme.primary} />
                          <Text style={[styles.scanBarcodeActionText, { color: theme.text }]}>
                            {language === 'ur' ? 'سکین' : 'Scan'}
                          </Text>
                        </Pressable>
                        <Pressable
                          onPress={generateRandomSku}
                          style={({ pressed }) => [
                            styles.autoSkuBtn,
                            { backgroundColor: theme.primaryLight },
                            pressed && { opacity: 0.8 },
                          ]}>
                          <Ionicons name="sparkles" size={14} color={theme.primary} />
                          <Text style={[styles.autoSkuText, { color: theme.primaryDark }]}>
                            {language === 'ur' ? 'اندرونی SKU' : 'Auto SKU'}
                          </Text>
                        </Pressable>
                      </View>
                    </View>

                    {/* C. Category Dropdown */}
                    <View style={styles.inputWrap}>
                      <View style={styles.fieldLabelRow}>
                        <Text style={[styles.inputLabel, { color: theme.text }]}>
                          {t('category')}
                        </Text>
                        <Text style={[styles.fieldHintUrdu, { color: theme.textMuted }]}>
                          {language === 'ur' ? activeCategoryMeta.labelUrdu : activeCategoryMeta.labelEn}
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

                    {/* D. Unit of Measurement Dropdown */}
                    <View style={styles.inputWrap}>
                      <View style={styles.fieldLabelRow}>
                        <Text style={[styles.inputLabel, { color: theme.text }]}>
                          {t('unit')}
                        </Text>
                        <Text style={[styles.fieldHintUrdu, { color: theme.textMuted }]}>
                          {language === 'ur' ? activeUnitMeta.labelUrdu : activeUnitMeta.labelEn}
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

                    {/* E. Urdu Name (Optional) */}
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

                    {/* F. Full Photo Picker & Google Drive Management */}
                    <View style={{ marginTop: 8 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <Text style={[styles.inputLabel, { color: theme.text, marginBottom: 0 }]}>
                          {language === 'ur' ? 'پروڈکٹ کی تصویر و بیک اپ' : 'Product Photo & Cloud Storage'}
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

                          {isUploadingToDrive && (
                            <View style={styles.driveUploadingOverlay}>
                              <ActivityIndicator size="small" color="#FFFFFF" />
                              <Text style={styles.driveUploadingText}>
                                {t('uploadingImageToDrive')}
                              </Text>
                            </View>
                          )}

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
                      {shouldShowPresets && (
                        <View style={{ marginTop: 10 }}>
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
                                <ExpoImage
                                  source={{ uri: preset.url }}
                                  style={styles.presetThumbImg}
                                  contentFit="cover"
                                  cachePolicy="memory-disk"
                                  transition={200}
                                />
                                <Text
                                  style={[
                                    styles.presetChipText,
                                    { color: image === preset.url ? theme.primaryDark : theme.textSecondary },
                                  ]}>
                                  {language === 'ur' ? preset.labelUrdu : preset.label}
                                </Text>
                              </Pressable>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>
                  </View>
                )}
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
  scanBarcodeActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 13,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
  },
  scanBarcodeActionText: {
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
  stapleCountBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  stapleCountBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  stapleFilterScroll: {
    marginBottom: 10,
  },
  stapleFilterContent: {
    gap: 6,
    paddingRight: 8,
  },
  stapleFilterPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  stapleFilterPillText: {
    fontSize: 11,
  },
  staplesScroll: {
    marginTop: 2,
    marginBottom: 4,
  },
  staplesScrollContent: {
    gap: 8,
    paddingRight: 8,
  },
  stapleCard: {
    width: 125,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  stapleCardImg: {
    width: '100%',
    height: 64,
  },
  stapleIconWrap: {
    width: '100%',
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stapleCardBody: {
    padding: 7,
    gap: 4,
  },
  stapleCardTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  stapleUnitPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stapleUnitPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  stapleUnitPillText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  fastPillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  fastPillBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#15803D',
  },
  nameHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inlinePhotoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  inlinePhotoThumbContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  inlinePhotoThumb: {
    width: 32,
    height: 32,
  },
  inlinePhotoEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderRadius: 4,
    padding: 2,
  },
  inlinePhotoRemoveBtn: {
    padding: 2,
  },
  inlineCameraBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  inlineCameraBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  priceInputBoxWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  currencyPrefixBadge: {
    height: '100%',
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyPrefixText: {
    fontSize: 14,
    fontWeight: '800',
  },
  stockInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  stockInputBox: {
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
  },
  stockPresetsWrap: {
    flexDirection: 'row',
    gap: 6,
  },
  stockPresetPill: {
    paddingHorizontal: 11,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  stockPresetPillText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  livePreviewCard: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    gap: 10,
    ...Shadows.sm,
  },
  livePreviewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  livePreviewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  livePreviewBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  previewCategoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  previewCategoryPillText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  livePreviewBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  livePreviewThumbWrap: {
    width: 52,
    height: 52,
    borderRadius: 12,
    overflow: 'hidden',
  },
  livePreviewThumb: {
    width: 52,
    height: 52,
  },
  livePreviewThumbPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  livePreviewInfoCol: {
    flex: 1,
    gap: 2,
  },
  livePreviewName: {
    fontSize: 14.5,
    fontWeight: '800',
  },
  livePreviewUrduName: {
    fontSize: 12,
    fontWeight: '500',
  },
  livePreviewMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  livePreviewStockBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  livePreviewStockText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  livePreviewSkuBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  livePreviewSkuText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  livePreviewPriceCol: {
    alignItems: 'flex-end',
  },
  livePreviewPriceLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  livePreviewPriceVal: {
    fontSize: 18,
    fontWeight: '900',
  },
  livePreviewPerUnit: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  accordionToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  accordionToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  accordionIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accordionToggleTitle: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  accordionToggleSub: {
    fontSize: 11,
    marginTop: 1,
  },
});
