import { useEffect, useState } from 'react';
import { getStep1Cards } from '@/features/studyStep/api/getStep1Cards.ts';

const getImageUrl = (path: string) => {
  const filename = path.split('/').pop();
  return `${import.meta.env.VITE_API_BASE_URL}/learning/images/${filename}`;
};

interface CardPair {
  pair_id: string;
  word1: string;
  word2: string;
  order: number;
  card1: { card_id: string; front_image: string; back_image: string };
  card2: { card_id: string; front_image: string; back_image: string };
}

export const useFlipCard = () => {
  const [cards, setCards] = useState<{
    success: boolean;
    total_pairs: number;
    card_pairs: CardPair[];
  } | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flippedStates, setFlippedStates] = useState<[boolean, boolean]>([true, true]);

  // 카드 API 요청
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const data = await getStep1Cards();
        if (!data) return;

        const transformedPairs = data.card_pairs.map((pair: CardPair) => ({
          ...pair,
          card1: {
            ...pair.card1,
            front_image: getImageUrl(pair.card1.front_image),
            back_image: getImageUrl(pair.card1.back_image),
          },
          card2: {
            ...pair.card2,
            front_image: getImageUrl(pair.card2.front_image),
            back_image: getImageUrl(pair.card2.back_image),
          },
        }));

        setCards({
          ...data,
          card_pairs: transformedPairs,
        });
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
  };

  const handleFlip = (index: 0 | 1) => {
    setFlippedStates(prev => {
      const copy: [boolean, boolean] = [...prev] as [boolean, boolean];
      copy[index] = !copy[index];
      return copy;
    });
  };

  return {
    cards,
    currentPair: cards?.card_pairs[currentIndex],
    flippedStates,
    handleFlip,
    handleSelect,
  };
};
