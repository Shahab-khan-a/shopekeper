import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useShop } from '@/context/ShopContext';
import { formatCompactPrice } from '@/utils/formatters';
import { toTitleCase } from '@/utils/datamuseSuggest';

interface CounterAlphaKeyboardProps {
  query: string;
  entryNum: number;
  currencySymbol: string;
  suggestions: string[];
  isSuggesting: boolean;
  onPressChar: (char: string) => void;
  onPressPriceDigit: (digit: string) => void;
  onBackspace: () => void;
  onClearWord: () => void;
  onSelectSuggestion: (word: string) => void;
  onCommitItemWithWord: (word: string) => void;
  onSwitchToPricePad: () => void;
}

const PRICE_DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const ROW_1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
const ROW_2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
const ROW_3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

/**
 * Soft, stylish hybrid counter keyboard for naming items + entering price seamlessly
 * without switching back and forth between keyboards.
 */
export const CounterAlphaKeyboard: React.FC<CounterAlphaKeyboardProps> = ({
  query,
  entryNum,
  currencySymbol,
  suggestions,
  isSuggesting,
  onPressChar,
  onPressPriceDigit,
  onBackspace,
  onClearWord,
  onSelectSuggestion,
  onCommitItemWithWord,
  onSwitchToPricePad,
}) => {
  const { settings, language } = useShop();
  const isUrdu = language === 'ur';
  const dark = settings.darkMode;

  const trayBg = dark ? '#0F172A' : '#F4F7FB';
  const trayBorder = dark ? 'rgba(255,255,255,0.08)' : 'rgba(148,163,184,0.2)';
  const keyBg = dark ? '#1E293B' : '#FFFFFF';
  const keyBorder = dark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.07)';
  const keyTextColor = dark ? '#F1F5F9' : '#1E293B';
  const softFnBg = dark ? '#172334' : '#E6ECF4';
  const priceKeyBg = dark ? 'rgba(56, 189, 248, 0.14)' : '#EAF4FF';
  const priceKeyBorder = dark ? 'rgba(56, 189, 248, 0.24)' : 'rgba(14, 165, 233, 0.18)';
  const priceKeyText = dark ? '#7DD3FC' : '#0369A1';

  const trimmedQuery = query.trim();
  const formattedTyped = toTitleCase(trimmedQuery) || trimmedQuery;
  const hasPrice = entryNum > 0;

  const renderLetterKey = (letter: string) => (
    <Pressable
      key={letter}
      onPress={() => onPressChar(letter)}
      hitSlop={3}
      accessibilityRole="button"
      accessibilityLabel={letter}
      style={({ pressed }) => [
        styles.letterKey,
        {
          backgroundColor: keyBg,
          borderColor: keyBorder,
        },
        pressed && [
          styles.keyPressed,
          { backgroundColor: dark ? '#293548' : '#EFF6FF' },
        ],
      ]}>
      <Text style={[styles.letterText, { color: keyTextColor }]}>{letter}</Text>
    </Pressable>
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: trayBg,
          borderColor: trayBorder,
        },
      ]}>
      {/* 1. Soft Predictive Suggestion Pills */}
      <View style={styles.predictiveStrip}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.predictiveContent}>
          {trimmedQuery.length > 0 && (
            <Pressable
              onPress={() =>
                hasPrice
                  ? onCommitItemWithWord(trimmedQuery)
                  : onSwitchToPricePad()
              }
              style={({ pressed }) => [
                styles.typedActionChip,
                {
                  backgroundColor: hasPrice ? '#10B981' : '#0EA5E9',
                },
                pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
              ]}>
              <Ionicons
                name={hasPrice ? 'add-circle' : 'pricetag'}
                size={14}
                color="#FFFFFF"
              />
              <Text style={styles.typedActionChipText} numberOfLines={1}>
                {hasPrice
                  ? `${isUrdu ? 'شامل' : 'Add'} "${formattedTyped}" · ${currencySymbol}${formatCompactPrice(entryNum)}`
                  : `"${formattedTyped}"`}
              </Text>
            </Pressable>
          )}

          {suggestions.map((word) => (
            <View
              key={word}
              style={[
                styles.suggestionChip,
                {
                  backgroundColor: keyBg,
                  borderColor: dark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
                },
              ]}>
              <Pressable
                onPress={() => onSelectSuggestion(word)}
                style={({ pressed }) => [
                  styles.suggestionWordBtn,
                  pressed && { opacity: 0.72 },
                ]}>
                <Text style={[styles.suggestionWordText, { color: keyTextColor }]}>
                  {word}
                </Text>
              </Pressable>

              {hasPrice && (
                <Pressable
                  onPress={() => onCommitItemWithWord(word)}
                  accessibilityRole="button"
                  accessibilityLabel={`Add ${word} to bill`}
                  style={({ pressed }) => [
                    styles.suggestionQuickAddBtn,
                    { backgroundColor: '#10B981' },
                    pressed && { opacity: 0.82 },
                  ]}>
                  <Ionicons name="add" size={14} color="#FFFFFF" />
                </Pressable>
              )}
            </View>
          ))}

          {isSuggesting && (
            <View style={styles.suggestSpinnerWrap}>
              <ActivityIndicator size="small" color="#0EA5E9" />
            </View>
          )}
        </ScrollView>
      </View>

      {/* 2. Built-in Soft Sky-Blue Price Number Row (No Keyboard Switch Needed!) */}
      <View style={styles.numberRow}>
        {PRICE_DIGITS.map((digit) => (
          <Pressable
            key={digit}
            onPress={() => onPressPriceDigit(digit)}
            hitSlop={2}
            accessibilityRole="button"
            accessibilityLabel={`Price digit ${digit}`}
            style={({ pressed }) => [
              styles.priceDigitKey,
              {
                backgroundColor: priceKeyBg,
                borderColor: priceKeyBorder,
              },
              pressed && styles.keyPressed,
            ]}>
            <Text style={[styles.priceDigitText, { color: priceKeyText }]}>
              {digit}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* 3. Calm Soft QWERTY Rows */}
      <View style={styles.keysGrid}>
        <View style={styles.keyRow}>{ROW_1.map(renderLetterKey)}</View>

        <View style={[styles.keyRow, styles.row2Stagger]}>
          {ROW_2.map(renderLetterKey)}
        </View>

        <View style={styles.keyRow}>
          <View style={styles.row3LeftSpacer} />

          {ROW_3.map(renderLetterKey)}

          <Pressable
            onPress={onBackspace}
            onLongPress={onClearWord}
            delayLongPress={300}
            accessibilityRole="button"
            accessibilityLabel={isUrdu ? 'حذف کریں' : 'Backspace'}
            style={({ pressed }) => [
              styles.backspaceKey,
              { backgroundColor: softFnBg },
              pressed && styles.keyPressed,
            ]}>
            <Ionicons name="backspace-outline" size={21} color={keyTextColor} />
          </Pressable>
        </View>

        {/* Bottom Thumb Row */}
        <View style={styles.keyRow}>
          <Pressable
            onPress={onSwitchToPricePad}
            accessibilityRole="button"
            accessibilityLabel={isUrdu ? 'بڑا قیمت پیڈ' : 'Open full price keypad'}
            style={({ pressed }) => [
              styles.priceSwitchKey,
              { backgroundColor: softFnBg },
              pressed && styles.keyPressed,
            ]}>
            <Text style={[styles.priceSwitchText, { color: keyTextColor }]}>
              123
            </Text>
          </Pressable>

          <Pressable
            onPress={() => onPressChar(' ')}
            accessibilityRole="button"
            accessibilityLabel="Space"
            style={({ pressed }) => [
              styles.spaceKey,
              {
                backgroundColor: keyBg,
                borderColor: keyBorder,
              },
              pressed && styles.keyPressed,
            ]}>
            <Text
              style={[
                styles.spaceLabel,
                { color: dark ? '#94A3B8' : '#64748B' },
              ]}>
              {isUrdu ? 'اسپیس' : 'space'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              hasPrice
                ? onCommitItemWithWord(trimmedQuery)
                : onSwitchToPricePad()
            }
            accessibilityRole="button"
            accessibilityLabel={
              hasPrice
                ? isUrdu
                  ? 'بل میں شامل کریں'
                  : 'Add item to bill'
                : isUrdu
                  ? 'قیمت درج کریں'
                  : 'Switch to price keypad'
            }
            style={({ pressed }) => [
              styles.primaryActionKey,
              {
                backgroundColor: hasPrice ? '#10B981' : '#0EA5E9',
              },
              pressed && { opacity: 0.88, transform: [{ scale: 0.97 }] },
            ]}>
            <Ionicons
              name={hasPrice ? 'add-circle' : 'keypad-outline'}
              size={16}
              color="#FFFFFF"
            />
            <Text style={styles.primaryActionText} numberOfLines={1}>
              {hasPrice
                ? `${isUrdu ? 'شامل' : 'Add'} ${currencySymbol}${formatCompactPrice(entryNum)}`
                : isUrdu
                  ? 'قیمت لکھیں'
                  : 'Enter Price'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 314,
    borderRadius: 22,
    borderCurve: 'continuous',
    borderWidth: 1,
    paddingHorizontal: 4,
    paddingTop: 7,
    paddingBottom: 7,
    gap: 5,
  },
  predictiveStrip: {
    height: 36,
    justifyContent: 'center',
  },
  predictiveContent: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 2,
  },
  typedActionChip: {
    height: 32,
    borderRadius: 999,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    maxWidth: 215,
  },
  typedActionChipText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  suggestionChip: {
    height: 32,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  suggestionWordBtn: {
    height: '100%',
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  suggestionWordText: {
    fontSize: 13,
    fontWeight: '600',
  },
  suggestionQuickAddBtn: {
    width: 30,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestSpinnerWrap: {
    paddingHorizontal: 6,
    justifyContent: 'center',
  },
  numberRow: {
    height: 38,
    flexDirection: 'row',
    gap: 3,
  },
  priceDigitKey: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceDigitText: {
    fontSize: 15.5,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  keysGrid: {
    flex: 1,
    gap: 6,
  },
  keyRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 3,
  },
  row2Stagger: {
    paddingHorizontal: 10,
  },
  row3LeftSpacer: {
    flex: 0.45,
  },
  letterKey: {
    flex: 1,
    minHeight: 44,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1.5,
  },
  keyPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.94 }],
  },
  letterText: {
    fontSize: 18,
    fontWeight: '600',
  },
  backspaceKey: {
    flex: 1.55,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceSwitchKey: {
    flex: 1.35,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceSwitchText: {
    fontSize: 14,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  spaceKey: {
    flex: 2.5,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 1.5,
  },
  spaceLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  primaryActionKey: {
    flex: 2.15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 8,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
});
