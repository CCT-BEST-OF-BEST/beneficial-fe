import * as HoverCard from '@radix-ui/react-hover-card';
import InfoIcon from '@/assets/InfoIcon.svg?react';
import ReviewImg from '@/assets/ReviewImg.png';

export default function ReviewPopup() {
  return (
    <HoverCard.Root openDelay={100} closeDelay={100}>
      <HoverCard.Trigger asChild>
        <button>
          <InfoIcon />
        </button>
      </HoverCard.Trigger>

      <HoverCard.Portal>
        <HoverCard.Content
          side="left"
          align="start"
          sideOffset={16}
          className="w-[400px] rounded-2xl bg-white px-7 py-6 shadow-xl"
        >
          <div>
            <h4 className="typography-SB1 text-green-primary">이로운 한글 복습 주기</h4>
            <p className="typography-R4">
              이로운 한글은 맞춤법 어휘를 망각곡선에 기반해 적절한 복습 주기에 따라 복습시켜드려요
            </p>
            <img src={ReviewImg} alt={'reviewImg'} className="my-3 h-[224px] w-[380px]" />
            <ul className="typography-R2 ml-4 list-disc">
              <li>복습 어휘는 지난 차시의 어휘 정답여부와 상관없이 복습 주기에 따라 등장해요</li>
              <li>
                재도전 어휘는 지난 차시와 본 차시에 에 오답 처리된 어휘를 포함하여 복습 주기에 따라
                등장해요
              </li>
            </ul>
          </div>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
