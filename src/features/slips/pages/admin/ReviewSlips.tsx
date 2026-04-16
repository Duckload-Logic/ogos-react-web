import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Archive, CheckCircle2, Clock3, FileText, RotateCcw, XCircle } from "lucide-react";

import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useGetSlipStats, useGetSlipStatuses, useSlips } from "../../hooks";
import type { Slip, SlipStats, SlipStatus } from "../../types";
import { SlipList } from "../../components";
import {
  getDateRange,
  getFilterLabel,
  type TimeFilter,
} from "../../utils/dateFilters";
import Layout, { usePageMetadata } from "@/components/layout/Layout";

export default function ReviewSlips() {
  const navigate = useNavigate();

  const [timeFilter, setTimeFilter] = useState<TimeFilter>("today");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(searchTerm, 500);
  const dateRange = useMemo(() => getDateRange(timeFilter), [timeFilter]);

  const { data: slipStats, isLoading: isStatsLoading } = useGetSlipStats({
    params: {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    },
  });

  const { data: slipStatuses, isLoading: isStatusesLoading } = useGetSlipStatuses();

  const statusWithAll = useMemo(() => {
    if (!slipStatuses) return [];
    return [{ id: "0", name: "All Statuses", colorKey: "stale" }, ...slipStatuses];
  }, [slipStatuses]);

  const [selectedStatus, setSelectedStatus] = useState<SlipStatus>({
    id: "0",
    name: "All Statuses",
    colorKey: "stale",
  } as any);


  const { data, isLoading } = useSlips({
    isAdmin: true,
    params: {
      page: currentPage,
      search: debouncedSearch,
      statusId: String(selectedStatus?.id) === "0" ? undefined : selectedStatus?.id,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    },
  });

  const slips = data?.slips || [];
  const totalPages = data?.totalPages || 1;

  const handleViewSlip = (slip: Slip) => {
    navigate(`/admin/slips/${slip.id}`);
  };


  const isPageLoading = isStatusesLoading;

  const headerActions = useMemo(
    () => (
      <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
        {(["today", "week", "month"] as TimeFilter[]).map((filter) => (
          <Button
            key={filter}
            variant={timeFilter === filter ? "default" : "outline"}
            onClick={() => {
              setTimeFilter(filter);
              setCurrentPage(1);
            }}
            className="h-10 min-w-[100px] rounded-xl px-4 shadow-sm"
          >
            {getFilterLabel(filter)}
          </Button>
        ))}

        <Button
          variant="outline"
          onClick={() => navigate("/admin/slips/logs")}
          className="h-10 rounded-xl px-4 shadow-sm gap-2"
        >
          <Archive className="h-4 w-4" />
          View All Logs
        </Button>
      </div>
    ),
    [timeFilter, navigate]
  );

  usePageMetadata({
    title: "Review Excuse Slips",
    description: "Review submissions, filter the queue, and process student requests.",
    badgeText: "Slip Management",
    badgeIcon: <FileText className="h-4 w-4" />,
    isLoading: isPageLoading,
    headerActions,
  });

  return (
    <>
      <div className="py-2 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">

        <SlipList
          slips={slips}
          isLoading={isLoading}
          onViewClick={handleViewSlip}
          searchTerm={searchTerm}
          onSearchChange={(value: string) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
          statuses={statusWithAll as any}
          selectedStatus={selectedStatus as any}
          statusCounts={slipStats || []}
          onStatusChange={setSelectedStatus as any}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalPages={totalPages}
        />
      </div>
    </>
  );
}
