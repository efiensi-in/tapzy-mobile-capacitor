import { Skeleton } from '@/components/ui/skeleton';

export function ProfilePageSkeleton() {
  return (
    <div className="px-4">
      {/* Profile Card */}
      <div className="bg-card rounded-xl border border-border/50 p-6 mb-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-6 w-40 mb-1" />
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-card rounded-xl border border-border/50 mb-6">
        <div className="p-4 border-b border-border/50">
          <Skeleton className="h-5 w-32" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 p-4 border-b border-border/50 last:border-0">
            <Skeleton className="h-5 w-5 rounded" />
            <div className="flex-1">
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        ))}
      </div>

      {/* Menu Items */}
      <div className="bg-card rounded-xl border border-border/50 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 p-4 border-b border-border/50 last:border-0">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-4 w-24 flex-1" />
            <Skeleton className="h-5 w-5 rounded" />
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-card rounded-xl border border-border/50 p-4 text-center">
            <Skeleton className="h-8 w-12 mx-auto mb-1" />
            <Skeleton className="h-3 w-24 mx-auto" />
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  );
}
