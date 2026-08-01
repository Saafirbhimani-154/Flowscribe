import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function PasswordForm({ slug }: { slug: string }) {
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmNewPassword) {
      setStatus('error');
      setErrorMsg('New passwords do not match');
      return;
    }
    
    setStatus('loading');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user-profile/${slug}/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update');
      }
      setStatus('success');
      setFormData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-brand-text mb-2 uppercase tracking-wide">Current Password</label>
        <input
          type="password"
          required
          value={formData.currentPassword}
          onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
          className="w-full bg-white border border-brand-secondary/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-brand-text"
        />
      </div>

      <div className="pt-4 border-t border-brand-secondary/30 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-brand-text mb-2 uppercase tracking-wide">New Password</label>
          <input
            type="password"
            required
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            className="w-full bg-white border border-brand-secondary/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-brand-text"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-brand-text mb-2 uppercase tracking-wide">Confirm New Password</label>
          <input
            type="password"
            required
            value={formData.confirmNewPassword}
            onChange={(e) => setFormData({ ...formData, confirmNewPassword: e.target.value })}
            className="w-full bg-white border border-brand-secondary/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-brand-text"
          />
        </div>
      </div>

      <button
        disabled={status === 'loading'}
        className="bg-brand-text hover:bg-black text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-lg flex items-center gap-2"
      >
        {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
      </button>

      {status === 'success' && <p className="text-emerald-600 text-sm font-medium">Password updated successfully.</p>}
      {status === 'error' && <p className="text-red-500 text-sm font-medium">{errorMsg}</p>}
    </form>
  );
}
