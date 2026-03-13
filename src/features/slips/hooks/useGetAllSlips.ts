import { useQuery } from "@tanstack/react-query";
import { slipService } from "../services";
import { QUERY_KEYS } from "@/config/queryKeys";
import { CACHE_TIMING } from "@/config/constants";
import { QueryParams } from "../types/params";

export function useGetAllSlips(params?: QueryParams) {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.slips.all,
      "all",
      params,
    ],
    queryFn: () =>
      slipService.GetAllSlips(params),
    staleTime: CACHE_TIMING.SHORT.staleTime,
    gcTime: CACHE_TIMING.SHORT.gcTime,
    refetchOnWindowFocus: false,
  });
}
