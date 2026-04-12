import { apiClient } from "@/lib/api";
import { API_ROUTES } from "@/config/apiRoutes";

export interface MonthlyVisitorStat {
  month: string;
  count: number;
}

export interface AdminDashboardResponse {
  totalStudents: number;
  totalReports: number;
  totalAppointments: number;
  totalSlips: number;
  monthlyVisitors: MonthlyVisitorStat[];
}

/**
 * Get Admin Dashboard analytics
 * @param filter Time filter (monthly, weekly, yearly)
 * @returns Admin dashboard analytics data
 */
export async function GetAdminDashboard(filter: string = "monthly"): Promise<AdminDashboardResponse> {
  try {
    const response = await apiClient.get(API_ROUTES.analytics.adminDashboard, {
      params: { filter }
    });
    return response.data;
  } catch (error: any) {
    console.error(`[GetAdminDashboard] Fetch Error: ${error.message}`);
    throw error;
  }
}

export const analyticsService = {
  GetAdminDashboard,
};
