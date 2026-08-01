import { Navigate, useParams } from 'react-router-dom';
import SuperAdminDashboard from './SuperAdmin-dashboard';
import OwnerDashboardPage from './OwnerDashboard-page';

export default function DashboardRouter() {
  const role = localStorage.getItem('flowscribe_role');
  const userSlug = localStorage.getItem('flowscribe_slug');
  const { slug } = useParams<{ slug: string }>();

  if (!role || !userSlug) {
    // If not logged in or role missing, kick them back to login
    return <Navigate to="/login" replace />;
  }
  
  if (slug !== userSlug) {
    // If they navigate to /someone-elses-slug/dashboard, redirect them to their own
    return <Navigate to={`/${userSlug}/dashboard`} replace />;
  }

  if (role === 'Super Admin') {
    return <SuperAdminDashboard />;
  }

  // Default fallback for Workspace Owners
  return <OwnerDashboardPage />;
}
