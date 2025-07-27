import { useEffect, useState } from 'react';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { getStep2Problems } from '@/features/studyStep/api/getStep2Problems.ts';

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

export const useDragDropCard = () => {
  const [problems, setProblems] = useState<ProblemsData | null>(null);
  const [droppedCards, setDroppedCards] = useState<Record<number, string | null>>({});
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [isAllCorrect, setIsAllCorrect] = useState(false);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await getStep2Problems();
        setProblems(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProblems();
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveCard(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over) {
      const sentenceId = parseInt(over.id.toString().replace('blank-', ''));
      const cardId = active.id as string;
      setDroppedCards(prev => ({ ...prev, [sentenceId]: cardId }));
    }
    setActiveCard(null);
  };

  const handleRemoveCard = (sentenceId: number, cardId: string | null) => {
    if (cardId === null) {
      setDroppedCards(prev => {
        const newState = { ...prev };
        delete newState[sentenceId];
        return newState;
      });
    } else {
      setDroppedCards(prev => ({ ...prev, [sentenceId]: cardId }));
    }
  };

  const handleCheckAnswers = () => {
    if (!problems?.problems) return;

    const correctedCards: Record<number, string | null> = {};
    let correctCount = 0;

    problems.problems.forEach(problem => {
      const userAnswer = droppedCards[problem.problem_id];
      const correctAnswer = problem.correct_answer;

      // 정답이 맞으면 그대로 유지, 틀리면 제거
      if (userAnswer === correctAnswer) {
        correctedCards[problem.problem_id] = userAnswer;
        correctCount++;
      }
      // 틀린 답이거나 답이 없으면 제거 (null로 설정하지 않음)
    });

    setDroppedCards(correctedCards);

    // 모든 답이 정답인지 확인
    if (correctCount === problems.problems.length) {
      setIsAllCorrect(true);
    }
  };

  // 모든 문제에 답이 채워져 있는지 확인
  const isAllAnswered =
    problems?.problems?.every(
      problem =>
        droppedCards[problem.problem_id] !== undefined && droppedCards[problem.problem_id] !== null
    ) ?? false;

  return {
    problems,
    droppedCards,
    activeCard,
    isAllCorrect,
    isAllAnswered,
    handleDragStart,
    handleDragEnd,
    handleRemoveCard,
    handleCheckAnswers,
  };
};
