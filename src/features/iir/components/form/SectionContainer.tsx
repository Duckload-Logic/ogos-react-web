import React from "react";
import { LucideIcon } from "lucide-react";

interface SectionContainerProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}

export function SectionContainer({
  title,
  description,
  icon: Icon,
  children,
}: SectionContainerProps) {
  return (
    <div className="group mb-6 sm:mb-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative overflow-hidden bg-glass-bg/30 backdrop-blur-glass border border-glass-border/40 rounded-[24px] shadow-sm sm:shadow-md transition-all duration-500 hover:bg-glass-bg/90 dark:hover:bg-glass-bg/50 p-5 sm:p-8">
        {/* Subtle Gradient Accent */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-colors duration-500" />

        {title && (
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 relative">
            {Icon && (
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-inner group-hover:scale-105 transition-transform duration-500">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.5} />
              </div>
            )}
            <div className="flex flex-col">
              <h3 className="text-lg sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
                {title}
              </h3>
              {description && (
                <p className="text-[10px] sm:text-sm font-semibold text-neutral-500/80 dark:text-neutral-400/80 mt-0.5 tracking-tight uppercase">
                  {description}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="relative">
          {children}
        </div>
      </div>
    </div>
  );
}
