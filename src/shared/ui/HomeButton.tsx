import HomeIcon from '@/assets/HomeIcon.svg?react';
import { Link } from 'react-router-dom';

interface HomeButtonProps {
  color: 'orange' | 'green' | 'red' | 'sky';
}

export default function HomeButton({ color }: HomeButtonProps) {
  const colorVariants: Record<HomeButtonProps['color'], string> = {
    orange: 'text-orange-primary',
    green: 'text-green-primary',
    red: 'text-red-primary',
    sky: 'text-sky-primary',
  };

  return (
    <Link to="/" className="p-3.25 inline-flex rounded-full bg-white">
      <HomeIcon className={colorVariants[color]} />
    </Link>
  );
}
