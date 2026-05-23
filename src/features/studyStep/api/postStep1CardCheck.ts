import { apiFetch } from '@/shared/api/client.ts';
import { END_POINT } from '@/shared/constant/apis.ts';

interface PostStep1CardCheckProps {
  pairId: string;
  chosenWord: string;
}

export interface Step1CardCheckResponse {
  pair_id: string;
  is_correct: boolean;
  chosen_word: string;
  correct_word: string;
  concept_key: string;
}

export const postStep1CardCheck = async ({ pairId, chosenWord }: PostStep1CardCheckProps) => {
  return apiFetch<Step1CardCheckResponse>(END_POINT.POST_STEP1_CARD_CHECK, {
    method: 'POST',
    body: JSON.stringify({
      pair_id: pairId,
      chosen_word: chosenWord,
    }),
  });
};
