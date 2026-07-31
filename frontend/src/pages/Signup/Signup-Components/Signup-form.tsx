import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import type { SignupFormProps } from '../Signup-interface';
import NeumorphicInput from '../../../utils/ui/NeumorphicInput';
import { useFormValidation, type ValidationSchema } from '../../../hooks/useFormValidation';
import { emailValidationRules } from '../../../utils/validation/emailValidation';
import { passwordValidationRules } from '../../../utils/validation/passwordValidation';
import { VALIDATION_MESSAGES } from '../../../utils/validation/validationConstants';

export default function SignupForm({ onSubmit, isLoading }: SignupFormProps) {
  
  const schema: ValidationSchema<{ name: string; email: string; password: string }> = useMemo(() => ({
    name: [
      { validate: (val) => val.length >= 2, message: VALIDATION_MESSAGES.NAME_MIN_LENGTH }
    ],
    email: emailValidationRules,
    password: passwordValidationRules
  }), []);

  const { values, errors, touched, isValid, handleChange, handleBlur, validateAll } = useFormValidation(
    { name: '', email: '', password: '' },
    schema
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateAll()) {
      onSubmit(e);
    }
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div className="space-y-6 relative">
        <NeumorphicInput 
          icon={User}
          type="text" 
          name="name"
          placeholder="Full Name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.name ? errors.name : undefined}
          disabled={isLoading}
        />

        <NeumorphicInput 
          icon={Mail}
          type="email" 
          name="email"
          placeholder="Email address"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email ? errors.email : undefined}
          disabled={isLoading}
        />
        
        <NeumorphicInput 
          icon={Lock}
          type="password" 
          name="password"
          placeholder="Password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.password ? errors.password : undefined}
          disabled={isLoading}
        />
      </div>

      <motion.button 
        whileHover={{ scale: isValid ? 1.02 : 1 }}
        whileTap={{ scale: isValid ? 0.98 : 1 }}
        disabled={isLoading || !isValid}
        className={`w-full py-3 font-medium rounded-xl flex items-center justify-center gap-2 transition-all 
          ${isValid 
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.2)]' 
            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50'
          }`}
      >
        Create Account <ArrowRight className="w-4 h-4" />
      </motion.button>
    </form>
  );
}
