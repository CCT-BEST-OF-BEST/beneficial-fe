import { apiFetch } from '@/shared/api/client.ts';
import { END_POINT } from '@/shared/constant/apis.ts';

export interface GeneratedProblem {
  problem_id: string;
  problem_key: string | null;
  type: string;
  sentence_part1: string;
  correct_answer: string;
  sentence_part2: string;
  full_sentence: string;
  explanation: string;
  visual_hint: string | null;
  accent_color: string | null;
  validation_status: string;
}

export interface ValidationResult {
  problem: GeneratedProblem;
  is_valid: boolean;
  reasons: string[];
}

export interface Assignment {
  assignment_id: string;
  teacher_id: string;
  student_id: string;
  target_type: string;
  unit_id: string;
  lesson_id: string;
  stage: number;
  concept_key: string;
  status: 'draft' | 'assigned' | 'completed' | 'cancelled';
  source: string;
  problems: GeneratedProblem[];
  created_at: string;
}

export interface GenerateProblemsRequest {
  target_type: 'student' | 'class';
  class_id: string | null;
  student_id: string | null;
  unit_id: string | null;
  lesson_id: string | null;
  stage: number;
  concept_key: string;
  count: number;
  difficulty: 'easy' | 'normal' | 'hard';
  generation_context?: Record<string, any>;
}

export interface GenerateProblemsResponse {
  assignment: Assignment;
  validation_results: ValidationResult[];
  total_generated: number;
  total_valid: number;
}

export const postGenerateProblems = async (payload: GenerateProblemsRequest) => {
  return apiFetch<GenerateProblemsResponse>(END_POINT.POST_GENERATE_PROBLEMS, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export interface AssignmentsResponse {
  assignments: Assignment[];
  total_count: number;
}

export const getTeacherAssignments = async (status?: string) => {
  const url = status ? `${END_POINT.GET_TEACHER_ASSIGNMENTS}?status=${status}` : END_POINT.GET_TEACHER_ASSIGNMENTS;
  return apiFetch<AssignmentsResponse>(url);
};

export const patchAssignAssignment = async (assignmentId: string) => {
  return apiFetch(END_POINT.PATCH_ASSIGN_ASSIGNMENT(assignmentId), {
    method: 'PATCH',
  });
};

export const patchCancelAssignment = async (assignmentId: string) => {
  return apiFetch(END_POINT.PATCH_CANCEL_ASSIGNMENT(assignmentId), {
    method: 'PATCH',
  });
};

export const patchCompleteAssignment = async (assignmentId: string) => {
  return apiFetch(END_POINT.PATCH_COMPLETE_ASSIGNMENT(assignmentId), {
    method: 'PATCH',
  });
};
