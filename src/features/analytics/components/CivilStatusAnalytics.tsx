import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"];

interface StudentAnalytics {
  civilStatus?: string;
  [key: string]: any;
}

export default function CivilStatusAnalytics({
  students,
}: {
  students: StudentAnalytics[];
}) {
  const civilStatusData = useMemo(() => {
    const statusMap: Record<string, number> = {};

    students.forEach((s) => {
      if (s.civilStatus) {
        statusMap[s.civilStatus] = (statusMap[s.civilStatus] || 0) + 1;
      }
    });

    return Object.entries(statusMap)
      .map(([status, count]) => ({
        name: status || "Not Specified",
        value: count,
      }))
      .sort((a, b) => b.value - a.value);
  }, [students]);

  const chartConfig: ChartConfig = {
    value: {
      label: "Count",
      color: "#3b82f6",
    },
  };

  const validData = civilStatusData.length > 0;

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg shadow border border-border p-6">
        <h2 className="text-2xl font-bold text-card-foreground mb-2">
          Civil Status Distribution
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Students with recorded civil status: {students.filter((s) => s.civilStatus).length}
        </p>

        {validData ? (
          <>
            {/* Pie Chart */}
            <div className="mb-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={civilStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {civilStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
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

            {/* Stats Table */}
            <div className="space-y-2">
              {civilStatusData.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium text-foreground">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-primary">
                      {item.value}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {((item.value / students.length) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No civil status data available
          </div>
        )}
      </div>
    </div>
  );
}
