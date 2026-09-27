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
  deleteUser,
} from 'firebase/auth';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { auth } from '@/config/firebase';
import { GOOGLE_DRIVE_CONFIG } from '@/config/googleDrive';
import { googleDriveService } from '@/services/googleDriveService';
import { deleteAllUserCloudData } from '@/services/firestoreService';

// Complete auth session if returning from a web-browser auth flow
WebBrowser.maybeCompleteAuthSession();

// Configure Google Auth Provider with Profile and Email scopes
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({ prompt: 'select_account' });

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
 * Universal Google Sign In for Web and Mobile (100% Native & Web support)
 */
export async function signInWithGoogle(): Promise<AuthResult> {
  try {
    if (Platform.OS === 'web') {
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
      // Mobile (Android / iOS): Use the Android OAuth client with reverse-client-ID redirect URI.
      // Google Android clients automatically accept:
      //   com.googleusercontent.apps.{CLIENT_ID}:/oauth2redirect/google
      // This is registered in google-services.json (client_type: 1).
      const ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '';
      const redirectUri = AuthSession.makeRedirectUri({
        native: `com.googleusercontent.apps.${ANDROID_CLIENT_ID.split('.apps.')[0]}:/oauth2redirect/google`,
      });

      const nonce = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
      const scopeString = ['openid', 'profile', 'email'].join(' ');
      const authUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(ANDROID_CLIENT_ID)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=${encodeURIComponent('id_token')}` +
        `&scope=${encodeURIComponent(scopeString)}` +
        `&nonce=${encodeURIComponent(nonce)}` +
        `&prompt=select_account`;

      const authResponse = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

      if (authResponse.type === 'success' && authResponse.url) {
        // Google returns tokens in the URL hash fragment
        const hashIndex = authResponse.url.indexOf('#');
        const queryIndex = authResponse.url.indexOf('?');
        const fragment =
          hashIndex !== -1
            ? authResponse.url.substring(hashIndex + 1)
            : queryIndex !== -1
            ? authResponse.url.substring(queryIndex + 1)
            : '';
        const params = new URLSearchParams(fragment);
        const idToken = params.get('id_token');

        if (idToken) {
          return await signInWithGoogleIdToken(idToken);
        }
        console.warn('[AuthService] No id_token received in auth callback.');
      }
      return { success: false, error: 'Sign-in flow did not complete.' };
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

/**
 * Permanently delete the user's account and cloud data:
 * 1. Purges Firestore shops/{userId} and subcollections
 * 2. Disconnects Google Drive
 * 3. Deletes Firebase Auth user
 * Complies with Google Play Account Deletion policy.
 */
export async function deleteCurrentUserAccount(): Promise<{ success: boolean; error?: string }> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'No authenticated user found.' };
    }

    // 1. Delete all Firestore records first while still authenticated
    const cloudResult = await deleteAllUserCloudData(user.uid);
    if (!cloudResult.success) {
      console.warn('[AuthService] Cloud data deletion warning:', cloudResult.error);
    }

    // 2. Disconnect Google Drive
    try {
      await googleDriveService.disconnect();
    } catch (driveErr) {
      console.warn('[AuthService] Drive disconnect warning during account deletion:', driveErr);
    }

    // 3. Delete Firebase Auth user
    await deleteUser(user);

    return { success: true };
  } catch (error: any) {
    console.error('[AuthService] deleteCurrentUserAccount error:', error);
    if (error?.code === 'auth/requires-recent-login') {
      return {
        success: false,
        error: 'Please sign out and sign in again before deleting your account for security verification.',
      };
    }
    return {
      success: false,
      error: getFriendlyAuthErrorMessage(error) || error?.message || 'Failed to delete account.',
    };
  }
}

