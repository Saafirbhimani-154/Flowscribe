import type { ValidationRule } from '../../hooks/useFormValidation';
import { VALIDATION_MESSAGES } from './validationConstants';

export const emailValidationRules: ValidationRule[] = [
  { 
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
    message: VALIDATION_MESSAGES.EMAIL_INVALID 
  }
];
