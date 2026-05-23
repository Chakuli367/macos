import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
  AuthError
} from "firebase/auth";
import app from "./firebase";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export interface AuthResult {
  user: User | null;
  error: string | null;
}

export async function signUpWithGoogle(): Promise<AuthResult> {
  try {
    // Configure the provider for better popup handling
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
    console.log("Attempting Google popup signup...");
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Google popup signup successful:", result.user?.uid);
    return { user: result.user, error: null };
  } catch (error) {
    const authError = error as AuthError;
    console.error('Google signup error:', authError);
    
    let errorMessage = 'Google signup failed. Please try again.';
    
    switch (authError.code) {
      case 'auth/popup-closed-by-user':
        errorMessage = 'Sign-in was cancelled. Please try again.';
        break;
      case 'auth/popup-blocked':
        errorMessage = 'Popup was blocked. Please allow popups and try again.';
        break;
      case 'auth/account-exists-with-different-credential':
        errorMessage = 'An account already exists with this email using a different sign-in method.';
        break;
      case 'auth/unauthorized-domain':
        errorMessage = 'This domain is not authorized for Google sign-in.';
        break;
      default:
        errorMessage = `Google signup failed: ${authError.message}`;
        break;
    }
    
    return { user: null, error: errorMessage };
  }
}

export async function signUpWithEmail(email: string, password: string): Promise<AuthResult> {
  try {
    console.log("Creating user with Firebase...");
    const result = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Firebase user created successfully:", result.user?.uid);
    return { user: result.user, error: null };
  } catch (error) {
    const authError = error as AuthError;
    console.error("Firebase auth error details:", {
      code: authError.code,
      message: authError.message,
      customData: authError.customData
    });
    
    let errorMessage = 'Failed to create account. Please try again.';
    
    switch (authError.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'An account with this email already exists.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Please enter a valid email address.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password should be at least 6 characters.';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your connection.';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Email/password authentication is not enabled. Please contact support.';
        break;
      case 'auth/configuration-not-found':
        errorMessage = 'Firebase configuration error. Please contact support.';
        break;
      case 'auth/invalid-api-key':
        errorMessage = 'Invalid Firebase API key. Please contact support.';
        break;
      default:
        errorMessage = `Authentication failed: ${authError.message}`;
        break;
    }
    
    return { user: null, error: errorMessage };
  }
}



export function getCurrentUser(): User | null {
  return auth.currentUser;
}

export function onAuthStateChanged(callback: (user: User | null) => void) {
  return auth.onAuthStateChanged(callback);
}