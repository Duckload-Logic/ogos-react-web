import { useQuery } from "@tanstack/react-query";
import { locationService } from "../services";

export function useCities(regionId: number) {
  return useQuery({
    queryKey: ["locations", "cities", regionId],
    queryFn: async () => {
      return locationService.getCities(regionId);
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
