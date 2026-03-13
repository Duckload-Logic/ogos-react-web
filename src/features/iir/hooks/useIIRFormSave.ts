import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostIIRDraft, PostIIRSubmit } from "../services/service";
import { IIRForm } from "../types/IIRForm";

export function useIIRFormSave() {
  const queryClient = useQueryClient();

  const saveSectionMutation = useMutation({
    mutationFn: async (data: IIRForm) => {
      return PostIIRDraft(data, {
        handlerName: 'useIIRFormSave',
        stepName: 'Save Draft',
      });
    },
    onSuccess: () => {
      // Invalidate the IIR form query to refetch
      queryClient.invalidateQueries({
        queryKey: ["iirForm"],
      });
    },
  });

  const submitFormMutation = useMutation({
    mutationFn: async (iir: IIRForm) => {
      return PostIIRSubmit(iir, {
        handlerName: 'useIIRFormSave',
        stepName: 'Submit Form',
      });
    },
    onSuccess: () => {
      // Invalidate queries after successful submission
      queryClient.invalidateQueries({
        queryKey: ["iirForm"],
      });
    },
  });

  return {
    saveSection: saveSectionMutation.mutate,
    saveSectionAsync: saveSectionMutation.mutateAsync,
    isSavingSection: saveSectionMutation.isPending,
    saveSectionError: saveSectionMutation.error,
    submitForm: submitFormMutation.mutate,
    submitFormAsync: submitFormMutation.mutateAsync,
    isSubmitting: submitFormMutation.isPending,
    submitError: submitFormMutation.error,
  };
}
