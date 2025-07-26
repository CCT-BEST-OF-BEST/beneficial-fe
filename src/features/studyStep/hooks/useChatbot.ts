import { useState } from 'react';
import { postUserChat } from '@/features/studyStep/api/postUserChat.ts';

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

export const useChatbot = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleSendMessage = async () => {
    if (message.trim() === '') {
      alert('전송할 메세지 입력해주세요.');
      return;
    }

    try {
      setMessages(prev => [...prev, { role: 'user', text: message }]);
      setMessage('');

      const result = await postUserChat({ message });
      if (result?.response) {
        setMessages(prev => [...prev, { role: 'bot', text: result.response }]);
      }

    } catch (err) {
      console.error(err);
    }
  };

  return { message, setMessage, handleSendMessage, messages };
};
