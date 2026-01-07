import Layout from "../components/Layout";
import { useState } from "react";
import { Download, CheckCircle, Clock, X } from "lucide-react";

interface ExcuseSlip {
  id: string;
  studentName: string;
  date: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
}

export default function ReviewExcuses() {
  const [excuses, setExcuses] = useState<ExcuseSlip[]>([
    {
      id: "001",
      studentName: "Juan Dela Cruz",
      date: "2025-01-10",
      reason: "Medical appointment",
      status: "pending",
      submittedDate: "2025-01-11",
    },
    {
      id: "002",
      studentName: "Maria Santos",
      date: "2025-01-09",
      reason: "Family emergency",
      status: "approved",
      submittedDate: "2025-01-10",
    },
    {
      id: "003",
      studentName: "Carlos Reyes",
      date: "2025-01-08",
      reason: "Doctor appointment",
      status: "approved",
      submittedDate: "2025-01-09",
    },
    {
      id: "004",
      studentName: "Angela Dela Cruz",
      date: "2025-01-07",
      reason: "Car trouble",
      status: "rejected",
      submittedDate: "2025-01-08",
    },
  ]);

  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const updateExcuseStatus = (id: string, status: string) => {
    setExcuses(
      excuses.map((exc) =>
        exc.id === id ? { ...exc, status: status as any } : exc,
      ),
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock size={16} />;
      case "approved":
        return <CheckCircle size={16} />;
      case "rejected":
        return <X size={16} />;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredExcuses = excuses.filter((exc) => {
    const statusMatch = statusFilter === "all" || exc.status === statusFilter;

    let dateMatch = true;
    if (startDate || endDate) {
      const excDate = new Date(exc.date).getTime();
      const start = startDate ? new Date(startDate).getTime() : 0;
      const end = endDate ? new Date(endDate).getTime() + 86400000 : Infinity;
      dateMatch = excDate >= start && excDate <= end;
    }

    return statusMatch && dateMatch;
  });

  return (
    <Layout title="Review Excuses Slip">
      <div className="space-y-6">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> Students submit excuse slips through the
            student portal. This page is for reviewing and managing submitted
            slips only.
          </p>
        </div>

        {/* Quick Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow border border-gray-200">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">To Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Review Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-foreground">
              Submitted Excuse Slips
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="px-6 py-4 text-left font-semibold">
                    Student Name
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Absence Date
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">Reason</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredExcuses.map((exc, idx) => (
                  <tr
                    key={exc.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-foreground">
                      {exc.studentName}
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      {formatDate(exc.date)}
                    </td>
                    <td className="px-6 py-4 text-foreground text-sm">
                      {exc.reason}
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(exc.status)}`}
                      >
                        {getStatusIcon(exc.status)}
                        {exc.status.charAt(0).toUpperCase() +
                          exc.status.slice(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button className="flex items-center gap-1 px-3 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors text-sm font-medium">
                          <Download size={16} />
                          View PDF
                        </button>
                        {exc.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                updateExcuseStatus(exc.id, "approved")
                              }
                              className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm font-medium"
                            >
                              <CheckCircle size={16} />
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                updateExcuseStatus(exc.id, "rejected")
                              }
                              className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium"
                            >
                              <X size={16} />
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredExcuses.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">No excuse slips found.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}


