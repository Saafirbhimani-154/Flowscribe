/**
 * Inner Space Validation Utility
 * Handles multiple spaces between words and ensures clean spacing.
 */

/**
 * Validates if a string has multiple consecutive spaces between words.
 * @param {string} value - The string to validate.
 * @returns {boolean} - True if valid (no multiple inner spaces), false if invalid.
 */
export const validateInnerSpaces = (value: string): boolean => {
  if (typeof value !== 'string') return true;
  if (!value) return true;
  const trimmed = value.trim();
  const hasMultipleSpaces = /\s\s+/.test(trimmed);
  return !hasMultipleSpaces;
};

/**
 * Collapses multiple consecutive spaces into a single space.
 * @param {string} value - The string to clean.
 * @returns {string} - The cleaned string.
 */
export const collapseInnerSpaces = (value: string): string => {
  if (typeof value !== 'string') return value;
  return value.replace(/\s+/g, ' ').trim();
};

/**
 * Checks if there is at least one space between words (useful for full names).
 * @param {string} value - The string to check.
 * @returns {boolean} - True if at least one space exists, false otherwise.
 */
export const hasAtLeastOneSpace = (value: string): boolean => {
  if (typeof value !== 'string') return false;
  return /\s/.test(value.trim());
};

/**
 * Full sanitization: trim and collapse inner spaces.
 */
export const sanitizeInnerSpaces = (value: string): string => {
  return collapseInnerSpaces(value);
};
