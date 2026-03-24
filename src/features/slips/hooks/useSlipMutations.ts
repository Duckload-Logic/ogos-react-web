import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostSlip, PatchSlipStatus } from "../services";
import type { CreateSlipRequest } from "../types";

/**
 * Hook to submit a new admission slip
 */
export function useSubmitSlip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSlipRequest) => {
      return PostSlip(data, {
        handlerName: "useSubmitSlip",
        stepName: "Submit Slip",
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

/**
 * Hook to update an existing slip's status (Admin only)
 */
export function useUpdateSlipStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      adminNotes,
    }: {
      id: string;
      status: string;
      adminNotes?: string;
    }) => {
      return PatchSlipStatus(id, status, adminNotes, {
        handlerName: "useUpdateSlipStatus",
        stepName: "Update Status",
      });
    },
    onSuccess: () => {
      // Invalidate all related queries to refetch fresh data
      queryClient.invalidateQueries({
        queryKey: ["slips"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-slips"],
      });
    },
  });
}
