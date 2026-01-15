/**
 * Admin Schedule Service
 * Handles all admin schedule-related API calls for the frontdesk
 */

import { apiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/config/api";

export interface AdminSchedule {
  id: string;
  adminName: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateScheduleRequest {
  adminName: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  description?: string;
}

export interface UpdateScheduleRequest extends CreateScheduleRequest {}

/**
 * Fetch all admin schedules
 * @param filters - Optional filters (month, year, adminName)
 * @returns List of schedules
 */
export const listAdminSchedules = async (
  filters?: Record<string, string>
): Promise<AdminSchedule[]> => {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }

    const url =
      params.toString().length > 0
        ? `${API_ENDPOINTS.APPOINTMENTS.LIST}?${params.toString()}`
        : API_ENDPOINTS.APPOINTMENTS.LIST;

    const response = await apiClient.get<AdminSchedule[]>(url);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching admin schedules:", error);
    throw error;
  }
};

/**
 * Get schedule by ID
 * @param id - Schedule ID
 * @returns Schedule details
 */
export const getAdminScheduleById = async (id: string): Promise<AdminSchedule> => {
  try {
    const response = await apiClient.get<AdminSchedule>(
      API_ENDPOINTS.APPOINTMENTS.GET(id)
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching schedule ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new admin schedule
 * @param payload - Schedule creation data
 * @returns Created schedule
 */
export const createAdminSchedule = async (
  payload: CreateScheduleRequest
): Promise<AdminSchedule> => {
  try {
    const response = await apiClient.post<{
      message: string;
      data: AdminSchedule;
    }>(API_ENDPOINTS.APPOINTMENTS.CREATE, payload);

    if (response.data?.data) {
      return response.data.data;
    }

    return response.data as unknown as AdminSchedule;
  } catch (error) {
    console.error("Error creating admin schedule:", error);
    throw error;
  }
};

/**
 * Update an admin schedule
 * @param id - Schedule ID
 * @param payload - Updated schedule data
 * @returns Updated schedule
 */
export const updateAdminSchedule = async (
  id: string,
  payload: UpdateScheduleRequest
): Promise<AdminSchedule> => {
  try {
    const response = await apiClient.put<{
      message: string;
      data: AdminSchedule;
    }>(API_ENDPOINTS.APPOINTMENTS.UPDATE(id), payload);

    if (response.data?.data) {
      return response.data.data;
    }

    return response.data as unknown as AdminSchedule;
  } catch (error) {
    console.error(`Error updating schedule ${id}:`, error);
    throw error;
  }
};

/**
 * Delete an admin schedule
 * @param id - Schedule ID
 * @returns Confirmation message
 */
export const deleteAdminSchedule = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await apiClient.delete<{ message: string }>(
      API_ENDPOINTS.APPOINTMENTS.DELETE(id)
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting schedule ${id}:`, error);
    throw error;
  }
};
