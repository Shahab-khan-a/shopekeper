// Firebase configuration for Shopkeeper App
// Generated from Firebase project: shopkeeper-ea7d8 (Shopkeeper)
import { initializeApp, getApps, getApp } from 'firebase/app';
import { Platform } from 'react-native';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const firebaseConfig = {
  apiKey: "AIzaSyAZqhnHssWvecRNhIGSLzLxrZVxjPbYZWg",
  authDomain: "shopkeeper-ea7d8.firebaseapp.com",
  projectId: "shopkeeper-ea7d8",
  storageBucket: "shopkeeper-ea7d8.firebasestorage.app",
  messagingSenderId: "65013515513",
  appId: "1:65013515513:web:655869b6dca74fcdc4ce28",
  measurementId: "G-5QHLCQ7W5F"
};

// Initialize Firebase App singleton
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with the correct persistence & resolvers for Web and Native
let auth: import('firebase/auth').Auth;
if (Platform.OS === 'web') {
  const {
    initializeAuth,
    getAuth,
    browserPopupRedirectResolver,
    browserLocalPersistence,
  } = require('firebase/auth') as typeof import('firebase/auth');
  try {
    auth = initializeAuth(app, {
      persistence: browserLocalPersistence,
      popupRedirectResolver: browserPopupRedirectResolver,
    });
  } catch {
    // Already initialized (e.g. hot reload) — reuse existing instance
    auth = getAuth(app);
  }
} else {
  const authModule = require('firebase/auth') as any;
  const { initializeAuth, getAuth, getReactNativePersistence } = authModule;
  try {
    if (typeof getReactNativePersistence === 'function') {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } else {
      auth = getAuth(app);
    }
  } catch {
    auth = getAuth(app);
  }
}

export { auth };
// Initialize Firestore with ignoreUndefinedProperties so optional undefined fields don't throw errors
let db: import('firebase/firestore').Firestore;
try {
  const { initializeFirestore, getFirestore: getFs } = require('firebase/firestore');
  try {
    db = initializeFirestore(app, {
      ignoreUndefinedProperties: true,
    });
  } catch {
    db = getFs(app);
  }
} catch {
  db = getFirestore(app);
}

export const storage = getStorage(app);
export { db };
