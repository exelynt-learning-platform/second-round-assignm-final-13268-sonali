// src/utils/formatTime.js
// ─────────────────────────────────────────────────────────────
//  Utility helpers used across components.
// ─────────────────────────────────────────────────────────────

/**
 * formatTime
 * Converts an ISO timestamp string to a human-readable HH:MM AM/PM string.
 * @param {string} isoString
 * @returns {string}
 */
export function formatTime(isoString) {
  try {
    return new Date(isoString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

/**
 * formatDate
 * Returns a friendly date label: "Today", "Yesterday", or "MMM D, YYYY".
 * @param {string} isoString
 * @returns {string}
 */
export function formatDate(isoString) {
  try {
    const date  = new Date(isoString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const sameDay = (a, b) =>
      a.getDate()     === b.getDate() &&
      a.getMonth()    === b.getMonth() &&
      a.getFullYear() === b.getFullYear();

    if (sameDay(date, today))     return 'Today';
    if (sameDay(date, yesterday)) return 'Yesterday';

    return date.toLocaleDateString([], {
      year: 'month', month: 'long', day: 'numeric',
    });
  } catch {
    return '';
  }
}

/**
 * truncate
 * Shortens a string to maxLen characters, appending "…" if cut.
 * @param {string} str
 * @param {number} maxLen
 * @returns {string}
 */
export function truncate(str, maxLen = 50) {
  if (!str) return '';
  return str.length <= maxLen ? str : str.slice(0, maxLen) + '…';
}
