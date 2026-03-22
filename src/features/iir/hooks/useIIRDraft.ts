import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GetIIRDraft, PostIIRDraft } from "../services/service";
import { QUERY_KEYS } from "@/config/queryKeys";
import { CACHE_TIMING } from "@/config/constants";
import { IIRForm } from "../types/IIRForm";
import { useAuth } from "@/context";
import { useMe } from "@/features/users/hooks/useMe";

export const IIR_DRAFT_STORAGE_KEY = (userId: string) =>
  `iir_draft-student_${userId}`;

export function useGetIIRDraft() {
  const { data, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.iir.draft,
    queryFn: () => {
      return GetIIRDraft() as Promise<IIRForm | null>;
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
  const { data: me } = useMe({});
  const queryClient = useQueryClient();
  const [lastSaved, setLastSaved] = useState<string>("");

  const clearDraft = useCallback(() => {
    localStorage.removeItem(IIR_DRAFT_STORAGE_KEY(me?.id || ""));
  }, [me?.id]);

  const mutation = useMutation({
    mutationFn: (data: IIRForm) => {
      // Mirror to local storage
      try {
        localStorage.setItem(
          IIR_DRAFT_STORAGE_KEY(me?.id || ""),
          JSON.stringify(data),
        );
        const now = new Date();
        setLastSaved(
          now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        );
      } catch (err) {
        console.error("Local storage save error:", err);
      }

      // Save backend draft
      return PostIIRDraft(data);
    },
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
    clearDraft,
    lastSaved,
  };
}
