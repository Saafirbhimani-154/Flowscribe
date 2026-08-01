import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignupForm from './Signup-Components/Signup-form';
import AuthLayout from '../Auth/AuthLayout';
import { SIGNUP_PAGE_DATA } from './Signup-constants';
import { registerService } from '../../services/auth/auth.service';

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // S-4: Safe redirect

  const handleSignupSubmit = async (values: any) => {
    setIsLoading(true);
    setError(null);
    try {
      // M-10: Robust name parsing — handle single-word names gracefully
      const nameParts = (values.name as string).trim().split(/\s+/);
      const firstName = nameParts[0] ?? '';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : firstName; // Use firstName if no lastName given

      const payload = {
        firstName,
        lastName,
        email: values.email as string,
        password: values.password as string,
        confirmPassword: values.confirmPassword as string
      };
      const data = await registerService(payload);
      localStorage.setItem('flowscribe_role', data.role.name);
      localStorage.setItem('flowscribe_slug', data.slug.name);
      
      if (!data.slug.isSet) {
        navigate('/setup-workspace');
      } else {
        navigate(`/${data.slug.name}/dashboard`);
      }
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
