/**
 * Comprehensive utility for handling Java Instant timestamps in React Native
 * 
 * This utility properly handles:
 * - Backend Java Instant timestamps (always in UTC)
 * - Automatic conversion to user's local timezone
 * - Various display formats for different UI contexts
 * - Type safety and error handling
 */

export interface InstantFormatOptions {
  includeSeconds?: boolean;
  use24Hour?: boolean;
  includeTimezone?: boolean;
  locale?: string;
}

/**
 * Parse Java Instant string to JavaScript Date
 * Handles UTC Instant strings from backend properly
 */
export const parseInstant = (instantString: string): Date => {
  try {
    if (!instantString) {
      throw new Error('Empty instant string');
    }

    let isoString = instantString.trim();
    
    // Ensure UTC timezone if no timezone info (Java Instant default)
    if (!isoString.includes('Z') && !isoString.includes('+') && !isoString.includes('-', 10)) {
      isoString += 'Z';
    }
    
    const date = new Date(isoString);
    
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid instant string: ${instantString}`);
    }
    
    return date;
  } catch (error) {
    console.error('Error parsing Instant:', error);
    return new Date(); // Fallback to current time
  }
};

/**
 * Convert JavaScript Date to Java Instant string (UTC)
 */
export const toInstant = (date: Date = new Date()): string => {
  return date.toISOString();
};

/**
 * Get current time as Java Instant string
 */
export const nowInstant = (): string => {
  return new Date().toISOString();
};

/**
 * Format Instant for message timestamps (HH:mm or h:mm AM/PM)
 */
export const formatInstantTime = (
  instantString: string, 
  options: InstantFormatOptions = {}
): string => {
  try {
    const date = parseInstant(instantString);
    const { use24Hour = false, includeSeconds = false } = options;
    
    if (use24Hour) {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = includeSeconds ? `:${String(date.getSeconds()).padStart(2, '0')}` : '';
      return `${hours}:${minutes}${seconds}`;
    } else {
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const seconds = includeSeconds ? `:${String(date.getSeconds()).padStart(2, '0')}` : '';
      return `${hours}:${minutes}${seconds} ${ampm}`;
    }
  } catch (error) {
    console.error('Error formatting instant time:', error);
    return '--:--';
  }
};

/**
 * Format Instant for date display (Mar 15, Today, Yesterday)
 */
export const formatInstantDate = (instantString: string): string => {
  try {
    const date = parseInstant(instantString);
    const today = new Date();
    
    // Compare dates (ignore time)
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const diffTime = messageDate.getTime() - todayDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays === 1) return 'Tomorrow';
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[date.getMonth()]} ${date.getDate()}`;
  } catch (error) {
    console.error('Error formatting instant date:', error);
    return 'Unknown';
  }
};

/**
 * Format Instant for relative time (2m ago, 1h ago, Yesterday)
 */
export const formatInstantRelative = (instantString: string): string => {
  try {
    const date = parseInstant(instantString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffSeconds < 30) return 'Just now';
    if (diffMinutes < 1) return `${diffSeconds}s ago`;
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    
    // For older dates, show month and day
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[date.getMonth()]} ${date.getDate()}`;
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Unknown';
  }
};

/**
 * Format Instant for full display (Mar 15, 2024 at 6:20 PM)
 */
export const formatInstantFull = (
  instantString: string, 
  options: InstantFormatOptions = {}
): string => {
  try {
    const date = parseInstant(instantString);
    const { 
      use24Hour = false, 
      includeTimezone = false, 
      locale = 'en-US' 
    } = options;
    
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: !use24Hour
    };
    
    if (includeTimezone) {
      dateOptions.timeZoneName = 'short';
    }
    
    return date.toLocaleString(locale, dateOptions);
  } catch (error) {
    console.error('Error formatting full timestamp:', error);
    return 'Unknown';
  }
};

/**
 * Format Instant for detailed display with timezone
 */
export const formatInstantDetailed = (instantString: string): string => {
  return formatInstantFull(instantString, { 
    includeTimezone: true, 
    use24Hour: false 
  });
};

/**
 * Check if an Instant is today
 */
export const isInstantToday = (instantString: string): boolean => {
  try {
    const date = parseInstant(instantString);
    const today = new Date();
    
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  } catch {
    return false;
  }
};

/**
 * Check if an Instant is within the last N minutes
 */
export const isInstantRecent = (instantString: string, minutes: number = 5): boolean => {
  try {
    const date = parseInstant(instantString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = diffMs / (1000 * 60);
    
    return diffMinutes >= 0 && diffMinutes <= minutes;
  } catch {
    return false;
  }
};

/**
 * Get user's timezone information
 */
export const getUserTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
};

/**
 * Get timezone offset in hours (e.g., +7 for Vietnam)
 */
export const getTimezoneOffset = (): number => {
  const offsetMinutes = new Date().getTimezoneOffset();
  return -offsetMinutes / 60; // Negative because getTimezoneOffset returns opposite sign
};

/**
 * Format timezone offset as string (e.g., "+07:00")
 */
export const formatTimezoneOffset = (): string => {
  const offset = getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const hours = String(Math.abs(Math.floor(offset))).padStart(2, '0');
  const minutes = String(Math.abs((offset % 1) * 60)).padStart(2, '0');
  return `${sign}${hours}:${minutes}`;
};

// Legacy compatibility exports
export const formatMessageTime = (instantString: string): string => 
  formatInstantTime(instantString, { use24Hour: true });

export const formatSessionDate = formatInstantDate;
export const formatFullTimestamp = formatInstantFull;
export const formatRelativeTime = formatInstantRelative;
export const formatDetailedTimestamp = formatInstantDetailed;
export const toInstantString = toInstant;
export const nowAsInstant = nowInstant;