import { Outlet } from 'react-router-dom';
import { useBackButton } from '@/hooks';
import { cn } from '@/lib/utils';

interface AuthLayoutProps {
  className?: string;
}

export function AuthLayout({ className }: AuthLayoutProps) {
  useBackButton();

  return (
    <div
      className={cn(
        'min-h-screen bg-gradient-to-br from-primary/20 via-background to-primary/10',
        'flex flex-col safe-area',
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <main className="relative z-10 flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
