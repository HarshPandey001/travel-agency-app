import { initializeApp, getApps } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDKe_i82Pm16lW0cSCTHPXjKIYgZvIO5Yw",
  authDomain: "travel-with-harsh.firebaseapp.com",
  projectId: "travel-with-harsh",
  storageBucket: "travel-with-harsh.firebasestorage.app",
  messagingSenderId: "11621957141",
  appId: "1:11621957141:web:6e640d1a03437bbcf1d81c",
  measurementId: "G-5XXMW7BGK3"
};

// Initialize Firebase safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Request explicit email, profile & openid scopes
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.addScope('openid');

googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Helper to extract full Google user info accurately
export const extractGoogleUserData = (user: FirebaseUser) => {
  const email = (user.email || user.providerData?.[0]?.email || '').toLowerCase().trim();
  const name = user.displayName || user.providerData?.[0]?.displayName || (email ? email.split('@')[0] : 'Traveler');
  const avatar = user.photoURL || user.providerData?.[0]?.photoURL || '';
  const phone = user.phoneNumber || user.providerData?.[0]?.phoneNumber || '';
  return {
    id: user.uid,
    name,
    email,
    avatar,
    phone
  };
};

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (err: any) {
    if (
      err?.code === 'auth/popup-closed-by-user' ||
      err?.code === 'auth/popup-blocked' ||
      err?.code === 'auth/cancelled-popup-request'
    ) {
      try {
        await signInWithRedirect(auth, googleProvider);
        return { user: null, error: null };
      } catch (redirectErr: any) {
        return { user: null, error: redirectErr?.message || 'Google redirect failed' };
      }
    }
    return { user: null, error: err?.message || 'Google Auth Error' };
  }
};

// Check for redirect result on page load
export const checkRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      return { user: result.user, error: null };
    }
    return { user: null, error: null };
  } catch (err: any) {
    return { user: null, error: err?.message || 'Redirect check failed' };
  }
};

export const logoutFirebase = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (err) {
    console.error("Logout error", err);
  }
};

export { onAuthStateChanged };
export type { FirebaseUser };
