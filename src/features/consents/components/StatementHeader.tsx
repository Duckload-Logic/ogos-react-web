import { format12HourTime } from "@/features/appointments/utils";
import { formatDate } from "@/features/schedules/utils/formatters";

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
      <div className="h-2 w-24 bg-gradient-to-r from-primary to-primary/50 rounded-full mb-6 animate-in fade-in slide-in-from-left" />

      {/* Last updated badge */}
      <div className="flex items-center gap-2 mb-8 animate-in fade-in slide-in-from-bottom duration-500">
        <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-muted-foreground">
          Last update on: {formatDate(lastUpdatedDate)} at{" "}
          {format12HourTime(lastUpdatedTime)}
        </span>
      </div>
    </>
  );
}
