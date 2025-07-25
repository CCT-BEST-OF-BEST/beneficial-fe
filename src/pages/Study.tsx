import HomeButton from '@/shared/ui/HomeButton.tsx';
import StudyList from '@/features/studyList/ui/StudyList.tsx';

export default function Study() {
  return (
    <>
      <section className="mb-16 flex justify-between">
        <HomeButton color={'sky'} />
        <h1 className="font-one-mobile-pop text-orange-primary text-shadow-white-4px text-5xl">
          메인학습
        </h1>
        <div className="w-[50px]" />
      </section>
      <StudyList />
    </>
  );
}
