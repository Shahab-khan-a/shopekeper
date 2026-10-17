import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BorderRadius, Shadows } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';

interface FloatingTourPromptProps {
  badgeUrdu: string;
  badgeEn: string;
  messageUrdu: string;
  messageEn: string;
  buttonUrdu: string;
  buttonEn: string;
  onPressButton: () => void;
  onSkip: () => void;
  bottom?: number;
}

export const FloatingTourPrompt: React.FC<FloatingTourPromptProps> = ({
  badgeUrdu,
  badgeEn,
  messageUrdu,
  messageEn,
  buttonUrdu,
  buttonEn,
  onPressButton,
  onSkip,
  bottom,
}) => {
  const insets = useSafeAreaInsets();
  const { language } = useShop();
  const isUrdu = language === 'ur';
  const effectiveBottom = bottom !== undefined ? bottom : Math.max(12, insets.bottom + 8);

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.floatingContainer,
        { bottom: effectiveBottom },
      ]}
    >
      <View style={styles.promptCard}>
        {/* Top Tag & Skip */}
        <View style={styles.topRow}>
          <View style={styles.badgeWrap}>
            <Ionicons name="sparkles" size={13} color="#FFFFFF" />
            <Text style={styles.badgeText}>{isUrdu ? badgeUrdu : badgeEn}</Text>
          </View>
          <Pressable onPress={onSkip} hitSlop={10} style={styles.skipBtn}>
            <Text style={styles.skipText}>{isUrdu ? 'چھوڑیں ✕' : 'Skip ✕'}</Text>
          </Pressable>
        </View>

        {/* Message */}
        <Text style={styles.messageText}>
          {isUrdu ? messageUrdu : messageEn}
        </Text>

        {/* Action Button */}
        <Pressable
          onPress={onPressButton}
          style={({ pressed }) => [
            styles.actionBtn,
            pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
          ]}
        >
          <Text style={styles.actionBtnText}>{isUrdu ? buttonUrdu : buttonEn}</Text>
          <Ionicons name="arrow-forward" size={16} color="#064E3B" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    left: 12,
    right: 12,
    zIndex: 99999,
  },
  promptCard: {
    backgroundColor: '#064E3B',
    borderRadius: BorderRadius.xl,
    padding: 14,
    gap: 8,
    borderWidth: 2,
    borderColor: '#34D399',
    ...Shadows.lg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#059669',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  skipText: {
    color: '#A7F3D0',
    fontSize: 11.5,
    fontWeight: '700',
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#34D399',
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    marginTop: 2,
  },
  actionBtnText: {
    color: '#064E3B',
    fontSize: 13.5,
    fontWeight: '900',
  },
  skipBtn: {
    padding: 2,
  },
});
