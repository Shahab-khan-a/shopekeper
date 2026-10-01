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
  const { addCustomerPayment, settings, t, showAlert } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!customer) return null;

  const isSettled = customer.totalDebt <= 0;

  const handleRecordPayment = async () => {
    if (isSettled) {
      showAlert({
        type: 'info',
        title: t('warningAlert') || 'Notice',
        message: 'Customer khata is already settled. No pending debt to collect.',
      });
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      showAlert({
        type: 'warning',
        title: t('warningAlert') || 'Notice',
        message: 'Please enter a valid payment amount.',
      });
      return;
    }

    if (parsedAmount > customer.totalDebt) {
      showAlert({
        type: 'warning',
        title: t('warningAlert') || 'Notice',
        message: `Payment amount cannot exceed pending debt (${settings.currencySymbol} ${customer.totalDebt.toLocaleString()}).`,
      });
      return;
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
                <Text style={[styles.debtValue, { color: isSettled ? theme.success : theme.danger }]}>
                  {settings.currencySymbol} {Math.max(0, customer.totalDebt).toLocaleString()} {isSettled ? `(${t('cleared')})` : ''}
                </Text>
              </View>
            </View>

            {/* Amount input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>
                {t('paymentAmount')} *
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: theme.surfaceSubtle,
                    color: theme.text,
                    borderColor: theme.border,
                    opacity: isSettled ? 0.6 : 1,
                  },
                ]}
                placeholder={isSettled ? '0 (Cleared)' : 'e.g. 500'}
                placeholderTextColor={theme.textMuted}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                editable={!isSettled}
                autoFocus={!isSettled}
              />
            </View>

            {/* Quick Amount Buttons */}
            {!isSettled && (
              <View style={styles.quickPillsRow}>
                <Pressable
                  onPress={() => setAmount(Math.round(customer.totalDebt / 2).toString())}
                  style={({ pressed }) => [
                    styles.quickPill,
                    { backgroundColor: theme.primaryLight, borderColor: theme.primary },
                    pressed && { opacity: 0.8 },
                  ]}>
                  <Text style={[styles.quickPillText, { color: theme.primary }]}>
                    Half: {settings.currencySymbol} {Math.round(customer.totalDebt / 2).toLocaleString()}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setAmount(customer.totalDebt.toString())}
                  style={({ pressed }) => [
                    styles.quickPill,
                    { backgroundColor: theme.primaryLight, borderColor: theme.primary },
                    pressed && { opacity: 0.8 },
                  ]}>
                  <Text style={[styles.quickPillText, { color: theme.primary }]}>
                    Full: {settings.currencySymbol} {customer.totalDebt.toLocaleString()}
                  </Text>
                </Pressable>
              </View>
            )}

            {/* Note input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>{t('paymentNote')}</Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: theme.surfaceSubtle,
                    color: theme.text,
                    borderColor: theme.border,
                    opacity: isSettled ? 0.6 : 1,
                  },
                ]}
                placeholder="e.g. Cash vasooli at shop"
                placeholderTextColor={theme.textMuted}
                value={note}
                onChangeText={setNote}
                editable={!isSettled}
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
              disabled={isSubmitting || isSettled}
              style={[
                styles.footerBtn,
                styles.saveBtn,
                { backgroundColor: isSettled ? theme.surfaceSubtle : theme.primary },
                isSettled && { opacity: 0.6, borderWidth: 1, borderColor: theme.border },
              ]}>
              <Ionicons
                name={isSettled ? 'checkmark-circle' : 'checkmark-done'}
                size={18}
                color={isSettled ? theme.success : '#FFFFFF'}
              />
              <Text
                style={[
                  styles.saveBtnText,
                  isSettled && { color: theme.textSecondary },
                ]}>
                {isSettled ? t('cleared') : isSubmitting ? 'Saving...' : t('recordPaymentBtn')}
              </Text>
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
    alignItems: 'center',
    gap: Spacing.sm,
  },
  quickPill: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickPillText: {
    fontSize: 13,
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
