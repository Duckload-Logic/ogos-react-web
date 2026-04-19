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
import {
  ChartContainer,
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

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
      <div className="rounded-lg border border-border bg-card p-6 shadow">
        <h2 className="mb-2 text-2xl font-bold text-card-foreground">
          Religion Distribution
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Students with recorded religion:{" "}
          {students.filter((s) => s.religion).length}
        </p>

        {validData ? (
          <>
            {/* Bar Chart */}
            <ChartContainer
              config={chartConfig}
              className="mb-6 h-80"
            >
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
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--color-count))"
                />
              </BarChart>
            </ChartContainer>

            {/* Stats List */}
            <div className="space-y-2">
              {religionData.slice(0, 10).map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-lg bg-muted p-3"
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
          <div className="py-8 text-center text-muted-foreground">
            No religion data available
          </div>
        )}
      </div>
    </div>
  );
}
