// hooks/queries/useInfiniteNews.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { NewsResponse } from '@/types/news';

export const useFetchNews = () => {
  return useInfiniteQuery<NewsResponse, Error>({
    queryKey: ['news'],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get<NewsResponse>(`/news?page=${pageParam}&limit=9`);
      return res.data;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.data.length < 3) return undefined; // no more pages
      return pages.length + 1;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 2,
  });
};
