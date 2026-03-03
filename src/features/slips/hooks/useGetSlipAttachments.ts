import { useQuery } from "@tanstack/react-query";
import { slipService } from "../services";

const SLIP_ATTACHMENTS_QUERY_KEY = "slip-attachments";
const SLIP_ATTACHMENTS_STALE_TIME = 10 * 60 * 1000; // 10 minutes
const SLIP_ATTACHMENTS_GC_TIME = 30 * 60 * 1000; // 30 minutes

export function useGetSlipAttachments(slipId?: number) {
  return useQuery({
    queryKey: [SLIP_ATTACHMENTS_QUERY_KEY, slipId],
    queryFn: () => (slipId ? slipService.getSlipAttachments(slipId) : []),
    enabled: !!slipId,
    staleTime: SLIP_ATTACHMENTS_STALE_TIME,
    gcTime: SLIP_ATTACHMENTS_GC_TIME,
    refetchOnWindowFocus: false,
  });
}
