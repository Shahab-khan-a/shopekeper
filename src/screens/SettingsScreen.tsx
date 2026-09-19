import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Platform,
  Image,
  Switch,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useShop } from '@/context/ShopContext';
import { Colors, ThemeColors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { CameraModal } from '@/components/CameraModal';

// ─── Types ────────────────────────────────────────────────────────────────────
type Segment = 'profile' | 'settings';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || 'DK';

// ─── Sub-components ───────────────────────────────────────────────────────────

/** A simple labeled row with optional right-side content */
const RowItem: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  label: string;
  sublabel?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  theme: ThemeColors;
  last?: boolean;
}> = ({ icon, iconColor, iconBg, label, sublabel, children, onPress, theme, last }) => (
  <Pressable
    onPress={onPress}
    disabled={!onPress}
    style={({ pressed }) => [
      styles.rowItem,
      !last && { borderBottomWidth: 1, borderBottomColor: theme.border },
      pressed && onPress && { backgroundColor: theme.surfaceSubtle },
    ]}
  >
    <View style={[styles.rowIcon, { backgroundColor: iconBg }]}>
      <Ionicons name={icon} size={18} color={iconColor} />
    </View>
    <View style={styles.rowLabelWrap}>
      <Text style={[styles.rowLabel, { color: theme.text }]}>{label}</Text>
      {sublabel ? <Text style={[styles.rowSub, { color: theme.textMuted }]}>{sublabel}</Text> : null}
    </View>
    {children ? (
      <View style={styles.rowRight}>{children}</View>
    ) : onPress ? (
      <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
    ) : null}
  </Pressable>
);

/** Inline editable field inside a RowItem */
const InlineField: React.FC<{
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'phone-pad' | 'email-address' | 'numeric';
  theme: ThemeColors;
}> = ({ value, onChangeText, placeholder, keyboardType = 'default', theme }) => (
  <TextInput
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    placeholderTextColor={theme.textMuted}
    keyboardType={keyboardType}
    style={[styles.inlineInput, { color: theme.text }]}
    textAlign="right"
  />
);

/** Section card wrapper */
const Section: React.FC<{ title: string; theme: ThemeColors; children: React.ReactNode }> = ({
  title,
  theme,
  children,
}) => (
  <View style={styles.sectionWrap}>
    <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>{title.toUpperCase()}</Text>
    <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      {children}
    </View>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
export const SettingsScreen: React.FC = () => {
  const {
    settings,
    updateSettings,
    resetToSampleData,
    exportDataJSON,
    importDataJSON,
    language,
    setLanguage,
    t,
    setActiveTab,
    products,
    todaySalesTotal,
    khata,
  } = useShop();

  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const [activeSegment, setActiveSegment] = useState<Segment>('profile');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showImportBox, setShowImportBox] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');

  // Profile fields
  const [profileImage, setProfileImage] = useState(settings.profileImage || '');
  const [shopName, setShopName] = useState(settings.shopName);
  const [shopNameUrdu, setShopNameUrdu] = useState(settings.shopNameUrdu);
  const [ownerName, setOwnerName] = useState(settings.ownerName);
  const [businessType, setBusinessType] = useState(settings.businessType || 'Kiryana & General Store');
  const [phone, setPhone] = useState(settings.phone);
  const [alternatePhone, setAlternatePhone] = useState(settings.alternatePhone || '');
  const [email, setEmail] = useState(settings.email || '');
  const [address, setAddress] = useState(settings.address);
  const [city, setCity] = useState(settings.city || '');
  const [taxNumber, setTaxNumber] = useState(settings.taxNumber || '');
  const [paymentDetails, setPaymentDetails] = useState(settings.paymentDetails || '');
  const [businessHours, setBusinessHours] = useState(settings.businessHours || '');

  // Preferences fields
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol);
  const [footerNote, setFooterNote] = useState(settings.footerNote);
  const [footerNoteUrdu, setFooterNoteUrdu] = useState(settings.footerNoteUrdu);
  const [lowStockThreshold, setLowStockThreshold] = useState(settings.lowStockThreshold.toString());

  // ── Handlers ────────────────────────────────────────────────────────────────
  const pickImage = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(t('warningAlert'), 'Gallery permission required.');
          return;
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });
      if (!result.canceled && result.assets?.[0]?.uri) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (e) {
      console.warn('Image picker error:', e);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings({
        profileImage: profileImage.trim() || undefined,
        shopName: shopName.trim(),
        shopNameUrdu: shopNameUrdu.trim(),
        ownerName: ownerName.trim(),
        businessType: businessType.trim(),
        phone: phone.trim(),
        alternatePhone: alternatePhone.trim(),
        email: email.trim(),
        address: address.trim(),
        city: city.trim(),
        taxNumber: taxNumber.trim(),
        paymentDetails: paymentDetails.trim(),
        businessHours: businessHours.trim(),
        currencySymbol: currencySymbol.trim(),
        footerNote: footerNote.trim(),
        footerNoteUrdu: footerNoteUrdu.trim(),
        lowStockThreshold: parseInt(lowStockThreshold, 10) || 5,
      });
      if (Platform.OS === 'web') {
        window.alert(t('settingsSaved'));
      } else {
        Alert.alert(t('success'), t('settingsSaved'));
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    const jsonStr = exportDataJSON();
    if (Platform.OS === 'web') {
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dukandar_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      Alert.alert('Backup', 'Backup prepared successfully.');
    }
  };

  const handleImport = async () => {
    if (!importJsonText.trim()) return;
    const success = await importDataJSON(importJsonText);
    if (success) {
      Platform.OS === 'web'
        ? window.alert('Data restored!')
        : Alert.alert(t('success'), 'Data restored!');
      setImportJsonText('');
      setShowImportBox(false);
    } else {
      Platform.OS === 'web'
        ? window.alert('Invalid backup JSON.')
        : Alert.alert(t('error'), 'Invalid backup JSON.');
    }
  };

  const handleReset = () => {
    if (Platform.OS === 'web') {
      if (window.confirm(t('resetConfirm'))) {
        resetToSampleData();
        window.alert('Catalog reloaded!');
      }
    } else {
      Alert.alert(t('warningAlert'), t('resetConfirm'), [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('confirm'),
          style: 'destructive',
          onPress: async () => {
            await resetToSampleData();
            Alert.alert(t('success'), 'Catalog reloaded!');
          },
        },
      ]);
    }
  };

  const initials = getInitials(ownerName || shopName);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Pressable
          onPress={() => setActiveTab('dashboard')}
          style={({ pressed }) => [
            styles.backBtn,
            { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
            pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] },
          ]}
          hitSlop={8}
          accessibilityLabel="Back to Dashboard"
        >
          <Ionicons name="arrow-back" size={20} color={theme.text} />
        </Pressable>

        <Text
          style={[styles.headerTitle, { color: theme.text }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {t('settingsTitle')}
        </Text>

        <Pressable
          onPress={handleSave}
          disabled={isSaving}
          style={({ pressed }) => [
            styles.saveBtn,
            { backgroundColor: theme.primary },
            (pressed || isSaving) && { opacity: 0.85, transform: [{ scale: 0.97 }] },
          ]}
        >
          <Ionicons
            name={isSaving ? 'hourglass-outline' : 'checkmark'}
            size={15}
            color="#FFFFFF"
          />
          <Text style={styles.saveBtnText}>{isSaving ? '...' : t('save')}</Text>
        </Pressable>
      </View>

      {/* ── Segment Switcher ───────────────────────────────────────────────── */}
      <View style={[styles.segmentWrap, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
        {(['profile', 'settings'] as const).map((seg) => (
          <Pressable
            key={seg}
            onPress={() => setActiveSegment(seg)}
            style={[
              styles.segBtn,
              activeSegment === seg && [styles.segBtnActive, { backgroundColor: theme.surface, ...Shadows.sm }],
            ]}
          >
            <Ionicons
              name={seg === 'profile' ? 'person' : 'settings'}
              size={15}
              color={activeSegment === seg ? theme.primary : theme.textMuted}
            />
            <Text
              style={[
                styles.segBtnText,
                { color: activeSegment === seg ? theme.primary : theme.textMuted },
                activeSegment === seg && { fontWeight: '700' },
              ]}
            >
              {seg === 'profile' ? t('profileTab') : t('preferencesTab')}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* ════════════════════════ PROFILE TAB ════════════════════════════════ */}
      {activeSegment === 'profile' && (
        <>
          {/* Avatar Card */}
          <View style={[styles.avatarCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            {/* Avatar */}
            <View style={styles.avatarRow}>
              <Pressable onPress={pickImage} style={styles.avatarTapArea}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={[styles.avatar, { borderColor: theme.primary }]} />
                ) : (
                  <View style={[styles.avatarFallback, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
                    <Text style={[styles.avatarInitials, { color: theme.primary }]}>{initials}</Text>
                  </View>
                )}
                <View style={[styles.cameraBadge, { backgroundColor: theme.primary }]}>
                  <Ionicons name="camera" size={13} color="#fff" />
                </View>
              </Pressable>

              <View style={styles.avatarInfo}>
                <Text style={[styles.avatarName, { color: theme.text }]} numberOfLines={1}>
                  {ownerName || 'Proprietor Name'}
                </Text>
                <Text style={[styles.avatarShop, { color: theme.primary }]} numberOfLines={1}>
                  {(language === 'ur' && shopNameUrdu) ? shopNameUrdu : shopName || 'Store Name'}
                </Text>
                <Text style={[styles.avatarType, { color: theme.textMuted }]}>{businessType}</Text>
              </View>
            </View>

            {/* Photo Action Buttons */}
            <View style={styles.photoActions}>
              <Pressable
                onPress={() => setIsCameraOpen(true)}
                style={[styles.photoBtn, { backgroundColor: theme.primaryLight }]}
              >
                <Ionicons name="camera-outline" size={15} color={theme.primary} />
                <Text style={[styles.photoBtnText, { color: theme.primary }]}>{t('takePhoto')}</Text>
              </Pressable>
              <Pressable
                onPress={pickImage}
                style={[styles.photoBtn, { backgroundColor: theme.surfaceSubtle, borderWidth: 1, borderColor: theme.border }]}
              >
                <Ionicons name="images-outline" size={15} color={theme.textSecondary} />
                <Text style={[styles.photoBtnText, { color: theme.textSecondary }]}>{t('chooseGallery')}</Text>
              </Pressable>
              {profileImage ? (
                <Pressable
                  onPress={() => setProfileImage('')}
                  style={[styles.photoBtn, { backgroundColor: theme.dangerLight }]}
                >
                  <Ionicons name="trash-outline" size={14} color={theme.danger} />
                  <Text style={[styles.photoBtnText, { color: theme.danger }]}>{t('removePhoto')}</Text>
                </Pressable>
              ) : null}
            </View>

            {/* Stats Strip */}
            <View style={[styles.statsStrip, { borderTopColor: theme.border }]}>
              {[
                { label: t('statsProducts'), value: String(products.length), color: theme.primary },
                { label: t('statsSales'), value: `${settings.currencySymbol} ${todaySalesTotal.toLocaleString()}`, color: theme.success },
                { label: t('statsKhata'), value: String(khata.length), color: theme.accent },
              ].map((s, i, arr) => (
                <React.Fragment key={s.label}>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                    <Text style={[styles.statLabel, { color: theme.textMuted }]}>{s.label}</Text>
                  </View>
                  {i < arr.length - 1 && <View style={[styles.statDivider, { backgroundColor: theme.border }]} />}
                </React.Fragment>
              ))}
            </View>
          </View>

          {/* Store Info */}
          <Section title={t('identitySection')} theme={theme}>
            <RowItem icon="storefront-outline" iconColor={theme.primary} iconBg={theme.primaryLight} label={t('ownerNameLabel')} theme={theme}>
              <InlineField value={ownerName} onChangeText={setOwnerName} placeholder="e.g. Muhammad Kamran" theme={theme} />
            </RowItem>
            <RowItem icon="business-outline" iconColor={theme.primary} iconBg={theme.primaryLight} label={t('shopNameLabel')} theme={theme}>
              <InlineField value={shopName} onChangeText={setShopName} placeholder="e.g. Madina Super Store" theme={theme} />
            </RowItem>
            <RowItem icon="text-outline" iconColor={theme.primary} iconBg={theme.primaryLight} label={t('shopNameUrduLabel')} theme={theme} last>
              <InlineField value={shopNameUrdu} onChangeText={setShopNameUrdu} placeholder="مثلاً: مدینہ سپر اسٹور" theme={theme} />
            </RowItem>
          </Section>

          {/* Contact */}
          <Section title={t('contactSection')} theme={theme}>
            <RowItem icon="call-outline" iconColor="#0284C7" iconBg="#E0F2FE" label={t('phoneLabel')} theme={theme}>
              <InlineField value={phone} onChangeText={setPhone} placeholder="0300-1234567" keyboardType="phone-pad" theme={theme} />
            </RowItem>
            <RowItem icon="phone-portrait-outline" iconColor="#0284C7" iconBg="#E0F2FE" label={t('altPhoneLabel')} theme={theme}>
              <InlineField value={alternatePhone} onChangeText={setAlternatePhone} placeholder="0321-9876543" keyboardType="phone-pad" theme={theme} />
            </RowItem>
            <RowItem icon="mail-outline" iconColor="#7C3AED" iconBg="#EDE9FE" label={t('emailLabel')} theme={theme}>
              <InlineField value={email} onChangeText={setEmail} placeholder="store@gmail.com" keyboardType="email-address" theme={theme} />
            </RowItem>
            <RowItem icon="location-outline" iconColor="#D97706" iconBg="#FEF3C7" label={t('cityLabel')} theme={theme}>
              <InlineField value={city} onChangeText={setCity} placeholder="e.g. Lahore" theme={theme} />
            </RowItem>
            <RowItem icon="map-outline" iconColor="#D97706" iconBg="#FEF3C7" label={t('addressLabel')} theme={theme} last>
              <InlineField value={address} onChangeText={setAddress} placeholder="Shop #14, Market" theme={theme} />
            </RowItem>
          </Section>

          {/* Payment & Tax */}
          <Section title={t('paymentSection')} theme={theme}>
            <RowItem icon="wallet-outline" iconColor="#059669" iconBg="#D1FAE5" label={t('paymentDetailsLabel')} theme={theme}>
              <InlineField value={paymentDetails} onChangeText={setPaymentDetails} placeholder="EasyPaisa: 0300-…" theme={theme} />
            </RowItem>
            <RowItem icon="document-text-outline" iconColor="#059669" iconBg="#D1FAE5" label={t('taxNumberLabel')} theme={theme}>
              <InlineField value={taxNumber} onChangeText={setTaxNumber} placeholder="NTN-XXXXXXX-X" theme={theme} />
            </RowItem>
            <RowItem icon="time-outline" iconColor="#059669" iconBg="#D1FAE5" label={t('businessHoursLabel')} theme={theme} last>
              <InlineField value={businessHours} onChangeText={setBusinessHours} placeholder="08:00 AM – 11:30 PM" theme={theme} />
            </RowItem>
          </Section>

          {/* Save */}
          <Pressable
            onPress={handleSave}
            disabled={isSaving}
            style={({ pressed }) => [
              styles.fullSaveBtn,
              { backgroundColor: theme.primary },
              (pressed || isSaving) && { opacity: 0.8 },
            ]}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
            <Text style={styles.fullSaveBtnText}>{t('saveSettings')}</Text>
          </Pressable>
        </>
      )}

      {/* ════════════════════════ SETTINGS TAB ═══════════════════════════════ */}
      {activeSegment === 'settings' && (
        <>
          {/* Appearance */}
          <Section title="Appearance" theme={theme}>
            {/* Language */}
            <RowItem icon="language-outline" iconColor="#7C3AED" iconBg="#EDE9FE" label={t('languageLabel')} sublabel="English / اردو" theme={theme}>
              <View style={styles.langToggle}>
                {(['en', 'ur'] as const).map((lang) => (
                  <Pressable
                    key={lang}
                    onPress={() => setLanguage(lang)}
                    style={[
                      styles.langChip,
                      {
                        backgroundColor: language === lang ? theme.primary : theme.surfaceSubtle,
                        borderColor: language === lang ? theme.primary : theme.border,
                      },
                    ]}
                  >
                    <Text style={[styles.langChipText, { color: language === lang ? '#fff' : theme.textSecondary }]}>
                      {lang === 'en' ? 'EN' : 'اردو'}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </RowItem>

            {/* Dark Mode */}
            <RowItem icon="moon-outline" iconColor="#6366F1" iconBg="#E0E7FF" label={t('darkModeLabel')} sublabel={settings.darkMode ? 'Dark' : 'Light'} theme={theme} last>
              <Switch
                value={settings.darkMode}
                onValueChange={(val) => updateSettings({ darkMode: val })}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor="#fff"
              />
            </RowItem>
          </Section>

          {/* Billing */}
          <Section title={t('billingSection')} theme={theme}>
            <RowItem icon="cash-outline" iconColor="#059669" iconBg="#D1FAE5" label={t('currencyLabel')} theme={theme}>
              <InlineField value={currencySymbol} onChangeText={setCurrencySymbol} placeholder="Rs" theme={theme} />
            </RowItem>
            <RowItem icon="alert-circle-outline" iconColor="#D97706" iconBg="#FEF3C7" label={t('lowStockThresholdLabel')} theme={theme}>
              <InlineField value={lowStockThreshold} onChangeText={setLowStockThreshold} keyboardType="numeric" placeholder="5" theme={theme} />
            </RowItem>
            <RowItem icon="receipt-outline" iconColor="#0284C7" iconBg="#E0F2FE" label={t('billFooterLabel')} theme={theme}>
              <InlineField value={footerNote} onChangeText={setFooterNote} placeholder="Thank you!" theme={theme} />
            </RowItem>
            <RowItem icon="language-outline" iconColor="#0284C7" iconBg="#E0F2FE" label={t('billFooterUrduLabel')} theme={theme} last>
              <InlineField value={footerNoteUrdu} onChangeText={setFooterNoteUrdu} placeholder="شکریہ" theme={theme} />
            </RowItem>
          </Section>

          {/* Save Preferences */}
          <Pressable
            onPress={handleSave}
            disabled={isSaving}
            style={({ pressed }) => [
              styles.fullSaveBtn,
              { backgroundColor: theme.primary },
              (pressed || isSaving) && { opacity: 0.8 },
            ]}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
            <Text style={styles.fullSaveBtnText}>{t('saveSettings')}</Text>
          </Pressable>

          {/* Data Management */}
          <Section title={t('dataManagement')} theme={theme}>
            <RowItem
              icon="download-outline"
              iconColor="#059669"
              iconBg="#D1FAE5"
              label={t('backupBtn')}
              sublabel="Export all data as JSON"
              onPress={handleExport}
              theme={theme}
            />
            <RowItem
              icon="cloud-upload-outline"
              iconColor="#0284C7"
              iconBg="#E0F2FE"
              label={t('restoreBtn')}
              sublabel="Import from JSON backup"
              onPress={() => setShowImportBox(!showImportBox)}
              theme={theme}
            />
            <RowItem
              icon="refresh-outline"
              iconColor="#D97706"
              iconBg="#FEF3C7"
              label={t('resetSampleBtn')}
              sublabel="Reload default catalog"
              onPress={handleReset}
              theme={theme}
              last
            />
          </Section>

          {/* Import Box */}
          {showImportBox && (
            <View style={[styles.importBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.importHint, { color: theme.textSecondary }]}>
                Paste your backup JSON below to restore:
              </Text>
              <TextInput
                value={importJsonText}
                onChangeText={setImportJsonText}
                placeholder={'{"products": [...], ...}'}
                placeholderTextColor={theme.textMuted}
                multiline
                style={[
                  styles.importInput,
                  {
                    color: theme.text,
                    backgroundColor: theme.surfaceSubtle,
                    borderColor: theme.border,
                  },
                ]}
              />
              <Pressable
                onPress={handleImport}
                style={[styles.importApplyBtn, { backgroundColor: theme.primary }]}
              >
                <Text style={styles.importApplyText}>Apply Restore</Text>
              </Pressable>
            </View>
          )}
        </>
      )}

      {/* Bottom padding */}
      <View style={{ height: 40 }} />

      {/* Camera Modal */}
      <CameraModal
        visible={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(uri) => { setProfileImage(uri); setIsCameraOpen(false); }}
        title={t('takePhoto')}
      />
    </ScrollView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: 80 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    ...Shadows.sm,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

  // Segment
  segmentWrap: {
    flexDirection: 'row',
    borderRadius: BorderRadius.full,
    padding: 4,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    gap: 4,
  },
  segBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
  },
  segBtnActive: {},
  segBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Avatar Card
  avatarCard: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
  },
  avatarTapArea: {
    position: 'relative',
    width: 80,
    height: 80,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2.5,
  },
  avatarFallback: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  avatarInitials: {
    fontSize: 26,
    fontWeight: '900',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarInfo: { flex: 1, gap: 2 },
  avatarName: { fontSize: 17, fontWeight: '800', letterSpacing: -0.3 },
  avatarShop: { fontSize: 14, fontWeight: '600' },
  avatarType: { fontSize: 12 },

  // Photo actions
  photoActions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    flexWrap: 'wrap',
  },
  photoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
  },
  photoBtnText: { fontSize: 12, fontWeight: '700' },

  // Stats
  statsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    paddingVertical: Spacing.md,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { fontSize: 15, fontWeight: '900' },
  statLabel: { fontSize: 11, fontWeight: '500' },
  statDivider: { width: 1, height: 28 },

  // Section
  sectionWrap: { marginBottom: Spacing.lg },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 6,
    marginLeft: 4,
  },
  sectionCard: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    ...Shadows.sm,
  },

  // Row Item
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    minHeight: 54,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabelWrap: { flex: 1 },
  rowLabel: { fontSize: 15, fontWeight: '500' },
  rowSub: { fontSize: 12, marginTop: 1 },
  rowRight: { flexShrink: 1, maxWidth: '45%' },

  // Inline input
  inlineInput: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
    minWidth: 80,
    maxWidth: 180,
  },

  // Language chips
  langToggle: { flexDirection: 'row', gap: 6 },
  langChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
  },
  langChipText: { fontSize: 12, fontWeight: '700' },

  // Save button
  fullSaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.lg,
    ...Shadows.lg,
  },
  fullSaveBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },

  // Import box
  importBox: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  importHint: { fontSize: 13, fontWeight: '500' },
  importInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    minHeight: 100,
    fontSize: 13,
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
    textAlignVertical: 'top',
  },
  importApplyBtn: {
    paddingVertical: 13,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    ...Shadows.sm,
  },
  importApplyText: { color: '#fff', fontWeight: '800', fontSize: 13 },
});
