import { Outlet } from 'react-router-dom';
import { BottomNav } from '@/components/ui/bottom-nav';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  showBottomNav?: boolean;
  className?: string;
}

export function AppLayout({ showBottomNav = true, className }: AppLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {/* Main content area */}
      <main
        className={cn(
          'flex-1',
          showBottomNav && 'pb-24' // Space for bottom nav
        )}
      >
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      {showBottomNav && <BottomNav />}
    </div>
  );
}
