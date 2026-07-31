import AuthLayout from '../Auth/AuthLayout';
import ContactForm from './Contact-Components/Contact-form';
import Footer from '../../components/Footer/Footer';

export default function ContactPage() {
  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Contact message submitted");
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950">
      <div className="flex-grow">
        <AuthLayout
          title="Get in Touch"
          subtitle="We'd love to hear from you."
        >
          <ContactForm onSubmit={handleContactSubmit} />
        </AuthLayout>
      </div>
      <Footer />
    </div>
  );
}
