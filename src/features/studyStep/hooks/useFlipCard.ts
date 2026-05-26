import { useEffect, useState } from 'react';
import { getStep1Cards } from '@/features/studyStep/api/getStep1Cards.ts';
import {
  postStep1CardCheck,
  type Step1CardCheckResponse,
} from '@/features/studyStep/api/postStep1CardCheck.ts';
import type { Step1CardPair } from '@/features/studyStep/api/getStep1Cards.ts';

export const useFlipCard = () => {
  const [cards, setCards] = useState<{
    success: boolean;
    total_pairs: number;
    card_pairs: Step1CardPair[];
  } | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flippedStates, setFlippedStates] = useState<[boolean, boolean]>([true, true]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [checkResult, setCheckResult] = useState<Step1CardCheckResponse | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const data = await getStep1Cards();
        if (!data) return;
        setCards(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCards();
  }, []);

  const handleSelect = () => {
    if (!cards) return;
    setCurrentIndex(prev => (prev + 1) % cards.card_pairs.length);
    setFlippedStates([true, true]);
    setSelectedWord(null);
    setCheckResult(null);
  };

  const handleFlip = (index: 0 | 1) => {
    setFlippedStates(prev => {
      const copy: [boolean, boolean] = [...prev] as [boolean, boolean];
      copy[index] = !copy[index];
      return copy;
    });
  };

  const handleCheckCard = async (chosenWord: string) => {
    const currentPair = cards?.card_pairs[currentIndex];
    if (!currentPair || checking) return;

    try {
      setChecking(true);
      setSelectedWord(chosenWord);
      const result = await postStep1CardCheck({
        pairId: currentPair.pair_id,
        chosenWord,
      });
      setCheckResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setChecking(false);
    }
  };

  return {
    cards,
    currentPair: cards?.card_pairs[currentIndex],
    flippedStates,
    selectedWord,
    checkResult,
    checking,
    handleFlip,
    handleSelect,
    handleCheckCard,
  };
};
