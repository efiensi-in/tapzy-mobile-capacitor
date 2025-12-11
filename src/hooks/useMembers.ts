import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { membersApi } from '../api/members';
import type { ClaimMemberRequest } from '../types/api';

export const MEMBERS_KEYS = {
  all: ['members'] as const,
  list: () => [...MEMBERS_KEYS.all, 'list'] as const,
  detail: (id: string) => [...MEMBERS_KEYS.all, 'detail', id] as const,
};

export function useMembers() {
  return useQuery({
    queryKey: MEMBERS_KEYS.list(),
    queryFn: () => membersApi.list(),
  });
}

export function useMember(memberId: string) {
  return useQuery({
    queryKey: MEMBERS_KEYS.detail(memberId),
    queryFn: () => membersApi.get(memberId),
    enabled: !!memberId,
  });
}

export function useClaimMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ClaimMemberRequest) => membersApi.claim(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBERS_KEYS.all });
    },
  });
}
