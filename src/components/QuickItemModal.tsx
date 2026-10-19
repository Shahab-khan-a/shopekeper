import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShop } from '@/context/ShopContext';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { Product } from '@/types';
import { ProductImage } from '@/components/ProductImage';
import { ImageService } from '@/services/imageService';
import { useKeyboardOffset } from '@/hooks/use-keyboard-offset';

interface QuickItemModalProps {
  visible: boolean;
  onClose: () => void;
  onAddItem: (item: {
    name: string;
    nameUrdu?: string;
    price: number;
    quantity: number;
    productId?: string;
  }) => void;
}

const PRICE_PRESETS = [50, 100, 150, 200, 300, 500];

export const QuickItemModal: React.FC<QuickItemModalProps> = ({
  visible,
  onClose,
  onAddItem,
}) => {
  const { settings, t, language, products } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const [name, setName] = useState('');
  const [nameUrdu, setNameUrdu] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<'search' | 'price' | null>(null);
  const insets = useSafeAreaInsets();
  const keyboardOffset = useKeyboardOffset(visible);

  useEffect(() => {
    if (visible) {
      setName('');
      setNameUrdu('');
      setPrice('');
      setQuantity(1);
      setSelectedProduct(null);
      setIsDropdownOpen(false);
      setError('');
      setFocusedField(null);
    }
  }, [visible]);

  // Filter products for the searchable dropdown
  const filteredProducts = useMemo(() => {
    const q = name.trim().toLowerCase();
    if (!q) {
      return products.slice(0, 20);
    }
    return products
      .filter((p) => {
        const matchEn = p.name.toLowerCase().includes(q);
        const matchUr = (p.nameUrdu || '').toLowerCase().includes(q);
        const matchCat = (p.category || '').toLowerCase().includes(q);
        const matchBarcode = (p.barcode || '').toLowerCase().includes(q);
        return matchEn || matchUr || matchCat || matchBarcode;
      })
      .slice(0, 30);
  }, [products, name]);

  const handleSelectProduct = (p: Product) => {
    setSelectedProduct(p);
    setName(p.name);
    setNameUrdu(p.nameUrdu || '');
    setPrice(p.price.toString());
    setIsDropdownOpen(false);
    setError('');
    Keyboard.dismiss();
  };

  const handleClose = () => {
    Keyboard.dismiss();
    setIsDropdownOpen(false);
    onClose();
  };

  const handleAdd = () => {
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError(language === 'ur' ? 'برائے مہربانی درست قیمت درج کریں' : 'Please enter a valid price');
      return;
    }

    const finalName = name.trim() || (language === 'ur' ? 'متفرق آئٹم' : 'Quick Item');
    onAddItem({
      name: finalName,
      nameUrdu: nameUrdu.trim() || undefined,
      price: Math.round(parsedPrice),
      quantity: Math.max(1, quantity),
      productId: selectedProduct?.id,
    });

    handleClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.overlay, { paddingBottom: keyboardOffset }]}>
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <View
          style={[
            styles.sheetContainer,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}>
          {/* Bottom Sheet Handle */}
          <View style={[styles.sheetHandle, { backgroundColor: theme.border }]} />

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <View style={styles.headerTitleRow}>
              <View style={[styles.iconWrap, { backgroundColor: theme.primaryLight }]}>
                <Ionicons name="flash" size={20} color={theme.primary} />
              </View>
              <View>
                <Text style={[styles.title, { color: theme.text }]}>
                  {language === 'ur' ? 'کسٹم / کھلی چیز شامل کریں' : 'Add Custom / Loose Item'}
                </Text>
                <Text style={[styles.subtitle, { color: theme.textMuted }]}>
                  {language === 'ur'
                    ? 'غیر درج شدہ آئٹم کا نام اور قیمت درج کریں'
                    : 'Enter custom item name and price for this sale'}
                </Text>
              </View>
            </View>
            <Pressable
              onPress={handleClose}
              style={[styles.closeBtn, { backgroundColor: theme.surfaceSubtle }]}>
              <Ionicons name="close" size={20} color={theme.textSecondary} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled">
            {/* Searchable Input for Custom Item Name */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                  {language === 'ur' ? 'آئٹم کا نام (مثلاً کھلی چینی، کسٹم آئٹم)' : 'Item Name (e.g. Open Rice, Custom Item)'}
                </Text>
              </View>

              {/* Search / Input Container */}
              <View
                style={[
                  styles.searchInputContainer,
                  {
                    backgroundColor: theme.surfaceSubtle,
                    borderColor:
                      focusedField === 'search' || isDropdownOpen ? theme.primary : theme.border,
                    borderWidth: focusedField === 'search' || isDropdownOpen ? 1.5 : 1,
                  },
                ]}>
                <Ionicons
                  name="create-outline"
                  size={18}
                  color={focusedField === 'search' || isDropdownOpen ? theme.primary : theme.textMuted}
                  style={styles.searchIcon}
                />
                <TextInput
                  style={[styles.searchInput, { color: theme.text }]}
                  placeholder={
                    language === 'ur'
                      ? 'آئٹم کا نام لکھیں (خالی چھوڑنے پر متفرق آئٹم ہوگا)...'
                      : 'Type item name (default: Custom Item)...'
                  }
                  placeholderTextColor={theme.textMuted}
                  value={language === 'ur' && nameUrdu && !name ? nameUrdu : name}
                  onChangeText={(text) => {
                    setName(text);
                    setNameUrdu(text);
                    setIsDropdownOpen(true);
                    if (selectedProduct && selectedProduct.name !== text) {
                      setSelectedProduct(null);
                    }
                    setError('');
                  }}
                  onFocus={() => {
                    setIsDropdownOpen(true);
                    setFocusedField('search');
                  }}
                  onBlur={() => setFocusedField(null)}
                />
                {name.length > 0 && (
                  <Pressable
                    onPress={() => {
                      setName('');
                      setNameUrdu('');
                      setSelectedProduct(null);
                      setIsDropdownOpen(true);
                    }}
                    hitSlop={8}
                    style={styles.clearBtn}>
                    <Ionicons name="close-circle" size={18} color={theme.textMuted} />
                  </Pressable>
                )}
                <Pressable
                  onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                  hitSlop={8}
                  style={styles.dropdownToggleBtn}>
                  <Ionicons
                    name={isDropdownOpen ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={theme.textSecondary}
                  />
                </Pressable>
              </View>

              {/* Dropdown Options List */}
              {isDropdownOpen && (
                <View
                  style={[
                    styles.dropdownBox,
                    {
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                    },
                  ]}>
                  <View style={[styles.dropdownHeader, { borderBottomColor: theme.border }]}>
                    <Text style={[styles.dropdownHeaderText, { color: theme.textSecondary }]}>
                      {name.trim()
                        ? language === 'ur'
                          ? `ملتی جلتی اشیاء (${filteredProducts.length})`
                          : `Matching Items (${filteredProducts.length})`
                        : language === 'ur'
                        ? `آپ کی انوینٹری (${products.length})`
                        : `Your Inventory Items (${products.length})`}
                    </Text>
                    <Pressable onPress={() => setIsDropdownOpen(false)} hitSlop={6}>
                      <Text style={[styles.dropdownCloseText, { color: theme.primary }]}>
                        {language === 'ur' ? 'بند کریں' : 'Done'}
                      </Text>
                    </Pressable>
                  </View>

                  <ScrollView
                    style={styles.dropdownScroll}
                    nestedScrollEnabled={true}
                    keyboardShouldPersistTaps="always">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((p) => {
                        const isCurrentSelected = selectedProduct?.id === p.id;
                        const isOutOfStock = p.stock <= 0;
                        return (
                          <Pressable
                            key={p.id}
                            onPress={() => handleSelectProduct(p)}
                            style={({ pressed }) => [
                              styles.dropdownItem,
                              {
                                backgroundColor: isCurrentSelected
                                  ? theme.primaryLight
                                  : pressed
                                  ? theme.surfaceSubtle
                                  : 'transparent',
                                borderBottomColor: theme.border,
                              },
                            ]}>
                            <View
                              style={[
                                styles.itemImageThumb,
                                { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
                              ]}>
                              <ProductImage
                                uri={p.imageUri || p.image}
                                style={styles.itemThumbImg}
                                fallbackIcon={
                                  <Ionicons
                                    name={ImageService.getCategoryIcon(p.category) as any}
                                    size={16}
                                    color={theme.primary}
                                  />
                                }
                              />
                            </View>
                            <View style={styles.dropdownItemInfo}>
                              <Text
                                style={[
                                  styles.dropdownItemName,
                                  {
                                    color: theme.text,
                                    fontWeight: isCurrentSelected ? '800' : '600',
                                  },
                                ]}
                                numberOfLines={1}>
                                {language === 'ur' && p.nameUrdu ? p.nameUrdu : p.name}
                              </Text>
                              <View style={styles.dropdownItemMeta}>
                                <Text style={[styles.dropdownItemCat, { color: theme.textMuted }]}>
                                  {p.category}
                                </Text>
                                <Text style={{ color: theme.textMuted, fontSize: 10 }}>•</Text>
                                <Text
                                  style={[
                                    styles.dropdownItemStock,
                                    { color: isOutOfStock ? theme.danger : theme.success },
                                  ]}>
                                  {language === 'ur'
                                    ? `اسٹاک: ${p.stock}`
                                    : `Stock: ${p.stock}`}
                                </Text>
                              </View>
                            </View>
                            <View
                              style={[
                                styles.dropdownItemPriceWrap,
                                { backgroundColor: theme.primaryLight },
                              ]}>
                              <Text style={[styles.dropdownItemPrice, { color: theme.primaryDark }]}>
                                {settings.currencySymbol}{p.price}
                              </Text>
                            </View>
                          </Pressable>
                        );
                      })
                    ) : (
                      <View style={styles.emptyDropdownWrap}>
                        <Ionicons name="cube-outline" size={24} color={theme.textMuted} />
                        <Text style={[styles.emptyDropdownText, { color: theme.textSecondary }]}>
                          {language === 'ur'
                            ? `"${name}" انوینٹری میں موجود نہیں۔ یہ متفرق آئٹم کے طور پر شامل ہو جائے گا۔`
                            : `"${name}" not found in inventory. Will be added as a custom item.`}
                        </Text>
                      </View>
                    )}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Price Input & Quick Price Buttons */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                  {t('pricePerUnit')} ({settings.currencySymbol}) *
                </Text>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </View>

              <View
                style={[
                  styles.priceInputBox,
                  {
                    backgroundColor: theme.surfaceSubtle,
                    borderColor: error
                      ? theme.danger
                      : focusedField === 'price'
                      ? theme.primary
                      : theme.border,
                    borderWidth: error || focusedField === 'price' ? 1.5 : 1,
                  },
                ]}>
                <Text style={[styles.currencyPrefix, { color: theme.primary }]}>
                  {settings.currencySymbol}
                </Text>
                <TextInput
                  style={[styles.priceInput, { color: theme.text }]}
                  placeholder="0"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="numeric"
                  value={price}
                  onChangeText={(val) => {
                    setPrice(val);
                    setError('');
                  }}
                  onFocus={() => setFocusedField('price')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>

              {/* Price shortcut chips */}
              <View style={styles.priceShortcutsRow}>
                {PRICE_PRESETS.map((amt) => {
                  const isSelected = price === amt.toString();
                  return (
                    <Pressable
                      key={amt}
                      onPress={() => {
                        setPrice(amt.toString());
                        setError('');
                      }}
                      style={({ pressed }) => [
                        styles.priceShortcutBtn,
                        {
                          backgroundColor: isSelected
                            ? theme.primary
                            : theme.surfaceSubtle,
                          borderColor: isSelected ? theme.primary : 'transparent',
                        },
                        pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
                      ]}>
                      <Text
                        style={[
                          styles.priceShortcutText,
                          {
                            color: isSelected ? '#FFFFFF' : theme.textSecondary,
                            fontWeight: isSelected ? '800' : '600',
                          },
                        ]}>
                        +{amt}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Quantity Stepper */}
            <View style={styles.quantityRow}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                {t('qty')}
              </Text>
              <View style={styles.stepperWrap}>
                <Pressable
                  onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={[styles.stepBtn, { backgroundColor: theme.surfaceSubtle }]}>
                  <Ionicons name="remove" size={20} color={theme.text} />
                </Pressable>
                <Text style={[styles.stepQtyText, { color: theme.text }]}>{quantity}</Text>
                <Pressable
                  onPress={() => setQuantity((q) => q + 1)}
                  style={[styles.stepBtn, { backgroundColor: theme.surfaceSubtle }]}>
                  <Ionicons name="add" size={20} color={theme.text} />
                </Pressable>
              </View>
            </View>

            {/* Total calculation preview */}
            {parseFloat(price) > 0 ? (
              <View style={[styles.totalPreviewBox, { backgroundColor: theme.primaryLight }]}>
                <Text style={[styles.totalPreviewLabel, { color: theme.primaryDark }]}>
                  {t('total')}:
                </Text>
                <Text style={[styles.totalPreviewVal, { color: theme.primaryDark }]}>
                  {settings.currencySymbol} {Math.round(parseFloat(price) * quantity)}
                </Text>
              </View>
            ) : null}
          </ScrollView>

          {/* Submit Button */}
          <View
            style={[
              styles.footer,
              {
                borderTopColor: theme.border,
                paddingBottom: Spacing.md + (keyboardOffset > 0 ? 0 : insets.bottom),
              },
            ]}>
            <Pressable
              onPress={handleAdd}
              style={({ pressed }) => [
                styles.submitBtn,
                { backgroundColor: theme.primary },
                pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
              ]}>
              <Ionicons name="cart-outline" size={20} color="#FFFFFF" />
              <Text style={styles.submitBtnText}>{t('addItemToBill')}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    maxHeight: '92%',
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    ...Shadows.xl,
  },
  sheetHandle: {
    width: 38,
    height: 4.5,
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollArea: {
    flexGrow: 0,
    flexShrink: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  inputGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  selectedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '600',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: Spacing.sm,
  },
  searchIcon: {
    marginRight: 6,
    marginLeft: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 8,
  },
  clearBtn: {
    padding: 4,
  },
  dropdownToggleBtn: {
    padding: 6,
    marginLeft: 2,
  },
  dropdownBox: {
    borderWidth: 1,
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 4,
    ...Shadows.md,
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  dropdownHeaderText: {
    fontSize: 11,
    fontWeight: '700',
  },
  dropdownCloseText: {
    fontSize: 12,
    fontWeight: '700',
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    gap: 10,
  },
  itemImageThumb: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  itemThumbImg: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
  },
  dropdownItemInfo: {
    flex: 1,
  },
  dropdownItemName: {
    fontSize: 13,
  },
  dropdownItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  dropdownItemCat: {
    fontSize: 11,
    fontWeight: '500',
  },
  dropdownItemStock: {
    fontSize: 11,
    fontWeight: '700',
  },
  dropdownItemPriceWrap: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  dropdownItemPrice: {
    fontSize: 13,
    fontWeight: '800',
  },
  emptyDropdownWrap: {
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyDropdownText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  priceInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    gap: 8,
  },
  currencyPrefix: {
    fontSize: 20,
    fontWeight: '800',
  },
  priceInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
  },
  priceShortcutsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  priceShortcutBtn: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
  },
  priceShortcutText: {
    fontSize: 12,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  stepperWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepQtyText: {
    fontSize: 18,
    fontWeight: '800',
    minWidth: 24,
    textAlign: 'center',
  },
  totalPreviewBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 14,
  },
  totalPreviewLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  totalPreviewVal: {
    fontSize: 18,
    fontWeight: '900',
  },
  submitBtn: {
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Shadows.md,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
