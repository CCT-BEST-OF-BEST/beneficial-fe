import { apiFetch } from '@/shared/api/client.ts';
import { END_POINT } from '@/shared/constant/apis.ts';

export interface StudentProgressResponse {
  today_solved_count: number;
  total_solved_count: number;
  streak_correct_count: number;
  progress_rate: number;
  badges: string[];
}

export const getStudentProgress = async () => {
  return apiFetch<StudentProgressResponse>(END_POINT.GET_STUDENT_PROGRESS);
};
