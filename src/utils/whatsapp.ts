import { Linking, Platform } from 'react-native';
import { Sale, ShopSettings } from '@/types';

/**
 * Standardize phone numbers to international Pakistani WhatsApp format (923XXXXXXXXX)
 */
export function formatPakistaniPhone(phone?: string): string {
  if (!phone) return '';
  const digits = phone.replace(/[^0-9]/g, '');
  if (!digits) return '';

  if (digits.startsWith('92')) {
    return digits;
  }
  if (digits.startsWith('0')) {
    return '92' + digits.slice(1);
  }
  if (digits.length === 10 && digits.startsWith('3')) {
    return '92' + digits;
  }
  return digits;
}

/**
 * Open WhatsApp with a pre-filled message
 */
export function openWhatsAppWithMessage(phone: string | undefined, message: string): void {
  const encoded = encodeURIComponent(message);
  const clean = formatPakistaniPhone(phone);
  const url = clean
    ? `https://api.whatsapp.com/send?phone=${clean}&text=${encoded}`
    : `https://api.whatsapp.com/send?text=${encoded}`;

  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  } else {
    Linking.openURL(url).catch((err) => {
      console.warn('Could not open WhatsApp URL:', err);
    });
  }
}

/**
 * Format a clean, bilingual digital receipt suitable for WhatsApp
 */
export function buildWhatsAppReceiptText(
  sale: Sale,
  settings: ShopSettings,
  language: 'en' | 'ur' = 'ur'
): string {
  const shopHeader = settings.shopNameUrdu
    ? `*${settings.shopNameUrdu}*\n*${settings.shopName}*`
    : `*${settings.shopName}*`;

  const dateStr = new Date(sale.date).toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  let itemsList = '';
  sale.items.forEach((it, idx) => {
    const name = it.product.name;
    const nameUrdu = it.product.nameUrdu ? ` (${it.product.nameUrdu})` : '';
    itemsList += `${idx + 1}. ${name}${nameUrdu}\n   ${it.quantity} ${it.product.unit || 'pc'} × ${settings.currencySymbol}${it.unitPrice} = *${settings.currencySymbol}${it.total}*\n`;
  });

  const paymentText =
    sale.paymentMethod === 'cash'
      ? (language === 'ur' ? 'نقد (Cash)' : 'Cash')
      : sale.paymentMethod === 'online'
      ? (language === 'ur' ? 'آن لائن (Online)' : 'Online')
      : (language === 'ur' ? 'ادھار (Credit)' : 'Store Credit');

  return `
🧾 ${shopHeader}
📍 ${settings.address || 'Local Store'}
📞 ${settings.phone || ''}
---------------------------------
📄 *بل نمبر (Bill #):* ${sale.billNumber || sale.id.slice(-6).toUpperCase()}
📅 *تاریخ (Date):* ${dateStr}
👤 *گاہک (Customer):* ${sale.customerName || (language === 'ur' ? 'محترم گاہک' : 'Walk-in Customer')}
---------------------------------
*خریداری کی تفصیل (Items):*
${itemsList}---------------------------------
سب ٹوٹل (Subtotal): ${settings.currencySymbol}${sale.subtotal}
${sale.discount > 0 ? `ڈسکاؤنٹ (Discount): -${settings.currencySymbol}${sale.discount}\n` : ''}*کل بل (Grand Total): ${settings.currencySymbol}${sale.grandTotal}*
ادائیگی کا طریقہ (Payment): ${paymentText}
---------------------------------
${settings.footerNoteUrdu || 'خریداری کا شکریہ! دوبارہ تشریف لائیں۔'}
${settings.footerNote || 'Thank you for shopping with us!'}
  `.trim();
}

/**
 * Open WhatsApp with a completed digital sale receipt
 */
export function openWhatsAppReceipt(
  sale: Sale,
  settings: ShopSettings,
  language: 'en' | 'ur' = 'ur'
): void {
  const message = buildWhatsAppReceiptText(sale, settings, language);
  openWhatsAppWithMessage(sale.customerPhone, message);
}

/**
 * Generate an auspicious WhatsApp Status message for "Pehli Bohani" (Day's First Sale)
 */
export function buildBohaniShareText(options: {
  shopName: string;
  shopNameUrdu?: string;
  amount: number;
  currencySymbol?: string;
  isUrdu?: boolean;
}): string {
  const { shopName, shopNameUrdu, amount, currencySymbol = 'Rs.', isUrdu = true } = options;
  const store = shopNameUrdu ? `${shopNameUrdu} (${shopName})` : shopName;

  if (isUrdu) {
    return `
✨ *الحمدللہ! آج کی پہلی بوہنی مکمل ہوئی* 🤲

🏪 *${store}*
💵 *پہلی سیل:* ${currencySymbol}${amount.toLocaleString()}
📅 *تاریخ:* ${new Date().toLocaleDateString('ur-PK', { day: 'numeric', month: 'short', year: 'numeric' })}

یا اللہ ہمارے کاروبار اور رزقِ حلال میں برکت، آسانی اور خیر عطا فرما۔ آمین! 🌟
آپ کے اعتماد کا شکریہ۔

⚡ *Powered by DigiShop POS* • آپ کا ڈیجیٹل کھاتہ و بلنگ
`.trim();
  }

  return `
✨ *Alhamdulillah! First Sale of the Day (Pehli Bohani) Complete* 🤲

🏪 *${store}*
💵 *First Sale:* ${currencySymbol}${amount.toLocaleString()}
📅 *Date:* ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}

May Allah bless our trade, customers, and halal sustenance with abundance and barakah. Ameen! 🌟
Thank you for your trust and support.

⚡ *Powered by DigiShop POS* • Digital Store & Smart Counter
`.trim();
}

/**
 * Generate a proud community summary for WhatsApp Status at Day-End Closing (Daily Barkat Story)
 */
export function buildBarkatStatusText(options: {
  shopName: string;
  shopNameUrdu?: string;
  totalCustomers: number;
  totalSales?: number;
  currencySymbol?: string;
  isUrdu?: boolean;
}): string {
  const { shopName, shopNameUrdu, totalCustomers, isUrdu = true } = options;
  const store = shopNameUrdu ? `${shopNameUrdu} (${shopName})` : shopName;
  const dateFormatted = new Date().toLocaleDateString(isUrdu ? 'ur-PK' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  if (isUrdu) {
    return `
🌙 *الحمدللہ! آج کا دکان حساب کتاب خیر و برکت کے ساتھ مکمل ہوا* 🤲

🏪 *${store}*
📅 *تاریخ:* ${dateFormatted}
📦 آج *${totalCustomers}* معزز گاہکوں اور محلے داروں کی خدمت کا شرف ملا
🤝 نقد و ڈیجیٹل کھاتہ اور مکمل شفاف حساب!

اللہ پاک ہم سب کے رزق میں برکت، صحت اور وسعت عطا فرمائے۔ آمین! 🤲
تمام معزز گاہکوں کے اعتماد اور تعاون کا دلی شکریہ۔

— *${store}*
⚡ *Powered by DigiShop POS* • سمارٹ ڈیجیٹل دکان
`.trim();
  }

  return `
🌙 *Alhamdulillah! Today's Store Accounting Completed with Barakah* 🤲

🏪 *${store}*
📅 *Date:* ${dateFormatted}
📦 Served *${totalCustomers}* valued customers and neighbours today
🤝 100% Transparent digital bookkeeping & receipts

May Allah bless everyone's sustenance, health, and family with barakah. Ameen! 🤲
Thank you for your continuous trust and patronage.

— *${store}*
⚡ *Powered by DigiShop POS* • Smart Neighborhood Counter
`.trim();
}
