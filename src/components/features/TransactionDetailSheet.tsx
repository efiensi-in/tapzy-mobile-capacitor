import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDateTime } from '@/utils/format';
import type { Transaction } from '@/types/api';
import { ShoppingBag, ArrowUpCircle, ArrowRightLeft, CheckCircle, Clock, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionDetailSheetProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionDetailSheet({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailSheetProps) {
  if (!transaction) return null;

  const typeConfig: Record<string, { icon: typeof ShoppingBag; label: string; color: string; bgColor: string }> = {
    purchase: {
      icon: ShoppingBag,
      label: 'Pembelian',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    payment: {
      icon: ShoppingBag,
      label: 'Pembayaran',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    topup: {
      icon: ArrowUpCircle,
      label: 'Top Up',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    top_up: {
      icon: ArrowUpCircle,
      label: 'Top Up',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    deposit: {
      icon: ArrowUpCircle,
      label: 'Deposit',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    transfer: {
      icon: ArrowRightLeft,
      label: 'Transfer',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
  };

  const defaultType = {
    icon: ShoppingBag,
    label: 'Transaksi',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/10',
  };

  const statusConfig = {
    completed: { icon: CheckCircle, label: 'Berhasil', color: 'text-success', bgColor: 'bg-success/10' },
    pending: { icon: Clock, label: 'Menunggu', color: 'text-warning', bgColor: 'bg-warning/10' },
    failed: { icon: XCircle, label: 'Gagal', color: 'text-destructive', bgColor: 'bg-destructive/10' },
  };

  const type = transaction.transaction_type
    ? (typeConfig[transaction.transaction_type] || defaultType)
    : defaultType;
  const status = statusConfig[transaction.status] || statusConfig.completed;
  const Icon = type.icon;
  const StatusIcon = status.icon;

  // Calculate total from items
  const calculateTotal = (): number => {
    if (transaction.amount && transaction.amount !== '') {
      return parseFloat(transaction.amount) || 0;
    }
    if (transaction.total && transaction.total !== '') {
      return parseFloat(transaction.total) || 0;
    }
    if (transaction.items && transaction.items.length > 0) {
      return transaction.items.reduce((acc, item) => {
        return acc + (parseFloat(item.subtotal) || 0);
      }, 0);
    }
    return 0;
  };

  const totalAmount = calculateTotal();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-auto">
        {/* Handle bar */}
        <div className="flex justify-center pt-2 pb-4">
          <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
        </div>

        <SheetHeader className="pb-0">
          <div className="flex items-center gap-3">
            <div className={cn('h-12 w-12 rounded-full flex items-center justify-center', type.bgColor)}>
              <Icon className={cn('h-6 w-6', type.color)} />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-lg">
                {transaction.tenant?.name || type.label}
              </SheetTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {transaction.transaction_code}
              </p>
            </div>
            <Badge className={cn('text-xs', status.bgColor, status.color, 'border-0')}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {status.label}
            </Badge>
          </div>
        </SheetHeader>

        <div className="px-4 py-4">
          {/* Transaction Info */}
          <div className="bg-card rounded-xl border border-border/50 p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-muted-foreground">Tanggal</span>
              <span className="text-sm font-medium">{formatDateTime(transaction.created_at)}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-muted-foreground">Dompet</span>
              <span className="text-sm font-medium">{transaction.wallet?.wallet_type_label || '-'}</span>
            </div>
            {transaction.notes && (
              <div className="flex justify-between items-start">
                <span className="text-sm text-muted-foreground">Catatan</span>
                <span className="text-sm font-medium text-right max-w-[60%]">{transaction.notes}</span>
              </div>
            )}
          </div>

          {/* Items */}
          {transaction.items && transaction.items.length > 0 && (
            <div className="bg-card rounded-xl border border-border/50 p-4 mb-4">
              <h4 className="font-semibold mb-3">Detail Pembelian</h4>
              <div className="space-y-3">
                {transaction.items.map((item, index) => (
                  <div key={item.id || index} className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity}x {item.unit_price ? formatCurrency(item.unit_price) : ''}
                      </p>
                    </div>
                    <p className="text-sm font-medium ml-3">
                      {formatCurrency(item.subtotal)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border/50 my-3" />

              {/* Subtotal, discount, tax if available */}
              {transaction.subtotal && transaction.subtotal !== '' && (
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(transaction.subtotal)}</span>
                </div>
              )}
              {transaction.discount && parseFloat(transaction.discount) > 0 && (
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-muted-foreground">Diskon</span>
                  <span className="text-success">-{formatCurrency(transaction.discount)}</span>
                </div>
              )}
              {transaction.tax && parseFloat(transaction.tax) > 0 && (
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-muted-foreground">Pajak</span>
                  <span>{formatCurrency(transaction.tax)}</span>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between items-center pt-2">
                <span className="font-semibold">Total</span>
                <span className={cn('text-lg font-bold', type.color)}>
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>
          )}

          {/* If no items, just show total */}
          {(!transaction.items || transaction.items.length === 0) && (
            <div className="bg-card rounded-xl border border-border/50 p-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className={cn('text-xl font-bold', type.color)}>
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
