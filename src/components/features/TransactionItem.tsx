import { ShoppingBag, ArrowUpCircle, ArrowRightLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import { formatCurrency, formatRelativeTime } from '@/utils/format';
import type { Transaction } from '@/types/api';
import { cn } from '@/lib/utils';

interface TransactionItemProps {
  transaction: Transaction;
  showMember?: boolean;
  memberName?: string;
  className?: string;
}

export function TransactionItem({
  transaction,
  showMember = false,
  memberName,
  className,
}: TransactionItemProps) {
  const typeConfig: Record<string, { icon: typeof ShoppingBag; label: string; color: string; bgColor: string; prefix: string }> = {
    purchase: {
      icon: ShoppingBag,
      label: 'Pembelian',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      prefix: '-',
    },
    payment: {
      icon: ShoppingBag,
      label: 'Pembayaran',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      prefix: '-',
    },
    topup: {
      icon: ArrowUpCircle,
      label: 'Top Up',
      color: 'text-success',
      bgColor: 'bg-success/10',
      prefix: '+',
    },
    top_up: {
      icon: ArrowUpCircle,
      label: 'Top Up',
      color: 'text-success',
      bgColor: 'bg-success/10',
      prefix: '+',
    },
    deposit: {
      icon: ArrowUpCircle,
      label: 'Deposit',
      color: 'text-success',
      bgColor: 'bg-success/10',
      prefix: '+',
    },
    transfer: {
      icon: ArrowRightLeft,
      label: 'Transfer',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      prefix: '',
    },
  };

  const defaultType = {
    icon: ArrowRightLeft,
    label: 'Transaksi',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/10',
    prefix: '',
  };

  const statusConfig = {
    completed: {
      icon: CheckCircle,
      label: 'Berhasil',
      color: 'text-success',
    },
    pending: {
      icon: Clock,
      label: 'Menunggu',
      color: 'text-warning',
    },
    failed: {
      icon: XCircle,
      label: 'Gagal',
      color: 'text-destructive',
    },
  };

  const type = typeConfig[transaction.transaction_type] || defaultType;
  const status = statusConfig[transaction.status] || statusConfig.completed;
  const Icon = type.icon;
  const StatusIcon = status.icon;

  return (
    <div
      className={cn(
        'flex items-center gap-3 py-3',
        className
      )}
    >
      {/* Icon */}
      <div className={cn('h-10 w-10 rounded-full flex items-center justify-center', type.bgColor)}>
        <Icon className={cn('h-5 w-5', type.color)} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium truncate">
            {transaction.tenant?.name || type.label}
          </h4>
          {transaction.status !== 'completed' && (
            <StatusIcon className={cn('h-3.5 w-3.5 flex-shrink-0', status.color)} />
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {showMember && memberName && (
            <>
              <span className="truncate max-w-[100px]">{memberName}</span>
              <span>•</span>
            </>
          )}
          <span>{formatRelativeTime(transaction.created_at)}</span>
        </div>
      </div>

      {/* Amount */}
      <div className="text-right">
        <p className={cn('text-sm font-semibold', type.color)}>
          {type.prefix}{formatCurrency(transaction.amount)}
        </p>
        <p className="text-xs text-muted-foreground">
          {transaction.wallet?.wallet_type_label || 'Wallet'}
        </p>
      </div>
    </div>
  );
}
