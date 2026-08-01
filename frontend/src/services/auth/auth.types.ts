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

export interface AuthResponse {
  message: string;
  auth: {
    id: string;
    email: string;
  };
  userProfile: {
    firstName: string;
    lastName: string;
  };
  role: {
    id: string;
    name: string;
  };
  slug: {
    name: string;
    isSet: boolean;
  };
}
