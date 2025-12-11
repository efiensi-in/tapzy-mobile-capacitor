import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useMembers } from '../../hooks/useMembers';
import { Card, Avatar, Badge, Spinner } from '../../components/ui';
import { PageHeader } from '../../components/layout';
import { formatCurrency } from '../../utils/format';
import type { Member } from '../../types/api';

function MemberCard({ member }: { member: Member }) {
  const totalBalance = member.wallets?.reduce(
    (sum, w) => sum + parseFloat(w.balance),
    0
  ) || 0;

  return (
    <Link to={`/members/${member.id}`}>
      <Card className="hover:border-[var(--color-primary)] transition-colors">
        <div className="flex items-center gap-4">
          <Avatar
            src={member.photo_url}
            name={member.name}
            size="lg"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[var(--color-text)] truncate">
              {member.name}
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {member.organization.name}
            </p>
            <p className="text-lg font-bold text-[var(--color-primary)] mt-1">
              {formatCurrency(totalBalance)}
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

export default function HomePage() {
  const { user, guardian } = useAuth();
  const { data, isLoading, error } = useMembers();

  const members = data?.data.members || [];
  const totalBalance = members.reduce((sum, member) => {
    const memberBalance = member.wallets?.reduce(
      (wSum, w) => wSum + parseFloat(w.balance),
      0
    ) || 0;
    return sum + memberBalance;
  }, 0);

  return (
    <div>
      <PageHeader title="Beranda" />

      <div className="p-4 space-y-6">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] border-0">
          <div className="text-white">
            <p className="text-white/80 text-sm">Selamat datang,</p>
            <h2 className="text-xl font-bold mt-1">{user?.name}</h2>
            <div className="mt-4">
              <p className="text-white/80 text-sm">Total Saldo Anak</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(totalBalance)}</p>
            </div>
            {guardian && (
              <div className="flex gap-4 mt-4 text-sm">
                <div>
                  <span className="text-white/80">Anak Terdaftar</span>
                  <p className="font-semibold">{guardian.approved_members_count}</p>
                </div>
                {guardian.pending_claims_count > 0 && (
                  <div>
                    <span className="text-white/80">Pending</span>
                    <p className="font-semibold">{guardian.pending_claims_count}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Members Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Daftar Anak</h2>
            {members.length > 0 && (
              <Badge variant="info">{members.length} anak</Badge>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : error ? (
            <Card>
              <p className="text-center text-[var(--color-error)]">
                Gagal memuat data. Silakan coba lagi.
              </p>
            </Card>
          ) : members.length === 0 ? (
            <Card>
              <div className="text-center py-4">
                <p className="text-[var(--color-text-secondary)]">
                  Belum ada anak yang terdaftar
                </p>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                  Hubungi sekolah untuk mendaftarkan anak Anda
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {members.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
