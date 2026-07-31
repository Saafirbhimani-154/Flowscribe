import type { ValidationRule } from '../../hooks/useFormValidation';
import { VALIDATION_MESSAGES } from './validationConstants';

export const passwordValidationRules: ValidationRule[] = [
  { 
    validate: (val) => val.length >= 8, 
    message: VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH 
  },
  { 
    validate: (val) => /[0-9]/.test(val), 
    message: VALIDATION_MESSAGES.PASSWORD_REQUIRE_NUMBER 
  }
];
