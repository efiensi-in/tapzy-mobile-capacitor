import { Skeleton } from '@/components/ui/skeleton';
import { TransactionItemSkeleton } from './shared';

export function WalletDetailPageSkeleton() {
  return (
    <div className="px-4">
      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <div className="mb-4">
          <Skeleton className="h-3 w-12 mb-2" />
          <Skeleton className="h-9 w-40" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-6">
        <Skeleton className="flex-1 h-12 rounded-lg" />
        <Skeleton className="flex-1 h-12 rounded-lg" />
      </div>

      {/* Transactions */}
      <div>
        <Skeleton className="h-5 w-36 mb-3" />
        <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/50">
          {[1, 2, 3, 4].map((i) => (
            <TransactionItemSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
