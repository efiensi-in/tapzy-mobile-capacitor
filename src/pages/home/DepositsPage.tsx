import { useDeposits } from '../../hooks/useWallets';
import { Card, Badge, Spinner } from '../../components/ui';
import { PageHeader } from '../../components/layout';
import { formatCurrency, formatDateTime } from '../../utils/format';

const statusVariant = {
  completed: 'success',
  pending: 'warning',
} as const;

export default function DepositsPage() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useDeposits();

  const deposits = data?.pages.flatMap((page) => page.data.deposits) || [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div>
      <PageHeader title="Riwayat Top-up" />

      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : deposits.length === 0 ? (
          <Card>
            <div className="text-center py-4">
              <p className="text-[var(--color-text-secondary)]">
                Belum ada riwayat top-up
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {deposits.map((deposit) => (
              <Card key={deposit.id}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-[var(--color-text)]">
                        {deposit.member.name}
                      </h3>
                      <Badge variant={statusVariant[deposit.status]}>
                        {deposit.status_label}
                      </Badge>
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                      {deposit.wallet.wallet_type_label} • {deposit.payment_method_label}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                      {formatDateTime(deposit.created_at)}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-[var(--color-success)]">
                    +{formatCurrency(deposit.amount)}
                  </p>
                </div>
              </Card>
            ))}

            {hasNextPage && (
              <button
                onClick={handleLoadMore}
                disabled={isFetchingNextPage}
                className="w-full py-3 text-[var(--color-primary)] font-medium"
              >
                {isFetchingNextPage ? <Spinner size="sm" /> : 'Muat lebih banyak'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
