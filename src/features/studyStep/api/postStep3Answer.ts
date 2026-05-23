import { END_POINT } from '@/shared/constant/apis.ts';
import { apiFetch } from '@/shared/api/client.ts';
import type { BadgeType } from '@/shared/ui/Badge.tsx';

interface PostStep3AnswerProps {
  problem_id: number;
  answer: string;
}

export interface Step3AnswerResponse {
  success: boolean;
  problem_id: number;
  is_correct: boolean;
  user_answer: string;
  correct_answer: string;
  explanation: string;
  full_sentence: string;
  status: 'correct' | 'wrong' | 'review' | 'completed';
  badge: BadgeType | null;
}

export const postStep3Answer = async ({ problem_id, answer }: PostStep3AnswerProps) => {
  return apiFetch<Step3AnswerResponse>(END_POINT.POST_STEP3_ANSWER, {
    method: 'POST',
    body: JSON.stringify({
      problem_id,
      user_answer: answer,
    }),
  });
};
