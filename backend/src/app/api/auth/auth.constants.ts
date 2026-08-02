const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('FATAL: JWT_SECRET environment variable is not set. Refusing to start.');
}

export const AUTH_CONSTANTS = {
  JWT_SECRET: jwtSecret,
  JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN || '30m') as string,
  BCRYPT_SALT_ROUNDS: 10,
};
