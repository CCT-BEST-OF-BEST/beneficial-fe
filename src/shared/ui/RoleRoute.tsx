import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/model/AuthContext.tsx';

interface RoleRouteProps {
  allowedRoles: ('student' | 'teacher' | 'developer')[];
}

export default function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Role mismatch, redirect to their respective home
    const homePath = user.role === 'student' ? '/student' : user.role === 'teacher' ? '/teacher' : '/admin';
    return <Navigate to={homePath} replace />;
  }

  return <Outlet />;
}
