import { END_POINT } from '@/shared/constant/apis.ts';

interface postUserChatProps {
  message: string;
}

export const postUserChat = async ({ message }: postUserChatProps) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  try {
    const res = await fetch(`${baseUrl}${END_POINT.POST_USER_CHAT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: message }),
    });

    if (!res.ok) {
      throw new Error('네트워크 응답에 문제가 있음');
    }

    return res.json();
  } catch (err) {
    console.error('오류 :', err);
  }
};
