import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Input, Card } from '../../components/ui';
import { AxiosError } from 'axios';

export default function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login({
        email: form.email,
        password: form.password,
        device_name: 'mobile_app',
      });
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Login gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col justify-center px-4 py-8 safe-top safe-bottom">
      {/* Logo & Title */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[var(--color-primary)] rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">T</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Tapzy Guardian</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Masuk ke akun Anda</p>
      </div>

      {/* Login Form */}
      <Card className="max-w-md mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="nama@email.com"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Masukkan password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />

          <Button type="submit" fullWidth isLoading={isLoading}>
            Masuk
          </Button>
        </form>

        <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
          Belum punya akun?{' '}
          <Link to="/register" className="text-[var(--color-primary)] font-medium">
            Daftar sekarang
          </Link>
        </p>
      </Card>
    </div>
  );
}
