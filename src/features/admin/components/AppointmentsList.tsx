import { Appointment } from "@/features/appointments/services";
import { formatDate } from "@/features/schedules/utils/formatters";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface AppointmentsListProps {
  title?: string;
  appointments: Appointment[];
  students: any[];
  status?: string;
  selectedDate?: Date;
  className?: string;
  excludeStatus?: string[];
  actions?: { color: string; purpose: string; label: React.ReactNode; onClick: (appointment: Appointment) => void }[];
  isLoading?: boolean;
}

export const AppointmentsList = ({ title, appointments, students, status, selectedDate, className, excludeStatus, actions, isLoading }: AppointmentsListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; 

  const filteredAppointments = appointments.filter((apt) => {
    const isViewingApproved = status === 'Approved';
    const approvedGroup = ['Approved', 'Rescheduled'];

    if (isViewingApproved) {
        if (!approvedGroup.includes(apt.status)) return false;
    } else {
        if (apt.status !== status) return false;
    }

    // 3. Check Date Match
    if (!selectedDate) return true;

    // We use toDateString to avoid timezone/time-of-day mismatches
    const aptDate = new Date(apt.scheduledDate).toDateString();
    const selDate = new Date(selectedDate).toDateString();

    return aptDate === selDate;
});

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow border border-gray-200 overflow-hidden ${className}`}>
      <div className="p-5 border-b border-gray-200">
        <h2 className="text-lg font-bold text-foreground">
          {title}
        </h2>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Loading appointments...</p>
          </div>
        ) : (
        <table className="w-full">
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="px-4 py-3 text-left font-semibold text-xs text-center">
                Student
              </th>
              <th className="px-4 py-3 text-left font-semibold text-xs text-center">
                Date
              </th>
              <th className="px-4 py-3 text-left font-semibold text-xs text-center">
                Time
              </th>
              <th className="px-4 py-3 text-left font-semibold text-xs text-center">
                Reason
              </th>
              <th className="px-4 py-3 text-left font-semibold text-xs text-center">
                Status
              </th>
              <th className="px-4 py-3 text-left font-semibold text-xs text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentItems.map((apt, idx) => (
               (
                <tr
                  key={apt.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-foreground text-xs text-center">
                    {students.find((s) => s.id === apt.userId)?.lastName || "Unknown"}, {students.find((s) => s.id === apt.userId)?.firstName || '-'}
                  </td>
                  <td className="px-4 py-3 text-foreground text-xs text-center">
                    {formatDate(apt.scheduledDate)}
                  </td>
                  <td className="px-4 py-3 text-foreground text-xs text-center">
                    {apt.scheduledTime}
                  </td>
                  <td className="px-4 py-3 text-foreground text-xs text-center">
                    {apt.reason}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)} text-center`}
                    >
                      {apt.status.charAt(0).toUpperCase() +
                        apt.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 items-center justify-center">
                      {actions && actions.map((action, actionIdx) => (
                        <div key={actionIdx} className="relative group w-24"> {/* Anchor point */}
                          <button 
                            className={
                              `w-full max-w-[90px] ${action.color} 
                              text-white rounded items-center 
                              justify-center flex hover:opacity-90 
                              transition-colors font-medium`}
                            onClick={() => action.onClick(apt)}
                          >
                            {action.label}
                          </button>

                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                                          hidden group-hover:block z-50 w-max max-w-[160px] 
                                          bg-gray-800 text-white text-md p-2 rounded shadow-xl 
                                          text-center leading-tight">
                            {action.purpose}
                            
                            <div className="absolute top-full left-1/2 -translate-x-1/2 
                                            border-4 border-transparent border-t-gray-800" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
        )}
      </div>

      {filteredAppointments.length < 1 && (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-500">No appointments scheduled.</p>
        </div>
      )}
      
        { totalPages > 1 && (
          <div className="px-5 py-4 border-t border-gray-200 flex items-center justify-between bg-white">
            <div className="flex-1 flex justify-between sm:hidden">
              {/* Mobile Buttons */}
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredAppointments.length)}
                </span>{" "}
                of <span className="font-medium">{filteredAppointments.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>
                
                {/* Page Numbers */}
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === i + 1
                        ? "z-10 bg-primary border-primary text-white"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
              </nav>
            </div>
          </div>
        </div>
        )}
    </div>
  );
}