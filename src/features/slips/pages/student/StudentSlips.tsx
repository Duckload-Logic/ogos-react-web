import { useState } from "react";
import { Link } from "react-router-dom";
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
import { Slip, SlipStatus } from "@/features/slips/types/slip";
import Pagination from "@/components/Pagination";

interface StatusCount {
  id: string | number;
  name: string;
  colorKey: string;
  count: number;
}

export default function StudentSlips() {
  const { data: slipStatuses = [] } = useGetSlipStatuses();
  const filterStatuses = [
    { id: "0", name: "All", colorKey: "stale" },
    ...slipStatuses,
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<SlipStatus | any>(
    filterStatuses[0],
  );

  const { data } = useGetMySlips({
    page: currentPage,
    statusId: selectedStatus?.id === "0" ? undefined : selectedStatus?.id,
  });
  const { data: slipStats } = useGetSlipStats({});
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

  return (
    <>
      <AnimationStyles />
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-down">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              My Admission Slips
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Manage your admission slip requests and track their status
            </p>
          </div>
          <Button asChild className="gap-2">
            <Link to="/student/slips/submit">
              <Plus className="w-4 h-4" />
              Submit Slip
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up`}
        >
          {slipStatuses.map((stat: SlipStatus, index: number) => (
            <Card
              key={stat.id}
              className={`${STATUS_COLORS[stat.colorKey]} border-0 hover:shadow-md transition-shadow`}
              style={{ animationDelay: `${0.1 * (index + 1)}s`, animationFillMode: "both" }}
            >
              <CardContent className="py-4 px-4">
                <p className="text-xs font-medium uppercase tracking-wide">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-foreground mt-2">
                  {statusCounts?.find((s) => String(s.id) === String(stat.id))
                    ?.count || 0}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Card */}
        <Card className="border border-border shadow-sm overflow-hidden animate-fade-in-up">
          {/* Filter Tabs */}
          <CardHeader className="border-b border-border py-4 px-4 bg-gradient-to-r from-muted/30 to-muted/10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                {statsWithAll?.map((filter: any) => (
                  <button
                    key={filter.id}
                    onClick={() => {
                      setSelectedStatus(filter);
                      setCurrentPage(1);
                    }}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                      ${
                        String(selectedStatus.id) === String(filter.id)
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }
                    `}
                  >
                    {filter.name} <span className="ml-1 opacity-75">({filter?.count})</span>
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {slips.length > 0 ? (
              <>
                {/* Slips List */}
                <div className="divide-y divide-border">
                  {slips.map((slip: Slip, index: number) => (
                    <div
                      key={slip.id}
                      className="p-4 sm:p-5 hover:bg-muted/30 transition-colors animate-fade-in-up"
                      style={{ animationDelay: `${0.05 * (index + 1)}s`, animationFillMode: "both" }}
                    >
                      <div className="flex items-start gap-4">
                        {/* Category Badge */}
                        <div className="hidden sm:flex flex-col items-center justify-center w-20 h-20 bg-primary/10 rounded-lg shrink-0 border border-primary/20">
                          <FileUp className="w-7 h-7 text-primary mb-1.5" />
                          <span className="text-xs font-semibold text-primary text-center line-clamp-2">
                            {slip.category?.name || "N/A"}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge
                                  variant="outline"
                                  className="text-xs font-medium"
                                >
                                  <Tag className="w-3 h-3 mr-1" />
                                  {slip.category?.name}
                                </Badge>
                                <Badge
                                  className={`text-xs ${getStatusColor(
                                    slip.status?.colorKey || "",
                                  )} hover:opacity-80`}
                                >
                                  {slip.status?.name}
                                </Badge>
                              </div>
                              <p className="text-sm font-medium text-foreground line-clamp-2">
                                {slip.reason}
                              </p>
                            </div>

                            {/* Actions Dropdown */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="shrink-0 h-8 w-8"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="w-4 h-4 mr-2" />
                                  Download Attachments
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Date Info */}
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{formatDate(slip.dateOfAbsence)}</span>
                            </div>
                            <span className="text-muted-foreground/40">•</span>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Needed by: {formatDate(slip.dateNeeded)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="py-4 px-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={data?.totalPages || 1}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="p-4 bg-muted rounded-full mb-4">
                  <FileX className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  No slips found
                </h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
                  {String(selectedStatus?.id) === "0"
                    ? "You haven't submitted any admission slips yet. Submit your first slip now."
                    : `No ${selectedStatus.name.toLowerCase()} slips found.`}
                </p>
                {String(selectedStatus?.id) === "0" && (
                  <Button asChild>
                    <Link to="/student/slips/submit">
                      <Plus className="w-4 h-4 mr-2" />
                      Submit Admission Slip
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
