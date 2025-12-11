import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, History, ChevronRight, Users, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts';
import { membersApi } from '@/api/members';
import { walletsApi } from '@/api/wallets';
import { Header } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { BalanceSummary, MemberCard, TransactionItem } from '@/components/features';
import { HomePageSkeleton, TransactionItemSkeleton } from '@/components/skeletons';
import type { Transaction } from '@/types/api';

export default function HomePage() {
  const { user, guardian } = useAuth();

  // Fetch members
  const {
    data: membersData,
    isLoading: isMembersLoading,
    refetch: refetchMembers,
  } = useQuery({
    queryKey: ['members'],
    queryFn: () => membersApi.list(),
  });

  // Fetch recent deposits
  const { data: depositsData, isLoading: isDepositsLoading } = useQuery({
    queryKey: ['deposits', { per_page: 5 }],
    queryFn: () => walletsApi.getDeposits({ per_page: 5 }),
  });

  const members = membersData?.data?.members || [];
  const deposits = depositsData?.data?.deposits || [];

  // Calculate total balance from all members' wallets
  const totalBalance = members.reduce((sum, member) => {
    const memberBalance = member.wallets?.reduce((walletSum, wallet) => {
      return walletSum + parseFloat(wallet.balance || '0');
    }, 0) || 0;
    return sum + memberBalance;
  }, 0);

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  // Show full skeleton when loading
  if (isMembersLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <HomePageSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header greeting={{ text: getGreeting(), name: user?.name || 'Guardian' }} />

      <div className="px-4 pb-6">
        {/* Balance Summary */}
        <BalanceSummary
          totalBalance={totalBalance}
          membersCount={members.length}
          className="mb-6"
        />

        {/* Quick Actions */}
        <div className="flex gap-3 mb-6">
          <Link to={members[0] ? `/members/${members[0].id}/topup` : '#'} className="flex-1">
            <Button
              variant="outline"
              className="w-full h-14 flex flex-col items-center justify-center gap-1"
              disabled={members.length === 0}
            >
              <Plus className="h-5 w-5 text-primary" />
              <span className="text-xs">Top Up</span>
            </Button>
          </Link>
          <Link to="/deposits" className="flex-1">
            <Button
              variant="outline"
              className="w-full h-14 flex flex-col items-center justify-center gap-1"
            >
              <History className="h-5 w-5 text-primary" />
              <span className="text-xs">Riwayat</span>
            </Button>
          </Link>
          <Button
            variant="outline"
            className="flex-1 h-14 flex flex-col items-center justify-center gap-1"
            onClick={() => refetchMembers()}
          >
            <RefreshCw className="h-5 w-5 text-primary" />
            <span className="text-xs">Refresh</span>
          </Button>
        </div>

        {/* Members Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Anak Saya</h2>
            {guardian?.pending_claims_count ? (
              <span className="text-xs text-warning">
                {guardian.pending_claims_count} menunggu persetujuan
              </span>
            ) : null}
          </div>

          {members.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Belum ada anak terdaftar"
              description="Daftarkan anak Anda untuk mulai memantau pengeluaran mereka"
              action={
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Daftarkan Anak
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {members.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Aktivitas Terakhir</h2>
            <Link
              to="/deposits"
              className="text-sm text-primary flex items-center gap-1 hover:underline"
            >
              Lihat semua
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {isDepositsLoading ? (
            <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/50">
              {[1, 2, 3].map((i) => (
                <TransactionItemSkeleton key={i} />
              ))}
            </div>
          ) : deposits.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Belum ada aktivitas
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/50">
              {deposits.map((deposit) => (
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
          )}
        </div>
      </div>
    </div>
  );
}
