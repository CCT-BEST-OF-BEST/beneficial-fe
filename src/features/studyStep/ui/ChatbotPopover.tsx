import * as Popover from '@radix-ui/react-popover';
import Logo from '@/assets/Logo.png';
import ChatSendIcon from '@/assets/ChatSendIcon.svg?react';
import { useChatbot } from '@/features/studyStep/hooks/useChatbot.ts';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function ChatbotPopover() {
  const { messages, message, loading, isLoggedIn, setMessage, handleSendMessage } = useChatbot();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="items-center justify-center rounded-lg bg-white px-1 shadow">
          <img src={Logo} className="h-[27px] w-[41px]" alt={'Logo'} />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="right"
          align="start"
          sideOffset={16}
          className="z-50 h-[500px] w-[400px] rounded-xl bg-white p-6 shadow-lg"
        >
          <div className="h-[400px] space-y-4 overflow-auto whitespace-pre-line">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start gap-3'}`}
              >
                {msg.role === 'bot' && (
                  <div className="flex h-9 w-9 items-center justify-center">
                    <img src={Logo} alt="Bot" className="h-[16px] w-[24px]" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] rounded-3xl px-5 py-4 ${
                    msg.role === 'user'
                      ? 'border-gray-2 text-gray-5 typography-R2 rounded-tr-none border bg-white'
                      : 'border-orange-primary text-gray-4 typography-R2 rounded-tl-none border bg-[#FFF8E5]'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center">
                  <img src={Logo} alt="Bot" className="h-[16px] w-[24px]" />
                </div>
                <div className="border-orange-primary text-gray-4 typography-R2 max-w-[70%] rounded-3xl rounded-tl-none border bg-[#FFF8E5] px-5 py-4">
                  답변을 작성 중이에요...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="mt-4 flex gap-2">
            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={!isLoggedIn}
              placeholder={isLoggedIn ? '' : '로그인 후 이용할 수 있어요'}
              className="typography-R2 text-gray-5 border-gray-2 focus:border-orange-primary flex-1 rounded-lg border px-5 py-2 focus:outline-none"
            />
            {isLoggedIn ? (
              <button
                onClick={handleSendMessage}
                disabled={message.trim() === ''}
                className="text-orange-primary border-orange-primary disabled:text-gray-2 disabled:border-gray-2 rounded-lg border bg-white p-2 focus:outline-none"
              >
                <ChatSendIcon />
              </button>
            ) : (
              <Link
                to="/auth/login"
                className="text-orange-primary border-orange-primary typography-SB6 rounded-lg border bg-white px-3 py-2 focus:outline-none"
              >
                로그인
              </Link>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
