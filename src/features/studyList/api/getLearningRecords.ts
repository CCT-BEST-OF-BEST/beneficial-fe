import { apiFetch } from '@/shared/api/client.ts';
import { END_POINT } from '@/shared/constant/apis.ts';

export interface LearningRecord {
  user_id: string;
  temp_user_id: string | null;
  stage: number;
  question_id: string;
  unit_id: string | null;
  lesson_id: string;
  problem_key: string;
  concept_key: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  created_at: string;
}

export interface LearningRecordsResponse {
  records: LearningRecord[];
  total_count: number;
}

export const getLearningRecords = async () => {
  return apiFetch<LearningRecordsResponse>(END_POINT.GET_LEARNING_RECORDS);
};

export interface StudentProgress {
  today_solved_count: number;
  total_solved_count: number;
  streak_correct_count: number;
  completed_question_count: number;
  progress_rate: number;
  badges: string[];
}

export const getStudentProgress = async () => {
  return apiFetch<StudentProgress>(END_POINT.GET_STUDENT_PROGRESS);
};
