/**
 * DEPRECATED: Use instantUtils.ts instead
 * This file is kept for backward compatibility
 * 
 * @deprecated Import from '../utils/instantUtils' instead
 */

import {
  formatInstantTime as _formatInstantTime,
  formatInstantDate as _formatInstantDate,
  formatInstantFull as _formatInstantFull,
  formatInstantRelative as _formatInstantRelative,
  formatInstantDetailed as _formatInstantDetailed,
  toInstant as _toInstant,
  nowInstant as _nowInstant,
} from './instantUtils';

/**
 * Get user's timezone information
 */
const getUserTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
};

/**
 * Parse Instant (ISO-8601) string and convert to user's local timezone
 * Properly handles backend Instant timestamps like:
 * - "2024-03-14T11:20:20.850Z" (UTC Instant)
 * - "2024-03-14T18:20:20.850+07:00" (with timezone offset)
 * - "2024-03-14T18:20:20.850" (assumes UTC if no timezone)
 */
const parseInstantToLocal = (instantString: string): Date => {
  try {
    // Ensure we have a valid ISO string
    let isoString = instantString.trim();
    
    // If no timezone info, assume UTC (backend Instant default)
    if (!isoString.includes('Z') && !isoString.includes('+') && !isoString.includes('-', 10)) {
      isoString += 'Z';
    }
    
    const utcDate = new Date(isoString);
    
    if (isNaN(utcDate.getTime())) {
      console.error('Invalid Instant string:', instantString);
      return new Date();
    }
    
    return utcDate; // JavaScript Date automatically handles local timezone conversion
  } catch (error) {
    console.error('Error parsing Instant:', error);
    return new Date();
  }
};

/**
 * Format Instant timestamp for message display (HH:mm in local time)
 * Example: "18:20" (automatically in user's timezone)
 * 
 * @deprecated Use formatInstantTime from instantUtils instead
 */
export const formatMessageTime = (instantString: string): string => {
  return _formatInstantTime(instantString, { use24Hour: true });
};

/**
 * Format Instant timestamp for session date display
 * Shows "Today", "Yesterday", or date like "Mar 15" (in user's timezone)
 * 
 * @deprecated Use formatInstantDate from instantUtils instead
 */
export const formatSessionDate = (instantString: string): string => {
  return _formatInstantDate(instantString);
};

/**
 * Format full Instant timestamp with date and time (in user's timezone)
 * Example: "Mar 15, 18:20"
 * 
 * @deprecated Use formatInstantFull from instantUtils instead
 */
export const formatFullTimestamp = (instantString: string): string => {
  return _formatInstantFull(instantString);
};

/**
 * Format Instant timestamp for relative time display
 * Example: "2 minutes ago", "1 hour ago", "Yesterday", "Mar 15"
 * 
 * @deprecated Use formatInstantRelative from instantUtils instead
 */
export const formatRelativeTime = (instantString: string): string => {
  return _formatInstantRelative(instantString);
};

/**
 * Format Instant timestamp for detailed display with timezone info
 * Example: "March 15, 2024 at 6:20 PM (GMT+7)"
 * 
 * @deprecated Use formatInstantDetailed from instantUtils instead
 */
export const formatDetailedTimestamp = (instantString: string): string => {
  return _formatInstantDetailed(instantString);
};

/**
 * Convert local Date to Instant string for backend
 * Example: new Date() -> "2024-03-15T11:20:20.850Z"
 * 
 * @deprecated Use toInstant from instantUtils instead
 */
export const toInstantString = (date: Date = new Date()): string => {
  return _toInstant(date);
};

/**
 * Get current time as Instant string
 * 
 * @deprecated Use nowInstant from instantUtils instead
 */
export const nowAsInstant = (): string => {
  return _nowInstant();
};

