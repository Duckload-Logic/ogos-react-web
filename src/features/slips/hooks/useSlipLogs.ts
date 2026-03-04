import { useQuery } from "@tanstack/react-query";
import { slipService } from "../services";
import { QueryParams } from "../types/params";

const SLIP_LOGS_QUERY_KEY = "slip-logs";
const SLIP_LOGS_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const SLIP_LOGS_GC_TIME = 30 * 60 * 1000; // 30 minutes

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
    queryKey: [SLIP_LOGS_QUERY_KEY, params],
    queryFn: () => slipService.getAllSlips(params),
    staleTime: SLIP_LOGS_STALE_TIME,
    gcTime: SLIP_LOGS_GC_TIME,
    refetchOnWindowFocus: false,
  });
}
