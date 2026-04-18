import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  GetIIRByUserId,
  PostIIRSubmit,
  GetIIRDraft,
  PostIIRDraft,
} from "../services/service";
import { QUERY_KEYS } from "@/config/queryKeys";
import { CACHE_TIMING } from "@/config/constants";
import { IIRForm } from "../types";
import { EMPTY_IIR_FORM } from "../constants";
import { useMe } from "@/features/users/hooks/useMe";

export const IIR_DRAFT_STORAGE_KEY = (userId: string) =>
  `iir_draft-student_${userId}`;

/**
 * Hook for managing the IIR Form state and submission
 */
export function useIIRForm(userID: string) {
  return useQuery({
    queryKey: QUERY_KEYS.iir.inventory.byUserId(userID),
    queryFn: async () => {
      return GetIIRByUserId(userID) as Promise<IIRForm>;
    },
    enabled: !!userID,
    staleTime: CACHE_TIMING.MEDIUM.staleTime,
    gcTime: CACHE_TIMING.MEDIUM.gcTime,
    initialData: EMPTY_IIR_FORM,
  });
}

/**
 * Hook for saving/submitting the IIR Form
 */
export function useIIRFormSave() {
  const queryClient = useQueryClient();

  const submitFormMutation = useMutation({
    mutationFn: async (iir: IIRForm) => {
      return PostIIRSubmit(iir, {
        handlerName: "useIIRFormSave",
        stepName: "Submit Form",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["iirForm"],
      });
    },
  });

  return {
    submitForm: submitFormMutation.mutate,
    submitFormAsync: submitFormMutation.mutateAsync,
    isSubmitting: submitFormMutation.isPending,
    submitError: submitFormMutation.error,
  };
}

/**
 * Hook for fetching the current IIR draft
 */
export function useGetIIRDraft() {
  const query = useQuery({
    queryKey: QUERY_KEYS.iir.draft,
    queryFn: () => {
      return GetIIRDraft() as Promise<IIRForm | null>;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  return {
    draft: query.data,
    isLoadingDraft: query.isLoading,
    draftError: query.error,
    ...query,
  };
}

/**
 * Hook for managing IIR draft saving (Backend + LocalStorage)
 */
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
