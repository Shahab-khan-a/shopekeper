import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';
import { CartItem } from '@/types';
import { formatCompactPrice } from '@/utils/formatters';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export interface HeldCart {
  id: string;
  heldAt: number;
  items: CartItem[];
  customerName?: string;
  customerPhone?: string;
  discount?: string;
  discountType?: 'fixed' | 'percent';
  total: number;
  totalItemsCount: number;
}

export interface HeldCartsModalProps {
  visible: boolean;
  onClose: () => void;
  heldCarts: HeldCart[];
  onResumeCart: (cart: HeldCart) => void;
  onDeleteHeldCart: (cartId: string) => void;
  onClearAllHeldCarts: () => void;
}

function formatTimeAgo(timestamp: number, language: string): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) {
    return language === 'ur' ? 'ابھی' : 'Just now';
  }
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return language === 'ur' ? `${diffMin} منٹ پہلے` : `${diffMin}m ago`;
  }
  const diffHr = Math.floor(diffMin / 60);
  return language === 'ur' ? `${diffHr} گھنٹے پہلے` : `${diffHr}h ago`;
}

export const HeldCartsModal: React.FC<HeldCartsModalProps> = ({
  visible,
  onClose,
  heldCarts,
  onResumeCart,
  onDeleteHeldCart,
  onClearAllHeldCarts,
}) => {
  const { settings, language, t, showAlert } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const handleClearAllConfirm = () => {
    showAlert({
      type: 'warning',
      title: language === 'ur' ? 'تمام پارک شدہ بل ختم کریں' : 'Clear All Parked Bills',
      message: language === 'ur'
        ? 'کیا آپ واقعی تمام پارک شدہ بل خارج کرنا چاہتے ہیں؟'
        : 'Are you sure you want to discard all held carts?',
      buttons: [
        {
          text: language === 'ur' ? 'سب خارج کریں' : 'Discard All',
          style: 'destructive',
          icon: 'trash-outline',
          onPress: onClearAllHeldCarts,
        },
        { text: t('cancel'), style: 'cancel' },
      ],
    });
  };

  const handleDeleteSingleConfirm = (cart: HeldCart) => {
    showAlert({
      type: 'warning',
      title: language === 'ur' ? 'پارک شدہ بل خارج کریں' : 'Discard Parked Bill',
      message: language === 'ur'
        ? `کیا آپ یہ بل خارج کرنا چاہتے ہیں؟ (${settings.currencySymbol}${formatCompactPrice(cart.total)})`
        : `Discard this parked cart (${settings.currencySymbol}${formatCompactPrice(cart.total)})?`,
      buttons: [
        {
          text: language === 'ur' ? 'خارج کریں' : 'Discard',
          style: 'destructive',
          icon: 'trash-outline',
          onPress: () => onDeleteHeldCart(cart.id),
        },
        { text: t('cancel'), style: 'cancel' },
      ],
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />

        <View
          style={[
            styles.modalSheet,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}>
          {/* Sheet Handle */}
          <View style={[styles.sheetHandle, { backgroundColor: theme.border }]} />

          {/* Header */}
          <View style={[styles.headerRow, { borderBottomColor: theme.border }]}>
            <View style={styles.headerTitleWrap}>
              <View style={[styles.iconBox, { backgroundColor: theme.primaryLight }]}>
                <Ionicons name="pause-circle" size={20} color={theme.primary} />
              </View>
              <View>
                <Text style={[styles.title, { color: theme.text }]}>
                  {language === 'ur' ? 'پارک شدہ بلز' : 'Parked / Held Bills'} ({heldCarts.length})
                </Text>
                <Text style={[styles.subtitle, { color: theme.textMuted }]}>
                  {language === 'ur'
                    ? 'رش کے وقت روکے گئے بلز کو 1-ٹیپ میں بحال کریں'
                    : 'Resume rush-hour customer bills in 1 tap'}
                </Text>
              </View>
            </View>

            <View style={styles.headerActions}>
              {heldCarts.length > 0 && (
                <Pressable
                  onPress={handleClearAllConfirm}
                  style={[styles.clearAllBtn, { backgroundColor: theme.dangerLight }]}>
                  <Text style={[styles.clearAllText, { color: theme.danger }]}>
                    {language === 'ur' ? 'سب خارج' : 'Clear All'}
                  </Text>
                </Pressable>
              )}
              <Pressable
                onPress={onClose}
                style={[styles.closeBtn, { backgroundColor: theme.surfaceSubtle }]}>
                <Ionicons name="close" size={20} color={theme.textSecondary} />
              </Pressable>
            </View>
          </View>

          {/* Content */}
          {heldCarts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={[styles.emptyIconBox, { backgroundColor: theme.surfaceSubtle }]}>
                <Ionicons name="cart-outline" size={44} color={theme.textMuted} />
              </View>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                {language === 'ur' ? 'کوئی پارک شدہ بل نہیں ہے' : 'No Parked Bills'}
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                {language === 'ur'
                  ? 'رش کے وقت جب کوئی گاہک کچھ لانے جائے تو "پارک کارٹ" کا بٹن دبائیں تاکہ اگلا گاہک فارغ ہو سکے۔'
                  : 'During peak hours, tap "Hold Cart" when a customer steps away so you can serve the next person immediately.'}
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.cartList}
              contentContainerStyle={styles.cartListContent}
              showsVerticalScrollIndicator={false}>
              {heldCarts.map((cart, index) => {
                const itemsSummary = cart.items
                  .slice(0, 3)
                  .map((it) => {
                    const name = language === 'ur' && it.product.nameUrdu ? it.product.nameUrdu : it.product.name;
                    return `${name} × ${it.quantity}`;
                  })
                  .join(', ');
                const hasMore = cart.items.length > 3;

                return (
                  <View
                    key={cart.id}
                    style={[
                      styles.cartCard,
                      { backgroundColor: theme.card, borderColor: theme.border },
                    ]}>
                    {/* Top Row: Meta & Total */}
                    <View style={styles.cardHeaderRow}>
                      <View style={styles.cardHeaderLeft}>
                        <View style={[styles.parkBadge, { backgroundColor: theme.primaryLight }]}>
                          <Text style={[styles.parkBadgeText, { color: theme.primaryDark }]}>
                            #{index + 1}
                          </Text>
                        </View>
                        <View>
                          <Text style={[styles.customerName, { color: theme.text }]}>
                            {cart.customerName || (language === 'ur' ? `گاہک #${index + 1}` : `Customer #${index + 1}`)}
                          </Text>
                          <View style={styles.timeRow}>
                            <Ionicons name="time-outline" size={12} color={theme.textMuted} />
                            <Text style={[styles.timeText, { color: theme.textMuted }]}>
                              {formatTimeAgo(cart.heldAt, language)}
                            </Text>
                            {cart.customerPhone && (
                              <Text style={[styles.phoneText, { color: theme.textMuted }]}>
                                • {cart.customerPhone}
                              </Text>
                            )}
                          </View>
                        </View>
                      </View>

                      <View style={styles.cardHeaderRight}>
                        <Text style={[styles.cartTotal, { color: theme.primary }]}>
                          {settings.currencySymbol}{formatCompactPrice(cart.total)}
                        </Text>
                        <Text style={[styles.itemsCountText, { color: theme.textMuted }]}>
                          {cart.totalItemsCount} {language === 'ur' ? 'اشیاء' : 'items'}
                        </Text>
                      </View>
                    </View>

                    {/* Items Summary Snippet */}
                    <View style={[styles.itemsSnippetBox, { backgroundColor: theme.surfaceSubtle }]}>
                      <Text style={[styles.itemsSnippetText, { color: theme.textSecondary }]} numberOfLines={2}>
                        {itemsSummary}
                        {hasMore ? ` + ${cart.items.length - 3} ${language === 'ur' ? 'مزید' : 'more'}` : ''}
                      </Text>
                    </View>

                    {/* Actions Row */}
                    <View style={styles.cardActionsRow}>
                      <Pressable
                        onPress={() => handleDeleteSingleConfirm(cart)}
                        style={({ pressed }) => [
                          styles.deleteCartBtn,
                          { backgroundColor: theme.surfaceSubtle },
                          pressed && { opacity: 0.7 },
                        ]}>
                        <Ionicons name="trash-outline" size={16} color={theme.danger} />
                      </Pressable>

                      <Pressable
                        onPress={() => onResumeCart(cart)}
                        style={({ pressed }) => [
                          styles.resumeBtn,
                          { backgroundColor: theme.primary },
                          pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] },
                        ]}>
                        <Ionicons name="play" size={15} color="#FFFFFF" />
                        <Text style={styles.resumeBtnText}>
                          {language === 'ur' ? 'بل بحال کریں' : 'Resume Bill'}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalSheet: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    borderTopWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
    maxHeight: '85%',
    ...Shadows.lg,
  },
  sheetHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    marginBottom: Spacing.sm,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clearAllBtn: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
  },
  clearAllText: {
    fontSize: 11,
    fontWeight: '700',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
    gap: 10,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  cartList: {
    maxHeight: 440,
  },
  cartListContent: {
    gap: 10,
    paddingVertical: 4,
  },
  cartCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.sm,
    gap: 8,
    ...Shadows.sm,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  parkBadge: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  parkBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  customerName: {
    fontSize: 14,
    fontWeight: '700',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 1,
  },
  timeText: {
    fontSize: 11,
  },
  phoneText: {
    fontSize: 11,
  },
  cardHeaderRight: {
    alignItems: 'flex-end',
  },
  cartTotal: {
    fontSize: 16,
    fontWeight: '800',
  },
  itemsCountText: {
    fontSize: 11,
  },
  itemsSnippetBox: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
  },
  itemsSnippetText: {
    fontSize: 12,
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  deleteCartBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resumeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: BorderRadius.md,
    gap: 6,
    ...Shadows.sm,
  },
  resumeBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
