import { END_POINT } from '@/shared/constant/apis.ts';
import { apiFetch } from '@/shared/api/client.ts';

export const getStep3Problems = async (lessonId: string) => {
  return apiFetch(END_POINT.GET_STEP3_PROBLEMS(lessonId));
};
