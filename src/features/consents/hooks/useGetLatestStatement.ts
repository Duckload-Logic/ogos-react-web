import { useQuery } from "@tanstack/react-query";
import { consentService } from "../services";
import { Statement } from "../types/statement";

export function useGetLatestStatement(statementType: string) {
  return useQuery({
    queryKey: ["latestConsentStatement", statementType],
    queryFn: (): Promise<Statement> =>
      consentService.getLatestStatement(statementType).then((res) => res),
    enabled: !!statementType,
  });
}
