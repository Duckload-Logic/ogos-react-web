/**
 * Hook for fetching slip categories
 * Migrated to use generic useLookup factory
 */

import { useLookupWithMeta } from "@/hooks/useLookup";
import { slipService } from "../services";
import { QUERY_KEYS } from "@/config/queryKeys";
import { SlipCategory } from "../types/slip";

/**
 * Fetch all available slip categories
 * Uses CACHE_TIMING.LONG (1 hour stale, 2 hours gc)
 *
 * @returns Query result with slip categories array
 */
export function useGetSlipCategories() {
  return useLookupWithMeta<SlipCategory[]>(
    QUERY_KEYS.slips.lookups.categories,
    (config) => slipService.GetSlipCategories(config),
    'GetSlipCategories',
    'Fetch Categories',
  );
}
