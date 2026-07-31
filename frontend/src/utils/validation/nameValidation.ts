import type { ValidationRule } from '../../hooks/useFormValidation';
import { VALIDATION_MESSAGES } from './validationConstants';
import { validateSpaces } from './spaceValidation';

export const nameValidationRules: ValidationRule[] = [
  { 
    validate: (val) => val.length >= 2, 
    message: VALIDATION_MESSAGES.NAME_MIN_LENGTH 
  },
  {
    validate: validateSpaces,
    message: VALIDATION_MESSAGES.NO_EXTRA_SPACES
  }
];
