import { Moon, Sun, Palette, Bell, Globe, Info } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Header } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen pb-6">
      <Header showBack title="Pengaturan" />

      <div className="px-4">
        {/* Theme Settings */}
        <div className="bg-card rounded-xl border border-border/50 mb-6">
          <div className="p-4 border-b border-border/50">
            <h3 className="font-semibold">Tampilan</h3>
          </div>
          <div className="divide-y divide-border/50">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                {isDark ? (
                  <Moon className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Sun className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium">Mode Gelap</p>
                  <p className="text-xs text-muted-foreground">
                    {isDark ? 'Aktif' : 'Tidak aktif'}
                  </p>
                </div>
              </div>
              <Button
                variant={isDark ? 'default' : 'outline'}
                size="sm"
                onClick={toggleTheme}
                className="min-w-[80px]"
              >
                {isDark ? 'ON' : 'OFF'}
              </Button>
            </div>

            {/* Theme Color */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Palette className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Warna Tema</p>
                  <p className="text-xs text-muted-foreground">
                    Pilih warna utama aplikasi
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {[
                  { name: 'Hijau', color: 'bg-emerald-500', active: true },
                  { name: 'Biru', color: 'bg-blue-500', active: false },
                  { name: 'Ungu', color: 'bg-purple-500', active: false },
                  { name: 'Oranye', color: 'bg-orange-500', active: false },
                ].map((colorOption) => (
                  <button
                    key={colorOption.name}
                    className={cn(
                      'h-10 w-10 rounded-full transition-all',
                      colorOption.color,
                      colorOption.active
                        ? 'ring-2 ring-offset-2 ring-primary'
                        : 'opacity-50 hover:opacity-75'
                    )}
                    title={colorOption.name}
                    disabled={!colorOption.active}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Warna lain akan tersedia segera
              </p>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-card rounded-xl border border-border/50 mb-6">
          <div className="p-4 border-b border-border/50">
            <h3 className="font-semibold">Notifikasi</h3>
          </div>
          <div className="divide-y divide-border/50">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Push Notification</p>
                  <p className="text-xs text-muted-foreground">
                    Terima notifikasi transaksi
                  </p>
                </div>
              </div>
              <Badge variant="outline">Soon</Badge>
            </div>
          </div>
        </div>

        {/* Language Settings */}
        <div className="bg-card rounded-xl border border-border/50 mb-6">
          <div className="p-4 border-b border-border/50">
            <h3 className="font-semibold">Bahasa</h3>
          </div>
          <div className="divide-y divide-border/50">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Bahasa Aplikasi</p>
                  <p className="text-xs text-muted-foreground">
                    Indonesia
                  </p>
                </div>
              </div>
              <Badge variant="outline">Soon</Badge>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-card rounded-xl border border-border/50">
          <div className="p-4 border-b border-border/50">
            <h3 className="font-semibold">Tentang</h3>
          </div>
          <div className="divide-y divide-border/50">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Versi Aplikasi</p>
                  <p className="text-xs text-muted-foreground">
                    1.0.0
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Tapzy Guardian App
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            &copy; 2025 Tapzy. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
