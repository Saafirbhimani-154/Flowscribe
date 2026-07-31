export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    slugId: string;
    roleId: string;
  };
}
