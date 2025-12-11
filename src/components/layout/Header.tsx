import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showNotification?: boolean;
  showSettings?: boolean;
  rightAction?: React.ReactNode;
  transparent?: boolean;
  className?: string;
}

export function Header({
  title,
  showBack = false,
  showNotification = false,
  showSettings = false,
  rightAction,
  transparent = false,
  className,
}: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header
      className={cn(
        'sticky top-0 z-40 safe-top',
        !transparent && 'glass-strong',
        className
      )}
    >
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left section */}
        <div className="flex items-center gap-2 min-w-[48px]">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="h-9 w-9 rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Center - Title */}
        {title && (
          <h1 className="text-base font-semibold text-center flex-1 truncate px-2">
            {title}
          </h1>
        )}

        {/* Right section */}
        <div className="flex items-center gap-1 min-w-[48px] justify-end">
          {showNotification && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full relative"
            >
              <Bell className="h-5 w-5" />
              {/* Notification badge */}
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
            </Button>
          )}
          {showSettings && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/settings')}
              className="h-9 w-9 rounded-full"
            >
              <Settings className="h-5 w-5" />
            </Button>
          )}
          {rightAction}
        </div>
      </div>
    </header>
  );
}
