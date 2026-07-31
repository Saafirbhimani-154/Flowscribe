import type { ValidationRule } from '../../hooks/useFormValidation';

export const emailValidationRules: ValidationRule[] = [
  { 
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
    message: 'Please enter a valid email address.' 
  }
];
