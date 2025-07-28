import { useState } from 'react';
import ArrowIcon from '@/assets/ArrowIcon.svg?react';
import StudyDialog from './StudyDialog';
import LockIcon from '@/assets/LockIcon.svg?react';

interface StudyListItemProps {
  id: number;
  title: string;
  isCompleted: boolean;
  completeDate?: string;
  isAvailable: boolean;
}

export default function StudyListItem({
  id,
  title,
  isCompleted,
  completeDate,
  isAvailable,
}: StudyListItemProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleItemClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      <li
        className="flex cursor-pointer rounded-[10px] bg-white px-6 py-5"
        onClick={handleItemClick}
      >
        <div className="typography-M4 rounded-full bg-[#FFF8E5] px-4 text-[#FFD392]">{id}차시</div>
        <div className="typography-M2 ml-4 flex-1">{title}</div>
        {isCompleted ? (
          <div className="text-gray-2 typography-SB6 flex items-center">
            학습 완료 {completeDate}
            <div className="flex h-6 w-6 items-center justify-center">
              <ArrowIcon className="h-3 w-3 scale-x-[-1]" />
            </div>
          </div>
        ) : isAvailable ? (
          <div className="text-orange-primary typography-SB3 flex">
            학습하기
            <div className="flex h-6 w-6 items-center justify-center">
              <ArrowIcon className="h-3 w-3 scale-x-[-1]" />
            </div>
          </div>
        ) : (
          <LockIcon />
        )}
      </li>

      {isAvailable && <StudyDialog id={id} open={isDialogOpen} onOpenChange={setIsDialogOpen} />}
    </>
  );
}
