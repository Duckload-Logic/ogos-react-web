/**
 * Analytics Service
 * Handles student analytics data fetching and aggregation
 */

import { apiClient, AxiosConfigWithMeta } from "@/lib/api";
import { API_ROUTES } from "@/config/apiRoutes";
import { StudentAnalytics } from "../types/analytics.types";

/**
 * Fetch paginated student records
 * @param page - Page number to fetch
 * @param pageSize - Number of records per page
 * @param config - Optional axios config with metadata
 * @returns Promise resolving to paginated student records
 */
const FetchStudentPage = async (
  page: number,
  pageSize: number,
  config?: AxiosConfigWithMeta,
) => {
  try {
    const { data } = await apiClient.get(
      API_ROUTES.iir.inventory.all,
      {
        ...config,
        params: { page, page_size: pageSize },
      },
    );
    return data;
  } catch (error) {
    const handlerName = config?.handlerName ||
      'FetchStudentPage';
    const stepName = config?.stepName ||
      `Fetch Page ${page}`;
    console.error(
      `[${handlerName}] {${stepName}}: ${error}`,
    );
    throw error;
  }
};

/**
 * Aggregate student records from multiple pages
 * @param pageSize - Number of records per page
 * @param maxPages - Maximum pages to fetch
 * @param config - Optional axios config with metadata
 * @returns Promise resolving to aggregated student records
 */
export const GetStudentsAnalytics = async (
  pageSize = 100,
  maxPages = 3,
  config?: AxiosConfigWithMeta,
): Promise<StudentAnalytics[]> => {
  try {
    const allStudents: StudentAnalytics[] = [];

    for (let page = 1; page <= maxPages; page++) {
      const response = await FetchStudentPage(
        page,
        pageSize,
        {
          ...config,
          stepName: `Fetch Page ${page}`,
        },
      );

      if (response?.students) {
        allStudents.push(...response.students);

        // Stop if we got fewer records than page size
        if (response.students.length < pageSize) {
          break;
        }
      }
    }

    return allStudents;
  } catch (error) {
    const handlerName = config?.handlerName ||
      'GetStudentsAnalytics';
    const stepName = config?.stepName ||
      'Aggregate Analytics';
    console.error(
      `[${handlerName}] {${stepName}}: ${error}`,
    );
    throw error;
  }
};

/**
 * Legacy function for backward compatibility
 * @deprecated Use GetStudentsAnalytics instead
 */
export const fetchStudentsAnalytics =
  async (): Promise<StudentAnalytics[]> => {
    return GetStudentsAnalytics();
  };