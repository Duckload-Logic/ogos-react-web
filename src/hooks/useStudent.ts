import { apiClient } from "@/lib/api";

export const useStudent = () => {
  const fetchStudentData = async (userId: string) => {
    const { data } = await apiClient.get(`/students/${userId}`, {
      params: {
        include_address: true,
        include_finance: true,
        include_health: true,
        include_family: true,
        include_education: true,
        include_parents: true,
      },
    });
    return data;
  };

  return {
    fetchStudentData,
  };
};
