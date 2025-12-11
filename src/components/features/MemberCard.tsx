import { Link } from 'react-router-dom';
import { ChevronRight, Wallet } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/format';
import type { Member } from '@/types/api';
import { cn } from '@/lib/utils';

interface MemberCardProps {
  member: Member;
  className?: string;
}

export function MemberCard({ member, className }: MemberCardProps) {
  // Calculate total balance from all wallets
  const totalBalance = member.wallets?.reduce((sum, wallet) => {
    return sum + parseFloat(wallet.balance || '0');
  }, 0) || 0;

  // Get initials from name
  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link
      to={`/members/${member.id}`}
      className={cn(
        'flex items-center gap-4 p-4 rounded-xl bg-card hover:bg-accent/50 transition-colors',
        'border border-border/50',
        className
      )}
    >
      {/* Avatar */}
      <Avatar className="h-12 w-12">
        <AvatarImage src={member.photo_url || undefined} alt={member.name} />
        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold truncate">{member.name}</h3>
          {member.claim_status === 'pending' && (
            <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning/30">
              Pending
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {member.organization.name}
        </p>
        <div className="flex items-center gap-1 mt-1 text-primary">
          <Wallet className="h-3.5 w-3.5" />
          <span className="text-sm font-semibold">{formatCurrency(totalBalance)}</span>
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
    </Link>
  );
}
