export const AUTH_MESSAGES = {
  SUCCESS: {
    REGISTERED: 'User registered successfully.',
    RESTORED: 'Account restored successfully.',
    LOGGED_IN: 'Logged in successfully.',
  },
  ERROR: {
    EMAIL_IN_USE: 'This email is already in use.',
    INVALID_CREDENTIALS: 'The email or password provided is incorrect.',
    DEFAULT_ROLE_MISSING: 'Internal system error: Default role not found.',
    INTERNAL_SERVER_ERROR: 'An internal server error occurred.',
  },
  VALIDATION: {
    REQUIRED_FIELDS: 'First name, last name, email, and password are required.',
    INVALID_EMAIL: 'Please provide a valid email address.',
    PASSWORD_LENGTH: 'Password must be at least 6 characters long.',
  }
};
