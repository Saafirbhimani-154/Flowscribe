export const AUTH_MESSAGES = {
  SUCCESS: {
    REGISTERED: 'User registered successfully.',
    RESTORED: 'Account restored successfully.',
    LOGGED_IN: 'Logged in successfully.',
  },
  ERROR: {
    EMAIL_IN_USE: 'Email is already in use.',
    INVALID_CREDENTIALS: 'Login failed. Please check your email and password.',
    DEFAULT_ROLE_MISSING: 'Internal error: default role not found.',
    INTERNAL_SERVER_ERROR: 'An internal server error occurred.',
    UNAUTHORIZED: 'Unauthorized',
  },
  VALIDATION: {
    REQUIRED_FIELDS: 'First name, last name, email, and password are required.',
    INVALID_EMAIL: 'Please provide a valid email address.',
    PASSWORD_LENGTH: 'Password must be at least 6 characters long.',
  }
};
