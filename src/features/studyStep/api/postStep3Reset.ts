import { END_POINT } from '@/shared/constant/apis.ts';
import { apiFetch } from '@/shared/api/client.ts';

export const postStep3Reset = async () => {
  return apiFetch(END_POINT.POST_STEP3_RESET, {
    method: 'POST',
    body: JSON.stringify({}),
  });
};
