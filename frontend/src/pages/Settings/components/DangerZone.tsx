import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from './ConfirmModal';

export default function DangerZone() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const slug = localStorage.getItem('flowscribe_slug');
  
  const handleDelete = async () => {
    setIsModalOpen(false);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user-profile/${slug}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        localStorage.removeItem('flowscribe_role');
        localStorage.removeItem('flowscribe_slug');
        localStorage.removeItem('flowscribe_user');
        navigate('/login', { replace: true });
      } else {
        console.error('Failed to delete account');
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="mt-16 pt-8 border-t border-brand-secondary/30">
      <h3 className="text-xl font-domine font-bold text-red-600 mb-2 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5" /> Danger Zone
      </h3>
      <div className="border border-red-200 bg-red-50/50 rounded-2xl p-6 mt-4">
        <h4 className="font-semibold text-red-900">Delete Workspace Account</h4>
        <p className="text-red-700/80 text-sm mt-1 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-100 hover:bg-red-700 text-red-700 hover:text-white border border-red-200 px-6 py-2.5 rounded-xl font-medium transition-colors"
        >
          Delete Account
        </button>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Workspace Account"
        message="Are you absolutely sure you want to delete your account? All workspaces, projects, and data will be permanently wiped. This cannot be undone."
        confirmText="Delete Permanently"
        isDanger={true}
      />
    </div>
  );
}
