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

  const validateField = useCallback((name: keyof T, value: string) => {
    const rules = schema[name];
    if (!rules) return '';

    for (const rule of rules) {
      if (rule.pattern && !rule.pattern.test(value)) {
        return rule.message;
      }
      if (rule.validate && !rule.validate(value, values)) {
        return rule.message;
      }
    }
    return '';
  }, [schema]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setValues(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));

    // Re-validate field on change if it has been touched
    const errorMsg = validateField(name as keyof T, value);
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const errorMsg = validateField(name as keyof T, value);
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  // Re-calculate overall form validity whenever values or schema change
  useEffect(() => {
    let formIsValid = true;
    for (const key in schema) {
      const errorMsg = validateField(key, values[key]);
      if (errorMsg) {
        formIsValid = false;
        break;
      }
    }
    setIsValid(formIsValid);
  }, [values, schema, validateField]);

  // A method to trigger validation on all fields (useful before submit)
  const validateAll = () => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let formIsValid = true;

    for (const key in schema) {
      const errorMsg = validateField(key, values[key]);
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
