import { useQuery } from "@tanstack/react-query";
import { iirService } from "../services/service";
import { IIRForm } from "../types/IIRForm";

const STUDENT_PROFILE_QUERY_KEY = "IIRProfile";
const STUDENT_PROFILE_STALE_TIME = 1000 * 60 * 30; // 30 minutes
const STUDENT_PROFILE_GC_TIME = 1000 * 60 * 60 * 12; // 12 hours

export function useIIRProfile(iirId: number) {
  return useQuery<IIRForm>({
    queryKey: [STUDENT_PROFILE_QUERY_KEY, iirId],
    queryFn: async () => {
      return iirService.getIIRResource(iirId, "IIRProfile");
    },
    enabled: !!iirId,
    staleTime: STUDENT_PROFILE_STALE_TIME,
    gcTime: STUDENT_PROFILE_GC_TIME,
  });
}
