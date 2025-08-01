import { Link } from 'react-router-dom';
import AirplaneImg from "@/assets/AirplaneImg.svg?react"
import CharacterImg from "@/assets/CharacterImg.svg?react"

export default function Home() {
  return (
    <>
      <section className="mb-16">
        <h2 className="typography-SB5 mb-6 inline-block rounded-full bg-white px-5 py-3 text-[#8B8B8B]">
          <span className="] font-bold">3학년 성지훈</span>{' '}
          <span className="font-light">| 소담 다함께 돌봄센터</span>
        </h2>
        <div className="font-one-mobile-pop relative w-full  text-center text-[60px]">
          <div
            aria-hidden
            className="absolute left-0 top-0 z-0 text-white w-full"
            style={{
              WebkitTextStroke: '8px white',
            }}
          >
            이로운 한글
          </div>
          <h1 className="text-orange-primary relative z-10">이로운 한글</h1>
        </div>
      </section>

      <section className="gap-y-7.5 grid flex-1 grid-cols-[55%_44%] grid-rows-2 gap-x-10">
        <Link to={'/study'} className="overflow-hidden relative row-span-2 flex flex-col rounded-xl bg-[#FFB14E] px-7 py-6">
          <AirplaneImg className="absolute -left-7 top-0 w-full"/>
          <CharacterImg className="absolute right-0 bottom-13 z-0" />
          <div className="mb-5 ml-5 mt-auto text-left relative z-10">
            <h3 className="typography-SB4 mb-1 text-white">메인학습</h3>
            <p className="typography-R5 text-white">오늘 배울 내용, 같이 보러 가볼까요?</p>
          </div>
          <h4 className="typography-SB5 text-orange-primary w-full rounded-full bg-white py-3 text-center">
            바로가기
          </h4>
        </Link>
        <button className="row-span-1 flex-col justify-between rounded-xl bg-[#CCE997] px-7 py-6">
          <div className="text-left">
            <h3 className="typography-SB4 mb-1 text-white">독서활동</h3>
            <p className="typography-R5 text-white">나만의 도서관, 독서 통장을 쌓아요!</p>
          </div>
          <h4 className="typography-SB3 ml-auto w-[126px] rounded-full bg-white py-3 text-center text-[#84BC46]">
            바로가기
          </h4>
        </button>
        <button className="row-span-1 flex-col justify-between rounded-xl bg-[#FFE670] px-7 py-6">
          <div className="text-left">
            <h3 className="typography-SB4 mb-1 text-white">맞춤법 카드 책장</h3>
            <p className="typography-R5 text-white">학습한 맞춤법을 카드로 모아 내 책장으로!</p>
          </div>
          <h4 className="typography-SB3 ml-auto w-[126px] rounded-full bg-white py-3 text-center text-[#FFCE1F]">
            바로가기
          </h4>
        </button>
      </section>
    </>
  );
}
