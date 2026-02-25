import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { iirService } from "../services/service";
import { IIRForm } from "../types/IIRForm";

const DRAFT_QUERY_KEY = "iirDraft";

export function useGetIIRDraft() {
  const { data, isLoading, error } = useQuery({
    queryKey: [DRAFT_QUERY_KEY, "me"],
    queryFn: () => {
      return iirService.getIIRDraft() as Promise<IIRForm | null>;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
  return {
    draft: data,
    isLoadingDraft: isLoading,
    draftError: error,
  };
}

export function useSaveIIRDraft() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: IIRForm) => iirService.saveIIRDraft(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DRAFT_QUERY_KEY, "me"] });
    },
  });

  return {
    saveDraft: mutation.mutate,
    isSavingDraft: mutation.isPending,
    saveDraftError: mutation.error,
  };
}
