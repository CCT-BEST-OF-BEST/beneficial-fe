interface StepProgressProps {
  currentStep: number;
}

export default function StepProgress({ currentStep }: StepProgressProps) {
  const bgColorMap: Record<number, string> = {
    1: 'bg-sky-primary',
    2: 'bg-green-primary',
    3: 'bg-red-primary',
  };

  const getCircleStyle = (step: number) => {
    const base =
      'flex justify-center items-center typography-SB5 h-[50px] w-[50px] rounded-full font-medium';
    const isCurrent = currentStep === step;
    const text = isCurrent ? 'text-white' : 'text-gray-3';
    const bg = isCurrent ? bgColorMap[step] : 'bg-white';

    return `${base} ${bg} ${text}`;
  };

  return (
    <div className="flex items-center">
      <div className={getCircleStyle(1)}>1</div>
      <div className="h-[10px] w-[30px] bg-white" />
      <div className={getCircleStyle(2)}>2</div>
      <div className="h-[10px] w-[30px] bg-white" />
      <div className={getCircleStyle(3)}>3</div>
    </div>
  );
}
