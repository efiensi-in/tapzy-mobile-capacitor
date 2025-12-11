import apiClient from './client';
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  AuthMeResponse,
  RefreshTokenResponse,
} from '../types/api';

export const authApi = {
  login: async (data: LoginRequest) => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      '/auth/guardian/login',
      data
    );
    return response.data;
  },

  register: async (data: RegisterRequest) => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      '/auth/guardian/register',
      data
    );
    return response.data;
  },

  me: async () => {
    const response = await apiClient.get<ApiResponse<AuthMeResponse>>('/auth/me');
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post<ApiResponse<null>>('/auth/logout');
    return response.data;
  },

  refresh: async () => {
    const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>(
      '/auth/refresh'
    );
    return response.data;
  },
};
