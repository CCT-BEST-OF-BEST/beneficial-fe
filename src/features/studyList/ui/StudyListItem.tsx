import { useState } from 'react';
import ArrowIcon from '@/assets/ArrowIcon.svg?react';
import StudyDialog from './StudyDialog';
import type { LessonItem } from '@/features/content/api/contentApi.ts';

interface StudyListItemProps {
  lesson: LessonItem;
}

export default function StudyListItem({ lesson }: StudyListItemProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <li
        className="flex cursor-pointer rounded-[10px] bg-white px-6 py-5"
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="typography-M4 rounded-full bg-[#FFF8E5] px-4 text-[#FFD392]">
          {lesson.order}차시
        </div>
        <div className="typography-M2 ml-4 flex-1">{lesson.name}</div>
        <div className="text-orange-primary typography-SB3 flex">
          학습하기
          <div className="flex h-6 w-6 items-center justify-center">
            <ArrowIcon className="h-3 w-3 scale-x-[-1]" />
          </div>
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
