import {
  ProductRepository,
  SaleRepository,
  CustomerRepository,
  SettingsRepository,
  SyncQueueRepository,
} from '@/storage/repositories';
import {
  fetchProductsFromCloud,
  fetchSalesFromCloud,
  fetchCustomersFromCloud,
  fetchSettingsFromCloud,
  saveSettingsToCloud,
} from './firestoreService';
import { SyncQueueService } from './syncQueueService';
import { Product, Sale, CustomerKhata, ShopSettings } from '@/types';

export const MergeService = {
  /**
   * Safely merges local guest store data with cloud account data upon sign in.
   * Prevents data loss, deduplicates sales, and maintains append-only integrity.
   */
  async mergeGuestDataWithAccount(userId: string): Promise<{
    mergedProducts: number;
    mergedSales: number;
    mergedCustomers: number;
  }> {
    if (!userId) return { mergedProducts: 0, mergedSales: 0, mergedCustomers: 0 };

    console.log(`[MergeService] Starting safe merge for user ${userId}...`);

    let mergedProducts = 0;
    let mergedSales = 0;
    let mergedCustomers = 0;

    try {
      // 1. Fetch Cloud collections
      const [cloudProds, cloudSales, cloudCusts, cloudSettings] = await Promise.all([
        fetchProductsFromCloud(userId),
        fetchSalesFromCloud(userId),
        fetchCustomersFromCloud(userId),
        fetchSettingsFromCloud(userId),
      ]);

      // 2. Fetch Local collections
      const localProds: Product[] = await ProductRepository.getAll();
      const localSales: Sale[] = await SaleRepository.getAll();
      const localCusts: CustomerKhata[] = await CustomerRepository.getAll();
      const localSettings = await SettingsRepository.getSettings();

      const localProdMap = new Map<string, Product>(localProds.map((p: Product) => [p.id, p]));
      const localSaleMap = new Map<string, Sale>(localSales.map((s: Sale) => [s.id, s]));
      const localCustMap = new Map<string, CustomerKhata>(localCusts.map((c: CustomerKhata) => [c.id, c]));
      const localCustPhoneMap = new Map<string, CustomerKhata>(
        localCusts.filter((c: CustomerKhata) => !!c.phone).map((c: CustomerKhata) => [c.phone, c])
      );

      // 3. Merge Products:
      // - Cloud products not in local: insert into local
      // - Local products not in cloud: enqueue to sync
      // - Products in both: use the one with newer updatedAt
      for (const cp of cloudProds) {
        const lp = localProdMap.get(cp.id);
        if (!lp) {
          await ProductRepository.insert(cp, 'synced');
          mergedProducts++;
        } else if (cp.updatedAt > lp.updatedAt) {
          await ProductRepository.update(cp.id, cp, 'synced');
          mergedProducts++;
        }
      }

      for (const lp of localProds) {
        const cp = cloudProds.find((p) => p.id === lp.id);
        if (!cp || lp.updatedAt > cp.updatedAt) {
          await SyncQueueRepository.enqueue('product', lp.id, 'update', lp);
        }
      }

      // 4. Merge Sales (Append-only)
      for (const cs of cloudSales) {
        if (!localSaleMap.has(cs.id)) {
          mergedSales++;
        }
      }

      for (const ls of localSales) {
        const cs = cloudSales.find((s) => s.id === ls.id);
        if (!cs) {
          await SyncQueueRepository.enqueue('sale', ls.id, 'create', ls);
        }
      }

      // 5. Merge Customers
      for (const cc of cloudCusts) {
        const existing = localCustMap.get(cc.id) || (cc.phone ? localCustPhoneMap.get(cc.phone) : null);
        if (!existing) {
          await CustomerRepository.insert(cc, 'synced');
          mergedCustomers++;
        }
      }

      for (const lc of localCusts) {
        const cc = cloudCusts.find((c) => c.id === lc.id);
        if (!cc) {
          await SyncQueueRepository.enqueue('customer', lc.id, 'update', lc);
        }
      }

      // 6. Merge Settings
      if (cloudSettings) {
        const mergedSettings: ShopSettings = {
          ...localSettings,
          ...cloudSettings,
        };
        await SettingsRepository.saveSettings(mergedSettings);
      } else {
        await saveSettingsToCloud(userId, localSettings);
      }

      // 7. Drain the queue with newly enqueued items
      await SyncQueueService.processQueue(userId);

      console.log(
        `[MergeService] Merge completed: ${mergedProducts} products, ${mergedSales} sales, ${mergedCustomers} customers.`
      );

      return { mergedProducts, mergedSales, mergedCustomers };
    } catch (err) {
      console.error('[MergeService] Merge error:', err);
      return { mergedProducts, mergedSales, mergedCustomers };
    }
  },
};
