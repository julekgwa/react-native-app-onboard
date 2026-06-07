/**
 * Minimal AsyncStorage-compatible interface. Any storage that implements these
 * three methods works (e.g. @react-native-async-storage/async-storage,
 * expo-secure-store wrappers, or an in-memory mock in tests). Keeping the
 * dependency injected means this library does not have to ship a storage peer
 * dependency of its own.
 */
export type OnboardingStorageAdapter = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

const DEFAULT_KEY = '@react-native-app-onboard/completed';
const COMPLETED_VALUE = 'true';

/**
 * Returns whether the user has previously completed onboarding stored under
 * `key`. Defaults to a namespaced key so callers usually only pass the storage.
 */
export async function hasCompletedOnboarding(
  storage: OnboardingStorageAdapter,
  key: string = DEFAULT_KEY
): Promise<boolean> {
  const value = await storage.getItem(key);
  return value === COMPLETED_VALUE;
}

/** Marks onboarding as completed so it can be skipped on subsequent launches. */
export async function markOnboardingComplete(
  storage: OnboardingStorageAdapter,
  key: string = DEFAULT_KEY
): Promise<void> {
  await storage.setItem(key, COMPLETED_VALUE);
}

/** Clears the stored completion flag (useful for "replay onboarding" actions). */
export async function resetOnboarding(
  storage: OnboardingStorageAdapter,
  key: string = DEFAULT_KEY
): Promise<void> {
  await storage.removeItem(key);
}

/**
 * Convenience factory that binds a storage adapter (and optional key) once and
 * returns ready-to-call helpers, so app code doesn't repeat the storage arg.
 */
export function createOnboardingStorage(
  storage: OnboardingStorageAdapter,
  key: string = DEFAULT_KEY
) {
  return {
    hasCompleted: () => hasCompletedOnboarding(storage, key),
    markComplete: () => markOnboardingComplete(storage, key),
    reset: () => resetOnboarding(storage, key),
  };
}
