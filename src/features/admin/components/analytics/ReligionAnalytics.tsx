import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";

interface StudentAnalytics {
  religion?: string;
  [key: string]: any;
}

export default function ReligionAnalytics({
  students,
}: {
  students: StudentAnalytics[];
}) {
  const religionData = useMemo(() => {
    const religionMap: Record<string, number> = {};

    students.forEach((s) => {
      if (s.religion) {
        religionMap[s.religion] = (religionMap[s.religion] || 0) + 1;
      }
    });

    return Object.entries(religionMap)
      .map(([religion, count]) => ({
        name: religion || "Not Specified",
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [students]);

  const chartConfig: ChartConfig = {
    count: {
      label: "Number of Students",
      color: "#8b5cf6",
    },
  };

  const validData = religionData.length > 0;

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg shadow border border-border p-6">
        <h2 className="text-2xl font-bold text-card-foreground mb-2">
          Religion Distribution
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Students with recorded religion: {students.filter((s) => s.religion).length}
        </p>

        {validData ? (
          <>
            {/* Bar Chart */}
            <ChartContainer config={chartConfig} className="h-80 mb-6">
              <BarChart data={religionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--color-count))" />
              </BarChart>
            </ChartContainer>

            {/* Stats List */}
            <div className="space-y-2">
              {religionData.slice(0, 10).map((item) => (
                <div
                  key={item.name}
                  className="flex justify-between items-center p-3 bg-muted rounded-lg"
                >
                  <span className="font-medium text-foreground">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-purple-600">
                      {item.count}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {((item.count / students.length) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No religion data available
          </div>
        )}
      </div>
    </div>
  );
}
