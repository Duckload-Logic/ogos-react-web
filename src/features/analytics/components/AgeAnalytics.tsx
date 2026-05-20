import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ChartContainer,
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

interface StudentAnalytics {
  dateOfBirth?: string;
  firstName?: string;
  lastName?: string;
  [key: string]: any;
}

export default function AgeAnalytics({
  students,
}: {
  students: StudentAnalytics[];
}) {
  const ageData = useMemo(() => {
    const ages = students
      .filter((s) => s.dateOfBirth)
      .map((s) => {
        const dob = new Date(s.dateOfBirth!);
        const age = new Date().getFullYear() - dob.getFullYear();
        return Math.max(0, age);
      });

    // Create age ranges
    const ranges: Record<string, number> = {
      "16-18": 0,
      "19-21": 0,
      "22-24": 0,
      "25-27": 0,
      "28+": 0,
    };

    ages.forEach((age) => {
      if (age <= 18) ranges["16-18"]++;
      else if (age <= 21) ranges["19-21"]++;
      else if (age <= 24) ranges["22-24"]++;
      else if (age <= 27) ranges["25-27"]++;
      else ranges["28+"]++;
    });

    return Object.entries(ranges).map(([range, count]) => ({
      range,
      count,
    }));
  }, [students]);

  const ageStats = useMemo(() => {
    const ages = students
      .filter((s) => s.dateOfBirth)
      .map((s) => {
        const dob = new Date(s.dateOfBirth!);
        return new Date().getFullYear() - dob.getFullYear();
      });

    if (ages.length === 0) return { avg: 0, min: 0, max: 0 };

    const sorted = ages.sort((a, b) => a - b);
    const avg = Math.round(ages.reduce((a, b) => a + b, 0) / ages.length);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];

    return { avg, min, max };
  }, [students]);

  const chartConfig: ChartConfig = {
    count: {
      label: "Number of Students",
      color: "#3b82f6",
    },
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-6 shadow">
        <h2 className="mb-2 text-2xl font-bold text-card-foreground">
          Age Distribution
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Students with recorded birth dates:{" "}
          {students.filter((s) => s.dateOfBirth).length}
        </p>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="mb-1 text-xs text-muted-foreground">Average Age</p>
            <p className="text-2xl font-bold text-foreground">{ageStats.avg}</p>
          </div>
          <div className="rounded-lg bg-muted p-4">
            <p className="mb-1 text-xs text-muted-foreground">Youngest</p>
            <p className="text-2xl font-bold text-foreground">{ageStats.min}</p>
          </div>
          <div className="rounded-lg bg-muted p-4">
            <p className="mb-1 text-xs text-muted-foreground">Oldest</p>
            <p className="text-2xl font-bold text-foreground">{ageStats.max}</p>
          </div>
        </div>

        {/* Bar Chart */}
        <ChartContainer
          config={chartConfig}
          className="h-80"
        >
          <BarChart data={ageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="count"
              fill="hsl(var(--color-count))"
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
