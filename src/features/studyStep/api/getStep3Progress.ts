import { END_POINT } from '@/shared/constant/apis.ts';
import { apiFetch } from '@/shared/api/client.ts';

export interface Step3ProgressResponse {
  success: boolean;
  progress: {
    total_problems: number;
    correct_count: number;
    wrong_count: number;
    review_problems: number[];
    completed_problems: number[];
    current_problem_id: number | null;
    next_problem_index: number;
    review_problem_index: number;
  };
  is_completed: boolean;
}

export const getStep3Progress = async (lessonId: string) => {
  return apiFetch<Step3ProgressResponse>(END_POINT.GET_STEP3_PROGRESS(lessonId));
};
