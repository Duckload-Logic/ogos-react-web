import { useMutation, useQueryClient } from "@tanstack/react-query";
import { slipService } from "../services";

export function useSubmitSlip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData) => {
      return slipService.submitSlip(data);
    },
    onSuccess: () => {
      // Invalidate my slips query to refetch after submission
      queryClient.invalidateQueries({
        queryKey: ["my-slips"],
      });
    },
  });
}
