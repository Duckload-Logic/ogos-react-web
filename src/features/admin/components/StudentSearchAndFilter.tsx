import { X } from "lucide-react";

interface StudentSearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCourse: string;
  onCourseChange: (value: string) => void;

  courses: { value: string; label: string }[];
}

export default function StudentSearchAndFilter({
  searchTerm,
  onSearchChange,
  selectedCourse,
  onCourseChange,
  courses,
}: StudentSearchAndFilterProps) {
  return (
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
              onChange={(e) => onSearchChange(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange("")}
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
            onChange={(e) => onCourseChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {courses.map((course) => (
              <option key={course.value} value={course.value}>
                {course.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
