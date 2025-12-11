import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { authApi } from '../api/auth';
import { guardianApi } from '../api/guardian';
import { storage } from '../utils/storage';
import { AuthContext, type AuthState } from './auth-context-value';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    guardian: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await storage.getToken();
        if (token) {
          // Use guardian/profile endpoint to get complete data
          const response = await guardianApi.profile();
          setState({
            user: response.data.user,
            guardian: response.data.guardian,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch {
        await storage.removeToken();
        await storage.removeUser();
        setState({
          user: null,
          guardian: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initAuth();
  }, []);

  // Listen for logout events from API interceptor
  useEffect(() => {
    const handleLogout = () => {
      setState({
        user: null,
        guardian: null,
        isAuthenticated: false,
        isLoading: false,
      });
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const login = useCallback(async (data: Parameters<typeof authApi.login>[0]) => {
    const response = await authApi.login(data);
    await storage.setToken(response.data.token);
    await storage.setUser(response.data.user);
    setState({
      user: response.data.user,
      guardian: response.data.guardian,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const register = useCallback(async (data: Parameters<typeof authApi.register>[0]) => {
    const response = await authApi.register(data);
    await storage.setToken(response.data.token);
    await storage.setUser(response.data.user);
    setState({
      user: response.data.user,
      guardian: response.data.guardian,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout errors
    } finally {
      await storage.removeToken();
      await storage.removeUser();
      setState({
        user: null,
        guardian: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const response = await guardianApi.profile();
      setState((prev) => ({
        ...prev,
        user: response.data.user,
        guardian: response.data.guardian,
      }));
    } catch {
      // Ignore refresh errors
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
