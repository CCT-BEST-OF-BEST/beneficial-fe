import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/widgets/Layout.tsx';
import ErrorPage from '@/shared/ui/ErrorPage.tsx';
import Home from '@/pages/Home.tsx';
import Study from '@/pages/Study.tsx';
import StudyDetail from '@/pages/StudyDetail.tsx';
import NotFoundPage from '@/shared/ui/NotFoundPage.tsx';
import AuthPage from '@/pages/AuthPage.tsx';
import LearningRecords from '@/pages/LearningRecords.tsx';
import RoleRoute from '@/shared/ui/RoleRoute.tsx';
import RoleRedirector from '@/shared/ui/RoleRedirector.tsx';
import TeacherDashboard from '@/pages/teacher/TeacherDashboard.tsx';
import ClassDetail from '@/pages/teacher/ClassDetail.tsx';
import StudentDetail from '@/pages/teacher/StudentDetail.tsx';
import AIProblemGenerator from '@/features/instruction/ui/AIProblemGenerator.tsx';
import AdminDashboard from '@/pages/AdminDashboard.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <RoleRedirector /> },
      { path: '/auth/:mode', element: <AuthPage /> },
      
      // Student Routes
      {
        element: <RoleRoute allowedRoles={['student']} />,
        children: [
          { path: '/student', element: <Home /> },
          { path: '/student/study', element: <Study /> },
          { path: '/student/study/:studyId', element: <StudyDetail /> },
          { path: '/student/records', element: <LearningRecords /> },
        ],
      },

      // Teacher Routes
      {
        element: <RoleRoute allowedRoles={['teacher', 'developer']} />,
        children: [
          { path: '/teacher', element: <TeacherDashboard /> },
          { path: '/teacher/classes/:classId', element: <ClassDetail /> },
          { path: '/teacher/students/:userId', element: <StudentDetail /> },
          { path: '/teacher/instruction/generate', element: <AIProblemGenerator /> },
        ],
      },

      // Admin Routes
      {
        element: <RoleRoute allowedRoles={['developer']} />,
        children: [
          { path: '/admin', element: <AdminDashboard /> },
        ],
      },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
