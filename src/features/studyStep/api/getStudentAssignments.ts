import { apiFetch } from '@/shared/api/client.ts';
import { END_POINT } from '@/shared/constant/apis.ts';

export interface StudentAssignment {
  assignment_id: string;
  lesson_id: string;
  unit_id: string;
  stage: number;
  concept_key: string;
  status: string;
  completed_problem_ids: string[];
  assigned_at: string;
  problems: any[];
}

export interface StudentAssignmentsResponse {
  assignments: StudentAssignment[];
  total_count: number;
}

export const getStudentAssignments = async (lessonId?: string) => {
  const query = lessonId ? `?lesson_id=${lessonId}` : '';
  return apiFetch<StudentAssignmentsResponse>(`${END_POINT.GET_STUDENT_ASSIGNMENTS}${query}`);
};
