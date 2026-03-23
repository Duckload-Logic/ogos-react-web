import { useQuery } from "@tanstack/react-query";
import { GetIIRByMe, GetIIRByUserId } from "../services/service";
import { QUERY_KEYS } from "@/config/queryKeys";
import { CACHE_TIMING } from "@/config/constants";

export function useUserIIR(userID?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.iir.inventory.byUserId(userID || ""),
    queryFn: async () => {
      if (!userID) return null;

      return GetIIRByUserId(userID);
    },
    staleTime: CACHE_TIMING.LONG.staleTime,
    gcTime: CACHE_TIMING.LONG.gcTime,
    enabled: !!userID,
  });
}
