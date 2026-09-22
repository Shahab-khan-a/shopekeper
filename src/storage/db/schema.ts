export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  nameUrdu TEXT,
  barcode TEXT,
  category TEXT NOT NULL,
  sellingPrice REAL NOT NULL,
  costPrice REAL NOT NULL DEFAULT 0,
  stock REAL NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'piece',
  lowStockThreshold REAL NOT NULL DEFAULT 5,
  imageUri TEXT,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  deletedAt INTEGER,
  syncStatus TEXT NOT NULL DEFAULT 'pending'
);

CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_syncStatus ON products(syncStatus);

CREATE TABLE IF NOT EXISTS sales (
  id TEXT PRIMARY KEY NOT NULL,
  invoiceNumber TEXT NOT NULL UNIQUE,
  subtotal REAL NOT NULL,
  discount REAL NOT NULL DEFAULT 0,
  discountType TEXT NOT NULL DEFAULT 'fixed',
  total REAL NOT NULL,
  totalProfit REAL NOT NULL DEFAULT 0,
  paymentMethod TEXT NOT NULL,
  customerId TEXT,
  customerName TEXT,
  customerPhone TEXT,
  amountPaid REAL NOT NULL DEFAULT 0,
  change REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'completed',
  refundReason TEXT,
  refundedAt INTEGER,
  notes TEXT,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  syncStatus TEXT NOT NULL DEFAULT 'pending'
);

CREATE INDEX IF NOT EXISTS idx_sales_invoice ON sales(invoiceNumber);
CREATE INDEX IF NOT EXISTS idx_sales_createdAt ON sales(createdAt);
CREATE INDEX IF NOT EXISTS idx_sales_customerId ON sales(customerId);
CREATE INDEX IF NOT EXISTS idx_sales_status ON sales(status);

CREATE TABLE IF NOT EXISTS sale_items (
  id TEXT PRIMARY KEY NOT NULL,
  saleId TEXT NOT NULL,
  productId TEXT NOT NULL,
  productName TEXT NOT NULL,
  productNameUrdu TEXT,
  quantity REAL NOT NULL,
  unitPrice REAL NOT NULL,
  costPrice REAL NOT NULL DEFAULT 0,
  total REAL NOT NULL,
  FOREIGN KEY (saleId) REFERENCES sales(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sale_items_saleId ON sale_items(saleId);
CREATE INDEX IF NOT EXISTS idx_sale_items_productId ON sale_items(productId);

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  nameUrdu TEXT,
  phone TEXT,
  address TEXT,
  balance REAL NOT NULL DEFAULT 0,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  syncStatus TEXT NOT NULL DEFAULT 'pending'
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name);

CREATE TABLE IF NOT EXISTS khata_transactions (
  id TEXT PRIMARY KEY NOT NULL,
  customerId TEXT NOT NULL,
  saleId TEXT,
  type TEXT NOT NULL,
  amount REAL NOT NULL,
  note TEXT,
  createdAt INTEGER NOT NULL,
  syncStatus TEXT NOT NULL DEFAULT 'pending',
  FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_khata_tx_customerId ON khata_transactions(customerId);
CREATE INDEX IF NOT EXISTS idx_khata_tx_saleId ON khata_transactions(saleId);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY NOT NULL,
  customerId TEXT NOT NULL,
  saleId TEXT,
  amount REAL NOT NULL,
  paymentMethod TEXT NOT NULL DEFAULT 'cash',
  createdAt INTEGER NOT NULL,
  syncStatus TEXT NOT NULL DEFAULT 'pending'
);

CREATE INDEX IF NOT EXISTS idx_payments_customerId ON payments(customerId);

CREATE TABLE IF NOT EXISTS sync_queue (
  id TEXT PRIMARY KEY NOT NULL,
  entityType TEXT NOT NULL,
  entityId TEXT NOT NULL,
  operation TEXT NOT NULL,
  payload TEXT NOT NULL,
  createdAt INTEGER NOT NULL,
  retryCount INTEGER NOT NULL DEFAULT 0,
  lastError TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
);

CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue(status, retryCount);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);
`;
