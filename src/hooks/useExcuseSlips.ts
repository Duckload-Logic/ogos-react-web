/**
 * useExcuseSlips Hook
 * Manages excuse slip operations with proper state management
 */

import { useAsyncOperation } from "./useAsyncOperation";
import * as excuseSlipService from "@/services/excuseSlipService";
import { ExcuseSlip, ExcuseSlipPayload } from "@/services/excuseSlipService";

export interface UseExcuseSlipsReturn {
  excuseSlips: ExcuseSlip[] | null;
  isLoading: boolean;
  error: string | null;
  fetchExcuseSlips: () => Promise<void>;
  submitExcuseSlip: (payload: ExcuseSlipPayload) => Promise<void>;
  updateStatus: (id: string, status: "approved" | "rejected") => Promise<void>;
  deleteExcuseSlip: (id: string) => Promise<void>;
  reset: () => void;
}

/**
 * useExcuseSlips - Manages excuse slip operations
 */
export const useExcuseSlips = (): UseExcuseSlipsReturn => {
  const { data, isLoading, error, execute, reset, setData, setError } =
    useAsyncOperation<ExcuseSlip[]>();

  const fetchExcuseSlips = async () => {
    await execute(() => excuseSlipService.listUserExcuseSlips());
  };

  const submitExcuseSlip = async (payload: ExcuseSlipPayload) => {
    try {
      await excuseSlipService.submitExcuseSlip(payload);
      // Refresh the list
      await fetchExcuseSlips();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to submit excuse slip";
      setError(errorMessage);
    }
  };

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      await excuseSlipService.updateExcuseSlipStatus(id, status);
      // Refresh the list
      await fetchExcuseSlips();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update excuse slip";
      setError(errorMessage);
    }
  };

  const deleteExcuseSlip = async (id: string) => {
    try {
      await excuseSlipService.deleteExcuseSlip(id);
      // Refresh the list
      await fetchExcuseSlips();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete excuse slip";
      setError(errorMessage);
    }
  };

  return {
    excuseSlips: data,
    isLoading,
    error,
    fetchExcuseSlips,
    submitExcuseSlip,
    updateStatus,
    deleteExcuseSlip,
    reset,
  };
};
