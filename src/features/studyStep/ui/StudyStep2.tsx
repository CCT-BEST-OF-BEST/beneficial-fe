import type { ReactNode } from 'react';
import Button from '@/shared/ui/Button.tsx';

interface CardProps {
  children: ReactNode;
}

interface SentenceProps {}

export default function StudyStep2() {
  return (
    <>
      <div className="mb-6 space-x-3">
        <span className="text-green-primary typography-SB2">01 ~ 08</span>
        <span className="typography-SB1">맞춤법에 맞는 낱말 카드를 선택하세요</span>
      </div>
      <div className="p-4.5 gap-y-4.5 mb-7 flex flex-wrap gap-x-10 rounded-sm bg-[#F9F9F9]">
        <Card>가르쳐</Card>
        <Card>맞힐</Card>
        <Card>바라는</Card>
        <Card>가르켰</Card>
        <Card>가르쳐</Card>
        <Card>맞힐</Card>
        <Card>바라는</Card>
        <Card>가르켰</Card>
      </div>
      <ul className="h-[calc(100vh-575px)] space-y-7 overflow-auto">
        <Sentence />
        <Sentence />
        <Sentence />
        <Sentence />
        <Sentence />
        <Sentence />
      </ul>
      <Button
        step={2}
        className="typography-SB3 absolute bottom-7 right-11 w-[130px] py-1.5"
        disabled={true}
      >
        정답 확인하기
      </Button>
    </>
  );
}

function Card({ children }: CardProps) {
  return (
    <div className="border-green-primary typography-SB1 min-w-[140px] rounded-lg border-2 bg-white py-3 text-center">
      {children}
    </div>
  );
}

function Sentence() {
  return (
    <li className="flex items-center gap-4">
      <span className="typography-M2">(1)</span>
      <span className="typography-M1">왜 화가 났는지</span>
      <div className="typography-SB1 min-w-[120px] rounded-lg bg-[#F9F9F9] py-3 text-center text-[#D9D9D9]">
        ?
      </div>
      <span className="typography-M1">줘</span>
    </li>
  );
}
