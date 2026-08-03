import { useState } from 'react';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import { API_URL } from '../../../config/api';
import { parseJsonSafe, errorMessage } from '../../../lib/http';

export default function PasswordForm({ slug }: { slug: string }) {
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const validatePassword = (pass: string) => {
    if (!pass || pass.length < 8) return 'Password must be at least 8 characters long';
    return '';
  };

  const handleTriggerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const passError = validatePassword(formData.newPassword);
    if (passError) {
      setErrorMsg(passError);
      return;
    }
    if (formData.newPassword !== formData.confirmNewPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleConfirmSave = async () => {
    setIsModalOpen(false);
    if (formData.newPassword !== formData.confirmNewPassword) {
      setStatus('error');
      setErrorMsg('New passwords do not match');
      return;
    }
    
    setStatus('loading');
    try {
      const res = await fetch(`${API_URL}/user-profile/${slug}/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errData = await parseJsonSafe(res);
        throw new Error(errorMessage(errData, 'Failed to update'));
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
    <form onSubmit={handleTriggerSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-brand-text mb-2 uppercase tracking-wide">Current Password</label>
        <div className="relative">
          <input
            type={showCurrent ? "text" : "password"}
            required
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            className="w-full bg-white border border-brand-secondary/50 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-brand-text"
          />
          <button 
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="pt-4 border-t border-brand-secondary/30 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-brand-text mb-2 uppercase tracking-wide">New Password</label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              required
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              className={`w-full bg-white border rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 transition-all text-brand-text ${
                validatePassword(formData.newPassword) ? 'border-red-400 focus:ring-red-400/20' : 'border-brand-secondary/50 focus:ring-brand-primary/20 focus:border-brand-primary'
              }`}
            />
            <button 
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {validatePassword(formData.newPassword) && <p className="text-red-500 text-xs mt-2">{validatePassword(formData.newPassword)}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-brand-text mb-2 uppercase tracking-wide">Confirm New Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              required
              value={formData.confirmNewPassword}
              onChange={(e) => setFormData({ ...formData, confirmNewPassword: e.target.value })}
              className={`w-full bg-white border rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 transition-all text-brand-text ${
                formData.confirmNewPassword && formData.newPassword !== formData.confirmNewPassword ? 'border-red-400 focus:ring-red-400/20' : 'border-brand-secondary/50 focus:ring-brand-primary/20 focus:border-brand-primary'
              }`}
            />
            <button 
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {formData.confirmNewPassword && formData.newPassword !== formData.confirmNewPassword && (
            <p className="text-red-500 text-xs mt-2">Passwords do not match</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-brand-text hover:bg-black text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-lg flex items-center gap-2"
      >
        {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
      </button>

      {status === 'success' && <p className="text-emerald-600 text-sm font-medium">Password updated successfully.</p>}
      {status === 'error' && <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">{errorMsg}</p>}

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSave}
        title="Change Password"
        message="This will change your current account password. You will use this new password on your next login. Are you sure you want to proceed?"
        confirmText="Change Password"
        isLoading={status === 'loading'}
      />
    </form>
  );
}
