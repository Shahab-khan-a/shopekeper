import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  Platform,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomerKhata } from '@/types';
import { useShop } from '@/context/ShopContext';
import { Colors, Spacing, BorderRadius, Shadows, Typography } from '@/constants/theme';

interface CustomerKhataCardProps {
  customer: CustomerKhata;
  onRecordPayment: (customer: CustomerKhata) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const CustomerKhataCard: React.FC<CustomerKhataCardProps> = ({
  customer,
  onRecordPayment,
  isExpanded,
  onToggleExpand,
}) => {
  const { settings, t, language } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const isSettled = customer.totalDebt <= 0;
  const isUrdu = language === 'ur';

  const [showWhatsAppSheet, setShowWhatsAppSheet] = useState(false);

  // Primary and secondary display names
  const primaryName = isUrdu && customer.nameUrdu ? customer.nameUrdu : customer.name;
  const secondaryName = isUrdu && customer.nameUrdu ? customer.name : customer.nameUrdu;

  // Avatar letter
  const avatarChar = (primaryName || customer.name || '?').trim().charAt(0).toUpperCase();

  // WhatsApp Reminder
  const sendWhatsAppReminder = (msgLang: 'en' | 'ur') => {
    setShowWhatsAppSheet(false);
    const shopHeader = (msgLang === 'ur' && settings.shopNameUrdu) ? settings.shopNameUrdu : settings.shopName;
    const customerDisplayName = msgLang === 'ur' && customer.nameUrdu ? customer.nameUrdu : customer.name;
    const formattedAmount = `${settings.currencySymbol} ${Math.max(0, customer.totalDebt).toLocaleString()}`;

    let message = '';
    if (msgLang === 'ur') {
      message = `
السلام علیکم ${customerDisplayName} صاحب!
امید ہے آپ بخیریت ہوں گے۔

یہ ایک شائستہ یاد دہانی ہے کہ *${shopHeader}* پر آپ کا کل واجب الادا بقایا ادھار:
👉 *${formattedAmount}* ہے۔

برائے مہربانی سہولت کے مطابق تشریف لا کر رقم ادا فرما دیں۔

شکریہ و جزاک اللہ!
*${settings.shopName}*
📞 ${settings.phone}
      `.trim();
    } else {
      message = `
Dear ${customerDisplayName},

Hope you are doing well.

This is a gentle reminder from *${settings.shopName}* regarding your pending balance:
👉 *${formattedAmount}*

Kindly arrange for the payment at your earliest convenience.

Thank you!
*${settings.shopName}*
📞 ${settings.phone}
      `.trim();
    }

    const encoded = encodeURIComponent(message);
    const cleanPhone = customer.phone ? customer.phone.replace(/[^0-9]/g, '') : '';
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone.startsWith('92') ? cleanPhone : '92' + cleanPhone.replace(/^0/, '')}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;

    Linking.openURL(url).catch(() => {
      if (Platform.OS === 'web') {
        window.open(url, '_blank');
      }
    });
  };

  // Direct Phone Call
  const handlePhoneCall = () => {
    if (!customer.phone) return;
    const cleanPhone = customer.phone.replace(/[^0-9+]/g, '');
    Linking.openURL(`tel:${cleanPhone}`).catch(() => {
      // ignore
    });
  };

  // Format relative or standard date
  const formatTxDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
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
          borderColor: isSettled ? theme.border : theme.dangerLight,
          borderLeftColor: isSettled ? theme.success : theme.danger,
        },
      ]}>
      {/* ── Top Header Section ── */}
      <View style={styles.cardHeader}>
        {/* Left: Avatar + Names + Status */}
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.avatarContainer,
              {
                backgroundColor: isSettled ? theme.successLight : theme.dangerLight,
              },
            ]}>
            <Text
              style={[
                styles.avatarText,
                {
                  color: isSettled ? theme.success : theme.danger,
                  fontFamily: isUrdu && customer.nameUrdu ? Typography.urduFontFamily : undefined,
                },
              ]}>
              {avatarChar}
            </Text>
            {/* Status mini badge */}
            <View
              style={[
                styles.avatarBadge,
                { backgroundColor: isSettled ? theme.success : theme.danger },
              ]}>
              <Ionicons
                name={isSettled ? 'checkmark' : 'alert'}
                size={9}
                color="#FFFFFF"
              />
            </View>
          </View>

          <View style={styles.nameBlock}>
            <View style={styles.primaryNameRow}>
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
            </View>

            {secondaryName ? (
              <Text
                style={[
                  styles.secondaryName,
                  {
                    color: theme.textSecondary,
                    fontFamily: !isUrdu && customer.nameUrdu ? Typography.urduFontFamily : undefined,
                  },
                ]}
                numberOfLines={1}>
                {secondaryName}
              </Text>
            ) : null}

            {/* Micro status chip */}
            <View
              style={[
                styles.statusMicroChip,
                {
                  backgroundColor: isSettled ? theme.successLight : theme.dangerLight,
                },
              ]}>
              <Ionicons
                name={isSettled ? 'checkmark-circle' : 'time-outline'}
                size={11}
                color={isSettled ? theme.success : theme.danger}
              />
              <Text
                style={[
                  styles.statusMicroChipText,
                  { color: isSettled ? theme.success : theme.danger },
                ]}>
                {isSettled ? t('settled') : t('pendingDebt')}
              </Text>
            </View>
          </View>
        </View>

        {/* Right: Debt Balance Box */}
        <View
          style={[
            styles.debtBox,
            {
              backgroundColor: isSettled ? theme.successLight : theme.dangerLight,
              borderColor: isSettled ? theme.success : theme.danger,
            },
          ]}>
          <Text
            style={[
              styles.debtBoxLabel,
              { color: isSettled ? theme.success : theme.danger },
            ]}>
            {isSettled ? t('cleared') : t('debtAmount')}
          </Text>
          <Text
            style={[
              styles.debtBoxAmount,
              { color: isSettled ? theme.success : theme.danger },
            ]}>
            {settings.currencySymbol} {Math.max(0, customer.totalDebt).toLocaleString()}
          </Text>
        </View>
      </View>

      {/* ── Metadata Info Chips ── */}
      <View style={styles.metaRow}>
        {/* Clickable Phone Chip */}
        {customer.phone ? (
          <Pressable
            onPress={handlePhoneCall}
            style={({ pressed }) => [
              styles.metaChip,
              { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
              pressed && { opacity: 0.7 },
            ]}>
            <Ionicons name="call-outline" size={12} color={theme.primary} />
            <Text style={[styles.metaChipText, { color: theme.text }]}>
              {customer.phone}
            </Text>
          </Pressable>
        ) : null}

        {/* Address Chip */}
        {customer.address ? (
          <View
            style={[
              styles.metaChip,
              styles.metaChipFlex,
              { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
            ]}>
            <Ionicons name="location-outline" size={12} color={theme.textMuted} />
            <Text
              style={[styles.metaChipText, { color: theme.textSecondary }]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {customer.address}
            </Text>
          </View>
        ) : null}

        {/* Transaction Count Chip */}
        <View
          style={[
            styles.metaChip,
            { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
          ]}>
          <Ionicons name="receipt-outline" size={12} color={theme.textMuted} />
          <Text style={[styles.metaChipText, { color: theme.textSecondary }]}>
            {customer.transactions.length}
          </Text>
        </View>
      </View>

      {/* ── Quick Action Buttons Row ── */}
      <View style={[styles.actionsRow, { borderTopColor: theme.border }]}>
        {/* Record Payment (Vasooli) Button */}
        {isSettled ? (
          <View style={styles.settledLabelWrap}>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={theme.success}
            />
            <Text
              style={[
                styles.settledLabelText,
                { color: theme.success },
              ]}>
              {t('cleared')}
            </Text>
          </View>
        ) : (
          <Pressable
            onPress={() => onRecordPayment(customer)}
            style={({ pressed }) => [
              styles.vasooliBtn,
              {
                backgroundColor: theme.primary,
                borderColor: theme.primary,
                borderWidth: 0,
              },
              pressed && { opacity: 0.82, transform: [{ scale: 0.98 }] },
            ]}>
            <Ionicons
              name="cash-outline"
              size={16}
              color="#FFFFFF"
            />
            <Text
              style={[
                styles.vasooliBtnText,
                { color: '#FFFFFF', fontWeight: '700' },
              ]}
              numberOfLines={1}>
              {t('vasooliShort')}
            </Text>
          </Pressable>
        )}

        {/* WhatsApp Reminder Button - opens language action sheet */}
        {customer.phone && !isSettled ? (
          <Pressable
            onPress={() => setShowWhatsAppSheet(true)}
            style={({ pressed }) => [
              styles.whatsappBtn,
              pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
            ]}>
            <Ionicons name="logo-whatsapp" size={15} color="#FFFFFF" />
            <Text style={styles.whatsappBtnText}>{t('whatsapp')}</Text>
          </Pressable>
        ) : null}

        {/* Quick Phone Call Button */}
        {customer.phone ? (
          <Pressable
            onPress={handlePhoneCall}
            style={({ pressed }) => [
              styles.callBtn,
              { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
              pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] },
            ]}>
            <Ionicons name="call" size={14} color={theme.primary} />
          </Pressable>
        ) : null}

        {/* History Accordion Toggle Button */}
        <Pressable
          onPress={onToggleExpand}
          style={({ pressed }) => [
            styles.expandBtn,
            { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
            pressed && { opacity: 0.8 },
          ]}>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={theme.textSecondary}
          />
        </Pressable>
      </View>

      {/* ── Transaction History Accordion ── */}
      {isExpanded && (
        <View style={[styles.historyContainer, { borderTopColor: theme.border }]}>
          <View style={styles.historyHeader}>
            <Text style={[styles.historyTitle, { color: theme.textSecondary }]}>
              {t('recentTransactions')}
            </Text>
            <Text style={[styles.historyCountBadge, { color: theme.textMuted }]}>
              ({customer.transactions.length})
            </Text>
          </View>

          {customer.transactions.length === 0 ? (
            <View style={[styles.noTxBox, { backgroundColor: theme.surfaceSubtle }]}>
              <Ionicons name="document-text-outline" size={24} color={theme.textMuted} />
              <Text style={[styles.noTxText, { color: theme.textMuted }]}>
                {t('noTransactions')}
              </Text>
            </View>
          ) : (
            customer.transactions.slice(0, 10).map((tx) => {
              const isPayment = tx.type === 'payment_received';

              return (
                <View
                  key={tx.id}
                  style={[
                    styles.txItem,
                    {
                      backgroundColor: isPayment
                        ? settings.darkMode
                          ? '#064E3B'
                          : '#F0FDF4'
                        : settings.darkMode
                        ? '#3F1212'
                        : '#FEF2F2',
                      borderColor: isPayment
                        ? settings.darkMode
                          ? '#047857'
                          : '#BBF7D0'
                        : settings.darkMode
                        ? '#7F1D1D'
                        : '#FECACA',
                    },
                  ]}>
                  {/* Left: Direction Icon */}
                  <View
                    style={[
                      styles.txIconWrap,
                      {
                        backgroundColor: isPayment
                          ? theme.successLight
                          : theme.dangerLight,
                      },
                    ]}>
                    <Ionicons
                      name={isPayment ? 'arrow-down' : 'arrow-up'}
                      size={14}
                      color={isPayment ? theme.success : theme.danger}
                    />
                  </View>

                  {/* Middle: Details */}
                  <View style={styles.txDetails}>
                    <View style={styles.txTypeRow}>
                      <Text
                        style={[
                          styles.txTypeLabel,
                          { color: isPayment ? theme.success : theme.danger },
                        ]}>
                        {isPayment ? t('paymentReceived') : t('creditSale')}
                      </Text>
                      {tx.billNumber ? (
                        <View
                          style={[
                            styles.txBillBadge,
                            {
                              backgroundColor: isPayment
                                ? theme.successLight
                                : theme.dangerLight,
                            },
                          ]}>
                          <Text
                            style={[
                              styles.txBillBadgeText,
                              { color: isPayment ? theme.success : theme.danger },
                            ]}>
                            #{tx.billNumber}
                          </Text>
                        </View>
                      ) : null}
                    </View>

                    <Text style={[styles.txDate, { color: theme.textMuted }]}>
                      {formatTxDate(tx.date)}
                      {tx.note ? ` • ${tx.note}` : ''}
                    </Text>
                  </View>

                  {/* Right: Amount */}
                  <View style={styles.txAmountBlock}>
                    <Text
                      style={[
                        styles.txAmount,
                        { color: isPayment ? theme.success : theme.danger },
                      ]}>
                      {isPayment ? '-' : '+'} {settings.currencySymbol}
                      {tx.amount.toLocaleString()}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>
      )}

      {/* ── WhatsApp Language Action Sheet Modal ── */}
      <Modal
        visible={showWhatsAppSheet}
        transparent
        animationType="fade"
        onRequestClose={() => setShowWhatsAppSheet(false)}>
        <View style={styles.sheetOverlay}>
          <Pressable
            style={styles.sheetBackdrop}
            onPress={() => setShowWhatsAppSheet(false)}
          />

          <View
            style={[
              styles.sheetContainer,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}>
            {/* Sheet grab handle */}
            <View style={[styles.sheetHandle, { backgroundColor: theme.border }]} />

            {/* Sheet Header */}
            <View style={styles.sheetHeader}>
              <View style={styles.sheetHeaderLeft}>
                <View style={styles.sheetIconWrap}>
                  <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.sheetTitleBlock}>
                  <Text style={[styles.sheetTitle, { color: theme.text }]}>
                    {t('sendWhatsAppReminder')}
                  </Text>
                  <Text style={[styles.sheetSubtitle, { color: theme.textSecondary }]}>
                    {primaryName} • {settings.currencySymbol} {Math.max(0, customer.totalDebt).toLocaleString()}
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => setShowWhatsAppSheet(false)}
                style={({ pressed }) => [
                  styles.sheetCloseBtn,
                  { backgroundColor: theme.surfaceSubtle },
                  pressed && { opacity: 0.7 },
                ]}>
                <Ionicons name="close" size={18} color={theme.textSecondary} />
              </Pressable>
            </View>

            {/* Instruction */}
            <Text style={[styles.sheetInstruction, { color: theme.textMuted }]}>
              {isUrdu
                ? 'پیغام کی زبان منتخب کریں:'
                : 'Select reminder message language:'}
            </Text>

            {/* Language Options */}
            <View style={styles.sheetOptions}>
              {/* Urdu Option */}
              <Pressable
                onPress={() => sendWhatsAppReminder('ur')}
                style={({ pressed }) => [
                  styles.sheetOptionCard,
                  {
                    backgroundColor: theme.surfaceSubtle,
                    borderColor: theme.border,
                  },
                  pressed && {
                    backgroundColor: settings.darkMode ? '#064E3B' : '#ECFDF5',
                    borderColor: '#25D366',
                    transform: [{ scale: 0.99 }],
                  },
                ]}>
                <View style={styles.sheetOptionBadge}>
                  <Text style={styles.flagEmoji}>🇵🇰</Text>
                </View>

                <View style={styles.sheetOptionTextCol}>
                  <View style={styles.sheetOptionTitleRow}>
                    <Text
                      style={[
                        styles.sheetOptionTitle,
                        { color: theme.text, fontFamily: Typography.urduFontFamily },
                      ]}>
                      اردو میں پیغام بھیجیں
                    </Text>
                    <View style={styles.tagUrdu}>
                      <Text style={styles.tagUrduText}>اردو</Text>
                    </View>
                  </View>
                  <Text
                    style={[styles.sheetOptionPreview, { color: theme.textMuted }]}
                    numberOfLines={1}>
                    "السلام علیکم... کل واجب الادا بقایا ادھار: {settings.currencySymbol} {Math.max(0, customer.totalDebt).toLocaleString()}"
                  </Text>
                </View>

                <View style={[styles.sheetOptionSendIcon, { backgroundColor: '#25D366' }]}>
                  <Ionicons name="send" size={13} color="#FFFFFF" />
                </View>
              </Pressable>

              {/* English Option */}
              <Pressable
                onPress={() => sendWhatsAppReminder('en')}
                style={({ pressed }) => [
                  styles.sheetOptionCard,
                  {
                    backgroundColor: theme.surfaceSubtle,
                    borderColor: theme.border,
                  },
                  pressed && {
                    backgroundColor: settings.darkMode ? '#064E3B' : '#ECFDF5',
                    borderColor: '#25D366',
                    transform: [{ scale: 0.99 }],
                  },
                ]}>
                <View style={styles.sheetOptionBadge}>
                  <Text style={styles.flagEmoji}>🇬🇧</Text>
                </View>

                <View style={styles.sheetOptionTextCol}>
                  <View style={styles.sheetOptionTitleRow}>
                    <Text style={[styles.sheetOptionTitle, { color: theme.text }]}>
                      Send in English
                    </Text>
                    <View style={styles.tagEnglish}>
                      <Text style={styles.tagEnglishText}>English</Text>
                    </View>
                  </View>
                  <Text
                    style={[styles.sheetOptionPreview, { color: theme.textMuted }]}
                    numberOfLines={1}>
                    "Dear {customer.name}... pending balance: {settings.currencySymbol} {Math.max(0, customer.totalDebt).toLocaleString()}"
                  </Text>
                </View>

                <View style={[styles.sheetOptionSendIcon, { backgroundColor: '#25D366' }]}>
                  <Ionicons name="send" size={13} color="#FFFFFF" />
                </View>
              </Pressable>
            </View>

            {/* Cancel Button */}
            <Pressable
              onPress={() => setShowWhatsAppSheet(false)}
              style={({ pressed }) => [
                styles.sheetCancelBtn,
                { borderColor: theme.border, backgroundColor: theme.surfaceSubtle },
                pressed && { opacity: 0.7 },
              ]}>
              <Text style={[styles.sheetCancelText, { color: theme.textSecondary }]}>
                {t('cancel')}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: Spacing.md,
    ...Shadows.md,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
    minWidth: 0,
  },
  avatarContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 19,
    fontWeight: '800',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  nameBlock: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  primaryNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryName: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  secondaryName: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusMicroChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    marginTop: 2,
  },
  statusMicroChipText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  debtBox: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    flexShrink: 0,
  },
  debtBoxLabel: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  debtBoxAmount: {
    fontSize: 18,
    fontWeight: '900',
    marginTop: 1,
    letterSpacing: -0.3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: Spacing.sm,
    overflow: 'hidden',
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  metaChipFlex: {
    flex: 1,
    flexShrink: 1,
    minWidth: 80,
    maxWidth: '100%',
    overflow: 'hidden',
  },
  metaChipText: {
    fontSize: 11,
    fontWeight: '600',
    flexShrink: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
  },
  settledLabelWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  settledLabelText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  vasooliBtn: {
    flex: 1,
    minWidth: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: BorderRadius.full,
    ...Shadows.sm,
  },
  vasooliBtnText: {
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.2,
  },
  whatsappBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: BorderRadius.full,
    backgroundColor: '#25D366',
    ...Shadows.sm,
  },
  whatsappBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  callBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  expandBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  historyContainer: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    gap: 6,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  historyTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  historyCountBadge: {
    fontSize: 11,
    fontWeight: '600',
  },
  noTxBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: 4,
  },
  noTxText: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 8,
  },
  txIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txDetails: {
    flex: 1,
    minWidth: 0,
  },
  txTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  txTypeLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  txBillBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: BorderRadius.sm,
  },
  txBillBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  txDate: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '500',
  },
  txAmountBlock: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  /* WhatsApp Language Action Sheet */
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetContainer: {
    width: '100%',
    maxWidth: 500,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? 34 : Spacing.lg,
    ...Shadows.lg,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  sheetHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  sheetIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#25D366',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  sheetTitleBlock: {
    marginLeft: Spacing.sm,
    flex: 1,
    minWidth: 0,
  },
  sheetTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  sheetSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  sheetCloseBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
  sheetInstruction: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  sheetOptions: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sheetOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.md,
  },
  sheetOptionBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagEmoji: {
    fontSize: 24,
  },
  sheetOptionTextCol: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  sheetOptionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sheetOptionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  tagUrdu: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BorderRadius.sm,
  },
  tagUrduText: {
    color: '#15803D',
    fontSize: 10,
    fontWeight: '700',
  },
  tagEnglish: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BorderRadius.sm,
  },
  tagEnglishText: {
    color: '#4338CA',
    fontSize: 10,
    fontWeight: '700',
  },
  sheetOptionPreview: {
    fontSize: 11,
  },
  sheetOptionSendIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetCancelBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  sheetCancelText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
