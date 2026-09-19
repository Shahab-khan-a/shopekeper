export type ProductCategory = 
  | 'All'
  | 'Kiryana'
  | 'Grocery'
  | 'Beverages'
  | 'Dairy'
  | 'Snacks'
  | 'Spices'
  | 'Personal Care'
  | 'Bakery'
  | 'Others';

export type ProductUnit = 'piece' | 'kg' | 'packet' | 'litre' | 'dozen' | 'gram' | 'box';

export interface Product {
  id: string;
  name: string;
  nameUrdu?: string;
  image?: string;
  price: number; // Selling price in Rs.
  costPrice?: number; // Cost price in Rs. for profit calculation
  stock: number; // Quantity available
  category: ProductCategory;
  barcode?: string;
  unit: ProductUnit;
  createdAt: number;
  updatedAt: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type PaymentMethod = 'cash' | 'online' | 'udhaar';

export interface Sale {
  id: string;
  billNumber: string; // e.g., INV-1001
  date: string; // ISO string
  customerName?: string;
  customerPhone?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  discountType: 'fixed' | 'percent';
  grandTotal: number;
  totalProfit?: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: number;
}

export interface KhataTransaction {
  id: string;
  date: string;
  type: 'credit_sale' | 'payment_received';
  amount: number;
  billId?: string;
  billNumber?: string;
  note?: string;
}

export interface CustomerKhata {
  id: string;
  name: string;
  nameUrdu?: string;
  phone: string;
  address?: string;
  totalDebt: number; // Total unpaid balance
  transactions: KhataTransaction[];
  lastUpdated: number;
}

export interface ShopSettings {
  profileImage?: string; // Avatar or store logo URI / URL
  shopName: string;
  shopNameUrdu: string;
  ownerName: string;
  businessType?: string; // e.g. Kiryana, General Store, Super Market, Bakery, etc.
  email?: string;
  phone: string;
  alternatePhone?: string;
  address: string;
  city?: string;
  taxNumber?: string; // NTN or STRN or business reg number
  paymentDetails?: string; // EasyPaisa / JazzCash / Bank info for vasooli
  businessHours?: string; // e.g. 08:00 AM - 11:30 PM
  currencySymbol: string; // e.g., 'Rs.' or 'PKR'
  footerNote: string;
  footerNoteUrdu: string;
  lowStockThreshold: number; // e.g., 5
  language: 'ur' | 'en';
  darkMode: boolean;
  enableSound: boolean;
}

export type ActiveTab = 'dashboard' | 'sale' | 'products' | 'history' | 'khata' | 'settings';
