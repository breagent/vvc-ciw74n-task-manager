/**
 * Format deadline for display
 * @param {Date|null} date - Deadline date
 * @returns {string} Formatted deadline string
 */
export function formatDeadline(date) {
  if (!date) return 'No deadline';

  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const hours = diff / (1000 * 60 * 60);
  const days = diff / (1000 * 60 * 60 * 24);

  // Past dates
  if (hours < -24) {
    const daysAgo = Math.abs(Math.floor(days));
    if (daysAgo === 1) return 'Yesterday';
    return `${daysAgo} days ago`;
  }
  if (hours < 0) return 'Earlier today';

  // Future dates
  if (hours < 24) return `Today, ${formatTime(date)}`;
  if (hours < 48) return `Tomorrow, ${formatTime(date)}`;
  if (days < 7) {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    return `${dayName}, ${formatTime(date)}`;
  }

  return `${formatDate(date)}, ${formatTime(date)}`;
}

/**
 * Format time in 12-hour format
 * @param {Date} date - Date object
 * @returns {string} Formatted time string
 */
export function formatTime(date) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Format date without time
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  const currentYear = new Date().getFullYear();
  const dateYear = date.getFullYear();

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: dateYear !== currentYear ? 'numeric' : undefined
  });
}

/**
 * Check if date is overdue
 * @param {Date|null} date - Deadline date
 * @param {boolean} completed - Whether task is completed
 * @returns {boolean}
 */
export function isOverdue(date, completed) {
  if (!date || completed) return false;
  return date < new Date();
}

/**
 * Check if date is due soon (within 24 hours)
 * @param {Date|null} date - Deadline date
 * @returns {boolean}
 */
export function isDueSoon(date) {
  if (!date) return false;
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return diff > 0 && diff < 86400000; // 24 hours in milliseconds
}

/**
 * Format date for input field (YYYY-MM-DD)
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
export function formatDateForInput(date) {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format time for input field (HH:MM)
 * @param {Date} date - Date object
 * @returns {string} Formatted time string
 */
export function formatTimeForInput(date) {
  if (!date) return '';
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Parse date and time strings into Date object
 * @param {string} dateStr - Date string (YYYY-MM-DD)
 * @param {string} timeStr - Time string (HH:MM)
 * @returns {Date|null}
 */
export function parseDateTimeInput(dateStr, timeStr) {
  if (!dateStr) return null;
  const time = timeStr || '00:00';
  return new Date(`${dateStr}T${time}`);
}
