import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
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
  const { products, settings, t } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const [inputCode, setInputCode] = useState('');

  const productsWithBarcode = products.filter((p) => p.barcode);

  const handleLookup = () => {
    if (!inputCode.trim()) return;
    const found = products.find(
      (p) => p.barcode?.toLowerCase() === inputCode.trim().toLowerCase()
    );
    if (found) {
      onSelectProduct(found);
      onClose();
      setInputCode('');
    } else {
      alert('No product found with barcode: ' + inputCode);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.surface }]}>
          {/* Header */}
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <View style={styles.headerTitleWrap}>
              <Ionicons name="barcode-outline" size={24} color={theme.primary} />
              <Text style={[styles.modalTitle, { color: theme.text }]}>Barcode Scanner & Search</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={theme.textSecondary} />
            </Pressable>
          </View>

          {/* Body */}
          <View style={styles.body}>
            {/* Scanner Visual Frame */}
            <View style={[styles.scannerBox, { backgroundColor: '#0F172A' }]}>
              <View style={styles.scannerLine} />
              <Ionicons name="scan-outline" size={80} color="#10B981" />
              <Text style={styles.scannerPrompt}>Scanner Ready / Enter Code Below</Text>
            </View>

            {/* Input Row */}
            <View style={styles.inputRow}>
              <TextInput
                style={[
                  styles.barcodeInput,
                  { backgroundColor: theme.surfaceSubtle, color: theme.text, borderColor: theme.border },
                ]}
                placeholder="Scan or type barcode (e.g. 89640001001)..."
                placeholderTextColor={theme.textMuted}
                value={inputCode}
                onChangeText={setInputCode}
                onSubmitEditing={handleLookup}
                autoFocus
              />
              <Pressable
                onPress={handleLookup}
                style={[styles.lookupBtn, { backgroundColor: theme.primary }]}>
                <Ionicons name="search" size={20} color="#FFFFFF" />
              </Pressable>
            </View>

            {/* Quick barcode list */}
            <Text style={[styles.quickListTitle, { color: theme.textSecondary }]}>
              Or tap existing product barcode:
            </Text>
            <ScrollView style={styles.barcodeList} showsVerticalScrollIndicator={false}>
              {productsWithBarcode.map((p) => (
                <Pressable
                  key={p.id}
                  onPress={() => {
                    onSelectProduct(p);
                    onClose();
                  }}
                  style={({ pressed }) => [
                    styles.barcodeItem,
                    { backgroundColor: theme.surfaceSubtle, borderColor: theme.border },
                    pressed && { opacity: 0.7 },
                  ]}>
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
  modalCard: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '85%',
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  scannerBox: {
    height: 140,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  scannerLine: {
    position: 'absolute',
    width: '80%',
    height: 2,
    backgroundColor: '#10B981',
    top: '50%',
  },
  scannerPrompt: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  barcodeInput: {
    flex: 1,
    height: 48,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    fontSize: 14,
  },
  lookupBtn: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickListTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  barcodeList: {
    maxHeight: 180,
  },
  barcodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: 6,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  itemCode: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
  },
});
