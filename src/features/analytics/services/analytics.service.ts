import { apiClient } from "@/lib/api";
import { StudentAnalytics } from "../types/analytics.types";

export const fetchStudentsAnalytics = async (): Promise<StudentAnalytics[]> => {
  const allStudents: StudentAnalytics[] = [];

  for (let page = 1; page <= 3; page++) {
    const response = await apiClient.get("/students/inventory/records", {
      params: { page, page_size: 100 },
    });

    if (response.data?.students) {
      allStudents.push(...response.data.students);

      if (response.data.students.length < 100) break;
    }
  }

  return allStudents;
};