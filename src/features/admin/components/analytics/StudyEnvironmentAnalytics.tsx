import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import { CheckCircle2, XCircle } from "lucide-react";

interface StudentAnalytics {
  studyEnvironment?: {
    quietPlaceToStudy?: boolean;
  };
  health?: {
    quietPlaceToStudy?: boolean;
  };
  interests?: {
    quietPlaceToStudy?: boolean;
  };
  [key: string]: any;
}

export default function StudyEnvironmentAnalytics({
  students,
}: {
  students: StudentAnalytics[];
}) {
  // Check for quiet place to study
  const studyEnvironmentData = useMemo(() => {
    let hasQuietPlace = 0;
    let noQuietPlace = 0;
    let unspecified = 0;

    students.forEach((s) => {
      const hasQuiet =
        s.studyEnvironment?.quietPlaceToStudy ||
        s.health?.quietPlaceToStudy ||
        s.interests?.quietPlaceToStudy;

      if (hasQuiet === true) {
        hasQuietPlace++;
      } else if (hasQuiet === false) {
        noQuietPlace++;
      } else {
        unspecified++;
      }
    });

    return [
      { name: "Yes, has quiet place", value: hasQuietPlace, color: "#10b981" },
      {
        name: "No quiet place",
        value: noQuietPlace,
        color: "#ef4444",
      },
      {
        name: "Not specified",
        value: unspecified,
        color: "#9ca3af",
      },
    ].filter((item) => item.value > 0);
  }, [students]);

  const chartConfig: ChartConfig = {
    value: {
      label: "Number of Students",
      color: "#10b981",
    },
  };

  const totalWithData = studyEnvironmentData.reduce((a, b) => a + b.value, 0);
  const percentageWithQuiePlace =
    totalWithData > 0
      ? (
          (studyEnvironmentData.find((d) => d.name === "Yes, has quiet place")
            ?.value || 0) / totalWithData
        ) * 100
      : 0;

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg shadow border border-border p-6">
        <h2 className="text-2xl font-bold text-card-foreground mb-2">
          Study Environment
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Do you have a quiet place to study?
        </p>

        {studyEnvironmentData.length > 0 ? (
          <>
            {/* Key Metric */}
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Students with adequate study environment
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {percentageWithQuiePlace.toFixed(1)}%
                  </p>
                </div>
                <CheckCircle2
                  size={48}
                  className="text-green-600 opacity-20"
                />
              </div>
            </div>

            {/* Pie Chart */}
            <div className="mb-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={studyEnvironmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {studyEnvironmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={18} className="text-green-600" />
                  <span className="text-sm text-muted-foreground">Yes</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {
                    studyEnvironmentData.find(
                      (d) => d.name === "Yes, has quiet place",
                    )?.value
                  }
                </p>
              </div>

              <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle size={18} className="text-red-600" />
                  <span className="text-sm text-muted-foreground">No</span>
                </div>
                <p className="text-2xl font-bold text-red-600">
                  {
                    studyEnvironmentData.find((d) => d.name === "No quiet place")
                      ?.value
                  }
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-muted-foreground mb-2">
                  Not Specified
                </p>
                <p className="text-2xl font-bold text-gray-600">
                  {
                    studyEnvironmentData.find(
                      (d) => d.name === "Not specified",
                    )?.value || 0
                  }
                </p>
              </div>
            </div>

            {/* Detailed List */}
            <div className="border-t border-border mt-6 pt-6">
              <h3 className="font-semibold text-card-foreground mb-4">
                Breakdown
              </h3>
              <div className="space-y-3">
                {studyEnvironmentData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium text-foreground">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-xl font-bold" style={{ color: item.color }}>
                        {item.value}
                      </span>
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {totalWithData > 0
                          ? ((item.value / totalWithData) * 100).toFixed(1)
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div className="border-t border-border mt-6 pt-6 bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <p className="text-sm text-foreground">
                <span className="font-semibold">Insight:</span> Out of{" "}
                <span className="font-bold">{totalWithData}</span> students with
                recorded study environment data,{" "}
                <span className="font-bold text-green-600">
                  {percentageWithQuiePlace.toFixed(1)}%
                </span>{" "}
                have a quiet place to study. This is important for academic
                performance and student well-being.
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No study environment data available
          </div>
        )}
      </div>
    </div>
  );
}
