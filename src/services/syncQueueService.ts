import { SyncQueueRepository } from '@/storage/repositories/SyncQueueRepository';
import { executeBatchCloudQueue } from './firestoreService';
import { NetworkService } from './networkService';

let isProcessing = false;

export const SyncQueueService = {
  /**
   * Returns the count of pending items waiting to sync
   */
  async getPendingCount(): Promise<number> {
    try {
      return await SyncQueueRepository.getPendingCount();
    } catch {
      return 0;
    }
  },

  /**
   * Processes all pending items in the offline sync queue
   */
  async processQueue(
    userId: string
  ): Promise<{ processed: number; remaining: number; errors: number }> {
    if (!userId) {
      return { processed: 0, remaining: 0, errors: 0 };
    }

    const online = await NetworkService.isOnline();
    if (!online) {
      const remaining = await SyncQueueRepository.getPendingCount();
      return { processed: 0, remaining, errors: 0 };
    }

    if (isProcessing) {
      console.log('[SyncQueueService] Sync already in progress, skipping concurrent run.');
      const remaining = await SyncQueueRepository.getPendingCount();
      return { processed: 0, remaining, errors: 0 };
    }

    isProcessing = true;

    try {
      const pendingItems = await SyncQueueRepository.getPending(200);
      if (pendingItems.length === 0) {
        return { processed: 0, remaining: 0, errors: 0 };
      }

      console.log(`[SyncQueueService] Processing ${pendingItems.length} offline operations to Firestore...`);

      // Mark items as 'syncing'
      for (const item of pendingItems) {
        await SyncQueueRepository.markStatus(item.id, 'syncing');
      }

      const { succeededIds, failedIds } = await executeBatchCloudQueue(userId, pendingItems);
      const succeededSet = new Set(succeededIds);

      // Mark items as 'synced' or 'failed'
      for (const item of pendingItems) {
        if (succeededSet.has(item.id)) {
          await SyncQueueRepository.markStatus(item.id, 'synced');
        } else {
          await SyncQueueRepository.markStatus(item.id, 'failed', 'Upload failed, will retry');
        }
      }

      // Cleanup synced items from queue
      await SyncQueueRepository.pruneSynced();

      const remaining = await SyncQueueRepository.getPendingCount();
      console.log(
        `[SyncQueueService] Sync completed. Succeeded: ${succeededIds.length}, Failed: ${failedIds.length}, Remaining: ${remaining}`
      );

      return {
        processed: succeededIds.length,
        remaining,
        errors: failedIds.length,
      };
    } catch (err) {
      console.error('[SyncQueueService] Unexpected error processing sync queue:', err);
      const remaining = await SyncQueueRepository.getPendingCount();
      return { processed: 0, remaining, errors: 1 };
    } finally {
      isProcessing = false;
    }
  },

  /**
   * Clears the sync queue
   */
  async clear(): Promise<void> {
    await SyncQueueRepository.clear();
  },
};

// Backward-compatible exports for existing callers
export const getPendingQueueCount = () => SyncQueueService.getPendingCount();
export const processSyncQueue = (userId: string) => SyncQueueService.processQueue(userId);
export const clearSyncQueue = () => SyncQueueService.clear();
export const enqueueSyncOp = (op: any) =>
  SyncQueueRepository.enqueue(op.collection || op.entityType, op.documentId || op.entityId, op.type || op.operation, op.data || op.payload);
export const enqueueBatchSyncOps = (ops: any[]) =>
  SyncQueueRepository.enqueueBatch(
    ops.map((o) => ({
      entityType: o.collection || o.entityType,
      entityId: o.documentId || o.entityId,
      operation: o.type || o.operation,
      payload: o.data || o.payload,
    }))
  );
