import { useAuth } from "@/context";
import { useQuery } from "@tanstack/react-query";
import { GetUserConsent } from "../services";
import { QUERY_KEYS } from "@/config/queryKeys";
import { CACHE_TIMING } from "@/config/constants";

export default function useCheckUserConsent(
  docId?: number,
) {
  const { user } = useAuth();
  return useQuery({
    queryKey: QUERY_KEYS.consents.check(
      docId || 0,
    ),
    queryFn: () =>
      GetUserConsent(docId!, {
        handlerName: 'useCheckUserConsent',
        stepName: 'Check Consent',
      }),
    staleTime: CACHE_TIMING.SHORT.staleTime,
    gcTime: CACHE_TIMING.SHORT.gcTime,
    enabled: !!docId && !!user?.id,
  });
}
