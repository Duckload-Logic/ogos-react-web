import { useQuery } from "@tanstack/react-query";
import { slipService } from "../services";
import { useMe } from "@/features/users/hooks/useMe";
import { QueryParams } from "../types/params";

const EXCUSE_SLIPS_QUERY_KEY = "excuse-slips";
const EXCUSE_SLIPS_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const EXCUSE_SLIPS_GC_TIME = 30 * 60 * 1000; // 30 minutes

export function useSlips({
  isAdmin = false,
  params,
}: { isAdmin?: boolean; params?: QueryParams } = {}) {
  const { data: me } = useMe();
  return useQuery({
    queryKey: [EXCUSE_SLIPS_QUERY_KEY, me?.id, params, isAdmin],
    queryFn: isAdmin
      ? () => slipService.getAllSlips(params)
      : () => slipService.getMySlips({ params }),
    staleTime: EXCUSE_SLIPS_STALE_TIME,
    gcTime: EXCUSE_SLIPS_GC_TIME,
    refetchOnWindowFocus: false,
    enabled: !!me, // Only fetch if user data is available
  });
}
