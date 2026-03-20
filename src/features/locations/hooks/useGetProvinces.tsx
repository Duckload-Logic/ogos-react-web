import { useQuery } from "@tanstack/react-query";
import { GetProvinces } from "../services";
import { CACHE_TIMING } from "@/config/constants";
import { QUERY_KEYS } from "@/config/queryKeys";

export function useGetProvinces(regionCode: string) {
  return useQuery({
    queryKey: QUERY_KEYS.locations.provinces(regionCode),
    queryFn: async () => {
      return GetProvinces(regionCode, {
        handlerName: "useGetProvinces",
        stepName: "Fetch Provinces",
      });
    },
    enabled: !!regionCode,
    staleTime: CACHE_TIMING.MEDIUM.staleTime,
    gcTime: CACHE_TIMING.MEDIUM.gcTime,
  });
}
