import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function PreferencesForm({ slug }: { slug: string }) {
  const [formData, setFormData] = useState({ language: 'en', theme: 'system' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/user-profile/${slug}/settings`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setFormData({ language: data.settings.language, theme: data.settings.theme });
        }
      } catch (err) {}
    };
    if (slug) fetchSettings();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-brand-text mb-2 uppercase tracking-wide">Language</label>
        <select
          value={formData.language}
          onChange={(e) => setFormData({ ...formData, language: e.target.value })}
          className="w-full bg-white border border-brand-secondary/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-brand-text appearance-none"
        >
          <option value="en">English (US)</option>
          <option value="hi">Hindi</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-brand-text mb-2 uppercase tracking-wide">Theme</label>
        <div className="grid grid-cols-3 gap-4">
          {['light', 'dark', 'system'].map((themeOption) => (
            <button
              type="button"
              key={themeOption}
              onClick={() => setFormData({ ...formData, theme: themeOption })}
              className={`py-3 px-4 rounded-xl border font-medium capitalize transition-all ${
                formData.theme === themeOption
                  ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                  : 'border-brand-secondary/50 bg-white text-brand-muted hover:border-brand-secondary'
              }`}
            >
              {themeOption}
            </button>
          ))}
        </div>
      </div>

      <button
        disabled={status === 'loading'}
        className="bg-brand-primary hover:bg-[#7a2e0a] text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-brand-primary/20 flex items-center gap-2 mt-4"
      >
        {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Preferences'}
      </button>

      {status === 'success' && <p className="text-emerald-600 text-sm font-medium">Preferences updated successfully.</p>}
      {status === 'error' && <p className="text-red-500 text-sm font-medium">Failed to update preferences.</p>}
    </form>
  );
}
