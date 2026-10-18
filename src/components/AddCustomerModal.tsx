import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShop } from '@/context/ShopContext';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

interface AddCustomerModalProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * Adds a khata customer directly — name, phone, and an optional opening
 * udhaar balance — without needing a sale first. For keepers moving their
 * paper register into the app.
 */
export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ visible, onClose }) => {
  const { settings, addCustomer, language } = useShop();
  const insets = useSafeAreaInsets();
  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const ur = language === 'ur';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [opening, setOpening] = useState('');
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setName('');
    setPhone('');
    setOpening('');
  };

  const save = async () => {
    const trimmed = name.trim();
    if (!trimmed || saving) {
      if (!trimmed) {
        const msg = ur ? 'گاہک کا نام لکھیں' : 'Please enter the customer name.';
        if (Platform.OS === 'web') window.alert(msg);
        else Alert.alert('', msg);
      }
      return;
    }
    setSaving(true);
    try {
      const amt = parseFloat(opening) || 0;
      await addCustomer({
        name: trimmed,
        phone: phone.trim(),
        totalDebt: amt,
        balance: amt,
      });
      reset();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.sheet,
            { backgroundColor: theme.background, paddingBottom: insets.bottom + 16 },
          ]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>
              {ur ? 'نیا گاہک شامل کریں' : 'Add Khata Customer'}
            </Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={24} color={theme.text} />
            </Pressable>
          </View>

          <Text style={[styles.label, { color: theme.text }]}>
            {ur ? 'گاہک کا نام *' : 'Customer Name *'}
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={ur ? 'مثلاً: محمد علی' : 'e.g. Muhammad Ali'}
            placeholderTextColor={theme.textMuted}
            style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
          />

          <Text style={[styles.label, { color: theme.text }]}>
            {ur ? 'فون نمبر' : 'Phone Number'}
          </Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="03xx-xxxxxxx"
            placeholderTextColor={theme.textMuted}
            keyboardType="phone-pad"
            style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
          />

          <Text style={[styles.label, { color: theme.text }]}>
            {ur ? 'پہلے سے اُدھار (اگر ہے)' : 'Opening Udhaar (if any)'}
          </Text>
          <TextInput
            value={opening}
            onChangeText={setOpening}
            placeholder="0"
            placeholderTextColor={theme.textMuted}
            keyboardType="numeric"
            style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
          />

          <Pressable
            onPress={save}
            disabled={saving}
            style={[styles.saveBtn, { backgroundColor: theme.primary, opacity: saving ? 0.6 : 1 }]}>
            {saving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="person-add-outline" size={18} color="#FFFFFF" />
            )}
            <Text style={styles.saveBtnText}>{ur ? 'گاہک شامل کریں' : 'Add Customer'}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  title: { fontSize: 18, fontWeight: '800' },
  label: { fontSize: 13, fontWeight: '700', marginTop: 12, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 15,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: BorderRadius.md,
    paddingVertical: 13,
    marginTop: 20,
  },
  saveBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
