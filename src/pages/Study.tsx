import HomeButton from '@/shared/ui/HomeButton.tsx';
import StudyList from '@/features/studyList/ui/StudyList.tsx';
import AuthStatusButton from '@/features/auth/ui/AuthStatusButton.tsx';

export default function Study() {
  return (
    <>
      <section className="mb-16 flex justify-between">
        <HomeButton color={'sky'} />
        <div className="font-one-mobile-pop relative z-0 inline-block text-5xl">
          <span
            aria-hidden
            className="absolute left-0 top-0 z-0 text-white"
            style={{
              WebkitTextStroke: '8px white',
            }}
          >
            메인학습
          </span>

          <h1 className="text-orange-primary relative">메인학습</h1>
        </div>
        <AuthStatusButton />
      </section>
      <StudyList />
    </>
  );
}
