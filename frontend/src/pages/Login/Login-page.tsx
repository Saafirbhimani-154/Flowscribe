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
    >
      <LoginForm onSubmit={handleLoginSubmit} />
    </AuthLayout>
  );
}
