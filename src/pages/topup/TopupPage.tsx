import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff, Loader2, CheckCircle2, ChevronDown } from 'lucide-react';
import { membersApi } from '@/api/members';
import { walletsApi } from '@/api/wallets';
import { Header } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { TopupPageSkeleton } from '@/components/skeletons';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatCurrency, formatNumber } from '@/utils/format';
import { cn } from '@/lib/utils';

const PRESET_AMOUNTS = [10000, 25000, 50000, 100000, 200000, 500000];
export default function TopupPage() {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedWalletId, setSelectedWalletId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showMemberSelector, setShowMemberSelector] = useState(false);

  // Fetch all members (includes wallets and permissions)
  const { data: membersData, isLoading: isMembersLoading } = useQuery({
    queryKey: ['members'],
    queryFn: () => membersApi.list(),
  });

  // Filter members that can be topped up
  const allMembers = membersData?.data?.members || [];
  const topupableMembers = allMembers.filter((m) => m.permissions?.can_topup);

  // Get current member from list
  const member = topupableMembers.find((m) => m.id === memberId);
  const wallets = member?.wallets?.filter((w) => w.is_active) || [];

  // Get effective wallet ID (use selected or fallback to default)
  const defaultWalletId = wallets.length > 0
    ? (wallets.find((w) => w.wallet_type === 'main')?.id || wallets[0].id)
    : '';
  const effectiveWalletId = selectedWalletId || defaultWalletId;

  // Handle member change
  const handleMemberChange = (newMemberId: string) => {
    setShowMemberSelector(false);
    setSelectedWalletId('');
    setAmount('');
    setPassword('');
    setError('');
    navigate(`/members/${newMemberId}/topup`, { replace: true });
  };

  // Topup mutation
  const topupMutation = useMutation({
    mutationFn: (data: { amount: number; password: string; notes?: string }) =>
      walletsApi.topup(memberId!, effectiveWalletId, data),
    onSuccess: () => {
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['wallets', memberId] });
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['deposits'] });
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Top up gagal. Silakan coba lagi.');
    },
  });

  const handlePresetClick = (presetAmount: number) => {
    setAmount(presetAmount.toString());
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setAmount(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const numAmount = parseInt(amount, 10);
    if (!numAmount || numAmount < 1000) {
      setError('Minimal top up Rp 1.000');
      return;
    }
    if (numAmount > 10000000) {
      setError('Maksimal top up Rp 10.000.000');
      return;
    }
    if (!password) {
      setError('Password diperlukan untuk verifikasi');
      return;
    }

    topupMutation.mutate({
      amount: numAmount,
      password,
      notes: notes || undefined,
    });
  };

  const selectedWallet = wallets.find((w) => w.id === effectiveWalletId);

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header showBack title="Top Up" />
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="text-center">
            <div className="h-20 w-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <h2 className="text-xl font-bold mb-2">Top Up Berhasil!</h2>
            <p className="text-muted-foreground mb-2">
              {formatCurrency(parseInt(amount, 10))} telah ditambahkan ke dompet {member?.name}
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Saldo baru: {formatCurrency(Number(selectedWallet?.balance || 0) + parseInt(amount, 10))}
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Kembali
              </Button>
              <Button onClick={() => navigate('/home')}>
                Ke Beranda
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isMembersLoading) {
    return (
      <div className="min-h-screen pb-6">
        <Header showBack title="Top Up" />
        <TopupPageSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-6">
      <Header showBack title="Top Up" />

      <div className="px-4">
        {/* Member selector */}
        <div className="relative mb-6">
          <button
            type="button"
            onClick={() => setShowMemberSelector(!showMemberSelector)}
            className="w-full bg-card rounded-xl border border-border/50 p-4 text-left flex items-center gap-3 hover:border-primary/50 transition-colors"
          >
            {member ? (
              <>
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                    {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Top up untuk</p>
                  <p className="font-semibold truncate">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.organization?.name}</p>
                </div>
              </>
            ) : (
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Pilih anak untuk top up</p>
              </div>
            )}
            <ChevronDown className={cn(
              "h-5 w-5 text-muted-foreground transition-transform",
              showMemberSelector && "rotate-180"
            )} />
          </button>

          {/* Member dropdown */}
          {showMemberSelector && topupableMembers.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl border border-border/50 shadow-lg z-50 overflow-hidden">
              {topupableMembers.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleMemberChange(m.id)}
                  className={cn(
                    "w-full p-3 flex items-center gap-3 hover:bg-accent/50 transition-colors text-left",
                    m.id === memberId && "bg-primary/5"
                  )}
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {m.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.organization?.name}</p>
                  </div>
                  {m.id === memberId && (
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Wallet selector */}
        {wallets.length > 1 && (
          <div className="mb-6">
            <Label className="mb-2 block">Pilih Dompet</Label>
            <div className="grid grid-cols-2 gap-2">
              {wallets.map((wallet) => (
                <button
                  key={wallet.id}
                  type="button"
                  onClick={() => setSelectedWalletId(wallet.id)}
                  className={cn(
                    'p-3 rounded-xl border text-left transition-all',
                    effectiveWalletId === wallet.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border/50 hover:border-border'
                  )}
                >
                  <p className="text-sm font-medium capitalize">
                    {wallet.wallet_type_label || wallet.wallet_type.replace('_', ' ')}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(wallet.balance)}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Topup form */}
        <GlassCard className="mb-6">
          <GlassCardHeader>
            <GlassCardTitle>Nominal Top Up</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                  {error}
                </div>
              )}

              {/* Preset amounts */}
              <div className="grid grid-cols-3 gap-2">
                {PRESET_AMOUNTS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetClick(preset)}
                    className={cn(
                      'py-3 px-2 rounded-lg border text-sm font-medium transition-all',
                      amount === preset.toString()
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border/50 hover:border-primary/50'
                    )}
                  >
                    {formatNumber(preset)}
                  </button>
                ))}
              </div>

              {/* Custom amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Atau masukkan nominal</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    Rp
                  </span>
                  <Input
                    id="amount"
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={amount ? formatNumber(parseInt(amount, 10)) : ''}
                    onChange={handleAmountChange}
                    className="pl-10 text-right text-lg font-semibold"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password (untuk verifikasi)</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password Anda"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Catatan (opsional)</Label>
                <Input
                  id="notes"
                  type="text"
                  placeholder="Contoh: Uang jajan mingguan"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-12"
                disabled={!amount || !password || topupMutation.isPending}
              >
                {topupMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  `Top Up ${amount ? formatCurrency(parseInt(amount, 10)) : ''}`
                )}
              </Button>
            </form>
          </GlassCardContent>
        </GlassCard>
      </div>
    </div>
  );
}
