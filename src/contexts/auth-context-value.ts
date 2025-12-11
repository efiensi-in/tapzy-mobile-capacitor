import { createContext } from 'react';
import type { User, Guardian, LoginRequest, RegisterRequest } from '../types/api';

export interface AuthState {
  user: User | null;
  guardian: Guardian | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
