import { useEffect, useState } from 'react';
import { postAgentChat } from '@/features/studyStep/api/postAgentChat.ts';
import type { AgentAction } from '@/features/studyStep/api/postAgentChat.ts';
import { deleteAgentSession } from '@/features/studyStep/api/deleteAgentSession.ts';
import { useAuth } from '@/features/auth/model/AuthContext.tsx';
import { getAgentProfile } from '@/features/studyStep/api/getAgentProfile.ts';

const INITIAL_MESSAGE = {
  role: 'bot' as const,
  text: '안녕~ 나는 "이로"야! \n궁금한 게 생겨서 나 찾은 거 맞지? \n무슨 질문이든 언제든지, 이로가 척척 알려줄게!',
  agentAction: undefined as AgentAction | undefined,
};

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
  agentAction?: AgentAction;
}

export const useChatbot = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const [weakConcepts, setWeakConcepts] = useState<string[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setWeakConcepts([]);
        return;
      }

      try {
        const profile = await getAgentProfile();
        setWeakConcepts(profile.weak_concepts.map(concept => concept.concept_key));
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSendMessage = async () => {
    if (!user) {
      setMessages(prev => [
        ...prev,
        {
          role: 'bot',
          text: '로그인하면 이로가 학습 기록을 보고 더 잘 도와줄 수 있어!',
        },
      ]);
      return;
    }

    if (message.trim() === '') {
      alert('전송할 메세지 입력해주세요.');
      return;
    }

    try {
      setMessages(prev => [...prev, { role: 'user', text: message }]);
      setMessage('');
      setLoading(true);

      const result = await postAgentChat({ sessionId, message });
      setSessionId(result.session_id);
      if (result.weak_concepts.length > 0) {
        setWeakConcepts(result.weak_concepts);
      }
      setMessages(prev => [
        ...prev,
        { role: 'bot', text: result.response, agentAction: result.agent_action },
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: 'bot',
          text: '지금은 답변을 가져오지 못했어. 잠시 후 다시 물어봐줘!',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSession = async () => {
    if (sessionId) {
      try {
        await deleteAgentSession(sessionId);
      } catch {
        // 삭제 실패해도 로컬 초기화는 진행
      }
    }
    setSessionId(null);
    setMessages([INITIAL_MESSAGE]);
  };

  return {
    message,
    setMessage,
    handleSendMessage,
    handleClearSession,
    messages,
    loading,
    weakConcepts,
    isLoggedIn: Boolean(user),
    hasSession: Boolean(sessionId),
  };
};
