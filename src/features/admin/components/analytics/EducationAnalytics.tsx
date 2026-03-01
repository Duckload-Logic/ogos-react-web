import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";

interface StudentAnalytics {
  personalInfo?: {
    highSchoolGWA?: number;
  };
  education?: {
    schools?: Array<{
      levelOfEducation?: string;
      school?: string;
      location?: string;
      public?: boolean;
    }>;
  };
  [key: string]: any;
}

export default function EducationAnalytics({
  students,
}: {
  students: StudentAnalytics[];
}) {
  // Analyze HSGWA distribution
  const hsGwaData = useMemo(() => {
    const gwas = students
      .filter((s) => s.personalInfo?.highSchoolGWA)
      .map((s) => s.personalInfo!.highSchoolGWA!);

    if (gwas.length === 0) return { avg: 0, min: 0, max: 0, data: [] };

    const sorted = gwas.sort((a, b) => a - b);
    const avg = (gwas.reduce((a, b) => a + b, 0) / gwas.length).toFixed(2);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];

    // Create GWA ranges
    const ranges: Record<string, number> = {
      "85-87": 0,
      "88-89": 0,
      "90-92": 0,
      "93-95": 0,
      "96+": 0,
    };

    gwas.forEach((gwa) => {
      if (gwa < 88) ranges["85-87"]++;
      else if (gwa < 90) ranges["88-89"]++;
      else if (gwa < 93) ranges["90-92"]++;
      else if (gwa < 96) ranges["93-95"]++;
      else ranges["96+"]++;
    });

    const data = Object.entries(ranges).map(([range, count]) => ({
      range,
      count,
    }));

    return { avg, min, max, data };
  }, [students]);

  // Analyze education levels
  const educationLevelData = useMemo(() => {
    const levelMap: Record<string, number> = {
      "Elementary": 0,
      "Junior High": 0,
      "Senior High": 0,
    };

    students.forEach((s) => {
      if (s.education?.schools && Array.isArray(s.education.schools)) {
        s.education.schools.forEach((school: any) => {
          const level = school.levelOfEducation?.toLowerCase() || "";
          if (level.includes("element")) levelMap["Elementary"]++;
          else if (level.includes("junior")) levelMap["Junior High"]++;
          else if (level.includes("senior") || level.includes("senior high")) levelMap["Senior High"]++;
        });
      }
    });

    return Object.entries(levelMap)
      .map(([level, count]) => ({
        level,
        count,
      }))
      .filter((item) => item.count > 0);
  }, [students]);

  // Analyze school type (public vs private)
  const schoolTypeData = useMemo(() => {
    let publicCount = 0;
    let privateCount = 0;

    students.forEach((s) => {
      if (s.education?.schools && Array.isArray(s.education.schools)) {
        s.education.schools.forEach((school: any) => {
          if (school.public === true || school.public === "true") {
            publicCount++;
          } else if (school.public === false || school.public === "false") {
            privateCount++;
          }
        });
      }
    });

    return [
      { type: "Public School", count: publicCount },
      { type: "Private School", count: privateCount },
    ].filter((item) => item.count > 0);
  }, [students]);

  const chartConfigGwa: ChartConfig = {
    count: {
      label: "Number of Students",
      color: "#f59e0b",
    },
  };

  const chartConfigLevel: ChartConfig = {
    count: {
      label: "Number of Schools",
      color: "#10b981",
    },
  };

  return (
    <div className="space-y-6">
      {/* HSGWA */}
      <div className="bg-card rounded-lg shadow border border-border p-6">
        <h2 className="text-2xl font-bold text-card-foreground mb-2">
          High School GWA (HSGWA) Distribution
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Students with recorded HSGWA: {students.filter((s) => s.personalInfo?.highSchoolGWA).length}
        </p>

        {hsGwaData.data.length > 0 ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">
                  Average GWA
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {hsGwaData.avg}
                </p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Lowest</p>
                <p className="text-2xl font-bold text-foreground">
                  {hsGwaData.min}
                </p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Highest</p>
                <p className="text-2xl font-bold text-foreground">
                  {hsGwaData.max}
                </p>
              </div>
            </div>

            {/* Bar Chart */}
            <ChartContainer config={chartConfigGwa} className="h-80">
              <BarChart data={hsGwaData.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
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
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No HSGWA data available
          </div>
        )}
      </div>

      {/* Education Levels */}
      <div className="bg-card rounded-lg shadow border border-border p-6">
        <h2 className="text-2xl font-bold text-card-foreground mb-2">
          Education Levels
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Distribution of schools by education level
        </p>

        {educationLevelData.length > 0 ? (
          <>
            <ChartContainer config={chartConfigLevel} className="h-80 mb-6">
              <BarChart data={educationLevelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="level" />
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

            <div className="space-y-2">
              {educationLevelData.map((item) => (
                <div
                  key={item.level}
                  className="flex justify-between items-center p-3 bg-muted rounded-lg"
                >
                  <span className="font-medium text-foreground">
                    {item.level}
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No education level data available
          </div>
        )}
      </div>

      {/* School Type (Public vs Private) */}
      <div className="bg-card rounded-lg shadow border border-border p-6">
        <h2 className="text-2xl font-bold text-card-foreground mb-2">
          Nature of Schooling
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Public vs. Private school enrollment
        </p>

        {schoolTypeData.length > 0 ? (
          <div className="space-y-3">
            {schoolTypeData.map((item) => (
              <div
                key={item.type}
                className="flex justify-between items-center p-4 bg-muted rounded-lg"
              >
                <span className="font-medium text-foreground">{item.type}</span>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold text-primary">
                    {item.count}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {(
                      (item.count /
                        schoolTypeData.reduce((a, b) => a + b.count, 0)) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No school type data available
          </div>
        )}
      </div>
    </div>
  );
}
