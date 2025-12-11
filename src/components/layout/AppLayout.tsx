import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { BottomNav } from '@/components/ui/bottom-nav';
import { useBackButton } from '@/hooks';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  showBottomNav?: boolean;
  className?: string;
}

export function AppLayout({ showBottomNav = true, className }: AppLayoutProps) {
  useBackButton();

  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {/* Main content area */}
      <main
        className={cn(
          'flex-1',
          showBottomNav && 'pb-20' // Space for bottom nav
        )}
      >
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      {showBottomNav && <BottomNav />}
    </div>
  );
}
