import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  RefreshCw,
  CalendarRange,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import Layout from "@/components/layout/Layout";
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
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  LOGIN_FAILED:
    "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400",
  ACCESS_DENIED:
    "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400",
  RATE_LIMIT_EXCEEDED:
    "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  INVALID_TOKEN:
    "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400",
  API_KEY_INVALID:
    "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400",
  LOGOUT:
    "border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-400",
  TOKEN_REFRESHED:
    "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400",
  API_KEY_USED:
    "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400",
  API_KEY_CREATED:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  API_KEY_REVOKED:
    "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400",
  SETTING_CHANGED:
    "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  USER_CREATED:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  USER_UPDATED:
    "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400",
  USER_DELETED:
    "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400",
  ROLE_CHANGED:
    "border-purple-500/20 bg-purple-500/10 text-purple-700 dark:text-purple-400",
  SLIP_CREATED:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  SLIP_STATUS_UPDATED:
    "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400",
  APPOINTMENT_CREATED:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  APPOINTMENT_UPDATED:
    "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400",
  STUDENT_RECORD_CREATED:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  STUDENT_RECORD_UPDATED:
    "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400",
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
  const hasActiveFilters = Boolean(actionFilter || startDate || endDate);

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

  const highlightText = (text: string, query: string) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));

    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span
          key={index}
          className="rounded-md bg-yellow-200 px-1 text-black dark:bg-yellow-500/20 dark:text-yellow-200"
        >
          {part}
        </span>
      ) : (
        part
      ),
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
    <Layout
      title={title}
      isLoading={isLoading}
    >
      <div className="mx-auto w-full max-w-[1700px] space-y-5">
        <section className="relative overflow-hidden rounded-[20px] border border-white/20 bg-white/50 p-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_8px_24px_rgba(0,0,0,0.25)] sm:p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.08),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_24%)]" />

          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]">
                <Sparkles className="h-3.5 w-3.5" />
                Monitoring Module
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {title}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                  {description}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="h-10 rounded-xl border-white/30 bg-white/60 px-4 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]"
              >
                <RefreshCw
                  size={14}
                  className={`mr-2 ${isFetching ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>

              <Button
                variant={showFilters || hasActiveFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={
                  showFilters || hasActiveFilters
                    ? "h-10 rounded-xl px-4"
                    : "h-10 rounded-xl border-white/30 bg-white/60 px-4 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]"
                }
              >
                <Filter size={14} className="mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </section>

        {showFilters && (
          <Card className="rounded-[18px] border border-white/20 bg-white/45 shadow-[0_8px_22px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
            <CardContent className="p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Action
                  </label>
                  <select
                    value={actionFilter}
                    onChange={(e) => {
                      setActionFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="h-10 w-full rounded-xl border border-white/30 bg-white/70 px-3 text-sm outline-none backdrop-blur-md transition-colors focus:border-primary/40 dark:border-white/10 dark:bg-white/[0.04]"
                  >
                    <option value="">All Actions</option>
                    {actionOptions.map((action) => (
                      <option key={action} value={action}>
                        {formatAction(action)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="start-date"
                    className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    Start Date
                  </label>
                  <div className="relative">
                    <CalendarRange className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="h-10 rounded-xl border-white/30 bg-white/70 pl-10 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="end-date"
                    className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    End Date
                  </label>
                  <div className="relative">
                    <CalendarRange className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="h-10 rounded-xl border-white/30 bg-white/70 pl-10 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04]"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="h-10 rounded-xl px-4"
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="overflow-hidden rounded-[20px] border border-white/20 bg-white/45 shadow-[0_8px_22px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
          <CardHeader className="border-b border-white/20 pb-4 dark:border-white/10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/30 bg-white/70 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]">
                    {icon}
                  </span>
                  <span>{title}</span>
                </CardTitle>

                {total > 0 && (
                  <Badge
                    variant="secondary"
                    className="rounded-full border border-white/30 bg-white/70 px-3 py-1 text-xs backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]"
                  >
                    {total.toLocaleString()} entries
                  </Badge>
                )}
              </div>

              <div className="relative w-full lg:w-80">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className={`h-10 rounded-xl border-white/30 bg-white/70 pl-10 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04] ${
                    searchTerm ? "border-primary/40" : ""
                  }`}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/30 bg-white/60 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]">
                {icon}
              </div>

              <p className="text-lg font-semibold text-foreground">
                No log entries found
              </p>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Try adjusting your filters or clear them to load more results.
              </p>

              {(hasActiveFilters || searchTerm) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="mt-4 rounded-xl"
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-sm">
                <thead className="sticky top-0 z-10">
                  <tr className="border-b border-white/20 bg-white/55 text-left backdrop-blur-md dark:border-white/10 dark:bg-white/[0.03]">
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Timestamp
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Action
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Message
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Actor
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Target
                    </th>
                    {showIPAddress && (
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        IP Address
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {logs.map((log: SystemLog) => (
                    <tr
                      key={log.id}
                      className="border-b border-white/10 transition-colors duration-150 hover:bg-white/40 dark:hover:bg-white/[0.03]"
                    >
                      <td className="whitespace-nowrap px-5 py-4 text-xs font-medium text-muted-foreground">
                        {formatDate(log.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                            ACTION_BADGE_COLORS[log.action] ??
                            "border-white/20 bg-white/40 text-muted-foreground dark:bg-white/[0.04]"
                          }`}
                        >
                          {formatAction(log.action)}
                        </span>
                      </td>

                      <td className="max-w-[460px] px-5 py-4 text-sm leading-relaxed text-foreground">
                        <div className="line-clamp-2">
                          {highlightText(log.message, debouncedSearch)}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {log.userEmail
                          ? highlightText(log.userEmail, debouncedSearch)
                          : "—"}
                      </td>

                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {log.targetEmail
                          ? highlightText(log.targetEmail, debouncedSearch)
                          : "—"}
                      </td>

                      {showIPAddress && (
                        <td className="px-5 py-4">
                          <code className="rounded-lg border border-white/20 bg-white/55 px-2 py-1 text-xs text-foreground dark:border-white/10 dark:bg-white/[0.04]">
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
            <div className="border-t border-white/20 px-4 py-4 dark:border-white/10">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                isLoading={isLoading}
              />
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </Layout>
  );
}
