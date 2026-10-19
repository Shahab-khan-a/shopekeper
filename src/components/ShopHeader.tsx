import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, Platform, Alert } from 'react-native';
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

  const totalAlerts = lowStockProducts.length + outOfStockProducts.length;

  const handleSyncPillPress = async () => {
    if (!isOnline) {
      const msg =
        language === 'ur'
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

  // Determine Pill Appearance for Emerald Header
  const getSyncPillConfig = () => {
    const isUrdu = language === 'ur';
    if (!isOnline) {
      return {
        bg: 'rgba(239, 68, 68, 0.3)',
        border: 'rgba(252, 165, 165, 0.45)',
        color: '#FECACA',
        icon: 'cloud-offline' as const,
        label: pendingSyncCount > 0
          ? (isUrdu ? `آف لائن (${pendingSyncCount})` : `Offline (${pendingSyncCount})`)
          : (isUrdu ? 'آف لائن' : 'Offline'),
      };
    }

    if (syncStatus === 'syncing') {
      return {
        bg: 'rgba(251, 191, 36, 0.25)',
        border: 'rgba(253, 224, 71, 0.5)',
        color: '#FEF08A',
        icon: 'sync' as const,
        label: pendingSyncCount > 0
          ? (isUrdu ? `ہم آہنگ ${pendingSyncCount}...` : `Syncing ${pendingSyncCount}...`)
          : (isUrdu ? 'ہم آہنگ...' : 'Syncing...'),
      };
    }

    if (syncStatus === 'error') {
      return {
        bg: 'rgba(239, 68, 68, 0.3)',
        border: 'rgba(252, 165, 165, 0.45)',
        color: '#FECACA',
        icon: 'alert-circle' as const,
        label: isUrdu ? 'ہم آہنگی ناکام' : 'Sync failed',
      };
    }

    if (pendingSyncCount > 0) {
      return {
        bg: 'rgba(249, 115, 22, 0.28)',
        border: 'rgba(253, 186, 116, 0.5)',
        color: '#FED7AA',
        icon: 'cloud-upload' as const,
        label: isUrdu ? `${pendingSyncCount} زیر التوا` : `${pendingSyncCount} pending`,
      };
    }

    return {
      bg: 'rgba(255, 255, 255, 0.18)',
      border: 'rgba(255, 255, 255, 0.28)',
      color: '#A7F3D0',
      icon: 'checkmark-circle' as const,
      label: isUrdu ? 'ہم آہنگ' : 'Synced',
    };
  };

  const pill = getSyncPillConfig();
  const isContinuousHero = activeTab === 'dashboard' || activeTab === 'products';

  return (
    <View
      style={[
        styles.headerContainer,
        {
          backgroundColor: theme.heroBg,
          borderWidth: 0,
          borderBottomWidth: 0,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
      ]}>
      {/* Left: Clickable Logo + Shop Info (Opens Quick Edit Shop Modal) */}
      <Pressable
        onPress={() => setIsEditShopOpen(true)}
        style={({ pressed }) => [
          styles.leftSection,
          pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] },
        ]}>
        <View style={styles.logoBadge}>
          {settings.profileImage && !settings.profileImage.includes('googleusercontent.com/a/') ? (
            <ProductImage
              uri={settings.profileImage}
              style={styles.logoImage}
              fallbackIcon={
                <Image
                  source={require('@/../assets/images/mainLogoImage.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              }
            />
          ) : (
            <Image
              source={require('@/../assets/images/mainLogoImage.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          )}
        </View>
        <View style={styles.titleWrap}>
          {/* Artistic Pill Badge with App Name */}
          <View style={styles.brushWrapper}>
            <View style={styles.brushStrokeBack} />
            <View style={styles.brushStrokeFront} />
            <Text style={styles.brushAppName}>⚡ DIGISHOP</Text>
          </View>
          <Text style={styles.shopTitle} numberOfLines={1}>
            {language === 'ur' && settings.shopNameUrdu
              ? settings.shopNameUrdu
              : (settings.shopName || (user?.displayName ? `${user.displayName}'s Store` : (language === 'ur' ? 'میری دکان' : 'My Store')))}
          </Text>
          <Text style={styles.shopSubtitle} numberOfLines={1}>
            {settings.ownerName || user?.displayName || ''}
            {settings.phone ? (settings.ownerName || user?.displayName ? ` • ${settings.phone}` : settings.phone) : ''}
          </Text>
        </View>
      </Pressable>

      {/* Right: Controls */}
      <View style={styles.rightSection}>
        {/* Sync Status Pill — hidden in guest mode: a guest shop is
            local-only, so a permanent "pending" counter only confuses. */}
        {!isGuestMode && (
        <Pressable
          onPress={handleSyncPillPress}
          accessibilityLabel="Sync Status Indicator"
          style={({ pressed }) => [
            styles.syncPill,
            { backgroundColor: pill.bg, borderColor: pill.border },
            pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] },
          ]}>
          <Ionicons name={pill.icon} size={13} color={pill.color} />
          <Text style={[styles.syncPillText, { color: pill.color }]}>{pill.label}</Text>
        </Pressable>
        )}

        {/* Alert Badge */}
        {totalAlerts > 0 && (
          <Pressable
            onPress={() => setActiveTab('products')}
            style={({ pressed }) => [
              styles.alertButton,
              pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
            ]}>
            <Ionicons name="warning" size={13} color="#FFFFFF" />
            <Text style={styles.alertText}>{totalAlerts}</Text>
          </Pressable>
        )}

        {/* Profile Avatar / Cloud Login Button */}
        <Pressable
          onPress={() => (user ? setActiveTab('settings') : setIsAuthModalOpen(true))}
          accessibilityLabel="Account & Settings"
          style={({ pressed }) => [
            styles.profileBtn,
            pressed && { opacity: 0.85, transform: [{ scale: 0.94 }] },
          ]}>
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.profileAvatarImg} />
          ) : (
            <Ionicons
              name={user ? 'person' : 'person-outline'}
              size={17}
              color="#FFFFFF"
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
    paddingVertical: Spacing.md,
    zIndex: 10,
    borderWidth: 0,
    elevation: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
    marginRight: Spacing.sm,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  logoImage: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
  },
  logoInner: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
  },
  brushWrapper: {
    position: 'relative',
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 1.5,
    marginBottom: 2,
    justifyContent: 'center',
  },
  brushStrokeBack: {
    position: 'absolute',
    top: 1,
    bottom: -1,
    left: -4,
    right: -6,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: [{ rotate: '-2deg' }, { skewX: '-10deg' }],
  },
  brushStrokeFront: {
    position: 'absolute',
    top: 1.5,
    bottom: 0.5,
    left: -1,
    right: -2,
    borderRadius: 3.5,
    backgroundColor: 'rgba(16, 185, 129, 0.55)',
    transform: [{ rotate: '1deg' }, { skewX: '4deg' }],
  },
  brushAppName: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  shopTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    letterSpacing: -0.4,
    color: '#FFFFFF',
  },
  shopSubtitle: {
    fontSize: 11,
    marginTop: 1,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  syncPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  syncPillText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  alertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4.5,
    borderRadius: BorderRadius.full,
    backgroundColor: '#EF4444',
  },
  alertText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profileAvatarImg: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
  },
});
