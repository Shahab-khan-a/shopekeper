import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomerKhata } from '@/types';
import { useShop } from '@/context/ShopContext';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

interface KhataModalProps {
  customer: CustomerKhata | null;
  visible: boolean;
  onClose: () => void;
}

export const KhataModal: React.FC<KhataModalProps> = ({ customer, visible, onClose }) => {
  const { addCustomerPayment, settings, t } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!customer) return null;

  const handleRecordPayment = async () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      if (Platform.OS === 'web') {
        window.alert('Please enter a valid payment amount.');
      } else {
        Alert.alert(t('warningAlert'), 'Please enter a valid payment amount.');
      }
      return;
    }

    if (parsedAmount > customer.totalDebt) {
      const confirmExceed = Platform.OS === 'web'
        ? window.confirm('Entered amount is higher than current pending debt. Proceed?')
        : true;
      if (!confirmExceed) return;
    }

    setIsSubmitting(true);
    try {
      await addCustomerPayment(customer.id, parsedAmount, note);
      onClose();
      setAmount('');
      setNote('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.surface }]}>
          {/* Header */}
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>{t('addPayment')}</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={theme.textSecondary} />
            </Pressable>
          </View>

          {/* Customer Summary Card */}
          <View style={styles.body}>
            <View style={[styles.customerInfoBox, { backgroundColor: theme.surfaceSubtle }]}>
              <Text style={[styles.customerName, { color: theme.text }]}>
                {customer.name}
              </Text>
              <Text style={[styles.customerPhone, { color: theme.textSecondary }]}>
                📞 {customer.phone || 'No phone'}
              </Text>

              <View style={styles.debtRow}>
                <Text style={[styles.debtLabel, { color: theme.textSecondary }]}>{t('debtAmount')}:</Text>
                <Text style={[styles.debtValue, { color: theme.danger }]}>
                  {settings.currencySymbol} {customer.totalDebt}
                </Text>
              </View>
            </View>

            {/* Amount input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>
                {t('paymentAmount')} *
              </Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: theme.surfaceSubtle, color: theme.text, borderColor: theme.border }]}
                placeholder={`e.g. 500`}
                placeholderTextColor={theme.textMuted}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                autoFocus
              />
            </View>

            {/* Quick Amount Pills */}
            <View style={styles.quickPillsRow}>
              {[500, 1000, 2000, customer.totalDebt].map((amt, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => setAmount(amt.toString())}
                  style={[styles.quickPill, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
                  <Text style={[styles.quickPillText, { color: theme.primary }]}>
                    {amt === customer.totalDebt ? 'Full: ' : ''}{settings.currencySymbol} {amt}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Note input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>{t('paymentNote')}</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: theme.surfaceSubtle, color: theme.text, borderColor: theme.border }]}
                placeholder="e.g. Cash vasooli at shop"
                placeholderTextColor={theme.textMuted}
                value={note}
                onChangeText={setNote}
              />
            </View>
          </View>

          {/* Footer */}
          <View style={[styles.modalFooter, { borderTopColor: theme.border }]}>
            <Pressable
              onPress={onClose}
              style={[styles.footerBtn, styles.cancelBtn, { borderColor: theme.border }]}>
              <Text style={[styles.cancelBtnText, { color: theme.textSecondary }]}>{t('cancel')}</Text>
            </Pressable>

            <Pressable
              onPress={handleRecordPayment}
              disabled={isSubmitting}
              style={[styles.footerBtn, styles.saveBtn, { backgroundColor: theme.primary }]}>
              <Ionicons name="checkmark-done" size={18} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>{isSubmitting ? 'Saving...' : t('recordPaymentBtn')}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  modalCard: {
    width: '100%',
    maxWidth: 440,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  customerInfoBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
  },
  customerPhone: {
    fontSize: 12,
    marginTop: 2,
  },
  debtRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.06)',
  },
  debtLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  debtValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  textInput: {
    height: 46,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    fontSize: 15,
  },
  quickPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  quickPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  quickPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
  },
  footerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
  },
  cancelBtn: {
    borderWidth: 1,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtn: {},
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
