import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PatchSlipStatus } from "../services";

export function useUpdateSlipStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      adminNotes,
    }: {
      id: number;
      status: string;
      adminNotes?: string;
    }) => {
      return PatchSlipStatus(id, status, adminNotes, {
        handlerName: 'useUpdateSlipStatus',
        stepName: 'Update Status',
      });
    },
    onSuccess: () => {
      // Invalidate all slips queries to refetch
      queryClient.invalidateQueries({
        queryKey: ["slips"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-slips"],
      });
    },
  });
}
