import { cn } from '@/shared/lib/utils.ts';

export type BadgeType = '첫학습' | '복습' | '재도전' | '잠시후복습' | '훌륭해요!';

interface BadgeProps {
  type: BadgeType;
}

const typeToColor: Record<BadgeProps['type'], string> = {
  '첫학습': 'bg-gray-2',
  '복습': 'bg-[#9DD4F0]',
  '재도전': 'bg-[#FABF64]',
  '잠시후복습': 'bg-[#FABF64]',
  '훌륭해요!': 'bg-[#9DD4F0]',
};

export default function Badge({ type }: BadgeProps) {
  return (
    <div
      className={cn(
        'typography-SB1 inline-block rounded-full px-4 py-2 text-white mt-5',
        typeToColor[type]
      )}
    >
      {type}
    </div>
  );
}
