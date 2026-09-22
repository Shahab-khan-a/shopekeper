import { IDatabaseAdapter } from './DatabaseAdapter';
import { WebStorageAdapter } from './WebStorageAdapter';

let instance: IDatabaseAdapter | null = null;

export function getDatabase(): IDatabaseAdapter {
  if (!instance) {
    instance = new WebStorageAdapter();
  }
  return instance;
}

export * from './DatabaseAdapter';
export * from './schema';
export * from './WebStorageAdapter';
