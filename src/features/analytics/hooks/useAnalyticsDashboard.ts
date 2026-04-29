import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api";
import { DashboardResponse, AnalyticsCourse } from "../types/analytics.types";

export function useAnalyticsDashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [courses, setCourses] = useState<AnalyticsCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(
    async (year?: number, courseId?: number, statusId?: number) => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (year) params.append("year", year.toString());
        if (courseId) params.append("course_id", courseId.toString());
        if (statusId) params.append("status_id", statusId.toString());

        const response = await apiClient.get(
          `/analytics/dashboard?${params.toString()}`,
        );

        // The apiClient interceptor in api.ts already unwraps JSend responses
        // and validates the "success" status. response.data is now the dashboard object.
        if (response.data) {
          setData(response.data);
        } else {
          setError("Failed to fetch dashboard data");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchCourses = useCallback(async () => {
    try {
      const response = await apiClient.get("/students/lookups/courses");
      if (response.data.success) {
        setCourses(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch courses", err);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    fetchCourses();
  }, [fetchDashboard, fetchCourses]);

  return {
    data,
    courses,
    loading,
    error,
    refresh: fetchDashboard,
  };
}
