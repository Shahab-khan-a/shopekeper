import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export const StorageAdapter = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return await AsyncStorage.getItem(key);
    } catch (e) {
      console.warn(`[StorageAdapter] Failed to get item for key ${key}:`, e);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.warn(`[StorageAdapter] Failed to set item for key ${key}:`, e);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.warn(`[StorageAdapter] Failed to remove item for key ${key}:`, e);
    }
  },

  async clear(): Promise<void> {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
        return;
      }
      await AsyncStorage.clear();
    } catch (e) {
      console.warn('[StorageAdapter] Failed to clear storage:', e);
    }
  },
};
