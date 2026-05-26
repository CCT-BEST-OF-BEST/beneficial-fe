import { useEffect, useState } from 'react';
import DropDownIcon from '@/assets/DropDownIcon.svg?react';
import FlagIcon from '@/assets/FlagIcon.svg?react';
import Separator from '@/shared/ui/Separator.tsx';
import StudyListItem from '@/features/studyList/ui/StudyListItem.tsx';
import { getContentUnits } from '@/features/content/api/contentApi.ts';
import type { UnitItem, LessonItem } from '@/features/content/api/contentApi.ts';

export default function StudyList() {
  const [units, setUnits] = useState<UnitItem[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<UnitItem | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContentUnits()
      .then(res => {
        const sorted = [...res.units].sort((a, b) => a.order - b.order);
        setUnits(sorted);
        if (sorted.length > 0) setSelectedUnit(sorted[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const lessons: LessonItem[] = selectedUnit
    ? [...selectedUnit.lessons].sort((a, b) => a.order - b.order)
    : [];

  return (
    <section>
      <div className="rounded-[10px] bg-white px-11 pb-7 pt-12">
        <div className="relative mb-3">
          <button
            className="flex items-center gap-4"
            onClick={() => setIsDropdownOpen(prev => !prev)}
          >
            <span className="typography-R4 text-gray-5">
              {selectedUnit ? selectedUnit.name : '단원 선택'}
            </span>
            <DropDownIcon
              className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isDropdownOpen && units.length > 0 && (
            <ul className="absolute left-0 top-full z-10 mt-1 w-60 rounded-xl border border-gray-100 bg-white shadow-lg">
              {units.map(unit => (
                <li key={unit.unit_id}>
                  <button
                    className="typography-R4 w-full px-5 py-3 text-left hover:bg-[#FFF8E5]"
                    onClick={() => {
                      setSelectedUnit(unit);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {unit.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <h2 className="typography-SB4">{selectedUnit?.name ?? '단원을 선택해주세요'}</h2>

        <div className="gap-7.5 mt-7 flex items-end">
          <div className="bg-progress-gradient relative ml-auto mt-auto h-2 w-[432px] rounded-full">
            <div className="absolute bottom-0 -translate-x-[5px] transition-all duration-300 ease-in-out" style={{ left: '0%' }}>
              <FlagIcon />
            </div>
          </div>
          <Separator className="h-[50px] w-[2px]" />
          <div className="space-y-2">
            <div className="typography-R1 text-gray-5">진행도</div>
            <div className="typography-SB4 text-orange-primary">0%</div>
          </div>
        </div>
      </div>

      <ul className="mt-7 h-[calc(100vh-550px)] flex-1 space-y-4 overflow-auto">
        {loading ? (
          <li className="typography-R4 text-gray-3 py-10 text-center">불러오는 중...</li>
        ) : lessons.length === 0 ? (
          <li className="typography-R4 text-gray-3 py-10 text-center">
            {units.length === 0 ? '등록된 단원이 없습니다.' : '이 단원에 차시가 없습니다.'}
          </li>
        ) : (
          lessons.map(lesson => (
            <StudyListItem key={lesson.lesson_id} lesson={lesson} />
          ))
        )}
      </ul>
    </section>
  );
}
