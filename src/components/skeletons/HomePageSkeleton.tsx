import { Skeleton } from '@/components/ui/skeleton';
import {
  BalanceSummarySkeleton,
  MemberCardSkeleton,
  TransactionItemSkeleton,
} from './shared';

export function HomePageSkeleton() {
  return (
    <div className="px-4 pb-6 -mt-2">
      {/* Greeting */}
      <div className="mb-4">
        <Skeleton className="h-4 w-24 mb-1" />
        <Skeleton className="h-7 w-40" />
      </div>

      {/* Balance Summary */}
      <div className="mb-6">
        <BalanceSummarySkeleton />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="flex-1 h-14 rounded-lg" />
        ))}
      </div>

      {/* Members Section */}
      <div className="mb-6">
        <Skeleton className="h-5 w-24 mb-3" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <MemberCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex justify-between mb-3">
          <Skeleton className="h-5 w-32" />
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
