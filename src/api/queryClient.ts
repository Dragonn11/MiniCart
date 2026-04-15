import { QueryClient } from '@tanstack/react-query';

// react query client with some sensible defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, 
      refetchOnWindowFocus: false,
    },
  },
});
