import { apiFetch } from '@/shared/api/client.ts';

export const deleteAgentSession = async (sessionId: string) => {
  return apiFetch(`/agent/session/${sessionId}`, {
    method: 'DELETE',
  });
};
