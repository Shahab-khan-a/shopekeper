import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
  Platform,
  Linking,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Sale } from '@/types';
import { useShop } from '@/context/ShopContext';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

interface ReceiptModalProps {
  sale: Sale | null;
  visible: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ sale, visible, onClose }) => {
  const { settings, language, t } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  if (!sale) return null;

  const formattedDate = new Date(sale.date).toLocaleString(
    language === 'ur' ? 'ur-PK' : 'en-US',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    }
  );

  // Generate HTML for thermal printing
  const generateReceiptHTML = () => {
    const itemsRows = sale.items
      .map(
        (it) => `
        <tr>
          <td style="padding: 4px 0; border-bottom: 1px dashed #ddd;">
            <div style="font-weight: bold; font-size: 13px;">${it.product.nameUrdu ? it.product.nameUrdu + ' / ' + it.product.name : it.product.name}</div>
            <div style="font-size: 11px; color: #555;">${it.quantity} ${it.product.unit} @ Rs. ${it.unitPrice}</div>
          </td>
          <td style="text-align: right; font-weight: bold; padding: 4px 0; border-bottom: 1px dashed #ddd;">
            Rs. ${it.total}
          </td>
        </tr>
      `
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Nastaliq Urdu', sans-serif;
              margin: 0;
              padding: 16px;
              color: #000;
              background: #fff;
              max-width: 320px;
              margin: 0 auto;
            }
            .center { text-align: center; }
            .shop-name { font-size: 20px; font-weight: 800; margin-bottom: 2px; }
            .shop-urdu { font-size: 16px; font-weight: bold; margin-bottom: 4px; }
            .shop-meta { font-size: 11px; color: #333; margin-bottom: 2px; }
            .divider { border-top: 1px dashed #000; margin: 8px 0; }
            .double-divider { border-top: 2px double #000; margin: 8px 0; }
            .info-row { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 3px; }
            table { width: 100%; border-collapse: collapse; margin-top: 6px; }
            .total-row { display: flex; justify-content: space-between; font-size: 15px; font-weight: 800; margin-top: 4px; }
            .footer-text { font-size: 11px; color: #444; margin-top: 12px; }
            @media print {
              body { max-width: 100%; padding: 4px; }
            }
          </style>
        </head>
        <body>
          <div class="center">
            ${settings.profileImage ? `<img src="${settings.profileImage}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; margin-bottom: 6px;" />` : ''}
            <div class="shop-name">${settings.shopName}</div>
            <div class="shop-urdu">${settings.shopNameUrdu}</div>
            ${settings.ownerName ? `<div class="shop-meta" style="font-weight: 600;">Prop: ${settings.ownerName}</div>` : ''}
            <div class="shop-meta">${settings.address}</div>
            <div class="shop-meta">Phone: ${settings.phone}${settings.alternatePhone ? ` / ${settings.alternatePhone}` : ''}</div>
            ${settings.taxNumber ? `<div class="shop-meta">NTN/Tax #: ${settings.taxNumber}</div>` : ''}
            ${settings.email ? `<div class="shop-meta">${settings.email}</div>` : ''}
          </div>

          <div class="divider"></div>

          <div class="info-row">
            <span><strong>Bill #:</strong> ${sale.billNumber}</span>
            <span>${formattedDate}</span>
          </div>

          ${
            sale.customerName
              ? `<div class="info-row"><span><strong>Customer:</strong> ${sale.customerName}</span><span>${sale.customerPhone || ''}</span></div>`
              : ''
          }
          <div class="info-row">
            <span><strong>Payment:</strong> ${sale.paymentMethod.toUpperCase()}</span>
          </div>

          <div class="divider"></div>

          <table>
            <thead>
              <tr style="text-align: left; font-size: 11px; text-transform: uppercase;">
                <th style="padding-bottom: 4px;">Item / Rate</th>
                <th style="text-align: right; padding-bottom: 4px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <div class="divider"></div>

          <div class="info-row">
            <span>Subtotal:</span>
            <span>Rs. ${sale.subtotal}</span>
          </div>

          ${
            sale.discount > 0
              ? `<div class="info-row" style="color: #dc2626;"><span>Discount:</span><span>- Rs. ${sale.discount}</span></div>`
              : ''
          }

          <div class="double-divider"></div>

          <div class="total-row">
            <span>GRAND TOTAL:</span>
            <span>Rs. ${sale.grandTotal}</span>
          </div>

          <div class="divider"></div>

          ${settings.paymentDetails ? `
            <div class="center" style="font-size: 10px; font-weight: bold; background: #f1f5f9; padding: 6px; border-radius: 4px; border: 1px solid #cbd5e1; margin-bottom: 8px;">
              💳 Online Payments (EasyPaisa/JazzCash/Bank):<br/>
              <span style="font-weight: 800; color: #0f172a;">${settings.paymentDetails}</span>
            </div>
          ` : ''}

          <div class="center footer-text">
            <div>${settings.footerNoteUrdu}</div>
            <div>${settings.footerNote}</div>
            <div style="font-size: 9px; margin-top: 6px; color: #777;">Powered by Dukandar App</div>
          </div>
        </body>
      </html>
    `;
  };

  // Handle thermal print
  const handlePrint = async () => {
    try {
      const html = generateReceiptHTML();
      if (Platform.OS === 'web') {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(html);
          printWindow.document.close();
          printWindow.focus();
          setTimeout(() => {
            printWindow.print();
          }, 300);
        }
      } else {
        await Print.printAsync({ html });
      }
    } catch (e) {
      console.warn('Print error:', e);
    }
  };

  // Handle PDF Export / Sharing
  const handleDownloadPDF = async () => {
    try {
      const html = generateReceiptHTML();
      if (Platform.OS === 'web') {
        handlePrint();
      } else {
        const { uri } = await Print.printToFileAsync({ html });
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
        } else {
          Alert.alert(t('billReceipt'), `Receipt PDF saved: ${uri}`);
        }
      }
    } catch (e) {
      console.warn('PDF export error:', e);
    }
  };

  // Pre-formatted WhatsApp Receipt Message
  const handleShareWhatsApp = () => {
    const shopHeader = settings.shopNameUrdu
      ? `*${settings.shopNameUrdu}*\n*${settings.shopName}*`
      : `*${settings.shopName}*`;

    let itemsList = '';
    sale.items.forEach((it, idx) => {
      const pName = it.product.nameUrdu || it.product.name;
      itemsList += `${idx + 1}. ${pName} (${it.quantity} ${it.product.unit} × ${settings.currencySymbol}${it.unitPrice}) = ${settings.currencySymbol}${it.total}\n`;
    });

    const paymentText =
      sale.paymentMethod === 'cash'
        ? 'نقد (Cash)'
        : sale.paymentMethod === 'online'
        ? 'آن لائن (Online)'
        : 'ادھار (Udhaar / Credit)';

    const message = `
🧾 ${shopHeader}
${settings.ownerName ? `👤 *Prop:* ${settings.ownerName}\n` : ''}📍 ${settings.address}
📞 ${settings.phone}${settings.alternatePhone ? ` / ${settings.alternatePhone}` : ''}
${settings.taxNumber ? `🏷️ *NTN/Tax #:* ${settings.taxNumber}\n` : ''}---------------------------------
📄 *بل نمبر (Bill #):* ${sale.billNumber}
📅 *تاریخ (Date):* ${formattedDate}
${sale.customerName ? `👤 *گاہک (Customer):* ${sale.customerName}\n` : ''}---------------------------------
*خریداری کی تفصیل (Items):*
${itemsList}---------------------------------
سب ٹوٹل (Subtotal): ${settings.currencySymbol}${sale.subtotal}
${sale.discount > 0 ? `ڈسکاؤنٹ (Discount): -${settings.currencySymbol}${sale.discount}\n` : ''}*کل رقم (Grand Total): ${settings.currencySymbol}${sale.grandTotal}*
ادائیگی کا طریقہ (Payment): ${paymentText}
${settings.paymentDetails ? `💳 *آن لائن ادائیگی (Account):* ${settings.paymentDetails}\n` : ''}---------------------------------
${settings.footerNoteUrdu}
${settings.footerNote}
    `.trim();

    const encoded = encodeURIComponent(message);
    const cleanPhone = sale.customerPhone?.replace(/[^0-9]/g, '');

    const url = cleanPhone
      ? `https://wa.me/${cleanPhone.startsWith('92') ? cleanPhone : '92' + cleanPhone.replace(/^0/, '')}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;

    Linking.openURL(url).catch(() => {
      if (Platform.OS === 'web') {
        window.open(url, '_blank');
      } else {
        Alert.alert(t('error'), 'Could not open WhatsApp.');
      }
    });
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.receiptCard, { backgroundColor: theme.surface }]}>
          {/* Header Close */}
          <View style={[styles.modalTopBar, { borderBottomColor: theme.border }]}>
            <View style={styles.topBadge}>
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
              <Text style={styles.topBadgeText}>{t('saleCompleted')}</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={theme.textSecondary} />
            </Pressable>
          </View>

          {/* Thermal Paper View */}
          <ScrollView style={styles.receiptScroll} contentContainerStyle={styles.receiptPaper}>
            <View style={styles.paperInner}>
              {settings.profileImage ? (
                <Image source={{ uri: settings.profileImage }} style={styles.paperLogo} />
              ) : null}
              <Text style={styles.paperShopTitle}>{settings.shopName}</Text>
              <Text style={styles.paperShopUrdu}>{settings.shopNameUrdu}</Text>
              {settings.ownerName ? (
                <Text style={[styles.paperMeta, { fontWeight: '700' }]}>👤 Prop: {settings.ownerName}</Text>
              ) : null}
              <Text style={styles.paperMeta}>{settings.address}</Text>
              <Text style={styles.paperMeta}>
                📞 {settings.phone}{settings.alternatePhone ? ` / ${settings.alternatePhone}` : ''}
              </Text>
              {settings.taxNumber ? (
                <Text style={styles.paperMeta}>🏷️ NTN/Tax #: {settings.taxNumber}</Text>
              ) : null}

              <View style={styles.dashedDivider} />

              <View style={styles.billMetaRow}>
                <Text style={styles.billMetaText}>
                  <Text style={styles.boldText}>{t('billNo')}: </Text>{sale.billNumber}
                </Text>
                <Text style={styles.billMetaText}>{formattedDate}</Text>
              </View>

              {sale.customerName ? (
                <View style={styles.billMetaRow}>
                  <Text style={styles.billMetaText}>
                    <Text style={styles.boldText}>Customer: </Text>{sale.customerName}
                  </Text>
                  <Text style={styles.billMetaText}>{sale.customerPhone || ''}</Text>
                </View>
              ) : null}

              <View style={styles.billMetaRow}>
                <Text style={styles.billMetaText}>
                  <Text style={styles.boldText}>Payment: </Text>{sale.paymentMethod.toUpperCase()}
                </Text>
              </View>

              <View style={styles.dashedDivider} />

              {/* Items Table */}
              <View style={styles.tableHead}>
                <Text style={[styles.tableHeadCol, { flex: 2 }]}>{t('item')}</Text>
                <Text style={[styles.tableHeadCol, { flex: 1, textAlign: 'center' }]}>{t('qty')}</Text>
                <Text style={[styles.tableHeadCol, { flex: 1, textAlign: 'right' }]}>{t('total')}</Text>
              </View>

              {sale.items.map((it, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <View style={{ flex: 2 }}>
                    <Text style={styles.itemName}>
                      {language === 'ur' && it.product.nameUrdu ? it.product.nameUrdu : it.product.name}
                    </Text>
                    <Text style={styles.itemRate}>
                      {settings.currencySymbol}{it.unitPrice} / {it.product.unit}
                    </Text>
                  </View>
                  <Text style={[styles.itemQty, { flex: 1, textAlign: 'center' }]}>
                    {it.quantity} {it.product.unit}
                  </Text>
                  <Text style={[styles.itemTotal, { flex: 1, textAlign: 'right' }]}>
                    {settings.currencySymbol}{it.total}
                  </Text>
                </View>
              ))}

              <View style={styles.dashedDivider} />

              {/* Totals */}
              <View style={styles.calcRow}>
                <Text style={styles.calcLabel}>{t('subtotal')}:</Text>
                <Text style={styles.calcValue}>{settings.currencySymbol}{sale.subtotal}</Text>
              </View>

              {sale.discount > 0 && (
                <View style={styles.calcRow}>
                  <Text style={[styles.calcLabel, { color: '#DC2626' }]}>{t('discount')}:</Text>
                  <Text style={[styles.calcValue, { color: '#DC2626' }]}>
                    - {settings.currencySymbol}{sale.discount}
                  </Text>
                </View>
              )}

              <View style={styles.doubleLine} />

              <View style={styles.grandTotalRow}>
                <Text style={styles.grandTotalLabel}>{t('grandTotal')}:</Text>
                <Text style={styles.grandTotalValue}>
                  {settings.currencySymbol}{sale.grandTotal}
                </Text>
              </View>

              <View style={styles.dashedDivider} />

              {settings.paymentDetails ? (
                <View style={styles.paperPaymentBox}>
                  <Text style={styles.paperPaymentTitle}>💳 Digital Payments (EasyPaisa / JazzCash):</Text>
                  <Text style={styles.paperPaymentText}>{settings.paymentDetails}</Text>
                </View>
              ) : null}

              <Text style={styles.footerUrdu}>{settings.footerNoteUrdu}</Text>
              <Text style={styles.footerEng}>{settings.footerNote}</Text>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={[styles.actionButtonsWrap, { borderTopColor: theme.border }]}>
            {/* WhatsApp Share Button */}
            <Pressable
              onPress={handleShareWhatsApp}
              style={({ pressed }) => [
                styles.actionBtn,
                styles.whatsappBtn,
                pressed && { transform: [{ scale: 0.96 }] },
              ]}>
              <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />
              <Text style={styles.actionBtnTextWhite}>{t('shareWhatsApp')}</Text>
            </Pressable>

            {/* Print Thermal Button */}
            <Pressable
              onPress={handlePrint}
              style={({ pressed }) => [
                styles.actionBtn,
                { backgroundColor: theme.primary },
                pressed && { transform: [{ scale: 0.96 }] },
              ]}>
              <Ionicons name="print-outline" size={18} color="#FFFFFF" />
              <Text style={styles.actionBtnTextWhite}>{t('printBill')}</Text>
            </Pressable>

            {/* Close / Done Button */}
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.actionBtn,
                styles.doneBtn,
                { backgroundColor: theme.surfaceSubtle },
                pressed && { opacity: 0.7 },
              ]}>
              <Text style={[styles.doneBtnText, { color: theme.textSecondary }]}>{t('close')}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  receiptCard: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '92%',
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  modalTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  topBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  topBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10B981',
  },
  closeBtn: {
    padding: 4,
  },
  receiptScroll: {
    flex: 1,
  },
  receiptPaper: {
    padding: Spacing.lg,
  },
  paperInner: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.sm,
  },
  paperLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignSelf: 'center',
    marginBottom: 6,
  },
  paperShopTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    color: '#0F172A',
  },
  paperShopUrdu: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    color: '#059669',
    marginTop: 2,
  },
  paperMeta: {
    fontSize: 11,
    textAlign: 'center',
    color: '#64748B',
    marginTop: 2,
  },
  paperPaymentBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: BorderRadius.md,
    padding: 8,
    marginVertical: 6,
    alignItems: 'center',
  },
  paperPaymentTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 2,
  },
  paperPaymentText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  dashedDivider: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    marginVertical: 10,
  },
  doubleLine: {
    borderBottomWidth: 2,
    borderColor: '#0F172A',
    marginVertical: 6,
  },
  billMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  billMetaText: {
    fontSize: 11,
    color: '#334155',
  },
  tableHead: {
    flexDirection: 'row',
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 6,
  },
  tableHeadCol: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  itemName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  itemRate: {
    fontSize: 10,
    color: '#64748B',
  },
  itemQty: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },
  itemTotal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  calcLabel: {
    fontSize: 12,
    color: '#475569',
  },
  calcValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#059669',
  },
  footerUrdu: {
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '700',
    color: '#059669',
    marginTop: 4,
  },
  footerEng: {
    fontSize: 11,
    textAlign: 'center',
    color: '#64748B',
    marginTop: 2,
  },
  actionButtonsWrap: {
    padding: Spacing.md,
    gap: Spacing.sm,
    borderTopWidth: 1,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
  },
  whatsappBtn: {
    backgroundColor: '#25D366',
  },
  doneBtn: {},
  actionBtnTextWhite: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  doneBtnText: {
    fontWeight: '700',
    fontSize: 14,
  },
  boldText: {
    fontWeight: '700',
  },
});
