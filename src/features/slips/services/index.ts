/**
 * Slip Service Layer
 * Handles all slip-related API calls with consistent error logging
 */

import { apiClient, AxiosConfigWithMeta } from "@/lib/api";
import { API_ROUTES } from "@/config/apiRoutes";
import { QueryParams } from "../types/params";

/**
 * Get slip statistics
 * @param params - Query parameters
 * @param config - Axios config with logging metadata
 * @returns Slip statistics
 */
export async function GetSlipStats(
  params?: QueryParams,
  config?: AxiosConfigWithMeta,
) {
  try {
    const response = await apiClient.get(
      API_ROUTES.slips.stats,
      { ...config, params },
    );
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName || 'GetSlipStats';
    const stepName = config?.stepName || 'Fetch Stats';
    console.error(
      `[${handlerName}] {${stepName}}: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Get all slip statuses (lookup data)
 * @param config - Axios config with logging metadata
 * @returns Array of slip statuses
 */
export async function GetSlipStatuses(
  config?: AxiosConfigWithMeta,
) {
  try {
    const response = await apiClient.get(
      API_ROUTES.slips.lookups.statuses,
      config,
    );
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName || 'GetSlipStatuses';
    const stepName = config?.stepName || 'Fetch Statuses';
    console.error(
      `[${handlerName}] {${stepName}}: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Get all slip categories (lookup data)
 * @param config - Axios config with logging metadata
 * @returns Array of slip categories
 */
export async function GetSlipCategories(
  config?: AxiosConfigWithMeta,
) {
  try {
    const response = await apiClient.get(
      API_ROUTES.slips.lookups.categories,
      config,
    );
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName || 'GetSlipCategories';
    const stepName = config?.stepName || 'Fetch Categories';
    console.error(
      `[${handlerName}] {${stepName}}: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Get current user's slips
 * @param params - Query parameters
 * @param config - Axios config with logging metadata
 * @returns Paginated slip response
 */
export async function GetMySlips(
  params?: QueryParams,
  config?: AxiosConfigWithMeta,
) {
  try {
    const response = await apiClient.get(
      API_ROUTES.slips.mySlips,
      { ...config, params },
    );
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName || 'GetMySlips';
    const stepName = config?.stepName || 'Fetch My Slips';
    console.error(
      `[${handlerName}] {${stepName}}: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Get urgent slips
 * @param params - Query parameters
 * @param config - Axios config with logging metadata
 * @returns Array of urgent slips
 */
export async function GetUrgentSlips(
  params?: QueryParams,
  config?: AxiosConfigWithMeta,
) {
  try {
    const response = await apiClient.get(
      API_ROUTES.slips.urgent,
      { ...config, params },
    );
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName || 'GetUrgentSlips';
    const stepName = config?.stepName || 'Fetch Urgent Slips';
    console.error(
      `[${handlerName}] {${stepName}}: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Get all slips with pagination
 * @param params - Query parameters
 * @param config - Axios config with logging metadata
 * @returns Paginated slip response
 */
export async function GetAllSlips(
  params?: QueryParams,
  config?: AxiosConfigWithMeta,
) {
  try {
    const response = await apiClient.get(
      API_ROUTES.slips.all,
      { ...config, params },
    );
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName || 'GetAllSlips';
    const stepName = config?.stepName || 'Fetch All Slips';
    console.error(
      `[${handlerName}] {${stepName}}: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Get slip by ID
 * @param id - Slip ID
 * @param config - Axios config with logging metadata
 * @returns Slip details
 */
export async function GetSlipById(
  id: number,
  config?: AxiosConfigWithMeta,
) {
  try {
    const response = await apiClient.get(
      API_ROUTES.slips.byId(id),
      config,
    );
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName || 'GetSlipById';
    const stepName = config?.stepName || 'Fetch Slip';
    console.error(
      `[${handlerName}] {${stepName}}: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Get slip attachments
 * @param id - Slip ID
 * @param config - Axios config with logging metadata
 * @returns Array of attachments
 */
export async function GetSlipAttachments(
  id: number,
  config?: AxiosConfigWithMeta,
) {
  try {
    const response = await apiClient.get(
      API_ROUTES.slips.attachments(id),
      config,
    );
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName || 'GetSlipAttachments';
    const stepName = config?.stepName || 'Fetch Attachments';
    console.error(
      `[${handlerName}] {${stepName}}: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Submit a new slip
 * @param data - Form data with slip details
 * @param config - Axios config with logging metadata
 * @returns Created slip response
 */
export async function PostSlip(
  data: FormData,
  config?: AxiosConfigWithMeta,
) {
  try {
    const response = await apiClient.post(
      API_ROUTES.slips.all,
      data,
      {
        ...config,
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName || 'PostSlip';
    const stepName = config?.stepName || 'Submit Slip';
    console.error(
      `[${handlerName}] {${stepName}}: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Update slip status
 * @param id - Slip ID
 * @param status - New status
 * @param adminNotes - Optional admin notes
 * @param config - Axios config with logging metadata
 * @returns Updated slip response
 */
export async function PatchSlipStatus(
  id: number,
  status: string,
  adminNotes?: string,
  config?: AxiosConfigWithMeta,
) {
  try {
    const payload: { status: string; adminNotes?: string } = {
      status,
    };
    if (adminNotes !== undefined) {
      payload.adminNotes = adminNotes;
    }
    const response = await apiClient.patch(
      API_ROUTES.slips.updateStatus(id),
      payload,
      config,
    );
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName || 'PatchSlipStatus';
    const stepName = config?.stepName || 'Update Status';
    console.error(
      `[${handlerName}] {${stepName}}: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Download slip attachment
 * @param slipId - Slip ID
 * @param attachmentId - Attachment ID
 * @param config - Axios config with logging metadata
 * @returns Blob data for file download
 */
export async function GetSlipAttachmentDownload(
  slipId: number,
  attachmentId: number,
  config?: AxiosConfigWithMeta,
) {
  try {
    const response = await apiClient.get(
      API_ROUTES.slips.downloadAttachment(slipId, attachmentId),
      {
        ...config,
        responseType: 'blob',
      },
    );
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName ||
      'GetSlipAttachmentDownload';
    const stepName = config?.stepName || 'Download Attachment';
    console.error(
      `[${handlerName}] {${stepName}}: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Legacy service object for backward compatibility
 * Gradually migrate to direct function imports
 */
export const slipService = {
  GetSlipStats,
  GetSlipStatuses,
  GetSlipCategories,
  GetMySlips,
  GetUrgentSlips,
  GetAllSlips,
  GetSlipById,
  GetSlipAttachments,
  PostSlip,
  PatchSlipStatus,
  GetSlipAttachmentDownload,
};
