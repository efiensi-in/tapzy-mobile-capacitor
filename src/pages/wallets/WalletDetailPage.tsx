import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, TrendingDown, Snowflake, AlertCircle, Wallet, PiggyBank, Utensils, Bus, Coins, type LucideIcon } from 'lucide-react';
import { walletsApi } from '@/api/wallets';
import { Header } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { TransactionItem } from '@/components/features';
import { WalletDetailPageSkeleton, TransactionItemSkeleton } from '@/components/skeletons';
import { formatCurrency } from '@/utils/format';

const walletIcons: Record<string, LucideIcon> = {
  main: Wallet,
  savings: PiggyBank,
  meal_allowance: Utensils,
  transport: Bus,
};

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

  const IconComponent = wallet ? (walletIcons[wallet.wallet_type] || Coins) : Coins;

  if (isWalletLoading) {
    return (
      <div className="min-h-screen">
        <Header showBack title="Detail Dompet" />
        <WalletDetailPageSkeleton />
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
        <div
          className="relative overflow-hidden rounded-3xl p-5 text-white mb-6"
          style={{
            background: 'var(--primary-gradient)',
            boxShadow: '0 10px 40px -10px var(--primary-shadow)',
          }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-teal-300/20 rounded-full blur-2xl" />

            {/* Wave Pattern */}
            <svg className="absolute -bottom-1 left-0 w-full h-28 text-black/[0.07]" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path fill="currentColor" d="M0,160L40,170.7C80,181,160,203,240,192C320,181,400,139,480,138.7C560,139,640,181,720,197.3C800,213,880,203,960,176C1040,149,1120,107,1200,101.3C1280,96,1360,128,1400,144L1440,160L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z" />
            </svg>
            <svg className="absolute -bottom-1 left-0 w-full h-20 text-black/[0.05]" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path fill="currentColor" d="M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,186.7C672,192,768,192,864,181.3C960,171,1056,149,1152,149.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
            </svg>

            {/* Dot pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <IconComponent className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-white/80 font-medium uppercase tracking-wider">{wallet.wallet_type_label}</p>
                <p className="text-sm text-white font-medium">{member?.name}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-white/70 mb-1">Saldo</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-medium text-white/80">Rp</span>
                <h2 className="text-[2rem] font-bold tracking-tight leading-none text-white">
                  {formatCurrency(wallet.balance).replace('Rp', '').trim()}
                </h2>
              </div>
            </div>

            {/* Status badges */}
            {(wallet.is_frozen || !wallet.is_active) && (
              <>
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-3" />
                <div className="flex flex-wrap gap-2">
                  {wallet.is_frozen && (
                    <div className="flex items-center gap-1.5 bg-blue-400/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                      <Snowflake className="h-3.5 w-3.5" />
                      <span className="text-sm font-medium">Dibekukan</span>
                    </div>
                  )}
                  {!wallet.is_active && (
                    <div className="flex items-center gap-1.5 bg-red-400/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span className="text-sm font-medium">Tidak Aktif</span>
                    </div>
                  )}
                </div>
              </>
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
                    <p className="text-sm font-medium">{limit.limit_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {limit.is_active ? 'Aktif' : 'Tidak aktif'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{formatCurrency(limit.daily_limit)}/hari</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(limit.per_transaction_limit)}/trx</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transactions */}
        <div>
          <h3 className="font-semibold mb-3">Riwayat Transaksi</h3>
          {isTransactionsLoading ? (
            <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/50">
              {[1, 2, 3].map((i) => (
                <TransactionItemSkeleton key={i} />
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
