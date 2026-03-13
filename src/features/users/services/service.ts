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
export async function GetMe(
  config?: AxiosConfigWithMeta,
): Promise<User> {
  try {
    const response = await apiClient.get(
      API_ROUTES.users.me,
      config,
    );
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName || 'GetMe';
    const stepName = config?.stepName || 'Fetch User';
    console.error(
      `[${handlerName}] {${stepName}}: ${error.message}`,
    );
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
  userId: number,
  config?: AxiosConfigWithMeta,
): Promise<User> {
  try {
    const response = await apiClient.get(
      API_ROUTES.users.byId(String(userId)),
      config,
    );
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName || 'GetUserById';
    const stepName = config?.stepName || 'Fetch User';
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
export const userService = {
  GetMe,
  GetUserById,
  // Legacy aliases
  getCurrentUser: GetMe,
  getUserByID: GetUserById,
};
