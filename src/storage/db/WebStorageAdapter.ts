import { IDatabaseAdapter, RunResult } from './DatabaseAdapter';

const DB_NAME = 'ShopkeeperPOS_v2';
const DB_VERSION = 1;
const STORE_NAMES = [
  'products',
  'sales',
  'sale_items',
  'customers',
  'khata_transactions',
  'payments',
  'sync_queue',
  'settings',
];

export class WebStorageAdapter implements IDatabaseAdapter {
  private db: IDBDatabase | null = null;
  private memoryStore: Map<string, Map<string, any>> = new Map();
  private isInMemoryOnly = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    for (const store of STORE_NAMES) {
      this.memoryStore.set(store, new Map());
    }
  }

  async init(): Promise<void> {
    if (this.db || this.isInMemoryOnly) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        console.log('[WebStorageAdapter] IndexedDB not available, using in-memory store.');
        this.isInMemoryOnly = true;
        resolve();
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result as IDBDatabase;
        for (const store of STORE_NAMES) {
          if (!db.objectStoreNames.contains(store)) {
            const keyPath = store === 'settings' ? 'key' : 'id';
            db.createObjectStore(store, { keyPath });
          }
        }
      };

      request.onsuccess = (event: any) => {
        this.db = event.target.result as IDBDatabase;
        resolve();
      };

      request.onerror = () => {
        this.isInMemoryOnly = true;
        resolve();
      };
    });

    await this.initPromise;
  }

  private async ensureDb(): Promise<void> {
    if (!this.db && !this.isInMemoryOnly) {
      await this.init();
    }
  }

  async exec(sql: string): Promise<void> {
    await this.ensureDb();
  }

  private parseTableName(sql: string): string | null {
    const clean = sql.replace(/\n/g, ' ').trim();
    const insertMatch = clean.match(/INSERT\s+(?:OR\s+REPLACE\s+INTO|INTO)\s+([a-zA-Z0-9_]+)/i);
    if (insertMatch) return insertMatch[1];

    const updateMatch = clean.match(/UPDATE\s+([a-zA-Z0-9_]+)/i);
    if (updateMatch) return updateMatch[1];

    const deleteMatch = clean.match(/DELETE\s+FROM\s+([a-zA-Z0-9_]+)/i);
    if (deleteMatch) return deleteMatch[1];

    const selectMatch = clean.match(/FROM\s+([a-zA-Z0-9_]+)/i);
    if (selectMatch) return selectMatch[1];

    return null;
  }

  private getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): IDBObjectStore | null {
    if (this.isInMemoryOnly || !this.db) return null;
    const tx = this.db.transaction(storeName, mode);
    return tx.objectStore(storeName);
  }

  private getAllFromStore(storeName: string): Promise<any[]> {
    if (this.isInMemoryOnly || !this.db) {
      const mem = this.memoryStore.get(storeName);
      return Promise.resolve(mem ? Array.from(mem.values()).map((v) => ({ ...v })) : []);
    }

    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore(storeName, 'readonly');
        if (!store) {
          resolve([]);
          return;
        }
        const req = store.getAll();
        req.onsuccess = () => resolve((req.result || []).map((v: any) => ({ ...v })));
        req.onerror = () => reject(req.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  private putInStore(storeName: string, item: any): Promise<void> {
    if (this.isInMemoryOnly || !this.db) {
      const mem = this.memoryStore.get(storeName);
      if (mem) {
        const key = storeName === 'settings' ? item.key : item.id;
        mem.set(key, { ...item });
      }
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore(storeName, 'readwrite');
        if (!store) {
          resolve();
          return;
        }
        const req = store.put({ ...item });
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  private deleteFromStore(storeName: string, key: any): Promise<void> {
    if (this.isInMemoryOnly || !this.db) {
      const mem = this.memoryStore.get(storeName);
      if (mem) mem.delete(key);
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore(storeName, 'readwrite');
        if (!store) {
          resolve();
          return;
        }
        const req = store.delete(key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  async run(sql: string, params: any[] = []): Promise<RunResult> {
    await this.ensureDb();
    const clean = sql.replace(/\n/g, ' ').trim();
    const table = this.parseTableName(clean);
    if (!table) return { changes: 0 };

    // 1. INSERT
    if (/^INSERT/i.test(clean)) {
      const match = clean.match(/\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i);
      if (match) {
        const cols = match[1].split(',').map((c) => c.trim());
        const rawVals = match[2].split(',').map((v) => v.trim());
        const record: any = {};
        let pIdx = 0;

        for (let i = 0; i < cols.length; i++) {
          const col = cols[i];
          const rawV = rawVals[i] || '?';

          if (rawV === '?') {
            record[col] = params[pIdx++];
          } else if (rawV.startsWith("'") && rawV.endsWith("'")) {
            record[col] = rawV.slice(1, -1);
          } else if (rawV.toUpperCase() === 'NULL') {
            record[col] = null;
          } else if (!isNaN(Number(rawV))) {
            record[col] = Number(rawV);
          } else {
            record[col] = params[pIdx++];
          }
        }
        await this.putInStore(table, record);
        return { changes: 1 };
      }
    }

    // 2. UPDATE
    if (/^UPDATE/i.test(clean)) {
      const setMatch = clean.match(/SET\s+(.+?)\s+WHERE\s+(.+)$/i);
      if (setMatch) {
        const setClauses = setMatch[1].split(',').map((s) => s.trim());
        const whereClause = setMatch[2].trim();

        let paramIdx = 0;
        const setters: ((item: any) => void)[] = [];

        for (const clause of setClauses) {
          const parts = clause.split('=');
          const col = parts[0].trim();
          const expr = parts.slice(1).join('=').trim();

          if (expr === '?') {
            const v = params[paramIdx++];
            setters.push((it) => { it[col] = v; });
          } else if (expr.startsWith("'") && expr.endsWith("'")) {
            const v = expr.slice(1, -1);
            setters.push((it) => { it[col] = v; });
          } else if (expr.includes('COALESCE(?,') || expr.includes('COALESCE(? ,')) {
            const v = params[paramIdx++];
            setters.push((it) => { if (v != null) it[col] = v; });
          } else if (expr.includes('MAX(0, stock + ?)') || expr.includes('MAX(0, stock - ?)')) {
            const isSub = expr.includes('- ?');
            const delta = params[paramIdx++];
            setters.push((it) => {
              it[col] = Math.max(0, (it[col] || 0) + (isSub ? -delta : delta));
            });
          } else if (expr.includes('stock + ?') || expr.includes('balance + ?')) {
            const delta = params[paramIdx++];
            setters.push((it) => { it[col] = (it[col] || 0) + delta; });
          } else if (expr.includes('stock - ?') || expr.includes('balance - ?')) {
            const delta = params[paramIdx++];
            setters.push((it) => { it[col] = Math.max(0, (it[col] || 0) - delta); });
          } else if (expr.toUpperCase() === 'NULL') {
            setters.push((it) => { it[col] = null; });
          } else if (!isNaN(Number(expr))) {
            const n = Number(expr);
            setters.push((it) => { it[col] = n; });
          } else {
            const v = params[paramIdx++];
            setters.push((it) => { it[col] = v; });
          }
        }

        const whereTargetVal = params[paramIdx];
        const allItems = await this.getAllFromStore(table);
        let changes = 0;

        for (const item of allItems) {
          let matches = false;
          if (whereClause.includes('id = ?')) {
            matches = item.id === whereTargetVal;
          } else if (whereClause.includes('key = ?')) {
            matches = item.key === whereTargetVal;
          } else {
            matches = true;
          }

          if (matches) {
            for (const s of setters) {
              s(item);
            }
            await this.putInStore(table, item);
            changes++;
          }
        }
        return { changes };
      }
    }

    // 3. DELETE
    if (/^DELETE/i.test(clean)) {
      const whereMatch = clean.match(/WHERE\s+(.+)$/i);
      const allItems = await this.getAllFromStore(table);
      let changes = 0;

      for (const item of allItems) {
        let matches = false;
        if (!whereMatch) {
          matches = true;
        } else {
          const w = whereMatch[1].trim();
          if (w.includes("status = 'synced'")) {
            matches = item.status === 'synced';
          } else if (w.includes('id = ?')) {
            matches = item.id === params[0];
          } else if (w.includes('saleId = ?')) {
            matches = item.saleId === params[0];
          } else if (w.includes('customerId = ?')) {
            matches = item.customerId === params[0];
          } else if (w.includes('entityId = ?')) {
            matches = item.entityId === params[0];
          } else {
            matches = false;
          }
        }

        if (matches) {
          const key = table === 'settings' ? item.key : item.id;
          await this.deleteFromStore(table, key);
          changes++;
        }
      }
      return { changes };
    }

    return { changes: 0 };
  }

  async get<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    const results = await this.all<T>(sql, params);
    return results.length > 0 ? results[0] : null;
  }

  async all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    await this.ensureDb();
    const clean = sql.replace(/\n/g, ' ').trim();

    // Handle COUNT(*) query
    if (/SELECT\s+COUNT\(\*\)\s+as\s+cnt/i.test(clean)) {
      const table = this.parseTableName(clean);
      if (!table) return [{ cnt: 0 }] as any;
      let items = await this.getAllFromStore(table);

      if (clean.includes("status IN ('pending', 'failed')")) {
        items = items.filter((i) => (i.status === 'pending' || i.status === 'failed') && (i.retryCount || 0) < 5);
      }
      return [{ cnt: items.length }] as any;
    }

    const table = this.parseTableName(clean);
    if (!table) return [];

    let items = await this.getAllFromStore(table);

    // Filter
    const whereMatch = clean.match(/WHERE\s+(.+?)(?:\s+ORDER\s+BY|\s+LIMIT|$)/i);
    if (whereMatch) {
      const w = whereMatch[1];
      const paramVal = params.length > 0 ? params[0] : undefined;

      items = items.filter((item) => {
        if (w.includes('deletedAt IS NULL') && item.deletedAt != null) {
          return false;
        }

        if (w.includes("status IN ('pending', 'failed')")) {
          const validStatus = item.status === 'pending' || item.status === 'failed';
          const retryOk = (item.retryCount || 0) < 5;
          if (!validStatus || !retryOk) return false;
        }

        if (w.includes('stock > 0 AND stock <= ?')) {
          if (item.stock <= 0 || item.stock > (paramVal ?? 5)) return false;
        }

        if (w.includes('id = ?')) {
          if (item.id !== paramVal) return false;
        }

        if (w.includes('saleId = ?')) {
          if (item.saleId !== paramVal) return false;
        }

        if (w.includes('customerId = ?')) {
          if (item.customerId !== paramVal) return false;
        }

        if (w.includes('phone = ?')) {
          if (item.phone !== paramVal) return false;
        }

        if (w.includes('key = ?')) {
          if (item.key !== paramVal) return false;
        }

        if (w.includes('barcode = ?')) {
          if (item.barcode !== paramVal) return false;
        }

        return true;
      });
    }

    // Sort
    const orderMatch = clean.match(/ORDER\s+BY\s+([a-zA-Z0-9_]+)\s*(ASC|DESC)?/i);
    if (orderMatch) {
      const col = orderMatch[1];
      const desc = (orderMatch[2] || 'ASC').toUpperCase() === 'DESC';

      items.sort((a, b) => {
        const valA = a[col];
        const valB = b[col];
        if (valA < valB) return desc ? 1 : -1;
        if (valA > valB) return desc ? -1 : 1;
        return 0;
      });
    }

    // Limit
    const limitMatch = clean.match(/LIMIT\s+(\?|\d+)/i);
    if (limitMatch) {
      let limit = 100;
      if (limitMatch[1] === '?') {
        limit = params[params.length - 1] ?? 100;
      } else {
        limit = parseInt(limitMatch[1], 10);
      }
      items = items.slice(0, limit);
    }

    return items as T[];
  }

  async transaction<T>(action: (adapter: IDatabaseAdapter) => Promise<T>): Promise<T> {
    await this.ensureDb();
    return await action(this);
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.initPromise = null;
    }
  }
}
