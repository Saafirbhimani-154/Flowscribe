export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  slugId: string;
  roleId: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}
