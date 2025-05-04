import { api } from "@/lib/axios";
import { TopMovers } from "@/types/topmover";
import { useQuery } from "@tanstack/react-query";

export const useFetchTopMovers = () => {
    return useQuery({
        queryKey: ['top-movers'],
        queryFn: async () => {
            try {
                const res = await api.get<TopMovers>('/top-movers');
                return res.data;
            } catch (error) {
                console.error("Error fetching top movers:", error);
            }
        },
        staleTime: 1000 * 60 * 5, // 5 mins
    });
}