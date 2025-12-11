import { TransactionItemSkeleton } from './shared';

interface TransactionListSkeletonProps {
  count?: number;
}

export function TransactionListSkeleton({ count = 5 }: TransactionListSkeletonProps) {
  return (
    <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/50">
      {Array.from({ length: count }).map((_, i) => (
        <TransactionItemSkeleton key={i} />
      ))}
    </div>
  );
}
