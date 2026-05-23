import { DndContext, useDraggable, useDroppable, DragOverlay } from '@dnd-kit/core';
import { useDragDropCard } from '@/features/studyStep/hooks/useDragDropCard.ts';
import Button from '@/shared/ui/Button.tsx';
import { cn } from '@/shared/lib/utils.ts';
import Stamp from '@/assets/Stamp.png';
import type { AnswerCard } from '@/features/studyStep/hooks/useDragDropCard.ts';

interface CardProps {
  id: string;
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
}

interface SentenceProps {
  id: number;
  part1: string;
  part2: string;
  droppedCard: AnswerCard | null;
  onRemoveCard: (sentenceId: number) => void;
  disabled?: boolean;
}

interface Problem {
  problem_id: number;
  sentence_part1: string;
  sentence_part2: string;
  correct_answer: string;
}

export default function StudyStep2({ handleStepClick }: { handleStepClick: () => void }) {
  const {
    problems,
    availableCards,
    droppedCards,
    activeCard,
    isAllCorrect,
    isAllAnswered,
    checking,
    handleDragStart,
    handleDragEnd,
    handleRemoveCard,
    handleCheckAnswers,
  } = useDragDropCard();

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="mb-6 space-x-3">
        <span className="text-green-primary typography-SB2">01 ~ 08</span>
        <span className="typography-SB1">맞춤법에 맞는 낱말 카드를 선택하세요</span>
      </div>

      <div className="p-4.5 gap-y-4.5 mb-7 flex flex-wrap gap-x-10 rounded-sm bg-[#F9F9F9]">
        {availableCards.map(card => (
          <DraggableCard key={card.id} id={card.id} label={card.value} disabled={isAllCorrect}>
            {card.value}
          </DraggableCard>
        ))}
      </div>

      <ul className="h-[calc(100vh-575px)] space-y-7 overflow-auto">
        {problems?.problems?.map((problem: Problem) => (
          <Sentence
            key={problem.problem_id}
            id={problem.problem_id}
            part1={problem.sentence_part1}
            part2={problem.sentence_part2}
            droppedCard={droppedCards[problem.problem_id] ?? null}
            onRemoveCard={handleRemoveCard}
            disabled={isAllCorrect}
          />
        ))}
      </ul>

      {!isAllCorrect ? (
        <Button
          step={2}
          className="typography-SB3 bottom-30 right-35 absolute w-[130px] py-1.5"
          disabled={!isAllAnswered || checking}
          onClick={handleCheckAnswers}
        >
          {checking ? '확인 중' : '정답 확인하기'}
        </Button>
      ) : (
        <div className="bottom-30 right-35 absolute flex h-[200px] w-[200px] items-center justify-center">
          <img src={Stamp} alt="정답 스탬프" className="h-[200px] w-[200px]" />
        </div>
      )}

      <Button
        step={2}
        onClick={handleStepClick}
        disabled={!isAllCorrect}
        className="typography-SB5 right-25.5 absolute bottom-9 w-[150px]"
      >
        다음 단계
      </Button>

      <DragOverlay>
        {activeCard ? (
          <div className="border-green-primary typography-SB1 min-w-[140px] cursor-pointer rounded-lg border-2 bg-white py-2.5 text-center">
            {activeCard.value}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function DraggableCard({ id, label, children, disabled = false }: CardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled,
    data: {
      label,
    },
  });

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(disabled ? {} : listeners)}
      {...(disabled ? {} : attributes)}
      className={cn(
        'border-green-primary typography-SB1 min-w-[140px] rounded-lg border-2 bg-white py-2.5 text-center',
        disabled ? 'cursor-default' : 'cursor-pointer'
      )}
    >
      {children}
    </div>
  );
}

function Sentence({ id, part1, part2, droppedCard, onRemoveCard, disabled = false }: SentenceProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `blank-${id}`,
    disabled,
  });

  const cardClass =
    'border-green-primary typography-SB1 min-w-[140px] border-2 bg-white py-2.5 cursor-pointer';

  const handleRemoveCard = () => {
    if (droppedCard && !disabled) {
      onRemoveCard(id);
    }
  };

  return (
    <li className="flex items-center gap-4">
      <span className="typography-M2">({id})</span>
      <span className="typography-M1">{part1}</span>
      <div
        ref={setNodeRef}
        className={cn(
          'typography-SB1 min-w-[140px] rounded-lg py-3 text-center',
          droppedCard
            ? cn(cardClass, disabled && 'cursor-default')
            : isOver && !disabled
              ? 'bg-green-100'
              : 'bg-[#F9F9F9]'
        )}
        onClick={droppedCard && !disabled ? handleRemoveCard : undefined}
      >
        {droppedCard?.value ?? <span className="text-[#D9D9D9]">?</span>}
      </div>
      <span className="typography-M1">{part2}</span>
    </li>
  );
}
