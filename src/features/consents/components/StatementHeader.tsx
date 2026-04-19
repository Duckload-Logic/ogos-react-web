import { format12HourTime } from "@/features/appointments/utils";
import { formatDate } from "@/features/schedules/utils/formatters";
import { cn } from "@/lib/utils";

interface StatementHeaderProps {
  lastUpdatedDate: string; // ISO date string
  lastUpdatedTime: string; // 12-hour time string
}

export function StatementHeader({
  lastUpdatedDate,
  lastUpdatedTime,
}: StatementHeaderProps) {
  return (
    <>
      {/* Decorative bar */}
      <div
        className={cn(
          "animate-in fade-in slide-in-from-left mb-6 h-2 w-24",
          "rounded-full bg-gradient-to-r from-primary to-primary/50",
        )}
      />

      {/* Last updated badge */}
      <div
        className={cn(
          "animate-in fade-in slide-in-from-bottom mb-8 flex",
          "items-center gap-2 duration-500",
        )}
      >
        <span
          className={cn(
            "inline-flex items-center rounded-full px-3 py-1 text-xs",
            "font-medium text-muted-foreground",
          )}
        >
          Last update on: {formatDate(lastUpdatedDate)} at{" "}
          {format12HourTime(lastUpdatedTime)}
        </span>
      </div>
    </>
  );
}
