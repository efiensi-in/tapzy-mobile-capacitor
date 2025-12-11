import { useParams, Link } from 'react-router-dom';
import { useMember } from '../../hooks/useMembers';
import { useMemberWallets } from '../../hooks/useWallets';
import { Card, Avatar, Badge, Spinner } from '../../components/ui';
import { PageHeader } from '../../components/layout';
import { formatCurrency } from '../../utils/format';
import type { Wallet } from '../../types/api';

const walletIcons: Record<string, string> = {
  main: '💰',
  savings: '🏦',
  meal_allowance: '🍱',
  transport: '🚌',
};

function WalletCard({ wallet, memberId }: { wallet: Wallet; memberId: string }) {
  return (
    <Link to={`/members/${memberId}/wallets/${wallet.id}`}>
      <Card className="hover:border-[var(--color-primary)] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[var(--color-surface)] flex items-center justify-center text-2xl">
            {walletIcons[wallet.wallet_type] || '💳'}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-[var(--color-text)]">
                {wallet.wallet_type_label}
              </h3>
              {wallet.is_frozen && <Badge variant="error">Dibekukan</Badge>}
            </div>
            <p className="text-lg font-bold text-[var(--color-text)] mt-1">
              {formatCurrency(wallet.balance)}
            </p>
          </div>
          <svg
            className="w-5 h-5 text-[var(--color-text-secondary)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Card>
    </Link>
  );
}

export default function MemberDetailPage() {
  const { memberId } = useParams<{ memberId: string }>();
  const { data: memberData, isLoading: memberLoading } = useMember(memberId!);
  const { data: walletsData, isLoading: walletsLoading } = useMemberWallets(memberId!);

  const member = memberData?.data;
  const wallets = walletsData?.data.wallets || [];
  const totalBalance = walletsData?.data.total_balance || '0';

  const isLoading = memberLoading || walletsLoading;

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Detail Anak" showBack />
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div>
        <PageHeader title="Detail Anak" showBack />
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
      <PageHeader title="Detail Anak" showBack />

      <div className="p-4 space-y-6">
        {/* Profile Card */}
        <Card>
          <div className="flex items-center gap-4">
            <Avatar src={member.photo_url} name={member.name} size="xl" />
            <div>
              <h2 className="text-xl font-bold text-[var(--color-text)]">{member.name}</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {member.organization.name}
              </p>
              {member.grade && member.class_name && (
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {member.grade} - {member.class_name}
                </p>
              )}
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                {member.member_number}
              </p>
            </div>
          </div>
        </Card>

        {/* Balance Summary */}
        <Card className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] border-0">
          <div className="text-white text-center">
            <p className="text-white/80 text-sm">Total Saldo</p>
            <p className="text-3xl font-bold mt-1">{formatCurrency(totalBalance)}</p>
          </div>
        </Card>

        {/* Wallets Section */}
        <div>
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">Dompet</h3>
          {wallets.length === 0 ? (
            <Card>
              <p className="text-center text-[var(--color-text-secondary)]">
                Belum ada dompet aktif
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {wallets.map((wallet) => (
                <WalletCard key={wallet.id} wallet={wallet} memberId={member.id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
