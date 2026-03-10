import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { superadminService } from "../services";
import type { CreateAPIKeyRequest, SystemLogsParams } from "../types";

const STALE_TIME = 2 * 60 * 1000;
const GC_TIME = 10 * 60 * 1000;

// API Key hooks
export function useAPIKeys(includeRevoked = false) {
  return useQuery({
    queryKey: ["api-keys", includeRevoked],
    queryFn: () => superadminService.listAPIKeys(includeRevoked),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useCreateAPIKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAPIKeyRequest) =>
      superadminService.createAPIKey(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
  });
}

export function useRevokeAPIKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => superadminService.revokeAPIKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
  });
}

// Log hooks
export function useSecurityLogs(params?: SystemLogsParams) {
  return useQuery({
    queryKey: ["security-logs", params],
    queryFn: () => superadminService.getSecurityLogs(params),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useSystemLogs(params?: SystemLogsParams) {
  return useQuery({
    queryKey: ["system-logs", params],
    queryFn: () => superadminService.getSystemLogs(params),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useAuditLogs(params?: SystemLogsParams) {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => superadminService.getAuditLogs(params),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useLogStats(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ["log-stats", startDate, endDate],
    queryFn: () => superadminService.getLogStats(startDate, endDate),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}
