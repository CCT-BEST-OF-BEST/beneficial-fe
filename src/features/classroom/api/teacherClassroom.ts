import { apiFetch } from '@/shared/api/client.ts';
import { END_POINT } from '@/shared/constant/apis.ts';

export interface ClassItem {
  class_id: string;
  name: string;
  teacher_id: string;
  student_count: number;
}

export interface ClassesResponse {
  classes: ClassItem[];
  total_count: number;
}

export const getTeacherClasses = async () => {
  return apiFetch<ClassesResponse>(END_POINT.GET_TEACHER_CLASSES);
};

export interface StudentItem {
  user_id: string;
  email: string;
  display_name: string;
  weak_concepts: string[];
  recent_activity_at: string;
}

export interface ClassStudentsResponse {
  class_id: string;
  students: StudentItem[];
  total_count: number;
}

export const getTeacherClassStudents = async (classId: string) => {
  return apiFetch<ClassStudentsResponse>(END_POINT.GET_TEACHER_CLASS_STUDENTS(classId));
};

export interface WeakConcept {
  concept_key: string;
  wrong_count: number;
  last_wrong_at: string;
  priority: number;
}

export interface StudentProfileResponse {
  user_id: string;
  weak_concepts: WeakConcept[];
}

export const getTeacherStudentProfile = async (userId: string) => {
  return apiFetch<StudentProfileResponse>(END_POINT.GET_TEACHER_STUDENT_PROFILE(userId));
};

export interface LearningRecord {
  record_id: string;
  user_id: string;
  stage: number;
  lesson_id: string;
  problem_key: string;
  concept_key: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  created_at: string;
}

export interface StudentRecordsResponse {
  records: LearningRecord[];
  total_count: number;
}

export const getTeacherStudentRecords = async (userId: string, stage?: number, limit = 50) => {
  let url = `${END_POINT.GET_TEACHER_STUDENT_RECORDS(userId)}?limit=${limit}`;
  if (stage !== undefined) {
    url += `&stage=${stage}`;
  }
  return apiFetch<StudentRecordsResponse>(url);
};
