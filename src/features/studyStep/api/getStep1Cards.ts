import { END_POINT } from '@/shared/constant/apis.ts';
import { apiFetch } from '@/shared/api/client.ts';

export interface CardContent {
  card_id: string;
  word: string;
  meaning: string;
  example_sentence: string;
  visual_hint: string | null;
  color_theme: string | null;
}

export interface Step1CardPair {
  pair_id: string;
  word1: string;
  word2: string;
  order: number;
  card1: CardContent;
  card2: CardContent;
}

interface Step1CardsResponse {
  success: boolean;
  total_pairs: number;
  card_pairs: Step1CardPair[];
}

export const getStep1Cards = async () => {
  return apiFetch<Step1CardsResponse>(END_POINT.GET_STEP1_CARDS);
};
