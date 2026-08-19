import { initializeApp, getApps } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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

googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (err: any) {
    console.warn("Firebase Auth popup error or fallback needed:", err);
    return { user: null, error: err?.message || 'Google Auth Error' };
  }
};

export const loginWithEmail = async (email: string, pass: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return { user: result.user, error: null };
  } catch (err: any) {
    if (err?.code === 'auth/user-not-found' || err?.code === 'auth/invalid-credential') {
      try {
        const newResult = await createUserWithEmailAndPassword(auth, email, pass);
        return { user: newResult.user, error: null };
      } catch (createErr: any) {
        return { user: null, error: createErr?.message || 'Authentication error' };
      }
    }
    return { user: null, error: err?.message || 'Email Auth Error' };
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
