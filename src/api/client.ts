import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { storage } from '../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle 401 - try refresh token
    if (error.response?.status === 401 && originalRequest) {
      try {
        const token = await storage.getToken();
        if (token) {
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const newToken = response.data.data?.token || response.data.token;
          if (newToken) {
            await storage.setToken(newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          }
        }
      } catch {
        // Refresh failed, clear token
        await storage.removeToken();
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
