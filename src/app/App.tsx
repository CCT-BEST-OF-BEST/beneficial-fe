import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { StepProvider } from '@/features/studyStep/hooks/StepContext.tsx';
import { AuthProvider } from '@/features/auth/model/AuthContext.tsx';

export default function App() {
  return (
    <AuthProvider>
      <StepProvider>
        <RouterProvider router={router} />
      </StepProvider>
    </AuthProvider>
  );
}
