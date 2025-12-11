import { NavLink } from 'react-router-dom';
import { Home, History, User, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
}

const navItems: NavItem[] = [
  { to: '/home', icon: Home, label: 'Beranda' },
  { to: '/deposits', icon: History, label: 'Riwayat' },
  { to: '/profile', icon: User, label: 'Profil' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-[max(env(safe-area-inset-bottom),8px)]">
      <div className="bg-card/95 backdrop-blur-sm mx-4 rounded-full border border-border">
        <div className="flex items-center justify-around py-2 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-center p-3 rounded-full transition-all duration-200',
                  isActive
                    ? 'text-primary bg-primary/15'
                    : 'text-muted-foreground hover:text-foreground'
                )
              }
            >
              {({ isActive }) => (
                <item.icon
                  className={cn(
                    'h-5 w-5 transition-transform duration-200',
                    isActive && 'scale-110'
                  )}
                />
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
