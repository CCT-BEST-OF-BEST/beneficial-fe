import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTeacherClassStudents, StudentItem } from '@/features/classroom/api/teacherClassroom.ts';
import HomeButton from '@/shared/ui/HomeButton.tsx';

export default function ClassDetail() {
  const { classId } = useParams<{ classId: string }>();
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (classId) {
      getTeacherClassStudents(classId).then((res) => {
        setStudents(res.students || []);
        setLoading(false);
      }).catch((err) => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [classId]);

  // Compute common weaknesses across the class
  const weakConceptCounts: Record<string, number> = {};
  students.forEach(student => {
    student.weak_concepts.forEach(concept => {
      weakConceptCounts[concept] = (weakConceptCounts[concept] || 0) + 1;
    });
  });

  const commonWeaknesses = Object.entries(weakConceptCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="flex h-full flex-col p-8 bg-gray-50/50 min-h-screen">
      <header className="mb-8 flex items-center gap-4">
        <HomeButton color="sky" />
        <h1 className="typography-SB3 text-gray-800">반 상세</h1>
      </header>

      <div className="grid grid-cols-[300px_1fr] gap-8">
        <aside className="flex flex-col gap-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <h2 className="typography-SB4 mb-4 text-gray-800">AI 반 분석</h2>
            <div className="rounded-xl bg-[#FFF8E5] p-4 border border-[#F4E6B6]">
              <h3 className="typography-SB5 text-orange-primary mb-2">공통 취약 개념 TOP 3</h3>
              {commonWeaknesses.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {commonWeaknesses.map(([concept, count]) => (
                    <li key={concept} className="flex justify-between items-center text-orange-900 typography-R5">
                      <span>{concept}</span>
                      <span className="bg-white text-orange-primary px-2 py-0.5 rounded-full text-xs font-bold">{count}명</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="typography-R5 text-gray-500">충분한 데이터가 없습니다.</p>
              )}
            </div>
            {commonWeaknesses.length > 0 && (
              <div className="mt-4">
                <Link to={`/teacher/instruction/generate?classId=${classId}&concept=${encodeURIComponent(commonWeaknesses[0][0])}`} className="block text-center w-full bg-orange-primary text-white py-3 rounded-xl typography-SB5 hover:bg-orange-600 transition-colors">
                  AI 반 맞춤 문제 생성
                </Link>
              </div>
            )}
          </div>
        </aside>

        <main>
          <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="typography-SB4 text-gray-800">학생 목록 ({students.length}명)</h2>
            </div>
            
            {loading ? (
              <div className="p-8 text-center text-gray-500">불러오는 중...</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {students.map((student) => (
                  <Link 
                    key={student.user_id} 
                    to={`/teacher/students/${student.user_id}`}
                    className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <h3 className="typography-SB4 text-gray-800 mb-1">{student.display_name}</h3>
                      <div className="flex gap-2">
                        {student.weak_concepts.length > 0 ? (
                          student.weak_concepts.slice(0, 3).map(concept => (
                            <span key={concept} className="bg-red-50 text-red-600 px-2 py-1 rounded-md text-xs font-medium">
                              {concept}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs">약점 데이터 없음</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-400 text-sm">최근 활동: {new Date(student.recent_activity_at).toLocaleDateString()}</span>
                    </div>
                  </Link>
                ))}
                {students.length === 0 && !loading && (
                  <div className="p-8 text-center text-gray-500">학생 데이터가 없습니다.</div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
