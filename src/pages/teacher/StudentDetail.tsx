import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTeacherStudentProfile, getTeacherStudentRecords } from '@/features/classroom/api/teacherClassroom.ts';
import type { StudentProfileResponse, LearningRecord } from '@/features/classroom/api/teacherClassroom.ts';
import HomeButton from '@/shared/ui/HomeButton.tsx';
import { cn } from '@/shared/lib/utils.ts';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function StudentDetail() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<StudentProfileResponse | null>(null);
  const [records, setRecords] = useState<LearningRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      Promise.all([
        getTeacherStudentProfile(userId),
        getTeacherStudentRecords(userId, undefined, 20)
      ]).then(([profileRes, recordsRes]) => {
        setProfile(profileRes);
        setRecords(recordsRes.records || []);
      }).catch(console.error).finally(() => {
        setLoading(false);
      });
    }
  }, [userId]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500 min-h-screen">데이터를 불러오는 중입니다...</div>;
  }

  if (!profile) {
    return <div className="p-8 text-center text-gray-500 min-h-screen">학생 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="flex h-full flex-col p-8 bg-gray-50/50 min-h-screen">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-3 inline-flex rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors border border-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <h1 className="typography-SB3 text-gray-800">학생 상세</h1>
        </div>
        <HomeButton color="sky" />
      </header>

      <div className="grid grid-cols-[350px_1fr] gap-8">
        <aside className="flex flex-col gap-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <h2 className="typography-SB4 mb-6 text-gray-800">약점 프로파일</h2>
            <div className="flex flex-col gap-5">
              {profile.weak_concepts.length > 0 ? (
                profile.weak_concepts.map((concept, index) => {
                  const maxCount = Math.max(...profile.weak_concepts.map(c => c.wrong_count));
                  const percentage = Math.min((concept.wrong_count / maxCount) * 100, 100);
                  
                  return (
                    <div key={concept.concept_key} className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="typography-SB5 text-gray-700">{concept.concept_key}</span>
                        <span className="typography-R5 text-red-500 font-bold">{concept.wrong_count}회 오답</span>
                      </div>
                      <div className="relative h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div 
                          className={cn("absolute left-0 top-0 h-full rounded-full transition-all duration-500", index === 0 ? "bg-red-400" : "bg-orange-300")}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4 typography-R5 text-gray-400">
                  아직 수집된 약점 데이터가 없습니다.
                </div>
              )}
            </div>

            {profile.weak_concepts.length > 0 && (
              <div className="mt-8">
                <Link 
                  to={`/teacher/instruction/generate?studentId=${userId}&concept=${encodeURIComponent(profile.weak_concepts[0].concept_key)}`} 
                  className="block text-center w-full bg-orange-primary text-white py-3 rounded-xl typography-SB5 hover:bg-orange-600 transition-colors shadow-md shadow-orange-200"
                >
                  AI 맞춤 문제 만들기
                </Link>
              </div>
            )}
          </div>
        </aside>

        <main>
          <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden h-[600px] flex flex-col">
            <div className="p-6 border-b border-gray-100 shrink-0">
              <h2 className="typography-SB4 text-gray-800">최근 학습 타임라인</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="relative border-l-2 border-gray-100 ml-4 pl-6 flex flex-col gap-6">
                {records.length > 0 ? (
                  records.map((record) => (
                    <div key={record.record_id} className="relative">
                      {/* Timeline dot */}
                      <div className={cn(
                        "absolute -left-[35px] top-1 h-4 w-4 rounded-full border-4 border-white shadow-sm",
                        record.is_correct ? "bg-green-primary" : "bg-red-primary"
                      )} />
                      
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="typography-SB5 text-gray-800">단계 {record.stage}</span>
                          <span className="text-gray-400 text-xs">{new Date(record.created_at).toLocaleString()}</span>
                          {record.is_correct ? (
                            <CheckCircle2 size={16} className="text-green-primary ml-auto" />
                          ) : (
                            <XCircle size={16} className="text-red-primary ml-auto" />
                          )}
                        </div>
                        
                        <div className="rounded-lg bg-gray-50 p-4 border border-gray-100 text-sm">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-500 font-medium">{record.concept_key}</span>
                          </div>
                          {record.is_correct ? (
                            <div>
                              <p className="text-gray-700">정답을 맞췄습니다: <span className="font-bold text-green-700">{record.user_answer}</span></p>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1">
                              <p className="text-gray-700">작성한 오답: <span className="text-red-500 line-through">{record.user_answer || '(빈칸)'}</span></p>
                              <p className="text-gray-700">올바른 정답: <span className="text-green-600 font-bold">{record.correct_answer}</span></p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 typography-R5 py-10">
                    최근 학습 기록이 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
