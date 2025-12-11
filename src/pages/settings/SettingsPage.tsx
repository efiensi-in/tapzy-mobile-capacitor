import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, Button, Avatar } from '../../components/ui';
import { PageHeader } from '../../components/layout';

export default function SettingsPage() {
  const { user, guardian, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  return (
    <div>
      <PageHeader title="Pengaturan" />

      <div className="p-4 space-y-6">
        {/* Profile Card */}
        <Card>
          <div className="flex items-center gap-4">
            <Avatar name={user?.name || ''} size="xl" />
            <div>
              <h2 className="text-lg font-bold text-[var(--color-text)]">{user?.name}</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">{user?.email}</p>
              {guardian?.phone && (
                <p className="text-sm text-[var(--color-text-secondary)]">{guardian.phone}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Settings Options */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
            Tampilan
          </h3>
          <Card padding="none">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-surface)] flex items-center justify-center">
                  {theme === 'dark' ? '🌙' : '☀️'}
                </div>
                <div className="text-left">
                  <p className="font-medium text-[var(--color-text)]">Mode Tema</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {theme === 'dark' ? 'Gelap' : 'Terang'}
                  </p>
                </div>
              </div>
              <div
                className={`w-12 h-7 rounded-full p-1 transition-colors ${
                  theme === 'dark' ? 'bg-[var(--color-primary)]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </button>
          </Card>
        </div>

        {/* Account Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
            Akun
          </h3>
          <Card padding="none">
            <div className="divide-y divide-[var(--color-border)]">
              {guardian?.nik && (
                <div className="flex items-center justify-between p-4">
                  <span className="text-[var(--color-text)]">NIK</span>
                  <span className="text-[var(--color-text-secondary)]">{guardian.nik}</span>
                </div>
              )}
              <div className="flex items-center justify-between p-4">
                <span className="text-[var(--color-text)]">Status Verifikasi</span>
                <span
                  className={
                    guardian?.is_verified
                      ? 'text-[var(--color-success)]'
                      : 'text-[var(--color-warning)]'
                  }
                >
                  {guardian?.is_verified ? 'Terverifikasi' : 'Belum Terverifikasi'}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* App Info */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
            Aplikasi
          </h3>
          <Card padding="none">
            <div className="flex items-center justify-between p-4">
              <span className="text-[var(--color-text)]">Versi</span>
              <span className="text-[var(--color-text-secondary)]">1.0.0</span>
            </div>
          </Card>
        </div>

        {/* Logout Button */}
        <Button
          variant="danger"
          fullWidth
          onClick={handleLogout}
          isLoading={isLoggingOut}
        >
          Keluar
        </Button>
      </div>
    </div>
  );
}
