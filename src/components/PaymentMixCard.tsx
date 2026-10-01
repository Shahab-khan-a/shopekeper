import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';
import { Sale } from '@/types';
import { computeTodayPaymentMix } from '@/utils/analytics';
import { formatCompactPrice } from '@/utils/formatters';

interface PaymentMixCardProps {
  sales: Sale[];
}

export const PaymentMixCard: React.FC<PaymentMixCardProps> = ({ sales }) => {
  const { settings, language } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const mix = computeTodayPaymentMix(sales);

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.iconWrap, { backgroundColor: '#ECFDF5' }]}>
            <Ionicons name="cash-outline" size={16} color="#059669" />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>
            {language === 'ur' ? 'آج کی ادائیگیوں کی تقسیم' : "Today's Payment Mix"}
          </Text>
        </View>
        <Text style={[styles.totalAmount, { color: theme.textSecondary }]}>
          {settings.currencySymbol} {mix.total.toLocaleString()}
        </Text>
      </View>

      {/* Segmented Visual Progress Bar */}
      <View style={[styles.barTrack, { backgroundColor: theme.surfaceSubtle }]}>
        {mix.total === 0 ? (
          <View style={[styles.emptyBar, { backgroundColor: theme.border }]} />
        ) : (
          <>
            {mix.cashPercent > 0 && (
              <View
                style={[
                  styles.barSegment,
                  { width: `${mix.cashPercent}%`, backgroundColor: theme.success },
                ]}
              />
            )}
            {mix.onlinePercent > 0 && (
              <View
                style={[
                  styles.barSegment,
                  { width: `${mix.onlinePercent}%`, backgroundColor: theme.secondary },
                ]}
              />
            )}
            {mix.udhaarPercent > 0 && (
              <View
                style={[
                  styles.barSegment,
                  { width: `${mix.udhaarPercent}%`, backgroundColor: theme.danger },
                ]}
              />
            )}
          </>
        )}
      </View>

      {/* Breakdown Legend */}
      <View style={styles.legendRow}>
        {/* Cash */}
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.success }]} />
          <View>
            <Text style={[styles.legendLabel, { color: theme.textSecondary }]}>
              {language === 'ur' ? 'نقد' : 'Cash'} ({mix.cashPercent}%)
            </Text>
            <Text style={[styles.legendVal, { color: theme.text }]}>
              {settings.currencySymbol} {formatCompactPrice(mix.cash)}
            </Text>
          </View>
        </View>

        {/* Online */}
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.secondary }]} />
          <View>
            <Text style={[styles.legendLabel, { color: theme.textSecondary }]}>
              {language === 'ur' ? 'آن لائن' : 'Online'} ({mix.onlinePercent}%)
            </Text>
            <Text style={[styles.legendVal, { color: theme.text }]}>
              {settings.currencySymbol} {formatCompactPrice(mix.online)}
            </Text>
          </View>
        </View>

        {/* Udhaar */}
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.danger }]} />
          <View>
            <Text style={[styles.legendLabel, { color: theme.textSecondary }]}>
              {language === 'ur' ? 'ادھار' : 'Udhaar'} ({mix.udhaarPercent}%)
            </Text>
            <Text style={[styles.legendVal, { color: theme.danger }]}>
              {settings.currencySymbol} {formatCompactPrice(mix.udhaar)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
  },
  totalAmount: {
    fontSize: 12,
    fontWeight: '700',
  },
  barTrack: {
    height: 10,
    borderRadius: 5,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  barSegment: {
    height: '100%',
  },
  emptyBar: {
    width: '100%',
    height: '100%',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  legendVal: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 1,
  },
});
