import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import NeumorphicInput from '../../utils/ui/NeumorphicInput';

export default function SetSlugPage() {
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const currentSlug = localStorage.getItem('flowscribe_slug');

  useEffect(() => {
    if (!currentSlug) {
      navigate('/login');
      return;
    }
    // Pre-fill with the auto-generated slug
    setSlug(currentSlug);
  }, [currentSlug, navigate]);

  useEffect(() => {
    if (!slug || slug === currentSlug) {
      setStatus('idle');
      return;
    }

    const checkAvailability = async () => {
      setStatus('checking');
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API_URL}/auth/check-slug/${slug}`);
        const data = await res.json();
        
        if (res.ok && data.available) {
          setStatus('available');
        } else {
          setStatus('taken');
        }
      } catch (err) {
        setStatus('error');
      }
    };

    const timer = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timer);
  }, [slug, currentSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'taken' || status === 'checking') return;
    
    setIsSubmitting(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/user-profile/${currentSlug}/slug`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ slugId: slug }),
      });

      if (!res.ok) throw new Error('Failed to update slug');
      
      localStorage.setItem('flowscribe_slug', slug);
      navigate(`/${slug}/dashboard`);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 p-8 rounded-2xl shadow-2xl"
      >
        <h1 className="text-2xl text-white font-medium mb-2">Claim your Workspace URL</h1>
        <p className="text-zinc-400 text-sm mb-8">
          This is where your team will access Flowscribe. You can change the auto-generated URL below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 block">
              Workspace URL
            </label>
            <div className="flex items-center">
              <span className="text-zinc-500 bg-zinc-900 border border-zinc-800/50 border-r-0 py-3 px-4 rounded-l-xl text-sm">
                flowscribe.com/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="flex-1 bg-zinc-900 border border-zinc-800/50 py-3 px-4 rounded-r-xl text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                placeholder="my-workspace"
              />
            </div>
            
            <div className="absolute -bottom-6 left-0 flex items-center text-xs">
              {status === 'checking' && <span className="text-blue-400 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Checking availability...</span>}
              {status === 'available' && <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Available!</span>}
              {status === 'taken' && <span className="text-red-400 flex items-center gap-1"><XCircle className="w-3 h-3" /> That URL is taken or reserved.</span>}
              {status === 'error' && <span className="text-red-400 flex items-center gap-1"><XCircle className="w-3 h-3" /> Error checking availability.</span>}
              {status === 'idle' && slug === currentSlug && <span className="text-zinc-500">Auto-generated URL</span>}
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: (status === 'taken' || status === 'checking') ? 1 : 1.02 }}
            whileTap={{ scale: (status === 'taken' || status === 'checking') ? 1 : 0.98 }}
            disabled={status === 'taken' || status === 'checking' || isSubmitting}
            className={`w-full py-3 font-medium rounded-xl flex items-center justify-center gap-2 transition-all mt-4
              ${(status === 'taken' || status === 'checking' || isSubmitting)
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.2)]' 
              }`}
          >
            {isSubmitting ? 'Setting up...' : 'Confirm Workspace'} <ArrowRight className="w-4 h-4" />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
