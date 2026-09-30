import { CameraModal } from '@/components/CameraModal';
import { CurrencyPickerModal } from '@/components/CurrencyPickerModal';
import { ProductImage } from '@/components/ProductImage';
import { findCurrency } from '@/constants/currencies';
import { LEGAL_CONFIG, openLegalUrl } from '@/constants/legal';
import { buildImportTemplateJSON } from '@/constants/sampleData';
import { BorderRadius, Colors, Shadows, Spacing, ThemeColors } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';
import { GoogleDriveAuth, googleDriveService } from '@/services/googleDriveService';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  LayoutChangeEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';


// ─── Types ────────────────────────────────────────────────────────────────────
type Segment = 'profile' | 'settings';

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

/** Inline editable field inside a RowItem (kept for legacy/non-text rows) */
const InlineField: React.FC<{
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'phone-pad' | 'email-address' | 'numeric';
  onSubmitEditing?: () => void;
  theme: ThemeColors;
}> = ({ value, onChangeText, placeholder, keyboardType = 'default', onSubmitEditing, theme }) => (
  <TextInput
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    placeholderTextColor={theme.textMuted}
    keyboardType={keyboardType}
    onSubmitEditing={onSubmitEditing}
    style={[styles.inlineInput, { color: theme.text }]}
    textAlign="right"
  />
);

/**
 * StackedField — label on top row (icon + text), full-width input below.
 * Best-practice pattern for mobile settings forms.
 */
const StackedField: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'phone-pad' | 'email-address' | 'numeric';
  multiline?: boolean;
  theme: ThemeColors;
  last?: boolean;
}> = ({ icon, iconColor, iconBg, label, value, onChangeText, placeholder, keyboardType = 'default', multiline = false, theme, last }) => (
  <View
    style={[
      stackedStyles.fieldWrap,
      !last && { borderBottomWidth: 1, borderBottomColor: theme.border },
    ]}
  >
    {/* Label row */}
    <View style={stackedStyles.labelRow}>
      <View style={[stackedStyles.fieldIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={14} color={iconColor} />
      </View>
      <Text style={[stackedStyles.fieldLabel, { color: theme.textSecondary }]}>{label}</Text>
    </View>
    {/* Full-width input */}
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={theme.textMuted}
      keyboardType={keyboardType}
      multiline={multiline}
      style={[
        stackedStyles.fieldInput,
        {
          color: theme.text,
          backgroundColor: theme.background,
          borderColor: theme.border,
        },
        multiline && { minHeight: 70, textAlignVertical: 'top' },
      ]}
    />
  </View>
);

const stackedStyles = StyleSheet.create({
  fieldWrap: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fieldIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  fieldInput: {
    width: '100%',
    fontSize: 15,
    fontWeight: '500',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
});

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

// ─── Language Toggle ─────────────────────────────────────────────────────────
const TOGGLE_W = 160;
const TOGGLE_H = 36;
const TOGGLE_PAD = 3;
const PILL_W = (TOGGLE_W - TOGGLE_PAD * 2) / 2;

const LangToggle: React.FC<{ value: 'en' | 'ur'; onChange: (l: 'en' | 'ur') => void; theme: ThemeColors }> = ({ value, onChange, theme }) => {
  const anim = useRef(new Animated.Value(value === 'en' ? 0 : 1)).current;
  const handlePress = (lang: 'en' | 'ur') => {
    if (lang === value) return;
    onChange(lang);
    Animated.spring(anim, { toValue: lang === 'en' ? 0 : 1, damping: 18, stiffness: 220, mass: 0.6, useNativeDriver: false }).start();
  };
  useEffect(() => {
    Animated.spring(anim, { toValue: value === 'en' ? 0 : 1, damping: 18, stiffness: 220, mass: 0.6, useNativeDriver: false }).start();
  }, [value]);
  const pillX = anim.interpolate({ inputRange: [0, 1], outputRange: [0, PILL_W] });
  return (
    <View style={[toggleStyles.track, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border, width: TOGGLE_W }]}>
      <Animated.View pointerEvents="none" style={[toggleStyles.pill, { backgroundColor: theme.primary, width: PILL_W, height: TOGGLE_H - TOGGLE_PAD * 2, transform: [{ translateX: pillX }] }]} />
      {(['en', 'ur'] as const).map((lang) => (
        <Pressable key={lang} onPress={() => handlePress(lang)} style={toggleStyles.option}>
          <Text style={[toggleStyles.optionText, { color: value === lang ? '#fff' : theme.textMuted }]}>
            {lang === 'en' ? '🇬🇧 English' : '🇵🇰 اردو'}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

// ─── Dark Mode Toggle ─────────────────────────────────────────────────────────
const DM_W = 160;
const DM_H = 36;
const DM_PAD = 3;
const DM_PILL_W = (DM_W - DM_PAD * 2) / 2;

const DarkToggle: React.FC<{ value: boolean; onChange: (v: boolean) => void; theme: ThemeColors }> = ({ value, onChange, theme }) => {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const handlePress = (dark: boolean) => {
    if (dark === value) return;
    onChange(dark);
    Animated.spring(anim, { toValue: dark ? 1 : 0, damping: 18, stiffness: 220, mass: 0.6, useNativeDriver: false }).start();
  };
  useEffect(() => {
    Animated.spring(anim, { toValue: value ? 1 : 0, damping: 18, stiffness: 220, mass: 0.6, useNativeDriver: false }).start();
  }, [value]);
  const pillX = anim.interpolate({ inputRange: [0, 1], outputRange: [0, DM_PILL_W] });
  const lightActive = !value;
  const darkActive = value;
  return (
    <View style={[toggleStyles.track, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border, width: DM_W}]}>
      <Animated.View pointerEvents="none" style={[toggleStyles.pill, { backgroundColor: darkActive ? '#6366F1' : theme.primary, width: DM_PILL_W, height: DM_H - DM_PAD * 2, transform: [{ translateX: pillX }] }]} />
      <Pressable onPress={() => handlePress(false)} style={toggleStyles.option}>
        <Ionicons name="sunny" size={13} color={lightActive ? '#fff' : theme.textMuted} />
        <Text style={[toggleStyles.optionText, { color: lightActive ? '#fff' : theme.textMuted }]}>Light</Text>
      </Pressable>
      <Pressable onPress={() => handlePress(true)} style={toggleStyles.option}>
        <Ionicons name="moon" size={13} color={darkActive ? '#fff' : theme.textMuted} />
        <Text style={[toggleStyles.optionText, { color: darkActive ? '#fff' : theme.textMuted }]}>Dark</Text>
      </Pressable>
    </View>
  );
};

const toggleStyles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    borderRadius: 999,
    borderWidth: 1,
    padding: TOGGLE_PAD,
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
  },
  pill: {
    position: 'absolute',
    top: TOGGLE_PAD,
    left: TOGGLE_PAD,
    borderRadius: 999,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    zIndex: 1,
    height: TOGGLE_H - TOGGLE_PAD * 2,
  },
  optionText: {
    fontSize: 12,
    fontWeight: '700',
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export const SettingsScreen: React.FC = () => {
  const {
    settings,
    updateSettings,
    clearStoreData,
    exportDataJSON,
    importDataJSON,
    language,
    setLanguage,
    t,
    setActiveTab,
    products,
    todaySalesTotal,
    khata,
    user,
    authLoading,
    syncStatus,
    signInWithGoogle,
    logout,
    deleteAccount,
    syncNow,
    setIsAuthModalOpen,
  } = useShop();

  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const [activeSegment, setActiveSegment] = useState<Segment>('profile');
  const [segContainerWidth, setSegContainerWidth] = useState(0);
  const segAnim = useRef(new Animated.Value(0)).current;

  const handleSegmentPress = (seg: Segment) => {
    if (seg === activeSegment) return;
    setActiveSegment(seg);
    const toValue = seg === 'profile' ? 0 : 1;
    Animated.spring(segAnim, {
      toValue,
      damping: 18,
      stiffness: 200,
      mass: 0.7,
      useNativeDriver: false,
    }).start();
  };
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCurrencyPickerOpen, setIsCurrencyPickerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const [showImportBox, setShowImportBox] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  // Google Drive Backup
  const [driveAuth, setDriveAuth] = useState<GoogleDriveAuth | null>(null);
  const [driveLoading, setDriveLoading] = useState(false);
  const [driveBackupLoading, setDriveBackupLoading] = useState(false);
  const [driveBackupSuccess, setDriveBackupSuccess] = useState<string | null>(null);

  useEffect(() => {
    googleDriveService.getSavedAuth().then(setDriveAuth);
  }, []);

  // Profile fields (shop logo & store identity)
  const isGoogleAvatar = (url?: string | null) => !!url && url.includes('googleusercontent.com/a/');
  const cleanInitialPhoto = settings.profileImage && !isGoogleAvatar(settings.profileImage) ? settings.profileImage : '';
  const [profileImage, setProfileImage] = useState(cleanInitialPhoto);
  const [shopName, setShopName] = useState(settings.shopName);
  const [shopNameUrdu, setShopNameUrdu] = useState(settings.shopNameUrdu);
  const [ownerName, setOwnerName] = useState(settings.ownerName || user?.displayName || '');
  const [businessType, setBusinessType] = useState(settings.businessType || 'Kiryana & General Store');
  const [phone, setPhone] = useState(settings.phone);
  const [alternatePhone, setAlternatePhone] = useState(settings.alternatePhone || '');
  const [email, setEmail] = useState(settings.email || user?.email || '');
  const [address, setAddress] = useState(settings.address);
  const [city, setCity] = useState(settings.city || '');
  const [taxNumber, setTaxNumber] = useState(settings.taxNumber || '');
  const [paymentDetails, setPaymentDetails] = useState(settings.paymentDetails || '');
  const [businessHours, setBusinessHours] = useState(settings.businessHours || '');

  // Preferences fields (currency is saved straight from the picker)
  const selectedCurrency = findCurrency(settings.currencyCode, settings.currencySymbol);
  const [footerNote, setFooterNote] = useState(settings.footerNote);
  const [footerNoteUrdu, setFooterNoteUrdu] = useState(settings.footerNoteUrdu);
  const [lowStockThreshold, setLowStockThreshold] = useState(settings.lowStockThreshold.toString());

  // Synchronize form fields whenever settings or user updates (e.g. from Firebase sync)
  useEffect(() => {
    setProfileImage(settings.profileImage && !isGoogleAvatar(settings.profileImage) ? settings.profileImage : '');
    setShopName(settings.shopName);
    setShopNameUrdu(settings.shopNameUrdu);
    setOwnerName(settings.ownerName || user?.displayName || '');
    setBusinessType(settings.businessType || 'Kiryana & General Store');
    setPhone(settings.phone);
    setAlternatePhone(settings.alternatePhone || '');
    setEmail(settings.email || user?.email || '');
    setAddress(settings.address);
    setCity(settings.city || '');
    setTaxNumber(settings.taxNumber || '');
    setPaymentDetails(settings.paymentDetails || '');
    setBusinessHours(settings.businessHours || '');
    setFooterNote(settings.footerNote);
    setFooterNoteUrdu(settings.footerNoteUrdu);
    setLowStockThreshold(settings.lowStockThreshold.toString());
  }, [settings, user]);

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
        handleLogoSelected(result.assets[0].uri);
      }
    } catch (e) {
      console.warn('Image picker error:', e);
    }
  };

  const toPersistentDataUrl = async (uri: string): Promise<string> => {
    if (!uri || uri.startsWith('data:')) return uri;
    try {
      const res = await fetch(uri);
      const blob = await res.blob();
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string) || uri);
        reader.onerror = () => resolve(uri);
        reader.readAsDataURL(blob);
      });
    } catch {
      return uri;
    }
  };

  const handleLogoSelected = async (localUri: string) => {
    try {
      const persistentUri = await toPersistentDataUrl(localUri);
      setProfileImage(persistentUri);
      await updateSettings({ profileImage: persistentUri });

      // Upload directly to Google Drive if connected
      const auth = await googleDriveService.getSavedAuth();
      if (auth) {
        googleDriveService
          .uploadProfileLogo(persistentUri)
          .then(async (driveUrl) => {
            if (driveUrl) {
              setProfileImage(driveUrl);
              await updateSettings({ profileImage: driveUrl });
            }
          })
          .catch((e) => console.warn('[SettingsScreen] Drive logo upload error:', e));
      }
    } catch (e) {
      console.warn('[SettingsScreen] Logo select error:', e);
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
      if (Platform.OS === 'web') {
        window.alert('Data restored!');
      } else {
        Alert.alert(t('success'), 'Data restored!');
      }
      setImportJsonText('');
      setShowImportBox(false);
    } else {
      if (Platform.OS === 'web') {
        window.alert('Invalid backup JSON.');
      } else {
        Alert.alert(t('error'), 'Invalid backup JSON.');
      }
    }
  };

  const handleReset = () => {
    const confirmMsg = t('resetConfirm');
    if (Platform.OS === 'web') {
      if (window.confirm(confirmMsg)) {
        clearStoreData();
        window.alert(language === 'ur' ? 'ڈیٹا صاف ہو گیا!' : 'Store data cleared!');
      }
    } else {
      Alert.alert(t('warningAlert'), confirmMsg, [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('confirm'),
          style: 'destructive',
          onPress: async () => {
            await clearStoreData();
            Alert.alert(t('success'), language === 'ur' ? 'ڈیٹا صاف ہو گیا!' : 'Store data cleared!');
          },
        },
      ]);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      const res = await signInWithGoogle();
      if (!res.success) {
        if (Platform.OS === 'web') {
          window.alert(res.error || 'Failed to sign in with Google');
        } else {
          Alert.alert(t('error'), res.error || 'Failed to sign in with Google');
        }
      } else {
        const msg = 'Google account connected! Cloud sync is now active.';
        if (Platform.OS === 'web') {
          window.alert(msg);
        } else {
          Alert.alert(t('success'), msg);
        }
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLogout = () => {
    const confirmAction = async () => {
      await logout();
      const msg = 'Signed out. Your local records are safe.';
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert(t('success'), msg);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Sign out from Google? Your local store data will remain safe.')) {
        confirmAction();
      }
    } else {
      Alert.alert(t('confirm'), 'Sign out from Google? Your local store data will remain safe.', [
        { text: t('cancel'), style: 'cancel' },
        { text: t('signOut'), style: 'destructive', onPress: confirmAction },
      ]);
    }
  };

  const handleDeleteAccount = () => {
    const confirmMsg = t('deleteAccountConfirm');

    const executeDeletion = async () => {
      try {
        setIsDeletingAccount(true);
        const res = await deleteAccount();
        if (!res.success) {
          const errMsg = res.error || 'Failed to delete account';
          if (Platform.OS === 'web') {
            window.alert(errMsg);
          } else {
            Alert.alert(t('error'), errMsg);
          }
        } else {
          const successMsg = t('deleteAccountSuccess');
          if (Platform.OS === 'web') {
            window.alert(successMsg);
          } else {
            Alert.alert(t('success'), successMsg);
          }
        }
      } catch (err: any) {
        const errMsg = err?.message || 'Failed to delete account';
        if (Platform.OS === 'web') {
          window.alert(errMsg);
        } else {
          Alert.alert(t('error'), errMsg);
        }
      } finally {
        setIsDeletingAccount(false);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(confirmMsg)) {
        executeDeletion();
      }
    } else {
      Alert.alert(
        t('warningAlert'),
        confirmMsg,
        [
          { text: t('cancel'), style: 'cancel' },
          {
            text: t('deleteAccount'),
            style: 'destructive',
            onPress: executeDeletion,
          },
        ]
      );
    }
  };


  const handleSyncNow = async () => {
    const res = await syncNow();
    const isSuccess = res ? res.success : true;
    const msg = isSuccess ? 'All store data synced to Firebase!' : `Sync encountered an error: ${res?.error || 'Failed'}`;
    if (Platform.OS === 'web') {
      window.alert(msg);
    } else {
      Alert.alert(isSuccess ? t('success') : t('error'), msg);
    }
  };

  const handleConnectDrive = async () => {
    setDriveLoading(true);
    try {
      const res = await googleDriveService.connect();
      if (res.success && res.user) {
        setDriveAuth(res.user);
        const msg = language === 'ur'
          ? 'گوگل ڈرائیو کامیابی سے منسلک ہو گئی!'
          : 'Google Drive connected successfully!';
        if (Platform.OS === 'web') {
          window.alert(msg);
        } else {
          Alert.alert(t('success'), msg);
        }
      } else {
        const err = res.error || 'Failed to connect Google Drive';
        if (Platform.OS === 'web') {
          window.alert(err);
        } else {
          Alert.alert(t('error'), err);
        }
      }
    } catch (e: any) {
      console.error('[SettingsScreen] Drive connect error:', e);
    } finally {
      setDriveLoading(false);
    }
  };

  const handleDisconnectDrive = async () => {
    const confirmMsg = language === 'ur'
      ? 'کیا آپ گوگل ڈرائیو منقطع کرنا چاہتے ہیں؟'
      : 'Disconnect Google Drive? Your existing files will remain safe.';
    const doDisconnect = async () => {
      await googleDriveService.disconnect();
      setDriveAuth(null);
    };

    if (Platform.OS === 'web') {
      if (window.confirm(confirmMsg)) {
        await doDisconnect();
      }
    } else {
      Alert.alert(t('confirm'), confirmMsg, [
        { text: t('no'), style: 'cancel' },
        { text: t('yes'), onPress: doDisconnect, style: 'destructive' },
      ]);
    }
  };

  const handleBackupToDrive = async () => {
    if (!driveAuth) {
      await handleConnectDrive();
      return;
    }
    setDriveBackupLoading(true);
    setDriveBackupSuccess(null);
    try {
      const jsonStr = exportDataJSON();
      const res = await googleDriveService.uploadStoreBackup(jsonStr);
      setDriveBackupSuccess(res.name);
      const msg = language === 'ur'
        ? `بیک اپ محفوظ ہو گیا: ${res.name}`
        : `Store backed up to Google Drive: ${res.name}`;
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert(t('success'), msg);
      }
    } catch (e: any) {
      console.error('[SettingsScreen] Drive backup error:', e);
      const err = e?.message || 'Failed to backup to Google Drive.';
      if (err.includes('Google Drive API has not been used') || err.includes('disabled')) {
        if (Platform.OS === 'web') {
          window.open(
            'https://console.developers.google.com/apis/api/drive.googleapis.com/overview?project=65013515513',
            '_blank'
          );
          window.alert(
            'We opened the Google Cloud Console in a new tab for you!\n\n' +
            '1. Click the blue "ENABLE" button on that page.\n' +
            '2. Wait 1 minute.\n' +
            '3. Come back and retry your backup.'
          );
        } else {
          Alert.alert(
            'Google Drive Setup Required',
            'Please visit:\nhttps://console.developers.google.com/apis/api/drive.googleapis.com/overview?project=65013515513\n\nand click "ENABLE".'
          );
        }
      } else {
        if (Platform.OS === 'web') {
          window.alert(err);
        } else {
          Alert.alert(t('error'), err);
        }
      }
    } finally {
      setDriveBackupLoading(false);
    }
  };

  const handleOpenDriveFolder = async () => {
    try {
      const rootId = await googleDriveService.getRootFolderId();
      const folderUrl = rootId
        ? `https://drive.google.com/drive/folders/${rootId}`
        : 'https://drive.google.com/drive/my-drive';
      if (Platform.OS === 'web') {
        window.open(folderUrl, '_blank');
      } else {
        Linking.openURL(folderUrl).catch((err) =>
          console.warn('Could not open drive URL:', err)
        );
      }
    } catch {
      const folderUrl = 'https://drive.google.com/drive/my-drive';
      if (Platform.OS === 'web') {
        window.open(folderUrl, '_blank');
      } else {
        Linking.openURL(folderUrl).catch(() => {});
      }
    }
  };

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

        {/* Spacer to keep title centred */}
        <View style={styles.headerSpacer} />
      </View>

      {/* ── Google Cloud Quick Status Banner ─────────────────────────────── */}
      <Pressable
        onPress={() => setIsAuthModalOpen(true)}
        style={({ pressed }) => [
          styles.cloudTopBanner,
          {
            backgroundColor: user
              ? (settings.darkMode ? '#064E3B22' : '#F0FDF4')
              : (settings.darkMode ? '#1E293B' : '#F8FAFC'),
            borderColor: user ? '#86EFAC' : theme.border,
          },
          pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] },
        ]}
      >
        <View style={styles.cloudTopBannerLeft}>
          <View style={[styles.cloudTopIcon, { backgroundColor: user ? '#DCFCE7' : theme.primaryLight }]}>
            <Ionicons
              name={user ? 'cloud-done' : 'cloud-upload'}
              size={18}
              color={user ? '#15803D' : theme.primary}
            />
          </View>
          <View style={styles.cloudTopTextWrap}>
            <Text style={[styles.cloudTopTitle, { color: theme.text }]} numberOfLines={1}>
              {user ? (user.displayName || user.email) : (language === 'ur' ? 'گوگل کلاؤڈ بیک اپ' : 'Google Cloud Backup')}
            </Text>
            <Text style={[styles.cloudTopSub, { color: user ? '#16A34A' : theme.textMuted }]} numberOfLines={1}>
              {user
                ? (syncStatus === 'syncing' ? 'Syncing with cloud...' : syncStatus === 'synced' ? 'Connected & Backed Up to Firebase' : 'Connected to Firebase (Pending Sync)')
                : (language === 'ur' ? 'ڈیٹا محفوظ کرنے کیلئے گوگل سے لاگ ان کریں' : 'Tap to connect & sync your store records')}
            </Text>
          </View>
        </View>
        <View style={styles.cloudTopBannerRight}>
          <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
        </View>
      </Pressable>

      {/* ── Segment Switcher ─────────────────────────────────────────────── */}
      <View
        style={[styles.segmentWrap, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}
        onLayout={(e: LayoutChangeEvent) => setSegContainerWidth(e.nativeEvent.layout.width)}
      >
        {/* Animated sliding pill */}
        {segContainerWidth > 0 && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.segPill,
              {
                backgroundColor: theme.primary,
                width: (segContainerWidth - 10) / 2,
                transform: [{
                  translateX: segAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, (segContainerWidth - 10) / 2],
                  }),
                }],
              },
            ]}
          />
        )}
        {([
          { key: 'profile', icon: 'storefront' as const, label: t('profileTab'), activeAt: 0 },
          { key: 'settings', icon: 'options' as const, label: t('preferencesTab'), activeAt: 1 },
        ] as const).map((seg) => {
          const isActive = activeSegment === seg.key;
          return (
            <Pressable
              key={seg.key}
              onPress={() => handleSegmentPress(seg.key)}
              style={styles.segBtn}
            >
              <Ionicons name={seg.icon} size={16} color={isActive ? '#FFFFFF' : theme.textMuted} />
              <Text style={[styles.segBtnText, { color: isActive ? '#FFFFFF' : theme.textMuted }]}>
                {seg.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* ════════════════════════ PROFILE TAB ════════════════════════════════ */}
      {activeSegment === 'profile' && (
        <>
          {/* Avatar Card */}
          <View style={[styles.avatarCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            {/* Avatar */}
            <View style={styles.avatarRow}>
              <Pressable onPress={pickImage} style={styles.avatarTapArea}>
                {profileImage && !isGoogleAvatar(profileImage) ? (
                  <ProductImage
                    uri={profileImage}
                    style={[styles.avatar, { borderColor: theme.primary }]}
                    fallbackIcon={
                      <View style={[styles.avatarFallback, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
                        <Ionicons name="storefront" size={34} color={theme.primary} />
                      </View>
                    }
                  />
                ) : (
                  <View style={[styles.avatarFallback, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
                    <Ionicons name="storefront" size={34} color={theme.primary} />
                  </View>
                )}
                <View style={[styles.cameraBadge, { backgroundColor: theme.primary }]}>
                  <Ionicons name="camera" size={13} color="#fff" />
                </View>
              </Pressable>

              <View style={styles.avatarInfo}>
                <Text style={[styles.avatarName, { color: theme.text }]} numberOfLines={1}>
                  {ownerName || user?.displayName || 'Proprietor Name'}
                </Text>
                <Text style={[styles.avatarShop, { color: theme.primary }]} numberOfLines={1}>
                  {(language === 'ur' && shopNameUrdu) ? shopNameUrdu : shopName || 'Store Name'}
                </Text>
                <Text style={[styles.avatarType, { color: theme.textMuted }]}>{businessType}</Text>
                {user ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <Ionicons name="logo-google" size={12} color="#0284C7" />
                    <Text style={{ fontSize: 11, color: '#0284C7', fontWeight: '600' }} numberOfLines={1}>
                      {user.displayName ? `${user.displayName} • ${user.email}` : user.email}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>

            {/* Photo Action Buttons */}
            <View style={styles.photoActions}>
              {user && (
                <Pressable
                  onPress={() => {
                    if (user.displayName) {
                      setOwnerName(user.displayName);
                      if (!shopName || shopName === 'My Store' || shopName === 'Madina Super Store') {
                        setShopName(`${user.displayName}'s Store`);
                      }
                      if (!shopNameUrdu || shopNameUrdu === 'میری دکان' || shopNameUrdu === 'مدینہ سپر اسٹور اینڈ کریانہ') {
                        setShopNameUrdu(`${user.displayName} اسٹور`);
                      }
                    }
                    if (user.email) setEmail(user.email);
                  }}
                  style={[styles.photoBtn, { backgroundColor: '#E0F2FE', borderWidth: 1, borderColor: '#7DD3FC' }]}
                >
                  <Ionicons name="logo-google" size={14} color="#0284C7" />
                  <Text style={[styles.photoBtnText, { color: '#0284C7', fontWeight: '700' }]}>
                    {language === 'ur' ? 'گوگل پروفائل حاصل کریں' : 'Sync Google Info'}
                  </Text>
                </Pressable>
              )}
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
              {profileImage && !isGoogleAvatar(profileImage) ? (
                <Pressable
                  onPress={async () => {
                    setProfileImage('');
                    await updateSettings({ profileImage: undefined });
                  }}
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
          <View style={styles.sectionWrap}>
            <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>{t('identitySection').toUpperCase()}</Text>
            <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <StackedField
                icon="storefront-outline" iconColor={theme.primary} iconBg={theme.primaryLight}
                label={t('ownerNameLabel')}
                value={ownerName} onChangeText={setOwnerName}
                placeholder={user?.displayName || 'e.g. Shop Owner'}
                theme={theme}
              />
              <StackedField
                icon="business-outline" iconColor={theme.primary} iconBg={theme.primaryLight}
                label={t('shopNameLabel')}
                value={shopName} onChangeText={setShopName}
                placeholder={user?.displayName ? `${user.displayName}'s Store` : 'e.g. My Store'}
                theme={theme}
              />
              <StackedField
                icon="text-outline" iconColor={theme.primary} iconBg={theme.primaryLight}
                label={t('shopNameUrduLabel')}
                value={shopNameUrdu} onChangeText={setShopNameUrdu}
                placeholder={user?.displayName ? `${user.displayName} اسٹور` : 'مثلاً: میری دکان'}
                theme={theme}
                last
              />
            </View>
          </View>

          {/* Contact */}
          <View style={styles.sectionWrap}>
            <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>{t('contactSection').toUpperCase()}</Text>
            <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <StackedField
                icon="call-outline" iconColor="#0284C7" iconBg="#E0F2FE"
                label={t('phoneLabel')}
                value={phone} onChangeText={setPhone}
                placeholder="0300-1234567" keyboardType="phone-pad"
                theme={theme}
              />
              <StackedField
                icon="phone-portrait-outline" iconColor="#0284C7" iconBg="#E0F2FE"
                label={t('altPhoneLabel')}
                value={alternatePhone} onChangeText={setAlternatePhone}
                placeholder="0321-9876543" keyboardType="phone-pad"
                theme={theme}
              />
              <StackedField
                icon="mail-outline" iconColor="#7C3AED" iconBg="#EDE9FE"
                label={t('emailLabel')}
                value={email} onChangeText={setEmail}
                placeholder="store@gmail.com" keyboardType="email-address"
                theme={theme}
              />
              <StackedField
                icon="location-outline" iconColor="#D97706" iconBg="#FEF3C7"
                label={t('cityLabel')}
                value={city} onChangeText={setCity}
                placeholder="e.g. Lahore"
                theme={theme}
              />
              <StackedField
                icon="map-outline" iconColor="#D97706" iconBg="#FEF3C7"
                label={t('addressLabel')}
                value={address} onChangeText={setAddress}
                placeholder="Shop #14, Main Market"
                multiline
                theme={theme}
                last
              />
            </View>
          </View>

          {/* Payment & Tax */}
          <View style={styles.sectionWrap}>
            <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>{t('paymentSection').toUpperCase()}</Text>
            <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <StackedField
                icon="wallet-outline" iconColor="#059669" iconBg="#D1FAE5"
                label={t('paymentDetailsLabel')}
                value={paymentDetails} onChangeText={setPaymentDetails}
                placeholder="EasyPaisa: 0300-…"
                theme={theme}
              />
              <StackedField
                icon="document-text-outline" iconColor="#059669" iconBg="#D1FAE5"
                label={t('taxNumberLabel')}
                value={taxNumber} onChangeText={setTaxNumber}
                placeholder="NTN-XXXXXXX-X"
                theme={theme}
              />
              <StackedField
                icon="time-outline" iconColor="#059669" iconBg="#D1FAE5"
                label={t('businessHoursLabel')}
                value={businessHours} onChangeText={setBusinessHours}
                placeholder="08:00 AM – 11:30 PM"
                theme={theme}
                last
              />
            </View>
          </View>

          {/* ── Save Profile Button ── */}
          <Pressable
            onPress={handleSave}
            disabled={isSaving}
            style={({ pressed }) => [
              styles.fullSaveBtn,
              { backgroundColor: theme.primary },
              (pressed || isSaving) && { opacity: 0.85, transform: [{ scale: 0.99 }] },
            ]}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={22} color="#fff" />
                <Text style={styles.fullSaveBtnText}>{t('saveSettings')}</Text>
              </>
            )}
          </Pressable>
        </>
      )}

      {/* ════════════════════════ SETTINGS TAB ═══════════════════════════════ */}
      {activeSegment === 'settings' && (
        <>
          {/* Appearance */}
          <Section title="Appearance" theme={theme}>
            {/* Language */}
            <RowItem icon="language-outline" iconColor="#7C3AED" iconBg="#EDE9FE" label={t('languageLabel')} theme={theme}>
              <LangToggle value={language} onChange={setLanguage} theme={theme} />
            </RowItem>

            {/* Dark Mode */}
            <RowItem icon="moon-outline" iconColor="#6366F1" iconBg="#E0E7FF" label={t('darkModeLabel')} theme={theme} last>
              <DarkToggle value={settings.darkMode} onChange={(val) => updateSettings({ darkMode: val })} theme={theme} />
            </RowItem>
          </Section>

          {/* Billing */}
          <View style={styles.sectionWrap}>
            <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>{t('billingSection').toUpperCase()}</Text>
            <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              {/* Currency — keep as RowItem (opens picker, not a text input) */}
              <RowItem
                icon="cash-outline"
                iconColor="#059669"
                iconBg="#D1FAE5"
                label={t('currencyLabel')}
                sublabel={
                  selectedCurrency
                    ? language === 'ur' ? selectedCurrency.nameUrdu : selectedCurrency.name
                    : undefined
                }
                onPress={() => setIsCurrencyPickerOpen(true)}
                theme={theme}
              >
                <View style={styles.currencyValueRow}>
                  <Text style={[styles.currencyValueText, { color: theme.text }]} numberOfLines={1}>
                    {selectedCurrency
                      ? `${selectedCurrency.flag} ${selectedCurrency.code} · ${settings.currencySymbol}`
                      : settings.currencySymbol}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
                </View>
              </RowItem>
              <StackedField
                icon="alert-circle-outline" iconColor="#D97706" iconBg="#FEF3C7"
                label={t('lowStockThresholdLabel')}
                value={lowStockThreshold} onChangeText={setLowStockThreshold}
                keyboardType="numeric" placeholder="5"
                theme={theme}
              />
              <StackedField
                icon="receipt-outline" iconColor="#0284C7" iconBg="#E0F2FE"
                label={t('billFooterLabel')}
                value={footerNote} onChangeText={setFooterNote}
                placeholder="Thank you for shopping!"
                theme={theme}
              />
              <StackedField
                icon="language-outline" iconColor="#0284C7" iconBg="#E0F2FE"
                label={t('billFooterUrduLabel')}
                value={footerNoteUrdu} onChangeText={setFooterNoteUrdu}
                placeholder="خریداری کا شکریہ!"
                theme={theme}
                last
              />
            </View>
          </View>

          {/* ── Save Settings Button ── */}
          <Pressable
            onPress={handleSave}
            disabled={isSaving}
            style={({ pressed }) => [
              styles.fullSaveBtn,
              { backgroundColor: theme.primary },
              (pressed || isSaving) && { opacity: 0.85, transform: [{ scale: 0.99 }] },
            ]}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={22} color="#fff" />
                <Text style={styles.fullSaveBtnText}>{t('saveSettings')}</Text>
              </>
            )}
          </Pressable>

          {/* Google Cloud Backup & Account Section */}
          <Section title={t('googleAccount')} theme={theme}>
            {!user ? (
              <View style={styles.googleAuthCard}>
                <View style={styles.googleHeaderRow}>
                  <View style={styles.googleIconCircle}>
                    <Ionicons name="logo-google" size={22} color="#EA4335" />
                  </View>
                  <View style={styles.googleTextWrap}>
                    <Text style={[styles.googleTitle, { color: theme.text }]}>
                      {t('googleAccount')}
                    </Text>
                    <Text style={[styles.googleDesc, { color: theme.textMuted }]}>
                      {t('googleSyncDesc')}
                    </Text>
                  </View>
                </View>

                <Pressable
                  onPress={handleGoogleSignIn}
                  disabled={googleLoading || authLoading}
                  style={({ pressed }) => [
                    styles.googleSignInBtn,
                    (pressed || googleLoading) && { opacity: 0.85 },
                  ]}
                >
                  <Ionicons name="logo-google" size={18} color="#fff" />
                  <Text style={styles.googleSignInBtnText}>
                    {googleLoading ? t('syncing') : t('continueWithGoogle')}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.googleProfileCard}>
                <View style={styles.googleUserRow}>
                  {user.photoURL ? (
                    <Image source={{ uri: user.photoURL }} style={styles.googleAvatar} />
                  ) : (
                    <View style={[styles.googleAvatarFallback, { backgroundColor: theme.primaryLight }]}>
                      <Text style={[styles.googleAvatarText, { color: theme.primary }]}>
                        {(user.displayName || user.email || 'G')[0].toUpperCase()}
                      </Text>
                    </View>
                  )}
                  <View style={styles.googleUserInfo}>
                    <Text style={[styles.googleUserName, { color: theme.text }]} numberOfLines={1}>
                      {user.displayName || 'Google User'}
                    </Text>
                    <Text style={[styles.googleUserEmail, { color: theme.textMuted }]} numberOfLines={1}>
                      {user.email}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.syncBadge,
                      syncStatus === 'synced' && { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' },
                      syncStatus === 'syncing' && { backgroundColor: '#E0F2FE', borderColor: '#7DD3FC' },
                      syncStatus === 'error' && { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' },
                      syncStatus === 'idle' && { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
                    ]}
                  >
                    <Ionicons
                      name={
                        syncStatus === 'synced'
                          ? 'cloud-done'
                          : syncStatus === 'syncing'
                          ? 'cloud-upload'
                          : syncStatus === 'error'
                          ? 'alert-circle'
                          : 'cloud-outline'
                      }
                      size={13}
                      color={
                        syncStatus === 'synced'
                          ? '#15803D'
                          : syncStatus === 'syncing'
                          ? '#0284C7'
                          : syncStatus === 'error'
                          ? '#B91C1C'
                          : theme.textMuted
                      }
                    />
                    <Text
                      style={[
                        styles.syncBadgeText,
                        {
                          color:
                            syncStatus === 'synced'
                              ? '#15803D'
                              : syncStatus === 'syncing'
                              ? '#0284C7'
                              : syncStatus === 'error'
                              ? '#B91C1C'
                              : theme.textMuted,
                        },
                      ]}
                    >
                      {syncStatus === 'synced'
                        ? t('synced')
                        : syncStatus === 'syncing'
                        ? t('syncing')
                        : syncStatus === 'error'
                        ? t('syncError')
                        : 'Ready'}
                    </Text>
                  </View>
                </View>

                {/* Cloud Action Buttons */}
                <View style={styles.googleActionsRow}>
                  <Pressable
                    onPress={handleSyncNow}
                    disabled={syncStatus === 'syncing'}
                    style={({ pressed }) => [
                      styles.syncActionBtn,
                      { backgroundColor: theme.primaryLight },
                      pressed && { opacity: 0.8 },
                    ]}
                  >
                    <Ionicons name="sync-outline" size={15} color={theme.primary} />
                    <Text style={[styles.syncActionBtnText, { color: theme.primary }]}>
                      {t('syncNow')}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={handleLogout}
                    style={({ pressed }) => [
                      styles.signOutActionBtn,
                      { backgroundColor: theme.surfaceSubtle, borderColor: theme.border, borderWidth: 1 },
                      pressed && { opacity: 0.8 },
                    ]}
                  >
                    <Ionicons name="log-out-outline" size={15} color={theme.text} />
                    <Text style={[styles.signOutActionBtnText, { color: theme.text }]}>
                      {t('signOut')}
                    </Text>
                  </Pressable>
                </View>

                {/* Account & Data Deletion */}
                <Pressable
                  onPress={handleDeleteAccount}
                  disabled={isDeletingAccount}
                  style={({ pressed }) => [
                    styles.deleteAccountBtn,
                    { backgroundColor: theme.dangerLight, borderColor: '#FCA5A5', borderWidth: 1 },
                    (pressed || isDeletingAccount) && { opacity: 0.8 },
                  ]}
                >
                  {isDeletingAccount ? (
                    <ActivityIndicator size="small" color={theme.danger} />
                  ) : (
                    <Ionicons name="trash-outline" size={14} color={theme.danger} />
                  )}
                  <Text style={[styles.deleteAccountBtnText, { color: theme.danger }]}>
                    {isDeletingAccount ? t('deletingAccount') : t('deleteAccount')}
                  </Text>
                </Pressable>

              </View>
            )}
          </Section>

          {/* Google Drive Backup Section */}
          <Section title={t('googleDriveTitle')} theme={theme}>
            <View style={styles.driveCard}>
              <View style={styles.driveHeaderRow}>
                <View style={styles.driveIconCircle}>
                  <Ionicons name="logo-google" size={22} color="#0F9D58" />
                </View>
                <View style={styles.driveTextWrap}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={[styles.driveTitle, { color: theme.text }]}>
                      {t('googleDriveTitle')}
                    </Text>
                  </View>
                  <Text style={[styles.driveDesc, { color: theme.textMuted }]}>
                    {driveAuth
                      ? (language === 'ur'
                          ? `منسلک: ${driveAuth.email || 'Google Drive'} — تصاویر اور بیک اپ ڈرائیو میں محفوظ ہو رہے ہیں`
                          : `Connected: ${driveAuth.email || 'Google Drive'} — Photos & backups saving to Drive`)
                      : t('googleDriveDesc')}
                  </Text>
                </View>
              </View>

              {driveAuth ? (
                <View style={styles.driveConnectedContent}>
                  {/* Folder Row */}
                  <View style={[styles.driveFolderInfoRow, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
                    <Ionicons name="folder" size={16} color="#0F9D58" />
                    <Text style={[styles.driveFolderName, { color: theme.textSecondary }]} numberOfLines={1}>
                      {language === 'ur' ? 'فولڈر: Shopkeeper_Store_Data' : 'Folder: Shopkeeper_Store_Data'}
                    </Text>
                    <Pressable
                      onPress={handleOpenDriveFolder}
                      style={styles.driveOpenLinkBtn}
                    >
                      <Text style={styles.driveOpenLinkText}>
                        {language === 'ur' ? 'ڈرائیو کھولیں ↗' : 'Open in Drive ↗'}
                      </Text>
                    </Pressable>
                  </View>

                  {/* Backup Success Notice */}
                  {driveBackupSuccess && (
                    <View style={styles.backupSuccessNotice}>
                      <Ionicons name="checkmark-circle" size={14} color="#15803D" />
                      <Text style={styles.backupSuccessNoticeText}>
                        {t('backupToDriveSuccess')} ({driveBackupSuccess})
                      </Text>
                    </View>
                  )}

                  {/* Actions Row */}
                  <View style={styles.driveActionButtonsRow}>
                    <Pressable
                      onPress={handleBackupToDrive}
                      disabled={driveBackupLoading}
                      style={({ pressed }) => [
                        styles.driveBackupBtn,
                        { backgroundColor: '#0F9D58' },
                        (pressed || driveBackupLoading) && { opacity: 0.85 },
                      ]}
                    >
                      {driveBackupLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Ionicons name="cloud-upload" size={16} color="#fff" />
                      )}
                      <Text style={styles.driveBackupBtnText}>
                        {driveBackupLoading ? t('backingUpToDrive') : t('backupToDrive')}
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={handleDisconnectDrive}
                      style={({ pressed }) => [
                        styles.driveDisconnectBtn,
                        { borderColor: theme.border },
                        pressed && { opacity: 0.8 },
                      ]}
                    >
                      <Text style={[styles.driveDisconnectText, { color: theme.danger }]}>
                        {t('disconnectDrive')}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <Pressable
                  onPress={handleConnectDrive}
                  disabled={driveLoading}
                  style={({ pressed }) => [
                    styles.driveConnectBtn,
                    { backgroundColor: '#0F9D58' },
                    (pressed || driveLoading) && { opacity: 0.85 },
                  ]}
                >
                  {driveLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
                  )}
                  <Text style={styles.driveConnectBtnText}>
                    {driveLoading ? 'Connecting...' : t('connectDrive')}
                  </Text>
                </Pressable>
              )}
            </View>
          </Section>

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
              icon="trash-outline"
              iconColor="#DC2626"
              iconBg="#FEE2E2"
              label={t('resetSampleBtn')}
              sublabel={language === 'ur' ? 'تمام اشیاء، بل اور کھاتہ صاف کریں' : 'Wipe products, bills & khata'}
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
              <Pressable
                onPress={() => setImportJsonText(buildImportTemplateJSON())}
                style={[styles.importTemplateBtn, { borderColor: theme.primary }]}
              >
                <Ionicons name="document-text-outline" size={15} color={theme.primary} />
                <Text style={[styles.importTemplateText, { color: theme.primary }]}>
                  Fill sample template (products only)
                </Text>
              </Pressable>
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
          {/* About & Legal Section */}
          <Section title={t('aboutLegal')} theme={theme}>
            <RowItem
              icon="shield-checkmark-outline"
              iconColor="#2563EB"
              iconBg="#DBEAFE"
              label={t('privacyPolicy')}
              sublabel="View official privacy disclosures"
              onPress={() => openLegalUrl(LEGAL_CONFIG.privacyPolicyUrl)}
              theme={theme}
            />
            <RowItem
              icon="document-text-outline"
              iconColor="#0D9488"
              iconBg="#CCFBF1"
              label={t('termsOfService')}
              sublabel="View terms of service"
              onPress={() => openLegalUrl(LEGAL_CONFIG.termsOfServiceUrl)}
              theme={theme}
            />
            <RowItem
              icon="trash-bin-outline"
              iconColor="#DC2626"
              iconBg="#FEE2E2"
              label="Account & Data Deletion Portal"
              sublabel="Online data erasure request"
              onPress={() => openLegalUrl(LEGAL_CONFIG.accountDeletionUrl)}
              theme={theme}
            />
            <RowItem
              icon="information-circle-outline"
              iconColor="#64748B"
              iconBg="#F1F5F9"
              label="App Version"
              sublabel={`v${LEGAL_CONFIG.appVersion} (${LEGAL_CONFIG.packageName})`}
              theme={theme}
              last
            />
          </Section>

        </>
      )}

      {/* Bottom padding */}
      <View style={{ height: 40 }} />

      <CurrencyPickerModal
        visible={isCurrencyPickerOpen}
        onClose={() => setIsCurrencyPickerOpen(false)}
        onSelect={({ code, symbol }) => updateSettings({ currencyCode: code, currencySymbol: symbol })}
      />

      {/* Camera Modal */}
      <CameraModal
        visible={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(uri) => { handleLogoSelected(uri); setIsCameraOpen(false); }}
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

  // Spacer matching backBtn width to keep title centred
  headerSpacer: {
    width: 38,
  },

  // Segment
  segmentWrap: {
    flexDirection: 'row',
    borderRadius: BorderRadius.full,
    padding: 5,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    position: 'relative',
  },
  segPill: {
    position: 'absolute',
    top: 5,
    left: 5,
    bottom: 5,
    borderRadius: BorderRadius.full,
    ...Shadows.sm,
  },
  segBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.full,
    zIndex: 1,
  },
  segBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: -0.1,
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
  rowRight: { flex: 1, maxWidth: '65%', alignItems: 'flex-end' },
  currencyValueRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  currencyValueText: { fontSize: 14, fontWeight: '700' },

  // Inline input
  inlineInput: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
    minWidth: 120,
    maxWidth: 280,
    width: '100%',
  },

  // Quick save button under store identity
  quickSaveContainer: {
    paddingHorizontal: Spacing.xs,
    marginTop: -Spacing.xs,
    marginBottom: Spacing.lg,
  },
  quickSaveBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },
  quickSaveBannerBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

// Save button — single prominent CTA at bottom of each tab
  fullSaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.lg,
    ...Shadows.lg,
  },
  fullSaveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.2 },

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
  importTemplateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  importTemplateText: { fontSize: 13, fontWeight: '700' },
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

  // Google Auth & Cloud Backup styles
  googleAuthCard: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  googleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  googleIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleTextWrap: {
    flex: 1,
  },
  googleTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  googleDesc: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  googleSignInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    marginTop: 4,
    ...Shadows.sm,
  },
  googleSignInBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  googleProfileCard: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  googleUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  googleAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  googleAvatarFallback: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleAvatarText: {
    fontSize: 18,
    fontWeight: '700',
  },
  googleUserInfo: {
    flex: 1,
  },
  googleUserName: {
    fontSize: 15,
    fontWeight: '700',
  },
  googleUserEmail: {
    fontSize: 12,
    marginTop: 1,
  },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  syncBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  googleActionsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  syncActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
  },
  syncActionBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  signOutActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
  },
  signOutActionBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  deleteAccountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.xs,
  },
  deleteAccountBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },

  cloudTopBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  cloudTopBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  cloudTopIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cloudTopTextWrap: {
    flex: 1,
  },
  cloudTopTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  cloudTopSub: {
    fontSize: 12,
    marginTop: 1,
  },
  cloudTopBannerRight: {
    marginLeft: Spacing.sm,
  },

  // Google Drive Styles
  driveCard: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  driveHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  driveIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driveTextWrap: {
    flex: 1,
  },
  driveTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  driveStoragePill: {
    backgroundColor: '#0F9D58',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  driveStoragePillText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  driveDesc: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  driveConnectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    marginTop: 4,
    ...Shadows.sm,
  },
  driveConnectBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  driveConnectedContent: {
    gap: Spacing.md,
    marginTop: 4,
  },
  driveFolderInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: 8,
  },
  driveFolderName: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
  },
  driveOpenLinkBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  driveOpenLinkText: {
    color: '#0F9D58',
    fontSize: 12,
    fontWeight: '700',
  },
  backupSuccessNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
  },
  backupSuccessNoticeText: {
    color: '#15803D',
    fontSize: 12,
    fontWeight: '600',
  },
  driveActionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  driveBackupBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: BorderRadius.full,
    ...Shadows.sm,
  },
  driveBackupBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  driveDisconnectBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driveDisconnectText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
