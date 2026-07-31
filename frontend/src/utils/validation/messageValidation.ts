import type { ValidationRule } from '../../hooks/useFormValidation';
import { VALIDATION_MESSAGES } from './validationConstants';

export const messageValidationRules: ValidationRule[] = [
  { 
    validate: (val) => val.length >= 10, 
    message: VALIDATION_MESSAGES.MESSAGE_MIN_LENGTH 
  },
  {
    validate: (val) => val.length <= 500,
    message: VALIDATION_MESSAGES.MESSAGE_MAX_LENGTH
  }
];
