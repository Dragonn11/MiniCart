import apiClient from '@api/client';
import type { CartItem } from '@api/types';

export const cartApi = {
  get: async (): Promise<CartItem[]> => {
    const { data } = await apiClient.get('/cart');
    return data;
  },

  addItem: async (item: CartItem): Promise<CartItem[]> => {
    const { data } = await apiClient.post('/cart/items', item);
    return data;
  },

  updateQuantity: async (productId: string, quantity: number): Promise<CartItem[]> => {
    const { data } = await apiClient.put(`/cart/items/${productId}`, { quantity });
    return data;
  },

  removeItem: async (productId: string): Promise<CartItem[]> => {
    const { data } = await apiClient.delete(`/cart/items/${productId}`);
    return data;
  },
};
