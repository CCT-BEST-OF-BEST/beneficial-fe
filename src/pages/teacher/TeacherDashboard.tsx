import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTeacherClasses, createTeacherClass, type ClassItem } from '@/features/classroom/api/teacherClassroom.ts';
import { getTeacherAssignments, type Assignment } from '@/features/instruction/api/teacherInstruction.ts';
import { useAuth } from '@/features/auth/model/AuthContext.tsx';
import AuthStatusButton from '@/features/auth/ui/AuthStatusButton.tsx';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [creating, setCreating] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTeacherClasses()
      .then(res => setClasses(res.classes || []))
      .catch(console.error);

    getTeacherAssignments()
      .then(res => setAssignments(res.assignments || []))
      .catch(console.error);
  }, []);

  const handleCreateClass = async () => {
    const name = newClassName.trim();
    if (!name) return;
    setSubmitting(true);
    try {
      const created = await createTeacherClass(name);
      setCreating(false);
      setNewClassName('');
      navigate(`/teacher/classes/${created.class_id}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreateClass();
    if (e.key === 'Escape') { setCreating(false); setNewClassName(''); }
  };

  const draftAssignments = assignments.filter(a => a.status === 'draft');
  const activeAssignments = assignments.filter(a => a.status === 'assigned');

  return (
    <div className="flex h-full flex-col p-8">
      <header className="mb-10 flex items-center justify-between">
        <h1 className="typography-SB3">
          <span className="font-bold text-orange-primary">{user?.display_name ?? '선생님'}</span>님, 환영합니다.
        </h1>
        <AuthStatusButton />
      </header>

      <div className="grid grid-cols-2 gap-8">
        {/* 내 담당 반 */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="typography-SB4 text-gray-800">내 담당 반</h2>
            <button
              onClick={() => { setCreating(true); setTimeout(() => inputRef.current?.focus(), 50); }}
              className="typography-SB5 text-orange-primary hover:underline"
            >
              + 반 만들기
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {creating && (
              <div className="rounded-2xl bg-white p-5 shadow-sm border border-orange-primary flex gap-3 items-center">
                <input
                  ref={inputRef}
                  value={newClassName}
                  onChange={e => setNewClassName(e.target.value)}
                  onKeyDown={handleCreateKeyDown}
                  placeholder="반 이름을 입력하세요 (예: 소담반)"
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 typography-R4 outline-none focus:border-orange-primary"
                />
                <button
                  onClick={handleCreateClass}
                  disabled={!newClassName.trim() || submitting}
                  className="bg-orange-primary text-white px-5 py-2.5 rounded-xl typography-SB5 disabled:opacity-50 shrink-0"
                >
                  {submitting ? '생성 중...' : '만들기'}
                </button>
                <button
                  onClick={() => { setCreating(false); setNewClassName(''); }}
                  className="text-gray-400 hover:text-gray-600 px-2 shrink-0"
                >
                  취소
                </button>
              </div>
            )}

            {classes.length > 0 ? (
              classes.map(cls => (
                <Link
                  key={cls.class_id}
                  to={`/teacher/classes/${cls.class_id}`}
                  className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 transition-shadow hover:shadow-md"
                >
                  <h3 className="typography-SB3 text-green-primary mb-2">{cls.name}</h3>
                  <p className="typography-R4 text-gray-500">학생 {cls.student_count}명</p>
                </Link>
              ))
            ) : !creating ? (
              <div className="rounded-2xl bg-gray-50 p-8 text-center text-gray-400 typography-R4">
                담당 반이 없습니다. 반을 만들어 학생을 등록해보세요.
              </div>
            ) : null}
          </div>
        </section>

        {/* 배정 관리 요약 */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="typography-SB4 text-gray-800">최근 배정 관리</h2>
            <Link
              to="/teacher/instruction/assignments"
              className="typography-R5 text-orange-primary hover:underline"
            >
              전체 보기 →
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <Link
              to="/teacher/instruction/assignments?status=draft"
              className="rounded-2xl bg-[#FFF8E5] p-6 shadow-sm border border-[#F4E6B6] hover:shadow-md transition-shadow"
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="typography-SB4 text-orange-primary">검토 대기 중인 초안</h3>
                <span className="typography-SB4 text-orange-primary bg-white px-3 py-1 rounded-full">
                  {draftAssignments.length}건
                </span>
              </div>
              <p className="typography-R5 text-gray-600">AI가 생성한 문제를 검토하고 학생들에게 배정해주세요.</p>
            </Link>

            <Link
              to="/teacher/instruction/assignments?status=assigned"
              className="rounded-2xl bg-[#F2F9E9] p-6 shadow-sm border border-[#E1EFD5] hover:shadow-md transition-shadow"
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="typography-SB4 text-green-primary">진행 중인 배정</h3>
                <span className="typography-SB4 text-green-primary bg-white px-3 py-1 rounded-full">
                  {activeAssignments.length}건
                </span>
              </div>
              <p className="typography-R5 text-gray-600">학생들이 배정받은 문제를 풀고 있습니다.</p>
            </Link>
          </div>

          <div className="mt-4">
            <Link
              to="/teacher/instruction/generate"
              className="block w-full rounded-2xl bg-orange-primary py-4 text-center typography-SB4 text-white hover:bg-orange-600 transition-colors shadow-md shadow-orange-200"
            >
              + AI 맞춤 문제 만들기
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
