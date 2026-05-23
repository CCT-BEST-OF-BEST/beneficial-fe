import { END_POINT } from '@/shared/constant/apis.ts';
import { apiFetch } from '@/shared/api/client.ts';

interface Step2Problem {
  problem_id: number;
  sentence_part1: string;
  sentence_part2: string;
}

interface Step2ProblemsResponse {
  problems: Step2Problem[];
  answer_options: string[];
}

export const getStep2Problems = async () => {
  return apiFetch<Step2ProblemsResponse>(END_POINT.GET_STEP2_PROBLEMS);
};
