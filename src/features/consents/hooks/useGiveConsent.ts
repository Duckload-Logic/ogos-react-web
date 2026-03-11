import { useMutation, useQueryClient } from "@tanstack/react-query";
import { consentService } from "../services";
import { useMe } from "@/features/users/hooks/useMe";

interface ConsentPayload {
  type: string;
  docId: number;
}

export function useGiveConsent() {
  const queryClient = useQueryClient();
  const { data: me } = useMe();

  return useMutation({
    mutationFn: async ({ type, docId }: ConsentPayload) => {
      return consentService.giveConsent(type, docId);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["userConsent", me?.id, variables.docId],
      });
    },
  });
}
