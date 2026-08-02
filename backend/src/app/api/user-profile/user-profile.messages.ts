export const USER_PROFILE_MESSAGES = {
  SUCCESS: {
    PROFILE_FETCHED: 'Profile fetched successfully.',
    PROFILE_UPDATED: 'Profile updated successfully.',
    PASSWORD_CHANGED: 'Password changed successfully.',
    SLUG_CONFIRMED: 'Slug confirmed successfully.',
    SETTINGS_FETCHED: 'Settings fetched successfully.',
    SETTINGS_UPDATED: 'Settings updated successfully.',
    USAGE_FETCHED: 'Usage fetched successfully.',
  },
  ERROR: {
    USER_NOT_FOUND: 'User not found.',
    FORBIDDEN: 'You do not have permission to access this profile.',
    EMAIL_IN_USE: 'This email is already in use by another account.',
    INCORRECT_PASSWORD: 'Current password is incorrect.',
    SAME_PASSWORD: 'New password cannot be the same as the current password.',
    SLUG_ALREADY_SET: 'Slug has already been set and cannot be changed.',
    SLUG_TAKEN: 'This slug is already taken.',
    SLUG_RESERVED: 'This slug is reserved and cannot be used.',
    SLUG_INVALID_FORMAT: 'Slug must be 3-30 characters: lowercase letters, numbers, and hyphens only. Cannot start or end with a hyphen.',
    INTERNAL_SERVER_ERROR: 'An unexpected error occurred. Please try again.',
  },
} as const;
