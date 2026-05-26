import { apiFetch } from '@/shared/api/client.ts';
import { END_POINT } from '@/shared/constant/apis.ts';

export interface SystemStatusResponse {
  chroma_db: {
    status: string;
    collections: Record<string, number>;
  };
  redis: {
    status: string;
  };
}

export const getAdminSystemStatus = async () => {
  return apiFetch<SystemStatusResponse>(END_POINT.GET_ADMIN_SYSTEM_STATUS);
};

export const postAdminInitializeAll = async () => {
  return apiFetch(END_POINT.POST_ADMIN_INITIALIZE_ALL, { method: 'POST' });
};

export const postAdminSeedData = async () => {
  return apiFetch(END_POINT.POST_ADMIN_SEED_DATA, { method: 'POST' });
};

export const postAdminRebuildVectorIndex = async () => {
  return apiFetch(END_POINT.POST_ADMIN_REBUILD_VECTOR, { method: 'POST' });
};

export const postAdminRebuildBm25 = async () => {
  return apiFetch(END_POINT.POST_ADMIN_REBUILD_BM25, { method: 'POST' });
};

export const postAdminBuildHypotheticalQuestions = async () => {
  return apiFetch(END_POINT.POST_ADMIN_HYPOTHETICAL_QUESTIONS, { method: 'POST' });
};
