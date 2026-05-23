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

export const useDragDropCard = () => {
  const [problems, setProblems] = useState<ProblemsData | null>(null);
  const [droppedCards, setDroppedCards] = useState<Record<number, string | null>>({});
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [isAllCorrect, setIsAllCorrect] = useState(false);
  const [checking, setChecking] = useState(false);

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

  const handleCheckAnswers = async () => {
    if (!problems?.problems) return;

    try {
      setChecking(true);

      const results = await Promise.all(
        problems.problems.map(problem =>
          postStep2Answer({
            problemId: problem.problem_id,
            answer: droppedCards[problem.problem_id] ?? '',
          })
        )
      );

      const correctedCards: Record<number, string | null> = {};
      let correctCount = 0;

      results.forEach(result => {
        if (result.is_correct) {
          correctedCards[result.problem_id] = result.user_answer;
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

  return {
    problems,
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
