import { Colors, Shadows, Typography } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';
import { CustomerKhata } from '@/types';
import { openWhatsAppWithMessage } from '@/utils/whatsapp';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface CustomerKhataCardProps {
  customer: CustomerKhata;
  onRecordPayment: (customer: CustomerKhata) => void;
  onAddCredit?: (customer: CustomerKhata) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  overdueDays?: number;
}

export const CustomerKhataCard: React.FC<CustomerKhataCardProps> = ({
  customer,
  onRecordPayment,
  onAddCredit,
  isExpanded,
  onToggleExpand,
  overdueDays = 0,
}) => {
  const { settings, t, language } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const rawBalance = customer.balance ?? customer.totalDebt ?? 0;
  const hasAdvance = rawBalance < 0;
  const advanceAmount = hasAdvance ? Math.abs(rawBalance) : 0;
  const isSettled = customer.totalDebt <= 0 && !hasAdvance;
  const isOverdue = !isSettled && !hasAdvance && overdueDays >= 7;
  const isUrdu = language === 'ur';

  // Ambient soft border (delicate, never harsh)
  const softBorder = settings.darkMode
    ? 'rgba(255,255,255,0.07)'
    : isOverdue
      ? 'rgba(239, 68, 68, 0.22)'
      : 'rgba(148, 163, 184, 0.22)';

  const primaryName = isUrdu && customer.nameUrdu ? customer.nameUrdu : customer.name;
  const secondaryName = isUrdu && customer.nameUrdu ? customer.name : customer.nameUrdu;
  const avatarChar = (primaryName || customer.name || '?').trim().charAt(0).toUpperCase();

  const lastTx = customer.transactions?.length
    ? [...customer.transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0]
    : null;

  const lastTxLabel = () => {
    if (!lastTx) return null;
    const isPayment = lastTx.type === 'payment_received' || lastTx.type === 'payment';
    const d = new Date(lastTx.date);
    const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    if (isPayment) {
      return `${settings.currencySymbol}${lastTx.amount.toLocaleString()} · ${dateStr}`;
    }
    if (lastTx.billNumber) return `#${lastTx.billNumber} · ${dateStr}`;
    return dateStr;
  };

  const sendWhatsAppReminder = () => {
    const msgLang = settings.whatsappReminderLanguage || language;
    const shopHeader =
      msgLang === 'ur' && settings.shopNameUrdu ? settings.shopNameUrdu : settings.shopName;
    const customerDisplayName =
      msgLang === 'ur' && customer.nameUrdu ? customer.nameUrdu : customer.name;
    const formattedAmount = `${settings.currencySymbol} ${Math.max(0, customer.totalDebt).toLocaleString()}`;

    // Itemize recent credit transactions for bill transparency
    const recentCreditTxs = (customer.transactions || [])
      .filter((t) => t.type === 'credit' || t.type === 'credit_sale')
      .slice(0, 3);

    let breakdownUr = '';
    let breakdownEn = '';

    if (recentCreditTxs.length > 0) {
      breakdownUr =
        '\n\n*حالیہ ادھار بلز:*\n' +
        recentCreditTxs
          .map((t) => {
            const d = new Date(t.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
            const bill = t.billNumber ? ` (بل #${t.billNumber})` : '';
            return `• ${d}${bill}: ${settings.currencySymbol}${t.amount.toLocaleString()}`;
          })
          .join('\n');

      breakdownEn =
        '\n\n*Recent Credit Purchases:*\n' +
        recentCreditTxs
          .map((t) => {
            const d = new Date(t.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
            const bill = t.billNumber ? ` (Bill #${t.billNumber})` : '';
            return `• ${d}${bill}: ${settings.currencySymbol}${t.amount.toLocaleString()}`;
          })
          .join('\n');
    }

    const message =
      msgLang === 'ur'
        ? `السلام علیکم ${customerDisplayName} صاحب!\n\nیہ ایک شائستہ یاد دہانی ہے کہ *${shopHeader}* پر آپ کا کل واجب الادا بقایا ادھار:\n👉 *${formattedAmount}* ہے۔${breakdownUr}\n\nبرائے مہربانی سہولت کے مطابق ادائیگی فرما دیں۔ شکریہ!\n*${settings.shopName}*\n📞 ${settings.phone}`
        : `Dear ${customerDisplayName},\n\nGentle reminder from *${shopHeader}* regarding your pending balance:\n👉 *${formattedAmount}*${breakdownEn}\n\nPlease settle at your convenience. Thank you!\n*${settings.shopName}*\n📞 ${settings.phone}`;

    openWhatsAppWithMessage(customer.phone, message);
  };

  const handlePhoneCall = () => {
    if (!customer.phone) return;
    const cleanPhone = customer.phone.replace(/[^0-9+]/g, '');
    Linking.openURL(`tel:${cleanPhone}`).catch(() => { });
  };

  const formatTxDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Avatar pastel tint (soft & friendly)
  const avatarBg = isSettled
    ? (settings.darkMode ? 'rgba(16,185,129,0.12)' : '#ECFDF5')
    : isOverdue
      ? (settings.darkMode ? 'rgba(239,68,68,0.14)' : '#FEE2E2')
      : hasAdvance
        ? (settings.darkMode ? 'rgba(16,185,129,0.12)' : '#D1FAE5')
        : (settings.darkMode ? 'rgba(56,189,248,0.14)' : '#E0F2FE');

  const avatarColor = isSettled
    ? theme.success
    : isOverdue
      ? theme.danger
      : hasAdvance
        ? '#059669'
        : (settings.darkMode ? '#38BDF8' : '#0284C7');

  const billCount = customer.transactions?.filter(
    (tx) => tx.type === 'credit_sale' || tx.type === 'credit'
  ).length || 0;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: softBorder,
        },
      ]}>
      {/* ── Main Tap Area: Customer Summary & Balance (SadaPay Inspo Style) ── */}
      <Pressable
        onPress={onToggleExpand}
        style={styles.cardHeaderArea}
        accessibilityRole="button"
        accessibilityLabel={`${primaryName}, ${customer.totalDebt} rupees`}>
        {/* Soft squircle Avatar */}
        <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
          <Text
            style={[
              styles.avatarText,
              {
                color: avatarColor,
                fontFamily: isUrdu && customer.nameUrdu ? Typography.urduFontFamily : undefined,
              },
            ]}>
            {avatarChar}
          </Text>
        </View>

        {/* Center: Identity & Subtitle */}
        <View style={styles.nameBlock}>
          <View style={styles.nameRow}>
            <Text
              style={[
                styles.primaryName,
                {
                  color: theme.text,
                  fontFamily: isUrdu && customer.nameUrdu ? Typography.urduFontFamily : undefined,
                },
              ]}
              numberOfLines={1}>
              {primaryName}
            </Text>
            {secondaryName ? (
              <Text style={[styles.secondaryName, { color: theme.textMuted }]} numberOfLines={1}>
                ({secondaryName})
              </Text>
            ) : null}
          </View>

          <Text style={[styles.metaLine, { color: theme.textMuted }]} numberOfLines={1}>
            {customer.phone || customer.address || (lastTxLabel() ? `${t('lastTxLabel')}: ${lastTxLabel()}` : (isUrdu ? 'کھاتہ فعال' : 'Active Account'))}
          </Text>
        </View>

        {/* Right: Clean Prominent Amount & Soft Pill */}
        <View style={styles.balanceBlock}>
          <Text
            style={[
              styles.balanceAmount,
              {
                color: hasAdvance
                  ? '#059669'
                  : isSettled
                    ? theme.textMuted
                    : theme.danger,
              },
            ]}>
            {settings.currencySymbol}
            {hasAdvance
              ? advanceAmount.toLocaleString()
              : Math.max(0, customer.totalDebt).toLocaleString()}
          </Text>

          {/* Soft Capsule Pill */}
          {hasAdvance ? (
            <View style={[styles.capsulePill, { backgroundColor: settings.darkMode ? 'rgba(16,185,129,0.16)' : '#DCFCE7' }]}>
              <Text style={[styles.capsulePillText, { color: '#059669' }]}>
                {isUrdu ? 'پیشگی رقم' : 'Advance'}
              </Text>
            </View>
          ) : isOverdue ? (
            <View style={[styles.capsulePill, { backgroundColor: settings.darkMode ? 'rgba(239,68,68,0.18)' : '#FEE2E2' }]}>
              <Text style={[styles.capsulePillText, { color: theme.danger }]}>
                {overdueDays}d {t('daysOverdue')}
              </Text>
            </View>
          ) : isSettled ? (
            <View style={[styles.capsulePill, { backgroundColor: settings.darkMode ? 'rgba(255,255,255,0.06)' : '#F1F5F9' }]}>
              <Text style={[styles.capsulePillText, { color: theme.textSecondary }]}>
                {t('settled')} ✓
              </Text>
            </View>
          ) : (
            <View style={[styles.capsulePill, { backgroundColor: settings.darkMode ? 'rgba(255,255,255,0.06)' : '#F1F5F9' }]}>
              <Text style={[styles.capsulePillText, { color: theme.textSecondary }]}>
                {billCount} {isUrdu ? 'بلز' : 'bills'}
              </Text>
            </View>
          )}
        </View>
      </Pressable>

      {/* ── Soft Clean Actions Row (Rule of Two: Vasooli + WhatsApp) ── */}
      <View style={styles.actionsRow}>
        {isSettled ? (
          /* Settled State: Clean Cleared State + Gave Goods Option */
          <>
            <View
              style={[
                styles.settledBanner,
                { backgroundColor: settings.darkMode ? 'rgba(16,185,129,0.1)' : '#F0FDF4' },
              ]}>
              <Ionicons name="checkmark-circle" size={15} color={theme.success} />
              <Text style={[styles.settledBannerText, { color: theme.success }]}>
                {isUrdu ? 'حساب بے باق ہے (کوئی واجبات نہیں)' : 'Account Cleared · Zero Balance'}
              </Text>
            </View>

            <Pressable
              onPress={() => (onAddCredit ? onAddCredit(customer) : onToggleExpand())}
              style={({ pressed }) => [
                styles.subtleActionBtn,
                {
                  backgroundColor: settings.darkMode ? 'rgba(255,255,255,0.06)' : '#F8FAFC',
                  borderColor: softBorder,
                },
                pressed && { opacity: 0.8 },
              ]}>
              <Ionicons name="add" size={15} color={theme.textSecondary} />
              <Text style={[styles.subtleActionText, { color: theme.textSecondary }]}>
                {isUrdu ? '+ مال دیا' : '+ Credit'}
              </Text>
            </Pressable>
          </>
        ) : (
          /* Pending Debt State: Primary Vasooli Pill + 1-Tap WhatsApp */
          <>
            {/* Primary Action: Vasooli (وصولی کی) */}
            <Pressable
              onPress={() => onRecordPayment(customer)}
              style={({ pressed }) => [
                styles.vasooliPillBtn,
                { backgroundColor: theme.primary },
                pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
              ]}>
              <Ionicons name="cash" size={16} color="#FFFFFF" />
              <Text style={styles.vasooliPillText}>
                {isUrdu ? 'وصولی کی' : t('vasooliCash')}
              </Text>
            </Pressable>

            {/* WhatsApp Reminder (1-Tap) */}
            {customer.phone ? (
              <Pressable
                onPress={sendWhatsAppReminder}
                hitSlop={6}
                accessibilityLabel="Send WhatsApp bill reminder"
                style={({ pressed }) => [
                  styles.whatsappPillBtn,
                  {
                    backgroundColor: settings.darkMode ? '#064E3B' : '#DCFCE7',
                    borderColor: settings.darkMode ? '#059669' : '#86EFAC',
                  },
                  pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
                ]}>
                <Ionicons
                  name="logo-whatsapp"
                  size={18}
                  color={settings.darkMode ? '#34D399' : '#15803D'}
                />
              </Pressable>
            ) : null}

            {/* Expand / More Details */}
            <Pressable
              onPress={onToggleExpand}
              hitSlop={6}
              style={({ pressed }) => [
                styles.expandToggleBtn,
                {
                  backgroundColor: settings.darkMode ? 'rgba(255,255,255,0.06)' : '#F8FAFC',
                  borderColor: softBorder,
                },
                pressed && { opacity: 0.8 },
              ]}>
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={theme.textMuted}
              />
            </Pressable>
          </>
        )}
      </View>

      {/* ── Expanded Drawer: Quick Actions & Transaction History ── */}
      {isExpanded ? (
        <View
          style={[
            styles.expandedContainer,
            {
              borderTopColor: settings.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
            },
          ]}>
          {/* Secondary Actions Tray */}
          <View style={styles.secondaryActionsRow}>
            {/* Gave Credit (+ مال دیا) */}
            <Pressable
              onPress={() => (onAddCredit ? onAddCredit(customer) : null)}
              style={({ pressed }) => [
                styles.secondaryPillBtn,
                {
                  backgroundColor: settings.darkMode ? 'rgba(239, 68, 68, 0.12)' : '#FEE2E2',
                  borderColor: settings.darkMode ? 'rgba(239, 68, 68, 0.25)' : '#FECACA',
                },
                pressed && { opacity: 0.85 },
              ]}>
              <Ionicons name="add-circle" size={14} color={theme.danger} />
              <Text style={[styles.secondaryPillText, { color: theme.danger }]}>
                {isUrdu ? '+ نیا ادھار / مال دیا' : '+ Gave Goods (Credit)'}
              </Text>
            </Pressable>

            {/* Call Customer */}
            {customer.phone ? (
              <Pressable
                onPress={handlePhoneCall}
                style={({ pressed }) => [
                  styles.secondaryPillBtn,
                  {
                    backgroundColor: settings.darkMode ? 'rgba(56, 189, 248, 0.12)' : '#EFF6FF',
                    borderColor: settings.darkMode ? 'rgba(56, 189, 248, 0.25)' : '#BFDBFE',
                  },
                  pressed && { opacity: 0.85 },
                ]}>
                <Ionicons name="call" size={13} color="#2563EB" />
                <Text style={[styles.secondaryPillText, { color: '#2563EB' }]}>
                  {isUrdu ? 'کال کریں' : 'Call'}
                </Text>
              </Pressable>
            ) : null}
          </View>

          {/* Transactions List */}
          <View style={styles.historyList}>
            <Text style={[styles.historyHeader, { color: theme.textMuted }]}>
              {t('recentTransactions')} ({customer.transactions?.length || 0})
            </Text>

            {!customer.transactions || customer.transactions.length === 0 ? (
              <Text style={[styles.noTxText, { color: theme.textMuted }]}>
                {t('noTransactions')}
              </Text>
            ) : (
              customer.transactions.slice(0, 6).map((tx) => {
                const isPayment = tx.type === 'payment_received' || tx.type === 'payment';
                return (
                  <View
                    key={tx.id}
                    style={[
                      styles.txRow,
                      {
                        backgroundColor: isPayment
                          ? settings.darkMode
                            ? 'rgba(16,185,129,0.1)'
                            : '#F0FDF4'
                          : settings.darkMode
                            ? 'rgba(248,113,113,0.08)'
                            : '#FEF2F2',
                      },
                    ]}>
                    <View style={styles.txLeft}>
                      <View
                        style={[
                          styles.txDot,
                          { backgroundColor: isPayment ? theme.success : theme.danger },
                        ]}
                      />
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <Text
                          style={[
                            styles.txTitle,
                            { color: isPayment ? theme.success : theme.danger },
                          ]}
                          numberOfLines={1}>
                          {isPayment ? t('paymentReceived') : t('creditSale')}
                          {tx.billNumber ? ` · #${tx.billNumber}` : ''}
                        </Text>
                        <Text style={[styles.txMeta, { color: theme.textMuted }]} numberOfLines={1}>
                          {formatTxDate(tx.date)}
                          {tx.note ? ` · ${tx.note}` : ''}
                        </Text>
                      </View>
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
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    gap: 12,
    ...Shadows.sm,
  },
  cardHeaderArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
  },
  nameBlock: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  primaryName: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  secondaryName: {
    fontSize: 12.5,
    fontWeight: '500',
  },
  metaLine: {
    fontSize: 12,
    fontWeight: '500',
  },
  balanceBlock: {
    alignItems: 'flex-end',
    gap: 4,
  },
  balanceAmount: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  capsulePill: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 999,
  },
  capsulePillText: {
    fontSize: 10,
    fontWeight: '700',
  },

  // Actions Row
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 2,
  },
  vasooliPillBtn: {
    flex: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  vasooliPillText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  whatsappPillBtn: {
    width: 42,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandToggleBtn: {
    width: 38,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settledBanner: {
    flex: 1,
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  settledBannerText: {
    fontSize: 12,
    fontWeight: '700',
  },
  subtleActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 38,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  subtleActionText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Expanded
  expandedContainer: {
    borderTopWidth: 1,
    paddingTop: 12,
    gap: 10,
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  secondaryPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
  },
  secondaryPillText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  historyList: {
    gap: 6,
    paddingTop: 2,
  },
  historyHeader: {
    fontSize: 10.5,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  noTxText: {
    fontSize: 12,
    fontStyle: 'italic',
    paddingVertical: 4,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  txDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  txTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  txMeta: {
    fontSize: 10.5,
    fontWeight: '500',
  },
  txAmount: {
    fontSize: 12.5,
    fontWeight: '800',
  },
});
