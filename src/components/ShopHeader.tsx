import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Image } from 'react-native';
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
  } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const totalAlerts = lowStockProducts.length + outOfStockProducts.length;

  return (
    <View style={[styles.headerContainer, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
      {/* Left: Clickable Logo + Shop Info (Opens Store Details & Settings) */}
      <Pressable
        onPress={() => setActiveTab('settings')}
        style={({ pressed }) => [
          styles.leftSection,
          pressed && { opacity: 0.75, transform: [{ scale: 0.99 }] },
        ]}>
        <View style={[styles.logoBadge, { backgroundColor: theme.primaryLight }]}>
          {settings.profileImage ? (
            <Image source={{ uri: settings.profileImage }} style={styles.logoImage} />
          ) : (
            <View style={[styles.logoInner, { backgroundColor: theme.primary }]}>
              <Ionicons name="storefront" size={20} color="#FFFFFF" />
            </View>
          )}
        </View>
        <View style={styles.titleWrap}>
          <View style={styles.titleRow}>
            <Text style={[styles.shopTitle, { color: theme.text }]} numberOfLines={1}>
              {language === 'ur' && settings.shopNameUrdu ? settings.shopNameUrdu : settings.shopName}
            </Text>
            <Ionicons name="chevron-forward" size={14} color={theme.textMuted} style={{ marginTop: 2 }} />
          </View>
          <Text style={[styles.shopSubtitle, { color: theme.primary }]} numberOfLines={1}>
            {settings.ownerName
              ? `👤 ${settings.ownerName} ${settings.phone ? `• 📞 ${settings.phone}` : ''}`
              : (settings.phone ? `📞 ${settings.phone}` : (language === 'ur' ? 'دکان کی تفصیلات دیکھیں' : 'View Store Details'))}
          </Text>
        </View>
      </Pressable>

      {/* Right: Controls */}
      <View style={styles.rightSection}>
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

        {/* Profile / Store Settings Avatar Button */}
        <Pressable
          onPress={() => setActiveTab('settings')}
          accessibilityLabel="Profile & Settings"
          style={({ pressed }) => [
            styles.profileBtn,
            { backgroundColor: theme.primaryLight, borderColor: theme.border },
            pressed && { opacity: 0.8, transform: [{ scale: 0.94 }] },
          ]}>
          {settings.profileImage ? (
            <Image source={{ uri: settings.profileImage }} style={styles.profileAvatarImg} />
          ) : (
            <Ionicons name="person" size={17} color={theme.primary} />
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
