import { END_POINT } from '@/shared/constant/apis.ts';

export const getStep3NextProblem = async () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  try {
    const res = await fetch(`${baseUrl}${END_POINT.GET_STEP3_NEXT_PROBLEM}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error('네트워크 응답에 문제가 있음');
    }

    return res.json();
  } catch (err) {
    console.error('오류 :', err);
  }
};
