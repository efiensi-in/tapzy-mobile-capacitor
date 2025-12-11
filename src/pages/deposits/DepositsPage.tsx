import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader2, History } from 'lucide-react';
import { walletsApi } from '@/api/wallets';
import { Header } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { TransactionItem } from '@/components/features';
import { TransactionListSkeleton } from '@/components/skeletons';
import type { Transaction } from '@/types/api';

export default function DepositsPage() {
  // Fetch deposits with infinite scroll
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['deposits'],
    queryFn: ({ pageParam }) =>
      walletsApi.getDeposits({
        page: pageParam,
        per_page: 15,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.data?.pagination;
      if (pagination && pagination.current_page < pagination.last_page) {
        return pagination.current_page + 1;
      }
      return undefined;
    },
  });

  const allDeposits = data?.pages.flatMap((page) => page.data?.deposits || []) || [];

  return (
    <div className="min-h-screen pb-6">
      <Header showBack title="Riwayat Top Up" />

      <div className="px-4">
        {isLoading ? (
          <TransactionListSkeleton count={5} />
        ) : allDeposits.length === 0 ? (
          <EmptyState
            icon={History}
            title="Belum ada riwayat top up"
            description="Riwayat top up akan muncul di sini setelah Anda melakukan top up"
          />
        ) : (
          <>
            <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/50">
              {allDeposits.map((deposit) => (
                <TransactionItem
                  key={deposit.id}
                  transaction={{
                    id: deposit.id,
                    transaction_code: deposit.deposit_code,
                    transaction_type: 'topup',
                    amount: deposit.amount,
                    status: deposit.status,
                    wallet: deposit.wallet,
                    created_at: deposit.created_at,
                  } as Transaction}
                  showMember
                  memberName={deposit.member.name}
                  className="px-4"
                />
              ))}
            </div>

            {/* Load more */}
            {hasNextPage && (
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memuat...
                    </>
                  ) : (
                    'Muat lebih banyak'
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
