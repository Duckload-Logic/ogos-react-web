import Layout from "@/components/Layout";
import { useState } from "react";
import { Plus, Trash2, Eye, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface Student {
  id: string;
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
      name: "Juan Dela Cruz",
      course: "BS Information Technology",
      email: "juan.delacuz@pup.edu.ph",
      phone: "09123456789",
      dateEnrolled: "2023-08-15",
    },
    {
      id: "002",
      name: "Maria Santos",
      course: "BS Business Administration",
      email: "maria.santos@pup.edu.ph",
      phone: "09234567890",
      dateEnrolled: "2023-08-15",
    },
    {
      id: "003",
      name: "Carlos Reyes",
      course: "BS Civil Engineering",
      email: "carlos.reyes@pup.edu.ph",
      phone: "09345678901",
      dateEnrolled: "2023-08-15",
    },
    {
      id: "004",
      name: "Angela Dela Cruz",
      course: "BS Nursing",
      email: "angela.delacuz@pup.edu.ph",
      phone: "09456789012",
      dateEnrolled: "2023-08-15",
    },
    {
      id: "005",
      name: "Miguel Torres",
      course: "BS Information Technology",
      email: "miguel.torres@pup.edu.ph",
      phone: "09567890123",
      dateEnrolled: "2023-08-15",
    },
  ]);

  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const courses = [
    "All Courses",
    "BS Information Technology",
    "BS Business Administration",
    "BS Civil Engineering",
    "BS Nursing",
  ];

  const filteredStudents = students.filter((s) => {
    const courseMatch =
      selectedCourse === "All Courses" || s.course === selectedCourse;

    let searchMatch = true;
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      if (searchType === "name") {
        searchMatch = s.name.toLowerCase().includes(lowerSearch);
      } else if (searchType === "email") {
        searchMatch = s.email.toLowerCase().includes(lowerSearch);
      } else if (searchType === "id") {
        searchMatch = s.id.toLowerCase().includes(lowerSearch);
      }
    }

    return courseMatch && searchMatch;
  });

  return (
    <Layout title="Student Records">
      <div className="space-y-6">
        {/* Search & Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow border border-gray-200">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Search by:
            </label>
            <div className="flex gap-2">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="id">ID</option>
              </select>
              <input
                type="text"
                placeholder={`Search by ${searchType}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Filter by Course:
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              {courses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Student Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <Plus size={20} />
            Add Student
          </button>
        </div>

        {/* Add Student Modal */}
        {showAdd && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Add Student</h3>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                    <input
                      {...form.register("name")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-destructive">{String(form.formState.errors.name.message)}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Course</label>
                    <input
                      {...form.register("course")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    {form.formState.errors.course && (
                      <p className="text-sm text-destructive">{String(form.formState.errors.course.message)}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                    <input
                      {...form.register("email")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-destructive">{String(form.formState.errors.email.message)}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                    <input
                      {...form.register("phone")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    {form.formState.errors.phone && (
                      <p className="text-sm text-destructive">{String(form.formState.errors.phone.message)}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Institution Type</label>
                    <select {...form.register("institutionType")} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option>Private</option>
                      <option>Public</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Number of Siblings</label>
                    <input
                      type="number"
                      min={0}
                      {...form.register("numberOfSiblings", { valueAsNumber: true })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    {form.formState.errors.numberOfSiblings && (
                      <p className="text-sm text-destructive">{String(form.formState.errors.numberOfSiblings.message)}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdd(false);
                      form.reset();
                    }}
                    className="px-4 py-2 rounded-lg border"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Add</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="px-6 py-4 text-left font-semibold">Name</th>
                  <th className="px-6 py-4 text-left font-semibold">Course</th>
                  <th className="px-6 py-4 text-left font-semibold">Email</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredStudents.map((student, idx) => (
                  <tr
                    key={student.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-foreground">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      {student.course}
                    </td>
                    <td className="px-6 py-4 text-foreground text-sm">
                      {student.email}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium">
                          <Eye size={16} />
                          View
                        </button>
                        <button className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium">
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">No students found.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
