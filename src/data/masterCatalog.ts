import type { ProductUnit } from '@/types';

export interface ImageCredit {
  name: string;
  profileUrl: string;
  photoUrl: string;
  source: 'Unsplash' | 'Wikimedia Commons';
}

export interface CatalogItem {
  name: string;
  nameUrdu?: string;
  unit: ProductUnit;
  price: number; // typical Pakistan retail estimate in Rs. — editable per shop
  icon: string; // fallback glyph if no photo loads
  image?: string; // bundled Commons photo (assets/catalog-images) — offline fallback
  imageLevel?: 'item' | 'category';
  imageUrl?: string; // hotlinked Unsplash CDN photo (preferred when online)
  imageSource?: 'unsplash';
  credit?: ImageCredit; // photographer attribution — render as 'Photo by {name} on Unsplash'
  downloadLocation?: string; // Unsplash API: ping this URL when the user actually uses the photo
}

export interface CatalogCategory { name: string; image?: string; imageUrl?: string; credit?: ImageCredit; items: CatalogItem[] }

export interface CatalogShopType { shopType: string; icon: string; categories: CatalogCategory[] }

/**
 * Master quick-add catalog: ready-made product lists per shop type.
 * Photos: Unsplash (hotlinked, credited) preferred; Wikimedia Commons
 * bundled photos as offline fallback. Prices are starting estimates.
 */
export const MASTER_CATALOG: CatalogShopType[] = [
 {
  "shopType": "Kiryana & General Store",
  "icon": "🏪",
  "categories": [
   {
    "name": "Atta, Rice & Grains",
    "items": [
     {
      "name": "Wheat Flour (Atta) 10kg Bag",
      "unit": "packet",
      "price": 1350,
      "icon": "🌾",
      "nameUrdu": "آٹا",
      "image": "assets/catalog-images/wheat-flour-bag-424504.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1704972269889-f0fdd7f0e7c3?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmljZSUyMGZsb3VyJTIwZ3JhaW4lMjBzYWNrcyUyMG1hcmtldHxlbnwxfHx8fDE3OTIyNTU0OTJ8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Nathan Cima",
       "profileUrl": "https://unsplash.com/@nathan_cima",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-baskets-filled-with-white-rice-n2sy8zlngYo",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/n2sy8zlngYo/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmljZSUyMGZsb3VyJTIwZ3JhaW4lMjBzYWNrcyUyMG1hcmtldHxlbnwxfHx8fDE3OTIyNTU0OTJ8MA"
     },
     {
      "name": "Wheat Flour (Atta) 20kg Bag",
      "unit": "packet",
      "price": 2650,
      "icon": "🌾",
      "nameUrdu": "آٹا",
      "image": "assets/catalog-images/wheat-flour-bag-424504.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1704972269889-f0fdd7f0e7c3?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmljZSUyMGZsb3VyJTIwZ3JhaW4lMjBzYWNrcyUyMG1hcmtldHxlbnwxfHx8fDE3OTIyNTU0OTJ8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Nathan Cima",
       "profileUrl": "https://unsplash.com/@nathan_cima",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-baskets-filled-with-white-rice-n2sy8zlngYo",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/n2sy8zlngYo/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmljZSUyMGZsb3VyJTIwZ3JhaW4lMjBzYWNrcyUyMG1hcmtldHxlbnwxfHx8fDE3OTIyNTU0OTJ8MA"
     },
     {
      "name": "Super Kernel Basmati Rice 1kg",
      "unit": "packet",
      "price": 420,
      "icon": "🍚",
      "nameUrdu": "چاول",
      "imageUrl": "https://images.unsplash.com/photo-1704972269889-f0fdd7f0e7c3?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmljZSUyMGZsb3VyJTIwZ3JhaW4lMjBzYWNrcyUyMG1hcmtldHxlbnwxfHx8fDE3OTIyNTU0OTJ8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Nathan Cima",
       "profileUrl": "https://unsplash.com/@nathan_cima",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-baskets-filled-with-white-rice-n2sy8zlngYo",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/n2sy8zlngYo/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmljZSUyMGZsb3VyJTIwZ3JhaW4lMjBzYWNrcyUyMG1hcmtldHxlbnwxfHx8fDE3OTIyNTU0OTJ8MA"
     },
     {
      "name": "Super Kernel Basmati Rice 5kg",
      "unit": "packet",
      "price": 2050,
      "icon": "🍚",
      "nameUrdu": "چاول",
      "imageUrl": "https://images.unsplash.com/photo-1704972269889-f0fdd7f0e7c3?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmljZSUyMGZsb3VyJTIwZ3JhaW4lMjBzYWNrcyUyMG1hcmtldHxlbnwxfHx8fDE3OTIyNTU0OTJ8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Nathan Cima",
       "profileUrl": "https://unsplash.com/@nathan_cima",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-baskets-filled-with-white-rice-n2sy8zlngYo",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/n2sy8zlngYo/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmljZSUyMGZsb3VyJTIwZ3JhaW4lMjBzYWNrcyUyMG1hcmtldHxlbnwxfHx8fDE3OTIyNTU0OTJ8MA"
     },
     {
      "name": "Irri-6 Coarse Rice 1kg",
      "unit": "kg",
      "price": 260,
      "icon": "🍚",
      "nameUrdu": "چاول",
      "imageUrl": "https://images.unsplash.com/photo-1704972269889-f0fdd7f0e7c3?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmljZSUyMGZsb3VyJTIwZ3JhaW4lMjBzYWNrcyUyMG1hcmtldHxlbnwxfHx8fDE3OTIyNTU0OTJ8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Nathan Cima",
       "profileUrl": "https://unsplash.com/@nathan_cima",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-baskets-filled-with-white-rice-n2sy8zlngYo",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/n2sy8zlngYo/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmljZSUyMGZsb3VyJTIwZ3JhaW4lMjBzYWNrcyUyMG1hcmtldHxlbnwxfHx8fDE3OTIyNTU0OTJ8MA"
     },
     {
      "name": "Sella Basmati Rice 1kg",
      "unit": "kg",
      "price": 480,
      "icon": "🍚",
      "nameUrdu": "چاول",
      "image": "assets/catalog-images/sella-basmati-rice-8a7477.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1704972269889-f0fdd7f0e7c3?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmljZSUyMGZsb3VyJTIwZ3JhaW4lMjBzYWNrcyUyMG1hcmtldHxlbnwxfHx8fDE3OTIyNTU0OTJ8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Nathan Cima",
       "profileUrl": "https://unsplash.com/@nathan_cima",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-baskets-filled-with-white-rice-n2sy8zlngYo",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/n2sy8zlngYo/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmljZSUyMGZsb3VyJTIwZ3JhaW4lMjBzYWNrcyUyMG1hcmtldHxlbnwxfHx8fDE3OTIyNTU0OTJ8MA"
     },
     {
      "name": "Broken Rice (Tota) 1kg",
      "unit": "kg",
      "price": 230,
      "icon": "🍚",
      "nameUrdu": "ٹوٹا چاول",
      "image": "assets/catalog-images/broken-rice-846bf7.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1704972269889-f0fdd7f0e7c3?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmljZSUyMGZsb3VyJTIwZ3JhaW4lMjBzYWNrcyUyMG1hcmtldHxlbnwxfHx8fDE3OTIyNTU0OTJ8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Nathan Cima",
       "profileUrl": "https://unsplash.com/@nathan_cima",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-baskets-filled-with-white-rice-n2sy8zlngYo",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/n2sy8zlngYo/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmljZSUyMGZsb3VyJTIwZ3JhaW4lMjBzYWNrcyUyMG1hcmtldHxlbnwxfHx8fDE3OTIyNTU0OTJ8MA"
     },
     {
      "name": "Corn Flour (Makai Atta) 1kg",
      "unit": "packet",
      "price": 260,
      "icon": "🌽",
      "nameUrdu": "مکئی کا آٹا",
      "image": "assets/catalog-images/corn-flour-3e1488.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1704972269889-f0fdd7f0e7c3?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmljZSUyMGZsb3VyJTIwZ3JhaW4lMjBzYWNrcyUyMG1hcmtldHxlbnwxfHx8fDE3OTIyNTU0OTJ8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Nathan Cima",
       "profileUrl": "https://unsplash.com/@nathan_cima",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-baskets-filled-with-white-rice-n2sy8zlngYo",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/n2sy8zlngYo/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmljZSUyMGZsb3VyJTIwZ3JhaW4lMjBzYWNrcyUyMG1hcmtldHxlbnwxfHx8fDE3OTIyNTU0OTJ8MA"
     },
     {
      "name": "Barley Flour (Jau Atta) 1kg",
      "unit": "packet",
      "price": 300,
      "icon": "🌾",
      "nameUrdu": "جو کا آٹا",
      "image": "assets/catalog-images/barley-flour-a20e8d.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1704972269889-f0fdd7f0e7c3?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmljZSUyMGZsb3VyJTIwZ3JhaW4lMjBzYWNrcyUyMG1hcmtldHxlbnwxfHx8fDE3OTIyNTU0OTJ8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Nathan Cima",
       "profileUrl": "https://unsplash.com/@nathan_cima",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-baskets-filled-with-white-rice-n2sy8zlngYo",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/n2sy8zlngYo/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmljZSUyMGZsb3VyJTIwZ3JhaW4lMjBzYWNrcyUyMG1hcmtldHxlbnwxfHx8fDE3OTIyNTU0OTJ8MA"
     },
     {
      "name": "Gram Flour (Besan) 1kg",
      "unit": "packet",
      "price": 480,
      "icon": "🫘",
      "nameUrdu": "بیسن",
      "image": "assets/catalog-images/gram-flour-a31242.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1704972269889-f0fdd7f0e7c3?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmljZSUyMGZsb3VyJTIwZ3JhaW4lMjBzYWNrcyUyMG1hcmtldHxlbnwxfHx8fDE3OTIyNTU0OTJ8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Nathan Cima",
       "profileUrl": "https://unsplash.com/@nathan_cima",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-baskets-filled-with-white-rice-n2sy8zlngYo",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/n2sy8zlngYo/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmljZSUyMGZsb3VyJTIwZ3JhaW4lMjBzYWNrcyUyMG1hcmtldHxlbnwxfHx8fDE3OTIyNTU0OTJ8MA"
     },
     {
      "name": "Maize (Makai) Grains 1kg",
      "unit": "kg",
      "price": 240,
      "icon": "🌽",
      "nameUrdu": "مکئی",
      "image": "assets/catalog-images/maize-grains-d5d4cb.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1704972269889-f0fdd7f0e7c3?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmljZSUyMGZsb3VyJTIwZ3JhaW4lMjBzYWNrcyUyMG1hcmtldHxlbnwxfHx8fDE3OTIyNTU0OTJ8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Nathan Cima",
       "profileUrl": "https://unsplash.com/@nathan_cima",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-baskets-filled-with-white-rice-n2sy8zlngYo",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/n2sy8zlngYo/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmljZSUyMGZsb3VyJTIwZ3JhaW4lMjBzYWNrcyUyMG1hcmtldHxlbnwxfHx8fDE3OTIyNTU0OTJ8MA"
     },
     {
      "name": "Rice Flour 1kg",
      "unit": "packet",
      "price": 300,
      "icon": "🍚",
      "nameUrdu": "چاول کا آٹا",
      "image": "assets/catalog-images/rice-flour-930b27.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1704972269889-f0fdd7f0e7c3?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmljZSUyMGZsb3VyJTIwZ3JhaW4lMjBzYWNrcyUyMG1hcmtldHxlbnwxfHx8fDE3OTIyNTU0OTJ8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Nathan Cima",
       "profileUrl": "https://unsplash.com/@nathan_cima",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-baskets-filled-with-white-rice-n2sy8zlngYo",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/n2sy8zlngYo/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmljZSUyMGZsb3VyJTIwZ3JhaW4lMjBzYWNrcyUyMG1hcmtldHxlbnwxfHx8fDE3OTIyNTU0OTJ8MA"
     }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1704972269889-f0fdd7f0e7c3?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmljZSUyMGZsb3VyJTIwZ3JhaW4lMjBzYWNrcyUyMG1hcmtldHxlbnwxfHx8fDE3OTIyNTU0OTJ8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Nathan Cima",
     "profileUrl": "https://unsplash.com/@nathan_cima",
     "photoUrl": "https://unsplash.com/photos/a-bunch-of-baskets-filled-with-white-rice-n2sy8zlngYo",
     "source": "Unsplash"
    }
   },
   {
    "name": "Dal & Pulses",
    "items": [
     {
      "name": "Masoor Dal (Red Lentils) 1kg",
      "unit": "kg",
      "price": 330,
      "icon": "🫘",
      "nameUrdu": "مسور کی دال",
      "image": "assets/catalog-images/masoor-dal-01f7c8.webp",
      "imageLevel": "item"
     },
     {
      "name": "Moong Dal (Yellow) 1kg",
      "unit": "kg",
      "price": 420,
      "icon": "🫘",
      "nameUrdu": "مونگ کی دال",
      "imageUrl": "https://images.unsplash.com/photo-1612869538502-b5baa439abd7?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Chandan Chaurasia",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/yellow-and-brown-beans-on-brown-wooden-table-J5KMugvdP44",
       "source": "Unsplash"
      }
     },
     {
      "name": "Chana Dal 1kg",
      "unit": "kg",
      "price": 380,
      "icon": "🫘",
      "nameUrdu": "چنے کی دال",
      "imageUrl": "https://images.unsplash.com/photo-1780478238047-13e4e6c07cba?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Mrs Chimpanzeee",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/yellow-split-peas-and-chickpeas-side-by-side-2nEDE_zt7rg",
       "source": "Unsplash"
      }
     },
     {
      "name": "Whole Black Gram (Kala Chana) 1kg",
      "unit": "kg",
      "price": 340,
      "icon": "🫘",
      "nameUrdu": "کالا چنا",
      "image": "assets/catalog-images/dal-pulses-39dfae.webp",
      "imageLevel": "category"
     },
     {
      "name": "White Chickpeas (Safed Chana) 1kg",
      "unit": "kg",
      "price": 380,
      "icon": "🫘",
      "nameUrdu": "سفید چنا",
      "image": "assets/catalog-images/white-chickpeas-bda9c1.webp",
      "imageLevel": "item"
     },
     {
      "name": "Mash Dal (White Urad) 1kg",
      "unit": "kg",
      "price": 460,
      "icon": "🫘",
      "nameUrdu": "ماش کی دال",
      "image": "assets/catalog-images/mash-dal-655d1a.webp",
      "imageLevel": "item"
     },
     {
      "name": "Arhar/Tur Dal 1kg",
      "unit": "kg",
      "price": 450,
      "icon": "🫘",
      "nameUrdu": "ارہر کی دال",
      "imageUrl": "https://images.unsplash.com/photo-1612869538502-b5baa439abd7?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Chandan Chaurasia",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/yellow-and-brown-beans-on-brown-wooden-table-J5KMugvdP44",
       "source": "Unsplash"
      }
     },
     {
      "name": "Mix Dal (Panchrangi) 1kg",
      "unit": "kg",
      "price": 420,
      "icon": "🫘",
      "nameUrdu": "مکس دال",
      "imageUrl": "https://images.unsplash.com/photo-1763368403529-0b8d9108cf9c?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/bowls-of-assorted-dried-beans-and-legumes-okSEa77XTS4",
       "source": "Unsplash"
      }
     },
     {
      "name": "Whole Masoor (Sabut) 1kg",
      "unit": "kg",
      "price": 350,
      "icon": "🫘",
      "nameUrdu": "ثابت مسور",
      "image": "assets/catalog-images/dal-pulses-39dfae.webp",
      "imageLevel": "category"
     },
     {
      "name": "Green Moong (Sabut) 1kg",
      "unit": "kg",
      "price": 440,
      "icon": "🫘",
      "nameUrdu": "ثابت مونگ",
      "image": "assets/catalog-images/green-moong-df7775.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/dal-pulses-39dfae.webp"
   },
   {
    "name": "Ghee & Cooking Oils",
    "items": [
     {
      "name": "Dalda Banaspati Ghee 5kg Tin",
      "unit": "packet",
      "price": 2650,
      "icon": "🫗",
      "nameUrdu": "بناسپتی گھی",
      "image": "assets/catalog-images/ghee-cooking-oils-938100.webp",
      "imageLevel": "category"
     },
     {
      "name": "Dalda Banaspati Ghee 2.5kg",
      "unit": "packet",
      "price": 1350,
      "icon": "🫗",
      "nameUrdu": "بناسپتی گھی",
      "image": "assets/catalog-images/ghee-cooking-oils-938100.webp",
      "imageLevel": "category"
     },
     {
      "name": "Canola Cooking Oil 1 Litre",
      "unit": "litre",
      "price": 520,
      "icon": "🫗",
      "nameUrdu": "کھانے کا تیل",
      "image": "assets/catalog-images/canola-cooking-oil-f8ae6a.webp",
      "imageLevel": "item"
     },
     {
      "name": "Canola Cooking Oil 5 Litre",
      "unit": "packet",
      "price": 2550,
      "icon": "🫗",
      "nameUrdu": "کھانے کا تیل",
      "image": "assets/catalog-images/canola-cooking-oil-f8ae6a.webp",
      "imageLevel": "item"
     },
     {
      "name": "Sunflower Oil 1 Litre",
      "unit": "litre",
      "price": 560,
      "icon": "🌻",
      "nameUrdu": "سورج مکھی کا تیل",
      "image": "assets/catalog-images/sunflower-oil-43d621.webp",
      "imageLevel": "item"
     },
     {
      "name": "Mustard Oil (Sarson) 1 Litre",
      "unit": "litre",
      "price": 480,
      "icon": "🫗",
      "nameUrdu": "سرسوں کا تیل",
      "image": "assets/catalog-images/mustard-oil-cb0741.webp",
      "imageLevel": "item"
     },
     {
      "name": "Olive Oil 500ml",
      "unit": "piece",
      "price": 1450,
      "icon": "🫒",
      "nameUrdu": "زیتون کا تیل",
      "imageUrl": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Roberta Sorge",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/clear-glass-cruet-bottle-uOBApnN_K7w",
       "source": "Unsplash"
      }
     },
     {
      "name": "Desi Ghee 1kg",
      "unit": "kg",
      "price": 2200,
      "icon": "🧈",
      "nameUrdu": "دیسی گھی",
      "image": "assets/catalog-images/desi-ghee-0c2de9.webp",
      "imageLevel": "item"
     },
     {
      "name": "Fortified Cooking Oil 1 Litre",
      "unit": "litre",
      "price": 540,
      "icon": "🫗",
      "nameUrdu": "کھانے کا تیل",
      "imageUrl": "https://images.unsplash.com/photo-1552592074-ea7a91b851b3?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "jonathan ocampo",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/oil-dispenser-bottle-iCgfwfqgdzo",
       "source": "Unsplash"
      }
     },
     {
      "name": "Cooking Oil 250ml Pouch",
      "unit": "packet",
      "price": 150,
      "icon": "🫗",
      "nameUrdu": "کھانے کا تیل",
      "imageUrl": "https://images.unsplash.com/photo-1552592074-ea7a91b851b3?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "jonathan ocampo",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/oil-dispenser-bottle-iCgfwfqgdzo",
       "source": "Unsplash"
      }
     }
    ],
    "image": "assets/catalog-images/ghee-cooking-oils-938100.webp"
   },
   {
    "name": "Sugar, Salt & Sweeteners",
    "items": [
     {
      "name": "Sugar 1kg",
      "unit": "packet",
      "price": 175,
      "icon": "🧂",
      "nameUrdu": "چینی",
      "image": "assets/catalog-images/sugar-f0dc7a.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1610219171722-87b3f4170557?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c3VnYXIlMjBhbmQlMjBzYWx0JTIwYm93bHN8ZW58MXx8fHwxNzkyMjU1NDkzfDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Mathilde Langevin",
       "profileUrl": "https://unsplash.com/@mathildelangevin",
       "photoUrl": "https://unsplash.com/photos/white-ceramic-mugs-on-white-table-Q5xjxSfs1Lk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/Q5xjxSfs1Lk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c3VnYXIlMjBhbmQlMjBzYWx0JTIwYm93bHN8ZW58MXx8fHwxNzkyMjU1NDkzfDA"
     },
     {
      "name": "Sugar 5kg",
      "unit": "packet",
      "price": 860,
      "icon": "🧂",
      "nameUrdu": "چینی",
      "image": "assets/catalog-images/sugar-f0dc7a.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1610219171722-87b3f4170557?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c3VnYXIlMjBhbmQlMjBzYWx0JTIwYm93bHN8ZW58MXx8fHwxNzkyMjU1NDkzfDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Mathilde Langevin",
       "profileUrl": "https://unsplash.com/@mathildelangevin",
       "photoUrl": "https://unsplash.com/photos/white-ceramic-mugs-on-white-table-Q5xjxSfs1Lk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/Q5xjxSfs1Lk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c3VnYXIlMjBhbmQlMjBzYWx0JTIwYm93bHN8ZW58MXx8fHwxNzkyMjU1NDkzfDA"
     },
     {
      "name": "Iodized Salt 800g",
      "unit": "packet",
      "price": 120,
      "icon": "🧂",
      "nameUrdu": "نمک",
      "imageUrl": "https://images.unsplash.com/photo-1610219171722-87b3f4170557?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c3VnYXIlMjBhbmQlMjBzYWx0JTIwYm93bHN8ZW58MXx8fHwxNzkyMjU1NDkzfDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Mathilde Langevin",
       "profileUrl": "https://unsplash.com/@mathildelangevin",
       "photoUrl": "https://unsplash.com/photos/white-ceramic-mugs-on-white-table-Q5xjxSfs1Lk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/Q5xjxSfs1Lk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c3VnYXIlMjBhbmQlMjBzYWx0JTIwYm93bHN8ZW58MXx8fHwxNzkyMjU1NDkzfDA"
     },
     {
      "name": "Rock Salt (Kala Namak) 200g",
      "unit": "packet",
      "price": 90,
      "icon": "🧂",
      "nameUrdu": "کالا نمک",
      "imageUrl": "https://images.unsplash.com/photo-1610219171722-87b3f4170557?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c3VnYXIlMjBhbmQlMjBzYWx0JTIwYm93bHN8ZW58MXx8fHwxNzkyMjU1NDkzfDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Mathilde Langevin",
       "profileUrl": "https://unsplash.com/@mathildelangevin",
       "photoUrl": "https://unsplash.com/photos/white-ceramic-mugs-on-white-table-Q5xjxSfs1Lk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/Q5xjxSfs1Lk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c3VnYXIlMjBhbmQlMjBzYWx0JTIwYm93bHN8ZW58MXx8fHwxNzkyMjU1NDkzfDA"
     },
     {
      "name": "Pink Himalayan Salt 500g",
      "unit": "packet",
      "price": 260,
      "icon": "🧂",
      "nameUrdu": "پہاڑی نمک",
      "imageUrl": "https://images.unsplash.com/photo-1610219171722-87b3f4170557?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c3VnYXIlMjBhbmQlMjBzYWx0JTIwYm93bHN8ZW58MXx8fHwxNzkyMjU1NDkzfDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Mathilde Langevin",
       "profileUrl": "https://unsplash.com/@mathildelangevin",
       "photoUrl": "https://unsplash.com/photos/white-ceramic-mugs-on-white-table-Q5xjxSfs1Lk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/Q5xjxSfs1Lk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c3VnYXIlMjBhbmQlMjBzYWx0JTIwYm93bHN8ZW58MXx8fHwxNzkyMjU1NDkzfDA"
     },
     {
      "name": "Brown Sugar (Shakkar) 1kg",
      "unit": "kg",
      "price": 260,
      "icon": "🟤",
      "nameUrdu": "شکر",
      "image": "assets/catalog-images/brown-sugar-911cc6.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1610219171722-87b3f4170557?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c3VnYXIlMjBhbmQlMjBzYWx0JTIwYm93bHN8ZW58MXx8fHwxNzkyMjU1NDkzfDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Mathilde Langevin",
       "profileUrl": "https://unsplash.com/@mathildelangevin",
       "photoUrl": "https://unsplash.com/photos/white-ceramic-mugs-on-white-table-Q5xjxSfs1Lk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/Q5xjxSfs1Lk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c3VnYXIlMjBhbmQlMjBzYWx0JTIwYm93bHN8ZW58MXx8fHwxNzkyMjU1NDkzfDA"
     },
     {
      "name": "Gur (Jaggery) 1kg",
      "unit": "kg",
      "price": 320,
      "icon": "🟫",
      "nameUrdu": "گڑ",
      "image": "assets/catalog-images/gur-bee4eb.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1610219171722-87b3f4170557?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c3VnYXIlMjBhbmQlMjBzYWx0JTIwYm93bHN8ZW58MXx8fHwxNzkyMjU1NDkzfDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Mathilde Langevin",
       "profileUrl": "https://unsplash.com/@mathildelangevin",
       "photoUrl": "https://unsplash.com/photos/white-ceramic-mugs-on-white-table-Q5xjxSfs1Lk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/Q5xjxSfs1Lk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c3VnYXIlMjBhbmQlMjBzYWx0JTIwYm93bHN8ZW58MXx8fHwxNzkyMjU1NDkzfDA"
     },
     {
      "name": "Honey 250g",
      "unit": "piece",
      "price": 850,
      "icon": "🍯",
      "nameUrdu": "شہد",
      "image": "assets/catalog-images/honey-250g-b45dc0.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1610219171722-87b3f4170557?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c3VnYXIlMjBhbmQlMjBzYWx0JTIwYm93bHN8ZW58MXx8fHwxNzkyMjU1NDkzfDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Mathilde Langevin",
       "profileUrl": "https://unsplash.com/@mathildelangevin",
       "photoUrl": "https://unsplash.com/photos/white-ceramic-mugs-on-white-table-Q5xjxSfs1Lk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/Q5xjxSfs1Lk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c3VnYXIlMjBhbmQlMjBzYWx0JTIwYm93bHN8ZW58MXx8fHwxNzkyMjU1NDkzfDA"
     }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1610219171722-87b3f4170557?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c3VnYXIlMjBhbmQlMjBzYWx0JTIwYm93bHN8ZW58MXx8fHwxNzkyMjU1NDkzfDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Mathilde Langevin",
     "profileUrl": "https://unsplash.com/@mathildelangevin",
     "photoUrl": "https://unsplash.com/photos/white-ceramic-mugs-on-white-table-Q5xjxSfs1Lk",
     "source": "Unsplash"
    }
   },
   {
    "name": "Tea & Beverages",
    "items": [
     {
      "name": "Tapal Danedar Tea 475g",
      "unit": "packet",
      "price": 1150,
      "icon": "🍵",
      "nameUrdu": "چائے",
      "imageUrl": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "ABHISHEK HAJARE",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/orange-juice-in-clear-drinking-glass-kkrXVKK-jhg",
       "source": "Unsplash"
      }
     },
     {
      "name": "Tapal Danedar Tea 190g",
      "unit": "packet",
      "price": 480,
      "icon": "🍵",
      "nameUrdu": "چائے"
     },
     {
      "name": "Lipton Yellow Label 475g",
      "unit": "packet",
      "price": 1180,
      "icon": "🍵",
      "nameUrdu": "چائے"
     },
     {
      "name": "Supreme Tea 475g",
      "unit": "packet",
      "price": 1080,
      "icon": "🍵",
      "nameUrdu": "چائے"
     },
     {
      "name": "Vital Tea 450g",
      "unit": "packet",
      "price": 1050,
      "icon": "🍵",
      "nameUrdu": "چائے"
     },
     {
      "name": "Tetley Tea Bags 100ct",
      "unit": "box",
      "price": 950,
      "icon": "🍵",
      "nameUrdu": "چائے"
     },
     {
      "name": "Green Tea (Kahwa) 250g",
      "unit": "packet",
      "price": 650,
      "icon": "🍃",
      "nameUrdu": "کہوہ",
      "image": "assets/catalog-images/green-tea-250g-da6245.webp",
      "imageLevel": "item"
     },
     {
      "name": "Milk Powder 1kg (Nido)",
      "unit": "packet",
      "price": 2450,
      "icon": "🥛",
      "nameUrdu": "دودھ",
      "image": "assets/catalog-images/milk-powder-d52eae.webp",
      "imageLevel": "item"
     },
     {
      "name": "Milk Powder 400g",
      "unit": "packet",
      "price": 1050,
      "icon": "🥛",
      "nameUrdu": "دودھ"
     },
     {
      "name": "Rooh Afza 800ml",
      "unit": "piece",
      "price": 520,
      "icon": "🥤",
      "nameUrdu": "روح افزا",
      "image": "assets/catalog-images/rooh-afza-419e12.webp",
      "imageLevel": "item"
     },
     {
      "name": "Rooh Afza 1500ml",
      "unit": "piece",
      "price": 890,
      "icon": "🥤",
      "nameUrdu": "روح افزا",
      "image": "assets/catalog-images/rooh-afza-419e12.webp",
      "imageLevel": "item"
     },
     {
      "name": "Tang Orange 1kg",
      "unit": "packet",
      "price": 1150,
      "icon": "🍊",
      "nameUrdu": "ٹینگ",
      "imageUrl": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "ABHISHEK HAJARE",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/orange-juice-in-clear-drinking-glass-kkrXVKK-jhg",
       "source": "Unsplash"
      }
     }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "ABHISHEK HAJARE",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/orange-juice-in-clear-drinking-glass-kkrXVKK-jhg",
     "source": "Unsplash"
    }
   },
   {
    "name": "Spices & Masalas",
    "items": [
     {
      "name": "Red Chilli Powder 200g",
      "unit": "packet",
      "price": 420,
      "icon": "🌶️",
      "nameUrdu": "لال مرچ",
      "image": "assets/catalog-images/spices-masalas-4d805d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1716816211590-c15a328a5ff0?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Anju Ravindranath",
       "profileUrl": "https://unsplash.com/@anjurnath",
       "photoUrl": "https://unsplash.com/photos/a-table-topped-with-different-types-of-spices-Nihdo084Yos",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/Nihdo084Yos/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA",
      "imageSource": "unsplash"
     },
     {
      "name": "Whole Red Chillies 250g",
      "unit": "packet",
      "price": 380,
      "icon": "🌶️",
      "nameUrdu": "ثابت لال مرچ",
      "image": "assets/catalog-images/spices-masalas-4d805d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1716816211590-c15a328a5ff0?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Anju Ravindranath",
       "profileUrl": "https://unsplash.com/@anjurnath",
       "photoUrl": "https://unsplash.com/photos/a-table-topped-with-different-types-of-spices-Nihdo084Yos",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/Nihdo084Yos/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA",
      "imageSource": "unsplash"
     },
     {
      "name": "Turmeric Powder (Haldi) 200g",
      "unit": "packet",
      "price": 320,
      "icon": "🟡",
      "nameUrdu": "ہلدی",
      "image": "assets/catalog-images/turmeric-powder-200g-d0e766.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1716816211590-c15a328a5ff0?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Anju Ravindranath",
       "profileUrl": "https://unsplash.com/@anjurnath",
       "photoUrl": "https://unsplash.com/photos/a-table-topped-with-different-types-of-spices-Nihdo084Yos",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/Nihdo084Yos/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA"
     },
     {
      "name": "Coriander Powder (Dhania) 200g",
      "unit": "packet",
      "price": 380,
      "icon": "🌿",
      "nameUrdu": "دھنیا",
      "image": "assets/catalog-images/coriander-powder-200g-5fb064.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1591272216626-b09e38519371?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Z3JvdW5kJTIwc3BpY2UlMjBwb3dkZXIlMjBib3dsfGVufDF8fHx8MTc5MjI1NTUxN3ww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Merve Sehirli Nasir",
       "profileUrl": "https://unsplash.com/@32steps",
       "photoUrl": "https://unsplash.com/photos/assorted-spices-in-clear-glass-containers-dSbUXPQ8Sm8",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/dSbUXPQ8Sm8/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Z3JvdW5kJTIwc3BpY2UlMjBwb3dkZXIlMjBib3dsfGVufDF8fHx8MTc5MjI1NTUxN3ww",
      "imageSource": "unsplash"
     },
     {
      "name": "Cumin Seeds (Zeera) 100g",
      "unit": "packet",
      "price": 420,
      "icon": "🌱",
      "nameUrdu": "زیرہ",
      "image": "assets/catalog-images/spices-masalas-4d805d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1716816211590-c15a328a5ff0?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Anju Ravindranath",
       "profileUrl": "https://unsplash.com/@anjurnath",
       "photoUrl": "https://unsplash.com/photos/a-table-topped-with-different-types-of-spices-Nihdo084Yos",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/Nihdo084Yos/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA",
      "imageSource": "unsplash"
     },
     {
      "name": "Black Pepper (Kali Mirch) 100g",
      "unit": "packet",
      "price": 550,
      "icon": "⚫",
      "nameUrdu": "کالی مرچ",
      "image": "assets/catalog-images/black-pepper-100g-47488d.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1716816211590-c15a328a5ff0?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Anju Ravindranath",
       "profileUrl": "https://unsplash.com/@anjurnath",
       "photoUrl": "https://unsplash.com/photos/a-table-topped-with-different-types-of-spices-Nihdo084Yos",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/Nihdo084Yos/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA"
     },
     {
      "name": "Garam Masala 100g",
      "unit": "packet",
      "price": 380,
      "icon": "🧂",
      "nameUrdu": "گرم مصالحہ",
      "image": "assets/catalog-images/spices-masalas-4d805d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1716816211590-c15a328a5ff0?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Anju Ravindranath",
       "profileUrl": "https://unsplash.com/@anjurnath",
       "photoUrl": "https://unsplash.com/photos/a-table-topped-with-different-types-of-spices-Nihdo084Yos",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/Nihdo084Yos/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA",
      "imageSource": "unsplash"
     },
     {
      "name": "Chicken Masala 50g",
      "unit": "packet",
      "price": 130,
      "icon": "🍗",
      "nameUrdu": "چکن مصالحہ",
      "image": "assets/catalog-images/spices-masalas-4d805d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1716816211590-c15a328a5ff0?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Anju Ravindranath",
       "profileUrl": "https://unsplash.com/@anjurnath",
       "photoUrl": "https://unsplash.com/photos/a-table-topped-with-different-types-of-spices-Nihdo084Yos",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/Nihdo084Yos/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA",
      "imageSource": "unsplash"
     },
     {
      "name": "Biryani Masala 50g",
      "unit": "packet",
      "price": 130,
      "icon": "🍚",
      "nameUrdu": "بریانی مصالحہ",
      "image": "assets/catalog-images/spices-masalas-4d805d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1716816211590-c15a328a5ff0?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Anju Ravindranath",
       "profileUrl": "https://unsplash.com/@anjurnath",
       "photoUrl": "https://unsplash.com/photos/a-table-topped-with-different-types-of-spices-Nihdo084Yos",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/Nihdo084Yos/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA",
      "imageSource": "unsplash"
     },
     {
      "name": "Qorma Masala 50g",
      "unit": "packet",
      "price": 130,
      "icon": "🍲",
      "nameUrdu": "قورمہ مصالحہ",
      "image": "assets/catalog-images/spices-masalas-4d805d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1716816211590-c15a328a5ff0?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Anju Ravindranath",
       "profileUrl": "https://unsplash.com/@anjurnath",
       "photoUrl": "https://unsplash.com/photos/a-table-topped-with-different-types-of-spices-Nihdo084Yos",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/Nihdo084Yos/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA",
      "imageSource": "unsplash"
     },
     {
      "name": "Karahi Masala 50g",
      "unit": "packet",
      "price": 130,
      "icon": "🥘",
      "nameUrdu": "کڑاہی مصالحہ",
      "image": "assets/catalog-images/spices-masalas-4d805d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1716816211590-c15a328a5ff0?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Anju Ravindranath",
       "profileUrl": "https://unsplash.com/@anjurnath",
       "photoUrl": "https://unsplash.com/photos/a-table-topped-with-different-types-of-spices-Nihdo084Yos",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/Nihdo084Yos/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA",
      "imageSource": "unsplash"
     },
     {
      "name": "Chaat Masala 100g",
      "unit": "packet",
      "price": 220,
      "icon": "🧂",
      "nameUrdu": "چاٹ مصالحہ",
      "image": "assets/catalog-images/spices-masalas-4d805d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1716816211590-c15a328a5ff0?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Anju Ravindranath",
       "profileUrl": "https://unsplash.com/@anjurnath",
       "photoUrl": "https://unsplash.com/photos/a-table-topped-with-different-types-of-spices-Nihdo084Yos",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/Nihdo084Yos/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA",
      "imageSource": "unsplash"
     },
     {
      "name": "Whole Garam Masala Mix 100g",
      "unit": "packet",
      "price": 350,
      "icon": "🧂",
      "nameUrdu": "ثابت گرم مصالحہ",
      "image": "assets/catalog-images/whole-garam-masala-mix-1ba19e.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1716816211590-c15a328a5ff0?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Anju Ravindranath",
       "profileUrl": "https://unsplash.com/@anjurnath",
       "photoUrl": "https://unsplash.com/photos/a-table-topped-with-different-types-of-spices-Nihdo084Yos",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/Nihdo084Yos/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA"
     },
     {
      "name": "Green Cardamom (Elaichi) 50g",
      "unit": "packet",
      "price": 650,
      "icon": "💚",
      "nameUrdu": "الائچی",
      "image": "assets/catalog-images/spices-masalas-4d805d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1716816211590-c15a328a5ff0?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Anju Ravindranath",
       "profileUrl": "https://unsplash.com/@anjurnath",
       "photoUrl": "https://unsplash.com/photos/a-table-topped-with-different-types-of-spices-Nihdo084Yos",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/Nihdo084Yos/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA",
      "imageSource": "unsplash"
     },
     {
      "name": "Cloves (Laung) 50g",
      "unit": "packet",
      "price": 450,
      "icon": "🧂",
      "nameUrdu": "لونگ",
      "image": "assets/catalog-images/spices-masalas-4d805d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1716816211590-c15a328a5ff0?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Anju Ravindranath",
       "profileUrl": "https://unsplash.com/@anjurnath",
       "photoUrl": "https://unsplash.com/photos/a-table-topped-with-different-types-of-spices-Nihdo084Yos",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/Nihdo084Yos/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA",
      "imageSource": "unsplash"
     },
     {
      "name": "Cinnamon (Darcheeni) 100g",
      "unit": "packet",
      "price": 320,
      "icon": "🟤",
      "nameUrdu": "دار چینی",
      "image": "assets/catalog-images/cinnamon-100g-8dc9b1.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1716816211590-c15a328a5ff0?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Anju Ravindranath",
       "profileUrl": "https://unsplash.com/@anjurnath",
       "photoUrl": "https://unsplash.com/photos/a-table-topped-with-different-types-of-spices-Nihdo084Yos",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/Nihdo084Yos/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA"
     },
     {
      "name": "Fennel Seeds (Saunf) 100g",
      "unit": "packet",
      "price": 280,
      "icon": "🌱",
      "nameUrdu": "سونف",
      "image": "assets/catalog-images/spices-masalas-4d805d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1716816211590-c15a328a5ff0?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Anju Ravindranath",
       "profileUrl": "https://unsplash.com/@anjurnath",
       "photoUrl": "https://unsplash.com/photos/a-table-topped-with-different-types-of-spices-Nihdo084Yos",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/Nihdo084Yos/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA",
      "imageSource": "unsplash"
     },
     {
      "name": "Mustard Seeds (Rai) 100g",
      "unit": "packet",
      "price": 160,
      "icon": "🟡",
      "nameUrdu": "رائی",
      "image": "assets/catalog-images/spices-masalas-4d805d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1716816211590-c15a328a5ff0?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Anju Ravindranath",
       "profileUrl": "https://unsplash.com/@anjurnath",
       "photoUrl": "https://unsplash.com/photos/a-table-topped-with-different-types-of-spices-Nihdo084Yos",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/Nihdo084Yos/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA",
      "imageSource": "unsplash"
     }
    ],
    "image": "assets/catalog-images/spices-masalas-4d805d.webp",
    "imageUrl": "https://images.unsplash.com/photo-1716816211590-c15a328a5ff0?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8U3BpY2VzJTIwJTIwJTIwTWFzYWxhc3xlbnwxfHx8fDE3OTIyNTU1MzN8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Anju Ravindranath",
     "profileUrl": "https://unsplash.com/@anjurnath",
     "photoUrl": "https://unsplash.com/photos/a-table-topped-with-different-types-of-spices-Nihdo084Yos",
     "source": "Unsplash"
    }
   },
   {
    "name": "Biscuits & Snacks",
    "items": [
     {
      "name": "Sooper Biscuits (EBM)",
      "unit": "packet",
      "price": 120,
      "icon": "🍪",
      "nameUrdu": "بسکٹ",
      "image": "assets/catalog-images/sooper-biscuits-cebd71.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1701341404788-b85484ca379e?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vu Nghi Thai",
       "profileUrl": "https://unsplash.com/@pvnt",
       "photoUrl": "https://unsplash.com/photos/a-wooden-table-topped-with-bowls-of-crackers-x_lxdRtNRfs",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/x_lxdRtNRfs/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA"
     },
     {
      "name": "Marie Biscuits 1 Pack",
      "unit": "packet",
      "price": 110,
      "icon": "🍪",
      "nameUrdu": "بسکٹ",
      "image": "assets/catalog-images/marie-biscuits-a8acdc.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1701341404788-b85484ca379e?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vu Nghi Thai",
       "profileUrl": "https://unsplash.com/@pvnt",
       "photoUrl": "https://unsplash.com/photos/a-wooden-table-topped-with-bowls-of-crackers-x_lxdRtNRfs",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/x_lxdRtNRfs/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA"
     },
     {
      "name": "Candy Biscuits 1 Pack",
      "unit": "packet",
      "price": 100,
      "icon": "🍪",
      "nameUrdu": "بسکٹ",
      "image": "assets/catalog-images/candy-biscuits-45dc8e.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1701341404788-b85484ca379e?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vu Nghi Thai",
       "profileUrl": "https://unsplash.com/@pvnt",
       "photoUrl": "https://unsplash.com/photos/a-wooden-table-topped-with-bowls-of-crackers-x_lxdRtNRfs",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/x_lxdRtNRfs/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA"
     },
     {
      "name": "Gluco Biscuits 1 Pack",
      "unit": "packet",
      "price": 110,
      "icon": "🍪",
      "nameUrdu": "بسکٹ",
      "image": "assets/catalog-images/biscuits-snacks-c9b21d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1522237825450-a0c44eecddb4?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c3RhY2slMjBvZiUyMGJpc2N1aXRzfGVufDF8fHx8MTc5MjI1NTUyMnww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jodie Morgan",
       "profileUrl": "https://unsplash.com/@twoluckyspoons",
       "photoUrl": "https://unsplash.com/photos/shallow-focus-photo-of-breads-PAa_MJztyUY",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/PAa_MJztyUY/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c3RhY2slMjBvZiUyMGJpc2N1aXRzfGVufDF8fHx8MTc5MjI1NTUyMnww",
      "imageSource": "unsplash"
     },
     {
      "name": "Zeera Plus Biscuits",
      "unit": "packet",
      "price": 120,
      "icon": "🍪",
      "nameUrdu": "بسکٹ",
      "image": "assets/catalog-images/biscuits-snacks-c9b21d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1701341404788-b85484ca379e?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vu Nghi Thai",
       "profileUrl": "https://unsplash.com/@pvnt",
       "photoUrl": "https://unsplash.com/photos/a-wooden-table-topped-with-bowls-of-crackers-x_lxdRtNRfs",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/x_lxdRtNRfs/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA",
      "imageSource": "unsplash"
     },
     {
      "name": "Rio Chocolate Biscuits",
      "unit": "packet",
      "price": 130,
      "icon": "🍩",
      "nameUrdu": "بسکٹ",
      "image": "assets/catalog-images/biscuits-snacks-c9b21d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1701341404788-b85484ca379e?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vu Nghi Thai",
       "profileUrl": "https://unsplash.com/@pvnt",
       "photoUrl": "https://unsplash.com/photos/a-wooden-table-topped-with-bowls-of-crackers-x_lxdRtNRfs",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/x_lxdRtNRfs/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA",
      "imageSource": "unsplash"
     },
     {
      "name": "Chocolate Chip Cookies 1 Pack",
      "unit": "packet",
      "price": 160,
      "icon": "🍪",
      "nameUrdu": "بسکٹ",
      "image": "assets/catalog-images/chocolate-chip-cookies-1abeda.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1701341404788-b85484ca379e?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vu Nghi Thai",
       "profileUrl": "https://unsplash.com/@pvnt",
       "photoUrl": "https://unsplash.com/photos/a-wooden-table-topped-with-bowls-of-crackers-x_lxdRtNRfs",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/x_lxdRtNRfs/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA"
     },
     {
      "name": "Lays Chips Salted",
      "unit": "packet",
      "price": 80,
      "icon": "🥔",
      "nameUrdu": "چپس",
      "image": "assets/catalog-images/lays-chips-salted-c8e503.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1701341404788-b85484ca379e?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vu Nghi Thai",
       "profileUrl": "https://unsplash.com/@pvnt",
       "photoUrl": "https://unsplash.com/photos/a-wooden-table-topped-with-bowls-of-crackers-x_lxdRtNRfs",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/x_lxdRtNRfs/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA"
     },
     {
      "name": "Kurkure Masala Munch",
      "unit": "packet",
      "price": 80,
      "icon": "🌶️",
      "nameUrdu": "کرکرے",
      "image": "assets/catalog-images/biscuits-snacks-c9b21d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1701341404788-b85484ca379e?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vu Nghi Thai",
       "profileUrl": "https://unsplash.com/@pvnt",
       "photoUrl": "https://unsplash.com/photos/a-wooden-table-topped-with-bowls-of-crackers-x_lxdRtNRfs",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/x_lxdRtNRfs/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA",
      "imageSource": "unsplash"
     },
     {
      "name": "Slanty Chips",
      "unit": "packet",
      "price": 60,
      "icon": "🥔",
      "image": "assets/catalog-images/biscuits-snacks-c9b21d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1701341404788-b85484ca379e?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vu Nghi Thai",
       "profileUrl": "https://unsplash.com/@pvnt",
       "photoUrl": "https://unsplash.com/photos/a-wooden-table-topped-with-bowls-of-crackers-x_lxdRtNRfs",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/x_lxdRtNRfs/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA",
      "imageSource": "unsplash"
     },
     {
      "name": "Nimko Mix 500g",
      "unit": "packet",
      "price": 380,
      "icon": "🥜",
      "nameUrdu": "نمکو",
      "image": "assets/catalog-images/biscuits-snacks-c9b21d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1701341404788-b85484ca379e?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vu Nghi Thai",
       "profileUrl": "https://unsplash.com/@pvnt",
       "photoUrl": "https://unsplash.com/photos/a-wooden-table-topped-with-bowls-of-crackers-x_lxdRtNRfs",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/x_lxdRtNRfs/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA",
      "imageSource": "unsplash"
     },
     {
      "name": "Salted Peanuts 500g",
      "unit": "packet",
      "price": 550,
      "icon": "🥜",
      "nameUrdu": "مونگ پھلی",
      "image": "assets/catalog-images/biscuits-snacks-c9b21d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1701341404788-b85484ca379e?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vu Nghi Thai",
       "profileUrl": "https://unsplash.com/@pvnt",
       "photoUrl": "https://unsplash.com/photos/a-wooden-table-topped-with-bowls-of-crackers-x_lxdRtNRfs",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/x_lxdRtNRfs/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA",
      "imageSource": "unsplash"
     },
     {
      "name": "Roasted Chana 500g",
      "unit": "packet",
      "price": 380,
      "icon": "🫘",
      "nameUrdu": "بھنا چنا",
      "image": "assets/catalog-images/biscuits-snacks-c9b21d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1701341404788-b85484ca379e?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vu Nghi Thai",
       "profileUrl": "https://unsplash.com/@pvnt",
       "photoUrl": "https://unsplash.com/photos/a-wooden-table-topped-with-bowls-of-crackers-x_lxdRtNRfs",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/x_lxdRtNRfs/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA",
      "imageSource": "unsplash"
     },
     {
      "name": "Puffed Rice (Murmura) 250g",
      "unit": "packet",
      "price": 150,
      "icon": "🍚",
      "nameUrdu": "مرمروں",
      "image": "assets/catalog-images/biscuits-snacks-c9b21d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1701341404788-b85484ca379e?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vu Nghi Thai",
       "profileUrl": "https://unsplash.com/@pvnt",
       "photoUrl": "https://unsplash.com/photos/a-wooden-table-topped-with-bowls-of-crackers-x_lxdRtNRfs",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/x_lxdRtNRfs/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA",
      "imageSource": "unsplash"
     },
     {
      "name": "Popcorn Kernels 500g",
      "unit": "packet",
      "price": 220,
      "icon": "🍿",
      "image": "assets/catalog-images/biscuits-snacks-c9b21d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1701341404788-b85484ca379e?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vu Nghi Thai",
       "profileUrl": "https://unsplash.com/@pvnt",
       "photoUrl": "https://unsplash.com/photos/a-wooden-table-topped-with-bowls-of-crackers-x_lxdRtNRfs",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/x_lxdRtNRfs/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA",
      "imageSource": "unsplash"
     },
     {
      "name": "Dry Fruit Mix 500g",
      "unit": "packet",
      "price": 1400,
      "icon": "🥜",
      "nameUrdu": "ڈرائی فروٹ",
      "image": "assets/catalog-images/dry-fruit-mix-500g-d552fe.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1701341404788-b85484ca379e?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vu Nghi Thai",
       "profileUrl": "https://unsplash.com/@pvnt",
       "photoUrl": "https://unsplash.com/photos/a-wooden-table-topped-with-bowls-of-crackers-x_lxdRtNRfs",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/x_lxdRtNRfs/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA"
     },
     {
      "name": "Dates (Khajoor) 500g",
      "unit": "packet",
      "price": 650,
      "icon": "🌴",
      "nameUrdu": "کھجور",
      "image": "assets/catalog-images/dates-500g-17095d.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1701341404788-b85484ca379e?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vu Nghi Thai",
       "profileUrl": "https://unsplash.com/@pvnt",
       "photoUrl": "https://unsplash.com/photos/a-wooden-table-topped-with-bowls-of-crackers-x_lxdRtNRfs",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/x_lxdRtNRfs/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA"
     },
     {
      "name": "Almonds (Badam) 500g",
      "unit": "packet",
      "price": 1650,
      "icon": "🌰",
      "nameUrdu": "بادام",
      "image": "assets/catalog-images/biscuits-snacks-c9b21d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1701341404788-b85484ca379e?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vu Nghi Thai",
       "profileUrl": "https://unsplash.com/@pvnt",
       "photoUrl": "https://unsplash.com/photos/a-wooden-table-topped-with-bowls-of-crackers-x_lxdRtNRfs",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/x_lxdRtNRfs/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA",
      "imageSource": "unsplash"
     }
    ],
    "image": "assets/catalog-images/biscuits-snacks-c9b21d.webp",
    "imageUrl": "https://images.unsplash.com/photo-1701341404788-b85484ca379e?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8QmlzY3VpdHMlMjAlMjAlMjBTbmFja3N8ZW58MXx8fHwxNzkyMjU1NTM2fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Vu Nghi Thai",
     "profileUrl": "https://unsplash.com/@pvnt",
     "photoUrl": "https://unsplash.com/photos/a-wooden-table-topped-with-bowls-of-crackers-x_lxdRtNRfs",
     "source": "Unsplash"
    }
   },
   {
    "name": "Dairy Staples",
    "items": [
     {
      "name": "Milk 1 Litre (Olper's)",
      "unit": "packet",
      "price": 220,
      "icon": "🥛",
      "nameUrdu": "دودھ",
      "imageUrl": "https://images.unsplash.com/photo-1639151082235-406d8eb262b9?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Mary Skrynnikova",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bottle-of-milk-next-to-a-glass-of-milk-c6TKtsi8C1k",
       "source": "Unsplash"
      }
     },
     {
      "name": "Milk 1 Litre (Milkpak)",
      "unit": "packet",
      "price": 230,
      "icon": "🥛",
      "nameUrdu": "دودھ",
      "imageUrl": "https://images.unsplash.com/photo-1639151082235-406d8eb262b9?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Mary Skrynnikova",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bottle-of-milk-next-to-a-glass-of-milk-c6TKtsi8C1k",
       "source": "Unsplash"
      }
     },
     {
      "name": "Yogurt Cup 500g",
      "unit": "piece",
      "price": 180,
      "icon": "🍶",
      "nameUrdu": "دہی",
      "imageUrl": "https://images.unsplash.com/photo-1571212515416-fef01fc43637?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "micheile henderson",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bowl-of-yogurt-with-a-spoon-in-it-NFHeBysjCTI",
       "source": "Unsplash"
      }
     },
     {
      "name": "Butter 200g (Nurpur)",
      "unit": "piece",
      "price": 380,
      "icon": "🧈",
      "nameUrdu": "مکھن",
      "imageUrl": "https://images.unsplash.com/photo-1719148162837-63d2f256231f?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Marine Le Gac",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-piece-of-butter-sitting-on-top-of-a-white-plate-4X7eA9zN8mg",
       "source": "Unsplash"
      }
     },
     {
      "name": "Cheese Slices 10ct",
      "unit": "packet",
      "price": 450,
      "icon": "🧀",
      "imageUrl": "https://images.unsplash.com/photo-1627935722051-395636b0d8a5?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Andra C Taylor Jr",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/sliced-cheese-on-brown-wooden-chopping-board-_L5MGd0w1FQ",
       "source": "Unsplash"
      }
     },
     {
      "name": "Cream 200ml",
      "unit": "piece",
      "price": 220,
      "icon": "🥛",
      "nameUrdu": "ملائی",
      "imageUrl": "https://images.unsplash.com/photo-1786695144564-d1cd05367032?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Le Tia",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/whipped-cream-in-pink-bowl--IT3JFWGKeM",
       "source": "Unsplash"
      }
     },
     {
      "name": "Eggs 1 Dozen",
      "unit": "dozen",
      "price": 420,
      "icon": "🥚",
      "nameUrdu": "انڈے",
      "image": "assets/catalog-images/eggs-1-dozen-28e8af.webp",
      "imageLevel": "item"
     },
     {
      "name": "Eggs Half Dozen",
      "unit": "dozen",
      "price": 215,
      "icon": "🥚",
      "nameUrdu": "انڈے",
      "image": "assets/catalog-images/eggs-half-dozen-99e0e8.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/dairy-staples-a7a6cc.webp",
    "imageUrl": "https://images.unsplash.com/photo-1571212515416-fef01fc43637?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "micheile henderson",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/a-bowl-of-yogurt-with-a-spoon-in-it-NFHeBysjCTI",
     "source": "Unsplash"
    }
   },
   {
    "name": "Personal Care",
    "items": [
     {
      "name": "Lifebuoy Soap 115g",
      "unit": "piece",
      "price": 130,
      "icon": "🧼",
      "nameUrdu": "صابن",
      "image": "assets/catalog-images/personal-care-f390f3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Diana Light",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-brown-wooden-rolling-pin-pBBxMUCgwuU",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Lux Soap 115g",
      "unit": "piece",
      "price": 140,
      "icon": "🧼",
      "nameUrdu": "صابن",
      "image": "assets/catalog-images/personal-care-f390f3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Diana Light",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-brown-wooden-rolling-pin-pBBxMUCgwuU",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Safeguard Soap 115g",
      "unit": "piece",
      "price": 145,
      "icon": "🧼",
      "nameUrdu": "صابن",
      "image": "assets/catalog-images/personal-care-f390f3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Diana Light",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-brown-wooden-rolling-pin-pBBxMUCgwuU",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Dettol Soap 115g",
      "unit": "piece",
      "price": 150,
      "icon": "🧼",
      "nameUrdu": "صابن",
      "image": "assets/catalog-images/personal-care-f390f3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Diana Light",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-brown-wooden-rolling-pin-pBBxMUCgwuU",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Capri Soap 115g",
      "unit": "piece",
      "price": 135,
      "icon": "🧼",
      "nameUrdu": "صابن",
      "image": "assets/catalog-images/personal-care-f390f3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Diana Light",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-brown-wooden-rolling-pin-pBBxMUCgwuU",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Surf Excel Washing Powder 1kg",
      "unit": "packet",
      "price": 520,
      "icon": "🧺",
      "nameUrdu": "سرف",
      "image": "assets/catalog-images/personal-care-f390f3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Diana Light",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-brown-wooden-rolling-pin-pBBxMUCgwuU",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Detergent Bar (Bonux)",
      "unit": "piece",
      "price": 110,
      "icon": "🧼",
      "nameUrdu": "صابن",
      "image": "assets/catalog-images/detergent-bar-6fba3f.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Diana Light",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-brown-wooden-rolling-pin-pBBxMUCgwuU",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Shampoo Sachet (Sunsilk)",
      "unit": "piece",
      "price": 60,
      "icon": "🧴",
      "nameUrdu": "شیمپو",
      "image": "assets/catalog-images/shampoo-sachet-9402ec.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Diana Light",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-brown-wooden-rolling-pin-pBBxMUCgwuU",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Shampoo 400ml (Clear)",
      "unit": "piece",
      "price": 1150,
      "icon": "🧴",
      "nameUrdu": "شیمپو",
      "image": "assets/catalog-images/shampoo-2fb722.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Diana Light",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-brown-wooden-rolling-pin-pBBxMUCgwuU",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Toothpaste (Colgate 140g)",
      "unit": "piece",
      "price": 420,
      "icon": "🪥",
      "nameUrdu": "ٹوتھ پیسٹ",
      "image": "assets/catalog-images/toothpaste-ac40b6.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Diana Light",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-brown-wooden-rolling-pin-pBBxMUCgwuU",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Toothbrush (Oral-B)",
      "unit": "piece",
      "price": 220,
      "icon": "🪥",
      "nameUrdu": "ٹوتھ برش",
      "image": "assets/catalog-images/toothbrush-b10b61.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Diana Light",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-brown-wooden-rolling-pin-pBBxMUCgwuU",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Hair Oil 200ml (Amla)",
      "unit": "piece",
      "price": 550,
      "icon": "🧴",
      "nameUrdu": "تیل",
      "image": "assets/catalog-images/hair-oil-v2-936a9a.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1667242003572-96caaf8ac5c4?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8aGFpciUyMG9pbCUyMGJvdHRsZXxlbnwxfHx8fDE3OTIyNTU1MjB8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Maria Lupan",
       "profileUrl": "https://unsplash.com/@luandmario",
       "photoUrl": "https://unsplash.com/photos/a-bottle-of-liquor-coE-z7_L2xU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/coE-z7_L2xU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8aGFpciUyMG9pbCUyMGJvdHRsZXxlbnwxfHx8fDE3OTIyNTU1MjB8MA",
      "imageSource": "unsplash"
     },
     {
      "name": "Coconut Oil 200ml",
      "unit": "piece",
      "price": 480,
      "icon": "🥥",
      "nameUrdu": "ناریل کا تیل",
      "image": "assets/catalog-images/coconut-oil-df5cda.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Diana Light",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-brown-wooden-rolling-pin-pBBxMUCgwuU",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Talcum Powder 200g",
      "unit": "piece",
      "price": 420,
      "icon": "🧴",
      "nameUrdu": "پاؤڈر",
      "image": "assets/catalog-images/personal-care-f390f3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Diana Light",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-brown-wooden-rolling-pin-pBBxMUCgwuU",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Face Cream (Fair & Lovely)",
      "unit": "piece",
      "price": 380,
      "icon": "🧴",
      "nameUrdu": "کریم",
      "image": "assets/catalog-images/face-cream-v2-a66303.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1763503839418-2b45c3d7a3c3?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8ZmFjZSUyMGNyZWFtJTIwamFyfGVufDF8fHx8MTc5MjI1NTUyM3ww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Eveling Salazar",
       "profileUrl": "https://unsplash.com/@eve__3d",
       "photoUrl": "https://unsplash.com/photos/a-jar-of-white-cream-floats-above-a-rock-01YhA5XDDLk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/01YhA5XDDLk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8ZmFjZSUyMGNyZWFtJTIwamFyfGVufDF8fHx8MTc5MjI1NTUyM3ww",
      "imageSource": "unsplash"
     },
     {
      "name": "Shaving Blades Pack (7 O'Clock)",
      "unit": "packet",
      "price": 180,
      "icon": "🪒",
      "nameUrdu": "بلیڈ",
      "image": "assets/catalog-images/shaving-blades-708b12.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Diana Light",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-brown-wooden-rolling-pin-pBBxMUCgwuU",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     }
    ],
    "image": "assets/catalog-images/personal-care-f390f3.webp",
    "imageUrl": "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Diana Light",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/white-and-brown-wooden-rolling-pin-pBBxMUCgwuU",
     "source": "Unsplash"
    }
   },
   {
    "name": "Household Cleaning",
    "items": [
     {
      "name": "Dish Soap Bar (Vim)",
      "unit": "piece",
      "price": 130,
      "icon": "🍽️",
      "nameUrdu": "برتن کا صابن",
      "image": "assets/catalog-images/dish-soap-bar-c01d54.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1740657254989-42fe9c3b8cce?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "PuroClean of Fort Worth",
       "profileUrl": "https://unsplash.com/@purocleanoffortworth",
       "photoUrl": "https://unsplash.com/photos/a-person-in-yellow-gloves-and-blue-gloves-cleaning-a-floor--dc38HdQR1M",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/-dc38HdQR1M/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA"
     },
     {
      "name": "Dishwashing Liquid 500ml",
      "unit": "piece",
      "price": 380,
      "icon": "🧽",
      "nameUrdu": "برتن دھونے کا صابن",
      "image": "assets/catalog-images/dishwashing-liquid-c98cfc.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1740657254989-42fe9c3b8cce?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "PuroClean of Fort Worth",
       "profileUrl": "https://unsplash.com/@purocleanoffortworth",
       "photoUrl": "https://unsplash.com/photos/a-person-in-yellow-gloves-and-blue-gloves-cleaning-a-floor--dc38HdQR1M",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/-dc38HdQR1M/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA"
     },
     {
      "name": "Phenyl 1 Litre",
      "unit": "piece",
      "price": 220,
      "icon": "🧴",
      "nameUrdu": "فینائل",
      "image": "assets/catalog-images/phenyl-a44c3a.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1740657254989-42fe9c3b8cce?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "PuroClean of Fort Worth",
       "profileUrl": "https://unsplash.com/@purocleanoffortworth",
       "photoUrl": "https://unsplash.com/photos/a-person-in-yellow-gloves-and-blue-gloves-cleaning-a-floor--dc38HdQR1M",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/-dc38HdQR1M/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA"
     },
     {
      "name": "Bleach 1 Litre",
      "unit": "piece",
      "price": 180,
      "icon": "🧴",
      "nameUrdu": "بلیچ",
      "image": "assets/catalog-images/bleach-v2-558bb7.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1740657254989-42fe9c3b8cce?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "PuroClean of Fort Worth",
       "profileUrl": "https://unsplash.com/@purocleanoffortworth",
       "photoUrl": "https://unsplash.com/photos/a-person-in-yellow-gloves-and-blue-gloves-cleaning-a-floor--dc38HdQR1M",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/-dc38HdQR1M/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA"
     },
     {
      "name": "Toilet Cleaner 725ml",
      "unit": "piece",
      "price": 550,
      "icon": "🚽",
      "image": "assets/catalog-images/toilet-cleaner-34b59a.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1740657254989-42fe9c3b8cce?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "PuroClean of Fort Worth",
       "profileUrl": "https://unsplash.com/@purocleanoffortworth",
       "photoUrl": "https://unsplash.com/photos/a-person-in-yellow-gloves-and-blue-gloves-cleaning-a-floor--dc38HdQR1M",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/-dc38HdQR1M/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA"
     },
     {
      "name": "Vim Bar Refill",
      "unit": "piece",
      "price": 95,
      "icon": "🍽️",
      "nameUrdu": "برتن کا صابن",
      "image": "assets/catalog-images/household-cleaning-1a05f5.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1740657254989-42fe9c3b8cce?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "PuroClean of Fort Worth",
       "profileUrl": "https://unsplash.com/@purocleanoffortworth",
       "photoUrl": "https://unsplash.com/photos/a-person-in-yellow-gloves-and-blue-gloves-cleaning-a-floor--dc38HdQR1M",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/-dc38HdQR1M/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA",
      "imageSource": "unsplash"
     },
     {
      "name": "Scrub Pad (Pack of 3)",
      "unit": "packet",
      "price": 120,
      "icon": "🧽",
      "nameUrdu": "سکرب",
      "image": "assets/catalog-images/scrub-pad-731232.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1740657254989-42fe9c3b8cce?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "PuroClean of Fort Worth",
       "profileUrl": "https://unsplash.com/@purocleanoffortworth",
       "photoUrl": "https://unsplash.com/photos/a-person-in-yellow-gloves-and-blue-gloves-cleaning-a-floor--dc38HdQR1M",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/-dc38HdQR1M/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA"
     },
     {
      "name": "Broom (Phool Jharu)",
      "unit": "piece",
      "price": 350,
      "icon": "🧹",
      "nameUrdu": "جھاڑو",
      "image": "assets/catalog-images/broom-86f98f.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1740657254989-42fe9c3b8cce?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "PuroClean of Fort Worth",
       "profileUrl": "https://unsplash.com/@purocleanoffortworth",
       "photoUrl": "https://unsplash.com/photos/a-person-in-yellow-gloves-and-blue-gloves-cleaning-a-floor--dc38HdQR1M",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/-dc38HdQR1M/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA"
     },
     {
      "name": "Mop (Pochha)",
      "unit": "piece",
      "price": 450,
      "icon": "🧹",
      "nameUrdu": "پوچھا",
      "image": "assets/catalog-images/mop-v2-746c84.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1740657254989-42fe9c3b8cce?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "PuroClean of Fort Worth",
       "profileUrl": "https://unsplash.com/@purocleanoffortworth",
       "photoUrl": "https://unsplash.com/photos/a-person-in-yellow-gloves-and-blue-gloves-cleaning-a-floor--dc38HdQR1M",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/-dc38HdQR1M/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA"
     },
     {
      "name": "Duster Cloth (Pack of 3)",
      "unit": "packet",
      "price": 200,
      "icon": "🧵",
      "nameUrdu": "ڈسٹر",
      "image": "assets/catalog-images/duster-cloth-3f26e1.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1612800317101-ed7de737b36f?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c3RhY2slMjBvZiUyMGNsZWFuaW5nJTIwY2xvdGhzfGVufDF8fHx8MTc5MjI1NTUxNnww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Sven Brandsma",
       "profileUrl": "https://unsplash.com/@seffen99",
       "photoUrl": "https://unsplash.com/photos/blue-denim-textile-on-black-table-rtDTC6b2-RY",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/rtDTC6b2-RY/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c3RhY2slMjBvZiUyMGNsZWFuaW5nJTIwY2xvdGhzfGVufDF8fHx8MTc5MjI1NTUxNnww",
      "imageSource": "unsplash"
     },
     {
      "name": "Garbage Bags (Roll)",
      "unit": "packet",
      "price": 250,
      "icon": "🗑️",
      "nameUrdu": "کچرے کی تھیلی",
      "image": "assets/catalog-images/garbage-bags-281bcc.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1740657254989-42fe9c3b8cce?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "PuroClean of Fort Worth",
       "profileUrl": "https://unsplash.com/@purocleanoffortworth",
       "photoUrl": "https://unsplash.com/photos/a-person-in-yellow-gloves-and-blue-gloves-cleaning-a-floor--dc38HdQR1M",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/-dc38HdQR1M/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA"
     },
     {
      "name": "Incense Sticks (Agarbatti)",
      "unit": "packet",
      "price": 150,
      "icon": "🕯️",
      "nameUrdu": "اگربتی",
      "image": "assets/catalog-images/incense-sticks-cce35d.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1740657254989-42fe9c3b8cce?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "PuroClean of Fort Worth",
       "profileUrl": "https://unsplash.com/@purocleanoffortworth",
       "photoUrl": "https://unsplash.com/photos/a-person-in-yellow-gloves-and-blue-gloves-cleaning-a-floor--dc38HdQR1M",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/-dc38HdQR1M/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA"
     },
     {
      "name": "Mosquito Coil (Pack)",
      "unit": "packet",
      "price": 180,
      "icon": "🦟",
      "nameUrdu": "مچھر کی اگربتی",
      "image": "assets/catalog-images/mosquito-coil-3abc3b.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1740657254989-42fe9c3b8cce?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "PuroClean of Fort Worth",
       "profileUrl": "https://unsplash.com/@purocleanoffortworth",
       "photoUrl": "https://unsplash.com/photos/a-person-in-yellow-gloves-and-blue-gloves-cleaning-a-floor--dc38HdQR1M",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/-dc38HdQR1M/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA"
     },
     {
      "name": "Matchbox (Pack of 10)",
      "unit": "packet",
      "price": 120,
      "icon": "🔥",
      "nameUrdu": "ماچس",
      "image": "assets/catalog-images/matchbox-62908d.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1740657254989-42fe9c3b8cce?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "PuroClean of Fort Worth",
       "profileUrl": "https://unsplash.com/@purocleanoffortworth",
       "photoUrl": "https://unsplash.com/photos/a-person-in-yellow-gloves-and-blue-gloves-cleaning-a-floor--dc38HdQR1M",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/-dc38HdQR1M/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA"
     },
     {
      "name": "Candle (Pack of 6)",
      "unit": "packet",
      "price": 180,
      "icon": "🕯️",
      "nameUrdu": "موم بتی",
      "image": "assets/catalog-images/candle-e966b2.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1740657254989-42fe9c3b8cce?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "PuroClean of Fort Worth",
       "profileUrl": "https://unsplash.com/@purocleanoffortworth",
       "photoUrl": "https://unsplash.com/photos/a-person-in-yellow-gloves-and-blue-gloves-cleaning-a-floor--dc38HdQR1M",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/-dc38HdQR1M/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA"
     },
     {
      "name": "Naphthalene Balls 200g",
      "unit": "packet",
      "price": 150,
      "icon": "⚪",
      "nameUrdu": "نفتھالین",
      "image": "assets/catalog-images/household-cleaning-1a05f5.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1740657254989-42fe9c3b8cce?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "PuroClean of Fort Worth",
       "profileUrl": "https://unsplash.com/@purocleanoffortworth",
       "photoUrl": "https://unsplash.com/photos/a-person-in-yellow-gloves-and-blue-gloves-cleaning-a-floor--dc38HdQR1M",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/-dc38HdQR1M/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA",
      "imageSource": "unsplash"
     },
     {
      "name": "Air Freshener Spray",
      "unit": "piece",
      "price": 650,
      "icon": "🌸",
      "image": "assets/catalog-images/air-freshener-spray-756e40.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1740657254989-42fe9c3b8cce?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "PuroClean of Fort Worth",
       "profileUrl": "https://unsplash.com/@purocleanoffortworth",
       "photoUrl": "https://unsplash.com/photos/a-person-in-yellow-gloves-and-blue-gloves-cleaning-a-floor--dc38HdQR1M",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/-dc38HdQR1M/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA"
     },
     {
      "name": "Shoe Polish Black",
      "unit": "piece",
      "price": 180,
      "icon": "👞",
      "nameUrdu": "جوتوں کی پالش",
      "image": "assets/catalog-images/shoe-polish-black-fff2d6.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1740657254989-42fe9c3b8cce?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "PuroClean of Fort Worth",
       "profileUrl": "https://unsplash.com/@purocleanoffortworth",
       "photoUrl": "https://unsplash.com/photos/a-person-in-yellow-gloves-and-blue-gloves-cleaning-a-floor--dc38HdQR1M",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/-dc38HdQR1M/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA"
     }
    ],
    "image": "assets/catalog-images/household-cleaning-1a05f5.webp",
    "imageUrl": "https://images.unsplash.com/photo-1740657254989-42fe9c3b8cce?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SG91c2Vob2xkJTIwQ2xlYW5pbmd8ZW58MXx8fHwxNzkyMjU1NTM1fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "PuroClean of Fort Worth",
     "profileUrl": "https://unsplash.com/@purocleanoffortworth",
     "photoUrl": "https://unsplash.com/photos/a-person-in-yellow-gloves-and-blue-gloves-cleaning-a-floor--dc38HdQR1M",
     "source": "Unsplash"
    }
   }
  ]
 },
 {
  "shopType": "Supermarket & Grocery",
  "icon": "🛒",
  "categories": [
   {
    "name": "Breakfast & Cereals",
    "items": [
     {
      "name": "Weetabix Cereal 500g",
      "unit": "box",
      "price": 1450,
      "icon": "🥣",
      "image": "assets/catalog-images/breakfast-cereals-7317b4.webp",
      "imageLevel": "category"
     },
     {
      "name": "Corn Flakes 500g",
      "unit": "box",
      "price": 1150,
      "icon": "🌽",
      "nameUrdu": "کارن فلیکس",
      "image": "assets/catalog-images/breakfast-cereals-7317b4.webp",
      "imageLevel": "category"
     },
     {
      "name": "Oats 500g (Quaker)",
      "unit": "packet",
      "price": 750,
      "icon": "🥣",
      "nameUrdu": "جو کا دلیہ",
      "image": "assets/catalog-images/breakfast-cereals-7317b4.webp",
      "imageLevel": "category"
     },
     {
      "name": "Milo 400g",
      "unit": "packet",
      "price": 1250,
      "icon": "🍫",
      "image": "assets/catalog-images/breakfast-cereals-7317b4.webp",
      "imageLevel": "category"
     },
     {
      "name": "Nutella 350g",
      "unit": "piece",
      "price": 1650,
      "icon": "🍫",
      "image": "assets/catalog-images/breakfast-cereals-7317b4.webp",
      "imageLevel": "category"
     },
     {
      "name": "Strawberry Jam 500g",
      "unit": "piece",
      "price": 550,
      "icon": "🍓",
      "nameUrdu": "مربہ",
      "image": "assets/catalog-images/breakfast-cereals-7317b4.webp",
      "imageLevel": "category"
     },
     {
      "name": "Honey 500g",
      "unit": "piece",
      "price": 1650,
      "icon": "🍯",
      "nameUrdu": "شہد",
      "imageUrl": "https://images.unsplash.com/photo-1613548058193-1cd24c1bebcf?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Benyamin Bohlouli",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/honey-dripping-from-wooden-dipper-Rcj302Npzis",
       "source": "Unsplash"
      }
     },
     {
      "name": "Peanut Butter 350g",
      "unit": "piece",
      "price": 1150,
      "icon": "🥜",
      "nameUrdu": "مونگ پھلی کا مکھن",
      "image": "assets/catalog-images/breakfast-cereals-7317b4.webp",
      "imageLevel": "category"
     },
     {
      "name": "Pancake Mix 500g",
      "unit": "packet",
      "price": 950,
      "icon": "🥞",
      "image": "assets/catalog-images/breakfast-cereals-7317b4.webp",
      "imageLevel": "category"
     },
     {
      "name": "Whole Wheat Bread Slices",
      "unit": "packet",
      "price": 220,
      "icon": "🍞",
      "nameUrdu": "ڈبل روٹی",
      "image": "assets/catalog-images/whole-wheat-bread-slices-da2c4e.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/breakfast-cereals-7317b4.webp"
   },
   {
    "name": "Pasta, Noodles & Canned",
    "items": [
     {
      "name": "Spaghetti 500g",
      "unit": "packet",
      "price": 380,
      "icon": "🍝",
      "image": "assets/catalog-images/spaghetti-500g-54447f.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1792242776385-ef56e36256a2?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Robert Dolega",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/spaghetti-strands-against-black-background-9mrAIytSOI0",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Macaroni 500g",
      "unit": "packet",
      "price": 360,
      "icon": "🍝",
      "nameUrdu": "میکرونی",
      "imageUrl": "https://images.unsplash.com/photo-1590060846796-0418842f3908?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Ayush Sharma",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/yellow-rubber-balloons-in-close-up-photography-b1dxNswO_C4",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Maggi 2-Min Noodles (12 pack)",
      "unit": "packet",
      "price": 720,
      "icon": "🍜",
      "nameUrdu": "نوڈلز",
      "imageUrl": "https://images.unsplash.com/photo-1591874879354-bf0a6e982c60?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Jeff Siepman",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-red-noodle-cup-3ZLDdR7x52w",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Knorr Chicken Noodles (Pack)",
      "unit": "packet",
      "price": 120,
      "icon": "🍜",
      "nameUrdu": "نوڈلز",
      "imageUrl": "https://images.unsplash.com/photo-1591874879354-bf0a6e982c60?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Jeff Siepman",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-red-noodle-cup-3ZLDdR7x52w",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Chicken Soup Mix (Shan)",
      "unit": "packet",
      "price": 220,
      "icon": "🍲",
      "nameUrdu": "سوپ",
      "image": "assets/catalog-images/chicken-soup-mix-d6f3ce.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1788141554554-206bd5510910?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Charles Chen",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/chicken-and-shiitake-mushroom-soup-_354IkobM0o",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Canned Tuna 170g",
      "unit": "piece",
      "price": 650,
      "icon": "🐟",
      "nameUrdu": "ٹونا مچھلی",
      "imageUrl": "https://images.unsplash.com/photo-1784677217180-5957876afedd?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Alfonso Scarpa",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/gloved-hand-removes-tuna-from-a-delfino-battista-can-k6bpQ_C0i7s",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Canned Mushrooms 400g",
      "unit": "piece",
      "price": 550,
      "icon": "🍄",
      "nameUrdu": "مشروم",
      "imageUrl": "https://images.unsplash.com/photo-1564508080589-f719e2cde765?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "OSPAN ALI",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/assorted-mushrooms-in-bottles-imWSoX1qoG0",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Sweet Corn Can 400g",
      "unit": "piece",
      "price": 480,
      "icon": "🌽",
      "nameUrdu": "مکئی",
      "imageUrl": "https://images.unsplash.com/photo-1760361571822-1984e9a5887d?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Mustafa akın",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/three-ears-of-fresh-corn-on-a-wooden-surface-PIhPkdnYpf0",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Baked Beans 400g",
      "unit": "piece",
      "price": 450,
      "icon": "🫘",
      "imageUrl": "https://images.unsplash.com/photo-1779119867390-c64f66cd02b8?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "tommao wang",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-beans-in-tomato-sauce-served-in-a-white-bowl-IcSyeAnOj6k",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Tomato Paste 400g",
      "unit": "piece",
      "price": 320,
      "icon": "🍅",
      "nameUrdu": "ٹماٹر پیسٹ"
     },
     {
      "name": "Coconut Milk 400ml",
      "unit": "piece",
      "price": 650,
      "icon": "🥥",
      "nameUrdu": "ناریل کا دودھ",
      "image": "assets/catalog-images/coconut-milk-ea2abb.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1588413335367-e49d32c5b50b?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Tijana Drndarski",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-pillar-candle-on-brown-wooden-coaster-eDj-bODzFx8",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Canned Chickpeas 400g",
      "unit": "piece",
      "price": 380,
      "icon": "🫘",
      "nameUrdu": "چنے",
      "imageUrl": "https://images.unsplash.com/photo-1644432757699-bb5a01e8fb0e?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Karyna Panchenko",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bowl-filled-with-chickpeas-sitting-on-top-of-a-table-5352eOUYay4",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1779119867390-c64f66cd02b8?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "tommao wang",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/white-beans-in-tomato-sauce-served-in-a-white-bowl-IcSyeAnOj6k",
     "source": "Unsplash"
    }
   },
   {
    "name": "Sauces, Spreads & Condiments",
    "items": [
     {
      "name": "Ketchup 1kg (National)",
      "unit": "piece",
      "price": 520,
      "icon": "🍅",
      "image": "assets/catalog-images/ketchup-24c60f.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1741519301128-8426ea15d03e?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hot-sauce-bottles-line-a-store-shelf-MYbwccBN2-Q",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Mayonnaise 500ml",
      "unit": "piece",
      "price": 850,
      "icon": "🥚",
      "image": "assets/catalog-images/mayonnaise-d3f1c2.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1741519301128-8426ea15d03e?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hot-sauce-bottles-line-a-store-shelf-MYbwccBN2-Q",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "BBQ Sauce 500ml",
      "unit": "piece",
      "price": 650,
      "icon": "🍖",
      "image": "assets/catalog-images/bbq-sauce-5fd122.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1741519301128-8426ea15d03e?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hot-sauce-bottles-line-a-store-shelf-MYbwccBN2-Q",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Soy Sauce 500ml",
      "unit": "piece",
      "price": 550,
      "icon": "🍶",
      "image": "assets/catalog-images/soy-sauce-c46e8e.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1741519301128-8426ea15d03e?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hot-sauce-bottles-line-a-store-shelf-MYbwccBN2-Q",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Chilli Garlic Sauce 500g",
      "unit": "piece",
      "price": 450,
      "icon": "🌶️",
      "image": "assets/catalog-images/sauces-spreads-condiments-33281b.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1741519301128-8426ea15d03e?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hot-sauce-bottles-line-a-store-shelf-MYbwccBN2-Q",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Mustard Paste 200g",
      "unit": "piece",
      "price": 380,
      "icon": "🟡",
      "nameUrdu": "سرسوں پیسٹ",
      "image": "assets/catalog-images/sauces-spreads-condiments-33281b.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1741519301128-8426ea15d03e?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hot-sauce-bottles-line-a-store-shelf-MYbwccBN2-Q",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Vinegar 500ml",
      "unit": "piece",
      "price": 320,
      "icon": "🫗",
      "nameUrdu": "سرکہ",
      "image": "assets/catalog-images/vinegar-7cc9d3.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1741519301128-8426ea15d03e?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hot-sauce-bottles-line-a-store-shelf-MYbwccBN2-Q",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Mixed Pickles 1kg",
      "unit": "piece",
      "price": 850,
      "icon": "🥒",
      "nameUrdu": "اچار",
      "image": "assets/catalog-images/mixed-pickles-842edd.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1741519301128-8426ea15d03e?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hot-sauce-bottles-line-a-store-shelf-MYbwccBN2-Q",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Mango Pickle 500g",
      "unit": "piece",
      "price": 480,
      "icon": "🥭",
      "nameUrdu": "آم کا اچار",
      "image": "assets/catalog-images/sauces-spreads-condiments-33281b.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1741519301128-8426ea15d03e?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hot-sauce-bottles-line-a-store-shelf-MYbwccBN2-Q",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Mint Chutney 250g",
      "unit": "piece",
      "price": 320,
      "icon": "🌿",
      "nameUrdu": "پودینے کی چٹنی",
      "image": "assets/catalog-images/sauces-spreads-condiments-33281b.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1741519301128-8426ea15d03e?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hot-sauce-bottles-line-a-store-shelf-MYbwccBN2-Q",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Pizza Sauce 400g",
      "unit": "piece",
      "price": 550,
      "icon": "🍕",
      "image": "assets/catalog-images/sauces-spreads-condiments-33281b.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1741519301128-8426ea15d03e?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hot-sauce-bottles-line-a-store-shelf-MYbwccBN2-Q",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Garlic Paste 250g",
      "unit": "piece",
      "price": 380,
      "icon": "🧄",
      "nameUrdu": "لہسن کا پیسٹ",
      "image": "assets/catalog-images/sauces-spreads-condiments-33281b.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1741519301128-8426ea15d03e?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hot-sauce-bottles-line-a-store-shelf-MYbwccBN2-Q",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Ginger Garlic Paste 500g",
      "unit": "piece",
      "price": 650,
      "icon": "🧄",
      "nameUrdu": "ادرک لہسن پیسٹ",
      "image": "assets/catalog-images/sauces-spreads-condiments-33281b.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1741519301128-8426ea15d03e?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hot-sauce-bottles-line-a-store-shelf-MYbwccBN2-Q",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Salt & Pepper Grinder Set",
      "unit": "piece",
      "price": 850,
      "icon": "🧂",
      "nameUrdu": "نمک مرچ",
      "image": "assets/catalog-images/salt-pepper-grinder-d2b5a0.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1741519301128-8426ea15d03e?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hot-sauce-bottles-line-a-store-shelf-MYbwccBN2-Q",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     }
    ],
    "image": "assets/catalog-images/sauces-spreads-condiments-33281b.webp",
    "imageUrl": "https://images.unsplash.com/photo-1741519301128-8426ea15d03e?w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Zoshua Colah",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/hot-sauce-bottles-line-a-store-shelf-MYbwccBN2-Q",
     "source": "Unsplash"
    }
   },
   {
    "name": "Frozen Foods",
    "items": [
     {
      "name": "Frozen Parathas 20ct",
      "unit": "packet",
      "price": 650,
      "icon": "🫓",
      "nameUrdu": "پراٹھے",
      "image": "assets/catalog-images/frozen-foods-0a8523.webp",
      "imageLevel": "category"
     },
     {
      "name": "Frozen Samosas 12ct",
      "unit": "packet",
      "price": 550,
      "icon": "🥟",
      "nameUrdu": "سموسے",
      "image": "assets/catalog-images/frozen-foods-0a8523.webp",
      "imageLevel": "category"
     },
     {
      "name": "Chicken Nuggets 1kg",
      "unit": "packet",
      "price": 1450,
      "icon": "🍗",
      "image": "assets/catalog-images/chicken-nuggets-ded40c.webp",
      "imageLevel": "item"
     },
     {
      "name": "Frozen Shami Kabab 12ct",
      "unit": "packet",
      "price": 750,
      "icon": "🥙",
      "nameUrdu": "شامی کباب",
      "image": "assets/catalog-images/frozen-foods-0a8523.webp",
      "imageLevel": "category"
     },
     {
      "name": "Frozen Seekh Kabab 8ct",
      "unit": "packet",
      "price": 950,
      "icon": "🍢",
      "nameUrdu": "سیخ کباب",
      "image": "assets/catalog-images/frozen-foods-0a8523.webp",
      "imageLevel": "category"
     },
     {
      "name": "Frozen French Fries 1kg",
      "unit": "packet",
      "price": 750,
      "icon": "🍟",
      "image": "assets/catalog-images/frozen-french-fries-18d4e9.webp",
      "imageLevel": "item"
     },
     {
      "name": "Frozen Peas 500g",
      "unit": "packet",
      "price": 420,
      "icon": "🫛",
      "nameUrdu": "مٹر",
      "image": "assets/catalog-images/frozen-foods-0a8523.webp",
      "imageLevel": "category"
     },
     {
      "name": "Frozen Mixed Vegetables 1kg",
      "unit": "packet",
      "price": 650,
      "icon": "🥦",
      "nameUrdu": "سبزیاں",
      "image": "assets/catalog-images/frozen-mixed-vegetables-143462.webp",
      "imageLevel": "item"
     },
     {
      "name": "Frozen Spring Rolls 12ct",
      "unit": "packet",
      "price": 650,
      "icon": "🥠",
      "image": "assets/catalog-images/frozen-foods-0a8523.webp",
      "imageLevel": "category"
     },
     {
      "name": "Ice Cream 1 Litre",
      "unit": "packet",
      "price": 950,
      "icon": "🍨",
      "nameUrdu": "آئس کریم",
      "image": "assets/catalog-images/ice-cream-4905f6.webp",
      "imageLevel": "item"
     },
     {
      "name": "Kulfi 1 Litre",
      "unit": "packet",
      "price": 750,
      "icon": "🍦",
      "nameUrdu": "قلفی",
      "image": "assets/catalog-images/kulfi-763d4f.webp",
      "imageLevel": "item"
     },
     {
      "name": "Frozen Pizza 1ct",
      "unit": "piece",
      "price": 1150,
      "icon": "🍕",
      "image": "assets/catalog-images/frozen-foods-0a8523.webp",
      "imageLevel": "category"
     }
    ],
    "image": "assets/catalog-images/frozen-foods-0a8523.webp"
   },
   {
    "name": "Baby Care & Food",
    "items": [
     {
      "name": "Cerelac Wheat 400g",
      "unit": "box",
      "price": 1350,
      "icon": "👶"
     },
     {
      "name": "Baby Milk Formula 400g",
      "unit": "box",
      "price": 2450,
      "icon": "🍼",
      "nameUrdu": "بچوں کا دودھ"
     },
     {
      "name": "Pampers Active Baby (Pack)",
      "unit": "packet",
      "price": 1650,
      "icon": "👶",
      "imageUrl": "https://images.unsplash.com/photo-1584839404042-8bc21d240e91?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Nathan Dumlao",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/blue-and-white-plastic-pack-KeiQeZJLmus",
       "source": "Unsplash"
      }
     },
     {
      "name": "Baby Wipes 80ct",
      "unit": "packet",
      "price": 550,
      "icon": "🧻",
      "imageUrl": "https://images.unsplash.com/photo-1706524077391-12206f155e94?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Jake Bravo",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-package-of-softacre-baby-wipes-sitting-on-top-of-a-white-stand-pms1zJmqxgQ",
       "source": "Unsplash"
      }
     },
     {
      "name": "Baby Shampoo 200ml",
      "unit": "piece",
      "price": 750,
      "icon": "🧴",
      "nameUrdu": "بچوں کا شیمپو",
      "image": "assets/catalog-images/baby-shampoo-7f1b47.webp",
      "imageLevel": "item"
     },
     {
      "name": "Baby Lotion 200ml",
      "unit": "piece",
      "price": 850,
      "icon": "🧴",
      "image": "assets/catalog-images/baby-lotion-bc427e.webp",
      "imageLevel": "item"
     },
     {
      "name": "Baby Oil 200ml",
      "unit": "piece",
      "price": 650,
      "icon": "🧴",
      "nameUrdu": "بچوں کا تیل",
      "imageUrl": "https://images.unsplash.com/photo-1750085036915-6e21c6981586?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/johnsons-baby-oil-and-lotion-are-displayed-8XtQp4UVB34",
       "source": "Unsplash"
      }
     },
     {
      "name": "Diaper Rash Cream",
      "unit": "piece",
      "price": 750,
      "icon": "🧴"
     },
     {
      "name": "Feeding Bottle 250ml",
      "unit": "piece",
      "price": 950,
      "icon": "🍼",
      "nameUrdu": "فیڈر",
      "image": "assets/catalog-images/feeding-bottle-2f7892.webp",
      "imageLevel": "item"
     },
     {
      "name": "Baby Rusks 250g",
      "unit": "packet",
      "price": 550,
      "icon": "🍪",
      "nameUrdu": "بچوں کے رس"
     }
    ],
    "image": "assets/catalog-images/baby-care-food-ab4d57.webp",
    "imageUrl": "https://images.unsplash.com/photo-1584839404042-8bc21d240e91?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "Nathan Dumlao",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/blue-and-white-plastic-pack-KeiQeZJLmus",
     "source": "Unsplash"
    }
   },
   {
    "name": "Packaged Dairy & Beverages",
    "items": [
     {
      "name": "Flavoured Milk 200ml (Pack of 6)",
      "unit": "packet",
      "price": 750,
      "icon": "🥛",
      "nameUrdu": "ذائقہ دار دودھ",
      "imageUrl": "https://images.unsplash.com/photo-1760812990908-70aff19fc16e?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Harendra Rathnajeewa",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/three-bottles-of-flavored-milk-drinks-with-red-caps-oJ-RaDeF30g",
       "source": "Unsplash"
      }
     },
     {
      "name": "Chocolate Milk 1 Litre",
      "unit": "packet",
      "price": 320,
      "icon": "🍫",
      "nameUrdu": "چاکلیٹ دودھ",
      "image": "assets/catalog-images/chocolate-milk-3de281.webp",
      "imageLevel": "item"
     },
     {
      "name": "Buttermilk (Chaas) 500ml",
      "unit": "piece",
      "price": 150,
      "icon": "🥛",
      "nameUrdu": "چھاس",
      "image": "assets/catalog-images/buttermilk-814935.webp",
      "imageLevel": "item"
     },
     {
      "name": "Yogurt Drink (Lassi) 500ml",
      "unit": "piece",
      "price": 180,
      "icon": "🍶",
      "nameUrdu": "لسی",
      "image": "assets/catalog-images/yogurt-drink-a01e62.webp",
      "imageLevel": "item"
     },
     {
      "name": "Coca Cola 1.5 Litre",
      "unit": "piece",
      "price": 250,
      "icon": "🥤",
      "image": "assets/catalog-images/coca-cola-a4afb0.webp",
      "imageLevel": "item"
     },
     {
      "name": "Pepsi 1.5 Litre",
      "unit": "piece",
      "price": 250,
      "icon": "🥤",
      "image": "assets/catalog-images/pepsi-4d2ea3.webp",
      "imageLevel": "item"
     },
     {
      "name": "Sprite 1.5 Litre",
      "unit": "piece",
      "price": 250,
      "icon": "🥤",
      "image": "assets/catalog-images/sprite-51f2b7.webp",
      "imageLevel": "item"
     },
     {
      "name": "Pakola 1.5 Litre",
      "unit": "piece",
      "price": 240,
      "icon": "🥤"
     },
     {
      "name": "Mineral Water 1.5 Litre",
      "unit": "piece",
      "price": 180,
      "icon": "💧",
      "nameUrdu": "پانی",
      "imageUrl": "https://images.unsplash.com/photo-1550505095-81378a674395?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Serenity Mitchell",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/water-plastic-bottle-uY4ZZZQ7uGE",
       "source": "Unsplash"
      }
     },
     {
      "name": "Mineral Water 5 Litre",
      "unit": "piece",
      "price": 450,
      "icon": "💧",
      "nameUrdu": "پانی",
      "imageUrl": "https://images.unsplash.com/photo-1550505095-81378a674395?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Serenity Mitchell",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/water-plastic-bottle-uY4ZZZQ7uGE",
       "source": "Unsplash"
      }
     },
     {
      "name": "Mango Juice 1 Litre",
      "unit": "packet",
      "price": 320,
      "icon": "🥭",
      "nameUrdu": "آم کا رس",
      "image": "assets/catalog-images/mango-juice-358e5d.webp",
      "imageLevel": "item"
     },
     {
      "name": "Orange Juice 1 Litre",
      "unit": "packet",
      "price": 380,
      "icon": "🍊",
      "nameUrdu": "سنگترے کا رس",
      "imageUrl": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "ABHISHEK HAJARE",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/orange-juice-in-clear-drinking-glass-kkrXVKK-jhg",
       "source": "Unsplash"
      }
     }
    ],
    "image": "assets/catalog-images/packaged-dairy-beverages-b82a2b.webp"
   },
   {
    "name": "Cleaning & Laundry Brands",
    "items": [
     {
      "name": "Ariel Detergent 1kg",
      "unit": "packet",
      "price": 580,
      "icon": "🧺",
      "image": "assets/catalog-images/ariel-detergent-950eb6.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1649005011845-ef225c89da86?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Sufyan",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-white-plastic-bottle-with-a-blue-cap-9wCOqpBJRHI",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Surf Excel 1kg",
      "unit": "packet",
      "price": 520,
      "icon": "🧺",
      "image": "assets/catalog-images/surf-excel-v2-f09a9b.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1649005011845-ef225c89da86?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Sufyan",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-white-plastic-bottle-with-a-blue-cap-9wCOqpBJRHI",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Brite Detergent 1kg",
      "unit": "packet",
      "price": 480,
      "icon": "🧺",
      "image": "assets/catalog-images/cleaning-laundry-brands-d315af.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1649005011845-ef225c89da86?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Sufyan",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-white-plastic-bottle-with-a-blue-cap-9wCOqpBJRHI",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Rin Bar 250g",
      "unit": "piece",
      "price": 110,
      "icon": "🧼",
      "image": "assets/catalog-images/cleaning-laundry-brands-d315af.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1649005011845-ef225c89da86?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Sufyan",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-white-plastic-bottle-with-a-blue-cap-9wCOqpBJRHI",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Fabric Softener 1 Litre",
      "unit": "piece",
      "price": 750,
      "icon": "👕",
      "image": "assets/catalog-images/fabric-softener-48b466.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1649005011845-ef225c89da86?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Sufyan",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-white-plastic-bottle-with-a-blue-cap-9wCOqpBJRHI",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Dettol Antiseptic 500ml",
      "unit": "piece",
      "price": 850,
      "icon": "🧴",
      "image": "assets/catalog-images/dettol-antiseptic-v2-55c7cf.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1649005011845-ef225c89da86?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Sufyan",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-white-plastic-bottle-with-a-blue-cap-9wCOqpBJRHI",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Dettol Handwash 200ml",
      "unit": "piece",
      "price": 450,
      "icon": "🧴",
      "nameUrdu": "ہینڈ واش",
      "image": "assets/catalog-images/cleaning-laundry-brands-d315af.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1649005011845-ef225c89da86?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Sufyan",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-white-plastic-bottle-with-a-blue-cap-9wCOqpBJRHI",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Safeguard Handwash 200ml",
      "unit": "piece",
      "price": 420,
      "icon": "🧴",
      "nameUrdu": "ہینڈ واش",
      "image": "assets/catalog-images/cleaning-laundry-brands-d315af.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1649005011845-ef225c89da86?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Sufyan",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-white-plastic-bottle-with-a-blue-cap-9wCOqpBJRHI",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Floor Cleaner 1 Litre",
      "unit": "piece",
      "price": 550,
      "icon": "🧹",
      "nameUrdu": "فرش صاف",
      "image": "assets/catalog-images/floor-cleaner-738cec.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1649005011845-ef225c89da86?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Sufyan",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-white-plastic-bottle-with-a-blue-cap-9wCOqpBJRHI",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Glass Cleaner 500ml",
      "unit": "piece",
      "price": 450,
      "icon": "🪟",
      "nameUrdu": "شیشہ صاف",
      "image": "assets/catalog-images/glass-cleaner-f8528a.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1649005011845-ef225c89da86?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Sufyan",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-white-plastic-bottle-with-a-blue-cap-9wCOqpBJRHI",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Dish Bar (Vim) 200g",
      "unit": "piece",
      "price": 150,
      "icon": "🍽️",
      "image": "assets/catalog-images/cleaning-laundry-brands-d315af.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1649005011845-ef225c89da86?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Sufyan",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-white-plastic-bottle-with-a-blue-cap-9wCOqpBJRHI",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Steel Wool Pads (Pack)",
      "unit": "packet",
      "price": 180,
      "icon": "🧽",
      "image": "assets/catalog-images/steel-wool-pads-568a31.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1649005011845-ef225c89da86?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Sufyan",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-white-plastic-bottle-with-a-blue-cap-9wCOqpBJRHI",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Tissues Box 200ct",
      "unit": "box",
      "price": 350,
      "icon": "🧻",
      "nameUrdu": "ٹشو",
      "image": "assets/catalog-images/cleaning-laundry-brands-d315af.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1649005011845-ef225c89da86?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Sufyan",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-white-plastic-bottle-with-a-blue-cap-9wCOqpBJRHI",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Kitchen Towel Roll",
      "unit": "piece",
      "price": 420,
      "icon": "🧻",
      "nameUrdu": "کچن ٹاول",
      "image": "assets/catalog-images/kitchen-towel-roll-v2-25b441.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1649005011845-ef225c89da86?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Sufyan",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-white-plastic-bottle-with-a-blue-cap-9wCOqpBJRHI",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     }
    ],
    "image": "assets/catalog-images/cleaning-laundry-brands-d315af.webp",
    "imageUrl": "https://images.unsplash.com/photo-1649005011845-ef225c89da86?w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Sufyan",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/a-white-plastic-bottle-with-a-blue-cap-9wCOqpBJRHI",
     "source": "Unsplash"
    }
   },
   {
    "name": "Pet Food & Household Misc",
    "items": [
     {
      "name": "Dog Food 1kg (Pedigree)",
      "unit": "packet",
      "price": 1650,
      "icon": "🐕",
      "nameUrdu": "کتوں کا کھانا",
      "image": "assets/catalog-images/dog-food-6d32dd.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1591946559594-8c6d3b7391eb?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGV0JTIwZm9vZCUyMGRvZyUyMGJvd2x8ZW58MXx8fHwxNzkyMjU1NDk0fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "FLOUFFY",
       "profileUrl": "https://unsplash.com/@theflouffy",
       "photoUrl": "https://unsplash.com/photos/dog-sitting-by-empty-bowl--dMO9Dm-gkU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/-dMO9Dm-gkU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGV0JTIwZm9vZCUyMGRvZyUyMGJvd2x8ZW58MXx8fHwxNzkyMjU1NDk0fDA"
     },
     {
      "name": "Cat Food 1kg (Whiskas)",
      "unit": "packet",
      "price": 1750,
      "icon": "🐈",
      "nameUrdu": "بلیوں کا کھانا",
      "image": "assets/catalog-images/cat-food-146ea3.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1591946559594-8c6d3b7391eb?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGV0JTIwZm9vZCUyMGRvZyUyMGJvd2x8ZW58MXx8fHwxNzkyMjU1NDk0fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "FLOUFFY",
       "profileUrl": "https://unsplash.com/@theflouffy",
       "photoUrl": "https://unsplash.com/photos/dog-sitting-by-empty-bowl--dMO9Dm-gkU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/-dMO9Dm-gkU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGV0JTIwZm9vZCUyMGRvZyUyMGJvd2x8ZW58MXx8fHwxNzkyMjU1NDk0fDA"
     },
     {
      "name": "Bird Seed Mix 1kg",
      "unit": "packet",
      "price": 450,
      "icon": "🐦",
      "nameUrdu": "پرندوں کا دانہ",
      "image": "assets/catalog-images/bird-seed-mix-b243d5.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1591946559594-8c6d3b7391eb?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGV0JTIwZm9vZCUyMGRvZyUyMGJvd2x8ZW58MXx8fHwxNzkyMjU1NDk0fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "FLOUFFY",
       "profileUrl": "https://unsplash.com/@theflouffy",
       "photoUrl": "https://unsplash.com/photos/dog-sitting-by-empty-bowl--dMO9Dm-gkU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/-dMO9Dm-gkU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGV0JTIwZm9vZCUyMGRvZyUyMGJvd2x8ZW58MXx8fHwxNzkyMjU1NDk0fDA"
     },
     {
      "name": "Batteries AA (Pack of 4)",
      "unit": "packet",
      "price": 320,
      "icon": "🔋",
      "image": "assets/catalog-images/batteries-aa-cdf3b7.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1591946559594-8c6d3b7391eb?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGV0JTIwZm9vZCUyMGRvZyUyMGJvd2x8ZW58MXx8fHwxNzkyMjU1NDk0fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "FLOUFFY",
       "profileUrl": "https://unsplash.com/@theflouffy",
       "photoUrl": "https://unsplash.com/photos/dog-sitting-by-empty-bowl--dMO9Dm-gkU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/-dMO9Dm-gkU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGV0JTIwZm9vZCUyMGRvZyUyMGJvd2x8ZW58MXx8fHwxNzkyMjU1NDk0fDA"
     },
     {
      "name": "LED Bulb 12W",
      "unit": "piece",
      "price": 450,
      "icon": "💡",
      "nameUrdu": "بلب",
      "image": "assets/catalog-images/led-bulb-0c9ff1.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1591946559594-8c6d3b7391eb?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGV0JTIwZm9vZCUyMGRvZyUyMGJvd2x8ZW58MXx8fHwxNzkyMjU1NDk0fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "FLOUFFY",
       "profileUrl": "https://unsplash.com/@theflouffy",
       "photoUrl": "https://unsplash.com/photos/dog-sitting-by-empty-bowl--dMO9Dm-gkU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/-dMO9Dm-gkU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGV0JTIwZm9vZCUyMGRvZyUyMGJvd2x8ZW58MXx8fHwxNzkyMjU1NDk0fDA"
     },
     {
      "name": "Extension Board 4-Socket",
      "unit": "piece",
      "price": 850,
      "icon": "🔌",
      "image": "assets/catalog-images/extension-board-4-socket-933c98.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1591946559594-8c6d3b7391eb?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGV0JTIwZm9vZCUyMGRvZyUyMGJvd2x8ZW58MXx8fHwxNzkyMjU1NDk0fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "FLOUFFY",
       "profileUrl": "https://unsplash.com/@theflouffy",
       "photoUrl": "https://unsplash.com/photos/dog-sitting-by-empty-bowl--dMO9Dm-gkU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/-dMO9Dm-gkU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGV0JTIwZm9vZCUyMGRvZyUyMGJvd2x8ZW58MXx8fHwxNzkyMjU1NDk0fDA"
     },
     {
      "name": "Folding Umbrella",
      "unit": "piece",
      "price": 1250,
      "icon": "☂️",
      "nameUrdu": "چھتری",
      "image": "assets/catalog-images/folding-umbrella-bc46f7.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1591946559594-8c6d3b7391eb?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGV0JTIwZm9vZCUyMGRvZyUyMGJvd2x8ZW58MXx8fHwxNzkyMjU1NDk0fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "FLOUFFY",
       "profileUrl": "https://unsplash.com/@theflouffy",
       "photoUrl": "https://unsplash.com/photos/dog-sitting-by-empty-bowl--dMO9Dm-gkU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/-dMO9Dm-gkU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGV0JTIwZm9vZCUyMGRvZyUyMGJvd2x8ZW58MXx8fHwxNzkyMjU1NDk0fDA"
     },
     {
      "name": "Reusable Shopping Bag",
      "unit": "piece",
      "price": 120,
      "icon": "🛍️",
      "nameUrdu": "تھیلی",
      "image": "assets/catalog-images/reusable-shopping-bag-2dd56c.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1591946559594-8c6d3b7391eb?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGV0JTIwZm9vZCUyMGRvZyUyMGJvd2x8ZW58MXx8fHwxNzkyMjU1NDk0fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "FLOUFFY",
       "profileUrl": "https://unsplash.com/@theflouffy",
       "photoUrl": "https://unsplash.com/photos/dog-sitting-by-empty-bowl--dMO9Dm-gkU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/-dMO9Dm-gkU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGV0JTIwZm9vZCUyMGRvZyUyMGJvd2x8ZW58MXx8fHwxNzkyMjU1NDk0fDA"
     },
     {
      "name": "Aluminium Foil 30m",
      "unit": "piece",
      "price": 650,
      "icon": "🥡",
      "imageUrl": "https://images.unsplash.com/photo-1591946559594-8c6d3b7391eb?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGV0JTIwZm9vZCUyMGRvZyUyMGJvd2x8ZW58MXx8fHwxNzkyMjU1NDk0fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "FLOUFFY",
       "profileUrl": "https://unsplash.com/@theflouffy",
       "photoUrl": "https://unsplash.com/photos/dog-sitting-by-empty-bowl--dMO9Dm-gkU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/-dMO9Dm-gkU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGV0JTIwZm9vZCUyMGRvZyUyMGJvd2x8ZW58MXx8fHwxNzkyMjU1NDk0fDA"
     },
     {
      "name": "Cling Wrap 30m",
      "unit": "piece",
      "price": 550,
      "icon": "🫗",
      "imageUrl": "https://images.unsplash.com/photo-1591946559594-8c6d3b7391eb?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGV0JTIwZm9vZCUyMGRvZyUyMGJvd2x8ZW58MXx8fHwxNzkyMjU1NDk0fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "FLOUFFY",
       "profileUrl": "https://unsplash.com/@theflouffy",
       "photoUrl": "https://unsplash.com/photos/dog-sitting-by-empty-bowl--dMO9Dm-gkU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/-dMO9Dm-gkU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGV0JTIwZm9vZCUyMGRvZyUyMGJvd2x8ZW58MXx8fHwxNzkyMjU1NDk0fDA"
     },
     {
      "name": "Paper Plates (Pack of 25)",
      "unit": "packet",
      "price": 420,
      "icon": "🍽️",
      "nameUrdu": "کاغذ کی پلیٹیں",
      "image": "assets/catalog-images/paper-plates-d940f2.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1591946559594-8c6d3b7391eb?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGV0JTIwZm9vZCUyMGRvZyUyMGJvd2x8ZW58MXx8fHwxNzkyMjU1NDk0fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "FLOUFFY",
       "profileUrl": "https://unsplash.com/@theflouffy",
       "photoUrl": "https://unsplash.com/photos/dog-sitting-by-empty-bowl--dMO9Dm-gkU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/-dMO9Dm-gkU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGV0JTIwZm9vZCUyMGRvZyUyMGJvd2x8ZW58MXx8fHwxNzkyMjU1NDk0fDA"
     },
     {
      "name": "Disposable Cups (Pack of 50)",
      "unit": "packet",
      "price": 380,
      "icon": "🥤",
      "nameUrdu": "ڈسپوزایبل کپ",
      "image": "assets/catalog-images/disposable-cups-ce6c31.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1591946559594-8c6d3b7391eb?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGV0JTIwZm9vZCUyMGRvZyUyMGJvd2x8ZW58MXx8fHwxNzkyMjU1NDk0fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "FLOUFFY",
       "profileUrl": "https://unsplash.com/@theflouffy",
       "photoUrl": "https://unsplash.com/photos/dog-sitting-by-empty-bowl--dMO9Dm-gkU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/-dMO9Dm-gkU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGV0JTIwZm9vZCUyMGRvZyUyMGJvd2x8ZW58MXx8fHwxNzkyMjU1NDk0fDA"
     },
     {
      "name": "Instant Coffee 100g",
      "unit": "packet",
      "price": 1150,
      "icon": "☕",
      "nameUrdu": "کافی",
      "image": "assets/catalog-images/instant-coffee-100g-91aec3.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1591946559594-8c6d3b7391eb?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGV0JTIwZm9vZCUyMGRvZyUyMGJvd2x8ZW58MXx8fHwxNzkyMjU1NDk0fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "FLOUFFY",
       "profileUrl": "https://unsplash.com/@theflouffy",
       "photoUrl": "https://unsplash.com/photos/dog-sitting-by-empty-bowl--dMO9Dm-gkU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/-dMO9Dm-gkU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGV0JTIwZm9vZCUyMGRvZyUyMGJvd2x8ZW58MXx8fHwxNzkyMjU1NDk0fDA"
     },
     {
      "name": "Green Tea Bags 50ct",
      "unit": "box",
      "price": 650,
      "icon": "🍃",
      "imageUrl": "https://images.unsplash.com/photo-1591946559594-8c6d3b7391eb?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGV0JTIwZm9vZCUyMGRvZyUyMGJvd2x8ZW58MXx8fHwxNzkyMjU1NDk0fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "FLOUFFY",
       "profileUrl": "https://unsplash.com/@theflouffy",
       "photoUrl": "https://unsplash.com/photos/dog-sitting-by-empty-bowl--dMO9Dm-gkU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/-dMO9Dm-gkU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGV0JTIwZm9vZCUyMGRvZyUyMGJvd2x8ZW58MXx8fHwxNzkyMjU1NDk0fDA"
     },
     {
      "name": "Energy Drink (Sting) 500ml",
      "unit": "piece",
      "price": 180,
      "icon": "⚡",
      "image": "assets/catalog-images/energy-drink-be5ce0.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1591946559594-8c6d3b7391eb?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGV0JTIwZm9vZCUyMGRvZyUyMGJvd2x8ZW58MXx8fHwxNzkyMjU1NDk0fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "FLOUFFY",
       "profileUrl": "https://unsplash.com/@theflouffy",
       "photoUrl": "https://unsplash.com/photos/dog-sitting-by-empty-bowl--dMO9Dm-gkU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/-dMO9Dm-gkU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGV0JTIwZm9vZCUyMGRvZyUyMGJvd2x8ZW58MXx8fHwxNzkyMjU1NDk0fDA"
     },
     {
      "name": "Diet Soda 1.5 Litre",
      "unit": "piece",
      "price": 260,
      "icon": "🥤",
      "image": "assets/catalog-images/diet-soda-a98084.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1591946559594-8c6d3b7391eb?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGV0JTIwZm9vZCUyMGRvZyUyMGJvd2x8ZW58MXx8fHwxNzkyMjU1NDk0fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "FLOUFFY",
       "profileUrl": "https://unsplash.com/@theflouffy",
       "photoUrl": "https://unsplash.com/photos/dog-sitting-by-empty-bowl--dMO9Dm-gkU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/-dMO9Dm-gkU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGV0JTIwZm9vZCUyMGRvZyUyMGJvd2x8ZW58MXx8fHwxNzkyMjU1NDk0fDA"
     }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1591946559594-8c6d3b7391eb?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGV0JTIwZm9vZCUyMGRvZyUyMGJvd2x8ZW58MXx8fHwxNzkyMjU1NDk0fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "FLOUFFY",
     "profileUrl": "https://unsplash.com/@theflouffy",
     "photoUrl": "https://unsplash.com/photos/dog-sitting-by-empty-bowl--dMO9Dm-gkU",
     "source": "Unsplash"
    }
   }
  ]
 },
 {
  "shopType": "Dairy & Milk Shop",
  "icon": "🥛",
  "categories": [
   {
    "name": "Fresh Milk",
    "items": [
     {
      "name": "Fresh Cow Milk 1 Litre",
      "unit": "litre",
      "price": 180,
      "icon": "🥛",
      "nameUrdu": "گائے کا دودھ",
      "image": "assets/catalog-images/cow-milk-fdca5f.webp",
      "imageLevel": "item"
     },
     {
      "name": "Fresh Buffalo Milk 1 Litre",
      "unit": "litre",
      "price": 200,
      "icon": "🥛",
      "nameUrdu": "بھینس کا دودھ",
      "image": "assets/catalog-images/buffalo-milk-e12b55.webp",
      "imageLevel": "item"
     },
     {
      "name": "Toned Milk 1 Litre",
      "unit": "litre",
      "price": 190,
      "icon": "🥛",
      "nameUrdu": "ٹونڈ دودھ",
      "image": "assets/catalog-images/toned-milk-1e17c7.webp",
      "imageLevel": "item"
     },
     {
      "name": "Skimmed Milk 1 Litre",
      "unit": "litre",
      "price": 170,
      "icon": "🥛",
      "nameUrdu": "بغیر ملائی دودھ",
      "image": "assets/catalog-images/skimmed-milk-c6628e.webp",
      "imageLevel": "item"
     },
     {
      "name": "Full Cream Milk Pouch 1 Litre",
      "unit": "packet",
      "price": 210,
      "icon": "🥛",
      "nameUrdu": "دودھ",
      "imageUrl": "https://images.unsplash.com/photo-1639151082235-406d8eb262b9?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Mary Skrynnikova",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bottle-of-milk-next-to-a-glass-of-milk-c6TKtsi8C1k",
       "source": "Unsplash"
      }
     },
     {
      "name": "Fresh Milk Half Litre",
      "unit": "litre",
      "price": 95,
      "icon": "🥛",
      "nameUrdu": "دودھ",
      "image": "assets/catalog-images/milk-half-litre-0872ce.webp",
      "imageLevel": "item"
     },
     {
      "name": "Boiled Milk (Ready) 1 Litre",
      "unit": "litre",
      "price": 190,
      "icon": "🥛",
      "nameUrdu": "ابلا دودھ",
      "image": "assets/catalog-images/boiled-milk-c7eae8.webp",
      "imageLevel": "item"
     },
     {
      "name": "Camel Milk 1 Litre",
      "unit": "litre",
      "price": 350,
      "icon": "🐪",
      "nameUrdu": "اونٹ کا دودھ"
     }
    ],
    "image": "assets/catalog-images/fresh-milk-46310d.webp",
    "imageUrl": "https://images.unsplash.com/photo-1639151082235-406d8eb262b9?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "Mary Skrynnikova",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/a-bottle-of-milk-next-to-a-glass-of-milk-c6TKtsi8C1k",
     "source": "Unsplash"
    }
   },
   {
    "name": "Yogurt & Curd",
    "items": [
     {
      "name": "Fresh Dahi 1kg",
      "unit": "kg",
      "price": 320,
      "icon": "🍶",
      "nameUrdu": "دہی",
      "image": "assets/catalog-images/dahi-v2-7436e6.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1571212515416-fef01fc43637?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Ym93bCUyMG9mJTIweW9ndXJ0fGVufDF8fHx8MTc5MjI1NTUyMXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "micheile henderson",
       "profileUrl": "https://unsplash.com/@micheile",
       "photoUrl": "https://unsplash.com/photos/a-bowl-of-yogurt-with-a-spoon-in-it-NFHeBysjCTI",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/NFHeBysjCTI/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Ym93bCUyMG9mJTIweW9ndXJ0fGVufDF8fHx8MTc5MjI1NTUyMXww",
      "imageSource": "unsplash"
     },
     {
      "name": "Fresh Dahi 500g",
      "unit": "piece",
      "price": 165,
      "icon": "🍶",
      "nameUrdu": "دہی",
      "image": "assets/catalog-images/yogurt-curd-3dedcb.webp",
      "imageLevel": "category"
     },
     {
      "name": "Sweet Yogurt 1kg",
      "unit": "kg",
      "price": 340,
      "icon": "🍶",
      "nameUrdu": "میٹھا دہی",
      "imageUrl": "https://images.unsplash.com/photo-1571212515416-fef01fc43637?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "micheile henderson",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bowl-of-yogurt-with-a-spoon-in-it-NFHeBysjCTI",
       "source": "Unsplash"
      }
     },
     {
      "name": "Greek Yogurt 400g",
      "unit": "piece",
      "price": 650,
      "icon": "🍶",
      "nameUrdu": "یونانی دہی",
      "image": "assets/catalog-images/yogurt-curd-3dedcb.webp",
      "imageLevel": "category"
     },
     {
      "name": "Flavoured Yogurt 200g",
      "unit": "piece",
      "price": 180,
      "icon": "🍶",
      "nameUrdu": "ذائقہ دار دہی",
      "image": "assets/catalog-images/yogurt-curd-3dedcb.webp",
      "imageLevel": "category"
     },
     {
      "name": "Raita Mix 500g",
      "unit": "piece",
      "price": 220,
      "icon": "🍶",
      "nameUrdu": "رائتہ",
      "image": "assets/catalog-images/yogurt-curd-3dedcb.webp",
      "imageLevel": "category"
     },
     {
      "name": "Buttermilk (Chaas) 1 Litre",
      "unit": "litre",
      "price": 150,
      "icon": "🥛",
      "nameUrdu": "چھاس",
      "image": "assets/catalog-images/buttermilk-814935.webp",
      "imageLevel": "item"
     },
     {
      "name": "Dahi Bara Mix 500g",
      "unit": "packet",
      "price": 280,
      "icon": "🍶",
      "nameUrdu": "دہی بڑا مکس",
      "image": "assets/catalog-images/yogurt-curd-3dedcb.webp",
      "imageLevel": "category"
     }
    ],
    "image": "assets/catalog-images/yogurt-curd-3dedcb.webp"
   },
   {
    "name": "Butter, Cream & Cheese",
    "items": [
     {
      "name": "White Butter 500g",
      "unit": "piece",
      "price": 850,
      "icon": "🧈",
      "nameUrdu": "سفید مکھن",
      "imageUrl": "https://images.unsplash.com/photo-1719148162837-63d2f256231f?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Marine Le Gac",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-piece-of-butter-sitting-on-top-of-a-white-plate-4X7eA9zN8mg",
       "source": "Unsplash"
      }
     },
     {
      "name": "Salted Butter 250g",
      "unit": "piece",
      "price": 480,
      "icon": "🧈",
      "nameUrdu": "نمکین مکھن",
      "image": "assets/catalog-images/butter-cream-cheese-4e0dab.webp",
      "imageLevel": "category"
     },
     {
      "name": "Desi Ghee 500g",
      "unit": "piece",
      "price": 1150,
      "icon": "🧈",
      "nameUrdu": "دیسی گھی",
      "image": "assets/catalog-images/butter-cream-cheese-4e0dab.webp",
      "imageLevel": "category"
     },
     {
      "name": "Desi Ghee 1kg",
      "unit": "kg",
      "price": 2250,
      "icon": "🧈",
      "nameUrdu": "دیسی گھی",
      "image": "assets/catalog-images/desi-ghee-0c2de9.webp",
      "imageLevel": "item"
     },
     {
      "name": "Fresh Cream (Malai) 500g",
      "unit": "piece",
      "price": 550,
      "icon": "🥛",
      "nameUrdu": "ملائی",
      "imageUrl": "https://images.unsplash.com/photo-1786695144564-d1cd05367032?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Le Tia",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/whipped-cream-in-pink-bowl--IT3JFWGKeM",
       "source": "Unsplash"
      }
     },
     {
      "name": "Whipped Cream 250ml",
      "unit": "piece",
      "price": 550,
      "icon": "🍦",
      "image": "assets/catalog-images/whipped-cream-f3df33.webp",
      "imageLevel": "item"
     },
     {
      "name": "Mozzarella Cheese 500g",
      "unit": "piece",
      "price": 1150,
      "icon": "🧀",
      "image": "assets/catalog-images/butter-cream-cheese-4e0dab.webp",
      "imageLevel": "category"
     },
     {
      "name": "Cheddar Cheese 500g",
      "unit": "piece",
      "price": 1250,
      "icon": "🧀",
      "image": "assets/catalog-images/butter-cream-cheese-4e0dab.webp",
      "imageLevel": "category"
     },
     {
      "name": "Cheese Slices 200g",
      "unit": "packet",
      "price": 450,
      "icon": "🧀",
      "image": "assets/catalog-images/butter-cream-cheese-4e0dab.webp",
      "imageLevel": "category"
     },
     {
      "name": "Processed Cheese 400g",
      "unit": "piece",
      "price": 850,
      "icon": "🧀",
      "image": "assets/catalog-images/butter-cream-cheese-4e0dab.webp",
      "imageLevel": "category"
     },
     {
      "name": "Koya (Khoya) 500g",
      "unit": "piece",
      "price": 650,
      "icon": "🍮",
      "nameUrdu": "کھویا",
      "image": "assets/catalog-images/butter-cream-cheese-4e0dab.webp",
      "imageLevel": "category"
     },
     {
      "name": "Kalakand 500g",
      "unit": "piece",
      "price": 750,
      "icon": "🍬",
      "nameUrdu": "کلاکند",
      "image": "assets/catalog-images/butter-cream-cheese-4e0dab.webp",
      "imageLevel": "category"
     }
    ],
    "image": "assets/catalog-images/butter-cream-cheese-4e0dab.webp"
   },
   {
    "name": "Paneer & Desserts",
    "items": [
     {
      "name": "Fresh Paneer 500g",
      "unit": "piece",
      "price": 750,
      "icon": "🧀",
      "nameUrdu": "پنیر",
      "imageUrl": "https://images.unsplash.com/photo-1632200729570-1043effd1b77?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Aleksey Melkomukov",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-piece-of-cake-sitting-on-top-of-a-wooden-cutting-board-OxUaBR0ORb0",
       "source": "Unsplash"
      }
     },
     {
      "name": "Masala Paneer 500g",
      "unit": "piece",
      "price": 850,
      "icon": "🧀",
      "nameUrdu": "مصالحہ پنیر"
     },
     {
      "name": "Rabri 500g",
      "unit": "piece",
      "price": 850,
      "icon": "🍮",
      "nameUrdu": "ربڑی"
     },
     {
      "name": "Rasmalai 500g (4pc)",
      "unit": "piece",
      "price": 750,
      "icon": "🍮",
      "nameUrdu": "رس ملائی"
     },
     {
      "name": "Kheer Mix 500g",
      "unit": "piece",
      "price": 450,
      "icon": "🍚",
      "nameUrdu": "کھیر",
      "imageUrl": "https://images.unsplash.com/photo-1777613112969-d7511ddfbe15?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Adil Murshed",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bowl-of-creamy-rice-pudding-with-marigold-garland-9Gm-wNAaWzg",
       "source": "Unsplash"
      }
     },
     {
      "name": "Gulab Jamun Tin 1kg",
      "unit": "piece",
      "price": 1150,
      "icon": "🍩",
      "nameUrdu": "گلاب جامن",
      "imageUrl": "https://images.unsplash.com/photo-1695568180070-8b5acead5cf4?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Gaurav Kumar",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-pile-of-doughnuts-sitting-on-top-of-a-white-plate-bm1dJYcGJLw",
       "source": "Unsplash"
      }
     },
     {
      "name": "Barfi Mix 500g",
      "unit": "piece",
      "price": 550,
      "icon": "🍬",
      "nameUrdu": "برفی",
      "imageUrl": "https://images.unsplash.com/photo-1782033032439-a2c656ca2f59?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Bonala Yellender",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-display-case-filled-with-various-delicious-pastries-and-sweets-wMPs7gJCNdc",
       "source": "Unsplash"
      }
     },
     {
      "name": "Custard Powder 250g",
      "unit": "packet",
      "price": 320,
      "icon": "🍮",
      "nameUrdu": "کسٹرڈ"
     }
    ],
    "image": "assets/catalog-images/paneer-desserts-v2-7575fa.webp",
    "imageUrl": "https://images.unsplash.com/photo-1777613112969-d7511ddfbe15?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "Adil Murshed",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/a-bowl-of-creamy-rice-pudding-with-marigold-garland-9Gm-wNAaWzg",
     "source": "Unsplash"
    }
   },
   {
    "name": "Eggs",
    "items": [
     {
      "name": "Farm Eggs 1 Dozen",
      "unit": "dozen",
      "price": 420,
      "icon": "🥚",
      "nameUrdu": "انڈے",
      "image": "assets/catalog-images/farm-eggs-1-dozen-ed9fe3.webp",
      "imageLevel": "item"
     },
     {
      "name": "Desi Eggs 1 Dozen",
      "unit": "dozen",
      "price": 650,
      "icon": "🥚",
      "nameUrdu": "دیسی انڈے",
      "image": "assets/catalog-images/eggs-9890f0.webp",
      "imageLevel": "category"
     },
     {
      "name": "Duck Eggs Half Dozen",
      "unit": "dozen",
      "price": 550,
      "icon": "🦆",
      "nameUrdu": "بطخ کے انڈے",
      "imageUrl": "https://images.unsplash.com/photo-1583219691003-11f9a428e212?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Ines Iachelini",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-egg-on-blue-egg-tray-721Bop6PA6g",
       "source": "Unsplash"
      }
     },
     {
      "name": "Boiled Eggs (Ready, 4pc)",
      "unit": "piece",
      "price": 160,
      "icon": "🥚",
      "nameUrdu": "ابلے انڈے",
      "image": "assets/catalog-images/boiled-eggs-b84f34.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/eggs-9890f0.webp"
   }
  ]
 },
 {
  "shopType": "Fruits & Vegetables",
  "icon": "🥬",
  "categories": [
   {
    "name": "Vegetables",
    "items": [
     {
      "name": "Tomatoes 1kg",
      "unit": "kg",
      "price": 180,
      "icon": "🍅",
      "nameUrdu": "ٹماٹر",
      "image": "assets/catalog-images/tomatoes-748108.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Marisol Benitez",
       "profileUrl": "https://unsplash.com/@marisolbenitez",
       "photoUrl": "https://unsplash.com/photos/pile-of-vegetables-QvkAQTNj4zk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/QvkAQTNj4zk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA"
     },
     {
      "name": "Onions 1kg",
      "unit": "kg",
      "price": 150,
      "icon": "🧅",
      "nameUrdu": "پیاز",
      "image": "assets/catalog-images/onions-7810b2.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Marisol Benitez",
       "profileUrl": "https://unsplash.com/@marisolbenitez",
       "photoUrl": "https://unsplash.com/photos/pile-of-vegetables-QvkAQTNj4zk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/QvkAQTNj4zk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA"
     },
     {
      "name": "Potatoes 1kg",
      "unit": "kg",
      "price": 120,
      "icon": "🥔",
      "nameUrdu": "آلو",
      "image": "assets/catalog-images/potatoes-b1bebf.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Marisol Benitez",
       "profileUrl": "https://unsplash.com/@marisolbenitez",
       "photoUrl": "https://unsplash.com/photos/pile-of-vegetables-QvkAQTNj4zk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/QvkAQTNj4zk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA"
     },
     {
      "name": "Cauliflower 1kg",
      "unit": "kg",
      "price": 140,
      "icon": "🥦",
      "nameUrdu": "پھول گوبھی",
      "image": "assets/catalog-images/cauliflower-7ddf79.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Marisol Benitez",
       "profileUrl": "https://unsplash.com/@marisolbenitez",
       "photoUrl": "https://unsplash.com/photos/pile-of-vegetables-QvkAQTNj4zk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/QvkAQTNj4zk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA"
     },
     {
      "name": "Cabbage 1kg",
      "unit": "kg",
      "price": 120,
      "icon": "🥬",
      "nameUrdu": "بند گوبھی",
      "image": "assets/catalog-images/cabbage-d846ed.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Marisol Benitez",
       "profileUrl": "https://unsplash.com/@marisolbenitez",
       "photoUrl": "https://unsplash.com/photos/pile-of-vegetables-QvkAQTNj4zk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/QvkAQTNj4zk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA"
     },
     {
      "name": "Okra (Bhindi) 1kg",
      "unit": "kg",
      "price": 220,
      "icon": "🌿",
      "nameUrdu": "بھنڈی",
      "image": "assets/catalog-images/okra-85422d.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Marisol Benitez",
       "profileUrl": "https://unsplash.com/@marisolbenitez",
       "photoUrl": "https://unsplash.com/photos/pile-of-vegetables-QvkAQTNj4zk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/QvkAQTNj4zk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA"
     },
     {
      "name": "Bitter Gourd (Karela) 1kg",
      "unit": "kg",
      "price": 200,
      "icon": "🥒",
      "nameUrdu": "کریلا",
      "image": "assets/catalog-images/bitter-gourd-eee303.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Marisol Benitez",
       "profileUrl": "https://unsplash.com/@marisolbenitez",
       "photoUrl": "https://unsplash.com/photos/pile-of-vegetables-QvkAQTNj4zk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/QvkAQTNj4zk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA"
     },
     {
      "name": "Bottle Gourd (Lauki) 1kg",
      "unit": "kg",
      "price": 130,
      "icon": "🥒",
      "nameUrdu": "لوکی",
      "image": "assets/catalog-images/bottle-gourd-7d79f4.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Marisol Benitez",
       "profileUrl": "https://unsplash.com/@marisolbenitez",
       "photoUrl": "https://unsplash.com/photos/pile-of-vegetables-QvkAQTNj4zk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/QvkAQTNj4zk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA"
     },
     {
      "name": "Ridge Gourd (Tori) 1kg",
      "unit": "kg",
      "price": 160,
      "icon": "🥒",
      "nameUrdu": "توری",
      "image": "assets/catalog-images/ridge-gourd-57e901.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Marisol Benitez",
       "profileUrl": "https://unsplash.com/@marisolbenitez",
       "photoUrl": "https://unsplash.com/photos/pile-of-vegetables-QvkAQTNj4zk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/QvkAQTNj4zk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA"
     },
     {
      "name": "Eggplant (Baingan) 1kg",
      "unit": "kg",
      "price": 140,
      "icon": "🍆",
      "nameUrdu": "بینگن",
      "image": "assets/catalog-images/eggplant-b2585b.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Marisol Benitez",
       "profileUrl": "https://unsplash.com/@marisolbenitez",
       "photoUrl": "https://unsplash.com/photos/pile-of-vegetables-QvkAQTNj4zk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/QvkAQTNj4zk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA"
     },
     {
      "name": "Green Peas 1kg",
      "unit": "kg",
      "price": 260,
      "icon": "🫛",
      "nameUrdu": "مٹر",
      "image": "assets/catalog-images/green-peas-f1b009.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Marisol Benitez",
       "profileUrl": "https://unsplash.com/@marisolbenitez",
       "photoUrl": "https://unsplash.com/photos/pile-of-vegetables-QvkAQTNj4zk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/QvkAQTNj4zk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA"
     },
     {
      "name": "Carrots 1kg",
      "unit": "kg",
      "price": 130,
      "icon": "🥕",
      "nameUrdu": "گاجر",
      "image": "assets/catalog-images/carrots-431ff2.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Marisol Benitez",
       "profileUrl": "https://unsplash.com/@marisolbenitez",
       "photoUrl": "https://unsplash.com/photos/pile-of-vegetables-QvkAQTNj4zk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/QvkAQTNj4zk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA"
     },
     {
      "name": "Capsicum (Shimla Mirch) 1kg",
      "unit": "kg",
      "price": 280,
      "icon": "🫑",
      "nameUrdu": "شملہ مرچ",
      "image": "assets/catalog-images/capsicum-8e45ce.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Marisol Benitez",
       "profileUrl": "https://unsplash.com/@marisolbenitez",
       "photoUrl": "https://unsplash.com/photos/pile-of-vegetables-QvkAQTNj4zk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/QvkAQTNj4zk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA"
     },
     {
      "name": "Green Chillies 250g",
      "unit": "packet",
      "price": 80,
      "icon": "🌶️",
      "nameUrdu": "ہری مرچ",
      "image": "assets/catalog-images/vegetables-5d02db.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Marisol Benitez",
       "profileUrl": "https://unsplash.com/@marisolbenitez",
       "photoUrl": "https://unsplash.com/photos/pile-of-vegetables-QvkAQTNj4zk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/QvkAQTNj4zk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA",
      "imageSource": "unsplash"
     },
     {
      "name": "Ginger (Adrak) 250g",
      "unit": "packet",
      "price": 180,
      "icon": "🫚",
      "nameUrdu": "ادرک",
      "image": "assets/catalog-images/vegetables-5d02db.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Marisol Benitez",
       "profileUrl": "https://unsplash.com/@marisolbenitez",
       "photoUrl": "https://unsplash.com/photos/pile-of-vegetables-QvkAQTNj4zk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/QvkAQTNj4zk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA",
      "imageSource": "unsplash"
     },
     {
      "name": "Garlic (Lehsan) 250g",
      "unit": "packet",
      "price": 160,
      "icon": "🧄",
      "nameUrdu": "لہسن",
      "image": "assets/catalog-images/garlic-250g-fe888a.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Marisol Benitez",
       "profileUrl": "https://unsplash.com/@marisolbenitez",
       "photoUrl": "https://unsplash.com/photos/pile-of-vegetables-QvkAQTNj4zk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/QvkAQTNj4zk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA"
     },
     {
      "name": "Lemon 1 Dozen",
      "unit": "dozen",
      "price": 200,
      "icon": "🍋",
      "nameUrdu": "لیموں",
      "image": "assets/catalog-images/lemon-1-dozen-7ba44c.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Marisol Benitez",
       "profileUrl": "https://unsplash.com/@marisolbenitez",
       "photoUrl": "https://unsplash.com/photos/pile-of-vegetables-QvkAQTNj4zk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/QvkAQTNj4zk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA"
     },
     {
      "name": "Coriander Bunch",
      "unit": "piece",
      "price": 50,
      "icon": "🌿",
      "nameUrdu": "دھنیا",
      "image": "assets/catalog-images/coriander-bunch-165b93.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Marisol Benitez",
       "profileUrl": "https://unsplash.com/@marisolbenitez",
       "photoUrl": "https://unsplash.com/photos/pile-of-vegetables-QvkAQTNj4zk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/QvkAQTNj4zk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA"
     },
     {
      "name": "Mint Bunch (Podina)",
      "unit": "piece",
      "price": 50,
      "icon": "🌱",
      "nameUrdu": "پودینہ",
      "image": "assets/catalog-images/mint-bunch-b3be3b.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Marisol Benitez",
       "profileUrl": "https://unsplash.com/@marisolbenitez",
       "photoUrl": "https://unsplash.com/photos/pile-of-vegetables-QvkAQTNj4zk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/QvkAQTNj4zk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA"
     },
     {
      "name": "Green Onion Bunch",
      "unit": "piece",
      "price": 60,
      "icon": "🧅",
      "nameUrdu": "ہری پیاز",
      "image": "assets/catalog-images/green-onion-bunch-0cdf77.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Marisol Benitez",
       "profileUrl": "https://unsplash.com/@marisolbenitez",
       "photoUrl": "https://unsplash.com/photos/pile-of-vegetables-QvkAQTNj4zk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/QvkAQTNj4zk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA"
     },
     {
      "name": "French Beans 1kg",
      "unit": "kg",
      "price": 240,
      "icon": "🫛",
      "nameUrdu": "فرانسیسی پھلیاں",
      "image": "assets/catalog-images/french-beans-9e219d.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Marisol Benitez",
       "profileUrl": "https://unsplash.com/@marisolbenitez",
       "photoUrl": "https://unsplash.com/photos/pile-of-vegetables-QvkAQTNj4zk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/QvkAQTNj4zk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA"
     },
     {
      "name": "Turnip (Shaljam) 1kg",
      "unit": "kg",
      "price": 130,
      "icon": "🥕",
      "nameUrdu": "شلجم",
      "image": "assets/catalog-images/turnip-043a46.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Marisol Benitez",
       "profileUrl": "https://unsplash.com/@marisolbenitez",
       "photoUrl": "https://unsplash.com/photos/pile-of-vegetables-QvkAQTNj4zk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/QvkAQTNj4zk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA"
     },
     {
      "name": "Radish (Mooli) 1kg",
      "unit": "kg",
      "price": 120,
      "icon": "🥕",
      "nameUrdu": "مولی",
      "image": "assets/catalog-images/radish-f61051.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Marisol Benitez",
       "profileUrl": "https://unsplash.com/@marisolbenitez",
       "photoUrl": "https://unsplash.com/photos/pile-of-vegetables-QvkAQTNj4zk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/QvkAQTNj4zk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA"
     },
     {
      "name": "Arvi (Taro) 1kg",
      "unit": "kg",
      "price": 200,
      "icon": "🥔",
      "nameUrdu": "اروی",
      "image": "assets/catalog-images/arvi-5b241f.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Marisol Benitez",
       "profileUrl": "https://unsplash.com/@marisolbenitez",
       "photoUrl": "https://unsplash.com/photos/pile-of-vegetables-QvkAQTNj4zk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/QvkAQTNj4zk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA"
     },
     {
      "name": "Zucchini 1kg",
      "unit": "kg",
      "price": 280,
      "icon": "🥒",
      "image": "assets/catalog-images/zucchini-17bced.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Marisol Benitez",
       "profileUrl": "https://unsplash.com/@marisolbenitez",
       "photoUrl": "https://unsplash.com/photos/pile-of-vegetables-QvkAQTNj4zk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/QvkAQTNj4zk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA"
     },
     {
      "name": "Corn on Cob (Bhutta) 1pc",
      "unit": "piece",
      "price": 60,
      "icon": "🌽",
      "nameUrdu": "بھٹا",
      "image": "assets/catalog-images/corn-on-cob-403553.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Marisol Benitez",
       "profileUrl": "https://unsplash.com/@marisolbenitez",
       "photoUrl": "https://unsplash.com/photos/pile-of-vegetables-QvkAQTNj4zk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/QvkAQTNj4zk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA"
     },
     {
      "name": "Sweet Corn Kernels 500g",
      "unit": "packet",
      "price": 200,
      "icon": "🌽",
      "nameUrdu": "مکئی کے دانے",
      "image": "assets/catalog-images/vegetables-5d02db.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Marisol Benitez",
       "profileUrl": "https://unsplash.com/@marisolbenitez",
       "photoUrl": "https://unsplash.com/photos/pile-of-vegetables-QvkAQTNj4zk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/QvkAQTNj4zk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA",
      "imageSource": "unsplash"
     },
     {
      "name": "Broccoli 500g",
      "unit": "piece",
      "price": 320,
      "icon": "🥦",
      "image": "assets/catalog-images/vegetables-5d02db.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Marisol Benitez",
       "profileUrl": "https://unsplash.com/@marisolbenitez",
       "photoUrl": "https://unsplash.com/photos/pile-of-vegetables-QvkAQTNj4zk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/QvkAQTNj4zk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA",
      "imageSource": "unsplash"
     }
    ],
    "image": "assets/catalog-images/vegetables-5d02db.webp",
    "imageUrl": "https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VmVnZXRhYmxlc3xlbnwxfHx8fDE3OTIyNTU1MjR8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Marisol Benitez",
     "profileUrl": "https://unsplash.com/@marisolbenitez",
     "photoUrl": "https://unsplash.com/photos/pile-of-vegetables-QvkAQTNj4zk",
     "source": "Unsplash"
    }
   },
   {
    "name": "Root & Starchy",
    "items": [
     {
      "name": "Sweet Potato (Shakarkandi) 1kg",
      "unit": "kg",
      "price": 180,
      "icon": "🍠",
      "nameUrdu": "شکر قندی",
      "image": "assets/catalog-images/sweet-potato-65a730.webp",
      "imageLevel": "item"
     },
     {
      "name": "Tinda (Round Gourd) 1kg",
      "unit": "kg",
      "price": 150,
      "icon": "🥒",
      "nameUrdu": "ٹینڈا"
     },
     {
      "name": "Pumpkin (Kadu) 1kg",
      "unit": "kg",
      "price": 140,
      "icon": "🎃",
      "nameUrdu": "کدو",
      "image": "assets/catalog-images/pumpkin-423a2a.webp",
      "imageLevel": "item"
     },
     {
      "name": "Parwal (Pointed Gourd) 1kg",
      "unit": "kg",
      "price": 180,
      "icon": "🥒",
      "image": "assets/catalog-images/parwal-7344d8.webp",
      "imageLevel": "item"
     },
     {
      "name": "Beetroot 1kg",
      "unit": "kg",
      "price": 180,
      "icon": "🫚",
      "nameUrdu": "چقندر",
      "image": "assets/catalog-images/beetroot-4a9334.webp",
      "imageLevel": "item"
     },
     {
      "name": "Lotus Root (Bhein) 500g",
      "unit": "packet",
      "price": 260,
      "icon": "🪷",
      "nameUrdu": "بھین",
      "image": "assets/catalog-images/root-starchy-dce8ed.webp",
      "imageLevel": "category"
     },
     {
      "name": "Cassava (Kachalu) 1kg",
      "unit": "kg",
      "price": 200,
      "icon": "🥔",
      "nameUrdu": "کچالو",
      "image": "assets/catalog-images/cassava-675bc0.webp",
      "imageLevel": "item"
     },
     {
      "name": "Yam (Zameen Kand) 1kg",
      "unit": "kg",
      "price": 260,
      "icon": "🍠",
      "image": "assets/catalog-images/yam-b24cd3.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/root-starchy-dce8ed.webp"
   },
   {
    "name": "Leafy Greens",
    "items": [
     {
      "name": "Spinach (Palak) 1 Bunch",
      "unit": "piece",
      "price": 60,
      "icon": "🥬",
      "nameUrdu": "پالک",
      "image": "assets/catalog-images/spinach-1-bunch-6f8866.webp",
      "imageLevel": "item"
     },
     {
      "name": "Mustard Greens (Sarson) 1 Bunch",
      "unit": "piece",
      "price": 70,
      "icon": "🥬",
      "nameUrdu": "سرسوں کا ساگ",
      "image": "assets/catalog-images/mustard-greens-1-bunch-b22677.webp",
      "imageLevel": "item"
     },
     {
      "name": "Bathua (Chenopodium) 1 Bunch",
      "unit": "piece",
      "price": 60,
      "icon": "🌿",
      "nameUrdu": "بتھوا",
      "image": "assets/catalog-images/leafy-greens-e86a23.webp",
      "imageLevel": "category"
     },
     {
      "name": "Methi (Fenugreek Leaves) 1 Bunch",
      "unit": "piece",
      "price": 60,
      "icon": "🌿",
      "nameUrdu": "میتھی"
     },
     {
      "name": "Chaulai (Amaranth) 1 Bunch",
      "unit": "piece",
      "price": 60,
      "icon": "🥬",
      "nameUrdu": "چولائی",
      "image": "assets/catalog-images/leafy-greens-e86a23.webp",
      "imageLevel": "category"
     },
     {
      "name": "Lettuce 1 Head",
      "unit": "piece",
      "price": 150,
      "icon": "🥬",
      "nameUrdu": "سلاد پتا",
      "image": "assets/catalog-images/lettuce-1-head-6066bd.webp",
      "imageLevel": "item"
     },
     {
      "name": "Kale 500g",
      "unit": "packet",
      "price": 280,
      "icon": "🥬",
      "image": "assets/catalog-images/leafy-greens-e86a23.webp",
      "imageLevel": "category"
     },
     {
      "name": "Spring Greens Mix 500g",
      "unit": "packet",
      "price": 180,
      "icon": "🥬",
      "nameUrdu": "مکس ساگ",
      "image": "assets/catalog-images/leafy-greens-e86a23.webp",
      "imageLevel": "category"
     }
    ],
    "image": "assets/catalog-images/leafy-greens-e86a23.webp"
   },
   {
    "name": "Fruits",
    "items": [
     {
      "name": "Bananas 1 Dozen",
      "unit": "dozen",
      "price": 180,
      "icon": "🍌",
      "nameUrdu": "کیلے",
      "image": "assets/catalog-images/bananas-1-dozen-8261fc.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1768672991601-e72e8005142c?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Ilona Frey",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-close-up-of-ripe-yellow-bananas-clustered-together-CMLNsyI89UM",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Apples (Shimla) 1kg",
      "unit": "kg",
      "price": 320,
      "icon": "🍎",
      "nameUrdu": "سیب",
      "image": "assets/catalog-images/apples-92446c.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Matheus Cenali",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/bunch-of-red-apples-wXuzS9xR49M",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Oranges (Kinnow) 1 Dozen",
      "unit": "dozen",
      "price": 250,
      "icon": "🍊",
      "nameUrdu": "کنو",
      "image": "assets/catalog-images/oranges-1-dozen-v2-c65cf1.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1582226954923-96634f0c50b6?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "E L",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/orange-fruits-on-black-textile-DsZtxEVQRaM",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Malta Oranges 1 Dozen",
      "unit": "dozen",
      "price": 280,
      "icon": "🍊",
      "nameUrdu": "مالٹا",
      "image": "assets/catalog-images/fruits-a36ef4.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Jen Gunter",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/oranges-in-a-large-pile-A4BBdJQu2co",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Mangoes (Chaunsa) 1kg",
      "unit": "kg",
      "price": 320,
      "icon": "🥭",
      "nameUrdu": "آم",
      "image": "assets/catalog-images/mangoes-041ab4.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1787174314310-af23aecc8493?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "John Cameron",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/mangoes-with-smooth-yellow-skins-x2Pq4Qhowow",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Mangoes (Anwar Ratol) 1kg",
      "unit": "kg",
      "price": 380,
      "icon": "🥭",
      "nameUrdu": "آم",
      "image": "assets/catalog-images/mangoes-041ab4.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1787174314310-af23aecc8493?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "John Cameron",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/mangoes-with-smooth-yellow-skins-x2Pq4Qhowow",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Guava (Amrood) 1kg",
      "unit": "kg",
      "price": 180,
      "icon": "🍈",
      "nameUrdu": "امرود",
      "image": "assets/catalog-images/guava-a09345.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1693399991519-bef70bed19a2?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Yuliia Martsynkevych",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-pile-of-green-and-red-fruit-sitting-on-top-of-each-other-74Jt5kp0R9s",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Grapes (Green) 1kg",
      "unit": "kg",
      "price": 380,
      "icon": "🍇",
      "nameUrdu": "انگور",
      "image": "assets/catalog-images/grapes-af9d7c.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1632576883732-f131be0be48a?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Bernd Dittrich",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-close-up-of-a-bunch-of-green-grapes-l6sBLZr9mkQ",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Grapes (Black) 1kg",
      "unit": "kg",
      "price": 420,
      "icon": "🍇",
      "nameUrdu": "کالے انگور",
      "image": "assets/catalog-images/grapes-af9d7c.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1632576883732-f131be0be48a?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Bernd Dittrich",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-close-up-of-a-bunch-of-green-grapes-l6sBLZr9mkQ",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Papaya 1kg",
      "unit": "kg",
      "price": 200,
      "icon": "🍈",
      "nameUrdu": "پپیتا",
      "image": "assets/catalog-images/papaya-6098d1.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Bon Vivant",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/sliced-papaya-on-green-banana-leaf-Ooj1c6fhdFM",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Watermelon 1kg",
      "unit": "kg",
      "price": 120,
      "icon": "🍉",
      "nameUrdu": "تربوز",
      "image": "assets/catalog-images/watermelon-9aa80c.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Art Rachen",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/watermelon-fruit-on-white-table-izi5AnlbRIA",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Melon (Kharbooza) 1kg",
      "unit": "kg",
      "price": 150,
      "icon": "🍈",
      "nameUrdu": "خربوزہ",
      "image": "assets/catalog-images/melon-bc9134.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1636619299895-ecbb6c9f027f?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Alexandra Smielova",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-group-of-melons-with-one-cut-in-half-wf7jJIbMC-A",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Pomegranate (Anar) 1kg",
      "unit": "kg",
      "price": 420,
      "icon": "🔴",
      "nameUrdu": "انار",
      "image": "assets/catalog-images/pomegranate-50c5e7.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1541344999736-83eca272f6fc?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Jonas Renner",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/pomegranate-fruits-LOdAL10JejI",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Pears (Nashpati) 1kg",
      "unit": "kg",
      "price": 280,
      "icon": "🍐",
      "nameUrdu": "ناشپاتی",
      "image": "assets/catalog-images/pears-1be777.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1788512337872-7390113a5318?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/ripe-pears-in-bright-sunlight-znr18rfIHoc",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Peaches (Aaru) 1kg",
      "unit": "kg",
      "price": 280,
      "icon": "🍑",
      "nameUrdu": "آڑو",
      "image": "assets/catalog-images/peaches-5c1ec6.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1779738192898-f7ca5f08f15e?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Jason Leung",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-large-pile-of-fresh-ripe-peaches-D2yXUewNiJ0",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Plums (Aloo Bukhara) 1kg",
      "unit": "kg",
      "price": 320,
      "icon": "🟣",
      "nameUrdu": "آلو بخارا",
      "image": "assets/catalog-images/plums-c2b758.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1763256931625-ce439f5c2470?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Ali Sarvari",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-pile-of-ripe-blue-plums-DMyal4QoYqo",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Cherries 500g",
      "unit": "packet",
      "price": 650,
      "icon": "🍒",
      "nameUrdu": "چیری",
      "image": "assets/catalog-images/cherries-500g-974604.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1520236060906-9c5ed525b025?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Joanna Kosinska",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/red-cherry-fruits-_xN7UbcZ33I",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Strawberries 500g",
      "unit": "packet",
      "price": 550,
      "icon": "🍓",
      "image": "assets/catalog-images/fruits-a36ef4.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1587393855524-087f83d95bc9?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Sviatoslav Huzii",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/fresh-red-strawberries-in-pile-I497Uc8xWXQ",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Dates (Ajwa) 500g",
      "unit": "packet",
      "price": 1450,
      "icon": "🌴",
      "nameUrdu": "عجوہ کھجور",
      "image": "assets/catalog-images/dates-500g-17095d.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1784043437426-3261c7f2c3de?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "engin akyurt",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/pile-of-dried-dates-at-a-market-S5xCObZtTZk",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Coconut (Whole) 1pc",
      "unit": "piece",
      "price": 180,
      "icon": "🥥",
      "nameUrdu": "ناریل",
      "image": "assets/catalog-images/coconut-540e00.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1777732786332-3e78390f76aa?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Saravanan Narayanan",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-pile-of-brown-coconuts-with-husks-ha4CPWwTXMs",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Pineapple 1pc",
      "unit": "piece",
      "price": 280,
      "icon": "🍍",
      "nameUrdu": "انناس",
      "image": "assets/catalog-images/pineapple-7855cc.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Stephany Williams",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/pineapple-fruit-on-yellow-surface-yx3-a7ualMM",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Falsa 500g",
      "unit": "packet",
      "price": 320,
      "icon": "🫐",
      "nameUrdu": "فالسہ"
     }
    ],
    "image": "assets/catalog-images/fruits-a36ef4.webp",
    "imageUrl": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "Matheus Cenali",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/bunch-of-red-apples-wXuzS9xR49M",
     "source": "Unsplash"
    }
   },
   {
    "name": "Herbs & Extras",
    "items": [
     {
      "name": "Curry Leaves Bunch",
      "unit": "piece",
      "price": 40,
      "icon": "🌿",
      "nameUrdu": "کری پتا",
      "imageUrl": "https://images.unsplash.com/photo-1789194050232-0fe02232777b?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Sujana Rahman",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hand-holding-green-curry-leaf-sprig-TH85y3J3PRk",
       "source": "Unsplash"
      }
     },
     {
      "name": "Dried Mint 100g",
      "unit": "packet",
      "price": 180,
      "icon": "🌱",
      "nameUrdu": "خشک پودینہ"
     },
     {
      "name": "Dried Fenugreek (Kasoori Methi) 100g",
      "unit": "packet",
      "price": 220,
      "icon": "🌿",
      "nameUrdu": "قصوری میتھی"
     },
     {
      "name": "Tamarind (Imli) 500g",
      "unit": "packet",
      "price": 280,
      "icon": "🟤",
      "nameUrdu": "املی",
      "imageUrl": "https://images.unsplash.com/photo-1549333393-8934f7640b72?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Lauren Bow",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/selective-focus-photography-of-two-tamarind-fruits-Uqasm4-paGQ",
       "source": "Unsplash"
      }
     }
    ],
    "image": "assets/catalog-images/herbs-extras-c99b6b.webp",
    "imageUrl": "https://images.unsplash.com/photo-1549333393-8934f7640b72?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "Lauren Bow",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/selective-focus-photography-of-two-tamarind-fruits-Uqasm4-paGQ",
     "source": "Unsplash"
    }
   }
  ]
 },
 {
  "shopType": "Meat & Poultry",
  "icon": "🍗",
  "categories": [
   {
    "name": "Chicken",
    "items": [
     {
      "name": "Whole Chicken 1kg",
      "unit": "kg",
      "price": 620,
      "icon": "🍗",
      "nameUrdu": "مرغی",
      "image": "assets/catalog-images/whole-chicken-4c8e23.webp",
      "imageLevel": "item"
     },
     {
      "name": "Chicken Breast 1kg",
      "unit": "kg",
      "price": 780,
      "icon": "🍗",
      "image": "assets/catalog-images/chicken-breast-d4b559.webp",
      "imageLevel": "item"
     },
     {
      "name": "Chicken Legs 1kg",
      "unit": "kg",
      "price": 680,
      "icon": "🍗",
      "image": "assets/catalog-images/chicken-legs-b3dedd.webp",
      "imageLevel": "item"
     },
     {
      "name": "Chicken Wings 1kg",
      "unit": "kg",
      "price": 720,
      "icon": "🍗",
      "image": "assets/catalog-images/chicken-wings-9046fc.webp",
      "imageLevel": "item"
     },
     {
      "name": "Chicken Mince (Qeema) 1kg",
      "unit": "kg",
      "price": 750,
      "icon": "🍖",
      "nameUrdu": "چکن قیمہ",
      "image": "assets/catalog-images/chicken-mince-2512da.webp",
      "imageLevel": "item"
     },
     {
      "name": "Chicken Liver 500g",
      "unit": "piece",
      "price": 320,
      "icon": "🍗",
      "nameUrdu": "چکن کلیجی",
      "imageUrl": "https://images.unsplash.com/photo-1448907503123-67254d59ca4f?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Jez Timms",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/raw-meat-and-green-leaf-plant-on-brown-surface-DVRXFIH42d0",
       "source": "Unsplash"
      }
     },
     {
      "name": "Chicken Gizzard 500g",
      "unit": "piece",
      "price": 280,
      "icon": "🍗",
      "nameUrdu": "چکن پوٹا"
     },
     {
      "name": "Chicken Neck/Back Mix 1kg",
      "unit": "kg",
      "price": 420,
      "icon": "🍗",
      "nameUrdu": "چکن گردن",
      "image": "assets/catalog-images/chicken-neck-back-mix-2dd1fc.webp",
      "imageLevel": "item"
     },
     {
      "name": "Desi Chicken 1kg",
      "unit": "kg",
      "price": 950,
      "icon": "🍗",
      "nameUrdu": "دیسی مرغی",
      "image": "assets/catalog-images/desi-chicken-37b4ac.webp",
      "imageLevel": "item"
     },
     {
      "name": "Boneless Chicken 1kg",
      "unit": "kg",
      "price": 820,
      "icon": "🍗",
      "image": "assets/catalog-images/boneless-chicken-51a36b.webp",
      "imageLevel": "item"
     }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1448907503123-67254d59ca4f?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "Jez Timms",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/raw-meat-and-green-leaf-plant-on-brown-surface-DVRXFIH42d0",
     "source": "Unsplash"
    }
   },
   {
    "name": "Beef",
    "items": [
     {
      "name": "Beef Boneless 1kg",
      "unit": "kg",
      "price": 1250,
      "icon": "🥩",
      "nameUrdu": "گائے کا گوشت",
      "image": "assets/catalog-images/beef-boneless-6f571e.webp",
      "imageLevel": "item"
     },
     {
      "name": "Beef with Bone 1kg",
      "unit": "kg",
      "price": 1050,
      "icon": "🥩",
      "nameUrdu": "ہڈی والا گوشت",
      "imageUrl": "https://images.unsplash.com/photo-1448907503123-67254d59ca4f?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Jez Timms",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/raw-meat-and-green-leaf-plant-on-brown-surface-DVRXFIH42d0",
       "source": "Unsplash"
      }
     },
     {
      "name": "Beef Mince 1kg",
      "unit": "kg",
      "price": 1350,
      "icon": "🍖",
      "nameUrdu": "قیمہ"
     },
     {
      "name": "Beef Ribs 1kg",
      "unit": "kg",
      "price": 1150,
      "icon": "🍖",
      "nameUrdu": "پسلی",
      "image": "assets/catalog-images/beef-ribs-200975.webp",
      "imageLevel": "item"
     },
     {
      "name": "Beef Liver (Kaleji) 500g",
      "unit": "piece",
      "price": 650,
      "icon": "🥩",
      "nameUrdu": "کلیجی",
      "image": "assets/catalog-images/beef-8f1f76.webp",
      "imageLevel": "category"
     },
     {
      "name": "Beef Brain (Maghaz) 1pc",
      "unit": "piece",
      "price": 550,
      "icon": "🧠",
      "nameUrdu": "مغز",
      "image": "assets/catalog-images/beef-brain-ddd89e.webp",
      "imageLevel": "item"
     },
     {
      "name": "Beef Tongue 1pc",
      "unit": "piece",
      "price": 750,
      "icon": "👅",
      "nameUrdu": "زبان"
     },
     {
      "name": "Beef Paya (Trotters) 1kg",
      "unit": "kg",
      "price": 850,
      "icon": "🦶",
      "nameUrdu": "پائے",
      "image": "assets/catalog-images/beef-paya-326b76.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/beef-8f1f76.webp"
   },
   {
    "name": "Mutton",
    "items": [
     {
      "name": "Mutton Boneless 1kg",
      "unit": "kg",
      "price": 2200,
      "icon": "🥩",
      "nameUrdu": "بکرے کا گوشت",
      "imageUrl": "https://images.unsplash.com/photo-1600180786608-28d06391d25c?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Usman Yousaf",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/raw-meat-on-blue-ceramic-bowl-eOktYr3tAMo",
       "source": "Unsplash"
      }
     },
     {
      "name": "Mutton with Bone 1kg",
      "unit": "kg",
      "price": 1950,
      "icon": "🥩",
      "nameUrdu": "ہڈی والا مٹن"
     },
     {
      "name": "Mutton Mince 1kg",
      "unit": "kg",
      "price": 2350,
      "icon": "🍖",
      "nameUrdu": "مٹن قیمہ"
     },
     {
      "name": "Mutton Chops 1kg",
      "unit": "kg",
      "price": 2100,
      "icon": "🍖",
      "image": "assets/catalog-images/mutton-chops-4452fe.webp",
      "imageLevel": "item"
     },
     {
      "name": "Mutton Liver 500g",
      "unit": "piece",
      "price": 950,
      "icon": "🥩",
      "nameUrdu": "مٹن کلیجی",
      "image": "assets/catalog-images/mutton-070354.webp",
      "imageLevel": "category"
     },
     {
      "name": "Mutton Brain 1pc",
      "unit": "piece",
      "price": 450,
      "icon": "🧠",
      "nameUrdu": "مٹن مغز",
      "image": "assets/catalog-images/mutton-brain-abdf2b.webp",
      "imageLevel": "item"
     },
     {
      "name": "Mutton Paya 1kg",
      "unit": "kg",
      "price": 1200,
      "icon": "🦶",
      "nameUrdu": "مٹن پائے",
      "image": "assets/catalog-images/mutton-paya-20e91f.webp",
      "imageLevel": "item"
     },
     {
      "name": "Mutton Raan (Leg) 1pc",
      "unit": "piece",
      "price": 2400,
      "icon": "🍖",
      "nameUrdu": "ران",
      "image": "assets/catalog-images/mutton-raan-fd4449.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/mutton-070354.webp"
   },
   {
    "name": "Fish & Seafood",
    "items": [
     {
      "name": "Rahu Fish 1kg",
      "unit": "kg",
      "price": 750,
      "icon": "🐟",
      "nameUrdu": "رہو مچھلی",
      "imageUrl": "https://images.unsplash.com/photo-1683405503746-0fcbc47daaa7?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Kier in Sight Archives",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-fish-that-is-laying-on-a-white-surface-jX229RhM-T0",
       "source": "Unsplash"
      }
     },
     {
      "name": "Salmon Fillet 500g",
      "unit": "packet",
      "price": 1450,
      "icon": "🐟",
      "imageUrl": "https://images.unsplash.com/photo-1499125562588-29fb8a56b5d5?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Caroline Attwood",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/raw-fish-meat-on-brown-chopping-board-kC9KUtSiflw",
       "source": "Unsplash"
      }
     },
     {
      "name": "Pomfret (Paplet) 1kg",
      "unit": "kg",
      "price": 1650,
      "icon": "🐟",
      "nameUrdu": "پاپلیٹ",
      "imageUrl": "https://images.unsplash.com/photo-1764813824645-e5dc9e49d8cb?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "krzhck",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-school-of-silver-fish-on-ice-a3se6O3mUMU",
       "source": "Unsplash"
      }
     },
     {
      "name": "Prawns 500g",
      "unit": "piece",
      "price": 1250,
      "icon": "🦐",
      "nameUrdu": "جھینگے",
      "imageUrl": "https://images.unsplash.com/photo-1504309250229-4f08315f3b5c?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Etienne Girardet",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-shrimp-that-are-laying-on-the-ground-WTPMcV1NZuY",
       "source": "Unsplash"
      }
     },
     {
      "name": "Fish Fingers 500g",
      "unit": "packet",
      "price": 850,
      "icon": "🐟",
      "imageUrl": "https://images.unsplash.com/photo-1678969406337-1869bb0c0dc4?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Haseeb Modi",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-white-plate-topped-with-french-fries-and-other-foods-9fUCAqck4Zs",
       "source": "Unsplash"
      }
     },
     {
      "name": "Dried Fish (Sookhi Machli) 250g",
      "unit": "packet",
      "price": 650,
      "icon": "🐟",
      "nameUrdu": "سوکھی مچھلی",
      "imageUrl": "https://images.unsplash.com/photo-1572420963886-7850f1af053e?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Zeshalyn Capindo",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/pile-of-fishes-YSpHVL_Zs-w",
       "source": "Unsplash"
      }
     },
     {
      "name": "Sole Fish 1kg",
      "unit": "kg",
      "price": 950,
      "icon": "🐟",
      "nameUrdu": "سول مچھلی",
      "image": "assets/catalog-images/sole-fish-93df74.webp",
      "imageLevel": "item"
     },
     {
      "name": "Surmai (King Fish) 1kg",
      "unit": "kg",
      "price": 1350,
      "icon": "🐟",
      "nameUrdu": "سرمئی",
      "image": "assets/catalog-images/surmai-bac90d.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/fish-seafood-819e11.webp",
    "imageUrl": "https://images.unsplash.com/photo-1499125562588-29fb8a56b5d5?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "Caroline Attwood",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/raw-fish-meat-on-brown-chopping-board-kC9KUtSiflw",
     "source": "Unsplash"
    }
   },
   {
    "name": "Mince, Organs & Eggs",
    "items": [
     {
      "name": "Mixed Mince 1kg",
      "unit": "kg",
      "price": 1050,
      "icon": "🍖",
      "nameUrdu": "مکس قیمہ",
      "image": "assets/catalog-images/mixed-mince-00a6ff.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1763140446057-9becaa30b868?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmF3JTIwbWluY2VkJTIwbWVhdCUyMGJ1dGNoZXJ8ZW58MXx8fHwxNzkyMjU1NDk1fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Eric Prouzet",
       "profileUrl": "https://unsplash.com/@eprouzet",
       "photoUrl": "https://unsplash.com/photos/raw-meat-hanging-in-a-butcher-shop-window-cL7yZy3I1OM",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/cL7yZy3I1OM/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmF3JTIwbWluY2VkJTIwbWVhdCUyMGJ1dGNoZXJ8ZW58MXx8fHwxNzkyMjU1NDk1fDA"
     },
     {
      "name": "Heart (Dil) 500g",
      "unit": "piece",
      "price": 550,
      "icon": "❤️",
      "nameUrdu": "دل",
      "imageUrl": "https://images.unsplash.com/photo-1763140446057-9becaa30b868?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmF3JTIwbWluY2VkJTIwbWVhdCUyMGJ1dGNoZXJ8ZW58MXx8fHwxNzkyMjU1NDk1fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Eric Prouzet",
       "profileUrl": "https://unsplash.com/@eprouzet",
       "photoUrl": "https://unsplash.com/photos/raw-meat-hanging-in-a-butcher-shop-window-cL7yZy3I1OM",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/cL7yZy3I1OM/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmF3JTIwbWluY2VkJTIwbWVhdCUyMGJ1dGNoZXJ8ZW58MXx8fHwxNzkyMjU1NDk1fDA"
     },
     {
      "name": "Kidney (Gurda) 500g",
      "unit": "piece",
      "price": 550,
      "icon": "🥩",
      "nameUrdu": "گردہ",
      "imageUrl": "https://images.unsplash.com/photo-1763140446057-9becaa30b868?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmF3JTIwbWluY2VkJTIwbWVhdCUyMGJ1dGNoZXJ8ZW58MXx8fHwxNzkyMjU1NDk1fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Eric Prouzet",
       "profileUrl": "https://unsplash.com/@eprouzet",
       "photoUrl": "https://unsplash.com/photos/raw-meat-hanging-in-a-butcher-shop-window-cL7yZy3I1OM",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/cL7yZy3I1OM/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmF3JTIwbWluY2VkJTIwbWVhdCUyMGJ1dGNoZXJ8ZW58MXx8fHwxNzkyMjU1NDk1fDA"
     },
     {
      "name": "Tripe (Ojri) 500g",
      "unit": "piece",
      "price": 450,
      "icon": "🥩",
      "nameUrdu": "اوجھڑی",
      "imageUrl": "https://images.unsplash.com/photo-1763140446057-9becaa30b868?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmF3JTIwbWluY2VkJTIwbWVhdCUyMGJ1dGNoZXJ8ZW58MXx8fHwxNzkyMjU1NDk1fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Eric Prouzet",
       "profileUrl": "https://unsplash.com/@eprouzet",
       "photoUrl": "https://unsplash.com/photos/raw-meat-hanging-in-a-butcher-shop-window-cL7yZy3I1OM",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/cL7yZy3I1OM/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmF3JTIwbWluY2VkJTIwbWVhdCUyMGJ1dGNoZXJ8ZW58MXx8fHwxNzkyMjU1NDk1fDA"
     },
     {
      "name": "Marrow Bones 1kg",
      "unit": "kg",
      "price": 650,
      "icon": "🦴",
      "nameUrdu": "گودے والی ہڈی",
      "image": "assets/catalog-images/marrow-bones-daa8dc.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1763140446057-9becaa30b868?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmF3JTIwbWluY2VkJTIwbWVhdCUyMGJ1dGNoZXJ8ZW58MXx8fHwxNzkyMjU1NDk1fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Eric Prouzet",
       "profileUrl": "https://unsplash.com/@eprouzet",
       "photoUrl": "https://unsplash.com/photos/raw-meat-hanging-in-a-butcher-shop-window-cL7yZy3I1OM",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/cL7yZy3I1OM/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmF3JTIwbWluY2VkJTIwbWVhdCUyMGJ1dGNoZXJ8ZW58MXx8fHwxNzkyMjU1NDk1fDA"
     },
     {
      "name": "Farm Eggs 1 Dozen",
      "unit": "dozen",
      "price": 420,
      "icon": "🥚",
      "nameUrdu": "انڈے",
      "image": "assets/catalog-images/farm-eggs-1-dozen-ed9fe3.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1763140446057-9becaa30b868?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmF3JTIwbWluY2VkJTIwbWVhdCUyMGJ1dGNoZXJ8ZW58MXx8fHwxNzkyMjU1NDk1fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Eric Prouzet",
       "profileUrl": "https://unsplash.com/@eprouzet",
       "photoUrl": "https://unsplash.com/photos/raw-meat-hanging-in-a-butcher-shop-window-cL7yZy3I1OM",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/cL7yZy3I1OM/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmF3JTIwbWluY2VkJTIwbWVhdCUyMGJ1dGNoZXJ8ZW58MXx8fHwxNzkyMjU1NDk1fDA"
     }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1763140446057-9becaa30b868?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmF3JTIwbWluY2VkJTIwbWVhdCUyMGJ1dGNoZXJ8ZW58MXx8fHwxNzkyMjU1NDk1fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Eric Prouzet",
     "profileUrl": "https://unsplash.com/@eprouzet",
     "photoUrl": "https://unsplash.com/photos/raw-meat-hanging-in-a-butcher-shop-window-cL7yZy3I1OM",
     "source": "Unsplash"
    }
   }
  ]
 },
 {
  "shopType": "Bakery & Sweets",
  "icon": "🍰",
  "categories": [
   {
    "name": "Breads & Rusk",
    "items": [
     {
      "name": "Milk Bread 600g",
      "unit": "packet",
      "price": 180,
      "icon": "🍞",
      "nameUrdu": "دودھ والی ڈبل روٹی",
      "image": "assets/catalog-images/milk-bread-600g-2f0097.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1549413468-cd78edb7e75c?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Maria Orlova",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/view-of-baked-bread-on-jute-kU7TkW9FIJY",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "White Bread 600g",
      "unit": "packet",
      "price": 160,
      "icon": "🍞",
      "nameUrdu": "سفید ڈبل روٹی",
      "image": "assets/catalog-images/white-bread-600g-9afdfc.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1549413468-cd78edb7e75c?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Maria Orlova",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/view-of-baked-bread-on-jute-kU7TkW9FIJY",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Whole Wheat Bread 600g",
      "unit": "packet",
      "price": 190,
      "icon": "🍞",
      "nameUrdu": "گندم کی ڈبل روٹی",
      "image": "assets/catalog-images/breads-rusk-a4af14.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1549413468-cd78edb7e75c?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Maria Orlova",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/view-of-baked-bread-on-jute-kU7TkW9FIJY",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Bun (Pack of 6)",
      "unit": "packet",
      "price": 150,
      "icon": "🥖",
      "nameUrdu": "بن",
      "image": "assets/catalog-images/bun-71d449.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1549413468-cd78edb7e75c?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Maria Orlova",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/view-of-baked-bread-on-jute-kU7TkW9FIJY",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Burger Buns (Pack of 4)",
      "unit": "packet",
      "price": 160,
      "icon": "🍔",
      "image": "assets/catalog-images/burger-buns-ecfaeb.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1549413468-cd78edb7e75c?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Maria Orlova",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/view-of-baked-bread-on-jute-kU7TkW9FIJY",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Hot Dog Buns (Pack of 4)",
      "unit": "packet",
      "price": 160,
      "icon": "🌭",
      "image": "assets/catalog-images/hot-dog-buns-d12b74.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1549413468-cd78edb7e75c?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Maria Orlova",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/view-of-baked-bread-on-jute-kU7TkW9FIJY",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Cake Rusk 400g",
      "unit": "packet",
      "price": 380,
      "icon": "🍪",
      "nameUrdu": "کیک رس",
      "image": "assets/catalog-images/breads-rusk-a4af14.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1549413468-cd78edb7e75c?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Maria Orlova",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/view-of-baked-bread-on-jute-kU7TkW9FIJY",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Zeera Rusk 400g",
      "unit": "packet",
      "price": 360,
      "icon": "🍪",
      "nameUrdu": "زیرہ رس",
      "image": "assets/catalog-images/breads-rusk-a4af14.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1549413468-cd78edb7e75c?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Maria Orlova",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/view-of-baked-bread-on-jute-kU7TkW9FIJY",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Milk Rusk 400g",
      "unit": "packet",
      "price": 350,
      "icon": "🍪",
      "nameUrdu": "دودھ رس",
      "image": "assets/catalog-images/breads-rusk-a4af14.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1549413468-cd78edb7e75c?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Maria Orlova",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/view-of-baked-bread-on-jute-kU7TkW9FIJY",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Fruit Cake Slices (Pack)",
      "unit": "packet",
      "price": 320,
      "icon": "🍰",
      "nameUrdu": "فروٹ کیک",
      "image": "assets/catalog-images/fruit-cake-slices-4e7a74.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1549413468-cd78edb7e75c?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Maria Orlova",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/view-of-baked-bread-on-jute-kU7TkW9FIJY",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Plain Cake 500g",
      "unit": "piece",
      "price": 550,
      "icon": "🍰",
      "nameUrdu": "سادہ کیک",
      "image": "assets/catalog-images/breads-rusk-a4af14.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1549413468-cd78edb7e75c?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Maria Orlova",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/view-of-baked-bread-on-jute-kU7TkW9FIJY",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Muffins (Pack of 4)",
      "unit": "packet",
      "price": 280,
      "icon": "🧁",
      "image": "assets/catalog-images/muffins-c3a75b.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1549413468-cd78edb7e75c?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Maria Orlova",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/view-of-baked-bread-on-jute-kU7TkW9FIJY",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Croissant (Pack of 2)",
      "unit": "packet",
      "price": 320,
      "icon": "🥐",
      "image": "assets/catalog-images/croissant-590898.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1549413468-cd78edb7e75c?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Maria Orlova",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/view-of-baked-bread-on-jute-kU7TkW9FIJY",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Garlic Bread Loaf",
      "unit": "piece",
      "price": 380,
      "icon": "🥖",
      "image": "assets/catalog-images/breads-rusk-a4af14.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1549413468-cd78edb7e75c?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Maria Orlova",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/view-of-baked-bread-on-jute-kU7TkW9FIJY",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     }
    ],
    "image": "assets/catalog-images/breads-rusk-a4af14.webp",
    "imageUrl": "https://images.unsplash.com/photo-1549413468-cd78edb7e75c?w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Maria Orlova",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/view-of-baked-bread-on-jute-kU7TkW9FIJY",
     "source": "Unsplash"
    }
   },
   {
    "name": "Cakes & Pastries",
    "items": [
     {
      "name": "Chocolate Cake 1lb",
      "unit": "piece",
      "price": 950,
      "icon": "🍫",
      "nameUrdu": "چاکلیٹ کیک",
      "image": "assets/catalog-images/cakes-pastries-5b8613.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1583338917451-face2751d8d5?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Ulysse Pointcheval",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/bakery-display-with-fruit-tarts-1WmlAiYgnoI",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Pineapple Cake 1lb",
      "unit": "piece",
      "price": 900,
      "icon": "🍍",
      "nameUrdu": "انناس کیک",
      "image": "assets/catalog-images/cakes-pastries-5b8613.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1583338917451-face2751d8d5?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Ulysse Pointcheval",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/bakery-display-with-fruit-tarts-1WmlAiYgnoI",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Vanilla Cake 1lb",
      "unit": "piece",
      "price": 850,
      "icon": "🍰",
      "image": "assets/catalog-images/cakes-pastries-5b8613.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1583338917451-face2751d8d5?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Ulysse Pointcheval",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/bakery-display-with-fruit-tarts-1WmlAiYgnoI",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Black Forest Cake 1lb",
      "unit": "piece",
      "price": 1150,
      "icon": "🍒",
      "image": "assets/catalog-images/cakes-pastries-5b8613.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1583338917451-face2751d8d5?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Ulysse Pointcheval",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/bakery-display-with-fruit-tarts-1WmlAiYgnoI",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Red Velvet Cake 1lb",
      "unit": "piece",
      "price": 1250,
      "icon": "❤️",
      "image": "assets/catalog-images/cakes-pastries-5b8613.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1583338917451-face2751d8d5?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Ulysse Pointcheval",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/bakery-display-with-fruit-tarts-1WmlAiYgnoI",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Coffee Cake 1lb",
      "unit": "piece",
      "price": 1050,
      "icon": "☕",
      "image": "assets/catalog-images/cakes-pastries-5b8613.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1583338917451-face2751d8d5?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Ulysse Pointcheval",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/bakery-display-with-fruit-tarts-1WmlAiYgnoI",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Chocolate Pastry 1pc",
      "unit": "piece",
      "price": 180,
      "icon": "🍫",
      "nameUrdu": "چاکلیٹ پیسٹری",
      "image": "assets/catalog-images/chocolate-pastry-f7eab2.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1583338917451-face2751d8d5?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Ulysse Pointcheval",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/bakery-display-with-fruit-tarts-1WmlAiYgnoI",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Pineapple Pastry 1pc",
      "unit": "piece",
      "price": 160,
      "icon": "🍍",
      "nameUrdu": "پیسٹری",
      "image": "assets/catalog-images/pineapple-pastry-bee329.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1583338917451-face2751d8d5?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Ulysse Pointcheval",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/bakery-display-with-fruit-tarts-1WmlAiYgnoI",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Eclair (Pack of 2)",
      "unit": "packet",
      "price": 220,
      "icon": "🍫",
      "image": "assets/catalog-images/eclair-1cedd3.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1583338917451-face2751d8d5?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Ulysse Pointcheval",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/bakery-display-with-fruit-tarts-1WmlAiYgnoI",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Glazed Donut 1pc",
      "unit": "piece",
      "price": 150,
      "icon": "🍩",
      "image": "assets/catalog-images/glazed-donut-bffcb2.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1583338917451-face2751d8d5?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Ulysse Pointcheval",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/bakery-display-with-fruit-tarts-1WmlAiYgnoI",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Chocolate Donut 1pc",
      "unit": "piece",
      "price": 170,
      "icon": "🍩",
      "image": "assets/catalog-images/chocolate-donut-f47eee.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1583338917451-face2751d8d5?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Ulysse Pointcheval",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/bakery-display-with-fruit-tarts-1WmlAiYgnoI",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Swiss Roll 1pc",
      "unit": "piece",
      "price": 220,
      "icon": "🍰",
      "image": "assets/catalog-images/swiss-roll-665017.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1583338917451-face2751d8d5?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Ulysse Pointcheval",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/bakery-display-with-fruit-tarts-1WmlAiYgnoI",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Cupcakes (Pack of 6)",
      "unit": "packet",
      "price": 420,
      "icon": "🧁",
      "image": "assets/catalog-images/cupcakes-6cc7ec.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1583338917451-face2751d8d5?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Ulysse Pointcheval",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/bakery-display-with-fruit-tarts-1WmlAiYgnoI",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Brownies (Pack of 4)",
      "unit": "packet",
      "price": 450,
      "icon": "🍫",
      "image": "assets/catalog-images/brownies-45ccf8.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1583338917451-face2751d8d5?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Ulysse Pointcheval",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/bakery-display-with-fruit-tarts-1WmlAiYgnoI",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     }
    ],
    "image": "assets/catalog-images/cakes-pastries-5b8613.webp",
    "imageUrl": "https://images.unsplash.com/photo-1583338917451-face2751d8d5?w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Ulysse Pointcheval",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/bakery-display-with-fruit-tarts-1WmlAiYgnoI",
     "source": "Unsplash"
    }
   },
   {
    "name": "Biscuits & Cookies",
    "items": [
     {
      "name": "Atta Biscuits 500g",
      "unit": "packet",
      "price": 420,
      "icon": "🍪",
      "nameUrdu": "آٹے کے بسکٹ",
      "image": "assets/catalog-images/biscuits-cookies-3b20c7.webp",
      "imageLevel": "category"
     },
     {
      "name": "Coconut Cookies 500g",
      "unit": "packet",
      "price": 480,
      "icon": "🥥",
      "nameUrdu": "ناریل بسکٹ",
      "image": "assets/catalog-images/biscuits-cookies-3b20c7.webp",
      "imageLevel": "category"
     },
     {
      "name": "Butter Cookies 500g",
      "unit": "packet",
      "price": 550,
      "icon": "🍪",
      "nameUrdu": "مکھن بسکٹ",
      "image": "assets/catalog-images/biscuits-cookies-3b20c7.webp",
      "imageLevel": "category"
     },
     {
      "name": "Chocolate Chip Cookies 500g",
      "unit": "packet",
      "price": 650,
      "icon": "🍪",
      "nameUrdu": "چاکلیٹ چپ بسکٹ",
      "image": "assets/catalog-images/biscuits-cookies-3b20c7.webp",
      "imageLevel": "category"
     },
     {
      "name": "Nan Khatai 500g",
      "unit": "packet",
      "price": 520,
      "icon": "🍪",
      "nameUrdu": "نان خطائی",
      "image": "assets/catalog-images/biscuits-cookies-3b20c7.webp",
      "imageLevel": "category"
     },
     {
      "name": "Shrewsbury Biscuits 500g",
      "unit": "packet",
      "price": 580,
      "icon": "🍪",
      "image": "assets/catalog-images/biscuits-cookies-3b20c7.webp",
      "imageLevel": "category"
     },
     {
      "name": "Khopra Biscuits 400g",
      "unit": "packet",
      "price": 420,
      "icon": "🥥",
      "nameUrdu": "کھوپرا بسکٹ",
      "image": "assets/catalog-images/biscuits-cookies-3b20c7.webp",
      "imageLevel": "category"
     },
     {
      "name": "Zeera Biscuits 400g",
      "unit": "packet",
      "price": 400,
      "icon": "🍪",
      "nameUrdu": "زیرہ بسکٹ",
      "image": "assets/catalog-images/biscuits-cookies-3b20c7.webp",
      "imageLevel": "category"
     },
     {
      "name": "Salt Biscuits 400g",
      "unit": "packet",
      "price": 380,
      "icon": "🍪",
      "nameUrdu": "نمکین بسکٹ",
      "image": "assets/catalog-images/biscuits-cookies-3b20c7.webp",
      "imageLevel": "category"
     },
     {
      "name": "Jam Biscuits 400g",
      "unit": "packet",
      "price": 450,
      "icon": "🍓",
      "nameUrdu": "مربہ بسکٹ",
      "image": "assets/catalog-images/biscuits-cookies-3b20c7.webp",
      "imageLevel": "category"
     },
     {
      "name": "Marble Cookies 400g",
      "unit": "packet",
      "price": 480,
      "icon": "🍪",
      "image": "assets/catalog-images/biscuits-cookies-3b20c7.webp",
      "imageLevel": "category"
     },
     {
      "name": "Walnut Cookies 400g",
      "unit": "packet",
      "price": 650,
      "icon": "🌰",
      "nameUrdu": "اخروٹ بسکٹ",
      "image": "assets/catalog-images/biscuits-cookies-3b20c7.webp",
      "imageLevel": "category"
     }
    ],
    "image": "assets/catalog-images/biscuits-cookies-3b20c7.webp"
   },
   {
    "name": "Mithai",
    "items": [
     {
      "name": "Gulab Jamun 1kg",
      "unit": "kg",
      "price": 850,
      "icon": "🍩",
      "nameUrdu": "گلاب جامن",
      "image": "assets/catalog-images/gulab-jamun-bf85b4.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1760263216784-a4ca9a841ff5?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/stacks-of-sweet-jalebi-pastries-on-a-scale-fS5U_je3Ot8",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Rasgulla 1kg",
      "unit": "kg",
      "price": 800,
      "icon": "⚪",
      "nameUrdu": "رس گلہ",
      "image": "assets/catalog-images/rasgulla-3af4fb.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1760263216784-a4ca9a841ff5?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/stacks-of-sweet-jalebi-pastries-on-a-scale-fS5U_je3Ot8",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Barfi (Plain) 1kg",
      "unit": "kg",
      "price": 950,
      "icon": "🍬",
      "nameUrdu": "برفی",
      "image": "assets/catalog-images/barfi-fee7d6.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1760263216784-a4ca9a841ff5?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/stacks-of-sweet-jalebi-pastries-on-a-scale-fS5U_je3Ot8",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Coconut Barfi 1kg",
      "unit": "kg",
      "price": 1050,
      "icon": "🥥",
      "nameUrdu": "ناریل برفی",
      "image": "assets/catalog-images/coconut-barfi-469ab0.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1760263216784-a4ca9a841ff5?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/stacks-of-sweet-jalebi-pastries-on-a-scale-fS5U_je3Ot8",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Motichoor Ladoo 1kg",
      "unit": "kg",
      "price": 850,
      "icon": "🟠",
      "nameUrdu": "موتی چور لڈو",
      "image": "assets/catalog-images/motichoor-ladoo-7d82b1.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1760263216784-a4ca9a841ff5?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/stacks-of-sweet-jalebi-pastries-on-a-scale-fS5U_je3Ot8",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Besan Ladoo 1kg",
      "unit": "kg",
      "price": 900,
      "icon": "🟡",
      "nameUrdu": "بیسن لڈو",
      "image": "assets/catalog-images/besan-ladoo-e96076.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1760263216784-a4ca9a841ff5?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/stacks-of-sweet-jalebi-pastries-on-a-scale-fS5U_je3Ot8",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Jalebi 1kg",
      "unit": "kg",
      "price": 750,
      "icon": "🥨",
      "nameUrdu": "جلیبی",
      "image": "assets/catalog-images/jalebi-874260.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1760263216784-a4ca9a841ff5?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/stacks-of-sweet-jalebi-pastries-on-a-scale-fS5U_je3Ot8",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Imarti 1kg",
      "unit": "kg",
      "price": 800,
      "icon": "🥨",
      "nameUrdu": "امرتی",
      "image": "assets/catalog-images/imarti-dc5198.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1760263216784-a4ca9a841ff5?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/stacks-of-sweet-jalebi-pastries-on-a-scale-fS5U_je3Ot8",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Soan Papdi 500g",
      "unit": "packet",
      "price": 550,
      "icon": "🍬",
      "nameUrdu": "سون پاپڑی",
      "image": "assets/catalog-images/mithai-39e36d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1760263216784-a4ca9a841ff5?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/stacks-of-sweet-jalebi-pastries-on-a-scale-fS5U_je3Ot8",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Patisa 1kg",
      "unit": "kg",
      "price": 900,
      "icon": "🍬",
      "nameUrdu": "پتیسہ",
      "image": "assets/catalog-images/patisa-49df3f.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1760263216784-a4ca9a841ff5?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/stacks-of-sweet-jalebi-pastries-on-a-scale-fS5U_je3Ot8",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Kalakand 1kg",
      "unit": "kg",
      "price": 1150,
      "icon": "🍮",
      "nameUrdu": "کلاکند",
      "image": "assets/catalog-images/kalakand-851616.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1760263216784-a4ca9a841ff5?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/stacks-of-sweet-jalebi-pastries-on-a-scale-fS5U_je3Ot8",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Rasmalai 1kg",
      "unit": "kg",
      "price": 1250,
      "icon": "🍮",
      "nameUrdu": "رس ملائی",
      "image": "assets/catalog-images/rasmalai-cbb28e.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1760263216784-a4ca9a841ff5?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/stacks-of-sweet-jalebi-pastries-on-a-scale-fS5U_je3Ot8",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Cham Cham 1kg",
      "unit": "kg",
      "price": 950,
      "icon": "🍬",
      "nameUrdu": "چم چم",
      "image": "assets/catalog-images/cham-cham-v2-3b60a4.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1760263216784-a4ca9a841ff5?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/stacks-of-sweet-jalebi-pastries-on-a-scale-fS5U_je3Ot8",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Balushahi 1kg",
      "unit": "kg",
      "price": 900,
      "icon": "🍩",
      "nameUrdu": "بالوشاہی",
      "image": "assets/catalog-images/balushahi-1e0f29.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1760263216784-a4ca9a841ff5?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/stacks-of-sweet-jalebi-pastries-on-a-scale-fS5U_je3Ot8",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Milk Cake 1kg",
      "unit": "kg",
      "price": 1150,
      "icon": "🍰",
      "nameUrdu": "ملک کیک",
      "image": "assets/catalog-images/milk-cake-94348e.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1760263216784-a4ca9a841ff5?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/stacks-of-sweet-jalebi-pastries-on-a-scale-fS5U_je3Ot8",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Habshi Halwa 500g",
      "unit": "piece",
      "price": 650,
      "icon": "🍮",
      "nameUrdu": "حبشی حلوہ",
      "image": "assets/catalog-images/mithai-39e36d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1760263216784-a4ca9a841ff5?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/stacks-of-sweet-jalebi-pastries-on-a-scale-fS5U_je3Ot8",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     }
    ],
    "image": "assets/catalog-images/mithai-39e36d.webp",
    "imageUrl": "https://images.unsplash.com/photo-1760263216784-a4ca9a841ff5?w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Zoshua Colah",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/stacks-of-sweet-jalebi-pastries-on-a-scale-fS5U_je3Ot8",
     "source": "Unsplash"
    }
   },
   {
    "name": "Nimco & Snacks",
    "items": [
     {
      "name": "Nimco Mix 1kg",
      "unit": "kg",
      "price": 750,
      "icon": "🥜",
      "nameUrdu": "نمکو مکس",
      "imageUrl": "https://images.unsplash.com/photo-1701341404788-b85484ca379e?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c2FsdHklMjBzbmFja3MlMjBib3dsfGVufDF8fHx8MTc5MjI1NTQ4Nnww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vu Nghi Thai",
       "profileUrl": "https://unsplash.com/@pvnt",
       "photoUrl": "https://unsplash.com/photos/a-wooden-table-topped-with-bowls-of-crackers-x_lxdRtNRfs",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/x_lxdRtNRfs/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c2FsdHklMjBzbmFja3MlMjBib3dsfGVufDF8fHx8MTc5MjI1NTQ4Nnww"
     },
     {
      "name": "Dalmoth 500g",
      "unit": "packet",
      "price": 380,
      "icon": "🫘",
      "nameUrdu": "دال موٹھ",
      "imageUrl": "https://images.unsplash.com/photo-1701341404788-b85484ca379e?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c2FsdHklMjBzbmFja3MlMjBib3dsfGVufDF8fHx8MTc5MjI1NTQ4Nnww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vu Nghi Thai",
       "profileUrl": "https://unsplash.com/@pvnt",
       "photoUrl": "https://unsplash.com/photos/a-wooden-table-topped-with-bowls-of-crackers-x_lxdRtNRfs",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/x_lxdRtNRfs/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c2FsdHklMjBzbmFja3MlMjBib3dsfGVufDF8fHx8MTc5MjI1NTQ4Nnww"
     },
     {
      "name": "Bhujia Sev 500g",
      "unit": "packet",
      "price": 420,
      "icon": "🥨",
      "nameUrdu": "بھجیا",
      "imageUrl": "https://images.unsplash.com/photo-1701341404788-b85484ca379e?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c2FsdHklMjBzbmFja3MlMjBib3dsfGVufDF8fHx8MTc5MjI1NTQ4Nnww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vu Nghi Thai",
       "profileUrl": "https://unsplash.com/@pvnt",
       "photoUrl": "https://unsplash.com/photos/a-wooden-table-topped-with-bowls-of-crackers-x_lxdRtNRfs",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/x_lxdRtNRfs/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c2FsdHklMjBzbmFja3MlMjBib3dsfGVufDF8fHx8MTc5MjI1NTQ4Nnww"
     },
     {
      "name": "Gathiya 500g",
      "unit": "packet",
      "price": 420,
      "icon": "🥨",
      "nameUrdu": "گٹھیا",
      "imageUrl": "https://images.unsplash.com/photo-1701341404788-b85484ca379e?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c2FsdHklMjBzbmFja3MlMjBib3dsfGVufDF8fHx8MTc5MjI1NTQ4Nnww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vu Nghi Thai",
       "profileUrl": "https://unsplash.com/@pvnt",
       "photoUrl": "https://unsplash.com/photos/a-wooden-table-topped-with-bowls-of-crackers-x_lxdRtNRfs",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/x_lxdRtNRfs/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c2FsdHklMjBzbmFja3MlMjBib3dsfGVufDF8fHx8MTc5MjI1NTQ4Nnww"
     },
     {
      "name": "Roasted Peanuts 500g",
      "unit": "packet",
      "price": 550,
      "icon": "🥜",
      "nameUrdu": "بھنی مونگ پھلی",
      "imageUrl": "https://images.unsplash.com/photo-1701341404788-b85484ca379e?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c2FsdHklMjBzbmFja3MlMjBib3dsfGVufDF8fHx8MTc5MjI1NTQ4Nnww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vu Nghi Thai",
       "profileUrl": "https://unsplash.com/@pvnt",
       "photoUrl": "https://unsplash.com/photos/a-wooden-table-topped-with-bowls-of-crackers-x_lxdRtNRfs",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/x_lxdRtNRfs/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c2FsdHklMjBzbmFja3MlMjBib3dsfGVufDF8fHx8MTc5MjI1NTQ4Nnww"
     },
     {
      "name": "Chana Jor Garam 500g",
      "unit": "packet",
      "price": 400,
      "icon": "🫘",
      "nameUrdu": "چنا جور گرم",
      "imageUrl": "https://images.unsplash.com/photo-1701341404788-b85484ca379e?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c2FsdHklMjBzbmFja3MlMjBib3dsfGVufDF8fHx8MTc5MjI1NTQ4Nnww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vu Nghi Thai",
       "profileUrl": "https://unsplash.com/@pvnt",
       "photoUrl": "https://unsplash.com/photos/a-wooden-table-topped-with-bowls-of-crackers-x_lxdRtNRfs",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/x_lxdRtNRfs/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c2FsdHklMjBzbmFja3MlMjBib3dsfGVufDF8fHx8MTc5MjI1NTQ4Nnww"
     },
     {
      "name": "Masala Peanuts 500g",
      "unit": "packet",
      "price": 580,
      "icon": "🥜",
      "nameUrdu": "مصالحہ مونگ پھلی",
      "imageUrl": "https://images.unsplash.com/photo-1701341404788-b85484ca379e?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c2FsdHklMjBzbmFja3MlMjBib3dsfGVufDF8fHx8MTc5MjI1NTQ4Nnww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vu Nghi Thai",
       "profileUrl": "https://unsplash.com/@pvnt",
       "photoUrl": "https://unsplash.com/photos/a-wooden-table-topped-with-bowls-of-crackers-x_lxdRtNRfs",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/x_lxdRtNRfs/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c2FsdHklMjBzbmFja3MlMjBib3dsfGVufDF8fHx8MTc5MjI1NTQ4Nnww"
     },
     {
      "name": "Papdi 500g",
      "unit": "packet",
      "price": 380,
      "icon": "🫓",
      "nameUrdu": "پاپڑی",
      "imageUrl": "https://images.unsplash.com/photo-1701341404788-b85484ca379e?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c2FsdHklMjBzbmFja3MlMjBib3dsfGVufDF8fHx8MTc5MjI1NTQ4Nnww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vu Nghi Thai",
       "profileUrl": "https://unsplash.com/@pvnt",
       "photoUrl": "https://unsplash.com/photos/a-wooden-table-topped-with-bowls-of-crackers-x_lxdRtNRfs",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/x_lxdRtNRfs/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c2FsdHklMjBzbmFja3MlMjBib3dsfGVufDF8fHx8MTc5MjI1NTQ4Nnww"
     },
     {
      "name": "Papad 200g",
      "unit": "packet",
      "price": 220,
      "icon": "🫓",
      "nameUrdu": "پاپڑ",
      "imageUrl": "https://images.unsplash.com/photo-1701341404788-b85484ca379e?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c2FsdHklMjBzbmFja3MlMjBib3dsfGVufDF8fHx8MTc5MjI1NTQ4Nnww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vu Nghi Thai",
       "profileUrl": "https://unsplash.com/@pvnt",
       "photoUrl": "https://unsplash.com/photos/a-wooden-table-topped-with-bowls-of-crackers-x_lxdRtNRfs",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/x_lxdRtNRfs/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c2FsdHklMjBzbmFja3MlMjBib3dsfGVufDF8fHx8MTc5MjI1NTQ4Nnww"
     },
     {
      "name": "Samosa (Fresh, 4pc)",
      "unit": "piece",
      "price": 160,
      "icon": "🥟",
      "nameUrdu": "سموسہ",
      "image": "assets/catalog-images/samosa-166e8e.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1701341404788-b85484ca379e?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c2FsdHklMjBzbmFja3MlMjBib3dsfGVufDF8fHx8MTc5MjI1NTQ4Nnww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vu Nghi Thai",
       "profileUrl": "https://unsplash.com/@pvnt",
       "photoUrl": "https://unsplash.com/photos/a-wooden-table-topped-with-bowls-of-crackers-x_lxdRtNRfs",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/x_lxdRtNRfs/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c2FsdHklMjBzbmFja3MlMjBib3dsfGVufDF8fHx8MTc5MjI1NTQ4Nnww"
     },
     {
      "name": "Kachori (Fresh, 4pc)",
      "unit": "piece",
      "price": 200,
      "icon": "🥟",
      "nameUrdu": "کچوری",
      "image": "assets/catalog-images/kachori-1ff155.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1701341404788-b85484ca379e?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c2FsdHklMjBzbmFja3MlMjBib3dsfGVufDF8fHx8MTc5MjI1NTQ4Nnww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vu Nghi Thai",
       "profileUrl": "https://unsplash.com/@pvnt",
       "photoUrl": "https://unsplash.com/photos/a-wooden-table-topped-with-bowls-of-crackers-x_lxdRtNRfs",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/x_lxdRtNRfs/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c2FsdHklMjBzbmFja3MlMjBib3dsfGVufDF8fHx8MTc5MjI1NTQ4Nnww"
     },
     {
      "name": "Spring Roll (Fresh, 4pc)",
      "unit": "piece",
      "price": 240,
      "icon": "🥠",
      "image": "assets/catalog-images/spring-roll-6bc3c6.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1701341404788-b85484ca379e?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c2FsdHklMjBzbmFja3MlMjBib3dsfGVufDF8fHx8MTc5MjI1NTQ4Nnww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vu Nghi Thai",
       "profileUrl": "https://unsplash.com/@pvnt",
       "photoUrl": "https://unsplash.com/photos/a-wooden-table-topped-with-bowls-of-crackers-x_lxdRtNRfs",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/x_lxdRtNRfs/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c2FsdHklMjBzbmFja3MlMjBib3dsfGVufDF8fHx8MTc5MjI1NTQ4Nnww"
     },
     {
      "name": "Chicken Patties (4pc)",
      "unit": "piece",
      "price": 320,
      "icon": "🥟",
      "image": "assets/catalog-images/chicken-patties-070428.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1701341404788-b85484ca379e?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c2FsdHklMjBzbmFja3MlMjBib3dsfGVufDF8fHx8MTc5MjI1NTQ4Nnww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vu Nghi Thai",
       "profileUrl": "https://unsplash.com/@pvnt",
       "photoUrl": "https://unsplash.com/photos/a-wooden-table-topped-with-bowls-of-crackers-x_lxdRtNRfs",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/x_lxdRtNRfs/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c2FsdHklMjBzbmFja3MlMjBib3dsfGVufDF8fHx8MTc5MjI1NTQ4Nnww"
     },
     {
      "name": "Aloo Patties (4pc)",
      "unit": "piece",
      "price": 240,
      "icon": "🥔",
      "image": "assets/catalog-images/aloo-patties-0e70bf.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1701341404788-b85484ca379e?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c2FsdHklMjBzbmFja3MlMjBib3dsfGVufDF8fHx8MTc5MjI1NTQ4Nnww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vu Nghi Thai",
       "profileUrl": "https://unsplash.com/@pvnt",
       "photoUrl": "https://unsplash.com/photos/a-wooden-table-topped-with-bowls-of-crackers-x_lxdRtNRfs",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/x_lxdRtNRfs/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c2FsdHklMjBzbmFja3MlMjBib3dsfGVufDF8fHx8MTc5MjI1NTQ4Nnww"
     }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1701341404788-b85484ca379e?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c2FsdHklMjBzbmFja3MlMjBib3dsfGVufDF8fHx8MTc5MjI1NTQ4Nnww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Vu Nghi Thai",
     "profileUrl": "https://unsplash.com/@pvnt",
     "photoUrl": "https://unsplash.com/photos/a-wooden-table-topped-with-bowls-of-crackers-x_lxdRtNRfs",
     "source": "Unsplash"
    }
   }
  ]
 },
 {
  "shopType": "Tea Stall & Dhaba",
  "icon": "🍵",
  "categories": [
   {
    "name": "Chai & Drinks",
    "items": [
     {
      "name": "Doodh Patti (Full Cup)",
      "unit": "piece",
      "price": 80,
      "icon": "🍵",
      "nameUrdu": "دودھ پتی",
      "image": "assets/catalog-images/doodh-patti-168b32.webp",
      "imageLevel": "item"
     },
     {
      "name": "Doodh Patti (Cutting)",
      "unit": "piece",
      "price": 50,
      "icon": "🍵",
      "nameUrdu": "کٹنگ چائے",
      "image": "assets/catalog-images/doodh-patti-168b32.webp",
      "imageLevel": "item"
     },
     {
      "name": "Elaichi Chai",
      "unit": "piece",
      "price": 100,
      "icon": "🍵",
      "nameUrdu": "الائچی چائے",
      "image": "assets/catalog-images/elaichi-chai-d0f745.webp",
      "imageLevel": "item"
     },
     {
      "name": "Adrak Chai",
      "unit": "piece",
      "price": 100,
      "icon": "🫚",
      "nameUrdu": "ادرک چائے",
      "image": "assets/catalog-images/adrak-chai-9ec758.webp",
      "imageLevel": "item"
     },
     {
      "name": "Kahwa (Green Tea)",
      "unit": "piece",
      "price": 80,
      "icon": "🍃",
      "nameUrdu": "کہوہ",
      "image": "assets/catalog-images/kahwa-911f85.webp",
      "imageLevel": "item"
     },
     {
      "name": "Kashmiri Chai",
      "unit": "piece",
      "price": 120,
      "icon": "🩷",
      "nameUrdu": "کشمیری چائے",
      "image": "assets/catalog-images/kashmiri-chai-d55900.webp",
      "imageLevel": "item"
     },
     {
      "name": "Gur Wali Chai",
      "unit": "piece",
      "price": 90,
      "icon": "🟤",
      "nameUrdu": "گڑ والی چائے",
      "image": "assets/catalog-images/chai-drinks-e7effb.webp",
      "imageLevel": "category"
     },
     {
      "name": "Lemon Tea",
      "unit": "piece",
      "price": 70,
      "icon": "🍋",
      "nameUrdu": "لیموں چائے",
      "image": "assets/catalog-images/lemon-tea-74d28e.webp",
      "imageLevel": "item"
     },
     {
      "name": "Cold Drink (Bottle)",
      "unit": "piece",
      "price": 120,
      "icon": "🥤",
      "nameUrdu": "کولڈ ڈرنک",
      "image": "assets/catalog-images/cold-drink-df6fa6.webp",
      "imageLevel": "item"
     },
     {
      "name": "Fresh Lime Soda",
      "unit": "piece",
      "price": 150,
      "icon": "🍋",
      "nameUrdu": "لائم سوڈا",
      "image": "assets/catalog-images/lime-soda-d89748.webp",
      "imageLevel": "item"
     },
     {
      "name": "Lassi (Sweet)",
      "unit": "piece",
      "price": 150,
      "icon": "🍶",
      "nameUrdu": "میٹھی لسی",
      "image": "assets/catalog-images/lassi-71d017.webp",
      "imageLevel": "item"
     },
     {
      "name": "Lassi (Salty)",
      "unit": "piece",
      "price": 150,
      "icon": "🍶",
      "nameUrdu": "نمکین لسی",
      "image": "assets/catalog-images/lassi-71d017.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/chai-drinks-e7effb.webp"
   },
   {
    "name": "Paratha & Breads",
    "items": [
     {
      "name": "Sada Paratha",
      "unit": "piece",
      "price": 60,
      "icon": "🫓",
      "nameUrdu": "سادہ پراٹھا",
      "image": "assets/catalog-images/paratha-breads-37a291.webp",
      "imageLevel": "category"
     },
     {
      "name": "Aloo Paratha",
      "unit": "piece",
      "price": 120,
      "icon": "🥔",
      "nameUrdu": "آلو پراٹھا",
      "image": "assets/catalog-images/aloo-paratha-af3485.webp",
      "imageLevel": "item"
     },
     {
      "name": "Qeema Paratha",
      "unit": "piece",
      "price": 180,
      "icon": "🫓",
      "nameUrdu": "قیمہ پراٹھا",
      "image": "assets/catalog-images/qeema-paratha-723a85.webp",
      "imageLevel": "item"
     },
     {
      "name": "Anda Paratha",
      "unit": "piece",
      "price": 140,
      "icon": "🍳",
      "nameUrdu": "انڈا پراٹھا",
      "image": "assets/catalog-images/anda-paratha-5eba0f.webp",
      "imageLevel": "item"
     },
     {
      "name": "Cheese Paratha",
      "unit": "piece",
      "price": 200,
      "icon": "🧀",
      "image": "assets/catalog-images/cheese-paratha-7a71c5.webp",
      "imageLevel": "item"
     },
     {
      "name": "Tandoori Roti",
      "unit": "piece",
      "price": 25,
      "icon": "🫓",
      "nameUrdu": "تندوری روٹی",
      "image": "assets/catalog-images/tandoori-roti-52bf12.webp",
      "imageLevel": "item"
     },
     {
      "name": "Naan",
      "unit": "piece",
      "price": 40,
      "icon": "🫓",
      "nameUrdu": "نان",
      "image": "assets/catalog-images/naan-e5c4e0.webp",
      "imageLevel": "item"
     },
     {
      "name": "Roghni Naan",
      "unit": "piece",
      "price": 60,
      "icon": "🫓",
      "nameUrdu": "روغنی نان",
      "image": "assets/catalog-images/roghni-naan-990097.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/paratha-breads-37a291.webp"
   },
   {
    "name": "Breakfast",
    "items": [
     {
      "name": "Halwa Puri Set",
      "unit": "piece",
      "price": 200,
      "icon": "🍽️",
      "nameUrdu": "حلوہ پوری",
      "image": "assets/catalog-images/halwa-puri-883829.webp",
      "imageLevel": "item"
     },
     {
      "name": "Puri (2pc)",
      "unit": "piece",
      "price": 60,
      "icon": "🫓",
      "nameUrdu": "پوری",
      "imageUrl": "https://images.unsplash.com/photo-1605719161691-5d9771fc144f?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Syed Hussaini",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/fried-egg-on-white-ceramic-plate-r6Y01QzcVdY",
       "source": "Unsplash"
      }
     },
     {
      "name": "Suji Halwa Plate",
      "unit": "piece",
      "price": 150,
      "icon": "🍮",
      "nameUrdu": "سوجی حلوہ",
      "image": "assets/catalog-images/suji-halwa-plate-c56bef.webp",
      "imageLevel": "item"
     },
     {
      "name": "Anda (Half Fry)",
      "unit": "piece",
      "price": 80,
      "icon": "🍳",
      "nameUrdu": "انڈا ہاف فرائی",
      "imageUrl": "https://images.unsplash.com/photo-1691480184494-d9f822edd4d1?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "personalgraphic.com",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-fried-egg-on-a-white-plate-8oNpesw9idE",
       "source": "Unsplash"
      }
     },
     {
      "name": "Anda (Omelette)",
      "unit": "piece",
      "price": 100,
      "icon": "🍳",
      "nameUrdu": "آملیٹ",
      "image": "assets/catalog-images/anda-077a10.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8b21lbGV0dGUlMjBvbiUyMHBsYXRlfGVufDF8fHx8MTc5MjI1NTUxM3ww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Alev Takil",
       "profileUrl": "https://unsplash.com/@alevtakil",
       "photoUrl": "https://unsplash.com/photos/breakfast-tray-with-pastries-and-juice-lw3Lqe2K7xc",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/lw3Lqe2K7xc/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8b21lbGV0dGUlMjBvbiUyMHBsYXRlfGVufDF8fHx8MTc5MjI1NTUxM3ww",
      "imageSource": "unsplash"
     },
     {
      "name": "Chanay Plate",
      "unit": "piece",
      "price": 180,
      "icon": "🫘",
      "nameUrdu": "چنے",
      "imageUrl": "https://images.unsplash.com/photo-1779119867390-c64f66cd02b8?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "tommao wang",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-beans-in-tomato-sauce-served-in-a-white-bowl-IcSyeAnOj6k",
       "source": "Unsplash"
      }
     },
     {
      "name": "Siri Paye Plate",
      "unit": "piece",
      "price": 350,
      "icon": "🍲",
      "nameUrdu": "سری پائے"
     },
     {
      "name": "Nihari Plate",
      "unit": "piece",
      "price": 300,
      "icon": "🍲",
      "nameUrdu": "نہاری",
      "imageUrl": "https://images.unsplash.com/photo-1708782344071-c5382e27ef3e?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Rimsha Noor",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bowl-of-soup-on-a-wooden-table-YAfJ0LC-uNE",
       "source": "Unsplash"
      }
     }
    ],
    "image": "assets/catalog-images/breakfast-f2265d.webp",
    "imageUrl": "https://images.unsplash.com/photo-1708782344071-c5382e27ef3e?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "Rimsha Noor",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/a-bowl-of-soup-on-a-wooden-table-YAfJ0LC-uNE",
     "source": "Unsplash"
    }
   },
   {
    "name": "Snacks",
    "items": [
     {
      "name": "Samosa (2pc)",
      "unit": "piece",
      "price": 80,
      "icon": "🥟",
      "nameUrdu": "سموسے",
      "image": "assets/catalog-images/samosa-166e8e.webp",
      "imageLevel": "item"
     },
     {
      "name": "Bun Kebab",
      "unit": "piece",
      "price": 150,
      "icon": "🍔",
      "nameUrdu": "بن کباب",
      "image": "assets/catalog-images/bun-kebab-dd0852.webp",
      "imageLevel": "item"
     },
     {
      "name": "Shami Kebab (2pc)",
      "unit": "piece",
      "price": 120,
      "icon": "🥙",
      "nameUrdu": "شامی کباب",
      "image": "assets/catalog-images/shami-kebab-cac26b.webp",
      "imageLevel": "item"
     },
     {
      "name": "Chicken Samosa (2pc)",
      "unit": "piece",
      "price": 120,
      "icon": "🥟",
      "nameUrdu": "چکن سموسے",
      "image": "assets/catalog-images/chicken-samosa-1014e3.webp",
      "imageLevel": "item"
     },
     {
      "name": "Pakoray Plate",
      "unit": "piece",
      "price": 200,
      "icon": "🥘",
      "nameUrdu": "پکوڑے",
      "image": "assets/catalog-images/snacks-e826d8.webp",
      "imageLevel": "category"
     },
     {
      "name": "French Fries Plate",
      "unit": "piece",
      "price": 180,
      "icon": "🍟",
      "image": "assets/catalog-images/french-fries-plate-258413.webp",
      "imageLevel": "item"
     },
     {
      "name": "Dahi Baray Plate",
      "unit": "piece",
      "price": 180,
      "icon": "🍶",
      "nameUrdu": "دہی بڑے",
      "image": "assets/catalog-images/snacks-e826d8.webp",
      "imageLevel": "category"
     },
     {
      "name": "Fruit Chaat Cup",
      "unit": "piece",
      "price": 150,
      "icon": "🍎",
      "nameUrdu": "فروٹ چاٹ",
      "image": "assets/catalog-images/snacks-e826d8.webp",
      "imageLevel": "category"
     }
    ],
    "image": "assets/catalog-images/snacks-e826d8.webp"
   },
   {
    "name": "Daily Supplies",
    "items": [
     {
      "name": "Tea Leaves 1kg (Bulk)",
      "unit": "packet",
      "price": 1350,
      "icon": "🍵",
      "nameUrdu": "چائے پتی",
      "image": "assets/catalog-images/tea-leaves-8f2e55.webp",
      "imageLevel": "item"
     },
     {
      "name": "Milk 5 Litre (Daily)",
      "unit": "litre",
      "price": 900,
      "icon": "🥛",
      "nameUrdu": "دودھ",
      "imageUrl": "https://images.unsplash.com/photo-1639151082235-406d8eb262b9?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Mary Skrynnikova",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bottle-of-milk-next-to-a-glass-of-milk-c6TKtsi8C1k",
       "source": "Unsplash"
      }
     },
     {
      "name": "Sugar 5kg",
      "unit": "packet",
      "price": 860,
      "icon": "🧂",
      "nameUrdu": "چینی",
      "image": "assets/catalog-images/sugar-f0dc7a.webp",
      "imageLevel": "item"
     },
     {
      "name": "Disposable Cups (Pack of 100)",
      "unit": "packet",
      "price": 350,
      "icon": "🥤",
      "nameUrdu": "ڈسپوزایبل کپ",
      "image": "assets/catalog-images/disposable-cups-ce6c31.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/daily-supplies-f5ae1f.webp"
   }
  ]
 },
 {
  "shopType": "Restaurant, Fast Food & Cafe",
  "icon": "🍽️",
  "categories": [
   {
    "name": "Desi Mains",
    "items": [
     {
      "name": "Chicken Karahi (Full)",
      "unit": "piece",
      "price": 1650,
      "icon": "🥘",
      "nameUrdu": "چکن کڑاہی",
      "image": "assets/catalog-images/chicken-karahi-c2623d.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1728910156510-77488f19b152?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Perspective Studio",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-table-filled-with-lots-of-different-types-of-food-DUOpUlw4uLY",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Chicken Karahi (Half)",
      "unit": "piece",
      "price": 900,
      "icon": "🥘",
      "nameUrdu": "چکن کڑاہی",
      "image": "assets/catalog-images/chicken-karahi-c2623d.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1728910156510-77488f19b152?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Perspective Studio",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-table-filled-with-lots-of-different-types-of-food-DUOpUlw4uLY",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Chicken White Karahi (Full)",
      "unit": "piece",
      "price": 1750,
      "icon": "🥘",
      "nameUrdu": "وائٹ کڑاہی",
      "image": "assets/catalog-images/chicken-white-karahi-8bd96a.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1728910156510-77488f19b152?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Perspective Studio",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-table-filled-with-lots-of-different-types-of-food-DUOpUlw4uLY",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Chicken Jalfrezi",
      "unit": "piece",
      "price": 850,
      "icon": "🥘",
      "nameUrdu": "چکن جلفریزی",
      "image": "assets/catalog-images/chicken-jalfrezi-ed5992.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1728910156510-77488f19b152?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Perspective Studio",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-table-filled-with-lots-of-different-types-of-food-DUOpUlw4uLY",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Chicken Handi",
      "unit": "piece",
      "price": 950,
      "icon": "🍲",
      "nameUrdu": "چکن ہانڈی",
      "image": "assets/catalog-images/chicken-handi-c84240.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1728910156510-77488f19b152?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Perspective Studio",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-table-filled-with-lots-of-different-types-of-food-DUOpUlw4uLY",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Butter Chicken",
      "unit": "piece",
      "price": 1050,
      "icon": "🍗",
      "image": "assets/catalog-images/butter-chicken-4706df.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1728910156510-77488f19b152?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Perspective Studio",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-table-filled-with-lots-of-different-types-of-food-DUOpUlw4uLY",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Daal Fry",
      "unit": "piece",
      "price": 450,
      "icon": "🫘",
      "nameUrdu": "دال فرائی",
      "image": "assets/catalog-images/daal-fry-0f2aec.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1728910156510-77488f19b152?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Perspective Studio",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-table-filled-with-lots-of-different-types-of-food-DUOpUlw4uLY",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Daal Makhani",
      "unit": "piece",
      "price": 550,
      "icon": "🍲",
      "nameUrdu": "دال مکھنی",
      "image": "assets/catalog-images/daal-makhani-fb5d01.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1728910156510-77488f19b152?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Perspective Studio",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-table-filled-with-lots-of-different-types-of-food-DUOpUlw4uLY",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Palak Paneer",
      "unit": "piece",
      "price": 750,
      "icon": "🥬",
      "nameUrdu": "پالک پنیر",
      "image": "assets/catalog-images/palak-paneer-b7e8e8.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1728910156510-77488f19b152?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Perspective Studio",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-table-filled-with-lots-of-different-types-of-food-DUOpUlw4uLY",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Mixed Vegetable",
      "unit": "piece",
      "price": 550,
      "icon": "🥦",
      "nameUrdu": "مکس سبزی",
      "image": "assets/catalog-images/mixed-vegetable-559695.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1728910156510-77488f19b152?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Perspective Studio",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-table-filled-with-lots-of-different-types-of-food-DUOpUlw4uLY",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Chicken Biryani",
      "unit": "piece",
      "price": 320,
      "icon": "🍚",
      "nameUrdu": "چکن بریانی",
      "image": "assets/catalog-images/chicken-biryani-022ae9.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1728910156510-77488f19b152?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Perspective Studio",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-table-filled-with-lots-of-different-types-of-food-DUOpUlw4uLY",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Beef Biryani",
      "unit": "piece",
      "price": 380,
      "icon": "🍚",
      "nameUrdu": "بیف بریانی",
      "image": "assets/catalog-images/beef-biryani-d0bc8c.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1728910156510-77488f19b152?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Perspective Studio",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-table-filled-with-lots-of-different-types-of-food-DUOpUlw4uLY",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Sindhi Biryani",
      "unit": "piece",
      "price": 350,
      "icon": "🍚",
      "nameUrdu": "سندھی بریانی",
      "image": "assets/catalog-images/sindhi-biryani-a42fb0.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1728910156510-77488f19b152?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Perspective Studio",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-table-filled-with-lots-of-different-types-of-food-DUOpUlw4uLY",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Chicken Pulao",
      "unit": "piece",
      "price": 350,
      "icon": "🍚",
      "nameUrdu": "چکن پلاؤ",
      "image": "assets/catalog-images/chicken-pulao-9cd676.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1728910156510-77488f19b152?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Perspective Studio",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-table-filled-with-lots-of-different-types-of-food-DUOpUlw4uLY",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Beef Pulao",
      "unit": "piece",
      "price": 400,
      "icon": "🍚",
      "nameUrdu": "بیف پلاؤ",
      "image": "assets/catalog-images/beef-pulao-465bcc.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1728910156510-77488f19b152?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Perspective Studio",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-table-filled-with-lots-of-different-types-of-food-DUOpUlw4uLY",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Mutton Pulao",
      "unit": "piece",
      "price": 650,
      "icon": "🍚",
      "nameUrdu": "مٹن پلاؤ",
      "image": "assets/catalog-images/mutton-pulao-4bd55b.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1728910156510-77488f19b152?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Perspective Studio",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-table-filled-with-lots-of-different-types-of-food-DUOpUlw4uLY",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1728910156510-77488f19b152?w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Perspective Studio",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/a-table-filled-with-lots-of-different-types-of-food-DUOpUlw4uLY",
     "source": "Unsplash"
    }
   },
   {
    "name": "BBQ",
    "items": [
     {
      "name": "Chicken Tikka (Leg)",
      "unit": "piece",
      "price": 320,
      "icon": "🍗",
      "nameUrdu": "چکن ٹکا",
      "image": "assets/catalog-images/chicken-tikka-a36a56.webp",
      "imageLevel": "item"
     },
     {
      "name": "Chicken Tikka (Chest)",
      "unit": "piece",
      "price": 380,
      "icon": "🍗",
      "nameUrdu": "چکن ٹکا",
      "image": "assets/catalog-images/chicken-tikka-a36a56.webp",
      "imageLevel": "item"
     },
     {
      "name": "Malai Boti (8pc)",
      "unit": "piece",
      "price": 650,
      "icon": "🍢",
      "nameUrdu": "ملائی بوٹی",
      "image": "assets/catalog-images/malai-boti-a07d33.webp",
      "imageLevel": "item"
     },
     {
      "name": "Seekh Kabab Beef (4pc)",
      "unit": "piece",
      "price": 550,
      "icon": "🍢",
      "nameUrdu": "سیخ کباب",
      "image": "assets/catalog-images/seekh-kabab-beef-02b9ec.webp",
      "imageLevel": "item"
     },
     {
      "name": "Seekh Kabab Chicken (4pc)",
      "unit": "piece",
      "price": 500,
      "icon": "🍢",
      "nameUrdu": "چکن سیخ کباب",
      "image": "assets/catalog-images/seekh-kabab-chicken-b7a055.webp",
      "imageLevel": "item"
     },
     {
      "name": "Chapli Kabab (2pc)",
      "unit": "piece",
      "price": 380,
      "icon": "🥙",
      "nameUrdu": "چپلی کباب",
      "image": "assets/catalog-images/chapli-kabab-f821c7.webp",
      "imageLevel": "item"
     },
     {
      "name": "Chicken Wings Grilled (8pc)",
      "unit": "piece",
      "price": 650,
      "icon": "🍗",
      "image": "assets/catalog-images/chicken-wings-grilled-00dc94.webp",
      "imageLevel": "item"
     },
     {
      "name": "Mutton Chops BBQ (4pc)",
      "unit": "piece",
      "price": 1150,
      "icon": "🍖",
      "image": "assets/catalog-images/bbq-709cf7.webp",
      "imageLevel": "category"
     },
     {
      "name": "BBQ Platter (Family)",
      "unit": "piece",
      "price": 2450,
      "icon": "🍽️",
      "image": "assets/catalog-images/bbq-platter-0bf136.webp",
      "imageLevel": "item"
     },
     {
      "name": "Fish Grilled",
      "unit": "piece",
      "price": 850,
      "icon": "🐟",
      "nameUrdu": "گرلڈ مچھلی",
      "image": "assets/catalog-images/fish-grilled-15b88d.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/bbq-709cf7.webp"
   },
   {
    "name": "Fast Food",
    "items": [
     {
      "name": "Zinger Burger",
      "unit": "piece",
      "price": 550,
      "icon": "🍔",
      "image": "assets/catalog-images/zinger-burger-e0df92.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jonathan Borba",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/burger-with-fries-8l8Yl2ruUsg",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Beef Smash Burger",
      "unit": "piece",
      "price": 750,
      "icon": "🍔",
      "image": "assets/catalog-images/beef-smash-burger-c149e9.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jonathan Borba",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/burger-with-fries-8l8Yl2ruUsg",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Chicken Patty Burger",
      "unit": "piece",
      "price": 350,
      "icon": "🍔",
      "image": "assets/catalog-images/chicken-patty-burger-1e03d7.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jonathan Borba",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/burger-with-fries-8l8Yl2ruUsg",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Shawarma (Chicken)",
      "unit": "piece",
      "price": 320,
      "icon": "🌯",
      "nameUrdu": "شاورما",
      "image": "assets/catalog-images/shawarma-dd8c19.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jonathan Borba",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/burger-with-fries-8l8Yl2ruUsg",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Shawarma Platter",
      "unit": "piece",
      "price": 650,
      "icon": "🌯",
      "nameUrdu": "شاورما پلیٹر",
      "image": "assets/catalog-images/shawarma-platter-8df58c.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jonathan Borba",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/burger-with-fries-8l8Yl2ruUsg",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Chicken Broast (2pc)",
      "unit": "piece",
      "price": 550,
      "icon": "🍗",
      "image": "assets/catalog-images/chicken-broast-703dd5.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jonathan Borba",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/burger-with-fries-8l8Yl2ruUsg",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Crispy Chicken Strips (6pc)",
      "unit": "piece",
      "price": 550,
      "icon": "🍗",
      "image": "assets/catalog-images/crispy-chicken-strips-062b6c.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jonathan Borba",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/burger-with-fries-8l8Yl2ruUsg",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Loaded Fries",
      "unit": "piece",
      "price": 650,
      "icon": "🍟",
      "image": "assets/catalog-images/loaded-fries-80b7fd.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jonathan Borba",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/burger-with-fries-8l8Yl2ruUsg",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Masala Fries",
      "unit": "piece",
      "price": 350,
      "icon": "🍟",
      "image": "assets/catalog-images/masala-fries-b9ad0d.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jonathan Borba",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/burger-with-fries-8l8Yl2ruUsg",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Chicken Fajita Pizza (Small)",
      "unit": "piece",
      "price": 1150,
      "icon": "🍕",
      "image": "assets/catalog-images/chicken-fajita-pizza-4b580a.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jonathan Borba",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/burger-with-fries-8l8Yl2ruUsg",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Chicken Tikka Pizza (Small)",
      "unit": "piece",
      "price": 1150,
      "icon": "🍕",
      "image": "assets/catalog-images/chicken-tikka-pizza-1e657a.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jonathan Borba",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/burger-with-fries-8l8Yl2ruUsg",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Cheese Lovers Pizza (Small)",
      "unit": "piece",
      "price": 1250,
      "icon": "🍕",
      "image": "assets/catalog-images/cheese-lovers-pizza-fc5a93.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jonathan Borba",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/burger-with-fries-8l8Yl2ruUsg",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Garlic Bread (4pc)",
      "unit": "piece",
      "price": 450,
      "icon": "🥖",
      "image": "assets/catalog-images/garlic-bread-add097.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jonathan Borba",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/burger-with-fries-8l8Yl2ruUsg",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Chicken Wings Buffalo (8pc)",
      "unit": "piece",
      "price": 750,
      "icon": "🍗",
      "image": "assets/catalog-images/chicken-wings-buffalo-1e65ed.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jonathan Borba",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/burger-with-fries-8l8Yl2ruUsg",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Club Sandwich",
      "unit": "piece",
      "price": 550,
      "icon": "🥪",
      "image": "assets/catalog-images/club-sandwich-884579.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jonathan Borba",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/burger-with-fries-8l8Yl2ruUsg",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Grilled Sandwich",
      "unit": "piece",
      "price": 450,
      "icon": "🥪",
      "image": "assets/catalog-images/grilled-sandwich-0dc1e9.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jonathan Borba",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/burger-with-fries-8l8Yl2ruUsg",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     }
    ],
    "image": "assets/catalog-images/fast-food-dcaab7.webp",
    "imageUrl": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Jonathan Borba",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/burger-with-fries-8l8Yl2ruUsg",
     "source": "Unsplash"
    }
   },
   {
    "name": "Chinese",
    "items": [
     {
      "name": "Chicken Chow Mein",
      "unit": "piece",
      "price": 650,
      "icon": "🍜",
      "image": "assets/catalog-images/chicken-chow-mein-dc7d8b.webp",
      "imageLevel": "item"
     },
     {
      "name": "Vegetable Chow Mein",
      "unit": "piece",
      "price": 550,
      "icon": "🍜",
      "image": "assets/catalog-images/vegetable-chow-mein-deed49.webp",
      "imageLevel": "item"
     },
     {
      "name": "Chicken Fried Rice",
      "unit": "piece",
      "price": 550,
      "icon": "🍚",
      "image": "assets/catalog-images/chicken-fried-rice-06e7bd.webp",
      "imageLevel": "item"
     },
     {
      "name": "Egg Fried Rice",
      "unit": "piece",
      "price": 450,
      "icon": "🍳",
      "image": "assets/catalog-images/egg-fried-rice-5809b7.webp",
      "imageLevel": "item"
     },
     {
      "name": "Kung Pao Chicken",
      "unit": "piece",
      "price": 850,
      "icon": "🍗",
      "image": "assets/catalog-images/kung-pao-chicken-dc1498.webp",
      "imageLevel": "item"
     },
     {
      "name": "Sweet & Sour Chicken",
      "unit": "piece",
      "price": 850,
      "icon": "🍗",
      "image": "assets/catalog-images/sweet-sour-chicken-aa440f.webp",
      "imageLevel": "item"
     },
     {
      "name": "Chicken Manchurian",
      "unit": "piece",
      "price": 850,
      "icon": "🥘",
      "image": "assets/catalog-images/chicken-manchurian-191f77.webp",
      "imageLevel": "item"
     },
     {
      "name": "Hot & Sour Soup",
      "unit": "piece",
      "price": 450,
      "icon": "🍲",
      "image": "assets/catalog-images/hot-sour-soup-a4ab91.webp",
      "imageLevel": "item"
     },
     {
      "name": "Chicken Corn Soup",
      "unit": "piece",
      "price": 400,
      "icon": "🍲",
      "image": "assets/catalog-images/chicken-corn-soup-714824.webp",
      "imageLevel": "item"
     },
     {
      "name": "Spring Rolls (4pc)",
      "unit": "piece",
      "price": 450,
      "icon": "🥠",
      "image": "assets/catalog-images/spring-rolls-9b75e3.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/chinese-3b2611.webp"
   },
   {
    "name": "Drinks & Shakes",
    "items": [
     {
      "name": "Fresh Orange Juice",
      "unit": "piece",
      "price": 350,
      "icon": "🍊",
      "nameUrdu": "تازہ سنگترے کا رس",
      "imageUrl": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "ABHISHEK HAJARE",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/orange-juice-in-clear-drinking-glass-kkrXVKK-jhg",
       "source": "Unsplash"
      }
     },
     {
      "name": "Mango Shake",
      "unit": "piece",
      "price": 450,
      "icon": "🥭",
      "imageUrl": "https://images.unsplash.com/photo-1778449270554-3e5b17cfebc6?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Shoeib Abolhassani",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-refreshing-mango-smoothie-with-mint-and-pineapple-garnish-4T-TAAKc0jk",
       "source": "Unsplash"
      }
     },
     {
      "name": "Banana Shake",
      "unit": "piece",
      "price": 350,
      "icon": "🍌",
      "image": "assets/catalog-images/banana-shake-f7bc56.webp",
      "imageLevel": "item"
     },
     {
      "name": "Chocolate Shake",
      "unit": "piece",
      "price": 500,
      "icon": "🍫",
      "image": "assets/catalog-images/chocolate-shake-de772e.webp",
      "imageLevel": "item"
     },
     {
      "name": "Strawberry Shake",
      "unit": "piece",
      "price": 500,
      "icon": "🍓",
      "image": "assets/catalog-images/strawberry-shake-25e515.webp",
      "imageLevel": "item"
     },
     {
      "name": "Dates Shake",
      "unit": "piece",
      "price": 550,
      "icon": "🌴",
      "imageUrl": "https://images.unsplash.com/photo-1786052598262-9c649b0d825f?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "César O'neill",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-chocolate-milkshake-with-syrup-drizzle-and-a-black-straw-CRPPrOJPu_Q",
       "source": "Unsplash"
      }
     },
     {
      "name": "Cold Coffee",
      "unit": "piece",
      "price": 450,
      "icon": "☕",
      "image": "assets/catalog-images/cold-coffee-ce2eb7.webp",
      "imageLevel": "item"
     },
     {
      "name": "Mint Margarita",
      "unit": "piece",
      "price": 350,
      "icon": "🍋",
      "imageUrl": "https://images.unsplash.com/photo-1555949366-819808d99159?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Pixzolo Photography",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/lemon-juice-in-glass-with-mint-herb-cLmCH3aygHk",
       "source": "Unsplash"
      }
     },
     {
      "name": "Pina Colada",
      "unit": "piece",
      "price": 550,
      "icon": "🍍",
      "image": "assets/catalog-images/pina-colada-70676c.webp",
      "imageLevel": "item"
     },
     {
      "name": "Kashmiri Chai",
      "unit": "piece",
      "price": 250,
      "icon": "🩷",
      "nameUrdu": "کشمیری چائے",
      "image": "assets/catalog-images/kashmiri-chai-d55900.webp",
      "imageLevel": "item"
     },
     {
      "name": "Doodh Patti",
      "unit": "piece",
      "price": 150,
      "icon": "🍵",
      "nameUrdu": "دودھ پتی",
      "image": "assets/catalog-images/doodh-patti-168b32.webp",
      "imageLevel": "item"
     },
     {
      "name": "Mineral Water 500ml",
      "unit": "piece",
      "price": 120,
      "icon": "💧",
      "imageUrl": "https://images.unsplash.com/photo-1550505095-81378a674395?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Serenity Mitchell",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/water-plastic-bottle-uY4ZZZQ7uGE",
       "source": "Unsplash"
      }
     }
    ],
    "image": "assets/catalog-images/drinks-shakes-076598.webp"
   },
   {
    "name": "Desserts",
    "items": [
     {
      "name": "Gulab Jamun (4pc)",
      "unit": "piece",
      "price": 300,
      "icon": "🍩",
      "nameUrdu": "گلاب جامن",
      "image": "assets/catalog-images/gulab-jamun-bf85b4.webp",
      "imageLevel": "item"
     },
     {
      "name": "Kheer",
      "unit": "piece",
      "price": 300,
      "icon": "🍚",
      "nameUrdu": "کھیر",
      "image": "assets/catalog-images/kheer-932b59.webp",
      "imageLevel": "item"
     },
     {
      "name": "Shahi Tukra",
      "unit": "piece",
      "price": 350,
      "icon": "🍞",
      "nameUrdu": "شاہی ٹکڑا",
      "image": "assets/catalog-images/shahi-tukra-b68522.webp",
      "imageLevel": "item"
     },
     {
      "name": "Chocolate Brownie",
      "unit": "piece",
      "price": 450,
      "icon": "🍫",
      "image": "assets/catalog-images/chocolate-brownie-e857f0.webp",
      "imageLevel": "item"
     },
     {
      "name": "Ice Cream Scoop (2)",
      "unit": "piece",
      "price": 300,
      "icon": "🍨",
      "nameUrdu": "آئس کریم",
      "image": "assets/catalog-images/ice-cream-scoop-cc49b2.webp",
      "imageLevel": "item"
     },
     {
      "name": "Falooda",
      "unit": "piece",
      "price": 550,
      "icon": "🍧",
      "nameUrdu": "فالودہ",
      "image": "assets/catalog-images/falooda-d2319c.webp",
      "imageLevel": "item"
     },
     {
      "name": "Rabri",
      "unit": "piece",
      "price": 350,
      "icon": "🍮",
      "nameUrdu": "ربڑی",
      "image": "assets/catalog-images/rabri-d0dc91.webp",
      "imageLevel": "item"
     },
     {
      "name": "Kulfi Falooda",
      "unit": "piece",
      "price": 600,
      "icon": "🍦",
      "nameUrdu": "قلفی فالودہ",
      "image": "assets/catalog-images/kulfi-falooda-b652a0.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/desserts-66ea83.webp"
   },
   {
    "name": "Roti, Naan & Sides",
    "items": [
     {
      "name": "Tandoori Roti",
      "unit": "piece",
      "price": 30,
      "icon": "🫓",
      "nameUrdu": "تندوری روٹی",
      "image": "assets/catalog-images/tandoori-roti-52bf12.webp",
      "imageLevel": "item"
     },
     {
      "name": "Roghni Naan",
      "unit": "piece",
      "price": 70,
      "icon": "🫓",
      "nameUrdu": "روغنی نان",
      "image": "assets/catalog-images/roghni-naan-990097.webp",
      "imageLevel": "item"
     },
     {
      "name": "Garlic Naan",
      "unit": "piece",
      "price": 90,
      "icon": "🧄",
      "image": "assets/catalog-images/garlic-naan-b2908f.webp",
      "imageLevel": "item"
     },
     {
      "name": "Cheese Naan",
      "unit": "piece",
      "price": 180,
      "icon": "🧀",
      "image": "assets/catalog-images/cheese-naan-1b5aab.webp",
      "imageLevel": "item"
     },
     {
      "name": "Raita",
      "unit": "piece",
      "price": 120,
      "icon": "🍶",
      "nameUrdu": "رائتہ",
      "image": "assets/catalog-images/raita-014cf4.webp",
      "imageLevel": "item"
     },
     {
      "name": "Mint Chutney",
      "unit": "piece",
      "price": 120,
      "icon": "🌿",
      "nameUrdu": "پودینے کی چٹنی",
      "image": "assets/catalog-images/mint-chutney-b877b6.webp",
      "imageLevel": "item"
     },
     {
      "name": "Green Salad",
      "unit": "piece",
      "price": 200,
      "icon": "🥗",
      "imageUrl": "https://images.unsplash.com/photo-1786042614364-98b9b2abbf2d?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Karori Production",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bowl-of-fresh-vibrant-mixed-green-salad-bukVEcdLfJg",
       "source": "Unsplash"
      }
     },
     {
      "name": "Fries (Side)",
      "unit": "piece",
      "price": 280,
      "icon": "🍟",
      "imageUrl": "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Pixzolo Photography",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/fries-and-ketchup-8YBHgP0WrEo",
       "source": "Unsplash"
      }
     }
    ],
    "image": "assets/catalog-images/roti-naan-sides-914faf.webp"
   }
  ]
 },
 {
  "shopType": "Pharmacy / Medical Store",
  "icon": "💊",
  "categories": [
   {
    "name": "Pain Relief & Fever",
    "items": [
     {
      "name": "Paracetamol 500mg Strip of 10",
      "unit": "packet",
      "price": 40,
      "icon": "💊",
      "image": "assets/catalog-images/pain-relief-fever-b528d3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1719319384377-5f5a45b2f0d1?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Gizem Nikomedi",
       "profileUrl": "https://unsplash.com/@gnikomedi",
       "photoUrl": "https://unsplash.com/photos/the-word-war-spelled-out-of-pills-on-a-blue-background-oOW6Iju06T0",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/oOW6Iju06T0/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww",
      "imageSource": "unsplash"
     },
     {
      "name": "Paracetamol 650mg Strip of 10",
      "unit": "packet",
      "price": 60,
      "icon": "💊",
      "image": "assets/catalog-images/pain-relief-fever-b528d3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1719319384377-5f5a45b2f0d1?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Gizem Nikomedi",
       "profileUrl": "https://unsplash.com/@gnikomedi",
       "photoUrl": "https://unsplash.com/photos/the-word-war-spelled-out-of-pills-on-a-blue-background-oOW6Iju06T0",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/oOW6Iju06T0/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww",
      "imageSource": "unsplash"
     },
     {
      "name": "Paracetamol 250mg Strip of 10",
      "unit": "packet",
      "price": 35,
      "icon": "💊",
      "image": "assets/catalog-images/pain-relief-fever-b528d3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1719319384377-5f5a45b2f0d1?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Gizem Nikomedi",
       "profileUrl": "https://unsplash.com/@gnikomedi",
       "photoUrl": "https://unsplash.com/photos/the-word-war-spelled-out-of-pills-on-a-blue-background-oOW6Iju06T0",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/oOW6Iju06T0/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww",
      "imageSource": "unsplash"
     },
     {
      "name": "Ibuprofen 400mg Strip of 10",
      "unit": "packet",
      "price": 80,
      "icon": "💊",
      "image": "assets/catalog-images/pain-relief-fever-b528d3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1719319384377-5f5a45b2f0d1?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Gizem Nikomedi",
       "profileUrl": "https://unsplash.com/@gnikomedi",
       "photoUrl": "https://unsplash.com/photos/the-word-war-spelled-out-of-pills-on-a-blue-background-oOW6Iju06T0",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/oOW6Iju06T0/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww",
      "imageSource": "unsplash"
     },
     {
      "name": "Diclofenac Sodium 50mg Strip of 20",
      "unit": "packet",
      "price": 90,
      "icon": "💊",
      "image": "assets/catalog-images/pain-relief-fever-b528d3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1719319384377-5f5a45b2f0d1?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Gizem Nikomedi",
       "profileUrl": "https://unsplash.com/@gnikomedi",
       "photoUrl": "https://unsplash.com/photos/the-word-war-spelled-out-of-pills-on-a-blue-background-oOW6Iju06T0",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/oOW6Iju06T0/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww",
      "imageSource": "unsplash"
     },
     {
      "name": "Mefenamic Acid 250mg Strip of 10",
      "unit": "packet",
      "price": 70,
      "icon": "💊",
      "image": "assets/catalog-images/pain-relief-fever-b528d3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1719319384377-5f5a45b2f0d1?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Gizem Nikomedi",
       "profileUrl": "https://unsplash.com/@gnikomedi",
       "photoUrl": "https://unsplash.com/photos/the-word-war-spelled-out-of-pills-on-a-blue-background-oOW6Iju06T0",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/oOW6Iju06T0/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww",
      "imageSource": "unsplash"
     },
     {
      "name": "Piroxicam 20mg Strip of 10",
      "unit": "packet",
      "price": 80,
      "icon": "💊",
      "image": "assets/catalog-images/pain-relief-fever-b528d3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1719319384377-5f5a45b2f0d1?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Gizem Nikomedi",
       "profileUrl": "https://unsplash.com/@gnikomedi",
       "photoUrl": "https://unsplash.com/photos/the-word-war-spelled-out-of-pills-on-a-blue-background-oOW6Iju06T0",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/oOW6Iju06T0/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww",
      "imageSource": "unsplash"
     },
     {
      "name": "Ketorolac 10mg Strip of 10",
      "unit": "packet",
      "price": 90,
      "icon": "💊",
      "image": "assets/catalog-images/pain-relief-fever-b528d3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1719319384377-5f5a45b2f0d1?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Gizem Nikomedi",
       "profileUrl": "https://unsplash.com/@gnikomedi",
       "photoUrl": "https://unsplash.com/photos/the-word-war-spelled-out-of-pills-on-a-blue-background-oOW6Iju06T0",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/oOW6Iju06T0/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww",
      "imageSource": "unsplash"
     },
     {
      "name": "Aspirin 75mg Strip of 20",
      "unit": "packet",
      "price": 70,
      "icon": "💊",
      "image": "assets/catalog-images/aspirin-strip-v2-5fb53f.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1719319384377-5f5a45b2f0d1?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Gizem Nikomedi",
       "profileUrl": "https://unsplash.com/@gnikomedi",
       "photoUrl": "https://unsplash.com/photos/the-word-war-spelled-out-of-pills-on-a-blue-background-oOW6Iju06T0",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/oOW6Iju06T0/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww"
     },
     {
      "name": "Naproxen 250mg Strip of 10",
      "unit": "packet",
      "price": 85,
      "icon": "💊",
      "image": "assets/catalog-images/pain-relief-fever-b528d3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1719319384377-5f5a45b2f0d1?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Gizem Nikomedi",
       "profileUrl": "https://unsplash.com/@gnikomedi",
       "photoUrl": "https://unsplash.com/photos/the-word-war-spelled-out-of-pills-on-a-blue-background-oOW6Iju06T0",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/oOW6Iju06T0/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww",
      "imageSource": "unsplash"
     },
     {
      "name": "Flurbiprofen 100mg Strip of 20",
      "unit": "packet",
      "price": 95,
      "icon": "💊",
      "image": "assets/catalog-images/pain-relief-fever-b528d3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1719319384377-5f5a45b2f0d1?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Gizem Nikomedi",
       "profileUrl": "https://unsplash.com/@gnikomedi",
       "photoUrl": "https://unsplash.com/photos/the-word-war-spelled-out-of-pills-on-a-blue-background-oOW6Iju06T0",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/oOW6Iju06T0/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww",
      "imageSource": "unsplash"
     },
     {
      "name": "Etoricoxib 60mg Strip of 10",
      "unit": "packet",
      "price": 200,
      "icon": "💊",
      "image": "assets/catalog-images/pain-relief-fever-b528d3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1719319384377-5f5a45b2f0d1?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Gizem Nikomedi",
       "profileUrl": "https://unsplash.com/@gnikomedi",
       "photoUrl": "https://unsplash.com/photos/the-word-war-spelled-out-of-pills-on-a-blue-background-oOW6Iju06T0",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/oOW6Iju06T0/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww",
      "imageSource": "unsplash"
     },
     {
      "name": "Diclofenac Gel Tube 30g",
      "unit": "piece",
      "price": 150,
      "icon": "🧴",
      "image": "assets/catalog-images/pain-relief-fever-b528d3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1719319384377-5f5a45b2f0d1?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Gizem Nikomedi",
       "profileUrl": "https://unsplash.com/@gnikomedi",
       "photoUrl": "https://unsplash.com/photos/the-word-war-spelled-out-of-pills-on-a-blue-background-oOW6Iju06T0",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/oOW6Iju06T0/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww",
      "imageSource": "unsplash"
     },
     {
      "name": "Methyl Salicylate Balm Jar 40g",
      "unit": "piece",
      "price": 170,
      "icon": "🫙",
      "image": "assets/catalog-images/pain-relief-fever-b528d3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1719319384377-5f5a45b2f0d1?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Gizem Nikomedi",
       "profileUrl": "https://unsplash.com/@gnikomedi",
       "photoUrl": "https://unsplash.com/photos/the-word-war-spelled-out-of-pills-on-a-blue-background-oOW6Iju06T0",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/oOW6Iju06T0/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww",
      "imageSource": "unsplash"
     },
     {
      "name": "Muscle Relaxant Cream Tube 30g",
      "unit": "piece",
      "price": 180,
      "icon": "🧴",
      "image": "assets/catalog-images/pain-relief-fever-b528d3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1719319384377-5f5a45b2f0d1?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Gizem Nikomedi",
       "profileUrl": "https://unsplash.com/@gnikomedi",
       "photoUrl": "https://unsplash.com/photos/the-word-war-spelled-out-of-pills-on-a-blue-background-oOW6Iju06T0",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/oOW6Iju06T0/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww",
      "imageSource": "unsplash"
     },
     {
      "name": "Pain Relief Spray Bottle 100ml",
      "unit": "piece",
      "price": 250,
      "icon": "🧴",
      "image": "assets/catalog-images/pain-relief-fever-b528d3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1719319384377-5f5a45b2f0d1?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Gizem Nikomedi",
       "profileUrl": "https://unsplash.com/@gnikomedi",
       "photoUrl": "https://unsplash.com/photos/the-word-war-spelled-out-of-pills-on-a-blue-background-oOW6Iju06T0",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/oOW6Iju06T0/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww",
      "imageSource": "unsplash"
     },
     {
      "name": "Ibuprofen Suspension Bottle 100ml",
      "unit": "piece",
      "price": 120,
      "icon": "🍶",
      "image": "assets/catalog-images/pain-relief-fever-b528d3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1719319384377-5f5a45b2f0d1?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Gizem Nikomedi",
       "profileUrl": "https://unsplash.com/@gnikomedi",
       "photoUrl": "https://unsplash.com/photos/the-word-war-spelled-out-of-pills-on-a-blue-background-oOW6Iju06T0",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/oOW6Iju06T0/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww",
      "imageSource": "unsplash"
     },
     {
      "name": "Paracetamol Syrup Bottle 120ml",
      "unit": "piece",
      "price": 130,
      "icon": "🍶",
      "image": "assets/catalog-images/pain-relief-fever-b528d3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1719319384377-5f5a45b2f0d1?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Gizem Nikomedi",
       "profileUrl": "https://unsplash.com/@gnikomedi",
       "photoUrl": "https://unsplash.com/photos/the-word-war-spelled-out-of-pills-on-a-blue-background-oOW6Iju06T0",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/oOW6Iju06T0/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww",
      "imageSource": "unsplash"
     },
     {
      "name": "Paracetamol 125mg Syrup Bottle 90ml",
      "unit": "piece",
      "price": 110,
      "icon": "🍶",
      "image": "assets/catalog-images/pain-relief-fever-b528d3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1719319384377-5f5a45b2f0d1?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Gizem Nikomedi",
       "profileUrl": "https://unsplash.com/@gnikomedi",
       "photoUrl": "https://unsplash.com/photos/the-word-war-spelled-out-of-pills-on-a-blue-background-oOW6Iju06T0",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/oOW6Iju06T0/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww",
      "imageSource": "unsplash"
     }
    ],
    "image": "assets/catalog-images/pain-relief-fever-b528d3.webp",
    "imageUrl": "https://images.unsplash.com/photo-1719319384377-5f5a45b2f0d1?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8UGFpbiUyMFJlbGllZiUyMCUyMCUyMEZldmVyfGVufDF8fHx8MTc5MjI1NTUyOXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Gizem Nikomedi",
     "profileUrl": "https://unsplash.com/@gnikomedi",
     "photoUrl": "https://unsplash.com/photos/the-word-war-spelled-out-of-pills-on-a-blue-background-oOW6Iju06T0",
     "source": "Unsplash"
    }
   },
   {
    "name": "Cold, Cough & Allergy",
    "items": [
     {
      "name": "Cetirizine 10mg Strip of 10",
      "unit": "packet",
      "price": 60,
      "icon": "💊",
      "image": "assets/catalog-images/cold-cough-allergy-f57f4e.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1762328494465-274a63177884?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Zulfugar Karimov",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hand-holding-blister-packs-of-white-pills-dWUCuIEKjeg",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Loratadine 10mg Strip of 10",
      "unit": "packet",
      "price": 80,
      "icon": "💊",
      "image": "assets/catalog-images/cold-cough-allergy-f57f4e.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1762328494465-274a63177884?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Zulfugar Karimov",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hand-holding-blister-packs-of-white-pills-dWUCuIEKjeg",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Fexofenadine 120mg Strip of 10",
      "unit": "packet",
      "price": 150,
      "icon": "💊",
      "image": "assets/catalog-images/cold-cough-allergy-f57f4e.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1762328494465-274a63177884?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Zulfugar Karimov",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hand-holding-blister-packs-of-white-pills-dWUCuIEKjeg",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Chlorpheniramine 4mg Strip of 20",
      "unit": "packet",
      "price": 50,
      "icon": "💊",
      "image": "assets/catalog-images/cold-cough-allergy-f57f4e.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1762328494465-274a63177884?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Zulfugar Karimov",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hand-holding-blister-packs-of-white-pills-dWUCuIEKjeg",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Levocetirizine 5mg Strip of 10",
      "unit": "packet",
      "price": 90,
      "icon": "💊",
      "image": "assets/catalog-images/cold-cough-allergy-f57f4e.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1762328494465-274a63177884?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Zulfugar Karimov",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hand-holding-blister-packs-of-white-pills-dWUCuIEKjeg",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Dextromethorphan Cough Syrup 120ml",
      "unit": "piece",
      "price": 180,
      "icon": "🍶",
      "image": "assets/catalog-images/dextromethorphan-cough-syrup-18c4c4.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1635166304271-04931640a450?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Towfiqu barbhuiya",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bottle-of-liquid-sitting-on-top-of-a-table-1bZak-jXe7I",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Ambroxol Cough Syrup 120ml",
      "unit": "piece",
      "price": 200,
      "icon": "🍶",
      "image": "assets/catalog-images/cold-cough-allergy-f57f4e.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1635166304271-04931640a450?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Towfiqu barbhuiya",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bottle-of-liquid-sitting-on-top-of-a-table-1bZak-jXe7I",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Honey Cough Lozenges Box of 24",
      "unit": "box",
      "price": 130,
      "icon": "🍯",
      "image": "assets/catalog-images/cold-cough-allergy-f57f4e.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1770114047001-9953e9269285?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "atelierbyvineeth",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/vintage-zubes-cough-lozenges-tin-with-womans-portrait-PiE-Hvejbl8",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Menthol Inhaler Stick",
      "unit": "piece",
      "price": 90,
      "icon": "👃"
     },
     {
      "name": "Vapor Rub Jar 50g",
      "unit": "piece",
      "price": 180,
      "icon": "🫙",
      "image": "assets/catalog-images/cold-cough-allergy-f57f4e.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1737099970628-68bf5a292517?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Maria Kovalets",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-blue-jar-of-cream-next-to-a-green-leaf-kUWKf35RcpA",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Nasal Decongestant Spray Bottle 15ml",
      "unit": "piece",
      "price": 220,
      "icon": "👃",
      "image": "assets/catalog-images/cold-cough-allergy-f57f4e.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1610021684483-b06bf8ed5a41?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Diana Polekhina",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-brown-bottle-beside-white-tissue-box-REYb3IaZjj4",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Anti-Allergy Eye Drops Bottle 10ml",
      "unit": "piece",
      "price": 250,
      "icon": "👁️",
      "image": "assets/catalog-images/cold-cough-allergy-f57f4e.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1750125625145-7be950011e4c?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Soulride Photography",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hand-holding-eye-drops-ready-to-administer-Gz5mxa6jE2c",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Saline Nasal Drops Bottle 15ml",
      "unit": "piece",
      "price": 130,
      "icon": "👃"
     },
     {
      "name": "Steam Inhaler Cup",
      "unit": "piece",
      "price": 250,
      "icon": "♨️"
     },
     {
      "name": "Throat Soothing Tablets Strip of 20",
      "unit": "packet",
      "price": 100,
      "icon": "🍬",
      "image": "assets/catalog-images/cold-cough-allergy-f57f4e.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1762328494465-274a63177884?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Zulfugar Karimov",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hand-holding-blister-packs-of-white-pills-dWUCuIEKjeg",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Vitamin C + Zinc Cold Tablets Strip of 10",
      "unit": "packet",
      "price": 140,
      "icon": "💊",
      "image": "assets/catalog-images/vitamin-c-zinc-10b595.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1762328494465-274a63177884?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Zulfugar Karimov",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hand-holding-blister-packs-of-white-pills-dWUCuIEKjeg",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     }
    ],
    "image": "assets/catalog-images/cold-cough-allergy-f57f4e.webp",
    "imageUrl": "https://images.unsplash.com/photo-1635166304271-04931640a450?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "Towfiqu barbhuiya",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/a-bottle-of-liquid-sitting-on-top-of-a-table-1bZak-jXe7I",
     "source": "Unsplash"
    }
   },
   {
    "name": "Digestive Health",
    "items": [
     {
      "name": "Omeprazole 20mg Strip of 14",
      "unit": "packet",
      "price": 120,
      "icon": "💊",
      "image": "assets/catalog-images/digestive-health-v2-3d48dc.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Christine Sandu",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-blue-medication-pill-blister-pack-jwWtZrm67VI",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Esomeprazole 20mg Strip of 14",
      "unit": "packet",
      "price": 160,
      "icon": "💊",
      "image": "assets/catalog-images/digestive-health-v2-3d48dc.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Christine Sandu",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-blue-medication-pill-blister-pack-jwWtZrm67VI",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Antacid Chewable Tablets Strip of 20",
      "unit": "packet",
      "price": 80,
      "icon": "💊",
      "image": "assets/catalog-images/digestive-health-v2-3d48dc.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Christine Sandu",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-blue-medication-pill-blister-pack-jwWtZrm67VI",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Antacid Syrup Bottle 200ml",
      "unit": "piece",
      "price": 220,
      "icon": "🍶",
      "image": "assets/catalog-images/digestive-health-v2-3d48dc.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Christine Sandu",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-blue-medication-pill-blister-pack-jwWtZrm67VI",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "ORS Sachet",
      "unit": "piece",
      "price": 25,
      "icon": "🧂",
      "image": "assets/catalog-images/ors-sachet-e2deed.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Christine Sandu",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-blue-medication-pill-blister-pack-jwWtZrm67VI",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "ORS Box of 10 Sachets",
      "unit": "box",
      "price": 220,
      "icon": "🧂",
      "image": "assets/catalog-images/ors-9ba669.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Christine Sandu",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-blue-medication-pill-blister-pack-jwWtZrm67VI",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Loperamide 2mg Strip of 10",
      "unit": "packet",
      "price": 60,
      "icon": "💊",
      "image": "assets/catalog-images/digestive-health-v2-3d48dc.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Christine Sandu",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-blue-medication-pill-blister-pack-jwWtZrm67VI",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Lactulose Syrup Bottle 120ml",
      "unit": "piece",
      "price": 280,
      "icon": "🍶",
      "image": "assets/catalog-images/digestive-health-v2-3d48dc.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Christine Sandu",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-blue-medication-pill-blister-pack-jwWtZrm67VI",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Domperidone 10mg Strip of 20",
      "unit": "packet",
      "price": 90,
      "icon": "💊",
      "image": "assets/catalog-images/digestive-health-v2-3d48dc.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Christine Sandu",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-blue-medication-pill-blister-pack-jwWtZrm67VI",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Simethicone Drops Bottle 15ml",
      "unit": "piece",
      "price": 150,
      "icon": "💧",
      "image": "assets/catalog-images/digestive-health-v2-3d48dc.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Christine Sandu",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-blue-medication-pill-blister-pack-jwWtZrm67VI",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Activated Charcoal Tablets Strip of 10",
      "unit": "packet",
      "price": 100,
      "icon": "💊",
      "image": "assets/catalog-images/digestive-health-v2-3d48dc.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Christine Sandu",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-blue-medication-pill-blister-pack-jwWtZrm67VI",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Glycerin Suppositories Box of 6",
      "unit": "box",
      "price": 120,
      "icon": "💊",
      "image": "assets/catalog-images/digestive-health-v2-3d48dc.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Christine Sandu",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-blue-medication-pill-blister-pack-jwWtZrm67VI",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Probiotic Sachets Box of 10",
      "unit": "box",
      "price": 400,
      "icon": "💊",
      "image": "assets/catalog-images/digestive-health-v2-3d48dc.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Christine Sandu",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-blue-medication-pill-blister-pack-jwWtZrm67VI",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Digestive Enzyme Tablets Strip of 20",
      "unit": "packet",
      "price": 140,
      "icon": "💊",
      "image": "assets/catalog-images/digestive-health-v2-3d48dc.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Christine Sandu",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-blue-medication-pill-blister-pack-jwWtZrm67VI",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Isabgol Husk Packet 100g",
      "unit": "packet",
      "price": 180,
      "icon": "🌾",
      "image": "assets/catalog-images/digestive-health-v2-3d48dc.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Christine Sandu",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-blue-medication-pill-blister-pack-jwWtZrm67VI",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     }
    ],
    "image": "assets/catalog-images/digestive-health-v2-3d48dc.webp",
    "imageUrl": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Christine Sandu",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/white-and-blue-medication-pill-blister-pack-jwWtZrm67VI",
     "source": "Unsplash"
    }
   },
   {
    "name": "First Aid & Wound Care",
    "items": [
     {
      "name": "Adhesive Bandage Box of 100",
      "unit": "box",
      "price": 200,
      "icon": "🩹",
      "image": "assets/catalog-images/adhesive-bandage-100-3488aa.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1624638760852-8ede1666ab07?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Mathurin NAPOLY",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/open-red-medical-bag-with-supplies-MaKsx8JNbiI",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Elastic Crepe Bandage 4 inch",
      "unit": "piece",
      "price": 120,
      "icon": "🩹",
      "image": "assets/catalog-images/first-aid-wound-care-745dc1.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1624638760852-8ede1666ab07?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Mathurin NAPOLY",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/open-red-medical-bag-with-supplies-MaKsx8JNbiI",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Cotton Roll 200g",
      "unit": "piece",
      "price": 150,
      "icon": "🧻",
      "image": "assets/catalog-images/first-aid-wound-care-745dc1.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1624638760852-8ede1666ab07?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Mathurin NAPOLY",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/open-red-medical-bag-with-supplies-MaKsx8JNbiI",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Cotton Balls Packet",
      "unit": "packet",
      "price": 80,
      "icon": "🧻",
      "image": "assets/catalog-images/cotton-balls-packet-a74da5.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1624638760852-8ede1666ab07?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Mathurin NAPOLY",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/open-red-medical-bag-with-supplies-MaKsx8JNbiI",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Sterile Gauze Pads Box of 25",
      "unit": "box",
      "price": 180,
      "icon": "🩹",
      "image": "assets/catalog-images/sterile-gauze-pads-25-d92c98.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1624638760852-8ede1666ab07?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Mathurin NAPOLY",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/open-red-medical-bag-with-supplies-MaKsx8JNbiI",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Medical Adhesive Tape Roll",
      "unit": "piece",
      "price": 70,
      "icon": "🩹",
      "image": "assets/catalog-images/medical-adhesive-tape-roll-7c1916.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1624638760852-8ede1666ab07?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Mathurin NAPOLY",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/open-red-medical-bag-with-supplies-MaKsx8JNbiI",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Antiseptic Liquid Bottle 250ml",
      "unit": "piece",
      "price": 160,
      "icon": "🧴",
      "image": "assets/catalog-images/antiseptic-liquid-bottle-v2-9605b3.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1624638760852-8ede1666ab07?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Mathurin NAPOLY",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/open-red-medical-bag-with-supplies-MaKsx8JNbiI",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Povidone Iodine Ointment Tube 20g",
      "unit": "piece",
      "price": 130,
      "icon": "🧴",
      "image": "assets/catalog-images/first-aid-wound-care-745dc1.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1624638760852-8ede1666ab07?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Mathurin NAPOLY",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/open-red-medical-bag-with-supplies-MaKsx8JNbiI",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Hydrogen Peroxide Bottle 100ml",
      "unit": "piece",
      "price": 140,
      "icon": "🧴",
      "image": "assets/catalog-images/hydrogen-peroxide-bottle-f8a318.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1624638760852-8ede1666ab07?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Mathurin NAPOLY",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/open-red-medical-bag-with-supplies-MaKsx8JNbiI",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Surgical Spirit Bottle 100ml",
      "unit": "piece",
      "price": 140,
      "icon": "🧴",
      "image": "assets/catalog-images/surgical-spirit-bottle-ace150.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1624638760852-8ede1666ab07?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Mathurin NAPOLY",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/open-red-medical-bag-with-supplies-MaKsx8JNbiI",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Burn Relief Cream Tube 25g",
      "unit": "piece",
      "price": 160,
      "icon": "🧴",
      "image": "assets/catalog-images/first-aid-wound-care-745dc1.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1624638760852-8ede1666ab07?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Mathurin NAPOLY",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/open-red-medical-bag-with-supplies-MaKsx8JNbiI",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Triangular Bandage",
      "unit": "piece",
      "price": 90,
      "icon": "🩹",
      "image": "assets/catalog-images/triangular-bandage-176fbd.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1624638760852-8ede1666ab07?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Mathurin NAPOLY",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/open-red-medical-bag-with-supplies-MaKsx8JNbiI",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "First Aid Kit Box",
      "unit": "box",
      "price": 1200,
      "icon": "🧰",
      "image": "assets/catalog-images/first-aid-kit-v2-c4429b.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1624638760852-8ede1666ab07?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Mathurin NAPOLY",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/open-red-medical-bag-with-supplies-MaKsx8JNbiI",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Digital Thermometer",
      "unit": "piece",
      "price": 450,
      "icon": "🌡️",
      "image": "assets/catalog-images/digital-thermometer-605d9f.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1624638760852-8ede1666ab07?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Mathurin NAPOLY",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/open-red-medical-bag-with-supplies-MaKsx8JNbiI",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Forehead Thermometer Strips Pack of 10",
      "unit": "packet",
      "price": 60,
      "icon": "🌡️",
      "image": "assets/catalog-images/first-aid-wound-care-745dc1.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1624638760852-8ede1666ab07?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Mathurin NAPOLY",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/open-red-medical-bag-with-supplies-MaKsx8JNbiI",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Hand Sanitizer Bottle 200ml",
      "unit": "piece",
      "price": 250,
      "icon": "🧴",
      "image": "assets/catalog-images/hand-sanitizer-bottle-fa7f93.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1624638760852-8ede1666ab07?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Mathurin NAPOLY",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/open-red-medical-bag-with-supplies-MaKsx8JNbiI",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Instant Cold Pack",
      "unit": "piece",
      "price": 180,
      "icon": "❄️",
      "image": "assets/catalog-images/instant-cold-153727.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1624638760852-8ede1666ab07?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Mathurin NAPOLY",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/open-red-medical-bag-with-supplies-MaKsx8JNbiI",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     }
    ],
    "image": "assets/catalog-images/first-aid-wound-care-745dc1.webp",
    "imageUrl": "https://images.unsplash.com/photo-1624638760852-8ede1666ab07?w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Mathurin NAPOLY",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/open-red-medical-bag-with-supplies-MaKsx8JNbiI",
     "source": "Unsplash"
    }
   },
   {
    "name": "Baby & Mother Care",
    "items": [
     {
      "name": "Baby Diapers Pack of 20",
      "unit": "packet",
      "price": 650,
      "icon": "👶",
      "image": "assets/catalog-images/baby-diapers-20-612f35.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1734599397715-f030c6d206a0?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Natracare",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-diaper-bag-filled-with-baby-items-and-a-stuffed-animal-aMca3BHUvmU",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Baby Wipes Pack of 80",
      "unit": "packet",
      "price": 450,
      "icon": "🧻",
      "image": "assets/catalog-images/baby-wipes-80-a21fd7.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1734599397715-f030c6d206a0?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Natracare",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-diaper-bag-filled-with-baby-items-and-a-stuffed-animal-aMca3BHUvmU",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Baby Lotion Bottle 200ml",
      "unit": "piece",
      "price": 350,
      "icon": "🧴",
      "image": "assets/catalog-images/baby-lotion-bottle-b559eb.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1734599397715-f030c6d206a0?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Natracare",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-diaper-bag-filled-with-baby-items-and-a-stuffed-animal-aMca3BHUvmU",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Baby Shampoo Bottle 200ml",
      "unit": "piece",
      "price": 380,
      "icon": "🧴",
      "image": "assets/catalog-images/baby-shampoo-bottle-201f9f.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1734599397715-f030c6d206a0?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Natracare",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-diaper-bag-filled-with-baby-items-and-a-stuffed-animal-aMca3BHUvmU",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Baby Powder Jar 200g",
      "unit": "piece",
      "price": 300,
      "icon": "🫙",
      "image": "assets/catalog-images/baby-mother-care-b9b634.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1734599397715-f030c6d206a0?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Natracare",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-diaper-bag-filled-with-baby-items-and-a-stuffed-animal-aMca3BHUvmU",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Baby Oil Bottle 200ml",
      "unit": "piece",
      "price": 320,
      "icon": "🧴",
      "image": "assets/catalog-images/baby-oil-bottle-fec389.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1750085036915-6e21c6981586?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8YmFieSUyMG9pbCUyMGJvdHRsZSUyMHByb2R1Y3R8ZW58MXx8fHwxNzkyMjU1NTA4fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "https://unsplash.com/@zoshuacolah",
       "photoUrl": "https://unsplash.com/photos/johnsons-baby-oil-and-lotion-are-displayed-8XtQp4UVB34",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/8XtQp4UVB34/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8YmFieSUyMG9pbCUyMGJvdHRsZSUyMHByb2R1Y3R8ZW58MXx8fHwxNzkyMjU1NTA4fDA",
      "imageSource": "unsplash"
     },
     {
      "name": "Baby Feeding Bottle 250ml",
      "unit": "piece",
      "price": 450,
      "icon": "🍼",
      "image": "assets/catalog-images/baby-feeding-bottle-edd165.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1734599397715-f030c6d206a0?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Natracare",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-diaper-bag-filled-with-baby-items-and-a-stuffed-animal-aMca3BHUvmU",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Silicone Nipples Set of 2",
      "unit": "packet",
      "price": 150,
      "icon": "🍼",
      "image": "assets/catalog-images/silicone-nipples-2-bf5a2f.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1734599397715-f030c6d206a0?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Natracare",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-diaper-bag-filled-with-baby-items-and-a-stuffed-animal-aMca3BHUvmU",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Diaper Rash Cream Tube 50g",
      "unit": "piece",
      "price": 280,
      "icon": "🧴",
      "image": "assets/catalog-images/baby-mother-care-b9b634.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1734599397715-f030c6d206a0?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Natracare",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-diaper-bag-filled-with-baby-items-and-a-stuffed-animal-aMca3BHUvmU",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Baby Soap Bar",
      "unit": "piece",
      "price": 180,
      "icon": "🧼",
      "image": "assets/catalog-images/baby-soap-bar-1e341d.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1734599397715-f030c6d206a0?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Natracare",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-diaper-bag-filled-with-baby-items-and-a-stuffed-animal-aMca3BHUvmU",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Baby Towel",
      "unit": "piece",
      "price": 550,
      "icon": "🧣",
      "image": "assets/catalog-images/baby-towel-b38777.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1734599397715-f030c6d206a0?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Natracare",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-diaper-bag-filled-with-baby-items-and-a-stuffed-animal-aMca3BHUvmU",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Kids Multivitamin Syrup Bottle 120ml",
      "unit": "piece",
      "price": 280,
      "icon": "🍶",
      "image": "assets/catalog-images/baby-mother-care-b9b634.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1734599397715-f030c6d206a0?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Natracare",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-diaper-bag-filled-with-baby-items-and-a-stuffed-animal-aMca3BHUvmU",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Iron Drops Bottle 15ml",
      "unit": "piece",
      "price": 180,
      "icon": "💧",
      "image": "assets/catalog-images/iron-drops-bottle-8b0a2b.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1734599397715-f030c6d206a0?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Natracare",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-diaper-bag-filled-with-baby-items-and-a-stuffed-animal-aMca3BHUvmU",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Teething Gel Tube 15g",
      "unit": "piece",
      "price": 220,
      "icon": "🧴",
      "image": "assets/catalog-images/baby-mother-care-b9b634.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1734599397715-f030c6d206a0?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Natracare",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-diaper-bag-filled-with-baby-items-and-a-stuffed-animal-aMca3BHUvmU",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     }
    ],
    "image": "assets/catalog-images/baby-mother-care-b9b634.webp",
    "imageUrl": "https://images.unsplash.com/photo-1734599397715-f030c6d206a0?w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Natracare",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/a-diaper-bag-filled-with-baby-items-and-a-stuffed-animal-aMca3BHUvmU",
     "source": "Unsplash"
    }
   },
   {
    "name": "Chronic Care & Devices",
    "items": [
     {
      "name": "Metformin 500mg Strip of 20",
      "unit": "packet",
      "price": 120,
      "icon": "💊",
      "image": "assets/catalog-images/chronic-care-devices-a5f70e.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1762328494465-274a63177884?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Zulfugar Karimov",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hand-holding-blister-packs-of-white-pills-dWUCuIEKjeg",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Glibenclamide 5mg Strip of 20",
      "unit": "packet",
      "price": 90,
      "icon": "💊",
      "image": "assets/catalog-images/chronic-care-devices-a5f70e.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1762328494465-274a63177884?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Zulfugar Karimov",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hand-holding-blister-packs-of-white-pills-dWUCuIEKjeg",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Amlodipine 5mg Strip of 20",
      "unit": "packet",
      "price": 110,
      "icon": "💊",
      "image": "assets/catalog-images/chronic-care-devices-a5f70e.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1762328494465-274a63177884?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Zulfugar Karimov",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hand-holding-blister-packs-of-white-pills-dWUCuIEKjeg",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Losartan 50mg Strip of 20",
      "unit": "packet",
      "price": 180,
      "icon": "💊",
      "image": "assets/catalog-images/chronic-care-devices-a5f70e.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1762328494465-274a63177884?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Zulfugar Karimov",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hand-holding-blister-packs-of-white-pills-dWUCuIEKjeg",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Atorvastatin 20mg Strip of 20",
      "unit": "packet",
      "price": 220,
      "icon": "💊",
      "image": "assets/catalog-images/chronic-care-devices-a5f70e.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1762328494465-274a63177884?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Zulfugar Karimov",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hand-holding-blister-packs-of-white-pills-dWUCuIEKjeg",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Thyroxine 50mcg Strip of 50",
      "unit": "packet",
      "price": 180,
      "icon": "💊",
      "image": "assets/catalog-images/chronic-care-devices-a5f70e.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1762328494465-274a63177884?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Zulfugar Karimov",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hand-holding-blister-packs-of-white-pills-dWUCuIEKjeg",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Blood Pressure Monitor",
      "unit": "piece",
      "price": 4500,
      "icon": "🩺",
      "image": "assets/catalog-images/blood-pressure-monitor-60ee1f.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Mockup Graphics",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/blood-pressure-monitor-with-grey-cuff-i1iqQRLULlg",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Digital Glucometer",
      "unit": "piece",
      "price": 2800,
      "icon": "🩸",
      "image": "assets/catalog-images/digital-glucometer-bd6b37.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1714642596931-2293df25c4a3?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Jane Korsak",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/blood-glucose-meter-with-test-strips-BlgBBf_b_94",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Blood Glucose Test Strips Box of 50",
      "unit": "box",
      "price": 1400,
      "icon": "🩸",
      "image": "assets/catalog-images/blood-glucose-test-strips-3901a1.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1714642596931-2293df25c4a3?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Jane Korsak",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/blood-glucose-meter-with-test-strips-BlgBBf_b_94",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Insulin Syringes Box of 10",
      "unit": "box",
      "price": 150,
      "icon": "💉",
      "image": "assets/catalog-images/insulin-syringes-v2-5b59ef.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1635091217983-9c1ac31651a3?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "NEXT Distro",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-package-of-bd-insulating-syringes-on-a-white-background-2YrAlcExTO8",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Alcohol Swabs Box of 100",
      "unit": "box",
      "price": 200,
      "icon": "🩹",
      "image": "assets/catalog-images/alcohol-swabs-100-9e0be2.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1635091237750-6ba40359e972?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "NEXT Distro",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-pair-of-scissors-sitting-on-top-of-a-box-1WXKq0Q-DUg",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Nebulizer Machine",
      "unit": "piece",
      "price": 5500,
      "icon": "💨",
      "image": "assets/catalog-images/nebulizer-machine-v2-8a385e.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1645273474732-8fd9c63a148f?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Sincerely Media",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-ventilator-and-oxygen-inhaler-on-a-bed-8wWvAarL_Vw",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Digital Pulse Oximeter",
      "unit": "piece",
      "price": 1800,
      "icon": "🩺",
      "image": "assets/catalog-images/digital-pulse-oximeter-b4e51a.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1626851528990-fee2c2e6fadb?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Mufid Majnun",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/person-holding-white-and-blue-plastic-container-gfQvLt6f6RM",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Hot Water Bag 2 Litre",
      "unit": "piece",
      "price": 350,
      "icon": "♨️",
      "image": "assets/catalog-images/hot-water-bag-8218a3.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1773747608435-0fa80d11a32f?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Yuliia Pakhomova",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-knitted-hot-water-bottle-with-a-green-stopper-4XlKcKpmjwU",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Surgical Gloves Box of 100",
      "unit": "box",
      "price": 600,
      "icon": "🧤",
      "image": "assets/catalog-images/surgical-gloves-100-e6d301.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1616524617587-2ddb5ccf87cc?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Wim van 't Einde",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/blue-gloves-on-white-surface-tCUaAk0pMBM",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Face Masks Box of 50",
      "unit": "box",
      "price": 350,
      "icon": "😷",
      "image": "assets/catalog-images/face-masks-50-2a693d.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1584634731339-252c581abfc5?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Mika Baumeister",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/green-and-white-striped-textile-uz_T7h8ds04",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     }
    ],
    "image": "assets/catalog-images/chronic-care-devices-a5f70e.webp",
    "imageUrl": "https://images.unsplash.com/photo-1635091237750-6ba40359e972?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "NEXT Distro",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/a-pair-of-scissors-sitting-on-top-of-a-box-1WXKq0Q-DUg",
     "source": "Unsplash"
    }
   },
   {
    "name": "Vitamins & Supplements",
    "items": [
     {
      "name": "Vitamin C 500mg Chewable Strip of 20",
      "unit": "packet",
      "price": 150,
      "icon": "💊",
      "image": "assets/catalog-images/vitamins-supplements-682b3f.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1627467959547-8e44da7aa00a?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jellybee",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/3-glass-bottles-on-brown-wooden-table-GpDSgnWFmwM",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Vitamin D3 Drops Bottle 15ml",
      "unit": "piece",
      "price": 280,
      "icon": "💧",
      "image": "assets/catalog-images/vitamins-supplements-682b3f.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1627467959547-8e44da7aa00a?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jellybee",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/3-glass-bottles-on-brown-wooden-table-GpDSgnWFmwM",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Calcium + Vitamin D Tablets Bottle of 60",
      "unit": "piece",
      "price": 450,
      "icon": "💊",
      "image": "assets/catalog-images/calcium-vitamin-d-v2-39b2fa.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1627467959547-8e44da7aa00a?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jellybee",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/3-glass-bottles-on-brown-wooden-table-GpDSgnWFmwM",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Multivitamin Strip of 20",
      "unit": "packet",
      "price": 200,
      "icon": "💊",
      "image": "assets/catalog-images/vitamins-supplements-682b3f.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1627467959547-8e44da7aa00a?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jellybee",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/3-glass-bottles-on-brown-wooden-table-GpDSgnWFmwM",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Iron + Folic Acid Strip of 30",
      "unit": "packet",
      "price": 160,
      "icon": "💊",
      "image": "assets/catalog-images/iron-folic-acid-9ce660.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1627467959547-8e44da7aa00a?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jellybee",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/3-glass-bottles-on-brown-wooden-table-GpDSgnWFmwM",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Zinc 20mg Strip of 20",
      "unit": "packet",
      "price": 180,
      "icon": "💊",
      "image": "assets/catalog-images/zinc-strip-20-6cad32.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1627467959547-8e44da7aa00a?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jellybee",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/3-glass-bottles-on-brown-wooden-table-GpDSgnWFmwM",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "B-Complex Strip of 20",
      "unit": "packet",
      "price": 170,
      "icon": "💊",
      "image": "assets/catalog-images/b-complex-strip-20-cf0e91.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1627467959547-8e44da7aa00a?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jellybee",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/3-glass-bottles-on-brown-wooden-table-GpDSgnWFmwM",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Cod Liver Oil Bottle of 60",
      "unit": "piece",
      "price": 500,
      "icon": "🐟",
      "image": "assets/catalog-images/cod-liver-oil-bottle-v2-55db4c.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1627467959547-8e44da7aa00a?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jellybee",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/3-glass-bottles-on-brown-wooden-table-GpDSgnWFmwM",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Omega-3 Capsules Bottle of 30",
      "unit": "piece",
      "price": 800,
      "icon": "💊",
      "image": "assets/catalog-images/vitamins-supplements-682b3f.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1627467959547-8e44da7aa00a?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jellybee",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/3-glass-bottles-on-brown-wooden-table-GpDSgnWFmwM",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Folic Acid 5mg Strip of 20",
      "unit": "packet",
      "price": 90,
      "icon": "💊",
      "image": "assets/catalog-images/vitamins-supplements-682b3f.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1627467959547-8e44da7aa00a?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jellybee",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/3-glass-bottles-on-brown-wooden-table-GpDSgnWFmwM",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Vitamin E 400mg Strip of 10",
      "unit": "packet",
      "price": 250,
      "icon": "💊",
      "image": "assets/catalog-images/vitamin-e-strip-10-eeb1a2.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1627467959547-8e44da7aa00a?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jellybee",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/3-glass-bottles-on-brown-wooden-table-GpDSgnWFmwM",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Electrolyte Powder Box of 6",
      "unit": "box",
      "price": 250,
      "icon": "🧂",
      "image": "assets/catalog-images/electrolyte-powder-6-9a3229.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1627467959547-8e44da7aa00a?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jellybee",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/3-glass-bottles-on-brown-wooden-table-GpDSgnWFmwM",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Glucosamine Tablets Bottle of 30",
      "unit": "piece",
      "price": 650,
      "icon": "💊",
      "image": "assets/catalog-images/vitamins-supplements-682b3f.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1627467959547-8e44da7aa00a?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jellybee",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/3-glass-bottles-on-brown-wooden-table-GpDSgnWFmwM",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     }
    ],
    "image": "assets/catalog-images/vitamins-supplements-682b3f.webp",
    "imageUrl": "https://images.unsplash.com/photo-1627467959547-8e44da7aa00a?w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Jellybee",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/3-glass-bottles-on-brown-wooden-table-GpDSgnWFmwM",
     "source": "Unsplash"
    }
   }
  ]
 },
 {
  "shopType": "Cosmetics & Beauty",
  "icon": "💄",
  "categories": [
   {
    "name": "Skin Care",
    "items": [
     {
      "name": "Face Wash Tube 100ml",
      "unit": "piece",
      "price": 350,
      "icon": "🧴",
      "image": "assets/catalog-images/face-wash-tube-946335.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1653919198052-546d44e2458e?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Sanju Pandita",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-tube-of-coffee-face-wash-sitting-on-a-counter-Sg0szdvF8-Q",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Moisturizing Cream Jar 100ml",
      "unit": "piece",
      "price": 450,
      "icon": "🫙",
      "image": "assets/catalog-images/skin-care-fe37e3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1737100917895-eee7006cdbbb?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Maria Kovalets",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-jar-of-cream-with-mint-leaves-on-a-white-table-Y89Qfa_H7-o",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Fairness Cream Jar 50ml",
      "unit": "piece",
      "price": 550,
      "icon": "🫙",
      "image": "assets/catalog-images/fairness-cream-jar-6b9863.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1764694071508-e4b1efcd39bc?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Pavlo",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/jar-of-luxurious-white-face-cream-with-silver-lid-7Cbs1ZJaPb0",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Sunscreen Lotion SPF 50",
      "unit": "piece",
      "price": 650,
      "icon": "☀️",
      "image": "assets/catalog-images/skin-care-fe37e3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1698906821407-c1b6be1bbd56?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Lal MAHAMMAD",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-tube-of-lakme-sun-expert-sunscreen-5zt2Jp5QesY",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Rose Water Bottle 120ml",
      "unit": "piece",
      "price": 200,
      "icon": "🌹",
      "image": "assets/catalog-images/rose-water-bottle-0768ae.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1599847935464-fde3827639c2?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Kalos Skincare",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/six-white-labeled-bottles-on-white-surface-lwOmVsTuLdg",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Facial Cleanser Bottle 150ml",
      "unit": "piece",
      "price": 400,
      "icon": "🧴",
      "image": "assets/catalog-images/skin-care-fe37e3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1745141063798-7fa04698ea80?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Ela De Pure",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bottle-of-gel-facial-cleanser-ppk8KD_CS-w",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Skin Toner Bottle 100ml",
      "unit": "piece",
      "price": 450,
      "icon": "🧴",
      "image": "assets/catalog-images/skin-toner-bottle-9576fd.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1770717984650-21665d4362b9?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Giulia Perera",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hand-holding-a-bottle-of-centella-brightening-toner-DMfebdkc1Hk",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Night Cream Jar 50ml",
      "unit": "piece",
      "price": 700,
      "icon": "🌙",
      "image": "assets/catalog-images/night-cream-jar-324fe5.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1786171128252-716f3915293d?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "mansi yadav",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/night-cream-jar-and-box-lHjr4nmDiQM",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Under-Eye Cream Tube 15ml",
      "unit": "piece",
      "price": 600,
      "icon": "👁️",
      "image": "assets/catalog-images/under-eye-cream-tube-3704b7.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1714980716123-4b6a640795a9?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Care mon",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-tube-of-eye-cream-on-a-white-background-kQyyyzVZ2E0",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Face Scrub Tube 100ml",
      "unit": "piece",
      "price": 380,
      "icon": "🧴"
     },
     {
      "name": "Sheet Mask",
      "unit": "piece",
      "price": 150,
      "icon": "🎭",
      "image": "assets/catalog-images/sheet-mask-v2-6827fe.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1741824806438-12e5776c942e?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Ela De Pure",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/anti-aging-face-masks-packaged-and-ready-for-sale-xX1TXb1NGcc",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Aloe Vera Gel Tube 150ml",
      "unit": "piece",
      "price": 350,
      "icon": "🌿",
      "image": "assets/catalog-images/skin-care-fe37e3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1743620660597-bb66a0316734?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Brian Kungu",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/aloe-vera-gel-jar-sits-on-a-black-table-NbfHdQVM8Z0",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Body Lotion Bottle 200ml",
      "unit": "piece",
      "price": 550,
      "icon": "🧴",
      "image": "assets/catalog-images/fix-body-lotion-bottle-d4f271.webp",
      "imageLevel": "item",
      "credit": {
       "name": "<a href=\"//commons.wikimedia.org/w/index.php?title=User:SarahMalik32&amp;action=",
       "profileUrl": "",
       "photoUrl": "https://commons.wikimedia.org/wiki/File%3AWarm_Vanilla_Sugar_shower_gel_and_lotion.jpg",
       "source": "Wikimedia Commons"
      }
     },
     {
      "name": "Petroleum Jelly Jar 100ml",
      "unit": "piece",
      "price": 250,
      "icon": "🫙",
      "image": "assets/catalog-images/skin-care-fe37e3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1626092807032-cb4f047c49f8?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Towfiqu barbhuiya",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/person-holding-blue-and-white-plastic-container-R7Z7bOhCFDU",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Cold Cream Jar 60ml",
      "unit": "piece",
      "price": 300,
      "icon": "🫙",
      "image": "assets/catalog-images/cold-cream-jar-v2-1bd886.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1629732047847-50219e9c5aef?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Poko Skincare",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-gray-round-plastic-container-QTGB4D8kDoc",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Lip Balm Stick",
      "unit": "piece",
      "price": 150,
      "icon": "💋",
      "image": "assets/catalog-images/lip-balm-stick-131b2b.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1638404431939-3943201c8a86?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Alexandra Tran",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/three-lip-bales-sitting-on-top-of-a-marble-counter-XTQzTMd5npk",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Face Serum Bottle 30ml",
      "unit": "piece",
      "price": 900,
      "icon": "💧",
      "image": "assets/catalog-images/face-serum-v2-fb90b9.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1781344116880-029945a42b75?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Avtar Singh",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/amber-glass-dropper-bottle-with-blank-label-on-concrete-block-MkuwnDkT1s0",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Anti-Acne Gel Tube 20g",
      "unit": "piece",
      "price": 420,
      "icon": "🧴"
     }
    ],
    "image": "assets/catalog-images/skin-care-fe37e3.webp",
    "imageUrl": "https://images.unsplash.com/photo-1743620660597-bb66a0316734?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "Brian Kungu",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/aloe-vera-gel-jar-sits-on-a-black-table-NbfHdQVM8Z0",
     "source": "Unsplash"
    }
   },
   {
    "name": "Hair Care",
    "items": [
     {
      "name": "Shampoo Bottle 340ml",
      "unit": "piece",
      "price": 550,
      "icon": "🧴",
      "image": "assets/catalog-images/shampoo-bottle-v2-5eadfd.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Taylor Beach",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/three-bottles-of-lotion-sitting-on-a-table-next-to-a-potted-plant-kwu9Ny5dKOE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Conditioner Bottle 200ml",
      "unit": "piece",
      "price": 500,
      "icon": "🧴",
      "image": "assets/catalog-images/conditioner-bottle-059394.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Taylor Beach",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/three-bottles-of-lotion-sitting-on-a-table-next-to-a-potted-plant-kwu9Ny5dKOE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Hair Oil Bottle 200ml",
      "unit": "piece",
      "price": 380,
      "icon": "🧴",
      "image": "assets/catalog-images/hair-oil-bottle-product-v2-f76ba6.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Taylor Beach",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/three-bottles-of-lotion-sitting-on-a-table-next-to-a-potted-plant-kwu9Ny5dKOE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Hair Dye Box",
      "unit": "box",
      "price": 450,
      "icon": "🎨",
      "image": "assets/catalog-images/hair-dye-2ddaf8.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Taylor Beach",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/three-bottles-of-lotion-sitting-on-a-table-next-to-a-potted-plant-kwu9Ny5dKOE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Hair Color Cream Box",
      "unit": "box",
      "price": 520,
      "icon": "🎨",
      "image": "assets/catalog-images/hair-color-cream-09a163.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Taylor Beach",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/three-bottles-of-lotion-sitting-on-a-table-next-to-a-potted-plant-kwu9Ny5dKOE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Hair Serum Bottle 50ml",
      "unit": "piece",
      "price": 650,
      "icon": "💧",
      "image": "assets/catalog-images/hair-care-1abfa4.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Taylor Beach",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/three-bottles-of-lotion-sitting-on-a-table-next-to-a-potted-plant-kwu9Ny5dKOE",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Hair Mask Jar 200ml",
      "unit": "piece",
      "price": 550,
      "icon": "🫙",
      "image": "assets/catalog-images/hair-mask-jar-5a201a.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Taylor Beach",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/three-bottles-of-lotion-sitting-on-a-table-next-to-a-potted-plant-kwu9Ny5dKOE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Hair Gel Tube 150ml",
      "unit": "piece",
      "price": 350,
      "icon": "🧴",
      "image": "assets/catalog-images/hair-care-1abfa4.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Taylor Beach",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/three-bottles-of-lotion-sitting-on-a-table-next-to-a-potted-plant-kwu9Ny5dKOE",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Hair Spray Bottle 200ml",
      "unit": "piece",
      "price": 480,
      "icon": "🧴",
      "image": "assets/catalog-images/hair-spray-bottle-94affb.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Taylor Beach",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/three-bottles-of-lotion-sitting-on-a-table-next-to-a-potted-plant-kwu9Ny5dKOE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Anti-Dandruff Shampoo 180ml",
      "unit": "piece",
      "price": 600,
      "icon": "🧴",
      "image": "assets/catalog-images/anti-dandruff-shampoo-61b7c9.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Taylor Beach",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/three-bottles-of-lotion-sitting-on-a-table-next-to-a-potted-plant-kwu9Ny5dKOE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Dry Shampoo Spray 150ml",
      "unit": "piece",
      "price": 550,
      "icon": "🧴",
      "image": "assets/catalog-images/hair-care-1abfa4.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Taylor Beach",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/three-bottles-of-lotion-sitting-on-a-table-next-to-a-potted-plant-kwu9Ny5dKOE",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Hair Straightening Cream Jar",
      "unit": "piece",
      "price": 800,
      "icon": "🫙",
      "image": "assets/catalog-images/hair-care-1abfa4.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Taylor Beach",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/three-bottles-of-lotion-sitting-on-a-table-next-to-a-potted-plant-kwu9Ny5dKOE",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Curl Defining Cream Tube",
      "unit": "piece",
      "price": 600,
      "icon": "🧴",
      "image": "assets/catalog-images/hair-care-1abfa4.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Taylor Beach",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/three-bottles-of-lotion-sitting-on-a-table-next-to-a-potted-plant-kwu9Ny5dKOE",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Hair Clips Set of 6",
      "unit": "packet",
      "price": 150,
      "icon": "📎",
      "image": "assets/catalog-images/hair-clips-6-e16305.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Taylor Beach",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/three-bottles-of-lotion-sitting-on-a-table-next-to-a-potted-plant-kwu9Ny5dKOE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Wide-Tooth Comb",
      "unit": "piece",
      "price": 120,
      "icon": "🪮",
      "image": "assets/catalog-images/wide-tooth-comb-e2329c.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Taylor Beach",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/three-bottles-of-lotion-sitting-on-a-table-next-to-a-potted-plant-kwu9Ny5dKOE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Hair Brush",
      "unit": "piece",
      "price": 280,
      "icon": "🪮",
      "image": "assets/catalog-images/hair-brush-0c9a34.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Taylor Beach",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/three-bottles-of-lotion-sitting-on-a-table-next-to-a-potted-plant-kwu9Ny5dKOE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     }
    ],
    "image": "assets/catalog-images/hair-care-1abfa4.webp",
    "imageUrl": "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Taylor Beach",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/three-bottles-of-lotion-sitting-on-a-table-next-to-a-potted-plant-kwu9Ny5dKOE",
     "source": "Unsplash"
    }
   },
   {
    "name": "Makeup",
    "items": [
     {
      "name": "Liquid Foundation Bottle",
      "unit": "piece",
      "price": 950,
      "icon": "🧴",
      "image": "assets/catalog-images/liquid-foundation-bottle-370392.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Shamblen Studios",
       "profileUrl": "https://unsplash.com/@shamblenstudios",
       "photoUrl": "https://unsplash.com/photos/pink-and-brown-makeup-brush-set-xwM61TPMlYk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/xwM61TPMlYk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww"
     },
     {
      "name": "Compact Powder",
      "unit": "piece",
      "price": 650,
      "icon": "🪞",
      "image": "assets/catalog-images/compact-powder-v2-cd9a8f.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Shamblen Studios",
       "profileUrl": "https://unsplash.com/@shamblenstudios",
       "photoUrl": "https://unsplash.com/photos/pink-and-brown-makeup-brush-set-xwM61TPMlYk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/xwM61TPMlYk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww"
     },
     {
      "name": "Concealer Stick",
      "unit": "piece",
      "price": 550,
      "icon": "🖊️",
      "image": "assets/catalog-images/concealer-stick-20095e.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Shamblen Studios",
       "profileUrl": "https://unsplash.com/@shamblenstudios",
       "photoUrl": "https://unsplash.com/photos/pink-and-brown-makeup-brush-set-xwM61TPMlYk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/xwM61TPMlYk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww"
     },
     {
      "name": "Blush Palette",
      "unit": "piece",
      "price": 750,
      "icon": "🎨",
      "image": "assets/catalog-images/blush-palette-9fa1cf.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Shamblen Studios",
       "profileUrl": "https://unsplash.com/@shamblenstudios",
       "photoUrl": "https://unsplash.com/photos/pink-and-brown-makeup-brush-set-xwM61TPMlYk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/xwM61TPMlYk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww"
     },
     {
      "name": "Eyeshadow Palette 12 Shades",
      "unit": "piece",
      "price": 1200,
      "icon": "🎨",
      "image": "assets/catalog-images/makeup-2ae04b.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Shamblen Studios",
       "profileUrl": "https://unsplash.com/@shamblenstudios",
       "photoUrl": "https://unsplash.com/photos/pink-and-brown-makeup-brush-set-xwM61TPMlYk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/xwM61TPMlYk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww",
      "imageSource": "unsplash"
     },
     {
      "name": "Mascara",
      "unit": "piece",
      "price": 550,
      "icon": "👁️",
      "image": "assets/catalog-images/mascara-b0cbc9.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Shamblen Studios",
       "profileUrl": "https://unsplash.com/@shamblenstudios",
       "photoUrl": "https://unsplash.com/photos/pink-and-brown-makeup-brush-set-xwM61TPMlYk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/xwM61TPMlYk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww"
     },
     {
      "name": "Eyeliner Pencil",
      "unit": "piece",
      "price": 350,
      "icon": "✏️",
      "image": "assets/catalog-images/eyeliner-pencil-2841d9.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Shamblen Studios",
       "profileUrl": "https://unsplash.com/@shamblenstudios",
       "photoUrl": "https://unsplash.com/photos/pink-and-brown-makeup-brush-set-xwM61TPMlYk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/xwM61TPMlYk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww"
     },
     {
      "name": "Kajal Stick",
      "unit": "piece",
      "price": 200,
      "icon": "✏️",
      "nameUrdu": "کاجل",
      "image": "assets/catalog-images/makeup-2ae04b.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Shamblen Studios",
       "profileUrl": "https://unsplash.com/@shamblenstudios",
       "photoUrl": "https://unsplash.com/photos/pink-and-brown-makeup-brush-set-xwM61TPMlYk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/xwM61TPMlYk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww",
      "imageSource": "unsplash"
     },
     {
      "name": "Lipstick",
      "unit": "piece",
      "price": 450,
      "icon": "💄",
      "image": "assets/catalog-images/lipstick-1e86fc.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Shamblen Studios",
       "profileUrl": "https://unsplash.com/@shamblenstudios",
       "photoUrl": "https://unsplash.com/photos/pink-and-brown-makeup-brush-set-xwM61TPMlYk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/xwM61TPMlYk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww"
     },
     {
      "name": "Lip Gloss Tube",
      "unit": "piece",
      "price": 380,
      "icon": "💋",
      "image": "assets/catalog-images/makeup-2ae04b.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Shamblen Studios",
       "profileUrl": "https://unsplash.com/@shamblenstudios",
       "photoUrl": "https://unsplash.com/photos/pink-and-brown-makeup-brush-set-xwM61TPMlYk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/xwM61TPMlYk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww",
      "imageSource": "unsplash"
     },
     {
      "name": "Lip Liner Set of 3",
      "unit": "packet",
      "price": 300,
      "icon": "✏️",
      "image": "assets/catalog-images/lip-liner-3-2ac755.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Shamblen Studios",
       "profileUrl": "https://unsplash.com/@shamblenstudios",
       "photoUrl": "https://unsplash.com/photos/pink-and-brown-makeup-brush-set-xwM61TPMlYk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/xwM61TPMlYk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww"
     },
     {
      "name": "Makeup Brushes Set of 12",
      "unit": "box",
      "price": 850,
      "icon": "🖌️",
      "image": "assets/catalog-images/makeup-brushes-12-f6f914.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Shamblen Studios",
       "profileUrl": "https://unsplash.com/@shamblenstudios",
       "photoUrl": "https://unsplash.com/photos/pink-and-brown-makeup-brush-set-xwM61TPMlYk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/xwM61TPMlYk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww"
     },
     {
      "name": "Beauty Blender Sponge",
      "unit": "piece",
      "price": 250,
      "icon": "🧽",
      "image": "assets/catalog-images/makeup-2ae04b.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Shamblen Studios",
       "profileUrl": "https://unsplash.com/@shamblenstudios",
       "photoUrl": "https://unsplash.com/photos/pink-and-brown-makeup-brush-set-xwM61TPMlYk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/xwM61TPMlYk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww",
      "imageSource": "unsplash"
     },
     {
      "name": "Makeup Remover Wipes Pack of 25",
      "unit": "packet",
      "price": 400,
      "icon": "🧻",
      "image": "assets/catalog-images/makeup-2ae04b.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Shamblen Studios",
       "profileUrl": "https://unsplash.com/@shamblenstudios",
       "photoUrl": "https://unsplash.com/photos/pink-and-brown-makeup-brush-set-xwM61TPMlYk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/xwM61TPMlYk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww",
      "imageSource": "unsplash"
     },
     {
      "name": "Face Primer Tube",
      "unit": "piece",
      "price": 700,
      "icon": "🧴",
      "image": "assets/catalog-images/face-primer-tube-41fa17.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Shamblen Studios",
       "profileUrl": "https://unsplash.com/@shamblenstudios",
       "photoUrl": "https://unsplash.com/photos/pink-and-brown-makeup-brush-set-xwM61TPMlYk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/xwM61TPMlYk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww"
     },
     {
      "name": "Setting Spray Bottle",
      "unit": "piece",
      "price": 800,
      "icon": "🧴",
      "image": "assets/catalog-images/setting-spray-bottle-4f9378.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Shamblen Studios",
       "profileUrl": "https://unsplash.com/@shamblenstudios",
       "photoUrl": "https://unsplash.com/photos/pink-and-brown-makeup-brush-set-xwM61TPMlYk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/xwM61TPMlYk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww"
     },
     {
      "name": "Highlighter Palette",
      "unit": "piece",
      "price": 600,
      "icon": "✨",
      "image": "assets/catalog-images/highlighter-palette-fea08e.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Shamblen Studios",
       "profileUrl": "https://unsplash.com/@shamblenstudios",
       "photoUrl": "https://unsplash.com/photos/pink-and-brown-makeup-brush-set-xwM61TPMlYk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/xwM61TPMlYk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww"
     },
     {
      "name": "Nail Polish Bottle",
      "unit": "piece",
      "price": 280,
      "icon": "💅",
      "image": "assets/catalog-images/nail-polish-bottle-59fd99.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Shamblen Studios",
       "profileUrl": "https://unsplash.com/@shamblenstudios",
       "photoUrl": "https://unsplash.com/photos/pink-and-brown-makeup-brush-set-xwM61TPMlYk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/xwM61TPMlYk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww"
     }
    ],
    "image": "assets/catalog-images/makeup-2ae04b.webp",
    "imageUrl": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8TWFrZXVwfGVufDF8fHx8MTc5MjI1NjI1M3ww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Shamblen Studios",
     "profileUrl": "https://unsplash.com/@shamblenstudios",
     "photoUrl": "https://unsplash.com/photos/pink-and-brown-makeup-brush-set-xwM61TPMlYk",
     "source": "Unsplash"
    }
   },
   {
    "name": "Mehndi & Traditional",
    "items": [
     {
      "name": "Mehndi Cone",
      "unit": "piece",
      "price": 60,
      "icon": "🤲",
      "nameUrdu": "مہندی",
      "image": "assets/catalog-images/mehndi-cone-2146f3.webp",
      "imageLevel": "item"
     },
     {
      "name": "Red Mehndi Powder Packet 100g",
      "unit": "packet",
      "price": 120,
      "icon": "🤲",
      "nameUrdu": "مہندی"
     },
     {
      "name": "Black Mehndi Packet",
      "unit": "packet",
      "price": 150,
      "icon": "🤲"
     },
     {
      "name": "Mehndi Oil Bottle 60ml",
      "unit": "piece",
      "price": 200,
      "icon": "🧴",
      "imageUrl": "https://images.unsplash.com/photo-1671493235081-5842463637cd?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Denise Chan",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bottle-of-essential-oil-sitting-on-a-cloth-JpnqiMBf7zQ",
       "source": "Unsplash"
      }
     },
     {
      "name": "Mehndi Stencil Stickers Pack",
      "unit": "packet",
      "price": 180,
      "icon": "✨"
     },
     {
      "name": "Hair Henna Powder Packet 200g",
      "unit": "packet",
      "price": 200,
      "icon": "🌿",
      "imageUrl": "https://images.unsplash.com/photo-1781377012601-93162be3a433?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Marijan K.",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/green-powder-in-a-wooden-bowl-UWkmbnk0G6A",
       "source": "Unsplash"
      }
     },
     {
      "name": "Sindoor Box",
      "unit": "piece",
      "price": 120,
      "icon": "💄",
      "image": "assets/catalog-images/sindoor-6ca146.webp",
      "imageLevel": "item"
     },
     {
      "name": "Bindi Packet of 20",
      "unit": "packet",
      "price": 80,
      "icon": "🔴",
      "nameUrdu": "بندی"
     },
     {
      "name": "Alta Bottle 15ml",
      "unit": "piece",
      "price": 150,
      "icon": "💅",
      "nameUrdu": "آلتا"
     },
     {
      "name": "Surma Stick",
      "unit": "piece",
      "price": 180,
      "icon": "👁️",
      "nameUrdu": "سرمہ",
      "imageUrl": "https://images.unsplash.com/photo-1668255446079-b15fd061735d?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Ben Iwara",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-close-up-of-a-hat-0i6igxIF2g8",
       "source": "Unsplash"
      }
     },
     {
      "name": "Kohl Pencil",
      "unit": "piece",
      "price": 100,
      "icon": "✏️",
      "image": "assets/catalog-images/kohl-pencil-83b7a0.webp",
      "imageLevel": "item"
     },
     {
      "name": "Mehndi Design Book",
      "unit": "piece",
      "price": 300,
      "icon": "📖"
     }
    ],
    "image": "assets/catalog-images/mehndi-traditional-a77da0.webp",
    "imageUrl": "https://images.unsplash.com/photo-1671493235081-5842463637cd?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "Denise Chan",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/a-bottle-of-essential-oil-sitting-on-a-cloth-JpnqiMBf7zQ",
     "source": "Unsplash"
    }
   },
   {
    "name": "Fragrances & Salon",
    "items": [
     {
      "name": "Eau de Toilette Bottle 100ml",
      "unit": "piece",
      "price": 1500,
      "icon": "🌸",
      "image": "assets/catalog-images/eau-de-toilette-bottle-622c96.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jeroen den Otter",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/bleu-de-chanel-perfume-bottle-2b0JeJTEclQ",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Perfume Spray 50ml",
      "unit": "piece",
      "price": 1200,
      "icon": "🌸",
      "image": "assets/catalog-images/perfume-spray-046045.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jeroen den Otter",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/bleu-de-chanel-perfume-bottle-2b0JeJTEclQ",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Attar Bottle 12ml",
      "unit": "piece",
      "price": 800,
      "icon": "🧴",
      "nameUrdu": "عطر",
      "image": "assets/catalog-images/attar-bottle-d31855.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jeroen den Otter",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/bleu-de-chanel-perfume-bottle-2b0JeJTEclQ",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Deodorant Spray 150ml",
      "unit": "piece",
      "price": 550,
      "icon": "🧴",
      "image": "assets/catalog-images/deodorant-spray-2345dc.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jeroen den Otter",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/bleu-de-chanel-perfume-bottle-2b0JeJTEclQ",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Roll-On Deodorant 50ml",
      "unit": "piece",
      "price": 350,
      "icon": "🧴",
      "image": "assets/catalog-images/roll-on-deodorant-8b2dc1.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jeroen den Otter",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/bleu-de-chanel-perfume-bottle-2b0JeJTEclQ",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Body Spray 120ml",
      "unit": "piece",
      "price": 480,
      "icon": "🧴",
      "image": "assets/catalog-images/body-spray-v2-e193ea.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jeroen den Otter",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/bleu-de-chanel-perfume-bottle-2b0JeJTEclQ",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Talcum Powder Tin 200g",
      "unit": "piece",
      "price": 300,
      "icon": "🫙",
      "image": "assets/catalog-images/fragrances-salon-ef6100.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jeroen den Otter",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/bleu-de-chanel-perfume-bottle-2b0JeJTEclQ",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Hair Cutting Scissors",
      "unit": "piece",
      "price": 650,
      "icon": "✂️",
      "image": "assets/catalog-images/hair-cutting-scissors-db81d5.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jeroen den Otter",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/bleu-de-chanel-perfume-bottle-2b0JeJTEclQ",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Hair Clipper Machine",
      "unit": "piece",
      "price": 2800,
      "icon": "💈",
      "image": "assets/catalog-images/hair-clipper-machine-894526.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jeroen den Otter",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/bleu-de-chanel-perfume-bottle-2b0JeJTEclQ",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Hair Dryer 2000W",
      "unit": "piece",
      "price": 2500,
      "icon": "💨",
      "image": "assets/catalog-images/hair-dryer-dfc6dc.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jeroen den Otter",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/bleu-de-chanel-perfume-bottle-2b0JeJTEclQ",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Nail Cutter Set of 3",
      "unit": "packet",
      "price": 350,
      "icon": "✂️",
      "image": "assets/catalog-images/nail-cutter-3-3a90e1.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jeroen den Otter",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/bleu-de-chanel-perfume-bottle-2b0JeJTEclQ",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Manicure Set",
      "unit": "box",
      "price": 700,
      "icon": "💅",
      "image": "assets/catalog-images/manicure-33cd0d.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jeroen den Otter",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/bleu-de-chanel-perfume-bottle-2b0JeJTEclQ",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Pedicure Kit",
      "unit": "box",
      "price": 900,
      "icon": "🦶",
      "image": "assets/catalog-images/pedicure-kit-e2dc7d.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jeroen den Otter",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/bleu-de-chanel-perfume-bottle-2b0JeJTEclQ",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Facial Kit Box of 6 Steps",
      "unit": "box",
      "price": 1400,
      "icon": "🧖",
      "image": "assets/catalog-images/fragrances-salon-ef6100.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jeroen den Otter",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/bleu-de-chanel-perfume-bottle-2b0JeJTEclQ",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Wax Strips Pack of 20",
      "unit": "packet",
      "price": 450,
      "icon": "🩹",
      "image": "assets/catalog-images/wax-strips-20-216089.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jeroen den Otter",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/bleu-de-chanel-perfume-bottle-2b0JeJTEclQ",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Threading Thread Spool",
      "unit": "piece",
      "price": 120,
      "icon": "🧵",
      "image": "assets/catalog-images/threading-thread-spool-510140.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jeroen den Otter",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/bleu-de-chanel-perfume-bottle-2b0JeJTEclQ",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     }
    ],
    "image": "assets/catalog-images/fragrances-salon-ef6100.webp",
    "imageUrl": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Jeroen den Otter",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/bleu-de-chanel-perfume-bottle-2b0JeJTEclQ",
     "source": "Unsplash"
    }
   }
  ]
 },
 {
  "shopType": "Crockery, Kitchenware & Plastics",
  "icon": "🍽️",
  "categories": [
   {
    "name": "Steel Kitchenware",
    "items": [
     {
      "name": "Steel Dinner Plate",
      "unit": "piece",
      "price": 250,
      "icon": "🍽️",
      "image": "assets/catalog-images/steel-dinner-plate-c0a7e7.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1604414499020-f9ac575bc5ec?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Justus Menke",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/stainless-steel-cooking-pots-on-stainless-steel-tray-RSpq9P2vttE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Steel Bowl",
      "unit": "piece",
      "price": 180,
      "icon": "🥣",
      "image": "assets/catalog-images/steel-bowl-c08300.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1604414499020-f9ac575bc5ec?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Justus Menke",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/stainless-steel-cooking-pots-on-stainless-steel-tray-RSpq9P2vttE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Steel Glass",
      "unit": "piece",
      "price": 150,
      "icon": "🥛",
      "image": "assets/catalog-images/steel-glass-53849a.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1604414499020-f9ac575bc5ec?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Justus Menke",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/stainless-steel-cooking-pots-on-stainless-steel-tray-RSpq9P2vttE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Steel Water Jug 2 Litre",
      "unit": "piece",
      "price": 550,
      "icon": "🫖",
      "image": "assets/catalog-images/steel-water-jug-v2-49ea61.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1604414499020-f9ac575bc5ec?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Justus Menke",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/stainless-steel-cooking-pots-on-stainless-steel-tray-RSpq9P2vttE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Steel Cooking Pot 5 Litre",
      "unit": "piece",
      "price": 1200,
      "icon": "🍲",
      "image": "assets/catalog-images/steel-cooking-pot-a0a7f4.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1604414499020-f9ac575bc5ec?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Justus Menke",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/stainless-steel-cooking-pots-on-stainless-steel-tray-RSpq9P2vttE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Steel Kadai",
      "unit": "piece",
      "price": 900,
      "icon": "🍳",
      "image": "assets/catalog-images/steel-kadai-a47ec1.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1604414499020-f9ac575bc5ec?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Justus Menke",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/stainless-steel-cooking-pots-on-stainless-steel-tray-RSpq9P2vttE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Steel Spoon Set of 6",
      "unit": "box",
      "price": 350,
      "icon": "🥄",
      "image": "assets/catalog-images/steel-spoon-6-9eb4fb.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1604414499020-f9ac575bc5ec?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Justus Menke",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/stainless-steel-cooking-pots-on-stainless-steel-tray-RSpq9P2vttE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Steel Serving Tray",
      "unit": "piece",
      "price": 400,
      "icon": "🍽️",
      "image": "assets/catalog-images/steel-serving-tray-d70a03.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1604414499020-f9ac575bc5ec?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Justus Menke",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/stainless-steel-cooking-pots-on-stainless-steel-tray-RSpq9P2vttE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Steel Lunch Box 3 Tier",
      "unit": "piece",
      "price": 550,
      "icon": "🍱",
      "image": "assets/catalog-images/steel-kitchenware-d95b65.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1604414499020-f9ac575bc5ec?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Justus Menke",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/stainless-steel-cooking-pots-on-stainless-steel-tray-RSpq9P2vttE",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Steel Tea Pot",
      "unit": "piece",
      "price": 700,
      "icon": "🫖",
      "image": "assets/catalog-images/steel-tea-pot-f978a1.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1604414499020-f9ac575bc5ec?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Justus Menke",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/stainless-steel-cooking-pots-on-stainless-steel-tray-RSpq9P2vttE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Steel Dinner Set 32 Pieces",
      "unit": "box",
      "price": 6500,
      "icon": "🍽️",
      "image": "assets/catalog-images/steel-dinner-e45483.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1604414499020-f9ac575bc5ec?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Justus Menke",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/stainless-steel-cooking-pots-on-stainless-steel-tray-RSpq9P2vttE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Steel Storage Containers Set of 3",
      "unit": "packet",
      "price": 800,
      "icon": "🫙",
      "image": "assets/catalog-images/steel-storage-containers-3-1c93c7.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1604414499020-f9ac575bc5ec?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Justus Menke",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/stainless-steel-cooking-pots-on-stainless-steel-tray-RSpq9P2vttE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Steel Water Bottle 1 Litre",
      "unit": "piece",
      "price": 450,
      "icon": "🍶",
      "image": "assets/catalog-images/steel-water-bottle-8110d0.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1604414499020-f9ac575bc5ec?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Justus Menke",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/stainless-steel-cooking-pots-on-stainless-steel-tray-RSpq9P2vttE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Steel Milk Pot 2 Litre",
      "unit": "piece",
      "price": 650,
      "icon": "🥛",
      "image": "assets/catalog-images/steel-milk-pot-c2255f.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1604414499020-f9ac575bc5ec?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c3RhaW5sZXNzJTIwc3RlZWwlMjBjb29raW5nJTIwcG90fGVufDF8fHx8MTc5MjI1NTUwNHww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Justus Menke",
       "profileUrl": "https://unsplash.com/@justusmenke",
       "photoUrl": "https://unsplash.com/photos/stainless-steel-cooking-pots-on-stainless-steel-tray-RSpq9P2vttE",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/RSpq9P2vttE/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c3RhaW5sZXNzJTIwc3RlZWwlMjBjb29raW5nJTIwcG90fGVufDF8fHx8MTc5MjI1NTUwNHww",
      "imageSource": "unsplash"
     }
    ],
    "image": "assets/catalog-images/steel-kitchenware-d95b65.webp",
    "imageUrl": "https://images.unsplash.com/photo-1604414499020-f9ac575bc5ec?w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Justus Menke",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/stainless-steel-cooking-pots-on-stainless-steel-tray-RSpq9P2vttE",
     "source": "Unsplash"
    }
   },
   {
    "name": "Plastic Storage & Household",
    "items": [
     {
      "name": "Plastic Storage Container 5 Litre",
      "unit": "piece",
      "price": 300,
      "icon": "🫙",
      "image": "assets/catalog-images/plastic-storage-container-b08f3c.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1576729388723-8699e1a2bb23?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Syed Hussaini",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/orange-blue-and-green-plastic-containers-F2JwUVuRz2I",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Food Storage Box Set of 5",
      "unit": "packet",
      "price": 700,
      "icon": "📦",
      "image": "assets/catalog-images/food-storage-5-4a72e5.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1576729388723-8699e1a2bb23?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Syed Hussaini",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/orange-blue-and-green-plastic-containers-F2JwUVuRz2I",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Plastic Water Jug",
      "unit": "piece",
      "price": 350,
      "icon": "🫖",
      "image": "assets/catalog-images/plastic-water-jug-775c1c.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1576729388723-8699e1a2bb23?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Syed Hussaini",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/orange-blue-and-green-plastic-containers-F2JwUVuRz2I",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Plastic Bucket 20 Litre",
      "unit": "piece",
      "price": 550,
      "icon": "🪣",
      "image": "assets/catalog-images/plastic-bucket-e0661e.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1576729388723-8699e1a2bb23?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Syed Hussaini",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/orange-blue-and-green-plastic-containers-F2JwUVuRz2I",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Plastic Mug",
      "unit": "piece",
      "price": 120,
      "icon": "🥛",
      "image": "assets/catalog-images/plastic-mug-4c2898.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1576729388723-8699e1a2bb23?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Syed Hussaini",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/orange-blue-and-green-plastic-containers-F2JwUVuRz2I",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Plastic Laundry Basket",
      "unit": "piece",
      "price": 550,
      "icon": "🧺",
      "image": "assets/catalog-images/plastic-laundry-basket-b76447.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1576729388723-8699e1a2bb23?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Syed Hussaini",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/orange-blue-and-green-plastic-containers-F2JwUVuRz2I",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Plastic Serving Tray",
      "unit": "piece",
      "price": 200,
      "icon": "🍽️",
      "image": "assets/catalog-images/plastic-serving-tray-c733f0.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1576729388723-8699e1a2bb23?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Syed Hussaini",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/orange-blue-and-green-plastic-containers-F2JwUVuRz2I",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Plastic Dustbin with Lid",
      "unit": "piece",
      "price": 650,
      "icon": "🗑️",
      "image": "assets/catalog-images/plastic-dustbin-lid-fbcd51.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1576729388723-8699e1a2bb23?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Syed Hussaini",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/orange-blue-and-green-plastic-containers-F2JwUVuRz2I",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Plastic Stool",
      "unit": "piece",
      "price": 450,
      "icon": "🪑",
      "image": "assets/catalog-images/plastic-stool-2fe222.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1576729388723-8699e1a2bb23?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Syed Hussaini",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/orange-blue-and-green-plastic-containers-F2JwUVuRz2I",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Plastic Chair",
      "unit": "piece",
      "price": 950,
      "icon": "🪑",
      "image": "assets/catalog-images/plastic-chair-c929f5.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1576729388723-8699e1a2bb23?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Syed Hussaini",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/orange-blue-and-green-plastic-containers-F2JwUVuRz2I",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Plastic Folding Table",
      "unit": "piece",
      "price": 1800,
      "icon": "🪑",
      "image": "assets/catalog-images/plastic-folding-table-61d3b2.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1576729388723-8699e1a2bb23?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Syed Hussaini",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/orange-blue-and-green-plastic-containers-F2JwUVuRz2I",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Plastic Water Cooler 14 Litre",
      "unit": "piece",
      "price": 2800,
      "icon": "🧊",
      "image": "assets/catalog-images/plastic-water-cooler-v2-e4235b.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1576729388723-8699e1a2bb23?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Syed Hussaini",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/orange-blue-and-green-plastic-containers-F2JwUVuRz2I",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Plastic Plate Set of 6",
      "unit": "packet",
      "price": 500,
      "icon": "🍽️",
      "image": "assets/catalog-images/plastic-plate-6-cf5099.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1576729388723-8699e1a2bb23?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Syed Hussaini",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/orange-blue-and-green-plastic-containers-F2JwUVuRz2I",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Plastic Clothes Hangers Pack of 12",
      "unit": "packet",
      "price": 300,
      "icon": "👕",
      "image": "assets/catalog-images/plastic-clothes-hangers-12-2ce507.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1576729388723-8699e1a2bb23?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Syed Hussaini",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/orange-blue-and-green-plastic-containers-F2JwUVuRz2I",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     }
    ],
    "image": "assets/catalog-images/plastic-storage-household-1103ef.webp",
    "imageUrl": "https://images.unsplash.com/photo-1576729388723-8699e1a2bb23?w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Syed Hussaini",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/orange-blue-and-green-plastic-containers-F2JwUVuRz2I",
     "source": "Unsplash"
    }
   },
   {
    "name": "Melamine & Dinnerware",
    "items": [
     {
      "name": "Melamine Dinner Set 36 Pieces",
      "unit": "box",
      "price": 4500,
      "icon": "🍽️",
      "image": "assets/catalog-images/melamine-dinner-v2-508de1.webp",
      "imageLevel": "item"
     },
     {
      "name": "Melamine Dinner Plate",
      "unit": "piece",
      "price": 180,
      "icon": "🍽️",
      "image": "assets/catalog-images/melamine-dinner-plate-v2-d36cdc.webp",
      "imageLevel": "item"
     },
     {
      "name": "Melamine Bowl",
      "unit": "piece",
      "price": 150,
      "icon": "🥣"
     },
     {
      "name": "Melamine Cup Set of 6",
      "unit": "packet",
      "price": 600,
      "icon": "☕",
      "image": "assets/catalog-images/melamine-cup-v2-8f4270.webp",
      "imageLevel": "item"
     },
     {
      "name": "Melamine Serving Tray",
      "unit": "piece",
      "price": 300,
      "icon": "🍽️"
     },
     {
      "name": "Melamine Soup Set",
      "unit": "box",
      "price": 1200,
      "icon": "🍲",
      "image": "assets/catalog-images/melamine-soup-v2-beda10.webp",
      "imageLevel": "item"
     },
     {
      "name": "Bone China Cup Set of 6",
      "unit": "packet",
      "price": 1800,
      "icon": "☕",
      "image": "assets/catalog-images/bone-china-cup-6-9fd5ec.webp",
      "imageLevel": "item"
     },
     {
      "name": "Ceramic Mug",
      "unit": "piece",
      "price": 250,
      "icon": "☕",
      "image": "assets/catalog-images/ceramic-mug-49c49e.webp",
      "imageLevel": "item"
     },
     {
      "name": "Ceramic Bowl Set of 4",
      "unit": "packet",
      "price": 700,
      "icon": "🥣",
      "image": "assets/catalog-images/ceramic-bowl-4-0f41dc.webp",
      "imageLevel": "item"
     },
     {
      "name": "Ceramic Serving Dish Set",
      "unit": "box",
      "price": 1500,
      "icon": "🍽️",
      "image": "assets/catalog-images/ceramic-serving-dish-a33605.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/melamine-dinnerware-86979c.webp"
   },
   {
    "name": "Cooking Tools",
    "items": [
     {
      "name": "Non-Stick Frying Pan",
      "unit": "piece",
      "price": 1100,
      "icon": "🍳",
      "imageUrl": "https://images.unsplash.com/photo-1592156328697-079f6ee0cfa5?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Cooker King",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/black-frying-pan-on-white-surface-Mv3JygH8eXQ",
       "source": "Unsplash"
      }
     },
     {
      "name": "Non-Stick Cooking Pot",
      "unit": "piece",
      "price": 1400,
      "icon": "🍲",
      "image": "assets/catalog-images/non-stick-cooking-pot-983496.webp",
      "imageLevel": "item"
     },
     {
      "name": "Pressure Cooker 5 Litre",
      "unit": "piece",
      "price": 3200,
      "icon": "🍲",
      "image": "assets/catalog-images/pressure-cooker-077757.webp",
      "imageLevel": "item"
     },
     {
      "name": "Steel Tawa",
      "unit": "piece",
      "price": 650,
      "icon": "🫓",
      "imageUrl": "https://images.unsplash.com/photo-1780907084884-ded9fddbb474?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "AJOY DAS",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/fresh-flatbread-cooking-on-a-dark-griddle-Ju0XPJLxPw0",
       "source": "Unsplash"
      }
     },
     {
      "name": "Wooden Spoon Set of 4",
      "unit": "packet",
      "price": 250,
      "icon": "🥄",
      "imageUrl": "https://images.unsplash.com/photo-1580151820172-ae6491498c54?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Louis Hansel",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/brown-wooden-spoon-on-gray-textile-sth3hzzt7Pk",
       "source": "Unsplash"
      }
     },
     {
      "name": "Silicone Spatula Set of 3",
      "unit": "packet",
      "price": 400,
      "icon": "🥄",
      "imageUrl": "https://images.unsplash.com/photo-1547483370-bdd86d60c667?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Jenny Pace",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/pink-blue-and-white-plastic-ladles-in-stainless-container-9nDtvoNPii8",
       "source": "Unsplash"
      }
     },
     {
      "name": "Kitchen Knife Set of 5",
      "unit": "box",
      "price": 800,
      "icon": "🔪",
      "imageUrl": "https://images.unsplash.com/photo-1609467334293-030ac6448fd8?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Danilo Rios",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/black-and-brown-handled-kitchen-knives-z9AormQ0e90",
       "source": "Unsplash"
      }
     },
     {
      "name": "Chopping Board",
      "unit": "piece",
      "price": 350,
      "icon": "🪵",
      "image": "assets/catalog-images/chopping-board-b40228.webp",
      "imageLevel": "item"
     },
     {
      "name": "Vegetable Grater",
      "unit": "piece",
      "price": 200,
      "icon": "🧀",
      "image": "assets/catalog-images/vegetable-grater-v2-02613e.webp",
      "imageLevel": "item"
     },
     {
      "name": "Vegetable Peeler",
      "unit": "piece",
      "price": 120,
      "icon": "🔪",
      "image": "assets/catalog-images/vegetable-peeler-419faf.webp",
      "imageLevel": "item"
     },
     {
      "name": "Rolling Pin with Board",
      "unit": "piece",
      "price": 450,
      "icon": "🫓",
      "image": "assets/catalog-images/rolling-pin-board-526bbc.webp",
      "imageLevel": "item"
     },
     {
      "name": "Masala Dabba (Spice Box)",
      "unit": "piece",
      "price": 700,
      "icon": "🫙",
      "nameUrdu": "مصالحہ ڈبہ",
      "image": "assets/catalog-images/masala-dabba-99e88b.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/cooking-tools-b08c65.webp",
    "imageUrl": "https://images.unsplash.com/photo-1780907084884-ded9fddbb474?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "AJOY DAS",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/fresh-flatbread-cooking-on-a-dark-griddle-Ju0XPJLxPw0",
     "source": "Unsplash"
    }
   },
   {
    "name": "Cleaning & Utility",
    "items": [
     {
      "name": "Floor Mop with Stick",
      "unit": "piece",
      "price": 450,
      "icon": "🧹",
      "imageUrl": "https://images.unsplash.com/photo-1689127903369-aef916b0c40d?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Nellie Adamyan",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-yellow-mop-and-a-yellow-bucket-against-a-pink-wall-qcmH5i-oTVc",
       "source": "Unsplash"
      }
     },
     {
      "name": "Plastic Bucket 15 Litre",
      "unit": "piece",
      "price": 450,
      "icon": "🪣",
      "image": "assets/catalog-images/plastic-bucket-e0661e.webp",
      "imageLevel": "item"
     },
     {
      "name": "Small Bucket 5 Litre",
      "unit": "piece",
      "price": 200,
      "icon": "🪣",
      "image": "assets/catalog-images/bucket-v2-679c8a.webp",
      "imageLevel": "item"
     },
     {
      "name": "Grass Broom",
      "unit": "piece",
      "price": 250,
      "icon": "🧹",
      "image": "assets/catalog-images/grass-broom-93c95a.webp",
      "imageLevel": "item"
     },
     {
      "name": "Dustpan with Brush",
      "unit": "piece",
      "price": 300,
      "icon": "🧹",
      "image": "assets/catalog-images/dustpan-brush-399bda.webp",
      "imageLevel": "item"
     },
     {
      "name": "Scrub Pads Pack of 6",
      "unit": "packet",
      "price": 150,
      "icon": "🧽",
      "imageUrl": "https://images.unsplash.com/photo-1585657878885-5ef68df08c0d?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Artem Makarov",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/brown-bread-on-white-table-tDjF-oujPtQ",
       "source": "Unsplash"
      }
     },
     {
      "name": "Dish Sponges Pack of 4",
      "unit": "packet",
      "price": 100,
      "icon": "🧽",
      "imageUrl": "https://images.unsplash.com/photo-1707857594916-d8ee9d468f25?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Viktor Zhulin",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/three-sponges-stacked-on-top-of-each-other-1vaqMTDtJRA",
       "source": "Unsplash"
      }
     },
     {
      "name": "Toilet Brush",
      "unit": "piece",
      "price": 150,
      "icon": "🧹"
     },
     {
      "name": "Glass Cleaner Spray 500ml",
      "unit": "piece",
      "price": 250,
      "icon": "🧴",
      "imageUrl": "https://images.unsplash.com/photo-1632243575963-3143700087ed?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Lucas van Oort",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-spray-bottle-on-a-table-with-a-blurry-background-MHrmbMQ8DJ8",
       "source": "Unsplash"
      }
     },
     {
      "name": "Washing Line Rope 20m",
      "unit": "piece",
      "price": 180,
      "icon": "🪢",
      "imageUrl": "https://images.unsplash.com/photo-1782908199925-15d46fd1d9d4?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Liosha Shyp",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/clothes-hanging-on-a-clothesline-against-a-bright-blue-sky-BNIdkggOFvQ",
       "source": "Unsplash"
      }
     }
    ],
    "image": "assets/catalog-images/cleaning-utility-a276a6.webp",
    "imageUrl": "https://images.unsplash.com/photo-1782908199925-15d46fd1d9d4?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "Liosha Shyp",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/clothes-hanging-on-a-clothesline-against-a-bright-blue-sky-BNIdkggOFvQ",
     "source": "Unsplash"
    }
   },
   {
    "name": "Glass & Serving",
    "items": [
     {
      "name": "Drinking Glass Set of 6",
      "unit": "packet",
      "price": 600,
      "icon": "🥛",
      "imageUrl": "https://images.unsplash.com/photo-1554140426-5e830b73a5e8?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Janosch Lino",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/three-clear-drinking-glass-on-table-7b1W1mcwekw",
       "source": "Unsplash"
      }
     },
     {
      "name": "Glass Water Jug",
      "unit": "piece",
      "price": 450,
      "icon": "🫖",
      "image": "assets/catalog-images/glass-water-jug-cb5772.webp",
      "imageLevel": "item"
     },
     {
      "name": "Tea Cup Set of 6",
      "unit": "packet",
      "price": 700,
      "icon": "☕",
      "image": "assets/catalog-images/tea-cup-6-62db37.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1738197112505-f79710be93b5?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8dGVhJTIwY3VwJTIwYW5kJTIwc2F1Y2VyJTIwc2V0fGVufDF8fHx8MTc5MjI1NTUxOHww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Townsend Walton",
       "profileUrl": "https://unsplash.com/@twalton",
       "photoUrl": "https://unsplash.com/photos/a-white-coffee-cup-sitting-on-top-of-a-black-table-BYYvJl3tIqY",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/BYYvJl3tIqY/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8dGVhJTIwY3VwJTIwYW5kJTIwc2F1Y2VyJTIwc2V0fGVufDF8fHx8MTc5MjI1NTUxOHww",
      "imageSource": "unsplash"
     },
     {
      "name": "Drinking Glasses Dozen",
      "unit": "dozen",
      "price": 800,
      "icon": "🥛",
      "imageUrl": "https://images.unsplash.com/photo-1554140426-5e830b73a5e8?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Janosch Lino",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/three-clear-drinking-glass-on-table-7b1W1mcwekw",
       "source": "Unsplash"
      }
     },
     {
      "name": "Glass Fruit Bowl",
      "unit": "piece",
      "price": 550,
      "icon": "🍎",
      "image": "assets/catalog-images/glass-fruit-bowl-0b1f83.webp",
      "imageLevel": "item"
     },
     {
      "name": "Cake Stand",
      "unit": "piece",
      "price": 650,
      "icon": "🍰",
      "image": "assets/catalog-images/cake-stand-v2-f7677a.webp",
      "imageLevel": "item"
     },
     {
      "name": "Glass Storage Jar Set of 3",
      "unit": "packet",
      "price": 750,
      "icon": "🫙",
      "imageUrl": "https://images.unsplash.com/photo-1622428051717-dcd8412959de?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Kier in Sight Archives",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/empty-glass-jar-with-black-lid-b29z0iltxk4",
       "source": "Unsplash"
      }
     },
     {
      "name": "Serving Platter",
      "unit": "piece",
      "price": 500,
      "icon": "🍽️",
      "image": "assets/catalog-images/serving-platter-669710.webp",
      "imageLevel": "item"
     },
     {
      "name": "Ice Cube Tray",
      "unit": "piece",
      "price": 120,
      "icon": "🧊",
      "imageUrl": "https://images.unsplash.com/photo-1627808814694-f2a18f68ed60?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "RYNA studio",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/pink-and-white-ice-cubes-cqGNnCRbYs8",
       "source": "Unsplash"
      }
     },
     {
      "name": "Glass Dessert Cups Set of 6",
      "unit": "packet",
      "price": 650,
      "icon": "🍨",
      "imageUrl": "https://images.unsplash.com/photo-1567691334394-c0d00a7716db?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Fumiaki Hayashi",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/red-strawberries-inside-clear-drinking-glass-Mc4zVTBTMjY",
       "source": "Unsplash"
      }
     }
    ],
    "image": "assets/catalog-images/glass-serving-v2-c782a6.webp"
   }
  ]
 },
 {
  "shopType": "Furniture & Home Decor",
  "icon": "🛋️",
  "categories": [
   {
    "name": "Beds & Bedroom",
    "items": [
     {
      "name": "Single Bed",
      "unit": "piece",
      "price": 18000,
      "icon": "🛏️",
      "image": "assets/catalog-images/single-bed-ef9906.webp",
      "imageLevel": "item"
     },
     {
      "name": "Double Bed",
      "unit": "piece",
      "price": 28000,
      "icon": "🛏️",
      "image": "assets/catalog-images/double-bed-3fd0cd.webp",
      "imageLevel": "item"
     },
     {
      "name": "Charpai (Woven Rope Bed)",
      "unit": "piece",
      "price": 4500,
      "icon": "🛏️",
      "nameUrdu": "چارپائی",
      "image": "assets/catalog-images/charpai-209e2d.webp",
      "imageLevel": "item"
     },
     {
      "name": "Single Mattress",
      "unit": "piece",
      "price": 9000,
      "icon": "🛏️",
      "image": "assets/catalog-images/single-mattress-c041ba.webp",
      "imageLevel": "item"
     },
     {
      "name": "Double Mattress",
      "unit": "piece",
      "price": 16000,
      "icon": "🛏️",
      "image": "assets/catalog-images/double-mattress-80c60f.webp",
      "imageLevel": "item"
     },
     {
      "name": "Bed Sheet Set of 3",
      "unit": "packet",
      "price": 1500,
      "icon": "🛏️",
      "image": "assets/catalog-images/bed-sheet-3-v2-f5213b.webp",
      "imageLevel": "item"
     },
     {
      "name": "Pillow Pair",
      "unit": "packet",
      "price": 900,
      "icon": "🛏️",
      "imageUrl": "https://images.unsplash.com/photo-1638127815875-d8c930a8d467?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Ran Berkovich",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-close-up-of-two-pillows-on-a-bed--lBmZL2UfJc",
       "source": "Unsplash"
      }
     },
     {
      "name": "Almari 3-Door",
      "unit": "piece",
      "price": 35000,
      "icon": "🗄️",
      "nameUrdu": "الماری",
      "imageUrl": "https://images.unsplash.com/photo-1558997519-83ea9252edf8?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Rumman Amin",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/brown-wooden-2-door-cabinet-3fFBoEHee28",
       "source": "Unsplash"
      }
     },
     {
      "name": "Dressing Table with Mirror",
      "unit": "piece",
      "price": 14000,
      "icon": "🪞",
      "image": "assets/catalog-images/dressing-table-mirror-50794a.webp",
      "imageLevel": "item"
     },
     {
      "name": "Bedside Table",
      "unit": "piece",
      "price": 3500,
      "icon": "🛏️",
      "image": "assets/catalog-images/bedside-table-45de62.webp",
      "imageLevel": "item"
     },
     {
      "name": "Double Blanket",
      "unit": "piece",
      "price": 2500,
      "icon": "🛌",
      "image": "assets/catalog-images/double-blanket-81e47d.webp",
      "imageLevel": "item"
     },
     {
      "name": "Quilt Set",
      "unit": "packet",
      "price": 3200,
      "icon": "🛌",
      "image": "assets/catalog-images/quilt-aa01b2.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/beds-bedroom-2f88c4.webp",
    "imageUrl": "https://images.unsplash.com/photo-1558997519-83ea9252edf8?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "Rumman Amin",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/brown-wooden-2-door-cabinet-3fFBoEHee28",
     "source": "Unsplash"
    }
   },
   {
    "name": "Seating",
    "items": [
     {
      "name": "Sofa Set 5-Seater",
      "unit": "piece",
      "price": 55000,
      "icon": "🛋️",
      "imageUrl": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Phillip Goldsberry",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/green-fabric-sofa-fZuleEfeA1Q",
       "source": "Unsplash"
      }
     },
     {
      "name": "Sofa Set 7-Seater",
      "unit": "piece",
      "price": 75000,
      "icon": "🛋️",
      "image": "assets/catalog-images/sofa-7-seater-66b3cb.webp",
      "imageLevel": "item"
     },
     {
      "name": "Armchair",
      "unit": "piece",
      "price": 9000,
      "icon": "🪑",
      "image": "assets/catalog-images/armchair-1152f7.webp",
      "imageLevel": "item"
     },
     {
      "name": "Sheesham Wood Chair",
      "unit": "piece",
      "price": 4500,
      "icon": "🪑",
      "image": "assets/catalog-images/sheesham-wood-chair-b2bbdd.webp",
      "imageLevel": "item"
     },
     {
      "name": "Office Chair",
      "unit": "piece",
      "price": 8500,
      "icon": "🪑",
      "image": "assets/catalog-images/office-chair-faf380.webp",
      "imageLevel": "item"
     },
     {
      "name": "Rocking Chair",
      "unit": "piece",
      "price": 7000,
      "icon": "🪑",
      "image": "assets/catalog-images/rocking-chair-a401bc.webp",
      "imageLevel": "item"
     },
     {
      "name": "Wooden Bench",
      "unit": "piece",
      "price": 6000,
      "icon": "🪑",
      "image": "assets/catalog-images/wooden-bench-c76084.webp",
      "imageLevel": "item"
     },
     {
      "name": "Bean Bag",
      "unit": "piece",
      "price": 2200,
      "icon": "🛋️",
      "imageUrl": "https://images.unsplash.com/photo-1701854957177-99ec55ad574e?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Bayo Adegunloye",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bean-bag-chair-in-a-corner-of-a-room-TA2iZZ8o6go",
       "source": "Unsplash"
      }
     },
     {
      "name": "Cushion Set of 5",
      "unit": "packet",
      "price": 1200,
      "icon": "🛋️",
      "imageUrl": "https://images.unsplash.com/photo-1553114552-c4ece3a33c93?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Sven Brandsma",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/three-assorted-color-throw-pillows-on-black-sofa-GWFFvub7Y1U",
       "source": "Unsplash"
      }
     },
     {
      "name": "Sofa Cover Set",
      "unit": "packet",
      "price": 2800,
      "icon": "🛋️",
      "imageUrl": "https://images.unsplash.com/photo-1721618879032-39948d5ebf63?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "SlipcoverKAS",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-woman-standing-in-a-living-room-next-to-a-couch-Q9W7c1c18nU",
       "source": "Unsplash"
      }
     }
    ],
    "image": "assets/catalog-images/seating-b12082.webp"
   },
   {
    "name": "Tables",
    "items": [
     {
      "name": "Dining Table 6-Seater",
      "unit": "piece",
      "price": 25000,
      "icon": "🍽️",
      "image": "assets/catalog-images/dining-table-6-seater-44df10.webp",
      "imageLevel": "item"
     },
     {
      "name": "Coffee Table",
      "unit": "piece",
      "price": 8000,
      "icon": "🪑",
      "imageUrl": "https://images.unsplash.com/photo-1581428982868-e410dd047a90?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Lui Peng",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/brown-wooden-table-beside-white-couch-8NxTrV6i4WQ",
       "source": "Unsplash"
      }
     },
     {
      "name": "Study Table",
      "unit": "piece",
      "price": 7000,
      "icon": "📚",
      "image": "assets/catalog-images/study-table-362de0.webp",
      "imageLevel": "item"
     },
     {
      "name": "Center Table",
      "unit": "piece",
      "price": 6500,
      "icon": "🪑",
      "image": "assets/catalog-images/center-table-cdf954.webp",
      "imageLevel": "item"
     },
     {
      "name": "Console Table",
      "unit": "piece",
      "price": 9000,
      "icon": "🪑",
      "image": "assets/catalog-images/console-table-e4ec9d.webp",
      "imageLevel": "item"
     },
     {
      "name": "Folding Table",
      "unit": "piece",
      "price": 4500,
      "icon": "🪑",
      "imageUrl": "https://images.unsplash.com/photo-1578272768789-5641cd8caaa1?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Mikaela Rae",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-cup-on-white-table-cSUMlSRfmiU",
       "source": "Unsplash"
      }
     },
     {
      "name": "TV Stand",
      "unit": "piece",
      "price": 11000,
      "icon": "📺",
      "imageUrl": "https://images.unsplash.com/photo-1542487354-feaf93476caa?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Andres Jasso",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/gray-flat-screen-tv-on-white-tv-stand-jfxY9uoMRwM",
       "source": "Unsplash"
      }
     },
     {
      "name": "Computer Table",
      "unit": "piece",
      "price": 8500,
      "icon": "💻",
      "imageUrl": "https://images.unsplash.com/photo-1764588029885-d115de3bda1e?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Martin Katler",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/computer-setup-with-monitor-keyboard-and-mouse-dUJWL1s6B8Q",
       "source": "Unsplash"
      }
     },
     {
      "name": "Ironing Board",
      "unit": "piece",
      "price": 2500,
      "icon": "👕",
      "image": "assets/catalog-images/ironing-board-a146af.webp",
      "imageLevel": "item"
     },
     {
      "name": "Nesting Tables Set of 3",
      "unit": "packet",
      "price": 5500,
      "icon": "🪑",
      "image": "assets/catalog-images/nesting-tables-3-v2-29e97a.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/tables-651ae5.webp"
   },
   {
    "name": "Curtains & Flooring",
    "items": [
     {
      "name": "Curtain Pair",
      "unit": "packet",
      "price": 1800,
      "icon": "🪟",
      "imageUrl": "https://images.unsplash.com/photo-1759328257280-28bdb3050be3?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Hiram Huang",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/sunlight-streams-through-sheer-curtains-in-a-hotel-room-NIbUk7ATSuw",
       "source": "Unsplash"
      }
     },
     {
      "name": "Curtain Rod Set",
      "unit": "piece",
      "price": 900,
      "icon": "🪟",
      "image": "assets/catalog-images/curtain-rod-ed769f.webp",
      "imageLevel": "item"
     },
     {
      "name": "Window Blinds",
      "unit": "piece",
      "price": 2500,
      "icon": "🪟",
      "imageUrl": "https://images.unsplash.com/photo-1527030126234-095ace44080f?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Wade Lambert",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/close-view-of-white-window-blinds-LRr2VIwWgC0",
       "source": "Unsplash"
      }
     },
     {
      "name": "Carpet 8x10 ft",
      "unit": "piece",
      "price": 12000,
      "icon": "🧶",
      "imageUrl": "https://images.unsplash.com/photo-1660394585016-508f949df960?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "SAJAD FI",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/red-persian-rug-with-diamond-pattern-DrZQZnEtYTM",
       "source": "Unsplash"
      }
     },
     {
      "name": "Prayer Mat",
      "unit": "piece",
      "price": 800,
      "icon": "🕌",
      "nameUrdu": "جائے نماز",
      "image": "assets/catalog-images/prayer-mat-81bfb0.webp",
      "imageLevel": "item"
     },
     {
      "name": "Door Mat",
      "unit": "piece",
      "price": 350,
      "icon": "🚪",
      "imageUrl": "https://images.unsplash.com/photo-1672403391906-810131b660eb?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "K Adams",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-black-door-mat-sitting-on-the-side-of-a-door-bahNs99wYng",
       "source": "Unsplash"
      }
     },
     {
      "name": "Floor Rug",
      "unit": "piece",
      "price": 3200,
      "icon": "🧶",
      "imageUrl": "https://images.unsplash.com/photo-1660394585016-508f949df960?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "SAJAD FI",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/red-persian-rug-with-diamond-pattern-DrZQZnEtYTM",
       "source": "Unsplash"
      }
     },
     {
      "name": "Table Runner",
      "unit": "piece",
      "price": 600,
      "icon": "🍽️",
      "image": "assets/catalog-images/table-runner-v2-e49c0d.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/curtains-flooring-v2-dcb521.webp"
   },
   {
    "name": "Decor & Lighting",
    "items": [
     {
      "name": "Wall Clock",
      "unit": "piece",
      "price": 1200,
      "icon": "🕐",
      "image": "assets/catalog-images/wall-clock-97ce0f.webp",
      "imageLevel": "item"
     },
     {
      "name": "Table Lamp",
      "unit": "piece",
      "price": 1500,
      "icon": "💡",
      "image": "assets/catalog-images/table-lamp-77296e.webp",
      "imageLevel": "item"
     },
     {
      "name": "Floor Lamp",
      "unit": "piece",
      "price": 3500,
      "icon": "💡",
      "image": "assets/catalog-images/floor-lamp-v2-647cfd.webp",
      "imageLevel": "item"
     },
     {
      "name": "Chandelier",
      "unit": "piece",
      "price": 4500,
      "icon": "💡",
      "image": "assets/catalog-images/chandelier-f94608.webp",
      "imageLevel": "item"
     },
     {
      "name": "Wall Art Frame",
      "unit": "piece",
      "price": 900,
      "icon": "🖼️",
      "image": "assets/catalog-images/wall-art-frame-ac31df.webp",
      "imageLevel": "item"
     },
     {
      "name": "Photo Frame Set of 3",
      "unit": "packet",
      "price": 600,
      "icon": "🖼️",
      "imageUrl": "https://images.unsplash.com/photo-1576266394503-4999348b5447?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Mojtaba Ravanbakhsh",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/photo-frame-lot-XsQGsVS6h-8",
       "source": "Unsplash"
      }
     },
     {
      "name": "Artificial Plant",
      "unit": "piece",
      "price": 800,
      "icon": "🪴",
      "image": "assets/catalog-images/artificial-plant-6a2cf6.webp",
      "imageLevel": "item"
     },
     {
      "name": "Ceramic Vase",
      "unit": "piece",
      "price": 700,
      "icon": "🏺",
      "image": "assets/catalog-images/ceramic-vase-3e3868.webp",
      "imageLevel": "item"
     },
     {
      "name": "Wall Mirror",
      "unit": "piece",
      "price": 1800,
      "icon": "🪞",
      "image": "assets/catalog-images/wall-mirror-261c06.webp",
      "imageLevel": "item"
     },
     {
      "name": "Candle Holder Set of 2",
      "unit": "packet",
      "price": 500,
      "icon": "🕯️",
      "image": "assets/catalog-images/candle-holder-2-v2-a56de3.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/decor-lighting-2c5ebd.webp"
   }
  ]
 },
 {
  "shopType": "Toys & Baby Care",
  "icon": "🧸",
  "categories": [
   {
    "name": "Dolls & Action Figures",
    "items": [
     {
      "name": "Fashion Doll",
      "unit": "piece",
      "price": 850,
      "icon": "🧸",
      "image": "assets/catalog-images/fashion-doll-73f88a.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1546792913-cfec613d2163?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Tapio Haaja",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/assorted-doll-collection-07cKMGEjCnE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Doll Play Set",
      "unit": "box",
      "price": 1200,
      "icon": "🧸",
      "image": "assets/catalog-images/doll-play-2024cb.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1546792913-cfec613d2163?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Tapio Haaja",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/assorted-doll-collection-07cKMGEjCnE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Action Figure",
      "unit": "piece",
      "price": 950,
      "icon": "🦸",
      "image": "assets/catalog-images/action-figure-44fc93.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1546792913-cfec613d2163?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Tapio Haaja",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/assorted-doll-collection-07cKMGEjCnE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Remote Control Car",
      "unit": "piece",
      "price": 1800,
      "icon": "🚗",
      "image": "assets/catalog-images/remote-control-car-728f8f.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1546792913-cfec613d2163?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Tapio Haaja",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/assorted-doll-collection-07cKMGEjCnE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Remote Control Helicopter",
      "unit": "piece",
      "price": 2500,
      "icon": "🚁",
      "image": "assets/catalog-images/remote-control-helicopter-986bd4.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1546792913-cfec613d2163?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Tapio Haaja",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/assorted-doll-collection-07cKMGEjCnE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Toy Dart Gun",
      "unit": "piece",
      "price": 700,
      "icon": "🔫",
      "image": "assets/catalog-images/toy-dart-gun-3adf32.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1546792913-cfec613d2163?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Tapio Haaja",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/assorted-doll-collection-07cKMGEjCnE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Dancing Robot Toy",
      "unit": "piece",
      "price": 1400,
      "icon": "🤖",
      "image": "assets/catalog-images/dancing-robot-toy-6b2231.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1546792913-cfec613d2163?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Tapio Haaja",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/assorted-doll-collection-07cKMGEjCnE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Dinosaur Figures Set of 6",
      "unit": "packet",
      "price": 900,
      "icon": "🦕",
      "image": "assets/catalog-images/dinosaur-figures-6-44f5b1.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1546792913-cfec613d2163?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Tapio Haaja",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/assorted-doll-collection-07cKMGEjCnE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Superhero Figures Set of 4",
      "unit": "packet",
      "price": 1100,
      "icon": "🦸",
      "image": "assets/catalog-images/superhero-figures-4-701b8f.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1546792913-cfec613d2163?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Tapio Haaja",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/assorted-doll-collection-07cKMGEjCnE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Toy Kitchen Set",
      "unit": "box",
      "price": 1600,
      "icon": "🍳",
      "image": "assets/catalog-images/toy-kitchen-abea3c.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1546792913-cfec613d2163?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Tapio Haaja",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/assorted-doll-collection-07cKMGEjCnE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Doctor Play Set",
      "unit": "box",
      "price": 950,
      "icon": "🩺",
      "image": "assets/catalog-images/doctor-play-v2-abc0dc.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1546792913-cfec613d2163?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Tapio Haaja",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/assorted-doll-collection-07cKMGEjCnE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Tool Play Set",
      "unit": "box",
      "price": 850,
      "icon": "🔧",
      "image": "assets/catalog-images/tool-play-cf4ef4.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1546792913-cfec613d2163?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Tapio Haaja",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/assorted-doll-collection-07cKMGEjCnE",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     }
    ],
    "image": "assets/catalog-images/dolls-action-figures-7b389b.webp",
    "imageUrl": "https://images.unsplash.com/photo-1546792913-cfec613d2163?w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Tapio Haaja",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/assorted-doll-collection-07cKMGEjCnE",
     "source": "Unsplash"
    }
   },
   {
    "name": "Building & Learning",
    "items": [
     {
      "name": "Building Blocks Set of 100",
      "unit": "box",
      "price": 1500,
      "icon": "🧱",
      "imageUrl": "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Xavi Cabrera",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/yellow-red-blue-and-green-lego-blocks-kn-UmDZQDjM",
       "source": "Unsplash"
      }
     },
     {
      "name": "Brick Construction Box",
      "unit": "box",
      "price": 2200,
      "icon": "🧱",
      "imageUrl": "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Xavi Cabrera",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/yellow-red-blue-and-green-lego-blocks-kn-UmDZQDjM",
       "source": "Unsplash"
      }
     },
     {
      "name": "Jigsaw Puzzle 500 Pieces",
      "unit": "box",
      "price": 600,
      "icon": "🧩",
      "image": "assets/catalog-images/jigsaw-puzzle-093c69.webp",
      "imageLevel": "item"
     },
     {
      "name": "Alphabet Learning Set",
      "unit": "packet",
      "price": 450,
      "icon": "🔤",
      "image": "assets/catalog-images/alphabet-learning-9d731c.webp",
      "imageLevel": "item"
     },
     {
      "name": "Number Counting Toy",
      "unit": "piece",
      "price": 500,
      "icon": "🔢",
      "imageUrl": "https://images.unsplash.com/photo-1548690596-f1722c190938?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Crissy Jarvis",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/multicolored-abacus-cHhbULJbPwM",
       "source": "Unsplash"
      }
     },
     {
      "name": "Shape Sorter Cube",
      "unit": "piece",
      "price": 650,
      "icon": "🔷",
      "imageUrl": "https://images.unsplash.com/photo-1774464593838-85b320eb7453?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Angie Dutton",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/wooden-shape-sorter-toy-with-colorful-blocks-E1shiIGT8Oo",
       "source": "Unsplash"
      }
     },
     {
      "name": "Magnetic Tiles Set",
      "unit": "box",
      "price": 1800,
      "icon": "🧲",
      "imageUrl": "https://images.unsplash.com/photo-1765403256661-c60b291c38ba?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Sebastian Schuster",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/pile-of-colorful-geometric-building-blocks-0pjlh3xzDRo",
       "source": "Unsplash"
      }
     },
     {
      "name": "Stacking Rings Toy",
      "unit": "piece",
      "price": 400,
      "icon": "🎯",
      "image": "assets/catalog-images/stacking-rings-toy-1eb522.webp",
      "imageLevel": "item"
     },
     {
      "name": "Wooden Abacus",
      "unit": "piece",
      "price": 350,
      "icon": "🔢",
      "image": "assets/catalog-images/wooden-abacus-08c463.webp",
      "imageLevel": "item"
     },
     {
      "name": "Science Experiment Kit",
      "unit": "box",
      "price": 1300,
      "icon": "🔬",
      "image": "assets/catalog-images/science-experiment-kit-208a20.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/building-learning-e42617.webp"
   },
   {
    "name": "Ride-On & Outdoor",
    "items": [
     {
      "name": "Kids Tricycle",
      "unit": "piece",
      "price": 4500,
      "icon": "🚲",
      "imageUrl": "https://images.unsplash.com/photo-1459992900655-b635a8a7a89c?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Rodolfo Mari",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/red-radio-flyer-trike-on-brown-dried-leaves-2sNnC0zDOBQ",
       "source": "Unsplash"
      }
     },
     {
      "name": "Kids Bicycle 16 inch",
      "unit": "piece",
      "price": 12000,
      "icon": "🚲",
      "image": "assets/catalog-images/kids-bicycle-4bef94.webp",
      "imageLevel": "item"
     },
     {
      "name": "Kick Scooter",
      "unit": "piece",
      "price": 3500,
      "icon": "🛴",
      "image": "assets/catalog-images/kick-scooter-4ce32c.webp",
      "imageLevel": "item"
     },
     {
      "name": "Skateboard",
      "unit": "piece",
      "price": 2200,
      "icon": "🛹",
      "image": "assets/catalog-images/skateboard-974a2f.webp",
      "imageLevel": "item"
     },
     {
      "name": "Football Size 5",
      "unit": "piece",
      "price": 900,
      "icon": "⚽",
      "imageUrl": "https://images.unsplash.com/photo-1769356636430-e04718f78ee8?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Noa GENOUD",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-classic-soccer-ball-rests-on-green-grass-dHZAiGK0KYg",
       "source": "Unsplash"
      }
     },
     {
      "name": "Cricket Bat",
      "unit": "piece",
      "price": 1200,
      "icon": "🏏",
      "imageUrl": "https://images.unsplash.com/photo-1758791184255-411236a49346?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Village Cricket Co",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/cricket-bat-leaning-against-a-stone-wall-KGrQ_DNABik",
       "source": "Unsplash"
      }
     },
     {
      "name": "Tennis Balls Set of 3",
      "unit": "packet",
      "price": 300,
      "icon": "🎾",
      "imageUrl": "https://images.unsplash.com/photo-1785703531263-f43b0bb3fcf8?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Mario Gogh",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/numerous-green-tennis-balls-with-visible-seams-UFm5RVwyeH4",
       "source": "Unsplash"
      }
     },
     {
      "name": "Badminton Racket Set",
      "unit": "packet",
      "price": 1500,
      "icon": "🏸",
      "image": "assets/catalog-images/badminton-racket-d875d3.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/ride-on-outdoor-v2-832787.webp",
    "imageUrl": "https://images.unsplash.com/photo-1758791184255-411236a49346?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "Village Cricket Co",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/cricket-bat-leaning-against-a-stone-wall-KGrQ_DNABik",
     "source": "Unsplash"
    }
   },
   {
    "name": "Baby Essentials",
    "items": [
     {
      "name": "Baby Diapers Pack of 24",
      "unit": "packet",
      "price": 750,
      "icon": "👶",
      "image": "assets/catalog-images/baby-diapers-24-5bea9d.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1584839404042-8bc21d240e91?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Nathan Dumlao",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/blue-and-white-plastic-pack-KeiQeZJLmus",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Baby Wipes Pack of 72",
      "unit": "packet",
      "price": 420,
      "icon": "🧻",
      "image": "assets/catalog-images/baby-wipes-72-fc3a2a.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1706524077391-12206f155e94?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Jake Bravo",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-package-of-softacre-baby-wipes-sitting-on-top-of-a-white-stand-pms1zJmqxgQ",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Baby Milk Powder Tin 400g",
      "unit": "piece",
      "price": 1800,
      "icon": "🍼"
     },
     {
      "name": "Baby Feeding Bottle 250ml",
      "unit": "piece",
      "price": 450,
      "icon": "🍼",
      "image": "assets/catalog-images/baby-feeding-bottle-edd165.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1623707430616-d9f956bcac2b?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Jaye Haych",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/clear-plastic-feeding-bottle-on-red-table-vaozLvtSHok",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Baby Lotion 200ml",
      "unit": "piece",
      "price": 350,
      "icon": "🧴",
      "image": "assets/catalog-images/baby-lotion-bc427e.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1750085036915-6e21c6981586?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/johnsons-baby-oil-and-lotion-are-displayed-8XtQp4UVB34",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Baby Shampoo 200ml",
      "unit": "piece",
      "price": 380,
      "icon": "🧴",
      "image": "assets/catalog-images/baby-shampoo-7f1b47.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1750085894110-b2e2f11d5e8b?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Zoshua Colah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/johnsons-baby-shampoo-bottles-are-on-display-YTB_nXkyu6M",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Baby Soap Bar",
      "unit": "piece",
      "price": 180,
      "icon": "🧼",
      "image": "assets/catalog-images/baby-soap-bar-1e341d.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1546552768-9e3a94b38a59?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Heather Ford",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/assorted-bar-soaps-FbrDS0jY_Hw",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Baby Hooded Towel",
      "unit": "piece",
      "price": 550,
      "icon": "🧣",
      "image": "assets/catalog-images/baby-essentials-7b6496.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1763089359160-3c55707c5808?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "wang binghua",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/child-hides-face-under-hooded-towel-on-striped-bed-0ofmwrblJxc",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Baby Blanket",
      "unit": "piece",
      "price": 900,
      "icon": "🛌",
      "image": "assets/catalog-images/baby-blanket-v2-c429e0.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1675273534704-5cd901ca6f94?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Ashlee Marie",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-blue-and-white-crocheted-blanket-with-a-circular-design-DweYOm78-so",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Baby Carrier",
      "unit": "piece",
      "price": 2200,
      "icon": "👶"
     },
     {
      "name": "Teether Set of 3",
      "unit": "packet",
      "price": 350,
      "icon": "🍼"
     },
     {
      "name": "Baby Rattle Set of 4",
      "unit": "packet",
      "price": 400,
      "icon": "🔔",
      "image": "assets/catalog-images/baby-rattle-4-f71bcd.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1725297951080-47e72ef3f788?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Eric Prouzet",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-toys-that-are-in-a-box-5PkMxH1wh24",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     }
    ],
    "image": "assets/catalog-images/baby-essentials-7b6496.webp",
    "imageUrl": "https://images.unsplash.com/photo-1750085036915-6e21c6981586?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "Zoshua Colah",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/johnsons-baby-oil-and-lotion-are-displayed-8XtQp4UVB34",
     "source": "Unsplash"
    }
   },
   {
    "name": "Soft Toys & Games",
    "items": [
     {
      "name": "Large Teddy Bear",
      "unit": "piece",
      "price": 1500,
      "icon": "🧸",
      "image": "assets/catalog-images/teddy-bear-434a2e.webp",
      "imageLevel": "item"
     },
     {
      "name": "Small Teddy Bear",
      "unit": "piece",
      "price": 600,
      "icon": "🧸",
      "image": "assets/catalog-images/teddy-bear-434a2e.webp",
      "imageLevel": "item"
     },
     {
      "name": "Plush Bunny",
      "unit": "piece",
      "price": 700,
      "icon": "🐰",
      "image": "assets/catalog-images/plush-bunny-fcbe45.webp",
      "imageLevel": "item"
     },
     {
      "name": "Ludo Board Game",
      "unit": "piece",
      "price": 450,
      "icon": "🎲",
      "image": "assets/catalog-images/ludo-board-game-8bbb5e.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1642056446796-8c7d1dcb630b?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8bHVkbyUyMGJvYXJkJTIwZ2FtZXxlbnwxfHx8fDE3OTIyNTU1MDN8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "VD Photography",
       "profileUrl": "https://unsplash.com/@vdphotography",
       "photoUrl": "https://unsplash.com/photos/a-close-up-of-a-dice-on-a-board-game-pCvyg4e_Kn4",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/pCvyg4e_Kn4/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8bHVkbyUyMGJvYXJkJTIwZ2FtZXxlbnwxfHx8fDE3OTIyNTU1MDN8MA",
      "imageSource": "unsplash"
     },
     {
      "name": "Chess Set",
      "unit": "box",
      "price": 800,
      "icon": "♟️",
      "image": "assets/catalog-images/chess-0727c2.webp",
      "imageLevel": "item"
     },
     {
      "name": "Carrom Board",
      "unit": "piece",
      "price": 1800,
      "icon": "🎯",
      "image": "assets/catalog-images/carrom-board-ea622e.webp",
      "imageLevel": "item"
     },
     {
      "name": "Playing Cards Deck",
      "unit": "piece",
      "price": 150,
      "icon": "🃏",
      "image": "assets/catalog-images/playing-cards-deck-6f5edd.webp",
      "imageLevel": "item"
     },
     {
      "name": "Water Gun",
      "unit": "piece",
      "price": 500,
      "icon": "🔫",
      "image": "assets/catalog-images/water-gun-v2-39e164.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/soft-toys-games-6317e6.webp"
   }
  ]
 },
 {
  "shopType": "Pet, Poultry Feed & Veterinary",
  "icon": "🐔",
  "categories": [
   {
    "name": "Poultry Feed",
    "items": [
     {
      "name": "Broiler Starter Feed 50kg",
      "unit": "piece",
      "price": 6500,
      "icon": "🌾",
      "image": "assets/catalog-images/poultry-feed-966b4e.webp",
      "imageLevel": "category"
     },
     {
      "name": "Layer Feed 50kg",
      "unit": "piece",
      "price": 6200,
      "icon": "🌾",
      "image": "assets/catalog-images/layer-feed-bfefd1.webp",
      "imageLevel": "item"
     },
     {
      "name": "Chick Starter Crumb 25kg",
      "unit": "piece",
      "price": 3400,
      "icon": "🌾",
      "image": "assets/catalog-images/poultry-feed-966b4e.webp",
      "imageLevel": "category"
     },
     {
      "name": "Maize Feed 50kg",
      "unit": "piece",
      "price": 5800,
      "icon": "🌽",
      "image": "assets/catalog-images/maize-feed-20015d.webp",
      "imageLevel": "item"
     },
     {
      "name": "Wheat Bran 20kg",
      "unit": "piece",
      "price": 1400,
      "icon": "🌾",
      "imageUrl": "https://images.unsplash.com/photo-1561767782-d8e3aa77ef77?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Utsman Media",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-close-up-of-a-pile-of-brown-rice-tyVcPQfncrg",
       "source": "Unsplash"
      }
     },
     {
      "name": "Rice Polish 20kg",
      "unit": "piece",
      "price": 1200,
      "icon": "🍚",
      "image": "assets/catalog-images/rice-polish-fd951c.webp",
      "imageLevel": "item"
     },
     {
      "name": "Fish Meal 5kg",
      "unit": "piece",
      "price": 2200,
      "icon": "🐟"
     },
     {
      "name": "Bone Meal 5kg",
      "unit": "piece",
      "price": 1800,
      "icon": "🦴",
      "image": "assets/catalog-images/bone-meal-fe22dd.webp",
      "imageLevel": "item"
     },
     {
      "name": "Mineral Mixture 1kg",
      "unit": "piece",
      "price": 450,
      "icon": "🧂"
     },
     {
      "name": "Vitamin Premix Packet",
      "unit": "packet",
      "price": 600,
      "icon": "💊",
      "image": "assets/catalog-images/poultry-feed-966b4e.webp",
      "imageLevel": "category"
     },
     {
      "name": "Mustard Cake 20kg",
      "unit": "piece",
      "price": 2400,
      "icon": "🌾"
     },
     {
      "name": "Sunflower Meal 10kg",
      "unit": "piece",
      "price": 900,
      "icon": "🌻"
     }
    ],
    "image": "assets/catalog-images/poultry-feed-966b4e.webp"
   },
   {
    "name": "Pet Food",
    "items": [
     {
      "name": "Dog Dry Food 5kg Bag",
      "unit": "piece",
      "price": 3500,
      "icon": "🐶",
      "imageUrl": "https://images.unsplash.com/photo-1764249453850-faace6e57444?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Rafael Rodrigues",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/close-up-of-dry-dog-food-kibble-TrmYHYdxhFQ",
       "source": "Unsplash"
      }
     },
     {
      "name": "Dog Food 1kg Pack",
      "unit": "packet",
      "price": 750,
      "icon": "🐶",
      "image": "assets/catalog-images/dog-food-6d32dd.webp",
      "imageLevel": "item"
     },
     {
      "name": "Cat Dry Food 2kg",
      "unit": "packet",
      "price": 2200,
      "icon": "🐱",
      "image": "assets/catalog-images/cat-dry-food-705bd4.webp",
      "imageLevel": "item"
     },
     {
      "name": "Cat Wet Food Cans Pack of 12",
      "unit": "box",
      "price": 1800,
      "icon": "🐱",
      "image": "assets/catalog-images/cat-wet-food-cans-5df0df.webp",
      "imageLevel": "item"
     },
     {
      "name": "Bird Seed Mix 1kg",
      "unit": "packet",
      "price": 350,
      "icon": "🐦",
      "image": "assets/catalog-images/bird-seed-mix-b243d5.webp",
      "imageLevel": "item"
     },
     {
      "name": "Parrot Food Mix 1kg",
      "unit": "packet",
      "price": 450,
      "icon": "🦜",
      "imageUrl": "https://images.unsplash.com/photo-1758612153921-9525532663d6?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Just Jus",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-close-up-view-of-mixed-birdseed-with-sunflower-seeds-1_o_MPGuNY0",
       "source": "Unsplash"
      }
     },
     {
      "name": "Fish Flakes Jar",
      "unit": "piece",
      "price": 400,
      "icon": "🐟"
     },
     {
      "name": "Fish Pellets Pack",
      "unit": "packet",
      "price": 350,
      "icon": "🐟",
      "image": "assets/catalog-images/fish-pellets-a6abdf.webp",
      "imageLevel": "item"
     },
     {
      "name": "Rabbit Pellets 1kg",
      "unit": "packet",
      "price": 500,
      "icon": "🐰",
      "image": "assets/catalog-images/rabbit-pellets-a54a46.webp",
      "imageLevel": "item"
     },
     {
      "name": "Hamster Food Pack",
      "unit": "packet",
      "price": 450,
      "icon": "🐹",
      "image": "assets/catalog-images/hamster-food-d324e7.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/pet-food-f4f2dc.webp",
    "imageUrl": "https://images.unsplash.com/photo-1758612153921-9525532663d6?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "Just Jus",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/a-close-up-view-of-mixed-birdseed-with-sunflower-seeds-1_o_MPGuNY0",
     "source": "Unsplash"
    }
   },
   {
    "name": "Bird & Small Animal Supplies",
    "items": [
     {
      "name": "Bird Cage Medium",
      "unit": "piece",
      "price": 2500,
      "icon": "🐦",
      "imageUrl": "https://images.unsplash.com/photo-1546840125-ba012c71366f?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Deleece Cook",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-birdcage-Vct2D4rZfmc",
       "source": "Unsplash"
      }
     },
     {
      "name": "Bird Water Feeder",
      "unit": "piece",
      "price": 300,
      "icon": "💧",
      "imageUrl": "https://images.unsplash.com/photo-1598280860721-14d1fd80a8af?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Mark Timberlake",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/yellow-and-black-bird-on-brown-and-white-bird-feeder-YXJG6duQfwY",
       "source": "Unsplash"
      }
     },
     {
      "name": "Pet Food Bowl",
      "unit": "piece",
      "price": 250,
      "icon": "🥣",
      "image": "assets/catalog-images/pet-food-bowl-9c2fd7.webp",
      "imageLevel": "item"
     },
     {
      "name": "Wooden Bird Perch",
      "unit": "piece",
      "price": 150,
      "icon": "🪵",
      "image": "assets/catalog-images/wooden-bird-perch-ea64ce.webp",
      "imageLevel": "item"
     },
     {
      "name": "Bird Nest Box",
      "unit": "piece",
      "price": 450,
      "icon": "🏠",
      "image": "assets/catalog-images/bird-nest-0dad94.webp",
      "imageLevel": "item"
     },
     {
      "name": "Bird Toys Set",
      "unit": "packet",
      "price": 350,
      "icon": "🧸",
      "image": "assets/catalog-images/bird-toys-efe7db.webp",
      "imageLevel": "item"
     },
     {
      "name": "Aquarium 2ft",
      "unit": "piece",
      "price": 4500,
      "icon": "🐠",
      "image": "assets/catalog-images/aquarium-0a3bfe.webp",
      "imageLevel": "item"
     },
     {
      "name": "Aquarium Filter",
      "unit": "piece",
      "price": 1200,
      "icon": "💧",
      "image": "assets/catalog-images/aquarium-filter-e5efad.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/bird-small-animal-supplies-eced04.webp"
   },
   {
    "name": "Veterinary Basics",
    "items": [
     {
      "name": "Deworming Tablets Box of 10",
      "unit": "box",
      "price": 600,
      "icon": "💊",
      "image": "assets/catalog-images/deworming-tablets-v2-926689.webp",
      "imageLevel": "item"
     },
     {
      "name": "Flea Powder Bottle 100g",
      "unit": "piece",
      "price": 350,
      "icon": "🧴"
     },
     {
      "name": "Antiseptic Spray for Animals 100ml",
      "unit": "piece",
      "price": 280,
      "icon": "🧴",
      "imageUrl": "https://images.unsplash.com/photo-1584969692915-882ae5013447?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "omid armin",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/person-holding-white-and-blue-plastic-bottle-IDV4BtRIxlY",
       "source": "Unsplash"
      }
     },
     {
      "name": "Livestock Wound Ointment",
      "unit": "piece",
      "price": 220,
      "icon": "🧴",
      "imageUrl": "https://images.unsplash.com/photo-1624023889166-3bfd2474604e?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Nenyasha Manzvera",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/nivea-creme-on-green-surface-ST67qUAB9n8",
       "source": "Unsplash"
      }
     },
     {
      "name": "Cattle Calcium Supplement 1kg",
      "unit": "packet",
      "price": 500,
      "icon": "🐄"
     },
     {
      "name": "Poultry Electrolyte Powder",
      "unit": "packet",
      "price": 300,
      "icon": "🐔"
     },
     {
      "name": "Poultry Drinker 5 Litre",
      "unit": "piece",
      "price": 650,
      "icon": "🐔",
      "image": "assets/catalog-images/poultry-drinker-0f0399.webp",
      "imageLevel": "item"
     },
     {
      "name": "Poultry Feeder Tray",
      "unit": "piece",
      "price": 550,
      "icon": "🐔",
      "imageUrl": "https://images.unsplash.com/photo-1569466593977-94ee7ed02ec9?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Arisa Chattasa",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/flock-of-hen-mJ7ghTbKXYo",
       "source": "Unsplash"
      }
     },
     {
      "name": "Heat Lamp Bulb 250W",
      "unit": "piece",
      "price": 400,
      "icon": "💡",
      "image": "assets/catalog-images/heat-lamp-bulb-af6468.webp",
      "imageLevel": "item"
     },
     {
      "name": "Pet Shampoo Bottle 250ml",
      "unit": "piece",
      "price": 550,
      "icon": "🧴",
      "image": "assets/catalog-images/pet-shampoo-bottle-455f10.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/veterinary-basics-f47b8c.webp",
    "imageUrl": "https://images.unsplash.com/photo-1569466593977-94ee7ed02ec9?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "Arisa Chattasa",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/flock-of-hen-mJ7ghTbKXYo",
     "source": "Unsplash"
    }
   }
  ]
 },
 {
  "shopType": "Stationery, Books & Printing",
  "icon": "📚",
  "categories": [
   {
    "name": "Writing",
    "items": [
     {
      "name": "Ball Pen",
      "unit": "piece",
      "price": 30,
      "icon": "🖊️",
      "image": "assets/catalog-images/ball-pen-v2-30fa51.webp",
      "imageLevel": "item"
     },
     {
      "name": "Gel Pen",
      "unit": "piece",
      "price": 60,
      "icon": "🖊️",
      "image": "assets/catalog-images/gel-pen-f50523.webp",
      "imageLevel": "item"
     },
     {
      "name": "Fountain Pen",
      "unit": "piece",
      "price": 250,
      "icon": "🖊️",
      "image": "assets/catalog-images/fountain-pen-c54cf7.webp",
      "imageLevel": "item"
     },
     {
      "name": "Lead Pencil",
      "unit": "piece",
      "price": 20,
      "icon": "✏️",
      "image": "assets/catalog-images/lead-pencil-7c75ad.webp",
      "imageLevel": "item"
     },
     {
      "name": "Pencil Box",
      "unit": "piece",
      "price": 180,
      "icon": "📦",
      "imageUrl": "https://images.unsplash.com/photo-1574944558125-f8d12f23be89?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Markus Spiske",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/assorted-color-pencil-and-pens-inside-pencil-case-fWDZ2bhhuc8",
       "source": "Unsplash"
      }
     },
     {
      "name": "Eraser",
      "unit": "piece",
      "price": 20,
      "icon": "🧽",
      "image": "assets/catalog-images/eraser-1432aa.webp",
      "imageLevel": "item"
     },
     {
      "name": "Sharpener",
      "unit": "piece",
      "price": 30,
      "icon": "✏️",
      "imageUrl": "https://images.unsplash.com/photo-1750502178383-f505b08ca29c?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Araf Ibne Alam",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/four-colorful-pencil-sharpeners-in-a-row-Z3wuvex8fgQ",
       "source": "Unsplash"
      }
     },
     {
      "name": "Highlighter Set of 4",
      "unit": "packet",
      "price": 220,
      "icon": "🖍️",
      "imageUrl": "https://images.unsplash.com/photo-1642440441537-97a32d0444ce?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Jonas Von Werne",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/three-different-colored-batteries-sitting-next-to-each-other-SpfiUSE0xJc",
       "source": "Unsplash"
      }
     },
     {
      "name": "Marker Set of 6",
      "unit": "packet",
      "price": 300,
      "icon": "🖊️",
      "imageUrl": "https://images.unsplash.com/photo-1693589211286-5766553fb3c7?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Karen Bullaro",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-group-of-different-colored-pens-sitting-next-to-each-other-50uejtTgxIQ",
       "source": "Unsplash"
      }
     },
     {
      "name": "Permanent Marker",
      "unit": "piece",
      "price": 80,
      "icon": "🖊️",
      "imageUrl": "https://images.unsplash.com/photo-1693589211286-5766553fb3c7?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Karen Bullaro",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-group-of-different-colored-pens-sitting-next-to-each-other-50uejtTgxIQ",
       "source": "Unsplash"
      }
     },
     {
      "name": "Whiteboard Marker",
      "unit": "piece",
      "price": 90,
      "icon": "🖊️",
      "image": "assets/catalog-images/whiteboard-marker-010346.webp",
      "imageLevel": "item"
     },
     {
      "name": "Pen Refills Pack of 10",
      "unit": "packet",
      "price": 120,
      "icon": "🖊️",
      "image": "assets/catalog-images/pen-refills-10-e3f9dc.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/writing-af96ab.webp"
   },
   {
    "name": "Paper & Notebooks",
    "items": [
     {
      "name": "A4 Paper Ream 500 Sheets",
      "unit": "piece",
      "price": 950,
      "icon": "📄",
      "image": "assets/catalog-images/paper-notebooks-7ef400.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/flagged/photo-1558963675-94dc9c4a66a9?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Bernd Klutsch",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/pile-of-books-nE2HV5AUXFo",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Single Line Notebook",
      "unit": "piece",
      "price": 150,
      "icon": "📓",
      "image": "assets/catalog-images/single-line-notebook-v2-9b6608.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/flagged/photo-1558963675-94dc9c4a66a9?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Bernd Klutsch",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/pile-of-books-nE2HV5AUXFo",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Math Notebook",
      "unit": "piece",
      "price": 140,
      "icon": "📓",
      "image": "assets/catalog-images/math-notebook-47c4ac.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/flagged/photo-1558963675-94dc9c4a66a9?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Bernd Klutsch",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/pile-of-books-nE2HV5AUXFo",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Drawing Book",
      "unit": "piece",
      "price": 120,
      "icon": "📓",
      "image": "assets/catalog-images/drawing-book-8fc26b.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/flagged/photo-1558963675-94dc9c4a66a9?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Bernd Klutsch",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/pile-of-books-nE2HV5AUXFo",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Graph Notebook",
      "unit": "piece",
      "price": 160,
      "icon": "📓",
      "image": "assets/catalog-images/graph-notebook-v2-12a406.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/flagged/photo-1558963675-94dc9c4a66a9?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Bernd Klutsch",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/pile-of-books-nE2HV5AUXFo",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Hardcover Diary",
      "unit": "piece",
      "price": 600,
      "icon": "📔",
      "image": "assets/catalog-images/hardcover-diary-288441.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/flagged/photo-1558963675-94dc9c4a66a9?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Bernd Klutsch",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/pile-of-books-nE2HV5AUXFo",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Register 200 Pages",
      "unit": "piece",
      "price": 350,
      "icon": "📒",
      "image": "assets/catalog-images/register-200-pages-v2-339290.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/flagged/photo-1558963675-94dc9c4a66a9?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Bernd Klutsch",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/pile-of-books-nE2HV5AUXFo",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Register 400 Pages",
      "unit": "piece",
      "price": 650,
      "icon": "📒",
      "image": "assets/catalog-images/register-400-pages-8dd83a.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/flagged/photo-1558963675-94dc9c4a66a9?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Bernd Klutsch",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/pile-of-books-nE2HV5AUXFo",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Sticky Notes Pack",
      "unit": "packet",
      "price": 180,
      "icon": "📝",
      "image": "assets/catalog-images/sticky-notes-048262.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/flagged/photo-1558963675-94dc9c4a66a9?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Bernd Klutsch",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/pile-of-books-nE2HV5AUXFo",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Envelopes Pack of 10",
      "unit": "packet",
      "price": 150,
      "icon": "✉️",
      "image": "assets/catalog-images/envelopes-10-0e8043.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/flagged/photo-1558963675-94dc9c4a66a9?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Bernd Klutsch",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/pile-of-books-nE2HV5AUXFo",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Chart Paper",
      "unit": "piece",
      "price": 40,
      "icon": "📄",
      "image": "assets/catalog-images/chart-paper-7bd052.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/flagged/photo-1558963675-94dc9c4a66a9?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Bernd Klutsch",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/pile-of-books-nE2HV5AUXFo",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Brown Paper Roll",
      "unit": "piece",
      "price": 300,
      "icon": "📜",
      "image": "assets/catalog-images/brown-paper-roll-32fee5.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/flagged/photo-1558963675-94dc9c4a66a9?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Bernd Klutsch",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/pile-of-books-nE2HV5AUXFo",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Tracing Paper Pack",
      "unit": "packet",
      "price": 200,
      "icon": "📄",
      "image": "assets/catalog-images/tracing-paper-71a52e.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/flagged/photo-1558963675-94dc9c4a66a9?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Bernd Klutsch",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/pile-of-books-nE2HV5AUXFo",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "File Folder",
      "unit": "piece",
      "price": 60,
      "icon": "📁",
      "image": "assets/catalog-images/file-folder-v2-939103.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/flagged/photo-1558963675-94dc9c4a66a9?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Bernd Klutsch",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/pile-of-books-nE2HV5AUXFo",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     }
    ],
    "image": "assets/catalog-images/paper-notebooks-7ef400.webp",
    "imageUrl": "https://images.unsplash.com/flagged/photo-1558963675-94dc9c4a66a9?w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Bernd Klutsch",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/pile-of-books-nE2HV5AUXFo",
     "source": "Unsplash"
    }
   },
   {
    "name": "Art & Craft",
    "items": [
     {
      "name": "Color Pencils Box of 12",
      "unit": "box",
      "price": 350,
      "icon": "🖍️",
      "imageUrl": "https://images.unsplash.com/photo-1522111608460-19e7331e00fb?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "salvatore ventura",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/assorted-color-color-pencils-nNe4HwY_iY0",
       "source": "Unsplash"
      }
     },
     {
      "name": "Wax Crayons Box of 12",
      "unit": "box",
      "price": 250,
      "icon": "🖍️",
      "image": "assets/catalog-images/wax-crayons-12-7be247.webp",
      "imageLevel": "item"
     },
     {
      "name": "Watercolor Paint Set",
      "unit": "box",
      "price": 400,
      "icon": "🎨",
      "image": "assets/catalog-images/watercolor-paint-v2-5d9fc0.webp",
      "imageLevel": "item"
     },
     {
      "name": "Poster Colors Set of 12",
      "unit": "box",
      "price": 550,
      "icon": "🎨",
      "imageUrl": "https://images.unsplash.com/photo-1781545385260-9f321f8d3f78?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Spring Mai",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/colorful-paint-jars-and-art-supplies-on-a-wooden-table-f189MoE9Y0Y",
       "source": "Unsplash"
      }
     },
     {
      "name": "Paint Brushes Set of 6",
      "unit": "packet",
      "price": 300,
      "icon": "🖌️",
      "image": "assets/catalog-images/paint-brushes-6-e35d68.webp",
      "imageLevel": "item"
     },
     {
      "name": "Glue Stick",
      "unit": "piece",
      "price": 80,
      "icon": "🧴",
      "image": "assets/catalog-images/glue-stick-32029c.webp",
      "imageLevel": "item"
     },
     {
      "name": "Glue Bottle 100ml",
      "unit": "piece",
      "price": 150,
      "icon": "🧴",
      "image": "assets/catalog-images/glue-bottle-600b2d.webp",
      "imageLevel": "item"
     },
     {
      "name": "Craft Scissors",
      "unit": "piece",
      "price": 180,
      "icon": "✂️",
      "image": "assets/catalog-images/craft-scissors-333edc.webp",
      "imageLevel": "item"
     },
     {
      "name": "Craft Paper Pack",
      "unit": "packet",
      "price": 250,
      "icon": "📄",
      "image": "assets/catalog-images/craft-paper-f281f9.webp",
      "imageLevel": "item"
     },
     {
      "name": "Tape Roll",
      "unit": "piece",
      "price": 90,
      "icon": "📦",
      "image": "assets/catalog-images/tape-roll-374aa9.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/art-craft-v2-cabef2.webp"
   },
   {
    "name": "Office & Desk",
    "items": [
     {
      "name": "Stapler",
      "unit": "piece",
      "price": 350,
      "icon": "📎",
      "image": "assets/catalog-images/stapler-v2-b7ae9c.webp",
      "imageLevel": "item"
     },
     {
      "name": "Staple Pins Box",
      "unit": "box",
      "price": 120,
      "icon": "📎",
      "image": "assets/catalog-images/staple-pins-d7f28c.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1559743341-7fef133c7c6a?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c3RhcGxlciUyMGFuZCUyMHN0YXBsZXN8ZW58MXx8fHwxNzkyMjU1NTExfDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Brett Jordan",
       "profileUrl": "https://unsplash.com/@brett_jordan",
       "photoUrl": "https://unsplash.com/photos/black-and-orange-optima-stapler-xG5caIE3tLU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/xG5caIE3tLU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8c3RhcGxlciUyMGFuZCUyMHN0YXBsZXN8ZW58MXx8fHwxNzkyMjU1NTExfDA",
      "imageSource": "unsplash"
     },
     {
      "name": "Paper Clips Box",
      "unit": "box",
      "price": 100,
      "icon": "📎",
      "image": "assets/catalog-images/paper-clips-4ae9b2.webp",
      "imageLevel": "item"
     },
     {
      "name": "Paper Punch",
      "unit": "piece",
      "price": 450,
      "icon": "🕳️"
     },
     {
      "name": "Calculator 12-Digit",
      "unit": "piece",
      "price": 950,
      "icon": "🧮",
      "image": "assets/catalog-images/calculator-12-digit-009a54.webp",
      "imageLevel": "item"
     },
     {
      "name": "Desk Organizer",
      "unit": "piece",
      "price": 600,
      "icon": "🗂️",
      "image": "assets/catalog-images/desk-organizer-v2-0dba16.webp",
      "imageLevel": "item"
     },
     {
      "name": "Stamp Pad",
      "unit": "piece",
      "price": 200,
      "icon": "🖨️",
      "image": "assets/catalog-images/stamp-pad-4e157b.webp",
      "imageLevel": "item"
     },
     {
      "name": "Custom Rubber Stamp",
      "unit": "piece",
      "price": 800,
      "icon": "🖨️",
      "image": "assets/catalog-images/office-desk-149283.webp",
      "imageLevel": "category"
     },
     {
      "name": "Paper Cutter",
      "unit": "piece",
      "price": 250,
      "icon": "✂️",
      "image": "assets/catalog-images/paper-cutter-9f2a9e.webp",
      "imageLevel": "item"
     },
     {
      "name": "Correction Tape",
      "unit": "piece",
      "price": 120,
      "icon": "📝",
      "image": "assets/catalog-images/correction-tape-6f3b6d.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/office-desk-149283.webp"
   },
   {
    "name": "School Supplies",
    "items": [
     {
      "name": "Geometry Box",
      "unit": "box",
      "price": 450,
      "icon": "📐",
      "imageUrl": "https://images.unsplash.com/photo-1764948620467-2b08f6843dd6?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Andrey Soldatov",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/close-up-of-a-vintage-drawing-compass-on-white-paper-aAoIy--0ZCk",
       "source": "Unsplash"
      }
     },
     {
      "name": "School Bag",
      "unit": "piece",
      "price": 1800,
      "icon": "🎒",
      "imageUrl": "https://images.unsplash.com/photo-1726726192148-af52008ff663?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "The Design Lady",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-yellow-backpack-sitting-on-top-of-a-table-C7eQtdkINpc",
       "source": "Unsplash"
      }
     },
     {
      "name": "Lunch Box",
      "unit": "piece",
      "price": 550,
      "icon": "🍱",
      "imageUrl": "https://images.unsplash.com/photo-1784979472083-dd3c4c109345?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Peter Heymans",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-lunchbox-filled-with-a-sandwich-cucumbers-radishes-and-tomatoes-eZRNJ0eUqtc",
       "source": "Unsplash"
      }
     },
     {
      "name": "School Water Bottle",
      "unit": "piece",
      "price": 450,
      "icon": "🍶",
      "image": "assets/catalog-images/school-water-bottle-v2-e69749.webp",
      "imageLevel": "item"
     },
     {
      "name": "Compass Divider",
      "unit": "piece",
      "price": 120,
      "icon": "📐",
      "image": "assets/catalog-images/compass-divider-112082.webp",
      "imageLevel": "item"
     },
     {
      "name": "Protractor Set",
      "unit": "packet",
      "price": 150,
      "icon": "📐",
      "image": "assets/catalog-images/protractor-fd9a22.webp",
      "imageLevel": "item"
     },
     {
      "name": "Ruler 12 inch",
      "unit": "piece",
      "price": 60,
      "icon": "📏",
      "imageUrl": "https://images.unsplash.com/photo-1502043150060-b01aa3030556?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Christian Kaindl",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/brown-wooden-ruler-xnUQO2DwXOo",
       "source": "Unsplash"
      }
     },
     {
      "name": "Scale Set of 3",
      "unit": "packet",
      "price": 100,
      "icon": "📏",
      "image": "assets/catalog-images/scale-3-ba279a.webp",
      "imageLevel": "item"
     },
     {
      "name": "Exam Board",
      "unit": "piece",
      "price": 350,
      "icon": "📋",
      "imageUrl": "https://images.unsplash.com/photo-1743385779431-45d26d9775b1?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Kelly Sikkema",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/clipboard-pencil-and-pen-on-a-wooden-surface-zQCDJZLS-Ms",
       "source": "Unsplash"
      }
     },
     {
      "name": "Uniform Belt",
      "unit": "piece",
      "price": 250,
      "icon": "👔",
      "image": "assets/catalog-images/uniform-belt-v2-960087.webp",
      "imageLevel": "item"
     },
     {
      "name": "School Tie",
      "unit": "piece",
      "price": 200,
      "icon": "👔",
      "image": "assets/catalog-images/school-tie-v2-887588.webp",
      "imageLevel": "item"
     },
     {
      "name": "School Socks Pair",
      "unit": "packet",
      "price": 150,
      "icon": "🧦",
      "image": "assets/catalog-images/school-socks-v2-fa99ac.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1640025867572-f6b3a8410c81?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Zm9sZGVkJTIwc29ja3MlMjBwYWlyfGVufDF8fHx8MTc5MjI1NTUxMHww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "NIKHIL",
       "profileUrl": "https://unsplash.com/@vinikhill",
       "photoUrl": "https://unsplash.com/photos/a-pair-of-socks-laying-on-top-of-a-yellow-surface-Xd_YG4iJLUo",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/Xd_YG4iJLUo/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Zm9sZGVkJTIwc29ja3MlMjBwYWlyfGVufDF8fHx8MTc5MjI1NTUxMHww",
      "imageSource": "unsplash"
     }
    ],
    "image": "assets/catalog-images/school-supplies-v2-69dbf7.webp"
   },
   {
    "name": "Books & Printing",
    "items": [
     {
      "name": "Quran with Urdu Translation",
      "unit": "piece",
      "price": 900,
      "icon": "📖",
      "nameUrdu": "قرآن مجید",
      "image": "assets/catalog-images/quran-urdu-translation-ab2823.webp",
      "imageLevel": "item"
     },
     {
      "name": "English-Urdu Dictionary",
      "unit": "piece",
      "price": 650,
      "icon": "📖",
      "imageUrl": "https://images.unsplash.com/photo-1451226428352-cf66bf8a0317?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Romain Vignes",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/focus-dictionary-index-page-ywqa9IZB-dU",
       "source": "Unsplash"
      }
     },
     {
      "name": "English Grammar Book",
      "unit": "piece",
      "price": 450,
      "icon": "📖",
      "imageUrl": "https://images.unsplash.com/photo-1693278615134-32eefbeb0590?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Mick Haupt",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-close-up-of-a-book-with-a-lot-of-words-on-it-e_prXWsOBV4",
       "source": "Unsplash"
      }
     },
     {
      "name": "Kids Story Book",
      "unit": "piece",
      "price": 300,
      "icon": "📖",
      "imageUrl": "https://images.unsplash.com/photo-1782150924537-7a4fe94d837f?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Thomas Underwood",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/colorful-childrens-books-with-various-titles-displayed-together-ha-0ijjtDyg",
       "source": "Unsplash"
      }
     },
     {
      "name": "Coloring Book",
      "unit": "piece",
      "price": 250,
      "icon": "📖",
      "image": "assets/catalog-images/coloring-book-f1d545.webp",
      "imageLevel": "item"
     },
     {
      "name": "Paperback Novel",
      "unit": "piece",
      "price": 700,
      "icon": "📖",
      "image": "assets/catalog-images/paperback-novel-d7320f.webp",
      "imageLevel": "item"
     },
     {
      "name": "Poetry Book (Diwan)",
      "unit": "piece",
      "price": 500,
      "icon": "📖",
      "nameUrdu": "دیوان",
      "image": "assets/catalog-images/poetry-book-c2bb32.webp",
      "imageLevel": "item"
     },
     {
      "name": "Exam Past Papers Book",
      "unit": "piece",
      "price": 550,
      "icon": "📖",
      "imageUrl": "https://images.unsplash.com/photo-1451226428352-cf66bf8a0317?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Romain Vignes",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/focus-dictionary-index-page-ywqa9IZB-dU",
       "source": "Unsplash"
      }
     },
     {
      "name": "Photocopy (per page)",
      "unit": "piece",
      "price": 5,
      "icon": "📄",
      "image": "assets/catalog-images/photocopy-6ecb4f.webp",
      "imageLevel": "item"
     },
     {
      "name": "Printout (per page)",
      "unit": "piece",
      "price": 10,
      "icon": "🖨️"
     },
     {
      "name": "Spiral Binding",
      "unit": "piece",
      "price": 150,
      "icon": "📎"
     },
     {
      "name": "Lamination (per sheet)",
      "unit": "piece",
      "price": 60,
      "icon": "📄"
     }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1451226428352-cf66bf8a0317?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "Romain Vignes",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/focus-dictionary-index-page-ywqa9IZB-dU",
     "source": "Unsplash"
    }
   }
  ]
 },
 {
  "shopType": "Mobile & Electronics",
  "icon": "📱",
  "categories": [
   {
    "name": "Phone Accessories",
    "items": [
     {
      "name": "Tempered Glass Protector 11D",
      "unit": "piece",
      "price": 150,
      "icon": "🛡️"
     },
     {
      "name": "Transparent Silicone Back Cover",
      "unit": "piece",
      "price": 350,
      "icon": "📱",
      "image": "assets/catalog-images/transparent-silicone-v2-474313.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1771142061210-95e97225641e?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Lee Peterson",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/clear-phone-case-with-magnetic-charging-circle-v38zp8oXaEg",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Printed Designer Back Cover",
      "unit": "piece",
      "price": 550,
      "icon": "🎨",
      "image": "assets/catalog-images/printed-designer-back-cover-eb9e60.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1760164142066-1ac379c057f5?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Katya Azimova",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/phone-case-decorated-with-tarot-card-and-stickers-7bUF0Wf27dY",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Leather Flip Pouch Cover",
      "unit": "piece",
      "price": 850,
      "icon": "👝",
      "image": "assets/catalog-images/phone-accessories-7e4585.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1764855310912-15dee3625bf2?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Barnaby Woodrow",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/brown-leather-phone-case-on-wooden-desk-3dfeQYCw-oM",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Metal Ring Holder Stand",
      "unit": "piece",
      "price": 250,
      "icon": "💍"
     },
     {
      "name": "Pop Socket Grip",
      "unit": "piece",
      "price": 200,
      "icon": "🔘",
      "image": "assets/catalog-images/pop-socket-grip-bdc332.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1621208586877-be0c9bc8a7c5?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Logan Gutierrez",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/silver-iphone-6-on-white-sony-device-2c7udssDpMI",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Neck Strap Lanyard",
      "unit": "piece",
      "price": 180,
      "icon": "🎗️",
      "image": "assets/catalog-images/neck-strap-lanyard-076d2e.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1769142726489-6f40b1c575c5?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "kasa deru",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/two-lanyards-with-united-tractors-logo-on-white-background-NnMGkEv-Q1Q",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Bluetooth Selfie Stick",
      "unit": "piece",
      "price": 950,
      "icon": "🤳",
      "image": "assets/catalog-images/phone-accessories-7e4585.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1572660570550-8ee8aa7faec7?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Casey Chae",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/turned-on-iphone-pceODL0msP8",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Flexible Mobile Tripod",
      "unit": "piece",
      "price": 750,
      "icon": "🎥",
      "image": "assets/catalog-images/flexible-mobile-tripod-dfbb7b.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1578654686426-d27ccbd940cb?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Shashank Hudkar",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/smartphone-on-octopus-tripod-facing-sea-ELjn1imcAIg",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Car Dashboard Mobile Holder",
      "unit": "piece",
      "price": 650,
      "icon": "🚗",
      "image": "assets/catalog-images/car-dashboard-mobile-holder-222087.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1717007873182-7cc5d673cbff?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Phil Hearing",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-cell-phone-mounted-to-the-dashboard-of-a-car-C6lzeXzv1ak",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Bike Handle Mobile Holder",
      "unit": "piece",
      "price": 550,
      "icon": "🏍️",
      "image": "assets/catalog-images/phone-accessories-7e4585.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1761721576781-baaf47945242?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Viktor Khilchuk",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/smartphone-mounted-on-bicycle-handlebars-recording-video-Pm1II-WS3aI",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Foldable Desktop Mobile Stand",
      "unit": "piece",
      "price": 450,
      "icon": "🖥️",
      "image": "assets/catalog-images/phone-accessories-7e4585.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1553556135-009e5858adce?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Michael Soledad",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/black-smartphone-near-white-imac-D12XjlsIoEM",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "PUBG Finger Sleeves Pair",
      "unit": "piece",
      "price": 250,
      "icon": "🎮"
     },
     {
      "name": "Mobile Game Trigger Pair",
      "unit": "piece",
      "price": 650,
      "icon": "🎯"
     },
     {
      "name": "Phone Cooling Fan Attachment",
      "unit": "piece",
      "price": 1450,
      "icon": "❄️"
     },
     {
      "name": "USB OTG Adapter Type-C",
      "unit": "piece",
      "price": 250,
      "icon": "🔌"
     },
     {
      "name": "SIM Ejector Pin 5-pack",
      "unit": "packet",
      "price": 100,
      "icon": "📌"
     },
     {
      "name": "Mobile Camera Lens Kit 3-in-1",
      "unit": "piece",
      "price": 1250,
      "icon": "📷",
      "image": "assets/catalog-images/mobile-camera-lens-kit-c75e83.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1491956716939-48348be220b1?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Aaron Burden",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/black-android-smartphone-capturing-blue-flower--ebVuVUFc18",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Charging Port Dust Plugs 10-pack",
      "unit": "packet",
      "price": 150,
      "icon": "🔌"
     },
     {
      "name": "Earphone Carry Case",
      "unit": "piece",
      "price": 300,
      "icon": "🎧",
      "image": "assets/catalog-images/earphone-carry-case-v2-f9ffe8.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1650549879653-9ca55cd1d015?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "JESUS ECA",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-person-holding-a-black-case-with-red-lines-on-it-OIIFoysUacM",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Smart Watch Silicone Strap",
      "unit": "piece",
      "price": 650,
      "icon": "⌚",
      "image": "assets/catalog-images/phone-accessories-7e4585.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1660844817855-3ecc7ef21f12?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "pratik prasad",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-watch-with-a-black-face-FPEBZJLD8Rs",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "OTG Card Reader",
      "unit": "piece",
      "price": 550,
      "icon": "💾"
     },
     {
      "name": "Phone Camera Protector Ring",
      "unit": "piece",
      "price": 200,
      "icon": "📷"
     },
     {
      "name": "Magnetic Car Mount Vent Clip",
      "unit": "piece",
      "price": 750,
      "icon": "🧲",
      "image": "assets/catalog-images/phone-accessories-7e4585.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1698314440055-5aa837af0a7f?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Rohan Krishnan",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-close-up-of-a-steering-wheel-of-a-car-QYQ9d8ZGELg",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     }
    ],
    "image": "assets/catalog-images/phone-accessories-7e4585.webp",
    "imageUrl": "https://images.unsplash.com/photo-1572660570550-8ee8aa7faec7?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "Casey Chae",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/turned-on-iphone-pceODL0msP8",
     "source": "Unsplash"
    }
   },
   {
    "name": "Chargers & Power",
    "items": [
     {
      "name": "Fast Charger 25W",
      "unit": "piece",
      "price": 1450,
      "icon": "🔌",
      "image": "assets/catalog-images/fast-charger-5497cd.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1585995603413-eb35b5f4a50b?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Q2hhcmdlcnMlMjAlMjAlMjBQb3dlcnxlbnwxfHx8fDE3OTIyNTU1MzJ8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Markus Winkler",
       "profileUrl": "https://unsplash.com/@markuswinkler",
       "photoUrl": "https://unsplash.com/photos/white-and-blue-coated-wires-UP_RojtnvTU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/UP_RojtnvTU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Q2hhcmdlcnMlMjAlMjAlMjBQb3dlcnxlbnwxfHx8fDE3OTIyNTU1MzJ8MA"
     },
     {
      "name": "Super Fast Charger 45W",
      "unit": "piece",
      "price": 2450,
      "icon": "⚡",
      "image": "assets/catalog-images/super-fast-charger-1b4754.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1585995603413-eb35b5f4a50b?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Q2hhcmdlcnMlMjAlMjAlMjBQb3dlcnxlbnwxfHx8fDE3OTIyNTU1MzJ8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Markus Winkler",
       "profileUrl": "https://unsplash.com/@markuswinkler",
       "photoUrl": "https://unsplash.com/photos/white-and-blue-coated-wires-UP_RojtnvTU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/UP_RojtnvTU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Q2hhcmdlcnMlMjAlMjAlMjBQb3dlcnxlbnwxfHx8fDE3OTIyNTU1MzJ8MA"
     },
     {
      "name": "GaN Charger 65W",
      "unit": "piece",
      "price": 3950,
      "icon": "⚡",
      "image": "assets/catalog-images/gan-charger-v2-4ae1bb.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1585995603413-eb35b5f4a50b?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Q2hhcmdlcnMlMjAlMjAlMjBQb3dlcnxlbnwxfHx8fDE3OTIyNTU1MzJ8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Markus Winkler",
       "profileUrl": "https://unsplash.com/@markuswinkler",
       "photoUrl": "https://unsplash.com/photos/white-and-blue-coated-wires-UP_RojtnvTU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/UP_RojtnvTU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Q2hhcmdlcnMlMjAlMjAlMjBQb3dlcnxlbnwxfHx8fDE3OTIyNTU1MzJ8MA"
     },
     {
      "name": "Type-C Fast Cable 1m",
      "unit": "piece",
      "price": 450,
      "icon": "🔗",
      "image": "assets/catalog-images/type-c-fast-cable-9d3241.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1585995603413-eb35b5f4a50b?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Q2hhcmdlcnMlMjAlMjAlMjBQb3dlcnxlbnwxfHx8fDE3OTIyNTU1MzJ8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Markus Winkler",
       "profileUrl": "https://unsplash.com/@markuswinkler",
       "photoUrl": "https://unsplash.com/photos/white-and-blue-coated-wires-UP_RojtnvTU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/UP_RojtnvTU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Q2hhcmdlcnMlMjAlMjAlMjBQb3dlcnxlbnwxfHx8fDE3OTIyNTU1MzJ8MA"
     },
     {
      "name": "Type-C Cable 2m Braided",
      "unit": "piece",
      "price": 750,
      "icon": "🔗",
      "image": "assets/catalog-images/chargers-power-v2-e852e3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1585995603413-eb35b5f4a50b?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Q2hhcmdlcnMlMjAlMjAlMjBQb3dlcnxlbnwxfHx8fDE3OTIyNTU1MzJ8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Markus Winkler",
       "profileUrl": "https://unsplash.com/@markuswinkler",
       "photoUrl": "https://unsplash.com/photos/white-and-blue-coated-wires-UP_RojtnvTU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/UP_RojtnvTU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Q2hhcmdlcnMlMjAlMjAlMjBQb3dlcnxlbnwxfHx8fDE3OTIyNTU1MzJ8MA",
      "imageSource": "unsplash"
     },
     {
      "name": "iPhone Lightning Cable 1m",
      "unit": "piece",
      "price": 650,
      "icon": "🍎",
      "image": "assets/catalog-images/chargers-power-v2-e852e3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1585995603413-eb35b5f4a50b?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Q2hhcmdlcnMlMjAlMjAlMjBQb3dlcnxlbnwxfHx8fDE3OTIyNTU1MzJ8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Markus Winkler",
       "profileUrl": "https://unsplash.com/@markuswinkler",
       "photoUrl": "https://unsplash.com/photos/white-and-blue-coated-wires-UP_RojtnvTU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/UP_RojtnvTU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Q2hhcmdlcnMlMjAlMjAlMjBQb3dlcnxlbnwxfHx8fDE3OTIyNTU1MzJ8MA",
      "imageSource": "unsplash"
     },
     {
      "name": "Micro USB Cable 1m",
      "unit": "piece",
      "price": 250,
      "icon": "🔗",
      "image": "assets/catalog-images/micro-usb-cable-1m-d83d53.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1585995603413-eb35b5f4a50b?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Q2hhcmdlcnMlMjAlMjAlMjBQb3dlcnxlbnwxfHx8fDE3OTIyNTU1MzJ8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Markus Winkler",
       "profileUrl": "https://unsplash.com/@markuswinkler",
       "photoUrl": "https://unsplash.com/photos/white-and-blue-coated-wires-UP_RojtnvTU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/UP_RojtnvTU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Q2hhcmdlcnMlMjAlMjAlMjBQb3dlcnxlbnwxfHx8fDE3OTIyNTU1MzJ8MA"
     },
     {
      "name": "3-in-1 Multi Charging Cable",
      "unit": "piece",
      "price": 550,
      "icon": "🔗",
      "image": "assets/catalog-images/3-in-1-multi-c5a0b8.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1572721546624-05bf65ad7679?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8dXNiJTIwY2hhcmdpbmclMjBjYWJsZXN8ZW58MXx8fHwxNzkyMjU1NDk3fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Lucian Alexe",
       "profileUrl": "https://unsplash.com/@lucian_alexe",
       "photoUrl": "https://unsplash.com/photos/orange-usb-cables-yh0UtueiZ-I",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/yh0UtueiZ-I/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8dXNiJTIwY2hhcmdpbmclMjBjYWJsZXN8ZW58MXx8fHwxNzkyMjU1NDk3fDA",
      "imageSource": "unsplash"
     },
     {
      "name": "Power Bank 10000mAh",
      "unit": "piece",
      "price": 3450,
      "icon": "🔋",
      "image": "assets/catalog-images/power-bank-de84d7.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1585995603413-eb35b5f4a50b?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Q2hhcmdlcnMlMjAlMjAlMjBQb3dlcnxlbnwxfHx8fDE3OTIyNTU1MzJ8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Markus Winkler",
       "profileUrl": "https://unsplash.com/@markuswinkler",
       "photoUrl": "https://unsplash.com/photos/white-and-blue-coated-wires-UP_RojtnvTU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/UP_RojtnvTU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Q2hhcmdlcnMlMjAlMjAlMjBQb3dlcnxlbnwxfHx8fDE3OTIyNTU1MzJ8MA"
     },
     {
      "name": "Power Bank 20000mAh",
      "unit": "piece",
      "price": 5450,
      "icon": "🔋",
      "image": "assets/catalog-images/power-bank-de84d7.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1585995603413-eb35b5f4a50b?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Q2hhcmdlcnMlMjAlMjAlMjBQb3dlcnxlbnwxfHx8fDE3OTIyNTU1MzJ8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Markus Winkler",
       "profileUrl": "https://unsplash.com/@markuswinkler",
       "photoUrl": "https://unsplash.com/photos/white-and-blue-coated-wires-UP_RojtnvTU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/UP_RojtnvTU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Q2hhcmdlcnMlMjAlMjAlMjBQb3dlcnxlbnwxfHx8fDE3OTIyNTU1MzJ8MA"
     },
     {
      "name": "Wireless Charging Pad 15W",
      "unit": "piece",
      "price": 1950,
      "icon": "📶",
      "image": "assets/catalog-images/wireless-charging-pad-e29a00.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1585995603413-eb35b5f4a50b?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Q2hhcmdlcnMlMjAlMjAlMjBQb3dlcnxlbnwxfHx8fDE3OTIyNTU1MzJ8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Markus Winkler",
       "profileUrl": "https://unsplash.com/@markuswinkler",
       "photoUrl": "https://unsplash.com/photos/white-and-blue-coated-wires-UP_RojtnvTU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/UP_RojtnvTU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Q2hhcmdlcnMlMjAlMjAlMjBQb3dlcnxlbnwxfHx8fDE3OTIyNTU1MzJ8MA"
     },
     {
      "name": "MagSafe Magnetic Charger",
      "unit": "piece",
      "price": 2450,
      "icon": "🧲",
      "image": "assets/catalog-images/magsafe-magnetic-charger-8cb9d8.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1585995603413-eb35b5f4a50b?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Q2hhcmdlcnMlMjAlMjAlMjBQb3dlcnxlbnwxfHx8fDE3OTIyNTU1MzJ8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Markus Winkler",
       "profileUrl": "https://unsplash.com/@markuswinkler",
       "photoUrl": "https://unsplash.com/photos/white-and-blue-coated-wires-UP_RojtnvTU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/UP_RojtnvTU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Q2hhcmdlcnMlMjAlMjAlMjBQb3dlcnxlbnwxfHx8fDE3OTIyNTU1MzJ8MA"
     },
     {
      "name": "Dual USB Car Charger",
      "unit": "piece",
      "price": 750,
      "icon": "🚗",
      "image": "assets/catalog-images/chargers-power-v2-e852e3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1585995603413-eb35b5f4a50b?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Q2hhcmdlcnMlMjAlMjAlMjBQb3dlcnxlbnwxfHx8fDE3OTIyNTU1MzJ8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Markus Winkler",
       "profileUrl": "https://unsplash.com/@markuswinkler",
       "photoUrl": "https://unsplash.com/photos/white-and-blue-coated-wires-UP_RojtnvTU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/UP_RojtnvTU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Q2hhcmdlcnMlMjAlMjAlMjBQb3dlcnxlbnwxfHx8fDE3OTIyNTU1MzJ8MA",
      "imageSource": "unsplash"
     },
     {
      "name": "Universal Travel Adapter",
      "unit": "piece",
      "price": 950,
      "icon": "🌍",
      "image": "assets/catalog-images/universal-travel-adapter-9b730d.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1585995603413-eb35b5f4a50b?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Q2hhcmdlcnMlMjAlMjAlMjBQb3dlcnxlbnwxfHx8fDE3OTIyNTU1MzJ8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Markus Winkler",
       "profileUrl": "https://unsplash.com/@markuswinkler",
       "photoUrl": "https://unsplash.com/photos/white-and-blue-coated-wires-UP_RojtnvTU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/UP_RojtnvTU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Q2hhcmdlcnMlMjAlMjAlMjBQb3dlcnxlbnwxfHx8fDE3OTIyNTU1MzJ8MA"
     },
     {
      "name": "Surge Protector Power Strip 6 Socket",
      "unit": "piece",
      "price": 1650,
      "icon": "🔌",
      "image": "assets/catalog-images/surge-protector-power-strip-7fcbec.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1585995603413-eb35b5f4a50b?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Q2hhcmdlcnMlMjAlMjAlMjBQb3dlcnxlbnwxfHx8fDE3OTIyNTU1MzJ8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Markus Winkler",
       "profileUrl": "https://unsplash.com/@markuswinkler",
       "photoUrl": "https://unsplash.com/photos/white-and-blue-coated-wires-UP_RojtnvTU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/UP_RojtnvTU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Q2hhcmdlcnMlMjAlMjAlMjBQb3dlcnxlbnwxfHx8fDE3OTIyNTU1MzJ8MA"
     },
     {
      "name": "Type-C to 3.5mm Audio Adapter",
      "unit": "piece",
      "price": 350,
      "icon": "🎧",
      "image": "assets/catalog-images/type-c-to-audio-v2-d8b23c.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1585995603413-eb35b5f4a50b?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Q2hhcmdlcnMlMjAlMjAlMjBQb3dlcnxlbnwxfHx8fDE3OTIyNTU1MzJ8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Markus Winkler",
       "profileUrl": "https://unsplash.com/@markuswinkler",
       "photoUrl": "https://unsplash.com/photos/white-and-blue-coated-wires-UP_RojtnvTU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/UP_RojtnvTU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Q2hhcmdlcnMlMjAlMjAlMjBQb3dlcnxlbnwxfHx8fDE3OTIyNTU1MzJ8MA"
     },
     {
      "name": "Retractable 3-in-1 Cable",
      "unit": "piece",
      "price": 850,
      "icon": "🔗",
      "image": "assets/catalog-images/retractable-3-in-1-aacf14.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1788958783968-4f4a08777b3b?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmV0cmFjdGFibGUlMjB1c2IlMjBjYWJsZXxlbnwxfHx8fDE3OTIyNTU0OTh8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Krossover Gifts",
       "profileUrl": "https://unsplash.com/@krossovergiftsuae",
       "photoUrl": "https://unsplash.com/photos/retractable-multi-connector-charging-cable-Ya4x-Mi_rj0",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/Ya4x-Mi_rj0/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cmV0cmFjdGFibGUlMjB1c2IlMjBjYWJsZXxlbnwxfHx8fDE3OTIyNTU0OTh8MA",
      "imageSource": "unsplash"
     },
     {
      "name": "20W PD Fast Charger",
      "unit": "piece",
      "price": 1250,
      "icon": "⚡",
      "image": "assets/catalog-images/pd-fast-charger-614c8b.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1585995603413-eb35b5f4a50b?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Q2hhcmdlcnMlMjAlMjAlMjBQb3dlcnxlbnwxfHx8fDE3OTIyNTU1MzJ8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Markus Winkler",
       "profileUrl": "https://unsplash.com/@markuswinkler",
       "photoUrl": "https://unsplash.com/photos/white-and-blue-coated-wires-UP_RojtnvTU",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/UP_RojtnvTU/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Q2hhcmdlcnMlMjAlMjAlMjBQb3dlcnxlbnwxfHx8fDE3OTIyNTU1MzJ8MA"
     }
    ],
    "image": "assets/catalog-images/chargers-power-v2-e852e3.webp",
    "imageUrl": "https://images.unsplash.com/photo-1585995603413-eb35b5f4a50b?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Q2hhcmdlcnMlMjAlMjAlMjBQb3dlcnxlbnwxfHx8fDE3OTIyNTU1MzJ8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Markus Winkler",
     "profileUrl": "https://unsplash.com/@markuswinkler",
     "photoUrl": "https://unsplash.com/photos/white-and-blue-coated-wires-UP_RojtnvTU",
     "source": "Unsplash"
    }
   },
   {
    "name": "Earbuds & Audio",
    "items": [
     {
      "name": "TWS Wireless Earbuds",
      "unit": "piece",
      "price": 2450,
      "icon": "🎧",
      "image": "assets/catalog-images/tws-wireless-earbuds-1d68e4.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Daniel Romero",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/shallow-focus-photo-of-apple-airpods-AgLMrojqjAM",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "ANC Pro Wireless Earbuds",
      "unit": "piece",
      "price": 4950,
      "icon": "🎧",
      "image": "assets/catalog-images/earbuds-audio-381b9d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Daniel Romero",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/shallow-focus-photo-of-apple-airpods-AgLMrojqjAM",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Bluetooth Neckband",
      "unit": "piece",
      "price": 1950,
      "icon": "🎵",
      "image": "assets/catalog-images/earbuds-audio-381b9d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Daniel Romero",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/shallow-focus-photo-of-apple-airpods-AgLMrojqjAM",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Type-C Wired Handsfree",
      "unit": "piece",
      "price": 650,
      "icon": "🎧",
      "image": "assets/catalog-images/earbuds-audio-381b9d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Daniel Romero",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/shallow-focus-photo-of-apple-airpods-AgLMrojqjAM",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "3.5mm Wired Handsfree",
      "unit": "piece",
      "price": 350,
      "icon": "🎧",
      "image": "assets/catalog-images/earbuds-audio-381b9d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Daniel Romero",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/shallow-focus-photo-of-apple-airpods-AgLMrojqjAM",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Mini Bluetooth Speaker",
      "unit": "piece",
      "price": 1450,
      "icon": "🔊",
      "image": "assets/catalog-images/bluetooth-speaker-5e7677.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Daniel Romero",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/shallow-focus-photo-of-apple-airpods-AgLMrojqjAM",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Party Bluetooth Speaker",
      "unit": "piece",
      "price": 8950,
      "icon": "🔊",
      "image": "assets/catalog-images/party-bluetooth-speaker-1e868a.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Daniel Romero",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/shallow-focus-photo-of-apple-airpods-AgLMrojqjAM",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Bluetooth Karaoke Microphone",
      "unit": "piece",
      "price": 2950,
      "icon": "🎤",
      "image": "assets/catalog-images/earbuds-audio-381b9d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Daniel Romero",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/shallow-focus-photo-of-apple-airpods-AgLMrojqjAM",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Over-Ear Headphones",
      "unit": "piece",
      "price": 3450,
      "icon": "🎧",
      "image": "assets/catalog-images/over-ear-headphones-650c90.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Daniel Romero",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/shallow-focus-photo-of-apple-airpods-AgLMrojqjAM",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Portable FM Radio",
      "unit": "piece",
      "price": 1250,
      "icon": "📻",
      "image": "assets/catalog-images/portable-fm-radio-059c9c.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Daniel Romero",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/shallow-focus-photo-of-apple-airpods-AgLMrojqjAM",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "AUX Cable 1m",
      "unit": "piece",
      "price": 250,
      "icon": "🔗",
      "image": "assets/catalog-images/earbuds-audio-381b9d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Daniel Romero",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/shallow-focus-photo-of-apple-airpods-AgLMrojqjAM",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Earbud Silicone Tips 6-pack",
      "unit": "packet",
      "price": 200,
      "icon": "🎧",
      "image": "assets/catalog-images/earbuds-audio-381b9d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Daniel Romero",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/shallow-focus-photo-of-apple-airpods-AgLMrojqjAM",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Bone Conduction Headphones",
      "unit": "piece",
      "price": 4950,
      "icon": "🎧",
      "image": "assets/catalog-images/bone-conduction-headphones-5d5a20.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Daniel Romero",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/shallow-focus-photo-of-apple-airpods-AgLMrojqjAM",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "USB-C DAC Audio Dongle",
      "unit": "piece",
      "price": 950,
      "icon": "🎧",
      "image": "assets/catalog-images/earbuds-audio-381b9d.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Daniel Romero",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/shallow-focus-photo-of-apple-airpods-AgLMrojqjAM",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     }
    ],
    "image": "assets/catalog-images/earbuds-audio-381b9d.webp",
    "imageUrl": "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Daniel Romero",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/shallow-focus-photo-of-apple-airpods-AgLMrojqjAM",
     "source": "Unsplash"
    }
   },
   {
    "name": "TVs & Home Entertainment",
    "items": [
     {
      "name": "LED TV 32 inch",
      "unit": "piece",
      "price": 42000,
      "icon": "📺",
      "image": "assets/catalog-images/led-tv-fb520f.webp",
      "imageLevel": "item"
     },
     {
      "name": "LED TV 43 inch 4K",
      "unit": "piece",
      "price": 72000,
      "icon": "📺",
      "imageUrl": "https://images.unsplash.com/photo-1461151304267-38535e780c79?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Jens Kreuter",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/flat-screen-tv-ngMtsE5r9eI",
       "source": "Unsplash"
      }
     },
     {
      "name": "LED TV 55 inch 4K",
      "unit": "piece",
      "price": 115000,
      "icon": "📺",
      "imageUrl": "https://images.unsplash.com/photo-1461151304267-38535e780c79?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Jens Kreuter",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/flat-screen-tv-ngMtsE5r9eI",
       "source": "Unsplash"
      }
     },
     {
      "name": "TV Wall Mount Bracket 32-55",
      "unit": "piece",
      "price": 1450,
      "icon": "🔧",
      "image": "assets/catalog-images/tv-wall-mount-bracket-361531.webp",
      "imageLevel": "item"
     },
     {
      "name": "Universal TV Remote",
      "unit": "piece",
      "price": 450,
      "icon": "🎛️",
      "image": "assets/catalog-images/universal-tv-remote-1ac56d.webp",
      "imageLevel": "item"
     },
     {
      "name": "Android TV Box 4K",
      "unit": "piece",
      "price": 6500,
      "icon": "📦",
      "image": "assets/catalog-images/android-tv-4k-d04273.webp",
      "imageLevel": "item"
     },
     {
      "name": "Dish Antenna 6ft",
      "unit": "piece",
      "price": 2800,
      "icon": "📡",
      "image": "assets/catalog-images/dish-antenna-9127a3.webp",
      "imageLevel": "item"
     },
     {
      "name": "LNB Single",
      "unit": "piece",
      "price": 650,
      "icon": "📡",
      "imageUrl": "https://images.unsplash.com/photo-1748002094696-f6d2214824f2?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Rasta Gubaz",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-satellite-dish-is-mounted-on-a-wall--NWGWmcEwi4",
       "source": "Unsplash"
      }
     },
     {
      "name": "HDMI Cable 1.5m",
      "unit": "piece",
      "price": 450,
      "icon": "🔗",
      "imageUrl": "https://images.unsplash.com/photo-1756576357688-c637013d3483?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Andrey Matveev",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/black-usb-cable-on-a-bright-yellow-background-mwuFNpcHskI",
       "source": "Unsplash"
      }
     },
     {
      "name": "HDMI Cable 5m",
      "unit": "piece",
      "price": 950,
      "icon": "🔗",
      "imageUrl": "https://images.unsplash.com/photo-1756576357688-c637013d3483?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Andrey Matveev",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/black-usb-cable-on-a-bright-yellow-background-mwuFNpcHskI",
       "source": "Unsplash"
      }
     },
     {
      "name": "TV Trolley Stand",
      "unit": "piece",
      "price": 5500,
      "icon": "📺",
      "imageUrl": "https://images.unsplash.com/photo-1697457643599-77b5d074121f?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "JALG TV Stand",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-flat-screen-tv-sitting-on-top-of-a-wooden-stand-ipF8WKs3iZI",
       "source": "Unsplash"
      }
     },
     {
      "name": "Satellite Finder Meter",
      "unit": "piece",
      "price": 1800,
      "icon": "📡",
      "image": "assets/catalog-images/satellite-finder-meter-1831b6.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/tvs-home-entertainment-23cc6e.webp",
    "imageUrl": "https://images.unsplash.com/photo-1697457643599-77b5d074121f?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "JALG TV Stand",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/a-flat-screen-tv-sitting-on-top-of-a-wooden-stand-ipF8WKs3iZI",
     "source": "Unsplash"
    }
   },
   {
    "name": "Fans & Cooling",
    "items": [
     {
      "name": "Ceiling Fan 56 inch AC",
      "unit": "piece",
      "price": 9500,
      "icon": "🌀",
      "nameUrdu": "پنکھا",
      "imageUrl": "https://images.unsplash.com/photo-1609519479841-5fd3b2884e17?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Kalyanaraman S",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-5-blade-ceiling-fan-Ww9nZ1MGQLY",
       "source": "Unsplash"
      }
     },
     {
      "name": "Inverter Ceiling Fan 56 inch",
      "unit": "piece",
      "price": 13500,
      "icon": "🌀",
      "imageUrl": "https://images.unsplash.com/photo-1609519479841-5fd3b2884e17?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Kalyanaraman S",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-5-blade-ceiling-fan-Ww9nZ1MGQLY",
       "source": "Unsplash"
      }
     },
     {
      "name": "Ceiling Fan Remote Control Kit",
      "unit": "piece",
      "price": 1250,
      "icon": "🎛️",
      "image": "assets/catalog-images/ceiling-fan-remote-control-d2c7a0.webp",
      "imageLevel": "item"
     },
     {
      "name": "Pedestal Fan 18 inch",
      "unit": "piece",
      "price": 7500,
      "icon": "🌀",
      "image": "assets/catalog-images/pedestal-fan-aedabb.webp",
      "imageLevel": "item"
     },
     {
      "name": "Table Fan 12 inch",
      "unit": "piece",
      "price": 3800,
      "icon": "🌀",
      "imageUrl": "https://images.unsplash.com/photo-1665298455913-dd43714f5ad1?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Zesan H.",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-round-black-object-with-a-round-top-RNQA0_f1ASI",
       "source": "Unsplash"
      }
     },
     {
      "name": "Rechargeable Table Fan 12 inch",
      "unit": "piece",
      "price": 5200,
      "icon": "🔋",
      "imageUrl": "https://images.unsplash.com/photo-1665298455913-dd43714f5ad1?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Zesan H.",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-round-black-object-with-a-round-top-RNQA0_f1ASI",
       "source": "Unsplash"
      }
     },
     {
      "name": "Exhaust Fan 10 inch",
      "unit": "piece",
      "price": 2800,
      "icon": "💨",
      "image": "assets/catalog-images/exhaust-fan-v2-22eee6.webp",
      "imageLevel": "item"
     },
     {
      "name": "Bracket Fan 18 inch",
      "unit": "piece",
      "price": 6800,
      "icon": "🌀",
      "image": "assets/catalog-images/bracket-fan-v2-7b6b06.webp",
      "imageLevel": "item"
     },
     {
      "name": "Fan Regulator Switch",
      "unit": "piece",
      "price": 450,
      "icon": "🎚️",
      "image": "assets/catalog-images/fan-regulator-switch-v2-e5c484.webp",
      "imageLevel": "item"
     },
     {
      "name": "Fan Capacitor 2.5uF",
      "unit": "piece",
      "price": 180,
      "icon": "⚡"
     },
     {
      "name": "Solar DC Fan 12 inch",
      "unit": "piece",
      "price": 6500,
      "icon": "☀️",
      "imageUrl": "https://images.unsplash.com/photo-1564510182791-29645da7fac4?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Call Me Fred",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/gray-and-white-mini-fan-on-white-surface-6KZcjJoaqNI",
       "source": "Unsplash"
      }
     },
     {
      "name": "Wall Fan 16 inch",
      "unit": "piece",
      "price": 5800,
      "icon": "🌀",
      "image": "assets/catalog-images/wall-fan-7ef55d.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/fans-cooling-102a39.webp",
    "imageUrl": "https://images.unsplash.com/photo-1665298455913-dd43714f5ad1?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "Zesan H.",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/a-round-black-object-with-a-round-top-RNQA0_f1ASI",
     "source": "Unsplash"
    }
   },
   {
    "name": "Batteries & Small Appliances",
    "items": [
     {
      "name": "AA Battery 4-pack",
      "unit": "packet",
      "price": 350,
      "icon": "🔋",
      "image": "assets/catalog-images/aa-battery-4-87ef3b.webp",
      "imageLevel": "item"
     },
     {
      "name": "AAA Battery 4-pack",
      "unit": "packet",
      "price": 350,
      "icon": "🔋",
      "image": "assets/catalog-images/aaa-battery-4-a08465.webp",
      "imageLevel": "item"
     },
     {
      "name": "9V Battery",
      "unit": "piece",
      "price": 280,
      "icon": "🔋",
      "imageUrl": "https://images.unsplash.com/photo-1550496923-a0e3ef948e3a?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Brett Jordan",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/orange-9v-duracell-battery-NIDPm-ltVbA",
       "source": "Unsplash"
      }
     },
     {
      "name": "CR2032 Button Cell 5-pack",
      "unit": "packet",
      "price": 250,
      "icon": "🔋",
      "imageUrl": "https://images.unsplash.com/photo-1640545232337-5cb2c7b24ca8?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Андрей Сизов",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-group-of-three-batteries-sitting-on-top-of-a-table-IUzs7uWOZ_Y",
       "source": "Unsplash"
      }
     },
     {
      "name": "AA Rechargeable Battery 4-pack",
      "unit": "packet",
      "price": 1450,
      "icon": "🔋",
      "image": "assets/catalog-images/aa-rechargeable-battery-4-343c34.webp",
      "imageLevel": "item"
     },
     {
      "name": "Rechargeable LED Torch",
      "unit": "piece",
      "price": 950,
      "icon": "🔦",
      "image": "assets/catalog-images/rechargeable-led-torch-b770d3.webp",
      "imageLevel": "item"
     },
     {
      "name": "LED Emergency Light",
      "unit": "piece",
      "price": 1450,
      "icon": "💡",
      "image": "assets/catalog-images/led-emergency-light-490a86.webp",
      "imageLevel": "item"
     },
     {
      "name": "Electric Mosquito Racket",
      "unit": "piece",
      "price": 650,
      "icon": "🦟",
      "image": "assets/catalog-images/electric-mosquito-racket-ff4233.webp",
      "imageLevel": "item"
     },
     {
      "name": "Electric Kettle 1.8L",
      "unit": "piece",
      "price": 2450,
      "icon": "🫖",
      "image": "assets/catalog-images/electric-kettle-9d0266.webp",
      "imageLevel": "item"
     },
     {
      "name": "Dry Iron",
      "unit": "piece",
      "price": 1950,
      "icon": "👔",
      "imageUrl": "https://images.unsplash.com/photo-1489274495757-95c7c837b101?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Filip Mroz",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-teal-steam-clothes-iron-plugged-on-ironing-board-gma1zfS3_6E",
       "source": "Unsplash"
      }
     }
    ]
   }
  ]
 },
 {
  "shopType": "Electrical Shop",
  "icon": "💡",
  "categories": [
   {
    "name": "Wires & Cables",
    "items": [
     {
      "name": "Copper Wire 3/29 90m Roll",
      "unit": "piece",
      "price": 9500,
      "icon": "🧵",
      "nameUrdu": "تار",
      "imageUrl": "https://images.unsplash.com/photo-1707409464255-e78eb873298a?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Guille B",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-coil-of-copper-wire-on-a-table-TqueZSSAloY",
       "source": "Unsplash"
      }
     },
     {
      "name": "Copper Wire 7/29 90m Roll",
      "unit": "piece",
      "price": 14500,
      "icon": "🧵",
      "imageUrl": "https://images.unsplash.com/photo-1707409464255-e78eb873298a?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Guille B",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-coil-of-copper-wire-on-a-table-TqueZSSAloY",
       "source": "Unsplash"
      }
     },
     {
      "name": "Copper Wire 7/36 90m Roll",
      "unit": "piece",
      "price": 18500,
      "icon": "🧵",
      "imageUrl": "https://images.unsplash.com/photo-1707409464255-e78eb873298a?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Guille B",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-coil-of-copper-wire-on-a-table-TqueZSSAloY",
       "source": "Unsplash"
      }
     },
     {
      "name": "Flexible Wire 2 Core 90m Roll",
      "unit": "piece",
      "price": 6800,
      "icon": "🧵",
      "imageUrl": "https://images.unsplash.com/photo-1687038520693-e528c10e450a?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Kier in Sight Archives",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-black-wires-are-stacked-together-EYAfw1ujabI",
       "source": "Unsplash"
      }
     },
     {
      "name": "Flexible Wire 3 Core 90m Roll",
      "unit": "piece",
      "price": 9200,
      "icon": "🧵",
      "image": "assets/catalog-images/flexible-wire-v2-80a599.webp",
      "imageLevel": "item"
     },
     {
      "name": "PVC Wire 1.5mm 90m",
      "unit": "piece",
      "price": 7200,
      "icon": "🧵",
      "image": "assets/catalog-images/wires-cables-8eba2e.webp",
      "imageLevel": "category"
     },
     {
      "name": "Earth Wire Green 90m Roll",
      "unit": "piece",
      "price": 5400,
      "icon": "🟢",
      "image": "assets/catalog-images/wires-cables-8eba2e.webp",
      "imageLevel": "category"
     },
     {
      "name": "Telephone Wire 2 Pair 100m",
      "unit": "piece",
      "price": 3800,
      "icon": "☎️",
      "image": "assets/catalog-images/wires-cables-8eba2e.webp",
      "imageLevel": "category"
     },
     {
      "name": "LAN Cable Cat6 100m Roll",
      "unit": "piece",
      "price": 12500,
      "icon": "🌐",
      "image": "assets/catalog-images/wires-cables-8eba2e.webp",
      "imageLevel": "category"
     },
     {
      "name": "Coaxial Cable RG6 100m Roll",
      "unit": "piece",
      "price": 8900,
      "icon": "📡",
      "image": "assets/catalog-images/wires-cables-8eba2e.webp",
      "imageLevel": "category"
     },
     {
      "name": "Service Drop Wire 2 Core 25m Bundle",
      "unit": "piece",
      "price": 2400,
      "icon": "🧵",
      "imageUrl": "https://images.unsplash.com/photo-1687038520693-e528c10e450a?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Kier in Sight Archives",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-black-wires-are-stacked-together-EYAfw1ujabI",
       "source": "Unsplash"
      }
     },
     {
      "name": "Cable Tie 100-pack",
      "unit": "packet",
      "price": 250,
      "icon": "🔗"
     }
    ],
    "image": "assets/catalog-images/wires-cables-8eba2e.webp"
   },
   {
    "name": "Switches & Boards",
    "items": [
     {
      "name": "Switch Plate 1 Gang",
      "unit": "piece",
      "price": 280,
      "icon": "🔲",
      "image": "assets/catalog-images/switch-plate-1-gang-v2-a007d5.webp",
      "imageLevel": "item"
     },
     {
      "name": "Switch Plate 2 Gang",
      "unit": "piece",
      "price": 420,
      "icon": "🔲",
      "imageUrl": "https://images.unsplash.com/photo-1788160834728-60b5cd8db787?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Lunyon",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/brown-light-switch-with-black-toggles-adjonsWxt6w",
       "source": "Unsplash"
      }
     },
     {
      "name": "Switch Plate 4 Gang",
      "unit": "piece",
      "price": 680,
      "icon": "🔲",
      "imageUrl": "https://images.unsplash.com/photo-1788160834728-60b5cd8db787?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Lunyon",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/brown-light-switch-with-black-toggles-adjonsWxt6w",
       "source": "Unsplash"
      }
     },
     {
      "name": "Switch Plate 6 Gang",
      "unit": "piece",
      "price": 950,
      "icon": "🔲",
      "imageUrl": "https://images.unsplash.com/photo-1788160834728-60b5cd8db787?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Lunyon",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/brown-light-switch-with-black-toggles-adjonsWxt6w",
       "source": "Unsplash"
      }
     },
     {
      "name": "Switch Plate 8 Gang",
      "unit": "piece",
      "price": 1250,
      "icon": "🔲",
      "imageUrl": "https://images.unsplash.com/photo-1788160834728-60b5cd8db787?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Lunyon",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/brown-light-switch-with-black-toggles-adjonsWxt6w",
       "source": "Unsplash"
      }
     },
     {
      "name": "Switch Plate 12 Gang",
      "unit": "piece",
      "price": 1850,
      "icon": "🔲",
      "imageUrl": "https://images.unsplash.com/photo-1788160834728-60b5cd8db787?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Lunyon",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/brown-light-switch-with-black-toggles-adjonsWxt6w",
       "source": "Unsplash"
      }
     },
     {
      "name": "Fan Dimmer Regulator",
      "unit": "piece",
      "price": 550,
      "icon": "🎚️",
      "image": "assets/catalog-images/switches-boards-1cc01e.webp",
      "imageLevel": "category"
     },
     {
      "name": "13A Power Socket 3-Pin",
      "unit": "piece",
      "price": 380,
      "icon": "🔌",
      "image": "assets/catalog-images/power-socket-3-pin-1c1a8f.webp",
      "imageLevel": "item"
     },
     {
      "name": "5A Power Socket 2-Pin",
      "unit": "piece",
      "price": 220,
      "icon": "🔌",
      "image": "assets/catalog-images/power-socket-2-pin-80f205.webp",
      "imageLevel": "item"
     },
     {
      "name": "Universal Multi Socket 5-in-1",
      "unit": "piece",
      "price": 750,
      "icon": "🔌",
      "image": "assets/catalog-images/switches-boards-1cc01e.webp",
      "imageLevel": "category"
     },
     {
      "name": "Door Bell Push Button",
      "unit": "piece",
      "price": 320,
      "icon": "🔔",
      "image": "assets/catalog-images/door-bell-push-button-58fe25.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1704075877553-0d4a318459d7?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8ZG9vcmJlbGwlMjBidXR0b258ZW58MXx8fHwxNzkyMjU1NTEyfDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Jack Gardner",
       "profileUrl": "https://unsplash.com/@jackgardner",
       "photoUrl": "https://unsplash.com/photos/a-person-pressing-a-button-on-a-wooden-door-e5Lq11USENs",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/e5Lq11USENs/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8ZG9vcmJlbGwlMjBidXR0b258ZW58MXx8fHwxNzkyMjU1NTEyfDA",
      "imageSource": "unsplash"
     },
     {
      "name": "Concealed Switch Box 7x4",
      "unit": "piece",
      "price": 180,
      "icon": "📦",
      "image": "assets/catalog-images/switches-boards-1cc01e.webp",
      "imageLevel": "category"
     }
    ],
    "image": "assets/catalog-images/switches-boards-1cc01e.webp"
   },
   {
    "name": "Breakers & Panels",
    "items": [
     {
      "name": "MCB 6A Single Pole",
      "unit": "piece",
      "price": 650,
      "icon": "⚡",
      "imageUrl": "https://images.unsplash.com/photo-1576446470246-499c738d1c8e?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Mark Kats",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-circuit-breakers-oj1zW_PNI4k",
       "source": "Unsplash"
      }
     },
     {
      "name": "MCB 16A Single Pole",
      "unit": "piece",
      "price": 680,
      "icon": "⚡",
      "imageUrl": "https://images.unsplash.com/photo-1576446470246-499c738d1c8e?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Mark Kats",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-circuit-breakers-oj1zW_PNI4k",
       "source": "Unsplash"
      }
     },
     {
      "name": "MCB 32A Single Pole",
      "unit": "piece",
      "price": 720,
      "icon": "⚡",
      "imageUrl": "https://images.unsplash.com/photo-1576446470246-499c738d1c8e?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Mark Kats",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-circuit-breakers-oj1zW_PNI4k",
       "source": "Unsplash"
      }
     },
     {
      "name": "MCB 63A Double Pole",
      "unit": "piece",
      "price": 1450,
      "icon": "⚡",
      "image": "assets/catalog-images/breakers-panels-cc1610.webp",
      "imageLevel": "category"
     },
     {
      "name": "Changeover Switch 32A",
      "unit": "piece",
      "price": 1850,
      "icon": "🔀",
      "image": "assets/catalog-images/changeover-switch-76401e.webp",
      "imageLevel": "item"
     },
     {
      "name": "Changeover Switch 63A",
      "unit": "piece",
      "price": 2950,
      "icon": "🔀",
      "image": "assets/catalog-images/changeover-switch-76401e.webp",
      "imageLevel": "item"
     },
     {
      "name": "Distribution Board 4 Way",
      "unit": "piece",
      "price": 1650,
      "icon": "📋",
      "image": "assets/catalog-images/distribution-board-4-way-977474.webp",
      "imageLevel": "item"
     },
     {
      "name": "Distribution Board 8 Way",
      "unit": "piece",
      "price": 2450,
      "icon": "📋",
      "imageUrl": "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Markus Spiske",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/electrical-switch-box-with-circuit-breakers-kK7uPfb2YWU",
       "source": "Unsplash"
      }
     },
     {
      "name": "Distribution Board 12 Way",
      "unit": "piece",
      "price": 3450,
      "icon": "📋",
      "image": "assets/catalog-images/distribution-board-12-way-65526f.webp",
      "imageLevel": "item"
     },
     {
      "name": "Digital Panel Voltmeter",
      "unit": "piece",
      "price": 950,
      "icon": "📟",
      "image": "assets/catalog-images/digital-panel-voltmeter-v2-1a5b27.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/breakers-panels-cc1610.webp"
   },
   {
    "name": "Bulbs & Lights",
    "items": [
     {
      "name": "LED Bulb 5W",
      "unit": "piece",
      "price": 180,
      "icon": "💡",
      "image": "assets/catalog-images/led-bulb-0c9ff1.webp",
      "imageLevel": "item"
     },
     {
      "name": "LED Bulb 7W",
      "unit": "piece",
      "price": 220,
      "icon": "💡",
      "image": "assets/catalog-images/led-bulb-0c9ff1.webp",
      "imageLevel": "item"
     },
     {
      "name": "LED Bulb 9W",
      "unit": "piece",
      "price": 260,
      "icon": "💡",
      "image": "assets/catalog-images/led-bulb-0c9ff1.webp",
      "imageLevel": "item"
     },
     {
      "name": "LED Bulb 12W",
      "unit": "piece",
      "price": 320,
      "icon": "💡",
      "image": "assets/catalog-images/led-bulb-0c9ff1.webp",
      "imageLevel": "item"
     },
     {
      "name": "LED Bulb 18W",
      "unit": "piece",
      "price": 450,
      "icon": "💡",
      "image": "assets/catalog-images/led-bulb-0c9ff1.webp",
      "imageLevel": "item"
     },
     {
      "name": "LED Bulb 25W",
      "unit": "piece",
      "price": 650,
      "icon": "💡",
      "image": "assets/catalog-images/led-bulb-0c9ff1.webp",
      "imageLevel": "item"
     },
     {
      "name": "LED Bulb 40W",
      "unit": "piece",
      "price": 950,
      "icon": "💡",
      "image": "assets/catalog-images/led-bulb-0c9ff1.webp",
      "imageLevel": "item"
     },
     {
      "name": "LED Panel Light 12W Round",
      "unit": "piece",
      "price": 750,
      "icon": "🔆",
      "imageUrl": "https://images.unsplash.com/photo-1531749086006-778f081e9fd8?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Florian Meissner",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/two-round-white-plates-on-floor-Nb7meWvvcGo",
       "source": "Unsplash"
      }
     },
     {
      "name": "LED Flood Light 50W",
      "unit": "piece",
      "price": 2450,
      "icon": "🔦",
      "image": "assets/catalog-images/led-flood-light-v2-420e3f.webp",
      "imageLevel": "item"
     },
     {
      "name": "LED Tube Light 4ft",
      "unit": "piece",
      "price": 850,
      "icon": "💡",
      "image": "assets/catalog-images/led-tube-light-df85c4.webp",
      "imageLevel": "item"
     },
     {
      "name": "Sensor Night Lamp",
      "unit": "piece",
      "price": 550,
      "icon": "🌙"
     },
     {
      "name": "Chandelier Bulb Candle Type",
      "unit": "piece",
      "price": 380,
      "icon": "🕯️",
      "imageUrl": "https://images.unsplash.com/photo-1765148687603-661834433aae?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Shahraiz Tabassam",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-lit-candle-shaped-light-bulb-in-darkness-RDco8MTpZbQ",
       "source": "Unsplash"
      }
     }
    ],
    "image": "assets/catalog-images/bulbs-lights-2b7e2f.webp",
    "imageUrl": "https://images.unsplash.com/photo-1765148687603-661834433aae?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "Shahraiz Tabassam",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/a-lit-candle-shaped-light-bulb-in-darkness-RDco8MTpZbQ",
     "source": "Unsplash"
    }
   },
   {
    "name": "Fans & Motors",
    "items": [
     {
      "name": "Ceiling Fan 56 inch",
      "unit": "piece",
      "price": 9800,
      "icon": "🌀",
      "nameUrdu": "پنکھا",
      "image": "assets/catalog-images/ceiling-fan-b9f3c9.webp",
      "imageLevel": "item"
     },
     {
      "name": "Inverter Fan 56 inch",
      "unit": "piece",
      "price": 13800,
      "icon": "🌀",
      "imageUrl": "https://images.unsplash.com/photo-1609519479841-5fd3b2884e17?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Kalyanaraman S",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-5-blade-ceiling-fan-Ww9nZ1MGQLY",
       "source": "Unsplash"
      }
     },
     {
      "name": "Exhaust Fan 8 inch Plastic",
      "unit": "piece",
      "price": 2200,
      "icon": "💨",
      "imageUrl": "https://images.unsplash.com/photo-1652699160837-6471c565b440?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "nazanin mohammadi",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-round-window-with-a-fan-in-the-middle-of-it-E-bQQNMbI6k",
       "source": "Unsplash"
      }
     },
     {
      "name": "Exhaust Fan 12 inch Metal",
      "unit": "piece",
      "price": 4200,
      "icon": "💨",
      "imageUrl": "https://images.unsplash.com/photo-1652699160837-6471c565b440?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "nazanin mohammadi",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-round-window-with-a-fan-in-the-middle-of-it-E-bQQNMbI6k",
       "source": "Unsplash"
      }
     },
     {
      "name": "Bracket Fan 18 inch",
      "unit": "piece",
      "price": 6900,
      "icon": "🌀",
      "image": "assets/catalog-images/bracket-fan-v2-7b6b06.webp",
      "imageLevel": "item"
     },
     {
      "name": "Water Pump 1 HP",
      "unit": "piece",
      "price": 12500,
      "icon": "💧",
      "image": "assets/catalog-images/water-pump-1-hp-v2-062fbe.webp",
      "imageLevel": "item"
     },
     {
      "name": "Ceiling Fan Remote Kit",
      "unit": "piece",
      "price": 1350,
      "icon": "🎛️",
      "imageUrl": "https://images.unsplash.com/photo-1609519479841-5fd3b2884e17?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Kalyanaraman S",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-5-blade-ceiling-fan-Ww9nZ1MGQLY",
       "source": "Unsplash"
      }
     },
     {
      "name": "Motor Capacitor 4uF",
      "unit": "piece",
      "price": 220,
      "icon": "⚡"
     }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1609519479841-5fd3b2884e17?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "Kalyanaraman S",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/white-5-blade-ceiling-fan-Ww9nZ1MGQLY",
     "source": "Unsplash"
    }
   },
   {
    "name": "UPS, Inverter & Solar",
    "items": [
     {
      "name": "UPS 1000VA",
      "unit": "piece",
      "price": 28000,
      "icon": "🔋",
      "image": "assets/catalog-images/ups-1000va-e017ff.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1761472823286-9f6093ed6663?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Lara John",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/rainbow-over-a-suburban-neighborhood-with-solar-panels-VNIjztzKF_U",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "UPS 1500VA",
      "unit": "piece",
      "price": 38000,
      "icon": "🔋",
      "image": "assets/catalog-images/ups-1500va-a3b6f2.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1761472823286-9f6093ed6663?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Lara John",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/rainbow-over-a-suburban-neighborhood-with-solar-panels-VNIjztzKF_U",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Solar Inverter 1.2KVA",
      "unit": "piece",
      "price": 42000,
      "icon": "☀️",
      "image": "assets/catalog-images/ups-inverter-solar-f773d9.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1761472823286-9f6093ed6663?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Lara John",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/rainbow-over-a-suburban-neighborhood-with-solar-panels-VNIjztzKF_U",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Solar Inverter 3KVA",
      "unit": "piece",
      "price": 95000,
      "icon": "☀️",
      "image": "assets/catalog-images/ups-inverter-solar-f773d9.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1761472823286-9f6093ed6663?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Lara John",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/rainbow-over-a-suburban-neighborhood-with-solar-panels-VNIjztzKF_U",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Solar Panel 180W",
      "unit": "piece",
      "price": 16500,
      "icon": "☀️",
      "image": "assets/catalog-images/solar-panel-e3ac32.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1761472823286-9f6093ed6663?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Lara John",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/rainbow-over-a-suburban-neighborhood-with-solar-panels-VNIjztzKF_U",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Solar Panel 550W",
      "unit": "piece",
      "price": 42000,
      "icon": "☀️",
      "image": "assets/catalog-images/solar-panel-e3ac32.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1761472823286-9f6093ed6663?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Lara John",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/rainbow-over-a-suburban-neighborhood-with-solar-panels-VNIjztzKF_U",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "PWM Solar Charge Controller 30A",
      "unit": "piece",
      "price": 4500,
      "icon": "🎛️",
      "image": "assets/catalog-images/pwm-solar-charge-controller-28da1a.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1761472823286-9f6093ed6663?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Lara John",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/rainbow-over-a-suburban-neighborhood-with-solar-panels-VNIjztzKF_U",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "MPPT Solar Charge Controller 60A",
      "unit": "piece",
      "price": 28000,
      "icon": "🎛️",
      "image": "assets/catalog-images/mppt-solar-charge-controller-6edd02.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1761472823286-9f6093ed6663?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Lara John",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/rainbow-over-a-suburban-neighborhood-with-solar-panels-VNIjztzKF_U",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Dry Battery 100Ah",
      "unit": "piece",
      "price": 32000,
      "icon": "🔋",
      "image": "assets/catalog-images/ups-inverter-solar-f773d9.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1761472823286-9f6093ed6663?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Lara John",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/rainbow-over-a-suburban-neighborhood-with-solar-panels-VNIjztzKF_U",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Dry Battery 200Ah",
      "unit": "piece",
      "price": 58000,
      "icon": "🔋",
      "image": "assets/catalog-images/ups-inverter-solar-f773d9.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1761472823286-9f6093ed6663?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Lara John",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/rainbow-over-a-suburban-neighborhood-with-solar-panels-VNIjztzKF_U",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Tall Tubular Battery 230Ah",
      "unit": "piece",
      "price": 72000,
      "icon": "🔋",
      "image": "assets/catalog-images/ups-inverter-solar-f773d9.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1761472823286-9f6093ed6663?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Lara John",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/rainbow-over-a-suburban-neighborhood-with-solar-panels-VNIjztzKF_U",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "UPS Battery Trolley",
      "unit": "piece",
      "price": 2800,
      "icon": "🛒",
      "image": "assets/catalog-images/ups-inverter-solar-f773d9.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1761472823286-9f6093ed6663?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Lara John",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/rainbow-over-a-suburban-neighborhood-with-solar-panels-VNIjztzKF_U",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Battery Terminal Clamp Pair",
      "unit": "piece",
      "price": 450,
      "icon": "🔗",
      "image": "assets/catalog-images/battery-terminal-clamp-287075.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1761472823286-9f6093ed6663?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Lara John",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/rainbow-over-a-suburban-neighborhood-with-solar-panels-VNIjztzKF_U",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Solar Panel Mounting Stand",
      "unit": "piece",
      "price": 6500,
      "icon": "🔧",
      "image": "assets/catalog-images/solar-panel-mounting-stand-8f1985.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1761472823286-9f6093ed6663?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Lara John",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/rainbow-over-a-suburban-neighborhood-with-solar-panels-VNIjztzKF_U",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "DC Ceiling Fan 12V",
      "unit": "piece",
      "price": 8500,
      "icon": "🌀",
      "image": "assets/catalog-images/dc-ceiling-fan-76443f.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1761472823286-9f6093ed6663?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Lara John",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/rainbow-over-a-suburban-neighborhood-with-solar-panels-VNIjztzKF_U",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Solar Flood Light 100W",
      "unit": "piece",
      "price": 12500,
      "icon": "🔦",
      "image": "assets/catalog-images/solar-flood-light-fe58b7.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1761472823286-9f6093ed6663?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Lara John",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/rainbow-over-a-suburban-neighborhood-with-solar-panels-VNIjztzKF_U",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     }
    ],
    "image": "assets/catalog-images/ups-inverter-solar-f773d9.webp",
    "imageUrl": "https://images.unsplash.com/photo-1761472823286-9f6093ed6663?w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Lara John",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/rainbow-over-a-suburban-neighborhood-with-solar-panels-VNIjztzKF_U",
     "source": "Unsplash"
    }
   }
  ]
 },
 {
  "shopType": "Hardware & Paint",
  "icon": "🔧",
  "categories": [
   {
    "name": "Hand Tools",
    "items": [
     {
      "name": "Claw Hammer",
      "unit": "piece",
      "price": 650,
      "icon": "🔨",
      "nameUrdu": "ہتھوڑا",
      "image": "assets/catalog-images/claw-hammer-3e8c08.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/reserve/oIpwxeeSPy1cnwYpqJ1w_Dufer%20Collateral%20test.jpg?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Todd Quackenbush",
       "profileUrl": "https://unsplash.com/@toddquackenbush",
       "photoUrl": "https://unsplash.com/photos/vintage-tools-on-dark-wooden-planks-IClZBVw5W5A",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/IClZBVw5W5A/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww"
     },
     {
      "name": "Ball Pein Hammer 500g",
      "unit": "piece",
      "price": 750,
      "icon": "🔨",
      "imageUrl": "https://images.unsplash.com/reserve/oIpwxeeSPy1cnwYpqJ1w_Dufer%20Collateral%20test.jpg?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Todd Quackenbush",
       "profileUrl": "https://unsplash.com/@toddquackenbush",
       "photoUrl": "https://unsplash.com/photos/vintage-tools-on-dark-wooden-planks-IClZBVw5W5A",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/IClZBVw5W5A/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww"
     },
     {
      "name": "Screwdriver Set 6pc",
      "unit": "piece",
      "price": 950,
      "icon": "🪛",
      "image": "assets/catalog-images/screwdriver-v2-170531.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/reserve/oIpwxeeSPy1cnwYpqJ1w_Dufer%20Collateral%20test.jpg?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Todd Quackenbush",
       "profileUrl": "https://unsplash.com/@toddquackenbush",
       "photoUrl": "https://unsplash.com/photos/vintage-tools-on-dark-wooden-planks-IClZBVw5W5A",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/IClZBVw5W5A/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww"
     },
     {
      "name": "Flat Screwdriver 6 inch",
      "unit": "piece",
      "price": 220,
      "icon": "🪛",
      "image": "assets/catalog-images/flat-screwdriver-v2-25e39a.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/reserve/oIpwxeeSPy1cnwYpqJ1w_Dufer%20Collateral%20test.jpg?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Todd Quackenbush",
       "profileUrl": "https://unsplash.com/@toddquackenbush",
       "photoUrl": "https://unsplash.com/photos/vintage-tools-on-dark-wooden-planks-IClZBVw5W5A",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/IClZBVw5W5A/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww"
     },
     {
      "name": "Star Screwdriver Set 5pc",
      "unit": "piece",
      "price": 850,
      "icon": "🪛",
      "image": "assets/catalog-images/star-screwdriver-15258c.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/reserve/oIpwxeeSPy1cnwYpqJ1w_Dufer%20Collateral%20test.jpg?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Todd Quackenbush",
       "profileUrl": "https://unsplash.com/@toddquackenbush",
       "photoUrl": "https://unsplash.com/photos/vintage-tools-on-dark-wooden-planks-IClZBVw5W5A",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/IClZBVw5W5A/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww"
     },
     {
      "name": "Adjustable Wrench 10 inch",
      "unit": "piece",
      "price": 950,
      "icon": "🔧",
      "image": "assets/catalog-images/adjustable-wrench-0a279a.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/reserve/oIpwxeeSPy1cnwYpqJ1w_Dufer%20Collateral%20test.jpg?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Todd Quackenbush",
       "profileUrl": "https://unsplash.com/@toddquackenbush",
       "photoUrl": "https://unsplash.com/photos/vintage-tools-on-dark-wooden-planks-IClZBVw5W5A",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/IClZBVw5W5A/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww"
     },
     {
      "name": "Adjustable Wrench 12 inch",
      "unit": "piece",
      "price": 1250,
      "icon": "🔧",
      "image": "assets/catalog-images/adjustable-wrench-0a279a.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/reserve/oIpwxeeSPy1cnwYpqJ1w_Dufer%20Collateral%20test.jpg?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Todd Quackenbush",
       "profileUrl": "https://unsplash.com/@toddquackenbush",
       "photoUrl": "https://unsplash.com/photos/vintage-tools-on-dark-wooden-planks-IClZBVw5W5A",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/IClZBVw5W5A/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww"
     },
     {
      "name": "Combination Plier 8 inch",
      "unit": "piece",
      "price": 750,
      "icon": "🪠",
      "image": "assets/catalog-images/combination-plier-056c95.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/reserve/oIpwxeeSPy1cnwYpqJ1w_Dufer%20Collateral%20test.jpg?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Todd Quackenbush",
       "profileUrl": "https://unsplash.com/@toddquackenbush",
       "photoUrl": "https://unsplash.com/photos/vintage-tools-on-dark-wooden-planks-IClZBVw5W5A",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/IClZBVw5W5A/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww"
     },
     {
      "name": "Long Nose Plier 8 inch",
      "unit": "piece",
      "price": 680,
      "icon": "🪠",
      "image": "assets/catalog-images/long-nose-plier-5d03b2.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/reserve/oIpwxeeSPy1cnwYpqJ1w_Dufer%20Collateral%20test.jpg?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Todd Quackenbush",
       "profileUrl": "https://unsplash.com/@toddquackenbush",
       "photoUrl": "https://unsplash.com/photos/vintage-tools-on-dark-wooden-planks-IClZBVw5W5A",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/IClZBVw5W5A/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww"
     },
     {
      "name": "Wire Cutter 6 inch",
      "unit": "piece",
      "price": 550,
      "icon": "✂️",
      "image": "assets/catalog-images/wire-cutter-34bbdc.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/reserve/oIpwxeeSPy1cnwYpqJ1w_Dufer%20Collateral%20test.jpg?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Todd Quackenbush",
       "profileUrl": "https://unsplash.com/@toddquackenbush",
       "photoUrl": "https://unsplash.com/photos/vintage-tools-on-dark-wooden-planks-IClZBVw5W5A",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/IClZBVw5W5A/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww"
     },
     {
      "name": "Cutting Plier 8 inch",
      "unit": "piece",
      "price": 720,
      "icon": "🪠",
      "image": "assets/catalog-images/cutting-plier-c2ef42.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/reserve/oIpwxeeSPy1cnwYpqJ1w_Dufer%20Collateral%20test.jpg?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Todd Quackenbush",
       "profileUrl": "https://unsplash.com/@toddquackenbush",
       "photoUrl": "https://unsplash.com/photos/vintage-tools-on-dark-wooden-planks-IClZBVw5W5A",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/IClZBVw5W5A/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww"
     },
     {
      "name": "Measuring Tape 5m",
      "unit": "piece",
      "price": 450,
      "icon": "📏",
      "image": "assets/catalog-images/measuring-tape-5m-d91aa8.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/reserve/oIpwxeeSPy1cnwYpqJ1w_Dufer%20Collateral%20test.jpg?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Todd Quackenbush",
       "profileUrl": "https://unsplash.com/@toddquackenbush",
       "photoUrl": "https://unsplash.com/photos/vintage-tools-on-dark-wooden-planks-IClZBVw5W5A",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/IClZBVw5W5A/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww"
     },
     {
      "name": "Spirit Level 12 inch",
      "unit": "piece",
      "price": 650,
      "icon": "📐",
      "image": "assets/catalog-images/spirit-level-438d1f.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/reserve/oIpwxeeSPy1cnwYpqJ1w_Dufer%20Collateral%20test.jpg?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Todd Quackenbush",
       "profileUrl": "https://unsplash.com/@toddquackenbush",
       "photoUrl": "https://unsplash.com/photos/vintage-tools-on-dark-wooden-planks-IClZBVw5W5A",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/IClZBVw5W5A/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww"
     },
     {
      "name": "Hacksaw Frame",
      "unit": "piece",
      "price": 550,
      "icon": "🪚",
      "image": "assets/catalog-images/hacksaw-frame-eb7439.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/reserve/oIpwxeeSPy1cnwYpqJ1w_Dufer%20Collateral%20test.jpg?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Todd Quackenbush",
       "profileUrl": "https://unsplash.com/@toddquackenbush",
       "photoUrl": "https://unsplash.com/photos/vintage-tools-on-dark-wooden-planks-IClZBVw5W5A",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/IClZBVw5W5A/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww"
     },
     {
      "name": "Hacksaw Blade 12 inch 10-pack",
      "unit": "packet",
      "price": 350,
      "icon": "🪚",
      "image": "assets/catalog-images/hacksaw-blade-10-d3ba2b.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/reserve/oIpwxeeSPy1cnwYpqJ1w_Dufer%20Collateral%20test.jpg?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Todd Quackenbush",
       "profileUrl": "https://unsplash.com/@toddquackenbush",
       "photoUrl": "https://unsplash.com/photos/vintage-tools-on-dark-wooden-planks-IClZBVw5W5A",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/IClZBVw5W5A/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww"
     },
     {
      "name": "Allen Key Set 9pc",
      "unit": "piece",
      "price": 750,
      "icon": "🔩",
      "image": "assets/catalog-images/allen-key-8cd5b2.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/reserve/oIpwxeeSPy1cnwYpqJ1w_Dufer%20Collateral%20test.jpg?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Todd Quackenbush",
       "profileUrl": "https://unsplash.com/@toddquackenbush",
       "photoUrl": "https://unsplash.com/photos/vintage-tools-on-dark-wooden-planks-IClZBVw5W5A",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/IClZBVw5W5A/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww"
     },
     {
      "name": "Spanner Set 14pc",
      "unit": "piece",
      "price": 2450,
      "icon": "🔧",
      "image": "assets/catalog-images/spanner-v2-09434f.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/reserve/oIpwxeeSPy1cnwYpqJ1w_Dufer%20Collateral%20test.jpg?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Todd Quackenbush",
       "profileUrl": "https://unsplash.com/@toddquackenbush",
       "photoUrl": "https://unsplash.com/photos/vintage-tools-on-dark-wooden-planks-IClZBVw5W5A",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/IClZBVw5W5A/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww"
     },
     {
      "name": "Pipe Wrench 14 inch",
      "unit": "piece",
      "price": 1450,
      "icon": "🔧",
      "image": "assets/catalog-images/pipe-wrench-v2-49a0c6.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/reserve/oIpwxeeSPy1cnwYpqJ1w_Dufer%20Collateral%20test.jpg?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Todd Quackenbush",
       "profileUrl": "https://unsplash.com/@toddquackenbush",
       "photoUrl": "https://unsplash.com/photos/vintage-tools-on-dark-wooden-planks-IClZBVw5W5A",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/IClZBVw5W5A/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww"
     },
     {
      "name": "Wire Stripper Tool",
      "unit": "piece",
      "price": 450,
      "icon": "✂️",
      "image": "assets/catalog-images/wire-stripper-tool-5d748c.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/reserve/oIpwxeeSPy1cnwYpqJ1w_Dufer%20Collateral%20test.jpg?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Todd Quackenbush",
       "profileUrl": "https://unsplash.com/@toddquackenbush",
       "photoUrl": "https://unsplash.com/photos/vintage-tools-on-dark-wooden-planks-IClZBVw5W5A",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/IClZBVw5W5A/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww"
     }
    ],
    "imageUrl": "https://images.unsplash.com/reserve/oIpwxeeSPy1cnwYpqJ1w_Dufer%20Collateral%20test.jpg?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8SGFuZCUyMFRvb2xzfGVufDF8fHx8MTc5MjI1NTUzMXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Todd Quackenbush",
     "profileUrl": "https://unsplash.com/@toddquackenbush",
     "photoUrl": "https://unsplash.com/photos/vintage-tools-on-dark-wooden-planks-IClZBVw5W5A",
     "source": "Unsplash"
    }
   },
   {
    "name": "Power Tools",
    "items": [
     {
      "name": "Drill Machine 13mm",
      "unit": "piece",
      "price": 6500,
      "icon": "🔩",
      "image": "assets/catalog-images/drill-machine-a0d256.webp",
      "imageLevel": "item"
     },
     {
      "name": "Angle Grinder 4 inch",
      "unit": "piece",
      "price": 5200,
      "icon": "⚙️",
      "image": "assets/catalog-images/angle-grinder-d8eb1c.webp",
      "imageLevel": "item"
     },
     {
      "name": "Jigsaw Machine",
      "unit": "piece",
      "price": 7800,
      "icon": "🪚",
      "imageUrl": "https://images.unsplash.com/photo-1610890753500-96a56a672120?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Finn Mund",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/coca-cola-bottle-on-brown-wooden-table-BJzPjzWxc3E",
       "source": "Unsplash"
      }
     },
     {
      "name": "Heat Gun",
      "unit": "piece",
      "price": 3450,
      "icon": "🔥",
      "image": "assets/catalog-images/heat-gun-5dc78f.webp",
      "imageLevel": "item"
     },
     {
      "name": "Electric Blower",
      "unit": "piece",
      "price": 3850,
      "icon": "💨",
      "image": "assets/catalog-images/electric-blower-592b7c.webp",
      "imageLevel": "item"
     },
     {
      "name": "Rotary Tool Kit",
      "unit": "piece",
      "price": 4950,
      "icon": "⚙️",
      "image": "assets/catalog-images/rotary-tool-kit-9771b9.webp",
      "imageLevel": "item"
     },
     {
      "name": "HSS Drill Bit Set 13pc",
      "unit": "piece",
      "price": 1450,
      "icon": "🔩",
      "image": "assets/catalog-images/power-tools-b88461.webp",
      "imageLevel": "category"
     },
     {
      "name": "Grinder Cutting Disc 4 inch 5-pack",
      "unit": "packet",
      "price": 550,
      "icon": "💿",
      "image": "assets/catalog-images/grinder-cutting-v2-6c01f4.webp",
      "imageLevel": "item"
     },
     {
      "name": "Soldering Iron 60W",
      "unit": "piece",
      "price": 750,
      "icon": "🔥",
      "image": "assets/catalog-images/soldering-iron-v2-f09e96.webp",
      "imageLevel": "item"
     },
     {
      "name": "Caulking Gun",
      "unit": "piece",
      "price": 850,
      "icon": "🔫"
     }
    ],
    "image": "assets/catalog-images/power-tools-b88461.webp"
   },
   {
    "name": "Locks & Door Fittings",
    "items": [
     {
      "name": "Door Handle Lock Set",
      "unit": "piece",
      "price": 2450,
      "icon": "🔒",
      "image": "assets/catalog-images/door-handle-lock-258d67.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1555529902-5261145633bf?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zaqy Al Fattah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/silver-padlock-Lexcm-6FHRU",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Deadbolt Lock",
      "unit": "piece",
      "price": 1450,
      "icon": "🔒",
      "image": "assets/catalog-images/deadbolt-lock-aa0f54.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1555529902-5261145633bf?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zaqy Al Fattah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/silver-padlock-Lexcm-6FHRU",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Padlock 40mm",
      "unit": "piece",
      "price": 550,
      "icon": "🔒",
      "image": "assets/catalog-images/padlock-d618d9.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1555529902-5261145633bf?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zaqy Al Fattah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/silver-padlock-Lexcm-6FHRU",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Padlock 50mm",
      "unit": "piece",
      "price": 750,
      "icon": "🔒",
      "image": "assets/catalog-images/padlock-d618d9.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1555529902-5261145633bf?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zaqy Al Fattah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/silver-padlock-Lexcm-6FHRU",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Padlock 63mm",
      "unit": "piece",
      "price": 1050,
      "icon": "🔒",
      "image": "assets/catalog-images/padlock-d618d9.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1555529902-5261145633bf?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zaqy Al Fattah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/silver-padlock-Lexcm-6FHRU",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Drawer Lock",
      "unit": "piece",
      "price": 350,
      "icon": "🔒",
      "image": "assets/catalog-images/drawer-lock-2238fa.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1555529902-5261145633bf?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zaqy Al Fattah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/silver-padlock-Lexcm-6FHRU",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Sliding Door Lock",
      "unit": "piece",
      "price": 850,
      "icon": "🔒",
      "image": "assets/catalog-images/sliding-door-lock-3ca5fe.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1555529902-5261145633bf?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zaqy Al Fattah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/silver-padlock-Lexcm-6FHRU",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Cabinet Hinges Pair",
      "unit": "piece",
      "price": 280,
      "icon": "🚪",
      "image": "assets/catalog-images/cabinet-hinges-d0cb49.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1555529902-5261145633bf?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zaqy Al Fattah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/silver-padlock-Lexcm-6FHRU",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Door Hinges 4 inch Pair",
      "unit": "piece",
      "price": 450,
      "icon": "🚪",
      "image": "assets/catalog-images/door-hinges-c7391e.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1555529902-5261145633bf?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zaqy Al Fattah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/silver-padlock-Lexcm-6FHRU",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Tower Bolt 6 inch",
      "unit": "piece",
      "price": 320,
      "icon": "🔩",
      "image": "assets/catalog-images/tower-bolt-75bf6c.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1555529902-5261145633bf?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zaqy Al Fattah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/silver-padlock-Lexcm-6FHRU",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Tower Bolt 10 inch",
      "unit": "piece",
      "price": 480,
      "icon": "🔩",
      "image": "assets/catalog-images/tower-bolt-75bf6c.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1555529902-5261145633bf?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zaqy Al Fattah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/silver-padlock-Lexcm-6FHRU",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Door Chain Guard",
      "unit": "piece",
      "price": 380,
      "icon": "⛓️",
      "image": "assets/catalog-images/door-chain-guard-4cb862.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1555529902-5261145633bf?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zaqy Al Fattah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/silver-padlock-Lexcm-6FHRU",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Door Eye Viewer",
      "unit": "piece",
      "price": 450,
      "icon": "👁️",
      "image": "assets/catalog-images/door-eye-viewer-008a56.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1555529902-5261145633bf?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zaqy Al Fattah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/silver-padlock-Lexcm-6FHRU",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Magnetic Door Catcher Pair",
      "unit": "piece",
      "price": 250,
      "icon": "🧲",
      "image": "assets/catalog-images/locks-door-fittings-536a19.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1555529902-5261145633bf?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zaqy Al Fattah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/silver-padlock-Lexcm-6FHRU",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Cabinet Handle 128mm",
      "unit": "piece",
      "price": 220,
      "icon": "🚪",
      "image": "assets/catalog-images/cabinet-handle-v2-849469.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1555529902-5261145633bf?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zaqy Al Fattah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/silver-padlock-Lexcm-6FHRU",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Door Stopper Rubber",
      "unit": "piece",
      "price": 150,
      "icon": "🛑",
      "image": "assets/catalog-images/locks-door-fittings-536a19.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1555529902-5261145633bf?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Zaqy Al Fattah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/silver-padlock-Lexcm-6FHRU",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     }
    ],
    "image": "assets/catalog-images/locks-door-fittings-536a19.webp",
    "imageUrl": "https://images.unsplash.com/photo-1555529902-5261145633bf?w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Zaqy Al Fattah",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/silver-padlock-Lexcm-6FHRU",
     "source": "Unsplash"
    }
   },
   {
    "name": "Paints",
    "items": [
     {
      "name": "Plastic Emulsion 4L",
      "unit": "litre",
      "price": 2200,
      "icon": "🎨",
      "nameUrdu": "رنگ",
      "image": "assets/catalog-images/plastic-emulsion-v2-c60e75.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1585676737728-432f58d5fdba?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Sven Brandsma",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/blue-and-white-can-on-white-table-kerFMg52cUA",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Plastic Emulsion 15L Bucket",
      "unit": "piece",
      "price": 7800,
      "icon": "🪣",
      "image": "assets/catalog-images/paints-a3ed19.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1585676737728-432f58d5fdba?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Sven Brandsma",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/blue-and-white-can-on-white-table-kerFMg52cUA",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Enamel Paint 1L",
      "unit": "litre",
      "price": 950,
      "icon": "🎨",
      "image": "assets/catalog-images/enamel-paint-f45fb8.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1585676737728-432f58d5fdba?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGFpbnQlMjBjYW4lMjBhbmQlMjBicnVzaHxlbnwxfHx8fDE3OTIyNTU1MDF8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Sven Brandsma",
       "profileUrl": "https://unsplash.com/@seffen99",
       "photoUrl": "https://unsplash.com/photos/blue-and-white-can-on-white-table-kerFMg52cUA",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/kerFMg52cUA/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGFpbnQlMjBjYW4lMjBhbmQlMjBicnVzaHxlbnwxfHx8fDE3OTIyNTU1MDF8MA",
      "imageSource": "unsplash"
     },
     {
      "name": "Enamel Paint 4L",
      "unit": "litre",
      "price": 3400,
      "icon": "🎨",
      "image": "assets/catalog-images/enamel-paint-f45fb8.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1585676737728-432f58d5fdba?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Sven Brandsma",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/blue-and-white-can-on-white-table-kerFMg52cUA",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Weather Shield 4L",
      "unit": "litre",
      "price": 4200,
      "icon": "🏠",
      "image": "assets/catalog-images/weather-shield-ea9962.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1585676737728-432f58d5fdba?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Sven Brandsma",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/blue-and-white-can-on-white-table-kerFMg52cUA",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Distemper 20kg Bag",
      "unit": "piece",
      "price": 2800,
      "icon": "🎨"
     },
     {
      "name": "Wall Putty 20kg Bag",
      "unit": "piece",
      "price": 1650,
      "icon": "🧱"
     },
     {
      "name": "Wall Primer 1L",
      "unit": "litre",
      "price": 650,
      "icon": "🎨",
      "image": "assets/catalog-images/wall-primer-1cb17a.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1585676737728-432f58d5fdba?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Sven Brandsma",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/blue-and-white-can-on-white-table-kerFMg52cUA",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Wall Primer 4L",
      "unit": "litre",
      "price": 2300,
      "icon": "🎨",
      "image": "assets/catalog-images/wall-primer-1cb17a.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1585676737728-432f58d5fdba?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Sven Brandsma",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/blue-and-white-can-on-white-table-kerFMg52cUA",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Wood Varnish 1L",
      "unit": "litre",
      "price": 1250,
      "icon": "🪵"
     },
     {
      "name": "Paint Thinner 1L",
      "unit": "litre",
      "price": 550,
      "icon": "🧴"
     },
     {
      "name": "Turpentine Oil 1L",
      "unit": "litre",
      "price": 750,
      "icon": "🧴",
      "image": "assets/catalog-images/turpentine-oil-25f3ed.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1718210719917-c6e1cd5be085?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGFpbnQlMjB0aGlubmVyJTIwYm90dGxlfGVufDF8fHx8MTc5MjI1NTUxNHww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Kedibone Isaac Makhumisane",
       "profileUrl": "https://unsplash.com/@isaax_the_artist",
       "photoUrl": "https://unsplash.com/photos/a-glass-bottle-with-water-inside-of-it-IuPRQCp5LFE",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/IuPRQCp5LFE/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8cGFpbnQlMjB0aGlubmVyJTIwYm90dGxlfGVufDF8fHx8MTc5MjI1NTUxNHww",
      "imageSource": "unsplash"
     },
     {
      "name": "Paint Roller 9 inch",
      "unit": "piece",
      "price": 350,
      "icon": "🖌️",
      "image": "assets/catalog-images/paints-a3ed19.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1652829069862-87874e119527?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Callum Hill",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-close-up-of-a-paint-roller-on-a-paint-roller-jo4CWjIw4Wc",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Paint Brush 2 inch",
      "unit": "piece",
      "price": 180,
      "icon": "🖌️",
      "image": "assets/catalog-images/paint-brush-1707fe.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1777566865793-525ad69ad83e?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Smithsonian",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-collection-of-assorted-paintbrushes-on-a-black-background-doi92UOW-5c",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Paint Brush 4 inch",
      "unit": "piece",
      "price": 320,
      "icon": "🖌️",
      "image": "assets/catalog-images/paint-brush-1707fe.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1777566865793-525ad69ad83e?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Smithsonian",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-collection-of-assorted-paintbrushes-on-a-black-background-doi92UOW-5c",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Spray Paint Can 400ml",
      "unit": "piece",
      "price": 650,
      "icon": "🎨",
      "image": "assets/catalog-images/spray-paint-can-31c649.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1760694030733-f2edb6e8481b?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Marija Zaric",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/black-spray-paint-can-on-a-wooden-surface-outdoors-table-cFUuK03snkk",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Paint Tray 9 inch",
      "unit": "piece",
      "price": 280,
      "icon": "🖌️",
      "image": "assets/catalog-images/paint-tray-4edcc3.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1652829069862-87874e119527?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Callum Hill",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-close-up-of-a-paint-roller-on-a-paint-roller-jo4CWjIw4Wc",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Putty Knife 3 inch",
      "unit": "piece",
      "price": 250,
      "icon": "🔪"
     }
    ],
    "image": "assets/catalog-images/paints-a3ed19.webp",
    "imageUrl": "https://images.unsplash.com/photo-1585676737728-432f58d5fdba?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "Sven Brandsma",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/blue-and-white-can-on-white-table-kerFMg52cUA",
     "source": "Unsplash"
    }
   },
   {
    "name": "Fasteners & Consumables",
    "items": [
     {
      "name": "Wood Screws 1 inch 100pc",
      "unit": "packet",
      "price": 350,
      "icon": "🔩",
      "image": "assets/catalog-images/wood-screws-7bffef.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1613945831677-383c19ad7721?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Milad Fallah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/silver-screw-lot-on-brown-wooden-table-wwZYL4BYFto",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Wood Screws 2 inch 100pc",
      "unit": "packet",
      "price": 450,
      "icon": "🔩",
      "image": "assets/catalog-images/wood-screws-7bffef.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1613945831677-383c19ad7721?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Milad Fallah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/silver-screw-lot-on-brown-wooden-table-wwZYL4BYFto",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Gypsum Screws 1 inch 100pc",
      "unit": "packet",
      "price": 400,
      "icon": "🔩",
      "image": "assets/catalog-images/fasteners-consumables-2b2be3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1613945831677-383c19ad7721?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Milad Fallah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/silver-screw-lot-on-brown-wooden-table-wwZYL4BYFto",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Nails 2 inch 1kg",
      "unit": "kg",
      "price": 320,
      "icon": "📌",
      "image": "assets/catalog-images/nails-c63e24.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1613945831677-383c19ad7721?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Milad Fallah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/silver-screw-lot-on-brown-wooden-table-wwZYL4BYFto",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Nails 3 inch 1kg",
      "unit": "kg",
      "price": 320,
      "icon": "📌",
      "image": "assets/catalog-images/nails-c63e24.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1613945831677-383c19ad7721?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Milad Fallah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/silver-screw-lot-on-brown-wooden-table-wwZYL4BYFto",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Wall Plugs 100pc",
      "unit": "packet",
      "price": 300,
      "icon": "🔩",
      "image": "assets/catalog-images/wall-plugs-v2-f3549c.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1613945831677-383c19ad7721?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Milad Fallah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/silver-screw-lot-on-brown-wooden-table-wwZYL4BYFto",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Expansion Bolts M8 10pc",
      "unit": "packet",
      "price": 650,
      "icon": "🔩",
      "image": "assets/catalog-images/fasteners-consumables-2b2be3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1613945831677-383c19ad7721?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Milad Fallah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/silver-screw-lot-on-brown-wooden-table-wwZYL4BYFto",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Cable Clips 100pc",
      "unit": "packet",
      "price": 250,
      "icon": "🔗",
      "image": "assets/catalog-images/cable-clips-ded498.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1613945831677-383c19ad7721?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Milad Fallah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/silver-screw-lot-on-brown-wooden-table-wwZYL4BYFto",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Super Glue 20g",
      "unit": "gram",
      "price": 150,
      "icon": "🧴",
      "image": "assets/catalog-images/fasteners-consumables-2b2be3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1613945831677-383c19ad7721?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Milad Fallah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/silver-screw-lot-on-brown-wooden-table-wwZYL4BYFto",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "M-Seal Epoxy 100g",
      "unit": "gram",
      "price": 280,
      "icon": "🧪",
      "image": "assets/catalog-images/fasteners-consumables-2b2be3.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1613945831677-383c19ad7721?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Milad Fallah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/silver-screw-lot-on-brown-wooden-table-wwZYL4BYFto",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Sandpaper 100 Grit 10-sheet",
      "unit": "packet",
      "price": 250,
      "icon": "📄",
      "image": "assets/catalog-images/sandpaper-100-grit-10-aa904d.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1613945831677-383c19ad7721?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Milad Fallah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/silver-screw-lot-on-brown-wooden-table-wwZYL4BYFto",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Steel Wire Brush",
      "unit": "piece",
      "price": 220,
      "icon": "🧹",
      "image": "assets/catalog-images/steel-wire-brush-848c2c.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1613945831677-383c19ad7721?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Milad Fallah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/silver-screw-lot-on-brown-wooden-table-wwZYL4BYFto",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "G Clamp 4 inch",
      "unit": "piece",
      "price": 550,
      "icon": "🗜️",
      "image": "assets/catalog-images/g-clamp-0568d9.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1613945831677-383c19ad7721?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Milad Fallah",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/silver-screw-lot-on-brown-wooden-table-wwZYL4BYFto",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     }
    ],
    "image": "assets/catalog-images/fasteners-consumables-2b2be3.webp",
    "imageUrl": "https://images.unsplash.com/photo-1613945831677-383c19ad7721?w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Milad Fallah",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/silver-screw-lot-on-brown-wooden-table-wwZYL4BYFto",
     "source": "Unsplash"
    }
   },
   {
    "name": "Sanitary & Plumbing",
    "items": [
     {
      "name": "PVC Pipe 1 inch 10ft",
      "unit": "piece",
      "price": 850,
      "icon": "🚿",
      "imageUrl": "https://images.unsplash.com/photo-1729169927271-7826d8aae360?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Ries Bosch",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-pile-of-pipes-sitting-next-to-each-other-B0jijv2X-U8",
       "source": "Unsplash"
      }
     },
     {
      "name": "PVC Pipe 3/4 inch 10ft",
      "unit": "piece",
      "price": 650,
      "icon": "🚿",
      "imageUrl": "https://images.unsplash.com/photo-1729169927271-7826d8aae360?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Ries Bosch",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-pile-of-pipes-sitting-next-to-each-other-B0jijv2X-U8",
       "source": "Unsplash"
      }
     },
     {
      "name": "PVC Elbow 1 inch",
      "unit": "piece",
      "price": 80,
      "icon": "🔧",
      "image": "assets/catalog-images/pvc-elbow-8c97b5.webp",
      "imageLevel": "item"
     },
     {
      "name": "PVC Tee 1 inch",
      "unit": "piece",
      "price": 95,
      "icon": "🔧",
      "image": "assets/catalog-images/pvc-tee-baf94b.webp",
      "imageLevel": "item"
     },
     {
      "name": "PVC Solvent Cement 100g",
      "unit": "gram",
      "price": 220,
      "icon": "🧴"
     },
     {
      "name": "Brass Bib Tap",
      "unit": "piece",
      "price": 1250,
      "icon": "🚰",
      "imageUrl": "https://images.unsplash.com/photo-1603786996183-308332c02fd9?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Nadia Clabassi",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/brass-faucet-on-white-ceramic-sink-BmtKI0J7ZtM",
       "source": "Unsplash"
      }
     },
     {
      "name": "Angle Cock Valve",
      "unit": "piece",
      "price": 850,
      "icon": "🚰"
     },
     {
      "name": "Muslim Shower Set",
      "unit": "piece",
      "price": 1450,
      "icon": "🚿"
     },
     {
      "name": "Basin Waste Coupling",
      "unit": "piece",
      "price": 550,
      "icon": "🚰"
     },
     {
      "name": "PPR Pipe 1 inch 12ft",
      "unit": "piece",
      "price": 1450,
      "icon": "🚿",
      "imageUrl": "https://images.unsplash.com/photo-1729169927271-7826d8aae360?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Ries Bosch",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-pile-of-pipes-sitting-next-to-each-other-B0jijv2X-U8",
       "source": "Unsplash"
      }
     },
     {
      "name": "PPR Elbow 1 inch",
      "unit": "piece",
      "price": 120,
      "icon": "🔧"
     },
     {
      "name": "Shower Head ABS",
      "unit": "piece",
      "price": 950,
      "icon": "🚿",
      "imageUrl": "https://images.unsplash.com/photo-1697652973421-0d688f661d89?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Caleb Wright",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-close-up-of-a-shower-head-in-a-bathroom-LwN3p1vkVG4",
       "source": "Unsplash"
      }
     }
    ],
    "image": "assets/catalog-images/sanitary-plumbing-fa9668.webp",
    "imageUrl": "https://images.unsplash.com/photo-1697652973421-0d688f661d89?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "Caleb Wright",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/a-close-up-of-a-shower-head-in-a-bathroom-LwN3p1vkVG4",
     "source": "Unsplash"
    }
   },
   {
    "name": "Ladders & Access",
    "items": [
     {
      "name": "Step Ladder 4ft",
      "unit": "piece",
      "price": 4200,
      "icon": "🪜",
      "image": "assets/catalog-images/step-ladder-543088.webp",
      "imageLevel": "item"
     },
     {
      "name": "Aluminum Ladder 8ft",
      "unit": "piece",
      "price": 8500,
      "icon": "🪜",
      "image": "assets/catalog-images/aluminum-ladder-1b3831.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/ladders-access-0dc01d.webp"
   }
  ]
 },
 {
  "shopType": "Building Material",
  "icon": "🏗️",
  "categories": [
   {
    "name": "Cement",
    "items": [
     {
      "name": "Lucky Cement Bag 50kg",
      "unit": "piece",
      "price": 1380,
      "icon": "🏗️",
      "nameUrdu": "سیمنٹ",
      "imageUrl": "https://images.unsplash.com/photo-1773394089934-3e29f2a3d6a9?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Khanh Do",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/stacks-of-cement-bags-in-sunlight-0p70_HczZek",
       "source": "Unsplash"
      }
     },
     {
      "name": "DG Cement Bag 50kg",
      "unit": "piece",
      "price": 1370,
      "icon": "🏗️",
      "image": "assets/catalog-images/cement-5cb91a.webp",
      "imageLevel": "category"
     },
     {
      "name": "Maple Leaf Cement Bag 50kg",
      "unit": "piece",
      "price": 1360,
      "icon": "🏗️",
      "image": "assets/catalog-images/cement-5cb91a.webp",
      "imageLevel": "category"
     },
     {
      "name": "Bestway Cement Bag 50kg",
      "unit": "piece",
      "price": 1350,
      "icon": "🏗️",
      "image": "assets/catalog-images/cement-5cb91a.webp",
      "imageLevel": "category"
     },
     {
      "name": "Fauji Cement Bag 50kg",
      "unit": "piece",
      "price": 1360,
      "icon": "🏗️",
      "image": "assets/catalog-images/cement-5cb91a.webp",
      "imageLevel": "category"
     },
     {
      "name": "Pioneer Cement Bag 50kg",
      "unit": "piece",
      "price": 1340,
      "icon": "🏗️",
      "image": "assets/catalog-images/cement-5cb91a.webp",
      "imageLevel": "category"
     },
     {
      "name": "White Cement Bag 40kg",
      "unit": "piece",
      "price": 2200,
      "icon": "⬜",
      "imageUrl": "https://images.unsplash.com/photo-1773394089934-3e29f2a3d6a9?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Khanh Do",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/stacks-of-cement-bags-in-sunlight-0p70_HczZek",
       "source": "Unsplash"
      }
     },
     {
      "name": "Sulphate Resistant Cement 50kg",
      "unit": "piece",
      "price": 1450,
      "icon": "🏗️",
      "image": "assets/catalog-images/cement-5cb91a.webp",
      "imageLevel": "category"
     }
    ],
    "image": "assets/catalog-images/cement-5cb91a.webp"
   },
   {
    "name": "Bricks & Blocks",
    "items": [
     {
      "name": "First Class Bricks (Awwal)",
      "unit": "piece",
      "price": 26,
      "icon": "🧱",
      "nameUrdu": "اینٹ",
      "imageUrl": "https://images.unsplash.com/photo-1559322575-2f4e66131d55?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Matt W Newman",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/orange-brick-lot-TYiD9PaAHos",
       "source": "Unsplash"
      }
     },
     {
      "name": "Second Class Bricks",
      "unit": "piece",
      "price": 18,
      "icon": "🧱",
      "imageUrl": "https://images.unsplash.com/photo-1559322575-2f4e66131d55?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Matt W Newman",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/orange-brick-lot-TYiD9PaAHos",
       "source": "Unsplash"
      }
     },
     {
      "name": "Over-burnt Bricks",
      "unit": "piece",
      "price": 12,
      "icon": "🧱",
      "image": "assets/catalog-images/over-burnt-bricks-v2-a0e52a.webp",
      "imageLevel": "item"
     },
     {
      "name": "Concrete Block 4 inch",
      "unit": "piece",
      "price": 65,
      "icon": "🧱",
      "image": "assets/catalog-images/concrete-block-v2-f9a2d7.webp",
      "imageLevel": "item"
     },
     {
      "name": "Concrete Block 6 inch",
      "unit": "piece",
      "price": 85,
      "icon": "🧱",
      "image": "assets/catalog-images/concrete-block-v2-f9a2d7.webp",
      "imageLevel": "item"
     },
     {
      "name": "Concrete Block 8 inch",
      "unit": "piece",
      "price": 110,
      "icon": "🧱",
      "image": "assets/catalog-images/concrete-block-v2-f9a2d7.webp",
      "imageLevel": "item"
     },
     {
      "name": "Fly Ash Bricks",
      "unit": "piece",
      "price": 20,
      "icon": "🧱",
      "image": "assets/catalog-images/fly-ash-bricks-v2-d3ff97.webp",
      "imageLevel": "item"
     },
     {
      "name": "Roof Khaprail Tiles 100pc",
      "unit": "packet",
      "price": 9000,
      "icon": "🏠",
      "image": "assets/catalog-images/roof-khaprail-tiles-b8b631.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/bricks-blocks-b7e180.webp"
   },
   {
    "name": "Steel / Sarya",
    "items": [
     {
      "name": "Steel Bar 6mm (Sarya)",
      "unit": "kg",
      "price": 248,
      "icon": "🔩",
      "nameUrdu": "سریا",
      "imageUrl": "https://images.unsplash.com/photo-1623428454598-1bfe414bac03?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Mads Eneqvist",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-close-up-of-a-bunch-of-metal-rods-RxLjmG5M4NQ",
       "source": "Unsplash"
      }
     },
     {
      "name": "Steel Bar 8mm (Sarya)",
      "unit": "kg",
      "price": 250,
      "icon": "🔩",
      "imageUrl": "https://images.unsplash.com/photo-1623428454598-1bfe414bac03?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Mads Eneqvist",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-close-up-of-a-bunch-of-metal-rods-RxLjmG5M4NQ",
       "source": "Unsplash"
      }
     },
     {
      "name": "Steel Bar 10mm (Sarya)",
      "unit": "kg",
      "price": 255,
      "icon": "🔩",
      "imageUrl": "https://images.unsplash.com/photo-1623428454598-1bfe414bac03?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Mads Eneqvist",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-close-up-of-a-bunch-of-metal-rods-RxLjmG5M4NQ",
       "source": "Unsplash"
      }
     },
     {
      "name": "Steel Bar 12mm (Sarya)",
      "unit": "kg",
      "price": 260,
      "icon": "🔩",
      "imageUrl": "https://images.unsplash.com/photo-1623428454598-1bfe414bac03?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Mads Eneqvist",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-close-up-of-a-bunch-of-metal-rods-RxLjmG5M4NQ",
       "source": "Unsplash"
      }
     },
     {
      "name": "Steel Bar 16mm (Sarya)",
      "unit": "kg",
      "price": 262,
      "icon": "🔩",
      "imageUrl": "https://images.unsplash.com/photo-1623428454598-1bfe414bac03?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Mads Eneqvist",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-close-up-of-a-bunch-of-metal-rods-RxLjmG5M4NQ",
       "source": "Unsplash"
      }
     },
     {
      "name": "Steel Bar 20mm (Sarya)",
      "unit": "kg",
      "price": 265,
      "icon": "🔩",
      "imageUrl": "https://images.unsplash.com/photo-1623428454598-1bfe414bac03?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Mads Eneqvist",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-close-up-of-a-bunch-of-metal-rods-RxLjmG5M4NQ",
       "source": "Unsplash"
      }
     },
     {
      "name": "Binding Wire 1kg Coil",
      "unit": "kg",
      "price": 320,
      "icon": "🧵",
      "imageUrl": "https://images.unsplash.com/photo-1518994255497-c5f17690567f?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Daniel Fazio",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/gray-wire-lot-m9LlUwkPvT8",
       "source": "Unsplash"
      }
     },
     {
      "name": "MS Angle 1.5 inch 20ft",
      "unit": "piece",
      "price": 2400,
      "icon": "📐",
      "imageUrl": "https://images.unsplash.com/photo-1623428454598-1bfe414bac03?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Mads Eneqvist",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-close-up-of-a-bunch-of-metal-rods-RxLjmG5M4NQ",
       "source": "Unsplash"
      }
     }
    ]
   },
   {
    "name": "Sand & Crush",
    "items": [
     {
      "name": "Ravi Sand 100cft Load",
      "unit": "piece",
      "price": 24000,
      "icon": "🏖️",
      "nameUrdu": "ریت",
      "image": "assets/catalog-images/sand-crush-v2-2617f3.webp",
      "imageLevel": "category"
     },
     {
      "name": "Chenab Sand 100cft Load",
      "unit": "piece",
      "price": 26000,
      "icon": "🏖️",
      "image": "assets/catalog-images/sand-crush-v2-2617f3.webp",
      "imageLevel": "category"
     },
     {
      "name": "Margalla Crush 100cft Load",
      "unit": "piece",
      "price": 32000,
      "icon": "🪨",
      "image": "assets/catalog-images/sand-crush-v2-2617f3.webp",
      "imageLevel": "category"
     },
     {
      "name": "Sargodha Crush 100cft Load",
      "unit": "piece",
      "price": 28000,
      "icon": "🪨",
      "image": "assets/catalog-images/sand-crush-v2-2617f3.webp",
      "imageLevel": "category"
     },
     {
      "name": "Bajri 100cft Load",
      "unit": "piece",
      "price": 22000,
      "icon": "🪨",
      "image": "assets/catalog-images/sand-crush-v2-2617f3.webp",
      "imageLevel": "category"
     },
     {
      "name": "Stone Dust 100cft Load",
      "unit": "piece",
      "price": 14000,
      "icon": "🪨",
      "image": "assets/catalog-images/sand-crush-v2-2617f3.webp",
      "imageLevel": "category"
     }
    ],
    "image": "assets/catalog-images/sand-crush-v2-2617f3.webp"
   },
   {
    "name": "Tiles, Marble & Finishing",
    "items": [
     {
      "name": "Ceramic Floor Tile 24x24",
      "unit": "piece",
      "price": 180,
      "icon": "🟫",
      "image": "assets/catalog-images/tiles-marble-finishing-ba54f4.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1706629503586-2731f65587ae?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Tile Merchant Ireland",
       "profileUrl": "https://unsplash.com/@tilemerchant",
       "photoUrl": "https://unsplash.com/photos/three-chairs-sitting-on-a-marble-floor-in-a-room-v9oBtvRCKHk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/v9oBtvRCKHk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA",
      "imageSource": "unsplash"
     },
     {
      "name": "Ceramic Wall Tile 12x18",
      "unit": "piece",
      "price": 90,
      "icon": "🟫",
      "image": "assets/catalog-images/tiles-marble-finishing-ba54f4.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1706629503586-2731f65587ae?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Tile Merchant Ireland",
       "profileUrl": "https://unsplash.com/@tilemerchant",
       "photoUrl": "https://unsplash.com/photos/three-chairs-sitting-on-a-marble-floor-in-a-room-v9oBtvRCKHk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/v9oBtvRCKHk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA",
      "imageSource": "unsplash"
     },
     {
      "name": "Porcelain Tile 24x48",
      "unit": "piece",
      "price": 950,
      "icon": "🟫",
      "image": "assets/catalog-images/tiles-marble-finishing-ba54f4.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1706629503586-2731f65587ae?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Tile Merchant Ireland",
       "profileUrl": "https://unsplash.com/@tilemerchant",
       "photoUrl": "https://unsplash.com/photos/three-chairs-sitting-on-a-marble-floor-in-a-room-v9oBtvRCKHk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/v9oBtvRCKHk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA",
      "imageSource": "unsplash"
     },
     {
      "name": "Skirting Tile 4x24",
      "unit": "piece",
      "price": 140,
      "icon": "🟫",
      "image": "assets/catalog-images/tiles-marble-finishing-ba54f4.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1706629503586-2731f65587ae?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Tile Merchant Ireland",
       "profileUrl": "https://unsplash.com/@tilemerchant",
       "photoUrl": "https://unsplash.com/photos/three-chairs-sitting-on-a-marble-floor-in-a-room-v9oBtvRCKHk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/v9oBtvRCKHk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA",
      "imageSource": "unsplash"
     },
     {
      "name": "Mosaic Tile Sheet",
      "unit": "piece",
      "price": 350,
      "icon": "🎨",
      "image": "assets/catalog-images/mosaic-tile-sheet-e4ead3.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1706629503586-2731f65587ae?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Tile Merchant Ireland",
       "profileUrl": "https://unsplash.com/@tilemerchant",
       "photoUrl": "https://unsplash.com/photos/three-chairs-sitting-on-a-marble-floor-in-a-room-v9oBtvRCKHk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/v9oBtvRCKHk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA"
     },
     {
      "name": "White Marble per sq ft",
      "unit": "piece",
      "price": 180,
      "icon": "⬜",
      "image": "assets/catalog-images/tiles-marble-finishing-ba54f4.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1706629503586-2731f65587ae?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Tile Merchant Ireland",
       "profileUrl": "https://unsplash.com/@tilemerchant",
       "photoUrl": "https://unsplash.com/photos/three-chairs-sitting-on-a-marble-floor-in-a-room-v9oBtvRCKHk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/v9oBtvRCKHk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA",
      "imageSource": "unsplash"
     },
     {
      "name": "Black Granite per sq ft",
      "unit": "piece",
      "price": 450,
      "icon": "⬛",
      "image": "assets/catalog-images/tiles-marble-finishing-ba54f4.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1706629503586-2731f65587ae?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Tile Merchant Ireland",
       "profileUrl": "https://unsplash.com/@tilemerchant",
       "photoUrl": "https://unsplash.com/photos/three-chairs-sitting-on-a-marble-floor-in-a-room-v9oBtvRCKHk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/v9oBtvRCKHk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA",
      "imageSource": "unsplash"
     },
     {
      "name": "Marble Chips per sq ft",
      "unit": "piece",
      "price": 120,
      "icon": "🪨",
      "image": "assets/catalog-images/tiles-marble-finishing-ba54f4.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1706629503586-2731f65587ae?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Tile Merchant Ireland",
       "profileUrl": "https://unsplash.com/@tilemerchant",
       "photoUrl": "https://unsplash.com/photos/three-chairs-sitting-on-a-marble-floor-in-a-room-v9oBtvRCKHk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/v9oBtvRCKHk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA",
      "imageSource": "unsplash"
     },
     {
      "name": "Tile Bond Adhesive 20kg",
      "unit": "piece",
      "price": 900,
      "icon": "🧱",
      "image": "assets/catalog-images/tiles-marble-finishing-ba54f4.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1706629503586-2731f65587ae?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Tile Merchant Ireland",
       "profileUrl": "https://unsplash.com/@tilemerchant",
       "photoUrl": "https://unsplash.com/photos/three-chairs-sitting-on-a-marble-floor-in-a-room-v9oBtvRCKHk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/v9oBtvRCKHk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA",
      "imageSource": "unsplash"
     },
     {
      "name": "Tile Grout 1kg",
      "unit": "packet",
      "price": 120,
      "icon": "🧴",
      "image": "assets/catalog-images/tile-grout-02fe35.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1706629503586-2731f65587ae?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Tile Merchant Ireland",
       "profileUrl": "https://unsplash.com/@tilemerchant",
       "photoUrl": "https://unsplash.com/photos/three-chairs-sitting-on-a-marble-floor-in-a-room-v9oBtvRCKHk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/v9oBtvRCKHk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA"
     },
     {
      "name": "POP Bag 40kg",
      "unit": "piece",
      "price": 950,
      "icon": "⬜",
      "image": "assets/catalog-images/pop-bag-81e0ba.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1706629503586-2731f65587ae?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Tile Merchant Ireland",
       "profileUrl": "https://unsplash.com/@tilemerchant",
       "photoUrl": "https://unsplash.com/photos/three-chairs-sitting-on-a-marble-floor-in-a-room-v9oBtvRCKHk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/v9oBtvRCKHk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA"
     },
     {
      "name": "Gypsum Board 4x8",
      "unit": "piece",
      "price": 1450,
      "icon": "🟫",
      "image": "assets/catalog-images/tiles-marble-finishing-ba54f4.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1706629503586-2731f65587ae?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Tile Merchant Ireland",
       "profileUrl": "https://unsplash.com/@tilemerchant",
       "photoUrl": "https://unsplash.com/photos/three-chairs-sitting-on-a-marble-floor-in-a-room-v9oBtvRCKHk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/v9oBtvRCKHk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA",
      "imageSource": "unsplash"
     },
     {
      "name": "False Ceiling Tile 2x2",
      "unit": "piece",
      "price": 220,
      "icon": "⬜",
      "image": "assets/catalog-images/tiles-marble-finishing-ba54f4.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1706629503586-2731f65587ae?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Tile Merchant Ireland",
       "profileUrl": "https://unsplash.com/@tilemerchant",
       "photoUrl": "https://unsplash.com/photos/three-chairs-sitting-on-a-marble-floor-in-a-room-v9oBtvRCKHk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/v9oBtvRCKHk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA",
      "imageSource": "unsplash"
     },
     {
      "name": "Flush Door 3x7",
      "unit": "piece",
      "price": 6500,
      "icon": "🚪",
      "image": "assets/catalog-images/tiles-marble-finishing-ba54f4.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1706629503586-2731f65587ae?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Tile Merchant Ireland",
       "profileUrl": "https://unsplash.com/@tilemerchant",
       "photoUrl": "https://unsplash.com/photos/three-chairs-sitting-on-a-marble-floor-in-a-room-v9oBtvRCKHk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/v9oBtvRCKHk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA",
      "imageSource": "unsplash"
     },
     {
      "name": "Steel Door Frame",
      "unit": "piece",
      "price": 4500,
      "icon": "🚪",
      "image": "assets/catalog-images/steel-door-frame-6877f3.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1706629503586-2731f65587ae?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Tile Merchant Ireland",
       "profileUrl": "https://unsplash.com/@tilemerchant",
       "photoUrl": "https://unsplash.com/photos/three-chairs-sitting-on-a-marble-floor-in-a-room-v9oBtvRCKHk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/v9oBtvRCKHk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA"
     },
     {
      "name": "Water Tank 500L",
      "unit": "piece",
      "price": 9500,
      "icon": "🛢️",
      "image": "assets/catalog-images/water-tank-491563.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1706629503586-2731f65587ae?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Tile Merchant Ireland",
       "profileUrl": "https://unsplash.com/@tilemerchant",
       "photoUrl": "https://unsplash.com/photos/three-chairs-sitting-on-a-marble-floor-in-a-room-v9oBtvRCKHk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/v9oBtvRCKHk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA"
     },
     {
      "name": "Water Tank 1000L",
      "unit": "piece",
      "price": 15000,
      "icon": "🛢️",
      "image": "assets/catalog-images/water-tank-491563.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1706629503586-2731f65587ae?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Tile Merchant Ireland",
       "profileUrl": "https://unsplash.com/@tilemerchant",
       "photoUrl": "https://unsplash.com/photos/three-chairs-sitting-on-a-marble-floor-in-a-room-v9oBtvRCKHk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/v9oBtvRCKHk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA"
     },
     {
      "name": "Wire Mesh Roll 4x50ft",
      "unit": "piece",
      "price": 6500,
      "icon": "🔗",
      "image": "assets/catalog-images/tiles-marble-finishing-ba54f4.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1706629503586-2731f65587ae?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Tile Merchant Ireland",
       "profileUrl": "https://unsplash.com/@tilemerchant",
       "photoUrl": "https://unsplash.com/photos/three-chairs-sitting-on-a-marble-floor-in-a-room-v9oBtvRCKHk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/v9oBtvRCKHk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA",
      "imageSource": "unsplash"
     },
     {
      "name": "Gypsum Powder 20kg",
      "unit": "piece",
      "price": 650,
      "icon": "⬜",
      "image": "assets/catalog-images/gypsum-powder-35cdd2.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1706629503586-2731f65587ae?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Tile Merchant Ireland",
       "profileUrl": "https://unsplash.com/@tilemerchant",
       "photoUrl": "https://unsplash.com/photos/three-chairs-sitting-on-a-marble-floor-in-a-room-v9oBtvRCKHk",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/v9oBtvRCKHk/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA"
     },
     {
      "name": "Block Adhesive 20kg",
      "unit": "piece",
      "price": 1100,
      "icon": "🧱",
      "image": "assets/catalog-images/block-adhesive-9610f5.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1575493438282-4e0fb32d1bdd?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Y2VtZW50JTIwYmFnJTIwY29uc3RydWN0aW9ufGVufDF8fHx8MTc5MjI1NTUwNXww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Marjan Aghazadeh",
       "profileUrl": "https://unsplash.com/@marjan_aghazadeh",
       "photoUrl": "https://unsplash.com/photos/man-standing-beside-sack-seG0b5qw09w",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/seG0b5qw09w/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Y2VtZW50JTIwYmFnJTIwY29uc3RydWN0aW9ufGVufDF8fHx8MTc5MjI1NTUwNXww",
      "imageSource": "unsplash"
     }
    ],
    "image": "assets/catalog-images/tiles-marble-finishing-ba54f4.webp",
    "imageUrl": "https://images.unsplash.com/photo-1706629503586-2731f65587ae?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8VGlsZXMlMjAlMjBNYXJibGUlMjAlMjAlMjBGaW5pc2hpbmd8ZW58MXx8fHwxNzkyMjU1NTI4fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Tile Merchant Ireland",
     "profileUrl": "https://unsplash.com/@tilemerchant",
     "photoUrl": "https://unsplash.com/photos/three-chairs-sitting-on-a-marble-floor-in-a-room-v9oBtvRCKHk",
     "source": "Unsplash"
    }
   }
  ]
 },
 {
  "shopType": "Clothing & Garments",
  "icon": "👕",
  "categories": [
   {
    "name": "Men's Shalwar Kameez Fabric",
    "items": [
     {
      "name": "Wash n Wear Suit 4m",
      "unit": "piece",
      "price": 1800,
      "icon": "👔",
      "nameUrdu": "شلوار قمیض",
      "image": "assets/catalog-images/wash-n-wear-suit-2e1321.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1517146783983-418c681b56c5?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8ZmFicmljJTIwcm9sbHMlMjB0ZXh0aWxlJTIwc2hvcHxlbnwxfHx8fDE3OTIyNTU0ODV8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vishal Banik",
       "profileUrl": "https://unsplash.com/@vishalbanik16",
       "photoUrl": "https://unsplash.com/photos/photo-of-assorted-color-thread-spool-lot-V6T99SnUCyA",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/V6T99SnUCyA/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8ZmFicmljJTIwcm9sbHMlMjB0ZXh0aWxlJTIwc2hvcHxlbnwxfHx8fDE3OTIyNTU0ODV8MA"
     },
     {
      "name": "Pure Cotton Suit 4m",
      "unit": "piece",
      "price": 2200,
      "icon": "👔",
      "imageUrl": "https://images.unsplash.com/photo-1517146783983-418c681b56c5?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8ZmFicmljJTIwcm9sbHMlMjB0ZXh0aWxlJTIwc2hvcHxlbnwxfHx8fDE3OTIyNTU0ODV8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vishal Banik",
       "profileUrl": "https://unsplash.com/@vishalbanik16",
       "photoUrl": "https://unsplash.com/photos/photo-of-assorted-color-thread-spool-lot-V6T99SnUCyA",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/V6T99SnUCyA/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8ZmFicmljJTIwcm9sbHMlMjB0ZXh0aWxlJTIwc2hvcHxlbnwxfHx8fDE3OTIyNTU0ODV8MA"
     },
     {
      "name": "Boski Suit 4m",
      "unit": "piece",
      "price": 4500,
      "icon": "👔",
      "imageUrl": "https://images.unsplash.com/photo-1517146783983-418c681b56c5?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8ZmFicmljJTIwcm9sbHMlMjB0ZXh0aWxlJTIwc2hvcHxlbnwxfHx8fDE3OTIyNTU0ODV8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vishal Banik",
       "profileUrl": "https://unsplash.com/@vishalbanik16",
       "photoUrl": "https://unsplash.com/photos/photo-of-assorted-color-thread-spool-lot-V6T99SnUCyA",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/V6T99SnUCyA/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8ZmFicmljJTIwcm9sbHMlMjB0ZXh0aWxlJTIwc2hvcHxlbnwxfHx8fDE3OTIyNTU0ODV8MA"
     },
     {
      "name": "Latha Suit 4m",
      "unit": "piece",
      "price": 1500,
      "icon": "👔",
      "imageUrl": "https://images.unsplash.com/photo-1517146783983-418c681b56c5?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8ZmFicmljJTIwcm9sbHMlMjB0ZXh0aWxlJTIwc2hvcHxlbnwxfHx8fDE3OTIyNTU0ODV8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vishal Banik",
       "profileUrl": "https://unsplash.com/@vishalbanik16",
       "photoUrl": "https://unsplash.com/photos/photo-of-assorted-color-thread-spool-lot-V6T99SnUCyA",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/V6T99SnUCyA/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8ZmFicmljJTIwcm9sbHMlMjB0ZXh0aWxlJTIwc2hvcHxlbnwxfHx8fDE3OTIyNTU0ODV8MA"
     },
     {
      "name": "Khaddar Suit 4m Winter",
      "unit": "piece",
      "price": 1800,
      "icon": "👔",
      "imageUrl": "https://images.unsplash.com/photo-1517146783983-418c681b56c5?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8ZmFicmljJTIwcm9sbHMlMjB0ZXh0aWxlJTIwc2hvcHxlbnwxfHx8fDE3OTIyNTU0ODV8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vishal Banik",
       "profileUrl": "https://unsplash.com/@vishalbanik16",
       "photoUrl": "https://unsplash.com/photos/photo-of-assorted-color-thread-spool-lot-V6T99SnUCyA",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/V6T99SnUCyA/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8ZmFicmljJTIwcm9sbHMlMjB0ZXh0aWxlJTIwc2hvcHxlbnwxfHx8fDE3OTIyNTU0ODV8MA"
     },
     {
      "name": "Gul Ahmed Wash n Wear 4m",
      "unit": "piece",
      "price": 2800,
      "icon": "👔",
      "imageUrl": "https://images.unsplash.com/photo-1517146783983-418c681b56c5?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8ZmFicmljJTIwcm9sbHMlMjB0ZXh0aWxlJTIwc2hvcHxlbnwxfHx8fDE3OTIyNTU0ODV8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vishal Banik",
       "profileUrl": "https://unsplash.com/@vishalbanik16",
       "photoUrl": "https://unsplash.com/photos/photo-of-assorted-color-thread-spool-lot-V6T99SnUCyA",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/V6T99SnUCyA/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8ZmFicmljJTIwcm9sbHMlMjB0ZXh0aWxlJTIwc2hvcHxlbnwxfHx8fDE3OTIyNTU0ODV8MA"
     },
     {
      "name": "J. Wash n Wear 4m",
      "unit": "piece",
      "price": 3200,
      "icon": "👔",
      "image": "assets/catalog-images/j-wash-n-wear-b435a2.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1517146783983-418c681b56c5?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8ZmFicmljJTIwcm9sbHMlMjB0ZXh0aWxlJTIwc2hvcHxlbnwxfHx8fDE3OTIyNTU0ODV8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vishal Banik",
       "profileUrl": "https://unsplash.com/@vishalbanik16",
       "photoUrl": "https://unsplash.com/photos/photo-of-assorted-color-thread-spool-lot-V6T99SnUCyA",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/V6T99SnUCyA/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8ZmFicmljJTIwcm9sbHMlMjB0ZXh0aWxlJTIwc2hvcHxlbnwxfHx8fDE3OTIyNTU0ODV8MA"
     },
     {
      "name": "Al Karam Wash n Wear 4m",
      "unit": "piece",
      "price": 2600,
      "icon": "👔",
      "imageUrl": "https://images.unsplash.com/photo-1517146783983-418c681b56c5?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8ZmFicmljJTIwcm9sbHMlMjB0ZXh0aWxlJTIwc2hvcHxlbnwxfHx8fDE3OTIyNTU0ODV8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vishal Banik",
       "profileUrl": "https://unsplash.com/@vishalbanik16",
       "photoUrl": "https://unsplash.com/photos/photo-of-assorted-color-thread-spool-lot-V6T99SnUCyA",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/V6T99SnUCyA/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8ZmFicmljJTIwcm9sbHMlMjB0ZXh0aWxlJTIwc2hvcHxlbnwxfHx8fDE3OTIyNTU0ODV8MA"
     },
     {
      "name": "Off-White Latha Suit 4m",
      "unit": "piece",
      "price": 1600,
      "icon": "👔",
      "imageUrl": "https://images.unsplash.com/photo-1517146783983-418c681b56c5?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8ZmFicmljJTIwcm9sbHMlMjB0ZXh0aWxlJTIwc2hvcHxlbnwxfHx8fDE3OTIyNTU0ODV8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vishal Banik",
       "profileUrl": "https://unsplash.com/@vishalbanik16",
       "photoUrl": "https://unsplash.com/photos/photo-of-assorted-color-thread-spool-lot-V6T99SnUCyA",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/V6T99SnUCyA/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8ZmFicmljJTIwcm9sbHMlMjB0ZXh0aWxlJTIwc2hvcHxlbnwxfHx8fDE3OTIyNTU0ODV8MA"
     },
     {
      "name": "Navy Blue Wash n Wear 4m",
      "unit": "piece",
      "price": 1900,
      "icon": "👔",
      "image": "assets/catalog-images/navy-blue-wash-n-099eb2.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1517146783983-418c681b56c5?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8ZmFicmljJTIwcm9sbHMlMjB0ZXh0aWxlJTIwc2hvcHxlbnwxfHx8fDE3OTIyNTU0ODV8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vishal Banik",
       "profileUrl": "https://unsplash.com/@vishalbanik16",
       "photoUrl": "https://unsplash.com/photos/photo-of-assorted-color-thread-spool-lot-V6T99SnUCyA",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/V6T99SnUCyA/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8ZmFicmljJTIwcm9sbHMlMjB0ZXh0aWxlJTIwc2hvcHxlbnwxfHx8fDE3OTIyNTU0ODV8MA"
     },
     {
      "name": "Grey Cotton Suit 4m",
      "unit": "piece",
      "price": 2300,
      "icon": "👔",
      "imageUrl": "https://images.unsplash.com/photo-1517146783983-418c681b56c5?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8ZmFicmljJTIwcm9sbHMlMjB0ZXh0aWxlJTIwc2hvcHxlbnwxfHx8fDE3OTIyNTU0ODV8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vishal Banik",
       "profileUrl": "https://unsplash.com/@vishalbanik16",
       "photoUrl": "https://unsplash.com/photos/photo-of-assorted-color-thread-spool-lot-V6T99SnUCyA",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/V6T99SnUCyA/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8ZmFicmljJTIwcm9sbHMlMjB0ZXh0aWxlJTIwc2hvcHxlbnwxfHx8fDE3OTIyNTU0ODV8MA"
     },
     {
      "name": "Kurta Cloth 2.5m",
      "unit": "piece",
      "price": 1200,
      "icon": "👕",
      "imageUrl": "https://images.unsplash.com/photo-1517146783983-418c681b56c5?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8ZmFicmljJTIwcm9sbHMlMjB0ZXh0aWxlJTIwc2hvcHxlbnwxfHx8fDE3OTIyNTU0ODV8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vishal Banik",
       "profileUrl": "https://unsplash.com/@vishalbanik16",
       "photoUrl": "https://unsplash.com/photos/photo-of-assorted-color-thread-spool-lot-V6T99SnUCyA",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/V6T99SnUCyA/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8ZmFicmljJTIwcm9sbHMlMjB0ZXh0aWxlJTIwc2hvcHxlbnwxfHx8fDE3OTIyNTU0ODV8MA"
     },
     {
      "name": "White Shalwar 2.5m",
      "unit": "piece",
      "price": 900,
      "icon": "👖",
      "imageUrl": "https://images.unsplash.com/photo-1517146783983-418c681b56c5?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8ZmFicmljJTIwcm9sbHMlMjB0ZXh0aWxlJTIwc2hvcHxlbnwxfHx8fDE3OTIyNTU0ODV8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vishal Banik",
       "profileUrl": "https://unsplash.com/@vishalbanik16",
       "photoUrl": "https://unsplash.com/photos/photo-of-assorted-color-thread-spool-lot-V6T99SnUCyA",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/V6T99SnUCyA/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8ZmFicmljJTIwcm9sbHMlMjB0ZXh0aWxlJTIwc2hvcHxlbnwxfHx8fDE3OTIyNTU0ODV8MA"
     },
     {
      "name": "Black Shalwar 2.5m",
      "unit": "piece",
      "price": 900,
      "icon": "👖",
      "imageUrl": "https://images.unsplash.com/photo-1517146783983-418c681b56c5?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8ZmFicmljJTIwcm9sbHMlMjB0ZXh0aWxlJTIwc2hvcHxlbnwxfHx8fDE3OTIyNTU0ODV8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Vishal Banik",
       "profileUrl": "https://unsplash.com/@vishalbanik16",
       "photoUrl": "https://unsplash.com/photos/photo-of-assorted-color-thread-spool-lot-V6T99SnUCyA",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/V6T99SnUCyA/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8ZmFicmljJTIwcm9sbHMlMjB0ZXh0aWxlJTIwc2hvcHxlbnwxfHx8fDE3OTIyNTU0ODV8MA"
     }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1517146783983-418c681b56c5?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8ZmFicmljJTIwcm9sbHMlMjB0ZXh0aWxlJTIwc2hvcHxlbnwxfHx8fDE3OTIyNTU0ODV8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Vishal Banik",
     "profileUrl": "https://unsplash.com/@vishalbanik16",
     "photoUrl": "https://unsplash.com/photos/photo-of-assorted-color-thread-spool-lot-V6T99SnUCyA",
     "source": "Unsplash"
    }
   },
   {
    "name": "Ready-Made Men's Wear",
    "items": [
     {
      "name": "Ready Shalwar Kameez",
      "unit": "piece",
      "price": 2800,
      "icon": "👔",
      "image": "assets/catalog-images/ready-shalwar-kameez-200560.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1561053720-76cd73ff22c3?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Waldemar Brandt",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hanged-assorted-color-dress-shirts-NPPNHZK1U0s",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "White Kurta",
      "unit": "piece",
      "price": 1800,
      "icon": "👕",
      "image": "assets/catalog-images/white-kurta-v2-9fa5f1.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1561053720-76cd73ff22c3?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Waldemar Brandt",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hanged-assorted-color-dress-shirts-NPPNHZK1U0s",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Men's Waistcoat",
      "unit": "piece",
      "price": 2500,
      "icon": "🦺",
      "image": "assets/catalog-images/men-s-waistcoat-a57066.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1561053720-76cd73ff22c3?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Waldemar Brandt",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hanged-assorted-color-dress-shirts-NPPNHZK1U0s",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Denim Jeans Pant",
      "unit": "piece",
      "price": 2200,
      "icon": "👖",
      "image": "assets/catalog-images/denim-jeans-pant-4f643e.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1561053720-76cd73ff22c3?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Waldemar Brandt",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hanged-assorted-color-dress-shirts-NPPNHZK1U0s",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Formal Shirt",
      "unit": "piece",
      "price": 1500,
      "icon": "👔",
      "image": "assets/catalog-images/formal-shirt-v2-6393a4.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1561053720-76cd73ff22c3?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Waldemar Brandt",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hanged-assorted-color-dress-shirts-NPPNHZK1U0s",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Polo Shirt",
      "unit": "piece",
      "price": 1200,
      "icon": "👕",
      "image": "assets/catalog-images/polo-shirt-v2-dd6dec.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1561053720-76cd73ff22c3?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Waldemar Brandt",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hanged-assorted-color-dress-shirts-NPPNHZK1U0s",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Men's Hoodie",
      "unit": "piece",
      "price": 2200,
      "icon": "🧥",
      "image": "assets/catalog-images/men-s-hoodie-cf4891.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1561053720-76cd73ff22c3?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Waldemar Brandt",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hanged-assorted-color-dress-shirts-NPPNHZK1U0s",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Sweatshirt",
      "unit": "piece",
      "price": 1800,
      "icon": "🧥",
      "image": "assets/catalog-images/sweatshirt-632302.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1561053720-76cd73ff22c3?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Waldemar Brandt",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hanged-assorted-color-dress-shirts-NPPNHZK1U0s",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Denim Jacket",
      "unit": "piece",
      "price": 3500,
      "icon": "🧥",
      "image": "assets/catalog-images/denim-jacket-f8bd00.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1561053720-76cd73ff22c3?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Waldemar Brandt",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hanged-assorted-color-dress-shirts-NPPNHZK1U0s",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Tracksuit 2pc",
      "unit": "piece",
      "price": 2800,
      "icon": "🏃",
      "image": "assets/catalog-images/tracksuit-2c3795.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1561053720-76cd73ff22c3?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Waldemar Brandt",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hanged-assorted-color-dress-shirts-NPPNHZK1U0s",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Wool Shawl Gents",
      "unit": "piece",
      "price": 1500,
      "icon": "🧣",
      "image": "assets/catalog-images/ready-made-men-s-wear-caf5e6.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1561053720-76cd73ff22c3?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Waldemar Brandt",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hanged-assorted-color-dress-shirts-NPPNHZK1U0s",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Kurti Ladies",
      "unit": "piece",
      "price": 1600,
      "icon": "👗",
      "image": "assets/catalog-images/ready-made-men-s-wear-caf5e6.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1561053720-76cd73ff22c3?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Waldemar Brandt",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hanged-assorted-color-dress-shirts-NPPNHZK1U0s",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Gents Night Suit",
      "unit": "piece",
      "price": 1600,
      "icon": "🌙",
      "image": "assets/catalog-images/gents-night-suit-v2-0bdcf9.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1561053720-76cd73ff22c3?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Waldemar Brandt",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hanged-assorted-color-dress-shirts-NPPNHZK1U0s",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     }
    ],
    "image": "assets/catalog-images/ready-made-men-s-wear-caf5e6.webp",
    "imageUrl": "https://images.unsplash.com/photo-1561053720-76cd73ff22c3?w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Waldemar Brandt",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/hanged-assorted-color-dress-shirts-NPPNHZK1U0s",
     "source": "Unsplash"
    }
   },
   {
    "name": "Ladies Suits & Fabric",
    "items": [
     {
      "name": "Lawn 3pc Unstitched",
      "unit": "piece",
      "price": 2800,
      "icon": "👗",
      "nameUrdu": "لان",
      "image": "assets/catalog-images/ladies-suits-fabric-d29ac1.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1640767760729-7bfb6ce43ad4?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Cosmin Ursea",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-different-colors-of-cloth-on-a-shelf-vOFQ7q7Kky8",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Lawn 2pc Unstitched",
      "unit": "piece",
      "price": 1800,
      "icon": "👗",
      "image": "assets/catalog-images/ladies-suits-fabric-d29ac1.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1640767760729-7bfb6ce43ad4?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Cosmin Ursea",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-different-colors-of-cloth-on-a-shelf-vOFQ7q7Kky8",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Cambric 3pc Unstitched",
      "unit": "piece",
      "price": 3200,
      "icon": "👗",
      "image": "assets/catalog-images/ladies-suits-fabric-d29ac1.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1640767760729-7bfb6ce43ad4?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Cosmin Ursea",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-different-colors-of-cloth-on-a-shelf-vOFQ7q7Kky8",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Chiffon 3pc Unstitched",
      "unit": "piece",
      "price": 4500,
      "icon": "👗",
      "image": "assets/catalog-images/ladies-suits-fabric-d29ac1.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1640767760729-7bfb6ce43ad4?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Cosmin Ursea",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-different-colors-of-cloth-on-a-shelf-vOFQ7q7Kky8",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Khaddar 3pc Winter",
      "unit": "piece",
      "price": 3200,
      "icon": "👗",
      "image": "assets/catalog-images/ladies-suits-fabric-d29ac1.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1640767760729-7bfb6ce43ad4?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Cosmin Ursea",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-different-colors-of-cloth-on-a-shelf-vOFQ7q7Kky8",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Linen 3pc Unstitched",
      "unit": "piece",
      "price": 3500,
      "icon": "👗",
      "image": "assets/catalog-images/linen-unstitched-c289c7.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1640767760729-7bfb6ce43ad4?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Cosmin Ursea",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-different-colors-of-cloth-on-a-shelf-vOFQ7q7Kky8",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Gul Ahmed Lawn 3pc",
      "unit": "piece",
      "price": 4200,
      "icon": "👗",
      "image": "assets/catalog-images/ladies-suits-fabric-d29ac1.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1640767760729-7bfb6ce43ad4?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Cosmin Ursea",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-different-colors-of-cloth-on-a-shelf-vOFQ7q7Kky8",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Sana Safinaz Lawn 3pc",
      "unit": "piece",
      "price": 4500,
      "icon": "👗",
      "image": "assets/catalog-images/ladies-suits-fabric-d29ac1.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1640767760729-7bfb6ce43ad4?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Cosmin Ursea",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-different-colors-of-cloth-on-a-shelf-vOFQ7q7Kky8",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Maria B 3pc",
      "unit": "piece",
      "price": 5200,
      "icon": "👗",
      "image": "assets/catalog-images/maria-b-73abaf.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1640767760729-7bfb6ce43ad4?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Cosmin Ursea",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-different-colors-of-cloth-on-a-shelf-vOFQ7q7Kky8",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Al Karam 3pc",
      "unit": "piece",
      "price": 3800,
      "icon": "👗",
      "image": "assets/catalog-images/al-karam-v2-2f10d0.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1640767760729-7bfb6ce43ad4?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Cosmin Ursea",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-different-colors-of-cloth-on-a-shelf-vOFQ7q7Kky8",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Embroidered Net 3pc",
      "unit": "piece",
      "price": 5500,
      "icon": "👗",
      "image": "assets/catalog-images/embroidered-net-v2-12b017.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1640767760729-7bfb6ce43ad4?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Cosmin Ursea",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-different-colors-of-cloth-on-a-shelf-vOFQ7q7Kky8",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Lawn Dupatta",
      "unit": "piece",
      "price": 600,
      "icon": "🧕",
      "image": "assets/catalog-images/ladies-suits-fabric-d29ac1.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1640767760729-7bfb6ce43ad4?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Cosmin Ursea",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-different-colors-of-cloth-on-a-shelf-vOFQ7q7Kky8",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Chiffon Dupatta",
      "unit": "piece",
      "price": 900,
      "icon": "🧕",
      "image": "assets/catalog-images/chiffon-dupatta-f549eb.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1640767760729-7bfb6ce43ad4?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Cosmin Ursea",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-different-colors-of-cloth-on-a-shelf-vOFQ7q7Kky8",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Plain Trouser Ladies",
      "unit": "piece",
      "price": 800,
      "icon": "👖",
      "image": "assets/catalog-images/ladies-suits-fabric-d29ac1.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1640767760729-7bfb6ce43ad4?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Cosmin Ursea",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-different-colors-of-cloth-on-a-shelf-vOFQ7q7Kky8",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Black Abaya",
      "unit": "piece",
      "price": 4500,
      "icon": "🧕",
      "nameUrdu": "عبایا",
      "image": "assets/catalog-images/black-abaya-e4df53.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1640767760729-7bfb6ce43ad4?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Cosmin Ursea",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-different-colors-of-cloth-on-a-shelf-vOFQ7q7Kky8",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Hijab Scarf",
      "unit": "piece",
      "price": 500,
      "icon": "🧕",
      "nameUrdu": "حجاب",
      "image": "assets/catalog-images/hijab-scarf-4c6f16.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1640767760729-7bfb6ce43ad4?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Cosmin Ursea",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-different-colors-of-cloth-on-a-shelf-vOFQ7q7Kky8",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Niqab",
      "unit": "piece",
      "price": 350,
      "icon": "🧕",
      "image": "assets/catalog-images/niqab-f1f96f.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1640767760729-7bfb6ce43ad4?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Cosmin Ursea",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-different-colors-of-cloth-on-a-shelf-vOFQ7q7Kky8",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     }
    ],
    "image": "assets/catalog-images/ladies-suits-fabric-d29ac1.webp",
    "imageUrl": "https://images.unsplash.com/photo-1640767760729-7bfb6ce43ad4?w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Cosmin Ursea",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/a-bunch-of-different-colors-of-cloth-on-a-shelf-vOFQ7q7Kky8",
     "source": "Unsplash"
    }
   },
   {
    "name": "Undergarments & Hosiery",
    "items": [
     {
      "name": "Gents Banyan Vest",
      "unit": "piece",
      "price": 350,
      "icon": "🎽",
      "nameUrdu": "بنیان",
      "imageUrl": "https://images.unsplash.com/photo-1737094547812-1499f4b700a0?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Maria Kovalets",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-gray-tank-top-on-a-white-background-LNaDxLn61z4",
       "source": "Unsplash"
      }
     },
     {
      "name": "Gents Brief 3-pack",
      "unit": "packet",
      "price": 600,
      "icon": "🩲",
      "imageUrl": "https://images.unsplash.com/photo-1640765937555-6f413ed1d936?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Cosmin Ursea",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-close-up-of-a-pair-of-underwear-on-a-white-surface-SGZmzGx0dG0",
       "source": "Unsplash"
      }
     },
     {
      "name": "Ladies Bra",
      "unit": "piece",
      "price": 450,
      "icon": "👙",
      "imageUrl": "https://images.unsplash.com/photo-1694290340663-65804773ce7a?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Malta Gordos",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-close-up-of-a-bra-on-a-table-VwyUF2xdBh0",
       "source": "Unsplash"
      }
     },
     {
      "name": "Ladies Panty 3-pack",
      "unit": "packet",
      "price": 500,
      "icon": "🩲",
      "imageUrl": "https://images.unsplash.com/photo-1568441556126-f36ae0900180?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Fahad Waseem",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/assorted-colored-bra-panties-and-sport-bra-AdjyrNhFVPI",
       "source": "Unsplash"
      }
     },
     {
      "name": "Cotton Socks Pair",
      "unit": "piece",
      "price": 120,
      "icon": "🧦",
      "nameUrdu": "موزے",
      "image": "assets/catalog-images/cotton-socks-03ec2b.webp",
      "imageLevel": "item"
     },
     {
      "name": "Ankle Socks 3-pack",
      "unit": "packet",
      "price": 350,
      "icon": "🧦",
      "image": "assets/catalog-images/ankle-socks-3-be67ab.webp",
      "imageLevel": "item"
     },
     {
      "name": "Winter Thermal Upper",
      "unit": "piece",
      "price": 650,
      "icon": "🥶"
     },
     {
      "name": "Winter Thermal Lower",
      "unit": "piece",
      "price": 650,
      "icon": "🥶"
     },
     {
      "name": "Cotton Handkerchief",
      "unit": "piece",
      "price": 120,
      "icon": "🤧",
      "nameUrdu": "رومال",
      "image": "assets/catalog-images/cotton-handkerchief-v2-2ac17b.webp",
      "imageLevel": "item"
     },
     {
      "name": "Prayer Cap (Topi)",
      "unit": "piece",
      "price": 250,
      "icon": "🕌",
      "nameUrdu": "ٹوپی",
      "imageUrl": "https://images.unsplash.com/photo-1782237319321-bac65528d4a5?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "MOHD FADZILLAH SULAIMAN",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/many-traditional-embroidered-skullcaps-displayed-in-black-and-white-3druzBrgR6k",
       "source": "Unsplash"
      }
     }
    ],
    "image": "assets/catalog-images/undergarments-hosiery-v2-2a51cc.webp",
    "imageUrl": "https://images.unsplash.com/photo-1568441556126-f36ae0900180?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "Fahad Waseem",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/assorted-colored-bra-panties-and-sport-bra-AdjyrNhFVPI",
     "source": "Unsplash"
    }
   },
   {
    "name": "Kids Wear",
    "items": [
     {
      "name": "Baby Suit 0-6 Months",
      "unit": "piece",
      "price": 600,
      "icon": "👶",
      "imageUrl": "https://images.unsplash.com/photo-1766918780914-5df4a5a98c44?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "jackson kondili",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/baby-clothes-hanging-on-a-rack-5juo633uIEc",
       "source": "Unsplash"
      }
     },
     {
      "name": "Baby Romper",
      "unit": "piece",
      "price": 500,
      "icon": "👶",
      "image": "assets/catalog-images/baby-romper-v2-28a015.webp",
      "imageLevel": "item"
     },
     {
      "name": "Kids Shalwar Kameez",
      "unit": "piece",
      "price": 900,
      "icon": "👦",
      "imageUrl": "https://images.unsplash.com/photo-1766918780914-5df4a5a98c44?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "jackson kondili",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/baby-clothes-hanging-on-a-rack-5juo633uIEc",
       "source": "Unsplash"
      }
     },
     {
      "name": "Kids Frock",
      "unit": "piece",
      "price": 1100,
      "icon": "👧",
      "image": "assets/catalog-images/fix-kids-frock-a3353e.webp",
      "imageLevel": "item",
      "credit": {
       "name": "Cinderella",
       "profileUrl": "",
       "photoUrl": "https://commons.wikimedia.org/wiki/File%3ADress%2C_girl%27s_%28AM_1996.207.9-1%29.jpg",
       "source": "Wikimedia Commons"
      }
     },
     {
      "name": "Kids Jeans",
      "unit": "piece",
      "price": 1200,
      "icon": "👖"
     },
     {
      "name": "Kids T-Shirt",
      "unit": "piece",
      "price": 500,
      "icon": "👕",
      "imageUrl": "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Mediamodifier",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-crew-neck-t-shirt-VoXqvbLAPjM",
       "source": "Unsplash"
      }
     },
     {
      "name": "Kids Hoodie",
      "unit": "piece",
      "price": 1100,
      "icon": "🧥",
      "image": "assets/catalog-images/fix-kids-hoodie-94139e.webp",
      "imageLevel": "item",
      "credit": {
       "name": "Evan0512",
       "profileUrl": "",
       "photoUrl": "https://commons.wikimedia.org/wiki/File%3AKids_character_clothing_in_Colma_Target_store.jpg",
       "source": "Wikimedia Commons"
      }
     },
     {
      "name": "Kids Sweater",
      "unit": "piece",
      "price": 1300,
      "icon": "🧶",
      "image": "assets/catalog-images/kids-sweater-v2-cc2f41.webp",
      "imageLevel": "item"
     },
     {
      "name": "Baby Blanket",
      "unit": "piece",
      "price": 800,
      "icon": "🛏️",
      "image": "assets/catalog-images/baby-blanket-v2-c429e0.webp",
      "imageLevel": "item"
     },
     {
      "name": "Baby Cap Set",
      "unit": "piece",
      "price": 300,
      "icon": "🧢",
      "imageUrl": "https://images.unsplash.com/photo-1565058528605-670489ab6f6c?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Diane Helentjaris",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/pink-knit-cap-a6FTTn_TZFo",
       "source": "Unsplash"
      }
     },
     {
      "name": "School Uniform Shirt",
      "unit": "piece",
      "price": 700,
      "icon": "👔"
     },
     {
      "name": "School Uniform Pant",
      "unit": "piece",
      "price": 900,
      "icon": "👖"
     }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1766918780914-5df4a5a98c44?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "jackson kondili",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/baby-clothes-hanging-on-a-rack-5juo633uIEc",
     "source": "Unsplash"
    }
   },
   {
    "name": "Winter Wear",
    "items": [
     {
      "name": "Ladies Wool Shawl",
      "unit": "piece",
      "price": 1200,
      "icon": "🧣",
      "nameUrdu": "شال",
      "image": "assets/catalog-images/winter-wear-a13618.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Amanda Vick",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/one-cowboy-hat-and-five-jackets-hanged-on-clothes-rack-ohWf6YuzOQk",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Pashmina Shawl",
      "unit": "piece",
      "price": 2500,
      "icon": "🧣",
      "image": "assets/catalog-images/pashmina-shawl-eb0685.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Amanda Vick",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/one-cowboy-hat-and-five-jackets-hanged-on-clothes-rack-ohWf6YuzOQk",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Gents Muffler",
      "unit": "piece",
      "price": 600,
      "icon": "🧣",
      "image": "assets/catalog-images/winter-wear-a13618.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Amanda Vick",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/one-cowboy-hat-and-five-jackets-hanged-on-clothes-rack-ohWf6YuzOQk",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Wool Cap",
      "unit": "piece",
      "price": 350,
      "icon": "🧢",
      "image": "assets/catalog-images/wool-cap-449e3c.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Amanda Vick",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/one-cowboy-hat-and-five-jackets-hanged-on-clothes-rack-ohWf6YuzOQk",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Wool Gloves Pair",
      "unit": "piece",
      "price": 400,
      "icon": "🧤",
      "image": "assets/catalog-images/wool-gloves-d2d403.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Amanda Vick",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/one-cowboy-hat-and-five-jackets-hanged-on-clothes-rack-ohWf6YuzOQk",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Wool Socks 3-pack",
      "unit": "packet",
      "price": 450,
      "icon": "🧦",
      "image": "assets/catalog-images/wool-socks-3-0ef24b.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Amanda Vick",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/one-cowboy-hat-and-five-jackets-hanged-on-clothes-rack-ohWf6YuzOQk",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Gents Sweater",
      "unit": "piece",
      "price": 2200,
      "icon": "🧶",
      "image": "assets/catalog-images/winter-wear-a13618.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Amanda Vick",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/one-cowboy-hat-and-five-jackets-hanged-on-clothes-rack-ohWf6YuzOQk",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Ladies Sweater",
      "unit": "piece",
      "price": 2400,
      "icon": "🧶",
      "image": "assets/catalog-images/ladies-sweater-d00b7c.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Amanda Vick",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/one-cowboy-hat-and-five-jackets-hanged-on-clothes-rack-ohWf6YuzOQk",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Sweater Vest",
      "unit": "piece",
      "price": 1400,
      "icon": "🦺",
      "image": "assets/catalog-images/sweater-vest-045417.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Amanda Vick",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/one-cowboy-hat-and-five-jackets-hanged-on-clothes-rack-ohWf6YuzOQk",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Puffer Jacket",
      "unit": "piece",
      "price": 4500,
      "icon": "🧥",
      "image": "assets/catalog-images/puffer-jacket-1a5ff0.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Amanda Vick",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/one-cowboy-hat-and-five-jackets-hanged-on-clothes-rack-ohWf6YuzOQk",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Single Blanket",
      "unit": "piece",
      "price": 1800,
      "icon": "🛏️",
      "image": "assets/catalog-images/single-blanket-06963d.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Amanda Vick",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/one-cowboy-hat-and-five-jackets-hanged-on-clothes-rack-ohWf6YuzOQk",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Double Blanket",
      "unit": "piece",
      "price": 3200,
      "icon": "🛏️",
      "image": "assets/catalog-images/double-blanket-81e47d.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Amanda Vick",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/one-cowboy-hat-and-five-jackets-hanged-on-clothes-rack-ohWf6YuzOQk",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Baby Winter Suit",
      "unit": "piece",
      "price": 900,
      "icon": "👶",
      "image": "assets/catalog-images/winter-wear-a13618.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Amanda Vick",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/one-cowboy-hat-and-five-jackets-hanged-on-clothes-rack-ohWf6YuzOQk",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Kids Winter Cap",
      "unit": "piece",
      "price": 250,
      "icon": "🧢",
      "image": "assets/catalog-images/kids-winter-cap-b8596b.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Amanda Vick",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/one-cowboy-hat-and-five-jackets-hanged-on-clothes-rack-ohWf6YuzOQk",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     }
    ],
    "image": "assets/catalog-images/winter-wear-a13618.webp",
    "imageUrl": "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Amanda Vick",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/one-cowboy-hat-and-five-jackets-hanged-on-clothes-rack-ohWf6YuzOQk",
     "source": "Unsplash"
    }
   }
  ]
 },
 {
  "shopType": "Footwear",
  "icon": "👞",
  "categories": [
   {
    "name": "Chappal",
    "items": [
     {
      "name": "Peshawari Chappal",
      "unit": "piece",
      "price": 2500,
      "icon": "🩴",
      "nameUrdu": "چپل",
      "imageUrl": "https://images.unsplash.com/photo-1563357732-94f6a5df8e4a?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "LumenSoft Technologies",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/flat-sandal-lot-sKFiQmGh7v4",
       "source": "Unsplash"
      }
     },
     {
      "name": "Peshawari Chappal Premium",
      "unit": "piece",
      "price": 4500,
      "icon": "🩴",
      "imageUrl": "https://images.unsplash.com/photo-1563357732-94f6a5df8e4a?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "LumenSoft Technologies",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/flat-sandal-lot-sKFiQmGh7v4",
       "source": "Unsplash"
      }
     },
     {
      "name": "Kohati Chappal",
      "unit": "piece",
      "price": 2200,
      "icon": "🩴",
      "image": "assets/catalog-images/chappal-b9c7fb.webp",
      "imageLevel": "category"
     },
     {
      "name": "Leather Chappal Gents",
      "unit": "piece",
      "price": 1800,
      "icon": "🩴",
      "image": "assets/catalog-images/chappal-b9c7fb.webp",
      "imageLevel": "category"
     },
     {
      "name": "Rubber Hawai Chappal",
      "unit": "piece",
      "price": 350,
      "icon": "🩴",
      "image": "assets/catalog-images/chappal-b9c7fb.webp",
      "imageLevel": "category"
     },
     {
      "name": "Foam Slipper",
      "unit": "piece",
      "price": 450,
      "icon": "🩴",
      "image": "assets/catalog-images/chappal-b9c7fb.webp",
      "imageLevel": "category"
     },
     {
      "name": "Bathroom Slipper",
      "unit": "piece",
      "price": 300,
      "icon": "🩴",
      "image": "assets/catalog-images/bathroom-slipper-2731b2.webp",
      "imageLevel": "item"
     },
     {
      "name": "Ladies Fancy Chappal",
      "unit": "piece",
      "price": 1500,
      "icon": "👡",
      "image": "assets/catalog-images/chappal-b9c7fb.webp",
      "imageLevel": "category"
     },
     {
      "name": "Kids Chappal",
      "unit": "piece",
      "price": 600,
      "icon": "🩴",
      "imageUrl": "https://images.unsplash.com/photo-1563357732-94f6a5df8e4a?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "LumenSoft Technologies",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/flat-sandal-lot-sKFiQmGh7v4",
       "source": "Unsplash"
      }
     },
     {
      "name": "Medicated Chappal",
      "unit": "piece",
      "price": 1200,
      "icon": "🩴",
      "image": "assets/catalog-images/chappal-b9c7fb.webp",
      "imageLevel": "category"
     }
    ],
    "image": "assets/catalog-images/chappal-b9c7fb.webp"
   },
   {
    "name": "Sandals & Slippers",
    "items": [
     {
      "name": "Ladies Heel Sandal",
      "unit": "piece",
      "price": 1800,
      "icon": "👠",
      "imageUrl": "https://images.unsplash.com/photo-1789110519533-a8b183a458ce?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "engin akyurt",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/gold-high-heel-sandals-6U0O5Vtqw0s",
       "source": "Unsplash"
      }
     },
     {
      "name": "Ladies Flat Sandal",
      "unit": "piece",
      "price": 1200,
      "icon": "👡",
      "imageUrl": "https://images.unsplash.com/photo-1777979925976-723230e37453?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Farhan Chohan",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-pair-of-embellished-flat-sandals-on-a-marble-surface-jnTaH9K2S7U",
       "source": "Unsplash"
      }
     },
     {
      "name": "Gents Leather Sandal",
      "unit": "piece",
      "price": 2000,
      "icon": "👞",
      "image": "assets/catalog-images/sandals-slippers-793990.webp",
      "imageLevel": "category"
     },
     {
      "name": "Flip Flops",
      "unit": "piece",
      "price": 400,
      "icon": "🩴",
      "imageUrl": "https://images.unsplash.com/photo-1692536631218-ce4264088abe?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Nando Martins",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-pair-of-white-slippers-sitting-on-top-of-a-lush-green-field-Q2FWiTgJruA",
       "source": "Unsplash"
      }
     },
     {
      "name": "Wedge Heel Sandal",
      "unit": "piece",
      "price": 1600,
      "icon": "👠",
      "image": "assets/catalog-images/wedge-heel-sandal-631cc1.webp",
      "imageLevel": "item"
     },
     {
      "name": "Kolhapuri Chappal",
      "unit": "piece",
      "price": 1400,
      "icon": "🩴",
      "image": "assets/catalog-images/kolhapuri-chappal-aa0bbf.webp",
      "imageLevel": "item"
     },
     {
      "name": "Velvet Slipper Ladies",
      "unit": "piece",
      "price": 900,
      "icon": "👡",
      "imageUrl": "https://images.unsplash.com/photo-1777979926381-46ffc1395cf8?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Farhan Chohan",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/embellished-flat-sandals-on-a-white-rug-b5DoQuZx0vY",
       "source": "Unsplash"
      }
     },
     {
      "name": "Cork Slipper",
      "unit": "piece",
      "price": 1100,
      "icon": "🩴",
      "imageUrl": "https://images.unsplash.com/photo-1603487742131-4160ec999306?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Jakob Owens",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/brown-and-gray-slide-sandals-WzncgWs3RJ4",
       "source": "Unsplash"
      }
     }
    ],
    "image": "assets/catalog-images/sandals-slippers-793990.webp"
   },
   {
    "name": "Joggers & Sports Shoes",
    "items": [
     {
      "name": "Canvas Shoes",
      "unit": "piece",
      "price": 1200,
      "icon": "👟",
      "image": "assets/catalog-images/canvas-shoes-ce87f4.webp",
      "imageLevel": "item"
     },
     {
      "name": "Running Joggers",
      "unit": "piece",
      "price": 2500,
      "icon": "👟",
      "imageUrl": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Irene Kredenets",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/pair-of-white-and-orange-athletic-shoes-on-white-box-dwKiHoqqxk8",
       "source": "Unsplash"
      }
     },
     {
      "name": "Football Studs",
      "unit": "piece",
      "price": 2800,
      "icon": "⚽",
      "imageUrl": "https://images.unsplash.com/photo-1768696082282-df2812a4f7d8?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "otabek xatipov",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/black-soccer-cleats-with-white-and-blue-accents-rx3Fpnl6sw4",
       "source": "Unsplash"
      }
     },
     {
      "name": "Badminton Shoes",
      "unit": "piece",
      "price": 2200,
      "icon": "🏸",
      "image": "assets/catalog-images/badminton-shoes-a5a33d.webp",
      "imageLevel": "item"
     },
     {
      "name": "White Tennis Shoes",
      "unit": "piece",
      "price": 2000,
      "icon": "👟",
      "image": "assets/catalog-images/white-tennis-shoes-451faa.webp",
      "imageLevel": "item"
     },
     {
      "name": "High Ankle Sneakers",
      "unit": "piece",
      "price": 2600,
      "icon": "👟",
      "image": "assets/catalog-images/joggers-sports-shoes-814b58.webp",
      "imageLevel": "category"
     },
     {
      "name": "Kids Sports Shoes",
      "unit": "piece",
      "price": 1400,
      "icon": "👟",
      "imageUrl": "https://images.unsplash.com/photo-1764155161021-bab07b550c01?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Mohammed Rasel",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-pair-of-blue-slip-on-shoes-with-white-pattern-q1-J0hhX-G0",
       "source": "Unsplash"
      }
     },
     {
      "name": "Gym Trainers",
      "unit": "piece",
      "price": 2400,
      "icon": "🏋️",
      "image": "assets/catalog-images/gym-trainers-v2-97e1bb.webp",
      "imageLevel": "item"
     },
     {
      "name": "Slip-on Loafers",
      "unit": "piece",
      "price": 1500,
      "icon": "👞",
      "image": "assets/catalog-images/slip-on-loafers-8e5e7e.webp",
      "imageLevel": "item"
     },
     {
      "name": "Walking Shoes",
      "unit": "piece",
      "price": 2200,
      "icon": "👟",
      "imageUrl": "https://images.unsplash.com/photo-1637437757614-6491c8e915b5?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "mostafa mahmoudi",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-pair-of-running-shoes-on-a-white-background-W_uDEmTq0po",
       "source": "Unsplash"
      }
     }
    ],
    "image": "assets/catalog-images/joggers-sports-shoes-814b58.webp"
   },
   {
    "name": "Formal & School Shoes",
    "items": [
     {
      "name": "Gents Oxford Shoes",
      "unit": "piece",
      "price": 3500,
      "icon": "👞",
      "imageUrl": "https://images.unsplash.com/photo-1614253429340-98120bd6d753?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Noah Smith",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/brown-leather-shoes-on-brown-floor-tiles-wh2udxkVPWA",
       "source": "Unsplash"
      }
     },
     {
      "name": "Gents Loafers",
      "unit": "piece",
      "price": 2800,
      "icon": "👞",
      "imageUrl": "https://images.unsplash.com/photo-1616406432452-07bc5938759d?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Noah Smith",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/brown-leather-loafers-on-blue-textile-LkuH3Txi_gs",
       "source": "Unsplash"
      }
     },
     {
      "name": "Ladies Pumps",
      "unit": "piece",
      "price": 2200,
      "icon": "👠",
      "imageUrl": "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Emily Pottiger",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-textured-high-heeled-pumps-Zx76sbAndc0",
       "source": "Unsplash"
      }
     },
     {
      "name": "Ladies Khussa",
      "unit": "piece",
      "price": 1800,
      "icon": "👡",
      "nameUrdu": "کھسہ",
      "imageUrl": "https://images.unsplash.com/photo-1777980157996-6f689bb393ab?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Farhan Chohan",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/embroidered-red-velvet-juttis-on-a-white-fluffy-surface-Nk6_V77BwwY",
       "source": "Unsplash"
      }
     },
     {
      "name": "Bridal Khussa",
      "unit": "piece",
      "price": 3500,
      "icon": "👡",
      "imageUrl": "https://images.unsplash.com/photo-1777980157996-6f689bb393ab?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Farhan Chohan",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/embroidered-red-velvet-juttis-on-a-white-fluffy-surface-Nk6_V77BwwY",
       "source": "Unsplash"
      }
     },
     {
      "name": "Boys School Shoes",
      "unit": "piece",
      "price": 1400,
      "icon": "👞",
      "imageUrl": "https://images.unsplash.com/photo-1653868249857-c95d5a3f6109?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Amr Taha",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-pair-of-black-shoes-on-a-white-background-lJk1GCJMo3E",
       "source": "Unsplash"
      }
     },
     {
      "name": "Girls School Shoes",
      "unit": "piece",
      "price": 1300,
      "icon": "👞",
      "image": "assets/catalog-images/girls-school-shoes-d3129b.webp",
      "imageLevel": "item"
     },
     {
      "name": "White PT Shoes",
      "unit": "piece",
      "price": 1100,
      "icon": "👟",
      "image": "assets/catalog-images/white-pt-shoes-v2-14d684.webp",
      "imageLevel": "item"
     },
     {
      "name": "Safety Shoes Steel Toe",
      "unit": "piece",
      "price": 3200,
      "icon": "🥾",
      "image": "assets/catalog-images/safety-shoes-steel-toe-0b9c67.webp",
      "imageLevel": "item"
     },
     {
      "name": "Peshawari Chapli School",
      "unit": "piece",
      "price": 1100,
      "icon": "🩴",
      "imageUrl": "https://images.unsplash.com/photo-1563357732-94f6a5df8e4a?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "LumenSoft Technologies",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/flat-sandal-lot-sKFiQmGh7v4",
       "source": "Unsplash"
      }
     }
    ],
    "image": "assets/catalog-images/formal-school-shoes-v2-895ce7.webp",
    "imageUrl": "https://images.unsplash.com/photo-1563357732-94f6a5df8e4a?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "LumenSoft Technologies",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/flat-sandal-lot-sKFiQmGh7v4",
     "source": "Unsplash"
    }
   },
   {
    "name": "Socks & Shoe Care",
    "items": [
     {
      "name": "Cotton Socks Pair",
      "unit": "piece",
      "price": 120,
      "icon": "🧦",
      "image": "assets/catalog-images/cotton-socks-03ec2b.webp",
      "imageLevel": "item"
     },
     {
      "name": "Ankle Socks 3-pack",
      "unit": "packet",
      "price": 350,
      "icon": "🧦",
      "image": "assets/catalog-images/ankle-socks-3-be67ab.webp",
      "imageLevel": "item"
     },
     {
      "name": "Shoe Polish Black",
      "unit": "piece",
      "price": 250,
      "icon": "👞",
      "image": "assets/catalog-images/shoe-polish-black-fff2d6.webp",
      "imageLevel": "item"
     },
     {
      "name": "Shoe Polish Brown",
      "unit": "piece",
      "price": 250,
      "icon": "👞",
      "image": "assets/catalog-images/shoe-polish-brown-v2-bf89db.webp",
      "imageLevel": "item"
     },
     {
      "name": "Shoe Brush",
      "unit": "piece",
      "price": 200,
      "icon": "🧹",
      "image": "assets/catalog-images/shoe-brush-d0bdf0.webp",
      "imageLevel": "item"
     },
     {
      "name": "Shoe Insoles Pair",
      "unit": "piece",
      "price": 300,
      "icon": "👟",
      "image": "assets/catalog-images/shoe-insoles-9b6486.webp",
      "imageLevel": "item"
     },
     {
      "name": "Shoe Laces Pair",
      "unit": "piece",
      "price": 100,
      "icon": "🪢",
      "image": "assets/catalog-images/shoe-laces-850b37.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/socks-shoe-care-4204f2.webp"
   }
  ]
 },
 {
  "shopType": "Auto & Motorcycle Parts",
  "icon": "🏍️",
  "categories": [
   {
    "name": "70cc Bike Engine Parts",
    "items": [
     {
      "name": "Piston Kit 70cc",
      "unit": "piece",
      "price": 1800,
      "icon": "⚙️",
      "imageUrl": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8bW90b3JjeWNsZSUyMGVuZ2luZSUyMHBhcnRzfGVufDF8fHx8MTc5MjI1NTQ4OHww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Chad Kirchoff",
       "profileUrl": "https://unsplash.com/@cakirchoff",
       "photoUrl": "https://unsplash.com/photos/gray-and-black-engine-xe-e69j6-Ds",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/xe-e69j6-Ds/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8bW90b3JjeWNsZSUyMGVuZ2luZSUyMHBhcnRzfGVufDF8fHx8MTc5MjI1NTQ4OHww"
     },
     {
      "name": "Cylinder Kit 70cc",
      "unit": "piece",
      "price": 4500,
      "icon": "⚙️",
      "imageUrl": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8bW90b3JjeWNsZSUyMGVuZ2luZSUyMHBhcnRzfGVufDF8fHx8MTc5MjI1NTQ4OHww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Chad Kirchoff",
       "profileUrl": "https://unsplash.com/@cakirchoff",
       "photoUrl": "https://unsplash.com/photos/gray-and-black-engine-xe-e69j6-Ds",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/xe-e69j6-Ds/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8bW90b3JjeWNsZSUyMGVuZ2luZSUyMHBhcnRzfGVufDF8fHx8MTc5MjI1NTQ4OHww"
     },
     {
      "name": "Clutch Plates Set 70cc",
      "unit": "piece",
      "price": 1200,
      "icon": "⚙️",
      "imageUrl": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8bW90b3JjeWNsZSUyMGVuZ2luZSUyMHBhcnRzfGVufDF8fHx8MTc5MjI1NTQ4OHww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Chad Kirchoff",
       "profileUrl": "https://unsplash.com/@cakirchoff",
       "photoUrl": "https://unsplash.com/photos/gray-and-black-engine-xe-e69j6-Ds",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/xe-e69j6-Ds/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8bW90b3JjeWNsZSUyMGVuZ2luZSUyMHBhcnRzfGVufDF8fHx8MTc5MjI1NTQ4OHww"
     },
     {
      "name": "Clutch Cable 70cc",
      "unit": "piece",
      "price": 250,
      "icon": "🔗",
      "imageUrl": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8bW90b3JjeWNsZSUyMGVuZ2luZSUyMHBhcnRzfGVufDF8fHx8MTc5MjI1NTQ4OHww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Chad Kirchoff",
       "profileUrl": "https://unsplash.com/@cakirchoff",
       "photoUrl": "https://unsplash.com/photos/gray-and-black-engine-xe-e69j6-Ds",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/xe-e69j6-Ds/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8bW90b3JjeWNsZSUyMGVuZ2luZSUyMHBhcnRzfGVufDF8fHx8MTc5MjI1NTQ4OHww"
     },
     {
      "name": "Accelerator Cable 70cc",
      "unit": "piece",
      "price": 200,
      "icon": "🔗",
      "imageUrl": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8bW90b3JjeWNsZSUyMGVuZ2luZSUyMHBhcnRzfGVufDF8fHx8MTc5MjI1NTQ4OHww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Chad Kirchoff",
       "profileUrl": "https://unsplash.com/@cakirchoff",
       "photoUrl": "https://unsplash.com/photos/gray-and-black-engine-xe-e69j6-Ds",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/xe-e69j6-Ds/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8bW90b3JjeWNsZSUyMGVuZ2luZSUyMHBhcnRzfGVufDF8fHx8MTc5MjI1NTQ4OHww"
     },
     {
      "name": "Front Brake Cable 70cc",
      "unit": "piece",
      "price": 180,
      "icon": "🔗",
      "imageUrl": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8bW90b3JjeWNsZSUyMGVuZ2luZSUyMHBhcnRzfGVufDF8fHx8MTc5MjI1NTQ4OHww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Chad Kirchoff",
       "profileUrl": "https://unsplash.com/@cakirchoff",
       "photoUrl": "https://unsplash.com/photos/gray-and-black-engine-xe-e69j6-Ds",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/xe-e69j6-Ds/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8bW90b3JjeWNsZSUyMGVuZ2luZSUyMHBhcnRzfGVufDF8fHx8MTc5MjI1NTQ4OHww"
     },
     {
      "name": "Chain Sprocket Set 70cc",
      "unit": "piece",
      "price": 1600,
      "icon": "⛓️",
      "imageUrl": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8bW90b3JjeWNsZSUyMGVuZ2luZSUyMHBhcnRzfGVufDF8fHx8MTc5MjI1NTQ4OHww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Chad Kirchoff",
       "profileUrl": "https://unsplash.com/@cakirchoff",
       "photoUrl": "https://unsplash.com/photos/gray-and-black-engine-xe-e69j6-Ds",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/xe-e69j6-Ds/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8bW90b3JjeWNsZSUyMGVuZ2luZSUyMHBhcnRzfGVufDF8fHx8MTc5MjI1NTQ4OHww"
     },
     {
      "name": "Drive Chain 420",
      "unit": "piece",
      "price": 900,
      "icon": "⛓️",
      "image": "assets/catalog-images/drive-chain-420-f341da.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8bW90b3JjeWNsZSUyMGVuZ2luZSUyMHBhcnRzfGVufDF8fHx8MTc5MjI1NTQ4OHww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Chad Kirchoff",
       "profileUrl": "https://unsplash.com/@cakirchoff",
       "photoUrl": "https://unsplash.com/photos/gray-and-black-engine-xe-e69j6-Ds",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/xe-e69j6-Ds/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8bW90b3JjeWNsZSUyMGVuZ2luZSUyMHBhcnRzfGVufDF8fHx8MTc5MjI1NTQ4OHww"
     },
     {
      "name": "Spark Plug",
      "unit": "piece",
      "price": 350,
      "icon": "🔌",
      "image": "assets/catalog-images/spark-plug-537992.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8bW90b3JjeWNsZSUyMGVuZ2luZSUyMHBhcnRzfGVufDF8fHx8MTc5MjI1NTQ4OHww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Chad Kirchoff",
       "profileUrl": "https://unsplash.com/@cakirchoff",
       "photoUrl": "https://unsplash.com/photos/gray-and-black-engine-xe-e69j6-Ds",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/xe-e69j6-Ds/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8bW90b3JjeWNsZSUyMGVuZ2luZSUyMHBhcnRzfGVufDF8fHx8MTc5MjI1NTQ4OHww"
     },
     {
      "name": "CDI Unit 70cc",
      "unit": "piece",
      "price": 1200,
      "icon": "⚡",
      "imageUrl": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8bW90b3JjeWNsZSUyMGVuZ2luZSUyMHBhcnRzfGVufDF8fHx8MTc5MjI1NTQ4OHww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Chad Kirchoff",
       "profileUrl": "https://unsplash.com/@cakirchoff",
       "photoUrl": "https://unsplash.com/photos/gray-and-black-engine-xe-e69j6-Ds",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/xe-e69j6-Ds/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8bW90b3JjeWNsZSUyMGVuZ2luZSUyMHBhcnRzfGVufDF8fHx8MTc5MjI1NTQ4OHww"
     },
     {
      "name": "Ignition Coil",
      "unit": "piece",
      "price": 900,
      "icon": "⚡",
      "image": "assets/catalog-images/ignition-coil-6cbbbf.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8bW90b3JjeWNsZSUyMGVuZ2luZSUyMHBhcnRzfGVufDF8fHx8MTc5MjI1NTQ4OHww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Chad Kirchoff",
       "profileUrl": "https://unsplash.com/@cakirchoff",
       "photoUrl": "https://unsplash.com/photos/gray-and-black-engine-xe-e69j6-Ds",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/xe-e69j6-Ds/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8bW90b3JjeWNsZSUyMGVuZ2luZSUyMHBhcnRzfGVufDF8fHx8MTc5MjI1NTQ4OHww"
     },
     {
      "name": "Rectifier Regulator",
      "unit": "piece",
      "price": 800,
      "icon": "⚡",
      "image": "assets/catalog-images/rectifier-regulator-71e350.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8bW90b3JjeWNsZSUyMGVuZ2luZSUyMHBhcnRzfGVufDF8fHx8MTc5MjI1NTQ4OHww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Chad Kirchoff",
       "profileUrl": "https://unsplash.com/@cakirchoff",
       "photoUrl": "https://unsplash.com/photos/gray-and-black-engine-xe-e69j6-Ds",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/xe-e69j6-Ds/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8bW90b3JjeWNsZSUyMGVuZ2luZSUyMHBhcnRzfGVufDF8fHx8MTc5MjI1NTQ4OHww"
     },
     {
      "name": "Engine Oil Seal Kit",
      "unit": "piece",
      "price": 600,
      "icon": "🔩",
      "image": "assets/catalog-images/engine-oil-seal-kit-cb375c.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8bW90b3JjeWNsZSUyMGVuZ2luZSUyMHBhcnRzfGVufDF8fHx8MTc5MjI1NTQ4OHww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Chad Kirchoff",
       "profileUrl": "https://unsplash.com/@cakirchoff",
       "photoUrl": "https://unsplash.com/photos/gray-and-black-engine-xe-e69j6-Ds",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/xe-e69j6-Ds/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8bW90b3JjeWNsZSUyMGVuZ2luZSUyMHBhcnRzfGVufDF8fHx8MTc5MjI1NTQ4OHww"
     },
     {
      "name": "Spark Plug Wrench",
      "unit": "piece",
      "price": 350,
      "icon": "🔧",
      "imageUrl": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8bW90b3JjeWNsZSUyMGVuZ2luZSUyMHBhcnRzfGVufDF8fHx8MTc5MjI1NTQ4OHww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Chad Kirchoff",
       "profileUrl": "https://unsplash.com/@cakirchoff",
       "photoUrl": "https://unsplash.com/photos/gray-and-black-engine-xe-e69j6-Ds",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/xe-e69j6-Ds/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8bW90b3JjeWNsZSUyMGVuZ2luZSUyMHBhcnRzfGVufDF8fHx8MTc5MjI1NTQ4OHww"
     }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8bW90b3JjeWNsZSUyMGVuZ2luZSUyMHBhcnRzfGVufDF8fHx8MTc5MjI1NTQ4OHww&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Chad Kirchoff",
     "profileUrl": "https://unsplash.com/@cakirchoff",
     "photoUrl": "https://unsplash.com/photos/gray-and-black-engine-xe-e69j6-Ds",
     "source": "Unsplash"
    }
   },
   {
    "name": "Bike Body & Electrical",
    "items": [
     {
      "name": "Headlight Assembly 70cc",
      "unit": "piece",
      "price": 1800,
      "icon": "💡",
      "imageUrl": "https://images.unsplash.com/photo-1651954884976-3549be5452bf?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Roberto Vincenzo Minasi",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-close-up-of-a-motorcycle-_eP4HHsWBVQ",
       "source": "Unsplash"
      }
     },
     {
      "name": "Headlight Bulb 12V",
      "unit": "piece",
      "price": 250,
      "icon": "💡",
      "image": "assets/catalog-images/headlight-bulb-ddd5a7.webp",
      "imageLevel": "item"
     },
     {
      "name": "Tail Light 70cc",
      "unit": "piece",
      "price": 600,
      "icon": "🔴",
      "imageUrl": "https://images.unsplash.com/photo-1725745096249-f6e7c160c4be?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Piotr AMS",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-close-up-of-the-tail-light-of-a-car-HwCb7NxD8Xo",
       "source": "Unsplash"
      }
     },
     {
      "name": "Indicator Set 4pc",
      "unit": "packet",
      "price": 800,
      "icon": "🟠"
     },
     {
      "name": "Side Mirror Pair",
      "unit": "piece",
      "price": 700,
      "icon": "🪞",
      "imageUrl": "https://images.unsplash.com/photo-1735303936540-d62bc740b7b6?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Lera Ginzburg",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-close-up-of-a-mirror-on-a-motorcycle-_EGZAroQjWU",
       "source": "Unsplash"
      }
     },
     {
      "name": "Fuel Tank Cap",
      "unit": "piece",
      "price": 450,
      "icon": "⛽",
      "image": "assets/catalog-images/fuel-tank-cap-4c468b.webp",
      "imageLevel": "item"
     },
     {
      "name": "Handle Grip Pair",
      "unit": "piece",
      "price": 350,
      "icon": "🏍️",
      "image": "assets/catalog-images/handle-grip-1ae1a2.webp",
      "imageLevel": "item"
     },
     {
      "name": "Horn 12V",
      "unit": "piece",
      "price": 500,
      "icon": "📯"
     },
     {
      "name": "Bike Battery 12V 5Ah",
      "unit": "piece",
      "price": 4500,
      "icon": "🔋"
     },
     {
      "name": "Speedometer Cable",
      "unit": "piece",
      "price": 300,
      "icon": "🧵",
      "image": "assets/catalog-images/speedometer-cable-63a1cf.webp",
      "imageLevel": "item"
     },
     {
      "name": "Number Plate Frame",
      "unit": "piece",
      "price": 250,
      "icon": "🔢",
      "image": "assets/catalog-images/number-plate-frame-ddb5de.webp",
      "imageLevel": "item"
     },
     {
      "name": "Bike Hazard Flasher",
      "unit": "piece",
      "price": 600,
      "icon": "⚠️"
     }
    ],
    "image": "assets/catalog-images/bike-body-electrical-721986.webp",
    "imageUrl": "https://images.unsplash.com/photo-1725745096249-f6e7c160c4be?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "Piotr AMS",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/a-close-up-of-the-tail-light-of-a-car-HwCb7NxD8Xo",
     "source": "Unsplash"
    }
   },
   {
    "name": "Tyres & Tubes",
    "items": [
     {
      "name": "Bike Tyre 2.50-17",
      "unit": "piece",
      "price": 3000,
      "icon": "🛞",
      "image": "assets/catalog-images/fix-bike-tyre-197409.webp",
      "imageLevel": "item",
      "credit": {
       "name": "Robert",
       "profileUrl": "",
       "photoUrl": "https://commons.wikimedia.org/wiki/File%3AMotorcycle_tyre_stack.jpg",
       "source": "Wikimedia Commons"
      }
     },
     {
      "name": "Bike Tyre 2.75-17",
      "unit": "piece",
      "price": 3400,
      "icon": "🛞",
      "image": "assets/catalog-images/tyres-tubes-0e5089.webp",
      "imageLevel": "category"
     },
     {
      "name": "Bike Tyre 3.00-17",
      "unit": "piece",
      "price": 3800,
      "icon": "🛞",
      "image": "assets/catalog-images/tyres-tubes-0e5089.webp",
      "imageLevel": "category"
     },
     {
      "name": "Bike Tube 17 inch",
      "unit": "piece",
      "price": 650,
      "icon": "🛞",
      "image": "assets/catalog-images/fix-bike-tube-1728c5.webp",
      "imageLevel": "item",
      "credit": {
       "name": "Fanny Schertzer",
       "profileUrl": "",
       "photoUrl": "https://commons.wikimedia.org/wiki/File%3AChanging_an_inner_tube_-_Adjusting_the_tire.jpg",
       "source": "Wikimedia Commons"
      }
     },
     {
      "name": "Bike Tube 18 inch",
      "unit": "piece",
      "price": 700,
      "icon": "🛞",
      "image": "assets/catalog-images/fix-bike-tube-1728c5.webp",
      "imageLevel": "item",
      "credit": {
       "name": "Fanny Schertzer",
       "profileUrl": "",
       "photoUrl": "https://commons.wikimedia.org/wiki/File%3AChanging_an_inner_tube_-_Adjusting_the_tire.jpg",
       "source": "Wikimedia Commons"
      }
     },
     {
      "name": "Puncture Repair Kit",
      "unit": "piece",
      "price": 400,
      "icon": "🩹",
      "image": "assets/catalog-images/puncture-repair-kit-376959.webp",
      "imageLevel": "item"
     },
     {
      "name": "Foot Air Pump",
      "unit": "piece",
      "price": 1500,
      "icon": "💨"
     },
     {
      "name": "Valve Caps 4-pack",
      "unit": "packet",
      "price": 150,
      "icon": "🔩",
      "image": "assets/catalog-images/valve-caps-4-95bf89.webp",
      "imageLevel": "item"
     },
     {
      "name": "Car Tyre 165/70 R13",
      "unit": "piece",
      "price": 16000,
      "icon": "🚗",
      "image": "assets/catalog-images/car-tyre-165-70-abb2a7.webp",
      "imageLevel": "item"
     },
     {
      "name": "Car Tyre 185/65 R14",
      "unit": "piece",
      "price": 22000,
      "icon": "🚗",
      "image": "assets/catalog-images/tyres-tubes-0e5089.webp",
      "imageLevel": "category"
     }
    ],
    "image": "assets/catalog-images/tyres-tubes-0e5089.webp"
   },
   {
    "name": "Oils & Lubricants",
    "items": [
     {
      "name": "Engine Oil 20W-50 1L",
      "unit": "litre",
      "price": 950,
      "icon": "🛢️",
      "nameUrdu": "موبل آئل",
      "imageUrl": "https://images.unsplash.com/photo-1635437536607-b8572f443763?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Rinald Rolle",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-couple-of-bottles-of-motor-oil-sitting-on-the-ground-IwPT9tPchsA",
       "source": "Unsplash"
      }
     },
     {
      "name": "Engine Oil 10W-30 1L",
      "unit": "litre",
      "price": 1050,
      "icon": "🛢️",
      "image": "assets/catalog-images/engine-oil-30-b0a4cd.webp",
      "imageLevel": "item"
     },
     {
      "name": "Honda 4T Engine Oil 1L",
      "unit": "litre",
      "price": 1100,
      "icon": "🛢️",
      "image": "assets/catalog-images/oils-lubricants-7f1041.webp",
      "imageLevel": "category"
     },
     {
      "name": "Havoline Engine Oil 1L",
      "unit": "litre",
      "price": 1000,
      "icon": "🛢️"
     },
     {
      "name": "Gear Oil 1L",
      "unit": "litre",
      "price": 900,
      "icon": "🛢️",
      "imageUrl": "https://images.unsplash.com/photo-1613214293055-5678e2f6d7de?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Benjamin Brunner",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/black-and-white-plastic-bottle-9ZTpCjmwL2M",
       "source": "Unsplash"
      }
     },
     {
      "name": "Brake Oil 500ml",
      "unit": "piece",
      "price": 550,
      "icon": "🧴"
     },
     {
      "name": "Grease Tin 500g",
      "unit": "piece",
      "price": 650,
      "icon": "🧴"
     },
     {
      "name": "Chain Lube Spray",
      "unit": "piece",
      "price": 800,
      "icon": "⛓️",
      "image": "assets/catalog-images/chain-lube-spray-89e920.webp",
      "imageLevel": "item"
     },
     {
      "name": "Radiator Coolant 1L",
      "unit": "litre",
      "price": 700,
      "icon": "💧",
      "image": "assets/catalog-images/radiator-coolant-b64a1a.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1677230017863-cae4537fd688?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Y2FyJTIwY29vbGFudCUyMGJvdHRsZXxlbnwxfHx8fDE3OTIyNTU1MDZ8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Sincerely Media",
       "profileUrl": "https://unsplash.com/@sincerelymedia",
       "photoUrl": "https://unsplash.com/photos/a-close-up-of-the-engine-of-a-car-Wt4Hi25MT7g",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/Wt4Hi25MT7g/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Y2FyJTIwY29vbGFudCUyMGJvdHRsZXxlbnwxfHx8fDE3OTIyNTU1MDZ8MA",
      "imageSource": "unsplash"
     },
     {
      "name": "Hydraulic Oil 1L",
      "unit": "litre",
      "price": 850,
      "icon": "🛢️",
      "image": "assets/catalog-images/hydraulic-oil-v2-b974fb.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1613214293055-5678e2f6d7de?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8bW90b3IlMjBvaWwlMjBib3R0bGV8ZW58MXx8fHwxNzkyMjU1NTA5fDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Benjamin Brunner",
       "profileUrl": "https://unsplash.com/@ben_brunner",
       "photoUrl": "https://unsplash.com/photos/black-and-white-plastic-bottle-9ZTpCjmwL2M",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/9ZTpCjmwL2M/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8bW90b3IlMjBvaWwlMjBib3R0bGV8ZW58MXx8fHwxNzkyMjU1NTA5fDA",
      "imageSource": "unsplash"
     },
     {
      "name": "Engine Flush 500ml",
      "unit": "piece",
      "price": 650,
      "icon": "🧴",
      "image": "assets/catalog-images/fix-engine-flush-bb759b.webp",
      "imageLevel": "item",
      "credit": {
       "name": "<a href=\"//commons.wikimedia.org/w/index.php?title=User:A7N8X&amp;action=edit&am",
       "profileUrl": "",
       "photoUrl": "https://commons.wikimedia.org/wiki/File%3AEngine_tune-up.jpg",
       "source": "Wikimedia Commons"
      }
     }
    ],
    "image": "assets/catalog-images/oils-lubricants-7f1041.webp"
   },
   {
    "name": "Car Basics",
    "items": [
     {
      "name": "Car Battery 12V 70Ah",
      "unit": "piece",
      "price": 28000,
      "icon": "🔋",
      "image": "assets/catalog-images/car-basics-c7936a.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1676337167629-d896b3ed5724?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Newpowa",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-close-up-of-a-battery-on-a-table-R8eViQysY6U",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Wiper Blade 22 inch",
      "unit": "piece",
      "price": 900,
      "icon": "🚗",
      "image": "assets/catalog-images/wiper-blade-95151a.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1508786250378-b165238d6e8b?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Thibault Valjevac",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/shallow-focus-photography-of-black-vehicle-wiper-2m6GjKScw20",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Wiper Blade 18 inch",
      "unit": "piece",
      "price": 750,
      "icon": "🚗",
      "image": "assets/catalog-images/wiper-blade-95151a.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1508786250378-b165238d6e8b?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Thibault Valjevac",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/shallow-focus-photography-of-black-vehicle-wiper-2m6GjKScw20",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Car Horn Pair",
      "unit": "piece",
      "price": 1200,
      "icon": "📯",
      "image": "assets/catalog-images/car-horn-edeb3d.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1628248345481-9427c5d0df15?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Y2FyJTIwaG9ybiUyMGNsb3NldXB8ZW58MXx8fHwxNzkyMjU1NTAwfDA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Milivoj Kuhar",
       "profileUrl": "https://unsplash.com/@mimithecook",
       "photoUrl": "https://unsplash.com/photos/red-and-silver-steel-outdoor-light-YiUWEeBuydo",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/YiUWEeBuydo/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8Y2FyJTIwaG9ybiUyMGNsb3NldXB8ZW58MXx8fHwxNzkyMjU1NTAwfDA",
      "imageSource": "unsplash"
     },
     {
      "name": "Headlight Bulb H4",
      "unit": "piece",
      "price": 800,
      "icon": "💡"
     },
     {
      "name": "LED Headlight H4 Pair",
      "unit": "piece",
      "price": 3500,
      "icon": "💡"
     },
     {
      "name": "Car Air Freshener",
      "unit": "piece",
      "price": 350,
      "icon": "🌸",
      "image": "assets/catalog-images/car-air-freshener-72c233.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1768983298275-942312c9b446?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "zeliang xiao",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-pyramid-shaped-car-air-freshener-with-liquid-inside-492ILSNVD-E",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Car Floor Mats Set",
      "unit": "piece",
      "price": 2500,
      "icon": "🚗",
      "image": "assets/catalog-images/car-floor-mats-ea4df8.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1761846786526-706cf7015afb?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Obi",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/ford-bronco-emblem-on-car-floor-mat-xNRbX3qFxY",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Car Seat Covers Set",
      "unit": "piece",
      "price": 4500,
      "icon": "💺"
     },
     {
      "name": "Car Shampoo 1L",
      "unit": "litre",
      "price": 600,
      "icon": "🧴"
     },
     {
      "name": "Microfiber Cloth 3-pack",
      "unit": "packet",
      "price": 450,
      "icon": "🧽",
      "image": "assets/catalog-images/microfiber-cloth-3-8980bd.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1761934658112-80095148fe87?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "GoGoNano",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-fluffy-gray-microfiber-cloth-on-a-red-surface-_5kMK55CK9M",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Car Polish 500ml",
      "unit": "piece",
      "price": 750,
      "icon": "✨",
      "image": "assets/catalog-images/car-polish-9f72fe.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1678383407712-1f7d90a4ccf5?q=80&w=800&auto=format&fit=crop",
      "credit": {
       "name": "Tyler",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-man-is-painting-a-green-sports-car-nB6I1YpHOBQ",
       "source": "Unsplash"
      },
      "imageSource": "unsplash"
     },
     {
      "name": "Reverse Camera Kit",
      "unit": "piece",
      "price": 4500,
      "icon": "📷"
     }
    ],
    "image": "assets/catalog-images/car-basics-c7936a.webp",
    "imageUrl": "https://images.unsplash.com/photo-1768983298275-942312c9b446?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "zeliang xiao",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/a-pyramid-shaped-car-air-freshener-with-liquid-inside-492ILSNVD-E",
     "source": "Unsplash"
    }
   },
   {
    "name": "Accessories & Riding Gear",
    "items": [
     {
      "name": "Bike Cover",
      "unit": "piece",
      "price": 1200,
      "icon": "🏍️",
      "imageUrl": "https://images.unsplash.com/photo-1773414052632-c805d4304fce?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Pegah Moghadas",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/motorcycle-covered-with-a-silver-tarp-outdoors-y71LmwokXf8",
       "source": "Unsplash"
      }
     },
     {
      "name": "Car Cover",
      "unit": "piece",
      "price": 2800,
      "icon": "🚗",
      "imageUrl": "https://images.unsplash.com/photo-1596165494776-c27e37f666fe?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Freddy G",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/red-ferrari-car-on-gray-concrete-pavement-TgSXG-YHpNM",
       "source": "Unsplash"
      }
     },
     {
      "name": "Cable Lock",
      "unit": "piece",
      "price": 900,
      "icon": "🔒",
      "image": "assets/catalog-images/cable-lock-3f96a8.webp",
      "imageLevel": "item"
     },
     {
      "name": "Disc Lock with Alarm",
      "unit": "piece",
      "price": 1800,
      "icon": "🔒"
     },
     {
      "name": "Tool Kit 46pc",
      "unit": "piece",
      "price": 2500,
      "icon": "🧰",
      "image": "assets/catalog-images/tool-kit-190878.webp",
      "imageLevel": "item"
     },
     {
      "name": "Helmet Open Face",
      "unit": "piece",
      "price": 1800,
      "icon": "🪖",
      "image": "assets/catalog-images/helmet-open-face-4ed384.webp",
      "imageLevel": "item"
     },
     {
      "name": "Helmet Full Face",
      "unit": "piece",
      "price": 3500,
      "icon": "🪖",
      "image": "assets/catalog-images/helmet-full-face-e09bf7.webp",
      "imageLevel": "item"
     },
     {
      "name": "Riding Gloves",
      "unit": "piece",
      "price": 1200,
      "icon": "🧤",
      "imageUrl": "https://images.unsplash.com/photo-1679224636670-3c77124fcdf6?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Aaron Lefler",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-pair-of-gloves-sitting-on-top-of-a-keyboard-emQMyXVpYns",
       "source": "Unsplash"
      }
     },
     {
      "name": "Knee Guards Pair",
      "unit": "piece",
      "price": 1500,
      "icon": "🦵"
     },
     {
      "name": "LED Fog Lamps Pair",
      "unit": "piece",
      "price": 2200,
      "icon": "💡"
     }
    ],
    "image": "assets/catalog-images/accessories-riding-gear-d10ea3.webp"
   },
   {
    "name": "Filters & Service",
    "items": [
     {
      "name": "Air Filter 70cc",
      "unit": "piece",
      "price": 450,
      "icon": "🫧",
      "image": "assets/catalog-images/fix-fuel-filter-09c5b1.webp",
      "imageLevel": "item",
      "credit": {
       "name": "Mj-bird",
       "profileUrl": "",
       "photoUrl": "https://commons.wikimedia.org/wiki/File%3AOil_filter_and_Fuel_filter_of_UD_Trucks%2C.jpg",
       "source": "Wikimedia Commons"
      }
     },
     {
      "name": "Oil Filter Car",
      "unit": "piece",
      "price": 600,
      "icon": "🛢️",
      "image": "assets/catalog-images/oil-filter-car-1e0963.webp",
      "imageLevel": "item"
     },
     {
      "name": "Fuel Filter",
      "unit": "piece",
      "price": 350,
      "icon": "⛽",
      "image": "assets/catalog-images/fix-fuel-filter-09c5b1.webp",
      "imageLevel": "item",
      "credit": {
       "name": "Mj-bird",
       "profileUrl": "",
       "photoUrl": "https://commons.wikimedia.org/wiki/File%3AOil_filter_and_Fuel_filter_of_UD_Trucks%2C.jpg",
       "source": "Wikimedia Commons"
      }
     },
     {
      "name": "Car Air Filter",
      "unit": "piece",
      "price": 900,
      "icon": "🫧"
     },
     {
      "name": "Cabin Filter",
      "unit": "piece",
      "price": 1200,
      "icon": "🫧",
      "image": "assets/catalog-images/cabin-filter-3b86ca.webp",
      "imageLevel": "item"
     },
     {
      "name": "Front Brake Pads Set",
      "unit": "piece",
      "price": 1800,
      "icon": "🛑",
      "imageUrl": "https://images.unsplash.com/photo-1760317890314-e964ffd7e6a6?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Erik Mclean",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/close-up-of-a-cars-brake-rotor-and-caliper-vS2shmNei2E",
       "source": "Unsplash"
      }
     },
     {
      "name": "Rear Brake Shoes 70cc",
      "unit": "piece",
      "price": 700,
      "icon": "🛑"
     },
     {
      "name": "70cc Service Kit (Oil+Plug+Filter)",
      "unit": "piece",
      "price": 1800,
      "icon": "🧰"
     },
     {
      "name": "Dashboard Shiner",
      "unit": "piece",
      "price": 650,
      "icon": "✨"
     },
     {
      "name": "Tyre Shiner Spray",
      "unit": "piece",
      "price": 550,
      "icon": "✨"
     }
    ],
    "image": "assets/catalog-images/fix-fuel-filter-09c5b1.webp",
    "credit": {
     "name": "Mj-bird",
     "profileUrl": "",
     "photoUrl": "https://commons.wikimedia.org/wiki/File%3AOil_filter_and_Fuel_filter_of_UD_Trucks%2C.jpg",
     "source": "Wikimedia Commons"
    }
   }
  ]
 },
 {
  "shopType": "Agriculture - Seeds, Fertilizer & Pesticides",
  "icon": "🌾",
  "categories": [
   {
    "name": "Fertilizers (Khad)",
    "items": [
     {
      "name": "DAP Bag 50kg",
      "unit": "piece",
      "price": 14500,
      "icon": "🌾",
      "nameUrdu": "کھاد",
      "imageUrl": "https://images.unsplash.com/photo-1710223221719-6251cb1b5c5b?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Kenneth Berrios Alvarez",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-close-up-of-a-bunch-of-white-balls-jvFgC2F4gf8",
       "source": "Unsplash"
      }
     },
     {
      "name": "Urea Bag 50kg",
      "unit": "piece",
      "price": 4500,
      "icon": "🌾",
      "imageUrl": "https://images.unsplash.com/photo-1710223221719-6251cb1b5c5b?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Kenneth Berrios Alvarez",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-close-up-of-a-bunch-of-white-balls-jvFgC2F4gf8",
       "source": "Unsplash"
      }
     },
     {
      "name": "SOP Bag 50kg",
      "unit": "piece",
      "price": 12000,
      "icon": "🌾",
      "imageUrl": "https://images.unsplash.com/photo-1710223221719-6251cb1b5c5b?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Kenneth Berrios Alvarez",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-close-up-of-a-bunch-of-white-balls-jvFgC2F4gf8",
       "source": "Unsplash"
      }
     },
     {
      "name": "NPK 15-15-15 Bag 50kg",
      "unit": "piece",
      "price": 9500,
      "icon": "🌾",
      "image": "assets/catalog-images/fix-npk-bag-942069.webp",
      "imageLevel": "item",
      "credit": {
       "name": "<a href=\"//commons.wikimedia.org/w/index.php?title=User:DBlaine83&amp;action=edi",
       "profileUrl": "",
       "photoUrl": "https://commons.wikimedia.org/wiki/File%3ANPK_Fertilizer.png",
       "source": "Wikimedia Commons"
      }
     },
     {
      "name": "SSP Bag 50kg",
      "unit": "piece",
      "price": 6500,
      "icon": "🌾",
      "imageUrl": "https://images.unsplash.com/photo-1710223221719-6251cb1b5c5b?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Kenneth Berrios Alvarez",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-close-up-of-a-bunch-of-white-balls-jvFgC2F4gf8",
       "source": "Unsplash"
      }
     },
     {
      "name": "CAN Bag 50kg",
      "unit": "piece",
      "price": 5200,
      "icon": "🌾",
      "imageUrl": "https://images.unsplash.com/photo-1710223221719-6251cb1b5c5b?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Kenneth Berrios Alvarez",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-close-up-of-a-bunch-of-white-balls-jvFgC2F4gf8",
       "source": "Unsplash"
      }
     },
     {
      "name": "Zinc Sulphate 5kg",
      "unit": "packet",
      "price": 1800,
      "icon": "⚗️",
      "image": "assets/catalog-images/fix-zinc-sulphate-6fb2af.webp",
      "imageLevel": "item",
      "credit": {
       "name": "Valle de Aves</",
       "profileUrl": "",
       "photoUrl": "https://commons.wikimedia.org/wiki/File%3ALitopon.png",
       "source": "Wikimedia Commons"
      }
     },
     {
      "name": "Boron 3kg",
      "unit": "packet",
      "price": 1500,
      "icon": "⚗️",
      "image": "assets/catalog-images/boron-05d638.webp",
      "imageLevel": "item"
     },
     {
      "name": "Gypsum Bag 50kg",
      "unit": "piece",
      "price": 1200,
      "icon": "⬜",
      "imageUrl": "https://images.unsplash.com/photo-1710223221719-6251cb1b5c5b?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Kenneth Berrios Alvarez",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-close-up-of-a-bunch-of-white-balls-jvFgC2F4gf8",
       "source": "Unsplash"
      }
     },
     {
      "name": "Humic Acid 1kg",
      "unit": "packet",
      "price": 900,
      "icon": "🧪",
      "image": "assets/catalog-images/fix-humic-acid-6c4b87.webp",
      "imageLevel": "item",
      "credit": {
       "name": "<a href=\"//commons.wikimedia.org/w/index.php?title=User:Alexignat&amp;action=edi",
       "profileUrl": "",
       "photoUrl": "https://commons.wikimedia.org/wiki/File%3AHumic_acid.jpg",
       "source": "Wikimedia Commons"
      }
     },
     {
      "name": "Epsom Salt 25kg",
      "unit": "piece",
      "price": 3500,
      "icon": "🧂",
      "imageUrl": "https://images.unsplash.com/photo-1710223221719-6251cb1b5c5b?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Kenneth Berrios Alvarez",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-close-up-of-a-bunch-of-white-balls-jvFgC2F4gf8",
       "source": "Unsplash"
      }
     },
     {
      "name": "Organic Compost 40kg",
      "unit": "piece",
      "price": 1800,
      "icon": "🌱",
      "image": "assets/catalog-images/organic-compost-7e21a4.webp",
      "imageLevel": "item"
     }
    ]
   },
   {
    "name": "Seeds",
    "items": [
     {
      "name": "Wheat Seed 50kg",
      "unit": "piece",
      "price": 6500,
      "icon": "🌾",
      "nameUrdu": "بیج",
      "image": "assets/catalog-images/wheat-seed-3ce27a.webp",
      "imageLevel": "item"
     },
     {
      "name": "Paddy Seed 20kg",
      "unit": "piece",
      "price": 9000,
      "icon": "🌾",
      "image": "assets/catalog-images/paddy-seed-799ca6.webp",
      "imageLevel": "item"
     },
     {
      "name": "Maize Hybrid Seed 4kg",
      "unit": "packet",
      "price": 4500,
      "icon": "🌽",
      "image": "assets/catalog-images/maize-hybrid-seed-9a29ab.webp",
      "imageLevel": "item"
     },
     {
      "name": "Cotton Seed 10kg",
      "unit": "piece",
      "price": 5500,
      "icon": "☁️",
      "image": "assets/catalog-images/fix-cotton-seed-14b354.webp",
      "imageLevel": "item",
      "credit": {
       "name": "<a href=\"//commons.wikimedia.org/wiki/User:Thamizhpparithi_Maari\" title=\"User:Th",
       "profileUrl": "",
       "photoUrl": "https://commons.wikimedia.org/wiki/File%3AA_bag_of_cotton_seeds.JPG",
       "source": "Wikimedia Commons"
      }
     },
     {
      "name": "Mustard Seed 5kg",
      "unit": "packet",
      "price": 2200,
      "icon": "🌼",
      "image": "assets/catalog-images/mustard-seed-85203f.webp",
      "imageLevel": "item"
     },
     {
      "name": "Sunflower Hybrid 2kg",
      "unit": "packet",
      "price": 2800,
      "icon": "🌻",
      "image": "assets/catalog-images/sunflower-hybrid-e8bf98.webp",
      "imageLevel": "item"
     },
     {
      "name": "Onion Seed 1kg",
      "unit": "packet",
      "price": 1800,
      "icon": "🧅",
      "image": "assets/catalog-images/onion-seed-e0ea50.webp",
      "imageLevel": "item"
     },
     {
      "name": "Potato Seed 50kg",
      "unit": "piece",
      "price": 7000,
      "icon": "🥔",
      "image": "assets/catalog-images/fix-potato-seed-d8b23b.webp",
      "imageLevel": "item",
      "credit": {
       "name": "Gaurav Dhwaj Khadka",
       "profileUrl": "",
       "photoUrl": "https://commons.wikimedia.org/wiki/File%3ASeed_Potatoes.jpg",
       "source": "Wikimedia Commons"
      }
     },
     {
      "name": "Bajra Fodder Seed 10kg",
      "unit": "piece",
      "price": 2800,
      "icon": "🌾",
      "image": "assets/catalog-images/seeds-0739fa.webp",
      "imageLevel": "category"
     },
     {
      "name": "Barseem Clover Seed 10kg",
      "unit": "piece",
      "price": 3200,
      "icon": "🍀",
      "image": "assets/catalog-images/seeds-0739fa.webp",
      "imageLevel": "category"
     },
     {
      "name": "Vegetable Seeds Mix Pack",
      "unit": "packet",
      "price": 650,
      "icon": "🥬",
      "image": "assets/catalog-images/vegetable-seeds-mix-c5684d.webp",
      "imageLevel": "item"
     },
     {
      "name": "Tomato Hybrid Seed 100g",
      "unit": "packet",
      "price": 950,
      "icon": "🍅",
      "image": "assets/catalog-images/seeds-0739fa.webp",
      "imageLevel": "category"
     }
    ],
    "image": "assets/catalog-images/seeds-0739fa.webp"
   },
   {
    "name": "Pesticides & Sprays",
    "items": [
     {
      "name": "Bifenthrin 1L",
      "unit": "litre",
      "price": 2800,
      "icon": "🧪",
      "nameUrdu": "اسپرے"
     },
     {
      "name": "Lambda Cyhalothrin 500ml",
      "unit": "piece",
      "price": 1400,
      "icon": "🧪",
      "image": "assets/catalog-images/lambda-cyhalothrin-4b0637.webp",
      "imageLevel": "item"
     },
     {
      "name": "Imidacloprid 500ml",
      "unit": "piece",
      "price": 1600,
      "icon": "🧪"
     },
     {
      "name": "Glyphosate 1L",
      "unit": "litre",
      "price": 2200,
      "icon": "🧪",
      "image": "assets/catalog-images/glyphosate-4b322e.webp",
      "imageLevel": "item"
     },
     {
      "name": "Atrazine 1kg",
      "unit": "packet",
      "price": 1800,
      "icon": "🧪"
     },
     {
      "name": "Mancozeb 400g",
      "unit": "packet",
      "price": 900,
      "icon": "🧪",
      "image": "assets/catalog-images/pesticides-sprays-ed7f90.webp",
      "imageLevel": "category"
     },
     {
      "name": "Copper Oxychloride 1kg",
      "unit": "packet",
      "price": 1500,
      "icon": "🧪",
      "image": "assets/catalog-images/copper-oxychloride-aaa733.webp",
      "imageLevel": "item"
     },
     {
      "name": "Emamectin 200ml",
      "unit": "piece",
      "price": 1200,
      "icon": "🧪",
      "image": "assets/catalog-images/pesticides-sprays-ed7f90.webp",
      "imageLevel": "category"
     },
     {
      "name": "Chlorpyrifos 1L",
      "unit": "litre",
      "price": 2400,
      "icon": "🧪"
     },
     {
      "name": "Pendimethalin 1L",
      "unit": "litre",
      "price": 2600,
      "icon": "🧪"
     },
     {
      "name": "2,4-D Amine 1L",
      "unit": "litre",
      "price": 1800,
      "icon": "🧪",
      "image": "assets/catalog-images/pesticides-sprays-ed7f90.webp",
      "imageLevel": "category"
     },
     {
      "name": "Sulphur 1kg",
      "unit": "packet",
      "price": 700,
      "icon": "🧪"
     }
    ],
    "image": "assets/catalog-images/pesticides-sprays-ed7f90.webp"
   },
   {
    "name": "Spray Equipment",
    "items": [
     {
      "name": "Knapsack Sprayer 20L",
      "unit": "piece",
      "price": 6500,
      "icon": "🧴",
      "image": "assets/catalog-images/knapsack-sprayer-a21e67.webp",
      "imageLevel": "item"
     },
     {
      "name": "Battery Sprayer 20L",
      "unit": "piece",
      "price": 12000,
      "icon": "🔋",
      "image": "assets/catalog-images/spray-equipment-v2-8fefb6.webp",
      "imageLevel": "category"
     },
     {
      "name": "Hand Pressure Sprayer 5L",
      "unit": "piece",
      "price": 1800,
      "icon": "🧴",
      "image": "assets/catalog-images/hand-pressure-sprayer-47b454.webp",
      "imageLevel": "item"
     },
     {
      "name": "Brass Spray Nozzle",
      "unit": "piece",
      "price": 600,
      "icon": "🔩",
      "image": "assets/catalog-images/brass-spray-nozzle-03cbed.webp",
      "imageLevel": "item"
     },
     {
      "name": "Spray Hose 50ft",
      "unit": "piece",
      "price": 2200,
      "icon": "🧵",
      "imageUrl": "https://images.unsplash.com/photo-1687038520693-e528c10e450a?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Kier in Sight Archives",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-black-wires-are-stacked-together-EYAfw1ujabI",
       "source": "Unsplash"
      }
     },
     {
      "name": "Petrol Mist Blower",
      "unit": "piece",
      "price": 28000,
      "icon": "💨",
      "image": "assets/catalog-images/spray-equipment-v2-8fefb6.webp",
      "imageLevel": "category"
     },
     {
      "name": "Protective Spray Suit",
      "unit": "piece",
      "price": 2500,
      "icon": "🦺",
      "image": "assets/catalog-images/fix-protective-spray-suit-4f79a6.webp",
      "imageLevel": "item",
      "credit": {
       "name": "Wikimedia Commons contributor",
       "profileUrl": "",
       "photoUrl": "https://commons.wikimedia.org/wiki/File%3AUSMC-070619-M-7747B-008.jpg",
       "source": "Wikimedia Commons"
      }
     },
     {
      "name": "Measuring Cylinder 1L",
      "unit": "piece",
      "price": 450,
      "icon": "🧪",
      "image": "assets/catalog-images/measuring-cylinder-f2f5d9.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/spray-equipment-v2-8fefb6.webp"
   },
   {
    "name": "Farm Tools",
    "items": [
     {
      "name": "Spade (Kassi)",
      "unit": "piece",
      "price": 1200,
      "icon": "⛏️",
      "nameUrdu": "کسی",
      "image": "assets/catalog-images/spade-v2-02fb58.webp",
      "imageLevel": "item"
     },
     {
      "name": "Hoe (Kudal)",
      "unit": "piece",
      "price": 900,
      "icon": "⛏️",
      "image": "assets/catalog-images/fix-hoe-f5bead.webp",
      "imageLevel": "item",
      "credit": {
       "name": "Moheen",
       "profileUrl": "",
       "photoUrl": "https://commons.wikimedia.org/wiki/File%3AHoe_-_%E0%A6%A8%E0%A6%BF%E0%A6%A1%E0%A6%BC%E0%A6%BE%E0%A6%A8%E0%A6%BF_-_DSC00544.jpg",
       "source": "Wikimedia Commons"
      }
     },
     {
      "name": "Sickle (Daranti)",
      "unit": "piece",
      "price": 450,
      "icon": "🌾",
      "nameUrdu": "درانتی",
      "image": "assets/catalog-images/fix-sickle-72a7d0.webp",
      "imageLevel": "item",
      "credit": {
       "name": "<a href=\"//commons.wikimedia.org/wiki/User:%E0%A4%9C%E0%A5%8D%E0%A4%9E%E0%A4%BE%",
       "profileUrl": "",
       "photoUrl": "https://commons.wikimedia.org/wiki/File%3AIndian_sickle.png",
       "source": "Wikimedia Commons"
      }
     },
     {
      "name": "Axe (Kulhara)",
      "unit": "piece",
      "price": 1500,
      "icon": "🪓",
      "nameUrdu": "کلہاڑا"
     },
     {
      "name": "Shovel (Belcha)",
      "unit": "piece",
      "price": 1100,
      "icon": "⛏️",
      "image": "assets/catalog-images/fix-shovel-1386d4.webp",
      "imageLevel": "item",
      "credit": {
       "name": "<a href=\"//commons.wikimedia.org/w/index.php?title=User:SvenPek&amp;action=edit&",
       "profileUrl": "",
       "photoUrl": "https://commons.wikimedia.org/wiki/File%3ASkovl.jpg",
       "source": "Wikimedia Commons"
      }
     },
     {
      "name": "Garden Rake",
      "unit": "piece",
      "price": 800,
      "icon": "🧹",
      "image": "assets/catalog-images/fix-garden-rake-1dae37.webp",
      "imageLevel": "item",
      "credit": {
       "name": "Pearson S",
       "profileUrl": "",
       "photoUrl": "https://commons.wikimedia.org/wiki/File%3ARake_-_Tool_3_%28PSF%29.png",
       "source": "Wikimedia Commons"
      }
     },
     {
      "name": "Wheelbarrow",
      "unit": "piece",
      "price": 6500,
      "icon": "🛒",
      "image": "assets/catalog-images/wheelbarrow-23d916.webp",
      "imageLevel": "item"
     },
     {
      "name": "Pruning Shears",
      "unit": "piece",
      "price": 950,
      "icon": "✂️",
      "image": "assets/catalog-images/pruning-shears-d10da8.webp",
      "imageLevel": "item"
     },
     {
      "name": "Water Pipe 2 inch 100ft",
      "unit": "piece",
      "price": 8500,
      "icon": "🚿",
      "imageUrl": "https://images.unsplash.com/photo-1729169927271-7826d8aae360?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Ries Bosch",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-pile-of-pipes-sitting-next-to-each-other-B0jijv2X-U8",
       "source": "Unsplash"
      }
     },
     {
      "name": "Nylon Rope 1kg",
      "unit": "kg",
      "price": 600,
      "icon": "🪢",
      "image": "assets/catalog-images/fix-nylon-rope-57e273.webp",
      "imageLevel": "item",
      "credit": {
       "name": "Angelsharum",
       "profileUrl": "",
       "photoUrl": "https://commons.wikimedia.org/wiki/File%3ANylon_Rope.JPG",
       "source": "Wikimedia Commons"
      }
     }
    ],
    "image": "assets/catalog-images/farm-tools-d39e92.webp"
   },
   {
    "name": "Soil & Irrigation",
    "items": [
     {
      "name": "Soil pH Meter",
      "unit": "piece",
      "price": 1800,
      "icon": "🧪",
      "image": "assets/catalog-images/soil-ph-meter-ad96a8.webp",
      "imageLevel": "item"
     },
     {
      "name": "Soil Moisture Meter",
      "unit": "piece",
      "price": 1500,
      "icon": "💧"
     },
     {
      "name": "Drip Lateral 16mm 100m",
      "unit": "piece",
      "price": 9500,
      "icon": "💧",
      "imageUrl": "https://images.unsplash.com/photo-1687038520693-e528c10e450a?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Kier in Sight Archives",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-black-wires-are-stacked-together-EYAfw1ujabI",
       "source": "Unsplash"
      }
     },
     {
      "name": "Sprinkler Head",
      "unit": "piece",
      "price": 900,
      "icon": "💦",
      "image": "assets/catalog-images/sprinkler-head-6c98a9.webp",
      "imageLevel": "item"
     },
     {
      "name": "PVC Pipe 2 inch 10ft",
      "unit": "piece",
      "price": 1400,
      "icon": "🚿",
      "imageUrl": "https://images.unsplash.com/photo-1729169927271-7826d8aae360?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Ries Bosch",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-pile-of-pipes-sitting-next-to-each-other-B0jijv2X-U8",
       "source": "Unsplash"
      }
     },
     {
      "name": "Foot Valve 2 inch",
      "unit": "piece",
      "price": 1200,
      "icon": "🔩"
     }
    ],
    "image": "assets/catalog-images/soil-irrigation-698550.webp",
    "imageUrl": "https://images.unsplash.com/photo-1687038520693-e528c10e450a?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "Kier in Sight Archives",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/a-bunch-of-black-wires-are-stacked-together-EYAfw1ujabI",
     "source": "Unsplash"
    }
   }
  ]
 },
 {
  "shopType": "Jewelry & Watches",
  "icon": "💎",
  "categories": [
   {
    "name": "Gold Jewelry",
    "items": [
     {
      "name": "Ladies Gold Ring",
      "unit": "piece",
      "price": 220000,
      "icon": "💍",
      "nameUrdu": "انگوٹھی",
      "image": "assets/catalog-images/ladies-gold-ring-cc0b85.webp",
      "imageLevel": "item"
     },
     {
      "name": "Gold Earrings Pair",
      "unit": "piece",
      "price": 180000,
      "icon": "👂",
      "nameUrdu": "بالیاں",
      "image": "assets/catalog-images/gold-earrings-64f24e.webp",
      "imageLevel": "item"
     },
     {
      "name": "Gold Chain 1 Tola",
      "unit": "piece",
      "price": 300000,
      "icon": "⛓️",
      "nameUrdu": "چین",
      "imageUrl": "https://images.unsplash.com/photo-1611107683227-e9060eccd846?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Syed F Hashemi",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/gold-chain-necklace-on-white-surface-aldDZePniqg",
       "source": "Unsplash"
      }
     },
     {
      "name": "Gold Bangles Pair",
      "unit": "piece",
      "price": 450000,
      "icon": "🔶",
      "nameUrdu": "کنگن",
      "image": "assets/catalog-images/gold-bangles-11d034.webp",
      "imageLevel": "item"
     },
     {
      "name": "Gold Locket",
      "unit": "piece",
      "price": 95000,
      "icon": "📿",
      "nameUrdu": "لاکٹ",
      "image": "assets/catalog-images/gold-locket-6fbbc0.webp",
      "imageLevel": "item"
     },
     {
      "name": "Gold Nose Pin",
      "unit": "piece",
      "price": 45000,
      "icon": "👃",
      "nameUrdu": "نتھلی"
     },
     {
      "name": "Gold Bracelet",
      "unit": "piece",
      "price": 260000,
      "icon": "⌚",
      "image": "assets/catalog-images/gold-bracelet-95e91d.webp",
      "imageLevel": "item"
     },
     {
      "name": "Gold Tops Pair",
      "unit": "piece",
      "price": 120000,
      "icon": "✨",
      "imageUrl": "https://images.unsplash.com/photo-1761479271790-c7327d1bc5b3?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Jay Openiano",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/two-gold-stud-earrings-with-embossed-designs-f0CSyUi4PgA",
       "source": "Unsplash"
      }
     }
    ],
    "image": "assets/catalog-images/gold-jewelry-803cb1.webp",
    "imageUrl": "https://images.unsplash.com/photo-1611107683227-e9060eccd846?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "Syed F Hashemi",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/gold-chain-necklace-on-white-surface-aldDZePniqg",
     "source": "Unsplash"
    }
   },
   {
    "name": "Silver Jewelry",
    "items": [
     {
      "name": "Silver Ring",
      "unit": "piece",
      "price": 8000,
      "icon": "💍",
      "nameUrdu": "چاندی کی انگوٹھی",
      "image": "assets/catalog-images/silver-ring-f0ca5f.webp",
      "imageLevel": "item"
     },
     {
      "name": "Silver Chain",
      "unit": "piece",
      "price": 25000,
      "icon": "⛓️",
      "imageUrl": "https://images.unsplash.com/photo-1617071380442-97e4d5a711e6?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Gabriel Dalton",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/silver-chain-link-necklace-on-white-textile-YbLLE8N16h8",
       "source": "Unsplash"
      }
     },
     {
      "name": "Silver Bangles Pair",
      "unit": "piece",
      "price": 35000,
      "icon": "🔶",
      "imageUrl": "https://images.unsplash.com/photo-1639065643006-e217c4fee12e?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Michael Myers",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-diamond-bracelet-on-a-black-background-10eeEq7OxSI",
       "source": "Unsplash"
      }
     },
     {
      "name": "Silver Earrings Pair",
      "unit": "piece",
      "price": 12000,
      "icon": "👂",
      "image": "assets/catalog-images/silver-earrings-f9c081.webp",
      "imageLevel": "item"
     },
     {
      "name": "Silver Locket",
      "unit": "piece",
      "price": 15000,
      "icon": "📿",
      "image": "assets/catalog-images/silver-locket-7ee52f.webp",
      "imageLevel": "item"
     },
     {
      "name": "Silver Bracelet",
      "unit": "piece",
      "price": 18000,
      "icon": "⌚",
      "imageUrl": "https://images.unsplash.com/photo-1676291055501-286c48bb186f?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Ian Talmacs",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-silver-bracelet-with-hearts-and-two-red-stones-mkqraXkMPSE",
       "source": "Unsplash"
      }
     },
     {
      "name": "Silver Anklet Pair (Payal)",
      "unit": "piece",
      "price": 14000,
      "icon": "🦶",
      "nameUrdu": "پائل",
      "image": "assets/catalog-images/silver-anklet-2fe2bc.webp",
      "imageLevel": "item"
     },
     {
      "name": "Silver Nose Pin",
      "unit": "piece",
      "price": 3500,
      "icon": "👃",
      "image": "assets/catalog-images/silver-nose-pin-0cb60b.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/silver-jewelry-b9f812.webp"
   },
   {
    "name": "Artificial Jewelry",
    "items": [
     {
      "name": "Artificial Bangles Set",
      "unit": "piece",
      "price": 1200,
      "icon": "🔶",
      "imageUrl": "https://images.unsplash.com/photo-1612945578381-6481cdd73b0a?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Hush Naidoo Jade Photography",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/gold-and-red-floral-textile-lwjBhbslaF4",
       "source": "Unsplash"
      }
     },
     {
      "name": "Artificial Earrings",
      "unit": "piece",
      "price": 600,
      "icon": "👂",
      "imageUrl": "https://images.unsplash.com/photo-1651160670627-2896ddf7822f?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Subham Hait",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-gold-and-black-necklace-fVeujn3i5ZE",
       "source": "Unsplash"
      }
     },
     {
      "name": "Artificial Necklace Set",
      "unit": "piece",
      "price": 2500,
      "icon": "📿",
      "imageUrl": "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Sabrianna",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/silver-heart-pendant-necklace-on-white-background-u1Hv_erOQH0",
       "source": "Unsplash"
      }
     },
     {
      "name": "Artificial Ring",
      "unit": "piece",
      "price": 450,
      "icon": "💍",
      "imageUrl": "https://images.unsplash.com/photo-1598560917807-1bae44bd2be8?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Sabrianna",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/gold-ring-on-white-surface-NhrcL_C0sFA",
       "source": "Unsplash"
      }
     },
     {
      "name": "Bridal Set Artificial",
      "unit": "piece",
      "price": 8000,
      "icon": "👰",
      "imageUrl": "https://images.unsplash.com/photo-1722410180687-b05b50922362?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "PRAHANT STUDIO",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-necklace-and-earring-on-display-on-a-mannequin-vbsN7MUXyT4",
       "source": "Unsplash"
      }
     },
     {
      "name": "Tikka Jhumar Set",
      "unit": "piece",
      "price": 1800,
      "icon": "✨",
      "nameUrdu": "ٹکہ",
      "image": "assets/catalog-images/artificial-jewelry-9f1ff1.webp",
      "imageLevel": "category"
     },
     {
      "name": "Matha Patti",
      "unit": "piece",
      "price": 1500,
      "icon": "✨",
      "image": "assets/catalog-images/matha-patti-c1696b.webp",
      "imageLevel": "item"
     },
     {
      "name": "Artificial Kamarbandh",
      "unit": "piece",
      "price": 1200,
      "icon": "⛓️",
      "image": "assets/catalog-images/artificial-jewelry-9f1ff1.webp",
      "imageLevel": "category"
     },
     {
      "name": "Pearl Mala",
      "unit": "piece",
      "price": 2000,
      "icon": "📿",
      "image": "assets/catalog-images/pearl-mala-v2-cf0b5f.webp",
      "imageLevel": "item"
     },
     {
      "name": "Hair Accessories Bridal Set",
      "unit": "piece",
      "price": 950,
      "icon": "💇",
      "image": "assets/catalog-images/hair-accessories-bridal-5874b8.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/artificial-jewelry-9f1ff1.webp"
   },
   {
    "name": "Watches & Clocks",
    "items": [
     {
      "name": "Gents Quartz Watch",
      "unit": "piece",
      "price": 3500,
      "icon": "⌚",
      "nameUrdu": "گھڑی",
      "image": "assets/catalog-images/watches-clocks-1d18a6.webp",
      "imageLevel": "category"
     },
     {
      "name": "Ladies Quartz Watch",
      "unit": "piece",
      "price": 2800,
      "icon": "⌚",
      "image": "assets/catalog-images/ladies-quartz-watch-9a1e6c.webp",
      "imageLevel": "item"
     },
     {
      "name": "Digital Sports Watch",
      "unit": "piece",
      "price": 2200,
      "icon": "⌚",
      "image": "assets/catalog-images/digital-sports-watch-v2-5820e9.webp",
      "imageLevel": "item"
     },
     {
      "name": "Smart Watch",
      "unit": "piece",
      "price": 6500,
      "icon": "⌚",
      "image": "assets/catalog-images/smart-watch-v2-520993.webp",
      "imageLevel": "item"
     },
     {
      "name": "Couple Watch Set",
      "unit": "piece",
      "price": 6000,
      "icon": "⌚",
      "imageUrl": "https://images.unsplash.com/photo-1568010213205-81f253b9a040?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Jorg Helberg",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/two-round-silver-colored-watches-with-blue-and-grey-band-QXW7ankytdw",
       "source": "Unsplash"
      }
     },
     {
      "name": "Wall Clock",
      "unit": "piece",
      "price": 1800,
      "icon": "🕐",
      "image": "assets/catalog-images/wall-clock-97ce0f.webp",
      "imageLevel": "item"
     },
     {
      "name": "Alarm Clock",
      "unit": "piece",
      "price": 950,
      "icon": "⏰",
      "image": "assets/catalog-images/alarm-clock-fee75e.webp",
      "imageLevel": "item"
     },
     {
      "name": "Leather Watch Strap",
      "unit": "piece",
      "price": 800,
      "icon": "⌚",
      "image": "assets/catalog-images/leather-watch-strap-be784d.webp",
      "imageLevel": "item"
     },
     {
      "name": "Watch Battery Cell",
      "unit": "piece",
      "price": 150,
      "icon": "🔋",
      "image": "assets/catalog-images/watch-battery-cell-9a42c0.webp",
      "imageLevel": "item"
     },
     {
      "name": "Kids Watch",
      "unit": "piece",
      "price": 1200,
      "icon": "⌚",
      "imageUrl": "https://images.unsplash.com/photo-1706536650926-c10c8a527e72?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Bagzhan Sadvakassov",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-toy-watch-sitting-on-top-of-a-plastic-stand-w2PdZwSY8Uo",
       "source": "Unsplash"
      }
     }
    ],
    "image": "assets/catalog-images/watches-clocks-1d18a6.webp"
   },
   {
    "name": "Repair & Services",
    "items": [
     {
      "name": "Watch Battery Replacement",
      "unit": "piece",
      "price": 300,
      "icon": "🔧",
      "image": "assets/catalog-images/watch-battery-replacement-fe2b9f.webp",
      "imageLevel": "item"
     },
     {
      "name": "Watch Glass Replacement",
      "unit": "piece",
      "price": 800,
      "icon": "🔧",
      "imageUrl": "https://images.unsplash.com/photo-1788125856710-1ae984195874?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Vanishing Point Images",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/watchmaker-repairing-mechanical-watch-movement-WcQnhQo1yqw",
       "source": "Unsplash"
      }
     },
     {
      "name": "Gold Polish Service",
      "unit": "piece",
      "price": 1500,
      "icon": "✨"
     },
     {
      "name": "Ring Resizing Service",
      "unit": "piece",
      "price": 1000,
      "icon": "💍"
     }
    ],
    "image": "assets/catalog-images/repair-services-4f8536.webp"
   }
  ]
 },
 {
  "shopType": "Sports & Fitness",
  "icon": "🏏",
  "categories": [
   {
    "name": "Cricket",
    "items": [
     {
      "name": "Cricket Bat English Willow",
      "unit": "piece",
      "price": 8500,
      "icon": "🏏",
      "nameUrdu": "بیٹ",
      "imageUrl": "https://images.unsplash.com/photo-1758791184255-411236a49346?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Village Cricket Co",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/cricket-bat-leaning-against-a-stone-wall-KGrQ_DNABik",
       "source": "Unsplash"
      }
     },
     {
      "name": "Cricket Bat Kashmir Willow",
      "unit": "piece",
      "price": 2800,
      "icon": "🏏",
      "image": "assets/catalog-images/cricket-bat-kashmir-willow-cc100c.webp",
      "imageLevel": "item"
     },
     {
      "name": "Tennis Ball 3-pack",
      "unit": "packet",
      "price": 450,
      "icon": "🎾",
      "nameUrdu": "گیند",
      "image": "assets/catalog-images/tennis-ball-3-e413d2.webp",
      "imageLevel": "item"
     },
     {
      "name": "Season Ball",
      "unit": "piece",
      "price": 1200,
      "icon": "🔴",
      "imageUrl": "https://images.unsplash.com/photo-1785247859980-c637dab9aefe?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Vivek Narayanankutty Nair",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/hand-gripping-a-red-cricket-ball-with-white-stitching-PLJpY7XErMI",
       "source": "Unsplash"
      }
     },
     {
      "name": "Cricket Kit Bag",
      "unit": "piece",
      "price": 3500,
      "icon": "🎒",
      "image": "assets/catalog-images/cricket-kit-bag-fc15ca.webp",
      "imageLevel": "item"
     },
     {
      "name": "Batting Gloves",
      "unit": "piece",
      "price": 1800,
      "icon": "🧤",
      "image": "assets/catalog-images/batting-gloves-39a061.webp",
      "imageLevel": "item"
     },
     {
      "name": "Batting Pads",
      "unit": "piece",
      "price": 2200,
      "icon": "🦵",
      "image": "assets/catalog-images/batting-pads-dba865.webp",
      "imageLevel": "item"
     },
     {
      "name": "Cricket Helmet",
      "unit": "piece",
      "price": 3200,
      "icon": "🪖",
      "image": "assets/catalog-images/cricket-helmet-5d9ede.webp",
      "imageLevel": "item"
     },
     {
      "name": "Wooden Stumps Set",
      "unit": "piece",
      "price": 1500,
      "icon": "🏏",
      "imageUrl": "https://images.unsplash.com/photo-1624897174291-1bd715e371d5?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "tazain bin alam",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/grayscale-photo-of-wooden-poles-xtbR_0vDuJc",
       "source": "Unsplash"
      }
     },
     {
      "name": "Abdominal Guard",
      "unit": "piece",
      "price": 600,
      "icon": "🛡️"
     },
     {
      "name": "Wheelie Kit Bag",
      "unit": "piece",
      "price": 4500,
      "icon": "🎒",
      "imageUrl": "https://images.unsplash.com/photo-1692506530242-c12d6c3ae2e2?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "SJ",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-green-bag-sitting-on-top-of-a-wooden-table-x2Yak4o2UH8",
       "source": "Unsplash"
      }
     },
     {
      "name": "Grip Cone 3-pack",
      "unit": "packet",
      "price": 350,
      "icon": "🏏"
     }
    ],
    "image": "assets/catalog-images/cricket-a90edc.webp",
    "imageUrl": "https://images.unsplash.com/photo-1692506530242-c12d6c3ae2e2?q=80&w=800&auto=format&fit=crop",
    "credit": {
     "name": "SJ",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/a-green-bag-sitting-on-top-of-a-wooden-table-x2Yak4o2UH8",
     "source": "Unsplash"
    }
   },
   {
    "name": "Football",
    "items": [
     {
      "name": "Football Size 5",
      "unit": "piece",
      "price": 1800,
      "icon": "⚽",
      "imageUrl": "https://images.unsplash.com/photo-1769356636430-e04718f78ee8?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Noa GENOUD",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-classic-soccer-ball-rests-on-green-grass-dHZAiGK0KYg",
       "source": "Unsplash"
      }
     },
     {
      "name": "Football Size 4",
      "unit": "piece",
      "price": 1500,
      "icon": "⚽",
      "imageUrl": "https://images.unsplash.com/photo-1769356636430-e04718f78ee8?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Noa GENOUD",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/a-classic-soccer-ball-rests-on-green-grass-dHZAiGK0KYg",
       "source": "Unsplash"
      }
     },
     {
      "name": "Futsal Ball",
      "unit": "piece",
      "price": 1600,
      "icon": "⚽",
      "image": "assets/catalog-images/futsal-ball-ace68a.webp",
      "imageLevel": "item"
     },
     {
      "name": "Goalkeeper Gloves",
      "unit": "piece",
      "price": 1400,
      "icon": "🧤",
      "image": "assets/catalog-images/goalkeeper-gloves-405c4a.webp",
      "imageLevel": "item"
     },
     {
      "name": "Shin Guards",
      "unit": "piece",
      "price": 700,
      "icon": "🦵",
      "image": "assets/catalog-images/shin-guards-655a67.webp",
      "imageLevel": "item"
     },
     {
      "name": "Football Pump",
      "unit": "piece",
      "price": 600,
      "icon": "💨"
     },
     {
      "name": "Referee Whistle",
      "unit": "piece",
      "price": 250,
      "icon": "📯",
      "image": "assets/catalog-images/referee-whistle-4fae63.webp",
      "imageLevel": "item"
     },
     {
      "name": "Training Cones 10-pack",
      "unit": "packet",
      "price": 900,
      "icon": "🔶",
      "image": "assets/catalog-images/training-cones-10-31af71.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/football-449a5f.webp"
   },
   {
    "name": "Badminton & Racket Sports",
    "items": [
     {
      "name": "Badminton Racket Pair",
      "unit": "piece",
      "price": 2800,
      "icon": "🏸",
      "image": "assets/catalog-images/badminton-racket-d875d3.webp",
      "imageLevel": "item"
     },
     {
      "name": "Shuttlecock 6-pack",
      "unit": "packet",
      "price": 900,
      "icon": "🏸",
      "imageUrl": "https://images.unsplash.com/photo-1623998021722-b934f73081df?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Saif71.com",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/white-and-black-paper-lantern-n3HjfZPuT5w",
       "source": "Unsplash"
      }
     },
     {
      "name": "Badminton Net",
      "unit": "piece",
      "price": 2200,
      "icon": "🥅"
     },
     {
      "name": "Tennis Racket",
      "unit": "piece",
      "price": 4500,
      "icon": "🎾",
      "image": "assets/catalog-images/tennis-racket-d07ea6.webp",
      "imageLevel": "item"
     },
     {
      "name": "Tennis Balls 3-pack",
      "unit": "packet",
      "price": 1200,
      "icon": "🎾",
      "imageUrl": "https://images.unsplash.com/photo-1785703531263-f43b0bb3fcf8?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Mario Gogh",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/numerous-green-tennis-balls-with-visible-seams-UFm5RVwyeH4",
       "source": "Unsplash"
      }
     },
     {
      "name": "Squash Racket",
      "unit": "piece",
      "price": 3800,
      "icon": "🎾"
     },
     {
      "name": "Table Tennis Bats Pair",
      "unit": "piece",
      "price": 1600,
      "icon": "🏓",
      "image": "assets/catalog-images/table-tennis-bats-35d973.webp",
      "imageLevel": "item"
     },
     {
      "name": "TT Balls 6-pack",
      "unit": "packet",
      "price": 500,
      "icon": "🏓",
      "imageUrl": "https://images.unsplash.com/photo-1676827613262-5fba25cee5fd?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Inkiipow",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/two-ping-pong-paddles-and-an-orange-ball-on-a-blue-table-JwxatcF2Oec",
       "source": "Unsplash"
      }
     }
    ],
    "image": "assets/catalog-images/badminton-racket-sports-512c12.webp"
   },
   {
    "name": "Gym & Fitness",
    "items": [
     {
      "name": "Dumbbell 5kg Pair",
      "unit": "piece",
      "price": 4500,
      "icon": "🏋️",
      "nameUrdu": "ڈمبل",
      "image": "assets/catalog-images/dumbbell-v2-f0206a.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Danielle Cerullo",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/woman-standing-surrounded-by-exercise-equipment-CQfNt66ttZM",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Dumbbell 10kg Pair",
      "unit": "piece",
      "price": 8500,
      "icon": "🏋️",
      "image": "assets/catalog-images/dumbbell-v2-f0206a.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Danielle Cerullo",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/woman-standing-surrounded-by-exercise-equipment-CQfNt66ttZM",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Kettlebell 12kg",
      "unit": "piece",
      "price": 6500,
      "icon": "🏋️",
      "image": "assets/catalog-images/kettlebell-68a20e.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Danielle Cerullo",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/woman-standing-surrounded-by-exercise-equipment-CQfNt66ttZM",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Barbell Rod 5ft",
      "unit": "piece",
      "price": 4500,
      "icon": "🏋️",
      "image": "assets/catalog-images/gym-fitness-97d494.webp",
      "imageLevel": "category",
      "imageUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Danielle Cerullo",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/woman-standing-surrounded-by-exercise-equipment-CQfNt66ttZM",
       "source": "Unsplash"
      },
      "downloadLocation": "",
      "imageSource": "unsplash"
     },
     {
      "name": "Weight Plate 10kg",
      "unit": "piece",
      "price": 3200,
      "icon": "🏋️",
      "image": "assets/catalog-images/weight-plate-f780fb.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Danielle Cerullo",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/woman-standing-surrounded-by-exercise-equipment-CQfNt66ttZM",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Bench Press Bench",
      "unit": "piece",
      "price": 18000,
      "icon": "🏋️",
      "image": "assets/catalog-images/bench-press-bench-d88a9a.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Danielle Cerullo",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/woman-standing-surrounded-by-exercise-equipment-CQfNt66ttZM",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Skipping Rope",
      "unit": "piece",
      "price": 600,
      "icon": "🪢",
      "image": "assets/catalog-images/skipping-rope-2c5a4e.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Danielle Cerullo",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/woman-standing-surrounded-by-exercise-equipment-CQfNt66ttZM",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Yoga Mat",
      "unit": "piece",
      "price": 1500,
      "icon": "🧘",
      "image": "assets/catalog-images/yoga-mat-2a7058.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Danielle Cerullo",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/woman-standing-surrounded-by-exercise-equipment-CQfNt66ttZM",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Gym Gloves",
      "unit": "piece",
      "price": 900,
      "icon": "🧤",
      "image": "assets/catalog-images/gym-gloves-4cdd34.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Danielle Cerullo",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/woman-standing-surrounded-by-exercise-equipment-CQfNt66ttZM",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Resistance Bands Set",
      "unit": "piece",
      "price": 1800,
      "icon": "🎗️",
      "image": "assets/catalog-images/resistance-bands-v2-49a20f.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Danielle Cerullo",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/woman-standing-surrounded-by-exercise-equipment-CQfNt66ttZM",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Doorway Pull-up Bar",
      "unit": "piece",
      "price": 3500,
      "icon": "🏋️",
      "image": "assets/catalog-images/doorway-pull-up-bar-7e1534.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Danielle Cerullo",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/woman-standing-surrounded-by-exercise-equipment-CQfNt66ttZM",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Push-up Bars Pair",
      "unit": "piece",
      "price": 1200,
      "icon": "🏋️",
      "image": "assets/catalog-images/push-up-bars-577068.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Danielle Cerullo",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/woman-standing-surrounded-by-exercise-equipment-CQfNt66ttZM",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Ab Wheel",
      "unit": "piece",
      "price": 1100,
      "icon": "⭕",
      "image": "assets/catalog-images/ab-wheel-3ebc75.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Danielle Cerullo",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/woman-standing-surrounded-by-exercise-equipment-CQfNt66ttZM",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     },
     {
      "name": "Gym Water Bottle",
      "unit": "piece",
      "price": 800,
      "icon": "💧",
      "image": "assets/catalog-images/gym-water-bottle-e424f0.webp",
      "imageLevel": "item",
      "imageUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Danielle Cerullo",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/woman-standing-surrounded-by-exercise-equipment-CQfNt66ttZM",
       "source": "Unsplash"
      },
      "downloadLocation": ""
     }
    ],
    "image": "assets/catalog-images/gym-fitness-97d494.webp",
    "imageUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Danielle Cerullo",
     "profileUrl": "",
     "photoUrl": "https://unsplash.com/photos/woman-standing-surrounded-by-exercise-equipment-CQfNt66ttZM",
     "source": "Unsplash"
    }
   },
   {
    "name": "Outdoor & Indoor Games",
    "items": [
     {
      "name": "Volleyball",
      "unit": "piece",
      "price": 1600,
      "icon": "🏐",
      "image": "assets/catalog-images/volleyball-c26e25.webp",
      "imageLevel": "item"
     },
     {
      "name": "Basketball",
      "unit": "piece",
      "price": 2200,
      "icon": "🏀",
      "imageUrl": "https://images.unsplash.com/photo-1627627256672-027a4613d028?q=80&w=800&auto=format&fit=crop",
      "imageSource": "unsplash",
      "credit": {
       "name": "Kylie Osullivan",
       "profileUrl": "",
       "photoUrl": "https://unsplash.com/photos/brown-and-black-basketball-ball-BfaBLVCBTI8",
       "source": "Unsplash"
      }
     },
     {
      "name": "Hockey Stick",
      "unit": "piece",
      "price": 2800,
      "icon": "🏑",
      "image": "assets/catalog-images/hockey-stick-985a08.webp",
      "imageLevel": "item"
     },
     {
      "name": "Carrom Board",
      "unit": "piece",
      "price": 3500,
      "icon": "🎯",
      "image": "assets/catalog-images/carrom-board-ea622e.webp",
      "imageLevel": "item"
     },
     {
      "name": "Carrom Coins Set",
      "unit": "piece",
      "price": 600,
      "icon": "⭕",
      "image": "assets/catalog-images/carrom-coins-c6fe0d.webp",
      "imageLevel": "item"
     },
     {
      "name": "Ludo Board",
      "unit": "piece",
      "price": 450,
      "icon": "🎲",
      "image": "assets/catalog-images/ludo-board-09aa6d.webp",
      "imageLevel": "item"
     },
     {
      "name": "Chess Set",
      "unit": "piece",
      "price": 1200,
      "icon": "♟️",
      "image": "assets/catalog-images/chess-0727c2.webp",
      "imageLevel": "item"
     },
     {
      "name": "Dart Board",
      "unit": "piece",
      "price": 2500,
      "icon": "🎯",
      "image": "assets/catalog-images/dart-board-05e142.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/outdoor-indoor-games-97a3aa.webp"
   }
  ]
 },
 {
  "shopType": "Paan & Tobacco Shop",
  "icon": "🍃",
  "categories": [
   {
    "name": "Paan Ingredients",
    "items": [
     {
      "name": "Betel Leaf (Paan Patta) dozen",
      "unit": "dozen",
      "price": 150,
      "icon": "🍃",
      "nameUrdu": "پان",
      "image": "assets/catalog-images/paan-ingredients-1c67bd.webp",
      "imageLevel": "category"
     },
     {
      "name": "Areca Nut (Supari) 250g",
      "unit": "packet",
      "price": 400,
      "icon": "🌰",
      "nameUrdu": "سپاری",
      "image": "assets/catalog-images/paan-ingredients-1c67bd.webp",
      "imageLevel": "category"
     },
     {
      "name": "Slaked Lime (Chuna) 100g",
      "unit": "packet",
      "price": 150,
      "icon": "⬜",
      "nameUrdu": "چونا",
      "image": "assets/catalog-images/paan-ingredients-1c67bd.webp",
      "imageLevel": "category"
     },
     {
      "name": "Kattha 100g",
      "unit": "packet",
      "price": 300,
      "icon": "🟤",
      "nameUrdu": "کتھا",
      "image": "assets/catalog-images/paan-ingredients-1c67bd.webp",
      "imageLevel": "category"
     },
     {
      "name": "Cardamom (Elaichi) 50g",
      "unit": "packet",
      "price": 600,
      "icon": "🫛",
      "nameUrdu": "الائچی",
      "image": "assets/catalog-images/paan-ingredients-1c67bd.webp",
      "imageLevel": "category"
     },
     {
      "name": "Coconut Powder 250g",
      "unit": "packet",
      "price": 350,
      "icon": "🥥",
      "image": "assets/catalog-images/paan-ingredients-1c67bd.webp",
      "imageLevel": "category"
     },
     {
      "name": "Fennel Seeds (Saunf) 250g",
      "unit": "packet",
      "price": 300,
      "icon": "🌱",
      "nameUrdu": "سونف",
      "image": "assets/catalog-images/paan-ingredients-1c67bd.webp",
      "imageLevel": "category"
     },
     {
      "name": "Gulkand 100g",
      "unit": "packet",
      "price": 250,
      "icon": "🌹",
      "nameUrdu": "گل قند",
      "image": "assets/catalog-images/paan-ingredients-1c67bd.webp",
      "imageLevel": "category"
     }
    ],
    "image": "assets/catalog-images/paan-ingredients-1c67bd.webp"
   },
   {
    "name": "Supari & Chewables",
    "items": [
     {
      "name": "Sweet Supari Pouch",
      "unit": "packet",
      "price": 450,
      "icon": "🌰",
      "imageUrl": "https://images.unsplash.com/photo-1733743366591-398701d23feb?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8YmV0ZWwlMjBudXQlMjBhcmVjYSUyMG51dHxlbnwxfHx8fDE3OTIyNTU0OTB8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Praswin Prakashan",
       "profileUrl": "https://unsplash.com/@praswinprakashan",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-fruit-hanging-from-a-palm-tree-XSlZ5HVsOIQ",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/XSlZ5HVsOIQ/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8YmV0ZWwlMjBudXQlMjBhcmVjYSUyMG51dHxlbnwxfHx8fDE3OTIyNTU0OTB8MA"
     },
     {
      "name": "Roasted Supari 250g",
      "unit": "packet",
      "price": 500,
      "icon": "🌰",
      "imageUrl": "https://images.unsplash.com/photo-1733743366591-398701d23feb?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8YmV0ZWwlMjBudXQlMjBhcmVjYSUyMG51dHxlbnwxfHx8fDE3OTIyNTU0OTB8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Praswin Prakashan",
       "profileUrl": "https://unsplash.com/@praswinprakashan",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-fruit-hanging-from-a-palm-tree-XSlZ5HVsOIQ",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/XSlZ5HVsOIQ/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8YmV0ZWwlMjBudXQlMjBhcmVjYSUyMG51dHxlbnwxfHx8fDE3OTIyNTU0OTB8MA"
     },
     {
      "name": "Saunf Supari Mix 250g",
      "unit": "packet",
      "price": 350,
      "icon": "🌱",
      "imageUrl": "https://images.unsplash.com/photo-1733743366591-398701d23feb?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8YmV0ZWwlMjBudXQlMjBhcmVjYSUyMG51dHxlbnwxfHx8fDE3OTIyNTU0OTB8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Praswin Prakashan",
       "profileUrl": "https://unsplash.com/@praswinprakashan",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-fruit-hanging-from-a-palm-tree-XSlZ5HVsOIQ",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/XSlZ5HVsOIQ/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8YmV0ZWwlMjBudXQlMjBhcmVjYSUyMG51dHxlbnwxfHx8fDE3OTIyNTU0OTB8MA"
     },
     {
      "name": "Elaichi Dana 100g",
      "unit": "packet",
      "price": 400,
      "icon": "🫛",
      "imageUrl": "https://images.unsplash.com/photo-1733743366591-398701d23feb?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8YmV0ZWwlMjBudXQlMjBhcmVjYSUyMG51dHxlbnwxfHx8fDE3OTIyNTU0OTB8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Praswin Prakashan",
       "profileUrl": "https://unsplash.com/@praswinprakashan",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-fruit-hanging-from-a-palm-tree-XSlZ5HVsOIQ",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/XSlZ5HVsOIQ/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8YmV0ZWwlMjBudXQlMjBhcmVjYSUyMG51dHxlbnwxfHx8fDE3OTIyNTU0OTB8MA"
     },
     {
      "name": "Coconut Supari 250g",
      "unit": "packet",
      "price": 300,
      "icon": "🥥",
      "imageUrl": "https://images.unsplash.com/photo-1733743366591-398701d23feb?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8YmV0ZWwlMjBudXQlMjBhcmVjYSUyMG51dHxlbnwxfHx8fDE3OTIyNTU0OTB8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Praswin Prakashan",
       "profileUrl": "https://unsplash.com/@praswinprakashan",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-fruit-hanging-from-a-palm-tree-XSlZ5HVsOIQ",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/XSlZ5HVsOIQ/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8YmV0ZWwlMjBudXQlMjBhcmVjYSUyMG51dHxlbnwxfHx8fDE3OTIyNTU0OTB8MA"
     },
     {
      "name": "Mitha Pan Masala 200g",
      "unit": "packet",
      "price": 550,
      "icon": "🍬",
      "imageUrl": "https://images.unsplash.com/photo-1733743366591-398701d23feb?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8YmV0ZWwlMjBudXQlMjBhcmVjYSUyMG51dHxlbnwxfHx8fDE3OTIyNTU0OTB8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "credit": {
       "name": "Praswin Prakashan",
       "profileUrl": "https://unsplash.com/@praswinprakashan",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-fruit-hanging-from-a-palm-tree-XSlZ5HVsOIQ",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/XSlZ5HVsOIQ/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8YmV0ZWwlMjBudXQlMjBhcmVjYSUyMG51dHxlbnwxfHx8fDE3OTIyNTU0OTB8MA"
     }
    ],
    "imageUrl": "https://images.unsplash.com/photo-1733743366591-398701d23feb?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8YmV0ZWwlMjBudXQlMjBhcmVjYSUyMG51dHxlbnwxfHx8fDE3OTIyNTU0OTB8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
    "credit": {
     "name": "Praswin Prakashan",
     "profileUrl": "https://unsplash.com/@praswinprakashan",
     "photoUrl": "https://unsplash.com/photos/a-bunch-of-fruit-hanging-from-a-palm-tree-XSlZ5HVsOIQ",
     "source": "Unsplash"
    }
   },
   {
    "name": "Cigarettes (Retail Packs)",
    "items": [
     {
      "name": "Gold Leaf Pack 20",
      "unit": "piece",
      "price": 650,
      "icon": "🚬",
      "imageUrl": "https://images.unsplash.com/photo-1733743366591-398701d23feb?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8YmV0ZWwlMjBudXQlMjBhcmVjYSUyMG51dHxlbnwxfHx8fDE3OTIyNTU0OTB8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "imageSource": "unsplash",
      "credit": {
       "name": "Praswin Prakashan",
       "profileUrl": "https://unsplash.com/@praswinprakashan",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-fruit-hanging-from-a-palm-tree-XSlZ5HVsOIQ",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/XSlZ5HVsOIQ/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8YmV0ZWwlMjBudXQlMjBhcmVjYSUyMG51dHxlbnwxfHx8fDE3OTIyNTU0OTB8MA"
     },
     {
      "name": "Marlboro Pack 20",
      "unit": "piece",
      "price": 850,
      "icon": "🚬",
      "image": "assets/catalog-images/marlboro-20-2cf50b.webp",
      "imageLevel": "item"
     },
     {
      "name": "Dunhill Pack 20",
      "unit": "piece",
      "price": 900,
      "icon": "🚬",
      "image": "assets/catalog-images/dunhill-20-4c9f6e.webp",
      "imageLevel": "item"
     },
     {
      "name": "Capstan Pack 20",
      "unit": "piece",
      "price": 550,
      "icon": "🚬",
      "imageUrl": "https://images.unsplash.com/photo-1733743366591-398701d23feb?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8YmV0ZWwlMjBudXQlMjBhcmVjYSUyMG51dHxlbnwxfHx8fDE3OTIyNTU0OTB8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "imageSource": "unsplash",
      "credit": {
       "name": "Praswin Prakashan",
       "profileUrl": "https://unsplash.com/@praswinprakashan",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-fruit-hanging-from-a-palm-tree-XSlZ5HVsOIQ",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/XSlZ5HVsOIQ/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8YmV0ZWwlMjBudXQlMjBhcmVjYSUyMG51dHxlbnwxfHx8fDE3OTIyNTU0OTB8MA"
     },
     {
      "name": "Morven Gold Pack 20",
      "unit": "piece",
      "price": 600,
      "icon": "🚬",
      "imageUrl": "https://images.unsplash.com/photo-1733743366591-398701d23feb?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8YmV0ZWwlMjBudXQlMjBhcmVjYSUyMG51dHxlbnwxfHx8fDE3OTIyNTU0OTB8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "imageSource": "unsplash",
      "credit": {
       "name": "Praswin Prakashan",
       "profileUrl": "https://unsplash.com/@praswinprakashan",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-fruit-hanging-from-a-palm-tree-XSlZ5HVsOIQ",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/XSlZ5HVsOIQ/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8YmV0ZWwlMjBudXQlMjBhcmVjYSUyMG51dHxlbnwxfHx8fDE3OTIyNTU0OTB8MA"
     },
     {
      "name": "K2 Pack 20",
      "unit": "piece",
      "price": 500,
      "icon": "🚬",
      "imageUrl": "https://images.unsplash.com/photo-1733743366591-398701d23feb?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8YmV0ZWwlMjBudXQlMjBhcmVjYSUyMG51dHxlbnwxfHx8fDE3OTIyNTU0OTB8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "imageSource": "unsplash",
      "credit": {
       "name": "Praswin Prakashan",
       "profileUrl": "https://unsplash.com/@praswinprakashan",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-fruit-hanging-from-a-palm-tree-XSlZ5HVsOIQ",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/XSlZ5HVsOIQ/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8YmV0ZWwlMjBudXQlMjBhcmVjYSUyMG51dHxlbnwxfHx8fDE3OTIyNTU0OTB8MA"
     },
     {
      "name": "Red & White Pack 20",
      "unit": "piece",
      "price": 520,
      "icon": "🚬",
      "imageUrl": "https://images.unsplash.com/photo-1733743366591-398701d23feb?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8YmV0ZWwlMjBudXQlMjBhcmVjYSUyMG51dHxlbnwxfHx8fDE3OTIyNTU0OTB8MA&ixlib=rb-4.1.0&w=600&q=80&fm=webp&fit=max",
      "imageSource": "unsplash",
      "credit": {
       "name": "Praswin Prakashan",
       "profileUrl": "https://unsplash.com/@praswinprakashan",
       "photoUrl": "https://unsplash.com/photos/a-bunch-of-fruit-hanging-from-a-palm-tree-XSlZ5HVsOIQ",
       "source": "Unsplash"
      },
      "downloadLocation": "https://api.unsplash.com/photos/XSlZ5HVsOIQ/download?ixid=M3wxMTA1NDUyfDB8MXxzZWFyY2h8MXx8YmV0ZWwlMjBudXQlMjBhcmVjYSUyMG51dHxlbnwxfHx8fDE3OTIyNTU0OTB8MA"
     }
    ]
   },
   {
    "name": "Smoking Accessories",
    "items": [
     {
      "name": "Gas Lighter",
      "unit": "piece",
      "price": 150,
      "icon": "🔥",
      "nameUrdu": "لائٹر",
      "image": "assets/catalog-images/gas-lighter-9d94a3.webp",
      "imageLevel": "item"
     },
     {
      "name": "Matchbox 10-pack",
      "unit": "packet",
      "price": 120,
      "icon": "🔥",
      "image": "assets/catalog-images/matchbox-10-102b3f.webp",
      "imageLevel": "item"
     },
     {
      "name": "Cigarette Case",
      "unit": "piece",
      "price": 400,
      "icon": "📦",
      "image": "assets/catalog-images/cigarette-case-b1cd7b.webp",
      "imageLevel": "item"
     },
     {
      "name": "Ashtray",
      "unit": "piece",
      "price": 350,
      "icon": "🚬",
      "image": "assets/catalog-images/ashtray-4a769e.webp",
      "imageLevel": "item"
     }
    ],
    "image": "assets/catalog-images/smoking-accessories-cc27db.webp"
   }
  ]
 }
];

export const MASTER_CATALOG_ITEM_COUNT = 1720;
