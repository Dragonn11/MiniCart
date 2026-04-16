import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '../api/cartApi';
import type { CartItem } from '@api/types';
import { logger } from '@shared/services/logger';

export const cartKeys = {
  all: ['cart'] as const,
};

// cart should always be fresh since it can change from multiple places
export function useCart() {
  return useQuery({
    queryKey: cartKeys.all,
    queryFn: cartApi.get,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  });
}

// optimistic updates
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.addItem,
    onMutate: async (newItem: CartItem) => {
      // cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: cartKeys.all });
      const previous = queryClient.getQueryData<CartItem[]>(cartKeys.all);

      // optimistically update the cache
      queryClient.setQueryData<CartItem[]>(cartKeys.all, (old = []) => {
        const existing = old.find((i) => i.productId === newItem.productId);
        if (existing) {
          // item already in cart increase the quantity
          return old.map((i) =>
            i.productId === newItem.productId
              ? { ...i, quantity: i.quantity + newItem.quantity }
              : i
          );
        }
        // new item, add it to cart
        return [...old, newItem];
      });
      return { previous }; // save for rollback if needed
    },
    onError: (_err, _item, context) => {
      logger.warn('Add to cart failed, rolling back optimistic update');
      // rollback to previous state
      if (context?.previous) {
        queryClient.setQueryData(cartKeys.all, context.previous);
      }
    },
    onSettled: () => {
      // always refetch to make sure we're in sync with server
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

export function useUpdateCartQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartApi.updateQuantity(productId, quantity),
    onMutate: async ({ productId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.all });
      const previous = queryClient.getQueryData<CartItem[]>(cartKeys.all);
      queryClient.setQueryData<CartItem[]>(cartKeys.all, (old = []) =>
        old.map((i) => (i.productId === productId ? { ...i, quantity } : i))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      logger.warn('Update cart failed, rolling back optimistic update');
      if (context?.previous) {
        queryClient.setQueryData(cartKeys.all, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.removeItem,
    onMutate: async (productId: string) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.all });
      const previous = queryClient.getQueryData<CartItem[]>(cartKeys.all);
      queryClient.setQueryData<CartItem[]>(cartKeys.all, (old = []) =>
        old.filter((i) => i.productId !== productId)
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      logger.warn('Remove from cart failed, rolling back optimistic update');
      if (context?.previous) {
        queryClient.setQueryData(cartKeys.all, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}
