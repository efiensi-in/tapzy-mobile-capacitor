import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Input, Card } from '../../components/ui';
import { AxiosError } from 'axios';

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  password_confirmation?: string;
}

export default function RegisterPage() {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setFieldErrors({});

    try {
      await register(form);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string; errors?: Record<string, string[]> }>;
      setError(axiosError.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.');

      if (axiosError.response?.data?.errors) {
        const errors: FormErrors = {};
        Object.entries(axiosError.response.data.errors).forEach(([key, messages]) => {
          errors[key as keyof FormErrors] = messages[0];
        });
        setFieldErrors(errors);
      }
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
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Daftar Akun</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Buat akun guardian baru</p>
      </div>

      {/* Register Form */}
      <Card className="max-w-md mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <Input
            label="Nama Lengkap"
            type="text"
            name="name"
            placeholder="Masukkan nama lengkap"
            value={form.name}
            onChange={handleChange}
            error={fieldErrors.name}
            required
            autoComplete="name"
          />

          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="nama@email.com"
            value={form.email}
            onChange={handleChange}
            error={fieldErrors.email}
            required
            autoComplete="email"
          />

          <Input
            label="Nomor Telepon"
            type="tel"
            name="phone"
            placeholder="08xxxxxxxxxx"
            value={form.phone}
            onChange={handleChange}
            error={fieldErrors.phone}
            required
            autoComplete="tel"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Minimal 8 karakter"
            value={form.password}
            onChange={handleChange}
            error={fieldErrors.password}
            required
            autoComplete="new-password"
          />

          <Input
            label="Konfirmasi Password"
            type="password"
            name="password_confirmation"
            placeholder="Ulangi password"
            value={form.password_confirmation}
            onChange={handleChange}
            error={fieldErrors.password_confirmation}
            required
            autoComplete="new-password"
          />

          <Button type="submit" fullWidth isLoading={isLoading}>
            Daftar
          </Button>
        </form>

        <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-[var(--color-primary)] font-medium">
            Masuk
          </Link>
        </p>
      </Card>
    </div>
  );
}
