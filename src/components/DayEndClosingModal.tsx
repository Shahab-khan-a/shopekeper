import React, { useState, useMemo, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Platform,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';
import { DailyClosingRecord, DenominationCounts, Sale } from '@/types';

export const DAILY_CLOSING_STORAGE_KEY = '@shopkeeper_daily_closings';

interface DayEndClosingModalProps {
  visible: boolean;
  onClose: () => void;
  todaySales: Sale[];
  todaySalesTotal: number;
  todayCash: number;
  todayOnline: number;
  todayUdhaar: number;
  todayVasooli: number;
  todayCashOutTotal: number;
  todayNetCashInDrawer: number;
  todayGrossProfit: number;
}

const INITIAL_DENOMINATIONS: DenominationCounts = {
  note5000: 0,
  note1000: 0,
  note500: 0,
  note100: 0,
  note50: 0,
  note20: 0,
  note10: 0,
  coins: 0,
};

export const DayEndClosingModal: React.FC<DayEndClosingModalProps> = ({
  visible,
  onClose,
  todaySales,
  todaySalesTotal,
  todayCash,
  todayOnline,
  todayUdhaar,
  todayVasooli,
  todayCashOutTotal,
  todayNetCashInDrawer,
  todayGrossProfit,
}) => {
  const { settings, language, t, user, showAlert } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const [activeTab, setActiveTab] = useState<'summary' | 'counter' | 'confirm'>('summary');
  const [denominations, setDenominations] = useState<DenominationCounts>(INITIAL_DENOMINATIONS);
  const [closingNotes, setClosingNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  // Reset tab when modal opens
  useEffect(() => {
    if (visible) {
      setActiveTab('summary');
      setHasSaved(false);
    }
  }, [visible]);

  // Calculate live counted cash
  const countedCash = useMemo(() => {
    return (
      (denominations.note5000 || 0) * 5000 +
      (denominations.note1000 || 0) * 1000 +
      (denominations.note500 || 0) * 500 +
      (denominations.note100 || 0) * 100 +
      (denominations.note50 || 0) * 50 +
      (denominations.note20 || 0) * 20 +
      (denominations.note10 || 0) * 10 +
      (denominations.coins || 0)
    );
  }, [denominations]);

  const difference = countedCash - todayNetCashInDrawer;

  const dynamicShopName = settings.shopName || (user?.displayName ? `${user.displayName}'s Store` : 'My Store');
  const dynamicShopUrdu = settings.shopNameUrdu || (user?.displayName ? `${user.displayName} اسٹور` : 'میری دکان');

  const nowFormatted = useMemo(() => {
    return new Date().toLocaleString(language === 'ur' ? 'ur-PK' : 'en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }, [language]);

  // Update denomination count helper
  const updateDenom = (field: keyof DenominationCounts, delta: number) => {
    setDenominations((prev) => {
      const current = prev[field] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [field]: next };
    });
  };

  const setDenomDirect = (field: keyof DenominationCounts, text: string) => {
    const val = parseInt(text.replace(/[^0-9]/g, ''), 10) || 0;
    setDenominations((prev) => ({ ...prev, [field]: val }));
  };

  // Quick auto-match: distributes expected cash into standard Pakistani note bundles
  const handleAutoMatchExpected = () => {
    let rem = todayNetCashInDrawer;
    const next: DenominationCounts = { ...INITIAL_DENOMINATIONS };

    const n5000 = Math.floor(rem / 5000);
    next.note5000 = n5000;
    rem %= 5000;

    const n1000 = Math.floor(rem / 1000);
    next.note1000 = n1000;
    rem %= 1000;

    const n500 = Math.floor(rem / 500);
    next.note500 = n500;
    rem %= 500;

    const n100 = Math.floor(rem / 100);
    next.note100 = n100;
    rem %= 100;

    const n50 = Math.floor(rem / 50);
    next.note50 = n50;
    rem %= 50;

    const n20 = Math.floor(rem / 20);
    next.note20 = n20;
    rem %= 20;

    const n10 = Math.floor(rem / 10);
    next.note10 = n10;
    rem %= 10;

    next.coins = rem;

    setDenominations(next);
  };

  const handleClearAllDenoms = () => {
    setDenominations({ ...INITIAL_DENOMINATIONS });
  };

  // Format WhatsApp daily closing text
  const buildWhatsAppClosingMessage = () => {
    const isUrdu = language === 'ur';
    const statusText =
      difference === 0
        ? '✅ حساب بالکل درست (Zero Difference)'
        : difference > 0
        ? `⚠️ اضافی کیش (Surplus): +${settings.currencySymbol}${difference.toLocaleString()}`
        : `⚠️ نقد میں کمی (Shortage): -${settings.currencySymbol}${Math.abs(difference).toLocaleString()}`;

    const notesSummary = [
      denominations.note5000 ? `• 5000 × ${denominations.note5000} = Rs. ${(denominations.note5000 * 5000).toLocaleString()}` : '',
      denominations.note1000 ? `• 1000 × ${denominations.note1000} = Rs. ${(denominations.note1000 * 1000).toLocaleString()}` : '',
      denominations.note500 ? `• 500 × ${denominations.note500} = Rs. ${(denominations.note500 * 500).toLocaleString()}` : '',
      denominations.note100 ? `• 100 × ${denominations.note100} = Rs. ${(denominations.note100 * 100).toLocaleString()}` : '',
      denominations.note50 ? `• 50 × ${denominations.note50} = Rs. ${(denominations.note50 * 50).toLocaleString()}` : '',
      denominations.note20 ? `• 20 × ${denominations.note20} = Rs. ${(denominations.note20 * 20).toLocaleString()}` : '',
      denominations.note10 ? `• 10 × ${denominations.note10} = Rs. ${(denominations.note10 * 10).toLocaleString()}` : '',
      denominations.coins ? `• سکے / Coins = Rs. ${denominations.coins.toLocaleString()}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    return `
🌙 *${dynamicShopUrdu}*
🏪 *${dynamicShopName}*
📅 *شام کا روزنامچہ / Daily Closing*
⏱️ ${nowFormatted}
---------------------------------
🧾 کل بلز (Total Bills): ${todaySales.length}
💰 کل سیل (Total Sales): ${settings.currencySymbol}${todaySalesTotal.toLocaleString()}
💵 نقد سیل (Cash Sales): ${settings.currencySymbol}${todayCash.toLocaleString()}
📲 آن لائن (Online / Bank): ${settings.currencySymbol}${todayOnline.toLocaleString()}
📒 ادھار دیا (Credit Given): ${settings.currencySymbol}${todayUdhaar.toLocaleString()}
---------------------------------
📥 ادھار وصولی (Vasooli): +${settings.currencySymbol}${todayVasooli.toLocaleString()}
📤 دکان کے اخراجات (Cash Out): -${settings.currencySymbol}${todayCashOutTotal.toLocaleString()}
---------------------------------
🎯 *گلہ میں متوقع کیش: ${settings.currencySymbol}${todayNetCashInDrawer.toLocaleString()}*
🔎 *گنا ہوا نقد کیش: ${settings.currencySymbol}${countedCash.toLocaleString()}*
${statusText}
---------------------------------
💵 *گنتی کی تفصیل (Note Counts):*
${notesSummary || 'کوئی نقد رقم درج نہیں کی گئی'}
${closingNotes ? `\n📝 نوٹ: ${closingNotes}` : ''}
---------------------------------
شکریہ! DigiShop Retail POS System
    `.trim();
  };

  const handleShareWhatsApp = () => {
    const msg = buildWhatsAppClosingMessage();
    const encoded = encodeURIComponent(msg);
    const url = `https://api.whatsapp.com/send?text=${encoded}`;
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url).catch(() => {
        Alert.alert(t('error'), 'Could not open WhatsApp.');
      });
    }
  };

  // Generate Thermal / Standard Closing Report Slip for Printing
  const handlePrintClosingSlip = async () => {
    const isUrdu = language === 'ur';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Daily Closing - ${nowFormatted}</title>
          <style>
            @page { margin: 5mm; size: 80mm auto; }
            body {
              font-family: monospace, -apple-system, sans-serif;
              width: 100%;
              max-width: 320px;
              margin: 0 auto;
              padding: 10px;
              font-size: 13px;
              color: #111;
            }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .line { border-top: 1px dashed #444; margin: 8px 0; }
            .double-line { border-top: 2px solid #111; margin: 8px 0; }
            .row { display: flex; justify-content: space-between; margin: 3px 0; }
            .large { font-size: 16px; font-weight: bold; }
            .hero-box {
              background: #f1f5f9;
              padding: 8px;
              border-radius: 4px;
              margin: 8px 0;
            }
          </style>
        </head>
        <body>
          <div class="center bold large">${dynamicShopName}</div>
          <div class="center">${dynamicShopUrdu}</div>
          <div class="center" style="font-size: 11px; margin-top: 2px;">Daily Cash Register Closing</div>
          <div class="center" style="font-size: 11px;">${nowFormatted}</div>
          
          <div class="double-line"></div>

          <div class="row"><span>Total Bills:</span><span class="bold">${todaySales.length}</span></div>
          <div class="row"><span>Total Sales:</span><span class="bold">Rs. ${todaySalesTotal.toLocaleString()}</span></div>
          <div class="row"><span>• Cash Sales:</span><span>Rs. ${todayCash.toLocaleString()}</span></div>
          <div class="row"><span>• Online:</span><span>Rs. ${todayOnline.toLocaleString()}</span></div>
          <div class="row"><span>• Credit Given:</span><span>Rs. ${todayUdhaar.toLocaleString()}</span></div>

          <div class="line"></div>

          <div class="row"><span>+ Debt Vasooli:</span><span>Rs. ${todayVasooli.toLocaleString()}</span></div>
          <div class="row"><span>- Shop Expenses:</span><span>Rs. ${todayCashOutTotal.toLocaleString()}</span></div>

          <div class="double-line"></div>

          <div class="hero-box">
            <div class="row large">
              <span>Expected Cash:</span>
              <span>Rs. ${todayNetCashInDrawer.toLocaleString()}</span>
            </div>
            <div class="row large" style="margin-top: 6px;">
              <span>Counted Cash:</span>
              <span>Rs. ${countedCash.toLocaleString()}</span>
            </div>
            <div class="line"></div>
            <div class="row bold" style="font-size: 14px;">
              <span>Difference:</span>
              <span>${difference === 0 ? '0 (PERFECT MATCH)' : (difference > 0 ? `+Rs. ${difference} (SURPLUS)` : `-Rs. ${Math.abs(difference)} (SHORTAGE)`)}</span>
            </div>
          </div>

          <div class="bold" style="margin-top: 8px;">Denominations:</div>
          ${denominations.note5000 ? `<div class="row"><span>5000 x ${denominations.note5000}</span><span>Rs. ${(denominations.note5000 * 5000).toLocaleString()}</span></div>` : ''}
          ${denominations.note1000 ? `<div class="row"><span>1000 x ${denominations.note1000}</span><span>Rs. ${(denominations.note1000 * 1000).toLocaleString()}</span></div>` : ''}
          ${denominations.note500 ? `<div class="row"><span>500 x ${denominations.note500}</span><span>Rs. ${(denominations.note500 * 500).toLocaleString()}</span></div>` : ''}
          ${denominations.note100 ? `<div class="row"><span>100 x ${denominations.note100}</span><span>Rs. ${(denominations.note100 * 100).toLocaleString()}</span></div>` : ''}
          ${denominations.note50 ? `<div class="row"><span>50 x ${denominations.note50}</span><span>Rs. ${(denominations.note50 * 50).toLocaleString()}</span></div>` : ''}
          ${denominations.note20 ? `<div class="row"><span>20 x ${denominations.note20}</span><span>Rs. ${(denominations.note20 * 20).toLocaleString()}</span></div>` : ''}
          ${denominations.note10 ? `<div class="row"><span>10 x ${denominations.note10}</span><span>Rs. ${(denominations.note10 * 10).toLocaleString()}</span></div>` : ''}
          ${denominations.coins ? `<div class="row"><span>Coins</span><span>Rs. ${denominations.coins.toLocaleString()}</span></div>` : ''}

          ${closingNotes ? `<div class="line"></div><div><strong>Notes:</strong> ${closingNotes}</div>` : ''}

          <div class="double-line"></div>
          <div class="center" style="font-size: 11px;">DigiShop POS • Closed by: ${settings.ownerName || 'Cashier'}</div>
          <div style="height: 30px;"></div>
        </body>
      </html>
    `;

    try {
      if (Platform.OS === 'web') {
        const pWin = window.open('', '_blank');
        if (pWin) {
          pWin.document.write(html);
          pWin.document.close();
          pWin.focus();
          setTimeout(() => pWin.print(), 300);
        }
      } else {
        await Print.printAsync({ html });
      }
    } catch (e) {
      console.warn('Print closing error:', e);
    }
  };

  // Save closing record to AsyncStorage
  const handleSaveClosing = async () => {
    setIsSaving(true);
    try {
      const record: DailyClosingRecord = {
        id: `close_${Date.now()}`,
        date: new Date().toISOString(),
        timestamp: Date.now(),
        totalBills: todaySales.length,
        totalSales: todaySalesTotal,
        cashSales: todayCash,
        onlineSales: todayOnline,
        udhaarSales: todayUdhaar,
        debtRecovered: todayVasooli,
        shopExpenses: todayCashOutTotal,
        expectedCash: todayNetCashInDrawer,
        countedCash,
        difference,
        denominations,
        notes: closingNotes,
      };

      const existingRaw = await AsyncStorage.getItem(DAILY_CLOSING_STORAGE_KEY);
      const list: DailyClosingRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
      list.unshift(record);
      // Keep up to 60 historical day closures
      await AsyncStorage.setItem(DAILY_CLOSING_STORAGE_KEY, JSON.stringify(list.slice(0, 60)));

      setHasSaved(true);
      showAlert({
        type: 'success',
        title: language === 'ur' ? 'شام کا حساب محفوظ ہو گیا!' : 'Day-End Closing Saved!',
        message:
          language === 'ur'
            ? `گلہ کا حساب کامیابی سے محفوظ کر دیا گیا ہے۔ متوقع رقم: Rs. ${todayNetCashInDrawer.toLocaleString()}، گنا ہوا کیش: Rs. ${countedCash.toLocaleString()}۔`
            : `Cash register closing saved successfully. Expected: Rs. ${todayNetCashInDrawer.toLocaleString()}, Counted: Rs. ${countedCash.toLocaleString()}.`,
      });
    } catch (e) {
      console.error('Failed to save closing:', e);
      Alert.alert(t('error'), 'Could not save day-end closing record.');
    } finally {
      setIsSaving(false);
    }
  };

  const denominationList: {
    key: keyof DenominationCounts;
    val: number;
    labelEn: string;
    labelUr: string;
    color: string;
    bg: string;
  }[] = [
    { key: 'note5000', val: 5000, labelEn: 'Rs. 5,000 Note', labelUr: '5,000 کا نوٹ', color: '#6B21A8', bg: '#F3E8FF' },
    { key: 'note1000', val: 1000, labelEn: 'Rs. 1,000 Note', labelUr: '1,000 کا نوٹ', color: '#1E40AF', bg: '#DBEAFE' },
    { key: 'note500', val: 500, labelEn: 'Rs. 500 Note', labelUr: '500 کا نوٹ', color: '#065F46', bg: '#D1FAE5' },
    { key: 'note100', val: 100, labelEn: 'Rs. 100 Note', labelUr: '100 کا نوٹ', color: '#991B1B', bg: '#FEE2E2' },
    { key: 'note50', val: 50, labelEn: 'Rs. 50 Note', labelUr: '50 کا نوٹ', color: '#4C1D95', bg: '#EDE9FE' },
    { key: 'note20', val: 20, labelEn: 'Rs. 20 Note', labelUr: '20 کا نوٹ', color: '#9A3412', bg: '#FFEDD5' },
    { key: 'note10', val: 10, labelEn: 'Rs. 10 Note', labelUr: '10 کا نوٹ', color: '#047857', bg: '#CCFBF1' },
    { key: 'coins', val: 1, labelEn: 'Coins / سکے (Rs)', labelUr: 'متفرق سکے (روپے)', color: '#475569', bg: '#F1F5F9' },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.surface }]}>
          {/* Header Bar */}
          <View style={[styles.modalHeader, { backgroundColor: '#064E3B' }]}>
            <View style={styles.headerLeft}>
              <View style={styles.moonCircle}>
                <Ionicons name="moon" size={20} color="#FBBF24" />
              </View>
              <View>
                <Text style={styles.headerTitle}>
                  {language === 'ur' ? 'شام کا حساب و گلہ کی تصدیق' : 'Day-End Cash Drawer Tally'}
                </Text>
                <Text style={styles.headerSubtitle}>
                  {dynamicShopName} • {nowFormatted}
                </Text>
              </View>
            </View>

            <Pressable onPress={onClose} hitSlop={10} style={styles.headerCloseBtn}>
              <Ionicons name="close" size={22} color="#FFFFFF" />
            </Pressable>
          </View>

          {/* Navigation Step Tabs */}
          <View style={[styles.tabBar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
            <Pressable
              onPress={() => setActiveTab('summary')}
              style={[styles.tabItem, activeTab === 'summary' && styles.tabItemActive]}>
              <Ionicons
                name="calculator-outline"
                size={16}
                color={activeTab === 'summary' ? '#059669' : theme.textMuted}
              />
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'summary' ? '#059669' : theme.textMuted },
                  activeTab === 'summary' && styles.tabTextBold,
                ]}>
                {language === 'ur' ? '1. خلاصہ حساب' : '1. Summary'}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('counter')}
              style={[styles.tabItem, activeTab === 'counter' && styles.tabItemActive]}>
              <Ionicons
                name="cash-outline"
                size={16}
                color={activeTab === 'counter' ? '#059669' : theme.textMuted}
              />
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'counter' ? '#059669' : theme.textMuted },
                  activeTab === 'counter' && styles.tabTextBold,
                ]}>
                {language === 'ur' ? '2. نقد گنتی' : '2. Count Cash'}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('confirm')}
              style={[styles.tabItem, activeTab === 'confirm' && styles.tabItemActive]}>
              <Ionicons
                name="checkmark-done-circle-outline"
                size={16}
                color={activeTab === 'confirm' ? '#059669' : theme.textMuted}
              />
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'confirm' ? '#059669' : theme.textMuted },
                  activeTab === 'confirm' && styles.tabTextBold,
                ]}>
                {language === 'ur' ? '3. تصدیق و رپورٹ' : '3. Final Tally'}
              </Text>
            </Pressable>
          </View>

          {/* Tab Content Body */}
          <ScrollView
            style={styles.modalBody}
            contentContainerStyle={styles.bodyContent}
            showsVerticalScrollIndicator={false}>
            {/* ==================== TAB 1: SUMMARY ==================== */}
            {activeTab === 'summary' && (
              <View style={styles.tabContent}>
                {/* Expected Cash in Drawer Hero Card */}
                <View style={[styles.expectedCashCard, { backgroundColor: '#ECFDF5', borderColor: '#10B981' }]}>
                  <View style={styles.expectedHeaderRow}>
                    <View style={styles.expectedIconCircle}>
                      <Ionicons name="wallet" size={24} color="#059669" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.expectedLabel}>
                        {language === 'ur' ? 'گلہ میں متوقع نقد رقم' : 'Expected Cash in Drawer'}
                      </Text>
                      <Text style={styles.expectedFormulaHint}>
                        {language === 'ur'
                          ? 'نقد سیل + وصولی - دکان کا خرچہ'
                          : 'Cash Sales + Debt Recoveries - Expenses'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.expectedAmount}>
                    {settings.currencySymbol} {todayNetCashInDrawer.toLocaleString()}
                  </Text>
                </View>

                {/* Arithmetic Breakdown Formula Cards */}
                <Text style={[styles.sectionHeading, { color: theme.text }]}>
                  {language === 'ur' ? 'گلہ کے کیش کا حساب کتاب' : 'Cash Register Arithmetic Breakdown'}
                </Text>

                <View style={styles.formulaCardsGrid}>
                  {/* Plus: Cash Sales */}
                  <View style={[styles.formulaCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <View style={[styles.formulaSignCircle, { backgroundColor: '#D1FAE5' }]}>
                      <Ionicons name="add" size={16} color="#059669" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.formulaCardLabel, { color: theme.textSecondary }]}>
                        {language === 'ur' ? 'نقد سیل' : 'Cash Sales'}
                      </Text>
                      <Text style={[styles.formulaCardVal, { color: '#059669' }]}>
                        +{settings.currencySymbol} {todayCash.toLocaleString()}
                      </Text>
                    </View>
                  </View>

                  {/* Plus: Debt Vasooli */}
                  <View style={[styles.formulaCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <View style={[styles.formulaSignCircle, { backgroundColor: '#DBEAFE' }]}>
                      <Ionicons name="arrow-down" size={16} color="#2563EB" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.formulaCardLabel, { color: theme.textSecondary }]}>
                        {language === 'ur' ? 'ادھار وصولی' : 'Debt Vasooli'}
                      </Text>
                      <Text style={[styles.formulaCardVal, { color: '#2563EB' }]}>
                        +{settings.currencySymbol} {todayVasooli.toLocaleString()}
                      </Text>
                    </View>
                  </View>

                  {/* Minus: Shop Expenses */}
                  <View style={[styles.formulaCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <View style={[styles.formulaSignCircle, { backgroundColor: '#FEE2E2' }]}>
                      <Ionicons name="remove" size={16} color="#DC2626" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.formulaCardLabel, { color: theme.textSecondary }]}>
                        {language === 'ur' ? 'دکان کے اخراجات' : 'Shop Expenses'}
                      </Text>
                      <Text style={[styles.formulaCardVal, { color: '#DC2626' }]}>
                        -{settings.currencySymbol} {todayCashOutTotal.toLocaleString()}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Additional Non-Cash Today Overview */}
                <Text style={[styles.sectionHeading, { color: theme.text, marginTop: Spacing.md }]}>
                  {language === 'ur' ? 'آج کی دیگر سرگرمیاں' : 'Other Business Activities Today'}
                </Text>

                <View style={styles.otherGrid}>
                  <View style={[styles.otherCard, { backgroundColor: theme.surfaceSubtle }]}>
                    <Ionicons name="phone-portrait-outline" size={16} color="#4F46E5" />
                    <Text style={[styles.otherLabel, { color: theme.textMuted }]}>
                      {language === 'ur' ? 'آن لائن / بینک' : 'Online / EasyPaisa'}
                    </Text>
                    <Text style={[styles.otherVal, { color: theme.text }]}>
                      {settings.currencySymbol} {todayOnline.toLocaleString()}
                    </Text>
                  </View>

                  <View style={[styles.otherCard, { backgroundColor: theme.surfaceSubtle }]}>
                    <Ionicons name="book-outline" size={16} color="#DC2626" />
                    <Text style={[styles.otherLabel, { color: theme.textMuted }]}>
                      {language === 'ur' ? 'نیا ادھار دیا' : 'Credit Given'}
                    </Text>
                    <Text style={[styles.otherVal, { color: theme.text }]}>
                      {settings.currencySymbol} {todayUdhaar.toLocaleString()}
                    </Text>
                  </View>

                  <View style={[styles.otherCard, { backgroundColor: theme.surfaceSubtle }]}>
                    <Ionicons name="receipt-outline" size={16} color={theme.primary} />
                    <Text style={[styles.otherLabel, { color: theme.textMuted }]}>
                      {language === 'ur' ? 'کل کٹے بلز' : 'Total Bills'}
                    </Text>
                    <Text style={[styles.otherVal, { color: theme.text }]}>
                      {todaySales.length} {language === 'ur' ? 'بل' : 'bills'}
                    </Text>
                  </View>

                  <View style={[styles.otherCard, { backgroundColor: theme.surfaceSubtle }]}>
                    <Ionicons name="trending-up-outline" size={16} color="#059669" />
                    <Text style={[styles.otherLabel, { color: theme.textMuted }]}>
                      {language === 'ur' ? 'مجموعی منافع' : 'Gross Profit'}
                    </Text>
                    <Text style={[styles.otherVal, { color: '#059669' }]}>
                      +{settings.currencySymbol} {Math.max(0, todayGrossProfit).toLocaleString()}
                    </Text>
                  </View>
                </View>

                {/* Primary CTA button to Next Step */}
                <Pressable
                  onPress={() => setActiveTab('counter')}
                  style={({ pressed }) => [
                    styles.primaryCtaBtn,
                    { backgroundColor: '#059669' },
                    pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
                  ]}>
                  <Ionicons name="cash" size={20} color="#FFFFFF" />
                  <Text style={styles.primaryCtaText}>
                    {language === 'ur' ? 'گلہ کے نوٹ گنیں (مرحلہ 2) →' : 'Count Drawer Notes (Step 2) →'}
                  </Text>
                </Pressable>
              </View>
            )}

            {/* ==================== TAB 2: DENOMINATION COUNTER ==================== */}
            {activeTab === 'counter' && (
              <View style={styles.tabContent}>
                {/* Quick Helper Tools */}
                <View style={styles.counterToolsRow}>
                  <Pressable
                    onPress={handleAutoMatchExpected}
                    style={({ pressed }) => [
                      styles.counterToolBtn,
                      { backgroundColor: '#ECFDF5', borderColor: '#10B981' },
                      pressed && { opacity: 0.8 },
                    ]}>
                    <Ionicons name="flash" size={14} color="#059669" />
                    <Text style={[styles.counterToolText, { color: '#059669' }]}>
                      {language === 'ur' ? 'متوقع رقم کے برابر لکھیں' : 'Match Expected Cash'}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={handleClearAllDenoms}
                    style={({ pressed }) => [
                      styles.counterToolBtn,
                      { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
                      pressed && { opacity: 0.8 },
                    ]}>
                    <Ionicons name="refresh-outline" size={14} color={theme.textMuted} />
                    <Text style={[styles.counterToolText, { color: theme.textSecondary }]}>
                      {language === 'ur' ? 'سب صفر کریں' : 'Clear All'}
                    </Text>
                  </Pressable>
                </View>

                {/* Denomination Rows */}
                <View style={styles.denominationsList}>
                  {denominationList.map((item) => {
                    const count = denominations[item.key] || 0;
                    const subtotal = item.key === 'coins' ? count : count * item.val;

                    return (
                      <View
                        key={item.key}
                        style={[
                          styles.denomRow,
                          { backgroundColor: theme.card, borderColor: theme.border },
                          count > 0 && { borderColor: item.color, backgroundColor: item.bg + '15' },
                        ]}>
                        {/* Denom Badge */}
                        <View style={[styles.denomBadge, { backgroundColor: item.bg }]}>
                          <Text style={[styles.denomBadgeText, { color: item.color }]}>
                            {language === 'ur' ? item.labelUr : item.labelEn}
                          </Text>
                        </View>

                        {/* Controls */}
                        {item.key === 'coins' ? (
                          <View style={styles.coinsInputWrap}>
                            <Text style={[styles.currencyPrefix, { color: theme.textMuted }]}>
                              {settings.currencySymbol}
                            </Text>
                            <TextInput
                              value={count > 0 ? String(count) : ''}
                              onChangeText={(t) => setDenomDirect('coins', t)}
                              keyboardType="numeric"
                              placeholder="0"
                              placeholderTextColor={theme.textMuted}
                              style={[styles.coinsInput, { color: theme.text }]}
                            />
                          </View>
                        ) : (
                          <View style={styles.stepperWrap}>
                            <Pressable
                              onPress={() => updateDenom(item.key, -1)}
                              hitSlop={8}
                              style={({ pressed }) => [
                                styles.stepBtn,
                                { backgroundColor: theme.surfaceSubtle },
                                pressed && { opacity: 0.7 },
                              ]}>
                              <Ionicons name="remove" size={16} color={theme.text} />
                            </Pressable>

                            <TextInput
                              value={count > 0 ? String(count) : ''}
                              onChangeText={(t) => setDenomDirect(item.key, t)}
                              keyboardType="numeric"
                              placeholder="0"
                              placeholderTextColor={theme.textMuted}
                              style={[styles.denomCountInput, { color: theme.text }]}
                            />

                            <Pressable
                              onPress={() => updateDenom(item.key, 1)}
                              hitSlop={8}
                              style={({ pressed }) => [
                                styles.stepBtn,
                                { backgroundColor: theme.surfaceSubtle },
                                pressed && { opacity: 0.7 },
                              ]}>
                              <Ionicons name="add" size={16} color={theme.text} />
                            </Pressable>
                          </View>
                        )}

                        {/* Subtotal */}
                        <View style={styles.denomSubtotalCol}>
                          <Text style={[styles.denomSubtotalVal, { color: item.color }]}>
                            {settings.currencySymbol} {subtotal.toLocaleString()}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>

                {/* Primary CTA button to Step 3 */}
                <Pressable
                  onPress={() => setActiveTab('confirm')}
                  style={({ pressed }) => [
                    styles.primaryCtaBtn,
                    { backgroundColor: '#059669', marginTop: Spacing.md },
                    pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
                  ]}>
                  <Ionicons name="checkmark-done-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.primaryCtaText}>
                    {language === 'ur' ? 'حساب کی تصدیق کریں (مرحلہ 3) →' : 'Verify & Complete (Step 3) →'}
                  </Text>
                </Pressable>
              </View>
            )}

            {/* ==================== TAB 3: CONFIRM & REPORT ==================== */}
            {activeTab === 'confirm' && (
              <View style={styles.tabContent}>
                {/* Comparison Result Banner */}
                {difference === 0 ? (
                  <View style={[styles.resultBanner, { backgroundColor: '#ECFDF5', borderColor: '#10B981' }]}>
                    <View style={styles.bannerIconCircleGreen}>
                      <Ionicons name="checkmark-circle" size={32} color="#059669" />
                    </View>
                    <Text style={styles.bannerTitleGreen}>
                      {language === 'ur' ? 'مبارک ہو! حساب بالکل برابر ہے' : 'Perfect Match! Zero Difference'}
                    </Text>
                    <Text style={styles.bannerSubGreen}>
                      {language === 'ur'
                        ? 'گلہ کے تمام نوٹ اور سکے متوقع رقم سے 100٪ مطابقت رکھتے ہیں۔'
                        : 'Your counted drawer cash matches expected store income exactly.'}
                    </Text>
                  </View>
                ) : difference > 0 ? (
                  <View style={[styles.resultBanner, { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }]}>
                    <View style={styles.bannerIconCircleAmber}>
                      <Ionicons name="alert-circle" size={32} color="#D97706" />
                    </View>
                    <Text style={styles.bannerTitleAmber}>
                      {language === 'ur'
                        ? `اضافی رقم: +${settings.currencySymbol}${difference.toLocaleString()}`
                        : `Cash Surplus: +${settings.currencySymbol}${difference.toLocaleString()}`}
                    </Text>
                    <Text style={styles.bannerSubAmber}>
                      {language === 'ur'
                        ? 'گلہ میں متوقع رقم سے زیادہ کیش موجود ہے۔ شاید کوئی غیر درج شدہ وصولی ہوئی ہے۔'
                        : 'There is more cash in your register than recorded sales/recoveries.'}
                    </Text>
                  </View>
                ) : (
                  <View style={[styles.resultBanner, { backgroundColor: '#FEE2E2', borderColor: '#EF4444' }]}>
                    <View style={styles.bannerIconCircleRed}>
                      <Ionicons name="warning" size={32} color="#DC2626" />
                    </View>
                    <Text style={styles.bannerTitleRed}>
                      {language === 'ur'
                        ? `کیش میں کمی: -${settings.currencySymbol}${Math.abs(difference).toLocaleString()}`
                        : `Cash Shortage: -${settings.currencySymbol}${Math.abs(difference).toLocaleString()}`}
                    </Text>
                    <Text style={styles.bannerSubRed}>
                      {language === 'ur'
                        ? 'گلہ میں متوقع سے کم رقم ہے۔ شاید کوئی دکان کا خرچہ یا سودا لکھنا بھول گئے ہیں۔'
                        : 'Counted cash is less than expected. An unrecorded expense may have occurred.'}
                    </Text>
                  </View>
                )}

                {/* Quick Summary Comparison Box */}
                <View style={[styles.summaryBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <View style={styles.summaryBoxRow}>
                    <Text style={[styles.summaryBoxLabel, { color: theme.textSecondary }]}>
                      {language === 'ur' ? 'متوقع رقم (رجسٹر)' : 'Expected Cash:'}
                    </Text>
                    <Text style={[styles.summaryBoxVal, { color: theme.text }]}>
                      {settings.currencySymbol} {todayNetCashInDrawer.toLocaleString()}
                    </Text>
                  </View>

                  <View style={styles.summaryBoxRow}>
                    <Text style={[styles.summaryBoxLabel, { color: theme.textSecondary }]}>
                      {language === 'ur' ? 'گنا ہوا کیش (حقیقی)' : 'Counted Cash:'}
                    </Text>
                    <Text style={[styles.summaryBoxVal, { color: '#059669', fontWeight: '800' }]}>
                      {settings.currencySymbol} {countedCash.toLocaleString()}
                    </Text>
                  </View>

                  <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />

                  <View style={styles.summaryBoxRow}>
                    <Text style={[styles.summaryBoxLabel, { color: theme.text, fontWeight: '700' }]}>
                      {language === 'ur' ? 'حتمی فرق (Difference):' : 'Net Difference:'}
                    </Text>
                    <Text
                      style={[
                        styles.summaryBoxVal,
                        {
                          color: difference === 0 ? '#059669' : difference > 0 ? '#D97706' : '#DC2626',
                          fontWeight: '800',
                          fontSize: 18,
                        },
                      ]}>
                      {difference === 0
                        ? 'Rs. 0 (OK)'
                        : `${difference > 0 ? '+' : ''}${settings.currencySymbol} ${difference.toLocaleString()}`}
                    </Text>
                  </View>
                </View>

                {/* Optional Closing Notes / Discrepancy Reason */}
                <View style={styles.notesWrap}>
                  <Text style={[styles.notesLabel, { color: theme.textSecondary }]}>
                    {language === 'ur' ? 'کوئی خاص یادداشت یا نوٹ (اختیاری):' : 'Closing Notes / Reason (Optional):'}
                  </Text>
                  <TextInput
                    value={closingNotes}
                    onChangeText={setClosingNotes}
                    placeholder={
                      language === 'ur'
                        ? 'مثال کے طور پر: بقایا کیش دراز میں چھوڑا یا کل کا ادھار...'
                        : 'e.g., Left Rs. 2,000 for morning change drawer...'
                    }
                    placeholderTextColor={theme.textMuted}
                    multiline
                    style={[
                      styles.notesInput,
                      { backgroundColor: theme.card, borderColor: theme.border, color: theme.text },
                    ]}
                  />
                </View>

                {/* Action Buttons: WhatsApp + Print + Save Closing */}
                <View style={styles.finalActionsWrap}>
                  {/* Button 1: WhatsApp Daily Closing Report */}
                  <Pressable
                    onPress={handleShareWhatsApp}
                    style={({ pressed }) => [
                      styles.actionFullBtn,
                      { backgroundColor: '#25D366' },
                      pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
                    ]}>
                    <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" />
                    <Text style={styles.actionBtnTextWhite}>
                      {language === 'ur' ? 'واٹس ایپ روزنامچہ بھیجیں' : 'Send WhatsApp Report to Owner'}
                    </Text>
                  </Pressable>

                  {/* Button 2: Print Thermal Closing Slip */}
                  <Pressable
                    onPress={handlePrintClosingSlip}
                    style={({ pressed }) => [
                      styles.actionFullBtn,
                      { backgroundColor: '#1E293B' },
                      pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
                    ]}>
                    <Ionicons name="print-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.actionBtnTextWhite}>
                      {language === 'ur' ? 'شام کی رپورٹ پرنٹ کریں (80mm)' : 'Print Closing Slip (80mm)'}
                    </Text>
                  </Pressable>

                  {/* Button 3: Save & Close Daily Closing */}
                  <Pressable
                    onPress={handleSaveClosing}
                    disabled={isSaving || hasSaved}
                    style={({ pressed }) => [
                      styles.actionFullBtn,
                      { backgroundColor: hasSaved ? '#059669' : '#047857' },
                      pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
                    ]}>
                    {isSaving ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : hasSaved ? (
                      <>
                        <Ionicons name="checkmark-done" size={20} color="#FFFFFF" />
                        <Text style={styles.actionBtnTextWhite}>
                          {language === 'ur' ? '✓ حساب محفوظ ہو چکا ہے' : '✓ Saved to Records'}
                        </Text>
                      </>
                    ) : (
                      <>
                        <Ionicons name="save-outline" size={20} color="#FFFFFF" />
                        <Text style={styles.actionBtnTextWhite}>
                          {language === 'ur' ? 'شام کا حساب مکمل و محفوظ کریں' : 'Complete & Save Day-End Closing'}
                        </Text>
                      </>
                    )}
                  </Pressable>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Persistent Bottom Sticky Tally Bar across all tabs */}
          <View style={[styles.stickyFooter, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
            <View style={styles.stickyFooterCol}>
              <Text style={[styles.stickyFooterLabel, { color: theme.textMuted }]}>
                {language === 'ur' ? 'گنا ہوا کیش' : 'Counted'}
              </Text>
              <Text style={[styles.stickyFooterVal, { color: '#059669' }]}>
                {settings.currencySymbol} {countedCash.toLocaleString()}
              </Text>
            </View>

            <View style={styles.stickyDivider} />

            <View style={styles.stickyFooterCol}>
              <Text style={[styles.stickyFooterLabel, { color: theme.textMuted }]}>
                {language === 'ur' ? 'متوقع کیش' : 'Expected'}
              </Text>
              <Text style={[styles.stickyFooterVal, { color: theme.text }]}>
                {settings.currencySymbol} {todayNetCashInDrawer.toLocaleString()}
              </Text>
            </View>

            <View style={styles.stickyDivider} />

            <View style={styles.stickyFooterCol}>
              <Text style={[styles.stickyFooterLabel, { color: theme.textMuted }]}>
                {language === 'ur' ? 'حساب کا فرق' : 'Diff'}
              </Text>
              <Text
                style={[
                  styles.stickyFooterVal,
                  {
                    color: difference === 0 ? '#059669' : difference > 0 ? '#D97706' : '#DC2626',
                  },
                ]}>
                {difference === 0 ? '✓ 0' : `${difference > 0 ? '+' : ''}${difference.toLocaleString()}`}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    maxHeight: '92%',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  moonCircle: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
    marginTop: 2,
  },
  headerCloseBtn: {
    padding: 6,
  },

  // Tabs
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  tabItemActive: {
    borderBottomWidth: 2.5,
    borderBottomColor: '#059669',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextBold: {
    fontWeight: '800',
  },

  // Body
  modalBody: {
    flexGrow: 0,
  },
  bodyContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  tabContent: {
    gap: Spacing.md,
  },

  // Hero Expected Cash Card
  expectedCashCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  expectedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    marginBottom: Spacing.sm,
  },
  expectedIconCircle: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expectedLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#064E3B',
  },
  expectedFormulaHint: {
    fontSize: 12,
    color: '#047857',
    marginTop: 2,
  },
  expectedAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: -0.5,
    marginTop: 4,
  },

  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },

  // Formula Cards
  formulaCardsGrid: {
    gap: 8,
  },
  formulaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 12,
  },
  formulaSignCircle: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formulaCardLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  formulaCardVal: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 1,
  },

  // Other Activities Grid
  otherGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  otherCard: {
    width: '48.5%',
    padding: 10,
    borderRadius: BorderRadius.md,
    gap: 4,
  },
  otherLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  otherVal: {
    fontSize: 14,
    fontWeight: '800',
  },

  // Primary CTA
  primaryCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    gap: 8,
    marginTop: 6,
    ...Shadows.sm,
  },
  primaryCtaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  // Counter Tools
  counterToolsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  counterToolBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 6,
  },
  counterToolText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Denominations List
  denominationsList: {
    gap: 8,
  },
  denomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  denomBadge: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    minWidth: 105,
  },
  denomBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  stepperWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  denomCountInput: {
    width: 44,
    height: 32,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '800',
    padding: 0,
  },
  denomSubtotalCol: {
    minWidth: 90,
    alignItems: 'flex-end',
  },
  denomSubtotalVal: {
    fontSize: 14,
    fontWeight: '800',
  },

  // Coins Input
  coinsInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  currencyPrefix: {
    fontSize: 13,
    fontWeight: '700',
  },
  coinsInput: {
    width: 80,
    height: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '800',
    padding: 0,
  },

  // Result Banner
  resultBanner: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    alignItems: 'center',
    gap: 6,
  },
  bannerIconCircleGreen: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitleGreen: {
    fontSize: 16,
    fontWeight: '800',
    color: '#065F46',
    textAlign: 'center',
  },
  bannerSubGreen: {
    fontSize: 12,
    color: '#047857',
    textAlign: 'center',
  },

  bannerIconCircleAmber: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: '#FDE68A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitleAmber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#92400E',
    textAlign: 'center',
  },
  bannerSubAmber: {
    fontSize: 12,
    color: '#B45309',
    textAlign: 'center',
  },

  bannerIconCircleRed: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: '#FECACA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitleRed: {
    fontSize: 16,
    fontWeight: '800',
    color: '#991B1B',
    textAlign: 'center',
  },
  bannerSubRed: {
    fontSize: 12,
    color: '#B91C1C',
    textAlign: 'center',
  },

  // Summary Comparison Box
  summaryBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: 8,
  },
  summaryBoxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryBoxLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  summaryBoxVal: {
    fontSize: 15,
    fontWeight: '700',
  },
  summaryDivider: {
    height: 1,
    marginVertical: 4,
  },

  // Notes
  notesWrap: {
    gap: 6,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: 10,
    fontSize: 13,
    minHeight: 50,
  },

  // Final Action Buttons
  finalActionsWrap: {
    gap: 10,
    marginTop: 4,
  },
  actionFullBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: BorderRadius.lg,
    gap: 8,
    ...Shadows.sm,
  },
  actionBtnTextWhite: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  // Sticky Bottom Footer
  stickyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    borderTopWidth: 1,
  },
  stickyFooterCol: {
    alignItems: 'center',
  },
  stickyFooterLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  stickyFooterVal: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 1,
  },
  stickyDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
});
