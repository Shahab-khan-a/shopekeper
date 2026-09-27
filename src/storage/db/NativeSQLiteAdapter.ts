import * as SQLite from 'expo-sqlite';
import { IDatabaseAdapter, RunResult } from './DatabaseAdapter';
import { SCHEMA_SQL } from './schema';

export class NativeSQLiteAdapter implements IDatabaseAdapter {
  private db: SQLite.SQLiteDatabase | null = null;
  private dbName: string;
  private initPromise: Promise<void> | null = null;

  constructor(dbName: string = 'shopkeeper.db') {
    this.dbName = dbName;
  }

  async init(): Promise<void> {
    if (this.db) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        this.db = await SQLite.openDatabaseAsync(this.dbName);
        // Enable WAL mode for high performance concurrency & foreign keys
        await this.db.execAsync(`
          PRAGMA journal_mode = WAL;
          PRAGMA foreign_keys = ON;
        `);
        // Run database schema migration / table creation
        await this.db.execAsync(SCHEMA_SQL);
      } catch (err) {
        console.error('[NativeSQLiteAdapter] Initialization failed:', err);
        throw err;
      }
    })();

    await this.initPromise;
  }

  private async ensureDb(): Promise<SQLite.SQLiteDatabase> {
    if (!this.db) {
      await this.init();
    }
    return this.db!;
  }

  async exec(sql: string): Promise<void> {
    const db = await this.ensureDb();
    await db.execAsync(sql);
  }

  async run(sql: string, params: any[] = []): Promise<RunResult> {
    const db = await this.ensureDb();
    const result = await db.runAsync(sql, params);
    return {
      changes: result.changes,
      lastInsertRowId: result.lastInsertRowId,
    };
  }

  async get<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    const db = await this.ensureDb();
    const result = await db.getFirstAsync<T>(sql, params);
    return result || null;
  }

  async all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const db = await this.ensureDb();
    const results = await db.getAllAsync<T>(sql, params);
    return results || [];
  }

  async transaction<T>(action: (adapter: IDatabaseAdapter) => Promise<T>): Promise<T> {
    const db = await this.ensureDb();
    let result!: T;
    await db.withTransactionAsync(async () => {
      result = await action(this);
    });
    return result;
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
      this.initPromise = null;
    }
  }
}
