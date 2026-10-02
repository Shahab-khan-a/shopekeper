import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomerKhata } from '@/types';
import { useShop } from '@/context/ShopContext';
import { Colors, BorderRadius, Shadows, Typography } from '@/constants/theme';

interface CustomerKhataCardProps {
  customer: CustomerKhata;
  onRecordPayment: (customer: CustomerKhata) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  overdueDays?: number;
}

export const CustomerKhataCard: React.FC<CustomerKhataCardProps> = ({
  customer,
  onRecordPayment,
  isExpanded,
  onToggleExpand,
  overdueDays = 0,
}) => {
  const { settings, t, language } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const isSettled = customer.totalDebt <= 0;
  const isOverdue = !isSettled && overdueDays >= 7;
  const isUrdu = language === 'ur';
  const softBorder = settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(148,163,184,0.35)';

  const primaryName = isUrdu && customer.nameUrdu ? customer.nameUrdu : customer.name;
  const secondaryName = isUrdu && customer.nameUrdu ? customer.name : customer.nameUrdu;
  const avatarChar = (primaryName || customer.name || '?').trim().charAt(0).toUpperCase();

  const lastTx = customer.transactions?.length
    ? [...customer.transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0]
    : null;

  const lastTxLabel = () => {
    if (!lastTx) return '—';
    const isPayment = lastTx.type === 'payment_received' || lastTx.type === 'payment';
    const d = new Date(lastTx.date);
    const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    if (isPayment) {
      return `${settings.currencySymbol}${lastTx.amount.toLocaleString()} · ${dateStr}`;
    }
    if (lastTx.billNumber) return `#${lastTx.billNumber}`;
    return dateStr;
  };

  const sendWhatsAppReminder = () => {
    const msgLang = settings.whatsappReminderLanguage || language;
    const shopHeader =
      msgLang === 'ur' && settings.shopNameUrdu ? settings.shopNameUrdu : settings.shopName;
    const customerDisplayName =
      msgLang === 'ur' && customer.nameUrdu ? customer.nameUrdu : customer.name;
    const formattedAmount = `${settings.currencySymbol} ${Math.max(0, customer.totalDebt).toLocaleString()}`;

    const message =
      msgLang === 'ur'
        ? `السلام علیکم ${customerDisplayName} صاحب!\n\nیہ ایک شائستہ یاد دہانی ہے کہ *${shopHeader}* پر آپ کا کل واجب الادا بقایا ادھار:\n👉 *${formattedAmount}* ہے۔\n\nشکریہ!\n*${settings.shopName}*\n📞 ${settings.phone}`
        : `Dear ${customerDisplayName},\n\nGentle reminder from *${shopHeader}* regarding your pending balance:\n👉 *${formattedAmount}*\n\nThank you!\n*${settings.shopName}*\n📞 ${settings.phone}`;

    const encoded = encodeURIComponent(message);
    const cleanPhone = customer.phone ? customer.phone.replace(/[^0-9]/g, '') : '';
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone.startsWith('92') ? cleanPhone : '92' + cleanPhone.replace(/^0/, '')}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;

    Linking.openURL(url).catch(() => {
      if (Platform.OS === 'web') window.open(url, '_blank');
    });
  };

  const handlePhoneCall = () => {
    if (!customer.phone) return;
    const cleanPhone = customer.phone.replace(/[^0-9+]/g, '');
    Linking.openURL(`tel:${cleanPhone}`).catch(() => {});
  };

  const formatTxDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: isOverdue
            ? settings.darkMode
              ? 'rgba(248,113,113,0.35)'
              : 'rgba(220,38,38,0.28)'
            : softBorder,
        },
      ]}>
      {/* Identity */}
      <View style={styles.header}>
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: isSettled
                ? theme.successLight
                : isOverdue
                  ? theme.dangerLight
                  : settings.darkMode
                    ? 'rgba(56,189,248,0.16)'
                    : '#E0F2FE',
            },
          ]}>
          <Text
            style={[
              styles.avatarText,
              {
                color: isSettled
                  ? theme.success
                  : isOverdue
                    ? theme.danger
                    : settings.darkMode
                      ? '#7DD3FC'
                      : '#0369A1',
                fontFamily:
                  isUrdu && customer.nameUrdu ? Typography.urduFontFamily : undefined,
              },
            ]}>
            {avatarChar}
          </Text>
        </View>

        <View style={styles.nameBlock}>
          <Text
            style={[
              styles.primaryName,
              {
                color: theme.text,
                fontFamily:
                  isUrdu && customer.nameUrdu ? Typography.urduFontFamily : undefined,
              },
            ]}
            numberOfLines={1}>
            {primaryName}
          </Text>
          {secondaryName ? (
            <Text
              style={[
                styles.secondaryName,
                {
                  color: theme.textMuted,
                  fontFamily:
                    !isUrdu && customer.nameUrdu ? Typography.urduFontFamily : undefined,
                },
              ]}
              numberOfLines={1}>
              ({secondaryName})
            </Text>
          ) : null}
          <Text style={[styles.metaLine, { color: theme.textMuted }]} numberOfLines={1}>
            {[customer.address, customer.phone].filter(Boolean).join(' · ') || '—'}
          </Text>
        </View>

        <Pressable
          onPress={onToggleExpand}
          hitSlop={8}
          style={({ pressed }) => [
            styles.moreBtn,
            pressed && { opacity: 0.7 },
          ]}>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'ellipsis-vertical'}
            size={16}
            color={theme.textMuted}
          />
        </Pressable>
      </View>

      {/* Debt box */}
      <View
        style={[
          styles.debtBox,
          {
            backgroundColor: settings.darkMode ? theme.surfaceSubtle : '#F1F5FB',
            borderColor: softBorder,
          },
        ]}>
        <View style={styles.debtLeft}>
          <Text style={[styles.debtLabel, { color: theme.textMuted }]}>
            {isSettled ? t('cleared') : t('outstandingUdhaar')}
          </Text>
          <View style={styles.debtAmountRow}>
            <Text
              style={[
                styles.debtAmount,
                { color: isSettled ? theme.success : theme.danger },
              ]}>
              {settings.currencySymbol}
              {Math.max(0, customer.totalDebt).toLocaleString()}
            </Text>
            {isOverdue ? (
              <View style={[styles.overduePill, { backgroundColor: theme.dangerLight }]}>
                <Text style={[styles.overduePillText, { color: theme.danger }]}>
                  {overdueDays}d {t('daysOverdue')}
                </Text>
              </View>
            ) : !isSettled ? (
              <View
                style={[
                  styles.overduePill,
                  {
                    backgroundColor: settings.darkMode
                      ? 'rgba(16,185,129,0.15)'
                      : 'rgba(167,243,208,0.45)',
                  },
                ]}>
                <Text style={[styles.overduePillText, { color: theme.primary }]}>
                  {customer.transactions?.filter(
                    (tx) => tx.type === 'credit_sale' || tx.type === 'credit'
                  ).length || 0}{' '}
                  {language === 'ur' ? 'بل' : 'bills'}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
        <View style={styles.debtRight}>
          <Text style={[styles.debtLabel, { color: theme.textMuted }]}>
            {t('lastTxLabel')}
          </Text>
          <Text
            style={[
              styles.lastTxValue,
              {
                color:
                  lastTx &&
                  (lastTx.type === 'payment_received' || lastTx.type === 'payment')
                    ? theme.primary
                    : theme.text,
              },
            ]}
            numberOfLines={1}>
            {lastTxLabel()}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        {isSettled ? (
          <View style={styles.settledWrap}>
            <Ionicons name="checkmark-circle" size={16} color={theme.success} />
            <Text style={[styles.settledText, { color: theme.success }]}>
              {t('settled')}
            </Text>
          </View>
        ) : (
          <Pressable
            onPress={() => onRecordPayment(customer)}
            style={({ pressed }) => [
              styles.vasooliBtn,
              { backgroundColor: theme.primary },
              pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
            ]}>
            <Ionicons name="cash" size={15} color="#FFFFFF" />
            <Text style={styles.vasooliBtnText}>{t('vasooliCash')}</Text>
          </Pressable>
        )}

        {!isSettled && customer.phone ? (
          <Pressable
            onPress={sendWhatsAppReminder}
            style={({ pressed }) => [
              styles.whatsappBtn,
              { backgroundColor: settings.darkMode ? '#047857' : '#059669' },
              pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
            ]}>
            <Ionicons name="logo-whatsapp" size={15} color="#FFFFFF" />
            <Text style={styles.whatsappBtnText}>{t('whatsapp')}</Text>
          </Pressable>
        ) : null}

        {customer.phone ? (
          <Pressable
            onPress={handlePhoneCall}
            style={({ pressed }) => [
              styles.iconBtn,
              {
                backgroundColor: settings.darkMode ? theme.surfaceSubtle : '#E5EEFF',
              },
              pressed && { opacity: 0.8 },
            ]}>
            <Ionicons name="call" size={16} color={theme.textSecondary} />
          </Pressable>
        ) : (
          <Pressable
            onPress={onToggleExpand}
            style={({ pressed }) => [
              styles.iconBtn,
              {
                backgroundColor: settings.darkMode ? theme.surfaceSubtle : '#E5EEFF',
              },
              pressed && { opacity: 0.8 },
            ]}>
            <Ionicons name="time-outline" size={16} color={theme.textSecondary} />
          </Pressable>
        )}
      </View>

      {/* History */}
      {isExpanded ? (
        <View style={[styles.historyContainer, { borderTopColor: softBorder }]}>
          <Text style={[styles.historyTitle, { color: theme.textMuted }]}>
            {t('recentTransactions')} ({customer.transactions.length})
          </Text>

          {customer.transactions.length === 0 ? (
            <Text style={[styles.noTxText, { color: theme.textMuted }]}>
              {t('noTransactions')}
            </Text>
          ) : (
            customer.transactions.slice(0, 8).map((tx) => {
              const isPayment = tx.type === 'payment_received' || tx.type === 'payment';
              return (
                <View
                  key={tx.id}
                  style={[
                    styles.txItem,
                    {
                      backgroundColor: isPayment
                        ? settings.darkMode
                          ? 'rgba(16,185,129,0.12)'
                          : '#F0FDF4'
                        : settings.darkMode
                          ? 'rgba(248,113,113,0.1)'
                          : '#FEF2F2',
                    },
                  ]}>
                  <View style={styles.txMiddle}>
                    <Text
                      style={[
                        styles.txType,
                        { color: isPayment ? theme.success : theme.danger },
                      ]}>
                      {isPayment ? t('paymentReceived') : t('creditSale')}
                      {tx.billNumber ? ` · #${tx.billNumber}` : ''}
                    </Text>
                    <Text style={[styles.txDate, { color: theme.textMuted }]}>
                      {formatTxDate(tx.date)}
                      {tx.note ? ` · ${tx.note}` : ''}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.txAmount,
                      { color: isPayment ? theme.success : theme.danger },
                    ]}>
                    {isPayment ? '−' : '+'}
                    {settings.currencySymbol}
                    {tx.amount.toLocaleString()}
                  </Text>
                </View>
              );
            })
          )}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    gap: 12,
    ...Shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 17,
    fontWeight: '800',
  },
  nameBlock: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  primaryName: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  secondaryName: {
    fontSize: 12,
    fontWeight: '500',
  },
  metaLine: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  moreBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  debtBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  debtLeft: { flex: 1, gap: 3, minWidth: 0 },
  debtRight: { alignItems: 'flex-end', gap: 3, maxWidth: '42%' },
  debtLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  debtAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  debtAmount: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  overduePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  overduePillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  lastTxValue: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },

  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  settledWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  settledText: {
    fontSize: 13,
    fontWeight: '700',
  },
  vasooliBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    borderRadius: 10,
  },
  vasooliBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  whatsappBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    borderRadius: 10,
  },
  whatsappBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  historyContainer: {
    borderTopWidth: 1,
    paddingTop: 10,
    gap: 6,
  },
  historyTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  noTxText: {
    fontSize: 12,
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  txMiddle: { flex: 1, minWidth: 0, gap: 2 },
  txType: { fontSize: 12, fontWeight: '700' },
  txDate: { fontSize: 10.5, fontWeight: '500' },
  txAmount: { fontSize: 13, fontWeight: '800' },
});
