import { useQuery } from "@tanstack/react-query";
import { slipService } from "../services";
import { QUERY_KEYS } from "@/config/queryKeys";
import { CACHE_TIMING } from "@/config/constants";

export function useGetSlipAttachments(slipId?: number) {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.slips.attachments(slipId || 0),
    ],
    queryFn: () =>
      slipId
        ? slipService.GetSlipAttachments(slipId)
        : [],
    enabled: !!slipId,
    staleTime: CACHE_TIMING.MEDIUM.staleTime,
    gcTime: CACHE_TIMING.MEDIUM.gcTime,
    refetchOnWindowFocus: false,
  });
}
