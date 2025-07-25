import { cn } from '@/shared/lib/utils.ts';

export default function Separator({ className }: { className?: string }) {
  return <div className={cn('bg-gray-2 h-[1px] w-full shrink-0', className)} />
}
