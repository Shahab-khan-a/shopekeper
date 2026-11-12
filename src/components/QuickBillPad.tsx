import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartItem } from '@/types';
import { Colors, Spacing } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';
import { formatCompactPrice } from '@/utils/formatters';
import {
  fetchDatamuseSuggestions,
  getRecentCachedWords,
  hydrateWordCache,
  rememberWords,
  searchLocalWords,
  toTitleCase,
} from '@/utils/datamuseSuggest';
import { CounterAlphaKeyboard } from '@/components/CounterAlphaKeyboard';

interface QuickBillPadProps {
  cart: CartItem[];
  cartTotal: number;
  entry: string;
  onChangeEntry: (next: string) => void;
  onAddAmount: (amount: number, label?: { en: string; ur: string }) => void;
  onRemoveCartItem: (productId: string) => void;
  onInstantCash: (pendingAmount: number) => void;
  onStartUdhaar: (pendingAmount: number) => void;
  onOpenScanner: () => void;
  onClearAll: () => void;
  isProcessing?: boolean;
}

/**
 * Pure, intuitive receipt-first counter pad.
 * Top shows confirmed added items + TOTAL; middle holds a clean white item name search bar
 * (with online Datamuse suggestions and seamless offline fallback) + live typed price;
 * bottom holds a clean keypad + Udhaar / Cash actions.
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
  onOpenScanner,
  onClearAll,
  isProcessing = false,
}) => {
  const { settings, language } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const isUrdu = language === 'ur';
  const softBorder = settings.darkMode
    ? 'rgba(255,255,255,0.1)'
    : 'rgba(148, 163, 184, 0.28)';
  const dashedLineColor = settings.darkMode
    ? 'rgba(148, 163, 184, 0.28)'
    : 'rgba(100, 116, 139, 0.28)';

  const receiptScrollRef = useRef<ScrollView>(null);

  const [itemQuery, setItemQuery] = useState('');
  const [activePad, setActivePad] = useState<'price' | 'alpha'>('price');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [quickChips, setQuickChips] = useState<string[]>(() =>
    getRecentCachedWords(7)
  );
  const [isSuggesting, setIsSuggesting] = useState(false);

  // Smooth fade + gentle slide when flipping between Price (123) and Item Name (QWERTY) pads
  const padTransition = useRef(new Animated.Value(0)).current;
  const cursorOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(padTransition, {
      toValue: activePad === 'alpha' ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [activePad, padTransition]);

  useEffect(() => {
    if (activePad !== 'alpha') {
      cursorOpacity.setValue(0);
      return;
    }
    cursorOpacity.setValue(1);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: 480,
          useNativeDriver: true,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 480,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [activePad, cursorOpacity]);

  // Hydrate persistent word dictionary on mount so local search is 0ms
  useEffect(() => {
    hydrateWordCache().then(() => {
      setQuickChips(getRecentCachedWords(7));
    });
  }, []);

  // Local-first lookup (including quick starter chips when empty) + online Datamuse enrichment
  useEffect(() => {
    if (activePad !== 'alpha') return;

    const trimmed = itemQuery.trim();
    if (trimmed.length === 0) {
      setSuggestions(getRecentCachedWords(7));
      setIsSuggesting(false);
      return;
    }

    const lowerTrimmed = trimmed.toLowerCase();
    const localMatches = searchLocalWords(trimmed, 7).filter(
      (w) => w.toLowerCase() !== lowerTrimmed
    );
    setSuggestions(localMatches);

    if (trimmed.length < 2) {
      setIsSuggesting(false);
      return;
    }

    const controller = new AbortController();
    const debounceId = setTimeout(async () => {
      setIsSuggesting(true);
      const apiWords = await fetchDatamuseSuggestions(trimmed, controller.signal, 6);
      if (controller.signal.aborted) return;

      if (apiWords.length > 0) {
        const seen = new Set<string>([lowerTrimmed]);
        const merged: string[] = [];

        for (const word of [...localMatches, ...apiWords]) {
          const key = word.toLowerCase();
          if (seen.has(key)) continue;
          seen.add(key);
          merged.push(word);
          if (merged.length >= 7) break;
        }
        setSuggestions(merged);
      }
      setIsSuggesting(false);
    }, 160);

    return () => {
      clearTimeout(debounceId);
      controller.abort();
    };
  }, [itemQuery, activePad]);

  const handleAlphaChar = (char: string) => {
    setItemQuery((prev) => {
      if (prev.length >= 34) return prev;
      if (char === ' ') {
        if (!prev || prev.endsWith(' ')) return prev;
        return prev + ' ';
      }
      if (char === '/') {
        if (!prev || prev.endsWith('/') || prev.endsWith(' ')) return prev;
        return prev + '/';
      }
      const prevChar = prev.slice(-1);
      const shouldCap = prev.length === 0 || prevChar === ' ' || prevChar === '/';
      const nextChar = shouldCap ? char.toUpperCase() : char.toLowerCase();
      return prev + nextChar;
    });
  };

  const handleAlphaBackspace = () => {
    setItemQuery((prev) => prev.slice(0, -1));
  };

  const handleAlphaClear = () => {
    setItemQuery('');
  };

  const handleSelectSuggestion = (word: string) => {
    setItemQuery(word);
  };

  const handleAddWithWord = (rawLabel: string) => {
    const clean = toTitleCase(rawLabel);
    if (entryNum <= 0) {
      setActivePad('price');
      return;
    }
    if (clean) {
      rememberWords([clean]);
      setQuickChips(getRecentCachedWords(7));
      onAddAmount(entryNum, { en: clean, ur: clean });
    } else {
      onAddAmount(entryNum);
    }
    onChangeEntry('');
    setItemQuery('');
    setActivePad('price');
  };

  const entryNum = Math.round(parseFloat(entry) || 0);
  // Total only counts items explicitly added to the bill (never unconfirmed typing)
  const confirmedTotal = cartTotal;
  const hasConfirmedBill = cart.length > 0 && confirmedTotal > 0;
  const totalCartUnits = cart.reduce(
    (sum, item) => sum + (Number.isInteger(item.quantity) ? item.quantity : 1),
    0
  );

  // Auto-scroll receipt down smoothly as confirmed items are added
  useEffect(() => {
    const timer = setTimeout(() => {
      receiptScrollRef.current?.scrollToEnd({ animated: true });
    }, 60);
    return () => clearTimeout(timer);
  }, [cart.length]);

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

  const handleClearBillAll = () => {
    onChangeEntry('');
    setItemQuery('');
    setSuggestions([]);
    if (cart.length > 0) {
      onClearAll();
    }
  };

  const handleAddTap = () => {
    if (entryNum <= 0) return;
    handleAddWithWord(itemQuery);
  };

  const getCleanItemName = (it: CartItem) => {
    if (it.product.id.startsWith('custom-') && it.product.name === 'Counter Item') {
      return isUrdu ? 'آئٹم' : 'Item';
    }
    const raw =
      isUrdu && it.product.nameUrdu ? it.product.nameUrdu : it.product.name;
    return raw.replace(/\s*\([\u0600-\u06FF\s/]+\)$/, '').trim();
  };

  const formatQtyBadge = (it: CartItem) => {
    if (it.product.unit && it.product.unit !== 'piece' && !Number.isInteger(it.quantity)) {
      return `×${it.quantity}${it.product.unit}`;
    }
    return `×${it.quantity}`;
  };

  const renderKeypadButton = (key: string) => {
    if (key === 'BACK') {
      return (
        <Pressable
          key="BACK"
          onPress={handleBackspace}
          accessibilityRole="button"
          accessibilityLabel={isUrdu ? 'حذف کریں' : 'Backspace'}
          style={({ pressed }) => [
            styles.keypadBtn,
            {
              backgroundColor: settings.darkMode ? '#1A2436' : '#E2E8F0',
              borderColor: softBorder,
            },
            pressed && styles.keyPressed,
          ]}>
          <Ionicons name="backspace-outline" size={22} color={theme.text} />
        </Pressable>
      );
    }

    if (key === 'CLR') {
      const canClear = entry.length > 0 || cart.length > 0;
      const clearLabel = entry
        ? 'C'
        : cart.length > 0
          ? isUrdu
            ? 'خالی'
            : 'CLR'
          : 'C';
      return (
        <Pressable
          key="CLR"
          onPress={handleClearPress}
          disabled={!canClear}
          accessibilityRole="button"
          accessibilityLabel={entry ? 'Clear amount' : 'Clear bill'}
          style={({ pressed }) => [
            styles.keypadBtn,
            {
              backgroundColor: canClear
                ? settings.darkMode
                  ? 'rgba(239, 68, 68, 0.18)'
                  : '#FEE2E2'
                : theme.surfaceSubtle,
              borderColor: canClear
                ? settings.darkMode
                  ? 'rgba(248, 113, 113, 0.35)'
                  : '#FECACA'
                : softBorder,
            },
            pressed && canClear && styles.keyPressed,
          ]}>
          <Text
            style={[
              styles.clrKeyText,
              { color: canClear ? theme.danger : theme.textMuted },
            ]}>
            {clearLabel}
          </Text>
        </Pressable>
      );
    }

    if (key === 'SCAN') {
      return (
        <Pressable
          key="SCAN"
          onPress={onOpenScanner}
          accessibilityRole="button"
          accessibilityLabel={isUrdu ? 'بارکوڈ اسکین' : 'Scan barcode'}
          style={({ pressed }) => [
            styles.keypadBtn,
            {
              backgroundColor: settings.darkMode
                ? 'rgba(16, 185, 129, 0.16)'
                : '#ECFDF5',
              borderColor: settings.darkMode
                ? 'rgba(52, 211, 153, 0.32)'
                : 'rgba(5, 150, 105, 0.25)',
            },
            pressed && styles.keyPressed,
          ]}>
          <Ionicons name="barcode-outline" size={20} color={theme.primary} />
          <Text style={[styles.scanKeySub, { color: theme.primary }]}>
            {isUrdu ? 'اسکین' : 'Scan'}
          </Text>
        </Pressable>
      );
    }

    return (
      <Pressable
        key={key}
        onPress={() => appendDigit(key)}
        accessibilityRole="button"
        accessibilityLabel={key}
        style={({ pressed }) => [
          styles.keypadBtn,
          {
            backgroundColor: theme.card,
            borderColor: softBorder,
          },
          pressed && styles.keyPressed,
        ]}>
        <Text style={[styles.digitKeyText, { color: theme.text }]}>{key}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.root}>
      <View style={styles.mainContent}>
        {/* 1. Paper-Style Live Bill Receipt (Confirmed Added Items Only) */}
        <View
          style={[
            styles.receiptCard,
            {
              backgroundColor: settings.darkMode ? '#111C2D' : '#FFFFFF',
              borderColor: hasConfirmedBill
                ? settings.darkMode
                  ? 'rgba(52, 211, 153, 0.32)'
                  : 'rgba(5, 150, 105, 0.25)'
                : softBorder,
            },
          ]}>
          {/* Receipt Header */}
          <View style={styles.receiptHeader}>
            <View style={styles.receiptTitleGroup}>
              <Ionicons
                name="receipt-outline"
                size={15}
                color={hasConfirmedBill ? theme.primary : theme.textMuted}
              />
              <Text style={[styles.receiptTitle, { color: theme.textSecondary }]}>
                {isUrdu ? 'بل رسید' : 'BILL RECEIPT'}
              </Text>
              {cart.length > 0 && (
                <View
                  style={[
                    styles.receiptCountBadge,
                    {
                      backgroundColor: settings.darkMode
                        ? 'rgba(16, 185, 129, 0.16)'
                        : '#ECFDF5',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.receiptCountText,
                      { color: settings.darkMode ? '#6EE7B7' : '#047857' },
                    ]}>
                    {totalCartUnits}{' '}
                    {isUrdu
                      ? 'آئٹم'
                      : totalCartUnits === 1
                        ? 'item'
                        : 'items'}
                  </Text>
                </View>
              )}
            </View>

            {(cart.length > 0 || entryNum > 0) && (
              <Pressable
                onPress={handleClearBillAll}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={isUrdu ? 'بل صاف کریں' : 'Clear receipt'}
                style={({ pressed }) => [
                  styles.clearReceiptBtn,
                  {
                    backgroundColor: settings.darkMode
                      ? 'rgba(239, 68, 68, 0.14)'
                      : '#FEF2F2',
                  },
                  pressed && { opacity: 0.75 },
                ]}>
                <Ionicons name="trash-outline" size={12} color={theme.danger} />
                <Text style={[styles.clearReceiptText, { color: theme.danger }]}>
                  {isUrdu ? 'خالی' : 'Clear'}
                </Text>
              </Pressable>
            )}
          </View>

          <View style={[styles.dashedRule, { borderBottomColor: dashedLineColor }]} />

          {/* Column Labels when confirmed lines exist */}
          {cart.length > 0 && (
            <View style={styles.colsHeader}>
              <Text style={[styles.colHeadItem, { color: theme.textMuted }]}>
                {isUrdu ? 'تفصیل' : 'ITEM'}
              </Text>
              <Text style={[styles.colHeadQty, { color: theme.textMuted }]}>
                {isUrdu ? 'تعداد' : 'QTY'}
              </Text>
              <Text style={[styles.colHeadAmt, { color: theme.textMuted }]}>
                {isUrdu ? 'رقم' : 'AMOUNT'}
              </Text>
            </View>
          )}

          {/* Scrollable Confirmed Receipt Lines */}
          <ScrollView
            ref={receiptScrollRef}
            style={styles.receiptLinesScroll}
            contentContainerStyle={
              cart.length === 0
                ? styles.receiptEmptyContainer
                : styles.receiptLinesContent
            }
            showsVerticalScrollIndicator={false}>
            {cart.length === 0 ? (
              <View style={styles.receiptEmptyInner}>
                <Text style={[styles.receiptEmptyTitle, { color: theme.textMuted }]}>
                  {entryNum > 0
                    ? isUrdu
                      ? `بل میں شامل کرنے کے لیے نیچے "شامل +${entryNum}" دبائیں`
                      : `Tap "Add ${settings.currencySymbol}${entryNum}" below to add to bill`
                    : isUrdu
                      ? 'نیچے قیمت لکھ کر شامل کریں یا دائیں طرف سے اشیاء لیں'
                      : 'Type price & tap Add below, or pick items from right side'}
                </Text>
              </View>
            ) : (
              cart.map((it, idx) => (
                <View
                  key={it.product.id}
                  style={[
                    styles.receiptLineRow,
                    {
                      borderBottomColor: settings.darkMode
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(148, 163, 184, 0.14)',
                    },
                  ]}>
                  <Text style={[styles.lineNum, { color: theme.textMuted }]}>
                    {idx + 1}.
                  </Text>
                  <Text
                    style={[styles.lineName, { color: theme.text }]}
                    numberOfLines={1}>
                    {getCleanItemName(it)}
                  </Text>
                  <Text style={[styles.lineQty, { color: theme.textSecondary }]}>
                    {formatQtyBadge(it)}
                  </Text>
                  <Text style={[styles.linePrice, { color: theme.text }]}>
                    {settings.currencySymbol}
                    {formatCompactPrice(it.total)}
                  </Text>
                  <Pressable
                    onPress={() => onRemoveCartItem(it.product.id)}
                    hitSlop={6}
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${getCleanItemName(it)}`}
                    style={({ pressed }) => [
                      styles.lineRemoveBtn,
                      pressed && { opacity: 0.65 },
                    ]}>
                    <Ionicons
                      name="close-circle"
                      size={16}
                      color={settings.darkMode ? '#64748B' : '#94A3B8'}
                    />
                  </Pressable>
                </View>
              ))
            )}
          </ScrollView>

          <View style={[styles.dashedRule, { borderBottomColor: dashedLineColor }]} />

          {/* Receipt Total Strip (Added Items Only) */}
          <View style={styles.receiptTotalRow}>
            <Text style={[styles.receiptTotalLabel, { color: theme.textSecondary }]}>
              {isUrdu ? 'کل بل' : 'TOTAL'}
            </Text>
            <View style={styles.receiptTotalAmountWrap}>
              <Text
                style={[
                  styles.receiptCurrency,
                  { color: hasConfirmedBill ? theme.primary : theme.textMuted },
                ]}>
                {settings.currencySymbol}
              </Text>
              <Text
                style={[
                  styles.receiptTotalValue,
                  { color: hasConfirmedBill ? theme.text : theme.textMuted },
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.65}>
                {confirmedTotal.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* 2. Clean White Item Name Bar (Custom QWERTY Trigger) + Price Switch Pill */}
        <View style={styles.entryRow}>
          <Pressable
            onPress={() => setActivePad('alpha')}
            accessibilityRole="button"
            accessibilityLabel={isUrdu ? 'آئٹم کا نام لکھیں' : 'Type item name'}
            style={({ pressed }) => [
              styles.whiteSearchBox,
              {
                borderColor:
                  activePad === 'alpha'
                    ? '#0284C7'
                    : settings.darkMode
                      ? 'rgba(255,255,255,0.22)'
                      : '#CBD5E1',
              },
              pressed && { opacity: 0.92 },
            ]}>
            <Ionicons
              name={activePad === 'alpha' ? 'text' : 'search-outline'}
              size={18}
              color={activePad === 'alpha' ? '#0284C7' : '#64748B'}
            />
            <View style={styles.whiteInputDisplayWrap}>
              {itemQuery.length > 0 ? (
                <Text style={styles.whiteSearchValueText} numberOfLines={1}>
                  {itemQuery}
                </Text>
              ) : (
                <Text style={styles.whiteSearchPlaceholder} numberOfLines={1}>
                  {activePad === 'alpha'
                    ? isUrdu
                      ? 'کی بورڈ سے نام لکھیں...'
                      : 'Start typing item name...'
                    : isUrdu
                      ? 'آئٹم کا نام لکھیں (اختیاری)...'
                      : 'Tap to type item name...'}
                </Text>
              )}
              {activePad === 'alpha' && (
                <Animated.View
                  style={[styles.fakeCursor, { opacity: cursorOpacity }]}
                />
              )}
            </View>
            {itemQuery.length > 0 && (
              <Pressable
                onPress={() => setItemQuery('')}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={isUrdu ? 'نام صاف کریں' : 'Clear item name'}>
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
              </Pressable>
            )}
          </Pressable>

          <Pressable
            onPress={() => setActivePad('price')}
            accessibilityRole="button"
            accessibilityLabel={isUrdu ? 'قیمت درج کریں' : 'Switch to price keypad'}
            style={({ pressed }) => [
              styles.entryPricePill,
              {
                backgroundColor:
                  entryNum > 0
                    ? settings.darkMode
                      ? 'rgba(14, 165, 233, 0.16)'
                      : '#E0F2FE'
                    : settings.darkMode
                      ? '#111C2D'
                      : '#FFFFFF',
                borderColor:
                  activePad === 'price' && (entryNum > 0 || itemQuery.trim().length > 0)
                    ? '#0284C7'
                    : entryNum > 0
                      ? settings.darkMode
                        ? 'rgba(56, 189, 248, 0.45)'
                        : '#7DD3FC'
                      : softBorder,
              },
              pressed && { opacity: 0.85 },
            ]}>
            <Text
              style={[
                styles.entryCurrency,
                {
                  color:
                    entryNum > 0
                      ? settings.darkMode
                        ? '#38BDF8'
                        : '#0284C7'
                      : theme.textMuted,
                },
              ]}>
              {settings.currencySymbol}
            </Text>
            <Text
              style={[
                styles.entryValue,
                { color: entryNum > 0 ? theme.text : theme.textMuted },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}>
              {entryNum > 0 ? entryNum.toLocaleString() : '0'}
            </Text>
            {activePad === 'alpha' && entryNum > 0 && (
              <Pressable
                onPress={handleBackspace}
                hitSlop={6}
                accessibilityRole="button"
                accessibilityLabel={isUrdu ? 'قیمت ہندسہ حذف کریں' : 'Delete last price digit'}
                style={styles.pillBackBtn}>
                <Ionicons
                  name="backspace-outline"
                  size={15}
                  color={settings.darkMode ? '#7DD3FC' : '#0284C7'}
                />
              </Pressable>
            )}
          </Pressable>
        </View>

        {/* 3. Animated Switch: Hybrid Soft QWERTY Pad <-> 123 Price Pad + Quick Chips */}
        {activePad === 'alpha' ? (
          <Animated.View
            style={{
              marginHorizontal: -8,
              opacity: padTransition,
              transform: [
                {
                  translateY: padTransition.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0],
                  }),
                },
              ],
            }}>
            <CounterAlphaKeyboard
              query={itemQuery}
              entryNum={entryNum}
              currencySymbol={settings.currencySymbol}
              suggestions={suggestions}
              isSuggesting={isSuggesting}
              onPressChar={handleAlphaChar}
              onPressPriceDigit={appendDigit}
              onBackspace={handleAlphaBackspace}
              onClearWord={handleAlphaClear}
              onSelectSuggestion={handleSelectSuggestion}
              onCommitItemWithWord={handleAddWithWord}
              onSwitchToPricePad={() => setActivePad('price')}
            />
          </Animated.View>
        ) : (
          <Animated.View
            style={[
              styles.pricePadSection,
              {
                opacity: padTransition.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0],
                }),
              },
            ]}>
            {/* 1-Tap Quick Item Name Chips (Zero Keyboard Switch Needed!) */}
            {quickChips.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.quickChipsScroll}
                contentContainerStyle={styles.quickChipsContent}>
                {quickChips.map((chip) => {
                  const selected =
                    itemQuery.trim().toLowerCase() === chip.toLowerCase();
                  return (
                    <Pressable
                      key={chip}
                      onPress={() =>
                        setItemQuery(selected ? '' : chip)
                      }
                      style={({ pressed }) => [
                        styles.quickNameChip,
                        {
                          backgroundColor: selected
                            ? '#0284C7'
                            : settings.darkMode
                              ? '#162235'
                              : '#FFFFFF',
                          borderColor: selected
                            ? '#0284C7'
                            : softBorder,
                        },
                        pressed && { opacity: 0.78 },
                      ]}>
                      <Text
                        style={[
                          styles.quickNameChipText,
                          {
                            color: selected ? '#FFFFFF' : theme.textSecondary,
                          },
                        ]}>
                        {chip}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}

            <View style={styles.padMatrix}>
              <View style={styles.padRow}>
                {renderKeypadButton('1')}
                {renderKeypadButton('2')}
                {renderKeypadButton('3')}
                {renderKeypadButton('BACK')}
              </View>
              <View style={styles.padRow}>
                {renderKeypadButton('4')}
                {renderKeypadButton('5')}
                {renderKeypadButton('6')}
                {renderKeypadButton('CLR')}
              </View>
              <View style={styles.padRow}>
                {renderKeypadButton('7')}
                {renderKeypadButton('8')}
                {renderKeypadButton('9')}
                {renderKeypadButton('SCAN')}
              </View>
              <View style={styles.padRow}>
                {renderKeypadButton('00')}
                {renderKeypadButton('0')}
                <Pressable
                  onPress={handleAddTap}
                  disabled={entryNum <= 0}
                  accessibilityRole="button"
                  accessibilityLabel={isUrdu ? 'بل میں جمع کریں' : 'Add item amount to receipt'}
                  style={({ pressed }) => [
                    styles.addToBillKey,
                    {
                      backgroundColor:
                        entryNum > 0
                          ? '#0284C7'
                          : settings.darkMode
                            ? '#172334'
                            : '#E2E8F0',
                      borderColor: entryNum > 0 ? '#0284C7' : softBorder,
                    },
                    pressed && entryNum > 0 && styles.keyPressed,
                  ]}>
                  <Ionicons
                    name="add-circle-outline"
                    size={20}
                    color={entryNum > 0 ? '#FFFFFF' : theme.textMuted}
                  />
                  <Text
                    style={[
                      styles.addToBillKeyText,
                      { color: entryNum > 0 ? '#FFFFFF' : theme.textMuted },
                    ]}
                    numberOfLines={1}>
                    {entryNum > 0
                      ? isUrdu
                        ? `شامل +${formatCompactPrice(entryNum)}`
                        : `Add ${settings.currencySymbol}${formatCompactPrice(entryNum)}`
                      : isUrdu
                        ? '+ شامل'
                        : 'Add Item'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </Animated.View>
        )}
      </View>

      {/* 4. Clean Pinned Bottom Actions: Udhaar | Cash (Confirmed Bill Only) */}
      <View
        style={[
          styles.bottomBar,
          { backgroundColor: theme.background, borderTopColor: softBorder },
        ]}>
        <Pressable
          onPress={() => onStartUdhaar(0)}
          disabled={!hasConfirmedBill || isProcessing}
          accessibilityRole="button"
          accessibilityLabel={isUrdu ? 'ادھار بل' : 'Udhaar credit bill'}
          style={({ pressed }) => [
            styles.udhaarActionBtn,
            {
              backgroundColor: hasConfirmedBill
                ? settings.darkMode
                  ? 'rgba(239, 68, 68, 0.18)'
                  : '#FEE2E2'
                : theme.surfaceSubtle,
              borderColor: hasConfirmedBill ? theme.danger : softBorder,
            },
            pressed && hasConfirmedBill && { opacity: 0.86, transform: [{ scale: 0.98 }] },
          ]}>
          <Ionicons
            name="book-outline"
            size={19}
            color={hasConfirmedBill ? theme.danger : theme.textMuted}
          />
          <Text
            style={[
              styles.udhaarActionText,
              { color: hasConfirmedBill ? theme.danger : theme.textMuted },
            ]}
            numberOfLines={1}>
            {isUrdu ? 'ادھار' : 'Udhaar'}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onInstantCash(0)}
          disabled={!hasConfirmedBill || isProcessing}
          accessibilityRole="button"
          accessibilityLabel={isUrdu ? 'نقد بل مکمل کریں' : 'Complete cash sale'}
          style={({ pressed }) => [
            styles.cashActionBtn,
            {
              backgroundColor: hasConfirmedBill ? theme.primary : theme.border,
            },
            pressed && hasConfirmedBill && { opacity: 0.9, transform: [{ scale: 0.985 }] },
          ]}>
          {isProcessing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons
              name="checkmark-circle"
              size={21}
              color={hasConfirmedBill ? '#FFFFFF' : theme.textMuted}
            />
          )}
          <Text
            style={[
              styles.cashActionText,
              { color: hasConfirmedBill ? '#FFFFFF' : theme.textMuted },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}>
            {hasConfirmedBill
              ? `${isUrdu ? 'نقد' : 'Cash'} · ${settings.currencySymbol}${confirmedTotal.toLocaleString()}`
              : entryNum > 0
                ? isUrdu
                  ? 'پہلے شامل دبائیں'
                  : 'Tap "Add" above'
                : isUrdu
                  ? 'قیمت درج کریں'
                  : 'Enter Price'}
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
    paddingHorizontal: Spacing.md,
    paddingTop: 8,
    paddingBottom: 6,
    gap: 8,
  },

  // 1. Live Bill Receipt Paper Card
  receiptCard: {
    flex: 1,
    minHeight: 116,
    borderRadius: 20,
    borderCurve: 'continuous',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingTop: 11,
    paddingBottom: 10,
  },
  receiptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  receiptTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  receiptTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  receiptCountBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  receiptCountText: {
    fontSize: 10.5,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  clearReceiptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9,
  },
  clearReceiptText: {
    fontSize: 11,
    fontWeight: '800',
  },
  dashedRule: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
  },
  colsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 4,
  },
  colHeadItem: {
    flex: 1,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  colHeadQty: {
    width: 44,
    textAlign: 'center',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  colHeadAmt: {
    width: 82,
    textAlign: 'right',
    paddingRight: 20,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  receiptLinesScroll: {
    flex: 1,
  },
  receiptEmptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  receiptEmptyInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiptEmptyTitle: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 19,
  },
  receiptLinesContent: {
    paddingVertical: 4,
    gap: 4,
  },
  receiptLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    gap: 6,
  },
  lineNum: {
    width: 18,
    fontSize: 11.5,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  lineName: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '700',
  },
  lineQty: {
    minWidth: 34,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  linePrice: {
    minWidth: 62,
    textAlign: 'right',
    fontSize: 13.5,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  lineRemoveBtn: {
    paddingLeft: 2,
  },
  receiptTotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  receiptTotalLabel: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.9,
  },
  receiptTotalAmountWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  receiptCurrency: {
    fontSize: 15,
    fontWeight: '800',
  },
  receiptTotalValue: {
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: -0.8,
    fontVariant: ['tabular-nums'],
  },

  // 2. Clean White Item Search Bar + Live Typed Price Pill
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  whiteSearchBox: {
    flex: 1,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1.5,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  whiteInputDisplayWrap: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  whiteSearchValueText: {
    flexShrink: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  whiteSearchPlaceholder: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
  },
  fakeCursor: {
    width: 2,
    height: 19,
    borderRadius: 1,
    backgroundColor: '#0284C7',
    marginLeft: 2,
  },
  entryPricePill: {
    minWidth: 94,
    maxWidth: 148,
    height: 48,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1.2,
    paddingHorizontal: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  pillBackBtn: {
    marginLeft: 2,
    padding: 2,
  },
  entryCurrency: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  entryValue: {
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: -0.4,
    fontVariant: ['tabular-nums'],
  },

  // 3. Clean 4x4 Keypad + 1-Tap Quick Chips
  pricePadSection: {
    gap: 6,
  },
  quickChipsScroll: {
    height: 32,
  },
  quickChipsContent: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 1,
  },
  quickNameChip: {
    height: 30,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickNameChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  padMatrix: {
    height: 214,
    gap: 7,
  },
  padRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 7,
  },
  keypadBtn: {
    flex: 1,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
    gap: 1,
  },
  keyPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.96 }],
  },
  digitKeyText: {
    fontSize: 22,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  clrKeyText: {
    fontSize: 15,
    fontWeight: '900',
  },
  scanKeySub: {
    fontSize: 10,
    fontWeight: '800',
  },
  addToBillKey: {
    flex: 2.04,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 48,
    paddingHorizontal: 10,
  },
  addToBillKeyText: {
    fontSize: 14.5,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },

  // 4. Bottom Action Bar
  bottomBar: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: Spacing.md,
    paddingTop: 9,
    paddingBottom: 11,
    borderTopWidth: 1,
  },
  udhaarActionBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  udhaarActionText: {
    fontSize: 15.5,
    fontWeight: '800',
  },
  cashActionBtn: {
    flex: 2,
    height: 52,
    borderRadius: 16,
    borderCurve: 'continuous',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 14,
  },
  cashActionText: {
    fontSize: 16.5,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
});
