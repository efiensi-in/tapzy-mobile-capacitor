import { Link } from 'react-router-dom';
import { ChevronRight, Snowflake } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/format';
import type { Wallet as WalletType } from '@/types/api';
import { cn } from '@/lib/utils';

interface WalletCardProps {
  wallet: WalletType;
  memberId: string;
  compact?: boolean;
  className?: string;
}

export function WalletCard({ wallet, memberId, compact = false, className }: WalletCardProps) {
  const walletIcons: Record<string, string> = {
    main: '💳',
    savings: '🏦',
    meal_allowance: '🍽️',
    transport: '🚌',
  };

  return (
    <Link
      to={`/members/${memberId}/wallets/${wallet.id}`}
      className={cn(
        'flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50',
        'hover:bg-accent/50 transition-colors',
        compact && 'p-3',
        className
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'flex items-center justify-center rounded-lg bg-primary/10',
          compact ? 'h-10 w-10' : 'h-12 w-12'
        )}
      >
        <span className={compact ? 'text-lg' : 'text-xl'}>
          {walletIcons[wallet.wallet_type] || '💰'}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className={cn('font-medium truncate', compact && 'text-sm')}>
            {wallet.wallet_type_label}
          </h4>
          {wallet.is_frozen && (
            <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-500 border-blue-500/30">
              <Snowflake className="h-3 w-3 mr-1" />
              Frozen
            </Badge>
          )}
        </div>
        <p className={cn('text-primary font-semibold', compact ? 'text-sm' : 'text-base')}>
          {formatCurrency(wallet.balance)}
        </p>
      </div>

      {/* Arrow */}
      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
    </Link>
  );
}
