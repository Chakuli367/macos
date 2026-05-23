// src/utils/auth.ts

export function getStoredAuth() {
  const stored = localStorage.getItem('goalgrid_auth');
  if (!stored) return null;
  
  try {
    const auth = JSON.parse(stored);
    // Check if auth is still fresh (less than 24 hours old)
    if (Date.now() - auth.lastSync > 24 * 60 * 60 * 1000) {
      return null;
    }
    return auth;
  } catch {
    return null;
  }
}

export function getStoredUserData() {
  const stored = localStorage.getItem('goalgrid_user_data');
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  const auth = getStoredAuth();
  return auth !== null && auth.isAuthenticated === true;
}

export function getCurrentUserId(): string | null {
  const auth = getStoredAuth();
  return auth?.uid || null;
}

export function getCurrentUserEmail(): string | null {
  const auth = getStoredAuth();
  return auth?.email || null;
}