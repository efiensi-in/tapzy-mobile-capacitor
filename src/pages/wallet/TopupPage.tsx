import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMemberWallets, useTopup } from '../../hooks/useWallets';
import { Card, Button, Input, Spinner } from '../../components/ui';
import { PageHeader } from '../../components/layout';
import { formatCurrency, formatNumber } from '../../utils/format';
import { AxiosError } from 'axios';

const PRESET_AMOUNTS = [10000, 25000, 50000, 100000, 200000, 500000];

export default function TopupPage() {
  const { memberId, walletId } = useParams<{ memberId: string; walletId: string }>();
  const navigate = useNavigate();

  const { data: walletsData, isLoading } = useMemberWallets(memberId!);
  const topupMutation = useTopup();

  const [amount, setAmount] = useState<number>(0);
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const wallet = walletsData?.data.wallets.find((w) => w.id === walletId);
  const member = walletsData?.data.member;

  const handlePresetClick = (preset: number) => {
    setAmount(preset);
    setError('');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setAmount(value ? parseInt(value, 10) : 0);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (amount < 1000) {
      setError('Minimal top-up Rp 1.000');
      return;
    }

    if (amount > 10000000) {
      setError('Maksimal top-up Rp 10.000.000');
      return;
    }

    if (!password) {
      setError('Password diperlukan untuk verifikasi');
      return;
    }

    try {
      await topupMutation.mutateAsync({
        memberId: memberId!,
        walletId: walletId!,
        data: { amount, password, notes: notes || undefined },
      });
      navigate(`/members/${memberId}/wallets/${walletId}`, { replace: true });
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Top-up gagal. Silakan coba lagi.');
    }
  };

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Top-up" showBack />
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      </div>
    );
  }

  if (!wallet || !member) {
    return (
      <div>
        <PageHeader title="Top-up" showBack />
        <div className="p-4">
          <Card>
            <p className="text-center text-[var(--color-error)]">Data tidak ditemukan</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <PageHeader title="Top-up Saldo" showBack />

      <div className="p-4 space-y-6">
        {/* Wallet Info */}
        <Card>
          <div className="text-center">
            <p className="text-sm text-[var(--color-text-secondary)]">{member.name}</p>
            <p className="font-medium text-[var(--color-text)]">{wallet.wallet_type_label}</p>
            <p className="text-sm text-[var(--color-text-secondary)] mt-2">Saldo saat ini</p>
            <p className="text-xl font-bold text-[var(--color-text)]">
              {formatCurrency(wallet.balance)}
            </p>
          </div>
        </Card>

        {/* Top-up Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Jumlah Top-up
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={amount ? formatNumber(amount) : ''}
                onChange={handleAmountChange}
                placeholder="0"
                className="w-full pl-12 pr-4 py-3 text-xl font-bold bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
          </div>

          {/* Preset Amounts */}
          <div className="grid grid-cols-3 gap-2">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  amount === preset
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)]'
                }`}
              >
                {formatCurrency(preset)}
              </button>
            ))}
          </div>

          {/* Password */}
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password Anda"
            hint="Password akun Anda untuk verifikasi"
            required
          />

          {/* Notes */}
          <Input
            label="Catatan (opsional)"
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: Uang jajan minggu ini"
          />

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            isLoading={topupMutation.isPending}
            disabled={amount < 1000}
          >
            Top-up {amount > 0 ? formatCurrency(amount) : ''}
          </Button>
        </form>
      </div>
    </div>
  );
}
