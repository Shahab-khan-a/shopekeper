import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartItem } from '@/types';
import { Colors, Spacing, Shadows } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';
import { formatCompactPrice } from '@/utils/formatters';

interface QuickLabelOption {
  id: string;
  en: string;
  ur: string;
}

const QUICK_LABELS: QuickLabelOption[] = [
  { id: 'milk', en: 'Milk', ur: 'دودھ' },
  { id: 'eggs', en: 'Eggs', ur: 'انڈے' },
  { id: 'bread', en: 'Bread', ur: 'ڈبل روٹی' },
  { id: 'sugar', en: 'Sugar', ur: 'چینی' },
  { id: 'flour', en: 'Flour', ur: 'آٹا' },
  { id: 'tea', en: 'Tea', ur: 'چائے' },
  { id: 'cold_drink', en: 'Cold Drink', ur: 'کولڈ ڈرنک' },
  { id: 'snacks', en: 'Snacks', ur: 'بسکٹ/چپس' },
];

interface QuickBillPadProps {
  cart: CartItem[];
  cartTotal: number;
  entry: string;
  onChangeEntry: (next: string) => void;
  onAddAmount: (amount: number, label?: { en: string; ur: string }) => void;
  onRemoveCartItem: (productId: string) => void;
  onInstantCash: (pendingAmount: number, label?: { en: string; ur: string }) => void;
  onStartUdhaar: (pendingAmount: number, label?: { en: string; ur: string }) => void;
  onOpenOptions: (pendingAmount: number, label?: { en: string; ur: string }) => void;
  onOpenScanner: () => void;
  onClearAll: () => void;
  isProcessing?: boolean;
}

/**
 * Calculator-first billing pad tailored for small shop counters.
 * Lets shopkeepers ring up single or multi-item bills in 3 seconds
 * with zero pre-loaded inventory required.
 */
export const QuickBillPad: React.FC<QuickBillPadProps> = ({
  cart,
  cartTotal,
  entry,
  onChangeEntry,
  onAddAmount,
  onRemoveCartItem,
  onInstantCash,
  onStartUdhaar,
  onOpenOptions,
  onOpenScanner,
  onClearAll,
  isProcessing = false,
}) => {
  const { settings, language } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const isUrdu = language === 'ur';
  const softBorder = settings.darkMode
    ? 'rgba(255,255,255,0.1)'
    : 'rgba(148, 163, 184, 0.25)';

  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);

  const selectedLabel = QUICK_LABELS.find((l) => l.id === selectedLabelId);
  const entryNum = Math.round(parseFloat(entry) || 0);
  const liveTotal = cartTotal + entryNum;
  const hasBillValue = liveTotal > 0;

  const appendDigit = (digit: string) => {
    if (entry.length >= 7) return;
    if (digit === '00') {
      if (!entry || entry === '0') return;
      if (entry.length >= 6) return;
      onChangeEntry(entry + '00');
      return;
    }
    if (!entry || entry === '0') {
      if (digit === '0') {
        onChangeEntry('0');
        return;
      }
      onChangeEntry(digit);
      return;
    }
    onChangeEntry(entry + digit);
  };

  const handleBackspace = () => {
    if (!entry) return;
    onChangeEntry(entry.slice(0, -1));
  };

  const handleClearPress = () => {
    if (entry) {
      onChangeEntry('');
      return;
    }
    if (cart.length > 0) {
      onClearAll();
    }
  };

  const handleAddTap = () => {
    if (entryNum <= 0) return;
    onAddAmount(entryNum, selectedLabel ? { en: selectedLabel.en, ur: selectedLabel.ur } : undefined);
    onChangeEntry('');
    setSelectedLabelId(null);
  };

  const labelPayload = selectedLabel
    ? { en: selectedLabel.en, ur: selectedLabel.ur }
    : undefined;

  const getItemChipText = (it: CartItem) => {
    const rawName =
      isUrdu && it.product.nameUrdu ? it.product.nameUrdu : it.product.name;
    const shortName = rawName.length > 14 ? `${rawName.slice(0, 12)}…` : rawName;
    const qtyTag = it.quantity > 1 ? `×${it.quantity}` : '';
    return `${shortName}${qtyTag} ${settings.currencySymbol}${formatCompactPrice(it.total)}`;
  };

  return (
    <View style={styles.root}>
      <View style={styles.mainContent}>
        {/* 1. Calculator Display & Running Bill Tape */}
        <View
          style={[
            styles.displayCard,
            { backgroundColor: theme.card, borderColor: softBorder },
          ]}>
          {/* Running bill items chips (if multiple items added) */}
          {cart.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tapeRow}>
              {cart.map((it) => (
                <Pressable
                  key={it.product.id}
                  onPress={() => onRemoveCartItem(it.product.id)}
                  hitSlop={4}
                  style={({ pressed }) => [
                    styles.tapeChip,
                    {
                      backgroundColor: settings.darkMode
                        ? 'rgba(16,185,129,0.16)'
                        : '#ECFDF5',
                      borderColor: settings.darkMode
                        ? 'rgba(16,185,129,0.35)'
                        : '#A7F3D0',
                    },
                    pressed && { opacity: 0.7 },
                  ]}>
                  <Text
                    style={[styles.tapeChipText, { color: theme.primaryDark }]}
                    numberOfLines={1}>
                    {getItemChipText(it)}
                  </Text>
                  <Ionicons name="close" size={12} color={theme.primaryDark} />
                </Pressable>
              ))}
            </ScrollView>
          )}

          {/* Main numeric readout */}
          <View style={styles.readoutRow}>
            <View style={styles.readoutLeft}>
              <Text style={[styles.readoutHint, { color: theme.textMuted }]}>
                {cart.length > 0 && entryNum > 0
                  ? `${settings.currencySymbol}${cartTotal.toLocaleString()} + ${settings.currencySymbol}${entryNum.toLocaleString()}`
                  : cart.length > 0
                    ? `${cart.length} ${isUrdu ? 'اشیاء بل میں' : cart.length === 1 ? 'item in bill' : 'items in bill'}`
                    : selectedLabel
                      ? isUrdu
                        ? selectedLabel.ur
                        : selectedLabel.en
                      : isUrdu
                        ? 'رقم درج کریں'
                        : 'Type amount'}
              </Text>
              <View style={styles.bigAmountRow}>
                <Text style={[styles.currencyTag, { color: theme.primary }]}>
                  {settings.currencySymbol}
                </Text>
                <Text
                  style={[
                    styles.bigAmountText,
                    { color: hasBillValue ? theme.text : theme.textMuted },
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.55}>
                  {(entryNum > 0 ? entryNum : cartTotal > 0 ? cartTotal : 0).toLocaleString()}
                </Text>
              </View>
            </View>

            {/* Live Combined Total Badge + Options trigger when items or entry present */}
            {hasBillValue && (
              <Pressable
                onPress={() => onOpenOptions(entryNum, labelPayload)}
                hitSlop={6}
                accessibilityRole="button"
                accessibilityLabel={isUrdu ? 'بل تفصیل و رعایت' : 'View bill & discount'}
                style={({ pressed }) => [
                  styles.optionsChip,
                  {
                    backgroundColor: theme.surfaceSubtle,
                    borderColor: softBorder,
                  },
                  pressed && { opacity: 0.8 },
                ]}>
                <Ionicons name="options-outline" size={14} color={theme.textSecondary} />
                <Text style={[styles.optionsChipText, { color: theme.textSecondary }]}>
                  {isUrdu ? 'رعایت / بل' : 'Options'}
                </Text>
              </Pressable>
            )}
          </View>

          {cart.length > 0 && entryNum > 0 && (
            <View style={[styles.combinedBar, { borderTopColor: softBorder }]}>
              <Text style={[styles.combinedLabel, { color: theme.textMuted }]}>
                {isUrdu ? 'نیا کل بل:' : 'New Total:'}
              </Text>
              <Text style={[styles.combinedValue, { color: theme.primary }]}>
                {settings.currencySymbol} {liveTotal.toLocaleString()}
              </Text>
            </View>
          )}
        </View>

        {/* 2. Optional 1-Tap Item Label Strip */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.labelsScroll}
          contentContainerStyle={styles.labelsRow}>
          {QUICK_LABELS.map((item) => {
            const active = selectedLabelId === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() =>
                  setSelectedLabelId((prev) => (prev === item.id ? null : item.id))
                }
                style={({ pressed }) => [
                  styles.labelChip,
                  {
                    backgroundColor: active ? theme.primaryLight : theme.card,
                    borderColor: active ? theme.primary : softBorder,
                  },
                  pressed && { opacity: 0.8 },
                ]}>
                <Text
                  style={[
                    styles.labelChipText,
                    { color: active ? theme.primaryDark : theme.textSecondary },
                  ]}>
                  {isUrdu ? item.ur : item.en}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* 3. Large Counter Calculator Grid (Casio Style: 7-8-9 Top) */}
        <View style={styles.keypadGrid}>
          {/* Left 3 Digit Columns */}
          <View style={styles.digitsCol}>
            {[
              ['7', '8', '9'],
              ['4', '5', '6'],
              ['1', '2', '3'],
              ['00', '0', 'BACK'],
            ].map((row, rIdx) => (
              <View key={rIdx} style={styles.keyRow}>
                {row.map((key) => {
                  const isBack = key === 'BACK';
                  return (
                    <Pressable
                      key={key}
                      onPress={() =>
                        isBack ? handleBackspace() : appendDigit(key)
                      }
                      accessibilityRole="button"
                      accessibilityLabel={isBack ? 'Backspace' : key}
                      style={({ pressed }) => [
                        styles.digitKey,
                        {
                          backgroundColor: isBack ? theme.surfaceSubtle : theme.card,
                          borderColor: softBorder,
                        },
                        pressed && { opacity: 0.72, transform: [{ scale: 0.96 }] },
                      ]}>
                      {isBack ? (
                        <Ionicons name="backspace-outline" size={22} color={theme.text} />
                      ) : (
                        <Text style={[styles.digitKeyText, { color: theme.text }]}>
                          {key}
                        </Text>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>

          {/* Right Action Column: Clear, Scan, Giant + Add */}
          <View style={styles.sideCol}>
            <Pressable
              onPress={handleClearPress}
              accessibilityRole="button"
              accessibilityLabel={entry ? 'Clear amount' : 'Clear bill'}
              style={({ pressed }) => [
                styles.sideSmallKey,
                {
                  backgroundColor: settings.darkMode
                    ? 'rgba(239, 68, 68, 0.16)'
                    : '#FEE2E2',
                  borderColor: settings.darkMode
                    ? 'rgba(239, 68, 68, 0.35)'
                    : '#FECACA',
                },
                pressed && { opacity: 0.75, transform: [{ scale: 0.96 }] },
              ]}>
              <Text style={[styles.clearKeyText, { color: theme.danger }]}>
                {entry ? 'C' : cart.length > 0 ? (isUrdu ? 'خالی' : 'CLR') : 'C'}
              </Text>
            </Pressable>

            <Pressable
              onPress={onOpenScanner}
              accessibilityRole="button"
              accessibilityLabel={isUrdu ? 'بارکوڈ سکین کریں' : 'Scan barcode'}
              style={({ pressed }) => [
                styles.sideSmallKey,
                {
                  backgroundColor: theme.card,
                  borderColor: softBorder,
                },
                pressed && { opacity: 0.75, transform: [{ scale: 0.96 }] },
              ]}>
              <Ionicons name="barcode-outline" size={22} color={theme.primary} />
            </Pressable>

            <Pressable
              onPress={handleAddTap}
              disabled={entryNum <= 0}
              accessibilityRole="button"
              accessibilityLabel={isUrdu ? 'بل میں جمع کریں' : 'Add amount to bill'}
              style={({ pressed }) => [
                styles.plusTallKey,
                {
                  backgroundColor: entryNum > 0 ? '#0284C7' : theme.surfaceSubtle,
                  borderColor: entryNum > 0 ? '#0284C7' : softBorder,
                },
                pressed && entryNum > 0 && { opacity: 0.85, transform: [{ scale: 0.97 }] },
              ]}>
              <Ionicons
                name="add"
                size={30}
                color={entryNum > 0 ? '#FFFFFF' : theme.textMuted}
              />
              <Text
                style={[
                  styles.plusTallLabel,
                  { color: entryNum > 0 ? '#FFFFFF' : theme.textMuted },
                ]}>
                {isUrdu ? 'جمع' : 'Add'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* 4. Two Big Checkout Buttons Pinned at Bottom */}
      <View
        style={[
          styles.bottomBar,
          { backgroundColor: theme.background, borderTopColor: softBorder },
        ]}>
        <Pressable
          onPress={() => onStartUdhaar(entryNum, labelPayload)}
          disabled={!hasBillValue || isProcessing}
          accessibilityRole="button"
          accessibilityLabel={isUrdu ? 'ادھار بل' : 'Udhaar credit bill'}
          style={({ pressed }) => [
            styles.udhaarActionBtn,
            {
              backgroundColor: hasBillValue
                ? settings.darkMode
                  ? 'rgba(239, 68, 68, 0.18)'
                  : '#FEE2E2'
                : theme.surfaceSubtle,
              borderColor: hasBillValue ? theme.danger : softBorder,
            },
            pressed && hasBillValue && { opacity: 0.86, transform: [{ scale: 0.98 }] },
          ]}>
          <Ionicons
            name="book-outline"
            size={20}
            color={hasBillValue ? theme.danger : theme.textMuted}
          />
          <Text
            style={[
              styles.udhaarActionText,
              { color: hasBillValue ? theme.danger : theme.textMuted },
            ]}
            numberOfLines={1}>
            {isUrdu ? 'ادھار' : 'Udhaar'}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onInstantCash(entryNum, labelPayload)}
          disabled={!hasBillValue || isProcessing}
          accessibilityRole="button"
          accessibilityLabel={isUrdu ? 'نقد بل مکمل کریں' : 'Complete cash sale'}
          style={({ pressed }) => [
            styles.cashActionBtn,
            {
              backgroundColor: hasBillValue ? theme.primary : theme.border,
            },
            pressed && hasBillValue && { opacity: 0.9, transform: [{ scale: 0.985 }] },
          ]}>
          {isProcessing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons
              name="checkmark-circle"
              size={22}
              color={hasBillValue ? '#FFFFFF' : theme.textMuted}
            />
          )}
          <Text
            style={[
              styles.cashActionText,
              { color: hasBillValue ? '#FFFFFF' : theme.textMuted },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}>
            {hasBillValue
              ? `${isUrdu ? 'نقد' : 'Cash'} · ${settings.currencySymbol}${liveTotal.toLocaleString()}`
              : isUrdu
                ? 'رقم درج کریں'
                : 'Enter Amount'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'space-between',
    maxWidth: 640,
    width: '100%',
    marginHorizontal: 'auto',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: 6,
    gap: 10,
    justifyContent: 'space-between',
  },
  displayCard: {
    borderRadius: 20,
    borderCurve: 'continuous',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
    ...Shadows.sm,
  },
  tapeRow: {
    gap: 6,
    paddingBottom: 2,
  },
  tapeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  tapeChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  readoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  readoutLeft: {
    flex: 1,
    minWidth: 0,
  },
  readoutHint: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  bigAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
  },
  currencyTag: {
    fontSize: 20,
    fontWeight: '800',
  },
  bigAmountText: {
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
    flexShrink: 1,
  },
  optionsChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
  },
  optionsChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  combinedBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 7,
  },
  combinedLabel: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  combinedValue: {
    fontSize: 15,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },

  labelsScroll: {
    flexGrow: 0,
  },
  labelsRow: {
    gap: 7,
    paddingVertical: 2,
  },
  labelChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
  },
  labelChipText: {
    fontSize: 12.5,
    fontWeight: '700',
  },

  keypadGrid: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 220,
    maxHeight: 320,
  },
  digitsCol: {
    flex: 3,
    gap: 8,
  },
  keyRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  digitKey: {
    flex: 1,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  digitKeyText: {
    fontSize: 23,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  sideCol: {
    flex: 1,
    gap: 8,
  },
  sideSmallKey: {
    flex: 1,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  clearKeyText: {
    fontSize: 17,
    fontWeight: '900',
  },
  plusTallKey: {
    flex: 2.1,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  plusTallLabel: {
    fontSize: 12.5,
    fontWeight: '800',
  },

  bottomBar: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: Spacing.lg,
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: 1,
  },
  udhaarActionBtn: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  udhaarActionText: {
    fontSize: 16,
    fontWeight: '800',
  },
  cashActionBtn: {
    flex: 2,
    height: 54,
    borderRadius: 16,
    borderCurve: 'continuous',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 14,
  },
  cashActionText: {
    fontSize: 17,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
});
