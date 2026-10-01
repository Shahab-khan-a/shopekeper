import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useShop } from '@/context/ShopContext';
import { Colors, Spacing, BorderRadius, Shadows, Typography } from '@/constants/theme';

export interface AlertModalButton {
  text: string;
  onPress?: () => void | Promise<void>;
  style?: 'primary' | 'destructive' | 'cancel' | 'default';
  icon?: keyof typeof Ionicons.glyphMap;
}

export type AlertModalType = 'success' | 'warning' | 'error' | 'danger' | 'info' | 'confirm';

export interface AlertModalProps {
  visible: boolean;
  type?: AlertModalType;
  title: string;
  message?: string;
  buttons?: AlertModalButton[];
  onClose: () => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  type = 'info',
  title,
  message,
  buttons,
  onClose,
}) => {
  const { settings, language, t } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const isUrdu = language === 'ur';

  // Config based on alert type
  const getConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'checkmark-circle' as const,
          iconColor: '#16A34A',
          iconBg: settings.darkMode ? '#064E3B44' : '#DCFCE7',
          borderColor: '#86EFAC',
        };
      case 'warning':
        return {
          icon: 'alert-circle' as const,
          iconColor: '#D97706',
          iconBg: settings.darkMode ? '#78350F44' : '#FEF3C7',
          borderColor: '#FDE68A',
        };
      case 'error':
      case 'danger':
        return {
          icon: 'close-circle' as const,
          iconColor: '#DC2626',
          iconBg: settings.darkMode ? '#7F1D1D44' : '#FEE2E2',
          borderColor: '#FECACA',
        };
      case 'confirm':
        return {
          icon: 'help-circle' as const,
          iconColor: '#4F46E5',
          iconBg: settings.darkMode ? '#312E8144' : '#EEF2FF',
          borderColor: '#C7D2FE',
        };
      case 'info':
      default:
        return {
          icon: 'information-circle' as const,
          iconColor: '#2563EB',
          iconBg: settings.darkMode ? '#1E3A8A44' : '#DBEAFE',
          borderColor: '#BFDBFE',
        };
    }
  };

  const config = getConfig();

  // If no buttons provided, provide default "OK" button
  const renderedButtons: AlertModalButton[] = buttons && buttons.length > 0
    ? buttons
    : [
        {
          text: isUrdu ? 'ٹھیک ہے' : 'OK',
          style: 'primary',
          onPress: onClose,
        },
      ];

  const handleButtonPress = async (btn: AlertModalButton) => {
    onClose();
    if (btn.onPress) {
      await btn.onPress();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}>
          {/* Header Icon Badge */}
          <View style={[styles.iconWrap, { backgroundColor: config.iconBg }]}>
            <Ionicons name={config.icon} size={28} color={config.iconColor} />
          </View>

          {/* Title */}
          <Text
            style={[
              styles.title,
              {
                color: theme.text,
                fontFamily: isUrdu ? Typography.urduFontFamily : undefined,
              },
            ]}>
            {title}
          </Text>

          {/* Message / Description */}
          {message ? (
            <Text
              style={[
                styles.message,
                {
                  color: theme.textSecondary,
                  fontFamily: isUrdu ? Typography.urduFontFamily : undefined,
                },
              ]}>
              {message}
            </Text>
          ) : null}

          {/* Action Buttons */}
          <View style={styles.actions}>
            {renderedButtons.map((btn, index) => {
              const isPrimary = btn.style === 'primary' || (!btn.style && index === 0);
              const isDestructive = btn.style === 'destructive';
              const isCancel = btn.style === 'cancel';

              let btnBg: string = theme.surfaceSubtle;
              let btnTextColor: string = theme.text;
              let btnBorderColor: string = theme.border;

              if (isPrimary) {
                btnBg = theme.primary;
                btnTextColor = '#FFFFFF';
                btnBorderColor = theme.primary;
              } else if (isDestructive) {
                btnBg = settings.darkMode ? '#7F1D1D22' : '#FEF2F2';
                btnTextColor = theme.danger;
                btnBorderColor = settings.darkMode ? '#7F1D1D55' : '#FECACA';
              } else if (isCancel) {
                btnBg = 'transparent';
                btnTextColor = theme.textMuted;
                btnBorderColor = 'transparent';
              }

              return (
                <Pressable
                  key={index}
                  onPress={() => handleButtonPress(btn)}
                  style={({ pressed }) => [
                    isCancel ? styles.cancelButton : styles.actionButton,
                    {
                      backgroundColor: btnBg,
                      borderColor: btnBorderColor,
                    },
                    pressed && { opacity: 0.82, transform: [{ scale: 0.98 }] },
                  ]}>
                  {btn.icon ? (
                    <Ionicons
                      name={btn.icon}
                      size={18}
                      color={btnTextColor}
                      style={{ marginRight: 6 }}
                    />
                  ) : null}
                  <Text
                    style={[
                      isCancel ? styles.cancelButtonText : styles.actionButtonText,
                      {
                        color: btnTextColor,
                        fontFamily: isUrdu ? Typography.urduFontFamily : undefined,
                      },
                    ]}>
                    {btn.text}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.62)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    ...Shadows.lg,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  message: {
    fontSize: 13.5,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },
  actions: {
    width: '100%',
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    ...Shadows.sm,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    width: '100%',
  },
  cancelButtonText: {
    fontSize: 13.5,
    fontWeight: '600',
  },
});
