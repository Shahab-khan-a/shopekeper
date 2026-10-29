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
import { SupplierKhata } from '@/types';
import { Colors, Shadows } from '@/constants/theme';

interface SupplierCardProps {
  supplier: SupplierKhata;
  currencySymbol: string;
  language: 'en' | 'ur';
  isDarkMode: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onAddPurchase: (supplier: SupplierKhata) => void;
  onMakePayment: (supplier: SupplierKhata) => void;
  onDelete: (supplier: SupplierKhata) => void;
}

export const SupplierCard: React.FC<SupplierCardProps> = ({
  supplier,
  currencySymbol,
  language,
  isDarkMode,
  isExpanded,
  onToggleExpand,
  onAddPurchase,
  onMakePayment,
  onDelete,
}) => {
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const handleWhatsApp = () => {
    if (!supplier.phone) return;
    const clean = supplier.phone.replace(/[^0-9]/g, '');
    const isUrdu = language === 'ur';
    const amountText = `${currencySymbol} ${Math.abs(supplier.totalPayable).toLocaleString()}`;
    const message = isUrdu
      ? `محترم ${supplier.name}!\nآپ کے کھاتے کا اسٹیٹس: واجب الادا رقم ${amountText} ہے۔`
      : `Dear ${supplier.name},\nKhata status update: Pending balance ${amountText}.`;
    const encoded = encodeURIComponent(message);
    const url = clean
      ? `https://wa.me/${clean.startsWith('92') ? clean : '92' + clean.replace(/^0/, '')}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;
    Linking.openURL(url).catch(() => {
      if (Platform.OS === 'web') window.open(url, '_blank');
    });
  };

  const isPayable = supplier.totalPayable > 0;
  const isAdvance = supplier.totalPayable < 0;
  const isSettled = supplier.totalPayable === 0;
  const isUrdu = language === 'ur';

  const softBorder = isDarkMode
    ? 'rgba(255,255,255,0.07)'
    : 'rgba(148, 163, 184, 0.22)';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: softBorder,
        },
      ]}>
      {/* ── Main Tap Area: Supplier Info & Balance ── */}
      <Pressable
        onPress={onToggleExpand}
        style={styles.cardHeaderArea}
        accessibilityRole="button"
        accessibilityLabel={`${supplier.name}, payable ${supplier.totalPayable}`}>
        {/* Soft squircle Avatar */}
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: isDarkMode ? 'rgba(245, 158, 11, 0.16)' : '#FEF3C7',
            },
          ]}>
          <Ionicons
            name="cube"
            size={20}
            color={isDarkMode ? '#FBBF24' : '#D97706'}
          />
        </View>

        {/* Center: Supplier Name & Company */}
        <View style={styles.nameBlock}>
          <View style={styles.nameRow}>
            <Text style={[styles.supplierName, { color: theme.text }]} numberOfLines={1}>
              {supplier.name}
            </Text>
            {supplier.companyName ? (
              <View
                style={[
                  styles.companyPill,
                  {
                    backgroundColor: isDarkMode
                      ? 'rgba(255, 255, 255, 0.08)'
                      : '#F1F5F9',
                  },
                ]}>
                <Text style={[styles.companyText, { color: theme.textSecondary }]}>
                  {supplier.companyName}
                </Text>
              </View>
            ) : null}
          </View>

          <Text style={[styles.metaLine, { color: theme.textMuted }]} numberOfLines={1}>
            {supplier.phone || (isUrdu ? 'ہول سیل سپلائر' : 'Wholesale Supplier')}
          </Text>
        </View>

        {/* Right: Payable Balance & Capsule */}
        <View style={styles.balanceBlock}>
          <Text
            style={[
              styles.balanceAmount,
              {
                color: isPayable
                  ? '#D97706'
                  : isAdvance
                    ? theme.success
                    : theme.textMuted,
              },
            ]}>
            {currencySymbol}
            {Math.abs(supplier.totalPayable).toLocaleString()}
          </Text>

          <View
            style={[
              styles.capsulePill,
              {
                backgroundColor: isPayable
                  ? isDarkMode
                    ? 'rgba(245, 158, 11, 0.16)'
                    : '#FEF3C7'
                  : isAdvance
                    ? isDarkMode
                      ? 'rgba(16, 185, 129, 0.16)'
                      : '#DCFCE7'
                    : isDarkMode
                      ? 'rgba(255, 255, 255, 0.06)'
                      : '#F1F5F9',
              },
            ]}>
            <Text
              style={[
                styles.capsulePillText,
                {
                  color: isPayable
                    ? '#D97706'
                    : isAdvance
                      ? theme.success
                      : theme.textSecondary,
                },
              ]}>
              {isPayable
                ? isUrdu
                  ? 'دینے ہیں'
                  : 'Payable'
                : isAdvance
                  ? isUrdu
                    ? 'ایڈوانس'
                    : 'Advance'
                  : isUrdu
                    ? 'برابر ✓'
                    : 'Cleared ✓'}
            </Text>
          </View>
        </View>
      </Pressable>

      {/* ── Soft Clean Actions Row (Pay + WhatsApp + Expand) ── */}
      <View style={styles.actionsRow}>
        {/* Payment Button */}
        <Pressable
          onPress={() => onMakePayment(supplier)}
          style={({ pressed }) => [
            styles.primaryPillBtn,
            { backgroundColor: '#059669' },
            pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
          ]}>
          <Ionicons name="cash" size={16} color="#FFFFFF" />
          <Text style={styles.primaryPillText}>
            {isUrdu ? 'ادائیگی کریں' : 'Make Payment'}
          </Text>
        </Pressable>

        {/* WhatsApp */}
        {supplier.phone ? (
          <Pressable
            onPress={handleWhatsApp}
            hitSlop={6}
            style={({ pressed }) => [
              styles.whatsappPillBtn,
              {
                backgroundColor: isDarkMode ? '#064E3B' : '#DCFCE7',
                borderColor: isDarkMode ? '#059669' : '#86EFAC',
              },
              pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
            ]}>
            <Ionicons
              name="logo-whatsapp"
              size={18}
              color={isDarkMode ? '#34D399' : '#15803D'}
            />
          </Pressable>
        ) : null}

        {/* Toggle Expand */}
        <Pressable
          onPress={onToggleExpand}
          hitSlop={6}
          style={({ pressed }) => [
            styles.expandToggleBtn,
            {
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.06)' : '#F8FAFC',
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
      </View>

      {/* ── Expanded Tray: Add Purchase & Transactions Ledger ── */}
      {isExpanded && (
        <View
          style={[
            styles.expandedContainer,
            {
              borderTopColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
            },
          ]}>
          {/* Secondary Actions */}
          <View style={styles.secondaryActionsRow}>
            <Pressable
              onPress={() => onAddPurchase(supplier)}
              style={({ pressed }) => [
                styles.secondaryPillBtn,
                {
                  backgroundColor: isDarkMode ? 'rgba(245, 158, 11, 0.12)' : '#FEF3C7',
                  borderColor: isDarkMode ? 'rgba(245, 158, 11, 0.25)' : '#FDE68A',
                },
                pressed && { opacity: 0.85 },
              ]}>
              <Ionicons name="add-circle" size={14} color="#D97706" />
              <Text style={[styles.secondaryPillText, { color: '#D97706' }]}>
                {isUrdu ? '+ مال آیا (نیا بل)' : '+ New Delivery / Bill'}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => onDelete(supplier)}
              style={({ pressed }) => [
                styles.secondaryPillBtn,
                {
                  backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : '#FEE2E2',
                  borderColor: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : '#FECACA',
                },
                pressed && { opacity: 0.85 },
              ]}>
              <Ionicons name="trash-outline" size={13} color={theme.danger} />
              <Text style={[styles.secondaryPillText, { color: theme.danger }]}>
                {isUrdu ? 'حذف کریں' : 'Delete'}
              </Text>
            </Pressable>
          </View>

          {/* Ledger History */}
          <View style={styles.historyList}>
            <Text style={[styles.historyHeader, { color: theme.textMuted }]}>
              {isUrdu ? 'کھاتہ کی تفصیلات (ہسٹری)' : 'Ledger History'} ({supplier.transactions?.length || 0})
            </Text>

            {supplier.transactions && supplier.transactions.length > 0 ? (
              supplier.transactions.slice(0, 6).map((tx) => {
                const isPurchase = tx.type === 'purchase_credit';
                const dateStr = new Date(tx.date).toLocaleDateString(
                  isUrdu ? 'ur-PK' : 'en-US',
                  { month: 'short', day: 'numeric', year: 'numeric' }
                );
                return (
                  <View
                    key={tx.id}
                    style={[
                      styles.txRow,
                      {
                        backgroundColor: isPurchase
                          ? isDarkMode
                            ? 'rgba(245, 158, 11, 0.08)'
                            : '#FFFBEB'
                          : isDarkMode
                            ? 'rgba(16, 185, 129, 0.08)'
                            : '#F0FDF4',
                      },
                    ]}>
                    <View style={styles.txLeft}>
                      <View
                        style={[
                          styles.txDot,
                          { backgroundColor: isPurchase ? '#D97706' : '#16A34A' },
                        ]}
                      />
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <Text
                          style={[
                            styles.txTitle,
                            { color: isPurchase ? '#D97706' : '#16A34A' },
                          ]}
                          numberOfLines={1}>
                          {isPurchase
                            ? isUrdu
                              ? 'مال آیا (ادھار خریداری)'
                              : 'Stock Delivery'
                            : isUrdu
                              ? 'ادائیگی کی (کیش پیڈ)'
                              : 'Payment Made'}
                          {tx.billNumber ? ` · #${tx.billNumber}` : ''}
                        </Text>
                        <Text style={[styles.txMeta, { color: theme.textMuted }]} numberOfLines={1}>
                          {dateStr}
                          {tx.note ? ` · ${tx.note}` : ''}
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={[
                        styles.txAmount,
                        { color: isPurchase ? '#D97706' : '#16A34A' },
                      ]}>
                      {isPurchase ? '+' : '−'}
                      {currencySymbol}
                      {tx.amount.toLocaleString()}
                    </Text>
                  </View>
                );
              })
            ) : (
              <Text style={[styles.noTxText, { color: theme.textMuted }]}>
                {isUrdu
                  ? 'ابھی کوئی سابقہ بل یا ادائیگی ریکارڈ نہیں ہے۔'
                  : 'No delivery or payment history recorded yet.'}
              </Text>
            )}
          </View>
        </View>
      )}
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
  supplierName: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  companyPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  companyText: {
    fontSize: 11,
    fontWeight: '600',
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

  // Actions
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 2,
  },
  primaryPillBtn: {
    flex: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  primaryPillText: {
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
