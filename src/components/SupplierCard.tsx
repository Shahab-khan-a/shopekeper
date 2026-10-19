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
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

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

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(148,163,184,0.3)',
        },
      ]}>
      {/* Top Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={[styles.avatar, { backgroundColor: isDarkMode ? '#1E293B' : '#EFF6FF' }]}>
            <Ionicons name="bus-outline" size={18} color={theme.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <Text style={[styles.supplierName, { color: theme.text }]} numberOfLines={1}>
                {supplier.name}
              </Text>
              {supplier.companyName ? (
                <View style={[styles.companyPill, { backgroundColor: theme.surfaceSubtle }]}>
                  <Text style={[styles.companyText, { color: theme.textSecondary }]}>
                    {supplier.companyName}
                  </Text>
                </View>
              ) : null}
            </View>

            {supplier.phone ? (
              <View style={styles.phoneRow}>
                <Ionicons name="call-outline" size={11} color={theme.textMuted} />
                <Text style={[styles.phoneText, { color: theme.textMuted }]}>
                  {supplier.phone}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* WhatsApp & Expand */}
        <View style={styles.headerRight}>
          {supplier.phone ? (
            <Pressable
              onPress={handleWhatsApp}
              hitSlop={8}
              style={[styles.iconBtn, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="logo-whatsapp" size={15} color="#16A34A" />
            </Pressable>
          ) : null}
          <Pressable
            onPress={onToggleExpand}
            hitSlop={8}
            style={[styles.iconBtn, { backgroundColor: theme.surfaceSubtle }]}>
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={15}
              color={theme.textSecondary}
            />
          </Pressable>
        </View>
      </View>

      {/* Balance Banner */}
      <View style={[styles.balanceBanner, { backgroundColor: theme.surfaceSubtle }]}>
        <View>
          <Text style={[styles.balanceLabel, { color: theme.textMuted }]}>
            {isPayable
              ? language === 'ur'
                ? 'واجب الادا (دینے ہیں)'
                : 'Payable Due'
              : isAdvance
              ? language === 'ur'
                ? 'پیشگی ادا شدہ (ایڈوانس)'
                : 'Advance Paid'
              : language === 'ur'
              ? 'کھاتہ اسٹیٹس'
              : 'Status'}
          </Text>
          <Text
            style={[
              styles.balanceValue,
              {
                color: isPayable
                  ? '#D97706' // amber-600
                  : isAdvance
                  ? theme.success
                  : theme.textSecondary,
              },
            ]}>
            {currencySymbol} {Math.abs(supplier.totalPayable).toLocaleString()}
          </Text>
        </View>

        <View style={styles.actionBtnsRow}>
          <Pressable
            onPress={() => onAddPurchase(supplier)}
            style={({ pressed }) => [
              styles.actionBtn,
              { backgroundColor: isDarkMode ? '#374151' : '#F1F5F9', borderColor: theme.border },
              pressed && { opacity: 0.8 },
            ]}>
            <Ionicons name="add-circle-outline" size={14} color={theme.text} />
            <Text style={[styles.actionBtnText, { color: theme.text }]}>
              {language === 'ur' ? '+ مال آیا' : '+ Purchase'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => onMakePayment(supplier)}
            style={({ pressed }) => [
              styles.actionBtn,
              { backgroundColor: theme.primary, borderColor: theme.primary },
              pressed && { opacity: 0.85 },
            ]}>
            <Ionicons name="cash-outline" size={14} color="#FFFFFF" />
            <Text style={[styles.actionBtnText, { color: '#FFFFFF', fontWeight: '800' }]}>
              {language === 'ur' ? '💵 ادائیگی' : '💵 Pay'}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Expanded Statement Ledger */}
      {isExpanded && (
        <View style={[styles.expandedArea, { borderTopColor: theme.border }]}>
          <View style={styles.expandedHeader}>
            <Text style={[styles.expandedTitle, { color: theme.textSecondary }]}>
              {language === 'ur' ? 'کھاتہ کی تفصیلات (ہسٹری)' : 'Ledger History'}
            </Text>
            <Pressable onPress={() => onDelete(supplier)} hitSlop={8}>
              <Text style={{ fontSize: 11, color: theme.danger, fontWeight: '600' }}>
                {language === 'ur' ? 'سپلائر حذف کریں' : 'Delete'}
              </Text>
            </Pressable>
          </View>

          {supplier.transactions && supplier.transactions.length > 0 ? (
            supplier.transactions.map((tx) => {
              const isPurchase = tx.type === 'purchase_credit';
              const dateStr = new Date(tx.date).toLocaleDateString(
                language === 'ur' ? 'ur-PK' : 'en-US',
                { month: 'short', day: 'numeric', year: 'numeric' }
              );
              return (
                <View
                  key={tx.id}
                  style={[
                    styles.txRow,
                    { borderBottomColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
                  ]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                    <View
                      style={[
                        styles.txIcon,
                        { backgroundColor: isPurchase ? '#FEF3C7' : '#DCFCE7' },
                      ]}>
                      <Ionicons
                        name={isPurchase ? 'cube' : 'checkmark'}
                        size={12}
                        color={isPurchase ? '#D97706' : '#16A34A'}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.txTypeText, { color: theme.text }]}>
                        {isPurchase
                          ? language === 'ur'
                            ? 'مال آیا (ادھار خریداری)'
                            : 'Stock Delivery'
                          : language === 'ur'
                          ? 'ادائیگی کی (کیش پیڈ)'
                          : 'Payment Made'}
                      </Text>
                      <Text style={[styles.txMeta, { color: theme.textMuted }]}>
                        {dateStr}
                        {tx.billNumber ? ` • بل #${tx.billNumber}` : ''}
                        {tx.note ? ` • ${tx.note}` : ''}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.txAmount,
                      { color: isPurchase ? '#D97706' : '#16A34A' },
                    ]}>
                    {isPurchase ? '+' : '-'}{currencySymbol}{tx.amount.toLocaleString()}
                  </Text>
                </View>
              );
            })
          ) : (
            <Text style={[styles.emptyTxText, { color: theme.textMuted }]}>
              {language === 'ur'
                ? 'ابھی کوئی سابقہ بل یا ادائیگی ریکارڈ نہیں ہے۔'
                : 'No delivery or payment history recorded yet.'}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: Spacing.md,
    gap: 12,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  supplierName: {
    fontSize: 14,
    fontWeight: '800',
  },
  companyPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  companyText: {
    fontSize: 10,
    fontWeight: '600',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  phoneText: {
    fontSize: 11,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 12,
  },
  balanceLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: '900',
    marginTop: 1,
  },
  actionBtnsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  expandedArea: {
    borderTopWidth: 1,
    paddingTop: 10,
    gap: 8,
  },
  expandedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  expandedTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  txIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txTypeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  txMeta: {
    fontSize: 10,
    marginTop: 1,
  },
  txAmount: {
    fontSize: 12,
    fontWeight: '800',
  },
  emptyTxText: {
    fontSize: 11,
    fontStyle: 'italic',
    paddingVertical: 6,
    textAlign: 'center',
  },
});
