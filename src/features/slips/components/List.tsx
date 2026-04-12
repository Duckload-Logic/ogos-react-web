import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SearchInput, Dropdown } from "@/components/form";
import { useMemo } from "react";
import { Pagination } from "@/components/shared";
import { STATUS_COLORS } from "@/config/constants";
import { Eye, Calendar, Tag, Inbox, User } from "lucide-react";
import type { Slip } from "../types";
import { formatDate } from "@/features/schedules/utils/formatters";
import { Spinner } from "@/components/shared";
import { SlipStatus, SlipStats } from "../types";

interface SlipListProps {
  title?: string;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  statuses: SlipStatus[];
  selectedStatus: SlipStatus;
  statusCounts: SlipStats[];
  onStatusChange: (status: SlipStatus) => void;
  slips: Slip[];
  isLoading?: boolean;
  onViewClick: (slip: Slip) => void;
  currentPage: number;
  onPageChange: (p: number) => void;
  totalPages?: number;
  className?: string;
}

export function SlipList({
  title = "Submitted Excuse Slips",
  searchTerm = "",
  onSearchChange,
  statuses,
  selectedStatus,
  statusCounts,
  onStatusChange,
  slips,
  isLoading = false,
  onViewClick,
  currentPage,
  onPageChange,
  totalPages = 1,
  className,
}: SlipListProps) {
  const statMap = useMemo(() => {
    const map: Record<string | number, SlipStats> = {};
    (statusCounts || []).forEach((sc) => {
      map[sc.id] = sc;
    });
    return map;
  }, [statusCounts]);

  const dropdownOptions = useMemo(() => {
    return (statuses || []).map(s => ({
      ...s,
      displayName: String(s.id) === "0" ? "All Statuses" : `${s.name} (${statMap[s.id]?.count || 0})`
    }));
  }, [statuses, statMap]);

  return (
    <Card className={`border-glass-border bg-glass-bg/40 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden transition-all duration-500 hover:bg-glass-bg/50 ${className || ""}`}>
      <CardHeader className="border-b border-glass-border/30 px-8 py-7 space-y-6 bg-muted/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5 text-left">
            <h2 className="text-xl font-bold tracking-tight text-foreground/90">{title}</h2>
          </div>

          {!isLoading && slips.length > 0 && (
            <div className="rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[10px] font-bold tracking-wide text-primary self-start shadow-sm">
              {slips.length} Record{slips.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full items-center">
          <SearchInput
            placeholder="Search by student name or reason..."
            searchTerm={searchTerm}
            onSearchChange={onSearchChange!}
            className="w-full border-glass-border/40 focus:bg-glass-bg/60 rounded-2xl"
            hasHeader={false}
          />

          <div className="w-full sm:w-64">
            <Dropdown
              options={dropdownOptions}
              value={selectedStatus?.id}
              onChange={(val) => {
                const status = statuses.find(s => String(s.id) === String(val));
                if (status) onStatusChange(status);
              }}
              labelKey="displayName"
              enabled={!isLoading}
              formStyle={false}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1">
        {isLoading ? (
          <div className="flex min-h-[320px] items-center justify-center px-4 text-center">
            <p className="text-muted-foreground">
              <Spinner size="sm" message="Loading excuse slips" />
            </p>
          </div>
        ) : slips.length === 0 ? (
          <div className="flex min-h-[340px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <Inbox className="h-6 w-6 text-muted-foreground" />
            </div>

            <h3 className="text-lg font-semibold text-foreground">
              No excuse slips found
            </h3>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              There are no submissions for the current filters yet. Try changing
              the time range or search term.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto px-3 py-3">
              <table className="w-full text-sm border-separate border-spacing-y-2">
                <thead className="text-muted-foreground text-[10px] font-bold tracking-wide opacity-60">
                  <tr>
                    <th className="px-6 py-4 text-left">Student Name</th>
                    <th className="px-6 py-4 text-left">Absence Date</th>
                    <th className="px-6 py-4 text-left">Date Needed</th>
                    <th className="px-4 py-4 text-left">Category</th>
                    <th className="px-4 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-right pr-10">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {slips.map((slip) => (
                    <tr
                      key={slip.id}
                      className="group rounded-[20px] bg-glass-bg/20 backdrop-blur-sm border border-glass-border/20 shadow-sm transition-all duration-300 hover:bg-glass-bg/60 hover:shadow-xl hover:scale-[1.005] hover:border-primary/20"
                    >
                      <td className="px-6 py-6 text-foreground font-bold text-sm rounded-l-[20px] tracking-tight">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shadow-inner">
                            {slip.user?.firstName?.[0]}
                            {slip.user?.lastName?.[0]}
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-bold text-foreground truncate">
                              {slip.user?.firstName} {slip.user?.lastName}
                            </p>
                            <p className="text-[10px] text-muted-foreground truncate opacity-70">
                              {slip.user?.email || "-"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-6 transition-all">
                        <div className="flex items-center gap-2 text-xs font-bold text-foreground/80 tracking-wide">
                          <Calendar className="w-3.5 h-3.5 text-primary/60" />
                          {formatDate(slip.dateOfAbsence)}
                        </div>
                      </td>

                      <td className="px-6 py-6 transition-all">
                        <div className="flex items-center gap-2 text-xs font-bold text-foreground/80 tracking-wide">
                          <Calendar className="w-3.5 h-3.5 text-primary/60" />
                          {formatDate(slip.dateNeeded)}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-foreground border border-glass-border/20 rounded-full w-fit px-2.5 py-1 bg-muted/20 tracking-tight">
                          <Tag className="w-3 h-3 text-muted-foreground/60" />
                          <span className="max-w-[140px] truncate">
                            {slip.category?.name || "-"}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[slip.status?.colorKey || "stale"]}`}
                        >
                          {slip.status?.name || "-"}
                        </span>
                      </td>

                      <td className="px-6 py-4 rounded-r-[20px]">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onViewClick(slip)}
                          className="gap-2 rounded-full px-4 font-bold shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="block md:hidden space-y-4 px-4 pb-6">
              {slips.map((slip) => (
                <div
                  key={slip.id}
                  className="p-6 space-y-4 bg-glass-bg/20 backdrop-blur-md rounded-3xl border border-glass-border/20 shadow-sm transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 text-foreground font-bold text-sm">
                      <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <span className="tracking-tight">
                        {slip.user?.firstName} {slip.user?.lastName}
                      </span>
                    </div>

                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${STATUS_COLORS[slip.status?.colorKey || "stale"]}`}
                    >
                      {slip.status?.name || "-"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-[10px] font-bold">
                    <div className="flex items-center gap-2 text-muted-foreground/80 bg-muted/20 px-3 py-2 rounded-xl border border-glass-border/10">
                      <Calendar className="w-3.5 h-3.5 text-primary/60" />
                      <span>{formatDate(slip.dateOfAbsence)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground/80 bg-muted/20 px-3 py-2 rounded-xl border border-glass-border/10">
                      <Tag className="w-3.5 h-3.5 text-primary/60" />
                      <span>{slip.category?.name || "-"}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewClick(slip)}
                      className="w-full gap-2 rounded-2xl border-primary/20 bg-primary/5 text-primary font-bold tracking-wide text-[10px] h-11"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Access Interface
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>

      <div className="border-t border-border p-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </Card>
  );
}
