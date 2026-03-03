import { useQuery } from "@tanstack/react-query";
import { slipService } from "../services";

const SLIP_STATS_QUERY_KEY = "slipStats";
const SLIP_STATS_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const SLIP_STATS_GC_TIME = 30 * 60 * 1000; // 30 minutes

export function useGetUrgentSlips(params?: any) {
  return useQuery({
    queryKey: [SLIP_STATS_QUERY_KEY, "urgent", params],
    queryFn: async () => {
      const result = await slipService.getUrgentSlips(params);
      console.log("[useGetUrgentSlips] Query result:", result);
      return result;
    },
    staleTime: SLIP_STATS_STALE_TIME,
    gcTime: SLIP_STATS_GC_TIME,
    refetchOnWindowFocus: false,
  });
}
