/**
 * Excuse Slip Service
 * Centralized excuse slip API calls
 */

import { apiClient } from "@/lib/api";

export interface ExcuseSlipPayload {
  date: string;
  reason: string;
  attachmentUrl?: string;
}

export interface ExcuseSlip {
  id: string;
  studentId: string;
  date: string;
  reason: string;
  attachmentUrl?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface ExcuseSlipResponse {
  id: string;
  message: string;
}

/**
 * Submit excuse slip
 */
export const submitExcuseSlip = async (
  payload: ExcuseSlipPayload
): Promise<ExcuseSlipResponse> => {
  return apiClient.post("/excuse-slips", payload);
};

/**
 * Get excuse slip by ID
 */
export const getExcuseSlipById = async (id: string): Promise<ExcuseSlip> => {
  return apiClient.get(`/excuse-slips/${id}`);
};

/**
 * List all excuse slips for current user
 */
export const listUserExcuseSlips = async (): Promise<ExcuseSlip[]> => {
  return apiClient.get("/excuse-slips");
};

/**
 * List all excuse slips (admin only)
 */
export const listAllExcuseSlips = async (): Promise<ExcuseSlip[]> => {
  return apiClient.get("/admin/excuse-slips");
};

/**
 * Update excuse slip status (admin only)
 */
export const updateExcuseSlipStatus = async (
  id: string,
  status: "approved" | "rejected"
): Promise<ExcuseSlip> => {
  return apiClient.patch(`/excuse-slips/${id}`, { status });
};

/**
 * Delete excuse slip
 */
export const deleteExcuseSlip = async (id: string): Promise<void> => {
  return apiClient.delete(`/excuse-slips/${id}`);
};
