/**
 * Trims leading and trailing whitespace from a string.
 */
export const trimInput = (value: string): string => {
  return typeof value === 'string' ? value.trim() : value;
};

/**
 * Removes all extra spaces (collapses multiple spaces into one and trims).
 */
export const cleanSpaces = (value: string): string => {
  if (typeof value !== 'string') return value;
  return value.replace(/\s+/g, ' ').trim();
};

/**
 * Removes spaces only from the end (trailing).
 */
export const trimTrailingSpaces = (value: string): string => {
  return typeof value === 'string' ? value.trimEnd() : value;
};

/**
 * Standard sanitizer for names and text inputs.
 */
export const sanitizeField = (value: string): string => {
  return cleanSpaces(value);
};

/**
 * Validates if a string has no multiple spaces and no leading/trailing spaces.
 */
export const validateSpaces = (value: string): boolean => {
  if (typeof value !== 'string') return true;
  if (!value) return true;
  const hasMultipleSpaces = /\s\s+/.test(value);
  const hasLeadingTrailing = value !== value.trim();
  return !hasMultipleSpaces && !hasLeadingTrailing;
};
