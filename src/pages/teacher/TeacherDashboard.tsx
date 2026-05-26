import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTeacherClasses, ClassItem } from '@/features/classroom/api/teacherClassroom.ts';
import { getTeacherAssignments, Assignment } from '@/features/instruction/api/teacherInstruction.ts';
import { useAuth } from '@/features/auth/model/AuthContext.tsx';
import AuthStatusButton from '@/features/auth/ui/AuthStatusButton.tsx';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    getTeacherClasses().then((res) => {
      setClasses(res.classes || []);
    }).catch(console.error);

    getTeacherAssignments().then((res) => {
      setAssignments(res.assignments || []);
    }).catch(console.error);
  }, []);

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
        <section>
          <h2 className="typography-SB4 mb-4 text-gray-800">내 담당 반</h2>
          <div className="flex flex-col gap-4">
            {classes.length > 0 ? (
              classes.map((cls) => (
                <Link
                  key={cls.class_id}
                  to={`/teacher/classes/${cls.class_id}`}
                  className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 transition-shadow hover:shadow-md"
                >
                  <h3 className="typography-SB3 text-green-primary mb-2">{cls.name}</h3>
                  <p className="typography-R4 text-gray-500">학생 {cls.student_count}명</p>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl bg-gray-50 p-8 text-center text-gray-400 typography-R4">
                담당 반이 없습니다.
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="typography-SB4 mb-4 text-gray-800">최근 배정 관리</h2>
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl bg-[#FFF8E5] p-6 shadow-sm border border-[#F4E6B6]">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="typography-SB4 text-orange-primary">검토 대기 중인 초안</h3>
                <span className="typography-SB4 text-orange-primary bg-white px-3 py-1 rounded-full">{draftAssignments.length}건</span>
              </div>
              <p className="typography-R5 text-gray-600 mb-4">AI가 생성한 문제를 검토하고 학생들에게 배정해주세요.</p>
            </div>

            <div className="rounded-2xl bg-[#F2F9E9] p-6 shadow-sm border border-[#E1EFD5]">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="typography-SB4 text-green-primary">진행 중인 배정</h3>
                <span className="typography-SB4 text-green-primary bg-white px-3 py-1 rounded-full">{activeAssignments.length}건</span>
              </div>
              <p className="typography-R5 text-gray-600 mb-4">학생들이 배정받은 문제를 풀고 있습니다.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
