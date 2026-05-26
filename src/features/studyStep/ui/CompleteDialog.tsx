import * as Dialog from '@radix-ui/react-dialog';
import CompleteImg from '@/assets/CompleteImg.png';
import Button from '@/shared/ui/Button.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import { postStep3Reset } from '@/features/studyStep/api/postStep3Reset.ts';

interface CompleteDialogProps {
  open: boolean;
}

export default function CompleteDialog({ open }: CompleteDialogProps) {
  const navigate = useNavigate();
  const { lessonId } = useParams<{ lessonId: string }>();

  const handleClick = async () => {
    if (lessonId) {
      await postStep3Reset(lessonId);
    }
    navigate('/student');
  };

  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-gray-4/50 backdrop-blur-xs fixed inset-0">
          <Button
            onClick={handleClick}
            step={4}
            className="typography-SB5 right-25.5 absolute bottom-9 w-[150px]"
          >
            홈으로
          </Button>
        </Dialog.Overlay>
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 focus:outline-none">
          <Dialog.Title></Dialog.Title>
          <img src={CompleteImg} className="h-[463px] w-[380px]" alt="" />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
