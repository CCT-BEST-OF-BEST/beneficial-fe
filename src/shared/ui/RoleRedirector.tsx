import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/model/AuthContext.tsx';

export default function RoleRedirector() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (user.role === 'teacher') {
    return <Navigate to="/teacher" replace />;
  }
  
  if (user.role === 'developer') {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/student" replace />;
}
