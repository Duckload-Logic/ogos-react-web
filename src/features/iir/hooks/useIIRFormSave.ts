import { useMutation, useQueryClient } from "@tanstack/react-query";
import { iirService } from "../services/service";

export function useIIRFormSave() {
  const queryClient = useQueryClient();

  const saveSectionMutation = useMutation({
    mutationFn: async ({
      iirID,
      section,
      data,
    }: {
      iirID: number;
      section: string;
      data: any;
    }) => {
      return iirService.saveSectionData(iirID, section, data);
    },
    onSuccess: (_, variables) => {
      // Invalidate the IIR form query to refetch
      queryClient.invalidateQueries({
        queryKey: ["iirForm"],
      });
    },
  });

  const submitFormMutation = useMutation({
    mutationFn: async (iirID: number) => {
      return iirService.submitIIRForm(iirID);
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
