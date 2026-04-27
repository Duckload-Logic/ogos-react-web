/**
 * User Service Layer
 * Handles all user-related API calls
 */

import { apiClient, AxiosConfigWithMeta } from "@/lib/api";
import { API_ROUTES } from "@/config/apiRoutes";
import { User } from "@/features/users/types/user";

/**
 * Get current authenticated user
 * @param config - Axios config with logging metadata
 * @returns Current user data
 */
export async function GetMe(config?: AxiosConfigWithMeta): Promise<User> {
  try {
    const response = await apiClient.get(API_ROUTES.auth.me, config);
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName || "GetMe";
    const stepName = config?.stepName || "Fetch User";
    console.error(`[${handlerName}] {${stepName}}: ${error.message}`);
    throw error;
  }
}

/**
 * Get user by ID
 * @param userId - User ID
 * @param config - Axios config with logging metadata
 * @returns User data
 */
export async function GetUserById(
  userId: string,
  config?: AxiosConfigWithMeta,
): Promise<User> {
  try {
    const response = await apiClient.get(
      API_ROUTES.users.byId(String(userId)),
      config,
    );
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName || "GetUserById";
    const stepName = config?.stepName || "Fetch User";
    console.error(`[${handlerName}] {${stepName}}: ${error.message}`);
    throw error;
  }
}

/**
 * Upload current user's profile picture.
 * Assumption: backend accepts multipart/form-data at /users/me/profile-picture
 * and returns the updated User or { profilePicture }.
 */
export async function UploadProfilePicture(
  file: File,
  config?: AxiosConfigWithMeta,
): Promise<User> {
  const uploadWithField = async (fieldName: "profilePicture" | "file") => {
    const formData = new FormData();
    formData.append(fieldName, file);
  try {
    const formData = new FormData();
    formData.append("profilePicture", file);

    const response = await apiClient.post(
      API_ROUTES.users.profilePicture,
      formData,
      {
        ...config,
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    return response.data;
  };

  try {
    return await uploadWithField("profilePicture");
  } catch (error: any) {
    try {
      return await uploadWithField("file");
    } catch (fallbackError: any) {
      const handlerName = config?.handlerName || "UploadProfilePicture";
      const stepName = config?.stepName || "Upload Profile Picture";
      console.error(
        `[${handlerName}] {${stepName}}: ${fallbackError.message}`,
      );
      throw fallbackError;
    }
  } catch (error: any) {
    const handlerName = config?.handlerName || "UploadProfilePicture";
    const stepName = config?.stepName || "Upload Profile Picture";
    console.error(`[${handlerName}] {${stepName}}: ${error.message}`);
    throw error;
  }
}

/**
 * Legacy service object for backward compatibility
 * Gradually migrate to direct function imports
 */
export const userService = {
  GetMe,
  GetUserById,
  UploadProfilePicture,
  // Legacy aliases
  getCurrentUser: GetMe,
  getUserByID: GetUserById,
};
