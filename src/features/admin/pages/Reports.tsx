import Layout from "@/components/Layout";
import { useState } from "react";
import { Download, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface Report {
  id: string;
  title: string;
  course: string;
  description: string;
  date: string;
  type: "student" | "appointment" | "excuse" | "audit";
}

export default function Reports() {
  const [reports] = useState<Report[]>([
    {
      id: "001",
      title: "Student Enrollment Report",
      course: "All Courses",
      description: "Complete list of enrolled students by course",
      date: "2025-01-15",
      type: "student",
    },
    {
      id: "002",
      title: "Appointment Statistics",
      course: "N/A",
      description: "Monthly appointment data and trends",
      date: "2025-01-15",
      type: "appointment",
    },
    {
      id: "003",
      title: "Excuse Slip Summary",
      course: "All Courses",
      description: "Approved and rejected excuse slips",
      date: "2025-01-15",
      type: "excuse",
    },
    {
      id: "004",
      title: "System Audit Trail",
      course: "N/A",
      description: "User activities and system changes",
      date: "2025-01-15",
      type: "audit",
    },
  ]);

  const [filterType, setFilterType] = useState("all");

  const filteredReports =
    filterType === "all"
      ? reports
      : reports.filter((r) => r.type === filterType);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "student":
        return "bg-blue-100 text-blue-800";
      case "appointment":
        return "bg-green-100 text-green-800";
      case "excuse":
        return "bg-yellow-100 text-yellow-800";
      case "audit":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Layout title="Reports">
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-card rounded-lg shadow border border-border p-6">
          <h3 className="font-semibold text-card-foreground mb-4">
            Filter by Type:
          </h3>
          <div className="flex flex-wrap gap-3">
            {["all", "student", "appointment", "excuse", "audit"].map(
              (type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterType === type
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-card rounded-lg shadow border border-border p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-card-foreground">
                    {report.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {report.description}
                  </p>
                </div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-4 ${getTypeColor(report.type)}`}
                >
                  {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                </span>
              </div>

              <div className="space-y-2 mb-6">
                <p className="text-sm">
                  <span className="font-medium text-card-foreground">Course:</span>{" "}
                  <span className="text-muted-foreground">{report.course}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-card-foreground">
                    Generated:
                  </span>{" "}
                  <span className="text-muted-foreground">
                    {formatDate(report.date)}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
                  <Eye size={18} />
                  View Report
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                  <Download size={18} />
                  Export PDF
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="bg-card rounded-lg shadow border border-border p-12 text-center">
            <p className="text-muted-foreground">No reports found.</p>
          </div>
        )}

        {/* Generate New Report */}
        <div className="bg-card rounded-lg shadow border border-border p-6">
          <h2 className="text-xl font-bold text-card-foreground mb-4">
            Generate New Report
          </h2>
          <ReportForm onGenerate={(type) => alert(`Generating ${type} report`)} />
        </div>
      </div>
    </Layout>
  );
}

function ReportForm({ onGenerate }: { onGenerate: (type: string) => void }) {
  const schema = z.object({
    reportType: z
      .enum(["Student Enrollment", "Appointment Statistics", "Excuse Slip Summary", "System Audit Trail"])
      .describe("Report Type is required"),
    dateRange: z.string().min(1, "Date range is required"),
  });

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormValues) => {
    onGenerate(values.reportType);
    form.reset();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">Report Type *</label>
          <select {...form.register("reportType")} className="bg-input w-full px-4 py-2 border border-border rounded-lg">
            <option value="">Select Report Type</option>
            <option>Student Enrollment</option>
            <option>Appointment Statistics</option>
            <option>Excuse Slip Summary</option>
            <option>System Audit Trail</option>
          </select>
          {form.formState.errors.reportType && (
            <p className="text-sm text-destructive">{String(form.formState.errors.reportType.message)}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">Date Range</label>
          <select {...form.register("dateRange")} className="bg-input w-full px-4 py-2 border border-border rounded-lg">
            <option value="This Month">This Month</option>
            <option value="Last Month">Last Month</option>
            <option value="Last 3 Months">Last 3 Months</option>
            <option value="Custom Range">Custom Range</option>
          </select>
          {form.formState.errors.dateRange && (
            <p className="text-sm text-destructive">{String(form.formState.errors.dateRange.message)}</p>
          )}
        </div>
      </div>
      <button type="submit" className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">Generate Report</button>
    </form>
  );
}


