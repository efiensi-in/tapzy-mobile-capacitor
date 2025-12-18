import { NavLink, useLocation } from 'react-router-dom';
import { Home, Clock, User, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
}

const navItems: NavItem[] = [
  { to: '/home', icon: Home, label: 'Beranda' },
  { to: '/deposits', icon: Clock, label: 'Riwayat' },
  { to: '/profile', icon: User, label: 'Profil' },
];

export function BottomNav() {
  const location = useLocation();
  const activeIndex = navItems.findIndex(item => location.pathname.startsWith(item.to));

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-[max(env(safe-area-inset-bottom),8px)]">
      {/* Main container */}
      <div className="relative flex items-center justify-center">
        {/* Base kapsul - liquid glass */}
        <div className="liquid-glass rounded-full py-3 px-4">
          <div className="flex items-center gap-1">
            {navItems.map((item, index) => {
              const isActive = activeIndex === index;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'relative z-10 flex items-center justify-center',
                    'rounded-full transition-all duration-500 ease-out',
                    // Ketika active, item "memisah" dengan padding lebih dan efek float
                    isActive
                      ? 'px-5 py-2.5 -my-1 scale-105'
                      : 'px-4 py-2 active:scale-90'
                  )}
                >
                  {/* Liquid droplet background - muncul saat active */}
                  <span
                    className={cn(
                      'absolute inset-0 rounded-full transition-all duration-500 ease-out',
                      isActive
                        ? 'opacity-100 scale-100 liquid-glass-primary shadow-lg shadow-primary/20'
                        : 'opacity-0 scale-75'
                    )}
                  />

                  {/* Icon */}
                  <item.icon
                    className={cn(
                      'relative z-10 transition-all duration-300',
                      isActive
                        ? 'h-5 w-5 stroke-[2.5px] text-primary dark:text-white'
                        : 'h-[18px] w-[18px] stroke-[1.5px] text-muted-foreground dark:text-white/50'
                    )}
                  />

                  {/* Label - hanya muncul saat active */}
                  <span
                    className={cn(
                      'relative z-10 font-medium transition-all duration-300 overflow-hidden',
                      isActive
                        ? 'ml-2 w-auto max-w-[60px] text-xs text-primary dark:text-white opacity-100'
                        : 'ml-0 w-0 max-w-0 text-[0px] opacity-0'
                    )}
                  >
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
