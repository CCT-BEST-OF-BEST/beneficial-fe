import { END_POINT } from '@/shared/constant/apis.ts';
import { apiFetch } from '@/shared/api/client.ts';
import type { BadgeType } from '@/shared/ui/Badge.tsx';

interface PostStep3AnswerProps {
  lessonId: string;
  problem_id: number | string;
  answer: string;
  assignment_id: string | null;
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
  source: 'base' | 'assignment';
  assignment_id: string | null;
}

export const postStep3Answer = async ({ lessonId, problem_id, answer, assignment_id }: PostStep3AnswerProps) => {
  return apiFetch<Step3AnswerResponse>(END_POINT.POST_STEP3_ANSWER(lessonId), {
    method: 'POST',
    body: JSON.stringify({
      problem_id,
      user_answer: answer,
      assignment_id,
    }),
  });
};
