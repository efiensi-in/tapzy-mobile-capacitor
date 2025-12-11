import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Loader2, TrendingDown } from 'lucide-react';
import { walletsApi } from '@/api/wallets';
import { membersApi } from '@/api/members';
import { Header } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { formatCurrency, formatNumber } from '@/utils/format';
import { cn } from '@/lib/utils';
import type { SpendingLimit, Wallet } from '@/types/api';

const LIMIT_TYPES = [
  { value: 'daily', label: 'Harian' },
  { value: 'weekly', label: 'Mingguan' },
  { value: 'monthly', label: 'Bulanan' },
  { value: 'per_transaction', label: 'Per Transaksi' },
] as const;

export default function SpendingLimitsPage() {
  const { memberId } = useParams<{ memberId: string }>();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [limitType, setLimitType] = useState<string>('daily');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  // Fetch member
  const { data: memberData } = useQuery({
    queryKey: ['member', memberId],
    queryFn: () => membersApi.get(memberId!),
    enabled: !!memberId,
  });

  // Fetch wallets
  const { data: walletsData, isLoading } = useQuery({
    queryKey: ['wallets', memberId],
    queryFn: () => walletsApi.getWallets(memberId!),
    enabled: !!memberId,
  });

  // Fetch spending limits
  const { isLoading: isLimitsLoading } = useQuery({
    queryKey: ['spending-limits', memberId],
    queryFn: () => walletsApi.getSpendingLimits(memberId!),
    enabled: !!memberId,
  });

  const member = memberData?.data;
  const wallets = walletsData?.data?.wallets || [];

  // Create limit mutation
  const createMutation = useMutation({
    mutationFn: (data: { wallet_id: string; limit_type: string; amount: number; is_active: boolean }) =>
      walletsApi.createSpendingLimit(memberId!, data as Parameters<typeof walletsApi.createSpendingLimit>[1]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spending-limits', memberId] });
      queryClient.invalidateQueries({ queryKey: ['wallets', memberId] });
      setIsDialogOpen(false);
      setAmount('');
      setError('');
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Gagal membuat limit');
    },
  });

  // Delete limit mutation
  const deleteMutation = useMutation({
    mutationFn: (limitId: string) => walletsApi.deleteSpendingLimit(memberId!, limitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spending-limits', memberId] });
      queryClient.invalidateQueries({ queryKey: ['wallets', memberId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const numAmount = parseInt(amount.replace(/\D/g, ''), 10);
    if (!numAmount || numAmount < 1000) {
      setError('Minimal limit Rp 1.000');
      return;
    }

    createMutation.mutate({
      wallet_id: selectedWallet,
      limit_type: limitType,
      amount: numAmount,
      is_active: true,
    });
  };

  // Group limits by wallet
  const limitsByWallet = wallets.reduce((acc, wallet) => {
    if (wallet.spending_limits && wallet.spending_limits.length > 0) {
      acc[wallet.id] = {
        wallet,
        limits: wallet.spending_limits,
      };
    }
    return acc;
  }, {} as Record<string, { wallet: Wallet; limits: SpendingLimit[] }>);

  return (
    <div className="min-h-screen pb-6">
      <Header
        showBack
        title={member ? `Batas ${member.name}` : 'Batas Pengeluaran'}
        rightAction={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8">
                <Plus className="h-4 w-4 mr-1" />
                Tambah
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Batas Pengeluaran</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {error && (
                  <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Pilih Dompet</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {wallets.map((wallet) => (
                      <button
                        key={wallet.id}
                        type="button"
                        onClick={() => setSelectedWallet(wallet.id)}
                        className={cn(
                          'p-3 rounded-lg border text-left text-sm',
                          selectedWallet === wallet.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border/50'
                        )}
                      >
                        {wallet.wallet_type_label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tipe Limit</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {LIMIT_TYPES.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setLimitType(type.value)}
                        className={cn(
                          'p-3 rounded-lg border text-sm',
                          limitType === type.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border/50'
                        )}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="limit-amount">Nominal Batas</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      Rp
                    </span>
                    <Input
                      id="limit-amount"
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      value={amount ? formatNumber(parseInt(amount.replace(/\D/g, ''), 10)) : ''}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!selectedWallet || !amount || createMutation.isPending}
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan'
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="px-4">
        {isLoading || isLimitsLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : Object.keys(limitsByWallet).length === 0 ? (
          <EmptyState
            icon={TrendingDown}
            title="Belum ada batas pengeluaran"
            description="Tambahkan batas untuk mengontrol pengeluaran anak Anda"
            action={
              <Button size="sm" onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Batas
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {Object.values(limitsByWallet).map(({ wallet, limits: walletLimits }) => (
              <div key={wallet.id} className="bg-card rounded-xl border border-border/50">
                <div className="p-4 border-b border-border/50">
                  <h3 className="font-semibold">{wallet.wallet_type_label}</h3>
                </div>
                <div className="divide-y divide-border/50">
                  {walletLimits.map((limit) => (
                    <div key={limit.id} className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">
                          {LIMIT_TYPES.find((t) => t.value === limit.limit_type)?.label}
                        </p>
                        <p className="text-sm text-primary font-semibold">
                          {formatCurrency(limit.amount)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => deleteMutation.mutate(limit.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
