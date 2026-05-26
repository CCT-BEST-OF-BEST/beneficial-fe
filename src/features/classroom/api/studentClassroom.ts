import { apiFetch } from '@/shared/api/client.ts';
import { END_POINT } from '@/shared/constant/apis.ts';

export interface MyClassInfo {
  class_id: string;
  class_name: string;
  teacher_display_name: string;
  teacher_school_name: string | null;
}

export const getMyClass = async (): Promise<MyClassInfo | null> => {
  return apiFetch<MyClassInfo | null>(END_POINT.GET_STUDENT_MY_CLASS);
};

export interface UserSearchResult {
  user_id: string;
  display_name: string;
  email: string;
}

export interface UserSearchResponse {
  users: UserSearchResult[];
}

export const searchStudents = async (query: string): Promise<UserSearchResponse> => {
  return apiFetch<UserSearchResponse>(`${END_POINT.GET_TEACHER_SEARCH_STUDENTS}?q=${encodeURIComponent(query)}`);
};

export const addStudentToClass = async (classId: string, studentId: string): Promise<void> => {
  await apiFetch<void>(END_POINT.POST_TEACHER_CLASS_STUDENT(classId), {
    method: 'POST',
    body: JSON.stringify({ student_id: studentId }),
  });
};

export const removeStudentFromClass = async (classId: string, studentId: string): Promise<void> => {
  await apiFetch<void>(END_POINT.DELETE_TEACHER_CLASS_STUDENT(classId, studentId), {
    method: 'DELETE',
  });
};
