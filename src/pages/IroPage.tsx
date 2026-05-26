import Logo from '@/assets/Logo.png';
import ChatSendIcon from '@/assets/ChatSendIcon.svg?react';
import HomeButton from '@/shared/ui/HomeButton.tsx';
import AuthStatusButton from '@/features/auth/ui/AuthStatusButton.tsx';
import { useChatbot } from '@/features/studyStep/hooks/useChatbot.ts';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { AgentAction } from '@/features/studyStep/api/postAgentChat.ts';

const agentActionMeta: Record<AgentAction, { label: string; bubbleClass: string }> = {
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

export default function IroPage() {
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
    <>
      <section className="mb-16 flex justify-between">
        <HomeButton color="sky" />
        <div className="font-one-mobile-pop relative inline-block text-5xl">
          <span
            aria-hidden
            className="absolute left-0 top-0 z-0 text-white"
            style={{ WebkitTextStroke: '8px white' }}
          >
            이로에게 물어보기
          </span>
          <h1 className="text-orange-primary relative">이로에게 물어보기</h1>
        </div>
        <AuthStatusButton />
      </section>

      <section className="flex flex-1 flex-col rounded-2xl bg-white px-11 pt-10 pb-8">
        {/* 헤더 */}
        <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <img src={Logo} className="h-[28px] w-[42px]" alt="이로" />
            <span className="typography-SB3 text-orange-primary">이로</span>
          </div>
          {isLoggedIn && hasSession && (
            <button
              onClick={handleClearSession}
              className="typography-R2 text-gray-3 hover:text-gray-5 underline"
            >
              대화 초기화
            </button>
          )}
        </div>

        {/* 약점 힌트 배너 */}
        {isLoggedIn && weakConcepts.length > 0 && (
          <div className="border-gray-1 mb-4 rounded-xl border bg-[#FFFDF7] px-5 py-4">
            <p className="typography-M4 text-gray-3 mb-2">헷갈리는 맞춤법</p>
            <div className="flex flex-wrap gap-2">
              {weakConcepts.slice(0, 5).map(concept => (
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

        {/* 메시지 목록 */}
        <div className="flex-1 space-y-4 overflow-auto whitespace-pre-line h-[calc(100vh-500px)]">
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
                    <img src={Logo} alt="이로" className="h-[16px] w-[24px]" />
                  </div>
                )}
                <div className="flex max-w-[60%] flex-col gap-1">
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
                <img src={Logo} alt="이로" className="h-[16px] w-[24px]" />
              </div>
              <div className="border-orange-primary text-gray-4 typography-R2 max-w-[60%] rounded-3xl rounded-tl-none border bg-[#FFF8E5] px-5 py-4">
                <span className="animate-pulse">답변을 작성 중이에요...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 입력창 */}
        <div className="mt-6 flex gap-3 border-t border-gray-100 pt-4">
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
            className="typography-R3 text-gray-5 border-gray-2 focus:border-orange-primary flex-1 rounded-xl border px-5 py-3 focus:outline-none"
          />
          {isLoggedIn ? (
            <button
              onClick={handleSendMessage}
              disabled={message.trim() === ''}
              className="text-orange-primary border-orange-primary disabled:text-gray-2 disabled:border-gray-2 rounded-xl border bg-white px-4 py-3 focus:outline-none"
            >
              <ChatSendIcon />
            </button>
          ) : (
            <Link
              to="/auth/login"
              className="text-orange-primary border-orange-primary typography-SB5 rounded-xl border bg-white px-5 py-3 focus:outline-none"
            >
              로그인
            </Link>
          )}
        </div>
      </section>
    </>
  );
}
