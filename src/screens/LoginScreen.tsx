import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useShop } from '@/context/ShopContext';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { LEGAL_CONFIG, openLegalUrl } from '@/constants/legal';


interface LoginScreenProps {
  onContinueAsGuest: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onContinueAsGuest }) => {
  const {
    signInWithGoogle,
    authLoading,
    settings,
    language,
    setLanguage,
  } = useShop();

  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isUrdu = language === 'ur';

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const result = await signInWithGoogle();
      if (!result.success) {
        setErrorMessage(result.error || 'Failed to sign in with Google');
      }
    } catch (e: any) {
      setErrorMessage(e?.message || 'An unexpected error occurred during Google sign-in.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.rootContainer, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {/* Top Bar: Language Toggle */}
          <View style={styles.topBar}>
            <View style={[styles.statusBadge, { backgroundColor: '#DCFCE7' }]}>
              <View style={styles.onlineDot} />
              <Text style={styles.statusBadgeText}>
                {isUrdu ? 'کلاؤڈ ریڈی' : 'Cloud Ready'}
              </Text>
            </View>

            {/* Language Pill Switcher */}
            <View style={[styles.langSwitchWrap, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
              <Pressable
                onPress={() => setLanguage('en')}
                style={[
                  styles.langOption,
                  !isUrdu && [styles.langOptionActive, { backgroundColor: theme.primary }],
                ]}
              >
                <Text
                  style={[
                    styles.langText,
                    { color: !isUrdu ? '#FFFFFF' : theme.textMuted },
                    !isUrdu && styles.langTextBold,
                  ]}
                >
                  EN
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setLanguage('ur')}
                style={[
                  styles.langOption,
                  isUrdu && [styles.langOptionActive, { backgroundColor: theme.primary }],
                ]}
              >
                <Text
                  style={[
                    styles.langText,
                    { color: isUrdu ? '#FFFFFF' : theme.textMuted },
                    isUrdu && styles.langTextBold,
                  ]}
                >
                  اردو
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Hero Branding Header */}
          <View style={styles.brandSection}>
            <View style={[styles.logoOuter, { backgroundColor: theme.primaryLight }]}>
              <View style={[styles.logoInner, { backgroundColor: theme.primary }]}>
                <Ionicons name="storefront" size={26} color="#FFFFFF" />
              </View>
            </View>

            <Text style={[styles.appTitle, { color: theme.text }]}>
              {isUrdu ? 'دکاندار ایپ' : 'Shopkeeper POS'}
            </Text>

            <Text style={[styles.appSubtitle, { color: theme.textMuted }]}>
              {isUrdu
                ? 'تیز رفتار بلنگ، انوینٹری اور ادھار کھاتہ کا مکمل نظام'
                : 'Smart POS, Inventory & Khata with Google Cloud Backup'}
            </Text>
          </View>

          {/* Error Banner */}
          {errorMessage ? (
            <View style={[styles.banner, styles.errorBanner]}>
              <Ionicons name="alert-circle" size={16} color="#B91C1C" />
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* 3 Compact Feature Cards */}
          <View style={styles.featuresRow}>
            <View style={[styles.featureMiniCard, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
              <View style={[styles.featureMiniIconWrap, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="flash" size={14} color="#0284C7" />
              </View>
              <Text style={[styles.featureMiniText, { color: theme.text }]} numberOfLines={1}>
                {isUrdu ? 'فوری بلنگ' : 'Fast Billing'}
              </Text>
            </View>

            <View style={[styles.featureMiniCard, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
              <View style={[styles.featureMiniIconWrap, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="book" size={14} color="#D97706" />
              </View>
              <Text style={[styles.featureMiniText, { color: theme.text }]} numberOfLines={1}>
                {isUrdu ? 'ادھار کھاتہ' : 'Udhaar Khata'}
              </Text>
            </View>

            <View style={[styles.featureMiniCard, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
              <View style={[styles.featureMiniIconWrap, { backgroundColor: '#DCFCE7' }]}>
                <Ionicons name="cloud-done" size={14} color="#15803D" />
              </View>
              <Text style={[styles.featureMiniText, { color: theme.text }]} numberOfLines={1}>
                {isUrdu ? 'کلاؤڈ بیک اپ' : 'Cloud Sync'}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            {/* Primary Action: Google Sign In */}
            <Pressable
              onPress={handleGoogleSignIn}
              disabled={isLoading || authLoading}
              style={({ pressed }) => [
                styles.googleBtn,
                (pressed || isLoading) && { opacity: 0.88, transform: [{ scale: 0.98 }] },
              ]}
            >
              {isLoading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.googleBtnText} numberOfLines={1}>
                    {isUrdu ? 'گوگل سے تصدیق ہو رہی ہے...' : 'Signing in with Google...'}
                  </Text>
                </View>
              ) : (
                <View style={styles.googleBtnInner}>
                  <View style={styles.googleIconCircle}>
                    <Ionicons name="logo-google" size={14} color="#EA4335" />
                  </View>
                  <Text style={styles.googleBtnText} numberOfLines={1} ellipsizeMode="tail">
                    {isUrdu ? 'گوگل اکاؤنٹ سے لاگ ان کریں' : 'Continue with Google'}
                  </Text>
                </View>
              )}
            </Pressable>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
              <Text style={[styles.dividerText, { color: theme.textMuted }]}>
                {isUrdu ? 'یا' : 'OR'}
              </Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            </View>

            {/* Secondary Action: Explore as Guest */}
            <Pressable
              onPress={onContinueAsGuest}
              style={({ pressed }) => [
                styles.guestBtn,
                { borderColor: theme.border, backgroundColor: theme.surfaceSubtle },
                pressed && { opacity: 0.75, backgroundColor: theme.border },
              ]}
            >
              <Ionicons name="enter-outline" size={16} color={theme.text} />
              <Text style={[styles.guestBtnText, { color: theme.text }]} numberOfLines={1} ellipsizeMode="tail">
                {isUrdu ? 'آف لائن دکان شروع کریں (گیسٹ موڈ)' : 'Continue as Guest (Offline Mode)'}
              </Text>
              <Ionicons name="chevron-forward" size={14} color={theme.textMuted} />
            </Pressable>
          </View>

          {/* Footer Security Note & Privacy Policy */}
          <View style={styles.footerWrap}>
            <Ionicons name="lock-closed" size={13} color="#64748B" />
            <Text style={[styles.footerText, { color: theme.textMuted }]}>
              {isUrdu
                ? 'آپ کا ریکارڈ محفوظ اور انکرپٹڈ ہے • گوگل فائر بیس کلاؤڈ'
                : 'Encrypted & secured by Firebase Authentication'}
            </Text>
          </View>

          <View style={styles.legalLinksRow}>
            <Pressable onPress={() => openLegalUrl(LEGAL_CONFIG.privacyPolicyUrl)}>
              <Text style={[styles.legalLinkText, { color: theme.primary }]}>
                {isUrdu ? 'پرائیویسی پالیسی' : 'Privacy Policy'}
              </Text>
            </Pressable>
            <Text style={[styles.legalDot, { color: theme.textMuted }]}>•</Text>
            <Pressable onPress={() => openLegalUrl(LEGAL_CONFIG.termsOfServiceUrl)}>
              <Text style={[styles.legalLinkText, { color: theme.primary }]}>
                {isUrdu ? 'شرائط و ضوابط' : 'Terms of Service'}
              </Text>
            </Pressable>
          </View>

        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: '100%',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 18,
    ...Shadows.md,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: '#16A34A',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  langSwitchWrap: {
    flexDirection: 'row',
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    padding: 2,
  },
  langOption: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  langOptionActive: {
    ...Shadows.sm,
  },
  langText: {
    fontSize: 11,
    fontWeight: '600',
  },
  langTextBold: {
    fontWeight: '800',
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 14,
  },
  logoOuter: {
    width: 58,
    height: 58,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoInner: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  appTitle: {
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 17,
    paddingHorizontal: 4,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: 10,
    borderRadius: BorderRadius.md,
    marginBottom: 10,
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
  },
  errorBannerText: {
    color: '#991B1B',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  featuresRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 14,
    width: '100%',
  },
  featureMiniCard: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 4,
  },
  featureMiniIconWrap: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureMiniText: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  actionSection: {
    gap: 8,
  },
  googleBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  googleBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  googleIconCircle: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginVertical: 2,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  guestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 6,
  },
  guestBtnText: {
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'center',
  },
  footerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 12,
  },
  footerText: {
    fontSize: 10,
    textAlign: 'center',
  },
  legalLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  legalLinkText: {
    fontSize: 11,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  legalDot: {
    fontSize: 11,
  },
});
