import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, TrendingDown, Snowflake, AlertCircle } from 'lucide-react';
import { walletsApi } from '@/api/wallets';
import { Header } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TransactionItem } from '@/components/features';
import { formatCurrency } from '@/utils/format';

export default function WalletDetailPage() {
  const { memberId, walletId } = useParams<{ memberId: string; walletId: string }>();

  // Fetch wallets to get wallet detail
  const { data: walletsData, isLoading: isWalletLoading } = useQuery({
    queryKey: ['wallets', memberId],
    queryFn: () => walletsApi.getWallets(memberId!),
    enabled: !!memberId,
  });

  // Fetch transactions for this wallet
  const { data: transactionsData, isLoading: isTransactionsLoading } = useQuery({
    queryKey: ['transactions', memberId, { wallet_id: walletId, per_page: 20 }],
    queryFn: () => walletsApi.getTransactions(memberId!, { wallet_id: walletId, per_page: 20 }),
    enabled: !!memberId && !!walletId,
  });

  const wallet = walletsData?.data?.wallets.find((w) => w.id === walletId);
  const member = walletsData?.data?.member;
  const transactions = transactionsData?.data?.transactions || [];

  const walletIcons: Record<string, string> = {
    main: '💳',
    savings: '🏦',
    meal_allowance: '🍽️',
    transport: '🚌',
  };

  if (isWalletLoading) {
    return (
      <div className="min-h-screen">
        <Header showBack title="Detail Dompet" />
        <div className="p-4 space-y-4">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="min-h-screen">
        <Header showBack title="Detail Dompet" />
        <div className="p-4 text-center text-muted-foreground">
          Dompet tidak ditemukan
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-6">
      <Header showBack title={wallet.wallet_type_label} />

      <div className="px-4">
        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-2xl p-6 text-primary-foreground mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="text-2xl">{walletIcons[wallet.wallet_type] || '💰'}</span>
            </div>
            <div>
              <p className="text-sm text-primary-foreground/80">{wallet.wallet_type_label}</p>
              <p className="text-sm text-primary-foreground/60">{member?.name}</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-primary-foreground/80 mb-1">Saldo</p>
            <h2 className="text-3xl font-bold">{formatCurrency(wallet.balance)}</h2>
          </div>

          {/* Status badges */}
          <div className="flex flex-wrap gap-2">
            {wallet.is_frozen && (
              <Badge className="bg-blue-500/20 text-white border-blue-300/30">
                <Snowflake className="h-3 w-3 mr-1" />
                Dibekukan
              </Badge>
            )}
            {!wallet.is_active && (
              <Badge className="bg-red-500/20 text-white border-red-300/30">
                <AlertCircle className="h-3 w-3 mr-1" />
                Tidak Aktif
              </Badge>
            )}
          </div>
        </div>

        {/* Frozen reason */}
        {wallet.is_frozen && wallet.frozen_reason && (
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Alasan dibekukan:</strong> {wallet.frozen_reason}
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-3 mb-6">
          <Link to={`/members/${memberId}/topup`} className="flex-1">
            <Button className="w-full h-12" disabled={wallet.is_frozen || !wallet.is_active}>
              <Plus className="h-4 w-4 mr-2" />
              Top Up
            </Button>
          </Link>
          <Link to={`/members/${memberId}/limits`} className="flex-1">
            <Button variant="outline" className="w-full h-12">
              <TrendingDown className="h-4 w-4 mr-2" />
              Limit
            </Button>
          </Link>
        </div>

        {/* Spending Limits */}
        {wallet.spending_limits && wallet.spending_limits.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Batas Pengeluaran</h3>
            <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/50">
              {wallet.spending_limits.map((limit) => (
                <div key={limit.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium capitalize">
                      {limit.limit_type === 'daily' && 'Harian'}
                      {limit.limit_type === 'weekly' && 'Mingguan'}
                      {limit.limit_type === 'monthly' && 'Bulanan'}
                      {limit.limit_type === 'per_transaction' && 'Per Transaksi'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {limit.is_active ? 'Aktif' : 'Tidak aktif'}
                    </p>
                  </div>
                  <p className="font-semibold">{formatCurrency(limit.amount)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transactions */}
        <div>
          <h3 className="font-semibold mb-3">Riwayat Transaksi</h3>
          {isTransactionsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Belum ada transaksi untuk dompet ini
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/50">
              {transactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  className="px-4"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
