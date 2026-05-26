import { apiFetch } from '@/shared/api/client.ts';
import { END_POINT } from '@/shared/constant/apis.ts';

export interface LessonItem {
  lesson_id: string;
  unit_id: string;
  name: string;
  order: number;
  concept_keys: string[];
  stage_ids: number[];
}

export interface UnitItem {
  unit_id: string;
  name: string;
  order: number;
  lessons: LessonItem[];
}

export interface ContentUnitsResponse {
  units: UnitItem[];
  total_count: number;
}

export const getContentUnits = async () => {
  return apiFetch<ContentUnitsResponse>(END_POINT.GET_CONTENT_UNITS);
};

export const getContentLesson = async (lessonId: string) => {
  return apiFetch<LessonItem>(END_POINT.GET_CONTENT_LESSON(lessonId));
};
