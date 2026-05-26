import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { AUTH_UNAUTHORIZED_EVENT, apiFetch } from '@/shared/api/client.ts';
import { clearAccessToken, getAccessToken, setAccessToken } from '@/shared/api/token.ts';

export interface User {
  user_id: string;
  email: string;
  display_name: string;
  role: 'student' | 'teacher' | 'developer';
}

interface AuthTokenResponse {
  access_token: string;
  token_type: 'bearer';
  expires_in: number;
  refresh_token: string;
  user: User;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const me = await apiFetch<User>('/auth/me');
    setUser(me);
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        if (!getAccessToken()) {
          await apiFetch<AuthTokenResponse>(
            '/auth/refresh',
            {
              method: 'POST',
              body: JSON.stringify({}),
            },
            { skipAuth: true, skipRefresh: true }
          ).then(data => setAccessToken(data.access_token));
        }

        if (getAccessToken()) {
          await refreshUser();
        }
      } catch {
        clearAccessToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiFetch<AuthTokenResponse>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      },
      { skipAuth: true, skipRefresh: true }
    );

    setAccessToken(data.access_token);
    setUser(data.user);
  };

  const signup = async (email: string, password: string, displayName: string) => {
    await apiFetch<User>(
      '/auth/signup',
      {
        method: 'POST',
        body: JSON.stringify({ email, password, display_name: displayName }),
      },
      { skipAuth: true, skipRefresh: true }
    );

    await login(email, password);
  };

  const logout = async () => {
    try {
      await apiFetch<{ message: string }>(
        '/auth/logout',
        {
          method: 'POST',
          body: JSON.stringify({}),
        },
        { skipRefresh: true }
      );
    } finally {
      clearAccessToken();
      setUser(null);
    }
  };

  const value = { user, loading, login, signup, logout, refreshUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
