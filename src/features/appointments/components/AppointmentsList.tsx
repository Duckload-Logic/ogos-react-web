import { Button, Card, CardContent, CardHeader } from "@/components";
import Pagination from "@/components/Pagination";
import { STATUS_COLORS } from "@/config/constants";
import { Appointment, AppointmentStatus, StatusCount } from "../types";
import { CalendarX, Eye, Tag, User, CalendarDays, Clock } from "lucide-react";
import { useMemo } from "react";
import { SearchInput } from "@/components/form";
import { format12HourTime } from "../utils";

interface AppointmentsListProps {
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

export default function AppointmentsList({
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
}: AppointmentsListProps) {
  const statMap = useMemo(() => {
    const map: Record<number, StatusCount> = {};
    statusCounts.forEach((sc) => {
      map[sc.id] = sc;
    });
    return map;
  }, [statusCounts]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card
      className={`border border-border shadow-sm lg:col-span-3 flex flex-col justify-between transition-all duration-300 hover:shadow-md ${className || ""}`}
    >
      <CardHeader className="border-b border-border px-5 py-5 space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground">
              Review, filter, and manage appointment requests.
            </p>
          </div>

          {!isLoading && appointments.length > 0 && (
            <div className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
              {appointments.length} appointment
              {appointments.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 w-full">
          <SearchInput
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            placeholder="Search student name"
            className="w-full"
            hasHeader={false}
          />

          <div className="flex flex-wrap gap-2">
            {statuses?.map((filter) => (
              <button
                key={filter.id}
                onClick={() => onStatusChange(filter)}
                className={`px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-all duration-200 ${
                  selectedStatus?.id === filter.id
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background text-muted-foreground border-border hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                {filter.name}
                {statMap[filter.id] && (
                  <span
                    className={`ml-1 text-xs ${
                      selectedStatus?.id === filter.id
                        ? "text-primary-foreground/90"
                        : "text-muted-foreground"
                    }`}
                  >
                    ({statMap[filter.id].count})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Loading appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="p-4 bg-muted rounded-full mb-4">
              <CalendarX className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              No appointments found
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              Try adjusting your filters or check back later.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto px-2 pb-2">
              <table className="w-full text-sm border-separate border-spacing-y-2">
                <thead className="text-muted-foreground text-[11px] uppercase tracking-[0.12em]">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Student</th>
                    <th className="px-4 py-3 text-left font-medium">Time</th>
                    <th className="px-4 py-3 text-left font-medium">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">View</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.map((apt) => (
                    <tr
                      key={apt.id}
                      className="group rounded-xl bg-background shadow-sm ring-1 ring-border transition-all duration-200 hover:shadow-md hover:ring-primary/20"
                    >
                      <td className="px-4 py-4 text-foreground font-medium rounded-l-xl relative group-hover:text-primary">
                        <span className="absolute left-0 top-2 bottom-2 w-1 bg-primary opacity-0 group-hover:opacity-100 transition rounded-r" />
                        {apt.user?.firstName}{" "}
                        {apt.user?.middleName?.[0]
                          ? `${apt.user?.middleName?.[0]}. `
                          : ""}
                        {apt.user?.lastName}
                      </td>

                      <td className="px-4 py-4 text-foreground whitespace-nowrap">
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
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${
                            STATUS_COLORS[apt.status?.colorKey || "info"]
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
            <div className="block md:hidden divide-y divide-border">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 space-y-3 hover:bg-muted/50 transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {apt.user?.firstName} {apt.user?.lastName}
                      </span>
                    </div>

                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${
                        STATUS_COLORS[apt.status?.colorKey || "info"]
                      }`}
                    >
                      {apt.status?.name}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarDays className="w-4 h-4" />
                      <span>{formatDate(apt.whenDate || "")}</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{format12HourTime(apt.timeSlot?.time || "")}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm bg-muted px-2 py-1 rounded-md">
                      {apt.appointmentCategory?.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewClick(apt)}
                      className="gap-1 transition-all duration-200 hover:scale-105"
                    >
                      <Eye className="w-4 h-4" />
                      View
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