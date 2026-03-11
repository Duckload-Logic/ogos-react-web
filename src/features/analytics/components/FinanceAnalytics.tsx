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

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

interface StudentAnalytics {
  family?: {
    finance?: {
      monthlyFamilyIncome?: string;
    };
    monthlyFamilyIncome?: string;
  };
  [key: string]: any;
}

export default function FinanceAnalytics({
  students,
}: {
  students: StudentAnalytics[];
}) {
  // Income distribution
  const incomeData = useMemo(() => {
    const incomeMap: Record<string, number> = {};

    students.forEach((s) => {
      const income =
        s.family?.finance?.monthlyFamilyIncome ||
        s.family?.monthlyFamilyIncome ||
        "Not Specified";

      incomeMap[income] = (incomeMap[income] || 0) + 1;
    });

    // Common income brackets 
    const brackets: Record<string, number> = {
      "Below 10,000": 0,
      "10,000 - 25,000": 0,
      "25,000 - 50,000": 0,
      "50,000 - 100,000": 0,
      "100,000+": 0,
      "Not Specified": 0,
    };

    Object.entries(incomeMap).forEach(([income, count]) => {
      const normalized = income.toLowerCase().trim();

      if (normalized.includes("not") || !income) {
        brackets["Not Specified"] += count;
      } else if (
        normalized.includes("below") ||
        normalized.includes("less") ||
        normalized.includes("10")
      ) {
        brackets["Below 10,000"] += count;
      } else if (normalized.includes("25")) {
        brackets["10,000 - 25,000"] += count;
      } else if (normalized.includes("50")) {
        brackets["25,000 - 50,000"] += count;
      } else if (normalized.includes("100")) {
        brackets["50,000 - 100,000"] += count;
      } else if (
        normalized.includes("above") ||
        normalized.includes("more") ||
        normalized.includes("exceeds")
      ) {
        brackets["100,000+"] += count;
      } else {
        brackets["Not Specified"] += count;
      }
    });

    return Object.entries(brackets)
      .map(([bracket, count]) => ({
        name: bracket,
        value: count,
      }))
      .filter((item) => item.value > 0);
  }, [students]);

  // Detailed income categories
  const detailedIncomeData = useMemo(() => {
    const incomeMap: Record<string, number> = {};

    students.forEach((s) => {
      const income =
        s.family?.finance?.monthlyFamilyIncome ||
        s.family?.monthlyFamilyIncome ||
        "Not Specified";

      incomeMap[income] = (incomeMap[income] || 0) + 1;
    });

    return Object.entries(incomeMap)
      .map(([income, count]) => ({
        income: income || "Not Specified",
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [students]);

  const chartConfig: ChartConfig = {
    value: {
      label: "Number of Students",
      color: "#10b981",
    },
    count: {
      label: "Number of Students",
      color: "#3b82f6",
    },
  };

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg shadow border border-border p-6">
        <h2 className="text-2xl font-bold text-card-foreground mb-2">
          Total Monthly Family Income
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Students with recorded family income:{" "}
          {students.filter(
            (s) =>
              s.family?.finance?.monthlyFamilyIncome ||
              s.family?.monthlyFamilyIncome,
          ).length}
        </p>

        {incomeData.length > 0 ? (
          <>
            {/* Pie Chart */}
            <div className="mb-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={incomeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {incomeData.map((entry, index) => (
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

            {/* Stats */}
            <div className="space-y-2 mb-6">
              {incomeData.map((item, index) => (
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

            {/* Detailed Categories */}
            <div className="border-t border-border pt-4">
              <h3 className="font-semibold text-card-foreground mb-3">
                Income Categories (Detailed)
              </h3>
              <div className="space-y-2">
                {detailedIncomeData.slice(0, 10).map((item) => (
                  <div
                    key={item.income}
                    className="flex justify-between items-center p-3 bg-muted rounded-lg text-sm"
                  >
                    <span className="text-foreground">{item.income}</span>
                    <span className="font-bold text-green-600">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No income data available
          </div>
        )}
      </div>
    </div>
  );
}
