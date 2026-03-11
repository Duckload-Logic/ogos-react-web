import { consentService } from "../services";
import { useQuery } from "@tanstack/react-query";

export function useGetStatementContent(
  statementType: string,
  statementId?: number,
) {
  return useQuery({
    queryKey: ["consentStatement", statementId, statementType],
    queryFn: (): Promise<string> =>
      consentService.getStatementContent(statementType).then((res) => res),
    enabled: !!statementId,
  });
}
