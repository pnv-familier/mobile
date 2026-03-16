/**
 * Get user's timezone offset in minutes (negative for east of UTC)
 * Example: Vietnam (UTC+7) returns -420 minutes
 */
const getUserTimezoneOffsetMinutes = (): number => {
  const now = new Date();
  return now.getTimezoneOffset();
};

/**
 * Parse ISO-8601 string and convert to user's local timezone
 * Handles formats like:
 * - "2026-03-14T18:20:20.850+00:00" (with timezone offset)
 * - "2026-03-14T18:20:20.850Z" (UTC)
 * - "2026-03-14T18:20:20.850" (no timezone info)
 */
const convertToUserTimezone = (isoString: string): Date => {
  try {
    const utcDate = new Date(isoString);
    
    if (isNaN(utcDate.getTime())) {
      console.error('Invalid date string:', isoString);
      return new Date();
    }
    
    const userOffsetMinutes = getUserTimezoneOffsetMinutes();

    const localDate = new Date(utcDate.getTime() - userOffsetMinutes * 60 * 1000);
    
    return localDate;
  } catch (error) {
    console.error('Error converting timezone:', error);
    return new Date();
  }
};

/**
 * Format timestamp for message display (HH:mm)
 * Example: "18:20"
 */
export const formatMessageTime = (isoString: string): string => {
  try {
    const localDate = convertToUserTimezone(isoString);
    const hours = String(localDate.getUTCHours()).padStart(2, '0');
    const minutes = String(localDate.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting message time:', error);
    return '--:--';
  }
};

/**
 * Format timestamp for session date display
 * Shows "Today", "Yesterday", or date like "Mar 15"
 */
export const formatSessionDate = (isoString: string): string => {
  try {
    const localDate = convertToUserTimezone(isoString);
    const today = new Date();
    
    // Get date components in local timezone
    const localYear = localDate.getUTCFullYear();
    const localMonth = localDate.getUTCMonth();
    const localDay = localDate.getUTCDate();
    
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();
    
    // Create date-only objects for comparison
    const localDateOnly = new Date(localYear, localMonth, localDay);
    const todayDateOnly = new Date(todayYear, todayMonth, todayDay);
    const yesterdayDateOnly = new Date(todayYear, todayMonth, todayDay - 1);
    
    if (localDateOnly.getTime() === todayDateOnly.getTime()) {
      return 'Today';
    }
    if (localDateOnly.getTime() === yesterdayDateOnly.getTime()) {
      return 'Yesterday';
    }
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[localMonth]} ${localDay}`;
  } catch (error) {
    console.error('Error formatting session date:', error);
    return 'Unknown';
  }
};

/**
 * Format full timestamp with date and time
 * Example: "Mar 15, 18:20"
 */
export const formatFullTimestamp = (isoString: string): string => {
  try {
    const localDate = convertToUserTimezone(isoString);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const hours = String(localDate.getUTCHours()).padStart(2, '0');
    const minutes = String(localDate.getUTCMinutes()).padStart(2, '0');
    const month = monthNames[localDate.getUTCMonth()];
    const day = localDate.getUTCDate();
    return `${month} ${day}, ${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting full timestamp:', error);
    return 'Unknown';
  }
};

