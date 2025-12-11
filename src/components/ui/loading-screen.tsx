import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingScreenProps {
  message?: string;
  className?: string;
}

export function LoadingScreen({ message, className }: LoadingScreenProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center bg-background',
        className
      )}
    >
      {/* Logo placeholder - bisa diganti dengan logo asli */}
      <div className="mb-8">
        <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center">
          <span className="text-2xl font-bold text-primary-foreground">T</span>
        </div>
      </div>

      {/* Loading spinner */}
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />

      {/* Message */}
      {message && (
        <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
      )}
    </div>
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <Loader2 className={cn('animate-spin text-primary', sizes[size], className)} />
  );
}
