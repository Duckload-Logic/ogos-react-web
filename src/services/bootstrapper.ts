/**
 * Application Bootstrapper Service
 * Centralizes app initialization with Promise Singleton pattern
 * Ensures high-frequency data is fetched once and cached globally
 */

import { AxiosConfigWithMeta } from "@/lib/api";
import { User } from "@/features/users/types/user";

/**
 * Bootstrap data structure
 * Contains all critical data needed for app initialization
 */
export interface BootstrapData {
  user: User;
  slipStatuses: any[];
  slipCategories: any[];
  appointmentStatuses: any[];
  appointmentCategories: any[];
  regions: any[];
}

/**
 * Promise Singleton for bootstrap initialization
 * Prevents redundant network calls when BootstrapApp is called
 * multiple times in parallel
 */
let bootstrapPromise: Promise<BootstrapData> | null = null;

/**
 * Initialize application with critical data
 * Uses Promise Singleton pattern to avoid redundant API calls
 *
 * @returns Promise resolving to bootstrap data
 *
 * @example
 * // First call - fetches data
 * const data1 = await BootstrapApp();
 *
 * // Second call - returns same pending promise
 * const data2 = await BootstrapApp();
 *
 * // Both resolve to identical data without extra requests
 */
export async function BootstrapApp(): Promise<BootstrapData> {
  // If bootstrap is already in progress, return existing promise
  if (bootstrapPromise) {
    return bootstrapPromise;
  }

  // Create new bootstrap promise
  bootstrapPromise = (async () => {
    try {
      // Import services here to avoid circular dependencies
      const { userService } = await import(
        "@/features/users/services/service"
      );
      const { slipService } = await import(
        "@/features/slips/services"
      );
      const { appointmentService } = await import(
        "@/features/appointments/services"
      );
      const { locationService } = await import(
        "@/features/locations/services"
      );

      // Create config for error logging
      const config: AxiosConfigWithMeta = {
        handlerName: 'BootstrapApp',
        stepName: 'Initialize',
      };

      // Fetch user data first (required for auth)
      const user = await userService.GetMe(config);

      // Fetch all lookup data in parallel
      const [
        slipStatuses,
        slipCategories,
        appointmentStatuses,
        appointmentCategories,
        regions,
      ] = await Promise.all([
        slipService.GetSlipStatuses(config),
        slipService.GetSlipCategories(config),
        appointmentService.GetAppointmentStatuses(config),
        appointmentService.GetAppointmentCategories(config),
        locationService.GetRegions(config),
      ]);

      const bootstrapData: BootstrapData = {
        user,
        slipStatuses,
        slipCategories,
        appointmentStatuses,
        appointmentCategories,
        regions,
      };

      console.log(
        '[BootstrapApp] {Initialize}: Bootstrap complete',
      );

      return bootstrapData;
    } catch (error: any) {
      // Clear promise on error to allow retry
      bootstrapPromise = null;

      const errorMsg = error.message || 'Unknown error';
      console.error(
        `[BootstrapApp] {Initialize}: ${errorMsg}`,
      );

      throw error;
    }
  })();

  return bootstrapPromise;
}

/**
 * Reset bootstrap state
 * Clears the singleton promise to force re-initialization
 * Useful for logout or session refresh scenarios
 *
 * @example
 * // On logout
 * ResetBootstrap();
 * // Next BootstrapApp() call will fetch fresh data
 */
export function ResetBootstrap(): void {
  bootstrapPromise = null;
  console.log('[BootstrapApp] {Reset}: Bootstrap state cleared');
}

/**
 * Get current bootstrap promise without triggering new fetch
 * Returns null if bootstrap hasn't been initiated
 *
 * @returns Current bootstrap promise or null
 */
export function GetBootstrapPromise(
): Promise<BootstrapData> | null {
  return bootstrapPromise;
}
