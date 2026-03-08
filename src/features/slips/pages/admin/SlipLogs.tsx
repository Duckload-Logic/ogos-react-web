import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CircleChevronLeft } from "lucide-react";
import { useSlipLogs, useGetSlipStats } from "../../hooks";
import type { Slip, SlipStats } from "../../types/slip";
import { SlipViewModal, SlipsList } from "../../components";
import { STATUS_COLORS } from "@/config/constants";
import {
  getMonthsList,
  getYearsList,
  getMonthRange,
} from "../../utils/dateFilters";
import { DropdownField } from "@/components/form";

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

  // Handle year/month selection from DropdownField
  const handleYearChange = (yearId: number) => {
    const year = yearsList.find((y) => y.id === yearId);
    if (year) setSelectedYear(year);
  };

  const handleMonthChange = (monthId: number) => {
    const month = monthsList.find((m) => m.id === monthId);
    if (month) setSelectedMonth(month);
  };

  // State for other filters
  const [selectedSlip, setSelectedSlip] = useState<Slip | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const { data: slipStats = [] } = useGetSlipStats({
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
    setSelectedSlip(slip);
    setIsModalOpen(true);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col items-start justify-start gap-8">
          <Link
            className="flex gap-2 group items-center text-sm text-foreground/70 font-medium hover:text-primary transition-colors w-max"
            to="/admin/admission-slips"
          >
            <div className="flex items-center gap-2">
              <CircleChevronLeft
                size={20}
                className="transform group-hover:-translate-x-1 transition-transform duration-300"
              />
              <span className="text-sm font-medium">Back</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Filter by Date
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DropdownField
              label="Year"
              options={yearsList}
              value={selectedYear.id}
              onChange={handleYearChange}
            />
            <DropdownField
              label="Month"
              options={monthsList}
              value={selectedMonth.id}
              onChange={handleMonthChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Status Filter Cards */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">
          Filter by Status
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Status Cards */}
          {slipStatusesWithAll.map((status: SlipStats) => {
            const count = status.count || 0;
            return (
              <Card
                key={String(status.id)}
                className={`cursor-pointer transition-all ${
                  statusFilter === String(status.id)
                    ? `border-2 ${STATUS_COLORS[status.colorKey]}`
                    : ""
                }`}
                onClick={() => {
                  setStatusFilter(String(status.id));
                  setCurrentPage(1);
                }}
              >
                <CardContent className="pt-6">
                  <div className="text-right">
                    <Badge className="mb-2" variant="outline">
                      {status.name}
                    </Badge>
                    <p className="text-2xl font-bold text-foreground">
                      {count}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {count === 1 ? "slip" : "slips"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Slips List */}
      <SlipsList
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
      />

      {/* View Modal */}
      <SlipViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        slip={selectedSlip}
        isAdmin={false}
        onApprove={() => {}}
        onReject={() => {}}
        onForRevision={() => {}}
        isLoading={false}
      />
    </div>
  );
}
