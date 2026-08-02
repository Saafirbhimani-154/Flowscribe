import { useState } from 'react';
import ContactForm from './Contact-Components/Contact-form';
import ContactInfo from './Contact-Components/Contact-info';
import Footer from '../../components/Footer/Footer';
import { ContactService } from '../../services/contact/contact.service';
import ContactPopup from './Contact-Components/Contact-popup';

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  const handleContactSubmit = async (data: { name: string; email: string; message: string }) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await ContactService.sendMessage(data);
      setIsSuccess(true);
      setFormKey(prev => prev + 1);
    } catch (error: any) {
      const msg = error.errors ? error.errors.join(', ') : (error.message || 'Failed to send message.');
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white font-sans selection:bg-blue-500/30">
      <div className="flex-grow max-w-7xl mx-auto w-full px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Info */}
        <ContactInfo />

        {/* Right Side: Form */}
        <div className="bg-zinc-900/40 border border-zinc-800/50 p-8 md:p-12 rounded-3xl backdrop-blur-md shadow-2xl relative">
          <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
              {errorMsg}
            </div>
          )}
          <ContactForm key={formKey} onSubmit={(e, data) => { e.preventDefault(); handleContactSubmit(data as any); }} isLoading={isLoading} />
        </div>

      </div>
      <Footer />
      
      <ContactPopup 
        isOpen={isSuccess} 
        onClose={() => setIsSuccess(false)} 
      />
    </div>
  );
}
