import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GetIIRDraft, PostIIRDraft } from "../services/service";
import { QUERY_KEYS } from "@/config/queryKeys";
import { CACHE_TIMING } from "@/config/constants";
import { IIRForm } from "../types/IIRForm";

export function useGetIIRDraft() {
  const { data, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.iir.draft,
    queryFn: () => {
      return GetIIRDraft() as Promise<
        IIRForm | null
      >;
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
    mutationFn: (data: IIRForm) =>
      PostIIRDraft(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.iir.draft,
      });
    },
  });

  return {
    saveDraft: mutation.mutate,
    isSavingDraft: mutation.isPending,
    saveDraftError: mutation.error,
  };
}
