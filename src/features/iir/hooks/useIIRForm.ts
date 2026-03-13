import { useQuery } from "@tanstack/react-query";
import { GetIIRByUserId } from "../services/service";
import { QUERY_KEYS } from "@/config/queryKeys";
import { CACHE_TIMING } from "@/config/constants";
import { IIRForm } from "../types/IIRForm";
import { EMPTY_IIR_FORM } from "../constants";

export function useIIRForm(userID: number) {
  return useQuery({
    queryKey: QUERY_KEYS.iir.inventory.byUserId(
      userID,
    ),
    queryFn: async () => {
      return GetIIRByUserId(userID) as Promise<
        IIRForm
      >;
    },
    enabled: !!userID,
    staleTime: CACHE_TIMING.MEDIUM.staleTime,
    gcTime: CACHE_TIMING.MEDIUM.gcTime,
    initialData: EMPTY_IIR_FORM,
  });
}
