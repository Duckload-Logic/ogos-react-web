import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Pagination } from "@/components/shared";
import { STATUS_COLORS } from "@/config/constants";
import { Appointment, AppointmentStatus, StatusCount } from "../types";
import { CalendarX, Eye, Tag, User, CalendarDays, Clock } from "lucide-react";
import { useMemo } from "react";
import { SearchInput } from "@/components/form";
import { format12HourTime } from "../utils";
import { formatDate } from "@/features/schedules/utils/formatters";
import { Spinner } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Dropdown } from "@/components/form";

interface AppointmentListProps {
  title?: string;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  statuses: AppointmentStatus[];
  selectedStatus: AppointmentStatus;
  statusCounts: StatusCount[];
  onStatusChange: (status: AppointmentStatus) => void;
  appointments: Appointment[];
  isLoading?: boolean;
  onViewClick: (apt: Appointment) => void;
  currentPage: number;
  onPageChange: (p: number) => void;
  totalPages: number;
  className?: string;
}

export default function AppointmentList({
  title,
  searchTerm,
  onSearchChange,
  statuses,
  selectedStatus,
  statusCounts,
  onStatusChange,
  appointments,
  isLoading,
  onViewClick,
  currentPage,
  onPageChange,
  totalPages,
  className,
}: AppointmentListProps) {
  const statMap = useMemo(() => {
    const map: Record<number, StatusCount> = {};
    statusCounts.forEach((sc) => {
      map[sc.id] = sc;
    });
    return map;
  }, [statusCounts]);

  const dropdownOptions = useMemo(() => {
    return statuses.map(s => ({
      ...s,
      displayName: s.id === 0 ? "All Statuses" : `${s.name} (${statMap[s.id]?.count || 0})`
    }));
  }, [statuses, statMap]);

  return (
    <Card
      className={`border-glass-border bg-glass-bg/40 shadow-2xl backdrop-blur-2xl lg:col-span-3 flex flex-col overflow-hidden transition-all duration-500 hover:bg-glass-bg/50 ${className || ""}`}
    >
      <CardHeader className="border-b border-glass-border/30 px-8 py-7 space-y-6 bg-muted/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5 text-left">
            <h2 className="text-xl font-bold tracking-tight text-foreground/90">{title}</h2>
          </div>

          {!isLoading && appointments.length > 0 && (
            <div className="rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[10px] font-bold tracking-wide text-primary self-start shadow-sm">
              {appointments.length} Total Record{appointments.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full items-center">
          <SearchInput
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            placeholder="Search student identity..."
            className="w-full border-glass-border/40 focus:bg-glass-bg/60 rounded-2xl"
            hasHeader={false}
          />

          <div className="w-full sm:w-64">
            <Dropdown
              options={dropdownOptions}
              value={selectedStatus?.id}
              onChange={(val) => {
                const status = statuses.find(s => s.id === val);
                if (status) onStatusChange(status);
              }}
              labelKey="displayName"
              enabled={!isLoading}
              formStyle={false}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1">
        {isLoading ? (
          <div className="flex min-h-[350px] items-center justify-center px-6 text-center">
            <Spinner size="sm" message="Synchronizing sessions" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center space-y-6">
            <div className="p-6 bg-muted/20 rounded-full border border-glass-border/40 border-dashed animate-pulse">
              <CalendarX className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black tracking-tight text-foreground/80">
                Inbox Empty
              </h3>
              <p className="text-xs font-semibold text-muted-foreground tracking-wide opacity-70 leading-relaxed">
                No active records match the current telemetry filters.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto px-6 pb-6 pt-4">
              <table className="w-full text-sm border-separate border-spacing-y-3">
                <thead className="text-muted-foreground text-[10px] font-bold tracking-wide opacity-60">
                  <tr>
                    <th className="px-6 py-4 text-left">Student Name</th>
                    <th className="px-6 py-4 text-left">Session Time</th>
                    <th className="px-6 py-4 text-left">Category</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-right pr-10">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.map((apt) => (
                    <tr
                      key={apt.id}
                      className="group rounded-[20px] bg-glass-bg/20 backdrop-blur-sm border border-glass-border/20 shadow-sm transition-all duration-300 hover:bg-glass-bg/60 hover:shadow-xl hover:scale-[1.005] hover:border-primary/20"
                    >
                      <td className="px-6 py-6 text-foreground font-bold text-sm rounded-l-[20px] tracking-tight">
                        {apt.user?.firstName}{" "}
                        {apt.user?.middleName?.[0]
                          ? `${apt.user?.middleName?.[0]}. `
                          : ""}
                        {apt.user?.lastName}
                      </td>

                      <td className="px-6 py-6 text-foreground/80 font-bold whitespace-nowrap text-xs tracking-wide">
                        {format12HourTime(apt.timeSlot?.time || "")}
                      </td>

                      <td className="px-4 py-4 text-foreground">
                        <div className="flex items-center gap-2 border border-border rounded-full px-2.5 py-1 w-fit bg-muted/20">
                          <Tag className="w-3 h-3 text-muted-foreground" />
                          <span className="text-nowrap max-w-[140px]">
                            {apt.appointmentCategory?.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[apt.status?.colorKey || "info"]
                            }`}
                        >
                          {apt.status?.name}
                        </span>
                      </td>

                      <td className="px-4 py-4 rounded-r-xl">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewClick(apt)}
                          className="gap-1 rounded-full px-3"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="block md:hidden space-y-4 px-4 pb-6">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-6 space-y-4 bg-glass-bg/20 backdrop-blur-md rounded-3xl border border-glass-border/20 shadow-sm transition-all duration-300 active:scale-[0.98]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 text-foreground font-bold text-sm">
                      <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <span className="tracking-tight">
                        {apt.user?.firstName} {apt.user?.lastName}
                      </span>
                    </div>

                    <Badge
                      className={cn("px-3 py-1 text-[9px] font-bold tracking-wide rounded-full border shadow-sm", STATUS_COLORS[apt.status?.colorKey || "info"])}
                    >
                      {apt.status?.name}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-[10px] font-bold">
                    <div className="flex items-center gap-2 text-muted-foreground/80 bg-muted/20 px-3 py-2 rounded-xl border border-glass-border/10">
                      <CalendarDays className="w-3.5 h-3.5 text-primary/60" />
                      <span>{formatDate(apt.whenDate || "")}</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground/80 bg-muted/20 px-3 py-2 rounded-xl border border-glass-border/10">
                      <Clock className="w-3.5 h-3.5 text-primary/60" />
                      <span>{format12HourTime(apt.timeSlot?.time || "")}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-muted/20 px-4 py-3 rounded-2xl border border-glass-border/10">
                    <Tag className="w-4 h-4 text-primary/60" />
                    <span className="text-[10px] font-bold tracking-wide text-foreground/70">
                      {apt.appointmentCategory?.name}
                    </span>
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewClick(apt)}
                      className="w-full gap-2 rounded-2xl border-primary/20 bg-primary/5 text-primary font-bold tracking-wide text-[10px] h-11"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Access Interface
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </Card>
  );
}
