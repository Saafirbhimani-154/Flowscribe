/**
 * Validates a username.
 * Criteria:
 * - 3 to 16 characters long.
 * - Can contain letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-).
 * - Cannot start with a number, underscore, or hyphen.
 * 
 * @param {string} username - The username to validate.
 * @returns {boolean} - True if valid.
 */
export const validateUsername = (username: string): boolean => {
  if (!username) return false;
  const usernameRegex = /^[A-Za-z][A-Za-z0-9_-]{2,15}$/;
  return usernameRegex.test(username);
};
