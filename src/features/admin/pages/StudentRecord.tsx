import Layout from "@/components/Layout";
import { useStudent } from "@/hooks/useStudent";
import { unhashId } from "@/lib/hash";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

export default function StudentRecord() {
  const location = useLocation();
  const { studentId } = useParams();
  const student = location.state?.student;
  
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchStudentData } = useStudent();

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        let id = student?.id;
        
        // Decode hash from URL if no student data in state
        if (!id && studentId) {
          id = unhashId(decodeURIComponent(studentId));
        }
        
        if (!id) {
          setError("No student ID provided");
          return;
        }
        
        const data = await fetchStudentData(id);
        setStudentData(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load student data";
        setError(errorMessage);
        console.error("Failed to load student data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStudentData();
  }, [student]);

  if (loading) return <Layout title="Student Record"><p>Loading...</p></Layout>;
  if (error) return <Layout title={`Student Record > ${studentData?.lastName || ""}, ${studentData?.firstName || ""}`}><p className="text-red-500">{error}</p></Layout>;

  return (
    <Layout title={`Student Record > ${studentData.lastName || ''}, ${studentData.firstName || ''}`}>
      {/* <>{studentData && JSON.stringify(studentData)}</> */}
      <div className="p-4 bg-card border border-border rounded shadow text-sm text-card-foreground flex items-center justify-center">
        Still in development. 🦆
        <StudentRecordsHeader onAddClick={() => {}} />
      </div>
    </Layout>
  );
}

function StudentRecordsHeader({ onAddClick }: { onAddClick: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-foreground">Student Records</h1>
      <button
        onClick={onAddClick}
        className="px-4 py-2 bg-primary text-background rounded hover:bg-primary/90 transition-colors"
      >
        Add Student
      </button>
    </div>
  );
}