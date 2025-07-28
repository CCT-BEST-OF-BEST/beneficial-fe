import { useFlipCard } from '@/features/studyStep/hooks/useFlipCard.ts';
import ArrowIcon from '@/assets/ArrowIcon.svg?react';
import Button from '@/shared/ui/Button.tsx';

interface FlipCardProps {
  front: string;
  back: string;
  flipped: boolean;
  onFlip: () => void;
}

export default function StudyStep1({ handleStepClick }: { handleStepClick: () => void }) {
  const { cards, currentPair, flippedStates, handleFlip, handleSelect } = useFlipCard();

  if (!cards || !currentPair) return <div>로딩 중...</div>;

  return (
    <>
      <div className="flex items-center justify-around">
        <button onClick={handleSelect}>
          <ArrowIcon className="text-gray-2" />
        </button>

        <FlipCard
          front={currentPair.card1.front_image}
          back={currentPair.card1.back_image}
          flipped={flippedStates[0]}
          onFlip={() => handleFlip(0)}
        />

        <div className="text-gray-3 text-[40px] font-medium">VS</div>

        <FlipCard
          front={currentPair.card2.front_image}
          back={currentPair.card2.back_image}
          flipped={flippedStates[1]}
          onFlip={() => handleFlip(1)}
        />

        <button onClick={handleSelect}>
          <ArrowIcon className="text-gray-2 scale-x-[-1]" />
        </button>
      </div>
      <h3 className="typography-SB1 text-gray-2 mt-11 mb-4 text-center">
        카드를 뒤집어서 어휘를 확인해보세요.
      </h3>
      <Button
        onClick={handleStepClick}
        step={1}
        className="typography-SB5 right-25.5 absolute bottom-9 w-[150px]"
      >
        다음 단계
      </Button>
    </>
  );
}

function FlipCard({ front, back, flipped, onFlip }: FlipCardProps) {
  return (
    <div className="h-[360px] w-[248px] cursor-pointer [perspective:1000px]" onClick={onFlip}>
      <div
        className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        <img
          src={front}
          alt="front"
          className="absolute h-full w-full rounded-md [backface-visibility:hidden]"
        />
        <img
          src={back}
          alt="back"
          className="absolute h-full w-full rounded-md [backface-visibility:hidden] [transform:rotateY(180deg)]"
        />
      </div>
    </div>
  );
}
