import { useQuery } from "@tanstack/react-query";
import { slipService } from "../services";
import { QUERY_KEYS } from "@/config/queryKeys";
import { CACHE_TIMING } from "@/config/constants";
import { useMe } from "@/features/users/hooks/useMe";

export function useGetSlipStats(
  { params }: { params?: any } = {},
) {
  const { data: me } = useMe({});
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.slips.stats,
      me?.id,
      params,
    ],
    queryFn: async () => {
      return await slipService.GetSlipStats(params);
    },
    staleTime: CACHE_TIMING.SHORT.staleTime,
    gcTime: CACHE_TIMING.SHORT.gcTime,
    refetchOnWindowFocus: false,
  });
}
