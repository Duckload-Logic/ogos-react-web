import { useQuery } from "@tanstack/react-query";
import { GetRegions } from "../services";

export function useRegions() {
  return useQuery({
    queryKey: ["locations", "regions", 0],
    queryFn: async () => {
      return GetRegions({
        handlerName: 'useRegions',
        stepName: 'Fetch Regions',
      });
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
