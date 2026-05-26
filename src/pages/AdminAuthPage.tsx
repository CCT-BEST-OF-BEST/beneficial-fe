import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch, ApiError } from '@/shared/api/client.ts';
import { setAccessToken } from '@/shared/api/token.ts';
import { useAuth } from '@/features/auth/model/AuthContext.tsx';
import Logo from '@/assets/Logo.png';

interface AdminLoginResponse {
  access_token: string;
  user: { user_id: string; email: string; display_name: string; role: string };
}

export default function AdminAuthPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length >= 1;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setErrorMessage('');
    try {
      const data = await apiFetch<AdminLoginResponse>(
        '/admin/auth/login',
        { method: 'POST', body: JSON.stringify({ email, password }) },
        { skipAuth: true, skipRefresh: true }
      );
      setAccessToken(data.access_token);
      await refreshUser();
      navigate('/admin', { replace: true });
    } catch (error) {
      if (error instanceof ApiError && typeof error.detail === 'string') {
        setErrorMessage(error.detail);
      } else {
        setErrorMessage('로그인에 실패했습니다.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-[520px] flex-1 items-center">
      <div className="w-full rounded-2xl bg-white px-12 py-10 shadow-sm">
        <div className="mb-8 flex flex-col items-center">
          <img src={Logo} alt="이로운 한글" className="mb-4 h-[48px] w-[72px]" />
          <p className="typography-R4 text-gray-400 mb-1">이로운 한글</p>
          <h1 className="typography-SB3 text-gray-800">관리자 로그인</h1>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="typography-SB3 text-gray-5 mb-2 block">이메일</span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="border-gray-2 focus:border-orange-primary typography-R4 h-13 w-full rounded-xl border px-5 outline-none"
              placeholder="admin@example.com"
              autoComplete="username"
            />
          </label>

          <label className="block">
            <span className="typography-SB3 text-gray-5 mb-2 block">비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="border-gray-2 focus:border-orange-primary typography-R4 h-13 w-full rounded-xl border px-5 outline-none"
              placeholder="비밀번호 입력"
              autoComplete="current-password"
            />
          </label>

          {errorMessage && (
            <p className="typography-M3 rounded-lg bg-[#FFF2F2] px-4 py-3 text-red-primary">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="typography-SB5 mt-7 w-full rounded-full bg-gray-800 py-4 text-white disabled:opacity-50 hover:bg-gray-700 transition-colors"
          >
            {submitting ? '로그인 중...' : '관리자 로그인'}
          </button>
        </form>
      </div>
    </section>
  );
}
