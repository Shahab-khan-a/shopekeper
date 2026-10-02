// Firebase configuration for Shopkeeper App
// Generated from Firebase project: shopkeeper-a977a (Shopkeeper)
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyDCCCFTvkU_PdC7gakmE-2cHiEfHpAFrmE",
  authDomain: "shopkeeper-a977a.firebaseapp.com",
  projectId: "shopkeeper-a977a",
  storageBucket: "shopkeeper-a977a.firebasestorage.app",
  messagingSenderId: "800823031098",
  appId: "1:800823031098:web:a4e2a9a886998a090e4c03",
  measurementId: "G-EG38QBXRM7"
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

export { db };
