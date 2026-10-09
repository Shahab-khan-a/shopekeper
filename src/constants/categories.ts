import { Ionicons } from '@expo/vector-icons';
import { ProductCategory, ProductUnit } from '@/types';

export interface CategoryOption {
  key: ProductCategory;
  labelEn: string;
  labelUrdu: string;
  icon: keyof typeof Ionicons.glyphMap;
  subtitle: string;
}

export interface UnitOption {
  key: ProductUnit;
  labelEn: string;
  labelUrdu: string;
  icon: keyof typeof Ionicons.glyphMap;
  shortCode: string;
}

/**
 * Master catalog category options with localized labels and icons
 */
export const CATEGORY_OPTIONS: CategoryOption[] = [
  { key: 'Kiryana', labelEn: 'Kiryana', labelUrdu: 'کریانہ', icon: 'storefront-outline', subtitle: 'General Store' },
  { key: 'Grocery', labelEn: 'Grocery', labelUrdu: 'گروسری', icon: 'cart-outline', subtitle: 'Pulses, Flour, Oil' },
  { key: 'Beverages', labelEn: 'Beverages', labelUrdu: 'مشروبات', icon: 'wine-outline', subtitle: 'Cold Drinks, Juices, Tea' },
  { key: 'Dairy', labelEn: 'Dairy', labelUrdu: 'دودھ و دہی', icon: 'nutrition-outline', subtitle: 'Milk, Yogurt, Butter, Eggs' },
  { key: 'Snacks', labelEn: 'Snacks', labelUrdu: 'اسنیکس و بسکٹ', icon: 'pizza-outline', subtitle: 'Chips, Biscuits, Nimko' },
  { key: 'Spices', labelEn: 'Spices', labelUrdu: 'مصالحہ جات', icon: 'flame-outline', subtitle: 'Spices, Salt, Masalas' },
  { key: 'Personal Care', labelEn: 'Personal Care', labelUrdu: 'صابن و سرف', icon: 'sparkles-outline', subtitle: 'Soaps, Shampoos, Detergent' },
  { key: 'Bakery', labelEn: 'Bakery', labelUrdu: 'بیکری', icon: 'cafe-outline', subtitle: 'Bread, Rusk, Cakes' },
  { key: 'Others', labelEn: 'Others', labelUrdu: 'دیگر', icon: 'grid-outline', subtitle: 'General & Miscellaneous' },
];

/**
 * Standard unit options for inventory measurement
 */
export const UNIT_OPTIONS: UnitOption[] = [
  { key: 'piece', labelEn: 'Piece', labelUrdu: 'پیس / عدد', icon: 'cube-outline', shortCode: 'pc' },
  { key: 'kg', labelEn: 'Kilogram', labelUrdu: 'کلوگرام', icon: 'scale-outline', shortCode: 'kg' },
  { key: 'packet', labelEn: 'Packet', labelUrdu: 'پیکٹ', icon: 'bag-handle-outline', shortCode: 'pkt' },
  { key: 'litre', labelEn: 'Litre', labelUrdu: 'لیٹر', icon: 'water-outline', shortCode: 'L' },
  { key: 'dozen', labelEn: 'Dozen', labelUrdu: 'درجن (12)', icon: 'apps-outline', shortCode: 'dz' },
  { key: 'box', labelEn: 'Box / Carton', labelUrdu: 'ڈبہ / کاٹن', icon: 'archive-outline', shortCode: 'box' },
  { key: 'gram', labelEn: 'Gram', labelUrdu: 'گرام', icon: 'speedometer-outline', shortCode: 'g' },
];

/**
 * Array of all selectable product categories (excluding 'All')
 */
export const PRODUCT_CATEGORIES: ProductCategory[] = CATEGORY_OPTIONS.map((c) => c.key);

/**
 * Filter categories used on the Sale / Counter screen
 */
export const SALE_CATEGORIES: ProductCategory[] = [
  'All',
  ...PRODUCT_CATEGORIES,
];

/**
 * Filter categories used on the Products management screen (includes LowStock filter chip)
 */
export const PRODUCTS_FILTER_CATEGORIES: (ProductCategory | 'LowStock')[] = [
  'All',
  'LowStock',
  ...PRODUCT_CATEGORIES,
];

/**
 * Array of all supported product unit keys
 */
export const PRODUCT_UNITS: ProductUnit[] = UNIT_OPTIONS.map((u) => u.key);

/**
 * Helper to retrieve localized category name
 */
export function getCategoryLabel(category: ProductCategory, language: 'en' | 'ur'): string {
  if (category === 'All') return language === 'ur' ? 'تمام' : 'All';
  const found = CATEGORY_OPTIONS.find((c) => c.key === category);
  return found ? (language === 'ur' ? found.labelUrdu : found.labelEn) : category;
}

/**
 * Helper to retrieve category icon
 */
export function getCategoryIcon(category: ProductCategory): keyof typeof Ionicons.glyphMap {
  const found = CATEGORY_OPTIONS.find((c) => c.key === category);
  return found ? found.icon : 'pricetag-outline';
}

/**
 * Helper to retrieve localized unit short code
 */
export function getUnitShortCode(unit: ProductUnit, language: 'en' | 'ur'): string {
  const found = UNIT_OPTIONS.find((u) => u.key === unit);
  if (!found) return unit;
  return language === 'ur' ? found.labelUrdu : found.shortCode;
}
