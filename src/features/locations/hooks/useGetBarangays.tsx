import { useQuery } from "@tanstack/react-query";
import { GetBarangays } from "../services";
import { CACHE_TIMING } from "@/config/constants";
import { QUERY_KEYS } from "@/config/queryKeys";

export function useGetBarangays(cityCode: string) {
  return useQuery({
    queryKey: QUERY_KEYS.locations.barangays(cityCode),
    queryFn: async () => {
      return GetBarangays(cityCode, {
        handlerName: "useBarangays",
        stepName: "Fetch Barangays",
      });
    },
    enabled: !!cityCode,
    staleTime: CACHE_TIMING.MEDIUM.staleTime,
    gcTime: CACHE_TIMING.MEDIUM.gcTime,
  });
}
