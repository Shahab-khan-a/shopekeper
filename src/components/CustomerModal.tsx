import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeyboardOffset } from '@/hooks/use-keyboard-offset';
import { CustomerKhata } from '@/types';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

export type CustomerModalMode = 'add_customer' | 'add_credit';

interface CustomerModalProps {
  visible: boolean;
  mode: CustomerModalMode;
  customer: CustomerKhata | null;
  currencySymbol: string;
  language: 'en' | 'ur';
  isDarkMode: boolean;
  onClose: () => void;
  onSaveCustomer: (data: {
    name: string;
    nameUrdu?: string;
    phone?: string;
    address?: string;
    initialBalance: number;
  }) => void;
  onSaveCredit: (customerId: string, amount: number, note?: string) => void;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  visible,
  mode,
  customer,
  currencySymbol,
  language,
  isDarkMode,
  onClose,
  onSaveCustomer,
  onSaveCredit,
}) => {
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const isUrdu = language === 'ur';
  const insets = useSafeAreaInsets();
  const keyboardOffset = useKeyboardOffset(visible);

  // Add Customer Form states
  const [name, setName] = useState('');
  const [nameUrdu, setNameUrdu] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [initialBalance, setInitialBalance] = useState('');

  const phoneInputRef = useRef<TextInput>(null);
  const balanceInputRef = useRef<TextInput>(null);

  // Add Credit Form states
  const [creditAmount, setCreditAmount] = useState('');
  const [creditNote, setCreditNote] = useState('');

  useEffect(() => {
    if (visible) {
      setName('');
      setNameUrdu('');
      setPhone('');
      setAddress('');
      setInitialBalance('');
      setCreditAmount('');
      setCreditNote('');
    }
  }, [visible, mode]);

  if (!visible) return null;

  const handleSubmit = () => {
    if (mode === 'add_customer') {
      if (!name.trim()) return;
      onSaveCustomer({
        name: name.trim(),
        nameUrdu: nameUrdu.trim() || undefined,
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        initialBalance: parseFloat(initialBalance) || 0,
      });
      onClose();
    } else if (mode === 'add_credit') {
      const parsed = parseFloat(creditAmount);
      if (!customer || !parsed || parsed <= 0) return;
      onSaveCredit(customer.id, parsed, creditNote.trim() || undefined);
      onClose();
    }
  };

  const getTitle = () => {
    if (mode === 'add_customer') {
      return isUrdu ? 'نیا گاہک درج کریں' : 'Add New Customer';
    }
    return isUrdu ? 'نیا ادھار درج کریں' : 'Add Credit Entry';
  };

  const getSubtitle = () => {
    if (mode === 'add_customer') {
      return isUrdu
        ? 'بہی کھاتہ کے لیے گاہک کا نام اور پرانا ادھار درج کریں'
        : 'Register customer with optional opening debt ledger balance';
    }
    return isUrdu
      ? `${customer?.nameUrdu || customer?.name || 'گاہک'} کے کھاتے میں ادھار رقم کا اندراج`
      : `Add direct credit entry to ${customer?.name || 'customer'}'s ledger`;
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={[styles.overlay, { paddingBottom: keyboardOffset }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={[styles.modalCard, { backgroundColor: theme.card }]}>
          {/* Bottom Sheet Handle */}
          <View style={[styles.sheetHandle, { backgroundColor: theme.border }]} />

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.headerTitle, { color: theme.text }]}>{getTitle()}</Text>
              <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]} numberOfLines={1}>
                {getSubtitle()}
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.7 }]}>
              <Ionicons name="close" size={22} color={theme.textSecondary} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scrollBody}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}>
            {/* ──────── Mode 1: Add New Customer ──────── */}
            {mode === 'add_customer' && (
              <>
                {/* Customer Full Name */}
                <View style={styles.fieldGroup}>
                  <Text style={[styles.fieldLabel, { color: theme.text }]}>
                    {isUrdu ? 'گاہک کا نام *' : 'Customer Name *'}
                  </Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
                    ]}>
                    <Ionicons name="person-outline" size={18} color={theme.textMuted} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: theme.text, textAlign: isUrdu ? 'right' : 'left' }]}
                      placeholder={isUrdu ? 'مثلاً: طارق محمود' : 'e.g., Tariq Mahmood'}
                      placeholderTextColor={theme.textMuted}
                      value={name}
                      onChangeText={setName}
                      autoFocus
                      returnKeyType="next"
                      onSubmitEditing={() => phoneInputRef.current?.focus()}
                    />
                  </View>
                </View>

                {/* Customer Urdu / Nickname */}
                <View style={styles.fieldGroup}>
                  <Text style={[styles.fieldLabel, { color: theme.text }]}>
                    {isUrdu ? 'عرفیت / مقامی نام (اختیاری)' : 'Urdu / Local Nickname (Optional)'}
                  </Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
                    ]}>
                    <Ionicons name="pricetag-outline" size={18} color={theme.textMuted} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: theme.text, textAlign: isUrdu ? 'right' : 'left' }]}
                      placeholder={isUrdu ? 'مثلاً: حاجی صاحب، ماسٹر جی' : 'e.g., Haji Sahab, Master Ji'}
                      placeholderTextColor={theme.textMuted}
                      value={nameUrdu}
                      onChangeText={setNameUrdu}
                    />
                  </View>
                </View>

                {/* Phone / WhatsApp */}
                <View style={styles.fieldGroup}>
                  <Text style={[styles.fieldLabel, { color: theme.text }]}>
                    {isUrdu ? 'موبائل نمبر / واٹس ایپ (اختیاری)' : 'Phone / WhatsApp (Optional)'}
                  </Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
                    ]}>
                    <Ionicons name="logo-whatsapp" size={18} color="#25D366" style={styles.inputIcon} />
                    <TextInput
                      ref={phoneInputRef}
                      style={[styles.input, { color: theme.text }]}
                      placeholder="03001234567"
                      placeholderTextColor={theme.textMuted}
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                      returnKeyType="next"
                      onSubmitEditing={() => balanceInputRef.current?.focus()}
                    />
                  </View>
                </View>

                {/* Address / Street */}
                <View style={styles.fieldGroup}>
                  <Text style={[styles.fieldLabel, { color: theme.text }]}>
                    {isUrdu ? 'پتہ / گلی محلہ (اختیاری)' : 'Address / Street (Optional)'}
                  </Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
                    ]}>
                    <Ionicons name="location-outline" size={18} color={theme.textMuted} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: theme.text, textAlign: isUrdu ? 'right' : 'left' }]}
                      placeholder={isUrdu ? 'مثلاً: گلی نمبر 4، مکان 12' : 'e.g., Street 4, House 12'}
                      placeholderTextColor={theme.textMuted}
                      value={address}
                      onChangeText={setAddress}
                    />
                  </View>
                </View>

                {/* Opening Udhaar Balance */}
                <View style={styles.fieldGroup}>
                  <View style={styles.labelWithBadge}>
                    <Text style={[styles.fieldLabel, { color: theme.text }]}>
                      {isUrdu ? 'سابقہ بقایا رقم / پرانا ادھار' : 'Opening Debt Balance'}
                    </Text>
                    <View style={[styles.optionalBadge, { backgroundColor: theme.surfaceSubtle }]}>
                      <Text style={[styles.optionalText, { color: theme.textSecondary }]}>
                        {isUrdu ? 'بہی کھاتہ' : 'Paper Ledger'}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.inputWrapper,
                      { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
                    ]}>
                    <Text style={[styles.currencyPrefix, { color: theme.primary }]}>{currencySymbol}</Text>
                    <TextInput
                      ref={balanceInputRef}
                      style={[styles.input, { color: theme.text, fontWeight: '700', fontSize: 16 }]}
                      placeholder="0"
                      placeholderTextColor={theme.textMuted}
                      value={initialBalance}
                      onChangeText={setInitialBalance}
                      keyboardType="numeric"
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit}
                    />
                  </View>
                  <Text style={[styles.helpText, { color: theme.textMuted, textAlign: isUrdu ? 'right' : 'left' }]}>
                    {isUrdu
                      ? 'اگر گاہک پر دکان کا پہلے سے ادھار ہے تو درج کریں تاکہ کھاتہ برابر رہے'
                      : 'Enter existing debt if transferring from your previous paper notebook'}
                  </Text>
                </View>
              </>
            )}

            {/* ──────── Mode 2: Add Direct Udhaar Credit ──────── */}
            {mode === 'add_credit' && customer && (
              <>
                {/* Customer Summary banner */}
                <View style={[styles.customerBanner, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
                  <View style={[styles.bannerIconWrap, { backgroundColor: theme.dangerLight }]}>
                    <Ionicons name="person" size={20} color={theme.danger} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.bannerCustName, { color: theme.text }]}>
                      {isUrdu && customer.nameUrdu ? customer.nameUrdu : customer.name}
                    </Text>
                    <Text style={[styles.bannerCustPhone, { color: theme.textMuted }]}>
                      {customer.phone || (isUrdu ? 'فون نمبر موجود نہیں' : 'No phone number')}
                    </Text>
                  </View>
                  <View style={styles.bannerDebtWrap}>
                    <Text style={[styles.bannerDebtLabel, { color: theme.textMuted }]}>
                      {isUrdu ? 'موجودہ ادھار' : 'Current Debt'}
                    </Text>
                    <Text style={[styles.bannerDebtValue, { color: theme.danger }]}>
                      {currencySymbol} {Math.max(0, customer.totalDebt || 0).toLocaleString()}
                    </Text>
                  </View>
                </View>

                {/* Credit Amount */}
                <View style={styles.fieldGroup}>
                  <Text style={[styles.fieldLabel, { color: theme.text }]}>
                    {isUrdu ? 'نیا ادھار رقم *' : 'Credit Amount *'}
                  </Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
                    ]}>
                    <Text style={[styles.currencyPrefix, { color: theme.danger }]}>{currencySymbol}</Text>
                    <TextInput
                      style={[styles.input, { color: theme.danger, fontWeight: '800', fontSize: 18 }]}
                      placeholder="0"
                      placeholderTextColor={theme.textMuted}
                      value={creditAmount}
                      onChangeText={setCreditAmount}
                      keyboardType="numeric"
                      autoFocus
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit}
                    />
                  </View>
                </View>

                {/* Credit Note / Description */}
                <View style={styles.fieldGroup}>
                  <Text style={[styles.fieldLabel, { color: theme.text }]}>
                    {isUrdu ? 'تفصیل / سامان کی یادداشت (اختیاری)' : 'Items Note / Memo (Optional)'}
                  </Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
                    ]}>
                    <Ionicons name="document-text-outline" size={18} color={theme.textMuted} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: theme.text, textAlign: isUrdu ? 'right' : 'left' }]}
                      placeholder={isUrdu ? 'مثلاً: 2 کلو گھی اور چائے کی پتی' : 'e.g., 2kg Ghee & Tea pack'}
                      placeholderTextColor={theme.textMuted}
                      value={creditNote}
                      onChangeText={setCreditNote}
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit}
                    />
                  </View>
                </View>
              </>
            )}
          </ScrollView>

          {/* Action Footer */}
          <View
            style={[
              styles.footer,
              {
                borderTopColor: theme.border,
                paddingBottom: Spacing.lg + (keyboardOffset > 0 ? 0 : insets.bottom),
              },
            ]}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.cancelBtn,
                { borderColor: theme.border },
                pressed && { opacity: 0.8 },
              ]}>
              <Text style={[styles.cancelBtnText, { color: theme.textSecondary }]}>
                {isUrdu ? 'منسوخ کریں' : 'Cancel'}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleSubmit}
              disabled={mode === 'add_customer' ? !name.trim() : !parseFloat(creditAmount)}
              style={({ pressed }) => [
                styles.submitBtn,
                {
                  backgroundColor:
                    mode === 'add_customer'
                      ? theme.primary
                      : theme.danger,
                  opacity: (mode === 'add_customer' ? !name.trim() : !parseFloat(creditAmount)) ? 0.5 : 1,
                },
                pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
              ]}>
              <Ionicons
                name={mode === 'add_customer' ? 'person-add' : 'add-circle-outline'}
                size={18}
                color="#FFFFFF"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.submitBtnText}>
                {mode === 'add_customer'
                  ? (isUrdu ? 'گاہک محفوظ کریں' : 'Save Customer')
                  : (isUrdu ? 'ادھار درج کریں' : 'Record Credit')}
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
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '92%',
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    ...Shadows.lg,
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    padding: Spacing.xs,
    marginLeft: Spacing.sm,
  },
  scrollBody: {
    flexGrow: 0,
    flexShrink: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  labelWithBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionalBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  optionalText: {
    fontSize: 11,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    minHeight: 48,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: '800',
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: Spacing.sm,
  },
  helpText: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
  customerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.md,
  },
  bannerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerCustName: {
    fontSize: 15,
    fontWeight: '800',
  },
  bannerCustPhone: {
    fontSize: 12,
    marginTop: 2,
  },
  bannerDebtWrap: {
    alignItems: 'flex-end',
  },
  bannerDebtLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  bannerDebtValue: {
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderTopWidth: 1,
    gap: Spacing.md,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  submitBtn: {
    flex: 2,
    height: 48,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
