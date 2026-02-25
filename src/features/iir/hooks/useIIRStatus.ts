import { useQuery } from "@tanstack/react-query";
import { checkStudentOnboardingStatus } from "../services/service";

const STUDENT_ONBOARDING_STATUS_QUERY_KEY = "studentOnboardingStatus";
const STUDENT_ONBOARDING_STATUS_STALE_TIME = 1000 * 60 * 30; // 30 minutes
const STUDENT_ONBOARDING_STATUS_GC_TIME = 1000 * 60 * 60 * 12; // 12 hours

export function useStudentOnboardingStatus(userID: number) {
  return useQuery({
    queryKey: [STUDENT_ONBOARDING_STATUS_QUERY_KEY, userID],
    queryFn: () => checkStudentOnboardingStatus(userID),
    enabled: !!userID,
    staleTime: STUDENT_ONBOARDING_STATUS_STALE_TIME,
    gcTime: STUDENT_ONBOARDING_STATUS_GC_TIME,
  });
}
