import React, { useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShop } from '@/context/ShopContext';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { MASTER_CATALOG } from '@/data/masterCatalog';

interface ShopTypePickerModalProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * Lets the shopkeeper pick ONE shop type from the master catalog (opened
 * from the Products tab catalog import). The catalog import then loads
 * only that type's items. First-run selection happens in
 * CatalogSetupScreen instead.
 */
export const ShopTypePickerModal: React.FC<ShopTypePickerModalProps> = ({ visible, onClose }) => {
  const { settings, updateSettings, language } = useShop();
  const insets = useSafeAreaInsets();
  const theme = settings.darkMode ? Colors.dark : Colors.light;
  const ur = language === 'ur';
  const [query, setQuery] = useState('');

  const types = useMemo(() => {
    const all = MASTER_CATALOG.map((s) => ({
      shopType: s.shopType,
      icon: s.icon,
      count: s.categories.reduce((n, c) => n + c.items.length, 0),
    }));
    const q = query.trim().toLowerCase();
    return q ? all.filter((t) => t.shopType.toLowerCase().includes(q)) : all;
  }, [query]);

  const choose = async (shopType?: string) => {
    await updateSettings({ catalogShopType: shopType });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            {ur ? 'دکان کی قسم منتخب کریں' : 'Choose Your Shop Type'}
          </Text>
          <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
            <Ionicons name="close" size={24} color={theme.text} />
          </Pressable>
        </View>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          {ur
            ? 'پروڈکٹس ٹیب میں صرف منتخب قسم کی اشیاء لوڈ ہوں گی۔'
            : 'Only the selected type’s items will load in the Products tab catalog.'}
        </Text>

        <View style={[styles.searchWrap, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="search" size={18} color={theme.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={ur ? 'دکان کی قسم تلاش کریں…' : 'Search shop types…'}
            placeholderTextColor={theme.textMuted}
            style={[styles.searchInput, { color: theme.text }]}
          />
        </View>

        <FlatList
          data={types}
          keyExtractor={(t) => t.shopType}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          ListHeaderComponent={
            <Pressable
              onPress={() => choose(undefined)}
              style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={styles.rowIcon}>🚫</Text>
              <View style={styles.rowText}>
                <Text style={[styles.rowName, { color: theme.text }]}>
                  {ur ? 'کوئی کیٹلاگ نہیں' : 'No catalog'}
                </Text>
                <Text style={[styles.rowSub, { color: theme.textMuted }]}>
                  {ur ? 'کیٹلاگ امپورٹ بند کریں' : 'Turn off catalog import'}
                </Text>
              </View>
              {!settings.catalogShopType ? (
                <Ionicons name="checkmark-circle" size={22} color={theme.primary} />
              ) : null}
            </Pressable>
          }
          renderItem={({ item }) => {
            const selected = settings.catalogShopType === item.shopType;
            return (
              <Pressable
                onPress={() => choose(item.shopType)}
                style={[
                  styles.row,
                  { backgroundColor: theme.surface, borderColor: selected ? theme.primary : theme.border },
                  selected && { borderWidth: 2 },
                ]}>
                <Text style={styles.rowIcon}>{item.icon}</Text>
                <View style={styles.rowText}>
                  <Text style={[styles.rowName, { color: theme.text }]}>{item.shopType}</Text>
                  <Text style={[styles.rowSub, { color: theme.textMuted }]}>
                    {item.count} {ur ? 'اشیاء' : 'items'}
                  </Text>
                </View>
                {selected ? (
                  <Ionicons name="checkmark-circle" size={22} color={theme.primary} />
                ) : (
                  <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
                )}
              </Pressable>
            );
          }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Spacing.md },
  title: { fontSize: 20, fontWeight: '800', flex: 1 },
  closeBtn: { padding: 4 },
  subtitle: { fontSize: 13, marginBottom: Spacing.md, lineHeight: 18 },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1, borderRadius: BorderRadius.md, paddingHorizontal: 12, paddingVertical: 10,
    marginBottom: Spacing.md,
  },
  searchInput: { flex: 1, fontSize: 15, padding: 0 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1, borderRadius: BorderRadius.md, padding: 14, marginBottom: 10,
  },
  rowIcon: { fontSize: 26 },
  rowText: { flex: 1 },
  rowName: { fontSize: 15, fontWeight: '700' },
  rowSub: { fontSize: 12, marginTop: 2 },
});
