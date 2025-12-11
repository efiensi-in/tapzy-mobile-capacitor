/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts';
import { AppLayout } from '@/components/layout/AppLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { LoadingScreen } from '@/components/ui/loading-screen';

// Lazy load pages for better performance
import { lazy, Suspense, type ReactNode } from 'react';

const SplashPage = lazy(() => import('@/pages/splash/SplashPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const HomePage = lazy(() => import('@/pages/home/HomePage'));
const MemberDetailPage = lazy(() => import('@/pages/members/MemberDetailPage'));
const WalletDetailPage = lazy(() => import('@/pages/wallets/WalletDetailPage'));
const TopupPage = lazy(() => import('@/pages/topup/TopupPage'));
const TransactionsPage = lazy(() => import('@/pages/transactions/TransactionsPage'));
const DepositsPage = lazy(() => import('@/pages/deposits/DepositsPage'));
const SpendingLimitsPage = lazy(() => import('@/pages/limits/SpendingLimitsPage'));
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'));
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'));

// Suspense wrapper
function SuspenseWrapper({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<LoadingScreen message="Memuat..." />}>
      {children}
    </Suspense>
  );
}

// Protected route component
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Memuat..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Guest route component (for login/register - redirect if already logged in)
function GuestRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Memuat..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

export const router = createBrowserRouter([
  // Splash screen
  {
    path: '/',
    element: (
      <SuspenseWrapper>
        <SplashPage />
      </SuspenseWrapper>
    ),
  },

  // Auth routes (guest only)
  {
    element: (
      <GuestRoute>
        <AuthLayout />
      </GuestRoute>
    ),
    children: [
      {
        path: '/login',
        element: (
          <SuspenseWrapper>
            <LoginPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: '/register',
        element: (
          <SuspenseWrapper>
            <RegisterPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },

  // Protected routes (authenticated only)
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/home',
        element: (
          <SuspenseWrapper>
            <HomePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: '/deposits',
        element: (
          <SuspenseWrapper>
            <DepositsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: '/profile',
        element: (
          <SuspenseWrapper>
            <ProfilePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: '/settings',
        element: (
          <SuspenseWrapper>
            <SettingsPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },

  // Protected routes without bottom nav
  {
    element: (
      <ProtectedRoute>
        <AppLayout showBottomNav={false} />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/members/:memberId',
        element: (
          <SuspenseWrapper>
            <MemberDetailPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: '/members/:memberId/wallets/:walletId',
        element: (
          <SuspenseWrapper>
            <WalletDetailPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: '/members/:memberId/topup',
        element: (
          <SuspenseWrapper>
            <TopupPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: '/members/:memberId/transactions',
        element: (
          <SuspenseWrapper>
            <TransactionsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: '/members/:memberId/limits',
        element: (
          <SuspenseWrapper>
            <SpendingLimitsPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },

  // Catch all - redirect to home or login
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
