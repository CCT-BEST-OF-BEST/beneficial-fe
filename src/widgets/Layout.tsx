import { Outlet, useLocation } from 'react-router-dom';
import Step1BG from '@/assets/Step1BG.png';
import Step2BG from '@/assets/Step2BG.png';
import Step3BG from '@/assets/Step3BG.png';
import HomeBG from '@/assets/HomeBG.png';
import StudyListBG from '@/assets/StudyListBG.png';
import { useStep } from '@/features/studyStep/hooks/StepContext.tsx';

export default function Layout() {
  const { currentStep } = useStep();
  const { pathname } = useLocation();

  const getBackgroundImage = () => {
    if (pathname === '/' || pathname === '/student') return HomeBG;

    // 학습 목록 페이지
    if (pathname === '/student/learning') return StudyListBG;

    // 학습 상세 (lesson) 페이지 — step 기반 배경
    if (pathname.startsWith('/student/learning/')) {
      return (
        {
          1: Step1BG,
          2: Step2BG,
          3: Step3BG,
        }[currentStep] || Step1BG
      );
    }

    // 이로 챗봇 페이지
    if (pathname === '/student/iro') return HomeBG;

    return HomeBG;
  };

  return (
    <div
      className="flex w-full min-w-[1000px] justify-center"
      style={{
        backgroundImage: `url(${getBackgroundImage()})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'round',
      }}
    >
      <main className="pt-21 pb-24.5 px-25.5 relative flex min-h-screen w-full max-w-[1194px] flex-col">
        <Outlet />
      </main>
    </div>
  );
}
