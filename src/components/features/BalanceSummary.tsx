import { Eye, EyeOff, Users, Wallet, User } from 'lucide-react';
import { useState } from 'react';
import { formatCurrency } from '@/utils/format';
import { cn } from '@/lib/utils';

interface BalanceSummaryProps {
  totalBalance: number;
  membersCount: number;
  className?: string;
}

export function BalanceSummary({
  totalBalance,
  membersCount,
  className,
}: BalanceSummaryProps) {
  const [isHidden, setIsHidden] = useState(false);

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl',
        'p-5 text-white',
        className
      )}
      style={{
        background: 'var(--primary-gradient)',
        boxShadow: '0 10px 40px -10px var(--primary-shadow)',
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

        {/* Animated gradient orbs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-teal-300/20 rounded-full blur-2xl" />

        {/* Wave Pattern */}
        <svg
          className="absolute -bottom-1 left-0 w-full h-28 text-black/[0.07]"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,160L40,170.7C80,181,160,203,240,192C320,181,400,139,480,138.7C560,139,640,181,720,197.3C800,213,880,203,960,176C1040,149,1120,107,1200,101.3C1280,96,1360,128,1400,144L1440,160L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
          />
        </svg>
        <svg
          className="absolute -bottom-1 left-0 w-full h-20 text-black/[0.05]"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,186.7C672,192,768,192,864,181.3C960,171,1056,149,1152,149.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Wallet className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-white/80 font-medium uppercase tracking-wider">Total Saldo</p>
            </div>
          </div>
          <button
            onClick={() => setIsHidden(!isHidden)}
            className="h-8 w-8 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all active:scale-95"
            aria-label={isHidden ? 'Tampilkan saldo' : 'Sembunyikan saldo'}
          >
            {isHidden ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Balance */}
        <div className="mb-5">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-medium text-white/80">Rp</span>
            <h2 className="text-[2rem] font-bold tracking-tight leading-none text-white">
              {isHidden ? '••••••••' : formatCurrency(totalBalance).replace('Rp', '').trim()}
            </h2>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4" />

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
              <Users className="h-3.5 w-3.5 text-white/80" />
              <span className="text-sm font-medium">{membersCount} anak terdaftar</span>
            </div>
          </div>
          <div className="flex -space-x-1.5">
            {[...Array(Math.min(membersCount, 3))].map((_, i) => (
              <div
                key={i}
                className="h-6 w-6 rounded-full bg-white/20 backdrop-blur-sm border-2 flex items-center justify-center"
                style={{ borderColor: 'var(--primary-border)' }}
              >
                <User className="h-3 w-3" />
              </div>
            ))}
            {membersCount > 3 && (
              <div
                className="h-6 w-6 rounded-full bg-white/30 backdrop-blur-sm border-2 flex items-center justify-center"
                style={{ borderColor: 'var(--primary-border)' }}
              >
                <span className="text-[9px] font-bold">+{membersCount - 3}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
