import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProfileForm({ slug }: { slug: string }) {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/user-profile/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.email,
          });
        }
      } catch (err) {
        console.error('Failed to load profile');
      }
    };
    if(slug) fetchProfile();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user-profile/${slug}`, {
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
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-brand-text mb-2 uppercase tracking-wide">First Name</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="w-full bg-white border border-brand-secondary/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-brand-text"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-brand-text mb-2 uppercase tracking-wide">Last Name</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="w-full bg-white border border-brand-secondary/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-brand-text"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-brand-text mb-2 uppercase tracking-wide">Email Address</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full bg-white border border-brand-secondary/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-brand-text"
        />
      </div>

      <button
        disabled={status === 'loading'}
        className="bg-brand-primary hover:bg-[#7a2e0a] text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-brand-primary/20 flex items-center gap-2"
      >
        {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
      </button>

      {status === 'success' && <p className="text-emerald-600 text-sm font-medium">Profile updated successfully.</p>}
      {status === 'error' && <p className="text-red-500 text-sm font-medium">Failed to update profile.</p>}
    </form>
  );
}
