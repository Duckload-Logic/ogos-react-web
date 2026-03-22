/**
 * Significant Notes Service Layer
 * Handles all note-related API calls
 */

import { apiClient, AxiosConfigWithMeta } from "@/lib/api";
import { API_ROUTES } from "@/config/apiRoutes";
import type { SignificantNote, CreateNoteRequest } from "../types/types";

/**
 * Create a significant note
 * @param data - Note creation request
 *   (userId handled by middleware)
 * @param config - Axios config with logging metadata
 * @returns Created note response
 * @throws Error on 403 (Day One student) or other failures
 */
export async function PostNote(
  data: CreateNoteRequest,
  config?: AxiosConfigWithMeta,
): Promise<SignificantNote> {
  try {
    const response = await apiClient.post(API_ROUTES.notes.all, data, config);
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName || "PostNote";

    // Handle Day One student (403 Forbidden)
    if (error.response?.status === 403) {
      const stepName = config?.stepName || "Check IIR Profile";
      console.error(
        `[${handlerName}] {${stepName}}: ` + `${error.response.data?.error}`,
      );
      throw new Error("Please complete your IIR profile");
    }

    const stepName = config?.stepName || "Create Note";
    console.error(`[${handlerName}] {${stepName}}: ${error.message}`);
    throw error;
  }
}

/**
 * Get notes for a specific IIR record
 * @param iirId - IIR record ID
 * @param config - Axios config with logging metadata
 * @returns Array of notes
 * @throws Error on 403 (Day One student) or other failures
 */
export async function GetNotesByIirId(
  iirId: string,
  config?: AxiosConfigWithMeta,
): Promise<SignificantNote[]> {
  try {
    const response = await apiClient.get(
      API_ROUTES.notes.byIirId(iirId),
      config,
    );
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName || "GetNotesByIirId";

    // Handle Day One student (403 Forbidden)
    if (error.response?.status === 403) {
      const stepName = config?.stepName || "Check IIR Profile";
      console.error(
        `[${handlerName}] {${stepName}}: ` + `${error.response.data?.error}`,
      );
      throw new Error("Please complete your IIR profile");
    }

    const stepName = config?.stepName || "Fetch Notes";
    console.error(`[${handlerName}] {${stepName}}: ${error.message}`);
    throw error;
  }
}

/**
 * Legacy service object for backward compatibility
 * Gradually migrate to direct function imports
 */
export const noteService = {
  PostNote,
  GetNotesByIirId,
};
