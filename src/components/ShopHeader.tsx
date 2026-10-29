import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useShop } from '@/context/ShopContext';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { ProductImage } from '@/components/ProductImage';

export const ShopHeader: React.FC = () => {
  const {
    settings,
    language,
    lowStockProducts,
    outOfStockProducts,
    activeTab,
    setActiveTab,
    setIsAuthModalOpen,
    setIsEditShopOpen,
    user,
    isGuestMode,
    isOnline,
    syncStatus,
    pendingSyncCount,
    syncNow,
    showAlert,
  } = useShop();

  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const isUrdu = language === 'ur';
  const totalAlerts = lowStockProducts.length + outOfStockProducts.length;

  const handleSyncPillPress = async () => {
    if (!isOnline) {
      const msg = isUrdu
        ? `آپ آف لائن ہیں۔ ${pendingSyncCount} تبدیلیاں محفوظ ہیں اور انٹرنیٹ آتے ہی خود بخود کلاؤڈ پر منتقل ہو جائیں گی۔`
        : `You are offline. ${pendingSyncCount} local changes are safely queued and will sync automatically when internet returns.`;
      showAlert({
        type: 'info',
        title: 'Offline Mode',
        message: msg,
      });
      return;
    }

    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    await syncNow();
  };

  const storeDisplayName =
    (isUrdu && settings.shopNameUrdu)
      ? settings.shopNameUrdu
      : (settings.shopName || (user?.displayName ? `${user.displayName}'s Store` : (isUrdu ? 'میری دکان' : 'My Store')));

  // Initials for avatar pod (e.g. "DS" or shop initials)
  const storeInitials = (storeDisplayName || 'DS')
    .split(' ')
    .map((w: string) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'DS';

  const softBorder = settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(148, 163, 184, 0.2)';
  const headerBg = settings.darkMode ? '#0A0F1E' : '#F8FAFC';

  return (
    <View
      style={[
        styles.headerContainer,
        {
          backgroundColor: headerBg,
        },
      ]}>
      {/* ── Left: Avatar pod with green online dot + DIGISHOP • Online + Store Name ── */}
      <Pressable
        onPress={() => setIsEditShopOpen(true)}
        style={({ pressed }) => [
          styles.leftSection,
          pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] },
        ]}>
        {/* Avatar with small green online indicator */}
        <View style={styles.avatarWrap}>
          {settings.profileImage && !settings.profileImage.includes('googleusercontent.com/a/') ? (
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

          {/* Green Online Dot on bottom-right of avatar */}
          <View style={[styles.onlineDot, { backgroundColor: isOnline ? '#10B981' : '#F87171' }]} />
        </View>

        {/* Text Block */}
        <View style={styles.titleWrap}>
          <View style={styles.badgeRow}>
            <Text style={[styles.posBadgeText, { color: theme.textMuted }]}>
              {isUrdu ? '⚡ ڈیجی شاپ' : '⚡ DIGISHOP'}
            </Text>
            <View style={styles.bulletDot} />
            <Text style={[styles.onlineStatusText, { color: isOnline ? '#059669' : '#EF4444' }]}>
              {isOnline ? (isUrdu ? 'آن لائن' : 'Online') : (isUrdu ? 'آف لائن' : 'Offline')}
            </Text>
          </View>

          <Text style={[styles.shopTitle, { color: theme.text }]} numberOfLines={1}>
            {storeDisplayName}
          </Text>
          {settings.ownerName ? (
            <Text style={[styles.ownerSubtitle, { color: theme.textMuted }]} numberOfLines={1}>
              {settings.ownerName}
            </Text>
          ) : null}
        </View>
      </Pressable>

      {/* ── Right: Notification Bell in soft circle + Profile in soft circle ── */}
      <View style={styles.rightSection}>
        {/* Notification Bell Circle */}
        <Pressable
          onPress={() => {
            if (totalAlerts > 0) {
              setActiveTab('products');
            } else if (!isOnline || pendingSyncCount > 0) {
              handleSyncPillPress();
            } else {
              showAlert({
                type: 'info',
                title: isUrdu ? 'اطلاعات' : 'Notifications',
                message: isUrdu ? 'تمام سسٹمز فعال اور ہم آہنگ ہیں۔' : 'All systems normal. 0 pending alerts.',
              });
            }
          }}
          accessibilityLabel="Notifications"
          style={({ pressed }) => [
            styles.roundCircleBtn,
            { backgroundColor: theme.card, borderColor: softBorder },
            pressed && { opacity: 0.85, transform: [{ scale: 0.94 }] },
          ]}>
          <Ionicons name="notifications-outline" size={18} color={theme.text} />
          {/* Orange alert dot */}
          {(totalAlerts > 0 || pendingSyncCount > 0 || !isOnline) && (
            <View style={styles.bellAlertDot} />
          )}
        </Pressable>

        {/* User Profile Avatar / Settings Circle */}
        <Pressable
          onPress={() => (user ? setActiveTab('settings') : setIsAuthModalOpen(true))}
          accessibilityLabel="Account & Settings"
          style={({ pressed }) => [
            styles.roundCircleBtn,
            { backgroundColor: theme.card, borderColor: softBorder },
            pressed && { opacity: 0.85, transform: [{ scale: 0.94 }] },
          ]}>
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.profileAvatarImg} />
          ) : (
            <Ionicons
              name={user ? 'person' : 'person-outline'}
              size={18}
              color={theme.text}
            />
          )}
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
    position: 'relative',
    width: 42,
    height: 42,
  },
  avatarImg: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  avatarInitialsPod: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitialsText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#064E3B',
    letterSpacing: -0.5,
  },
  onlineDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  titleWrap: {
    flex: 1,
    gap: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  posBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  bulletDot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: '#94A3B8',
  },
  onlineStatusText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  shopTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  ownerSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 0.5,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roundCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...Shadows.sm,
  },
  bellAlertDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F97316',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  profileAvatarImg: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
});
