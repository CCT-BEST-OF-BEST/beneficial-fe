import { END_POINT } from '@/shared/constant/apis.ts';
import { apiFetch } from '@/shared/api/client.ts';

export interface Step2Problem {
  problem_id: number;
  sentence_part1: string;
  sentence_part2: string;
}

export interface Step2ProblemsResponse {
  success?: boolean;
  lesson_id?: string;
  title?: string;
  instruction?: string;
  total_problems?: number;
  problems: Step2Problem[];
  answer_options: string[];
}

export const getStep2Problems = async (lessonId: string) => {
  return apiFetch<Step2ProblemsResponse>(END_POINT.GET_STEP2_PROBLEMS(lessonId));
};
