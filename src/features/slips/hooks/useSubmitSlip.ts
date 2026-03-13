import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostSlip } from "../services";

export function useSubmitSlip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData) => {
      return PostSlip(data, {
        handlerName: 'useSubmitSlip',
        stepName: 'Submit Slip',
      });
    },
    onSuccess: () => {
      // Invalidate my slips query to refetch after submission
      queryClient.invalidateQueries({
        queryKey: ["my-slips"],
      });
    },
  });
}
