import type { ValidationRule } from '../../hooks/useFormValidation';

export const passwordValidationRules: ValidationRule[] = [
  { 
    validate: (val) => val.length >= 8, 
    message: 'Password must be at least 8 characters long.' 
  },
  { 
    validate: (val) => /[0-9]/.test(val), 
    message: 'Password must contain at least one number.' 
  }
];
