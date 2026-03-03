import { useQuery } from "@tanstack/react-query";
import { slipService } from "../services";
import { QueryParams } from "../types/params";

const SLIPS_QUERY_KEY = "slips";
const SLIPS_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const SLIPS_GC_TIME = 30 * 60 * 1000; // 30 minutes

export function useGetAllSlips(params?: QueryParams) {
  return useQuery({
    queryKey: [SLIPS_QUERY_KEY, "all", params],
    queryFn: () => slipService.getAllSlips(params),
    staleTime: SLIPS_STALE_TIME,
    gcTime: SLIPS_GC_TIME,
    refetchOnWindowFocus: false,
  });
}
