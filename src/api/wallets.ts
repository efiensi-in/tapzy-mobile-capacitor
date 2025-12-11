import apiClient from './client';
import type {
  ApiResponse,
  WalletsResponse,
  TopupRequest,
  TopupResponse,
  TransactionsResponse,
  DepositsResponse,
  SpendingLimit,
  CreateSpendingLimitRequest,
  UpdateSpendingLimitRequest,
} from '../types/api';

export const walletsApi = {
  // Get member wallets
  getWallets: async (memberId: string) => {
    const response = await apiClient.get<ApiResponse<WalletsResponse>>(
      `/guardian/members/${memberId}/wallets`
    );
    return response.data;
  },

  // Top-up wallet
  topup: async (memberId: string, walletId: string, data: TopupRequest) => {
    const response = await apiClient.post<ApiResponse<TopupResponse>>(
      `/guardian/members/${memberId}/wallets/${walletId}/topup`,
      data
    );
    return response.data;
  },

  // Get member transactions
  getTransactions: async (
    memberId: string,
    params?: { per_page?: number; page?: number; wallet_id?: string }
  ) => {
    const response = await apiClient.get<ApiResponse<TransactionsResponse>>(
      `/guardian/members/${memberId}/transactions`,
      { params }
    );
    return response.data;
  },

  // Get deposit history (all members)
  getDeposits: async (params?: { per_page?: number; page?: number }) => {
    const response = await apiClient.get<ApiResponse<DepositsResponse>>(
      '/guardian/deposits',
      { params }
    );
    return response.data;
  },

  // Spending limits
  getSpendingLimits: async (memberId: string) => {
    const response = await apiClient.get<ApiResponse<SpendingLimit[]>>(
      `/guardian/members/${memberId}/spending-limits`
    );
    return response.data;
  },

  createSpendingLimit: async (memberId: string, data: CreateSpendingLimitRequest) => {
    const response = await apiClient.post<ApiResponse<SpendingLimit>>(
      `/guardian/members/${memberId}/spending-limits`,
      data
    );
    return response.data;
  },

  updateSpendingLimit: async (
    memberId: string,
    limitId: string,
    data: UpdateSpendingLimitRequest
  ) => {
    const response = await apiClient.put<ApiResponse<SpendingLimit>>(
      `/guardian/members/${memberId}/spending-limits/${limitId}`,
      data
    );
    return response.data;
  },

  deleteSpendingLimit: async (memberId: string, limitId: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(
      `/guardian/members/${memberId}/spending-limits/${limitId}`
    );
    return response.data;
  },
};
