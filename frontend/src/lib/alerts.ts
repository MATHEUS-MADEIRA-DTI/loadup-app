/**
 * Plateau Alerts localStorage Utilities
 * Manages persistence of dismissed alert IDs in localStorage.
 */

/** Storage key for dismissed alert IDs */
const STORAGE_KEY = "plateau_alerts_dismissed";

/**
 * Get list of dismissed alert IDs from localStorage
 * @returns Array of dismissed alert _id values, or empty array if none stored or error
 */
export function getDismissedFromStorage(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    // Return empty array on parse error to avoid breaking the app
    return [];
  }
}

/**
 * Add an alert ID to the dismissed list in localStorage
 * Prevents duplicates.
 * @param alertId - The alert _id to dismiss
 */
export function addToDismissed(alertId: string): void {
  const dismissed = getDismissedFromStorage();
  if (!dismissed.includes(alertId)) {
    dismissed.push(alertId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dismissed));
  }
}

/**
 * Clear all dismissed alert IDs from localStorage
 */
export function clearDismissed(): void {
  localStorage.removeItem(STORAGE_KEY);
}
