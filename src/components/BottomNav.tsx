import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useShop } from '@/context/ShopContext';
import { ActiveTab } from '@/types';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

const TabItem: React.FC<{
  tabKey: ActiveTab;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  isActive: boolean;
  hasBadge?: boolean;
  avatarUri?: string;
  onPress: () => void;
  theme: ReturnType<typeof Colors.dark extends typeof Colors.light ? () => typeof Colors.light : () => typeof Colors.dark>;
}> = ({ tabKey, label, icon, isActive, hasBadge, avatarUri, onPress, theme }) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isActive) {
      Animated.sequence([
        Animated.timing(scale, { toValue: 0.88, duration: 80, useNativeDriver: Platform.OS !== 'web' }),
        Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: Platform.OS !== 'web' }),
      ]).start();
    }
  }, [isActive, scale]);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tabItem,
        pressed && { opacity: 0.7 },
      ]}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <View
          style={[
            styles.iconWrapper,
            isActive && { backgroundColor: theme.primaryLight, borderRadius: BorderRadius.md },
          ]}>
          {avatarUri ? (
            <View style={[styles.avatarWrap, { borderColor: isActive ? theme.primary : theme.border }]}>
              <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
            </View>
          ) : (
            <Ionicons
              name={isActive ? icon : (`${icon}-outline` as any)}
              size={20}
              color={isActive ? theme.primary : theme.tabBarInactive}
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
            color: isActive ? theme.primary : theme.tabBarInactive,
            fontWeight: isActive ? '700' : '500',
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

  const tabs: {
    key: ActiveTab;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    isFab?: boolean;
  }[] = [
    { key: 'dashboard', label: t('home'), icon: 'home' },
    { key: 'products', label: t('products'), icon: 'cube' },
    { key: 'sale', label: t('sale'), icon: 'cart', isFab: true },
    { key: 'history', label: t('history'), icon: 'receipt' },
    { key: 'khata', label: t('khata'), icon: 'book' },
  ];

  return (
    <View style={[styles.navContainer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
      <View style={styles.navInner}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          if (tab.isFab) {
            return (
              <Pressable
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={({ pressed }) => [
                  styles.fabOuter,
                  { borderColor: theme.surface },
                  pressed && { transform: [{ scale: 0.93 }] },
                ]}>
                  <View style={[styles.fabButton, { backgroundColor: theme.primary }, Shadows.xl]}>
                  <Ionicons name="cart" size={22} color="#FFFFFF" />
                </View>
                <Text style={[styles.fabLabel, { color: theme.primary }]}>{tab.label}</Text>
              </Pressable>
            );
          }

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
    paddingHorizontal: Spacing.sm,
    ...Shadows.md,
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
    minHeight: 44,
    gap: 2,
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
  tabLabel: {
    fontSize: 9.5,
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  fabOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
    paddingBottom: 2,
    gap: 3,
    paddingHorizontal: 4,
  },
  fabButton: {
    width: 58,
    height: 58,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
    marginTop: 1,
  },
});

