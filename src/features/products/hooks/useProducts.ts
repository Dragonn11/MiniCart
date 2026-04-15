import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/productsApi';
import type { ProductFilters } from '@api/types';

// query keys - helps with cache invalidation
export const productKeys = {
  all: ['products'] as const,
  list: (filters?: ProductFilters) => ['products', 'list', filters] as const,
  detail: (id: string) => ['products', 'detail', id] as const,
};

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productsApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // products don't change that often, 5min is fine
    gcTime: 10 * 60 * 1000, // keep in cache for 10 min after unmounting
    placeholderData: (prev) => prev, // show old data while fetching new - smoother UX
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productsApi.getById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id, // don't run query if no ID
  });
}
