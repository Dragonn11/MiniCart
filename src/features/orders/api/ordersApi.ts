import apiClient from '@api/client';
import type { Order, PaginatedResponse } from '@api/types';

export const ordersApi = {
  getAll: async (page: number = 1, limit: number = 5): Promise<PaginatedResponse<Order>> => {
    const { data } = await apiClient.get(`/orders?page=${page}&limit=${limit}`);
    return data;
  },

  place: async (): Promise<Order> => {
    const { data } = await apiClient.post('/orders');
    return data;
  },
};
