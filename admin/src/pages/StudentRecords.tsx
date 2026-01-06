import Layout from "@/components/Layout";
import { useState } from "react";
import { Plus, Trash2, Eye, X, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

const addStudentSchema = z.object({
  name: z.string().min(2, "Name is required"),
  course: z.string().min(3, "Course is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(7, "Invalid phone number")
    .max(15, "Invalid phone number"),
  dateEnrolled: z.string().optional(),
  institutionType: z.enum(["Private", "Public"]),
  numberOfSiblings: z.number().int().min(0, "Cannot be negative").optional(),
});

type AddStudentForm = z.infer<typeof addStudentSchema>;

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
        {/* List of Students Header with Buttons */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">List of Students</h2>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">
              <Clock size={18} />
              History
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Search:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Filter by Course:
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Add Student Modal */}
        {showAdd && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Add Student Record</h3>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Name *
                    </label>
                    <input
                      {...form.register("name")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-destructive mt-1">
                        {String(form.formState.errors.name.message)}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Course *
                    </label>
                    <select
                      {...form.register("course")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select Course</option>
                      {courses.slice(1).map((course) => (
                        <option key={course} value={course}>
                          {course}
                        </option>
                      ))}
                    </select>
                    {form.formState.errors.course && (
                      <p className="text-sm text-destructive mt-1">
                        {String(form.formState.errors.course.message)}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email *
                    </label>
                    <input
                      {...form.register("email")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-destructive mt-1">
                        {String(form.formState.errors.email.message)}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone *
                    </label>
                    <input
                      {...form.register("phone")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {form.formState.errors.phone && (
                      <p className="text-sm text-destructive mt-1">
                        {String(form.formState.errors.phone.message)}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Institution Type
                    </label>
                    <select
                      {...form.register("institutionType")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Private">Private</option>
                      <option value="Public">Public</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Number of Siblings
                    </label>
                    <input
                      type="number"
                      min={0}
                      {...form.register("numberOfSiblings", {
                        valueAsNumber: true,
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdd(false);
                      form.reset();
                    }}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-foreground hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    Add Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Student Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="space-y-4">
                {/* Student ID */}
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Student ID
                  </p>
                  <p className="text-sm font-mono font-semibold text-foreground mt-1">
                    {student.studentId}
                  </p>
                </div>

                {/* Name */}
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Name
                  </p>
                  <p className="text-sm font-semibold text-foreground mt-1 line-clamp-2">
                    {student.name}
                  </p>
                </div>

                {/* Course */}
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Course
                  </p>
                  <p className="text-sm text-foreground mt-1 line-clamp-2">
                    {student.course}
                  </p>
                </div>

                {/* Email */}
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Email
                  </p>
                  <p className="text-sm text-foreground mt-1 break-all line-clamp-2">
                    {student.email}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-gray-200">
                  <button 
                    onClick={() => {
                      setSelectedStudent(student);
                      setActiveTab("personal");
                    }}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors text-xs font-medium">
                    <Eye size={14} />
                    View
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-900 text-white rounded hover:bg-red-950 transition-colors text-xs font-medium">
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No students found.</p>
          </div>
        )}
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <button
                onClick={() => setSelectedStudent(null)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:bg-gray-100 rounded transition-colors"
              >
                ← Back
              </button>
              <h2 className="text-lg font-semibold">{selectedStudent.name}</h2>
              <div className="w-16"></div>
            </div>

            {/* Student Info Section */}
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Name</p>
                  <p className="text-sm font-medium text-foreground">{selectedStudent.name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Student ID</p>
                  <p className="text-sm font-medium text-foreground">{selectedStudent.studentId}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-gray-50">
              <button
                onClick={() => setActiveTab("personal")}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "personal"
                    ? "bg-white border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Personal Info
              </button>
              <button
                onClick={() => setActiveTab("education")}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "education"
                    ? "bg-white border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Education
              </button>
              <button
                onClick={() => setActiveTab("family")}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "family"
                    ? "bg-white border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Family
              </button>
              <button
                onClick={() => setActiveTab("health")}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "health"
                    ? "bg-white border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Health
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "notes"
                    ? "bg-white border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Significant Notes
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "personal" && (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Email</p>
                    <p className="text-sm text-foreground">{selectedStudent.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Phone</p>
                    <p className="text-sm text-foreground">{selectedStudent.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Date Enrolled</p>
                    <p className="text-sm text-foreground">{selectedStudent.dateEnrolled}</p>
                  </div>
                </div>
              )}

              {activeTab === "education" && (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Course</p>
                    <p className="text-sm text-foreground">{selectedStudent.course}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Institution Type</p>
                    <p className="text-sm text-foreground">{selectedStudent.institutionType || "N/A"}</p>
                  </div>
                </div>
              )}

              {activeTab === "family" && (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Number of Siblings</p>
                    <p className="text-sm text-foreground">{selectedStudent.numberOfSiblings ?? "N/A"}</p>
                  </div>
                  <p className="text-sm text-muted-foreground italic">More family information can be added here</p>
                </div>
              )}

              {activeTab === "health" && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground italic">Health information can be added here</p>
                </div>
              )}

              {activeTab === "notes" && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground italic">Significant notes can be added here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

