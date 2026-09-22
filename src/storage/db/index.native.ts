import { IDatabaseAdapter } from './DatabaseAdapter';
import { NativeSQLiteAdapter } from './NativeSQLiteAdapter';

let instance: IDatabaseAdapter | null = null;

export function getDatabase(): IDatabaseAdapter {
  if (!instance) {
    instance = new NativeSQLiteAdapter('shopkeeper.db');
  }
  return instance;
}

export * from './DatabaseAdapter';
export * from './schema';
export * from './NativeSQLiteAdapter';
