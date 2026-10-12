import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';
import { useKeyboardOffset } from '@/hooks/use-keyboard-offset';

export interface CashOutEntry {
  id: string;
  amount: number;
  reason: string;
  note?: string;
  createdAt: number;
}

export const CASH_OUT_STORAGE_KEY = '@shopkeeper_cash_out_entries';

interface CashOutModalProps {
  visible: boolean;
  onClose: () => void;
  onCashOutSaved?: () => void;
}

const COMMON_REASONS = [
  { id: 'tea', labelUrdu: 'چائے / ریفریشمنٹ', labelEn: 'Tea & Refreshment', icon: 'cafe-outline' },
  { id: 'supplier', labelUrdu: 'بریڈ / دودھ سپلائر', labelEn: 'Supplier / Delivery', icon: 'cart-outline' },
  { id: 'bills', labelUrdu: 'بل / دکان خرچہ', labelEn: 'Shop Expense / Bills', icon: 'flash-outline' },
  { id: 'salary', labelUrdu: 'ملازم خرچہ', labelEn: 'Staff Advance', icon: 'people-outline' },
  { id: 'personal', labelUrdu: 'ذاتی استعمال / گھر', labelEn: 'Personal / Home', icon: 'home-outline' },
  { id: 'other', labelUrdu: 'متفرق خرچہ', labelEn: 'Miscellaneous', icon: 'ellipsis-horizontal-circle-outline' },
];

export const CashOutModal: React.FC<CashOutModalProps> = ({
  visible,
  onClose,
  onCashOutSaved,
}) => {
  const { settings, language, showAlert } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const isUrdu = language === 'ur';
  const insets = useSafeAreaInsets();
  const keyboardOffset = useKeyboardOffset(visible);

  const [amount, setAmount] = useState('');
  const [selectedReason, setSelectedReason] = useState(COMMON_REASONS[0]);
  const [note, setNote] = useState('');
  const [recentEntries, setRecentEntries] = useState<CashOutEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      setAmount('');
      setNote('');
      setSelectedReason(COMMON_REASONS[0]);
      loadEntries();
    }
  }, [visible]);

  const loadEntries = async () => {
    try {
      const data = await AsyncStorage.getItem(CASH_OUT_STORAGE_KEY);
      if (data) {
        const parsed: CashOutEntry[] = JSON.parse(data);
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        // Only show today's entries
        const todayEntries = parsed.filter((e) => e.createdAt >= todayStart.getTime());
        setRecentEntries(todayEntries);
      } else {
        setRecentEntries([]);
      }
    } catch (e) {
      console.warn('Failed to load cash out entries:', e);
    }
  };

  const handleSaveCashOut = async () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      showAlert({
        type: 'warning',
        title: isUrdu ? 'توجہ فرمائیں' : 'Notice',
        message: isUrdu ? 'برائے مہربانی درست رقم درج کریں۔' : 'Please enter a valid amount.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newEntry: CashOutEntry = {
        id: 'cout_' + Date.now(),
        amount: Math.round(parsedAmount),
        reason: isUrdu ? selectedReason.labelUrdu : selectedReason.labelEn,
        note: note.trim() || undefined,
        createdAt: Date.now(),
      };

      const existingData = await AsyncStorage.getItem(CASH_OUT_STORAGE_KEY);
      const allEntries: CashOutEntry[] = existingData ? JSON.parse(existingData) : [];
      const updated = [newEntry, ...allEntries];

      await AsyncStorage.setItem(CASH_OUT_STORAGE_KEY, JSON.stringify(updated));

      if (onCashOutSaved) onCashOutSaved();
      onClose();
    } catch (e) {
      console.error('Error saving cash out:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      const existingData = await AsyncStorage.getItem(CASH_OUT_STORAGE_KEY);
      if (existingData) {
        const allEntries: CashOutEntry[] = JSON.parse(existingData);
        const updated = allEntries.filter((e) => e.id !== entryId);
        await AsyncStorage.setItem(CASH_OUT_STORAGE_KEY, JSON.stringify(updated));
        loadEntries();
        if (onCashOutSaved) onCashOutSaved();
      }
    } catch (e) {
      console.warn('Error deleting cash out entry:', e);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.overlay, { paddingBottom: keyboardOffset }]}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.sheet, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {/* Bottom Sheet Drag Handle */}
          <View style={[styles.sheetHandle, { backgroundColor: theme.border }]} />

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.dangerLight }]}>
                <Ionicons name="arrow-up-circle" size={22} color={theme.danger} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, { color: theme.text }]}>
                  {isUrdu ? 'دکان کا خرچہ (Cash Out)' : 'Record Shop Expense'}
                </Text>
                <Text style={[styles.sub, { color: theme.textSecondary }]} numberOfLines={1}>
                  {isUrdu ? 'دکان یا ذاتی اخراجات نقد کیش سے منہا کریں' : 'Deduct expense from cash in register'}
                </Text>
              </View>
            </View>
            <Pressable onPress={onClose} style={[styles.closeBtn, { backgroundColor: theme.surfaceSubtle }]}>
              <Ionicons name="close" size={20} color={theme.textSecondary} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}>
            {/* Amount Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                {isUrdu ? 'خرچہ کی رقم *' : 'Expense Amount *'}
              </Text>
              <View style={[styles.amountBox, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
                <Text style={[styles.currencyPrefix, { color: theme.danger }]}>
                  {settings.currencySymbol}
                </Text>
                <TextInput
                  style={[styles.amountInput, { color: theme.text }]}
                  placeholder="0"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                  autoFocus={true}
                />
              </View>
            </View>

            {/* Quick Amount Pills */}
            <View style={styles.quickPillsRow}>
              {[100, 200, 500, 1000, 2000].map((val) => (
                <Pressable
                  key={val}
                  onPress={() => setAmount(val.toString())}
                  style={({ pressed }) => [
                    styles.quickPill,
                    {
                      backgroundColor: amount === val.toString() ? theme.dangerLight : theme.card,
                      borderColor: amount === val.toString() ? theme.danger : theme.border,
                    },
                    pressed && { opacity: 0.8 },
                  ]}>
                  <Text
                    style={[
                      styles.quickPillText,
                      { color: amount === val.toString() ? theme.danger : theme.text },
                    ]}>
                    {settings.currencySymbol}{val}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Reason Selector Chips */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                {isUrdu ? 'خرچہ کی مد / وجہ' : 'Reason / Category'}
              </Text>
              <View style={styles.reasonsGrid}>
                {COMMON_REASONS.map((r) => {
                  const isSelected = selectedReason.id === r.id;
                  return (
                    <Pressable
                      key={r.id}
                      onPress={() => setSelectedReason(r)}
                      style={[
                        styles.reasonChip,
                        {
                          backgroundColor: isSelected ? theme.dangerLight : theme.card,
                          borderColor: isSelected ? theme.danger : theme.border,
                        },
                      ]}>
                      <Ionicons
                        name={r.icon as any}
                        size={15}
                        color={isSelected ? theme.danger : theme.textSecondary}
                      />
                      <Text
                        style={[
                          styles.reasonChipText,
                          { color: isSelected ? theme.danger : theme.text, fontWeight: isSelected ? '700' : '500' },
                        ]}>
                        {isUrdu ? r.labelUrdu : r.labelEn}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Optional Note */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                {isUrdu ? 'تفصیل / نوٹ (اختیاری)' : 'Description / Note (Optional)'}
              </Text>
              <TextInput
                style={[
                  styles.noteInput,
                  { backgroundColor: theme.surfaceSubtle, color: theme.text, borderColor: theme.border },
                ]}
                placeholder={isUrdu ? 'مثلاً فریسکو بریڈ 5 پیکٹ' : 'e.g. 5 bread packets'}
                placeholderTextColor={theme.textMuted}
                value={note}
                onChangeText={setNote}
              />
            </View>

            {/* Today's Logged Expenses */}
            {recentEntries.length > 0 && (
              <View style={styles.todayLogSection}>
                <Text style={[styles.todayLogTitle, { color: theme.textSecondary }]}>
                  {isUrdu ? 'آج کے اخراجات کی تفصیل' : "Today's Cash-Out Log"} ({recentEntries.length})
                </Text>
                {recentEntries.map((item) => (
                  <View
                    key={item.id}
                    style={[styles.logItemRow, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.logItemReason, { color: theme.text }]}>
                        {item.reason} {item.note ? `· ${item.note}` : ''}
                      </Text>
                      <Text style={[styles.logItemTime, { color: theme.textMuted }]}>
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                    <Text style={[styles.logItemAmount, { color: theme.danger }]}>
                      -{settings.currencySymbol}{item.amount.toLocaleString()}
                    </Text>
                    <Pressable
                      onPress={() => handleDeleteEntry(item.id)}
                      hitSlop={6}
                      style={styles.logDeleteBtn}>
                      <Ionicons name="trash-outline" size={15} color={theme.danger} />
                    </Pressable>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View
            style={[
              styles.footer,
              {
                borderTopColor: theme.border,
                paddingBottom: keyboardOffset > 0 ? Spacing.sm : Math.max(insets.bottom, Spacing.md),
              },
            ]}>
            <Pressable
              onPress={onClose}
              style={[styles.cancelBtn, { borderColor: theme.border }]}>
              <Text style={[styles.cancelText, { color: theme.textSecondary }]}>
                {isUrdu ? 'منسوخ' : 'Cancel'}
              </Text>
            </Pressable>

            <Pressable
              disabled={isSubmitting || !amount}
              onPress={handleSaveCashOut}
              style={[
                styles.saveBtn,
                { backgroundColor: amount ? theme.danger : theme.border },
              ]}>
              <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>
                {isUrdu ? 'خرچہ درج کریں' : 'Save Expense'}
              </Text>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    maxHeight: '90%',
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    ...Shadows.lg,
  },
  sheetHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  sub: {
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollArea: {
    flexGrow: 0,
    flexShrink: 1,
    padding: Spacing.md,
  },
  scrollContent: {
    paddingBottom: Spacing.md,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    marginBottom: 6,
  },
  amountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    height: 52,
  },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: '700',
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
  },
  quickPillsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: Spacing.md,
  },
  quickPill: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  reasonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  reasonChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  reasonChipText: {
    fontSize: 12,
  },
  noteInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 13,
  },
  todayLogSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  todayLogTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  logItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 6,
  },
  logItemReason: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  logItemTime: {
    fontSize: 11,
    marginTop: 2,
  },
  logItemAmount: {
    fontSize: 13,
    fontWeight: '800',
    marginRight: 8,
  },
  logDeleteBtn: {
    padding: 4,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    padding: Spacing.md,
    borderTopWidth: 1,
  },
  cancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 2,
    height: 46,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
