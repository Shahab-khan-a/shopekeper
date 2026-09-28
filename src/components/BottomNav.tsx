import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useShop } from '@/context/ShopContext';
import { ActiveTab } from '@/types';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

const TabItem: React.FC<{
  tabKey: ActiveTab;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  isActive: boolean;
  hasBadge?: boolean;
  avatarUri?: string;
  onPress: () => void;
  theme: ReturnType<typeof Colors.dark extends typeof Colors.light ? () => typeof Colors.light : () => typeof Colors.dark>;
}> = ({ label, icon, isActive, hasBadge, avatarUri, onPress, theme }) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isActive) {
      Animated.sequence([
        Animated.timing(scale, { toValue: 0.88, duration: 80, useNativeDriver: Platform.OS !== 'web' }),
        Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: Platform.OS !== 'web' }),
      ]).start();
    }
  }, [isActive, scale]);

  if (isActive) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityLabel={label}
        accessibilityRole="tab"
        accessibilityState={{ selected: true }}
        style={({ pressed }) => [
          styles.tabItem,
          styles.activeTabOuter,
          pressed && { opacity: 0.85, transform: [{ scale: 0.93 }] },
        ]}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <View style={[styles.activeFabButton, { backgroundColor: theme.primary }]}>
            {avatarUri ? (
              <View style={[styles.avatarWrap, { borderColor: '#FFFFFF' }]}>
                <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
              </View>
            ) : (
              <Ionicons
                name={icon}
                size={22}
                color="#FFFFFF"
              />
            )}
            {hasBadge && (
              <View style={[styles.miniBadgeOnFab, { backgroundColor: theme.danger }]} />
            )}
          </View>
        </Animated.View>
        <Text
          numberOfLines={1}
          style={[
            styles.tabLabel,
            styles.activeFabLabel,
            { color: theme.primary },
          ]}>
          {label}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={label}
      accessibilityRole="tab"
      accessibilityState={{ selected: false }}
      style={({ pressed }) => [
        styles.tabItem,
        pressed && { opacity: 0.7 },
      ]}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <View style={styles.iconWrapper}>
          {avatarUri ? (
            <View style={[styles.avatarWrap, { borderColor: theme.border }]}>
              <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
            </View>
          ) : (
            <Ionicons
              name={`${icon}-outline` as any}
              size={20}
              color={theme.tabBarInactive}
            />
          )}
          {hasBadge && (
            <View style={[styles.miniBadge, { backgroundColor: theme.danger }]} />
          )}
        </View>
      </Animated.View>
      <Text
        numberOfLines={1}
        style={[
          styles.tabLabel,
          {
            color: theme.tabBarInactive,
            fontWeight: '500',
          },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
};

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, t, settings, lowStockProducts } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  // Reverted to initial order: Home (Dashboard) first, Products, Sale, History, Khata
  const tabs: {
    key: ActiveTab;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
  }[] = [
    { key: 'dashboard', label: t('home'), icon: 'home' },
    { key: 'products', label: t('products'), icon: 'cube' },
    { key: 'sale', label: t('sale'), icon: 'cart' },
    { key: 'history', label: t('history'), icon: 'receipt' },
    { key: 'khata', label: t('khata'), icon: 'book' },
  ];

  return (
    <View style={[styles.navContainer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
      <View style={styles.navInner}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TabItem
              key={tab.key}
              tabKey={tab.key}
              label={tab.label}
              icon={tab.icon}
              isActive={isActive}
              hasBadge={tab.key === 'products' && lowStockProducts.length > 0}
              onPress={() => setActiveTab(tab.key)}
              theme={theme as any}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    borderTopWidth: 1,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    zIndex: 20,
    width: '100%',
  },
  navInner: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    maxWidth: 680,
    marginHorizontal: 'auto',
    width: '100%',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
    minHeight: 48,
    gap: 2,
  },
  activeTabOuter: {
    marginTop: -16,
    paddingBottom: 2,
    gap: 3,
  },
  activeFabButton: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFabLabel: {
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  iconWrapper: {
    position: 'relative',
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  miniBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  miniBadgeOnFab: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  tabLabel: {
    fontSize: 9.5,
    textAlign: 'center',
    letterSpacing: 0.1,
  },
});
