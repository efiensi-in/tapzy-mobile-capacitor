import { Skeleton } from '@/components/ui/skeleton';

function SpendingLimitCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border/50">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <Skeleton className="h-5 w-28" />
      </div>
      {/* Limit Item */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="flex gap-1">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
        {/* Limit values */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-accent/30 rounded-lg p-2">
            <Skeleton className="h-3 w-12 mb-1" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="bg-accent/30 rounded-lg p-2">
            <Skeleton className="h-3 w-16 mb-1" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SpendingLimitsPageSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <SpendingLimitCardSkeleton key={i} />
      ))}
    </div>
  );
}
