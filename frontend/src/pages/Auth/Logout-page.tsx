import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutService } from '../../services/auth/auth.service';

export default function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logoutService();
      } catch (err) {
        console.error('Logout failed:', err);
      } finally {
        localStorage.removeItem('flowscribe_role');
        localStorage.removeItem('flowscribe_slug');
        localStorage.removeItem('flowscribe_user');
        navigate('/login', { replace: true });
      }
    };

    handleLogout();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <p className="text-zinc-500 animate-pulse">Logging out...</p>
    </div>
  );
}
