import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { postGenerateProblems, patchAssignAssignment } from '@/features/instruction/api/teacherInstruction.ts';
import type { GenerateProblemsResponse } from '@/features/instruction/api/teacherInstruction.ts';
import HomeButton from '@/shared/ui/HomeButton.tsx';
import Logo from '@/assets/Logo.png';
import { cn } from '@/shared/lib/utils.ts';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function AIProblemGenerator() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const classId = searchParams.get('classId');
  const studentId = searchParams.get('studentId');
  const initialConcept = searchParams.get('concept') || '';

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [conceptKey, setConceptKey] = useState(initialConcept);
  const [count, setCount] = useState<number>(3);
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  
  const [result, setResult] = useState<GenerateProblemsResponse | null>(null);

  const handleGenerate = async () => {
    setStep(2);

    try {
      const res = await postGenerateProblems({
        target_type: studentId ? 'student' : 'class',
        class_id: classId,
        student_id: studentId,
        unit_id: null,
        lesson_id: null,
        stage: 3,
        concept_key: conceptKey,
        count: count,
        difficulty: difficulty,
      });
      setResult(res);
      setStep(3);
    } catch (err) {
      console.error(err);
      alert('문제 생성 중 오류가 발생했습니다.');
      setStep(1);
    }
  };

  const handleAssign = async () => {
    if (!result?.assignment.assignment_id) return;
    try {
      await patchAssignAssignment(result.assignment.assignment_id);
      alert('성공적으로 배정되었습니다.');
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert('배정에 실패했습니다.');
    }
  };

  return (
    <div className="flex h-full flex-col p-8 bg-gray-50/50 min-h-screen">
      <header className="mb-8 flex items-center gap-4">
        <HomeButton color="sky" />
        <h1 className="typography-SB3 text-gray-800">AI 맞춤 문제 배정</h1>
      </header>

      <div className="max-w-3xl mx-auto w-full">
        {/* Step 1: Form */}
        {step === 1 && (
          <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
            <h2 className="typography-SB3 text-gray-800 mb-2">문제 생성 조건 설정</h2>
            
            <div className="flex flex-col gap-2">
              <label className="typography-SB5 text-gray-600">대상</label>
              <div className="p-4 rounded-xl bg-gray-50 text-gray-700 typography-R4">
                {studentId ? '선택한 학생 맞춤형' : classId ? '반 공통 약점 맞춤형' : '전체 대상'}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="typography-SB5 text-gray-600">집중 학습 개념</label>
              <input 
                type="text" 
                value={conceptKey} 
                onChange={(e) => setConceptKey(e.target.value)}
                className="p-4 rounded-xl border border-gray-200 outline-none focus:border-orange-primary"
                placeholder="예: 안/않, 되/돼"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="typography-SB5 text-gray-600">문제 수</label>
                <select 
                  value={count} 
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="p-4 rounded-xl border border-gray-200 outline-none bg-white focus:border-orange-primary"
                >
                  <option value={1}>1문제</option>
                  <option value={3}>3문제</option>
                  <option value={5}>5문제</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="typography-SB5 text-gray-600">난이도</label>
                <select 
                  value={difficulty} 
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="p-4 rounded-xl border border-gray-200 outline-none bg-white focus:border-orange-primary"
                >
                  <option value="easy">쉬움</option>
                  <option value="normal">보통</option>
                  <option value="hard">어려움</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={!conceptKey}
              className="mt-4 flex items-center justify-center gap-2 w-full bg-orange-primary text-white py-4 rounded-xl typography-SB4 hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              <img src={Logo} alt="이로" className="h-[18px] w-[27px] brightness-0 invert" />
              이로에게 문제 생성 요청하기
            </button>
          </div>
        )}

        {/* Step 2: Loading */}
        {step === 2 && (
          <div className="rounded-2xl bg-white p-12 shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
            <img src={Logo} alt="이로" className="h-[40px] mb-6 animate-pulse" />
            <h2 className="typography-SB3 text-orange-primary mb-2 animate-pulse">이로가 맞춤 문제를 만들고 있어요...</h2>
            <p className="typography-R4 text-gray-500">잠시만 기다려주세요.</p>
          </div>
        )}

        {/* Step 3: Result & Assign */}
        {step === 3 && result && (
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="typography-SB3 text-gray-800">생성된 문제 검토</h2>
                <div className="px-4 py-1.5 rounded-full bg-green-50 text-green-700 typography-SB5">
                  총 {result.total_valid}문제 생성 완료
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {result.validation_results.map((item, idx) => (
                  <div key={idx} className={cn(
                    "p-6 rounded-xl border",
                    item.is_valid ? "bg-white border-gray-200" : "bg-red-50 border-red-200"
                  )}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="typography-SB4 text-gray-800">
                        Q{idx + 1}. {item.problem.sentence_part1} <span className="underline decoration-wavy decoration-orange-primary px-2 text-orange-primary">{item.problem.correct_answer}</span> {item.problem.sentence_part2}
                      </div>
                      {item.is_valid ? (
                        <CheckCircle2 className="text-green-500 shrink-0" />
                      ) : (
                        <AlertCircle className="text-red-500 shrink-0" />
                      )}
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-1 rounded-lg bg-gray-50 p-4 typography-R5 text-gray-600">
                        <span className="font-bold block mb-1">설명</span>
                        {item.problem.explanation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 rounded-xl border-2 border-gray-200 text-gray-600 typography-SB4 hover:bg-gray-50 transition-colors"
                >
                  다시 생성하기
                </button>
                <button 
                  onClick={handleAssign}
                  className="flex-[2] bg-green-primary text-white py-4 rounded-xl typography-SB4 hover:bg-green-600 transition-colors shadow-md"
                >
                  이대로 학생에게 배정하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
