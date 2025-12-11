import { useParams, Link } from 'react-router-dom';
import { useMemberWallets, useMemberTransactions } from '../../hooks/useWallets';
import { Card, Badge, Button, Spinner } from '../../components/ui';
import { PageHeader } from '../../components/layout';
import { formatCurrency, formatDateTime } from '../../utils/format';

const statusVariant = {
  completed: 'success',
  pending: 'warning',
  failed: 'error',
} as const;

const typeLabels: Record<string, string> = {
  purchase: 'Pembelian',
  topup: 'Top-up',
  transfer: 'Transfer',
};

export default function WalletDetailPage() {
  const { memberId, walletId } = useParams<{ memberId: string; walletId: string }>();

  const { data: walletsData, isLoading: walletsLoading } = useMemberWallets(memberId!);
  const {
    data: txData,
    isLoading: txLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMemberTransactions(memberId!, { walletId });

  const wallet = walletsData?.data.wallets.find((w) => w.id === walletId);
  const member = walletsData?.data.member;
  const transactions = txData?.pages.flatMap((page) => page.data.transactions) || [];

  if (walletsLoading) {
    return (
      <div>
        <PageHeader title="Detail Dompet" showBack />
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      </div>
    );
  }

  if (!wallet || !member) {
    return (
      <div>
        <PageHeader title="Detail Dompet" showBack />
        <div className="p-4">
          <Card>
            <p className="text-center text-[var(--color-error)]">Data tidak ditemukan</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={wallet.wallet_type_label} showBack />

      <div className="p-4 space-y-6">
        {/* Balance Card */}
        <Card className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] border-0">
          <div className="text-white text-center">
            <p className="text-white/80 text-sm">{member.name}</p>
            <p className="text-3xl font-bold mt-2">{formatCurrency(wallet.balance)}</p>
            {wallet.is_frozen && (
              <Badge variant="error" className="mt-2">
                Dibekukan: {wallet.frozen_reason}
              </Badge>
            )}
          </div>
        </Card>

        {/* Top-up Button */}
        <Link to={`/members/${memberId}/wallets/${walletId}/topup`}>
          <Button fullWidth disabled={wallet.is_frozen}>
            Top-up Saldo
          </Button>
        </Link>

        {/* Transactions Section */}
        <div>
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">
            Riwayat Transaksi
          </h3>

          {txLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : transactions.length === 0 ? (
            <Card>
              <p className="text-center text-[var(--color-text-secondary)]">
                Belum ada transaksi
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <Card key={tx.id}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-[var(--color-text)]">
                          {typeLabels[tx.transaction_type] || tx.transaction_type}
                        </h4>
                        <Badge variant={statusVariant[tx.status]}>{tx.status}</Badge>
                      </div>
                      {tx.tenant && (
                        <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
                          {tx.tenant.name}
                        </p>
                      )}
                      <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                        {formatDateTime(tx.created_at)}
                      </p>
                    </div>
                    <p
                      className={`text-lg font-semibold ${
                        tx.transaction_type === 'topup'
                          ? 'text-[var(--color-success)]'
                          : 'text-[var(--color-text)]'
                      }`}
                    >
                      {tx.transaction_type === 'topup' ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </p>
                  </div>
                </Card>
              ))}

              {hasNextPage && (
                <button
                  onClick={() => fetchNextPage()}
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
    </div>
  );
}
