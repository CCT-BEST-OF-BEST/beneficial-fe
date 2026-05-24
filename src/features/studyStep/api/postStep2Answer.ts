import { apiFetch } from '@/shared/api/client.ts';
import { END_POINT } from '@/shared/constant/apis.ts';

interface PostStep2AnswerProps {
  problemId: number;
  answer: string;
}

export interface Step2AnswerResponse {
  problem_id: number;
  is_correct: boolean;
  user_answer: string;
  correct_answer: string;
  full_sentence: string;
  concept_key: string;
  is_admin: boolean;
}

export const postStep2Answer = async ({ problemId, answer }: PostStep2AnswerProps) => {
  return apiFetch<Step2AnswerResponse>(END_POINT.POST_STEP2_ANSWER, {
    method: 'POST',
    body: JSON.stringify({
      problem_id: problemId,
      user_answer: answer,
    }),
  });
};
