/**
 * Hook for fetching slip statuses
 * Migrated to use generic useLookup factory
 */

import { useLookupWithMeta } from "@/hooks/useLookup";
import { slipService } from "../services";
import { QUERY_KEYS } from "@/config/queryKeys";
import { SlipStatus } from "../types";

/**
 * Fetch all available slip statuses
 * Uses CACHE_TIMING.LONG (1 hour stale, 2 hours gc)
 *
 * @returns Query result with slip statuses array
 */
export function useGetSlipStatuses() {
  return useLookupWithMeta<SlipStatus[]>(
    QUERY_KEYS.slips.lookups.statuses,
    (config) => slipService.GetSlipStatuses(config),
    'GetSlipStatuses',
    'Fetch Statuses',
  );
}
