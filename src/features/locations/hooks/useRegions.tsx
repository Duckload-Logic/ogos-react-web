import { useQuery } from "@tanstack/react-query";
import { locationService } from "../services";

export function useRegions() {
  return useQuery({
    queryKey: ["locations", "regions", 0],
    queryFn: async () => {
      return locationService.getRegions();
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
