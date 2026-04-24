import { type ReactNode } from 'react';
import { Sidebar }       from './Sidebar';
import { Navbar }        from './Navbar';
import { useApp }        from '../../context/AppContext';
import { ToastContainer } from '../ui/Toast';
import { cn }            from '../../utils/cn';

export function Layout({ children }: { children: ReactNode }) {
  const { state } = useApp();

  return (
    <div className="min-h-screen bg-slate-50/80">
      <Sidebar />
      <Navbar />

      <main
        className={cn(
          'min-h-screen pt-16 transition-all duration-300 ease-in-out',
          state.sidebarCollapsed ? 'pl-[68px]' : 'pl-64',
        )}
      >
        <div className="p-5 md:p-7 mx-auto max-w-screen-2xl">
          {children}
        </div>
      </main>

      <ToastContainer />
    </div>
  );
}
