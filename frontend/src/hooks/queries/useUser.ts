// hooks/queries/useUser.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export const useUser = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/profile');
      return res.data.user;
    },
    staleTime: 1000 * 60 * 2, // 2 mins
  });
};
