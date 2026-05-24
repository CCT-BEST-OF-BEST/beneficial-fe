import { useEffect, useState } from 'react';
import ReviewPopup from '@/features/studyStep/ui/ReviewPopup.tsx';
import { getStep3NextProblem } from '@/features/studyStep/api/getStep3NextProblem.ts';
import Badge from '@/shared/ui/Badge.tsx';
import { cn } from '@/shared/lib/utils.ts';
import Button from '@/shared/ui/Button.tsx';
import ArrowIcon from '@/assets/ArrowIcon.svg?react';
import { postStep3Answer } from '@/features/studyStep/api/postStep3Answer.ts';
import { getStep3Progress } from '@/features/studyStep/api/getStep3Progress.ts';
import CompleteDialog from '@/features/studyStep/ui/CompleteDialog.tsx';
import type { BadgeType } from '@/shared/ui/Badge.tsx';
import type { Step3Problem } from '@/features/studyStep/api/getStep3NextProblem.ts';
import { useAuth } from '@/features/auth/model/AuthContext.tsx';
import { postAgentChat } from '@/features/studyStep/api/postAgentChat.ts';
import Logo from '@/assets/Logo.png';
import { Link } from 'react-router-dom';

export default function StudyStep3() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(0);
  const [problem, setProblem] = useState<Step3Problem | null>(null);
  const [answer, setAnswer] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [badge, setBadge] = useState<BadgeType>('첫학습');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // AI 설명 관련 state
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiSessionId, setAiSessionId] = useState<string | null>(null);

  const fetchProblem = async () => {
    try {
      const data = await getStep3NextProblem();
      if (!data) return;

      if (data.is_completed) {
        setIsDialogOpen(true);
        return;
      }

      if (!data.problem) return;

      setProblem(data.problem);
      setBadge(data.problem.badge ?? '첫학습');
      setAnswer('');
      setCorrectAnswer('');
      setIsAnswered(false);
      setIsCorrect(null);
      setAiExplanation(null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProblem();
  }, []);

  const handleSubmit = async () => {
    if (!problem) return;
    if (!answer.trim() && !isAnswered) return;

    if (!isAnswered) {
      try {
        const result = await postStep3Answer({
          problem_id: problem.problem_id,
          answer,
        });
        const data = await getStep3Progress();
        if (!result || !data) return;

        setCorrectAnswer(result.correct_answer);
        setIsCorrect(result.is_correct);
        if (result.badge) setBadge(result.badge);
        setAnswer(result.explanation);
        setProgress((data.progress.completed_problems.length / data.progress.total_problems) * 100);
        setIsAnswered(true);
        setAiExplanation(null);
      } catch (err) {
        console.error(err);
      }
    } else {
      fetchProblem();
    }
  };

  const handleAskAI = async () => {
    if (!problem || !user) return;
    setIsLoadingAI(true);
    setAiExplanation(null);
    try {
      const result = await postAgentChat({
        sessionId: aiSessionId,
        message: `"${problem.sentence_part1} [${correctAnswer}] ${problem.sentence_part2}" 에서 "${correctAnswer}"가 왜 맞는 표현인지 쉽게 설명해줘.`,
      });
      setAiSessionId(result.session_id);
      setAiExplanation(result.response);
    } catch (err) {
      console.error(err);
      setAiExplanation('지금은 설명을 가져오지 못했어. 잠시 후 다시 눌러봐줘!');
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <>
      {/* 비로그인 안내 배너 */}
      {!user && (
        <div className="mb-4 flex items-center justify-between rounded-xl bg-[#FFF8E5] px-5 py-3">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="이로" className="h-[16px] w-[24px]" />
            <p className="typography-M3 text-orange-primary">
              로그인하면 내 진행도가 저장되고 AI 설명도 들을 수 있어요!
            </p>
          </div>
          <Link
            to="/auth/login"
            className="typography-SB6 text-orange-primary border-orange-primary ml-4 shrink-0 rounded-full border px-4 py-1"
          >
            로그인
          </Link>
        </div>
      )}

      <div className="gap-8.5 flex items-center">
        <div className="relative h-4 w-full flex-1 rounded-full bg-[#FFEDED]">
          <div
            className="absolute left-0 top-0 h-4 rounded-full bg-[#F19B9B] transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <ReviewPopup />
      </div>
      <Badge type={badge} />

      <div className="mx-auto flex h-[190px] w-[228px] items-center justify-center">
        {problem && (
          <img src={`${import.meta.env.VITE_API_BASE_URL}/learning/images/${problem.image}`} />
        )}
      </div>

      <div className="flex items-center justify-center gap-4">
        <span className="typography-M2">{problem ? `(${problem.problem_id})` : ''}</span>
        <span className="typography-M1">{problem?.sentence_part1}</span>
        <div
          className={cn('typography-SB1 min-w-[140px] rounded-lg bg-[#F9F9F9] py-3 text-center')}
        >
          <span className="text-[#D9D9D9]">{correctAnswer || '?'}</span>
        </div>
        <span className="typography-M1">{problem?.sentence_part2}</span>
      </div>

      <div className="mb-9 flex items-end justify-between">
        <div className="w-[50px]" />
        <div className="px-15 relative mx-auto mt-6 w-3/4 rounded-lg bg-[#FFFCF0] pb-4 pt-7">
          <input
            placeholder="답을 작성해주세요"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            readOnly={isAnswered}
            className="text-gray-5 typography-SB5 w-full border-b border-dashed border-[#F4E6B6] pb-5 text-center outline-none placeholder:text-[#F4DC8A]"
          />
          <div className="bg-triangle absolute bottom-0 right-0 h-7 w-7 bg-[#F4E6B6]" />
        </div>

        <Button step={3} disabled={!answer.trim()} className="p-3.25" onClick={handleSubmit}>
          <ArrowIcon className="h-5 w-5 scale-x-[-1]" />
        </Button>
      </div>

      {/* 오답 후 AI 설명 버튼 */}
      {isAnswered && isCorrect === false && user && (
        <div className="mx-auto w-3/4">
          {!aiExplanation && !isLoadingAI && (
            <button
              onClick={handleAskAI}
              className="border-orange-primary text-orange-primary typography-SB6 flex w-full items-center justify-center gap-2 rounded-xl border-2 bg-white py-3 transition-colors hover:bg-[#FFF8E5]"
            >
              <img src={Logo} alt="이로" className="h-[14px] w-[21px]" />
              이로에게 설명 듣기
            </button>
          )}
          {isLoadingAI && (
            <div className="flex items-center justify-center gap-2 py-3">
              <img src={Logo} alt="이로" className="h-[14px] w-[21px] animate-pulse" />
              <span className="typography-R2 text-orange-primary animate-pulse">
                이로가 설명을 준비 중이에요...
              </span>
            </div>
          )}
          {aiExplanation && (
            <div className="border-orange-primary rounded-xl border bg-[#FFF8E5] px-5 py-4">
              <div className="mb-2 flex items-center gap-2">
                <img src={Logo} alt="이로" className="h-[14px] w-[21px]" />
                <span className="typography-SB6 text-orange-primary">이로의 설명</span>
              </div>
              <p className="typography-R2 text-gray-4 whitespace-pre-line">{aiExplanation}</p>
            </div>
          )}
        </div>
      )}

      <CompleteDialog open={isDialogOpen} />
    </>
  );
}
