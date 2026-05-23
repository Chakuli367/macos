import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, Analytics } from "firebase/analytics";

// Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBNCXIOAX2HUdeLvUxkTJh7DVbv8JU485s",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "goalgrid-c5e9c.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "goalgrid-c5e9c",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "goalgrid-c5e9c.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "544004357501",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:544004357501:web:4b81a3686422b28534e014",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-BJQMLK9JJ1",
};

// ✅ Initialize Firebase ONCE
const app: FirebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

// ✅ Services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

// ✅ Analytics (browser-only)
export let analytics: Analytics | null = null;

if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Google auth provider
const provider = new GoogleAuthProvider();

// Sign in
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

// Sign out
export const logOut = async () => {
  await signOut(auth);
};

// Get current user
export const getCurrentUser = () => auth.currentUser;