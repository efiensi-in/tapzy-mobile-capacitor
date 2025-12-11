import { Skeleton } from '@/components/ui/skeleton';

export function TopupPageSkeleton() {
  return (
    <div className="px-4">
      {/* Member Selector */}
      <div className="mb-6">
        <div className="bg-card rounded-xl border border-border/50 p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-3 w-20 mb-1" />
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-5 w-5 rounded" />
          </div>
        </div>
      </div>

      {/* Wallet Selector */}
      <div className="mb-6">
        <Skeleton className="h-4 w-24 mb-2" />
        <div className="grid grid-cols-2 gap-2">
          {[1, 2].map((i) => (
            <div key={i} className="p-3 rounded-xl border border-border/50">
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Topup Form Card */}
      <div className="bg-card rounded-xl border border-border/50">
        <div className="p-4 border-b border-border/50">
          <Skeleton className="h-5 w-28" />
        </div>
        <div className="p-4 space-y-4">
          {/* Preset amounts */}
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>

          {/* Custom amount input */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>

          {/* Password input */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>

          {/* Notes input */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>

          {/* Submit button */}
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
