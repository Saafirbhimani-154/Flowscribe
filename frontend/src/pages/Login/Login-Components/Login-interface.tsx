import type { FormEvent } from 'react';

export interface LoginCredentials {
  email?: string;
  password?: string;
  rememberMe?: boolean;
}

export interface LoginFormProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
}
