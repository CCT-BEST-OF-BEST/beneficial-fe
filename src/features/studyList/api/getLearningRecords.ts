import { apiFetch } from '@/shared/api/client.ts';

export interface LearningRecord {
  user_id: string;
  temp_user_id: string | null;
  stage: number;
  question_id: string;
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
  return apiFetch<LearningRecordsResponse>('/learning/records/me');
};
