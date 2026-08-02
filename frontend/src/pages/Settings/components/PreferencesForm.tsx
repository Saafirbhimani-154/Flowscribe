import { useState, useEffect } from 'react';
import { Loader2, ChevronDown } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

export default function PreferencesForm({ slug }: { slug: string }) {
  const [formData, setFormData] = useState({ language: 'en', theme: 'system' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/user-profile/${slug}/settings`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data && data.settings) {
            setFormData({ language: data.settings.language, theme: data.settings.theme });
          }
        } else {
          console.error('Failed to load preferences: server returned error');
        }
      } catch (err) {
        console.error('Failed to load preferences:', err);
      }
    };
    if (slug) fetchSettings();
  }, [slug]);

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    if (formData.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [formData.theme]);

  const handleTriggerSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleConfirmSave = async () => {
    setIsModalOpen(false);
    setStatus('loading');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user-profile/${slug}/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to update');
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleTriggerSave} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-brand-text mb-2 uppercase tracking-wide">Language</label>
        <div className="relative">
          <select
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            className="w-full bg-white border border-brand-secondary/50 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-brand-text appearance-none"
          >
            <option value="en">English (US)</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
          <ChevronDown className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-brand-text mb-2 uppercase tracking-wide">Theme</label>
        
        {/* Sleek Toggle Switch using uiverse CSS */}
        <div className="flex items-center gap-4 mt-1">
          <span className={`text-sm font-medium transition-colors ${formData.theme === 'light' ? 'text-brand-text' : 'text-gray-400'}`}>
            Light
          </span>
          
          <input 
            type="checkbox" 
            className="theme-checkbox" 
            checked={formData.theme === 'dark'}
            onChange={(e) => setFormData({ ...formData, theme: e.target.checked ? 'dark' : 'light' })}
          />

          <span className={`text-sm font-medium transition-colors ${formData.theme === 'dark' ? 'text-brand-text' : 'text-gray-400'}`}>
            Dark
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-brand-primary hover:bg-[#7a2e0a] text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-brand-primary/20 flex items-center gap-2 mt-4"
      >
        {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Preferences'}
      </button>

      {status === 'success' && <p className="text-emerald-600 text-sm font-medium">Preferences updated successfully.</p>}
      {status === 'error' && <p className="text-red-500 text-sm font-medium">Failed to update preferences.</p>}

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSave}
        title="Change Preferences"
        message={`Are you sure you want to change your language to ${formData.language.toUpperCase()} and theme to ${formData.theme}?`}
        confirmText="Save Changes"
        isLoading={status === 'loading'}
      />
    </form>
  );
}
