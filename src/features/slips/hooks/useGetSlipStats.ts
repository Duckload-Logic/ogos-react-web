import { useQuery } from "@tanstack/react-query";
import { slipService } from "../services";
import { useMe } from "@/features/users/hooks/useMe";

const SLIP_STATS_QUERY_KEY = "slipStats";
const SLIP_STATS_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const SLIP_STATS_GC_TIME = 30 * 60 * 1000; // 30 minutes

export function useGetSlipStats({ params }: { params?: any } = {}) {
  const { data: me } = useMe({});
  return useQuery({
    queryKey: [SLIP_STATS_QUERY_KEY, me?.id, params],
    queryFn: async () => {
      return await slipService.getSlipStats(params);
    },
    staleTime: SLIP_STATS_STALE_TIME,
    gcTime: SLIP_STATS_GC_TIME,
    refetchOnWindowFocus: false,
  });
}
