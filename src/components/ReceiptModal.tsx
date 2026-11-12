import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';
import { googleDriveService } from '@/services/googleDriveService';
import { Sale } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProductImage } from '@/components/ProductImage';
import { getPaymentBreakdown } from '@/utils/payment';

interface ReceiptModalProps {
  sale: Sale | null;
  visible: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ sale, visible, onClose }) => {
  const { settings, language, t, user, refundSale, showAlert } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();

  const receiptViewRef = useRef<View>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showWebWhatsAppNotice, setShowWebWhatsAppNotice] = useState(false);
  const [driveSaved, setDriveSaved] = useState(false);

  useEffect(() => {
    // Reset on every open, then attempt the bill upload and track the real outcome
    setDriveSaved(false);
    if (visible && sale) {
      googleDriveService
        .uploadBillToDrive(sale, settings)
        .then((result) => setDriveSaved(!!result?.id))
        .catch(() => setDriveSaved(false));
    }
  }, [visible, sale?.id]); // re-run only when a different sale opens

  if (!sale) return null;

  const isRefunded = sale.status === 'refunded' || !!sale.refundedAt;

  const dynamicShopName = settings.shopName || (user?.displayName ? `${user.displayName}'s Store` : 'My Store');
  const dynamicShopUrdu = settings.shopNameUrdu || (user?.displayName ? `${user.displayName} اسٹور` : 'میری دکان');
  const dynamicAddress = settings.address || '';
  const dynamicPhone = settings.phone || '';
  const customerDisplayName = sale.customerName || (language === 'ur' ? 'عام گاہک' : 'Walk-in Customer');

  const formattedDate = new Date(sale.date).toLocaleString(
    language === 'ur' ? 'ur-PK' : 'en-US',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    }
  );

  const { cleanPaid, baki, isSplit: isSplitSale } = getPaymentBreakdown(sale);

  const paymentLabel = isSplitSale
    ? (language === 'ur' ? 'جزوی نقد + ادھار (Split)' : 'Split (Cash + Khata)')
    : sale.paymentMethod === 'udhaar'
    ? (language === 'ur' ? '(ادھار)' : '(Store Credit)')
    : sale.paymentMethod === 'cash'
    ? (language === 'ur' ? '(نقد)' : '(Cash)')
    : (language === 'ur' ? '(آن لائن)' : '(Online)');

  // Helper to generate a realistic SVG Barcode for HTML printing
  const generateBarcodeSVG = (code: string) => {
    const text = code || 'INV-1001';
    let x = 0;
    const bars: string[] = [];
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const w1 = (charCode % 2) + 1.2;
      const w2 = ((charCode >> 1) % 2) + 1.6;
      const w3 = ((charCode >> 2) % 2) + 1.2;
      bars.push(`<rect x="${x}" y="0" width="${w1}" height="32" fill="#111827" />`);
      x += w1 + 1.5;
      bars.push(`<rect x="${x}" y="0" width="${w2}" height="32" fill="#111827" />`);
      x += w2 + 2;
      bars.push(`<rect x="${x}" y="0" width="${w3}" height="32" fill="#111827" />`);
      x += w3 + 1.5;
    }
    return `
      <div style="display: flex; flex-direction: column; align-items: center;">
        <svg width="${Math.min(x, 120)}" height="32" viewBox="0 0 ${x} 32" xmlns="http://www.w3.org/2000/svg">
          ${bars.join('')}
        </svg>
        <div style="font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #111827; margin-top: 2px; font-family: monospace;">
          ${text}
        </div>
      </div>
    `;
  };

  // Generate HTML replicating the exact professional green receipt design
  const generateReceiptHTML = () => {
    const itemsRows = sale.items
      .map(
        (it, idx) => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 6px; font-size: 13px; font-weight: 800; text-align: center; vertical-align: top; color: #111827;">
            ${idx + 1}
          </td>
          <td style="padding: 10px 8px; vertical-align: top; text-align: left;">
            <div style="font-size: 13px; font-weight: 800; color: #111827;">${it.product.name}</div>
            ${it.product.nameUrdu
            ? `<div style="font-size: 12px; color: #4a5568; margin-top: 2px;">(${it.product.nameUrdu})</div>`
            : ''
          }
            <div style="font-size: 11px; color: #718096; margin-top: 2px;">${it.quantity} ${it.product.unit}</div>
          </td>
          <td style="padding: 10px 6px; font-size: 13px; font-weight: 600; text-align: center; vertical-align: top; color: #111827;">
            ${it.quantity} ${it.product.unit}
          </td>
          <td style="padding: 10px 6px; font-size: 13px; font-weight: 600; text-align: center; vertical-align: top; color: #111827;">
            Rs.${it.unitPrice}
          </td>
          <td style="padding: 10px 8px; font-size: 13px; font-weight: 800; text-align: right; vertical-align: top; color: #111827;">
            Rs.${it.total}
          </td>
        </tr>
      `
      )
      .join('');

    const barcodeHTML = generateBarcodeSVG(sale.billNumber);

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Receipt - ${sale.billNumber}</title>
          <style>
            @page {
              margin: 8mm;
              size: auto;
            }
            * {
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, 'Noto Nastaliq Urdu', sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f7fafc;
              color: #1a202c;
              display: flex;
              justify-content: center;
            }
            .receipt-container {
              width: 100%;
              max-width: 580px;
              background: #ffffff;
              padding: 24px 20px 0 20px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
              position: relative;
            }
            .header-wrap {
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
              padding-bottom: 6px;
            }
            .header-logo {
              position: absolute;
              left: 0;
              top: 4px;
              width: 68px;
              height: 68px;
            }
            .header-center {
              text-align: center;
              padding: 0 60px;
            }
            .store-title-en {
              margin: 0;
              font-size: 24px;
              font-weight: 900;
              color: #111827;
              letter-spacing: -0.3px;
            }
            .store-title-ur {
              margin: 2px 0 0 0;
              font-size: 23px;
              font-weight: 800;
              color: #006837;
              font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', sans-serif;
            }
            .tagline-en {
              font-size: 12px;
              color: #2d3748;
              font-weight: 600;
              margin-top: 4px;
            }
            .tagline-ur {
              font-size: 12px;
              color: #2d3748;
              font-weight: 700;
              margin-top: 1px;
              font-family: 'Noto Nastaliq Urdu', sans-serif;
            }
            .green-divider {
              border-top: 2px solid #006837;
              margin: 14px 0;
            }
            .meta-grid {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              gap: 8px;
              font-size: 12px;
              line-height: 1.5;
              color: #2d3748;
              margin-bottom: 14px;
            }
            .meta-left {
              flex: 1.1;
            }
            .meta-center {
              flex: 1.4;
              padding: 0 6px;
            }
            .meta-right {
              flex: 0.9;
              display: flex;
              justify-content: flex-end;
            }
            .meta-row {
              display: flex;
              align-items: center;
              gap: 6px;
              margin-bottom: 4px;
            }
            .table-wrap {
              width: 100%;
              margin-bottom: 14px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            thead th {
              background-color: #006837;
              color: #ffffff;
              padding: 8px 6px;
              font-size: 12px;
              font-weight: 800;
            }
            thead th:first-child {
              border-top-left-radius: 6px;
              border-bottom-left-radius: 6px;
            }
            thead th:last-child {
              border-top-right-radius: 6px;
              border-bottom-right-radius: 6px;
            }
            .calc-section {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin: 12px 0 18px 0;
              position: relative;
            }
            .watermark-cart {
              width: 130px;
              height: 130px;
              opacity: 0.12;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .calc-box {
              background: #eef8f2;
              border: 1px solid #d1fae5;
              border-radius: 8px;
              padding: 12px 16px;
              width: 290px;
            }
            .calc-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 13px;
              margin-bottom: 6px;
              color: #1f2937;
            }
            .calc-divider {
              border-top: 1px solid #d1fae5;
              margin: 6px 0;
            }
            .grand-total-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 14px;
              font-weight: 800;
              color: #111827;
              margin: 6px 0;
            }
            .grand-total-value {
              font-size: 20px;
              font-weight: 900;
              color: #006837;
            }
            .footer-notes {
              text-align: center;
              margin-top: 14px;
            }
            .footer-urdu {
              font-size: 14px;
              font-weight: 800;
              color: #111827;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              font-family: 'Noto Nastaliq Urdu', sans-serif;
            }
            .footer-eng {
              font-size: 12px;
              color: #4a5568;
              font-weight: 600;
              margin-top: 4px;
            }
            .footer-heart {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              margin-top: 6px;
            }
            .line-decor {
              width: 45px;
              height: 1px;
              background-color: #cbd5e0;
              display: inline-block;
            }
            .bottom-bar {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 16px;
              padding-bottom: 12px;
            }
            .bottom-wa {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .wa-icon-circle {
              width: 34px;
              height: 34px;
              background-color: #006837;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
            }
            .bottom-badge {
              text-align: right;
              color: #006837;
              font-family: 'Brush Script MT', 'Segoe Script', cursive, sans-serif;
            }
            .sawtooth-tear {
              width: 100%;
              height: 16px;
              display: block;
              margin-top: 4px;
            }
            @media print {
              body {
                background: none;
              }
              .receipt-container {
                box-shadow: none;
                max-width: 100%;
                padding: 10px;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <!-- Header -->
            <div class="header-wrap">
              <div class="header-logo">
                <svg width="68" height="68" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <!-- Groceries in Cart -->
                  <path d="M30 38 L30 18 L36 18 L36 38 Z" fill="#006837"/>
                  <rect x="31" y="12" width="4" height="6" fill="#006837"/>
                  <circle cx="48" cy="26" r="12" fill="#006837"/>
                  <path d="M42 20 Q48 14 54 20" stroke="#ffffff" stroke-width="2" fill="none"/>
                  <path d="M62 38 L68 18 L78 22 L74 38 Z" fill="#006837"/>
                  <!-- Cart Body -->
                  <path d="M16 38 L24 38 L32 70 L80 70 L86 42 L26 42" stroke="#006837" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                  <!-- Slats -->
                  <line x1="29" y1="52" x2="83" y2="52" stroke="#006837" stroke-width="3"/>
                  <line x1="31" y1="61" x2="81" y2="61" stroke="#006837" stroke-width="3"/>
                  <!-- Wheels -->
                  <circle cx="38" cy="82" r="7" fill="#006837"/>
                  <circle cx="74" cy="82" r="7" fill="#006837"/>
                </svg>
              </div>
              <div class="header-center">
                <h1 class="store-title-en">${dynamicShopName}</h1>
                <div class="store-title-ur">${dynamicShopUrdu}</div>
                <div class="tagline-en">Fresh Products • Better Prices • Your Trusted Shop</div>
                <div class="tagline-ur">تازہ اشیاء • مناسب قیمت • آپ کا بھروسہ</div>
              </div>
            </div>

            <!-- Green Divider -->
            <div class="green-divider"></div>

            <!-- Bill & Store Metadata -->
            <div class="meta-grid">
              <!-- Left: Bill Info -->
              <div class="meta-left">
                <div class="meta-row">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="#006837"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                  <span><strong>Bill #:</strong> <span style="font-weight: 800;">${sale.billNumber}</span></span>
                </div>
                <div class="meta-row">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="#006837"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/></svg>
                  <span><strong>Date:</strong> ${formattedDate}</span>
                </div>
                <div class="meta-row">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="#006837"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                  <span><strong>Customer:</strong> ${customerDisplayName}</span>
                </div>
              </div>

              <!-- Center: Store Location -->
              <div class="meta-center">
                <div style="display: flex; align-items: flex-start; gap: 6px;">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="#006837" style="margin-top: 2px;"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>
                  <div>
                    <strong style="color: #111827;">${dynamicShopName}</strong>
                    ${dynamicAddress ? `<div style="font-size: 11px; color: #4a5568;">${dynamicAddress}</div>` : ''}
                  </div>
                </div>
                ${dynamicPhone ? `
                <div class="meta-row" style="margin-top: 4px;">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="#006837"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-2.2 2.2a15.053 15.053 0 0 1-6.59-6.59l2.2-2.21a.96.96 0 0 0 .25-1.01A11.36 11.36 0 0 1 8.5 3.99c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.49c0-.55-.45-1-.99-1.12z"/></svg>
                  <span>${dynamicPhone}</span>
                </div>` : ''}
              </div>

              <!-- Right: Barcode -->
              <div class="meta-right">
                ${barcodeHTML}
              </div>
            </div>

            <!-- Items Table -->
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th style="width: 6%; text-align: center;">#</th>
                    <th style="width: 44%; text-align: left;">Item / سامان</th>
                    <th style="width: 16%; text-align: center;">Qty / مقدار</th>
                    <th style="width: 17%; text-align: center;">Rate / قیمت</th>
                    <th style="width: 17%; text-align: right;">Total / کل رقم</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>
            </div>

            <!-- Watermark & Calculation Area -->
            <div class="calc-section">
              <div class="watermark-cart">
                <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M30 38 L30 18 L36 18 L36 38 Z" fill="#006837"/>
                  <circle cx="48" cy="26" r="12" fill="#006837"/>
                  <path d="M62 38 L68 18 L78 22 L74 38 Z" fill="#006837"/>
                  <path d="M16 38 L24 38 L32 70 L80 70 L86 42 L26 42" stroke="#006837" stroke-width="6" fill="none"/>
                  <circle cx="38" cy="82" r="7" fill="#006837"/>
                  <circle cx="74" cy="82" r="7" fill="#006837"/>
                </svg>
              </div>

              <div class="calc-box">
                <div class="calc-row">
                  <span>Subtotal / سب ٹوٹل</span>
                  <span style="font-weight: 800;">Rs.${sale.subtotal}</span>
                </div>
                ${sale.discount > 0
        ? `
                  <div class="calc-row" style="color: #dc2626;">
                    <span>Discount / ڈسکاؤنٹ</span>
                    <span style="font-weight: 800;">- Rs.${sale.discount}</span>
                  </div>
                `
        : ''
      }
                <div class="calc-divider"></div>
                <div class="grand-total-row">
                  <span>Grand Total / کل رقم</span>
                  <span class="grand-total-value">Rs.${sale.grandTotal}</span>
                </div>
                <div class="calc-divider"></div>
                <div class="calc-row" style="margin-bottom: 0;">
                  <div>
                    <strong style="color: #111827;">Payment / ادائیگی کا طریقہ</strong>
                    <div style="font-size: 11px; color: #4a5568;">${paymentLabel}</div>
                  </div>
                  <span style="font-weight: 800; font-size: 14px;">Rs.${sale.grandTotal}</span>
                </div>
              </div>
            </div>

            <!-- Footer Notes -->
            <div class="footer-notes">
              <div class="footer-urdu">
                <span class="line-decor"></span>
                <span>${settings.footerNoteUrdu || 'خریداری کا شکریہ! دوبارہ تشریف لائیں۔'}</span>
                <span class="line-decor"></span>
              </div>
              <div class="footer-eng">
                ${settings.footerNote || 'Thank you for shopping with us! Please visit again.'}
              </div>
              <div class="footer-heart">
                <span class="line-decor"></span>
                <span style="font-size: 12px;">💚</span>
                <span class="line-decor"></span>
              </div>
            </div>

            <!-- Bottom Contact & Stamp -->
            <div class="bottom-bar">
              ${dynamicPhone ? `
              <div class="bottom-wa">
                <div class="wa-icon-circle">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.53c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.21-.18-.46-.3"/></svg>
                </div>
                <div>
                  <div style="font-size: 11px; color: #4a5568;">For any queries, contact us on WhatsApp</div>
                  <div style="font-size: 14px; font-weight: 800; color: #111827;">${dynamicPhone}</div>
                </div>
              </div>` : '<div></div>'}

              <div class="bottom-badge">
                <div style="font-size: 17px; font-weight: bold; line-height: 1.1; transform: rotate(-3deg);">Shop Local</div>
                <div style="font-size: 18px; font-weight: bold; line-height: 1.1; transform: rotate(-3deg); display: flex; align-items: center; justify-content: flex-end; gap: 4px;">
                  <span>Support Local</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#006837"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A9.49 9.49 0 0 0 12 21a10 10 0 0 0 10-10V8h-5zm3 3a8 8 0 0 1-8 8c-.68 0-1.34-.08-1.97-.24C11.66 14.5 14 11 20 11z"/></svg>
                </div>
              </div>
            </div>

            <!-- Sawtooth Serrated Bottom Tear Edge -->
            <svg class="sawtooth-tear" viewBox="0 0 600 16" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="sawteeth" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                  <polygon points="0,16 8,0 16,16" fill="#006837"/>
                </pattern>
              </defs>
              <rect width="100%" height="16" fill="url(#sawteeth)"/>
            </svg>
          </div>
        </body>
      </html>
    `;
  };

  // Generate high-density thermal printer HTML (58mm/80mm ESC/POS compatible)
  const generateThermalReceiptHTML = (width: '58mm' | '80mm' = '80mm') => {
    const is58 = width === '58mm';
    const barcodeHTML = generateBarcodeSVG(sale.billNumber);
    const itemsRows = sale.items
      .map(
        (it) => `
        <div style="margin: 3px 0;">
          <div style="font-weight: 700; font-size: ${is58 ? '11px' : '13px'}; color: #000;">
            ${it.product.name} ${it.product.nameUrdu ? `(${it.product.nameUrdu})` : ''}
          </div>
          <div style="display: flex; justify-content: space-between; font-size: ${is58 ? '10px' : '12px'}; color: #222; margin-top: 1px;">
            <span>${it.quantity} ${it.product.unit} × Rs.${it.unitPrice}</span>
            <span style="font-weight: 700;">Rs.${it.total}</span>
          </div>
        </div>
      `
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Thermal Receipt - ${sale.billNumber}</title>
          <style>
            @page {
              margin: 2mm;
              size: ${width} auto;
            }
            * { box-sizing: border-box; }
            body {
              font-family: 'Courier New', Courier, monospace, -apple-system, sans-serif;
              margin: 0;
              padding: 4px;
              background-color: #fff;
              color: #000;
              width: 100%;
              max-width: ${is58 ? '210px' : '310px'};
              margin: 0 auto;
              font-size: ${is58 ? '11px' : '12px'};
              line-height: 1.35;
            }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .store-title {
              font-size: ${is58 ? '16px' : '18px'};
              font-weight: 900;
              margin-bottom: 2px;
            }
            .store-urdu {
              font-size: ${is58 ? '14px' : '16px'};
              font-weight: 800;
              margin-bottom: 2px;
            }
            .subtext {
              font-size: ${is58 ? '9px' : '11px'};
              color: #333;
            }
            .divider {
              border-top: 1px dashed #000;
              margin: 6px 0;
            }
            .double-divider {
              border-top: 2px solid #000;
              margin: 6px 0;
            }
            .row {
              display: flex;
              justify-content: space-between;
              margin: 2px 0;
            }
            .grand-total-row {
              display: flex;
              justify-content: space-between;
              font-size: ${is58 ? '15px' : '18px'};
              font-weight: 900;
              margin: 4px 0;
            }
            .cutter-space {
              height: 35px;
            }
            @media print {
              body { margin: 0; padding: 2px; }
            }
          </style>
        </head>
        <body>
          <div class="center store-title">${dynamicShopName}</div>
          <div class="center store-urdu">${dynamicShopUrdu}</div>
          ${dynamicAddress ? `<div class="center subtext">${dynamicAddress}</div>` : ''}
          ${dynamicPhone ? `<div class="center subtext">Tel: ${dynamicPhone}</div>` : ''}

          <div class="double-divider"></div>

          <div class="row">
            <span>Bill #:</span>
            <span class="bold">${sale.billNumber}</span>
          </div>
          <div class="row">
            <span>Date:</span>
            <span>${formattedDate}</span>
          </div>
          <div class="row">
            <span>Customer:</span>
            <span class="bold">${customerDisplayName}</span>
          </div>

          <div class="divider"></div>

          <div style="font-weight: bold; margin-bottom: 4px; display: flex; justify-content: space-between;">
            <span>ITEMS / سامان</span>
            <span>TOTAL</span>
          </div>

          ${itemsRows}

          <div class="divider"></div>

          <div class="row">
            <span>Subtotal / سب ٹوٹل:</span>
            <span class="bold">Rs.${sale.subtotal}</span>
          </div>
          ${
            sale.discount > 0
              ? `
            <div class="row">
              <span>Discount / ڈسکاؤنٹ:</span>
              <span class="bold">-Rs.${sale.discount}</span>
            </div>
          `
              : ''
          }

          <div class="double-divider"></div>

          <div class="grand-total-row">
            <span>TOTAL:</span>
            <span>Rs.${sale.grandTotal}</span>
          </div>

          <div class="row" style="margin-top: 4px;">
            <span>Payment / ادائیگی:</span>
            <span class="bold">${paymentLabel}</span>
          </div>
          ${cleanPaid > 0 ? `<div class="row" style="color: #059669; font-weight: bold;"><span>Cash Paid / نقد وصول:</span><span>Rs.${cleanPaid}</span></div>` : ''}
          ${sale.paymentMethod === 'udhaar' && Math.max(0, sale.grandTotal - cleanPaid) > 0 ? `<div class="row" style="color: #dc2626; font-weight: bold;"><span>Baki / ادھار کھاتہ:</span><span>Rs.${Math.max(0, sale.grandTotal - cleanPaid)}</span></div>` : ''}
          ${sale.change ? `<div class="row"><span>Change / بقایا واپس:</span><span class="bold">Rs.${sale.change}</span></div>` : ''}

          <div class="divider"></div>

          <div class="center" style="margin: 6px 0;">
            ${barcodeHTML}
          </div>

          <div class="center subtext bold">${settings.footerNoteUrdu || 'خریداری کا شکریہ!'}</div>
          <div class="center subtext">${settings.footerNote || 'Thank you for shopping!'}</div>

          <div class="cutter-space"></div>
        </body>
      </html>
    `;
  };

  // Generate WhatsApp formatted text message
  const buildWhatsAppMessage = () => {
    const shopHeader = `*${dynamicShopUrdu}*\n*${dynamicShopName}*`;

    let itemsList = '';
    sale.items.forEach((it, idx) => {
      const engName = it.product.name;
      itemsList += `${idx + 1}. ${engName} | ${it.quantity} ${it.product.unit} x ${settings.currencySymbol}${it.unitPrice} = ${settings.currencySymbol}${it.total}`;
      if (it.product.nameUrdu) itemsList += ` (${it.product.nameUrdu})`;
      itemsList += '\n';
    });

    const isSplit = isSplitSale;

    let paymentBreakdown = '';
    if (isSplit) {
      paymentBreakdown = `ادائیگی (Payment): جزوی نقد + ادھار (Split)\n• نقد ادا (Cash Paid): ${settings.currencySymbol}${cleanPaid}\n• *باقی ادھار کھاتہ (Baki / Khata): ${settings.currencySymbol}${baki}*`;
    } else {
      const paymentText =
        sale.paymentMethod === 'cash'
          ? (language === 'ur' ? 'نقد (Cash)' : 'Cash')
          : sale.paymentMethod === 'online'
            ? (language === 'ur' ? 'آن لائن (Online)' : 'Online')
            : (language === 'ur' ? 'ادھار (Credit)' : 'Store Credit');
      paymentBreakdown = `ادائیگی کا طریقہ (Payment): ${paymentText}`;
    }

    return `
🧾 ${shopHeader}
📍 ${dynamicAddress}
📞 ${dynamicPhone}
---------------------------------
📄 *بل نمبر (Bill #):* ${sale.billNumber}
📅 *تاریخ (Date):* ${formattedDate}
👤 *گاہک (Customer):* ${sale.customerName || 'Customer'}
---------------------------------
*خریداری کی تفصیل (Items):*
${itemsList}---------------------------------
سب ٹوٹل (Subtotal): ${settings.currencySymbol}${sale.subtotal}
${sale.discount > 0 ? `ڈسکاؤنٹ (Discount): -${settings.currencySymbol}${sale.discount}\n` : ''}*کل رقم (Grand Total): ${settings.currencySymbol}${sale.grandTotal}*
${paymentBreakdown}
---------------------------------
${settings.footerNoteUrdu || 'خریداری کا شکریہ! دوبارہ تشریف لائیں۔'}
${settings.footerNote || 'Thank you for shopping with us! Please visit again.'}
    `.trim();
  };

  // Get cross-platform WhatsApp link
  const getWhatsAppUrl = (isImageCaptionOnly = false) => {
    const message = isImageCaptionOnly
      ? `🧾 *${dynamicShopName}* | Bill #${sale.billNumber} | Rs.${sale.grandTotal}`
      : buildWhatsAppMessage();
    const encoded = encodeURIComponent(message);
    const cleanPhone = sale.customerPhone?.replace(/[^0-9]/g, '');

    if (cleanPhone) {
      const formatted = cleanPhone.startsWith('92')
        ? cleanPhone
        : cleanPhone.startsWith('0')
          ? '92' + cleanPhone.slice(1)
          : cleanPhone;
      return `https://api.whatsapp.com/send?phone=${formatted}&text=${encoded}`;
    }
    return `https://api.whatsapp.com/send?text=${encoded}`;
  };

  // Ultra-crisp HTML5 Canvas 2D image generator for Web (zero XML errors, never tainted)
  const generateReceiptCanvasBlob = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      try {
        if (typeof document === 'undefined') {
          resolve(null);
          return;
        }

        const width = 600;
        const baseHeight = 520;
        const itemRowHeight = 44;
        const itemsHeight = sale.items.length * itemRowHeight;
        const height = baseHeight + itemsHeight;

        const canvas = document.createElement('canvas');
        const scale = 2; // 2x Retina resolution (1200 x 2*height)
        canvas.width = width * scale;
        canvas.height = height * scale;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }

        ctx.scale(scale, scale);

        // Background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // Helper: Rounded Rectangle
        const drawRoundRect = (
          x: number,
          y: number,
          w: number,
          h: number,
          r: number,
          fillColor?: string,
          strokeColor?: string
        ) => {
          ctx.beginPath();
          if (typeof (ctx as any).roundRect === 'function') {
            (ctx as any).roundRect(x, y, w, h, r);
          } else {
            ctx.moveTo(x + r, y);
            ctx.arcTo(x + w, y, x + w, y + h, r);
            ctx.arcTo(x + w, y + h, x, y + h, r);
            ctx.arcTo(x, y + h, x, y, r);
            ctx.arcTo(x, y, x + w, y, r);
          }
          ctx.closePath();
          if (fillColor) {
            ctx.fillStyle = fillColor;
            ctx.fill();
          }
          if (strokeColor) {
            ctx.strokeStyle = strokeColor;
            ctx.stroke();
          }
        };

        // 1. Shopping Cart Icon Circle
        ctx.fillStyle = '#006837';
        ctx.beginPath();
        ctx.arc(52, 48, 26, 0, Math.PI * 2);
        ctx.fill();

        // White Cart Graphic inside circle
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(38, 38);
        ctx.lineTo(43, 38);
        ctx.lineTo(47, 54);
        ctx.lineTo(63, 54);
        ctx.lineTo(66, 42);
        ctx.lineTo(44, 42);
        ctx.stroke();
        // Cart Wheels
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(48, 59, 2.5, 0, Math.PI * 2);
        ctx.arc(62, 59, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // 2. Store Header Text
        ctx.textAlign = 'center';
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 22px "Segoe UI", Arial, sans-serif';
        ctx.fillText(dynamicShopName, 320, 36);

        ctx.fillStyle = '#006837';
        ctx.font = 'bold 21px "Noto Nastaliq Urdu", "Jameel Noori Nastaleeq", "Segoe UI", Arial, sans-serif';
        ctx.fillText(dynamicShopUrdu, 320, 62);

        ctx.fillStyle = '#374151';
        ctx.font = '600 11px "Segoe UI", Arial, sans-serif';
        ctx.fillText('Fresh Products • Better Prices • Your Trusted Shop', 320, 82);

        ctx.font = 'bold 11px "Noto Nastaliq Urdu", "Segoe UI", Arial, sans-serif';
        ctx.fillText('تازہ اشیاء • مناسب قیمت • آپ کا بھروسہ', 320, 99);

        // 3. Green Divider
        ctx.strokeStyle = '#006837';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(20, 115);
        ctx.lineTo(580, 115);
        ctx.stroke();

        // 4. Metadata Grid
        ctx.textAlign = 'left';
        ctx.font = 'bold 12px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#111827';
        ctx.fillText(`Bill #: ${sale.billNumber}`, 25, 134);

        ctx.font = 'normal 11px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#4B5563';
        ctx.fillText(`Date: ${formattedDate}`, 25, 151);

        ctx.font = 'normal 11px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#111827';
        ctx.fillText(`Customer: ${customerDisplayName}`, 25, 168);

        // Center: Shop Info
        ctx.font = 'bold 12px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#111827';
        ctx.fillText(dynamicShopName, 210, 134);

        if (dynamicAddress) {
          ctx.font = 'normal 10px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#4B5563';
          const addrText = dynamicAddress.length > 32 ? dynamicAddress.substring(0, 30) + '...' : dynamicAddress;
          ctx.fillText(addrText, 210, 151);
        }

        if (dynamicPhone) {
          ctx.font = 'bold 11px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#006837';
          ctx.fillText(dynamicPhone, 210, 168);
        }

        // Right: Barcode
        const barcodeX = 460;
        let bX = barcodeX;
        ctx.fillStyle = '#111827';
        for (let i = 0; i < sale.billNumber.length; i++) {
          const charCode = sale.billNumber.charCodeAt(i);
          const w = (charCode % 2) + 1.2;
          ctx.fillRect(bX, 125, w, 28);
          bX += w + 1.8;
        }
        ctx.textAlign = 'center';
        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = '#111827';
        ctx.fillText(sale.billNumber, (barcodeX + bX) / 2, 165);

        // 5. Table Header Bar (Solid Green `#006837`)
        const tableY = 185;
        drawRoundRect(20, tableY, 560, 28, 5, '#006837');

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px "Segoe UI", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('#', 36, tableY + 18);

        ctx.textAlign = 'left';
        ctx.fillText('Item / سامان', 65, tableY + 18);

        ctx.textAlign = 'center';
        ctx.fillText('Qty / مقدار', 330, tableY + 18);
        ctx.fillText('Rate / قیمت', 420, tableY + 18);

        ctx.textAlign = 'right';
        ctx.fillText('Total / رقم', 565, tableY + 18);

        // 6. Items Rows
        let currY = tableY + 30;
        sale.items.forEach((it, idx) => {
          ctx.textAlign = 'center';
          ctx.fillStyle = '#111827';
          ctx.font = 'bold 12px "Segoe UI", Arial, sans-serif';
          ctx.fillText(`${idx + 1}`, 36, currY + 18);

          // Name
          ctx.textAlign = 'left';
          ctx.fillStyle = '#111827';
          ctx.font = 'bold 12px "Segoe UI", Arial, sans-serif';
          ctx.fillText(it.product.name, 65, currY + 15);

          if (it.product.nameUrdu) {
            ctx.fillStyle = '#4B5563';
            ctx.font = '10px "Noto Nastaliq Urdu", "Segoe UI", Arial, sans-serif';
            ctx.fillText(`(${it.product.nameUrdu})`, 65, currY + 30);
          }

          // Qty
          ctx.textAlign = 'center';
          ctx.fillStyle = '#111827';
          ctx.font = 'normal 11px "Segoe UI", Arial, sans-serif';
          ctx.fillText(`${it.quantity} ${it.product.unit}`, 330, currY + 18);

          // Rate
          ctx.fillText(`Rs.${it.unitPrice}`, 420, currY + 18);

          // Total
          ctx.textAlign = 'right';
          ctx.font = 'bold 12px "Segoe UI", Arial, sans-serif';
          ctx.fillText(`Rs.${it.total}`, 565, currY + 18);

          // Row divider
          ctx.strokeStyle = '#E5E7EB';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(20, currY + itemRowHeight);
          ctx.lineTo(580, currY + itemRowHeight);
          ctx.stroke();

          currY += itemRowHeight;
        });

        // 7. Watermark & Calculation Box
        const calcBoxY = currY + 12;

        // Watermark cart on left
        ctx.save();
        ctx.globalAlpha = 0.12;
        ctx.fillStyle = '#006837';
        ctx.beginPath();
        ctx.arc(100, calcBoxY + 60, 45, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Calculation card on right
        drawRoundRect(280, calcBoxY, 300, 135, 8, '#EEF8F2', '#D1FAE5');

        ctx.textAlign = 'left';
        ctx.font = 'normal 12px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#374151';
        ctx.fillText('Subtotal / سب ٹوٹل', 295, calcBoxY + 24);
        ctx.textAlign = 'right';
        ctx.font = 'bold 12px "Segoe UI", Arial, sans-serif';
        ctx.fillText(`Rs.${sale.subtotal}`, 565, calcBoxY + 24);

        if (sale.discount > 0) {
          ctx.textAlign = 'left';
          ctx.fillStyle = '#DC2626';
          ctx.fillText('Discount / ڈسکاؤنٹ', 295, calcBoxY + 44);
          ctx.textAlign = 'right';
          ctx.fillText(`- Rs.${sale.discount}`, 565, calcBoxY + 44);
        }

        // Grand Total Row
        const gtY = sale.discount > 0 ? calcBoxY + 70 : calcBoxY + 54;
        ctx.strokeStyle = '#D1FAE5';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(290, gtY - 12);
        ctx.lineTo(570, gtY - 12);
        ctx.stroke();

        ctx.textAlign = 'left';
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 13px "Segoe UI", Arial, sans-serif';
        ctx.fillText('Grand Total / کل رقم', 295, gtY + 6);

        ctx.textAlign = 'right';
        ctx.fillStyle = '#006837';
        ctx.font = 'bold 18px "Segoe UI", Arial, sans-serif';
        ctx.fillText(`Rs.${sale.grandTotal}`, 565, gtY + 6);

        // Payment Method Row
        const payY = gtY + 30;
        ctx.beginPath();
        ctx.moveTo(290, payY - 10);
        ctx.lineTo(570, payY - 10);
        ctx.stroke();

        ctx.textAlign = 'left';
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 11px "Segoe UI", Arial, sans-serif';
        ctx.fillText(`Payment: ${paymentLabel}`, 295, payY + 8);
        ctx.textAlign = 'right';
        ctx.fillText(`Rs.${sale.grandTotal}`, 565, payY + 8);

        // 8. Footer Greetings
        const footerY = calcBoxY + 155;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 13px "Noto Nastaliq Urdu", "Segoe UI", Arial, sans-serif';
        ctx.fillText(settings.footerNoteUrdu || 'خریداری کا شکریہ! دوبارہ تشریف لائیں۔', 300, footerY);

        ctx.fillStyle = '#4B5563';
        ctx.font = 'normal 11px "Segoe UI", Arial, sans-serif';
        ctx.fillText(settings.footerNote || 'Thank you for shopping with us! Please visit again.', 300, footerY + 18);

        // Decorative Heart & Lines
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(220, footerY + 30);
        ctx.lineTo(270, footerY + 30);
        ctx.moveTo(330, footerY + 30);
        ctx.lineTo(380, footerY + 30);
        ctx.stroke();
        ctx.fillText('💚', 300, footerY + 33);

        // 9. Bottom Bar (WhatsApp contact & Support Local)
        const bottomY = footerY + 54;
        ctx.fillStyle = '#006837';
        ctx.beginPath();
        ctx.arc(38, bottomY + 10, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('W', 38, bottomY + 15);

        ctx.textAlign = 'left';
        ctx.fillStyle = '#4B5563';
        ctx.font = '10px "Segoe UI", Arial, sans-serif';
        ctx.fillText('For any queries, contact us on WhatsApp', 60, bottomY + 7);
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 12px "Segoe UI", Arial, sans-serif';
        ctx.fillText(dynamicPhone, 60, bottomY + 22);

        // Shop Local badge
        ctx.textAlign = 'right';
        ctx.fillStyle = '#006837';
        ctx.font = 'italic bold 13px "Segoe UI", Arial, sans-serif';
        ctx.fillText('Shop Local', 570, bottomY + 7);
        ctx.fillText('Support Local 🌱', 570, bottomY + 22);

        // 10. Sawtooth Serrated Bottom Border
        const sawY = bottomY + 38;
        const toothWidth = 16;
        const toothHeight = 12;
        ctx.fillStyle = '#006837';
        ctx.beginPath();
        ctx.moveTo(0, sawY + toothHeight);
        for (let sx = 0; sx <= width; sx += toothWidth) {
          ctx.lineTo(sx + toothWidth / 2, sawY);
          ctx.lineTo(sx + toothWidth, sawY + toothHeight);
        }
        ctx.lineTo(width, sawY + toothHeight);
        ctx.lineTo(0, sawY + toothHeight);
        ctx.closePath();
        ctx.fill();

        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png');
      } catch (e) {
        console.warn('Canvas receipt generation failed:', e);
        resolve(null);
      }
    });
  };

  // Convert and send bill on WhatsApp (image + prefilled message)
  const handleShareWhatsAppImage = async () => {
    try {
      setIsGeneratingImage(true);

      if (Platform.OS === 'web') {
        // 1. Generate the Canvas Image Blob FIRST while document still has focus!
        const blob = await generateReceiptCanvasBlob();

        if (blob) {
          // 2. Try native Web Share with files first (Windows 11 / Android Chrome)
          try {
            const file = new File([blob], `Bill-${sale.billNumber}.png`, { type: 'image/png' });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              await navigator.share({
                files: [file],
                title: `Bill #${sale.billNumber}`,
                text: `Receipt from ${dynamicShopName}`,
              });
              setIsGeneratingImage(false);
              return;
            }
          } catch {
            // User cancelled or native share fallback
          }

          // 3. Write directly to clipboard while document still has focus!
          try {
            if (navigator.clipboard && (window as any).ClipboardItem) {
              const item = new (window as any).ClipboardItem({ 'image/png': blob });
              await navigator.clipboard.write([item]);
            }
          } catch (clipErr) {
            console.warn('Clipboard write error:', clipErr);
          }

          // 4. Auto-download bill PNG image
          try {
            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `Bill-${sale.billNumber}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
          } catch (dlErr) {
            console.warn('Download error:', dlErr);
          }

          // 5. Open WhatsApp Web with a brief caption (so chat is ready for paste)
          const waUrl = getWhatsAppUrl(true);
          if (typeof window !== 'undefined') {
            window.open(waUrl, '_blank');
          }

          // 6. Show the on-screen helper modal so the user knows to paste
          setShowWebWhatsAppNotice(true);
        }
        return;
      }

      // Android / iOS Native:
      if (!receiptViewRef.current) {
        Alert.alert(t('error'), 'Receipt view is preparing. Please try again.');
        return;
      }

      const uri = await captureRef(receiptViewRef, {
        format: 'png',
        quality: 1.0,
        result: 'tmpfile',
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          UTI: 'public.png',
          dialogTitle: `Send Bill #${sale.billNumber} to WhatsApp`,
        });
      } else {
        const waUrl = getWhatsAppUrl();
        Linking.openURL(waUrl);
      }
    } catch (e: any) {
      console.warn('Image capture/share error:', e);
      handleSharePDF();
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Direct Image Download (Web and Native)
  const handleDownloadImage = async () => {
    try {
      setIsGeneratingImage(true);

      if (Platform.OS === 'web') {
        const blob = await generateReceiptCanvasBlob();
        if (blob) {
          const downloadUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = `Bill-${sale.billNumber}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);

          try {
            if (navigator.clipboard && (window as any).ClipboardItem) {
              const item = new (window as any).ClipboardItem({ 'image/png': blob });
              await navigator.clipboard.write([item]);
            }
          } catch {
            // Optional
          }

          Alert.alert('Bill Image Saved', `Receipt saved as Bill-${sale.billNumber}.png`);
        } else {
          Alert.alert(t('error'), 'Could not generate receipt image.');
        }
        return;
      }

      // Android / iOS Native:
      if (!receiptViewRef.current) {
        Alert.alert(t('error'), 'Receipt view is preparing. Please try again.');
        return;
      }

      const uri = await captureRef(receiptViewRef, {
        format: 'png',
        quality: 1.0,
        result: 'tmpfile',
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          UTI: 'public.png',
          dialogTitle: `Save Bill #${sale.billNumber}`,
        });
      } else {
        Alert.alert(t('billReceipt'), `Bill image saved: ${uri}`);
      }
    } catch (err) {
      console.warn('Download image error:', err);
      Alert.alert(t('error'), 'Could not save receipt image.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Direct Print
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

  // Direct Thermal Roll Print (58mm / 80mm ESC/POS layout)
  const handlePrintThermal = async () => {
    try {
      const html = generateThermalReceiptHTML('80mm');
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
      console.warn('Thermal print error:', e);
    }
  };

  // Safe 1-Tap Refund & Return Flow
  const handleRefund = () => {
    const isUrdu = language === 'ur';
    showAlert({
      type: 'danger',
      title: isUrdu ? 'بل واپس / ریفنڈ کریں؟' : 'Refund & Return Bill?',
      message: isUrdu
        ? `کیا آپ واقعی بل #${sale.billNumber} واپس کرنا چاہتے ہیں؟ اس سے تمام خریدی گئی اشیاء (${sale.items.length} آئٹمز) واپس دکان کے اسٹاک میں جمع ہو جائیں گی اور گلہ/کھاتہ خودکار درست ہو جائے گا۔`
        : `Are you sure you want to refund Bill #${sale.billNumber}? Sold items (${sale.items.length} items) will be restored to your inventory and customer balance updated.`,
      buttons: [
        {
          text: isUrdu ? 'ہاں، مال واپس لیں (Refund)' : 'Yes, Refund & Restore Stock',
          style: 'destructive',
          icon: 'arrow-undo-outline',
          onPress: async () => {
            const res = await refundSale(sale.id, 'Customer Return via Receipt');
            if (res.success) {
              showAlert({
                type: 'success',
                title: isUrdu ? 'بل کامیابی سے واپس ہو گیا!' : 'Bill Refunded Successfully!',
                message: isUrdu
                  ? 'اشیاء واپس دکان کے اسٹاک میں جمع ہو گئیں اور آج کا حساب اپڈیٹ ہو گیا۔'
                  : 'Items restored to inventory and sales balance updated.',
              });
              onClose();
            } else {
              Alert.alert(t('error'), res.error || 'Failed to refund bill');
            }
          },
        },
        { text: t('cancel'), style: 'cancel' },
      ],
    });
  };

  // Share PDF
  const handleSharePDF = async () => {
    try {
      setIsGeneratingPDF(true);
      const html = generateReceiptHTML();

      if (Platform.OS === 'web') {
        handlePrint();
        return;
      }

      const { uri } = await Print.printToFileAsync({ html });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          UTI: '.pdf',
          mimeType: 'application/pdf',
          dialogTitle: `Share Bill #${sale.billNumber}`,
        });
      } else {
        Alert.alert(t('billReceipt'), `Receipt PDF created: ${uri}`);
      }
    } catch (e) {
      console.warn('PDF export error:', e);
      Alert.alert(t('error'), 'Could not generate PDF bill.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Fallback text share for WhatsApp
  const handleShareWhatsAppText = () => {
    const waUrl = getWhatsAppUrl();
    if (Platform.OS === 'web') {
      window.open(waUrl, '_blank');
    } else {
      Linking.openURL(waUrl).catch(() => {
        Alert.alert(t('error'), 'Could not open WhatsApp.');
      });
    }
  };

  const money = (n: number) => `${settings.currencySymbol}${n.toLocaleString()}`;
  const payLine =
    sale.paymentMethod === 'udhaar'
      ? language === 'ur'
        ? 'ادھار'
        : 'Khata'
      : sale.paymentMethod === 'cash'
        ? language === 'ur'
          ? 'نقد'
          : 'Cash'
        : language === 'ur'
          ? 'آن لائن'
          : 'Online';

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.receiptCard,
            {
              backgroundColor: theme.background,
              height: Math.min(windowHeight * 0.9, 820),
            },
          ]}>
          <View style={styles.modalTopBar}>
            <View style={styles.topTitleWrap}>
              <Text style={[styles.topTitle, { color: theme.text }]}>
                {language === 'ur' ? 'رسید' : 'Receipt'}
              </Text>
              <Text style={[styles.topSubtitle, { color: theme.textMuted }]}>
                #{sale.billNumber}
                {isRefunded
                  ? language === 'ur'
                    ? '  ·  واپس شدہ'
                    : '  ·  Refunded'
                  : ''}
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              style={({ pressed }) => [
                styles.closeBtn,
                { backgroundColor: settings.darkMode ? '#1E293B' : '#E2E8F0' },
                pressed && { opacity: 0.7 },
              ]}>
              <Ionicons name="close" size={20} color={theme.textSecondary} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.receiptScroll}
            contentContainerStyle={styles.receiptPaper}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled>
            <View style={styles.posReceiptShell}>
              <View ref={receiptViewRef} collapsable={false} style={styles.posPaperSheet}>
                {/* 1. Standard POS Centered Store Header */}
                <View style={styles.posStoreHeader}>
                  {settings.profileImage &&
                  !settings.profileImage.includes('googleusercontent.com/a/') ? (
                    <View style={styles.posLogoCircle}>
                      <ProductImage
                        uri={settings.profileImage}
                        style={styles.shopLogo}
                        fallbackSize={20}
                        fallbackColor="#475569"
                      />
                    </View>
                  ) : null}
                  <Text style={styles.posStoreName}>{dynamicShopName}</Text>
                  {dynamicShopUrdu && dynamicShopUrdu !== dynamicShopName ? (
                    <Text style={styles.posStoreUrdu}>{dynamicShopUrdu}</Text>
                  ) : null}
                  {dynamicAddress ? (
                    <Text style={styles.posStoreMeta} numberOfLines={2}>
                      {dynamicAddress}
                    </Text>
                  ) : null}
                  {dynamicPhone ? (
                    <Text style={styles.posStoreMeta}>Tel: {dynamicPhone}</Text>
                  ) : null}
                </View>

                <View style={styles.posDashedRule} />

                {/* 2. POS Key-Value Meta Rows */}
                <View style={styles.posMetaBlock}>
                  <View style={styles.posKvRow}>
                    <Text style={styles.posKvLabel}>
                      {language === 'ur' ? 'بل نمبر' : 'BILL #'}
                    </Text>
                    <Text style={styles.posKvValueMono}>{sale.billNumber}</Text>
                  </View>
                  <View style={styles.posKvRow}>
                    <Text style={styles.posKvLabel}>
                      {language === 'ur' ? 'تاریخ' : 'DATE'}
                    </Text>
                    <Text style={styles.posKvValue}>{formattedDate}</Text>
                  </View>
                  <View style={styles.posKvRow}>
                    <Text style={styles.posKvLabel}>
                      {language === 'ur' ? 'گاہک' : 'CUSTOMER'}
                    </Text>
                    <Text style={styles.posKvValueBold} numberOfLines={1}>
                      {customerDisplayName}
                    </Text>
                  </View>
                  <View style={styles.posKvRow}>
                    <Text style={styles.posKvLabel}>
                      {language === 'ur' ? 'حالت' : 'STATUS'}
                    </Text>
                    <Text
                      style={[
                        styles.posKvStatus,
                        {
                          color: isRefunded
                            ? '#64748B'
                            : sale.paymentMethod === 'udhaar'
                              ? '#DC2626'
                              : sale.paymentMethod === 'online'
                                ? '#0284C7'
                                : '#059669',
                        },
                      ]}>
                      {isRefunded ? (language === 'ur' ? 'واپس شدہ' : 'REFUNDED') : payLine.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.posDashedRule} />

                {/* 3. POS Table Header */}
                <View style={styles.posTableHead}>
                  <Text style={[styles.posThText, { flex: 1 }]}>
                    {language === 'ur' ? 'آئٹم' : 'ITEM'}
                  </Text>
                  <Text style={[styles.posThText, styles.posColQty]}>
                    {language === 'ur' ? 'تعداد' : 'QTY'}
                  </Text>
                  <Text style={[styles.posThText, styles.posColAmt]}>
                    {language === 'ur' ? 'رقم' : 'AMT'}
                  </Text>
                </View>

                <View style={styles.posThinRule} />

                {/* 4. POS Line Items */}
                {sale.items.map((it, idx) => (
                  <View key={idx} style={styles.posItemRow}>
                    <View style={{ flex: 1, paddingRight: 6 }}>
                      <Text style={styles.posItemName} numberOfLines={2}>
                        {it.product.name}
                      </Text>
                      {it.quantity > 1 ? (
                        <Text style={styles.posItemUnitPrice}>
                          @{money(it.unitPrice)}
                        </Text>
                      ) : null}
                    </View>
                    <Text style={[styles.posItemQty, styles.posColQty]}>
                      ×{it.quantity}
                    </Text>
                    <Text style={[styles.posItemAmt, styles.posColAmt]}>
                      {money(it.total)}
                    </Text>
                  </View>
                ))}

                <View style={styles.posDoubleRule} />

                {/* 5. POS Totals Block */}
                {sale.discount > 0 ? (
                  <>
                    <View style={styles.posKvRow}>
                      <Text style={styles.posKvLabel}>
                        {language === 'ur' ? 'سب ٹوٹل' : 'SUBTOTAL'}
                      </Text>
                      <Text style={styles.posKvValueMono}>{money(sale.subtotal)}</Text>
                    </View>
                    <View style={styles.posKvRow}>
                      <Text style={styles.posKvLabel}>
                        {language === 'ur' ? 'رعایت' : 'DISCOUNT'}
                      </Text>
                      <Text style={styles.posKvValueMono}>-{money(sale.discount)}</Text>
                    </View>
                  </>
                ) : null}

                <View style={styles.posGrandTotalRow}>
                  <Text style={styles.posGrandTotalLabel}>
                    {language === 'ur' ? 'کل رقم' : 'TOTAL'}
                  </Text>
                  <Text style={styles.posGrandTotalVal}>{money(sale.grandTotal)}</Text>
                </View>

                {sale.paymentMethod === 'udhaar' && cleanPaid > 0 ? (
                  <View style={styles.posKvRow}>
                    <Text style={[styles.posKvLabel, { color: '#059669' }]}>
                      {language === 'ur' ? 'نقد وصول' : 'CASH PAID'}
                    </Text>
                    <Text style={[styles.posKvValueMono, { color: '#059669' }]}>
                      {money(cleanPaid)}
                    </Text>
                  </View>
                ) : null}

                {sale.paymentMethod === 'udhaar' && Math.max(0, sale.grandTotal - cleanPaid) > 0 ? (
                  <View style={styles.posKvRow}>
                    <Text style={[styles.posKvLabel, { color: '#DC2626' }]}>
                      {language === 'ur' ? 'باقی ادھار' : 'UDHAAR DUE'}
                    </Text>
                    <Text style={[styles.posKvValueMono, { color: '#DC2626' }]}>
                      {money(Math.max(0, sale.grandTotal - cleanPaid))}
                    </Text>
                  </View>
                ) : null}

                {sale.change && sale.change > 0 ? (
                  <View style={styles.posKvRow}>
                    <Text style={[styles.posKvLabel, { color: '#0284C7' }]}>
                      {language === 'ur' ? 'بقایا واپس' : 'CHANGE'}
                    </Text>
                    <Text style={[styles.posKvValueMono, { color: '#0284C7' }]}>
                      {money(sale.change)}
                    </Text>
                  </View>
                ) : null}

                <View style={styles.posDashedRule} />

                {/* 6. Authentic Barcode + Thank You Footer */}
                <View style={styles.posBarcodeBlock}>
                  <View style={styles.posBarcodeBars}>
                    {Array.from(sale.billNumber || 'INV1001').map((ch, idx) => {
                      const code = ch.charCodeAt(0);
                      return (
                        <React.Fragment key={idx}>
                          <View style={[styles.posBar, { width: (code % 2) + 1.5 }]} />
                          <View style={{ width: 1.5 }} />
                          <View style={[styles.posBar, { width: ((code >> 1) % 2) + 2 }]} />
                          <View style={{ width: 2 }} />
                        </React.Fragment>
                      );
                    })}
                  </View>
                  <Text style={styles.posBarcodeCaption}>{sale.billNumber}</Text>
                </View>

                <Text style={styles.posFooterThankYou}>
                  {language === 'ur'
                    ? settings.footerNoteUrdu || 'خریداری کا شکریہ!'
                    : settings.footerNote || 'Thank you for shopping!'}
                </Text>
                {driveSaved ? (
                  <Text style={styles.driveLine}>
                    {language === 'ur' ? 'گوگل ڈرائیو میں محفوظ' : 'Backed up to Drive'}
                  </Text>
                ) : null}
              </View>

              {/* Serrated Thermal Paper Bottom Edge */}
              <View style={styles.posSawtoothRow}>
                {Array.from({ length: 28 }).map((_, i) => (
                  <View key={i} style={styles.posSawtoothTooth} />
                ))}
              </View>
            </View>
          </ScrollView>

          <View
            style={[
              styles.actionButtonsWrap,
              {
                borderTopColor: theme.border,
                paddingBottom: Math.max(insets.bottom, 14),
              },
            ]}>
            {/* Primary Actions Row */}
            <View style={styles.actionRow}>
              <Pressable
                onPress={handleShareWhatsAppImage}
                disabled={isGeneratingImage}
                style={({ pressed }) => [
                  styles.actionBtnPrimaryMain,
                  { backgroundColor: '#059669' },
                  pressed && { opacity: 0.88 },
                ]}>
                {isGeneratingImage ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />
                    <Text style={styles.actionBtnTextWhite}>
                      {language === 'ur' ? 'واٹس ایپ' : 'WhatsApp'}
                    </Text>
                  </>
                )}
              </Pressable>

              <Pressable
                onPress={handleDownloadImage}
                disabled={isGeneratingImage}
                style={({ pressed }) => [
                  styles.actionBtnSecondarySoft,
                  {
                    backgroundColor: settings.darkMode ? 'rgba(56,189,248,0.16)' : '#EFF6FF',
                  },
                  pressed && { opacity: 0.82 },
                ]}>
                <Ionicons
                  name="image-outline"
                  size={17}
                  color={settings.darkMode ? '#38BDF8' : '#0284C7'}
                />
                <Text
                  style={[
                    styles.actionBtnSoftText,
                    { color: settings.darkMode ? '#38BDF8' : '#0284C7' },
                  ]}
                  numberOfLines={1}>
                  {language === 'ur' ? 'تصویر' : 'Save'}
                </Text>
              </Pressable>

              <Pressable
                onPress={handlePrint}
                style={({ pressed }) => [
                  styles.actionBtnSecondarySoft,
                  {
                    backgroundColor: settings.darkMode ? 'rgba(56,189,248,0.16)' : '#EFF6FF',
                  },
                  pressed && { opacity: 0.82 },
                ]}>
                <Ionicons
                  name="print-outline"
                  size={17}
                  color={settings.darkMode ? '#38BDF8' : '#0284C7'}
                />
                <Text
                  style={[
                    styles.actionBtnSoftText,
                    { color: settings.darkMode ? '#38BDF8' : '#0284C7' },
                  ]}
                  numberOfLines={1}>
                  {language === 'ur' ? 'پرنٹ' : 'Print'}
                </Text>
              </Pressable>
            </View>

            {/* Compact Secondary Utilities Strip */}
            <View style={styles.actionRow}>
              <Pressable
                onPress={handleShareWhatsAppText}
                style={({ pressed }) => [
                  styles.actionBtnUtility,
                  { backgroundColor: theme.surfaceSubtle },
                  pressed && { opacity: 0.8 },
                ]}>
                <Ionicons name="chatbubble-ellipses-outline" size={14} color={theme.textSecondary} />
                <Text style={[styles.actionBtnUtilityText, { color: theme.textSecondary }]} numberOfLines={1}>
                  {language === 'ur' ? 'ٹیکسٹ' : 'Text'}
                </Text>
              </Pressable>

              <Pressable
                onPress={handlePrintThermal}
                style={({ pressed }) => [
                  styles.actionBtnUtility,
                  { backgroundColor: theme.surfaceSubtle },
                  pressed && { opacity: 0.8 },
                ]}>
                <Ionicons name="receipt-outline" size={14} color={theme.textSecondary} />
                <Text style={[styles.actionBtnUtilityText, { color: theme.textSecondary }]} numberOfLines={1}>
                  {language === 'ur' ? 'تھرمل' : 'Thermal'}
                </Text>
              </Pressable>

              <Pressable
                onPress={handleSharePDF}
                disabled={isGeneratingPDF}
                style={({ pressed }) => [
                  styles.actionBtnUtility,
                  { backgroundColor: theme.surfaceSubtle },
                  pressed && { opacity: 0.8 },
                ]}>
                {isGeneratingPDF ? (
                  <ActivityIndicator size="small" color={theme.textSecondary} />
                ) : (
                  <>
                    <Ionicons name="document-text-outline" size={14} color={theme.textSecondary} />
                    <Text style={[styles.actionBtnUtilityText, { color: theme.textSecondary }]} numberOfLines={1}>
                      PDF
                    </Text>
                  </>
                )}
              </Pressable>

              {!isRefunded ? (
                <Pressable
                  onPress={handleRefund}
                  style={({ pressed }) => [
                    styles.actionBtnUtility,
                    {
                      backgroundColor: settings.darkMode ? 'rgba(239,68,68,0.18)' : '#FEE2E2',
                    },
                    pressed && { opacity: 0.82 },
                  ]}>
                  <Ionicons name="return-down-back" size={14} color={theme.danger} />
                  <Text style={[styles.actionBtnUtilityText, { color: theme.danger }]} numberOfLines={1}>
                    {language === 'ur' ? 'واپس' : 'Refund'}
                  </Text>
                </Pressable>
              ) : (
                <View style={[styles.actionBtnUtility, { backgroundColor: theme.surfaceSubtle }]}>
                  <Text style={[styles.actionBtnUtilityText, { color: theme.textMuted }]}>
                    {language === 'ur' ? 'واپس شدہ' : 'Refunded'}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Web WhatsApp Instructions Card */}
          {showWebWhatsAppNotice && (
            <View style={styles.webNoticeOverlay}>
              <View style={styles.webNoticeCard}>
                <View style={styles.webNoticeHeader}>
                  <Ionicons name="checkmark-circle" size={32} color="#006837" />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.webNoticeTitle}>Bill Image Ready! / بل کی تصویر تیار ہے</Text>
                    <Text style={styles.webNoticeSubtitle}>Copied to your clipboard & saved to Downloads</Text>
                  </View>
                  <Pressable onPress={() => setShowWebWhatsAppNotice(false)} style={styles.webNoticeCloseIcon}>
                    <Ionicons name="close" size={20} color="#64748B" />
                  </Pressable>
                </View>

                <View style={styles.webNoticeSteps}>
                  <View style={styles.stepRow}>
                    <View style={styles.stepNum}><Text style={styles.stepNumText}>1</Text></View>
                    <Text style={styles.stepText}>WhatsApp Web is open in your other tab.</Text>
                  </View>
                  <View style={styles.stepRow}>
                    <View style={[styles.stepNum, { backgroundColor: '#006837' }]}><Text style={styles.stepNumText}>2</Text></View>
                    <Text style={styles.stepText}>
                      In WhatsApp chat, simply press <Text style={styles.stepHighlight}>Ctrl + V</Text> (or right-click → Paste) to send the green receipt image!
                    </Text>
                  </View>
                  <View style={styles.stepRow}>
                    <View style={styles.stepNum}><Text style={styles.stepNumText}>3</Text></View>
                    <Text style={styles.stepText}>Or drag the downloaded file (<Text style={{ fontWeight: 'bold' }}>Bill-{sale.billNumber}.png</Text>) into the chat.</Text>
                  </View>
                </View>

                <View style={styles.webNoticeActions}>
                  <Pressable
                    onPress={() => {
                      if (typeof window !== 'undefined') {
                        window.open(getWhatsAppUrl(true), '_blank');
                      }
                    }}
                    style={styles.webNoticeOpenBtn}>
                    <Ionicons name="logo-whatsapp" size={17} color="#FFFFFF" />
                    <Text style={styles.webNoticeOpenText}>Open WhatsApp Web</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setShowWebWhatsAppNotice(false)}
                    style={styles.webNoticeDismissBtn}>
                    <Text style={styles.webNoticeDismissText}>Got it / ٹھیک ہے</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  receiptCard: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  modalTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: 16,
    paddingBottom: 10,
  },
  topTitleWrap: {
    flex: 1,
    gap: 2,
  },
  topTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  topSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiptScroll: {
    flex: 1,
    minHeight: 220,
  },
  receiptPaper: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 16,
    gap: 12,
    flexGrow: 1,
  },
  itemPreviewBlock: {
    gap: 8,
  },
  itemPreviewLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  itemPreviewRow: {
    gap: 10,
    paddingRight: 4,
  },
  itemPreviewCard: {
    width: 76,
    gap: 4,
  },
  itemPreviewThumb: {
    width: 76,
    height: 76,
    borderRadius: 16,
    borderCurve: 'continuous',
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemPreviewImage: {
    width: '100%',
    height: '100%',
  },
  itemPreviewName: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 15,
  },
  itemPreviewMeta: {
    fontSize: 11,
    fontWeight: '500',
  },
  paperInner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderCurve: 'continuous',
    padding: 18,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
  },
  letterhead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  shopLogoWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderCurve: 'continuous',
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopLogo: {
    width: '100%',
    height: '100%',
  },
  shopLogoInitials: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.4,
  },
  letterheadText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  previewStoreTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.3,
  },
  previewStoreUrdu: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  softRule: {
    height: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.28)',
    marginVertical: 8,
  },
  refundLine: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
  posReceiptShell: {
    width: '100%',
    maxWidth: 380,
    alignSelf: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  posPaperSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#E2E8F0',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
  },
  posStoreHeader: {
    alignItems: 'center',
    gap: 2,
  },
  posLogoCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  posStoreName: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.4,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  posStoreUrdu: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
  },
  posStoreMeta: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
  },
  posDashedRule: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#94A3B8',
    marginVertical: 10,
  },
  posThinRule: {
    height: 1,
    backgroundColor: '#CBD5E1',
    marginVertical: 5,
  },
  posDoubleRule: {
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: '#0F172A',
    height: 4,
    marginVertical: 10,
  },
  posMetaBlock: {
    gap: 4,
  },
  posKvRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginVertical: 1,
  },
  posKvLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.4,
  },
  posKvValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'right',
    flexShrink: 1,
  },
  posKvValueBold: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'right',
    flexShrink: 1,
  },
  posKvValueMono: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace', default: 'monospace' }),
    fontVariant: ['tabular-nums'],
  },
  posKvStatus: {
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  posTableHead: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  posThText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.7,
  },
  posColQty: {
    width: 46,
    textAlign: 'center',
  },
  posColAmt: {
    width: 78,
    textAlign: 'right',
  },
  posItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 5,
  },
  posItemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    lineHeight: 17,
  },
  posItemUnitPrice: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
    fontVariant: ['tabular-nums'],
  },
  posItemQty: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace', default: 'monospace' }),
  },
  posItemAmt: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace', default: 'monospace' }),
    fontVariant: ['tabular-nums'],
  },
  posGrandTotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  posGrandTotalLabel: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  posGrandTotalVal: {
    fontSize: 19,
    fontWeight: '900',
    color: '#0F172A',
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace', default: 'monospace' }),
    fontVariant: ['tabular-nums'],
  },
  posBarcodeBlock: {
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 8,
  },
  posBarcodeBars: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
  },
  posBar: {
    height: 28,
    backgroundColor: '#0F172A',
  },
  posBarcodeCaption: {
    marginTop: 3,
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.8,
    color: '#334155',
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace', default: 'monospace' }),
  },
  posFooterThankYou: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
  posSawtoothRow: {
    flexDirection: 'row',
    width: '100%',
    height: 10,
    overflow: 'hidden',
  },
  posSawtoothTooth: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
  },
  metaLine: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#64748B',
  },
  cleanMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  metaCustomerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  statusChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  driveLine: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
    marginTop: 4,
    textAlign: 'center',
  },
  previewItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 5,
  },
  itemQtyInline: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  itemTotalBold: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    fontVariant: ['tabular-nums'],
  },
  actionBtnSoftText: {
    fontSize: 13,
    fontWeight: '700',
  },
  previewTaglineEn: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '600',
    marginTop: 3,
    textAlign: 'center',
  },
  previewTaglineUr: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '700',
    textAlign: 'center',
  },
  previewGreenDivider: {
    height: 2,
    backgroundColor: '#006837',
    marginVertical: 12,
  },
  driveStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  driveStatusText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#065F46',
  },
  previewMetaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  metaColLeft: { flex: 1.1, gap: 3 },
  metaColCenter: { flex: 1.3, gap: 3, paddingHorizontal: 4 },
  metaColRight: { flex: 0.8, alignItems: 'center', justifyContent: 'center' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, color: '#374151' },
  metaSubText: { fontSize: 10, color: '#6B7280' },
  boldText: { fontWeight: '700', color: '#111827' },
  barcodeLinesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 26,
  },
  barcodeBar: {
    height: 26,
    backgroundColor: '#111827',
  },
  barcodeSpace: {
    height: 26,
    backgroundColor: 'transparent',
  },
  barcodeText: { fontSize: 10, fontWeight: '700', letterSpacing: 1, color: '#111827', marginTop: 2 },
  previewTableHead: {
    flexDirection: 'row',
    backgroundColor: '#006837',
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  tableCol: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  previewTableRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  rowTextBold: { fontSize: 12, fontWeight: '800', color: '#111827' },
  rowText: { fontSize: 11, fontWeight: '600', color: '#374151' },
  itemNameBold: { fontSize: 14, fontWeight: '700', color: '#111827', letterSpacing: -0.2 },
  itemNameUrdu: { fontSize: 11, color: '#4B5563' },
  itemUnitSubtitle: { fontSize: 10, color: '#9CA3AF' },
  previewCalcSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 14,
  },
  watermarkBox: {
    paddingLeft: 10,
  },
  previewCalcBox: {
    backgroundColor: '#EEF8F2',
    borderWidth: 1,
    borderColor: '#D1FAE5',
    borderRadius: 8,
    padding: 10,
    width: 230,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 2,
  },
  calcLabel: { fontSize: 11, color: '#374151' },
  calcLabelBold: { fontSize: 11, fontWeight: '700', color: '#111827' },
  calcValBold: { fontSize: 12, fontWeight: '800', color: '#111827' },
  calcMethod: { fontSize: 10, color: '#6B7280' },
  boxDivider: { height: 1, backgroundColor: '#D1FAE5', marginVertical: 4 },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 3,
  },
  grandTotalLabel: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  grandTotalVal: { fontSize: 20, fontWeight: '800', color: '#0F172A', letterSpacing: -0.4 },
  previewFooterNotes: {
    alignItems: 'center',
    marginVertical: 10,
    gap: 2,
  },
  footerUrduText: { fontSize: 13, fontWeight: '800', color: '#111827' },
  footerEngText: { fontSize: 12, color: '#64748B', marginTop: 8, textAlign: 'center' },
  heartRow: { fontSize: 11, color: '#006837', marginTop: 2 },
  previewBottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  waContactRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  waCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#006837',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waSub: { fontSize: 9, color: '#4B5563' },
  waNum: { fontSize: 12, fontWeight: '800', color: '#111827' },
  shopLocalWrap: { alignItems: 'flex-end' },
  shopLocalText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#006837',
    fontStyle: 'italic',
  },
  sawtoothStrip: {
    flexDirection: 'row',
    height: 14,
    width: '100%',
    backgroundColor: '#006837',
    overflow: 'hidden',
    marginTop: 6,
  },
  sawtoothTooth: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
  },
  actionButtonsWrap: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 10,
    paddingBottom: 16,
    gap: 8,
    borderTopWidth: 1,
    flexShrink: 0,
  },
  // Each row of buttons
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtnPrimaryMain: {
    flex: 1.45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    minHeight: 46,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderCurve: 'continuous',
  },
  actionBtnSecondarySoft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    minHeight: 46,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderCurve: 'continuous',
  },
  actionBtnUtility: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: 38,
    paddingHorizontal: 6,
    borderRadius: 11,
    borderCurve: 'continuous',
  },
  actionBtnUtilityText: {
    fontSize: 12,
    fontWeight: '700',
  },
  // Full-width button (Row 1 hero)
  actionBtnFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 46,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderCurve: 'continuous',
  },
  actionBtnHalf: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    minHeight: 42,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderCurve: 'continuous',
  },
  // Legacy aliases kept for safety
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.lg,
    flex: 1,
  },
  actionBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.lg,
    flex: 1.6,
  },
  actionBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 11,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.lg,
    flex: 1,
  },
  whatsappBtn: {
    backgroundColor: '#25D366',
  },
  whatsappTextBtn: {
    backgroundColor: '#EEF8F2',
    borderWidth: 1.5,
    borderColor: '#006837',
  },
  whatsappTextBtnLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#006837',
  },
  imageDownloadBtn: {
    backgroundColor: '#0F766E',
  },
  pdfShareBtn: {
    backgroundColor: '#006837',
  },
  printBtn: {
    backgroundColor: '#1E293B',
  },
  actionBtnThird: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: BorderRadius.lg,
    flex: 1,
  },
  thermalBtn: {
    backgroundColor: '#0F766E',
  },
  refundBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.lg,
    backgroundColor: '#FEE2E2',
    borderWidth: 1.5,
    borderColor: '#DC2626',
    flex: 1,
  },
  refundBtnText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '800',
  },
  refundBtnHalf: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1.5,
    borderColor: '#DC2626',
  },
  refundBtnHalfText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '800',
  },
  alreadyRefundedHalf: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  alreadyRefundedHalfText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
  },
  alreadyRefundedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.lg,
    backgroundColor: '#FEE2E2',
    flex: 1,
  },
  alreadyRefundedText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
  },
  refundedWatermarkBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEE2E2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.md,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  refundedWatermarkText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '800',
  },
  doneBtn: {
    flex: 0.6,
    minWidth: 60,
  },
  actionBtnTextWhite: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  doneBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  webNoticeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    zIndex: 999,
  },
  webNoticeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl,
    padding: 20,
    maxWidth: 460,
    width: '100%',
    ...Shadows.lg,
  },
  webNoticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  webNoticeTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#111827',
  },
  webNoticeSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  webNoticeCloseIcon: {
    padding: 4,
  },
  webNoticeSteps: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  stepNum: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#64748B',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 12,
    color: '#1E293B',
    flex: 1,
    lineHeight: 18,
  },
  stepHighlight: {
    fontWeight: '900',
    color: '#006837',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 4,
    borderRadius: 3,
  },
  webNoticeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  webNoticeOpenBtn: {
    flex: 1,
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 8,
  },
  webNoticeOpenText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  webNoticeDismissBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
  webNoticeDismissText: {
    color: '#334155',
    fontWeight: '700',
    fontSize: 12,
  },
});
