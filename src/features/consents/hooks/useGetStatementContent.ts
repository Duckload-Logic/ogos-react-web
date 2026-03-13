import { GetStatementContent } from "../services";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/config/queryKeys";
import { CACHE_TIMING } from "@/config/constants";

export function useGetStatementContent(
  statementType: string,
  statementId?: number,
) {
  return useQuery({
    queryKey: QUERY_KEYS.consents.latestContent(
      statementType,
    ),
    queryFn: (): Promise<string> =>
      GetStatementContent(statementType, {
        handlerName: 'useGetStatementContent',
        stepName: 'Fetch Content',
      }),
    staleTime: CACHE_TIMING.LONG.staleTime,
    gcTime: CACHE_TIMING.LONG.gcTime,
    enabled: !!statementId,
  });
}
