/**
 * Lookup hooks for slip statuses and categories.
 * Consolidated from useGetSlipStatuses / useGetSlipCategories.
 */

import { useLookupWithMeta } from "@/hooks/useLookup";
import { slipService } from "../services";
import { QUERY_KEYS } from "@/config/queryKeys";
import { SlipStatus } from "../types";
import { SlipCategory } from "../types";

/**
 * Fetch all available slip statuses.
 * Uses CACHE_TIMING.LONG (1 hour stale, 2 hours gc)
 */
export function useGetSlipStatuses() {
  return useLookupWithMeta<SlipStatus[]>(
    QUERY_KEYS.slips.lookups.statuses,
    (config) => slipService.GetSlipStatuses(config),
    "GetSlipStatuses",
    "Fetch Statuses",
  );
}

/**
 * Fetch all available slip categories.
 * Uses CACHE_TIMING.LONG (1 hour stale, 2 hours gc)
 */
export function useGetSlipCategories() {
  return useLookupWithMeta<SlipCategory[]>(
    QUERY_KEYS.slips.lookups.categories,
    (config) => slipService.GetSlipCategories(config),
    "GetSlipCategories",
    "Fetch Categories",
  );
}
