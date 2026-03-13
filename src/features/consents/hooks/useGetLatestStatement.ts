import { useQuery } from "@tanstack/react-query";
import { GetLatestStatement } from "../services";
import { QUERY_KEYS } from "@/config/queryKeys";
import { CACHE_TIMING } from "@/config/constants";
import { Statement } from "../types/statement";

export function useGetLatestStatement(
  statementType: string,
) {
  return useQuery({
    queryKey: QUERY_KEYS.consents.latest(
      statementType,
    ),
    queryFn: (): Promise<Statement> =>
      GetLatestStatement(statementType, {
        handlerName: 'useGetLatestStatement',
        stepName: 'Fetch Statement',
      }),
    staleTime: CACHE_TIMING.LONG.staleTime,
    gcTime: CACHE_TIMING.LONG.gcTime,
    enabled: !!statementType,
  });
}
