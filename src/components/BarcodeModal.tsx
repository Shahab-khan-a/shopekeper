import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '@/types';
import { useShop } from '@/context/ShopContext';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

interface BarcodeModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const BarcodeModal: React.FC<BarcodeModalProps> = ({
  visible,
  onClose,
  onSelectProduct,
}) => {
  const { products, settings, language, t, setIsAddProductOpen } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const isUrdu = language === 'ur';

  const [inputCode, setInputCode] = useState('');
  const [notFoundCode, setNotFoundCode] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);

  // Animated Laser Beam
  const laserAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setInputCode('');
      setNotFoundCode(null);

      // Start looping laser animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(laserAnim, {
            toValue: 1,
            duration: 1800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(laserAnim, {
            toValue: 0,
            duration: 1800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Auto-focus input for immediate hardware scanner gun capture
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    } else {
      laserAnim.stopAnimation();
    }
  }, [visible, laserAnim]);

  const productsWithBarcode = products.filter((p) => p.barcode);

  const performLookup = (codeToSearch: string) => {
    const trimmed = codeToSearch.trim();
    if (!trimmed) return;

    const found = products.find(
      (p) => p.barcode?.toLowerCase() === trimmed.toLowerCase()
    );

    if (found) {
      setNotFoundCode(null);
      onSelectProduct(found);
      onClose();
      setInputCode('');
    } else {
      setNotFoundCode(trimmed);
    }
  };

  const handleInputChange = (text: string) => {
    setInputCode(text);
    if (notFoundCode) {
      setNotFoundCode(null);
    }

    // Auto-detect fast scanner input: If exact barcode match found, add immediately
    const trimmed = text.trim();
    if (trimmed.length >= 3) {
      const match = products.find(
        (p) => p.barcode?.toLowerCase() === trimmed.toLowerCase()
      );
      if (match) {
        onSelectProduct(match);
        onClose();
        setInputCode('');
      }
    }
  };

  const laserTranslateY = laserAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 96],
  });

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <Pressable style={styles.backdropPress} onPress={onClose} />
        <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {/* Header */}
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <View style={styles.headerTitleWrap}>
              <View style={[styles.headerIconWrap, { backgroundColor: theme.primaryLight }]}>
                <Ionicons name="barcode-outline" size={20} color={theme.primary} />
              </View>
              <View>
                <Text style={[styles.modalTitle, { color: theme.text }]}>
                  {isUrdu ? 'بارکوڈ سے تلاش کریں' : 'Barcode Scanner'}
                </Text>
                <Text style={[styles.modalSub, { color: theme.textMuted }]}>
                  {isUrdu ? 'اسکینر گن یا مینوئل کوڈ سے آئٹم شامل کریں' : 'Hardware scanner & manual SKU lookup'}
                </Text>
              </View>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
              <Ionicons name="close" size={22} color={theme.textMuted} />
            </Pressable>
          </View>

          {/* Body */}
          <View style={styles.body}>
            {/* Visual Viewfinder Frame (Matching ProductBarcodeModal) */}
            <View
              style={[
                styles.scannerBox,
                {
                  backgroundColor: settings.darkMode ? '#0B1120' : '#F1F5F9',
                  borderColor: notFoundCode ? '#FCA5A5' : theme.border,
                },
              ]}
            >
              {/* Corner guide markers */}
              <View style={[styles.corner, styles.cornerTL, { borderColor: theme.primary }]} />
              <View style={[styles.corner, styles.cornerTR, { borderColor: theme.primary }]} />
              <View style={[styles.corner, styles.cornerBL, { borderColor: theme.primary }]} />
              <View style={[styles.corner, styles.cornerBR, { borderColor: theme.primary }]} />

              {/* Animated Laser Beam */}
              <Animated.View
                style={[
                  styles.laserLine,
                  {
                    transform: [{ translateY: laserTranslateY }],
                  },
                ]}
              />

              <Ionicons
                name="barcode-outline"
                size={48}
                color={settings.darkMode ? '#334155' : '#CBD5E1'}
              />
              <Text style={[styles.scannerPrompt, { color: theme.textMuted }]}>
                {isUrdu
                  ? 'بارکوڈ گن سے اسکین کریں — پروڈکٹ خودکار بل میں شامل ہو جائے گی'
                  : 'Scan item with barcode gun or type code below'}
              </Text>
            </View>

            {/* Input Row */}
            <View style={styles.inputWrap}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>
                {isUrdu ? 'بارکوڈ نمبر' : 'Barcode / SKU'}
              </Text>
              <View
                style={[
                  styles.inputRow,
                  {
                    backgroundColor: theme.surfaceSubtle,
                    borderColor: notFoundCode ? theme.danger : theme.border,
                  },
                ]}
              >
                <Ionicons name="barcode" size={20} color={theme.primary} style={{ marginLeft: 12 }} />
                <TextInput
                  ref={inputRef}
                  style={[styles.barcodeInput, { color: theme.text }]}
                  placeholder={isUrdu ? 'کوڈ اسکین یا درج کریں...' : 'Scan or enter code...'}
                  placeholderTextColor={theme.textMuted}
                  value={inputCode}
                  onChangeText={handleInputChange}
                  onSubmitEditing={() => performLookup(inputCode)}
                  keyboardType="numeric"
                  returnKeyType="search"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {!!inputCode && (
                  <Pressable onPress={() => setInputCode('')} style={styles.clearBtn} hitSlop={8}>
                    <Ionicons name="close-circle" size={18} color={theme.textMuted} />
                  </Pressable>
                )}
                <Pressable
                  onPress={() => performLookup(inputCode)}
                  style={[styles.lookupBtn, { backgroundColor: theme.primary }]}
                >
                  <Ionicons name="search" size={18} color="#FFFFFF" />
                </Pressable>
              </View>
            </View>

            {/* Not Found In-Line Banner */}
            {notFoundCode && (
              <View style={[styles.notFoundCard, { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' }]}>
                <Ionicons name="alert-circle" size={20} color="#DC2626" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.notFoundTitle}>
                    {isUrdu
                      ? `کوڈ "${notFoundCode}" کے ساتھ کوئی پروڈکٹ نہیں ملی`
                      : `No product found with barcode "${notFoundCode}"`}
                  </Text>
                  <Text style={styles.notFoundSub}>
                    {isUrdu ? 'کیا آپ اس کوڈ کے ساتھ نئی پروڈکٹ شامل کرنا چاہتے ہیں؟' : 'Would you like to add it as a new product?'}
                  </Text>
                </View>
                <Pressable
                  onPress={() => {
                    onClose();
                    setIsAddProductOpen(true);
                  }}
                  style={styles.addNewItemBtn}
                >
                  <Text style={styles.addNewItemText}>
                    {isUrdu ? '+ شامل کریں' : '+ Add'}
                  </Text>
                </Pressable>
              </View>
            )}

            {/* Quick barcode list */}
            {productsWithBarcode.length > 0 && (
              <View style={styles.quickListSection}>
                <Text style={[styles.quickListTitle, { color: theme.textSecondary }]}>
                  {isUrdu ? 'دستیاب بارکوڈ پروڈکٹس:' : 'Or tap existing item with barcode:'}
                </Text>
                <ScrollView
                  style={styles.barcodeList}
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled
                >
                  {productsWithBarcode.slice(0, 8).map((p) => (
                    <Pressable
                      key={p.id}
                      onPress={() => {
                        onSelectProduct(p);
                        onClose();
                      }}
                      style={({ pressed }) => [
                        styles.barcodeItem,
                        { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
                        pressed && { opacity: 0.75, backgroundColor: theme.primaryLight },
                      ]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.itemTitle, { color: theme.text }]}>{p.name}</Text>
                        <Text style={[styles.itemCode, { color: theme.primary }]}>
                          ║▌║ {p.barcode}
                        </Text>
                      </View>
                      <Text style={[styles.itemPrice, { color: theme.text }]}>
                        {settings.currencySymbol} {p.price}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  backdropPress: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '90%',
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  headerIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  modalSub: {
    fontSize: 11,
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
    borderRadius: BorderRadius.full,
  },
  body: {
    padding: Spacing.lg,
    gap: 12,
  },
  scannerBox: {
    height: 115,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderWidth: 3,
  },
  cornerTL: {
    top: 10,
    left: 10,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 10,
    right: 10,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 10,
    left: 10,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 10,
    right: 10,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 4,
  },
  laserLine: {
    position: 'absolute',
    left: '12%',
    right: '12%',
    top: 10,
    height: 2.5,
    backgroundColor: '#10B981',
    borderRadius: 2,
    shadowColor: '#10B981',
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  scannerPrompt: {
    fontSize: 11.5,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  inputWrap: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  barcodeInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  clearBtn: {
    paddingHorizontal: 8,
  },
  lookupBtn: {
    width: 44,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  notFoundTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#991B1B',
  },
  notFoundSub: {
    fontSize: 11,
    color: '#7F1D1D',
    marginTop: 1,
  },
  addNewItemBtn: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
  },
  addNewItemText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
  },
  quickListSection: {
    marginTop: 4,
    gap: 6,
  },
  quickListTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  barcodeList: {
    maxHeight: 140,
  },
  barcodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: 6,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  itemCode: {
    fontSize: 11.5,
    marginTop: 1,
    fontWeight: '600',
  },
  itemPrice: {
    fontSize: 13.5,
    fontWeight: '800',
  },
});
