import { useEffect, useState } from "react";
import { StudentAnalytics } from "../types/analytics.types";
import { fetchStudentsAnalytics } from "../services/analytics.service";

export const useStudentAnalytics = () => {
  const [students, setStudents] = useState<StudentAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchStudentsAnalytics();
        setStudents(data);
      } catch (err) {
        setError("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { students, loading, error };
};