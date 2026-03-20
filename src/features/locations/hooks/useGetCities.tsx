import { useQuery } from "@tanstack/react-query";
import { GetCities } from "../services";
import { CACHE_TIMING } from "@/config/constants";
import { QUERY_KEYS } from "@/config/queryKeys";

export function useGetCities(regionCode?: string, provinceCode?: string) {
  return useQuery({
    queryKey:
      QUERY_KEYS.locations.citiesByRegion(regionCode || "") ||
      QUERY_KEYS.locations.citiesByProvince(provinceCode || ""),
    queryFn: async () => {
      if (provinceCode) {
        return GetCities(undefined, provinceCode, {
          handlerName: "useCities",
          stepName: "Fetch Cities by Province",
        });
      }

      return GetCities(regionCode, undefined, {
        handlerName: "useCities",
        stepName: "Fetch Cities",
      });
    },
    enabled: !!regionCode || !!provinceCode,
    staleTime: CACHE_TIMING.MEDIUM.staleTime,
    gcTime: CACHE_TIMING.MEDIUM.gcTime,
  });
}
