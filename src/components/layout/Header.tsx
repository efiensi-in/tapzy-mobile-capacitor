import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title?: string;
  greeting?: {
    text: string;
    name: string;
  };
  showBack?: boolean;
  showNotification?: boolean;
  showSettings?: boolean;
  rightAction?: React.ReactNode;
  className?: string;
}

export function Header({
  title,
  greeting,
  showBack = false,
  showNotification = true,
  showSettings = true,
  rightAction,
  className,
}: HeaderProps) {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Style untuk elemen pill/button - Liquid Glass Apple style
  // Light mode: dark text, Dark mode: white text
  const elementStyle = cn(
    'rounded-full flex items-center justify-center shrink-0 transition-all duration-300',
    'text-foreground dark:text-white',
    isScrolled ? 'liquid-glass' : 'liquid-glass-primary'
  );

  return (
    <header
      className={cn(
        'sticky top-0 z-40 safe-top px-4 py-2 transition-colors duration-200',
        className
      )}
    >
      <div className="flex items-center gap-2">
        {/* Back button */}
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className={cn(elementStyle, 'h-10 w-10')}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        {/* Pill container - tinggi konsisten */}
        {(greeting || title) && (
          <div className={cn(elementStyle, 'flex-1 min-w-0 h-10 px-4')}>
            {greeting ? (
              <div className="min-w-0 flex-1 flex items-center gap-1.5">
                <span className="text-xs opacity-60">{greeting.text},</span>
                <span className="text-xs font-semibold truncate">{greeting.name}</span>
              </div>
            ) : (
              <p className="text-sm font-medium truncate flex-1 text-center">{title}</p>
            )}
          </div>
        )}

        {/* Spacer jika tidak ada greeting/title */}
        {!greeting && !title && <div className="flex-1" />}

        {/* Notification button */}
        {showNotification && (
          <button className={cn(elementStyle, 'h-10 w-10 relative')}>
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
          </button>
        )}

        {/* Settings button */}
        {showSettings && (
          <button
            onClick={() => navigate('/settings')}
            className={cn(elementStyle, 'h-10 w-10')}
          >
            <Settings className="h-5 w-5" />
          </button>
        )}

        {rightAction}
      </div>
    </header>
  );
}
