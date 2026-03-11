import { useQuery } from "@tanstack/react-query";
import { checkStudentOnboardingStatus, iirService } from "../services/service";
import { useMe } from "@/features/users/hooks/useMe";

const STUDENT_ONBOARDING_STATUS_QUERY_KEY = "studentOnboardingStatus";
const STUDENT_ONBOARDING_STATUS_STALE_TIME = 1000 * 60 * 30; // 30 minutes
const STUDENT_ONBOARDING_STATUS_GC_TIME = 1000 * 60 * 60 * 12; // 12 hours

export function useIIRStatus() {
  const { data: me } = useMe({});
  const userId = me?.id;

  return useQuery({
    queryKey: [STUDENT_ONBOARDING_STATUS_QUERY_KEY, userId],
    queryFn: async () => {
      return await iirService.getIIRByUserID(userId || 0);
    },
    enabled: !!userId,
    staleTime: STUDENT_ONBOARDING_STATUS_STALE_TIME,
    gcTime: STUDENT_ONBOARDING_STATUS_GC_TIME,
  });
}
