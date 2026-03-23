import React from "react";
import Breadcrumbs from "./Breadcrumbs";

interface PageHeaderProps {
  title: string;
  description?: string;
  badgeText?: string;
  badgeIcon?: React.ReactNode;
  headerActions?: React.ReactNode;
  headerStats?: React.ReactNode;
  showDate?: boolean;
}

export default function PageHeader({
  title,
  description,
  badgeText,
  badgeIcon,
  headerActions,
  headerStats,
  showDate = false,
}: PageHeaderProps) {
  const today = new Date();

  return (
    <section className="relative overflow-hidden rounded-[20px] border border-white/20 bg-glass-bg p-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-glass-bg dark:shadow-[0_8px_24px_rgba(0,0,0,0.25)] sm:p-6 mb-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.10),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_28%)]" />

      <Breadcrumbs />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          {badgeText && (
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]">
              {badgeIcon}
              {badgeText}
            </div>
          )}

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h1>
            {description && (
              <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
                {description}
              </p>
            )}
          </div>

          {showDate && (
            <p className="text-sm font-medium text-muted-foreground">
              {today.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
        </div>

        {(headerActions || headerStats) && (
          <div className="flex flex-wrap items-center gap-3">
            {headerStats}
            {headerActions}
          </div>
        )}
      </div>
    </section>
  );
}
