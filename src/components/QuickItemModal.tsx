import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useShop } from '@/context/ShopContext';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

interface QuickItemModalProps {
  visible: boolean;
  onClose: () => void;
  onAddItem: (item: { name: string; nameUrdu?: string; price: number; quantity: number }) => void;
}

const COMMON_PRESETS = [
  { name: 'Fresh Milk', nameUrdu: 'کھلا دودھ', icon: 'water-outline' },
  { name: 'Eggs (Dozen)', nameUrdu: 'انڈے (درجن)', icon: 'egg-outline' },
  { name: 'Bread', nameUrdu: 'ڈبل روٹی', icon: 'nutrition-outline' },
  { name: 'Yogurt', nameUrdu: 'دہی', icon: 'restaurant-outline' },
  { name: 'Loose Sugar', nameUrdu: 'کھلی چینی', icon: 'cube-outline' },
  { name: 'Misc Item', nameUrdu: 'متفرق آئٹم', icon: 'pricetag-outline' },
];

const PRICE_PRESETS = [50, 100, 150, 200, 300, 500];

export const QuickItemModal: React.FC<QuickItemModalProps> = ({
  visible,
  onClose,
  onAddItem,
}) => {
  const { settings, t, language } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const [name, setName] = useState('');
  const [nameUrdu, setNameUrdu] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible) {
      setName('');
      setNameUrdu('');
      setPrice('');
      setQuantity(1);
      setError('');
    }
  }, [visible]);

  const handleSelectPreset = (preset: typeof COMMON_PRESETS[0]) => {
    setName(preset.name);
    setNameUrdu(preset.nameUrdu);
    setError('');
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
    });

    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View
          style={[
            styles.sheetContainer,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <View style={styles.headerTitleRow}>
              <View style={[styles.iconWrap, { backgroundColor: theme.primaryLight }]}>
                <Ionicons name="flash" size={20} color={theme.primary} />
              </View>
              <View>
                <Text style={[styles.title, { color: theme.text }]}>
                  {t('addCustomItem')}
                </Text>
                <Text style={[styles.subtitle, { color: theme.textMuted }]}>
                  {t('customItemHint')}
                </Text>
              </View>
            </View>
            <Pressable
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: theme.surfaceSubtle }]}>
              <Ionicons name="close" size={20} color={theme.textSecondary} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled">
            {/* Quick Presets */}
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
              {language === 'ur' ? 'عام اشیاء (فوری سلیکٹ کریں)' : 'Common Loose Items (Quick Tap)'}
            </Text>
            <View style={styles.presetChipsWrap}>
              {COMMON_PRESETS.map((p) => {
                const isSelected = name === p.name;
                return (
                  <Pressable
                    key={p.name}
                    onPress={() => handleSelectPreset(p)}
                    style={[
                      styles.presetChip,
                      {
                        backgroundColor: isSelected ? theme.primary : theme.surfaceSubtle,
                        borderColor: isSelected ? theme.primary : theme.border,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.presetChipText,
                        { color: isSelected ? '#FFFFFF' : theme.text },
                      ]}>
                      {language === 'ur' && p.nameUrdu ? p.nameUrdu : p.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Custom Name Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                {t('customItemName')}
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: theme.surfaceSubtle,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder={language === 'ur' ? 'مثلاً: انڈے، ڈبل روٹی، چینی وغیرہ' : 'e.g., Bread, Milk, Eggs...'}
                placeholderTextColor={theme.textMuted}
                value={language === 'ur' && nameUrdu ? nameUrdu : name}
                onChangeText={(text) => {
                  setName(text);
                  setNameUrdu(text);
                }}
              />
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
                    borderColor: error ? theme.danger : theme.border,
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
                  autoFocus={true}
                />
              </View>

              {/* Price shortcut chips */}
              <View style={styles.priceShortcutsRow}>
                {PRICE_PRESETS.map((amt) => (
                  <Pressable
                    key={amt}
                    onPress={() => {
                      setPrice(amt.toString());
                      setError('');
                    }}
                    style={[
                      styles.priceShortcutBtn,
                      {
                        backgroundColor:
                          price === amt.toString() ? theme.primaryLight : theme.surfaceSubtle,
                        borderColor:
                          price === amt.toString() ? theme.primary : theme.border,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.priceShortcutText,
                        {
                          color:
                            price === amt.toString() ? theme.primary : theme.textSecondary,
                          fontWeight: price === amt.toString() ? '700' : '500',
                        },
                      ]}>
                      +{amt}
                    </Text>
                  </Pressable>
                ))}
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

            {/* Submit Button */}
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
          </ScrollView>
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
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    borderTopWidth: 1,
    maxHeight: '85%',
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    ...Shadows.xl,
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
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  presetChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '600',
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
  errorText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '600',
  },
  textInput: {
    height: 46,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.md,
    fontSize: 14,
    fontWeight: '500',
  },
  priceInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.md,
    gap: 6,
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
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
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
    width: 38,
    height: 38,
    borderRadius: BorderRadius.full,
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
    borderRadius: BorderRadius.lg,
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
    height: 50,
    borderRadius: BorderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: Spacing.xs,
    ...Shadows.md,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
