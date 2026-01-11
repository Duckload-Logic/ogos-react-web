import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import StudentRecordsHeader from "../components/StudentRecordsHeader";
import StudentSearchAndFilter from "../components/StudentSearchAndFilter";
import StudentCardsGrid from "../components/StudentCardsGrid";
import AddStudentModal, { addStudentSchema } from "../components/AddStudentModal";
import StudentDetailsModal from "../components/StudentDetailsModal";
import type { AddStudentForm } from "../components/AddStudentModal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient } from "@/lib/api";
import { email } from "zod";

interface Student {
  id: string;
  studentId: string;
  name: string;
  course: string;
  email: string;
}

export default function StudentRecords() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      // Simulate fetching data from an API
      const response = await apiClient.get("/students/records");
      let toAppend = [];
      response.data.students.map((student: any) => {
          toAppend.push({
            id: student.studentRecordId,
            studentId: `2023-${String(students.length + 109).padStart(5, "0")}-TG-0`,
            name: `${student.lastName}, ${student.firstName}`,
            course: student.course,
            email: student.email,
        })

        setStudents(toAppend);
      });
    };

    fetchStudents();
  }, [])


  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState("personal");

const courses = [
  { value: "All Courses", label: "All Courses" },
  { value: "BSECE", label: "Bachelor of Science in Electronics Engineering (BSECE)" },
  { value: "BSME", label: "Bachelor of Science in Mechanical Engineering (BSME)" },
  { value: "BSA", label: "Bachelor of Science in Accountancy (BSA)" },
  { value: "BSBA-HRDM", label: "Bachelor of Science in Business Administration - Human Resource Development Management (BSBA-HRDM)" },
  { value: "BSBA-MM", label: "Bachelor of Science in Business Administration - Marketing Management (BSBA-MM)" },
  { value: "BSAM", label: "Bachelor of Science in Applied Mathematics (BSAM)" },
  { value: "BSIT", label: "Bachelor of Science in Information Technology (BSIT)" },
  { value: "BSENTREP", label: "Bachelor of Science in Entrepreneurship (BSENTREP)" },
  { value: "BSED-EN", label: "Bachelor in Secondary Education - English (BSED-EN)" },
  { value: "BSED-MATH", label: "Bachelor in Secondary Education - Mathematics (BSED-MATH)" },
  { value: "BSOA", label: "Bachelor of Science in Office Administration (BSOA)" },
  { value: "DICT", label: "Diploma in Information Communication Technology (DICT)" },
  { value: "DOMT", label: "Diploma in Office Management Technology (DOMT)" },
];

  const form = useForm<AddStudentForm>({
    resolver: zodResolver(addStudentSchema),
  });

  const onSubmit = (data: AddStudentForm) => {
    const newStudent: Student = {
      id: String(students.length + 1).padStart(3, "0"),
      studentId: `2023-${String(students.length + 109).padStart(5, "0")}-TG-0`,
      name: data.name,
      course: data.course,
      email: data.email,
    };
    setStudents([...students, newStudent]);
    setShowAdd(false);
    form.reset();
  };

  const filteredStudents = students.filter((s) => {
    const courseMatch =
      selectedCourse === "All Courses" || s.course === selectedCourse;

    const searchMatch =
      searchTerm.trim() === "" ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase());

    return courseMatch && searchMatch;
  });

  return (
    <Layout title="Student Records">
      <div className="space-y-6">
        <StudentRecordsHeader onAddClick={() => setShowAdd(true)} />
        <StudentSearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCourse={selectedCourse}
          onCourseChange={setSelectedCourse}
          courses={courses}
        />
        <StudentCardsGrid
          students={filteredStudents}
          onViewClick={(student) => {
            setSelectedStudent(student);
            setActiveTab("personal");
          }}
          onDeleteClick={(student) => {
            console.log("Delete student:", student.id);
          }}
        />
      </div>
      <AddStudentModal
        isOpen={showAdd}
        onClose={() => {
          setShowAdd(false);
          form.reset();
        }}
        onSubmit={onSubmit}
        courses={courses}
      />
      <StudentDetailsModal
        student={selectedStudent}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onClose={() => setSelectedStudent(null)}
      />
    </Layout>
  );
}