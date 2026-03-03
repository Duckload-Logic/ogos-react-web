import { useMutation, useQueryClient } from "@tanstack/react-query";
import { slipService } from "../services";

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
      return slipService.updateSlipStatus(id, status, adminNotes);
    },
    onSuccess: () => {
      // Invalidate all slips queries to refetch after status update
      queryClient.invalidateQueries({
        queryKey: ["slips"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-slips"],
      });
    },
  });
}
