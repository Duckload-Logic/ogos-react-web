import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/form";
import Pagination from "@/components/Pagination";
import { STATUS_COLORS } from "@/config/constants";
import { Eye, Calendar, Tag } from "lucide-react";
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
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        {onSearchChange && (
          <SearchInput
            placeholder="Search by student name or reason..."
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
          />
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading slips...</p>
            </div>
          ) : slips.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">No excuse slips found.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Student
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Absence Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Date Needed
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {slips.map((slip) => (
                  <tr
                    key={slip.id}
                    className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary ">
                          {slip.user?.firstName?.[0]}
                          {slip.user?.lastName?.[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {/* @ts-ignore */}
                            {slip.user?.firstName} {slip.user?.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {/* @ts-ignore */}
                            {slip.user?.email || "-"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-foreground truncate">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {formatDate(slip.dateOfAbsence)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-foreground truncate">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {formatDate(slip.dateNeeded)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-foreground border border-border rounded-full w-fit px-2 py-1 truncate">
                        <Tag className="w-4 h-4 text-muted-foreground" />
                        {slip.category?.name || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-left">
                      <span
                        className={`border ${STATUS_COLORS[slip.status?.colorKey || "stale"]} text-xs font-semibold px-2 py-1 rounded-full truncate`}
                      >
                        {slip.status?.name || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewClick(slip)}
                        className="gap-2 bg-muted/50 hover:bg-secondary/80 transition-colors duration-300"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </CardContent>
    </Card>
  );
}
