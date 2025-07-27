import StudyStep1 from '@/features/studyStep/ui/StudyStep1.tsx';
import StudyStep2 from '@/features/studyStep/ui/StudyStep2.tsx';
import StudyStep3 from '@/features/studyStep/ui/StudyStep3.tsx';
import HomeButton from '@/shared/ui/HomeButton.tsx';
import { useState } from 'react';
import StepProgress from '@/features/studyStep/ui/StepProgress.tsx';
import ChatbotPopover from '@/features/studyStep/ui/ChatbotPopover.tsx';

export default function StudyDetail() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleStepClick = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  return (
    <>
      <section className="mb-16 flex justify-between">
        <div className="flex min-w-[210px] gap-7">
          <HomeButton color={'sky'} />
          <ChatbotPopover />
        </div>
        <h1 className="font-one-mobile-pop text-sky-primary text-shadow-white-4px text-5xl">
          오늘의 맞춤법
        </h1>
        <StepProgress currentStep={currentStep} />
      </section>

      <section className="flex-1 rounded-2xl bg-white px-11 pt-10">
        {currentStep === 1 && <StudyStep1 handleStepClick={handleStepClick}/>}
        {currentStep === 2 && <StudyStep2 handleStepClick={handleStepClick}/>}
        {currentStep === 3 && <StudyStep3 />}
      </section>
    </>
  );
}
