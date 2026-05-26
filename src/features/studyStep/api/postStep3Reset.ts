import { END_POINT } from '@/shared/constant/apis.ts';
import { apiFetch } from '@/shared/api/client.ts';

export const postStep3Reset = async (lessonId: string) => {
  return apiFetch(END_POINT.POST_STEP3_RESET(lessonId), {
    method: 'POST',
    body: JSON.stringify({}),
  });
};
