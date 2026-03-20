import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostSlip } from "../services";
import type { CreateSlipRequest } from "../types/slip";

/**
 * Hook to submit a new slip
 * Handles 403 errors for Day One students
 */
export function useSubmitSlip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSlipRequest) => {
      return PostSlip(data, {
        handlerName: 'useSubmitSlip',
        stepName: 'Submit Slip',
      });
    },
    onSuccess: () => {
      // Invalidate my slips query to refetch
      queryClient.invalidateQueries({
        queryKey: ["my-slips"],
      });
    },
  });
}
