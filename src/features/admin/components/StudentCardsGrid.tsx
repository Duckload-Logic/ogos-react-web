import { Eye, Trash2 } from "lucide-react";
import Duck from "@/assets/icons/Duck.svg";
import { LoadingSpinner } from "@/components/shared";
import { IIRProfileView } from "@/features/iir/types/studentProfileView";
import { ProfileFemale, ProfileMale } from "@/assets/icons";

interface StudentCardsGridProps {
  students: IIRProfileView[];
  isStudentsLoading: boolean;
  onViewClick: (student: IIRProfileView) => void;
  onDeleteClick: (student: IIRProfileView) => void;
  yearLevels: { id: number; name: string }[];
}

export default function StudentCardsGrid({
  students,
  isStudentsLoading,
  onViewClick,
  onDeleteClick,
  yearLevels,
}: StudentCardsGridProps) {
  if (isStudentsLoading || !students) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="w-full h-full bg-transparent p-12 text-center items-center justify-center flex flex-col gap-4">
        <img src={Duck} alt="Duck Icon" className="w-32 h-32  " />
        <p className="text-card-foreground font-medium">No students found.</p>
      </div>
    );
  }

  const genderColors: Record<number, string> = {
    1: "bg-blue-500",
    2: "bg-pink-500",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {students.map((student) => (
        <div
          key={student.email}
          className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 border-3 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:border-primary/50"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-primary/70 opacity-60 group-hover:opacity-100 transition-opacity" />

          <div className="flex flex-col gap-3">
            {/* Name */}
            <div className="relative flex flex-row items-end justify-between gap-4">
              <p className="text-2xl font-bold  tracking-tight text-primary flex items-center gap-2 border-b-4 border-border  pb-6 mb-4">
                {student.firstName}{" "}
                {typeof student.middleName === "string" &&
                student.middleName.length > 0
                  ? student.middleName.charAt(0) + "."
                  : ""}{" "}
                {student.lastName}
              </p>
              <div className="relative group">
                {/* Decorative background glow (Optional) */}
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors" />

                <div className="relative shadow-xl p-1 z-10 rounded-full bg-background border-[6px] border-card aspect-square w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center overflow-hidden">
                  {student.gender?.id === 1 || student?.gender?.id !== 2 ? (
                    <ProfileMale className="w-4/5 h-4/5 text-primary/90" />
                  ) : (
                    <ProfileFemale className="w-4/5 h-4/5 text-primary/90" />
                  )}
                </div>

                {/* 3. Small Gender Indicator Badge */}
                <div className="absolute bottom-1 right-1 z-20 h-7 w-7 rounded-full bg-card border-2 border-background shadow-lg flex items-center justify-center">
                  <div
                    className={`h-3 w-3 rounded-full ${genderColors[student?.gender?.id] || "bg-gray-400"}`}
                  />
                </div>
              </div>
            </div>

            {/* Student Number */}
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase">
                Student Number
              </p>
              <p className="mt-1 text-sm font-semibold text-card-foreground">
                {student.studentNumber}
              </p>
            </div>

            {/* Email */}
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase">
                Email
              </p>
              <p className="mt-1 text-sm text-card-foreground font-semibold break-all line-clamp-2">
                {student.email}
              </p>
            </div>

            {/* Course */}
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase">
                Course
              </p>
              <p className="mt-1 text-sm font-semibold text-card-foreground line-clamp-2">
                {student.course.code}
              </p>
            </div>

            {/* Year Level */}
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase">
                Year Level
              </p>
              <p className="mt-1 text-sm font-semibold text-card-foreground line-clamp-2">
                {yearLevels.find((level) => level.id === student.yearLevel)
                  ?.name || "Unknown"}
              </p>
            </div>

            {/* Actions */}
            <div className="sm:col-span-2 mt-1 flex gap-2 pt-3 border-t border-border/80">
              <button
                onClick={() => onViewClick(student)}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-muted-foreground/30 px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted-foreground/50 active:scale-[0.99]"
              >
                <Eye size={15} />
                View
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
