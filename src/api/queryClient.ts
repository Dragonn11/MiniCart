import { QueryClient } from '@tanstack/react-query';

// react query client with some sensible defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // retry once on failure, then give up
      refetchOnWindowFocus: false, // don't refetch when user tabs back - kinda annoying
    },
  },
});
