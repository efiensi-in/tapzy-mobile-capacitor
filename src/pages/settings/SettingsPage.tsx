import { Moon, Sun, Palette, Bell, Globe, Info, Check } from 'lucide-react';
import { useTheme } from '@/contexts';
import { Header } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ColorTheme } from '@/utils/storage';

const colorOptions: { name: string; value: ColorTheme; color: string }[] = [
  { name: 'Hijau', value: 'emerald', color: 'bg-emerald-500' },
  { name: 'Biru', value: 'blue', color: 'bg-blue-500' },
  { name: 'Ungu', value: 'purple', color: 'bg-purple-500' },
  { name: 'Oranye', value: 'orange', color: 'bg-orange-500' },
];

export default function SettingsPage() {
  const { isDark, toggleTheme, colorTheme, setColorTheme } = useTheme();

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
              <div className="flex gap-3">
                {colorOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setColorTheme(option.value)}
                    className={cn(
                      'h-10 w-10 rounded-full transition-all flex items-center justify-center',
                      option.color,
                      colorTheme === option.value
                        ? 'ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110'
                        : 'opacity-70 hover:opacity-100 hover:scale-105'
                    )}
                    title={option.name}
                  >
                    {colorTheme === option.value && (
                      <Check className="h-5 w-5 text-white" />
                    )}
                  </button>
                ))}
              </div>
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
