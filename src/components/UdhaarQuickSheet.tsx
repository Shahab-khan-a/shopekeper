import { Colors } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';
import { CustomerKhata } from '@/types';
import { formatCompactPrice } from '@/utils/formatters';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface UdhaarConfirmPayload {
  selectedCustomer: CustomerKhata | null;
  customerName: string;
  customerPhone: string;
  cashPaid: number;
}

interface UdhaarQuickSheetProps {
  visible: boolean;
  billTotal: number;
  customers: CustomerKhata[];
  isProcessing: boolean;
  onClose: () => void;
  onConfirm: (payload: UdhaarConfirmPayload) => Promise<void>;
}

/**
 * Focused, low-friction Udhaar bottom sheet for the Counter workflow.
 * When a shopkeeper taps "Udhaar", the bill and intent are already settled;
 * all that remains is choosing (or adding) the customer in 1–2 taps.
 */
export const UdhaarQuickSheet: React.FC<UdhaarQuickSheetProps> = ({
  visible,
  billTotal,
  customers,
  isProcessing,
  onClose,
  onConfirm,
}) => {
  const { settings, language } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isUrdu = language === 'ur';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerKhata | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [showPartialCash, setShowPartialCash] = useState(false);
  const [partialCashStr, setPartialCashStr] = useState('');

  // Reset transient form state every time the sheet opens cleanly
  useEffect(() => {
    if (visible) {
      setSearchQuery('');
      setSelectedCustomer(null);
      setIsAddingNew(false);
      setNewName('');
      setNewPhone('');
      setShowPartialCash(false);
      setPartialCashStr('');
    }
  }, [visible]);

  const sortedCustomers = useMemo(() => {
    return [...customers].sort((a, b) => (b.lastUpdated || 0) - (a.lastUpdated || 0));
  }, [customers]);

  const visibleCustomers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return sortedCustomers.slice(0, 12);
    return sortedCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.nameUrdu && c.nameUrdu.toLowerCase().includes(q)) ||
        (c.phone && c.phone.includes(q))
    );
  }, [sortedCustomers, searchQuery]);

  const partialCashNum = useMemo(() => {
    if (!showPartialCash || !partialCashStr.trim()) return 0;
    const n = parseFloat(partialCashStr);
    if (isNaN(n) || n < 0) return 0;
    return Math.min(billTotal, Math.round(n));
  }, [showPartialCash, partialCashStr, billTotal]);

  const udhaarDueNow = Math.max(0, billTotal - partialCashNum);
  const canConfirm =
    !isProcessing &&
    billTotal > 0 &&
    (selectedCustomer !== null || (isAddingNew && newName.trim().length > 0));

  const softBorder = settings.darkMode ? 'rgba(255,255,255,0.1)' : '#E2E8F0';
  const cardBg = settings.darkMode ? theme.card : '#FFFFFF';
  const subtleBg = settings.darkMode ? theme.surfaceSubtle : '#F8FAFC';

  const handleConfirmPress = async () => {
    if (!canConfirm) return;
    await onConfirm({
      selectedCustomer,
      customerName: selectedCustomer ? selectedCustomer.name : newName.trim(),
      customerPhone: selectedCustomer ? selectedCustomer.phone : newPhone.trim(),
      cashPaid: partialCashNum,
    });
  };

  const renderPartialCashToggle = () => (
    <View style={styles.partialSection}>
      {!showPartialCash ? (
        <Pressable
          onPress={() => setShowPartialCash(true)}
          hitSlop={6}
          style={({ pressed }) => [
            styles.partialChipToggle,
            { backgroundColor: subtleBg, borderColor: softBorder },
            pressed && { opacity: 0.78 },
          ]}>
          <Ionicons name="cash-outline" size={15} color={theme.textSecondary} />
          <Text style={[styles.partialChipToggleText, { color: theme.textSecondary }]}>
            {isUrdu ? 'کچھ نقد ابھی وصول ہوا؟' : 'Paid some cash now?'}
          </Text>
          <Ionicons name="add" size={15} color={theme.textMuted} />
        </Pressable>
      ) : (
        <View
          style={[
            styles.partialInputCard,
            { backgroundColor: subtleBg, borderColor: softBorder },
          ]}>
          <View style={styles.partialInputTop}>
            <Text style={[styles.partialLabel, { color: theme.textSecondary }]}>
              {isUrdu ? 'نقد وصول رقم' : 'Cash received now'}
            </Text>
            <Pressable
              onPress={() => {
                setShowPartialCash(false);
                setPartialCashStr('');
              }}
              hitSlop={8}>
              <Text style={[styles.partialResetText, { color: theme.danger }]}>
                {isUrdu ? 'ہٹائیں' : 'Clear'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.partialInputRow}>
            <View
              style={[
                styles.partialInputBox,
                { backgroundColor: cardBg, borderColor: softBorder },
              ]}>
              <Text style={[styles.partialCurrency, { color: '#059669' }]}>
                {settings.currencySymbol}
              </Text>
              <TextInput
                value={partialCashStr}
                onChangeText={(txt) => setPartialCashStr(txt.replace(/[^0-9]/g, ''))}
                placeholder="0"
                placeholderTextColor={theme.textMuted}
                keyboardType="number-pad"
                style={[styles.partialInput, { color: theme.text }]}
                autoFocus
              />
            </View>
            <View style={styles.partialSummaryPill}>
              <Text style={[styles.partialSummaryLabel, { color: theme.textMuted }]}>
                {isUrdu ? 'کھاتہ میں' : 'On Udhaar'}
              </Text>
              <Text style={[styles.partialSummaryVal, { color: theme.danger }]}>
                {settings.currencySymbol}
                {formatCompactPrice(udhaarDueNow)}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalRoot}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.surface,
              borderColor: softBorder,
              paddingBottom: Math.max(insets.bottom, 16) + 6,
            },
          ]}>
          {/* Handle Bar */}
          <View style={styles.handleWrap}>
            <View
              style={[
                styles.handleBar,
                {
                  backgroundColor: settings.darkMode
                    ? 'rgba(255,255,255,0.22)'
                    : '#CBD5E1',
                },
              ]}
            />
          </View>

          {/* Compact Header: Intent Badge + Bill Amount + Close */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View
                style={[
                  styles.udhaarTag,
                  {
                    backgroundColor: settings.darkMode
                      ? 'rgba(239, 68, 68, 0.2)'
                      : '#FEE2E2',
                  },
                ]}>
                <Ionicons name="book" size={14} color={theme.danger} />
                <Text style={[styles.udhaarTagText, { color: theme.danger }]}>
                  {isUrdu ? 'ادھار کھاتہ' : 'Udhaar'}
                </Text>
              </View>
              <Text
                style={[styles.headerTotalText, { color: theme.text }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.75}>
                {settings.currencySymbol}
                {formatCompactPrice(billTotal)}
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={isUrdu ? 'بند کریں' : 'Close'}
              hitSlop={8}
              style={({ pressed }) => [
                styles.closeBtn,
                { backgroundColor: subtleBg },
                pressed && { opacity: 0.7 },
              ]}>
              <Ionicons name="close" size={20} color={theme.textSecondary} />
            </Pressable>
          </View>

          {/* Body: Focused Customer Selection */}
          {selectedCustomer ? (
            <View style={styles.selectedSection}>
              <View
                style={[
                  styles.selectedCard,
                  {
                    backgroundColor: cardBg,
                    borderColor: settings.darkMode
                      ? 'rgba(239,68,68,0.45)'
                      : '#FCA5A5',
                  },
                ]}>
                <View style={styles.selectedTop}>
                  <View
                    style={[
                      styles.avatarCircle,
                      {
                        backgroundColor: settings.darkMode
                          ? 'rgba(239,68,68,0.2)'
                          : '#FEE2E2',
                      },
                    ]}>
                    <Text style={[styles.avatarText, { color: theme.danger }]}>
                      {selectedCustomer.name.slice(0, 1).toUpperCase()}
                    </Text>
                  </View>

                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text
                      style={[styles.selectedName, { color: theme.text }]}
                      numberOfLines={1}>
                      {selectedCustomer.name}
                    </Text>
                    <Text
                      style={[styles.selectedPhone, { color: theme.textMuted }]}
                      numberOfLines={1}>
                      {selectedCustomer.phone || (isUrdu ? 'فون نمبر نہیں' : 'No phone')}
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => setSelectedCustomer(null)}
                    style={({ pressed }) => [
                      styles.changeBtn,
                      { backgroundColor: subtleBg, borderColor: softBorder },
                      pressed && { opacity: 0.75 },
                    ]}>
                    <Text style={[styles.changeBtnText, { color: theme.primary }]}>
                      {isUrdu ? 'تبدیل' : 'Change'}
                    </Text>
                  </Pressable>
                </View>

                <View style={[styles.ledgerPreviewRow, { borderTopColor: softBorder }]}>
                  <View style={styles.ledgerCol}>
                    <Text style={[styles.ledgerLabel, { color: theme.textMuted }]}>
                      {isUrdu ? 'پہلے سے واجب' : 'Previous Due'}
                    </Text>
                    <Text
                      style={[
                        styles.ledgerVal,
                        {
                          color:
                            selectedCustomer.totalDebt > 0
                              ? theme.textSecondary
                              : theme.success,
                        },
                      ]}>
                      {selectedCustomer.totalDebt > 0
                        ? `${settings.currencySymbol}${formatCompactPrice(selectedCustomer.totalDebt)}`
                        : isUrdu
                          ? 'صاف (0)'
                          : 'Settled'}
                    </Text>
                  </View>

                  <Ionicons name="arrow-forward" size={16} color={theme.textMuted} />

                  <View style={[styles.ledgerCol, { alignItems: 'flex-end' }]}>
                    <Text style={[styles.ledgerLabel, { color: theme.textMuted }]}>
                      {isUrdu ? 'نیا کل بقایا' : 'New Total Due'}
                    </Text>
                    <Text style={[styles.ledgerValStrong, { color: theme.danger }]}>
                      {settings.currencySymbol}
                      {formatCompactPrice((selectedCustomer.totalDebt || 0) + udhaarDueNow)}
                    </Text>
                  </View>
                </View>
              </View>

              {renderPartialCashToggle()}
            </View>
          ) : isAddingNew ? (
            <View style={styles.newCustomerSection}>
              <View style={styles.newHeaderRow}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  {isUrdu ? 'نیا گاہک شامل کریں' : 'New Customer'}
                </Text>
                <Pressable
                  onPress={() => setIsAddingNew(false)}
                  hitSlop={8}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons name="arrow-back" size={14} color={theme.primary} />
                  <Text style={[styles.backLinkText, { color: theme.primary }]}>
                    {isUrdu ? 'فہرست دیکھیں' : 'Pick from list'}
                  </Text>
                </Pressable>
              </View>

              <TextInput
                value={newName}
                onChangeText={setNewName}
                placeholder={isUrdu ? 'گاہک کا نام *' : 'Customer name *'}
                placeholderTextColor={theme.textMuted}
                autoFocus
                returnKeyType="next"
                style={[
                  styles.formInput,
                  { backgroundColor: cardBg, color: theme.text, borderColor: softBorder },
                ]}
              />
              <TextInput
                value={newPhone}
                onChangeText={setNewPhone}
                placeholder={isUrdu ? 'فون / واٹس ایپ (اختیاری)' : 'Phone / WhatsApp (optional)'}
                placeholderTextColor={theme.textMuted}
                keyboardType="phone-pad"
                style={[
                  styles.formInput,
                  { backgroundColor: cardBg, color: theme.text, borderColor: softBorder },
                ]}
              />

              {renderPartialCashToggle()}
            </View>
          ) : (
            <View style={styles.pickerSection}>
              {/* Clean Search Row + Quick New Button */}
              <View style={styles.searchBarRow}>
                <View
                  style={[
                    styles.searchBox,
                    { backgroundColor: cardBg, borderColor: softBorder },
                  ]}>
                  <Ionicons name="search-outline" size={17} color={theme.textMuted} />
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder={isUrdu ? 'گاہک کا نام یا فون...' : 'Search customer name or phone...'}
                    placeholderTextColor={theme.textMuted}
                    style={[styles.searchInput, { color: theme.text }]}
                  />
                  {searchQuery.length > 0 && (
                    <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
                      <Ionicons name="close-circle" size={17} color={theme.textMuted} />
                    </Pressable>
                  )}
                </View>

                <Pressable
                  onPress={() => {
                    setNewName(searchQuery.trim());
                    setNewPhone('');
                    setIsAddingNew(true);
                  }}
                  style={({ pressed }) => [
                    styles.newCustomerBtn,
                    { backgroundColor: theme.primary },
                    pressed && { opacity: 0.85 },
                  ]}>
                  <Ionicons name="person-add" size={15} color="#FFFFFF" />
                  <Text style={styles.newCustomerBtnText}>
                    {isUrdu ? 'نیا' : 'New'}
                  </Text>
                </Pressable>
              </View>

              {/* 1-Tap Customer List */}
              <ScrollView
                style={styles.customerListScroll}
                contentContainerStyle={styles.customerListContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
                {visibleCustomers.length > 0 ? (
                  visibleCustomers.map((cust) => {
                    const hasDebt = (cust.totalDebt || 0) > 0;
                    return (
                      <Pressable
                        key={cust.id}
                        onPress={() => setSelectedCustomer(cust)}
                        style={({ pressed }) => [
                          styles.customerRow,
                          { backgroundColor: cardBg, borderColor: softBorder },
                          pressed && { opacity: 0.78, transform: [{ scale: 0.99 }] },
                        ]}>
                        <View
                          style={[
                            styles.rowAvatar,
                            {
                              backgroundColor: settings.darkMode
                                ? 'rgba(59,130,246,0.18)'
                                : '#EFF6FF',
                            },
                          ]}>
                          <Text style={[styles.rowAvatarText, { color: theme.primary }]}>
                            {cust.name.slice(0, 1).toUpperCase()}
                          </Text>
                        </View>

                        <View style={{ flex: 1, minWidth: 0 }}>
                          <Text
                            style={[styles.rowName, { color: theme.text }]}
                            numberOfLines={1}>
                            {cust.name}
                          </Text>
                          <Text
                            style={[styles.rowPhone, { color: theme.textMuted }]}
                            numberOfLines={1}>
                            {cust.phone || (isUrdu ? 'فون نمبر نہیں' : 'No phone')}
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.debtBadge,
                            {
                              backgroundColor: hasDebt
                                ? settings.darkMode
                                  ? 'rgba(239,68,68,0.18)'
                                  : '#FEF2F2'
                                : subtleBg,
                            },
                          ]}>
                          <Text
                            style={[
                              styles.debtBadgeText,
                              { color: hasDebt ? theme.danger : theme.textMuted },
                            ]}>
                            {hasDebt
                              ? `${isUrdu ? 'واجب' : 'Due'} ${settings.currencySymbol}${formatCompactPrice(cust.totalDebt)}`
                              : isUrdu
                                ? 'صاف'
                                : 'Settled'}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })
                ) : searchQuery.trim().length > 0 ? (
                  <Pressable
                    onPress={() => {
                      setNewName(searchQuery.trim());
                      setNewPhone('');
                      setIsAddingNew(true);
                    }}
                    style={[
                      styles.addSearchMatchRow,
                      { backgroundColor: theme.primaryLight, borderColor: theme.primary },
                    ]}>
                    <Ionicons name="person-add" size={18} color={theme.primary} />
                    <Text style={[styles.addSearchMatchText, { color: theme.primary }]}>
                      {isUrdu
                        ? `نیا گاہک شامل کریں: "${searchQuery.trim()}"`
                        : `Add "${searchQuery.trim()}" as new customer`}
                    </Text>
                  </Pressable>
                ) : (
                  <View style={[styles.emptyCustomersCard, { backgroundColor: subtleBg }]}>
                    <Ionicons name="people-outline" size={26} color={theme.textMuted} />
                    <Text style={[styles.emptyCustomersText, { color: theme.textSecondary }]}>
                      {isUrdu
                        ? 'ابھی کوئی کھاتہ گاہک نہیں — نیا شامل کریں'
                        : 'No customers yet — tap "+ New" to add one'}
                    </Text>
                  </View>
                )}

                {searchQuery.trim().length > 0 && visibleCustomers.length > 0 && (
                  <Pressable
                    onPress={() => {
                      setNewName(searchQuery.trim());
                      setNewPhone('');
                      setIsAddingNew(true);
                    }}
                    style={[
                      styles.addSearchMatchRow,
                      { backgroundColor: theme.primaryLight, borderColor: softBorder, marginTop: 4 },
                    ]}>
                    <Ionicons name="person-add-outline" size={17} color={theme.primary} />
                    <Text style={[styles.addSearchMatchText, { color: theme.primary }]}>
                      {isUrdu
                        ? `نیا گاہک: "${searchQuery.trim()}"`
                        : `Add "${searchQuery.trim()}" as new`}
                    </Text>
                  </Pressable>
                )}
              </ScrollView>
            </View>
          )}

          {/* Single Primary CTA */}
          <Pressable
            onPress={handleConfirmPress}
            disabled={!canConfirm}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.confirmBtn,
              {
                backgroundColor: !canConfirm
                  ? settings.darkMode
                    ? '#1E293B'
                    : '#E2E8F0'
                  : udhaarDueNow > 0
                    ? '#DC2626'
                    : '#059669',
              },
              pressed && canConfirm && { opacity: 0.88, transform: [{ scale: 0.985 }] },
            ]}>
            {isProcessing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons
                  name={canConfirm ? 'checkmark-circle' : 'person-outline'}
                  size={20}
                  color={canConfirm ? '#FFFFFF' : theme.textMuted}
                />
                <Text
                  style={[
                    styles.confirmBtnText,
                    { color: canConfirm ? '#FFFFFF' : theme.textMuted },
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.82}>
                  {isProcessing
                    ? isUrdu
                      ? 'محفوظ ہو رہا ہے...'
                      : 'Saving...'
                    : !canConfirm
                      ? isUrdu
                        ? 'اوپر سے گاہک منتخب کریں'
                        : 'Select or add a customer'
                      : partialCashNum > 0 && udhaarDueNow > 0
                        ? isUrdu
                          ? `محفوظ کریں · نقد ${settings.currencySymbol}${formatCompactPrice(partialCashNum)} + ادھار ${settings.currencySymbol}${formatCompactPrice(udhaarDueNow)}`
                          : `Save · Cash ${settings.currencySymbol}${formatCompactPrice(partialCashNum)} + Udhaar ${settings.currencySymbol}${formatCompactPrice(udhaarDueNow)}`
                        : udhaarDueNow === 0
                          ? isUrdu
                            ? `نقد مکمل کریں · ${settings.currencySymbol}${formatCompactPrice(billTotal)}`
                            : `Save Cash · ${settings.currencySymbol}${formatCompactPrice(billTotal)}`
                          : isUrdu
                            ? `ادھار لکھیں · ${settings.currencySymbol}${formatCompactPrice(udhaarDueNow)}`
                            : `Save Udhaar · ${settings.currencySymbol}${formatCompactPrice(udhaarDueNow)}`}
                </Text>
              </>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.48)',
  },
  sheet: {
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: 18,
    paddingTop: 8,
    maxHeight: '84%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 18,
  },
  handleWrap: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  handleBar: {
    width: 38,
    height: 4,
    borderRadius: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 0,
  },
  udhaarTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  udhaarTagText: {
    fontSize: 13,
    fontWeight: '800',
  },
  headerTotalText: {
    fontSize: 22,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerSection: {
    gap: 10,
    marginBottom: 14,
  },
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchBox: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    paddingVertical: 0,
  },
  newCustomerBtn: {
    height: 46,
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  newCustomerBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  customerListScroll: {
    maxHeight: 250,
  },
  customerListContent: {
    gap: 7,
    paddingBottom: 2,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1,
  },
  rowAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowAvatarText: {
    fontSize: 15,
    fontWeight: '800',
  },
  rowName: {
    fontSize: 15,
    fontWeight: '700',
  },
  rowPhone: {
    fontSize: 12.5,
    marginTop: 1,
  },
  debtBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
  },
  debtBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  addSearchMatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
  },
  addSearchMatchText: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptyCustomersCard: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 26,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  emptyCustomersText: {
    fontSize: 13.5,
    fontWeight: '600',
    textAlign: 'center',
  },
  selectedSection: {
    gap: 10,
    marginBottom: 14,
  },
  selectedCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 13,
    gap: 12,
  },
  selectedTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 17,
    fontWeight: '800',
  },
  selectedName: {
    fontSize: 16,
    fontWeight: '800',
  },
  selectedPhone: {
    fontSize: 13,
    marginTop: 1,
  },
  changeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  changeBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  ledgerPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 10,
  },
  ledgerCol: {
    gap: 2,
  },
  ledgerLabel: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  ledgerVal: {
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  ledgerValStrong: {
    fontSize: 16,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  newCustomerSection: {
    gap: 10,
    marginBottom: 14,
  },
  newHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  backLinkText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  formInput: {
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '600',
  },
  partialSection: {
    marginTop: 2,
  },
  partialChipToggle: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  partialChipToggleText: {
    fontSize: 13,
    fontWeight: '600',
  },
  partialInputCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 11,
    gap: 8,
  },
  partialInputTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  partialLabel: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  partialResetText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  partialInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  partialInputBox: {
    flex: 1,
    height: 42,
    borderRadius: 11,
    borderWidth: 1,
    paddingHorizontal: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  partialCurrency: {
    fontSize: 15,
    fontWeight: '800',
  },
  partialInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    paddingVertical: 0,
  },
  partialSummaryPill: {
    alignItems: 'flex-end',
  },
  partialSummaryLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  partialSummaryVal: {
    fontSize: 14,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  confirmBtn: {
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '800',
  },
});

