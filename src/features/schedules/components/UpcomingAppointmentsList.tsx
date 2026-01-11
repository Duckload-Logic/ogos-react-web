/**
 * UpcomingAppointmentsList Component
 * Displays a paginated list of upcoming appointments with status filtering or an empty state
 */

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  AppointmentCard,
} from "@/features/schedules/components/AppointmentCard";
import { Appointment, AppointmentStatus } from "@/features/appointments";

export interface UpcomingAppointmentsListProps {
  appointments: Appointment[];
  onDeleteClick: (apt: Appointment) => void;
  isDeleting: boolean;
  itemsPerPage?: number;  
}

type FilterStatus = AppointmentStatus | "All";

const STATUS_FILTERS: FilterStatus[] = ["All", "Pending", "Approved", "Rescheduled"];

export function UpcomingAppointmentsList({
  appointments,
  onDeleteClick,
  isDeleting,
  itemsPerPage = 2,
}: UpcomingAppointmentsListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("All");

  const upcomingAppointments = appointments
    .filter((appt) => !['Cancelled', 'Rejected'].includes(appt.status))
    .sort(
      (a, b) =>
        new Date(a.scheduledDate).getTime() -
        new Date(b.scheduledDate).getTime(),
    );

  // Apply status filter
  const filteredAppointments = statusFilter === "All"
    ? upcomingAppointments
    : upcomingAppointments.filter((apt) => apt.status === statusFilter);

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleStatusFilterChange = (status: FilterStatus) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Generate pagination numbers with ellipsis
  const getPaginationNumbers = () => {
    const pages: (number | string)[] = [];
    const windowSize = 3; // The number of visible page numbers in the middle/active area

    if (totalPages <= 4) {
      // Small enough to show all without ellipsis
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Dynamic Sliding Window Logic
      if (currentPage <= 2) {
        // Near the start: [1, 2, 3, ...]
        for (let i = 1; i <= windowSize; i++) {
          pages.push(i);
        }
        pages.push("...");
        // Optionally add the last page here if you want it visible
        // pages.push(totalPages); 
      } else if (currentPage >= totalPages - 1) {
        // Near the end: [..., total-2, total-1, total]
        pages.push("...");
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle: [..., current-1, current, current+1, ...]
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
      }
    }

    return pages;
  };

  if (upcomingAppointments.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-12 pb-12 text-center">
          <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">
            No upcoming appointments scheduled
          </p>
          <Link to="/student/schedule" className="mt-4 inline-block">
            <Button className="bg-primary hover:bg-primary-dark text-primary-foreground font-semibold">
              Schedule an Appointment
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Filter Bar */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => handleStatusFilterChange(status)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              statusFilter === status
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {status}
            {status !== "All" && (
              <span className="ml-2 text-xs">
                ({upcomingAppointments.filter((apt) => apt.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Appointments Grid */}
      {filteredAppointments.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-8 pb-8 text-center">
            <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">
              No appointments with status "{statusFilter}"
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onDelete={onDeleteClick}
                isDeleting={isDeleting}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t gap-4">
              <div className="hidden sm:block text-sm text-gray-600">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredAppointments.length)}
                </span>{" "}
                of <span className="font-medium">{filteredAppointments.length}</span> appointments
              </div>

              <div className="flex gap-2 flex-wrap justify-center sm:justify-end flex-1 sm:flex-none">  
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}      
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {getPaginationNumbers().map((page, index) => (
                    page === "..." ? (
                      <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-500">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page as number)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          currentPage === page
                            ? "bg-primary text-primary-foreground"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
