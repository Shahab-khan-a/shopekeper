import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Sale } from '@/types';
import { useShop } from '@/context/ShopContext';
import { Colors, Shadows } from '@/constants/theme';
import { formatCompactPrice } from '@/utils/formatters';

export const SALES_SEEN_AT_KEY = '@shopkeeper_sales_seen_at';

interface SalesNotificationsModalProps {
  visible: boolean;
  onClose: () => void;
  onViewAllBills: () => void;
}

const saleTimestamp = (sale: Sale) => sale.createdAt || Date.parse(sale.date) || 0;

const formatSaleTime = (sale: Sale) => {
  const d = new Date(saleTimestamp(sale) || sale.date);
  if (Number.isNaN(d.getTime())) return '';
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (sameDay) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const paymentLabel = (sale: Sale, isUrdu: boolean) => {
  if (sale.paymentMethod === 'udhaar' && (sale.amountPaid || 0) > 0) {
    return isUrdu ? 'نقد + ادھار' : 'Split';
  }
  if (sale.paymentMethod === 'cash') return isUrdu ? 'نقد' : 'Cash';
  if (sale.paymentMethod === 'online') return isUrdu ? 'آن لائن' : 'Online';
  return isUrdu ? 'ادھار' : 'Udhaar';
};

export const SalesNotificationsModal: React.FC<SalesNotificationsModalProps> = ({
  visible,
  onClose,
  onViewAllBills,
}) => {
  const {
    sales,
    settings,
    language,
    setActiveReceipt,
    lowStockProducts,
    outOfStockProducts,
    setActiveTab,
  } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const isUrdu = language === 'ur';
  const softBorder = settings.darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(148,163,184,0.22)';
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const panelWidth = Math.min(268, Math.max(220, windowWidth * 0.72));
  const panelMaxHeight = Math.min(windowHeight * 0.62, 440);

  const recentSales = useMemo(() => {
    return [...sales]
      .filter((s) => s.status !== 'cancelled')
      .sort((a, b) => saleTimestamp(b) - saleTimestamp(a))
      .slice(0, 8);
  }, [sales]);

  useEffect(() => {
    if (!visible) return;
    AsyncStorage.setItem(SALES_SEEN_AT_KEY, String(Date.now())).catch(() => {});
  }, [visible]);

  const stockAlertCount = lowStockProducts.length + outOfStockProducts.length;

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View
          pointerEvents="box-none"
          style={[
            styles.panelAnchor,
            {
              top: insets.top + (Platform.OS === 'ios' ? 52 : 48),
              right: Math.max(insets.right, 10),
              maxHeight: panelMaxHeight,
            },
          ]}>
          <View
            style={[
              styles.panel,
              {
                width: panelWidth,
                backgroundColor: theme.surface,
                borderColor: softBorder,
                maxHeight: panelMaxHeight,
              },
            ]}>
            <View style={[styles.sheetHeader, { borderBottomColor: softBorder }]}>
              <Text style={[styles.sheetTitle, { color: theme.text }]} numberOfLines={1}>
                {isUrdu ? 'سیل' : 'Sales'}
              </Text>
              <Pressable
                onPress={onClose}
                style={styles.closeBtn}
                hitSlop={8}
                accessibilityLabel="Close notifications">
                <Ionicons name="close" size={16} color={theme.textMuted} />
              </Pressable>
            </View>

            <ScrollView
              style={styles.listScroll}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              bounces={false}>
              {recentSales.length === 0 ? (
                <View style={styles.emptyWrap}>
                  <Ionicons name="receipt-outline" size={22} color={theme.textMuted} />
                  <Text style={[styles.emptyTitle, { color: theme.text }]}>
                    {isUrdu ? 'کوئی سیل نہیں' : 'No sales yet'}
                  </Text>
                </View>
              ) : (
                recentSales.map((sale) => {
                  const isRefunded = sale.status === 'refunded';
                  return (
                    <Pressable
                      key={sale.id}
                      onPress={() => {
                        setActiveReceipt(sale);
                        onClose();
                      }}
                      style={({ pressed }) => [
                        styles.saleRow,
                        {
                          backgroundColor: theme.surfaceSubtle,
                          borderColor: softBorder,
                        },
                        pressed && { opacity: 0.85 },
                      ]}>
                      <View style={styles.saleTop}>
                        <Text style={[styles.saleBill, { color: theme.text }]} numberOfLines={1}>
                          {sale.billNumber || sale.invoiceNumber || 'Bill'}
                        </Text>
                        <Text
                          style={[
                            styles.saleAmount,
                            { color: isRefunded ? theme.danger : theme.primary },
                          ]}>
                          {settings.currencySymbol}
                          {formatCompactPrice(sale.grandTotal ?? sale.total ?? 0)}
                        </Text>
                      </View>
                      <Text style={[styles.saleMeta, { color: theme.textMuted }]} numberOfLines={1}>
                        {formatSaleTime(sale)} · {paymentLabel(sale, isUrdu)}
                        {isRefunded ? (isUrdu ? ' · واپس' : ' · Ref') : ''}
                      </Text>
                    </Pressable>
                  );
                })
              )}

              {stockAlertCount > 0 && (
                <Pressable
                  onPress={() => {
                    onClose();
                    setActiveTab('products');
                  }}
                  style={({ pressed }) => [
                    styles.stockAlertRow,
                    {
                      backgroundColor: theme.warningLight,
                      borderColor: settings.darkMode ? '#78350F' : '#FCD34D',
                    },
                    pressed && { opacity: 0.88 },
                  ]}>
                  <Ionicons name="warning" size={13} color={theme.warning} />
                  <Text style={[styles.stockAlertText, { color: theme.text }]} numberOfLines={2}>
                    {isUrdu
                      ? `${stockAlertCount} کم اسٹاک`
                      : `${stockAlertCount} low stock`}
                  </Text>
                </Pressable>
              )}
            </ScrollView>

            <View style={[styles.footer, { borderTopColor: softBorder }]}>
              <Pressable
                onPress={onViewAllBills}
                style={({ pressed }) => [
                  styles.viewAllBtn,
                  { backgroundColor: theme.primary },
                  pressed && { opacity: 0.9 },
                ]}>
                <Text style={styles.viewAllBtnText}>
                  {isUrdu ? 'تمام بل' : 'View all bills'}
                </Text>
                <Ionicons name="chevron-forward" size={14} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.28)',
  },
  panelAnchor: {
    position: 'absolute',
    zIndex: 2,
  },
  panel: {
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sheetTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: -0.2,
    flex: 1,
  },
  closeBtn: {
    padding: 3,
  },
  listScroll: {
    flexGrow: 0,
  },
  listContent: {
    padding: 8,
    gap: 6,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 22,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  saleRow: {
    paddingHorizontal: 9,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    gap: 2,
  },
  saleTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  saleBill: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
  },
  saleMeta: {
    fontSize: 10,
    fontWeight: '500',
  },
  saleAmount: {
    fontSize: 12,
    fontWeight: '800',
  },
  stockAlertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
    paddingHorizontal: 9,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  stockAlertText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
  },
  footer: {
    padding: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 34,
    borderRadius: 10,
  },
  viewAllBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
