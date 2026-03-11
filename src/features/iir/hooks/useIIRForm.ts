import { useQuery } from "@tanstack/react-query";
import { iirService } from "../services/service";
import { IIRForm } from "../types/IIRForm";
import { EMPTY_IIR_FORM } from "../constants";

const IIR_FORM_QUERY_KEY = "iirForm";
const IIR_FORM_STALE_TIME = 1000 * 60 * 30; // 30 minutes
const IIR_FORM_GC_TIME = 1000 * 60 * 60 * 12; // 12 hours

export function useIIRForm(userID: number) {
  return useQuery({
    queryKey: [IIR_FORM_QUERY_KEY, userID],
    queryFn: async () => {
      return iirService.getIIRByUserID(userID) as Promise<IIRForm>;
    },
    enabled: !!userID,
    staleTime: IIR_FORM_STALE_TIME,
    gcTime: IIR_FORM_GC_TIME,
    initialData: EMPTY_IIR_FORM,
  });
}
