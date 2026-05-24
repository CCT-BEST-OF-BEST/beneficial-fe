import * as Popover from '@radix-ui/react-popover';
import Logo from '@/assets/Logo.png';
import ChatSendIcon from '@/assets/ChatSendIcon.svg?react';
import { useChatbot } from '@/features/studyStep/hooks/useChatbot.ts';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { AgentAction } from '@/features/studyStep/api/postAgentChat.ts';

const agentActionMeta: Record<
  AgentAction,
  { label: string; bubbleClass: string }
> = {
  proactive_hint: {
    label: '💡 약점 힌트',
    bubbleClass: 'border-orange-primary bg-[#FFF3D8] text-gray-4',
  },
  encourage: {
    label: '🌟 잘하고 있어요',
    bubbleClass: 'border-sky-primary bg-[#EEF8FF] text-gray-4',
  },
  ask_followup: {
    label: '❓ 이로의 질문',
    bubbleClass: 'border-gray-2 bg-[#F9F9F9] text-gray-4',
  },
  answer_with_rag: {
    label: '',
    bubbleClass: 'border-orange-primary bg-[#FFF8E5] text-gray-4',
  },
  small_talk: {
    label: '',
    bubbleClass: 'border-orange-primary bg-[#FFF8E5] text-gray-4',
  },
};

export default function ChatbotPopover() {
  const {
    messages,
    message,
    loading,
    weakConcepts,
    isLoggedIn,
    hasSession,
    setMessage,
    handleSendMessage,
    handleClearSession,
  } = useChatbot();

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
          {/* 헤더 */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={Logo} className="h-[16px] w-[24px]" alt="이로" />
              <span className="typography-SB6 text-orange-primary">이로</span>
            </div>
            {isLoggedIn && hasSession && (
              <button
                onClick={handleClearSession}
                className="typography-R1 text-gray-3 hover:text-gray-5 underline"
              >
                대화 초기화
              </button>
            )}
          </div>

          <div className="h-[360px] space-y-4 overflow-auto whitespace-pre-line">
            {isLoggedIn && weakConcepts.length > 0 && (
              <div className="border-gray-1 rounded-xl border bg-[#FFFDF7] px-4 py-3">
                <p className="typography-M4 text-gray-3 mb-2">헷갈리는 맞춤법</p>
                <div className="flex flex-wrap gap-2">
                  {weakConcepts.slice(0, 3).map(concept => (
                    <span
                      key={concept}
                      className="typography-SB6 text-orange-primary rounded-full bg-[#FFF3D8] px-3 py-1"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, idx) => {
              const meta =
                msg.role === 'bot' && msg.agentAction
                  ? agentActionMeta[msg.agentAction]
                  : null;
              const bubbleClass =
                msg.role === 'bot'
                  ? (meta?.bubbleClass ?? 'border-orange-primary bg-[#FFF8E5] text-gray-4')
                  : 'border-gray-2 text-gray-5 bg-white rounded-tr-none';

              return (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start gap-3'}`}
                >
                  {msg.role === 'bot' && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center">
                      <img src={Logo} alt="Bot" className="h-[16px] w-[24px]" />
                    </div>
                  )}
                  <div className="flex max-w-[70%] flex-col gap-1">
                    {msg.role === 'bot' && meta?.label && (
                      <span className="typography-R1 text-orange-primary">{meta.label}</span>
                    )}
                    <div
                      className={`typography-R2 rounded-3xl border px-5 py-4 ${bubbleClass} ${
                        msg.role === 'bot' ? 'rounded-tl-none' : 'rounded-tr-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center">
                  <img src={Logo} alt="Bot" className="h-[16px] w-[24px]" />
                </div>
                <div className="border-orange-primary text-gray-4 typography-R2 max-w-[70%] rounded-3xl rounded-tl-none border bg-[#FFF8E5] px-5 py-4">
                  <span className="animate-pulse">답변을 작성 중이에요...</span>
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
              placeholder={isLoggedIn ? '이로에게 질문해봐요!' : '로그인 후 이용할 수 있어요'}
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
