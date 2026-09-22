import { getDatabase, IDatabaseAdapter } from '../db';
import { SyncQueueItem, SyncEntityType, SyncOperationType, SyncStatus } from '@/types';

export const SyncQueueRepository = {
  async enqueue(
    entityType: SyncEntityType,
    entityId: string,
    operation: SyncOperationType,
    payload: any,
    db: IDatabaseAdapter = getDatabase()
  ): Promise<string> {
    const id = `sq-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const now = Date.now();
    const payloadStr = typeof payload === 'string' ? payload : JSON.stringify(payload);

    await db.run(
      `INSERT INTO sync_queue (
        id, entityType, entityId, operation, payload, createdAt, retryCount, lastError, status
      ) VALUES (?, ?, ?, ?, ?, ?, 0, NULL, 'pending')`,
      [id, entityType, entityId, operation, payloadStr, now]
    );

    return id;
  },

  async enqueueBatch(
    items: {
      entityType: SyncEntityType;
      entityId: string;
      operation: SyncOperationType;
      payload: any;
    }[],
    db: IDatabaseAdapter = getDatabase()
  ): Promise<void> {
    const now = Date.now();
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const id = `sq-${now}-${i}-${Math.floor(Math.random() * 10000)}`;
      const payloadStr = typeof item.payload === 'string' ? item.payload : JSON.stringify(item.payload);
      await db.run(
        `INSERT INTO sync_queue (
          id, entityType, entityId, operation, payload, createdAt, retryCount, lastError, status
        ) VALUES (?, ?, ?, ?, ?, ?, 0, NULL, 'pending')`,
        [id, item.entityType, item.entityId, item.operation, payloadStr, now]
      );
    }
  },

  async getPending(limit = 100, db: IDatabaseAdapter = getDatabase()): Promise<SyncQueueItem[]> {
    const rows = await db.all<any>(
      `SELECT * FROM sync_queue WHERE status IN ('pending', 'failed') AND retryCount < 5 ORDER BY createdAt ASC LIMIT ?`,
      [limit]
    );
    return rows.map((r) => ({
      id: r.id,
      entityType: r.entityType as SyncEntityType,
      entityId: r.entityId,
      operation: r.operation as SyncOperationType,
      payload: r.payload,
      createdAt: r.createdAt,
      retryCount: r.retryCount,
      lastError: r.lastError || null,
      status: r.status as SyncStatus,
    }));
  },

  async getPendingCount(db: IDatabaseAdapter = getDatabase()): Promise<number> {
    const row = await db.get<any>(
      `SELECT COUNT(*) as cnt FROM sync_queue WHERE status IN ('pending', 'failed') AND retryCount < 5`
    );
    return row ? (row.cnt || 0) : 0;
  },

  async markStatus(
    id: string,
    status: SyncStatus,
    error?: string | null,
    db: IDatabaseAdapter = getDatabase()
  ): Promise<void> {
    if (status === 'synced') {
      await db.run(`UPDATE sync_queue SET status = 'synced', lastError = NULL WHERE id = ?`, [id]);
    } else if (status === 'failed') {
      await db.run(
        `UPDATE sync_queue SET status = 'failed', retryCount = retryCount + 1, lastError = ? WHERE id = ?`,
        [error || 'Unknown sync failure', id]
      );
    } else {
      await db.run(`UPDATE sync_queue SET status = ? WHERE id = ?`, [status, id]);
    }
  },

  async pruneSynced(db: IDatabaseAdapter = getDatabase()): Promise<void> {
    await db.run(`DELETE FROM sync_queue WHERE status = 'synced'`);
  },

  async clear(db: IDatabaseAdapter = getDatabase()): Promise<void> {
    await db.run(`DELETE FROM sync_queue`);
  },
};
