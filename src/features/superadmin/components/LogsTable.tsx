import { useState, useMemo } from "react";
import { Search, Filter, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import type { SystemLog, SystemLogsParams, SystemLogsResponse } from "../types";
import type { UseQueryResult } from "@tanstack/react-query";

interface LogsTableProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  useLogsHook: (
    params?: SystemLogsParams,
  ) => UseQueryResult<SystemLogsResponse>;
  actionOptions: string[];
  showIPAddress?: boolean;
}

const ACTION_BADGE_COLORS: Record<string, string> = {
  LOGIN_SUCCESS:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  LOGIN_FAILED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  ACCESS_DENIED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  RATE_LIMIT_EXCEEDED:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  INVALID_TOKEN: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  API_KEY_INVALID:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  LOGOUT:
    "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
  TOKEN_REFRESHED:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  API_KEY_USED:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  API_KEY_CREATED:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  API_KEY_REVOKED:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  SETTING_CHANGED:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  USER_CREATED:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  USER_UPDATED:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  USER_DELETED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  ROLE_CHANGED:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  SLIP_CREATED:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  SLIP_STATUS_UPDATED:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  APPOINTMENT_CREATED:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  APPOINTMENT_UPDATED:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  STUDENT_RECORD_CREATED:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  STUDENT_RECORD_UPDATED:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

const PAGE_SIZE = 20;

export default function LogsTable({
  title,
  icon,
  description,
  useLogsHook,
  actionOptions,
  showIPAddress = false,
}: LogsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 500);

  const params = useMemo<SystemLogsParams>(() => {
    const p: SystemLogsParams = {
      page: currentPage,
      page_size: PAGE_SIZE,
    };
    if (debouncedSearch) p.search = debouncedSearch;
    if (actionFilter) p.action = actionFilter;
    if (startDate) p.start_date = startDate;
    if (endDate) p.end_date = endDate;
    return p;
  }, [currentPage, debouncedSearch, actionFilter, startDate, endDate]);

  const { data, isLoading, refetch, isFetching } = useLogsHook(params);

  const logs = useMemo(() => data?.logs ?? [], [data]);
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatAction = (action: string) =>
    action.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  // HIGHLIGHT 
  const highlightText = (text: string, query: string) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));

    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span
          key={index}
          className="bg-yellow-200 dark:bg-yellow-500/20 text-black dark:text-yellow-200 px-1 rounded"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleReset = () => {
    setSearchTerm("");
    setActionFilter("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-2"
          >
            <RefreshCw
              size={14}
              className={isFetching ? "animate-spin" : ""}
            />
            Refresh
          </Button>
          <Button
            variant={
              showFilters || actionFilter || startDate || endDate
                ? "default"
                : "outline"
            }
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter size={14} />
            Filters
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardContent className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Action
                </label>
                <select
                  value={actionFilter}
                  onChange={(e) => {
                    setActionFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">All Actions</option>
                  {actionOptions.map((action) => (
                    <option key={action} value={action}>
                      {formatAction(action)}
                    </option>
                  ))}
                </select>
              </div>

              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

              <div className="flex items-end">
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-base">
              {icon}
              {total > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {total.toLocaleString()} entries
                </Badge>
              )}
            </CardTitle>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className={`pl-9 transition-colors ${
                  searchTerm
                    ? "border-primary/50 focus-visible:ring-primary"
                    : ""
                }`}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 rounded-md bg-muted animate-pulse" />
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="font-medium">No log entries found</p>
              <p className="text-sm mt-1">
                Try adjusting filters or clear them to see results
              </p>

              {(actionFilter || startDate || endDate) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="mt-3"
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10 bg-background">
                  <tr className="border-b border-t text-left bg-muted/30">
                    <th className="px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">
                      Timestamp
                    </th>
                    <th className="px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">
                      Action
                    </th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">
                      Message
                    </th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">
                      Actor
                    </th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">
                      Target
                    </th>
                    {showIPAddress && (
                      <th className="px-4 py-3 font-medium text-muted-foreground">
                        IP Address
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-border/60">
                  {logs.map((log: SystemLog) => (
                    <tr
                      key={log.id}
                      className="hover:bg-muted/60 hover:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.03)] dark:hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] transition-colors duration-150"
                    >
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap font-mono">
                        {formatDate(log.createdAt)}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-block text-xs font-medium px-2 py-1 rounded-md ${
                            ACTION_BADGE_COLORS[log.action] ??
                            "bg-muted text-muted-foreground"
                          }`}
                        >
                          {formatAction(log.action)}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-sm max-w-[420px] line-clamp-2 leading-snug">
                        {highlightText(log.message, debouncedSearch)}
                      </td>

                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {log.userEmail
                          ? highlightText(log.userEmail, debouncedSearch)
                          : "—"}
                      </td>

                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {log.targetEmail
                          ? highlightText(log.targetEmail, debouncedSearch)
                          : "—"}
                      </td>

                      {showIPAddress && (
                        <td className="px-4 py-3">
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                            {log.ipAddress || "—"}
                          </code>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              isLoading={isLoading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}