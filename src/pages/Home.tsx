import { Link } from 'react-router-dom';
import Logo from '@/assets/Logo.png';

export default function Home() {
  return (
    <>
      <section className="mb-12 flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-orange-primary typography-SB5 inline-block rounded-full bg-white px-5 py-3">
            <span className="font-bold">3학년 성지훈</span>{' '}
            <span className="font-light">| 소담 다함께 돌봄센터</span>
          </h2>
        </div>
        <img src={Logo} alt="Logo" className="max-h-[150px] max-w-[230px]" />
        <div className="flex-1" />
      </section>

      <section className="gap-y-7.5 grid flex-1 grid-cols-2 grid-rows-2 gap-x-10">
        <Link
          to={'/study'}
          className="bg-orange-primary row-span-2 flex items-end justify-center rounded-xl px-7 py-6"
        >
          <h3 className="typography-SB5 text-orange-primary w-[150px] rounded-full bg-white py-3 text-center">
            메인학습
          </h3>
        </Link>
        <button className="row-span-1 items-start rounded-xl bg-[#A4DF34] px-7 py-6">
          <h3 className="typography-SB5 w-[138px] rounded-full bg-white py-3 text-center text-[#A4DF34]">
            독서활동
          </h3>
        </button>
        <button className="bg-yellow-primary row-span-1 items-start rounded-xl px-7 py-6">
          <h3 className="typography-SB5 text-yellow-primary w-[138px] rounded-full bg-white py-3 text-center">
            맞춤법 카드
          </h3>
        </button>
      </section>
    </>
  );
}
