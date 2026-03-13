import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { superadminService } from "../services";
import { QUERY_KEYS } from "@/config/queryKeys";
import { CACHE_TIMING } from "@/config/constants";
import type { CreateAPIKeyRequest, SystemLogsParams } from "../types";

// API Key hooks
export function useAPIKeys(includeRevoked = false) {
  return useQuery({
    queryKey: QUERY_KEYS.superadmin.apiKeys(
      includeRevoked,
    ),
    queryFn: () =>
      superadminService.listAPIKeys(includeRevoked),
    staleTime: CACHE_TIMING.MEDIUM.staleTime,
    gcTime: CACHE_TIMING.MEDIUM.gcTime,
  });
}

export function useCreateAPIKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAPIKeyRequest) =>
      superadminService.createAPIKey(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.superadmin.apiKeys(false),
      });
    },
  });
}

export function useRevokeAPIKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      superadminService.revokeAPIKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.superadmin.apiKeys(false),
      });
    },
  });
}

// Log hooks
export function useSecurityLogs(
  params?: SystemLogsParams,
) {
  return useQuery({
    queryKey: QUERY_KEYS.superadmin.securityLogs(
      params,
    ),
    queryFn: () =>
      superadminService.getSecurityLogs(params),
    staleTime: CACHE_TIMING.MEDIUM.staleTime,
    gcTime: CACHE_TIMING.MEDIUM.gcTime,
  });
}

export function useSystemLogs(
  params?: SystemLogsParams,
) {
  return useQuery({
    queryKey: QUERY_KEYS.superadmin.systemLogs(
      params,
    ),
    queryFn: () =>
      superadminService.getSystemLogs(params),
    staleTime: CACHE_TIMING.MEDIUM.staleTime,
    gcTime: CACHE_TIMING.MEDIUM.gcTime,
  });
}

export function useAuditLogs(
  params?: SystemLogsParams,
) {
  return useQuery({
    queryKey: QUERY_KEYS.superadmin.auditLogs(
      params,
    ),
    queryFn: () =>
      superadminService.getAuditLogs(params),
    staleTime: CACHE_TIMING.MEDIUM.staleTime,
    gcTime: CACHE_TIMING.MEDIUM.gcTime,
  });
}

export function useLogStats(
  startDate?: string,
  endDate?: string,
) {
  return useQuery({
    queryKey: QUERY_KEYS.superadmin.logStats(
      startDate,
      endDate,
    ),
    queryFn: () =>
      superadminService.getLogStats(
        startDate,
        endDate,
      ),
    staleTime: CACHE_TIMING.MEDIUM.staleTime,
    gcTime: CACHE_TIMING.MEDIUM.gcTime,
  });
}
