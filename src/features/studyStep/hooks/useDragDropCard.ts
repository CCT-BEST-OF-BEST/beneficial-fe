import { useEffect, useState } from 'react';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { getStep2Problems } from '@/features/studyStep/api/getStep2Problems.ts';
import { postStep2Answer } from '@/features/studyStep/api/postStep2Answer.ts';

interface Problem {
  problem_id: number;
  sentence_part1: string;
  sentence_part2: string;
  correct_answer: string;
}

interface ProblemsData {
  problems: Problem[];
  answer_options: string[];
}

export interface AnswerCard {
  id: string;
  value: string;
}

export const useDragDropCard = () => {
  const [problems, setProblems] = useState<ProblemsData | null>(null);
  const [answerCards, setAnswerCards] = useState<AnswerCard[]>([]);
  const [droppedCards, setDroppedCards] = useState<Record<number, AnswerCard | null>>({});
  const [activeCard, setActiveCard] = useState<AnswerCard | null>(null);
  const [isAllCorrect, setIsAllCorrect] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await getStep2Problems();
        setProblems(data);
        setAnswerCards(
          data.answer_options.map((answer, index) => ({ id: `answer-${index}`, value: answer }))
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchProblems();
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const cardId = event.active.id as string;
    const card = answerCards.find(answerCard => answerCard.id === cardId);
    if (card) setActiveCard(card);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over) {
      const sentenceId = parseInt(over.id.toString().replace('blank-', ''));
      const cardId = active.id as string;
      const card = answerCards.find(answerCard => answerCard.id === cardId);

      if (card) {
        setDroppedCards(prev => {
          const next = { ...prev };

          Object.entries(next).forEach(([problemId, droppedCard]) => {
            if (droppedCard?.id === card.id) {
              delete next[Number(problemId)];
            }
          });

          next[sentenceId] = card;
          return next;
        });
      }
    }
    setActiveCard(null);
  };

  const handleRemoveCard = (sentenceId: number) => {
    setDroppedCards(prev => {
      const newState = { ...prev };
      delete newState[sentenceId];
      return newState;
    });
  };

  const handleCheckAnswers = async () => {
    if (!problems?.problems) return;

    try {
      setChecking(true);

      const results = await Promise.all(
        problems.problems.map(problem =>
          postStep2Answer({
            problemId: problem.problem_id,
            answer: droppedCards[problem.problem_id]?.value ?? '',
          })
        )
      );

      const correctedCards: Record<number, AnswerCard | null> = {};
      let correctCount = 0;

      results.forEach(result => {
        const submittedCard = droppedCards[result.problem_id];

        if (result.is_correct) {
          correctedCards[result.problem_id] = submittedCard;
          correctCount++;
        }
      });

      setDroppedCards(correctedCards);

      if (correctCount === problems.problems.length) {
        setIsAllCorrect(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setChecking(false);
    }
  };

  // 모든 문제에 답이 채워져 있는지 확인
  const isAllAnswered =
    problems?.problems?.every(
      problem =>
        droppedCards[problem.problem_id] !== undefined && droppedCards[problem.problem_id] !== null
    ) ?? false;

  const droppedCardIds = new Set(
    Object.values(droppedCards)
      .filter((card): card is AnswerCard => Boolean(card))
      .map(card => card.id)
  );
  const availableCards = answerCards.filter(card => !droppedCardIds.has(card.id));

  return {
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
  };
};
