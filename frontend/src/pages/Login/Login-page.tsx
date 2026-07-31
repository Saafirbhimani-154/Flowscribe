import LoginForm from './Login-Components/Login-form';
import AuthLayout from '../Auth/AuthLayout';
import { LOGIN_PAGE_DATA } from './Login-constants';

export default function LoginPage() {
  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Login submitted");
  };

  return (
    <AuthLayout
      title={LOGIN_PAGE_DATA.title}
      subtitle={LOGIN_PAGE_DATA.subtitle}
      footerText={LOGIN_PAGE_DATA.footerText}
      footerLinkText={LOGIN_PAGE_DATA.footerLinkText}
      footerLinkTo={LOGIN_PAGE_DATA.footerLinkTo}
    >
      <LoginForm onSubmit={handleLoginSubmit} />
    </AuthLayout>
  );
}
