import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import Button from '@/shared/ui/Button.tsx';
import Logo from '@/assets/Logo.png';
import { useAuth } from '@/features/auth/model/AuthContext.tsx';
import { ApiError } from '@/shared/api/client.ts';

export default function AuthPage() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const mode = params.mode === 'signup' ? 'signup' : 'login';
  const { user, loading, login, signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [schoolName, setSchoolName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isSignup = mode === 'signup';
  const redirectTo = useMemo(() => {
    const state = location.state as
      | { from?: { pathname?: string; search?: string; hash?: string } }
      | null;
    const from = state?.from;

    if (!from?.pathname || from.pathname.startsWith('/auth')) {
      return '/';
    }

    return `${from.pathname}${from.search ?? ''}${from.hash ?? ''}`;
  }, [location.state]);

  const canSubmit = useMemo(() => {
    if (!email.trim() || !password.trim()) return false;
    if (isSignup && !displayName.trim()) return false;
    if (isSignup && role === 'teacher' && !schoolName.trim()) return false;
    return password.length >= 8;
  }, [displayName, email, isSignup, password]);

  useEffect(() => {
    setErrorMessage('');
  }, [mode]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    try {
      setSubmitting(true);
      setErrorMessage('');

      if (isSignup) {
        await signup(email, password, displayName, role, role === 'teacher' ? schoolName : undefined);
      } else {
        await login(email, password);
      }

      navigate(redirectTo, { replace: true });
    } catch (error) {
      if (error instanceof ApiError && typeof error.detail === 'string') {
        setErrorMessage(error.detail);
      } else {
        setErrorMessage('잠시 후 다시 시도해주세요.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!loading && user) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <section className="mx-auto flex w-full max-w-[520px] flex-1 items-center">
      <div className="w-full rounded-2xl bg-white px-12 py-10 shadow-sm">
        <div className="mb-8 flex flex-col items-center">
          <img src={Logo} alt="이로운 한글" className="mb-5 h-[48px] w-[72px]" />
          <h1 className="font-one-mobile-pop text-orange-primary text-[42px]">
            {isSignup ? '회원가입' : '로그인'}
          </h1>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <div>
                <span className="typography-SB3 text-gray-5 mb-2 block">역할</span>
                <div className="grid grid-cols-2 gap-3">
                  {(['student', 'teacher'] as const).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={[
                        'flex flex-col items-center justify-center gap-1 rounded-xl border py-4 transition-colors',
                        role === r
                          ? 'border-orange-primary bg-orange-50'
                          : 'border-gray-2 hover:border-gray-3',
                      ].join(' ')}
                    >
                      <span className="text-2xl">{r === 'student' ? '🎒' : '📚'}</span>
                      <span className={['typography-SB3', role === r ? 'text-orange-primary' : 'text-gray-5'].join(' ')}>
                        {r === 'student' ? '학생' : '선생님'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="typography-SB3 text-gray-5 mb-2 block">이름</span>
                <input
                  value={displayName}
                  onChange={event => setDisplayName(event.target.value)}
                  className="border-gray-2 focus:border-orange-primary typography-R4 h-13 w-full rounded-xl border px-5 outline-none"
                  placeholder="이름을 입력해주세요"
                />
              </label>

              {role === 'teacher' && (
                <label className="block">
                  <span className="typography-SB3 text-gray-5 mb-2 block">학교·기관명</span>
                  <input
                    value={schoolName}
                    onChange={event => setSchoolName(event.target.value)}
                    className="border-gray-2 focus:border-orange-primary typography-R4 h-13 w-full rounded-xl border px-5 outline-none"
                    placeholder="예) 소담 다함께 돌봄센터"
                  />
                </label>
              )}
            </>
          )}

          <label className="block">
            <span className="typography-SB3 text-gray-5 mb-2 block">이메일</span>
            <input
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              className="border-gray-2 focus:border-orange-primary typography-R4 h-13 w-full rounded-xl border px-5 outline-none"
              placeholder="email@example.com"
            />
          </label>

          <label className="block">
            <span className="typography-SB3 text-gray-5 mb-2 block">비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              className="border-gray-2 focus:border-orange-primary typography-R4 h-13 w-full rounded-xl border px-5 outline-none"
              placeholder="8자 이상 입력해주세요"
            />
          </label>

          {errorMessage && (
            <p className="typography-M3 rounded-lg bg-[#FFF2F2] px-4 py-3 text-red-primary">
              {errorMessage}
            </p>
          )}

          <Button
            type="submit"
            step={4}
            disabled={!canSubmit || submitting}
            className="typography-SB5 mt-7 w-full"
          >
            {submitting ? '처리 중...' : isSignup ? '가입하기' : '로그인하기'}
          </Button>
        </form>

        <div className="typography-R2 text-gray-5 mt-7 flex justify-center gap-2">
          <span>{isSignup ? '이미 계정이 있나요?' : '처음 이용하시나요?'}</span>
          <Link to={isSignup ? '/auth/login' : '/auth/signup'} className="text-orange-primary">
            {isSignup ? '로그인' : '회원가입'}
          </Link>
        </div>
      </div>
    </section>
  );
}
