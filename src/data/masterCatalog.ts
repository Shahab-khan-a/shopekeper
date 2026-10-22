import type { ProductUnit } from '@/types';

export interface CatalogItem {
  name: string;
  nameUrdu?: string;
  unit: ProductUnit;
  price: number; // typical Pakistan retail estimate in Rs. — editable per shop
  icon: string; // MaterialCommunityIcons glyph name (see src/components/CatalogIcon.tsx)
}

export interface CatalogCategory { name: string; icon: string; items: CatalogItem[] }

export interface CatalogShopType { shopType: string; icon: string; categories: CatalogCategory[] }

/**
 * Master quick-add catalog: ready-made product lists per shop type.
 * Items carry a Material Community Icons glyph (7,400+ icon set, bundled
 * with @expo/vector-icons) instead of photos — always available offline,
 * zero image weight, and the glyph always matches the item's class.
 * Prices are starting estimates.
 */
export const MASTER_CATALOG: CatalogShopType[] = [
 {
  "shopType": "Kiryana & General Store",
  "icon": "store",
  "categories": [
   {
    "name": "Atta, Rice & Grains",
    "icon": "barley",
    "items": [
     {
      "name": "Wheat Flour (Atta) 10kg Bag",
      "unit": "packet",
      "price": 1350,
      "icon": "barley",
      "nameUrdu": "آٹا"
     },
     {
      "name": "Wheat Flour (Atta) 20kg Bag",
      "unit": "packet",
      "price": 2650,
      "icon": "barley",
      "nameUrdu": "آٹا"
     },
     {
      "name": "Super Kernel Basmati Rice 1kg",
      "unit": "packet",
      "price": 420,
      "icon": "rice",
      "nameUrdu": "چاول"
     },
     {
      "name": "Super Kernel Basmati Rice 5kg",
      "unit": "packet",
      "price": 2050,
      "icon": "rice",
      "nameUrdu": "چاول"
     },
     {
      "name": "Irri-6 Coarse Rice 1kg",
      "unit": "kg",
      "price": 260,
      "icon": "rice",
      "nameUrdu": "چاول"
     },
     {
      "name": "Sella Basmati Rice 1kg",
      "unit": "kg",
      "price": 480,
      "icon": "rice",
      "nameUrdu": "چاول"
     },
     {
      "name": "Broken Rice (Tota) 1kg",
      "unit": "kg",
      "price": 230,
      "icon": "rice",
      "nameUrdu": "ٹوٹا چاول"
     },
     {
      "name": "Corn Flour (Makai Atta) 1kg",
      "unit": "packet",
      "price": 260,
      "icon": "barley",
      "nameUrdu": "مکئی کا آٹا"
     },
     {
      "name": "Barley Flour (Jau Atta) 1kg",
      "unit": "packet",
      "price": 300,
      "icon": "barley",
      "nameUrdu": "جو کا آٹا"
     },
     {
      "name": "Gram Flour (Besan) 1kg",
      "unit": "packet",
      "price": 480,
      "icon": "barley",
      "nameUrdu": "بیسن"
     },
     {
      "name": "Maize (Makai) Grains 1kg",
      "unit": "kg",
      "price": 240,
      "icon": "barley",
      "nameUrdu": "مکئی"
     },
     {
      "name": "Rice Flour 1kg",
      "unit": "packet",
      "price": 300,
      "icon": "barley",
      "nameUrdu": "چاول کا آٹا"
     }
    ]
   },
   {
    "name": "Dal & Pulses",
    "icon": "bowl",
    "items": [
     {
      "name": "Masoor Dal (Red Lentils) 1kg",
      "unit": "kg",
      "price": 330,
      "icon": "bowl",
      "nameUrdu": "مسور کی دال"
     },
     {
      "name": "Moong Dal (Yellow) 1kg",
      "unit": "kg",
      "price": 420,
      "icon": "bowl",
      "nameUrdu": "مونگ کی دال"
     },
     {
      "name": "Chana Dal 1kg",
      "unit": "kg",
      "price": 380,
      "icon": "bowl",
      "nameUrdu": "چنے کی دال"
     },
     {
      "name": "Whole Black Gram (Kala Chana) 1kg",
      "unit": "kg",
      "price": 340,
      "icon": "bowl",
      "nameUrdu": "کالا چنا"
     },
     {
      "name": "White Chickpeas (Safed Chana) 1kg",
      "unit": "kg",
      "price": 380,
      "icon": "bowl",
      "nameUrdu": "سفید چنا"
     },
     {
      "name": "Mash Dal (White Urad) 1kg",
      "unit": "kg",
      "price": 460,
      "icon": "bowl",
      "nameUrdu": "ماش کی دال"
     },
     {
      "name": "Arhar/Tur Dal 1kg",
      "unit": "kg",
      "price": 450,
      "icon": "bowl",
      "nameUrdu": "ارہر کی دال"
     },
     {
      "name": "Mix Dal (Panchrangi) 1kg",
      "unit": "kg",
      "price": 420,
      "icon": "bowl",
      "nameUrdu": "مکس دال"
     },
     {
      "name": "Whole Masoor (Sabut) 1kg",
      "unit": "kg",
      "price": 350,
      "icon": "bowl",
      "nameUrdu": "ثابت مسور"
     },
     {
      "name": "Green Moong (Sabut) 1kg",
      "unit": "kg",
      "price": 440,
      "icon": "bowl",
      "nameUrdu": "ثابت مونگ"
     }
    ]
   },
   {
    "name": "Ghee & Cooking Oils",
    "icon": "oil",
    "items": [
     {
      "name": "Dalda Banaspati Ghee 5kg Tin",
      "unit": "packet",
      "price": 2650,
      "icon": "oil",
      "nameUrdu": "بناسپتی گھی"
     },
     {
      "name": "Dalda Banaspati Ghee 2.5kg",
      "unit": "packet",
      "price": 1350,
      "icon": "oil",
      "nameUrdu": "بناسپتی گھی"
     },
     {
      "name": "Canola Cooking Oil 1 Litre",
      "unit": "litre",
      "price": 520,
      "icon": "oil",
      "nameUrdu": "کھانے کا تیل"
     },
     {
      "name": "Canola Cooking Oil 5 Litre",
      "unit": "packet",
      "price": 2550,
      "icon": "oil",
      "nameUrdu": "کھانے کا تیل"
     },
     {
      "name": "Sunflower Oil 1 Litre",
      "unit": "litre",
      "price": 560,
      "icon": "oil",
      "nameUrdu": "سورج مکھی کا تیل"
     },
     {
      "name": "Mustard Oil (Sarson) 1 Litre",
      "unit": "litre",
      "price": 480,
      "icon": "oil",
      "nameUrdu": "سرسوں کا تیل"
     },
     {
      "name": "Olive Oil 500ml",
      "unit": "piece",
      "price": 1450,
      "icon": "oil",
      "nameUrdu": "زیتون کا تیل"
     },
     {
      "name": "Desi Ghee 1kg",
      "unit": "kg",
      "price": 2200,
      "icon": "oil",
      "nameUrdu": "دیسی گھی"
     },
     {
      "name": "Fortified Cooking Oil 1 Litre",
      "unit": "litre",
      "price": 540,
      "icon": "oil",
      "nameUrdu": "کھانے کا تیل"
     },
     {
      "name": "Cooking Oil 250ml Pouch",
      "unit": "packet",
      "price": 150,
      "icon": "oil",
      "nameUrdu": "کھانے کا تیل"
     }
    ]
   },
   {
    "name": "Sugar, Salt & Sweeteners",
    "icon": "spoon-sugar",
    "items": [
     {
      "name": "Sugar 1kg",
      "unit": "packet",
      "price": 175,
      "icon": "spoon-sugar",
      "nameUrdu": "چینی"
     },
     {
      "name": "Sugar 5kg",
      "unit": "packet",
      "price": 860,
      "icon": "spoon-sugar",
      "nameUrdu": "چینی"
     },
     {
      "name": "Iodized Salt 800g",
      "unit": "packet",
      "price": 120,
      "icon": "spoon-sugar",
      "nameUrdu": "نمک"
     },
     {
      "name": "Rock Salt (Kala Namak) 200g",
      "unit": "packet",
      "price": 90,
      "icon": "spoon-sugar",
      "nameUrdu": "کالا نمک"
     },
     {
      "name": "Pink Himalayan Salt 500g",
      "unit": "packet",
      "price": 260,
      "icon": "necklace",
      "nameUrdu": "پہاڑی نمک"
     },
     {
      "name": "Brown Sugar (Shakkar) 1kg",
      "unit": "kg",
      "price": 260,
      "icon": "spoon-sugar",
      "nameUrdu": "شکر"
     },
     {
      "name": "Gur (Jaggery) 1kg",
      "unit": "kg",
      "price": 320,
      "icon": "spoon-sugar",
      "nameUrdu": "گڑ"
     },
     {
      "name": "Honey 250g",
      "unit": "piece",
      "price": 850,
      "icon": "bee",
      "nameUrdu": "شہد"
     }
    ]
   },
   {
    "name": "Tea & Beverages",
    "icon": "tea",
    "items": [
     {
      "name": "Tapal Danedar Tea 475g",
      "unit": "packet",
      "price": 1150,
      "icon": "tea",
      "nameUrdu": "چائے"
     },
     {
      "name": "Tapal Danedar Tea 190g",
      "unit": "packet",
      "price": 480,
      "icon": "tea",
      "nameUrdu": "چائے"
     },
     {
      "name": "Lipton Yellow Label 475g",
      "unit": "packet",
      "price": 1180,
      "icon": "tea",
      "nameUrdu": "چائے"
     },
     {
      "name": "Supreme Tea 475g",
      "unit": "packet",
      "price": 1080,
      "icon": "tea",
      "nameUrdu": "چائے"
     },
     {
      "name": "Vital Tea 450g",
      "unit": "packet",
      "price": 1050,
      "icon": "tea",
      "nameUrdu": "چائے"
     },
     {
      "name": "Tetley Tea Bags 100ct",
      "unit": "box",
      "price": 950,
      "icon": "tea",
      "nameUrdu": "چائے"
     },
     {
      "name": "Green Tea (Kahwa) 250g",
      "unit": "packet",
      "price": 650,
      "icon": "tea",
      "nameUrdu": "کہوہ"
     },
     {
      "name": "Milk Powder 1kg (Nido)",
      "unit": "packet",
      "price": 2450,
      "icon": "cow",
      "nameUrdu": "دودھ"
     },
     {
      "name": "Milk Powder 400g",
      "unit": "packet",
      "price": 1050,
      "icon": "cow",
      "nameUrdu": "دودھ"
     },
     {
      "name": "Rooh Afza 800ml",
      "unit": "piece",
      "price": 520,
      "icon": "tea",
      "nameUrdu": "روح افزا"
     },
     {
      "name": "Rooh Afza 1500ml",
      "unit": "piece",
      "price": 890,
      "icon": "tea",
      "nameUrdu": "روح افزا"
     },
     {
      "name": "Tang Orange 1kg",
      "unit": "packet",
      "price": 1150,
      "icon": "fruit-citrus",
      "nameUrdu": "ٹینگ"
     }
    ]
   },
   {
    "name": "Spices & Masalas",
    "icon": "chili-hot",
    "items": [
     {
      "name": "Red Chilli Powder 200g",
      "unit": "packet",
      "price": 420,
      "icon": "chili-hot",
      "nameUrdu": "لال مرچ"
     },
     {
      "name": "Whole Red Chillies 250g",
      "unit": "packet",
      "price": 380,
      "icon": "chili-hot",
      "nameUrdu": "ثابت لال مرچ"
     },
     {
      "name": "Turmeric Powder (Haldi) 200g",
      "unit": "packet",
      "price": 320,
      "icon": "chili-hot",
      "nameUrdu": "ہلدی"
     },
     {
      "name": "Coriander Powder (Dhania) 200g",
      "unit": "packet",
      "price": 380,
      "icon": "leaf",
      "nameUrdu": "دھنیا"
     },
     {
      "name": "Cumin Seeds (Zeera) 100g",
      "unit": "packet",
      "price": 420,
      "icon": "seed",
      "nameUrdu": "زیرہ"
     },
     {
      "name": "Black Pepper (Kali Mirch) 100g",
      "unit": "packet",
      "price": 550,
      "icon": "chili-hot",
      "nameUrdu": "کالی مرچ"
     },
     {
      "name": "Garam Masala 100g",
      "unit": "packet",
      "price": 380,
      "icon": "chili-hot",
      "nameUrdu": "گرم مصالحہ"
     },
     {
      "name": "Chicken Masala 50g",
      "unit": "packet",
      "price": 130,
      "icon": "food-drumstick",
      "nameUrdu": "چکن مصالحہ"
     },
     {
      "name": "Biryani Masala 50g",
      "unit": "packet",
      "price": 130,
      "icon": "pot",
      "nameUrdu": "بریانی مصالحہ"
     },
     {
      "name": "Qorma Masala 50g",
      "unit": "packet",
      "price": 130,
      "icon": "chili-hot",
      "nameUrdu": "قورمہ مصالحہ"
     },
     {
      "name": "Karahi Masala 50g",
      "unit": "packet",
      "price": 130,
      "icon": "pot",
      "nameUrdu": "کڑاہی مصالحہ"
     },
     {
      "name": "Chaat Masala 100g",
      "unit": "packet",
      "price": 220,
      "icon": "chili-hot",
      "nameUrdu": "چاٹ مصالحہ"
     },
     {
      "name": "Whole Garam Masala Mix 100g",
      "unit": "packet",
      "price": 350,
      "icon": "chili-hot",
      "nameUrdu": "ثابت گرم مصالحہ"
     },
     {
      "name": "Green Cardamom (Elaichi) 50g",
      "unit": "packet",
      "price": 650,
      "icon": "chili-hot",
      "nameUrdu": "الائچی"
     },
     {
      "name": "Cloves (Laung) 50g",
      "unit": "packet",
      "price": 450,
      "icon": "chili-hot",
      "nameUrdu": "لونگ"
     },
     {
      "name": "Cinnamon (Darcheeni) 100g",
      "unit": "packet",
      "price": 320,
      "icon": "chili-hot",
      "nameUrdu": "دار چینی"
     },
     {
      "name": "Fennel Seeds (Saunf) 100g",
      "unit": "packet",
      "price": 280,
      "icon": "seed",
      "nameUrdu": "سونف"
     },
     {
      "name": "Mustard Seeds (Rai) 100g",
      "unit": "packet",
      "price": 160,
      "icon": "seed",
      "nameUrdu": "رائی"
     }
    ]
   },
   {
    "name": "Biscuits & Snacks",
    "icon": "cookie",
    "items": [
     {
      "name": "Sooper Biscuits (EBM)",
      "unit": "packet",
      "price": 120,
      "icon": "cookie",
      "nameUrdu": "بسکٹ"
     },
     {
      "name": "Marie Biscuits 1 Pack",
      "unit": "packet",
      "price": 110,
      "icon": "cookie",
      "nameUrdu": "بسکٹ"
     },
     {
      "name": "Candy Biscuits 1 Pack",
      "unit": "packet",
      "price": 100,
      "icon": "cookie",
      "nameUrdu": "بسکٹ"
     },
     {
      "name": "Gluco Biscuits 1 Pack",
      "unit": "packet",
      "price": 110,
      "icon": "cookie",
      "nameUrdu": "بسکٹ"
     },
     {
      "name": "Zeera Plus Biscuits",
      "unit": "packet",
      "price": 120,
      "icon": "cookie",
      "nameUrdu": "بسکٹ"
     },
     {
      "name": "Rio Chocolate Biscuits",
      "unit": "packet",
      "price": 130,
      "icon": "cookie",
      "nameUrdu": "بسکٹ"
     },
     {
      "name": "Chocolate Chip Cookies 1 Pack",
      "unit": "packet",
      "price": 160,
      "icon": "cookie",
      "nameUrdu": "بسکٹ"
     },
     {
      "name": "Lays Chips Salted",
      "unit": "packet",
      "price": 80,
      "icon": "popcorn",
      "nameUrdu": "چپس"
     },
     {
      "name": "Kurkure Masala Munch",
      "unit": "packet",
      "price": 80,
      "icon": "cookie",
      "nameUrdu": "کرکرے"
     },
     {
      "name": "Slanty Chips",
      "unit": "packet",
      "price": 60,
      "icon": "popcorn"
     },
     {
      "name": "Nimko Mix 500g",
      "unit": "packet",
      "price": 380,
      "icon": "cookie",
      "nameUrdu": "نمکو"
     },
     {
      "name": "Salted Peanuts 500g",
      "unit": "packet",
      "price": 550,
      "icon": "peanut",
      "nameUrdu": "مونگ پھلی"
     },
     {
      "name": "Roasted Chana 500g",
      "unit": "packet",
      "price": 380,
      "icon": "cookie",
      "nameUrdu": "بھنا چنا"
     },
     {
      "name": "Puffed Rice (Murmura) 250g",
      "unit": "packet",
      "price": 150,
      "icon": "rice",
      "nameUrdu": "مرمروں"
     },
     {
      "name": "Popcorn Kernels 500g",
      "unit": "packet",
      "price": 220,
      "icon": "popcorn"
     },
     {
      "name": "Dry Fruit Mix 500g",
      "unit": "packet",
      "price": 1400,
      "icon": "peanut",
      "nameUrdu": "ڈرائی فروٹ"
     },
     {
      "name": "Dates (Khajoor) 500g",
      "unit": "packet",
      "price": 650,
      "icon": "cookie",
      "nameUrdu": "کھجور"
     },
     {
      "name": "Almonds (Badam) 500g",
      "unit": "packet",
      "price": 1650,
      "icon": "peanut",
      "nameUrdu": "بادام"
     }
    ]
   },
   {
    "name": "Dairy Staples",
    "icon": "cow",
    "items": [
     {
      "name": "Milk 1 Litre (Olper's)",
      "unit": "packet",
      "price": 220,
      "icon": "cow",
      "nameUrdu": "دودھ"
     },
     {
      "name": "Milk 1 Litre (Milkpak)",
      "unit": "packet",
      "price": 230,
      "icon": "cow",
      "nameUrdu": "دودھ"
     },
     {
      "name": "Yogurt Cup 500g",
      "unit": "piece",
      "price": 180,
      "icon": "bowl",
      "nameUrdu": "دہی"
     },
     {
      "name": "Butter 200g (Nurpur)",
      "unit": "piece",
      "price": 380,
      "icon": "cheese",
      "nameUrdu": "مکھن"
     },
     {
      "name": "Cheese Slices 10ct",
      "unit": "packet",
      "price": 450,
      "icon": "cheese"
     },
     {
      "name": "Cream 200ml",
      "unit": "piece",
      "price": 220,
      "icon": "cheese",
      "nameUrdu": "ملائی"
     },
     {
      "name": "Eggs 1 Dozen",
      "unit": "dozen",
      "price": 420,
      "icon": "egg",
      "nameUrdu": "انڈے"
     },
     {
      "name": "Eggs Half Dozen",
      "unit": "dozen",
      "price": 215,
      "icon": "egg",
      "nameUrdu": "انڈے"
     }
    ]
   },
   {
    "name": "Personal Care",
    "icon": "lotion",
    "items": [
     {
      "name": "Lifebuoy Soap 115g",
      "unit": "piece",
      "price": 130,
      "icon": "lotion",
      "nameUrdu": "صابن"
     },
     {
      "name": "Lux Soap 115g",
      "unit": "piece",
      "price": 140,
      "icon": "lotion",
      "nameUrdu": "صابن"
     },
     {
      "name": "Safeguard Soap 115g",
      "unit": "piece",
      "price": 145,
      "icon": "lotion",
      "nameUrdu": "صابن"
     },
     {
      "name": "Dettol Soap 115g",
      "unit": "piece",
      "price": 150,
      "icon": "lotion",
      "nameUrdu": "صابن"
     },
     {
      "name": "Capri Soap 115g",
      "unit": "piece",
      "price": 135,
      "icon": "lotion",
      "nameUrdu": "صابن"
     },
     {
      "name": "Surf Excel Washing Powder 1kg",
      "unit": "packet",
      "price": 520,
      "icon": "washing-machine",
      "nameUrdu": "سرف"
     },
     {
      "name": "Detergent Bar (Bonux)",
      "unit": "piece",
      "price": 110,
      "icon": "washing-machine",
      "nameUrdu": "صابن"
     },
     {
      "name": "Shampoo Sachet (Sunsilk)",
      "unit": "piece",
      "price": 60,
      "icon": "bottle-tonic",
      "nameUrdu": "شیمپو"
     },
     {
      "name": "Shampoo 400ml (Clear)",
      "unit": "piece",
      "price": 1150,
      "icon": "bottle-tonic",
      "nameUrdu": "شیمپو"
     },
     {
      "name": "Toothpaste (Colgate 140g)",
      "unit": "piece",
      "price": 420,
      "icon": "toothbrush",
      "nameUrdu": "ٹوتھ پیسٹ"
     },
     {
      "name": "Toothbrush (Oral-B)",
      "unit": "piece",
      "price": 220,
      "icon": "toothbrush",
      "nameUrdu": "ٹوتھ برش"
     },
     {
      "name": "Hair Oil 200ml (Amla)",
      "unit": "piece",
      "price": 550,
      "icon": "oil",
      "nameUrdu": "تیل"
     },
     {
      "name": "Coconut Oil 200ml",
      "unit": "piece",
      "price": 480,
      "icon": "oil",
      "nameUrdu": "ناریل کا تیل"
     },
     {
      "name": "Talcum Powder 200g",
      "unit": "piece",
      "price": 420,
      "icon": "lotion",
      "nameUrdu": "پاؤڈر"
     },
     {
      "name": "Face Cream (Fair & Lovely)",
      "unit": "piece",
      "price": 380,
      "icon": "lotion",
      "nameUrdu": "کریم"
     },
     {
      "name": "Shaving Blades Pack (7 O'Clock)",
      "unit": "packet",
      "price": 180,
      "icon": "lock",
      "nameUrdu": "بلیڈ"
     }
    ]
   },
   {
    "name": "Household Cleaning",
    "icon": "spray-bottle",
    "items": [
     {
      "name": "Dish Soap Bar (Vim)",
      "unit": "piece",
      "price": 130,
      "icon": "spray-bottle",
      "nameUrdu": "برتن کا صابن"
     },
     {
      "name": "Dishwashing Liquid 500ml",
      "unit": "piece",
      "price": 380,
      "icon": "spray-bottle",
      "nameUrdu": "برتن دھونے کا صابن"
     },
     {
      "name": "Phenyl 1 Litre",
      "unit": "piece",
      "price": 220,
      "icon": "spray-bottle",
      "nameUrdu": "فینائل"
     },
     {
      "name": "Bleach 1 Litre",
      "unit": "piece",
      "price": 180,
      "icon": "spray-bottle",
      "nameUrdu": "بلیچ"
     },
     {
      "name": "Toilet Cleaner 725ml",
      "unit": "piece",
      "price": 550,
      "icon": "spray-bottle"
     },
     {
      "name": "Vim Bar Refill",
      "unit": "piece",
      "price": 95,
      "icon": "spray-bottle",
      "nameUrdu": "برتن کا صابن"
     },
     {
      "name": "Scrub Pad (Pack of 3)",
      "unit": "packet",
      "price": 120,
      "icon": "spray-bottle",
      "nameUrdu": "سکرب"
     },
     {
      "name": "Broom (Phool Jharu)",
      "unit": "piece",
      "price": 350,
      "icon": "spray-bottle",
      "nameUrdu": "جھاڑو"
     },
     {
      "name": "Mop (Pochha)",
      "unit": "piece",
      "price": 450,
      "icon": "spray-bottle",
      "nameUrdu": "پوچھا"
     },
     {
      "name": "Duster Cloth (Pack of 3)",
      "unit": "packet",
      "price": 200,
      "icon": "spray-bottle",
      "nameUrdu": "ڈسٹر"
     },
     {
      "name": "Garbage Bags (Roll)",
      "unit": "packet",
      "price": 250,
      "icon": "spray-bottle",
      "nameUrdu": "کچرے کی تھیلی"
     },
     {
      "name": "Incense Sticks (Agarbatti)",
      "unit": "packet",
      "price": 150,
      "icon": "spray-bottle",
      "nameUrdu": "اگربتی"
     },
     {
      "name": "Mosquito Coil (Pack)",
      "unit": "packet",
      "price": 180,
      "icon": "spray-bottle",
      "nameUrdu": "مچھر کی اگربتی"
     },
     {
      "name": "Matchbox (Pack of 10)",
      "unit": "packet",
      "price": 120,
      "icon": "fire",
      "nameUrdu": "ماچس"
     },
     {
      "name": "Candle (Pack of 6)",
      "unit": "packet",
      "price": 180,
      "icon": "candle",
      "nameUrdu": "موم بتی"
     },
     {
      "name": "Naphthalene Balls 200g",
      "unit": "packet",
      "price": 150,
      "icon": "spray-bottle",
      "nameUrdu": "نفتھالین"
     },
     {
      "name": "Air Freshener Spray",
      "unit": "piece",
      "price": 650,
      "icon": "spray-bottle"
     },
     {
      "name": "Shoe Polish Black",
      "unit": "piece",
      "price": 180,
      "icon": "pitchfork",
      "nameUrdu": "جوتوں کی پالش"
     }
    ]
   }
  ]
 },
 {
  "shopType": "Supermarket & Grocery",
  "icon": "cart",
  "categories": [
   {
    "name": "Breakfast & Cereals",
    "icon": "bowl-mix",
    "items": [
     {
      "name": "Weetabix Cereal 500g",
      "unit": "box",
      "price": 1450,
      "icon": "bowl-mix"
     },
     {
      "name": "Corn Flakes 500g",
      "unit": "box",
      "price": 1150,
      "icon": "bowl-mix",
      "nameUrdu": "کارن فلیکس"
     },
     {
      "name": "Oats 500g (Quaker)",
      "unit": "packet",
      "price": 750,
      "icon": "bowl-mix",
      "nameUrdu": "جو کا دلیہ"
     },
     {
      "name": "Milo 400g",
      "unit": "packet",
      "price": 1250,
      "icon": "bowl-mix"
     },
     {
      "name": "Nutella 350g",
      "unit": "piece",
      "price": 1650,
      "icon": "bowl-mix"
     },
     {
      "name": "Strawberry Jam 500g",
      "unit": "piece",
      "price": 550,
      "icon": "bowl-mix",
      "nameUrdu": "مربہ"
     },
     {
      "name": "Honey 500g",
      "unit": "piece",
      "price": 1650,
      "icon": "bee",
      "nameUrdu": "شہد"
     },
     {
      "name": "Peanut Butter 350g",
      "unit": "piece",
      "price": 1150,
      "icon": "peanut",
      "nameUrdu": "مونگ پھلی کا مکھن"
     },
     {
      "name": "Pancake Mix 500g",
      "unit": "packet",
      "price": 950,
      "icon": "cake"
     },
     {
      "name": "Whole Wheat Bread Slices",
      "unit": "packet",
      "price": 220,
      "icon": "bread-slice",
      "nameUrdu": "ڈبل روٹی"
     }
    ]
   },
   {
    "name": "Pasta, Noodles & Canned",
    "icon": "food-variant",
    "items": [
     {
      "name": "Spaghetti 500g",
      "unit": "packet",
      "price": 380,
      "icon": "food-variant"
     },
     {
      "name": "Macaroni 500g",
      "unit": "packet",
      "price": 360,
      "icon": "food-variant",
      "nameUrdu": "میکرونی"
     },
     {
      "name": "Maggi 2-Min Noodles (12 pack)",
      "unit": "packet",
      "price": 720,
      "icon": "food-variant",
      "nameUrdu": "نوڈلز"
     },
     {
      "name": "Knorr Chicken Noodles (Pack)",
      "unit": "packet",
      "price": 120,
      "icon": "food-drumstick",
      "nameUrdu": "نوڈلز"
     },
     {
      "name": "Chicken Soup Mix (Shan)",
      "unit": "packet",
      "price": 220,
      "icon": "food-drumstick",
      "nameUrdu": "سوپ"
     },
     {
      "name": "Canned Tuna 170g",
      "unit": "piece",
      "price": 650,
      "icon": "food-variant",
      "nameUrdu": "ٹونا مچھلی"
     },
     {
      "name": "Canned Mushrooms 400g",
      "unit": "piece",
      "price": 550,
      "icon": "food-variant",
      "nameUrdu": "مشروم"
     },
     {
      "name": "Sweet Corn Can 400g",
      "unit": "piece",
      "price": 480,
      "icon": "food-variant",
      "nameUrdu": "مکئی"
     },
     {
      "name": "Baked Beans 400g",
      "unit": "piece",
      "price": 450,
      "icon": "food-variant"
     },
     {
      "name": "Tomato Paste 400g",
      "unit": "piece",
      "price": 320,
      "icon": "food-variant",
      "nameUrdu": "ٹماٹر پیسٹ"
     },
     {
      "name": "Coconut Milk 400ml",
      "unit": "piece",
      "price": 650,
      "icon": "cow",
      "nameUrdu": "ناریل کا دودھ"
     },
     {
      "name": "Canned Chickpeas 400g",
      "unit": "piece",
      "price": 380,
      "icon": "food-variant",
      "nameUrdu": "چنے"
     }
    ]
   },
   {
    "name": "Sauces, Spreads & Condiments",
    "icon": "bottle-tonic",
    "items": [
     {
      "name": "Ketchup 1kg (National)",
      "unit": "piece",
      "price": 520,
      "icon": "bottle-tonic"
     },
     {
      "name": "Mayonnaise 500ml",
      "unit": "piece",
      "price": 850,
      "icon": "bottle-tonic"
     },
     {
      "name": "BBQ Sauce 500ml",
      "unit": "piece",
      "price": 650,
      "icon": "grill"
     },
     {
      "name": "Soy Sauce 500ml",
      "unit": "piece",
      "price": 550,
      "icon": "bottle-tonic"
     },
     {
      "name": "Chilli Garlic Sauce 500g",
      "unit": "piece",
      "price": 450,
      "icon": "bottle-tonic"
     },
     {
      "name": "Mustard Paste 200g",
      "unit": "piece",
      "price": 380,
      "icon": "bottle-tonic",
      "nameUrdu": "سرسوں پیسٹ"
     },
     {
      "name": "Vinegar 500ml",
      "unit": "piece",
      "price": 320,
      "icon": "bottle-tonic",
      "nameUrdu": "سرکہ"
     },
     {
      "name": "Mixed Pickles 1kg",
      "unit": "piece",
      "price": 850,
      "icon": "bottle-tonic",
      "nameUrdu": "اچار"
     },
     {
      "name": "Mango Pickle 500g",
      "unit": "piece",
      "price": 480,
      "icon": "bottle-tonic",
      "nameUrdu": "آم کا اچار"
     },
     {
      "name": "Mint Chutney 250g",
      "unit": "piece",
      "price": 320,
      "icon": "leaf",
      "nameUrdu": "پودینے کی چٹنی"
     },
     {
      "name": "Pizza Sauce 400g",
      "unit": "piece",
      "price": 550,
      "icon": "pizza"
     },
     {
      "name": "Garlic Paste 250g",
      "unit": "piece",
      "price": 380,
      "icon": "bottle-tonic",
      "nameUrdu": "لہسن کا پیسٹ"
     },
     {
      "name": "Ginger Garlic Paste 500g",
      "unit": "piece",
      "price": 650,
      "icon": "bottle-tonic",
      "nameUrdu": "ادرک لہسن پیسٹ"
     },
     {
      "name": "Salt & Pepper Grinder Set",
      "unit": "piece",
      "price": 850,
      "icon": "bottle-tonic",
      "nameUrdu": "نمک مرچ"
     }
    ]
   },
   {
    "name": "Frozen Foods",
    "icon": "snowflake",
    "items": [
     {
      "name": "Frozen Parathas 20ct",
      "unit": "packet",
      "price": 650,
      "icon": "bread-slice",
      "nameUrdu": "پراٹھے"
     },
     {
      "name": "Frozen Samosas 12ct",
      "unit": "packet",
      "price": 550,
      "icon": "snowflake",
      "nameUrdu": "سموسے"
     },
     {
      "name": "Chicken Nuggets 1kg",
      "unit": "packet",
      "price": 1450,
      "icon": "food-drumstick"
     },
     {
      "name": "Frozen Shami Kabab 12ct",
      "unit": "packet",
      "price": 750,
      "icon": "snowflake",
      "nameUrdu": "شامی کباب"
     },
     {
      "name": "Frozen Seekh Kabab 8ct",
      "unit": "packet",
      "price": 950,
      "icon": "grill",
      "nameUrdu": "سیخ کباب"
     },
     {
      "name": "Frozen French Fries 1kg",
      "unit": "packet",
      "price": 750,
      "icon": "french-fries"
     },
     {
      "name": "Frozen Peas 500g",
      "unit": "packet",
      "price": 420,
      "icon": "snowflake",
      "nameUrdu": "مٹر"
     },
     {
      "name": "Frozen Mixed Vegetables 1kg",
      "unit": "packet",
      "price": 650,
      "icon": "snowflake",
      "nameUrdu": "سبزیاں"
     },
     {
      "name": "Frozen Spring Rolls 12ct",
      "unit": "packet",
      "price": 650,
      "icon": "snowflake"
     },
     {
      "name": "Ice Cream 1 Litre",
      "unit": "packet",
      "price": 950,
      "icon": "cheese",
      "nameUrdu": "آئس کریم"
     },
     {
      "name": "Kulfi 1 Litre",
      "unit": "packet",
      "price": 750,
      "icon": "snowflake",
      "nameUrdu": "قلفی"
     },
     {
      "name": "Frozen Pizza 1ct",
      "unit": "piece",
      "price": 1150,
      "icon": "pizza"
     }
    ]
   },
   {
    "name": "Baby Care & Food",
    "icon": "baby-bottle",
    "items": [
     {
      "name": "Cerelac Wheat 400g",
      "unit": "box",
      "price": 1350,
      "icon": "baby-bottle"
     },
     {
      "name": "Baby Milk Formula 400g",
      "unit": "box",
      "price": 2450,
      "icon": "cow",
      "nameUrdu": "بچوں کا دودھ"
     },
     {
      "name": "Pampers Active Baby (Pack)",
      "unit": "packet",
      "price": 1650,
      "icon": "diaper-outline"
     },
     {
      "name": "Baby Wipes 80ct",
      "unit": "packet",
      "price": 550,
      "icon": "baby-bottle"
     },
     {
      "name": "Baby Shampoo 200ml",
      "unit": "piece",
      "price": 750,
      "icon": "bottle-tonic",
      "nameUrdu": "بچوں کا شیمپو"
     },
     {
      "name": "Baby Lotion 200ml",
      "unit": "piece",
      "price": 850,
      "icon": "lotion"
     },
     {
      "name": "Baby Oil 200ml",
      "unit": "piece",
      "price": 650,
      "icon": "oil",
      "nameUrdu": "بچوں کا تیل"
     },
     {
      "name": "Diaper Rash Cream",
      "unit": "piece",
      "price": 750,
      "icon": "cheese"
     },
     {
      "name": "Feeding Bottle 250ml",
      "unit": "piece",
      "price": 950,
      "icon": "baby-bottle",
      "nameUrdu": "فیڈر"
     },
     {
      "name": "Baby Rusks 250g",
      "unit": "packet",
      "price": 550,
      "icon": "bread-slice",
      "nameUrdu": "بچوں کے رس"
     }
    ]
   },
   {
    "name": "Packaged Dairy & Beverages",
    "icon": "bottle-soda",
    "items": [
     {
      "name": "Flavoured Milk 200ml (Pack of 6)",
      "unit": "packet",
      "price": 750,
      "icon": "cow",
      "nameUrdu": "ذائقہ دار دودھ"
     },
     {
      "name": "Chocolate Milk 1 Litre",
      "unit": "packet",
      "price": 320,
      "icon": "cow",
      "nameUrdu": "چاکلیٹ دودھ"
     },
     {
      "name": "Buttermilk (Chaas) 500ml",
      "unit": "piece",
      "price": 150,
      "icon": "cow",
      "nameUrdu": "چھاس"
     },
     {
      "name": "Yogurt Drink (Lassi) 500ml",
      "unit": "piece",
      "price": 180,
      "icon": "bowl",
      "nameUrdu": "لسی"
     },
     {
      "name": "Coca Cola 1.5 Litre",
      "unit": "piece",
      "price": 250,
      "icon": "bottle-soda"
     },
     {
      "name": "Pepsi 1.5 Litre",
      "unit": "piece",
      "price": 250,
      "icon": "bottle-soda"
     },
     {
      "name": "Sprite 1.5 Litre",
      "unit": "piece",
      "price": 250,
      "icon": "bottle-soda"
     },
     {
      "name": "Pakola 1.5 Litre",
      "unit": "piece",
      "price": 240,
      "icon": "bottle-soda"
     },
     {
      "name": "Mineral Water 1.5 Litre",
      "unit": "piece",
      "price": 180,
      "icon": "bottle-soda",
      "nameUrdu": "پانی"
     },
     {
      "name": "Mineral Water 5 Litre",
      "unit": "piece",
      "price": 450,
      "icon": "bottle-soda",
      "nameUrdu": "پانی"
     },
     {
      "name": "Mango Juice 1 Litre",
      "unit": "packet",
      "price": 320,
      "icon": "cup",
      "nameUrdu": "آم کا رس"
     },
     {
      "name": "Orange Juice 1 Litre",
      "unit": "packet",
      "price": 380,
      "icon": "cup",
      "nameUrdu": "سنگترے کا رس"
     }
    ]
   },
   {
    "name": "Cleaning & Laundry Brands",
    "icon": "washing-machine",
    "items": [
     {
      "name": "Ariel Detergent 1kg",
      "unit": "packet",
      "price": 580,
      "icon": "washing-machine"
     },
     {
      "name": "Surf Excel 1kg",
      "unit": "packet",
      "price": 520,
      "icon": "washing-machine"
     },
     {
      "name": "Brite Detergent 1kg",
      "unit": "packet",
      "price": 480,
      "icon": "washing-machine"
     },
     {
      "name": "Rin Bar 250g",
      "unit": "piece",
      "price": 110,
      "icon": "washing-machine"
     },
     {
      "name": "Fabric Softener 1 Litre",
      "unit": "piece",
      "price": 750,
      "icon": "tshirt-crew"
     },
     {
      "name": "Dettol Antiseptic 500ml",
      "unit": "piece",
      "price": 850,
      "icon": "washing-machine"
     },
     {
      "name": "Dettol Handwash 200ml",
      "unit": "piece",
      "price": 450,
      "icon": "washing-machine",
      "nameUrdu": "ہینڈ واش"
     },
     {
      "name": "Safeguard Handwash 200ml",
      "unit": "piece",
      "price": 420,
      "icon": "washing-machine",
      "nameUrdu": "ہینڈ واش"
     },
     {
      "name": "Floor Cleaner 1 Litre",
      "unit": "piece",
      "price": 550,
      "icon": "washing-machine",
      "nameUrdu": "فرش صاف"
     },
     {
      "name": "Glass Cleaner 500ml",
      "unit": "piece",
      "price": 450,
      "icon": "washing-machine",
      "nameUrdu": "شیشہ صاف"
     },
     {
      "name": "Dish Bar (Vim) 200g",
      "unit": "piece",
      "price": 150,
      "icon": "washing-machine"
     },
     {
      "name": "Steel Wool Pads (Pack)",
      "unit": "packet",
      "price": 180,
      "icon": "pipe"
     },
     {
      "name": "Tissues Box 200ct",
      "unit": "box",
      "price": 350,
      "icon": "washing-machine",
      "nameUrdu": "ٹشو"
     },
     {
      "name": "Kitchen Towel Roll",
      "unit": "piece",
      "price": 420,
      "icon": "washing-machine",
      "nameUrdu": "کچن ٹاول"
     }
    ]
   },
   {
    "name": "Pet Food & Household Misc",
    "icon": "paw",
    "items": [
     {
      "name": "Dog Food 1kg (Pedigree)",
      "unit": "packet",
      "price": 1650,
      "icon": "paw",
      "nameUrdu": "کتوں کا کھانا"
     },
     {
      "name": "Cat Food 1kg (Whiskas)",
      "unit": "packet",
      "price": 1750,
      "icon": "paw",
      "nameUrdu": "بلیوں کا کھانا"
     },
     {
      "name": "Bird Seed Mix 1kg",
      "unit": "packet",
      "price": 450,
      "icon": "seed",
      "nameUrdu": "پرندوں کا دانہ"
     },
     {
      "name": "Batteries AA (Pack of 4)",
      "unit": "packet",
      "price": 320,
      "icon": "paw"
     },
     {
      "name": "LED Bulb 12W",
      "unit": "piece",
      "price": 450,
      "icon": "lightbulb",
      "nameUrdu": "بلب"
     },
     {
      "name": "Extension Board 4-Socket",
      "unit": "piece",
      "price": 850,
      "icon": "power-socket"
     },
     {
      "name": "Folding Umbrella",
      "unit": "piece",
      "price": 1250,
      "icon": "umbrella",
      "nameUrdu": "چھتری"
     },
     {
      "name": "Reusable Shopping Bag",
      "unit": "piece",
      "price": 120,
      "icon": "paw",
      "nameUrdu": "تھیلی"
     },
     {
      "name": "Aluminium Foil 30m",
      "unit": "piece",
      "price": 650,
      "icon": "paw"
     },
     {
      "name": "Cling Wrap 30m",
      "unit": "piece",
      "price": 550,
      "icon": "paw"
     },
     {
      "name": "Paper Plates (Pack of 25)",
      "unit": "packet",
      "price": 420,
      "icon": "silverware-fork-knife",
      "nameUrdu": "کاغذ کی پلیٹیں"
     },
     {
      "name": "Disposable Cups (Pack of 50)",
      "unit": "packet",
      "price": 380,
      "icon": "battery-charging",
      "nameUrdu": "ڈسپوزایبل کپ"
     },
     {
      "name": "Instant Coffee 100g",
      "unit": "packet",
      "price": 1150,
      "icon": "coffee",
      "nameUrdu": "کافی"
     },
     {
      "name": "Green Tea Bags 50ct",
      "unit": "box",
      "price": 650,
      "icon": "tea"
     },
     {
      "name": "Energy Drink (Sting) 500ml",
      "unit": "piece",
      "price": 180,
      "icon": "bottle-soda"
     },
     {
      "name": "Diet Soda 1.5 Litre",
      "unit": "piece",
      "price": 260,
      "icon": "bottle-soda"
     }
    ]
   }
  ]
 },
 {
  "shopType": "Dairy & Milk Shop",
  "icon": "cow",
  "categories": [
   {
    "name": "Fresh Milk",
    "icon": "cow",
    "items": [
     {
      "name": "Fresh Cow Milk 1 Litre",
      "unit": "litre",
      "price": 180,
      "icon": "cow",
      "nameUrdu": "گائے کا دودھ"
     },
     {
      "name": "Fresh Buffalo Milk 1 Litre",
      "unit": "litre",
      "price": 200,
      "icon": "cow",
      "nameUrdu": "بھینس کا دودھ"
     },
     {
      "name": "Toned Milk 1 Litre",
      "unit": "litre",
      "price": 190,
      "icon": "cow",
      "nameUrdu": "ٹونڈ دودھ"
     },
     {
      "name": "Skimmed Milk 1 Litre",
      "unit": "litre",
      "price": 170,
      "icon": "cow",
      "nameUrdu": "بغیر ملائی دودھ"
     },
     {
      "name": "Full Cream Milk Pouch 1 Litre",
      "unit": "packet",
      "price": 210,
      "icon": "cow",
      "nameUrdu": "دودھ"
     },
     {
      "name": "Fresh Milk Half Litre",
      "unit": "litre",
      "price": 95,
      "icon": "cow",
      "nameUrdu": "دودھ"
     },
     {
      "name": "Boiled Milk (Ready) 1 Litre",
      "unit": "litre",
      "price": 190,
      "icon": "cow",
      "nameUrdu": "ابلا دودھ"
     },
     {
      "name": "Camel Milk 1 Litre",
      "unit": "litre",
      "price": 350,
      "icon": "cow",
      "nameUrdu": "اونٹ کا دودھ"
     }
    ]
   },
   {
    "name": "Yogurt & Curd",
    "icon": "bowl",
    "items": [
     {
      "name": "Fresh Dahi 1kg",
      "unit": "kg",
      "price": 320,
      "icon": "bowl",
      "nameUrdu": "دہی"
     },
     {
      "name": "Fresh Dahi 500g",
      "unit": "piece",
      "price": 165,
      "icon": "bowl",
      "nameUrdu": "دہی"
     },
     {
      "name": "Sweet Yogurt 1kg",
      "unit": "kg",
      "price": 340,
      "icon": "bowl",
      "nameUrdu": "میٹھا دہی"
     },
     {
      "name": "Greek Yogurt 400g",
      "unit": "piece",
      "price": 650,
      "icon": "bowl",
      "nameUrdu": "یونانی دہی"
     },
     {
      "name": "Flavoured Yogurt 200g",
      "unit": "piece",
      "price": 180,
      "icon": "bowl",
      "nameUrdu": "ذائقہ دار دہی"
     },
     {
      "name": "Raita Mix 500g",
      "unit": "piece",
      "price": 220,
      "icon": "bowl",
      "nameUrdu": "رائتہ"
     },
     {
      "name": "Buttermilk (Chaas) 1 Litre",
      "unit": "litre",
      "price": 150,
      "icon": "cow",
      "nameUrdu": "چھاس"
     },
     {
      "name": "Dahi Bara Mix 500g",
      "unit": "packet",
      "price": 280,
      "icon": "bowl",
      "nameUrdu": "دہی بڑا مکس"
     }
    ]
   },
   {
    "name": "Butter, Cream & Cheese",
    "icon": "cheese",
    "items": [
     {
      "name": "White Butter 500g",
      "unit": "piece",
      "price": 850,
      "icon": "cheese",
      "nameUrdu": "سفید مکھن"
     },
     {
      "name": "Salted Butter 250g",
      "unit": "piece",
      "price": 480,
      "icon": "cheese",
      "nameUrdu": "نمکین مکھن"
     },
     {
      "name": "Desi Ghee 500g",
      "unit": "piece",
      "price": 1150,
      "icon": "oil",
      "nameUrdu": "دیسی گھی"
     },
     {
      "name": "Desi Ghee 1kg",
      "unit": "kg",
      "price": 2250,
      "icon": "oil",
      "nameUrdu": "دیسی گھی"
     },
     {
      "name": "Fresh Cream (Malai) 500g",
      "unit": "piece",
      "price": 550,
      "icon": "cheese",
      "nameUrdu": "ملائی"
     },
     {
      "name": "Whipped Cream 250ml",
      "unit": "piece",
      "price": 550,
      "icon": "cheese"
     },
     {
      "name": "Mozzarella Cheese 500g",
      "unit": "piece",
      "price": 1150,
      "icon": "cheese"
     },
     {
      "name": "Cheddar Cheese 500g",
      "unit": "piece",
      "price": 1250,
      "icon": "cheese"
     },
     {
      "name": "Cheese Slices 200g",
      "unit": "packet",
      "price": 450,
      "icon": "cheese"
     },
     {
      "name": "Processed Cheese 400g",
      "unit": "piece",
      "price": 850,
      "icon": "cheese"
     },
     {
      "name": "Koya (Khoya) 500g",
      "unit": "piece",
      "price": 650,
      "icon": "cheese",
      "nameUrdu": "کھویا"
     },
     {
      "name": "Kalakand 500g",
      "unit": "piece",
      "price": 750,
      "icon": "cheese",
      "nameUrdu": "کلاکند"
     }
    ]
   },
   {
    "name": "Paneer & Desserts",
    "icon": "cupcake",
    "items": [
     {
      "name": "Fresh Paneer 500g",
      "unit": "piece",
      "price": 750,
      "icon": "cheese",
      "nameUrdu": "پنیر"
     },
     {
      "name": "Masala Paneer 500g",
      "unit": "piece",
      "price": 850,
      "icon": "cheese",
      "nameUrdu": "مصالحہ پنیر"
     },
     {
      "name": "Rabri 500g",
      "unit": "piece",
      "price": 850,
      "icon": "candy",
      "nameUrdu": "ربڑی"
     },
     {
      "name": "Rasmalai 500g (4pc)",
      "unit": "piece",
      "price": 750,
      "icon": "candy",
      "nameUrdu": "رس ملائی"
     },
     {
      "name": "Kheer Mix 500g",
      "unit": "piece",
      "price": 450,
      "icon": "candy",
      "nameUrdu": "کھیر"
     },
     {
      "name": "Gulab Jamun Tin 1kg",
      "unit": "piece",
      "price": 1150,
      "icon": "candy",
      "nameUrdu": "گلاب جامن"
     },
     {
      "name": "Barfi Mix 500g",
      "unit": "piece",
      "price": 550,
      "icon": "candy",
      "nameUrdu": "برفی"
     },
     {
      "name": "Custard Powder 250g",
      "unit": "packet",
      "price": 320,
      "icon": "cupcake",
      "nameUrdu": "کسٹرڈ"
     }
    ]
   },
   {
    "name": "Eggs",
    "icon": "egg",
    "items": [
     {
      "name": "Farm Eggs 1 Dozen",
      "unit": "dozen",
      "price": 420,
      "icon": "egg",
      "nameUrdu": "انڈے"
     },
     {
      "name": "Desi Eggs 1 Dozen",
      "unit": "dozen",
      "price": 650,
      "icon": "egg",
      "nameUrdu": "دیسی انڈے"
     },
     {
      "name": "Duck Eggs Half Dozen",
      "unit": "dozen",
      "price": 550,
      "icon": "egg",
      "nameUrdu": "بطخ کے انڈے"
     },
     {
      "name": "Boiled Eggs (Ready, 4pc)",
      "unit": "piece",
      "price": 160,
      "icon": "egg",
      "nameUrdu": "ابلے انڈے"
     }
    ]
   }
  ]
 },
 {
  "shopType": "Fruits & Vegetables",
  "icon": "carrot",
  "categories": [
   {
    "name": "Vegetables",
    "icon": "carrot",
    "items": [
     {
      "name": "Tomatoes 1kg",
      "unit": "kg",
      "price": 180,
      "icon": "carrot",
      "nameUrdu": "ٹماٹر"
     },
     {
      "name": "Onions 1kg",
      "unit": "kg",
      "price": 150,
      "icon": "carrot",
      "nameUrdu": "پیاز"
     },
     {
      "name": "Potatoes 1kg",
      "unit": "kg",
      "price": 120,
      "icon": "carrot",
      "nameUrdu": "آلو"
     },
     {
      "name": "Cauliflower 1kg",
      "unit": "kg",
      "price": 140,
      "icon": "carrot",
      "nameUrdu": "پھول گوبھی"
     },
     {
      "name": "Cabbage 1kg",
      "unit": "kg",
      "price": 120,
      "icon": "carrot",
      "nameUrdu": "بند گوبھی"
     },
     {
      "name": "Okra (Bhindi) 1kg",
      "unit": "kg",
      "price": 220,
      "icon": "carrot",
      "nameUrdu": "بھنڈی"
     },
     {
      "name": "Bitter Gourd (Karela) 1kg",
      "unit": "kg",
      "price": 200,
      "icon": "carrot",
      "nameUrdu": "کریلا"
     },
     {
      "name": "Bottle Gourd (Lauki) 1kg",
      "unit": "kg",
      "price": 130,
      "icon": "carrot",
      "nameUrdu": "لوکی"
     },
     {
      "name": "Ridge Gourd (Tori) 1kg",
      "unit": "kg",
      "price": 160,
      "icon": "carrot",
      "nameUrdu": "توری"
     },
     {
      "name": "Eggplant (Baingan) 1kg",
      "unit": "kg",
      "price": 140,
      "icon": "egg",
      "nameUrdu": "بینگن"
     },
     {
      "name": "Green Peas 1kg",
      "unit": "kg",
      "price": 260,
      "icon": "carrot",
      "nameUrdu": "مٹر"
     },
     {
      "name": "Carrots 1kg",
      "unit": "kg",
      "price": 130,
      "icon": "carrot",
      "nameUrdu": "گاجر"
     },
     {
      "name": "Capsicum (Shimla Mirch) 1kg",
      "unit": "kg",
      "price": 280,
      "icon": "carrot",
      "nameUrdu": "شملہ مرچ"
     },
     {
      "name": "Green Chillies 250g",
      "unit": "packet",
      "price": 80,
      "icon": "carrot",
      "nameUrdu": "ہری مرچ"
     },
     {
      "name": "Ginger (Adrak) 250g",
      "unit": "packet",
      "price": 180,
      "icon": "carrot",
      "nameUrdu": "ادرک"
     },
     {
      "name": "Garlic (Lehsan) 250g",
      "unit": "packet",
      "price": 160,
      "icon": "carrot",
      "nameUrdu": "لہسن"
     },
     {
      "name": "Lemon 1 Dozen",
      "unit": "dozen",
      "price": 200,
      "icon": "carrot",
      "nameUrdu": "لیموں"
     },
     {
      "name": "Coriander Bunch",
      "unit": "piece",
      "price": 50,
      "icon": "leaf",
      "nameUrdu": "دھنیا"
     },
     {
      "name": "Mint Bunch (Podina)",
      "unit": "piece",
      "price": 50,
      "icon": "leaf",
      "nameUrdu": "پودینہ"
     },
     {
      "name": "Green Onion Bunch",
      "unit": "piece",
      "price": 60,
      "icon": "carrot",
      "nameUrdu": "ہری پیاز"
     },
     {
      "name": "French Beans 1kg",
      "unit": "kg",
      "price": 240,
      "icon": "carrot",
      "nameUrdu": "فرانسیسی پھلیاں"
     },
     {
      "name": "Turnip (Shaljam) 1kg",
      "unit": "kg",
      "price": 130,
      "icon": "carrot",
      "nameUrdu": "شلجم"
     },
     {
      "name": "Radish (Mooli) 1kg",
      "unit": "kg",
      "price": 120,
      "icon": "carrot",
      "nameUrdu": "مولی"
     },
     {
      "name": "Arvi (Taro) 1kg",
      "unit": "kg",
      "price": 200,
      "icon": "carrot",
      "nameUrdu": "اروی"
     },
     {
      "name": "Zucchini 1kg",
      "unit": "kg",
      "price": 280,
      "icon": "carrot"
     },
     {
      "name": "Corn on Cob (Bhutta) 1pc",
      "unit": "piece",
      "price": 60,
      "icon": "carrot",
      "nameUrdu": "بھٹا"
     },
     {
      "name": "Sweet Corn Kernels 500g",
      "unit": "packet",
      "price": 200,
      "icon": "carrot",
      "nameUrdu": "مکئی کے دانے"
     },
     {
      "name": "Broccoli 500g",
      "unit": "piece",
      "price": 320,
      "icon": "carrot"
     }
    ]
   },
   {
    "name": "Root & Starchy",
    "icon": "sprout",
    "items": [
     {
      "name": "Sweet Potato (Shakarkandi) 1kg",
      "unit": "kg",
      "price": 180,
      "icon": "sprout",
      "nameUrdu": "شکر قندی"
     },
     {
      "name": "Tinda (Round Gourd) 1kg",
      "unit": "kg",
      "price": 150,
      "icon": "sprout",
      "nameUrdu": "ٹینڈا"
     },
     {
      "name": "Pumpkin (Kadu) 1kg",
      "unit": "kg",
      "price": 140,
      "icon": "sprout",
      "nameUrdu": "کدو"
     },
     {
      "name": "Parwal (Pointed Gourd) 1kg",
      "unit": "kg",
      "price": 180,
      "icon": "sprout"
     },
     {
      "name": "Beetroot 1kg",
      "unit": "kg",
      "price": 180,
      "icon": "sprout",
      "nameUrdu": "چقندر"
     },
     {
      "name": "Lotus Root (Bhein) 500g",
      "unit": "packet",
      "price": 260,
      "icon": "sprout",
      "nameUrdu": "بھین"
     },
     {
      "name": "Cassava (Kachalu) 1kg",
      "unit": "kg",
      "price": 200,
      "icon": "sprout",
      "nameUrdu": "کچالو"
     },
     {
      "name": "Yam (Zameen Kand) 1kg",
      "unit": "kg",
      "price": 260,
      "icon": "sprout"
     }
    ]
   },
   {
    "name": "Leafy Greens",
    "icon": "leaf",
    "items": [
     {
      "name": "Spinach (Palak) 1 Bunch",
      "unit": "piece",
      "price": 60,
      "icon": "leaf",
      "nameUrdu": "پالک"
     },
     {
      "name": "Mustard Greens (Sarson) 1 Bunch",
      "unit": "piece",
      "price": 70,
      "icon": "leaf",
      "nameUrdu": "سرسوں کا ساگ"
     },
     {
      "name": "Bathua (Chenopodium) 1 Bunch",
      "unit": "piece",
      "price": 60,
      "icon": "leaf",
      "nameUrdu": "بتھوا"
     },
     {
      "name": "Methi (Fenugreek Leaves) 1 Bunch",
      "unit": "piece",
      "price": 60,
      "icon": "leaf",
      "nameUrdu": "میتھی"
     },
     {
      "name": "Chaulai (Amaranth) 1 Bunch",
      "unit": "piece",
      "price": 60,
      "icon": "leaf",
      "nameUrdu": "چولائی"
     },
     {
      "name": "Lettuce 1 Head",
      "unit": "piece",
      "price": 150,
      "icon": "leaf",
      "nameUrdu": "سلاد پتا"
     },
     {
      "name": "Kale 500g",
      "unit": "packet",
      "price": 280,
      "icon": "leaf"
     },
     {
      "name": "Spring Greens Mix 500g",
      "unit": "packet",
      "price": 180,
      "icon": "leaf",
      "nameUrdu": "مکس ساگ"
     }
    ]
   },
   {
    "name": "Fruits",
    "icon": "food-apple",
    "items": [
     {
      "name": "Bananas 1 Dozen",
      "unit": "dozen",
      "price": 180,
      "icon": "food-apple",
      "nameUrdu": "کیلے"
     },
     {
      "name": "Apples (Shimla) 1kg",
      "unit": "kg",
      "price": 320,
      "icon": "food-apple",
      "nameUrdu": "سیب"
     },
     {
      "name": "Oranges (Kinnow) 1 Dozen",
      "unit": "dozen",
      "price": 250,
      "icon": "fruit-citrus",
      "nameUrdu": "کنو"
     },
     {
      "name": "Malta Oranges 1 Dozen",
      "unit": "dozen",
      "price": 280,
      "icon": "fruit-citrus",
      "nameUrdu": "مالٹا"
     },
     {
      "name": "Mangoes (Chaunsa) 1kg",
      "unit": "kg",
      "price": 320,
      "icon": "food-apple",
      "nameUrdu": "آم"
     },
     {
      "name": "Mangoes (Anwar Ratol) 1kg",
      "unit": "kg",
      "price": 380,
      "icon": "food-apple",
      "nameUrdu": "آم"
     },
     {
      "name": "Guava (Amrood) 1kg",
      "unit": "kg",
      "price": 180,
      "icon": "food-apple",
      "nameUrdu": "امرود"
     },
     {
      "name": "Grapes (Green) 1kg",
      "unit": "kg",
      "price": 380,
      "icon": "fruit-grapes",
      "nameUrdu": "انگور"
     },
     {
      "name": "Grapes (Black) 1kg",
      "unit": "kg",
      "price": 420,
      "icon": "fruit-grapes",
      "nameUrdu": "کالے انگور"
     },
     {
      "name": "Papaya 1kg",
      "unit": "kg",
      "price": 200,
      "icon": "food-apple",
      "nameUrdu": "پپیتا"
     },
     {
      "name": "Watermelon 1kg",
      "unit": "kg",
      "price": 120,
      "icon": "fruit-watermelon",
      "nameUrdu": "تربوز"
     },
     {
      "name": "Melon (Kharbooza) 1kg",
      "unit": "kg",
      "price": 150,
      "icon": "food-apple",
      "nameUrdu": "خربوزہ"
     },
     {
      "name": "Pomegranate (Anar) 1kg",
      "unit": "kg",
      "price": 420,
      "icon": "food-apple",
      "nameUrdu": "انار"
     },
     {
      "name": "Pears (Nashpati) 1kg",
      "unit": "kg",
      "price": 280,
      "icon": "fruit-pear",
      "nameUrdu": "ناشپاتی"
     },
     {
      "name": "Peaches (Aaru) 1kg",
      "unit": "kg",
      "price": 280,
      "icon": "food-apple",
      "nameUrdu": "آڑو"
     },
     {
      "name": "Plums (Aloo Bukhara) 1kg",
      "unit": "kg",
      "price": 320,
      "icon": "food-apple",
      "nameUrdu": "آلو بخارا"
     },
     {
      "name": "Cherries 500g",
      "unit": "packet",
      "price": 650,
      "icon": "fruit-cherries",
      "nameUrdu": "چیری"
     },
     {
      "name": "Strawberries 500g",
      "unit": "packet",
      "price": 550,
      "icon": "food-apple"
     },
     {
      "name": "Dates (Ajwa) 500g",
      "unit": "packet",
      "price": 1450,
      "icon": "food-apple",
      "nameUrdu": "عجوہ کھجور"
     },
     {
      "name": "Coconut (Whole) 1pc",
      "unit": "piece",
      "price": 180,
      "icon": "food-apple",
      "nameUrdu": "ناریل"
     },
     {
      "name": "Pineapple 1pc",
      "unit": "piece",
      "price": 280,
      "icon": "food-apple",
      "nameUrdu": "انناس"
     },
     {
      "name": "Falsa 500g",
      "unit": "packet",
      "price": 320,
      "icon": "food-apple",
      "nameUrdu": "فالسہ"
     }
    ]
   },
   {
    "name": "Herbs & Extras",
    "icon": "flower",
    "items": [
     {
      "name": "Curry Leaves Bunch",
      "unit": "piece",
      "price": 40,
      "icon": "pot",
      "nameUrdu": "کری پتا"
     },
     {
      "name": "Dried Mint 100g",
      "unit": "packet",
      "price": 180,
      "icon": "leaf",
      "nameUrdu": "خشک پودینہ"
     },
     {
      "name": "Dried Fenugreek (Kasoori Methi) 100g",
      "unit": "packet",
      "price": 220,
      "icon": "leaf",
      "nameUrdu": "قصوری میتھی"
     },
     {
      "name": "Tamarind (Imli) 500g",
      "unit": "packet",
      "price": 280,
      "icon": "flower",
      "nameUrdu": "املی"
     }
    ]
   }
  ]
 },
 {
  "shopType": "Meat & Poultry",
  "icon": "food-drumstick",
  "categories": [
   {
    "name": "Chicken",
    "icon": "food-drumstick",
    "items": [
     {
      "name": "Whole Chicken 1kg",
      "unit": "kg",
      "price": 620,
      "icon": "food-drumstick",
      "nameUrdu": "مرغی"
     },
     {
      "name": "Chicken Breast 1kg",
      "unit": "kg",
      "price": 780,
      "icon": "food-drumstick"
     },
     {
      "name": "Chicken Legs 1kg",
      "unit": "kg",
      "price": 680,
      "icon": "food-drumstick"
     },
     {
      "name": "Chicken Wings 1kg",
      "unit": "kg",
      "price": 720,
      "icon": "food-drumstick"
     },
     {
      "name": "Chicken Mince (Qeema) 1kg",
      "unit": "kg",
      "price": 750,
      "icon": "food-drumstick",
      "nameUrdu": "چکن قیمہ"
     },
     {
      "name": "Chicken Liver 500g",
      "unit": "piece",
      "price": 320,
      "icon": "food-drumstick",
      "nameUrdu": "چکن کلیجی"
     },
     {
      "name": "Chicken Gizzard 500g",
      "unit": "piece",
      "price": 280,
      "icon": "food-drumstick",
      "nameUrdu": "چکن پوٹا"
     },
     {
      "name": "Chicken Neck/Back Mix 1kg",
      "unit": "kg",
      "price": 420,
      "icon": "food-drumstick",
      "nameUrdu": "چکن گردن"
     },
     {
      "name": "Desi Chicken 1kg",
      "unit": "kg",
      "price": 950,
      "icon": "food-drumstick",
      "nameUrdu": "دیسی مرغی"
     },
     {
      "name": "Boneless Chicken 1kg",
      "unit": "kg",
      "price": 820,
      "icon": "food-drumstick"
     }
    ]
   },
   {
    "name": "Beef",
    "icon": "cow",
    "items": [
     {
      "name": "Beef Boneless 1kg",
      "unit": "kg",
      "price": 1250,
      "icon": "food-steak",
      "nameUrdu": "گائے کا گوشت"
     },
     {
      "name": "Beef with Bone 1kg",
      "unit": "kg",
      "price": 1050,
      "icon": "food-steak",
      "nameUrdu": "ہڈی والا گوشت"
     },
     {
      "name": "Beef Mince 1kg",
      "unit": "kg",
      "price": 1350,
      "icon": "food-steak",
      "nameUrdu": "قیمہ"
     },
     {
      "name": "Beef Ribs 1kg",
      "unit": "kg",
      "price": 1150,
      "icon": "food-steak",
      "nameUrdu": "پسلی"
     },
     {
      "name": "Beef Liver (Kaleji) 500g",
      "unit": "piece",
      "price": 650,
      "icon": "food-steak",
      "nameUrdu": "کلیجی"
     },
     {
      "name": "Beef Brain (Maghaz) 1pc",
      "unit": "piece",
      "price": 550,
      "icon": "food-steak",
      "nameUrdu": "مغز"
     },
     {
      "name": "Beef Tongue 1pc",
      "unit": "piece",
      "price": 750,
      "icon": "food-steak",
      "nameUrdu": "زبان"
     },
     {
      "name": "Beef Paya (Trotters) 1kg",
      "unit": "kg",
      "price": 850,
      "icon": "food-steak",
      "nameUrdu": "پائے"
     }
    ]
   },
   {
    "name": "Mutton",
    "icon": "sheep",
    "items": [
     {
      "name": "Mutton Boneless 1kg",
      "unit": "kg",
      "price": 2200,
      "icon": "sheep",
      "nameUrdu": "بکرے کا گوشت"
     },
     {
      "name": "Mutton with Bone 1kg",
      "unit": "kg",
      "price": 1950,
      "icon": "sheep",
      "nameUrdu": "ہڈی والا مٹن"
     },
     {
      "name": "Mutton Mince 1kg",
      "unit": "kg",
      "price": 2350,
      "icon": "sheep",
      "nameUrdu": "مٹن قیمہ"
     },
     {
      "name": "Mutton Chops 1kg",
      "unit": "kg",
      "price": 2100,
      "icon": "sheep"
     },
     {
      "name": "Mutton Liver 500g",
      "unit": "piece",
      "price": 950,
      "icon": "sheep",
      "nameUrdu": "مٹن کلیجی"
     },
     {
      "name": "Mutton Brain 1pc",
      "unit": "piece",
      "price": 450,
      "icon": "sheep",
      "nameUrdu": "مٹن مغز"
     },
     {
      "name": "Mutton Paya 1kg",
      "unit": "kg",
      "price": 1200,
      "icon": "sheep",
      "nameUrdu": "مٹن پائے"
     },
     {
      "name": "Mutton Raan (Leg) 1pc",
      "unit": "piece",
      "price": 2400,
      "icon": "sheep",
      "nameUrdu": "ران"
     }
    ]
   },
   {
    "name": "Fish & Seafood",
    "icon": "fish",
    "items": [
     {
      "name": "Rahu Fish 1kg",
      "unit": "kg",
      "price": 750,
      "icon": "fish",
      "nameUrdu": "رہو مچھلی"
     },
     {
      "name": "Salmon Fillet 500g",
      "unit": "packet",
      "price": 1450,
      "icon": "fish"
     },
     {
      "name": "Pomfret (Paplet) 1kg",
      "unit": "kg",
      "price": 1650,
      "icon": "fish",
      "nameUrdu": "پاپلیٹ"
     },
     {
      "name": "Prawns 500g",
      "unit": "piece",
      "price": 1250,
      "icon": "fish",
      "nameUrdu": "جھینگے"
     },
     {
      "name": "Fish Fingers 500g",
      "unit": "packet",
      "price": 850,
      "icon": "fish"
     },
     {
      "name": "Dried Fish (Sookhi Machli) 250g",
      "unit": "packet",
      "price": 650,
      "icon": "fish",
      "nameUrdu": "سوکھی مچھلی"
     },
     {
      "name": "Sole Fish 1kg",
      "unit": "kg",
      "price": 950,
      "icon": "fish",
      "nameUrdu": "سول مچھلی"
     },
     {
      "name": "Surmai (King Fish) 1kg",
      "unit": "kg",
      "price": 1350,
      "icon": "eye",
      "nameUrdu": "سرمئی"
     }
    ]
   },
   {
    "name": "Mince, Organs & Eggs",
    "icon": "food-steak",
    "items": [
     {
      "name": "Mixed Mince 1kg",
      "unit": "kg",
      "price": 1050,
      "icon": "food-steak",
      "nameUrdu": "مکس قیمہ"
     },
     {
      "name": "Heart (Dil) 500g",
      "unit": "piece",
      "price": 550,
      "icon": "food-steak",
      "nameUrdu": "دل"
     },
     {
      "name": "Kidney (Gurda) 500g",
      "unit": "piece",
      "price": 550,
      "icon": "food-steak",
      "nameUrdu": "گردہ"
     },
     {
      "name": "Tripe (Ojri) 500g",
      "unit": "piece",
      "price": 450,
      "icon": "food-steak",
      "nameUrdu": "اوجھڑی"
     },
     {
      "name": "Marrow Bones 1kg",
      "unit": "kg",
      "price": 650,
      "icon": "food-steak",
      "nameUrdu": "گودے والی ہڈی"
     },
     {
      "name": "Farm Eggs 1 Dozen",
      "unit": "dozen",
      "price": 420,
      "icon": "egg",
      "nameUrdu": "انڈے"
     }
    ]
   }
  ]
 },
 {
  "shopType": "Bakery & Sweets",
  "icon": "bread-slice",
  "categories": [
   {
    "name": "Breads & Rusk",
    "icon": "bread-slice",
    "items": [
     {
      "name": "Milk Bread 600g",
      "unit": "packet",
      "price": 180,
      "icon": "cow",
      "nameUrdu": "دودھ والی ڈبل روٹی"
     },
     {
      "name": "White Bread 600g",
      "unit": "packet",
      "price": 160,
      "icon": "bread-slice",
      "nameUrdu": "سفید ڈبل روٹی"
     },
     {
      "name": "Whole Wheat Bread 600g",
      "unit": "packet",
      "price": 190,
      "icon": "bread-slice",
      "nameUrdu": "گندم کی ڈبل روٹی"
     },
     {
      "name": "Bun (Pack of 6)",
      "unit": "packet",
      "price": 150,
      "icon": "bread-slice",
      "nameUrdu": "بن"
     },
     {
      "name": "Burger Buns (Pack of 4)",
      "unit": "packet",
      "price": 160,
      "icon": "hamburger"
     },
     {
      "name": "Hot Dog Buns (Pack of 4)",
      "unit": "packet",
      "price": 160,
      "icon": "bread-slice"
     },
     {
      "name": "Cake Rusk 400g",
      "unit": "packet",
      "price": 380,
      "icon": "cake",
      "nameUrdu": "کیک رس"
     },
     {
      "name": "Zeera Rusk 400g",
      "unit": "packet",
      "price": 360,
      "icon": "bread-slice",
      "nameUrdu": "زیرہ رس"
     },
     {
      "name": "Milk Rusk 400g",
      "unit": "packet",
      "price": 350,
      "icon": "cow",
      "nameUrdu": "دودھ رس"
     },
     {
      "name": "Fruit Cake Slices (Pack)",
      "unit": "packet",
      "price": 320,
      "icon": "cake",
      "nameUrdu": "فروٹ کیک"
     },
     {
      "name": "Plain Cake 500g",
      "unit": "piece",
      "price": 550,
      "icon": "cake",
      "nameUrdu": "سادہ کیک"
     },
     {
      "name": "Muffins (Pack of 4)",
      "unit": "packet",
      "price": 280,
      "icon": "bread-slice"
     },
     {
      "name": "Croissant (Pack of 2)",
      "unit": "packet",
      "price": 320,
      "icon": "bread-slice"
     },
     {
      "name": "Garlic Bread Loaf",
      "unit": "piece",
      "price": 380,
      "icon": "bread-slice"
     }
    ]
   },
   {
    "name": "Cakes & Pastries",
    "icon": "cake",
    "items": [
     {
      "name": "Chocolate Cake 1lb",
      "unit": "piece",
      "price": 950,
      "icon": "cake",
      "nameUrdu": "چاکلیٹ کیک"
     },
     {
      "name": "Pineapple Cake 1lb",
      "unit": "piece",
      "price": 900,
      "icon": "cake",
      "nameUrdu": "انناس کیک"
     },
     {
      "name": "Vanilla Cake 1lb",
      "unit": "piece",
      "price": 850,
      "icon": "cake"
     },
     {
      "name": "Black Forest Cake 1lb",
      "unit": "piece",
      "price": 1150,
      "icon": "cake"
     },
     {
      "name": "Red Velvet Cake 1lb",
      "unit": "piece",
      "price": 1250,
      "icon": "cake"
     },
     {
      "name": "Coffee Cake 1lb",
      "unit": "piece",
      "price": 1050,
      "icon": "coffee"
     },
     {
      "name": "Chocolate Pastry 1pc",
      "unit": "piece",
      "price": 180,
      "icon": "cake",
      "nameUrdu": "چاکلیٹ پیسٹری"
     },
     {
      "name": "Pineapple Pastry 1pc",
      "unit": "piece",
      "price": 160,
      "icon": "cake",
      "nameUrdu": "پیسٹری"
     },
     {
      "name": "Eclair (Pack of 2)",
      "unit": "packet",
      "price": 220,
      "icon": "cake"
     },
     {
      "name": "Glazed Donut 1pc",
      "unit": "piece",
      "price": 150,
      "icon": "cake"
     },
     {
      "name": "Chocolate Donut 1pc",
      "unit": "piece",
      "price": 170,
      "icon": "bottle-soda"
     },
     {
      "name": "Swiss Roll 1pc",
      "unit": "piece",
      "price": 220,
      "icon": "cake"
     },
     {
      "name": "Cupcakes (Pack of 6)",
      "unit": "packet",
      "price": 420,
      "icon": "cupcake"
     },
     {
      "name": "Brownies (Pack of 4)",
      "unit": "packet",
      "price": 450,
      "icon": "cake"
     }
    ]
   },
   {
    "name": "Biscuits & Cookies",
    "icon": "cookie",
    "items": [
     {
      "name": "Atta Biscuits 500g",
      "unit": "packet",
      "price": 420,
      "icon": "barley",
      "nameUrdu": "آٹے کے بسکٹ"
     },
     {
      "name": "Coconut Cookies 500g",
      "unit": "packet",
      "price": 480,
      "icon": "cookie",
      "nameUrdu": "ناریل بسکٹ"
     },
     {
      "name": "Butter Cookies 500g",
      "unit": "packet",
      "price": 550,
      "icon": "cheese",
      "nameUrdu": "مکھن بسکٹ"
     },
     {
      "name": "Chocolate Chip Cookies 500g",
      "unit": "packet",
      "price": 650,
      "icon": "cookie",
      "nameUrdu": "چاکلیٹ چپ بسکٹ"
     },
     {
      "name": "Nan Khatai 500g",
      "unit": "packet",
      "price": 520,
      "icon": "cookie",
      "nameUrdu": "نان خطائی"
     },
     {
      "name": "Shrewsbury Biscuits 500g",
      "unit": "packet",
      "price": 580,
      "icon": "cookie"
     },
     {
      "name": "Khopra Biscuits 400g",
      "unit": "packet",
      "price": 420,
      "icon": "cookie",
      "nameUrdu": "کھوپرا بسکٹ"
     },
     {
      "name": "Zeera Biscuits 400g",
      "unit": "packet",
      "price": 400,
      "icon": "cookie",
      "nameUrdu": "زیرہ بسکٹ"
     },
     {
      "name": "Salt Biscuits 400g",
      "unit": "packet",
      "price": 380,
      "icon": "cookie",
      "nameUrdu": "نمکین بسکٹ"
     },
     {
      "name": "Jam Biscuits 400g",
      "unit": "packet",
      "price": 450,
      "icon": "cookie",
      "nameUrdu": "مربہ بسکٹ"
     },
     {
      "name": "Marble Cookies 400g",
      "unit": "packet",
      "price": 480,
      "icon": "cookie"
     },
     {
      "name": "Walnut Cookies 400g",
      "unit": "packet",
      "price": 650,
      "icon": "peanut",
      "nameUrdu": "اخروٹ بسکٹ"
     }
    ]
   },
   {
    "name": "Mithai",
    "icon": "candy",
    "items": [
     {
      "name": "Gulab Jamun 1kg",
      "unit": "kg",
      "price": 850,
      "icon": "candy",
      "nameUrdu": "گلاب جامن"
     },
     {
      "name": "Rasgulla 1kg",
      "unit": "kg",
      "price": 800,
      "icon": "candy",
      "nameUrdu": "رس گلہ"
     },
     {
      "name": "Barfi (Plain) 1kg",
      "unit": "kg",
      "price": 950,
      "icon": "candy",
      "nameUrdu": "برفی"
     },
     {
      "name": "Coconut Barfi 1kg",
      "unit": "kg",
      "price": 1050,
      "icon": "candy",
      "nameUrdu": "ناریل برفی"
     },
     {
      "name": "Motichoor Ladoo 1kg",
      "unit": "kg",
      "price": 850,
      "icon": "candy",
      "nameUrdu": "موتی چور لڈو"
     },
     {
      "name": "Besan Ladoo 1kg",
      "unit": "kg",
      "price": 900,
      "icon": "barley",
      "nameUrdu": "بیسن لڈو"
     },
     {
      "name": "Jalebi 1kg",
      "unit": "kg",
      "price": 750,
      "icon": "candy",
      "nameUrdu": "جلیبی"
     },
     {
      "name": "Imarti 1kg",
      "unit": "kg",
      "price": 800,
      "icon": "candy",
      "nameUrdu": "امرتی"
     },
     {
      "name": "Soan Papdi 500g",
      "unit": "packet",
      "price": 550,
      "icon": "candy",
      "nameUrdu": "سون پاپڑی"
     },
     {
      "name": "Patisa 1kg",
      "unit": "kg",
      "price": 900,
      "icon": "candy",
      "nameUrdu": "پتیسہ"
     },
     {
      "name": "Kalakand 1kg",
      "unit": "kg",
      "price": 1150,
      "icon": "candy",
      "nameUrdu": "کلاکند"
     },
     {
      "name": "Rasmalai 1kg",
      "unit": "kg",
      "price": 1250,
      "icon": "candy",
      "nameUrdu": "رس ملائی"
     },
     {
      "name": "Cham Cham 1kg",
      "unit": "kg",
      "price": 950,
      "icon": "candy",
      "nameUrdu": "چم چم"
     },
     {
      "name": "Balushahi 1kg",
      "unit": "kg",
      "price": 900,
      "icon": "candy",
      "nameUrdu": "بالوشاہی"
     },
     {
      "name": "Milk Cake 1kg",
      "unit": "kg",
      "price": 1150,
      "icon": "cow",
      "nameUrdu": "ملک کیک"
     },
     {
      "name": "Habshi Halwa 500g",
      "unit": "piece",
      "price": 650,
      "icon": "candy",
      "nameUrdu": "حبشی حلوہ"
     }
    ]
   },
   {
    "name": "Nimco & Snacks",
    "icon": "popcorn",
    "items": [
     {
      "name": "Nimco Mix 1kg",
      "unit": "kg",
      "price": 750,
      "icon": "popcorn",
      "nameUrdu": "نمکو مکس"
     },
     {
      "name": "Dalmoth 500g",
      "unit": "packet",
      "price": 380,
      "icon": "popcorn",
      "nameUrdu": "دال موٹھ"
     },
     {
      "name": "Bhujia Sev 500g",
      "unit": "packet",
      "price": 420,
      "icon": "popcorn",
      "nameUrdu": "بھجیا"
     },
     {
      "name": "Gathiya 500g",
      "unit": "packet",
      "price": 420,
      "icon": "popcorn",
      "nameUrdu": "گٹھیا"
     },
     {
      "name": "Roasted Peanuts 500g",
      "unit": "packet",
      "price": 550,
      "icon": "peanut",
      "nameUrdu": "بھنی مونگ پھلی"
     },
     {
      "name": "Chana Jor Garam 500g",
      "unit": "packet",
      "price": 400,
      "icon": "popcorn",
      "nameUrdu": "چنا جور گرم"
     },
     {
      "name": "Masala Peanuts 500g",
      "unit": "packet",
      "price": 580,
      "icon": "peanut",
      "nameUrdu": "مصالحہ مونگ پھلی"
     },
     {
      "name": "Papdi 500g",
      "unit": "packet",
      "price": 380,
      "icon": "popcorn",
      "nameUrdu": "پاپڑی"
     },
     {
      "name": "Papad 200g",
      "unit": "packet",
      "price": 220,
      "icon": "popcorn",
      "nameUrdu": "پاپڑ"
     },
     {
      "name": "Samosa (Fresh, 4pc)",
      "unit": "piece",
      "price": 160,
      "icon": "popcorn",
      "nameUrdu": "سموسہ"
     },
     {
      "name": "Kachori (Fresh, 4pc)",
      "unit": "piece",
      "price": 200,
      "icon": "popcorn",
      "nameUrdu": "کچوری"
     },
     {
      "name": "Spring Roll (Fresh, 4pc)",
      "unit": "piece",
      "price": 240,
      "icon": "popcorn"
     },
     {
      "name": "Chicken Patties (4pc)",
      "unit": "piece",
      "price": 320,
      "icon": "food-drumstick"
     },
     {
      "name": "Aloo Patties (4pc)",
      "unit": "piece",
      "price": 240,
      "icon": "popcorn"
     }
    ]
   }
  ]
 },
 {
  "shopType": "Tea Stall & Dhaba",
  "icon": "cup",
  "categories": [
   {
    "name": "Chai & Drinks",
    "icon": "tea",
    "items": [
     {
      "name": "Doodh Patti (Full Cup)",
      "unit": "piece",
      "price": 80,
      "icon": "tea",
      "nameUrdu": "دودھ پتی"
     },
     {
      "name": "Doodh Patti (Cutting)",
      "unit": "piece",
      "price": 50,
      "icon": "tea",
      "nameUrdu": "کٹنگ چائے"
     },
     {
      "name": "Elaichi Chai",
      "unit": "piece",
      "price": 100,
      "icon": "tea",
      "nameUrdu": "الائچی چائے"
     },
     {
      "name": "Adrak Chai",
      "unit": "piece",
      "price": 100,
      "icon": "tea",
      "nameUrdu": "ادرک چائے"
     },
     {
      "name": "Kahwa (Green Tea)",
      "unit": "piece",
      "price": 80,
      "icon": "tea",
      "nameUrdu": "کہوہ"
     },
     {
      "name": "Kashmiri Chai",
      "unit": "piece",
      "price": 120,
      "icon": "tea",
      "nameUrdu": "کشمیری چائے"
     },
     {
      "name": "Gur Wali Chai",
      "unit": "piece",
      "price": 90,
      "icon": "tea",
      "nameUrdu": "گڑ والی چائے"
     },
     {
      "name": "Lemon Tea",
      "unit": "piece",
      "price": 70,
      "icon": "tea",
      "nameUrdu": "لیموں چائے"
     },
     {
      "name": "Cold Drink (Bottle)",
      "unit": "piece",
      "price": 120,
      "icon": "tea",
      "nameUrdu": "کولڈ ڈرنک"
     },
     {
      "name": "Fresh Lime Soda",
      "unit": "piece",
      "price": 150,
      "icon": "bottle-soda",
      "nameUrdu": "لائم سوڈا"
     },
     {
      "name": "Lassi (Sweet)",
      "unit": "piece",
      "price": 150,
      "icon": "cup",
      "nameUrdu": "میٹھی لسی"
     },
     {
      "name": "Lassi (Salty)",
      "unit": "piece",
      "price": 150,
      "icon": "cup",
      "nameUrdu": "نمکین لسی"
     }
    ]
   },
   {
    "name": "Paratha & Breads",
    "icon": "bread-slice",
    "items": [
     {
      "name": "Sada Paratha",
      "unit": "piece",
      "price": 60,
      "icon": "bread-slice",
      "nameUrdu": "سادہ پراٹھا"
     },
     {
      "name": "Aloo Paratha",
      "unit": "piece",
      "price": 120,
      "icon": "bread-slice",
      "nameUrdu": "آلو پراٹھا"
     },
     {
      "name": "Qeema Paratha",
      "unit": "piece",
      "price": 180,
      "icon": "food-steak",
      "nameUrdu": "قیمہ پراٹھا"
     },
     {
      "name": "Anda Paratha",
      "unit": "piece",
      "price": 140,
      "icon": "bread-slice",
      "nameUrdu": "انڈا پراٹھا"
     },
     {
      "name": "Cheese Paratha",
      "unit": "piece",
      "price": 200,
      "icon": "cheese"
     },
     {
      "name": "Tandoori Roti",
      "unit": "piece",
      "price": 25,
      "icon": "bread-slice",
      "nameUrdu": "تندوری روٹی"
     },
     {
      "name": "Naan",
      "unit": "piece",
      "price": 40,
      "icon": "bread-slice",
      "nameUrdu": "نان"
     },
     {
      "name": "Roghni Naan",
      "unit": "piece",
      "price": 60,
      "icon": "bread-slice",
      "nameUrdu": "روغنی نان"
     }
    ]
   },
   {
    "name": "Breakfast",
    "icon": "coffee",
    "items": [
     {
      "name": "Halwa Puri Set",
      "unit": "piece",
      "price": 200,
      "icon": "coffee",
      "nameUrdu": "حلوہ پوری"
     },
     {
      "name": "Puri (2pc)",
      "unit": "piece",
      "price": 60,
      "icon": "coffee",
      "nameUrdu": "پوری"
     },
     {
      "name": "Suji Halwa Plate",
      "unit": "piece",
      "price": 150,
      "icon": "barley",
      "nameUrdu": "سوجی حلوہ"
     },
     {
      "name": "Anda (Half Fry)",
      "unit": "piece",
      "price": 80,
      "icon": "coffee",
      "nameUrdu": "انڈا ہاف فرائی"
     },
     {
      "name": "Anda (Omelette)",
      "unit": "piece",
      "price": 100,
      "icon": "coffee",
      "nameUrdu": "آملیٹ"
     },
     {
      "name": "Chanay Plate",
      "unit": "piece",
      "price": 180,
      "icon": "silverware-fork-knife",
      "nameUrdu": "چنے"
     },
     {
      "name": "Siri Paye Plate",
      "unit": "piece",
      "price": 350,
      "icon": "silverware-fork-knife",
      "nameUrdu": "سری پائے"
     },
     {
      "name": "Nihari Plate",
      "unit": "piece",
      "price": 300,
      "icon": "pot",
      "nameUrdu": "نہاری"
     }
    ]
   },
   {
    "name": "Snacks",
    "icon": "popcorn",
    "items": [
     {
      "name": "Samosa (2pc)",
      "unit": "piece",
      "price": 80,
      "icon": "popcorn",
      "nameUrdu": "سموسے"
     },
     {
      "name": "Bun Kebab",
      "unit": "piece",
      "price": 150,
      "icon": "grill",
      "nameUrdu": "بن کباب"
     },
     {
      "name": "Shami Kebab (2pc)",
      "unit": "piece",
      "price": 120,
      "icon": "grill",
      "nameUrdu": "شامی کباب"
     },
     {
      "name": "Chicken Samosa (2pc)",
      "unit": "piece",
      "price": 120,
      "icon": "food-drumstick",
      "nameUrdu": "چکن سموسے"
     },
     {
      "name": "Pakoray Plate",
      "unit": "piece",
      "price": 200,
      "icon": "silverware-fork-knife",
      "nameUrdu": "پکوڑے"
     },
     {
      "name": "French Fries Plate",
      "unit": "piece",
      "price": 180,
      "icon": "french-fries"
     },
     {
      "name": "Dahi Baray Plate",
      "unit": "piece",
      "price": 180,
      "icon": "bowl",
      "nameUrdu": "دہی بڑے"
     },
     {
      "name": "Fruit Chaat Cup",
      "unit": "piece",
      "price": 150,
      "icon": "popcorn",
      "nameUrdu": "فروٹ چاٹ"
     }
    ]
   },
   {
    "name": "Daily Supplies",
    "icon": "basket",
    "items": [
     {
      "name": "Tea Leaves 1kg (Bulk)",
      "unit": "packet",
      "price": 1350,
      "icon": "tea",
      "nameUrdu": "چائے پتی"
     },
     {
      "name": "Milk 5 Litre (Daily)",
      "unit": "litre",
      "price": 900,
      "icon": "cow",
      "nameUrdu": "دودھ"
     },
     {
      "name": "Sugar 5kg",
      "unit": "packet",
      "price": 860,
      "icon": "spoon-sugar",
      "nameUrdu": "چینی"
     },
     {
      "name": "Disposable Cups (Pack of 100)",
      "unit": "packet",
      "price": 350,
      "icon": "battery-charging",
      "nameUrdu": "ڈسپوزایبل کپ"
     }
    ]
   }
  ]
 },
 {
  "shopType": "Restaurant, Fast Food & Cafe",
  "icon": "silverware-fork-knife",
  "categories": [
   {
    "name": "Desi Mains",
    "icon": "pot",
    "items": [
     {
      "name": "Chicken Karahi (Full)",
      "unit": "piece",
      "price": 1650,
      "icon": "food-drumstick",
      "nameUrdu": "چکن کڑاہی"
     },
     {
      "name": "Chicken Karahi (Half)",
      "unit": "piece",
      "price": 900,
      "icon": "food-drumstick",
      "nameUrdu": "چکن کڑاہی"
     },
     {
      "name": "Chicken White Karahi (Full)",
      "unit": "piece",
      "price": 1750,
      "icon": "food-drumstick",
      "nameUrdu": "وائٹ کڑاہی"
     },
     {
      "name": "Chicken Jalfrezi",
      "unit": "piece",
      "price": 850,
      "icon": "food-drumstick",
      "nameUrdu": "چکن جلفریزی"
     },
     {
      "name": "Chicken Handi",
      "unit": "piece",
      "price": 950,
      "icon": "food-drumstick",
      "nameUrdu": "چکن ہانڈی"
     },
     {
      "name": "Butter Chicken",
      "unit": "piece",
      "price": 1050,
      "icon": "cheese"
     },
     {
      "name": "Daal Fry",
      "unit": "piece",
      "price": 450,
      "icon": "bowl",
      "nameUrdu": "دال فرائی"
     },
     {
      "name": "Daal Makhani",
      "unit": "piece",
      "price": 550,
      "icon": "bowl",
      "nameUrdu": "دال مکھنی"
     },
     {
      "name": "Palak Paneer",
      "unit": "piece",
      "price": 750,
      "icon": "cheese",
      "nameUrdu": "پالک پنیر"
     },
     {
      "name": "Mixed Vegetable",
      "unit": "piece",
      "price": 550,
      "icon": "pot",
      "nameUrdu": "مکس سبزی"
     },
     {
      "name": "Chicken Biryani",
      "unit": "piece",
      "price": 320,
      "icon": "food-drumstick",
      "nameUrdu": "چکن بریانی"
     },
     {
      "name": "Beef Biryani",
      "unit": "piece",
      "price": 380,
      "icon": "food-steak",
      "nameUrdu": "بیف بریانی"
     },
     {
      "name": "Sindhi Biryani",
      "unit": "piece",
      "price": 350,
      "icon": "pot",
      "nameUrdu": "سندھی بریانی"
     },
     {
      "name": "Chicken Pulao",
      "unit": "piece",
      "price": 350,
      "icon": "food-drumstick",
      "nameUrdu": "چکن پلاؤ"
     },
     {
      "name": "Beef Pulao",
      "unit": "piece",
      "price": 400,
      "icon": "food-steak",
      "nameUrdu": "بیف پلاؤ"
     },
     {
      "name": "Mutton Pulao",
      "unit": "piece",
      "price": 650,
      "icon": "sheep",
      "nameUrdu": "مٹن پلاؤ"
     }
    ]
   },
   {
    "name": "BBQ",
    "icon": "grill",
    "items": [
     {
      "name": "Chicken Tikka (Leg)",
      "unit": "piece",
      "price": 320,
      "icon": "food-drumstick",
      "nameUrdu": "چکن ٹکا"
     },
     {
      "name": "Chicken Tikka (Chest)",
      "unit": "piece",
      "price": 380,
      "icon": "food-drumstick",
      "nameUrdu": "چکن ٹکا"
     },
     {
      "name": "Malai Boti (8pc)",
      "unit": "piece",
      "price": 650,
      "icon": "necklace",
      "nameUrdu": "ملائی بوٹی"
     },
     {
      "name": "Seekh Kabab Beef (4pc)",
      "unit": "piece",
      "price": 550,
      "icon": "food-steak",
      "nameUrdu": "سیخ کباب"
     },
     {
      "name": "Seekh Kabab Chicken (4pc)",
      "unit": "piece",
      "price": 500,
      "icon": "food-drumstick",
      "nameUrdu": "چکن سیخ کباب"
     },
     {
      "name": "Chapli Kabab (2pc)",
      "unit": "piece",
      "price": 380,
      "icon": "grill",
      "nameUrdu": "چپلی کباب"
     },
     {
      "name": "Chicken Wings Grilled (8pc)",
      "unit": "piece",
      "price": 650,
      "icon": "food-drumstick"
     },
     {
      "name": "Mutton Chops BBQ (4pc)",
      "unit": "piece",
      "price": 1150,
      "icon": "sheep"
     },
     {
      "name": "BBQ Platter (Family)",
      "unit": "piece",
      "price": 2450,
      "icon": "grill"
     },
     {
      "name": "Fish Grilled",
      "unit": "piece",
      "price": 850,
      "icon": "fish",
      "nameUrdu": "گرلڈ مچھلی"
     }
    ]
   },
   {
    "name": "Fast Food",
    "icon": "hamburger",
    "items": [
     {
      "name": "Zinger Burger",
      "unit": "piece",
      "price": 550,
      "icon": "hamburger"
     },
     {
      "name": "Beef Smash Burger",
      "unit": "piece",
      "price": 750,
      "icon": "food-steak"
     },
     {
      "name": "Chicken Patty Burger",
      "unit": "piece",
      "price": 350,
      "icon": "food-drumstick"
     },
     {
      "name": "Shawarma (Chicken)",
      "unit": "piece",
      "price": 320,
      "icon": "food-drumstick",
      "nameUrdu": "شاورما"
     },
     {
      "name": "Shawarma Platter",
      "unit": "piece",
      "price": 650,
      "icon": "hamburger",
      "nameUrdu": "شاورما پلیٹر"
     },
     {
      "name": "Chicken Broast (2pc)",
      "unit": "piece",
      "price": 550,
      "icon": "food-drumstick"
     },
     {
      "name": "Crispy Chicken Strips (6pc)",
      "unit": "piece",
      "price": 550,
      "icon": "food-drumstick"
     },
     {
      "name": "Loaded Fries",
      "unit": "piece",
      "price": 650,
      "icon": "french-fries"
     },
     {
      "name": "Masala Fries",
      "unit": "piece",
      "price": 350,
      "icon": "french-fries"
     },
     {
      "name": "Chicken Fajita Pizza (Small)",
      "unit": "piece",
      "price": 1150,
      "icon": "food-drumstick"
     },
     {
      "name": "Chicken Tikka Pizza (Small)",
      "unit": "piece",
      "price": 1150,
      "icon": "food-drumstick"
     },
     {
      "name": "Cheese Lovers Pizza (Small)",
      "unit": "piece",
      "price": 1250,
      "icon": "cheese"
     },
     {
      "name": "Garlic Bread (4pc)",
      "unit": "piece",
      "price": 450,
      "icon": "bread-slice"
     },
     {
      "name": "Chicken Wings Buffalo (8pc)",
      "unit": "piece",
      "price": 750,
      "icon": "food-drumstick"
     },
     {
      "name": "Club Sandwich",
      "unit": "piece",
      "price": 550,
      "icon": "food-variant"
     },
     {
      "name": "Grilled Sandwich",
      "unit": "piece",
      "price": 450,
      "icon": "food-variant"
     }
    ]
   },
   {
    "name": "Chinese",
    "icon": "food-variant",
    "items": [
     {
      "name": "Chicken Chow Mein",
      "unit": "piece",
      "price": 650,
      "icon": "food-drumstick"
     },
     {
      "name": "Vegetable Chow Mein",
      "unit": "piece",
      "price": 550,
      "icon": "food-variant"
     },
     {
      "name": "Chicken Fried Rice",
      "unit": "piece",
      "price": 550,
      "icon": "food-drumstick"
     },
     {
      "name": "Egg Fried Rice",
      "unit": "piece",
      "price": 450,
      "icon": "egg"
     },
     {
      "name": "Kung Pao Chicken",
      "unit": "piece",
      "price": 850,
      "icon": "food-drumstick"
     },
     {
      "name": "Sweet & Sour Chicken",
      "unit": "piece",
      "price": 850,
      "icon": "food-drumstick"
     },
     {
      "name": "Chicken Manchurian",
      "unit": "piece",
      "price": 850,
      "icon": "food-drumstick"
     },
     {
      "name": "Hot & Sour Soup",
      "unit": "piece",
      "price": 450,
      "icon": "bowl"
     },
     {
      "name": "Chicken Corn Soup",
      "unit": "piece",
      "price": 400,
      "icon": "food-drumstick"
     },
     {
      "name": "Spring Rolls (4pc)",
      "unit": "piece",
      "price": 450,
      "icon": "food-variant"
     }
    ]
   },
   {
    "name": "Drinks & Shakes",
    "icon": "glass-cocktail",
    "items": [
     {
      "name": "Fresh Orange Juice",
      "unit": "piece",
      "price": 350,
      "icon": "cup",
      "nameUrdu": "تازہ سنگترے کا رس"
     },
     {
      "name": "Mango Shake",
      "unit": "piece",
      "price": 450,
      "icon": "cup"
     },
     {
      "name": "Banana Shake",
      "unit": "piece",
      "price": 350,
      "icon": "cup"
     },
     {
      "name": "Chocolate Shake",
      "unit": "piece",
      "price": 500,
      "icon": "bottle-soda"
     },
     {
      "name": "Strawberry Shake",
      "unit": "piece",
      "price": 500,
      "icon": "cup"
     },
     {
      "name": "Dates Shake",
      "unit": "piece",
      "price": 550,
      "icon": "cup"
     },
     {
      "name": "Cold Coffee",
      "unit": "piece",
      "price": 450,
      "icon": "coffee"
     },
     {
      "name": "Mint Margarita",
      "unit": "piece",
      "price": 350,
      "icon": "leaf"
     },
     {
      "name": "Pina Colada",
      "unit": "piece",
      "price": 550,
      "icon": "bottle-soda"
     },
     {
      "name": "Kashmiri Chai",
      "unit": "piece",
      "price": 250,
      "icon": "glass-cocktail",
      "nameUrdu": "کشمیری چائے"
     },
     {
      "name": "Doodh Patti",
      "unit": "piece",
      "price": 150,
      "icon": "glass-cocktail",
      "nameUrdu": "دودھ پتی"
     },
     {
      "name": "Mineral Water 500ml",
      "unit": "piece",
      "price": 120,
      "icon": "glass-cocktail"
     }
    ]
   },
   {
    "name": "Desserts",
    "icon": "ice-cream",
    "items": [
     {
      "name": "Gulab Jamun (4pc)",
      "unit": "piece",
      "price": 300,
      "icon": "candy",
      "nameUrdu": "گلاب جامن"
     },
     {
      "name": "Kheer",
      "unit": "piece",
      "price": 300,
      "icon": "candy",
      "nameUrdu": "کھیر"
     },
     {
      "name": "Shahi Tukra",
      "unit": "piece",
      "price": 350,
      "icon": "ice-cream",
      "nameUrdu": "شاہی ٹکڑا"
     },
     {
      "name": "Chocolate Brownie",
      "unit": "piece",
      "price": 450,
      "icon": "bottle-soda"
     },
     {
      "name": "Ice Cream Scoop (2)",
      "unit": "piece",
      "price": 300,
      "icon": "cheese",
      "nameUrdu": "آئس کریم"
     },
     {
      "name": "Falooda",
      "unit": "piece",
      "price": 550,
      "icon": "ice-cream",
      "nameUrdu": "فالودہ"
     },
     {
      "name": "Rabri",
      "unit": "piece",
      "price": 350,
      "icon": "candy",
      "nameUrdu": "ربڑی"
     },
     {
      "name": "Kulfi Falooda",
      "unit": "piece",
      "price": 600,
      "icon": "ice-cream",
      "nameUrdu": "قلفی فالودہ"
     }
    ]
   },
   {
    "name": "Roti, Naan & Sides",
    "icon": "bread-slice",
    "items": [
     {
      "name": "Tandoori Roti",
      "unit": "piece",
      "price": 30,
      "icon": "bread-slice",
      "nameUrdu": "تندوری روٹی"
     },
     {
      "name": "Roghni Naan",
      "unit": "piece",
      "price": 70,
      "icon": "bread-slice",
      "nameUrdu": "روغنی نان"
     },
     {
      "name": "Garlic Naan",
      "unit": "piece",
      "price": 90,
      "icon": "bread-slice"
     },
     {
      "name": "Cheese Naan",
      "unit": "piece",
      "price": 180,
      "icon": "cheese"
     },
     {
      "name": "Raita",
      "unit": "piece",
      "price": 120,
      "icon": "bread-slice",
      "nameUrdu": "رائتہ"
     },
     {
      "name": "Mint Chutney",
      "unit": "piece",
      "price": 120,
      "icon": "leaf",
      "nameUrdu": "پودینے کی چٹنی"
     },
     {
      "name": "Green Salad",
      "unit": "piece",
      "price": 200,
      "icon": "bread-slice"
     },
     {
      "name": "Fries (Side)",
      "unit": "piece",
      "price": 280,
      "icon": "french-fries"
     }
    ]
   }
  ]
 },
 {
  "shopType": "Pharmacy / Medical Store",
  "icon": "pill",
  "categories": [
   {
    "name": "Pain Relief & Fever",
    "icon": "pill",
    "items": [
     {
      "name": "Paracetamol 500mg Strip of 10",
      "unit": "packet",
      "price": 40,
      "icon": "pill"
     },
     {
      "name": "Paracetamol 650mg Strip of 10",
      "unit": "packet",
      "price": 60,
      "icon": "pill"
     },
     {
      "name": "Paracetamol 250mg Strip of 10",
      "unit": "packet",
      "price": 35,
      "icon": "pill"
     },
     {
      "name": "Ibuprofen 400mg Strip of 10",
      "unit": "packet",
      "price": 80,
      "icon": "pill"
     },
     {
      "name": "Diclofenac Sodium 50mg Strip of 20",
      "unit": "packet",
      "price": 90,
      "icon": "pill"
     },
     {
      "name": "Mefenamic Acid 250mg Strip of 10",
      "unit": "packet",
      "price": 70,
      "icon": "pill"
     },
     {
      "name": "Piroxicam 20mg Strip of 10",
      "unit": "packet",
      "price": 80,
      "icon": "pill"
     },
     {
      "name": "Ketorolac 10mg Strip of 10",
      "unit": "packet",
      "price": 90,
      "icon": "pill"
     },
     {
      "name": "Aspirin 75mg Strip of 20",
      "unit": "packet",
      "price": 70,
      "icon": "pill"
     },
     {
      "name": "Naproxen 250mg Strip of 10",
      "unit": "packet",
      "price": 85,
      "icon": "pill"
     },
     {
      "name": "Flurbiprofen 100mg Strip of 20",
      "unit": "packet",
      "price": 95,
      "icon": "pill"
     },
     {
      "name": "Etoricoxib 60mg Strip of 10",
      "unit": "packet",
      "price": 200,
      "icon": "pill"
     },
     {
      "name": "Diclofenac Gel Tube 30g",
      "unit": "piece",
      "price": 150,
      "icon": "tire"
     },
     {
      "name": "Methyl Salicylate Balm Jar 40g",
      "unit": "piece",
      "price": 170,
      "icon": "pill"
     },
     {
      "name": "Muscle Relaxant Cream Tube 30g",
      "unit": "piece",
      "price": 180,
      "icon": "cheese"
     },
     {
      "name": "Pain Relief Spray Bottle 100ml",
      "unit": "piece",
      "price": 250,
      "icon": "pill"
     },
     {
      "name": "Ibuprofen Suspension Bottle 100ml",
      "unit": "piece",
      "price": 120,
      "icon": "pill"
     },
     {
      "name": "Paracetamol Syrup Bottle 120ml",
      "unit": "piece",
      "price": 130,
      "icon": "bottle-tonic"
     },
     {
      "name": "Paracetamol 125mg Syrup Bottle 90ml",
      "unit": "piece",
      "price": 110,
      "icon": "bottle-tonic"
     }
    ]
   },
   {
    "name": "Cold, Cough & Allergy",
    "icon": "bottle-tonic",
    "items": [
     {
      "name": "Cetirizine 10mg Strip of 10",
      "unit": "packet",
      "price": 60,
      "icon": "bottle-tonic"
     },
     {
      "name": "Loratadine 10mg Strip of 10",
      "unit": "packet",
      "price": 80,
      "icon": "bottle-tonic"
     },
     {
      "name": "Fexofenadine 120mg Strip of 10",
      "unit": "packet",
      "price": 150,
      "icon": "bottle-tonic"
     },
     {
      "name": "Chlorpheniramine 4mg Strip of 20",
      "unit": "packet",
      "price": 50,
      "icon": "bottle-tonic"
     },
     {
      "name": "Levocetirizine 5mg Strip of 10",
      "unit": "packet",
      "price": 90,
      "icon": "bottle-tonic"
     },
     {
      "name": "Dextromethorphan Cough Syrup 120ml",
      "unit": "piece",
      "price": 180,
      "icon": "bottle-tonic"
     },
     {
      "name": "Ambroxol Cough Syrup 120ml",
      "unit": "piece",
      "price": 200,
      "icon": "bottle-tonic"
     },
     {
      "name": "Honey Cough Lozenges Box of 24",
      "unit": "box",
      "price": 130,
      "icon": "bee"
     },
     {
      "name": "Menthol Inhaler Stick",
      "unit": "piece",
      "price": 90,
      "icon": "bottle-tonic"
     },
     {
      "name": "Vapor Rub Jar 50g",
      "unit": "piece",
      "price": 180,
      "icon": "bottle-tonic"
     },
     {
      "name": "Nasal Decongestant Spray Bottle 15ml",
      "unit": "piece",
      "price": 220,
      "icon": "bottle-tonic"
     },
     {
      "name": "Anti-Allergy Eye Drops Bottle 10ml",
      "unit": "piece",
      "price": 250,
      "icon": "eyedropper"
     },
     {
      "name": "Saline Nasal Drops Bottle 15ml",
      "unit": "piece",
      "price": 130,
      "icon": "bottle-tonic"
     },
     {
      "name": "Steam Inhaler Cup",
      "unit": "piece",
      "price": 250,
      "icon": "tea"
     },
     {
      "name": "Throat Soothing Tablets Strip of 20",
      "unit": "packet",
      "price": 100,
      "icon": "pill"
     },
     {
      "name": "Vitamin C + Zinc Cold Tablets Strip of 10",
      "unit": "packet",
      "price": 140,
      "icon": "pill"
     }
    ]
   },
   {
    "name": "Digestive Health",
    "icon": "stomach",
    "items": [
     {
      "name": "Omeprazole 20mg Strip of 14",
      "unit": "packet",
      "price": 120,
      "icon": "stomach"
     },
     {
      "name": "Esomeprazole 20mg Strip of 14",
      "unit": "packet",
      "price": 160,
      "icon": "stomach"
     },
     {
      "name": "Antacid Chewable Tablets Strip of 20",
      "unit": "packet",
      "price": 80,
      "icon": "pill"
     },
     {
      "name": "Antacid Syrup Bottle 200ml",
      "unit": "piece",
      "price": 220,
      "icon": "bottle-tonic"
     },
     {
      "name": "ORS Sachet",
      "unit": "piece",
      "price": 25,
      "icon": "stomach"
     },
     {
      "name": "ORS Box of 10 Sachets",
      "unit": "box",
      "price": 220,
      "icon": "stomach"
     },
     {
      "name": "Loperamide 2mg Strip of 10",
      "unit": "packet",
      "price": 60,
      "icon": "stomach"
     },
     {
      "name": "Lactulose Syrup Bottle 120ml",
      "unit": "piece",
      "price": 280,
      "icon": "bottle-tonic"
     },
     {
      "name": "Domperidone 10mg Strip of 20",
      "unit": "packet",
      "price": 90,
      "icon": "stomach"
     },
     {
      "name": "Simethicone Drops Bottle 15ml",
      "unit": "piece",
      "price": 150,
      "icon": "leaf"
     },
     {
      "name": "Activated Charcoal Tablets Strip of 10",
      "unit": "packet",
      "price": 100,
      "icon": "pill"
     },
     {
      "name": "Glycerin Suppositories Box of 6",
      "unit": "box",
      "price": 120,
      "icon": "stomach"
     },
     {
      "name": "Probiotic Sachets Box of 10",
      "unit": "box",
      "price": 400,
      "icon": "stomach"
     },
     {
      "name": "Digestive Enzyme Tablets Strip of 20",
      "unit": "packet",
      "price": 140,
      "icon": "pill"
     },
     {
      "name": "Isabgol Husk Packet 100g",
      "unit": "packet",
      "price": 180,
      "icon": "stomach"
     }
    ]
   },
   {
    "name": "First Aid & Wound Care",
    "icon": "bandage",
    "items": [
     {
      "name": "Adhesive Bandage Box of 100",
      "unit": "box",
      "price": 200,
      "icon": "bandage"
     },
     {
      "name": "Elastic Crepe Bandage 4 inch",
      "unit": "piece",
      "price": 120,
      "icon": "bandage"
     },
     {
      "name": "Cotton Roll 200g",
      "unit": "piece",
      "price": 150,
      "icon": "bandage"
     },
     {
      "name": "Cotton Balls Packet",
      "unit": "packet",
      "price": 80,
      "icon": "bandage"
     },
     {
      "name": "Sterile Gauze Pads Box of 25",
      "unit": "box",
      "price": 180,
      "icon": "bandage"
     },
     {
      "name": "Medical Adhesive Tape Roll",
      "unit": "piece",
      "price": 70,
      "icon": "bandage"
     },
     {
      "name": "Antiseptic Liquid Bottle 250ml",
      "unit": "piece",
      "price": 160,
      "icon": "bandage"
     },
     {
      "name": "Povidone Iodine Ointment Tube 20g",
      "unit": "piece",
      "price": 130,
      "icon": "tire"
     },
     {
      "name": "Hydrogen Peroxide Bottle 100ml",
      "unit": "piece",
      "price": 140,
      "icon": "bandage"
     },
     {
      "name": "Surgical Spirit Bottle 100ml",
      "unit": "piece",
      "price": 140,
      "icon": "bandage"
     },
     {
      "name": "Burn Relief Cream Tube 25g",
      "unit": "piece",
      "price": 160,
      "icon": "cheese"
     },
     {
      "name": "Triangular Bandage",
      "unit": "piece",
      "price": 90,
      "icon": "bandage"
     },
     {
      "name": "First Aid Kit Box",
      "unit": "box",
      "price": 1200,
      "icon": "bandage"
     },
     {
      "name": "Digital Thermometer",
      "unit": "piece",
      "price": 450,
      "icon": "heart-pulse"
     },
     {
      "name": "Forehead Thermometer Strips Pack of 10",
      "unit": "packet",
      "price": 60,
      "icon": "heart-pulse"
     },
     {
      "name": "Hand Sanitizer Bottle 200ml",
      "unit": "piece",
      "price": 250,
      "icon": "spray-bottle"
     },
     {
      "name": "Instant Cold Pack",
      "unit": "piece",
      "price": 180,
      "icon": "bandage"
     }
    ]
   },
   {
    "name": "Baby & Mother Care",
    "icon": "baby-bottle",
    "items": [
     {
      "name": "Baby Diapers Pack of 20",
      "unit": "packet",
      "price": 650,
      "icon": "diaper-outline"
     },
     {
      "name": "Baby Wipes Pack of 80",
      "unit": "packet",
      "price": 450,
      "icon": "baby-bottle"
     },
     {
      "name": "Baby Lotion Bottle 200ml",
      "unit": "piece",
      "price": 350,
      "icon": "lotion"
     },
     {
      "name": "Baby Shampoo Bottle 200ml",
      "unit": "piece",
      "price": 380,
      "icon": "bottle-tonic"
     },
     {
      "name": "Baby Powder Jar 200g",
      "unit": "piece",
      "price": 300,
      "icon": "baby-bottle"
     },
     {
      "name": "Baby Oil Bottle 200ml",
      "unit": "piece",
      "price": 320,
      "icon": "oil"
     },
     {
      "name": "Baby Feeding Bottle 250ml",
      "unit": "piece",
      "price": 450,
      "icon": "baby-bottle"
     },
     {
      "name": "Silicone Nipples Set of 2",
      "unit": "packet",
      "price": 150,
      "icon": "baby-bottle"
     },
     {
      "name": "Diaper Rash Cream Tube 50g",
      "unit": "piece",
      "price": 280,
      "icon": "cheese"
     },
     {
      "name": "Baby Soap Bar",
      "unit": "piece",
      "price": 180,
      "icon": "baby-bottle"
     },
     {
      "name": "Baby Towel",
      "unit": "piece",
      "price": 550,
      "icon": "baby-bottle"
     },
     {
      "name": "Kids Multivitamin Syrup Bottle 120ml",
      "unit": "piece",
      "price": 280,
      "icon": "bottle-tonic"
     },
     {
      "name": "Iron Drops Bottle 15ml",
      "unit": "piece",
      "price": 180,
      "icon": "iron"
     },
     {
      "name": "Teething Gel Tube 15g",
      "unit": "piece",
      "price": 220,
      "icon": "tire"
     }
    ]
   },
   {
    "name": "Chronic Care & Devices",
    "icon": "heart-pulse",
    "items": [
     {
      "name": "Metformin 500mg Strip of 20",
      "unit": "packet",
      "price": 120,
      "icon": "heart-pulse"
     },
     {
      "name": "Glibenclamide 5mg Strip of 20",
      "unit": "packet",
      "price": 90,
      "icon": "heart-pulse"
     },
     {
      "name": "Amlodipine 5mg Strip of 20",
      "unit": "packet",
      "price": 110,
      "icon": "heart-pulse"
     },
     {
      "name": "Losartan 50mg Strip of 20",
      "unit": "packet",
      "price": 180,
      "icon": "heart-pulse"
     },
     {
      "name": "Atorvastatin 20mg Strip of 20",
      "unit": "packet",
      "price": 220,
      "icon": "heart-pulse"
     },
     {
      "name": "Thyroxine 50mcg Strip of 50",
      "unit": "packet",
      "price": 180,
      "icon": "heart-pulse"
     },
     {
      "name": "Blood Pressure Monitor",
      "unit": "piece",
      "price": 4500,
      "icon": "heart-pulse"
     },
     {
      "name": "Digital Glucometer",
      "unit": "piece",
      "price": 2800,
      "icon": "heart-pulse"
     },
     {
      "name": "Blood Glucose Test Strips Box of 50",
      "unit": "box",
      "price": 1400,
      "icon": "heart-pulse"
     },
     {
      "name": "Insulin Syringes Box of 10",
      "unit": "box",
      "price": 150,
      "icon": "heart-pulse"
     },
     {
      "name": "Alcohol Swabs Box of 100",
      "unit": "box",
      "price": 200,
      "icon": "heart-pulse"
     },
     {
      "name": "Nebulizer Machine",
      "unit": "piece",
      "price": 5500,
      "icon": "heart-pulse"
     },
     {
      "name": "Digital Pulse Oximeter",
      "unit": "piece",
      "price": 1800,
      "icon": "heart-pulse"
     },
     {
      "name": "Hot Water Bag 2 Litre",
      "unit": "piece",
      "price": 350,
      "icon": "heart-pulse"
     },
     {
      "name": "Surgical Gloves Box of 100",
      "unit": "box",
      "price": 600,
      "icon": "heart-pulse"
     },
     {
      "name": "Face Masks Box of 50",
      "unit": "box",
      "price": 350,
      "icon": "face-mask"
     }
    ]
   },
   {
    "name": "Vitamins & Supplements",
    "icon": "pill-multiple",
    "items": [
     {
      "name": "Vitamin C 500mg Chewable Strip of 20",
      "unit": "packet",
      "price": 150,
      "icon": "pill-multiple"
     },
     {
      "name": "Vitamin D3 Drops Bottle 15ml",
      "unit": "piece",
      "price": 280,
      "icon": "pill-multiple"
     },
     {
      "name": "Calcium + Vitamin D Tablets Bottle of 60",
      "unit": "piece",
      "price": 450,
      "icon": "pill"
     },
     {
      "name": "Multivitamin Strip of 20",
      "unit": "packet",
      "price": 200,
      "icon": "pill-multiple"
     },
     {
      "name": "Iron + Folic Acid Strip of 30",
      "unit": "packet",
      "price": 160,
      "icon": "iron"
     },
     {
      "name": "Zinc 20mg Strip of 20",
      "unit": "packet",
      "price": 180,
      "icon": "sprout"
     },
     {
      "name": "B-Complex Strip of 20",
      "unit": "packet",
      "price": 170,
      "icon": "pill-multiple"
     },
     {
      "name": "Cod Liver Oil Bottle of 60",
      "unit": "piece",
      "price": 500,
      "icon": "oil"
     },
     {
      "name": "Omega-3 Capsules Bottle of 30",
      "unit": "piece",
      "price": 800,
      "icon": "pill"
     },
     {
      "name": "Folic Acid 5mg Strip of 20",
      "unit": "packet",
      "price": 90,
      "icon": "pill-multiple"
     },
     {
      "name": "Vitamin E 400mg Strip of 10",
      "unit": "packet",
      "price": 250,
      "icon": "pill-multiple"
     },
     {
      "name": "Electrolyte Powder Box of 6",
      "unit": "box",
      "price": 250,
      "icon": "pill-multiple"
     },
     {
      "name": "Glucosamine Tablets Bottle of 30",
      "unit": "piece",
      "price": 650,
      "icon": "pill"
     }
    ]
   }
  ]
 },
 {
  "shopType": "Cosmetics & Beauty",
  "icon": "lipstick",
  "categories": [
   {
    "name": "Skin Care",
    "icon": "lotion",
    "items": [
     {
      "name": "Face Wash Tube 100ml",
      "unit": "piece",
      "price": 350,
      "icon": "lotion"
     },
     {
      "name": "Moisturizing Cream Jar 100ml",
      "unit": "piece",
      "price": 450,
      "icon": "lotion"
     },
     {
      "name": "Fairness Cream Jar 50ml",
      "unit": "piece",
      "price": 550,
      "icon": "lotion"
     },
     {
      "name": "Sunscreen Lotion SPF 50",
      "unit": "piece",
      "price": 650,
      "icon": "lotion"
     },
     {
      "name": "Rose Water Bottle 120ml",
      "unit": "piece",
      "price": 200,
      "icon": "lotion"
     },
     {
      "name": "Facial Cleanser Bottle 150ml",
      "unit": "piece",
      "price": 400,
      "icon": "lotion"
     },
     {
      "name": "Skin Toner Bottle 100ml",
      "unit": "piece",
      "price": 450,
      "icon": "lotion"
     },
     {
      "name": "Night Cream Jar 50ml",
      "unit": "piece",
      "price": 700,
      "icon": "lotion"
     },
     {
      "name": "Under-Eye Cream Tube 15ml",
      "unit": "piece",
      "price": 600,
      "icon": "cheese"
     },
     {
      "name": "Face Scrub Tube 100ml",
      "unit": "piece",
      "price": 380,
      "icon": "tire"
     },
     {
      "name": "Sheet Mask",
      "unit": "piece",
      "price": 150,
      "icon": "lotion"
     },
     {
      "name": "Aloe Vera Gel Tube 150ml",
      "unit": "piece",
      "price": 350,
      "icon": "tire"
     },
     {
      "name": "Body Lotion Bottle 200ml",
      "unit": "piece",
      "price": 550,
      "icon": "lotion"
     },
     {
      "name": "Petroleum Jelly Jar 100ml",
      "unit": "piece",
      "price": 250,
      "icon": "lotion"
     },
     {
      "name": "Cold Cream Jar 60ml",
      "unit": "piece",
      "price": 300,
      "icon": "lotion"
     },
     {
      "name": "Lip Balm Stick",
      "unit": "piece",
      "price": 150,
      "icon": "lipstick"
     },
     {
      "name": "Face Serum Bottle 30ml",
      "unit": "piece",
      "price": 900,
      "icon": "lotion"
     },
     {
      "name": "Anti-Acne Gel Tube 20g",
      "unit": "piece",
      "price": 420,
      "icon": "tire"
     }
    ]
   },
   {
    "name": "Hair Care",
    "icon": "hair-dryer",
    "items": [
     {
      "name": "Shampoo Bottle 340ml",
      "unit": "piece",
      "price": 550,
      "icon": "bottle-tonic"
     },
     {
      "name": "Conditioner Bottle 200ml",
      "unit": "piece",
      "price": 500,
      "icon": "hair-dryer"
     },
     {
      "name": "Hair Oil Bottle 200ml",
      "unit": "piece",
      "price": 380,
      "icon": "oil"
     },
     {
      "name": "Hair Dye Box",
      "unit": "box",
      "price": 450,
      "icon": "hair-dryer"
     },
     {
      "name": "Hair Color Cream Box",
      "unit": "box",
      "price": 520,
      "icon": "cheese"
     },
     {
      "name": "Hair Serum Bottle 50ml",
      "unit": "piece",
      "price": 650,
      "icon": "lotion"
     },
     {
      "name": "Hair Mask Jar 200ml",
      "unit": "piece",
      "price": 550,
      "icon": "hair-dryer"
     },
     {
      "name": "Hair Gel Tube 150ml",
      "unit": "piece",
      "price": 350,
      "icon": "tire"
     },
     {
      "name": "Hair Spray Bottle 200ml",
      "unit": "piece",
      "price": 480,
      "icon": "hair-dryer"
     },
     {
      "name": "Anti-Dandruff Shampoo 180ml",
      "unit": "piece",
      "price": 600,
      "icon": "bottle-tonic"
     },
     {
      "name": "Dry Shampoo Spray 150ml",
      "unit": "piece",
      "price": 550,
      "icon": "bottle-tonic"
     },
     {
      "name": "Hair Straightening Cream Jar",
      "unit": "piece",
      "price": 800,
      "icon": "cheese"
     },
     {
      "name": "Curl Defining Cream Tube",
      "unit": "piece",
      "price": 600,
      "icon": "cheese"
     },
     {
      "name": "Hair Clips Set of 6",
      "unit": "packet",
      "price": 150,
      "icon": "hair-dryer"
     },
     {
      "name": "Wide-Tooth Comb",
      "unit": "piece",
      "price": 120,
      "icon": "hair-dryer"
     },
     {
      "name": "Hair Brush",
      "unit": "piece",
      "price": 280,
      "icon": "brush"
     }
    ]
   },
   {
    "name": "Makeup",
    "icon": "lipstick",
    "items": [
     {
      "name": "Liquid Foundation Bottle",
      "unit": "piece",
      "price": 950,
      "icon": "lipstick"
     },
     {
      "name": "Compact Powder",
      "unit": "piece",
      "price": 650,
      "icon": "lipstick"
     },
     {
      "name": "Concealer Stick",
      "unit": "piece",
      "price": 550,
      "icon": "lipstick"
     },
     {
      "name": "Blush Palette",
      "unit": "piece",
      "price": 750,
      "icon": "lipstick"
     },
     {
      "name": "Eyeshadow Palette 12 Shades",
      "unit": "piece",
      "price": 1200,
      "icon": "lipstick"
     },
     {
      "name": "Mascara",
      "unit": "piece",
      "price": 550,
      "icon": "eye"
     },
     {
      "name": "Eyeliner Pencil",
      "unit": "piece",
      "price": 350,
      "icon": "eye"
     },
     {
      "name": "Kajal Stick",
      "unit": "piece",
      "price": 200,
      "icon": "eye",
      "nameUrdu": "کاجل"
     },
     {
      "name": "Lipstick",
      "unit": "piece",
      "price": 450,
      "icon": "lipstick"
     },
     {
      "name": "Lip Gloss Tube",
      "unit": "piece",
      "price": 380,
      "icon": "lipstick"
     },
     {
      "name": "Lip Liner Set of 3",
      "unit": "packet",
      "price": 300,
      "icon": "lipstick"
     },
     {
      "name": "Makeup Brushes Set of 12",
      "unit": "box",
      "price": 850,
      "icon": "brush"
     },
     {
      "name": "Beauty Blender Sponge",
      "unit": "piece",
      "price": 250,
      "icon": "lipstick"
     },
     {
      "name": "Makeup Remover Wipes Pack of 25",
      "unit": "packet",
      "price": 400,
      "icon": "lipstick"
     },
     {
      "name": "Face Primer Tube",
      "unit": "piece",
      "price": 700,
      "icon": "format-paint"
     },
     {
      "name": "Setting Spray Bottle",
      "unit": "piece",
      "price": 800,
      "icon": "lipstick"
     },
     {
      "name": "Highlighter Palette",
      "unit": "piece",
      "price": 600,
      "icon": "marker"
     },
     {
      "name": "Nail Polish Bottle",
      "unit": "piece",
      "price": 280,
      "icon": "nail"
     }
    ]
   },
   {
    "name": "Mehndi & Traditional",
    "icon": "flower",
    "items": [
     {
      "name": "Mehndi Cone",
      "unit": "piece",
      "price": 60,
      "icon": "flower",
      "nameUrdu": "مہندی"
     },
     {
      "name": "Red Mehndi Powder Packet 100g",
      "unit": "packet",
      "price": 120,
      "icon": "flower",
      "nameUrdu": "مہندی"
     },
     {
      "name": "Black Mehndi Packet",
      "unit": "packet",
      "price": 150,
      "icon": "flower"
     },
     {
      "name": "Mehndi Oil Bottle 60ml",
      "unit": "piece",
      "price": 200,
      "icon": "flower"
     },
     {
      "name": "Mehndi Stencil Stickers Pack",
      "unit": "packet",
      "price": 180,
      "icon": "flower"
     },
     {
      "name": "Hair Henna Powder Packet 200g",
      "unit": "packet",
      "price": 200,
      "icon": "flower"
     },
     {
      "name": "Sindoor Box",
      "unit": "piece",
      "price": 120,
      "icon": "flower"
     },
     {
      "name": "Bindi Packet of 20",
      "unit": "packet",
      "price": 80,
      "icon": "flower",
      "nameUrdu": "بندی"
     },
     {
      "name": "Alta Bottle 15ml",
      "unit": "piece",
      "price": 150,
      "icon": "flower",
      "nameUrdu": "آلتا"
     },
     {
      "name": "Surma Stick",
      "unit": "piece",
      "price": 180,
      "icon": "eye",
      "nameUrdu": "سرمہ"
     },
     {
      "name": "Kohl Pencil",
      "unit": "piece",
      "price": 100,
      "icon": "pen"
     },
     {
      "name": "Mehndi Design Book",
      "unit": "piece",
      "price": 300,
      "icon": "flower"
     }
    ]
   },
   {
    "name": "Fragrances & Salon",
    "icon": "spray",
    "items": [
     {
      "name": "Eau de Toilette Bottle 100ml",
      "unit": "piece",
      "price": 1500,
      "icon": "spray"
     },
     {
      "name": "Perfume Spray 50ml",
      "unit": "piece",
      "price": 1200,
      "icon": "spray"
     },
     {
      "name": "Attar Bottle 12ml",
      "unit": "piece",
      "price": 800,
      "icon": "spray",
      "nameUrdu": "عطر"
     },
     {
      "name": "Deodorant Spray 150ml",
      "unit": "piece",
      "price": 550,
      "icon": "spray"
     },
     {
      "name": "Roll-On Deodorant 50ml",
      "unit": "piece",
      "price": 350,
      "icon": "spray"
     },
     {
      "name": "Body Spray 120ml",
      "unit": "piece",
      "price": 480,
      "icon": "spray"
     },
     {
      "name": "Talcum Powder Tin 200g",
      "unit": "piece",
      "price": 300,
      "icon": "spray"
     },
     {
      "name": "Hair Cutting Scissors",
      "unit": "piece",
      "price": 650,
      "icon": "scissors-cutting"
     },
     {
      "name": "Hair Clipper Machine",
      "unit": "piece",
      "price": 2800,
      "icon": "spray"
     },
     {
      "name": "Hair Dryer 2000W",
      "unit": "piece",
      "price": 2500,
      "icon": "hair-dryer"
     },
     {
      "name": "Nail Cutter Set of 3",
      "unit": "packet",
      "price": 350,
      "icon": "nail"
     },
     {
      "name": "Manicure Set",
      "unit": "box",
      "price": 700,
      "icon": "spray"
     },
     {
      "name": "Pedicure Kit",
      "unit": "box",
      "price": 900,
      "icon": "spray"
     },
     {
      "name": "Facial Kit Box of 6 Steps",
      "unit": "box",
      "price": 1400,
      "icon": "spray"
     },
     {
      "name": "Wax Strips Pack of 20",
      "unit": "packet",
      "price": 450,
      "icon": "spray"
     },
     {
      "name": "Threading Thread Spool",
      "unit": "piece",
      "price": 120,
      "icon": "spray"
     }
    ]
   }
  ]
 },
 {
  "shopType": "Crockery, Kitchenware & Plastics",
  "icon": "pot",
  "categories": [
   {
    "name": "Steel Kitchenware",
    "icon": "pot",
    "items": [
     {
      "name": "Steel Dinner Plate",
      "unit": "piece",
      "price": 250,
      "icon": "pipe"
     },
     {
      "name": "Steel Bowl",
      "unit": "piece",
      "price": 180,
      "icon": "pipe"
     },
     {
      "name": "Steel Glass",
      "unit": "piece",
      "price": 150,
      "icon": "pipe"
     },
     {
      "name": "Steel Water Jug 2 Litre",
      "unit": "piece",
      "price": 550,
      "icon": "pipe"
     },
     {
      "name": "Steel Cooking Pot 5 Litre",
      "unit": "piece",
      "price": 1200,
      "icon": "pipe"
     },
     {
      "name": "Steel Kadai",
      "unit": "piece",
      "price": 900,
      "icon": "pipe"
     },
     {
      "name": "Steel Spoon Set of 6",
      "unit": "box",
      "price": 350,
      "icon": "pipe"
     },
     {
      "name": "Steel Serving Tray",
      "unit": "piece",
      "price": 400,
      "icon": "pipe"
     },
     {
      "name": "Steel Lunch Box 3 Tier",
      "unit": "piece",
      "price": 550,
      "icon": "pipe"
     },
     {
      "name": "Steel Tea Pot",
      "unit": "piece",
      "price": 700,
      "icon": "tea"
     },
     {
      "name": "Steel Dinner Set 32 Pieces",
      "unit": "box",
      "price": 6500,
      "icon": "pipe"
     },
     {
      "name": "Steel Storage Containers Set of 3",
      "unit": "packet",
      "price": 800,
      "icon": "pipe"
     },
     {
      "name": "Steel Water Bottle 1 Litre",
      "unit": "piece",
      "price": 450,
      "icon": "pipe"
     },
     {
      "name": "Steel Milk Pot 2 Litre",
      "unit": "piece",
      "price": 650,
      "icon": "cow"
     }
    ]
   },
   {
    "name": "Plastic Storage & Household",
    "icon": "tray",
    "items": [
     {
      "name": "Plastic Storage Container 5 Litre",
      "unit": "piece",
      "price": 300,
      "icon": "tray"
     },
     {
      "name": "Food Storage Box Set of 5",
      "unit": "packet",
      "price": 700,
      "icon": "tray"
     },
     {
      "name": "Plastic Water Jug",
      "unit": "piece",
      "price": 350,
      "icon": "tray"
     },
     {
      "name": "Plastic Bucket 20 Litre",
      "unit": "piece",
      "price": 550,
      "icon": "bucket"
     },
     {
      "name": "Plastic Mug",
      "unit": "piece",
      "price": 120,
      "icon": "cup"
     },
     {
      "name": "Plastic Laundry Basket",
      "unit": "piece",
      "price": 550,
      "icon": "tray"
     },
     {
      "name": "Plastic Serving Tray",
      "unit": "piece",
      "price": 200,
      "icon": "tray"
     },
     {
      "name": "Plastic Dustbin with Lid",
      "unit": "piece",
      "price": 650,
      "icon": "tray"
     },
     {
      "name": "Plastic Stool",
      "unit": "piece",
      "price": 450,
      "icon": "tray"
     },
     {
      "name": "Plastic Chair",
      "unit": "piece",
      "price": 950,
      "icon": "seat"
     },
     {
      "name": "Plastic Folding Table",
      "unit": "piece",
      "price": 1800,
      "icon": "tray"
     },
     {
      "name": "Plastic Water Cooler 14 Litre",
      "unit": "piece",
      "price": 2800,
      "icon": "tray"
     },
     {
      "name": "Plastic Plate Set of 6",
      "unit": "packet",
      "price": 500,
      "icon": "silverware-fork-knife"
     },
     {
      "name": "Plastic Clothes Hangers Pack of 12",
      "unit": "packet",
      "price": 300,
      "icon": "tray"
     }
    ]
   },
   {
    "name": "Melamine & Dinnerware",
    "icon": "silverware-fork-knife",
    "items": [
     {
      "name": "Melamine Dinner Set 36 Pieces",
      "unit": "box",
      "price": 4500,
      "icon": "silverware-fork-knife"
     },
     {
      "name": "Melamine Dinner Plate",
      "unit": "piece",
      "price": 180,
      "icon": "silverware-fork-knife"
     },
     {
      "name": "Melamine Bowl",
      "unit": "piece",
      "price": 150,
      "icon": "silverware-fork-knife"
     },
     {
      "name": "Melamine Cup Set of 6",
      "unit": "packet",
      "price": 600,
      "icon": "silverware-fork-knife"
     },
     {
      "name": "Melamine Serving Tray",
      "unit": "piece",
      "price": 300,
      "icon": "tray"
     },
     {
      "name": "Melamine Soup Set",
      "unit": "box",
      "price": 1200,
      "icon": "bowl"
     },
     {
      "name": "Bone China Cup Set of 6",
      "unit": "packet",
      "price": 1800,
      "icon": "silverware-fork-knife"
     },
     {
      "name": "Ceramic Mug",
      "unit": "piece",
      "price": 250,
      "icon": "cup"
     },
     {
      "name": "Ceramic Bowl Set of 4",
      "unit": "packet",
      "price": 700,
      "icon": "silverware-fork-knife"
     },
     {
      "name": "Ceramic Serving Dish Set",
      "unit": "box",
      "price": 1500,
      "icon": "silverware-fork-knife"
     }
    ]
   },
   {
    "name": "Cooking Tools",
    "icon": "chef-hat",
    "items": [
     {
      "name": "Non-Stick Frying Pan",
      "unit": "piece",
      "price": 1100,
      "icon": "chef-hat"
     },
     {
      "name": "Non-Stick Cooking Pot",
      "unit": "piece",
      "price": 1400,
      "icon": "chef-hat"
     },
     {
      "name": "Pressure Cooker 5 Litre",
      "unit": "piece",
      "price": 3200,
      "icon": "chef-hat"
     },
     {
      "name": "Steel Tawa",
      "unit": "piece",
      "price": 650,
      "icon": "pipe"
     },
     {
      "name": "Wooden Spoon Set of 4",
      "unit": "packet",
      "price": 250,
      "icon": "silverware-spoon"
     },
     {
      "name": "Silicone Spatula Set of 3",
      "unit": "packet",
      "price": 400,
      "icon": "chef-hat"
     },
     {
      "name": "Kitchen Knife Set of 5",
      "unit": "box",
      "price": 800,
      "icon": "knife"
     },
     {
      "name": "Chopping Board",
      "unit": "piece",
      "price": 350,
      "icon": "chef-hat"
     },
     {
      "name": "Vegetable Grater",
      "unit": "piece",
      "price": 200,
      "icon": "chef-hat"
     },
     {
      "name": "Vegetable Peeler",
      "unit": "piece",
      "price": 120,
      "icon": "chef-hat"
     },
     {
      "name": "Rolling Pin with Board",
      "unit": "piece",
      "price": 450,
      "icon": "chef-hat"
     },
     {
      "name": "Masala Dabba (Spice Box)",
      "unit": "piece",
      "price": 700,
      "icon": "chef-hat",
      "nameUrdu": "مصالحہ ڈبہ"
     }
    ]
   },
   {
    "name": "Cleaning & Utility",
    "icon": "broom",
    "items": [
     {
      "name": "Floor Mop with Stick",
      "unit": "piece",
      "price": 450,
      "icon": "broom"
     },
     {
      "name": "Plastic Bucket 15 Litre",
      "unit": "piece",
      "price": 450,
      "icon": "bucket"
     },
     {
      "name": "Small Bucket 5 Litre",
      "unit": "piece",
      "price": 200,
      "icon": "bucket"
     },
     {
      "name": "Grass Broom",
      "unit": "piece",
      "price": 250,
      "icon": "broom"
     },
     {
      "name": "Dustpan with Brush",
      "unit": "piece",
      "price": 300,
      "icon": "brush"
     },
     {
      "name": "Scrub Pads Pack of 6",
      "unit": "packet",
      "price": 150,
      "icon": "broom"
     },
     {
      "name": "Dish Sponges Pack of 4",
      "unit": "packet",
      "price": 100,
      "icon": "broom"
     },
     {
      "name": "Toilet Brush",
      "unit": "piece",
      "price": 150,
      "icon": "brush"
     },
     {
      "name": "Glass Cleaner Spray 500ml",
      "unit": "piece",
      "price": 250,
      "icon": "broom"
     },
     {
      "name": "Washing Line Rope 20m",
      "unit": "piece",
      "price": 180,
      "icon": "broom"
     }
    ]
   },
   {
    "name": "Glass & Serving",
    "icon": "glass-mug",
    "items": [
     {
      "name": "Drinking Glass Set of 6",
      "unit": "packet",
      "price": 600,
      "icon": "glass-mug"
     },
     {
      "name": "Glass Water Jug",
      "unit": "piece",
      "price": 450,
      "icon": "glass-mug"
     },
     {
      "name": "Tea Cup Set of 6",
      "unit": "packet",
      "price": 700,
      "icon": "tea"
     },
     {
      "name": "Drinking Glasses Dozen",
      "unit": "dozen",
      "price": 800,
      "icon": "glass-mug"
     },
     {
      "name": "Glass Fruit Bowl",
      "unit": "piece",
      "price": 550,
      "icon": "glass-mug"
     },
     {
      "name": "Cake Stand",
      "unit": "piece",
      "price": 650,
      "icon": "cake"
     },
     {
      "name": "Glass Storage Jar Set of 3",
      "unit": "packet",
      "price": 750,
      "icon": "glass-mug"
     },
     {
      "name": "Serving Platter",
      "unit": "piece",
      "price": 500,
      "icon": "glass-mug"
     },
     {
      "name": "Ice Cube Tray",
      "unit": "piece",
      "price": 120,
      "icon": "tray"
     },
     {
      "name": "Glass Dessert Cups Set of 6",
      "unit": "packet",
      "price": 650,
      "icon": "battery-charging"
     }
    ]
   }
  ]
 },
 {
  "shopType": "Furniture & Home Decor",
  "icon": "sofa",
  "categories": [
   {
    "name": "Beds & Bedroom",
    "icon": "bed-double",
    "items": [
     {
      "name": "Single Bed",
      "unit": "piece",
      "price": 18000,
      "icon": "bed-double"
     },
     {
      "name": "Double Bed",
      "unit": "piece",
      "price": 28000,
      "icon": "bed-double"
     },
     {
      "name": "Charpai (Woven Rope Bed)",
      "unit": "piece",
      "price": 4500,
      "icon": "bed-double",
      "nameUrdu": "چارپائی"
     },
     {
      "name": "Single Mattress",
      "unit": "piece",
      "price": 9000,
      "icon": "bed-double"
     },
     {
      "name": "Double Mattress",
      "unit": "piece",
      "price": 16000,
      "icon": "bed-double"
     },
     {
      "name": "Bed Sheet Set of 3",
      "unit": "packet",
      "price": 1500,
      "icon": "bed-double"
     },
     {
      "name": "Pillow Pair",
      "unit": "packet",
      "price": 900,
      "icon": "pill"
     },
     {
      "name": "Almari 3-Door",
      "unit": "piece",
      "price": 35000,
      "icon": "wardrobe",
      "nameUrdu": "الماری"
     },
     {
      "name": "Dressing Table with Mirror",
      "unit": "piece",
      "price": 14000,
      "icon": "mirror"
     },
     {
      "name": "Bedside Table",
      "unit": "piece",
      "price": 3500,
      "icon": "bed-double"
     },
     {
      "name": "Double Blanket",
      "unit": "piece",
      "price": 2500,
      "icon": "bed-double"
     },
     {
      "name": "Quilt Set",
      "unit": "packet",
      "price": 3200,
      "icon": "bed-double"
     }
    ]
   },
   {
    "name": "Seating",
    "icon": "sofa",
    "items": [
     {
      "name": "Sofa Set 5-Seater",
      "unit": "piece",
      "price": 55000,
      "icon": "sofa"
     },
     {
      "name": "Sofa Set 7-Seater",
      "unit": "piece",
      "price": 75000,
      "icon": "sofa"
     },
     {
      "name": "Armchair",
      "unit": "piece",
      "price": 9000,
      "icon": "seat"
     },
     {
      "name": "Sheesham Wood Chair",
      "unit": "piece",
      "price": 4500,
      "icon": "seat"
     },
     {
      "name": "Office Chair",
      "unit": "piece",
      "price": 8500,
      "icon": "seat"
     },
     {
      "name": "Rocking Chair",
      "unit": "piece",
      "price": 7000,
      "icon": "seat"
     },
     {
      "name": "Wooden Bench",
      "unit": "piece",
      "price": 6000,
      "icon": "sofa"
     },
     {
      "name": "Bean Bag",
      "unit": "piece",
      "price": 2200,
      "icon": "sofa"
     },
     {
      "name": "Cushion Set of 5",
      "unit": "packet",
      "price": 1200,
      "icon": "sofa"
     },
     {
      "name": "Sofa Cover Set",
      "unit": "packet",
      "price": 2800,
      "icon": "sofa"
     }
    ]
   },
   {
    "name": "Tables",
    "icon": "table-furniture",
    "items": [
     {
      "name": "Dining Table 6-Seater",
      "unit": "piece",
      "price": 25000,
      "icon": "table-furniture"
     },
     {
      "name": "Coffee Table",
      "unit": "piece",
      "price": 8000,
      "icon": "coffee"
     },
     {
      "name": "Study Table",
      "unit": "piece",
      "price": 7000,
      "icon": "table-furniture"
     },
     {
      "name": "Center Table",
      "unit": "piece",
      "price": 6500,
      "icon": "table-furniture"
     },
     {
      "name": "Console Table",
      "unit": "piece",
      "price": 9000,
      "icon": "table-furniture"
     },
     {
      "name": "Folding Table",
      "unit": "piece",
      "price": 4500,
      "icon": "table-furniture"
     },
     {
      "name": "TV Stand",
      "unit": "piece",
      "price": 11000,
      "icon": "table-furniture"
     },
     {
      "name": "Computer Table",
      "unit": "piece",
      "price": 8500,
      "icon": "table-furniture"
     },
     {
      "name": "Ironing Board",
      "unit": "piece",
      "price": 2500,
      "icon": "iron"
     },
     {
      "name": "Nesting Tables Set of 3",
      "unit": "packet",
      "price": 5500,
      "icon": "bottle-soda"
     }
    ]
   },
   {
    "name": "Curtains & Flooring",
    "icon": "curtains",
    "items": [
     {
      "name": "Curtain Pair",
      "unit": "packet",
      "price": 1800,
      "icon": "curtains"
     },
     {
      "name": "Curtain Rod Set",
      "unit": "piece",
      "price": 900,
      "icon": "curtains"
     },
     {
      "name": "Window Blinds",
      "unit": "piece",
      "price": 2500,
      "icon": "curtains"
     },
     {
      "name": "Carpet 8x10 ft",
      "unit": "piece",
      "price": 12000,
      "icon": "rug"
     },
     {
      "name": "Prayer Mat",
      "unit": "piece",
      "price": 800,
      "icon": "curtains",
      "nameUrdu": "جائے نماز"
     },
     {
      "name": "Door Mat",
      "unit": "piece",
      "price": 350,
      "icon": "curtains"
     },
     {
      "name": "Floor Rug",
      "unit": "piece",
      "price": 3200,
      "icon": "rug"
     },
     {
      "name": "Table Runner",
      "unit": "piece",
      "price": 600,
      "icon": "curtains"
     }
    ]
   },
   {
    "name": "Decor & Lighting",
    "icon": "floor-lamp",
    "items": [
     {
      "name": "Wall Clock",
      "unit": "piece",
      "price": 1200,
      "icon": "lock"
     },
     {
      "name": "Table Lamp",
      "unit": "piece",
      "price": 1500,
      "icon": "floor-lamp"
     },
     {
      "name": "Floor Lamp",
      "unit": "piece",
      "price": 3500,
      "icon": "floor-lamp"
     },
     {
      "name": "Chandelier",
      "unit": "piece",
      "price": 4500,
      "icon": "floor-lamp"
     },
     {
      "name": "Wall Art Frame",
      "unit": "piece",
      "price": 900,
      "icon": "floor-lamp"
     },
     {
      "name": "Photo Frame Set of 3",
      "unit": "packet",
      "price": 600,
      "icon": "floor-lamp"
     },
     {
      "name": "Artificial Plant",
      "unit": "piece",
      "price": 800,
      "icon": "floor-lamp"
     },
     {
      "name": "Ceramic Vase",
      "unit": "piece",
      "price": 700,
      "icon": "floor-lamp"
     },
     {
      "name": "Wall Mirror",
      "unit": "piece",
      "price": 1800,
      "icon": "mirror"
     },
     {
      "name": "Candle Holder Set of 2",
      "unit": "packet",
      "price": 500,
      "icon": "candle"
     }
    ]
   }
  ]
 },
 {
  "shopType": "Toys & Baby Care",
  "icon": "teddy-bear",
  "categories": [
   {
    "name": "Dolls & Action Figures",
    "icon": "teddy-bear",
    "items": [
     {
      "name": "Fashion Doll",
      "unit": "piece",
      "price": 850,
      "icon": "teddy-bear"
     },
     {
      "name": "Doll Play Set",
      "unit": "box",
      "price": 1200,
      "icon": "teddy-bear"
     },
     {
      "name": "Action Figure",
      "unit": "piece",
      "price": 950,
      "icon": "teddy-bear"
     },
     {
      "name": "Remote Control Car",
      "unit": "piece",
      "price": 1800,
      "icon": "teddy-bear"
     },
     {
      "name": "Remote Control Helicopter",
      "unit": "piece",
      "price": 2500,
      "icon": "teddy-bear"
     },
     {
      "name": "Toy Dart Gun",
      "unit": "piece",
      "price": 700,
      "icon": "teddy-bear"
     },
     {
      "name": "Dancing Robot Toy",
      "unit": "piece",
      "price": 1400,
      "icon": "teddy-bear"
     },
     {
      "name": "Dinosaur Figures Set of 6",
      "unit": "packet",
      "price": 900,
      "icon": "teddy-bear"
     },
     {
      "name": "Superhero Figures Set of 4",
      "unit": "packet",
      "price": 1100,
      "icon": "teddy-bear"
     },
     {
      "name": "Toy Kitchen Set",
      "unit": "box",
      "price": 1600,
      "icon": "teddy-bear"
     },
     {
      "name": "Doctor Play Set",
      "unit": "box",
      "price": 950,
      "icon": "teddy-bear"
     },
     {
      "name": "Tool Play Set",
      "unit": "box",
      "price": 850,
      "icon": "teddy-bear"
     }
    ]
   },
   {
    "name": "Building & Learning",
    "icon": "toy-brick",
    "items": [
     {
      "name": "Building Blocks Set of 100",
      "unit": "box",
      "price": 1500,
      "icon": "lock"
     },
     {
      "name": "Brick Construction Box",
      "unit": "box",
      "price": 2200,
      "icon": "wall"
     },
     {
      "name": "Jigsaw Puzzle 500 Pieces",
      "unit": "box",
      "price": 600,
      "icon": "saw-blade"
     },
     {
      "name": "Alphabet Learning Set",
      "unit": "packet",
      "price": 450,
      "icon": "toy-brick"
     },
     {
      "name": "Number Counting Toy",
      "unit": "piece",
      "price": 500,
      "icon": "toy-brick"
     },
     {
      "name": "Shape Sorter Cube",
      "unit": "piece",
      "price": 650,
      "icon": "toy-brick"
     },
     {
      "name": "Magnetic Tiles Set",
      "unit": "box",
      "price": 1800,
      "icon": "view-grid"
     },
     {
      "name": "Stacking Rings Toy",
      "unit": "piece",
      "price": 400,
      "icon": "ring"
     },
     {
      "name": "Wooden Abacus",
      "unit": "piece",
      "price": 350,
      "icon": "toy-brick"
     },
     {
      "name": "Science Experiment Kit",
      "unit": "box",
      "price": 1300,
      "icon": "toy-brick"
     }
    ]
   },
   {
    "name": "Ride-On & Outdoor",
    "icon": "bicycle",
    "items": [
     {
      "name": "Kids Tricycle",
      "unit": "piece",
      "price": 4500,
      "icon": "bicycle"
     },
     {
      "name": "Kids Bicycle 16 inch",
      "unit": "piece",
      "price": 12000,
      "icon": "bicycle"
     },
     {
      "name": "Kick Scooter",
      "unit": "piece",
      "price": 3500,
      "icon": "bicycle"
     },
     {
      "name": "Skateboard",
      "unit": "piece",
      "price": 2200,
      "icon": "bicycle"
     },
     {
      "name": "Football Size 5",
      "unit": "piece",
      "price": 900,
      "icon": "soccer"
     },
     {
      "name": "Cricket Bat",
      "unit": "piece",
      "price": 1200,
      "icon": "cricket"
     },
     {
      "name": "Tennis Balls Set of 3",
      "unit": "packet",
      "price": 300,
      "icon": "tennis"
     },
     {
      "name": "Badminton Racket Set",
      "unit": "packet",
      "price": 1500,
      "icon": "leaf"
     }
    ]
   },
   {
    "name": "Baby Essentials",
    "icon": "baby-bottle",
    "items": [
     {
      "name": "Baby Diapers Pack of 24",
      "unit": "packet",
      "price": 750,
      "icon": "diaper-outline"
     },
     {
      "name": "Baby Wipes Pack of 72",
      "unit": "packet",
      "price": 420,
      "icon": "baby-bottle"
     },
     {
      "name": "Baby Milk Powder Tin 400g",
      "unit": "piece",
      "price": 1800,
      "icon": "cow"
     },
     {
      "name": "Baby Feeding Bottle 250ml",
      "unit": "piece",
      "price": 450,
      "icon": "baby-bottle"
     },
     {
      "name": "Baby Lotion 200ml",
      "unit": "piece",
      "price": 350,
      "icon": "lotion"
     },
     {
      "name": "Baby Shampoo 200ml",
      "unit": "piece",
      "price": 380,
      "icon": "bottle-tonic"
     },
     {
      "name": "Baby Soap Bar",
      "unit": "piece",
      "price": 180,
      "icon": "baby-bottle"
     },
     {
      "name": "Baby Hooded Towel",
      "unit": "piece",
      "price": 550,
      "icon": "baby-bottle"
     },
     {
      "name": "Baby Blanket",
      "unit": "piece",
      "price": 900,
      "icon": "baby-bottle"
     },
     {
      "name": "Baby Carrier",
      "unit": "piece",
      "price": 2200,
      "icon": "baby-bottle"
     },
     {
      "name": "Teether Set of 3",
      "unit": "packet",
      "price": 350,
      "icon": "baby-bottle"
     },
     {
      "name": "Baby Rattle Set of 4",
      "unit": "packet",
      "price": 400,
      "icon": "baby-bottle"
     }
    ]
   },
   {
    "name": "Soft Toys & Games",
    "icon": "gamepad-variant",
    "items": [
     {
      "name": "Large Teddy Bear",
      "unit": "piece",
      "price": 1500,
      "icon": "teddy-bear"
     },
     {
      "name": "Small Teddy Bear",
      "unit": "piece",
      "price": 600,
      "icon": "teddy-bear"
     },
     {
      "name": "Plush Bunny",
      "unit": "piece",
      "price": 700,
      "icon": "gamepad-variant"
     },
     {
      "name": "Ludo Board Game",
      "unit": "piece",
      "price": 450,
      "icon": "gamepad-variant"
     },
     {
      "name": "Chess Set",
      "unit": "box",
      "price": 800,
      "icon": "gamepad-variant"
     },
     {
      "name": "Carrom Board",
      "unit": "piece",
      "price": 1800,
      "icon": "gamepad-variant"
     },
     {
      "name": "Playing Cards Deck",
      "unit": "piece",
      "price": 150,
      "icon": "gamepad-variant"
     },
     {
      "name": "Water Gun",
      "unit": "piece",
      "price": 500,
      "icon": "gamepad-variant"
     }
    ]
   }
  ]
 },
 {
  "shopType": "Pet, Poultry Feed & Veterinary",
  "icon": "paw",
  "categories": [
   {
    "name": "Poultry Feed",
    "icon": "bird",
    "items": [
     {
      "name": "Broiler Starter Feed 50kg",
      "unit": "piece",
      "price": 6500,
      "icon": "bird"
     },
     {
      "name": "Layer Feed 50kg",
      "unit": "piece",
      "price": 6200,
      "icon": "bird"
     },
     {
      "name": "Chick Starter Crumb 25kg",
      "unit": "piece",
      "price": 3400,
      "icon": "bird"
     },
     {
      "name": "Maize Feed 50kg",
      "unit": "piece",
      "price": 5800,
      "icon": "bird"
     },
     {
      "name": "Wheat Bran 20kg",
      "unit": "piece",
      "price": 1400,
      "icon": "bird"
     },
     {
      "name": "Rice Polish 20kg",
      "unit": "piece",
      "price": 1200,
      "icon": "rice"
     },
     {
      "name": "Fish Meal 5kg",
      "unit": "piece",
      "price": 2200,
      "icon": "fish"
     },
     {
      "name": "Bone Meal 5kg",
      "unit": "piece",
      "price": 1800,
      "icon": "bird"
     },
     {
      "name": "Mineral Mixture 1kg",
      "unit": "piece",
      "price": 450,
      "icon": "bird"
     },
     {
      "name": "Vitamin Premix Packet",
      "unit": "packet",
      "price": 600,
      "icon": "bird"
     },
     {
      "name": "Mustard Cake 20kg",
      "unit": "piece",
      "price": 2400,
      "icon": "cake"
     },
     {
      "name": "Sunflower Meal 10kg",
      "unit": "piece",
      "price": 900,
      "icon": "bird"
     }
    ]
   },
   {
    "name": "Pet Food",
    "icon": "dog",
    "items": [
     {
      "name": "Dog Dry Food 5kg Bag",
      "unit": "piece",
      "price": 3500,
      "icon": "dog"
     },
     {
      "name": "Dog Food 1kg Pack",
      "unit": "packet",
      "price": 750,
      "icon": "dog"
     },
     {
      "name": "Cat Dry Food 2kg",
      "unit": "packet",
      "price": 2200,
      "icon": "dog"
     },
     {
      "name": "Cat Wet Food Cans Pack of 12",
      "unit": "box",
      "price": 1800,
      "icon": "dog"
     },
     {
      "name": "Bird Seed Mix 1kg",
      "unit": "packet",
      "price": 350,
      "icon": "seed"
     },
     {
      "name": "Parrot Food Mix 1kg",
      "unit": "packet",
      "price": 450,
      "icon": "dog"
     },
     {
      "name": "Fish Flakes Jar",
      "unit": "piece",
      "price": 400,
      "icon": "fish"
     },
     {
      "name": "Fish Pellets Pack",
      "unit": "packet",
      "price": 350,
      "icon": "fish"
     },
     {
      "name": "Rabbit Pellets 1kg",
      "unit": "packet",
      "price": 500,
      "icon": "dog"
     },
     {
      "name": "Hamster Food Pack",
      "unit": "packet",
      "price": 450,
      "icon": "dog"
     }
    ]
   },
   {
    "name": "Bird & Small Animal Supplies",
    "icon": "rabbit",
    "items": [
     {
      "name": "Bird Cage Medium",
      "unit": "piece",
      "price": 2500,
      "icon": "rabbit"
     },
     {
      "name": "Bird Water Feeder",
      "unit": "piece",
      "price": 300,
      "icon": "baby-bottle"
     },
     {
      "name": "Pet Food Bowl",
      "unit": "piece",
      "price": 250,
      "icon": "rabbit"
     },
     {
      "name": "Wooden Bird Perch",
      "unit": "piece",
      "price": 150,
      "icon": "rabbit"
     },
     {
      "name": "Bird Nest Box",
      "unit": "piece",
      "price": 450,
      "icon": "rabbit"
     },
     {
      "name": "Bird Toys Set",
      "unit": "packet",
      "price": 350,
      "icon": "rabbit"
     },
     {
      "name": "Aquarium 2ft",
      "unit": "piece",
      "price": 4500,
      "icon": "rabbit"
     },
     {
      "name": "Aquarium Filter",
      "unit": "piece",
      "price": 1200,
      "icon": "car-wrench"
     }
    ]
   },
   {
    "name": "Veterinary Basics",
    "icon": "medical-bag",
    "items": [
     {
      "name": "Deworming Tablets Box of 10",
      "unit": "box",
      "price": 600,
      "icon": "pill"
     },
     {
      "name": "Flea Powder Bottle 100g",
      "unit": "piece",
      "price": 350,
      "icon": "medical-bag"
     },
     {
      "name": "Antiseptic Spray for Animals 100ml",
      "unit": "piece",
      "price": 280,
      "icon": "medical-bag"
     },
     {
      "name": "Livestock Wound Ointment",
      "unit": "piece",
      "price": 220,
      "icon": "medical-bag"
     },
     {
      "name": "Cattle Calcium Supplement 1kg",
      "unit": "packet",
      "price": 500,
      "icon": "medical-bag"
     },
     {
      "name": "Poultry Electrolyte Powder",
      "unit": "packet",
      "price": 300,
      "icon": "medical-bag"
     },
     {
      "name": "Poultry Drinker 5 Litre",
      "unit": "piece",
      "price": 650,
      "icon": "medical-bag"
     },
     {
      "name": "Poultry Feeder Tray",
      "unit": "piece",
      "price": 550,
      "icon": "baby-bottle"
     },
     {
      "name": "Heat Lamp Bulb 250W",
      "unit": "piece",
      "price": 400,
      "icon": "lightbulb"
     },
     {
      "name": "Pet Shampoo Bottle 250ml",
      "unit": "piece",
      "price": 550,
      "icon": "bottle-tonic"
     }
    ]
   }
  ]
 },
 {
  "shopType": "Stationery, Books & Printing",
  "icon": "pencil",
  "categories": [
   {
    "name": "Writing",
    "icon": "pencil",
    "items": [
     {
      "name": "Ball Pen",
      "unit": "piece",
      "price": 30,
      "icon": "pen"
     },
     {
      "name": "Gel Pen",
      "unit": "piece",
      "price": 60,
      "icon": "pen"
     },
     {
      "name": "Fountain Pen",
      "unit": "piece",
      "price": 250,
      "icon": "pen"
     },
     {
      "name": "Lead Pencil",
      "unit": "piece",
      "price": 20,
      "icon": "pen"
     },
     {
      "name": "Pencil Box",
      "unit": "piece",
      "price": 180,
      "icon": "pencil"
     },
     {
      "name": "Eraser",
      "unit": "piece",
      "price": 20,
      "icon": "eraser"
     },
     {
      "name": "Sharpener",
      "unit": "piece",
      "price": 30,
      "icon": "pencil"
     },
     {
      "name": "Highlighter Set of 4",
      "unit": "packet",
      "price": 220,
      "icon": "marker"
     },
     {
      "name": "Marker Set of 6",
      "unit": "packet",
      "price": 300,
      "icon": "marker"
     },
     {
      "name": "Permanent Marker",
      "unit": "piece",
      "price": 80,
      "icon": "marker"
     },
     {
      "name": "Whiteboard Marker",
      "unit": "piece",
      "price": 90,
      "icon": "marker"
     },
     {
      "name": "Pen Refills Pack of 10",
      "unit": "packet",
      "price": 120,
      "icon": "pencil"
     }
    ]
   },
   {
    "name": "Paper & Notebooks",
    "icon": "notebook",
    "items": [
     {
      "name": "A4 Paper Ream 500 Sheets",
      "unit": "piece",
      "price": 950,
      "icon": "notebook"
     },
     {
      "name": "Single Line Notebook",
      "unit": "piece",
      "price": 150,
      "icon": "notebook"
     },
     {
      "name": "Math Notebook",
      "unit": "piece",
      "price": 140,
      "icon": "notebook"
     },
     {
      "name": "Drawing Book",
      "unit": "piece",
      "price": 120,
      "icon": "book"
     },
     {
      "name": "Graph Notebook",
      "unit": "piece",
      "price": 160,
      "icon": "notebook"
     },
     {
      "name": "Hardcover Diary",
      "unit": "piece",
      "price": 600,
      "icon": "notebook"
     },
     {
      "name": "Register 200 Pages",
      "unit": "piece",
      "price": 350,
      "icon": "notebook"
     },
     {
      "name": "Register 400 Pages",
      "unit": "piece",
      "price": 650,
      "icon": "notebook"
     },
     {
      "name": "Sticky Notes Pack",
      "unit": "packet",
      "price": 180,
      "icon": "notebook"
     },
     {
      "name": "Envelopes Pack of 10",
      "unit": "packet",
      "price": 150,
      "icon": "notebook"
     },
     {
      "name": "Chart Paper",
      "unit": "piece",
      "price": 40,
      "icon": "notebook"
     },
     {
      "name": "Brown Paper Roll",
      "unit": "piece",
      "price": 300,
      "icon": "notebook"
     },
     {
      "name": "Tracing Paper Pack",
      "unit": "packet",
      "price": 200,
      "icon": "notebook"
     },
     {
      "name": "File Folder",
      "unit": "piece",
      "price": 60,
      "icon": "folder"
     }
    ]
   },
   {
    "name": "Art & Craft",
    "icon": "palette",
    "items": [
     {
      "name": "Color Pencils Box of 12",
      "unit": "box",
      "price": 350,
      "icon": "pen"
     },
     {
      "name": "Wax Crayons Box of 12",
      "unit": "box",
      "price": 250,
      "icon": "palette"
     },
     {
      "name": "Watercolor Paint Set",
      "unit": "box",
      "price": 400,
      "icon": "format-paint"
     },
     {
      "name": "Poster Colors Set of 12",
      "unit": "box",
      "price": 550,
      "icon": "palette"
     },
     {
      "name": "Paint Brushes Set of 6",
      "unit": "packet",
      "price": 300,
      "icon": "format-paint"
     },
     {
      "name": "Glue Stick",
      "unit": "piece",
      "price": 80,
      "icon": "palette"
     },
     {
      "name": "Glue Bottle 100ml",
      "unit": "piece",
      "price": 150,
      "icon": "palette"
     },
     {
      "name": "Craft Scissors",
      "unit": "piece",
      "price": 180,
      "icon": "scissors-cutting"
     },
     {
      "name": "Craft Paper Pack",
      "unit": "packet",
      "price": 250,
      "icon": "palette"
     },
     {
      "name": "Tape Roll",
      "unit": "piece",
      "price": 90,
      "icon": "palette"
     }
    ]
   },
   {
    "name": "Office & Desk",
    "icon": "briefcase",
    "items": [
     {
      "name": "Stapler",
      "unit": "piece",
      "price": 350,
      "icon": "briefcase"
     },
     {
      "name": "Staple Pins Box",
      "unit": "box",
      "price": 120,
      "icon": "briefcase"
     },
     {
      "name": "Paper Clips Box",
      "unit": "box",
      "price": 100,
      "icon": "briefcase"
     },
     {
      "name": "Paper Punch",
      "unit": "piece",
      "price": 450,
      "icon": "briefcase"
     },
     {
      "name": "Calculator 12-Digit",
      "unit": "piece",
      "price": 950,
      "icon": "calculator"
     },
     {
      "name": "Desk Organizer",
      "unit": "piece",
      "price": 600,
      "icon": "briefcase"
     },
     {
      "name": "Stamp Pad",
      "unit": "piece",
      "price": 200,
      "icon": "briefcase"
     },
     {
      "name": "Custom Rubber Stamp",
      "unit": "piece",
      "price": 800,
      "icon": "briefcase"
     },
     {
      "name": "Paper Cutter",
      "unit": "piece",
      "price": 250,
      "icon": "briefcase"
     },
     {
      "name": "Correction Tape",
      "unit": "piece",
      "price": 120,
      "icon": "briefcase"
     }
    ]
   },
   {
    "name": "School Supplies",
    "icon": "pencil-ruler",
    "items": [
     {
      "name": "Geometry Box",
      "unit": "box",
      "price": 450,
      "icon": "pencil-ruler"
     },
     {
      "name": "School Bag",
      "unit": "piece",
      "price": 1800,
      "icon": "pencil-ruler"
     },
     {
      "name": "Lunch Box",
      "unit": "piece",
      "price": 550,
      "icon": "pencil-ruler"
     },
     {
      "name": "School Water Bottle",
      "unit": "piece",
      "price": 450,
      "icon": "pencil-ruler"
     },
     {
      "name": "Compass Divider",
      "unit": "piece",
      "price": 120,
      "icon": "pencil-ruler"
     },
     {
      "name": "Protractor Set",
      "unit": "packet",
      "price": 150,
      "icon": "tractor"
     },
     {
      "name": "Ruler 12 inch",
      "unit": "piece",
      "price": 60,
      "icon": "ruler"
     },
     {
      "name": "Scale Set of 3",
      "unit": "packet",
      "price": 100,
      "icon": "pencil-ruler"
     },
     {
      "name": "Exam Board",
      "unit": "piece",
      "price": 350,
      "icon": "pencil-ruler"
     },
     {
      "name": "Uniform Belt",
      "unit": "piece",
      "price": 250,
      "icon": "pencil-ruler"
     },
     {
      "name": "School Tie",
      "unit": "piece",
      "price": 200,
      "icon": "pencil-ruler"
     },
     {
      "name": "School Socks Pair",
      "unit": "packet",
      "price": 150,
      "icon": "shoe-print"
     }
    ]
   },
   {
    "name": "Books & Printing",
    "icon": "printer",
    "items": [
     {
      "name": "Quran with Urdu Translation",
      "unit": "piece",
      "price": 900,
      "icon": "printer",
      "nameUrdu": "قرآن مجید"
     },
     {
      "name": "English-Urdu Dictionary",
      "unit": "piece",
      "price": 650,
      "icon": "printer"
     },
     {
      "name": "English Grammar Book",
      "unit": "piece",
      "price": 450,
      "icon": "book"
     },
     {
      "name": "Kids Story Book",
      "unit": "piece",
      "price": 300,
      "icon": "book"
     },
     {
      "name": "Coloring Book",
      "unit": "piece",
      "price": 250,
      "icon": "book"
     },
     {
      "name": "Paperback Novel",
      "unit": "piece",
      "price": 700,
      "icon": "printer"
     },
     {
      "name": "Poetry Book (Diwan)",
      "unit": "piece",
      "price": 500,
      "icon": "book",
      "nameUrdu": "دیوان"
     },
     {
      "name": "Exam Past Papers Book",
      "unit": "piece",
      "price": 550,
      "icon": "book"
     },
     {
      "name": "Photocopy (per page)",
      "unit": "piece",
      "price": 5,
      "icon": "printer"
     },
     {
      "name": "Printout (per page)",
      "unit": "piece",
      "price": 10,
      "icon": "printer"
     },
     {
      "name": "Spiral Binding",
      "unit": "piece",
      "price": 150,
      "icon": "printer"
     },
     {
      "name": "Lamination (per sheet)",
      "unit": "piece",
      "price": 60,
      "icon": "printer"
     }
    ]
   }
  ]
 },
 {
  "shopType": "Mobile & Electronics",
  "icon": "cellphone",
  "categories": [
   {
    "name": "Phone Accessories",
    "icon": "cellphone",
    "items": [
     {
      "name": "Tempered Glass Protector 11D",
      "unit": "piece",
      "price": 150,
      "icon": "cellphone"
     },
     {
      "name": "Transparent Silicone Back Cover",
      "unit": "piece",
      "price": 350,
      "icon": "cellphone"
     },
     {
      "name": "Printed Designer Back Cover",
      "unit": "piece",
      "price": 550,
      "icon": "cellphone"
     },
     {
      "name": "Leather Flip Pouch Cover",
      "unit": "piece",
      "price": 850,
      "icon": "cellphone"
     },
     {
      "name": "Metal Ring Holder Stand",
      "unit": "piece",
      "price": 250,
      "icon": "ring"
     },
     {
      "name": "Pop Socket Grip",
      "unit": "piece",
      "price": 200,
      "icon": "power-socket"
     },
     {
      "name": "Neck Strap Lanyard",
      "unit": "piece",
      "price": 180,
      "icon": "cellphone"
     },
     {
      "name": "Bluetooth Selfie Stick",
      "unit": "piece",
      "price": 950,
      "icon": "camera"
     },
     {
      "name": "Flexible Mobile Tripod",
      "unit": "piece",
      "price": 750,
      "icon": "camera"
     },
     {
      "name": "Car Dashboard Mobile Holder",
      "unit": "piece",
      "price": 650,
      "icon": "cellphone"
     },
     {
      "name": "Bike Handle Mobile Holder",
      "unit": "piece",
      "price": 550,
      "icon": "cellphone"
     },
     {
      "name": "Foldable Desktop Mobile Stand",
      "unit": "piece",
      "price": 450,
      "icon": "cellphone"
     },
     {
      "name": "PUBG Finger Sleeves Pair",
      "unit": "piece",
      "price": 250,
      "icon": "cellphone"
     },
     {
      "name": "Mobile Game Trigger Pair",
      "unit": "piece",
      "price": 650,
      "icon": "cellphone"
     },
     {
      "name": "Phone Cooling Fan Attachment",
      "unit": "piece",
      "price": 1450,
      "icon": "barley"
     },
     {
      "name": "USB OTG Adapter Type-C",
      "unit": "piece",
      "price": 250,
      "icon": "sprout"
     },
     {
      "name": "SIM Ejector Pin 5-pack",
      "unit": "packet",
      "price": 100,
      "icon": "cellphone"
     },
     {
      "name": "Mobile Camera Lens Kit 3-in-1",
      "unit": "piece",
      "price": 1250,
      "icon": "cellphone"
     },
     {
      "name": "Charging Port Dust Plugs 10-pack",
      "unit": "packet",
      "price": 150,
      "icon": "cellphone"
     },
     {
      "name": "Earphone Carry Case",
      "unit": "piece",
      "price": 300,
      "icon": "headphones"
     },
     {
      "name": "Smart Watch Silicone Strap",
      "unit": "piece",
      "price": 650,
      "icon": "watch"
     },
     {
      "name": "OTG Card Reader",
      "unit": "piece",
      "price": 550,
      "icon": "cellphone"
     },
     {
      "name": "Phone Camera Protector Ring",
      "unit": "piece",
      "price": 200,
      "icon": "ring"
     },
     {
      "name": "Magnetic Car Mount Vent Clip",
      "unit": "piece",
      "price": 750,
      "icon": "cellphone"
     }
    ]
   },
   {
    "name": "Chargers & Power",
    "icon": "power-plug",
    "items": [
     {
      "name": "Fast Charger 25W",
      "unit": "piece",
      "price": 1450,
      "icon": "power-plug"
     },
     {
      "name": "Super Fast Charger 45W",
      "unit": "piece",
      "price": 2450,
      "icon": "power-plug"
     },
     {
      "name": "GaN Charger 65W",
      "unit": "piece",
      "price": 3950,
      "icon": "power-plug"
     },
     {
      "name": "Type-C Fast Cable 1m",
      "unit": "piece",
      "price": 450,
      "icon": "cable-data"
     },
     {
      "name": "Type-C Cable 2m Braided",
      "unit": "piece",
      "price": 750,
      "icon": "cable-data"
     },
     {
      "name": "iPhone Lightning Cable 1m",
      "unit": "piece",
      "price": 650,
      "icon": "cable-data"
     },
     {
      "name": "Micro USB Cable 1m",
      "unit": "piece",
      "price": 250,
      "icon": "cable-data"
     },
     {
      "name": "3-in-1 Multi Charging Cable",
      "unit": "piece",
      "price": 550,
      "icon": "cable-data"
     },
     {
      "name": "Power Bank 10000mAh",
      "unit": "piece",
      "price": 3450,
      "icon": "battery-charging"
     },
     {
      "name": "Power Bank 20000mAh",
      "unit": "piece",
      "price": 5450,
      "icon": "battery-charging"
     },
     {
      "name": "Wireless Charging Pad 15W",
      "unit": "piece",
      "price": 1950,
      "icon": "cable-data"
     },
     {
      "name": "MagSafe Magnetic Charger",
      "unit": "piece",
      "price": 2450,
      "icon": "power-plug"
     },
     {
      "name": "Dual USB Car Charger",
      "unit": "piece",
      "price": 750,
      "icon": "power-plug"
     },
     {
      "name": "Universal Travel Adapter",
      "unit": "piece",
      "price": 950,
      "icon": "sprout"
     },
     {
      "name": "Surge Protector Power Strip 6 Socket",
      "unit": "piece",
      "price": 1650,
      "icon": "power-socket"
     },
     {
      "name": "Type-C to 3.5mm Audio Adapter",
      "unit": "piece",
      "price": 350,
      "icon": "sprout"
     },
     {
      "name": "Retractable 3-in-1 Cable",
      "unit": "piece",
      "price": 850,
      "icon": "cable-data"
     },
     {
      "name": "20W PD Fast Charger",
      "unit": "piece",
      "price": 1250,
      "icon": "power-plug"
     }
    ]
   },
   {
    "name": "Earbuds & Audio",
    "icon": "headphones",
    "items": [
     {
      "name": "TWS Wireless Earbuds",
      "unit": "piece",
      "price": 2450,
      "icon": "headphones"
     },
     {
      "name": "ANC Pro Wireless Earbuds",
      "unit": "piece",
      "price": 4950,
      "icon": "headphones"
     },
     {
      "name": "Bluetooth Neckband",
      "unit": "piece",
      "price": 1950,
      "icon": "headphones"
     },
     {
      "name": "Type-C Wired Handsfree",
      "unit": "piece",
      "price": 650,
      "icon": "headphones"
     },
     {
      "name": "3.5mm Wired Handsfree",
      "unit": "piece",
      "price": 350,
      "icon": "headphones"
     },
     {
      "name": "Mini Bluetooth Speaker",
      "unit": "piece",
      "price": 1450,
      "icon": "speaker"
     },
     {
      "name": "Party Bluetooth Speaker",
      "unit": "piece",
      "price": 8950,
      "icon": "speaker"
     },
     {
      "name": "Bluetooth Karaoke Microphone",
      "unit": "piece",
      "price": 2950,
      "icon": "headphones"
     },
     {
      "name": "Over-Ear Headphones",
      "unit": "piece",
      "price": 3450,
      "icon": "headphones"
     },
     {
      "name": "Portable FM Radio",
      "unit": "piece",
      "price": 1250,
      "icon": "headphones"
     },
     {
      "name": "AUX Cable 1m",
      "unit": "piece",
      "price": 250,
      "icon": "cable-data"
     },
     {
      "name": "Earbud Silicone Tips 6-pack",
      "unit": "packet",
      "price": 200,
      "icon": "headphones"
     },
     {
      "name": "Bone Conduction Headphones",
      "unit": "piece",
      "price": 4950,
      "icon": "headphones"
     },
     {
      "name": "USB-C DAC Audio Dongle",
      "unit": "piece",
      "price": 950,
      "icon": "headphones"
     }
    ]
   },
   {
    "name": "TVs & Home Entertainment",
    "icon": "television",
    "items": [
     {
      "name": "LED TV 32 inch",
      "unit": "piece",
      "price": 42000,
      "icon": "television"
     },
     {
      "name": "LED TV 43 inch 4K",
      "unit": "piece",
      "price": 72000,
      "icon": "television"
     },
     {
      "name": "LED TV 55 inch 4K",
      "unit": "piece",
      "price": 115000,
      "icon": "television"
     },
     {
      "name": "TV Wall Mount Bracket 32-55",
      "unit": "piece",
      "price": 1450,
      "icon": "tennis"
     },
     {
      "name": "Universal TV Remote",
      "unit": "piece",
      "price": 450,
      "icon": "television"
     },
     {
      "name": "Android TV Box 4K",
      "unit": "piece",
      "price": 6500,
      "icon": "television"
     },
     {
      "name": "Dish Antenna 6ft",
      "unit": "piece",
      "price": 2800,
      "icon": "television"
     },
     {
      "name": "LNB Single",
      "unit": "piece",
      "price": 650,
      "icon": "television"
     },
     {
      "name": "HDMI Cable 1.5m",
      "unit": "piece",
      "price": 450,
      "icon": "cable-data"
     },
     {
      "name": "HDMI Cable 5m",
      "unit": "piece",
      "price": 950,
      "icon": "cable-data"
     },
     {
      "name": "TV Trolley Stand",
      "unit": "piece",
      "price": 5500,
      "icon": "television"
     },
     {
      "name": "Satellite Finder Meter",
      "unit": "piece",
      "price": 1800,
      "icon": "television"
     }
    ]
   },
   {
    "name": "Fans & Cooling",
    "icon": "fan",
    "items": [
     {
      "name": "Ceiling Fan 56 inch AC",
      "unit": "piece",
      "price": 9500,
      "icon": "ceiling-fan",
      "nameUrdu": "پنکھا"
     },
     {
      "name": "Inverter Ceiling Fan 56 inch",
      "unit": "piece",
      "price": 13500,
      "icon": "ceiling-fan"
     },
     {
      "name": "Ceiling Fan Remote Control Kit",
      "unit": "piece",
      "price": 1250,
      "icon": "ceiling-fan"
     },
     {
      "name": "Pedestal Fan 18 inch",
      "unit": "piece",
      "price": 7500,
      "icon": "fan"
     },
     {
      "name": "Table Fan 12 inch",
      "unit": "piece",
      "price": 3800,
      "icon": "fan"
     },
     {
      "name": "Rechargeable Table Fan 12 inch",
      "unit": "piece",
      "price": 5200,
      "icon": "fan"
     },
     {
      "name": "Exhaust Fan 10 inch",
      "unit": "piece",
      "price": 2800,
      "icon": "fan"
     },
     {
      "name": "Bracket Fan 18 inch",
      "unit": "piece",
      "price": 6800,
      "icon": "fan"
     },
     {
      "name": "Fan Regulator Switch",
      "unit": "piece",
      "price": 450,
      "icon": "fan"
     },
     {
      "name": "Fan Capacitor 2.5uF",
      "unit": "piece",
      "price": 180,
      "icon": "fan"
     },
     {
      "name": "Solar DC Fan 12 inch",
      "unit": "piece",
      "price": 6500,
      "icon": "fan"
     },
     {
      "name": "Wall Fan 16 inch",
      "unit": "piece",
      "price": 5800,
      "icon": "fan"
     }
    ]
   },
   {
    "name": "Batteries & Small Appliances",
    "icon": "battery",
    "items": [
     {
      "name": "AA Battery 4-pack",
      "unit": "packet",
      "price": 350,
      "icon": "battery"
     },
     {
      "name": "AAA Battery 4-pack",
      "unit": "packet",
      "price": 350,
      "icon": "battery"
     },
     {
      "name": "9V Battery",
      "unit": "piece",
      "price": 280,
      "icon": "battery"
     },
     {
      "name": "CR2032 Button Cell 5-pack",
      "unit": "packet",
      "price": 250,
      "icon": "battery"
     },
     {
      "name": "AA Rechargeable Battery 4-pack",
      "unit": "packet",
      "price": 1450,
      "icon": "battery"
     },
     {
      "name": "Rechargeable LED Torch",
      "unit": "piece",
      "price": 950,
      "icon": "battery"
     },
     {
      "name": "LED Emergency Light",
      "unit": "piece",
      "price": 1450,
      "icon": "battery"
     },
     {
      "name": "Electric Mosquito Racket",
      "unit": "piece",
      "price": 650,
      "icon": "tennis"
     },
     {
      "name": "Electric Kettle 1.8L",
      "unit": "piece",
      "price": 2450,
      "icon": "kettle"
     },
     {
      "name": "Dry Iron",
      "unit": "piece",
      "price": 1950,
      "icon": "iron"
     }
    ]
   }
  ]
 },
 {
  "shopType": "Electrical Shop",
  "icon": "lightbulb",
  "categories": [
   {
    "name": "Wires & Cables",
    "icon": "cable-data",
    "items": [
     {
      "name": "Copper Wire 3/29 90m Roll",
      "unit": "piece",
      "price": 9500,
      "icon": "cable-data",
      "nameUrdu": "تار"
     },
     {
      "name": "Copper Wire 7/29 90m Roll",
      "unit": "piece",
      "price": 14500,
      "icon": "cable-data"
     },
     {
      "name": "Copper Wire 7/36 90m Roll",
      "unit": "piece",
      "price": 18500,
      "icon": "cable-data"
     },
     {
      "name": "Flexible Wire 2 Core 90m Roll",
      "unit": "piece",
      "price": 6800,
      "icon": "cable-data"
     },
     {
      "name": "Flexible Wire 3 Core 90m Roll",
      "unit": "piece",
      "price": 9200,
      "icon": "cable-data"
     },
     {
      "name": "PVC Wire 1.5mm 90m",
      "unit": "piece",
      "price": 7200,
      "icon": "cable-data"
     },
     {
      "name": "Earth Wire Green 90m Roll",
      "unit": "piece",
      "price": 5400,
      "icon": "cable-data"
     },
     {
      "name": "Telephone Wire 2 Pair 100m",
      "unit": "piece",
      "price": 3800,
      "icon": "cable-data"
     },
     {
      "name": "LAN Cable Cat6 100m Roll",
      "unit": "piece",
      "price": 12500,
      "icon": "cable-data"
     },
     {
      "name": "Coaxial Cable RG6 100m Roll",
      "unit": "piece",
      "price": 8900,
      "icon": "cable-data"
     },
     {
      "name": "Service Drop Wire 2 Core 25m Bundle",
      "unit": "piece",
      "price": 2400,
      "icon": "cable-data"
     },
     {
      "name": "Cable Tie 100-pack",
      "unit": "packet",
      "price": 250,
      "icon": "cable-data"
     }
    ]
   },
   {
    "name": "Switches & Boards",
    "icon": "toggle-switch",
    "items": [
     {
      "name": "Switch Plate 1 Gang",
      "unit": "piece",
      "price": 280,
      "icon": "toggle-switch"
     },
     {
      "name": "Switch Plate 2 Gang",
      "unit": "piece",
      "price": 420,
      "icon": "toggle-switch"
     },
     {
      "name": "Switch Plate 4 Gang",
      "unit": "piece",
      "price": 680,
      "icon": "toggle-switch"
     },
     {
      "name": "Switch Plate 6 Gang",
      "unit": "piece",
      "price": 950,
      "icon": "toggle-switch"
     },
     {
      "name": "Switch Plate 8 Gang",
      "unit": "piece",
      "price": 1250,
      "icon": "toggle-switch"
     },
     {
      "name": "Switch Plate 12 Gang",
      "unit": "piece",
      "price": 1850,
      "icon": "toggle-switch"
     },
     {
      "name": "Fan Dimmer Regulator",
      "unit": "piece",
      "price": 550,
      "icon": "fan"
     },
     {
      "name": "13A Power Socket 3-Pin",
      "unit": "piece",
      "price": 380,
      "icon": "power-socket"
     },
     {
      "name": "5A Power Socket 2-Pin",
      "unit": "piece",
      "price": 220,
      "icon": "power-socket"
     },
     {
      "name": "Universal Multi Socket 5-in-1",
      "unit": "piece",
      "price": 750,
      "icon": "power-socket"
     },
     {
      "name": "Door Bell Push Button",
      "unit": "piece",
      "price": 320,
      "icon": "toggle-switch"
     },
     {
      "name": "Concealed Switch Box 7x4",
      "unit": "piece",
      "price": 180,
      "icon": "toggle-switch"
     }
    ]
   },
   {
    "name": "Breakers & Panels",
    "icon": "flash",
    "items": [
     {
      "name": "MCB 6A Single Pole",
      "unit": "piece",
      "price": 650,
      "icon": "flash"
     },
     {
      "name": "MCB 16A Single Pole",
      "unit": "piece",
      "price": 680,
      "icon": "flash"
     },
     {
      "name": "MCB 32A Single Pole",
      "unit": "piece",
      "price": 720,
      "icon": "flash"
     },
     {
      "name": "MCB 63A Double Pole",
      "unit": "piece",
      "price": 1450,
      "icon": "flash"
     },
     {
      "name": "Changeover Switch 32A",
      "unit": "piece",
      "price": 1850,
      "icon": "toggle-switch"
     },
     {
      "name": "Changeover Switch 63A",
      "unit": "piece",
      "price": 2950,
      "icon": "toggle-switch"
     },
     {
      "name": "Distribution Board 4 Way",
      "unit": "piece",
      "price": 1650,
      "icon": "flash"
     },
     {
      "name": "Distribution Board 8 Way",
      "unit": "piece",
      "price": 2450,
      "icon": "flash"
     },
     {
      "name": "Distribution Board 12 Way",
      "unit": "piece",
      "price": 3450,
      "icon": "flash"
     },
     {
      "name": "Digital Panel Voltmeter",
      "unit": "piece",
      "price": 950,
      "icon": "flash"
     }
    ]
   },
   {
    "name": "Bulbs & Lights",
    "icon": "lightbulb",
    "items": [
     {
      "name": "LED Bulb 5W",
      "unit": "piece",
      "price": 180,
      "icon": "lightbulb"
     },
     {
      "name": "LED Bulb 7W",
      "unit": "piece",
      "price": 220,
      "icon": "lightbulb"
     },
     {
      "name": "LED Bulb 9W",
      "unit": "piece",
      "price": 260,
      "icon": "lightbulb"
     },
     {
      "name": "LED Bulb 12W",
      "unit": "piece",
      "price": 320,
      "icon": "lightbulb"
     },
     {
      "name": "LED Bulb 18W",
      "unit": "piece",
      "price": 450,
      "icon": "lightbulb"
     },
     {
      "name": "LED Bulb 25W",
      "unit": "piece",
      "price": 650,
      "icon": "lightbulb"
     },
     {
      "name": "LED Bulb 40W",
      "unit": "piece",
      "price": 950,
      "icon": "lightbulb"
     },
     {
      "name": "LED Panel Light 12W Round",
      "unit": "piece",
      "price": 750,
      "icon": "lightbulb"
     },
     {
      "name": "LED Flood Light 50W",
      "unit": "piece",
      "price": 2450,
      "icon": "lightbulb"
     },
     {
      "name": "LED Tube Light 4ft",
      "unit": "piece",
      "price": 850,
      "icon": "lightbulb"
     },
     {
      "name": "Sensor Night Lamp",
      "unit": "piece",
      "price": 550,
      "icon": "floor-lamp"
     },
     {
      "name": "Chandelier Bulb Candle Type",
      "unit": "piece",
      "price": 380,
      "icon": "lightbulb"
     }
    ]
   },
   {
    "name": "Fans & Motors",
    "icon": "ceiling-fan",
    "items": [
     {
      "name": "Ceiling Fan 56 inch",
      "unit": "piece",
      "price": 9800,
      "icon": "ceiling-fan",
      "nameUrdu": "پنکھا"
     },
     {
      "name": "Inverter Fan 56 inch",
      "unit": "piece",
      "price": 13800,
      "icon": "fan"
     },
     {
      "name": "Exhaust Fan 8 inch Plastic",
      "unit": "piece",
      "price": 2200,
      "icon": "fan"
     },
     {
      "name": "Exhaust Fan 12 inch Metal",
      "unit": "piece",
      "price": 4200,
      "icon": "fan"
     },
     {
      "name": "Bracket Fan 18 inch",
      "unit": "piece",
      "price": 6900,
      "icon": "fan"
     },
     {
      "name": "Water Pump 1 HP",
      "unit": "piece",
      "price": 12500,
      "icon": "ceiling-fan"
     },
     {
      "name": "Ceiling Fan Remote Kit",
      "unit": "piece",
      "price": 1350,
      "icon": "ceiling-fan"
     },
     {
      "name": "Motor Capacitor 4uF",
      "unit": "piece",
      "price": 220,
      "icon": "fan"
     }
    ]
   },
   {
    "name": "UPS, Inverter & Solar",
    "icon": "solar-panel",
    "items": [
     {
      "name": "UPS 1000VA",
      "unit": "piece",
      "price": 28000,
      "icon": "battery-charging"
     },
     {
      "name": "UPS 1500VA",
      "unit": "piece",
      "price": 38000,
      "icon": "battery-charging"
     },
     {
      "name": "Solar Inverter 1.2KVA",
      "unit": "piece",
      "price": 42000,
      "icon": "battery-charging"
     },
     {
      "name": "Solar Inverter 3KVA",
      "unit": "piece",
      "price": 95000,
      "icon": "battery-charging"
     },
     {
      "name": "Solar Panel 180W",
      "unit": "piece",
      "price": 16500,
      "icon": "solar-panel"
     },
     {
      "name": "Solar Panel 550W",
      "unit": "piece",
      "price": 42000,
      "icon": "solar-panel"
     },
     {
      "name": "PWM Solar Charge Controller 30A",
      "unit": "piece",
      "price": 4500,
      "icon": "solar-panel"
     },
     {
      "name": "MPPT Solar Charge Controller 60A",
      "unit": "piece",
      "price": 28000,
      "icon": "solar-panel"
     },
     {
      "name": "Dry Battery 100Ah",
      "unit": "piece",
      "price": 32000,
      "icon": "battery"
     },
     {
      "name": "Dry Battery 200Ah",
      "unit": "piece",
      "price": 58000,
      "icon": "battery"
     },
     {
      "name": "Tall Tubular Battery 230Ah",
      "unit": "piece",
      "price": 72000,
      "icon": "battery"
     },
     {
      "name": "UPS Battery Trolley",
      "unit": "piece",
      "price": 2800,
      "icon": "battery"
     },
     {
      "name": "Battery Terminal Clamp Pair",
      "unit": "piece",
      "price": 450,
      "icon": "battery"
     },
     {
      "name": "Solar Panel Mounting Stand",
      "unit": "piece",
      "price": 6500,
      "icon": "solar-panel"
     },
     {
      "name": "DC Ceiling Fan 12V",
      "unit": "piece",
      "price": 8500,
      "icon": "ceiling-fan"
     },
     {
      "name": "Solar Flood Light 100W",
      "unit": "piece",
      "price": 12500,
      "icon": "lightbulb"
     }
    ]
   }
  ]
 },
 {
  "shopType": "Hardware & Paint",
  "icon": "hammer",
  "categories": [
   {
    "name": "Hand Tools",
    "icon": "hammer",
    "items": [
     {
      "name": "Claw Hammer",
      "unit": "piece",
      "price": 650,
      "icon": "hammer",
      "nameUrdu": "ہتھوڑا"
     },
     {
      "name": "Ball Pein Hammer 500g",
      "unit": "piece",
      "price": 750,
      "icon": "hammer"
     },
     {
      "name": "Screwdriver Set 6pc",
      "unit": "piece",
      "price": 950,
      "icon": "screwdriver"
     },
     {
      "name": "Flat Screwdriver 6 inch",
      "unit": "piece",
      "price": 220,
      "icon": "screwdriver"
     },
     {
      "name": "Star Screwdriver Set 5pc",
      "unit": "piece",
      "price": 850,
      "icon": "screwdriver"
     },
     {
      "name": "Adjustable Wrench 10 inch",
      "unit": "piece",
      "price": 950,
      "icon": "wrench"
     },
     {
      "name": "Adjustable Wrench 12 inch",
      "unit": "piece",
      "price": 1250,
      "icon": "wrench"
     },
     {
      "name": "Combination Plier 8 inch",
      "unit": "piece",
      "price": 750,
      "icon": "hammer"
     },
     {
      "name": "Long Nose Plier 8 inch",
      "unit": "piece",
      "price": 680,
      "icon": "hammer"
     },
     {
      "name": "Wire Cutter 6 inch",
      "unit": "piece",
      "price": 550,
      "icon": "cable-data"
     },
     {
      "name": "Cutting Plier 8 inch",
      "unit": "piece",
      "price": 720,
      "icon": "hammer"
     },
     {
      "name": "Measuring Tape 5m",
      "unit": "piece",
      "price": 450,
      "icon": "tape-measure"
     },
     {
      "name": "Spirit Level 12 inch",
      "unit": "piece",
      "price": 650,
      "icon": "hammer"
     },
     {
      "name": "Hacksaw Frame",
      "unit": "piece",
      "price": 550,
      "icon": "saw-blade"
     },
     {
      "name": "Hacksaw Blade 12 inch 10-pack",
      "unit": "packet",
      "price": 350,
      "icon": "saw-blade"
     },
     {
      "name": "Allen Key Set 9pc",
      "unit": "piece",
      "price": 750,
      "icon": "hammer"
     },
     {
      "name": "Spanner Set 14pc",
      "unit": "piece",
      "price": 2450,
      "icon": "wrench"
     },
     {
      "name": "Pipe Wrench 14 inch",
      "unit": "piece",
      "price": 1450,
      "icon": "wrench"
     },
     {
      "name": "Wire Stripper Tool",
      "unit": "piece",
      "price": 450,
      "icon": "cable-data"
     }
    ]
   },
   {
    "name": "Power Tools",
    "icon": "circular-saw",
    "items": [
     {
      "name": "Drill Machine 13mm",
      "unit": "piece",
      "price": 6500,
      "icon": "circular-saw"
     },
     {
      "name": "Angle Grinder 4 inch",
      "unit": "piece",
      "price": 5200,
      "icon": "circular-saw"
     },
     {
      "name": "Jigsaw Machine",
      "unit": "piece",
      "price": 7800,
      "icon": "saw-blade"
     },
     {
      "name": "Heat Gun",
      "unit": "piece",
      "price": 3450,
      "icon": "circular-saw"
     },
     {
      "name": "Electric Blower",
      "unit": "piece",
      "price": 3850,
      "icon": "circular-saw"
     },
     {
      "name": "Rotary Tool Kit",
      "unit": "piece",
      "price": 4950,
      "icon": "circular-saw"
     },
     {
      "name": "HSS Drill Bit Set 13pc",
      "unit": "piece",
      "price": 1450,
      "icon": "circular-saw"
     },
     {
      "name": "Grinder Cutting Disc 4 inch 5-pack",
      "unit": "packet",
      "price": 550,
      "icon": "circular-saw"
     },
     {
      "name": "Soldering Iron 60W",
      "unit": "piece",
      "price": 750,
      "icon": "iron"
     },
     {
      "name": "Caulking Gun",
      "unit": "piece",
      "price": 850,
      "icon": "circular-saw"
     }
    ]
   },
   {
    "name": "Locks & Door Fittings",
    "icon": "lock",
    "items": [
     {
      "name": "Door Handle Lock Set",
      "unit": "piece",
      "price": 2450,
      "icon": "lock"
     },
     {
      "name": "Deadbolt Lock",
      "unit": "piece",
      "price": 1450,
      "icon": "lock"
     },
     {
      "name": "Padlock 40mm",
      "unit": "piece",
      "price": 550,
      "icon": "lock"
     },
     {
      "name": "Padlock 50mm",
      "unit": "piece",
      "price": 750,
      "icon": "lock"
     },
     {
      "name": "Padlock 63mm",
      "unit": "piece",
      "price": 1050,
      "icon": "lock"
     },
     {
      "name": "Drawer Lock",
      "unit": "piece",
      "price": 350,
      "icon": "lock"
     },
     {
      "name": "Sliding Door Lock",
      "unit": "piece",
      "price": 850,
      "icon": "lock"
     },
     {
      "name": "Cabinet Hinges Pair",
      "unit": "piece",
      "price": 280,
      "icon": "lock"
     },
     {
      "name": "Door Hinges 4 inch Pair",
      "unit": "piece",
      "price": 450,
      "icon": "lock"
     },
     {
      "name": "Tower Bolt 6 inch",
      "unit": "piece",
      "price": 320,
      "icon": "lock"
     },
     {
      "name": "Tower Bolt 10 inch",
      "unit": "piece",
      "price": 480,
      "icon": "lock"
     },
     {
      "name": "Door Chain Guard",
      "unit": "piece",
      "price": 380,
      "icon": "lock"
     },
     {
      "name": "Door Eye Viewer",
      "unit": "piece",
      "price": 450,
      "icon": "lock"
     },
     {
      "name": "Magnetic Door Catcher Pair",
      "unit": "piece",
      "price": 250,
      "icon": "lock"
     },
     {
      "name": "Cabinet Handle 128mm",
      "unit": "piece",
      "price": 220,
      "icon": "lock"
     },
     {
      "name": "Door Stopper Rubber",
      "unit": "piece",
      "price": 150,
      "icon": "lock"
     }
    ]
   },
   {
    "name": "Paints",
    "icon": "format-paint",
    "items": [
     {
      "name": "Plastic Emulsion 4L",
      "unit": "litre",
      "price": 2200,
      "icon": "format-paint",
      "nameUrdu": "رنگ"
     },
     {
      "name": "Plastic Emulsion 15L Bucket",
      "unit": "piece",
      "price": 7800,
      "icon": "format-paint"
     },
     {
      "name": "Enamel Paint 1L",
      "unit": "litre",
      "price": 950,
      "icon": "format-paint"
     },
     {
      "name": "Enamel Paint 4L",
      "unit": "litre",
      "price": 3400,
      "icon": "format-paint"
     },
     {
      "name": "Weather Shield 4L",
      "unit": "litre",
      "price": 4200,
      "icon": "format-paint"
     },
     {
      "name": "Distemper 20kg Bag",
      "unit": "piece",
      "price": 2800,
      "icon": "format-paint"
     },
     {
      "name": "Wall Putty 20kg Bag",
      "unit": "piece",
      "price": 1650,
      "icon": "format-paint"
     },
     {
      "name": "Wall Primer 1L",
      "unit": "litre",
      "price": 650,
      "icon": "format-paint"
     },
     {
      "name": "Wall Primer 4L",
      "unit": "litre",
      "price": 2300,
      "icon": "format-paint"
     },
     {
      "name": "Wood Varnish 1L",
      "unit": "litre",
      "price": 1250,
      "icon": "format-paint"
     },
     {
      "name": "Paint Thinner 1L",
      "unit": "litre",
      "price": 550,
      "icon": "format-paint"
     },
     {
      "name": "Turpentine Oil 1L",
      "unit": "litre",
      "price": 750,
      "icon": "oil"
     },
     {
      "name": "Paint Roller 9 inch",
      "unit": "piece",
      "price": 350,
      "icon": "format-paint"
     },
     {
      "name": "Paint Brush 2 inch",
      "unit": "piece",
      "price": 180,
      "icon": "format-paint"
     },
     {
      "name": "Paint Brush 4 inch",
      "unit": "piece",
      "price": 320,
      "icon": "format-paint"
     },
     {
      "name": "Spray Paint Can 400ml",
      "unit": "piece",
      "price": 650,
      "icon": "format-paint"
     },
     {
      "name": "Paint Tray 9 inch",
      "unit": "piece",
      "price": 280,
      "icon": "format-paint"
     },
     {
      "name": "Putty Knife 3 inch",
      "unit": "piece",
      "price": 250,
      "icon": "knife"
     }
    ]
   },
   {
    "name": "Fasteners & Consumables",
    "icon": "screw-round-top",
    "items": [
     {
      "name": "Wood Screws 1 inch 100pc",
      "unit": "packet",
      "price": 350,
      "icon": "screw-round-top"
     },
     {
      "name": "Wood Screws 2 inch 100pc",
      "unit": "packet",
      "price": 450,
      "icon": "screw-round-top"
     },
     {
      "name": "Gypsum Screws 1 inch 100pc",
      "unit": "packet",
      "price": 400,
      "icon": "screw-round-top"
     },
     {
      "name": "Nails 2 inch 1kg",
      "unit": "kg",
      "price": 320,
      "icon": "nail"
     },
     {
      "name": "Nails 3 inch 1kg",
      "unit": "kg",
      "price": 320,
      "icon": "nail"
     },
     {
      "name": "Wall Plugs 100pc",
      "unit": "packet",
      "price": 300,
      "icon": "screw-round-top"
     },
     {
      "name": "Expansion Bolts M8 10pc",
      "unit": "packet",
      "price": 650,
      "icon": "screw-round-top"
     },
     {
      "name": "Cable Clips 100pc",
      "unit": "packet",
      "price": 250,
      "icon": "cable-data"
     },
     {
      "name": "Super Glue 20g",
      "unit": "gram",
      "price": 150,
      "icon": "screw-round-top"
     },
     {
      "name": "M-Seal Epoxy 100g",
      "unit": "gram",
      "price": 280,
      "icon": "screw-round-top"
     },
     {
      "name": "Sandpaper 100 Grit 10-sheet",
      "unit": "packet",
      "price": 250,
      "icon": "shovel"
     },
     {
      "name": "Steel Wire Brush",
      "unit": "piece",
      "price": 220,
      "icon": "cable-data"
     },
     {
      "name": "G Clamp 4 inch",
      "unit": "piece",
      "price": 550,
      "icon": "floor-lamp"
     }
    ]
   },
   {
    "name": "Sanitary & Plumbing",
    "icon": "pipe-wrench",
    "items": [
     {
      "name": "PVC Pipe 1 inch 10ft",
      "unit": "piece",
      "price": 850,
      "icon": "pipe"
     },
     {
      "name": "PVC Pipe 3/4 inch 10ft",
      "unit": "piece",
      "price": 650,
      "icon": "pipe"
     },
     {
      "name": "PVC Elbow 1 inch",
      "unit": "piece",
      "price": 80,
      "icon": "pipe-wrench"
     },
     {
      "name": "PVC Tee 1 inch",
      "unit": "piece",
      "price": 95,
      "icon": "pipe-wrench"
     },
     {
      "name": "PVC Solvent Cement 100g",
      "unit": "gram",
      "price": 220,
      "icon": "package-variant"
     },
     {
      "name": "Brass Bib Tap",
      "unit": "piece",
      "price": 1250,
      "icon": "pipe-wrench"
     },
     {
      "name": "Angle Cock Valve",
      "unit": "piece",
      "price": 850,
      "icon": "pipe-wrench"
     },
     {
      "name": "Muslim Shower Set",
      "unit": "piece",
      "price": 1450,
      "icon": "shower-head"
     },
     {
      "name": "Basin Waste Coupling",
      "unit": "piece",
      "price": 550,
      "icon": "pipe-wrench"
     },
     {
      "name": "PPR Pipe 1 inch 12ft",
      "unit": "piece",
      "price": 1450,
      "icon": "pipe"
     },
     {
      "name": "PPR Elbow 1 inch",
      "unit": "piece",
      "price": 120,
      "icon": "pipe-wrench"
     },
     {
      "name": "Shower Head ABS",
      "unit": "piece",
      "price": 950,
      "icon": "shower-head"
     }
    ]
   },
   {
    "name": "Ladders & Access",
    "icon": "ladder",
    "items": [
     {
      "name": "Step Ladder 4ft",
      "unit": "piece",
      "price": 4200,
      "icon": "ladder"
     },
     {
      "name": "Aluminum Ladder 8ft",
      "unit": "piece",
      "price": 8500,
      "icon": "ladder"
     }
    ]
   }
  ]
 },
 {
  "shopType": "Building Material",
  "icon": "wall",
  "categories": [
   {
    "name": "Cement",
    "icon": "package-variant",
    "items": [
     {
      "name": "Lucky Cement Bag 50kg",
      "unit": "piece",
      "price": 1380,
      "icon": "package-variant",
      "nameUrdu": "سیمنٹ"
     },
     {
      "name": "DG Cement Bag 50kg",
      "unit": "piece",
      "price": 1370,
      "icon": "package-variant"
     },
     {
      "name": "Maple Leaf Cement Bag 50kg",
      "unit": "piece",
      "price": 1360,
      "icon": "package-variant"
     },
     {
      "name": "Bestway Cement Bag 50kg",
      "unit": "piece",
      "price": 1350,
      "icon": "package-variant"
     },
     {
      "name": "Fauji Cement Bag 50kg",
      "unit": "piece",
      "price": 1360,
      "icon": "package-variant"
     },
     {
      "name": "Pioneer Cement Bag 50kg",
      "unit": "piece",
      "price": 1340,
      "icon": "package-variant"
     },
     {
      "name": "White Cement Bag 40kg",
      "unit": "piece",
      "price": 2200,
      "icon": "package-variant"
     },
     {
      "name": "Sulphate Resistant Cement 50kg",
      "unit": "piece",
      "price": 1450,
      "icon": "package-variant"
     }
    ]
   },
   {
    "name": "Bricks & Blocks",
    "icon": "wall",
    "items": [
     {
      "name": "First Class Bricks (Awwal)",
      "unit": "piece",
      "price": 26,
      "icon": "wall",
      "nameUrdu": "اینٹ"
     },
     {
      "name": "Second Class Bricks",
      "unit": "piece",
      "price": 18,
      "icon": "wall"
     },
     {
      "name": "Over-burnt Bricks",
      "unit": "piece",
      "price": 12,
      "icon": "wall"
     },
     {
      "name": "Concrete Block 4 inch",
      "unit": "piece",
      "price": 65,
      "icon": "lock"
     },
     {
      "name": "Concrete Block 6 inch",
      "unit": "piece",
      "price": 85,
      "icon": "lock"
     },
     {
      "name": "Concrete Block 8 inch",
      "unit": "piece",
      "price": 110,
      "icon": "lock"
     },
     {
      "name": "Fly Ash Bricks",
      "unit": "piece",
      "price": 20,
      "icon": "wall"
     },
     {
      "name": "Roof Khaprail Tiles 100pc",
      "unit": "packet",
      "price": 9000,
      "icon": "view-grid"
     }
    ]
   },
   {
    "name": "Steel / Sarya",
    "icon": "pipe",
    "items": [
     {
      "name": "Steel Bar 6mm (Sarya)",
      "unit": "kg",
      "price": 248,
      "icon": "pipe",
      "nameUrdu": "سریا"
     },
     {
      "name": "Steel Bar 8mm (Sarya)",
      "unit": "kg",
      "price": 250,
      "icon": "pipe"
     },
     {
      "name": "Steel Bar 10mm (Sarya)",
      "unit": "kg",
      "price": 255,
      "icon": "pipe"
     },
     {
      "name": "Steel Bar 12mm (Sarya)",
      "unit": "kg",
      "price": 260,
      "icon": "pipe"
     },
     {
      "name": "Steel Bar 16mm (Sarya)",
      "unit": "kg",
      "price": 262,
      "icon": "pipe"
     },
     {
      "name": "Steel Bar 20mm (Sarya)",
      "unit": "kg",
      "price": 265,
      "icon": "pipe"
     },
     {
      "name": "Binding Wire 1kg Coil",
      "unit": "kg",
      "price": 320,
      "icon": "cable-data"
     },
     {
      "name": "MS Angle 1.5 inch 20ft",
      "unit": "piece",
      "price": 2400,
      "icon": "pipe"
     }
    ]
   },
   {
    "name": "Sand & Crush",
    "icon": "shovel",
    "items": [
     {
      "name": "Ravi Sand 100cft Load",
      "unit": "piece",
      "price": 24000,
      "icon": "shovel",
      "nameUrdu": "ریت"
     },
     {
      "name": "Chenab Sand 100cft Load",
      "unit": "piece",
      "price": 26000,
      "icon": "shovel"
     },
     {
      "name": "Margalla Crush 100cft Load",
      "unit": "piece",
      "price": 32000,
      "icon": "shovel"
     },
     {
      "name": "Sargodha Crush 100cft Load",
      "unit": "piece",
      "price": 28000,
      "icon": "shovel"
     },
     {
      "name": "Bajri 100cft Load",
      "unit": "piece",
      "price": 22000,
      "icon": "shovel"
     },
     {
      "name": "Stone Dust 100cft Load",
      "unit": "piece",
      "price": 14000,
      "icon": "shovel"
     }
    ]
   },
   {
    "name": "Tiles, Marble & Finishing",
    "icon": "view-grid",
    "items": [
     {
      "name": "Ceramic Floor Tile 24x24",
      "unit": "piece",
      "price": 180,
      "icon": "view-grid"
     },
     {
      "name": "Ceramic Wall Tile 12x18",
      "unit": "piece",
      "price": 90,
      "icon": "view-grid"
     },
     {
      "name": "Porcelain Tile 24x48",
      "unit": "piece",
      "price": 950,
      "icon": "view-grid"
     },
     {
      "name": "Skirting Tile 4x24",
      "unit": "piece",
      "price": 140,
      "icon": "view-grid"
     },
     {
      "name": "Mosaic Tile Sheet",
      "unit": "piece",
      "price": 350,
      "icon": "view-grid"
     },
     {
      "name": "White Marble per sq ft",
      "unit": "piece",
      "price": 180,
      "icon": "view-grid"
     },
     {
      "name": "Black Granite per sq ft",
      "unit": "piece",
      "price": 450,
      "icon": "view-grid"
     },
     {
      "name": "Marble Chips per sq ft",
      "unit": "piece",
      "price": 120,
      "icon": "popcorn"
     },
     {
      "name": "Tile Bond Adhesive 20kg",
      "unit": "piece",
      "price": 900,
      "icon": "view-grid"
     },
     {
      "name": "Tile Grout 1kg",
      "unit": "packet",
      "price": 120,
      "icon": "view-grid"
     },
     {
      "name": "POP Bag 40kg",
      "unit": "piece",
      "price": 950,
      "icon": "view-grid"
     },
     {
      "name": "Gypsum Board 4x8",
      "unit": "piece",
      "price": 1450,
      "icon": "view-grid"
     },
     {
      "name": "False Ceiling Tile 2x2",
      "unit": "piece",
      "price": 220,
      "icon": "view-grid"
     },
     {
      "name": "Flush Door 3x7",
      "unit": "piece",
      "price": 6500,
      "icon": "view-grid"
     },
     {
      "name": "Steel Door Frame",
      "unit": "piece",
      "price": 4500,
      "icon": "pipe"
     },
     {
      "name": "Water Tank 500L",
      "unit": "piece",
      "price": 9500,
      "icon": "view-grid"
     },
     {
      "name": "Water Tank 1000L",
      "unit": "piece",
      "price": 15000,
      "icon": "view-grid"
     },
     {
      "name": "Wire Mesh Roll 4x50ft",
      "unit": "piece",
      "price": 6500,
      "icon": "cable-data"
     },
     {
      "name": "Gypsum Powder 20kg",
      "unit": "piece",
      "price": 650,
      "icon": "view-grid"
     },
     {
      "name": "Block Adhesive 20kg",
      "unit": "piece",
      "price": 1100,
      "icon": "lock"
     }
    ]
   }
  ]
 },
 {
  "shopType": "Clothing & Garments",
  "icon": "tshirt-crew",
  "categories": [
   {
    "name": "Men's Shalwar Kameez Fabric",
    "icon": "tape-measure",
    "items": [
     {
      "name": "Wash n Wear Suit 4m",
      "unit": "piece",
      "price": 1800,
      "icon": "tape-measure",
      "nameUrdu": "شلوار قمیض"
     },
     {
      "name": "Pure Cotton Suit 4m",
      "unit": "piece",
      "price": 2200,
      "icon": "tshirt-crew"
     },
     {
      "name": "Boski Suit 4m",
      "unit": "piece",
      "price": 4500,
      "icon": "tape-measure"
     },
     {
      "name": "Latha Suit 4m",
      "unit": "piece",
      "price": 1500,
      "icon": "tape-measure"
     },
     {
      "name": "Khaddar Suit 4m Winter",
      "unit": "piece",
      "price": 1800,
      "icon": "snowflake"
     },
     {
      "name": "Gul Ahmed Wash n Wear 4m",
      "unit": "piece",
      "price": 2800,
      "icon": "tape-measure"
     },
     {
      "name": "J. Wash n Wear 4m",
      "unit": "piece",
      "price": 3200,
      "icon": "tape-measure"
     },
     {
      "name": "Al Karam Wash n Wear 4m",
      "unit": "piece",
      "price": 2600,
      "icon": "tape-measure"
     },
     {
      "name": "Off-White Latha Suit 4m",
      "unit": "piece",
      "price": 1600,
      "icon": "tape-measure"
     },
     {
      "name": "Navy Blue Wash n Wear 4m",
      "unit": "piece",
      "price": 1900,
      "icon": "tape-measure"
     },
     {
      "name": "Grey Cotton Suit 4m",
      "unit": "piece",
      "price": 2300,
      "icon": "tshirt-crew"
     },
     {
      "name": "Kurta Cloth 2.5m",
      "unit": "piece",
      "price": 1200,
      "icon": "tshirt-crew"
     },
     {
      "name": "White Shalwar 2.5m",
      "unit": "piece",
      "price": 900,
      "icon": "tshirt-crew"
     },
     {
      "name": "Black Shalwar 2.5m",
      "unit": "piece",
      "price": 900,
      "icon": "tshirt-crew"
     }
    ]
   },
   {
    "name": "Ready-Made Men's Wear",
    "icon": "tshirt-crew",
    "items": [
     {
      "name": "Ready Shalwar Kameez",
      "unit": "piece",
      "price": 2800,
      "icon": "tshirt-crew"
     },
     {
      "name": "White Kurta",
      "unit": "piece",
      "price": 1800,
      "icon": "tshirt-crew"
     },
     {
      "name": "Men's Waistcoat",
      "unit": "piece",
      "price": 2500,
      "icon": "tshirt-crew"
     },
     {
      "name": "Denim Jeans Pant",
      "unit": "piece",
      "price": 2200,
      "icon": "tshirt-crew"
     },
     {
      "name": "Formal Shirt",
      "unit": "piece",
      "price": 1500,
      "icon": "shoe-formal"
     },
     {
      "name": "Polo Shirt",
      "unit": "piece",
      "price": 1200,
      "icon": "tshirt-crew"
     },
     {
      "name": "Men's Hoodie",
      "unit": "piece",
      "price": 2200,
      "icon": "snowflake"
     },
     {
      "name": "Sweatshirt",
      "unit": "piece",
      "price": 1800,
      "icon": "tshirt-crew"
     },
     {
      "name": "Denim Jacket",
      "unit": "piece",
      "price": 3500,
      "icon": "snowflake"
     },
     {
      "name": "Tracksuit 2pc",
      "unit": "piece",
      "price": 2800,
      "icon": "tshirt-crew"
     },
     {
      "name": "Wool Shawl Gents",
      "unit": "piece",
      "price": 1500,
      "icon": "snowflake"
     },
     {
      "name": "Kurti Ladies",
      "unit": "piece",
      "price": 1600,
      "icon": "tshirt-crew"
     },
     {
      "name": "Gents Night Suit",
      "unit": "piece",
      "price": 1600,
      "icon": "tshirt-crew"
     }
    ]
   },
   {
    "name": "Ladies Suits & Fabric",
    "icon": "tshirt-v",
    "items": [
     {
      "name": "Lawn 3pc Unstitched",
      "unit": "piece",
      "price": 2800,
      "icon": "tshirt-crew",
      "nameUrdu": "لان"
     },
     {
      "name": "Lawn 2pc Unstitched",
      "unit": "piece",
      "price": 1800,
      "icon": "tshirt-crew"
     },
     {
      "name": "Cambric 3pc Unstitched",
      "unit": "piece",
      "price": 3200,
      "icon": "tshirt-v"
     },
     {
      "name": "Chiffon 3pc Unstitched",
      "unit": "piece",
      "price": 4500,
      "icon": "tshirt-v"
     },
     {
      "name": "Khaddar 3pc Winter",
      "unit": "piece",
      "price": 3200,
      "icon": "snowflake"
     },
     {
      "name": "Linen 3pc Unstitched",
      "unit": "piece",
      "price": 3500,
      "icon": "tshirt-v"
     },
     {
      "name": "Gul Ahmed Lawn 3pc",
      "unit": "piece",
      "price": 4200,
      "icon": "tshirt-crew"
     },
     {
      "name": "Sana Safinaz Lawn 3pc",
      "unit": "piece",
      "price": 4500,
      "icon": "tshirt-crew"
     },
     {
      "name": "Maria B 3pc",
      "unit": "piece",
      "price": 5200,
      "icon": "tshirt-v"
     },
     {
      "name": "Al Karam 3pc",
      "unit": "piece",
      "price": 3800,
      "icon": "tshirt-v"
     },
     {
      "name": "Embroidered Net 3pc",
      "unit": "piece",
      "price": 5500,
      "icon": "tshirt-v"
     },
     {
      "name": "Lawn Dupatta",
      "unit": "piece",
      "price": 600,
      "icon": "barley"
     },
     {
      "name": "Chiffon Dupatta",
      "unit": "piece",
      "price": 900,
      "icon": "barley"
     },
     {
      "name": "Plain Trouser Ladies",
      "unit": "piece",
      "price": 800,
      "icon": "tshirt-v"
     },
     {
      "name": "Black Abaya",
      "unit": "piece",
      "price": 4500,
      "icon": "tshirt-v",
      "nameUrdu": "عبایا"
     },
     {
      "name": "Hijab Scarf",
      "unit": "piece",
      "price": 500,
      "icon": "tshirt-v",
      "nameUrdu": "حجاب"
     },
     {
      "name": "Niqab",
      "unit": "piece",
      "price": 350,
      "icon": "tshirt-v"
     }
    ]
   },
   {
    "name": "Undergarments & Hosiery",
    "icon": "underwear-outline",
    "items": [
     {
      "name": "Gents Banyan Vest",
      "unit": "piece",
      "price": 350,
      "icon": "underwear-outline",
      "nameUrdu": "بنیان"
     },
     {
      "name": "Gents Brief 3-pack",
      "unit": "packet",
      "price": 600,
      "icon": "underwear-outline"
     },
     {
      "name": "Ladies Bra",
      "unit": "piece",
      "price": 450,
      "icon": "underwear-outline"
     },
     {
      "name": "Ladies Panty 3-pack",
      "unit": "packet",
      "price": 500,
      "icon": "underwear-outline"
     },
     {
      "name": "Cotton Socks Pair",
      "unit": "piece",
      "price": 120,
      "icon": "shoe-print",
      "nameUrdu": "موزے"
     },
     {
      "name": "Ankle Socks 3-pack",
      "unit": "packet",
      "price": 350,
      "icon": "shoe-print"
     },
     {
      "name": "Winter Thermal Upper",
      "unit": "piece",
      "price": 650,
      "icon": "snowflake"
     },
     {
      "name": "Winter Thermal Lower",
      "unit": "piece",
      "price": 650,
      "icon": "snowflake"
     },
     {
      "name": "Cotton Handkerchief",
      "unit": "piece",
      "price": 120,
      "icon": "underwear-outline",
      "nameUrdu": "رومال"
     },
     {
      "name": "Prayer Cap (Topi)",
      "unit": "piece",
      "price": 250,
      "icon": "underwear-outline",
      "nameUrdu": "ٹوپی"
     }
    ]
   },
   {
    "name": "Kids Wear",
    "icon": "baby",
    "items": [
     {
      "name": "Baby Suit 0-6 Months",
      "unit": "piece",
      "price": 600,
      "icon": "baby"
     },
     {
      "name": "Baby Romper",
      "unit": "piece",
      "price": 500,
      "icon": "baby"
     },
     {
      "name": "Kids Shalwar Kameez",
      "unit": "piece",
      "price": 900,
      "icon": "tshirt-crew"
     },
     {
      "name": "Kids Frock",
      "unit": "piece",
      "price": 1100,
      "icon": "baby"
     },
     {
      "name": "Kids Jeans",
      "unit": "piece",
      "price": 1200,
      "icon": "baby"
     },
     {
      "name": "Kids T-Shirt",
      "unit": "piece",
      "price": 500,
      "icon": "baby"
     },
     {
      "name": "Kids Hoodie",
      "unit": "piece",
      "price": 1100,
      "icon": "snowflake"
     },
     {
      "name": "Kids Sweater",
      "unit": "piece",
      "price": 1300,
      "icon": "snowflake"
     },
     {
      "name": "Baby Blanket",
      "unit": "piece",
      "price": 800,
      "icon": "baby"
     },
     {
      "name": "Baby Cap Set",
      "unit": "piece",
      "price": 300,
      "icon": "baby"
     },
     {
      "name": "School Uniform Shirt",
      "unit": "piece",
      "price": 700,
      "icon": "baby"
     },
     {
      "name": "School Uniform Pant",
      "unit": "piece",
      "price": 900,
      "icon": "baby"
     }
    ]
   },
   {
    "name": "Winter Wear",
    "icon": "snowflake",
    "items": [
     {
      "name": "Ladies Wool Shawl",
      "unit": "piece",
      "price": 1200,
      "icon": "snowflake",
      "nameUrdu": "شال"
     },
     {
      "name": "Pashmina Shawl",
      "unit": "piece",
      "price": 2500,
      "icon": "snowflake"
     },
     {
      "name": "Gents Muffler",
      "unit": "piece",
      "price": 600,
      "icon": "snowflake"
     },
     {
      "name": "Wool Cap",
      "unit": "piece",
      "price": 350,
      "icon": "snowflake"
     },
     {
      "name": "Wool Gloves Pair",
      "unit": "piece",
      "price": 400,
      "icon": "snowflake"
     },
     {
      "name": "Wool Socks 3-pack",
      "unit": "packet",
      "price": 450,
      "icon": "shoe-print"
     },
     {
      "name": "Gents Sweater",
      "unit": "piece",
      "price": 2200,
      "icon": "snowflake"
     },
     {
      "name": "Ladies Sweater",
      "unit": "piece",
      "price": 2400,
      "icon": "snowflake"
     },
     {
      "name": "Sweater Vest",
      "unit": "piece",
      "price": 1400,
      "icon": "snowflake"
     },
     {
      "name": "Puffer Jacket",
      "unit": "piece",
      "price": 4500,
      "icon": "snowflake"
     },
     {
      "name": "Single Blanket",
      "unit": "piece",
      "price": 1800,
      "icon": "snowflake"
     },
     {
      "name": "Double Blanket",
      "unit": "piece",
      "price": 3200,
      "icon": "snowflake"
     },
     {
      "name": "Baby Winter Suit",
      "unit": "piece",
      "price": 900,
      "icon": "snowflake"
     },
     {
      "name": "Kids Winter Cap",
      "unit": "piece",
      "price": 250,
      "icon": "snowflake"
     }
    ]
   }
  ]
 },
 {
  "shopType": "Footwear",
  "icon": "shoe-sneaker",
  "categories": [
   {
    "name": "Chappal",
    "icon": "shoe-print",
    "items": [
     {
      "name": "Peshawari Chappal",
      "unit": "piece",
      "price": 2500,
      "icon": "shoe-print",
      "nameUrdu": "چپل"
     },
     {
      "name": "Peshawari Chappal Premium",
      "unit": "piece",
      "price": 4500,
      "icon": "shoe-print"
     },
     {
      "name": "Kohati Chappal",
      "unit": "piece",
      "price": 2200,
      "icon": "shoe-print"
     },
     {
      "name": "Leather Chappal Gents",
      "unit": "piece",
      "price": 1800,
      "icon": "shoe-print"
     },
     {
      "name": "Rubber Hawai Chappal",
      "unit": "piece",
      "price": 350,
      "icon": "shoe-print"
     },
     {
      "name": "Foam Slipper",
      "unit": "piece",
      "price": 450,
      "icon": "shoe-print"
     },
     {
      "name": "Bathroom Slipper",
      "unit": "piece",
      "price": 300,
      "icon": "shoe-print"
     },
     {
      "name": "Ladies Fancy Chappal",
      "unit": "piece",
      "price": 1500,
      "icon": "fan"
     },
     {
      "name": "Kids Chappal",
      "unit": "piece",
      "price": 600,
      "icon": "shoe-print"
     },
     {
      "name": "Medicated Chappal",
      "unit": "piece",
      "price": 1200,
      "icon": "shoe-print"
     }
    ]
   },
   {
    "name": "Sandals & Slippers",
    "icon": "shoe-print",
    "items": [
     {
      "name": "Ladies Heel Sandal",
      "unit": "piece",
      "price": 1800,
      "icon": "shovel"
     },
     {
      "name": "Ladies Flat Sandal",
      "unit": "piece",
      "price": 1200,
      "icon": "shovel"
     },
     {
      "name": "Gents Leather Sandal",
      "unit": "piece",
      "price": 2000,
      "icon": "shovel"
     },
     {
      "name": "Flip Flops",
      "unit": "piece",
      "price": 400,
      "icon": "shoe-print"
     },
     {
      "name": "Wedge Heel Sandal",
      "unit": "piece",
      "price": 1600,
      "icon": "shovel"
     },
     {
      "name": "Kolhapuri Chappal",
      "unit": "piece",
      "price": 1400,
      "icon": "shoe-print"
     },
     {
      "name": "Velvet Slipper Ladies",
      "unit": "piece",
      "price": 900,
      "icon": "shoe-print"
     },
     {
      "name": "Cork Slipper",
      "unit": "piece",
      "price": 1100,
      "icon": "shoe-print"
     }
    ]
   },
   {
    "name": "Joggers & Sports Shoes",
    "icon": "shoe-sneaker",
    "items": [
     {
      "name": "Canvas Shoes",
      "unit": "piece",
      "price": 1200,
      "icon": "pitchfork"
     },
     {
      "name": "Running Joggers",
      "unit": "piece",
      "price": 2500,
      "icon": "shoe-sneaker"
     },
     {
      "name": "Football Studs",
      "unit": "piece",
      "price": 2800,
      "icon": "soccer"
     },
     {
      "name": "Badminton Shoes",
      "unit": "piece",
      "price": 2200,
      "icon": "leaf"
     },
     {
      "name": "White Tennis Shoes",
      "unit": "piece",
      "price": 2000,
      "icon": "pitchfork"
     },
     {
      "name": "High Ankle Sneakers",
      "unit": "piece",
      "price": 2600,
      "icon": "shoe-sneaker"
     },
     {
      "name": "Kids Sports Shoes",
      "unit": "piece",
      "price": 1400,
      "icon": "shoe-sneaker"
     },
     {
      "name": "Gym Trainers",
      "unit": "piece",
      "price": 2400,
      "icon": "shoe-sneaker"
     },
     {
      "name": "Slip-on Loafers",
      "unit": "piece",
      "price": 1500,
      "icon": "shoe-formal"
     },
     {
      "name": "Walking Shoes",
      "unit": "piece",
      "price": 2200,
      "icon": "pitchfork"
     }
    ]
   },
   {
    "name": "Formal & School Shoes",
    "icon": "shoe-formal",
    "items": [
     {
      "name": "Gents Oxford Shoes",
      "unit": "piece",
      "price": 3500,
      "icon": "shoe-formal"
     },
     {
      "name": "Gents Loafers",
      "unit": "piece",
      "price": 2800,
      "icon": "shoe-formal"
     },
     {
      "name": "Ladies Pumps",
      "unit": "piece",
      "price": 2200,
      "icon": "shoe-formal"
     },
     {
      "name": "Ladies Khussa",
      "unit": "piece",
      "price": 1800,
      "icon": "shoe-print",
      "nameUrdu": "کھسہ"
     },
     {
      "name": "Bridal Khussa",
      "unit": "piece",
      "price": 3500,
      "icon": "bowl"
     },
     {
      "name": "Boys School Shoes",
      "unit": "piece",
      "price": 1400,
      "icon": "shoe-formal"
     },
     {
      "name": "Girls School Shoes",
      "unit": "piece",
      "price": 1300,
      "icon": "shoe-formal"
     },
     {
      "name": "White PT Shoes",
      "unit": "piece",
      "price": 1100,
      "icon": "pitchfork"
     },
     {
      "name": "Safety Shoes Steel Toe",
      "unit": "piece",
      "price": 3200,
      "icon": "pipe"
     },
     {
      "name": "Peshawari Chapli School",
      "unit": "piece",
      "price": 1100,
      "icon": "shoe-formal"
     }
    ]
   },
   {
    "name": "Socks & Shoe Care",
    "icon": "shoe-print",
    "items": [
     {
      "name": "Cotton Socks Pair",
      "unit": "piece",
      "price": 120,
      "icon": "shoe-print"
     },
     {
      "name": "Ankle Socks 3-pack",
      "unit": "packet",
      "price": 350,
      "icon": "shoe-print"
     },
     {
      "name": "Shoe Polish Black",
      "unit": "piece",
      "price": 250,
      "icon": "pitchfork"
     },
     {
      "name": "Shoe Polish Brown",
      "unit": "piece",
      "price": 250,
      "icon": "pitchfork"
     },
     {
      "name": "Shoe Brush",
      "unit": "piece",
      "price": 200,
      "icon": "brush"
     },
     {
      "name": "Shoe Insoles Pair",
      "unit": "piece",
      "price": 300,
      "icon": "pitchfork"
     },
     {
      "name": "Shoe Laces Pair",
      "unit": "piece",
      "price": 100,
      "icon": "pitchfork"
     }
    ]
   }
  ]
 },
 {
  "shopType": "Auto & Motorcycle Parts",
  "icon": "motorbike",
  "categories": [
   {
    "name": "70cc Bike Engine Parts",
    "icon": "engine",
    "items": [
     {
      "name": "Piston Kit 70cc",
      "unit": "piece",
      "price": 1800,
      "icon": "engine"
     },
     {
      "name": "Cylinder Kit 70cc",
      "unit": "piece",
      "price": 4500,
      "icon": "engine"
     },
     {
      "name": "Clutch Plates Set 70cc",
      "unit": "piece",
      "price": 1200,
      "icon": "silverware-fork-knife"
     },
     {
      "name": "Clutch Cable 70cc",
      "unit": "piece",
      "price": 250,
      "icon": "cable-data"
     },
     {
      "name": "Accelerator Cable 70cc",
      "unit": "piece",
      "price": 200,
      "icon": "cable-data"
     },
     {
      "name": "Front Brake Cable 70cc",
      "unit": "piece",
      "price": 180,
      "icon": "cable-data"
     },
     {
      "name": "Chain Sprocket Set 70cc",
      "unit": "piece",
      "price": 1600,
      "icon": "engine"
     },
     {
      "name": "Drive Chain 420",
      "unit": "piece",
      "price": 900,
      "icon": "engine"
     },
     {
      "name": "Spark Plug",
      "unit": "piece",
      "price": 350,
      "icon": "flash"
     },
     {
      "name": "CDI Unit 70cc",
      "unit": "piece",
      "price": 1200,
      "icon": "engine"
     },
     {
      "name": "Ignition Coil",
      "unit": "piece",
      "price": 900,
      "icon": "engine"
     },
     {
      "name": "Rectifier Regulator",
      "unit": "piece",
      "price": 800,
      "icon": "engine"
     },
     {
      "name": "Engine Oil Seal Kit",
      "unit": "piece",
      "price": 600,
      "icon": "oil"
     },
     {
      "name": "Spark Plug Wrench",
      "unit": "piece",
      "price": 350,
      "icon": "wrench"
     }
    ]
   },
   {
    "name": "Bike Body & Electrical",
    "icon": "motorbike",
    "items": [
     {
      "name": "Headlight Assembly 70cc",
      "unit": "piece",
      "price": 1800,
      "icon": "car-light-high"
     },
     {
      "name": "Headlight Bulb 12V",
      "unit": "piece",
      "price": 250,
      "icon": "lightbulb"
     },
     {
      "name": "Tail Light 70cc",
      "unit": "piece",
      "price": 600,
      "icon": "motorbike"
     },
     {
      "name": "Indicator Set 4pc",
      "unit": "packet",
      "price": 800,
      "icon": "motorbike"
     },
     {
      "name": "Side Mirror Pair",
      "unit": "piece",
      "price": 700,
      "icon": "mirror"
     },
     {
      "name": "Fuel Tank Cap",
      "unit": "piece",
      "price": 450,
      "icon": "motorbike"
     },
     {
      "name": "Handle Grip Pair",
      "unit": "piece",
      "price": 350,
      "icon": "motorbike"
     },
     {
      "name": "Horn 12V",
      "unit": "piece",
      "price": 500,
      "icon": "motorbike"
     },
     {
      "name": "Bike Battery 12V 5Ah",
      "unit": "piece",
      "price": 4500,
      "icon": "battery"
     },
     {
      "name": "Speedometer Cable",
      "unit": "piece",
      "price": 300,
      "icon": "cable-data"
     },
     {
      "name": "Number Plate Frame",
      "unit": "piece",
      "price": 250,
      "icon": "silverware-fork-knife"
     },
     {
      "name": "Bike Hazard Flasher",
      "unit": "piece",
      "price": 600,
      "icon": "motorbike"
     }
    ]
   },
   {
    "name": "Tyres & Tubes",
    "icon": "tire",
    "items": [
     {
      "name": "Bike Tyre 2.50-17",
      "unit": "piece",
      "price": 3000,
      "icon": "tire"
     },
     {
      "name": "Bike Tyre 2.75-17",
      "unit": "piece",
      "price": 3400,
      "icon": "tire"
     },
     {
      "name": "Bike Tyre 3.00-17",
      "unit": "piece",
      "price": 3800,
      "icon": "tire"
     },
     {
      "name": "Bike Tube 17 inch",
      "unit": "piece",
      "price": 650,
      "icon": "tire"
     },
     {
      "name": "Bike Tube 18 inch",
      "unit": "piece",
      "price": 700,
      "icon": "tire"
     },
     {
      "name": "Puncture Repair Kit",
      "unit": "piece",
      "price": 400,
      "icon": "tire"
     },
     {
      "name": "Foot Air Pump",
      "unit": "piece",
      "price": 1500,
      "icon": "tire"
     },
     {
      "name": "Valve Caps 4-pack",
      "unit": "packet",
      "price": 150,
      "icon": "tire"
     },
     {
      "name": "Car Tyre 165/70 R13",
      "unit": "piece",
      "price": 16000,
      "icon": "tire"
     },
     {
      "name": "Car Tyre 185/65 R14",
      "unit": "piece",
      "price": 22000,
      "icon": "tire"
     }
    ]
   },
   {
    "name": "Oils & Lubricants",
    "icon": "oil",
    "items": [
     {
      "name": "Engine Oil 20W-50 1L",
      "unit": "litre",
      "price": 950,
      "icon": "oil",
      "nameUrdu": "موبل آئل"
     },
     {
      "name": "Engine Oil 10W-30 1L",
      "unit": "litre",
      "price": 1050,
      "icon": "oil"
     },
     {
      "name": "Honda 4T Engine Oil 1L",
      "unit": "litre",
      "price": 1100,
      "icon": "oil"
     },
     {
      "name": "Havoline Engine Oil 1L",
      "unit": "litre",
      "price": 1000,
      "icon": "oil"
     },
     {
      "name": "Gear Oil 1L",
      "unit": "litre",
      "price": 900,
      "icon": "oil"
     },
     {
      "name": "Brake Oil 500ml",
      "unit": "piece",
      "price": 550,
      "icon": "oil"
     },
     {
      "name": "Grease Tin 500g",
      "unit": "piece",
      "price": 650,
      "icon": "oil"
     },
     {
      "name": "Chain Lube Spray",
      "unit": "piece",
      "price": 800,
      "icon": "oil"
     },
     {
      "name": "Radiator Coolant 1L",
      "unit": "litre",
      "price": 700,
      "icon": "oil"
     },
     {
      "name": "Hydraulic Oil 1L",
      "unit": "litre",
      "price": 850,
      "icon": "oil"
     },
     {
      "name": "Engine Flush 500ml",
      "unit": "piece",
      "price": 650,
      "icon": "oil"
     }
    ]
   },
   {
    "name": "Car Basics",
    "icon": "car",
    "items": [
     {
      "name": "Car Battery 12V 70Ah",
      "unit": "piece",
      "price": 28000,
      "icon": "battery"
     },
     {
      "name": "Wiper Blade 22 inch",
      "unit": "piece",
      "price": 900,
      "icon": "car"
     },
     {
      "name": "Wiper Blade 18 inch",
      "unit": "piece",
      "price": 750,
      "icon": "car"
     },
     {
      "name": "Car Horn Pair",
      "unit": "piece",
      "price": 1200,
      "icon": "car"
     },
     {
      "name": "Headlight Bulb H4",
      "unit": "piece",
      "price": 800,
      "icon": "lightbulb"
     },
     {
      "name": "LED Headlight H4 Pair",
      "unit": "piece",
      "price": 3500,
      "icon": "car-light-high"
     },
     {
      "name": "Car Air Freshener",
      "unit": "piece",
      "price": 350,
      "icon": "car"
     },
     {
      "name": "Car Floor Mats Set",
      "unit": "piece",
      "price": 2500,
      "icon": "car"
     },
     {
      "name": "Car Seat Covers Set",
      "unit": "piece",
      "price": 4500,
      "icon": "car"
     },
     {
      "name": "Car Shampoo 1L",
      "unit": "litre",
      "price": 600,
      "icon": "bottle-tonic"
     },
     {
      "name": "Microfiber Cloth 3-pack",
      "unit": "packet",
      "price": 450,
      "icon": "car"
     },
     {
      "name": "Car Polish 500ml",
      "unit": "piece",
      "price": 750,
      "icon": "car"
     },
     {
      "name": "Reverse Camera Kit",
      "unit": "piece",
      "price": 4500,
      "icon": "car"
     }
    ]
   },
   {
    "name": "Accessories & Riding Gear",
    "icon": "racing-helmet",
    "items": [
     {
      "name": "Bike Cover",
      "unit": "piece",
      "price": 1200,
      "icon": "racing-helmet"
     },
     {
      "name": "Car Cover",
      "unit": "piece",
      "price": 2800,
      "icon": "racing-helmet"
     },
     {
      "name": "Cable Lock",
      "unit": "piece",
      "price": 900,
      "icon": "cable-data"
     },
     {
      "name": "Disc Lock with Alarm",
      "unit": "piece",
      "price": 1800,
      "icon": "lock"
     },
     {
      "name": "Tool Kit 46pc",
      "unit": "piece",
      "price": 2500,
      "icon": "racing-helmet"
     },
     {
      "name": "Helmet Open Face",
      "unit": "piece",
      "price": 1800,
      "icon": "racing-helmet"
     },
     {
      "name": "Helmet Full Face",
      "unit": "piece",
      "price": 3500,
      "icon": "racing-helmet"
     },
     {
      "name": "Riding Gloves",
      "unit": "piece",
      "price": 1200,
      "icon": "racing-helmet"
     },
     {
      "name": "Knee Guards Pair",
      "unit": "piece",
      "price": 1500,
      "icon": "racing-helmet"
     },
     {
      "name": "LED Fog Lamps Pair",
      "unit": "piece",
      "price": 2200,
      "icon": "floor-lamp"
     }
    ]
   },
   {
    "name": "Filters & Service",
    "icon": "car-wrench",
    "items": [
     {
      "name": "Air Filter 70cc",
      "unit": "piece",
      "price": 450,
      "icon": "car-wrench"
     },
     {
      "name": "Oil Filter Car",
      "unit": "piece",
      "price": 600,
      "icon": "car-wrench"
     },
     {
      "name": "Fuel Filter",
      "unit": "piece",
      "price": 350,
      "icon": "car-wrench"
     },
     {
      "name": "Car Air Filter",
      "unit": "piece",
      "price": 900,
      "icon": "car-wrench"
     },
     {
      "name": "Cabin Filter",
      "unit": "piece",
      "price": 1200,
      "icon": "car-wrench"
     },
     {
      "name": "Front Brake Pads Set",
      "unit": "piece",
      "price": 1800,
      "icon": "pitchfork"
     },
     {
      "name": "Rear Brake Shoes 70cc",
      "unit": "piece",
      "price": 700,
      "icon": "pitchfork"
     },
     {
      "name": "70cc Service Kit (Oil+Plug+Filter)",
      "unit": "piece",
      "price": 1800,
      "icon": "car-wrench"
     },
     {
      "name": "Dashboard Shiner",
      "unit": "piece",
      "price": 650,
      "icon": "car-wrench"
     },
     {
      "name": "Tyre Shiner Spray",
      "unit": "piece",
      "price": 550,
      "icon": "tire"
     }
    ]
   }
  ]
 },
 {
  "shopType": "Agriculture - Seeds, Fertilizer & Pesticides",
  "icon": "tractor",
  "categories": [
   {
    "name": "Fertilizers (Khad)",
    "icon": "sprout",
    "items": [
     {
      "name": "DAP Bag 50kg",
      "unit": "piece",
      "price": 14500,
      "icon": "sprout",
      "nameUrdu": "کھاد"
     },
     {
      "name": "Urea Bag 50kg",
      "unit": "piece",
      "price": 4500,
      "icon": "sprout"
     },
     {
      "name": "SOP Bag 50kg",
      "unit": "piece",
      "price": 12000,
      "icon": "sprout"
     },
     {
      "name": "NPK 15-15-15 Bag 50kg",
      "unit": "piece",
      "price": 9500,
      "icon": "sprout"
     },
     {
      "name": "SSP Bag 50kg",
      "unit": "piece",
      "price": 6500,
      "icon": "sprout"
     },
     {
      "name": "CAN Bag 50kg",
      "unit": "piece",
      "price": 5200,
      "icon": "sprout"
     },
     {
      "name": "Zinc Sulphate 5kg",
      "unit": "packet",
      "price": 1800,
      "icon": "sprout"
     },
     {
      "name": "Boron 3kg",
      "unit": "packet",
      "price": 1500,
      "icon": "sprout"
     },
     {
      "name": "Gypsum Bag 50kg",
      "unit": "piece",
      "price": 1200,
      "icon": "sprout"
     },
     {
      "name": "Humic Acid 1kg",
      "unit": "packet",
      "price": 900,
      "icon": "sprout"
     },
     {
      "name": "Epsom Salt 25kg",
      "unit": "piece",
      "price": 3500,
      "icon": "sprout"
     },
     {
      "name": "Organic Compost 40kg",
      "unit": "piece",
      "price": 1800,
      "icon": "sprout"
     }
    ]
   },
   {
    "name": "Seeds",
    "icon": "seed",
    "items": [
     {
      "name": "Wheat Seed 50kg",
      "unit": "piece",
      "price": 6500,
      "icon": "seed",
      "nameUrdu": "بیج"
     },
     {
      "name": "Paddy Seed 20kg",
      "unit": "piece",
      "price": 9000,
      "icon": "seed"
     },
     {
      "name": "Maize Hybrid Seed 4kg",
      "unit": "packet",
      "price": 4500,
      "icon": "seed"
     },
     {
      "name": "Cotton Seed 10kg",
      "unit": "piece",
      "price": 5500,
      "icon": "seed"
     },
     {
      "name": "Mustard Seed 5kg",
      "unit": "packet",
      "price": 2200,
      "icon": "seed"
     },
     {
      "name": "Sunflower Hybrid 2kg",
      "unit": "packet",
      "price": 2800,
      "icon": "seed"
     },
     {
      "name": "Onion Seed 1kg",
      "unit": "packet",
      "price": 1800,
      "icon": "seed"
     },
     {
      "name": "Potato Seed 50kg",
      "unit": "piece",
      "price": 7000,
      "icon": "seed"
     },
     {
      "name": "Bajra Fodder Seed 10kg",
      "unit": "piece",
      "price": 2800,
      "icon": "seed"
     },
     {
      "name": "Barseem Clover Seed 10kg",
      "unit": "piece",
      "price": 3200,
      "icon": "seed"
     },
     {
      "name": "Vegetable Seeds Mix Pack",
      "unit": "packet",
      "price": 650,
      "icon": "seed"
     },
     {
      "name": "Tomato Hybrid Seed 100g",
      "unit": "packet",
      "price": 950,
      "icon": "seed"
     }
    ]
   },
   {
    "name": "Pesticides & Sprays",
    "icon": "bug",
    "items": [
     {
      "name": "Bifenthrin 1L",
      "unit": "litre",
      "price": 2800,
      "icon": "bug",
      "nameUrdu": "اسپرے"
     },
     {
      "name": "Lambda Cyhalothrin 500ml",
      "unit": "piece",
      "price": 1400,
      "icon": "bug"
     },
     {
      "name": "Imidacloprid 500ml",
      "unit": "piece",
      "price": 1600,
      "icon": "bug"
     },
     {
      "name": "Glyphosate 1L",
      "unit": "litre",
      "price": 2200,
      "icon": "bug"
     },
     {
      "name": "Atrazine 1kg",
      "unit": "packet",
      "price": 1800,
      "icon": "bug"
     },
     {
      "name": "Mancozeb 400g",
      "unit": "packet",
      "price": 900,
      "icon": "bug"
     },
     {
      "name": "Copper Oxychloride 1kg",
      "unit": "packet",
      "price": 1500,
      "icon": "bug"
     },
     {
      "name": "Emamectin 200ml",
      "unit": "piece",
      "price": 1200,
      "icon": "bug"
     },
     {
      "name": "Chlorpyrifos 1L",
      "unit": "litre",
      "price": 2400,
      "icon": "bug"
     },
     {
      "name": "Pendimethalin 1L",
      "unit": "litre",
      "price": 2600,
      "icon": "bug"
     },
     {
      "name": "2,4-D Amine 1L",
      "unit": "litre",
      "price": 1800,
      "icon": "bug"
     },
     {
      "name": "Sulphur 1kg",
      "unit": "packet",
      "price": 700,
      "icon": "bug"
     }
    ]
   },
   {
    "name": "Spray Equipment",
    "icon": "spray-bottle",
    "items": [
     {
      "name": "Knapsack Sprayer 20L",
      "unit": "piece",
      "price": 6500,
      "icon": "spray-bottle"
     },
     {
      "name": "Battery Sprayer 20L",
      "unit": "piece",
      "price": 12000,
      "icon": "battery"
     },
     {
      "name": "Hand Pressure Sprayer 5L",
      "unit": "piece",
      "price": 1800,
      "icon": "spray-bottle"
     },
     {
      "name": "Brass Spray Nozzle",
      "unit": "piece",
      "price": 600,
      "icon": "spray-bottle"
     },
     {
      "name": "Spray Hose 50ft",
      "unit": "piece",
      "price": 2200,
      "icon": "spray-bottle"
     },
     {
      "name": "Petrol Mist Blower",
      "unit": "piece",
      "price": 28000,
      "icon": "spray-bottle"
     },
     {
      "name": "Protective Spray Suit",
      "unit": "piece",
      "price": 2500,
      "icon": "spray-bottle"
     },
     {
      "name": "Measuring Cylinder 1L",
      "unit": "piece",
      "price": 450,
      "icon": "spray-bottle"
     }
    ]
   },
   {
    "name": "Farm Tools",
    "icon": "pitchfork",
    "items": [
     {
      "name": "Spade (Kassi)",
      "unit": "piece",
      "price": 1200,
      "icon": "pitchfork",
      "nameUrdu": "کسی"
     },
     {
      "name": "Hoe (Kudal)",
      "unit": "piece",
      "price": 900,
      "icon": "pitchfork"
     },
     {
      "name": "Sickle (Daranti)",
      "unit": "piece",
      "price": 450,
      "icon": "pitchfork",
      "nameUrdu": "درانتی"
     },
     {
      "name": "Axe (Kulhara)",
      "unit": "piece",
      "price": 1500,
      "icon": "axe",
      "nameUrdu": "کلہاڑا"
     },
     {
      "name": "Shovel (Belcha)",
      "unit": "piece",
      "price": 1100,
      "icon": "shovel"
     },
     {
      "name": "Garden Rake",
      "unit": "piece",
      "price": 800,
      "icon": "pitchfork"
     },
     {
      "name": "Wheelbarrow",
      "unit": "piece",
      "price": 6500,
      "icon": "shoe-heel"
     },
     {
      "name": "Pruning Shears",
      "unit": "piece",
      "price": 950,
      "icon": "pitchfork"
     },
     {
      "name": "Water Pipe 2 inch 100ft",
      "unit": "piece",
      "price": 8500,
      "icon": "pipe"
     },
     {
      "name": "Nylon Rope 1kg",
      "unit": "kg",
      "price": 600,
      "icon": "pitchfork"
     }
    ]
   },
   {
    "name": "Soil & Irrigation",
    "icon": "water",
    "items": [
     {
      "name": "Soil pH Meter",
      "unit": "piece",
      "price": 1800,
      "icon": "water"
     },
     {
      "name": "Soil Moisture Meter",
      "unit": "piece",
      "price": 1500,
      "icon": "lotion"
     },
     {
      "name": "Drip Lateral 16mm 100m",
      "unit": "piece",
      "price": 9500,
      "icon": "water"
     },
     {
      "name": "Sprinkler Head",
      "unit": "piece",
      "price": 900,
      "icon": "water"
     },
     {
      "name": "PVC Pipe 2 inch 10ft",
      "unit": "piece",
      "price": 1400,
      "icon": "pipe"
     },
     {
      "name": "Foot Valve 2 inch",
      "unit": "piece",
      "price": 1200,
      "icon": "water"
     }
    ]
   }
  ]
 },
 {
  "shopType": "Jewelry & Watches",
  "icon": "crown",
  "categories": [
   {
    "name": "Gold Jewelry",
    "icon": "crown",
    "items": [
     {
      "name": "Ladies Gold Ring",
      "unit": "piece",
      "price": 220000,
      "icon": "crown",
      "nameUrdu": "انگوٹھی"
     },
     {
      "name": "Gold Earrings Pair",
      "unit": "piece",
      "price": 180000,
      "icon": "crown",
      "nameUrdu": "بالیاں"
     },
     {
      "name": "Gold Chain 1 Tola",
      "unit": "piece",
      "price": 300000,
      "icon": "crown",
      "nameUrdu": "چین"
     },
     {
      "name": "Gold Bangles Pair",
      "unit": "piece",
      "price": 450000,
      "icon": "crown",
      "nameUrdu": "کنگن"
     },
     {
      "name": "Gold Locket",
      "unit": "piece",
      "price": 95000,
      "icon": "lock",
      "nameUrdu": "لاکٹ"
     },
     {
      "name": "Gold Nose Pin",
      "unit": "piece",
      "price": 45000,
      "icon": "crown",
      "nameUrdu": "نتھلی"
     },
     {
      "name": "Gold Bracelet",
      "unit": "piece",
      "price": 260000,
      "icon": "crown"
     },
     {
      "name": "Gold Tops Pair",
      "unit": "piece",
      "price": 120000,
      "icon": "crown"
     }
    ]
   },
   {
    "name": "Silver Jewelry",
    "icon": "necklace",
    "items": [
     {
      "name": "Silver Ring",
      "unit": "piece",
      "price": 8000,
      "icon": "ring",
      "nameUrdu": "چاندی کی انگوٹھی"
     },
     {
      "name": "Silver Chain",
      "unit": "piece",
      "price": 25000,
      "icon": "necklace"
     },
     {
      "name": "Silver Bangles Pair",
      "unit": "piece",
      "price": 35000,
      "icon": "necklace"
     },
     {
      "name": "Silver Earrings Pair",
      "unit": "piece",
      "price": 12000,
      "icon": "ring"
     },
     {
      "name": "Silver Locket",
      "unit": "piece",
      "price": 15000,
      "icon": "lock"
     },
     {
      "name": "Silver Bracelet",
      "unit": "piece",
      "price": 18000,
      "icon": "necklace"
     },
     {
      "name": "Silver Anklet Pair (Payal)",
      "unit": "piece",
      "price": 14000,
      "icon": "necklace",
      "nameUrdu": "پائل"
     },
     {
      "name": "Silver Nose Pin",
      "unit": "piece",
      "price": 3500,
      "icon": "necklace"
     }
    ]
   },
   {
    "name": "Artificial Jewelry",
    "icon": "diamond-stone",
    "items": [
     {
      "name": "Artificial Bangles Set",
      "unit": "piece",
      "price": 1200,
      "icon": "diamond-stone"
     },
     {
      "name": "Artificial Earrings",
      "unit": "piece",
      "price": 600,
      "icon": "ring"
     },
     {
      "name": "Artificial Necklace Set",
      "unit": "piece",
      "price": 2500,
      "icon": "necklace"
     },
     {
      "name": "Artificial Ring",
      "unit": "piece",
      "price": 450,
      "icon": "ring"
     },
     {
      "name": "Bridal Set Artificial",
      "unit": "piece",
      "price": 8000,
      "icon": "bowl"
     },
     {
      "name": "Tikka Jhumar Set",
      "unit": "piece",
      "price": 1800,
      "icon": "grill",
      "nameUrdu": "ٹکہ"
     },
     {
      "name": "Matha Patti",
      "unit": "piece",
      "price": 1500,
      "icon": "diamond-stone"
     },
     {
      "name": "Artificial Kamarbandh",
      "unit": "piece",
      "price": 1200,
      "icon": "diamond-stone"
     },
     {
      "name": "Pearl Mala",
      "unit": "piece",
      "price": 2000,
      "icon": "fruit-pear"
     },
     {
      "name": "Hair Accessories Bridal Set",
      "unit": "piece",
      "price": 950,
      "icon": "bowl"
     }
    ]
   },
   {
    "name": "Watches & Clocks",
    "icon": "watch",
    "items": [
     {
      "name": "Gents Quartz Watch",
      "unit": "piece",
      "price": 3500,
      "icon": "watch",
      "nameUrdu": "گھڑی"
     },
     {
      "name": "Ladies Quartz Watch",
      "unit": "piece",
      "price": 2800,
      "icon": "watch"
     },
     {
      "name": "Digital Sports Watch",
      "unit": "piece",
      "price": 2200,
      "icon": "watch"
     },
     {
      "name": "Smart Watch",
      "unit": "piece",
      "price": 6500,
      "icon": "watch"
     },
     {
      "name": "Couple Watch Set",
      "unit": "piece",
      "price": 6000,
      "icon": "watch"
     },
     {
      "name": "Wall Clock",
      "unit": "piece",
      "price": 1800,
      "icon": "lock"
     },
     {
      "name": "Alarm Clock",
      "unit": "piece",
      "price": 950,
      "icon": "lock"
     },
     {
      "name": "Leather Watch Strap",
      "unit": "piece",
      "price": 800,
      "icon": "watch"
     },
     {
      "name": "Watch Battery Cell",
      "unit": "piece",
      "price": 150,
      "icon": "battery"
     },
     {
      "name": "Kids Watch",
      "unit": "piece",
      "price": 1200,
      "icon": "watch"
     }
    ]
   },
   {
    "name": "Repair & Services",
    "icon": "hammer-wrench",
    "items": [
     {
      "name": "Watch Battery Replacement",
      "unit": "piece",
      "price": 300,
      "icon": "battery"
     },
     {
      "name": "Watch Glass Replacement",
      "unit": "piece",
      "price": 800,
      "icon": "package-variant"
     },
     {
      "name": "Gold Polish Service",
      "unit": "piece",
      "price": 1500,
      "icon": "crown"
     },
     {
      "name": "Ring Resizing Service",
      "unit": "piece",
      "price": 1000,
      "icon": "hammer-wrench"
     }
    ]
   }
  ]
 },
 {
  "shopType": "Sports & Fitness",
  "icon": "soccer",
  "categories": [
   {
    "name": "Cricket",
    "icon": "cricket",
    "items": [
     {
      "name": "Cricket Bat English Willow",
      "unit": "piece",
      "price": 8500,
      "icon": "cricket",
      "nameUrdu": "بیٹ"
     },
     {
      "name": "Cricket Bat Kashmir Willow",
      "unit": "piece",
      "price": 2800,
      "icon": "cricket"
     },
     {
      "name": "Tennis Ball 3-pack",
      "unit": "packet",
      "price": 450,
      "icon": "tennis",
      "nameUrdu": "گیند"
     },
     {
      "name": "Season Ball",
      "unit": "piece",
      "price": 1200,
      "icon": "cricket"
     },
     {
      "name": "Cricket Kit Bag",
      "unit": "piece",
      "price": 3500,
      "icon": "cricket"
     },
     {
      "name": "Batting Gloves",
      "unit": "piece",
      "price": 1800,
      "icon": "cricket"
     },
     {
      "name": "Batting Pads",
      "unit": "piece",
      "price": 2200,
      "icon": "cricket"
     },
     {
      "name": "Cricket Helmet",
      "unit": "piece",
      "price": 3200,
      "icon": "racing-helmet"
     },
     {
      "name": "Wooden Stumps Set",
      "unit": "piece",
      "price": 1500,
      "icon": "cricket"
     },
     {
      "name": "Abdominal Guard",
      "unit": "piece",
      "price": 600,
      "icon": "cricket"
     },
     {
      "name": "Wheelie Kit Bag",
      "unit": "piece",
      "price": 4500,
      "icon": "shoe-heel"
     },
     {
      "name": "Grip Cone 3-pack",
      "unit": "packet",
      "price": 350,
      "icon": "cricket"
     }
    ]
   },
   {
    "name": "Football",
    "icon": "soccer",
    "items": [
     {
      "name": "Football Size 5",
      "unit": "piece",
      "price": 1800,
      "icon": "soccer"
     },
     {
      "name": "Football Size 4",
      "unit": "piece",
      "price": 1500,
      "icon": "soccer"
     },
     {
      "name": "Futsal Ball",
      "unit": "piece",
      "price": 1600,
      "icon": "soccer"
     },
     {
      "name": "Goalkeeper Gloves",
      "unit": "piece",
      "price": 1400,
      "icon": "soccer"
     },
     {
      "name": "Shin Guards",
      "unit": "piece",
      "price": 700,
      "icon": "soccer"
     },
     {
      "name": "Football Pump",
      "unit": "piece",
      "price": 600,
      "icon": "soccer"
     },
     {
      "name": "Referee Whistle",
      "unit": "piece",
      "price": 250,
      "icon": "soccer"
     },
     {
      "name": "Training Cones 10-pack",
      "unit": "packet",
      "price": 900,
      "icon": "soccer"
     }
    ]
   },
   {
    "name": "Badminton & Racket Sports",
    "icon": "badminton",
    "items": [
     {
      "name": "Badminton Racket Pair",
      "unit": "piece",
      "price": 2800,
      "icon": "leaf"
     },
     {
      "name": "Shuttlecock 6-pack",
      "unit": "packet",
      "price": 900,
      "icon": "badminton"
     },
     {
      "name": "Badminton Net",
      "unit": "piece",
      "price": 2200,
      "icon": "leaf"
     },
     {
      "name": "Tennis Racket",
      "unit": "piece",
      "price": 4500,
      "icon": "tennis"
     },
     {
      "name": "Tennis Balls 3-pack",
      "unit": "packet",
      "price": 1200,
      "icon": "tennis"
     },
     {
      "name": "Squash Racket",
      "unit": "piece",
      "price": 3800,
      "icon": "tennis"
     },
     {
      "name": "Table Tennis Bats Pair",
      "unit": "piece",
      "price": 1600,
      "icon": "tennis"
     },
     {
      "name": "TT Balls 6-pack",
      "unit": "packet",
      "price": 500,
      "icon": "badminton"
     }
    ]
   },
   {
    "name": "Gym & Fitness",
    "icon": "dumbbell",
    "items": [
     {
      "name": "Dumbbell 5kg Pair",
      "unit": "piece",
      "price": 4500,
      "icon": "dumbbell",
      "nameUrdu": "ڈمبل"
     },
     {
      "name": "Dumbbell 10kg Pair",
      "unit": "piece",
      "price": 8500,
      "icon": "dumbbell"
     },
     {
      "name": "Kettlebell 12kg",
      "unit": "piece",
      "price": 6500,
      "icon": "kettle"
     },
     {
      "name": "Barbell Rod 5ft",
      "unit": "piece",
      "price": 4500,
      "icon": "dumbbell"
     },
     {
      "name": "Weight Plate 10kg",
      "unit": "piece",
      "price": 3200,
      "icon": "dumbbell"
     },
     {
      "name": "Bench Press Bench",
      "unit": "piece",
      "price": 18000,
      "icon": "dumbbell"
     },
     {
      "name": "Skipping Rope",
      "unit": "piece",
      "price": 600,
      "icon": "dumbbell"
     },
     {
      "name": "Yoga Mat",
      "unit": "piece",
      "price": 1500,
      "icon": "dumbbell"
     },
     {
      "name": "Gym Gloves",
      "unit": "piece",
      "price": 900,
      "icon": "dumbbell"
     },
     {
      "name": "Resistance Bands Set",
      "unit": "piece",
      "price": 1800,
      "icon": "dumbbell"
     },
     {
      "name": "Doorway Pull-up Bar",
      "unit": "piece",
      "price": 3500,
      "icon": "dumbbell"
     },
     {
      "name": "Push-up Bars Pair",
      "unit": "piece",
      "price": 1200,
      "icon": "dumbbell"
     },
     {
      "name": "Ab Wheel",
      "unit": "piece",
      "price": 1100,
      "icon": "shoe-heel"
     },
     {
      "name": "Gym Water Bottle",
      "unit": "piece",
      "price": 800,
      "icon": "dumbbell"
     }
    ]
   },
   {
    "name": "Outdoor & Indoor Games",
    "icon": "gamepad-variant",
    "items": [
     {
      "name": "Volleyball",
      "unit": "piece",
      "price": 1600,
      "icon": "gamepad-variant"
     },
     {
      "name": "Basketball",
      "unit": "piece",
      "price": 2200,
      "icon": "gamepad-variant"
     },
     {
      "name": "Hockey Stick",
      "unit": "piece",
      "price": 2800,
      "icon": "gamepad-variant"
     },
     {
      "name": "Carrom Board",
      "unit": "piece",
      "price": 3500,
      "icon": "gamepad-variant"
     },
     {
      "name": "Carrom Coins Set",
      "unit": "piece",
      "price": 600,
      "icon": "gamepad-variant"
     },
     {
      "name": "Ludo Board",
      "unit": "piece",
      "price": 450,
      "icon": "gamepad-variant"
     },
     {
      "name": "Chess Set",
      "unit": "piece",
      "price": 1200,
      "icon": "gamepad-variant"
     },
     {
      "name": "Dart Board",
      "unit": "piece",
      "price": 2500,
      "icon": "gamepad-variant"
     }
    ]
   }
  ]
 },
 {
  "shopType": "Paan & Tobacco Shop",
  "icon": "leaf",
  "categories": [
   {
    "name": "Paan Ingredients",
    "icon": "leaf",
    "items": [
     {
      "name": "Betel Leaf (Paan Patta) dozen",
      "unit": "dozen",
      "price": 150,
      "icon": "barley",
      "nameUrdu": "پان"
     },
     {
      "name": "Areca Nut (Supari) 250g",
      "unit": "packet",
      "price": 400,
      "icon": "seed",
      "nameUrdu": "سپاری"
     },
     {
      "name": "Slaked Lime (Chuna) 100g",
      "unit": "packet",
      "price": 150,
      "icon": "leaf",
      "nameUrdu": "چونا"
     },
     {
      "name": "Kattha 100g",
      "unit": "packet",
      "price": 300,
      "icon": "leaf",
      "nameUrdu": "کتھا"
     },
     {
      "name": "Cardamom (Elaichi) 50g",
      "unit": "packet",
      "price": 600,
      "icon": "leaf",
      "nameUrdu": "الائچی"
     },
     {
      "name": "Coconut Powder 250g",
      "unit": "packet",
      "price": 350,
      "icon": "leaf"
     },
     {
      "name": "Fennel Seeds (Saunf) 250g",
      "unit": "packet",
      "price": 300,
      "icon": "seed",
      "nameUrdu": "سونف"
     },
     {
      "name": "Gulkand 100g",
      "unit": "packet",
      "price": 250,
      "icon": "leaf",
      "nameUrdu": "گل قند"
     }
    ]
   },
   {
    "name": "Supari & Chewables",
    "icon": "seed",
    "items": [
     {
      "name": "Sweet Supari Pouch",
      "unit": "packet",
      "price": 450,
      "icon": "cellphone"
     },
     {
      "name": "Roasted Supari 250g",
      "unit": "packet",
      "price": 500,
      "icon": "seed"
     },
     {
      "name": "Saunf Supari Mix 250g",
      "unit": "packet",
      "price": 350,
      "icon": "seed"
     },
     {
      "name": "Elaichi Dana 100g",
      "unit": "packet",
      "price": 400,
      "icon": "seed"
     },
     {
      "name": "Coconut Supari 250g",
      "unit": "packet",
      "price": 300,
      "icon": "seed"
     },
     {
      "name": "Mitha Pan Masala 200g",
      "unit": "packet",
      "price": 550,
      "icon": "seed"
     }
    ]
   },
   {
    "name": "Cigarettes (Retail Packs)",
    "icon": "smoking",
    "items": [
     {
      "name": "Gold Leaf Pack 20",
      "unit": "piece",
      "price": 650,
      "icon": "crown"
     },
     {
      "name": "Marlboro Pack 20",
      "unit": "piece",
      "price": 850,
      "icon": "smoking"
     },
     {
      "name": "Dunhill Pack 20",
      "unit": "piece",
      "price": 900,
      "icon": "smoking"
     },
     {
      "name": "Capstan Pack 20",
      "unit": "piece",
      "price": 550,
      "icon": "smoking"
     },
     {
      "name": "Morven Gold Pack 20",
      "unit": "piece",
      "price": 600,
      "icon": "crown"
     },
     {
      "name": "K2 Pack 20",
      "unit": "piece",
      "price": 500,
      "icon": "smoking"
     },
     {
      "name": "Red & White Pack 20",
      "unit": "piece",
      "price": 520,
      "icon": "smoking"
     }
    ]
   },
   {
    "name": "Smoking Accessories",
    "icon": "fire",
    "items": [
     {
      "name": "Gas Lighter",
      "unit": "piece",
      "price": 150,
      "icon": "fire",
      "nameUrdu": "لائٹر"
     },
     {
      "name": "Matchbox 10-pack",
      "unit": "packet",
      "price": 120,
      "icon": "fire"
     },
     {
      "name": "Cigarette Case",
      "unit": "piece",
      "price": 400,
      "icon": "smoking"
     },
     {
      "name": "Ashtray",
      "unit": "piece",
      "price": 350,
      "icon": "tray"
     }
    ]
   }
  ]
 }
];

export const MASTER_CATALOG_ITEM_COUNT = 1720;
