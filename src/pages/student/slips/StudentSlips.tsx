import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  FileText,
  Plus,
  Tag,
  MoreHorizontal,
  Eye,
  FileX,
  Download,
  FileUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimationStyles } from "@/components/ui/animations";
import { STATUS_COLORS } from "@/config/constants";
import {
  useGetMySlips,
  useGetSlipStats,
  useGetSlipStatuses,
} from "@/features/slips/hooks";
import { Slip, SlipStatus } from "@/features/slips/types";
import { Pagination, Spinner } from "@/components/shared";
import { usePageMetadata } from "@/context";
import { cn } from "@/lib/utils";

interface StatusCount {
  id: string | number;
  name: string;
  colorKey: string;
  count: number;
}

const GLASS_CARD =
  "overflow-hidden rounded-[18px] border border-white/20 bg-white/45 shadow-[0_8px_22px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]";

export default function StudentSlips() {
  const navigate = useNavigate();
  const { data: slipStatuses = [] } = useGetSlipStatuses();
  const filterStatuses = [
    { id: "0", name: "All", colorKey: "stale" },
    ...slipStatuses,
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<SlipStatus | any>(
    filterStatuses[0],
  );

  const { data, isLoading: isSlipsLoading } = useGetMySlips({
    page: currentPage,
    statusId: selectedStatus?.id === "0" ? undefined : selectedStatus?.id,
  });

  const { data: slipStats, isLoading: isStatsLoading } = useGetSlipStats({});
  const { isLoading: isStatusesLoading } = useGetSlipStatuses();

  const isLoading = isStatsLoading || isStatusesLoading;

  const statsWithAll = [
    {
      id: "0",
      name: "All",
      colorKey: "stale",
      count:
        slipStats?.reduce(
          (sum: number, stat: any) => sum + (stat.count || 0),
          0,
        ) || 0,
    },
    ...(slipStats || []),
  ];

  const slips = data?.slips || [];
  const statusCounts = (slipStats || []) as StatusCount[];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (colorKey: string) => {
    const key = colorKey as keyof typeof STATUS_COLORS;
    return STATUS_COLORS[key] || STATUS_COLORS.secondary;
  };

  const getStatAccent = (colorKey: string) => {
    switch (colorKey) {
      case "warning":
      case "yellow":
        return "from-amber-500/15 to-yellow-500/5 text-amber-700 dark:text-amber-300 border-amber-500/20";
      case "danger":
      case "red":
        return "from-rose-500/15 to-red-500/5 text-rose-700 dark:text-rose-300 border-rose-500/20";
      case "success":
      case "green":
        return "from-emerald-500/15 to-green-500/5 text-emerald-700 dark:text-emerald-300 border-emerald-500/20";
      case "purple":
      case "violet":
        return "from-violet-500/15 to-fuchsia-500/5 text-violet-700 dark:text-violet-300 border-violet-500/20";
      default:
        return "from-slate-500/15 to-slate-500/5 text-slate-700 dark:text-slate-300 border-slate-500/20";
    }
  };

  usePageMetadata({
    title: "My Admission Slips",
    description: "Manage your admission slip requests and track their status",
    badgeText: "My Requests",
    badgeIcon: <FileText className="h-4 w-4" />,
    isLoading,
    headerActions: (
      <Button
        asChild
        className="gap-2 rounded-xl shadow-lg shadow-primary/20"
      >
        <Link to="/student/slips/submit">
          <Plus className="h-4 w-4" />
          Submit Slip
        </Link>
      </Button>
    ),
  });

  return (
    <>
      <AnimationStyles />

      <div className="space-y-6">
        {/* Stats Cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {slipStatuses.map((stat: SlipStatus, index: number) => {
            const count =
              statusCounts?.find((s) => String(s.id) === String(stat.id))
                ?.count || 0;

            return (
              <Card
                key={stat.id}
                className={cn(
                  GLASS_CARD,
                  "animate-fade-in-up group transition-all duration-200 hover:-translate-y-0.5"
                )}
                style={{
                  animationDelay: `${0.08 * (index + 1)}s`,
                  animationFillMode: "both",
                }}
              >
                <CardContent className="relative p-5">
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-br opacity-90",
                      getStatAccent(stat.colorKey)
                    )}
                  />
                  <div className="relative flex items-start justify-between gap-4">
                    <div className="space-y-2.5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {stat.name}
                      </p>
                      <div className="space-y-1">
                        <p className="text-4xl font-bold tabular-nums tracking-tight text-foreground">
                          {count}
                        </p>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-white/70 backdrop-blur-md transition-transform duration-200 group-hover:scale-105 dark:bg-white/[0.06]",
                        getStatAccent(stat.colorKey).split(" ").pop()
                      )}
                    >
                      <FileUp className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* Main Content */}
        <Card className={cn(GLASS_CARD, "animate-fade-in-up overflow-hidden")}>
          {/* Filter Tabs */}
          <CardHeader className="border-b border-white/20 px-4 py-3 dark:border-white/10">
            <div className="scrollbar-hide flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {statsWithAll?.map((filter: any) => {
                const isActive =
                  String(selectedStatus.id) === String(filter.id);

                return (
                  <Button
                    key={filter.id}
                    onClick={() => {
                      setSelectedStatus(filter);
                      setCurrentPage(1);
                    }}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-3 text-xs font-medium transition-all duration-200",
                      isActive
                        ? "shadow-md shadow-primary/20"
                        : "hover:bg-white/60 dark:hover:bg-white/[0.06]"
                    )}
                  >
                    <span>{filter.name}</span>
                    <Badge
                      className={cn(
                        "flex h-5 min-w-[20px] items-center justify-center px-1.5 text-[10px] font-bold",
                        isActive
                          ? "bg-primary-foreground/40 text-primary-foreground"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                      )}
                    >
                      {filter?.count}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {isSlipsLoading ? (
              <div className="flex items-center justify-center py-16">
                <Spinner
                  size="md"
                  message="Loading your slips..."
                />
              </div>
            ) : slips.length > 0 ? (
              <div className="divide-y divide-white/20 dark:divide-white/10">
                {slips.map((slip: Slip, index: number) => (
                  <div
                    key={slip.id}
                    className={cn(
                      "animate-fade-in-up p-4 transition-colors duration-200",
                      "hover:bg-white/35 dark:hover:bg-white/[0.03] sm:p-5",
                    )}
                    style={{
                      animationDelay: `${0.05 * (index + 1)}s`,
                      animationFillMode: "both",
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Category Icon Card */}
                      <div
                        className={cn(
                          "hidden h-20 w-20 shrink-0 flex-col items-center",
                          "justify-center rounded-[18px] border border-white/20",
                          "bg-white/50 shadow-[0_8px_22px_rgba(15,23,42,0.05)]",
                          "backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]",
                          "sm:flex",
                        )}
                      >
                        <div
                          className={cn(
                            "mb-2 flex h-10 w-10 items-center justify-center rounded-xl",
                            "border border-primary/20 bg-primary/10 text-primary",
                            "backdrop-blur-md",
                          )}
                        >
                          <FileUp className="h-5 w-5" />
                        </div>
                        <span className="line-clamp-2 px-2 text-center text-[10px] font-bold text-primary">
                          {slip.category?.name || "N/A"}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "border-white/30 bg-white/60 text-xs font-medium",
                                  "backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]",
                                )}
                              >
                                <Tag className="mr-1 h-3 w-3" />
                                {slip.category?.name}
                              </Badge>

                              <Badge
                                className={cn(
                                  "text-xs hover:opacity-90",
                                  getStatusColor(slip.status?.colorKey || "")
                                )}
                              >
                                {slip.status?.name}
                              </Badge>
                            </div>

                            <p className="line-clamp-2 text-sm font-medium text-foreground">
                              {slip.reason}
                            </p>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0 rounded-xl hover:bg-white/60 dark:hover:bg-white/[0.06]"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className={cn(
                                "rounded-xl border-white/20 bg-white/85 backdrop-blur-xl",
                                "dark:border-white/10 dark:bg-[#111]/80",
                              )}
                            >
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/student/slips/${slip.id}`)
                                }
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/student/slips/${slip.id}`)
                                }
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Download Attachments
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Date Info */}
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{formatDate(slip.dateOfAbsence)}</span>
                          </div>
                          <span className="text-muted-foreground/40">•</span>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                              Needed by: {formatDate(slip.dateNeeded)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-10 sm:px-6 sm:py-12">
                <div className="mx-auto flex max-w-md flex-col items-center text-center">
                  <div
                    className={cn(
                      "mb-4 flex h-20 w-20 items-center justify-center rounded-full",
                      "border border-white/20 bg-white/60 backdrop-blur-md",
                      "dark:border-white/10 dark:bg-white/[0.05]",
                    )}
                  >
                    <FileX className="h-9 w-9 text-muted-foreground" />
                  </div>

                  <h3 className="mb-2 text-xl font-semibold text-foreground">
                    No slips found
                  </h3>

                  <p className="mb-6 text-sm text-muted-foreground">
                    {String(selectedStatus?.id) === "0"
                      ? "You haven't submitted any admission slips yet. Submit your first slip now."
                      : `No ${selectedStatus.name.toLowerCase()} slips found.`}
                  </p>

                  {String(selectedStatus?.id) === "0" && (
                    <Button
                      asChild
                      className="rounded-xl shadow-lg shadow-primary/20"
                    >
                      <Link to="/student/slips/submit">
                        <Plus className="mr-2 h-4 w-4" />
                        Submit Admission Slip
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            )}

            <Separator className="bg-white/20 dark:bg-white/10" />

            <Pagination
              currentPage={currentPage}
              totalPages={data?.totalPages || 1}
              onPageChange={(page) => setCurrentPage(page)}
              className="mt-0 border-t-0 px-4 py-3"
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
