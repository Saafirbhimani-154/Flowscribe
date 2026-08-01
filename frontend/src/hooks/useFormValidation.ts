import { useState, useCallback, useEffect } from 'react';

export type ValidationRule<T = any> = {
  pattern?: RegExp;
  validate?: (value: string, values: T) => boolean;
  message: string;
};

export type ValidationSchema<T> = {
  [K in keyof T]?: ValidationRule<T>[];
};

export function useFormValidation<T extends Record<string, string>>(
  initialState: T,
  schema: ValidationSchema<T>
) {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isValid, setIsValid] = useState(false);

  const validateField = useCallback((name: keyof T, value: string, currentValues: T) => {
    const rules = schema[name];
    if (!rules) return '';

    for (const rule of rules) {
      if (rule.pattern && !rule.pattern.test(value)) {
        return rule.message;
      }
      if (rule.validate && !rule.validate(value, currentValues)) {
        return rule.message;
      }
    }
    return '';
  }, [schema]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  // Re-calculate overall form validity and field errors whenever values change
  useEffect(() => {
    let formIsValid = true;
    
    // Check form validity
    for (const key in schema) {
      if (validateField(key, values[key], values)) {
        formIsValid = false;
        break;
      }
    }
    setIsValid(formIsValid);

    // Update errors for ALL touched fields
    setErrors(prevErrors => {
      let hasChanges = false;
      const nextErrors = { ...prevErrors };
      
      for (const key in schema) {
        if (touched[key]) {
          const errorMsg = validateField(key, values[key], values);
          if (nextErrors[key] !== errorMsg) {
            nextErrors[key] = errorMsg;
            hasChanges = true;
          }
        }
      }
      return hasChanges ? nextErrors : prevErrors;
    });
  }, [values, touched, schema, validateField]);

  // A method to trigger validation on all fields (useful before submit)
  const validateAll = () => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let formIsValid = true;

    for (const key in schema) {
      const errorMsg = validateField(key, values[key], values);
      if (errorMsg) {
        newErrors[key] = errorMsg;
        formIsValid = false;
      }
    }

    setErrors(newErrors);
    
    // Mark all as touched
    const allTouched = Object.keys(initialState).reduce((acc, key) => {
      acc[key as keyof T] = true;
      return acc;
    }, {} as Partial<Record<keyof T, boolean>>);
    
    setTouched(allTouched);

    return formIsValid;
  };

  return {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    validateAll
  };
}
