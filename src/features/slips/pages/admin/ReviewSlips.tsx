import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Archive, Calendar } from "lucide-react";
import {
  useGetAllSlips,
  useGetSlipStats,
  useGetSlipStatuses,
  useUpdateSlipStatus,
} from "../../hooks";
import type { Slip, SlipStats, SlipStatus } from "../../types/slip";
import { SlipViewModal, SlipsList } from "../../components";
import { toast } from "@/components/ui/use-toast";
import { STATUS_COLORS } from "@/config/constants";
import {
  getDateRange,
  getFilterLabel,
  type TimeFilter,
} from "../../utils/dateFilters";
import { useGetUrgentSlips } from "../../hooks/useGetUrgentSlips";

export default function ReviewSlips() {
  const navigate = useNavigate();

  // State
  const [selectedSlip, setSelectedSlip] = useState<Slip | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("today");
  const { data: slipStats } = useGetSlipStats({
    params: {
      startDate: getDateRange(timeFilter).startDate,
      endDate: getDateRange(timeFilter).endDate,
    },
  });
  const statsWithAll = useMemo(() => {
    const allCount =
      slipStats?.reduce(
        (sum: number, stat: SlipStats) => sum + (stat.count || 0),
        0,
      ) || 0;
    return [
      { id: "all", name: "All Status", colorKey: "stale", count: allCount },
      ...(slipStats || []),
    ];
  }, [slipStats]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(searchTerm, 500);

  // Get date range based on selected time filter
  const dateRange = useMemo(() => {
    return getDateRange(timeFilter);
  }, [timeFilter]);

  // Fetch data with pagination and filters
  const { data, isLoading, refetch } = useGetUrgentSlips({
    page: currentPage,
    search: debouncedSearch,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const { data: slipStatuses = [] } = useGetSlipStatuses();
  const { mutate: updateSlipStatus, isPending: isUpdating } =
    useUpdateSlipStatus();

  // Extract slips and total pages from response
  const slips = data?.slips || [];
  const totalPages = data?.totalPages || 1;

  // Get status statistics from current page
  const statusStats = useMemo(() => {
    const stats = new Map<string, number>();
    slips.forEach((slip: Slip) => {
      const key = slip.status?.id?.toString() || "unknown";
      stats.set(key, (stats.get(key) || 0) + 1);
    });
    return stats;
  }, [slips]);

  // Handle actions
  const handleViewSlip = (slip: Slip) => {
    setSelectedSlip(slip);
    setIsModalOpen(true);
  };

  const handleApprove = (id: number) => {
    updateSlipStatus(
      { id, status: "Approved" },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Excuse slip approved",
          });
          refetch();
          setIsModalOpen(false);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description:
              error instanceof Error ? error.message : "Failed to approve slip",
            variant: "destructive",
          });
        },
      },
    );
  };

  const handleReject = (id: number, reason: string) => {
    updateSlipStatus(
      { id, status: "Rejected", adminNotes: reason },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Excuse slip rejected",
          });
          refetch();
          setIsModalOpen(false);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description:
              error instanceof Error ? error.message : "Failed to reject slip",
            variant: "destructive",
          });
        },
      },
    );
  };

  const handleForRevision = (id: number, reason: string) => {
    updateSlipStatus(
      { id, status: "For Revision", adminNotes: reason },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Slip sent for revision",
          });
          refetch();
          setIsModalOpen(false);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description:
              error instanceof Error
                ? error.message
                : "Failed to send for revision",
            variant: "destructive",
          });
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-blue-500/10 border border-blue-300 rounded-lg p-4">
        <p className="text-sm text-blue-600 dark:text-blue-300">
          <strong>Note:</strong> Students request excuse slips in their portal.
          This page allows you to review, approve, reject, or request revisions
          for those slips.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate("/admin/slip-logs")}
          className="gap-2 border-border"
        >
          <Archive className="h-4 w-4" />
          View All Logs
        </Button>
        {/* Time Filter Buttons */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {(["today", "week", "month"] as TimeFilter[]).map((filter) => (
              <Button
                key={filter}
                variant={timeFilter === filter ? "default" : "outline"}
                onClick={() => {
                  setTimeFilter(filter);
                  setCurrentPage(1);
                }}
                className="transition-all border-border border hover:text-"
              >
                {getFilterLabel(filter)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Tracker Card */}
      <Card className="border-2 border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                Pending Approvals
              </h3>
              <Badge
                variant="secondary"
                className="bg-warning-background text-warning-foreground"
              >
                {getFilterLabel(timeFilter)}
              </Badge>
            </div>
            <p className="text-4xl font-bold text-foreground">
              {data?.total || 0}
            </p>
            <p className="text-xs text-muted-foreground">
              {data?.total === 1 ? "slip" : "slips"} awaiting review
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Slips List */}
      <SlipsList
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
        isAdmin={true}
        onApprove={handleApprove}
        onReject={handleReject}
        onForRevision={handleForRevision}
        isLoading={isUpdating}
      />
    </div>
  );
}
