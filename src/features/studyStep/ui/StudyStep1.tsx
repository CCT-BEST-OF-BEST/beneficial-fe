import { useFlipCard } from '@/features/studyStep/hooks/useFlipCard.ts';
import ArrowIcon from '@/assets/ArrowIcon.svg?react';
import Button from '@/shared/ui/Button.tsx';
import { cn } from '@/shared/lib/utils.ts';
import { BookOpen, Hand, Pencil, Star, Lightbulb, Check } from 'lucide-react';
import type { CardContent } from '@/features/studyStep/api/getStep1Cards.ts';

const ICON_MAP: Record<string, any> = {
  'book-open': BookOpen,
  'hand-point-up': Hand,
  'pencil': Pencil,
  'star': Star,
  'lightbulb': Lightbulb,
  'check': Check,
};

interface FlipCardProps {
  card: CardContent;
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
            card={currentPair.card1}
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
            card={currentPair.card2}
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

function FlipCard({ card, flipped, onFlip }: FlipCardProps) {
  const Icon = card.visual_hint && ICON_MAP[card.visual_hint] ? ICON_MAP[card.visual_hint] : BookOpen;
  
  const bgColorClass = card.color_theme === 'warning' ? 'bg-[#FFB14E]' : card.color_theme === 'success' ? 'bg-[#84BC46]' : 'bg-[#FFCE1F]';
  const textColorClass = card.color_theme === 'warning' ? 'text-orange-primary' : card.color_theme === 'success' ? 'text-green-primary' : 'text-[#FFCE1F]';

  return (
    <div className="h-[360px] w-[248px] cursor-pointer [perspective:1000px]" onClick={onFlip}>
      <div
        className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* Front */}
        <div className={cn("absolute flex flex-col items-center justify-center h-full w-full rounded-2xl [backface-visibility:hidden] p-6 shadow-md border-4 border-white", bgColorClass)}>
          <div className="bg-white p-4 rounded-full mb-6">
            <Icon size={48} className={textColorClass} />
          </div>
          <h2 className="typography-SB1 text-white text-3xl">{card.word}</h2>
        </div>
        
        {/* Back */}
        <div className="absolute flex flex-col items-center justify-center h-full w-full rounded-2xl bg-white [backface-visibility:hidden] [transform:rotateY(180deg)] p-6 shadow-md border-4 border-gray-200">
          <div className="mb-4 text-center">
            <h3 className={cn("typography-SB3 text-2xl mb-2", textColorClass)}>{card.word}</h3>
            <p className="typography-R4 text-gray-700">{card.meaning}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 w-full">
            <p className="typography-R5 text-gray-600 text-center">"{card.example_sentence}"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
