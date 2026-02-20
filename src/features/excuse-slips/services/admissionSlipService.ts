/**
 * Excuse Slip Service
 * Centralized excuse slip API calls
 */

import { apiClient } from "@/lib/api";

export interface AdmissionSlipPayload {
  date: string;
  reason: string;
  attachmentUrl?: string;
}

export interface AdmissionSlip {
  id: string;
  studentId: string;
  date: string;
  reason: string;
  attachmentUrl?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface AdmissionSlipResponse {
  id: string;
  message: string;
}

/**
 * Submit excuse slip
 */
export const submitAdmissionSlip = async (
  payload: AdmissionSlipPayload,
): Promise<AdmissionSlipResponse> => {
  return apiClient.post("/excuse-slips", payload);
};

/**
 * Get excuse slip by ID
 */
export const getAdmissionSlipById = async (
  id: string,
): Promise<AdmissionSlip> => {
  return apiClient.get(`/excuse-slips/${id}`);
};

/**
 * List all excuse slips for current user
 */
export const listUserAdmissionSlips = async (): Promise<AdmissionSlip[]> => {
  return apiClient.get("/excuse-slips");
};

/**
 * List all excuse slips (admin only)
 */
export const listAllAdmissionSlips = async (): Promise<AdmissionSlip[]> => {
  return apiClient.get("/admin/excuse-slips");
};

/**
 * Update excuse slip status (admin only)
 */
export const updateAdmissionSlipStatus = async (
  id: string,
  status: "approved" | "rejected",
): Promise<AdmissionSlip> => {
  return apiClient.patch(`/excuse-slips/${id}`, { status });
};

/**
 * Delete excuse slip
 */
export const deleteAdmissionSlip = async (id: string): Promise<void> => {
  return apiClient.delete(`/excuse-slips/${id}`);
};
