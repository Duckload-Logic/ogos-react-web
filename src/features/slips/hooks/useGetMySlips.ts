import { useQuery } from "@tanstack/react-query";
import { slipService } from "../services";
import { useMe } from "@/features/users/hooks/useMe";
import { QueryParams } from "../types/params";

const MY_SLIPS_QUERY_KEY = "my-slips";
const MY_SLIPS_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const MY_SLIPS_GC_TIME = 30 * 60 * 1000; // 30 minutes

export function useGetMySlips(params?: QueryParams) {
  const { data: me } = useMe();
  return useQuery({
    queryKey: [MY_SLIPS_QUERY_KEY, me?.id, params],
    queryFn: () => slipService.getMySlips({ params }),
    staleTime: MY_SLIPS_STALE_TIME,
    gcTime: MY_SLIPS_GC_TIME,
    refetchOnWindowFocus: false,
    enabled: !!me, // Only fetch if user data is available
  });
}
