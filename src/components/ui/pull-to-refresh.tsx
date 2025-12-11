import { Loader2, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  isRefreshing: boolean;
  threshold?: number;
}

export function PullToRefreshIndicator({
  pullDistance,
  isRefreshing,
  threshold = 80,
}: PullToRefreshIndicatorProps) {
  const progress = Math.min(pullDistance / threshold, 1);
  const shouldShow = pullDistance > 10 || isRefreshing;

  if (!shouldShow) return null;

  return (
    <div
      className="fixed left-0 right-0 flex justify-center z-50 pointer-events-none"
      style={{
        top: `${Math.min(pullDistance, threshold * 1.2)}px`,
        transform: 'translateY(-100%)',
      }}
    >
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-card border border-border shadow-lg transition-all',
          isRefreshing ? 'h-10 w-10' : 'h-8 w-8'
        )}
        style={{
          opacity: isRefreshing ? 1 : progress,
          transform: `scale(${isRefreshing ? 1 : 0.8 + progress * 0.2})`,
        }}
      >
        {isRefreshing ? (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        ) : (
          <ArrowDown
            className="h-4 w-4 text-muted-foreground transition-transform"
            style={{
              transform: `rotate(${progress >= 1 ? 180 : 0}deg)`,
            }}
          />
        )}
      </div>
    </div>
  );
}
