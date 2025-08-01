import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { StepProvider } from '@/features/studyStep/hooks/StepContext.tsx';

export default function App() {
  return (
    <>
      <StepProvider>
        <RouterProvider router={router} />
      </StepProvider>
    </>
  );
}
