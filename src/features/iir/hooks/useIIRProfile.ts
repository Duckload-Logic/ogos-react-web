import { useQuery } from "@tanstack/react-query";
import { GetIIRResource } from "../services/service";
import { QUERY_KEYS } from "@/config/queryKeys";
import { CACHE_TIMING } from "@/config/constants";
import { IIRForm } from "../types/IIRForm";

export function useIIRProfile(iirId: number) {
  return useQuery<IIRForm>({
    queryKey: QUERY_KEYS.iir.inventory.profile(
      iirId,
    ),
    queryFn: async () => {
      return GetIIRResource(iirId, "IIRProfile");
    },
    enabled: !!iirId,
    staleTime: CACHE_TIMING.MEDIUM.staleTime,
    gcTime: CACHE_TIMING.MEDIUM.gcTime,
  });
}
