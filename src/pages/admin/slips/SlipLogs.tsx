import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { useSlipLogs, useGetSlipStats } from "@/features/slips/hooks";
import type { Slip, SlipStats, SlipStatus } from "@/features/slips/types";
import { SlipList } from "@/features/slips/components";
import { STATUS_COLORS } from "@/config/constants";
import {
  getMonthsList,
  getYearsList,
  getMonthRange,
} from "@/features/slips/utils/dateFilters";
import { Dropdown } from "@/components/form";
import Layout from "@/components/layout/Layout";
import { usePageMetadata } from "@/context";

export default function SlipLogs() {
  const navigate = useNavigate();

  // Memoize year and month lists to keep them stable across renders
  const monthsList = useMemo(() => getMonthsList(), []);
  const yearsList = useMemo(() => getYearsList(), []);

  // State for Year/Month filtering
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState<{
    id: number;
    name: string;
  }>(() => {
    const found = yearsList.find(
      (y) => y.name === String(currentDate.getFullYear()),
    );
    return found || yearsList[0];
  });
  const [selectedMonth, setSelectedMonth] = useState<{
    id: number;
    name: string;
  }>(() => {
    const found = monthsList.find((m) => m.id === currentDate.getMonth() + 1);
    return found || monthsList[0];
  });

  // Handle year/month selection from Dropdown
  const handleYearChange = (yearId: number) => {
    const year = yearsList.find((y) => y.id === yearId);
    if (year) setSelectedYear(year);
  };

  const handleMonthChange = (monthId: number) => {
    const month = monthsList.find((m) => m.id === monthId);
    if (month) setSelectedMonth(month);
  };

  // State for other filters
  const [statusFilter, setStatusFilter] = useState<string>("0");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(searchTerm, 500);

  // Get date range from selected year/month
  const dateRange = useMemo(() => {
    const year = parseInt(selectedYear.name);
    const month = selectedMonth.id;
    return getMonthRange(year, month);
  }, [selectedYear, selectedMonth]);

  // Fetch logs with year/month and other filters
  const { data, isLoading } = useSlipLogs({
    page: currentPage,
    statusId: statusFilter !== "0" ? statusFilter : undefined,
    search: debouncedSearch,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const { data: slipStats = [], isLoading: isStatsLoading } = useGetSlipStats({
    params: {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    },
  });
  const slipStatusesWithAll = useMemo(() => {
    const totalCount = (slipStats ?? []).reduce(
      (sum: number, stat: any) => sum + (stat.count || 0),
      0,
    );

    return [
      {
        id: 0,
        name: "All Status",
        colorKey: "stale",
        count: totalCount,
      },
      ...slipStats,
    ];
  }, [slipStats]);

  // Extract slips and total pages from response
  const slips = data?.slips || [];
  const totalPages = data?.totalPages || 1;

  // Calculate total count for the selected month
  const totalCountForMonth = useMemo(() => {
    return data?.total || slips.length;
  }, [data, slips]);

  // Handle actions
  const handleViewSlip = (slip: Slip) => {
    navigate(`/admin/slips/${slip.id}`);
  };

  const isPageLoading = isLoading || isStatsLoading;

  usePageMetadata({
    title: "Admission Slip Logs",
    description:
      "Historical record of all processed admission slips with date and status filters",
    badgeText: "Audit Trail",
    badgeIcon: <Calendar className="h-4 w-4" />,
    isLoading: isPageLoading,
  });

  return (
    <>
      <div className="space-y-6">
        {/* Filters Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Filter by Date
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Dropdown
                label="Year"
                options={yearsList}
                value={selectedYear.id}
                onChange={handleYearChange}
              />
              <Dropdown
                label="Month"
                options={monthsList}
                value={selectedMonth.id}
                onChange={handleMonthChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Slips List */}

        <SlipList
          title="Submission Details"
          slips={slips}
          isLoading={isLoading}
          onViewClick={handleViewSlip}
          searchTerm={searchTerm}
          onSearchChange={(value: string) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalPages={totalPages}
          statuses={[]}
          // @ts-ignore
          selectedStatus={undefined}
          statusCounts={[]}
          onStatusChange={function (status: SlipStatus): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>
    </>
  );
}
