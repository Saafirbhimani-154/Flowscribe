import LoginForm from './Login-Components/Login-form';
import AuthLayout from '../Auth/AuthLayout';

export default function LoginPage() {
  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Login submitted");
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Log in to continue architecting"
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkTo="/signup"
    >
      <LoginForm onSubmit={handleLoginSubmit} />
    </AuthLayout>
  );
}
