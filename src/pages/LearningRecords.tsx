import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import HomeButton from '@/shared/ui/HomeButton.tsx';
import AuthStatusButton from '@/features/auth/ui/AuthStatusButton.tsx';
import { useAuth } from '@/features/auth/model/AuthContext.tsx';
import {
  getLearningRecords,
  type LearningRecord,
} from '@/features/studyList/api/getLearningRecords.ts';

const stageLabel: Record<number, { label: string; color: string }> = {
  1: { label: '1단계', color: 'bg-sky-primary text-white' },
  2: { label: '2단계', color: 'bg-green-primary text-white' },
  3: { label: '3단계', color: 'bg-red-primary text-white' },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear().toString().slice(2)}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function LearningRecords() {
  const { user, loading: authLoading } = useAuth();
  const [records, setRecords] = useState<LearningRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      try {
        const data = await getLearningRecords();
        setRecords(data.records);
        setTotalCount(data.total_count);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  if (!authLoading && !user) {
    return <Navigate to="/auth/login" replace />;
  }

  const correctCount = records.filter(r => r.is_correct).length;
  const wrongCount = records.filter(r => !r.is_correct).length;

  return (
    <>
      {/* 헤더 */}
      <section className="mb-16 flex justify-between">
        <HomeButton color={'sky'} />
        <div className="font-one-mobile-pop relative z-0 inline-block text-5xl">
          <span
            aria-hidden
            className="absolute left-0 top-0 z-0 text-white"
            style={{ WebkitTextStroke: '8px white' }}
          >
            맞춤법 카드 책장
          </span>
          <h1 className="text-orange-primary relative">맞춤법 카드 책장</h1>
        </div>
        <AuthStatusButton />
      </section>

      {/* 통계 요약 */}
      <section className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white px-6 py-5 text-center shadow-sm">
          <p className="typography-M4 text-gray-3 mb-1">전체 기록</p>
          <p className="typography-SB2 text-gray-4">{totalCount}</p>
        </div>
        <div className="rounded-2xl bg-white px-6 py-5 text-center shadow-sm">
          <p className="typography-M4 text-gray-3 mb-1">정답</p>
          <p className="typography-SB2 text-sky-primary">{correctCount}</p>
        </div>
        <div className="rounded-2xl bg-white px-6 py-5 text-center shadow-sm">
          <p className="typography-M4 text-gray-3 mb-1">오답</p>
          <p className="typography-SB2 text-red-primary">{wrongCount}</p>
        </div>
      </section>

      {/* 기록 목록 */}
      <section className="flex-1 rounded-2xl bg-white px-11 pt-8 pb-8">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <p className="typography-M1 text-gray-3">불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center">
            <p className="typography-M1 text-red-primary">기록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.</p>
          </div>
        ) : records.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 py-20">
            <p className="typography-SB3 text-gray-3">아직 학습 기록이 없어요</p>
            <p className="typography-R2 text-gray-2">메인학습을 완료하면 여기에 기록이 쌓여요!</p>
          </div>
        ) : (
          <ul className="h-[calc(100vh-520px)] space-y-3 overflow-auto">
            {records.map((record, idx) => {
              const stage = stageLabel[record.stage] ?? { label: `${record.stage}단계`, color: 'bg-gray-2 text-white' };
              return (
                <li
                  key={idx}
                  className="flex items-center gap-4 rounded-xl border border-[#F2F2F2] px-6 py-4"
                >
                  {/* 단계 배지 */}
                  <span className={`typography-M4 shrink-0 rounded-full px-3 py-1 ${stage.color}`}>
                    {stage.label}
                  </span>

                  {/* 개념 키 */}
                  <span className="typography-SB6 text-gray-4 w-[160px] shrink-0 truncate">
                    {record.concept_key}
                  </span>

                  {/* 답안 비교 */}
                  <div className="flex flex-1 items-center gap-2">
                    <span
                      className={`typography-M3 rounded-lg px-3 py-1 ${
                        record.is_correct
                          ? 'bg-[#EDFDF3] text-green-primary'
                          : 'bg-[#FFF2F2] text-red-primary line-through'
                      }`}
                    >
                      {record.user_answer}
                    </span>
                    {!record.is_correct && (
                      <>
                        <span className="typography-R1 text-gray-3">→</span>
                        <span className="typography-M3 rounded-lg bg-[#EDFDF3] px-3 py-1 text-green-primary">
                          {record.correct_answer}
                        </span>
                      </>
                    )}
                  </div>

                  {/* 정오답 아이콘 */}
                  <span className={`typography-SB6 shrink-0 ${record.is_correct ? 'text-sky-primary' : 'text-red-primary'}`}>
                    {record.is_correct ? '✓ 정답' : '✗ 오답'}
                  </span>

                  {/* 날짜 */}
                  <span className="typography-R1 text-gray-3 shrink-0">
                    {formatDate(record.created_at)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
