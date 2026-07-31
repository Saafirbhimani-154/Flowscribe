// B-3: Fail fast at startup if JWT_SECRET is not set — no silent fallback in production
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret && process.env.NODE_ENV === 'production') {
  throw new Error('FATAL: JWT_SECRET environment variable is not set. Refusing to start.');
}

export const AUTH_CONSTANTS = {
  JWT_SECRET: jwtSecret || 'flowscribe-dev-secret-CHANGE-IN-PRODUCTION',
  JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN || '30m') as string,
  BCRYPT_SALT_ROUNDS: 10,
};
