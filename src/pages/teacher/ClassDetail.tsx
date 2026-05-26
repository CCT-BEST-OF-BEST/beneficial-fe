import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTeacherClassStudents } from '@/features/classroom/api/teacherClassroom.ts';
import type { StudentItem } from '@/features/classroom/api/teacherClassroom.ts';
import { searchStudents, addStudentToClass, removeStudentFromClass } from '@/features/classroom/api/studentClassroom.ts';
import type { UserSearchResult } from '@/features/classroom/api/studentClassroom.ts';
import HomeButton from '@/shared/ui/HomeButton.tsx';

export default function ClassDetail() {
  const { classId } = useParams<{ classId: string }>();
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const reloadStudents = () => {
    if (!classId) return;
    getTeacherClassStudents(classId).then(res => setStudents(res.students || []));
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (!value.trim()) { setSearchResults([]); return; }
    searchTimer.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await searchStudents(value.trim());
        const enrolled = new Set(students.map(s => s.user_id));
        setSearchResults(res.users.filter(u => !enrolled.has(u.user_id)));
      } finally {
        setSearching(false);
      }
    }, 300);
  };

  const handleAddStudent = async (studentId: string) => {
    if (!classId) return;
    await addStudentToClass(classId, studentId);
    setSearchQuery('');
    setSearchResults([]);
    reloadStudents();
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (!classId || !window.confirm('학생을 반에서 제거하시겠습니까?')) return;
    await removeStudentFromClass(classId, studentId);
    reloadStudents();
  };

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

        <main className="flex flex-col gap-4">
          {/* 학생 검색 + 추가 */}
          <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
            <h2 className="typography-SB4 text-gray-800 mb-3">학생 추가</h2>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => handleSearchChange(e.target.value)}
                placeholder="이름 또는 이메일로 학생 검색..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 typography-R4 outline-none focus:border-orange-primary"
              />
              {searching && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">검색 중...</span>
              )}
            </div>
            {searchResults.length > 0 && (
              <ul className="mt-2 border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-50">
                {searchResults.map(u => (
                  <li key={u.user_id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                    <div>
                      <span className="typography-SB5 text-gray-800">{u.display_name}</span>
                      <span className="ml-2 text-xs text-gray-400">{u.email}</span>
                    </div>
                    <button
                      onClick={() => handleAddStudent(u.user_id)}
                      className="text-sm text-orange-primary font-semibold hover:underline"
                    >
                      추가
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {searchQuery && !searching && searchResults.length === 0 && (
              <p className="mt-2 text-sm text-gray-400">검색 결과가 없습니다.</p>
            )}
          </div>

          {/* 학생 목록 */}
          <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="typography-SB4 text-gray-800">학생 목록 ({students.length}명)</h2>
            </div>

            {loading ? (
              <div className="p-8 text-center text-gray-500">불러오는 중...</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {students.map((student) => (
                  <div key={student.user_id} className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                    <Link to={`/teacher/students/${student.user_id}`} className="flex-1 min-w-0">
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
                    </Link>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-gray-400 text-sm">
                        최근 활동: {student.recent_activity_at ? new Date(student.recent_activity_at).toLocaleDateString() : '-'}
                      </span>
                      <button
                        onClick={() => handleRemoveStudent(student.user_id)}
                        className="text-xs text-red-400 hover:text-red-600 font-medium"
                      >
                        제거
                      </button>
                    </div>
                  </div>
                ))}
                {students.length === 0 && !loading && (
                  <div className="p-8 text-center text-gray-500">등록된 학생이 없습니다. 위에서 학생을 검색해 추가하세요.</div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
