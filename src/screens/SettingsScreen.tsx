import { CameraModal } from '@/components/CameraModal';
import { CurrencyPickerModal } from '@/components/CurrencyPickerModal';
import { ProductImage } from '@/components/ProductImage';
import { findCurrency } from '@/constants/currencies';
import { LEGAL_CONFIG, openLegalUrl } from '@/constants/legal';
import { BorderRadius, Colors, Shadows, Spacing, ThemeColors, Typography } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';
import { GoogleDriveAuth, googleDriveService } from '@/services/googleDriveService';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';
import * as Sharing from 'expo-sharing';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  BackHandler,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  LayoutChangeEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
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
  onFocus?: () => void;
  theme: ThemeColors;
}> = ({ value, onChangeText, placeholder, keyboardType = 'default', onSubmitEditing, onFocus, theme }) => (
  <TextInput
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    placeholderTextColor={theme.textMuted}
    keyboardType={keyboardType}
    onSubmitEditing={onSubmitEditing}
    onFocus={onFocus}
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
  onFocus?: () => void;
}> = ({ icon, iconColor, iconBg, label, value, onChangeText, placeholder, keyboardType = 'default', multiline = false, theme, last, onFocus }) => (
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
      onFocus={onFocus}
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
    <View style={[toggleStyles.track, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border, width: DM_W }]}>
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
    showAlert,
  } = useShop();

  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const [activeSegment, setActiveSegment] = useState<Segment>('profile');
  const [segContainerWidth, setSegContainerWidth] = useState(0);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
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
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [showImportBox, setShowImportBox] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Google Drive Backup
  const [driveAuth, setDriveAuth] = useState<GoogleDriveAuth | null>(null);
  const [driveLoading, setDriveLoading] = useState(false);
  const [driveBackupLoading, setDriveBackupLoading] = useState(false);
  const [driveBackupSuccess, setDriveBackupSuccess] = useState<string | null>(null);

  useEffect(() => {
    googleDriveService.getSavedAuth().then(setDriveAuth);
  }, []);

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardHeight(0)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
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

  // Detect whether user has modified any form field compared to current saved settings
  const isFormDirty =
    shopName.trim() !== (settings.shopName || '').trim() ||
    shopNameUrdu.trim() !== (settings.shopNameUrdu || '').trim() ||
    ownerName.trim() !== (settings.ownerName || user?.displayName || '').trim() ||
    businessType.trim() !== (settings.businessType || 'Kiryana & General Store').trim() ||
    phone.trim() !== (settings.phone || '').trim() ||
    alternatePhone.trim() !== (settings.alternatePhone || '').trim() ||
    email.trim() !== (settings.email || user?.email || '').trim() ||
    address.trim() !== (settings.address || '').trim() ||
    city.trim() !== (settings.city || '').trim() ||
    taxNumber.trim() !== (settings.taxNumber || '').trim() ||
    paymentDetails.trim() !== (settings.paymentDetails || '').trim() ||
    businessHours.trim() !== (settings.businessHours || '').trim() ||
    footerNote.trim() !== (settings.footerNote || '').trim() ||
    footerNoteUrdu.trim() !== (settings.footerNoteUrdu || '').trim() ||
    lowStockThreshold.trim() !== (settings.lowStockThreshold || 5).toString().trim() ||
    profileImage.trim() !== (settings.profileImage && !isGoogleAvatar(settings.profileImage) ? settings.profileImage : '').trim();

  // Synchronize form fields whenever settings or user updates (e.g. from Firebase sync), protecting active user edits
  useEffect(() => {
    if (isFormDirty) return;
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
  }, [settings, user, isFormDirty]);

  // Prompt unsaved changes warning using reusable AlertModal
  const promptUnsavedChanges = () => {
    showAlert({
      type: 'warning',
      title: language === 'ur' ? 'غیر محفوظ شدہ تبدیلیاں' : 'Unsaved Changes',
      message:
        language === 'ur'
          ? 'آپ نے ترتیبات میں کچھ تبدیلیاں کی ہیں۔ واپس جانے سے پہلے کیا آپ انہیں محفوظ کرنا چاہتے ہیں؟'
          : 'You have unsaved changes in your store settings. Do you want to save them before leaving?',
      buttons: [
        {
          text: language === 'ur' ? 'محفوظ کریں اور واپس جائیں' : 'Save & Exit',
          style: 'primary',
          icon: 'checkmark-circle',
          onPress: async () => {
            await handleSave();
            setActiveTab('dashboard');
          },
        },
        {
          text: language === 'ur' ? 'تبدیلیاں ضائع کریں' : 'Discard Changes',
          style: 'destructive',
          icon: 'trash-outline',
          onPress: () => {
            setActiveTab('dashboard');
          },
        },
        {
          text: language === 'ur' ? 'ترمیم جاری رکھیں' : 'Keep Editing',
          style: 'cancel',
        },
      ],
    });
  };

  // Handle back button press with dirty check
  const handleBackPress = () => {
    if (isFormDirty) {
      promptUnsavedChanges();
    } else {
      setActiveTab('dashboard');
    }
  };

  // Intercept hardware back button on Android
  useEffect(() => {
    const onHardwareBack = () => {
      if (isCameraOpen) {
        setIsCameraOpen(false);
        return true;
      }
      if (isCurrencyPickerOpen) {
        setIsCurrencyPickerOpen(false);
        return true;
      }
      if (showImportBox) {
        setShowImportBox(false);
        return true;
      }
      if (isFormDirty) {
        promptUnsavedChanges();
      } else {
        setActiveTab('dashboard');
      }
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onHardwareBack);
    return () => sub.remove();
  }, [isCameraOpen, isCurrencyPickerOpen, showImportBox, isFormDirty, setActiveTab]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const pickImage = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          showAlert({
            type: 'warning',
            title: t('warningAlert'),
            message: 'Gallery permission is required to select photos.',
          });
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

  const reminderLang = settings.whatsappReminderLanguage || 'en';
  const isUrduReminder = reminderLang === 'ur';

  const defaultReminderUrdu = useMemo(() => {
    const shopUr = settings.shopNameUrdu || settings.shopName || 'دکان کا نام';
    const phoneUr = settings.phone || '0300-1234567';
    return `السلام علیکم احمد صاحب!\nامید ہے آپ بخیریت ہوں گے۔\n\nیہ ایک شائستہ یاد دہانی ہے کہ *${shopUr}* پر آپ کا کل واجب الادا بقایا ادھار:\n👉 *${settings.currencySymbol} 2,500* ہے۔\n\nبرائے مہربانی سہولت کے مطابق تشریف لا کر رقم ادا فرما دیں۔\n\nشکریہ و جزاک اللہ!\n*${settings.shopName}*\n📞 ${phoneUr}`;
  }, [settings.shopName, settings.shopNameUrdu, settings.phone, settings.currencySymbol]);

  const defaultReminderEnglish = useMemo(() => {
    const shopEn = settings.shopName || 'Shop Name';
    const phoneEn = settings.phone || '0300-1234567';
    return `Dear Ahmed,\n\nHope you are doing well.\n\nThis is a gentle reminder from *${shopEn}* regarding your pending balance:\n👉 *${settings.currencySymbol} 2,500*\n\nKindly arrange for the payment at your earliest convenience.\n\nThank you!\n*${shopEn}*\n📞 ${phoneEn}`;
  }, [settings.shopName, settings.phone, settings.currencySymbol]);

  const customUr = settings.whatsappReminderCustomUr?.trim() ? settings.whatsappReminderCustomUr : undefined;
  const customEn = settings.whatsappReminderCustomEn?.trim() ? settings.whatsappReminderCustomEn : undefined;

  const defaultTemplate = isUrduReminder ? defaultReminderUrdu : defaultReminderEnglish;

  const activeReminderText = isUrduReminder
    ? (customUr ?? defaultReminderUrdu)
    : (customEn ?? defaultReminderEnglish);

  const [reminderDraft, setReminderDraft] = useState(activeReminderText);
  const isReminderFocusedRef = useRef(false);

  // Synchronize draft when active template/language changes, but NEVER while the user is actively typing/focused
  useEffect(() => {
    if (!isReminderFocusedRef.current) {
      setReminderDraft(activeReminderText);
    }
  }, [activeReminderText]);

  // Live customization indicator: matches either the active draft or saved setting compared against default
  const isReminderCustomized = Boolean(
    (reminderDraft.trim() && reminderDraft.trim() !== defaultTemplate.trim()) ||
    (isUrduReminder
      ? (customUr && customUr.trim() !== defaultTemplate.trim())
      : (customEn && customEn.trim() !== defaultTemplate.trim()))
  );

  const commitReminderText = useCallback(() => {
    const trimmed = reminderDraft.trim();
    const isDefault = !trimmed || trimmed === defaultTemplate.trim();
    if (isUrduReminder) {
      updateSettings({ whatsappReminderCustomUr: isDefault ? undefined : reminderDraft });
    } else {
      updateSettings({ whatsappReminderCustomEn: isDefault ? undefined : reminderDraft });
    }
  }, [reminderDraft, defaultTemplate, isUrduReminder, updateSettings]);

  const handleReminderLangChange = (newLang: 'en' | 'ur') => {
    // Before switching language, commit current draft to its current language so edits aren't lost
    commitReminderText();
    isReminderFocusedRef.current = false;
    updateSettings({ whatsappReminderLanguage: newLang });
  };

  const handleResetReminderText = () => {
    isReminderFocusedRef.current = false;
    if (isUrduReminder) {
      updateSettings({ whatsappReminderCustomUr: undefined });
      setReminderDraft(defaultReminderUrdu);
    } else {
      updateSettings({ whatsappReminderCustomEn: undefined });
      setReminderDraft(defaultReminderEnglish);
    }
    showAlert({
      type: 'info',
      title: language === 'ur' ? 'اصل بحال ہو گیا' : 'Reset to Default',
      message: language === 'ur'
        ? 'واٹس ایپ یاد دہانی کا پیغام اصل ٹیمپلیٹ میں بحال کر دیا گیا۔'
        : 'Reminder message has been restored to the original default template.',
    });
  };

  const handleSyncGoogleProfile = () => {
    if (!user) return;
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
    showAlert({
      type: 'success',
      title: language === 'ur' ? 'گوگل پروفائل سنک ہو گیا' : 'Google Info Synced',
      message: language === 'ur'
        ? 'نام اور ای میل کامیابی سے گوگل سے حاصل کر لیے گئے۔'
        : 'Name and email have been synced from your Google account.',
    });
  };

  const handleRemovePhoto = async () => {
    setProfileImage('');
    await updateSettings({ profileImage: undefined });
  };

  const handleSave = async () => {
    commitReminderText();
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
      showAlert({
        type: 'success',
        title: t('success'),
        message: t('settingsSaved'),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    const jsonStr = exportDataJSON();
    const fileName = `shopkeeper_backup_${new Date().toISOString().slice(0, 10)}.json`;
    if (Platform.OS === 'web') {
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      try {
        const path = `${FileSystem.cacheDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(path, jsonStr, { encoding: FileSystem.EncodingType.UTF8 });
        await Sharing.shareAsync(path, { mimeType: 'application/json', dialogTitle: 'Save Backup File' });
        showAlert({
          type: 'success',
          title: 'Backup Ready',
          message: 'Store backup JSON has been generated successfully.',
        });
      } catch {
        showAlert({
          type: 'error',
          title: t('error'),
          message: 'Could not export backup file.',
        });
      }
    }
  };

  const handleImportFromFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: Platform.OS === 'web' ? 'application/json' : '*/*',
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets?.[0]) return;
      const asset = result.assets[0];
      let jsonStr: string;
      if (Platform.OS === 'web') {
        const res = await fetch(asset.uri);
        jsonStr = await res.text();
      } else {
        jsonStr = await FileSystem.readAsStringAsync(asset.uri, { encoding: FileSystem.EncodingType.UTF8 });
      }
      const success = await importDataJSON(jsonStr);
      if (success) {
        showAlert({
          type: 'success',
          title: t('success'),
          message: language === 'ur' ? 'ڈیٹا بحال ہو گیا!' : 'Store data restored successfully!',
        });
        setShowImportBox(false);
      } else {
        showAlert({
          type: 'error',
          title: t('error'),
          message: language === 'ur' ? 'فائل درست نہیں ہے۔' : 'Invalid backup file. Please select a valid shopkeeper backup.',
        });
      }
    } catch {
      showAlert({
        type: 'error',
        title: t('error'),
        message: 'Could not read the selected file.',
      });
    }
  };


  const handleReset = () => {
    const confirmMsg = t('resetConfirm');
    showAlert({
      type: 'danger',
      title: t('warningAlert'),
      message: confirmMsg,
      buttons: [
        {
          text: t('confirm'),
          style: 'destructive',
          icon: 'trash-outline',
          onPress: async () => {
            await clearStoreData();
            showAlert({
              type: 'success',
              title: t('success'),
              message: language === 'ur' ? 'ڈیٹا صاف ہو گیا!' : 'Store data cleared!',
            });
          },
        },
        { text: t('cancel'), style: 'cancel' },
      ],
    });
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      const res = await signInWithGoogle();
      if (!res.success) {
        showAlert({
          type: 'error',
          title: t('error'),
          message: res.error || 'Failed to sign in with Google',
        });
      } else {
        showAlert({
          type: 'success',
          title: t('success'),
          message: 'Google account connected! Cloud sync is now active.',
        });
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLogout = () => {
    showAlert({
      type: 'warning',
      title: t('confirm'),
      message: 'Sign out from Google? Your local store data will remain safe.',
      buttons: [
        {
          text: t('signOut'),
          style: 'destructive',
          icon: 'log-out-outline',
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              await logout();
            } catch (err: any) {
              showAlert({
                type: 'error',
                title: t('error'),
                message: err?.message || 'Failed to sign out',
              });
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
        { text: t('cancel'), style: 'cancel' },
      ],
    });
  };

  const handleDeleteAccount = () => {
    const confirmMsg = t('deleteAccountConfirm');
    showAlert({
      type: 'danger',
      title: t('warningAlert'),
      message: confirmMsg,
      buttons: [
        {
          text: t('deleteAccount'),
          style: 'destructive',
          icon: 'trash-outline',
          onPress: async () => {
            try {
              setIsDeletingAccount(true);
              const res = await deleteAccount();
              if (!res.success) {
                showAlert({
                  type: 'error',
                  title: t('error'),
                  message: res.error || 'Failed to delete account',
                });
              } else {
                showAlert({
                  type: 'success',
                  title: t('success'),
                  message: t('deleteAccountSuccess'),
                });
              }
            } catch (err: any) {
              showAlert({
                type: 'error',
                title: t('error'),
                message: err?.message || 'Failed to delete account',
              });
            } finally {
              setIsDeletingAccount(false);
            }
          },
        },
        { text: t('cancel'), style: 'cancel' },
      ],
    });
  };

  const handleSyncNow = async () => {
    const res = await syncNow();
    const isSuccess = res ? res.success : true;
    showAlert({
      type: isSuccess ? 'success' : 'error',
      title: isSuccess ? t('success') : t('error'),
      message: isSuccess
        ? 'All store data synced to Firebase!'
        : `Sync encountered an error: ${res?.error || 'Failed'}`,
    });
  };

  const handleConnectDrive = async () => {
    setDriveLoading(true);
    try {
      const res = await googleDriveService.connect();
      if (res.success && res.user) {
        setDriveAuth(res.user);
        showAlert({
          type: 'success',
          title: t('success'),
          message: language === 'ur'
            ? 'گوگل ڈرائیو کامیابی سے منسلک ہو گئی!'
            : 'Google Drive connected successfully!',
        });
      } else {
        showAlert({
          type: 'error',
          title: t('error'),
          message: res.error || 'Failed to connect Google Drive',
        });
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
    showAlert({
      type: 'warning',
      title: t('confirm'),
      message: confirmMsg,
      buttons: [
        {
          text: t('yes'),
          style: 'destructive',
          onPress: async () => {
            await googleDriveService.disconnect();
            setDriveAuth(null);
            showAlert({
              type: 'info',
              title: 'Disconnected',
              message: 'Google Drive has been disconnected.',
            });
          },
        },
        { text: t('no'), style: 'cancel' },
      ],
    });
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
      showAlert({
        type: 'success',
        title: t('success'),
        message: language === 'ur'
          ? `بیک اپ محفوظ ہو گیا: ${res.name}`
          : `Store backed up to Google Drive: ${res.name}`,
      });
    } catch (e: any) {
      console.error('[SettingsScreen] Drive backup error:', e);
      const err = e?.message || 'Failed to backup to Google Drive.';
      if (err.includes('Google Drive API has not been used') || err.includes('disabled')) {
        showAlert({
          type: 'warning',
          title: language === 'ur' ? 'گوگل ڈرائیو سروس دستیاب نہیں' : 'Google Drive Service Temporarily Unavailable',
          message: language === 'ur'
            ? 'گوگل ڈرائیو سروس کلاؤڈ پر زیرِ ترتیب ہے۔ براہ کرم کچھ دیر بعد کوشش کریں یا سپورٹ سے رابطہ کریں۔'
            : 'Google Drive backup is currently being configured on the cloud server. Please try again shortly or contact support.',
          buttons: [
            {
              text: language === 'ur' ? 'سپورٹ سے رابطہ' : 'Contact Support',
              style: 'primary',
              icon: 'mail-outline',
              onPress: () => {
                Linking.openURL('mailto:techflow0500@gmail.com?subject=Google%20Drive%20Backup%20Issue').catch(() => {});
              },
            },
            { text: t('cancel'), style: 'cancel' },
          ],
        });
      } else {
        showAlert({
          type: 'error',
          title: t('error'),
          message: err,
        });
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
        Linking.openURL(folderUrl).catch(() => { });
      }
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* ── Top Emerald Canopy (Seamless continuation from ShopHeader) ── */}
      <View style={[styles.heroCanopy, { backgroundColor: theme.heroBg }]}>
        <View style={styles.heroInner}>
          <View style={styles.header}>
            <Pressable
              onPress={handleBackPress}
              style={({ pressed }) => [
                styles.backBtn,
                pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] },
              ]}
              hitSlop={8}
              accessibilityLabel={language === 'ur' ? 'واپس ہوم پر جائیں' : 'Back to Home'}
            >
              <Ionicons name={language === 'ur' ? 'arrow-forward' : 'arrow-back'} size={18} color="#FFFFFF" />
              <Text style={styles.backBtnText}>{language === 'ur' ? 'واپس' : 'Back'}</Text>
            </Pressable>

            <Text
              style={styles.headerTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {t('settingsTitle')}
            </Text>

            {/* Spacer to keep title centred */}
            <View style={styles.headerSpacer} />
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={[
          styles.content,
          { flexGrow: 1, paddingBottom: keyboardHeight > 0 ? keyboardHeight + 40 : 80 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        nestedScrollEnabled={true}
        scrollEventThrottle={16}
      >

        {/* ── Account / Guest status ───────────────────────────────────────── */}
        {user ? (
          <View
            style={[
              styles.cloudTopBanner,
              {
                backgroundColor: settings.darkMode ? '#064E3B22' : '#F0FDF4',
                borderColor: '#86EFAC',
              },
            ]}
          >
            <View style={styles.cloudTopBannerLeft}>
              <View style={[styles.cloudTopIcon, { backgroundColor: '#DCFCE7' }]}>
                <Ionicons name="cloud-done" size={18} color="#15803D" />
              </View>
              <View style={styles.cloudTopTextWrap}>
                <Text style={[styles.cloudTopTitle, { color: theme.text }]} numberOfLines={1}>
                  {user.displayName || user.email}
                </Text>
                <Text style={[styles.cloudTopSub, { color: '#16A34A' }]} numberOfLines={1}>
                  {syncStatus === 'syncing'
                    ? (language === 'ur' ? 'کلاؤڈ سے مطابقت ہو رہی ہے...' : 'Syncing with cloud...')
                    : syncStatus === 'synced'
                      ? (language === 'ur' ? 'منسلک اور بیک اپ محفوظ' : 'Connected & backed up')
                      : (language === 'ur' ? 'منسلک — مطابقت زیر التوا' : 'Connected (pending sync)')}
                </Text>
              </View>
            </View>
            <View style={styles.cloudTopBannerRight}>
              <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
            </View>
          </View>
        ) : (
          <View
            style={[
              styles.guestAccountCard,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.guestAccountHeader}>
              <View style={[styles.guestModeBadge, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
                <Ionicons name="person-outline" size={14} color={theme.textSecondary} />
                <Text style={[styles.guestModeBadgeText, { color: theme.textSecondary }]}>
                  {language === 'ur' ? 'گیسٹ موڈ' : 'Guest Mode'}
                </Text>
              </View>
            </View>

            <Text style={[styles.guestAccountTitle, { color: theme.text }]}>
              {language === 'ur' ? 'اکاؤنٹ بنائیں یا سائن ان کریں' : 'Create an account or sign in'}
            </Text>
            <Text style={[styles.guestAccountSub, { color: theme.textMuted }]}>
              {language === 'ur'
                ? 'اپنے اسٹور کا ڈیٹا محفوظ کریں اور کسی بھی ڈیوائس پر مطابقت کریں۔ مقامی ڈیٹا اسی فون پر محفوظ رہتا ہے۔'
                : 'Back up your store and sync across devices. Your local data stays safe on this phone until you sign in.'}
            </Text>

            <View style={styles.guestBenefitsRow}>
              {[
                { icon: 'shield-checkmark-outline' as const, label: language === 'ur' ? 'بیک اپ' : 'Backup' },
                { icon: 'sync-outline' as const, label: language === 'ur' ? 'مطابقت' : 'Sync' },
                { icon: 'phone-portrait-outline' as const, label: language === 'ur' ? 'ملٹی ڈیوائس' : 'Multi-device' },
              ].map((b) => (
                <View key={b.label} style={[styles.guestBenefitChip, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
                  <Ionicons name={b.icon} size={13} color={theme.primary} />
                  <Text style={[styles.guestBenefitChipText, { color: theme.textSecondary }]}>{b.label}</Text>
                </View>
              ))}
            </View>

            <Pressable
              onPress={handleGoogleSignIn}
              disabled={googleLoading || authLoading}
              style={({ pressed }) => [
                styles.guestSignInBtn,
                (pressed || googleLoading || authLoading) && { opacity: 0.88 },
              ]}
            >
              {googleLoading || authLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <View style={styles.guestGoogleIconBox}>
                    <Ionicons name="logo-google" size={16} color="#EA4335" />
                  </View>
                  <Text style={styles.guestSignInBtnText}>
                    {language === 'ur' ? 'گوگل سے اکاؤنٹ بنائیں / سائن ان' : 'Create account or sign in with Google'}
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        )}

        {/* ── Segment Switcher ─────────────────────────────────────────────── */}
        <View
          style={[styles.segmentWrap, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}
          onLayout={(e: LayoutChangeEvent) => {
            const w = Math.round(e.nativeEvent.layout.width);
            if (w > 0 && Math.abs(w - segContainerWidth) > 1) {
              setSegContainerWidth(w);
            }
          }}
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
                <Ionicons name={seg.icon} size={15} color={isActive ? '#FFFFFF' : theme.textMuted} />
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.82}
                  style={[
                    styles.segBtnText,
                    { color: isActive ? '#FFFFFF' : theme.textMuted },
                    language === 'ur' && { fontFamily: Typography.urduFontFamily },
                  ]}
                >
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
              {/* Avatar & Store Info */}
              <View style={styles.avatarRow}>
                <Pressable
                  onPress={pickImage}
                  accessibilityRole="button"
                  accessibilityLabel={t('chooseGallery')}
                  style={styles.avatarTapArea}>
                  {profileImage && !isGoogleAvatar(profileImage) ? (
                    <ProductImage
                      uri={profileImage}
                      style={[styles.avatar, { borderColor: theme.primary }]}
                      fallbackIcon={
                        <View style={[styles.avatarFallback, { backgroundColor: '#FFFFFF', borderColor: theme.border }]}>
                          <Image
                            source={require('@/../assets/images/mainLogoImage.png')}
                            style={styles.avatarLogoImg}
                            resizeMode="contain"
                          />
                        </View>
                      }
                    />
                  ) : (
                    <View style={[styles.avatarFallback, { backgroundColor: '#FFFFFF', borderColor: theme.border }]}>
                      <Image
                        source={require('@/../assets/images/mainLogoImage.png')}
                        style={styles.avatarLogoImg}
                        resizeMode="contain"
                      />
                    </View>
                  )}
                  <View style={[styles.cameraBadge, { backgroundColor: theme.primary }]}>
                    <Ionicons name="camera" size={12} color="#fff" />
                  </View>
                </Pressable>

                <View style={styles.avatarInfo}>
                  <Text style={[styles.avatarShop, { color: theme.text }]} numberOfLines={1}>
                    {(language === 'ur' && shopNameUrdu) ? shopNameUrdu : shopName || (language === 'ur' ? 'میری دکان' : 'My Store')}
                  </Text>
                  <Text style={[styles.avatarName, { color: theme.textSecondary }]} numberOfLines={1}>
                    {ownerName || user?.displayName || (language === 'ur' ? 'دکاندار' : 'Proprietor')}
                    {businessType ? ` · ${businessType}` : ''}
                  </Text>

                  <View style={[styles.accountPill, { backgroundColor: user ? (settings.darkMode ? 'rgba(2,132,199,0.15)' : '#E0F2FE') : (settings.darkMode ? 'rgba(255,255,255,0.06)' : '#F1F5F9') }]}>
                    <Ionicons
                      name={user ? 'logo-google' : 'storefront-outline'}
                      size={11}
                      color={user ? '#0284C7' : theme.textMuted}
                    />
                    <Text style={[styles.accountPillText, { color: user ? '#0284C7' : theme.textMuted }]} numberOfLines={1}>
                      {user ? (user.displayName ? `${user.displayName} • ${user.email}` : user.email) : (language === 'ur' ? 'مقامی اسٹور' : 'Local Store')}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Minimalist Action Buttons */}
              <View style={styles.photoActions}>
                <Pressable
                  onPress={() => setIsCameraOpen(true)}
                  style={({ pressed }) => [
                    styles.photoBtn,
                    { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
                    pressed && { opacity: 0.7 },
                  ]}>
                  <Ionicons name="camera-outline" size={14} color={theme.text} />
                  <Text style={[styles.photoBtnText, { color: theme.text }]}>
                    {language === 'ur' ? 'کیمرہ' : 'Camera'}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={pickImage}
                  style={({ pressed }) => [
                    styles.photoBtn,
                    { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
                    pressed && { opacity: 0.7 },
                  ]}>
                  <Ionicons name="images-outline" size={14} color={theme.text} />
                  <Text style={[styles.photoBtnText, { color: theme.text }]}>
                    {language === 'ur' ? 'گیلری' : 'Gallery'}
                  </Text>
                </Pressable>

                {user && (
                  <Pressable
                    onPress={handleSyncGoogleProfile}
                    style={({ pressed }) => [
                      styles.photoBtn,
                      { backgroundColor: settings.darkMode ? 'rgba(2,132,199,0.18)' : '#E0F2FE', borderColor: '#7DD3FC' },
                      pressed && { opacity: 0.7 },
                    ]}>
                    <Ionicons name="logo-google" size={13} color="#0284C7" />
                    <Text style={[styles.photoBtnText, { color: '#0284C7', fontWeight: '700' }]}>
                      {language === 'ur' ? 'گوگل سنک' : 'Sync Google'}
                    </Text>
                  </Pressable>
                )}

                {profileImage && !isGoogleAvatar(profileImage) ? (
                  <Pressable
                    onPress={handleRemovePhoto}
                    accessibilityLabel="Remove photo"
                    style={({ pressed }) => [
                      styles.photoRemoveBtn,
                      { backgroundColor: theme.dangerLight, borderColor: theme.border },
                      pressed && { opacity: 0.7 },
                    ]}>
                    <Ionicons name="trash-outline" size={14} color={theme.danger} />
                  </Pressable>
                ) : null}
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
                <Pressable onPress={() => setShowMoreDetails((v) => !v)} style={styles.moreToggle}>
                  <Text style={[styles.moreToggleText, { color: theme.primary }]}>
                    {language === 'ur' ? 'مزید تفصیلات (اختیاری)' : 'More shop details (optional)'}
                  </Text>
                  <Ionicons name={showMoreDetails ? 'chevron-up' : 'chevron-down'} size={16} color={theme.primary} />
                </Pressable>
                {showMoreDetails && (
                  <>
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
                  </>
                )}
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
            <Section title={t('appearanceSection')} theme={theme}>
              {/* Language */}
              <RowItem icon="language-outline" iconColor="#7C3AED" iconBg="#EDE9FE" label={t('languageLabel')} theme={theme}>
                <LangToggle value={language} onChange={setLanguage} theme={theme} />
              </RowItem>

              {/* Dark Mode */}
              <RowItem icon="moon-outline" iconColor="#6366F1" iconBg="#E0E7FF" label={t('darkModeLabel')} theme={theme} last>
                <DarkToggle value={settings.darkMode} onChange={(val) => updateSettings({ darkMode: val })} theme={theme} />
              </RowItem>
            </Section>

            {/* WhatsApp Udhaar Reminders */}
            <Section title={t('whatsappReminderSection')} theme={theme}>
              <RowItem
                icon="logo-whatsapp"
                iconColor="#25D366"
                iconBg="#DCFCE7"
                label={t('whatsappReminderLangLabel')}
                sublabel={t('whatsappReminderLangSublabel')}
                theme={theme}
                last={false}
              >
                <LangToggle
                  value={settings.whatsappReminderLanguage || 'en'}
                  onChange={handleReminderLangChange}
                  theme={theme}
                />
              </RowItem>

              {/* Live Message Preview & Custom Template Card */}
              <View style={[styles.waPreviewContainer, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
                <View style={styles.waPreviewHeader}>
                  <View style={styles.waPreviewHeaderLeft}>
                    <Ionicons name="chatbubble-ellipses-outline" size={16} color="#25D366" />
                    <Text style={[styles.waPreviewTitle, { color: theme.textSecondary }]}>
                      {t('whatsappReminderPreview')}
                    </Text>
                    {isReminderCustomized && (
                      <View style={[styles.customBadge, { backgroundColor: settings.darkMode ? 'rgba(37,211,102,0.18)' : '#DCFCE7' }]}>
                        <Text style={[styles.customBadgeText, { color: '#16A34A' }]}>
                          {language === 'ur' ? 'ترمیم شدہ' : 'Custom'}
                        </Text>
                      </View>
                    )}
                  </View>

                  {isReminderCustomized && (
                    <Pressable
                      onPress={handleResetReminderText}
                      hitSlop={8}
                      style={({ pressed }) => [
                        styles.waResetBtn,
                        { backgroundColor: theme.surface, borderColor: theme.border },
                        pressed && { opacity: 0.7 },
                      ]}>
                      <Ionicons name="refresh-outline" size={13} color={theme.textMuted} />
                      <Text style={[styles.waResetBtnText, { color: theme.textMuted }]}>
                        {language === 'ur' ? 'اصل بحال کریں' : 'Reset'}
                      </Text>
                    </Pressable>
                  )}
                </View>

                {/* Editable Message Box */}
                <View style={[styles.waInputWrap, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <TextInput
                    value={reminderDraft}
                    onChangeText={setReminderDraft}
                    onFocus={() => {
                      isReminderFocusedRef.current = true;
                    }}
                    onBlur={() => {
                      isReminderFocusedRef.current = false;
                      commitReminderText();
                    }}
                    multiline
                    placeholder={language === 'ur' ? 'یہاں اپنا پیغام لکھیں...' : 'Enter your custom message...'}
                    placeholderTextColor={theme.textMuted}
                    textAlign={isUrduReminder ? 'right' : 'left'}
                    style={[
                      styles.waTextInput,
                      {
                        color: theme.text,
                        fontFamily: isUrduReminder ? Typography.urduFontFamily : undefined,
                      },
                    ]}
                  />
                </View>

                <View style={styles.waPreviewFooter}>
                  <Ionicons name="information-circle-outline" size={13} color={theme.textMuted} />
                  <Text style={[styles.waPreviewHint, { color: theme.textMuted }]}>
                    {language === 'ur'
                      ? '💡 احمد اور 2,500 صرف نمونہ ہیں، اصل بل میں گاہک کا نام اور رقم خود درج ہوگی۔'
                      : '💡 "Ahmed" and "2,500" will be automatically replaced with the actual customer name and balance.'}
                  </Text>
                </View>
              </View>
            </Section>

            {/* Advanced toggle — billing + data tools live behind it */}
            <Pressable onPress={() => setShowAdvanced((v) => !v)} style={styles.moreToggle}>
              <Text style={[styles.moreToggleText, { color: theme.primary }]}>
                {language === 'ur' ? '⚙ ایڈوانسڈ سیٹنگز' : '⚙ Advanced Settings'}
              </Text>
              <Ionicons name={showAdvanced ? 'chevron-up' : 'chevron-down'} size={16} color={theme.primary} />
            </Pressable>

            {showAdvanced && (
              <>
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

              </>
            )}

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
                        {language === 'ur' ? 'اکاؤنٹ اور کلاؤڈ بیک اپ' : 'Account & cloud backup'}
                      </Text>
                      <Text style={[styles.googleDesc, { color: theme.textMuted }]}>
                        {language === 'ur'
                          ? 'گوگل سے اکاؤنٹ بنائیں یا سائن ان کریں تاکہ سامان، بلز اور کھاتہ کلاؤڈ پر محفوظ رہیں۔'
                          : 'Create an account or sign in with Google to back up inventory, bills, and Khata to the cloud.'}
                      </Text>
                    </View>
                  </View>

                  <Pressable
                    onPress={handleGoogleSignIn}
                    disabled={googleLoading || authLoading}
                    style={({ pressed }) => [
                      styles.googleSignInBtn,
                      (pressed || googleLoading || authLoading) && { opacity: 0.85 },
                    ]}
                  >
                    {googleLoading || authLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Ionicons name="logo-google" size={18} color="#fff" />
                    )}
                    <Text style={styles.googleSignInBtnText}>
                      {googleLoading || authLoading
                        ? t('syncing')
                        : language === 'ur'
                          ? 'اکاؤنٹ بنائیں / سائن ان'
                          : 'Create account or sign in'}
                    </Text>
                  </Pressable>

                  <Text style={[styles.guestLocalNote, { color: theme.textMuted }]}>
                    {language === 'ur'
                      ? 'آپ ابھی گیسٹ موڈ میں ہیں۔ تمام سیٹنگز مقامی طور پر کام کرتی ہیں۔'
                      : 'You’re in guest mode. All settings below work on this device.'}
                  </Text>
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

                    {/* Sign Out */}
                    <Pressable
                      onPress={handleLogout}
                      disabled={isLoggingOut || isDeletingAccount}
                      style={({ pressed }) => [
                        styles.signOutActionBtn,
                        { backgroundColor: theme.surfaceSubtle, borderColor: theme.border, borderWidth: 1 },
                        (pressed || isLoggingOut) && { opacity: 0.8 },
                      ]}
                    >
                      {isLoggingOut ? (
                        <ActivityIndicator size="small" color={theme.text} />
                      ) : (
                        <Ionicons name="log-out-outline" size={15} color={theme.text} />
                      )}
                      <Text style={[styles.signOutActionBtnText, { color: theme.text }]}>
                        {isLoggingOut ? t('signingOut') : t('signOut')}
                      </Text>
                    </Pressable>
                  </View>

                  {/* Account & Data Deletion */}
                  <Pressable
                    onPress={handleDeleteAccount}
                    disabled={isLoggingOut || isDeletingAccount}
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
            {showAdvanced && (
              <>
                <Section title={t('dataManagement')} theme={theme}>
                  <RowItem
                    icon="download-outline"
                    iconColor="#059669"
                    iconBg="#D1FAE5"
                    label={t('backupBtn')}
                    sublabel={t('backupSublabel')}
                    onPress={handleExport}
                    theme={theme}
                  />
                  <RowItem
                    icon="cloud-upload-outline"
                    iconColor="#0284C7"
                    iconBg="#E0F2FE"
                    label={t('restoreBtn')}
                    sublabel={t('restoreSublabel')}
                    onPress={() => setShowImportBox(!showImportBox)}
                    theme={theme}
                  />
                  <RowItem
                    icon="trash-outline"
                    iconColor="#DC2626"
                    iconBg="#FEE2E2"
                    label={t('resetSampleBtn')}
                    sublabel={t('resetSublabel')}
                    onPress={handleReset}
                    theme={theme}
                    last
                  />
                </Section>

                {/* Import Box */}
                {showImportBox && (
                  <View style={[styles.importBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <View style={styles.importBoxHeader}>
                      <Ionicons name="document-text-outline" size={20} color={theme.primary} />
                      <Text style={[styles.importBoxDesc, { color: theme.textMuted }]}>
                        {language === 'ur'
                          ? 'پہلے سے محفوظ شدہ بیک اپ فائل (.json) منتخب کر کے اپنا ڈیٹا بحال کریں۔'
                          : 'Select a previously saved backup file (.json) to restore your products, sales, and ledger records.'}
                      </Text>
                    </View>

                    <Pressable
                      onPress={handleImportFromFile}
                      style={({ pressed }) => [
                        styles.importFileBtn,
                        { backgroundColor: theme.primary },
                        pressed && { opacity: 0.85 },
                      ]}
                    >
                      <Ionicons name="folder-open-outline" size={18} color="#fff" />
                      <Text style={styles.importFileBtnText}>
                        {t('chooseBackupFile')}
                      </Text>
                    </Pressable>
                  </View>
                )}
              </>
            )}

            {/* About & Legal Section */}
            <Section title={t('aboutLegal')} theme={theme}>
              <RowItem
                icon="shield-checkmark-outline"
                iconColor="#2563EB"
                iconBg="#DBEAFE"
                label={t('privacyPolicy')}
                sublabel={t('privacyPolicySublabel')}
                onPress={() => openLegalUrl(LEGAL_CONFIG.privacyPolicyUrl)}
                theme={theme}
              />
              <RowItem
                icon="document-text-outline"
                iconColor="#0D9488"
                iconBg="#CCFBF1"
                label={t('termsOfService')}
                sublabel={t('termsOfServiceSublabel')}
                onPress={() => openLegalUrl(LEGAL_CONFIG.termsOfServiceUrl)}
                theme={theme}
              />
              <RowItem
                icon="trash-bin-outline"
                iconColor="#DC2626"
                iconBg="#FEE2E2"
                label={t('accountDeletionTitle')}
                sublabel={t('accountDeletionSublabel')}
                onPress={() => openLegalUrl(LEGAL_CONFIG.accountDeletionUrl)}
                theme={theme}
              />
              <RowItem
                icon="information-circle-outline"
                iconColor="#64748B"
                iconBg="#F1F5F9"
                label={t('appVersionLabel')}
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
    </KeyboardAvoidingView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  heroCanopy: {
    width: '100%',
    paddingTop: 6,
    paddingBottom: 10,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderWidth: 0,
    borderTopWidth: 0,
    elevation: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
  },
  heroInner: {
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: Spacing.lg,
  },
  content: {
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 12,
    paddingBottom: 80,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  backBtn: {
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderColor: 'rgba(255, 255, 255, 0.28)',
    borderWidth: 1,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
  headerTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
    textAlign: 'center',
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
    width: 72,
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
    gap: 5,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: BorderRadius.full,
    zIndex: 1,
  },
  segBtnText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.1,
  },

  // Avatar Card
  avatarCard: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    paddingBottom: Spacing.md,
    ...Shadows.sm,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  avatarTapArea: {
    position: 'relative',
    width: 68,
    height: 68,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
  },
  avatarFallback: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    overflow: 'hidden',
  },
  avatarLogoImg: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarInfo: {
    flex: 1,
    gap: 3,
  },
  avatarShop: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  avatarName: {
    fontSize: 13,
    fontWeight: '500',
  },
  accountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 10,
    marginTop: 2,
  },
  accountPillText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Photo actions
  photoActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: Spacing.md,
    paddingTop: 4,
    flexWrap: 'wrap',
  },
  photoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  photoBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  photoRemoveBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },

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
  moreToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  moreToggleText: { fontSize: 13.5, fontWeight: '700' },
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
  importBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  importBoxDesc: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  importFileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: BorderRadius.full,
    ...Shadows.sm,
  },
  importFileBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

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

  guestAccountCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  guestAccountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  guestModeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  guestModeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  guestAccountTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  guestAccountSub: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 2,
  },
  guestBenefitsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
    marginBottom: 4,
  },
  guestBenefitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  guestBenefitChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  guestSignInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#1E293B',
    paddingVertical: 13,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginTop: 4,
    ...Shadows.sm,
  },
  guestGoogleIconBox: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestSignInBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    flexShrink: 1,
  },
  guestLocalNote: {
    fontSize: 11,
    lineHeight: 15,
    textAlign: 'center',
    marginTop: 2,
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

  /* Unsaved Changes Modal */
  unsavedOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  unsavedBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  unsavedCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    ...Shadows.lg,
  },
  unsavedIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  unsavedTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  unsavedDesc: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },
  unsavedActions: {
    width: '100%',
    gap: 10,
  },
  unsavedBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  unsavedBtnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  unsavedBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    paddingVertical: 11,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  unsavedBtnSecondaryText: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  unsavedBtnCancel: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginTop: 2,
  },
  unsavedBtnCancelText: {
    fontSize: 13,
    fontWeight: '600',
  },
  /* WhatsApp Reminder Preview & Template */
  waPreviewContainer: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: 8,
  },
  waPreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  waPreviewHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  waPreviewTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  customBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  customBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  waResetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  waResetBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
  waInputWrap: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    minHeight: 110,
  },
  waTextInput: {
    fontSize: 12,
    lineHeight: 19,
    padding: 0,
    minHeight: 90,
    textAlignVertical: 'top',
  },
  waPreviewFooter: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingTop: 2,
  },
  waPreviewHint: {
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },
});
