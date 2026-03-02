import { useState, useEffect } from "react";
import { LoadingSpinner } from "@/components/shared";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, TrendingUp, Users, Percent } from "lucide-react";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface StudentAnalytics {
  id?: number;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  civilStatus?: string;
  religion?: string;
  studentNumber?: string;
  addresses?: any[];
  personalInfo?: {
    highSchoolGWA?: number;
  };
  education?: {
    schools?: any[];
  };
  family?: {
    fatherEducation?: string;
    motherEducation?: string;
    parentMaritalStatus?: string;
    monthlyFamilyIncome?: string;
    relatedPersons?: any[];
  };
}

export default function Analytics() {
  const [students, setStudents] = useState<StudentAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [religionPage, setReligionPage] = useState(0);
  const [cityPage, setCityPage] = useState(0);
  const [educationPage, setEducationPage] = useState(0);
  const [statusPage, setStatusPage] = useState(0);



  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const allStudents: StudentAnalytics[] = [];

        // Fetch first few pages
        for (let page = 1; page <= 3; page++) {
          try {
            const response = await apiClient.get(
              "/students/inventory/records",
              {
                params: {
                  page,
                  page_size: 100,
                },
              }
            );

            if (response.data?.students && Array.isArray(response.data.students)) {
              allStudents.push(...response.data.students);

              // Stop if we got fewer than requested
              if (response.data.students.length < 100) {
                break;
              }
            }
          } catch (pageError) {
            console.warn(`Error fetching page ${page}:`, pageError);
            if (page === 1) throw pageError; // Fail on first page
            break; // Stop trying additional pages
          }
        }

        setStudents(allStudents);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error occurred";
        console.error("Error loading analytics:", error);
        setErrorMsg(message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStudents();
  }, []);

  if (errorMsg) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading analytics: {errorMsg}
          </AlertDescription>
        </Alert>
        <div className="text-sm text-muted-foreground p-4 bg-muted rounded-lg">
          <p className="mb-3">Troubleshooting steps:</p>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li>Check that the backend API is running</li>
            <li>
              Open browser console (F12) for detailed error information
            </li>
            <li>Verify you are logged in as an admin</li>
            <li>Try refreshing the page</li>
          </ul>

        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  // color palette using CSS variables
  const STATUS_COLOR_MAP = {
    info: { bg: "bg-info-background", text: "text-info-foreground" },
    success: { bg: "bg-success-background", text: "text-success-foreground" },
    warning: { bg: "bg-warning-background", text: "text-warning-foreground" },
    danger: { bg: "bg-danger-background", text: "text-danger-foreground" },
    notice: { bg: "bg-notice-background", text: "text-notice-foreground" },
    stale: { bg: "bg-stale-background", text: "text-stale-foreground" },
  };

  // color palette for charts 
  const SOFT_COLORS = [
    "#93c5fd", // Blue (info) - soft blue
    "#bbf7d0", // Green (success) - soft green
    "#fef08a", // Yellow (warning) - soft yellow
    "#fca5a5", // Red (danger) - soft red
    "#d8b4fe", // Purple (notice) - soft purple
    "#d1d5db", // Gray (stale) - soft gray
  ];

  // Color palette for KPI cards
  const KPI_COLORS = [
    STATUS_COLOR_MAP.info,
    STATUS_COLOR_MAP.success,
    STATUS_COLOR_MAP.warning,
    STATUS_COLOR_MAP.notice,
  ];

  // Calculate age statistics
  const getAgeStats = () => {
    const ages = students
      .filter((s) => s.dateOfBirth)
      .map((s) => {
        const dob = new Date(s.dateOfBirth!);
        return new Date().getFullYear() - dob.getFullYear();
      });

    if (ages.length === 0) return { avg: 0, min: 0, max: 0, count: 0 };

    const sorted = ages.sort((a, b) => a - b);
    return {
      avg: Math.round(ages.reduce((a, b) => a + b, 0) / ages.length),
      min: sorted[0],
      max: sorted[sorted.length - 1],
      count: ages.length,
    };
  };

  // Prepare age distribution chart data
  const getAgeDistributionData = () => {
    const ageRanges: Record<string, number> = {
      "15-17": 0,
      "18-20": 0,
      "21-25": 0,
      "26-30": 0,
      "31+": 0,
    };

    students.forEach((s) => {
      if (s.dateOfBirth) {
        const dob = new Date(s.dateOfBirth);
        const age = new Date().getFullYear() - dob.getFullYear();
        if (age <= 17) ageRanges["15-17"]++;
        else if (age <= 20) ageRanges["18-20"]++;
        else if (age <= 25) ageRanges["21-25"]++;
        else if (age <= 30) ageRanges["26-30"]++;
        else ageRanges["31+"]++;
      }
    });

    return Object.entries(ageRanges).map(([range, count]) => ({
      name: range,
      value: count,
    }));
  };

  // Prepare civil status data
  const getCivilStatusData = () => {
    const statusMap: Record<string, number> = {};
    students.forEach((s) => {
      if (s.civilStatus) {
        statusMap[s.civilStatus] = (statusMap[s.civilStatus] || 0) + 1;
      }
    });

    return Object.entries(statusMap)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));
  };

  // Prepare religion data
  const getReligionData = () => {
    const religionMap: Record<string, number> = {};
    students.forEach((s) => {
      if (s.religion) {
        religionMap[s.religion] = (religionMap[s.religion] || 0) + 1;
      }
    });

    return Object.entries(religionMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));
  };

  // Prepare city/municipality data
  const getCityData = () => {
    const cityMap: Record<string, number> = {};
    students.forEach((student) => {
      if (student.addresses && Array.isArray(student.addresses)) {
        student.addresses.forEach((addr: any) => {
          const city = addr.municipality || addr.city || "Unknown";
          cityMap[city] = (cityMap[city] || 0) + 1;
        });
      }
    });

    return Object.entries(cityMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));
  };

  // Prepare father's education data
  const getFatherEducationData = () => {
    const eduMap: Record<string, number> = {};
    students.forEach((s) => {
      if (s.family?.fatherEducation) {
        eduMap[s.family.fatherEducation] =
          (eduMap[s.family.fatherEducation] || 0) + 1;
      }
    });

    return Object.entries(eduMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name: name.substring(0, 15), value }));
  };

  // Prepare mother's education data
  const getMotherEducationData = () => {
    const eduMap: Record<string, number> = {};
    students.forEach((s) => {
      if (s.family?.motherEducation) {
        eduMap[s.family.motherEducation] =
          (eduMap[s.family.motherEducation] || 0) + 1;
      }
    });

    return Object.entries(eduMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name: name.substring(0, 15), value }));
  };

  // Prepare income data
  const getIncomeData = () => {
    const incomeMap: Record<string, number> = {};
    students.forEach((s) => {
      const income = s.family?.monthlyFamilyIncome || "Not Specified";
      incomeMap[income] = (incomeMap[income] || 0) + 1;
    });

    return Object.entries(incomeMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([name, value]) => ({
        name: name.length > 20 ? name.substring(0, 17) + "..." : name,
        value,
      }));
  };

  const ageStats = getAgeStats();

  // Get all available years from student data
  const getAvailableYears = () => {
    const years = new Set<number>();
    students.forEach((s) => {
      if (s.dateOfBirth) {
        const year = new Date(s.dateOfBirth).getFullYear();
        years.add(year);
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  };

  // Filter students by selected year (year of enrollment/birth)
  const getStudentsByYear = () => {
    if (selectedYear === new Date().getFullYear() || students.length === 0) {
      return students;
    }
    // Filter students by birth year
    return students.filter((s) => {
      if (!s.dateOfBirth) return false;
      return new Date(s.dateOfBirth).getFullYear() === selectedYear;
    });
  };

  const filteredStudents = getStudentsByYear();

  // Get breakdown stats with pagination support
  const getReligionBreakdown = () => {
    const religionMap: Record<string, number> = {};
    filteredStudents.forEach((s) => {
      if (s.religion) {
        religionMap[s.religion] = (religionMap[s.religion] || 0) + 1;
      }
    });
    const entries = Object.entries(religionMap).sort((a, b) => b[1] - a[1]);
    const itemsPerPage = 5;
    const start = religionPage * itemsPerPage;
    return {
      data: entries.slice(start, start + itemsPerPage),
      total: entries.length,
      page: religionPage,
      pages: Math.ceil(entries.length / itemsPerPage),
    };
  };

  const getCityBreakdown = () => {
    const cityMap: Record<string, number> = {};
    filteredStudents.forEach((s) => {
      if (s.addresses && Array.isArray(s.addresses)) {
        s.addresses.forEach((addr: any) => {
          const city = addr.municipality || addr.city || "Unknown";
          cityMap[city] = (cityMap[city] || 0) + 1;
        });
      }
    });
    const entries = Object.entries(cityMap).sort((a, b) => b[1] - a[1]);
    const itemsPerPage = 5;
    const start = cityPage * itemsPerPage;
    return {
      data: entries.slice(start, start + itemsPerPage),
      total: entries.length,
      page: cityPage,
      pages: Math.ceil(entries.length / itemsPerPage),
    };
  };

  const getCivilStatusBreakdown = () => {
    const statusMap: Record<string, number> = {};
    filteredStudents.forEach((s) => {
      if (s.civilStatus) {
        statusMap[s.civilStatus] = (statusMap[s.civilStatus] || 0) + 1;
      }
    });
    const entries = Object.entries(statusMap).sort((a, b) => b[1] - a[1]);
    const itemsPerPage = 5;
    const start = statusPage * itemsPerPage;
    return {
      data: entries.slice(start, start + itemsPerPage),
      total: entries.length,
      page: statusPage,
      pages: Math.ceil(entries.length / itemsPerPage),
    };
  };

  const getEducationBreakdown = () => {
    const eduMap: Record<string, number> = {};
    filteredStudents.forEach((s) => {
      if (s.family?.fatherEducation) {
        const edu = s.family.fatherEducation.substring(0, 20);
        eduMap[edu] = (eduMap[edu] || 0) + 1;
      }
    });
    const entries = Object.entries(eduMap).sort((a, b) => b[1] - a[1]);
    const itemsPerPage = 5;
    const start = educationPage * itemsPerPage;
    return {
      data: entries.slice(start, start + itemsPerPage),
      total: entries.length,
      page: educationPage,
      pages: Math.ceil(entries.length / itemsPerPage),
    };
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-foreground">Student Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Comprehensive overview of student demographics and educational data
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
          {/* Year Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Filter by Year</label>
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(parseInt(e.target.value));
                setReligionPage(0);
                setCityPage(0);
                setEducationPage(0);
                setStatusPage(0);
              }}
              className="px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm"
            >
              <option value={new Date().getFullYear()}>All Years</option>
              {getAvailableYears().map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className={`${KPI_COLORS[0].bg} rounded-md shadow border border-transparent p-6 hover:shadow-lg transition-shadow`}>
          <p className={`text-xs font-semibold ${KPI_COLORS[0].text} uppercase tracking-wide mb-3 opacity-80`}>
            Total Students
          </p>
          <p className={`text-5xl font-bold ${KPI_COLORS[0].text} mb-2`}>
            {filteredStudents.length.toLocaleString()}
          </p>
          <p className={`text-xs ${KPI_COLORS[0].text} opacity-70`}>
            For selected year
          </p>
        </div>

        {/* Average Age */}
        <div className={`${KPI_COLORS[1].bg} rounded-md shadow border border-transparent p-6 hover:shadow-lg transition-shadow`}>
          <p className={`text-xs font-semibold ${KPI_COLORS[1].text} uppercase tracking-wide mb-3 opacity-80`}>
            Average Age
          </p>
          <p className={`text-5xl font-bold ${KPI_COLORS[1].text} mb-2`}>
            {getAgeStats().avg}
          </p>
          <p className={`text-xs ${KPI_COLORS[1].text} opacity-70`}>
            Range: {getAgeStats().min}-{getAgeStats().max} years
          </p>
        </div>

        {/* Completion Rate */}
        <div className={`${KPI_COLORS[2].bg} rounded-md shadow border border-transparent p-6 hover:shadow-lg transition-shadow`}>
          <p className={`text-xs font-semibold ${KPI_COLORS[2].text} uppercase tracking-wide mb-3 opacity-80`}>
            Data Completeness
          </p>
          <p className={`text-5xl font-bold ${KPI_COLORS[2].text} mb-2`}>
            {Math.round(
              ((filteredStudents.filter((s) => s.religion && s.addresses?.length).length /
                filteredStudents.length) *
                100) as any
            )}
            <span className="text-2xl">%</span>
          </p>
          <p className={`text-xs ${KPI_COLORS[2].text} opacity-70`}>
            Religion + Address data
          </p>
        </div>

        {/* With Addresses */}
        <div className={`${KPI_COLORS[3].bg} rounded-md shadow border border-transparent p-6 hover:shadow-lg transition-shadow`}>
          <p className={`text-xs font-semibold ${KPI_COLORS[3].text} uppercase tracking-wide mb-3 opacity-80`}>
            Locations Mapped
          </p>
          <p className={`text-5xl font-bold ${KPI_COLORS[3].text} mb-2`}>
            {filteredStudents.filter((s) => s.addresses?.length).length.toLocaleString()}
          </p>
          <p className="text-xs opacity-70">
            Students with addresses
          </p>
        </div>
      </div>

      {/* Overview Charts - 2x2 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Distribution Chart */}
        <div className="bg-card rounded-md shadow border border-border p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">
            Age Distribution
          </h2>
          {getAgeDistributionData().some((d) => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getAgeDistributionData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                  formatter={(value) => [value, "Students"]}
                />
                <Bar dataKey="value" fill={SOFT_COLORS[0]} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-12">
              No age data available
            </p>
          )}
        </div>

        {/* Civil Status Chart */}
        <div className="bg-card rounded-md shadow border border-border p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">
            Civil Status
          </h2>
          {getCivilStatusData().length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getCivilStatusData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getCivilStatusData().map((_, index) => (
                    <Cell key={`cell-${index}`} fill={SOFT_COLORS[index % SOFT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, "Count"]} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-12">
              No civil status data available
            </p>
          )}
        </div>
      </div>

      {/* Breakdown Cards - 2x2 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Religion Breakdown */}
        <div className={`${STATUS_COLOR_MAP.info.bg} rounded-md shadow border border-border p-6`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-semibold ${STATUS_COLOR_MAP.info.text}`}>
              Religion Distribution
            </h3>
            <span className="text-xs font-medium opacity-70">({getReligionBreakdown().total})</span>
          </div>
          <div className="space-y-2">
            {getReligionBreakdown().data.length > 0 ? (
              getReligionBreakdown().data.map(([religion, count]) => (
                <div key={religion} className="flex justify-between items-center">
                  <span className="text-sm">{religion}</span>
                  <span className={`text-sm font-semibold ${STATUS_COLOR_MAP.info.text}`}>
                    {count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm opacity-70">No data available</p>
            )}
          </div>
          {getReligionBreakdown().pages > 1 && (
            <div className="flex gap-1 mt-4 pt-4 border-t border-border/50">
              {Array.from({ length: getReligionBreakdown().pages }).map((_, page) => (
                <button
                  key={page}
                  onClick={() => setReligionPage(page)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    religionPage === page
                      ? `${STATUS_COLOR_MAP.info.bg} ${STATUS_COLOR_MAP.info.text}`
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {page + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Location Breakdown */}
        <div className={`${STATUS_COLOR_MAP.success.bg} rounded-md shadow border border-border p-6`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-semibold ${STATUS_COLOR_MAP.success.text}`}>
              Top Locations
            </h3>
            <span className="text-xs font-medium opacity-70">({getCityBreakdown().total})</span>
          </div>
          <div className="space-y-2">
            {getCityBreakdown().data.length > 0 ? (
              getCityBreakdown().data.map(([city, count]) => (
                <div key={city} className="flex justify-between items-center">
                  <span className="text-sm truncate">{city}</span>
                  <span className={`text-sm font-semibold ${STATUS_COLOR_MAP.success.text}`}>
                    {count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm opacity-70">No data available</p>
            )}
          </div>
          {getCityBreakdown().pages > 1 && (
            <div className="flex gap-1 mt-4 pt-4 border-t border-border/50">
              {Array.from({ length: getCityBreakdown().pages }).map((_, page) => (
                <button
                  key={page}
                  onClick={() => setCityPage(page)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    cityPage === page
                      ? `${STATUS_COLOR_MAP.success.bg} ${STATUS_COLOR_MAP.success.text}`
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {page + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Education & Income Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Father's Education */}
        <div className={`${STATUS_COLOR_MAP.warning.bg} rounded-md shadow border border-border p-6`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-semibold ${STATUS_COLOR_MAP.warning.text}`}>
              Father's Education
            </h3>
            <span className="text-xs font-medium opacity-70">({getEducationBreakdown().total})</span>
          </div>
          <div className="space-y-2">
            {getEducationBreakdown().data.length > 0 ? (
              getEducationBreakdown().data.map(([education, count]) => (
                <div key={education} className="flex justify-between items-center">
                  <span className="text-sm">{education}</span>
                  <span className={`text-sm font-semibold ${STATUS_COLOR_MAP.warning.text}`}>
                    {count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm opacity-70">No data available</p>
            )}
          </div>
          {getEducationBreakdown().pages > 1 && (
            <div className="flex gap-1 mt-4 pt-4 border-t border-border/50">
              {Array.from({ length: getEducationBreakdown().pages }).map((_, page) => (
                <button
                  key={page}
                  onClick={() => setEducationPage(page)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    educationPage === page
                      ? `${STATUS_COLOR_MAP.warning.bg} ${STATUS_COLOR_MAP.warning.text}`
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {page + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Civil Status Breakdown */}
        <div className={`${STATUS_COLOR_MAP.notice.bg} rounded-md shadow border border-border p-6`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-semibold ${STATUS_COLOR_MAP.notice.text}`}>
              Civil Status Breakdown
            </h3>
            <span className="text-xs font-medium opacity-70">({getCivilStatusBreakdown().total})</span>
          </div>
          <div className="space-y-2">
            {getCivilStatusBreakdown().data.length > 0 ? (
              getCivilStatusBreakdown().data.map(([status, count]) => (
                <div key={status} className="flex justify-between items-center">
                  <span className="text-sm">{status}</span>
                  <span className={`text-sm font-semibold ${STATUS_COLOR_MAP.notice.text}`}>
                    {count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm opacity-70">No data available</p>
            )}
          </div>
          {getCivilStatusBreakdown().pages > 1 && (
            <div className="flex gap-1 mt-4 pt-4 border-t border-border/50">
              {Array.from({ length: getCivilStatusBreakdown().pages }).map((_, page) => (
                <button
                  key={page}
                  onClick={() => setStatusPage(page)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    statusPage === page
                      ? `${STATUS_COLOR_MAP.notice.bg} ${STATUS_COLOR_MAP.notice.text}`
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {page + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Full Width Charts */}
      <div className="grid grid-cols-1 gap-6">
        {/* Religion Distribution Chart */}
        <div className="bg-card rounded-md shadow border border-border p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">
            Religion Distribution
          </h2>
          {getReligionData().length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={getReligionData()}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="name" type="category" width={150} stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                  formatter={(value) => [value, "Students"]}
                />
                <Bar dataKey="value" fill={SOFT_COLORS[1]} radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-12">
              No religion data available
            </p>
          )}
        </div>
      </div>

      {/* Location & Income Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Cities Chart */}
        <div className="bg-card rounded-md shadow border border-border p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">
            Top Student Locations
          </h2>
          {getCityData().length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getCityData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                  formatter={(value) => [value, "Students"]}
                />
                <Bar dataKey="value" fill={SOFT_COLORS[2]} radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-12">
              No location data available
            </p>
          )}
        </div>

        {/* Monthly Income Chart */}
        <div className="bg-card rounded-md shadow border border-border p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">
            Monthly Family Income Distribution
          </h2>
          {getIncomeData().length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getIncomeData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                  formatter={(value) => [value, "Students"]}
                />
                <Bar dataKey="value" fill={SOFT_COLORS[3]} radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-12">
              No income data available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
