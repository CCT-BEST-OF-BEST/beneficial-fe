import { apiFetch } from '@/shared/api/client.ts';
import { END_POINT } from '@/shared/constant/apis.ts';

export type AgentAction =
  | 'answer_with_rag'
  | 'proactive_hint'
  | 'encourage'
  | 'small_talk'
  | 'ask_followup';

interface PostAgentChatProps {
  sessionId: string | null;
  message: string;
}

export interface AgentChatResponse {
  session_id: string;
  response: string;
  agent_action: AgentAction;
  target_concept: string | null;
  used_tools: string[];
  weak_concepts: string[];
}

export const postAgentChat = async ({ sessionId, message }: PostAgentChatProps) => {
  return apiFetch<AgentChatResponse>(END_POINT.POST_AGENT_CHAT, {
    method: 'POST',
    body: JSON.stringify({
      session_id: sessionId,
      message,
    }),
  });
};
