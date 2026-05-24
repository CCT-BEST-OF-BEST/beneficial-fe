import { clearAccessToken, getAccessToken, setAccessToken } from '@/shared/api/token.ts';

interface ApiFetchConfig {
  skipAuth?: boolean;
  skipRefresh?: boolean;
}

interface AuthTokenResponse {
  access_token: string;
}

export const AUTH_UNAUTHORIZED_EVENT = 'beneficial:unauthorized';

export class ApiError extends Error {
  status: number;
  detail: unknown;

  constructor(status: number, detail: unknown) {
    super(typeof detail === 'string' ? detail : 'API 요청에 실패했습니다.');
    this.status = status;
    this.detail = detail;
  }
}

const getBaseUrl = () => (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

export const getApiUrl = (path: string) => {
  if (path.startsWith('http')) return path;
  return `${getBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
};

const notifyUnauthorized = () => {
  clearAccessToken();
  window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
};

let refreshPromise: Promise<string | null> | null = null;

const requestAccessTokenRefresh = async () => {
  const res = await fetch(getApiUrl('/auth/refresh'), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  if (!res.ok) {
    notifyUnauthorized();
    return null;
  }

  const data = (await res.json()) as AuthTokenResponse;
  setAccessToken(data.access_token);
  return data.access_token;
};

const refreshAccessToken = async () => {
  refreshPromise ??= requestAccessTokenRefresh().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
};

export const apiFetch = async <T>(
  path: string,
  init: RequestInit = {},
  config: ApiFetchConfig = {}
): Promise<T> => {
  const headers = new Headers(init.headers);
  const token = getAccessToken();

  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (!config.skipAuth && token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(getApiUrl(path), {
    ...init,
    credentials: 'include',
    headers,
  });

  if (res.status === 401 && !config.skipRefresh) {
    const refreshedToken = await refreshAccessToken();

    if (refreshedToken) {
      headers.set('Authorization', `Bearer ${refreshedToken}`);

      return apiFetch<T>(
        path,
        {
          ...init,
          headers,
        },
        {
          ...config,
          skipRefresh: true,
        }
      );
    }
  }

  if (!res.ok) {
    let detail: unknown = res.statusText;

    try {
      const errorBody = await res.json();
      detail = errorBody.detail ?? errorBody;
    } catch {
      detail = res.statusText;
    }

    throw new ApiError(res.status, detail);
  }

  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
};

export const apiBlobFetch = async (
  path: string,
  init: RequestInit = {},
  config: ApiFetchConfig = {}
): Promise<Blob> => {
  const headers = new Headers(init.headers);
  const token = getAccessToken();

  if (!config.skipAuth && token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(getApiUrl(path), {
    ...init,
    credentials: 'include',
    headers,
  });

  if (res.status === 401 && !config.skipRefresh) {
    const refreshedToken = await refreshAccessToken();

    if (refreshedToken) {
      headers.set('Authorization', `Bearer ${refreshedToken}`);

      return apiBlobFetch(
        path,
        {
          ...init,
          headers,
        },
        {
          ...config,
          skipRefresh: true,
        }
      );
    }
  }

  if (!res.ok) {
    let detail: unknown = res.statusText;

    try {
      const errorBody = await res.json();
      detail = errorBody.detail ?? errorBody;
    } catch {
      detail = res.statusText;
    }

    throw new ApiError(res.status, detail);
  }

  return res.blob();
};
