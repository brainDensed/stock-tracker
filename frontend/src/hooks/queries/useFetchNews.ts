// hooks/queries/useUser.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export const useFetchNews = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const res = await api.get('/news');
      return res.data;
    },
    staleTime: 1000 * 60 * 2, // 2 mins
  });
};
