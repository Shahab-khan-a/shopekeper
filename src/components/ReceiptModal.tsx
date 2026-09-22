import React, { useState, useRef, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { Sale } from '@/types';
import { useShop } from '@/context/ShopContext';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { googleDriveService } from '@/services/googleDriveService';

interface ReceiptModalProps {
  sale: Sale | null;
  visible: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ sale, visible, onClose }) => {
  const { settings, language, t, user } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const receiptViewRef = useRef<View>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showWebWhatsAppNotice, setShowWebWhatsAppNotice] = useState(false);
  const [isDriveConnected, setIsDriveConnected] = useState(false);

  useEffect(() => {
    if (visible) {
      googleDriveService.isConnected().then(setIsDriveConnected).catch(() => {});
    }
  }, [visible]);

  if (!sale) return null;

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

  const paymentLabel =
    sale.paymentMethod === 'udhaar'
      ? '(Udhaar / Credit)'
      : sale.paymentMethod === 'cash'
      ? '(Cash / نقد)'
      : '(Online / آن لائن)';

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
            ${
              it.product.nameUrdu
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
                ${
                  sale.discount > 0
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

    const paymentText =
      sale.paymentMethod === 'cash'
        ? 'نقد (Cash)'
        : sale.paymentMethod === 'online'
        ? 'آن لائن (Online)'
        : 'ادھار (Udhaar / Credit)';

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
ادائیگی کا طریقہ (Payment): ${paymentText}
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

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.receiptCard, { backgroundColor: theme.surface }]}>
          {/* Header Close Bar */}
          <View style={[styles.modalTopBar, { borderBottomColor: theme.border }]}>
            <View style={styles.topBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#006837" />
              <Text style={styles.topBadgeText}>{t('saleCompleted')}</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={theme.textSecondary} />
            </Pressable>
          </View>

          {/* On-screen Preview matching the exact design & capturable as image */}
          <ScrollView
            style={styles.receiptScroll}
            contentContainerStyle={styles.receiptPaper}
            showsVerticalScrollIndicator={false}>
            <View
              ref={receiptViewRef}
              collapsable={false}
              style={styles.paperInner}>
              {/* Header */}
              <View style={styles.previewHeader}>
                <View style={styles.cartIconCircle}>
                  <Ionicons name="cart" size={32} color="#006837" />
                </View>
                <View style={styles.headerTextWrap}>
                  <Text style={styles.previewStoreTitle}>{dynamicShopName}</Text>
                  <Text style={styles.previewStoreUrdu}>{dynamicShopUrdu}</Text>
                  <Text style={styles.previewTaglineEn}>Fresh Products • Better Prices • Your Trusted Shop</Text>
                  <Text style={styles.previewTaglineUr}>تازہ اشیاء • مناسب قیمت • آپ کا بھروسہ</Text>
                </View>
              </View>

              {/* Green Divider */}
              <View style={styles.previewGreenDivider} />

              {/* 5 TB Google Drive Auto-Saved Indicator */}
              {isDriveConnected && (
                <View style={styles.driveStatusRow}>
                  <Ionicons name="cloud-done" size={13} color="#059669" />
                  <Text style={styles.driveStatusText}>
                    {language === 'ur'
                      ? '✓ گوگل ڈرائیو میں خودکار محفوظ (5 TB کلاؤڈ)'
                      : '✓ Auto-Saved to Google Drive (5 TB Cloud)'}
                  </Text>
                </View>
              )}

              {/* Bill & Store Metadata */}
              <View style={styles.previewMetaGrid}>
                <View style={styles.metaColLeft}>
                  <View style={styles.metaRow}>
                    <Ionicons name="document-text" size={14} color="#006837" />
                    <Text style={styles.metaText}>
                      <Text style={styles.boldText}>Bill #: </Text>{sale.billNumber}
                    </Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Ionicons name="calendar" size={14} color="#006837" />
                    <Text style={styles.metaText}>{formattedDate}</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Ionicons name="person" size={14} color="#006837" />
                    <Text style={styles.metaText}>
                      <Text style={styles.boldText}>Customer: </Text>{customerDisplayName}
                    </Text>
                  </View>
                </View>

                <View style={styles.metaColCenter}>
                  <View style={styles.metaRow}>
                    <Ionicons name="location" size={14} color="#006837" />
                    <View>
                      <Text style={[styles.metaText, styles.boldText]}>{dynamicShopName}</Text>
                      {dynamicAddress ? (
                        <Text style={styles.metaSubText} numberOfLines={2}>{dynamicAddress}</Text>
                      ) : null}
                    </View>
                  </View>
                  {dynamicPhone ? (
                    <View style={styles.metaRow}>
                      <Ionicons name="call" size={14} color="#006837" />
                      <Text style={styles.metaText}>{dynamicPhone}</Text>
                    </View>
                  ) : null}
                </View>

                <View style={styles.metaColRight}>
                  {/* High-fidelity Barcode Stripes */}
                  <View style={styles.barcodeLinesRow}>
                    {sale.billNumber.split('').map((char, i) => {
                      const code = char.charCodeAt(0);
                      return (
                        <React.Fragment key={i}>
                          <View style={[styles.barcodeBar, { width: (code % 2) + 1.2 }]} />
                          <View style={[styles.barcodeSpace, { width: 1.5 }]} />
                          <View style={[styles.barcodeBar, { width: ((code >> 1) % 2) + 1.5 }]} />
                          <View style={[styles.barcodeSpace, { width: 2 }]} />
                        </React.Fragment>
                      );
                    })}
                  </View>
                  <Text style={styles.barcodeText}>{sale.billNumber}</Text>
                </View>
              </View>

              {/* Items Table */}
              <View style={styles.previewTableHead}>
                <Text style={[styles.tableCol, { width: '8%', textAlign: 'center' }]}>#</Text>
                <Text style={[styles.tableCol, { width: '44%' }]}>Item / سامان</Text>
                <Text style={[styles.tableCol, { width: '16%', textAlign: 'center' }]}>Qty / مقدار</Text>
                <Text style={[styles.tableCol, { width: '16%', textAlign: 'center' }]}>Rate / قیمت</Text>
                <Text style={[styles.tableCol, { width: '16%', textAlign: 'right' }]}>Total / کل رقم</Text>
              </View>

              {sale.items.map((it, idx) => (
                <View key={idx} style={styles.previewTableRow}>
                  <Text style={[styles.rowTextBold, { width: '8%', textAlign: 'center' }]}>{idx + 1}</Text>
                  <View style={{ width: '44%' }}>
                    <Text style={styles.itemNameBold}>{it.product.name}</Text>
                    {it.product.nameUrdu ? (
                      <Text style={styles.itemNameUrdu}>({it.product.nameUrdu})</Text>
                    ) : null}
                    <Text style={styles.itemUnitSubtitle}>{it.quantity} {it.product.unit}</Text>
                  </View>
                  <Text style={[styles.rowText, { width: '16%', textAlign: 'center' }]}>
                    {it.quantity} {it.product.unit}
                  </Text>
                  <Text style={[styles.rowText, { width: '16%', textAlign: 'center' }]}>
                    Rs.{it.unitPrice}
                  </Text>
                  <Text style={[styles.rowTextBold, { width: '16%', textAlign: 'right' }]}>
                    Rs.{it.total}
                  </Text>
                </View>
              ))}

              {/* Watermark & Calculation Box */}
              <View style={styles.previewCalcSection}>
                <View style={styles.watermarkBox}>
                  <Ionicons name="cart-outline" size={72} color="rgba(0, 104, 55, 0.12)" />
                </View>

                <View style={styles.previewCalcBox}>
                  <View style={styles.calcRow}>
                    <Text style={styles.calcLabel}>Subtotal / سب ٹوٹل</Text>
                    <Text style={styles.calcValBold}>Rs.${sale.subtotal}</Text>
                  </View>
                  {sale.discount > 0 && (
                    <View style={styles.calcRow}>
                      <Text style={[styles.calcLabel, { color: '#DC2626' }]}>Discount / ڈسکاؤنٹ</Text>
                      <Text style={[styles.calcValBold, { color: '#DC2626' }]}>- Rs.${sale.discount}</Text>
                    </View>
                  )}
                  <View style={styles.boxDivider} />
                  <View style={styles.grandTotalRow}>
                    <Text style={styles.grandTotalLabel}>Grand Total / کل رقم</Text>
                    <Text style={styles.grandTotalVal}>Rs.${sale.grandTotal}</Text>
                  </View>
                  <View style={styles.boxDivider} />
                  <View style={styles.calcRow}>
                    <View>
                      <Text style={styles.calcLabelBold}>Payment / ادائیگی کا طریقہ</Text>
                      <Text style={styles.calcMethod}>{paymentLabel}</Text>
                    </View>
                    <Text style={styles.calcValBold}>Rs.${sale.grandTotal}</Text>
                  </View>
                </View>
              </View>

              {/* Greetings */}
              <View style={styles.previewFooterNotes}>
                <Text style={styles.footerUrduText}>
                  — {settings.footerNoteUrdu || 'خریداری کا شکریہ! دوبارہ تشریف لائیں۔'} —
                </Text>
                <Text style={styles.footerEngText}>
                  {settings.footerNote || 'Thank you for shopping with us! Please visit again.'}
                </Text>
                <Text style={styles.heartRow}>— 💚 —</Text>
              </View>

              {/* Bottom WhatsApp & Shop Local */}
              <View style={styles.previewBottomBar}>
                {dynamicPhone ? (
                  <View style={styles.waContactRow}>
                    <View style={styles.waCircle}>
                      <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />
                    </View>
                    <View>
                      <Text style={styles.waSub}>For any queries, contact us on WhatsApp</Text>
                      <Text style={styles.waNum}>{dynamicPhone}</Text>
                    </View>
                  </View>
                ) : (
                  <View />
                )}

                <View style={styles.shopLocalWrap}>
                  <Text style={styles.shopLocalText}>Shop Local</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                    <Text style={styles.shopLocalText}>Support Local</Text>
                    <Ionicons name="leaf" size={14} color="#006837" />
                  </View>
                </View>
              </View>

              {/* Serrated Bottom Edge */}
              <View style={styles.sawtoothStrip}>
                {Array.from({ length: 30 }).map((_, i) => (
                  <View key={i} style={styles.sawtoothTooth} />
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons Bar */}
          <View style={[styles.actionButtonsWrap, { borderTopColor: theme.border }]}>
            {/* Primary: WhatsApp Image Button */}
            <Pressable
              onPress={handleShareWhatsAppImage}
              disabled={isGeneratingImage}
              style={({ pressed }) => [
                styles.actionBtn,
                styles.whatsappBtn,
                pressed && { transform: [{ scale: 0.96 }] },
              ]}>
              {isGeneratingImage ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="logo-whatsapp" size={19} color="#FFFFFF" />
                  <Text style={styles.actionBtnTextWhite}>WhatsApp (Image)</Text>
                </>
              )}
            </Pressable>

            {/* Secondary: WhatsApp Text Button */}
            <Pressable
              onPress={handleShareWhatsAppText}
              style={({ pressed }) => [
                styles.actionBtn,
                styles.whatsappTextBtn,
                pressed && { transform: [{ scale: 0.96 }] },
              ]}>
              <Ionicons name="chatbubble-ellipses-outline" size={16} color="#006837" />
              <Text style={styles.whatsappTextBtnLabel}>WA Text</Text>
            </Pressable>

            {/* Download/Save Image Button */}
            <Pressable
              onPress={handleDownloadImage}
              disabled={isGeneratingImage}
              style={({ pressed }) => [
                styles.actionBtn,
                styles.imageDownloadBtn,
                pressed && { transform: [{ scale: 0.96 }] },
              ]}>
              <Ionicons name="image-outline" size={17} color="#FFFFFF" />
              <Text style={styles.actionBtnTextWhite}>Image</Text>
            </Pressable>

            {/* Share PDF Button */}
            <Pressable
              onPress={handleSharePDF}
              disabled={isGeneratingPDF}
              style={({ pressed }) => [
                styles.actionBtn,
                styles.pdfShareBtn,
                pressed && { transform: [{ scale: 0.96 }] },
              ]}>
              {isGeneratingPDF ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="document-text" size={17} color="#FFFFFF" />
                  <Text style={styles.actionBtnTextWhite}>PDF</Text>
                </>
              )}
            </Pressable>

            {/* Print Button */}
            <Pressable
              onPress={handlePrint}
              style={({ pressed }) => [
                styles.actionBtn,
                styles.printBtn,
                pressed && { transform: [{ scale: 0.96 }] },
              ]}>
              <Ionicons name="print-outline" size={17} color="#FFFFFF" />
              <Text style={styles.actionBtnTextWhite}>{t('printBill')}</Text>
            </Pressable>

            {/* Close Button */}
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
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  receiptCard: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '94%',
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  modalTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  topBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  topBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#006837',
  },
  closeBtn: {
    padding: 4,
    borderRadius: BorderRadius.full,
  },
  receiptScroll: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  receiptPaper: {
    padding: 12,
  },
  paperInner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    paddingBottom: 0,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  previewHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingTop: 4,
  },
  cartIconCircle: {
    position: 'absolute',
    left: 0,
    top: 4,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrap: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  previewStoreTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
    textAlign: 'center',
  },
  previewStoreUrdu: {
    fontSize: 18,
    fontWeight: '800',
    color: '#006837',
    textAlign: 'center',
    marginTop: 1,
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
  itemNameBold: { fontSize: 12, fontWeight: '800', color: '#111827' },
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
  grandTotalLabel: { fontSize: 12, fontWeight: '800', color: '#111827' },
  grandTotalVal: { fontSize: 17, fontWeight: '900', color: '#006837' },
  previewFooterNotes: {
    alignItems: 'center',
    marginVertical: 10,
    gap: 2,
  },
  footerUrduText: { fontSize: 13, fontWeight: '800', color: '#111827' },
  footerEngText: { fontSize: 11, color: '#4B5563' },
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    gap: 8,
    borderTopWidth: 1,
    flexWrap: 'wrap',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.lg,
    flex: 1,
    minWidth: 100,
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
