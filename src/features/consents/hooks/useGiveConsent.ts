import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostConsent } from "../services";
import { QUERY_KEYS } from "@/config/queryKeys";
import { useMe } from "@/features/users/hooks/useMe";

interface ConsentPayload {
  type: string;
  docId: number;
}

export function useGiveConsent() {
  const queryClient = useQueryClient();
  const { data: me } = useMe({});

  return useMutation({
    mutationFn: async (
      { type, docId }: ConsentPayload,
    ) => {
      return PostConsent(type, docId, {
        handlerName: 'useGiveConsent',
        stepName: 'Submit Consent',
      });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.consents.check(
          variables.docId,
        ),
      });
    },
  });
}
