import * as Dialog from '@radix-ui/react-dialog';
import CloseIcon from '@/assets/CloseIcon.svg?react';
import StudyDialogImage from '@/assets/StudyDialogImage.png';
import { Link } from 'react-router-dom';

interface StudyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function StudyDialog({ open, onOpenChange }: StudyDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-gray-4/50 backdrop-blur-xs fixed inset-0" />
        <Dialog.Content className="border-orange-primary fixed left-1/2 top-1/2 w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 bg-white pb-8 shadow-lg">
          <div className="bg-orange-primary mb-4 flex justify-between rounded-t-xl px-6 pb-3 pt-6">
            <div>
              <Dialog.Title className="typography-SB1 mb-1 text-white">2차시</Dialog.Title>
              <Dialog.Description className="typography-SB3 text-white">
                비슷한 동사, 다른 의미 2
              </Dialog.Description>
            </div>
            <Dialog.Close className="h-7 w-7 cursor-pointer rounded-full bg-white p-2">
              <CloseIcon />
            </Dialog.Close>
          </div>

          <div className="px-19 mt-10">
            <div>
              <img src={StudyDialogImage} className="h-[290px] w-[290px]" alt="" />
            </div>
            <Link
              to={'/study/2'}
              className="bg-orange-primary typography-SB2 mt-10 flex w-full justify-center rounded-full py-3 text-white"
            >
              학습하기
            </Link>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
