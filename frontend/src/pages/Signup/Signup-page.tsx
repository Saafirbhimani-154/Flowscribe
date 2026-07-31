import { useState } from 'react';
import SignupForm from './Signup-Components/Signup-form';
import AuthLayout from '../Auth/AuthLayout';
import { SIGNUP_PAGE_DATA } from './Signup-constants';
import { registerService } from '../../services/auth/auth.service';

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignupSubmit = async (values: any) => {
    setIsLoading(true);
    setError(null);
    try {
      // confirmPassword is sent to backend; Joi schema accepts it.
      // Backend creates user, sets cookie, returns token.
      const payload = {
        firstName: values.name.split(' ')[0] || values.name,
        lastName: values.name.split(' ').slice(1).join(' ') || 'User',
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword
      };
      await registerService(payload);
      // Redirect to dashboard or login
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={SIGNUP_PAGE_DATA.title}
      subtitle={SIGNUP_PAGE_DATA.subtitle}
      footerText={SIGNUP_PAGE_DATA.footerText}
      footerLinkText={SIGNUP_PAGE_DATA.footerLinkText}
      footerLinkTo={SIGNUP_PAGE_DATA.footerLinkTo}
    >
      {error && (
        <div className="bg-red-500/10 text-red-500 text-sm p-3 rounded-lg border border-red-500/20 mb-4">
          {error}
        </div>
      )}
      <SignupForm onSubmit={handleSignupSubmit} isLoading={isLoading} />
    </AuthLayout>
  );
}
