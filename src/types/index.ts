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

export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed';

export interface Product {
  id: string;
  name: string;
  nameUrdu?: string;
  image?: string;
  imageUri?: string; // Standard alias
  price: number; // Selling price in Rs.
  sellingPrice?: number; // Standard alias
  costPrice?: number; // Cost price in Rs. for profit calculation
  stock: number; // Quantity available
  category: ProductCategory;
  barcode?: string;
  unit: ProductUnit;
  lowStockThreshold?: number;
  createdAt: number;
  updatedAt: number;
  deletedAt?: number | null;
  syncStatus?: SyncStatus;
}

export interface CartItem {
  product: Product;
  productId?: string;
  name?: string;
  nameUrdu?: string;
  quantity: number;
  unitPrice: number;
  costPrice?: number;
  total: number;
}

// Alias for unified nomenclature
export type SaleItem = CartItem;

export interface DbSaleItem {
  id: string;
  saleId: string;
  productId: string;
  productName: string;
  productNameUrdu?: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  total: number;
}

export type PaymentMethod = 'cash' | 'online' | 'udhaar';

export type SaleStatus = 'completed' | 'refunded' | 'cancelled';

export interface Sale {
  id: string;
  billNumber: string; // e.g., INV-1001
  invoiceNumber?: string; // Standard alias
  date: string; // ISO string
  customerName?: string;
  customerPhone?: string;
  customerId?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  discountType: 'fixed' | 'percent';
  grandTotal: number; // Final total
  total?: number; // Standard alias
  totalProfit?: number;
  paymentMethod: PaymentMethod;
  amountPaid?: number; // Cash tendered
  change?: number; // Cash change returned
  status?: SaleStatus; // 'completed' | 'refunded' | 'cancelled'
  refundReason?: string;
  refundedAt?: number;
  notes?: string;
  createdAt: number;
  updatedAt?: number;
  syncStatus?: SyncStatus;
}

export type KhataTxType = 'credit' | 'payment' | 'reversal' | 'credit_sale' | 'payment_received';

export interface KhataTransaction {
  id: string;
  customerId?: string;
  date: string; // ISO string
  type: KhataTxType;
  amount: number;
  billId?: string;
  billNumber?: string;
  saleId?: string;
  note?: string;
  createdAt?: number;
  syncStatus?: SyncStatus;
}

export interface CustomerKhata {
  id: string;
  name: string;
  nameUrdu?: string;
  phone: string;
  address?: string;
  totalDebt: number; // Unpaid balance
  balance?: number; // Standard alias
  transactions: KhataTransaction[];
  createdAt?: number;
  lastUpdated: number;
  updatedAt?: number;
  syncStatus?: SyncStatus;
}

// Unified alias
export type Customer = CustomerKhata;

export interface Payment {
  id: string;
  customerId: string;
  saleId?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  createdAt: number;
  syncStatus?: SyncStatus;
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

// ==================== TRANSACTION ENGINE TYPES ====================

export interface CompleteSaleInput {
  items: CartItem[];
  paymentMethod: PaymentMethod;
  discount?: number;
  discountType?: 'fixed' | 'percent';
  customerName?: string;
  customerPhone?: string;
  customerId?: string;
  tenderedCash?: number;
  notes?: string;
}

export interface SaleResult {
  success: boolean;
  sale?: Sale;
  error?: string;
  change?: number;
}

export interface RefundResult {
  success: boolean;
  refundedSale?: Sale;
  error?: string;
}

// ==================== OFFLINE SYNC QUEUE TYPES ====================

export type SyncOperationType = 'create' | 'update' | 'delete';
export type SyncEntityType = 'product' | 'sale' | 'customer' | 'khata_transaction' | 'payment' | 'settings';

export interface SyncQueueItem {
  id: string;
  entityType: SyncEntityType;
  entityId: string;
  operation: SyncOperationType;
  payload: string; // JSON string of the entity
  createdAt: number;
  retryCount: number;
  lastError?: string | null;
  status: SyncStatus;
}

export interface SyncOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  collection: 'products' | 'sales' | 'khata' | 'settings' | 'payments' | 'khata_transactions';
  documentId: string;
  data?: any;
  createdAt: number;
  retryCount: number;
}

