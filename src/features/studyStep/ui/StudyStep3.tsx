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

export default function StudyStep3() {
  const [progress, setProgress] = useState(0);
  const [problem, setProblem] = useState({});
  const [answer, setAnswer] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [badge, setBadge] = useState('첫학습');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchProblem = async () => {
    try {
      const data = await getStep3NextProblem();

      if (data.is_completed) {
        setIsDialogOpen(true);
        return;
      }

      setProblem(data.problem);
      setBadge(data.problem.badge);
      setAnswer('');
      setCorrectAnswer('');
      setIsAnswered(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProblem();
  }, []);

  const handleSubmit = async () => {
    if (!answer.trim() && !isAnswered) return;

    if (!isAnswered) {
      try {
        const result = await postStep3Answer({
          problem_id: problem.problem_id,
          answer,
        });
        const data = await getStep3Progress();

        setCorrectAnswer(result.correct_answer);
        setBadge(result.badge);
        setAnswer(result.explanation);
        setProgress((data.progress.completed_problems.length / data.progress.total_problems) * 100);
        setIsAnswered(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      fetchProblem();
    }
  };

  return (
    <>
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
        <img src={`${import.meta.env.VITE_API_BASE_URL}/learning/images/${problem.image}`} />
      </div>

      <div className="flex items-center justify-center gap-4">
        <span className="typography-M2">({problem.problem_id})</span>
        <span className="typography-M1">{problem.sentence_part1}</span>
        <div
          className={cn('typography-SB1 min-w-[140px] rounded-lg bg-[#F9F9F9] py-3 text-center')}
        >
          <span className="text-[#D9D9D9]">{correctAnswer || '?'}</span>
        </div>
        <span className="typography-M1">{problem.sentence_part2}</span>
      </div>

      <div className="mb-9 flex items-end justify-between">
        <div className="w-[50px]" />
        <div className="px-15 relative mx-auto mt-6 w-3/4 rounded-lg bg-[#FFFCF0] pb-4 pt-7">
          <input
            placeholder="답을 작성해주세요"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            className="text-gray-5 typography-SB5 w-full border-b border-dashed border-[#F4E6B6] pb-5 text-center outline-none placeholder:text-[#F4DC8A]"
          />
          <div className="bg-triangle absolute bottom-0 right-0 h-7 w-7 bg-[#F4E6B6]" />
        </div>

        <Button step={3} disabled={!answer.trim()} className="p-3.25" onClick={handleSubmit}>
          <ArrowIcon className="h-5 w-5 scale-x-[-1]" />
        </Button>
      </div>
      <CompleteDialog open={isDialogOpen} />
    </>
  );
}
