import SignupForm from './Signup-Components/Signup-form';
import AuthLayout from '../Auth/AuthLayout';
import { SIGNUP_PAGE_DATA } from './Signup-constants';

export default function SignupPage() {
  const handleSignupSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Signup submitted");
  };

  return (
    <AuthLayout
      title={SIGNUP_PAGE_DATA.title}
      subtitle={SIGNUP_PAGE_DATA.subtitle}
      footerText={SIGNUP_PAGE_DATA.footerText}
      footerLinkText={SIGNUP_PAGE_DATA.footerLinkText}
      footerLinkTo={SIGNUP_PAGE_DATA.footerLinkTo}
    >
      <SignupForm onSubmit={handleSignupSubmit} />
    </AuthLayout>
  );
}
