import { Eye, EyeOff, TrendingUp } from 'lucide-react';
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
        'relative overflow-hidden rounded-2xl',
        'bg-gradient-to-br from-primary via-primary/90 to-primary/80',
        'p-6 text-primary-foreground',
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-3/4 h-full bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-1/2 h-full bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-primary-foreground/80">Total Saldo</p>
          <button
            onClick={() => setIsHidden(!isHidden)}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            {isHidden ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Balance */}
        <div className="mb-4">
          <h2 className="text-3xl font-bold">
            {isHidden ? '••••••••' : formatCurrency(totalBalance)}
          </h2>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary-foreground/80" />
            <span className="text-sm text-primary-foreground/80">
              {membersCount} anak terdaftar
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
