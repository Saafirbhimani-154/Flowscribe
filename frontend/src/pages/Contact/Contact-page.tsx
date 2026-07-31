import AuthLayout from '../Auth/AuthLayout';
import ContactForm from './Contact-Components/Contact-form';

export default function ContactPage() {
  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Contact message submitted");
  };

  return (
    <AuthLayout
      title="Get in Touch"
      subtitle="We'd love to hear from you."
    >
      <ContactForm onSubmit={handleContactSubmit} />
    </AuthLayout>
  );
}
