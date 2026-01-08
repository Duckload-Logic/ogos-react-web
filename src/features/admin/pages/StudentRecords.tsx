import Layout from "@/components/Layout";
import { useState } from "react";
import StudentRecordsHeader from "../components/StudentRecordsHeader";
import StudentSearchAndFilter from "../components/StudentSearchAndFilter";
import StudentCardsGrid from "../components/StudentCardsGrid";
import AddStudentModal, { addStudentSchema } from "../components/AddStudentModal";
import StudentDetailsModal from "../components/StudentDetailsModal";
import type { AddStudentForm } from "../components/AddStudentModal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface Student {
  id: string;
  studentId: string;
  name: string;
  course: string;
  email: string;
  phone: string;
  dateEnrolled: string;
  institutionType?: "Private" | "Public";
  numberOfSiblings?: number;
}

export default function StudentRecords() {
  const [students, setStudents] = useState<Student[]>([
    {
      id: "001",
      studentId: "2023-00109-TG-0",
      name: "Juan Dela Cruz",
      course: "Bachelor of Science in Information Technology (BSIT)",
      email: "juan.delacuz@pup.edu.ph",
      phone: "09123456789",
      dateEnrolled: "2023-08-15",
    },
    {
      id: "002",
      studentId: "2023-00234-TG-0",
      name: "Maria Santos",
      course: "Bachelor of Science in Business Administration - Marketing Management (BSBA-MM)",
      email: "maria.santos@pup.edu.ph",
      phone: "09234567890",
      dateEnrolled: "2023-08-15",
    },
    {
      id: "003",
      studentId: "2023-00345-TG-0",
      name: "Carlos Reyes",
      course: "Bachelor of Science in Electronics Engineering (BSECE)",
      email: "carlos.reyes@pup.edu.ph",
      phone: "09345678901",
      dateEnrolled: "2023-08-15",
    },
    {
      id: "004",
      studentId: "2023-00456-TG-0",
      name: "Angela Dela Cruz",
      course: "Bachelor in Secondary Education - English (BSED-EN)",
      email: "angela.delacuz@pup.edu.ph",
      phone: "09456789012",
      dateEnrolled: "2023-08-15",
    },
    {
      id: "005",
      studentId: "2023-00567-TG-0",
      name: "Miguel Torres",
      course: "Bachelor of Science in Information Technology (BSIT)",
      email: "miguel.torres@pup.edu.ph",
      phone: "09567890123",
      dateEnrolled: "2023-08-15",
    },
  ]);

  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState("personal");

  const courses = [
    "All Courses",
    "Bachelor of Science in Electronics Engineering (BSECE)",
    "Bachelor of Science in Mechanical Engineering (BSME)",
    "Bachelor of Science in Accountancy (BSA)",
    "Bachelor of Science in Business Administration - Human Resource Development Management (BSBA-HRDM)",
    "Bachelor of Science in Business Administration - Marketing Management (BSBA-MM)",
    "Bachelor of Science in Applied Mathematics (BSAM)",
    "Bachelor of Science in Information Technology (BSIT)",
    "Bachelor of Science in Entrepreneurship (BSENTREP)",
    "Bachelor in Secondary Education - English (BSED-EN)",
    "Bachelor in Secondary Education - Mathematics (BSED-MATH)",
    "Bachelor of Science in Office Administration (BSOA)",
    "Diploma in Information Communication Technology (DICT)",
    "Diploma in Office Management Technology (DOMT)",
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
      phone: data.phone,
      dateEnrolled: data.dateEnrolled || new Date().toISOString().split("T")[0],
      institutionType: data.institutionType,
      numberOfSiblings: data.numberOfSiblings,
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