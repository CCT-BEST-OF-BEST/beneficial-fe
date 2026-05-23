import { END_POINT } from '@/shared/constant/apis.ts';
import { apiFetch } from '@/shared/api/client.ts';

interface Step1CardPair {
  pair_id: string;
  word1: string;
  word2: string;
  order: number;
  card1: { card_id: string; front_image: string; back_image: string };
  card2: { card_id: string; front_image: string; back_image: string };
}

interface Step1CardsResponse {
  success: boolean;
  total_pairs: number;
  card_pairs: Step1CardPair[];
}

export const getStep1Cards = async () => {
  return apiFetch<Step1CardsResponse>(END_POINT.GET_STEP1_CARDS);
};
