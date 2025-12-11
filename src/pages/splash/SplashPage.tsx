import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function SplashPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Wait for auth to be checked, then redirect
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          navigate('/home', { replace: true });
        } else {
          navigate('/login', { replace: true });
        }
      }, 1500); // Show splash for 1.5 seconds

      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex flex-col items-center justify-center safe-area">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="mb-8 animate-pulse">
          <div className="h-24 w-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl">
            <span className="text-5xl font-bold text-white">T</span>
          </div>
        </div>

        {/* App name */}
        <h1 className="text-3xl font-bold text-white mb-2">Tapzy</h1>
        <p className="text-white/70 text-sm mb-12">Guardian App</p>

        {/* Loading indicator */}
        <Loader2 className="h-6 w-6 animate-spin text-white/70" />
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center">
        <p className="text-white/50 text-xs">v1.0.0</p>
      </div>
    </div>
  );
}
