import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useShop } from '@/context/ShopContext';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

interface EditShopModalProps {
  visible: boolean;
  onClose: () => void;
}

const BUSINESS_CATEGORIES = [
  'General Store',
  'Kiryana Store',
  'Pharmacy / Medical',
  'Bakery & Sweets',
  'Mobile & Electronics',
  'Garments & Clothes',
  'Fruits & Vegetables',
  'Meat & Poultry',
  'Restaurant / Cafe',
  'Hardware & Paint',
  'Super Store',
  'Other Business',
];

export const EditShopModal: React.FC<EditShopModalProps> = ({ visible, onClose }) => {
  const { settings, updateSettings, user, language } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const [shopName, setShopName] = useState(settings.shopName || '');
  const [shopNameUrdu, setShopNameUrdu] = useState(settings.shopNameUrdu || '');
  const [ownerName, setOwnerName] = useState(settings.ownerName || '');
  const [businessType, setBusinessType] = useState(settings.businessType || 'General Store');
  const [phone, setPhone] = useState(settings.phone || '');
  const [city, setCity] = useState(settings.city || '');
  const [address, setAddress] = useState(settings.address || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync inputs with current settings whenever modal opens
  useEffect(() => {
    if (visible) {
      setShopName(settings.shopName || (user?.displayName ? `${user.displayName}'s Store` : 'My Store'));
      setShopNameUrdu(settings.shopNameUrdu || (user?.displayName ? `${user.displayName} اسٹور` : 'میری دکان'));
      setOwnerName(settings.ownerName || user?.displayName || '');
      setBusinessType(settings.businessType || 'General Store');
      setPhone(settings.phone || '');
      setCity(settings.city || '');
      setAddress(settings.address || '');
      setSaveSuccess(false);
    }
  }, [visible, settings, user]);

  const handleSave = async () => {
    const trimmedShop = shopName.trim();
    if (!trimmedShop) {
      return;
    }

    setIsSaving(true);
    try {
      await updateSettings({
        shopName: trimmedShop,
        shopNameUrdu: shopNameUrdu.trim(),
        ownerName: ownerName.trim(),
        businessType: businessType.trim(),
        phone: phone.trim(),
        city: city.trim(),
        address: address.trim(),
      });

      setSaveSuccess(true);
      setTimeout(() => {
        setIsSaving(false);
        setSaveSuccess(false);
        onClose();
      }, 700);
    } catch (err) {
      console.warn('Error saving shop info:', err);
      setIsSaving(false);
    }
  };

  const handleAutofillGoogle = () => {
    if (!user) return;
    if (user.displayName) {
      setOwnerName(user.displayName);
      setShopName(`${user.displayName}'s Store`);
      setShopNameUrdu(`${user.displayName} اسٹور`);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {/* Header */}
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <View style={styles.headerLeft}>
              <View style={[styles.headerIconWrap, { backgroundColor: theme.primaryLight }]}>
                <Ionicons name="storefront" size={20} color={theme.primary} />
              </View>
              <View>
                <Text style={[styles.modalTitle, { color: theme.text }]}>
                  {language === 'ur' ? 'دکان کا نام اور پروفائل' : 'Update Shop Name'}
                </Text>
                <Text style={[styles.modalSubtitle, { color: theme.textMuted }]}>
                  {language === 'ur' ? 'دکان کا نام اور معلومات تبدیل کریں' : 'Change store branding & business credentials'}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeBtn,
                { backgroundColor: theme.surfaceSubtle },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Ionicons name="close" size={18} color={theme.textSecondary} />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollBody}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Quick Google Autofill Badge */}
            {user && (
              <Pressable
                onPress={handleAutofillGoogle}
                style={({ pressed }) => [
                  styles.googleSyncBanner,
                  pressed && { opacity: 0.8 },
                ]}
              >
                <View style={styles.googleSyncLeft}>
                  <Ionicons name="logo-google" size={16} color="#0284C7" />
                  <Text style={styles.googleSyncText}>
                    {language === 'ur' ? 'گوگل اکاؤنٹ سے نام حاصل کریں' : `Use "${user.displayName || 'Google Account'}"`}
                  </Text>
                </View>
                <Ionicons name="arrow-down-circle-outline" size={16} color="#0284C7" />
              </Pressable>
            )}

            {/* Shop Name (English) */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: theme.text }]}>
                🏪 {language === 'ur' ? 'دکان کا نام (انگریزی)' : 'Shop / Business Name (English)'}
                <Text style={{ color: theme.danger }}> *</Text>
              </Text>
              <View style={[styles.inputWrapper, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
                <TextInput
                  value={shopName}
                  onChangeText={setShopName}
                  placeholder="e.g. Madina Super Store"
                  placeholderTextColor={theme.textMuted}
                  style={[styles.input, { color: theme.text }]}
                  returnKeyType="next"
                />
                {shopName.trim().length > 0 && (
                  <Ionicons name="checkmark-circle" size={16} color={theme.success} />
                )}
              </View>
            </View>

            {/* Shop Name (Urdu) */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: theme.text }]}>
                🏪 {language === 'ur' ? 'دکان کا نام (اردو)' : 'Shop Name (Urdu)'}
              </Text>
              <View style={[styles.inputWrapper, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
                <TextInput
                  value={shopNameUrdu}
                  onChangeText={setShopNameUrdu}
                  placeholder="مثلاً: مدینہ سپر اسٹور"
                  placeholderTextColor={theme.textMuted}
                  style={[styles.input, { color: theme.text, textAlign: language === 'ur' ? 'right' : 'left' }]}
                  returnKeyType="next"
                />
              </View>
            </View>

            {/* Owner / Proprietor Name */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: theme.text }]}>
                👤 {language === 'ur' ? 'مالک / دکاندار کا نام' : 'Proprietor / Owner Name'}
              </Text>
              <View style={[styles.inputWrapper, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
                <TextInput
                  value={ownerName}
                  onChangeText={setOwnerName}
                  placeholder="e.g. Muhammad Ali"
                  placeholderTextColor={theme.textMuted}
                  style={[styles.input, { color: theme.text }]}
                  returnKeyType="next"
                />
              </View>
            </View>

            {/* Business Category Chips */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: theme.text }]}>
                🏷️ {language === 'ur' ? 'کاروبار کی قسم' : 'Business Category'}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                {BUSINESS_CATEGORIES.map((cat) => {
                  const isSelected = businessType === cat;
                  return (
                    <Pressable
                      key={cat}
                      onPress={() => setBusinessType(cat)}
                      style={[
                        styles.categoryChip,
                        {
                          backgroundColor: isSelected ? theme.primary : theme.surfaceSubtle,
                          borderColor: isSelected ? theme.primary : theme.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          { color: isSelected ? '#FFFFFF' : theme.textSecondary },
                        ]}
                      >
                        {cat}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {/* Phone / WhatsApp */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: theme.text }]}>
                📞 {language === 'ur' ? 'فون / واٹس ایپ نمبر' : 'WhatsApp / Contact Phone'}
              </Text>
              <View style={[styles.inputWrapper, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="0300-1234567"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="phone-pad"
                  style={[styles.input, { color: theme.text }]}
                />
              </View>
            </View>

            {/* City / Area */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: theme.text }]}>
                📍 {language === 'ur' ? 'شہر / علاقہ' : 'City / Location'}
              </Text>
              <View style={[styles.inputWrapper, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
                <TextInput
                  value={city}
                  onChangeText={setCity}
                  placeholder="e.g. Lahore / Karachi"
                  placeholderTextColor={theme.textMuted}
                  style={[styles.input, { color: theme.text }]}
                />
              </View>
            </View>
          </ScrollView>

          {/* Footer Save Button */}
          <View style={[styles.modalFooter, { borderTopColor: theme.border }]}>
            <Pressable
              onPress={onClose}
              disabled={isSaving}
              style={[styles.cancelBtn, { borderColor: theme.border }]}
            >
              <Text style={[styles.cancelBtnText, { color: theme.textSecondary }]}>
                {language === 'ur' ? 'منسوخ' : 'Cancel'}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleSave}
              disabled={isSaving || !shopName.trim()}
              style={({ pressed }) => [
                styles.saveBtn,
                { backgroundColor: saveSuccess ? theme.success : theme.primary },
                (!shopName.trim() || isSaving) && { opacity: 0.7 },
                pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
              ]}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : saveSuccess ? (
                <>
                  <Ionicons name="checkmark-done" size={18} color="#FFFFFF" />
                  <Text style={styles.saveBtnText}>
                    {language === 'ur' ? 'محفوظ ہو گیا!' : 'Updated!'}
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons name="cloud-upload" size={16} color="#FFFFFF" />
                  <Text style={styles.saveBtnText}>
                    {language === 'ur' ? 'دکان کا نام محفوظ کریں' : 'Save & Update Shop'}
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '90%',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    ...Shadows.xl,
    zIndex: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  headerIconWrap: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  modalSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  googleSyncBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: '#E0F2FE',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#7DD3FC',
  },
  googleSyncLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  googleSyncText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 12,
    minHeight: 44,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 8,
  },
  categoryScroll: {
    gap: 6,
    paddingVertical: 2,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
