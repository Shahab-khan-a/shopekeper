import { getDatabase, IDatabaseAdapter } from '../db';
import { ShopSettings } from '@/types';
import { INITIAL_SETTINGS } from '@/constants/sampleData';

const SETTINGS_KEY = 'shop_profile_settings';
const INVOICE_COUNTER_KEY = 'invoice_counter';
const MIGRATION_KEY = 'migration_legacy_asyncstorage_completed';

export const SettingsRepository = {
  async getSettings(db: IDatabaseAdapter = getDatabase()): Promise<ShopSettings> {
    const row = await db.get<any>(`SELECT value FROM settings WHERE key = ?`, [SETTINGS_KEY]);
    if (row && row.value) {
      try {
        return JSON.parse(row.value);
      } catch (e) {
        console.warn('[SettingsRepository] Error parsing settings JSON:', e);
      }
    }
    return INITIAL_SETTINGS;
  },

  async saveSettings(settings: ShopSettings, db: IDatabaseAdapter = getDatabase()): Promise<void> {
    await db.run(
      `INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`,
      [SETTINGS_KEY, JSON.stringify(settings)]
    );
  },

  async getNextInvoiceNumber(db: IDatabaseAdapter = getDatabase()): Promise<{ invoiceNumber: string; counter: number }> {
    const row = await db.get<any>(`SELECT value FROM settings WHERE key = ?`, [INVOICE_COUNTER_KEY]);
    let counter = 1001;
    if (row && row.value) {
      const parsed = parseInt(row.value, 10);
      if (!isNaN(parsed) && parsed > 0) {
        counter = parsed;
      }
    }

    const nextCounter = counter + 1;
    await db.run(
      `INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`,
      [INVOICE_COUNTER_KEY, nextCounter.toString()]
    );

    return {
      invoiceNumber: `INV-${counter}`,
      counter,
    };
  },

  async setInvoiceCounter(counter: number, db: IDatabaseAdapter = getDatabase()): Promise<void> {
    await db.run(
      `INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`,
      [INVOICE_COUNTER_KEY, counter.toString()]
    );
  },

  async isMigrated(db: IDatabaseAdapter = getDatabase()): Promise<boolean> {
    const row = await db.get<any>(`SELECT value FROM settings WHERE key = ?`, [MIGRATION_KEY]);
    return !!(row && row.value === 'true');
  },

  async setMigrated(db: IDatabaseAdapter = getDatabase()): Promise<void> {
    await db.run(
      `INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`,
      [MIGRATION_KEY, 'true']
    );
  },

  async getGuestMode(db: IDatabaseAdapter = getDatabase()): Promise<boolean> {
    const row = await db.get<any>(`SELECT value FROM settings WHERE key = 'is_guest_mode'`);
    return !!(row && row.value === 'true');
  },

  async setGuestMode(isGuest: boolean, db: IDatabaseAdapter = getDatabase()): Promise<void> {
    await db.run(
      `INSERT OR REPLACE INTO settings (key, value) VALUES ('is_guest_mode', ?)`,
      [isGuest ? 'true' : 'false']
    );
  },
};
