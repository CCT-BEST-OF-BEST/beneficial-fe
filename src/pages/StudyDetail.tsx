import StudyStep1 from '@/features/studyStep/ui/StudyStep1.tsx';
import StudyStep2 from '@/features/studyStep/ui/StudyStep2.tsx';
import StudyStep3 from '@/features/studyStep/ui/StudyStep3.tsx';
import HomeButton from '@/shared/ui/HomeButton.tsx';
import { useState } from 'react';
import Logo from '@/assets/Logo.png';
import StepProgress from '@/features/studyStep/ui/StepProgress.tsx';
import Button from '@/shared/ui/Button.tsx';

export default function StudyDetail() {
  const [currentStep, setCurrentStep] = useState(2);

  return (
    <>
      <section className="mb-16 flex justify-between">
        <div className="flex min-w-[210px] gap-7">
          <HomeButton color={'sky'} />
          <button className="items-center justify-center rounded-lg bg-white px-1 shadow">
            <img src={Logo} className="h-[27px] w-[41px]" />
          </button>
        </div>
        <h1 className="font-one-mobile-pop text-sky-primary text-shadow-white-4px text-5xl">
          오늘의 맞춤법
        </h1>
        <StepProgress currentStep={currentStep} />
      </section>

      <section className="flex-1 rounded-2xl bg-white px-11 pt-10 relative">
        {currentStep === 1 && <StudyStep1 />}
        {currentStep === 2 && <StudyStep2 />}
        {currentStep === 3 && <StudyStep3 />}
      </section>
      <Button step={2} className="typography-SB5 absolute w-[150px] bottom-9 right-25.5" disabled={true}>다음 단계</Button>
    </>
  );
}
