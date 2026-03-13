/**
 * Location Service Layer
 * Handles all location-related API calls (regions, cities, barangays)
 */

import { apiClient, AxiosConfigWithMeta } from "@/lib/api";
import { API_ROUTES } from "@/config/apiRoutes";

/**
 * Get all regions
 * @param config - Axios config with logging metadata
 * @returns Array of regions
 */
export async function GetRegions(
  config?: AxiosConfigWithMeta,
) {
  try {
    const response = await apiClient.get(
      API_ROUTES.locations.regions,
      config,
    );
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName || 'GetRegions';
    const stepName = config?.stepName || 'Fetch Regions';
    console.error(
      `[${handlerName}] {${stepName}}: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Get cities by region
 * @param regionId - Region ID
 * @param config - Axios config with logging metadata
 * @returns Array of cities
 */
export async function GetCities(
  regionId: number,
  config?: AxiosConfigWithMeta,
) {
  try {
    const response = await apiClient.get(
      API_ROUTES.locations.cities(regionId),
      config,
    );
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName || 'GetCities';
    const stepName = config?.stepName || 'Fetch Cities';
    console.error(
      `[${handlerName}] {${stepName}}: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Get barangays by city
 * @param cityId - City ID
 * @param config - Axios config with logging metadata
 * @returns Array of barangays
 */
export async function GetBarangays(
  cityId: number,
  config?: AxiosConfigWithMeta,
) {
  try {
    const response = await apiClient.get(
      API_ROUTES.locations.barangays(cityId),
      config,
    );
    return response.data;
  } catch (error: any) {
    const handlerName = config?.handlerName || 'GetBarangays';
    const stepName = config?.stepName || 'Fetch Barangays';
    console.error(
      `[${handlerName}] {${stepName}}: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Legacy service object for backward compatibility
 * Gradually migrate to direct function imports
 */
export const locationService = {
  GetRegions,
  GetCities,
  GetBarangays,
};
