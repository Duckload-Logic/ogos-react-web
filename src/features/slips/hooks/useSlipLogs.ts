import { useQuery } from "@tanstack/react-query";
import { slipService } from "../services";
import { QUERY_KEYS } from "@/config/queryKeys";
import { CACHE_TIMING } from "@/config/constants";
import { QueryParams } from "../types/params";

export interface SlipLogsParams extends QueryParams {
  startDate?: string;
  endDate?: string;
}

/**
 * Hook to fetch all slips for historical logging
 * Supports filtering by year/month or date range
 */
export function useSlipLogs(params?: SlipLogsParams) {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.slips.all,
      "logs",
      params,
    ],
    queryFn: () =>
      slipService.GetAllSlips(params),
    staleTime: CACHE_TIMING.SHORT.staleTime,
    gcTime: CACHE_TIMING.SHORT.gcTime,
    refetchOnWindowFocus: false,
  });
}
