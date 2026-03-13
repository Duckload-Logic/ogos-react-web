import { useQuery } from "@tanstack/react-query";
import { GetIIRByUserId } from "../services/service";
import { useMe } from "@/features/users/hooks/useMe";
import { QUERY_KEYS } from "@/config/queryKeys";
import { CACHE_TIMING } from "@/config/constants";

export function useIIRStatus() {
  const { data: me } = useMe({});
  const userId = me?.id;

  return useQuery({
    queryKey: QUERY_KEYS.iir.inventory.byUserId(
      userId || 0,
    ),
    queryFn: async () => {
      return await GetIIRByUserId(userId || 0);
    },
    enabled: !!userId,
    staleTime: CACHE_TIMING.MEDIUM.staleTime,
    gcTime: CACHE_TIMING.MEDIUM.gcTime,
  });
}
