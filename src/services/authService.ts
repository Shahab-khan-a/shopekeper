import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signInWithCredential,
  signOut, 
  onAuthStateChanged, 
  User,
  browserPopupRedirectResolver,
} from 'firebase/auth';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { auth } from '@/config/firebase';
import { GOOGLE_DRIVE_CONFIG } from '@/config/googleDrive';
import { googleDriveService } from '@/services/googleDriveService';

// Complete auth session if returning from a web-browser auth flow (Web)
WebBrowser.maybeCompleteAuthSession();

// Configure Google Auth Provider with Profile and Email scopes for Web
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Configure Native Google Sign-In for Mobile (Android & iOS)
if (Platform.OS !== 'web') {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    scopes: ['profile', 'email'],
  });
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * Format Firebase Auth errors into clear, friendly messages
 */
function getFriendlyAuthErrorMessage(error: any): string {
  const code = error?.code || '';
  switch (code) {
    case 'auth/popup-closed-by-user':
      return 'Sign-in window was closed before completing.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by browser. Please allow popups for this site.';
    case 'auth/cancelled-popup-request':
      return 'Only one sign-in request can be in progress at a time.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized in Firebase Console (Authentication > Settings > Authorized Domains).';
    case 'auth/operation-not-allowed':
      return 'Google Sign-In is not enabled in Firebase Console. Please verify it is enabled under Authentication > Sign-in method.';
    case 'auth/network-request-failed':
      return 'Network connection failed. Please check your internet connection.';
    case 'auth/internal-error':
      return 'Firebase internal error. Please try again.';
    default:
      return error?.message || 'Failed to sign in with Google.';
  }
}

/**
 * Check if the user is returning from a redirect-based Google Sign In (Web)
 */
export async function checkRedirectAuth(): Promise<User | null> {
  if (Platform.OS === 'web') {
    try {
      const result = await getRedirectResult(auth, browserPopupRedirectResolver);
      if (result && result.user) {
        return result.user;
      }
    } catch (e: any) {
      console.warn('[AuthService] checkRedirectAuth error:', e);
    }
  }
  return null;
}

/**
 * Universal Google Sign In for Web and Mobile.
 * - Web: Firebase popup / redirect
 * - Mobile: Native Google Sign-In SDK via Google Play Services (100% native, no browser redirect issues)
 */
export async function signInWithGoogle(): Promise<AuthResult> {
  try {
    if (Platform.OS === 'web') {
      // --- Web: Firebase popup with redirect fallback ---
      try {
        const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
        return { success: true, user: result.user };
      } catch (popupErr: any) {
        if (
          popupErr?.code === 'auth/popup-blocked' ||
          popupErr?.code === 'auth/operation-not-supported-in-this-environment'
        ) {
          console.log('[AuthService] Popup failed, falling back to redirect...', popupErr?.code);
          await signInWithRedirect(auth, googleProvider, browserPopupRedirectResolver);
          return { success: true };
        }
        throw popupErr;
      }
    } else {
      // --- Mobile (Android & iOS): Native Google Play Services ---
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResponse = await GoogleSignin.signIn();
      
      // Support both latest v13+ data wrapper and standard response
      const idToken = signInResponse.data?.idToken ?? (signInResponse as any).idToken;

      if (!idToken) {
        console.error('[AuthService] No idToken received from Google Sign-In:', signInResponse);
        return { success: false, error: 'Could not obtain ID token from Google.' };
      }

      return await signInWithGoogleIdToken(idToken);
    }
  } catch (e: any) {
    console.error('[AuthService] signInWithGoogle error:', e);
    return { success: false, error: getFriendlyAuthErrorMessage(e) };
  }
}

/**
 * Sign in using an ID token (e.g. from Google Sign-In on Native)
 */
export async function signInWithGoogleIdToken(idToken: string): Promise<AuthResult> {
  try {
    const credential = GoogleAuthProvider.credential(idToken);
    const result = await signInWithCredential(auth, credential);
    return { success: true, user: result.user };
  } catch (error: any) {
    return { 
      success: false, 
      error: getFriendlyAuthErrorMessage(error) 
    };
  }
}

/**
 * Sign out current user
 */
export async function signOutUser(): Promise<{ success: boolean; error?: string }> {
  try {
    if (Platform.OS !== 'web') {
      try {
        await GoogleSignin.signOut();
      } catch (e) {
        console.warn('[AuthService] GoogleSignin.signOut warning:', e);
      }
    }
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Listen for Firebase Auth state changes
 */
export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Get current user
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}
