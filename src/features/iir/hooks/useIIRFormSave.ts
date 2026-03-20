import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostIIRDraft, PostIIRSubmit } from "../services/service";
import { IIRForm } from "../types/IIRForm";

export function useIIRFormSave() {
  const queryClient = useQueryClient();

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
    submitForm: submitFormMutation.mutate,
    submitFormAsync: submitFormMutation.mutateAsync,
    isSubmitting: submitFormMutation.isPending,
    submitError: submitFormMutation.error,
  };
}
