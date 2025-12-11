import apiClient from './client';
import type { ApiResponse, User, Guardian } from '../types/api';

export interface GuardianProfileResponse {
  user: User;
  guardian: Guardian;
}

export const guardianApi = {
  profile: async () => {
    const response = await apiClient.get<ApiResponse<GuardianProfileResponse>>(
      '/guardian/profile'
    );
    return response.data;
  },
};
