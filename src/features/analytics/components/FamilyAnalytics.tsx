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

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

interface StudentAnalytics {
  family?: {
    fatherEducation?: string;
    motherEducation?: string;
    parentalStatusID?: number;
    parentMaritalStatus?: string;
    relatedPersons?: Array<{
      ordinality?: number;
    }>;
  };
  [key: string]: any;
}

export default function FamilyAnalytics({
  students,
}: {
  students: StudentAnalytics[];
}) {
  // Father's Education
  const fatherEducationData = useMemo(() => {
    const eduMap: Record<string, number> = {};

    students.forEach((s) => {
      if (s.family?.fatherEducation) {
        eduMap[s.family.fatherEducation] =
          (eduMap[s.family.fatherEducation] || 0) + 1;
      }
    });

    return Object.entries(eduMap)
      .map(([education, count]) => ({
        name: education || "Not Specified",
        value: count,
      }))
      .sort((a, b) => b.value - a.value);
  }, [students]);

  // Mother's Education
  const motherEducationData = useMemo(() => {
    const eduMap: Record<string, number> = {};

    students.forEach((s) => {
      if (s.family?.motherEducation) {
        eduMap[s.family.motherEducation] =
          (eduMap[s.family.motherEducation] || 0) + 1;
      }
    });

    return Object.entries(eduMap)
      .map(([education, count]) => ({
        name: education || "Not Specified",
        value: count,
      }))
      .sort((a, b) => b.value - a.value);
  }, [students]);

  // Parent's Marital Status
  const parentMaritalData = useMemo(() => {
    const statusMap: Record<string, number> = {};

    students.forEach((s) => {
      if (s.family?.parentMaritalStatus) {
        statusMap[s.family.parentMaritalStatus] =
          (statusMap[s.family.parentMaritalStatus] || 0) + 1;
      }
    });

    return Object.entries(statusMap)
      .map(([status, count]) => ({
        name: status || "Not Specified",
        value: count,
      }))
      .sort((a, b) => b.value - a.value);
  }, [students]);

  // Ordinal Position
  const ordinalPositionData = useMemo(() => {
    const positionMap: Record<string, number> = {
      "1st": 0,
      "2nd": 0,
      "3rd": 0,
      "4th": 0,
      "5th+": 0,
    };

    students.forEach((s) => {
      if (s.family?.relatedPersons && Array.isArray(s.family.relatedPersons)) {
        // Try to determine ordinal position from siblings
        const siblingCount = s.family.relatedPersons.length;
        if (siblingCount <= 1) positionMap["1st"]++;
        else if (siblingCount === 2) positionMap["2nd"]++;
        else if (siblingCount === 3) positionMap["3rd"]++;
        else if (siblingCount === 4) positionMap["4th"]++;
        else positionMap["5th+"]++;
      }
    });

    return Object.entries(positionMap)
      .map(([position, count]) => ({
        position,
        count,
      }))
      .filter((item) => item.count > 0);
  }, [students]);

  const chartConfig: ChartConfig = {
    value: {
      label: "Count",
      color: "#3b82f6",
    },
    count: {
      label: "Count",
      color: "#8b5cf6",
    },
  };

  return (
    <div className="space-y-6">
      {/* Father's Education */}
      <div className="bg-card rounded-lg shadow border border-border p-6">
        <h2 className="text-2xl font-bold text-card-foreground mb-2">
          Father's Educational Attainment
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Students with recorded father's education:{" "}
          {students.filter((s) => s.family?.fatherEducation).length}
        </p>

        {fatherEducationData.length > 0 ? (
          <div className="space-y-2">
            {fatherEducationData.slice(0, 8).map((item, index) => (
              <div
                key={item.name}
                className="flex justify-between items-center p-3 bg-muted rounded-lg"
              >
                <span className="font-medium text-foreground">{item.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-blue-600">
                    {item.value}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {((item.value / students.length) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No father's education data available
          </div>
        )}
      </div>

      {/* Mother's Education */}
      <div className="bg-card rounded-lg shadow border border-border p-6">
        <h2 className="text-2xl font-bold text-card-foreground mb-2">
          Mother's Educational Attainment
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Students with recorded mother's education:{" "}
          {students.filter((s) => s.family?.motherEducation).length}
        </p>

        {motherEducationData.length > 0 ? (
          <div className="space-y-2">
            {motherEducationData.slice(0, 8).map((item, index) => (
              <div
                key={item.name}
                className="flex justify-between items-center p-3 bg-muted rounded-lg"
              >
                <span className="font-medium text-foreground">{item.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-purple-600">
                    {item.value}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {((item.value / students.length) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No mother's education data available
          </div>
        )}
      </div>

      {/* Parent's Marital Status */}
      <div className="bg-card rounded-lg shadow border border-border p-6">
        <h2 className="text-2xl font-bold text-card-foreground mb-2">
          Parent's Marital Status
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Students with recorded parent's marital status:{" "}
          {students.filter((s) => s.family?.parentMaritalStatus).length}
        </p>

        {parentMaritalData.length > 0 ? (
          <>
            {/* Pie Chart */}
            <div className="mb-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={parentMaritalData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {parentMaritalData.map((entry, index) => (
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
            <div className="space-y-2">
              {parentMaritalData.map((item, index) => (
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
            No parent's marital status data available
          </div>
        )}
      </div>

      {/* Ordinal Position in Family */}
      <div className="bg-card rounded-lg shadow border border-border p-6">
        <h2 className="text-2xl font-bold text-card-foreground mb-2">
          Ordinal Position in the Family
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Distribution of students by number of siblings
        </p>

        {ordinalPositionData.length > 0 ? (
          <>
            <ChartContainer config={chartConfig} className="h-80 mb-6">
              <BarChart data={ordinalPositionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="position" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                  }}
                />
                <Bar dataKey="count" fill="#ec4899" />
              </BarChart>
            </ChartContainer>

            <div className="space-y-2">
              {ordinalPositionData.map((item) => (
                <div
                  key={item.position}
                  className="flex justify-between items-center p-3 bg-muted rounded-lg"
                >
                  <span className="font-medium text-foreground">
                    {item.position} Child
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-pink-600">
                      {item.count}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {(
                        (item.count /
                          ordinalPositionData.reduce((a, b) => a + b.count, 0)) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No ordinal position data available
          </div>
        )}
      </div>
    </div>
  );
}
