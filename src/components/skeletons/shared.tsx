import { Skeleton } from '@/components/ui/skeleton';

/** Skeleton untuk item transaksi dalam list */
export function TransactionItemSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3 px-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 min-w-0">
        <Skeleton className="h-4 w-28 mb-1" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="text-right">
        <Skeleton className="h-4 w-20 mb-1 ml-auto" />
        <Skeleton className="h-3 w-16 ml-auto" />
      </div>
    </div>
  );
}

/** Skeleton untuk card member */
export function MemberCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border/50 p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 min-w-0">
          <Skeleton className="h-5 w-32 mb-1" />
          <Skeleton className="h-3 w-24 mb-2" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
        <div className="text-right">
          <Skeleton className="h-3 w-12 mb-1 ml-auto" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
    </div>
  );
}

/** Skeleton untuk card wallet compact */
export function WalletCardSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <div className="flex-1">
        <Skeleton className="h-4 w-24 mb-1" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-5 w-5 rounded" />
    </div>
  );
}

/** Skeleton untuk balance summary card */
export function BalanceSummarySkeleton() {
  return (
    <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 rounded-2xl p-6">
      <div className="mb-4">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-10 w-48" />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div>
            <Skeleton className="h-3 w-12 mb-1" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
