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
        title: "Pending Approvals",
        label: "Pending",
        helperText: "Slips waiting for review in the selected time range.",
        value: statLookup.get("pending") ?? 0,
        icon: Clock3,
        tone: {
          border: "border-amber-500/40",
          label: "text-amber-600",
          value: "text-foreground",
          icon: "text-amber-500",
          iconWrap: "border border-amber-500/20 bg-amber-500/10",
          badge: "border border-amber-500/20 bg-amber-500/10 text-amber-600",
        },
      },
      {
        key: "approved",
        title: "Approved",
        label: "Approved",
        helperText: "Processed successfully",
        value: statLookup.get("approved") ?? 0,
        icon: CheckCircle2,
        tone: {
          border: "border-emerald-500/40",
          label: "text-emerald-600",
          value: "text-foreground",
          icon: "text-emerald-500",
          iconWrap: "border border-emerald-500/20 bg-emerald-500/10",
        },
      },
      {
        key: "rejected",
        title: "Rejected",
        label: "Rejected",
        helperText: "Needs follow-up",
        value: statLookup.get("rejected") ?? 0,
        icon: XCircle,
        tone: {
          border: "border-rose-500/40",
          label: "text-rose-600",
          value: "text-foreground",
          icon: "text-rose-500",
          iconWrap: "border border-rose-500/20 bg-rose-500/10",
        },
      },
      {
        key: "for-revision",
        title: "For Revision",
        label: "For Revision",
        helperText: "Requires student update",
        value: statLookup.get("for revision") ?? 0,
        icon: RotateCcw,
        tone: {
          border: "border-blue-500/40",
          label: "text-blue-600",
          value: "text-foreground",
          icon: "text-blue-500",
          iconWrap: "border border-blue-500/20 bg-blue-500/10",
        },
      },
    ],
    [statLookup],
  );

  const pendingCard = summaryCards[0];
  const otherCards = summaryCards.slice(1);

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

  const controlClass =
    "h-11 min-w-[152px] rounded-xl px-4 shadow-sm border-border";

  const statCardBase =
    "overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-4 duration-300 lg:space-y-5">
      <div className="rounded-lg border border-blue-300 bg-blue-500/10 px-4 py-3.5 shadow-sm">
        <p className="text-sm text-blue-600">
          <strong>Note:</strong> Students request excuse slips in their portal.
          This page allows you to review, approve, reject, or request revisions
          for those slips.
        </p>
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-[2rem]">
            Review Excuse Slips
          </h1>
          <p className="text-sm text-muted-foreground">
            Review submissions, filter the queue, and process student requests.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
          {(["today", "week", "month"] as TimeFilter[]).map((filter) => (
            <Button
              key={filter}
              variant={timeFilter === filter ? "default" : "outline"}
              onClick={() => {
                setTimeFilter(filter);
                setCurrentPage(1);
              }}
              className={controlClass}
            >
              {getFilterLabel(filter)}
            </Button>
          ))}

          <Button
            variant="outline"
            onClick={() => navigate("/admin/admission-slips/logs")}
            className={`${controlClass} gap-2`}
          >
            <Archive className="h-4 w-4" />
            View All Logs
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-12">
        <Card
          className={`${statCardBase} xl:col-span-4 ${pendingCard.tone.border}`}
        >
          <CardContent className="flex min-h-[156px] flex-col justify-between p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className={`text-sm font-semibold ${pendingCard.tone.label}`}>
                  {pendingCard.title}
                </p>
                <p className="max-w-[34ch] text-sm text-muted-foreground">
                  {pendingCard.helperText}
                </p>
              </div>

              <Badge
                variant="outline"
                className={`whitespace-nowrap rounded-full ${pendingCard.tone.badge}`}
              >
                {getFilterLabel(timeFilter)}
              </Badge>
            </div>

            <div className="space-y-1.5">
              <p
                className={`text-4xl font-bold tracking-tight lg:text-5xl ${pendingCard.tone.value}`}
              >
                {pendingCard.value}
              </p>
              <p className="text-sm text-muted-foreground">
                {pendingCard.value === 1 ? "slip" : "slips"} awaiting review
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:col-span-8 xl:grid-cols-3">
          {otherCards.map((card) => {
            const Icon = card.icon;

            return (
              <Card
                key={card.key}
                className={`${statCardBase} ${card.tone.border}`}
              >
                <CardContent className="flex min-h-[156px] flex-col justify-between p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className={`text-sm font-semibold ${card.tone.label}`}>
                        {card.label}
                      </p>
                      <p className="max-w-[22ch] text-sm text-muted-foreground">
                        {card.helperText}
                      </p>
                    </div>

                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.tone.iconWrap}`}
                    >
                      <Icon className={`h-5 w-5 ${card.tone.icon}`} />
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-3">
                    <p
                      className={`text-4xl font-bold leading-none lg:text-5xl ${card.tone.value}`}
                    >
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