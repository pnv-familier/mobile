/**
 * TypeScript definitions for Java Instant handling
 * 
 * These types ensure type safety when working with backend Instant timestamps
 */

/**
 * Represents a Java Instant timestamp as ISO-8601 string
 * Always in UTC format from backend
 * Example: "2024-03-15T11:20:20.850Z"
 */
export type InstantString = string;

/**
 * Branded type for compile-time safety
 */
export type Instant = string & { readonly __brand: 'Instant' };

/**
 * Type guard to check if a string is a valid Instant
 */
export const isValidInstant = (value: string): value is InstantString => {
  try {
    const date = new Date(value);
    return !isNaN(date.getTime()) && value.includes('T');
  } catch {
    return false;
  }
};

/**
 * Create a branded Instant type (for extra type safety)
 */
export const createInstant = (value: string): Instant => {
  if (!isValidInstant(value)) {
    throw new Error(`Invalid instant string: ${value}`);
  }
  return value as Instant;
};

/**
 * Common timestamp fields used across the app
 */
export interface TimestampFields {
  created_at: InstantString;
  updated_at?: InstantString;
}

/**
 * Extended timestamp fields for entities with more detailed tracking
 */
export interface DetailedTimestampFields extends TimestampFields {
  deleted_at?: InstantString;
  last_accessed_at?: InstantString;
}

/**
 * Format options for displaying Instant timestamps
 */
export interface InstantDisplayOptions {
  format: 'relative' | 'time' | 'date' | 'full' | 'detailed';
  use24Hour?: boolean;
  includeSeconds?: boolean;
  includeTimezone?: boolean;
  locale?: string;
}

/**
 * Utility type to convert LocalDateTime fields to Instant
 * Use this when migrating from LocalDateTime to Instant
 */
export type LocalDateTimeToInstant<T> = {
  [K in keyof T]: T[K] extends string 
    ? K extends `${string}_at` | `${string}Time` | `${string}Date`
      ? InstantString
      : T[K]
    : T[K];
};

/**
 * Example usage for migrating existing types:
 * 
 * // Before (with LocalDateTime)
 * interface OldPost {
 *   id: number;
 *   content: string;
 *   createdAt: string; // LocalDateTime
 *   updatedAt: string; // LocalDateTime
 * }
 * 
 * // After (with Instant)
 * interface NewPost extends LocalDateTimeToInstant<OldPost> {
 *   // createdAt and updatedAt are now InstantString
 * }
 */