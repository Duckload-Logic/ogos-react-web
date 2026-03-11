import { useQuery } from "@tanstack/react-query";
import { slipService } from "../services";
import { SlipStatus } from "../types";

const SLIP_STATUSES_QUERY_KEY = "slip-statuses";
const SLIP_STATUSES_STALE_TIME = 60 * 60 * 1000; // 1 hour
const SLIP_STATUSES_GC_TIME = 2 * 60 * 60 * 1000; // 2 hours

export function useGetSlipStatuses() {
  return useQuery<SlipStatus[]>({
    queryKey: [SLIP_STATUSES_QUERY_KEY],
    queryFn: () => slipService.getSlipStatuses(),
    staleTime: SLIP_STATUSES_STALE_TIME,
    gcTime: SLIP_STATUSES_GC_TIME,
    refetchOnWindowFocus: false,
  });
}
