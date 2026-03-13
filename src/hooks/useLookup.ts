/**
 * Generic Lookup Hook Factory
 * Provides a reusable hook for fetching reference/lookup data
 * with consistent caching and error handling.
 */

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { CACHE_TIMING } from "@/config/constants";
import { AxiosConfigWithMeta } from "@/lib/api";

/**
 * Generic hook for fetching lookup/reference data
 * Eliminates duplication across status, category, and other lookups
 *
 * @template T - Type of data being fetched
 * @param queryKey - React Query key (from QUERY_KEYS)
 * @param queryFn - Async function to fetch data
 * @param options - Optional query configuration
 * @returns Query result with data, isLoading, error, etc.
 */
export function useLookup<T>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<T>,
  options?: Partial<UseQueryOptions<T>>,
) {
  return useQuery<T>({
    queryKey,
    queryFn,
    ...CACHE_TIMING.LONG,
    refetchOnWindowFocus: false,
    ...options,
  });
}

/**
 * Enhanced lookup hook with metadata for error logging
 * Passes handlerName and stepName directly to service config
 *
 * @template T - Type of data being fetched
 * @param queryKey - React Query key (from QUERY_KEYS)
 * @param queryFn - Async function accepting config parameter
 * @param handlerName - Handler name for error logging
 * @param stepName - Step name for error logging
 * @param options - Optional query configuration
 * @returns Query result with data, isLoading, error, etc.
 *
 * @example
 * // Service method signature:
 * // GetSlipStatuses = (config?: AxiosConfigWithMeta) => ...
 *
 * // Hook usage:
 * const { data } = useLookupWithMeta(
 *   QUERY_KEYS.slips.lookups.statuses,
 *   (config) => slipService.GetSlipStatuses(config),
 *   'GetSlipStatuses',
 *   'Fetch Statuses',
 * );
 */
export function useLookupWithMeta<T>(
  queryKey: readonly unknown[],
  queryFn: (config?: AxiosConfigWithMeta) => Promise<T>,
  handlerName: string,
  stepName: string,
  options?: Partial<UseQueryOptions<T>>,
) {
  return useQuery<T>({
    queryKey,
    queryFn: () => {
      // Create config with metadata for error logging
      const config: AxiosConfigWithMeta = {
        handlerName,
        stepName,
      };
      // Pass config directly to service method
      return queryFn(config);
    },
    ...CACHE_TIMING.LONG,
    refetchOnWindowFocus: false,
    ...options,
  });
}
