/**
 * API service for Significant Notes feature
 */

import { apiClient, AxiosConfigWithMeta } from "@/lib/api";
import { API_ROUTES } from "@/config/apiRoutes";
import { SignificantNote, CreateNoteRequest } from "../types/types";

/**
 * Get all significant notes for a student
 * @param iirId - Student IIR ID
 * @param config - Optional axios config with metadata
 * @returns Promise resolving to array of notes
 */
export const getStudentNotes = async (
  iirId: number,
  config?: AxiosConfigWithMeta,
): Promise<SignificantNote[]> => {
  try {
    const { data } = await apiClient.get(
      API_ROUTES.notes.byIirId(iirId),
      config,
    );
    return data;
  } catch (error) {
    const handlerName = config?.handlerName || "getStudentNotes";
    const stepName = config?.stepName || "Fetch Student Notes";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

/**
 * Create a new significant note
 * @param iirId - Student IIR ID
 * @param noteData - Note data to create
 * @param config - Optional axios config with metadata
 * @returns Promise resolving when note is created
 */
export const createNote = async (
  iirId: number,
  noteData: CreateNoteRequest,
  config?: AxiosConfigWithMeta,
): Promise<void> => {
  try {
    await apiClient.post(API_ROUTES.notes.byIirId(iirId), noteData, config);
  } catch (error) {
    const handlerName = config?.handlerName || "createNote";
    const stepName = config?.stepName || "Create Note";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

export const notesService = {
  getStudentNotes,
  createNote,
};
