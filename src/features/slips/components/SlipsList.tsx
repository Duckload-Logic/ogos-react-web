import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchInput } from "@/components/form";
import Pagination from "@/components/Pagination";
import { STATUS_COLORS } from "@/config/constants";
import { Eye, Calendar, Tag, Inbox } from "lucide-react";
import type { Slip } from "../types/slip";
import { formatDate } from "@/features/schedules/utils/formatters";

interface SlipsListProps {
  title?: string;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  slips: Slip[];
  isLoading?: boolean;
  onViewClick: (slip: Slip) => void;
  currentPage: number;
  onPageChange: (p: number) => void;
  totalPages?: number;
}

export function SlipsList({
  title = "Submitted Excuse Slips",
  searchTerm = "",
  onSearchChange,
  slips,
  isLoading = false,
  onViewClick,
  currentPage,
  onPageChange,
  totalPages = 1,
}: SlipsListProps) {
  return (
    <Card className="overflow-hidden border border-border shadow-sm">
      <div className="border-b border-border bg-muted/45 px-6 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground">
              Search submissions and open any slip for review.
            </p>
          </div>

          {!isLoading && slips.length > 0 && (
            <div className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground self-start">
              {slips.length} result{slips.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        {onSearchChange && (
          <div className="mt-4">
            <SearchInput
              placeholder="Search by student name or reason..."
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
              hasHeader={false}
              className="w-full"
            />
          </div>
        )}
      </div>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex min-h-[320px] items-center justify-center px-4 text-center">
            <p className="text-muted-foreground">Loading slips...</p>
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
                <thead className="text-muted-foreground text-[11px] uppercase tracking-[0.12em]">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Student</th>
                    <th className="px-4 py-3 text-left font-medium">Absence Date</th>
                    <th className="px-4 py-3 text-left font-medium">Date Needed</th>
                    <th className="px-4 py-3 text-left font-medium">Category</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {slips.map((slip) => (
                    <tr
                      key={slip.id}
                      className="rounded-xl bg-background shadow-sm ring-1 ring-border transition-colors duration-200 hover:bg-muted/20"
                    >
                      <td className="px-4 py-4 rounded-l-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                            {slip.user?.firstName?.[0]}
                            {slip.user?.lastName?.[0]}
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {slip.user?.firstName} {slip.user?.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {slip.user?.email || "-"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-sm text-foreground whitespace-nowrap">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {formatDate(slip.dateOfAbsence)}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-sm text-foreground whitespace-nowrap">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {formatDate(slip.dateNeeded)}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-sm text-foreground border border-border rounded-full w-fit px-2.5 py-1 bg-muted/20">
                          <Tag className="w-4 h-4 text-muted-foreground" />
                          <span className="max-w-[160px] truncate">
                            {slip.category?.name || "-"}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`border ${STATUS_COLORS[slip.status?.colorKey || "stale"]} text-xs font-semibold px-2.5 py-1 rounded-full`}
                        >
                          {slip.status?.name || "-"}
                        </span>
                      </td>

                      <td className="px-4 py-4 rounded-r-xl">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onViewClick(slip)}
                          className="gap-2 rounded-full px-3"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="block md:hidden divide-y divide-border">
              {slips.map((slip) => (
                <div key={slip.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {slip.user?.firstName} {slip.user?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {slip.user?.email || "-"}
                      </p>
                    </div>

                    <span
                      className={`border ${STATUS_COLORS[slip.status?.colorKey || "stale"]} text-xs font-semibold px-2 py-1 rounded-full shrink-0`}
                    >
                      {slip.status?.name || "-"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Absence: {formatDate(slip.dateOfAbsence)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Needed: {formatDate(slip.dateNeeded)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Tag className="w-4 h-4" />
                      <span>{slip.category?.name || "-"}</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewClick(slip)}
                    className="gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Slip
                  </Button>
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