import { END_POINT } from '@/shared/constant/apis.ts';
import { apiFetch } from '@/shared/api/client.ts';
import type { BadgeType } from '@/shared/ui/Badge.tsx';

export interface Step3Problem {
  problem_id: number;
  image: string;
  sentence_part1: string;
  sentence_part2: string;
  badge: BadgeType | null;
}

export interface Step3NextProblemResponse {
  success: boolean;
  message?: string;
  is_completed: boolean;
  problem?: Step3Problem;
}

export const getStep3NextProblem = async () => {
  return apiFetch<Step3NextProblemResponse>(END_POINT.GET_STEP3_NEXT_PROBLEM);
};
