import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils.ts';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  step?: number;
}

export default function Button({ step = 1, children, className, ...props }: ButtonProps) {
  const ColorMap: Record<number, string> = {
    1: 'border-sky-primary bg-sky-primary disabled:text-sky-primary disabled:bg-white',
    2: 'border-green-primary bg-green-primary disabled:text-green-primary disabled:bg-white',
    3: 'border-red-primary bg-red-primary disabled:text-red-primary disabled:bg-white',
  };

  return (
    <button
      className={cn(
        'justify-center rounded-full border-2 py-3 text-white',
        ColorMap[step],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
