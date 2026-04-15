import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../api/ordersApi';
import { cartKeys } from '@features/cart/hooks/useCart';
import { logger } from '@shared/services/logger';

export const orderKeys = {
  all: ['orders'] as const,
  list: (page: number) => ['orders', 'list', page] as const,
};

export function useOrders(page: number) {
  return useQuery({
    queryKey: orderKeys.list(page),
    queryFn: () => ordersApi.getAll(page),
    staleTime: 30 * 1000, 
    gcTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersApi.place,
    onSuccess: () => {
      logger.info('Order placed successfully, invalidating order and cart caches');
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
    onError: () => {
      logger.error('Failed to place order');
    },
  });
}

// for the refresh button order page
export function useInvalidateOrders() {
  const queryClient = useQueryClient();
  return () => {
    logger.info('Manually busting order cache');
    queryClient.invalidateQueries({ queryKey: orderKeys.all });
  };
}
