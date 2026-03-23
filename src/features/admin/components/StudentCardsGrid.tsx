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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {students.map((student) => (
        <div
          key={student.email}
          className="group relative overflow-hidden rounded-[28px] border border-glass-border bg-glass-bg backdrop-blur-glass p-6 shadow-sm transition-all duration-500 hover:bg-glass-bg/40 hover:shadow-2xl hover:border-primary/30 hover:-translate-y-1.5 active:scale-[0.98]"
        >
          {/* Subtle Gradient Accent */}
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />

          <div className="flex flex-col gap-5 relative z-10">
            {/* Header with Avatar and Name */}
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="relative group/avatar">
                {/* Avatar Glow */}
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover/avatar:bg-primary/30 transition-all duration-700 opacity-0 group-hover:opacity-100" />

                <div className="relative h-28 w-28 rounded-full bg-glass-bg/50 border-[6px] border-white/40 dark:border-black/20 shadow-xl flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover/avatar:scale-105">
                  {student.gender?.id === 1 || student?.gender?.id !== 2 ? (
                    <ProfileMale className="w-4/5 h-4/5 text-primary/80" />
                  ) : (
                    <ProfileFemale className="w-4/5 h-4/5 text-primary/80" />
                  )}
                </div>

                {/* Gender Indicator Badge */}
                <div className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center transition-transform duration-500 group-hover/avatar:translate-x-1 group-hover/avatar:translate-y-1">
                  <div
                    className={`h-3.5 w-3.5 rounded-full shadow-sm ${genderColors[student?.gender?.id] || "bg-gray-400"}`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {student.firstName} {student.lastName} {student.suffixName}
                </h3>
                <p className="text-[11px] font-bold text-primary/60 uppercase tracking-widest">
                  {student.studentNumber}
                </p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 gap-3 pt-2 border-t border-glass-border/30">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                  Email Address
                </span>
                <span className="text-sm font-medium text-foreground/80 truncate">
                  {student.email}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                    Course
                  </span>
                  <span className="text-sm font-semibold text-primary/80">
                    {student.course.code}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                    Year Level
                  </span>
                  <span className="text-sm font-semibold text-foreground/80">
                    {yearLevels
                      .find((level) => level.id === student.yearLevel)
                      ?.name.split(" ")[0] || "N/A"}{" "}
                    Year
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2">
              <button
                onClick={() => onViewClick(student)}
                className="w-full group/btn inline-flex items-center justify-center gap-2 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 transition-all duration-300 py-3 text-xs font-bold uppercase tracking-wider active:scale-[0.97]"
              >
                <Eye
                  size={16}
                  className="transition-transform group-hover/btn:scale-110"
                />
                View Profile
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
