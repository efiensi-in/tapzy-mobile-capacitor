import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { walletsApi } from '../api/wallets';
import type { TopupRequest, CreateSpendingLimitRequest, UpdateSpendingLimitRequest } from '../types/api';

export const WALLET_KEYS = {
  all: ['wallets'] as const,
  memberWallets: (memberId: string) => [...WALLET_KEYS.all, 'member', memberId] as const,
  transactions: (memberId: string) => [...WALLET_KEYS.all, 'transactions', memberId] as const,
  deposits: () => [...WALLET_KEYS.all, 'deposits'] as const,
  spendingLimits: (memberId: string) => [...WALLET_KEYS.all, 'spending-limits', memberId] as const,
};

export function useMemberWallets(memberId: string) {
  return useQuery({
    queryKey: WALLET_KEYS.memberWallets(memberId),
    queryFn: () => walletsApi.getWallets(memberId),
    enabled: !!memberId,
  });
}

export function useTopup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memberId,
      walletId,
      data,
    }: {
      memberId: string;
      walletId: string;
      data: TopupRequest;
    }) => walletsApi.topup(memberId, walletId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: WALLET_KEYS.memberWallets(variables.memberId),
      });
      queryClient.invalidateQueries({ queryKey: WALLET_KEYS.deposits() });
    },
  });
}

export function useMemberTransactions(
  memberId: string,
  options?: { walletId?: string; perPage?: number }
) {
  return useInfiniteQuery({
    queryKey: [...WALLET_KEYS.transactions(memberId), options],
    queryFn: ({ pageParam = 1 }) =>
      walletsApi.getTransactions(memberId, {
        page: pageParam,
        per_page: options?.perPage || 15,
        wallet_id: options?.walletId,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage.data;
      return pagination.current_page < pagination.last_page
        ? pagination.current_page + 1
        : undefined;
    },
    enabled: !!memberId,
  });
}

export function useDeposits(perPage = 15) {
  return useInfiniteQuery({
    queryKey: [...WALLET_KEYS.deposits(), perPage],
    queryFn: ({ pageParam = 1 }) =>
      walletsApi.getDeposits({ page: pageParam, per_page: perPage }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage.data;
      return pagination.current_page < pagination.last_page
        ? pagination.current_page + 1
        : undefined;
    },
  });
}

export function useSpendingLimits(memberId: string) {
  return useQuery({
    queryKey: WALLET_KEYS.spendingLimits(memberId),
    queryFn: () => walletsApi.getSpendingLimits(memberId),
    enabled: !!memberId,
  });
}

export function useCreateSpendingLimit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memberId,
      data,
    }: {
      memberId: string;
      data: CreateSpendingLimitRequest;
    }) => walletsApi.createSpendingLimit(memberId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: WALLET_KEYS.spendingLimits(variables.memberId),
      });
    },
  });
}

export function useUpdateSpendingLimit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memberId,
      limitId,
      data,
    }: {
      memberId: string;
      limitId: string;
      data: UpdateSpendingLimitRequest;
    }) => walletsApi.updateSpendingLimit(memberId, limitId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: WALLET_KEYS.spendingLimits(variables.memberId),
      });
    },
  });
}

export function useDeleteSpendingLimit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ memberId, limitId }: { memberId: string; limitId: string }) =>
      walletsApi.deleteSpendingLimit(memberId, limitId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: WALLET_KEYS.spendingLimits(variables.memberId),
      });
    },
  });
}
