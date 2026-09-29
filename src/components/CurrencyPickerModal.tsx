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
  FlatList,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShop } from '@/context/ShopContext';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { CURRENCIES, CurrencyOption, findCurrency } from '@/constants/currencies';
import { useKeyboardOffset } from '@/hooks/use-keyboard-offset';

interface CurrencyPickerModalProps {
  visible: boolean;
  onClose: () => void;
  /** `code` is '' when the shopkeeper uses their own typed symbol */
  onSelect: (currency: { code: string; symbol: string }) => void;
}

const MAX_CUSTOM_SYMBOL_LENGTH = 6;

export const CurrencyPickerModal: React.FC<CurrencyPickerModalProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const { settings, t, language } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const keyboardOffset = useKeyboardOffset(visible);

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (visible) setQuery('');
  }, [visible]);

  const selected = findCurrency(settings.currencyCode, settings.currencySymbol);

  const results = useMemo(() => {
    const raw = query.trim();
    const q = raw.toLowerCase();
    if (!q) return CURRENCIES;
    return CURRENCIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.nameUrdu.includes(raw) ||
        c.code.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q)
    );
  }, [query]);

  const customSymbol = query.trim();
  const canUseCustom =
    customSymbol.length > 0 && customSymbol.length <= MAX_CUSTOM_SYMBOL_LENGTH;

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  const handlePick = (currency: { code: string; symbol: string }) => {
    Keyboard.dismiss();
    onSelect(currency);
    onClose();
  };

  const renderItem = ({ item }: { item: CurrencyOption }) => {
    const isSelected = selected?.code === item.code;
    return (
      <Pressable
        onPress={() => handlePick({ code: item.code, symbol: item.symbol })}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
        style={({ pressed }) => [
          styles.row,
          {
            backgroundColor: isSelected ? theme.primaryLight : theme.card,
            borderColor: isSelected ? theme.primary : theme.border,
          },
          pressed && { opacity: 0.85 },
        ]}>
        <Text style={styles.flag}>{item.flag}</Text>
        <View style={styles.rowText}>
          <Text style={[styles.rowName, { color: theme.text }]} numberOfLines={1}>
            {language === 'ur' ? item.nameUrdu : item.name}
          </Text>
          <Text style={[styles.rowSub, { color: theme.textMuted }]} numberOfLines={1}>
            {item.code} · {language === 'ur' ? item.name : item.nameUrdu}
          </Text>
        </View>
        <View
          style={[
            styles.symbolBadge,
            { backgroundColor: isSelected ? theme.primary : theme.surfaceSubtle },
          ]}>
          <Text style={[styles.symbolText, { color: isSelected ? '#FFFFFF' : theme.text }]}>
            {item.symbol}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.overlay, { paddingBottom: keyboardOffset }]}>
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <View
          style={[
            styles.sheetContainer,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <View style={styles.headerTitleRow}>
              <View style={[styles.iconWrap, { backgroundColor: theme.primaryLight }]}>
                <Ionicons name="cash-outline" size={20} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, { color: theme.text }]}>{t('selectCurrency')}</Text>
                <Text style={[styles.subtitle, { color: theme.textMuted }]} numberOfLines={1}>
                  {selected
                    ? `${selected.flag} ${selected.code} · ${settings.currencySymbol}`
                    : settings.currencySymbol}
                </Text>
              </View>
            </View>
            <Pressable
              onPress={handleClose}
              accessibilityLabel={t('cancel')}
              style={[styles.closeBtn, { backgroundColor: theme.surfaceSubtle }]}>
              <Ionicons name="close" size={20} color={theme.textSecondary} />
            </Pressable>
          </View>

          {/* Search */}
          <View
            style={[
              styles.searchBox,
              { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
            ]}>
            <Ionicons name="search" size={18} color={theme.textMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t('searchCurrency')}
              placeholderTextColor={theme.textMuted}
              autoCorrect={false}
              autoCapitalize="none"
              style={[styles.searchInput, { color: theme.text }]}
            />
            {query ? (
              <Pressable onPress={() => setQuery('')} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color={theme.textMuted} />
              </Pressable>
            ) : null}
          </View>

          <FlatList
            data={results}
            keyExtractor={(item) => item.code}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
            style={styles.list}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: Spacing.lg + (keyboardOffset > 0 ? 0 : insets.bottom) },
            ]}
            ListEmptyComponent={
              canUseCustom ? null : (
                <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                  {language === 'ur' ? 'کوئی کرنسی نہیں ملی' : 'No currency found'}
                </Text>
              )
            }
            ListFooterComponent={
              canUseCustom ? (
                <Pressable
                  onPress={() => handlePick({ code: '', symbol: customSymbol })}
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.row,
                    styles.customRow,
                    { backgroundColor: theme.card, borderColor: theme.border },
                    pressed && { opacity: 0.85 },
                  ]}>
                  <View style={[styles.customIcon, { backgroundColor: theme.primaryLight }]}>
                    <Ionicons name="create-outline" size={18} color={theme.primary} />
                  </View>
                  <View style={styles.rowText}>
                    <Text style={[styles.rowName, { color: theme.text }]} numberOfLines={1}>
                      “{customSymbol}”
                    </Text>
                    <Text style={[styles.rowSub, { color: theme.textMuted }]} numberOfLines={1}>
                      {t('useCustomSymbol')}
                    </Text>
                  </View>
                </Pressable>
              ) : null
            }
          />
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
    height: '80%',
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
    fontSize: 12,
    marginTop: 1,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 46,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    paddingVertical: 0,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  customRow: {
    marginTop: 8,
    borderStyle: 'dashed',
  },
  flag: {
    fontSize: 24,
  },
  customIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    gap: 1,
  },
  rowName: {
    fontSize: 14,
    fontWeight: '700',
  },
  rowSub: {
    fontSize: 11,
    fontWeight: '500',
  },
  symbolBadge: {
    minWidth: 44,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  symbolText: {
    fontSize: 13,
    fontWeight: '800',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 13,
    paddingVertical: Spacing.xl,
  },
});
