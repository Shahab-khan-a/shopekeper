import { Colors, Spacing } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface SubScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  rightElement?: React.ReactNode;
}

/**
 * Unified top navigation bar for sub-screens reached from the Home Hub.
 * Provides a large, clearly labeled Back button for non-technical shopkeepers.
 */
export const SubScreenHeader: React.FC<SubScreenHeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightElement,
}) => {
  const { settings, language } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const isUrdu = language === 'ur';
  const softBorder = settings.darkMode
    ? 'rgba(255,255,255,0.1)'
    : 'rgba(148, 163, 184, 0.28)';

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: theme.background,
          borderBottomColor: softBorder,
        },
      ]}>
      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel={isUrdu ? 'واپس ہوم پر جائیں' : 'Back to Home'}
        hitSlop={8}
        style={({ pressed }) => [
          styles.backPill,
          {
            backgroundColor: theme.card,
            borderColor: softBorder,
          },
          pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
        ]}>
        <Ionicons
          name={isUrdu ? 'arrow-forward' : 'arrow-back'}
          size={18}
          color={theme.text}
        />
        <Text style={[styles.backText, { color: theme.text }]}>
          {isUrdu ? 'واپس' : 'Back'}
        </Text>
      </Pressable>

      <View style={styles.titleBlock}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: theme.textMuted }]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {rightElement ? (
        <View style={styles.rightWrap}>{rightElement}</View>
      ) : (
        <View style={styles.rightSpacer} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 10,
    zIndex: 20,
  },
  backPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 20,
    borderCurve: 'continuous',
    borderWidth: 1,
  },
  backText: {
    fontSize: 14,
    fontWeight: '700',
  },
  titleBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 11.5,
    fontWeight: '600',
    marginTop: 1,
  },
  rightWrap: {
    minWidth: 72,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rightSpacer: {
    width: 72,
  },
});

