import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/widgets/Layout.tsx';
import ErrorPage from '@/shared/ui/ErrorPage.tsx';
import Home from '@/pages/Home.tsx';
import Study from '@/pages/Study.tsx';
import StudyDetail from '@/pages/StudyDetail.tsx';
import NotFoundPage from '@/shared/ui/NotFoundPage.tsx';
import AuthPage from '@/pages/AuthPage.tsx';
import LearningRecords from '@/pages/LearningRecords.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: '/auth/:mode', element: <AuthPage /> },
      { path: '/study', element: <Study /> },
      { path: '/study/:studyId', element: <StudyDetail /> },
      { path: '/records', element: <LearningRecords /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
