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
    name: 'White Sugar',
    nameUrdu: 'چینی',
    category: 'Kiryana',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=400&auto=format&fit=crop&q=80',
    icon: 'cube-outline',
    tag: 'Loose / Pack',
  },
  {
    id: 'staple_atta',
    name: 'Wheat Flour (Atta)',
    nameUrdu: 'گندم کا آٹا',
    category: 'Kiryana',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80',
    icon: 'nutrition-outline',
    tag: 'Flour Bag',
  },
  {
    id: 'staple_rice_basmati',
    name: 'Super Basmati Rice',
    nameUrdu: 'سپر باسمتی چاول',
    category: 'Kiryana',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80',
    icon: 'leaf-outline',
    tag: 'Rice',
  },
  {
    id: 'staple_ghee_1kg',
    name: 'Banaspati Ghee',
    nameUrdu: 'بناسپتی گھی 1 کلو',
    category: 'Kiryana',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80',
    icon: 'water-outline',
    tag: 'Ghee',
  },
  {
    id: 'staple_cooking_oil',
    name: 'Cooking Oil',
    nameUrdu: 'کوکنگ آئل 1 لیٹر',
    category: 'Kiryana',
    unit: 'litre',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80',
    icon: 'beaker-outline',
    tag: 'Cooking Oil',
  },

  // ── Pulses / Dalen ──
  {
    id: 'staple_daal_chana',
    name: 'Gram Pulse (Daal Chana)',
    nameUrdu: 'دال چنا',
    category: 'Grocery',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
    icon: 'basket-outline',
    tag: 'Pulses',
  },
  {
    id: 'staple_daal_moong',
    name: 'Yellow Lentils (Daal Moong)',
    nameUrdu: 'دال مونگ',
    category: 'Grocery',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
    icon: 'basket-outline',
    tag: 'Pulses',
  },
  {
    id: 'staple_daal_masoor',
    name: 'Red Lentils (Daal Masoor)',
    nameUrdu: 'دال مسور',
    category: 'Grocery',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
    icon: 'basket-outline',
    tag: 'Pulses',
  },
  {
    id: 'staple_daal_mash',
    name: 'White Lentils (Daal Mash)',
    nameUrdu: 'دال ماش',
    category: 'Grocery',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
    icon: 'basket-outline',
    tag: 'Pulses',
  },
  {
    id: 'staple_white_chana',
    name: 'White Chickpeas',
    nameUrdu: 'سفید چنے',
    category: 'Grocery',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
    icon: 'basket-outline',
    tag: 'Chickpeas',
  },
  {
    id: 'staple_besan',
    name: 'Gram Flour (Besan)',
    nameUrdu: 'خالص بیسن',
    category: 'Grocery',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80',
    icon: 'layers-outline',
    tag: 'Gram Flour',
  },

  // ── Tea & Beverages ──
  {
    id: 'staple_tea_tapal',
    name: 'Tapal Danedar Tea',
    nameUrdu: 'ٹپال دانے دار چائے',
    category: 'Beverages',
    unit: 'packet',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=80',
    icon: 'cafe-outline',
    tag: 'Black Tea',
  },
  {
    id: 'staple_tea_lipton',
    name: 'Lipton Yellow Label Tea',
    nameUrdu: 'لپٹن یلو لیبل چائے',
    category: 'Beverages',
    unit: 'packet',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=80',
    icon: 'cafe-outline',
    tag: 'Black Tea',
  },
  {
    id: 'staple_rooh_afza',
    name: 'Rooh Afza Syrup 800ml',
    nameUrdu: 'روح افزا شربت',
    category: 'Beverages',
    unit: 'piece',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80',
    icon: 'wine-outline',
    tag: 'Syrup Drink',
  },
  {
    id: 'staple_water_15l',
    name: 'Mineral Water 1.5L',
    nameUrdu: 'منرل واٹر 1.5 لیٹر',
    category: 'Beverages',
    unit: 'piece',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80',
    icon: 'water-outline',
    tag: 'Bottled Water',
  },

  // ── Dairy & Eggs ──
  {
    id: 'staple_milk_loose',
    name: 'Fresh Loose Milk',
    nameUrdu: 'تازہ کھلا دودھ',
    category: 'Dairy',
    unit: 'litre',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80',
    icon: 'nutrition-outline',
    tag: 'Fresh Milk',
  },
  {
    id: 'staple_milk_tetra',
    name: 'Tetra Pack Milk 1L',
    nameUrdu: 'ٹیٹرا پیک دودھ 1 لیٹر',
    category: 'Dairy',
    unit: 'piece',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80',
    icon: 'nutrition-outline',
    tag: 'Box Milk',
  },
  {
    id: 'staple_eggs',
    name: 'Farm Eggs (Dozen)',
    nameUrdu: 'فارمی انڈے (درجن)',
    category: 'Dairy',
    unit: 'dozen',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&auto=format&fit=crop&q=80',
    icon: 'egg-outline',
    tag: 'Eggs',
  },
  {
    id: 'staple_yogurt',
    name: 'Fresh Plain Yogurt (Dahi)',
    nameUrdu: 'تازہ دہی',
    category: 'Dairy',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80',
    icon: 'nutrition-outline',
    tag: 'Yogurt',
  },

  // ── Spices & Seasoning ──
  {
    id: 'staple_salt_national',
    name: 'National Iodized Salt 800g',
    nameUrdu: 'نیشنل آئیوڈائزڈ نمک',
    category: 'Spices',
    unit: 'packet',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
    icon: 'flame-outline',
    tag: 'Table Salt',
  },
  {
    id: 'staple_red_chili',
    name: 'Red Chili Powder',
    nameUrdu: 'پسی لال مرچ',
    category: 'Spices',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
    icon: 'flame-outline',
    tag: 'Spices',
  },
  {
    id: 'staple_haldi',
    name: 'Turmeric Powder (Haldi)',
    nameUrdu: 'خالص ہلدی پاؤڈر',
    category: 'Spices',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
    icon: 'flame-outline',
    tag: 'Spices',
  },
  {
    id: 'staple_zeera',
    name: 'White Cumin (Zeera)',
    nameUrdu: 'سفید زیرہ',
    category: 'Spices',
    unit: 'gram',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
    icon: 'flame-outline',
    tag: 'Spices',
  },

  // ── Personal & Home Care ──
  {
    id: 'staple_surf_detergent',
    name: 'Washing Powder (Detergent)',
    nameUrdu: 'واشنگ پاؤڈر / سرف',
    category: 'Personal Care',
    unit: 'packet',
    image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&auto=format&fit=crop&q=80',
    icon: 'sparkles-outline',
    tag: 'Detergent',
  },
  {
    id: 'staple_soap_lux',
    name: 'Bath Soap Bar',
    nameUrdu: 'لکس / لائف بوائے صابن',
    category: 'Personal Care',
    unit: 'piece',
    image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&auto=format&fit=crop&q=80',
    icon: 'sparkles-outline',
    tag: 'Soap Bar',
  },
  {
    id: 'staple_dishwash_bar',
    name: 'Dishwash Bar',
    nameUrdu: 'برتن دھونے کا صابن',
    category: 'Personal Care',
    unit: 'piece',
    image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&auto=format&fit=crop&q=80',
    icon: 'sparkles-outline',
    tag: 'Dishwash',
  },

  // ── Bakery & Snacks ──
  {
    id: 'staple_bread_large',
    name: 'Plain Bread Large',
    nameUrdu: 'ڈبل روٹی بڑی',
    category: 'Bakery',
    unit: 'piece',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format&fit=crop&q=80',
    icon: 'cafe-outline',
    tag: 'Bread',
  },
  {
    id: 'staple_rusk',
    name: 'Crispy Tea Rusk',
    nameUrdu: 'رس / پاپے',
    category: 'Bakery',
    unit: 'packet',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format&fit=crop&q=80',
    icon: 'cafe-outline',
    tag: 'Rusk',
  },
  {
    id: 'staple_biscuit_sooper',
    name: 'Tea Biscuits (Pack)',
    nameUrdu: 'سوپر / چائے بسکٹ',
    category: 'Snacks',
    unit: 'packet',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format&fit=crop&q=80',
    icon: 'pizza-outline',
    tag: 'Biscuits',
  },
];
