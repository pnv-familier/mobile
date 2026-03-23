/**
 * Format Instant timestamp or legacy array format
 * Handles both backend Instant strings and legacy array formats
 * Returns time in 12-hour format with AM/PM in user's local timezone
 */
export const formatTimestamp = (timestamp: string | number[]): string => {
  if (!timestamp) return '';

  let date: Date;

  if (Array.isArray(timestamp)) {
    // Legacy array format: [year, month, day, hour, minute]
    const [year, month, day, hour = 0, minute = 0] = timestamp;
    date = new Date(year, month - 1, day, hour, minute);
  } else {
    // Handle Instant string format
    try {
      let isoString = (timestamp as string).trim();
      
      // If no timezone info, assume UTC (backend Instant default)
      if (!isoString.includes('Z') && !isoString.includes('+') && !isoString.includes('-', 10)) {
        isoString += 'Z';
      }
      
      date = new Date(isoString);
    } catch (error) {
      console.error('Error parsing timestamp:', error);
      return '';
    }
  }

  if (isNaN(date.getTime())) return '';

  // Format in user's local timezone
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

/**
 * Format Instant timestamp for 24-hour format
 * Returns time in HH:mm format in user's local timezone
 */
export const formatTimestamp24h = (instantString: string): string => {
  if (!instantString) return '';
  
  try {
    let isoString = instantString.trim();
    
    // If no timezone info, assume UTC
    if (!isoString.includes('Z') && !isoString.includes('+') && !isoString.includes('-', 10)) {
      isoString += 'Z';
    }
    
    const date = new Date(isoString);
    
    if (isNaN(date.getTime())) return '';
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting 24h timestamp:', error);
    return '';
  }
};
