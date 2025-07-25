import { useState } from 'react';
import ArrowIcon from '@/assets/ArrowIcon.svg?react';
import StudyDialog from './StudyDialog';

export default function StudyListItem() {
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
        <div className="typography-M4 rounded-full bg-[#FFF8E5] px-4 text-[#FFD392]">1차시</div>
        <div className="typography-M2 ml-4 flex-1">
          비슷한 동사, 다른 의미1: 두껍다 VS 두텁다 | 부수다 VS 부시다 | 찢다 VS 찧다 | 젖히다 VS
          제치다
        </div>
        <div className="text-orange-primary typography-SB6 flex items-center">
          학습 완료 25.07.12
          <ArrowIcon />
        </div>
      </li>

      <StudyDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}
