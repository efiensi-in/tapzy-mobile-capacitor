import apiClient from './client';
import type {
  ApiResponse,
  Member,
  MembersResponse,
  ClaimMemberRequest,
} from '../types/api';

export const membersApi = {
  list: async () => {
    const response = await apiClient.get<ApiResponse<MembersResponse>>(
      '/guardian/members'
    );
    return response.data;
  },

  get: async (memberId: string) => {
    const response = await apiClient.get<ApiResponse<Member>>(
      `/guardian/members/${memberId}`
    );
    return response.data;
  },

  claim: async (data: ClaimMemberRequest) => {
    const response = await apiClient.post<ApiResponse<{ claim_status: string; member: Member }>>(
      '/guardian/claim',
      data
    );
    return response.data;
  },
};
