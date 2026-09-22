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
import * as AuthSession from 'expo-auth-session';
import { auth } from '@/config/firebase';
import { GOOGLE_DRIVE_CONFIG } from '@/config/googleDrive';
import { googleDriveService } from '@/services/googleDriveService';

// Complete auth session if returning from a web-browser auth flow
WebBrowser.maybeCompleteAuthSession();

// Configure Google Auth Provider with Profile, Email, and Google Drive scopes
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.addScope('https://www.googleapis.com/auth/drive.file');
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
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential?.accessToken) {
          await googleDriveService.saveAuth({
            accessToken: credential.accessToken,
            email: result.user.email || undefined,
            name: result.user.displayName || undefined,
            picture: result.user.photoURL || undefined,
            expiresAt: Date.now() + 3600 * 1000,
          });
        }
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
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential?.accessToken) {
          await googleDriveService.saveAuth({
            accessToken: credential.accessToken,
            email: result.user.email || undefined,
            name: result.user.displayName || undefined,
            picture: result.user.photoURL || undefined,
            expiresAt: Date.now() + 3600 * 1000,
          });
          googleDriveService.ensureFolders(credential.accessToken).catch(() => {});
        }
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
      // Mobile (Android / iOS): Use expo-auth-session with custom scheme
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'shopkeeperapp',
      });

      const scopeString = ['openid', 'profile', 'email', ...GOOGLE_DRIVE_CONFIG.scopes].join(' ');
      const authUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(GOOGLE_DRIVE_CONFIG.clientId)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=${encodeURIComponent('id_token token')}` +
        `&scope=${encodeURIComponent(scopeString)}` +
        `&nonce=${Math.random().toString(36).substring(2)}` +
        `&prompt=select_account`;

      const authResponse = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
      if (authResponse.type === 'success' && authResponse.url) {
        const hashIndex = authResponse.url.indexOf('#');
        const queryIndex = authResponse.url.indexOf('?');
        const fragment = hashIndex !== -1 ? authResponse.url.substring(hashIndex + 1) : (queryIndex !== -1 ? authResponse.url.substring(queryIndex + 1) : '');
        const params = new URLSearchParams(fragment);
        const idToken = params.get('id_token');
        const accessToken = params.get('access_token');

        if (accessToken) {
          await googleDriveService.saveAuth({
            accessToken,
            expiresAt: Date.now() + 3600 * 1000,
          });
          googleDriveService.ensureFolders(accessToken).catch(() => {});
        }

        if (idToken) {
          const credential = GoogleAuthProvider.credential(idToken, accessToken || undefined);
          const userCred = await signInWithCredential(auth, credential);
          return { success: true, user: userCred.user };
        }
      }
      return { success: false, error: 'Google sign-in was cancelled.' };
    }
  } catch (error: any) {
    console.error('[AuthService] Google Sign-In failed:', error);
    return {
      success: false,
      error: getFriendlyAuthErrorMessage(error),
    };
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
