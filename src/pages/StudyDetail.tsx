import StudyStep1 from '@/features/studyStep/ui/StudyStep1.tsx';
import StudyStep2 from '@/features/studyStep/ui/StudyStep2.tsx';
import StudyStep3 from '@/features/studyStep/ui/StudyStep3.tsx';
import HomeButton from '@/shared/ui/HomeButton.tsx';
import StepProgress from '@/features/studyStep/ui/StepProgress.tsx';
import ChatbotPopover from '@/features/studyStep/ui/ChatbotPopover.tsx';
import { useStep } from '@/features/studyStep/hooks/StepContext.tsx';
import { cn } from '@/shared/lib/utils.ts';
import { useEffect } from 'react';
import { postStep3Reset } from '@/features/studyStep/api/postStep3Reset.ts';
import AuthStatusButton from '@/features/auth/ui/AuthStatusButton.tsx';

const textColorMap: Record<number, string> = {
  1: 'text-sky-primary',
  2: 'text-green-primary',
  3: 'text-red-primary',
};

export default function StudyDetail() {
  const { currentStep, setCurrentStep } = useStep();

  const handleStepClick = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  useEffect(() => {
    return () => {
      const resetStep = async () => {
        await postStep3Reset();
        setCurrentStep(1);
      };
      resetStep();
    };
  }, [setCurrentStep]);

  return (
    <>
      <section className="mb-16 flex justify-between">
        <div className="flex min-w-[210px] gap-7">
          <HomeButton color={'sky'} />
          {currentStep < 3 && <ChatbotPopover />}
        </div>
        <div className="font-one-mobile-pop relative inline-block text-5xl ">
          <span
            aria-hidden
            className="absolute left-0 top-0 z-0 text-white"
            style={{
              WebkitTextStroke: '8px white',
            }}
          >
            {currentStep === 1 && '오늘의 맞춤법'}
            {currentStep === 2 && '예제 풀이'}
            {currentStep === 3 && '도전 맞춤법'}
          </span>

          <h1 className={cn('relative ', textColorMap[currentStep])}>
            {currentStep === 1 && '오늘의 맞춤법'}
            {currentStep === 2 && '예제 풀이'}
            {currentStep === 3 && '도전 맞춤법'}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <StepProgress currentStep={currentStep} />
          <AuthStatusButton />
        </div>
      </section>

      <section className="flex-1 rounded-2xl bg-white px-11 pt-10">
        {currentStep === 1 && <StudyStep1 handleStepClick={handleStepClick} />}
        {currentStep === 2 && <StudyStep2 handleStepClick={handleStepClick} />}
        {currentStep === 3 && <StudyStep3 />}
      </section>
    </>
  );
}
