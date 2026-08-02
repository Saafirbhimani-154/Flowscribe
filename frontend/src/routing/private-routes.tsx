// ============================================================================
// File: private-routes.tsx
// Purpose: Auth guard — redirects unauthenticated users to /login
// ============================================================================
import { Navigate, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const location = useLocation();
  const role = localStorage.getItem('flowscribe_role');
  const slug = localStorage.getItem('flowscribe_slug');

  // If no role or slug stored, user is not authenticated
  if (!role || !slug) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
