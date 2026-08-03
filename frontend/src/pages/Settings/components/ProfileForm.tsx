import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import { API_URL } from '../../../config/api';

export default function ProfileForm({ slug }: { slug: string }) {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({ firstName: '', lastName: '' });

  const validateName = (name: string) => {
    if (name.length < 2) return 'Must be at least 2 characters';
    if (!/^[a-zA-Z\s\-']+$/.test(name)) return 'Only letters, spaces, hyphens, and apostrophes allowed';
    return '';
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/user-profile/${slug}`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data && data.user) {
            setFormData({
              firstName: data.user.firstName,
              lastName: data.user.lastName,
              email: data.user.email,
            });
          }
        } else {
          console.error('Failed to load profile: server returned error');
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };
    if(slug) fetchProfile();
  }, [slug]);

  const handleTriggerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const firstError = validateName(formData.firstName);
    const lastError = validateName(formData.lastName);
    
    if (firstError || lastError) {
      setErrors({ firstName: firstError, lastName: lastError });
      return;
    }
    
    setErrors({ firstName: '', lastName: '' });
    setIsModalOpen(true);
  };

  const handleConfirmSave = async () => {
    setIsModalOpen(false);
    setStatus('loading');
    try {
      const res = await fetch(`${API_URL}/user-profile/${slug}`, {
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
    <form onSubmit={handleTriggerSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-brand-text mb-2 uppercase tracking-wide">First Name</label>
          <input
            type="text"
            required
            value={formData.firstName}
            onChange={(e) => {
              setFormData({ ...formData, firstName: e.target.value });
              setErrors({ ...errors, firstName: validateName(e.target.value) });
            }}
            className={`w-full bg-white border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all text-brand-text ${
              errors.firstName ? 'border-red-400 focus:ring-red-400/20' : 'border-brand-secondary/50 focus:ring-brand-primary/20 focus:border-brand-primary'
            }`}
          />
          {errors.firstName && <p className="text-red-500 text-xs mt-2">{errors.firstName}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-brand-text mb-2 uppercase tracking-wide">Last Name</label>
          <input
            type="text"
            required
            value={formData.lastName}
            onChange={(e) => {
              setFormData({ ...formData, lastName: e.target.value });
              setErrors({ ...errors, lastName: validateName(e.target.value) });
            }}
            className={`w-full bg-white border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all text-brand-text ${
              errors.lastName ? 'border-red-400 focus:ring-red-400/20' : 'border-brand-secondary/50 focus:ring-brand-primary/20 focus:border-brand-primary'
            }`}
          />
          {errors.lastName && <p className="text-red-500 text-xs mt-2">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-brand-text mb-2 uppercase tracking-wide">Email Address</label>
        <input
          type="email"
          disabled
          value={formData.email}
          className="w-full bg-gray-50 border border-gray-200 text-gray-500 rounded-xl px-4 py-3 cursor-not-allowed"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-brand-primary hover:bg-[#7a2e0a] text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-brand-primary/20 flex items-center gap-2"
      >
        {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
      </button>

      {status === 'success' && <p className="text-emerald-600 text-sm font-medium">Profile updated successfully.</p>}
      {status === 'error' && <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">Failed to update profile.</p>}
      
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSave}
        title="Update Identity Profile"
        message="Are you sure you want to save these changes to your personal identity profile?"
        confirmText="Save Profile"
        isLoading={status === 'loading'}
      />
    </form>
  );
}
