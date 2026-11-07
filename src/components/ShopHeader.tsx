import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useShop } from '@/context/ShopContext';
import { Colors, Spacing, Shadows } from '@/constants/theme';
import { ProductImage } from '@/components/ProductImage';
import {
  SalesNotificationsModal,
  SALES_SEEN_AT_KEY,
} from '@/components/SalesNotificationsModal';

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
    isOnline,
    pendingSyncCount,
    syncNow,
    showAlert,
    sales,
  } = useShop();

  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const isUrdu = language === 'ur';
  const stockAlerts = lowStockProducts.length + outOfStockProducts.length;

  const [notifOpen, setNotifOpen] = useState(false);
  const [salesSeenAt, setSalesSeenAt] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(SALES_SEEN_AT_KEY)
      .then((val) => {
        if (!cancelled) setSalesSeenAt(val ? Number(val) || 0 : 0);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [notifOpen, sales.length]);

  const unreadSalesCount = useMemo(() => {
    return sales.filter((s) => {
      if (s.status === 'cancelled') return false;
      const ts = s.createdAt || Date.parse(s.date) || 0;
      return ts > salesSeenAt;
    }).length;
  }, [sales, salesSeenAt]);

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

  const openNotifications = useCallback(() => {
    setNotifOpen(true);
  }, []);

  const closeNotifications = useCallback(() => {
    setNotifOpen(false);
    setSalesSeenAt(Date.now());
  }, []);

  const handleViewAllBills = useCallback(() => {
    setNotifOpen(false);
    setSalesSeenAt(Date.now());
    setActiveTab('history');
  }, [setActiveTab]);

  const storeDisplayName =
    (isUrdu && settings.shopNameUrdu)
      ? settings.shopNameUrdu
      : (settings.shopName || (user?.displayName ? `${user.displayName}'s Store` : (isUrdu ? 'میری دکان' : 'My Store')));

  const storeInitials = (storeDisplayName || 'DS')
    .split(' ')
    .map((w: string) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'DS';

  const softBorder = settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(148, 163, 184, 0.2)';
  const headerBg = settings.darkMode ? '#0A0F1E' : '#F8FAFC';

  // Hide bell when already on History — user is viewing all bills
  const showNotifBell = activeTab !== 'history';

  return (
    <>
      <View
        style={[
          styles.headerContainer,
          {
            backgroundColor: headerBg,
          },
        ]}>
        <Pressable
          onPress={() => setIsEditShopOpen(true)}
          style={({ pressed }) => [
            styles.leftSection,
            pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] },
          ]}>
          <View style={styles.avatarWrap}>
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

            <View style={[styles.onlineDot, { backgroundColor: isOnline ? '#10B981' : '#F87171' }]} />
          </View>

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

        <View style={styles.rightSection}>
          {showNotifBell ? (
            <Pressable
              onPress={openNotifications}
              onLongPress={handleSyncPillPress}
              accessibilityLabel="Sales notifications"
              style={({ pressed }) => [
                styles.roundCircleBtn,
                { backgroundColor: theme.card, borderColor: softBorder },
                pressed && { opacity: 0.85, transform: [{ scale: 0.94 }] },
              ]}>
              <Ionicons name="notifications-outline" size={18} color={theme.text} />
              {unreadSalesCount > 0 && (
                <View style={[styles.bellCountBadge, { backgroundColor: theme.primary }]}>
                  <Text style={styles.bellCountText}>
                    {unreadSalesCount > 9 ? '9+' : unreadSalesCount}
                  </Text>
                </View>
              )}
            </Pressable>
          ) : null}

          <Pressable
            onPress={() => setActiveTab('settings')}
            accessibilityLabel={isUrdu ? 'سیٹنگز' : 'Settings'}
            style={({ pressed }) => [
              styles.roundCircleBtn,
              {
                backgroundColor:
                  activeTab === 'settings'
                    ? settings.darkMode
                      ? 'rgba(0, 201, 167, 0.16)'
                      : '#D1FAE5'
                    : theme.card,
                borderColor: activeTab === 'settings' ? theme.primary : softBorder,
              },
              pressed && { opacity: 0.85, transform: [{ scale: 0.94 }] },
            ]}>
            <Ionicons
              name={activeTab === 'settings' ? 'settings' : 'settings-outline'}
              size={18}
              color={activeTab === 'settings' ? theme.primary : theme.text}
            />
          </Pressable>
        </View>
      </View>

      <SalesNotificationsModal
        visible={notifOpen}
        onClose={closeNotifications}
        onViewAllBills={handleViewAllBills}
      />
    </>
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
  bellCountBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  bellCountText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
});
