import { useQuery } from "@tanstack/react-query";
import { GetBarangays } from "../services";

export function useBarangays(cityId: number) {
  return useQuery({
    queryKey: ["locations", "barangays", cityId],
    queryFn: async () => {
      return GetBarangays(cityId, {
        handlerName: 'useBarangays',
        stepName: 'Fetch Barangays',
      });
    },
    enabled: cityId > 0,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
