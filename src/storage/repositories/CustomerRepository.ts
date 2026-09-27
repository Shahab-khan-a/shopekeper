import { getDatabase, IDatabaseAdapter } from '../db';
import { CustomerKhata, KhataTransaction, Payment, SyncStatus } from '@/types';

function mapRowToTx(row: any): KhataTransaction {
  return {
    id: row.id,
    customerId: row.customerId,
    saleId: row.saleId || undefined,
    billId: row.saleId || undefined,
    type: row.type,
    amount: row.amount,
    note: row.note || undefined,
    createdAt: row.createdAt,
    date: new Date(row.createdAt).toISOString(),
    syncStatus: row.syncStatus,
  };
}

export const CustomerRepository = {
  async getAll(db: IDatabaseAdapter = getDatabase()): Promise<CustomerKhata[]> {
    const custRows = await db.all<any>(`SELECT * FROM customers ORDER BY name ASC`);
    const result: CustomerKhata[] = [];

    for (const row of custRows) {
      const txRows = await db.all<any>(
        `SELECT * FROM khata_transactions WHERE customerId = ? ORDER BY createdAt DESC`,
        [row.id]
      );
      result.push({
        id: row.id,
        name: row.name,
        nameUrdu: row.nameUrdu || undefined,
        phone: row.phone || '',
        address: row.address || undefined,
        totalDebt: row.balance,
        balance: row.balance,
        transactions: txRows.map(mapRowToTx),
        createdAt: row.createdAt,
        lastUpdated: row.updatedAt,
        updatedAt: row.updatedAt,
        syncStatus: row.syncStatus,
      });
    }

    return result;
  },

  async getById(id: string, db: IDatabaseAdapter = getDatabase()): Promise<CustomerKhata | null> {
    const row = await db.get<any>(`SELECT * FROM customers WHERE id = ?`, [id]);
    if (!row) return null;

    const txRows = await db.all<any>(
      `SELECT * FROM khata_transactions WHERE customerId = ? ORDER BY createdAt DESC`,
      [id]
    );

    return {
      id: row.id,
      name: row.name,
      nameUrdu: row.nameUrdu || undefined,
      phone: row.phone || '',
      address: row.address || undefined,
      totalDebt: row.balance,
      balance: row.balance,
      transactions: txRows.map(mapRowToTx),
      createdAt: row.createdAt,
      lastUpdated: row.updatedAt,
      updatedAt: row.updatedAt,
      syncStatus: row.syncStatus,
    };
  },

  async getByPhone(phone: string, db: IDatabaseAdapter = getDatabase()): Promise<CustomerKhata | null> {
    if (!phone) return null;
    const row = await db.get<any>(`SELECT * FROM customers WHERE phone = ?`, [phone]);
    if (!row) return null;
    return this.getById(row.id, db);
  },

  async insert(customer: CustomerKhata, syncStatus: SyncStatus = 'pending', db: IDatabaseAdapter = getDatabase()): Promise<void> {
    const now = Date.now();
    await db.run(
      `INSERT OR REPLACE INTO customers (
        id, name, nameUrdu, phone, address, balance, createdAt, updatedAt, syncStatus
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customer.id,
        customer.name,
        customer.nameUrdu || null,
        customer.phone || null,
        customer.address || null,
        customer.balance ?? customer.totalDebt ?? 0,
        customer.createdAt || now,
        customer.updatedAt || customer.lastUpdated || now,
        syncStatus,
      ]
    );

    if (customer.transactions && customer.transactions.length > 0) {
      for (const tx of customer.transactions) {
        // Ensure the transaction has a customerId; legacy data may be missing it
        const txWithCustomer: KhataTransaction = {
          ...tx,
          customerId: tx.customerId || customer.id,
        };
        await this.addTransaction(txWithCustomer, syncStatus, db);
      }
    }
  },

  async update(id: string, updates: Partial<CustomerKhata>, syncStatus: SyncStatus = 'pending', db: IDatabaseAdapter = getDatabase()): Promise<void> {
    const current = await this.getById(id, db);
    if (!current) return;

    const merged = {
      ...current,
      ...updates,
      updatedAt: Date.now(),
    };

    await db.run(
      `UPDATE customers SET name = ?, nameUrdu = ?, phone = ?, address = ?, balance = ?, updatedAt = ?, syncStatus = ? WHERE id = ?`,
      [
        merged.name,
        merged.nameUrdu || null,
        merged.phone || null,
        merged.address || null,
        merged.balance ?? merged.totalDebt ?? 0,
        merged.updatedAt,
        syncStatus,
        id,
      ]
    );
  },

  async updateBalance(id: string, delta: number, db: IDatabaseAdapter = getDatabase()): Promise<void> {
    const now = Date.now();
    await db.run(
      `UPDATE customers SET balance = balance + ?, updatedAt = ?, syncStatus = 'pending' WHERE id = ?`,
      [delta, now, id]
    );
  },

  async addTransaction(tx: KhataTransaction, syncStatus: SyncStatus = 'pending', db: IDatabaseAdapter = getDatabase()): Promise<void> {
    // Guard: customerId is NOT NULL in schema — skip invalid transactions
    if (!tx.customerId) {
      console.warn('[CustomerRepository] Skipping transaction with missing customerId:', tx.id);
      return;
    }
    const now = Date.now();
    await db.run(
      `INSERT OR REPLACE INTO khata_transactions (
        id, customerId, saleId, type, amount, note, createdAt, syncStatus
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tx.id,
        tx.customerId,
        tx.saleId || tx.billId || null,
        tx.type,
        tx.amount,
        tx.note || null,
        tx.createdAt || now,
        syncStatus,
      ]
    );
  },

  async recordPayment(payment: Payment, syncStatus: SyncStatus = 'pending', db: IDatabaseAdapter = getDatabase()): Promise<void> {
    const now = Date.now();
    await db.run(
      `INSERT OR REPLACE INTO payments (
        id, customerId, saleId, amount, paymentMethod, createdAt, syncStatus
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        payment.id,
        payment.customerId,
        payment.saleId || null,
        payment.amount,
        payment.paymentMethod || 'cash',
        payment.createdAt || now,
        syncStatus,
      ]
    );
  },
};
