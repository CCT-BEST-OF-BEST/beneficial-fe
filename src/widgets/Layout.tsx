import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex w-full min-w-[1000px] justify-center bg-amber-100">
      <main className="pt-21 pb-24.5 px-25.5 relative flex min-h-screen w-full max-w-[1194px] flex-col">
        <Outlet />
      </main>
    </div>
  );
}
