import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: string;
  period?: string;
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  trend,
  period = "Last 30 days",
  icon: Icon,
  iconColor = "text-primary",
  className,
}: MetricCardProps) {
  return (
    <Card className={cn("overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1  backdrop-blur-md", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-xl bg-white/50 dark:bg-black/30 shadow-inner", iconColor)}>
                <Icon size={20} />
              </div>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 capitalize">
                {title}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {value}
              </h3>
              <div className="flex items-center gap-2">
                {trend && (
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    {trend}
                  </span>
                )}
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {period}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardMetrics({ metrics }: { metrics: MetricCardProps[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
}
