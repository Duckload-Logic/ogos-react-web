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
      const formData = new FormData();

      formData.append("reason", data.reason);
      formData.append("dateOfAbsence", data.dateOfAbsence);
      formData.append("dateNeeded", data.dateNeeded);
      formData.append("categoryId", String(data.categoryId));

      data.files?.cor?.forEach((file) => {
        formData.append("cor", file);
      });

      data.files?.excuseLetter?.forEach((file) => {
        formData.append("excuseLetter", file);
      });

      data.files?.parentId?.forEach((file) => {
        formData.append("parentId", file);
      });

      data.files?.medicalCert?.forEach((file) => {
        formData.append("medicalCert", file);
      });

      return PostSlip(formData, {
        handlerName: "useSubmitSlip",
        stepName: "Submit Slip",
      });
    },
    onSuccess: () => {
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
      queryClient.invalidateQueries({
        queryKey: ["slips"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-slips"],
      });
    },
  });
}