import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useShop } from '@/context/ShopContext';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

export const ShopHeader: React.FC = () => {
  const {
    settings,
    language,
    lowStockProducts,
    outOfStockProducts,
    setActiveTab,
    setIsAuthModalOpen,
    setIsEditShopOpen,
    user,
    isOnline,
    syncStatus,
    pendingSyncCount,
    syncNow,
  } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const totalAlerts = lowStockProducts.length + outOfStockProducts.length;

  const handleSyncPillPress = async () => {
    if (!isOnline) {
      const msg =
        language === 'ur'
          ? `آپ آف لائن ہیں۔ ${pendingSyncCount} تبدیلیاں محفوظ ہیں اور انٹرنیٹ آتے ہی خود بخود کلاؤڈ پر منتقل ہو جائیں گی۔`
          : `You are offline. ${pendingSyncCount} local changes are safely queued and will sync automatically when internet returns.`;
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert('Offline Mode', msg);
      }
      return;
    }

    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    await syncNow();
  };

  // Determine Pill Appearance
  const getSyncPillConfig = () => {
    if (!isOnline) {
      return {
        bg: '#FEE2E2',
        border: '#FCA5A5',
        color: '#DC2626',
        icon: 'cloud-offline' as const,
        label: pendingSyncCount > 0 ? `Offline (${pendingSyncCount})` : 'Offline',
      };
    }

    if (syncStatus === 'syncing') {
      return {
        bg: '#FEF9C3',
        border: '#FDE047',
        color: '#CA8A04',
        icon: 'sync' as const,
        label: pendingSyncCount > 0 ? `Syncing ${pendingSyncCount}...` : 'Syncing...',
      };
    }

    if (syncStatus === 'error') {
      return {
        bg: '#FEE2E2',
        border: '#FCA5A5',
        color: '#DC2626',
        icon: 'alert-circle' as const,
        label: 'Sync failed',
      };
    }

    if (pendingSyncCount > 0) {
      return {
        bg: '#FFEDD5',
        border: '#FDBA74',
        color: '#EA580C',
        icon: 'cloud-upload' as const,
        label: `${pendingSyncCount} pending`,
      };
    }

    return {
      bg: '#DCFCE7',
      border: '#86EFAC',
      color: '#16A34A',
      icon: 'checkmark-circle' as const,
      label: 'Synced',
    };
  };

  const pill = getSyncPillConfig();

  return (
    <View style={[styles.headerContainer, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
      {/* Left: Clickable Logo + Shop Info (Opens Quick Edit Shop Modal) */}
      <Pressable
        onPress={() => setIsEditShopOpen(true)}
        style={({ pressed }) => [
          styles.leftSection,
          pressed && { opacity: 0.75, transform: [{ scale: 0.99 }] },
        ]}>
        <View style={[styles.logoBadge, { backgroundColor: theme.primaryLight }]}>
          {settings.profileImage && (!settings.profileImage.includes('googleusercontent.com') || settings.profileImage.includes('/d/')) ? (
            <Image source={{ uri: settings.profileImage }} style={styles.logoImage} />
          ) : (
            <View style={[styles.logoInner, { backgroundColor: theme.primary }]}>
              <Ionicons name="storefront" size={22} color="#FFFFFF" />
            </View>
          )}
        </View>
        <View style={styles.titleWrap}>
          <Text style={[styles.shopTitle, { color: theme.text }]} numberOfLines={1}>
            {language === 'ur' && settings.shopNameUrdu
              ? settings.shopNameUrdu
              : (settings.shopName || (user?.displayName ? `${user.displayName}'s Store` : 'My Store'))}
          </Text>
          <Text style={[styles.shopSubtitle, { color: theme.textSecondary }]} numberOfLines={1}>
            {settings.ownerName || user?.displayName || ''}
            {settings.phone ? (settings.ownerName || user?.displayName ? ` • ${settings.phone}` : settings.phone) : ''}
          </Text>
        </View>
      </Pressable>

      {/* Right: Controls */}
      <View style={styles.rightSection}>
        {/* Sync Status Pill */}
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

        {/* Alert Badge */}
        {totalAlerts > 0 && (
          <Pressable
            onPress={() => setActiveTab('products')}
            style={({ pressed }) => [
              styles.alertButton,
              { backgroundColor: theme.dangerLight },
              pressed && { opacity: 0.75, transform: [{ scale: 0.96 }] },
            ]}>
            <Ionicons name="warning" size={14} color={theme.danger} />
            <Text style={[styles.alertText, { color: theme.danger }]}>{totalAlerts}</Text>
          </Pressable>
        )}

        {/* Profile Avatar / Cloud Login Button */}
        <Pressable
          onPress={() => (user ? setActiveTab('settings') : setIsAuthModalOpen(true))}
          accessibilityLabel="Account & Settings"
          style={({ pressed }) => [
            styles.profileBtn,
            {
              backgroundColor: user ? theme.primaryLight : theme.surfaceSubtle,
              borderColor: theme.border,
            },
            pressed && { opacity: 0.8, transform: [{ scale: 0.94 }] },
          ]}>
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.profileAvatarImg} />
          ) : (
            <Ionicons
              name={user ? 'person' : 'person-outline'}
              size={17}
              color={user ? theme.primary : theme.textMuted}
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
    borderBottomWidth: 1,
    ...Shadows.sm,
    zIndex: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
    marginRight: Spacing.sm,
  },
  logoBadge: {
    width: 46,
    height: 46,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: 46,
    height: 46,
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
  shopTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  shopSubtitle: {
    fontSize: 11,
    marginTop: 1,
    fontWeight: '500',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  syncPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  syncPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  alertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  alertText: {
    fontSize: 12,
    fontWeight: '800',
  },
  profileBtn: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...Shadows.sm,
  },
  profileAvatarImg: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.full,
  },
});
