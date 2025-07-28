import { useState } from 'react';
import DropDownIcon from '@/assets/DropDownIcon.svg?react';
import FlagIcon from '@/assets/FlagIcon.svg?react';
import Separator from '@/shared/ui/Separator.tsx';
import StudyListItem from '@/features/studyList/ui/StudyListItem.tsx';
import studyList from '@/features/studyList/api/studyList.json';

export default function StudyList() {
  const [progress] = useState(30);

  return (
    <section>
      <div className="rounded-[10px] bg-white px-11 pb-7 pt-12">
        <div className="mb-3 flex items-center gap-4">
          <span className="typography-R4 text-gray-5">2단원 </span>
          <DropDownIcon />
        </div>
        <h2 className="typography-SB4">소리도 뜻도 다른 헷갈리는 문장</h2>
        <div className="gap-7.5 mt-7 flex items-end">
          <div className="bg-progress-gradient relative ml-auto mt-auto h-2 w-[432px] rounded-full">
            <div
              className="absolute bottom-0 -translate-x-[5px] transition-all duration-300 ease-in-out"
              style={{ left: `${progress}%` }}
            >
              <FlagIcon />
            </div>
          </div>
          <Separator className="h-[50px] w-[2px]" />
          <div className="space-y-2">
            <div className="typography-R1 text-gray-5">진행도</div>
            <div className="typography-SB4 text-orange-primary">{progress}%</div>
          </div>
        </div>
      </div>
      <ul className="mt-7 h-[calc(100vh-550px)] flex-1 space-y-4 overflow-auto">
        {studyList.map(item => (
          <StudyListItem
            key={item.id}
            id={item.id}
            title={item.title}
            isCompleted={item.isCompleted}
            completeDate={item.completeDate}
            isAvailable={item.isAvailable}
          />
        ))}
      </ul>
    </section>
  );
}
