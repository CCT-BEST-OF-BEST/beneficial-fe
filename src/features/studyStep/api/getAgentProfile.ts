import { apiFetch } from '@/shared/api/client.ts';
import { END_POINT } from '@/shared/constant/apis.ts';

interface WeakConcept {
  concept_key: string;
  wrong_count: number;
  last_wrong_at: string;
  priority: number;
}

export interface AgentProfileResponse {
  user_id: string;
  weak_concepts: WeakConcept[];
}

export const getAgentProfile = async () => {
  return apiFetch<AgentProfileResponse>(END_POINT.GET_AGENT_PROFILE);
};
