/**
 * Consent Service Layer
 * Handles all consent-related API calls
 */

import { apiClient, AxiosConfigWithMeta } from "@/lib/api";
import { API_ROUTES } from "@/config/apiRoutes";
import { Statement } from "../types/statement";

/**
 * Get latest consent statement
 * @param type - Consent type
 * @param config - Axios config with logging metadata
 * @returns Consent statement
 */
export async function GetLatestStatement(
  type: string,
  config?: AxiosConfigWithMeta,
): Promise<Statement> {
  try {
    const response = await apiClient.get(
      API_ROUTES.consents.latest(type),
      config,
    );
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName || 'GetLatestStatement';
    const stepName = config?.stepName || 'Fetch Statement';
    console.error(
      `[${handlerName}] {${stepName}}: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Get consent statement content
 * @param type - Consent type
 * @param config - Axios config with logging metadata
 * @returns Statement content as string
 */
export async function GetStatementContent(
  type: string,
  config?: AxiosConfigWithMeta,
): Promise<string> {
  try {
    const response = await apiClient.get(
      `${API_ROUTES.consents.latest(type)}/content`,
      config,
    );
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName ||
      'GetStatementContent';
    const stepName = config?.stepName || 'Fetch Content';
    console.error(
      `[${handlerName}] {${stepName}}: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Check if user has given consent
 * @param docId - Document ID
 * @param config - Axios config with logging metadata
 * @returns Consent status
 */
export async function GetUserConsent(
  docId: number,
  config?: AxiosConfigWithMeta,
): Promise<{ accepted: boolean }> {
  try {
    const response = await apiClient.get(
      API_ROUTES.consents.checkConsent(docId),
      config,
    );
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName || 'GetUserConsent';
    const stepName = config?.stepName || 'Check Consent';
    console.error(
      `[${handlerName}] {${stepName}}: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Submit user consent
 * @param type - Consent type
 * @param docId - Document ID
 * @param config - Axios config with logging metadata
 * @returns Consent response
 */
export async function PostConsent(
  type: string,
  docId: number,
  config?: AxiosConfigWithMeta,
) {
  try {
    const response = await apiClient.post(
      API_ROUTES.consents.giveConsent(type, docId),
      {},
      config,
    );
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName || 'PostConsent';
    const stepName = config?.stepName || 'Submit Consent';
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
export const consentService = {
  GetLatestStatement,
  GetStatementContent,
  GetUserConsent,
  PostConsent,
};
