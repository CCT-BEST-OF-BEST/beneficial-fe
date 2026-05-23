import { END_POINT } from '@/shared/constant/apis.ts';
import { apiFetch } from '@/shared/api/client.ts';

interface postStep3AnswerProps {
  problem_id: number;
  answer: string;
}

export const postStep3Answer = async ({ problem_id, answer }: postStep3AnswerProps) => {
  return apiFetch(END_POINT.POST_STEP3_ANSWER, {
    method: 'POST',
    body: JSON.stringify({
      problem_id,
      user_answer: answer,
    }),
  });
};
