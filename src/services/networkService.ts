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

/**
 * Safely queries ExpoNetwork.getNetworkStateAsync with a 1000ms timeout
 * to prevent blocking/hanging when the device is completely offline or in transition.
 */
async function getSafeNetworkState(): Promise<any> {
  if (!ExpoNetwork?.getNetworkStateAsync) return null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      ExpoNetwork.getNetworkStateAsync(),
      new Promise<null>((resolve) => {
        timer = setTimeout(() => resolve(null), 1000);
      }),
    ]);
  } catch {
    return null;
  } finally {
    if (timer) clearTimeout(timer);
  }
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
        const state = await getSafeNetworkState();
        if (state) {
          lastKnownOnlineState = !!(state.isConnected && state.isInternetReachable !== false);
        }

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
        const state = await getSafeNetworkState();
        if (state) {
          const online = !!(state.isConnected && state.isInternetReachable !== false);
          lastKnownOnlineState = online;
          return online;
        }
        return lastKnownOnlineState;
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
