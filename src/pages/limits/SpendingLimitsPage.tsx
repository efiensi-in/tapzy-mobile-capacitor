import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Trash2,
  Loader2,
  TrendingDown,
  Clock,
  Calendar,
  Edit2,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { walletsApi } from '@/api/wallets';
import { Header } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { SpendingLimitsPageSkeleton } from '@/components/skeletons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatCurrency, formatNumber } from '@/utils/format';
import { cn } from '@/lib/utils';
import type { SpendingLimit, CreateSpendingLimitRequest, UpdateSpendingLimitRequest } from '@/types/api';

const APPLY_ON_OPTIONS = [
  { value: 'all_days', label: 'Setiap Hari' },
  { value: 'weekdays', label: 'Hari Kerja' },
  { value: 'weekends', label: 'Akhir Pekan' },
] as const;

export default function SpendingLimitsPage() {
  const { memberId } = useParams<{ memberId: string }>();
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLimit, setEditingLimit] = useState<SpendingLimit | null>(null);
  const [error, setError] = useState('');

  // Form state
  const [selectedWalletId, setSelectedWalletId] = useState('');
  const [limitName, setLimitName] = useState('');
  const [dailyLimit, setDailyLimit] = useState('');
  const [perTransactionLimit, setPerTransactionLimit] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [applyOn, setApplyOn] = useState<string>('all_days');
  const [isActive, setIsActive] = useState(true);

  // Fetch spending limits
  const { data: limitsData, isLoading } = useQuery({
    queryKey: ['spending-limits', memberId],
    queryFn: () => walletsApi.getSpendingLimits(memberId!),
    enabled: !!memberId,
  });

  // Fetch wallets for the form
  const { data: walletsData } = useQuery({
    queryKey: ['wallets', memberId],
    queryFn: () => walletsApi.getWallets(memberId!),
    enabled: !!memberId,
  });

  const member = limitsData?.data?.member;
  const limits = limitsData?.data?.spending_limits || [];
  const wallets = walletsData?.data?.wallets || [];

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateSpendingLimitRequest) =>
      walletsApi.createSpendingLimit(memberId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spending-limits', memberId] });
      closeDialog();
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Gagal membuat limit');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ limitId, data }: { limitId: string; data: UpdateSpendingLimitRequest }) =>
      walletsApi.updateSpendingLimit(memberId!, limitId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spending-limits', memberId] });
      closeDialog();
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Gagal memperbarui limit');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (limitId: string) => walletsApi.deleteSpendingLimit(memberId!, limitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spending-limits', memberId] });
    },
  });

  // Toggle active mutation
  const toggleMutation = useMutation({
    mutationFn: ({ limitId, isActive }: { limitId: string; isActive: boolean }) =>
      walletsApi.updateSpendingLimit(memberId!, limitId, { is_active: isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spending-limits', memberId] });
    },
  });

  const resetForm = () => {
    setSelectedWalletId('');
    setLimitName('');
    setDailyLimit('');
    setPerTransactionLimit('');
    setStartTime('');
    setEndTime('');
    setApplyOn('all_days');
    setIsActive(true);
    setError('');
    setEditingLimit(null);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  // Format time to HH:MM (remove seconds if present)
  const formatTimeHHMM = (time: string | null): string => {
    if (!time) return '';
    // Handle "HH:MM:SS" -> "HH:MM"
    return time.substring(0, 5);
  };

  const openEditDialog = (limit: SpendingLimit) => {
    setEditingLimit(limit);
    setSelectedWalletId(limit.wallet_id);
    setLimitName(limit.limit_name || '');
    setDailyLimit(limit.daily_limit ? String(parseInt(limit.daily_limit)) : '');
    setPerTransactionLimit(limit.per_transaction_limit ? String(parseInt(limit.per_transaction_limit)) : '');
    setStartTime(formatTimeHHMM(limit.allowed_start_time));
    setEndTime(formatTimeHHMM(limit.allowed_end_time));
    setApplyOn(limit.apply_on || 'all_days');
    setIsActive(limit.is_active);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const daily = dailyLimit ? parseInt(dailyLimit.replace(/\D/g, ''), 10) : undefined;
    const perTx = perTransactionLimit ? parseInt(perTransactionLimit.replace(/\D/g, ''), 10) : undefined;

    if (!daily && !perTx) {
      setError('Minimal isi salah satu limit (harian atau per transaksi)');
      return;
    }

    const data: CreateSpendingLimitRequest | UpdateSpendingLimitRequest = {
      limit_name: limitName || undefined,
      daily_limit: daily,
      per_transaction_limit: perTx,
      // Ensure time is in HH:MM format (no seconds)
      allowed_start_time: startTime ? formatTimeHHMM(startTime) : undefined,
      allowed_end_time: endTime ? formatTimeHHMM(endTime) : undefined,
      apply_on: applyOn as 'all_days' | 'weekdays' | 'weekends' | 'specific_dates',
      is_active: isActive,
    };

    if (editingLimit) {
      updateMutation.mutate({ limitId: editingLimit.id, data });
    } else {
      createMutation.mutate({ ...data, wallet_id: selectedWalletId } as CreateSpendingLimitRequest);
    }
  };

  const handleDelete = (limitId: string) => {
    if (confirm('Hapus batas pengeluaran ini?')) {
      deleteMutation.mutate(limitId);
    }
  };

  const handleToggle = (limit: SpendingLimit) => {
    toggleMutation.mutate({ limitId: limit.id, isActive: !limit.is_active });
  };

  // Group limits by wallet
  const limitsByWallet = limits.reduce((acc, limit) => {
    const walletId = limit.wallet_id;
    if (!acc[walletId]) {
      acc[walletId] = {
        wallet: limit.wallet,
        limits: [],
      };
    }
    acc[walletId].limits.push(limit);
    return acc;
  }, {} as Record<string, { wallet: SpendingLimit['wallet']; limits: SpendingLimit[] }>);

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen pb-6">
      <Header
        showBack
        title={member ? `Batas ${member.name}` : 'Batas Pengeluaran'}
        rightAction={
          <Button size="sm" className="h-8" onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-1" />
            Tambah
          </Button>
        }
      />

      <div className="px-4">
        {isLoading ? (
          <SpendingLimitsPageSkeleton />
        ) : limits.length === 0 ? (
          <EmptyState
            icon={TrendingDown}
            title="Belum ada batas pengeluaran"
            description="Tambahkan batas untuk mengontrol pengeluaran anak Anda"
            action={
              <Button size="sm" onClick={openCreateDialog}>
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
                  {wallet.wallet_name && (
                    <p className="text-xs text-muted-foreground">{wallet.wallet_name}</p>
                  )}
                </div>
                <div className="divide-y divide-border/50">
                  {walletLimits.map((limit) => (
                    <div key={limit.id} className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">
                              {limit.limit_name || 'Batas Pengeluaran'}
                            </p>
                            <Badge
                              variant={limit.is_active ? 'default' : 'secondary'}
                              className={cn(
                                'text-xs',
                                limit.is_active
                                  ? 'bg-success/10 text-success border-success/30'
                                  : 'bg-muted text-muted-foreground'
                              )}
                            >
                              {limit.is_active ? 'Aktif' : 'Nonaktif'}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {APPLY_ON_OPTIONS.find((o) => o.value === limit.apply_on)?.label || 'Setiap Hari'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleToggle(limit)}
                            disabled={toggleMutation.isPending}
                          >
                            {limit.is_active ? (
                              <ToggleRight className="h-4 w-4 text-success" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditDialog(limit)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(limit.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {limit.daily_limit && parseInt(limit.daily_limit) > 0 && (
                          <div className="bg-accent/30 rounded-lg p-2">
                            <p className="text-xs text-muted-foreground">Harian</p>
                            <p className="font-semibold text-primary">
                              {formatCurrency(limit.daily_limit)}
                            </p>
                          </div>
                        )}
                        {limit.per_transaction_limit && parseInt(limit.per_transaction_limit) > 0 && (
                          <div className="bg-accent/30 rounded-lg p-2">
                            <p className="text-xs text-muted-foreground">Per Transaksi</p>
                            <p className="font-semibold text-primary">
                              {formatCurrency(limit.per_transaction_limit)}
                            </p>
                          </div>
                        )}
                      </div>

                      {(limit.allowed_start_time || limit.allowed_end_time) && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>
                            {limit.allowed_start_time || '00:00'} - {limit.allowed_end_time || '23:59'}
                          </span>
                        </div>
                      )}

                      {(limit.effective_from || limit.effective_until) && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {limit.effective_from?.split('T')[0] || 'Mulai'} - {limit.effective_until?.split('T')[0] || 'Selamanya'}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingLimit ? 'Edit Batas Pengeluaran' : 'Tambah Batas Pengeluaran'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                {error}
              </div>
            )}

            {!editingLimit && (
              <div className="space-y-2">
                <Label>Pilih Dompet</Label>
                <div className="grid grid-cols-2 gap-2">
                  {wallets.map((wallet) => (
                    <button
                      key={wallet.id}
                      type="button"
                      onClick={() => setSelectedWalletId(wallet.id)}
                      className={cn(
                        'p-3 rounded-lg border text-left text-sm',
                        selectedWalletId === wallet.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border/50'
                      )}
                    >
                      {wallet.wallet_type_label || wallet.wallet_type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="limit-name">Nama Batas (opsional)</Label>
              <Input
                id="limit-name"
                type="text"
                placeholder="Contoh: Batas Jajan Harian"
                value={limitName}
                onChange={(e) => setLimitName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="daily-limit">Limit Harian</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    Rp
                  </span>
                  <Input
                    id="daily-limit"
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={dailyLimit ? formatNumber(parseInt(dailyLimit.replace(/\D/g, ''), 10)) : ''}
                    onChange={(e) => setDailyLimit(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="per-tx-limit">Limit Per Transaksi</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    Rp
                  </span>
                  <Input
                    id="per-tx-limit"
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={perTransactionLimit ? formatNumber(parseInt(perTransactionLimit.replace(/\D/g, ''), 10)) : ''}
                    onChange={(e) => setPerTransactionLimit(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Berlaku Pada</Label>
              <div className="grid grid-cols-3 gap-2">
                {APPLY_ON_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setApplyOn(option.value)}
                    className={cn(
                      'p-2 rounded-lg border text-xs',
                      applyOn === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border/50'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="start-time">Jam Mulai</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time">Jam Selesai</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
              <div>
                <p className="font-medium text-sm">Status</p>
                <p className="text-xs text-muted-foreground">
                  {isActive ? 'Batas aktif diterapkan' : 'Batas tidak aktif'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className="text-primary"
              >
                {isActive ? (
                  <ToggleRight className="h-8 w-8" />
                ) : (
                  <ToggleLeft className="h-8 w-8 text-muted-foreground" />
                )}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={(!editingLimit && !selectedWalletId) || isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : editingLimit ? (
                'Simpan Perubahan'
              ) : (
                'Tambah Batas'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
