import { apiClient } from "@/lib/api";
import type {
  APIKey,
  CreateAPIKeyRequest,
  CreateAPIKeyResponse,
  SystemLogsResponse,
  SystemLogsParams,
  LogStats,
} from "../types";

const API_KEY_ROUTES = {
  list: "/api-keys",
  create: "/api-keys",
  revoke: (id: number) => `/api-keys/${id}`,
};

const LOG_ROUTES = {
  all: "/system-logs",
  audit: "/system-logs/audit",
  system: "/system-logs/system",
  security: "/system-logs/security",
  stats: "/system-logs/stats",
};

export const superadminService = {
  // API Key endpoints
  async listAPIKeys(includeRevoked = false): Promise<APIKey[]> {
    const response = await apiClient.get(API_KEY_ROUTES.list, {
      params: { include_revoked: includeRevoked },
    });
    return response.data;
  },

  async createAPIKey(data: CreateAPIKeyRequest): Promise<CreateAPIKeyResponse> {
    const response = await apiClient.post(API_KEY_ROUTES.create, data);
    return response.data;
  },

  async revokeAPIKey(id: number): Promise<void> {
    await apiClient.delete(API_KEY_ROUTES.revoke(id));
  },

  // Log endpoints
  async getSecurityLogs(
    params?: SystemLogsParams,
  ): Promise<SystemLogsResponse> {
    const response = await apiClient.get(LOG_ROUTES.security, { params });
    return response.data;
  },

  async getSystemLogs(params?: SystemLogsParams): Promise<SystemLogsResponse> {
    const response = await apiClient.get(LOG_ROUTES.system, { params });
    return response.data;
  },

  async getAuditLogs(params?: SystemLogsParams): Promise<SystemLogsResponse> {
    const response = await apiClient.get(LOG_ROUTES.audit, { params });
    return response.data;
  },

  async getLogStats(startDate?: string, endDate?: string): Promise<LogStats[]> {
    const response = await apiClient.get(LOG_ROUTES.stats, {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },
};
