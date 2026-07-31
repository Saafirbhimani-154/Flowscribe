export const AUTH_CONSTANTS = {
  JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret-for-development-only',
  JWT_EXPIRES_IN: '7d',
  BCRYPT_SALT_ROUNDS: 10,
};
