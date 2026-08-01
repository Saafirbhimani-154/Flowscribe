import { Navigate } from 'react-router-dom';
import SuperAdminDashboard from './SuperAdmin-dashboard';
import OwnerDashboardPage from './OwnerDashboard-page';

export default function DashboardRouter() {
  const role = localStorage.getItem('flowscribe_role');

  if (!role) {
    // If not logged in or role missing, kick them back to login
    return <Navigate to="/login" replace />;
  }

  if (role === 'Super Admin') {
    return <SuperAdminDashboard />;
  }

  // Default fallback for Workspace Owners
  return <OwnerDashboardPage />;
}
