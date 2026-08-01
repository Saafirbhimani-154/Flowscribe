import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Mail, User, MessageSquare, Send } from 'lucide-react';
import NeumorphicInput from '../../../utils/ui/NeumorphicInput';
import NeumorphicTextarea from '../../../utils/ui/NeumorphicTextarea';
import { useFormValidation, type ValidationSchema } from '../../../hooks/useFormValidation';
import { emailValidationRules } from '../../../utils/validation/emailValidation';
import { nameValidationRules } from '../../../utils/validation/nameValidation';
import { messageValidationRules } from '../../../utils/validation/messageValidation';
import { CONTACT_ANIMATION_VARIANTS, CONTACT_LIMITS } from './Contact-constants';

interface ContactFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>, data: { name: string; email: string; message: string }) => void;
  isLoading?: boolean;
}

export default function ContactForm({ onSubmit, isLoading }: ContactFormProps) {
  const schema: ValidationSchema<{ name: string; email: string; message: string }> = useMemo(() => ({
    name: nameValidationRules,
    email: emailValidationRules,
    message: messageValidationRules
  }), []);

  const { values, errors, touched, isValid, handleChange, handleBlur, validateAll } = useFormValidation(
    { name: '', email: '', message: '' },
    schema
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateAll()) {
      onSubmit(e, values);
    }
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div className="space-y-6 relative">
        <NeumorphicInput 
          icon={User}
          type="text" 
          name="name"
          placeholder="Your Name"
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
          placeholder="Your Email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email ? errors.email : undefined}
          disabled={isLoading}
        />
        
        <NeumorphicTextarea 
          icon={MessageSquare}
          name="message"
          placeholder="How can we help?"
          value={values.message}
          onChange={handleChange as any}
          onBlur={handleBlur as any}
          error={touched.message ? errors.message : undefined}
          disabled={isLoading}
          maxLength={CONTACT_LIMITS.MESSAGE_MAX_LENGTH}
        />
      </div>

      <motion.button 
        variants={CONTACT_ANIMATION_VARIANTS.formSubmit}
        whileHover="whileHover"
        whileTap="whileTap"
        disabled={isLoading || !isValid}
        className={`w-full py-3 font-medium rounded-xl flex items-center justify-center gap-2 transition-all 
          ${isValid 
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.2)]' 
            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50'
          }`}
      >
        Send Message <Send className="w-4 h-4 ml-2" />
      </motion.button>
    </form>
  );
}
