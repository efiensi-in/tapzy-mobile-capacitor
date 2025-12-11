import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { AuthGuard, GuestGuard } from './components/layout/AuthGuard';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Main pages
import HomePage from './pages/home/HomePage';
import MemberDetailPage from './pages/member/MemberDetailPage';
import WalletDetailPage from './pages/wallet/WalletDetailPage';
import TopupPage from './pages/wallet/TopupPage';
import DepositsPage from './pages/home/DepositsPage';
import SettingsPage from './pages/settings/SettingsPage';

const router = createBrowserRouter([
  // Guest routes (only accessible when not logged in)
  {
    path: '/login',
    element: (
      <GuestGuard>
        <LoginPage />
      </GuestGuard>
    ),
  },
  {
    path: '/register',
    element: (
      <GuestGuard>
        <RegisterPage />
      </GuestGuard>
    ),
  },
  // Protected routes (require authentication)
  {
    path: '/',
    element: (
      <AuthGuard>
        <AppLayout>
          <HomePage />
        </AppLayout>
      </AuthGuard>
    ),
  },
  {
    path: '/members/:memberId',
    element: (
      <AuthGuard>
        <AppLayout>
          <MemberDetailPage />
        </AppLayout>
      </AuthGuard>
    ),
  },
  {
    path: '/members/:memberId/wallets/:walletId',
    element: (
      <AuthGuard>
        <AppLayout>
          <WalletDetailPage />
        </AppLayout>
      </AuthGuard>
    ),
  },
  {
    path: '/members/:memberId/wallets/:walletId/topup',
    element: (
      <AuthGuard>
        <TopupPage />
      </AuthGuard>
    ),
  },
  {
    path: '/deposits',
    element: (
      <AuthGuard>
        <AppLayout>
          <DepositsPage />
        </AppLayout>
      </AuthGuard>
    ),
  },
  {
    path: '/settings',
    element: (
      <AuthGuard>
        <AppLayout>
          <SettingsPage />
        </AppLayout>
      </AuthGuard>
    ),
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
