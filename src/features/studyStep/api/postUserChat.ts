import { END_POINT } from '@/shared/constant/apis.ts';
import { apiFetch } from '@/shared/api/client.ts';

interface postUserChatProps {
  message: string;
}

export interface UserChatResponse {
  status: string;
  prompt: string;
  response: string;
  collection_used: string;
  top_k: number;
}

export const postUserChat = async ({ message }: postUserChatProps) => {
  return apiFetch<UserChatResponse>(END_POINT.POST_USER_CHAT, {
    method: 'POST',
    body: JSON.stringify({ prompt: message }),
  });
};
