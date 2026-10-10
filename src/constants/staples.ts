import { ProductCategory, ProductUnit } from '@/types';
import { Ionicons } from '@expo/vector-icons';

export interface StapleItem {
  id: string;
  name: string;
  nameUrdu: string;
  category: ProductCategory;
  unit: ProductUnit;
  image?: string;
  icon: keyof typeof Ionicons.glyphMap;
  tag?: string;
}

/**
 * High-frequency Pakistani Kiryana & retail grocery staples.
 * Shopkeepers can tap any staple template to prefill:
 * - English Name
 * - Urdu Name
 * - Category
 * - Unit
 * - Preset Photo
 * Leaves barcode empty for physical laser scanner input or loose goods.
 */
export const STAPLE_ITEMS: StapleItem[] = [
  // ── Kiryana & Core Staples ──
  {
    id: 'staple_sugar',
    name: 'Sugar (چینی)',
    nameUrdu: 'چینی',
    category: 'Kiryana',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=400&auto=format&fit=crop&q=80',
    icon: 'cube-outline',
    tag: 'Loose / پیک',
  },
  {
    id: 'staple_atta',
    name: 'Wheat Flour / Atta (آٹا)',
    nameUrdu: 'گندم کا آٹا',
    category: 'Kiryana',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80',
    icon: 'nutrition-outline',
    tag: '10kg / 20kg / کھلا',
  },
  {
    id: 'staple_rice_basmati',
    name: 'Super Basmati Rice (باسمتی چاول)',
    nameUrdu: 'سپر باسمتی چاول',
    category: 'Kiryana',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80',
    icon: 'leaf-outline',
    tag: 'چاول',
  },
  {
    id: 'staple_ghee_1kg',
    name: 'Banaspati Ghee (بناسپتی گھی)',
    nameUrdu: 'بناسپتی گھی 1 کلو',
    category: 'Kiryana',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80',
    icon: 'water-outline',
    tag: 'گھی',
  },
  {
    id: 'staple_cooking_oil',
    name: 'Cooking Oil (کوکنگ آئل)',
    nameUrdu: 'کوکنگ آئل 1 لیٹر',
    category: 'Kiryana',
    unit: 'litre',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80',
    icon: 'beaker-outline',
    tag: 'تیل',
  },

  // ── Pulses / Dalen ──
  {
    id: 'staple_daal_chana',
    name: 'Daal Chana (دال چنا)',
    nameUrdu: 'دال چنا',
    category: 'Grocery',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
    icon: 'basket-outline',
    tag: 'دالیں',
  },
  {
    id: 'staple_daal_moong',
    name: 'Daal Moong (دال مونگ دھوئی)',
    nameUrdu: 'دال مونگ',
    category: 'Grocery',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
    icon: 'basket-outline',
    tag: 'دالیں',
  },
  {
    id: 'staple_daal_masoor',
    name: 'Daal Masoor (دال مسور)',
    nameUrdu: 'دال مسور',
    category: 'Grocery',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
    icon: 'basket-outline',
    tag: 'دالیں',
  },
  {
    id: 'staple_daal_mash',
    name: 'Daal Mash (دال ماش دھوئی)',
    nameUrdu: 'دال ماش',
    category: 'Grocery',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
    icon: 'basket-outline',
    tag: 'دالیں',
  },
  {
    id: 'staple_white_chana',
    name: 'White Chana / Chickpeas (سفید چنے)',
    nameUrdu: 'سفید چنے',
    category: 'Grocery',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
    icon: 'basket-outline',
    tag: 'چنے',
  },
  {
    id: 'staple_besan',
    name: 'Gram Flour / Besan (بیسن)',
    nameUrdu: 'خالص بیسن',
    category: 'Grocery',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80',
    icon: 'layers-outline',
    tag: 'بیسن',
  },

  // ── Tea & Beverages ──
  {
    id: 'staple_tea_tapal',
    name: 'Tapal Danedar Tea (ٹپال دانے دار)',
    nameUrdu: 'ٹپال دانے دار چائے',
    category: 'Beverages',
    unit: 'packet',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=80',
    icon: 'cafe-outline',
    tag: 'چائے',
  },
  {
    id: 'staple_tea_lipton',
    name: 'Lipton Yellow Label Tea (لپٹن چائے)',
    nameUrdu: 'لپٹن یلو لیبل چائے',
    category: 'Beverages',
    unit: 'packet',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=80',
    icon: 'cafe-outline',
    tag: 'چائے',
  },
  {
    id: 'staple_rooh_afza',
    name: 'Rooh Afza 800ml (روح افزا)',
    nameUrdu: 'روح افزا شربت',
    category: 'Beverages',
    unit: 'piece',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80',
    icon: 'wine-outline',
    tag: 'شربت',
  },
  {
    id: 'staple_water_15l',
    name: 'Mineral Water 1.5L (منرل واٹر)',
    nameUrdu: 'منرل واٹر 1.5 لیٹر',
    category: 'Beverages',
    unit: 'piece',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80',
    icon: 'water-outline',
    tag: 'پانی',
  },

  // ── Dairy & Eggs ──
  {
    id: 'staple_milk_loose',
    name: 'Fresh Milk (تازہ کھلا دودھ)',
    nameUrdu: 'تازہ کھلا دودھ',
    category: 'Dairy',
    unit: 'litre',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80',
    icon: 'nutrition-outline',
    tag: 'دودھ',
  },
  {
    id: 'staple_milk_tetra',
    name: 'Tetra Pack Milk 1L (دودھ ڈبہ)',
    nameUrdu: 'ٹیٹرا پیک دودھ 1 لیٹر',
    category: 'Dairy',
    unit: 'piece',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80',
    icon: 'nutrition-outline',
    tag: 'الپرز/ملک پیک',
  },
  {
    id: 'staple_eggs',
    name: 'Farm Eggs (فارمی انڈے)',
    nameUrdu: 'فارمی انڈے (درجن)',
    category: 'Dairy',
    unit: 'dozen',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&auto=format&fit=crop&q=80',
    icon: 'egg-outline',
    tag: 'انڈے',
  },
  {
    id: 'staple_yogurt',
    name: 'Fresh Plain Yogurt / Dahi (دہی)',
    nameUrdu: 'تازہ دہی',
    category: 'Dairy',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80',
    icon: 'nutrition-outline',
    tag: 'دہی',
  },

  // ── Spices & Seasoning ──
  {
    id: 'staple_salt_national',
    name: 'National Iodized Salt 800g (نمک)',
    nameUrdu: 'نیشنل آئیوڈائزڈ نمک',
    category: 'Spices',
    unit: 'packet',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
    icon: 'flame-outline',
    tag: 'نمک',
  },
  {
    id: 'staple_red_chili',
    name: 'Red Chili Powder (لال مرچ پاؤڈر)',
    nameUrdu: 'پسی لال مرچ',
    category: 'Spices',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
    icon: 'flame-outline',
    tag: 'مرچ',
  },
  {
    id: 'staple_haldi',
    name: 'Turmeric Powder / Haldi (ہلدی پاؤڈر)',
    nameUrdu: 'خالص ہلدی پاؤڈر',
    category: 'Spices',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
    icon: 'flame-outline',
    tag: 'ہلدی',
  },
  {
    id: 'staple_zeera',
    name: 'White Cumin / Zeera (سفید زیرہ)',
    nameUrdu: 'سفید زیرہ',
    category: 'Spices',
    unit: 'gram',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
    icon: 'flame-outline',
    tag: 'زیرہ',
  },

  // ── Personal & Home Care ──
  {
    id: 'staple_surf_detergent',
    name: 'Washing Detergent Powder / Surf (سرف)',
    nameUrdu: 'واشنگ پاؤڈر / سرف',
    category: 'Personal Care',
    unit: 'packet',
    image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&auto=format&fit=crop&q=80',
    icon: 'sparkles-outline',
    tag: 'سرف',
  },
  {
    id: 'staple_soap_lux',
    name: 'Beauty Bath Soap (نہانے کا صابن)',
    nameUrdu: 'لکس / لائف بوائے صابن',
    category: 'Personal Care',
    unit: 'piece',
    image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&auto=format&fit=crop&q=80',
    icon: 'sparkles-outline',
    tag: 'صابن',
  },
  {
    id: 'staple_dishwash_bar',
    name: 'Dishwash Bar / Vim (برتن دھونے کا صابن)',
    nameUrdu: 'برتن دھونے کا صابن',
    category: 'Personal Care',
    unit: 'piece',
    image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&auto=format&fit=crop&q=80',
    icon: 'sparkles-outline',
    tag: 'صابن',
  },

  // ── Bakery & Snacks ──
  {
    id: 'staple_bread_large',
    name: 'Plain Bread Large (ڈبل روٹی)',
    nameUrdu: 'ڈبل روٹی بڑی',
    category: 'Bakery',
    unit: 'piece',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format&fit=crop&q=80',
    icon: 'cafe-outline',
    tag: 'روٹی',
  },
  {
    id: 'staple_rusk',
    name: 'Crispy Rusk / Papay (رس / پاپے)',
    nameUrdu: 'رس / پاپے',
    category: 'Bakery',
    unit: 'packet',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format&fit=crop&q=80',
    icon: 'cafe-outline',
    tag: 'رس',
  },
  {
    id: 'staple_biscuit_sooper',
    name: 'Tea Biscuits / Sooper (چائے کے بسکٹ)',
    nameUrdu: 'سوپر / چائے بسکٹ',
    category: 'Snacks',
    unit: 'packet',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format&fit=crop&q=80',
    icon: 'pizza-outline',
    tag: 'بسکٹ',
  },
];
