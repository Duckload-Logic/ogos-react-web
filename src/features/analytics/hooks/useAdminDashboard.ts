import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "../services";
import { QUERY_KEYS } from "@/config/queryKeys";
import { CACHE_TIMING } from "@/config/constants";

/**
 * Hook to fetch Admin Dashboard analytics
 * @param filter Time filter (monthly, weekly, yearly)
 */
export function useAdminDashboard(filter: string = "monthly") {
  return useQuery({
    queryKey: [...QUERY_KEYS.analytics.all, "admin-dashboard", filter],
    queryFn: () => analyticsService.GetAdminDashboard(filter),
    staleTime: CACHE_TIMING.MEDIUM.staleTime,
    gcTime: CACHE_TIMING.MEDIUM.gcTime,
    refetchOnWindowFocus: false,
  });
}
