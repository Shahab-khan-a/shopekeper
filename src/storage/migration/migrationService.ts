import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { getDatabase, IDatabaseAdapter } from '../db';
import { ProductRepository } from '../repositories/ProductRepository';
import { CustomerRepository } from '../repositories/CustomerRepository';
import { SettingsRepository } from '../repositories/SettingsRepository';
import { INITIAL_SETTINGS, DUMMY_PRODUCT_IDS, DUMMY_CUSTOMER_IDS, DUMMY_TX_IDS } from '@/constants/sampleData';
import { Product, Sale, CustomerKhata, ShopSettings } from '@/types';

const LEGACY_KEYS = {
  PRODUCTS: '@shop_products_v1',
  SALES: '@shop_sales_v1',
  KHATA: '@shop_khata_v1',
  SETTINGS: '@shop_settings_v1',
  BILL_COUNTER: '@shop_bill_counter_v1',
};

async function getLegacyItem(key: string): Promise<string | null> {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return await AsyncStorage.getItem(key);
  } catch (err) {
    console.warn(`[MigrationService] Error reading legacy key ${key}:`, err);
    return null;
  }
}

export const MigrationService = {
  /**
   * Performs an idempotent migration of legacy AsyncStorage JSON data into the
   * new normalized SQLite/IndexedDB database.
   */
  async runMigrationIfNeeded(): Promise<void> {
    const db = getDatabase();
    await db.init();

    // Ensure any previously seeded dummy/sample data is purged
    await this.purgeDummyDataIfNeeded(db);

    const isAlreadyMigrated = await SettingsRepository.isMigrated(db);
    if (isAlreadyMigrated) {
      return;
    }

    console.log('[MigrationService] Checking for legacy data to migrate...');

    try {
      const [legacyProdsRaw, legacySalesRaw, legacyKhataRaw, legacySettingsRaw, legacyCounterRaw] =
        await Promise.all([
          getLegacyItem(LEGACY_KEYS.PRODUCTS),
          getLegacyItem(LEGACY_KEYS.SALES),
          getLegacyItem(LEGACY_KEYS.KHATA),
          getLegacyItem(LEGACY_KEYS.SETTINGS),
          getLegacyItem(LEGACY_KEYS.BILL_COUNTER),
        ]);

      const hasLegacyData = !!(
        legacyProdsRaw ||
        legacySalesRaw ||
        legacyKhataRaw ||
        legacySettingsRaw
      );

      await db.transaction(async (tx) => {
        const now = Date.now();

        if (hasLegacyData) {
          console.log('[MigrationService] Found legacy data. Migrating to normalized schema...');

          // 1. Products
          if (legacyProdsRaw) {
            try {
              const prods: Product[] = JSON.parse(legacyProdsRaw);
              if (Array.isArray(prods) && prods.length > 0) {
                for (const p of prods) {
                  await ProductRepository.insert(p, 'pending', tx);
                }
                console.log(`[MigrationService] Migrated ${prods.length} products.`);
              }
            } catch (e) {
              console.warn('[MigrationService] Error parsing legacy products:', e);
            }
          }

          // 2. Customers & Khata
          if (legacyKhataRaw) {
            try {
              const khata: CustomerKhata[] = JSON.parse(legacyKhataRaw);
              if (Array.isArray(khata) && khata.length > 0) {
                for (const c of khata) {
                  await CustomerRepository.insert(c, 'pending', tx);
                }
                console.log(`[MigrationService] Migrated ${khata.length} customers.`);
              }
            } catch (e) {
              console.warn('[MigrationService] Error parsing legacy khata:', e);
            }
          }

          // 3. Sales
          if (legacySalesRaw) {
            try {
              const sales: Sale[] = JSON.parse(legacySalesRaw);
              if (Array.isArray(sales) && sales.length > 0) {
                for (const s of sales) {
                  await tx.run(
                    `INSERT OR REPLACE INTO sales (
                      id, invoiceNumber, subtotal, discount, discountType, total, totalProfit,
                      paymentMethod, customerId, customerName, customerPhone, amountPaid, change,
                      status, refundReason, refundedAt, notes, createdAt, updatedAt, syncStatus
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
                    [
                      s.id,
                      s.invoiceNumber || s.billNumber || `INV-${s.createdAt}`,
                      s.subtotal || s.grandTotal,
                      s.discount || 0,
                      s.discountType || 'fixed',
                      s.total ?? s.grandTotal,
                      s.totalProfit || 0,
                      s.paymentMethod || 'cash',
                      s.customerId || null,
                      s.customerName || null,
                      s.customerPhone || null,
                      s.amountPaid || 0,
                      s.change || 0,
                      s.status || 'completed',
                      s.refundReason || null,
                      s.refundedAt || null,
                      s.notes || null,
                      s.createdAt || now,
                      s.updatedAt || s.createdAt || now,
                    ]
                  );

                  if (s.items && Array.isArray(s.items)) {
                    for (let i = 0; i < s.items.length; i++) {
                      const it = s.items[i];
                      const itemId = `mig-item-${s.id}-${i}`;
                      const prodId = it.productId || it.product?.id || `unknown-${i}`;
                      const prodName = it.product?.name || it.name || 'Unknown Product';
                      const prodNameUrdu = it.product?.nameUrdu || it.nameUrdu || null;

                      await tx.run(
                        `INSERT OR REPLACE INTO sale_items (
                          id, saleId, productId, productName, productNameUrdu, quantity, unitPrice, costPrice, total
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                          itemId,
                          s.id,
                          prodId,
                          prodName,
                          prodNameUrdu,
                          it.quantity || 1,
                          it.unitPrice || 0,
                          it.costPrice || 0,
                          it.total || 0,
                        ]
                      );
                    }
                  }
                }
                console.log(`[MigrationService] Migrated ${sales.length} sales.`);
              }
            } catch (e) {
              console.warn('[MigrationService] Error parsing legacy sales:', e);
            }
          }

          // 4. Settings
          if (legacySettingsRaw) {
            try {
              const settings: ShopSettings = JSON.parse(legacySettingsRaw);
              await SettingsRepository.saveSettings(settings, tx);
            } catch (e) {
              console.warn('[MigrationService] Error parsing legacy settings:', e);
            }
          } else {
            await SettingsRepository.saveSettings(INITIAL_SETTINGS, tx);
          }

          // 5. Bill Counter
          if (legacyCounterRaw) {
            const counter = parseInt(legacyCounterRaw, 10);
            if (!isNaN(counter) && counter > 0) {
              await SettingsRepository.setInvoiceCounter(counter, tx);
            }
          }
        } else {
          // Fresh install: Clean empty catalog & default settings
          console.log('[MigrationService] Fresh install. Initializing clean empty catalog...');
          await SettingsRepository.saveSettings(INITIAL_SETTINGS, tx);
          await SettingsRepository.setInvoiceCounter(1001, tx);
        }

        // Mark migration as complete
        await SettingsRepository.setMigrated(tx);
      });

      console.log('[MigrationService] Migration finished successfully.');
    } catch (err) {
      console.error('[MigrationService] Migration failed:', err);
    }
  },

  /**
   * Purges all pre-populated dummy/sample products, customers, transactions and sync items
   * from any previously initialized database.
   */
  async purgeDummyDataIfNeeded(db: IDatabaseAdapter = getDatabase()): Promise<void> {
    try {
      const purgedFlag = await db.get<any>(
        `SELECT value FROM settings WHERE key = 'dummy_data_purged_v2'`
      );
      if (purgedFlag && purgedFlag.value === 'true') {
        return;
      }

      console.log('[MigrationService] Purging legacy dummy/sample data from database...');

      // 1. Delete dummy products
      for (const id of DUMMY_PRODUCT_IDS) {
        await db.run(`DELETE FROM products WHERE id = ?`, [id]);
        await db.run(`DELETE FROM sync_queue WHERE entityId = ?`, [id]);
      }

      // 2. Delete dummy customers and transactions
      for (const id of DUMMY_CUSTOMER_IDS) {
        await db.run(`DELETE FROM customers WHERE id = ?`, [id]);
        await db.run(`DELETE FROM khata_transactions WHERE customerId = ?`, [id]);
        await db.run(`DELETE FROM sync_queue WHERE entityId = ?`, [id]);
      }

      for (const id of DUMMY_TX_IDS) {
        await db.run(`DELETE FROM khata_transactions WHERE id = ?`, [id]);
      }

      // 3. Clean legacy dummy names in settings if stored
      const settings = await SettingsRepository.getSettings(db);
      let settingsChanged = false;
      const cleanSettings = { ...settings };

      if (cleanSettings.ownerName === 'Muhammad Kamran' || cleanSettings.ownerName === 'Shop Owner') {
        cleanSettings.ownerName = '';
        settingsChanged = true;
      }
      if (cleanSettings.shopName === 'Madina Super Store') {
        cleanSettings.shopName = 'My Store';
        settingsChanged = true;
      }
      if (cleanSettings.shopNameUrdu === 'مدینہ سپر اسٹور اینڈ کریانہ') {
        cleanSettings.shopNameUrdu = 'میری دکان';
        settingsChanged = true;
      }
      if (cleanSettings.email === 'madinastore.lhr@gmail.com') {
        cleanSettings.email = '';
        settingsChanged = true;
      }
      if (cleanSettings.profileImage && cleanSettings.profileImage.includes('googleusercontent.com') && !cleanSettings.profileImage.includes('/d/')) {
        cleanSettings.profileImage = undefined;
        settingsChanged = true;
      }

      if (settingsChanged) {
        await SettingsRepository.saveSettings(cleanSettings, db);
      }

      // Mark purge completed
      await db.run(
        `INSERT OR REPLACE INTO settings (key, value) VALUES ('dummy_data_purged_v2', 'true')`
      );

      console.log('[MigrationService] Dummy data purged successfully.');
    } catch (err) {
      console.warn('[MigrationService] purgeDummyDataIfNeeded warning:', err);
    }
  },
};
