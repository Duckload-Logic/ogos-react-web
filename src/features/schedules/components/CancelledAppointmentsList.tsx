/**
 * CancelledAppointmentsList Component
 * Displays paginated cancelled appointments in a muted style
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Appointment } from "@/features/appointments";
import { formatDate, formatTime } from "@/features/schedules/utils/formatters";

export interface CancelledAppointmentsListProps {
  appointments: Appointment[];
  itemsPerPage?: number;
}

export function CancelledAppointmentsList({
  appointments,
  itemsPerPage = 2,
}: CancelledAppointmentsListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const cancelledAppointments = appointments.filter(
    (appt) => ['Cancelled', 'Rejected'].includes(appt.status),
  );

  if (cancelledAppointments.length === 0) {
    return null;
  }

  const totalPages = Math.ceil(cancelledAppointments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = cancelledAppointments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

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


  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-600 mb-6 flex items-center gap-2">
        <Calendar className="w-6 h-6" />
        Cancelled/Rejected Appointments
      </h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentAppointments.map((appointment) => (
            <Card key={appointment.id} className="border-0 shadow-sm opacity-75">
              <CardHeader className="bg-red-50 border-b pb-3">
                <CardTitle className="text-lg text-gray-600 line-through">
                  {appointment.concernCategory}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Date</p>
                    <p className="text-base text-gray-600 line-through">
                      {formatDate(appointment.scheduledDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Time</p>
                    <p className="text-base text-gray-600 line-through">
                      {formatTime(appointment.scheduledTime)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-red-600 font-semibold">Cancelled</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="hidden sm:block text-sm text-gray-600">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastItem, cancelledAppointments.length)}
              </span>{" "}
              of <span className="font-medium">{cancelledAppointments.length}</span> appointments
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
      </div>
    </section>
  );
}
