import SignupForm from './Signup-Components/Signup-form';
import AuthLayout from '../Auth/AuthLayout';

export default function SignupPage() {
  const handleSignupSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Signup submitted");
  };

  return (
    <AuthLayout
      title="Create an Account"
      subtitle="Join Flowscribe to build intelligent systems"
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkTo="/login"
    >
      <SignupForm onSubmit={handleSignupSubmit} />
    </AuthLayout>
  );
}
