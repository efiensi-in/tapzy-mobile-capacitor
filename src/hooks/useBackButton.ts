import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

const ROOT_ROUTES = ['/home', '/login', '/'];

export function useBackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const backButtonListener = App.addListener('backButton', ({ canGoBack }) => {
      const isRootRoute = ROOT_ROUTES.includes(location.pathname);

      if (isRootRoute) {
        // Exit app on root routes
        App.exitApp();
      } else if (canGoBack) {
        // Navigate back
        navigate(-1);
      } else {
        // Fallback to home
        navigate('/home', { replace: true });
      }
    });

    return () => {
      backButtonListener.then((listener) => listener.remove());
    };
  }, [navigate, location.pathname]);
}
