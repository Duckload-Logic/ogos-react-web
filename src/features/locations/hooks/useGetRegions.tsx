import { useQuery } from "@tanstack/react-query";
import { GetRegions } from "../services";
import { CACHE_TIMING } from "@/config/constants";
import { QUERY_KEYS } from "@/config/queryKeys";

export function useGetRegions() {
  return useQuery({
    queryKey: QUERY_KEYS.locations.regions,
    queryFn: async () => {
      return GetRegions({
        handlerName: "useRegions",
        stepName: "Fetch Regions",
      });
    },
    staleTime: CACHE_TIMING.MEDIUM.staleTime,
    gcTime: CACHE_TIMING.MEDIUM.gcTime,
  });
}
