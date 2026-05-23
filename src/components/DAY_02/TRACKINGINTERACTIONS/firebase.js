// src/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBNCXIOAX2HUdeLvUxkTJh7DVbv8JU485s",
  authDomain: "goalgrid-c5e9c.firebaseapp.com",
  projectId: "goalgrid-c5e9c",
  storageBucket: "goalgrid-c5e9c.firebasestorage.app",
  messagingSenderId: "544004357501",
  appId: "1:544004357501:web:4b81a3686422b28534e014",
  measurementId: "G-BJQMLK9JJ1",
};

// ============================================
// 🔥 BULLETPROOF SINGLETON PATTERN
// Firebase only initializes ONCE across entire app
// ============================================

let app;
let db;
let auth;
let persistenceEnabled = false;

// Check if Firebase is already initialized
if (getApps().length === 0) {
  console.log('🔥 Initializing Firebase for the FIRST time...');
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  
  // ============================================
  // 🔒 ENABLE PERSISTENCE - ONLY ONCE!
  // This fixes the "persistence already enabled" error
  // ============================================
  if (!persistenceEnabled) {
    enableIndexedDbPersistence(db)
      .then(() => {
        persistenceEnabled = true;
        console.log('✅ Firestore persistence enabled successfully');
      })
      .catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('⚠️ Persistence failed: Multiple tabs open');
        } else if (err.code === 'unimplemented') {
          console.warn('⚠️ Persistence not supported by this browser');
        } else {
          console.error('❌ Persistence error:', err);
        }
      });
  }
} else {
  console.log('♻️ Firebase already initialized, reusing existing instance');
  app = getApps()[0];
  db = getFirestore(app);
  auth = getAuth(app);
}

// Initialize Google Provider
export const provider = new GoogleAuthProvider();

// Google Sign-In function
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log('✅ User signed in:', result.user.email);
    return result.user;
  } catch (err) {
    console.error("❌ Google Sign-In Error:", err.code, err.message);
    return null;
  }
};

// Logout function
export const logOut = async () => {
  try {
    await signOut(auth);
    console.log('✅ User signed out successfully');
  } catch (err) {
    console.error("❌ Logout Error:", err.code, err.message);
  }
};

// Export everything
export { app, db, auth };
export default app;