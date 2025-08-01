import { useState } from 'react';
import { postUserChat } from '@/features/studyStep/api/postUserChat.ts';

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

export const useChatbot = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'bot',
      text: '안녕~ 나는 “이로”야! \n궁금한 게 생겨서 나 찾은 거 맞지? \n무슨 질문이든 언제든지, 이로가 척척 알려줄게!',
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (message.trim() === '') {
      alert('전송할 메세지 입력해주세요.');
      return;
    }

    try {
      setMessages(prev => [...prev, { role: 'user', text: message }]);
      setMessage('');
      setLoading(true);

      const result = await postUserChat({ message });
      if (result?.response) {
        setMessages(prev => [...prev, { role: 'bot', text: result.response }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { message, setMessage, handleSendMessage, messages, loading };
};
