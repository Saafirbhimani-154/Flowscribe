import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import type { LoginFormProps } from './Login-interface';
import NeumorphicInput from '../../../utils/ui/NeumorphicInput';
import { useFormValidation, type ValidationSchema } from '../../../hooks/useFormValidation';
import { emailValidationRules } from '../../../utils/validation/emailValidation';
import { passwordValidationRules } from '../../../utils/validation/passwordValidation';

export default function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  
  // Define Validation Schema using imported rules
  const schema: ValidationSchema<{ email: string; password: string }> = useMemo(() => ({
    email: emailValidationRules,
    password: passwordValidationRules
  }), []);

  const { values, errors, touched, isValid, handleChange, handleBlur, validateAll } = useFormValidation(
    { email: '', password: '' },
    schema
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateAll()) {
      onSubmit(e);
      // Can pass values up to parent if needed: onSubmit(values)
    }
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div className="space-y-6 relative">
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

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-zinc-400 cursor-pointer">
          <input type="checkbox" className="rounded border-zinc-700 bg-zinc-900 text-blue-500 focus:ring-blue-500/20" />
          Remember me
        </label>
        <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Forgot Password?</a>
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
        Sign In <ArrowRight className="w-4 h-4" />
      </motion.button>
    </form>
  );
}
