export interface LoginCredentials {
  email: string;
  password: string; // M-3: required, not optional
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string; // M-3: required, not optional
  confirmPassword: string;
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  slugId: string;
  roleId: string;
}

// Note: No `token` field — token lives exclusively in the HTTP-only cookie (S-6 fix)
export interface AuthResponse {
  message: string;
  user: AuthUser;
}
