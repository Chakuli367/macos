const TRIAL_DURATION = 120;
const STORAGE_KEY = "trial_start_time";

export function startTrial() {
  if (!sessionStorage.getItem(STORAGE_KEY)) {
    sessionStorage.setItem(STORAGE_KEY, Date.now().toString());
  }
}

export function getSecondsRemaining(): number {
  const start = sessionStorage.getItem(STORAGE_KEY);
  if (!start) return TRIAL_DURATION;
  const elapsed = Math.floor((Date.now() - parseInt(start)) / 1000);
  return Math.max(0, TRIAL_DURATION - elapsed);
}

export function isTrialExpired(): boolean {
  const start = sessionStorage.getItem(STORAGE_KEY);
  if (!start) return false; // never started = not expired
  return getSecondsRemaining() === 0;
}

export function clearTrial() {
  sessionStorage.removeItem(STORAGE_KEY);
}