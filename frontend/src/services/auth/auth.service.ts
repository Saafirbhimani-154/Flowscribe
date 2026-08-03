import type { LoginCredentials, RegisterCredentials, AuthResponse } from './auth.types';
import { API_URL } from '../../config/api';
import { parseJsonSafe, errorMessage } from '../../lib/http';

export const loginService = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // VERY IMPORTANT: Allows browser to save the HTTP-Only cookie!
    body: JSON.stringify(credentials)
  });
  
  if (!res.ok) {
    const error = await parseJsonSafe(res);
    throw new Error(errorMessage(error, 'Login failed'));
  }
  
  const data: AuthResponse = await res.json();
  // No localStorage here! The browser automatically handles the HTTP-only cookie!
  return data;
};

export const registerService = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(credentials)
  });
  
  if (!res.ok) {
    const error = await parseJsonSafe(res);
    throw new Error(errorMessage(error, 'Registration failed'));
  }
  
  const data: AuthResponse = await res.json();
  return data;
};

export const logoutService = async () => {
  await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
};
