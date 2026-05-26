import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/model/AuthContext.tsx';
import { cn } from '@/shared/lib/utils.ts';

interface AuthStatusButtonProps {
  showName?: boolean;
  className?: string;
}

export default function AuthStatusButton({ showName = false, className }: AuthStatusButtonProps) {
  const { user, logout } = useAuth();

  const baseClass = cn(
    'typography-SB3 text-orange-primary border-orange-primary rounded-full border-2 bg-white px-6 py-3',
    className
  );

  if (!user) {
    return (
      <Link to="/auth/login" className={baseClass}>
        로그인
      </Link>
    );
  }

  return (
    <button onClick={() => void logout()} className={baseClass}>
      {showName ? `${user.display_name} · 로그아웃` : '로그아웃'}
    </button>
  );
}
