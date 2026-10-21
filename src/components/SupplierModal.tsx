import React, { useState, useEffect } from 'react';
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
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SupplierKhata } from '@/types';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

export type SupplierModalMode = 'add_supplier' | 'add_purchase' | 'make_payment';

interface SupplierModalProps {
  visible: boolean;
  mode: SupplierModalMode;
  supplier: SupplierKhata | null;
  currencySymbol: string;
  language: 'en' | 'ur';
  isDarkMode: boolean;
  onClose: () => void;
  onSaveSupplier: (data: {
    name: string;
    companyName?: string;
    phone?: string;
    initialBalance: number;
  }) => void;
  onSavePurchase: (supplierId: string, amount: number, billNumber?: string, note?: string) => void;
  onSavePayment: (
    supplierId: string,
    amount: number,
    note?: string,
    alsoLogDrawerExpense?: boolean
  ) => void;
}

export const SupplierModal: React.FC<SupplierModalProps> = ({
  visible,
  mode,
  supplier,
  currencySymbol,
  language,
  isDarkMode,
  onClose,
  onSaveSupplier,
  onSavePurchase,
  onSavePayment,
}) => {
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const isUrdu = language === 'ur';

  // Form states
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [initialBalance, setInitialBalance] = useState('');

  // Transaction states
  const [amount, setAmount] = useState('');
  const [billNumber, setBillNumber] = useState('');
  const [note, setNote] = useState('');
  const [alsoLogDrawerExpense, setAlsoLogDrawerExpense] = useState(true);

  useEffect(() => {
    if (visible) {
      setName('');
      setCompanyName('');
      setPhone('');
      setInitialBalance('');
      setAmount('');
      setBillNumber('');
      setNote('');
      setAlsoLogDrawerExpense(true);
    }
  }, [visible, mode]);

  if (!visible) return null;

  const handleSubmit = () => {
    if (mode === 'add_supplier') {
      if (!name.trim()) return;
      onSaveSupplier({
        name: name.trim(),
        companyName: companyName.trim() || undefined,
        phone: phone.trim() || undefined,
        initialBalance: parseFloat(initialBalance) || 0,
      });
      onClose();
    } else if (mode === 'add_purchase') {
      const parsed = parseFloat(amount);
      if (!supplier || !parsed || parsed <= 0) return;
      onSavePurchase(supplier.id, parsed, billNumber.trim() || undefined, note.trim() || undefined);
      onClose();
    } else if (mode === 'make_payment') {
      const parsed = parseFloat(amount);
      if (!supplier || !parsed || parsed <= 0) return;
      onSavePayment(supplier.id, parsed, note.trim() || undefined, alsoLogDrawerExpense);
      onClose();
    }
  };

  const getTitle = () => {
    if (mode === 'add_supplier') {
      return isUrdu ? 'نیا سپلائر / ڈسٹری بیوٹر' : 'Add New Supplier';
    }
    if (mode === 'add_purchase') {
      return isUrdu ? 'مال آیا (ادھار خریداری)' : 'Stock Delivery (Purchase)';
    }
    return isUrdu ? 'سپلائر کو ادائیگی (کیش پیڈ)' : 'Record Payment to Supplier';
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View
          style={[
            styles.modalContainer,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}>
          {/* Header */}
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                {getTitle()}
              </Text>
              {supplier && mode !== 'add_supplier' ? (
                <Text style={[styles.modalSubtitle, { color: theme.textMuted }]}>
                  {supplier.name} {supplier.companyName ? `(${supplier.companyName})` : ''}
                </Text>
              ) : null}
            </View>
            <Pressable onPress={onClose} hitSlop={10} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={theme.textMuted} />
            </Pressable>
          </View>

          <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
            {mode === 'add_supplier' ? (
              <View style={styles.fieldsWrap}>
                <View style={styles.field}>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>
                    {isUrdu ? 'سپلائر / ڈسٹری بیوٹر کا نام *' : 'Supplier Name *'}
                  </Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.surfaceSubtle, color: theme.text, borderColor: theme.border }]}
                    placeholder={isUrdu ? 'مثال: یونی لیور ڈسٹری بیوٹر' : 'e.g. Unilever Distributor'}
                    placeholderTextColor={theme.textMuted}
                    value={name}
                    onChangeText={setName}
                    autoFocus
                  />
                </View>

                <View style={styles.field}>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>
                    {isUrdu ? 'کمپنی یا برانڈ کا نام' : 'Company / Brand Name'}
                  </Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.surfaceSubtle, color: theme.text, borderColor: theme.border }]}
                    placeholder={isUrdu ? 'مثال: شان فوڈز / حبیب' : 'e.g. Shan Foods, Engro, Habib'}
                    placeholderTextColor={theme.textMuted}
                    value={companyName}
                    onChangeText={setCompanyName}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>
                    {isUrdu ? 'فون / واٹس ایپ نمبر' : 'Phone / WhatsApp'}
                  </Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.surfaceSubtle, color: theme.text, borderColor: theme.border }]}
                    placeholder="0300 1234567"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>
                    {isUrdu ? 'ابتدائی سابقہ بقایا (اگر پہلے سے واجب الادا ہے)' : 'Opening Balance Due'}
                  </Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.surfaceSubtle, color: theme.text, borderColor: theme.border }]}
                    placeholder="0"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="numeric"
                    value={initialBalance}
                    onChangeText={setInitialBalance}
                  />
                </View>
              </View>
            ) : mode === 'add_purchase' ? (
              <View style={styles.fieldsWrap}>
                <View style={styles.field}>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>
                    {isUrdu ? 'بل کی رقم (روپے) *' : 'Delivery Amount (PKR) *'}
                  </Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.surfaceSubtle, color: theme.text, borderColor: theme.border, fontSize: 18, fontWeight: '800' }]}
                    placeholder="0"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                    autoFocus
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                  />
                </View>

                {/* Quick Presets */}
                <View style={styles.presetsRow}>
                  {[1000, 5000, 10000, 25000].map((val) => (
                    <Pressable
                      key={val}
                      onPress={() => setAmount(String(val))}
                      style={[styles.presetPill, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
                      <Text style={[styles.presetText, { color: theme.primary }]}>
                        +{val.toLocaleString()}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <View style={styles.field}>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>
                    {isUrdu ? 'انوائس یا بل نمبر' : 'Invoice / Bill Number'}
                  </Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.surfaceSubtle, color: theme.text, borderColor: theme.border }]}
                    placeholder={isUrdu ? 'مثال: INV-9042' : 'e.g. INV-9042'}
                    placeholderTextColor={theme.textMuted}
                    value={billNumber}
                    onChangeText={setBillNumber}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>
                    {isUrdu ? 'تفصیل یا اشیاء' : 'Delivery Note / Items'}
                  </Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.surfaceSubtle, color: theme.text, borderColor: theme.border }]}
                    placeholder={isUrdu ? 'مثال: 5 کارٹن گھی، 2 بوری چینی' : 'e.g. 5 cartons oil, 2 bags sugar'}
                    placeholderTextColor={theme.textMuted}
                    value={note}
                    onChangeText={setNote}
                  />
                </View>
              </View>
            ) : (
              /* mode === 'make_payment' */
              <View style={styles.fieldsWrap}>
                <View style={styles.field}>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>
                    {isUrdu ? 'ادا کی گئی رقم (روپے) *' : 'Payment Amount (PKR) *'}
                  </Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.surfaceSubtle, color: theme.text, borderColor: theme.border, fontSize: 18, fontWeight: '800' }]}
                    placeholder="0"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                    autoFocus
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                  />
                </View>

                {supplier && supplier.totalPayable > 0 ? (
                  <Pressable
                    onPress={() => setAmount(String(supplier.totalPayable))}
                    style={[styles.fullPayPill, { backgroundColor: theme.primaryLight }]}>
                    <Ionicons name="flash" size={13} color={theme.primary} />
                    <Text style={[styles.fullPayText, { color: theme.primary }]}>
                      {isUrdu
                        ? `پورا بقایا ادا کریں: ${currencySymbol}${supplier.totalPayable.toLocaleString()}`
                        : `Pay Full Due: ${currencySymbol}${supplier.totalPayable.toLocaleString()}`}
                    </Text>
                  </Pressable>
                ) : null}

                <View style={styles.field}>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>
                    {isUrdu ? 'ادائیگی کا نوٹ' : 'Payment Note'}
                  </Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.surfaceSubtle, color: theme.text, borderColor: theme.border }]}
                    placeholder={isUrdu ? 'مثال: نقد ادائیگی وان ڈرائیور کو' : 'e.g. Cash given to delivery driver'}
                    placeholderTextColor={theme.textMuted}
                    value={note}
                    onChangeText={setNote}
                  />
                </View>

                {/* Drawer Expense Sync Toggle */}
                <View
                  style={[
                    styles.syncBox,
                    { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
                  ]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.syncTitle, { color: theme.text }]}>
                      {isUrdu ? 'گلہ کے خرچ میں درج کریں' : 'Log as Cash Drawer Out'}
                    </Text>
                    <Text style={[styles.syncSub, { color: theme.textMuted }]}>
                      {isUrdu
                        ? 'گلہ سے نقد رقم نکال کر دی ہے تو آج کے خرچ میں بھی شامل کریں۔'
                        : 'Deduct from today cash drawer tally as a petty expense.'}
                    </Text>
                  </View>
                  <Switch
                    value={alsoLogDrawerExpense}
                    onValueChange={setAlsoLogDrawerExpense}
                    trackColor={{ false: theme.border, true: theme.primary }}
                  />
                </View>
              </View>
            )}
          </ScrollView>

          {/* Footer Actions */}
          <View style={[styles.modalFooter, { borderTopColor: theme.border }]}>
            <Pressable
              onPress={onClose}
              style={[styles.cancelBtn, { borderColor: theme.border }]}>
              <Text style={[styles.cancelBtnText, { color: theme.textSecondary }]}>
                {isUrdu ? 'منسوخ' : 'Cancel'}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleSubmit}
              style={[styles.saveBtn, { backgroundColor: theme.primary }]}>
              <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>
                {isUrdu ? 'محفوظ کریں' : 'Save'}
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: Spacing.md,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '90%',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  modalSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  body: {
    padding: Spacing.md,
  },
  fieldsWrap: {
    gap: 12,
  },
  field: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
  input: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  presetPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  presetText: {
    fontSize: 11,
    fontWeight: '700',
  },
  fullPayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
    borderRadius: 8,
  },
  fullPayText: {
    fontSize: 12,
    fontWeight: '800',
  },
  syncBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
  },
  syncTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  syncSub: {
    fontSize: 10,
    marginTop: 2,
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    padding: Spacing.md,
    borderTopWidth: 1,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
