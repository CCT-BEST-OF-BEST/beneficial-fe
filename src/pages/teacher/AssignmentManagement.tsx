import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getTeacherAssignments,
  patchAssignAssignment,
  patchCancelAssignment,
  patchCompleteAssignment,
  type Assignment,
} from '@/features/instruction/api/teacherInstruction.ts';
import HomeButton from '@/shared/ui/HomeButton.tsx';
import AuthStatusButton from '@/features/auth/ui/AuthStatusButton.tsx';
import { cn } from '@/shared/lib/utils.ts';
import { RefreshCw } from 'lucide-react';

type StatusFilter = 'all' | 'draft' | 'assigned' | 'completed' | 'cancelled';

const STATUS_LABEL: Record<Assignment['status'], { text: string; className: string }> = {
  draft: { text: '초안', className: 'bg-[#FFF8E5] text-orange-primary' },
  assigned: { text: '배정됨', className: 'bg-[#F2F9E9] text-green-primary' },
  completed: { text: '완료', className: 'bg-[#EEF8FF] text-sky-primary' },
  cancelled: { text: '취소됨', className: 'bg-gray-100 text-gray-400' },
};

const FILTER_TABS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'draft', label: '초안' },
  { key: 'assigned', label: '배정됨' },
  { key: 'completed', label: '완료' },
  { key: 'cancelled', label: '취소됨' },
];

export default function AssignmentManagement() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await getTeacherAssignments();
      setAssignments(res.assignments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const filtered =
    filter === 'all' ? assignments : assignments.filter(a => a.status === filter);

  const handleAction = async (
    id: string,
    action: 'assign' | 'cancel' | 'complete',
    label: string
  ) => {
    if (!window.confirm(`${label} 하시겠습니까?`)) return;
    setActionLoading(id + action);
    try {
      if (action === 'assign') await patchAssignAssignment(id);
      else if (action === 'cancel') await patchCancelAssignment(id);
      else await patchCompleteAssignment(id);
      await fetchAssignments();
    } catch (err) {
      console.error(err);
      alert('처리 중 오류가 발생했습니다.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="flex h-full flex-col p-8 bg-gray-50/50 min-h-screen">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <HomeButton color="sky" />
          <h1 className="typography-SB3 text-gray-800">배정 관리</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchAssignments}
            className="p-2 rounded-full bg-white shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={18} className="text-gray-400" />
          </button>
          <AuthStatusButton />
        </div>
      </header>

      {/* 필터 탭 */}
      <div className="mb-6 flex gap-2">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={cn(
              'typography-SB5 rounded-full px-5 py-2 transition-colors',
              filter === tab.key
                ? 'bg-orange-primary text-white'
                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
            )}
          >
            {tab.label}
            {tab.key !== 'all' && (
              <span className="ml-1 text-xs opacity-70">
                ({assignments.filter(a => a.status === tab.key).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 배정 목록 */}
      <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden flex-1">
        {loading ? (
          <div className="p-12 text-center text-gray-400 typography-R4">불러오는 중...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400 typography-R4">
            {filter === 'all' ? '배정 내역이 없습니다.' : `${FILTER_TABS.find(t => t.key === filter)?.label} 상태의 배정이 없습니다.`}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map(assignment => (
              <div key={assignment.assignment_id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={cn(
                        'typography-SB6 rounded-full px-3 py-1',
                        STATUS_LABEL[assignment.status].className
                      )}>
                        {STATUS_LABEL[assignment.status].text}
                      </span>
                      <span className="typography-SB4 text-gray-800">{assignment.concept_key}</span>
                      <span className="typography-R5 text-gray-400">
                        Stage {assignment.stage}
                      </span>
                    </div>

                    <div className="flex gap-4 typography-R5 text-gray-500">
                      <span>문제 {assignment.problems.length}개</span>
                      <span>
                        대상: {assignment.target_type === 'student' ? '개인' : '반 전체'}
                      </span>
                      <span>
                        생성: {new Date(assignment.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* 문제 미리보기 */}
                    {assignment.problems.length > 0 && (
                      <div className="mt-3 rounded-xl bg-gray-50 p-4 border border-gray-100">
                        <p className="typography-R5 text-gray-500 mb-2">문제 미리보기</p>
                        <ul className="space-y-1">
                          {assignment.problems.slice(0, 2).map((problem, idx) => (
                            <li key={idx} className="typography-R5 text-gray-700">
                              {idx + 1}. {problem.sentence_part1}{' '}
                              <span className="text-orange-primary font-bold underline decoration-wavy">
                                {problem.correct_answer}
                              </span>{' '}
                              {problem.sentence_part2}
                            </li>
                          ))}
                          {assignment.problems.length > 2 && (
                            <li className="typography-R5 text-gray-400">
                              외 {assignment.problems.length - 2}문제 더...
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex flex-col gap-2 shrink-0">
                    {assignment.status === 'draft' && (
                      <>
                        <button
                          onClick={() => handleAction(assignment.assignment_id, 'assign', '학생에게 배정')}
                          disabled={actionLoading === assignment.assignment_id + 'assign'}
                          className="typography-SB5 rounded-xl bg-green-primary px-4 py-2 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          {actionLoading === assignment.assignment_id + 'assign' ? '처리 중...' : '배정하기'}
                        </button>
                        <button
                          onClick={() => handleAction(assignment.assignment_id, 'cancel', '초안 취소')}
                          disabled={actionLoading === assignment.assignment_id + 'cancel'}
                          className="typography-SB5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          취소
                        </button>
                      </>
                    )}
                    {assignment.status === 'assigned' && (
                      <>
                        <button
                          onClick={() => handleAction(assignment.assignment_id, 'complete', '완료 처리')}
                          disabled={actionLoading === assignment.assignment_id + 'complete'}
                          className="typography-SB5 rounded-xl bg-sky-primary px-4 py-2 text-white hover:bg-sky-600 transition-colors disabled:opacity-50"
                        >
                          {actionLoading === assignment.assignment_id + 'complete' ? '처리 중...' : '완료 처리'}
                        </button>
                        <button
                          onClick={() => handleAction(assignment.assignment_id, 'cancel', '배정 취소')}
                          disabled={actionLoading === assignment.assignment_id + 'cancel'}
                          className="typography-SB5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          취소
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 새 문제 생성 링크 */}
      <div className="mt-6">
        <Link
          to="/teacher/instruction/generate"
          className="block w-full rounded-2xl bg-orange-primary py-4 text-center typography-SB4 text-white hover:bg-orange-600 transition-colors shadow-md shadow-orange-200"
        >
          + AI 맞춤 문제 새로 만들기
        </Link>
      </div>
    </div>
  );
}
