import { END_POINT } from '@/shared/constant/apis.ts';
import { apiFetch } from '@/shared/api/client.ts';

export const getStep3Progress = async () => {
  return apiFetch(END_POINT.GET_STEP3_PROGRESS);
};
