import type { ValidationRule } from '../../hooks/useFormValidation';
import { VALIDATION_MESSAGES } from './validationConstants';
import { validateSpaces } from './spaceValidation';

export const emailValidationRules: ValidationRule[] = [
  { 
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
    message: VALIDATION_MESSAGES.EMAIL_INVALID 
  },
  {
    validate: validateSpaces,
    message: VALIDATION_MESSAGES.NO_EXTRA_SPACES
  }
];
