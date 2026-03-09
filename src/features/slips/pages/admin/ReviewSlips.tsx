import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Archive, CheckCircle2, Clock3, RotateCcw, XCircle } from "lucide-react";

import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useGetSlipStats, useUpdateSlipStatus } from "../../hooks";
import type { Slip, SlipStats } from "../../types/slip";
import { SlipViewModal, SlipsList } from "../../components";
import {
  getDateRange,
  getFilterLabel,
  type TimeFilter,
} from "../../utils/dateFilters";
import { useGetUrgentSlips } from "../../hooks/useGetUrgentSlips";

export default function ReviewSlips() {
  const navigate = useNavigate();

  const [selectedSlip, setSelectedSlip] = useState<Slip | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("today");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(searchTerm, 500);

  const dateRange = useMemo(() => getDateRange(timeFilter), [timeFilter]);

  const { data: slipStats } = useGetSlipStats({
    params: {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    },
  });

  const statLookup = useMemo(() => {
    const map = new Map<string, number>();
    (slipStats || []).forEach((stat: SlipStats) => {
      map.set(stat.name.toLowerCase(), stat.count || 0);
    });
    return map;
  }, [slipStats]);

  const summaryCards = useMemo(
    () => [
      {
        key: "pending",
        label: "Pending",
        value: statLookup.get("pending") ?? 0,
        icon: Clock3,
        tone: {
          wrapper:
            "ring-amber-200/80 bg-gradient-to-br from-amber-50/90 via-background to-background dark:from-amber-950/20 dark:to-background",
          strip: "bg-amber-400",
          icon: "text-amber-600 dark:text-amber-300",
          label: "text-amber-700 dark:text-amber-300",
          value: "text-amber-950 dark:text-amber-100",
        },
      },
      {
        key: "approved",
        label: "Approved",
        value: statLookup.get("approved") ?? 0,
        icon: CheckCircle2,
        tone: {
          wrapper:
            "ring-emerald-200/80 bg-gradient-to-br from-emerald-50/90 via-background to-background dark:from-emerald-950/20 dark:to-background",
          strip: "bg-emerald-400",
          icon: "text-emerald-600 dark:text-emerald-300",
          label: "text-emerald-700 dark:text-emerald-300",
          value: "text-emerald-950 dark:text-emerald-100",
        },
      },
      {
        key: "rejected",
        label: "Rejected",
        value: statLookup.get("rejected") ?? 0,
        icon: XCircle,
        tone: {
          wrapper:
            "ring-rose-200/80 bg-gradient-to-br from-rose-50/90 via-background to-background dark:from-rose-950/20 dark:to-background",
          strip: "bg-rose-400",
          icon: "text-rose-600 dark:text-rose-300",
          label: "text-rose-700 dark:text-rose-300",
          value: "text-rose-950 dark:text-rose-100",
        },
      },
      {
        key: "for-revision",
        label: "For Revision",
        value: statLookup.get("for revision") ?? 0,
        icon: RotateCcw,
        tone: {
          wrapper:
            "ring-blue-200/80 bg-gradient-to-br from-blue-50/90 via-background to-background dark:from-blue-950/20 dark:to-background",
          strip: "bg-blue-400",
          icon: "text-blue-600 dark:text-blue-300",
          label: "text-blue-700 dark:text-blue-300",
          value: "text-blue-950 dark:text-blue-100",
        },
      },
    ],
    [statLookup],
  );

  const pendingCount = summaryCards[0].value;

  const { data, isLoading, refetch } = useGetUrgentSlips({
    page: currentPage,
    search: debouncedSearch,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const { mutate: updateSlipStatus, isPending: isUpdating } =
    useUpdateSlipStatus();

  const slips = data?.slips || [];
  const totalPages = data?.totalPages || 1;

  const handleViewSlip = (slip: Slip) => {
    setSelectedSlip(slip);
    setIsModalOpen(true);
  };

  const handleApprove = (id: number) => {
    updateSlipStatus(
      { id, status: "Approved" },
      {
        onSuccess: () => {
          refetch();
          setIsModalOpen(false);
        },
      },
    );
  };

  const handleReject = (id: number, reason: string) => {
    updateSlipStatus(
      { id, status: "Rejected", adminNotes: reason },
      {
        onSuccess: () => {
          refetch();
          setIsModalOpen(false);
        },
      },
    );
  };

  const handleForRevision = (id: number, reason: string) => {
    updateSlipStatus(
      { id, status: "For Revision", adminNotes: reason },
      {
        onSuccess: () => {
          refetch();
          setIsModalOpen(false);
        },
      },
    );
  };

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-blue-500/10 border border-blue-300 rounded-lg p-4 shadow-sm">
        <p className="text-sm text-blue-600 dark:text-blue-300">
          <strong>Note:</strong> Students request excuse slips in their portal.
          This page allows you to review, approve, reject, or request revisions
          for those slips.
        </p>
      </div>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Review Excuse Slips
        </h1>
        <p className="text-sm text-muted-foreground">
          Review submissions, filter the queue, and process student requests.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="inline-flex w-fit flex-wrap items-center gap-1 rounded-xl border border-border bg-muted/40 p-1.5">
        {(["today", "week", "month"] as TimeFilter[]).map((filter) => (
          <Button
            key={filter}
            variant={timeFilter === filter ? "default" : "ghost"}
            onClick={() => {
              setTimeFilter(filter);
              setCurrentPage(1);
            }}
            className="h-12 min-w-[132px] px-5 border-0 shadow-none rounded-lg"
          >
            {getFilterLabel(filter)}
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        onClick={() => navigate("/admin/slip-logs")}
        className="h-12 min-w-[160px] px-5 gap-2 border-border bg-background shadow-sm rounded-xl"
      >
        <Archive className="h-4 w-4" />
        View All Logs
      </Button>
     </div>
    </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      <Card className="xl:col-span-4 overflow-hidden border-0 shadow-sm ring-1 ring-amber-200/80 bg-gradient-to-br from-amber-50/90 via-background to-background dark:from-amber-950/20 dark:to-background">
      <div className="h-1.5 bg-amber-400" />
      <CardContent className="p-5 min-h-[165px] flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
              Pending Approvals
            </p>
            <p className="text-sm text-muted-foreground">
              Slips waiting for review in the selected time range.
            </p>
          </div>

          <Badge
            variant="secondary"
            className="whitespace-nowrap bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200"
          >
            {getFilterLabel(timeFilter)}
          </Badge>
        </div>

        <div className="space-y-2">
          <p className="text-5xl font-bold tracking-tight text-amber-950 dark:text-amber-100">
            {pendingCount}
          </p>
          <p className="text-sm text-muted-foreground">
            {pendingCount === 1 ? "slip" : "slips"} awaiting review
          </p>
        </div>
      </CardContent>
    </Card>

      <div className="xl:col-span-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {summaryCards.slice(1).map((card) => {
        const Icon = card.icon;

        const helperText =
          card.label === "Approved"
            ? "Processed successfully"
            : card.label === "Rejected"
              ? "Needs follow-up"
              : "Requires student update";

        return (
          <Card
            key={card.key}
            className={`overflow-hidden border-0 shadow-sm ring-1 ${card.tone.wrapper}`}
          >
            <div className={`h-1.5 ${card.tone.strip}`} />

            <CardContent className="p-5 min-h-[165px] flex flex-col justify-between">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p
                    className={`text-xs font-semibold uppercase tracking-[0.16em] ${card.tone.label}`}
                  >
                    {card.label}
                  </p>

                  <p className="text-sm text-muted-foreground">{helperText}</p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/70 shadow-sm">
                  <Icon className={`h-5 w-5 ${card.tone.icon}`} />
                </div>
              </div>

              <div className="flex items-end justify-between gap-3">
                <p className={`text-5xl font-bold leading-none ${card.tone.value}`}>
                  {card.value}
                </p>

                <span className="text-xs text-muted-foreground">total</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
    </div>

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