import Layout from "@/components/Layout";
import { useState } from "react";
import { Clock } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  description: string;
  ipAddress: string;
  status: "success" | "failed";
}

export default function Logs() {
  const [logs] = useState<LogEntry[]>([
    {
      id: "001",
      timestamp: "2025-01-15T14:23:00",
      user: "admin@pup.edu.ph",
      action: "LOGIN",
      description: "User logged in successfully",
      ipAddress: "192.168.1.100",
      status: "success",
    },
    {
      id: "002",
      timestamp: "2025-01-15T14:30:15",
      user: "admin@pup.edu.ph",
      action: "CREATE",
      description: "Created new student record for Juan Dela Cruz",
      ipAddress: "192.168.1.100",
      status: "success",
    },
    {
      id: "003",
      timestamp: "2025-01-15T14:35:42",
      user: "counselor@pup.edu.ph",
      action: "UPDATE",
      description: "Updated student record for Maria Santos",
      ipAddress: "192.168.1.101",
      status: "success",
    },
    {
      id: "004",
      timestamp: "2025-01-15T14:40:00",
      user: "admin@pup.edu.ph",
      action: "DELETE",
      description: "Deleted appointment record",
      ipAddress: "192.168.1.100",
      status: "failed",
    },
    {
      id: "005",
      timestamp: "2025-01-15T15:00:30",
      user: "counselor@pup.edu.ph",
      action: "VIEW",
      description: "Viewed student health records",
      ipAddress: "192.168.1.101",
      status: "success",
    },
    {
      id: "006",
      timestamp: "2025-01-15T15:15:45",
      user: "admin@pup.edu.ph",
      action: "APPROVE",
      description: "Approved excuse slip for Carlos Reyes",
      ipAddress: "192.168.1.100",
      status: "success",
    },
  ]);

  const [selectedAction, setSelectedAction] = useState("All Actions");
  const actions = [
    "All Actions",
    "LOGIN",
    "CREATE",
    "UPDATE",
    "DELETE",
    "VIEW",
    "APPROVE",
  ];

  const filteredLogs =
    selectedAction === "All Actions"
      ? logs
      : logs.filter((log) => log.action === selectedAction);

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "bg-green-100 text-green-800";
      case "UPDATE":
        return "bg-blue-100 text-blue-800";
      case "DELETE":
        return "bg-red-100 text-red-800";
      case "LOGIN":
        return "bg-purple-100 text-purple-800";
      case "VIEW":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVE":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "success"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <Layout title="System Audit Trail">
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <label className="text-sm font-medium text-foreground">
              Filter by Actions:
            </label>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {actions.map((action) => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-600 ml-auto">
              Showing {filteredLogs.length} records
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="px-6 py-4 text-left font-semibold">
                    Timestamp
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">User</th>
                  <th className="px-6 py-4 text-left font-semibold">Action</th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    IP Address
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredLogs.map((log, idx) => (
                  <tr
                    key={log.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 text-sm text-foreground">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-500" />
                        {formatDateTime(log.timestamp)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground font-medium">
                      {log.user}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getActionColor(log.action)}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {log.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground font-mono">
                      {log.ipAddress}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(log.status)}`}
                      >
                        {log.status.charAt(0).toUpperCase() +
                          log.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">No logs found.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing 1 - {filteredLogs.length} of {filteredLogs.length} results
          </p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-foreground hover:bg-gray-50 transition-colors font-medium">
              Previous
            </button>
            <span className="px-4 py-2 text-foreground font-medium">1</span>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-foreground hover:bg-gray-50 transition-colors font-medium">
              Next
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
