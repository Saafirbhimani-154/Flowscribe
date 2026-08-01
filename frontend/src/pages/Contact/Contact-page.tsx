import ContactForm from './Contact-Components/Contact-form';
import ContactInfo from './Contact-Components/Contact-info';
import Footer from '../../components/Footer/Footer';

export default function ContactPage() {
  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Contact message submitted");
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white font-sans selection:bg-blue-500/30">
      <div className="flex-grow max-w-7xl mx-auto w-full px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Info */}
        <ContactInfo />

        {/* Right Side: Form */}
        <div className="bg-zinc-900/40 border border-zinc-800/50 p-8 md:p-12 rounded-3xl backdrop-blur-md shadow-2xl">
          <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
          <ContactForm onSubmit={handleContactSubmit} />
        </div>

      </div>
      <Footer />
    </div>
  );
}
