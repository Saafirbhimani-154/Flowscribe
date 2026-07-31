import { useState } from 'react';
import LoginForm from './Login-Components/Login-form';
import AuthLayout from '../Auth/AuthLayout';
import { LOGIN_PAGE_DATA } from './Login-constants';
import { loginService } from '../../services/auth/auth.service';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = async (values: any) => {
    setIsLoading(true);
    setError(null);
    try {
      await loginService(values);
      // Redirect to dashboard or home
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={LOGIN_PAGE_DATA.title}
      subtitle={LOGIN_PAGE_DATA.subtitle}
      footerText={LOGIN_PAGE_DATA.footerText}
      footerLinkText={LOGIN_PAGE_DATA.footerLinkText}
      footerLinkTo={LOGIN_PAGE_DATA.footerLinkTo}
    >
      {error && (
        <div className="bg-red-500/10 text-red-500 text-sm p-3 rounded-lg border border-red-500/20 mb-4">
          {error}
        </div>
      )}
      <LoginForm onSubmit={handleLoginSubmit} isLoading={isLoading} />
    </AuthLayout>
  );
}
