import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, History, Settings2, Calendar, School } from 'lucide-react';
import { membersApi } from '@/api/members';
import { walletsApi } from '@/api/wallets';
import { Header } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { WalletCard, TransactionItem } from '@/components/features';
import { formatDate } from '@/utils/format';

export default function MemberDetailPage() {
  const { memberId } = useParams<{ memberId: string }>();

  // Fetch member detail
  const { data: memberData, isLoading: isMemberLoading } = useQuery({
    queryKey: ['member', memberId],
    queryFn: () => membersApi.get(memberId!),
    enabled: !!memberId,
  });

  // Fetch member wallets
  const { data: walletsData, isLoading: isWalletsLoading } = useQuery({
    queryKey: ['wallets', memberId],
    queryFn: () => walletsApi.getWallets(memberId!),
    enabled: !!memberId,
  });

  // Fetch recent transactions
  const { data: transactionsData, isLoading: isTransactionsLoading } = useQuery({
    queryKey: ['transactions', memberId, { per_page: 5 }],
    queryFn: () => walletsApi.getTransactions(memberId!, { per_page: 5 }),
    enabled: !!memberId,
  });

  const member = memberData?.data;
  const wallets = walletsData?.data?.wallets || [];
  const transactions = transactionsData?.data?.transactions || [];

  // Get initials from name
  const initials = member?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (isMemberLoading) {
    return (
      <div className="min-h-screen">
        <Header showBack title="Detail Anak" />
        <div className="p-4 space-y-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen">
        <Header showBack title="Detail Anak" />
        <div className="p-4 text-center text-muted-foreground">
          Data tidak ditemukan
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-6">
      <Header showBack title="Detail Anak" />

      <div className="px-4">
        {/* Member Profile Card */}
        <div className="bg-card rounded-xl border border-border/50 p-4 mb-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={member.photo_url || undefined} alt={member.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold truncate">{member.name}</h2>
              <p className="text-sm text-muted-foreground">{member.member_number}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {member.is_active ? (
                  <Badge className="bg-success/10 text-success border-success/30">Aktif</Badge>
                ) : (
                  <Badge variant="secondary">Tidak Aktif</Badge>
                )}
                {member.relationship && (
                  <Badge variant="outline" className="capitalize">
                    {member.relationship}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Additional info */}
          <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <School className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground truncate">{member.organization.name}</span>
            </div>
            {member.birth_date && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{formatDate(member.birth_date)}</span>
              </div>
            )}
            {member.grade && (
              <div className="text-sm">
                <span className="text-muted-foreground">Kelas: </span>
                <span>{member.grade} {member.class_name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mb-6">
          <Link to={`/members/${memberId}/topup`} className="flex-1">
            <Button className="w-full h-12">
              <Plus className="h-4 w-4 mr-2" />
              Top Up
            </Button>
          </Link>
          <Link to={`/members/${memberId}/transactions`} className="flex-1">
            <Button variant="outline" className="w-full h-12">
              <History className="h-4 w-4 mr-2" />
              Riwayat
            </Button>
          </Link>
          <Link to={`/members/${memberId}/limits`}>
            <Button variant="outline" size="icon" className="h-12 w-12">
              <Settings2 className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Wallets Section */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Dompet</h3>
          {isWalletsLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : wallets.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-sm">
              Tidak ada dompet
            </div>
          ) : (
            <div className="space-y-3">
              {wallets.map((wallet) => (
                <WalletCard
                  key={wallet.id}
                  wallet={wallet}
                  memberId={memberId!}
                  compact
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Transaksi Terakhir</h3>
            <Link
              to={`/members/${memberId}/transactions`}
              className="text-sm text-primary hover:underline"
            >
              Lihat semua
            </Link>
          </div>
          {isTransactionsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-sm">
              Belum ada transaksi
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
