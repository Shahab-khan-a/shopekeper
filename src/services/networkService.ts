import { Platform } from 'react-native';

type NetworkListener = (isOnline: boolean) => void;

let listeners: NetworkListener[] = [];
let lastKnownOnlineState: boolean = true;
let isInitialized = false;

// Dynamic import or fallback for expo-network
let ExpoNetwork: any = null;
try {
  ExpoNetwork = require('expo-network');
} catch {
  // Graceful fallback if native module is loading
}

export const NetworkService = {
  /**
   * Initializes network monitoring
   */
  async init(): Promise<void> {
    if (isInitialized) return;
    isInitialized = true;

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      lastKnownOnlineState = typeof navigator !== 'undefined' ? navigator.onLine : true;

      window.addEventListener('online', () => {
        const prev = lastKnownOnlineState;
        lastKnownOnlineState = true;
        if (!prev) {
          NetworkService.notify(true);
        }
      });

      window.addEventListener('offline', () => {
        lastKnownOnlineState = false;
        NetworkService.notify(false);
      });
    } else if (ExpoNetwork?.addNetworkStateListener) {
      try {
        const state = await ExpoNetwork.getNetworkStateAsync();
        lastKnownOnlineState = !!(state.isConnected && state.isInternetReachable !== false);

        ExpoNetwork.addNetworkStateListener((state: any) => {
          const isOnline = !!(state.isConnected && state.isInternetReachable !== false);
          const changed = isOnline !== lastKnownOnlineState;
          lastKnownOnlineState = isOnline;
          if (changed) {
            NetworkService.notify(isOnline);
          }
        });
      } catch (err) {
        console.warn('[NetworkService] Native network listener error, assuming online:', err);
      }
    }
  },

  /**
   * Returns current online status
   */
  async isOnline(): Promise<boolean> {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      return navigator.onLine;
    }

    if (ExpoNetwork?.getNetworkStateAsync) {
      try {
        const state = await ExpoNetwork.getNetworkStateAsync();
        const online = !!(state.isConnected && state.isInternetReachable !== false);
        lastKnownOnlineState = online;
        return online;
      } catch {
        return lastKnownOnlineState;
      }
    }

    return lastKnownOnlineState;
  },

  /**
   * Synchronous accessor for last known state (useful for instant UI renders)
   */
  isCurrentlyOnline(): boolean {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      return navigator.onLine;
    }
    return lastKnownOnlineState;
  },

  /**
   * Subscribes to network connectivity transitions
   */
  subscribeToNetworkChanges(callback: NetworkListener): () => void {
    listeners.push(callback);
    // Immediately call with current state
    callback(this.isCurrentlyOnline());

    return () => {
      listeners = listeners.filter((cb) => cb !== callback);
    };
  },

  /**
   * Notify all registered listeners
   */
  notify(isOnline: boolean): void {
    for (const listener of listeners) {
      try {
        listener(isOnline);
      } catch (e) {
        console.error('[NetworkService] Error in listener callback:', e);
      }
    }
  },
};
