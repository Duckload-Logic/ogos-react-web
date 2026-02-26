import { useQuery } from "@tanstack/react-query";
import { iirService } from "../services/service";

const IIR_QUERY_KEY = "iirId";
const IIR_STALE_TIME = 1000 * 60 * 60; // 1 hour
const IIR_GC_TIME = 1000 * 60 * 60 * 24; // 24 hours

export function useUserIIR(userID?: number) {
  return useQuery({
    queryKey: [IIR_QUERY_KEY, userID],
    queryFn: async () => {
      if (!userID) return null;

      return iirService.getIIRByUserID(userID);
    },
    staleTime: IIR_STALE_TIME,
    gcTime: IIR_GC_TIME,
    enabled: true,
  });
}
