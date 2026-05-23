import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "src/components/firebase"; // Adjust path as needed

const firestore = getFirestore(app);

// Cache for API keys to avoid repeated Firebase calls
let cachedApiKeys: string[] | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches API keys from Firebase Firestore
 * Returns cached keys if recently fetched
 */
export async function getApiKeys(): Promise<string[]> {
  const now = Date.now();
  
  // Return cached keys if still valid
  if (cachedApiKeys && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedApiKeys;
  }

  try {
    const apiKeysDoc = doc(firestore, "config", "apiKeys");
    const docSnap = await getDoc(apiKeysDoc);

    if (docSnap.exists()) {
      const data = docSnap.data();
      cachedApiKeys = data.keys || [];
      lastFetchTime = now;
      console.log("✅ API keys fetched from Firebase:", cachedApiKeys.length, "keys");
      return cachedApiKeys;
    } else {
      console.warn("⚠️ API keys document not found in Firebase");
      return [];
    }
  } catch (error) {
    console.error("❌ Error fetching API keys from Firebase:", error);
    // Return cached keys as fallback if available
    return cachedApiKeys || [];
  }
}

/**
 * Force refresh API keys from Firebase
 */
export async function refreshApiKeys(): Promise<string[]> {
  cachedApiKeys = null;
  return getApiKeys();
}
