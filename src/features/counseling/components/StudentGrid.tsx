import { Eye } from "lucide-react";
import { Spinner } from "@/components/shared";
import { IIRProfileView } from "@/features/iir/types";
import { ProfileFemale, ProfileMale } from "@/assets/icons";
import { NothingFound } from "@/components/shared/NothingFound";
import { cn } from "@/lib/utils";

interface StudentGridProps {
  students: IIRProfileView[];
  isStudentsLoading: boolean;
  onViewClick: (student: IIRProfileView) => void;
  onDeleteClick: (student: IIRProfileView) => void;
  yearLevels: { id: number; name: string }[];
}

export default function StudentGrid({
  students,
  isStudentsLoading,
  onViewClick,
  onDeleteClick,
  yearLevels,
}: StudentGridProps) {
  if (isStudentsLoading || !students) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (students.length === 0) {
    return <NothingFound message="No students found." />;
  }

  const genderColors: Record<number, string> = {
    1: "bg-blue-500",
    2: "bg-pink-500",
  };

  const statusColors: Record<number, string> = {
    1: "bg-green-500/10 text-green-600 border-green-500/20",
    2: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    3: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    4: "bg-gray-500/10 text-gray-600 border-gray-500/20",
    5: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {students.map((student) => (
        <div
          key={student.email}
          className={cn(
            "hover:bg-glass-bg/40 group relative overflow-hidden",
            "rounded-[28px] border border-glass-border bg-glass-bg p-6",
            "shadow-sm backdrop-blur-glass transition-all duration-500",
            "hover:-translate-y-1.5 hover:border-primary/30",
            "hover:shadow-2xl active:scale-[0.98]",
          )}
        >
          {/* Status Badge */}
          <div
            className={`absolute right-4 top-4 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${statusColors[student.status?.id] || "bg-gray-200"}`}
          >
            {student.status?.name || "Unknown"}
          </div>
          {/* Subtle Gradient Accent */}
          <div
            className={cn(
              "absolute -right-10 -top-10 h-32 w-32 rounded-full",
              "bg-primary/5 blur-3xl transition-colors duration-500",
              "group-hover:bg-primary/10",
            )}
          />

          <div className="relative z-10 flex flex-col gap-5">
            {/* Header with Avatar and Name */}
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="group/avatar relative">
                {/* Avatar Glow */}
                <div
                  className={cn(
                    "absolute inset-0 rounded-full bg-primary/20 opacity-0",
                    "blur-2xl transition-all duration-700",
                    "group-hover/avatar:bg-primary/30 group-hover:opacity-100",
                  )}
                />

                <div
                  className={cn(
                    "bg-glass-bg/50 relative flex h-28 w-28 items-center",
                    "justify-center overflow-hidden rounded-full border-[6px]",
                    "border-white/40 shadow-xl transition-transform duration-500",
                    "group-hover/avatar:scale-105 dark:border-black/20",
                  )}
                >
                  {student.gender?.id === 1 || student?.gender?.id !== 2 ? (
                    <ProfileMale className="h-4/5 w-4/5 text-primary/80" />
                  ) : (
                    <ProfileFemale className="h-4/5 w-4/5 text-primary/80" />
                  )}
                </div>

                {/* Gender Indicator Badge */}
                <div
                  className={cn(
                    "absolute bottom-1 right-1 flex h-8 w-8 items-center",
                    "justify-center rounded-full border border-white/20",
                    "bg-white/80 shadow-lg backdrop-blur-md transition-transform",
                    "duration-500 group-hover/avatar:translate-x-1",
                    "group-hover/avatar:translate-y-1 dark:bg-black/40",
                  )}
                >
                  <div
                    className={`h-3.5 w-3.5 rounded-full shadow-sm ${genderColors[student?.gender?.id] || "bg-gray-400"}`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <h3
                  className={cn(
                    "line-clamp-1 text-xl font-bold tracking-tight",
                    "text-foreground transition-colors group-hover:text-primary",
                  )}
                >
                  {student.firstName} {student.lastName} {student.suffixName}
                </h3>
                <p className="text-[11px] font-bold uppercase tracking-widest text-primary/60">
                  {student.studentNumber}
                </p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="border-glass-border/30 grid grid-cols-1 gap-3 border-t pt-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                  Email Address
                </span>
                <span className="truncate text-sm font-medium text-foreground/80">
                  {student.email}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                    Course
                  </span>
                  <span className="text-sm font-semibold text-primary/80">
                    {student.course.code}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
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
                className={cn(
                  "group/btn inline-flex w-full items-center justify-center",
                  "gap-2 rounded-xl border border-primary/20 bg-primary/10 py-3",
                  "text-xs font-bold uppercase tracking-wider text-primary",
                  "transition-all duration-300 hover:bg-primary hover:text-white",
                  "active:scale-[0.97]",
                )}
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
