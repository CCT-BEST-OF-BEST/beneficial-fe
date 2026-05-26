import { useState } from 'react';
import ArrowIcon from '@/assets/ArrowIcon.svg?react';
import StudyDialog from './StudyDialog';
import type { LessonItem } from '@/features/content/api/contentApi.ts';

interface StudyListItemProps {
  lesson: LessonItem;
  isCompleted?: boolean;
}

export default function StudyListItem({ lesson, isCompleted = false }: StudyListItemProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <li
        className="flex cursor-pointer rounded-[10px] bg-white px-6 py-5"
        onClick={() => setIsDialogOpen(true)}
      >
        <div className={`typography-M4 rounded-full px-4 ${isCompleted ? 'bg-green-50 text-green-500' : 'bg-[#FFF8E5] text-[#FFD392]'}`}>
          {lesson.order}차시
        </div>
        <div className="typography-M2 ml-4 flex-1">{lesson.name}</div>
        <div className={`typography-SB3 flex items-center gap-1 ${isCompleted ? 'text-green-500' : 'text-orange-primary'}`}>
          {isCompleted ? '학습 완료' : '학습하기'}
          {isCompleted
            ? <span className="flex h-6 w-6 items-center justify-center text-base">✓</span>
            : <div className="flex h-6 w-6 items-center justify-center"><ArrowIcon className="h-3 w-3 scale-x-[-1]" /></div>
          }
        </div>
      </li>

      <StudyDialog
        lessonId={lesson.lesson_id}
        lessonOrder={lesson.order}
        lessonName={lesson.name}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}
