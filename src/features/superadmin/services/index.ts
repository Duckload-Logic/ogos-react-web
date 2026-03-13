/**
 * Superadmin Service
 * Handles API key management and system logs
 */

import { apiClient, AxiosConfigWithMeta } from "@/lib/api";
import { API_ROUTES } from "@/config/apiRoutes";
import type {
  APIKey,
  CreateAPIKeyRequest,
  CreateAPIKeyResponse,
  SystemLogsResponse,
  SystemLogsParams,
  LogStats,
} from "../types";

/**
 * Get all API keys
 * @param includeRevoked - Include revoked keys
 * @param config - Optional axios config with metadata
 * @returns Promise resolving to API keys list
 */
export const GetAPIKeys = async (
  includeRevoked = false,
  config?: AxiosConfigWithMeta,
): Promise<APIKey[]> => {
  try {
    const { data } = await apiClient.get(
      API_ROUTES.superadmin.apiKeys.list,
      {
        ...config,
        params: { include_revoked: includeRevoked },
      },
    );
    return data;
  } catch (error) {
    const handlerName = config?.handlerName ||
      'GetAPIKeys';
    const stepName = config?.stepName ||
      'Fetch API Keys';
    console.error(
      `[${handlerName}] {${stepName}}: ${error}`,
    );
    throw error;
  }
};

/**
 * Create new API key
 * @param data - API key creation data
 * @param config - Optional axios config with metadata
 * @returns Promise resolving to created API key
 */
export const PostAPIKey = async (
  data: CreateAPIKeyRequest,
  config?: AxiosConfigWithMeta,
): Promise<CreateAPIKeyResponse> => {
  try {
    const response = await apiClient.post(
      API_ROUTES.superadmin.apiKeys.create,
      data,
      config,
    );
    return response.data;
  } catch (error) {
    const handlerName = config?.handlerName ||
      'PostAPIKey';
    const stepName = config?.stepName ||
      'Create API Key';
    console.error(
      `[${handlerName}] {${stepName}}: ${error}`,
    );
    throw error;
  }
};

/**
 * Revoke API key
 * @param id - API key ID to revoke
 * @param config - Optional axios config with metadata
 * @returns Promise resolving when key is revoked
 */
export const DeleteAPIKey = async (
  id: number,
  config?: AxiosConfigWithMeta,
): Promise<void> => {
  try {
    await apiClient.delete(
      API_ROUTES.superadmin.apiKeys.revoke(id),
      config,
    );
  } catch (error) {
    const handlerName = config?.handlerName ||
      'DeleteAPIKey';
    const stepName = config?.stepName ||
      'Revoke API Key';
    console.error(
      `[${handlerName}] {${stepName}}: ${error}`,
    );
    throw error;
  }
};

/**
 * Get security logs
 * @param params - Query parameters for filtering
 * @param config - Optional axios config with metadata
 * @returns Promise resolving to security logs
 */
export const GetSecurityLogs = async (
  params?: SystemLogsParams,
  config?: AxiosConfigWithMeta,
): Promise<SystemLogsResponse> => {
  try {
    const { data } = await apiClient.get(
      API_ROUTES.superadmin.logs.security,
      { ...config, params },
    );
    return data;
  } catch (error) {
    const handlerName = config?.handlerName ||
      'GetSecurityLogs';
    const stepName = config?.stepName ||
      'Fetch Security Logs';
    console.error(
      `[${handlerName}] {${stepName}}: ${error}`,
    );
    throw error;
  }
};

/**
 * Get system logs
 * @param params - Query parameters for filtering
 * @param config - Optional axios config with metadata
 * @returns Promise resolving to system logs
 */
export const GetSystemLogs = async (
  params?: SystemLogsParams,
  config?: AxiosConfigWithMeta,
): Promise<SystemLogsResponse> => {
  try {
    const { data } = await apiClient.get(
      API_ROUTES.superadmin.logs.system,
      { ...config, params },
    );
    return data;
  } catch (error) {
    const handlerName = config?.handlerName ||
      'GetSystemLogs';
    const stepName = config?.stepName ||
      'Fetch System Logs';
    console.error(
      `[${handlerName}] {${stepName}}: ${error}`,
    );
    throw error;
  }
};

/**
 * Get audit logs
 * @param params - Query parameters for filtering
 * @param config - Optional axios config with metadata
 * @returns Promise resolving to audit logs
 */
export const GetAuditLogs = async (
  params?: SystemLogsParams,
  config?: AxiosConfigWithMeta,
): Promise<SystemLogsResponse> => {
  try {
    const { data } = await apiClient.get(
      API_ROUTES.superadmin.logs.audit,
      { ...config, params },
    );
    return data;
  } catch (error) {
    const handlerName = config?.handlerName ||
      'GetAuditLogs';
    const stepName = config?.stepName ||
      'Fetch Audit Logs';
    console.error(
      `[${handlerName}] {${stepName}}: ${error}`,
    );
    throw error;
  }
};

/**
 * Get log statistics
 * @param startDate - Start date for filtering
 * @param endDate - End date for filtering
 * @param config - Optional axios config with metadata
 * @returns Promise resolving to log statistics
 */
export const GetLogStats = async (
  startDate?: string,
  endDate?: string,
  config?: AxiosConfigWithMeta,
): Promise<LogStats[]> => {
  try {
    const { data } = await apiClient.get(
      API_ROUTES.superadmin.logs.stats,
      {
        ...config,
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      },
    );
    return data;
  } catch (error) {
    const handlerName = config?.handlerName ||
      'GetLogStats';
    const stepName = config?.stepName ||
      'Fetch Log Stats';
    console.error(
      `[${handlerName}] {${stepName}}: ${error}`,
    );
    throw error;
  }
};

/**
 * Legacy service object for backward compatibility
 * @deprecated Use individual exported functions instead
 */
export const superadminService = {
  async listAPIKeys(
    includeRevoked = false,
  ): Promise<APIKey[]> {
    return GetAPIKeys(includeRevoked);
  },

  async createAPIKey(
    data: CreateAPIKeyRequest,
  ): Promise<CreateAPIKeyResponse> {
    return PostAPIKey(data);
  },

  async revokeAPIKey(id: number): Promise<void> {
    return DeleteAPIKey(id);
  },

  async getSecurityLogs(
    params?: SystemLogsParams,
  ): Promise<SystemLogsResponse> {
    return GetSecurityLogs(params);
  },

  async getSystemLogs(
    params?: SystemLogsParams,
  ): Promise<SystemLogsResponse> {
    return GetSystemLogs(params);
  },

  async getAuditLogs(
    params?: SystemLogsParams,
  ): Promise<SystemLogsResponse> {
    return GetAuditLogs(params);
  },

  async getLogStats(
    startDate?: string,
    endDate?: string,
  ): Promise<LogStats[]> {
    return GetLogStats(startDate, endDate);
  },
};
