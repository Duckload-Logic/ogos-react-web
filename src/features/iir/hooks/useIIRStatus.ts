import { useQuery } from "@tanstack/react-query";
import { GetIIRByUserId } from "../services/service";
import { useMe } from "@/features/users/hooks/useMe";
import { QUERY_KEYS } from "@/config/queryKeys";
import { CACHE_TIMING } from "@/config/constants";

export function useIIRStatus() {
  const { data: me } = useMe({});
  const userId = me?.id;

  return useQuery({
    queryKey: QUERY_KEYS.iir.inventory.byUserId(userId || ""),
    queryFn: async () => {
      const iirRecord = await GetIIRByUserId(userId || "");
      console.debug("Fetched IIR Record:", iirRecord);
      return iirRecord?.isSubmitted;
    },
    enabled: !!userId,
    staleTime: CACHE_TIMING.MEDIUM.staleTime,
    gcTime: CACHE_TIMING.MEDIUM.gcTime,
  });
}
