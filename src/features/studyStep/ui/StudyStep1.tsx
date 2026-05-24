import { useFlipCard } from '@/features/studyStep/hooks/useFlipCard.ts';
import ArrowIcon from '@/assets/ArrowIcon.svg?react';
import Button from '@/shared/ui/Button.tsx';
import { cn } from '@/shared/lib/utils.ts';
import { useAuthenticatedImage } from '@/shared/api/useAuthenticatedImage.ts';

interface FlipCardProps {
  front: string;
  back: string;
  flipped: boolean;
  onFlip: () => void;
}

export default function StudyStep1({ handleStepClick }: { handleStepClick: () => void }) {
  const {
    cards,
    currentPair,
    flippedStates,
    selectedWord,
    checkResult,
    checking,
    handleFlip,
    handleSelect,
    handleCheckCard,
  } = useFlipCard();

  if (!cards || !currentPair) return <div>로딩 중...</div>;

  return (
    <>
      <div className="flex items-center justify-around">
        <button onClick={handleSelect}>
          <ArrowIcon className="text-gray-2" />
        </button>

        <div className="flex flex-col items-center gap-5">
          <FlipCard
            front={currentPair.card1.front_image}
            back={currentPair.card1.back_image}
            flipped={flippedStates[0]}
            onFlip={() => handleFlip(0)}
          />
          <ChoiceButton
            word={currentPair.word1}
            selectedWord={selectedWord}
            checking={checking}
            isCorrect={checkResult?.correct_word === currentPair.word1}
            onClick={() => handleCheckCard(currentPair.word1)}
          />
        </div>

        <div className="text-gray-3 text-[40px] font-medium">VS</div>

        <div className="flex flex-col items-center gap-5">
          <FlipCard
            front={currentPair.card2.front_image}
            back={currentPair.card2.back_image}
            flipped={flippedStates[1]}
            onFlip={() => handleFlip(1)}
          />
          <ChoiceButton
            word={currentPair.word2}
            selectedWord={selectedWord}
            checking={checking}
            isCorrect={checkResult?.correct_word === currentPair.word2}
            onClick={() => handleCheckCard(currentPair.word2)}
          />
        </div>

        <button onClick={handleSelect}>
          <ArrowIcon className="text-gray-2 scale-x-[-1]" />
        </button>
      </div>
      <div className="mt-8 text-center">
        <h3 className="typography-SB1 text-gray-2">
          카드를 뒤집어서 어휘를 확인하고, 맞는 낱말을 골라보세요.
        </h3>
        {checkResult && (
          <p
            className={cn(
              'typography-SB3 mt-3',
              checkResult.is_correct ? 'text-sky-primary' : 'text-red-primary'
            )}
          >
            {checkResult.is_correct
              ? '잘 골랐어요!'
              : `정답은 ${checkResult.correct_word}예요.`}
          </p>
        )}
      </div>
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

interface ChoiceButtonProps {
  word: string;
  selectedWord: string | null;
  checking: boolean;
  isCorrect: boolean;
  onClick: () => void;
}

function ChoiceButton({ word, selectedWord, checking, isCorrect, onClick }: ChoiceButtonProps) {
  const isSelected = selectedWord === word;

  return (
    <button
      onClick={onClick}
      disabled={checking}
      className={cn(
        'typography-SB3 border-sky-primary min-w-[128px] justify-center rounded-full border-2 bg-white px-5 py-2 text-sky-primary',
        isSelected && 'bg-sky-primary text-white',
        isCorrect && 'border-green-primary bg-green-primary text-white'
      )}
    >
      {checking && isSelected ? '확인 중' : word}
    </button>
  );
}

function FlipCard({ front, back, flipped, onFlip }: FlipCardProps) {
  const { src: frontSrc } = useAuthenticatedImage(front);
  const { src: backSrc } = useAuthenticatedImage(back);

  return (
    <div className="h-[360px] w-[248px] cursor-pointer [perspective:1000px]" onClick={onFlip}>
      <div
        className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {frontSrc ? (
          <img
            src={frontSrc}
            alt="front"
            className="absolute h-full w-full rounded-md [backface-visibility:hidden]"
          />
        ) : (
          <div className="absolute h-full w-full rounded-md bg-gray-1 [backface-visibility:hidden]" />
        )}
        {backSrc ? (
          <img
            src={backSrc}
            alt="back"
            className="absolute h-full w-full rounded-md [backface-visibility:hidden] [transform:rotateY(180deg)]"
          />
        ) : (
          <div className="absolute h-full w-full rounded-md bg-gray-1 [backface-visibility:hidden] [transform:rotateY(180deg)]" />
        )}
      </div>
    </div>
  );
}
