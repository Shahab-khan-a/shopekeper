import { ProductImage } from '@/components/ProductImage';
import { Colors, Spacing } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';
import { triggerCloudBackupFlow } from '@/utils/backupAction';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

/**
 * Clean top header displayed exclusively on the Home Hub.
 * Features quick shop profile edit, tappable backup status, and Settings access.
 */
export const ShopHeader: React.FC = () => {
  const {
    settings,
    language,
    setActiveTab,
    setIsEditShopOpen,
    setIsAuthModalOpen,
    user,
    isOnline,
    pendingSyncCount,
    syncNow,
    showAlert,
  } = useShop();

  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const isUrdu = language === 'ur';

  const storeDisplayName =
    isUrdu && settings.shopNameUrdu
      ? settings.shopNameUrdu
      : settings.shopName ||
      (user?.displayName
        ? `${user.displayName}'s Store`
        : isUrdu
          ? 'میری دکان'
          : 'My Shop');

  const storeInitials =
    (storeDisplayName || 'MS')
      .split(' ')
      .map((w: string) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'MS';

  const softBorder = settings.darkMode
    ? 'rgba(255,255,255,0.1)'
    : 'rgba(148, 163, 184, 0.25)';

  const statusLabel = user
    ? !isOnline
      ? isUrdu
        ? 'آف لائن محفوظ'
        : 'Saved offline'
      : pendingSyncCount > 0
        ? isUrdu
          ? `${pendingSyncCount} بیک اپ باقی`
          : `${pendingSyncCount} pending backup`
        : isUrdu
          ? 'کلاؤڈ بیک اپ آن'
          : 'Backup on'
    : isUrdu
      ? 'فون میں محفوظ'
      : 'Saved on phone';

  const statusDotColor = user ? (isOnline ? '#10B981' : '#F59E0B') : '#0284C7';

  const handleBackupPress = () => {
    void triggerCloudBackupFlow({
      user,
      isOnline,
      pendingSyncCount,
      isUrdu,
      setIsAuthModalOpen,
      syncNow,
      showAlert,
    });
  };

  return (
    <View style={[styles.headerContainer, { backgroundColor: theme.background }]}>
      <View style={styles.leftSection}>
        <Pressable
          onPress={() => setIsEditShopOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={isUrdu ? 'دکان کا نام تبدیل کریں' : 'Edit shop profile'}
          style={({ pressed }) => [
            styles.avatarWrap,
            pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
          ]}>
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatarImg} />
          ) : settings.profileImage ? (
            <ProductImage
              uri={settings.profileImage}
              style={styles.avatarImg}
              fallbackIcon={
                <View style={[styles.avatarInitialsPod, { backgroundColor: '#A7F3D0' }]}>
                  <Text style={styles.avatarInitialsText}>{storeInitials}</Text>
                </View>
              }
            />
          ) : (
            <View style={[styles.avatarInitialsPod, { backgroundColor: '#A7F3D0' }]}>
              <Text style={styles.avatarInitialsText}>{storeInitials}</Text>
            </View>
          )}
        </Pressable>

        <View style={styles.titleWrap}>
          <Pressable
            onPress={() => setIsEditShopOpen(true)}
            hitSlop={{ top: 6, bottom: 2, left: 4, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={isUrdu ? 'دکان کا نام تبدیل کریں' : 'Edit shop profile'}>
            <Text style={[styles.shopTitle, { color: theme.text }]} numberOfLines={1}>
              {storeDisplayName}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleBackupPress}
            hitSlop={{ top: 2, bottom: 8, left: 4, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel={isUrdu ? 'گوگل بیک اپ دیکھیں' : 'Manage backup'}
            style={({ pressed }) => [styles.statusRow, pressed && { opacity: 0.72 }]}>
            <View style={[styles.statusDot, { backgroundColor: statusDotColor }]} />
            <Text style={[styles.statusText, { color: theme.textMuted }]} numberOfLines={1}>
              {statusLabel}
            </Text>
            <Ionicons
              name={user ? 'cloud-done-outline' : 'cloud-upload-outline'}
              size={12}
              color={statusDotColor}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.rightSection}>
        {/* Settings Gear */}
        <Pressable
          onPress={() => setActiveTab('settings')}
          accessibilityRole="button"
          accessibilityLabel={isUrdu ? 'سیٹنگز' : 'Settings'}
          style={({ pressed }) => [
            styles.roundCircleBtn,
            {
              backgroundColor: theme.card,
              borderColor: softBorder,
            },
            pressed && { opacity: 0.85, transform: [{ scale: 0.94 }] },
          ]}>
          <Ionicons name="settings-outline" size={20} color={theme.text} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    zIndex: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: Spacing.sm,
  },
  avatarWrap: {
    width: 44,
    height: 44,
  },
  avatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarInitialsPod: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitialsText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#064E3B',
    letterSpacing: -0.5,
  },
  titleWrap: {
    flex: 1,
    gap: 2,
  },
  shopTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roundCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
