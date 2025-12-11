import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Filter, Loader2 } from 'lucide-react';
import { walletsApi } from '@/api/wallets';
import { Header } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { TransactionItem } from '@/components/features';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export default function TransactionsPage() {
  const { memberId } = useParams<{ memberId: string }>();
  const [filterWalletId, setFilterWalletId] = useState<string>('');

  // Fetch transactions with infinite scroll
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['transactions', memberId, filterWalletId],
    queryFn: ({ pageParam }) =>
      walletsApi.getTransactions(memberId!, {
        page: pageParam,
        per_page: 15,
        wallet_id: filterWalletId || undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.data?.pagination;
      if (pagination && pagination.current_page < pagination.last_page) {
        return pagination.current_page + 1;
      }
      return undefined;
    },
    enabled: !!memberId,
  });

  const allTransactions = data?.pages.flatMap((page) => page.data?.transactions || []) || [];
  const member = data?.pages[0]?.data?.member;

  // Get unique wallets for filter (from first page)
  const wallets = data?.pages[0]?.data?.transactions
    .map((t) => t.wallet)
    .filter((w, i, arr) => arr.findIndex((x) => x.id === w.id) === i) || [];

  return (
    <div className="min-h-screen pb-6">
      <Header
        showBack
        title={member ? `Transaksi ${member.name}` : 'Transaksi'}
        rightAction={
          wallets.length > 1 && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <Filter className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-2xl">
                <SheetHeader>
                  <SheetTitle>Filter Dompet</SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-2">
                  <button
                    onClick={() => setFilterWalletId('')}
                    className={cn(
                      'w-full p-3 rounded-lg text-left transition-colors',
                      !filterWalletId ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
                    )}
                  >
                    Semua Dompet
                  </button>
                  {wallets.map((wallet) => (
                    <button
                      key={wallet.id}
                      onClick={() => setFilterWalletId(wallet.id)}
                      className={cn(
                        'w-full p-3 rounded-lg text-left transition-colors',
                        filterWalletId === wallet.id ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
                      )}
                    >
                      {wallet.wallet_type_label}
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          )
        }
      />

      <div className="px-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : allTransactions.length === 0 ? (
          <EmptyState
            title="Belum ada transaksi"
            description="Transaksi akan muncul di sini"
          />
        ) : (
          <>
            <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/50">
              {allTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
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
