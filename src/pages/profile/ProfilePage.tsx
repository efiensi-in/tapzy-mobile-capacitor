import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Settings,
  ChevronRight,
  LogOut,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts';
import { Header } from '@/components/layout';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { user, guardian, logout } = useAuth();

  // Get initials from name
  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      await logout();
    }
  };

  const menuItems = [
    {
      icon: User,
      label: 'Edit Profil',
      href: '/profile/edit',
      disabled: true,
    },
    {
      icon: Shield,
      label: 'Keamanan',
      href: '/profile/security',
      disabled: true,
    },
    {
      icon: Settings,
      label: 'Pengaturan',
      href: '/settings',
    },
    {
      icon: HelpCircle,
      label: 'Bantuan',
      href: '/help',
      disabled: true,
    },
  ];

  return (
    <div className="min-h-screen pb-6">
      <Header title="Profil" showSettings />

      <div className="px-4">
        {/* Profile Card */}
        <div className="bg-card rounded-xl border border-border/50 p-6 mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold truncate">{user?.name}</h2>
              <p className="text-sm text-muted-foreground">Guardian</p>
              {guardian?.is_verified ? (
                <Badge className="mt-1 bg-success/10 text-success border-success/30">
                  Terverifikasi
                </Badge>
              ) : (
                <Badge variant="outline" className="mt-1">
                  Belum Terverifikasi
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-card rounded-xl border border-border/50 mb-6">
          <div className="p-4 border-b border-border/50">
            <h3 className="font-semibold">Informasi Akun</h3>
          </div>
          <div className="divide-y divide-border/50">
            <div className="flex items-center gap-3 p-4">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Telepon</p>
                <p className="text-sm">{guardian?.phone || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">NIK</p>
                <p className="text-sm">{guardian?.nik || 'Belum diisi'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-card rounded-xl border border-border/50 mb-6">
          <div className="divide-y divide-border/50">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.disabled ? '#' : item.href}
                className={cn(
                  'flex items-center gap-3 p-4 transition-colors',
                  item.disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-accent/50'
                )}
                onClick={(e) => item.disabled && e.preventDefault()}
              >
                <item.icon className="h-5 w-5 text-muted-foreground" />
                <span className="flex-1">{item.label}</span>
                {!item.disabled && (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
                {item.disabled && (
                  <Badge variant="outline" className="text-xs">Soon</Badge>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-card rounded-xl border border-border/50 p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {guardian?.approved_members_count || 0}
            </p>
            <p className="text-xs text-muted-foreground">Anak Terdaftar</p>
          </div>
          <div className="bg-card rounded-xl border border-border/50 p-4 text-center">
            <p className="text-2xl font-bold text-warning">
              {guardian?.pending_claims_count || 0}
            </p>
            <p className="text-xs text-muted-foreground">Menunggu Persetujuan</p>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          variant="outline"
          className="w-full h-12 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Keluar
        </Button>

        {/* Version */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Tapzy Guardian v1.0.0
        </p>
      </div>
    </div>
  );
}
