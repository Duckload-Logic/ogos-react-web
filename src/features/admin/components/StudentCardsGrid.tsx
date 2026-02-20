import { Eye, Trash2 } from "lucide-react";
import Duck from "@/assets/icons/Duck.svg";

interface Student {
  id: string;
  studentId: string;
  name: string;
  course: string;
  email: string;
}

interface StudentCardsGridProps {
  students: Student[];
  onViewClick: (student: Student) => void;
  onDeleteClick: (student: Student) => void;
}

export default function StudentCardsGrid({
  students,
  onViewClick,
  onDeleteClick,
}: StudentCardsGridProps) {
  if (students.length === 0) {
    return (
      <div className="w-full h-full bg-transparent p-12 text-center items-center justify-center flex flex-col gap-4">
        <img src={Duck} alt="Duck Icon" className="w-32 h-32  " />
        <p className="text-card-foreground font-medium">No students found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {students.map((student) => (
        <div
          key={student.id}
          className="bg-card rounded-lg shadow border border-border p-6 hover:shadow-lg transition-shadow"
        >
          <div className="space-y-4">
            {/* Student ID */}
            <div>
              <p className="text-xs font-medium text-card-foreground uppercase tracking-wider">
                Student ID
              </p>
              <p className="text-sm font-mono font-semibold text-card-foreground mt-1">
                {student.studentId}
              </p>
            </div>

            {/* Name */}
            <div>
              <p className="text-xs font-medium text-card-foreground uppercase tracking-wider">
                Name
              </p>
              <p className="text-sm font-semibold text-card-foreground mt-1 line-clamp-2">
                {student.name}
              </p>
            </div>

            {/* Course */}
            <div>
              <p className="text-xs font-medium text-card-foreground uppercase tracking-wider">
                Course
              </p>
              <p className="text-sm text-card-foreground mt-1 line-clamp-2">
                {student.course}
              </p>
            </div>

            {/* Email */}
            <div>
              <p className="text-xs font-medium text-card-foreground uppercase tracking-wider">
                Email
              </p>
              <p className="text-sm text-card-foreground mt-1 break-all line-clamp-2">
                {student.email}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-border">
              <button
                onClick={() => onViewClick(student)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-400 dark:bg-gray-600 text-white dark:text-gray-300 rounded hover:bg-gray-500 transition-colors text-xs font-medium"
              >
                <Eye size={14} />
                View
              </button>
              <button
                onClick={() => onDeleteClick(student)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-primary text-primary-foreground rounded hover:bg-red-950 transition-colors text-xs font-medium"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
