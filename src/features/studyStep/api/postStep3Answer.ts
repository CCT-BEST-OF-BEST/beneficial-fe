import { END_POINT } from '@/shared/constant/apis.ts';

interface postStep3AnswerProps {
  problem_id: number;
  answer: string;
}

export const postStep3Answer = async ({ problem_id, answer }: postStep3AnswerProps) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  try {
    const res = await fetch(`${baseUrl}${END_POINT.POST_STEP3_ANSWER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        problem_id: problem_id,
        user_answer: answer,
      }),
    });

    if (!res.ok) {
      throw new Error('네트워크 응답에 문제가 있음');
    }

    return res.json();
  } catch (err) {
    console.error('오류 :', err);
  }
};
