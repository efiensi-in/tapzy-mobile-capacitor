import { useState, useEffect, useCallback, useRef } from 'react';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number; // Distance to trigger refresh (default: 80px)
  disabled?: boolean;
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  disabled = false,
}: UsePullToRefreshOptions) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const currentY = useRef(0);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing || disabled) return;

    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
      setPullDistance(0);
    }
  }, [onRefresh, isRefreshing, disabled]);

  useEffect(() => {
    if (disabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Only trigger if at top of page
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (startY.current === 0 || isRefreshing) return;

      currentY.current = e.touches[0].clientY;
      const distance = currentY.current - startY.current;

      // Only pull down, not up
      if (distance > 0 && window.scrollY === 0) {
        // Apply resistance - the further you pull, the harder it gets
        const resistedDistance = Math.min(distance * 0.5, threshold * 1.5);
        setPullDistance(resistedDistance);

        // Prevent default scroll when pulling
        if (distance > 10) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = () => {
      if (pullDistance >= threshold && !isRefreshing) {
        handleRefresh();
      } else {
        setPullDistance(0);
      }
      startY.current = 0;
      currentY.current = 0;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [disabled, isRefreshing, pullDistance, threshold, handleRefresh]);

  return {
    isRefreshing,
    pullDistance,
    shouldRefresh: pullDistance >= threshold,
  };
}
