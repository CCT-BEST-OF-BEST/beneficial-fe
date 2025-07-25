import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <main className="min-h-screen flex flex-col bg-amber-100 pt-21 pb-24.5 px-25.5 relative">
      <Outlet />
    </main>
  );
}
