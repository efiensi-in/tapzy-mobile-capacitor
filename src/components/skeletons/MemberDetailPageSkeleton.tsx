import { Skeleton } from '@/components/ui/skeleton';
import { TransactionItemSkeleton, WalletCardSkeleton } from './shared';

export function MemberDetailPageSkeleton() {
  return (
    <div className="px-4">
      {/* Member Profile Card */}
      <div className="bg-card rounded-xl border border-border/50 p-4 mb-6">
        <div className="flex items-start gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-6 w-40 mb-1" />
            <Skeleton className="h-4 w-24 mb-2" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        </div>
        {/* Additional info */}
        <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-6">
        <Skeleton className="flex-1 h-12 rounded-lg" />
        <Skeleton className="flex-1 h-12 rounded-lg" />
        <Skeleton className="h-12 w-12 rounded-lg" />
      </div>

      {/* Wallets Section */}
      <div className="mb-6">
        <Skeleton className="h-5 w-16 mb-3" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <WalletCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex justify-between mb-3">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/50">
          {[1, 2, 3].map((i) => (
            <TransactionItemSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
