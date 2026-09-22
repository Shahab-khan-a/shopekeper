import { getDatabase, IDatabaseAdapter } from '../db';
import { Product, SyncStatus } from '@/types';

function mapRowToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    nameUrdu: row.nameUrdu || undefined,
    barcode: row.barcode || undefined,
    category: row.category,
    price: row.sellingPrice,
    sellingPrice: row.sellingPrice,
    costPrice: row.costPrice,
    stock: row.stock,
    unit: row.unit,
    lowStockThreshold: row.lowStockThreshold,
    image: row.imageUri || undefined,
    imageUri: row.imageUri || undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt,
    syncStatus: row.syncStatus,
  };
}

export const ProductRepository = {
  async getAll(db: IDatabaseAdapter = getDatabase()): Promise<Product[]> {
    const rows = await db.all<any>(
      `SELECT * FROM products WHERE deletedAt IS NULL ORDER BY name ASC`
    );
    return rows.map(mapRowToProduct);
  },

  async getById(id: string, db: IDatabaseAdapter = getDatabase()): Promise<Product | null> {
    const row = await db.get<any>(
      `SELECT * FROM products WHERE id = ? AND deletedAt IS NULL`,
      [id]
    );
    return row ? mapRowToProduct(row) : null;
  },

  async getByBarcode(barcode: string, db: IDatabaseAdapter = getDatabase()): Promise<Product | null> {
    const row = await db.get<any>(
      `SELECT * FROM products WHERE barcode = ? AND deletedAt IS NULL`,
      [barcode]
    );
    return row ? mapRowToProduct(row) : null;
  },

  async getLowStock(threshold: number, db: IDatabaseAdapter = getDatabase()): Promise<Product[]> {
    const rows = await db.all<any>(
      `SELECT * FROM products WHERE stock > 0 AND stock <= ? AND deletedAt IS NULL ORDER BY stock ASC`,
      [threshold]
    );
    return rows.map(mapRowToProduct);
  },

  async insert(product: Product, syncStatus: SyncStatus = 'pending', db: IDatabaseAdapter = getDatabase()): Promise<void> {
    const now = Date.now();
    await db.run(
      `INSERT OR REPLACE INTO products (
        id, name, nameUrdu, barcode, category, sellingPrice, costPrice, stock, unit, lowStockThreshold, imageUri, createdAt, updatedAt, deletedAt, syncStatus
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product.id,
        product.name,
        product.nameUrdu || null,
        product.barcode || null,
        product.category,
        product.sellingPrice ?? product.price,
        product.costPrice ?? 0,
        product.stock,
        product.unit,
        product.lowStockThreshold ?? 5,
        product.imageUri ?? product.image ?? null,
        product.createdAt || now,
        product.updatedAt || now,
        product.deletedAt || null,
        syncStatus,
      ]
    );
  },

  async update(id: string, updates: Partial<Product>, syncStatus: SyncStatus = 'pending', db: IDatabaseAdapter = getDatabase()): Promise<void> {
    const current = await this.getById(id, db);
    if (!current) return;

    const merged: Product = {
      ...current,
      ...updates,
      sellingPrice: updates.sellingPrice ?? updates.price ?? current.sellingPrice ?? current.price,
      imageUri: updates.imageUri ?? updates.image ?? current.imageUri ?? current.image,
      updatedAt: Date.now(),
    };

    await db.run(
      `UPDATE products SET 
        name = ?, nameUrdu = ?, barcode = ?, category = ?, sellingPrice = ?, costPrice = ?, stock = ?, unit = ?, lowStockThreshold = ?, imageUri = ?, updatedAt = ?, syncStatus = ?
      WHERE id = ?`,
      [
        merged.name,
        merged.nameUrdu || null,
        merged.barcode || null,
        merged.category,
        merged.sellingPrice,
        merged.costPrice ?? 0,
        merged.stock,
        merged.unit,
        merged.lowStockThreshold ?? 5,
        merged.imageUri || null,
        merged.updatedAt,
        syncStatus,
        id,
      ]
    );
  },

  async softDelete(id: string, syncStatus: SyncStatus = 'pending', db: IDatabaseAdapter = getDatabase()): Promise<void> {
    const now = Date.now();
    await db.run(
      `UPDATE products SET deletedAt = ?, updatedAt = ?, syncStatus = ? WHERE id = ?`,
      [now, now, syncStatus, id]
    );
  },

  async updateStock(id: string, delta: number, db: IDatabaseAdapter = getDatabase()): Promise<void> {
    const now = Date.now();
    await db.run(
      `UPDATE products SET stock = MAX(0, stock + ?), updatedAt = ?, syncStatus = 'pending' WHERE id = ?`,
      [delta, now, id]
    );
  },

  async upsertMany(products: Product[], syncStatus: SyncStatus = 'synced', db: IDatabaseAdapter = getDatabase()): Promise<void> {
    for (const prod of products) {
      await this.insert(prod, syncStatus, db);
    }
  },
};
