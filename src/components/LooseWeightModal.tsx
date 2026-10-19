import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';
import { useKeyboardOffset } from '@/hooks/use-keyboard-offset';
import { Product } from '@/types';
import { formatCompactPrice } from '@/utils/formatters';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export interface LooseWeightModalProps {
  visible: boolean;
  onClose: () => void;
  product: Product | null;
  initialQuantity?: number;
  onApply: (quantity: number, customTotal?: number) => void;
}

const FRACTION_PRESETS = [
  { labelEn: '1/4 kg (250g)', labelUrdu: '1/4 kg (پاؤ)', value: 0.25 },
  { labelEn: '1/2 kg (500g)', labelUrdu: '1/2 kg (آدھا کلو)', value: 0.5 },
  { labelEn: '3/4 kg (750g)', labelUrdu: '3/4 kg (تین پاؤ)', value: 0.75 },
  { labelEn: '1 kg', labelUrdu: '1 kg (ایک کلو)', value: 1.0 },
  { labelEn: '1.5 kg', labelUrdu: '1.5 kg (ڈیڑھ کلو)', value: 1.5 },
  { labelEn: '2 kg', labelUrdu: '2 kg (دو کلو)', value: 2.0 },
  { labelEn: '2.5 kg', labelUrdu: '2.5 kg (ڈھائی کلو)', value: 2.5 },
  { labelEn: '5 kg', labelUrdu: '5 kg (پانچ کلو)', value: 5.0 },
];

const CASH_PRESETS = [20, 30, 50, 100, 150, 200, 300, 500];

export const LooseWeightModal: React.FC<LooseWeightModalProps> = ({
  visible,
  onClose,
  product,
  initialQuantity = 1,
  onApply,
}) => {
  const { settings, language } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const keyboardOffset = useKeyboardOffset(visible);

  const [mode, setMode] = useState<'weight' | 'cash'>('weight');
  const [weightStr, setWeightStr] = useState<string>('1');
  const [cashStr, setCashStr] = useState<string>('');

  useEffect(() => {
    if (visible && product) {
      const initQ = initialQuantity > 0 ? initialQuantity : 1;
      setWeightStr(initQ.toString());
      setCashStr(Math.round(initQ * product.price).toString());
      setMode('weight');
    }
  }, [visible, product, initialQuantity]);

  if (!product) return null;

  const unit = product.unit || 'kg';
  const unitPrice = product.price || 0;

  // Weight mode calculations
  const parsedWeight = parseFloat(weightStr) || 0;
  const totalFromWeight = Math.round(parsedWeight * unitPrice);

  // Cash mode calculations
  const parsedCash = parseFloat(cashStr) || 0;
  const computedWeightFromCash =
    unitPrice > 0 ? Math.round((parsedCash / unitPrice) * 1000) / 1000 : 0;

  const activeQuantity = mode === 'weight' ? parsedWeight : computedWeightFromCash;
  const activeTotal = mode === 'weight' ? totalFromWeight : Math.round(parsedCash);

  const handleApply = () => {
    Keyboard.dismiss();
    if (activeQuantity <= 0) return;
    onApply(activeQuantity, activeTotal);
    onClose();
  };

  const handleStepWeight = (delta: number) => {
    const next = Math.max(0.05, Math.round((parsedWeight + delta) * 100) / 100);
    setWeightStr(next.toString());
    setCashStr(Math.round(next * unitPrice).toString());
  };

  const cleanProductName =
    language === 'ur' && product.nameUrdu
      ? product.nameUrdu
      : product.name.replace(/\s*\([\u0600-\u06FF\s/]+\)$/, '').trim();

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />

        <View
          style={[
            styles.modalSheet,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              paddingBottom: Platform.OS === 'android' ? keyboardOffset + 16 : 24,
            },
          ]}>
          {/* Sheet Handle */}
          <View style={[styles.sheetHandle, { backgroundColor: theme.border }]} />

          {/* Header */}
          <View style={[styles.headerRow, { borderBottomColor: theme.border }]}>
            <View style={styles.headerTitleWrap}>
              <View style={[styles.iconBox, { backgroundColor: theme.primaryLight }]}>
                <Ionicons name="scale-outline" size={20} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.productName, { color: theme.text }]} numberOfLines={1}>
                  {cleanProductName}
                </Text>
                <Text style={[styles.unitPriceText, { color: theme.textSecondary }]}>
                  {settings.currencySymbol}{unitPrice} / {unit}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: theme.surfaceSubtle }]}>
              <Ionicons name="close" size={20} color={theme.textSecondary} />
            </Pressable>
          </View>

          {/* Mode Switcher Tabs */}
          <View style={[styles.tabBar, { backgroundColor: theme.surfaceSubtle }]}>
            <Pressable
              onPress={() => setMode('weight')}
              style={[
                styles.tabBtn,
                mode === 'weight' && [styles.tabBtnActive, { backgroundColor: theme.surface }],
              ]}>
              <Ionicons
                name="scale"
                size={16}
                color={mode === 'weight' ? theme.primary : theme.textMuted}
              />
              <Text
                style={[
                  styles.tabBtnText,
                  { color: mode === 'weight' ? theme.primary : theme.textMuted },
                  mode === 'weight' && styles.tabBtnTextActive,
                ]}>
                {language === 'ur' ? 'وزن کے حساب سے' : `By Weight (${unit})`}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setMode('cash')}
              style={[
                styles.tabBtn,
                mode === 'cash' && [styles.tabBtnActive, { backgroundColor: theme.surface }],
              ]}>
              <Ionicons
                name="cash-outline"
                size={16}
                color={mode === 'cash' ? theme.primary : theme.textMuted}
              />
              <Text
                style={[
                  styles.tabBtnText,
                  { color: mode === 'cash' ? theme.primary : theme.textMuted },
                  mode === 'cash' && styles.tabBtnTextActive,
                ]}>
                {language === 'ur' ? 'روپوں کے حساب سے' : 'By Cash Amount'}
              </Text>
            </Pressable>
          </View>

          <ScrollView
            style={styles.contentScroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {mode === 'weight' ? (
              /* ── Mode 1: By Weight ── */
              <View style={styles.sectionWrap}>
                {/* Weight Input Box + Steppers */}
                <View style={styles.inputSteppersRow}>
                  <Pressable
                    onPress={() => handleStepWeight(-0.25)}
                    style={[styles.stepBtn, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
                    <Text style={[styles.stepBtnText, { color: theme.text }]}>-0.25</Text>
                  </Pressable>

                  <View style={[styles.weightInputBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <TextInput
                      style={[styles.weightInput, { color: theme.text }]}
                      keyboardType="decimal-pad"
                      value={weightStr}
                      onChangeText={(val) => {
                        setWeightStr(val);
                        const num = parseFloat(val) || 0;
                        setCashStr(Math.round(num * unitPrice).toString());
                      }}
                      selectTextOnFocus
                    />
                    <Text style={[styles.weightUnitSuffix, { color: theme.textMuted }]}>{unit}</Text>
                  </View>

                  <Pressable
                    onPress={() => handleStepWeight(0.25)}
                    style={[styles.stepBtn, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
                    <Text style={[styles.stepBtnText, { color: theme.text }]}>+0.25</Text>
                  </Pressable>
                </View>

                {/* Quick Fraction Presets */}
                <Text style={[styles.subHeading, { color: theme.textMuted }]}>
                  {language === 'ur' ? 'فوری وزن منتخب کریں:' : 'Quick weight shortcuts:'}
                </Text>
                <View style={styles.presetsGrid}>
                  {FRACTION_PRESETS.map((preset) => {
                    const isSelected = parsedWeight === preset.value;
                    return (
                      <Pressable
                        key={preset.value}
                        onPress={() => {
                          setWeightStr(preset.value.toString());
                          setCashStr(Math.round(preset.value * unitPrice).toString());
                        }}
                        style={[
                          styles.presetChip,
                          {
                            backgroundColor: isSelected ? theme.primaryLight : theme.surfaceSubtle,
                            borderColor: isSelected ? theme.primary : theme.border,
                          },
                        ]}>
                        <Text
                          style={[
                            styles.presetChipText,
                            {
                              color: isSelected ? theme.primaryDark : theme.text,
                              fontWeight: isSelected ? '700' : '500',
                            },
                          ]}>
                          {language === 'ur' ? preset.labelUrdu : preset.labelEn}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ) : (
              /* ── Mode 2: By Cash Amount ── */
              <View style={styles.sectionWrap}>
                {/* Cash Input Box */}
                <View style={[styles.cashInputBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <Text style={[styles.cashCurrencyPrefix, { color: theme.primary }]}>
                    {settings.currencySymbol}
                  </Text>
                  <TextInput
                    style={[styles.cashInput, { color: theme.text }]}
                    keyboardType="numeric"
                    placeholder="50"
                    placeholderTextColor={theme.textMuted}
                    value={cashStr}
                    onChangeText={(val) => {
                      setCashStr(val);
                      const num = parseFloat(val) || 0;
                      if (unitPrice > 0) {
                        const calculated = Math.round((num / unitPrice) * 1000) / 1000;
                        setWeightStr(calculated.toString());
                      }
                    }}
                    selectTextOnFocus
                    autoFocus
                  />
                </View>

                {/* Computed Weight Banner */}
                <View style={[styles.computedBanner, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
                  <Ionicons name="information-circle-outline" size={18} color={theme.primary} />
                  <Text style={[styles.computedBannerText, { color: theme.primaryDark }]}>
                    {language === 'ur'
                      ? `${settings.currencySymbol}${parsedCash} میں ${computedWeightFromCash} ${unit} بنتا ہے`
                      : `${settings.currencySymbol}${parsedCash} = ${computedWeightFromCash} ${unit} (${Math.round(computedWeightFromCash * 1000)}g)`}
                  </Text>
                </View>

                {/* Quick Cash Presets */}
                <Text style={[styles.subHeading, { color: theme.textMuted }]}>
                  {language === 'ur' ? 'عام نقد رقوم:' : 'Popular cash amounts:'}
                </Text>
                <View style={styles.presetsGrid}>
                  {CASH_PRESETS.map((amt) => {
                    const isSelected = parsedCash === amt;
                    return (
                      <Pressable
                        key={amt}
                        onPress={() => {
                          setCashStr(amt.toString());
                          if (unitPrice > 0) {
                            const calculated = Math.round((amt / unitPrice) * 1000) / 1000;
                            setWeightStr(calculated.toString());
                          }
                        }}
                        style={[
                          styles.presetChip,
                          {
                            backgroundColor: isSelected ? theme.primaryLight : theme.surfaceSubtle,
                            borderColor: isSelected ? theme.primary : theme.border,
                          },
                        ]}>
                        <Text
                          style={[
                            styles.presetChipText,
                            {
                              color: isSelected ? theme.primaryDark : theme.text,
                              fontWeight: isSelected ? '700' : '600',
                            },
                          ]}>
                          {settings.currencySymbol}{amt}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Summary Preview Box */}
            <View style={[styles.summaryCard, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                  {language === 'ur' ? 'مقدار / وزن:' : 'Selected Quantity:'}
                </Text>
                <Text style={[styles.summaryValue, { color: theme.text }]}>
                  {activeQuantity} {unit}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                  {language === 'ur' ? 'کل رقم:' : 'Total Price:'}
                </Text>
                <Text style={[styles.summaryTotalValue, { color: theme.primary }]}>
                  {settings.currencySymbol}{formatCompactPrice(activeTotal)}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Primary Action Button */}
          <Pressable
            onPress={handleApply}
            disabled={activeQuantity <= 0}
            style={({ pressed }) => [
              styles.applyBtn,
              { backgroundColor: theme.primary },
              activeQuantity <= 0 && { opacity: 0.5 },
              pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] },
            ]}>
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            <Text style={styles.applyBtnText}>
              {language === 'ur'
                ? `بل میں شامل کریں (${settings.currencySymbol}${formatCompactPrice(activeTotal)})`
                : `Apply to Bill (${settings.currencySymbol}${formatCompactPrice(activeTotal)})`}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalSheet: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    borderTopWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    maxHeight: '90%',
    ...Shadows.lg,
  },
  sheetHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    marginBottom: Spacing.sm,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    paddingRight: 8,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
  },
  unitPriceText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: BorderRadius.md,
    padding: 3,
    marginBottom: Spacing.md,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
    gap: 6,
  },
  tabBtnActive: {
    ...Shadows.sm,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tabBtnTextActive: {
    fontWeight: '700',
  },
  contentScroll: {
    maxHeight: 380,
  },
  sectionWrap: {
    gap: 12,
  },
  inputSteppersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepBtn: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  weightInputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    height: 50,
  },
  weightInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  weightUnitSuffix: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 4,
  },
  subHeading: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  presetChipText: {
    fontSize: 13,
  },
  cashInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    height: 56,
  },
  cashCurrencyPrefix: {
    fontSize: 22,
    fontWeight: '800',
    marginRight: 8,
  },
  cashInput: {
    flex: 1,
    fontSize: 26,
    fontWeight: '800',
  },
  computedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  computedBannerText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  summaryCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.sm,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    gap: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  summaryTotalValue: {
    fontSize: 17,
    fontWeight: '800',
  },
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    gap: 8,
    marginTop: Spacing.sm,
    ...Shadows.md,
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
