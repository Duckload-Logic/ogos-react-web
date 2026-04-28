/**
 * Superadmin Service
 * Handles M2M client management, user management, and system logs
 */

import { apiClient, AxiosConfigWithMeta } from "@/lib/api";
import { API_ROUTES } from "@/config/apiRoutes";
import type {
  M2MClient,
  CreateM2MClientRequest,
  CreateM2MClientResponse,
  SystemLogsResponse,
  SystemLogsParams,
  LogStats,
  ListUsersParams,
  ListUsersResponse,
  AdminAnalytics,
  LogActivityStat,
  RoleDistribution,
} from "../types";

/**
 * Get all M2M clients
 */
export const GetM2MClients = async (
  includeRevoked = false,
  config?: AxiosConfigWithMeta,
): Promise<M2MClient[]> => {
  try {
    const { data } = await apiClient.get(
      API_ROUTES.superadmin.m2mClients.list,
      {
        ...config,
        params: { include_revoked: includeRevoked },
      },
    );
    return data;
  } catch (error) {
    const handlerName = config?.handlerName || "GetM2MClients";
    const stepName = config?.stepName || "Fetch M2M Clients";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

/**
 * Register new M2M client
 */
export const PostM2MClient = async (
  data: CreateM2MClientRequest,
  config?: AxiosConfigWithMeta,
): Promise<CreateM2MClientResponse> => {
  try {
    const response = await apiClient.post(
      API_ROUTES.superadmin.m2mClients.create,
      data,
      config,
    );
    return response.data;
  } catch (error) {
    const handlerName = config?.handlerName || "PostM2MClient";
    const stepName = config?.stepName || "Create M2M Client";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

/**
 * Revoke M2M client
 */
export const DeleteM2MClient = async (
  id: number,
  config?: AxiosConfigWithMeta,
): Promise<void> => {
  try {
    await apiClient.delete(
      API_ROUTES.superadmin.m2mClients.revoke(id),
      config,
    );
  } catch (error) {
    const handlerName = config?.handlerName || "DeleteM2MClient";
    const stepName = config?.stepName || "Revoke M2M Client";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

/**
 * Rotate M2M client secret
 */
export const PostM2MSecret = async (
  id: number,
  config?: AxiosConfigWithMeta,
): Promise<{ clientSecret: string }> => {
  try {
    const { data } = await apiClient.post(
      API_ROUTES.superadmin.m2mClients.rotateSecret(id),
      {},
      config,
    );
    return data;
  } catch (error) {
    const handlerName = config?.handlerName || "PostM2MSecret";
    const stepName = config?.stepName || "Rotate M2M Secret";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

/**
 * Verify M2M client
 */
export const PatchVerifyM2MClient = async (
  id: number,
  config?: AxiosConfigWithMeta,
): Promise<void> => {
  try {
    await apiClient.patch(
      API_ROUTES.superadmin.m2mClients.verify(id),
      {},
      config,
    );
  } catch (error) {
    const handlerName = config?.handlerName || "PatchVerifyM2MClient";
    const stepName = config?.stepName || "Verify M2M Client";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

/**
 * List all users with filtering and pagination
 */
export const GetUsers = async (
  params?: ListUsersParams,
  config?: AxiosConfigWithMeta,
): Promise<ListUsersResponse> => {
  try {
    const { data } = await apiClient.get(
      API_ROUTES.superadmin.users.list,
      { ...config, params },
    );
    return data;
  } catch (error) {
    const handlerName = config?.handlerName || "GetUsers";
    const stepName = config?.stepName || "Fetch User List";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

/**
 * Get user role distribution
 */
export const GetUserDistribution = async (
  config?: AxiosConfigWithMeta,
): Promise<RoleDistribution[]> => {
  try {
    const { data } = await apiClient.get(
      API_ROUTES.superadmin.users.distribution,
      config,
    );
    return data;
  } catch (error) {
    const handlerName = config?.handlerName || "GetUserDistribution";
    const stepName = config?.stepName || "Fetch User Distribution";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

/**
 * Block/Unblock a user
 */
export const PostToggleUserStatus = async (
  id: string,
  action: "block" | "unblock",
  config?: AxiosConfigWithMeta,
): Promise<void> => {
  try {
    await apiClient.post(
      API_ROUTES.superadmin.users.toggleStatus(id, action),
      {},
      config,
    );
  } catch (error) {
    const handlerName = config?.handlerName || "PostToggleUserStatus";
    const stepName = config?.stepName || `${action} user`.toUpperCase();
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

/**
 * Get Admin/System Analytics
 */
export const GetAdminAnalytics = async (
  range?: string,
  config?: AxiosConfigWithMeta,
): Promise<AdminAnalytics> => {
  try {
    const { data } = await apiClient.get(
      API_ROUTES.superadmin.analytics.admin,
      {
        ...config,
        params: { range, source: "system" },
      },
    );
    return data;
  } catch (error) {
    const handlerName = config?.handlerName || "GetAdminAnalytics";
    const stepName = config?.stepName || "Fetch Admin Analytics";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

/**
 * Get security logs
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
    const handlerName = config?.handlerName || "GetSecurityLogs";
    const stepName = config?.stepName || "Fetch Security Logs";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

/**
 * Get system logs
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
    const handlerName = config?.handlerName || "GetSystemLogs";
    const stepName = config?.stepName || "Fetch System Logs";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

/**
 * Get audit logs
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
    const handlerName = config?.handlerName || "GetAuditLogs";
    const stepName = config?.stepName || "Fetch Audit Logs";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

/**
 * Get log statistics
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
    const handlerName = config?.handlerName || "GetLogStats";
    const stepName = config?.stepName || "Fetch Log Stats";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

/**
 * Get time-series log activity
 */
export const GetLogActivity = async (
  config?: AxiosConfigWithMeta,
): Promise<LogActivityStat[]> => {
  try {
    const { data } = await apiClient.get(
      API_ROUTES.superadmin.logs.activity,
      config,
    );
    return data;
  } catch (error) {
    const handlerName = config?.handlerName || "GetLogActivity";
    const stepName = config?.stepName || "Fetch Log Activity";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

/**
 * Get active sessions for a user
 */
export const GetUserSessions = async (
  id: string,
  config?: AxiosConfigWithMeta,
): Promise<any[]> => {
  try {
    const { data } = await apiClient.get(
      API_ROUTES.superadmin.users.sessions(id),
      config,
    );
    return data;
  } catch (error) {
    const handlerName = config?.handlerName || "GetUserSessions";
    const stepName = config?.stepName || "Fetch User Sessions";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

/**
 * Revoke a specific user session
 */
export const DeleteUserSession = async (
  userId: string,
  sessionId: string,
  config?: AxiosConfigWithMeta,
): Promise<void> => {
  try {
    await apiClient.delete(
      API_ROUTES.superadmin.users.revokeSession(userId, sessionId),
      config,
    );
  } catch (error) {
    const handlerName = config?.handlerName || "DeleteUserSession";
    const stepName = config?.stepName || "Revoke User Session";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

/**
 * Get activity logs for a specific user
 */
export const GetUserActivity = async (
  id: string,
  params?: SystemLogsParams,
  config?: AxiosConfigWithMeta,
): Promise<SystemLogsResponse> => {
  try {
    const { data } = await apiClient.get(
      API_ROUTES.superadmin.users.activity(id),
      { ...config, params },
    );
    return data;
  } catch (error) {
    const handlerName = config?.handlerName || "GetUserActivity";
    const stepName = config?.stepName || "Fetch User Activity";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};
/**
 * Update user roles with audit trail
 */
export const PostUpdateUserRoles = async (
  userId: string,
  roleIds: number[],
  reason: string,
  referenceId: string,
  config?: AxiosConfigWithMeta,
): Promise<void> => {
  try {
    await apiClient.post(
      API_ROUTES.superadmin.users.updateRoles,
      {
        userId,
        roleIds,
        reason,
        referenceId,
      },
      config,
    );
  } catch (error) {
    const handlerName = config?.handlerName || "PostUpdateUserRoles";
    const stepName = config?.stepName || "Update User Roles";
    console.error(`[${handlerName}] {${stepName}}: ${error}`);
    throw error;
  }
};

export const superadminService = {
  listM2MClients: GetM2MClients,
  createM2MClient: PostM2MClient,
  revokeM2MClient: DeleteM2MClient,
  rotateM2MSecret: PostM2MSecret,
  verifyM2MClient: PatchVerifyM2MClient,
  listUsers: GetUsers,
  getUserDistribution: GetUserDistribution,
  toggleUserStatus: PostToggleUserStatus,
  updateUserRoles: PostUpdateUserRoles,
  getAdminAnalytics: GetAdminAnalytics,
  getSecurityLogs: GetSecurityLogs,
  getSystemLogs: GetSystemLogs,
  getAuditLogs: GetAuditLogs,
  getLogStats: GetLogStats,
  getLogActivity: GetLogActivity,
  getUserSessions: GetUserSessions,
  revokeUserSession: DeleteUserSession,
  getUserActivity: GetUserActivity,
};
