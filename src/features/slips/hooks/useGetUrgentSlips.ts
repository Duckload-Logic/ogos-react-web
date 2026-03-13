import { useQuery } from "@tanstack/react-query";
import { slipService } from "../services";
import { QUERY_KEYS } from "@/config/queryKeys";
import { CACHE_TIMING } from "@/config/constants";

export function useGetUrgentSlips(params?: any) {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.slips.stats,
      "urgent",
      params,
    ],
    queryFn: async () => {
      const result = await slipService.GetUrgentSlips(
        params,
      );
      return result;
    },
    staleTime: CACHE_TIMING.SHORT.staleTime,
    gcTime: CACHE_TIMING.SHORT.gcTime,
    refetchOnWindowFocus: false,
  });
}
